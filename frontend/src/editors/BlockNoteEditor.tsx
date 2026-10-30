import { kt, ktf } from "../i18n/runtime.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Block, BlockNoteEditor } from "@blocknote/core";
import { defaultToggledState, insertOrUpdateBlockForSlashMenu, isToggleOpen } from "@blocknote/core";
import { ar, de, en, es, fr, it, ja, ko, pt, zh, zhTW } from "@blocknote/core/locales";
import { withCollaboration } from "@blocknote/core/yjs";
import { SideMenuExtension, SyntaxHighlightingExtension } from "@blocknote/core/extensions";
import { BlockColorsItem, DragHandleButton, FormattingToolbar, FormattingToolbarController, getFormattingToolbarItems, SideMenu, SideMenuController, SuggestionMenuController, TableColumnHeaderItem, TableRowHeaderItem, useBlockNoteEditor, useComponentsContext, useCreateBlockNote, useEditorState, useExtensionState, usePortalElement } from "@blocknote/react";
import type { FormattingToolbarProps, SideMenuProps } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";
import { locales as multiColumnLocales } from "@blocknote/xl-multi-column";
import { ChevronDown, ChevronRight, Clipboard, Copy, Crop, Download, FileJson, FileText, FunctionSquare, Link2, ListTree, MessageSquarePlus, Printer, RefreshCw, RotateCcw, Scissors, Trash2, Type, X } from "lucide-react";
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
import { useKnowledgeLocale } from "../i18n/runtime.ts";
import { blockNoteLocaleKey, multiColumnLocaleKey } from "../i18n/thirdParty.ts";
import { boundKnowledgeDocumentSelection } from "../hostIntegration.ts";

const blockNoteLocales = { en, zh, zhTW, ja, ko, es, pt, fr, de, it, ar };

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
type KnowledgeSelectionActionPosition = {
  left: number;
  top: number;
  placement: "above" | "below";
};

function knowledgeSelectionFocusRect(root: HTMLElement): DOMRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer as Element
    : range.commonAncestorContainer.parentElement;
  if (!container || !root.contains(container)) return null;

  const rects = [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0);
  if (rects.length === 0) return null;
  try {
    if (selection.focusNode) {
      const focus = document.createRange();
      focus.setStart(selection.focusNode, selection.focusOffset);
      focus.collapse(true);
      if (focus.compareBoundaryPoints(Range.START_TO_START, range) === 0) return rects[0];
    }
  } catch {
    // Fall back to the last visual line when the browser cannot compare ranges.
  }
  return rects[rects.length - 1];
}

function knowledgeSelectionBlockRect(root: HTMLElement, blockIDs: readonly string[]): DOMRect | null {
  const selected = new Set(blockIDs);
  const blocks = [...root.querySelectorAll<HTMLElement>('[data-node-type="blockContainer"][data-id]')];
  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    if (selected.has(blocks[index].dataset.id || "")) return blocks[index].getBoundingClientRect();
  }
  return null;
}

function knowledgeSelectionVisibleBounds(root: HTMLElement) {
  const bounds = { top: 0, right: window.innerWidth, bottom: window.innerHeight, left: 0 };
  for (let ancestor = root.parentElement; ancestor; ancestor = ancestor.parentElement) {
    const style = window.getComputedStyle(ancestor);
    const rect = ancestor.getBoundingClientRect();
    if (/auto|scroll|hidden|clip/.test(style.overflowX)) {
      bounds.left = Math.max(bounds.left, rect.left);
      bounds.right = Math.min(bounds.right, rect.right);
    }
    if (/auto|scroll|hidden|clip/.test(style.overflowY)) {
      bounds.top = Math.max(bounds.top, rect.top);
      bounds.bottom = Math.min(bounds.bottom, rect.bottom);
    }
  }
  return bounds;
}

