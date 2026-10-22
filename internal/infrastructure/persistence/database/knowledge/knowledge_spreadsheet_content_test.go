package store

import (
	"encoding/json"
	"strings"
	"testing"

	agentsdk "github.com/domainry/domainry-knowledge-sdk"
	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
)

func spreadsheetCanonicalFixture(t *testing.T) string {
	t.Helper()
	return spreadsheetTestContent(t, func(root map[string]any) {
		workbook := root["workbook"].(map[string]any)
		workbook["name"] = "年度预算"
		sheet := workbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
		sheet["name"] = "预算明细"
		sheet["cellData"] = map[string]any{
			"0": map[string]any{"0": map[string]any{"v": "团队"}, "1": map[string]any{"v": "金额"}},
			"1": map[string]any{"0": map[string]any{"v": "研发"}, "1": map[string]any{"v": 20, "f": "=10*2"}},
		}
		workbook["resources"] = []any{
			map[string]any{"name": "SHEET_DATA_VALIDATION_PLUGIN", "data": `{"sheet-1":[{"uid":"validation-1","ranges":[{"startRow":1,"endRow":8,"startColumn":1,"endColumn":1}],"type":"decimal"}]}`},
			map[string]any{"name": "SHEET_CONDITIONAL_FORMATTING_PLUGIN", "data": `{"sheet-1":[{"cfId":"format-1","ranges":[{"startRow":1,"endRow":8,"startColumn":1,"endColumn":1}],"rule":{"type":"number"}}]}`},
		}
		valueRange := map[string]any{"start_row": 0, "end_row": 8, "start_column": 0, "end_column": 1}
		root["charts"] = []any{map[string]any{"id": "chart-1", "name": "金额趋势", "sheet_id": "sheet-1", "type": "line", "range": valueRange}}
		root["pivots"] = []any{map[string]any{"id": "pivot-1", "name": "团队汇总", "sheet_id": "sheet-1", "aggregate": "sum", "source_range": valueRange}}
		root["protected_ranges"] = []any{map[string]any{"id": "protected-1", "name": "财务锁定", "sheet_id": "sheet-1", "minimum_role": "manager", "range": map[string]any{"start_row": 1, "end_row": 8, "start_column": 1, "end_column": 1}}}
	})
}

func TestSpreadsheetCanonicalSchemaAndSearchProjection(t *testing.T) {
	content := spreadsheetCanonicalFixture(t)
	if err := validateSpreadsheetContent(content); err != nil {
		t.Fatalf("canonical spreadsheet rejected: %v", err)
	}
	plainText, err := spreadsheetPlainText(content)
	if err != nil {
		t.Fatal(err)
	}
	for _, expected := range []string{"年度预算", "预算明细", "研发", "金额趋势", "团队汇总"} {
		if !strings.Contains(plainText, expected) {
			t.Fatalf("search projection missing %q: %s", expected, plainText)
		}
	}
	for _, secret := range []string{"财务锁定", "validation-1", "format-1", "decimal"} {
		if strings.Contains(plainText, secret) {
			t.Fatalf("non-search governance data leaked into projection: %q in %s", secret, plainText)
		}
	}
}

func TestSpreadsheetAcceptsEveryChartAndAggregateType(t *testing.T) {
	for _, chartType := range []string{"column", "bar", "line", "area", "pie", "donut", "scatter", "radar", "funnel", "waterfall"} {
		var root map[string]any
		if err := json.Unmarshal([]byte(spreadsheetCanonicalFixture(t)), &root); err != nil {
			t.Fatal(err)
		}
		root["charts"].([]any)[0].(map[string]any)["type"] = chartType
		encoded, _ := json.Marshal(root)
		if err := validateSpreadsheetContent(string(encoded)); err != nil {
			t.Fatalf("chart type %q rejected: %v", chartType, err)
		}
	}
	for _, aggregate := range []string{"sum", "count", "average", "min", "max"} {
		var root map[string]any
		if err := json.Unmarshal([]byte(spreadsheetCanonicalFixture(t)), &root); err != nil {
			t.Fatal(err)
		}
		root["pivots"].([]any)[0].(map[string]any)["aggregate"] = aggregate
		encoded, _ := json.Marshal(root)
		if err := validateSpreadsheetContent(string(encoded)); err != nil {
			t.Fatalf("aggregate %q rejected: %v", aggregate, err)
		}
	}
}

func TestSpreadsheetCanonicalSchemaRejectsInvalidFeaturesAndResources(t *testing.T) {
	mutate := func(content string, update func(map[string]any)) string {
		var root map[string]any
		if err := json.Unmarshal([]byte(content), &root); err != nil {
			t.Fatal(err)
		}
		update(root)
		raw, err := json.Marshal(root)
		if err != nil {
			t.Fatal(err)
		}
		return string(raw)
	}
	base := spreadsheetCanonicalFixture(t)
	failures := []string{
		mutate(base, func(root map[string]any) { root["unexpected"] = true }),
		mutate(base, func(root map[string]any) {
			root["workbook"].(map[string]any)["resources"] = []any{map[string]any{"name": "UNTRUSTED_PLUGIN", "data": `{}`}}
		}),
		mutate(base, func(root map[string]any) {
			root["charts"].([]any)[0].(map[string]any)["range"].(map[string]any)["end_row"] = 10000
		}),
		mutate(base, func(root map[string]any) { root["charts"] = append(root["charts"].([]any), root["charts"].([]any)[0]) }),
		mutate(base, func(root map[string]any) {
			root["workbook"].(map[string]any)["sheets"].(map[string]any)["sheet-1"].(map[string]any)["cellData"].(map[string]any)["1"].(map[string]any)["1"].(map[string]any)["f"] = "10*2"
		}),
	}
	for index, content := range failures {
		if err := validateSpreadsheetContent(content); err == nil {
			t.Fatalf("invalid spreadsheet fixture %d accepted", index)
		}
	}
}

