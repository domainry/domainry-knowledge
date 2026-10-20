package product

import (
	"context"
	"fmt"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgeprovider "github.com/domainry/domainry-knowledge-sdk/provider"
)

type singleDatasourceCatalog struct {
	runtimeID, workspaceID string
	source                 knowledgeprovider.Source
	definition             knowledgesdk.KnowledgeDatasourceDefinition
}

func newSingleDatasourceCatalog(runtimeID, workspaceID string, source knowledgeprovider.Source) *singleDatasourceCatalog {
	return &singleDatasourceCatalog{
		runtimeID: runtimeID, workspaceID: workspaceID, source: source,
		definition: knowledgesdk.KnowledgeDatasourceDefinition{Key: "primary", Name: "主知识索引", Description: "Knowledge SaaS 配置的真实知识检索与文档索引后端", SourceID: source.KnowledgeDocumentSourceIdentity()},
	}
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
	if key != catalog.definition.Key || scope.RuntimeID != catalog.runtimeID || scope.WorkspaceID != catalog.workspaceID || scope.LibraryID == "" {
		return nil, fmt.Errorf("knowledge datasource unavailable")
	}
	return catalog.source, nil
}

var _ knowledgesdk.KnowledgeDatasourceCatalog = (*singleDatasourceCatalog)(nil)
