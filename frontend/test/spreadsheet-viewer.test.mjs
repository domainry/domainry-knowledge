import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/viewers/SpreadsheetViewer.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

test("uploaded workbooks use one continuous Excel-like canvas instead of custom pagination", () => {
  assert.doesNotMatch(source, /rowsPerPage|columnsPerPage|rowPage|columnPage|data-static-ui-pagination/);
  assert.doesNotMatch(source, /<Select|<form/);
  assert.match(source, /Array\.from\(\{ length: sheet\.rows \}/);
  assert.match(source, /className="knowledge-sheet-tabs"/);
  assert.match(styles, /\.knowledge-sheet-tabs button\[aria-current="page"\]/);
  assert.doesNotMatch(styles, /\.knowledge-sheet-scroll th, \.knowledge-sheet-scroll td \{[^}]*text-overflow: ellipsis/);
});

test("the workbook owns both scroll axes instead of growing the outer page", () => {
  assert.match(
    styles,
    /\.knowledge-spreadsheet-viewer \.knowledge-sheet-scroll \{[^}]*flex: 1 1 auto;[^}]*min-height: 0;[^}]*overflow: auto;[^}]*overscroll-behavior: contain;/,
  );
  assert.match(
    styles,
    /\.knowledge-file-page > \.knowledge-spreadsheet-viewer \{[^}]*flex: 0 0 clamp\(520px, calc\(100dvh - 250px\), 760px\);[^}]*height: clamp\(520px, calc\(100dvh - 250px\), 760px\);[^}]*max-height: 760px;/,
  );
});