func TestSpreadsheetProtectedRangesAuthorizeSemanticOperations(t *testing.T) {
	root, err := decodeSpreadsheetRoot(spreadsheetCanonicalFixture(t))
	if err != nil {
		t.Fatal(err)
	}
	editor := agentsdk.KnowledgeLibrary{Role: "editor"}
	authority := agentsdk.Authority{Known: true, RuntimeID: "runtime", WorkspaceID: "workspace", UserID: "bob", RoleKey: "member"}
	allowed := []knowledgesdk.KnowledgePageNativeOperation{{ID: "outside", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"v": "可编辑"})}}
	if err = authorizeSpreadsheetOperations(root, allowed, editor, authority); err != nil {
		t.Fatalf("unprotected cell rejected: %v", err)
	}
	denied := [][]knowledgesdk.KnowledgePageNativeOperation{
		{{ID: "protected-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "1:1", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"v": 100})}},
		{{ID: "protected-merge", Target: knowledgesdk.KnowledgeNativeTargetMerge, TargetID: "1:0:1:2", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"startRow": 1, "startColumn": 0, "endRow": 1, "endColumn": 2})}},
		{{ID: "protection-policy", Target: knowledgesdk.KnowledgeNativeTargetProtectedRange, TargetID: "protected-1", Action: knowledgesdk.KnowledgeNativeOperationDelete}},
	}
	for _, operations := range denied {
		if err = authorizeSpreadsheetOperations(root, operations, editor, authority); err == nil || !strings.Contains(err.Error(), "page_spreadsheet_permission_denied") {
			t.Fatalf("protected spreadsheet operation accepted: operations=%+v err=%v", operations, err)
		}
	}
	if err = authorizeSpreadsheetOperations(root, denied[0], agentsdk.KnowledgeLibrary{Role: "manager"}, authority); err != nil {
		t.Fatalf("manager could not edit protected cell: %v", err)
	}
}

func TestSpreadsheetProtectedRangesAreEnforcedAtStoreBoundary(t *testing.T) {
	store, manager, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "protected-sheet-page", Title: "预算", ContentType: knowledgesdk.KnowledgePageTypeSpreadsheet}, manager)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, manager, library, page, "protected-sheet-content", "预算", spreadsheetCanonicalFixture(t))
	library, err = store.SetKnowledgeLibraryMember(t.Context(), library.ID, "carol", agentsdk.KnowledgeLibraryMemberWrite{Role: "editor", ExpectedRevision: library.Revision}, manager)
	if err != nil {
		t.Fatal(err)
	}
	carol := agentsdk.Authority{Known: true, RuntimeID: manager.RuntimeID, WorkspaceID: manager.WorkspaceID, UserID: "carol", RoleKey: "member"}
	editorView, err := store.KnowledgePage(t.Context(), library.ID, page.Page.ID, true, carol)
	if err != nil || editorView.Draft == nil {
		t.Fatalf("editor could not read protected spreadsheet: view=%+v err=%v", editorView, err)
	}
	allowed, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "protected-sheet-outside", BaseDraftRevision: editorView.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "outside-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"v": "团队"}), Value: nativeValue(t, map[string]any{"v": "部门"})}},
	}, carol)
	if err != nil {
		t.Fatalf("editor could not edit unprotected cell: %v", err)
	}
	_, err = store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "protected-sheet-inside", BaseDraftRevision: allowed.View.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "inside-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "1:1", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"v": json.Number("20")}), Value: nativeValue(t, map[string]any{"v": 99})}},
	}, carol)
	if err == nil || !strings.Contains(err.Error(), "page_spreadsheet_permission_denied") {
		t.Fatalf("protected cell update was not rejected: %v", err)
	}
	var bypassRoot map[string]any
	if err = json.Unmarshal([]byte(allowed.View.Draft.Body.Content), &bypassRoot); err != nil {
		t.Fatal(err)
	}
	bypassRoot["workbook"].(map[string]any)["sheets"].(map[string]any)["sheet-1"].(map[string]any)["cellData"].(map[string]any)["1"].(map[string]any)["1"].(map[string]any)["v"] = 99
	bypassContent, err := json.Marshal(bypassRoot)
	if err != nil {
		t.Fatal(err)
	}
	_, err = store.SaveKnowledgePageDraft(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageDraftWrite{
		ClientID: "protected-sheet-full-save", ExpectedDraftRevision: allowed.View.Draft.DraftRevision, ExpectedPageRevision: allowed.View.Page.Revision,
		Title: allowed.View.Page.Title, ParentPageID: allowed.View.Page.ParentPageID, Rank: allowed.View.Page.Rank,
		ContentSchemaVersion: knowledgesdk.PageContentSchemaVersion, Content: string(bypassContent),
	}, carol)
	if err == nil || !strings.Contains(err.Error(), "page_spreadsheet_native_operation_required") {
		t.Fatalf("full spreadsheet save bypassed protected ranges: %v", err)
	}
}
