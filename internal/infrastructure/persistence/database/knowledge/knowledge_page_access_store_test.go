package store

import (
	"database/sql"
	"slices"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func addPageMember(t *testing.T, store *Store, library agentsdk.KnowledgeLibrary, user, role string, manager agentsdk.Authority) agentsdk.KnowledgeLibrary {
	t.Helper()
	updated, err := store.SetKnowledgeLibraryMember(t.Context(), library.ID, user, agentsdk.KnowledgeLibraryMemberWrite{Role: role, ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	return updated
}

func setPageAccessFixture(t *testing.T, store *Store, libraryID, pageID, client string, revision int64, mode string, grants []knowledgesdk.KnowledgePageAccessGrant, manager agentsdk.Authority) knowledgesdk.KnowledgePageAccessPolicy {
	t.Helper()
	policy, err := store.SetKnowledgePageAccess(t.Context(), libraryID, pageID, knowledgesdk.KnowledgePageAccessWrite{ClientID: client, ExpectedRevision: revision, Mode: mode, Grants: grants}, manager)
	if err != nil {
		t.Fatal(err)
	}
	return policy
}

func markPageProjectionReady(t *testing.T, store *Store, libraryID, pageID string, authority agentsdk.Authority) {
	t.Helper()
	if err := store.transaction(t.Context(), func(tx *sql.Tx) error {
		page, err := store.pageRecord(t.Context(), tx, libraryID, pageID, authority)
		if err != nil {
			return err
		}
		return store.setPageProjectionStatus(t.Context(), tx, page, "ready", page.AccessRevision, authority)
	}); err != nil {
		t.Fatal(err)
	}
}

func TestKnowledgePageAccessModesGrantsManagerGovernanceAndStableToken(t *testing.T) {
	store, manager, library, root := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "editor", manager)
	library = addPageMember(t, store, library, "carol", "reader", manager)
	bob, carol := manager, manager
	bob.UserID, carol.UserID = "bob", "carol"
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "access-child", ParentPageID: root.Page.ID, Title: "子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}

	for _, tc := range []struct {
		authority agentsdk.Authority
		role      string
	}{
		{bob, "editor"}, {carol, "reader"}, {manager, "manager"},
	} {
		effective, accessErr := store.EvaluateKnowledgePageAccess(t.Context(), library.ID, root.Page.ID, tc.authority)
		if accessErr != nil || !effective.Allowed || effective.Role != tc.role || effective.Source != map[string]string{"manager": "manager", "editor": "library", "reader": "library"}[tc.role] {
			t.Fatalf("inherit access mismatch authority=%s effective=%+v err=%v", tc.authority.UserID, effective, accessErr)
		}
	}

	rootPolicy := setPageAccessFixture(t, store, library.ID, root.Page.ID, "restrict-root", 1, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: bob.UserID, Role: "editor", Scope: knowledgesdk.KnowledgePageGrantSubtree}}, manager)
	childPolicy := setPageAccessFixture(t, store, library.ID, child.Page.ID, "restrict-child", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)
	if rootPolicy.Mode != knowledgesdk.KnowledgePageAccessRestricted || childPolicy.Mode != knowledgesdk.KnowledgePageAccessRestricted {
		t.Fatal("restricted mode was not persisted")
	}
	effective, err := store.EvaluateKnowledgePageAccess(t.Context(), library.ID, child.Page.ID, bob)
	if err != nil || !effective.Allowed || effective.Role != "editor" || effective.Source != "ancestor_grant" || effective.GrantPageID != root.Page.ID || effective.GrantScope != knowledgesdk.KnowledgePageGrantSubtree {
		t.Fatalf("ancestor subtree grant not explained: %+v err=%v", effective, err)
	}
	effective, err = store.EvaluateKnowledgePageAccess(t.Context(), library.ID, child.Page.ID, carol)
	if err != nil || effective.Allowed || effective.Source != "restricted" {
		t.Fatalf("ungranted current member accessed restricted page: %+v err=%v", effective, err)
	}
	effective, err = store.EvaluateKnowledgePageAccess(t.Context(), library.ID, child.Page.ID, manager)
	if err != nil || !effective.Allowed || effective.Source != "manager" {
		t.Fatalf("manager governance access was lost: %+v err=%v", effective, err)
	}

	childPolicy = setPageAccessFixture(t, store, library.ID, child.Page.ID, "direct-child", childPolicy.Revision, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: carol.UserID, Role: "manager", Scope: knowledgesdk.KnowledgePageGrantPage}}, manager)
	effective, err = store.EvaluateKnowledgePageAccess(t.Context(), library.ID, child.Page.ID, carol)
	if err != nil || !effective.Allowed || effective.Role != "reader" || effective.Source != "direct_grant" {
		t.Fatalf("direct grant did not remain capped by library membership: %+v err=%v", effective, err)
	}

	for _, invalid := range []knowledgesdk.KnowledgePageAccessWrite{
		{ClientID: "bad-mode", ExpectedRevision: childPolicy.Revision, Mode: "allow"},
		{ClientID: "bad-scope", ExpectedRevision: childPolicy.Revision, Mode: knowledgesdk.KnowledgePageAccessRestricted, Grants: []knowledgesdk.KnowledgePageAccessGrant{{UserID: bob.UserID, Role: "reader", Scope: "tree"}}},
		{ClientID: "bad-member", ExpectedRevision: childPolicy.Revision, Mode: knowledgesdk.KnowledgePageAccessRestricted, Grants: []knowledgesdk.KnowledgePageAccessGrant{{UserID: "mallory", Role: "reader", Scope: knowledgesdk.KnowledgePageGrantPage}}},
	} {
		if _, err = store.SetKnowledgePageAccess(t.Context(), library.ID, child.Page.ID, invalid, manager); err == nil {
			t.Fatalf("invalid page ACL accepted: %+v", invalid)
		}
	}

	tokenBefore, _, err := store.KnowledgePageProjectionPermission(t.Context(), library.ID, child.Page.ID, manager)
	if err != nil || tokenBefore == "" {
		t.Fatalf("restricted page token missing: %q err=%v", tokenBefore, err)
	}
	childPolicy = setPageAccessFixture(t, store, library.ID, child.Page.ID, "rotate-grants", childPolicy.Revision, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: bob.UserID, Role: "reader", Scope: knowledgesdk.KnowledgePageGrantPage}}, manager)
	tokenAfter, revisionAfter, err := store.KnowledgePageProjectionPermission(t.Context(), library.ID, child.Page.ID, manager)
	if err != nil || tokenAfter != tokenBefore || revisionAfter != childPolicy.Revision {
		t.Fatalf("ACL revision changed stable page identity: before=%q after=%q revision=%d err=%v", tokenBefore, tokenAfter, revisionAfter, err)
	}

	if _, err = store.RemoveKnowledgeLibraryMember(t.Context(), library.ID, bob.UserID, library.Revision, manager); err != nil {
		t.Fatal(err)
	}
	policy, err := store.KnowledgePageAccess(t.Context(), library.ID, child.Page.ID, manager)
	if err != nil || slices.ContainsFunc(policy.Grants, func(grant knowledgesdk.KnowledgePageAccessGrant) bool { return grant.UserID == bob.UserID }) {
		t.Fatalf("removed member retained a grant: %+v err=%v", policy.Grants, err)
	}
}

