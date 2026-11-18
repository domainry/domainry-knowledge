import assert from "node:assert/strict";
import test from "node:test";
import { createKnowledgeBlockLink, createKnowledgePageLink, parseKnowledgeDeepLink } from "../src/knowledge-links.ts";

const libraryID = `klib_${"a".repeat(32)}`;
const pageID = `kpage_${"b".repeat(32)}`;

test("knowledge block links round-trip stable identifiers", () => {
  const href = createKnowledgeBlockLink("https://knowledge.example.test/workspace?keep=1", {
    libraryID,
    pageID,
    mode: "edit",
  }, "block:release-notes_1");
  assert.deepEqual(parseKnowledgeDeepLink(href), {
    libraryID,
    pageID,
    blockID: "block:release-notes_1",
    mode: "edit",
  });
  assert.equal(new URL(href).searchParams.get("keep"), "1");
});

test("knowledge deep links reject malformed or executable identifiers", () => {
  assert.equal(parseKnowledgeDeepLink("https://knowledge.example.test/?knowledge_library=klib_bad&knowledge_page=kpage_bad"), null);
  assert.equal(parseKnowledgeDeepLink(`https://knowledge.example.test/?knowledge_library=${libraryID}&knowledge_page=${pageID}&knowledge_block=%3Cscript%3E`), null);
  assert.throws(() => createKnowledgeBlockLink("https://knowledge.example.test/", { libraryID, pageID, mode: "read" }, "bad block"));
});

test("knowledge page links remove stale block anchors", () => {
  const href = createKnowledgePageLink(`https://knowledge.example.test/?knowledge_block=stale&knowledge_kind=personal&keep=1`, { libraryID, pageID, mode: "read" });
  assert.equal(new URL(href).searchParams.has("knowledge_block"), false);
  assert.equal(new URL(href).searchParams.has("knowledge_kind"), false);
  assert.equal(new URL(href).searchParams.get("keep"), "1");
  assert.deepEqual(parseKnowledgeDeepLink(href), { libraryID, pageID, mode: "read", blockID: undefined });
});
