package product

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

	actioncontract "github.com/domainry/domainry-foundation/action"
	"github.com/domainry/domainry-foundation/requestcontext"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	"github.com/domainry/domainry-identity-sdk/authorization/evaluator"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func (host *Host) registerKnowledgePermissions(ctx context.Context) error {
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		return err
	}
	definitions := make([]identitysdk.PermissionDefinition, 0, len(actions))
	for _, action := range actions {
		permission := action.Permission
		if permission == nil {
			continue
		}
		definitions = append(definitions, knowledgePermissionDefinition(action))
	}
	reader, ok := host.identity.Permissions().(identitysdk.PermissionSnapshotReader)
	if !ok {
		return fmt.Errorf("Identity permission snapshot reader is required")
	}
	previous, err := reader.CurrentSourceSnapshot(ctx, identitysdk.PermissionSourceSnapshotRequest{SourceOwner: knowledgesdk.AuthorizationOwner})
	if err != nil {
		return err
	}
	request, err := identitysdk.NewPermissionReconcileRequest(knowledgesdk.AuthorizationOwner, previous.SnapshotHash, definitions)
	if err != nil {
		return err
	}
	receipt, err := host.identity.Permissions().Reconcile(ctx, request)
	if err != nil {
		return err
	}
	if err = receipt.ValidateFor(request); err != nil {
		return err
	}
	rolePublisher, ok := host.identity.(identitysdk.ProjectRoleCatalogPublisher)
	if !ok {
		return fmt.Errorf("Identity project role catalog publisher is required")
	}
	roles, err := knowledgeProjectRoles(actions)
	if err != nil {
		return err
	}
	if _, err = rolePublisher.PublishProjectRoles(ctx, identitysdk.ProjectRoleCatalog{SourceOwner: knowledgesdk.AuthorizationOwner, Roles: roles}); err != nil {
		return err
	}
	return nil
}

func knowledgePermissionDefinition(action actioncontract.ActionDefinition) identitysdk.PermissionDefinition {
	permission := action.Permission
	if permission == nil {
		return identitysdk.PermissionDefinition{}
	}
	localized := make(identitysdk.PermissionLocalizedText, len(permission.I18n))
	for locale, text := range permission.I18n {
		localized[locale] = identitysdk.PermissionText{
			ModuleLabel: text.ModuleLabel, GroupLabel: text.GroupLabel, ResourceLabel: text.ResourceLabel,
			OperationLabel: text.OperationLabel, Label: text.Label, Description: text.Description,
		}
	}
	return identitysdk.PermissionDefinition{
		PermissionKey: permission.Key, ModuleKey: permission.ModuleKey, GroupKey: permission.GroupKey,
		ResourceKey: permission.ResourceKey, OperationKey: permission.OperationKey,
		Label: permission.Label, Description: permission.Description, Category: permission.Category,
		SourceKind: action.SourceKind, GrantMode: string(permission.GrantMode), ScopeKind: string(permission.ScopeKind),
		ObjectKey: permission.ObjectKey, DefaultLocale: permission.DefaultLocale, I18n: localized,
	}
}

func (host *Host) validAuthority(authority knowledgesdk.Authority) bool {
	return authority.Known && authority.RuntimeID == host.runtimeID && authority.WorkspaceID == host.workspaceID && strings.TrimSpace(authority.UserID) != ""
}

func (host *Host) resolvePrincipal(ctx context.Context, authority knowledgesdk.Authority) (identitysdk.PrincipalResolution, error) {
	if !host.validAuthority(authority) {
		return identitysdk.PrincipalResolution{}, &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.library_access_denied"}
	}
	resolution, err := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(authority.UserID), RoleKey: authority.RoleKey})
	if err != nil {
		return identitysdk.PrincipalResolution{}, err
	}
	if !resolution.Principal.Known || resolution.Principal.WorkspaceID != authority.WorkspaceID || resolution.Principal.UserID != authority.UserID {
		return identitysdk.PrincipalResolution{}, &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.library_access_denied"}
	}
	return resolution, nil
}

func (host *Host) AuthorizeKnowledgeLibrary(ctx context.Context, operation string, library knowledgesdk.KnowledgeLibrary, authority knowledgesdk.Authority) error {
	denied := &knowledgesdk.Error{Class: "forbidden", Code: "knowledge.library_access_denied"}
	action, found, err := knowledgesdk.AuthorizationAction(operation)
	if err != nil {
		return err
	}
	if !found || action.Permission == nil {
		return denied
	}
	resolution, err := host.resolvePrincipal(ctx, authority)
	if err != nil {
		return err
	}
	// Identity owns only product-wide Knowledge capabilities. Once a concrete
	// library exists, its live reader/editor/manager membership and page ACL
	// are the authority; requiring the same action in a global role would make
	// users configure the same permission twice.
	if !knowledgesdk.RequiresIdentityActionGrant(operation, library) {
		return nil
	}
	permission := action.Permission
	facts := identitysdk.ResourceFacts{
		"workspace_id": authority.WorkspaceID, "library_id": library.ID, "library_kind": library.Kind,
		"library_role": library.Role, "owner_user_id": library.OwnerUserID,
	}
	decision, err := evaluator.Evaluate(resolution.AccessBundle, identitysdk.AccessRequest{ObjectKey: permission.ResourceKey, Action: permission.OperationKey}, facts, time.Now().UTC())
	if err != nil {
		return err
	}
	if !decision.Allowed {
		return denied
	}
	return nil
}

