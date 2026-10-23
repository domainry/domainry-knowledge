import assert from "node:assert/strict";
import test from "node:test";
import { createKnowledgeBlockLink, createKnowledgePageLink, parseKnowledgeDeepLink } from "../src/knowledge-links.ts";

const libraryID = `klib_${"a".repeat(32)}`;
const pageID = `kpage_${"b".repeat(32)}`;

test("knowledge block links round-trip stable identifiers", () => {
  const href = createKnowledgeBlockLink("https://knowledge.example.test/workspace?keep=1", {
    libraryID,
    libraryKind: "shared",
    pageID,
    mode: "edit",
  }, "block:release-notes_1");
  assert.deepEqual(parseKnowledgeDeepLink(href), {
    libraryID,
    libraryKind: "shared",
    pageID,
    blockID: "block:release-notes_1",
    mode: "edit",
  });
  assert.equal(new URL(href).searchParams.get("keep"), "1");
});

test("knowledge deep links reject malformed or executable identifiers", () => {
  assert.equal(parseKnowledgeDeepLink("https://knowledge.example.test/?knowledge_library=klib_bad&knowledge_kind=personal&knowledge_page=kpage_bad"), null);
  assert.equal(parseKnowledgeDeepLink(`https://knowledge.example.test/?knowledge_library=${libraryID}&knowledge_kind=personal&knowledge_page=${pageID}&knowledge_block=%3Cscript%3E`), null);
  assert.throws(() => createKnowledgeBlockLink("https://knowledge.example.test/", { libraryID, libraryKind: "personal", pageID, mode: "read" }, "bad block"));
});

test("knowledge page links remove stale block anchors", () => {
  const href = createKnowledgePageLink(`https://knowledge.example.test/?knowledge_block=stale&keep=1`, { libraryID, libraryKind: "personal", pageID, mode: "read" });
  assert.equal(new URL(href).searchParams.has("knowledge_block"), false);
  assert.equal(new URL(href).searchParams.get("keep"), "1");
  assert.deepEqual(parseKnowledgeDeepLink(href), { libraryID, libraryKind: "personal", pageID, mode: "read", blockID: undefined });
});
