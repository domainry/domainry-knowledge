package store

import (
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func publishedPageShareFixture(t *testing.T) (*Store, agentsdk.Authority, agentsdk.KnowledgeLibrary, knowledgesdk.KnowledgePageView) {
	t.Helper()
	store, manager, library, page := pageFixture(t)
	manager.AccountType = "human"
	page = savePageFixture(t, store, manager, library, page, "share-root-save", "分享根页面", "已发布内容")
	page = publishPageFixture(t, store, manager, library, page, "share-root-publish")
	return store, manager, library, page
}

func pageShareCreate(kind string, target knowledgesdk.KnowledgeAccessSubject, scope, clientID, password string) knowledgesdk.KnowledgePageShareCreate {
	return knowledgesdk.KnowledgePageShareCreate{
		ClientID:  clientID,
		Kind:      kind,
		Target:    target,
		Scope:     scope,
		ExpiresAt: time.Now().UTC().Add(time.Hour),
		Password:  password,
	}
}

func TestKnowledgePageShareRequiresPublishedPageAndManager(t *testing.T) {
	store, manager, library, draft := pageFixture(t)
	manager.AccountType = "human"
	input := pageShareCreate(knowledgesdk.KnowledgePageShareUser, knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"}, knowledgesdk.KnowledgePageShareScopePage, "share-draft", "")
	if _, err := store.CreateKnowledgePageShare(t.Context(), library.ID, draft.Page.ID, input, manager); err == nil || !strings.Contains(err.Error(), "page_share_published_required") {
		t.Fatalf("unpublished page was shareable: %v", err)
	}

	draft = savePageFixture(t, store, manager, library, draft, "share-publish-save", "已发布", "正文")
	draft = publishPageFixture(t, store, manager, library, draft, "share-publish")
	library = addPageMember(t, store, library, "editor", "editor", manager)
	editor := manager
	editor.UserID = "editor"
	if _, err := store.CreateKnowledgePageShare(t.Context(), library.ID, draft.Page.ID, input, editor); err == nil || !strings.Contains(err.Error(), "library_manage_required") {
		t.Fatalf("editor created a share: %v", err)
	}
}

func TestKnowledgePageUserShareIsBoundToTargetAndRedemption(t *testing.T) {
	store, manager, library, page := publishedPageShareFixture(t)
	input := pageShareCreate(knowledgesdk.KnowledgePageShareUser, knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"}, knowledgesdk.KnowledgePageShareScopePage, "share-user", "")
	share, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, input, manager)
	if err != nil || !strings.HasPrefix(share.ID, "kshare_") || share.PasswordProtected || share.Role != "reader" {
		t.Fatalf("user share mismatch: %+v err=%v", share, err)
	}

	bob := manager
	bob.UserID = "bob"
	explained, err := store.EvaluateKnowledgePageShareAccessForAuthority(t.Context(), library.ID, share.ID, page.Page.ID, bob, manager)
	if err != nil || explained.Allowed || explained.Code != "page_share_redeem_required" {
		t.Fatalf("unredeemed share explanation mismatch: %+v err=%v", explained, err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob); err == nil || !strings.Contains(err.Error(), "page_share_redeem_required") {
		t.Fatalf("share read without redemption: %v", err)
	}
	carol := manager
	carol.UserID = "carol"
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{}, carol); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("non-target user redeemed share: %v", err)
	}
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{}, bob); err != nil {
		t.Fatal(err)
	}
	explained, err = store.EvaluateKnowledgePageShareAccessForAuthority(t.Context(), library.ID, share.ID, page.Page.ID, bob, manager)
	if err != nil || !explained.Allowed || explained.Code != "page_share_allowed" {
		t.Fatalf("redeemed share explanation mismatch: %+v err=%v", explained, err)
	}
	view, err := store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob)
	if err != nil || view.View.Page.ID != page.Page.ID || view.View.Draft != nil || view.View.Published == nil || view.View.Published.Body.PlainText != "已发布内容" {
		t.Fatalf("published shared view mismatch: %+v err=%v", view, err)
	}
}

