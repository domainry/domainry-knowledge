import type { KnowledgeClient, KnowledgeCollaborationPresence, KnowledgeCollaborationSnapshot } from "./types.ts";
type NativeAwarenessOptions = {
    active: boolean;
    client: KnowledgeClient;
    libraryID: string;
    pageID: string;
    onSnapshot?(snapshot: KnowledgeCollaborationSnapshot): void;
    onError?(failure: unknown): void;
};
export declare function useKnowledgeNativeAwareness(options: NativeAwarenessOptions): {
    available: boolean;
    ready: boolean;
    state: "connected" | "unavailable" | "error" | "connecting" | "reconnecting";
    presence: KnowledgeCollaborationPresence[];
    onlineUsers: number;
    updatePresence: (cursorTargetID?: string, selectionTargetID?: string) => void;
};
export {};
