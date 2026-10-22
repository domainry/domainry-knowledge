import assert from "node:assert/strict";
import test from "node:test";
import { arrangeKnowledgeSlashMenuItems, normalizeKnowledgeSlashRecentIDs } from "../src/editors/slashMenu.ts";
import type { KnowledgeSlashMenuItem } from "../src/editors/slashMenu.ts";

function item(id: string, title: string, group: string, submenu?: string, disabledReason?: string): KnowledgeSlashMenuItem {
  return { id, title, group, submenu, disabledReason, aliases: [title.toLowerCase()], onItemClick() {} };
}

test("slash menu normalizes bounded unique recent IDs", () => {
  assert.deepEqual(normalizeKnowledgeSlashRecentIDs(["block:table", "bad id", "block:table", 7, "default:paragraph", "page:form"]), ["block:table", "default:paragraph", "page:form"]);
  assert.equal(normalizeKnowledgeSlashRecentIDs(["a:1", "b:2", "c:3", "d:4", "e:5", "f:6", "g:7"]).length, 6);
});

test("slash menu prepends recent choices without losing grouped source items", () => {
  const source = [item("default:paragraph", "正文", "基础"), item("default:image", "图片", "媒体", "媒体与文件", "没有文件权限")];
  const arranged = arrangeKnowledgeSlashMenuItems(source, "", ["default:image"]);
  assert.equal(arranged[0].id, "default:image");
  assert.equal(arranged[0].group, "最近使用");
  assert.equal(arranged[0].submenu, undefined);
  assert.equal(arranged[0].disabledReason, "没有文件权限");
  assert.deepEqual(arranged.slice(1).map(value => value.id), ["default:paragraph", "default:image"]);
});

test("slash menu search flattens second-level groups and preserves disabled explanations", () => {
  const source = [item("default:paragraph", "正文", "基础"), item("default:image", "图片", "媒体", "媒体与文件", "没有文件权限")];
  const result = arrangeKnowledgeSlashMenuItems(source, "图片", ["default:paragraph"]);
  assert.deepEqual(result.map(value => value.id), ["default:image"]);
  assert.equal(result[0].group, "搜索结果");
  assert.equal(result[0].submenu, undefined);
  assert.equal(result[0].disabledReason, "没有文件权限");
});

