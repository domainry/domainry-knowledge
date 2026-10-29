import { kt } from "./i18n/runtime.ts";
import type { KnowledgeCitation, KnowledgeResult } from "./types.ts";

const searchModeLabels = {
  get hybrid() { return kt("knowledge.auto.9b33c416a1fac0a9"); },
  get dense() { return kt("knowledge.auto.d3b1a48d68e44490"); },
  get sparse() { return kt("knowledge.auto.a4a04cd4413a3588"); },
} as const;
const searchDegradedLabels = {
  get embedder_unavailable() { return kt("knowledge.auto.19439d8c784d0769"); },
  get bm25_unavailable() { return kt("knowledge.auto.3c03ecdc196823e1"); },
  get rerank_unavailable() { return kt("knowledge.auto.390dc93f25474342"); },
} as const;

export function knowledgeSearchStatus(result: KnowledgeResult | null) {
  if (!result || result.operation !== "search") return null;
  const parts: string[] = [];
  if (result.search_mode) parts.push(searchModeLabels[result.search_mode]);
  if (Number.isSafeInteger(result.search_top_k) && result.search_top_k! > 0) parts.push(`Top ${result.search_top_k}`);
  if (result.search_reranked !== undefined) parts.push(result.search_reranked ? kt("knowledge.auto.545e3cf0601d206c") : kt("knowledge.auto.3c011104ee3d86cc"));
  return {
    summary: parts.join(" · "),
    degraded: result.search_degraded_reason ? searchDegradedLabels[result.search_degraded_reason] : "",
  };
}

export type KnowledgeDocumentHit = KnowledgeCitation & { matchedPassages: number };

export function knowledgeCitations(result: KnowledgeResult | null) {
  return (result?.citations || []).filter(item => item && item.doc_id && ["search", "fetch"].includes(item.operation));
}

export function knowledgeDocumentHits(result: KnowledgeResult | null): KnowledgeDocumentHit[] {
  const hits: KnowledgeDocumentHit[] = [], positions = new Map<string, number>();
  for (const citation of knowledgeCitations(result)) {
    const key = `${citation.library_id || ""}:${citation.doc_id}`;
    const position = positions.get(key);
    if (position === undefined) {
      positions.set(key, hits.length);
      hits.push({ ...citation, matchedPassages: 1 });
      continue;
    }
    const current = hits[position], nextScore = Number.isFinite(citation.score) ? citation.score! : Number.NEGATIVE_INFINITY;
    const currentScore = Number.isFinite(current.score) ? current.score! : Number.NEGATIVE_INFINITY;
    const preferred = nextScore > currentScore || (!current.excerpt && !!citation.excerpt) ? citation : current;
    hits[position] = { ...preferred, matchedPassages: current.matchedPassages + 1 };
  }
  return hits;
}