function knowledgeSelectionActionPosition(root: HTMLElement, blockIDs: readonly string[], action: HTMLElement | null): KnowledgeSelectionActionPosition | null {
  const target = knowledgeSelectionFocusRect(root) || knowledgeSelectionBlockRect(root, blockIDs);
  if (!target) return null;

  const rootRect = root.getBoundingClientRect();
  const bounds = knowledgeSelectionVisibleBounds(root);
  const width = action?.offsetWidth || 168;
  const height = action?.offsetHeight || 34;
  const gap = 8;
  const gutter = 10;
  const desiredLeft = target.left + target.width / 2;
  const minimumLeft = bounds.left + width / 2 + gutter;
  const maximumLeft = bounds.right - width / 2 - gutter;
  const left = minimumLeft <= maximumLeft
    ? Math.min(Math.max(desiredLeft, minimumLeft), maximumLeft)
    : (bounds.left + bounds.right) / 2;

  const below = target.bottom + gap;
  const above = target.top - gap - height;
  const fitsBelow = below + height <= bounds.bottom - gutter;
  const fitsAbove = above >= bounds.top + gutter;
  const placement = fitsBelow || !fitsAbove ? "below" : "above";
  const desiredTop = placement === "below" ? below : above;
  const minimumTop = bounds.top + gutter;
  const maximumTop = Math.max(minimumTop, bounds.bottom - height - gutter);
  const top = Math.min(Math.max(desiredTop, minimumTop), maximumTop);

  return {
    left: left - rootRect.left,
    top: top - rootRect.top,
    placement,
  };
}

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
    label={kt("knowledge.auto.d934840566aabcd7")}
    mainTooltip={busy ? kt("knowledge.auto.4cc5c825fcbe1727") : kt("knowledge.auto.61d142e68896b132")}
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
      <Components.FormattingToolbar.Button className="bn-button" label={kt("knowledge.auto.ef7e40e0c2d39fa7")} mainTooltip={kt("knowledge.auto.ef7e40e0c2d39fa7")} icon={<Crop size={16} />} isSelected={cropped} onClick={() => setOpen(value => !value)} />
    </Components.Generic.Popover.Trigger>
    <Components.Generic.Popover.Content className="bn-popover-content knowledge-image-properties" variant="form-popover">
      <label><span>{kt("knowledge.auto.e9e31d4f87815d53")}</span><input value={props.name} maxLength={512} onChange={event => update({ name: event.currentTarget.value })} placeholder={kt("knowledge.auto.4fcb30796c15e23d")} /></label>
      <label><span>{kt("knowledge.auto.5e137136f6aa5d6a")}</span><input value={props.caption} maxLength={2048} onChange={event => update({ caption: event.currentTarget.value })} placeholder={kt("knowledge.auto.1830df7f95124280")} /></label>
      <fieldset><legend>{kt("knowledge.auto.03834fd0c8119b91")}</legend><div className="knowledge-image-aspects">{knowledgeImageCropAspects.map(aspect => <button key={aspect} type="button" aria-pressed={props.cropAspect === aspect} onClick={() => update({ cropAspect: aspect })}>{aspect === "original" ? kt("knowledge.auto.4b1db520af460460") : aspect}</button>)}</div></fieldset>
      <label><span>{kt("knowledge.auto.c10994fbb9e75783")}<b>{props.cropX}%</b></span><input type="range" min="0" max="100" step="1" value={props.cropX} disabled={!cropped} onChange={event => update({ cropX: Number(event.currentTarget.value) })} /></label>
      <label><span>{kt("knowledge.auto.1138948da476724d")}<b>{props.cropY}%</b></span><input type="range" min="0" max="100" step="1" value={props.cropY} disabled={!cropped} onChange={event => update({ cropY: Number(event.currentTarget.value) })} /></label>
      <label><span>{kt("knowledge.auto.45215b6544af38a0")}<b>{props.cropZoom}%</b></span><input type="range" min="100" max="300" step="1" value={props.cropZoom} disabled={!cropped} onChange={event => update({ cropZoom: Number(event.currentTarget.value) })} /></label>
      <button type="button" className="knowledge-image-reset" onClick={() => update({ cropAspect: "original", cropX: 50, cropY: 50, cropZoom: 100 })}><RotateCcw size={14} />{kt("knowledge.auto.76709ce82501d0c2")}</button>
    </Components.Generic.Popover.Content>
  </Components.Generic.Popover.Root>;
}

type KnowledgeBlockActionProps = {
  blockLink?: (blockID: string) => string;
  authorizeContentAction?: KnowledgeEditorProps["authorizeContentAction"];
  onFeedback?: (message: string) => void;
};

