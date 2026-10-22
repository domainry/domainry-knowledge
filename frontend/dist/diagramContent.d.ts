export declare const diagramThemes: readonly ["emerald", "ocean", "sunset", "mono"];
export type DiagramTheme = (typeof diagramThemes)[number];
export declare const mindMapLayouts: readonly ["side", "left", "right", "down"];
export type MindMapLayout = (typeof mindMapLayouts)[number];
export declare const flowchartLayouts: readonly ["free", "horizontal", "vertical"];
export type FlowchartLayout = (typeof flowchartLayouts)[number];
export declare const flowchartNodeTypes: readonly ["start", "end", "process", "decision", "subprocess", "user_task", "service_task", "data", "database", "document", "manual_input", "preparation", "delay", "connector", "annotation"];
export type FlowchartNodeType = (typeof flowchartNodeTypes)[number];
export declare const flowchartEdgeTypes: readonly ["polyline", "line", "bezier"];
export type FlowchartEdgeType = (typeof flowchartEdgeTypes)[number];
export type DiagramNodeStyle = {
    color: string;
    background_color: string;
    font_weight: "normal" | "bold";
};
export type MindMapNode = {
    id: string;
    text: string;
    expanded: boolean;
    direction: "auto" | "left" | "right";
    style: DiagramNodeStyle;
    tags?: string[];
    note?: string;
    link?: string;
    children: MindMapNode[];
};
export type MindMapRelation = {
    id: string;
    from: string;
    to: string;
    label: string;
    bidirectional: boolean;
    color: string;
    width: number;
    dashed: boolean;
};
export type MindMapContent = {
    schema_version: 1;
    theme: DiagramTheme;
    layout: MindMapLayout;
    compact: boolean;
    root: MindMapNode;
    relations: MindMapRelation[];
};
export type FlowchartNode = {
    id: string;
    type: FlowchartNodeType;
    x: number;
    y: number;
    text: string;
    style: DiagramNodeStyle;
};
export type FlowchartEdge = {
    id: string;
    source: string;
    target: string;
    label: string;
    type: FlowchartEdgeType;
    style: {
        color: string;
        width: number;
        dashed: boolean;
    };
};
export type FlowchartContent = {
    schema_version: 1;
    theme: DiagramTheme;
    layout: FlowchartLayout;
    grid: boolean;
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
};
export declare const defaultDiagramNodeStyle: DiagramNodeStyle;
export declare const emptyMindMapContent: MindMapContent;
export declare const emptyFlowchartContent: FlowchartContent;
export declare function decodeMindMapContent(body: string): MindMapContent;
export declare function parseMindMapContent(body: string): MindMapContent;
export declare function canonicalMindMapContent(content: MindMapContent): string;
export declare function decodeFlowchartContent(body: string): FlowchartContent;
export declare function parseFlowchartContent(body: string): FlowchartContent;
export declare function canonicalFlowchartContent(content: FlowchartContent): string;
export declare const mindMapTemplates: Record<string, MindMapContent>;
export declare const flowchartTemplates: Record<string, FlowchartContent>;
export declare function layoutFlowchart(content: FlowchartContent, layout: FlowchartLayout): FlowchartContent;
export declare function diagramPlainText(content: MindMapContent | FlowchartContent): string;
export declare function downloadDiagramBlob(blob: Blob, filename: string): void;
