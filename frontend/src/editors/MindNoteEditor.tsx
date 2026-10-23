import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CalendarDays, Check, ChevronDown, ChevronRight, Circle, Download, FileJson, FileText, Focus, IndentDecrease, IndentIncrease, ListPlus, Plus, Tags, Trash2, X } from "lucide-react";
import { Button, Select } from "../components.tsx";
import { canonicalMindNoteContent, createMindNoteNode, mindNoteToDocumentContent, parseMindNoteContent } from "../mindNoteContent.ts";
import type { MindNoteContent, MindNoteNode } from "../mindNoteContent.ts";
import { safeDocumentFilename } from "./documentTransfer.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

type NodeLocation = { node: MindNoteNode; index: number; siblings: MindNoteNode[]; parentID: string };

function findLocation(nodes: MindNoteNode[], id: string, parentID = ""): NodeLocation | null {
  for (let index = 0; index < nodes.length; index++) {
    if (nodes[index].id === id) return { node: nodes[index], index, siblings: nodes, parentID };
    const nested = findLocation(nodes[index].children, id, nodes[index].id);
    if (nested) return nested;
  }
  return null;
}

function findPath(nodes: MindNoteNode[], id: string, path: MindNoteNode[] = []): MindNoteNode[] {
  for (const node of nodes) {
    if (node.id === id) return [...path, node];
    const nested = findPath(node.children, id, [...path, node]);
    if (nested.length) return nested;
  }
  return [];
}

function updateNode(nodes: MindNoteNode[], id: string, update: (node: MindNoteNode) => MindNoteNode): MindNoteNode[] {
  return nodes.map(node => node.id === id ? update(node) : { ...node, children: updateNode(node.children, id, update) });
}

function removeNode(nodes: MindNoteNode[], id: string): { nodes: MindNoteNode[]; removed?: MindNoteNode } {
  let removed: MindNoteNode | undefined;
  const next: MindNoteNode[] = [];
  for (const node of nodes) {
    if (node.id === id) { removed = node; continue; }
    const nested = removeNode(node.children, id);
    if (!removed && nested.removed) removed = nested.removed;
    next.push(nested.removed ? { ...node, children: nested.nodes } : node);
  }
  return { nodes: next, removed };
}

function insertAfter(nodes: MindNoteNode[], targetID: string, node: MindNoteNode): MindNoteNode[] {
  const result: MindNoteNode[] = [];
  for (const item of nodes) {
    result.push({ ...item, children: insertAfter(item.children, targetID, node) });
    if (item.id === targetID) result.push(node);
  }
  return result;
}

function nodeCounts(nodes: MindNoteNode[]) {
  let total = 0, completed = 0;
  const visit = (items: MindNoteNode[]) => items.forEach(node => { total += 1; if (node.completed) completed += 1; visit(node.children); });
  visit(nodes);
  return { total, completed };
}

function mindNoteMarkdown(nodes: MindNoteNode[], depth = 0): string {
  return nodes.map(node => `${"  ".repeat(depth)}- [${node.completed ? "x" : " "}] ${node.text || "未命名条目"}${node.children.length ? `\n${mindNoteMarkdown(node.children, depth + 1)}` : ""}`).join("\n");
}

function downloadMindNote(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}

