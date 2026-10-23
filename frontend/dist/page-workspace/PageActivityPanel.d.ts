export type PageActivityItem = {
    key: string;
    at: string;
    title: string;
    detail: string;
};
export declare function PageActivityPanel({ items, versionsComplete, commentsComplete, onLoadMoreVersions, onLoadMoreComments }: {
    items: PageActivityItem[];
    versionsComplete: boolean;
    commentsComplete: boolean;
    onLoadMoreVersions(): void;
    onLoadMoreComments(): void;
}): import("react").JSX.Element;
