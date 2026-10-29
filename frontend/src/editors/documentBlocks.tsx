import { formatKnowledgeDate, kt, ktf } from "../i18n/runtime.ts";
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
  /> : <div className="bn-visual-media knowledge-image-loading" role="status">{kt("knowledge.auto.e661c55e357ba932")}</div>;
  return <div
    className={`knowledge-image-visual${cropped ? " is-cropped" : ""}`}
    style={cropped ? {
      width: block.props.previewWidth ? "100%" : "720px",
      maxWidth: "100%",
      aspectRatio: cropAspectRatio[block.props.cropAspect],
    } : undefined}
  >
    {image}
    {source && onPreview && <button type="button" className="knowledge-image-preview-button" contentEditable={false} aria-label={kt("knowledge.auto.de078ce976cebdbd")} title={kt("knowledge.auto.de078ce976cebdbd")} onClick={event => { event.preventDefault(); event.stopPropagation(); onPreview(); }}><Maximize2 size={15} /></button>}
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
      <section className="knowledge-image-preview-dialog" role="dialog" aria-modal="true" aria-label={props.block.props.name ? ktf("knowledge.auto.06806b476b2305ee", { value0: props.block.props.name }) : kt("knowledge.auto.de078ce976cebdbd")}>
        <button type="button" aria-label={kt("knowledge.auto.b097f500ba2b0c50")} title={kt("knowledge.auto.3fd47edce45b3603")} onClick={() => setPreviewOpen(false)}><X size={18} /></button>
        <KnowledgeImageVisual block={props.block} source={source} />
        {(props.block.props.name || props.block.props.caption) && <footer><strong>{props.block.props.name || kt("knowledge.auto.d24c10d37db0feea")}</strong>{props.block.props.caption && <span>{props.block.props.caption}</span>}</footer>}
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
  { tone: "info", get label() { return kt("knowledge.auto.e7028601e7da793d"); }, icon: "💡" },
  { tone: "success", get label() { return kt("knowledge.auto.053461ce86d26572"); }, icon: "✅" },
  { tone: "warning", get label() { return kt("knowledge.auto.8f29b3132ccf2182"); }, icon: "🔔" },
  { tone: "danger", get label() { return kt("knowledge.auto.a8b7a4480407ac8a"); }, icon: "⚠️" },
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
        {editor.isEditable ? <button type="button" contentEditable={false} className="knowledge-callout-tone" aria-label={ktf("knowledge.auto.b87dd6b1d665c15b", { value0: current.label, value1: next.label })} title={ktf("knowledge.auto.3ef23b7a0f9e6b4c", { value0: current.label, value1: next.label })} onClick={() => editor.updateBlock(block, { props: { tone: next.tone, icon: next.icon } })}>{current.icon}</button> : <span className="knowledge-callout-tone" role="img" aria-label={ktf("knowledge.auto.41d7b046aa34e442", { value0: current.label })}>{current.icon}</span>}
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
    emptySourcePlaceholder={kt("knowledge.auto.65c22aa67409ddef")}
    errorPreview={kt("knowledge.auto.17646aac0c7362fb")}
    sourcePlaceholder={kt("knowledge.auto.c056cf068e63539e")}
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
    emptySourcePlaceholder={kt("knowledge.auto.5447940a50500d6f")}
    errorPreview={kt("knowledge.auto.17646aac0c7362fb")}
    sourcePlaceholder={kt("knowledge.auto.c056cf068e63539e")}
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
  return `${kind === "person" ? kt("knowledge.auto.6e6d6ddbb7c1a453") : kind === "page" ? kt("knowledge.auto.452c7b10d57a86a7") : "Block"} ${compact || kt("knowledge.auto.460b3574e4bdb8ca")}`;
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
    ? { label: primaryID || kt("knowledge.auto.11758421d795b045"), detail: primaryID, available: /^\d{4}-\d{2}-\d{2}$/.test(primaryID) }
    : { label: stableMentionFallback(kind, primaryID), detail: primaryID, available: false };
  const [resolution, setResolution] = useState<MentionResolution>(fallback);
  const [runtimeRevision, setRuntimeRevision] = useState(0);
  useEffect(() => subscribeKnowledgeMentionRuntime(editor, () => setRuntimeRevision(current => current + 1)), [editor]);
  useEffect(() => {
    if (kind === "date") {
      const date = /^\d{4}-\d{2}-\d{2}$/.test(primaryID) ? new Date(`${primaryID}T00:00:00`) : null;
      setResolution(date && !Number.isNaN(date.getTime()) ? { label: formatKnowledgeDate(date, { year: "numeric", month: "short", day: "numeric", weekday: "short" }), detail: primaryID, available: true } : fallback);
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
      label: { get default() { return kt("knowledge.auto.ad1c50c9367c756d"); } }, href: { default: "" },
      appearance: { default: "primary", values: ["primary", "secondary"] as const },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => <div className="knowledge-block-button" contentEditable={false}>
      {editor.isEditable ? <>
        <input aria-label={kt("knowledge.auto.2b79301b1f55ec48")} value={block.props.label} maxLength={80} onChange={event => editor.updateBlock(block, { props: { label: event.target.value } })} />
        <input aria-label={kt("knowledge.auto.1d1f9c4bbf957733")} value={block.props.href} maxLength={2048} placeholder={kt("knowledge.auto.dce2802e4902bf82")} onChange={event => editor.updateBlock(block, { props: { href: event.target.value } })} />
      </> : <a className={`is-${block.props.appearance}`} href={block.props.href || undefined} target="_blank" rel="noreferrer">{block.props.label}</a>}
    </div>,
  },
);

const knowledgeTaskConfig = {
  type: "knowledgeTask",
  propSchema: { title: { get default() { return kt("knowledge.auto.416e65ac1701e085"); } } },
  content: "none",
} as const;

const taskStatusOptions: { value: KnowledgeTaskStatus; label: string }[] = [
  { value: "todo", get label() { return kt("knowledge.auto.999a459c3f3f2d16"); } },
  { value: "in_progress", get label() { return kt("knowledge.auto.dc9591e56d502b43"); } },
  { value: "done", get label() { return kt("knowledge.auto.f28461bb49c85647"); } },
  { value: "canceled", get label() { return kt("knowledge.auto.a37778f17c5f3ee5"); } },
];

const taskPriorityOptions: { value: KnowledgeTaskPriority; label: string }[] = [
  { value: "none", get label() { return kt("knowledge.auto.ba91dcb7c9ad1b40"); } },
  { value: "low", get label() { return kt("knowledge.auto.aa9e366f68d3d097"); } },
  { value: "medium", get label() { return kt("knowledge.auto.a567bdaa11367f26"); } },
  { value: "high", get label() { return kt("knowledge.auto.b1c27820fec23edb"); } },
  { value: "urgent", get label() { return kt("knowledge.auto.0efa477b24b1f3c7"); } },
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
    <div className="knowledge-task-chips">{task.assignee_user_ids.map(userID => <span key={userID}><UserRound size={13} />{runtime.memberName(userID)}{!disabled && <button type="button" aria-label={ktf("knowledge.auto.0e2b2799cb0b0ede", { value0: runtime.memberName(userID) })} onClick={() => void onUpdate(task.assignee_user_ids.filter(id => id !== userID))}><X size={12} /></button>}</span>)}{task.assignee_user_ids.length === 0 && <small>{kt("knowledge.auto.350c68309b7bfcd8")}</small>}</div>
    {!disabled && <details open={pickerOpen} onToggle={event => setPickerOpen(event.currentTarget.open)}><summary><UserPlus size={14} />{kt("knowledge.auto.b533e5f5dbb7192e")}</summary><div className="knowledge-task-member-picker"><input aria-label={kt("knowledge.auto.777b3dceb0fbea87")} value={query} onChange={event => setQuery(event.currentTarget.value)} placeholder={kt("knowledge.auto.44d42e02a5e4d4d1")} />{candidates.map(person => <button key={person.user_id} type="button" onClick={() => { void onUpdate([...task.assignee_user_ids, person.user_id]); setQuery(""); }}><span>{(person.display_name || "?").slice(0, 1)}</span><strong>{person.display_name || person.user_id}<small>{person.email || person.user_id}</small></strong></button>)}{query && candidates.length === 0 && <small>{kt("knowledge.auto.15f6fbba6fd1958d")}</small>}</div></details>}
  </div>;
}

function KnowledgeTaskBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof knowledgeTaskConfig>) {
  const runtime = useKnowledgeTaskRuntime(editor);
  const task = runtime?.taskForBlock(block.id);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  useEffect(() => {
    if (!runtime?.ready || !runtime.canCreate || task || busy) return;
    setBusy(true); setError("");
    void runtime.ensureTask(block.id, block.props.title).catch(failure => setError(failure instanceof Error ? failure.message : kt("knowledge.auto.2197e510663b8ad1"))).finally(() => setBusy(false));
  }, [block.id, block.props.title, busy, runtime, task]);
  const update = async (patch: Parameters<KnowledgeTaskRuntime["updateTask"]>[1]) => {
    if (!runtime || !task || busy) return;
    setBusy(true); setError("");
    try { await runtime.updateTask(task, patch); }
    catch (failure) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.d0f09f906f2ca6d5")); }
    finally { setBusy(false); }
  };
  const canManage = Boolean(task && runtime?.canManage(task));
  const canUpdateStatus = Boolean(task && runtime?.canUpdateStatus(task));
  const title = task?.title || block.props.title;
  return <article className={`knowledge-task-block${task?.status === "done" ? " is-done" : ""}`} contentEditable={false} data-task-status={task?.status || "pending"}>
    <header>
      <button type="button" className="knowledge-task-check" aria-label={task?.status === "done" ? kt("knowledge.auto.1a7d93a62d9546d1") : kt("knowledge.auto.56be09301c395913")} disabled={!task || !canUpdateStatus || busy} onClick={() => void update({ status: task?.status === "done" ? "todo" : "done" })}>{task?.status === "done" ? <CheckCircle2 size={20} /> : busy ? <LoaderCircle className="knowledge-spin" size={20} /> : <Circle size={20} />}</button>
      <div>{editor.isEditable ? <input className="knowledge-task-title" aria-label={kt("knowledge.auto.f118de64d6ec8f5b")} value={block.props.title} maxLength={512} onChange={event => editor.updateBlock(block, { props: { title: event.currentTarget.value } })} onBlur={event => { const next = event.currentTarget.value.trim() || kt("knowledge.auto.416e65ac1701e085"); if (next !== event.currentTarget.value) editor.updateBlock(block, { props: { title: next } }); if (task && canManage && next !== task.title) void update({ title: next }); }} /> : <strong>{title}</strong>}<small>{task ? ktf("knowledge.auto.4bf633822d338aaa", { value0: taskStatusLabel(task.status), value1: task.revision }) : runtime?.ready ? kt("knowledge.auto.0ae14aa009ba36a0") : kt("knowledge.auto.801012d91506bace")}</small></div>
      {task && <Select aria-label={kt("knowledge.auto.f850d949259b7c23")} value={task.status} disabled={!canUpdateStatus || busy} onChange={event => void update({ status: event.currentTarget.value as KnowledgeTaskStatus })}>{taskStatusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>}
    </header>
    {task && <div className="knowledge-task-fields">
      <TaskAssigneePicker task={task} runtime={runtime!} disabled={!canManage || busy} onUpdate={assignee_user_ids => update({ assignee_user_ids })} />
      <label><Flag size={14} /><span>{kt("knowledge.auto.565d64601d4d174f")}</span><Select aria-label={kt("knowledge.auto.a10abc806ce48092")} value={task.priority} disabled={!canManage || busy} onChange={event => void update({ priority: event.currentTarget.value as KnowledgeTaskPriority })}>{taskPriorityOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></label>
      <label><CalendarDays size={14} /><span>{kt("knowledge.auto.fb37c61898d5a2c7")}</span><input key={`due-${task.due_at || "empty"}`} aria-label={kt("knowledge.auto.e65397c31ea2c569")} type="datetime-local" defaultValue={taskDateTimeInputValue(task.due_at)} disabled={!canManage || busy} onBlur={event => { const due_at = taskDateTimeISO(event.currentTarget.value); void update(due_at ? { due_at } : { due_at: undefined, reminder_at: undefined }); }} /></label>
      <label><Bell size={14} /><span>{kt("knowledge.auto.8f29b3132ccf2182")}</span><input key={`reminder-${task.reminder_at || "empty"}`} aria-label={kt("knowledge.auto.c462af2fd1c28def")} type="datetime-local" defaultValue={taskDateTimeInputValue(task.reminder_at)} max={taskDateTimeInputValue(task.due_at)} disabled={!canManage || busy || !task.due_at} onBlur={event => void update({ reminder_at: taskDateTimeISO(event.currentTarget.value) })} /></label>
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
  propSchema: { question: { get default() { return kt("knowledge.auto.dfa0249f7b131b40"); } } },
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
    void runtime.ensurePoll(block.id, block.props.question).catch(failure => setError(failure instanceof Error ? failure.message : kt("knowledge.auto.4fd4ade0cac1716b"))).finally(() => setBusy(false));
  }, [block.id, block.props.question, busy, poll, runtime]);

  const update = async (patch: Parameters<KnowledgePollRuntime["updatePoll"]>[1]) => {
    if (!runtime || !poll || busy) return;
    setBusy(true); setError("");
    try { await runtime.updatePoll(poll, patch); }
    catch (failure) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.881dd8a76efa52b1")); }
    finally { setBusy(false); }
  };
  const vote = async (optionID: string) => {
    if (!runtime || !poll || busy || poll.poll.status !== "open") return;
    const selected = new Set(poll.selected_option_ids);
    if (poll.poll.multiple) selected.has(optionID) ? selected.delete(optionID) : selected.add(optionID);
    else { selected.clear(); selected.add(optionID); }
    setBusy(true); setError("");
    try { await runtime.votePoll(poll, [...selected]); }
    catch (failure) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.75452c6c1046d328")); }
    finally { setBusy(false); }
  };
  const canManage = Boolean(poll && runtime?.canManage(poll));
  const structureLocked = Boolean(poll && poll.total_voters > 0);
  const commitQuestion = () => {
    if (!poll || !canManage || structureLocked) return;
    const question = questionDraft.trim() || kt("knowledge.auto.dfa0249f7b131b40");
    setQuestionDraft(question);
    editor.updateBlock(block, { props: { question } });
    if (question !== poll.poll.question) void update({ question });
  };
  const commitOption = (index: number) => {
    if (!poll || !canManage || structureLocked) return;
    const label = optionDrafts[index]?.trim() || ktf("knowledge.auto.2b387c1d00165616", { value0: index + 1 });
    const options = poll.poll.options.map((option, optionIndex) => ({ id: option.id, label: optionIndex === index ? label : optionDrafts[optionIndex]?.trim() || option.label }));
    if (options[index]?.label !== optionDrafts[index]) setOptionDrafts(current => current.map((value, optionIndex) => optionIndex === index ? label : value));
    if (options.some((option, optionIndex) => option.label !== poll.poll.options[optionIndex]?.label)) void update({ options });
  };

  return <article className="knowledge-poll-block" contentEditable={false} data-poll-status={poll?.poll.status || "pending"}>
    <header>
      <span className="knowledge-poll-icon" aria-hidden="true"><ListChecks size={19} /></span>
      <div>
        {editor.isEditable && canManage && !structureLocked
          ? <input className="knowledge-poll-question" aria-label={kt("knowledge.auto.9717eea92267e626")} value={questionDraft} maxLength={1024} onChange={event => setQuestionDraft(event.currentTarget.value)} onBlur={commitQuestion} />
          : <strong>{poll?.poll.question || block.props.question}</strong>}
        <small>{poll ? ktf("knowledge.auto.497870592146f290", { value0: poll.poll.multiple ? kt("knowledge.auto.461e085d5ca266fb") : kt("knowledge.auto.4214b9af7ae0cdcc"), value1: poll.total_voters, value2: poll.poll.revision }) : runtime?.ready ? kt("knowledge.auto.afbf1810a59cbbe5") : kt("knowledge.auto.28e9eb9bffb6cc2d")}</small>
      </div>
      {poll && canManage && <button type="button" className="knowledge-poll-status" disabled={busy} onClick={() => void update({ status: poll.poll.status === "open" ? "closed" : "open" })}>{poll.poll.status === "open" ? kt("knowledge.auto.47cde5d25f48e0f1") : kt("knowledge.auto.157d24e1568aa10b")}</button>}
    </header>
    {poll && <div className="knowledge-poll-options" role={poll.poll.multiple ? "group" : "radiogroup"} aria-label={poll.poll.question}>
      {poll.poll.options.map((option, index) => {
        const result = poll.results.find(item => item.option_id === option.id);
        const votes = result?.votes || 0;
        const checked = poll.selected_option_ids.includes(option.id);
        return <div key={option.id} className={`knowledge-poll-option${checked ? " is-selected" : ""}`}>
          <div className="knowledge-poll-option-main">
            <button type="button" className="knowledge-poll-vote" role={poll.poll.multiple ? "checkbox" : "radio"} aria-checked={checked} aria-label={ktf("knowledge.auto.8ddfacf922016fcf", { value0: option.label })} disabled={busy || poll.poll.status !== "open"} onClick={() => void vote(option.id)}><span className="knowledge-poll-choice">{checked ? <Check size={14} /> : null}</span></button>
            <span className="knowledge-poll-label">{editor.isEditable && canManage && !structureLocked ? <input aria-label={ktf("knowledge.auto.2885573d6e043243", { value0: index + 1 })} value={optionDrafts[index] ?? option.label} maxLength={256} onChange={event => { const value = event.currentTarget.value; setOptionDrafts(current => current.map((draft, optionIndex) => optionIndex === index ? value : draft)); }} onBlur={() => commitOption(index)} /> : <button type="button" disabled={busy || poll.poll.status !== "open"} onClick={() => void vote(option.id)}>{option.label}</button>}</span>
            <strong>{votes} {kt("knowledge.auto.f7f6ebe84bfee267")}</strong><small>{pollPercentage(votes, poll.total_voters)}%</small>
          </div>
          <span className="knowledge-poll-bar" aria-hidden="true"><i style={{ width: `${pollPercentage(votes, poll.total_voters)}%` }} /></span>
          {editor.isEditable && canManage && !structureLocked && poll.poll.options.length > 2 && <button type="button" className="knowledge-poll-remove" aria-label={ktf("knowledge.auto.cd4eea099aebb03e", { value0: option.label })} disabled={busy} onClick={() => void update({ options: poll.poll.options.filter(item => item.id !== option.id) })}><X size={14} /></button>}
        </div>;
      })}
      {editor.isEditable && canManage && !structureLocked && <div className="knowledge-poll-config">
        <button type="button" disabled={busy || poll.poll.options.length >= 12} onClick={() => void update({ options: [...poll.poll.options, { label: ktf("knowledge.auto.2b387c1d00165616", { value0: poll.poll.options.length + 1 }) }] })}>{kt("knowledge.auto.63d251d09b5dd46c")}</button>
        <label><input type="checkbox" checked={poll.poll.multiple} disabled={busy} onChange={event => void update({ multiple: event.currentTarget.checked })} />{kt("knowledge.auto.1523dab0bf07e14d")}</label>
      </div>}
      {structureLocked && canManage && <p className="knowledge-poll-lock">{kt("knowledge.auto.4b3fe17c051ce40f")}</p>}
    </div>}
    {busy && <p className="knowledge-poll-progress"><LoaderCircle className="knowledge-spin" size={14} />{kt("knowledge.auto.08062316a0be2eab")}</p>}
    {error && <p role="alert" className="knowledge-task-error">{error}</p>}
  </article>;
}

const knowledgePollBlock = createReactBlockSpec(knowledgePollConfig, {
  render: KnowledgePollBlockView,
  toExternalHTML: ({ block }) => <div data-knowledge-poll="true">{kt("knowledge.auto.34817e6276b6c81a")}{block.props.question}</div>,
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
    reason: kt("knowledge.auto.8db4e7a3b9483665"),
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
    title={invalid ? ktf("knowledge.auto.ce2048a5c77ff54c", { value0: label }) : undefined}
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
  propSchema: { url: { default: "" }, title: { get default() { return kt("knowledge.auto.fc5afe46eb8e2a7f"); } }, description: { default: "" }, siteName: { default: "" } },
  content: "none",
} as const;

function BookmarkBlockView({ block, editor }: ReactCustomBlockRenderProps<typeof bookmarkBlockConfig>) {
  const href = safeBookmarkURL(block.props.url);
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  return <article className="knowledge-block-card knowledge-block-bookmark" contentEditable={false}>
    <span className="knowledge-block-card-icon"><Globe2 size={19} /></span>
    <div className="knowledge-block-card-copy"><strong>{block.props.title || kt("knowledge.auto.19835b9c457338fe")}</strong>{block.props.description && <p>{block.props.description}</p>}<small>{block.props.siteName || (href ? new URL(href).hostname : kt("knowledge.auto.08f832ded8f086e4"))}</small></div>
    {href && <a className="knowledge-block-card-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={ktf("knowledge.auto.1770b7f2f22f0847", { value0: block.props.title || href })}><ExternalLink size={16} /></a>}
    {editor.isEditable && <div className="knowledge-block-card-fields">
      <CardInput label={kt("knowledge.auto.3cbfdb49f05dc8de")} value={block.props.url} maximum={2048} placeholder="https://…" normalize={value => value.trim() === "" ? "" : safeBookmarkURL(value)} onCommit={url => update({ url })} />
      <CardInput label={kt("knowledge.auto.757cdef371d9b573")} value={block.props.title} maximum={256} onCommit={title => update({ title })} />
      <CardInput label={kt("knowledge.auto.7836bf6ed6bd7adc")} value={block.props.description} maximum={1024} onCommit={description => update({ description })} />
      <CardInput label={kt("knowledge.auto.ecfe8ab860f6e547")} value={block.props.siteName} maximum={128} onCommit={siteName => update({ siteName })} />
    </div>}
  </article>;
}

const bookmarkBlock = createReactBlockSpec(bookmarkBlockConfig, { render: BookmarkBlockView });

const personCardConfig = {
  type: "personCard",
  propSchema: { userId: { default: "" }, displayName: { get default() { return kt("knowledge.auto.0a198bb2ded27d7e"); } }, email: { default: "" } },
  content: "none",
} as const;

function PersonCardView({ block, editor }: ReactCustomBlockRenderProps<typeof personCardConfig>) {
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  const initial = [...(block.props.displayName || block.props.email || block.props.userId || "?")][0]?.toLocaleUpperCase() || "?";
  return <article className="knowledge-block-card knowledge-block-person" contentEditable={false}>
    <span className="knowledge-person-avatar" aria-hidden="true">{initial}</span>
    <div className="knowledge-block-card-copy"><strong>{block.props.displayName || kt("knowledge.auto.0a198bb2ded27d7e")}</strong><p>{block.props.email || kt("knowledge.auto.b3a81cc3240930c6")}</p><small>{block.props.userId || kt("knowledge.auto.f5c2d9726fc51611")}</small></div>
    <UserRound className="knowledge-block-card-mark" size={17} aria-hidden="true" />
    {editor.isEditable && <div className="knowledge-block-card-fields">
      <CardInput label={kt("knowledge.auto.3d5a4a529722471d")} value={block.props.userId} maximum={255} placeholder={kt("knowledge.auto.15479ea7779a264a")} normalize={value => { const next = value.trim(); return /[\u0000-\u001f\u007f-\u009f]/.test(next) ? null : next; }} onCommit={userId => update({ userId })} />
      <CardInput label={kt("knowledge.auto.9614417e05ac02c1")} value={block.props.displayName} maximum={256} onCommit={displayName => update({ displayName })} />
      <CardInput label={kt("knowledge.auto.acc9534b03fc5fb4")} value={block.props.email} maximum={320} placeholder="name@example.com" normalize={value => { const next = value.trim(); return next === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next) ? next : null; }} onCommit={email => update({ email })} />
    </div>}
  </article>;
}

const personCardBlock = createReactBlockSpec(personCardConfig, { render: PersonCardView });

const applicationCardKinds: { id: KnowledgeApplicationCardKind; label: string }[] = [
  { id: "calendar_event", get label() { return kt("knowledge.auto.a14f23af70166ec2"); } },
  { id: "meeting", get label() { return kt("knowledge.auto.63d30f1a037d0771"); } },
  { id: "group", get label() { return kt("knowledge.auto.f3f8bcf3f57de41f"); } },
  { id: "task", get label() { return kt("knowledge.auto.5253040db8643c85"); } },
  { id: "jira", label: "Jira" },
  { id: "web", get label() { return kt("knowledge.auto.bc84ce60940f1049"); } },
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
      .catch(failure => { if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.73bef168ba0c129b")); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [block.props.kind, block.props.provider, block.props.resourceId, referenceReady, refresh, runtime]);
  const update = (props: Partial<typeof block.props>) => editor.updateBlock(block, { props });
  const KindIcon = applicationCardIcon(block.props.kind);
  const kindLabel = applicationCardKinds.find(item => item.id === block.props.kind)?.label || kt("knowledge.auto.63c73c4730f4473e");
  const href = card?.url && safeBookmarkURL(card.url);
  return <article className="knowledge-block-card knowledge-block-application" contentEditable={false}>
    <span className="knowledge-block-card-icon"><KindIcon size={19} /></span>
    <div className="knowledge-block-card-copy">
      <strong>{loading ? kt("knowledge.auto.40e4b14ed35fe7bc") : card?.title || (referenceReady ? ktf("knowledge.auto.82ebc3d6c0036708", { value0: kindLabel }) : ktf("knowledge.auto.ed91deb7fcd4d228", { value0: kindLabel }))}</strong>
      <p>{card?.subtitle || error || (!runtime?.resolveApplicationCard ? kt("knowledge.auto.e9bebdfccdb01707") : referenceReady ? kt("knowledge.auto.645b2e57250dcbd3") : kt("knowledge.auto.cbef336bf4166677"))}</p>
      <small>{card?.status ? `${card.status}${card.updated_at ? ` · ${formatKnowledgeDate(card.updated_at)}` : ""}` : referenceReady ? `${block.props.provider} · ${block.props.resourceId}` : kt("knowledge.auto.e335cfeff83bacd2")}</small>
    </div>
    <div className="knowledge-block-application-actions">
      {loading ? <LoaderCircle className="knowledge-spin" size={16} /> : referenceReady && runtime?.resolveApplicationCard ? <button type="button" aria-label={kt("knowledge.auto.82e1461e5b02523a")} title={kt("knowledge.auto.aee88743413144a2")} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={15} /></button> : null}
      {href && <a className="knowledge-block-card-open" href={href} target="_blank" rel="noopener noreferrer" aria-label={ktf("knowledge.auto.db63215f052da897", { value0: card?.title || kindLabel })}><ExternalLink size={16} /></a>}
    </div>
    {editor.isEditable && <div className="knowledge-block-card-fields knowledge-block-application-fields">
      <Select aria-label={kt("knowledge.auto.e64b3b37abb61225")} value={block.props.kind} onChange={event => {
        const kind = event.currentTarget.value as KnowledgeApplicationCardKind;
        update({ kind, provider: kind === "web" && !block.props.provider.trim() ? "web" : kind !== "web" && block.props.provider === "web" ? "" : block.props.provider });
      }}>{applicationCardKinds.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</Select>
      <CardInput label={kt("knowledge.auto.d1806bda27f311ee")} value={block.props.provider} maximum={64} placeholder={kt("knowledge.auto.9a290f46f55d0816")} normalize={value => { const next = value.trim(); return next === "" || /^[a-z0-9][a-z0-9_-]{0,63}$/.test(next) ? next : null; }} onCommit={provider => update({ provider })} />
      <CardInput label={kt("knowledge.auto.1a55e1eacf30167a")} value={block.props.resourceId} maximum={2048} placeholder={kt("knowledge.auto.ed8da0c3eb7b451d")} normalize={value => { const next = value.trim(); return /[\u0000-\u001f\u007f-\u009f]/.test(next) ? null : next; }} onCommit={resourceId => update({ resourceId })} />
    </div>}
  </article>;
}

const applicationCardBlock = createReactBlockSpec(applicationCardConfig, {
  render: ApplicationCardView,
  toExternalHTML: ({ block }) => <div data-knowledge-application-card={block.props.kind}>{block.props.provider}:{block.props.resourceId}</div>,
});

const externalEmbedConfig = {
  type: "externalEmbed",
  propSchema: { provider: { default: "youtube", values: ["youtube", "bilibili"] as const }, url: { default: "" }, title: { get default() { return kt("knowledge.auto.b8b6f16538c3c33d"); } } },
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
      <span><PlaySquare size={17} />{block.props.title || kt("knowledge.auto.b8b6f16538c3c33d")}</span>
      <div className="knowledge-block-embed-actions">
        <small>{block.props.provider === "youtube" ? kt("knowledge.auto.5631501881c1ded4") : kt("knowledge.auto.31a0abd7a03ecac1")}</small>
        {platformURL && <a style={{ color: "inherit", display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8 }} href={platformURL} target="_blank" rel="noopener noreferrer" aria-label={ktf("knowledge.auto.bd59676c2babe22a", { value0: block.props.provider === "youtube" ? "YouTube" : kt("knowledge.auto.cfc3d445066f6e83") })}><ExternalLink size={14} />{kt("knowledge.auto.ef4ee47c18b9703e")}</a>}
      </div>
    </header>
    {localFallback && platformURL ? <a className="knowledge-block-embed-fallback" href={platformURL} target="_blank" rel="noopener noreferrer" aria-label={kt("knowledge.auto.71034b2f01f58512")}>
      <img style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .48 }} src={localFallback.poster} alt="" />
      <span><PlaySquare size={34} /><strong>{kt("knowledge.auto.2c3e7797803a6918")}</strong><small>{localFallback.reason}</small></span>
    </a> : playerSource ? <iframe
      src={playerSource}
      title={block.props.title || kt("knowledge.auto.62245270a89f1640")}
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    /> : <div className="knowledge-block-embed-empty"><PlaySquare size={30} /><span>{kt("knowledge.auto.565dc6cb12c2f4ea")}</span></div>}
    {editor.isEditable && <figcaption>
      <label>{kt("knowledge.auto.ec309ab207ef7fa3")}<Select aria-label={kt("knowledge.auto.7ecb1213f0fdde2c")} value={block.props.provider} onChange={event => update({ provider: event.currentTarget.value as typeof block.props.provider, url: "" })}><option value="youtube">YouTube</option><option value="bilibili">{kt("knowledge.auto.cfc3d445066f6e83")}</option></Select></label>
      <CardInput label={kt("knowledge.auto.8ff10f58045cb3d3")} value={block.props.url} maximum={2048} placeholder={block.props.provider === "youtube" ? kt("knowledge.auto.b6531b7dfab82694") : kt("knowledge.auto.ac3b0fa95502c7d8")} normalize={value => value.trim() === "" ? "" : canonicalExternalEmbedURL(block.props.provider, value)} onCommit={url => update({ url })} />
      <CardInput label={kt("knowledge.auto.1c415a6a0078f9c0")} value={block.props.title} maximum={256} onCommit={title => update({ title })} />
    </figcaption>}
  </figure>;
}

const externalEmbedBlock = createReactBlockSpec(externalEmbedConfig, { render: ExternalEmbedView });

const knowledgeReferenceConfig = {
  type: "knowledgeReference",
  propSchema: {
    targetPageId: { default: "" }, title: { get default() { return kt("knowledge.auto.6df69025e1c498fc"); } },
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
    void runtime.searchPages(query, abort.signal).then(items => { if (!abort.signal.aborted) setPages(items.filter(page => page.pageID !== runtime.currentPageID)); }).catch(() => { if (!abort.signal.aborted) setFailure(kt("knowledge.auto.a78d1ee240cade06")); }).finally(() => { if (!abort.signal.aborted) setBusy(false); });
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
    if (!runtime || !block.props.targetPageId) { setFailure(kt("knowledge.auto.52d5b234b30c2548")); return; }
    setBusy(true); setFailure("");
    try {
      const items = await runtime.listPageVersions(block.props.targetPageId, AbortSignal.timeout(10_000));
      setVersions(items);
      if (!items[0]) { setFailure(kt("knowledge.auto.1eaa915e5f0311ea")); return; }
      update({ referenceMode: "fixed", targetVersion: items[0].version, embeddedEdit: false });
    } catch { setFailure(kt("knowledge.auto.cd151c8ceee4f97c")); }
    finally { setBusy(false); }
  };
  const unresolved = !block.props.targetPageId;
  return <article className={`knowledge-block-reference${block.props.display === "embed" ? " is-embed" : " is-card"}`} contentEditable={false}>
    {unresolved ? <div className="knowledge-reference-empty"><span className="knowledge-block-reference-icon"><BookOpen size={18} /></span><div><strong>{kt("knowledge.auto.1a8b7cfcf27e0caa")}</strong><small>{kt("knowledge.auto.e5b51517fee07062")}</small></div></div> : runtime?.renderReference({
      blockID: block.id, targetPageID: block.props.targetPageId, title: block.props.title, contentType: block.props.targetType as KnowledgePageContentType,
      display: block.props.display, referenceMode: block.props.referenceMode, targetVersion: block.props.targetVersion, embeddedEdit: block.props.embeddedEdit,
    }) || <div className="knowledge-reference-empty"><span className="knowledge-block-reference-icon"><BookOpen size={18} /></span><div><strong>{block.props.title}</strong><small>{block.props.targetType} · {block.props.referenceMode === "fixed" ? ktf("knowledge.auto.4cf17f7f064e0413", { value0: block.props.targetVersion }) : kt("knowledge.auto.0830515fbec6fab4")}</small></div></div>}
    {editor.isEditable && <div className="knowledge-block-reference-fields">
      <button type="button" onClick={() => setPickerOpen(value => !value)}><Search size={14} />{unresolved ? kt("knowledge.auto.a84927a698321ed4") : kt("knowledge.auto.91d8266c29904aa5")}</button>
      {!unresolved && <><Select aria-label={kt("knowledge.auto.281ae53a449bad60")} value={block.props.display} onChange={event => { const display = event.target.value as "card" | "embed"; update({ display, embeddedEdit: display === "embed" && block.props.referenceMode === "live" && block.props.embeddedEdit }); }}><option value="card">{kt("knowledge.auto.fb5640f8e12e3337")}</option><option value="embed">{kt("knowledge.auto.975f9da19eee1b16")}</option></Select>
        <Select aria-label={kt("knowledge.auto.a18f1f9062b1279f")} value={block.props.referenceMode} onChange={event => void setReferenceMode(event.target.value as "live" | "fixed")}><option value="live">{kt("knowledge.auto.0830515fbec6fab4")}</option><option value="fixed">{kt("knowledge.auto.70198e08ddebe7e4")}</option></Select>
        {block.props.referenceMode === "fixed" && <Select aria-label={kt("knowledge.auto.70198e08ddebe7e4")} value={block.props.targetVersion} onChange={event => update({ targetVersion: Number(event.target.value) })}>{versions.map(version => <option key={version.version} value={version.version}>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{version.version}</option>)}</Select>}
        {block.props.display === "embed" && block.props.referenceMode === "live" && <label><input type="checkbox" checked={block.props.embeddedEdit} onChange={event => update({ embeddedEdit: event.target.checked })} />{kt("knowledge.auto.b0e4fc1299cd721d")}</label>}</>}
    </div>}
    {pickerOpen && <div className="knowledge-reference-picker" role="dialog" aria-label={kt("knowledge.auto.d670e0d67efecaf7")}>
      <label><Search size={14} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={kt("knowledge.auto.02e240d46269080f")} /></label>
      {busy && <p><LoaderCircle className="knowledge-spin" size={14} />{kt("knowledge.auto.21bd738e0d7191a7")}</p>}
      {!busy && pages.length === 0 && <p>{kt("knowledge.auto.0df83fe133f63354")}</p>}
      <div>{pages.map(page => <button type="button" key={page.pageID} onClick={() => selectPage(page)}><FileText size={15} /><span><strong>{page.title}</strong><small>{pageTypeDefinitions.find(item => item.id === page.contentType)?.label || page.contentType}</small></span></button>)}</div>
      <button type="button" onClick={() => setPickerOpen(false)}>{kt("knowledge.auto.3fd47edce45b3603")}</button>
    </div>}
    {failure && <p className="knowledge-reference-error" role="alert">{failure}</p>}
  </article>;
}

const knowledgeReferenceBlock = createReactBlockSpec(knowledgeReferenceConfig, { render: KnowledgeReferenceBlockView });

const syncedBlock = createReactBlockSpec(
  {
    type: "syncedBlock",
    propSchema: { targetPageId: { default: "" }, targetBlockId: { default: "" }, title: { get default() { return kt("knowledge.auto.4f35c4a2d26f6306"); } } },
    content: "none",
  },
  {
    render: ({ block, editor }) => <article className="knowledge-block-synced" contentEditable={false}>
      <Link2 size={17} /><div><strong>{block.props.title}</strong><small>{block.props.targetPageId && block.props.targetBlockId ? `${block.props.targetPageId} / ${block.props.targetBlockId}` : kt("knowledge.auto.d65c0051f3903ee3")}</small></div>
      {editor.isEditable && <div><input aria-label={kt("knowledge.auto.d73a16a52f7e0e79")} value={block.props.targetPageId} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.target.value } })} /><input aria-label={kt("knowledge.auto.b9ed2d868db62252")} value={block.props.targetBlockId} placeholder="Block ID" onChange={event => editor.updateBlock(block, { props: { targetBlockId: event.target.value } })} /></div>}
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
  return <nav className="knowledge-block-toc" aria-label={kt("knowledge.auto.af0ae3351923fc5d")} contentEditable={false}>
    <header><strong>{kt("knowledge.auto.52daa71ebc310581")}</strong>{editor.isEditable && <label>{kt("knowledge.auto.ab033612a2daa62e")}<Select aria-label={kt("knowledge.auto.e6b251d0f03f11c8")} value={block.props.maxDepth} onChange={event => editor.updateBlock(block, { props: { maxDepth: Number(event.target.value) as 1 | 2 | 3 } })}><option value={1}>H1</option><option value={2}>H1–H2</option><option value={3}>H1–H3</option></Select></label>}</header>
    {headings.length ? <ol>{headings.map(heading => <li key={heading.id} data-level={heading.level}><button type="button" onClick={() => jumpTo(heading.id)}>{heading.text}</button></li>)}</ol> : <p>{kt("knowledge.auto.0502b2eadbb3300a")}</p>}
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
      if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.5436e478223e431e"));
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [block.props.maxItems, refresh, runtime]);
  return <section className="knowledge-block-subpages" contentEditable={false}>
    <header><span><BookOpen size={16} /><strong>{kt("knowledge.auto.9c3b27c3f2a2680d")}</strong><small>{pages.length} {kt("knowledge.auto.49ccde43a1549791")}</small></span><span>{editor.isEditable && <label>{kt("knowledge.auto.4e1449e7d5e50593")}<Select aria-label={kt("knowledge.auto.04fccd9f77e1a1bc")} value={block.props.maxItems} onChange={event => editor.updateBlock(block, { props: { maxItems: Number(event.currentTarget.value) as 5 | 10 | 20 | 50 } })}><option value={5}>{kt("knowledge.auto.c186f5e9c01cd361")}</option><option value={10}>{kt("knowledge.auto.98bb26f244759dd5")}</option><option value={20}>{kt("knowledge.auto.20427486b61ff7c3")}</option><option value={50}>{kt("knowledge.auto.d1528d109cb07aa6")}</option></Select></label>}<button type="button" aria-label={kt("knowledge.auto.7689fe0e740bcfb7")} title={kt("knowledge.auto.7689fe0e740bcfb7")} disabled={!runtime || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw className={loading ? "knowledge-spin" : undefined} size={14} /></button></span></header>
    {!runtime ? <p>{kt("knowledge.auto.4fa465f1198b62af")}</p> : error ? <p role="alert">{error}</p> : loading && pages.length === 0 ? <p>{kt("knowledge.auto.41423bf6485f1f55")}</p> : pages.length === 0 ? <p>{kt("knowledge.auto.88ad858a77afa691")}</p> : <ol>{pages.map(page => <li key={page.pageID}><button type="button" onClick={() => runtime.openPage(page.pageID)}><FileText size={15} /><span><strong>{page.title}</strong><small>{page.contentType}</small></span><ChevronRight size={14} /></button></li>)}</ol>}
  </section>;
}

