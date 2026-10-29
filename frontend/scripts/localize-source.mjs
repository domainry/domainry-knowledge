import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { execFileSync } from "node:child_process";

const sourceRoot = path.resolve("src");
const generatedMessagesPath = path.join(sourceRoot, "i18n", "messages.generated.ts");
const han = /\p{Script=Han}/u;
const separator = "\n⟦KMSG-6F48D9⟧\n";

async function sourceFiles(directory) {
  const result = [];
  for (const name of await readdir(directory)) {
    const filename = path.join(directory, name);
    const item = await stat(filename);
    if (item.isDirectory()) result.push(...await sourceFiles(filename));
    else if (/\.tsx?$/.test(name) && filename !== generatedMessagesPath && !filename.includes(`${path.sep}i18n${path.sep}`)) result.push(filename);
  }
  return result;
}

function idFor(source) {
  return `knowledge.auto.${createHash("sha256").update(source).digest("hex").slice(0, 16)}`;
}

function isFunctionScope(node) {
  for (let current = node.parent; current && !ts.isSourceFile(current); current = current.parent) {
    if (ts.isFunctionLike(current) || ts.isJsxElement(current) || ts.isJsxFragment(current) || ts.isJsxSelfClosingElement(current)) return true;
  }
  return false;
}

function isNonValueLiteral(node) {
  const parent = node.parent;
  return ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)
    || ts.isPropertyAssignment(parent) && parent.name === node
    || ts.isPropertySignature(parent) && parent.name === node
    || ts.isMethodSignature(parent) && parent.name === node
    || ts.isElementAccessExpression(parent) && parent.argumentExpression === node;
}

function templateSource(node, file) {
  const values = [];
  let source = node.head.text;
  node.templateSpans.forEach((span, index) => {
    const name = `value${index}`;
    values.push(`${name}: ${span.expression.getText(file)}`);
    source += `{${name}}${span.literal.text}`;
  });
  return { source, values };
}

async function collect() {
  const files = [];
  const sources = new Set();
  for (const filename of await sourceFiles(sourceRoot)) {
    let text;
    if (process.env.I18N_FROM_GIT_HEAD === "1") {
      const gitRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
      const gitPath = path.relative(gitRoot, filename).replaceAll(path.sep, "/");
      try { text = execFileSync("git", ["show", `HEAD:${gitPath}`], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }); }
      catch { continue; }
    } else text = await readFile(filename, "utf8");
    const file = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, filename.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const candidates = [];
    function visit(node) {
      if (ts.isTemplateExpression(node)) {
        const item = templateSource(node, file);
        if (han.test(item.source)) { candidates.push({ kind: "template", node, ...item }); sources.add(item.source); return; }
      }
      if (ts.isJsxText(node)) {
        const source = node.getText(file).trim();
        if (source && han.test(source)) { candidates.push({ kind: "jsx", node, source }); sources.add(source); }
        return;
      }
      if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && han.test(node.text) && !isNonValueLiteral(node)) {
        candidates.push({ kind: isFunctionScope(node) ? "runtime" : "static", node, source: node.text });
        sources.add(node.text);
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
    if (candidates.length) files.push({ filename, text, file, candidates });
  }
  return { files, sources: [...sources] };
}

async function translateBatch(items) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "zh-CN");
  url.searchParams.set("tl", "en");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", items.join(separator));
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url);
    if (response.ok) {
      const payload = await response.json();
      const translated = payload[0].map(part => part[0]).join("");
      const values = translated.split(/\s*⟦KMSG-6F48D9⟧\s*/);
      if (values.length === items.length) return values.map(value => value.trim());
    }
    await new Promise(resolve => setTimeout(resolve, 400 * 2 ** attempt));
  }
  throw new Error(`Translation batch failed for ${items.length} messages`);
}

function batches(items) {
  const result = [];
  let current = [], length = 0;
  for (const item of items) {
    if (current.length >= 12 || length + item.length > 1400) { result.push(current); current = []; length = 0; }
    current.push(item); length += item.length;
  }
  if (current.length) result.push(current);
  return result;
}

async function translateAll(sources) {
  const result = new Map();
  const work = batches(sources);
  let cursor = 0;
  async function worker() {
    while (cursor < work.length) {
      const index = cursor++;
      const translated = await translateBatch(work[index]);
      work[index].forEach((source, item) => result.set(source, translated[item] || source));
      process.stdout.write(`\rtranslated ${Math.min(cursor, work.length)}/${work.length} batches`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, work.length) }, worker));
  process.stdout.write("\n");
  return result;
}

function relativeRuntimeImport(filename) {
  let target = path.relative(path.dirname(filename), path.join(sourceRoot, "i18n", "runtime.tsx")).replaceAll(path.sep, "/");
  if (!target.startsWith(".")) target = `./${target}`;
  return target;
}

function rewriteFile(entry, translations) {
  const edits = [];
  let needsRuntime = false, needsFormat = false;
  for (const candidate of entry.candidates) {
    const english = translations.get(candidate.source) || candidate.source;
    const id = idFor(candidate.source);
    let replacement;
    if (candidate.kind === "jsx") { replacement = `{kt(${JSON.stringify(id)})}`; needsRuntime = true; }
    else if (candidate.kind === "template") { replacement = `ktf(${JSON.stringify(id)}, { ${candidate.values.join(", ")} })`; needsRuntime = true; needsFormat = true; }
    else if (candidate.kind === "runtime") { replacement = `kt(${JSON.stringify(id)})`; needsRuntime = true; }
    else replacement = JSON.stringify(english);
    edits.push({ start: candidate.node.getStart(entry.file), end: candidate.node.getEnd(), replacement });
  }
  let text = entry.text;
  for (const edit of edits.sort((left, right) => right.start - left.start)) text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
  if (needsRuntime) {
    const names = needsFormat ? "kt, ktf" : "kt";
    text = `import { ${names} } from ${JSON.stringify(relativeRuntimeImport(entry.filename))};\n${text}`;
  }
  return text;
}

function generatedMessages(sources, translations) {
  const ordered = [...sources].sort((left, right) => idFor(left).localeCompare(idFor(right)));
  const english = Object.fromEntries(ordered.map(source => [idFor(source), translations.get(source) || source]));
  const chinese = Object.fromEntries(ordered.map(source => [idFor(source), source]));
  return `// Generated by scripts/localize-source.mjs. Source messages are English; zh-CN preserves the previous UI copy.\nexport const knowledgeEnglishMessages = ${JSON.stringify(english, null, 2)} as const;\n\nexport const knowledgeChineseMessages = ${JSON.stringify(chinese, null, 2)} as const;\n\nexport type KnowledgeMessageID = keyof typeof knowledgeEnglishMessages;\n`;
}

const collected = await collect();
console.log(`found ${collected.sources.length} unique messages in ${collected.files.length} files`);
const translations = await translateAll(collected.sources);
if (process.env.I18N_CATALOG_ONLY !== "1") for (const entry of collected.files) await writeFile(entry.filename, rewriteFile(entry, translations));
await writeFile(generatedMessagesPath, generatedMessages(collected.sources, translations));
console.log(`localized ${collected.files.length} files and wrote ${generatedMessagesPath}`);
