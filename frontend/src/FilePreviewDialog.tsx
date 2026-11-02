import { kt } from "./i18n/runtime.ts";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, RefreshCw, X } from "lucide-react";
import { Button, defaultErrorMessage } from "./components.tsx";
import { canPreviewFilename, downloadFile, previewKind, previewOfficeMaxBytes, readPreviewFile, readPreviewText, type PreviewFile, type PreviewText } from "./file-preview.ts";
import type { FilePreviewSource } from "./types.ts";
import { ImageViewer, MediaViewer, PDFViewer } from "./viewers/BlobViewer.tsx";
import { SpreadsheetViewer } from "./viewers/SpreadsheetViewer.tsx";
import { PresentationViewer } from "./viewers/PresentationViewer.tsx";
import { TextViewer } from "./viewers/TextViewer.tsx";
import { WordViewer } from "./viewers/WordViewer.tsx";

export function FilePreviewDialog({ source, downloadSource = source, formatError = defaultErrorMessage, onClose }: { source: FilePreviewSource; downloadSource?: FilePreviewSource; formatError?: (error: unknown) => string; onClose(): void }) {
  const [refresh, setRefresh] = useState(0), [error, setError] = useState(""), [downloading, setDownloading] = useState(false);
  async function download() {
    if (downloading) return;
    setDownloading(true); setError("");
    try { await downloadFile(downloadSource, AbortSignal.timeout(120_000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { setDownloading(false); }
  }
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="knowledge-preview-dialog" role="dialog" aria-modal="true" aria-label={source.file.filename}>
    <header><div><h2>{source.file.filename}</h2><p><span>{kt("knowledge.auto.d1fe903d3d493405")}</span> {kt("knowledge.auto.b54bad775a48ea88")}</p></div><Button aria-label={kt("knowledge.auto.3fd47edce45b3603")} onClick={onClose}><X size={17} /></Button></header>
    <div className="knowledge-file-toolbar"><Button disabled={downloading} onClick={() => void download()}><Download size={15} />{downloading ? kt("knowledge.auto.369ca5e19c59093f") : kt("knowledge.auto.aa1d4263667a8086")}</Button><Button disabled={!canPreviewFilename(source.file.filename)} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={15} />{kt("knowledge.auto.9f24062367f05167")}</Button></div>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    <FilePreview source={source} formatError={formatError} refresh={refresh} />
  </section></div>, window.document.body);
}

export function FilePreview({ source, formatError = defaultErrorMessage, refresh = 0 }: { source: FilePreviewSource; formatError?: (error: unknown) => string; refresh?: number }) {
  const [file, setFile] = useState<PreviewFile | null>(null), [text, setText] = useState<PreviewText | null>(null);
  const [error, setError] = useState("");
  const kind = previewKind(source.file.filename);
  const supported = kind !== null;
  useEffect(() => {
    const abort = new AbortController();
    setFile(null); setText(null); setError("");
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(30_000)]);
    if (!supported) return () => abort.abort();
    if (kind === "pdf" || kind === "audio" || kind === "video") return () => abort.abort();
    const operation = kind === "text"
      ? readPreviewText(source, signal).then(setText)
      : readPreviewFile(source, signal, kind === "word" || kind === "presentation" || kind === "spreadsheet" ? previewOfficeMaxBytes : undefined).then(setFile);
    void operation.catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [source.identity, formatError, kind, refresh, supported]);
  return !supported ? <div className="knowledge-preview-unsupported"><p>{kt("knowledge.auto.81c99e49c798db1a")}</p></div> : error ? <p role="alert" className="knowledge-error">{error}</p> : kind === "pdf" ? <PDFViewer source={source} location={source.file.location} /> : kind === "audio" ? <MediaViewer source={source} kind="audio" /> : kind === "video" ? <MediaViewer source={source} kind="video" /> : !file && !text ? <p className="knowledge-file-preview-loading" role="status">{kt("knowledge.auto.25fe8537e4bdb53c")}</p> : kind === "text" && text ? <TextViewer file={text} /> : kind === "word" && file ? <WordViewer blob={file.blob} /> : kind === "presentation" && file ? <PresentationViewer blob={file.blob} location={source.file.location} /> : kind === "spreadsheet" && file ? <SpreadsheetViewer blob={file.blob} location={source.file.location} /> : kind === "image" && file ? <ImageViewer blob={file.blob} filename={file.filename} /> : <p>{kt("knowledge.auto.d73d3fd06f4446cb")}</p>;
}