const subpageListBlock = createReactBlockSpec(subpageListConfig, { render: SubpageListView });

const informationCollectionConfig = {
  type: "informationCollection",
  propSchema: { targetPageId: { default: "" }, title: { get default() { return kt("knowledge.auto.642e311b86088b2d"); } } },
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
    <span><ClipboardList size={20} /></span><div><strong>{block.props.title || kt("knowledge.auto.642e311b86088b2d")}</strong><small>{target ? ktf("knowledge.auto.ced232fc05d0da87", { value0: target.title }) : block.props.targetPageId && resolved ? kt("knowledge.auto.bcdf2a9dd897e627") : kt("knowledge.auto.e2e87920d426690a")}</small></div>
    {target && <button type="button" onClick={() => runtime?.openPage(target.pageID)}>{kt("knowledge.auto.15b36c8164c0d6ea")}<ChevronRight size={14} /></button>}
    {editor.isEditable && <div className="knowledge-block-collection-fields"><input aria-label={kt("knowledge.auto.c6b37e15cf0b6fe6")} maxLength={256} value={block.props.title} onChange={event => editor.updateBlock(block, { props: { title: event.currentTarget.value } })} /><input aria-label={kt("knowledge.auto.5a24ac851edd782b")} maxLength={128} value={block.props.targetPageId} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.currentTarget.value.trim() } })} /></div>}
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
    void runtime.listPageActivity(block.props.maxItems, abort.signal).then(value => { if (!abort.signal.aborted) setItems(value); }, failure => { if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.b8780cdbe3bed916")); }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [block.props.maxItems, refresh, runtime]);
  return <section className="knowledge-block-activity" contentEditable={false}><header><span><Activity size={16} /><strong>{kt("knowledge.auto.014fef237bb8a1d9")}</strong></span><span>{editor.isEditable && <Select aria-label={kt("knowledge.auto.73b7d434c98c6c44")} value={block.props.maxItems} onChange={event => editor.updateBlock(block, { props: { maxItems: Number(event.currentTarget.value) as 5 | 10 | 20 } })}><option value={5}>{kt("knowledge.auto.2ce52ff2dd5d0cd6")}</option><option value={10}>{kt("knowledge.auto.3c8770d805c1d12e")}</option><option value={20}>{kt("knowledge.auto.a288d84117e7b4dc")}</option></Select>}<button type="button" aria-label={kt("knowledge.auto.87de3e0c2f526c4b")} disabled={!runtime || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw className={loading ? "knowledge-spin" : undefined} size={14} /></button></span></header>
    {!runtime ? <p>{kt("knowledge.auto.d3d4f54aff20ab5c")}</p> : error ? <p role="alert">{error}</p> : items.length === 0 ? <p>{kt("knowledge.auto.7eb3fd6a2e302dac")}</p> : <ol>{items.map(item => <li key={item.id}><Activity size={13} /><span><strong>{item.title}</strong><small>{formatKnowledgeDate(item.at)} · {item.detail}</small></span></li>)}</ol>}
  </section>;
}

const knowledgeActivityBlock = createReactBlockSpec(knowledgeActivityConfig, { render: KnowledgeActivityView });

export const knowledgeCodeLanguages = {
  text: { get name() { return kt("knowledge.auto.f9124b40e8ccbeab"); }, aliases: ["none", "plaintext", "txt"] },
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
          languageSelect.setAttribute("aria-label", kt("knowledge.auto.18c5619717ebe452"));
          languageControl.classList.add("knowledge-code-language");
          toolbar.appendChild(languageControl);
        }

        const actions = document.createElement("div");
        actions.className = "knowledge-code-actions";
        const wrapButton = document.createElement("button");
        wrapButton.type = "button";
        wrapButton.textContent = kt("knowledge.auto.bd609a8e2d40f3ef");
        wrapButton.title = kt("knowledge.auto.7798594d5c0be695");
        wrapButton.setAttribute("aria-label", kt("knowledge.auto.5378ad34f805bd16"));
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
        copyButton.textContent = kt("knowledge.auto.63d90d977348ab1f");
        copyButton.title = kt("knowledge.auto.420c20dd9fcca860");
        copyButton.setAttribute("aria-label", kt("knowledge.auto.420c20dd9fcca860"));
        copyButton.hidden = !knowledgeContentActionByEditor.has(editor);
        let copiedTimer = 0;
        const copy = async () => {
          try {
            const authorize = knowledgeContentActionByEditor.get(editor);
            if (!authorize) throw new Error("copy denied");
            await authorize("copy");
            await copyCodeText(rendered.contentDOM?.textContent || "");
            copyButton.textContent = kt("knowledge.auto.8f6f8d979c981ced");
          } catch {
            copyButton.textContent = kt("knowledge.auto.753d8bb0da9913ce");
          }
          window.clearTimeout(copiedTimer);
          copiedTimer = window.setTimeout(() => { copyButton.textContent = kt("knowledge.auto.63d90d977348ab1f"); }, 1600);
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
  { id: "callout", blockNoteSpec: calloutBlock, slash: { get title() { return kt("knowledge.auto.374e3aadd8963595"); }, get subtext() { return kt("knowledge.auto.e75f7369920af3f4"); }, aliases: ["Tips", "Highlight", "callout"], get group() { return kt("knowledge.auto.7a688306423bec17"); }, icon: AlertTriangle, block: { type: "callout" } }, serverValidator: "callout", readonlyRenderer: "blocknote-spec", extractTextKeys: ["text", "icon"], requiredCapability: "page.write", trusted: true },
  { id: "formula", blockNoteSpec: formulaBlock, slash: { get title() { return kt("knowledge.auto.4d9d3292d6c8a843"); }, get subtext() { return kt("knowledge.auto.66e4266e7749afb0"); }, aliases: ["Mathematics", "latex", "formula", "formula"], get group() { return kt("knowledge.auto.7a688306423bec17"); }, icon: FunctionSquare, block: { type: "formula", content: "" } }, serverValidator: "formula", readonlyRenderer: "blocknote-spec", extractTextKeys: ["text"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeTask", blockNoteSpec: knowledgeTaskBlock, slash: [
    { get title() { return kt("knowledge.auto.5253040db8643c85"); }, get subtext() { return kt("knowledge.auto.61fc572e25000091"); }, aliases: ["To-do", "Task", "task", "todo"], get group() { return kt("knowledge.auto.19bf536853e2e78a"); }, icon: CheckCircle2, block: { type: "knowledgeTask" } },
    { id: "dateReminder", get title() { return kt("knowledge.auto.734bfa95fd19f44b"); }, get subtext() { return kt("knowledge.auto.eccb3e2db187227c"); }, aliases: ["Date", "reminder", "reminder", "date"], get group() { return kt("knowledge.auto.19bf536853e2e78a"); }, icon: Bell, block: { type: "knowledgeTask", props: { get title() { return kt("knowledge.auto.734bfa95fd19f44b"); } } } },
  ], serverValidator: "knowledgeTask", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgePoll", blockNoteSpec: knowledgePollBlock, slash: { get title() { return kt("knowledge.auto.3c5a0fdbcf55aaa8"); }, get subtext() { return kt("knowledge.auto.4564229503428085"); }, aliases: ["vote", "Questionnaire", "poll", "vote"], get group() { return kt("knowledge.auto.19bf536853e2e78a"); }, icon: ListChecks, block: { type: "knowledgePoll" } }, serverValidator: "knowledgePoll", readonlyRenderer: "blocknote-spec", extractTextKeys: ["question"], requiredCapability: "page.write", trusted: true },
  { id: "button", blockNoteSpec: buttonBlock, slash: { get title() { return kt("knowledge.auto.ad1c50c9367c756d"); }, get subtext() { return kt("knowledge.auto.ba2e2bcaba0df123"); }, aliases: ["link", "button"], get group() { return kt("knowledge.auto.99f1b08f6464952c"); }, icon: Link2, block: { type: "button" } }, serverValidator: "button", readonlyRenderer: "blocknote-spec", extractTextKeys: ["label"], requiredCapability: "page.write", trusted: true },
  { id: "bookmark", blockNoteSpec: bookmarkBlock, slash: { get title() { return kt("knowledge.auto.ef1738f3cb9bcb4d"); }, get subtext() { return kt("knowledge.auto.482c3895d5238a5a"); }, aliases: ["web page", "link", "bookmark", "url"], get group() { return kt("knowledge.auto.00a0cf27422e5fa3"); }, icon: Globe2, block: { type: "bookmark" } }, serverValidator: "bookmark", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title", "description", "siteName"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeReference", blockNoteSpec: knowledgeReferenceBlock, slash: { get title() { return kt("knowledge.auto.5e78c80960128108"); }, get subtext() { return kt("knowledge.auto.e5ce3c09173f138a"); }, aliases: ["Page", "subdocument", "Quote"], get group() { return kt("knowledge.auto.975b35f9c2b1148c"); }, icon: FileText, block: { type: "knowledgeReference" } }, serverValidator: "knowledgeReference", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "personCard", blockNoteSpec: personCardBlock, slash: { get title() { return kt("knowledge.auto.0d56349f2f8ccfc1"); }, get subtext() { return kt("knowledge.auto.afee9a3a5fcf6a75"); }, aliases: ["member", "personnel", "person", "user"], get group() { return kt("knowledge.auto.19bf536853e2e78a"); }, icon: UserRound, block: { type: "personCard" } }, serverValidator: "personCard", readonlyRenderer: "blocknote-spec", extractTextKeys: ["displayName", "email"], requiredCapability: "page.write", trusted: true },
  { id: "applicationCard", blockNoteSpec: applicationCardBlock, slash: { get title() { return kt("knowledge.auto.19b64b24daed8794"); }, get subtext() { return kt("knowledge.auto.1f6b4dc5b1f544f8"); }, aliases: ["Application", "schedule", "meeting", "group", "Task", "jira", "web"], get group() { return kt("knowledge.auto.00a0cf27422e5fa3"); }, icon: CalendarDays, block: { type: "applicationCard" } }, serverValidator: "applicationCard", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "application-card.resolve", trusted: true },
  { id: "externalEmbed", blockNoteSpec: externalEmbedBlock, slash: { get title() { return kt("knowledge.auto.b8b6f16538c3c33d"); }, get subtext() { return kt("knowledge.auto.5482a0fbc056527e"); }, aliases: ["video", "youtube", "bilibili", "Embed"], get group() { return kt("knowledge.auto.00a0cf27422e5fa3"); }, icon: PlaySquare, block: { type: "externalEmbed" } }, serverValidator: "externalEmbed", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "syncedBlock", blockNoteSpec: syncedBlock, slash: { get title() { return kt("knowledge.auto.32cfe9d4bea953ca"); }, get subtext() { return kt("knowledge.auto.c94645d8eef0df0a"); }, aliases: ["sync", "sync"], get group() { return kt("knowledge.auto.975b35f9c2b1148c"); }, icon: Link2, block: { type: "syncedBlock" } }, serverValidator: "syncedBlock", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "tableOfContents", blockNoteSpec: tableOfContentsBlock, slash: { get title() { return kt("knowledge.auto.af0ae3351923fc5d"); }, get subtext() { return kt("knowledge.auto.4a338284e0e8692a"); }, aliases: ["Directory", "toc", "outline"], get group() { return kt("knowledge.auto.975b35f9c2b1148c"); }, icon: ListTree, block: { type: "tableOfContents" } }, serverValidator: "tableOfContents", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "subpageList", blockNoteSpec: subpageListBlock, slash: { get title() { return kt("knowledge.auto.79ffaea2fe5ae234"); }, get subtext() { return kt("knowledge.auto.c9a389be08cf226c"); }, aliases: ["subpage", "subdocument", "children", "subpages"], get group() { return kt("knowledge.auto.975b35f9c2b1148c"); }, icon: BookOpen, block: { type: "subpageList" } }, serverValidator: "subpageList", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
  { id: "informationCollection", blockNoteSpec: informationCollectionBlock, slash: { get title() { return kt("knowledge.auto.642e311b86088b2d"); }, get subtext() { return kt("knowledge.auto.2bd599620996d477"); }, aliases: ["form", "collect", "form", "collection"], get group() { return kt("knowledge.auto.19bf536853e2e78a"); }, icon: ClipboardList, block: { type: "informationCollection" } }, serverValidator: "informationCollection", readonlyRenderer: "blocknote-spec", extractTextKeys: ["title"], requiredCapability: "page.write", trusted: true },
  { id: "knowledgeActivity", blockNoteSpec: knowledgeActivityBlock, slash: { get title() { return kt("knowledge.auto.014fef237bb8a1d9"); }, get subtext() { return kt("knowledge.auto.8db8b25b7d6d193a"); }, aliases: ["Activities", "Dynamic", "activity"], get group() { return kt("knowledge.auto.975b35f9c2b1148c"); }, icon: Activity, block: { type: "knowledgeActivity" } }, serverValidator: "knowledgeActivity", readonlyRenderer: "blocknote-spec", extractTextKeys: [], requiredCapability: "page.write", trusted: true },
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
  get button() { return kt("knowledge.auto.f1ed2cb71aa1c8c5"); },
  get bookmark() { return kt("knowledge.auto.f1ed2cb71aa1c8c5"); },
  get externalEmbed() { return kt("knowledge.auto.f1ed2cb71aa1c8c5"); },
  get applicationCard() { return kt("knowledge.auto.f1ed2cb71aa1c8c5"); },
  get knowledgeReference() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get personCard() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get knowledgeTask() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get syncedBlock() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get tableOfContents() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get subpageList() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get informationCollection() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
  get knowledgeActivity() { return kt("knowledge.auto.dc6d73eb4129cbb8"); },
};

function customSlashMenuItems(editor: BlockNoteEditor<any, any, any>): KnowledgeSlashMenuItem[] {
  const insert = (block: Record<string, unknown>) => () => insertOrUpdateBlockForSlashMenu(editor, block as never);
  const dynamicRuntime = knowledgeDynamicBlockRuntimeByEditor.get(editor)?.runtime.current;
  const blockItems = customBlockDefinitions.flatMap(definition => {
    const definitions = definition.slash ? Array.isArray(definition.slash) ? definition.slash : [definition.slash] : [];
    return definitions.map(slash => ({ id: `block:${slash.id || definition.id}`, title: slash.title, subtext: slash.subtext, aliases: [...slash.aliases], group: slash.group, submenu: customSlashSubmenus[definition.id], icon: <slash.icon size={18} />, formulaInput: definition.id === "formula" ? { displayMode: "block" as const } : undefined, onItemClick: definition.id === "formula" ? () => undefined : insert(slash.block) }));
  });
  const pageItems = pageTypeDefinitions.filter(definition => definition.id !== "document" && definition.capabilities & pageTypeCapability.create).map(definition => ({
    id: `page:${definition.id}`, title: definition.label, subtext: definition.description, aliases: [definition.id], group: kt("knowledge.auto.f88e8ea8818b9a05"), submenu: kt("knowledge.auto.f88e8ea8818b9a05"), icon: <definition.icon size={18} />,
    disabledReason: dynamicRuntime?.canCreateChild ? undefined : kt("knowledge.auto.fe524396569f96c5"),
    onItemClick: () => {
      if (!dynamicRuntime?.canCreateChild) return;
      let blockID = "";
      try { blockID = editor.getTextCursorPosition().block.id; } catch { /* The slash menu can close after selection changed. */ }
      if (!blockID) return;
      void dynamicRuntime.createChildReference({
        blockID,
        parentContent: serializeDocumentBlocks(editor.document as never),
        title: ktf("knowledge.auto.271dbaca298ee0fc", { value0: definition.label }),
        contentType: definition.id,
        display: "embed",
      });
    },
  }));
  const inlineFormulaItem: KnowledgeSlashMenuItem = {
    id: "inline:inline-formula",
    title: kt("knowledge.auto.e3efe95c7f617abf"),
    subtext: kt("knowledge.auto.fad89d631167e554"),
    aliases: [kt("knowledge.auto.872c1fa141b5ed8d"), "latex", "inline formula", kt("knowledge.auto.e3efe95c7f617abf")],
    group: kt("knowledge.auto.7a688306423bec17"),
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
      subtext: kt("knowledge.auto.865cdcca092d5964"),
      aliases: [label, block.id, "block", kt("knowledge.auto.73012a38cd4eaf64")],
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
    aliases: [person.displayName, person.email || "", person.userID, kt("knowledge.auto.06fea8eab68db0ad"), kt("knowledge.auto.6e6d6ddbb7c1a453")],
    group: kt("knowledge.auto.06fea8eab68db0ad"),
    icon: <UserRound size={17} />,
    onItemClick: () => editor.insertInlineContent([{ type: "personMention", props: { userId: person.userID } }, " "] as never, { updateSelection: true }),
  }));
  const pageItems: DefaultReactSuggestionItem[] = pages.slice(0, 12).map(page => ({
    title: page.title,
    subtext: `${page.path.map(item => item.title).join(" / ") || page.title} · ${page.contentType}`,
    aliases: [page.title, ...page.aliases, ...page.path.map(item => item.title), page.pageID, kt("knowledge.auto.452c7b10d57a86a7"), kt("knowledge.auto.72e0fa874a76e345")],
    group: kt("knowledge.auto.452c7b10d57a86a7"),
    icon: <BookOpen size={17} />,
    onItemClick: () => editor.insertInlineContent([{ type: "pageMention", props: { pageId: page.pageID } }, " "] as never, { updateSelection: true }),
  }));
  const blockItems = runtime ? filterSuggestionItems(mentionBlockChoices(editor, runtime.currentPageID), normalizedQuery).slice(0, 12) : [];
  const dates = [
    { title: ktf("knowledge.auto.f3cb8e442500b40f", { value0: localDateKey(0) }), date: localDateKey(0), aliases: [kt("knowledge.auto.d5f5a7a010731feb"), "today"] },
    { title: ktf("knowledge.auto.8109a87e9b4d1afc", { value0: localDateKey(1) }), date: localDateKey(1), aliases: [kt("knowledge.auto.b1d841b978fb524c"), "tomorrow"] },
    { title: ktf("knowledge.auto.bdbb6ab6a6643fbb", { value0: localDateKey(7) }), date: localDateKey(7), aliases: [kt("knowledge.auto.d94daba316055842"), kt("knowledge.auto.7f5fab4d966e23f6"), "week"] },
  ];
  if (validDateKey(normalizedQuery) && !dates.some(item => item.date === normalizedQuery)) dates.unshift({ title: normalizedQuery, date: normalizedQuery, aliases: [normalizedQuery] });
  const dateItems = filterSuggestionItems(dates.map(item => ({
    title: item.title,
    subtext: kt("knowledge.auto.6bde298fc4e4881a"),
    aliases: [...item.aliases, item.date, kt("knowledge.auto.70d0c1b33626ba4b")],
    group: kt("knowledge.auto.70d0c1b33626ba4b"),
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
    image: { blockType: "image", accept: capabilities.fileAccept?.image || "image/*", subtext: kt("knowledge.auto.1ffa249fb9cbbc24") },
    video: { blockType: "video", accept: capabilities.fileAccept?.video || "video/*", subtext: kt("knowledge.auto.ee098d59af10fbf3") },
    audio: { blockType: "audio", accept: capabilities.fileAccept?.audio || "audio/*", subtext: kt("knowledge.auto.f008a4a2f275d3bc") },
    file: { blockType: "file", accept: capabilities.fileAccept?.all || "*/*", subtext: kt("knowledge.auto.b89cac8dd2461347") },
  } as const;
  const defaults = getDefaultSlashMenuItems(editor)
    .filter(item => defaultIcons[String(item.key)])
    .map(({ key, ...item }): KnowledgeSlashMenuItem => {
      const media = mediaPickers[String(key) as keyof typeof mediaPickers];
      return {
        ...item,
        id: `default:${String(key)}`,
        icon: defaultIcons[String(key)],
        group: item.group || kt("knowledge.auto.89e5e14c8db996da"),
        subtext: media?.subtext || item.subtext,
        submenu: media ? kt("knowledge.auto.479e6a89c4ad2472") : undefined,
        filePicker: media ? { blockType: media.blockType, accept: media.accept } : undefined,
        disabledReason: media && !capabilities.canUploadFiles ? kt("knowledge.auto.d61def01a2e5c329") : undefined,
      };
    });
  const columns = getMultiColumnSlashMenuItems(editor).map((item, index): KnowledgeSlashMenuItem => ({ ...item, id: `layout:columns-${index + 1}`, group: kt("knowledge.auto.faa2f2ed67357847"), submenu: kt("knowledge.auto.faa2f2ed67357847") }));
  return arrangeKnowledgeSlashMenuItems([...defaults, ...columns, ...customSlashMenuItems(editor)], query);
}
