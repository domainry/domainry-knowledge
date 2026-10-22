import type { FilePreviewSource } from "./types.ts";
export declare function FilePreviewDialog({ source, downloadSource, formatError, onClose }: {
    source: FilePreviewSource;
    downloadSource?: FilePreviewSource;
    formatError?: (error: unknown) => string;
    onClose(): void;
}): import("react").ReactPortal;
