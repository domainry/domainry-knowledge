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
	knowledgesdk.KnowledgePageRepository
	knowledgesdk.CommentService
	knowledgesdk.PageAttachmentService
	knowledgesdk.PageShareService
	library        agentsdk.KnowledgeLibrary
	page           knowledgesdk.KnowledgePageView
	libraryGet     int
	pageGet        int
	targetRole     string
	pageCount      int
	targetPage     knowledgesdk.KnowledgePageEffectiveAccess
	share          knowledgesdk.KnowledgeAccessLayer
	shareAuthority agentsdk.Authority
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

func (repository *pageAuthorizationRepository) KnowledgeLibraryRoleForAuthority(context.Context, string, agentsdk.Authority, agentsdk.Authority) (string, error) {
	return repository.targetRole, nil
}

func (repository *pageAuthorizationRepository) KnowledgeLibraryPageCount(context.Context, string, agentsdk.Authority) (int, error) {
	return repository.pageCount, nil
}

func (repository *pageAuthorizationRepository) EvaluateKnowledgePageAccessForAuthority(context.Context, string, string, agentsdk.Authority, agentsdk.Authority) (knowledgesdk.KnowledgePageEffectiveAccess, error) {
	return repository.targetPage, nil
}

func (repository *pageAuthorizationRepository) EvaluateKnowledgePageShareAccessForAuthority(context.Context, string, string, string, agentsdk.Authority, agentsdk.Authority) (knowledgesdk.KnowledgeAccessLayer, error) {
	return repository.share, nil
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

func (repository *pageAuthorizationRepository) RedeemKnowledgePageShare(_ context.Context, shareID string, _ knowledgesdk.KnowledgePageShareRedeem, authority agentsdk.Authority) (knowledgesdk.KnowledgePageShare, error) {
	repository.shareAuthority = authority
	return knowledgesdk.KnowledgePageShare{ID: shareID}, nil
}

func (repository *pageAuthorizationRepository) ReadKnowledgePageShare(_ context.Context, shareID, pageID string, authority agentsdk.Authority) (knowledgesdk.KnowledgePageSharedView, error) {
	repository.shareAuthority = authority
	return knowledgesdk.KnowledgePageSharedView{Share: knowledgesdk.KnowledgePageShare{ID: shareID, PageID: pageID, Kind: knowledgesdk.KnowledgePageShareUser}}, nil
}

func (repository *pageAuthorizationRepository) AuthorizeKnowledgePageShareContentOperation(_ context.Context, _, pageID, operation string, authority agentsdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	repository.shareAuthority = authority
	return knowledgesdk.KnowledgePageContentDecision{Operation: operation, Allowed: true, PageID: pageID, Scope: knowledgesdk.KnowledgePageContentPolicyPage}, nil
}

type pageAuthorizationPolicy struct {
	actions []string
	denyAt  int
}

type contentPolicyAuthorizationRepository struct {
	*pageAuthorizationRepository
	decisions          []knowledgesdk.KnowledgePageContentDecision
	evaluations        int
	shareEvaluations   int
	shareAuthorization agentsdk.Authority
}

func (repository *contentPolicyAuthorizationRepository) KnowledgePageContentPolicy(context.Context, string, string, agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, error) {
	return knowledgesdk.KnowledgePageContentPolicy{}, nil
}

func (repository *contentPolicyAuthorizationRepository) SetKnowledgePageContentPolicy(context.Context, string, string, knowledgesdk.KnowledgePageContentPolicyWrite, agentsdk.Authority) (knowledgesdk.KnowledgePageContentPolicy, error) {
	return knowledgesdk.KnowledgePageContentPolicy{}, nil
}

func (repository *contentPolicyAuthorizationRepository) EvaluateKnowledgePageContentPolicy(_ context.Context, _, _, operation string, _ agentsdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	index := repository.evaluations
	repository.evaluations++
	if index >= len(repository.decisions) {
		index = len(repository.decisions) - 1
	}
	decision := repository.decisions[index]
	decision.Operation = operation
	return decision, nil
}

func (repository *contentPolicyAuthorizationRepository) AuthorizeKnowledgePageShareContentOperation(_ context.Context, _, _, operation string, authority agentsdk.Authority) (knowledgesdk.KnowledgePageContentDecision, error) {
	index := repository.shareEvaluations
	repository.shareEvaluations++
	if index >= len(repository.decisions) {
		index = len(repository.decisions) - 1
	}
	decision := repository.decisions[index]
	decision.Operation = operation
	repository.shareAuthorization = authority
	return decision, nil
}

type pageIdentityAccessExplainer struct {
	allowed bool
	role    string
}

type outboundApprovalAuthorizer struct {
	requests []knowledgesdk.KnowledgePageOutboundApprovalRequest
	allowed  bool
}

func (authorizer *outboundApprovalAuthorizer) AuthorizeKnowledgePageOutbound(_ context.Context, request knowledgesdk.KnowledgePageOutboundApprovalRequest, _ agentsdk.Authority) (knowledgesdk.KnowledgePageOutboundApprovalDecision, error) {
	authorizer.requests = append(authorizer.requests, request)
	return knowledgesdk.KnowledgePageOutboundApprovalDecision{Allowed: authorizer.allowed, Reference: "approval-current"}, nil
}

func (*pageIdentityAccessExplainer) ResolveKnowledgeAccessAuthority(_ context.Context, userID string, caller agentsdk.Authority) (agentsdk.Authority, error) {
	caller.UserID = userID
	caller.RoleKey = ""
	caller.AccountType = "human"
	return caller, nil
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

func (*pageAuthorizationPolicy) ValidateKnowledgeLibraryOrganizationMember(context.Context, string, agentsdk.Authority) error {
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

func TestKnowledgePageContentOperationUsesExactActionAndRechecksPolicyRevision(t *testing.T) {
	base := &pageAuthorizationRepository{
		library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "editor"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	repository := &contentPolicyAuthorizationRepository{pageAuthorizationRepository: base, decisions: []knowledgesdk.KnowledgePageContentDecision{
		{Allowed: true, SourcePageID: "kpage_parent", Scope: knowledgesdk.KnowledgePageContentPolicySubtree, Revision: 4},
		{Allowed: true, SourcePageID: "kpage_parent", Scope: knowledgesdk.KnowledgePageContentPolicySubtree, Revision: 5},
	}}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}

	if _, err := service.AuthorizeKnowledgePageContentOperation(t.Context(), "klib_test", "kpage_test", knowledgesdk.KnowledgePageContentOperationDuplicate, authority); err == nil || !strings.Contains(err.Error(), "page_content_operation_denied") {
		t.Fatalf("policy revision change during duplicate authorization was not denied: %v", err)
	}
	if repository.evaluations != 2 {
		t.Fatalf("content policy was not checked before and after authorization: %d", repository.evaluations)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionPageDuplicate || policy.actions[1] != knowledgesdk.ActionPageDuplicate {
		t.Fatalf("duplicate authorization did not use its exact action twice: %v", policy.actions)
	}
}

func TestKnowledgePageContentOperationRequiresLiveOutboundApprovalTwice(t *testing.T) {
	base := &pageAuthorizationRepository{
		library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "editor"},
		page:    knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_test", LibraryID: "klib_test", State: "active"}},
	}
	decision := knowledgesdk.KnowledgePageContentDecision{
		Allowed: true, LibraryID: "klib_test", PageID: "kpage_test", SourcePageID: "kpage_parent", Scope: knowledgesdk.KnowledgePageContentPolicySubtree,
		Revision: 4, Classification: knowledgesdk.KnowledgePageClassificationRestricted, ApprovalRequired: true,
	}
	repository := &contentPolicyAuthorizationRepository{pageAuthorizationRepository: base, decisions: []knowledgesdk.KnowledgePageContentDecision{decision, decision}}
	approval := &outboundApprovalAuthorizer{allowed: true}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: &pageAuthorizationPolicy{}, OutboundApprover: approval}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "alice"}

	result, err := service.AuthorizeKnowledgePageContentOperation(t.Context(), "klib_test", "kpage_test", knowledgesdk.KnowledgePageContentOperationExport, authority)
	if err != nil || result.ApprovalReference != "approval-current" {
		t.Fatalf("approved outbound export failed: decision=%+v err=%v", result, err)
	}
	if len(approval.requests) != 2 {
		t.Fatalf("outbound approval was not rechecked: %+v", approval.requests)
	}
	for _, request := range approval.requests {
		if request.Operation != knowledgesdk.KnowledgePageContentOperationExport || request.Classification != knowledgesdk.KnowledgePageClassificationRestricted || request.PolicyRevision != 4 || request.PolicyPageID != "kpage_parent" {
			t.Fatalf("approval request lost governance scope: %+v", request)
		}
	}

	repository.evaluations = 0
	service = NewService(repository, "runtime", Options{LibraryAuthorizer: &pageAuthorizationPolicy{}}, nil)
	if _, err = service.AuthorizeKnowledgePageContentOperation(t.Context(), "klib_test", "kpage_test", knowledgesdk.KnowledgePageContentOperationExport, authority); err == nil || !strings.Contains(err.Error(), "page_outbound_approval_required") {
		t.Fatalf("missing approval integration did not fail closed: %v", err)
	}
}

func TestKnowledgePageShareReadRequiresLiveOutboundApprovalTwice(t *testing.T) {
	decision := knowledgesdk.KnowledgePageContentDecision{
		Allowed: true, LibraryID: "klib_test", PageID: "kpage_shared", SourcePageID: "kpage_parent", Scope: knowledgesdk.KnowledgePageContentPolicySubtree,
		Revision: 9, Classification: knowledgesdk.KnowledgePageClassificationRestricted, ApprovalRequired: true,
	}
	repository := &contentPolicyAuthorizationRepository{
		pageAuthorizationRepository: &pageAuthorizationRepository{},
		decisions:                   []knowledgesdk.KnowledgePageContentDecision{decision, decision},
	}
	approval := &outboundApprovalAuthorizer{allowed: true}
	service := NewService(repository, "runtime", Options{
		LibraryAuthorizer: &pageAuthorizationPolicy{}, AccessExplainer: &pageIdentityAccessExplainer{allowed: true}, OutboundApprover: approval,
	}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "outside-user"}

	if _, err := service.ReadKnowledgePageShare(t.Context(), "kshare_example", "kpage_shared", authority); err != nil {
		t.Fatalf("approved shared read failed: %v", err)
	}
	if repository.shareEvaluations != 2 || len(approval.requests) != 2 {
		t.Fatalf("shared read did not recheck policy and approval: policy=%d approval=%+v", repository.shareEvaluations, approval.requests)
	}
	for _, request := range approval.requests {
		if request.Operation != knowledgesdk.KnowledgePageContentOperationShare || request.LibraryID != "klib_test" || request.PageID != "kpage_shared" || request.Classification != knowledgesdk.KnowledgePageClassificationRestricted || request.PolicyRevision != 9 || request.PolicyPageID != "kpage_parent" {
			t.Fatalf("shared-read approval request lost governance scope: %+v", request)
		}
	}

	repository.shareEvaluations = 0
	service = NewService(repository, "runtime", Options{
		LibraryAuthorizer: &pageAuthorizationPolicy{}, AccessExplainer: &pageIdentityAccessExplainer{allowed: true},
	}, nil)
	if _, err := service.ReadKnowledgePageShare(t.Context(), "kshare_example", "kpage_shared", authority); err == nil || !strings.Contains(err.Error(), "page_outbound_approval_required") {
		t.Fatalf("shared read without approval integration did not fail closed: %v", err)
	}
}

func TestKnowledgePageShareContentOperationUsesExactActionLiveIdentityAndRechecksPolicyRevision(t *testing.T) {
	repository := &contentPolicyAuthorizationRepository{
		pageAuthorizationRepository: &pageAuthorizationRepository{},
		decisions: []knowledgesdk.KnowledgePageContentDecision{
			{Allowed: true, SourcePageID: "kpage_shared", Scope: knowledgesdk.KnowledgePageContentPolicyPage, Revision: 7},
			{Allowed: true, SourcePageID: "kpage_shared", Scope: knowledgesdk.KnowledgePageContentPolicyPage, Revision: 8},
		},
	}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, AccessExplainer: &pageIdentityAccessExplainer{allowed: true}}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "outside-user"}

	if _, err := service.AuthorizeKnowledgePageShareContentOperation(t.Context(), "kshare_example", "kpage_shared", knowledgesdk.KnowledgePageContentOperationCopy, authority); err == nil || !strings.Contains(err.Error(), "page_content_operation_denied") {
		t.Fatalf("share policy revision change during copy authorization was not denied: %v", err)
	}
	if repository.shareEvaluations != 2 {
		t.Fatalf("share content policy was not checked before and after authorization: %d", repository.shareEvaluations)
	}
	if repository.shareAuthorization.UserID != authority.UserID || repository.shareAuthorization.AccountType != "human" {
		t.Fatalf("share content authorization did not use live Identity authority: %+v", repository.shareAuthorization)
	}
	if len(policy.actions) != 2 || policy.actions[0] != knowledgesdk.ActionPageShareContentCopy || policy.actions[1] != knowledgesdk.ActionPageShareContentCopy {
		t.Fatalf("shared copy authorization did not use its exact action twice: %v", policy.actions)
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

func TestKnowledgeAccessExplanationUsesShareTruthForSharedRead(t *testing.T) {
	repository := &pageAuthorizationRepository{
		library:    agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "manager"},
		page:       knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{ID: "kpage_shared", LibraryID: "klib_test", State: "active", AccessMode: knowledgesdk.KnowledgePageAccessRestricted}},
		targetRole: "",
		pageCount:  1,
		targetPage: knowledgesdk.KnowledgePageEffectiveAccess{Allowed: false, Mode: knowledgesdk.KnowledgePageAccessRestricted, Source: "not_member"},
		share:      knowledgesdk.KnowledgeAccessLayer{Allowed: true, Code: "page_share_allowed", Label: "受控分享允许只读访问", Source: "external"},
	}
	identity := &pageIdentityAccessExplainer{allowed: true}
	policy := &pageAuthorizationPolicy{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: policy, AccessExplainer: identity}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "manager"}
	input := knowledgesdk.KnowledgeAccessExplainRequest{UserID: "outside-user", PageID: repository.page.Page.ID, Action: knowledgesdk.ActionPageSharesRead, ShareID: "kshare_example"}

	result, err := service.ExplainKnowledgeAccess(t.Context(), repository.library.ID, input, authority)
	if err != nil {
		t.Fatal(err)
	}
	if result.Library.Allowed || result.Page.Allowed {
		t.Fatalf("non-member unexpectedly passed normal three-layer access: %+v", result)
	}
	if result.Share == nil || !result.Share.Allowed || !result.Final.Allowed || result.Final.Source != "share" || result.ShareID != input.ShareID {
		t.Fatalf("share endpoint truth was not explicit: %+v", result)
	}
}

