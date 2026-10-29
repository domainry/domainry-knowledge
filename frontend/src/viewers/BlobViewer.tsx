import { kt, ktf } from "../i18n/runtime.ts";
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
  return <div className="knowledge-file-viewer"><p className="knowledge-subtle">{kt("knowledge.auto.df18572f8913c984")}</p>{url && <div className="knowledge-image-scroll"><img src={url} alt={filename} /></div>}</div>;
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
  if (!source.streamURL) return <div className="knowledge-preview-unsupported"><p>{kt("knowledge.auto.f08dc47175344255")}</p></div>;
  const mediaRef = (node: HTMLMediaElement | null) => { element.current = node; };
  return <div className="knowledge-file-viewer knowledge-media-viewer">{kind === "video" ? <video ref={mediaRef} src={source.streamURL} controls preload="metadata" playsInline /> : <audio ref={mediaRef} src={source.streamURL} controls preload="metadata" />}{source.file.location?.end_ms ? <p className="knowledge-subtle">{kt("knowledge.auto.d2a9b29ca3c46418")}{formatMediaTime(source.file.location.start_ms || 0)} – {formatMediaTime(source.file.location.end_ms)}</p> : null}</div>;
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
              setError(failure instanceof Error ? failure.message : kt("knowledge.auto.e9c69d12d8c0ca50"));
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
    }).catch(failure => { if (active && !abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.1cfbb855f72d8db7")); });
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
    }).catch(failure => { if (active && failure?.name !== "RenderingCancelledException") setError(kt("knowledge.auto.03c177b644331bbf")); });
    return () => { active = false; task?.cancel(); };
  }, [pdf, page, width, zoom]);

  return <div className="knowledge-file-viewer"><nav className="knowledge-file-toolbar" aria-label={kt("knowledge.auto.a475aa892aec9582")}><Button disabled={!pdf || page <= 1} onClick={() => setPage(value => value - 1)}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><span>{kt("knowledge.auto.af50a0fe2a50a3d1")}{page} / {pdf?.numPages || "—"} {kt("knowledge.auto.d24d3c99460c7e3a")}</span><Button disabled={!pdf || page >= pdf.numPages} onClick={() => setPage(value => value + 1)}>{kt("knowledge.auto.8a8542f6964852dc")}</Button><label>{kt("knowledge.auto.b762aec769a35fff")}<Select aria-label={kt("knowledge.auto.32e15ac0aaf372ef")} value={zoom} onChange={event => setZoom(Number(event.target.value))}><option value={0.75}>75%</option><option value={1}>{kt("knowledge.auto.c1f31e481aaa0b3b")}</option><option value={1.5}>150%</option><option value={2}>200%</option></Select></label></nav>{error && <p role="alert" className="knowledge-error">{error}</p>}<div className="knowledge-pdf-canvas" ref={viewport} aria-busy={!rendered && !error}><canvas ref={canvas} aria-label={ktf("knowledge.auto.941b2d590f84327f", { value0: page })} data-rendered={rendered} /></div></div>;
}
