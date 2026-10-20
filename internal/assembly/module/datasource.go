package module

import (
	"context"
	"fmt"
	"strings"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
)

// NewSingleDatasourceCatalog exposes one deployment-selected provider to the
// source-owned Knowledge module. The embedding product owns the user-facing
// identity and whether this datasource is selected.
func NewSingleDatasourceCatalog(runtimeID, workspaceID, key, name, description string, source knowledgeprovider.Source) (knowledgesdk.KnowledgeDatasourceCatalog, error) {
	runtimeID, workspaceID = strings.TrimSpace(runtimeID), strings.TrimSpace(workspaceID)
	key, name, description = strings.TrimSpace(key), strings.TrimSpace(name), strings.TrimSpace(description)
	if runtimeID == "" || workspaceID == "" || key == "" || name == "" || source == nil || strings.TrimSpace(source.KnowledgeDocumentSourceIdentity()) == "" {
		return nil, fmt.Errorf("Knowledge datasource catalog configuration is incomplete")
	}
	return &singleDatasourceCatalog{
		runtimeID: runtimeID, workspaceID: workspaceID, source: source,
		definition: knowledgesdk.KnowledgeDatasourceDefinition{Key: key, Name: name, Description: description, SourceID: source.KnowledgeDocumentSourceIdentity()},
	}, nil
}

type singleDatasourceCatalog struct {
	runtimeID, workspaceID string
	source                 knowledgeprovider.Source
	definition             knowledgesdk.KnowledgeDatasourceDefinition
}

func (catalog *singleDatasourceCatalog) KnowledgeDatasources(ctx context.Context, scope knowledgesdk.KnowledgeDocumentStorageScope) ([]knowledgesdk.KnowledgeDatasourceDefinition, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if scope.RuntimeID != catalog.runtimeID || scope.WorkspaceID != catalog.workspaceID {
		return nil, fmt.Errorf("knowledge datasource scope mismatch")
	}
	return []knowledgesdk.KnowledgeDatasourceDefinition{catalog.definition}, nil
}

func (catalog *singleDatasourceCatalog) OpenKnowledgeDatasource(ctx context.Context, key string, scope knowledgesdk.KnowledgeDocumentStorageScope) (knowledgesdk.KnowledgeDatasourceSource, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	if strings.TrimSpace(key) != catalog.definition.Key || scope.RuntimeID != catalog.runtimeID || scope.WorkspaceID != catalog.workspaceID || strings.TrimSpace(scope.LibraryID) == "" {
		return nil, fmt.Errorf("knowledge datasource unavailable")
	}
	return catalog.source, nil
}

var _ knowledgesdk.KnowledgeDatasourceCatalog = (*singleDatasourceCatalog)(nil)
