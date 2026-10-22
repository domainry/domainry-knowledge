import assert from "node:assert/strict";
import test from "node:test";
import { flowchartOperations, formOperations, mindMapOperations, multidimensionalTableOperations, nativePageOperations, nativeValueSHA256, presentationOperations, spreadsheetOperations, whiteboardOperations } from "../src/nativeOperations.ts";
import { emptyPresentationContent, presentationThemes } from "../src/presentationContent.ts";

function spreadsheetEnvelope(workbook: Record<string, unknown>, features: Partial<{ charts: Array<Record<string, unknown>>; pivots: Array<Record<string, unknown>>; protected_ranges: Array<Record<string, unknown>> }> = {}) {
  return JSON.stringify({ schema_version: 1, workbook, charts: features.charts || [], pivots: features.pivots || [], protected_ranges: features.protected_ranges || [] });
}

test("multidimensional table changes become field, record, view, and cell operations", async () => {
  const before = JSON.stringify({
    fields: [{ id: "title", name: "标题", type: "text" }, { id: "status", name: "状态", type: "text" }],
    records: [{ id: "r1", values: { title: "旧标题", status: "待处理" } }],
    views: [{ id: "all", name: "全部", type: "grid" }],
  });
  const after = JSON.stringify({
    fields: [{ id: "title", name: "客户", type: "text" }, { id: "status", name: "状态", type: "text" }, { id: "owner", name: "负责人", type: "text" }],
    records: [{ id: "r1", values: { title: "新标题", status: "待处理", owner: "Alice" } }, { id: "r2", values: { title: "第二条" } }],
    views: [{ id: "all", name: "全部", type: "grid" }, { id: "mine", name: "我的", type: "grid" }],
  });
  const operations = await multidimensionalTableOperations(before, after);
  assert.equal(operations.filter(operation => operation.target === "field").length, 2);
  assert.equal(operations.filter(operation => operation.target === "record").length, 1);
  assert.equal(operations.filter(operation => operation.target === "view").length, 1);
  assert.equal(operations.filter(operation => operation.target === "cell").length, 2);
  const title = operations.find(operation => operation.target === "cell" && operation.parent_id === "title");
  assert.equal(title?.expected_hash, await nativeValueSHA256("旧标题"));
  assert.equal(title?.value, "新标题");
  assert.ok(operations.every(operation => operation.id && operation.target_id && operation.action === "upsert"));
});

test("field deletion owns dependent cells instead of emitting invalid cell deletes", async () => {
  const before = JSON.stringify({ fields: [{ id: "title", name: "标题", type: "text" }, { id: "obsolete", name: "旧字段", type: "text" }], records: [{ id: "r1", values: { title: "记录", obsolete: "旧值" } }], views: [] });
  const after = JSON.stringify({ fields: [{ id: "title", name: "标题", type: "text" }], records: [{ id: "r1", values: { title: "记录" } }], views: [] });
  const operations = await multidimensionalTableOperations(before, after);
  assert.equal(operations.length, 1);
  assert.equal(operations[0].target, "field");
  assert.equal(operations[0].target_id, "obsolete");
  assert.equal(operations[0].action, "delete");
});

test("spreadsheet changes are partitioned by workbook, sheet, cell, formula, style, and merge", async () => {
  const sheet = {
    id: "sheet-1", name: "预算", rowCount: 100, columnCount: 20,
    cellData: { "0": { "0": { v: "旧值", f: "=1+1", s: "style-1" } } },
    mergeData: [{ startRow: 1, startColumn: 0, endRow: 1, endColumn: 1 }],
  };
  const before = spreadsheetEnvelope({ id: "workbook-1", name: "预算", sheetOrder: ["sheet-1"], styles: { "style-1": { bl: 1 } }, sheets: { "sheet-1": sheet } });
  const after = spreadsheetEnvelope({
    id: "workbook-1", name: "年度预算", sheetOrder: ["sheet-1", "sheet-2"], styles: { "style-1": { bl: 0 }, "style-2": { it: 1 } },
    sheets: {
      "sheet-1": { ...sheet, name: "年度预算", cellData: { "0": { "0": { v: "新值", f: "=2+2", s: "style-2" } } }, mergeData: [...sheet.mergeData, { startRow: 2, startColumn: 0, endRow: 2, endColumn: 2 }] },
      "sheet-2": { id: "sheet-2", name: "明细", rowCount: 100, columnCount: 20, cellData: {}, mergeData: [] },
    },
  });
  const operations = await spreadsheetOperations(before, after);
  for (const target of ["sheet", "workbook_structure", "sheet_structure", "cell", "formula", "cell_style", "style", "merge"] as const) {
    assert.ok(operations.some(operation => operation.target === target), `missing ${target} operation`);
  }
  const cell = operations.find(operation => operation.target === "cell");
  assert.equal(cell?.target_id, "0:0");
  assert.equal(cell?.parent_id, "sheet-1");
  assert.deepEqual(cell?.value, { v: "新值" });
  assert.equal(cell?.expected_hash, await nativeValueSHA256({ v: "旧值" }));
  assert.equal((await nativePageOperations("spreadsheet", before, after))?.length, operations.length);
});

