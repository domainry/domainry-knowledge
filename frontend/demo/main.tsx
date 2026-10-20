import React from "react";
import { createRoot } from "react-dom/client";
import { KnowledgeWorkspace } from "../src/KnowledgeWorkspace.tsx";
import "../src/styles.css";
import type { KnowledgeClient, KnowledgeCollaborationPresence, KnowledgeCollaborationSession, KnowledgeCollaborationSnapshot, KnowledgeCollaborationUpdate, KnowledgeCollaborationUpdateEvent, KnowledgeDocument, KnowledgeLibrary, KnowledgePage, KnowledgePageAccessPolicy, KnowledgePageComment, KnowledgePageContent, KnowledgePageVersion, KnowledgePageView, KnowledgePrincipal } from "../src/types.ts";
import type { KnowledgePageContentType } from "../src/types.ts";
import { initialPageContent } from "../src/pageTypeRegistry.ts";

const now = "2026-10-20T08:00:00.000Z";
const manager: KnowledgePrincipal = { user_id: "alice", display_name: "Alice 管理员", email: "alice@example.com", status: "active" };
const bob: KnowledgePrincipal = { user_id: "bob", display_name: "Bob 编辑者", email: "bob@example.com", status: "active" };
const carol: KnowledgePrincipal = { user_id: "carol", display_name: "Carol 产品", email: "carol@example.com", status: "active" };
let library: KnowledgeLibrary = { id: "klib_acceptance", kind: "shared", name: "产品知识库", description: "产品规范、发布资料与团队协作沉淀", role: "manager", owner_user_id: manager.user_id, archived: false, revision: 7, knowledge_configured: true, documents_configured: true, sources_manageable: true, datasource_key: "product-search", document_max_bytes: 64 * 1024 * 1024, document_index_max_bytes: 32 * 1024 * 1024, document_formats: [{ extension: ".md", content_type: "text/markdown", parser_route: "text" }, { extension: ".pdf", content_type: "application/pdf", parser_route: "pdf" }] };
const personalLibrary: KnowledgeLibrary = { ...library, id: "klib_personal", kind: "personal", name: "我的知识库", description: "个人笔记、草稿与待整理资料", revision: 3, datasource_key: "personal-search" };
let libraries: KnowledgeLibrary[] = [personalLibrary, library];
const demoMarkdown = "# 协作编辑验收指南\n\n这是统一界面的在线预览示例。\n\n## 冲突收敛\n\n正文由 Yjs 按内容块与富文本节点合并。";
const demoMarkdownBytes = new TextEncoder().encode(demoMarkdown).byteLength;
let documents: KnowledgeDocument[] = [{ id: "kdoc_guide", library_id: library.id, filename: "协作编辑验收指南.md", content_type: "text/markdown", bytes: demoMarkdownBytes, sha256: "b".repeat(64), content_version: 3, index_generation: 3, created_by_user_id: manager.user_id, state: "ready", processing_stage: "complete", security_status: "clean", security_scanner: "domainry-safe", security_report_sha256: "c".repeat(64), index_status: "ready", revision: 5, created_at: now, updated_at: now }, { id: "kdoc_release", library_id: library.id, filename: "秋季发布计划.pdf", content_type: "application/pdf", bytes: 1832400, sha256: "d".repeat(64), content_version: 1, index_generation: 1, created_by_user_id: bob.user_id, state: "indexing", processing_stage: "index", security_status: "clean", index_status: "indexing", revision: 2, created_at: now, updated_at: now }];

function page(id: string, title: string, parent = "", libraryID = library.id, contentType: KnowledgePageContentType = "document"): KnowledgePage {
  return { id, library_id: libraryID, parent_page_id: parent || undefined, rank: id === "kpage_root" ? "a" : "b", title, content_type: contentType, state: "active", published_version: 2, projection_status: "ready", access_mode: "inherit", access_revision: 1, access_status: "ready", revision: 3, created_by_user_id: manager.user_id, updated_by_user_id: manager.user_id, created_at: now, updated_at: now };
}