func (host *Host) ValidateKnowledgeLibraryMember(ctx context.Context, userID string, authority knowledgesdk.Authority) error {
	denied := &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.library_member_unavailable"}
	if !host.validAuthority(authority) || strings.TrimSpace(userID) == "" || len(userID) > 255 {
		return denied
	}
	resolution, err := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(userID)})
	if err != nil || !resolution.Principal.Known || resolution.Principal.UserID != userID || resolution.Principal.WorkspaceID != authority.WorkspaceID {
		return denied
	}
	return nil
}

func (host *Host) ValidateKnowledgeLibraryOrganizationMember(ctx context.Context, organizationID string, authority knowledgesdk.Authority) error {
	denied := &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.library_organization_member_unavailable"}
	if !host.validAuthority(authority) || strings.TrimSpace(organizationID) == "" || len(organizationID) > 255 {
		return denied
	}
	organization, found, err := host.identity.Projection().FindOrganizationUnit(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.OrganizationUnitLookup{OrgID: organizationID})
	if err != nil || !found || organization.OrganizationUnitID != organizationID || organization.Status != "active" {
		return denied
	}
	return nil
}

func (host *Host) SearchKnowledgePrincipals(ctx context.Context, query, after string, limit int, authority knowledgesdk.Authority) (knowledgesdk.KnowledgePrincipalPage, error) {
	if _, err := host.resolvePrincipal(ctx, authority); err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		return knowledgesdk.KnowledgePrincipalPage{}, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.principal_limit_invalid"}
	}
	users, err := host.identity.Projection().ListUsers(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.ProjectionQuery{})
	if err != nil {
		return knowledgesdk.KnowledgePrincipalPage{}, err
	}
	needle := strings.ToLower(strings.TrimSpace(query))
	items := make([]knowledgesdk.KnowledgePrincipal, 0, len(users))
	for _, user := range users {
		if user.Status != identitysdk.UserStatusActive || user.UserID <= after {
			continue
		}
		if needle != "" && !strings.Contains(strings.ToLower(user.UserID+"\n"+user.Name+"\n"+user.Email), needle) {
			continue
		}
		items = append(items, knowledgesdk.KnowledgePrincipal{UserID: user.UserID, DisplayName: user.Name, Email: user.Email, Status: user.Status})
	}
	sort.Slice(items, func(left, right int) bool { return items[left].UserID < items[right].UserID })
	result := knowledgesdk.KnowledgePrincipalPage{Items: items, Complete: true}
	if len(result.Items) > limit {
		result.Items = result.Items[:limit]
		result.NextAfter = result.Items[len(result.Items)-1].UserID
		result.Complete = false
	}
	return result, nil
}

func (host *Host) ResolveKnowledgePrincipals(ctx context.Context, userIDs []string, authority knowledgesdk.Authority) ([]knowledgesdk.KnowledgePrincipal, error) {
	if len(userIDs) > 100 {
		return nil, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.principal_limit_invalid"}
	}
	if _, err := host.resolvePrincipal(ctx, authority); err != nil {
		return nil, err
	}
	result := make([]knowledgesdk.KnowledgePrincipal, 0, len(userIDs))
	for _, userID := range userIDs {
		user, found, err := host.identity.Projection().FindUser(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.UserLookup{UserID: identitysdk.SubjectID(userID)})
		if err != nil {
			return nil, err
		}
		if !found || user.Status != identitysdk.UserStatusActive {
			result = append(result, knowledgesdk.KnowledgePrincipal{UserID: userID, DisplayName: "账号不可用", Status: "unavailable"})
			continue
		}
		result = append(result, knowledgesdk.KnowledgePrincipal{UserID: user.UserID, DisplayName: user.Name, Email: user.Email, Status: user.Status})
	}
	return result, nil
}

func (host *Host) ResolveKnowledgeOrganizationPrincipals(ctx context.Context, organizationIDs []string, authority knowledgesdk.Authority) ([]knowledgesdk.KnowledgeOrganizationPrincipal, error) {
	if len(organizationIDs) > 100 {
		return nil, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.principal_limit_invalid"}
	}
	if _, err := host.resolvePrincipal(ctx, authority); err != nil {
		return nil, err
	}
	result := make([]knowledgesdk.KnowledgeOrganizationPrincipal, 0, len(organizationIDs))
	for _, organizationID := range organizationIDs {
		organization, found, err := host.identity.Projection().FindOrganizationUnit(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.OrganizationUnitLookup{OrgID: organizationID})
		if err != nil {
			return nil, err
		}
		if !found || organization.Status != "active" {
			result = append(result, knowledgesdk.KnowledgeOrganizationPrincipal{OrganizationID: organizationID, DisplayName: "组织不可用", Status: "unavailable"})
			continue
		}
		result = append(result, knowledgesdk.KnowledgeOrganizationPrincipal{OrganizationID: organization.OrganizationUnitID, DisplayName: organization.Name, NodeType: organization.NodeType, Status: organization.Status})
	}
	return result, nil
}