export function MindNoteEditor({ body, readOnly = false, documentTitle = "未命名思维笔记", initialBlockID, convertPage, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
  const parsed = useMemo(() => parseMindNoteContent(body), [body]);
  const [content, setContent] = useState(parsed);
  const contentRef = useRef(content);
  const [focusedID, setFocusedID] = useState("");
  const [metadataID, setMetadataID] = useState("");
  const [converting, setConverting] = useState(false);
  const inputRefs = useRef(new Map<string, HTMLInputElement>());

  useEffect(() => {
    contentRef.current = parsed;
    setContent(parsed);
    setFocusedID(current => current && findLocation(parsed.nodes, current) ? current : "");
    setMetadataID(current => current && findLocation(parsed.nodes, current) ? current : "");
  }, [parsed]);

  useEffect(() => {
    if (!initialBlockID || !findLocation(contentRef.current.nodes, initialBlockID)) return;
    setFocusedID(initialBlockID);
    window.setTimeout(() => {
      const input = inputRefs.current.get(initialBlockID);
      input?.scrollIntoView({ block: "center" });
      input?.focus({ preventScroll: true });
    });
  }, [initialBlockID]);

  const apply = (next: MindNoteContent, persist = !readOnly) => {
    contentRef.current = next;
    setContent(next);
    if (persist) onChange(canonicalMindNoteContent(next));
  };
  const focusInput = (id: string) => window.setTimeout(() => inputRefs.current.get(id)?.focus());
  const changeNode = (id: string, update: (node: MindNoteNode) => MindNoteNode, persist = !readOnly) => apply({ ...contentRef.current, nodes: updateNode(contentRef.current.nodes, id, update) }, persist);
  const addRoot = () => {
    const node = createMindNoteNode();
    apply({ ...contentRef.current, nodes: [...contentRef.current.nodes, node] });
    focusInput(node.id);
  };
  const addChild = (id: string) => {
    const child = createMindNoteNode();
    changeNode(id, node => ({ ...node, collapsed: false, children: [...node.children, child] }));
    focusInput(child.id);
  };
  const addSibling = (id: string) => {
    const node = createMindNoteNode("");
    apply({ ...contentRef.current, nodes: insertAfter(contentRef.current.nodes, id, node) });
    focusInput(node.id);
  };
  const deleteNode = (id: string) => {
    const next = removeNode(contentRef.current.nodes, id).nodes;
    const nodes = next.length ? next : [createMindNoteNode("")];
    apply({ ...contentRef.current, nodes });
    if (focusedID === id) setFocusedID("");
    if (metadataID === id) setMetadataID("");
  };
  const indentNode = (id: string) => {
    const location = findLocation(contentRef.current.nodes, id);
    if (!location || location.index === 0) return;
    const previous = location.siblings[location.index - 1];
    const removed = removeNode(contentRef.current.nodes, id);
    if (!removed.removed) return;
    apply({ ...contentRef.current, nodes: updateNode(removed.nodes, previous.id, node => ({ ...node, collapsed: false, children: [...node.children, removed.removed!] })) });
    focusInput(id);
  };
  const outdentNode = (id: string) => {
    const location = findLocation(contentRef.current.nodes, id);
    if (!location?.parentID) return;
    const removed = removeNode(contentRef.current.nodes, id);
    if (!removed.removed) return;
    apply({ ...contentRef.current, nodes: insertAfter(removed.nodes, location.parentID, removed.removed) });
    focusInput(id);
  };
  const handleKey = (event: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (readOnly) return;
    if (event.key === "Enter") { event.preventDefault(); addSibling(id); }
    else if (event.key === "Tab") { event.preventDefault(); if (event.shiftKey) outdentNode(id); else indentNode(id); }
    else if (event.key === "Backspace" && !event.currentTarget.value && !findLocation(contentRef.current.nodes, id)?.node.children.length) { event.preventDefault(); deleteNode(id); }
  };
  const convertToDocument = async () => {
    if (!convertPage || converting) return;
    setConverting(true);
    try {
      if (!authorizeContentAction) throw Error("当前页面禁止创建副本。");
      await authorizeContentAction("duplicate");
      await convertPage("document", `${documentTitle}（文档）`, mindNoteToDocumentContent(contentRef.current));
    }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "转换文档失败"); }
    finally { setConverting(false); }
  };
  const exportFile = async (format: "json" | "markdown") => {
    try {
      if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
      await authorizeContentAction("export");
      if (format === "json") downloadMindNote(canonicalMindNoteContent(contentRef.current), safeDocumentFilename(documentTitle, "json"), "application/json");
      else downloadMindNote(mindNoteMarkdown(contentRef.current.nodes), safeDocumentFilename(documentTitle, "md"), "text/markdown;charset=utf-8");
      onActionFeedback?.(`已导出 ${format === "json" ? "JSON" : "Markdown"}。`);
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "思维笔记导出失败"); }
  };

  const focusedPath = focusedID ? findPath(content.nodes, focusedID) : [];
  const visibleNodes = focusedPath.length ? [focusedPath[focusedPath.length - 1]] : content.nodes;
  const counts = nodeCounts(content.nodes);

  const renderNodes = (nodes: MindNoteNode[], depth = 0): React.ReactNode => nodes.map(node => {
    const location = findLocation(content.nodes, node.id)!;
    const canIndent = location.index > 0, canOutdent = Boolean(location.parentID);
    return <div className="mind-note-branch" key={node.id}>
      <div className={`mind-note-row${node.completed ? " is-completed" : ""}${focusedID === node.id ? " is-focus-root" : ""}`} data-priority={node.priority || "none"} style={{ "--mind-note-depth": depth } as React.CSSProperties}>
        {node.children.length ? <button type="button" className="mind-note-collapse" aria-label={node.collapsed ? "展开子条目" : "折叠子条目"} aria-expanded={!node.collapsed} onClick={() => changeNode(node.id, item => ({ ...item, collapsed: !item.collapsed }), !readOnly)}>{node.collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}</button> : <span className="mind-note-collapse-spacer" />}
        <button type="button" className="mind-note-complete" aria-label={node.completed ? "标记为未完成" : "标记为完成"} aria-pressed={node.completed} disabled={readOnly} onClick={() => changeNode(node.id, item => ({ ...item, completed: !item.completed }))}>{node.completed ? <Check size={14} /> : <Circle size={14} />}</button>
        <input ref={element => { if (element) inputRefs.current.set(node.id, element); else inputRefs.current.delete(node.id); }} aria-label="思维笔记条目" value={node.text} maxLength={4096} readOnly={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, text: event.currentTarget.value }))} onKeyDown={event => handleKey(event, node.id)} />
        <div className="mind-note-row-actions">
          <button type="button" title="聚焦此条目" aria-label="聚焦此条目" onClick={() => setFocusedID(node.id)}><Focus size={14} /></button>
          <button type="button" title="条目属性" aria-label="条目属性" aria-pressed={metadataID === node.id} onClick={() => setMetadataID(current => current === node.id ? "" : node.id)}><Tags size={14} /></button>
          {!readOnly && <><button type="button" title="添加子条目" aria-label="添加子条目" onClick={() => addChild(node.id)}><ListPlus size={14} /></button><button type="button" title="增加缩进" aria-label="增加缩进" disabled={!canIndent} onClick={() => indentNode(node.id)}><IndentIncrease size={14} /></button><button type="button" title="减少缩进" aria-label="减少缩进" disabled={!canOutdent} onClick={() => outdentNode(node.id)}><IndentDecrease size={14} /></button><button type="button" title="删除条目" aria-label="删除条目" onClick={() => deleteNode(node.id)}><Trash2 size={14} /></button></>}
        </div>
      </div>
      {metadataID === node.id && <div className="mind-note-metadata">
        <label>优先级<Select value={node.priority || "none"} disabled={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, priority: event.target.value as NonNullable<MindNoteNode["priority"]> }))}><option value="none">无</option><option value="low">低</option><option value="medium">中</option><option value="high">高</option><option value="urgent">紧急</option></Select></label>
        <label><CalendarDays size={13} />截止日期<input type="date" value={node.due_date || ""} disabled={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, due_date: event.target.value }))} /></label>
        <label className="is-wide">标签<input value={(node.tags || []).join(", ")} disabled={readOnly} placeholder="产品, 发布" onChange={event => changeNode(node.id, item => ({ ...item, tags: [...new Set(event.target.value.split(/[,，]/).map(tag => Array.from(tag.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) }))} /></label>
        <label className="is-wide">备注<textarea rows={2} maxLength={4096} value={node.note || ""} disabled={readOnly} placeholder="补充背景、判断或下一步" onChange={event => changeNode(node.id, item => ({ ...item, note: event.target.value }))} /></label>
      </div>}
      {!node.collapsed && node.children.length > 0 && <div className="mind-note-children">{renderNodes(node.children, depth + 1)}</div>}
    </div>;
  });

  return <div className="knowledge-open-editor knowledge-mind-note-editor">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button title="导出 Markdown" onClick={() => void exportFile("markdown")}><Download size={15} />Markdown</Button>
      <Button title="导出 canonical JSON" onClick={() => void exportFile("json")}><FileJson size={15} />JSON</Button>
    </PageActionPortal>}
    <header className="mind-note-toolbar">
      <div><strong>思维笔记</strong><span>{counts.completed}/{counts.total} 已完成</span></div>
      <div>{!readOnly && <Button title="添加顶层条目" onClick={addRoot}><Plus size={15} />顶层条目</Button>}{convertPage && authorizeContentAction && !readOnly && <Button title="转换为新文档" disabled={converting} onClick={() => void convertToDocument()}><FileText size={15} />{converting ? "转换中…" : "转为文档"}</Button>}</div>
    </header>
    {focusedPath.length > 0 && <nav className="mind-note-focus-path" aria-label="聚焦路径"><button type="button" onClick={() => setFocusedID("")}>全部条目</button>{focusedPath.map((node, index) => <span key={node.id}><ChevronRight size={13} />{index === focusedPath.length - 1 ? <strong>{node.text || "未命名条目"}</strong> : <button type="button" onClick={() => setFocusedID(node.id)}>{node.text || "未命名条目"}</button>}</span>)}<button type="button" className="mind-note-exit-focus" aria-label="退出聚焦" title="退出聚焦" onClick={() => setFocusedID("")}><X size={14} /></button></nav>}
    <section className="mind-note-outline" aria-label="思维笔记大纲">{renderNodes(visibleNodes)}</section>
    {!readOnly && <footer><span>Enter 新增同级 · Tab 缩进 · Shift+Tab 减少缩进</span></footer>}
  </div>;
}

export default MindNoteEditor;

