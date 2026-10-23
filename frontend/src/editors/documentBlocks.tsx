import { BlockNoteSchema, createCodeBlockSpec, filterSuggestionItems, getDefaultSlashMenuItems, imageParse, insertOrUpdateBlockForSlashMenu } from "@blocknote/core";
import type { BlockNoteEditor } from "@blocknote/core";
import { SourceBlockWithPreviewExtension, SourceInlineContentWithPreviewExtension } from "@blocknote/core/extensions";
import { createReactBlockSpec, createReactInlineContentSpec, ResizableFileBlockWrapper, SourceBlockWithPreview, SourceInlineContentWithPreview, useResolveUrl } from "@blocknote/react";
import type { DefaultReactSuggestionItem, ReactCustomBlockRenderProps, ReactCustomInlineContentRenderProps } from "@blocknote/react";
import { ColumnBlock, ColumnListBlock, getMultiColumnSlashMenuItems } from "@blocknote/xl-multi-column";
import { Activity, AlertTriangle, AudioLines, Bell, BookOpen, Braces, CalendarDays, Check, CheckCircle2, ChevronRight, Circle, ClipboardList, ExternalLink, FileText, Flag, FunctionSquare, Globe2, Hash, Image as ImageIcon, Link2, ListChecks, ListTree, LoaderCircle, Maximize2, Paperclip, PlaySquare, Quote, RefreshCw, Search, Table2, Text, Type, UserPlus, UserRound, Video, WholeWord, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "katex/dist/katex.min.css";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import { Select } from "../components.tsx";
import { renderSafeLatex } from "../latex.ts";
import { serializeDocumentBlocks } from "../documentContent.ts";
import { pageTypeCapability, pageTypeDefinitions } from "../pageTypeRegistry.ts";
import type { KnowledgeApplicationCard, KnowledgeApplicationCardKind, KnowledgePageContentType, KnowledgePagePollView, KnowledgePageTask, KnowledgePageVersion, KnowledgePrincipal, KnowledgeTaskPriority, KnowledgeTaskStatus } from "../types.ts";
import { arrangeKnowledgeSlashMenuItems } from "./slashMenu.ts";
import type { KnowledgeSlashMenuItem } from "./slashMenu.ts";
import type { KnowledgeDynamicBlockRuntime, KnowledgeEditorProps, KnowledgeMentionPage, KnowledgeMentionRuntime, KnowledgePollRuntime, KnowledgeTaskRuntime } from "./types.ts";
import { taskDateTimeInputValue, taskDateTimeISO } from "./task.ts";

export const knowledgeImageCropAspects = ["original", "1:1", "4:3", "16:9", "3:4"] as const;

const knowledgeImageBlockConfig = {
  type: "image",
  propSchema: {
    textAlignment: { default: "left", values: ["left", "center", "right", "justify"] as const },
    backgroundColor: { default: "default" },
    name: { default: "" },
    url: { default: "" },
    caption: { default: "" },
    showPreview: { default: true },
    previewWidth: { default: undefined, type: "number" as const },
    cropAspect: { default: "original", values: knowledgeImageCropAspects },
    cropX: { default: 50, type: "number" as const },
    cropY: { default: 50, type: "number" as const },
    cropZoom: { default: 100, type: "number" as const },
  },
  content: "none",
} as const;

const cropAspectRatio: Record<(typeof knowledgeImageCropAspects)[number], string | undefined> = {
  original: undefined,
  "1:1": "1 / 1",
  "4:3": "4 / 3",
  "16:9": "16 / 9",
  "3:4": "3 / 4",
};

function KnowledgeImageVisual({ block, source, onPreview }: { block: ReactCustomBlockRenderProps<typeof knowledgeImageBlockConfig>["block"]; source?: string; onPreview?(): void }) {
  const cropped = block.props.cropAspect !== "original";
  const image = source ? <img
    className="bn-visual-media knowledge-image-media"
    src={source}
    alt={block.props.name || ""}
    width={cropped ? undefined : block.props.previewWidth}
    contentEditable={false}
    draggable={false}
    style={cropped ? {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: `${block.props.cropX}% ${block.props.cropY}%`,
      transform: `scale(${block.props.cropZoom / 100})`,
      transformOrigin: `${block.props.cropX}% ${block.props.cropY}%`,
    } : undefined}
  /> : <div className="bn-visual-media knowledge-image-loading" role="status">正在加载图片…</div>;
  return <div
    className={`knowledge-image-visual${cropped ? " is-cropped" : ""}`}
    style={cropped ? {
      width: block.props.previewWidth ? "100%" : "720px",
      maxWidth: "100%",
      aspectRatio: cropAspectRatio[block.props.cropAspect],
    } : undefined}
  >
    {image}
    {source && onPreview && <button type="button" className="knowledge-image-preview-button" contentEditable={false} aria-label="预览图片" title="预览图片" onClick={event => { event.preventDefault(); event.stopPropagation(); onPreview(); }}><Maximize2 size={15} /></button>}
  </div>;
}

function KnowledgeImageBlockView(props: ReactCustomBlockRenderProps<typeof knowledgeImageBlockConfig>) {
  const resolved = useResolveUrl(props.block.props.url);
  const [previewOpen, setPreviewOpen] = useState(false);
  const source = resolved.loadingState === "loaded" ? resolved.downloadUrl : undefined;
  useEffect(() => {
    if (!previewOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPreviewOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [previewOpen]);
  return <>
    <ResizableFileBlockWrapper {...(props as any)} buttonIcon={<ImageIcon size={24} />}>
      <KnowledgeImageVisual block={props.block} source={source} onPreview={() => setPreviewOpen(true)} />
    </ResizableFileBlockWrapper>
    {previewOpen && source && typeof document !== "undefined" && createPortal(<div className="knowledge-image-preview-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPreviewOpen(false); }}>
      <section className="knowledge-image-preview-dialog" role="dialog" aria-modal="true" aria-label={props.block.props.name ? `预览图片：${props.block.props.name}` : "预览图片"}>
        <button type="button" aria-label="关闭图片预览" title="关闭" onClick={() => setPreviewOpen(false)}><X size={18} /></button>
        <KnowledgeImageVisual block={props.block} source={source} />
        {(props.block.props.name || props.block.props.caption) && <footer><strong>{props.block.props.name || "图片"}</strong>{props.block.props.caption && <span>{props.block.props.caption}</span>}</footer>}
      </section>
    </div>, document.body)}
  </>;
}

const knowledgeImageBlock = createReactBlockSpec(knowledgeImageBlockConfig, {
  meta: { fileBlockAccept: ["image/*"] },
  parse: imageParse() as never,
  render: KnowledgeImageBlockView,
  toExternalHTML: ({ block }) => <figure data-knowledge-crop-aspect={block.props.cropAspect}>
    <KnowledgeImageVisual block={block} source={block.props.url} />
    {block.props.caption && <figcaption>{block.props.caption}</figcaption>}
  </figure>,
  runsBefore: ["file"],
});

const calloutToneOptions = [
  { tone: "info", label: "信息", icon: "💡" },
  { tone: "success", label: "成功", icon: "✅" },
  { tone: "warning", label: "提醒", icon: "🔔" },
  { tone: "danger", label: "警告", icon: "⚠️" },
] as const;

const calloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      tone: { default: "info", values: ["info", "success", "warning", "danger"] as const },
      icon: { default: "💡" },
    },
    content: "inline",
  },
  {
    render: ({ block, contentRef, editor }) => {
      const currentIndex = Math.max(0, calloutToneOptions.findIndex(item => item.tone === block.props.tone));
      const current = calloutToneOptions[currentIndex], next = calloutToneOptions[(currentIndex + 1) % calloutToneOptions.length];
      return <aside className={`knowledge-block-callout is-${current.tone}`}>
        {editor.isEditable ? <button type="button" contentEditable={false} className="knowledge-callout-tone" aria-label={`提示类型：${current.label}。点击切换为${next.label}`} title={`${current.label} · 点击切换为${next.label}`} onClick={() => editor.updateBlock(block, { props: { tone: next.tone, icon: next.icon } })}>{current.icon}</button> : <span className="knowledge-callout-tone" role="img" aria-label={`提示类型：${current.label}`}>{current.icon}</span>}
        <div ref={contentRef} className="knowledge-block-callout-content" />
      </aside>;
    },
  },
);

function renderLatex(source: string, displayMode: boolean) {
  const rendered = renderSafeLatex(source, displayMode);
  return {
    preview: rendered.html ? <span className={displayMode ? "knowledge-formula-preview is-block" : "knowledge-formula-preview is-inline"} dangerouslySetInnerHTML={{ __html: rendered.html }} /> : undefined,
    error: rendered.error,
  };
}

function useEditableSource(contentRef: (node: HTMLElement | null) => void, initialSource: string) {
  const [source, setSource] = useState(initialSource);
  const element = useRef<HTMLElement | null>(null);
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const bind = useCallback((node: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = undefined;
    contentRef(node);
    element.current = node;
    if (!node) return;
    const sync = () => setSource(node.textContent || "");
    sync();
    node.addEventListener("input", sync);
    const observer = new MutationObserver(sync);
    observer.observe(node, { childList: true, characterData: true, subtree: true });
    cleanup.current = () => {
      node.removeEventListener("input", sync);
      observer.disconnect();
    };
  }, [contentRef]);
  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => {
    if (!element.current) setSource(initialSource);
  }, [initialSource]);
  return { source, contentRef: bind };
}

const formulaBlockConfig = { type: "formula", propSchema: {}, content: "plain" } as const;

function FormulaBlockView({ block, contentRef, editor }: ReactCustomBlockRenderProps<typeof formulaBlockConfig>) {
  const initialSource = typeof block.content === "string" ? block.content : "";
  const current = useEditableSource(contentRef, initialSource);
  const rendered = renderLatex(current.source, true);
  return <SourceBlockWithPreview
    block={block}
    editor={editor}
    contentRef={current.contentRef}
    source={current.source}
    preview={rendered.preview}
    error={rendered.error}
    emptySourcePlaceholder="添加公式"
    errorPreview="公式语法无效"
    sourcePlaceholder="输入 LaTeX 公式"
  />;
}

const formulaBlock = createReactBlockSpec(
  formulaBlockConfig,
  {
    meta: { code: true, hasPreview: true, highlight: () => "latex" },
    render: FormulaBlockView,
    toExternalHTML: ({ block }) => {
      const source = typeof block.content === "string" ? block.content : "";
      const rendered = renderLatex(source, true);
      return <div className="knowledge-formula-export" data-latex={source}>{rendered.preview || source}</div>;
    },
  },
  [SourceBlockWithPreviewExtension()],
);

const inlineFormulaConfig = { type: "inlineFormula", propSchema: {}, content: "plain" } as const;

function InlineFormulaView({ inlineContent, contentRef, editor, node, getPos }: ReactCustomInlineContentRenderProps<typeof inlineFormulaConfig, any>) {
  const current = useEditableSource(contentRef, inlineContent.content || "");
  const rendered = renderLatex(current.source, false);
  return <SourceInlineContentWithPreview
    editor={editor}
    node={node}
    getPos={getPos}
    contentRef={current.contentRef}
    source={current.source}
    preview={rendered.preview}
    error={rendered.error}
    emptySourcePlaceholder="添加行内公式"
    errorPreview="公式语法无效"
    sourcePlaceholder="输入 LaTeX 公式"
  />;
}

const inlineFormula = createReactInlineContentSpec(
  inlineFormulaConfig,
  {
    meta: { code: true, hasPreview: true, highlight: () => "latex" },
    render: InlineFormulaView,
    toExternalHTML: ({ inlineContent }) => {
      const source = inlineContent.content || "";
      const rendered = renderLatex(source, false);
      return <span className="knowledge-formula-export is-inline" data-latex={source}>{rendered.preview || source}</span>;
    },
  },
  [SourceInlineContentWithPreviewExtension()],
);