test("spreadsheet cell partitions can be deleted independently", async () => {
  const before = spreadsheetEnvelope({
    id: "workbook-1", sheetOrder: ["sheet-1"], styles: {},
    sheets: { "sheet-1": { id: "sheet-1", cellData: { "0": { "0": { v: 7, f: "=3+4", s: "style-1" } } }, mergeData: [] } },
  });
  const after = spreadsheetEnvelope({
    id: "workbook-1", sheetOrder: ["sheet-1"], styles: {},
    sheets: { "sheet-1": { id: "sheet-1", cellData: { "0": { "0": { v: 7 } } }, mergeData: [] } },
  });
  const operations = await spreadsheetOperations(before, after);
  assert.deepEqual(operations.map(operation => [operation.target, operation.action]), [["formula", "delete"], ["cell_style", "delete"]]);
});

test("spreadsheet charts, pivots, and protected ranges are independent semantic operations", async () => {
  const workbook = { id: "workbook-1", sheetOrder: ["sheet-1"], styles: {}, sheets: { "sheet-1": { id: "sheet-1", cellData: {}, mergeData: [] } } };
  const before = spreadsheetEnvelope(workbook);
  const after = spreadsheetEnvelope(workbook, {
    charts: [{ id: "chart-1", name: "趋势", sheet_id: "sheet-1", type: "line", range: { start_row: 0, end_row: 4, start_column: 0, end_column: 1 } }],
    pivots: [{ id: "pivot-1", name: "汇总", sheet_id: "sheet-1", aggregate: "sum", source_range: { start_row: 0, end_row: 4, start_column: 0, end_column: 1 } }],
    protected_ranges: [{ id: "protected-1", name: "财务锁定", sheet_id: "sheet-1", minimum_role: "manager", range: { start_row: 0, end_row: 4, start_column: 1, end_column: 1 } }],
  });
  const operations = await spreadsheetOperations(before, after);
  assert.deepEqual(operations.map(operation => operation.target).sort(), ["chart", "pivot", "protected_range"]);
});

