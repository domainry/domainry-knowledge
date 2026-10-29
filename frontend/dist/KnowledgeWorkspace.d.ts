import type { ReactNode } from "react";
import type { KnowledgeClient } from "./types.ts";
import { type KnowledgeTheme } from "./theme.tsx";
import type { KnowledgeHostIntegration, KnowledgeHostLocale } from "./hostIntegration.ts";
export type KnowledgeWorkspaceProps = {
    client: KnowledgeClient;
    currentUserID?: string;
    formatError?: (error: unknown) => string;
    headerSearchHost?: HTMLElement | null;
    theme?: KnowledgeTheme;
    locale?: KnowledgeHostLocale;
    hostIntegration?: KnowledgeHostIntegration;
};
export declare function KnowledgeWorkspace({ client, currentUserID, formatError, headerSearchHost, theme, locale, hostIntegration }: KnowledgeWorkspaceProps): import("react").JSX.Element;
export declare function KnowledgeLibraryManager({ client, currentUserID, formatError, initialLibraryID, initialPageID, initialBlockID, initialPageMode, libraryKind, scopeTabs, searchQuery, searchRevision, hostIntegration }: {
    client: KnowledgeClient;
    currentUserID?: string;
    formatError?: (error: unknown) => string;
    initialLibraryID?: string;
    initialPageID?: string;
    initialBlockID?: string;
    initialPageMode?: "read" | "edit";
    libraryKind?: "personal" | "shared";
    scopeTabs?: ReactNode;
    searchQuery?: string;
    searchRevision?: number;
    hostIntegration?: KnowledgeHostIntegration;
}): import("react").JSX.Element;
export declare function KnowledgeLibraryManagerDialog({ client, formatError, onClose }: {
    client: KnowledgeClient;
    formatError?: (error: unknown) => string;
    onClose(): void;
}): import("react").ReactPortal;
