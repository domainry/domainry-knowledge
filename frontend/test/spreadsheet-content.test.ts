import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyKnowledgeSpreadsheet,
  exportKnowledgeSpreadsheetXLSX,
  formatSpreadsheetRange,
  importKnowledgeSpreadsheetXLSX,
  parseKnowledgeSpreadsheet,
  parseSpreadsheetRange,
  sanitizeSpreadsheetWorkbook,
  spreadsheetChartData,
  spreadsheetPivotData,
} from "../src/spreadsheetContent.ts";

test("spreadsheet sanitizer keeps only supported plugin resources with canonical JSON", () => {
  const content = emptyKnowledgeSpreadsheet();
  content.workbook.resources = [
    { name: "SHEET_CONDITIONAL_FORMATTING_PLUGIN", data: "" },
    { name: "SHEET_DATA_VALIDATION_PLUGIN", data: "{}" },
    { name: "UNSUPPORTED_RUNTIME_RESOURCE", data: "{}" },
  ];
  assert.deepEqual(sanitizeSpreadsheetWorkbook(content.workbook).resources, [
    { name: "SHEET_CONDITIONAL_FORMATTING_PLUGIN", data: "{}" },
    { name: "SHEET_DATA_VALIDATION_PLUGIN", data: "{}" },
  ]);
});

test("spreadsheet ranges use bounded A1 notation", () => {
  assert.deepEqual(parseSpreadsheetRange("B2:D8"), { start_row: 1, end_row: 7, start_column: 1, end_column: 3 });
  assert.equal(formatSpreadsheetRange({ start_row: 1, end_row: 7, start_column: 1, end_column: 3 }), "B2:D8");
  assert.deepEqual(parseSpreadsheetRange("D8:B2"), { start_row: 1, end_row: 7, start_column: 1, end_column: 3 });
  assert.equal(parseSpreadsheetRange("A0:B2"), null);
  assert.equal(parseSpreadsheetRange("AAAA1:B2"), null);
});

test("spreadsheet charts and pivots derive data from the canonical workbook", () => {
  const content = emptyKnowledgeSpreadsheet();
  const sheetID = content.workbook.sheetOrder[0];
  content.workbook.sheets[sheetID].cellData = {
    0: { 0: { v: "团队" }, 1: { v: "金额" } },
    1: { 0: { v: "研发" }, 1: { v: 20 } },
    2: { 0: { v: "销售" }, 1: { v: 30 } },
    3: { 0: { v: "研发" }, 1: { v: 10 } },
  };
  const range = { start_row: 0, end_row: 3, start_column: 0, end_column: 1 };
  assert.deepEqual(spreadsheetChartData(content, { id: "chart-1", name: "金额", sheet_id: sheetID, type: "bar", range }), [
    { label: "研发", value: 20 }, { label: "销售", value: 30 }, { label: "研发", value: 10 },
  ]);
  assert.deepEqual(spreadsheetPivotData(content, { id: "pivot-1", name: "汇总", sheet_id: sheetID, aggregate: "sum", source_range: range }), [
    { label: "研发", value: 30 }, { label: "销售", value: 30 },
  ]);
  assert.deepEqual(spreadsheetPivotData(content, { id: "pivot-min", name: "最小值", sheet_id: sheetID, aggregate: "min", source_range: range }), [
    { label: "研发", value: 10 }, { label: "销售", value: 30 },
  ]);
  assert.deepEqual(spreadsheetPivotData(content, { id: "pivot-max", name: "最大值", sheet_id: sheetID, aggregate: "max", source_range: range }), [
    { label: "研发", value: 20 }, { label: "销售", value: 30 },
  ]);
  assert.equal(parseKnowledgeSpreadsheet(JSON.stringify(content)).workbook.id, "workbook-1");
});

test("spreadsheet XLSX import and export preserve values, formulas, and merges", async () => {
  const content = emptyKnowledgeSpreadsheet();
  const sheetID = content.workbook.sheetOrder[0];
  const sheet = content.workbook.sheets[sheetID];
  sheet.name = "预算";
  sheet.cellData = { 0: { 0: { v: "项目" }, 1: { v: "金额" } }, 1: { 0: { v: "设计" }, 1: { v: 12, f: "=6*2" } } };
  sheet.mergeData = [{ startRow: 2, endRow: 2, startColumn: 0, endColumn: 1 }];
  const output = await exportKnowledgeSpreadsheetXLSX(content);
  const bytes = output instanceof ArrayBuffer ? output : Uint8Array.from(output as ArrayLike<number>).buffer;
  const imported = await importKnowledgeSpreadsheetXLSX(bytes);
  const importedSheet = imported.workbook.sheets[imported.workbook.sheetOrder[0]];
  assert.equal(importedSheet.name, "预算");
  assert.equal(importedSheet.cellData?.["1"]?.["1"]?.f, "=6*2");
  assert.equal(importedSheet.cellData?.["1"]?.["1"]?.v, 12);
  assert.deepEqual(importedSheet.mergeData, [{ startRow: 2, endRow: 2, startColumn: 0, endColumn: 1 }]);
});
