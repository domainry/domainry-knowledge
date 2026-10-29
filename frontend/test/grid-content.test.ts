import assert from "node:assert/strict";
import test from "node:test";
import { evaluateGridFormula, gridAutomationExecutions, gridCellDisplay, gridRecordsForView, parseGridContent, type GridContent } from "../src/gridContent.ts";
import { activateKnowledgeLocale } from "../src/i18n/runtime.ts";

activateKnowledgeLocale("zh-CN");

const content: GridContent = {
  schema_version: 1,
  fields: [
    { id: "title", name: "标题", type: "text" },
    { id: "amount", name: "金额", type: "number" },
    { id: "tax", name: "含税", type: "formula", formula: "{amount}*1.13" },
    { id: "status", name: "状态", type: "single_select", options: [{ id: "doing", label: "进行中" }, { id: "done", label: "完成" }] },
  ],
  records: [
    { id: "r1", values: { title: "A", amount: 10, status: "doing" } },
    { id: "r2", values: { title: "B", amount: 20, status: "done" } },
  ],
  views: [{ id: "v1", name: "金额倒序", type: "grid", filters: [{ id: "f1", field_id: "amount", operator: "gte", value: 10 }], sorts: [{ field_id: "amount", direction: "desc" }] }],
};

test("grid canonical parser and formula evaluator", () => {
  assert.equal(parseGridContent(JSON.stringify(content)).schema_version, 1);
  assert.equal(evaluateGridFormula("{amount}*1.13", content.records[0]), 11.299999999999999);
  assert.equal(evaluateGridFormula("globalThis.process", content.records[0]), null);
  assert.equal(gridCellDisplay(content, content.records[1], content.fields[3]), "完成");
});

test("grid view filtering and sorting share the canonical records", () => {
  assert.deepEqual(gridRecordsForView(content, content.views[0]).map(record => record.id), ["r2", "r1"]);
});

test("grid automations derive stable authorized execution requests from semantic operations", () => {
  const automated: GridContent = { ...content, automations: [{ id: "auto-1", enabled: true, trigger: "record_updated", action: "set_field", field_id: "status", value: "done", idempotency_key: "config-1" }] };
  const operations = [{ id: "op-cell-1", target: "cell" as const, target_id: "r1", parent_id: "amount", action: "upsert" as const, expected_hash: "hash", value: 12 }];
  assert.deepEqual(gridAutomationExecutions(JSON.stringify(automated), operations, 7), [{ execution_id: "exec_op-cell-1_auto-1", automation_id: "auto-1", trigger: "record_updated", record_id: "r1", expected_draft_revision: 7 }]);
});

test("grid canonical parser preserves server-governed granular permissions", () => {
  const governed: GridContent = { ...content, permissions: { table: { read: ["role:reader"], write: ["role:editor"] }, fields: { amount: { read: ["role:manager"], write: ["role:manager"] } }, records: { r2: { read: ["user:alice"] } }, views: { v1: { write: ["role:manager"] } } } };
  assert.deepEqual(parseGridContent(JSON.stringify(governed)).permissions, governed.permissions);
});

test("grid supports richer business fields and calendar views", () => {
  const rich: GridContent = {
    ...content,
    fields: [
      ...content.fields,
      { id: "price", name: "价格", type: "currency" },
      { id: "mail", name: "邮箱", type: "email" },
      { id: "due", name: "到期日", type: "date" },
      { id: "created", name: "创建时间", type: "created_time" },
      { id: "sequence", name: "编号", type: "auto_number" },
    ],
    records: [{ id: "r1", values: { title: "A", amount: 10, status: "doing", price: 99, mail: "a@example.com", due: "2026-10-22" }, created_at: "2026-10-22T00:00:00Z" }],
    views: [{ id: "calendar", name: "日历", type: "calendar", date_field_id: "due", row_height: "normal" }],
  };
  const parsed = parseGridContent(JSON.stringify(rich));
  assert.equal(parsed.views[0].type, "calendar");
  assert.equal(gridCellDisplay(parsed, parsed.records[0], parsed.fields.find(field => field.id === "price")!), "¥99.00");
  assert.equal(gridCellDisplay(parsed, parsed.records[0], parsed.fields.find(field => field.id === "sequence")!), "1");
});
