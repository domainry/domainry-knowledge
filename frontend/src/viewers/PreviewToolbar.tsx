import { Maximize2, Minimize2, Minus, Plus, ScanLine } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  const zoomLabel = kt("knowledge.auto.b762aec769a35fff");
  const resetLabel = kt("knowledge.auto.cb5d682bac3d1a2d");
  const fullscreenLabel = fullscreen ? kt("knowledge.auto.3fd47edce45b3603") : kt("knowledge.auto.00bd3960fea8ea98");
  const changeZoom = (next: number) => onZoomChange(Math.min(maxZoom, Math.max(minZoom, next)));

  return <div className="knowledge-preview-toolbar" role="toolbar" aria-label={label}>
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
}
