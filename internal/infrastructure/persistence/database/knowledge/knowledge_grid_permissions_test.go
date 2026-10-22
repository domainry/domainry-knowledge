package store

import (
	"encoding/json"
	"errors"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func restrictedGridFixture() string {
	return `{"schema_version":1,` +
		`"fields":[` +
		`{"id":"title","name":"标题","type":"text"},` +
		`{"id":"status","name":"状态","type":"text"},` +
		`{"id":"secret","name":"机密金额","type":"number"},` +
		`{"id":"computed","name":"机密金额两倍","type":"formula","formula":"{secret}*2"}],` +
		`"records":[` +
		`{"id":"public","values":{"title":"公开项目","status":"进行中","secret":42}},` +
		`{"id":"private","values":{"title":"绝密项目","status":"未公开","secret":99}}],` +
		`"views":[` +
		`{"id":"public-view","name":"公开视图","type":"grid","filters":[{"id":"secret-filter","field_id":"secret","operator":"gte","value":40}],"sorts":[{"field_id":"secret","direction":"desc"}],"hidden_field_ids":["secret"],"frozen_field_ids":["title","secret"]},` +
		`{"id":"private-view","name":"绝密视图","type":"grid"}],` +
		`"permissions":{` +
		`"table":{"read":["role:reader"],"write":["role:editor"]},` +
		`"fields":{"secret":{"read":["role:manager"],"write":["role:manager"]}},` +
		`"records":{"private":{"read":["role:manager"],"write":["role:manager"]}},` +
		`"views":{"private-view":{"read":["role:manager"],"write":["role:manager"]}}},` +
		`"automations":[{"id":"set-secret","enabled":true,"trigger":"record_updated","action":"set_field","field_id":"secret","value":777,"idempotency_key":"set-secret-v1"}]}`
}

func decodeGridTestBody(t *testing.T, content string) map[string]any {
	t.Helper()
	var root map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err := decoder.Decode(&root); err != nil {
		t.Fatal(err)
	}
	return root
}

func TestGridPermissionsValidateAndKeepRestrictedValuesOutOfSearch(t *testing.T) {
	content := restrictedGridFixture()
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, content, "")
	if err != nil {
		t.Fatal(err)
	}
	for _, visible := range []string{"公开项目", "公开视图", "状态"} {
		if !strings.Contains(normalized.PlainText, visible) {
			t.Fatalf("universally readable value missing from search text: %q in %q", visible, normalized.PlainText)
		}
	}
	for _, protected := range []string{"绝密项目", "机密金额", "绝密视图", "set-secret", "777"} {
		if strings.Contains(normalized.PlainText, protected) {
			t.Fatalf("protected grid value leaked into search text: %q in %q", protected, normalized.PlainText)
		}
	}

	invalid := strings.Replace(content, `"fields":{"secret":`, `"fields":{"missing":`, 1)
	if _, failure := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, invalid, ""); failure == nil || !strings.Contains(failure.Error(), "page_content_schema_invalid") {
		t.Fatalf("dangling field permission was accepted: %v", failure)
	}
	invalid = strings.Replace(content, `"role:manager"`, `"group:finance"`, 1)
	if _, failure := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, invalid, ""); failure == nil || !strings.Contains(failure.Error(), "page_content_schema_invalid") {
		t.Fatalf("unknown permission selector was accepted: %v", failure)
	}
}

