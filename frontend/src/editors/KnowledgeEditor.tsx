import { Suspense } from "react";
import type { KnowledgePageContentType } from "../types.ts";
import type { KnowledgeEditorProps } from "./types.ts";
import { getPageTypeDefinition } from "../pageTypeRegistry.ts";

export function KnowledgeEditor({ type, ...props }: KnowledgeEditorProps & { type: KnowledgePageContentType }) {
  const definition = getPageTypeDefinition(type);
  const Editor = props.readOnly ? definition.readonlyRenderer : definition.editor;
  return <Suspense fallback={<div className="knowledge-editor-loading" role="status">正在载入编辑器…</div>}>
    <Editor {...props} />
  </Suspense>;
}
