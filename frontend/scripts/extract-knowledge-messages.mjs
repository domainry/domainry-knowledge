import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function readObject(source, name) {
  const declaration = new RegExp(`export const ${name}(?::[^=]+)?\\s*=\\s*`).exec(source);
  if (!declaration) throw new Error(`Cannot find ${name}`);
  const start = declaration.index + declaration[0].length;
  if (source[start] !== "{") throw new Error(`${name} must be emitted as a JSON object`);
  let depth = 0, inString = false, escaped = false;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return JSON.parse(source.slice(start, index + 1));
  }
  throw new Error(`Cannot parse ${name}`);
}

const root = path.resolve("src");
const messagesSource = await readFile(path.join(root, "i18n", "messages.generated.ts"), "utf8");
const catalogsSource = await readFile(path.join(root, "i18n", "catalogs.generated.ts"), "utf8");
const english = readObject(messagesSource, "knowledgeEnglishMessages");
const chinese = readObject(messagesSource, "knowledgeChineseMessages");
const translated = readObject(catalogsSource, "knowledgeTranslatedCatalogs");
const catalogs = { en: english, "zh-CN": chinese, ...translated };

function compileSafeMessage(value) {
  return String(value).replace(/\{([^{}]*)\}/g, (match, inner) => /^value\d+$/.test(inner) ? match : `(${inner})`);
}

for (const [locale, messages] of Object.entries(catalogs)) {
  const directory = path.join(root, "locales", locale);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "messages.json"), `${JSON.stringify(Object.fromEntries(Object.entries(messages).map(([id, value]) => [id, compileSafeMessage(value)])), null, 2)}\n`);
}
console.log(`extracted ${Object.keys(english).length} English-source messages for ${Object.keys(catalogs).length} locales`);
