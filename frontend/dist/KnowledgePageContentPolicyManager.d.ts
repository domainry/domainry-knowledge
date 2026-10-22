import type { KnowledgeClient } from "./types.ts";
export declare function KnowledgePageContentPolicyManager({ client, libraryID, pageID, formatError, onNotice, onSaved }: {
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    formatError(error: unknown): string;
    onNotice(message: string): void;
    onSaved?(): void;
}): import("react").JSX.Element;
