import type { ReactNode } from "react";
import type { KnowledgeClient, KnowledgeLibrary, KnowledgePageSearchLocation } from "./types.ts";
export declare function pageContentSHA256(content: string): Promise<string>;
export declare function KnowledgePagesPanel({ client, library, currentUserID, disabled, formatError, embedded, initialPageID, initialBlockID, initialSearchLocation, initialPageMode, scopeTabs, teamLibraries, onLibrarySelect, onCreateLibrary, onSelectionChange, onManage }: {
    client: KnowledgeClient;
    library: KnowledgeLibrary;
    currentUserID?: string;
    disabled: boolean;
    formatError(error: unknown): string;
    embedded?: boolean;
    initialPageID?: string;
    initialBlockID?: string;
    initialSearchLocation?: KnowledgePageSearchLocation;
    initialPageMode?: "read" | "edit";
    scopeTabs?: ReactNode;
    teamLibraries?: KnowledgeLibrary[];
    onLibrarySelect?: (libraryID: string) => void;
    onCreateLibrary?: () => void;
    onSelectionChange?: (page: {
        id: string;
        title: string;
        mode: "read" | "edit";
    } | null) => void;
    onManage?: () => void;
}): import("react").JSX.Element;
