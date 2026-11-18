import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { formatKnowledgeNumber, kt } from "../i18n/runtime.ts";
import { useKnowledgeTheme } from "../theme.tsx";
import { loadOffice } from "./office-load.ts";
import { PreviewToolbar, usePreviewFullscreen } from "./PreviewToolbar.tsx";

const frameHTML = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>html{color-scheme:light dark}body{margin:0;background:transparent;color:CanvasText}.docx-wrapper{min-width:100%;padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;

function estimateWordCount(text: string) {
  const cjkCharacters = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length || 0;
  const nonCJKWords = text
    .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ")
    .match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length || 0;
  return cjkCharacters + nonCJKWords;
}

export function WordViewer({ blob }: { blob: Blob }) {
  const theme = useKnowledgeTheme();
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false), [rendered, setRendered] = useState(false);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1), [pageCount, setPageCount] = useState(0);
  const [estimatedWordCount, setEstimatedWordCount] = useState(0);
  const [zoom, setZoom] = useState(1), [fitted, setFitted] = useState(false);
  const { fullscreen, toggleFullscreen } = usePreviewFullscreen(root);

  useEffect(() => {
    if (!ready) return;
    const abort = new AbortController();
    let disposeRenderedDocument = () => {};
    setLoading(true);
    setRendered(false);
    setError("");
    setCurrentPage(1);
    setPageCount(0);
    setEstimatedWordCount(0);
    setZoom(1);
    setFitted(false);
    void loadOffice(blob, "docx", abort.signal).then(async () => {
      const host = frame.current?.contentDocument?.getElementById("document");
      if (abort.signal.aborted || !host) return;
      await renderAsync(blob, host, host, { useBase64URL: true, renderAltChunks: false, renderComments: false, breakPages: true, ignoreLastRenderedPageBreak: false });
      if (abort.signal.aborted) return;
      host.querySelectorAll("a").forEach(link => { link.removeAttribute("href"); link.removeAttribute("target"); });
      const pages = [...host.querySelectorAll<HTMLElement>("section.docx")];
      const contentWindow = frame.current?.contentWindow;
      setPageCount(pages.length);
      setEstimatedWordCount(estimateWordCount(host.textContent || ""));
      setRendered(true);

      let animationFrame = 0;
      const updateCurrentPage = () => {
        animationFrame = 0;
        if (!contentWindow || pages.length === 0) return;
        let nextPage = 1, largestVisibleHeight = -1;
        for (const [index, page] of pages.entries()) {
          const bounds = page.getBoundingClientRect();
          const visibleHeight = Math.max(0, Math.min(bounds.bottom, contentWindow.innerHeight) - Math.max(bounds.top, 0));
          if (visibleHeight > largestVisibleHeight) { largestVisibleHeight = visibleHeight; nextPage = index + 1; }
        }
        setCurrentPage(value => value === nextPage ? value : nextPage);
      };
      const scheduleCurrentPage = () => {
        if (!animationFrame) animationFrame = contentWindow?.requestAnimationFrame(updateCurrentPage) || requestAnimationFrame(updateCurrentPage);
      };
      const pageObserver = new ResizeObserver(scheduleCurrentPage);
      pages.forEach(page => pageObserver.observe(page));
      contentWindow?.addEventListener("scroll", scheduleCurrentPage, { passive: true });
      scheduleCurrentPage();
      disposeRenderedDocument = () => {
        if (animationFrame) (contentWindow || window).cancelAnimationFrame(animationFrame);
        contentWindow?.removeEventListener("scroll", scheduleCurrentPage);
        pageObserver.disconnect();
      };
      setLoading(false);
    }).catch(failure => {
      if (!abort.signal.aborted) {
        setError(failure instanceof Error ? failure.message : kt("knowledge.auto.04b3bd363ea7d303"));
        setLoading(false);
      }
    });
    return () => {
      abort.abort();
      disposeRenderedDocument();
      frame.current?.contentDocument?.getElementById("document")?.replaceChildren();
    };
  }, [blob, ready]);

  useEffect(() => {
    const documentElement = frame.current?.contentDocument?.documentElement;
    if (documentElement) documentElement.style.colorScheme = theme;
  }, [ready, theme]);

  useEffect(() => {
    const wrapper = frame.current?.contentDocument?.querySelector<HTMLElement>(".docx-wrapper");
    if (!wrapper) return;
    wrapper.style.setProperty("zoom", String(zoom));
    const animationFrame = requestAnimationFrame(() => frame.current?.contentWindow?.dispatchEvent(new Event("scroll")));
    return () => cancelAnimationFrame(animationFrame);
  }, [rendered, zoom]);

  const fitWidth = useCallback(() => {
    const page = frame.current?.contentDocument?.querySelector<HTMLElement>("section.docx");
    const availableWidth = (frame.current?.clientWidth || 0) - 32;
    if (!page || availableWidth <= 0 || page.offsetWidth <= 0) return;
    setZoom(Math.min(2, Math.max(.5, availableWidth / page.offsetWidth)));
    setFitted(true);
  }, []);

  useEffect(() => {
    if (!fitted || !frame.current) return;
    const observer = new ResizeObserver(fitWidth);
    observer.observe(frame.current);
    fitWidth();
    return () => observer.disconnect();
  }, [fitWidth, fitted]);

  const goToPage = (pageNumber: number) => {
    const pages = frame.current?.contentDocument?.querySelectorAll<HTMLElement>("section.docx");
    if (!pages?.length) return;
    const nextPage = Math.min(pages.length, Math.max(1, pageNumber));
    pages[nextPage - 1]?.scrollIntoView({ block: "start", behavior: "smooth" });
    setCurrentPage(nextPage);
  };

  return <div ref={root} className="knowledge-file-viewer knowledge-word-viewer">
    <PreviewToolbar
      fitted={fitted}
      fullscreen={fullscreen}
      label={kt("knowledge.auto.b985a1352b2a7ee1")}
      maxZoom={2}
      minZoom={.5}
      onFit={fitWidth}
      onFullscreen={() => void toggleFullscreen()}
      onReset={() => { setZoom(1); setFitted(false); }}
      onZoomChange={value => { setZoom(value); setFitted(false); }}
      status={pageCount > 0 ? <span title="基于文档文本估算的字数">{currentPage} / {pageCount} · ≈ {formatKnowledgeNumber(estimatedWordCount)} 字</span> : kt("knowledge.auto.b53712c347d64a60")}
      zoom={zoom}
      zoomStep={.1}
    >
      <button type="button" aria-label={kt("knowledge.auto.c9b9ae7a61444ab7")} title={kt("knowledge.auto.c9b9ae7a61444ab7")} disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}><ChevronLeft size={16} /></button>
      <button type="button" aria-label={kt("knowledge.auto.8a8542f6964852dc")} title={kt("knowledge.auto.8a8542f6964852dc")} disabled={pageCount === 0 || currentPage >= pageCount} onClick={() => goToPage(currentPage + 1)}><ChevronRight size={16} /></button>
    </PreviewToolbar>
    {loading && <p className="knowledge-preview-inline-state" role="status">{kt("knowledge.auto.50555eb1f1d070f3")}</p>}
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    <iframe className="knowledge-word-frame" title={kt("knowledge.auto.b985a1352b2a7ee1")} ref={frame} sandbox="allow-same-origin" srcDoc={frameHTML} onLoad={() => setReady(true)} aria-busy={loading} />
  </div>;
}
