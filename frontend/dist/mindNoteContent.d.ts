export type MindNoteNode = {
    id: string;
    text: string;
    completed: boolean;
    collapsed: boolean;
    priority?: "none" | "low" | "medium" | "high" | "urgent";
    due_date?: string;
    tags?: string[];
    note?: string;
    children: MindNoteNode[];
};
export type MindNoteContent = {
    schema_version: 1;
    nodes: MindNoteNode[];
};
export declare const mindNoteMaximumNodes = 20000;
export declare const mindNoteMaximumDepth = 64;
export type MindNoteDocumentBlock = {
    id?: unknown;
    type: string;
    props?: unknown;
    content?: unknown;
    children?: readonly MindNoteDocumentBlock[];
};
export declare const emptyMindNoteContent: MindNoteContent;
export declare function isMindNoteContent(value: unknown): value is MindNoteContent;
export declare function parseMindNoteContent(value: string): MindNoteContent;
export declare function canonicalMindNoteContent(value: MindNoteContent): string;
export declare function mindNotePlainText(value: MindNoteContent): string;
export declare function createMindNoteNode(text?: string): MindNoteNode;
export declare function mindNoteToDocumentContent(value: MindNoteContent): string;
export declare function documentBlocksToMindNote(blocks: readonly MindNoteDocumentBlock[]): MindNoteContent;
