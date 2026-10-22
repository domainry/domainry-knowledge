package store

import (
	"encoding/json"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgePageTypeRegistryIsComplete(t *testing.T) {
	if len(knowledgePageTypeRegistry) != 10 {
		t.Fatalf("unexpected page type registry size: %d", len(knowledgePageTypeRegistry))
	}
	for id, definition := range knowledgePageTypeRegistry {
		if definition.ID != id || definition.EmptyContent == nil || definition.Normalize == nil || definition.ExtractPlainText == nil || definition.ExtractSummary == nil || definition.ScanReferences == nil || definition.ValidateBeforePublish == nil {
			t.Fatalf("incomplete page type definition: %q %+v", id, definition)
		}
		if id != knowledgePageTypeFile {
			if _, err := normalizedTypedPageContent(id, knowledgesdk.PageContentSchemaVersion, definition.EmptyContent(), ""); err != nil {
				t.Fatalf("registered empty content is invalid for %q: %v", id, err)
			}
		}
	}
}

func TestKnowledgePageTypeRegistryRejectsDuplicateAndUntrustedContent(t *testing.T) {
	definition := structuredPageTypeDefinition("test", "items", "array", `{"items":[]}`)
	defer func() {
		if recover() == nil {
			t.Fatal("duplicate page type registration did not fail fast")
		}
	}()
	_ = mustKnowledgePageTypeRegistry([]knowledgePageTypeDefinition{definition, definition})
}

func TestKnowledgePagePublishChecksRejectExecutableAndUnresolvedReferences(t *testing.T) {
	if err := validatePageTypeBeforePublish(knowledgesdk.KnowledgePageTypeForm, `{"schema_version":1,"display":"form","components":[{"type":"textfield","key":"name","label":"<script>alert(1)</script>","input":true,"validate":{"required":false}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`); err == nil || !strings.Contains(err.Error(), "page_content_executable_forbidden") {
		t.Fatalf("executable native content was accepted: %v", err)
	}
	unresolved := `{"blocks":[{"id":"reference-1","type":"knowledgeReference","props":{"targetPageId":"","title":"未选择知识条目","targetType":"document","display":"card"},"content":[],"children":[]}]}`
	if err := validatePageTypeBeforePublish(knowledgesdk.KnowledgePageTypeDocument, unresolved); err == nil || !strings.Contains(err.Error(), "page_reference_unresolved") {
		t.Fatalf("unresolved document reference was accepted: %v", err)
	}
	unresolvedMedia := `{"blocks":[{"id":"image-1","type":"image","props":{"url":"","name":"待上传图片"},"children":[]}]}`
	if err := validatePageTypeBeforePublish(knowledgesdk.KnowledgePageTypeDocument, unresolvedMedia); err == nil || !strings.Contains(err.Error(), "page_media_unresolved") {
		t.Fatalf("unresolved document media was accepted: %v", err)
	}
}

func TestKnowledgeBlockRegistryIsCompleteAndStrict(t *testing.T) {
	if len(knowledgeBlockRegistry) != 31 {
		t.Fatalf("unexpected Block registry size: %d", len(knowledgeBlockRegistry))
	}
	for id, definition := range knowledgeBlockRegistry {
		if definition.ID != id || definition.Validator == nil || definition.ExtractPropertyKeys == nil || definition.RequiredAction == "" {
			t.Fatalf("incomplete Block definition: %q %+v", id, definition)
		}
	}
	if err := validateKnowledgeReferenceBlockProperties(map[string]any{"targetPageId": "attacker", "targetType": "html", "display": "script"}); err == nil {
		t.Fatal("invalid knowledge reference properties were accepted")
	}
	for _, id := range []string{"bookmark", "knowledgeReference", "personCard", "externalEmbed", "applicationCard"} {
		if knowledgeBlockRegistry[id].ID != id {
			t.Fatalf("card block is not registered: %s", id)
		}
	}
	if err := validateApplicationCardBlockProperties(map[string]any{"provider": "google", "kind": "calendar_event", "resourceId": "event-123"}); err != nil {
		t.Fatalf("valid application card reference was rejected: %v", err)
	}
	for _, draft := range []map[string]any{
		{"provider": "", "kind": "calendar_event", "resourceId": ""},
		{"provider": "google", "kind": "calendar_event", "resourceId": ""},
		{"provider": "", "kind": "calendar_event", "resourceId": "event-123"},
	} {
		if err := validateApplicationCardBlockProperties(draft); err != nil {
			t.Fatalf("safe incomplete application card draft was rejected: %v", err)
		}
	}
	if err := validateApplicationCardBlockProperties(map[string]any{"provider": "google", "kind": "calendar_event", "resourceId": "event\x00123"}); err == nil {
		t.Fatal("application card accepted a control character in its resource ID")
	}
	if err := validateApplicationCardBlockProperties(map[string]any{"provider": "google", "kind": "calendar_event", "resourceId": "event-123", "accessToken": "secret"}); err == nil {
		t.Fatal("application card accepted provider credentials in canonical page content")
	}
	if err := validateSubpageListBlockProperties(map[string]any{"maxItems": json.Number("10")}); err != nil {
		t.Fatalf("valid subpage list properties were rejected: %v", err)
	}
	if err := validateSubpageListBlockProperties(map[string]any{"maxItems": json.Number("11")}); err == nil {
		t.Fatal("unsupported subpage list limit was accepted")
	}
	if err := validateKnowledgePollBlockProperties(map[string]any{"question": "本周发布吗？"}); err != nil {
		t.Fatalf("valid poll Block properties were rejected: %v", err)
	}
	if err := validateKnowledgePollBlockProperties(map[string]any{"question": "问题", "votes": json.Number("1")}); err == nil {
		t.Fatal("versioned poll vote totals were accepted in Block properties")
	}
}

func TestKnowledgeBlockRegistryRejectsDuplicateDefinitions(t *testing.T) {
	definition := commonKnowledgeBlockDefinition("test")
	defer func() {
		if recover() == nil {
			t.Fatal("duplicate Block registration did not fail fast")
		}
	}()
	_ = mustKnowledgeBlockRegistry([]knowledgeBlockDefinition{definition, definition})
}
