export type PageOutlineItem = {
    key: string;
    level: number;
    title: string;
};
export declare function PageOutline({ items }: {
    items: PageOutlineItem[];
}): import("react").JSX.Element;
