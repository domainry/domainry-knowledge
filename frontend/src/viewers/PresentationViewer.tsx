import type { Presentation, RenderOptions } from "@web-ppt/core";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { kt, ktf } from "../i18n/runtime.ts";
import type { FilePreviewLocation } from "../types.ts";
import { PreviewToolbar, usePreviewFullscreen } from "./PreviewToolbar.tsx";

type PresentationEngine = Pick<typeof import("@web-ppt/core"), "renderSlideToSvg">;
type LoadedPresentation = { engine: PresentationEngine; presentation: Presentation };

function renderedSlide(loaded: LoadedPresentation, index: number, idPrefix: string, media: RenderOptions["media"]) {
  try {
    return loaded.engine.renderSlideToSvg(loaded.presentation, loaded.presentation.slides[index], {
      idPrefix,
      media,
      textMode: "html",
    });
  } catch {
    return "";
  }
}

function PresentationSlide({ loaded, index, thumbnail = false }: { loaded: LoadedPresentation; index: number; thumbnail?: boolean }) {
  const instanceID = useId().replaceAll(":", "");
  const markup = useMemo(
    () => renderedSlide(loaded, index, `knowledge-ppt-${thumbnail ? "thumb" : "slide"}-${index}-${instanceID}`, thumbnail ? "badge" : "player"),
    [index, instanceID, loaded, thumbnail],
  );
  const label = ktf("knowledge.auto.dd8e9d8aaf45e73d", { value0: index + 1 });
  return markup
    ? <div className="knowledge-presentation-slide-svg" aria-label={label} role="img" dangerouslySetInnerHTML={{ __html: markup }} />
    : <div className="knowledge-presentation-slide-error" role="alert">{kt("knowledge.auto.f8e748c4ff79ead7")}</div>;
}

