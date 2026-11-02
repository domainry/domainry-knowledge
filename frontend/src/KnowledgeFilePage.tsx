import { kt, ktf } from "./i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { Download, FileWarning, RefreshCw, Send, Upload } from "lucide-react";
import { Button } from "./components.tsx";
import { documentCanDownload, documentLabel, documentStatusDetail } from "./document.ts";
import { FilePreview } from "./FilePreviewDialog.tsx";
import { downloadFile, knowledgeDocumentPreviewSource, knowledgePageDocumentDownloadSource } from "./file-preview.ts";
import { parseFilePageContent } from "./file-page.ts";
import { PageActionPortal } from "./editors/PageActionPortal.tsx";
import type { KnowledgeClient, KnowledgeDocument } from "./types.ts";

export type KnowledgeFilePageProps = {
  client: KnowledgeClient;
  libraryID: string;
  pageID: string;
  content: string;
  pageActionHost?: HTMLElement | null;
  canReplace?: boolean;
  replacing?: boolean;
  replaceAccept?: string;
  onReplace?(file: File): void;
  canPublish?: boolean;
  publishing?: boolean;
  onPublish?(): void;
  formatError(error: unknown): string;
};

export function KnowledgeFilePage({ client, libraryID, pageID, content, pageActionHost, canReplace = false, replacing = false, replaceAccept, onReplace, canPublish = false, publishing = false, onPublish, formatError }: KnowledgeFilePageProps) {
  const reference = parseFilePageContent(content);
  const replacementInput = useRef<HTMLInputElement | null>(null);
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(!!reference), [error, setError] = useState(reference ? "" : kt("knowledge.auto.b7ae88e3ef2d9ad2"));
  const [downloading, setDownloading] = useState(false), [revision, setRevision] = useState(0);

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

  const downloadable = !!document && documentCanDownload(document);
  const actions = <PageActionPortal host={pageActionHost}>
    {downloadable && <Button disabled={downloading || replacing || publishing} onClick={() => void download()}><Download size={15} />{downloading ? kt("knowledge.auto.369ca5e19c59093f") : kt("knowledge.auto.76420433f22d1c80")}</Button>}
    {canReplace && onReplace && <><input ref={replacementInput} className="knowledge-visually-hidden" type="file" accept={replaceAccept} disabled={replacing || publishing} onChange={event => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) onReplace(file); }} /><Button className="primary" disabled={replacing || publishing} onClick={() => replacementInput.current?.click()}><Upload size={15} />{replacing ? kt("knowledge.file.uploading_version") : document ? kt("knowledge.file.upload_new_version") : kt("knowledge.file.reupload")}</Button></>}
    {canPublish && onPublish && <Button className="primary" disabled={replacing || publishing} onClick={onPublish}><Send size={15} />{publishing ? kt("knowledge.auto.c7f77b9c7cdd4823") : kt("knowledge.auto.cbfe181351c872eb")}</Button>}
  </PageActionPortal>;

  if (loading) return <>{actions}<section className="knowledge-file-page is-loading" role="status"><RefreshCw size={24} className="knowledge-pulse" /><p>{kt("knowledge.auto.71b005c1eb5ff4c1")}</p></section></>;
  if (!document) return <>{actions}<section className="knowledge-file-page is-unavailable" role="alert"><FileWarning size={30} /><h3>{reference?.title || kt("knowledge.auto.25924f78da001431")}</h3><p>{error || kt("knowledge.auto.e2f7ee7d0315a65c")}</p><Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.710b1958f2ab42a6")}</Button></section></>;

  if (!downloadable) return <>{actions}<section className={`knowledge-file-page is-unavailable is-${document.state}`} role="status"><FileWarning size={30} /><h3>{document.filename}</h3><p><span className={`knowledge-file-state is-${document.security_status}`}>{documentLabel(document)}</span></p><p>{documentStatusDetail(document)}</p>{document.error_code && <p className="knowledge-error">{document.error_code}</p>}<Button onClick={() => setRevision(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.802a407c774302aa")}</Button></section></>;
  return <section className={`knowledge-file-page is-${document.state}`}>
    {actions}
    {error && <p className="knowledge-error" role="alert">{error}</p>}
    <FilePreview source={knowledgeDocumentPreviewSource(client, document)} formatError={formatError} />
  </section>;
}
