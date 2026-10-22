package store

import (
	"encoding/json"
	"errors"
	"strings"
	"testing"

	knowledgesdk "github.com/domainry/domainry-knowledge-sdk"
	"github.com/domainry/domainry-orm/query"
)

func nativeValue(t *testing.T, value any) json.RawMessage {
	t.Helper()
	raw, err := json.Marshal(value)
	if err != nil {
		t.Fatal(err)
	}
	return raw
}

func spreadsheetTestRoot(t *testing.T) map[string]any {
	t.Helper()
	var root map[string]any
	if err := json.Unmarshal([]byte(emptyKnowledgeSpreadsheetContent), &root); err != nil {
		t.Fatal(err)
	}
	return root
}

func spreadsheetTestSheet(t *testing.T, id, name string) map[string]any {
	t.Helper()
	root := spreadsheetTestRoot(t)
	workbook := root["workbook"].(map[string]any)
	sheet := workbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
	sheet["id"], sheet["name"] = id, name
	return sheet
}

func spreadsheetTestContent(t *testing.T, mutate func(map[string]any)) string {
	t.Helper()
	root := spreadsheetTestRoot(t)
	if mutate != nil {
		mutate(root)
	}
	raw, err := json.Marshal(root)
	if err != nil {
		t.Fatal(err)
	}
	return string(raw)
}

func TestKnowledgePageNativeGridOperationsMergeDistinctTargets(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-grid-page", Title: "客户表", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := `{"schema_version":1,"fields":[{"id":"title","name":"客户","type":"text"},{"id":"status","name":"状态","type":"text"}],"records":[{"id":"r1","values":{"title":"旧名称"}}],"views":[{"id":"v1","name":"全部记录","type":"grid"}]}`
	page = savePageFixture(t, store, authority, library, page, "native-grid-base", "客户表", content)
	baseRevision := page.Draft.DraftRevision
	first, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-grid-cell-a", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-cell-title", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "r1", ParentID: "title", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash("旧名称"), Value: nativeValue(t, "新名称")}},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-grid-cell-b", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-cell-status", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "r1", ParentID: "status", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, "已完成")}},
	}, authority)
	if err != nil {
		t.Fatalf("distinct stale cell operation did not merge: %v", err)
	}
	if first.View.Draft.DraftRevision != baseRevision+1 || second.View.Draft.DraftRevision != baseRevision+2 {
		t.Fatalf("unexpected merged revisions: first=%d second=%d", first.View.Draft.DraftRevision, second.View.Draft.DraftRevision)
	}
	var merged struct {
		Records []struct {
			ID     string         `json:"id"`
			Values map[string]any `json:"values"`
		} `json:"records"`
	}
	if err = json.Unmarshal([]byte(second.View.Draft.Body.Content), &merged); err != nil {
		t.Fatal(err)
	}
	if len(merged.Records) != 1 || merged.Records[0].Values["title"] != "新名称" || merged.Records[0].Values["status"] != "已完成" {
		t.Fatalf("distinct cell operations were not merged: %+v", merged.Records)
	}
	_, err = store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-grid-cell-conflict", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-cell-title-stale", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "r1", ParentID: "title", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash("旧名称"), Value: nativeValue(t, "覆盖名称")}},
	}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_native_operation_target_conflict" {
		t.Fatalf("same-cell stale operation was not rejected: %v", err)
	}
	var count int
	q, args, buildErr := query.NewSelectBuilder(store.store.Renderer(), knowledgePageNativeOperationTable).Projections(query.Project(query.CountAll())).Where(query.And(query.Equal("scope_key", libraryScope(authority)), query.Equal("page_id", page.Page.ID))).Build()
	if buildErr != nil {
		t.Fatal(buildErr)
	}
	if err = store.store.Database().QueryRowContext(t.Context(), q, args...).Scan(&count); err != nil || count != 2 {
		t.Fatalf("unexpected durable operation count=%d err=%v", count, err)
	}
}

