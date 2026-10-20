import type { FilePreviewLocation, FilePreviewSource } from "../types.ts";
export declare function ImageViewer({ blob, filename }: {
    blob: Blob;
    filename: string;
}): import("react").JSX.Element;
export declare function MediaViewer({ source, kind }: {
    source: FilePreviewSource;
    kind: "audio" | "video";
}): import("react").JSX.Element;
export declare function PDFViewer({ source, location }: {
    source: FilePreviewSource;
    location?: FilePreviewLocation;
}): import("react").JSX.Element;