const rootPage = page("kpage_root", "协作编辑规范");
const destinationPage = page("kpage_destination", "受限项目区");
const personalPage = page("kpage_personal", "协作编辑规范", "", personalLibrary.id);
let pages = [rootPage, destinationPage, personalPage];
let access: KnowledgePageAccessPolicy = { page_id: rootPage.id, library_id: library.id, mode: "inherit", revision: 1, projection_status: "ready", grants: [], updated_by_user_id: manager.user_id, updated_at: now };
let publishedVersion = 2;
let currentTitle = rootPage.title;
function blockDocument(text: string) {
  const blocks = text.split("\n").filter(Boolean).map((line, index) => {
    const heading = /^(#{1,3})\s+/.exec(line);
    const bullet = line.startsWith("- ");
    const type = heading ? "heading" : bullet ? "bulletListItem" : "paragraph";
    const value = heading ? line.slice(heading[0].length) : bullet ? line.slice(2) : line;
    return { id: `demo-block-${index + 1}`, type, props: heading ? { level: heading[1].length } : {}, content: [{ type: "text", text: value, styles: {} }], children: [] };
  });
  return JSON.stringify({ blocks });
}
let currentContent = blockDocument("# 协作编辑规范\n发布版本只来自冻结的协同快照。\n## 发布前检查\n- 权限实时复核\n- 草稿不会进入索引\n- 由两位编辑者共同校对示例与术语\n## 冲突处理\n正文由 Yjs 按内容块与富文本节点增量合并，不会整篇覆盖其他人的修改。");
const pageDrafts = new Map<string, { title: string; content: string }>();
pageDrafts.set(personalPage.id, { title: personalPage.title, content: currentContent });
pageDrafts.set(destinationPage.id, { title: destinationPage.title, content: blockDocument("# 受限项目区\n仅明确授权的团队成员可以访问此页面及其子树。") });
const previousContent = blockDocument("# 协作编辑规范\n发布版本来自编辑者确认后的草稿。\n## 发布前检查\n- 校对页面标题\n- 确认文档已完成索引");

function pageContent(content: string, summary?: string): KnowledgePageContent {
  return { content_schema_version: 2, content, content_sha256: "a".repeat(64), plain_text: summary || "结构化知识文档", summary };
}

let versions: KnowledgePageVersion[] = [
  { page_id: rootPage.id, library_id: library.id, version: 2, title: currentTitle, content_type: "document", rank: rootPage.rank, body: pageContent(currentContent, "协作编辑、发布检查与冲突处理"), published_by_user_id: manager.user_id, published_at: now, publish_note: "补充多人协作与冲突收敛说明" },
  { page_id: rootPage.id, library_id: library.id, version: 1, title: currentTitle, content_type: "document", rank: rootPage.rank, body: pageContent(previousContent, "发布前基础检查"), published_by_user_id: bob.user_id, published_at: "2026-10-18T09:30:00.000Z", publish_note: "建立协作编辑基线" },
];

let comments: KnowledgePageComment[] = [
  { id: "comment-review", page_id: rootPage.id, library_id: library.id, published_version: 2, anchor: { quote: "权限实时复核" }, body: "权限复核已经覆盖页面继承和资料库成员角色，建议发布前再走一次只读账号。", mentioned_user_ids: [manager.user_id], author_user_id: bob.user_id, resolved: false, deleted: false, revision: 1, created_at: "2026-10-20T07:15:00.000Z", updated_at: "2026-10-20T07:15:00.000Z" },
  { id: "comment-reply", page_id: rootPage.id, library_id: library.id, parent_comment_id: "comment-review", published_version: 2, anchor: { quote: "权限实时复核" }, body: "只读账号已验证，搜索结果也会随撤权立即隐藏。", mentioned_user_ids: [bob.user_id], author_user_id: carol.user_id, resolved: true, resolved_by_user_id: manager.user_id, deleted: false, revision: 2, created_at: "2026-10-20T07:42:00.000Z", updated_at: "2026-10-20T07:58:00.000Z" },
];

function pageDraft(current: KnowledgePage) {
  return current.id === rootPage.id ? { title: currentTitle, content: currentContent } : pageDrafts.get(current.id) || { title: current.title, content: "" };
}

function snapshot(pageID = rootPage.id): KnowledgeCollaborationSnapshot {
  const current = pages.find(item => item.id === pageID) || rootPage;
  const draft = pageDraft(current);
  return { page_id: current.id, draft_revision: 4, server_clock: 12, title: draft.title, content: draft.content, content_sha256: "a".repeat(64), yjs_state: collaborationStates.get(pageID) };
}

const collaborationStates = new Map<string, string>();
let collaborationSnapshot = snapshot();
let localSession: KnowledgeCollaborationSession | null = null;
let localEditedBlocks = 0;

function presence(): KnowledgeCollaborationPresence[] {
  const instant = new Date().toISOString();
  return [
    ...(localSession ? [{ session_id: localSession.id, user_id: manager.user_id, cursor_block_id: "demo-block-1", selection_block_id: "demo-block-1", edited_blocks: localEditedBlocks, last_seen_at: instant }] : []),
    { session_id: "demo-bob", user_id: bob.user_id, cursor_block_id: "demo-block-4", selection_block_id: "demo-block-4", edited_blocks: 4, last_seen_at: instant },
    { session_id: "demo-carol", user_id: carol.user_id, cursor_block_id: "demo-block-7", selection_block_id: "demo-block-7", edited_blocks: 2, last_seen_at: instant },
  ];
}

function collaborationSession(): KnowledgeCollaborationSession {
  const session = localSession!;
  return { ...session, server_clock: collaborationSnapshot.server_clock, expires_at: new Date(Date.now() + 30_000).toISOString(), snapshot: collaborationSnapshot, presence: presence() };
}

function view(current: KnowledgePage): KnowledgePageView {
  const draft = pageDraft(current), pageTitle = draft.title;
  const pagePublishedVersion = current.id === rootPage.id ? publishedVersion : current.published_version;
  return {
    page: { ...current, title: pageTitle, published_version: pagePublishedVersion, access_mode: access.mode, access_revision: access.revision, access_status: access.projection_status },
    published: pagePublishedVersion ? { page_id: current.id, library_id: current.library_id, version: pagePublishedVersion, title: pageTitle, content_type: current.content_type, parent_page_id: current.parent_page_id, rank: current.rank, body: pageContent(draft.content, "协作编辑与权限边界"), published_by_user_id: manager.user_id, published_at: now, publish_note: "协同验收版本" } : undefined,
    draft: { page_id: current.id, library_id: current.library_id, base_published_version: pagePublishedVersion || 0, draft_revision: collaborationSnapshot.draft_revision, title: pageTitle, content_type: current.content_type, parent_page_id: current.parent_page_id, rank: current.rank, body: pageContent(draft.content), updated_by_user_id: manager.user_id, updated_at: now },
    breadcrumbs: [{ page_id: current.id, title: pageTitle }],
  };
}

const unsupported = async () => { throw new Error("该验收场景未启用此操作"); };
const client = new Proxy({
  scope() { return "knowledge-ui-demo"; },
  documentContentURL() { return ""; },
  async search(request: { query: string; libraryID?: string }) {
    const scopeID = request.libraryID || library.id;
    return { library_id: scopeID, provider: "demo", kb_id: scopeID === personalLibrary.id ? "personal-search" : "product-search", operation: "search" as const, query: request.query, citations: [{ id: "citation-guide", provider: "demo", kb_id: scopeID === personalLibrary.id ? "personal-search" : "product-search", operation: "search" as const, doc_id: "kdoc_guide", library_id: scopeID, title: scopeID === personalLibrary.id ? "我的工作笔记" : "协作编辑验收指南", excerpt: "多人编辑采用增量合并，发布版本来自冻结的协同快照。", score: .94, document_version: 3, content_sha256: "b".repeat(64), location: { line: 18, line_end: 24 } }], data: {} };
  },
  async read(documentID: string, libraryID?: string) {
    const scopeID = libraryID || library.id, kbID = scopeID === personalLibrary.id ? "personal-search" : "product-search";
    return { library_id: scopeID, provider: "demo", kb_id: kbID, operation: "fetch" as const, doc_id: documentID, citations: [{ id: "citation-guide-read", provider: "demo", kb_id: kbID, operation: "fetch" as const, doc_id: documentID, library_id: scopeID, title: scopeID === personalLibrary.id ? "我的工作笔记" : "协作编辑验收指南", excerpt: "正文由 Yjs 合并内容块与富文本节点，服务端校验并持久化 Block JSON 检查点。", document_version: 3, content_sha256: "b".repeat(64), location: { line: 18, line_end: 24 } }], data: {} };
  },
  async listLibraries() { return { items: libraries, complete: true }; },
  async getLibrary(libraryID: string) { return libraries.find(item => item.id === libraryID) || library; },
  async createLibrary(request: { kind: "personal" | "shared"; name: string }) {
    if (request.kind === "personal") {
      const existing = libraries.find(item => item.kind === "personal");
      if (existing) return existing;
      libraries = [personalLibrary, ...libraries];
      return personalLibrary;
    }
    const created = { ...library, id: `klib_${crypto.randomUUID().slice(0, 8)}`, kind: request.kind, name: request.name, description: "", revision: 1 };
    libraries = [...libraries, created]; return created;
  },
  async updateLibrary(libraryID: string, request: { name: string; description: string; archived: boolean }) {
    library = { ...library, name: request.name, description: request.description, archived: request.archived, revision: library.revision + 1 };
    libraries = libraries.map(item => item.id === libraryID ? library : item); return library;
  },
  async setLibraryArchived(libraryID: string, archived: boolean) {
    library = { ...library, archived, revision: library.revision + 1 }; libraries = libraries.map(item => item.id === libraryID ? library : item); return library;
  },
  async listMembers() { return { items: [{ user_id: manager.user_id, role: "manager" as const }, { user_id: bob.user_id, role: "editor" as const }, { user_id: carol.user_id, role: "reader" as const }], revision: library.revision, complete: true }; },
  async setMember() { library = { ...library, revision: library.revision + 1 }; return library; },
  async removeMember() { library = { ...library, revision: library.revision + 1 }; return library; },
  async listSources() { return { library_id: library.id, revision: library.revision, current_key: "product-search", status: "connected" as const, items: [{ key: "product-search", name: "产品知识索引", description: "发布内容与安全文档索引", available: true }], complete: true, can_bind: true }; },
  async bindSource() { return library; },
  async listDocuments(libraryID: string) { return { items: documents.filter(item => item.library_id === libraryID), complete: true }; },
  async getDocument(_libraryID: string, documentID: string) { return documents.find(item => item.id === documentID) || documents[0]; },
  async retryDocument(_libraryID: string, documentID: string) { const value = { ...(documents.find(item => item.id === documentID) || documents[0]), state: "queued" as const, processing_stage: "index" as const, revision: 6 }; documents = documents.map(item => item.id === documentID ? value : item); return value; },
  async reindexDocument(_libraryID: string, documentID: string) { const value = { ...(documents.find(item => item.id === documentID) || documents[0]), reindexing: true, revision: 6 }; documents = documents.map(item => item.id === documentID ? value : item); return value; },
  async deleteDocument(_libraryID: string, documentID: string) { const value = { ...(documents.find(item => item.id === documentID) || documents[0]), state: "deleting" as const, processing_stage: "delete" as const, revision: 6 }; documents = documents.map(item => item.id === documentID ? value : item); return value; },
  async readDocumentContent(_libraryID: string, documentID: string, request: { range?: string }) {
    const document = documents.find(item => item.id === documentID) || documents[0];
    const data = new TextEncoder().encode(demoMarkdown);
    const requested = request.range?.match(/^bytes=(\d+)-(\d+)$/);
    const start = requested ? Math.min(Number(requested[1]), data.length - 1) : 0;
    const end = requested ? Math.min(Number(requested[2]), data.length - 1) : data.length - 1;
    const body = data.slice(start, end + 1);
    const headers = { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(document.filename)}`, "Content-Length": String(body.length), "Content-Range": `bytes ${start}-${end}/${data.length}`, "X-Domainry-File-SHA256": document.sha256 };
    return new Response(body, { status: requested ? 206 : 200, headers });
  },
  async listPages(libraryID: string, parentPageID: string) { return { items: pages.filter(item => item.library_id === libraryID && (item.parent_page_id || "") === parentPageID), complete: true }; },
  async getPage(_libraryID: string, pageID: string) { return view(pages.find(item => item.id === pageID) || rootPage); },
  async createPage(libraryID: string, request: { parent_page_id?: string; title: string; content_type: KnowledgePageContentType }) {
    const created = page(`kpage_${crypto.randomUUID().slice(0, 8)}`, request.title, request.parent_page_id, libraryID, request.content_type);
    created.published_version = undefined;
    created.projection_status = "none";
    pageDrafts.set(created.id, { title: request.title, content: initialPageContent(request.content_type) });
    pages = [...pages, created];
    return view(created);
  },
  async copyPage(_libraryID: string, pageID: string, request: { parent_page_id?: string; title?: string }) {
    const source = pages.find(item => item.id === pageID) || rootPage;
    const copied = page(`kpage_${crypto.randomUUID().slice(0, 8)}`, request.title || `${source.title} 副本`, request.parent_page_id, source.library_id, source.content_type);
    copied.published_version = undefined;
    copied.projection_status = "none";
    const sourceDraft = pageDraft(source);
    pageDrafts.set(copied.id, { title: copied.title, content: sourceDraft.content });
    pages = [...pages, copied];
    return view(copied);
  },
  async reorderPages(_libraryID: string, request: { parent_page_id?: string; items: { page_id: string }[] }) {
    const ranks = new Map(request.items.map((item, index) => [item.page_id, String.fromCharCode(97 + index)]));
    pages = pages.map(item => ranks.has(item.id) ? { ...item, rank: ranks.get(item.id)!, revision: item.revision + 1 } : item);
    return { items: request.items.map(item => pages.find(page => page.id === item.page_id)!).filter(Boolean), complete: true };
  },
  async setPageArchived(_libraryID: string, pageID: string, archived: boolean) {
    pages = pages.map(item => item.id === pageID ? { ...item, state: archived ? "archived" as const : "active" as const, revision: item.revision + 1 } : item);
    return pages.find(item => item.id === pageID)!;
  },
  async listPageVersions(_libraryID: string, pageID: string) { return { items: versions.filter(item => item.page_id === pageID), complete: true }; },
  async getPageVersion(_libraryID: string, pageID: string, version: number) {
    const selected = versions.find(item => item.page_id === pageID && item.version === version);
    if (!selected) throw new Error(`找不到版本 ${version}`);
    return selected;
  },
  async diffPageVersions(_libraryID: string, _pageID: string, fromVersion: number, toVersion: number) {
    const from = versions.find(item => item.version === fromVersion);
    const to = versions.find(item => item.version === toVersion);
    if (!from || !to) throw new Error("找不到待对比的版本");
    return {
      from_version: fromVersion,
      to_version: toVersion,
      title: from.title === to.title ? [{ kind: "equal" as const, text: from.title }] : [{ kind: "delete" as const, text: from.title }, { kind: "insert" as const, text: to.title }],
      parent: [{ kind: "equal" as const, text: from.parent_page_id || "根目录" }],
      content: [{ kind: "delete" as const, text: from.body.content }, { kind: "insert" as const, text: to.body.content }],
    };
  },
  async restorePageVersion(_libraryID: string, pageID: string, version: number) {
    const selected = versions.find(item => item.page_id === pageID && item.version === version);
    if (!selected) throw new Error(`找不到版本 ${version}`);
    currentTitle = selected.title;
    currentContent = selected.body.content;
    collaborationSnapshot = snapshot();
    return view(pages.find(item => item.id === pageID) || rootPage);
  },
  async listPageComments(_libraryID: string, pageID: string, _after: string, _limit: number, unresolved: boolean) {
    const items = comments.filter(item => item.page_id === pageID && (!unresolved || !item.resolved));
    return { items, complete: true };
  },
  async createPageComment(_libraryID: string, pageID: string, request: { parent_comment_id?: string; published_version: number; anchor: { node_id?: string; quote?: string }; body: string; mentioned_user_ids: string[] }) {
    const instant = new Date().toISOString();
    const created: KnowledgePageComment = { id: `comment-${crypto.randomUUID().slice(0, 8)}`, page_id: pageID, library_id: library.id, parent_comment_id: request.parent_comment_id, published_version: request.published_version, anchor: request.anchor, body: request.body, mentioned_user_ids: request.mentioned_user_ids, author_user_id: manager.user_id, resolved: false, deleted: false, revision: 1, created_at: instant, updated_at: instant };
    comments = [...comments, created];
    return created;
  },
  async updatePageComment(_libraryID: string, _pageID: string, commentID: string, request: { body: string; mentioned_user_ids: string[] }) {
    comments = comments.map(item => item.id === commentID ? { ...item, body: request.body, mentioned_user_ids: request.mentioned_user_ids, revision: item.revision + 1, updated_at: new Date().toISOString() } : item);
    return comments.find(item => item.id === commentID)!;
  },
  async resolvePageComment(_libraryID: string, _pageID: string, commentID: string, request: { resolved: boolean }) {
    comments = comments.map(item => item.id === commentID ? { ...item, resolved: request.resolved, resolved_by_user_id: request.resolved ? manager.user_id : undefined, revision: item.revision + 1, updated_at: new Date().toISOString() } : item);
    return comments.find(item => item.id === commentID)!;
  },
  async deletePageComment(_libraryID: string, _pageID: string, commentID: string) {
    comments = comments.map(item => item.id === commentID ? { ...item, deleted: true, body: "", mentioned_user_ids: [], revision: item.revision + 1, updated_at: new Date().toISOString() } : item);
    return comments.find(item => item.id === commentID)!;
  },
  async listPageAttachments() { return { items: [] }; },
  async resolvePrincipals(userIDs: string[]) { return [manager, bob, carol].filter(item => userIDs.includes(item.user_id)); },
  async searchPrincipals() { return { items: [manager, bob, carol], complete: true }; },
  async searchLibraryMembers() { return { items: [manager, bob, carol], complete: true }; },
  async explainAccess(_libraryID: string, input: { user_id: string; page_id?: string; action: string }) {
    const target = input.user_id === bob.user_id ? bob : manager;
    return { user_id: target.user_id, library_id: library.id, page_id: input.page_id, action: input.action, identity: { allowed: true, code: "identity_action_allowed", label: "Identity Action 已允许", source: input.action }, library: { allowed: true, code: "library_role_allowed", label: "资料库 editor 角色" }, page: { allowed: true, code: "page_inherited", label: access.mode === "inherit" ? "页面继承资料库权限" : "页面直接授权", source: access.mode === "inherit" ? "library" : "direct_grant" }, final: { allowed: true, code: "access_allowed", label: "最终允许" }, library_role: target.user_id === bob.user_id ? "editor" : "manager", inherited_from: access.mode === "inherit" ? library.id : rootPage.id, impact_pages: 2 };
  },
  async getPageAccess() { return access; },
  async setPageAccess(_libraryID: string, _pageID: string, request: { mode: "inherit" | "restricted"; grants: KnowledgePageAccessPolicy["grants"] }) {
    access = { ...access, mode: request.mode, grants: request.grants, revision: access.revision + 1, projection_status: "queued", updated_at: new Date().toISOString() };
    return access;
  },
  async previewPageMove(_libraryID: string, pageID: string, request: { parent_page_id?: string }) { return { page_id: pageID, parent_page_id: request.parent_page_id, affected_pages: 3, changed_user_ids: [bob.user_id], requires_confirm: true, token: "move-impact-token" }; },
  async movePage(_libraryID: string, pageID: string, request: { parent_page_id?: string; access_impact_token?: string }) {
    if (request.access_impact_token !== "move-impact-token") throw new Error("缺少权限影响确认");
    pages = pages.map(item => item.id === pageID ? { ...item, parent_page_id: request.parent_page_id, revision: item.revision + 1 } : item);
    return pages.find(item => item.id === pageID)!;
  },
  async savePageDraft(_libraryID: string, pageID: string, request: { title: string; content: string }) { if (pageID === rootPage.id) { currentTitle = request.title; currentContent = request.content; } else pageDrafts.set(pageID, { title: request.title, content: request.content }); collaborationSnapshot = snapshot(pageID); return view(pages.find(item => item.id === pageID) || rootPage); },
  async publishPage(_libraryID: string, pageID: string) {
    if (pageID === rootPage.id) publishedVersion++;
    else pages = pages.map(item => item.id === pageID ? { ...item, published_version: (item.published_version || 0) + 1, projection_status: "queued" as const, revision: item.revision + 1 } : item);
    return view(pages.find(item => item.id === pageID) || rootPage);
  },
  async connectKnowledgeCollaboration(_libraryID: string, pageID: string, request: { client_id: string }) {
    collaborationSnapshot = snapshot(pageID);
    localSession = { id: `demo-${request.client_id.slice(0, 8)}`, library_id: library.id, page_id: pageID, client_id: request.client_id, user_id: manager.user_id, state: "connected", server_clock: collaborationSnapshot.server_clock, expires_at: new Date(Date.now() + 30_000).toISOString(), snapshot: collaborationSnapshot, presence: [] };
    return collaborationSession();
  },
  async syncKnowledgeCollaboration(_libraryID: string, _pageID: string, request: { after_clock: number; update?: KnowledgeCollaborationUpdate; cursor_block_id?: string; selection_block_id?: string }) {
    const events: KnowledgeCollaborationUpdateEvent[] = [];
    let applied = false;
    if (request.update && request.after_clock === collaborationSnapshot.server_clock) {
      collaborationSnapshot = { ...collaborationSnapshot, title: request.update.title || collaborationSnapshot.title, content: request.update.content, content_sha256: request.update.content_sha256, yjs_state: request.update.yjs_state, draft_revision: collaborationSnapshot.draft_revision + 1, server_clock: collaborationSnapshot.server_clock + 1 };
      collaborationStates.set(collaborationSnapshot.page_id, request.update.yjs_state);
      if (collaborationSnapshot.page_id === rootPage.id) { currentTitle = collaborationSnapshot.title; currentContent = collaborationSnapshot.content; } else pageDrafts.set(collaborationSnapshot.page_id, { title: collaborationSnapshot.title, content: collaborationSnapshot.content });
      localEditedBlocks += request.update.edited_block_ids?.length || 0;
      events.push({ clock: collaborationSnapshot.server_clock, user_id: manager.user_id, update: request.update });
      applied = true;
    }
    return { session: collaborationSession(), events, applied, complete: true };
  },
  async closeKnowledgeCollaboration() { localSession = null; },
  async publishKnowledgeCollaboration(_libraryID: string, pageID: string) {
    if (pageID === rootPage.id) publishedVersion++;
    else pages = pages.map(item => item.id === pageID ? { ...item, published_version: (item.published_version || 0) + 1, projection_status: "queued" as const, revision: item.revision + 1 } : item);
    return view(pages.find(item => item.id === pageID) || rootPage);
  },
}, { get(target, property) { return property in target ? target[property as keyof typeof target] : unsupported; } }) as unknown as KnowledgeClient;

createRoot(document.getElementById("root")!).render(<React.StrictMode><KnowledgeWorkspace client={client} formatError={error => error instanceof Error ? error.message : String(error)} /></React.StrictMode>);