func TestGridPermissionsRedactReadExportAndDerivedFieldsByRole(t *testing.T) {
	normalized, err := normalizedTypedPageContent(knowledgesdk.KnowledgePageTypeMultidimensionalTable, knowledgesdk.PageContentSchemaVersion, restrictedGridFixture(), "")
	if err != nil {
		t.Fatal(err)
	}
	body := knowledgesdk.PageContent{ContentSchemaVersion: normalized.ContentSchemaVersion, Content: normalized.Content, ContentSHA256: normalized.ContentSHA256, PlainText: normalized.PlainText, Summary: normalized.Summary}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "bob", RoleKey: "member"}

	readerBody, readerAccess, err := redactGridBody(body, agentsdk.KnowledgeLibrary{Role: "reader"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if readerAccess.Write || readerAccess.Manage || readerAccess.FieldWrite["title"] || readerAccess.RecordWrite["public"] || readerAccess.ViewWrite["public-view"] {
		t.Fatalf("reader received write access: %+v", readerAccess)
	}
	for _, protected := range []string{"绝密项目", "机密金额", "绝密视图", `"computed"`, `"permissions"`, `"automations"`, "777"} {
		if strings.Contains(readerBody.Content, protected) || strings.Contains(readerBody.PlainText, protected) {
			t.Fatalf("reader export payload leaked protected content %q: body=%s text=%s", protected, readerBody.Content, readerBody.PlainText)
		}
	}
	readerRoot := decodeGridTestBody(t, readerBody.Content)
	views, _ := readerRoot["views"].([]any)
	publicView, _ := views[0].(map[string]any)
	if filters, _ := publicView["filters"].([]any); len(filters) != 0 {
		t.Fatalf("view retained a filter on a hidden field: %+v", publicView)
	}
	if frozen, _ := publicView["frozen_field_ids"].([]any); len(frozen) != 1 || frozen[0] != "title" {
		t.Fatalf("view retained hidden field metadata: %+v", publicView)
	}

	editorBody, editorAccess, err := redactGridBody(body, agentsdk.KnowledgeLibrary{Role: "editor"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !editorAccess.Write || editorAccess.Manage || !editorAccess.FieldWrite["title"] || !editorAccess.RecordWrite["public"] || !editorAccess.ViewWrite["public-view"] {
		t.Fatalf("editor access map is wrong: %+v", editorAccess)
	}
	if strings.Contains(editorBody.Content, `"automations"`) || strings.Contains(editorBody.Content, "绝密项目") || strings.Contains(editorBody.Content, `"secret"`) {
		t.Fatalf("editor redaction leaked manager-only configuration: %s", editorBody.Content)
	}

	managerBody, managerAccess, err := redactGridBody(body, agentsdk.KnowledgeLibrary{Role: "manager"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if !managerAccess.Write || !managerAccess.Manage || !strings.Contains(managerBody.Content, "绝密项目") || !strings.Contains(managerBody.Content, `"automations"`) {
		t.Fatalf("manager did not retain governed grid data: access=%+v body=%s", managerAccess, managerBody.Content)
	}
}

func TestGridPermissionsAuthorizeSemanticWrites(t *testing.T) {
	root := decodeGridTestBody(t, restrictedGridFixture())
	library := agentsdk.KnowledgeLibrary{Role: "editor"}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "bob", RoleKey: "member"}
	allowed := []knowledgesdk.KnowledgePageNativeOperation{{ID: "public-write", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "public", ParentID: "status", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, "完成")}}
	if err := authorizeGridOperations(root, allowed, library, authority); err != nil {
		t.Fatalf("editor could not write an allowed cell: %v", err)
	}
	denied := [][]knowledgesdk.KnowledgePageNativeOperation{
		{{ID: "secret-field", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "public", ParentID: "secret", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, 100)}},
		{{ID: "secret-record", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "private", ParentID: "status", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, "泄漏")}},
		{{ID: "permissions", Target: knowledgesdk.KnowledgeNativeTargetTableStructure, TargetID: "table", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"schema_version": 1})}},
	}
	for _, operations := range denied {
		if err := authorizeGridOperations(root, operations, library, authority); err == nil || !strings.Contains(err.Error(), "page_grid_permission_denied") {
			t.Fatalf("restricted semantic operation was accepted: operations=%+v err=%v", operations, err)
		}
	}
	if err := authorizeGridOperations(root, denied[0], agentsdk.KnowledgeLibrary{Role: "manager"}, authority); err != nil {
		t.Fatalf("manager governance bypass failed: %v", err)
	}
}

func TestKnowledgePageGridPermissionsAreEnforcedAtStoreBoundary(t *testing.T) {
	store, manager, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "permission-grid-page", Title: "权限项目表", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, manager, library, page, "permission-grid-content", "权限项目表", restrictedGridFixture())
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "bob", agentsdk.KnowledgeLibraryMemberWrite{Role: "reader", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "carol", agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page = publishPageFixture(t, store, manager, library, page, "permission-grid-publish")
	bob := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "bob", RoleKey: "member"}
	carol := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "carol", RoleKey: "member"}

	readerView, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, false, bob)
	if err != nil {
		t.Fatal(err)
	}
	if readerView.Published == nil || readerView.GridAccess == nil || readerView.GridAccess.Write || strings.Contains(readerView.Published.Body.Content, "绝密项目") || strings.Contains(readerView.Published.Body.Content, `"secret"`) {
		t.Fatalf("reader store response was not redacted: %+v", readerView)
	}
	editorView, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, carol)
	if err != nil {
		t.Fatal(err)
	}
	if editorView.Draft == nil || editorView.GridAccess == nil || !editorView.GridAccess.Write || editorView.GridAccess.Manage || strings.Contains(editorView.Draft.Body.Content, "绝密项目") || strings.Contains(editorView.Draft.Body.Content, `"automations"`) {
		t.Fatalf("editor store response was not safely writable: %+v", editorView)
	}

	allowed, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "permission-grid-allowed", BaseDraftRevision: editorView.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "permission-public-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "public", ParentID: "status", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash("进行中"), Value: nativeValue(t, "完成")}},
	}, carol)
	if err != nil {
		t.Fatalf("allowed editor cell update failed: %v", err)
	}
	_, err = store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "permission-grid-denied", BaseDraftRevision: allowed.View.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "permission-secret-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "public", ParentID: "secret", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(json.Number("42")), Value: nativeValue(t, 100)}},
	}, carol)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_grid_permission_denied" {
		t.Fatalf("restricted editor cell update was not rejected: %v", err)
	}
	_, err = store.ExecuteKnowledgeGridAutomation(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeGridAutomationExecute{ExecutionID: "permission-auto-secret", AutomationID: "set-secret", Trigger: knowledgesdk.KnowledgeGridAutomationTriggerRecordUpdated, RecordID: "public", ExpectedDraftRevision: allowed.View.Draft.DraftRevision}, carol)
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_grid_permission_denied" {
		t.Fatalf("automation bypassed its protected field permission: %v", err)
	}

	managerView, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, manager)
	if err != nil {
		t.Fatal(err)
	}
	if managerView.Draft == nil || managerView.GridAccess == nil || !managerView.GridAccess.Manage || !strings.Contains(managerView.Draft.Body.Content, "绝密项目") || !strings.Contains(managerView.Draft.Body.Content, `"automations"`) {
		t.Fatalf("manager lost governed grid data: %+v", managerView)
	}
}
