import assert from "node:assert/strict";
import test from "node:test";
import { importPageTypes, initialPageContent, nativePageTypes, pageTypeCapability, pageTypeDefinitions, pageTypeRegistry, validatePageTypeDefinitions } from "../src/pageTypeRegistry.ts";

test("page type registry is complete and capability-driven", () => {
  assert.deepEqual(pageTypeCapability, { create: 1, edit: 2, read: 4, preview: 8, import: 16, realtime: 32, search: 64, comment: 128, version: 256 });
  assert.equal(pageTypeDefinitions.length, 10);
  assert.equal(Object.keys(pageTypeRegistry).length, pageTypeDefinitions.length);
  assert.deepEqual(nativePageTypes, pageTypeDefinitions.filter(definition => definition.capabilities & pageTypeCapability.create).map(definition => definition.id));
  assert.deepEqual(importPageTypes.map(definition => definition.id), ["file"]);
  assert.ok(pageTypeRegistry.document.capabilities & pageTypeCapability.realtime);
  assert.equal(pageTypeRegistry.file.capabilities & pageTypeCapability.create, 0);
  assert.ok(pageTypeRegistry.file.capabilities & pageTypeCapability.import);
  assert.deepEqual(JSON.parse(initialPageContent("whiteboard")), { schema_version: 1, elements: [], assets: {}, settings: { background_color: "#ffffff", grid_size: 20, grid_enabled: false } });
});

test("page type registry fails fast on duplicate or incomplete definitions", () => {
  assert.throws(() => validatePageTypeDefinitions([...pageTypeDefinitions, pageTypeDefinitions[0]]), /Invalid page type definition/);
  assert.throws(() => validatePageTypeDefinitions([{ ...pageTypeDefinitions[0], id: "document", editor: undefined } as never]), /Invalid page type definition/);
});

