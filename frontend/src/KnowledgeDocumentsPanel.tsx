import { kt, ktf } from "./i18n/runtime.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eye, FileText, RefreshCw, RotateCcw, Trash2, Upload } from "lucide-react";
import { Button, defaultErrorMessage } from "./components.tsx";
import { documentCanDownload, documentCanReindex, documentCanRetry, documentCanWrite, documentIndexMaxBytes, documentIndexMaxBytesForFilename, documentLabel, documentPipelinePosition, documentPipelineStages, documentStatusDetail, documentUploadMaxBytes, knowledgeDocumentAccept, knowledgeDocumentSupports, sha256 } from "./document.ts";
import { FilePreviewDialog } from "./FilePreviewDialog.tsx";
import { KnowledgeDocumentTransferDialog, loadPendingTransfer } from "./KnowledgeDocumentTransferDialog.tsx";
import { canPreviewFilename, downloadDocument, knowledgeDocumentPreviewSource } from "./file-preview.ts";
import type { KnowledgeClient, KnowledgeDocument, KnowledgeDocumentPage, KnowledgeLibrary, KnowledgeTransferSource } from "./types.ts";

type PendingUpload = { clientID: string; filename: string; bytes: number; sha256: string };

function pendingUpload(raw: string | null): PendingUpload | null {
  if (!raw || raw.length > 2048) return null;
  try {
    const value = JSON.parse(raw) as PendingUpload;
    return value && /^[a-zA-Z0-9_.:-]{1,96}$/.test(value.clientID) && value.filename && Number.isSafeInteger(value.bytes) && value.bytes > 0 && /^[a-f0-9]{64}$/.test(value.sha256) ? value : null;
  } catch { return null; }
}

