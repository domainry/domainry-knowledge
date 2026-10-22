import type { KnowledgeClient } from "./types.ts";
export declare function KnowledgeFilePage({ client, libraryID, pageID, content, formatError }: {
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    content: string;
    formatError(error: unknown): string;
}): import("react").JSX.Element;
