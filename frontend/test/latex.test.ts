import assert from "node:assert/strict";
import test from "node:test";
import { renderSafeLatex } from "../src/latex.ts";

test("KaTeX renders valid block and inline formulas with MathML", () => {
  const block = renderSafeLatex(String.raw`E = mc^2`, true);
  const inline = renderSafeLatex(String.raw`x_1 + x_2`, false);
  assert.equal(block.error, undefined);
  assert.equal(inline.error, undefined);
  assert.match(block.html || "", /katex-display/);
  assert.match(inline.html || "", /<math/);
});

test("KaTeX rejects invalid input and never trusts executable HTML", () => {
  const invalid = renderSafeLatex(String.raw`\frac{`, true);
  const untrusted = renderSafeLatex(String.raw`\href{javascript:alert(1)}{x}<script>alert(1)</script>`, false);
  assert.ok(invalid.error);
  assert.doesNotMatch(untrusted.html || "", /<script(?:\s|>)|href=["']javascript:/i);
  assert.match(untrusted.html || "", /&lt;script&gt;/i);
});
