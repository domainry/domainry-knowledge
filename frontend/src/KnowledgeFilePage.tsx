import { kt, ktf } from "./i18n/runtime.ts";
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
  const [loading, setLoading] = useState(!!reference), [error, setError] = useState(reference ? "" : kt("knowledge.auto.b7ae88e3ef2d9ad2"));
  const [preview, setPreview] = useState(false), [downloading, setDownloading] = useState(false), [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!reference) { setDocument(null); setLoading(false); setError(kt("knowledge.auto.b7ae88e3ef2d9ad2")); return; }
    const abort = new AbortController();
    setLoading(true); setError("");
    void client.getDocument(libraryID, reference.document_id, abort.signal).then(value => {
      if (!abort.signal.aborted) setDocument(value);
    }).catch(failure => {
      if (!abort.signal.aborted) { setDocument(null); setError(ktf("knowledge.auto.23bb69256a4d2600", { value0: formatError(failure) })); }
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

  if (loading) return <section className="knowledge-file-page is-loading" role="status"><RefreshCw size={24} className="knowledge-pulse" /><p>{kt("knowledge.auto.71b005c1eb5ff4c1")}</p></section>;
  if (!document) return <section className="knowledge-file-page is-unavailable" role="alert"><FileWarning size={30} /><h3>{reference?.title || kt("knowledge.auto.25924f78da001431")}</h3><p>{error || kt("knowledge.auto.e2f7ee7d0315a65c")}</p><Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.710b1958f2ab42a6")}</Button></section>;

  const downloadable = documentCanDownload(document);
  return <section className={`knowledge-file-page is-${document.state}`}>
    <PageActionPortal host={pageActionHost}><Button disabled={!downloadable || downloading} onClick={() => void download()}><Download size={15} />{downloading ? kt("knowledge.auto.369ca5e19c59093f") : kt("knowledge.auto.76420433f22d1c80")}</Button></PageActionPortal>
    <div className="knowledge-file-page-icon"><span>{document.filename.split(".").at(-1)?.slice(0, 4).toUpperCase() || "FILE"}</span></div>
    <div className="knowledge-file-page-details">
      <span className={`knowledge-file-state is-${document.security_status}`}>{documentLabel(document)}</span>
      <h3>{document.filename}</h3>
      <p>{formatBytes(document.bytes)} {kt("knowledge.auto.5622801d937e54dd")}{document.content_version} · SHA-256 {document.sha256.slice(0, 12)}…</p>
      <p>{documentStatusDetail(document)}</p>
      {document.error_code && <p className="knowledge-error">{document.error_code}</p>}
      {error && <p className="knowledge-error" role="alert">{error}</p>}
      <div className="knowledge-actions">
        {canPreviewFilename(document.filename) && <Button className="primary" disabled={!downloadable} onClick={() => setPreview(true)}><Eye size={15} />{kt("knowledge.auto.2fd122f806b88695")}</Button>}
        <Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.802a407c774302aa")}</Button>
      </div>
    </div>
    {preview && <FilePreviewDialog source={knowledgeDocumentPreviewSource(client, document)} downloadSource={knowledgePageDocumentDownloadSource(client, pageID, document)} formatError={formatError} onClose={() => setPreview(false)} />}
  </section>;
}
