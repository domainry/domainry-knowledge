import { kt } from "./i18n/runtime.ts";
export const diagramThemes = ["emerald", "ocean", "sunset", "mono"] as const;
export type DiagramTheme = (typeof diagramThemes)[number];
export const mindMapLayouts = ["side", "left", "right", "down"] as const;
export type MindMapLayout = (typeof mindMapLayouts)[number];
export const flowchartLayouts = ["free", "horizontal", "vertical"] as const;
export type FlowchartLayout = (typeof flowchartLayouts)[number];
export const flowchartNodeTypes = [
  "start",
  "end",
  "process",
  "decision",
  "subprocess",
  "user_task",
  "service_task",
  "data",
  "database",
  "document",
  "manual_input",
  "preparation",
  "delay",
  "connector",
  "annotation",
] as const;
export type FlowchartNodeType = (typeof flowchartNodeTypes)[number];
export const flowchartEdgeTypes = ["polyline", "line", "bezier"] as const;
export type FlowchartEdgeType = (typeof flowchartEdgeTypes)[number];

export type DiagramNodeStyle = {
  color: string;
  background_color: string;
  font_weight: "normal" | "bold";
};

export type MindMapNode = {
  id: string;
  text: string;
  expanded: boolean;
  direction: "auto" | "left" | "right";
  style: DiagramNodeStyle;
  tags?: string[];
  note?: string;
  link?: string;
  children: MindMapNode[];
};

export type MindMapRelation = {
  id: string;
  from: string;
  to: string;
  label: string;
  bidirectional: boolean;
  color: string;
  width: number;
  dashed: boolean;
};

export type MindMapContent = {
  schema_version: 1;
  theme: DiagramTheme;
  layout: MindMapLayout;
  compact: boolean;
  root: MindMapNode;
  relations: MindMapRelation[];
};

export type FlowchartNode = {
  id: string;
  type: FlowchartNodeType;
  x: number;
  y: number;
  text: string;
  style: DiagramNodeStyle;
};

export type FlowchartEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  type: FlowchartEdgeType;
  style: { color: string; width: number; dashed: boolean };
};

export type FlowchartContent = {
  schema_version: 1;
  theme: DiagramTheme;
  layout: FlowchartLayout;
  grid: boolean;
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
};

const encoder = new TextEncoder();
const identifier = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
const color = /^#[0-9a-fA-F]{6}$/;
const nodeTypes = new Set<string>(flowchartNodeTypes);
const edgeTypes = new Set<string>(flowchartEdgeTypes);
const forbiddenText = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function exactObject(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every(key => keys.includes(key));
}

function nodeObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const required = ["id", "text", "expanded", "direction", "style", "children"];
  const allowed = [...required, "tags", "note", "link"];
  const keys = Object.keys(value);
  return required.every(key => keys.includes(key)) && keys.every(key => allowed.includes(key));
}

function validText(value: unknown, maximum = 4096): value is string {
  return typeof value === "string" && encoder.encode(value).byteLength <= maximum && !forbiddenText.test(value);
}

function validID(value: unknown): value is string {
  return typeof value === "string" && identifier.test(value);
}

function validColor(value: unknown): value is string {
  return typeof value === "string" && color.test(value);
}

