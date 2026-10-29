import { kt } from "./i18n/runtime.ts";
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
    <summary aria-label={kt("knowledge.auto.0006d696d8e1ec28")} title={kt("knowledge.auto.0006d696d8e1ec28")} aria-disabled={disabled} onClick={event => {
      if (disabled) event.preventDefault();
    }}><Plus size={16} /></summary>
    <div role="menu" aria-label={kt("knowledge.auto.0006d696d8e1ec28")}>
      {onCreateLibrary && <button type="button" role="menuitem" disabled={disabled} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreateLibrary();
      }}><BookOpen size={16} /><span><strong>{kt("knowledge.auto.601bdf61c4cb8e38")}</strong><small>{kt("knowledge.auto.b94c2e7f144ea29c")}</small></span></button>}
      {creatablePageTypes.map(definition => <button type="button" role="menuitem" key={definition.id} disabled={unavailable} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreatePage?.(definition.id);
      }}><PageTypeIcon type={definition.id} size={16} /><span><strong>{kt("knowledge.auto.0006d696d8e1ec28")}{definition.label}</strong><small>{unavailable && !disabled ? kt("knowledge.auto.0e0bf0fe317b269e") : definition.description}</small></span></button>)}
      {importPageTypes.length > 0 && <button type="button" role="menuitem" disabled={disabled || importDisabled || importing || !onImportFile} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        importInput.current?.click();
      }}><Upload size={16} /><span><strong>{importing ? kt("knowledge.auto.98d7eb0850ca162b") : kt("knowledge.auto.bb5caa9c59767eb8")}</strong><small>{importDisabled ? kt("knowledge.auto.e2c26d0c5d453a6b") : kt("knowledge.auto.6ef563be6e65cc0b")}</small></span></button>}
    </div>
    <input ref={importInput} hidden type="file" accept={importAccept} disabled={disabled || importDisabled || importing || !onImportFile} onChange={event => {
      const file = event.currentTarget.files?.[0];
      if (file) onImportFile?.(file);
      event.currentTarget.value = "";
    }} />
  </details>;
}
