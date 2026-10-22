import assert from "node:assert/strict";
import test from "node:test";
import { filePageContent, parseFilePageContent } from "../src/file-page.ts";

test("file pages keep only a stable immutable-original reference", () => {
  const documentID = `kdoc_${"a".repeat(32)}`;
  const encoded = filePageContent(documentID, "产品说明.pdf");
  assert.deepEqual(parseFilePageContent(encoded), { document_id: documentID, display_mode: "preview", title: "产品说明.pdf" });
  assert.equal(encoded.includes("http"), false);
});

test("file page references reject missing, malformed, and executable metadata", () => {
  assert.equal(parseFilePageContent(`{"document_id":"kdoc_bad","display_mode":"preview","title":"x"}`), null);
  assert.equal(parseFilePageContent(`{"document_id":"kdoc_${"b".repeat(32)}","display_mode":"iframe","title":"x"}`), null);
  assert.equal(parseFilePageContent(`{"document_id":"kdoc_${"b".repeat(32)}","display_mode":"preview","title":""}`), null);
});
