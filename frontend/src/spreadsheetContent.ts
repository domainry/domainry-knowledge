import { LocaleType, getSheetsEmptySnapshot, type IWorkbookData } from "@univerjs/presets";

export type SpreadsheetRange = {
  start_row: number;
  end_row: number;
  start_column: number;
  end_column: number;
};

export type SpreadsheetChart = {
  id: string;
  name: string;
  sheet_id: string;
  type: "column" | "bar" | "line" | "area" | "pie" | "donut" | "scatter" | "radar" | "funnel" | "waterfall";
  range: SpreadsheetRange;
};

export type SpreadsheetPivot = {
  id: string;
  name: string;
  sheet_id: string;
  source_range: SpreadsheetRange;
  aggregate: "sum" | "count" | "average" | "min" | "max";
};

export type SpreadsheetProtectedRange = {
  id: string;
  name: string;
  sheet_id: string;
  range: SpreadsheetRange;
  minimum_role: "manager";
};

export type KnowledgeSpreadsheetContent = {
  schema_version: 1;
  workbook: IWorkbookData;
  charts: SpreadsheetChart[];
  pivots: SpreadsheetPivot[];
  protected_ranges: SpreadsheetProtectedRange[];
};

type CellData = { v?: string | number | boolean | null; f?: string | null; [key: string]: unknown };
type SheetData = { id?: string; name?: string; rowCount?: number; columnCount?: number; cellData?: Record<string, Record<string, CellData>>; mergeData?: unknown[]; [key: string]: unknown };

const allowedResourceNames = new Set(["SHEET_DATA_VALIDATION_PLUGIN", "SHEET_CONDITIONAL_FORMATTING_PLUGIN"]);

export function emptyKnowledgeSpreadsheet(): KnowledgeSpreadsheetContent {
  const workbook = getSheetsEmptySnapshot("workbook-1", LocaleType.ZH_CN, "工作表");
  workbook.sheetOrder = ["sheet-1"];
  workbook.sheets["sheet-1"] = {
    id: "sheet-1", name: "工作表 1", tabColor: "", hidden: 0,
    rowCount: 1000, columnCount: 20, zoomRatio: 1,
    freeze: { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 },
    scrollTop: 0, scrollLeft: 0, defaultColumnWidth: 88, defaultRowHeight: 24,
    mergeData: [], cellData: {}, rowData: {}, columnData: {}, showGridlines: 1,
    rowHeader: { width: 46, hidden: 0 }, columnHeader: { height: 20, hidden: 0 }, rightToLeft: 0,
  };
  return {
    schema_version: 1,
    workbook,
    charts: [],
    pivots: [],
    protected_ranges: [],
  };
}

export function parseKnowledgeSpreadsheet(body: string): KnowledgeSpreadsheetContent {
  const value = JSON.parse(body) as Partial<KnowledgeSpreadsheetContent>;
  if (value.schema_version !== 1 || !value.workbook || typeof value.workbook !== "object" || !Array.isArray(value.workbook.sheetOrder) || !value.workbook.sheets || !Array.isArray(value.charts) || !Array.isArray(value.pivots) || !Array.isArray(value.protected_ranges)) {
    throw Error("电子表格内容结构无效。");
  }
  return value as KnowledgeSpreadsheetContent;
}

export function sanitizeSpreadsheetWorkbook(workbook: IWorkbookData): IWorkbookData {
  return {
    ...workbook,
    resources: (workbook.resources || []).filter(resource => allowedResourceNames.has(resource.name)).map(resource => ({
      ...resource,
      data: typeof resource.data === "string" && resource.data.trim() ? resource.data : "{}",
    })),
  };
}

