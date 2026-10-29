package product

import (
	"testing"

	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeProjectRolesBundleEveryActionByResourceRole(t *testing.T) {
	actions, err := knowledgesdk.AuthorizationActions()
	if err != nil {
		t.Fatal(err)
	}
	roles, err := knowledgeProjectRoles(actions)
	if err != nil {
		t.Fatal(err)
	}
	if len(roles) != 3 {
		t.Fatalf("Knowledge roles=%d want=3", len(roles))
	}
	catalog := identitysdk.ProjectRoleCatalog{SourceOwner: knowledgesdk.AuthorizationOwner, Roles: roles}
	if err := catalog.ValidateContract(); err != nil {
		t.Fatal(err)
	}

	permissionCount := 0
	for _, action := range actions {
		if action.Permission != nil {
			permissionCount++
		}
	}
	sets := map[string]map[string]bool{}
	for _, role := range roles {
		sets[role.Key] = projectRolePermissionSet(role)
	}
	reader := sets[knowledgeReaderRoleKey]
	editor := sets[knowledgeEditorRoleKey]
	manager := sets[knowledgeManagerRoleKey]
	if len(reader) == 0 || len(editor) <= len(reader) || len(manager) <= len(editor) || len(manager) != permissionCount {
		t.Fatalf("Knowledge role sizes reader=%d editor=%d manager=%d permissions=%d", len(reader), len(editor), len(manager), permissionCount)
	}
	for permission := range reader {
		if !editor[permission] || !manager[permission] {
			t.Fatalf("reader permission %q is not cumulative", permission)
		}
	}
	for permission := range editor {
		if !manager[permission] {
			t.Fatalf("editor permission %q is not included by manager", permission)
		}
	}

	assertKnowledgeRoleGrant(t, sets, knowledgesdk.ActionPagesGet, true, true, true)
	assertKnowledgeRoleGrant(t, sets, knowledgesdk.ActionPageCommentsCreate, true, true, true)
	assertKnowledgeRoleGrant(t, sets, knowledgesdk.ActionPagesUpdate, false, true, true)
	assertKnowledgeRoleGrant(t, sets, knowledgesdk.ActionLibrariesCreate, false, false, true)
	assertKnowledgeRoleGrant(t, sets, knowledgesdk.ActionLibraryMembersSet, false, false, true)
}

func TestKnowledgeBootstrapCatalogStartsWithThreePermissionlessRoles(t *testing.T) {
	roles := knowledgeProjectRoleDefinitions(nil)
	for _, role := range roles {
		if len(role.Permissions) != 0 {
			t.Fatalf("bootstrap role %q unexpectedly has permissions", role.Key)
		}
	}
	if _, err := identitysdk.WorkspaceBootstrapProjectRoleCatalogSHA256(identitysdk.ProjectRoleCatalog{
		SourceOwner:                          knowledgesdk.AuthorizationOwner,
		InitialWorkspaceAdministratorRoleKey: knowledgeManagerRoleKey,
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

func assertKnowledgeRoleGrant(t *testing.T, sets map[string]map[string]bool, permission string, reader, editor, manager bool) {
	t.Helper()
	want := map[string]bool{
		knowledgeReaderRoleKey: reader, knowledgeEditorRoleKey: editor, knowledgeManagerRoleKey: manager,
	}
	for role, expected := range want {
		if sets[role][permission] != expected {
			t.Fatalf("role %q permission %q=%t want=%t", role, permission, sets[role][permission], expected)
		}
	}
}
