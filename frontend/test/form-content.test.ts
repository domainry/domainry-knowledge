import assert from "node:assert/strict";
import test from "node:test";
import { canonicalFormFromBuilder, emptyFormContent, formSubmissionAnswers, formioSchema, normalizeFormContent, parseFormContent } from "../src/formContent.ts";
import { activateKnowledgeLocale } from "../src/i18n/runtime.ts";

activateKnowledgeLocale("zh-CN");

test("form content keeps only the canonical supported component fields", () => {
  const canonical = canonicalFormFromBuilder({ components: [{ type: "textfield", key: "name", label: "姓名", input: true, validate: { required: true }, customClass: "unsafe", calculateValue: "fetch('/')" }] }, emptyFormContent().settings);
  assert.deepEqual(canonical.components, [{ type: "textfield", key: "name", label: "姓名", input: true, validate: { required: true } }]);
  assert.equal("calculateValue" in (formioSchema(canonical).components[0] as object), false);
});

test("form content rejects unsupported widgets and dangling conditions", () => {
  assert.throws(() => normalizeFormContent({ components: [{ type: "html", key: "x", label: "HTML", input: true, validate: {} }] }), /不受支持/);
  assert.throws(() => normalizeFormContent({ components: [{ type: "textfield", key: "x", label: "X", input: true, validate: {}, conditional: { show: true, when: "missing", eq: "yes" } }] }), /无效的条件题/);
});

test("form content canonicalizes URL, phone and currency questions", () => {
  const content = normalizeFormContent({ components: [
    { type: "url", key: "site", label: "网站", input: true, validate: { required: true, maxLength: 200 } },
    { type: "phoneNumber", key: "phone", label: "电话", input: true, validate: { required: false } },
    { type: "currency", key: "budget", label: "预算", input: true, currency: "USD", validate: { required: true, min: 0, max: 1000 } },
  ] });
  assert.equal(content.components[0].type, "url");
  assert.equal(content.components[1].inputMask, "");
  assert.equal(content.components[2].currency, "USD");
  assert.equal(formioSchema(content).components.length, 3);
});

test("invalid persisted form falls back to a usable canonical first question", () => {
  const parsed = parseFormContent("not-json");
  assert.equal(parsed.schema_version, 1);
  assert.equal(parsed.components[0].key, "question1");
});

test("submission answers omit only undefined values", () => {
  assert.deepEqual(formSubmissionAnswers({ text: "", checked: false, missing: undefined }), { text: "", checked: false });
});

test("rating, scale and attachment questions are canonical and submission-safe", () => {
  const content = normalizeFormContent({ components: [
    { type: "rating", key: "quality", label: "质量评分", input: true, validate: { required: true, min: 1, max: 5 } },
    { type: "scale", key: "recommend", label: "推荐意愿", input: true, validate: { required: false, min: 0, max: 10 } },
    { type: "file", key: "evidence", label: "证明材料", input: true, maxFiles: 3, validate: { required: true } },
  ] });
  assert.deepEqual(content.components.map(component => component.type), ["rating", "scale", "file"]);
  const runtime = formioSchema(content).components;
  assert.equal(runtime[0].type, "radio");
  assert.equal(runtime[2].hidden, true);
  assert.deepEqual(formSubmissionAnswers({ quality: "5", recommend: "8", evidence: [{ document_id: "kdoc_0123456789abcdef0123456789abcdef", title: "报告.pdf" }] }, content.components), { quality: 5, recommend: 8, evidence: [{ document_id: "kdoc_0123456789abcdef0123456789abcdef", title: "报告.pdf" }] });
  assert.throws(() => normalizeFormContent({ components: [{ type: "rating", key: "bad", label: "错误", input: true, validate: { min: 1, max: 100 } }] }), /评分和量表/);
});
