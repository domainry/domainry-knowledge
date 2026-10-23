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
export declare function documentLabel(document: Pick<KnowledgeDocument, "state" | "index_status" | "error_code" | "reindexing">): "可检索 · 正在重新索引" | "索引失败" | "上传未完成" | "已隔离 · 等待安全扫描" | "正在安全扫描" | "等待入库" | "正在建立索引" | "可检索" | "处理未完成" | "上传结果待核查" | "已停止访问 · 正在清理" | "已删除";
export declare function documentStatusDetail(document: KnowledgeDocument): string;
export declare function documentErrorDetail(code?: string): string;
export declare const documentPipelineStages: readonly [{
    readonly key: "upload";
    readonly label: "上传";
}, {
    readonly key: "scan";
    readonly label: "安全扫描";
}, {
    readonly key: "parse";
    readonly label: "解析";
}, {
    readonly key: "chunk";
    readonly label: "切块";
}, {
    readonly key: "index";
    readonly label: "索引";
}, {
    readonly key: "complete";
    readonly label: "完成";
}];
export declare function documentPipelinePosition(document: KnowledgeDocument): number;
export declare function sha256(file: Blob, signal?: AbortSignal, onProgress?: (ratio: number) => void): Promise<string>;
