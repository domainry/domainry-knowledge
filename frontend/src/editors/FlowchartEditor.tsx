import { kt, ktf } from "../i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import LogicFlow from "@logicflow/core";
import { Snapshot } from "@logicflow/extension";
import "@logicflow/core/dist/index.css";
import { Boxes, Braces, CircleDot, CirclePlay, CircleStop, Cog, Database, Diamond, FileJson, FileText, GitBranch, Hexagon, Image, Keyboard, LayoutTemplate, Palette, PanelTop, Plus, Route, Square, StickyNote, Timer, Upload, UserRound, Workflow, type LucideIcon } from "lucide-react";
import { Button, Select } from "../components.tsx";
import { canonicalFlowchartContent, decodeFlowchartContent, diagramPlainText, diagramThemes, downloadDiagramBlob, flowchartEdgeTypes, flowchartLayouts, flowchartTemplates, layoutFlowchart, parseFlowchartContent, type DiagramTheme, type FlowchartContent, type FlowchartEdgeType, type FlowchartLayout, type FlowchartNode, type FlowchartNodeType } from "../diagramContent.ts";
import { registerFlowchartNodeShapes, runtimeFlowchartNodeType } from "./flowchartNodeShapes.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

LogicFlow.use(Snapshot);

const flowThemes: Record<DiagramTheme, { fill: string; stroke: string; text: string; decision: string; edge: string; background: string }> = {
  emerald: { fill: "#e8f5f0", stroke: "#00856a", text: "#17332b", decision: "#fff3cd", edge: "#789087", background: "#fbfdfc" },
  ocean: { fill: "#eaf2ff", stroke: "#2563eb", text: "#17324d", decision: "#e0f2fe", edge: "#3b82f6", background: "#f8fbff" },
  sunset: { fill: "#fff7ed", stroke: "#ea580c", text: "#7c2d12", decision: "#fef3c7", edge: "#c2410c", background: "#fffaf5" },
  mono: { fill: "#f1f5f9", stroke: "#475569", text: "#1e293b", decision: "#e2e8f0", edge: "#64748b", background: "#fafafa" },
};

type LogicRawData = { nodes: Array<Record<string, any>>; edges: Array<Record<string, any>> };

type FlowchartNodeDefinition = { type: FlowchartNodeType; label: string; description: string; icon: LucideIcon };
const flowchartNodeGroups: Array<{ label: string; nodes: FlowchartNodeDefinition[] }> = [
  {
    get label() { return kt("knowledge.auto.1bb4b097f5cd2ed9"); },
    nodes: [
      { type: "start", get label() { return kt("knowledge.auto.d2bb025a2e51c410"); }, get description() { return kt("knowledge.auto.f31adc3cba5d6187"); }, icon: CirclePlay },
      { type: "end", get label() { return kt("knowledge.auto.c7b24e7997e96eaa"); }, get description() { return kt("knowledge.auto.de5797d00b1bcdbf"); }, icon: CircleStop },
      { type: "process", get label() { return kt("knowledge.auto.43cfc12dea36e045"); }, get description() { return kt("knowledge.auto.c5dd352901ad8a90"); }, icon: Square },
      { type: "decision", get label() { return kt("knowledge.auto.65ae7e60a3f2eb10"); }, get description() { return kt("knowledge.auto.c6de23d6f88f4639"); }, icon: Diamond },
      { type: "subprocess", get label() { return kt("knowledge.auto.d9d4edb0323719db"); }, get description() { return kt("knowledge.auto.c3530be771751061"); }, icon: PanelTop },
    ],
  },
  {
    get label() { return kt("knowledge.auto.50ed26b9a420a22d"); },
    nodes: [
      { type: "user_task", get label() { return kt("knowledge.auto.ae74c2ad7b7c2a42"); }, get description() { return kt("knowledge.auto.88473e081f9992d3"); }, icon: UserRound },
      { type: "service_task", get label() { return kt("knowledge.auto.44dc0ac37a921a97"); }, get description() { return kt("knowledge.auto.43ecbeda7d2c875d"); }, icon: Cog },
      { type: "manual_input", get label() { return kt("knowledge.auto.89124f03766fb057"); }, get description() { return kt("knowledge.auto.ca65a275aa918e1e"); }, icon: Keyboard },
      { type: "preparation", get label() { return kt("knowledge.auto.ddcf6e77b0ee1000"); }, get description() { return kt("knowledge.auto.014c4b9706dab099"); }, icon: Hexagon },
      { type: "delay", get label() { return kt("knowledge.auto.18045b8c40f135cd"); }, get description() { return kt("knowledge.auto.ee5a828eb2f9f633"); }, icon: Timer },
    ],
  },
  {
    get label() { return kt("knowledge.auto.64b05296033bee82"); },
    nodes: [
      { type: "data", get label() { return kt("knowledge.auto.5440f7424f2865bf"); }, get description() { return kt("knowledge.auto.2be137fcdcd58b53"); }, icon: Braces },
      { type: "database", get label() { return kt("knowledge.auto.263200d7d529b522"); }, get description() { return kt("knowledge.auto.0cdd9daa7c0b7148"); }, icon: Database },
      { type: "document", get label() { return kt("knowledge.auto.2687ccdbb1d2288a"); }, get description() { return kt("knowledge.auto.1c970d89344ed2a1"); }, icon: FileText },
      { type: "connector", get label() { return kt("knowledge.auto.3e41c2b24c1eb7ef"); }, get description() { return kt("knowledge.auto.5d3a42383fe75a46"); }, icon: CircleDot },
      { type: "annotation", get label() { return kt("knowledge.auto.508bf3307053298f"); }, get description() { return kt("knowledge.auto.6f3ebd2d3e876212"); }, icon: StickyNote },
    ],
  },
];

