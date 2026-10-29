import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesPath = new URL("../src/styles.css", import.meta.url);
const sourcePath = new URL("../src/", import.meta.url);
const rawColorPattern = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/i;

const requiredRoles = [
  "canvas",
  "surface",
  "surface-elevated",
  "surface-subtle",
  "surface-tint",
  "surface-hover",
  "surface-active",
  "input",
  "overlay",
  "text",
  "muted",
  "faint",
  "border",
  "border-strong",
  "primary",
  "primary-hover",
  "primary-active",
  "success",
  "info",
  "warning",
  "danger",
  "focus",
  "selection",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
] as const;

test("application chrome consumes semantic color roles after the theme declarations", async () => {
  const styles = await readFile(stylesPath, "utf8");
  const darkThemeEnd = styles.indexOf("color-scheme: dark;");
  assert.ok(darkThemeEnd > 0, "dark theme declaration is required");
  const componentRules = styles.slice(darkThemeEnd + "color-scheme: dark;".length);
  const invalidLine = componentRules.split("\n").find(line => rawColorPattern.test(line));
  assert.equal(invalidLine, undefined, `component rule bypasses semantic colors: ${invalidLine}`);
  assert.doesNotMatch(componentRules, /color-scheme:\s*light/);
  assert.doesNotMatch(componentRules, /--knowledge-(?:accent|accent-soft|accent-strong|green-50|green-200|hover)\b/);
});

test("light and dark themes both declare the complete semantic role surface", async () => {
  const styles = await readFile(stylesPath, "utf8");
  for (const role of requiredRoles) {
    const occurrences = styles.match(new RegExp(`--knowledge-${role}:`, "g"))?.length ?? 0;
    assert.ok(occurrences >= 2, `--knowledge-${role} must have light and dark values`);
  }
});

test("the product-neutral package does not import Verdent design tokens", async () => {
  const index = await readFile(new URL("index.ts", sourcePath), "utf8");
  const styles = await readFile(stylesPath, "utf8");
  assert.doesNotMatch(index, /@verdent\/design/);
  assert.doesNotMatch(styles, /--verdent-|deck-module-background|deck-background/);
});

test("the workspace resolves system theme once and propagates it to roots and portals", async () => {
  const workspace = await readFile(new URL("KnowledgeWorkspace.tsx", sourcePath), "utf8");
  const theme = await readFile(new URL("theme.tsx", sourcePath), "utf8");
  const styles = await readFile(stylesPath, "utf8");
  assert.match(workspace, /theme = "system"/);
  assert.match(workspace, /data-knowledge-theme=\{resolvedTheme\}/);
  assert.match(theme, /matchMedia\("\(prefers-color-scheme: dark\)"\)/);
  assert.match(theme, /document\.body\.dataset\.knowledgeTheme = current/);
  assert.match(styles, /body\[data-knowledge-theme="dark"\] \.knowledge-pages/);
  assert.doesNotMatch(styles, /^\[data-knowledge-theme="dark"\],/m);
});

test("third-party editors consume the resolved semantic theme without recreating on theme changes", async () => {
  const grid = await readFile(new URL("editors/GridEditor.tsx", sourcePath), "utf8");
  const canvas = await readFile(new URL("editors/CanvasEditor.tsx", sourcePath), "utf8");
  const spreadsheet = await readFile(new URL("editors/SpreadsheetEditor.tsx", sourcePath), "utf8");
  const mindMap = await readFile(new URL("editors/MindMapEditor.tsx", sourcePath), "utf8");
  const form = await readFile(new URL("editors/FormEditor.tsx", sourcePath), "utf8");
  const word = await readFile(new URL("viewers/WordViewer.tsx", sourcePath), "utf8");
  assert.match(grid, /accentColor: "var\(--knowledge-primary\)"/);
  assert.match(canvas, /theme=\{theme\}/);
  assert.match(spreadsheet, /toggleDarkMode\(knowledgeTheme === "dark"\)/);
  assert.doesNotMatch(spreadsheet.match(/useEffect\(\(\) => \{[\s\S]*?createUniver[\s\S]*?\}, \[[^\]]*\]\);/)?.[0] ?? "", /\[.*knowledgeTheme.*\]/);
  assert.match(mindMap, /"--panel-bgcolor": "var\(--knowledge-surface-elevated\)"/);
  assert.match(form, /--bs-body-bg:var\(--knowledge-surface\)/);
  assert.match(word, /root\.style\.colorScheme = theme/);
});