function PresentationThumbnail({ active, index, loaded, onSelect }: { active: boolean; index: number; loaded: LoadedPresentation; onSelect(): void }) {
  const host = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(active);
  useEffect(() => {
    if (active) setVisible(true);
    const element = host.current;
    if (!element || visible) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { rootMargin: "240px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, visible]);
  return <button ref={host} type="button" aria-current={active ? "true" : undefined} aria-label={ktf("knowledge.auto.dd8e9d8aaf45e73d", { value0: index + 1 })} data-slide-index={index} onClick={onSelect}>
    <span>{index + 1}</span>
    <div className="knowledge-presentation-thumbnail" style={{ aspectRatio: `${loaded.presentation.width} / ${loaded.presentation.height}` }}>
      {visible && <PresentationSlide loaded={loaded} index={index} thumbnail />}
    </div>
  </button>;
}

export function PresentationViewer({ blob, location }: { blob: Blob; location?: FilePreviewLocation }) {
  const root = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState<LoadedPresentation | null>(null);
  const [selected, setSelected] = useState(0), [error, setError] = useState("");
  const [controlError, setControlError] = useState("");
  const [zoom, setZoom] = useState(1), [presenting, setPresenting] = useState(false);
  const { fullscreen, toggleFullscreen } = usePreviewFullscreen(root);

  useEffect(() => {
    let active = true, presentation: Presentation | undefined;
    setLoaded(null);
    setError("");
    void import("@web-ppt/core").then(async engine => {
      presentation = await engine.parse(blob, { lazy: true });
      if (!active) { presentation.dispose?.(); return; }
      if (presentation.slides.length === 0) throw Error(kt("knowledge.auto.f8e748c4ff79ead7"));
      setLoaded({ engine, presentation });
      setSelected(Math.min(presentation.slides.length - 1, Math.max(0, (location?.slide || 1) - 1)));
    }).catch(failure => {
      if (active) setError(failure instanceof Error && failure.message ? failure.message : kt("knowledge.auto.f8e748c4ff79ead7"));
    });
    return () => { active = false; presentation?.dispose?.(); };
  }, [blob]);

  useEffect(() => {
    if (!loaded || !location?.slide) return;
    setSelected(Math.min(loaded.presentation.slides.length - 1, Math.max(0, location.slide - 1)));
  }, [loaded, location?.slide]);

  useEffect(() => {
    navigation.current?.querySelector<HTMLElement>(`[data-slide-index="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    if (!presenting || !loaded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setSelected(value => Math.min(loaded.presentation.slides.length - 1, Math.max(0, value + (event.key === "ArrowLeft" ? -1 : 1))));
      } else if (event.key === "Escape") {
        setPresenting(false);
        if (document.fullscreenElement === root.current) void document.exitFullscreen();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [loaded, presenting]);

  useEffect(() => {
    if (!presenting) return;
    const onFullscreenChange = () => {
      if (document.fullscreenElement !== root.current) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [presenting]);

  if (error) return <div className="knowledge-file-viewer"><p role="alert" className="knowledge-error">{error}</p></div>;
  if (!loaded) return <div className="knowledge-file-viewer"><p role="status">{kt("knowledge.auto.642555750931a9e1")}</p></div>;

  const count = loaded.presentation.slides.length;
  const select = (index: number) => setSelected(Math.min(count - 1, Math.max(0, index)));
  const startPresentation = async () => {
    setControlError("");
    setPresenting(true);
    if (document.fullscreenElement === root.current) return;
    try { await root.current?.requestFullscreen(); }
    catch (failure) {
      setPresenting(false);
      setControlError(failure instanceof Error ? failure.message : kt("knowledge.auto.f8e748c4ff79ead7"));
    }
  };
  const stopPresentation = () => {
    setPresenting(false);
    if (document.fullscreenElement === root.current) void document.exitFullscreen();
  };

  return <div ref={root} className="knowledge-file-viewer knowledge-presentation-viewer" data-presenting={presenting || undefined} tabIndex={0} onKeyDown={event => {
    if (presenting) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    select(selected + (event.key === "ArrowLeft" ? -1 : 1));
  }}>
    {controlError && <p role="alert" className="knowledge-error knowledge-preview-control-error">{controlError}</p>}
    <div className="knowledge-presentation">
      <nav ref={navigation} aria-label={kt("knowledge.auto.5d32c633a3d8db80")}>
        {loaded.presentation.slides.map((_, index) => <PresentationThumbnail key={index} active={index === selected} index={index} loaded={loaded} onSelect={() => select(index)} />)}
      </nav>
      <section className="knowledge-presentation-stage">
        <PreviewToolbar
          fitted={zoom === 1}
          fullscreen={fullscreen}
          label={kt("knowledge.auto.b33080b4902a6b47")}
          maxZoom={2}
          minZoom={.5}
          onFit={() => setZoom(1)}
          onFullscreen={() => void toggleFullscreen()}
          onReset={() => setZoom(1)}
          onZoomChange={setZoom}
          status={<span>{selected + 1} / {count}</span>}
          zoom={zoom}
          zoomStep={.1}
        >
          <button type="button" aria-label={kt("knowledge.auto.bcf200709dbc7ff4")} title={kt("knowledge.auto.bcf200709dbc7ff4")} disabled={selected === 0} onClick={() => select(selected - 1)}><ChevronLeft size={16} /></button>
          <button type="button" className="knowledge-preview-toolbar-labeled" aria-label={kt("knowledge.auto.81574e23e48aec6b")} title={kt("knowledge.auto.81574e23e48aec6b")} onClick={() => void startPresentation()}><Play size={15} /><span>{kt("knowledge.auto.81574e23e48aec6b")}</span></button>
          <button type="button" aria-label={kt("knowledge.auto.dcd4eb0273699416")} title={kt("knowledge.auto.dcd4eb0273699416")} disabled={selected === count - 1} onClick={() => select(selected + 1)}><ChevronRight size={16} /></button>
        </PreviewToolbar>
        <div className="knowledge-presentation-canvas">
          <div className="knowledge-presentation-current" style={{ aspectRatio: `${loaded.presentation.width} / ${loaded.presentation.height}`, width: `${zoom * 100}%`, maxWidth: `${loaded.presentation.width * zoom}px` }}>
            <PresentationSlide loaded={loaded} index={selected} />
          </div>
        </div>
      </section>
    </div>
    {presenting && <section className="knowledge-presentation-player" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.81574e23e48aec6b")}>
      <button type="button" className="knowledge-presentation-player-close" aria-label={kt("knowledge.auto.3fd47edce45b3603")} title={kt("knowledge.auto.3fd47edce45b3603")} onClick={stopPresentation}><X size={19} /></button>
      <div className="knowledge-presentation-player-slide" style={{ aspectRatio: `${loaded.presentation.width} / ${loaded.presentation.height}`, height: `min(calc(100dvh - 100px), calc(94vw * ${loaded.presentation.height / loaded.presentation.width}))` }}>
        <PresentationSlide loaded={loaded} index={selected} />
      </div>
      <footer>
        <button type="button" aria-label={kt("knowledge.auto.bcf200709dbc7ff4")} disabled={selected === 0} onClick={() => select(selected - 1)}><ChevronLeft size={19} /></button>
        <span>{selected + 1} / {count}</span>
        <button type="button" aria-label={kt("knowledge.auto.dcd4eb0273699416")} disabled={selected === count - 1} onClick={() => select(selected + 1)}><ChevronRight size={19} /></button>
      </footer>
    </section>}
  </div>;
}