function validFinite(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function validNodeStyle(value: unknown): value is DiagramNodeStyle {
  return exactObject(value, ["color", "background_color", "font_weight"])
    && validColor(value.color)
    && validColor(value.background_color)
    && (value.font_weight === "normal" || value.font_weight === "bold");
}

export const defaultDiagramNodeStyle: DiagramNodeStyle = Object.freeze({ color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" });

export const emptyMindMapContent: MindMapContent = {
  schema_version: 1,
  theme: "emerald",
  layout: "side",
  compact: true,
  root: { id: "root", get text() { return kt("knowledge.auto.0a3b20f6ca1cd764"); }, expanded: true, direction: "auto", style: { color: "#ffffff", background_color: "#00856a", font_weight: "bold" }, children: [] },
  relations: [],
};

export const emptyFlowchartContent: FlowchartContent = {
  schema_version: 1,
  theme: "emerald",
  layout: "free",
  grid: true,
  nodes: [{ id: "start", type: "start", x: 240, y: 160, get text() { return kt("knowledge.auto.d2bb025a2e51c410"); }, style: { ...defaultDiagramNodeStyle } }],
  edges: [],
};

function decodeRoot(body: string) {
  if (!validText(body, 8 * 1024 * 1024)) throw new Error(kt("knowledge.auto.12674be3c617771b"));
  const value = JSON.parse(body) as unknown;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(kt("knowledge.auto.1c0864d1d46af8a4"));
  return value as Record<string, unknown>;
}

function decodeMindNode(value: unknown, ids: Set<string>, depth: number, count: { value: number }): MindMapNode {
  if (depth > 64 || !nodeObject(value)) throw new Error(kt("knowledge.auto.e149d6350231122b"));
  if (!validID(value.id) || ids.has(value.id) || !validText(value.text) || typeof value.expanded !== "boolean" || !["auto", "left", "right"].includes(String(value.direction)) || !validNodeStyle(value.style) || !Array.isArray(value.children)) throw new Error(kt("knowledge.auto.e62d3f9fc7afd585"));
  if (value.tags !== undefined && (!Array.isArray(value.tags) || value.tags.length > 12 || new Set(value.tags).size !== value.tags.length || !value.tags.every(tag => validText(tag, 64) && tag.trim()))) throw new Error(kt("knowledge.auto.dee3dacdb14329cf"));
  if (value.note !== undefined && !validText(value.note, 4096)) throw new Error(kt("knowledge.auto.df357345843b286e"));
  if (value.link !== undefined) {
    if (!validText(value.link, 2048)) throw new Error(kt("knowledge.auto.b73d6fb24dc149f6"));
    if (value.link) { try { const parsed = new URL(value.link); if (parsed.protocol !== "http:" && parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error(); } catch { throw new Error(kt("knowledge.auto.b73d6fb24dc149f6")); } }
  }
  ids.add(value.id);
  count.value += 1;
  if (count.value > 20_000) throw new Error(kt("knowledge.auto.e1d678f298f04560"));
  return {
    id: value.id,
    text: value.text,
    expanded: value.expanded,
    direction: value.direction as MindMapNode["direction"],
    style: { ...value.style },
    ...(value.tags !== undefined ? { tags: [...value.tags as string[]] } : {}),
    ...(value.note !== undefined ? { note: value.note as string } : {}),
    ...(value.link !== undefined ? { link: value.link as string } : {}),
    children: value.children.map(child => decodeMindNode(child, ids, depth + 1, count)),
  };
}

export function decodeMindMapContent(body: string): MindMapContent {
  const value = decodeRoot(body);
  if (!exactObject(value, ["schema_version", "theme", "layout", "compact", "root", "relations"]) || value.schema_version !== 1 || !diagramThemes.includes(value.theme as DiagramTheme) || !mindMapLayouts.includes(value.layout as MindMapLayout) || typeof value.compact !== "boolean" || !Array.isArray(value.relations)) throw new Error(kt("knowledge.auto.d28e7e495cdcb362"));
  const ids = new Set<string>();
  const root = decodeMindNode(value.root, ids, 1, { value: 0 });
  if (value.relations.length > 20_000) throw new Error(kt("knowledge.auto.53f4b7458133b213"));
  const relationIDs = new Set<string>();
  const relations = value.relations.map(raw => {
    if (!exactObject(raw, ["id", "from", "to", "label", "bidirectional", "color", "width", "dashed"]) || !validID(raw.id) || ids.has(raw.id) || relationIDs.has(raw.id) || !validID(raw.from) || !validID(raw.to) || raw.from === raw.to || !ids.has(raw.from) || !ids.has(raw.to) || !validText(raw.label, 1024) || typeof raw.bidirectional !== "boolean" || !validColor(raw.color) || !validFinite(raw.width, 1, 12) || typeof raw.dashed !== "boolean") throw new Error(kt("knowledge.auto.b8108b1dcc1f1c54"));
    relationIDs.add(raw.id);
    return { id: raw.id, from: raw.from, to: raw.to, label: raw.label, bidirectional: raw.bidirectional, color: raw.color, width: raw.width, dashed: raw.dashed } satisfies MindMapRelation;
  });
  return { schema_version: 1, theme: value.theme as DiagramTheme, layout: value.layout as MindMapLayout, compact: value.compact, root, relations };
}

export function parseMindMapContent(body: string) {
  try { return decodeMindMapContent(body); } catch { return structuredClone(emptyMindMapContent); }
}

export function canonicalMindMapContent(content: MindMapContent) {
  return JSON.stringify(decodeMindMapContent(JSON.stringify(content)));
}

export function decodeFlowchartContent(body: string): FlowchartContent {
  const value = decodeRoot(body);
  if (!exactObject(value, ["schema_version", "theme", "layout", "grid", "nodes", "edges"]) || value.schema_version !== 1 || !diagramThemes.includes(value.theme as DiagramTheme) || !flowchartLayouts.includes(value.layout as FlowchartLayout) || typeof value.grid !== "boolean" || !Array.isArray(value.nodes) || !Array.isArray(value.edges) || value.nodes.length > 20_000 || value.edges.length > 40_000) throw new Error(kt("knowledge.auto.a6d825fccda12ec5"));
  const ids = new Set<string>();
  const nodes = value.nodes.map(raw => {
    if (!exactObject(raw, ["id", "type", "x", "y", "text", "style"]) || !validID(raw.id) || ids.has(raw.id) || !nodeTypes.has(String(raw.type)) || !validFinite(raw.x, -10_000_000, 10_000_000) || !validFinite(raw.y, -10_000_000, 10_000_000) || !validText(raw.text) || !validNodeStyle(raw.style)) throw new Error(kt("knowledge.auto.1ff595fa81ed91bb"));
    ids.add(raw.id);
    return { id: raw.id, type: raw.type as FlowchartNode["type"], x: raw.x, y: raw.y, text: raw.text, style: { ...raw.style } } satisfies FlowchartNode;
  });
  const edgeIDs = new Set<string>();
  const edges = value.edges.map(raw => {
    if (!exactObject(raw, ["id", "source", "target", "label", "type", "style"]) || !validID(raw.id) || ids.has(raw.id) || edgeIDs.has(raw.id) || !validID(raw.source) || !validID(raw.target) || raw.source === raw.target || !ids.has(raw.source) || !ids.has(raw.target) || !validText(raw.label, 1024) || !edgeTypes.has(String(raw.type)) || !exactObject(raw.style, ["color", "width", "dashed"]) || !validColor(raw.style.color) || !validFinite(raw.style.width, 1, 12) || typeof raw.style.dashed !== "boolean") throw new Error(kt("knowledge.auto.e211dbfe2e6da37e"));
    edgeIDs.add(raw.id);
    return { id: raw.id, source: raw.source, target: raw.target, label: raw.label, type: raw.type as FlowchartEdge["type"], style: { color: raw.style.color, width: raw.style.width, dashed: raw.style.dashed } } satisfies FlowchartEdge;
  });
  return { schema_version: 1, theme: value.theme as DiagramTheme, layout: value.layout as FlowchartLayout, grid: value.grid, nodes, edges };
}

export function parseFlowchartContent(body: string) {
  try { return decodeFlowchartContent(body); } catch { return structuredClone(emptyFlowchartContent); }
}

export function canonicalFlowchartContent(content: FlowchartContent) {
  return JSON.stringify(decodeFlowchartContent(JSON.stringify(content)));
}

export const mindMapTemplates: Record<string, MindMapContent> = {
  brainstorming: {
    schema_version: 1, theme: "emerald", layout: "side", compact: true, relations: [],
    root: { id: "root", get text() { return kt("knowledge.auto.ea4d59a0e56e937f"); }, expanded: true, direction: "auto", style: { color: "#ffffff", background_color: "#00856a", font_weight: "bold" }, get children() { return [kt("knowledge.auto.57060c88a36bf3d0"), kt("knowledge.auto.0e65f5e407c4b255"), kt("knowledge.auto.253fb75906c692ba")].map((text, index) => ({ id: `idea-${index + 1}`, text, expanded: true, direction: "auto" as const, style: { ...defaultDiagramNodeStyle }, children: [] })); } },
  },
  swot: {
    schema_version: 1, theme: "ocean", layout: "side", compact: true, relations: [],
    root: { id: "root", get text() { return kt("knowledge.auto.8498736be653401c"); }, expanded: true, direction: "auto", style: { color: "#ffffff", background_color: "#2563eb", font_weight: "bold" }, get children() { return [kt("knowledge.auto.ed9b4414f20c2459"), kt("knowledge.auto.9a660d1b3eee09ca"), kt("knowledge.auto.558d9951283ea1e2"), kt("knowledge.auto.7ad811d16a3220e1")].map((text, index) => ({ id: `swot-${index + 1}`, text, expanded: true, direction: "auto" as const, style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" as const }, children: [] })); } },
  },
};

export const flowchartTemplates: Record<string, FlowchartContent> = {
  approval: {
    schema_version: 1, theme: "emerald", layout: "horizontal", grid: true,
    nodes: [
      { id: "start", type: "start", x: 160, y: 220, get text() { return kt("knowledge.auto.08a85f4ab4bab9ca"); }, style: { ...defaultDiagramNodeStyle } },
      { id: "review", type: "user_task", x: 440, y: 220, get text() { return kt("knowledge.auto.64d021080a5fbcb3"); }, style: { ...defaultDiagramNodeStyle } },
      { id: "decision", type: "decision", x: 720, y: 220, get text() { return kt("knowledge.auto.6176d6934cd58da3"); }, style: { color: "#6b3f00", background_color: "#fff3cd", font_weight: "bold" } },
      { id: "done", type: "end", x: 1000, y: 220, get text() { return kt("knowledge.auto.c0b3fbff51ccc40b"); }, style: { ...defaultDiagramNodeStyle } },
    ],
    edges: [
      { id: "edge-1", source: "start", target: "review", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: false } },
      { id: "edge-2", source: "review", target: "decision", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: false } },
      { id: "edge-3", source: "decision", target: "done", get label() { return kt("knowledge.auto.b5141d3d19e9a048"); }, type: "polyline", style: { color: "#789087", width: 2, dashed: false } },
    ],
  },
  incident: {
    schema_version: 1, theme: "sunset", layout: "vertical", grid: true,
    nodes: [
      { id: "alert", type: "start", x: 420, y: 100, get text() { return kt("knowledge.auto.06730068dc789e19"); }, style: { color: "#7c2d12", background_color: "#ffedd5", font_weight: "bold" } },
      { id: "triage", type: "user_task", x: 420, y: 300, get text() { return kt("knowledge.auto.bc638a479307a6a1"); }, style: { color: "#7c2d12", background_color: "#fff7ed", font_weight: "normal" } },
      { id: "recover", type: "service_task", x: 420, y: 500, get text() { return kt("knowledge.auto.da81860964d8a684"); }, style: { color: "#7c2d12", background_color: "#fff7ed", font_weight: "normal" } },
    ],
    edges: [
      { id: "edge-1", source: "alert", target: "triage", label: "", type: "polyline", style: { color: "#c2410c", width: 2, dashed: false } },
      { id: "edge-2", source: "triage", target: "recover", label: "", type: "polyline", style: { color: "#c2410c", width: 2, dashed: false } },
    ],
  },
  data_pipeline: {
    schema_version: 1, theme: "ocean", layout: "horizontal", grid: true,
    nodes: [
      { id: "source", type: "database", x: 140, y: 220, get text() { return kt("knowledge.auto.41a528415dc98129"); }, style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "bold" } },
      { id: "extract", type: "data", x: 420, y: 220, get text() { return kt("knowledge.auto.7612b591a341b368"); }, style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" } },
      { id: "transform", type: "subprocess", x: 700, y: 220, get text() { return kt("knowledge.auto.9cfc0a2b07c79685"); }, style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "normal" } },
      { id: "warehouse", type: "database", x: 980, y: 220, get text() { return kt("knowledge.auto.1f43d19d8f19de58"); }, style: { color: "#17324d", background_color: "#eaf2ff", font_weight: "bold" } },
    ],
    edges: [
      { id: "edge-1", source: "source", target: "extract", get label() { return kt("knowledge.auto.534cb3fa8fbf373f"); }, type: "polyline", style: { color: "#3b82f6", width: 2, dashed: false } },
      { id: "edge-2", source: "extract", target: "transform", get label() { return kt("knowledge.auto.17da5eb22d21d651"); }, type: "polyline", style: { color: "#3b82f6", width: 2, dashed: false } },
      { id: "edge-3", source: "transform", target: "warehouse", get label() { return kt("knowledge.auto.1745fb93b094fc91"); }, type: "polyline", style: { color: "#3b82f6", width: 2, dashed: false } },
    ],
  },
  customer_service: {
    schema_version: 1, theme: "emerald", layout: "vertical", grid: true,
    nodes: [
      { id: "request", type: "manual_input", x: 420, y: 100, get text() { return kt("knowledge.auto.06ac43e51307fcf8"); }, style: { ...defaultDiagramNodeStyle } },
      { id: "agent", type: "user_task", x: 420, y: 280, get text() { return kt("knowledge.auto.75e5baa8612dcb49"); }, style: { ...defaultDiagramNodeStyle } },
      { id: "known", type: "decision", x: 420, y: 470, get text() { return kt("knowledge.auto.5195764a72513a11"); }, style: { color: "#6b3f00", background_color: "#fff3cd", font_weight: "bold" } },
      { id: "auto", type: "service_task", x: 700, y: 470, get text() { return kt("knowledge.auto.ecfe4c3b70cd07ca"); }, style: { ...defaultDiagramNodeStyle } },
      { id: "finish", type: "end", x: 420, y: 660, get text() { return kt("knowledge.auto.0e4f625d557d2da8"); }, style: { ...defaultDiagramNodeStyle } },
    ],
    edges: [
      { id: "edge-1", source: "request", target: "agent", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: false } },
      { id: "edge-2", source: "agent", target: "known", label: "", type: "polyline", style: { color: "#789087", width: 2, dashed: false } },
      { id: "edge-3", source: "known", target: "auto", get label() { return kt("knowledge.auto.b5141d3d19e9a048"); }, type: "bezier", style: { color: "#789087", width: 2, dashed: false } },
      { id: "edge-4", source: "known", target: "finish", get label() { return kt("knowledge.auto.7b33f46c39d26ae3"); }, type: "polyline", style: { color: "#789087", width: 2, dashed: true } },
      { id: "edge-5", source: "auto", target: "finish", label: "", type: "bezier", style: { color: "#789087", width: 2, dashed: false } },
    ],
  },
};

export function layoutFlowchart(content: FlowchartContent, layout: FlowchartLayout): FlowchartContent {
  if (layout === "free" || content.nodes.length < 2) return { ...content, layout };
  const incoming = new Map(content.nodes.map(node => [node.id, 0]));
  const children = new Map(content.nodes.map(node => [node.id, [] as string[]]));
  for (const edge of content.edges) {
    incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
    children.get(edge.source)?.push(edge.target);
  }
  const roots = content.nodes.filter(node => incoming.get(node.id) === 0).map(node => node.id);
  const queue = (roots.length ? roots : [content.nodes[0].id]).map(id => ({ id, level: 0 }));
  const levels = new Map<string, number>();
  while (queue.length) {
    const current = queue.shift()!;
    if ((levels.get(current.id) ?? -1) >= current.level) continue;
    levels.set(current.id, current.level);
    for (const child of children.get(current.id) || []) queue.push({ id: child, level: current.level + 1 });
  }
  content.nodes.forEach(node => { if (!levels.has(node.id)) levels.set(node.id, 0); });
  const rows = new Map<number, number>();
  const nodes = content.nodes.map(node => {
    const level = levels.get(node.id) || 0;
    const row = rows.get(level) || 0;
    rows.set(level, row + 1);
    return { ...node, x: layout === "horizontal" ? 180 + level * 280 : 180 + row * 260, y: layout === "horizontal" ? 140 + row * 150 : 120 + level * 190 };
  });
  return { ...content, layout, nodes };
}

export function diagramPlainText(content: MindMapContent | FlowchartContent) {
  if ("root" in content) {
    const lines: string[] = [];
    const visit = (node: MindMapNode, depth: number) => { lines.push(`${"  ".repeat(depth)}${node.text}`); if (node.note) lines.push(`${"  ".repeat(depth + 1)}${node.note}`); if (node.tags?.length) lines.push(`${"  ".repeat(depth + 1)}${node.tags.map(tag => `#${tag}`).join(" ")}`); node.children.forEach(child => visit(child, depth + 1)); };
    visit(content.root, 0);
    content.relations.forEach(relation => { if (relation.label.trim()) lines.push(relation.label); });
    return lines.join("\n");
  }
  return [...content.nodes.map(node => node.text), ...content.edges.map(edge => edge.label)].filter(text => text.trim()).join("\n");
}

export function downloadDiagramBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  // A detached anchor followed by microtask revocation races the download
  // consumer in embedded browsers. Keep the URL alive through the navigation
  // task, then remove both temporary resources.
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 1_000);
}