const flowchartNodeLabels = new Map(flowchartNodeGroups.flatMap(group => group.nodes.map(node => [node.type, node.label])));

function textValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof (value as { value?: unknown }).value === "string") return (value as { value: string }).value;
  return "";
}

function nodeRuntimeProperties(style: FlowchartNode["style"], type: FlowchartNodeType) {
  return {
    knowledgeNodeType: type,
    knowledgeStyle: style,
    style: { fill: style.background_color, stroke: style.color, strokeWidth: type === "end" ? 4 : style.font_weight === "bold" ? 3 : 2 },
    textStyle: { color: style.color, fontWeight: style.font_weight === "bold" ? 700 : 400 },
  };
}

function nodeStyleForType(type: FlowchartNodeType, colors: (typeof flowThemes)[DiagramTheme]): FlowchartNode["style"] {
  const emphasized = type === "decision" || type === "end";
  return {
    color: colors.text,
    background_color: type === "decision" ? colors.decision : colors.fill,
    font_weight: emphasized ? "bold" : "normal",
  };
}

function runtimeFlow(content: FlowchartContent): LogicFlow.GraphConfigData {
  return {
    nodes: content.nodes.map(node => ({ id: node.id, type: runtimeFlowchartNodeType(node.type), x: node.x, y: node.y, text: node.text, properties: nodeRuntimeProperties(node.style, node.type) })),
    edges: content.edges.map(edge => ({ id: edge.id, type: edge.type, sourceNodeId: edge.source, targetNodeId: edge.target, text: edge.label, properties: { knowledgeStyle: edge.style, style: { stroke: edge.style.color, strokeWidth: edge.style.width, strokeDasharray: edge.style.dashed ? "6 4" : "" } } })),
  };
}

function canonicalFromRuntime(raw: LogicRawData, metadata: Pick<FlowchartContent, "theme" | "layout" | "grid">): FlowchartContent {
  return decodeFlowchartContent(JSON.stringify({
    schema_version: 1,
    ...metadata,
    nodes: raw.nodes.map(node => ({
      id: node.id,
      type: node.properties?.knowledgeNodeType,
      x: node.x,
      y: node.y,
      text: textValue(node.text),
      style: node.properties?.knowledgeStyle || { color: "#17332b", background_color: "#e8f5f0", font_weight: "normal" },
    })),
    edges: raw.edges.map(edge => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      label: textValue(edge.text),
      type: edge.type || "polyline",
      style: edge.properties?.knowledgeStyle || { color: "#789087", width: 2, dashed: false },
    })),
  }));
}

function applyRuntimeStyles(lf: LogicFlow, content: FlowchartContent) {
  for (const node of content.nodes) {
    const model = lf.getNodeModelById(node.id);
    if (model) model.setProperties({ ...model.getProperties(), ...nodeRuntimeProperties(node.style, node.type) });
  }
  for (const edge of content.edges) {
    const model = lf.getEdgeModelById(edge.id);
    if (model) model.setProperties({ ...model.getProperties(), knowledgeStyle: edge.style, style: { stroke: edge.style.color, strokeWidth: edge.style.width, strokeDasharray: edge.style.dashed ? "6 4" : "" } });
  }
}

