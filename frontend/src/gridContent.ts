import type { KnowledgeGridAutomationExecute, KnowledgePageNativeOperation } from "./types.ts";

export const gridFieldTypes = [
  "text", "long_text", "number", "currency", "single_select", "multi_select", "person", "date", "attachment",
  "checkbox", "progress", "rating", "email", "phone", "url", "barcode", "formula", "relation", "lookup",
  "created_time", "updated_time", "auto_number",
] as const;

export type GridFieldType = typeof gridFieldTypes[number];
export const gridViewTypes = ["grid", "kanban", "gantt", "calendar", "gallery", "form"] as const;
export type GridViewType = typeof gridViewTypes[number];

export type GridOption = { id: string; label: string; color?: string };
export type GridField = {
  id: string;
  name: string;
  type: GridFieldType;
  required?: boolean;
  options?: GridOption[];
  formula?: string;
  relation?: { page_id: string; display_field_id?: string };
  lookup?: { relation_field_id: string; target_field_id: string };
};
export type GridRecord = { id: string; values: Record<string, unknown>; created_at?: string; updated_at?: string };
export type GridFilter = { id: string; field_id: string; operator: "eq" | "neq" | "contains" | "empty" | "not_empty" | "gt" | "gte" | "lt" | "lte"; value?: unknown };
export type GridSort = { field_id: string; direction: "asc" | "desc" };
export type GridColorRule = { id: string; field_id: string; operator: GridFilter["operator"]; value?: unknown; color: string };
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
  config?: { start_field_id?: string; end_field_id?: string; date_field_id?: string; cover_field_id?: string; title_field_id?: string };
};
export type GridPermissions = {
  table?: { read?: string[]; write?: string[] };
  views?: Record<string, { read?: string[]; write?: string[] }>;
  fields?: Record<string, { read?: string[]; write?: string[] }>;
  records?: Record<string, { read?: string[]; write?: string[] }>;
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

const ids = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const objects = (value: unknown) => Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];

export function parseGridContent(body: string): GridContent {
  const value = JSON.parse(body) as Partial<GridContent>;
  if (!value || !Array.isArray(value.fields) || !Array.isArray(value.records) || !Array.isArray(value.views)) throw Error("多维表格内容结构无效。");
  const fields = objects(value.fields).map(item => ({ ...item, id: String(item.id || ""), name: String(item.name || ""), type: String(item.type || "") })) as GridField[];
  const records = objects(value.records).map(item => ({ ...item, id: String(item.id || ""), values: item.values && typeof item.values === "object" && !Array.isArray(item.values) ? item.values : {} })) as GridRecord[];
  const views = objects(value.views).map(item => ({ ...item, id: String(item.id || ""), name: String(item.name || ""), type: String(item.type || "") })) as GridView[];
  if (fields.some(field => !field.id || !field.name || !gridFieldTypes.includes(field.type)) || records.some(record => !record.id) || views.some(view => !view.id || !view.name || !gridViewTypes.includes(view.type))) throw Error("多维表格字段、记录或视图缺少稳定标识。");
  return { schema_version: 1, fields, records, views, permissions: value.permissions, automations: value.automations };
}

export function emptyGridContent(): GridContent {
  return {
    schema_version: 1,
    fields: [{ id: "title", name: "标题", type: "text", required: true }],
    records: [],
    views: [{ id: "view-grid", name: "表格", type: "grid", row_height: "normal" }],
  };
}

export function gridFieldLabel(type: GridFieldType) {
  return ({
    text: "单行文本", long_text: "多行文本", number: "数字", currency: "金额", single_select: "单选", multi_select: "多选", person: "人员", date: "日期", attachment: "附件",
    checkbox: "复选框", progress: "进度", rating: "评分", email: "邮箱", phone: "电话", url: "网址", barcode: "条码",
    formula: "公式", relation: "关联", lookup: "查找引用", created_time: "创建时间", updated_time: "更新时间", auto_number: "自动编号",
  } as Record<GridFieldType, string>)[type];
}

export function gridViewLabel(type: GridViewType) {
  return ({ grid: "表格", kanban: "看板", gantt: "甘特", calendar: "日历", gallery: "画册", form: "表单" } as Record<GridViewType, string>)[type];
}

function comparable(value: unknown) {
  if (Array.isArray(value)) return value.join(" ").toLocaleLowerCase();
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "number") return value;
  return String(value ?? "").toLocaleLowerCase();
}

export function gridFilterMatches(value: unknown, filter: Pick<GridFilter, "operator" | "value">): boolean {
  const left = comparable(value), right = comparable(filter.value);
  switch (filter.operator) {
    case "eq": return left === right;
    case "neq": return left !== right;
    case "contains": return String(left).includes(String(right));
    case "empty": return value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
    case "not_empty": return !gridFilterMatches(value, { operator: "empty" });
    case "gt": return left > right;
    case "gte": return left >= right;
    case "lt": return left < right;
    case "lte": return left <= right;
  }
}

const formulaToken = /\{([a-zA-Z0-9_-]{1,128})\}|(\d+(?:\.\d+)?)|([+\-*/()])/g;

