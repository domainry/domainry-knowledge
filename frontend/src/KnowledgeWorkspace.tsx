import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { BookOpen, ChevronRight, FileSearch, FileText, Filter, FolderOpen, RefreshCw, Search, Users, X } from "lucide-react";
import { Button, defaultErrorMessage, EmptyState, Select } from "./components.tsx";
import { KnowledgeSourcesPanel } from "./KnowledgeSourcesPanel.tsx";
import { KnowledgePagesPanel } from "./KnowledgePagesPanel.tsx";
import { createKnowledgePageLink, parseKnowledgeDeepLink } from "./knowledge-links.ts";
import { PageTypeIcon, pageTypeDefinitions, pageTypeMeta } from "./pageTypeRegistry.ts";
import { knowledgeCitations, knowledgeDocumentHits, knowledgeSearchStatus } from "./search-results.ts";
import type { KnowledgeAccessExplanation, KnowledgeCitation, KnowledgeClient, KnowledgeLibrary, KnowledgeLibraryMember, KnowledgeLibraryMemberPage, KnowledgeLibraryOrganizationMemberPage, KnowledgeLibraryPage, KnowledgeOrganizationPrincipal, KnowledgePageContentType, KnowledgePageSearchHit, KnowledgePageSearchInput, KnowledgePageSearchLocation, KnowledgePageSearchPage, KnowledgePrincipal, KnowledgeResult } from "./types.ts";
import { KnowledgeCreateMenu } from "./KnowledgeCreateMenu.tsx";

