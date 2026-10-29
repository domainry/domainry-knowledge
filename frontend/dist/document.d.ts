import type { KnowledgeDocument, KnowledgeLibrary } from "./types.ts";
export declare const knowledgeDocumentMaxBytes: number;
export declare function knowledgeDocumentAccept(library: KnowledgeLibrary): string;
export declare function knowledgeDocumentAcceptForContentType(library: KnowledgeLibrary, prefix: "image/" | "video/" | "audio/"): string;
export declare function knowledgeDocumentSupports(library: KnowledgeLibrary, filename: string): boolean;
export declare function selectedUploadFile(files: Pick<FileList, "item"> | null): File | null;
export declare function documentUploadMaxBytes(library: KnowledgeLibrary): number;
export declare function documentIndexMaxBytes(library: KnowledgeLibrary): number;
export declare function documentFormat(library: KnowledgeLibrary, filename: string): import("./types.ts").KnowledgeDocumentFormat | undefined;
export declare function documentIndexMaxBytesForFilename(library: KnowledgeLibrary, filename: string): number;
export declare function documentCanWrite(library: KnowledgeLibrary): boolean;
export declare function documentCanDownload(document: KnowledgeDocument): boolean;
export declare function documentCanRetry(document: KnowledgeDocument): boolean;
export declare function documentCanReindex(document: KnowledgeDocument): boolean;
export declare function documentLabel(document: Pick<KnowledgeDocument, "state" | "index_status" | "error_code" | "reindexing">): string;
export declare function documentStatusDetail(document: KnowledgeDocument): string;
export declare function documentErrorDetail(code?: string): string;
export declare const documentPipelineStages: readonly [{
    readonly key: "upload";
    readonly label: string;
}, {
    readonly key: "scan";
    readonly label: string;
}, {
    readonly key: "parse";
    readonly label: string;
}, {
    readonly key: "chunk";
    readonly label: string;
}, {
    readonly key: "index";
    readonly label: string;
}, {
    readonly key: "complete";
    readonly label: string;
}];
export declare function documentPipelinePosition(document: KnowledgeDocument): number;
export declare function sha256(file: Blob, signal?: AbortSignal, onProgress?: (ratio: number) => void): Promise<string>;
