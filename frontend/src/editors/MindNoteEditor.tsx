import { kt, ktf } from "../i18n/runtime.ts";
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
  return nodes.map(node => `${"  ".repeat(depth)}- [${node.completed ? "x" : " "}] ${node.text || kt("knowledge.auto.d03438b702b564f3")}${node.children.length ? `\n${mindNoteMarkdown(node.children, depth + 1)}` : ""}`).join("\n");
}

function downloadMindNote(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}

export function MindNoteEditor({ body, readOnly = false, documentTitle = kt("knowledge.auto.24f374b540a88ba4"), initialBlockID, convertPage, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
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
      if (!authorizeContentAction) throw Error(kt("knowledge.auto.c79fd658db132faf"));
      await authorizeContentAction("duplicate");
      await convertPage("document", ktf("knowledge.auto.7fc573f8fefc28a1", { value0: documentTitle }), mindNoteToDocumentContent(contentRef.current));
    }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.83982a5d62de3c93")); }
    finally { setConverting(false); }
  };
  const exportFile = async (format: "json" | "markdown") => {
    try {
      if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
      await authorizeContentAction("export");
      if (format === "json") downloadMindNote(canonicalMindNoteContent(contentRef.current), safeDocumentFilename(documentTitle, "json"), "application/json");
      else downloadMindNote(mindNoteMarkdown(contentRef.current.nodes), safeDocumentFilename(documentTitle, "md"), "text/markdown;charset=utf-8");
      onActionFeedback?.(ktf("knowledge.auto.5f6eb852de0a1889", { value0: format === "json" ? "JSON" : "Markdown" }));
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.d0282f346b1d46ee")); }
  };

  const focusedPath = focusedID ? findPath(content.nodes, focusedID) : [];
  const visibleNodes = focusedPath.length ? [focusedPath[focusedPath.length - 1]] : content.nodes;
  const counts = nodeCounts(content.nodes);

  const renderNodes = (nodes: MindNoteNode[], depth = 0): React.ReactNode => nodes.map(node => {
    const location = findLocation(content.nodes, node.id)!;
    const canIndent = location.index > 0, canOutdent = Boolean(location.parentID);
    return <div className="mind-note-branch" key={node.id}>
      <div className={`mind-note-row${node.completed ? " is-completed" : ""}${focusedID === node.id ? " is-focus-root" : ""}`} data-priority={node.priority || "none"} style={{ "--mind-note-depth": depth } as React.CSSProperties}>
        {node.children.length ? <button type="button" className="mind-note-collapse" aria-label={node.collapsed ? kt("knowledge.auto.cbeaf2b1399d8de9") : kt("knowledge.auto.bf63ac26085bbacb")} aria-expanded={!node.collapsed} onClick={() => changeNode(node.id, item => ({ ...item, collapsed: !item.collapsed }), !readOnly)}>{node.collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}</button> : <span className="mind-note-collapse-spacer" />}
        <button type="button" className="mind-note-complete" aria-label={node.completed ? kt("knowledge.auto.554b08fed5b36486") : kt("knowledge.auto.d656b891df4d1bee")} aria-pressed={node.completed} disabled={readOnly} onClick={() => changeNode(node.id, item => ({ ...item, completed: !item.completed }))}>{node.completed ? <Check size={14} /> : <Circle size={14} />}</button>
        <input ref={element => { if (element) inputRefs.current.set(node.id, element); else inputRefs.current.delete(node.id); }} aria-label={kt("knowledge.auto.ff98a7eab27cb136")} value={node.text} maxLength={4096} readOnly={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, text: event.currentTarget.value }))} onKeyDown={event => handleKey(event, node.id)} />
        <div className="mind-note-row-actions">
          <button type="button" title={kt("knowledge.auto.342d82997b748cd3")} aria-label={kt("knowledge.auto.342d82997b748cd3")} onClick={() => setFocusedID(node.id)}><Focus size={14} /></button>
          <button type="button" title={kt("knowledge.auto.5cdb885d907b5172")} aria-label={kt("knowledge.auto.5cdb885d907b5172")} aria-pressed={metadataID === node.id} onClick={() => setMetadataID(current => current === node.id ? "" : node.id)}><Tags size={14} /></button>
          {!readOnly && <><button type="button" title={kt("knowledge.auto.677ef7a715febc8d")} aria-label={kt("knowledge.auto.677ef7a715febc8d")} onClick={() => addChild(node.id)}><ListPlus size={14} /></button><button type="button" title={kt("knowledge.auto.cfd42c031e620536")} aria-label={kt("knowledge.auto.cfd42c031e620536")} disabled={!canIndent} onClick={() => indentNode(node.id)}><IndentIncrease size={14} /></button><button type="button" title={kt("knowledge.auto.efd955b1ac6f3036")} aria-label={kt("knowledge.auto.efd955b1ac6f3036")} disabled={!canOutdent} onClick={() => outdentNode(node.id)}><IndentDecrease size={14} /></button><button type="button" title={kt("knowledge.auto.81385c38c94481fd")} aria-label={kt("knowledge.auto.81385c38c94481fd")} onClick={() => deleteNode(node.id)}><Trash2 size={14} /></button></>}
        </div>
      </div>
      {metadataID === node.id && <div className="mind-note-metadata">
        <label>{kt("knowledge.auto.565d64601d4d174f")}<Select value={node.priority || "none"} disabled={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, priority: event.target.value as NonNullable<MindNoteNode["priority"]> }))}><option value="none">{kt("knowledge.auto.484d55613910eb8c")}</option><option value="low">{kt("knowledge.auto.aa9e366f68d3d097")}</option><option value="medium">{kt("knowledge.auto.a567bdaa11367f26")}</option><option value="high">{kt("knowledge.auto.b1c27820fec23edb")}</option><option value="urgent">{kt("knowledge.auto.0efa477b24b1f3c7")}</option></Select></label>
        <label><CalendarDays size={13} />{kt("knowledge.auto.31802424217f51b0")}<input type="date" value={node.due_date || ""} disabled={readOnly} onChange={event => changeNode(node.id, item => ({ ...item, due_date: event.target.value }))} /></label>
        <label className="is-wide">{kt("knowledge.auto.1d0fd5f9336d9103")}<input value={(node.tags || []).join(", ")} disabled={readOnly} placeholder={kt("knowledge.auto.02d3a3e342d411f2")} onChange={event => changeNode(node.id, item => ({ ...item, tags: [...new Set(event.target.value.split(/[,，]/).map(tag => Array.from(tag.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) }))} /></label>
        <label className="is-wide">{kt("knowledge.auto.daede9881787abe7")}<textarea rows={2} maxLength={4096} value={node.note || ""} disabled={readOnly} placeholder={kt("knowledge.auto.903e3e8fa4ece979")} onChange={event => changeNode(node.id, item => ({ ...item, note: event.target.value }))} /></label>
      </div>}
      {!node.collapsed && node.children.length > 0 && <div className="mind-note-children">{renderNodes(node.children, depth + 1)}</div>}
    </div>;
  });

  return <div className="knowledge-open-editor knowledge-mind-note-editor">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button title={kt("knowledge.auto.ac8b027cc1e3a493")} onClick={() => void exportFile("markdown")}><Download size={15} />Markdown</Button>
      <Button title={kt("knowledge.auto.28ff768a104f56a9")} onClick={() => void exportFile("json")}><FileJson size={15} />JSON</Button>
    </PageActionPortal>}
    <header className="mind-note-toolbar">
      <div><strong>{kt("knowledge.auto.13517c3204f58770")}</strong><span>{counts.completed}/{counts.total} {kt("knowledge.auto.f28461bb49c85647")}</span></div>
      <div>{!readOnly && <Button title={kt("knowledge.auto.3e50f365e3f356e1")} onClick={addRoot}><Plus size={15} />{kt("knowledge.auto.e9a2cb73585da4b7")}</Button>}{convertPage && authorizeContentAction && !readOnly && <Button title={kt("knowledge.auto.467d5427bb9d2392")} disabled={converting} onClick={() => void convertToDocument()}><FileText size={15} />{converting ? kt("knowledge.auto.7b48fcb4f51cd8c3") : kt("knowledge.auto.c19a7169123aaead")}</Button>}</div>
    </header>
    {focusedPath.length > 0 && <nav className="mind-note-focus-path" aria-label={kt("knowledge.auto.d0dfdce5ec834437")}><button type="button" onClick={() => setFocusedID("")}>{kt("knowledge.auto.80a851b1df45dc50")}</button>{focusedPath.map((node, index) => <span key={node.id}><ChevronRight size={13} />{index === focusedPath.length - 1 ? <strong>{node.text || kt("knowledge.auto.d03438b702b564f3")}</strong> : <button type="button" onClick={() => setFocusedID(node.id)}>{node.text || kt("knowledge.auto.d03438b702b564f3")}</button>}</span>)}<button type="button" className="mind-note-exit-focus" aria-label={kt("knowledge.auto.9d7acd0084f48f84")} title={kt("knowledge.auto.9d7acd0084f48f84")} onClick={() => setFocusedID("")}><X size={14} /></button></nav>}
    <section className="mind-note-outline" aria-label={kt("knowledge.auto.797ddc596809293c")}>{renderNodes(visibleNodes)}</section>
    {!readOnly && <footer><span>{kt("knowledge.auto.63df122341ac522f")}</span></footer>}
  </div>;
}

export default MindNoteEditor;

