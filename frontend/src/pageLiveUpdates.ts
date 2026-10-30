import type { KnowledgePageView } from "./types.ts";

export type KnowledgePageLiveRefreshState = {
  view: KnowledgePageView;
  title: string;
  body: string;
};

export function resolveKnowledgePageLiveRefresh(input: {
  selectedPageID: string;
  mode: string;
  dirty: boolean;
  current: KnowledgePageView | null;
  refreshed: KnowledgePageView;
}): KnowledgePageLiveRefreshState | null {
  if (
    !input.selectedPageID
    || input.current?.page.id !== input.selectedPageID
    || input.refreshed.page.id !== input.selectedPageID
  ) return null;
  if (input.mode === "edit" && input.dirty) return null;
  const source = input.refreshed.draft || input.refreshed.published;
  return {
    view: input.refreshed,
    title: source?.title || input.refreshed.page.title,
    body: source?.body.content || "",
  };
}
