import type { KnowledgeClient, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSession, KnowledgeCollaborationSync, KnowledgeCollaborationSyncResult, KnowledgePageView } from "./types.ts";

export type KnowledgeCollaborationTransport = {
  readonly kind: "post-sse" | "websocket";
  connect(clientID: string, signal: AbortSignal): Promise<KnowledgeCollaborationSession>;
  sync(request: KnowledgeCollaborationSync, signal: AbortSignal): Promise<KnowledgeCollaborationSyncResult>;
  stream(sessionID: string, afterClock: number, connectionAttempt: number, onEvent: (event: KnowledgeCollaborationServerEvent) => void, signal: AbortSignal): Promise<void>;
  close(sessionID: string, signal: AbortSignal): Promise<void>;
  publish(request: { session_id: string; client_id: string; publish_note?: string }, signal: AbortSignal): Promise<KnowledgePageView>;
};

export function createKnowledgeCollaborationTransport(client: KnowledgeClient, libraryID: string, pageID: string): KnowledgeCollaborationTransport | null {
  if (!client.connectKnowledgeCollaboration || !client.syncKnowledgeCollaboration || !client.streamKnowledgeCollaborationEvents || !client.closeKnowledgeCollaboration || !client.publishKnowledgeCollaboration) return null;
  return {
    kind: "post-sse",
    connect: (clientID, signal) => client.connectKnowledgeCollaboration!(libraryID, pageID, { client_id: clientID }, signal),
    sync: (request, signal) => client.syncKnowledgeCollaboration!(libraryID, pageID, request, signal),
    stream: (sessionID, afterClock, connectionAttempt, onEvent, signal) => client.streamKnowledgeCollaborationEvents!(libraryID, pageID, sessionID, afterClock, connectionAttempt, onEvent, signal),
    close: (sessionID, signal) => client.closeKnowledgeCollaboration!(libraryID, pageID, sessionID, signal),
    publish: (request, signal) => client.publishKnowledgeCollaboration!(libraryID, pageID, request, signal),
  };
}
