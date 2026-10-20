import assert from "node:assert/strict";
import test from "node:test";
import { knowledgeDocumentHits, knowledgeSearchStatus } from "../src/search-results.ts";
import type { KnowledgeResult } from "../src/types.ts";

test("search results keep the best passage and deduplicate only within one library", () => {
  const result: KnowledgeResult = { provider: "fixture", kb_id: "kb", operation: "search", data: {}, citations: [
    { id: "a1", provider: "fixture", kb_id: "kb", operation: "search", library_id: "lib_a", doc_id: "doc", score: 0.4 },
    { id: "a2", provider: "fixture", kb_id: "kb", operation: "search", library_id: "lib_a", doc_id: "doc", score: 0.9, excerpt: "best" },
    { id: "b1", provider: "fixture", kb_id: "kb", operation: "search", library_id: "lib_b", doc_id: "doc", score: 0.2, excerpt: "other library" },
  ] };
  assert.deepEqual(knowledgeDocumentHits(result).map(hit => ({ id: hit.id, count: hit.matchedPassages })), [
    { id: "a2", count: 2 },
    { id: "b1", count: 1 },
  ]);
});

test("search status exposes the actual retrieval path and safe degradation", () => {
  const status = knowledgeSearchStatus({
    provider: "http_api", kb_id: "kb", operation: "search", data: {},
    search_top_k: 10, search_mode: "dense", search_reranked: false,
    search_degraded_reason: "bm25_unavailable",
  });
  assert.deepEqual(status, {
    summary: "语义检索 · Top 10 · 未精排",
    degraded: "关键词召回不可用，本次已降级为语义检索。",
  });
});
