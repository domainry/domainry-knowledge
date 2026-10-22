export declare const presentationCanvasWidth = 1600;
export declare const presentationCanvasHeight = 900;
export type PresentationThemeID = "forest" | "midnight" | "sunrise";
export type PresentationLayout = "title" | "section" | "agenda" | "title_content" | "two_column" | "quote" | "image_focus" | "blank";
export type PresentationElementType = "text" | "shape" | "image" | "video" | "table" | "chart" | "formula" | "code";
export declare const presentationShapeTypes: readonly ["rectangle", "rounded_rectangle", "ellipse", "triangle", "diamond", "hexagon", "star", "arrow_right", "callout", "line"];
export type PresentationShapeType = typeof presentationShapeTypes[number];
export declare const presentationChartTypes: readonly ["column", "bar", "line", "area", "pie", "donut"];
export type PresentationChartType = typeof presentationChartTypes[number];
export type PresentationTable = {
    rows: string[][];
    header: boolean;
};
export type PresentationChart = {
    type: PresentationChartType;
    categories: string[];
    series: Array<{
        name: string;
        values: number[];
    }>;
};
export type PresentationMaster = {
    background_color: string;
    text_color: string;
    accent_color: string;
    muted_color: string;
    font_family: string;
    footer: string;
    show_slide_number: boolean;
};
export type PresentationAsset = {
    id: string;
    mime_type: "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "video/mp4" | "video/webm";
    document_ref: string;
    filename: string;
};
export type PresentationElement = {
    id: string;
    type: PresentationElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    text?: string;
    font_size?: number;
    font_weight?: "normal" | "bold";
    color?: string;
    align?: "left" | "center" | "right";
    shape?: PresentationShapeType;
    fill_color?: string;
    stroke_color?: string;
    stroke_width?: number;
    asset_id?: string;
    fit?: "contain" | "cover";
    table?: PresentationTable;
    chart?: PresentationChart;
    formula?: string;
    language?: string;
    source?: string;
};
export type PresentationSlide = {
    id: string;
    title: string;
    layout: PresentationLayout;
    background_color: string;
    notes: string;
    elements: PresentationElement[];
    files: Record<string, PresentationAsset>;
};
export type PresentationContent = {
    schema_version: 1;
    theme: PresentationThemeID;
    master: PresentationMaster;
    slides: PresentationSlide[];
};
export declare const presentationThemes: Record<PresentationThemeID, {
    label: string;
    master: PresentationMaster;
}>;
export declare const presentationLayouts: Array<{
    id: PresentationLayout;
    label: string;
}>;
export declare function presentationLayoutElements(slideID: string, layout: PresentationLayout, master: PresentationMaster): PresentationElement[];
export declare function createPresentationSlide(id: string, index: number, layout: PresentationLayout, master: PresentationMaster): PresentationSlide;
export declare const emptyPresentationContent: PresentationContent;
export declare function isPresentationContent(value: unknown): value is PresentationContent;
export declare function parsePresentationContent(body: string): PresentationContent;
export declare function canonicalPresentationContent(value: PresentationContent): string;
export declare function applyPresentationTheme(content: PresentationContent, theme: PresentationThemeID): PresentationContent;
export declare function presentationPlainText(content: PresentationContent): string;
