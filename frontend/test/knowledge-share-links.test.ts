import assert from "node:assert/strict";
import test from "node:test";
import { createKnowledgePageShareLink, parseKnowledgePageShareLocation } from "../src/knowledge-share-links.ts";

const shareID = `kshare_${"a".repeat(32)}`;
const pageID = `kpage_${"b".repeat(32)}`;

test("controlled share links keep only a non-secret locator and page", () => {
  const href = createKnowledgePageShareLink("https://knowledge.example.test/?keep=1&knowledge_library=lib_old&knowledge_mode=edit", shareID, pageID);
  const url = new URL(href);
  assert.equal(url.searchParams.get("keep"), "1");
  assert.equal(url.searchParams.has("knowledge_library"), false);
  assert.equal(url.searchParams.has("knowledge_mode"), false);
  assert.deepEqual(parseKnowledgePageShareLocation(href), { shareID, pageID });
});

test("controlled share links reject malformed identifiers", () => {
  assert.equal(parseKnowledgePageShareLocation("https://knowledge.example.test/?knowledge_share=kshare_bad&knowledge_page=kpage_bad"), null);
  assert.throws(() => createKnowledgePageShareLink("https://knowledge.example.test/", "kshare_bad", pageID));
});
