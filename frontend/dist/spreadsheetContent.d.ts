import { type IWorkbookData } from "@univerjs/presets";
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
export declare function emptyKnowledgeSpreadsheet(): KnowledgeSpreadsheetContent;
export declare function parseKnowledgeSpreadsheet(body: string): KnowledgeSpreadsheetContent;
export declare function sanitizeSpreadsheetWorkbook(workbook: IWorkbookData): IWorkbookData;
export declare function spreadsheetID(prefix: string): string;
export declare function parseSpreadsheetRange(value: string): SpreadsheetRange | null;
export declare function formatSpreadsheetRange(range: SpreadsheetRange): string;
export declare function spreadsheetCellValue(content: KnowledgeSpreadsheetContent, sheetID: string, row: number, column: number): string | number | boolean | null;
export declare function spreadsheetRangeMatrix(content: KnowledgeSpreadsheetContent, sheetID: string, range: SpreadsheetRange): (string | number | boolean | null)[][];
export declare function spreadsheetChartData(content: KnowledgeSpreadsheetContent, chart: SpreadsheetChart): {
    label: string;
    value: number;
}[];
export declare function spreadsheetPivotData(content: KnowledgeSpreadsheetContent, pivot: SpreadsheetPivot): {
    label: string;
    value: number;
}[];
export declare function exportKnowledgeSpreadsheetXLSX(content: KnowledgeSpreadsheetContent): Promise<import("exceljs").Buffer>;
export declare function importKnowledgeSpreadsheetXLSX(data: ArrayBuffer): Promise<KnowledgeSpreadsheetContent>;
