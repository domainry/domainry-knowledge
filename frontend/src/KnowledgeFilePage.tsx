import { useEffect, useState } from "react";
import { Download, Eye, FileWarning, RefreshCw } from "lucide-react";
import { Button } from "./components.tsx";
import { documentCanDownload, documentLabel, documentStatusDetail } from "./document.ts";
import { FilePreviewDialog } from "./FilePreviewDialog.tsx";
import { canPreviewFilename, downloadFile, knowledgeDocumentPreviewSource, knowledgePageDocumentDownloadSource } from "./file-preview.ts";
import { parseFilePageContent } from "./file-page.ts";
import { PageActionPortal } from "./editors/PageActionPortal.tsx";
import type { KnowledgeClient, KnowledgeDocument } from "./types.ts";

function formatBytes(value: number) {
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GiB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(1)} MiB`;
  return `${Math.max(0.1, value / 1024).toFixed(1)} KiB`;
}

export function KnowledgeFilePage({ client, libraryID, pageID, content, pageActionHost, formatError }: { client: KnowledgeClient; libraryID: string; pageID: string; content: string; pageActionHost?: HTMLElement | null; formatError(error: unknown): string }) {
  const reference = parseFilePageContent(content);
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(!!reference), [error, setError] = useState(reference ? "" : "文件页面引用无效。");
  const [preview, setPreview] = useState(false), [downloading, setDownloading] = useState(false), [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!reference) { setDocument(null); setLoading(false); setError("文件页面引用无效。"); return; }
    const abort = new AbortController();
    setLoading(true); setError("");
    void client.getDocument(libraryID, reference.document_id, abort.signal).then(value => {
      if (!abort.signal.aborted) setDocument(value);
    }).catch(failure => {
      if (!abort.signal.aborted) { setDocument(null); setError(`原文件当前不可用：${formatError(failure)}`); }
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, libraryID, reference?.document_id, revision]);

  async function download() {
    if (!document || downloading) return;
    setDownloading(true); setError("");
    try { await downloadFile(knowledgePageDocumentDownloadSource(client, pageID, document), AbortSignal.timeout(2 * 60 * 60 * 1000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { setDownloading(false); }
  }

  if (loading) return <section className="knowledge-file-page is-loading" role="status"><RefreshCw size={24} className="knowledge-pulse" /><p>正在核对原文件状态…</p></section>;
  if (!document) return <section className="knowledge-file-page is-unavailable" role="alert"><FileWarning size={30} /><h3>{reference?.title || "文件不可用"}</h3><p>{error || "原文件已删除、隔离或当前账号无权访问。"}</p><Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />重新核对</Button></section>;

  const downloadable = documentCanDownload(document);
  return <section className={`knowledge-file-page is-${document.state}`}>
    <PageActionPortal host={pageActionHost}><Button disabled={!downloadable || downloading} onClick={() => void download()}><Download size={15} />{downloading ? "正在下载…" : "导出"}</Button></PageActionPortal>
    <div className="knowledge-file-page-icon"><span>{document.filename.split(".").at(-1)?.slice(0, 4).toUpperCase() || "FILE"}</span></div>
    <div className="knowledge-file-page-details">
      <span className={`knowledge-file-state is-${document.security_status}`}>{documentLabel(document)}</span>
      <h3>{document.filename}</h3>
      <p>{formatBytes(document.bytes)} · 原件版本 v{document.content_version} · SHA-256 {document.sha256.slice(0, 12)}…</p>
      <p>{documentStatusDetail(document)}</p>
      {document.error_code && <p className="knowledge-error">{document.error_code}</p>}
      {error && <p className="knowledge-error" role="alert">{error}</p>}
      <div className="knowledge-actions">
        {canPreviewFilename(document.filename) && <Button className="primary" disabled={!downloadable} onClick={() => setPreview(true)}><Eye size={15} />在线预览</Button>}
        <Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />刷新状态</Button>
      </div>
    </div>
    {preview && <FilePreviewDialog source={knowledgeDocumentPreviewSource(client, document)} downloadSource={knowledgePageDocumentDownloadSource(client, pageID, document)} formatError={formatError} onClose={() => setPreview(false)} />}
  </section>;
}
