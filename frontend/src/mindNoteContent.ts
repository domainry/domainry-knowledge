import { kt, ktf } from "./i18n/runtime.ts";
import { documentBlockCommentQuote } from "./documentContent.ts";

export type MindNoteNode = {
  id: string;
  text: string;
  completed: boolean;
  collapsed: boolean;
  priority?: "none" | "low" | "medium" | "high" | "urgent";
  due_date?: string;
  tags?: string[];
  note?: string;
  children: MindNoteNode[];
};

export type MindNoteContent = {
  schema_version: 1;
  nodes: MindNoteNode[];
};

export const mindNoteMaximumNodes = 20_000;
export const mindNoteMaximumDepth = 64;

const requiredNodeKeys = ["children", "collapsed", "completed", "id", "text"];
const optionalNodeKeys = ["priority", "due_date", "tags", "note"];
const idPattern = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
const textEncoder = new TextEncoder();

export type MindNoteDocumentBlock = {
  id?: unknown;
  type: string;
  props?: unknown;
  content?: unknown;
  children?: readonly MindNoteDocumentBlock[];
};

type MindNoteDocumentOutputBlock = {
  id: string;
  type: "checkListItem" | "toggleListItem" | "bulletListItem";
  props: { checked?: boolean };
  content: { type: "text"; text: string; styles: Record<string, never> }[];
  children: MindNoteDocumentOutputBlock[];
};

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function exactKeys(value: Record<string, unknown>, expected: string[]) {
  const keys = Object.keys(value).sort();
  return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
}

function onlyNodeKeys(value: Record<string, unknown>) {
  const keys = Object.keys(value);
  return requiredNodeKeys.every(key => keys.includes(key)) && keys.every(key => requiredNodeKeys.includes(key) || optionalNodeKeys.includes(key));
}

function validText(value: unknown) {
  return typeof value === "string" && textEncoder.encode(value).byteLength <= 4096 && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function validateNode(value: unknown, depth: number, ids: Set<string>, counter: { value: number }): value is MindNoteNode {
  const node = object(value);
  if (!node || depth > mindNoteMaximumDepth || !onlyNodeKeys(node) || typeof node.id !== "string" || !idPattern.test(node.id) || ids.has(node.id) || !validText(node.text) || typeof node.completed !== "boolean" || typeof node.collapsed !== "boolean" || !Array.isArray(node.children)) return false;
  if (node.priority !== undefined && !["none", "low", "medium", "high", "urgent"].includes(String(node.priority))) return false;
  if (node.due_date !== undefined && (typeof node.due_date !== "string" || node.due_date !== "" && !validDate(node.due_date))) return false;
  if (node.note !== undefined && !validText(node.note)) return false;
  if (node.tags !== undefined && (!Array.isArray(node.tags) || node.tags.length > 12 || new Set(node.tags).size !== node.tags.length || !node.tags.every(tag => typeof tag === "string" && tag.trim() && textEncoder.encode(tag).byteLength <= 64 && !/[\u0000-\u001f\u007f]/.test(tag)))) return false;
  ids.add(node.id);
  counter.value += 1;
  if (counter.value > mindNoteMaximumNodes) return false;
  return node.children.every(child => validateNode(child, depth + 1, ids, counter));
}

export const emptyMindNoteContent: MindNoteContent = {
  schema_version: 1,
  nodes: [{ id: "note-1", get text() { return kt("knowledge.auto.bdbce97482269b4c"); }, completed: false, collapsed: false, children: [] }],
};

export function isMindNoteContent(value: unknown): value is MindNoteContent {
  const root = object(value);
  if (!root || !exactKeys(root, ["nodes", "schema_version"]) || root.schema_version !== 1 || !Array.isArray(root.nodes) || root.nodes.length === 0) return false;
  const ids = new Set<string>(), counter = { value: 0 };
  return root.nodes.every(node => validateNode(node, 1, ids, counter));
}

export function parseMindNoteContent(value: string): MindNoteContent {
  try {
    const parsed = JSON.parse(value);
    return isMindNoteContent(parsed) ? parsed : emptyMindNoteContent;
  } catch {
    return emptyMindNoteContent;
  }
}

export function canonicalMindNoteContent(value: MindNoteContent) {
  return JSON.stringify(value);
}

export function mindNotePlainText(value: MindNoteContent) {
  const lines: string[] = [];
  const visit = (nodes: MindNoteNode[], depth: number) => nodes.forEach(node => {
    lines.push(`${"  ".repeat(Math.max(0, depth - 1))}${node.completed ? "[x]" : "[ ]"} ${node.text}`.trimEnd());
    if (node.note) lines.push(`${"  ".repeat(depth)}${node.note}`);
    if (node.tags?.length) lines.push(`${"  ".repeat(depth)}${node.tags.map(tag => `#${tag}`).join(" ")}`);
    if (node.due_date) lines.push(ktf("knowledge.auto.1a44d52d6b3772cc", { value0: "  ".repeat(depth), value1: node.due_date }));
    visit(node.children, depth + 1);
  });
  visit(value.nodes, 1);
  return lines.join("\n");
}

function generatedID() {
  return `note-${crypto.randomUUID()}`;
}

export function createMindNoteNode(text = kt("knowledge.auto.050718c5e8783d31")): MindNoteNode {
  return { id: generatedID(), text, completed: false, collapsed: false, children: [] };
}

export function mindNoteToDocumentContent(value: MindNoteContent) {
  const convert = (node: MindNoteNode): MindNoteDocumentOutputBlock => ({
    id: node.id,
    type: node.completed ? "checkListItem" : node.collapsed && node.children.length ? "toggleListItem" : "bulletListItem",
    props: node.completed ? { checked: true } : {},
    content: node.text ? [{ type: "text", text: node.text, styles: {} }] : [],
    children: node.children.map(convert),
  });
  return JSON.stringify({ blocks: value.nodes.map(convert) });
}

export function documentBlocksToMindNote(blocks: readonly MindNoteDocumentBlock[]): MindNoteContent {
  const ids = new Set<string>();
  const convert = (block: MindNoteDocumentBlock): MindNoteNode => {
    let id = typeof block.id === "string" && idPattern.test(block.id) && !ids.has(block.id) ? block.id : generatedID();
    while (ids.has(id)) id = generatedID();
    ids.add(id);
    const props = object(block.props) || {};
    return {
      id,
      text: documentBlockCommentQuote({ type: block.type, props, content: block.content }),
      completed: block.type === "checkListItem" && props.checked === true,
      collapsed: block.type === "toggleListItem" && Boolean(block.children?.length),
      children: (block.children || []).map(convert),
    };
  };
  const nodes = blocks.map(convert);
  return { schema_version: 1, nodes: nodes.length ? nodes : [createMindNoteNode(kt("knowledge.auto.bdbce97482269b4c"))] };
}

