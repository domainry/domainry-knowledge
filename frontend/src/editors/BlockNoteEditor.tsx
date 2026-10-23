import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Block, BlockNoteEditor } from "@blocknote/core";
import { defaultToggledState, insertOrUpdateBlockForSlashMenu, isToggleOpen } from "@blocknote/core";
import { zh } from "@blocknote/core/locales";
import { withCollaboration } from "@blocknote/core/yjs";
import { SideMenuExtension, SyntaxHighlightingExtension } from "@blocknote/core/extensions";
import { BlockColorsItem, DragHandleButton, FormattingToolbar, FormattingToolbarController, getFormattingToolbarItems, SideMenu, SideMenuController, SuggestionMenuController, TableColumnHeaderItem, TableRowHeaderItem, useBlockNoteEditor, useComponentsContext, useCreateBlockNote, useEditorState, useExtensionState, usePortalElement } from "@blocknote/react";
import type { FormattingToolbarProps, SideMenuProps } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";
import { locales as multiColumnLocales } from "@blocknote/xl-multi-column";
import { ChevronDown, ChevronRight, Clipboard, Copy, Crop, Download, FileJson, FileText, FunctionSquare, Link2, ListTree, Printer, RefreshCw, RotateCcw, Scissors, Trash2, Type, X } from "lucide-react";
import "@blocknote/ariakit/style.css";
import { renderSafeLatex } from "../latex.ts";
import { documentBlockCommentQuote, parseDocumentBlocks, serializeDocumentBlocks } from "../documentContent.ts";
import { canonicalMindNoteContent, documentBlocksToMindNote } from "../mindNoteContent.ts";
import type { KnowledgeEditorProps } from "./types.ts";
import { getKnowledgeMentionMenuItems, getKnowledgeSlashMenuItems, knowledgeCodeLanguageIDs, knowledgeDocumentSchema, knowledgeImageCropAspects, notifyKnowledgeDynamicBlockRuntime, notifyKnowledgeMentionRuntime, notifyKnowledgePollRuntime, notifyKnowledgeTaskRuntime, registerKnowledgeContentAction, registerKnowledgeDynamicBlockRuntime, registerKnowledgeMentionRuntime, registerKnowledgePollRuntime, registerKnowledgeTaskRuntime } from "./documentBlocks.tsx";
import { exportKnowledgeDocument, handleKnowledgeDocumentPaste, type KnowledgeDocumentExportFormat } from "./documentTransfer.ts";
import { KnowledgeSlashMenu } from "./KnowledgeSlashMenu.tsx";
import { recordKnowledgeSlashRecentID } from "./slashMenu.ts";
import type { KnowledgeSlashMenuItem } from "./slashMenu.ts";

// Shiki models a core-only highlighter as HighlighterGeneric<never, never>, while
// BlockNote accepts HighlighterGeneric<any, any>. The runtime contract is the same.
async function createKnowledgeCodeHighlighter(): Promise<any> {
  const [
    { createHighlighterCore },
    { createJavaScriptRegexEngine },
    githubLight,
    githubDark,
    ...languageModules
  ] = await Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("@shikijs/themes/github-light"),
    import("@shikijs/themes/github-dark"),
    import("@shikijs/langs/javascript"),
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/html"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/shellscript"),
    import("@shikijs/langs/go"),
    import("@shikijs/langs/python"),
    import("@shikijs/langs/java"),
    import("@shikijs/langs/sql"),
    import("@shikijs/langs/markdown"),
    import("@shikijs/langs/yaml"),
    import("@shikijs/langs/rust"),
    import("@shikijs/langs/csharp"),
    import("@shikijs/langs/cpp"),
  ]);
  const loadedLanguages = languageModules.flatMap(module => module.default);
  const missingLanguages = knowledgeCodeLanguageIDs.filter(language => language !== "text" && !loadedLanguages.some(registration => registration.name === language || registration.aliases?.includes(language)));
  if (missingLanguages.length) throw new Error(`Missing code languages: ${missingLanguages.join(", ")}`);
  return createHighlighterCore({
    themes: [githubLight.default, githubDark.default],
    langs: loadedLanguages,
    engine: createJavaScriptRegexEngine(),
  });
}

type KnowledgeFileBlockType = "image" | "video" | "audio" | "file";
type KnowledgeFilePickerRequest = {
  action: "insert" | "replace";
  blockID: string;
  blockType: KnowledgeFileBlockType;
  accept: string;
  recentID?: string;
};
type KnowledgeFormulaInputRequest = { displayMode: "block" | "inline"; recentID: string };

function createCollaborationSyncGate(awareness: NonNullable<NonNullable<KnowledgeEditorProps["collaboration"]>["provider"]>["awareness"]) {
  const listeners = new Set<(synced: boolean) => void>();
  return {
    awareness,
    synced: false,
    on(event: string, listener: (synced: boolean) => void) {
      if (event === "synced") listeners.add(listener);
    },
    off(event: string, listener: (synced: boolean) => void) {
      if (event === "synced") listeners.delete(listener);
    },
    release() {
      if (this.synced) return;
      this.synced = true;
      for (const listener of listeners) listener(true);
    },
  };
}

function knowledgeFileAccept(editor: BlockNoteEditor<any, any, any>, blockType: string) {
  const accepts = editor.schema.blockSpecs[blockType]?.implementation.meta.fileBlockAccept;
  return accepts?.length ? accepts.join(",") : "*/*";
}

