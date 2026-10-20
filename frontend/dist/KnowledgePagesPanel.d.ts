import type { ReactNode } from "react";
import type { KnowledgeClient, KnowledgeDocument, KnowledgeLibrary } from "./types.ts";
type KnowledgeDocumentsSlotProps = {
    selectedDocumentID: string;
    showUploader: boolean;
    onDocumentsChange(documents: KnowledgeDocument[]): void;
    onSelectedDocumentChange(documentID: string): void;
};
export declare function pageContentSHA256(content: string): Promise<string>;
export declare function KnowledgePagesPanel({ client, library, disabled, formatError, embedded, documents, onManage }: {
    client: KnowledgeClient;
    library: KnowledgeLibrary;
    disabled: boolean;
    formatError(error: unknown): string;
    embedded?: boolean;
    documents?: (props: KnowledgeDocumentsSlotProps) => ReactNode;
    onManage?: () => void;
}): import("react").JSX.Element;
export {};
