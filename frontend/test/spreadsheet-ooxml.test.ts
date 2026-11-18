import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { normalizeSpreadsheetOoxml } from "../src/viewers/spreadsheet-ooxml.ts";

test("normalizes namespace-prefixed SpreadsheetML before ExcelJS parses it", async () => {
  const fixture = process.env.KNOWLEDGE_XLSX_NAMESPACE_FIXTURE;
  if (!fixture) return test.skip("set KNOWLEDGE_XLSX_NAMESPACE_FIXTURE to exercise the real workbook");

  const source = await readFile(fixture);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(normalizeSpreadsheetOoxml(source));

  assert.ok(workbook.worksheets.length > 0);
  assert.ok(workbook.worksheets.some(sheet => sheet.rowCount > 0));
});
