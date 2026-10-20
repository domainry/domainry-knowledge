package module

import (
	"context"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

type datasourceSource struct{}

func (datasourceSource) KnowledgeDocumentSourceIdentity() string { return "source-a" }
func (datasourceSource) KnowledgeDocumentManagementReady() error { return nil }
func (datasourceSource) PutKnowledgeDocument(context.Context, knowledgesdk.KnowledgeDocumentIndexContent, knowledgesdk.Authority) error {
	return nil
}
func (datasourceSource) InspectKnowledgeDocument(context.Context, string, knowledgesdk.Authority) (knowledgesdk.KnowledgeDocumentState, error) {
	return knowledgesdk.KnowledgeDocumentState{}, nil
}
func (datasourceSource) DeleteKnowledgeDocument(context.Context, string, knowledgesdk.Authority) error {
	return nil
}
func (datasourceSource) SearchKnowledge(context.Context, string, knowledgesdk.Authority) (knowledgesdk.Result, error) {
	return knowledgesdk.Result{}, nil
}
func (datasourceSource) ReadKnowledge(context.Context, string, knowledgesdk.Authority) (knowledgesdk.Result, error) {
	return knowledgesdk.Result{}, nil
}
func (datasourceSource) RevalidateKnowledge(context.Context, knowledgesdk.Result, knowledgesdk.Authority) error {
	return nil
}
func (datasourceSource) SearchKnowledgeDocumentPassages(context.Context, string, knowledgesdk.Authority) ([]knowledgesdk.KnowledgeDocumentPassage, error) {
	return nil, nil
}
func (datasourceSource) ReadKnowledgeDocumentPassages(context.Context, string, knowledgesdk.Authority) ([]knowledgesdk.KnowledgeDocumentPassage, error) {
	return nil, nil
}
func (datasourceSource) KnowledgeDocumentAccessPolicySHA256() string { return "policy-a" }
func (datasourceSource) KnowledgeDocumentIndexMaximumBytes() int64   { return 1024 }

func TestSingleDatasourceCatalogKeepsRuntimeWorkspaceAndLibraryScope(t *testing.T) {
	source := datasourceSource{}
	catalog, err := NewSingleDatasourceCatalog("runtime-a", "workspace-a", "primary", "Primary", "Managed source", source)
	if err != nil {
		t.Fatal(err)
	}
	scope := knowledgesdk.KnowledgeDocumentStorageScope{RuntimeID: "runtime-a", WorkspaceID: "workspace-a", LibraryID: "library-a"}
	definitions, err := catalog.KnowledgeDatasources(t.Context(), scope)
	if err != nil || len(definitions) != 1 || definitions[0].Key != "primary" || definitions[0].SourceID != "source-a" {
		t.Fatalf("definitions=%+v error=%v", definitions, err)
	}
	opened, err := catalog.OpenKnowledgeDatasource(t.Context(), "primary", scope)
	if err != nil || opened.KnowledgeDocumentSourceIdentity() != "source-a" {
		t.Fatalf("opened=%v error=%v", opened, err)
	}
	for _, invalid := range []knowledgesdk.KnowledgeDocumentStorageScope{
		{RuntimeID: "other", WorkspaceID: "workspace-a", LibraryID: "library-a"},
		{RuntimeID: "runtime-a", WorkspaceID: "other", LibraryID: "library-a"},
		{RuntimeID: "runtime-a", WorkspaceID: "workspace-a"},
	} {
		if _, err := catalog.OpenKnowledgeDatasource(t.Context(), "primary", invalid); err == nil {
			t.Fatalf("accepted invalid scope %+v", invalid)
		}
	}
}
