package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestMindNoteContentStrictSchemaAndSearchText(t *testing.T) {
	content := `{"schema_version":1,"nodes":[{"id":"goal","text":"发布目标","completed":true,"collapsed":false,"priority":"urgent","due_date":"2026-10-31","tags":["产品","上线"],"note":"先完成灰度验收","children":[{"id":"step","text":"完成验收","completed":false,"collapsed":true,"children":[]}]}]}`
	if err := validateMindNoteContent(content); err != nil {
		t.Fatalf("validate mind note: %v", err)
	}
	definition := mindNotePageTypeDefinition()
	normalized, err := definition.Normalize(knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatalf("normalize mind note: %v", err)
	}
	for _, expected := range []string{"发布目标", "灰度验收", "产品", "完成验收"} {
		if !strings.Contains(normalized.PlainText, expected) {
			t.Fatalf("mind note searchable text omitted %q: %q", expected, normalized.PlainText)
		}
	}
	if normalized.Summary == "" {
		t.Fatalf("unexpected mind note text: plain=%q summary=%q", normalized.PlainText, normalized.Summary)
	}
}

func TestMindNoteContentRejectsLegacyAndInvalidTrees(t *testing.T) {
	cases := map[string]string{
		"legacy BlockNote snapshot": `{"nodes":[{"id":"n1","type":"bulletListItem","props":{},"content":[],"children":[]}]}`,
		"unknown field":             `{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":false,"collapsed":false,"children":[],"script":"alert(1)"}]}`,
		"duplicate id":              `{"schema_version":1,"nodes":[{"id":"same","text":"A","completed":false,"collapsed":false,"children":[{"id":"same","text":"B","completed":false,"collapsed":false,"children":[]}]}]}`,
		"empty roots":               `{"schema_version":1,"nodes":[]}`,
		"wrong completed type":      `{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":"yes","collapsed":false,"children":[]}]}`,
		"unsafe id":                 `{"schema_version":1,"nodes":[{"id":"bad id","text":"A","completed":false,"collapsed":false,"children":[]}]}`,
		"control character":         "{\"schema_version\":1,\"nodes\":[{\"id\":\"n1\",\"text\":\"A\\u0007B\",\"completed\":false,\"collapsed\":false,\"children\":[]}]}",
		"utf8 byte overflow":        `{"schema_version":1,"nodes":[{"id":"n1","text":"` + strings.Repeat("知", 1366) + `","completed":false,"collapsed":false,"children":[]}]}`,
		"invalid priority":          `{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":false,"collapsed":false,"priority":"critical","children":[]}]}`,
		"invalid due date":          `{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":false,"collapsed":false,"due_date":"2026-02-30","children":[]}]}`,
		"duplicate tags":            `{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":false,"collapsed":false,"tags":["重复","重复"],"children":[]}]}`,
	}
	for name, content := range cases {
		t.Run(name, func(t *testing.T) {
			if err := validateMindNoteContent(content); err == nil || !strings.Contains(err.Error(), "page_content_schema_invalid") {
				t.Fatalf("expected schema rejection, got %v", err)
			}
		})
	}
}