function KnowledgeAuthorizedFileReplaceButton({ busy, onPick }: { busy: boolean; onPick(request: KnowledgeFilePickerRequest): void }) {
  const Components = useComponentsContext()!;
  const editor = useBlockNoteEditor<any, any, any>();
  const block = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor.isEditable) return undefined;
      const selected = editor.getSelection()?.blocks || [editor.getTextCursorPosition().block];
      if (selected.length !== 1 || !["image", "video", "audio", "file"].includes(selected[0].type)) return undefined;
      return selected[0];
    },
  });
  if (!block || !editor.uploadFile) return null;
  return <Components.FormattingToolbar.Button
    className="bn-button"
    label="替换文件"
    mainTooltip={busy ? "文件正在上传" : "选择本地文件并直接替换"}
    icon={<RefreshCw size={16} />}
    isDisabled={busy}
    onClick={() => onPick({ action: "replace", blockID: block.id, blockType: block.type as KnowledgeFileBlockType, accept: knowledgeFileAccept(editor, block.type) })}
  />;
}

type KnowledgeImageProps = {
  name: string;
  caption: string;
  cropAspect: (typeof knowledgeImageCropAspects)[number];
  cropX: number;
  cropY: number;
  cropZoom: number;
};

function KnowledgeImagePropertiesButton() {
  const Components = useComponentsContext()!;
  const portalElement = usePortalElement();
  const editor = useBlockNoteEditor<any, any, any>();
  const [open, setOpen] = useState(false);
  const block = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor.isEditable) return undefined;
      const selected = editor.getSelection()?.blocks || [editor.getTextCursorPosition().block];
      return selected.length === 1 && selected[0].type === "image" ? selected[0] : undefined;
    },
  });
  if (!block) return null;
  const props = block.props as unknown as KnowledgeImageProps;
  const update = (next: Partial<KnowledgeImageProps>) => editor.updateBlock(block.id, { props: next } as never);
  const cropped = props.cropAspect !== "original";
  return <Components.Generic.Popover.Root open={open} onOpenChange={next => { setOpen(next); if (!next) editor.focus(); }} portalElement={portalElement}>
    <Components.Generic.Popover.Trigger>
      <Components.FormattingToolbar.Button className="bn-button" label="图片属性与裁剪" mainTooltip="图片属性与裁剪" icon={<Crop size={16} />} isSelected={cropped} onClick={() => setOpen(value => !value)} />
    </Components.Generic.Popover.Trigger>
    <Components.Generic.Popover.Content className="bn-popover-content knowledge-image-properties" variant="form-popover">
      <label><span>替代文本</span><input value={props.name} maxLength={512} onChange={event => update({ name: event.currentTarget.value })} placeholder="描述图片内容，供无障碍阅读" /></label>
      <label><span>图片说明</span><input value={props.caption} maxLength={2048} onChange={event => update({ caption: event.currentTarget.value })} placeholder="显示在图片下方" /></label>
      <fieldset><legend>裁剪比例</legend><div className="knowledge-image-aspects">{knowledgeImageCropAspects.map(aspect => <button key={aspect} type="button" aria-pressed={props.cropAspect === aspect} onClick={() => update({ cropAspect: aspect })}>{aspect === "original" ? "原图" : aspect}</button>)}</div></fieldset>
      <label><span>水平焦点 <b>{props.cropX}%</b></span><input type="range" min="0" max="100" step="1" value={props.cropX} disabled={!cropped} onChange={event => update({ cropX: Number(event.currentTarget.value) })} /></label>
      <label><span>垂直焦点 <b>{props.cropY}%</b></span><input type="range" min="0" max="100" step="1" value={props.cropY} disabled={!cropped} onChange={event => update({ cropY: Number(event.currentTarget.value) })} /></label>
      <label><span>裁剪缩放 <b>{props.cropZoom}%</b></span><input type="range" min="100" max="300" step="1" value={props.cropZoom} disabled={!cropped} onChange={event => update({ cropZoom: Number(event.currentTarget.value) })} /></label>
      <button type="button" className="knowledge-image-reset" onClick={() => update({ cropAspect: "original", cropX: 50, cropY: 50, cropZoom: 100 })}><RotateCcw size={14} />恢复原图</button>
    </Components.Generic.Popover.Content>
  </Components.Generic.Popover.Root>;
}

type KnowledgeBlockActionProps = {
  blockLink?: (blockID: string) => string;
  authorizeContentAction?: KnowledgeEditorProps["authorizeContentAction"];
  onFeedback?: (message: string) => void;
};

const blockConversionItems = [
  { label: "正文", type: "paragraph", props: {} },
  { label: "一级标题", type: "heading", props: { level: 1, isToggleable: false } },
  { label: "二级标题", type: "heading", props: { level: 2, isToggleable: false } },
  { label: "三级标题", type: "heading", props: { level: 3, isToggleable: false } },
  { label: "无序列表", type: "bulletListItem", props: {} },
  { label: "有序列表", type: "numberedListItem", props: {} },
  { label: "任务列表", type: "checkListItem", props: {} },
  { label: "折叠列表", type: "toggleListItem", props: {} },
  { label: "引用", type: "quote", props: {} },
] as const;

function actionBlocks(editor: BlockNoteEditor<any, any, any>, hovered?: Block<any, any, any>) {
  const selected = editor.getSelection()?.blocks;
  if (hovered && selected?.some(block => block.id === hovered.id)) return selected;
  if (hovered) return [hovered];
  return selected || [editor.getTextCursorPosition().block];
}

function isConvertibleBlock(block: Block<any, any, any>) {
  return Array.isArray(block.content);
}

function isCollapsibleBlock(block: Block<any, any, any>) {
  return block.children.length > 0 && (block.type === "toggleListItem" || block.type === "heading" && block.props.isToggleable === true);
}

