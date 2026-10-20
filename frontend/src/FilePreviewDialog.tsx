import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, RefreshCw, X } from "lucide-react";
import { Button, defaultErrorMessage } from "./components.tsx";
import { canPreviewFilename, downloadFile, isTextPreviewFormat, previewFormat, previewOfficeMaxBytes, readPreviewFile, readPreviewText, type PreviewFile, type PreviewText } from "./file-preview.ts";
import type { FilePreviewSource } from "./types.ts";
import { ImageViewer, MediaViewer, PDFViewer } from "./viewers/BlobViewer.tsx";
import { SpreadsheetViewer } from "./viewers/SpreadsheetViewer.tsx";
import { PresentationViewer } from "./viewers/PresentationViewer.tsx";
import { TextViewer } from "./viewers/TextViewer.tsx";
import { WordViewer } from "./viewers/WordViewer.tsx";

export function FilePreviewDialog({ source, formatError = defaultErrorMessage, onClose }: { source: FilePreviewSource; formatError?: (error: unknown) => string; onClose(): void }) {
  const [file, setFile] = useState<PreviewFile | null>(null), [text, setText] = useState<PreviewText | null>(null);
  const [error, setError] = useState(""), [refresh, setRefresh] = useState(0), [downloading, setDownloading] = useState(false);
  const format = previewFormat(source.file.filename);
  const pdf = format === "pdf";
  const audio = ["mp3", "wav", "ogg", "flac", "m4a", "aac"].includes(format);
  const video = ["mp4", "mov", "webm", "avi"].includes(format);
  const supported = canPreviewFilename(source.file.filename);
  useEffect(() => {
    const abort = new AbortController();
    setFile(null); setText(null); setError("");
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(30_000)]);
    if (!supported) return () => abort.abort();
    if (pdf || audio || video) return () => abort.abort();
    const operation = isTextPreviewFormat(format)
      ? readPreviewText(source, signal).then(setText)
      : readPreviewFile(source, signal, ["docx", "pptx", "xlsx", "xlsm"].includes(format) ? previewOfficeMaxBytes : undefined).then(setFile);
    void operation.catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [source.identity, format, formatError, pdf, audio, video, refresh, supported]);
  async function download() {
    if (downloading) return;
    setDownloading(true); setError("");
    try { await downloadFile(source, AbortSignal.timeout(120_000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { setDownloading(false); }
  }
  const image = ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(format);
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="knowledge-preview-dialog" role="dialog" aria-modal="true" aria-label={file?.filename || text?.filename || source.file.filename}>
    <header><div><h2>{file?.filename || text?.filename || source.file.filename}</h2><p><span>原文件在线预览</span> · 每次打开和下载都由宿主重新核对权限</p></div><Button aria-label="关闭" onClick={onClose}><X size={17} /></Button></header>
    <div className="knowledge-file-toolbar"><Button disabled={downloading} onClick={() => void download()}><Download size={15} />{downloading ? "正在下载…" : "下载原文件"}</Button><Button disabled={!supported} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={15} />重新打开</Button></div>
    {!supported ? <div className="knowledge-preview-unsupported"><p>旧版 Word（.doc）和 Excel（.xls）不能在浏览器中可靠解析。请下载后查看，或另存为 .docx / .xlsx 再上传。</p></div> : error ? <p role="alert" className="knowledge-error">{error}</p> : pdf ? <PDFViewer source={source} location={source.file.location} /> : audio ? <MediaViewer source={source} kind="audio" /> : video ? <MediaViewer source={source} kind="video" /> : !file && !text ? <p>正在读取原文件…</p> : text ? <TextViewer file={text} /> : file?.format === "docx" ? <WordViewer blob={file.blob} /> : file?.format === "pptx" ? <PresentationViewer blob={file.blob} location={source.file.location} /> : file?.format === "xlsx" || file?.format === "xlsm" ? <SpreadsheetViewer blob={file.blob} location={source.file.location} /> : file && image ? <ImageViewer blob={file.blob} filename={file.filename} /> : <p>此格式暂不支持在线预览，请下载查看。</p>}
  </section></div>, window.document.body);
}
