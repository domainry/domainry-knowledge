import { useRef } from "react";
import { BookOpen, Plus, Upload } from "lucide-react";
import { PageTypeIcon, importPageTypes, pageTypeDefinitions } from "./pageTypeRegistry.ts";
import type { KnowledgePageContentType } from "./types.ts";

const creatablePageTypes = pageTypeDefinitions.filter(definition => definition.createAction?.kind === "native");

export function KnowledgeCreateMenu({ disabled = false, canCreatePage, onCreatePage, onCreateLibrary, onImportFile, importAccept, importDisabled = false, importing = false }: {
  disabled?: boolean;
  canCreatePage: boolean;
  onCreatePage?: (contentType: KnowledgePageContentType) => void;
  onCreateLibrary?: () => void;
  onImportFile?: (file: File) => void;
  importAccept?: string;
  importDisabled?: boolean;
  importing?: boolean;
}) {
  const unavailable = disabled || !canCreatePage || !onCreatePage;
  const importInput = useRef<HTMLInputElement>(null);
  return <details className="knowledge-create-menu" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.removeAttribute("open");
  }} onKeyDown={event => {
    if (event.key !== "Escape") return;
    event.currentTarget.removeAttribute("open");
    (event.currentTarget.querySelector("summary") as HTMLElement | null)?.focus();
  }}>
    <summary aria-label="新增" title="新增" aria-disabled={disabled} onClick={event => {
      if (disabled) event.preventDefault();
    }}><Plus size={16} /></summary>
    <div role="menu" aria-label="新增">
      {onCreateLibrary && <button type="button" role="menuitem" disabled={disabled} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreateLibrary();
      }}><BookOpen size={16} /><span><strong>新增知识库</strong><small>填写信息并创建团队知识库</small></span></button>}
      {creatablePageTypes.map(definition => <button type="button" role="menuitem" key={definition.id} disabled={unavailable} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreatePage?.(definition.id);
      }}><PageTypeIcon type={definition.id} size={16} /><span><strong>新增{definition.label}</strong><small>{unavailable && !disabled ? "请先创建团队知识库" : definition.description}</small></span></button>)}
      {importPageTypes.length > 0 && <button type="button" role="menuitem" disabled={disabled || importDisabled || importing || !onImportFile} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        importInput.current?.click();
      }}><Upload size={16} /><span><strong>{importing ? "正在上传文件…" : "上传文件"}</strong><small>{importDisabled ? "当前知识库未配置文件存储" : "上传后作为文件页面加入当前节点"}</small></span></button>}
    </div>
    <input ref={importInput} hidden type="file" accept={importAccept} disabled={disabled || importDisabled || importing || !onImportFile} onChange={event => {
      const file = event.currentTarget.files?.[0];
      if (file) onImportFile?.(file);
      event.currentTarget.value = "";
    }} />
  </details>;
}
