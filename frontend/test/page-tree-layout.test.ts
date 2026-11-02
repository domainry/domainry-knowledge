import assert from "node:assert/strict";
import test from "node:test";
import { clampPageTreeWidth, pageTreeDefaultWidth, pageTreeIndent, pageTreeLoadMoreIndent, pageTreeMaximumWidth, pageTreeMinimumWidth } from "../src/pageTreeLayout.ts";

test("page tree preserves the existing indentation for ordinary nesting", () => {
  assert.equal(pageTreeIndent(0), 4);
  assert.equal(pageTreeIndent(3), 52);
  assert.equal(pageTreeIndent(6), 100);
});

test("page tree caps deep indentation so titles retain readable space", () => {
  assert.equal(pageTreeIndent(7), 100);
  assert.equal(pageTreeIndent(32), 100);
  assert.equal(pageTreeLoadMoreIndent(32), 120);
});

test("page tree normalizes invalid depths", () => {
  assert.equal(pageTreeIndent(-1), 4);
  assert.equal(pageTreeIndent(Number.NaN), 4);
});

test("page tree width stays inside the draggable range", () => {
  assert.equal(clampPageTreeWidth(100), pageTreeMinimumWidth);
  assert.equal(clampPageTreeWidth(360.4), 360);
  assert.equal(clampPageTreeWidth(900), pageTreeMaximumWidth);
  assert.equal(clampPageTreeWidth(Number.NaN), pageTreeDefaultWidth);
});