func TestKnowledgeAccessExplanationRejectsShareOnUnrelatedAction(t *testing.T) {
	repository := &pageAuthorizationRepository{library: agentsdk.KnowledgeLibrary{ID: "klib_test", Role: "manager"}}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: &pageAuthorizationPolicy{}, AccessExplainer: &pageIdentityAccessExplainer{allowed: true}}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "manager"}
	_, err := service.ExplainKnowledgeAccess(t.Context(), repository.library.ID, knowledgesdk.KnowledgeAccessExplainRequest{UserID: "bob", PageID: "kpage_shared", Action: knowledgesdk.ActionPagesUpdate, ShareID: "kshare_example"}, authority)
	if err == nil || !strings.Contains(err.Error(), "knowledge_access_invalid") {
		t.Fatalf("share locator was accepted for an unrelated action: %v", err)
	}
}

func TestKnowledgePageShareReadResolvesLiveIdentityAuthority(t *testing.T) {
	repository := &pageAuthorizationRepository{}
	service := NewService(repository, "runtime", Options{LibraryAuthorizer: &pageAuthorizationPolicy{}, AccessExplainer: &pageIdentityAccessExplainer{allowed: true}}, nil)
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "outside-user"}

	if _, err := service.ReadKnowledgePageShare(t.Context(), "kshare_example", "kpage_example", authority); err != nil {
		t.Fatal(err)
	}
	if repository.shareAuthority.UserID != authority.UserID || repository.shareAuthority.AccountType != "human" {
		t.Fatalf("share read did not receive live Identity authority: %+v", repository.shareAuthority)
	}
}