export function spreadsheetID(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function columnIndex(label: string) {
  let value = 0;
  for (const character of label.toUpperCase()) value = value * 26 + character.charCodeAt(0) - 64;
  return value - 1;
}

function columnLabel(index: number) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

export function parseSpreadsheetRange(value: string): SpreadsheetRange | null {
  const match = /^\s*([A-Za-z]{1,3})([1-9][0-9]{0,4})\s*:\s*([A-Za-z]{1,3})([1-9][0-9]{0,4})\s*$/.exec(value);
  if (!match) return null;
  const left = columnIndex(match[1]), right = columnIndex(match[3]);
  const top = Number(match[2]) - 1, bottom = Number(match[4]) - 1;
  if (left < 0 || right < 0 || left > 999 || right > 999 || top < 0 || bottom < 0 || top > 9999 || bottom > 9999) return null;
  return { start_row: Math.min(top, bottom), end_row: Math.max(top, bottom), start_column: Math.min(left, right), end_column: Math.max(left, right) };
}

export function formatSpreadsheetRange(range: SpreadsheetRange) {
  return `${columnLabel(range.start_column)}${range.start_row + 1}:${columnLabel(range.end_column)}${range.end_row + 1}`;
}

function sheet(content: KnowledgeSpreadsheetContent, sheetID: string): SheetData | undefined {
  return content.workbook.sheets[sheetID] as SheetData | undefined;
}

export function spreadsheetCellValue(content: KnowledgeSpreadsheetContent, sheetID: string, row: number, column: number): string | number | boolean | null {
  const cell = sheet(content, sheetID)?.cellData?.[String(row)]?.[String(column)];
  const value = cell?.v;
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : null;
}

export function spreadsheetRangeMatrix(content: KnowledgeSpreadsheetContent, sheetID: string, range: SpreadsheetRange) {
  const rows: (string | number | boolean | null)[][] = [];
  for (let row = range.start_row; row <= range.end_row; row++) {
    const values: (string | number | boolean | null)[] = [];
    for (let column = range.start_column; column <= range.end_column; column++) values.push(spreadsheetCellValue(content, sheetID, row, column));
    rows.push(values);
  }
  return rows;
}

export function spreadsheetChartData(content: KnowledgeSpreadsheetContent, chart: SpreadsheetChart) {
  const matrix = spreadsheetRangeMatrix(content, chart.sheet_id, chart.range);
  return matrix.slice(matrix.length > 1 ? 1 : 0).map((row, index) => ({
    label: String(row[0] ?? index + 1),
    value: Number(row[1] ?? row[0] ?? 0),
  })).filter(item => Number.isFinite(item.value));
}

export function spreadsheetPivotData(content: KnowledgeSpreadsheetContent, pivot: SpreadsheetPivot) {
  const matrix = spreadsheetRangeMatrix(content, pivot.sheet_id, pivot.source_range);
  const groups = new Map<string, { sum: number; count: number; min: number; max: number }>();
  for (const row of matrix.slice(matrix.length > 1 ? 1 : 0)) {
    const label = String(row[0] ?? "空白");
    const number = Number(row[1]);
    const current = groups.get(label) || { sum: 0, count: 0, min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
    current.count++;
    if (Number.isFinite(number)) { current.sum += number; current.min = Math.min(current.min, number); current.max = Math.max(current.max, number); }
    groups.set(label, current);
  }
  return [...groups].map(([label, value]) => ({
    label,
    value: pivot.aggregate === "count" ? value.count
      : pivot.aggregate === "average" ? (value.count ? value.sum / value.count : 0)
        : pivot.aggregate === "min" ? (Number.isFinite(value.min) ? value.min : 0)
          : pivot.aggregate === "max" ? (Number.isFinite(value.max) ? value.max : 0)
            : value.sum,
  }));
}

export async function exportKnowledgeSpreadsheetXLSX(content: KnowledgeSpreadsheetContent) {
  const { default: ExcelJS } = await import("exceljs");
  const { Workbook } = ExcelJS;
  const target = new Workbook();
  for (const sheetID of content.workbook.sheetOrder) {
    const source = sheet(content, sheetID);
    if (!source) continue;
    const output = target.addWorksheet((source.name || "工作表").slice(0, 31));
    for (const [rowID, rawRow] of Object.entries(source.cellData || {})) {
      for (const [columnID, cell] of Object.entries(rawRow || {})) {
        const targetCell = output.getCell(Number(rowID) + 1, Number(columnID) + 1);
        targetCell.value = typeof cell.f === "string" && cell.f ? { formula: cell.f.replace(/^=/, ""), result: cell.v ?? undefined } : cell.v ?? null;
      }
    }
    for (const rawMerge of source.mergeData || []) {
      const merge = rawMerge as { startRow?: number; endRow?: number; startColumn?: number; endColumn?: number };
      if ([merge.startRow, merge.endRow, merge.startColumn, merge.endColumn].every(Number.isInteger)) output.mergeCells((merge.startRow || 0) + 1, (merge.startColumn || 0) + 1, (merge.endRow || 0) + 1, (merge.endColumn || 0) + 1);
    }
  }
  return target.xlsx.writeBuffer();
}

function excelValue(value: unknown): CellData {
  if (value && typeof value === "object" && "formula" in value) {
    const formula = String((value as { formula?: unknown }).formula || "");
    const result = (value as { result?: unknown }).result;
    return { f: formula.startsWith("=") ? formula : `=${formula}`, ...(typeof result === "string" || typeof result === "number" || typeof result === "boolean" ? { v: result } : {}) };
  }
  if (value instanceof Date) return { v: value.toISOString() };
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return { v: value };
  if (value && typeof value === "object" && "text" in value) return { v: String((value as { text?: unknown }).text || "") };
  return {};
}

export async function importKnowledgeSpreadsheetXLSX(data: ArrayBuffer): Promise<KnowledgeSpreadsheetContent> {
  const { default: ExcelJS } = await import("exceljs");
  const { Workbook } = ExcelJS;
  const source = new Workbook();
  await source.xlsx.load(data);
  const content = emptyKnowledgeSpreadsheet();
  content.workbook.sheets = {};
  content.workbook.sheetOrder = [];
  source.worksheets.slice(0, 256).forEach((worksheet, sheetIndex) => {
    const sheetID = `sheet-${sheetIndex + 1}-${crypto.randomUUID()}`;
    const cellData: Record<string, Record<string, CellData>> = {};
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, (cell, columnNumber) => {
        const value = excelValue(cell.value);
        if (Object.keys(value).length > 0) (cellData[String(rowNumber - 1)] ||= {})[String(columnNumber - 1)] = value;
      });
    });
    const mergeData = Object.values((worksheet.model as { merges?: string[] }).merges || []).map(reference => {
      const parsed = parseSpreadsheetRange(reference);
      return parsed && { startRow: parsed.start_row, endRow: parsed.end_row, startColumn: parsed.start_column, endColumn: parsed.end_column };
    }).filter((value): value is Exclude<typeof value, null> => value !== null);
    content.workbook.sheetOrder.push(sheetID);
    content.workbook.sheets[sheetID] = {
      id: sheetID, name: worksheet.name || `工作表 ${sheetIndex + 1}`, tabColor: "", hidden: 0,
      rowCount: Math.max(1000, Math.min(10000, worksheet.rowCount + 100)), columnCount: Math.max(20, Math.min(1000, worksheet.columnCount + 10)), zoomRatio: 1,
      freeze: { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 }, scrollTop: 0, scrollLeft: 0,
      defaultColumnWidth: 88, defaultRowHeight: 24, mergeData, cellData, rowData: {}, columnData: {}, showGridlines: 1,
      rowHeader: { width: 46, hidden: 0 }, columnHeader: { height: 20, hidden: 0 }, rightToLeft: 0,
    };
  });
  if (content.workbook.sheetOrder.length === 0) return emptyKnowledgeSpreadsheet();
  return content;
}
