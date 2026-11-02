const pageTreeIndentStep = 16;
const pageTreeIndentBase = 4;
export const pageTreeDefaultWidth = 264;
export const pageTreeMinimumWidth = 220;
export const pageTreeMaximumWidth = 560;
export const pageTreeMaximumVisualDepth = 6;

export function clampPageTreeWidth(width: number): number {
  const normalizedWidth = Number.isFinite(width) ? Math.round(width) : pageTreeDefaultWidth;
  return Math.max(pageTreeMinimumWidth, Math.min(pageTreeMaximumWidth, normalizedWidth));
}

export function pageTreeIndent(depth: number): number {
  const normalizedDepth = Number.isFinite(depth) ? Math.max(0, Math.floor(depth)) : 0;
  return Math.min(normalizedDepth, pageTreeMaximumVisualDepth) * pageTreeIndentStep + pageTreeIndentBase;
}

export function pageTreeLoadMoreIndent(depth: number): number {
  return pageTreeIndent(depth) + 20;
}
