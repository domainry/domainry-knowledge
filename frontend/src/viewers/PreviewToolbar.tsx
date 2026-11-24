import { Maximize2, Minimize2, Minus, Plus, ScanLine } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { kt } from "../i18n/runtime.ts";

export function usePreviewFullscreen<T extends HTMLElement>(root: RefObject<T | null>) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", update);
    update();
    return () => document.removeEventListener("fullscreenchange", update);
  }, [root]);

  const toggleFullscreen = useCallback(async () => {
    const element = root.current;
    if (!element) return;
    if (document.fullscreenElement === element) await document.exitFullscreen();
    else await element.requestFullscreen();
  }, [root]);

  return { fullscreen, toggleFullscreen };
}

function useViewportPinnedToolbar(fullscreen: boolean) {
  const anchor = useRef<HTMLSpanElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = toolbar.current;
    const preview = anchor.current?.parentElement;
    if (!element || !preview) return;
    const previewStyle = window.getComputedStyle(preview);
    for (const variable of [
      "--knowledge-border",
      "--knowledge-border-strong",
      "--knowledge-focus",
      "--knowledge-muted",
      "--knowledge-primary",
      "--knowledge-shadow-color",
      "--knowledge-surface-elevated",
      "--knowledge-surface-hover",
      "--knowledge-text",
    ]) element.style.setProperty(variable, previewStyle.getPropertyValue(variable));

    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      const bounds = preview.getBoundingClientRect();
      const inset = 16;
      const toolbarHeight = Math.max(44, element.offsetHeight);
      let visibleTop = Math.max(0, bounds.top);
      let visibleBottom = Math.min(window.innerHeight, bounds.bottom);
      let visibleLeft = Math.max(0, bounds.left);
      let visibleRight = Math.min(window.innerWidth, bounds.right);

      for (let parent = preview.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const style = window.getComputedStyle(parent);
        const clipsX = /auto|scroll|hidden|clip/.test(`${style.overflow} ${style.overflowX}`);
        const clipsY = /auto|scroll|hidden|clip/.test(`${style.overflow} ${style.overflowY}`);
        if (!clipsX && !clipsY) continue;
        const parentBounds = parent.getBoundingClientRect();
        if (clipsX) {
          visibleLeft = Math.max(visibleLeft, parentBounds.left);
          visibleRight = Math.min(visibleRight, parentBounds.right);
        }
        if (clipsY) {
          visibleTop = Math.max(visibleTop, parentBounds.top);
          visibleBottom = Math.min(visibleBottom, parentBounds.bottom);
        }
      }

      const minimumTop = visibleTop + inset;
      const maximumTop = visibleBottom - toolbarHeight - inset;
      const leftEdge = visibleLeft + inset;
      const rightEdge = visibleRight - inset;
      const visible = maximumTop >= minimumTop && rightEdge - leftEdge >= 120;

      element.style.visibility = visible ? "visible" : "hidden";
      element.style.pointerEvents = visible ? "auto" : "none";
      if (!visible) return;
      element.style.top = `${Math.round(maximumTop)}px`;
      element.style.left = `${Math.round((leftEdge + rightEdge) / 2)}px`;
      element.style.maxWidth = `${Math.round(rightEdge - leftEdge)}px`;
    };
    const schedule = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(preview);
    observer.observe(element);
    for (let parent = preview.parentElement; parent && parent !== document.body; parent = parent.parentElement) observer.observe(parent);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    document.addEventListener("fullscreenchange", schedule);
    update();
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      document.removeEventListener("fullscreenchange", schedule);
    };
  }, [fullscreen]);

  return { anchor, toolbar };
}

export function PreviewToolbar({
  children,
  fitLabel = kt("knowledge.auto.c1f31e481aaa0b3b"),
  fitted = false,
  fullscreen,
  label,
  maxZoom = 3,
  minZoom = .25,
  onFit,
  onFullscreen,
  onReset,
  onZoomChange,
  status,
  zoom,
  zoomStep = .1,
}: {
  children?: ReactNode;
  fitLabel?: string;
  fitted?: boolean;
  fullscreen: boolean;
  label: string;
  maxZoom?: number;
  minZoom?: number;
  onFit?(): void;
  onFullscreen(): void;
  onReset(): void;
  onZoomChange(zoom: number): void;
  status?: ReactNode;
  zoom: number;
  zoomStep?: number;
}) {
  const { anchor, toolbar } = useViewportPinnedToolbar(fullscreen);
  const zoomLabel = kt("knowledge.auto.b762aec769a35fff");
  const resetLabel = kt("knowledge.auto.cb5d682bac3d1a2d");
  const fullscreenLabel = fullscreen ? kt("knowledge.auto.3fd47edce45b3603") : kt("knowledge.auto.00bd3960fea8ea98");
  const changeZoom = (next: number) => onZoomChange(Math.min(maxZoom, Math.max(minZoom, next)));

  const content = <div ref={toolbar} className="knowledge-preview-toolbar" role="toolbar" aria-label={label}>
    {status !== undefined && <div className="knowledge-preview-toolbar-status">{status}</div>}
    <div className="knowledge-preview-toolbar-actions">
      {children}
      {children && <span className="knowledge-preview-toolbar-divider" aria-hidden="true" />}
      <button type="button" aria-label={`${zoomLabel} −`} title={`${zoomLabel} −`} disabled={zoom <= minZoom} onClick={() => changeZoom(zoom - zoomStep)}><Minus size={16} /></button>
      <button type="button" className="knowledge-preview-zoom" aria-label={resetLabel} title={resetLabel} onClick={onReset}>{Math.round(zoom * 100)}%</button>
      <button type="button" aria-label={`${zoomLabel} +`} title={`${zoomLabel} +`} disabled={zoom >= maxZoom} onClick={() => changeZoom(zoom + zoomStep)}><Plus size={16} /></button>
      {onFit && <button type="button" aria-label={fitLabel} title={fitLabel} aria-pressed={fitted} onClick={onFit}><ScanLine size={16} /></button>}
      <span className="knowledge-preview-toolbar-divider" aria-hidden="true" />
      <button type="button" aria-label={fullscreenLabel} title={fullscreenLabel} onClick={onFullscreen}>{fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
    </div>
  </div>;
  const portalTarget = typeof document === "undefined" ? null : fullscreen && document.fullscreenElement instanceof HTMLElement ? document.fullscreenElement : document.body;
  return <><span ref={anchor} className="knowledge-preview-toolbar-anchor" aria-hidden="true" />{portalTarget ? createPortal(content, portalTarget) : content}</>;
}
