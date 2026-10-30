import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { knowledgeChineseMessages } from "../src/i18n/messages.generated.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function assertLocalized(source, chineseFragment, message) {
  const messageIDs = Object.entries(knowledgeChineseMessages)
    .filter(([, value]) => value.includes(chineseFragment))
    .map(([id]) => id);
  assert.ok(messageIDs.length > 0, `missing Chinese catalog message containing: ${chineseFragment}`);
  assert.ok(
    messageIDs.some(id => source.includes(`"${id}"`)),
    message ?? `source must reference a localized message containing: ${chineseFragment}`,
  );
}

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

test("product build enforces initial bundle budgets while native editors stay lazy", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const budget = await readFile(path.join(root, "scripts", "check-app-bundle-budget.mjs"), "utf8");
  assert.match(manifest.scripts["build:app"], /check-app-bundle-budget\.mjs/);
  assert.match(budget, /maximumInitialJavaScriptBytes/);
  assert.match(budget, /maximumInitialCSSBytes/);
  for (const editor of ["BlockNoteEditor", "GridEditor", "SpreadsheetEditor", "PresentationEditor", "FormEditor", "MindNoteEditor", "MindMapEditor", "FlowchartEditor"]) assert.match(budget, new RegExp(editor));
});

test("product authentication uses the shared editorial design contract", async () => {
  const app = await readFile(path.join(root, "app", "main.tsx"), "utf8");
  const styles = await readFile(path.join(root, "app", "product.css"), "utf8");
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const workspaceStyles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  const pagesPanel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const design = await readFile(path.join(root, "DESIGN.md"), "utf8");
  assert.match(app, /product-auth-shell/);
  assert.match(app, /product-auth-story/);
  assert.match(app, /product-password-toggle/);
  assert.match(app, /className="product-logout" aria-label="退出登录" title="退出登录"/);
  assert.match(app, /className="product-avatar"/);
  assert.doesNotMatch(app, /<LogOut[^>]*\/>退出/);
  assert.match(styles, /\.product-auth-shell \{[^}]*grid-template-columns/);
  assert.match(styles, /\.product-input-shell:focus-within/);
  assert.match(styles, /@media \(max-width: 900px\)/);
  assert.match(app, /className="product-header-search"/);
  assert.match(app, /headerSearchHost=\{headerSearchHost\}/);
  assert.match(workspace, /createPortal\(searchControl, headerSearchHost\)/);
  assert.match(workspace, /knowledge-primary-scope-tabs/);
  assert.match(workspace, /knowledge-header-search-toggle/);
  assert.match(workspace, /setSearchExpanded\(true\)/);
  assert.match(workspace, /scopeTabs=\{scopeNavigation\}/);
  assert.match(workspace, /scopeTabsInLibraryRail/);
  assert.match(workspace, /teamLibraries=\{libraryKind === "shared"/);
  assert.match(pagesPanel, /\{scopeTabs\}/);
  assert.match(pagesPanel, /knowledge-team-library-picker/);
  assert.doesNotMatch(workspace, /headerSearch=|navigationHeader=/);
  assert.match(styles, /\.product-header-search \.knowledge-global-search/);
  assert.match(styles, /\.product-header-search:has\(\.knowledge-header-search\.is-expanded\)/);
  assert.match(workspaceStyles, /\.knowledge-page-heading-actions \.knowledge-page-header-action \{[^}]*display: flex;[^}]*flex: 0 0 76px;[^}]*justify-content: center;[^}]*width: 76px;[^}]*height: 36px;[^}]*font-size: 13px;[^}]*font-weight: 650;[^}]*line-height: 1;/);
  assert.doesNotMatch(styles, /radial-gradient/);
  assert.doesNotMatch(app, /product-auth-card/);
  assert.match(design, /Authentication uses a two-region editorial entry shell/);
});

