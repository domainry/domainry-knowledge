import { useEffect, useRef, useState } from "react";
import MindElixir, { type MindElixirData, type NodeObj, type Theme } from "mind-elixir";
import { zh_CN } from "mind-elixir/i18n";
import "mind-elixir/style.css";
import { Download, FileJson, Image, LayoutTemplate, Link, Palette, StickyNote, Tags, Upload } from "lucide-react";
import { Button, Select } from "../components.tsx";
import { canonicalMindMapContent, decodeMindMapContent, diagramPlainText, diagramThemes, downloadDiagramBlob, mindMapLayouts, mindMapTemplates, parseMindMapContent, type DiagramTheme, type MindMapContent, type MindMapLayout, type MindMapNode } from "../diagramContent.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

const mindMapThemeColors: Record<DiagramTheme, { root: string; rootText: string; node: string; text: string; accent: string; palette: string[] }> = {
  emerald: { root: "#00856a", rootText: "#ffffff", node: "#e8f5f0", text: "#17332b", accent: "#00856a", palette: ["#00856a", "#2b8f75", "#5aa58f", "#83bbaa", "#a8d0c3", "#d4e7df"] },
  ocean: { root: "#2563eb", rootText: "#ffffff", node: "#eaf2ff", text: "#17324d", accent: "#2563eb", palette: ["#2563eb", "#0ea5e9", "#0891b2", "#14b8a6", "#67e8f9", "#bfdbfe"] },
  sunset: { root: "#c2410c", rootText: "#ffffff", node: "#fff7ed", text: "#7c2d12", accent: "#ea580c", palette: ["#c2410c", "#ea580c", "#f59e0b", "#eab308", "#fb923c", "#fed7aa"] },
  mono: { root: "#334155", rootText: "#ffffff", node: "#f1f5f9", text: "#1e293b", accent: "#475569", palette: ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"] },
};

function mindElixirTheme(theme: DiagramTheme): Theme {
  const selected = mindMapThemeColors[theme];
  return {
    ...MindElixir.THEME,
    name: `Knowledge ${theme}`,
    palette: selected.palette,
    cssVar: {
      ...MindElixir.THEME.cssVar,
      "--accent-color": selected.accent,
      "--root-bgcolor": selected.root,
      "--root-color": selected.rootText,
      "--selected": `${selected.accent}22`,
      "--panel-bgcolor": "#ffffff",
      "--panel-border-color": "#d9e4df",
    },
  };
}

const layoutDirection: Record<MindMapLayout, 0 | 1 | 2 | 3> = { left: MindElixir.LEFT, right: MindElixir.RIGHT, side: MindElixir.SIDE, down: MindElixir.DOWN };

function runtimeNode(node: MindMapNode): NodeObj {
  return {
    id: node.id,
    topic: node.text,
    expanded: node.expanded,
    direction: node.direction === "left" ? 0 : node.direction === "right" ? 1 : undefined,
    style: { color: node.style.color, background: node.style.background_color, fontWeight: node.style.font_weight },
    ...(node.tags?.length ? { tags: node.tags } : {}),
    ...(node.note ? { note: node.note } : {}),
    ...(node.link ? { hyperLink: node.link } : {}),
    children: node.children.map(runtimeNode),
  };
}

function runtimeMindMap(content: MindMapContent): MindElixirData {
  return {
    nodeData: runtimeNode(content.root),
    direction: layoutDirection[content.layout],
    compact: content.compact,
    arrows: content.relations.map(relation => ({ id: relation.id, from: relation.from, to: relation.to, label: relation.label, bidirectional: relation.bidirectional, style: { stroke: relation.color, strokeWidth: relation.width, strokeDasharray: relation.dashed ? "6 4" : "" } })),
  };
}

function canonicalNode(node: NodeObj): MindMapNode {
  const style = node.style || {};
  return {
    id: node.id,
    text: node.topic || "",
    expanded: node.expanded !== false,
    direction: node.direction === 0 ? "left" : node.direction === 1 ? "right" : "auto",
    style: {
      color: typeof style.color === "string" ? style.color : "#17332b",
      background_color: typeof style.background === "string" ? style.background : "#e8f5f0",
      font_weight: style.fontWeight === "bold" ? "bold" : "normal",
    },
    ...(Array.isArray(node.tags) && node.tags.length ? { tags: node.tags.map(tag => typeof tag === "string" ? tag : tag.text).filter((tag): tag is string => Boolean(tag)) } : {}),
    ...(typeof node.note === "string" && node.note ? { note: node.note } : {}),
    ...(typeof node.hyperLink === "string" && node.hyperLink ? { link: node.hyperLink } : {}),
    children: (node.children || []).map(canonicalNode),
  };
}

function findMindMapNode(node: MindMapNode, id: string): MindMapNode | null {
  if (node.id === id) return node;
  for (const child of node.children) { const found = findMindMapNode(child, id); if (found) return found; }
  return null;
}

function updateMindMapNode(node: MindMapNode, id: string, patch: Partial<Pick<MindMapNode, "tags" | "note" | "link">>): MindMapNode {
  return node.id === id ? { ...node, ...patch } : { ...node, children: node.children.map(child => updateMindMapNode(child, id, patch)) };
}

function canonicalFromRuntime(data: MindElixirData, metadata: Pick<MindMapContent, "theme" | "layout" | "compact">): MindMapContent {
  return decodeMindMapContent(JSON.stringify({
    schema_version: 1,
    ...metadata,
    root: canonicalNode(data.nodeData),
    relations: (data.arrows || []).map(arrow => ({
      id: arrow.id,
      from: arrow.from,
      to: arrow.to,
      label: arrow.label || "",
      bidirectional: Boolean(arrow.bidirectional),
      color: typeof arrow.style?.stroke === "string" ? arrow.style.stroke : "#64748b",
      width: Math.min(12, Math.max(1, Number(arrow.style?.strokeWidth) || 2)),
      dashed: Boolean(arrow.style?.strokeDasharray),
    })),
  }));
}

function restyleMindMapNode(node: MindMapNode, theme: DiagramTheme, root = false): MindMapNode {
  const selected = mindMapThemeColors[theme];
  return {
    ...node,
    style: {
      color: root ? selected.rootText : selected.text,
      background_color: root ? selected.root : selected.node,
      font_weight: root ? "bold" : node.style.font_weight,
    },
    children: node.children.map(child => restyleMindMapNode(child, theme)),
  };
}

function restoreMindMapSelection(mind: MindElixir, nodeID: string) {
  if (!nodeID || !mind.getObjById(nodeID, mind.nodeData)) return false;
  try {
    mind.selectNode(mind.findEle(nodeID));
    return true;
  } catch {
    // A collapsed descendant still exists canonically but has no rendered
    // topic element. It must not leave an invisible actionable selection.
    return false;
  }
}

export function MindMapEditor({ body, readOnly = false, documentTitle = "思维导图", initialBlockID, pageActionHost, authorizeContentAction, onChange, onPresence, onCommentAnchor, onActionFeedback }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const instance = useRef<MindElixir | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const initialBody = useRef(body);
  const content = useRef(parseMindMapContent(body));
  const onChangeRef = useRef(onChange);
  const selectionCallbacksRef = useRef({ onPresence, onCommentAnchor });
  const [theme, setTheme] = useState(content.current.theme);
  const [layout, setLayout] = useState(content.current.layout);
  const [selectedID, setSelectedID] = useState("");
  const [metadataRevision, setMetadataRevision] = useState(0);
  onChangeRef.current = onChange;
  selectionCallbacksRef.current = { onPresence, onCommentAnchor };

  const commit = (next: MindMapContent) => {
    content.current = next;
    setTheme(next.theme);
    setLayout(next.layout);
    onChangeRef.current(canonicalMindMapContent(next));
  };

  useEffect(() => {
    if (!host.current) return;
    content.current = parseMindMapContent(initialBody.current);
    const mind = new MindElixir({
      el: host.current,
      direction: layoutDirection[content.current.layout],
      editable: !readOnly,
      contextMenu: readOnly ? false : { locale: zh_CN, focus: true, link: true },
      toolBar: !readOnly,
      keypress: !readOnly,
      overflowHidden: true,
      compact: content.current.compact,
      theme: mindElixirTheme(content.current.theme),
    });
    mind.init(runtimeMindMap(content.current));
    instance.current = mind;
    const sync = () => {
      if (readOnly) return;
      commit(canonicalFromRuntime(mind.getData(), content.current));
    };
    const select = (nodes: NodeObj[]) => {
      const current = mind.currentNodes.map(node => node.nodeObj);
      const selected = current.length > 0 ? current : nodes;
      const first = selected[0];
      setSelectedID(first?.id || "");
      selectionCallbacksRef.current.onPresence?.(first?.id, selected.length > 1 ? selected[selected.length - 1]?.id : undefined);
      selectionCallbacksRef.current.onCommentAnchor?.(first ? { nodeID: first.id, quote: (first.topic || "思维导图节点").trim() } : undefined);
    };
    const selectNew = (node: NodeObj) => select([node]);
    const clear = () => {
      const remaining = mind.currentNodes.map(node => node.nodeObj);
      if (remaining.length > 0) { select(remaining); return; }
      setSelectedID("");
      selectionCallbacksRef.current.onPresence?.();
      selectionCallbacksRef.current.onCommentAnchor?.();
    };
    // MindElixir delegates pointer handling to its custom elements. Keep the
    // Knowledge selection contract independent from that private event path so
    // node styling, comments and Awareness remain available after refreshes.
    const selectFromPointer = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("me-tpc") : null;
      if (!target || !host.current?.contains(target)) {
        clear();
        return;
      }
      // MindElixir prefixes the DOM data-nodeid with `me` (for example the
      // canonical `root` becomes `meroot`). Its custom element keeps the
      // original NodeObj, which is the authoritative bridge back to the
      // Knowledge-owned stable ID. The attribute fallback only covers a
      // future runtime that no longer exposes that expando property.
      const runtimeNode = (target as Element & { nodeObj?: NodeObj }).nodeObj;
      const domID = target.getAttribute("data-nodeid") || "";
      const canonicalID = domID.startsWith("me") ? domID.slice(2) : domID;
      const node = runtimeNode || (canonicalID ? mind.getObjById(canonicalID, mind.nodeData) : null);
      if (!node) return;
      setSelectedID(node.id);
      selectionCallbacksRef.current.onPresence?.(node.id);
      selectionCallbacksRef.current.onCommentAnchor?.({ nodeID: node.id, quote: (node.topic || "思维导图节点").trim() });
    };
    mind.bus.addListener("operation", sync);
    mind.bus.addListener("selectNodes", select);
    mind.bus.addListener("selectNewNode", selectNew);
    host.current.addEventListener("pointerdown", selectFromPointer, true);
    return () => {
      host.current?.removeEventListener("pointerdown", selectFromPointer, true);
      instance.current = null;
      mind.destroy();
    };
  }, [readOnly]);

  useEffect(() => {
    const mind = instance.current;
    if (!mind || !initialBlockID || !restoreMindMapSelection(mind, initialBlockID)) return;
    setSelectedID(initialBlockID);
    mind.findEle(initialBlockID)?.scrollIntoView({ block: "center", inline: "center" });
  }, [initialBlockID]);

  useEffect(() => {
    const mind = instance.current;
    if (!mind) return;
    let next: MindMapContent;
    try { next = decodeMindMapContent(body); } catch { return; }
    if (canonicalMindMapContent(next) === canonicalMindMapContent(content.current)) return;
    content.current = next;
    setTheme(next.theme);
    setLayout(next.layout);
    mind.changeTheme(mindElixirTheme(next.theme), false);
    mind.refresh(runtimeMindMap(next));
    mind.clearHistory?.();
    if (!restoreMindMapSelection(mind, selectedID)) setSelectedID("");
  }, [body, selectedID]);

  const applyTheme = (nextTheme: DiagramTheme) => {
    const mind = instance.current;
    if (!mind) return;
    const selected = mindMapThemeColors[nextTheme];
    const current = canonicalFromRuntime(mind.getData(), content.current);
    const next: MindMapContent = {
      ...current,
      theme: nextTheme,
      root: restyleMindMapNode(current.root, nextTheme, true),
      relations: current.relations.map(relation => ({ ...relation, color: selected.accent })),
    };
    mind.changeTheme(mindElixirTheme(nextTheme), false);
    mind.refresh(runtimeMindMap(next));
    restoreMindMapSelection(mind, selectedID);
    commit(next);
  };

  const applyLayout = (nextLayout: MindMapLayout) => {
    const mind = instance.current;
    if (!mind) return;
    ({ left: mind.initLeft, right: mind.initRight, side: mind.initSide, down: mind.initDown }[nextLayout]).call(mind);
    restoreMindMapSelection(mind, selectedID);
    commit(canonicalFromRuntime(mind.getData(), { ...content.current, layout: nextLayout }));
  };

  const applySelectedStyle = async (patch: Partial<MindMapNode["style"]>) => {
    const mind = instance.current;
    if (!mind || !selectedID) return;
    const current = mind.getObjById(selectedID, mind.nodeData);
    const target = mind.findEle(selectedID);
    if (!current || !target) return;
    await mind.reshapeNode(target, { style: { ...current.style, ...(patch.color ? { color: patch.color } : {}), ...(patch.background_color ? { background: patch.background_color } : {}), ...(patch.font_weight ? { fontWeight: patch.font_weight } : {}) } });
  };

  const applySelectedMetadata = (patch: Partial<Pick<MindMapNode, "tags" | "note" | "link">>) => {
    const mind = instance.current;
    if (!mind || !selectedID) return;
    try {
      const current = canonicalFromRuntime(mind.getData(), content.current);
      const next = { ...current, root: updateMindMapNode(current.root, selectedID, patch) };
      mind.refresh(runtimeMindMap(next));
      restoreMindMapSelection(mind, selectedID);
      commit(next);
      setMetadataRevision(value => value + 1);
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "节点属性无效。"); }
  };

  const applyTemplate = (key: string) => {
    const mind = instance.current;
    const template = mindMapTemplates[key];
    if (!mind || !template) return;
    const next = structuredClone(template);
    content.current = next;
    mind.changeTheme(mindElixirTheme(next.theme), false);
    mind.refresh(runtimeMindMap(next));
    mind.clearHistory?.();
    commit(next);
    onActionFeedback?.("已应用思维导图模板。");
  };

  const importJSON = async (file?: File) => {
    if (!file) return;
    try {
      const next = decodeMindMapContent(await file.text());
      content.current = next;
      instance.current?.changeTheme(mindElixirTheme(next.theme), false);
      instance.current?.refresh(runtimeMindMap(next));
      instance.current?.clearHistory?.();
      commit(next);
      onActionFeedback?.("已导入思维导图 JSON。");
    } catch (error) { onActionFeedback?.(error instanceof Error ? error.message : "导入失败。"); }
    if (importInput.current) importInput.current.value = "";
  };

  const exportJSON = async () => {
    if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
    await authorizeContentAction("export");
    downloadDiagramBlob(new Blob([canonicalMindMapContent(content.current)], { type: "application/json" }), `${documentTitle || "思维导图"}.json`);
  };
  const exportPNG = async () => {
    if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
    await authorizeContentAction("export");
    const blob = await instance.current?.exportPng(false);
    if (blob) downloadDiagramBlob(blob, `${documentTitle || "思维导图"}.png`);
    else onActionFeedback?.("当前浏览器无法导出思维导图图片。");
  };

  const selectedNode = selectedID ? findMindMapNode(content.current.root, selectedID) : null;

  return <div className="knowledge-open-editor is-mind-elixir">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button title="导出 canonical JSON" onClick={() => void exportJSON().catch(error => onActionFeedback?.(error instanceof Error ? error.message : "导出失败。"))}><FileJson size={15} />JSON</Button>
      <Button title="导出 PNG" onClick={() => void exportPNG().catch(error => onActionFeedback?.(error instanceof Error ? error.message : "导出失败。"))}><Image size={15} />PNG</Button>
    </PageActionPortal>}
    {!readOnly && <div className="diagram-editor-toolbar" aria-label="思维导图工具栏">
      <label><Palette size={15} />主题<Select aria-label="思维导图主题" value={theme} onChange={event => applyTheme(event.target.value as DiagramTheme)}>{diagramThemes.map(item => <option key={item} value={item}>{({ emerald: "翡翠", ocean: "海洋", sunset: "日落", mono: "中性" } as const)[item]}</option>)}</Select></label>
      <label>布局<Select aria-label="思维导图布局" value={layout} onChange={event => applyLayout(event.target.value as MindMapLayout)}>{mindMapLayouts.map(item => <option key={item} value={item}>{({ side: "双侧", left: "向左", right: "向右", down: "向下" } as const)[item]}</option>)}</Select></label>
      <label><LayoutTemplate size={15} />模板<Select aria-label="思维导图模板" defaultValue="" onChange={event => { applyTemplate(event.target.value); event.target.value = ""; }}><option value="" disabled>选择模板</option><option value="brainstorming">头脑风暴</option><option value="swot">SWOT 分析</option></Select></label>
      <span className="diagram-style-tools" aria-label="节点样式">
        <button type="button" disabled={!selectedID} aria-label="节点加粗" onClick={() => applySelectedStyle({ font_weight: "bold" })}><strong>B</strong></button>
        {[mindMapThemeColors[theme].node, mindMapThemeColors[theme].text].map((item, index) => <button type="button" key={item} disabled={!selectedID} className="diagram-color-swatch" style={{ background: item }} aria-label={index === 0 ? "节点背景色" : "节点文字色"} onClick={() => applySelectedStyle(index === 0 ? { background_color: item } : { color: item })} />)}
      </span>
      <Button title="导入 canonical JSON" aria-label="导入思维导图 JSON" onClick={() => importInput.current?.click()}><Upload size={15} />导入</Button>
      <span className="diagram-toolbar-hint"><Download size={14} />选择节点后可同步位置与调整样式；评论请切换到评论页签</span>
      <input ref={importInput} hidden type="file" accept="application/json,.json" onChange={event => importJSON(event.target.files?.[0])} />
    </div>}
    {!readOnly && selectedNode && <section className="mindmap-node-metadata" key={`${selectedNode.id}:${metadataRevision}`} aria-label="节点属性">
      <label><Tags size={14} /><span>标签</span><input defaultValue={(selectedNode.tags || []).join(", ")} placeholder="产品, 发布" onBlur={event => applySelectedMetadata({ tags: [...new Set(event.target.value.split(/[,，]/).map(tag => Array.from(tag.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) })} /></label>
      <label><StickyNote size={14} /><span>备注</span><input maxLength={1365} defaultValue={selectedNode.note || ""} placeholder="补充节点背景" onBlur={event => applySelectedMetadata({ note: event.target.value })} /></label>
      <label><Link size={14} /><span>链接</span><input type="url" maxLength={2048} defaultValue={selectedNode.link || ""} placeholder="https://example.com" onBlur={event => applySelectedMetadata({ link: event.target.value.trim() })} /></label>
    </section>}
    <div ref={host} className="native-mindmap-host" data-plain-text={diagramPlainText(content.current)} />
  </div>;
}
