package product

import (
	"fmt"
	"sort"

	actioncontract "github.com/domainry/domainry-foundation/action"
	identitysdk "github.com/domainry/domainry-identity-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgeapplication "github.com/domainry/domainry-knowledge/internal/application/knowledge"
)

const (
	knowledgeRoleReader  = "reader"
	knowledgeRoleEditor  = "editor"
	knowledgeRoleManager = "manager"
)

var knowledgeNoResourceMinimumRoles = map[string]string{
	knowledgesdk.ActionOpenAPIGet:                    knowledgeRoleReader,
	knowledgesdk.ActionLibrariesList:                 knowledgeRoleReader,
	knowledgesdk.ActionLibrariesCreate:               knowledgeRoleManager,
	knowledgesdk.ActionPageSharesRedeem:              knowledgeRoleReader,
	knowledgesdk.ActionPageSharesRead:                knowledgeRoleReader,
	knowledgesdk.ActionPageShareContentCopy:          knowledgeRoleReader,
	knowledgesdk.ActionPageShareContentPrint:         knowledgeRoleReader,
	knowledgesdk.ActionPageShareContentExport:        knowledgeRoleReader,
	knowledgesdk.ActionPrincipalsSearch:              knowledgeRoleReader,
	knowledgesdk.ActionPrincipalsResolve:             knowledgeRoleReader,
	knowledgesdk.ActionOrganizationPrincipalsResolve: knowledgeRoleReader,
}

func knowledgeProjectRoleDefinitions(permissions map[string][]identitysdk.ProjectRolePermission) []identitysdk.ProjectRoleDefinition {
	roles := []identitysdk.ProjectRoleDefinition{
		{
			Key: knowledgeReaderRoleKey, Name: "Knowledge reader",
			Description: "Read and participate in Knowledge content allowed by library and page access.",
			Audience:    "user", AssignmentMode: "manual", RiskLevel: "normal",
		},
		{
			Key: knowledgeEditorRoleKey, Name: "Knowledge editor",
			Description: "Create and edit Knowledge content allowed by library and page access.",
			Audience:    "user", AssignmentMode: "manual", RiskLevel: "elevated",
		},
		{
			Key: knowledgeManagerRoleKey, Name: "Knowledge manager",
			Description: "Manage Knowledge libraries, members, governance, integrations, and content.",
			Audience:    "user", AssignmentMode: "manual", RiskLevel: "privileged",
		},
	}
	if permissions == nil {
		return roles
	}
	for index := range roles {
		roles[index].Permissions = append([]identitysdk.ProjectRolePermission(nil), permissions[roles[index].Key]...)
	}
	return roles
}

func knowledgeProjectRoles(actions []actioncontract.ActionDefinition) ([]identitysdk.ProjectRoleDefinition, error) {
	permissions := map[string][]identitysdk.ProjectRolePermission{
		knowledgeReaderRoleKey:  {},
		knowledgeEditorRoleKey:  {},
		knowledgeManagerRoleKey: {},
	}
	for _, action := range actions {
		if action.Permission == nil {
			continue
		}
		minimumRole, err := knowledgeActionMinimumRole(action.Key)
		if err != nil {
			return nil, err
		}
		grant := identitysdk.ProjectRolePermission{PermissionKey: action.Permission.Key, DataScope: identitysdk.DataScopeAll}
		switch minimumRole {
		case knowledgeRoleReader:
			permissions[knowledgeReaderRoleKey] = append(permissions[knowledgeReaderRoleKey], grant)
			permissions[knowledgeEditorRoleKey] = append(permissions[knowledgeEditorRoleKey], grant)
			permissions[knowledgeManagerRoleKey] = append(permissions[knowledgeManagerRoleKey], grant)
		case knowledgeRoleEditor:
			permissions[knowledgeEditorRoleKey] = append(permissions[knowledgeEditorRoleKey], grant)
			permissions[knowledgeManagerRoleKey] = append(permissions[knowledgeManagerRoleKey], grant)
		case knowledgeRoleManager:
			permissions[knowledgeManagerRoleKey] = append(permissions[knowledgeManagerRoleKey], grant)
		default:
			return nil, fmt.Errorf("Knowledge Action %q has unsupported minimum role %q", action.Key, minimumRole)
		}
	}
	for key := range permissions {
		sort.Slice(permissions[key], func(left, right int) bool {
			return permissions[key][left].PermissionKey < permissions[key][right].PermissionKey
		})
	}
	return knowledgeProjectRoleDefinitions(permissions), nil
}

func knowledgeActionMinimumRole(actionKey string) (string, error) {
	rule, ok := knowledgeapplication.KnowledgeResourcePolicy[actionKey]
	if !ok {
		return "", fmt.Errorf("Knowledge Action %q has no resource policy", actionKey)
	}
	if rule.AllowNoResource {
		role, found := knowledgeNoResourceMinimumRoles[actionKey]
		if !found {
			return "", fmt.Errorf("Knowledge resource-free Action %q has no role classification", actionKey)
		}
		return role, nil
	}
	switch rule.MinimumRole {
	case knowledgeRoleReader, knowledgeRoleEditor, knowledgeRoleManager:
		return rule.MinimumRole, nil
	default:
		return "", fmt.Errorf("Knowledge Action %q has invalid minimum role %q", actionKey, rule.MinimumRole)
	}
}