func TestKnowledgePageNativeGridOperationsCoverFieldRecordViewAndCell(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-grid-entities", Title: "项目表", ContentType: knowledgesdk.KnowledgePageTypeMultidimensionalTable}, authority)
	if err != nil {
		t.Fatal(err)
	}
	operations := []knowledgesdk.KnowledgePageNativeOperation{
		{ID: "op-field-owner", Target: knowledgesdk.KnowledgeNativeTargetField, TargetID: "owner", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"id": "owner", "name": "负责人", "type": "text"})},
		{ID: "op-record-r1", Target: knowledgesdk.KnowledgeNativeTargetRecord, TargetID: "r1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"id": "r1", "values": map[string]any{"title": "未命名记录"}})},
		{ID: "op-view-kanban", Target: knowledgesdk.KnowledgeNativeTargetView, TargetID: "kanban", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"id": "kanban", "name": "看板", "type": "kanban"})},
		{ID: "op-cell-owner", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "r1", ParentID: "owner", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, "Alice")},
	}
	result, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{ClientID: "native-grid-entity-batch", BaseDraftRevision: page.Draft.DraftRevision, Operations: operations}, authority)
	if err != nil {
		t.Fatal(err)
	}
	var content map[string]any
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &content); err != nil {
		t.Fatal(err)
	}
	if len(content["fields"].([]any)) != 2 || len(content["records"].([]any)) != 1 || len(content["views"].([]any)) != 2 {
		t.Fatalf("native grid entities were not persisted: %s", result.View.Draft.Body.Content)
	}
	if len(result.Operations) != len(operations) || result.Operations[0].DraftRevision != result.View.Draft.DraftRevision {
		t.Fatalf("operation records do not share the committed draft revision: %+v", result.Operations)
	}
}

func TestKnowledgePageNativeSpreadsheetOperationsMergeDistinctCells(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-sheet-page", Title: "预算", ContentType: knowledgesdk.KnowledgePageTypeSpreadsheet}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := spreadsheetTestContent(t, func(root map[string]any) {
		workbook := root["workbook"].(map[string]any)
		workbook["name"] = "预算"
		sheet := workbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
		sheet["name"] = "预算"
		sheet["cellData"] = map[string]any{"0": map[string]any{"0": map[string]any{"v": "旧值"}}}
	})
	page = savePageFixture(t, store, authority, library, page, "native-sheet-base", "预算", content)
	baseRevision := page.Draft.DraftRevision
	first, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-sheet-cell-a", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-sheet-cell-a", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"v": "旧值"}), Value: nativeValue(t, map[string]any{"v": "新值"})}},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	second, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-sheet-cell-b", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-sheet-cell-b", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:1", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"v": 42})}},
	}, authority)
	if err != nil {
		t.Fatalf("distinct stale spreadsheet cell operation did not merge: %v", err)
	}
	if first.View.Draft.DraftRevision != baseRevision+1 || second.View.Draft.DraftRevision != baseRevision+2 {
		t.Fatalf("unexpected spreadsheet revisions: first=%d second=%d", first.View.Draft.DraftRevision, second.View.Draft.DraftRevision)
	}
	var merged map[string]any
	if err = json.Unmarshal([]byte(second.View.Draft.Body.Content), &merged); err != nil {
		t.Fatal(err)
	}
	cells := merged["workbook"].(map[string]any)["sheets"].(map[string]any)["sheet-1"].(map[string]any)["cellData"].(map[string]any)["0"].(map[string]any)
	if cells["0"].(map[string]any)["v"] != "新值" || cells["1"].(map[string]any)["v"].(float64) != 42 {
		t.Fatalf("spreadsheet cells were not merged: %+v", cells)
	}
	_, err = store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-sheet-cell-conflict", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-sheet-cell-stale", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"v": "旧值"}), Value: nativeValue(t, map[string]any{"v": "覆盖"})}},
	}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_native_operation_target_conflict" {
		t.Fatalf("same spreadsheet cell stale operation was not rejected: %v", err)
	}
}

