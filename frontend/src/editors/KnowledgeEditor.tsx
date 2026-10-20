import { lazy, Suspense } from "react";
import type { KnowledgePageContentType } from "../types.ts";
import type { KnowledgeEditorProps } from "./types.ts";

const DocumentEditor = lazy(() => import("./BlockNoteEditor.tsx").then(module => ({ default: module.DocumentEditor })));
const MindNoteEditor = lazy(() => import("./BlockNoteEditor.tsx").then(module => ({ default: module.MindNoteEditor })));
const GridEditor = lazy(() => import("./GridEditor.tsx").then(module => ({ default: module.GridEditor })));
const SpreadsheetEditor = lazy(() => import("./SpreadsheetEditor.tsx").then(module => ({ default: module.SpreadsheetEditor })));
const PresentationEditor = lazy(() => import("./CanvasEditor.tsx").then(module => ({ default: module.PresentationEditor })));
const WhiteboardEditor = lazy(() => import("./CanvasEditor.tsx").then(module => ({ default: module.WhiteboardEditor })));
const FormEditor = lazy(() => import("./FormEditor.tsx").then(module => ({ default: module.FormEditor })));
const MindMapEditor = lazy(() => import("./MindMapEditor.tsx").then(module => ({ default: module.MindMapEditor })));
const FlowchartEditor = lazy(() => import("./FlowchartEditor.tsx").then(module => ({ default: module.FlowchartEditor })));

const editors: Record<KnowledgePageContentType, React.LazyExoticComponent<React.ComponentType<KnowledgeEditorProps>>> = {
  document: DocumentEditor,
  multidimensional_table: GridEditor,
  spreadsheet: SpreadsheetEditor,
  presentation: PresentationEditor,
  form: FormEditor,
  mind_note: MindNoteEditor,
  whiteboard: WhiteboardEditor,
  mind_map: MindMapEditor,
  flowchart: FlowchartEditor,
};

export function KnowledgeEditor({ type, ...props }: KnowledgeEditorProps & { type: KnowledgePageContentType }) {
  const Editor = editors[type];
  return <Suspense fallback={<div className="knowledge-editor-loading" role="status">正在载入编辑器…</div>}>
    <Editor {...props} />
  </Suspense>;
}