type KnowledgeMentionRuntimeRef = { current: KnowledgeMentionRuntime | undefined };
type KnowledgeMentionRuntimeEntry = { runtime: KnowledgeMentionRuntimeRef; listeners: Set<() => void> };

const knowledgeMentionRuntimeByEditor = new WeakMap<object, KnowledgeMentionRuntimeEntry>();

export function registerKnowledgeMentionRuntime(editor: object, runtime: KnowledgeMentionRuntimeRef) {
  const current = knowledgeMentionRuntimeByEditor.get(editor);
  if (current) current.runtime = runtime;
  else knowledgeMentionRuntimeByEditor.set(editor, { runtime, listeners: new Set() });
}

export function notifyKnowledgeMentionRuntime(editor: object) {
  for (const listener of knowledgeMentionRuntimeByEditor.get(editor)?.listeners || []) listener();
}

function subscribeKnowledgeMentionRuntime(editor: object, listener: () => void) {
  const entry = knowledgeMentionRuntimeByEditor.get(editor);
  if (!entry) return () => undefined;
  entry.listeners.add(listener);
  return () => { entry.listeners.delete(listener); };
}

type KnowledgeTaskRuntimeRef = { current: KnowledgeTaskRuntime | undefined };
type KnowledgeTaskRuntimeEntry = { runtime: KnowledgeTaskRuntimeRef; listeners: Set<() => void> };

const knowledgeTaskRuntimeByEditor = new WeakMap<object, KnowledgeTaskRuntimeEntry>();

export function registerKnowledgeTaskRuntime(editor: object, runtime: KnowledgeTaskRuntimeRef) {
  const current = knowledgeTaskRuntimeByEditor.get(editor);
  if (current) current.runtime = runtime;
  else knowledgeTaskRuntimeByEditor.set(editor, { runtime, listeners: new Set() });
}

export function notifyKnowledgeTaskRuntime(editor: object) {
  for (const listener of knowledgeTaskRuntimeByEditor.get(editor)?.listeners || []) listener();
}

function useKnowledgeTaskRuntime(editor: object) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const entry = knowledgeTaskRuntimeByEditor.get(editor);
    if (!entry) return;
    const listener = () => setRevision(current => current + 1);
    entry.listeners.add(listener);
    return () => { entry.listeners.delete(listener); };
  }, [editor]);
  void revision;
  return knowledgeTaskRuntimeByEditor.get(editor)?.runtime.current;
}

type KnowledgePollRuntimeRef = { current: KnowledgePollRuntime | undefined };
type KnowledgePollRuntimeEntry = { runtime: KnowledgePollRuntimeRef; listeners: Set<() => void> };

const knowledgePollRuntimeByEditor = new WeakMap<object, KnowledgePollRuntimeEntry>();

export function registerKnowledgePollRuntime(editor: object, runtime: KnowledgePollRuntimeRef) {
  const current = knowledgePollRuntimeByEditor.get(editor);
  if (current) current.runtime = runtime;
  else knowledgePollRuntimeByEditor.set(editor, { runtime, listeners: new Set() });
}

export function notifyKnowledgePollRuntime(editor: object) {
  for (const listener of knowledgePollRuntimeByEditor.get(editor)?.listeners || []) listener();
}

function useKnowledgePollRuntime(editor: object) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const entry = knowledgePollRuntimeByEditor.get(editor);
    if (!entry) return;
    const listener = () => setRevision(current => current + 1);
    entry.listeners.add(listener);
    return () => { entry.listeners.delete(listener); };
  }, [editor]);
  void revision;
  return knowledgePollRuntimeByEditor.get(editor)?.runtime.current;
}

type KnowledgeDynamicBlockRuntimeRef = { current: KnowledgeDynamicBlockRuntime | undefined };
type KnowledgeDynamicBlockRuntimeEntry = { runtime: KnowledgeDynamicBlockRuntimeRef; listeners: Set<() => void> };

const knowledgeDynamicBlockRuntimeByEditor = new WeakMap<object, KnowledgeDynamicBlockRuntimeEntry>();

export function registerKnowledgeDynamicBlockRuntime(editor: object, runtime: KnowledgeDynamicBlockRuntimeRef) {
  const current = knowledgeDynamicBlockRuntimeByEditor.get(editor);
  if (current) current.runtime = runtime;
  else knowledgeDynamicBlockRuntimeByEditor.set(editor, { runtime, listeners: new Set() });
}

export function notifyKnowledgeDynamicBlockRuntime(editor: object) {
  for (const listener of knowledgeDynamicBlockRuntimeByEditor.get(editor)?.listeners || []) listener();
}

function useKnowledgeDynamicBlockRuntime(editor: object) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const entry = knowledgeDynamicBlockRuntimeByEditor.get(editor);
    if (!entry) return;
    const listener = () => setRevision(current => current + 1);
    entry.listeners.add(listener);
    return () => { entry.listeners.delete(listener); };
  }, [editor]);
  void revision;
  return knowledgeDynamicBlockRuntimeByEditor.get(editor)?.runtime.current;
}

type MentionResolution = { label: string; detail?: string; available: boolean };

function stableMentionFallback(kind: "person" | "page" | "block", id: string) {
  const compact = id.length > 20 ? `${id.slice(0, 10)}…${id.slice(-6)}` : id;
  return `${kind === "person" ? "成员" : kind === "page" ? "页面" : "Block"} ${compact || "不可用"}`;
}

function findMentionBlock(editor: BlockNoteEditor<any, any, any>, blockID: string): MentionResolution {
  let found: any;
  const visit = (blocks: readonly any[]) => {
    for (const block of blocks) {
      if (block.id === blockID) { found = block; return; }
      if (Array.isArray(block.children)) visit(block.children);
      if (found) return;
    }
  };
  visit(editor.document);
  if (!found) return { label: stableMentionFallback("block", blockID), detail: blockID, available: false };
  const text = inlineContentText(found.content).trim();
  return { label: text || `${found.type} Block`, detail: blockID, available: true };
}

