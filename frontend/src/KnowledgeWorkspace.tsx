import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, FileSearch, FileText, FolderOpen, Plus, RefreshCw, Search, Users, X } from "lucide-react";
import { Button, defaultErrorMessage, EmptyState } from "./components.tsx";
import { KnowledgeDocumentsPanel } from "./KnowledgeDocumentsPanel.tsx";
import { KnowledgeSourcesPanel } from "./KnowledgeSourcesPanel.tsx";
import { KnowledgePagesPanel } from "./KnowledgePagesPanel.tsx";
import { knowledgeCitations, knowledgeDocumentHits, knowledgeSearchStatus } from "./search-results.ts";
import type { KnowledgeAccessExplanation, KnowledgeCitation, KnowledgeClient, KnowledgeLibrary, KnowledgeLibraryMember, KnowledgeLibraryMemberPage, KnowledgeLibraryPage, KnowledgePrincipal, KnowledgeResult } from "./types.ts";

export type KnowledgeWorkspaceProps = {
  client: KnowledgeClient;
  formatError?: (error: unknown) => string;
};

const roles: Record<KnowledgeLibraryMember["role"], string> = { reader: "阅读", editor: "编辑", manager: "管理" };

function safeURL(value?: string) {
  try {
    const url = new URL(value || "");
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password && !/[\r\n\t]/.test(value || "") ? url.href : undefined;
  } catch { return undefined; }
}

function citationLocation(citation: KnowledgeCitation) {
  const location = citation.location;
  if (!location) return "";
  const parts: string[] = [];
  if (Number.isInteger(location.page) && location.page! > 0) parts.push(`第 ${location.page} 页`);
  if (Number.isInteger(location.slide) && location.slide! > 0) parts.push(`第 ${location.slide} 张幻灯片`);
  if (location.section && location.section.length <= 256) parts.push(location.section);
	if (location.chunk_id && location.chunk_id.length <= 128) parts.push(`分块 ${location.chunk_id}`);
  if (location.sheet && location.sheet.length <= 128) parts.push(`工作表：${location.sheet}`);
  if (location.cell && /^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(location.cell)) parts.push(`单元格 ${location.cell}`);
  else if (Number.isInteger(location.row) && location.row! > 0) parts.push(Number.isInteger(location.row_end) && location.row_end! >= location.row! ? `第 ${location.row}–${location.row_end} 行` : `第 ${location.row} 行`);
  if (Number.isInteger(location.line) && location.line! > 0) parts.push(Number.isInteger(location.line_end) && location.line_end! >= location.line! ? `第 ${location.line}–${location.line_end} 行` : `第 ${location.line} 行`);
  if (Number.isInteger(location.paragraph) && location.paragraph! >= 0) parts.push(`第 ${location.paragraph! + 1} 段`);
  if (location.json_path && location.json_path.length <= 512) parts.push(`JSON ${location.json_path}`);
  if (location.html_id && location.html_id.length <= 256) parts.push(`#${location.html_id}`);
  if (Number.isInteger(location.start_ms) && location.start_ms! >= 0) parts.push(`${location.media_kind === "video" ? "视频" : location.media_kind === "audio" ? "音频" : "媒体"} ${formatMediaTime(location.start_ms!)}${Number.isInteger(location.end_ms) && location.end_ms! > location.start_ms! ? `–${formatMediaTime(location.end_ms!)}` : ""}`);
  return parts.join(" · ");
}

function formatMediaTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60), rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}

function citationProvenance(citation: KnowledgeCitation) {
  const parts: string[] = [];
  if (Number.isSafeInteger(citation.document_version) && citation.document_version! > 0) parts.push(`版本 ${citation.document_version}`);
  if (citation.source_revision && citation.source_revision.length <= 128) parts.push(`来源修订 ${citation.source_revision}`);
  if (Number.isFinite(citation.score)) parts.push(`相关度 ${citation.score!.toFixed(3)}`);
  if (citation.content_sha256 && /^[a-f0-9]{64}$/i.test(citation.content_sha256)) parts.push(`SHA-256 ${citation.content_sha256.slice(0, 12)}…`);
  return parts.join(" · ");
}

