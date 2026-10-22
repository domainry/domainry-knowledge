import type { KnowledgeGridAutomationExecute, KnowledgePageNativeOperation } from "./types.ts";
export declare const gridFieldTypes: readonly ["text", "long_text", "number", "currency", "single_select", "multi_select", "person", "date", "attachment", "checkbox", "progress", "rating", "email", "phone", "url", "barcode", "formula", "relation", "lookup", "created_time", "updated_time", "auto_number"];
export type GridFieldType = typeof gridFieldTypes[number];
export declare const gridViewTypes: readonly ["grid", "kanban", "gantt", "calendar", "gallery", "form"];
export type GridViewType = typeof gridViewTypes[number];
export type GridOption = {
    id: string;
    label: string;
    color?: string;
};
export type GridField = {
    id: string;
    name: string;
    type: GridFieldType;
    required?: boolean;
    options?: GridOption[];
    formula?: string;
    relation?: {
        page_id: string;
        display_field_id?: string;
    };
    lookup?: {
        relation_field_id: string;
        target_field_id: string;
    };
};
export type GridRecord = {
    id: string;
    values: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
};
export type GridFilter = {
    id: string;
    field_id: string;
    operator: "eq" | "neq" | "contains" | "empty" | "not_empty" | "gt" | "gte" | "lt" | "lte";
    value?: unknown;
};
export type GridSort = {
    field_id: string;
    direction: "asc" | "desc";
};
export type GridColorRule = {
    id: string;
    field_id: string;
    operator: GridFilter["operator"];
    value?: unknown;
    color: string;
};
export type GridView = {
    id: string;
    name: string;
    type: GridViewType;
    filters?: GridFilter[];
    sorts?: GridSort[];
    group_by?: string;
    hidden_field_ids?: string[];
    frozen_field_ids?: string[];
    row_height?: "compact" | "normal" | "tall";
    color_rules?: GridColorRule[];
    shared?: boolean;
    config?: {
        start_field_id?: string;
        end_field_id?: string;
        date_field_id?: string;
        cover_field_id?: string;
        title_field_id?: string;
    };
};
export type GridPermissions = {
    table?: {
        read?: string[];
        write?: string[];
    };
    views?: Record<string, {
        read?: string[];
        write?: string[];
    }>;
    fields?: Record<string, {
        read?: string[];
        write?: string[];
    }>;
    records?: Record<string, {
        read?: string[];
        write?: string[];
    }>;
};
export type GridAutomation = {
    id: string;
    enabled: boolean;
    trigger: "record_created" | "record_updated";
    action: "set_field";
    field_id: string;
    value: unknown;
    idempotency_key: string;
};
export type GridContent = {
    schema_version: 1;
    fields: GridField[];
    records: GridRecord[];
    views: GridView[];
    permissions?: GridPermissions;
    automations?: GridAutomation[];
};
export declare function parseGridContent(body: string): GridContent;
export declare function emptyGridContent(): GridContent;
export declare function gridFieldLabel(type: GridFieldType): string;
export declare function gridViewLabel(type: GridViewType): string;
export declare function gridFilterMatches(value: unknown, filter: Pick<GridFilter, "operator" | "value">): boolean;
export declare function evaluateGridFormula(expression: string, record: GridRecord): number | null;
export declare function gridCellValue(content: GridContent, record: GridRecord, field: GridField): unknown;
export declare function gridRecordsForView(content: GridContent, view: GridView): GridRecord[];
export declare function gridCellDisplay(content: GridContent, record: GridRecord, field: GridField): string;
export declare function coerceGridInput(field: GridField, value: string | boolean): unknown;
export declare function gridAutomationExecutions(body: string, operations: KnowledgePageNativeOperation[], draftRevision: number): KnowledgeGridAutomationExecute[];
