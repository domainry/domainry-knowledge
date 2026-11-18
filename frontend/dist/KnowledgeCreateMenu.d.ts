import type { KnowledgePageContentType } from "./types.ts";
export declare function KnowledgeCreateMenu({ disabled, canCreatePage, onCreatePage, onCreateLibrary, onImportFiles, importAccept, importDisabled, openRequest, triggerLabel }: {
    disabled?: boolean;
    canCreatePage: boolean;
    onCreatePage?: (contentType: KnowledgePageContentType) => void;
    onCreateLibrary?: () => void;
    onImportFiles?: (files: File[]) => void;
    importAccept?: string;
    importDisabled?: boolean;
    openRequest?: number;
    triggerLabel?: string;
}): import("react").JSX.Element;