function setLogicTheme(lf: LogicFlow, theme: DiagramTheme) {
  const selected = flowThemes[theme];
  lf.setTheme({
    rect: { fill: selected.fill, stroke: selected.stroke, radius: 10 },
    ellipse: { fill: selected.fill, stroke: selected.stroke },
    circle: { fill: selected.fill, stroke: selected.stroke },
    polygon: { fill: selected.fill, stroke: selected.stroke },
    diamond: { fill: selected.decision, stroke: selected.stroke },
    polyline: { stroke: selected.edge },
    line: { stroke: selected.edge },
    bezier: { stroke: selected.edge },
    nodeText: { color: selected.text, fontSize: 12 },
    edgeText: { color: selected.text, fontSize: 12, textWidth: 120 },
  });
}

function renderContent(lf: LogicFlow, content: FlowchartContent) {
  setLogicTheme(lf, content.theme);
  lf.render(runtimeFlow(content));
  applyRuntimeStyles(lf, content);
}

function restoreFlowchartSelection(lf: LogicFlow, elementID: string) {
  lf.clearSelectElements();
  if (!elementID) return { exists: false, isNode: false };
  const isNode = Boolean(lf.getNodeModelById(elementID));
  const exists = isNode || Boolean(lf.getEdgeModelById(elementID));
  if (exists) lf.selectElementById(elementID);
  return { exists, isNode };
}

