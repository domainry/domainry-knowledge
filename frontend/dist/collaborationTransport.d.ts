import type { KnowledgeClient, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSession, KnowledgeCollaborationSync, KnowledgeCollaborationSyncResult, KnowledgePageView } from "./types.ts";
export type KnowledgeCollaborationTransport = {
    readonly kind: "post-sse" | "websocket";
    connect(clientID: string, signal: AbortSignal): Promise<KnowledgeCollaborationSession>;
    sync(request: KnowledgeCollaborationSync, signal: AbortSignal): Promise<KnowledgeCollaborationSyncResult>;
    stream(sessionID: string, afterClock: number, connectionAttempt: number, onEvent: (event: KnowledgeCollaborationServerEvent) => void, signal: AbortSignal): Promise<void>;
    close(sessionID: string, signal: AbortSignal): Promise<void>;
    publish(request: {
        session_id: string;
        client_id: string;
        publish_note?: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
};
export declare function createKnowledgeCollaborationTransport(client: KnowledgeClient, libraryID: string, pageID: string): KnowledgeCollaborationTransport | null;
