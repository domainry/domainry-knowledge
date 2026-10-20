package provider

import (
	"context"
	"slices"
	"strings"

	connector "github.com/domainry/domainry-connector-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

// knowledgeAccessPolicy resolves the live provider ACL for one authenticated
// Knowledge principal. Provider permission IDs are host policy, never browser
// input and never inferred from another product's conversation context.
func (k *Knowledge) knowledgeAccessPolicy(ctx context.Context, authority knowledgesdk.Authority) ([]string, error) {
	denied := func() error { return connector.PermanentError("knowledge_api.access_denied", nil) }
	if !authority.Known || strings.TrimSpace(authority.RuntimeID) == "" || strings.TrimSpace(authority.UserID) == "" || strings.TrimSpace(authority.WorkspaceID) == "" {
		return nil, denied()
	}
	if k.config.AuthorizeWorkspace != nil {
		if err := k.config.AuthorizeWorkspace(ctx, authority); err != nil {
			return nil, denied()
		}
	} else if authority.WorkspaceID != k.config.WorkspaceID {
		return nil, denied()
	}
	if k.config.PermissionIDs != nil {
		ids, err := k.config.PermissionIDs(ctx, authority)
		if err != nil {
			return nil, denied()
		}
		return slices.Clone(ids), nil
	}
	if k.config.ReadPermissionIDs != nil {
		return slices.Clone(k.config.ReadPermissionIDs), nil
	}
	return slices.Clone(k.config.DocumentPermissionIDs), nil
}
