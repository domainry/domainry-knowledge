import type { KnowledgeCitation, KnowledgeResult } from "./types.ts";

const searchModeLabels = { hybrid: "混合检索", dense: "语义检索", sparse: "关键词检索" } as const;
const searchDegradedLabels = {
  embedder_unavailable: "语义向量服务不可用，本次已降级为关键词检索。",
  bm25_unavailable: "关键词召回不可用，本次已降级为语义检索。",
  rerank_unavailable: "精排服务不可用，本次结果使用召回顺序。",
} as const;

export function knowledgeSearchStatus(result: KnowledgeResult | null) {
  if (!result || result.operation !== "search") return null;
  const parts: string[] = [];
  if (result.search_mode) parts.push(searchModeLabels[result.search_mode]);
  if (Number.isSafeInteger(result.search_top_k) && result.search_top_k! > 0) parts.push(`Top ${result.search_top_k}`);
  if (result.search_reranked !== undefined) parts.push(result.search_reranked ? "已精排" : "未精排");
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
