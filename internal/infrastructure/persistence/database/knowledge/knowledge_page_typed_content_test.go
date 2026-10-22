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

func TestMultidimensionalTableCanonicalSchemaValidatesFieldsViewsAndRelations(t *testing.T) {
	documentID := "kdoc_" + strings.Repeat("a", 32)
	content := `{"schema_version":1,"fields":[` +
		`{"id":"title","name":"标题","type":"text","required":true},` +
		`{"id":"amount","name":"金额","type":"number"},` +
		`{"id":"status","name":"状态","type":"single_select","options":[{"id":"doing","label":"进行中","color":"#b8e4d2"}]},` +
		`{"id":"tags","name":"标签","type":"multi_select","options":[{"id":"important","label":"重要"}]},` +
		`{"id":"owners","name":"负责人","type":"person"},` +
		`{"id":"date","name":"日期","type":"date"},` +
		`{"id":"files","name":"附件","type":"attachment"},` +
		`{"id":"checked","name":"确认","type":"checkbox"},` +
		`{"id":"progress","name":"进度","type":"progress"},` +
		`{"id":"rating","name":"评分","type":"rating"},` +
		`{"id":"tax","name":"含税金额","type":"formula","formula":"{amount}*1.13"},` +
		`{"id":"related","name":"关联","type":"relation","relation":{"page_id":"self"}},` +
		`{"id":"related_title","name":"关联标题","type":"lookup","lookup":{"relation_field_id":"related","target_field_id":"title"}}],` +
		`"records":[{"id":"r1","values":{"title":"项目 A","amount":10,"status":"doing","tags":["important"],"owners":["user-1"],"date":"2026-10-21","files":[{"document_id":"` + documentID + `","title":"合同.pdf"}],"checked":true,"progress":60,"rating":4,"related":["r1"]}}],` +
		`"views":[` +
		`{"id":"grid","name":"表格","type":"grid","filters":[{"id":"filter-1","field_id":"status","operator":"eq","value":"doing"}],"sorts":[{"field_id":"amount","direction":"desc"}],"hidden_field_ids":["owners"],"frozen_field_ids":["title"],"row_height":"compact","color_rules":[{"id":"color-1","field_id":"status","operator":"eq","value":"doing","color":"#e8f5ef"}],"shared":true},` +
		`{"id":"kanban","name":"看板","type":"kanban","group_by":"status"},` +
		`{"id":"gantt","name":"甘特","type":"gantt","config":{"start_field_id":"date","end_field_id":"date"}},` +
		`{"id":"gallery","name":"画册","type":"gallery","config":{"cover_field_id":"files","title_field_id":"title"}},` +
		`{"id":"form","name":"表单","type":"form"}]}`
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.ContentSHA256 == "" || !strings.Contains(normalized.PlainText, "项目 A") {
		t.Fatalf("canonical multidimensional table rejected: normalized=%+v err=%v", normalized, err)
	}
	for name, invalid := range map[string]string{
		"unknown field type": strings.Replace(content, `"type":"number"`, `"type":"money"`, 1),
		"unsafe formula":     strings.Replace(content, `"formula":"{amount}*1.13"`, `"formula":"globalThis.process"`, 1),
		"dangling relation":  strings.Replace(content, `"related":["r1"]`, `"related":["missing"]`, 1),
		"invalid view field": strings.Replace(content, `"field_id":"status"`, `"field_id":"missing"`, 1),
	} {
		t.Run(name, func(t *testing.T) {
			if _, failure := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, invalid, ""); failure == nil || !strings.Contains(failure.Error(), "page_content_schema_invalid") {
				t.Fatalf("invalid multidimensional content accepted: %v", failure)
			}
		})
	}
}

func TestFilePageContentKeepsOnlyStrictDocumentReferenceMetadata(t *testing.T) {
	documentID := "kdoc_" + strings.Repeat("a", 32)
	content := `{"document_id":"` + documentID + `","display_mode":"preview","title":"产品说明.pdf"}`
	normalized, err := normalizedTypedPageContent(knowledgePageTypeFile, knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil || normalized.PlainText != "产品说明.pdf" || normalized.Summary != normalized.PlainText || strings.Contains(normalized.Content, "http") {
		t.Fatalf("file page reference was not normalized safely: normalized=%+v err=%v", normalized, err)
	}
	for _, invalid := range []string{
		`{"document_id":"kdoc_bad","display_mode":"preview","title":"x"}`,
		`{"document_id":"` + documentID + `","display_mode":"iframe","title":"x"}`,
		`{"document_id":"` + documentID + `","display_mode":"preview","title":"x","url":"https://example.invalid"}`,
	} {
		if _, err = normalizedTypedPageContent(knowledgePageTypeFile, knowledgesdk.PageContentSchemaVersion, invalid, ""); err == nil || !strings.Contains(err.Error(), "page_content_schema_invalid") {
			t.Fatalf("unsafe file page content accepted: content=%s err=%v", invalid, err)
		}
	}
}
