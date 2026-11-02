import assert from "node:assert/strict";
import test from "node:test";
import { importPageTypes, initialPageContent, nativePageTypes, pageTypeCapability, pageTypeDefinitions, pageTypeMeta, pageTypeRegistry, validatePageTypeDefinitions } from "../src/pageTypeRegistry.ts";
import { activateKnowledgeLocale, kt } from "../src/i18n/runtime.ts";

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

test("all registered type metadata follows locale changes after module loading", () => {
  const original = pageTypeDefinitions.map(item => ({ id: item.id, label: item.label, description: item.description, title: item.defaultTitle }));
  activateKnowledgeLocale("zh-CN");
  assert.equal(pageTypeRegistry.document.label, kt("knowledge.auto.2687ccdbb1d2288a"));
  assert.equal(pageTypeRegistry.document.description, kt("knowledge.auto.c03fb2ca1157a643"));
  for (const item of pageTypeDefinitions) {
    const english = original.find(value => value.id === item.id)!;
    assert.notEqual(item.label, english.label, item.id);
    assert.notEqual(item.description, english.description, item.id);
    assert.notEqual(item.defaultTitle, english.title, item.id);
    assert.deepEqual(pageTypeMeta[item.id], { label: item.label, description: item.description, title: item.defaultTitle });
  }
  activateKnowledgeLocale("en");
  for (const item of original) assert.deepEqual(pageTypeMeta[item.id], { label: item.label, description: item.description, title: item.title });
});

