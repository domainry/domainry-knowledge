import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { KNOWLEDGE_HOST_LOCALES } from "../src/hostIntegration.ts";
import { knowledgeTranslatedCatalogs } from "../src/i18n/catalogs.generated.ts";
import { knowledgeCompiledCatalogs } from "../src/i18n/compiledCatalogs.ts";
import { knowledgeChineseMessages, knowledgeEnglishMessages } from "../src/i18n/messages.generated.ts";
import {
  activateKnowledgeLocale,
  formatKnowledgeNumber,
  KNOWLEDGE_LOCALES,
  knowledgeDirection,
  knowledgeI18n,
  kt,
  ktf,
  normalizeKnowledgeLocale,
} from "../src/i18n/runtime.ts";
import { agGridLocaleText, blockNoteLocaleKey, mindElixirLocaleKey, multiColumnLocaleKey, univerLocaleKey } from "../src/i18n/thirdParty.ts";

const sourceRoot = path.resolve(new URL("../src", import.meta.url).pathname);
const messageIDs = Object.keys(knowledgeEnglishMessages).sort();
const placeholders = (message: string) => [...message.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map(match => match[1]).sort();

test("Knowledge exposes exactly the same twelve locales as the host contract", () => {
  assert.deepEqual(KNOWLEDGE_LOCALES, KNOWLEDGE_HOST_LOCALES);
  assert.deepEqual(Object.keys(knowledgeTranslatedCatalogs).sort(), ["ar", "de", "es", "fr", "it", "ja", "ko", "pt", "tr", "zh-TW"].sort());
  assert.equal(normalizeKnowledgeLocale("zh-HK"), "zh-TW");
  assert.equal(normalizeKnowledgeLocale("pt-BR"), "pt");
  assert.equal(normalizeKnowledgeLocale("ru"), "en");
  assert.equal(knowledgeDirection("ar"), "rtl");
  assert.equal(knowledgeDirection("en"), "ltr");
});

test("every locale has the complete source ID and placeholder contract", () => {
  const catalogs = {
    "zh-CN": knowledgeChineseMessages,
    ...knowledgeTranslatedCatalogs,
  } as Record<string, Record<string, string>>;
  for (const [locale, catalog] of Object.entries(catalogs)) {
    assert.deepEqual(Object.keys(catalog).sort(), messageIDs, `${locale} message IDs differ from English`);
    for (const id of messageIDs) {
      assert.notEqual(catalog[id], id, `${locale} leaked message ID ${id}`);
      assert.deepEqual(placeholders(catalog[id]), placeholders(knowledgeEnglishMessages[id as keyof typeof knowledgeEnglishMessages]), `${locale} placeholder mismatch for ${id}`);
    }
  }
});

test("every runtime locale uses the compiled Lingui catalog", () => {
  assert.deepEqual(Object.keys(knowledgeCompiledCatalogs).sort(), [...KNOWLEDGE_LOCALES].sort());
  for (const locale of KNOWLEDGE_LOCALES) {
    const catalog = knowledgeCompiledCatalogs[locale] as Record<string, unknown>;
    assert.deepEqual(Object.keys(catalog).sort(), messageIDs, `${locale} compiled message IDs differ from English`);
    for (const id of messageIDs) {
      assert.ok(Array.isArray(catalog[id]), `${locale} left ${id} as an uncompiled ICU string`);
    }
  }
});

test("runtime activation changes messages and known missing translations fall back to English", () => {
  const id = "knowledge.common.published_at";
  activateKnowledgeLocale("zh-CN");
  assert.equal(kt(id), knowledgeChineseMessages[id]);
  activateKnowledgeLocale("de");
  assert.equal(kt(id), knowledgeTranslatedCatalogs.de[id]);

  const fallbackID = "knowledge.common.unavailable_page";
  activateKnowledgeLocale("fr");
  const french = knowledgeI18n.messages as Record<string, unknown>;
  const saved = french[fallbackID];
  delete french[fallbackID];
  assert.equal(kt(fallbackID), knowledgeEnglishMessages[fallbackID]);
  french[fallbackID] = saved;
});

test("runtime formatting preserves every named placeholder", () => {
  const id = "knowledge.auto.e446dac671dfa29a";
  for (const locale of KNOWLEDGE_LOCALES) {
    activateKnowledgeLocale(locale);
    const formatted = ktf(id, { value0: "future_failure" });
    assert.match(formatted, /future_failure/, `${locale} dropped the runtime placeholder`);
    assert.doesNotMatch(formatted, /\{value0\}/, `${locale} leaked an unresolved placeholder`);
  }
});

test("production-sensitive search labels interpolate their page scope", () => {
  activateKnowledgeLocale("zh-CN");
  assert.equal(ktf("knowledge.auto.c35a69c818e8575e", { value0: "全部页面" }), "搜索全部页面");
  assert.equal(ktf("knowledge.auto.c5abb64060320597", { value0: "全部页面" }), "筛选全部页面");
  assert.equal(ktf("knowledge.auto.b9da6aab77e5cdbc", { value0: "快捷入口" }), "刷新快捷入口");
  assert.equal(ktf("knowledge.auto.ff1f95f1d49e6ba9", { value0: "快捷入口" }), "快捷入口中还没有页面。");
});

test("workspace activates its locale before rendering any translated controls", async () => {
  const workspace = await readFile(path.join(sourceRoot, "KnowledgeWorkspace.tsx"), "utf8");
  const wrapperStart = workspace.indexOf("export function KnowledgeWorkspace");
  const contentStart = workspace.indexOf("function KnowledgeWorkspaceContent");
  assert.ok(wrapperStart >= 0 && contentStart > wrapperStart);
  const wrapper = workspace.slice(wrapperStart, contentStart);
  assert.match(wrapper, /<KnowledgeI18nProvider locale=\{resolvedLocale\}>/);
  assert.match(wrapper, /<KnowledgeWorkspaceContent /);
  assert.doesNotMatch(wrapper, /\bktf?\(/, "translated controls rendered before locale activation");
});

test("number formatting follows the active locale", () => {
  activateKnowledgeLocale("en");
  const english = formatKnowledgeNumber(1234.5);
  activateKnowledgeLocale("de");
  const german = formatKnowledgeNumber(1234.5);
  assert.notEqual(english, german);
});

test("third-party locale adapters cover all host locales with explicit fallbacks", () => {
  for (const locale of KNOWLEDGE_LOCALES) {
    assert.ok(blockNoteLocaleKey[locale]);
    assert.ok(multiColumnLocaleKey[locale]);
    assert.ok(mindElixirLocaleKey[locale]);
    assert.ok(univerLocaleKey[locale]);
    assert.ok(Object.keys(agGridLocaleText[locale]).length > 20, `${locale} AG Grid catalog is incomplete`);
  }
  assert.equal(blockNoteLocaleKey.tr, "en");
  assert.equal(mindElixirLocaleKey.ar, "en");
  assert.equal(univerLocaleKey.tr, "en-US");
});

test("authored UI source has no hard-coded Han text outside locale catalogs", async () => {
  const pending = [sourceRoot];
  while (pending.length) {
    const directory = pending.pop()!;
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!target.includes(`${path.sep}i18n`) && !target.includes(`${path.sep}locales`)) pending.push(target);
        continue;
      }
      if (!/\.(?:ts|tsx|css)$/.test(entry.name)) continue;
      const source = await readFile(target, "utf8");
      assert.doesNotMatch(source, /\p{Script=Han}/u, target);
    }
  }
});

test("RTL propagates to portal roots and mirrors the primary overlays", async () => {
  const runtime = await readFile(path.join(sourceRoot, "i18n/runtime.ts"), "utf8");
  const styles = await readFile(path.join(sourceRoot, "styles.css"), "utf8");
  const workspace = await readFile(path.join(sourceRoot, "KnowledgeWorkspace.tsx"), "utf8");
  assert.match(workspace, /dir=\{direction\}/);
  assert.match(runtime, /document\.body\.dir = knowledgeDirection\(current\)/);
  assert.match(styles, /\[dir="rtl"\] \.knowledge-comment-drawer/);
  assert.match(styles, /\[dir="rtl"\] \.bn-container \.bn-editor/);
});