func TestKnowledgePageNativeSpreadsheetOperationsCoverStructuresFormulaStyleAndMerge(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-sheet-entities", Title: "预算", ContentType: knowledgesdk.KnowledgePageTypeSpreadsheet}, authority)
	if err != nil {
		t.Fatal(err)
	}
	baseRoot := spreadsheetTestRoot(t)
	workbook := baseRoot["workbook"].(map[string]any)
	workbook["name"] = "预算"
	sheet := workbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
	sheet["name"] = "预算"
	sheetStructure := nativeObjectWithout(sheet, "cellData", "mergeData")
	baseContent, err := json.Marshal(baseRoot)
	if err != nil {
		t.Fatal(err)
	}
	page = savePageFixture(t, store, authority, library, page, "native-sheet-entity-base", "预算", string(baseContent))
	updatedSheetStructure := map[string]any{}
	for key, value := range sheetStructure {
		updatedSheetStructure[key] = value
	}
	updatedSheetStructure["name"], updatedSheetStructure["rowCount"] = "年度预算", float64(200)
	secondSheet := spreadsheetTestSheet(t, "sheet-2", "明细")
	operations := []knowledgesdk.KnowledgePageNativeOperation{
		{ID: "op-sheet-structure", Target: knowledgesdk.KnowledgeNativeTargetSheetStructure, TargetID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(sheetStructure), Value: nativeValue(t, updatedSheetStructure)},
		{ID: "op-sheet-cell", Target: knowledgesdk.KnowledgeNativeTargetCell, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"v": 4})},
		{ID: "op-sheet-formula", Target: knowledgesdk.KnowledgeNativeTargetFormula, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"f": "=2+2"})},
		{ID: "op-sheet-cell-style", Target: knowledgesdk.KnowledgeNativeTargetCellStyle, TargetID: "0:0", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, "style-1")},
		{ID: "op-sheet-style", Target: knowledgesdk.KnowledgeNativeTargetStyle, TargetID: "style-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"bl": 1})},
		{ID: "op-sheet-merge", Target: knowledgesdk.KnowledgeNativeTargetMerge, TargetID: "1:0:1:2", ParentID: "sheet-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"startRow": 1, "startColumn": 0, "endRow": 1, "endColumn": 2})},
		{ID: "op-sheet-add", Target: knowledgesdk.KnowledgeNativeTargetSheet, TargetID: "sheet-2", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, secondSheet)},
		{ID: "op-workbook-structure", Target: knowledgesdk.KnowledgeNativeTargetWorkbookStructure, TargetID: "workbook-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(nativeObjectWithout(workbook, "sheets", "styles")), Value: nativeValue(t, func() map[string]any {
			value := nativeObjectWithout(workbook, "sheets", "styles")
			value["name"], value["sheetOrder"] = "年度预算", []any{"sheet-1", "sheet-2"}
			return value
		}())},
	}
	result, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{ClientID: "native-sheet-entity-batch", BaseDraftRevision: page.Draft.DraftRevision, Operations: operations}, authority)
	if err != nil {
		t.Fatal(err)
	}
	var content map[string]any
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &content); err != nil {
		t.Fatal(err)
	}
	resultWorkbook := content["workbook"].(map[string]any)
	if resultWorkbook["name"] != "年度预算" || len(resultWorkbook["sheetOrder"].([]any)) != 2 || len(resultWorkbook["styles"].(map[string]any)) != 1 || len(resultWorkbook["sheets"].(map[string]any)) != 2 {
		t.Fatalf("spreadsheet structures were not persisted: %s", result.View.Draft.Body.Content)
	}
	resultSheet := resultWorkbook["sheets"].(map[string]any)["sheet-1"].(map[string]any)
	cell := resultSheet["cellData"].(map[string]any)["0"].(map[string]any)["0"].(map[string]any)
	if resultSheet["name"] != "年度预算" || cell["f"] != "=2+2" || cell["s"] != "style-1" || len(resultSheet["mergeData"].([]any)) != 1 {
		t.Fatalf("spreadsheet operation partitions were not persisted: sheet=%+v cell=%+v", resultSheet, cell)
	}
	if len(result.Operations) != len(operations) {
		t.Fatalf("spreadsheet operation log missing records: got=%d want=%d", len(result.Operations), len(operations))
	}
}