export function FlowchartEditor({ body, readOnly = false, documentTitle = kt("knowledge.auto.f6fdf82e9a8999b7"), initialBlockID, pageActionHost, authorizeContentAction, onChange, onPresence, onCommentAnchor, onActionFeedback }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const logic = useRef<LogicFlow | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const insertMenu = useRef<HTMLDetailsElement>(null);
  const initialBody = useRef(body);
  const content = useRef(parseFlowchartContent(body));
  const onChangeRef = useRef(onChange);
  const selectionCallbacksRef = useRef({ onPresence, onCommentAnchor });
  const [theme, setTheme] = useState(content.current.theme);
  const [layout, setLayout] = useState(content.current.layout);
  const [edgeType, setEdgeType] = useState<FlowchartEdgeType>("polyline");
  const [selectedID, setSelectedID] = useState("");
  const [selectedNodeID, setSelectedNodeID] = useState("");
  onChangeRef.current = onChange;
  selectionCallbacksRef.current = { onPresence, onCommentAnchor };

  const commit = (next: FlowchartContent) => {
    content.current = next;
    setTheme(next.theme);
    setLayout(next.layout);
    onChangeRef.current(canonicalFlowchartContent(next));
  };

  const sync = (lf: LogicFlow) => {
    if (!readOnly) commit(canonicalFromRuntime(lf.getGraphRawData() as LogicRawData, content.current));
  };

  useEffect(() => {
    if (!host.current) return;
    content.current = parseFlowchartContent(initialBody.current);
    const lf = new LogicFlow({ container: host.current, grid: content.current.grid, keyboard: { enabled: !readOnly }, isSilentMode: readOnly, edgeType });
    registerFlowchartNodeShapes(lf);
    lf.setDefaultEdgeType(edgeType);
    renderContent(lf, content.current);
    logic.current = lf;
    const events = "node:add,node:delete,node:drop,edge:add,edge:delete,edge:adjust,text:update";
    const onSync = () => sync(lf);
    const select = ({ data }: { data: Record<string, any> }) => {
      const id = typeof data.id === "string" ? data.id : "";
      const isNode = Boolean(id) && !data.sourceNodeId;
      const semanticType = data.properties?.knowledgeNodeType as FlowchartNodeType | undefined;
      const quote = textValue(data.text) || (data.sourceNodeId ? kt("knowledge.auto.39f3b6080baa03b2") : semanticType ? ktf("knowledge.auto.e5f3a2fa46c9929f", { value0: flowchartNodeLabels.get(semanticType) || kt("knowledge.common.process") }) : kt("knowledge.auto.3b48ee9d9e952403"));
      setSelectedID(id);
      setSelectedNodeID(isNode ? id : "");
      selectionCallbacksRef.current.onPresence?.(id || undefined);
      selectionCallbacksRef.current.onCommentAnchor?.(id ? { nodeID: id, quote } : undefined);
    };
    const clear = () => {
      setSelectedID("");
      setSelectedNodeID("");
      selectionCallbacksRef.current.onPresence?.();
      selectionCallbacksRef.current.onCommentAnchor?.();
    };
    lf.on(events, onSync);
    lf.on("element:click", select);
    lf.on("blank:click", clear);
    return () => {
      lf.off(events, onSync);
      lf.off("element:click", select);
      lf.off("blank:click", clear);
      logic.current = null;
      if (host.current) host.current.replaceChildren();
    };
  }, [readOnly]);

  useEffect(() => {
    const lf = logic.current;
    if (!lf || !initialBlockID) return;
    const restored = restoreFlowchartSelection(lf, initialBlockID);
    if (!restored.exists) return;
    setSelectedID(initialBlockID);
    setSelectedNodeID(restored.isNode ? initialBlockID : "");
    lf.focusOn(initialBlockID);
  }, [initialBlockID]);

  useEffect(() => {
    const lf = logic.current;
    if (!lf) return;
    let next: FlowchartContent;
    try { next = decodeFlowchartContent(body); } catch { return; }
    if (canonicalFlowchartContent(next) === canonicalFlowchartContent(content.current)) return;
    content.current = next;
    setTheme(next.theme);
    setLayout(next.layout);
    renderContent(lf, next);
    const restored = restoreFlowchartSelection(lf, selectedID);
    if (restored.exists) {
      setSelectedNodeID(restored.isNode ? selectedID : "");
      return;
    }
    setSelectedID("");
    setSelectedNodeID("");
    selectionCallbacksRef.current.onPresence?.();
    selectionCallbacksRef.current.onCommentAnchor?.();
  }, [body, selectedID]);

  const add = (type: FlowchartNode["type"], text: string) => {
    const lf = logic.current;
    if (!lf) return;
    const colors = flowThemes[content.current.theme];
    const id = `flow-${crypto.randomUUID()}`;
    const offset = content.current.nodes.length;
    const style = nodeStyleForType(type, colors);
    lf.addNode({ id, type: runtimeFlowchartNodeType(type), x: 220 + offset % 4 * 220, y: 130 + Math.floor(offset / 4) * 150, text, properties: nodeRuntimeProperties(style, type) });
    applyRuntimeStyles(lf, canonicalFromRuntime(lf.getGraphRawData() as LogicRawData, content.current));
    insertMenu.current?.removeAttribute("open");
  };

  const applyEdgeType = (nextType: FlowchartEdgeType) => {
    setEdgeType(nextType);
    logic.current?.setDefaultEdgeType(nextType);
    onActionFeedback?.(ktf("knowledge.auto.a18f07886bb5ce7d", { value0: ({ polyline: kt("knowledge.auto.f5b8cf7d59b7f2ba"), line: kt("knowledge.auto.c94b5ebf51692703"), bezier: kt("knowledge.auto.937dc7bf30afae3e") } as const)[nextType] }));
  };

  const applyTheme = (nextTheme: DiagramTheme) => {
    const lf = logic.current;
    if (!lf) return;
    const colors = flowThemes[nextTheme];
    const next: FlowchartContent = {
      ...content.current,
      theme: nextTheme,
      nodes: content.current.nodes.map(node => ({ ...node, style: { ...nodeStyleForType(node.type, colors), font_weight: node.style.font_weight } })),
      edges: content.current.edges.map(edge => ({ ...edge, style: { ...edge.style, color: colors.edge } })),
    };
    renderContent(lf, next);
    restoreFlowchartSelection(lf, selectedID);
    commit(next);
  };

  const applyLayout = (nextLayout: FlowchartLayout) => {
    const lf = logic.current;
    if (!lf) return;
    const next = layoutFlowchart(canonicalFromRuntime(lf.getGraphRawData() as LogicRawData, content.current), nextLayout);
    renderContent(lf, next);
    restoreFlowchartSelection(lf, selectedID);
    lf.fitView();
    commit(next);
  };

  const applySelectedStyle = (patch: Partial<FlowchartNode["style"]>) => {
    const lf = logic.current;
    const model = selectedNodeID ? lf?.getNodeModelById(selectedNodeID) : undefined;
    if (!lf || !model) return;
    const existing = (model.getProperties().knowledgeStyle || {}) as FlowchartNode["style"];
    const nextStyle = { ...existing, ...patch };
    const type = model.getProperties().knowledgeNodeType as FlowchartNodeType;
    lf.setProperties(selectedNodeID, { ...model.getProperties(), ...nodeRuntimeProperties(nextStyle, type) });
    sync(lf);
  };

  const applyTemplate = (key: string) => {
    const lf = logic.current;
    const template = flowchartTemplates[key];
    if (!lf || !template) return;
    const next = structuredClone(template);
    setSelectedID("");
    setSelectedNodeID("");
    selectionCallbacksRef.current.onPresence?.();
    selectionCallbacksRef.current.onCommentAnchor?.();
    renderContent(lf, next);
    lf.fitView();
    commit(next);
    onActionFeedback?.(kt("knowledge.auto.155d9b8b82301db7"));
  };

  const importJSON = async (file?: File) => {
    if (!file) return;
    try {
      const next = decodeFlowchartContent(await file.text());
      setSelectedID("");
      setSelectedNodeID("");
      selectionCallbacksRef.current.onPresence?.();
      selectionCallbacksRef.current.onCommentAnchor?.();
      if (logic.current) { renderContent(logic.current, next); logic.current.fitView(); }
      commit(next);
      onActionFeedback?.(kt("knowledge.auto.bc0bb9420bdcc015"));
    } catch (error) { onActionFeedback?.(error instanceof Error ? error.message : kt("knowledge.auto.d5d4ca58693603db")); }
    if (importInput.current) importInput.current.value = "";
  };

  const exportJSON = async () => {
    if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
    await authorizeContentAction("export");
    downloadDiagramBlob(new Blob([canonicalFlowchartContent(content.current)], { type: "application/json" }), `${documentTitle || kt("knowledge.auto.f6fdf82e9a8999b7")}.json`);
  };
  const exportPNG = async () => {
    if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
    await authorizeContentAction("export");
    const lf = logic.current as (LogicFlow & { getSnapshotBlob?(background?: string, type?: string, options?: Record<string, unknown>): Promise<{ data: Blob | string }> }) | null;
    const result = await lf?.getSnapshotBlob?.(flowThemes[content.current.theme].background, "png", { padding: 48 });
    if (result?.data instanceof Blob) downloadDiagramBlob(result.data, `${documentTitle || kt("knowledge.auto.f6fdf82e9a8999b7")}.png`);
    else onActionFeedback?.(kt("knowledge.auto.92f11dea02bb70fd"));
  };

  return <div className="knowledge-open-editor is-logicflow">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button onClick={() => void exportJSON().catch(error => onActionFeedback?.(error instanceof Error ? error.message : kt("knowledge.auto.f7862b83251f2349")))}><FileJson size={15} />JSON</Button>
      <Button onClick={() => void exportPNG().catch(error => onActionFeedback?.(error instanceof Error ? error.message : kt("knowledge.auto.f7862b83251f2349")))}><Image size={15} />PNG</Button>
    </PageActionPortal>}
    {!readOnly && <div className="diagram-editor-toolbar" aria-label={kt("knowledge.auto.eb7c3906413e8775")}>
      <div className="diagram-insert-tools">
        <details ref={insertMenu} className="flowchart-node-menu">
          <summary><Plus size={15} />{kt("knowledge.auto.2410d860f093b767")}</summary>
          <div className="flowchart-node-menu-panel" role="menu" aria-label={kt("knowledge.auto.e3b1d196375a14c1")}>
            <header><Workflow size={17} /><span><strong>{kt("knowledge.auto.e3b1d196375a14c1")}</strong><small>{kt("knowledge.auto.ec2cfb6c3fdc550e")}</small></span></header>
            {flowchartNodeGroups.map(group => <section key={group.label}>
              <h4>{group.label}</h4>
              <div>
                {group.nodes.map(item => {
                  const Icon = item.icon;
                  return <button key={item.type} type="button" role="menuitem" onClick={() => add(item.type, item.label)}>
                    <span className={`flowchart-node-glyph is-${item.type}`}><Icon size={17} /></span>
                    <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  </button>;
                })}
              </div>
            </section>)}
          </div>
        </details>
        <Button onClick={() => add("process", kt("knowledge.auto.43cfc12dea36e045"))}><Square size={15} />{kt("knowledge.auto.4ec7d4554df93e74")}</Button>
        <Button onClick={() => add("decision", kt("knowledge.auto.af704ba2526cf300"))}><GitBranch size={15} />{kt("knowledge.auto.65ae7e60a3f2eb10")}</Button>
      </div>
      <label><Route size={15} />{kt("knowledge.auto.fdc2e8ffaaa6b562")}<Select aria-label={kt("knowledge.auto.b84fdb4fe15c10cc")} value={edgeType} onChange={event => applyEdgeType(event.target.value as FlowchartEdgeType)}>{flowchartEdgeTypes.map(item => <option key={item} value={item}>{({ polyline: kt("knowledge.auto.f5b8cf7d59b7f2ba"), line: kt("knowledge.auto.c94b5ebf51692703"), bezier: kt("knowledge.auto.937dc7bf30afae3e") } as const)[item]}</option>)}</Select></label>
      <label><Palette size={15} />{kt("knowledge.auto.788db1cfec2a3db5")}<Select aria-label={kt("knowledge.auto.f125e56df6439f55")} value={theme} onChange={event => applyTheme(event.target.value as DiagramTheme)}>{diagramThemes.map(item => <option key={item} value={item}>{({ emerald: kt("knowledge.auto.8fabc966781dcce2"), ocean: kt("knowledge.auto.44467431f287c616"), sunset: kt("knowledge.auto.67995f590a93c211"), mono: kt("knowledge.auto.574ce385b86dddcc") } as const)[item]}</option>)}</Select></label>
      <label>{kt("knowledge.auto.faa2f2ed67357847")}<Select aria-label={kt("knowledge.auto.4ce86e8092d6d043")} value={layout} onChange={event => applyLayout(event.target.value as FlowchartLayout)}>{flowchartLayouts.map(item => <option key={item} value={item}>{({ free: kt("knowledge.auto.d1047eed5dd5db0d"), horizontal: kt("knowledge.auto.d95352f4e044ac51"), vertical: kt("knowledge.auto.8d48cd5dd4c3acdc") } as const)[item]}</option>)}</Select></label>
      <label><LayoutTemplate size={15} />{kt("knowledge.auto.62b95daecb7f81da")}<Select aria-label={kt("knowledge.auto.1ef5f201abd587a7")} defaultValue="" onChange={event => { applyTemplate(event.target.value); event.target.value = ""; }}><option value="" disabled>{kt("knowledge.auto.a3623cdcb7e18390")}</option><option value="approval">{kt("knowledge.auto.02e1bbea588248cb")}</option><option value="incident">{kt("knowledge.auto.0310c23f3fbae455")}</option><option value="data_pipeline">{kt("knowledge.auto.ccb8f0e8b6bd92a9")}</option><option value="customer_service">{kt("knowledge.auto.35de968ae2fdc71f")}</option></Select></label>
      <span className="diagram-style-tools" aria-label={kt("knowledge.auto.bd4825d7d6ce923d")}>
        <button type="button" disabled={!selectedNodeID} aria-label={kt("knowledge.auto.3b3faff736f848df")} onClick={() => applySelectedStyle({ font_weight: "bold" })}><strong>B</strong></button>
        {[flowThemes[theme].fill, flowThemes[theme].text].map((item, index) => <button type="button" key={item} disabled={!selectedNodeID} className="diagram-color-swatch" style={{ background: item }} aria-label={index === 0 ? kt("knowledge.auto.8482ed6c4fd90539") : kt("knowledge.auto.da7a563d4a6be766")} onClick={() => applySelectedStyle(index === 0 ? { background_color: item } : { color: item })} />)}
      </span>
      <Button aria-label={kt("knowledge.auto.49ac7e4884ffcaa6")} onClick={() => importInput.current?.click()}><Upload size={15} />{kt("knowledge.auto.576d81bb0631b165")}</Button>
      <span className="diagram-toolbar-hint"><Boxes size={14} />{kt("knowledge.auto.b7241e9505c000a5")}</span>
      <input ref={importInput} hidden type="file" accept="application/json,.json" onChange={event => importJSON(event.target.files?.[0])} />
    </div>}
    <div ref={host} className="native-flowchart-host" data-plain-text={diagramPlainText(content.current)} />
  </div>;
}
