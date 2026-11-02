import type { FilePreviewSource, KnowledgeClient, KnowledgeDocument } from "./types.ts";
export type PreviewFile = {
    filename: string;
    blob: Blob;
    format: string;
    bytes: number;
    sha256: string;
};
export type PreviewText = {
    filename: string;
    format: string;
    text: string;
    bytes: number;
    loadedBytes: number;
    truncated: boolean;
};
export declare const previewTextChunkBytes: number;
export declare const previewOfficeMaxBytes: number;
export declare const previewBinaryMaxBytes: number;
export declare const fallbackDownloadMaxBytes: number;
export declare const fileSHA256Header = "X-Domainry-File-SHA256";
export type FilePreviewKind = "text" | "pdf" | "word" | "presentation" | "spreadsheet" | "image" | "audio" | "video";
export declare const previewFormatDefinitions: Readonly<{
    txt: {
        kind: "text";
        contentType: string;
    };
    md: {
        kind: "text";
        contentType: string;
    };
    rst: {
        kind: "text";
        contentType: string;
    };
    html: {
        kind: "text";
        contentType: string;
    };
    htm: {
        kind: "text";
        contentType: string;
    };
    csv: {
        kind: "text";
        contentType: string;
    };
    json: {
        kind: "text";
        contentType: string;
    };
    jsonl: {
        kind: "text";
        contentType: string;
    };
    py: {
        kind: "text";
        contentType: string;
    };
    js: {
        kind: "text";
        contentType: string;
    };
    ts: {
        kind: "text";
        contentType: string;
    };
    tsx: {
        kind: "text";
        contentType: string;
    };
    jsx: {
        kind: "text";
        contentType: string;
    };
    java: {
        kind: "text";
        contentType: string;
    };
    go: {
        kind: "text";
        contentType: string;
    };
    rs: {
        kind: "text";
        contentType: string;
    };
    c: {
        kind: "text";
        contentType: string;
    };
    h: {
        kind: "text";
        contentType: string;
    };
    cpp: {
        kind: "text";
        contentType: string;
    };
    hpp: {
        kind: "text";
        contentType: string;
    };
    cs: {
        kind: "text";
        contentType: string;
    };
    rb: {
        kind: "text";
        contentType: string;
    };
    php: {
        kind: "text";
        contentType: string;
    };
    kt: {
        kind: "text";
        contentType: string;
    };
    swift: {
        kind: "text";
        contentType: string;
    };
    scala: {
        kind: "text";
        contentType: string;
    };
    sh: {
        kind: "text";
        contentType: string;
    };
    pdf: {
        kind: "pdf";
        contentType: string;
    };
    docx: {
        kind: "word";
        contentType: string;
    };
    pptx: {
        kind: "presentation";
        contentType: string;
    };
    xlsx: {
        kind: "spreadsheet";
        contentType: string;
    };
    xlsm: {
        kind: "spreadsheet";
        contentType: string;
    };
    png: {
        kind: "image";
        contentType: string;
    };
    jpg: {
        kind: "image";
        contentType: string;
    };
    jpeg: {
        kind: "image";
        contentType: string;
    };
    gif: {
        kind: "image";
        contentType: string;
    };
    bmp: {
        kind: "image";
        contentType: string;
    };
    webp: {
        kind: "image";
        contentType: string;
    };
    mp3: {
        kind: "audio";
        contentType: string;
    };
    wav: {
        kind: "audio";
        contentType: string;
    };
    ogg: {
        kind: "audio";
        contentType: string;
    };
    flac: {
        kind: "audio";
        contentType: string;
    };
    m4a: {
        kind: "audio";
        contentType: string;
    };
    aac: {
        kind: "audio";
        contentType: string;
    };
    mp4: {
        kind: "video";
        contentType: string;
    };
    mov: {
        kind: "video";
        contentType: string;
    };
    webm: {
        kind: "video";
        contentType: string;
    };
    avi: {
        kind: "video";
        contentType: string;
    };
}>;
export declare const supportedPreviewFormats: readonly string[];
export declare function previewFormat(filename: string): string;
export declare function previewKind(filename: string): FilePreviewKind | null;
export declare function isTextPreviewFormat(format: string): boolean;
export declare function canPreviewFilename(filename: string): boolean;
export declare function downloadFilename(header: string | null): string;
export declare function readPreviewFile(source: FilePreviewSource, signal: AbortSignal, maxBytes?: number): Promise<PreviewFile>;
export declare function readPreviewText(source: FilePreviewSource, signal: AbortSignal): Promise<PreviewText>;
export declare function readPreviewRange(source: FilePreviewSource, begin: number, end: number, signal: AbortSignal): Promise<{
    data: Uint8Array<ArrayBuffer>;
    total: number;
    filename: string;
    sha256: string;
}>;
export declare function downloadFile(source: FilePreviewSource, signal: AbortSignal): Promise<void>;
export declare function knowledgeDocumentPreviewSource(client: KnowledgeClient, document: KnowledgeDocument): FilePreviewSource;
export declare function knowledgePageDocumentDownloadSource(client: KnowledgeClient, pageID: string, document: KnowledgeDocument): FilePreviewSource;
export declare function downloadDocument(client: KnowledgeClient, document: KnowledgeDocument, signal: AbortSignal): Promise<void>;
