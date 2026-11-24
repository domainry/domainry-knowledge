import { kt, ktf } from "../i18n/runtime.ts";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Minus, Plus, Printer, RotateCw } from "lucide-react";
import { downloadFile, fallbackDownloadMaxBytes, readPreviewFile, readPreviewRange } from "../file-preview.ts";
import type { FilePreviewLocation, FilePreviewSource } from "../types.ts";
import { PreviewToolbar, usePreviewFullscreen } from "./PreviewToolbar.tsx";

export function ImageViewer({ blob, filename }: { blob: Blob; filename: string }) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [url, setURL] = useState("");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [fitted, setFitted] = useState(true);
  const { fullscreen, toggleFullscreen } = usePreviewFullscreen(root);
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setURL(next);
    setZoom(1);
    setRotation(0);
    setFitted(true);
    setImageSize({ width: 0, height: 0 });
    return () => URL.revokeObjectURL(next);
  }, [blob]);

  const fitImage = useCallback(() => {
    const frame = viewport.current, element = image.current;
    if (!frame || !element || !element.naturalWidth || !element.naturalHeight) return;
    const sideways = rotation % 180 !== 0;
    const width = sideways ? element.naturalHeight : element.naturalWidth;
    const height = sideways ? element.naturalWidth : element.naturalHeight;
    const availableWidth = Math.max(1, frame.clientWidth - 48);
    const availableHeight = Math.max(1, frame.clientHeight - 96);
    setZoom(Math.min(1, Math.max(.25, Math.min(availableWidth / width, availableHeight / height))));
    setFitted(true);
  }, [rotation]);

  useEffect(() => {
    if (!fitted || !viewport.current) return;
    const observer = new ResizeObserver(fitImage);
    observer.observe(viewport.current);
    fitImage();
    return () => observer.disconnect();
  }, [fitImage, fitted]);

  const changeZoom = (value: number) => { setZoom(value); setFitted(false); };
  const sideways = rotation % 180 !== 0;
  const scaledWidth = imageSize.width * zoom;
  const scaledHeight = imageSize.height * zoom;

  useLayoutEffect(() => {
    if (!imageSize.width || !imageSize.height) return;
    const frame = requestAnimationFrame(() => {
      const element = viewport.current;
      if (!element) return;
      element.scrollLeft = Math.max(0, (element.scrollWidth - element.clientWidth) / 2);
      element.scrollTop = Math.max(0, (element.scrollHeight - element.clientHeight) / 2);
    });
    return () => cancelAnimationFrame(frame);
  }, [imageSize.height, imageSize.width, rotation, zoom]);

  return <div ref={root} className="knowledge-file-viewer knowledge-image-viewer">
    {url && <PreviewToolbar
      fitted={fitted}
      fullscreen={fullscreen}
      label="图片预览工具栏"
      onFit={fitImage}
      onFullscreen={() => void toggleFullscreen()}
      onReset={() => { setZoom(1); setFitted(false); }}
      onZoomChange={changeZoom}
      zoom={zoom}
    >
      <button type="button" aria-label={kt("knowledge.auto.68eb90fa809e72cc")} title={kt("knowledge.auto.68eb90fa809e72cc")} onClick={() => setRotation(value => (value + 90) % 360)}><RotateCw size={16} /></button>
      <a href={url} download={filename} aria-label={kt("knowledge.auto.aa1d4263667a8086")} title={kt("knowledge.auto.aa1d4263667a8086")}><Download size={16} /></a>
    </PreviewToolbar>}
    {url && <div ref={viewport} className="knowledge-image-scroll">
      <div className="knowledge-image-canvas">
        <div className="knowledge-image-content" style={{ width: sideways ? scaledHeight : scaledWidth, height: sideways ? scaledWidth : scaledHeight }}>
          <img
            ref={image}
            src={url}
            alt={filename}
            style={{ width: scaledWidth, height: scaledHeight, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
            onLoad={event => {
              setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
              requestAnimationFrame(fitImage);
            }}
          />
        </div>
      </div>
    </div>}
  </div>;
}

export function MediaViewer({ source, kind }: { source: FilePreviewSource; kind: "audio" | "video" }) {
  const element = useRef<HTMLMediaElement>(null);
  const [url, setURL] = useState(source.streamURL || ""), [loading, setLoading] = useState(!source.streamURL), [error, setError] = useState("");
  const start = Math.max(0, source.file.location?.start_ms || 0) / 1000;
  useEffect(() => {
    if (source.streamURL) {
      setURL(source.streamURL); setLoading(false); setError("");
      return;
    }
    const abort = new AbortController();
    let objectURL = "";
    setURL(""); setLoading(true); setError("");
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(120_000)]);
    const resolved = source.openStreamURL
      ? source.openStreamURL(signal).then(streamURL => ({ streamURL }))
      : readPreviewFile(source, signal, fallbackDownloadMaxBytes).then(file => ({ file }));
    void resolved.then(result => {
      if (abort.signal.aborted) return;
      if ("streamURL" in result) setURL(result.streamURL);
      else {
        objectURL = URL.createObjectURL(result.file.blob);
        setURL(objectURL);
      }
    }).catch(failure => {
      if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.f08dc47175344255"));
    }).finally(() => {
      if (!abort.signal.aborted) setLoading(false);
    });
    return () => { abort.abort(); if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [source.identity, source.streamURL]);
  useEffect(() => {
    const media = element.current;
    if (!media || !url || !Number.isFinite(start)) return;
    const seek = () => { if (Math.abs(media.currentTime - start) > 0.05) media.currentTime = start; };
    if (media.readyState >= 1) seek();
    else media.addEventListener("loadedmetadata", seek, { once: true });
    return () => media.removeEventListener("loadedmetadata", seek);
  }, [source.identity, start, url]);
  if (error) return <p role="alert" className="knowledge-error">{error}</p>;
  if (loading || !url) return <p className="knowledge-file-preview-loading" role="status">{kt("knowledge.auto.25fe8537e4bdb53c")}</p>;
  const mediaRef = (node: HTMLMediaElement | null) => { element.current = node; };
  return <div className="knowledge-file-viewer knowledge-media-viewer">{kind === "video" ? <video ref={mediaRef} src={url} controls preload="metadata" playsInline /> : <audio ref={mediaRef} src={url} controls preload="metadata" />}{source.file.location?.end_ms ? <p className="knowledge-subtle">{kt("knowledge.auto.d2a9b29ca3c46418")}{formatMediaTime(source.file.location.start_ms || 0)} – {formatMediaTime(source.file.location.end_ms)}</p> : null}</div>;
}

function formatMediaTime(milliseconds: number) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60), rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}

