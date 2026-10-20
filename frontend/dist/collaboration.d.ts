import * as Y from "yjs";
export declare function encodeCollaborationBinary(value: Uint8Array): string;
export declare function decodeCollaborationBinary(value: string): Uint8Array<ArrayBuffer>;
export declare function applyKnowledgeYjsState(document: Y.Doc, encodedState?: string): boolean;
export declare function encodeKnowledgeYjsState(document: Y.Doc): string;
export declare function collaborationContentSHA256(content: string): Promise<string>;
