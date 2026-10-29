package product

import (
	"fmt"

	actioncontract "github.com/domainry/domainry-foundation/action"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func knowledgeProjectRoleDefinitions(permissions []identitysdk.ProjectRolePermission) []identitysdk.ProjectRoleDefinition {
	return []identitysdk.ProjectRoleDefinition{{
		Key:         knowledgeAdministratorRoleKey,
		Name:        "Knowledge administrator",
		Description: "Create shared knowledge libraries. Content access still requires membership in each library.",
		Permissions: append([]identitysdk.ProjectRolePermission(nil), permissions...),
		Audience:    "user", AssignmentMode: "manual", RiskLevel: "privileged",
	}}
}

func knowledgeProjectRoles(actions []actioncontract.ActionDefinition) ([]identitysdk.ProjectRoleDefinition, error) {
	for _, action := range actions {
		if action.Key == knowledgesdk.ActionLibrariesCreate && action.Permission != nil {
			return knowledgeProjectRoleDefinitions([]identitysdk.ProjectRolePermission{{
				PermissionKey: action.Permission.Key,
				DataScope:     identitysdk.DataScopeAll,
			}}), nil
		}
	}
	return nil, fmt.Errorf("Knowledge shared-library creation Action is not registered")
}
