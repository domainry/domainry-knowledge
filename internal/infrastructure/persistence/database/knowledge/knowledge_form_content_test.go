package store

import (
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

const canonicalFormFixture = `{"schema_version":1,"display":"form","components":[{"type":"textfield","key":"name","label":"姓名","description":"请填写真实姓名","placeholder":"张三","input":true,"validate":{"required":true,"minLength":2,"maxLength":40}},{"type":"radio","key":"attend","label":"是否参加","input":true,"validate":{"required":true},"values":[{"label":"参加","value":"yes"},{"label":"不参加","value":"no"}]},{"type":"number","key":"guests","label":"同行人数","input":true,"validate":{"required":false,"min":0,"max":10},"conditional":{"show":true,"when":"attend","eq":"yes"}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"2026-10-01T00:00:00Z","closes_at":"2026-12-01T00:00:00Z","confirmation_message":"提交成功"}}`

func TestKnowledgeFormCanonicalSchemaAndSearchText(t *testing.T) {
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeForm, knowledgesdk.PageContentSchemaVersion, canonicalFormFixture, "")
	if err != nil || normalized.ContentSHA256 == "" {
		t.Fatalf("canonical form was rejected: normalized=%+v err=%v", normalized, err)
	}
	for _, expected := range []string{"姓名", "真实姓名", "是否参加", "参加", "同行人数"} {
		if !strings.Contains(normalized.PlainText, expected) {
			t.Fatalf("form searchable text lost %q: %q", expected, normalized.PlainText)
		}
	}
}

func TestKnowledgeFormAcceptsRichCoreQuestionTypes(t *testing.T) {
	content := `{"schema_version":1,"display":"form","components":[{"type":"url","key":"site","label":"网站","input":true,"validate":{"required":true,"maxLength":200}},{"type":"phoneNumber","key":"phone","label":"电话","input":true,"inputMask":"","validate":{"required":false}},{"type":"currency","key":"budget","label":"预算","input":true,"currency":"CNY","validate":{"required":true,"min":0,"max":100000}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	if err := validateKnowledgeFormContent(content); err != nil {
		t.Fatalf("rich canonical form types rejected: %v", err)
	}
}

func TestKnowledgeFormAcceptsRatingScaleAndAttachmentQuestions(t *testing.T) {
	content := `{"schema_version":1,"display":"form","components":[{"type":"rating","key":"quality","label":"质量评分","input":true,"validate":{"required":true,"min":1,"max":5}},{"type":"scale","key":"recommend","label":"推荐意愿","input":true,"validate":{"required":false,"min":0,"max":10}},{"type":"file","key":"evidence","label":"证明材料","input":true,"maxFiles":3,"validate":{"required":true}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	if err := validateKnowledgeFormContent(content); err != nil {
		t.Fatalf("rating, scale and attachment questions rejected: %v", err)
	}
}

func TestKnowledgeFormCanonicalSchemaRejectsUnsafeOrAmbiguousDefinitions(t *testing.T) {
	cases := map[string]string{
		"unknown root":         strings.Replace(canonicalFormFixture, `"schema_version":1`, `"schema_version":1,"raw":true`, 1),
		"unknown component":    strings.Replace(canonicalFormFixture, `"type":"textfield"`, `"type":"html"`, 1),
		"duplicate key":        strings.Replace(canonicalFormFixture, `"key":"guests"`, `"key":"name"`, 1),
		"dangling condition":   strings.Replace(canonicalFormFixture, `"when":"attend"`, `"when":"missing"`, 1),
		"invalid option value": strings.Replace(canonicalFormFixture, `"value":"yes"`, `"value":"not allowed"`, 1),
		"invalid deadline":     strings.Replace(canonicalFormFixture, `"closes_at":"2026-12-01T00:00:00Z"`, `"closes_at":"2026-09-01T00:00:00Z"`, 1),
		"invalid role":         strings.Replace(canonicalFormFixture, `"submission_role":"reader"`, `"submission_role":"guest"`, 1),
		"self condition":       strings.Replace(canonicalFormFixture, `"when":"attend"`, `"when":"guests"`, 1),
	}
	cycle := strings.Replace(canonicalFormFixture, `"validate":{"required":true},"values"`, `"validate":{"required":true},"conditional":{"show":true,"when":"guests","eq":1},"values"`, 1)
	cases["condition cycle"] = cycle
	for name, content := range cases {
		t.Run(name, func(t *testing.T) {
			if _, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeForm, knowledgesdk.PageContentSchemaVersion, content, ""); err == nil || !strings.Contains(err.Error(), "page_content_schema_invalid") {
				t.Fatalf("invalid form definition was accepted: %v", err)
			}
		})
	}
}
