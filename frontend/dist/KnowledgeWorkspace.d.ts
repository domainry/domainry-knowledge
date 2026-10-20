import { type ReactNode } from "react";
import type { KnowledgeClient } from "./types.ts";
export type KnowledgeWorkspaceProps = {
    client: KnowledgeClient;
    navigation?: ReactNode;
    formatError?: (error: unknown) => string;
    title?: string;
};
export declare function KnowledgeWorkspace({ client, navigation, formatError, title }: KnowledgeWorkspaceProps): import("react").JSX.Element;
export declare function KnowledgeLibraryManager({ client, formatError, initialLibraryID, libraryKind, searchQuery, searchRevision }: {
    client: KnowledgeClient;
    formatError?: (error: unknown) => string;
    initialLibraryID?: string;
    libraryKind?: "personal" | "shared";
    searchQuery?: string;
    searchRevision?: number;
}): import("react").JSX.Element;
export declare function KnowledgeLibraryManagerDialog({ client, formatError, onClose }: {
    client: KnowledgeClient;
    formatError?: (error: unknown) => string;
    onClose(): void;
}): import("react").ReactPortal;
