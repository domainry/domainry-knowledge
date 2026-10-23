import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import { Button, Select } from "../components.tsx";
import { readPreviewRange } from "../file-preview.ts";
import type { FilePreviewLocation, FilePreviewSource } from "../types.ts";

export function ImageViewer({ blob, filename }: { blob: Blob; filename: string }) {
  const [url, setURL] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setURL(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return <div className="knowledge-file-viewer"><p className="knowledge-subtle">图片原始比例预览</p>{url && <div className="knowledge-image-scroll"><img src={url} alt={filename} /></div>}</div>;
}

export function MediaViewer({ source, kind }: { source: FilePreviewSource; kind: "audio" | "video" }) {
  const element = useRef<HTMLMediaElement>(null);
  const start = Math.max(0, source.file.location?.start_ms || 0) / 1000;
  useEffect(() => {
    const media = element.current;
    if (!media || !Number.isFinite(start)) return;
    const seek = () => { if (Math.abs(media.currentTime - start) > 0.05) media.currentTime = start; };
    if (media.readyState >= 1) seek();
    else media.addEventListener("loadedmetadata", seek, { once: true });
    return () => media.removeEventListener("loadedmetadata", seek);
  }, [source.identity, start]);
  if (!source.streamURL) return <div className="knowledge-preview-unsupported"><p>当前宿主没有提供授权后的媒体流地址，请下载原文件查看。</p></div>;
  const mediaRef = (node: HTMLMediaElement | null) => { element.current = node; };
  return <div className="knowledge-file-viewer knowledge-media-viewer">{kind === "video" ? <video ref={mediaRef} src={source.streamURL} controls preload="metadata" playsInline /> : <audio ref={mediaRef} src={source.streamURL} controls preload="metadata" />}{source.file.location?.end_ms ? <p className="knowledge-subtle">引用时间：{formatMediaTime(source.file.location.start_ms || 0)} – {formatMediaTime(source.file.location.end_ms)}</p> : null}</div>;
}

function formatMediaTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60), rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}

const pdfRangeBytes = 256 * 1024;

export function PDFViewer({ source, location }: { source: FilePreviewSource; location?: FilePreviewLocation }) {
  const canvas = useRef<HTMLCanvasElement>(null), viewport = useRef<HTMLDivElement>(null);
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(Math.max(1, location?.page || 1)), [zoom, setZoom] = useState(1), [width, setWidth] = useState(800);
  const [error, setError] = useState(""), [rendered, setRendered] = useState(false);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(200, entries[0].contentRect.width - 32)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true, task: PDFDocumentLoadingTask | undefined;
    const abort = new AbortController(), reads = new Set<AbortController>();
    setPDF(null); setError("");
    void Promise.all([readPreviewRange(source, 0, pdfRangeBytes, abort.signal), import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([initial, pdfjs, worker]) => {
      if (!active) return;
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      if (initial.data.byteLength === initial.total) {
        task = pdfjs.getDocument({ data: initial.data, stopAtErrors: true });
      } else {
        class AuthorizedRangeTransport extends pdfjs.PDFDataRangeTransport {
          requestDataRange(begin: number, end: number) {
            const request = new AbortController(); reads.add(request);
            void readPreviewRange(source, begin, end, request.signal).then(result => {
              reads.delete(request);
              if (active) this.onDataRange(begin, result.data);
            }).catch(failure => {
              reads.delete(request);
              if (!active || request.signal.aborted) return;
              setError(failure instanceof Error ? failure.message : "PDF 分段读取失败，请下载原文件查看。");
              void task?.destroy();
            });
          }
          abort() { reads.forEach(request => request.abort()); reads.clear(); }
        }
        const range = new AuthorizedRangeTransport(initial.total, initial.data, false, initial.filename);
        task = pdfjs.getDocument({ range, rangeChunkSize: pdfRangeBytes, disableAutoFetch: true, disableStream: true, stopAtErrors: true });
      }
      return task.promise.then(value => {
        if (!active) return;
        setPDF(value);
        setPage(Math.min(value.numPages, Math.max(1, location?.page || 1)));
      });
    }).catch(failure => { if (active && !abort.signal.aborted) setError(failure instanceof Error ? failure.message : "PDF 无法打开，文件可能已损坏或需要密码。可下载原文件查看。"); });
    return () => { active = false; abort.abort(); reads.forEach(request => request.abort()); reads.clear(); void task?.destroy(); };
  }, [location?.page, source.identity]);

  useEffect(() => {
    if (!pdf) return;
    let active = true, task: RenderTask | undefined;
    setRendered(false);
    void pdf.getPage(page).then(value => {
      if (!active || !canvas.current) return;
      const base = value.getViewport({ scale: 1 }), scale = Math.min(width / base.width, 2) * zoom;
      const view = value.getViewport({ scale }), ratio = Math.min(window.devicePixelRatio || 1, 2);
      const element = canvas.current;
      element.width = Math.ceil(view.width * ratio); element.height = Math.ceil(view.height * ratio);
      element.style.width = `${view.width}px`; element.style.height = `${view.height}px`;
      task = value.render({ canvas: element, canvasContext: element.getContext("2d")!, viewport: view, transform: [ratio, 0, 0, ratio, 0, 0] });
      return task.promise.then(() => { if (active) setRendered(true); });
    }).catch(failure => { if (active && failure?.name !== "RenderingCancelledException") setError("此页无法显示，请下载原文件查看。"); });
    return () => { active = false; task?.cancel(); };
  }, [pdf, page, width, zoom]);

  return <div className="knowledge-file-viewer"><nav className="knowledge-file-toolbar" aria-label="PDF 翻页"><Button disabled={!pdf || page <= 1} onClick={() => setPage(value => value - 1)}>上一页</Button><span>第 {page} / {pdf?.numPages || "—"} 页</span><Button disabled={!pdf || page >= pdf.numPages} onClick={() => setPage(value => value + 1)}>下一页</Button><label>缩放 <Select aria-label="PDF 缩放" value={zoom} onChange={event => setZoom(Number(event.target.value))}><option value={0.75}>75%</option><option value={1}>适合宽度</option><option value={1.5}>150%</option><option value={2}>200%</option></Select></label></nav>{error && <p role="alert" className="knowledge-error">{error}</p>}<div className="knowledge-pdf-canvas" ref={viewport} aria-busy={!rendered && !error}><canvas ref={canvas} aria-label={`PDF 第 ${page} 页`} data-rendered={rendered} /></div></div>;
}