export type KnowledgeWorkspaceProps = {
  client: KnowledgeClient;
  currentUserID?: string;
  formatError?: (error: unknown) => string;
  headerSearchHost?: HTMLElement | null;
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

export function KnowledgeWorkspace({ client, currentUserID = "", formatError = defaultErrorMessage, headerSearchHost }: KnowledgeWorkspaceProps) {
  const initialDeepLink = useMemo(() => typeof window === "undefined" ? null : parseKnowledgeDeepLink(window.location.href), []);
  const [libraryKind, setLibraryKind] = useState<"personal" | "shared">(initialDeepLink?.libraryKind || "personal");
  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState({ query: "", revision: 0 });
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const openGlobalSearch = useCallback(() => {
    setSearchExpanded(true);
    window.setTimeout(() => { searchInputRef.current?.focus(); searchInputRef.current?.select(); });
  }, []);
  useEffect(() => {
    const focusGlobalSearch = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLocaleLowerCase() !== "k") return;
      event.preventDefault();
      openGlobalSearch();
    };
    window.addEventListener("keydown", focusGlobalSearch);
    return () => window.removeEventListener("keydown", focusGlobalSearch);
  }, [openGlobalSearch]);
  const scopeNavigation = <nav className="knowledge-workspace-tabs knowledge-primary-scope-tabs" role="tablist" aria-label="知识库范围">
    <button type="button" role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={16} /><span><strong>个人</strong></span></button>
    <button type="button" role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={16} /><span><strong>团队</strong></span></button>
  </nav>;
  const searchControl = <div className={`knowledge-header-search${searchExpanded ? " is-expanded" : ""}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !searchInput.trim()) setSearchExpanded(false); }}>
    <button type="button" className="knowledge-header-search-toggle" aria-label="展开全文检索" title="搜索（⌘/Ctrl + K）" aria-expanded={searchExpanded} onClick={openGlobalSearch}><Search size={18} aria-hidden="true" /></button>
    <form className="knowledge-global-search" role="search" onSubmit={event => { event.preventDefault(); const query = searchInput.trim(); if (query) setSearchRequest(current => ({ query, revision: current.revision + 1 })); }}><Search size={16} aria-hidden="true" /><input ref={searchInputRef} aria-label="全文检索当前知识库" aria-keyshortcuts="Meta+K Control+K" value={searchInput} maxLength={4096} onChange={event => setSearchInput(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && !searchInput.trim()) { event.currentTarget.blur(); setSearchExpanded(false); } }} placeholder="搜索当前知识库" />{searchRequest.query && <Button type="button" aria-label="清除全文检索" onClick={() => { setSearchInput(""); setSearchRequest(current => ({ query: "", revision: current.revision + 1 })); }}><X size={14} /></Button>}<Button type="submit" className="primary" disabled={!searchInput.trim()}>搜索</Button></form>
  </div>;
  return <main className="knowledge-workspace">
    {headerSearchHost && createPortal(searchControl, headerSearchHost)}
    <KnowledgeLibraryManager key={libraryKind} client={client} currentUserID={currentUserID} formatError={formatError} initialLibraryID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.libraryID : ""} initialPageID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.pageID : ""} initialBlockID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.blockID : undefined} initialPageMode={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.mode : "read"} libraryKind={libraryKind} scopeTabs={scopeNavigation} searchQuery={searchRequest.query} searchRevision={searchRequest.revision} />
  </main>;
}

type PageSearchFilters = {
	scope: "library" | "subtree";
  contentType: "" | KnowledgePageContentType;
  authorUserID: string;
  updatedAfter: string;
  updatedBefore: string;
  tags: string;
  path: string;
  publicationStatus: "" | "published" | "unpublished";
};

const emptyPageSearchFilters: PageSearchFilters = { scope: "library", contentType: "", authorUserID: "", updatedAfter: "", updatedBefore: "", tags: "", path: "", publicationStatus: "" };

function localDateBoundary(value: string, end: boolean) {
  if (!value) return undefined;
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function pageSearchRequest(query: string, filters: PageSearchFilters, subtreeRoot?: { pageID: string; title: string } | null): KnowledgePageSearchInput {
  return {
    query,
    content_types: filters.contentType ? [filters.contentType] : [],
    author_user_ids: filters.authorUserID.trim() ? [filters.authorUserID.trim()] : [],
    updated_after: localDateBoundary(filters.updatedAfter, false),
    updated_before: localDateBoundary(filters.updatedBefore, true),
    tags: [...new Set(filters.tags.split(/[，,]/).map(tag => tag.trim()).filter(Boolean))],
    path_query: filters.path.trim() || undefined,
		ancestor_page_id: filters.scope === "subtree" ? subtreeRoot?.pageID : undefined,
    publication_statuses: filters.publicationStatus ? [filters.publicationStatus] : [],
    limit: 100,
  };
}

function pageSearchHasFilters(filters: PageSearchFilters) {
	return filters.scope === "subtree" || Object.entries(filters).some(([key, value]) => key !== "scope" && !!value);
}

function recentSearchKey(userID: string, libraryID: string) {
	return `knowledge.page-search.recent.v1:${encodeURIComponent(userID || "anonymous")}:${encodeURIComponent(libraryID)}`;
}

function readRecentSearches(userID: string, libraryID: string) {
	if (typeof window === "undefined") return [] as string[];
	try {
		const value = JSON.parse(window.localStorage.getItem(recentSearchKey(userID, libraryID)) || "[]");
		return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0 && item.length <= 512).slice(0, 10) : [];
	} catch { return []; }
}

function saveRecentSearch(userID: string, libraryID: string, query: string) {
	const normalized = query.trim();
	if (!normalized || typeof window === "undefined") return readRecentSearches(userID, libraryID);
	const next = [normalized, ...readRecentSearches(userID, libraryID).filter(item => item.toLocaleLowerCase() !== normalized.toLocaleLowerCase())].slice(0, 10);
	try { window.localStorage.setItem(recentSearchKey(userID, libraryID), JSON.stringify(next)); } catch { /* Private browsing can reject storage; search still works. */ }
	return next;
}

function pageSearchLocationLabel(hit: KnowledgePageSearchHit) {
  if (hit.location.kind === "block") return `内容块 ${hit.location.block_id || ""}`.trim();
  if (hit.location.kind === "cell") {
    if (hit.location.cell) return `${hit.location.sheet_id ? `${hit.location.sheet_id} · ` : ""}单元格 ${hit.location.cell}`;
    return `记录 ${hit.location.record_id || ""} · 字段 ${hit.location.field_id || ""}`;
  }
  if (hit.location.kind === "node") return `节点 ${hit.location.node_id || ""}`.trim();
  return "页面信息";
}

function pageSearchIndexLabel(status: KnowledgePageSearchHit["index_status"]) {
  return ({ none: "未索引", queued: "等待索引", indexing: "索引中", ready: "已索引", failed: "索引失败" } as const)[status];
}

function PageSearchBrowser({ client, formatError, library, currentUserID, initialQuery, subtreeRoot, onOpen }: { client: KnowledgeClient; formatError: (error: unknown) => string; library: KnowledgeLibrary; currentUserID: string; initialQuery: string; subtreeRoot?: { pageID: string; title: string } | null; onOpen: (hit: KnowledgePageSearchHit) => void }) {
  const [filters, setFilters] = useState<PageSearchFilters>(emptyPageSearchFilters);
  const [appliedFilters, setAppliedFilters] = useState<PageSearchFilters>(emptyPageSearchFilters);
	const [query, setQuery] = useState(initialQuery.trim());
	const [recentSearches, setRecentSearches] = useState(() => readRecentSearches(currentUserID, library.id));
  const [revision, setRevision] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [result, setResult] = useState<KnowledgePageSearchPage | null>(null);
  const [loading, setLoading] = useState(false), [error, setError] = useState("");
  const [aclReady, setACLReady] = useState(!client.streamKnowledgePageSearchEvents);
	useEffect(() => setQuery(initialQuery.trim()), [initialQuery]);
  useEffect(() => {
    if (!client.streamKnowledgePageSearchEvents) { setACLReady(true); return; }
    const abort = new AbortController();
    let afterRevision = 0, failures = 0, stopped = false;
    setACLReady(false);
    const reconnect = async () => {
      while (!abort.signal.aborted && !stopped) {
        try {
          await client.streamKnowledgePageSearchEvents!(library.id, afterRevision, event => {
				afterRevision = event.revision;
            if (event.type === "revoked") {
              stopped = true; setACLReady(false); setResult(null); setLoading(false); setError("当前知识库访问权限已撤销。"); abort.abort(); return;
            }
            setACLReady(true);
            if (event.type === "changed") { setResult(null); setRevision(value => value + 1); }
          }, abort.signal);
          if (!abort.signal.aborted) { setACLReady(false); setResult(null); setRevision(value => value + 1); }
          failures = 0;
        } catch {
          if (abort.signal.aborted) return;
          setACLReady(false); setResult(null);
          failures += 1;
          await new Promise(resolve => window.setTimeout(resolve, Math.min(5000, 250 * 2 ** Math.min(failures - 1, 5))));
          afterRevision = 0;
        }
      }
    };
    void reconnect();
    return () => abort.abort();
  }, [client, library.id]);
  useEffect(() => {
		const normalizedQuery = query.trim();
    if (!aclReady) return;
		if (!normalizedQuery && !pageSearchHasFilters(appliedFilters)) { setResult(null); return; }
    const abort = new AbortController();
    setLoading(true); setError(""); setResult(null);
		void client.searchPages(library.id, pageSearchRequest(normalizedQuery, appliedFilters, subtreeRoot), abort.signal)
			.then(value => { if (!abort.signal.aborted) { setResult(value); if (normalizedQuery) setRecentSearches(saveRecentSearch(currentUserID, library.id, normalizedQuery)); } })
      .catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
	}, [aclReady, appliedFilters, client, currentUserID, formatError, library.id, query, revision, subtreeRoot]);
	const activeFilterCount = Object.entries(appliedFilters).filter(([key, value]) => key === "scope" ? value === "subtree" : !!value).length;
  return <section className="knowledge-page-search" aria-label={`全文检索「${library.name}」`}>
    <header className="knowledge-page-search-header"><div><span><FileSearch size={19} /></span><div><h2>全文检索「{library.name}」</h2><p>只返回你当前有权读取的页面、文件和原生应用。</p></div></div><div className="knowledge-page-search-header-actions"><Button aria-expanded={showFilters} aria-controls="knowledge-page-search-filters" onClick={() => setShowFilters(value => !value)}><Filter size={15} />筛选{activeFilterCount ? ` ${activeFilterCount}` : ""}</Button></div></header>
    {showFilters && <form id="knowledge-page-search-filters" className="knowledge-page-search-filters" onSubmit={event => { event.preventDefault(); setAppliedFilters({ ...filters }); setRevision(value => value + 1); }}>
		<label><span>检索范围</span><Select value={filters.scope} onChange={event => setFilters(current => ({ ...current, scope: event.target.value as PageSearchFilters["scope"] }))}><option value="library">当前知识库</option><option value="subtree" disabled={!subtreeRoot}>当前页面与子树{subtreeRoot ? `：${subtreeRoot.title}` : "（请先打开页面）"}</option></Select></label>
      <label><span>内容类型</span><Select value={filters.contentType} onChange={event => setFilters(current => ({ ...current, contentType: event.target.value as PageSearchFilters["contentType"] }))}><option value="">全部类型</option>{pageTypeDefinitions.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</Select></label>
      <label><span>作者账号</span><input value={filters.authorUserID} onChange={event => setFilters(current => ({ ...current, authorUserID: event.target.value }))} placeholder="用户 ID" /></label>
      <label><span>更新开始</span><input type="date" value={filters.updatedAfter} onChange={event => setFilters(current => ({ ...current, updatedAfter: event.target.value }))} /></label>
      <label><span>更新结束</span><input type="date" value={filters.updatedBefore} onChange={event => setFilters(current => ({ ...current, updatedBefore: event.target.value }))} /></label>
      <label><span>标签</span><input value={filters.tags} onChange={event => setFilters(current => ({ ...current, tags: event.target.value }))} placeholder="多个标签用逗号分隔" /></label>
      <label><span>页面路径</span><input value={filters.path} onChange={event => setFilters(current => ({ ...current, path: event.target.value }))} placeholder="例如：产品 / 运行手册" /></label>
      <label><span>发布状态</span><Select value={filters.publicationStatus} onChange={event => setFilters(current => ({ ...current, publicationStatus: event.target.value as PageSearchFilters["publicationStatus"] }))}><option value="">全部状态</option><option value="published">已发布</option><option value="unpublished">未发布</option></Select></label>
      <div className="knowledge-page-search-filter-actions"><Button type="button" onClick={() => { setFilters(emptyPageSearchFilters); setAppliedFilters(emptyPageSearchFilters); setRevision(value => value + 1); }}>重置</Button><Button type="submit" className="primary">应用筛选</Button></div>
    </form>}
		{recentSearches.length > 0 && <div className="knowledge-page-search-recent" aria-label="最近搜索"><span>最近搜索</span>{recentSearches.map(item => <button key={item} type="button" aria-pressed={query === item} onClick={() => { setQuery(item); setRevision(value => value + 1); }}>{item}</button>)}<button type="button" className="is-clear" onClick={() => { try { window.localStorage.removeItem(recentSearchKey(currentUserID, library.id)); } catch { /* ignore */ } setRecentSearches([]); }}>清除</button></div>}
    {!aclReady && !error && <div className="knowledge-page-search-state"><RefreshCw className="knowledge-spin" size={25} /><p>正在确认实时访问权限…</p></div>}
    {aclReady && loading && <div className="knowledge-page-search-state"><RefreshCw className="knowledge-spin" size={25} /><p>正在检索当前权限范围…</p></div>}
    {error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}
    {aclReady && !loading && !error && result && <><div className="knowledge-page-search-summary"><strong>{result.items.length} 个结果</strong><span>{result.truncated ? "结果较多，已显示前 100 条" : "已按相关度与更新时间排序"}</span></div>{result.items.length ? <div className="knowledge-page-search-results">{result.items.map(hit => <button key={hit.page_id} type="button" onClick={() => onOpen(hit)}>
      <span className={`knowledge-page-search-type is-${hit.kind}`}><PageTypeIcon type={hit.content_type} size={19} /></span>
      <span className="knowledge-page-search-copy"><strong>{hit.title}</strong><small>{hit.path.map(item => item.title).join(" / ")}</small>{hit.excerpt && <p>{hit.excerpt}</p>}<em>{pageSearchLocationLabel(hit)}</em></span>
      <span className="knowledge-page-search-meta"><b>{hit.kind === "file" ? "文件" : hit.kind === "page" ? "页面" : "原生应用"} · {pageTypeMeta[hit.content_type].label}</b><small>{hit.author_user_id} · {hit.published_version ? `版本 ${hit.published_version}` : "未发布"}</small><small className={`is-index-${hit.index_status}`}>{pageSearchIndexLabel(hit.index_status)}</small><ChevronRight size={16} /></span>
    </button>)}</div> : <EmptyState><FileSearch size={30} /><h3>没有匹配结果</h3><p>可以减少筛选条件，或换一个更具体的关键词。</p></EmptyState>}</>}
		{aclReady && !loading && !error && !result && <EmptyState><FileSearch size={30} /><h3>从顶部输入关键词</h3><p>搜索页面标题、路径、标签以及已经发布的正文内容。</p></EmptyState>}
  </section>;
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
  return <div className="knowledge-browser-body"><section className="knowledge-search-column"><div className="knowledge-page-intro"><span><FileSearch size={22} /></span><div><h2>{library ? `全文检索「${library.name}」` : "全文检索"}</h2><p>{library ? "搜索当前知识库内有权读取的页面与文档。" : "选择默认知识源或一座资料库，再输入主题、问题或关键词。"}</p></div></div>{!library && <label className="knowledge-search-scope"><span>检索范围</span><Select value={libraryID} onChange={event => setLibraryID(event.target.value)}><option value="">默认知识源</option>{libraries.map(item => <option key={item.id} value={item.id}>{item.name}{item.archived ? "（已归档）" : ""}</option>)}</Select></label>}{scopeNotice && <p className="knowledge-subtle">{scopeNotice}</p>}{!hideSearchForm && <form className="knowledge-search-form" onSubmit={event => { event.preventDefault(); const value = input.trim(); if (value) { setQuery(value); setSearchRevision(current => current + 1); } }}><Search size={18} /><input aria-label="搜索知识库" value={input} maxLength={4096} onChange={event => setInput(event.target.value)} placeholder="输入主题、问题或关键词" /><Button type="submit" disabled={loading || !input.trim()}>{loading ? "正在检索…" : "搜索"}</Button></form>}{searchStatus?.summary && <p className="knowledge-subtle">检索策略：{searchStatus.summary}</p>}{searchStatus?.degraded && <p role="status" className="knowledge-notice">{searchStatus.degraded}</p>}{error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}{!query && <EmptyState><FileSearch size={30} /><h3>从一个问题开始</h3><p>知识服务只返回当前账号在所选范围内有权读取的内容。</p></EmptyState>}{query && !loading && result && hits.length === 0 && <EmptyState><FileText size={30} /><h3>没有可展示的文档</h3><p>没有命中相关内容，可以换一个更具体的关键词或检索范围。</p></EmptyState>}{hits.length > 0 && <div className="knowledge-hit-list">{hits.map(hit => <button key={`${hit.library_id || libraryID || "default"}:${hit.doc_id}`} aria-current={selected?.doc_id === hit.doc_id && (selected.library_id || libraryID || "") === (hit.library_id || libraryID || "") ? "true" : undefined} onClick={() => void read(hit)}><span className="knowledge-hit-icon"><FileText size={19} /></span><span><strong>{hit.title || hit.doc_id}</strong><small>{hit.excerpt || "打开查看文档内容"}</small><em>文档编号：{hit.doc_id}{hit.matchedPassages > 1 ? ` · 命中 ${hit.matchedPassages} 个片段` : ""}{citationLocation(hit) ? ` · ${citationLocation(hit)}` : ""}</em>{citationProvenance(hit) && <em>{citationProvenance(hit)}</em>}</span></button>)}</div>}</section><aside className="knowledge-reader" aria-label="文档阅读区">{!selected ? <EmptyState><FileText size={34} /><h3>选择一份文档查看</h3><p>搜索结果会在这里展开。</p></EmptyState> : reading ? <EmptyState><RefreshCw className="knowledge-spin" size={28} /><p>正在读取文档…</p></EmptyState> : current ? <><header><span className="knowledge-reader-icon"><FileText size={20} /></span><div><h2>{selected.title || current.doc_id || selected.doc_id}</h2><p>文档编号：{current.doc_id || selected.doc_id}{current.kb_id ? ` · 知识库 ${current.kb_id}` : ""}</p></div></header>{passages.length ? <article className="knowledge-passages">{passages.map((passage, index) => <section key={passage.id || `${passage.doc_id}:${passage.chunk_id || index}`}><small>片段 {index + 1}{citationLocation(passage) ? ` · ${citationLocation(passage)}` : ""}{passage.excerpt_truncated ? " · 内容已截断" : ""}</small>{citationProvenance(passage) && <small>{citationProvenance(passage)}</small>}<p>{passage.excerpt || "此片段没有可展示的正文。"}</p></section>)}</article> : <div className="knowledge-raw-document"><p>知识服务返回了文档，但没有生成可展示的正文片段。</p></div>}{safeURL(selected.url) && <a className="knowledge-source-link" href={safeURL(selected.url)} target="_blank" rel="noopener noreferrer">打开来源链接 ↗</a>}</> : <EmptyState><FileText size={34} /><h3>文档暂时无法显示</h3><p>请重新选择搜索结果。</p></EmptyState>}</aside></div>;
}

export function KnowledgeLibraryManager({ client, currentUserID = "", formatError = defaultErrorMessage, initialLibraryID = "", initialPageID = "", initialBlockID, initialPageMode = "read", libraryKind, scopeTabs, searchQuery = "", searchRevision = 0 }: { client: KnowledgeClient; currentUserID?: string; formatError?: (error: unknown) => string; initialLibraryID?: string; initialPageID?: string; initialBlockID?: string; initialPageMode?: "read" | "edit"; libraryKind?: "personal" | "shared"; scopeTabs?: ReactNode; searchQuery?: string; searchRevision?: number }) {
  const [page, setPage] = useState<KnowledgeLibraryPage>({ items: [], complete: true });
  const [libraryCursors, setLibraryCursors] = useState([""]);
  const [selectedID, setSelectedID] = useState(initialLibraryID), [selected, setSelected] = useState<KnowledgeLibrary | null>(null);
  const [refresh, setRefresh] = useState(0), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [name, setName] = useState(""), [description, setDescription] = useState("");
  const [members, setMembers] = useState<KnowledgeLibraryMemberPage | null>(null), [memberCursors, setMemberCursors] = useState([""]);
  const [organizationMembers, setOrganizationMembers] = useState<KnowledgeLibraryOrganizationMemberPage | null>(null), [organizationMemberCursors, setOrganizationMemberCursors] = useState([""]);
  const [userID, setUserID] = useState(""), [role, setRole] = useState<KnowledgeLibraryMember["role"]>("reader"), [removeUserID, setRemoveUserID] = useState("");
  const [organizationID, setOrganizationID] = useState(""), [organizationRole, setOrganizationRole] = useState<KnowledgeLibraryMember["role"]>("reader"), [removeOrganizationID, setRemoveOrganizationID] = useState("");
  const [principalQuery, setPrincipalQuery] = useState(""), [principalResults, setPrincipalResults] = useState<KnowledgePrincipal[]>([]), [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({});
  const [organizationProfiles, setOrganizationProfiles] = useState<Record<string, KnowledgeOrganizationPrincipal>>({});
  const [accessPreview, setAccessPreview] = useState<KnowledgeAccessExplanation | null>(null);
  const [sourceBusy, setSourceBusy] = useState(false);
  const [libraryView, setLibraryView] = useState<"content" | "search">("content");
  const [searchTarget, setSearchTarget] = useState<{ pageID: string; mode: "read" | "edit"; location: KnowledgePageSearchLocation; revision: number } | null>(null);
	const [currentPage, setCurrentPage] = useState<{ pageID: string; title: string } | null>(null);
  const [libraryDialog, setLibraryDialog] = useState<"manage" | null>(null);
  const createReceipt = useRef<{ kind: "personal" | "shared"; name: string; clientID: string } | null>(null), lock = useRef(false);
  const blocked = busy || sourceBusy, libraryCursor = libraryCursors.at(-1) || "", memberCursor = memberCursors.at(-1) || "", organizationMemberCursor = organizationMemberCursors.at(-1) || "";
  const visibleLibraries = libraryKind ? page.items.filter(library => library.kind === libraryKind) : page.items;
  const canCreatePersonal = libraryKind !== "shared" && !loading && !page.items.some(item => item.kind === "personal");

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
      setPage(value); setSelectedID(current => current && (current === initialLibraryID || value.items.some(item => item.id === current && (!libraryKind || item.kind === libraryKind))) ? current : value.items.find(item => !libraryKind || item.kind === libraryKind)?.id || "");
    })().catch(failure => { if (!abort.signal.aborted) { setPage({ items: [], complete: true }); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, initialLibraryID, libraryCursor, libraryKind, refresh]);

  useEffect(() => {
    setMembers(null); setOrganizationMembers(null); setRemoveUserID(""); setRemoveOrganizationID("");
    if (!selectedID) { setSelected(null); return; }
    const abort = new AbortController();
    void client.getLibrary(selectedID, abort.signal).then(async value => {
      if (abort.signal.aborted) return;
      setSelected(value); setName(value.name); setDescription(value.description);
      if (value.role === "manager" && value.kind === "shared") {
        const [direct, organizations] = await Promise.all([
          client.listMembers(value.id, memberCursor, 20, abort.signal),
          client.listOrganizationMembers(value.id, organizationMemberCursor, 20, abort.signal),
        ]);
        setMembers(direct); setOrganizationMembers(organizations);
      }
    }).catch(failure => { if (!abort.signal.aborted) { setSelected(null); setMembers(null); setOrganizationMembers(null); setError(formatError(failure)); } });
    return () => abort.abort();
  }, [client, formatError, memberCursor, organizationMemberCursor, refresh, selectedID]);

  useEffect(() => {
    if (!members?.items.length) { setMemberProfiles({}); return; }
    const abort = new AbortController();
    void client.resolvePrincipals(members.items.map(member => member.user_id), abort.signal).then(items => {
	  if (!abort.signal.aborted) setMemberProfiles(Object.fromEntries(items.filter(item => item.status === "active").map(item => [item.user_id, item])));
    }).catch(() => { if (!abort.signal.aborted) setMemberProfiles({}); });
    return () => abort.abort();
  }, [client, members]);

  useEffect(() => {
    if (!organizationMembers?.items.length) { setOrganizationProfiles({}); return; }
    const abort = new AbortController();
    void client.resolveOrganizationPrincipals(organizationMembers.items.map(member => member.organization_id), abort.signal).then(items => {
      if (!abort.signal.aborted) setOrganizationProfiles(Object.fromEntries(items.map(item => [item.organization_id, item])));
    }).catch(() => { if (!abort.signal.aborted) setOrganizationProfiles({}); });
    return () => abort.abort();
  }, [client, organizationMembers]);

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
    if (lock.current || sourceBusy) return;
    lock.current = true; setBusy(true); setError(""); setNotice("");
    try { await action(AbortSignal.timeout(60_000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); setRefresh(value => value + 1); }
  }
  function selectResult(value: KnowledgeLibrary, message: string) { setSelectedID(value.id); setSelected(value); setMemberCursors([""]); setOrganizationMemberCursors([""]); setNotice(message); }
  async function createPersonalLibrary(signal: AbortSignal) {
    const title = "个人知识库";
    const pending = createReceipt.current;
    const input = pending?.kind === "personal" ? pending : { kind: "personal" as const, name: title, clientID: crypto.randomUUID() };
    createReceipt.current = input;
    const value = await client.createLibrary(input, signal);
    createReceipt.current = null; selectResult(value, "个人知识库已创建。");
  }
  async function createSharedLibrary(signal: AbortSignal) {
    const pending = createReceipt.current;
    const input = pending?.kind === "shared" ? pending : { kind: "shared" as const, name: "未命名知识库", clientID: crypto.randomUUID() };
    createReceipt.current = input;
    const value = await client.createLibrary(input, signal);
    createReceipt.current = null; selectResult(value, "团队知识库已创建，可在设置中修改名称。");
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
  async function saveOrganizationMember(signal: AbortSignal) {
    if (!selected || !organizationID.trim()) return;
    const normalized = organizationID.trim();
    const [principal] = await client.resolveOrganizationPrincipals([normalized], signal);
    if (!principal || principal.organization_id !== normalized || principal.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
    selectResult(await client.setOrganizationMember(selected.id, normalized, organizationRole, organizationMembers?.revision ?? selected.revision, signal), "组织角色已保存，后续访问按 Identity 实时组织归属计算。");
    setOrganizationProfiles(current => ({ ...current, [normalized]: principal })); setOrganizationID("");
  }
  async function removeOrganizationMember(signal: AbortSignal) {
    if (!selected || !removeOrganizationID) return;
    selectResult(await client.removeOrganizationMember(selected.id, removeOrganizationID, organizationMembers?.revision ?? selected.revision, signal), "组织已移出知识库，相关页面授权和在线会话已撤销。"); setRemoveOrganizationID("");
  }

  function selectLibrary(library: KnowledgeLibrary) {
    setSelectedID(library.id);
    setMemberCursors([""]);
    setOrganizationMemberCursors([""]);
    setSearchTarget(null);
    setLibraryView("content");
    setLibraryDialog(null);
		setCurrentPage(null);
  }
	const updateCurrentPage = useCallback((page: { id: string; title: string; mode: "read" | "edit" } | null) => {
		setCurrentPage(page ? { pageID: page.id, title: page.title } : null);
		if (!page || !selected || typeof window === "undefined") return;
		const href = createKnowledgePageLink(window.location.href, {
			libraryID: selected.id,
			libraryKind: selected.kind,
			pageID: page.id,
			mode: page.mode,
		});
		if (href !== window.location.href) window.history.replaceState(window.history.state, "", href);
	}, [selected]);

  function renderLibrary(library: KnowledgeLibrary) {
    return <button key={library.id} aria-current={selectedID === library.id ? "true" : undefined} disabled={blocked} onClick={() => selectLibrary(library)}><BookOpen size={18} /><span><strong>{library.name}</strong><small>{library.kind === "personal" ? "仅自己可见" : `${roles[library.role as KnowledgeLibraryMember["role"]] || library.role}权限`}{library.archived ? " · 已归档" : ""}</small></span></button>;
  }

  const revealLibraryRail = (!loading && !selected) || libraryView === "search";
  const scopeTabsInLibraryRail = revealLibraryRail;
  const selectableTeamLibraries = libraryKind === "shared" && selected && !visibleLibraries.some(item => item.id === selected.id) ? [selected, ...visibleLibraries] : visibleLibraries;
  const emptySharedLibraryPicker = libraryKind === "shared" && !loading && !selected && visibleLibraries.length === 0;

  return <div className={`managed-library-browser${revealLibraryRail ? " has-library-rail" : ""}`}>
    <aside className="managed-library-list">
      {scopeTabsInLibraryRail && scopeTabs}
      {emptySharedLibraryPicker ? <div className="knowledge-team-library-picker knowledge-empty-team-library-picker"><Select aria-label="团队知识库" disabled><option>团队知识库</option></Select><KnowledgeCreateMenu disabled={blocked} canCreatePage={false} onCreateLibrary={() => void perform(createSharedLibrary)} /></div> : <div className="knowledge-library-list-header"><h2>{libraryKind === "personal" ? "个人知识库" : libraryKind === "shared" ? "团队知识库" : "知识库"}</h2><Button aria-label="刷新知识库" disabled={blocked || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} /></Button></div>}
      {canCreatePersonal && <div className="knowledge-library-create"><Button disabled={blocked} onClick={() => void perform(createPersonalLibrary)}><BookOpen size={15} />创建个人知识库</Button></div>}
      {selected && !page.items.some(item => item.id === selected.id) && <button aria-current="true" disabled={blocked}><BookOpen size={18} /><span><strong>{selected.name}</strong><small>当前知识库 · 不在本页</small></span></button>}
      {loading ? <p className="knowledge-subtle">正在读取知识库…</p> : visibleLibraries.length ? visibleLibraries.map(renderLibrary) : <p className="knowledge-library-group-empty">{libraryKind === "personal" ? "尚未创建个人知识库" : libraryKind === "shared" ? "尚未加入团队知识库" : "暂无可访问的知识库"}</p>}
      {(libraryCursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || libraryCursors.length === 1} onClick={() => { setSelectedID(""); setLibraryCursors(value => value.slice(0, -1)); }}>上一页</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setSelectedID(""); setLibraryCursors(value => [...value, page.next_after!]); }}>下一页</Button></nav>}
      {error && <p role="alert" className="knowledge-error">{error}</p>}
    </aside>
    <section className="managed-library-content">{notice && <p role="status" className="knowledge-notice">{notice}</p>}{selected ? <>
      <div className={`knowledge-library-surface${libraryView === "search" ? " is-search" : " is-pages"}`}>
          {libraryView === "search" ? <PageSearchBrowser key={`${selected.id}:${searchRevision}`} client={client} formatError={formatError} library={selected} currentUserID={currentUserID} initialQuery={searchQuery} subtreeRoot={currentPage} onOpen={hit => { setSearchTarget(current => ({ pageID: hit.page_id, mode: hit.publication_status === "unpublished" ? "edit" : "read", location: hit.location, revision: (current?.revision || 0) + 1 })); setLibraryView("content"); }} /> : <KnowledgePagesPanel key={`${selected.id}:${searchTarget?.revision || 0}`} client={client} library={selected} currentUserID={currentUserID} disabled={blocked} formatError={formatError} embedded initialPageID={searchTarget?.pageID || (selected.id === initialLibraryID ? initialPageID : "")} initialBlockID={!searchTarget && selected.id === initialLibraryID ? initialBlockID : undefined} initialSearchLocation={searchTarget?.location} initialPageMode={searchTarget?.mode || (selected.id === initialLibraryID ? initialPageMode : "read")} scopeTabs={!scopeTabsInLibraryRail ? scopeTabs : undefined} teamLibraries={libraryKind === "shared" ? selectableTeamLibraries : undefined} onLibrarySelect={libraryID => { const library = selectableTeamLibraries.find(item => item.id === libraryID); if (library) selectLibrary(library); }} onCreateLibrary={libraryKind === "shared" ? () => void perform(createSharedLibrary) : undefined} onSelectionChange={updateCurrentPage} onManage={selected.role === "manager" ? () => setLibraryDialog("manage") : undefined} />}
      </div>
      {libraryDialog === "manage" && selected.role === "manager" && createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !blocked) setLibraryDialog(null); }}><section className="knowledge-manager-dialog knowledge-library-management-dialog" role="dialog" aria-modal="true" aria-label="知识库管理"><header><div><h2>管理“{selected.name}”</h2><p>维护知识库信息、成员权限与外部内容连接。</p></div><Button aria-label="关闭知识库管理" disabled={blocked} onClick={() => setLibraryDialog(null)}><X size={17} /></Button></header><div className="knowledge-dialog-scroll knowledge-management-sections">
        <section className="knowledge-settings"><header><div><h3>基本信息</h3><p>名称和说明会展示给所有知识库成员。</p></div></header><div className="knowledge-form-grid"><label>名称<input value={name} maxLength={128} disabled={blocked} onChange={event => setName(event.target.value)} /></label><label>说明<textarea value={description} maxLength={1024} disabled={blocked} onChange={event => setDescription(event.target.value)} /></label></div><div className="knowledge-actions"><Button className="primary" disabled={blocked || !name.trim()} onClick={() => void perform(save)}>保存信息</Button><Button className={selected.archived ? undefined : "danger"} disabled={blocked} onClick={() => void perform(setArchived)}>{selected.archived ? "恢复知识库" : "归档知识库"}</Button></div></section>
        {selected.kind === "shared" && <section className="knowledge-members"><header><div><h3>成员与角色</h3><p>阅读者可查看与评论，编辑者可维护内容，管理者负责成员及配置。至少保留一位管理者。</p></div></header><div className="knowledge-member-list">{members?.items.map(member => { const profile = memberProfiles[member.user_id]; return <div className="knowledge-member" key={member.user_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || "?").slice(0, 1)}</span><span>{profile?.display_name || "账号不可用"}<small>{profile?.email || member.user_id} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { setUserID(member.user_id); setPrincipalQuery(profile?.display_name || member.user_id); setRole(member.role); setRemoveUserID(""); }}>调整</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveUserID(member.user_id)}>移除</Button></div>; })}</div>{members && (memberCursors.length > 1 || !members.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || memberCursors.length === 1} onClick={() => setMemberCursors(value => value.slice(0, -1))}>上一页</Button><Button disabled={blocked || !members.next_after} onClick={() => setMemberCursors(value => [...value, members.next_after!])}>下一页</Button></nav>}<div className="knowledge-member-editor"><label>搜索工作区成员<input value={principalQuery} maxLength={255} disabled={blocked} onChange={event => { setPrincipalQuery(event.target.value); setUserID(""); }} placeholder="输入姓名或邮箱" /></label>{principalResults.length > 0 && <div className="knowledge-principal-results" role="listbox">{principalResults.map(principal => <button key={principal.user_id} role="option" aria-selected={userID === principal.user_id} onClick={() => { setUserID(principal.user_id); setPrincipalQuery(principal.display_name || principal.email || principal.user_id); setPrincipalResults([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}<label>角色<Select value={role} disabled={blocked} onChange={event => setRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label><Button className="primary" disabled={blocked || !userID} onClick={() => void perform(saveMember)}>保存成员角色</Button></div>{accessPreview && <div className="knowledge-access-preview"><strong>邀请前访问预览</strong><p>Identity 功能权限：{accessPreview.identity.allowed ? "允许" : "拒绝"}；拟授予知识库角色：{roles[role]}；影响 {accessPreview.impact_pages} 个活动页面。</p><p>最终页面阅读：{accessPreview.final.allowed ? "允许" : "拒绝"}。页面权限继承自知识库，不存在前端自算 ACL。</p></div>}{removeUserID && <div className="knowledge-confirm"><p>将“{memberProfiles[removeUserID]?.display_name || "账号不可用"}”移出“{selected.name}”？该成员将失去知识库访问权限。</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeMember)}>确认移除</Button><Button disabled={blocked} onClick={() => setRemoveUserID("")}>保留成员</Button></div></div>}</section>}
        {selected.kind === "shared" && <section className="knowledge-members knowledge-organization-members"><header><div><h3>组织与角色</h3><p>Knowledge 只保存 Identity 组织 ID 与知识库角色；成员归属、组织名称和停用状态始终从 Identity 实时读取。</p></div></header>
          <div className="knowledge-member-list">{organizationMembers?.items.map(member => { const profile = organizationProfiles[member.organization_id]; return <div className="knowledge-member" key={member.organization_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || "组").slice(0, 1)}</span><span>{profile?.display_name || "组织不可用"}<small>{member.organization_id} · {profile?.node_type || "组织"} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { setOrganizationID(member.organization_id); setOrganizationRole(member.role); setRemoveOrganizationID(""); }}>调整</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveOrganizationID(member.organization_id)}>移除</Button></div>; })}</div>
          {organizationMembers && (organizationMemberCursors.length > 1 || !organizationMembers.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || organizationMemberCursors.length === 1} onClick={() => setOrganizationMemberCursors(value => value.slice(0, -1))}>上一页</Button><Button disabled={blocked || !organizationMembers.next_after} onClick={() => setOrganizationMemberCursors(value => [...value, organizationMembers.next_after!])}>下一页</Button></nav>}
          <div className="knowledge-member-editor"><label>Identity 组织 ID<input value={organizationID} maxLength={255} disabled={blocked} onChange={event => setOrganizationID(event.target.value)} placeholder="输入准确的组织 ID" /></label><label>角色<Select value={organizationRole} disabled={blocked} onChange={event => setOrganizationRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label><Button className="primary" disabled={blocked || !organizationID.trim()} onClick={() => void perform(saveOrganizationMember)}>验证并保存组织角色</Button></div>
          {removeOrganizationID && <div className="knowledge-confirm"><p>将“{organizationProfiles[removeOrganizationID]?.display_name || removeOrganizationID}”移出“{selected.name}”？该组织成员将失去知识库访问，相关页面授权会同时删除。</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeOrganizationMember)}>确认移除</Button><Button disabled={blocked} onClick={() => setRemoveOrganizationID("")}>保留组织</Button></div></div>}
        </section>}
        {selected.sources_manageable && <KnowledgeSourcesPanel client={client} library={selected} disabled={busy} formatError={formatError} onBusyChange={setSourceBusy} onBound={value => { setSelected(value); setRefresh(current => current + 1); }} />}
        {error && <p role="alert" className="knowledge-error">{error}</p>}
      </div></section></div>, window.document.body)}
    </> : !loading ? <EmptyState><FolderOpen size={32} /><h3>{visibleLibraries.length > 0 ? "请选择知识库" : libraryKind === "personal" ? "还没有个人知识库" : "还没有可访问的团队知识库"}</h3><p>{libraryKind === "personal" ? "打开个人知识库后，可在自己的空间内检索、编辑和整理内容。" : "可从左侧新增团队知识库，或请团队管理员将你添加为成员。"}</p>{canCreatePersonal && <Button className="primary" disabled={blocked} onClick={() => void perform(createPersonalLibrary)}><BookOpen size={15} />创建个人知识库</Button>}</EmptyState> : null}</section>
  </div>;
}

export function KnowledgeLibraryManagerDialog({ client, formatError = defaultErrorMessage, onClose }: { client: KnowledgeClient; formatError?: (error: unknown) => string; onClose(): void }) {
  const [libraryKind, setLibraryKind] = useState<"personal" | "shared">("personal");
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation"><section className="knowledge-manager-dialog" role="dialog" aria-modal="true" aria-label="知识库"><header><div><h2>知识库</h2><p>个人知识库仅自己可见；团队知识库按成员角色共同维护。</p></div><Button aria-label="关闭" onClick={onClose}><X size={17} /></Button></header><div className="knowledge-workspace-tabs" role="tablist" aria-label="知识库范围"><button role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={17} /><span>个人知识库</span></button><button role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={17} /><span>团队知识库</span></button></div><KnowledgeLibraryManager key={libraryKind} client={client} formatError={formatError} libraryKind={libraryKind} /></section></div>, window.document.body);
}
