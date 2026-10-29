import { formatKnowledgeNumber, kt } from "./i18n/runtime.ts";
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
  if (!value || !Array.isArray(value.fields) || !Array.isArray(value.records) || !Array.isArray(value.views)) throw Error(kt("knowledge.auto.1fc0543c52cd5db7"));
  const fields = objects(value.fields).map(item => ({ ...item, id: String(item.id || ""), name: String(item.name || ""), type: String(item.type || "") })) as GridField[];
  const records = objects(value.records).map(item => ({ ...item, id: String(item.id || ""), values: item.values && typeof item.values === "object" && !Array.isArray(item.values) ? item.values : {} })) as GridRecord[];
  const views = objects(value.views).map(item => ({ ...item, id: String(item.id || ""), name: String(item.name || ""), type: String(item.type || "") })) as GridView[];
  if (fields.some(field => !field.id || !field.name || !gridFieldTypes.includes(field.type)) || records.some(record => !record.id) || views.some(view => !view.id || !view.name || !gridViewTypes.includes(view.type))) throw Error(kt("knowledge.auto.4a9624b2f578934a"));
  return { schema_version: 1, fields, records, views, permissions: value.permissions, automations: value.automations };
}

export function emptyGridContent(): GridContent {
  return {
    schema_version: 1,
    fields: [{ id: "title", name: kt("knowledge.auto.c3405f8c7d9d392a"), type: "text", required: true }],
    records: [],
    views: [{ id: "view-grid", name: kt("knowledge.auto.22d9e7c54b88cacd"), type: "grid", row_height: "normal" }],
  };
}

export function gridFieldLabel(type: GridFieldType) {
  return ({
    text: kt("knowledge.auto.0f59b2657fbbf761"), long_text: kt("knowledge.auto.85948100fe2c5393"), number: kt("knowledge.auto.c16ec9274e9d13d1"), currency: kt("knowledge.auto.ffc624300de8f2e1"), single_select: kt("knowledge.auto.4214b9af7ae0cdcc"), multi_select: kt("knowledge.auto.461e085d5ca266fb"), person: kt("knowledge.auto.06fea8eab68db0ad"), date: kt("knowledge.auto.70d0c1b33626ba4b"), attachment: kt("knowledge.auto.c7225dbf105eeed5"),
    checkbox: kt("knowledge.auto.48b5075906c15c77"), progress: kt("knowledge.auto.f81ff55de14e3f45"), rating: kt("knowledge.auto.96fff2e26c8d1027"), email: kt("knowledge.auto.73075237fd0f05f0"), phone: kt("knowledge.auto.bf8b5d378f010ece"), url: kt("knowledge.auto.a8ecb4b6dabebc09"), barcode: kt("knowledge.auto.8043812671e8edf0"),
    formula: kt("knowledge.auto.f3fccedacbcebbfa"), relation: kt("knowledge.auto.748cd875b23a81d6"), lookup: kt("knowledge.auto.70074641f1484706"), created_time: kt("knowledge.auto.07ec86e0f1d44f91"), updated_time: kt("knowledge.auto.0a5f9a892960a00a"), auto_number: kt("knowledge.auto.264bbc847882f93d"),
  } as Record<GridFieldType, string>)[type];
}

export function gridViewLabel(type: GridViewType) {
  return ({ grid: kt("knowledge.auto.22d9e7c54b88cacd"), kanban: kt("knowledge.auto.0072da457a093523"), gantt: kt("knowledge.auto.db7049fd009850d0"), calendar: kt("knowledge.auto.a00f295cfbb0b1b3"), gallery: kt("knowledge.auto.dc7f21e137cc28b1"), form: kt("knowledge.auto.62abf78cc507b4fd") } as Record<GridViewType, string>)[type];
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
  if (field.type === "checkbox") return value ? kt("knowledge.auto.b5141d3d19e9a048") : kt("knowledge.auto.0c70665b6eb65f1a");
  if (field.type === "progress") return `${Number(value || 0)}%`;
  if (field.type === "rating") return "★".repeat(Math.max(0, Math.min(5, Number(value || 0))));
  if (field.type === "currency") return formatKnowledgeNumber(Number(value || 0), { style: "currency", currency: "CNY" });
  if (field.type === "single_select") return field.options?.find(option => option.id === value)?.label || String(value ?? "");
  if (field.type === "multi_select") return ids(value).map(id => field.options?.find(option => option.id === id)?.label || id).join("、");
  if (field.type === "attachment") return objects(value).map(item => String(item.title || item.name || kt("knowledge.auto.c7225dbf105eeed5"))).join("、");
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