export function KnowledgeWorkspace({ client, formatError = defaultErrorMessage }: KnowledgeWorkspaceProps) {
  const [libraryKind, setLibraryKind] = useState<"personal" | "shared">("personal");
  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState({ query: "", revision: 0 });
  return <main className="knowledge-workspace">
    <div className="knowledge-workspace-toolbar">
      <div className="knowledge-workspace-tabs" role="tablist" aria-label="知识库范围"><button role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={17} /><span>个人知识库<small>仅自己可见的知识空间</small></span></button><button role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={17} /><span>团队知识库<small>按成员角色共同维护</small></span></button></div>
      <form className="knowledge-global-search" role="search" onSubmit={event => { event.preventDefault(); const query = searchInput.trim(); if (query) setSearchRequest(current => ({ query, revision: current.revision + 1 })); }}><Search size={17} aria-hidden="true" /><input aria-label="全文检索当前知识库" value={searchInput} maxLength={4096} onChange={event => setSearchInput(event.target.value)} placeholder="全文检索当前知识库" />{searchRequest.query && <Button type="button" aria-label="清除全文检索" onClick={() => { setSearchInput(""); setSearchRequest(current => ({ query: "", revision: current.revision + 1 })); }}><X size={15} /></Button>}<Button type="submit" className="primary" disabled={!searchInput.trim()}>搜索</Button></form>
    </div>
    <KnowledgeLibraryManager key={libraryKind} client={client} formatError={formatError} libraryKind={libraryKind} searchQuery={searchRequest.query} searchRevision={searchRequest.revision} />
  </main>;
}

