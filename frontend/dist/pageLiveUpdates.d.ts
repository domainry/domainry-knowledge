import type { KnowledgePageView } from "./types.ts";
export type KnowledgePageLiveRefreshState = {
    view: KnowledgePageView;
    title: string;
    body: string;
};
export declare function resolveKnowledgePageLiveRefresh(input: {
    selectedPageID: string;
    mode: string;
    dirty: boolean;
    current: KnowledgePageView | null;
    refreshed: KnowledgePageView;
}): KnowledgePageLiveRefreshState | null;
export declare function resolveKnowledgePageProjectionRefresh(input: {
    selectedPageID: string;
    current: KnowledgePageView | null;
    refreshed: KnowledgePageView;
}): KnowledgePageView | null;