func TestKnowledgePageOrganizationShareRechecksLiveIdentityScope(t *testing.T) {
	store, manager, library, page := publishedPageShareFixture(t)
	input := pageShareCreate(knowledgesdk.KnowledgePageShareOrganization, knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectOrganization, ID: "org-sales"}, knowledgesdk.KnowledgePageShareScopePage, "share-organization", "")
	share, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, input, manager)
	if err != nil {
		t.Fatal(err)
	}
	bob := manager
	bob.UserID = "bob"
	bob.OrgScopeIDs = []string{"org-company", "org-sales"}
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{}, bob); err != nil {
		t.Fatal(err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob); err != nil {
		t.Fatal(err)
	}
	bob.OrgScopeIDs = []string{"org-company"}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("removed organization member retained share access: %v", err)
	}
}

func TestKnowledgePageExternalShareRequiresPasswordAndHumanAccount(t *testing.T) {
	store, manager, library, page := publishedPageShareFixture(t)
	input := pageShareCreate(knowledgesdk.KnowledgePageShareExternal, knowledgesdk.KnowledgeAccessSubject{}, knowledgesdk.KnowledgePageShareScopePage, "share-external-invalid", "")
	if _, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, input, manager); err == nil || !strings.Contains(err.Error(), "page_share_password_invalid") {
		t.Fatalf("passwordless external share accepted: %v", err)
	}
	input.ClientID, input.Password = "share-external", "secret-123"
	share, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, input, manager)
	if err != nil || !share.PasswordProtected {
		t.Fatalf("external share mismatch: %+v err=%v", share, err)
	}

	external := manager
	external.UserID = "external-user"
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{Password: "wrong-pass"}, external); err == nil || !strings.Contains(err.Error(), "page_share_password_invalid") {
		t.Fatalf("wrong external password accepted: %v", err)
	}
	service := external
	service.AccountType = "service"
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{Password: input.Password}, service); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("service account redeemed external share: %v", err)
	}
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{Password: input.Password}, external); err != nil {
		t.Fatal(err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, external); err != nil {
		t.Fatal(err)
	}
}

func TestKnowledgePageSubtreeShareIncludesPublishedChildrenAndRevokeClosesAccess(t *testing.T) {
	store, manager, library, root := publishedPageShareFixture(t)
	child, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "share-child-create", ParentPageID: root.Page.ID, Title: "分享子页面", ContentType: knowledgesdk.KnowledgePageTypeDocument}, manager)
	if err != nil {
		t.Fatal(err)
	}
	child = savePageFixture(t, store, manager, library, child, "share-child-save", "分享子页面", "子页面正文")
	child = publishPageFixture(t, store, manager, library, child, "share-child-publish")
	input := pageShareCreate(knowledgesdk.KnowledgePageShareUser, knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"}, knowledgesdk.KnowledgePageShareScopeSubtree, "share-subtree", "")
	share, err := store.CreateKnowledgePageShare(t.Context(), library.ID, root.Page.ID, input, manager)
	if err != nil {
		t.Fatal(err)
	}
	bob := manager
	bob.UserID = "bob"
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{}, bob); err != nil {
		t.Fatal(err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, child.Page.ID, bob); err != nil {
		t.Fatalf("published child unavailable through subtree share: %v", err)
	}
	share, err = store.RevokeKnowledgePageShare(t.Context(), library.ID, root.Page.ID, share.ID, share.Revision, manager)
	if err != nil || share.State != knowledgesdk.KnowledgePageShareRevoked {
		t.Fatalf("share revoke mismatch: %+v err=%v", share, err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, child.Page.ID, bob); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("revoked share remained readable: %v", err)
	}
}

