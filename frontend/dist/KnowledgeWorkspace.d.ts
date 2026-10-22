import type { KnowledgeClient } from "./types.ts";
export type KnowledgeWorkspaceProps = {
    client: KnowledgeClient;
    currentUserID?: string;
    formatError?: (error: unknown) => string;
};
export declare function KnowledgeWorkspace({ client, currentUserID, formatError }: KnowledgeWorkspaceProps): import("react").JSX.Element;
export declare function KnowledgeLibraryManager({ client, currentUserID, formatError, initialLibraryID, initialPageID, initialBlockID, initialPageMode, libraryKind, searchQuery, searchRevision }: {
    client: KnowledgeClient;
    currentUserID?: string;
    formatError?: (error: unknown) => string;
    initialLibraryID?: string;
    initialPageID?: string;
    initialBlockID?: string;
    initialPageMode?: "read" | "edit";
    libraryKind?: "personal" | "shared";
    searchQuery?: string;
    searchRevision?: number;
}): import("react").JSX.Element;
export declare function KnowledgeLibraryManagerDialog({ client, formatError, onClose }: {
    client: KnowledgeClient;
    formatError?: (error: unknown) => string;
    onClose(): void;
}): import("react").ReactPortal;