const pdfRangeBytes = 256 * 1024;
const maxPDFRenderPixels = 8_000_000;
const defaultPDFPageSize = { width: 612, height: 792 };

function PDFPageCanvas({
  active,
  availableWidth,
  fallbackPageSize,
  onError,
  pageNumber,
  pdf,
  zoom,
}: {
  active: boolean;
  availableWidth: number;
  fallbackPageSize: { width: number; height: number };
  onError: (message: string) => void;
  pageNumber: number;
  pdf: PDFDocumentProxy;
  zoom: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [rendered, setRendered] = useState(false);
  const displayPageSize = pageSize || fallbackPageSize;
  const aspectRatio = displayPageSize.width / displayPageSize.height;
  const fittedWidth = Math.min(availableWidth / displayPageSize.width, 2) * displayPageSize.width;
  const displayWidth = Math.max(1, fittedWidth * zoom);
  const displayHeight = Math.max(1, displayWidth / aspectRatio);

  useEffect(() => {
    if (active) return;
    setRendered(false);
    const element = canvas.current;
    if (!element) return;
    element.width = 1;
    element.height = 1;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let alive = true, renderTask: RenderTask | undefined;
    let pageProxy: Awaited<ReturnType<PDFDocumentProxy["getPage"]>> | undefined;
    setRendered(false);
    void pdf.getPage(pageNumber).then(value => {
      if (!alive || !canvas.current) return;
      pageProxy = value;
      const base = value.getViewport({ scale: 1 });
      setPageSize({ width: base.width, height: base.height });
      const scale = Math.min(availableWidth / base.width, 2) * zoom;
      const view = value.getViewport({ scale });
      const pixelRatio = Math.max(.5, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(maxPDFRenderPixels / Math.max(1, view.width * view.height))));
      const element = canvas.current;
      element.width = Math.ceil(view.width * pixelRatio);
      element.height = Math.ceil(view.height * pixelRatio);
      renderTask = value.render({
        canvas: element,
        canvasContext: element.getContext("2d")!,
        viewport: view,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
      });
      return renderTask.promise.then(() => { if (alive) setRendered(true); });
    }).catch(failure => {
      if (alive && failure?.name !== "RenderingCancelledException") onError(kt("knowledge.auto.03c177b644331bbf"));
    });
    return () => {
      alive = false;
      renderTask?.cancel();
      pageProxy?.cleanup();
    };
  }, [active, availableWidth, onError, pageNumber, pdf, zoom]);

  return <section
    className="knowledge-pdf-page"
    aria-busy={active && !rendered}
    aria-label={ktf("knowledge.auto.941b2d590f84327f", { value0: pageNumber })}
    data-page-number={pageNumber}
    style={{ width: displayWidth, height: displayHeight }}
  >
    <canvas
      ref={canvas}
      aria-hidden="true"
      data-rendered={rendered}
      style={{ width: displayWidth, height: displayHeight }}
    />
  </section>;
}

