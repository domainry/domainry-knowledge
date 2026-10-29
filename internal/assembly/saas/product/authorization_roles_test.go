package product

import (
	"testing"

	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeProjectRolesOnlyGrantGlobalSharedLibraryCreation(t *testing.T) {
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		t.Fatal(err)
	}
	roles, err := knowledgeProjectRoles(actions)
	if err != nil {
		t.Fatal(err)
	}
	if len(roles) != 1 {
		t.Fatalf("Knowledge roles=%d want=1", len(roles))
	}
	catalog := identitysdk.ProjectRoleCatalog{SourceOwner: knowledgesdk.AuthorizationOwner, Roles: roles}
	if err := catalog.ValidateContract(); err != nil {
		t.Fatal(err)
	}

	role := roles[0]
	if role.Key != knowledgeAdministratorRoleKey || role.AssignmentMode != "manual" {
		t.Fatalf("unexpected Knowledge role: %+v", role)
	}
	permissions := projectRolePermissionSet(role)
	if len(permissions) != 1 || !permissions[knowledgesdk.ActionLibrariesCreate] {
		t.Fatalf("Knowledge administrator permissions=%v want only %q", permissions, knowledgesdk.ActionLibrariesCreate)
	}
}

func TestKnowledgeBootstrapCatalogStartsWithPermissionlessAdministrator(t *testing.T) {
	roles := knowledgeProjectRoleDefinitions(nil)
	if len(roles) != 1 || roles[0].Key != knowledgeAdministratorRoleKey {
		t.Fatalf("bootstrap roles=%+v", roles)
	}
	for _, role := range roles {
		if len(role.Permissions) != 0 {
			t.Fatalf("bootstrap role %q unexpectedly has permissions", role.Key)
		}
	}
	if _, err := identitysdk.WorkspaceBootstrapProjectRoleCatalogSHA256(identitysdk.ProjectRoleCatalog{
		SourceOwner:                          knowledgesdk.AuthorizationOwner,
		InitialWorkspaceAdministratorRoleKey: knowledgeAdministratorRoleKey,
		Roles:                                roles,
	}); err != nil {
		t.Fatal(err)
	}
}

func projectRolePermissionSet(role identitysdk.ProjectRoleDefinition) map[string]bool {
	result := make(map[string]bool, len(role.Permissions))
	for _, permission := range role.Permissions {
		result[permission.PermissionKey] = true
	}
	return result
}
