import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(target) : /\.(ts|tsx|css)$/.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

test("public knowledge UI has no Agent-owned route or session dependency", async () => {
  const files = await sourceFiles(path.join(root, "src"));
  const source = (await Promise.all(files.map(file => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /\/agent\//);
  assert.doesNotMatch(source, /X-Agent-/);
  assert.doesNotMatch(source, /domainry-agent/);
  assert.doesNotMatch(source, /from\s+["']\.\.\/\.\./);
});

test("package publishes compiled JavaScript, declarations and semantic styles", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  assert.equal(manifest.main, "./dist/knowledge-ui.js");
  assert.equal(manifest.types, "./dist/index.d.ts");
  assert.equal(manifest.exports["./styles.css"], "./dist/knowledge-ui.css");
});

test("page collaboration and ACL UI expose bounded responsive states without browser-owned authority", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  assert.match(panel, /正在冻结协作快照/);
  assert.match(panel, /useKnowledgeCollaboration/);
  assert.match(panel, /内容冲突自动收敛/);
  assert.match(panel, /编辑块/);
  assert.match(panel, /Yjs/);
  assert.match(panel, /has-side-panel/);
  assert.match(panel, /beforeunload/);
  assert.match(panel, /role="tree"/);
  assert.match(panel, /getPageAccess/);
  assert.match(panel, /setPageAccess/);
  assert.match(panel, /previewPageMove/);
  assert.match(panel, /确认页面权限影响/);
  assert.match(panel, /远端权限投影确认前，本页不会进入搜索结果/);
  assert.match(styles, /\.knowledge-page-main\.has-side-panel/);
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage|AccessBundle|provider[_ ]credential/i);
});

test("collaboration uses authenticated SSE downlink without retaining the two-second poller", async () => {
  const collaboration = await readFile(path.join(root, "src", "useKnowledgeCollaboration.ts"), "utf8");
  const client = await readFile(path.join(root, "app", "client.ts"), "utf8");
  const blockEditor = await readFile(path.join(root, "src", "editors", "BlockNoteEditor.tsx"), "utf8");
  assert.match(collaboration, /streamKnowledgeCollaborationEvents/);
  assert.match(collaboration, /reconnecting/);
  assert.match(collaboration, /2 \*\* \(failures - 1\)/);
  assert.match(collaboration, /transient SSE reconnect must not drop/);
  assert.match(collaboration, /function edit[\s\S]*if \(!confirmed \|\| !ready\) return;/);
  assert.doesNotMatch(collaboration, /setInterval/);
  assert.doesNotMatch(collaboration, /2_000/);
  assert.match(client, /Accept: "text\/event-stream"/);
  assert.match(client, /"Last-Event-ID": String\(afterClock\)/);
  assert.match(client, /sessionFetch/);
  assert.doesNotMatch(client, /access_token=.*collaboration/);
  assert.match(blockEditor, /withCollaboration/);
  assert.match(blockEditor, /editor\.onChange\([\s\S]*false\)/);
});

test("library workspace keeps backend resource types out of primary navigation", async () => {
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const pages = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const registry = await readFile(path.join(root, "src", "editors", "KnowledgeEditor.tsx"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  assert.doesNotMatch(workspace, /aria-label="知识库工作区"/);
  assert.doesNotMatch(workspace, /knowledge-library-tabs/);
  assert.doesNotMatch(workspace, /setLibraryDialog\("documents"\)/);
  assert.match(pages, /新建知识条目/);
  assert.match(pages, /上传及导入/);
  assert.match(pages, /parent_page_id: parentPageID/);
  assert.match(pages, /content_type: contentType/);
  for (const type of ["multidimensional_table", "spreadsheet", "presentation", "form", "mind_note", "whiteboard", "mind_map", "flowchart"]) assert.match(registry, new RegExp(type));
  for (const editor of ["GridEditor", "SpreadsheetEditor", "PresentationEditor", "FormEditor", "MindNoteEditor", "WhiteboardEditor", "MindMapEditor", "FlowchartEditor"]) assert.match(registry, new RegExp(editor));
  await assert.rejects(readFile(path.join(root, "src", "TypedPageContent.tsx"), "utf8"));
  assert.doesNotMatch(pages, /knowledge-page-create/);
  assert.match(pages, /onDoubleClick/);
  assert.match(pages, /createPortal/);
  assert.match(styles, /\.knowledge-create-menu \{[^}]*position: fixed/);
  assert.match(workspace, /知识库管理/);
});

test("every native page type is backed by a real lazy-loaded editor engine", async () => {
  const editorDirectory = path.join(root, "src", "editors");
  const registry = await readFile(path.join(editorDirectory, "KnowledgeEditor.tsx"), "utf8");
  const engines = new Map([
    ["BlockNoteEditor.tsx", /@blocknote\//],
    ["GridEditor.tsx", /ag-grid-react/],
    ["SpreadsheetEditor.tsx", /@univerjs\//],
    ["CanvasEditor.tsx", /@excalidraw\//],
    ["FormEditor.tsx", /@formio\/js/],
    ["MindMapEditor.tsx", /mind-elixir/],
    ["FlowchartEditor.tsx", /@logicflow\/core/],
  ]);
  for (const [filename, dependency] of engines) {
    const source = await readFile(path.join(editorDirectory, filename), "utf8");
    assert.match(source, dependency, `${filename} must use its native editor engine`);
  }
  assert.match(registry, /lazy\(\(\) => import\(/);
  assert.doesNotMatch(registry, /textarea|contentEditable/);

  const pageTypes = await readFile(path.join(root, "src", "pageTypeRegistry.ts"), "utf8");
  assert.doesNotMatch(pageTypes, /@univerjs\//, "type metadata must not eagerly import a heavyweight editor runtime");
});
