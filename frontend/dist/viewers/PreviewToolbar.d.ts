import type { ReactNode, RefObject } from "react";
export declare function usePreviewFullscreen<T extends HTMLElement>(root: RefObject<T | null>): {
    fullscreen: boolean;
    toggleFullscreen: () => Promise<void>;
};
export declare function PreviewToolbar({ children, fitLabel, fitted, fullscreen, label, maxZoom, minZoom, onFit, onFullscreen, onReset, onZoomChange, status, zoom, zoomStep, }: {
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
}): import("react").JSX.Element;