function useMentionResolution(editor: BlockNoteEditor<any, any, any>, kind: "person" | "date" | "page" | "block", primaryID: string, pageID = "") {
  const fallback: MentionResolution = kind === "date"
    ? { label: primaryID || "未选择日期", detail: primaryID, available: /^\d{4}-\d{2}-\d{2}$/.test(primaryID) }
    : { label: stableMentionFallback(kind, primaryID), detail: primaryID, available: false };
  const [resolution, setResolution] = useState<MentionResolution>(fallback);
  const [runtimeRevision, setRuntimeRevision] = useState(0);
  useEffect(() => subscribeKnowledgeMentionRuntime(editor, () => setRuntimeRevision(current => current + 1)), [editor]);
  useEffect(() => {
    if (kind === "date") {
      const date = /^\d{4}-\d{2}-\d{2}$/.test(primaryID) ? new Date(`${primaryID}T00:00:00`) : null;
      setResolution(date && !Number.isNaN(date.getTime()) ? { label: new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric", weekday: "short" }).format(date), detail: primaryID, available: true } : fallback);
      return;
    }
    if (kind === "block") {
      const sync = () => {
        const runtime = knowledgeMentionRuntimeByEditor.get(editor)?.runtime.current;
        setResolution(runtime && runtime.currentPageID === pageID ? findMentionBlock(editor, primaryID) : fallback);
      };
      sync();
      return editor.onChange(sync);
    }
    const runtime = knowledgeMentionRuntimeByEditor.get(editor)?.runtime.current;
    if (!runtime || !primaryID) { setResolution(fallback); return; }
    const abort = new AbortController();
    if (kind === "person") {
      void runtime.resolvePerson(primaryID, abort.signal).then(value => {
        if (abort.signal.aborted) return;
        setResolution(value ? { label: value.displayName, detail: value.email || value.userID, available: true } : fallback);
      }, () => { if (!abort.signal.aborted) setResolution(fallback); });
    } else {
      void runtime.resolvePage(primaryID, abort.signal).then(value => {
        if (abort.signal.aborted) return;
        setResolution(value ? { label: value.title, detail: `${value.contentType} · ${value.pageID}`, available: true } : fallback);
      }, () => { if (!abort.signal.aborted) setResolution(fallback); });
    }
    return () => abort.abort();
  }, [editor, kind, pageID, primaryID, runtimeRevision]);
  return resolution;
}

function MentionPill({ editor, kind, primaryID, pageID = "" }: { editor: BlockNoteEditor<any, any, any>; kind: "person" | "date" | "page" | "block"; primaryID: string; pageID?: string }) {
  const resolution = useMentionResolution(editor, kind, primaryID, pageID);
  const Icon = kind === "person" ? UserRound : kind === "date" ? CalendarDays : kind === "page" ? BookOpen : Hash;
  return <span className={`knowledge-inline-mention is-${kind}${resolution.available ? "" : " is-unavailable"}`} contentEditable={false} title={resolution.detail || primaryID} data-mention-kind={kind} data-mention-id={primaryID}>
    <Icon size={13} aria-hidden="true" /><span>{kind === "person" ? "@" : ""}{resolution.label}</span>
  </span>;
}

const personMentionConfig = { type: "personMention", propSchema: { userId: { default: "" } }, content: "none" } as const;
const personMention = createReactInlineContentSpec(personMentionConfig, {
  render: ({ inlineContent, editor }) => <MentionPill editor={editor} kind="person" primaryID={inlineContent.props.userId} />,
});

const dateMentionConfig = { type: "dateMention", propSchema: { date: { default: "" } }, content: "none" } as const;
const dateMention = createReactInlineContentSpec(dateMentionConfig, {
  render: ({ inlineContent, editor }) => <MentionPill editor={editor} kind="date" primaryID={inlineContent.props.date} />,
});

const pageMentionConfig = { type: "pageMention", propSchema: { pageId: { default: "" } }, content: "none" } as const;
const pageMention = createReactInlineContentSpec(pageMentionConfig, {
  render: ({ inlineContent, editor }) => <MentionPill editor={editor} kind="page" primaryID={inlineContent.props.pageId} />,
});

const blockMentionConfig = { type: "blockMention", propSchema: { pageId: { default: "" }, blockId: { default: "" } }, content: "none" } as const;
const blockMention = createReactInlineContentSpec(blockMentionConfig, {
  render: ({ inlineContent, editor }) => <MentionPill editor={editor} kind="block" primaryID={inlineContent.props.blockId} pageID={inlineContent.props.pageId} />,
});

const buttonBlock = createReactBlockSpec(
  {
    type: "button",
    propSchema: {
      label: { default: "按钮" }, href: { default: "" },
      appearance: { default: "primary", values: ["primary", "secondary"] as const },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => <div className="knowledge-block-button" contentEditable={false}>
      {editor.isEditable ? <>
        <input aria-label="按钮文字" value={block.props.label} maxLength={80} onChange={event => editor.updateBlock(block, { props: { label: event.target.value } })} />
        <input aria-label="按钮链接" value={block.props.href} maxLength={2048} placeholder="https:// 或 knowledge-page:" onChange={event => editor.updateBlock(block, { props: { href: event.target.value } })} />
      </> : <a className={`is-${block.props.appearance}`} href={block.props.href || undefined} target="_blank" rel="noreferrer">{block.props.label}</a>}
    </div>,
  },
);

const knowledgeTaskConfig = {
  type: "knowledgeTask",
  propSchema: { title: { default: "待办任务" } },
  content: "none",
} as const;

const taskStatusOptions: { value: KnowledgeTaskStatus; label: string }[] = [
  { value: "todo", label: "待处理" },
  { value: "in_progress", label: "进行中" },
  { value: "done", label: "已完成" },
  { value: "canceled", label: "已取消" },
];

const taskPriorityOptions: { value: KnowledgeTaskPriority; label: string }[] = [
  { value: "none", label: "无优先级" },
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
  { value: "urgent", label: "紧急" },
];

function taskStatusLabel(status: KnowledgeTaskStatus) {
  return taskStatusOptions.find(option => option.value === status)?.label || status;
}

function TaskAssigneePicker({ task, runtime, disabled, onUpdate }: { task: KnowledgePageTask; runtime: KnowledgeTaskRuntime; disabled: boolean; onUpdate(userIDs: string[]): Promise<void> }) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<KnowledgePrincipal[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  useEffect(() => {
    if (disabled || !pickerOpen) { setCandidates([]); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => void runtime.searchMembers(query.trim(), abort.signal).then(items => {
      if (!abort.signal.aborted) setCandidates(items.filter(item => !task.assignee_user_ids.includes(item.user_id)));
    }, () => { if (!abort.signal.aborted) setCandidates([]); }), 180);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [disabled, pickerOpen, query, runtime, task.assignee_user_ids.join("\u0000")]);
  return <div className="knowledge-task-assignees">
    <div className="knowledge-task-chips">{task.assignee_user_ids.map(userID => <span key={userID}><UserRound size={13} />{runtime.memberName(userID)}{!disabled && <button type="button" aria-label={`移除负责人 ${runtime.memberName(userID)}`} onClick={() => void onUpdate(task.assignee_user_ids.filter(id => id !== userID))}><X size={12} /></button>}</span>)}{task.assignee_user_ids.length === 0 && <small>未指派</small>}</div>
    {!disabled && <details open={pickerOpen} onToggle={event => setPickerOpen(event.currentTarget.open)}><summary><UserPlus size={14} />添加负责人</summary><div className="knowledge-task-member-picker"><input aria-label="搜索任务负责人" value={query} onChange={event => setQuery(event.currentTarget.value)} placeholder="按姓名或邮箱搜索" />{candidates.map(person => <button key={person.user_id} type="button" onClick={() => { void onUpdate([...task.assignee_user_ids, person.user_id]); setQuery(""); }}><span>{(person.display_name || "?").slice(0, 1)}</span><strong>{person.display_name || person.user_id}<small>{person.email || person.user_id}</small></strong></button>)}{query && candidates.length === 0 && <small>没有可指派的当前知识库成员</small>}</div></details>}
  </div>;
}

function KnowledgeTaskBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof knowledgeTaskConfig>) {
  const runtime = useKnowledgeTaskRuntime(editor);
  const task = runtime?.taskForBlock(block.id);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  useEffect(() => {
    if (!runtime?.ready || !runtime.canCreate || task || busy) return;
    setBusy(true); setError("");
    void runtime.ensureTask(block.id, block.props.title).catch(failure => setError(failure instanceof Error ? failure.message : "任务创建失败")).finally(() => setBusy(false));
  }, [block.id, block.props.title, busy, runtime, task]);
  const update = async (patch: Parameters<KnowledgeTaskRuntime["updateTask"]>[1]) => {
    if (!runtime || !task || busy) return;
    setBusy(true); setError("");
    try { await runtime.updateTask(task, patch); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "任务更新失败"); }
    finally { setBusy(false); }
  };
  const canManage = Boolean(task && runtime?.canManage(task));
  const canUpdateStatus = Boolean(task && runtime?.canUpdateStatus(task));
  const title = task?.title || block.props.title;
  return <article className={`knowledge-task-block${task?.status === "done" ? " is-done" : ""}`} contentEditable={false} data-task-status={task?.status || "pending"}>
    <header>
      <button type="button" className="knowledge-task-check" aria-label={task?.status === "done" ? "重新打开任务" : "完成任务"} disabled={!task || !canUpdateStatus || busy} onClick={() => void update({ status: task?.status === "done" ? "todo" : "done" })}>{task?.status === "done" ? <CheckCircle2 size={20} /> : busy ? <LoaderCircle className="knowledge-spin" size={20} /> : <Circle size={20} />}</button>
      <div>{editor.isEditable ? <input className="knowledge-task-title" aria-label="任务标题" value={block.props.title} maxLength={512} onChange={event => editor.updateBlock(block, { props: { title: event.currentTarget.value } })} onBlur={event => { const next = event.currentTarget.value.trim() || "待办任务"; if (next !== event.currentTarget.value) editor.updateBlock(block, { props: { title: next } }); if (task && canManage && next !== task.title) void update({ title: next }); }} /> : <strong>{title}</strong>}<small>{task ? `${taskStatusLabel(task.status)} · 独立任务 revision ${task.revision}` : runtime?.ready ? "任务尚未登记" : "正在读取任务状态…"}</small></div>
      {task && <Select aria-label="任务状态" value={task.status} disabled={!canUpdateStatus || busy} onChange={event => void update({ status: event.currentTarget.value as KnowledgeTaskStatus })}>{taskStatusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>}
    </header>
    {task && <div className="knowledge-task-fields">
      <TaskAssigneePicker task={task} runtime={runtime!} disabled={!canManage || busy} onUpdate={assignee_user_ids => update({ assignee_user_ids })} />
      <label><Flag size={14} /><span>优先级</span><Select aria-label="任务优先级" value={task.priority} disabled={!canManage || busy} onChange={event => void update({ priority: event.currentTarget.value as KnowledgeTaskPriority })}>{taskPriorityOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></label>
      <label><CalendarDays size={14} /><span>截止</span><input key={`due-${task.due_at || "empty"}`} aria-label="任务截止时间" type="datetime-local" defaultValue={taskDateTimeInputValue(task.due_at)} disabled={!canManage || busy} onBlur={event => { const due_at = taskDateTimeISO(event.currentTarget.value); void update(due_at ? { due_at } : { due_at: undefined, reminder_at: undefined }); }} /></label>
      <label><Bell size={14} /><span>提醒</span><input key={`reminder-${task.reminder_at || "empty"}`} aria-label="任务提醒时间" type="datetime-local" defaultValue={taskDateTimeInputValue(task.reminder_at)} max={taskDateTimeInputValue(task.due_at)} disabled={!canManage || busy || !task.due_at} onBlur={event => void update({ reminder_at: taskDateTimeISO(event.currentTarget.value) })} /></label>
    </div>}
    {error && <p role="alert" className="knowledge-task-error">{error}</p>}
  </article>;
}

const knowledgeTaskBlock = createReactBlockSpec(knowledgeTaskConfig, {
  render: KnowledgeTaskBlockView,
  toExternalHTML: ({ block }) => <div data-knowledge-task="true">☐ {block.props.title}</div>,
});

const knowledgePollConfig = {
  type: "knowledgePoll",
  propSchema: { question: { default: "请选择一个选项" } },
  content: "none",
} as const;

function pollPercentage(votes: number, total: number) {
  return total > 0 ? Math.round((votes / total) * 100) : 0;
}

function KnowledgePollBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof knowledgePollConfig>) {
  const runtime = useKnowledgePollRuntime(editor);
  const poll = runtime?.pollForBlock(block.id);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [questionDraft, setQuestionDraft] = useState(block.props.question);
  const [optionDrafts, setOptionDrafts] = useState<string[]>([]);
  useEffect(() => {
    setQuestionDraft(poll?.poll.question || block.props.question);
    setOptionDrafts(poll?.poll.options.map(option => option.label) || []);
  }, [block.props.question, poll?.poll.id, poll?.poll.revision]);
  useEffect(() => {
    if (!runtime?.ready || !runtime.canCreate || poll || busy) return;
    setBusy(true); setError("");
    void runtime.ensurePoll(block.id, block.props.question).catch(failure => setError(failure instanceof Error ? failure.message : "投票创建失败")).finally(() => setBusy(false));
  }, [block.id, block.props.question, busy, poll, runtime]);

  const update = async (patch: Parameters<KnowledgePollRuntime["updatePoll"]>[1]) => {
    if (!runtime || !poll || busy) return;
    setBusy(true); setError("");
    try { await runtime.updatePoll(poll, patch); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "投票更新失败"); }
    finally { setBusy(false); }
  };
  const vote = async (optionID: string) => {
    if (!runtime || !poll || busy || poll.poll.status !== "open") return;
    const selected = new Set(poll.selected_option_ids);
    if (poll.poll.multiple) selected.has(optionID) ? selected.delete(optionID) : selected.add(optionID);
    else { selected.clear(); selected.add(optionID); }
    setBusy(true); setError("");
    try { await runtime.votePoll(poll, [...selected]); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "投票失败"); }
    finally { setBusy(false); }
  };
  const canManage = Boolean(poll && runtime?.canManage(poll));
  const structureLocked = Boolean(poll && poll.total_voters > 0);
  const commitQuestion = () => {
    if (!poll || !canManage || structureLocked) return;
    const question = questionDraft.trim() || "请选择一个选项";
    setQuestionDraft(question);
    editor.updateBlock(block, { props: { question } });
    if (question !== poll.poll.question) void update({ question });
  };
  const commitOption = (index: number) => {
    if (!poll || !canManage || structureLocked) return;
    const label = optionDrafts[index]?.trim() || `选项 ${index + 1}`;
    const options = poll.poll.options.map((option, optionIndex) => ({ id: option.id, label: optionIndex === index ? label : optionDrafts[optionIndex]?.trim() || option.label }));
    if (options[index]?.label !== optionDrafts[index]) setOptionDrafts(current => current.map((value, optionIndex) => optionIndex === index ? label : value));
    if (options.some((option, optionIndex) => option.label !== poll.poll.options[optionIndex]?.label)) void update({ options });
  };

  return <article className="knowledge-poll-block" contentEditable={false} data-poll-status={poll?.poll.status || "pending"}>
    <header>
      <span className="knowledge-poll-icon" aria-hidden="true"><ListChecks size={19} /></span>
      <div>
        {editor.isEditable && canManage && !structureLocked
          ? <input className="knowledge-poll-question" aria-label="投票问题" value={questionDraft} maxLength={1024} onChange={event => setQuestionDraft(event.currentTarget.value)} onBlur={commitQuestion} />
          : <strong>{poll?.poll.question || block.props.question}</strong>}
        <small>{poll ? `${poll.poll.multiple ? "多选" : "单选"} · ${poll.total_voters} 人参与 · 配置 revision ${poll.poll.revision}` : runtime?.ready ? "投票尚未登记" : "正在读取投票状态…"}</small>
      </div>
      {poll && canManage && <button type="button" className="knowledge-poll-status" disabled={busy} onClick={() => void update({ status: poll.poll.status === "open" ? "closed" : "open" })}>{poll.poll.status === "open" ? "结束投票" : "重新开启"}</button>}
    </header>
    {poll && <div className="knowledge-poll-options" role={poll.poll.multiple ? "group" : "radiogroup"} aria-label={poll.poll.question}>
      {poll.poll.options.map((option, index) => {
        const result = poll.results.find(item => item.option_id === option.id);
        const votes = result?.votes || 0;
        const checked = poll.selected_option_ids.includes(option.id);
        return <div key={option.id} className={`knowledge-poll-option${checked ? " is-selected" : ""}`}>
          <div className="knowledge-poll-option-main">
            <button type="button" className="knowledge-poll-vote" role={poll.poll.multiple ? "checkbox" : "radio"} aria-checked={checked} aria-label={`选择 ${option.label}`} disabled={busy || poll.poll.status !== "open"} onClick={() => void vote(option.id)}><span className="knowledge-poll-choice">{checked ? <Check size={14} /> : null}</span></button>
            <span className="knowledge-poll-label">{editor.isEditable && canManage && !structureLocked ? <input aria-label={`投票选项 ${index + 1}`} value={optionDrafts[index] ?? option.label} maxLength={256} onChange={event => { const value = event.currentTarget.value; setOptionDrafts(current => current.map((draft, optionIndex) => optionIndex === index ? value : draft)); }} onBlur={() => commitOption(index)} /> : <button type="button" disabled={busy || poll.poll.status !== "open"} onClick={() => void vote(option.id)}>{option.label}</button>}</span>
            <strong>{votes} 票</strong><small>{pollPercentage(votes, poll.total_voters)}%</small>
          </div>
          <span className="knowledge-poll-bar" aria-hidden="true"><i style={{ width: `${pollPercentage(votes, poll.total_voters)}%` }} /></span>
          {editor.isEditable && canManage && !structureLocked && poll.poll.options.length > 2 && <button type="button" className="knowledge-poll-remove" aria-label={`删除选项 ${option.label}`} disabled={busy} onClick={() => void update({ options: poll.poll.options.filter(item => item.id !== option.id) })}><X size={14} /></button>}
        </div>;
      })}
      {editor.isEditable && canManage && !structureLocked && <div className="knowledge-poll-config">
        <button type="button" disabled={busy || poll.poll.options.length >= 12} onClick={() => void update({ options: [...poll.poll.options, { label: `选项 ${poll.poll.options.length + 1}` }] })}>+ 添加选项</button>
        <label><input type="checkbox" checked={poll.poll.multiple} disabled={busy} onChange={event => void update({ multiple: event.currentTarget.checked })} />允许多选</label>
      </div>}
      {structureLocked && canManage && <p className="knowledge-poll-lock">已有成员投票，问题与选项已锁定；仍可结束或重新开启投票。</p>}
    </div>}
    {busy && <p className="knowledge-poll-progress"><LoaderCircle className="knowledge-spin" size={14} />正在同步投票…</p>}
    {error && <p role="alert" className="knowledge-task-error">{error}</p>}
  </article>;
}

const knowledgePollBlock = createReactBlockSpec(knowledgePollConfig, {
  render: KnowledgePollBlockView,
  toExternalHTML: ({ block }) => <div data-knowledge-poll="true">投票：{block.props.question}</div>,
});

function normalizeCardMetadata(value: string, maximum: number) {
  const documentValue = typeof document === "undefined" ? value : (() => {
    const parser = new DOMParser();
    return parser.parseFromString(value, "text/html").body.textContent || "";
  })();
  return [...documentValue.replace(/<[^<>]*>/g, " ").replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/\s+/g, " ").trim()].slice(0, maximum).join("");
}

