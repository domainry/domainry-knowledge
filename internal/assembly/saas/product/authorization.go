package product

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

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
	grants := make([]identitysdk.ProjectRolePermission, 0, len(actions))
	for _, action := range actions {
		permission := action.Permission
		if permission == nil {
			continue
		}
		definitions = append(definitions, identitysdk.PermissionDefinition{
			PermissionKey: permission.Key, ResourceKey: permission.ResourceKey, OperationKey: permission.OperationKey,
			Label: permission.Label, Category: permission.Category, SourceKind: action.SourceKind,
		})
		grants = append(grants, identitysdk.ProjectRolePermission{PermissionKey: permission.Key, DataScope: identitysdk.DataScopeAll})
	}
	reader, ok := host.identity.Permissions().(identitysdk.PermissionSnapshotReader)
	if !ok {
		return fmt.Errorf("Identity permission snapshot reader is required")
	}
	previous, err := reader.CurrentSourceSnapshot(ctx, identitysdk.PermissionSourceSnapshotRequest{Application: host.application, SourceOwner: knowledgesdk.AuthorizationOwner})
	if err != nil {
		return err
	}
	request, err := identitysdk.NewPermissionReconcileRequest(host.application, knowledgesdk.AuthorizationOwner, previous.SnapshotHash, definitions)
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
	if _, err = rolePublisher.PublishProjectRoles(ctx, identitysdk.ProjectRoleCatalog{Application: host.application, Roles: []identitysdk.ProjectRoleDefinition{{
		Key: administratorRoleKey, Name: "Knowledge administrator", Audience: "user", AssignmentMode: "manual", ProvisionToWorkspaces: true,
	}}}); err != nil {
		return err
	}
	publisher, ok := host.identity.(identitysdk.ProjectRolePermissionBundlePublisher)
	if !ok {
		return fmt.Errorf("Identity project role permission bundle publisher is required")
	}
	_, err = publisher.PublishProjectRolePermissionBundle(ctx, identitysdk.ProjectRolePermissionBundleRequest{
		Application: host.application, SourceOwner: knowledgesdk.AuthorizationOwner, RoleKey: administratorRoleKey,
		ActorID: identitysdk.SubjectID(host.workspaceID + "-admin"), Permissions: grants,
		BusinessReason: "Install the Knowledge product administrator permission bundle", OperationID: "knowledge-product-permissions-v1",
	})
	return err
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
		if user.Status != identitysdk.UserStatusActive || user.ID <= after {
			continue
		}
		if needle != "" && !strings.Contains(strings.ToLower(user.ID+"\n"+user.Name+"\n"+user.Email), needle) {
			continue
		}
		items = append(items, knowledgesdk.KnowledgePrincipal{UserID: user.ID, DisplayName: user.Name, Email: user.Email, Status: user.Status})
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
		result = append(result, knowledgesdk.KnowledgePrincipal{UserID: user.ID, DisplayName: user.Name, Email: user.Email, Status: user.Status})
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
