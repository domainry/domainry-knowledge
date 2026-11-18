import { kt } from "./i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { BookOpen, Files, FolderUp, Plus, Upload, X } from "lucide-react";
import { Button } from "./components.tsx";
import { PageTypeIcon, importPageTypes, pageTypeDefinitions } from "./pageTypeRegistry.ts";
import type { KnowledgePageContentType } from "./types.ts";

const creatablePageTypes = pageTypeDefinitions.filter(definition => definition.createAction?.kind === "native");

function readDroppedFile(entry: FileSystemFileEntry, relativePath: string): Promise<File> {
  return new Promise((resolve, reject) => entry.file(file => {
    if (relativePath !== file.name) Object.defineProperty(file, "webkitRelativePath", { configurable: true, value: relativePath });
    resolve(file);
  }, reject));
}

function readDirectoryBatch(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => reader.readEntries(resolve, reject));
}

async function readDroppedEntry(entry: FileSystemEntry, relativePath = entry.name): Promise<File[]> {
  if (entry.isFile) return [await readDroppedFile(entry as FileSystemFileEntry, relativePath)];
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const children: FileSystemEntry[] = [];
  while (true) {
    const batch = await readDirectoryBatch(reader);
    if (batch.length === 0) break;
    children.push(...batch);
  }
  return (await Promise.all(children.map(child => readDroppedEntry(child, `${relativePath}/${child.name}`)))).flat();
}

async function filesFromDrop(dataTransfer: DataTransfer): Promise<File[]> {
  const entries = Array.from(dataTransfer.items)
    .filter(item => item.kind === "file")
    .map(item => item.webkitGetAsEntry())
    .filter((entry): entry is FileSystemEntry => entry !== null);
  if (entries.length === 0) return Array.from(dataTransfer.files);
  return (await Promise.all(entries.map(entry => readDroppedEntry(entry)))).flat();
}

