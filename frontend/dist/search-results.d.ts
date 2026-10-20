import type { KnowledgeCitation, KnowledgeResult } from "./types.ts";
export declare function knowledgeSearchStatus(result: KnowledgeResult | null): {
    summary: string;
    degraded: string;
} | null;
export type KnowledgeDocumentHit = KnowledgeCitation & {
    matchedPassages: number;
};
export declare function knowledgeCitations(result: KnowledgeResult | null): KnowledgeCitation[];
export declare function knowledgeDocumentHits(result: KnowledgeResult | null): KnowledgeDocumentHit[];
