import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "app-dist");
const html = await readFile(path.join(output, "index.html"), "utf8");
const initialScripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
const initialStyles = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)].map(match => match[1]);

async function totalBytes(references) {
  let total = 0;
  for (const reference of references) total += (await stat(path.join(output, reference.replace(/^\//, "")))).size;
  return total;
}

const initialJavaScriptBytes = await totalBytes(initialScripts);
const initialCSSBytes = await totalBytes(initialStyles);
const maximumInitialJavaScriptBytes = 1024 * 1024;
const maximumInitialCSSBytes = 256 * 1024;
if (initialScripts.length !== 1 || initialJavaScriptBytes > maximumInitialJavaScriptBytes) {
  throw new Error(`Knowledge initial JavaScript budget exceeded: ${initialJavaScriptBytes} bytes (maximum ${maximumInitialJavaScriptBytes})`);
}
if (initialCSSBytes > maximumInitialCSSBytes) {
  throw new Error(`Knowledge initial CSS budget exceeded: ${initialCSSBytes} bytes (maximum ${maximumInitialCSSBytes})`);
}

const assets = await readdir(path.join(output, "assets"));
for (const editor of ["BlockNoteEditor", "GridEditor", "SpreadsheetEditor", "PresentationEditor", "FormEditor", "MindNoteEditor", "MindMapEditor", "FlowchartEditor"]) {
  if (!assets.some(asset => asset.startsWith(`${editor}-`) && asset.endsWith(".js"))) {
    throw new Error(`${editor} is not emitted as a lazy page-type chunk`);
  }
}

console.log(`Knowledge initial bundle: ${initialJavaScriptBytes} B JS, ${initialCSSBytes} B CSS; native editors remain lazy chunks.`);
