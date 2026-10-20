import type { KnowledgeClient, KnowledgeDocument, KnowledgeLibrary } from "./types.ts";
export declare function KnowledgeDocumentsPanel({ client, initialLibrary, formatError, onBusyChange, onOpenLibrary, embedded, hideList, showUploader, selectedDocumentID, onSelectedDocumentChange, onDocumentsChange }: {
    client: KnowledgeClient;
    initialLibrary: KnowledgeLibrary;
    formatError?: (error: unknown) => string;
    onBusyChange?: (busy: boolean) => void;
    onOpenLibrary?: (libraryID: string) => void;
    embedded?: boolean;
    hideList?: boolean;
    showUploader?: boolean;
    selectedDocumentID?: string;
    onSelectedDocumentChange?: (documentID: string) => void;
    onDocumentsChange?: (documents: KnowledgeDocument[]) => void;
}): import("react").JSX.Element;
