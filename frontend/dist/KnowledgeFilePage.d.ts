import type { KnowledgeClient } from "./types.ts";
export type KnowledgeFilePageProps = {
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    content: string;
    pageActionHost?: HTMLElement | null;
    canReplace?: boolean;
    replacing?: boolean;
    replaceAccept?: string;
    onReplace?(file: File): void;
    canPublish?: boolean;
    publishing?: boolean;
    onPublish?(): void;
    formatError(error: unknown): string;
};
export declare function KnowledgeFilePage({ client, libraryID, pageID, content, pageActionHost, canReplace, replacing, replaceAccept, onReplace, canPublish, publishing, onPublish, formatError }: KnowledgeFilePageProps): import("react").JSX.Element;
