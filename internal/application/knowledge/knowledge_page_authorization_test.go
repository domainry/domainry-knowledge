package application

import (
	"context"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

type pageAuthorizationRepository struct {
	persistence.KnowledgeLibraryRepository
	knowledgesdk.PageService
	knowledgesdk.CommentService
	knowledgesdk.PageAttachmentService
	library    agentsdk.KnowledgeLibrary
	page       knowledgesdk.KnowledgePageView
	libraryGet int
	pageGet    int
	targetRole string
	pageCount  int
	targetPage knowledgesdk.KnowledgePageEffectiveAccess
}

func (repository *pageAuthorizationRepository) KnowledgePageAccess(context.Context, string, string, agentsdk.Authority) (knowledgesdk.KnowledgePageAccessPolicy, error) {
	return knowledgesdk.KnowledgePageAccessPolicy{Mode: knowledgesdk.KnowledgePageAccessInherit, Revision: 1}, nil
}

func (repository *pageAuthorizationRepository) SetKnowledgePageAccess(context.Context, string, string, knowledgesdk.KnowledgePageAccessWrite, agentsdk.Authority) (knowledgesdk.KnowledgePageAccessPolicy, error) {
	return knowledgesdk.KnowledgePageAccessPolicy{}, nil
}

func (repository *pageAuthorizationRepository) EvaluateKnowledgePageAccess(context.Context, string, string, agentsdk.Authority) (knowledgesdk.KnowledgePageEffectiveAccess, error) {
	return knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: repository.library.Role, Mode: knowledgesdk.KnowledgePageAccessInherit, Source: "library"}, nil
}

func (repository *pageAuthorizationRepository) KnowledgeLibraryRoleForUser(context.Context, string, string, agentsdk.Authority) (string, error) {
	return repository.targetRole, nil
}

func (repository *pageAuthorizationRepository) KnowledgeLibraryPageCount(context.Context, string, agentsdk.Authority) (int, error) {
	return repository.pageCount, nil
}

func (repository *pageAuthorizationRepository) EvaluateKnowledgePageAccessForUser(context.Context, string, string, string, agentsdk.Authority) (knowledgesdk.KnowledgePageEffectiveAccess, error) {
	return repository.targetPage, nil
}

func (*pageAuthorizationRepository) KnowledgePagePermissionTokens(context.Context, string, agentsdk.Authority) ([]string, error) {
	return nil, nil
}

func (*pageAuthorizationRepository) KnowledgePageProjectionPermission(context.Context, string, string, agentsdk.Authority) (string, int64, error) {
	return "", 1, nil
}

func (repository *pageAuthorizationRepository) KnowledgeLibrary(context.Context, string, agentsdk.Authority) (agentsdk.KnowledgeLibrary, error) {
	repository.libraryGet++
	return repository.library, nil
}

func (repository *pageAuthorizationRepository) KnowledgePage(context.Context, string, string, bool, agentsdk.Authority) (knowledgesdk.KnowledgePageView, error) {
	repository.pageGet++
	return repository.page, nil
}

type pageAuthorizationPolicy struct {
	actions []string
	denyAt  int
}

type pageIdentityAccessExplainer struct {
	allowed bool
	role    string
}

func (explainer *pageIdentityAccessExplainer) ExplainKnowledgeAccess(_ context.Context, input knowledgesdk.KnowledgeAccessExplainRequest, library agentsdk.KnowledgeLibrary, _ agentsdk.Authority) (knowledgesdk.KnowledgeAccessExplanation, error) {
	explainer.role = library.Role
	code := "identity_action_denied"
	if explainer.allowed {
		code = "identity_action_allowed"
	}
	return knowledgesdk.KnowledgeAccessExplanation{
		UserID: input.UserID, LibraryID: library.ID, PageID: input.PageID, Action: input.Action,
		Identity: knowledgesdk.KnowledgeAccessLayer{Allowed: explainer.allowed, Code: code, Label: "Identity Action", Source: input.Action},
	}, nil
}

func (policy *pageAuthorizationPolicy) AuthorizeKnowledgeLibrary(_ context.Context, action string, _ agentsdk.KnowledgeLibrary, _ agentsdk.Authority) error {
	policy.actions = append(policy.actions, action)
	if len(policy.actions) == policy.denyAt {
		return &agentsdk.Error{Class: "forbidden", Code: "identity.permission_denied"}
	}
	return nil
}

