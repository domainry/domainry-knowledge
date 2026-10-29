import assert from "node:assert/strict";
import test from "node:test";
import { canonicalWhiteboardContent, emptyWhiteboardContent, parseWhiteboardContent, whiteboardElementQuote, whiteboardScene } from "../src/editors/whiteboardContent.ts";
import { activateKnowledgeLocale } from "../src/i18n/runtime.ts";

activateKnowledgeLocale("zh-CN");

test("whiteboard canonical content removes Excalidraw transient state", () => {
  const content = canonicalWhiteboardContent([{
    id: "sticky-1", type: "rectangle", x: 10, y: 20, width: 220, height: 130, angle: 0,
    strokeColor: "#5f4b00", backgroundColor: "#fff3bf", fillStyle: "solid", strokeWidth: 2,
    strokeStyle: "solid", roughness: 1, opacity: 100, seed: 123, version: 7, versionNonce: 999,
    updated: 123456, isDeleted: false, customData: { knowledgeKind: "sticky_note", ignored: "private" },
  }], {}, { viewBackgroundColor: "#fefefe", gridSize: 24, gridModeEnabled: true, selectedElementIds: { "sticky-1": true } });
  assert.equal(content.schema_version, 1);
  assert.deepEqual(content.settings, { background_color: "#fefefe", grid_size: 24, grid_enabled: true });
  assert.equal(content.elements[0].custom_kind, "sticky_note");
  assert.equal("seed" in content.elements[0], false);
  assert.equal("version" in content.elements[0], false);
  assert.equal("selectedElementIds" in content.settings, false);
});

test("whiteboard keeps only referenced safe image assets and round-trips deterministically", () => {
  const content = canonicalWhiteboardContent([{
    id: "image-1", type: "image", x: 0, y: 0, width: 120, height: 80, angle: 0,
    strokeColor: "#000000", backgroundColor: "transparent", fillStyle: "solid", strokeWidth: 1,
    strokeStyle: "solid", roughness: 0, opacity: 100, fileId: "asset-1", scale: [1, 1],
  }], {
    "asset-1": { id: "asset-1", mimeType: "image/png", dataURL: "data:image/png;base64,AA==", created: 10 },
    unused: { id: "unused", mimeType: "image/png", dataURL: "data:image/png;base64,AA==", created: 10 },
    unsafe: { id: "unsafe", mimeType: "text/html", dataURL: "data:text/html;base64,AA==", created: 10 },
  }, {});
  assert.deepEqual(Object.keys(content.assets), ["asset-1"]);
  const encoded = JSON.stringify(content);
  assert.deepEqual(parseWhiteboardContent(encoded), content);
  assert.deepEqual(parseWhiteboardContent(JSON.stringify(parseWhiteboardContent(encoded))), content);
  assert.equal(whiteboardScene(content).elements[0].fileId, "asset-1");
});

test("whiteboard malformed roots fall back to the current empty schema", () => {
  assert.deepEqual(parseWhiteboardContent('{"nodes":[]}'), emptyWhiteboardContent);
  assert.deepEqual(parseWhiteboardContent("not-json"), emptyWhiteboardContent);
});

test("whiteboard restores the Excalidraw scale invariant for every element", () => {
  const content = canonicalWhiteboardContent([{
    id: "rectangle-1", type: "rectangle", x: 20, y: 30, width: 160, height: 80,
  }], {}, {});
  assert.deepEqual(whiteboardScene(content).elements[0].scale, [1, 1]);
});

test("whiteboard comments use visible element text or a stable type label", () => {
  const text = { ...emptyWhiteboardContent, elements: [{ id: "text-1", type: "text", x: 0, y: 0, width: 10, height: 10, angle: 0, stroke_color: "#000", background_color: "transparent", fill_style: "solid", stroke_width: 1, stroke_style: "solid", roughness: 0, opacity: 100, text: "  评审结论  " }] } as const;
  assert.equal(whiteboardElementQuote(text.elements[0]), "评审结论");
  const rectangle = canonicalWhiteboardContent([{ id: "r", type: "rectangle", x: 0, y: 0, width: 10, height: 10 }], {}, {}).elements[0];
  assert.equal(whiteboardElementQuote(rectangle), "矩形");
});
