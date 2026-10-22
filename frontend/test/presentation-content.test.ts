import assert from "node:assert/strict";
import test from "node:test";
import { applyPresentationTheme, canonicalPresentationContent, emptyPresentationContent, isPresentationContent, parsePresentationContent, presentationLayoutElements, presentationPlainText, presentationShapeTypes, presentationThemes } from "../src/presentationContent.ts";

test("presentation canonical content owns theme, master, layout, notes, elements, and authorized assets", () => {
  const content = structuredClone(emptyPresentationContent);
  content.master.footer = "产品委员会";
  content.slides[0].title = "季度复盘";
  content.slides[0].notes = "强调留存率";
  content.slides[0].elements[0].text = "增长 28%";
  content.slides[0].files["asset-1"] = { id: "asset-1", mime_type: "image/png", document_ref: "knowledge-document:kdoc_0123456789abcdef0123456789abcdef", filename: "增长图.png" };
  content.slides[0].elements.push({ id: "image-1", type: "image", x: 100, y: 100, width: 400, height: 300, rotation: 0, asset_id: "asset-1", fit: "contain" });
  assert.equal(isPresentationContent(content), true);
  assert.deepEqual(parsePresentationContent(canonicalPresentationContent(content)), content);
  const plain = presentationPlainText(content);
  for (const expected of ["季度复盘", "增长 28%", "强调留存率", "产品委员会", "增长图.png"]) assert.match(plain, new RegExp(expected));
});

test("legacy Excalidraw presentation snapshots and unsafe media fail closed", () => {
  const legacy = JSON.stringify({ slides: [{ id: "slide-1", title: "旧画布", elements: [], files: {}, appState: {} }] });
  const parsed = parsePresentationContent(legacy);
  assert.equal(parsed.schema_version, 1);
  assert.notEqual(parsed.slides[0].title, "旧画布");
  const unsafe = structuredClone(emptyPresentationContent) as unknown as Record<string, unknown>;
  const slide = (unsafe.slides as Array<Record<string, unknown>>)[0];
  slide.files = { attack: { id: "attack", mime_type: "text/html", document_ref: "javascript:alert(1)", filename: "攻击.html" } };
  assert.equal(isPresentationContent(unsafe), false);
});

test("theme and layout helpers create bounded Knowledge-owned slide elements", () => {
  const themed = applyPresentationTheme(structuredClone(emptyPresentationContent), "midnight");
  assert.equal(themed.theme, "midnight");
  assert.deepEqual(themed.master, presentationThemes.midnight.master);
  for (const layout of ["title", "section", "agenda", "title_content", "two_column", "quote", "image_focus", "blank"] as const) {
    const elements = presentationLayoutElements("slide-test", layout, themed.master);
    assert.ok(elements.every(item => item.x >= 0 && item.y >= 0 && item.x + item.width <= 1600 && item.y + item.height <= 900));
    assert.ok(elements.every(item => item.id.startsWith("slide-test-")));
  }
});

test("all presentation shapes are canonical persisted elements", () => {
  const content = structuredClone(emptyPresentationContent);
  content.slides[0].elements = presentationShapeTypes.map((shape, index) => ({
    id: `shape-${index}`, type: "shape" as const, x: index * 100, y: 100, width: 90, height: 90, rotation: 0,
    shape, fill_color: "#176B52", stroke_color: "#17221C", stroke_width: 2,
    text: shape === "line" ? "" : shape, font_size: 14, font_weight: "normal" as const, color: "#FFFFFF", align: "center" as const,
  }));
  assert.equal(isPresentationContent(content), true);
  assert.deepEqual(parsePresentationContent(canonicalPresentationContent(content)), content);
});

test("presentation persists editable tables, charts, formulas and code", () => {
  const content = structuredClone(emptyPresentationContent);
  content.slides[0].elements = [
    { id: "table-1", type: "table", x: 40, y: 40, width: 700, height: 320, rotation: 0, table: { rows: [["地区", "销售额"], ["华东", "128"]], header: true } },
    { id: "chart-1", type: "chart", x: 780, y: 40, width: 700, height: 320, rotation: 0, chart: { type: "column", categories: ["一月", "二月"], series: [{ name: "收入", values: [10, 20] }] } },
    { id: "formula-1", type: "formula", x: 40, y: 410, width: 500, height: 120, rotation: 0, formula: "E=mc^2", font_size: 36, color: "#17221C" },
    { id: "code-1", type: "code", x: 580, y: 410, width: 900, height: 320, rotation: 0, language: "typescript", source: "const total = rows.reduce(sum);", font_size: 22, color: "#E8FFF5", fill_color: "#10251D" },
  ];
  assert.equal(isPresentationContent(content), true);
  assert.deepEqual(parsePresentationContent(canonicalPresentationContent(content)), content);
  for (const expected of ["地区", "销售额", "收入", "E=mc^2", "const total"]) assert.match(presentationPlainText(content), new RegExp(expected.replace(/[=^]/g, "\\$&")));
});
