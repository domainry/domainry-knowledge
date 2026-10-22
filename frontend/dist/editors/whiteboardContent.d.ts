export type KnowledgeWhiteboardBinding = {
    element_id: string;
    focus: number;
    gap: number;
    fixed_point?: [number, number];
};
export type KnowledgeWhiteboardElement = {
    id: string;
    type: "rectangle" | "diamond" | "ellipse" | "line" | "arrow" | "freedraw" | "text" | "image" | "frame";
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    stroke_color: string;
    background_color: string;
    fill_style: "hachure" | "cross-hatch" | "solid" | "zigzag";
    stroke_width: number;
    stroke_style: "solid" | "dashed" | "dotted";
    roughness: number;
    opacity: number;
    group_ids?: string[];
    frame_id?: string;
    roundness?: number;
    bound_elements?: {
        id: string;
        type: "text" | "arrow";
    }[];
    link?: string;
    locked?: boolean;
    custom_kind?: "sticky_note" | "template_heading";
    text?: string;
    original_text?: string;
    font_size?: number;
    font_family?: number;
    text_align?: "left" | "center" | "right";
    vertical_align?: "top" | "middle" | "bottom";
    container_id?: string;
    line_height?: number;
    auto_resize?: boolean;
    points?: [number, number][];
    pressures?: number[];
    simulate_pressure?: boolean;
    start_binding?: KnowledgeWhiteboardBinding;
    end_binding?: KnowledgeWhiteboardBinding;
    start_arrowhead?: string;
    end_arrowhead?: string;
    elbowed?: boolean;
    file_id?: string;
    scale?: [number, number];
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
        natural_width: number;
        natural_height: number;
    };
    name?: string;
};
export type KnowledgeWhiteboardAsset = {
    id: string;
    mime_type: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
    data_url: string;
    created_at: number;
};
export type KnowledgeWhiteboardContent = {
    schema_version: 1;
    elements: KnowledgeWhiteboardElement[];
    assets: Record<string, KnowledgeWhiteboardAsset>;
    settings: {
        background_color: string;
        grid_size: number;
        grid_enabled: boolean;
    };
};
export declare const emptyWhiteboardContent: KnowledgeWhiteboardContent;
export declare function canonicalWhiteboardContent(elements: readonly unknown[], files: unknown, appState: unknown): KnowledgeWhiteboardContent;
export declare function whiteboardScene(content: KnowledgeWhiteboardContent): {
    elements: {
        id: string;
        type: "text" | "image" | "rectangle" | "diamond" | "ellipse" | "line" | "arrow" | "freedraw" | "frame";
        x: number;
        y: number;
        width: number;
        height: number;
        angle: number;
        strokeColor: string;
        backgroundColor: string;
        fillStyle: "hachure" | "cross-hatch" | "solid" | "zigzag";
        strokeWidth: number;
        strokeStyle: "solid" | "dashed" | "dotted";
        roughness: number;
        opacity: number;
        groupIds: string[];
        frameId: string | null;
        roundness: {
            type: number;
        } | null;
        boundElements: {
            id: string;
            type: "text" | "arrow";
        }[] | null;
        link: string | null;
        locked: boolean;
        customData: {
            knowledgeKind: "sticky_note" | "template_heading";
        } | undefined;
        text: string | undefined;
        originalText: string | undefined;
        fontSize: number | undefined;
        fontFamily: number | undefined;
        textAlign: "left" | "center" | "right" | undefined;
        verticalAlign: "top" | "middle" | "bottom" | undefined;
        containerId: string | null;
        lineHeight: number | undefined;
        autoResize: boolean | undefined;
        points: [number, number][] | undefined;
        pressures: number[] | undefined;
        simulatePressure: boolean | undefined;
        startBinding: {
            fixedPoint?: [number, number] | undefined;
            elementId: string;
            focus: number;
            gap: number;
        } | null;
        endBinding: {
            fixedPoint?: [number, number] | undefined;
            elementId: string;
            focus: number;
            gap: number;
        } | null;
        startArrowhead: string | null;
        endArrowhead: string | null;
        elbowed: boolean;
        fileId: string | null;
        scale: [number, number];
        crop: {
            x: number;
            y: number;
            width: number;
            height: number;
            naturalWidth: number;
            naturalHeight: number;
        } | null;
        name: string | null;
        seed: number;
        version: number;
        versionNonce: number;
        isDeleted: boolean;
        updated: number;
        index: string;
    }[];
    files: {
        [k: string]: {
            id: string;
            mimeType: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
            dataURL: string;
            created: number;
        };
    };
    appState: {
        viewBackgroundColor: string;
        gridSize: number;
        gridStep: number;
        gridModeEnabled: boolean;
    };
};
export declare function parseWhiteboardContent(body: string): KnowledgeWhiteboardContent;
export declare function whiteboardElementQuote(element: KnowledgeWhiteboardElement): string;
