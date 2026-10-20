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
  return <ol className="knowledge-pipeline" aria-label="文档处理进度">
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
    if (!file.size || file.size > maxUploadBytes) throw Error(`单文件不能超过 ${formatBytes(maxUploadBytes)}。`);
    if (!knowledgeDocumentSupports(library, file.name)) throw Error("当前文件格式不支持入库。");
    setHashProgress(0);
    const digest = await sha256(file, signal, setHashProgress);
    signal.throwIfAborted();
    if (pending && (pending.filename !== file.name || pending.bytes !== file.size || pending.sha256 !== digest)) throw Error(`请重新选择上次的“${pending.filename}”继续上传，或先结束上次重试。`);
    const operation = pending || { clientID: crypto.randomUUID(), filename: file.name, bytes: file.size, sha256: digest };
    localStorage.setItem(storageKey, JSON.stringify(operation));
    setPending(operation);
    setUploadProgress(0);
    const created = await client.uploadDocument({ libraryID, file, clientID: operation.clientID, sha256: digest, signal, onProgress: (uploaded, total) => setUploadProgress(Math.min(1, uploaded / total)) });
    localStorage.removeItem(storageKey); setPending(null); setFile(null); if (input.current) input.current.value = "";
    setSelected(created); onSelectedDocumentChange?.(created.id); setCursors([""]); setNotice(created.state === "ready" ? "文件已入库，可以检索。" : "原文件已保存，后台正在处理。可以关闭页面后再回来查看。 ");
  }

  async function remove(signal: AbortSignal) {
    if (!selected) return;
    const result = await client.deleteDocument(libraryID, selected.id, selected.revision, signal);
    setConfirmDelete(false); setPreview(false);
    if (result.state === "deleted") { setSelected(null); onSelectedDocumentChange?.(""); } else setSelected(result);
    setNotice(result.state === "deleted" ? "文档已删除。" : "文档已停止访问，后台正在清理原文件与索引。 ");
  }

  async function retry(signal: AbortSignal) {
    if (!selected || !writable || !documentCanRetry(selected)) return;
    const result = await client.retryDocument(libraryID, selected.id, selected.revision, signal);
    setSelected(result);
    setNotice("已立即重新调度当前处理阶段；不会重复提交状态不确定的远端写入。");
  }

  async function reindex(signal: AbortSignal) {
    if (!selected || !writable || !documentCanReindex(selected)) return;
    const result = await client.reindexDocument(libraryID, selected.id, selected.revision, signal);
    setSelected(result);
    setNotice("新一代索引已开始建立；当前索引在切换成功前仍可检索。");
  }

  return <section className={`knowledge-documents${embedded ? " is-embedded" : ""}`} aria-label="资料文件">
    {!embedded && <div className="knowledge-section-heading"><h3>资料文件</h3><Button disabled={loading || busy} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} />刷新</Button></div>}
    {showUploader && uploadEnabled && <div className="knowledge-upload"><label className="knowledge-file-picker"><Upload size={18} /><span>{file ? file.name : "选择本地文件"}</span><small>{file ? formatBytes(file.size) : "支持安全扫描后的文档、图片与音视频"}</small><input ref={input} type="file" accept={acceptedExtensions} disabled={busy} onChange={event => { setFile(event.target.files?.[0] || null); setError(""); }} /></label><p>单个文件最大 {formatBytes(maxUploadBytes)}{maxIndexBytes < maxUploadBytes ? `；超过 ${formatBytes(maxIndexBytes)} 时仍可保存和预览，但暂不参与全文检索。` : "。"}</p>{file && file.size > selectedIndexMaxBytes && <p className="knowledge-notice">此文件可以保存、预览和下载，但超过当前可检索处理上限，暂时不会进入全文检索。</p>}{hashProgress !== null && <p role="status">正在分段校验文件：{Math.round(hashProgress * 100)}%</p>}{uploadProgress !== null && <p role="status">正在分片上传：{Math.round(uploadProgress * 100)}% · 每片最多 8 MiB，刷新后重新选择同一文件可继续。</p>}<Button className="primary" disabled={busy || !file} onClick={() => void perform(upload)}><Upload size={15} />{hashProgress !== null ? "正在校验…" : uploadProgress !== null ? "正在上传…" : pending ? "继续上次上传" : "上传文件"}</Button></div>}
    {pending && <div className="knowledge-confirm"><p>上次上传待确认：{pending.filename}</p><Button disabled={busy} onClick={() => { localStorage.removeItem(storageKey); setPending(null); }}>结束这次重试</Button></div>}
    {error && <p role="alert" className="knowledge-error">{error}</p>}{notice && <p role="status" className="knowledge-notice">{notice}</p>}
    {!hideList && (loading ? <p className="knowledge-subtle">正在读取资料文件…</p> : page.items.length === 0 ? <p className="knowledge-subtle">还没有资料文件。</p> : <div className="knowledge-document-list">{page.items.map(item => <button key={item.id} aria-current={selected?.id === item.id ? "true" : undefined} disabled={busy} onClick={() => { setSelected(item); onSelectedDocumentChange?.(item.id); setConfirmDelete(false); setError(""); }}><FileText size={18} /><span><strong>{item.filename}</strong><small>{documentLabel(item)} · {formatBytes(item.bytes)}</small></span></button>)}</div>)}
    {!hideList && (cursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={busy || loading || cursors.length === 1} onClick={() => setCursors(value => value.slice(0, -1))}>上一页</Button><Button disabled={busy || loading || !page.next_after} onClick={() => setCursors(value => [...value, page.next_after!])}>下一页</Button></nav>}
    {selected && <section className="knowledge-document-detail"><h3>{selected.filename}</h3><p>{documentLabel(selected)} · 内容版本 v{selected.content_version} · 索引代次 g{selected.index_generation} · {library.kind === "shared" ? "继承资料库成员权限" : "仅自己可见"}</p><DocumentPipeline document={selected} /><p>{documentStatusDetail(selected)}</p>{selected.security_scanner && <p>安全策略：{selected.security_scanner} · 报告 {selected.security_report_sha256?.slice(0, 12)}</p>}{selected.error_code && <p className="knowledge-error">错误代码：{selected.error_code}</p>}<div className="knowledge-actions">{canPreviewFilename(selected.filename) && <Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => setPreview(true)}><Eye size={15} />在线预览</Button>}<Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => void perform(signal => downloadDocument(client, selected, signal))}><Download size={15} />下载原文件</Button><Button disabled={busy || library.archived || !documentCanDownload(selected)} onClick={() => { if (loadPendingTransfer(client)) setNotice("检测到上次待确认的复制或移动，将继续核对原操作。"); setTransfer({ source: selected, canMove: writable }); }}>复制／移动</Button>{writable && documentCanRetry(selected) && <Button disabled={busy || library.archived} onClick={() => void perform(retry)}><RotateCcw size={15} />立即重试</Button>}{writable && documentCanReindex(selected) && <Button disabled={busy || library.archived} onClick={() => void perform(reindex)}><RefreshCw size={15} />重新索引</Button>}{writable && <Button className="danger" disabled={busy || selected.reindexing || selected.state === "deleting" || selected.state === "deleted"} onClick={() => setConfirmDelete(true)}><Trash2 size={15} />删除</Button>}</div>{confirmDelete && <div className="knowledge-confirm"><p>确认删除“{selected.filename}”？它会立即停止检索和下载，随后清理原文件和索引。</p><div className="knowledge-actions"><Button className="danger" disabled={busy} onClick={() => void perform(remove)}>确认删除</Button><Button disabled={busy} onClick={() => setConfirmDelete(false)}>保留文档</Button></div></div>}</section>}
    {preview && selected && <FilePreviewDialog source={knowledgeDocumentPreviewSource(client, selected)} formatError={formatError} onClose={() => setPreview(false)} />}
    {transfer && <KnowledgeDocumentTransferDialog client={client} source={transfer.source} canMove={transfer.canMove} formatError={formatError} onClose={() => { setTransfer(null); setRefresh(value => value + 1); }} onOpenTarget={libraryID => { setTransfer(null); onOpenLibrary?.(libraryID); setRefresh(value => value + 1); }} />}
  </section>;
}
