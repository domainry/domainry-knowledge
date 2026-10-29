import assert from "node:assert/strict";
import test from "node:test";
import { canonicalMindNoteContent, documentBlocksToMindNote, emptyMindNoteContent, isMindNoteContent, mindNotePlainText, mindNoteToDocumentContent, parseMindNoteContent } from "../src/mindNoteContent.ts";
import { activateKnowledgeLocale } from "../src/i18n/runtime.ts";

activateKnowledgeLocale("zh-CN");

test("mind note canonical content owns hierarchy, completion, and collapse state", () => {
  const content = {
    schema_version: 1 as const,
    nodes: [{ id: "goal", text: "发布目标", completed: true, collapsed: false, children: [{ id: "step", text: "完成验收", completed: false, collapsed: true, children: [] }] }],
  };
  assert.equal(isMindNoteContent(content), true);
  assert.equal(canonicalMindNoteContent(content), JSON.stringify(content));
  assert.equal(mindNotePlainText(content), "[x] 发布目标\n  [ ] 完成验收");
});

test("mind note parser rejects legacy BlockNote snapshots and unsafe structure", () => {
  assert.deepEqual(parseMindNoteContent('{"nodes":[{"id":"n1","type":"bulletListItem","props":{},"content":[],"children":[]}]}'), emptyMindNoteContent);
  assert.deepEqual(parseMindNoteContent('{"schema_version":1,"nodes":[{"id":"n1","text":"A","completed":false,"collapsed":false,"children":[],"script":"x"}]}'), emptyMindNoteContent);
  assert.deepEqual(parseMindNoteContent('{"schema_version":1,"nodes":[{"id":"same","text":"A","completed":false,"collapsed":false,"children":[{"id":"same","text":"B","completed":false,"collapsed":false,"children":[]}]}]}'), emptyMindNoteContent);
});

test("document conversion preserves text hierarchy and checklist completion", () => {
  const blocks = [{
    id: "root",
    type: "checkListItem",
    props: { checked: true },
    content: [{ type: "text", text: "产品上线", styles: {} }],
    children: [{ id: "child", type: "bulletListItem", props: {}, content: [{ type: "text", text: "灰度验证", styles: {} }], children: [] }],
  }];
  const note = documentBlocksToMindNote(blocks);
  assert.equal(note.nodes[0].text, "产品上线");
  assert.equal(note.nodes[0].completed, true);
  assert.equal(note.nodes[0].children[0].text, "灰度验证");
  const document = JSON.parse(mindNoteToDocumentContent(note));
  assert.equal(document.blocks[0].type, "checkListItem");
  assert.equal(document.blocks[0].props.checked, true);
  assert.equal(document.blocks[0].children[0].type, "bulletListItem");
});

test("mind note canonical text limits are measured as UTF-8 bytes", () => {
  const base = { id: "n1", completed: false, collapsed: false, children: [] };
  assert.equal(isMindNoteContent({ schema_version: 1, nodes: [{ ...base, text: "知".repeat(1365) }] }), true);
  assert.equal(isMindNoteContent({ schema_version: 1, nodes: [{ ...base, text: "知".repeat(1366) }] }), false);
});

test("mind note persists task metadata and exposes it to search", () => {
  const content = {
    schema_version: 1 as const,
    nodes: [{ id: "release", text: "发布", completed: false, collapsed: false, priority: "urgent" as const, due_date: "2026-10-31", tags: ["产品", "上线"], note: "先完成灰度验收", children: [] }],
  };
  assert.equal(isMindNoteContent(content), true);
  const plain = mindNotePlainText(content);
  for (const expected of ["发布", "灰度验收", "#产品", "2026-10-31"]) assert.match(plain, new RegExp(expected));
  assert.equal(isMindNoteContent({ ...content, nodes: [{ ...content.nodes[0], due_date: "2026-02-30" }] }), false);
  assert.equal(isMindNoteContent({ ...content, nodes: [{ ...content.nodes[0], tags: ["重复", "重复"] }] }), false);
});

