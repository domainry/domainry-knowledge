package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestNativePageContentContracts(t *testing.T) {
	types := []string{
		knowledgesdk.KnowledgePageTypeMultidimensionalTable,
		knowledgesdk.KnowledgePageTypeSpreadsheet,
		knowledgesdk.KnowledgePageTypePresentation,
		knowledgesdk.KnowledgePageTypeForm,
		knowledgesdk.KnowledgePageTypeMindNote,
		knowledgesdk.KnowledgePageTypeWhiteboard,
		knowledgesdk.KnowledgePageTypeMindMap,
		knowledgesdk.KnowledgePageTypeFlowchart,
	}
	for _, contentType := range types {
		t.Run(contentType, func(t *testing.T) {
			content := emptyTypedPageContent(contentType)
			if content == "" {
				t.Fatal("native editor type has no initial content")
			}
			normalized, err := normalizedTypedPageContent(contentType, knowledgesdk.PageContentSchemaVersion, content, "")
			if err != nil || normalized.Content == "" || normalized.ContentSHA256 == "" {
				t.Fatalf("native editor initial content is not persistable: normalized=%+v err=%v", normalized, err)
			}
		})
	}
}

func TestNativePageContentRejectsRemovedFakeEditorShapes(t *testing.T) {
	cases := []struct {
		contentType string
		content     string
	}{
		{knowledgesdk.KnowledgePageTypeSpreadsheet, `{"sheets":[{"id":"s1","rows":[]}]}`},
		{knowledgesdk.KnowledgePageTypeForm, `{"fields":[{"id":"q1","label":"旧问卷字段"}]}`},
	}
	for _, testCase := range cases {
		_, err := normalizedTypedPageContent(testCase.contentType, knowledgesdk.PageContentSchemaVersion, testCase.content, "")
		if err == nil || !strings.Contains(err.Error(), "page_content_schema_invalid") {
			t.Fatalf("removed fake-editor content shape was accepted for %s: %v", testCase.contentType, err)
		}
	}
}