func TestKnowledgePageAccessProjectionFailsClosedUntilExactACLReady(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "reader", manager)
	bob := manager
	bob.UserID = "bob"
	page = savePageFixture(t, store, manager, library, page, "access-body", "受限页面", "只有授权成员可见")
	page = publishPageFixture(t, store, manager, library, page, "access-publish")
	policy := setPageAccessFixture(t, store, library.ID, page.Page.ID, "access-restrict-published", 1, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: bob.UserID, Role: "reader", Scope: knowledgesdk.KnowledgePageGrantPage}}, manager)
	token := knowledgePagePermissionToken(manager, page.Page.ID)

	if ids, err := store.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); err != nil || len(ids) != 0 {
		t.Fatalf("queued ACL leaked a query token: ids=%v err=%v", ids, err)
	}
	origin := persistence.KnowledgePageProjectionOrigin{PageID: page.Page.ID, Version: page.Page.PublishedVersion, AccessRevision: policy.Revision, PermissionID: token}
	if err := store.ValidateKnowledgePageProjection(t.Context(), origin, library.ID, bob); err == nil {
		t.Fatal("queued remote ACL projection was treated as searchable")
	}
	markPageProjectionReady(t, store, library.ID, page.Page.ID, manager)
	if ids, err := store.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); err != nil || !slices.Equal(ids, []string{token}) {
		t.Fatalf("ready ACL did not expose exact current token: ids=%v err=%v", ids, err)
	}
	if err := store.ValidateKnowledgePageProjection(t.Context(), origin, library.ID, bob); err != nil {
		t.Fatalf("exact page/version/revision/token was rejected: %v", err)
	}
	for _, forged := range []persistence.KnowledgePageProjectionOrigin{
		{PageID: page.Page.ID, Version: origin.Version + 1, AccessRevision: origin.AccessRevision, PermissionID: origin.PermissionID},
		{PageID: page.Page.ID, Version: origin.Version, AccessRevision: origin.AccessRevision - 1, PermissionID: origin.PermissionID},
		{PageID: page.Page.ID, Version: origin.Version, AccessRevision: origin.AccessRevision, PermissionID: origin.PermissionID + "-forged"},
	} {
		if err := store.ValidateKnowledgePageProjection(t.Context(), forged, library.ID, bob); err == nil {
			t.Fatalf("forged page projection was accepted: %+v", forged)
		}
	}

	policy = setPageAccessFixture(t, store, library.ID, page.Page.ID, "access-revoke", policy.Revision, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)
	if ids, err := store.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); err != nil || len(ids) != 0 {
		t.Fatalf("local ACL tightening was not immediate: ids=%v err=%v", ids, err)
	}
	if err := store.ValidateKnowledgePageProjection(t.Context(), origin, library.ID, bob); err == nil {
		t.Fatal("revoked projection remained readable")
	}
	if policy.ProjectionStatus != "queued" {
		t.Fatalf("remote ACL reprojection was not required: %+v", policy)
	}
}