function outermostBlocks(editor: BlockNoteEditor<any, any, any>, blocks: Block<any, any, any>[]) {
  const selected = new Set(blocks.map(block => block.id));
  return blocks.filter(block => {
    let parent = editor.getParentBlock(block);
    while (parent) {
      if (selected.has(parent.id)) return false;
      parent = editor.getParentBlock(parent);
    }
    return true;
  });
}

async function writeBlocksToClipboard(editor: BlockNoteEditor<any, any, any>, blocks: Block<any, any, any>[]) {
  const roots = outermostBlocks(editor, blocks);
  const html = editor.blocksToFullHTML(roots);
  const text = editor.blocksToMarkdownLossy(roots);
  if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    try {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      })]);
      return;
    } catch {
      // Some browsers expose write() but reject HTML clipboard items.
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("clipboard unavailable");
}

async function writeTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("clipboard unavailable");
}

function KnowledgeBlockActionItems({ blockLink, authorizeContentAction, onFeedback }: KnowledgeBlockActionProps) {
  const Components = useComponentsContext()!;
  const portalElement = usePortalElement();
  const editor = useBlockNoteEditor<any, any, any>();
  const [, setFoldRevision] = useState(0);
  const hovered = useExtensionState(SideMenuExtension, { editor, selector: state => state?.block });
  if (!hovered) return null;
  const blocks = actionBlocks(editor, hovered);
  const canConvert = blocks.every(isConvertibleBlock);
  const collapsible = blocks.filter(isCollapsibleBlock);
  const collapse = collapsible.some(isToggleOpen);
  const copy = async (cut: boolean) => {
    try {
      if (!authorizeContentAction) throw new Error("当前页面禁止复制内容。");
      await authorizeContentAction("copy");
      await writeBlocksToClipboard(editor, blocks);
      if (cut) editor.removeBlocks(blocks);
      onFeedback?.(`${blocks.length} 个 Block 已${cut ? "剪切" : "复制"}。`);
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : "浏览器未授予剪贴板权限，请重试。");
    }
  };
  const copyLinks = async () => {
    if (!blockLink) return;
    try {
      await writeTextToClipboard(blocks.map(block => blockLink(block.id)).join("\n"));
      onFeedback?.(`${blocks.length} 个 Block 链接已复制。`);
    } catch {
      onFeedback?.("Block 链接复制失败，请检查剪贴板权限。");
    }
  };
  const convert = (type: string, props: Record<string, boolean | number | string>) => {
    editor.transact(() => blocks.forEach(block => editor.updateBlock(block, { type, props } as never)));
    onFeedback?.(`${blocks.length} 个 Block 已转换类型。`);
  };
  const toggleCollapse = () => {
    collapsible.forEach(block => defaultToggledState.set(block, !collapse));
    setFoldRevision(value => value + 1);
    onFeedback?.(`${collapsible.length} 个 Block 已${collapse ? "折叠" : "展开"}。`);
  };
  return <Components.Generic.Menu.Dropdown className="bn-menu-dropdown bn-drag-handle-menu knowledge-block-actions">
    <Components.Generic.Menu.Label>{blocks.length > 1 ? `已选 ${blocks.length} 个 Block` : "Block 操作"}</Components.Generic.Menu.Label>
    {authorizeContentAction && <Components.Generic.Menu.Item className="bn-menu-item" icon={<Copy size={16} />} onClick={() => void copy(false)}>复制</Components.Generic.Menu.Item>}
    {authorizeContentAction && <Components.Generic.Menu.Item className="bn-menu-item" icon={<Scissors size={16} />} onClick={() => void copy(true)}>剪切</Components.Generic.Menu.Item>}
    <Components.Generic.Menu.Item className="bn-menu-item" icon={<Link2 size={16} />} disabled={!blockLink} onClick={() => void copyLinks()}>复制 Block 链接</Components.Generic.Menu.Item>
    <Components.Generic.Menu.Divider className="knowledge-block-menu-divider" />
    {canConvert ? <Components.Generic.Menu.Root position="right" sub portalElement={portalElement}>
      <Components.Generic.Menu.Trigger sub><Components.Generic.Menu.Item className="bn-menu-item" icon={<Type size={16} />} subTrigger>转换类型</Components.Generic.Menu.Item></Components.Generic.Menu.Trigger>
      <Components.Generic.Menu.Dropdown className="bn-menu-dropdown knowledge-block-convert-menu" sub>{blockConversionItems.map(item => <Components.Generic.Menu.Item key={`${item.type}:${JSON.stringify(item.props)}`} className="bn-menu-item" checked={blocks.every(block => block.type === item.type && Object.entries(item.props).every(([key, value]) => block.props[key] === value))} onClick={() => convert(item.type, item.props)}>{item.label}</Components.Generic.Menu.Item>)}</Components.Generic.Menu.Dropdown>
    </Components.Generic.Menu.Root> : <Components.Generic.Menu.Item className="bn-menu-item" icon={<Type size={16} />} disabled>当前 Block 不支持类型转换</Components.Generic.Menu.Item>}
    <Components.Generic.Menu.Item className="bn-menu-item" icon={collapse ? <ChevronDown size={16} /> : <ChevronRight size={16} />} disabled={collapsible.length === 0} onClick={toggleCollapse}>{collapse ? "折叠子块" : "展开子块"}</Components.Generic.Menu.Item>
    <BlockColorsItem>文字与背景颜色</BlockColorsItem>
    <TableRowHeaderItem>切换表头行</TableRowHeaderItem>
    <TableColumnHeaderItem>切换表头列</TableColumnHeaderItem>
    <Components.Generic.Menu.Divider className="knowledge-block-menu-divider" />
    <Components.Generic.Menu.Item className="bn-menu-item knowledge-block-delete" icon={<Trash2 size={16} />} onClick={() => { editor.removeBlocks(blocks); onFeedback?.(`${blocks.length} 个 Block 已删除。`); }}>删除{blocks.length > 1 ? ` ${blocks.length} 个 Block` : ""}</Components.Generic.Menu.Item>
  </Components.Generic.Menu.Dropdown>;
}