function RemoteKnowledgeBrowser({ client, formatError, library, initialQuery = "", hideSearchForm = false }: { client: KnowledgeClient; formatError: (error: unknown) => string; library?: KnowledgeLibrary; initialQuery?: string; hideSearchForm?: boolean }) {
  const [input, setInput] = useState(initialQuery), [query, setQuery] = useState(initialQuery);
  const [searchRevision, setSearchRevision] = useState(0);
  const [libraryID, setLibraryID] = useState(library?.id || ""), [libraries, setLibraries] = useState<KnowledgeLibrary[]>(library ? [library] : []), [scopeNotice, setScopeNotice] = useState("");
  const [result, setResult] = useState<KnowledgeResult | null>(null), [current, setCurrent] = useState<KnowledgeResult | null>(null), [selected, setSelected] = useState<KnowledgeCitation | null>(null);
  const [loading, setLoading] = useState(false), [reading, setReading] = useState(false), [error, setError] = useState("");
  useEffect(() => {
    if (library) { setLibraries([library]); setLibraryID(library.id); setScopeNotice(""); return; }
    const abort = new AbortController();
    void (async () => {
      const items: KnowledgeLibrary[] = [], seen = new Set<string>();
      let after = "", complete = false;
      for (let pageIndex = 0; pageIndex < 20 && !complete; pageIndex += 1) {
        const page = await client.listLibraries(after, 100, abort.signal);
        if (abort.signal.aborted) return;
        for (const library of page.items) if (!seen.has(library.id)) { seen.add(library.id); items.push(library); }
        complete = page.complete;
        if (complete || !page.next_after || page.next_after === after) break;
        after = page.next_after;
      }
      if (!abort.signal.aborted) { setLibraries(items.filter(library => library.knowledge_configured)); setScopeNotice(complete ? "" : "资料库较多，仅显示前 2000 个可检索资料库。"); }
    })().catch(() => { if (!abort.signal.aborted) setScopeNotice("资料库范围暂时无法读取，仍可检索默认知识源。"); });
    return () => abort.abort();
  }, [client, library]);
  useEffect(() => {
    if (!query) return;
    const abort = new AbortController(); setLoading(true); setError(""); setResult(null); setCurrent(null); setSelected(null);
    void client.search({ query, libraryID: libraryID || undefined, signal: abort.signal }).then(value => { if (!abort.signal.aborted) setResult(value); }).catch(failure => { if (!abort.signal.aborted) { setResult(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, libraryID, query, searchRevision]);
  const hits = useMemo(() => knowledgeDocumentHits(result), [result]);
  const searchStatus = knowledgeSearchStatus(result);
  async function read(citation: KnowledgeCitation) {
    if (reading) return;
    setReading(true); setError(""); setSelected(citation); setCurrent(null);
    try { setCurrent(await client.read(citation.doc_id, citation.library_id || libraryID || undefined, AbortSignal.timeout(30_000))); }
    catch (failure) { setError(formatError(failure)); }
    finally { setReading(false); }
  }
  const passages = knowledgeCitations(current);
  return <div className="knowledge-browser-body"><section className="knowledge-search-column"><div className="knowledge-page-intro"><span><FileSearch size={22} /></span><div><h2>{library ? `全文检索「${library.name}」` : "全文检索"}</h2><p>{library ? "搜索当前知识库内有权读取的页面与文档。" : "选择默认知识源或一座资料库，再输入主题、问题或关键词。"}</p></div></div>{!library && <label className="knowledge-search-scope"><span>检索范围</span><select value={libraryID} onChange={event => setLibraryID(event.target.value)}><option value="">默认知识源</option>{libraries.map(item => <option key={item.id} value={item.id}>{item.name}{item.archived ? "（已归档）" : ""}</option>)}</select></label>}{scopeNotice && <p className="knowledge-subtle">{scopeNotice}</p>}{!hideSearchForm && <form className="knowledge-search-form" onSubmit={event => { event.preventDefault(); const value = input.trim(); if (value) { setQuery(value); setSearchRevision(current => current + 1); } }}><Search size={18} /><input aria-label="搜索知识库" value={input} maxLength={4096} onChange={event => setInput(event.target.value)} placeholder="输入主题、问题或关键词" /><Button type="submit" disabled={loading || !input.trim()}>{loading ? "正在检索…" : "搜索"}</Button></form>}{searchStatus?.summary && <p className="knowledge-subtle">检索策略：{searchStatus.summary}</p>}{searchStatus?.degraded && <p role="status" className="knowledge-notice">{searchStatus.degraded}</p>}{error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}{!query && <EmptyState><FileSearch size={30} /><h3>从一个问题开始</h3><p>知识服务只返回当前账号在所选范围内有权读取的内容。</p></EmptyState>}{query && !loading && result && hits.length === 0 && <EmptyState><FileText size={30} /><h3>没有可展示的文档</h3><p>没有命中相关内容，可以换一个更具体的关键词或检索范围。</p></EmptyState>}{hits.length > 0 && <div className="knowledge-hit-list">{hits.map(hit => <button key={`${hit.library_id || libraryID || "default"}:${hit.doc_id}`} aria-current={selected?.doc_id === hit.doc_id && (selected.library_id || libraryID || "") === (hit.library_id || libraryID || "") ? "true" : undefined} onClick={() => void read(hit)}><span className="knowledge-hit-icon"><FileText size={19} /></span><span><strong>{hit.title || hit.doc_id}</strong><small>{hit.excerpt || "打开查看文档内容"}</small><em>文档编号：{hit.doc_id}{hit.matchedPassages > 1 ? ` · 命中 ${hit.matchedPassages} 个片段` : ""}{citationLocation(hit) ? ` · ${citationLocation(hit)}` : ""}</em>{citationProvenance(hit) && <em>{citationProvenance(hit)}</em>}</span></button>)}</div>}</section><aside className="knowledge-reader" aria-label="文档阅读区">{!selected ? <EmptyState><FileText size={34} /><h3>选择一份文档查看</h3><p>搜索结果会在这里展开。</p></EmptyState> : reading ? <EmptyState><RefreshCw className="knowledge-spin" size={28} /><p>正在读取文档…</p></EmptyState> : current ? <><header><span className="knowledge-reader-icon"><FileText size={20} /></span><div><h2>{selected.title || current.doc_id || selected.doc_id}</h2><p>文档编号：{current.doc_id || selected.doc_id}{current.kb_id ? ` · 知识库 ${current.kb_id}` : ""}</p></div></header>{passages.length ? <article className="knowledge-passages">{passages.map((passage, index) => <section key={passage.id || `${passage.doc_id}:${passage.chunk_id || index}`}><small>片段 {index + 1}{citationLocation(passage) ? ` · ${citationLocation(passage)}` : ""}{passage.excerpt_truncated ? " · 内容已截断" : ""}</small>{citationProvenance(passage) && <small>{citationProvenance(passage)}</small>}<p>{passage.excerpt || "此片段没有可展示的正文。"}</p></section>)}</article> : <div className="knowledge-raw-document"><p>知识服务返回了文档，但没有生成可展示的正文片段。</p></div>}{safeURL(selected.url) && <a className="knowledge-source-link" href={safeURL(selected.url)} target="_blank" rel="noopener noreferrer">打开来源链接 ↗</a>}</> : <EmptyState><FileText size={34} /><h3>文档暂时无法显示</h3><p>请重新选择搜索结果。</p></EmptyState>}</aside></div>;
}

export function KnowledgeLibraryManager({ client, formatError = defaultErrorMessage, initialLibraryID = "", libraryKind, searchQuery = "", searchRevision = 0 }: { client: KnowledgeClient; formatError?: (error: unknown) => string; initialLibraryID?: string; libraryKind?: "personal" | "shared"; searchQuery?: string; searchRevision?: number }) {
  const [page, setPage] = useState<KnowledgeLibraryPage>({ items: [], complete: true });
  const [libraryCursors, setLibraryCursors] = useState([""]);
  const [selectedID, setSelectedID] = useState(initialLibraryID), [selected, setSelected] = useState<KnowledgeLibrary | null>(null);
  const [refresh, setRefresh] = useState(0), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [createName, setCreateName] = useState(""), [name, setName] = useState(""), [description, setDescription] = useState("");
  const [members, setMembers] = useState<KnowledgeLibraryMemberPage | null>(null), [memberCursors, setMemberCursors] = useState([""]);
  const [userID, setUserID] = useState(""), [role, setRole] = useState<KnowledgeLibraryMember["role"]>("reader"), [removeUserID, setRemoveUserID] = useState("");
  const [principalQuery, setPrincipalQuery] = useState(""), [principalResults, setPrincipalResults] = useState<KnowledgePrincipal[]>([]), [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({});
  const [accessPreview, setAccessPreview] = useState<KnowledgeAccessExplanation | null>(null);
  const [documentBusy, setDocumentBusy] = useState(false), [sourceBusy, setSourceBusy] = useState(false);
  const [libraryView, setLibraryView] = useState<"content" | "search">("content");
  const [libraryDialog, setLibraryDialog] = useState<"manage" | null>(null);
  const createReceipt = useRef<{ kind: "personal" | "shared"; name: string; clientID: string } | null>(null), lock = useRef(false);
  const blocked = busy || documentBusy || sourceBusy, libraryCursor = libraryCursors.at(-1) || "", memberCursor = memberCursors.at(-1) || "";
  const visibleLibraries = libraryKind ? page.items.filter(library => library.kind === libraryKind) : page.items;
  const canCreatePersonal = libraryKind !== "shared" && !loading && !page.items.some(item => item.kind === "personal");
  const canCreateTeam = libraryKind !== "personal";

  useEffect(() => {
    const abort = new AbortController(); setLoading(true); setError("");
    void (async () => {
      let value = await client.listLibraries(libraryCursor, 20, abort.signal);
      if (libraryKind) {
        const items = value.items.filter(item => item.kind === libraryKind), seen = new Set(value.items.map(item => item.id));
        let nextAfter = value.next_after, complete = value.complete;
        for (let scan = 1; items.length < 20 && !complete && nextAfter && scan < 20; scan += 1) {
          const next = await client.listLibraries(nextAfter, 20, abort.signal);
          if (abort.signal.aborted) return;
          for (const item of next.items) if (!seen.has(item.id)) { seen.add(item.id); if (item.kind === libraryKind) items.push(item); }
          complete = next.complete; nextAfter = next.next_after;
        }
        value = { items, next_after: complete ? undefined : nextAfter, complete };
      }
      if (abort.signal.aborted) return;
      setPage(value); setSelectedID(current => current && value.items.some(item => item.id === current && (!libraryKind || item.kind === libraryKind)) ? current : value.items.find(item => !libraryKind || item.kind === libraryKind)?.id || "");
    })().catch(failure => { if (!abort.signal.aborted) { setPage({ items: [], complete: true }); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, libraryCursor, libraryKind, refresh]);

  useEffect(() => {
    setMembers(null); setRemoveUserID("");
    if (!selectedID) { setSelected(null); return; }
    const abort = new AbortController();
    void client.getLibrary(selectedID, abort.signal).then(async value => {
      if (abort.signal.aborted) return;
      setSelected(value); setName(value.name); setDescription(value.description);
      if (value.role === "manager" && value.kind === "shared") setMembers(await client.listMembers(value.id, memberCursor, 20, abort.signal));
    }).catch(failure => { if (!abort.signal.aborted) { setSelected(null); setMembers(null); setError(formatError(failure)); } });
    return () => abort.abort();
  }, [client, formatError, memberCursor, refresh, selectedID]);

  useEffect(() => {
    if (!members?.items.length) { setMemberProfiles({}); return; }
    const abort = new AbortController();
    void client.resolvePrincipals(members.items.map(member => member.user_id), abort.signal).then(items => {
	  if (!abort.signal.aborted) setMemberProfiles(Object.fromEntries(items.filter(item => item.status === "active").map(item => [item.user_id, item])));
    }).catch(() => { if (!abort.signal.aborted) setMemberProfiles({}); });
    return () => abort.abort();
  }, [client, members]);

  useEffect(() => {
    if (searchRevision < 1) return;
    setLibraryView(searchQuery ? "search" : "content");
  }, [searchQuery, searchRevision]);

  useEffect(() => {
    const query = principalQuery.trim();
    if (!query || !selected || selected.role !== "manager") { setPrincipalResults([]); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchPrincipals(query, "", 20, abort.signal).then(page => {
      if (!abort.signal.aborted) setPrincipalResults(page.items.filter(item => item.status === "active"));
    }).catch(() => { if (!abort.signal.aborted) setPrincipalResults([]); }), 250);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, principalQuery, selected]);

  useEffect(() => {
    if (!selected || !userID) { setAccessPreview(null); return; }
    const abort = new AbortController();
    void client.explainAccess(selected.id, { user_id: userID, action: "knowledge.pages.get", proposed_role: role }, abort.signal).then(value => { if (!abort.signal.aborted) setAccessPreview(value); }).catch(() => { if (!abort.signal.aborted) setAccessPreview(null); });
    return () => abort.abort();
  }, [client, role, selected, userID]);

  async function perform(action: (signal: AbortSignal) => Promise<void>) {
    if (lock.current || documentBusy || sourceBusy) return;
    lock.current = true; setBusy(true); setError(""); setNotice("");
    try { await action(AbortSignal.timeout(60_000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); setRefresh(value => value + 1); }
  }
  function selectResult(value: KnowledgeLibrary, message: string) { setSelectedID(value.id); setSelected(value); setMemberCursors([""]); setNotice(message); }
  async function create(kind: "personal" | "shared", signal: AbortSignal) {
    const title = kind === "personal" ? "个人知识库" : createName.trim();
    if (!title) return;
    const pending = createReceipt.current;
    if (pending && (pending.kind !== kind || pending.name !== title)) throw Error("上次创建结果待确认；重试时需保持资料库名称不变。");
    const input = pending || { kind, name: title, clientID: crypto.randomUUID() };
    createReceipt.current = input;
    const value = await client.createLibrary(input, signal);
    createReceipt.current = null; setCreateName(""); selectResult(value, kind === "personal" ? "个人知识库已创建。" : "团队知识库已创建，当前只有你一位成员。");
  }
  async function save(signal: AbortSignal) {
    if (!selected) return;
    selectResult(await client.updateLibrary(selected.id, { name: name.trim(), description, archived: selected.archived, expectedRevision: selected.revision }, signal), "资料库设置已保存。");
  }
  async function setArchived(signal: AbortSignal) {
    if (!selected) return;
    selectResult(await client.setLibraryArchived(selected.id, !selected.archived, selected.revision, signal), selected.archived ? "资料库已恢复。" : "资料库已归档。");
  }
  async function saveMember(signal: AbortSignal) {
    if (!selected || !userID.trim()) return;
    selectResult(await client.setMember(selected.id, userID.trim(), role, members?.revision ?? selected.revision, signal), "成员角色已保存，后续访问使用新权限。"); setUserID(""); setPrincipalQuery(""); setPrincipalResults([]); setAccessPreview(null);
  }
  async function removeMember(signal: AbortSignal) {
    if (!selected || !removeUserID) return;
    selectResult(await client.removeMember(selected.id, removeUserID, members?.revision ?? selected.revision, signal), "成员已移出资料库。"); setRemoveUserID("");
  }

  function selectLibrary(library: KnowledgeLibrary) {
    setSelectedID(library.id);
    setMemberCursors([""]);
    setLibraryView("content");
    setLibraryDialog(null);
  }

  function renderLibrary(library: KnowledgeLibrary) {
    return <button key={library.id} aria-current={selectedID === library.id ? "true" : undefined} disabled={blocked} onClick={() => selectLibrary(library)}><BookOpen size={18} /><span><strong>{library.name}</strong><small>{library.kind === "personal" ? "仅自己可见" : `${roles[library.role as KnowledgeLibraryMember["role"]] || library.role}权限`}{library.archived ? " · 已归档" : ""}</small></span></button>;
  }

  return <div className={`managed-library-browser${libraryKind === "personal" ? " is-personal" : ""}`}>
    <aside className="managed-library-list">
      <div><h2>{libraryKind === "personal" ? "个人知识库" : libraryKind === "shared" ? "团队知识库" : "知识库"}</h2><Button aria-label="刷新知识库" disabled={blocked || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} /></Button></div>
      {(canCreatePersonal || canCreateTeam) && <div className="knowledge-library-create">
        {canCreatePersonal && <Button disabled={blocked} onClick={() => void perform(signal => create("personal", signal))}><BookOpen size={15} />创建个人知识库</Button>}
        {canCreateTeam && <div><input aria-label="新团队知识库名称" maxLength={128} value={createName} disabled={blocked} onChange={event => setCreateName(event.target.value)} placeholder="新团队知识库名称" /><Button aria-label="创建团队知识库" disabled={blocked || !createName.trim()} onClick={() => void perform(signal => create("shared", signal))}><Plus size={15} /></Button></div>}
      </div>}
      {selected && !page.items.some(item => item.id === selected.id) && <button aria-current="true" disabled={blocked}><BookOpen size={18} /><span><strong>{selected.name}</strong><small>当前知识库 · 不在本页</small></span></button>}
      {loading ? <p className="knowledge-subtle">正在读取知识库…</p> : visibleLibraries.length ? visibleLibraries.map(renderLibrary) : <p className="knowledge-library-group-empty">{libraryKind === "personal" ? "尚未创建个人知识库" : libraryKind === "shared" ? "尚未加入团队知识库" : "暂无可访问的知识库"}</p>}
      {(libraryCursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || libraryCursors.length === 1} onClick={() => { setSelectedID(""); setLibraryCursors(value => value.slice(0, -1)); }}>上一页</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setSelectedID(""); setLibraryCursors(value => [...value, page.next_after!]); }}>下一页</Button></nav>}
      {error && <p role="alert" className="knowledge-error">{error}</p>}
    </aside>
    <section className="managed-library-content">{notice && <p role="status" className="knowledge-notice">{notice}</p>}{selected ? <>
      <div className={`knowledge-library-surface${libraryView === "search" ? " is-search" : " is-pages"}`}>
        {libraryView === "search" ? <RemoteKnowledgeBrowser key={`${selected.id}:${searchRevision}`} client={client} formatError={formatError} library={selected} initialQuery={searchQuery} hideSearchForm /> : <KnowledgePagesPanel client={client} library={selected} disabled={blocked} formatError={formatError} embedded onManage={selected.role === "manager" ? () => setLibraryDialog("manage") : undefined} documents={({ selectedDocumentID, showUploader, onDocumentsChange, onSelectedDocumentChange }) => <KnowledgeDocumentsPanel key={selected.id} client={client} initialLibrary={selected} formatError={formatError} onBusyChange={setDocumentBusy} onOpenLibrary={libraryID => { setSelectedID(libraryID); setMemberCursors([""]); setRefresh(value => value + 1); }} embedded hideList showUploader={showUploader} selectedDocumentID={selectedDocumentID} onSelectedDocumentChange={onSelectedDocumentChange} onDocumentsChange={onDocumentsChange} />} />}
      </div>
      {libraryDialog === "manage" && selected.role === "manager" && createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !blocked) setLibraryDialog(null); }}><section className="knowledge-manager-dialog knowledge-library-management-dialog" role="dialog" aria-modal="true" aria-label="知识库管理"><header><div><h2>管理“{selected.name}”</h2><p>维护知识库信息、成员权限与外部内容连接。</p></div><Button aria-label="关闭知识库管理" disabled={blocked} onClick={() => setLibraryDialog(null)}><X size={17} /></Button></header><div className="knowledge-dialog-scroll knowledge-management-sections">
        <section className="knowledge-settings"><header><div><h3>基本信息</h3><p>名称和说明会展示给所有知识库成员。</p></div></header><div className="knowledge-form-grid"><label>名称<input value={name} maxLength={128} disabled={blocked} onChange={event => setName(event.target.value)} /></label><label>说明<textarea value={description} maxLength={1024} disabled={blocked} onChange={event => setDescription(event.target.value)} /></label></div><div className="knowledge-actions"><Button className="primary" disabled={blocked || !name.trim()} onClick={() => void perform(save)}>保存信息</Button><Button className={selected.archived ? undefined : "danger"} disabled={blocked} onClick={() => void perform(setArchived)}>{selected.archived ? "恢复知识库" : "归档知识库"}</Button></div></section>
        {selected.kind === "shared" && <section className="knowledge-members"><header><div><h3>成员与角色</h3><p>阅读者可查看与评论，编辑者可维护内容，管理者负责成员及配置。至少保留一位管理者。</p></div></header><div className="knowledge-member-list">{members?.items.map(member => { const profile = memberProfiles[member.user_id]; return <div className="knowledge-member" key={member.user_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || "?").slice(0, 1)}</span><span>{profile?.display_name || "账号不可用"}<small>{profile?.email || member.user_id} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { setUserID(member.user_id); setPrincipalQuery(profile?.display_name || member.user_id); setRole(member.role); setRemoveUserID(""); }}>调整</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveUserID(member.user_id)}>移除</Button></div>; })}</div>{members && (memberCursors.length > 1 || !members.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || memberCursors.length === 1} onClick={() => setMemberCursors(value => value.slice(0, -1))}>上一页</Button><Button disabled={blocked || !members.next_after} onClick={() => setMemberCursors(value => [...value, members.next_after!])}>下一页</Button></nav>}<div className="knowledge-member-editor"><label>搜索工作区成员<input value={principalQuery} maxLength={255} disabled={blocked} onChange={event => { setPrincipalQuery(event.target.value); setUserID(""); }} placeholder="输入姓名或邮箱" /></label>{principalResults.length > 0 && <div className="knowledge-principal-results" role="listbox">{principalResults.map(principal => <button key={principal.user_id} role="option" aria-selected={userID === principal.user_id} onClick={() => { setUserID(principal.user_id); setPrincipalQuery(principal.display_name || principal.email || principal.user_id); setPrincipalResults([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}<label>角色<select value={role} disabled={blocked} onChange={event => setRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><Button className="primary" disabled={blocked || !userID} onClick={() => void perform(saveMember)}>保存成员角色</Button></div>{accessPreview && <div className="knowledge-access-preview"><strong>邀请前访问预览</strong><p>Identity 功能权限：{accessPreview.identity.allowed ? "允许" : "拒绝"}；拟授予知识库角色：{roles[role]}；影响 {accessPreview.impact_pages} 个活动页面。</p><p>最终页面阅读：{accessPreview.final.allowed ? "允许" : "拒绝"}。页面权限继承自知识库，不存在前端自算 ACL。</p></div>}{removeUserID && <div className="knowledge-confirm"><p>将“{memberProfiles[removeUserID]?.display_name || "账号不可用"}”移出“{selected.name}”？该成员将失去知识库访问权限。</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeMember)}>确认移除</Button><Button disabled={blocked} onClick={() => setRemoveUserID("")}>保留成员</Button></div></div>}</section>}
        {selected.sources_manageable && <KnowledgeSourcesPanel client={client} library={selected} disabled={busy || documentBusy} formatError={formatError} onBusyChange={setSourceBusy} onBound={value => { setSelected(value); setRefresh(current => current + 1); }} />}
        {error && <p role="alert" className="knowledge-error">{error}</p>}
      </div></section></div>, window.document.body)}
    </> : !loading ? <EmptyState><FolderOpen size={32} /><h3>{visibleLibraries.length > 0 ? "请选择知识库" : libraryKind === "personal" ? "还没有个人知识库" : "还没有可访问的团队知识库"}</h3><p>{libraryKind === "personal" ? "打开个人知识库后，可在自己的空间内检索、编辑和整理内容。" : "创建团队知识库，或请团队管理员将你添加为成员。"}</p></EmptyState> : null}</section>
  </div>;
}

export function KnowledgeLibraryManagerDialog({ client, formatError = defaultErrorMessage, onClose }: { client: KnowledgeClient; formatError?: (error: unknown) => string; onClose(): void }) {
  const [libraryKind, setLibraryKind] = useState<"personal" | "shared">("personal");
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation"><section className="knowledge-manager-dialog" role="dialog" aria-modal="true" aria-label="知识库"><header><div><h2>知识库</h2><p>个人知识库仅自己可见；团队知识库按成员角色共同维护。</p></div><Button aria-label="关闭" onClick={onClose}><X size={17} /></Button></header><div className="knowledge-workspace-tabs" role="tablist" aria-label="知识库范围"><button role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={17} /><span>个人知识库</span></button><button role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={17} /><span>团队知识库</span></button></div><KnowledgeLibraryManager key={libraryKind} client={client} formatError={formatError} libraryKind={libraryKind} /></section></div>, window.document.body);
}