function formatBytes(value: number) {
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(value % (1024 ** 3) ? 1 : 0)} GiB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(1)} MiB`;
  return `${(value / 1024).toFixed(1)} KiB`;
}

function DocumentPipeline({ document }: { document: KnowledgeDocument }) {
  const position = documentPipelinePosition(document);
  const failed = document.processing_stage === "failed";
  return <ol className="knowledge-pipeline" aria-label={kt("knowledge.auto.f9c2b0e71d3fe7ff")}>
    {documentPipelineStages.map((stage, index) => <li key={stage.key} data-state={index < position ? "done" : index === position ? failed ? "failed" : "active" : "pending"}><span>{index < position ? "✓" : index + 1}</span><small>{stage.label}</small></li>)}
  </ol>;
}

export function KnowledgeDocumentsPanel({ client, initialLibrary, formatError = defaultErrorMessage, onBusyChange, onOpenLibrary, embedded = false, hideList = false, showUploader = true, selectedDocumentID, onSelectedDocumentChange, onDocumentsChange }: { client: KnowledgeClient; initialLibrary: KnowledgeLibrary; formatError?: (error: unknown) => string; onBusyChange?: (busy: boolean) => void; onOpenLibrary?: (libraryID: string) => void; embedded?: boolean; hideList?: boolean; showUploader?: boolean; selectedDocumentID?: string; onSelectedDocumentChange?: (documentID: string) => void; onDocumentsChange?: (documents: KnowledgeDocument[]) => void }) {
  const libraryID = initialLibrary.id;
  const storageKey = `domainry-knowledge-upload:${client.scope?.() || "default"}:${libraryID}`;
  const [library, setLibrary] = useState(initialLibrary);
  const [page, setPage] = useState<KnowledgeDocumentPage>({ items: [], complete: true });
  const [cursors, setCursors] = useState([""]), [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState<KnowledgeDocument | null>(null), [preview, setPreview] = useState(false), [confirmDelete, setConfirmDelete] = useState(false);
  const [transfer, setTransfer] = useState<{ source: KnowledgeTransferSource; canMove: boolean } | null>(null);
  const [file, setFile] = useState<File | null>(null), [pending, setPending] = useState<PendingUpload | null>(() => pendingUpload(localStorage.getItem(storageKey)));
  const [hashProgress, setHashProgress] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const cursor = cursors.at(-1) || "";
  const setOperationBusy = useCallback((value: boolean) => { setBusy(value); onBusyChange?.(value); }, [onBusyChange]);

  useEffect(() => setLibrary(initialLibrary), [initialLibrary]);
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError("");
    void Promise.all([
      client.getLibrary(libraryID, abort.signal),
      client.listDocuments(libraryID, cursor, 50, abort.signal),
    ]).then(([current, documents]) => {
      if (abort.signal.aborted) return;
      setLibrary(current); setPage(documents); onDocumentsChange?.(documents.items);
      setSelected(value => { const id = selectedDocumentID === undefined ? value?.id : selectedDocumentID; return id ? documents.items.find(item => item.id === id) || null : null; });
    }).catch(failure => { if (!abort.signal.aborted) { setPage({ items: [], complete: true }); setSelected(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, cursor, formatError, libraryID, onDocumentsChange, refresh, selectedDocumentID]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (!busy && document.visibilityState !== "hidden") setRefresh(value => value + 1); }, 5000);
    return () => window.clearInterval(timer);
  }, [busy]);

  const writable = documentCanWrite(library);
  const uploadEnabled = writable && !!library.documents_configured && !library.archived;
  const maxUploadBytes = documentUploadMaxBytes(library);
  const maxIndexBytes = documentIndexMaxBytes(library);
  const acceptedExtensions = knowledgeDocumentAccept(library);
  const selectedIndexMaxBytes = file ? documentIndexMaxBytesForFilename(library, file.name) : maxIndexBytes;

  async function perform(action: (signal: AbortSignal) => Promise<void>) {
    if (busy) return;
    setOperationBusy(true); setError(""); setNotice("");
    const abort = new AbortController();
    try { await action(AbortSignal.any([abort.signal, AbortSignal.timeout(2 * 60 * 60 * 1000)])); }
    catch (failure) { if (!(failure instanceof DOMException && failure.name === "AbortError")) setError(formatError(failure)); }
    finally { setHashProgress(null); setUploadProgress(null); setOperationBusy(false); setRefresh(value => value + 1); }
  }

  async function upload(signal: AbortSignal) {
    if (!file || !uploadEnabled) return;
    if (!file.size || file.size > maxUploadBytes) throw Error(ktf("knowledge.auto.7f91cb5ff9df464b", { value0: formatBytes(maxUploadBytes) }));
    if (!knowledgeDocumentSupports(library, file.name)) throw Error(kt("knowledge.auto.4701a51f2d507975"));
    setHashProgress(0);
    const digest = await sha256(file, signal, setHashProgress);
    signal.throwIfAborted();
    if (pending && (pending.filename !== file.name || pending.bytes !== file.size || pending.sha256 !== digest)) throw Error(ktf("knowledge.auto.aba9d8dd746c55eb", { value0: pending.filename }));
    const operation = pending || { clientID: crypto.randomUUID(), filename: file.name, bytes: file.size, sha256: digest };
    localStorage.setItem(storageKey, JSON.stringify(operation));
    setPending(operation);
    setUploadProgress(0);
    const created = await client.uploadDocument({ libraryID, file, clientID: operation.clientID, sha256: digest, signal, onProgress: (uploaded, total) => setUploadProgress(Math.min(1, uploaded / total)) });
    localStorage.removeItem(storageKey); setPending(null); setFile(null); if (input.current) input.current.value = "";
    setSelected(created); onSelectedDocumentChange?.(created.id); setCursors([""]); setNotice(created.state === "ready" ? kt("knowledge.auto.57c9b74f1b18f658") : kt("knowledge.auto.eaeb3977e0aa2ef1"));
  }

  async function remove(signal: AbortSignal) {
    if (!selected) return;
    const result = await client.deleteDocument(libraryID, selected.id, selected.revision, signal);
    setConfirmDelete(false); setPreview(false);
    if (result.state === "deleted") { setSelected(null); onSelectedDocumentChange?.(""); } else setSelected(result);
    setNotice(result.state === "deleted" ? kt("knowledge.auto.114fcc128626193f") : kt("knowledge.auto.fffb153d67c5c0cb"));
  }

  async function retry(signal: AbortSignal) {
    if (!selected || !writable || !documentCanRetry(selected)) return;
    const result = await client.retryDocument(libraryID, selected.id, selected.revision, signal);
    setSelected(result);
    setNotice(kt("knowledge.auto.5d01fb27f237efb2"));
  }

  async function reindex(signal: AbortSignal) {
    if (!selected || !writable || !documentCanReindex(selected)) return;
    const result = await client.reindexDocument(libraryID, selected.id, selected.revision, signal);
    setSelected(result);
    setNotice(kt("knowledge.auto.550dc8b9fc7c86b5"));
  }

  return <section className={`knowledge-documents${embedded ? " is-embedded" : ""}`} aria-label={kt("knowledge.auto.2b932e19b158faaf")}>
    {!embedded && <div className="knowledge-section-heading"><h3>{kt("knowledge.auto.2b932e19b158faaf")}</h3><Button disabled={loading || busy} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.aee88743413144a2")}</Button></div>}
    {showUploader && uploadEnabled && <div className="knowledge-upload"><label className="knowledge-file-picker"><Upload size={18} /><span>{file ? file.name : kt("knowledge.auto.33e69e113e978c4e")}</span><small>{file ? formatBytes(file.size) : kt("knowledge.auto.e2c30d7af2ba6874")}</small><input ref={input} type="file" accept={acceptedExtensions} disabled={busy} onChange={event => { setFile(event.target.files?.[0] || null); setError(""); }} /></label><p>{kt("knowledge.auto.03ab68254c5e2542")}{formatBytes(maxUploadBytes)}{maxIndexBytes < maxUploadBytes ? ktf("knowledge.auto.66daa1c2944e2706", { value0: formatBytes(maxIndexBytes) }) : "。"}</p>{file && file.size > selectedIndexMaxBytes && <p className="knowledge-notice">{kt("knowledge.auto.00d20bd1b0ef2f18")}</p>}{hashProgress !== null && <p role="status">{kt("knowledge.auto.56f8b97e8ca27056")}{Math.round(hashProgress * 100)}%</p>}{uploadProgress !== null && <p role="status">{kt("knowledge.auto.4631bd1452e706bc")}{Math.round(uploadProgress * 100)}{kt("knowledge.auto.f460278822a02d3d")}</p>}<Button className="primary" disabled={busy || !file} onClick={() => void perform(upload)}><Upload size={15} />{hashProgress !== null ? kt("knowledge.auto.84717e2cadd0c96c") : uploadProgress !== null ? kt("knowledge.auto.6148b38691e3018e") : pending ? kt("knowledge.auto.373681808bc7185e") : kt("knowledge.auto.bb5caa9c59767eb8")}</Button></div>}
    {pending && <div className="knowledge-confirm"><p>{kt("knowledge.auto.e0d11c8bbdda3595")}{pending.filename}</p><Button disabled={busy} onClick={() => { localStorage.removeItem(storageKey); setPending(null); }}>{kt("knowledge.auto.943fa0cbcb5fc08a")}</Button></div>}
    {error && <p role="alert" className="knowledge-error">{error}</p>}{notice && <p role="status" className="knowledge-notice">{notice}</p>}
    {!hideList && (loading ? <p className="knowledge-subtle">{kt("knowledge.auto.9ac6f8c5c49c9b26")}</p> : page.items.length === 0 ? <p className="knowledge-subtle">{kt("knowledge.auto.72e141ca0442ebc9")}</p> : <div className="knowledge-document-list">{page.items.map(item => <button key={item.id} aria-current={selected?.id === item.id ? "true" : undefined} disabled={busy} onClick={() => { setSelected(item); onSelectedDocumentChange?.(item.id); setConfirmDelete(false); setError(""); }}><FileText size={18} /><span><strong>{item.filename}</strong><small>{documentLabel(item)} · {formatBytes(item.bytes)}</small></span></button>)}</div>)}
    {!hideList && (cursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={busy || loading || cursors.length === 1} onClick={() => setCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={busy || loading || !page.next_after} onClick={() => setCursors(value => [...value, page.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
    {selected && <section className="knowledge-document-detail"><h3>{selected.filename}</h3><p>{documentLabel(selected)} {kt("knowledge.auto.1e94fe9671cecc7c")}{selected.content_version} {kt("knowledge.auto.e41883e531d40e47")}{selected.index_generation} · {library.kind === "shared" ? kt("knowledge.auto.c69ffb738fece3b8") : kt("knowledge.auto.33c7823a56bde000")}</p><DocumentPipeline document={selected} /><p>{documentStatusDetail(selected)}</p>{selected.security_scanner && <p>{kt("knowledge.auto.6686336334940c84")}{selected.security_scanner} {kt("knowledge.auto.d4a1e5a3458121ed")}{selected.security_report_sha256?.slice(0, 12)}</p>}{selected.error_code && <p className="knowledge-error">{kt("knowledge.auto.620311e1dffdd09b")}{selected.error_code}</p>}<div className="knowledge-actions">{canPreviewFilename(selected.filename) && <Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => setPreview(true)}><Eye size={15} />{kt("knowledge.auto.2fd122f806b88695")}</Button>}<Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => void perform(signal => downloadDocument(client, selected, signal))}><Download size={15} />{kt("knowledge.auto.aa1d4263667a8086")}</Button><Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => { if (loadPendingTransfer(client)) setNotice(kt("knowledge.auto.ddb03f06b8315623")); setTransfer({ source: selected, canMove: writable }); }}>{kt("knowledge.auto.0864d6103c14dfee")}</Button>{writable && documentCanRetry(selected) && <Button disabled={busy || library.archived} onClick={() => void perform(retry)}><RotateCcw size={15} />{kt("knowledge.auto.77c30e62fbac3631")}</Button>}{writable && documentCanReindex(selected) && <Button disabled={busy || library.archived} onClick={() => void perform(reindex)}><RefreshCw size={15} />{kt("knowledge.auto.364459a1896f41c0")}</Button>}{writable && <Button className="danger" disabled={busy || selected.reindexing || selected.state === "deleting" || selected.state === "deleted"} onClick={() => setConfirmDelete(true)}><Trash2 size={15} />{kt("knowledge.auto.2f9daa828907b93f")}</Button>}</div>{confirmDelete && <div className="knowledge-confirm"><p>{kt("knowledge.auto.18c982ddaf01d113")}{selected.filename}{kt("knowledge.auto.e16a0f14cfcd498c")}</p><div className="knowledge-actions"><Button className="danger" disabled={busy} onClick={() => void perform(remove)}>{kt("knowledge.auto.a3ea3c17b401bd2f")}</Button><Button disabled={busy} onClick={() => setConfirmDelete(false)}>{kt("knowledge.auto.18b15a4bb0ef13fd")}</Button></div></div>}</section>}
    {preview && selected && <FilePreviewDialog source={knowledgeDocumentPreviewSource(client, selected)} formatError={formatError} onClose={() => setPreview(false)} />}
    {transfer && <KnowledgeDocumentTransferDialog client={client} source={transfer.source} canMove={transfer.canMove} formatError={formatError} onClose={() => { setTransfer(null); setRefresh(value => value + 1); }} onOpenTarget={libraryID => { setTransfer(null); onOpenLibrary?.(libraryID); setRefresh(value => value + 1); }} />}
  </section>;
}
