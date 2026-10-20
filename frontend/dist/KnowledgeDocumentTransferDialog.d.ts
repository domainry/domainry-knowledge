import type { KnowledgeClient, KnowledgeLibrary, KnowledgeTransferSource } from "./types.ts";
type PendingTransfer = {
    source: KnowledgeTransferSource;
    clientID: string;
    targetLibraryID: string;
    mode: "copy" | "move";
};
export declare function loadPendingTransfer(client: KnowledgeClient): PendingTransfer | null;
export declare function canTransferToLibrary(library: KnowledgeLibrary, sourceLibraryID: string, pendingTargetID?: string): boolean;
export declare function KnowledgeDocumentTransferDialog({ client, source: initialSource, canMove, formatError, onClose, onOpenTarget }: {
    client: KnowledgeClient;
    source: KnowledgeTransferSource;
    canMove: boolean;
    formatError?: (error: unknown) => string;
    onClose(): void;
    onOpenTarget(libraryID: string): void;
}): import("react").ReactPortal;
export {};