func TestKnowledgePageInheritProjectionAlsoUsesStableNonemptyPageToken(t *testing.T) {
	store, manager, library, page := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "reader", manager)
	bob := manager
	bob.UserID = "bob"
	page = savePageFixture(t, store, manager, library, page, "inherit-body", "继承页面", "所有库成员可见")
	page = publishPageFixture(t, store, manager, library, page, "inherit-publish")
	token, revision, err := store.KnowledgePageProjectionPermission(t.Context(), library.ID, page.Page.ID, manager)
	if err != nil || token == "" || token != knowledgePagePermissionToken(manager, page.Page.ID) || revision != page.Page.AccessRevision {
		t.Fatalf("inherit page did not receive its stable page token: token=%q revision=%d page=%+v err=%v", token, revision, page.Page, err)
	}
	if ids, tokenErr := store.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); tokenErr != nil || len(ids) != 0 {
		t.Fatalf("queued inherit projection leaked into search: ids=%v err=%v", ids, tokenErr)
	}
	markPageProjectionReady(t, store, library.ID, page.Page.ID, manager)
	if ids, tokenErr := store.KnowledgePagePermissionTokens(t.Context(), library.ID, bob); tokenErr != nil || !slices.Equal(ids, []string{token}) {
		t.Fatalf("authorized library member did not receive inherit page token: ids=%v err=%v", ids, tokenErr)
	}
	origin := persistence.KnowledgePageProjectionOrigin{PageID: page.Page.ID, Version: page.Page.PublishedVersion, AccessRevision: revision, PermissionID: token}
	if err = store.ValidateKnowledgePageProjection(t.Context(), origin, library.ID, bob); err != nil {
		t.Fatalf("valid inherit page identity was rejected: %v", err)
	}
}

