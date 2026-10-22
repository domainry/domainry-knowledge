import type { KnowledgeClient } from "./types.ts";
export declare function KnowledgePageShareManager({ client, libraryID, pageID, published, formatError, onNotice }: {
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    published: boolean;
    formatError(error: unknown): string;
    onNotice(message: string): void;
}): import("react").JSX.Element | null;