func TestKnowledgePageNativeWhiteboardOperationsMergeDistinctNodes(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-whiteboard-page", Title: "架构图", ContentType: knowledgesdk.KnowledgePageTypeWhiteboard}, authority)
	if err != nil {
		t.Fatal(err)
	}
	nodeA := whiteboardElementFixture("node-a", "rectangle")
	nodeB := whiteboardElementFixture("node-b", "ellipse")
	nodeA["x"], nodeB["x"] = 10, 20
	content := whiteboardFixture(t, func(root map[string]any) { root["elements"] = []any{nodeA, nodeB} })
	page = savePageFixture(t, store, authority, library, page, "native-whiteboard-base", "架构图", content)
	baseRevision := page.Draft.DraftRevision
	updatedA := map[string]any{}
	updatedB := map[string]any{}
	for key, value := range nodeA {
		updatedA[key] = value
	}
	for key, value := range nodeB {
		updatedB[key] = value
	}
	updatedA["x"], updatedB["x"] = 30, 40
	_, err = store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-whiteboard-node-a", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-whiteboard-a", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "node-a", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(nodeA), Value: nativeValue(t, updatedA)}},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	merged, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-whiteboard-node-b", BaseDraftRevision: baseRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-whiteboard-b", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "node-b", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(nodeB), Value: nativeValue(t, updatedB)}},
	}, authority)
	if err != nil {
		t.Fatalf("distinct stale whiteboard node did not merge: %v", err)
	}
	var result map[string]any
	if err = json.Unmarshal([]byte(merged.View.Draft.Body.Content), &result); err != nil {
		t.Fatal(err)
	}
	nodes := result["elements"].([]any)
	if nodes[0].(map[string]any)["x"].(float64) != 30 || nodes[1].(map[string]any)["x"].(float64) != 40 {
		t.Fatalf("whiteboard node merge failed: %+v", nodes)
	}
}

func TestKnowledgePageNativeMindMapOperationsCoverNodesEdgesAndStructure(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-mindmap-page", Title: "路线图", ContentType: knowledgesdk.KnowledgePageTypeMindMap}, authority)
	if err != nil {
		t.Fatal(err)
	}
	style := map[string]any{"color": "#17332b", "background_color": "#e8f5f0", "font_weight": "normal"}
	content := `{"schema_version":1,"theme":"emerald","layout":"side","compact":true,"root":{"id":"root","text":"中心","expanded":true,"direction":"auto","style":{"color":"#ffffff","background_color":"#00856a","font_weight":"bold"},"children":[{"id":"a","text":"A","expanded":true,"direction":"auto","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"},"children":[]},{"id":"b","text":"B","expanded":true,"direction":"auto","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"},"children":[]}]},"relations":[]}`
	page = savePageFixture(t, store, authority, library, page, "native-mindmap-base", "路线图", content)
	operations := []knowledgesdk.KnowledgePageNativeOperation{
		{ID: "op-mind-b", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "b", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"node": map[string]any{"id": "b", "text": "B", "expanded": true, "direction": "auto", "style": style}, "parent_id": "root", "index": 1}), Value: nativeValue(t, map[string]any{"node": map[string]any{"id": "b", "text": "B2", "expanded": true, "direction": "auto", "style": style}, "parent_id": "root", "index": 0})},
		{ID: "op-mind-a", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "a", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"node": map[string]any{"id": "a", "text": "A", "expanded": true, "direction": "auto", "style": style}, "parent_id": "root", "index": 0}), Value: nativeValue(t, map[string]any{"node": map[string]any{"id": "a", "text": "A", "expanded": true, "direction": "auto", "style": style}, "parent_id": "root", "index": 1})},
		{ID: "op-mind-a1", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "a1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"node": map[string]any{"id": "a1", "text": "A1", "expanded": true, "direction": "auto", "style": style}, "parent_id": "a", "index": 0})},
		{ID: "op-mind-arrow", Target: knowledgesdk.KnowledgeNativeTargetEdge, TargetID: "arrow-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"id": "arrow-1", "from": "a", "to": "b", "label": "关联", "bidirectional": false, "color": "#64748b", "width": 2, "dashed": false})},
		{ID: "op-mind-structure", Target: knowledgesdk.KnowledgeNativeTargetGraphStructure, TargetID: "graph", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"schema_version": json.Number("1"), "theme": "emerald", "layout": "side", "compact": true}), Value: nativeValue(t, map[string]any{"schema_version": 1, "theme": "emerald", "layout": "right", "compact": true})},
	}
	result, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{ClientID: "native-mindmap-batch", BaseDraftRevision: page.Draft.DraftRevision, Operations: operations}, authority)
	if err != nil {
		t.Fatal(err)
	}
	var output map[string]any
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &output); err != nil {
		t.Fatal(err)
	}
	root := output["root"].(map[string]any)
	children := root["children"].([]any)
	if output["layout"].(string) != "right" || children[0].(map[string]any)["id"] != "b" || children[0].(map[string]any)["text"] != "B2" || len(children[1].(map[string]any)["children"].([]any)) != 1 || len(output["relations"].([]any)) != 1 {
		t.Fatalf("mind map operations were not persisted: %s", result.View.Draft.Body.Content)
	}
}

