import * as Y from "yjs";
import type { KnowledgeCollaborationPresence } from "./types.ts";
export declare function collaborationPresenceUserIDs(presence: readonly KnowledgeCollaborationPresence[]): string[];
export declare function collaborationPositionChanged(current: {
    cursor: string;
    selection: string;
}, cursorBlockID?: string, selectionBlockID?: string): boolean;
export declare function encodeCollaborationBinary(value: Uint8Array): string;
export declare function decodeCollaborationBinary(value: string): Uint8Array<ArrayBuffer>;
export declare function applyKnowledgeYjsState(document: Y.Doc, encodedState?: string): boolean;
export declare function applyKnowledgeYjsUpdate(document: Y.Doc, encodedUpdate?: string): boolean;
export declare function mergeKnowledgeYjsUpdates(updates: Uint8Array[]): string;
export declare function encodeKnowledgeYjsState(document: Y.Doc): string;
export declare function collaborationContentSHA256(content: string): Promise<string>;
