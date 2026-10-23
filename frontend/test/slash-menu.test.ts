import assert from "node:assert/strict";
import test from "node:test";
import { arrangeKnowledgeSlashMenuItems, groupKnowledgeSlashMenuItems, normalizeKnowledgeSlashRecentIDs } from "../src/editors/slashMenu.ts";
import type { KnowledgeSlashMenuItem } from "../src/editors/slashMenu.ts";

function item(id: string, title: string, group: string, submenu?: string, disabledReason?: string): KnowledgeSlashMenuItem {
  return { id, title, group, submenu, disabledReason, aliases: [title.toLowerCase()], onItemClick() {} };
}

test("slash menu normalizes bounded unique recent IDs", () => {
  assert.deepEqual(normalizeKnowledgeSlashRecentIDs(["block:table", "bad id", "block:table", 7, "default:paragraph", "page:form"]), ["block:table", "default:paragraph", "page:form"]);
  assert.equal(normalizeKnowledgeSlashRecentIDs(["a:1", "b:2", "c:3", "d:4", "e:5", "f:6", "g:7"]).length, 6);
});

test("slash menu moves recent choices out of their source groups to avoid duplicate entries", () => {
  const source = [item("default:paragraph", "正文", "基础"), item("default:image", "图片", "媒体", "媒体与文件", "没有文件权限")];
  const arranged = arrangeKnowledgeSlashMenuItems(source, "", ["default:image"]);
  assert.equal(arranged[0].id, "default:image");
  assert.equal(arranged[0].group, "最近使用");
  assert.equal(arranged[0].submenu, undefined);
  assert.equal(arranged[0].disabledReason, "没有文件权限");
  assert.deepEqual(arranged.slice(1).map(value => value.id), ["default:paragraph"]);
  assert.equal(arranged.filter(value => value.id === "default:image").length, 1);
});

test("slash menu search flattens second-level groups and preserves disabled explanations", () => {
  const source = [item("default:paragraph", "正文", "基础"), item("default:image", "图片", "媒体", "媒体与文件", "没有文件权限")];
  const result = arrangeKnowledgeSlashMenuItems(source, "图片", ["default:paragraph"]);
  assert.deepEqual(result.map(value => value.id), ["default:image"]);
  assert.equal(result[0].group, "搜索结果");
  assert.equal(result[0].submenu, undefined);
  assert.equal(result[0].disabledReason, "没有文件权限");
});

test("slash menu exposes one root entry for a submenu shared by different source groups", () => {
  const source = [
    item("block:button", "按钮", "交互", "交互与卡片"),
    item("default:paragraph", "正文", "基础"),
    item("block:bookmark", "网页书签", "嵌入", "交互与卡片"),
    item("block:poll", "投票", "交互"),
  ];
  const groups = groupKnowledgeSlashMenuItems(source);
  const interaction = groups.find(group => group.label === "交互");
  const submenuEntries = groups.flatMap(group => group.entries).filter(entry => entry.kind === "submenu");

  assert.deepEqual(groups.map(group => group.label), ["交互", "基础"]);
  assert.equal(submenuEntries.length, 1);
  assert.equal(submenuEntries[0]?.label, "交互与卡片");
  assert.deepEqual(submenuEntries[0]?.items.map(({ item: value }) => value.id), ["block:button", "block:bookmark"]);
  assert.deepEqual(interaction?.entries.map(entry => entry.kind === "item" ? entry.item.id : entry.label), ["交互与卡片", "block:poll"]);
});

