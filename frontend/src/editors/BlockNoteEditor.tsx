import { useEffect, useRef } from "react";
import type { Block } from "@blocknote/core";
import { zh } from "@blocknote/core/locales";
import { SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";
import "@blocknote/ariakit/style.css";
import { encodeKnowledgeYjsState } from "../collaboration.ts";
import { parseDocumentBlocks, serializeDocumentBlocks } from "../documentContent.ts";
import type { KnowledgeEditorProps } from "./types.ts";
import { getKnowledgeSlashMenuItems, knowledgeDocumentSchema } from "./documentBlocks.tsx";

function mindNoteBlocks(body: string): Block[] | undefined {
  try {
    const value = JSON.parse(body) as { nodes?: Block[] };
    return Array.isArray(value.nodes) && value.nodes.length > 0 ? value.nodes : undefined;
  } catch {
    return undefined;
  }
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

function DocumentBlockEditor({ body, readOnly, collaboration, onChange, onPresence }: KnowledgeEditorProps) {
  const applying = useRef(false), emitted = useRef(body), seeded = useRef(false);
  const editor = useCreateBlockNote({
    schema: knowledgeDocumentSchema,
    dictionary: zh,
    ...(collaboration ? { collaboration: { fragment: collaboration.fragment, user: collaboration.user } } : { initialContent: parseDocumentBlocks(body).length ? parseDocumentBlocks(body) as never : undefined }),
  }, [collaboration?.fragment]);

  const emitDocument = () => {
    const next = serializeDocumentBlocks(editor.document as never);
    if (next === emitted.current && !collaboration?.initializeFromBody) return;
    const previous = emitted.current;
    emitted.current = next;
    if (!collaboration) {
      onChange(next);
      return;
    }
    let cursorBlockID = "";
    try { cursorBlockID = editor.getTextCursorPosition().block.id; } catch { /* Selection can be outside the editor while mounting. */ }
    const state = encodeKnowledgeYjsState(collaboration.document);
    onChange(next, {
      yjsUpdate: state,
      yjsState: state,
      editedBlockIDs: changedDocumentBlockIDs(previous, next),
      cursorBlockID: cursorBlockID || undefined,
      selectionBlockID: cursorBlockID || undefined,
    });
  };

  const emitPresence = () => {
    if (!collaboration || readOnly) return;
    let cursorBlockID = "";
    try { cursorBlockID = editor.getTextCursorPosition().block.id; } catch { /* Selection can be outside the editor. */ }
    onPresence?.(cursorBlockID || undefined, cursorBlockID || undefined);
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

  return <div className="knowledge-open-editor is-blocknote is-document">
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      formattingToolbar={!readOnly}
      linkToolbar={!readOnly}
      slashMenu={false}
      sideMenu={!readOnly}
      onChange={() => {
        if (applying.current || readOnly) return;
        emitDocument();
      }}
      onSelectionChange={emitPresence}
    >
      {!readOnly && <SuggestionMenuController triggerCharacter="/" getItems={query => getKnowledgeSlashMenuItems(editor, query)} />}
    </BlockNoteView>
  </div>;
}

export function DocumentEditor(props: KnowledgeEditorProps) {
  return <DocumentBlockEditor {...props} />;
}

export function MindNoteEditor(props: KnowledgeEditorProps) {
  const { body, readOnly, onChange } = props;
  const applying = useRef(false), emitted = useRef(body);
  const editor = useCreateBlockNote({ dictionary: zh, initialContent: mindNoteBlocks(body) });
  useEffect(() => {
    if (body === emitted.current) return;
    applying.current = true;
    const next = mindNoteBlocks(body);
    editor.replaceBlocks(editor.document, next?.length ? next : [{ type: "bulletListItem", content: "" }]);
    emitted.current = body;
    queueMicrotask(() => { applying.current = false; });
  }, [body, editor]);
  return <div className="knowledge-open-editor is-blocknote is-mind_note"><BlockNoteView editor={editor} editable={!readOnly} formattingToolbar={!readOnly} linkToolbar={!readOnly} slashMenu={!readOnly} sideMenu={!readOnly} onChange={() => {
    if (applying.current || readOnly) return;
    const next = JSON.stringify({ nodes: editor.document });
    if (next !== emitted.current) { emitted.current = next; onChange(next); }
  }} /></div>;
}
