import assert from "node:assert/strict";
import test from "node:test";
import type { Block } from "@blocknote/core";
import { documentBlockCommentQuote } from "../src/documentContent.ts";

test("comment anchor quote uses visible block text and ignores resource identifiers", () => {
  const block = {
    id: "block-1",
    type: "knowledgeReference",
    props: { targetPageId: "kpage_secret", title: "发布规范" },
    content: [],
    children: [],
  } as unknown as Block;
  assert.equal(documentBlockCommentQuote(block), "发布规范");
});

test("comment anchor quote falls back to the stable block type for textless blocks", () => {
  const block = { id: "divider-1", type: "divider", props: {}, children: [] } as unknown as Block;
  assert.equal(documentBlockCommentQuote(block), "divider");
});
