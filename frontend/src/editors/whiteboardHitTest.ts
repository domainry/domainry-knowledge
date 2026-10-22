import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

function localPoint(element: ExcalidrawElement, x: number, y: number) {
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  const cosine = Math.cos(-element.angle);
  const sine = Math.sin(-element.angle);
  const offsetX = x - centerX;
  const offsetY = y - centerY;
  return {
    x: offsetX * cosine - offsetY * sine + element.width / 2,
    y: offsetX * sine + offsetY * cosine + element.height / 2,
  };
}

function segmentDistance(x: number, y: number, start: readonly number[], end: readonly number[]) {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  const progress = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - start[0]) * deltaX + (y - start[1]) * deltaY) / lengthSquared));
  return Math.hypot(x - (start[0] + deltaX * progress), y - (start[1] + deltaY * progress));
}

function hitsElement(element: ExcalidrawElement, x: number, y: number, threshold: number) {
  const point = localPoint(element, x, y);
  if (element.type === "line" || element.type === "arrow" || element.type === "freedraw") {
    const points = element.points || [];
    const lineThreshold = Math.max(threshold, element.strokeWidth + 2);
    for (let index = 1; index < points.length; index++) {
      if (segmentDistance(point.x, point.y, points[index - 1], points[index]) <= lineThreshold) return true;
    }
    return false;
  }
  const width = Math.max(1, element.width);
  const height = Math.max(1, element.height);
  if (element.type === "ellipse") {
    const radiusX = width / 2 + threshold;
    const radiusY = height / 2 + threshold;
    return ((point.x - width / 2) / radiusX) ** 2 + ((point.y - height / 2) / radiusY) ** 2 <= 1;
  }
  if (element.type === "diamond") {
    return Math.abs(point.x - width / 2) / (width / 2 + threshold) + Math.abs(point.y - height / 2) / (height / 2 + threshold) <= 1;
  }
  const inside = point.x >= -threshold && point.x <= width + threshold && point.y >= -threshold && point.y <= height + threshold;
  if (!inside || element.type !== "frame") return inside;
  return point.x <= threshold || point.x >= width - threshold || point.y <= threshold || point.y >= height - threshold;
}

/**
 * Excalidraw consumes primary-pointer events as canvas panning in view mode and
 * does not publish its normal element hit result. Resolve the topmost visible
 * element ourselves so read-only boards can still create anchored comments.
 */
export function pickWhiteboardElement(elements: readonly ExcalidrawElement[], x: number, y: number, zoom = 1) {
  const threshold = 8 / Math.max(zoom, 0.1);
  for (let index = elements.length - 1; index >= 0; index--) {
    const element = elements[index];
    if (!element.isDeleted && hitsElement(element, x, y, threshold)) return element;
  }
  return null;
}