func (host *Host) ExplainKnowledgeAccess(ctx context.Context, input knowledgesdk.KnowledgeAccessExplainRequest, library knowledgesdk.KnowledgeLibrary, authority knowledgesdk.Authority) (knowledgesdk.KnowledgeAccessExplanation, error) {
	result := knowledgesdk.KnowledgeAccessExplanation{UserID: input.UserID, LibraryID: library.ID, PageID: input.PageID, Action: input.Action}
	action, found, err := knowledgesdk.AuthorizationAction(input.Action)
	if err != nil {
		return result, err
	}
	if !found || action.Permission == nil || strings.TrimSpace(input.UserID) == "" || !host.validAuthority(authority) {
		return result, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.access_explain_invalid"}
	}
	resolution, err := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(input.UserID)})
	if err != nil {
		return result, err
	}
	if !resolution.Principal.Known || resolution.Principal.WorkspaceID != authority.WorkspaceID {
		result.Identity = knowledgesdk.KnowledgeAccessLayer{Allowed: false, Code: "identity_principal_unavailable", Label: "Identity 功能权限"}
		return result, nil
	}
	permission := action.Permission
	facts := identitysdk.ResourceFacts{"workspace_id": authority.WorkspaceID, "library_id": library.ID, "library_kind": library.Kind, "library_role": library.Role, "owner_user_id": library.OwnerUserID}
	decision, err := evaluator.Evaluate(resolution.AccessBundle, identitysdk.AccessRequest{ObjectKey: permission.ResourceKey, Action: permission.OperationKey}, facts, time.Now().UTC())
	if err != nil {
		return result, err
	}
	result.Identity = knowledgesdk.KnowledgeAccessLayer{Allowed: decision.Allowed, Code: decision.Code, Label: "Identity 功能权限", Source: decision.PolicyKey}
	return result, nil
}

func (host *Host) ResolveKnowledgeAccessAuthority(ctx context.Context, userID string, authority knowledgesdk.Authority) (knowledgesdk.Authority, error) {
	if !host.validAuthority(authority) || strings.TrimSpace(userID) == "" || len(userID) > 255 {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: "bad_request", Code: "knowledge.access_explain_invalid"}
	}
	resolution, err := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(ctx, authority.WorkspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(userID)})
	if err != nil {
		return knowledgesdk.Authority{}, err
	}
	principal := resolution.Principal
	if !principal.Known || principal.WorkspaceID != authority.WorkspaceID || principal.UserID != userID {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: "not_found", Code: "knowledge.access_principal_unavailable"}
	}
	return knowledgesdk.Authority{Known: true, RuntimeID: authority.RuntimeID, WorkspaceID: principal.WorkspaceID, UserID: principal.UserID, RoleKey: principal.RoleKey, OrgID: principal.OrgID, OrgScopeIDs: append([]string(nil), principal.OrgScopeIDs...), AccountType: principal.User.AccountType}, nil
}

func (host *Host) ResolveKnowledgeTrustedApplication(ctx context.Context, applicationKey, action string) (knowledgesdk.Authority, error) {
	registration, allowed := host.trustedApplications.Authorize(applicationKey, action)
	if !allowed {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: knowledgesdk.ErrorClassForbidden, Code: "knowledge.trusted_application_denied"}
	}
	resolution, err := host.identity.Principals().Resolve(requestcontext.WithWorkspaceID(ctx, host.workspaceID), identitysdk.PrincipalResolutionRequest{SubjectID: identitysdk.SubjectID(registration.ServiceUserID)})
	if err != nil {
		return knowledgesdk.Authority{}, err
	}
	principal := resolution.Principal
	if !principal.Known || principal.WorkspaceID != host.workspaceID || principal.UserID != registration.ServiceUserID {
		return knowledgesdk.Authority{}, &knowledgesdk.Error{Class: knowledgesdk.ErrorClassForbidden, Code: "knowledge.trusted_application_principal_unavailable"}
	}
	return knowledgesdk.Authority{
		Known: true, RuntimeID: host.runtimeID, WorkspaceID: principal.WorkspaceID, UserID: principal.UserID,
		RoleKey: principal.RoleKey, OrgID: principal.OrgID, OrgScopeIDs: append([]string(nil), principal.OrgScopeIDs...), AccountType: principal.User.AccountType,
	}, nil
}