function safeBookmarkURL(value: string): string | null {
  try {
    const parsed = new URL(value.trim());
    const hostname = parsed.hostname.toLocaleLowerCase().replace(/\.$/, "");
    const forbidden = ["localhost", ".localhost", ".local", ".internal", ".home", ".lan", ".test", ".invalid", ".example"];
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash || parsed.port && parsed.port !== "443" || !hostname.includes(".") || /^\[?[\da-f:.]+\]?$/i.test(hostname) || forbidden.some(suffix => hostname === suffix || hostname.endsWith(suffix))) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function canonicalExternalEmbedURL(provider: "youtube" | "bilibili", value: string): string | null {
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || parsed.hash) return null;
    if (provider === "youtube") {
      let videoID = "";
      if (parsed.hostname === "www.youtube.com" && parsed.pathname.startsWith("/embed/") && !parsed.search) videoID = parsed.pathname.slice(7);
      else if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(parsed.hostname) && parsed.pathname === "/watch") videoID = parsed.searchParams.get("v") || "";
      else if (parsed.hostname === "youtu.be") videoID = parsed.pathname.slice(1);
      return /^[A-Za-z0-9_-]{11}$/.test(videoID) ? `https://www.youtube.com/embed/${videoID}` : null;
    }
    let videoID = "";
    if (parsed.hostname === "player.bilibili.com" && parsed.pathname === "/player.html") videoID = parsed.searchParams.get("bvid") || "";
    else if (["bilibili.com", "www.bilibili.com"].includes(parsed.hostname)) videoID = parsed.pathname.match(/^\/video\/(BV[A-Za-z0-9]{10})\/?$/)?.[1] || "";
    return /^BV[A-Za-z0-9]{10}$/.test(videoID) ? `https://player.bilibili.com/player.html?bvid=${videoID}` : null;
  } catch {
    return null;
  }
}

function externalEmbedPlatformURL(provider: "youtube" | "bilibili", source: string): string {
  const parsed = new URL(source);
  if (provider === "youtube") return `https://www.youtube.com/watch?v=${parsed.pathname.slice(7)}`;
  return `https://www.bilibili.com/video/${parsed.searchParams.get("bvid") || ""}`;
}

function externalEmbedPlayerURL(provider: "youtube" | "bilibili", source: string): string {
  if (provider !== "youtube" || typeof window === "undefined") return source;
  const parsed = new URL(source);
  // Since July 2025 YouTube rejects anonymous iframe clients with player error
  // 153. The browser still sends the strict-origin referrer below, while these
  // parameters give the IFrame API an explicit, environment-correct client
  // identity without persisting a deployment hostname in document content.
  parsed.searchParams.set("enablejsapi", "1");
  parsed.searchParams.set("origin", window.location.origin);
  return parsed.href;
}

function externalEmbedLocalFallback(provider: "youtube" | "bilibili", source: string): { poster: string; reason: string } | null {
  if (provider !== "youtube" || typeof window === "undefined" || !["localhost", "127.0.0.1"].includes(window.location.hostname)) return null;
  const videoID = new URL(source).pathname.slice(7);
  return {
    poster: `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`,
    reason: "YouTube 不允许 localhost 作为嵌入来源，请在平台中播放",
  };
}

function CardInput({ label, value, maximum, placeholder, normalize, onCommit }: { label: string; value: string; maximum: number; placeholder?: string; normalize?(value: string): string | null; onCommit(value: string): void }) {
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setDraft(value); setInvalid(false); }, [value]);
  const commit = () => {
    const next = normalize ? normalize(draft) : normalizeCardMetadata(draft, maximum);
    if (next === null) { setInvalid(true); return; }
    setInvalid(false); setDraft(next); onCommit(next);
  };
  return <input
    aria-label={label}
    aria-invalid={invalid || undefined}
    title={invalid ? `${label}格式不受支持` : undefined}
    value={draft}
    maxLength={maximum}
    placeholder={placeholder}
    onChange={event => { setDraft(event.currentTarget.value); setInvalid(false); }}
    onBlur={commit}
    onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }}
  />;
}

const bookmarkBlockConfig = {
  type: "bookmark",
  propSchema: { url: { default: "" }, title: { default: "新网页书签" }, description: { default: "" }, siteName: { default: "" } },
  content: "none",
} as const;

function BookmarkBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof bookmarkBlockConfig>) {
  const href = safeBookmarkURL(block.props.url);
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  return <article className="knowledge-block-card knowledge-block-bookmark" contentEditable={false}>
    <span className="knowledge-block-card-icon"><Globe2 size={19} /></span>
    <div className="knowledge-block-card-copy"><strong>{block.props.title || "未命名网页书签"}</strong>{block.props.description && <p>{block.props.description}</p>}<small>{block.props.siteName || (href ? new URL(href).hostname : "等待填写安全 HTTPS 地址")}</small></div>
    {href && <a className="knowledge-block-card-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={`打开网页书签：${block.props.title || href}`}><ExternalLink size={16} /></a>}
    {editor.isEditable && <div className="knowledge-block-card-fields">
      <CardInput label="网页书签地址" value={block.props.url} maximum={2048} placeholder="https://…" normalize={value => value.trim() === "" ? "" : safeBookmarkURL(value)} onCommit={url => update({ url })} />
      <CardInput label="网页书签标题" value={block.props.title} maximum={256} onCommit={title => update({ title })} />
      <CardInput label="网页书签描述" value={block.props.description} maximum={1024} onCommit={description => update({ description })} />
      <CardInput label="网页站点名称" value={block.props.siteName} maximum={128} onCommit={siteName => update({ siteName })} />
    </div>}
  </article>;
}

const bookmarkBlock = createReactBlockSpec(bookmarkBlockConfig, { render: BookmarkBlockView });

const personCardConfig = {
  type: "personCard",
  propSchema: { userId: { default: "" }, displayName: { default: "未选择成员" }, email: { default: "" } },
  content: "none",
} as const;

function PersonCardView({ block, editor }: ReactCustomBlockRenderProps<typeof personCardConfig>) {
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  const initial = [...(block.props.displayName || block.props.email || block.props.userId || "?")][0]?.toLocaleUpperCase() || "?";
  return <article className="knowledge-block-card knowledge-block-person" contentEditable={false}>
    <span className="knowledge-person-avatar" aria-hidden="true">{initial}</span>
    <div className="knowledge-block-card-copy"><strong>{block.props.displayName || "未选择成员"}</strong><p>{block.props.email || "成员展示资料将在目录解析后更新"}</p><small>{block.props.userId || "等待填写稳定用户 ID"}</small></div>
    <UserRound className="knowledge-block-card-mark" size={17} aria-hidden="true" />
    {editor.isEditable && <div className="knowledge-block-card-fields">
      <CardInput label="人员用户 ID" value={block.props.userId} maximum={255} placeholder="稳定用户 ID" normalize={value => { const next = value.trim(); return /[\u0000-\u001f\u007f-\u009f]/.test(next) ? null : next; }} onCommit={userId => update({ userId })} />
      <CardInput label="人员姓名" value={block.props.displayName} maximum={256} onCommit={displayName => update({ displayName })} />
      <CardInput label="人员邮箱" value={block.props.email} maximum={320} placeholder="name@example.com" normalize={value => { const next = value.trim(); return next === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next) ? next : null; }} onCommit={email => update({ email })} />
    </div>}
  </article>;
}

const personCardBlock = createReactBlockSpec(personCardConfig, { render: PersonCardView });

const applicationCardKinds: { id: KnowledgeApplicationCardKind; label: string }[] = [
  { id: "calendar_event", label: "日程" },
  { id: "meeting", label: "会议" },
  { id: "group", label: "群组" },
  { id: "task", label: "任务" },
  { id: "jira", label: "Jira" },
  { id: "web", label: "网页应用" },
];

const applicationCardConfig = {
  type: "applicationCard",
  propSchema: {
    provider: { default: "web" },
    kind: { default: "web", values: ["calendar_event", "meeting", "group", "task", "jira", "web"] as const },
    resourceId: { default: "" },
  },
  content: "none",
} as const;

function applicationCardIcon(kind: KnowledgeApplicationCardKind) {
  if (kind === "calendar_event" || kind === "meeting") return CalendarDays;
  if (kind === "group") return UserRound;
  if (kind === "task" || kind === "jira") return CheckCircle2;
  return Globe2;
}