const blockConversionItems = [
  { get label() { return kt("knowledge.auto.d661c3d96d53ebc0"); }, type: "paragraph", props: {} },
  { get label() { return kt("knowledge.auto.a75d25cd026c6374"); }, type: "heading", props: { level: 1, isToggleable: false } },
  { get label() { return kt("knowledge.auto.d69947f39796fc11"); }, type: "heading", props: { level: 2, isToggleable: false } },
  { get label() { return kt("knowledge.auto.7d96cb13e68934a4"); }, type: "heading", props: { level: 3, isToggleable: false } },
  { get label() { return kt("knowledge.auto.9ee5773e25a9d739"); }, type: "bulletListItem", props: {} },
  { get label() { return kt("knowledge.auto.5d0bb2712dc8b22b"); }, type: "numberedListItem", props: {} },
  { get label() { return kt("knowledge.auto.c5ced4b36c072ffc"); }, type: "checkListItem", props: {} },
  { get label() { return kt("knowledge.auto.5d9ddf1c258cac8f"); }, type: "toggleListItem", props: {} },
  { get label() { return kt("knowledge.auto.e0ec651f0dae7cf3"); }, type: "quote", props: {} },
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
      if (!authorizeContentAction) throw new Error(kt("knowledge.auto.c91475ac5cf19ca4"));
      await authorizeContentAction("copy");
      await writeBlocksToClipboard(editor, blocks);
      if (cut) editor.removeBlocks(blocks);
      onFeedback?.(ktf("knowledge.auto.8a2df9946e7801f3", { value0: blocks.length, value1: cut ? kt("knowledge.auto.410a8e8a6bf253ac") : kt("knowledge.auto.63d90d977348ab1f") }));
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.7bcffeeab729ed5c"));
    }
  };
  const copyLinks = async () => {
    if (!blockLink) return;
    try {
      await writeTextToClipboard(blocks.map(block => blockLink(block.id)).join("\n"));
      onFeedback?.(ktf("knowledge.auto.1eb0928c719f9a0e", { value0: blocks.length }));
    } catch {
      onFeedback?.(kt("knowledge.auto.082dc0c483c7f3e0"));
    }
  };
  const convert = (type: string, props: Record<string, boolean | number | string>) => {
    editor.transact(() => blocks.forEach(block => editor.updateBlock(block, { type, props } as never)));
    onFeedback?.(ktf("knowledge.auto.864c9321fd73fa43", { value0: blocks.length }));
  };
  const toggleCollapse = () => {
    collapsible.forEach(block => defaultToggledState.set(block, !collapse));
    setFoldRevision(value => value + 1);
    onFeedback?.(ktf("knowledge.auto.8a2df9946e7801f3", { value0: collapsible.length, value1: collapse ? kt("knowledge.common.collapse") : kt("knowledge.auto.00bd3960fea8ea98") }));
  };
  return <Components.Generic.Menu.Dropdown className="bn-menu-dropdown bn-drag-handle-menu knowledge-block-actions">
    <Components.Generic.Menu.Label>{blocks.length > 1 ? ktf("knowledge.auto.80efcafaed1c4d61", { value0: blocks.length }) : kt("knowledge.auto.c1381c419c85a96b")}</Components.Generic.Menu.Label>
    {authorizeContentAction && <Components.Generic.Menu.Item className="bn-menu-item" icon={<Copy size={16} />} onClick={() => void copy(false)}>{kt("knowledge.auto.63d90d977348ab1f")}</Components.Generic.Menu.Item>}
    {authorizeContentAction && <Components.Generic.Menu.Item className="bn-menu-item" icon={<Scissors size={16} />} onClick={() => void copy(true)}>{kt("knowledge.auto.410a8e8a6bf253ac")}</Components.Generic.Menu.Item>}
    <Components.Generic.Menu.Item className="bn-menu-item" icon={<Link2 size={16} />} disabled={!blockLink} onClick={() => void copyLinks()}>{kt("knowledge.auto.a7992ff56c90b03b")}</Components.Generic.Menu.Item>
    <Components.Generic.Menu.Divider className="knowledge-block-menu-divider" />
    {canConvert ? <Components.Generic.Menu.Root position="right" sub portalElement={portalElement}>
      <Components.Generic.Menu.Trigger sub><Components.Generic.Menu.Item className="bn-menu-item" icon={<Type size={16} />} subTrigger>{kt("knowledge.auto.562406cf8b498a2a")}</Components.Generic.Menu.Item></Components.Generic.Menu.Trigger>
      <Components.Generic.Menu.Dropdown className="bn-menu-dropdown knowledge-block-convert-menu" sub>{blockConversionItems.map(item => <Components.Generic.Menu.Item key={`${item.type}:${JSON.stringify(item.props)}`} className="bn-menu-item" checked={blocks.every(block => block.type === item.type && Object.entries(item.props).every(([key, value]) => block.props[key] === value))} onClick={() => convert(item.type, item.props)}>{item.label}</Components.Generic.Menu.Item>)}</Components.Generic.Menu.Dropdown>
    </Components.Generic.Menu.Root> : <Components.Generic.Menu.Item className="bn-menu-item" icon={<Type size={16} />} disabled>{kt("knowledge.auto.4016d27b48e8ee0f")}</Components.Generic.Menu.Item>}
    <Components.Generic.Menu.Item className="bn-menu-item" icon={collapse ? <ChevronDown size={16} /> : <ChevronRight size={16} />} disabled={collapsible.length === 0} onClick={toggleCollapse}>{collapse ? kt("knowledge.auto.6b4e7c7bba7fc079") : kt("knowledge.auto.7961fc08cfc4eea7")}</Components.Generic.Menu.Item>
    <BlockColorsItem>{kt("knowledge.auto.1aced5ecbf667167")}</BlockColorsItem>
    <TableRowHeaderItem>{kt("knowledge.auto.933e281f11a902d3")}</TableRowHeaderItem>
    <TableColumnHeaderItem>{kt("knowledge.auto.5ee1f7b461c54692")}</TableColumnHeaderItem>
    <Components.Generic.Menu.Divider className="knowledge-block-menu-divider" />
    <Components.Generic.Menu.Item className="bn-menu-item knowledge-block-delete" icon={<Trash2 size={16} />} onClick={() => { editor.removeBlocks(blocks); onFeedback?.(ktf("knowledge.auto.2d83b348f844d8d8", { value0: blocks.length })); }}>{kt("knowledge.auto.2f9daa828907b93f")}{blocks.length > 1 ? ktf("knowledge.auto.c7b73e5c86ab3fa9", { value0: blocks.length }) : ""}</Components.Generic.Menu.Item>
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
      if (!authorizeContentAction) throw new Error(kt("knowledge.auto.c91475ac5cf19ca4"));
      await authorizeContentAction("copy");
      await writeBlocksToClipboard(editor, selectedBlocks);
      if (cut) editor.removeBlocks(selectedBlocks);
      onFeedback?.(ktf("knowledge.auto.8a2df9946e7801f3", { value0: selectedBlocks.length, value1: cut ? kt("knowledge.auto.410a8e8a6bf253ac") : kt("knowledge.auto.63d90d977348ab1f") }));
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.7bcffeeab729ed5c"));
    }
  };
  return <FormattingToolbar {...props}>
    {getFormattingToolbarItems(props.blockTypeSelectItems).filter(item => item.key !== "replaceFileButton")}
    <KnowledgeAuthorizedFileReplaceButton busy={filePickerBusy} onPick={onFilePick} />
    <KnowledgeImagePropertiesButton />
    {selectedBlocks.length > 1 && <>
      <span className="knowledge-block-selection-count">{kt("knowledge.auto.7ecf1cde648680d2")}{selectedBlocks.length} {kt("knowledge.auto.b69dbc5c8c49b07e")}</span>
      {authorizeContentAction && <button type="button" className="knowledge-block-selection-action" title={kt("knowledge.auto.c6e01bb56ae196c3")} aria-label={kt("knowledge.auto.c6e01bb56ae196c3")} onClick={() => void copySelection(false)}><Clipboard size={15} /></button>}
      {authorizeContentAction && <button type="button" className="knowledge-block-selection-action" title={kt("knowledge.auto.0352fee8ae0cbdec")} aria-label={kt("knowledge.auto.0352fee8ae0cbdec")} onClick={() => void copySelection(true)}><Scissors size={15} /></button>}
      {blockLink && <button type="button" className="knowledge-block-selection-action" title={kt("knowledge.auto.bab98daa53f53de2")} aria-label={kt("knowledge.auto.bab98daa53f53de2")} onClick={() => void writeTextToClipboard(selectedBlocks.map(block => blockLink(block.id)).join("\n")).then(() => onFeedback?.(ktf("knowledge.auto.1eb0928c719f9a0e", { value0: selectedBlocks.length })), () => onFeedback?.(kt("knowledge.auto.082dc0c483c7f3e0")))}><Link2 size={15} /></button>}
      <button type="button" className="knowledge-block-selection-action is-danger" title={kt("knowledge.auto.a8617dfb917ca595")} aria-label={kt("knowledge.auto.a8617dfb917ca595")} onClick={() => { editor.removeBlocks(selectedBlocks); onFeedback?.(ktf("knowledge.auto.2d83b348f844d8d8", { value0: selectedBlocks.length })); }}><Trash2 size={15} /></button>
    </>}
  </FormattingToolbar>;
}