func TestKnowledgePageNativeGraphAwarenessTracksSelectionAndRefreshesSnapshot(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-awareness-page", Title: "协作画板", ContentType: knowledgesdk.KnowledgePageTypeWhiteboard}, authority)
	if err != nil {
		t.Fatal(err)
	}
	nodeA := whiteboardElementFixture("node-a", "rectangle")
	nodeA["x"] = 10
	content := whiteboardFixture(t, func(root map[string]any) { root["elements"] = []any{nodeA} })
	page = savePageFixture(t, store, authority, library, page, "native-awareness-base", "协作画板", content)
	session, err := store.ConnectKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationConnect{ClientID: "native-awareness-client"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	presence, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: session.ServerClock, CursorBlockID: "node-a"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if len(presence.Session.Presence) != 1 || presence.Session.Presence[0].CursorBlockID != "node-a" {
		t.Fatalf("native node awareness was not persisted: %+v", presence.Session.Presence)
	}
	updated, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-awareness-update", BaseDraftRevision: page.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-native-awareness", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "node-a", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(nodeA), Value: func() json.RawMessage {
			next := map[string]any{}
			for key, value := range nodeA {
				next[key] = value
			}
			next["x"] = 20
			return nativeValue(t, next)
		}()}},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	refreshed, err := store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: session.ServerClock, CursorBlockID: "node-a"}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if refreshed.Session.Snapshot.DraftRevision != updated.View.Draft.DraftRevision || refreshed.Session.Snapshot.ContentSHA256 != updated.View.Draft.Body.ContentSHA256 || len(refreshed.Events) != 1 || refreshed.Events[0].Snapshot == nil {
		t.Fatalf("native awareness did not refresh its canonical snapshot: session=%+v events=%+v", refreshed.Session.Snapshot, refreshed.Events)
	}
	_, err = store.SyncKnowledgeCollaboration(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgeCollaborationSync{SessionID: session.ID, AfterClock: refreshed.Session.ServerClock, Update: &knowledgesdk.KnowledgeCollaborationUpdate{ClientID: session.ClientID}}, authority)
	var failure *knowledgesdk.Error
	if !errors.As(err, &failure) || failure.Code != "knowledge.page_collaboration_update_unsupported" {
		t.Fatalf("native awareness accepted a document Yjs update: %v", err)
	}
}