function ApplicationCardView({ block, editor }: ReactCustomBlockRenderProps<typeof applicationCardConfig>) {
  const runtime = useKnowledgeDynamicBlockRuntime(editor);
  const [card, setCard] = useState<KnowledgeApplicationCard>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const referenceReady = Boolean(block.props.provider.trim() && block.props.resourceId.trim());
  useEffect(() => {
    setCard(undefined);
    setError("");
    if (!referenceReady || !runtime?.resolveApplicationCard) return;
    const controller = new AbortController();
    setLoading(true);
    runtime.resolveApplicationCard({ provider: block.props.provider.trim(), kind: block.props.kind, resource_id: block.props.resourceId.trim() }, controller.signal)
      .then(setCard)
      .catch(failure => { if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "应用卡片暂时不可用"); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [block.props.kind, block.props.provider, block.props.resourceId, referenceReady, refresh, runtime]);
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  const KindIcon = applicationCardIcon(block.props.kind);
  const kindLabel = applicationCardKinds.find(item => item.id === block.props.kind)?.label || "应用";
  const href = card?.url && safeBookmarkURL(card.url);
  return <article className="knowledge-block-card knowledge-block-application" contentEditable={false}>
    <span className="knowledge-block-card-icon"><KindIcon size={19} /></span>
    <div className="knowledge-block-card-copy">
      <strong>{loading ? "正在读取应用数据…" : card?.title || (referenceReady ? `${kindLabel}不可用` : `添加${kindLabel}卡片`)}</strong>
      <p>{card?.subtitle || error || (!runtime?.resolveApplicationCard ? "宿主尚未配置应用连接器" : referenceReady ? "可刷新重试，页面正文不会保存第三方响应" : "填写连接器与资源 ID 后读取实时数据")}</p>
      <small>{card?.status ? `${card.status}${card.updated_at ? ` · ${new Date(card.updated_at).toLocaleString()}` : ""}` : referenceReady ? `${block.props.provider} · ${block.props.resourceId}` : "只保存稳定引用，不保存凭据"}</small>
    </div>
    <div className="knowledge-block-application-actions">
      {loading ? <LoaderCircle className="knowledge-spin" size={16} /> : referenceReady && runtime?.resolveApplicationCard ? <button type="button" aria-label="刷新应用卡片" title="刷新" onClick={() => setRefresh(value => value + 1)}><RefreshCw size={15} /></button> : null}
      {href && <a className="knowledge-block-card-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={`打开${card?.title || kindLabel}`}><ExternalLink size={16} /></a>}
    </div>
    {editor.isEditable && <div className="knowledge-block-card-fields knowledge-block-application-fields">
      <Select aria-label="应用卡片类型" value={block.props.kind} onChange={event => {
        const kind = event.currentTarget.value as KnowledgeApplicationCardKind;
        update({ kind, provider: kind === "web" && !block.props.provider.trim() ? "web" : kind !== "web" && block.props.provider === "web" ? "" : block.props.provider });
      }}>{applicationCardKinds.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</Select>
      <CardInput label="应用连接器" value={block.props.provider} maximum={64} placeholder="例如 jira、google-calendar" normalize={value => { const next = value.trim(); return next === "" || /^[a-z0-9][a-z0-9_-]{0,63}$/.test(next) ? next : null; }} onCommit={provider => update({ provider })} />
      <CardInput label="应用资源 ID" value={block.props.resourceId} maximum={2048} placeholder="稳定资源 ID（不是访问令牌）" normalize={value => { const next = value.trim(); return /[\u0000-\u001f\u007f-\u009f]/.test(next) ? null : next; }} onCommit={resourceId => update({ resourceId })} />
    </div>}
  </article>;
}

const applicationCardBlock = createReactBlockSpec(applicationCardConfig, {
  render: ApplicationCardView,
  toExternalHTML: ({ block }) => <div data-knowledge-application-card={block.props.kind}>{block.props.provider}:{block.props.resourceId}</div>,
});

const externalEmbedConfig = {
  type: "externalEmbed",
  propSchema: { provider: { default: "youtube", values: ["youtube", "bilibili"] as const }, url: { default: "" }, title: { default: "外部视频" } },
  content: "none",
} as const;

function ExternalEmbedView({ block, editor }: ReactCustomBlockRenderProps<typeof externalEmbedConfig>) {
  const source = canonicalExternalEmbedURL(block.props.provider, block.props.url);
  const playerSource = source ? externalEmbedPlayerURL(block.props.provider, source) : "";
  const platformURL = source ? externalEmbedPlatformURL(block.props.provider, source) : "";
  const localFallback = source ? externalEmbedLocalFallback(block.props.provider, source) : null;
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  return <figure className="knowledge-block-embed" contentEditable={false}>
    <header>
      <span><PlaySquare size={17} />{block.props.title || "外部视频"}</span>
      <div className="knowledge-block-embed-actions">
        <small>{block.props.provider === "youtube" ? "YouTube 播放器" : "哔哩哔哩播放器"}</small>
        {platformURL && <a style={{ color: "inherit", display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8 }} href={platformURL} target="_blank" rel="noopener noreferrer" aria-label={`在${block.props.provider === "youtube" ? "YouTube" : "哔哩哔哩"}打开视频`}><ExternalLink size={14} />平台播放</a>}
      </div>
    </header>
    {localFallback && platformURL ? <a className="knowledge-block-embed-fallback" style={{ position: "relative", display: "grid", placeItems: "center", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", color: "#fff", background: "#101814", textDecoration: "none" }} href={platformURL} target="_blank" rel="noopener noreferrer" aria-label="YouTube 本地预览不可用，前往平台播放">
      <img style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .48 }} src={localFallback.poster} alt="" />
      <span style={{ position: "absolute", display: "grid", justifyItems: "center", gap: 7, padding: "16px 22px", textAlign: "center", background: "rgb(10 27 19 / 82%)", border: "1px solid rgb(255 255 255 / 26%)", borderRadius: 12 }}><PlaySquare size={34} /><strong>前往 YouTube 播放</strong><small style={{ maxWidth: 420, color: "#d7e5dd" }}>{localFallback.reason}</small></span>
    </a> : playerSource ? <iframe
      src={playerSource}
      title={block.props.title || "受控外部视频"}
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    /> : <div className="knowledge-block-embed-empty"><PlaySquare size={30} /><span>填写受支持的视频地址后显示预览</span></div>}
    {editor.isEditable && <figcaption>
      <label>服务<Select aria-label="外部嵌入服务" value={block.props.provider} onChange={event => update({ provider: event.currentTarget.value as typeof block.props.provider, url: "" })}><option value="youtube">YouTube</option><option value="bilibili">哔哩哔哩</option></Select></label>
      <CardInput label="外部嵌入地址" value={block.props.url} maximum={2048} placeholder={block.props.provider === "youtube" ? "YouTube 视频地址" : "哔哩哔哩视频地址"} normalize={value => value.trim() === "" ? "" : canonicalExternalEmbedURL(block.props.provider, value)} onCommit={url => update({ url })} />
      <CardInput label="外部嵌入标题" value={block.props.title} maximum={256} onCommit={title => update({ title })} />
    </figcaption>}
  </figure>;
}

const externalEmbedBlock = createReactBlockSpec(externalEmbedConfig, { render: ExternalEmbedView });

const knowledgeReferenceConfig = {
  type: "knowledgeReference",
  propSchema: {
    targetPageId: { default: "" }, title: { default: "未选择知识条目" },
    targetType: { default: "document", values: ["document", "multidimensional_table", "spreadsheet", "presentation", "form", "mind_note", "whiteboard", "mind_map", "flowchart", "file"] as const },
    display: { default: "card", values: ["card", "embed"] as const },
    referenceMode: { default: "live", values: ["live", "fixed"] as const },
    targetVersion: { default: 0, type: "number" as const },
    embeddedEdit: { default: false },
  },
  content: "none",
} as const;

function KnowledgeReferenceBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof knowledgeReferenceConfig>) {
  const runtime = useKnowledgeDynamicBlockRuntime(editor);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<KnowledgeMentionPage[]>([]);
  const [versions, setVersions] = useState<KnowledgePageVersion[]>([]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  useEffect(() => {
    if (!pickerOpen || !runtime) return;
    const abort = new AbortController();
    setBusy(true); setFailure("");
    void runtime.searchPages(query, abort.signal).then(items => { if (!abort.signal.aborted) setPages(items.filter(page => page.pageID !== runtime.currentPageID)); }).catch(() => { if (!abort.signal.aborted) setFailure("无法加载可引用页面"); }).finally(() => { if (!abort.signal.aborted) setBusy(false); });
    return () => abort.abort();
  }, [pickerOpen, query, runtime]);
  useEffect(() => {
    if (!runtime || !block.props.targetPageId) { setVersions([]); return; }
    const abort = new AbortController();
    void runtime.listPageVersions(block.props.targetPageId, abort.signal).then(setVersions).catch(() => setVersions([]));
    return () => abort.abort();
  }, [block.props.targetPageId, runtime]);
  const selectPage = (page: KnowledgeMentionPage) => {
    update({ targetPageId: page.pageID, title: page.title, targetType: page.contentType, referenceMode: "live", targetVersion: 0, embeddedEdit: block.props.display === "embed" });
    setPickerOpen(false); setQuery(""); setFailure("");
  };
  const setReferenceMode = async (mode: "live" | "fixed") => {
    if (mode === "live") { update({ referenceMode: "live", targetVersion: 0 }); return; }
    if (!runtime || !block.props.targetPageId) { setFailure("请先选择一个页面"); return; }
    setBusy(true); setFailure("");
    try {
      const items = await runtime.listPageVersions(block.props.targetPageId, AbortSignal.timeout(10_000));
      setVersions(items);
      if (!items[0]) { setFailure("目标页面还没有可固定的发布版本"); return; }
      update({ referenceMode: "fixed", targetVersion: items[0].version, embeddedEdit: false });
    } catch { setFailure("无法读取目标页面版本"); }
    finally { setBusy(false); }
  };
  const unresolved = !block.props.targetPageId;
  return <article className={`knowledge-block-reference${block.props.display === "embed" ? " is-embed" : " is-card"}`} contentEditable={false}>
    {unresolved ? <div className="knowledge-reference-empty"><span className="knowledge-block-reference-icon"><BookOpen size={18} /></span><div><strong>选择要引用的知识条目</strong><small>只能从你当前有权限访问的页面中选择</small></div></div> : runtime?.renderReference({
      blockID: block.id, targetPageID: block.props.targetPageId, title: block.props.title, contentType: block.props.targetType as KnowledgePageContentType,
      display: block.props.display, referenceMode: block.props.referenceMode, targetVersion: block.props.targetVersion, embeddedEdit: block.props.embeddedEdit,
    }) || <div className="knowledge-reference-empty"><span className="knowledge-block-reference-icon"><BookOpen size={18} /></span><div><strong>{block.props.title}</strong><small>{block.props.targetType} · {block.props.referenceMode === "fixed" ? `固定版本 ${block.props.targetVersion}` : "实时引用"}</small></div></div>}
    {editor.isEditable && <div className="knowledge-block-reference-fields">
      <button type="button" onClick={() => setPickerOpen(value => !value)}><Search size={14} />{unresolved ? "选择页面" : "更换页面"}</button>
      {!unresolved && <><Select aria-label="引用显示方式" value={block.props.display} onChange={event => { const display = event.target.value as "card" | "embed"; update({ display, embeddedEdit: display === "embed" && block.props.referenceMode === "live" && block.props.embeddedEdit }); }}><option value="card">卡片</option><option value="embed">内嵌</option></Select>
        <Select aria-label="引用更新方式" value={block.props.referenceMode} onChange={event => void setReferenceMode(event.target.value as "live" | "fixed")}><option value="live">实时引用</option><option value="fixed">固定版本</option></Select>
        {block.props.referenceMode === "fixed" && <Select aria-label="固定版本" value={block.props.targetVersion} onChange={event => update({ targetVersion: Number(event.target.value) })}>{versions.map(version => <option key={version.version} value={version.version}>版本 {version.version}</option>)}</Select>}
        {block.props.display === "embed" && block.props.referenceMode === "live" && <label><input type="checkbox" checked={block.props.embeddedEdit} onChange={event => update({ embeddedEdit: event.target.checked })} />允许内嵌编辑</label>}</>}
    </div>}
    {pickerOpen && <div className="knowledge-reference-picker" role="dialog" aria-label="选择引用页面">
      <label><Search size={14} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索有权限的页面" /></label>
      {busy && <p><LoaderCircle className="knowledge-spin" size={14} />正在加载…</p>}
      {!busy && pages.length === 0 && <p>没有可选择的页面</p>}
      <div>{pages.map(page => <button type="button" key={page.pageID} onClick={() => selectPage(page)}><FileText size={15} /><span><strong>{page.title}</strong><small>{pageTypeDefinitions.find(item => item.id === page.contentType)?.label || page.contentType}</small></span></button>)}</div>
      <button type="button" onClick={() => setPickerOpen(false)}>关闭</button>
    </div>}
    {failure && <p className="knowledge-reference-error" role="alert">{failure}</p>}
  </article>;
}

const knowledgeReferenceBlock = createReactBlockSpec(knowledgeReferenceConfig, { render: KnowledgeReferenceBlockView });

const syncedBlock = createReactBlockSpec(
  {
    type: "syncedBlock",
    propSchema: { targetPageId: { default: "" }, targetBlockId: { default: "" }, title: { default: "同步内容块" } },
    content: "none",
  },
  {
    render: ({ block, editor }) => <article className="knowledge-block-synced" contentEditable={false}>
      <Link2 size={17} /><div><strong>{block.props.title}</strong><small>{block.props.targetPageId && block.props.targetBlockId ? `${block.props.targetPageId} / ${block.props.targetBlockId}` : "填写来源页面和 Block ID 后建立同步引用"}</small></div>
      {editor.isEditable && <div><input aria-label="同步来源页面" value={block.props.targetPageId} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.target.value } })} /><input aria-label="同步来源 Block" value={block.props.targetBlockId} placeholder="Block ID" onChange={event => editor.updateBlock(block, { props: { targetBlockId: event.target.value } })} /></div>}
    </article>,
  },
);