test("page collaboration and ACL UI expose bounded responsive states without browser-owned authority", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const commentDrawer = await readFile(path.join(root, "src", "page-workspace", "CommentDrawer.tsx"), "utf8");
  const suggestionDrawer = await readFile(path.join(root, "src", "page-workspace", "SuggestionDrawer.tsx"), "utf8");
  const pageHeader = await readFile(path.join(root, "src", "page-workspace", "PageHeader.tsx"), "utf8");
  const pageToolbar = await readFile(path.join(root, "src", "page-workspace", "PageToolbar.tsx"), "utf8");
  const workspaceUI = `${panel}\n${commentDrawer}\n${suggestionDrawer}`;
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  const editorBlocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const blockNoteEditor = await readFile(path.join(root, "src", "editors", "BlockNoteEditor.tsx"), "utf8");
  assertLocalized(panel, "正在冻结协作快照");
  assert.match(panel, /useKnowledgeCollaboration/);
  assertLocalized(panel, "内容冲突自动收敛");
  assertLocalized(panel, "光标在内容块");
  assertLocalized(panel, "选区");
  assert.match(panel, /recentActivityLabel/);
  assert.doesNotMatch(panel, /person\.editedBlocks/);
  assertLocalized(panel, "Yjs");
  assert.match(panel, /has-side-panel/);
  assert.match(panel, /beforeunload/);
  assert.match(panel, /content_type !== "presentation"/, "presentation saves must not remount the editor and reset the active slide");
  assert.match(panel, /role="tree"/);
  assert.match(styles, /\.knowledge-tree-row\.is-drop-before/);
  assert.match(styles, /\.knowledge-tree-row\.is-drop-inside/);
  assert.match(panel, /onDragStart/);
  assert.doesNotMatch(panel, /<ArrowUp|<ArrowDown/);
  assert.match(panel, /hasExpandableChildren/);
  assert.match(editorBlocks, /const calloutToneOptions = \[/);
  assertLocalized(editorBlocks, "提示类型：");
  assert.doesNotMatch(editorBlocks, /aria-label="提示块图标"|aria-label="提示块类型"/);
  assert.match(pageHeader, /primary knowledge-page-header-action/);
  assert.match(blockNoteEditor, /summary className="knowledge-page-header-action" aria-label=\{kt\(/);
  assertLocalized(blockNoteEditor, "导出文档");
  assert.match(panel, /if \(loadedChildren\) return loadedChildren\.length > 0 \|\| childrenComplete\[page\.id\] === false/);
  assert.match(panel, /return page\.has_children/);
  assert.doesNotMatch(panel, /probeChildPresence/);
  assert.match(panel, /if \(!hasChildren\) setExpanded/);
  assert.match(panel, /knowledge-tree-toggle-spacer/);
  assert.match(styles, /\.knowledge-tree-toggle-spacer/);
  assert.match(pageHeader, /actionHostRef/);
  assert.match(pageHeader, /knowledge-page-header-actions-slot/);
  assert.doesNotMatch(panel, /knowledge-page-body-actions/);
  assert.match(panel, /pageActionHost=\{pageActionHost\}/);
  assert.match(blockNoteEditor, /createPortal\(documentTransfer, pageActionHost\)/);
  assert.match(styles, /\.knowledge-page-header-actions-slot \.knowledge-document-transfer/);
  assert.doesNotMatch(panel, /mode === "outline" \|\| mode === "activity"/);
  assert.match(panel, /has-inline-outline/);
  assert.match(styles, /\.knowledge-page-readable\.has-inline-outline > \.knowledge-page-outline/);
  for (const tooltip of ["页内查找", "收藏页面", "订阅页面", "添加到快捷入口", "页面大纲", "AI 写作助手", "页面属性", "引用与反向链接", "知识关系图", "权限分析", "页面权限", "受控分享", "页面治理", "复制页面", "归档页面"]) {
    assertLocalized(pageToolbar, tooltip, `pure icon tool must expose a localized hover label: ${tooltip}`);
  }
  assert.match(pageToolbar, /<Network size=\{15\}/);
  assert.match(pageToolbar, /<ScanSearch size=\{15\}/);
  assert.match(pageToolbar, /<UserRoundCog size=\{15\}/);
  assert.match(pageToolbar, /props\.archived \? <ArchiveRestore size=\{15\} \/> : <Archive size=\{15\} \/>/);
  assert.doesNotMatch(pageToolbar, /MoreHorizontal/);
  assert.match(panel, /mode === "shares"/);
  assertLocalized(panel, "只读解释指定用户为什么能或不能执行某个动作");
  assert.match(panel, /knowledge-page-management-panel/);
  assert.match(panel, /knowledge-principal-picker/);
  assert.match(styles, /\.knowledge-page-main\.has-side-panel > \.knowledge-page-management-panel/);
  assert.match(styles, /--knowledge-page-side-panel-width: clamp\(340px, 29vw, 440px\)/);
  assert.match(styles, /\.knowledge-page-main\.has-side-panel > \.knowledge-page-readable \{[^}]*justify-self: stretch;[^}]*max-width: none;[^}]*margin: 0;/);
  assert.match(styles, /\.knowledge-page-readable\.is-document \{ max-width: none/);
  assert.match(styles, /\.knowledge-page-title \{[^}]*width: 100%;[^}]*max-width: none;[^}]*margin: 0;/);
  assert.match(styles, /\.knowledge-page-history \{ width: 100%; margin: 0;/);
  assert.match(panel, /className="knowledge-page-feedback"/);
  assert.match(panel, /<PageToolbar[\s\S]*?<div className="knowledge-page-feedback">/, "page feedback must render below the fixed title and toolbar");
  assert.match(styles, /\.knowledge-page-main\.has-side-panel > \.knowledge-page-feedback/);
  assert.match(styles, /\.knowledge-page-main\.is-scroll-frame > \.knowledge-page-feedback/);
  assert.match(styles, /\.knowledge-page-tools \.knowledge-toolbar-icon:hover::after/);
  assert.match(styles, /\.knowledge-page-tools \.knowledge-toolbar-icon:focus-visible::after/);
  assert.match(panel, /getPageAccess/);
  assert.match(panel, /setPageAccess/);
  assert.match(panel, /previewPageMove/);
  assertLocalized(panel, "确认页面权限影响");
  assertLocalized(panel, "远端权限投影确认前，本页不会进入搜索结果");
  assert.match(editorBlocks, /personMention/);
  assert.match(editorBlocks, /dateMention/);
  assert.match(editorBlocks, /pageMention/);
  assert.match(editorBlocks, /blockMention/);
  assert.match(blockNoteEditor, /triggerCharacter="@"/);
  assert.match(panel, /searchLibraryMembers/);
  assert.match(panel, /resolvePrincipals/);
  assert.match(panel, /anchor: \{ node_id: anchor\.nodeID, quote: anchor\.quote \}/);
  assertLocalized(workspaceUI, "修改建议");
  assert.match(panel, /client\.createPageSuggestion/);
  assert.match(panel, /client\.decidePageSuggestion/);
  assert.match(panel, /expected_draft_revision: current\.draft\.draft_revision/);
  assertLocalized(workspaceUI, "接受前不会改动草稿");
  assertLocalized(workspaceUI, "原内容块已改变，不能接受这条建议");
  assert.match(styles, /\.knowledge-page-suggestions/);
  assertLocalized(workspaceUI, "原内容块已删除或内容已经变化，锚点失效");
  assert.match(commentDrawer, /onFocusComment\(comment\)/);
  assert.match(blockNoteEditor, /getSelectedText\(\)/);
  assert.match(blockNoteEditor, /onCommentAnchor/);
  assert.match(panel, /mode !== "read" && mode !== "outline" && mode !== "comments" && mode !== "activity"/);
  assert.match(panel, /const showCommentMarkers = view\?\.page\.content_type === "document"/);
  assert.match(panel, /commentMarkers=\{showCommentMarkers \? commentMarkers : undefined\}/);
  assert.match(panel, /function openCommentThread[\s\S]*?setMode\("comments"\)/);
  assert.doesNotMatch(panel, /commentMarkers=\{mode === "comments"/);
  assert.match(commentDrawer, /knowledge-comment-drawer/);
  assert.match(panel, /openCommentThread/);
  assert.match(blockNoteEditor, /knowledge-block-comment-anchor/);
  assert.match(blockNoteEditor, /knowledge-block-comment-marker/);
  assert.match(styles, /\.knowledge-comment-drawer/);
  assert.match(styles, /\.knowledge-block-comment-anchor/);
  assert.match(panel, /resolvePage\(pageID, signal\)/);
  assert.match(styles, /\.knowledge-inline-mention\.is-unavailable/);
  assert.match(styles, /\.knowledge-page-main\.has-side-panel/);
  assert.match(styles, /@media \(max-width: 700px\)/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage|AccessBundle|provider[_ ]credential/i);
});

test("collaboration uses authenticated SSE downlink without retaining the two-second poller", async () => {
  const collaboration = await readFile(path.join(root, "src", "useKnowledgeCollaboration.ts"), "utf8");
  const transport = await readFile(path.join(root, "src", "collaborationTransport.ts"), "utf8");
  const offline = await readFile(path.join(root, "src", "collaborationOffline.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const blockEditor = await readFile(path.join(root, "src", "editors", "BlockNoteEditor.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  assert.match(collaboration, /createKnowledgeCollaborationTransport/);
  assert.match(transport, /readonly kind: "post-sse"/);
  assert.match(transport, /streamKnowledgeCollaborationEvents/);
  assert.match(collaboration, /localUpdatesRef/);
  assert.match(collaboration, /mergeKnowledgeYjsUpdates/);
  assert.match(collaboration, /checkpointInterval/);
  assert.match(collaboration, /Awareness/);
  assert.match(collaboration, /provider: \{ awareness \}/);
  assert.match(collaboration, /loadKnowledgeOfflineChange/);
  assert.match(offline, /indexedDB\.open/);
  assert.match(offline, /createdAt: number/);
  assert.match(collaboration, /client_created_at: new Date\(sent\.createdAt\)\.toISOString\(\)/);
  assert.match(collaboration, /reconnecting/);
  assert.match(collaboration, /collaborationConnectTimeout = 30_000/);
  assert.match(collaboration, /AbortSignal\.any\(\[abort\.signal, AbortSignal\.timeout\(collaborationConnectTimeout\)\]\)/);
  assert.match(collaboration, /temporary network or development-server outage must never turn/);
  assert.match(collaboration, /syncFailuresRef\.current === 5/);
  assert.match(collaboration, /setRetryNonce\(value => value \+ 1\)/);
  assert.match(collaboration, /2 \*\* \(failures - 1\)/);
  assert.match(collaboration, /transient SSE reconnect must not drop/);
  assert.match(collaboration, /function edit[\s\S]*if \(!confirmed \|\| !ready\) return;/);
  assert.doesNotMatch(collaboration, /setInterval/);
  assert.doesNotMatch(collaboration, /2_000/);
  assert.doesNotMatch(blockEditor, /yjsUpdate: state|yjsState: state/);
  assert.match(client, /Accept: "text\/event-stream"/);
  assert.match(client, /"Last-Event-ID": String\(afterClock\)/);
  assert.match(client, /"X-Knowledge-Collaboration-Attempt": String\(connectionAttempt\)/);
  assert.match(client, /sessionFetch/);
  assert.doesNotMatch(client, /access_token=.*collaboration/);
  assert.match(panel, /client\.streamKnowledgePageLiveEvents/);
  assert.match(panel, /resolveKnowledgePageLiveRefresh/);
  assert.match(panel, /event\.type === "changed"/);
  assert.match(panel, /document\.addEventListener\("visibilitychange", recover\)/);
  assert.match(blockEditor, /withCollaboration/);
  assert.match(blockEditor, /editor\.onChange\([\s\S]*false\)/);
  assert.match(collaboration, /collaborationRevocationCodes/);
  assert.match(collaboration, /clearRevokedState/);
  assert.match(collaboration, /setReady\(false\)/);
  assert.match(panel, /\[collaborationFailure, setCollaborationFailure\] = useState\(""\)/);
  assert.match(panel, /onError\(failure\) \{ setCollaborationFailure\(formatError\(failure\)\); \}/);
  assert.match(panel, /collaboration\.state === "connected"\) setCollaborationFailure\(""\)/);
});

test("application cards keep only stable references and resolve through the authorized host boundary", async () => {
  const blocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  for (const kind of ["calendar_event", "meeting", "group", "task", "jira", "web"]) assert.match(blocks, new RegExp(kind));
  assert.match(blocks, /propSchema: \{[\s\S]*provider:[\s\S]*kind:[\s\S]*resourceId:/);
  assert.doesNotMatch(blocks, /applicationCardConfig[\s\S]{0,600}(accessToken|credential|secret)/i);
  assert.match(panel, /client\.resolveApplicationCard/);
  assert.match(client, /application-cards\/resolve/);
});

test("library workspace keeps backend resource types out of primary navigation", async () => {
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const pages = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const createMenu = await readFile(path.join(root, "src", "KnowledgeCreateMenu.tsx"), "utf8");
  const createDialog = await readFile(path.join(root, "src", "KnowledgeLibraryCreateDialog.tsx"), "utf8");
  const registry = await readFile(path.join(root, "src", "pageTypeRegistry.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  assert.doesNotMatch(workspace, /aria-label="知识库工作区"/);
  assert.doesNotMatch(workspace, /knowledge-library-tabs/);
  assert.doesNotMatch(workspace, /setLibraryDialog\("documents"\)/);
  assertLocalized(createMenu, "新增");
  assertLocalized(createMenu, "新增知识库");
  assertLocalized(createMenu, "填写信息并创建团队知识库");
  assertLocalized(createDialog, "新建团队知识库");
  assertLocalized(createDialog, "知识库名称");
  assertLocalized(createDialog, "用途说明");
  assert.match(createDialog, /getPrincipalDirectory/);
  assertLocalized(createDialog, "企业组织与成员");
  assert.match(createDialog, /toggleOrganization/);
  assert.match(createDialog, /normalizeSelection/);
  assert.match(createDialog, /hasSelectableDescendants/);
  assert.match(createDialog, /compressedSelection/);
  assert.match(createDialog, /snapshot\?\.current_user_id/);
  assert.match(createDialog, /isCreator \|\| selectedMembers\.has/);
  assert.match(createDialog, /disabled=\{busy \|\| isCreator\}/);
  assertLocalized(createDialog, "创建者");
  assertLocalized(createDialog, "管理员");
  assert.match(createDialog, /role: "editor"/);
  assertLocalized(createDialog, "新成员统一以编辑者加入");
  assert.doesNotMatch(createDialog, /统一初始角色/);
  assertLocalized(createDialog, "创建并授权成员");
  assertLocalized(createDialog, "创建团队知识库");
  assert.match(createMenu, /pageTypeDefinitions\.filter/);
  assert.match(createMenu, /importPageTypes/);
  assertLocalized(createMenu, "上传文件");
  assert.match(createMenu, /importInput\.current\?\.click\(\)/);
  assert.match(createMenu, /\{definition\.label\}/);
  assert.doesNotMatch(pages, /createPage\("document"\)/);
  assert.match(workspace, /createSharedLibrary/);
  assert.match(workspace, /KnowledgeLibraryCreateDialog/);
  assert.doesNotMatch(workspace, /name: "未命名知识库"/);
  assert.match(workspace, /emptySharedLibraryPicker/);
  assert.match(workspace, /client\.setMember\(value\.id, member\.principal\.user_id, member\.role, value\.revision/);
  assert.match(workspace, /client\.setOrganizationMember\(value\.id, organization\.organization\.organization_id, organization\.role, value\.revision/);
  assert.match(workspace, /libraryKind === "personal" && value\.complete && value\.items\.length === 0/);
  assert.match(workspace, /personalBootstrapClientID/);
  assert.doesNotMatch(workspace, /创建个人知识库/);
  assertLocalized(workspace, "创建团队知识库并邀请相关成员");
  assertLocalized(createMenu, "请先创建团队知识库");
  assert.match(pages, /parent_page_id: parentPageID/);
  assert.match(pages, /content_type: contentType/);
  assert.match(pages, /content_type: "file"/);
  assert.match(pages, /setPageAttachment/);
  assert.match(pages, /filePageContent/);
  assert.match(pages, /await client\.uploadDocument/);
  assert.match(pages, /await client\.savePageDraft/);
  assert.match(pages, /uploadFile=\{library\.documents_configured && \(view\.page\.content_type === "document" \|\| view\.page\.content_type === "multidimensional_table" \|\| view\.page\.content_type === "presentation" \|\| view\.page\.content_type === "form"\) \? uploadEditorFile : undefined\}/);
  assert.match(pages, /readDocumentContent\(library\.id, match\[1\]/);
  assert.match(pages, /knowledge-document:\$\{document\.id\}/);
  assert.doesNotMatch(pages, /documentEntries|entryKind|listDocuments/);
  assert.doesNotMatch(workspace, /KnowledgeDocumentsPanel|documents=\{/);
  for (const type of ["multidimensional_table", "spreadsheet", "presentation", "form", "mind_note", "whiteboard", "mind_map", "flowchart"]) assert.match(registry, new RegExp(type));
  for (const editor of ["GridEditor", "SpreadsheetEditor", "PresentationEditor", "FormEditor", "MindNoteEditor", "WhiteboardEditor", "MindMapEditor", "FlowchartEditor"]) assert.match(registry, new RegExp(editor));
  await assert.rejects(readFile(path.join(root, "src", "TypedPageContent.tsx"), "utf8"));
  assert.doesNotMatch(pages, /knowledge-page-create/);
  assert.match(pages, /onDoubleClick/);
  assert.match(pages, /createPortal/);
  assert.doesNotMatch(pages, /knowledge-create-page-dialog/);
  assert.doesNotMatch(styles, /\.knowledge-create-page-dialog/);
  assert.match(styles, /\.knowledge-create-menu > div \{[^}]*position: absolute/);
  assert.match(styles, /\.managed-library-browser > \.managed-library-list \{ display: none; \}/);
  assertLocalized(workspace, "知识库管理");
});

test("file-page export is a one-click browser download without a second save-picker workflow", async () => {
  const preview = await readFile(path.join(root, "src", "file-preview.ts"), "utf8");
  const filePage = await readFile(path.join(root, "src", "KnowledgeFilePage.tsx"), "utf8");
  assert.doesNotMatch(preview, /showSaveFilePicker|createWritable/);
  assert.match(preview, /URL\.createObjectURL\(current\.blob\)/);
  assert.match(preview, /link\.download = current\.filename/);
  assert.match(preview, /link\.click\(\)/);
  assertLocalized(filePage, "正在下载…");
  assertLocalized(filePage, "导出");
});

test("page search uses the authorized structured endpoint and opens canonical hit locations", async () => {
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const grid = await readFile(path.join(root, "src", "editors", "GridEditor.tsx"), "utf8");
  const spreadsheet = await readFile(path.join(root, "src", "editors", "SpreadsheetEditor.tsx"), "utf8");
  const mindMap = await readFile(path.join(root, "src", "editors", "MindMapEditor.tsx"), "utf8");
  const flowchart = await readFile(path.join(root, "src", "editors", "FlowchartEditor.tsx"), "utf8");
  assert.match(workspace, /client\.searchPages\(library\.id/);
  assert.match(client, /\$\{librariesPath\}\/\$\{encodeURIComponent\(libraryID\)\}\/page-search/);
  assert.match(client, /page-search\/events/);
  assert.match(client, /Accept: "text\/event-stream"/);
  assert.match(client, /"Last-Event-ID": String\(afterRevision\)/);
  for (const field of ["content_types", "author_user_ids", "updated_after", "updated_before", "tags", "path_query", "publication_statuses"]) assert.match(workspace, new RegExp(field));
  assert.match(workspace, /hit\.kind === "file"/);
  assert.match(workspace, /hit\.kind === "page"/);
  assert.match(workspace, /pageSearchLocationLabel\(hit\)/);
  assert.match(workspace, /hit\.author_user_id/);
  assert.match(workspace, /hit\.published_version/);
  assert.match(workspace, /pageSearchIndexLabel\(hit\.index_status\)/);
  assert.match(workspace, /initialSearchLocation=\{searchTarget\?\.location\}/);
  assert.match(workspace, /event\.type === "changed"/);
  assert.match(workspace, /event\.type === "revoked"/);
  assert.match(workspace, /setResult\(null\)/);
  assert.match(workspace, /aclReady/);
	assert.match(workspace, /ancestor_page_id: filters\.scope === "subtree"/);
	assert.match(workspace, /knowledge\.page-search\.recent\.v1/);
	assert.match(workspace, /event\.key\.toLocaleLowerCase\(\) !== "k"/);
	assert.match(workspace, /searchInputRef\.current\?\.focus\(\)/);
	assert.match(workspace, /aria-keyshortcuts="Meta\+K Control\+K"/);
	assert.doesNotMatch(workspace, /PageQuickOpen|knowledge-quick-open|searchPageIdentities/);
	assert.match(panel, /currentPageTextRanges/);
	assert.match(panel, /event\.key\.toLocaleLowerCase\(\) !== "f"/);
	assert.match(panel, /knowledge-page-find-active/);
  assert.match(panel, /linkedSearchLocation\?\.block_id/);
  assert.match(panel, /linkedSearchLocation\?\.node_id/);
  assert.match(grid, /initialSearchLocation\.record_id/);
  assert.match(grid, /initialSearchLocation\.field_id/);
  assert.match(spreadsheet, /getSheetBySheetId\(initialSearchLocation\.sheet_id\)/);
  assert.match(spreadsheet, /getRange\(initialSearchLocation\.cell\)\.activate\(\)/);
  assert.match(spreadsheet, /sameSpreadsheetContent\(value, contentRef\.current\)/);
  assert.match(spreadsheet, /if \(sameSpreadsheetContent\(value, contentRef\.current\)\) \{\s*bodyRef\.current = body;\s*return;/);
  assert.match(spreadsheet, /createWorkbook\(structuredClone\(contentRef\.current\.workbook\)\)/);
  assert.match(spreadsheet, /onMutationExecutedForCollab\(scheduleCommit\)/);
  assert.doesNotMatch(spreadsheet, /workbook\.onCommandExecuted\(scheduleCommit\)/);
  assert.match(spreadsheet, /\["input", "change", "keyup", "paste", "cut", "pointerup"\]/);
  assert.match(spreadsheet, /const eventTarget = hostElement;/);
  assert.doesNotMatch(spreadsheet, /const eventTarget = hostElement\.ownerDocument/);
  assert.match(spreadsheet, /eventTarget\.addEventListener\(eventName, scheduleCommitFromUI, true\)/);
  assert.match(spreadsheet, /eventTarget\.removeEventListener\(eventName, scheduleCommitFromUI, true\)/);
  assert.match(spreadsheet, /window\.setTimeout\(\(\) => \{\s*commitTimer = undefined;\s*commit\(contentRef\.current, workbook\.save\(\)\);/);
  assert.match(panel, /view\?\.page\.content_type !== "spreadsheet"/);
  assert.match(mindMap, /restoreMindMapSelection\(mind, initialBlockID\)/);
  assert.match(flowchart, /lf\.focusOn\(initialBlockID\)/);
});

test("page selection keeps the browser deep link synchronized with the active page and mode", async () => {
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  assert.match(panel, /onSelectionChange\?\.\(view \? \{ id: view\.page\.id, title: view\.page\.title, mode: mode === "edit" \? "edit" : "read" \} : null\)/);
  assert.match(workspace, /createKnowledgePageLink\(window\.location\.href/);
  assert.match(workspace, /window\.history\.replaceState\(window\.history\.state, "", href\)/);
});

test("every native page type is backed by a real lazy-loaded editor engine", async () => {
  const editorDirectory = path.join(root, "src", "editors");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const registry = await readFile(path.join(root, "src", "pageTypeRegistry.ts"), "utf8");
  const dispatcher = await readFile(path.join(editorDirectory, "KnowledgeEditor.tsx"), "utf8");
  const blocks = await readFile(path.join(editorDirectory, "documentBlocks.tsx"), "utf8");
  const formEditor = await readFile(path.join(editorDirectory, "FormEditor.tsx"), "utf8");
  const presentationEditor = await readFile(path.join(editorDirectory, "PresentationEditor.tsx"), "utf8");
  const mindNoteEditor = await readFile(path.join(editorDirectory, "MindNoteEditor.tsx"), "utf8");
  const mindNoteContent = await readFile(path.join(root, "src", "mindNoteContent.ts"), "utf8");
  const mindMapEditor = await readFile(path.join(editorDirectory, "MindMapEditor.tsx"), "utf8");
  const flowchartEditor = await readFile(path.join(editorDirectory, "FlowchartEditor.tsx"), "utf8");
  const diagramContent = await readFile(path.join(root, "src", "diagramContent.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  const engines = new Map([
    ["BlockNoteEditor.tsx", /@blocknote\//],
    ["GridEditor.tsx", /ag-grid-react/],
    ["SpreadsheetEditor.tsx", /@univerjs\//],
    ["PresentationEditor.tsx", /pptxgenjs/],
    ["CanvasEditor.tsx", /@excalidraw\//],
    ["FormEditor.tsx", /@formio\/js/],
    ["MindMapEditor.tsx", /mind-elixir/],
    ["FlowchartEditor.tsx", /@logicflow\/core/],
  ]);
  for (const [filename, dependency] of engines) {
    const source = await readFile(path.join(editorDirectory, filename), "utf8");
    assert.match(source, dependency, `${filename} must use its native editor engine`);
  }
  assert.match(formEditor, /new DefaultEvaluator\(\{ noeval: true \}\)/, "questionnaires must remain compatible with the strict no-eval CSP");
  assert.doesNotMatch(formEditor, /Formio\.builder/, "the strict canonical questionnaire designer must not depend on Form.io's eval-based builder dialogs");
  assert.match(formEditor, /normalizeFormContent/, "questionnaire design changes must pass through the Knowledge-owned canonical schema");
  assert.match(formEditor, /form\?\.formatError/, "questionnaire API failures must use the host's localized domain error formatter");
  assert.doesNotMatch(presentationEditor, /excalidraw/i, "presentations must not persist an Excalidraw scene as their product model");
  for (const capability of ["presentationThemes", "presentationLayouts", "MasterInspector", "PresentationSlideshow", "exportPresentationPDF", "exportPresentationPPTX", "addMedia"]) assert.match(presentationEditor, new RegExp(capability));
  assertLocalized(presentationEditor, "演讲者备注");
  assert.match(presentationEditor, /knowledge-document:kdoc_/);
  assert.match(panel, /content_type !== "form"/, "draft acknowledgements must not remount the form designer and discard its active tab");
  assert.match(panel, /content_type !== "mind_note"/, "draft acknowledgements must not remount the outline and discard its focus state");
  for (const behavior of ["collapsed", "completed", "indentNode", "outdentNode", "focusedID", "convertPage"]) assert.match(mindNoteEditor, new RegExp(behavior));
  assert.match(mindNoteContent, /schema_version: 1/);
  assert.match(mindNoteContent, /mindNoteToDocumentContent/);
  assert.match(mindNoteContent, /documentBlocksToMindNote/);
  assert.doesNotMatch(mindNoteContent, /BlockNoteEditor|@blocknote\/core/);
  assert.match(panel, /async function convertCurrentPage/);
  assert.match(panel, /savePageDraft/);
  assert.match(diagramContent, /schema_version: 1/);
  assert.match(diagramContent, /decodeMindMapContent/);
  assert.match(diagramContent, /decodeFlowchartContent/);
  assert.doesNotMatch(diagramContent, /nodeData|sourceNodeId|targetNodeId/, "third-party diagram snapshots must not become the public canonical schema");
  for (const capability of ["applyTheme", "applyLayout", "applyTemplate", "importJSON", "exportJSON", "exportPNG", "onCommentAnchor", "onPresence"]) {
    assert.match(mindMapEditor, new RegExp(capability), `mind map must expose ${capability}`);
    assert.match(flowchartEditor, new RegExp(capability), `flowchart must expose ${capability}`);
  }
  for (const type of ["textfield", "textarea", "number", "email", "radio", "select", "selectboxes", "checkbox", "datetime"]) assert.match(formEditor, new RegExp(`type: "${type}"`));
  assert.match(registry, /lazy\(\(\) => import\(/);
  assert.match(dispatcher, /getPageTypeDefinition/);
  assert.doesNotMatch(dispatcher, /Record<KnowledgePageContentType|switch\s*\(/);
  assert.match(blocks, /blockDefinitions/);
  assert.match(blocks, /getMultiColumnSlashMenuItems/);
  assert.match(blocks, /id: "columnList"/);
  assert.match(blocks, /id: "tableOfContents"/);
  assert.match(blocks, /knowledgeCodeLanguages/);
  assertLocalized(blocks, "代码语言");
  assertLocalized(blocks, "复制代码");
  assertLocalized(blocks, "切换代码自动换行");
  assert.match(blocks, /knowledgeImageCropAspects/);
  assert.match(blocks, /cropAspect/);
  assert.match(blocks, /knowledge-image-preview-dialog/);
  assert.match(blocks, /\{ id: "image", blockNoteSpec: knowledgeImageBlock,/, "the image factory must be invoked exactly once when the BlockNote schema is built");
  assert.doesNotMatch(blocks, /blockNoteSpec: \(\) => knowledgeImageBlock/, "a wrapped image factory leaves BlockNote without a block config at runtime");
  assert.match(blocks, /Invalid BlockNote spec for block definition/, "custom block registration must fail fast before BlockNote receives an invalid spec");
  for (const card of ["bookmark", "knowledgeReference", "personCard", "externalEmbed"]) assert.match(blocks, new RegExp(`id: "${card}"`));
  assert.match(blocks, /safeBookmarkURL/);
  assert.match(blocks, /canonicalExternalEmbedURL/);
  assert.match(blocks, /www\.youtube\.com\/embed/);
  assert.match(blocks, /player\.bilibili\.com\/player\.html/);
  assert.doesNotMatch(blocks, /sandbox=/);
  assert.match(blocks, /referrerPolicy="strict-origin-when-cross-origin"/);
  assert.match(blocks, /searchParams\.set\("enablejsapi", "1"\)/);
  assert.match(blocks, /searchParams\.set\("origin", window\.location\.origin\)/);
  assert.match(blocks, /externalEmbedLocalFallback/);
  assertLocalized(blocks, "YouTube 不允许 localhost 作为嵌入来源");
  assert.match(blocks, /externalEmbedPlatformURL/);
  assertLocalized(blocks, "平台播放");
  assert.match(styles, /\.knowledge-block-card-fields input\[aria-invalid="true"\]/);
  assert.match(styles, /\.knowledge-block-embed iframe/);
  const blockNoteEditor = await readFile(path.join(editorDirectory, "BlockNoteEditor.tsx"), "utf8");
  const documentTransfer = await readFile(path.join(editorDirectory, "documentTransfer.ts"), "utf8");
  const slashMenu = await readFile(path.join(editorDirectory, "slashMenu.ts"), "utf8");
  const slashMenuView = await readFile(path.join(editorDirectory, "KnowledgeSlashMenu.tsx"), "utf8");
  assert.match(blockNoteEditor, /multi_column: multiColumnLocales\[multiColumnLocaleKey\[locale\]\]/);
  assert.match(blockNoteEditor, /SyntaxHighlightingExtension/);
  assert.match(blockNoteEditor, /uploadFile: !readOnly && fileUploadsEnabled && uploadFile/);
  assert.match(blockNoteEditor, /\^knowledge-document:kdoc_\[a-f0-9\]\{32\}\$/);
  assert.match(blockNoteEditor, /URL\.revokeObjectURL/);
  assert.match(blockNoteEditor, /insertOrUpdateBlockForSlashMenu/);
  assert.match(blockNoteEditor, /ref=\{filePickerInputRef\}/);
  assert.match(blockNoteEditor, /input\.click\(\)/);
  assert.match(blockNoteEditor, /request\.action === "replace"/);
  assert.doesNotMatch(blockNoteEditor, /FilePanelController|KnowledgeUploadFilePanel|KnowledgeUploadTab/);
  assert.match(blocks, /filePicker: media/);
  assert.match(slashMenu, /filePicker\?:/);
  assert.match(slashMenu, /formulaInput\?:/);
  assert.match(blocks, /formulaInput: definition\.id === "formula"/);
  assert.match(blocks, /formulaInput: \{ displayMode: "inline" \}/);
  assert.doesNotMatch(blocks, /onItemClick: \(\) => editor\.insertInlineContent\(\[\{ type: "inlineFormula", content: "" \}\]/);
  assert.match(blockNoteEditor, /if \(item\.formulaInput\)/);
  assert.match(blockNoteEditor, /renderSafeLatex\(formulaSource/);
  assertLocalized(blockNoteEditor, "输入 LaTeX，确认后才会写入正文");
  assert.doesNotMatch(styles, /\.knowledge-upload-file-trigger/);
  assert.doesNotMatch(blockNoteEditor, /EmbedTab/);
  assert.match(blockNoteEditor, /KnowledgeImagePropertiesButton/);
  assert.match(blockNoteEditor, /KnowledgeAuthorizedFileReplaceButton/);
  assert.match(blockNoteEditor, /item\.key !== "replaceFileButton"/);
  assertLocalized(blockNoteEditor, "替代文本");
  assertLocalized(blockNoteEditor, "裁剪比例");
  assert.match(blockNoteEditor, /FormattingToolbarController formattingToolbar=\{formattingToolbar\}/);
  assert.match(blockNoteEditor, /SideMenuController sideMenu=\{sideMenu\}/);
  assert.match(blockNoteEditor, /selected\?\.some\(block => block\.id === hovered\.id\)/, "drag-handle actions must preserve a multi-block selection");
  for (const action of ["复制 Block 链接", "转换类型", "折叠子块", "删除所选 Block"]) assertLocalized(blockNoteEditor, action);
  assert.match(blockNoteEditor, /blocksToFullHTML/);
  assert.match(blockNoteEditor, /defaultToggledState\.set/);
  assert.match(blockNoteEditor, /knowledge-block-deep-link-target/);
  assert.match(blockNoteEditor, /pasteHandler:/);
  assert.match(blockNoteEditor, /KnowledgeDocumentTransfer/);
  assert.match(documentTransfer, /DOMPurify\.sanitize/);
  assert.match(documentTransfer, /ALLOWED_TAGS/);
  assert.match(documentTransfer, /ALLOW_DATA_ATTR: false/);
  assert.match(documentTransfer, /editor\.pasteMarkdown\(plain\)/);
  assert.match(documentTransfer, /editor\.pasteText\(plain\)/);
  assert.match(documentTransfer, /blocksToMarkdownLossy/);
  assert.match(documentTransfer, /JSON\.stringify\(\{ blocks: editor\.document \}/);
  assert.match(documentTransfer, /blocksToHTMLLossy/);
  assert.match(documentTransfer, /popup\.print\(\)/);
  assert.match(blockNoteEditor, /suggestionMenuComponent=\{KnowledgeSlashMenu\}/);
  assert.match(blockNoteEditor, /recordKnowledgeSlashRecentID/);
  assert.match(blocks, /const mediaPickers = \{/);
  assert.match(blocks, /submenu: media \? kt\(/);
  assertLocalized(blocks, "媒体与文件");
  assertLocalized(blocks, "当前知识库未配置受权文件存储");
  assert.match(slashMenu, /recentStorageKey/);
  assertLocalized(slashMenu, "最近使用");
  assertLocalized(slashMenu, "搜索结果");
  assert.match(slashMenuView, /is-submenu/);
  assert.match(slashMenuView, /aria-disabled/);
  assert.match(styles, /\.knowledge-slash-item:hover/);
  for (const tableCapability of ["splitCells", "cellBackgroundColor", "cellTextColor", "headers"]) {
    assert.match(blockNoteEditor, new RegExp(`${tableCapability}: true`));
  }
  assert.match(blockNoteEditor, /import\("shiki\/core"\)/);
  assert.match(blockNoteEditor, /import\("@shikijs\/langs\/typescript"\)/);
  assert.doesNotMatch(blockNoteEditor, /import\("shiki"\)/);
  assert.match(blocks, /validateBlockDefinitions/);
  assert.match(blocks, /pageTypeDefinitions\.filter/);
  assert.doesNotMatch(blocks, /const referenceKinds/);

  assert.match(blocks, /id: "knowledgeTask"/);
  assert.match(blocks, /serverValidator: "knowledgeTask"/);
  assert.match(blocks, /runtime\.ensureTask\(block\.id/);
  assert.match(blocks, /runtime\.updateTask\(task, patch\)/);
  assert.match(blocks, /runtime\.searchMembers/);
  assert.match(blocks, /id: "dateReminder"/);
  assert.match(blocks, /id: "knowledgePoll"/);
  assert.match(blocks, /runtime\.ensurePoll\(block\.id/);
  assert.match(blocks, /runtime\.votePoll\(poll/);
  assert.match(blocks, /id: "subpageList"/);
  assert.match(blocks, /runtime\.listChildPages/);
  assert.match(blocks, /id: "informationCollection"/);
  assert.match(blocks, /runtime\.resolvePage/);
  assert.match(blocks, /value\?\.contentType === "form"/);
  assert.match(blocks, /id: "knowledgeActivity"/);
  assert.match(blocks, /runtime\.listPageActivity/);
  assert.match(panel, /client\.listPageVersions/);
  assert.match(panel, /client\.listPageComments/);
  assert.match(styles, /\.knowledge-task-block/);
  assert.match(styles, /\.knowledge-block-subpages/);
  assert.match(styles, /\.knowledge-block-collection/);
  assert.match(styles, /\.knowledge-block-activity/);

  assert.doesNotMatch(registry, /@univerjs\//, "type metadata must not eagerly import a heavyweight editor runtime");
});

test("whiteboard persists a Knowledge-owned schema and exposes complete board controls", async () => {
  const editor = await readFile(path.join(root, "src", "editors", "CanvasEditor.tsx"), "utf8");
  const content = await readFile(path.join(root, "src", "editors", "whiteboardContent.ts"), "utf8");
  const registry = await readFile(path.join(root, "src", "pageTypeRegistry.ts"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  const app = await readFile(path.join(root, "app", "main.tsx"), "utf8");
  const appBuild = await readFile(path.join(root, "app", "vite.config.ts"), "utf8");
  assert.match(content, /schema_version: 1/);
  assert.match(content, /elements: KnowledgeWhiteboardElement\[\]/);
  assert.match(content, /assets: Record<string, KnowledgeWhiteboardAsset>/);
  assert.match(editor, /canonicalWhiteboardContent/);
  assert.match(editor, /nextBody !== canonicalBody/, "mount-time Excalidraw normalization must not dirty an unchanged board");
  assertLocalized(editor, "添加便签");
  assertLocalized(editor, "插入画板模板");
  assertLocalized(editor, "置于顶层");
  assert.match(editor, /exportToBlob/);
  assert.match(editor, /exportToCanvas/);
  assert.match(editor, /onCommentAnchor/);
  assert.match(panel, /\["document", "whiteboard", "mind_map", "flowchart"\]\.includes\(view\.page\.content_type\)/, "comment anchors must be wired for every selectable canvas type");
  assert.match(registry, /emptyWhiteboardContent/);
  assert.match(styles, /has-side-panel > \.knowledge-page-readable \{[^}]*width: 100%;[^}]*max-width: none;/, "management mode must let native canvases fill the flexible grid column");
  assert.match(app, /EXCALIDRAW_ASSET_PATH[^\n]*= "\/"/);
  assert.match(appBuild, /name: "excalidraw-font-assets"/);
  assert.match(appBuild, /fileName: `fonts\/\$\{relativePath\}`/);
  assert.doesNotMatch(registry, /whiteboard[\s\S]{0,220}nodes: \[\], files/);
});

test("task blocks use backend-owned state instead of versioned block props", async () => {
  const blocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  assert.match(blocks, /propSchema: \{ title: \{ get default\(\) \{ return kt\(/);
  assertLocalized(blocks, "待办任务");
  assert.doesNotMatch(blocks, /propSchema: \{[^}]*status:/);
  assert.match(panel, /listPageTasks/);
  assert.match(panel, /createPageTask/);
  assert.match(panel, /updatePageTask/);
  assert.match(panel, /source_block_id: blockID/);
  assert.match(client, /\/tasks\/\$\{encodeURIComponent\(taskID\)\}/);
});

test("poll blocks keep configuration and per-user ballots in backend-owned state", async () => {
  const blocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  assert.match(blocks, /type: "knowledgePoll"/);
  assert.match(blocks, /propSchema: \{ question: \{ get default\(\) \{ return kt\(/);
  assertLocalized(blocks, "请选择一个选项");
  assert.doesNotMatch(blocks, /propSchema: \{[^}]*votes:/);
  assert.match(panel, /listPagePolls/);
  assert.match(panel, /createPagePoll/);
  assert.match(panel, /updatePagePoll/);
  assert.match(panel, /votePagePoll/);
  assert.match(panel, /expected_ballot_revision: poll\.ballot_revision/);
  assert.match(client, /\/polls\/\$\{encodeURIComponent\(pollID\)\}\/ballot/);
  assert.match(blocks, /const value = event\.currentTarget\.value; setOptionDrafts\(/, "poll option input must snapshot the DOM value before the React state updater runs");
  assert.doesNotMatch(blocks, /setOptionDrafts\([^\n]*event\.currentTarget\.value/, "React clears currentTarget before deferred poll draft updaters run");
});

test("page templates are backend-owned immutable subtree snapshots", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");

  assertLocalized(panel, "页面模板");
  assertLocalized(panel, "保存当前页面为模板");
  assertLocalized(panel, "用当前页面生成新版本");
  assert.match(panel, /instantiatePageTemplate/);
  assert.match(panel, /listPageTemplateVersions/);
  assert.match(types, /KnowledgePageTemplateVersionSummary/);
  assert.match(types, /createPageTemplate\?/);
  assert.match(types, /instantiatePageTemplate\?/);
  assert.match(client, /\$\{templatePath\(libraryID, templateID\)\}\/instantiate/);
  assert.match(client, /\$\{templatePath\(libraryID, templateID\)\}\/versions/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage/);
});

test("native application references are governed child pages instead of raw page IDs", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const blocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const runtime = await readFile(path.join(root, "src", "editors", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  assert.match(blocks, /dynamicRuntime\.createChildReference/);
  assert.match(blocks, /parentContent: serializeDocumentBlocks\(editor\.document/);
  assert.match(blocks, /runtime\.searchPages\(query/);
  assert.match(blocks, /targetType: \{ default: "document"/);
  assert.doesNotMatch(blocks, /contentType: \{ default: "document", values:/, "reference props must not overwrite BlockNote's data-content-type marker");
  assert.match(blocks, /referenceMode/);
  assert.match(blocks, /targetVersion/);
  assert.doesNotMatch(blocks, /aria-label="目标页面 ID"/);
  assert.match(runtime, /createChildReference/);
  assert.match(runtime, /renderReference/);
  assert.match(panel, /client\.createPageReference/);
  assert.match(panel, /collaboration\.flush\(\)/);
  assert.match(panel, /KnowledgeEmbeddedReference/);
  assertLocalized(panel, "固定版本 {value0}");
  assertLocalized(panel, "引用不可用或权限已撤销");
  assert.match(panel, /streamKnowledgePageLiveEvents/);
  assert.doesNotMatch(panel, /setInterval/);
  assert.match(client, /\/references/);
  assert.match(client, /\/live-events/);
  assert.match(client, /\["changed", "heartbeat", "revoked"\]/);
  assert.match(styles, /\.knowledge-reference-picker/);
  assert.match(styles, /\.knowledge-reference-embed/);
});

test("personal page navigation is backend-owned and visible in the workspace", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  for (const kind of ["favorites", "recent_views", "recent_edits", "subscribed", "shortcuts", "trash"]) {
    assert.match(types, new RegExp(`\\"${kind}\\"`));
  }
  assert.match(client, /\/personal-state/);
  assert.match(client, /\/view`/);
  assert.match(client, /\/page-collections/);
  assert.match(panel, /client\.recordPageView/);
  assert.match(panel, /client\.setPagePersonalState/);
  assertLocalized(panel, "快捷入口");
  assertLocalized(panel, "最近访问");
  assertLocalized(panel, "最近编辑");
  assertLocalized(panel, "回收站");
  assert.doesNotMatch(panel, /showArchived/, "archive filtering must not remain a second recycle-bin interaction");
  assert.match(styles, /\.knowledge-page-collections > button:hover/);
  assert.match(styles, /\.knowledge-collection-list > button\[role="listitem"\]:hover/);
});

test("shared page metadata and governance are backend-owned, typed, and editable in the page workspace", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  assert.match(types, /KnowledgePageMetadata/);
  for (const propertyType of ["text", "number", "date", "select", "checkbox", "person"]) {
    assert.match(types, new RegExp(`\\"${propertyType}\\"`));
  }
  assert.match(client, /\/metadata/);
  assert.match(client, /\/governance/);
  assert.match(panel, /client\.getPageMetadata/);
  assert.match(panel, /client\.setPageMetadata/);
  assert.match(panel, /client\.setPageGovernance/);
  assert.match(panel, /client\.reviewPageGovernance/);
  assert.match(panel, /client\.listPageGovernanceAudit/);
  assertLocalized(panel, "下次复核时间");
  assertLocalized(panel, "归档保留期");
  assertLocalized(panel, "内容管理员");
  assertLocalized(panel, "自定义属性");
  assert.match(styles, /\.knowledge-page-metadata-summary/);
  assert.match(styles, /\.knowledge-metadata-property/);
  assert.match(styles, /\.knowledge-page-governance/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage|indexedDB/i);
});

test("page references and backlinks use the authorized backend graph index", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  assert.match(types, /KnowledgePageReferenceDirection = "outgoing" \| "incoming"/);
  assert.match(types, /source_content_type/);
  assert.match(types, /target_content_type/);
  assert.match(client, /listPageReferences/);
  assert.match(client, /direction, after, limit/);
  assert.match(panel, /client\.listPageReferences/);
  assertLocalized(panel, "引用了谁");
  assertLocalized(panel, "被谁引用");
  assertLocalized(panel, "引用页面不可用");
  assert.match(styles, /\.knowledge-page-references/);
  assert.match(styles, /\.knowledge-reference-index-list > button:hover/);
  assert.doesNotMatch(panel, /localStorage|sessionStorage|indexedDB/i);
});

test("page identity search and relationship graph keep stable IDs behind live labels", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const blocks = await readFile(path.join(root, "src", "editors", "documentBlocks.tsx"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  assert.match(types, /type KnowledgePageIdentity/);
  assert.match(types, /related_page_ids: string\[\]/);
  assert.match(types, /KnowledgePageRelationshipKind = "hierarchy" \| "reference" \| "related"/);
  assert.match(client, /\/page-identities\?/);
  assert.match(client, /\/relationship-graph\?/);
  assert.match(panel, /client\.searchPageIdentities/);
  assert.match(panel, /client\.getPageRelationshipGraph/);
  assertLocalized(panel, "同名页用完整路径消歧");
  assertLocalized(panel, "关系始终保存稳定 page ID");
  assert.match(panel, /metadata\.related_page_ids/);
  assert.match(panel, /metadataAliases\(metadataAliasesInput\)/);
  assertLocalized(panel, "目标已归档、已撤权或不存在");
  assert.match(panel, /metadataDirty \? relationshipResults\.find/);
  assert.match(panel, /client\.searchPageIdentities\(library\.id, relationshipQuery\.trim\(\), 30, signal\)/);
  assert.match(blocks, /page\.path\.map\(item => item\.title\)\.join\(" \/ "\)/);
  assert.match(styles, /\.knowledge-relationship-node:hover/);
  assert.match(styles, /\.knowledge-related-selected > div\.is-unavailable/);
  assert.doesNotMatch(panel, /for \(const items of Object\.values\(children\)\)/, "mention search must not be limited to the expanded local tree");
  assert.doesNotMatch(panel, /localStorage|sessionStorage|indexedDB/i);
});

test("content copy download print export and duplicate entries fail closed through server policy", async () => {
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const shared = await readFile(path.join(root, "src", "KnowledgeSharedPage.tsx"), "utf8");
  const filePage = await readFile(path.join(root, "src", "KnowledgeFilePage.tsx"), "utf8");
  const filePreview = await readFile(path.join(root, "src", "file-preview.ts"), "utf8");
	const manager = await readFile(path.join(root, "src", "KnowledgePageContentPolicyManager.tsx"), "utf8");
	const governance = await readFile(path.join(root, "src", "KnowledgePageGovernance.tsx"), "utf8");
	const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");
  const editorNames = ["BlockNoteEditor", "CanvasEditor", "SpreadsheetEditor", "GridEditor", "MindMapEditor", "FlowchartEditor", "PresentationEditor", "FormEditor", "MindNoteEditor"];
  const editors = await Promise.all(editorNames.map(name => readFile(path.join(root, "src", "editors", `${name}.tsx`), "utf8")));

  assert.match(client, /authorizePageContentOperation[\s\S]*content-copy/);
  assert.match(client, /authorizePageShareContentOperation[\s\S]*content-copy/);
  assert.match(panel, /await client\.authorizePageContentOperation/);
  assert.match(panel, /authorizeContentAction\("copy"\)/);
  assert.match(panel, /authorizeContentAction\("print"\)/);
  assert.match(panel, /knowledge-print-blocked/);
  assert.match(shared, /await client\.authorizePageShareContentOperation/);
  assert.match(shared, /authorizeContentAction\("copy"\)/);
  assert.match(shared, /authorizeContentAction\("print"\)/);
  assert.match(shared, /authorizeContentAction=\{authorizeContentAction\}/);
  assert.match(filePage, /knowledgePageDocumentDownloadSource\(client, pageID, document\)/);
  assert.match(filePreview, /client\.readPageDocumentContent/);
  assert.match(client, /\/documents\/\$\{encodeURIComponent\(documentID\)\}\/download/);

  for (const [index, editor] of editors.entries()) {
    assert.match(editor, /authorizeContentAction/, `${editorNames[index]} must receive the server policy gate`);
  }
  for (const name of ["BlockNoteEditor", "CanvasEditor", "SpreadsheetEditor", "GridEditor", "MindMapEditor", "FlowchartEditor", "PresentationEditor", "FormEditor"]) {
    const editor = editors[editorNames.indexOf(name)];
    assert.match(editor, /await authorizeContentAction\((?:"export"|format ===|kind ===)/, `${name} export must authorize before generating a file`);
  }
  assert.match(editors[editorNames.indexOf("BlockNoteEditor")], /await authorizeContentAction\("duplicate"\)/);
  assert.match(editors[editorNames.indexOf("MindNoteEditor")], /await authorizeContentAction\("duplicate"\)/);
	for (const field of ["classification", "watermark_mode", "sensitive_content_action", "require_outbound_approval"]) assert.match(manager, new RegExp(field));
	assertLocalized(manager, "要求宿主审批系统实时放行");
	assert.match(panel, /KnowledgeDynamicWatermark governance=\{view\?\.governance\}/);
	assert.match(shared, /KnowledgeDynamicWatermark governance=\{view\.view\.governance\}/);
	assert.match(governance, /dynamic_watermark/);
	assert.match(styles, /\.knowledge-dynamic-watermark/);
	assert.match(styles, /pointer-events: none/);
});

test("AI candidates are source-pinned, visible, and require explicit editor confirmation", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const editor = await readFile(path.join(root, "src", "editors", "BlockNoteEditor.tsx"), "utf8");

  assert.match(types, /KnowledgeAISourceScope = "published" \| "draft"/);
  assert.match(types, /KnowledgeAIExecutionState = "pending" \| "running" \| "completed" \| "failed" \| "confirmed"/);
  assert.match(client, /\/ai-executions/);
  assert.match(panel, /aiExecution\.source\.content_sha256/);
  assertLocalized(panel, "确认并追加到草稿");
  assert.match(panel, /await collaboration\.flush\(\)/);
  assert.match(panel, /client\.confirmAIExecution/);
  assert.match(editor, /editor\.tryParseMarkdownToBlocks/);
  assert.match(editor, /editor\.insertBlocks/);
  assert.doesNotMatch(panel, /setBody\(aiExecution\.result/);
});

test("page history prioritizes immutable versions and restores snapshots through a new draft", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const history = await readFile(path.join(root, "src", "page-workspace", "PageHistoryPanel.tsx"), "utf8");
  const client = await readFile(path.join(root, "src", "client.ts"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  assert.match(panel, /historySection/);
  assertLocalized(history, "发布版本");
  assertLocalized(history, "编辑记录");
  assert.match(panel, /client\.restorePageVersion/);
  assert.match(panel, /expected_page_revision: current\.page\.revision/);
  assert.match(panel, /expected_draft_revision: current\.draft\.draft_revision/);
  assertLocalized(panel, "已回滚到版本 {value0} 并生成当前草稿");
  assert.match(client, /\/versions\/\$\{version\}\/restore/);
  assert.match(styles, /\.knowledge-page-history \{[^}]*width: 100%;[^}]*margin: 0;/);
});

test("page workspace keeps focused surfaces and mention composition outside the orchestration container", async () => {
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const mention = await readFile(path.join(root, "src", "page-workspace", "MentionComposer.tsx"), "utf8");
  const comments = await readFile(path.join(root, "src", "page-workspace", "CommentDrawer.tsx"), "utf8");
  const suggestions = await readFile(path.join(root, "src", "page-workspace", "SuggestionDrawer.tsx"), "utf8");
  const activity = await readFile(path.join(root, "src", "page-workspace", "PageActivityPanel.tsx"), "utf8");

  for (const component of ["CommentDrawer", "SuggestionDrawer", "PageHistoryPanel", "PageActivityPanel", "PageOutline"]) assert.match(panel, new RegExp(`<${component}`));
  assert.match(comments, /<MentionComposer/);
  assert.match(suggestions, /<MentionComposer/);
  assert.match(mention, /textarea/);
  assert.match(mention, /mentionRangeAt/);
  for (const label of ["文字样式", "插入表情", "提及成员", "更多内容", "日期", "待办事项"]) assertLocalized(mention, label);
  assert.match(comments, /editingMentionedUserIDs/);
  assert.doesNotMatch(suggestions, /<textarea/);
  assert.doesNotMatch(comments, /按姓名或邮箱搜索/);
  assert.doesNotMatch(suggestions, /按姓名或邮箱搜索/);
  assert.match(activity, /knowledge-page-mode-surface/);
  assert.doesNotMatch(panel, /mode === "activity" \? " has-side-panel"/);
});

test("host selection integration is opt-in, bounded, and does not invoke content authorization", async () => {
  const workspace = await readFile(path.join(root, "src", "KnowledgeWorkspace.tsx"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const editor = await readFile(path.join(root, "src", "editors", "BlockNoteEditor.tsx"), "utf8");
  const host = await readFile(path.join(root, "src", "hostIntegration.ts"), "utf8");
  assert.match(workspace, /hostIntegration\?: KnowledgeHostIntegration/);
  assert.match(workspace, /hostIntegration=\{hostIntegration\}/);
  assert.match(panel, /hostIntegration\?\.capabilities\.addSelectionToConversation/);
  assert.match(panel, /createKnowledgeSelectionReference/);
  assert.match(panel, /hostIntegration\.addSelection\(reference\)/);
  assert.ok((panel.match(/addDocumentSelection=\{addDocumentSelectionAction\}/g) || []).length >= 3, "read, suggestion, and edit document surfaces must expose the host action");
  const selectionHandler = panel.slice(panel.indexOf("async function addDocumentSelection"), panel.indexOf("async function controlledPageCopy"));
  assert.doesNotMatch(selectionHandler, /authorizeContentAction|authorizePageContentOperation|agent_context/);
  assert.match(editor, /editor\.getSelection\(\)/);
  assert.match(editor, /editor\.getSelectedText\(\)/);
  assert.match(editor, /boundKnowledgeDocumentSelection/);
  assert.match(editor, /addDocumentSelection && documentSelection/);
  assert.match(host, /slice\(0, KNOWLEDGE_SELECTION_MAX_BLOCKS\)/);
  assert.match(host, /slice\(0, KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH\)/);
});

test("suggestion UI recognizes replace and sends explicit non-Agent provenance", async () => {
  const types = await readFile(path.join(root, "src", "types.ts"), "utf8");
  const panel = await readFile(path.join(root, "src", "KnowledgePagesPanel.tsx"), "utf8");
  const drawer = await readFile(path.join(root, "src", "page-workspace", "SuggestionDrawer.tsx"), "utf8");

  assert.match(types, /kind: "insert" \| "delete" \| "replace"/);
  assert.match(types, /source: "knowledge_ui" \| "verdent_agent"/);
  assert.match(types, /expected_block_sha256\?: string/);
  assert.match(types, /decision_tool_call_id\?: string/);
  assert.equal((panel.match(/source: "knowledge_ui"/g) || []).length, 2, "Knowledge UI must identify both suggestion create and decision calls without impersonating the Agent");
  assert.match(drawer, /suggestion\.kind === "replace"/);
  assert.match(drawer, /suggestion\.source === "verdent_agent"/);
  assert.match(drawer, /Verdent Agent/);
});

test("repository-owned selects share the accessible product popover instead of native browser chrome", async () => {
  const files = (await sourceFiles(path.join(root, "src"))).filter(file => /\.(ts|tsx)$/.test(file) && !file.endsWith(`${path.sep}components.tsx`));
  const components = await readFile(path.join(root, "src", "components.tsx"), "utf8");
  const styles = await readFile(path.join(root, "src", "styles.css"), "utf8");

  for (const file of files) {
    assert.doesNotMatch(await readFile(file, "utf8"), /<select\b/, `${path.relative(root, file)} must use the shared Select component`);
  }
  assert.match(components, /SelectProvider as AriakitSelectProvider/);
  assert.match(components, /AriakitSelectPopover[^>]*portal/);
  assert.match(components, /className="knowledge-select-native"/);
  assert.match(components, /dispatchEvent\(new Event\("change", \{ bubbles: true \}\)\)/);
  assert.match(styles, /\.knowledge-select-popover \{/);
  assert.match(styles, /\.knowledge-select-option\[aria-selected="true"\]/);
});