func (*pageAuthorizationPolicy) ValidateKnowledgeLibraryMember(context.Context, string, agentsdk.Authority) error {
	return nil
}

func TestKnowledgePageReadRechecksExactActionAfterRepositoryRead(t *testing.T) {
	repository := &pageAuthorizationRepository{
		library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "manager"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test"}},
	}
	policy := &pageAuthorizationPolicy{denyAt: 2}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}

	if _, err := service.KnowledgePage(t.Context(), "klib_test", "kpage_test", true, authority); err == nil || !strings.Contains(err.Error(), "permission_denied") {
		t.Fatalf("permission revoked after repository read was not enforced: %v", err)
	}
	if repository.pageGet != 1 || repository.libraryGet != 2 {
		t.Fatalf("unexpected authorization/read sequence: library_get=%d page_get=%d", repository.libraryGet, repository.pageGet)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionPagesGet || policy.actions[1] != knowledgesdk.ActionPagesGet {
		t.Fatalf("page read did not use the exact source-owned action twice: %v", policy.actions)
	}
}

func TestKnowledgePageWriteRequiresLibraryRoleAfterExactAction(t *testing.T) {
	repository := &pageAuthorizationRepository{library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "reader"}}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}

	if _, err := service.CreateKnowledgePage(t.Context(), "klib_test", knowledgesdk.KnowledgePageCreate{ClientID: "create", Title: "page", ContentType: knowledgesdk.KnowledgePageTypeDocument}, authority); err == nil || !strings.Contains(err.Error(), "library_role_denied") {
		t.Fatalf("reader created a page: %v", err)
	}
	if len(policy.actions) != 1 || policy.actions[0] != knowledgesdk.ActionPagesCreate {
		t.Fatalf("write did not evaluate its exact action before the resource role: %v", policy.actions)
	}
}

func TestKnowledgeAccessExplanationCombinesIdentityLibraryAndAncestorGrant(t *testing.T) {
	repository := &pageAuthorizationRepository{
		library:    agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "manager"},
		page:       knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_child", LibraryID: "klib_test", State: "active", AccessMode: knowledgesdk.KnowledgePageAccessRestricted}},
		targetRole: "editor",
		pageCount:  12,
		targetPage: knowledgesdk.KnowledgePageEffectiveAccess{Allowed: true, Role: "editor", Mode: knowledgesdk.KnowledgePageAccessRestricted, Source: "ancestor_grant", GrantPageID: "kpage_parent", GrantScope: knowledgesdk.KnowledgePageGrantSubtree},
	}
	identity := &pageIdentityAccessExplainer{allowed: true}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, AccessExplainer: identity}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "manager"}

	result, err := service.ExplainKnowledgeAccess(t.Context(), repository.library.ID, knowledgesdk.KnowledgeAccessExplainRequest{UserID: "bob", PageID: repository.page.Page.ID, Action: knowledgesdk.ActionPagesUpdate}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if identity.role != "editor" || !result.Identity.Allowed || result.Identity.Source != knowledgesdk.ActionPagesUpdate {
		t.Fatalf("identity layer did not receive the target member role/action: role=%q result=%+v", identity.role, result.Identity)
	}
	if !result.Library.Allowed || result.LibraryRole != "editor" || result.Library.Code != "library_role_allowed" {
		t.Fatalf("library role layer is wrong: %+v role=%q", result.Library, result.LibraryRole)
	}
	if !result.Page.Allowed || result.Page.Source != "ancestor_grant" || result.InheritedFrom != "kpage_parent" || result.Page.Label != "祖先子树授权" {
		t.Fatalf("page grant source is not explicit: page=%+v inherited=%q", result.Page, result.InheritedFrom)
	}
	if !result.Final.Allowed || result.Final.Code != "access_allowed" || result.ImpactPages != 12 {
		t.Fatalf("final access explanation is wrong: %+v", result)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionAccessExplain || policy.actions[1] != knowledgesdk.ActionAccessExplain {
		t.Fatalf("access explain did not recheck its exact Identity action: %v", policy.actions)
	}
}