export function PDFViewer({ source, location }: { source: FilePreviewSource; location?: FilePreviewLocation }) {
  const viewer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const pageElements = useRef(new Map<number, HTMLElement>());
  const visiblePages = useRef(new Set<number>());
  const zoomAnchor = useRef<{ page: number; offset: number } | null>(null);
  const [pdf, setPDF] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(Math.max(1, location?.page || 1)), [zoom, setZoom] = useState(1), [width, setWidth] = useState(800);
  const [pageInput, setPageInput] = useState(String(Math.max(1, location?.page || 1)));
  const [fallbackPageSize, setFallbackPageSize] = useState(defaultPDFPageSize);
  const [toolbarLeft, setToolbarLeft] = useState("50%");
  const [downloading, setDownloading] = useState(false), [printing, setPrinting] = useState(false), [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(200, entries[0].contentRect.width - 32)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const element = viewer.current;
    if (!element) return;
    const update = () => {
      const bounds = element.getBoundingClientRect();
      setToolbarLeft(`${Math.round(bounds.left + bounds.width / 2)}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    update();
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === viewer.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  useEffect(() => {
    const host = viewer.current, root = viewport.current;
    if (!host || !root) return;
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const maximum = Math.max(0, root.scrollHeight - root.clientHeight);
      const canScroll = event.deltaY < 0 ? root.scrollTop > 0 : event.deltaY > 0 && root.scrollTop < maximum;
      if (!canScroll) return;
      event.preventDefault();
      root.scrollTop = Math.max(0, Math.min(maximum, root.scrollTop + event.deltaY));
    };
    host.addEventListener("wheel", handleWheel, { passive: false });
    return () => host.removeEventListener("wheel", handleWheel);
  }, [pdf]);

  useEffect(() => {
    let active = true, task: PDFDocumentLoadingTask | undefined;
    const abort = new AbortController(), reads = new Set<AbortController>();
    setPDF(null); setError(""); setFallbackPageSize(defaultPDFPageSize);
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
        const targetPage = Math.min(value.numPages, Math.max(1, location?.page || 1));
        return value.getPage(targetPage).then(target => {
          if (!active) return;
          const base = target.getViewport({ scale: 1 });
          setFallbackPageSize({ width: base.width, height: base.height });
          setPage(targetPage);
          setPDF(value);
        });
      });
    }).catch(failure => { if (active && !abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.1cfbb855f72d8db7")); });
    return () => { active = false; abort.abort(); reads.forEach(request => request.abort()); reads.clear(); void task?.destroy(); };
  }, [location?.page, source.identity]);

  useLayoutEffect(() => {
    if (!pdf) return;
    const element = viewport.current, target = pageElements.current.get(Math.min(pdf.numPages, Math.max(1, location?.page || 1)));
    if (element && target) element.scrollTop = target.offsetTop - 16;
  }, [location?.page, pdf]);

  useEffect(() => {
    const root = viewport.current;
    if (!root || !pdf) return;
    let frame = 0;
    visiblePages.current.clear();
    const updateCurrentPage = () => {
      frame = 0;
      const rootRect = root.getBoundingClientRect();
      let nextPage = 0, largestVisibleArea = -1;
      for (const pageNumber of visiblePages.current) {
        const element = pageElements.current.get(pageNumber);
        if (!element) continue;
        const bounds = element.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(bounds.bottom, rootRect.bottom) - Math.max(bounds.top, rootRect.top));
        const visibleWidth = Math.max(0, Math.min(bounds.right, rootRect.right) - Math.max(bounds.left, rootRect.left));
        const visibleArea = visibleHeight * visibleWidth;
        if (visibleArea > largestVisibleArea) { largestVisibleArea = visibleArea; nextPage = pageNumber; }
      }
      if (nextPage) setPage(current => current === nextPage ? current : nextPage);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateCurrentPage);
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const pageNumber = Number((entry.target as HTMLElement).dataset.pageNumber);
        if (entry.isIntersecting) visiblePages.current.add(pageNumber);
        else visiblePages.current.delete(pageNumber);
      }
      scheduleUpdate();
    }, { root, threshold: 0 });
    pageElements.current.forEach(element => observer.observe(element));
    root.addEventListener("scroll", scheduleUpdate, { passive: true });
    scheduleUpdate();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("scroll", scheduleUpdate);
      observer.disconnect();
      visiblePages.current.clear();
    };
  }, [pdf, width, zoom]);

  useLayoutEffect(() => {
    const anchor = zoomAnchor.current, root = viewport.current;
    if (!anchor || !root) return;
    const element = pageElements.current.get(anchor.page);
    if (element) root.scrollTop = element.offsetTop + element.offsetHeight * anchor.offset;
    zoomAnchor.current = null;
  }, [zoom]);

  useEffect(() => setPageInput(String(page)), [page]);

  const changeZoom = useCallback((nextZoom: number) => {
    const root = viewport.current, element = pageElements.current.get(page);
    if (root && element) {
      const offset = (root.scrollTop - element.offsetTop) / Math.max(1, element.offsetHeight);
      zoomAnchor.current = { page, offset: Math.max(0, Math.min(1, offset)) };
    }
    setZoom(Math.max(.5, Math.min(3, nextZoom)));
  }, [page]);

  const goToPage = useCallback((requestedPage: number) => {
    if (!pdf) return;
    const nextPage = Math.min(pdf.numPages, Math.max(1, Math.round(requestedPage)));
    const root = viewport.current, element = pageElements.current.get(nextPage);
    setPage(nextPage); setPageInput(String(nextPage));
    if (root && element) root.scrollTo({ top: Math.max(0, element.offsetTop - 16), behavior: "smooth" });
  }, [pdf]);

  const commitPageInput = useCallback(() => {
    const requestedPage = Number(pageInput);
    if (Number.isFinite(requestedPage)) goToPage(requestedPage);
    else setPageInput(String(page));
  }, [goToPage, page, pageInput]);

  const downloadPDF = useCallback(async () => {
    if (downloading) return;
    setDownloading(true); setError("");
    try { await downloadFile(source, AbortSignal.timeout(120_000)); }
    catch (failure) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.8977b79aa82e74ff")); }
    finally { setDownloading(false); }
  }, [downloading, source]);

  const printPDF = useCallback(async () => {
    if (printing) return;
    const printWindow = window.open("", "_blank", "popup");
    if (!printWindow) { setError(kt("knowledge.auto.9368f9367a9505d0")); return; }
    setPrinting(true); setError("");
    try {
      const file = await readPreviewFile(source, AbortSignal.timeout(120_000), fallbackDownloadMaxBytes);
      const url = URL.createObjectURL(file.blob);
      const release = () => window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      printWindow.addEventListener("load", () => {
        window.setTimeout(() => { printWindow.focus(); printWindow.print(); release(); }, 300);
      }, { once: true });
      printWindow.location.replace(url);
    } catch (failure) {
      printWindow.close();
      setError(failure instanceof Error ? failure.message : kt("knowledge.auto.8977b79aa82e74ff"));
    } finally { setPrinting(false); }
  }, [printing, source]);

  const toggleFullscreen = useCallback(async () => {
    const element = viewer.current;
    if (!element) return;
    setError("");
    try {
      if (document.fullscreenElement === element) await document.exitFullscreen();
      else await element.requestFullscreen();
    } catch (failure) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.8977b79aa82e74ff")); }
  }, []);

  return <div className="knowledge-file-viewer knowledge-pdf-viewer" aria-busy={!pdf && !error} ref={viewer}>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    <div className="knowledge-pdf-scroll" ref={viewport}>
      <div className="knowledge-pdf-pages">
        {pdf && Array.from({ length: pdf.numPages }, (_, index) => {
          const pageNumber = index + 1;
          return <div
            className="knowledge-pdf-page-slot"
            data-page-number={pageNumber}
            key={pageNumber}
            ref={element => {
              if (element) pageElements.current.set(pageNumber, element);
              else pageElements.current.delete(pageNumber);
            }}
          >
            <PDFPageCanvas
              active={Math.abs(pageNumber - page) <= 1}
              availableWidth={width}
              fallbackPageSize={fallbackPageSize}
              onError={setError}
              pageNumber={pageNumber}
              pdf={pdf}
              zoom={zoom}
            />
          </div>;
        })}
      </div>
    </div>
    {pdf && <nav className="knowledge-pdf-toolbar" aria-label={kt("knowledge.auto.32e15ac0aaf372ef")} style={{ left: toolbarLeft }}>
      <button type="button" aria-label={kt("knowledge.auto.c9b9ae7a61444ab7")} title={kt("knowledge.auto.c9b9ae7a61444ab7")} disabled={page <= 1} onClick={() => goToPage(page - 1)}><ChevronLeft size={17} /></button>
      <label className="knowledge-pdf-page-control">
        <span className="knowledge-visually-hidden">{kt("knowledge.auto.239369850b80b20c")}</span>
        <input min={1} max={pdf.numPages} inputMode="numeric" value={pageInput} onChange={event => setPageInput(event.target.value.replace(/\D/g, ""))} onBlur={commitPageInput} onKeyDown={event => { if (event.key === "Enter") { commitPageInput(); event.currentTarget.blur(); } }} />
        <span>/ {pdf.numPages}</span>
      </label>
      <button type="button" aria-label={kt("knowledge.auto.8a8542f6964852dc")} title={kt("knowledge.auto.8a8542f6964852dc")} disabled={page >= pdf.numPages} onClick={() => goToPage(page + 1)}><ChevronRight size={17} /></button>
      <span className="knowledge-pdf-toolbar-divider" aria-hidden="true" />
      <button type="button" aria-label={`${kt("knowledge.auto.b762aec769a35fff")} −`} title={`${kt("knowledge.auto.b762aec769a35fff")} −`} disabled={zoom <= .5} onClick={() => changeZoom(zoom - .25)}><Minus size={16} /></button>
      <output className="knowledge-pdf-zoom-value" aria-live="polite">{Math.round(zoom * 100)}%</output>
      <button type="button" aria-label={`${kt("knowledge.auto.b762aec769a35fff")} +`} title={`${kt("knowledge.auto.b762aec769a35fff")} +`} disabled={zoom >= 3} onClick={() => changeZoom(zoom + .25)}><Plus size={16} /></button>
      <span className="knowledge-pdf-toolbar-divider" aria-hidden="true" />
      <button type="button" aria-label={kt("knowledge.auto.aa1d4263667a8086")} title={kt("knowledge.auto.aa1d4263667a8086")} disabled={downloading} onClick={() => void downloadPDF()}><Download size={17} /></button>
      <button type="button" aria-label={kt("knowledge.auto.9a83289af3083a21")} title={kt("knowledge.auto.9a83289af3083a21")} disabled={printing} onClick={() => void printPDF()}><Printer size={17} /></button>
      <button type="button" aria-label={fullscreen ? kt("knowledge.auto.3fd47edce45b3603") : kt("knowledge.auto.00bd3960fea8ea98")} title={fullscreen ? kt("knowledge.auto.3fd47edce45b3603") : kt("knowledge.auto.00bd3960fea8ea98")} onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
    </nav>}
  </div>;
}
