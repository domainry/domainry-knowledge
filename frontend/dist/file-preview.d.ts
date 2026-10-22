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
export declare function previewFormat(filename: string): string;
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
