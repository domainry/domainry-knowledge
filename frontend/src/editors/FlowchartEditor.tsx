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
    label: "基础流程",
    nodes: [
      { type: "start", label: "开始", description: "流程入口", icon: CirclePlay },
      { type: "end", label: "结束", description: "流程出口", icon: CircleStop },
      { type: "process", label: "处理步骤", description: "通用操作", icon: Square },
      { type: "decision", label: "判断", description: "条件分支", icon: Diamond },
      { type: "subprocess", label: "子流程", description: "可复用流程", icon: PanelTop },
    ],
  },
  {
    label: "任务与控制",
    nodes: [
      { type: "user_task", label: "人工任务", description: "人员处理", icon: UserRound },
      { type: "service_task", label: "自动任务", description: "系统执行", icon: Cog },
      { type: "manual_input", label: "手工输入", description: "人工录入", icon: Keyboard },
      { type: "preparation", label: "准备", description: "初始化条件", icon: Hexagon },
      { type: "delay", label: "延迟", description: "等待或超时", icon: Timer },
    ],
  },
  {
    label: "数据与辅助",
    nodes: [
      { type: "data", label: "数据", description: "输入或输出", icon: Braces },
      { type: "database", label: "数据库", description: "持久化存储", icon: Database },
      { type: "document", label: "文档", description: "文档产物", icon: FileText },
      { type: "connector", label: "连接点", description: "跨区域连接", icon: CircleDot },
      { type: "annotation", label: "注释", description: "补充说明", icon: StickyNote },
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

export function FlowchartEditor({ body, readOnly = false, documentTitle = "流程图", initialBlockID, pageActionHost, authorizeContentAction, onChange, onPresence, onCommentAnchor, onActionFeedback }: KnowledgeEditorProps) {
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
      const quote = textValue(data.text) || (data.sourceNodeId ? "流程连线" : semanticType ? `${flowchartNodeLabels.get(semanticType) || "流程"}节点` : "流程节点");
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
    onActionFeedback?.(`新建连线将使用${({ polyline: "折线", line: "直线", bezier: "曲线" } as const)[nextType]}。`);
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
    onActionFeedback?.("已应用流程图模板。");
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
      onActionFeedback?.("已导入流程图 JSON。");
    } catch (error) { onActionFeedback?.(error instanceof Error ? error.message : "导入失败。"); }
    if (importInput.current) importInput.current.value = "";
  };

  const exportJSON = async () => {
    if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
    await authorizeContentAction("export");
    downloadDiagramBlob(new Blob([canonicalFlowchartContent(content.current)], { type: "application/json" }), `${documentTitle || "流程图"}.json`);
  };
  const exportPNG = async () => {
    if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
    await authorizeContentAction("export");
    const lf = logic.current as (LogicFlow & { getSnapshotBlob?(background?: string, type?: string, options?: Record<string, unknown>): Promise<{ data: Blob | string }> }) | null;
    const result = await lf?.getSnapshotBlob?.(flowThemes[content.current.theme].background, "png", { padding: 48 });
    if (result?.data instanceof Blob) downloadDiagramBlob(result.data, `${documentTitle || "流程图"}.png`);
    else onActionFeedback?.("当前浏览器无法导出流程图图片。");
  };

  return <div className="knowledge-open-editor is-logicflow">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button onClick={() => void exportJSON().catch(error => onActionFeedback?.(error instanceof Error ? error.message : "导出失败。"))}><FileJson size={15} />JSON</Button>
      <Button onClick={() => void exportPNG().catch(error => onActionFeedback?.(error instanceof Error ? error.message : "导出失败。"))}><Image size={15} />PNG</Button>
    </PageActionPortal>}
    {!readOnly && <div className="diagram-editor-toolbar" aria-label="流程图工具栏">
      <div className="diagram-insert-tools">
        <details ref={insertMenu} className="flowchart-node-menu">
          <summary><Plus size={15} />节点</summary>
          <div className="flowchart-node-menu-panel" role="menu" aria-label="插入流程节点">
            <header><Workflow size={17} /><span><strong>插入流程节点</strong><small>按语义选择，节点可继续拖动和连线</small></span></header>
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
        <Button onClick={() => add("process", "处理步骤")}><Square size={15} />步骤</Button>
        <Button onClick={() => add("decision", "判断条件")}><GitBranch size={15} />判断</Button>
      </div>
      <label><Route size={15} />连线<Select aria-label="新建连线类型" value={edgeType} onChange={event => applyEdgeType(event.target.value as FlowchartEdgeType)}>{flowchartEdgeTypes.map(item => <option key={item} value={item}>{({ polyline: "折线", line: "直线", bezier: "曲线" } as const)[item]}</option>)}</Select></label>
      <label><Palette size={15} />主题<Select aria-label="流程图主题" value={theme} onChange={event => applyTheme(event.target.value as DiagramTheme)}>{diagramThemes.map(item => <option key={item} value={item}>{({ emerald: "翡翠", ocean: "海洋", sunset: "日落", mono: "中性" } as const)[item]}</option>)}</Select></label>
      <label>布局<Select aria-label="流程图布局" value={layout} onChange={event => applyLayout(event.target.value as FlowchartLayout)}>{flowchartLayouts.map(item => <option key={item} value={item}>{({ free: "自由", horizontal: "横向", vertical: "纵向" } as const)[item]}</option>)}</Select></label>
      <label><LayoutTemplate size={15} />模板<Select aria-label="流程图模板" defaultValue="" onChange={event => { applyTemplate(event.target.value); event.target.value = ""; }}><option value="" disabled>选择模板</option><option value="approval">审批流程</option><option value="incident">故障响应</option><option value="data_pipeline">数据管道</option><option value="customer_service">客服工单</option></Select></label>
      <span className="diagram-style-tools" aria-label="节点样式">
        <button type="button" disabled={!selectedNodeID} aria-label="节点加粗" onClick={() => applySelectedStyle({ font_weight: "bold" })}><strong>B</strong></button>
        {[flowThemes[theme].fill, flowThemes[theme].text].map((item, index) => <button type="button" key={item} disabled={!selectedNodeID} className="diagram-color-swatch" style={{ background: item }} aria-label={index === 0 ? "节点背景色" : "节点文字色"} onClick={() => applySelectedStyle(index === 0 ? { background_color: item } : { color: item })} />)}
      </span>
      <Button aria-label="导入流程图 JSON" onClick={() => importInput.current?.click()}><Upload size={15} />导入</Button>
      <span className="diagram-toolbar-hint"><Boxes size={14} />15 种节点 · 3 种连线；拖动锚点连接，双击文字编辑</span>
      <input ref={importInput} hidden type="file" accept="application/json,.json" onChange={event => importJSON(event.target.files?.[0])} />
    </div>}
    <div ref={host} className="native-flowchart-host" data-plain-text={diagramPlainText(content.current)} />
  </div>;
}