export function KnowledgeCreateMenu({ disabled = false, canCreatePage, onCreatePage, onCreateLibrary, onImportFiles, importAccept, importDisabled = false, openRequest = 0, triggerLabel = kt("knowledge.auto.0006d696d8e1ec28") }: {
  disabled?: boolean;
  canCreatePage: boolean;
  onCreatePage?: (contentType: KnowledgePageContentType) => void;
  onCreateLibrary?: () => void;
  onImportFiles?: (files: File[]) => void;
  importAccept?: string;
  importDisabled?: boolean;
  openRequest?: number;
  triggerLabel?: string;
}) {
  const unavailable = disabled || !canCreatePage || !onCreatePage;
  const importInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const details = useRef<HTMLDetailsElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  useEffect(() => {
    if (openRequest > 0 && !disabled) details.current?.setAttribute("open", "");
  }, [disabled, openRequest]);
  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      const target = event.target;
      if (details.current?.open && target instanceof Node && !details.current.contains(target)) details.current.removeAttribute("open");
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);
  useEffect(() => {
    folderInput.current?.setAttribute("webkitdirectory", "");
    folderInput.current?.setAttribute("directory", "");
  }, []);

  function commitFiles(files: File[]) {
    if (!files.length) return;
    onImportFiles?.(files);
    setUploadOpen(false);
  }

  function handleDrop(dataTransfer: DataTransfer) {
    const fallbackFiles = Array.from(dataTransfer.files);
    void filesFromDrop(dataTransfer).then(commitFiles).catch(() => commitFiles(fallbackFiles));
  }

  function openNativePicker(input: HTMLInputElement | null) {
    flushSync(() => setUploadOpen(false));
    input?.click();
  }

  return <><details ref={details} className="knowledge-create-menu" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.removeAttribute("open");
  }} onKeyDown={event => {
    if (event.key !== "Escape") return;
    event.currentTarget.removeAttribute("open");
    (event.currentTarget.querySelector("summary") as HTMLElement | null)?.focus();
  }}>
    <summary aria-label={triggerLabel} title={triggerLabel} aria-disabled={disabled} onClick={event => {
      if (disabled) event.preventDefault();
    }}><Plus size={16} /></summary>
    <div role="menu" aria-label={triggerLabel}>
      {onCreateLibrary && <button type="button" role="menuitem" disabled={disabled} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreateLibrary();
      }}><BookOpen size={16} /><span><strong>{kt("knowledge.auto.601bdf61c4cb8e38")}</strong><small>{kt("knowledge.auto.170d70cc541db069")}</small></span></button>}
      {creatablePageTypes.map(definition => <button type="button" role="menuitem" key={definition.id} disabled={unavailable} onClick={event => {
        event.currentTarget.closest("details")?.removeAttribute("open");
        onCreatePage?.(definition.id);
      }}><PageTypeIcon type={definition.id} size={16} /><span><strong>{kt("knowledge.auto.0006d696d8e1ec28")}{definition.label}</strong><small>{unavailable && !disabled ? kt("knowledge.auto.00adfc139a6a1320") : definition.description}</small></span></button>)}
      {importPageTypes.length > 0 && <button type="button" role="menuitem" disabled={disabled || importDisabled || !onImportFiles} onClick={event => {
        event.currentTarget.closest(".knowledge-create-menu")?.removeAttribute("open");
        setUploadOpen(true);
      }} onDragOver={event => {
        if (disabled || importDisabled || !onImportFiles) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }} onDrop={event => {
        if (disabled || importDisabled || !onImportFiles) return;
        event.preventDefault();
        event.currentTarget.closest(".knowledge-create-menu")?.removeAttribute("open");
        handleDrop(event.dataTransfer);
      }}><Upload size={16} /><span><strong>{kt("knowledge.upload.add")}</strong><small>{importDisabled ? kt("knowledge.auto.e2c26d0c5d453a6b") : kt("knowledge.upload.add_description")}</small></span></button>}
    </div>
    <input ref={importInput} hidden type="file" multiple accept={importAccept} disabled={disabled || importDisabled || !onImportFiles} onChange={event => {
      const files = Array.from(event.currentTarget.files || []);
      commitFiles(files);
      event.currentTarget.value = "";
    }} />
    <input ref={folderInput} hidden type="file" multiple accept={importAccept} disabled={disabled || importDisabled || !onImportFiles} onChange={event => {
      const files = Array.from(event.currentTarget.files || []);
      commitFiles(files);
      event.currentTarget.value = "";
    }} />
  </details>{uploadOpen && typeof document !== "undefined" && createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setUploadOpen(false); }} onKeyDown={event => { if (event.key === "Escape") setUploadOpen(false); }}>
    <section className="knowledge-upload-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-upload-dialog-title" onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }} onDrop={event => {
      event.preventDefault();
      handleDrop(event.dataTransfer);
    }}>
      <header><div><h2 id="knowledge-upload-dialog-title">{kt("knowledge.upload.add")}</h2><p>{kt("knowledge.upload.add_description")}</p></div><Button type="button" aria-label={kt("knowledge.auto.3aa89611cce01728")} onClick={() => setUploadOpen(false)}><X size={17} /></Button></header>
      <div className="knowledge-upload-source-options">
        <button type="button" onClick={() => openNativePicker(importInput.current)}><span><Files size={20} /></span><strong>{kt("knowledge.upload.files")}</strong><small>{kt("knowledge.upload.files_description")}</small></button>
        <button type="button" onClick={() => openNativePicker(folderInput.current)}><span><FolderUp size={20} /></span><strong>{kt("knowledge.upload.folder")}</strong><small>{kt("knowledge.upload.folder_description")}</small></button>
      </div>
      <p className="knowledge-upload-drop-hint">{kt("knowledge.upload.add_description")}</p>
    </section>
  </div>, window.document.body)}</>;
}