test("whiteboard and flowchart changes become node, edge, and graph structure operations", async () => {
  const whiteboard = await whiteboardOperations(
    JSON.stringify({ schema_version: 1, elements: [{ id: "node-1", type: "rectangle", x: 10 }, { id: "edge-1", type: "arrow", x: 20 }], assets: {}, settings: { background_color: "#fff", grid_size: 20, grid_enabled: false } }),
    JSON.stringify({ schema_version: 1, elements: [{ id: "node-1", type: "rectangle", x: 30 }, { id: "edge-1", type: "arrow", x: 20 }], assets: { image: { id: "image" } }, settings: { background_color: "#fff", grid_size: 20, grid_enabled: false } }),
  );
  assert.deepEqual(whiteboard.map(operation => operation.target).sort(), ["graph_structure", "node"]);
  const flow = await flowchartOperations(
    JSON.stringify({ schema_version: 1, theme: "emerald", layout: "free", grid: true, nodes: [{ id: "start", type: "start", x: 10, y: 10, text: "开始", style: { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" } }], edges: [] }),
    JSON.stringify({ schema_version: 1, theme: "emerald", layout: "horizontal", grid: true, nodes: [{ id: "start", type: "start", x: 10, y: 10, text: "开始", style: { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" } }, { id: "end", type: "end", x: 30, y: 10, text: "结束", style: { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" } }], edges: [{ id: "edge-1", source: "start", target: "end", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: false } }] }),
  );
  assert.deepEqual(flow.map(operation => operation.target).sort(), ["edge", "graph_structure", "node"]);
});

test("mind map changes preserve node parent/order while separating arrows and map structure", async () => {
  const style = { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" };
  const node = (id: string, text: string, children: unknown[] = []) => ({ id, text, expanded: true, direction: "auto", style, children });
  const before = JSON.stringify({ schema_version: 1, theme: "emerald", layout: "side", compact: true, root: node("root", "中心", [node("a", "A"), node("b", "B")]), relations: [] });
  const after = JSON.stringify({ schema_version: 1, theme: "ocean", layout: "right", compact: true, root: node("root", "中心", [node("b", "B2"), node("a", "A", [node("a1", "A1")])]), relations: [{ id: "arrow-1", from: "a", to: "b", label: "关联", bidirectional: false, color: "#64748b", width: 2, dashed: false }] });
  const operations = await mindMapOperations(before, after);
  assert.ok(operations.some(operation => operation.target === "node" && operation.target_id === "b" && (operation.value as { index: number }).index === 0));
  assert.ok(operations.some(operation => operation.target === "node" && operation.target_id === "a1" && (operation.value as { parent_id: string }).parent_id === "a"));
  assert.ok(operations.some(operation => operation.target === "edge" && operation.target_id === "arrow-1"));
  assert.ok(operations.some(operation => operation.target === "graph_structure"));
});

test("presentation changes are split into slide, element, asset, and ordering operations", async () => {
  const beforeContent = structuredClone(emptyPresentationContent);
  beforeContent.slides[0] = { id: "slide-1", title: "第一页", layout: "blank", background_color: "", notes: "", elements: [{ id: "shape-1", type: "shape", x: 10, y: 20, width: 400, height: 200, rotation: 0, shape: "rectangle", fill_color: "#176B52", stroke_color: "#176B52", stroke_width: 2, text: "增长", font_size: 32, font_weight: "bold", color: "#FFFFFF", align: "center" }], files: {} };
  const afterContent = structuredClone(beforeContent);
  afterContent.theme = "midnight";
  afterContent.master = { ...presentationThemes.midnight.master };
  afterContent.slides[0] = { ...afterContent.slides[0], title: "封面", elements: [{ ...afterContent.slides[0].elements[0], x: 20 }, { id: "media-1", type: "image", x: 500, y: 220, width: 600, height: 400, rotation: 0, asset_id: "asset-1", fit: "contain" }], files: { "asset-1": { id: "asset-1", mime_type: "image/png", document_ref: "knowledge-document:kdoc_0123456789abcdef0123456789abcdef", filename: "增长图.png" } } };
  afterContent.slides.unshift({ id: "slide-2", title: "第二页", layout: "blank", background_color: "", notes: "", elements: [], files: {} });
  const operations = await presentationOperations(JSON.stringify(beforeContent), JSON.stringify(afterContent));
  for (const target of ["slide", "element", "asset", "presentation_structure"] as const) assert.ok(operations.some(operation => operation.target === target), `missing ${target}`);
  assert.equal(operations.find(operation => operation.target === "element")?.parent_id, "slide-1");
  assert.deepEqual((operations.find(operation => operation.target === "presentation_structure")?.value as { slide_order: string[] }).slide_order, ["slide-2", "slide-1"]);
});

test("form changes are split into stable-key components and form ordering", async () => {
  const before = JSON.stringify({ display: "form", components: [{ type: "textfield", key: "name", label: "姓名" }, { type: "email", key: "email", label: "邮箱" }] });
  const after = JSON.stringify({ display: "wizard", components: [{ type: "email", key: "email", label: "工作邮箱" }, { type: "textfield", key: "name", label: "姓名" }, { type: "checkbox", key: "agree", label: "同意" }] });
  const operations = await formOperations(before, after);
  assert.equal(operations.filter(operation => operation.target === "component").length, 2);
  const structure = operations.find(operation => operation.target === "form_structure");
  assert.deepEqual((structure?.value as { component_order: string[] }).component_order, ["email", "name", "agree"]);
  assert.equal((structure?.value as { display: string }).display, "wizard");
});
