import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
/**
 * Excalidraw consumes primary-pointer events as canvas panning in view mode and
 * does not publish its normal element hit result. Resolve the topmost visible
 * element ourselves so read-only boards can still create anchored comments.
 */
export declare function pickWhiteboardElement(elements: readonly ExcalidrawElement[], x: number, y: number, zoom?: number): import("@excalidraw/excalidraw/element/types").ExcalidrawSelectionElement | import("@excalidraw/excalidraw/element/types").ExcalidrawRectangleElement | import("@excalidraw/excalidraw/element/types").ExcalidrawDiamondElement | import("@excalidraw/excalidraw/element/types").ExcalidrawEllipseElement | import("@excalidraw/excalidraw/element/types").ExcalidrawTextElement | import("@excalidraw/excalidraw/element/types").ExcalidrawLinearElement | import("@excalidraw/excalidraw/element/types").ExcalidrawFreeDrawElement | import("@excalidraw/excalidraw/element/types").ExcalidrawImageElement | import("@excalidraw/excalidraw/element/types").ExcalidrawFrameElement | import("@excalidraw/excalidraw/element/types").ExcalidrawMagicFrameElement | import("@excalidraw/excalidraw/element/types").ExcalidrawIframeElement | import("@excalidraw/excalidraw/element/types").ExcalidrawEmbeddableElement | null;