func TestKnowledgePageShareContentOperationsRecheckShareAndContentPolicy(t *testing.T) {
	store, manager, library, page := publishedPageShareFixture(t)
	share, err := store.CreateKnowledgePageShare(t.Context(), library.ID, page.Page.ID, pageShareCreate(
		knowledgesdk.KnowledgePageShareUser,
		knowledgesdk.KnowledgeAccessSubject{Type: knowledgesdk.KnowledgeSubjectUser, ID: "bob"},
		knowledgesdk.KnowledgePageShareScopePage,
		"share-content-policy",
		"",
	), manager)
	if err != nil {
		t.Fatal(err)
	}
	bob := manager
	bob.UserID = "bob"
	if _, err = store.RedeemKnowledgePageShare(t.Context(), share.ID, knowledgesdk.KnowledgePageShareRedeem{}, bob); err != nil {
		t.Fatal(err)
	}

	denied, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "share-content-policy-deny", ExpectedRevision: 0, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowDownload: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationRestricted, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow, RequireApproval: true,
	}, manager)
	if err != nil || denied.Revision != 1 {
		t.Fatalf("set denied share policy: policy=%+v err=%v", denied, err)
	}
	for _, operation := range []string{knowledgesdk.KnowledgePageContentOperationCopy, knowledgesdk.KnowledgePageContentOperationPrint, knowledgesdk.KnowledgePageContentOperationExport} {
		if _, err = store.AuthorizeKnowledgePageShareContentOperation(t.Context(), share.ID, page.Page.ID, operation, bob); err == nil || !strings.Contains(err.Error(), "page_content_operation_denied") {
			t.Fatalf("shared %s bypassed denied content policy: %v", operation, err)
		}
	}

	allowed, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "share-content-policy-allow", ExpectedRevision: denied.Revision, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationConfidential, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow,
	}, manager)
	if err != nil || allowed.Revision != 2 {
		t.Fatalf("set allowed share policy: policy=%+v err=%v", allowed, err)
	}
	decision, err := store.AuthorizeKnowledgePageShareContentOperation(t.Context(), share.ID, page.Page.ID, knowledgesdk.KnowledgePageContentOperationCopy, bob)
	if err != nil || !decision.Allowed || decision.SourcePageID != page.Page.ID || decision.Revision != allowed.Revision {
		t.Fatalf("allowed shared copy mismatch: decision=%+v err=%v", decision, err)
	}
	shared, err := store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob)
	if err != nil || shared.View.Governance.Classification != knowledgesdk.KnowledgePageClassificationConfidential || shared.View.Governance.DynamicWatermark == nil || !strings.Contains(shared.View.Governance.DynamicWatermark.Text, bob.UserID) {
		t.Fatalf("shared read did not derive viewer-specific watermark: governance=%+v err=%v", shared.View.Governance, err)
	}
	blocked, err := store.SetKnowledgePageContentPolicy(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageContentPolicyWrite{
		ClientID: "share-content-policy-sensitive", ExpectedRevision: allowed.Revision, Scope: knowledgesdk.KnowledgePageContentPolicyPage,
		AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true,
		Classification: knowledgesdk.KnowledgePageClassificationRestricted, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentBlockOutbound, RequireApproval: true,
	}, manager)
	if err != nil || blocked.Revision != 3 {
		t.Fatalf("set sensitive share policy: policy=%+v err=%v", blocked, err)
	}
	if _, err = store.ReadKnowledgePageShare(t.Context(), share.ID, page.Page.ID, bob); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("external share bypassed sensitive-content block: %v", err)
	}

	if _, err = store.RevokeKnowledgePageShare(t.Context(), library.ID, page.Page.ID, share.ID, share.Revision, manager); err != nil {
		t.Fatal(err)
	}
	if _, err = store.AuthorizeKnowledgePageShareContentOperation(t.Context(), share.ID, page.Page.ID, knowledgesdk.KnowledgePageContentOperationCopy, bob); err == nil || !strings.Contains(err.Error(), "page_share_not_found") {
		t.Fatalf("revoked share retained content authorization: %v", err)
	}
}
