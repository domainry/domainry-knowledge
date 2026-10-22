package store

import (
	"encoding/json"
	"errors"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func TestKnowledgeGridAutomationExecutesAsAuthorizedIdempotentAction(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "grid-automation-page", Title: "项目", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := `{"schema_version":1,"fields":[{"id":"title","name":"标题","type":"text","required":true},{"id":"status","name":"状态","type":"single_select","options":[{"id":"todo","label":"待处理"},{"id":"doing","label":"进行中"}]}],"records":[{"id":"r1","values":{"title":"任务 A","status":"todo"}}],"views":[{"id":"grid","name":"表格","type":"grid"}],"automations":[{"id":"auto-start","enabled":true,"trigger":"record_updated","action":"set_field","field_id":"status","value":"doing","idempotency_key":"auto-start-v1"}]}`
	page = savePageFixture(t, store, authority, library, page, "grid-automation-base", "项目", content)
	input := knowledgesdk.KnowledgeGridAutomationExecute{ExecutionID: "event-update-r1-auto-start", AutomationID: "auto-start", Trigger: knowledgesdk.KnowledgeGridAutomationTriggerRecordUpdated, RecordID: "r1", ExpectedDraftRevision: page.Draft.DraftRevision}
	result, err := store.ExecuteKnowledgeGridAutomation(t.Context(), library.ID, page.Page.ID, input, authority)
	if err != nil || !result.Applied || result.FieldID != "status" || result.View.Draft == nil || result.View.Draft.DraftRevision != page.Draft.DraftRevision+1 {
		t.Fatalf("automation execution failed: result=%+v err=%v", result, err)
	}
	var root struct {
		Records []struct {
			ID     string         `json:"id"`
			Values map[string]any `json:"values"`
		} `json:"records"`
	}
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &root); err != nil || len(root.Records) != 1 || root.Records[0].Values["status"] != "doing" {
		t.Fatalf("automation did not update its canonical target: root=%+v err=%v", root, err)
	}
	replayed, err := store.ExecuteKnowledgeGridAutomation(t.Context(), library.ID, page.Page.ID, input, authority)
	if err != nil || replayed.View.Draft == nil || replayed.View.Draft.DraftRevision != result.View.Draft.DraftRevision {
		t.Fatalf("same execution was not idempotent: replay=%+v err=%v", replayed, err)
	}
	_, err = store.ExecuteKnowledgeGridAutomation(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeGridAutomationExecute{ExecutionID: "event-stale-r1-auto-start", AutomationID: "auto-start", Trigger: knowledgesdk.KnowledgeGridAutomationTriggerRecordUpdated, RecordID: "r1", ExpectedDraftRevision: page.Draft.DraftRevision}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_grid_automation_revision_conflict" {
		t.Fatalf("stale automation execution was not rejected: %v", err)
	}
}
