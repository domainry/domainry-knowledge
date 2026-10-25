import type { KnowledgePageContentType } from "./types.ts";
export declare function KnowledgeCreateMenu({ disabled, canCreatePage, onCreatePage, onCreateLibrary, onImportFile, importAccept, importDisabled, importing }: {
    disabled?: boolean;
    canCreatePage: boolean;
    onCreatePage?: (contentType: KnowledgePageContentType) => void;
    onCreateLibrary?: () => void;
    onImportFile?: (file: File) => void;
    importAccept?: string;
    importDisabled?: boolean;
    importing?: boolean;
}): import("react").JSX.Element;
