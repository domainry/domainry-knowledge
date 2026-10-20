import type { FilePreviewSource } from "./types.ts";
export declare function FilePreviewDialog({ source, formatError, onClose }: {
    source: FilePreviewSource;
    formatError?: (error: unknown) => string;
    onClose(): void;
}): import("react").ReactPortal;