function KnowledgeSideMenu({ blockLink, authorizeContentAction, onFeedback, ...props }: SideMenuProps & KnowledgeBlockActionProps) {
  const DragMenu = useCallback(() => <KnowledgeBlockActionItems blockLink={blockLink} authorizeContentAction={authorizeContentAction} onFeedback={onFeedback} />, [authorizeContentAction, blockLink, onFeedback]);
  return <SideMenu {...props} dragHandleMenu={DragMenu}><DragHandleButton dragHandleMenu={DragMenu} /></SideMenu>;
}

function KnowledgeFormattingToolbar({ blockLink, authorizeContentAction, onFeedback, filePickerBusy, onFilePick, ...props }: FormattingToolbarProps & KnowledgeBlockActionProps & { filePickerBusy: boolean; onFilePick(request: KnowledgeFilePickerRequest): void }) {
  const editor = useBlockNoteEditor<any, any, any>();
  const selectedBlocks = useEditorState({ editor, selector: ({ editor }) => editor.getSelection()?.blocks || [] });
  const copySelection = async (cut: boolean) => {
    if (selectedBlocks.length < 2) return;
    try {
      if (!authorizeContentAction) throw new Error("当前页面禁止复制内容。");
      await authorizeContentAction("copy");
      await writeBlocksToClipboard(editor, selectedBlocks);
      if (cut) editor.removeBlocks(selectedBlocks);
      onFeedback?.(`${selectedBlocks.length} 个 Block 已${cut ? "剪切" : "复制"}。`);
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : "浏览器未授予剪贴板权限，请重试。");
    }
  };
  return <FormattingToolbar {...props}>
    {getFormattingToolbarItems(props.blockTypeSelectItems).filter(item => item.key !== "replaceFileButton")}
    <KnowledgeAuthorizedFileReplaceButton busy={filePickerBusy} onPick={onFilePick} />
    <KnowledgeImagePropertiesButton />
    {selectedBlocks.length > 1 && <>
      <span className="knowledge-block-selection-count">已选 {selectedBlocks.length} 个 Block</span>
      {authorizeContentAction && <button type="button" className="knowledge-block-selection-action" title="复制所选 Block" aria-label="复制所选 Block" onClick={() => void copySelection(false)}><Clipboard size={15} /></button>}
      {authorizeContentAction && <button type="button" className="knowledge-block-selection-action" title="剪切所选 Block" aria-label="剪切所选 Block" onClick={() => void copySelection(true)}><Scissors size={15} /></button>}
      {blockLink && <button type="button" className="knowledge-block-selection-action" title="复制所选 Block 链接" aria-label="复制所选 Block 链接" onClick={() => void writeTextToClipboard(selectedBlocks.map(block => blockLink(block.id)).join("\n")).then(() => onFeedback?.(`${selectedBlocks.length} 个 Block 链接已复制。`), () => onFeedback?.("Block 链接复制失败，请检查剪贴板权限。"))}><Link2 size={15} /></button>}
      <button type="button" className="knowledge-block-selection-action is-danger" title="删除所选 Block" aria-label="删除所选 Block" onClick={() => { editor.removeBlocks(selectedBlocks); onFeedback?.(`${selectedBlocks.length} 个 Block 已删除。`); }}><Trash2 size={15} /></button>
    </>}
  </FormattingToolbar>;
}

function KnowledgeDocumentTransfer({ editor, title, authorizeContentAction, onFeedback, onConvertToMindNote }: { editor: BlockNoteEditor<any, any, any>; title: string; authorizeContentAction?: KnowledgeEditorProps["authorizeContentAction"]; onFeedback?(message: string): void; onConvertToMindNote?(title: string, body: string): Promise<void> }) {
  const details = useRef<HTMLDetailsElement>(null);
  const run = async (format: KnowledgeDocumentExportFormat) => {
    try {
      if (!authorizeContentAction) throw new Error("当前页面禁止导出内容。");
      await authorizeContentAction(format === "pdf" ? "print" : "export");
      onFeedback?.(exportKnowledgeDocument(editor, title, format));
      if (details.current) details.current.open = false;
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : "文档导出失败，请重试。");
    }
  };
  const convert = async () => {
    if (!onConvertToMindNote) return;
    if (details.current) details.current.open = false;
    try {
      if (!authorizeContentAction) throw new Error("当前页面禁止创建副本。");
      await authorizeContentAction("duplicate");
      await onConvertToMindNote(`${title}（思维笔记）`, canonicalMindNoteContent(documentBlocksToMindNote(editor.document)));
    }
    catch (failure) { onFeedback?.(failure instanceof Error ? failure.message : "转换思维笔记失败，请重试。"); }
  };
  if (!authorizeContentAction) return null;
  return <div className="knowledge-document-transfer no-print">
    <details ref={details}>
      <summary className="knowledge-page-header-action" aria-label="导出文档"><Download size={14} />导出</summary>
      <div role="menu" aria-label="文档导出格式">
        <button type="button" role="menuitem" onClick={() => void run("json")}><FileJson size={16} /><span><strong>Block JSON</strong><small>完整保留结构、稳定 ID 与属性</small></span></button>
        <button type="button" role="menuitem" onClick={() => void run("markdown")}><FileText size={16} /><span><strong>Markdown</strong><small>导出为可移植的纯文本格式</small></span></button>
        <button type="button" role="menuitem" onClick={() => void run("pdf")}><Printer size={16} /><span><strong>PDF</strong><small>使用系统打印引擎保存为 PDF</small></span></button>
        {onConvertToMindNote && <button type="button" role="menuitem" onClick={() => void convert()}><ListTree size={16} /><span><strong>复制为思维笔记</strong><small>创建同级大纲页面，保留文本层级和完成状态</small></span></button>}
      </div>
    </details>
  </div>;
}

