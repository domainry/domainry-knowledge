import type { KnowledgeClient } from "./types.ts";
export declare function KnowledgeFilePage({ client, libraryID, pageID, content, pageActionHost, formatError }: {
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    content: string;
    pageActionHost?: HTMLElement | null;
    formatError(error: unknown): string;
}): import("react").JSX.Element;
