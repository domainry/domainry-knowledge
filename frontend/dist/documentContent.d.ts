import type { Block } from "@blocknote/core";
export type KnowledgeDocumentEnvelope = {
    blocks: Block[];
};
export declare function parseDocumentBlocks(content: string): Block[];
export declare function serializeDocumentBlocks(blocks: readonly Block[]): string;
export declare function documentText(content: string): string;
export declare function documentStats(content: string): {
    blocks: number;
    characters: number;
};
export declare function documentOutline(content: string): {
    key: string;
    level: number;
    title: string;
}[];
export declare function appendDocumentImage(content: string, documentID: string, title: string): string;
