import type { KnowledgeClient } from "./types.ts";
export declare function KnowledgeSharedPage({ client, shareID, pageID, formatError }: {
    client: KnowledgeClient;
    shareID: string;
    pageID: string;
    formatError(error: unknown): string;
}): import("react").JSX.Element;