function KnowledgeDocumentTransfer({ editor, title, authorizeContentAction, onFeedback, onConvertToMindNote }: { editor: BlockNoteEditor<any, any, any>; title: string; authorizeContentAction?: KnowledgeEditorProps["authorizeContentAction"]; onFeedback?(message: string): void; onConvertToMindNote?(title: string, body: string): Promise<void> }) {
  const details = useRef<HTMLDetailsElement>(null);
  const run = async (format: KnowledgeDocumentExportFormat) => {
    try {
      if (!authorizeContentAction) throw new Error(kt("knowledge.auto.5838a06d4990c165"));
      await authorizeContentAction(format === "pdf" ? "print" : "export");
      onFeedback?.(exportKnowledgeDocument(editor, title, format));
      if (details.current) details.current.open = false;
    } catch (failure) {
      onFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.4f526dcc9989d1bf"));
    }
  };
  const convert = async () => {
    if (!onConvertToMindNote) return;
    if (details.current) details.current.open = false;
    try {
      if (!authorizeContentAction) throw new Error(kt("knowledge.auto.c79fd658db132faf"));
      await authorizeContentAction("duplicate");
      await onConvertToMindNote(ktf("knowledge.auto.0431425ed392a80b", { value0: title }), canonicalMindNoteContent(documentBlocksToMindNote(editor.document)));
    }
    catch (failure) { onFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.70bcffc1cdc4c27a")); }
  };
  if (!authorizeContentAction) return null;
  return <div className="knowledge-document-transfer no-print">
    <details ref={details}>
      <summary className="knowledge-page-header-action" aria-label={kt("knowledge.auto.fa7881119f17edb9")}><Download size={14} />{kt("knowledge.auto.76420433f22d1c80")}</summary>
      <div role="menu" aria-label={kt("knowledge.auto.ee2487b1df174033")}>
        <button type="button" role="menuitem" onClick={() => void run("json")}><FileJson size={16} /><span><strong>Block JSON</strong><small>{kt("knowledge.auto.116420443b65d273")}</small></span></button>
        <button type="button" role="menuitem" onClick={() => void run("markdown")}><FileText size={16} /><span><strong>Markdown</strong><small>{kt("knowledge.auto.b549ec46eb439225")}</small></span></button>
        <button type="button" role="menuitem" onClick={() => void run("pdf")}><Printer size={16} /><span><strong>PDF</strong><small>{kt("knowledge.auto.ced7e3c6457c1541")}</small></span></button>
        {onConvertToMindNote && <button type="button" role="menuitem" onClick={() => void convert()}><ListTree size={16} /><span><strong>{kt("knowledge.auto.1ebb1987efcbd90c")}</strong><small>{kt("knowledge.auto.5058e2765becebda")}</small></span></button>}
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

function DocumentBlockEditor({ body, readOnly, documentTitle = kt("knowledge.auto.fba1208c267ba57c"), collaboration, mentions, tasks, polls, dynamicBlocks, initialBlockID, blockHighlightRevision = 0, commentMarkers = [], onCommentMarkerOpen, blockLink, insertMarkdownRequest, pageActionHost, authorizeContentAction, onActionFeedback, uploadFile, fileUploadsEnabled, fileUploadAccept, readFile, convertPage, addDocumentSelection, addDocumentSelectionBusy = false, onChange, onPresence, onCommentAnchor }: KnowledgeEditorProps) {
  const locale = useKnowledgeLocale();
  const applying = useRef(false), emitted = useRef(body), seeded = useRef(false);
  const revealedBlockID = useRef("");
  const uploadFileRef = useRef(uploadFile), readFileRef = useRef(readFile);
  const filePickerInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFilePickerRef = useRef<KnowledgeFilePickerRequest | null>(null);
  const editorRootRef = useRef<HTMLDivElement | null>(null);
  const selectionActionRef = useRef<HTMLDivElement | null>(null);
  const [filePickerBusy, setFilePickerBusy] = useState(false);
  const [documentSelection, setDocumentSelection] = useState<ReturnType<typeof boundKnowledgeDocumentSelection>>(null);
  const [selectionActionPosition, setSelectionActionPosition] = useState<KnowledgeSelectionActionPosition | null>(null);
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
  const dictionary = {
    ...blockNoteLocales[blockNoteLocaleKey[locale]],
    multi_column: multiColumnLocales[multiColumnLocaleKey[locale]],
  };
  const baseOptions = {
    schema: knowledgeDocumentSchema,
    dictionary,
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
  useEffect(() => {
    // BlockNote does not expose a locale setter. Menus read the editor
    // dictionary during render, so update the existing instance and preserve
    // selection, undo history, and the collaboration binding.
    Object.assign(editor.dictionary, dictionary);
  }, [editor, locale]);
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
      actionFeedbackRef.current?.(kt("knowledge.auto.ef1927290c9cd5fc"));
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
      if (!target) throw new Error(kt("knowledge.auto.1df46e53c6a68264"));
      const update = typeof uploaded === "string" ? { props: { name: file.name, url: uploaded } } : uploaded;
      if (request.action === "replace") {
        editor.updateBlock(target, update as never);
      } else {
        editor.setTextCursorPosition(target, "end");
        insertOrUpdateBlockForSlashMenu(editor, { type: request.blockType, ...update } as never);
        if (request.recentID) recordKnowledgeSlashRecentID(request.recentID);
      }
    } catch (failure) {
      if (failure instanceof Error && failure.message === kt("knowledge.auto.1df46e53c6a68264")) actionFeedbackRef.current?.(failure.message);
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
        actionFeedbackRef.current?.(kt("knowledge.auto.350d103c663fa621"));
        return;
      }
      requestFilePick({ action: "insert", blockID, recentID: item.id, ...item.filePicker });
      return;
    }
    if (item.formulaInput) {
      try { editor.getTextCursorPosition(); } catch {
        actionFeedbackRef.current?.(kt("knowledge.auto.2efd011ca89b5d39"));
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
      actionFeedbackRef.current?.(kt("knowledge.auto.2a628cf75fa57b4e"));
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
      if (blocks.length === 0) throw new Error(kt("knowledge.auto.c5ca059d9a05d09a"));
      let reference = editor.document[editor.document.length - 1];
      try { reference = editor.getTextCursorPosition().block; } catch { /* Insert after the document tail when the editor has no cursor. */ }
      editor.insertBlocks(blocks, reference, "after");
      emitDocument();
      actionFeedbackRef.current?.(kt("knowledge.auto.15a829baf522b1ab"));
    } catch (failure) {
      actionFeedbackRef.current?.(failure instanceof Error ? failure.message : kt("knowledge.auto.b5e011251299e2df"));
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

  const emitDocumentSelection = () => {
    if (!addDocumentSelection) { setDocumentSelection(null); return; }
    try {
      const selection = editor.getSelection();
      const selectedText = editor.getSelectedText().replace(/\s+/g, " ").trim();
      if (!selection && !selectedText) { setDocumentSelection(null); return; }
      const blocks = selection?.blocks?.length ? selection.blocks : [editor.getTextCursorPosition().block];
      const quote = selectedText || blocks.map(block => documentBlockCommentQuote(block)).filter(Boolean).join("\n");
      setDocumentSelection(quote ? boundKnowledgeDocumentSelection(blocks.map(block => block.id), quote) : null);
    } catch {
      setDocumentSelection(null);
    }
  };

  useEffect(() => {
    if (!documentSelection) {
      setSelectionActionPosition(null);
      return;
    }
    let frame = 0;
    const placeAction = () => {
      const root = editorRootRef.current;
      const action = selectionActionRef.current;
      const position = root ? knowledgeSelectionActionPosition(root, documentSelection.blockIds, action) : null;
      setSelectionActionPosition(position);
      if (!action && position) frame = window.requestAnimationFrame(placeAction);
    };
    const updatePosition = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(placeAction);
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (editorRootRef.current) resizeObserver?.observe(editorRootRef.current);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [documentSelection]);

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
        button.title = ktf("knowledge.auto.bae530031eeaa8db", { value0: marker.count, value1: marker.quote });
        button.setAttribute("aria-label", ktf("knowledge.auto.9513fee146b9dbc2", { value0: marker.count }));
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
  return <div ref={editorRootRef} className={`knowledge-open-editor is-blocknote is-document${pageActionHost ? " has-page-action-host" : ""}`}>
    {pageActionHost ? createPortal(documentTransfer, pageActionHost) : documentTransfer}
    {addDocumentSelection && documentSelection && selectionActionPosition && <div
      ref={selectionActionRef}
      className="knowledge-host-selection-action no-print"
      role="toolbar"
      aria-label={kt("knowledge.host.add_selection")}
      data-placement={selectionActionPosition.placement}
      style={{ left: selectionActionPosition.left, top: selectionActionPosition.top }}
    >
      <button type="button" disabled={addDocumentSelectionBusy} aria-busy={addDocumentSelectionBusy} onMouseDown={event => event.preventDefault()} onClick={() => void addDocumentSelection(documentSelection)}>
        {addDocumentSelectionBusy ? <RefreshCw className="knowledge-spin" size={15} /> : <MessageSquarePlus size={15} />}
        {addDocumentSelectionBusy ? kt("knowledge.host.adding_selection") : kt("knowledge.host.add_selection")}
      </button>
    </div>}
    {formulaInput && <div className="knowledge-ai-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeFormulaInput(); }}><section className="knowledge-ai-dialog" style={{ width: "min(560px, 100%)" }} role="dialog" aria-modal="true" aria-labelledby="knowledge-formula-input-title">
      <header><div><span className="knowledge-ai-icon" aria-hidden="true"><FunctionSquare size={18} /></span><div><h3 id="knowledge-formula-input-title">{formulaInput.displayMode === "block" ? kt("knowledge.auto.141011974735b33b") : kt("knowledge.auto.8a72923fe94cf05e")}</h3><p>{kt("knowledge.auto.20991e960561ec30")}</p></div></div><button type="button" className="knowledge-button" aria-label={kt("knowledge.auto.983e76438106283b")} title={kt("knowledge.auto.3fd47edce45b3603")} onClick={closeFormulaInput}><X size={16} /></button></header>
      <div className="knowledge-ai-form"><label className="knowledge-ai-prompt"><span>{kt("knowledge.auto.7e202a3add63fbb1")}</span><textarea autoFocus rows={3} value={formulaSource} onChange={event => setFormulaSource(event.currentTarget.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closeFormulaInput(); } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); insertFormula(); } }} placeholder={formulaInput.displayMode === "block" ? kt("knowledge.auto.b3134335dc9ac53f") : kt("knowledge.auto.013f292aca2d50c4")} /></label></div>
      {(formulaResult.html || formulaResult.error) && <article className="knowledge-ai-execution"><header><strong>{kt("knowledge.auto.13d61fea9f174905")}</strong><span>{formulaInput.displayMode === "block" ? kt("knowledge.auto.868aa34dd36ebcae") : kt("knowledge.auto.e3efe95c7f617abf")}</span></header>{formulaResult.html ? <div className={`knowledge-formula-preview ${formulaInput.displayMode === "block" ? "is-block" : "is-inline"}`} dangerouslySetInnerHTML={{ __html: formulaResult.html }} /> : <p className="knowledge-ai-error" role="alert">{formulaResult.error}</p>}</article>}
      <footer><p>{kt("knowledge.auto.16ddf846aff3203f")}</p><div><button type="button" className="knowledge-button" onClick={closeFormulaInput}>{kt("knowledge.auto.2cd0f3be8738a86c")}</button><button type="button" className="knowledge-button primary" disabled={!formulaSource.trim() || !!formulaResult.error} onClick={insertFormula}>{kt("knowledge.auto.85fbe03102bdb89f")}</button></div></footer>
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
      onSelectionChange={() => { emitPresence(); emitCommentAnchor(); emitDocumentSelection(); }}
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