function changedDocumentBlockIDs(before: string, after: string) {
  const flatten = (body: string) => {
    const out = new Map<string, string>();
    const visit = (blocks: unknown[]) => blocks.forEach(item => {
      if (!item || typeof item !== "object") return;
      const block = item as { id?: string; children?: unknown[] };
      if (block.id) out.set(block.id, JSON.stringify(block));
      if (Array.isArray(block.children)) visit(block.children);
    });
    visit(parseDocumentBlocks(body));
    return out;
  };
  const previous = flatten(before), next = flatten(after), changed = new Set<string>();
  for (const [id, value] of previous) if (next.get(id) !== value) changed.add(id);
  for (const [id, value] of next) if (previous.get(id) !== value) changed.add(id);
  return [...changed].slice(0, 2048);
}

function DocumentBlockEditor({ body, readOnly, documentTitle = "知识页面", collaboration, mentions, tasks, polls, dynamicBlocks, initialBlockID, blockHighlightRevision = 0, commentMarkers = [], onCommentMarkerOpen, blockLink, insertMarkdownRequest, pageActionHost, authorizeContentAction, onActionFeedback, uploadFile, fileUploadsEnabled, fileUploadAccept, readFile, convertPage, onChange, onPresence, onCommentAnchor }: KnowledgeEditorProps) {
  const applying = useRef(false), emitted = useRef(body), seeded = useRef(false);
  const revealedBlockID = useRef("");
  const uploadFileRef = useRef(uploadFile), readFileRef = useRef(readFile);
  const filePickerInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFilePickerRef = useRef<KnowledgeFilePickerRequest | null>(null);
  const [filePickerBusy, setFilePickerBusy] = useState(false);
  const [formulaInput, setFormulaInput] = useState<KnowledgeFormulaInputRequest | null>(null), [formulaSource, setFormulaSource] = useState("");
  const mentionRuntimeRef = useRef(mentions);
  const taskRuntimeRef = useRef(tasks);
  const pollRuntimeRef = useRef(polls);
  const dynamicBlockRuntimeRef = useRef(dynamicBlocks);
  const actionFeedbackRef = useRef(onActionFeedback);
  const insertedMarkdownRequestRef = useRef("");
  const resolvedFileURLs = useRef(new Map<string, Promise<string>>());
  uploadFileRef.current = uploadFile;
  readFileRef.current = readFile;
  mentionRuntimeRef.current = mentions;
  taskRuntimeRef.current = tasks;
  pollRuntimeRef.current = polls;
  dynamicBlockRuntimeRef.current = dynamicBlocks;
  actionFeedbackRef.current = onActionFeedback;
  const uploadKnowledgeFile = useCallback((file: File, blockID?: string) => {
    const upload = uploadFileRef.current;
    if (!upload) return Promise.reject(new Error("Knowledge file upload is unavailable"));
    return upload(file, blockID);
  }, []);
  const resolveKnowledgeFileURL = useCallback((reference: string) => {
    if (!/^knowledge-document:kdoc_[a-f0-9]{32}$/.test(reference)) return Promise.reject(new Error("Knowledge file reference is invalid"));
    const cached = resolvedFileURLs.current.get(reference);
    if (cached) return cached;
    const pending = (async () => {
      const read = readFileRef.current;
      if (!read) throw new Error("Knowledge file reader is unavailable");
      return URL.createObjectURL(await read(reference));
    })();
    resolvedFileURLs.current.set(reference, pending);
    void pending.catch(() => resolvedFileURLs.current.delete(reference));
    return pending;
  }, []);
  useEffect(() => () => {
    for (const pending of resolvedFileURLs.current.values()) void pending.then(url => URL.revokeObjectURL(url), () => undefined);
    resolvedFileURLs.current.clear();
  }, []);
  const baseOptions = {
    schema: knowledgeDocumentSchema,
    dictionary: { ...zh, multi_column: multiColumnLocales.zh },
    pasteHandler: (context: Parameters<typeof handleKnowledgeDocumentPaste>[0]) => handleKnowledgeDocumentPaste({ ...context, onFeedback: message => actionFeedbackRef.current?.(message) }),
    uploadFile: !readOnly && fileUploadsEnabled && uploadFile ? uploadKnowledgeFile : undefined,
    resolveFileUrl: readFile ? resolveKnowledgeFileURL : undefined,
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },
    extensions: [SyntaxHighlightingExtension({ createHighlighter: createKnowledgeCodeHighlighter })],
  };
  const initialBlocks = parseDocumentBlocks(body);
  const collaborationSyncGate = useMemo(() => collaboration?.provider?.awareness
    ? createCollaborationSyncGate(collaboration.provider.awareness)
    : undefined, [collaboration?.fragment]);
  const editor = useCreateBlockNote(collaboration ? {
    ...withCollaboration({
      ...baseOptions,
      collaboration: { fragment: collaboration.fragment, user: collaboration.user, provider: collaborationSyncGate, showCursorLabels: "activity" },
    }),
    // Match the hydrated Yjs document exactly. The sync gate below delays the
    // Yjs binding until the initial cursor has been moved to an inline-content
    // block; y-prosemirror otherwise restores its default cursor onto a leading
    // image/file blockContainer and emits an invalid TextSelection warning.
    initialContent: initialBlocks.length ? initialBlocks as never : [{ id: "initialBlockId", type: "paragraph", content: "" }] as never,
  } : {
    ...baseOptions,
    initialContent: initialBlocks.length ? initialBlocks as never : undefined,
  }, [collaboration?.fragment]);
  const preparedCollaborationEditor = useRef<typeof editor | null>(null);
  if (collaboration && preparedCollaborationEditor.current !== editor) {
    preparedCollaborationEditor.current = editor;
    const textBlock = editor.document.find(block => Array.isArray((block as { content?: unknown }).content));
    if (textBlock) editor.setTextCursorPosition(textBlock, "start");
  }
  useEffect(() => {
    collaborationSyncGate?.release();
  }, [collaborationSyncGate, editor]);
  registerKnowledgeMentionRuntime(editor, mentionRuntimeRef);
  registerKnowledgeContentAction(editor, authorizeContentAction);
  registerKnowledgeTaskRuntime(editor, taskRuntimeRef);
  registerKnowledgePollRuntime(editor, pollRuntimeRef);
  registerKnowledgeDynamicBlockRuntime(editor, dynamicBlockRuntimeRef);
  useEffect(() => notifyKnowledgeMentionRuntime(editor), [editor, mentions]);
  useEffect(() => notifyKnowledgeTaskRuntime(editor), [editor, tasks]);
  useEffect(() => notifyKnowledgePollRuntime(editor), [editor, polls]);
  useEffect(() => notifyKnowledgeDynamicBlockRuntime(editor), [dynamicBlocks, editor]);
  const getMentionItems = useCallback((query: string) => getKnowledgeMentionMenuItems(editor, mentionRuntimeRef.current, query), [editor]);
  const getSlashItems = useCallback((query: string) => getKnowledgeSlashMenuItems(editor, query, {
    canUploadFiles: Boolean(!readOnly && fileUploadsEnabled && uploadFile),
    fileAccept: fileUploadAccept,
  }), [editor, fileUploadAccept, fileUploadsEnabled, readOnly, uploadFile]);
  const requestFilePick = useCallback((request: KnowledgeFilePickerRequest) => {
    if (filePickerBusy) {
      actionFeedbackRef.current?.("文件正在上传，请稍候。");
      return;
    }
    const input = filePickerInputRef.current;
    if (!input) return;
    pendingFilePickerRef.current = request;
    input.value = "";
    input.accept = request.accept;
    input.click();
  }, [filePickerBusy]);
  const uploadPickedFile = useCallback(async (file: File) => {
    const request = pendingFilePickerRef.current;
    pendingFilePickerRef.current = null;
    if (!request) return;
    setFilePickerBusy(true);
    try {
      const uploaded = await uploadKnowledgeFile(file, request.blockID);
      const target = editor.getBlock(request.blockID);
      if (!target) throw new Error("原内容位置已变化，请重新选择文件。");
      const update = typeof uploaded === "string" ? { props: { name: file.name, url: uploaded } } : uploaded;
      if (request.action === "replace") {
        editor.updateBlock(target, update as never);
      } else {
        editor.setTextCursorPosition(target, "end");
        insertOrUpdateBlockForSlashMenu(editor, { type: request.blockType, ...update } as never);
        if (request.recentID) recordKnowledgeSlashRecentID(request.recentID);
      }
    } catch (failure) {
      if (failure instanceof Error && failure.message === "原内容位置已变化，请重新选择文件。") actionFeedbackRef.current?.(failure.message);
    } finally {
      setFilePickerBusy(false);
    }
  }, [editor, uploadKnowledgeFile]);
  const insertSlashItem = useCallback((item: KnowledgeSlashMenuItem) => {
    if (item.disabledReason) {
      actionFeedbackRef.current?.(item.disabledReason);
      return;
    }
    if (item.filePicker) {
      let blockID = "";
      try { blockID = editor.getTextCursorPosition().block.id; } catch { /* The menu cannot insert without an active editor cursor. */ }
      if (!blockID) {
        actionFeedbackRef.current?.("无法确定文件插入位置，请重新定位光标。");
        return;
      }
      requestFilePick({ action: "insert", blockID, recentID: item.id, ...item.filePicker });
      return;
    }
    if (item.formulaInput) {
      try { editor.getTextCursorPosition(); } catch {
        actionFeedbackRef.current?.("无法确定公式插入位置，请重新定位光标。");
        return;
      }
      setFormulaSource("");
      setFormulaInput({ ...item.formulaInput, recentID: item.id });
      return;
    }
    recordKnowledgeSlashRecentID(item.id);
    item.onItemClick();
  }, [editor, requestFilePick]);
  const formulaResult = useMemo(() => renderSafeLatex(formulaSource, formulaInput?.displayMode === "block"), [formulaInput?.displayMode, formulaSource]);
  const closeFormulaInput = useCallback(() => { setFormulaInput(null); setFormulaSource(""); editor.focus(); }, [editor]);
  const insertFormula = useCallback(() => {
    if (!formulaInput || !formulaSource.trim() || formulaResult.error) return;
    try {
      if (formulaInput.displayMode === "block") insertOrUpdateBlockForSlashMenu(editor, { type: "formula", content: formulaSource.trim() } as never);
      else editor.insertInlineContent([{ type: "inlineFormula", content: formulaSource.trim() }] as never, { updateSelection: true });
      recordKnowledgeSlashRecentID(formulaInput.recentID);
      setFormulaInput(null);
      setFormulaSource("");
      editor.focus();
    } catch {
      actionFeedbackRef.current?.("公式插入位置已变化，请重新插入。");
    }
  }, [editor, formulaInput, formulaResult.error, formulaSource]);
  const formattingToolbar = useCallback((props: FormattingToolbarProps) => <KnowledgeFormattingToolbar {...props} blockLink={blockLink} authorizeContentAction={authorizeContentAction} onFeedback={onActionFeedback} filePickerBusy={filePickerBusy} onFilePick={requestFilePick} />, [authorizeContentAction, blockLink, filePickerBusy, onActionFeedback, requestFilePick]);
  const sideMenu = useCallback((props: SideMenuProps) => <KnowledgeSideMenu {...props} blockLink={blockLink} authorizeContentAction={authorizeContentAction} onFeedback={onActionFeedback} />, [authorizeContentAction, blockLink, onActionFeedback]);

  const currentPresence = () => {
    let cursorBlockID = "";
    let selectionBlockID = "";
    try { cursorBlockID = editor.getTextCursorPosition().block.id; } catch { /* Selection can be outside the editor. */ }
    try {
      const selected = editor.getSelection()?.blocks || [];
      selectionBlockID = selected.length > 0 ? selected[selected.length - 1].id : "";
    } catch { /* BlockNote has no active selection. */ }
    return { cursorBlockID: cursorBlockID || undefined, selectionBlockID: selectionBlockID || undefined };
  };

  const emitDocument = () => {
    const next = serializeDocumentBlocks(editor.document as never);
    if (next === emitted.current && !collaboration?.initializeFromBody) return;
    const previous = emitted.current;
    emitted.current = next;
    if (!collaboration) {
      onChange(next);
      return;
    }
    const presence = currentPresence();
    onChange(next, {
      editedBlockIDs: changedDocumentBlockIDs(previous, next),
      ...presence,
    });
  };

  const emitPresence = () => {
    if (!collaboration || readOnly) return;
    const presence = currentPresence();
    onPresence?.(presence.cursorBlockID, presence.selectionBlockID);
  };

  useEffect(() => {
    if (readOnly || !insertMarkdownRequest || insertedMarkdownRequestRef.current === insertMarkdownRequest.id) return;
    insertedMarkdownRequestRef.current = insertMarkdownRequest.id;
    try {
      const blocks = editor.tryParseMarkdownToBlocks(insertMarkdownRequest.markdown);
      if (blocks.length === 0) throw new Error("AI 结果没有可插入内容");
      let reference = editor.document[editor.document.length - 1];
      try { reference = editor.getTextCursorPosition().block; } catch { /* Insert after the document tail when the editor has no cursor. */ }
      editor.insertBlocks(blocks, reference, "after");
      emitDocument();
      actionFeedbackRef.current?.("AI 候选内容已追加到当前草稿，尚未发布。");
    } catch (failure) {
      actionFeedbackRef.current?.(failure instanceof Error ? failure.message : "AI 结果插入失败");
    }
  }, [editor, insertMarkdownRequest, readOnly]);

  const emitCommentAnchor = () => {
    if (!onCommentAnchor) return;
    try {
      const selection = editor.getSelection();
      const blocks = selection?.blocks || [editor.getTextCursorPosition().block];
      if (blocks.length !== 1) {
        onCommentAnchor(undefined);
        return;
      }
      const selectedText = editor.getSelectedText().replace(/\s+/g, " ").trim();
      const quote = Array.from(selectedText || documentBlockCommentQuote(blocks[0])).slice(0, 1024).join("");
      onCommentAnchor(quote ? { nodeID: blocks[0].id, quote } : undefined);
    } catch {
      onCommentAnchor(undefined);
    }
  };

  useEffect(() => {
    if (collaboration) {
      if (seeded.current || !collaboration.initializeFromBody) return;
      seeded.current = true;
      applying.current = true;
      const next = parseDocumentBlocks(body);
      editor.replaceBlocks(editor.document, next.length ? next as never : [{ id: "initialBlockId", type: "paragraph", content: "" }] as never);
      queueMicrotask(() => { applying.current = false; emitDocument(); });
      return;
    }
    if (body === emitted.current) return;
    applying.current = true;
    const next = parseDocumentBlocks(body);
    editor.replaceBlocks(editor.document, next.length ? next as never : [{ type: "paragraph", content: "" }] as never);
    emitted.current = body;
    queueMicrotask(() => { applying.current = false; });
  }, [body, collaboration, editor]);

  useEffect(() => editor.onChange(() => {
    if (applying.current || readOnly) return;
    emitDocument();
  }, false), [editor, readOnly, collaboration, onChange]);

  useEffect(() => {
    const revealKey = `${initialBlockID || ""}:${blockHighlightRevision}`;
    if (!initialBlockID || revealedBlockID.current === revealKey) return;
    let cancelled = false, highlightTimer = 0, retryTimer = 0, attempts = 0;
    const reveal = () => {
      if (cancelled || !editor.getBlock(initialBlockID)) return false;
      const root = editor.domElement;
      const element = root && [...root.querySelectorAll<HTMLElement>('[data-node-type="blockContainer"][data-id]')].find(candidate => candidate.dataset.id === initialBlockID);
      if (!element) return false;
      revealedBlockID.current = revealKey;
      element.classList.add("knowledge-block-deep-link-target");
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!readOnly) {
        editor.setTextCursorPosition(initialBlockID, "start");
        editor.focus();
      }
      highlightTimer = window.setTimeout(() => element.classList.remove("knowledge-block-deep-link-target"), 3200);
      return true;
    };
    const retry = () => { attempts += 1; if (!reveal() && !cancelled && attempts < 50) retryTimer = window.setTimeout(retry, 80); };
    retry();
    return () => { cancelled = true; window.clearTimeout(retryTimer); window.clearTimeout(highlightTimer); };
  }, [body, blockHighlightRevision, editor, initialBlockID, readOnly]);

  useEffect(() => {
    const root = editor.domElement;
    if (!root) return;
    const clearMarkers = () => {
      root.querySelectorAll<HTMLElement>(".knowledge-block-comment-anchor").forEach(element => element.classList.remove("knowledge-block-comment-anchor", "is-active", "is-resolved"));
      root.querySelectorAll<HTMLElement>(".knowledge-block-comment-marker").forEach(element => element.remove());
    };
    const renderMarkers = () => {
      clearMarkers();
      const blocks = [...root.querySelectorAll<HTMLElement>('[data-node-type="blockContainer"][data-id]')];
      for (const marker of commentMarkers) {
        const block = blocks.find(candidate => candidate.dataset.id === marker.nodeID);
        if (!block) continue;
        block.classList.add("knowledge-block-comment-anchor");
        if (marker.active) block.classList.add("is-active");
        if (!marker.unresolved) block.classList.add("is-resolved");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "knowledge-block-comment-marker";
        button.textContent = String(marker.count);
        button.title = `${marker.count} 条评论 · ${marker.quote}`;
        button.setAttribute("aria-label", `打开此内容块的 ${marker.count} 条评论`);
        button.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          onCommentMarkerOpen?.(marker.nodeID);
        });
        block.append(button);
      }
    };
    const timers = [0, 80, 240].map(delay => window.setTimeout(renderMarkers, delay));
    return () => {
      timers.forEach(timer => window.clearTimeout(timer));
      clearMarkers();
    };
  }, [body, commentMarkers, editor, onCommentMarkerOpen]);

  const documentTransfer = <KnowledgeDocumentTransfer editor={editor} title={documentTitle} authorizeContentAction={authorizeContentAction} onFeedback={onActionFeedback} onConvertToMindNote={!readOnly && convertPage ? (nextTitle, nextBody) => convertPage("mind_note", nextTitle, nextBody) : undefined} />;
  return <div className={`knowledge-open-editor is-blocknote is-document${pageActionHost ? " has-page-action-host" : ""}`}>
    {pageActionHost ? createPortal(documentTransfer, pageActionHost) : documentTransfer}
    {formulaInput && <div className="knowledge-ai-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeFormulaInput(); }}><section className="knowledge-ai-dialog" style={{ width: "min(560px, 100%)" }} role="dialog" aria-modal="true" aria-labelledby="knowledge-formula-input-title">
      <header><div><span className="knowledge-ai-icon" aria-hidden="true"><FunctionSquare size={18} /></span><div><h3 id="knowledge-formula-input-title">{formulaInput.displayMode === "block" ? "插入公式块" : "插入行内公式"}</h3><p>输入 LaTeX，确认后才会写入正文。</p></div></div><button type="button" className="knowledge-button" aria-label="关闭公式输入" title="关闭" onClick={closeFormulaInput}><X size={16} /></button></header>
      <div className="knowledge-ai-form"><label className="knowledge-ai-prompt"><span>LaTeX 公式</span><textarea autoFocus rows={3} value={formulaSource} onChange={event => setFormulaSource(event.currentTarget.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closeFormulaInput(); } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); insertFormula(); } }} placeholder={formulaInput.displayMode === "block" ? String.raw`例如：\sum_{i=1}^{n} i = \frac{n(n+1)}{2}` : String.raw`例如：E = mc^2`} /></label></div>
      {(formulaResult.html || formulaResult.error) && <article className="knowledge-ai-execution"><header><strong>预览</strong><span>{formulaInput.displayMode === "block" ? "独立公式" : "行内公式"}</span></header>{formulaResult.html ? <div className={`knowledge-formula-preview ${formulaInput.displayMode === "block" ? "is-block" : "is-inline"}`} dangerouslySetInnerHTML={{ __html: formulaResult.html }} /> : <p className="knowledge-ai-error" role="alert">{formulaResult.error}</p>}</article>}
      <footer><p>支持标准 KaTeX 语法，按 Ctrl/⌘ + Enter 可直接插入。</p><div><button type="button" className="knowledge-button" onClick={closeFormulaInput}>取消</button><button type="button" className="knowledge-button primary" disabled={!formulaSource.trim() || !!formulaResult.error} onClick={insertFormula}>插入公式</button></div></footer>
    </section></div>}
    {!readOnly && <input
      ref={filePickerInputRef}
      hidden
      type="file"
      disabled={filePickerBusy}
      aria-hidden="true"
      tabIndex={-1}
      onChange={event => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (file) void uploadPickedFile(file);
        else pendingFilePickerRef.current = null;
      }}
    />}
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      formattingToolbar={false}
      linkToolbar={!readOnly}
      slashMenu={false}
      sideMenu={false}
      filePanel={false}
      onSelectionChange={() => { emitPresence(); emitCommentAnchor(); }}
    >
      {!readOnly && <FormattingToolbarController formattingToolbar={formattingToolbar} />}
      {!readOnly && <SideMenuController sideMenu={sideMenu} />}
      {!readOnly && <SuggestionMenuController triggerCharacter="/" getItems={getSlashItems} suggestionMenuComponent={KnowledgeSlashMenu} onItemClick={insertSlashItem} />}
      {!readOnly && <SuggestionMenuController triggerCharacter="@" getItems={getMentionItems} />}
    </BlockNoteView>
  </div>;
}

export function DocumentEditor(props: KnowledgeEditorProps) {
  return <DocumentBlockEditor {...props} />;
}
