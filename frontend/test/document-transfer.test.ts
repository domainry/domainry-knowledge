import assert from "node:assert/strict";
import test from "node:test";
import { buildKnowledgePrintDocument, looksLikeOfficeHTML, plainTextLooksLikeMarkdown, safeDocumentFilename } from "../src/editors/documentTransfer.ts";

test("detects Office clipboard markup without classifying ordinary HTML", () => {
  assert.equal(looksLikeOfficeHTML('<p class="MsoNormal" style="mso-margin-top-alt:auto">Word</p>'), true);
  assert.equal(looksLikeOfficeHTML("<p>ordinary rich text</p>"), false);
});

test("distinguishes Markdown from plain text before pasting", () => {
  assert.equal(plainTextLooksLikeMarkdown("# 标题\n\n- 条目"), true);
  assert.equal(plainTextLooksLikeMarkdown("这是普通文本，保留原样。"), false);
});

test("creates safe export filenames and escapes printable titles", () => {
  assert.equal(safeDocumentFilename('  方案:/\\*?"<>|  ', "md"), "方案---------.md");
  const printable = buildKnowledgePrintDocument("<季度 & 总结>", "<p>正文</p>");
  assert.match(printable, /&lt;季度 &amp; 总结&gt;/);
  assert.doesNotMatch(printable, /<title><季度/);
  assert.match(printable, /<p>正文<\/p>/);
});