func TestKnowledgePageMoveAccessImpactRequiresFreshManagerConfirmation(t *testing.T) {
	store, manager, library, moving := pageFixture(t)
	library = addPageMember(t, store, library, "bob", "editor", manager)
	library = addPageMember(t, store, library, "carol", "editor", manager)
	bob, carol := manager, manager
	bob.UserID, carol.UserID = "bob", "carol"
	oldParent, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "old-parent", Title: "旧父页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	newParent, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "new-parent", Title: "新父页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	oldPolicy := setPageAccessFixture(t, store, library.ID, oldParent.Page.ID, "old-parent-access", 1, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: bob.UserID, Role: "editor", Scope: knowledgesdk.KnowledgePageGrantSubtree}}, manager)
	newPolicy := setPageAccessFixture(t, store, library.ID, newParent.Page.ID, "new-parent-access", 1, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: carol.UserID, Role: "reader", Scope: knowledgesdk.KnowledgePageGrantSubtree}}, manager)
	moved, err := store.MoveKnowledgePage(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "move-under-old", ExpectedRevision: moving.Page.Revision, ParentPageID: oldParent.Page.ID, Rank: moving.Page.Rank}, manager)
	if err != nil {
		t.Fatal(err)
	}
	moving.Page = moved
	moving.Draft.DraftRevision++
	_ = setPageAccessFixture(t, store, library.ID, moving.Page.ID, "moving-restricted", 1, knowledgesdk.KnowledgePageAccessRestricted, nil, manager)

	preview, err := store.PreviewKnowledgePageMove(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMovePreview{ParentPageID: newParent.Page.ID, Rank: moving.Page.Rank}, manager)
	if err != nil || !preview.RequiresConfirm || preview.AffectedPages != 1 || !slices.Equal(preview.ChangedUserIDs, []string{"bob", "carol"}) || preview.Token == "" {
		t.Fatalf("move access impact was incomplete: %+v err=%v", preview, err)
	}
	if _, err = store.MoveKnowledgePage(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "move-without-confirm", ExpectedRevision: moving.Page.Revision, ParentPageID: newParent.Page.ID, Rank: moving.Page.Rank}, manager); err == nil || !strings.Contains(err.Error(), "page_move_access_confirmation_required") {
		t.Fatalf("access-changing move skipped second confirmation: %v", err)
	}

	newPolicy = setPageAccessFixture(t, store, library.ID, newParent.Page.ID, "new-parent-role-change", newPolicy.Revision, knowledgesdk.KnowledgePageAccessRestricted, []knowledgesdk.KnowledgePageAccessGrant{{UserID: carol.UserID, Role: "editor", Scope: knowledgesdk.KnowledgePageGrantSubtree}}, manager)
	if _, err = store.MoveKnowledgePage(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "move-stale-confirm", ExpectedRevision: moving.Page.Revision, ParentPageID: newParent.Page.ID, Rank: moving.Page.Rank, AccessImpactToken: preview.Token}, manager); err == nil || !strings.Contains(err.Error(), "page_move_access_confirmation_required") {
		t.Fatalf("stale access impact token survived concurrent ACL change: %v", err)
	}
	preview, err = store.PreviewKnowledgePageMove(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMovePreview{ParentPageID: newParent.Page.ID, Rank: moving.Page.Rank}, manager)
	if err != nil {
		t.Fatal(err)
	}
	moved, err = store.MoveKnowledgePage(t.Context(), library.ID, moving.Page.ID, knowledgesdk.KnowledgePageMove{ClientID: "move-confirmed", ExpectedRevision: moving.Page.Revision, ParentPageID: newParent.Page.ID, Rank: moving.Page.Rank, AccessImpactToken: preview.Token}, manager)
	if err != nil || moved.ParentPageID != newParent.Page.ID {
		t.Fatalf("fresh confirmed move failed: page=%+v err=%v", moved, err)
	}
	bobAccess, _ := store.EvaluateKnowledgePageAccess(t.Context(), library.ID, moving.Page.ID, bob)
	carolAccess, _ := store.EvaluateKnowledgePageAccess(t.Context(), library.ID, moving.Page.ID, carol)
	if bobAccess.Allowed || !carolAccess.Allowed || carolAccess.Role != "editor" || carolAccess.Source != "ancestor_grant" {
		t.Fatalf("move and inherited access were not committed together: bob=%+v carol=%+v old=%+v new=%+v", bobAccess, carolAccess, oldPolicy, newPolicy)
	}
}
