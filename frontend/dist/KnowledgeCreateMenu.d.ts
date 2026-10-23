import type { KnowledgePageContentType } from "./types.ts";
export declare function KnowledgeCreateMenu({ disabled, canCreatePage, onCreatePage, onCreateLibrary }: {
    disabled?: boolean;
    canCreatePage: boolean;
    onCreatePage?: (contentType: KnowledgePageContentType) => void;
    onCreateLibrary?: () => void;
}): import("react").JSX.Element;