func TestKnowledgePageNativePresentationOperationsCoverSlidesElementsAssetsAndOrder(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-presentation-page", Title: "路演", ContentType: knowledgesdk.KnowledgePageTypePresentation}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := presentationFixture(t, func(root map[string]any) {
		slide := root["slides"].([]any)[0].(map[string]any)
		slide["title"], slide["layout"], slide["notes"] = "第一页", "blank", ""
		slide["elements"] = []any{map[string]any{"id": "shape-1", "type": "shape", "x": 10, "y": 20, "width": 400, "height": 200, "rotation": 0, "shape": "rectangle", "fill_color": "#176B52", "stroke_color": "#176B52", "stroke_width": 2, "text": "增长", "font_size": 32, "font_weight": "bold", "color": "#FFFFFF", "align": "center"}}
	})
	page = savePageFixture(t, store, authority, library, page, "native-presentation-base", "路演", content)
	var baseline map[string]any
	decoder := json.NewDecoder(strings.NewReader(content))
	decoder.UseNumber()
	if err = decoder.Decode(&baseline); err != nil {
		t.Fatal(err)
	}
	baselineSlide := baseline["slides"].([]any)[0].(map[string]any)
	baselineElement := baselineSlide["elements"].([]any)[0].(map[string]any)
	baselineStructure, err := nativePresentationStructure(baseline)
	if err != nil {
		t.Fatal(err)
	}
	updatedElement := map[string]any{"id": "shape-1", "type": "shape", "x": 20, "y": 20, "width": 400, "height": 200, "rotation": 0, "shape": "rectangle", "fill_color": "#176B52", "stroke_color": "#176B52", "stroke_width": 2, "text": "增长", "font_size": 32, "font_weight": "bold", "color": "#FFFFFF", "align": "center"}
	mediaElement := map[string]any{"id": "media-1", "type": "image", "x": 500, "y": 220, "width": 600, "height": 400, "rotation": 0, "asset_id": "asset-1", "fit": "contain"}
	asset := map[string]any{"id": "asset-1", "mime_type": "image/png", "document_ref": "knowledge-document:kdoc_0123456789abcdef0123456789abcdef", "filename": "增长图.png"}
	secondSlide := map[string]any{"id": "slide-2", "title": "第二页", "layout": "blank", "background_color": "", "notes": "", "elements": []any{}, "files": map[string]any{}}
	master := map[string]any{"background_color": "#101D19", "text_color": "#F5F8F6", "accent_color": "#59C89B", "muted_color": "#A8B7AF", "font_family": "Arial", "footer": "", "show_slide_number": true}
	operations := []knowledgesdk.KnowledgePageNativeOperation{
		{ID: "op-slide-meta", Target: knowledgesdk.KnowledgeNativeTargetSlide, TargetID: "slide-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(nativeObjectWithout(baselineSlide, "elements", "files")), Value: nativeValue(t, map[string]any{"id": "slide-1", "title": "封面", "layout": "blank", "background_color": "", "notes": ""})},
		{ID: "op-slide-element", Target: knowledgesdk.KnowledgeNativeTargetElement, TargetID: "shape-1", ParentID: "slide-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(baselineElement), Value: nativeValue(t, updatedElement)},
		{ID: "op-slide-asset", Target: knowledgesdk.KnowledgeNativeTargetAsset, TargetID: "asset-1", ParentID: "slide-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, asset)},
		{ID: "op-slide-media", Target: knowledgesdk.KnowledgeNativeTargetElement, TargetID: "media-1", ParentID: "slide-1", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, mediaElement)},
		{ID: "op-slide-add", Target: knowledgesdk.KnowledgeNativeTargetSlide, TargetID: "slide-2", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, secondSlide)},
		{ID: "op-presentation-structure", Target: knowledgesdk.KnowledgeNativeTargetPresentation, TargetID: "presentation", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(baselineStructure), Value: nativeValue(t, map[string]any{"schema_version": 1, "theme": "midnight", "master": master, "slide_order": []any{"slide-2", "slide-1"}})},
	}
	result, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{ClientID: "native-presentation-batch", BaseDraftRevision: page.Draft.DraftRevision, Operations: operations}, authority)
	if err != nil {
		t.Fatal(err)
	}
	var output map[string]any
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &output); err != nil {
		t.Fatal(err)
	}
	slides := output["slides"].([]any)
	first, second := slides[0].(map[string]any), slides[1].(map[string]any)
	if output["theme"] != "midnight" || first["id"] != "slide-2" || second["title"] != "封面" || second["elements"].([]any)[0].(map[string]any)["x"].(float64) != 20 || len(second["elements"].([]any)) != 2 || len(second["files"].(map[string]any)) != 1 {
		t.Fatalf("presentation operations were not persisted: %s", result.View.Draft.Body.Content)
	}
}

func TestKnowledgePageNativeFormOperationsCoverComponentsAndOrder(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-form-page", Title: "报名表", ContentType: knowledgesdk.KnowledgePageTypeForm}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := `{"schema_version":1,"display":"form","components":[{"type":"textfield","key":"name","label":"姓名","input":true,"validate":{"required":false}},{"type":"email","key":"email","label":"邮箱","input":true,"validate":{"required":false}}],"settings":{"submission_role":"reader","allow_multiple_submissions":false,"opens_at":"","closes_at":"","confirmation_message":"提交成功"}}`
	page = savePageFixture(t, store, authority, library, page, "native-form-base", "报名表", content)
	settings := map[string]any{"submission_role": "reader", "allow_multiple_submissions": false, "opens_at": "", "closes_at": "", "confirmation_message": "提交成功"}
	operations := []knowledgesdk.KnowledgePageNativeOperation{
		{ID: "op-form-email", Target: knowledgesdk.KnowledgeNativeTargetComponent, TargetID: "email", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"type": "email", "key": "email", "label": "邮箱", "input": true, "validate": map[string]any{"required": false}}), Value: nativeValue(t, map[string]any{"type": "email", "key": "email", "label": "工作邮箱", "input": true, "validate": map[string]any{"required": false}})},
		{ID: "op-form-agree", Target: knowledgesdk.KnowledgeNativeTargetComponent, TargetID: "agree", Action: knowledgesdk.KnowledgeNativeOperationUpsert, Value: nativeValue(t, map[string]any{"type": "checkbox", "key": "agree", "label": "同意", "input": true, "validate": map[string]any{"required": false}})},
		{ID: "op-form-structure", Target: knowledgesdk.KnowledgeNativeTargetFormStructure, TargetID: "form", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"schema_version": 1, "display": "form", "settings": settings, "component_order": []any{"name", "email"}}), Value: nativeValue(t, map[string]any{"schema_version": 1, "display": "form", "settings": map[string]any{"submission_role": "reader", "allow_multiple_submissions": false, "opens_at": "", "closes_at": "", "confirmation_message": "已收到报名"}, "component_order": []any{"email", "name", "agree"}})},
	}
	result, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{ClientID: "native-form-batch", BaseDraftRevision: page.Draft.DraftRevision, Operations: operations}, authority)
	if err != nil {
		t.Fatal(err)
	}
	var output map[string]any
	if err = json.Unmarshal([]byte(result.View.Draft.Body.Content), &output); err != nil {
		t.Fatal(err)
	}
	components := output["components"].([]any)
	if output["display"] != "form" || output["settings"].(map[string]any)["confirmation_message"] != "已收到报名" || components[0].(map[string]any)["key"] != "email" || components[0].(map[string]any)["label"] != "工作邮箱" || components[2].(map[string]any)["key"] != "agree" {
		t.Fatalf("form operations were not persisted: %s", result.View.Draft.Body.Content)
	}
}

