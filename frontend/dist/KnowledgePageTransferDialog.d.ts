import type { KnowledgeClient, KnowledgeLibrary, KnowledgePage } from "./types.ts";
export declare function KnowledgePageTransferDialog({ client, sourceLibrary, page, formatError, onClose, onTransferred }: {
    client: KnowledgeClient;
    sourceLibrary: KnowledgeLibrary;
    page: KnowledgePage;
    formatError(error: unknown): string;
    onClose(): void;
    onTransferred(targetLibrary: KnowledgeLibrary, page: KnowledgePage): void;
}): import("react").ReactPortal;