export function evaluateGridFormula(expression: string, record: GridRecord) {
  const compact = expression.replace(/\s+/g, "");
  let rebuilt = "", position = 0, match: RegExpExecArray | null;
  formulaToken.lastIndex = 0;
  while ((match = formulaToken.exec(compact))) {
    if (match.index !== position) return null;
    position = formulaToken.lastIndex;
    if (match[1]) {
      const value = record.values[match[1]];
      if (typeof value !== "number" || !Number.isFinite(value)) return null;
      rebuilt += String(value);
    } else rebuilt += match[0];
  }
  if (position !== compact.length || !rebuilt || rebuilt.length > 512) return null;
  try {
    // The tokenizer above permits only finite numbers, arithmetic operators and parentheses.
    const value = Function(`"use strict"; return (${rebuilt})`)() as unknown;
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function gridCellValue(content: GridContent, record: GridRecord, field: GridField): unknown {
  if (field.type === "created_time") return record.created_at || "";
  if (field.type === "updated_time") return record.updated_at || record.created_at || "";
  if (field.type === "auto_number") return content.records.findIndex(item => item.id === record.id) + 1;
  if (field.type === "formula") return evaluateGridFormula(field.formula || "", record);
  if (field.type === "lookup" && field.lookup) {
    const related = ids(record.values[field.lookup.relation_field_id]);
    const values = related.map(id => content.records.find(item => item.id === id)?.values[field.lookup!.target_field_id]).filter(value => value !== undefined && value !== null && value !== "");
    return values;
  }
  return record.values[field.id];
}

export function gridRecordsForView(content: GridContent, view: GridView) {
  const fieldByID = new Map(content.fields.map(field => [field.id, field]));
  const records = content.records.filter(record => (view.filters || []).every(filter => {
    const field = fieldByID.get(filter.field_id);
    return field ? gridFilterMatches(gridCellValue(content, record, field), filter) : true;
  }));
  const sorts = (view.sorts || []).filter(sort => fieldByID.has(sort.field_id));
  if (!sorts.length) return records;
  return [...records].sort((left, right) => {
    for (const sort of sorts) {
      const field = fieldByID.get(sort.field_id)!;
      const a = comparable(gridCellValue(content, left, field)), b = comparable(gridCellValue(content, right, field));
      const order = a < b ? -1 : a > b ? 1 : 0;
      if (order) return sort.direction === "asc" ? order : -order;
    }
    return 0;
  });
}

export function gridCellDisplay(content: GridContent, record: GridRecord, field: GridField) {
  const value = gridCellValue(content, record, field);
  if (field.type === "checkbox") return value ? "是" : "否";
  if (field.type === "progress") return `${Number(value || 0)}%`;
  if (field.type === "rating") return "★".repeat(Math.max(0, Math.min(5, Number(value || 0))));
  if (field.type === "currency") return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(Number(value || 0));
  if (field.type === "single_select") return field.options?.find(option => option.id === value)?.label || String(value ?? "");
  if (field.type === "multi_select") return ids(value).map(id => field.options?.find(option => option.id === id)?.label || id).join("、");
  if (field.type === "attachment") return objects(value).map(item => String(item.title || item.name || "附件")).join("、");
  if (field.type === "relation") return ids(value).map(id => content.records.find(item => item.id === id)?.values.title || id).join("、");
  if (Array.isArray(value)) return value.join("、");
  return String(value ?? "");
}

export function coerceGridInput(field: GridField, value: string | boolean): unknown {
  switch (field.type) {
    case "number": case "currency": return value === "" ? null : Number(value);
    case "checkbox": return Boolean(value);
    case "progress": return Math.max(0, Math.min(100, Number(value || 0)));
    case "rating": return Math.max(0, Math.min(5, Number(value || 0)));
    case "multi_select": case "person": case "relation": return String(value).split(",").map(item => item.trim()).filter(Boolean);
    default: return value;
  }
}

export function gridAutomationExecutions(body: string, operations: KnowledgePageNativeOperation[], draftRevision: number): KnowledgeGridAutomationExecute[] {
  const content = parseGridContent(body), triggers = new Map<string, { trigger: "record_created" | "record_updated"; operationID: string }>();
  for (const operation of operations) {
    if (operation.target === "record") triggers.set(operation.target_id, { trigger: operation.action === "upsert" && !operation.expected_hash ? "record_created" : "record_updated", operationID: operation.id });
    else if (operation.target === "cell" && !triggers.has(operation.target_id)) triggers.set(operation.target_id, { trigger: "record_updated", operationID: operation.id });
  }
  const executions: KnowledgeGridAutomationExecute[] = [];
  for (const [recordID, event] of triggers) for (const automation of content.automations || []) {
    if (!automation.enabled || automation.trigger !== event.trigger) continue;
    executions.push({ execution_id: `exec_${event.operationID}_${automation.id}`.slice(0, 96), automation_id: automation.id, trigger: event.trigger, record_id: recordID, expected_draft_revision: draftRevision });
  }
  return executions;
}