func TestKnowledgePageNativeOperationsKeepPublishedVersionsImmutable(t *testing.T) {
	store, authority, library, _ := pageFixture(t)
	page, err := store.CreateKnowledgePage(t.Context(), library.ID, knowledgesdk.KnowledgePageCreate{ClientID: "native-version-page", Title: "流程", ContentType: knowledgesdk.KnowledgePageTypeFlowchart}, authority)
	if err != nil {
		t.Fatal(err)
	}
	content := `{"schema_version":1,"theme":"emerald","layout":"free","grid":true,"nodes":[{"id":"start","type":"start","x":10,"y":10,"text":"开始","style":{"color":"#17332b","background_color":"#e8f5f0","font_weight":"normal"}}],"edges":[]}`
	page = savePageFixture(t, store, authority, library, page, "native-version-base", "流程", content)
	published, err := store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePublish{ClientID: "native-version-publish-1", ExpectedPageRevision: page.Page.Revision, ExpectedDraftRevision: page.Draft.DraftRevision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	updated, err := store.ApplyKnowledgePageNativeOperations(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePageNativeOperationBatch{
		ClientID: "native-version-update", BaseDraftRevision: published.Draft.DraftRevision,
		Operations: []knowledgesdk.KnowledgePageNativeOperation{{ID: "op-native-version", Target: knowledgesdk.KnowledgeNativeTargetNode, TargetID: "start", Action: knowledgesdk.KnowledgeNativeOperationUpsert, ExpectedHash: conversationHash(map[string]any{"id": "start", "type": "start", "x": 10, "y": 10, "text": "开始", "style": map[string]any{"color": "#17332b", "background_color": "#e8f5f0", "font_weight": "normal"}}), Value: nativeValue(t, map[string]any{"id": "start", "type": "start", "x": 20, "y": 10, "text": "开始", "style": map[string]any{"color": "#17332b", "background_color": "#e8f5f0", "font_weight": "normal"}})}},
	}, authority)
	if err != nil {
		t.Fatal(err)
	}
	versionOne, err := store.KnowledgePageVersion(t.Context(), library.ID, page.Page.ID, 1, authority)
	if err != nil {
		t.Fatal(err)
	}
	if versionOne.Body.Content != published.Published.Body.Content || versionOne.Body.Content == updated.View.Draft.Body.Content {
		t.Fatalf("native draft operation changed immutable version 1: version=%s draft=%s", versionOne.Body.Content, updated.View.Draft.Body.Content)
	}
	versionTwo, err := store.PublishKnowledgePage(t.Context(), library.ID, page.Page.ID, knowledgesdk.KnowledgePagePublish{ClientID: "native-version-publish-2", ExpectedPageRevision: updated.View.Page.Revision, ExpectedDraftRevision: updated.View.Draft.DraftRevision}, authority)
	if err != nil {
		t.Fatal(err)
	}
	if versionTwo.Published.Version != 2 || versionTwo.Published.Body.Content != updated.View.Draft.Body.Content {
		t.Fatalf("native draft did not pass through canonical publish boundary: %+v", versionTwo.Published)
	}
}