type DocumentHeading = { id: string; level: number; text: string };

function inlineContentText(content: unknown): string {
  if (!Array.isArray(content)) return "";
  return content.map(item => {
    if (!item || typeof item !== "object") return "";
    const value = item as { type?: string; text?: string; content?: unknown };
    if (value.type === "text") return value.text || "";
    if (value.type === "link") return inlineContentText(value.content);
    return "";
  }).join("");
}

function documentHeadings(blocks: readonly any[], maxDepth: number): DocumentHeading[] {
  const headings: DocumentHeading[] = [];
  const visit = (items: readonly any[]) => items.forEach(block => {
    if (block?.type === "heading") {
      const level = Number(block.props?.level || 1);
      const text = inlineContentText(block.content).trim();
      if (level <= maxDepth && text) headings.push({ id: block.id, level, text });
    }
    if (Array.isArray(block?.children)) visit(block.children);
  });
  visit(blocks);
  return headings;
}

const tableOfContentsConfig = {
  type: "tableOfContents",
  propSchema: { maxDepth: { default: 3, values: [1, 2, 3] as const } },
  content: "none",
} as const;

function TableOfContentsView({ block, editor }: ReactCustomBlockRenderProps<typeof tableOfContentsConfig>) {
  const [headings, setHeadings] = useState<DocumentHeading[]>(() => documentHeadings(editor.document, block.props.maxDepth));
  useEffect(() => {
    const sync = () => setHeadings(documentHeadings(editor.document, block.props.maxDepth));
    sync();
    return editor.onChange(sync);
  }, [block.props.maxDepth, editor]);
  const jumpTo = (id: string) => {
    const target = document.querySelector(`[data-id="${CSS.escape(id)}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (editor.isEditable) editor.setTextCursorPosition(id, "start");
  };
  return <nav className="knowledge-block-toc" aria-label="页面目录" contentEditable={false}>
    <header><strong>目录</strong>{editor.isEditable && <label>层级<Select aria-label="目录层级" value={block.props.maxDepth} onChange={event => editor.updateBlock(block, { props: { maxDepth: Number(event.target.value) as 1 | 2 | 3 } })}><option value={1}>H1</option><option value={2}>H1–H2</option><option value={3}>H1–H3</option></Select></label>}</header>
    {headings.length ? <ol>{headings.map(heading => <li key={heading.id} data-level={heading.level}><button type="button" onClick={() => jumpTo(heading.id)}>{heading.text}</button></li>)}</ol> : <p>添加标题后会自动生成目录。</p>}
  </nav>;
}

const tableOfContentsBlock = createReactBlockSpec(tableOfContentsConfig, { render: TableOfContentsView });

const subpageListConfig = {
  type: "subpageList",
  propSchema: { maxItems: { default: 10, values: [5, 10, 20, 50] as const } },
  content: "none",
} as const;

function SubpageListView({ block, editor }: ReactCustomBlockRenderProps<typeof subpageListConfig>) {
  const runtime = useKnowledgeDynamicBlockRuntime(editor);
  const [pages, setPages] = useState<KnowledgeMentionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!runtime) { setPages([]); setError(""); return; }
    const abort = new AbortController();
    setLoading(true); setError("");
    void runtime.listChildPages(block.props.maxItems, abort.signal).then(items => {
      if (!abort.signal.aborted) setPages(items);
    }, failure => {
      if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : "子页面加载失败");
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [block.props.maxItems, refresh, runtime]);
  return <section className="knowledge-block-subpages" contentEditable={false}>
    <header><span><BookOpen size={16} /><strong>子页面</strong><small>{pages.length} 项</small></span><span>{editor.isEditable && <label>显示<Select aria-label="子页面显示数量" value={block.props.maxItems} onChange={event => editor.updateBlock(block, { props: { maxItems: Number(event.currentTarget.value) as 5 | 10 | 20 | 50 } })}><option value={5}>5 项</option><option value={10}>10 项</option><option value={20}>20 项</option><option value={50}>50 项</option></Select></label>}<button type="button" aria-label="刷新子页面" title="刷新子页面" disabled={!runtime || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw className={loading ? "knowledge-spin" : undefined} size={14} /></button></span></header>
    {!runtime ? <p>历史快照不执行动态子页面查询。</p> : error ? <p role="alert">{error}</p> : loading && pages.length === 0 ? <p>正在读取当前页面的子页面…</p> : pages.length === 0 ? <p>当前页面还没有可见子页面。</p> : <ol>{pages.map(page => <li key={page.pageID}><button type="button" onClick={() => runtime.openPage(page.pageID)}><FileText size={15} /><span><strong>{page.title}</strong><small>{page.contentType}</small></span><ChevronRight size={14} /></button></li>)}</ol>}
  </section>;
}

const subpageListBlock = createReactBlockSpec(subpageListConfig, { render: SubpageListView });

const informationCollectionConfig = {
  type: "informationCollection",
  propSchema: { targetPageId: { default: "" }, title: { default: "信息收集" } },
  content: "none",
} as const;

function InformationCollectionView({ block, editor }: ReactCustomBlockRenderProps<typeof informationCollectionConfig>) {
  const runtime = useKnowledgeDynamicBlockRuntime(editor);
  const [target, setTarget] = useState<KnowledgeMentionPage | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (!runtime || !block.props.targetPageId) { setTarget(null); setResolved(true); return; }
    const abort = new AbortController(); setResolved(false);
    void runtime.resolvePage(block.props.targetPageId, abort.signal).then(value => {
      if (!abort.signal.aborted) { setTarget(value?.contentType === "form" ? value : null); setResolved(true); }
    }, () => { if (!abort.signal.aborted) { setTarget(null); setResolved(true); } });
    return () => abort.abort();
  }, [block.props.targetPageId, runtime]);
  return <section className="knowledge-block-collection" contentEditable={false}>
    <span><ClipboardList size={20} /></span><div><strong>{block.props.title || "信息收集"}</strong><small>{target ? `表单 · ${target.title}` : block.props.targetPageId && resolved ? "目标不是可访问的表单页面" : "关联一个表单页面后开始收集"}</small></div>
    {target && <button type="button" onClick={() => runtime?.openPage(target.pageID)}>打开表单<ChevronRight size={14} /></button>}
    {editor.isEditable && <div className="knowledge-block-collection-fields"><input aria-label="信息收集标题" maxLength={256} value={block.props.title} onChange={event => editor.updateBlock(block, { props: { title: event.currentTarget.value } })} /><input aria-label="表单页面 ID" maxLength={128} value={block.props.targetPageId} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.currentTarget.value.trim() } })} /></div>}
  </section>;
}

const informationCollectionBlock = createReactBlockSpec(informationCollectionConfig, { render: InformationCollectionView });

const knowledgeActivityConfig = {
  type: "knowledgeActivity",
  propSchema: { maxItems: { default: 10, values: [5, 10, 20] as const } },
  content: "none",
} as const;

function KnowledgeActivityView({ block, editor }: ReactCustomBlockRenderProps<typeof knowledgeActivityConfig>) {
  const runtime = useKnowledgeDynamicBlockRuntime(editor);
  const [items, setItems] = useState<{ id: string; title: string; detail: string; at: string }[]>([]);
  const [loading, setLoading] = useState(false), [error, setError] = useState(""), [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (!runtime) { setItems([]); return; }
    const abort = new AbortController(); setLoading(true); setError("");
    void runtime.listPageActivity(block.props.maxItems, abort.signal).then(value => { if (!abort.signal.aborted) setItems(value); }, failure => { if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : "动态加载失败"); }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [block.props.maxItems, refresh, runtime]);
  return <section className="knowledge-block-activity" contentEditable={false}><header><span><Activity size={16} /><strong>知识库动态</strong></span><span>{editor.isEditable && <Select aria-label="动态显示数量" value={block.props.maxItems} onChange={event => editor.updateBlock(block, { props: { maxItems: Number(event.currentTarget.value) as 5 | 10 | 20 } })}><option value={5}>5 条</option><option value={10}>10 条</option><option value={20}>20 条</option></Select>}<button type="button" aria-label="刷新知识库动态" disabled={!runtime || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw className={loading ? "knowledge-spin" : undefined} size={14} /></button></span></header>
    {!runtime ? <p>历史快照不执行动态查询。</p> : error ? <p role="alert">{error}</p> : items.length === 0 ? <p>当前页面还没有发布、评论或任务动态。</p> : <ol>{items.map(item => <li key={item.id}><Activity size={13} /><span><strong>{item.title}</strong><small>{new Date(item.at).toLocaleString()} · {item.detail}</small></span></li>)}</ol>}
  </section>;
}

const knowledgeActivityBlock = createReactBlockSpec(knowledgeActivityConfig, { render: KnowledgeActivityView });

export const knowledgeCodeLanguages = {
  text: { name: "纯文本", aliases: ["none", "plaintext", "txt"] },
  javascript: { name: "JavaScript", aliases: ["js", "jsx"] },
  typescript: { name: "TypeScript", aliases: ["ts", "tsx"] },
  json: { name: "JSON" },
  html: { name: "HTML", aliases: ["htm"] },
  css: { name: "CSS" },
  bash: { name: "Shell", aliases: ["sh", "shell", "zsh"] },
  go: { name: "Go", aliases: ["golang"] },
  python: { name: "Python", aliases: ["py"] },
  java: { name: "Java" },
  sql: { name: "SQL" },
  markdown: { name: "Markdown", aliases: ["md"] },
  yaml: { name: "YAML", aliases: ["yml"] },
  rust: { name: "Rust", aliases: ["rs"] },
  csharp: { name: "C#", aliases: ["cs"] },
  cpp: { name: "C++", aliases: ["c++"] },
} satisfies Record<string, { name: string; aliases?: string[] }>;

export const knowledgeCodeLanguageIDs = Object.freeze(Object.keys(knowledgeCodeLanguages));

const knowledgeContentActionByEditor = new WeakMap<object, NonNullable<KnowledgeEditorProps["authorizeContentAction"]>>();

export function registerKnowledgeContentAction(editor: object, authorize: KnowledgeEditorProps["authorizeContentAction"]) {
  if (authorize) knowledgeContentActionByEditor.set(editor, authorize);
  else knowledgeContentActionByEditor.delete(editor);
}

async function copyCodeText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("clipboard unavailable");
}

const defaultKnowledgeCodeBlockSpec = createCodeBlockSpec({
  defaultLanguage: "text",
  supportedLanguages: knowledgeCodeLanguages,
});

const knowledgeCodeBlockSpec = () => {
  const base = defaultKnowledgeCodeBlockSpec;
  const render = base.implementation.render!;
  return {
    ...base,
    config: {
      ...base.config,
      propSchema: { ...base.config.propSchema, wrap: { default: true } },
    },
    implementation: {
      ...base.implementation,
      render(this: unknown, block: any, editor: any) {
        const rendered = render.call(this as never, block, editor);
        const shell = rendered.dom as HTMLElement;
        shell.classList.add("knowledge-code-block");
        shell.dataset.wrap = block.props.wrap === false ? "false" : "true";

        const toolbar = document.createElement("div");
        toolbar.className = "knowledge-code-toolbar";
        toolbar.contentEditable = "false";

        const languageSelect = shell.querySelector("select");
        const languageControl = languageSelect?.parentElement;
        if (languageSelect && languageControl) {
          languageSelect.setAttribute("aria-label", "代码语言");
          languageControl.classList.add("knowledge-code-language");
          toolbar.appendChild(languageControl);
        }

        const actions = document.createElement("div");
        actions.className = "knowledge-code-actions";
        const wrapButton = document.createElement("button");
        wrapButton.type = "button";
        wrapButton.textContent = "换行";
        wrapButton.title = "切换长代码自动换行";
        wrapButton.setAttribute("aria-label", "切换代码自动换行");
        wrapButton.setAttribute("aria-pressed", String(block.props.wrap !== false));
        wrapButton.disabled = !editor.isEditable;
        const toggleWrap = () => {
          if (!editor.isEditable) return;
          const next = block.props.wrap === false;
          shell.dataset.wrap = String(next);
          wrapButton.setAttribute("aria-pressed", String(next));
          editor.updateBlock(block.id, { props: { wrap: next } });
        };
        wrapButton.addEventListener("click", toggleWrap);

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.textContent = "复制";
        copyButton.title = "复制代码";
        copyButton.setAttribute("aria-label", "复制代码");
        copyButton.hidden = !knowledgeContentActionByEditor.has(editor);
        let copiedTimer = 0;
        const copy = async () => {
          try {
            const authorize = knowledgeContentActionByEditor.get(editor);
            if (!authorize) throw new Error("copy denied");
            await authorize("copy");
            await copyCodeText(rendered.contentDOM?.textContent || "");
            copyButton.textContent = "已复制";
          } catch {
            copyButton.textContent = "复制失败";
          }
          window.clearTimeout(copiedTimer);
          copiedTimer = window.setTimeout(() => { copyButton.textContent = "复制"; }, 1600);
        };
        copyButton.addEventListener("click", copy);
        actions.append(wrapButton, copyButton);
        toolbar.appendChild(actions);
        shell.prepend(toolbar);

        return {
          ...rendered,
          dom: shell,
          destroy: () => {
            window.clearTimeout(copiedTimer);
            wrapButton.removeEventListener("click", toggleWrap);
            copyButton.removeEventListener("click", copy);
            rendered.destroy?.();
          },
        };
      },
    },
  };
};

type BlockSlashDefinition = {
  id?: string;
  title: string;
  subtext: string;
  aliases: readonly string[];
  group: string;
  icon: LucideIcon;
  block: Record<string, unknown>;
};

export type BlockDefinition = {
  id: string;
  blockNoteSpec?: () => unknown;
  defaultSlashKeys?: readonly string[];
  icon?: LucideIcon;
  slash?: BlockSlashDefinition | readonly BlockSlashDefinition[];
  serverValidator: string;
  readonlyRenderer: "blocknote-default" | "blocknote-spec";
  extractTextKeys: readonly string[];
  requiredCapability: "page.read" | "page.write" | "application-card.resolve";
  trusted: true;
};

const defaultBlockDefinitions: BlockDefinition[] = [
  { id: "paragraph", defaultSlashKeys: ["paragraph"], icon: Text, serverValidator: "paragraph", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "heading", defaultSlashKeys: ["heading", "heading_2", "heading_3"], icon: Type, serverValidator: "heading", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "bulletListItem", defaultSlashKeys: ["bullet_list"], icon: ListTree, serverValidator: "bulletListItem", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "numberedListItem", defaultSlashKeys: ["numbered_list"], icon: ListTree, serverValidator: "numberedListItem", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "checkListItem", defaultSlashKeys: ["check_list"], icon: ListChecks, serverValidator: "checkListItem", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "toggleListItem", defaultSlashKeys: ["toggle_list"], icon: ListTree, serverValidator: "toggleListItem", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "quote", defaultSlashKeys: ["quote"], icon: Quote, serverValidator: "quote", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "codeBlock", blockNoteSpec: knowledgeCodeBlockSpec, defaultSlashKeys: ["code_block"], icon: Braces, serverValidator: "codeBlock", readonlyRenderer: "blocknote-spec", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "divider", defaultSlashKeys: ["divider"], icon: WholeWord, serverValidator: "divider", readonlyRenderer: "blocknote-default", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "table", defaultSlashKeys: ["table"], icon: Table2, serverValidator: "table", readonlyRenderer: "blocknote-default", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "image", blockNoteSpec: knowledgeImageBlock, defaultSlashKeys: ["image"], icon: ImageIcon, serverValidator: "image", readonlyRenderer: "blocknote-spec", extractTextKeys: ["caption", "name"], requiredCapability: "page.write", trusted: true },
  { id: "video", defaultSlashKeys: ["video"], icon: Video, serverValidator: "video", readonlyRenderer: "blocknote-default", extractTextKeys: ["caption", "name"], requiredCapability: "page.write", trusted: true },
  { id: "audio", defaultSlashKeys: ["audio"], icon: AudioLines, serverValidator: "audio", readonlyRenderer: "blocknote-default", extractTextKeys: ["caption", "name"], requiredCapability: "page.write", trusted: true },
  { id: "file", defaultSlashKeys: ["file"], icon: Paperclip, serverValidator: "file", readonlyRenderer: "blocknote-default", extractTextKeys: ["caption", "name"], requiredCapability: "page.write", trusted: true },
];

const layoutBlockDefinitions: BlockDefinition[] = [
  { id: "columnList", blockNoteSpec: () => ColumnListBlock, serverValidator: "columnList", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "column", blockNoteSpec: () => ColumnBlock, serverValidator: "column", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
];

const customBlockDefinitions: BlockDefinition[] = [
  { id: "callout", blockNoteSpec: calloutBlock, slash: { title: "高亮提示块", subtext: "突出显示信息、结论或风险", aliases: ["提示", "高亮", "callout"], group: "内容", icon: AlertTriangle, block: { type: "callout" } }, serverValidator: "callout", readonlyRenderer: "blocknote-spec", extractTextKeys: ["text", "icon"], requiredCapability: "page.write", trusted: true },
  { id: "formula", blockNoteSpec: formulaBlock, slash: { title: "公式块", subtext: "使用 KaTeX 安全渲染独立公式", aliases: ["数学", "latex", "formula", "公式"], group: "内容", icon: FunctionSquare, block: { type: "formula", content: "" } }, serverValidator: "formula", readonlyRenderer: "blocknote-spec", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeTask", blockNoteSpec: knowledgeTaskBlock, slash: [
    { title: "任务", subtext: "指派成员、设置截止时间与提醒", aliases: ["待办", "任务", "task", "todo"], group: "协作", icon: CheckCircle2, block: { type: "knowledgeTask" } },
    { id: "dateReminder", title: "日期提醒", subtext: "创建带截止时间和提醒的独立任务", aliases: ["日期", "提醒", "reminder", "date"], group: "协作", icon: Bell, block: { type: "knowledgeTask", props: { title: "日期提醒" } } },
  ], serverValidator: "knowledgeTask", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgePoll", blockNoteSpec: knowledgePollBlock, slash: { title: "投票", subtext: "创建由服务端聚合统计的单选或多选投票", aliases: ["投票", "问卷", "poll", "vote"], group: "协作", icon: ListChecks, block: { type: "knowledgePoll" } }, serverValidator: "knowledgePoll", readonlyRenderer: "blocknote-spec", extractTextKeys: ["question"], requiredCapability: "page.write", trusted: true },
  { id: "button", blockNoteSpec: buttonBlock, slash: { title: "按钮", subtext: "创建可跳转的操作按钮", aliases: ["链接", "button"], group: "交互", icon: Link2, block: { type: "button" } }, serverValidator: "button", readonlyRenderer: "blocknote-spec", extractTextKeys: ["label"], requiredCapability: "page.write", trusted: true },
  { id: "bookmark", blockNoteSpec: bookmarkBlock, slash: { title: "网页书签", subtext: "添加经过服务端校验的网页卡片", aliases: ["网页", "链接", "bookmark", "url"], group: "嵌入", icon: Globe2, block: { type: "bookmark" } }, serverValidator: "bookmark", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title", "description", "siteName"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeReference", blockNoteSpec: knowledgeReferenceBlock, slash: { title: "子文档 / 知识条目", subtext: "引用另一条知识内容", aliases: ["页面", "子文档", "引用"], group: "知识库", icon: FileText, block: { type: "knowledgeReference" } }, serverValidator: "knowledgeReference", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "personCard", blockNoteSpec: personCardBlock, slash: { title: "人员卡片", subtext: "使用稳定用户 ID 引用知识库成员", aliases: ["成员", "人员", "person", "user"], group: "协作", icon: UserRound, block: { type: "personCard" } }, serverValidator: "personCard", readonlyRenderer: "blocknote-spec", extractTextKeys: ["displayName", "email"], requiredCapability: "page.write", trusted: true },
  { id: "applicationCard", blockNoteSpec: applicationCardBlock, slash: { title: "应用卡片", subtext: "关联日程、会议、群组、任务、Jira 或网页应用", aliases: ["应用", "日程", "会议", "群组", "任务", "jira", "web"], group: "嵌入", icon: CalendarDays, block: { type: "applicationCard" } }, serverValidator: "applicationCard", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "application-card.resolve", trusted: true },
  { id: "externalEmbed", blockNoteSpec: externalEmbedBlock, slash: { title: "外部视频", subtext: "嵌入白名单内的视频播放器", aliases: ["视频", "youtube", "bilibili", "嵌入"], group: "嵌入", icon: PlaySquare, block: { type: "externalEmbed" } }, serverValidator: "externalEmbed", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "syncedBlock", blockNoteSpec: syncedBlock, slash: { title: "同步块", subtext: "引用并同步另一页面中的内容块", aliases: ["同步", "sync"], group: "知识库", icon: Link2, block: { type: "syncedBlock" } }, serverValidator: "syncedBlock", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "tableOfContents", blockNoteSpec: tableOfContentsBlock, slash: { title: "页面目录", subtext: "根据 H1–H3 自动生成可跳转目录", aliases: ["目录", "toc", "outline"], group: "知识库", icon: ListTree, block: { type: "tableOfContents" } }, serverValidator: "tableOfContents", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "subpageList", blockNoteSpec: subpageListBlock, slash: { title: "子页面列表", subtext: "实时展示当前页面下有权访问的子页面", aliases: ["子页面", "子文档", "children", "subpages"], group: "知识库", icon: BookOpen, block: { type: "subpageList" } }, serverValidator: "subpageList", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "informationCollection", blockNoteSpec: informationCollectionBlock, slash: { title: "信息收集", subtext: "关联真实表单页面并收集信息", aliases: ["表单", "收集", "form", "collection"], group: "协作", icon: ClipboardList, block: { type: "informationCollection" } }, serverValidator: "informationCollection", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeActivity", blockNoteSpec: knowledgeActivityBlock, slash: { title: "知识库动态", subtext: "实时汇总发布、评论和任务动态", aliases: ["活动", "动态", "activity"], group: "知识库", icon: Activity, block: { type: "knowledgeActivity" } }, serverValidator: "knowledgeActivity", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
];

export const blockDefinitions = Object.freeze([...defaultBlockDefinitions, ...layoutBlockDefinitions, ...customBlockDefinitions]);

export function validateBlockDefinitions(items: readonly BlockDefinition[] = blockDefinitions) {
  const ids = new Set<string>();
  for (const definition of items) {
    if (!definition.id || ids.has(definition.id) || !definition.serverValidator || !definition.readonlyRenderer || !definition.extractTextKeys || !definition.requiredCapability || definition.trusted !== true) {
      throw new Error(`Invalid Block definition: ${definition.id || "<empty>"}`);
    }
    ids.add(definition.id);
  }
  return true;
}

validateBlockDefinitions();

export const blockDefinitionRegistry = Object.freeze(Object.fromEntries(blockDefinitions.map(definition => [definition.id, definition])) as Record<string, BlockDefinition>);

function createCustomBlockSpecs() {
  return Object.fromEntries(blockDefinitions.filter(definition => definition.blockNoteSpec).map(definition => {
    const spec = definition.blockNoteSpec!() as { config?: { type?: unknown } } | undefined;
    if (!spec?.config || spec.config.type !== definition.id) {
      throw new Error(`Invalid BlockNote spec for block definition: ${definition.id}`);
    }
    return [definition.id, spec];
  })) as Record<string, never>;
}

const customSpecs = createCustomBlockSpecs();

export const knowledgeDocumentSchema = BlockNoteSchema.create().extend({
  blockSpecs: customSpecs,
  inlineContentSpecs: { inlineFormula, personMention, dateMention, pageMention, blockMention },
});

const defaultIcons: Record<string, ReactElement> = Object.fromEntries(defaultBlockDefinitions.flatMap(definition => (definition.defaultSlashKeys || []).map(key => [key, createElement(definition.icon!, { size: 18 })])));

const customSlashSubmenus: Partial<Record<string, string>> = {
  button: "交互与卡片",
  bookmark: "交互与卡片",
  externalEmbed: "交互与卡片",
  applicationCard: "交互与卡片",
  knowledgeReference: "知识与协作",
  personCard: "知识与协作",
  knowledgeTask: "知识与协作",
  syncedBlock: "知识与协作",
  tableOfContents: "知识与协作",
  subpageList: "知识与协作",
  informationCollection: "知识与协作",
  knowledgeActivity: "知识与协作",
};

function customSlashMenuItems(editor: BlockNoteEditor<any, any, any>): KnowledgeSlashMenuItem[] {
  const insert = (block: Record<string, unknown>) => () => insertOrUpdateBlockForSlashMenu(editor, block as never);
  const dynamicRuntime = knowledgeDynamicBlockRuntimeByEditor.get(editor)?.runtime.current;
  const blockItems = customBlockDefinitions.flatMap(definition => {
    const definitions = definition.slash ? Array.isArray(definition.slash) ? definition.slash : [definition.slash] : [];
    return definitions.map(slash => ({ id: `block:${slash.id || definition.id}`, title: slash.title, subtext: slash.subtext, aliases: [...slash.aliases], group: slash.group, submenu: customSlashSubmenus[definition.id], icon: <slash.icon size={18} />, formulaInput: definition.id === "formula" ? { displayMode: "block" as const } : undefined, onItemClick: definition.id === "formula" ? () => undefined : insert(slash.block) }));
  });
  const pageItems = pageTypeDefinitions.filter(definition => definition.id !== "document" && definition.capabilities & pageTypeCapability.create).map(definition => ({
    id: `page:${definition.id}`, title: definition.label, subtext: definition.description, aliases: [definition.id], group: "原生应用", submenu: "原生应用", icon: <definition.icon size={18} />,
    disabledReason: dynamicRuntime?.canCreateChild ? undefined : "当前页面未连接原生应用创建服务。",
    onItemClick: () => {
      if (!dynamicRuntime?.canCreateChild) return;
      let blockID = "";
      try { blockID = editor.getTextCursorPosition().block.id; } catch { /* The slash menu can close after selection changed. */ }
      if (!blockID) return;
      void dynamicRuntime.createChildReference({
        blockID,
        parentContent: serializeDocumentBlocks(editor.document as never),
        title: `未命名${definition.label}`,
        contentType: definition.id,
        display: "embed",
      });
    },
  }));
  const inlineFormulaItem: KnowledgeSlashMenuItem = {
    id: "inline:inline-formula",
    title: "行内公式",
    subtext: "在当前段落插入 KaTeX 公式",
    aliases: ["数学", "latex", "inline formula", "行内公式"],
    group: "内容",
    icon: <FunctionSquare size={18} />,
    formulaInput: { displayMode: "inline" },
    onItemClick: () => undefined,
  };
  return [...blockItems, inlineFormulaItem, ...pageItems];
}

function localDateKey(offsetDays: number) {
  const value = new Date();
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() + offsetDays);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function validDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  return !Number.isNaN(parsed.getTime()) && localDateKeyFromDate(parsed) === value;
}

function localDateKeyFromDate(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function mentionBlockChoices(editor: BlockNoteEditor<any, any, any>, pageID: string): DefaultReactSuggestionItem[] {
  const items: DefaultReactSuggestionItem[] = [];
  const visit = (blocks: readonly any[]) => blocks.forEach(block => {
    const label = inlineContentText(block.content).trim() || `${block.type} Block`;
    const compactID = block.id.length > 16 ? `${block.id.slice(0, 8)}…${block.id.slice(-4)}` : block.id;
    items.push({
      title: `${[...label].slice(0, 80).join("")} · ${compactID}`,
      subtext: "引用当前页面中的内容块",
      aliases: [label, block.id, "block", "内容块"],
      group: "Block",
      icon: <Hash size={17} />,
      onItemClick: () => editor.insertInlineContent([{ type: "blockMention", props: { pageId: pageID, blockId: block.id } }, " "] as never, { updateSelection: true }),
    });
    if (Array.isArray(block.children)) visit(block.children);
  });
  visit(editor.document);
  return items;
}

export async function getKnowledgeMentionMenuItems(editor: BlockNoteEditor<any, any, any>, runtime: KnowledgeMentionRuntime | undefined, query: string): Promise<DefaultReactSuggestionItem[]> {
  const normalizedQuery = query.trim();
  const signal = AbortSignal.timeout(10_000);
  const [people, pages] = runtime ? await Promise.all([
    runtime.searchPeople(normalizedQuery, signal).catch(() => []),
    runtime.searchPages(normalizedQuery, signal).catch(() => []),
  ]) : [[], []];
  const peopleItems: DefaultReactSuggestionItem[] = people.slice(0, 12).map(person => ({
    title: person.displayName,
    subtext: person.email || person.userID,
    aliases: [person.displayName, person.email || "", person.userID, "人员", "成员"],
    group: "人员",
    icon: <UserRound size={17} />,
    onItemClick: () => editor.insertInlineContent([{ type: "personMention", props: { userId: person.userID } }, " "] as never, { updateSelection: true }),
  }));
  const pageItems: DefaultReactSuggestionItem[] = pages.slice(0, 12).map(page => ({
    title: page.title,
    subtext: `${page.path.map(item => item.title).join(" / ") || page.title} · ${page.contentType}`,
    aliases: [page.title, ...page.aliases, ...page.path.map(item => item.title), page.pageID, "页面", "知识条目"],
    group: "页面",
    icon: <BookOpen size={17} />,
    onItemClick: () => editor.insertInlineContent([{ type: "pageMention", props: { pageId: page.pageID } }, " "] as never, { updateSelection: true }),
  }));
  const blockItems = runtime ? filterSuggestionItems(mentionBlockChoices(editor, runtime.currentPageID), normalizedQuery).slice(0, 12) : [];
  const dates = [
    { title: `今天 · ${localDateKey(0)}`, date: localDateKey(0), aliases: ["今天", "today"] },
    { title: `明天 · ${localDateKey(1)}`, date: localDateKey(1), aliases: ["明天", "tomorrow"] },
    { title: `一周后 · ${localDateKey(7)}`, date: localDateKey(7), aliases: ["一周", "下周", "week"] },
  ];
  if (validDateKey(normalizedQuery) && !dates.some(item => item.date === normalizedQuery)) dates.unshift({ title: normalizedQuery, date: normalizedQuery, aliases: [normalizedQuery] });
  const dateItems = filterSuggestionItems(dates.map(item => ({
    title: item.title,
    subtext: "插入稳定 ISO 日期",
    aliases: [...item.aliases, item.date, "日期"],
    group: "日期",
    icon: <CalendarDays size={17} />,
    onItemClick: () => editor.insertInlineContent([{ type: "dateMention", props: { date: item.date } }, " "] as never, { updateSelection: true }),
  })), normalizedQuery);
  return [...peopleItems, ...pageItems, ...blockItems, ...dateItems];
}

export async function getKnowledgeSlashMenuItems(editor: BlockNoteEditor<any, any, any>, query: string, capabilities: {
  canUploadFiles: boolean;
  fileAccept?: { all: string; image: string; video: string; audio: string };
} = { canUploadFiles: true }): Promise<KnowledgeSlashMenuItem[]> {
  const mediaPickers = {
    image: { blockType: "image", accept: capabilities.fileAccept?.image || "image/*", subtext: "选择本地图片并直接插入" },
    video: { blockType: "video", accept: capabilities.fileAccept?.video || "video/*", subtext: "选择本地视频并直接插入" },
    audio: { blockType: "audio", accept: capabilities.fileAccept?.audio || "audio/*", subtext: "选择本地音频并直接插入" },
    file: { blockType: "file", accept: capabilities.fileAccept?.all || "*/*", subtext: "选择本地文件并直接插入" },
  } as const;
  const defaults = getDefaultSlashMenuItems(editor)
    .filter(item => defaultIcons[String(item.key)])
    .map(({ key, ...item }): KnowledgeSlashMenuItem => {
      const media = mediaPickers[String(key) as keyof typeof mediaPickers];
      return {
        ...item,
        id: `default:${String(key)}`,
        icon: defaultIcons[String(key)],
        group: item.group || "基础",
        subtext: media?.subtext || item.subtext,
        submenu: media ? "媒体与文件" : undefined,
        filePicker: media ? { blockType: media.blockType, accept: media.accept } : undefined,
        disabledReason: media && !capabilities.canUploadFiles ? "当前知识库未配置受权文件存储，无法插入媒体或文件。" : undefined,
      };
    });
  const columns = getMultiColumnSlashMenuItems(editor).map((item, index): KnowledgeSlashMenuItem => ({ ...item, id: `layout:columns-${index + 1}`, group: "布局", submenu: "布局" }));
  return arrangeKnowledgeSlashMenuItems([...defaults, ...columns, ...customSlashMenuItems(editor)], query);
}
