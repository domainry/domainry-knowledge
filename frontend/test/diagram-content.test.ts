import test from "node:test";
import assert from "node:assert/strict";
import { decodeFlowchartContent, decodeMindMapContent, diagramPlainText, emptyFlowchartContent, emptyMindMapContent, flowchartNodeTypes, flowchartTemplates, layoutFlowchart, mindMapTemplates } from "../src/diagramContent.ts";
import { activateKnowledgeLocale } from "../src/i18n/runtime.ts";

activateKnowledgeLocale("zh-CN");

test("mind map canonical schema owns themes, layout, styles, hierarchy, and relations", () => {
  const content = structuredClone(mindMapTemplates.swot);
  content.relations.push({ id: "relation-1", from: "swot-1", to: "swot-2", label: "影响", bidirectional: true, color: "#64748b", width: 2, dashed: true });
  const parsed = decodeMindMapContent(JSON.stringify(content));
  assert.equal(parsed.schema_version, 1);
  assert.equal(parsed.theme, "ocean");
  assert.equal(parsed.root.children.length, 4);
  assert.equal(parsed.relations[0].bidirectional, true);
  assert.match(diagramPlainText(parsed), /影响/);
});

test("mind map rejects third-party snapshots and unsafe or dangling structure", () => {
  assert.throws(() => decodeMindMapContent(JSON.stringify({ root: { nodeData: { id: "root", topic: "旧快照" } } })));
  const duplicate = structuredClone(emptyMindMapContent);
  duplicate.root.children.push({ ...structuredClone(duplicate.root), children: [] });
  assert.throws(() => decodeMindMapContent(JSON.stringify(duplicate)));
  const dangling = structuredClone(mindMapTemplates.brainstorming);
  dangling.relations.push({ id: "relation-1", from: "missing", to: "idea-1", label: "", bidirectional: false, color: "#64748b", width: 2, dashed: false });
  assert.throws(() => decodeMindMapContent(JSON.stringify(dangling)));
  const colliding = structuredClone(mindMapTemplates.brainstorming);
  colliding.relations.push({ id: "idea-1", from: "root", to: "idea-1", label: "冲突", bidirectional: false, color: "#64748b", width: 2, dashed: false });
  assert.throws(() => decodeMindMapContent(JSON.stringify(colliding)));
});

test("mind map nodes persist tags, notes and safe links", () => {
  const content = structuredClone(mindMapTemplates.brainstorming);
  content.root.children[0].tags = ["增长", "实验"];
  content.root.children[0].note = "验证转化率假设";
  content.root.children[0].link = "https://example.com/experiment";
  const parsed = decodeMindMapContent(JSON.stringify(content));
  assert.deepEqual(parsed.root.children[0].tags, ["增长", "实验"]);
  assert.match(diagramPlainText(parsed), /验证转化率假设/);
  parsed.root.children[0].link = "javascript:alert(1)";
  assert.throws(() => decodeMindMapContent(JSON.stringify(parsed)), /链接无效/);
});

test("flowchart canonical schema owns layout, styles, nodes, and edges", () => {
  const parsed = decodeFlowchartContent(JSON.stringify(flowchartTemplates.approval));
  assert.equal(parsed.nodes.length, 4);
  assert.equal(parsed.edges.length, 3);
  assert.equal(parsed.nodes[2].type, "decision");
  assert.equal(parsed.layout, "horizontal");
  assert.match(diagramPlainText(parsed), /是/);
});

test("flowchart rejects LogicFlow snapshots and dangling or executable content", () => {
  assert.throws(() => decodeFlowchartContent(JSON.stringify({ nodes: [{ id: "start", type: "start", x: 10, y: 10, text: "开始" }], edges: [] })));
  const dangling = structuredClone(emptyFlowchartContent);
  dangling.edges.push({ id: "edge-1", source: "start", target: "missing", label: "", type: "polyline", style: { color: "#64748b", width: 2, dashed: false } });
  assert.throws(() => decodeFlowchartContent(JSON.stringify(dangling)));
  const unsafe = structuredClone(emptyFlowchartContent);
  unsafe.nodes[0].text = "坏\u0000内容";
  assert.throws(() => decodeFlowchartContent(JSON.stringify(unsafe)));
  const colliding = structuredClone(flowchartTemplates.approval);
  colliding.edges[0].id = "start";
  assert.throws(() => decodeFlowchartContent(JSON.stringify(colliding)));
});

test("flowchart accepts every product-owned semantic node type", () => {
  const content = structuredClone(emptyFlowchartContent);
  content.nodes = flowchartNodeTypes.map((type, index) => ({
    id: `node-${index}`,
    type,
    x: 120 + index * 20,
    y: 160,
    text: type,
    style: { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" },
  }));
  const parsed = decodeFlowchartContent(JSON.stringify(content));
  assert.deepEqual(parsed.nodes.map(node => node.type), [...flowchartNodeTypes]);
});

test("flowchart layout is deterministic and preserves canonical entities", () => {
  const horizontal = layoutFlowchart(structuredClone(flowchartTemplates.approval), "horizontal");
  const vertical = layoutFlowchart(structuredClone(flowchartTemplates.approval), "vertical");
  assert.deepEqual(horizontal.nodes.map(node => node.id), vertical.nodes.map(node => node.id));
  assert.ok(horizontal.nodes[1].x > horizontal.nodes[0].x);
  assert.ok(vertical.nodes[1].y > vertical.nodes[0].y);
  assert.deepEqual(horizontal.edges, vertical.edges);
});
