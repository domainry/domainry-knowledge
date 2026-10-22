package store

import (
	"bytes"
	"encoding/json"
	"strings"
	"testing"
	"time"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-knowledge-sdk/persistence"
)

func TestDurableJSONUsesUnixMillisecondsAndRejectsStringTime(t *testing.T) {
	want := time.Date(2026, time.September, 25, 7, 5, 6, 789000000, time.FixedZone("source", 8*60*60))
	raw, err := marshalDurableJSON(agentsdk.KnowledgeLibrary{CreatedAt: want, UpdatedAt: want})
	if err != nil {
		t.Fatal(err)
	}
	if got := string(raw); !strings.Contains(got, `"created_at":1790291106789`) {
		t.Fatalf("durable JSON must contain UTC Unix milliseconds, got %s", got)
	}
	var decoded agentsdk.KnowledgeLibrary
	if err = unmarshalDurableJSON(raw, &decoded); err != nil {
		t.Fatal(err)
	}
	if !decoded.CreatedAt.Equal(want) {
		t.Fatalf("decoded time = %s, want instant %s", decoded.CreatedAt, want)
	}
	if err = unmarshalDurableJSON([]byte(`{"created_at":"2026-09-25T07:05:06.789+08:00"}`), &decoded); err == nil {
		t.Fatal("expected durable string timestamp to be rejected")
	}
}

func TestOwnedKnowledgeStorageShapesUseNumericInstants(t *testing.T) {
	instant := time.Date(2026, 9, 25, 0, 0, 0, 123_000_000, time.UTC)
	tests := []struct {
		name   string
		value  any
		target any
	}{
		{"library", agentsdk.KnowledgeLibrary{CreatedAt: instant, UpdatedAt: instant}, &agentsdk.KnowledgeLibrary{}},
		{"member", agentsdk.KnowledgeLibraryMember{UpdatedAt: instant}, &agentsdk.KnowledgeLibraryMember{}},
		{"document", persistence.KnowledgeDocumentRecord{Document: agentsdk.KnowledgeDocument{CreatedAt: instant, UpdatedAt: instant}}, &persistence.KnowledgeDocumentRecord{}},
		{"document lease", persistence.KnowledgeDocumentLease{ExpiresAt: instant}, &persistence.KnowledgeDocumentLease{}},
		{"datasource", persistence.KnowledgeDatasourceBinding{CreatedAt: instant}, &persistence.KnowledgeDatasourceBinding{}},
		{"page view", knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{CreatedAt: instant, UpdatedAt: instant}, Published: &knowledgesdk.KnowledgePageVersion{PublishedAt: instant}, Draft: &knowledgesdk.KnowledgePageDraft{UpdatedAt: instant}, Governance: knowledgesdk.KnowledgePageContentGovernance{Classification: knowledgesdk.KnowledgePageClassificationRestricted, DynamicWatermark: &knowledgesdk.KnowledgePageDynamicWatermark{Text: "alice · 2026-09-25 00:00 UTC", GeneratedAt: instant}}}, &knowledgesdk.KnowledgePageView{}},
		{"grid automation result", knowledgesdk.KnowledgeGridAutomationResult{View: knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{CreatedAt: instant, UpdatedAt: instant}, Draft: &knowledgesdk.KnowledgePageDraft{UpdatedAt: instant}}, AutomationID: "automation-1", RecordID: "record-1", FieldID: "field-1", Applied: true}, &knowledgesdk.KnowledgeGridAutomationResult{}},
		{"page page", knowledgesdk.KnowledgePagePage{Items: []knowledgesdk.KnowledgePage{{HasChildren: true, CreatedAt: instant, UpdatedAt: instant}}, Complete: true}, &knowledgesdk.KnowledgePagePage{}},
		{"page metadata", knowledgesdk.KnowledgePageMetadata{NextReviewAt: &instant, UpdatedAt: &instant, Tags: []string{}, Properties: []knowledgesdk.KnowledgePageCustomProperty{}}, &knowledgesdk.KnowledgePageMetadata{}},
		{"page task", knowledgesdk.KnowledgePageTask{DueAt: &instant, ReminderAt: &instant, CreatedAt: instant, UpdatedAt: instant}, &knowledgesdk.KnowledgePageTask{}},
		{"page poll", knowledgesdk.KnowledgePagePoll{CreatedAt: instant, UpdatedAt: instant}, &knowledgesdk.KnowledgePagePoll{}},
		{"page poll view", knowledgesdk.KnowledgePagePollView{Poll: knowledgesdk.KnowledgePagePoll{CreatedAt: instant, UpdatedAt: instant}}, &knowledgesdk.KnowledgePagePollView{}},
		{"page template", knowledgesdk.KnowledgePageTemplate{CreatedAt: instant, UpdatedAt: instant}, &knowledgesdk.KnowledgePageTemplate{}},
		{"page template version", knowledgesdk.KnowledgePageTemplateVersion{CreatedAt: instant}, &knowledgesdk.KnowledgePageTemplateVersion{}},
		{"page template instance", knowledgesdk.KnowledgePageTemplateInstance{Root: knowledgesdk.KnowledgePageView{Page: knowledgesdk.KnowledgePage{CreatedAt: instant, UpdatedAt: instant}, Draft: &knowledgesdk.KnowledgePageDraft{UpdatedAt: instant}}}, &knowledgesdk.KnowledgePageTemplateInstance{}},
		{"page content policy", knowledgesdk.KnowledgePageContentPolicy{PageID: "page-1", LibraryID: "library-1", Scope: knowledgesdk.KnowledgePageContentPolicySubtree, AllowCopy: true, AllowDownload: true, AllowPrint: true, AllowExport: true, AllowDuplicate: true, Classification: knowledgesdk.KnowledgePageClassificationConfidential, WatermarkMode: knowledgesdk.KnowledgePageWatermarkIdentity, SensitiveAction: knowledgesdk.KnowledgePageSensitiveContentAllow, RequireApproval: true, Revision: 1, UpdatedByUserID: "manager-1", UpdatedAt: instant}, &knowledgesdk.KnowledgePageContentPolicy{}},
		{"webhook subscription", knowledgesdk.KnowledgeWebhookSubscription{CreatedAt: instant, UpdatedAt: instant}, &knowledgesdk.KnowledgeWebhookSubscription{}},
		{"webhook event", knowledgesdk.KnowledgeWebhookEvent{OccurredAt: instant}, &knowledgesdk.KnowledgeWebhookEvent{}},
		{"webhook delivery", knowledgesdk.KnowledgeWebhookDelivery{NextAttemptAt: instant, UpdatedAt: instant}, &knowledgesdk.KnowledgeWebhookDelivery{}},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			raw, err := marshalDurableJSON(test.value)
			if err != nil {
				t.Fatal(err)
			}
			if !bytes.Contains(raw, []byte(`1790294400123`)) || bytes.Contains(raw, []byte(`"2026-09-25T00:00:00.123Z"`)) {
				t.Fatalf("owned instant must be a number: %s", raw)
			}
			if err := unmarshalDurableJSON(raw, test.target); err != nil {
				t.Fatal(err)
			}
			want, err := json.Marshal(test.value)
			if err != nil {
				t.Fatal(err)
			}
			got, err := json.Marshal(test.target)
			if err != nil || !bytes.Equal(got, want) {
				t.Fatalf("round trip got=%s want=%s err=%v", got, want, err)
			}
		})
	}
}
