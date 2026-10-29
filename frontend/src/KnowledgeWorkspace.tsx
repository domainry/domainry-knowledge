import { kt, ktf } from "./i18n/runtime.ts";
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
import { KnowledgeLibraryCreateDialog } from "./KnowledgeLibraryCreateDialog.tsx";
import type { KnowledgeLibraryCreateInput } from "./KnowledgeLibraryCreateDialog.tsx";
import { KnowledgeThemeProvider, useResolvedKnowledgeTheme, type KnowledgeTheme } from "./theme.tsx";
import { browserKnowledgeLocale, KnowledgeI18nProvider, knowledgeDirection, normalizeKnowledgeLocale } from "./i18n/runtime.ts";
import type { KnowledgeHostIntegration, KnowledgeHostLocale } from "./hostIntegration.ts";

export type KnowledgeWorkspaceProps = {
  client: KnowledgeClient;
  currentUserID?: string;
  formatError?: (error: unknown) => string;
  headerSearchHost?: HTMLElement | null;
  theme?: KnowledgeTheme;
  locale?: KnowledgeHostLocale;
  hostIntegration?: KnowledgeHostIntegration;
};

const roles: Record<KnowledgeLibraryMember["role"], string> = {
  get reader() { return kt("knowledge.auto.534cb3fa8fbf373f"); },
  get editor() { return kt("knowledge.auto.051836569928a9f9"); },
  get manager() { return kt("knowledge.auto.bb6d995724f49a72"); },
};

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
  if (Number.isInteger(location.page) && location.page! > 0) parts.push(ktf("knowledge.auto.f4e694d8c6a9ff08", { value0: location.page }));
  if (Number.isInteger(location.slide) && location.slide! > 0) parts.push(ktf("knowledge.auto.dd8e9d8aaf45e73d", { value0: location.slide }));
  if (location.section && location.section.length <= 256) parts.push(location.section);
	if (location.chunk_id && location.chunk_id.length <= 128) parts.push(ktf("knowledge.auto.6771f15d1d68a597", { value0: location.chunk_id }));
  if (location.sheet && location.sheet.length <= 128) parts.push(ktf("knowledge.auto.7dc428a72db8659e", { value0: location.sheet }));
  if (location.cell && /^[A-Z]{1,3}[1-9][0-9]{0,6}$/.test(location.cell)) parts.push(ktf("knowledge.auto.4ff859da7c018418", { value0: location.cell }));
  else if (Number.isInteger(location.row) && location.row! > 0) parts.push(Number.isInteger(location.row_end) && location.row_end! >= location.row! ? ktf("knowledge.auto.cc84023294e68552", { value0: location.row, value1: location.row_end }) : ktf("knowledge.auto.cda7aa9766702d2e", { value0: location.row }));
  if (Number.isInteger(location.line) && location.line! > 0) parts.push(Number.isInteger(location.line_end) && location.line_end! >= location.line! ? ktf("knowledge.auto.cc84023294e68552", { value0: location.line, value1: location.line_end }) : ktf("knowledge.auto.cda7aa9766702d2e", { value0: location.line }));
  if (Number.isInteger(location.paragraph) && location.paragraph! >= 0) parts.push(ktf("knowledge.auto.a9e200ce93d5b4f3", { value0: location.paragraph! + 1 }));
  if (location.json_path && location.json_path.length <= 512) parts.push(`JSON ${location.json_path}`);
  if (location.html_id && location.html_id.length <= 256) parts.push(`#${location.html_id}`);
  if (Number.isInteger(location.start_ms) && location.start_ms! >= 0) parts.push(`${location.media_kind === "video" ? kt("knowledge.auto.c20f7618d330a854") : location.media_kind === "audio" ? kt("knowledge.auto.296c632ec857a0ba") : kt("knowledge.auto.fa33e10009759859")} ${formatMediaTime(location.start_ms!)}${Number.isInteger(location.end_ms) && location.end_ms! > location.start_ms! ? `–${formatMediaTime(location.end_ms!)}` : ""}`);
  return parts.join(" · ");
}

function formatMediaTime(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60), rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}

function citationProvenance(citation: KnowledgeCitation) {
  const parts: string[] = [];
  if (Number.isSafeInteger(citation.document_version) && citation.document_version! > 0) parts.push(ktf("knowledge.auto.ea32151273825ba7", { value0: citation.document_version }));
  if (citation.source_revision && citation.source_revision.length <= 128) parts.push(ktf("knowledge.auto.8bbb742d559732f6", { value0: citation.source_revision }));
  if (Number.isFinite(citation.score)) parts.push(ktf("knowledge.auto.f4e5e0f2f7a6ab48", { value0: citation.score!.toFixed(3) }));
  if (citation.content_sha256 && /^[a-f0-9]{64}$/i.test(citation.content_sha256)) parts.push(`SHA-256 ${citation.content_sha256.slice(0, 12)}…`);
  return parts.join(" · ");
}

export function KnowledgeWorkspace({ client, currentUserID = "", formatError = defaultErrorMessage, headerSearchHost, theme = "system", locale, hostIntegration }: KnowledgeWorkspaceProps) {
  const resolvedTheme = useResolvedKnowledgeTheme(theme);
  const resolvedLocale = locale ? normalizeKnowledgeLocale(locale) : browserKnowledgeLocale();
  const direction = knowledgeDirection(resolvedLocale);
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
  const scopeNavigation = <nav className="knowledge-workspace-tabs knowledge-primary-scope-tabs" role="tablist" aria-label={kt("knowledge.auto.eade6e9fe3cc2f3f")}>
    <button type="button" role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={16} /><span><strong>{kt("knowledge.auto.15dec507959ec950")}</strong></span></button>
    <button type="button" role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={16} /><span><strong>{kt("knowledge.auto.acdf17f4e9c43ea0")}</strong></span></button>
  </nav>;
  const searchControl = <div className={`knowledge-header-search${searchExpanded ? " is-expanded" : ""}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !searchInput.trim()) setSearchExpanded(false); }}>
    <button type="button" className="knowledge-header-search-toggle" aria-label={kt("knowledge.auto.5c5b89ccbe7bab73")} title={kt("knowledge.auto.64fbeaa5708e1660")} aria-expanded={searchExpanded} onClick={openGlobalSearch}><Search size={18} aria-hidden="true" /></button>
    <form className="knowledge-global-search" role="search" onSubmit={event => { event.preventDefault(); const query = searchInput.trim(); if (query) setSearchRequest(current => ({ query, revision: current.revision + 1 })); }}><Search size={16} aria-hidden="true" /><input ref={searchInputRef} aria-label={kt("knowledge.auto.f1390e1f22bf2285")} aria-keyshortcuts="Meta+K Control+K" value={searchInput} maxLength={4096} onChange={event => setSearchInput(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && !searchInput.trim()) { event.currentTarget.blur(); setSearchExpanded(false); } }} placeholder={kt("knowledge.auto.e8654dfeb4e5b61c")} />{searchRequest.query && <Button type="button" aria-label={kt("knowledge.auto.55d67963b01493ed")} onClick={() => { setSearchInput(""); setSearchRequest(current => ({ query: "", revision: current.revision + 1 })); }}><X size={14} /></Button>}<Button type="submit" className="primary" disabled={!searchInput.trim()}>{kt("knowledge.auto.44ce7ae909bbb28b")}</Button></form>
  </div>;
  return <KnowledgeI18nProvider locale={resolvedLocale}><KnowledgeThemeProvider theme={resolvedTheme}><main className="knowledge-workspace" data-knowledge-theme={resolvedTheme} lang={resolvedLocale} dir={direction}>
    {headerSearchHost && createPortal(searchControl, headerSearchHost)}
    <KnowledgeLibraryManager key={libraryKind} client={client} currentUserID={currentUserID} formatError={formatError} initialLibraryID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.libraryID : ""} initialPageID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.pageID : ""} initialBlockID={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.blockID : undefined} initialPageMode={initialDeepLink?.libraryKind === libraryKind ? initialDeepLink.mode : "read"} libraryKind={libraryKind} scopeTabs={scopeNavigation} searchQuery={searchRequest.query} searchRevision={searchRequest.revision} hostIntegration={hostIntegration} />
  </main></KnowledgeThemeProvider></KnowledgeI18nProvider>;
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
  if (hit.location.kind === "block") return ktf("knowledge.auto.557300fba10b6bea", { value0: hit.location.block_id || "" }).trim();
  if (hit.location.kind === "cell") {
    if (hit.location.cell) return ktf("knowledge.auto.c0143513791b5154", { value0: hit.location.sheet_id ? `${hit.location.sheet_id} · ` : "", value1: hit.location.cell });
    return ktf("knowledge.auto.9a1537ada0ec3c2a", { value0: hit.location.record_id || "", value1: hit.location.field_id || "" });
  }
  if (hit.location.kind === "node") return ktf("knowledge.auto.75c3beeb1a72696a", { value0: hit.location.node_id || "" }).trim();
  return kt("knowledge.auto.c19fcd78dc7bba25");
}

function pageSearchIndexLabel(status: KnowledgePageSearchHit["index_status"]) {
  return ({ none: kt("knowledge.auto.2984e794571545b0"), queued: kt("knowledge.auto.eedc1e770989e5db"), indexing: kt("knowledge.auto.d2ce5059e4307cca"), ready: kt("knowledge.auto.f300284b5e0a8fc7"), failed: kt("knowledge.auto.d052f725817f1917") } as const)[status];
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
              stopped = true; setACLReady(false); setResult(null); setLoading(false); setError(kt("knowledge.auto.897f5b45da27d8e5")); abort.abort(); return;
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
  return <section className="knowledge-page-search" aria-label={ktf("knowledge.auto.406d87af03e2ab8d", { value0: library.name })}>
    <header className="knowledge-page-search-header"><div><span><FileSearch size={19} /></span><div><h2>{kt("knowledge.auto.13c78de6ef97cd7e")}{library.name}」</h2><p>{kt("knowledge.auto.d1d76e7efc7e3057")}</p></div></div><div className="knowledge-page-search-header-actions"><Button aria-expanded={showFilters} aria-controls="knowledge-page-search-filters" onClick={() => setShowFilters(value => !value)}><Filter size={15} />{kt("knowledge.auto.b5f15473fdc0fefe")}{activeFilterCount ? ` ${activeFilterCount}` : ""}</Button></div></header>
    {showFilters && <form id="knowledge-page-search-filters" className="knowledge-page-search-filters" onSubmit={event => { event.preventDefault(); setAppliedFilters({ ...filters }); setRevision(value => value + 1); }}>
		<label><span>{kt("knowledge.auto.8d1e6ff11b4fc658")}</span><Select value={filters.scope} onChange={event => setFilters(current => ({ ...current, scope: event.target.value as PageSearchFilters["scope"] }))}><option value="library">{kt("knowledge.auto.a7c403adea4e910e")}</option><option value="subtree" disabled={!subtreeRoot}>{kt("knowledge.auto.4a03535d8950a60a")}{subtreeRoot ? `：${subtreeRoot.title}` : kt("knowledge.auto.f62dc6544c6ab407")}</option></Select></label>
      <label><span>{kt("knowledge.auto.ea8671368cce66d2")}</span><Select value={filters.contentType} onChange={event => setFilters(current => ({ ...current, contentType: event.target.value as PageSearchFilters["contentType"] }))}><option value="">{kt("knowledge.auto.267c4a7a86dd1849")}</option>{pageTypeDefinitions.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</Select></label>
      <label><span>{kt("knowledge.auto.413f069f12444247")}</span><input value={filters.authorUserID} onChange={event => setFilters(current => ({ ...current, authorUserID: event.target.value }))} placeholder={kt("knowledge.auto.0fe5ee2cee4e9b73")} /></label>
      <label><span>{kt("knowledge.auto.ae0cf1ebe0087d25")}</span><input type="date" value={filters.updatedAfter} onChange={event => setFilters(current => ({ ...current, updatedAfter: event.target.value }))} /></label>
      <label><span>{kt("knowledge.auto.d6230d82ccf55705")}</span><input type="date" value={filters.updatedBefore} onChange={event => setFilters(current => ({ ...current, updatedBefore: event.target.value }))} /></label>
      <label><span>{kt("knowledge.auto.1d0fd5f9336d9103")}</span><input value={filters.tags} onChange={event => setFilters(current => ({ ...current, tags: event.target.value }))} placeholder={kt("knowledge.auto.42f1a31c725f5d65")} /></label>
      <label><span>{kt("knowledge.auto.c481e0544dd73119")}</span><input value={filters.path} onChange={event => setFilters(current => ({ ...current, path: event.target.value }))} placeholder={kt("knowledge.auto.75c6b4ac9d3ff569")} /></label>
      <label><span>{kt("knowledge.auto.5100f029e0c58935")}</span><Select value={filters.publicationStatus} onChange={event => setFilters(current => ({ ...current, publicationStatus: event.target.value as PageSearchFilters["publicationStatus"] }))}><option value="">{kt("knowledge.auto.0a379c1e7398fba1")}</option><option value="published">{kt("knowledge.auto.d334724d6b2fa32e")}</option><option value="unpublished">{kt("knowledge.auto.926f4d92408df955")}</option></Select></label>
      <div className="knowledge-page-search-filter-actions"><Button type="button" onClick={() => { setFilters(emptyPageSearchFilters); setAppliedFilters(emptyPageSearchFilters); setRevision(value => value + 1); }}>{kt("knowledge.auto.cb5d682bac3d1a2d")}</Button><Button type="submit" className="primary">{kt("knowledge.auto.dd0a97ab3653fa82")}</Button></div>
    </form>}
		{recentSearches.length > 0 && <div className="knowledge-page-search-recent" aria-label={kt("knowledge.auto.3b5ac9baaaae2f12")}><span>{kt("knowledge.auto.3b5ac9baaaae2f12")}</span>{recentSearches.map(item => <button key={item} type="button" aria-pressed={query === item} onClick={() => { setQuery(item); setRevision(value => value + 1); }}>{item}</button>)}<button type="button" className="is-clear" onClick={() => { try { window.localStorage.removeItem(recentSearchKey(currentUserID, library.id)); } catch { /* ignore */ } setRecentSearches([]); }}>{kt("knowledge.auto.bce2377283c2455a")}</button></div>}
    {!aclReady && !error && <div className="knowledge-page-search-state"><RefreshCw className="knowledge-spin" size={25} /><p>{kt("knowledge.auto.c1bbc68a1334252c")}</p></div>}
    {aclReady && loading && <div className="knowledge-page-search-state"><RefreshCw className="knowledge-spin" size={25} /><p>{kt("knowledge.auto.af6e26c2fbc148df")}</p></div>}
    {error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}
    {aclReady && !loading && !error && result && <><div className="knowledge-page-search-summary"><strong>{result.items.length} {kt("knowledge.auto.f8b3cb4796d24f7b")}</strong><span>{result.truncated ? kt("knowledge.auto.dbb262088f6c3269") : kt("knowledge.auto.cbf028cc30db6f10")}</span></div>{result.items.length ? <div className="knowledge-page-search-results">{result.items.map(hit => <button key={hit.page_id} type="button" onClick={() => onOpen(hit)}>
      <span className={`knowledge-page-search-type is-${hit.kind}`}><PageTypeIcon type={hit.content_type} size={19} /></span>
      <span className="knowledge-page-search-copy"><strong>{hit.title}</strong><small>{hit.path.map(item => item.title).join(" / ")}</small>{hit.excerpt && <p>{hit.excerpt}</p>}<em>{pageSearchLocationLabel(hit)}</em></span>
      <span className="knowledge-page-search-meta"><b>{hit.kind === "file" ? kt("knowledge.auto.39932f24fe11a6ba") : hit.kind === "page" ? kt("knowledge.auto.452c7b10d57a86a7") : kt("knowledge.auto.f88e8ea8818b9a05")} · {pageTypeMeta[hit.content_type].label}</b><small>{hit.author_user_id} · {hit.published_version ? ktf("knowledge.auto.ea32151273825ba7", { value0: hit.published_version }) : kt("knowledge.auto.926f4d92408df955")}</small><small className={`is-index-${hit.index_status}`}>{pageSearchIndexLabel(hit.index_status)}</small><ChevronRight size={16} /></span>
    </button>)}</div> : <EmptyState><FileSearch size={30} /><h3>{kt("knowledge.auto.5620cc4ae52cf053")}</h3><p>{kt("knowledge.auto.b332a9c479f5f163")}</p></EmptyState>}</>}
		{aclReady && !loading && !error && !result && <EmptyState><FileSearch size={30} /><h3>{kt("knowledge.auto.36cf0ecfa9c77795")}</h3><p>{kt("knowledge.auto.ac272a217a7ee4da")}</p></EmptyState>}
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
      if (!abort.signal.aborted) { setLibraries(items.filter(library => library.knowledge_configured)); setScopeNotice(complete ? "" : kt("knowledge.auto.97b157ca1311dfa1")); }
    })().catch(() => { if (!abort.signal.aborted) setScopeNotice(kt("knowledge.auto.29853e4038a1e06a")); });
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
  return <div className="knowledge-browser-body"><section className="knowledge-search-column"><div className="knowledge-page-intro"><span><FileSearch size={22} /></span><div><h2>{library ? ktf("knowledge.auto.406d87af03e2ab8d", { value0: library.name }) : kt("knowledge.auto.bcce43044c460ab1")}</h2><p>{library ? kt("knowledge.auto.7cfb203ff86e7f98") : kt("knowledge.auto.40a92d225711fdf6")}</p></div></div>{!library && <label className="knowledge-search-scope"><span>{kt("knowledge.auto.8d1e6ff11b4fc658")}</span><Select value={libraryID} onChange={event => setLibraryID(event.target.value)}><option value="">{kt("knowledge.auto.c98c21018a061ff2")}</option>{libraries.map(item => <option key={item.id} value={item.id}>{item.name}{item.archived ? kt("knowledge.auto.de0931324baa0cab") : ""}</option>)}</Select></label>}{scopeNotice && <p className="knowledge-subtle">{scopeNotice}</p>}{!hideSearchForm && <form className="knowledge-search-form" onSubmit={event => { event.preventDefault(); const value = input.trim(); if (value) { setQuery(value); setSearchRevision(current => current + 1); } }}><Search size={18} /><input aria-label={kt("knowledge.auto.45543d0e87fb7c44")} value={input} maxLength={4096} onChange={event => setInput(event.target.value)} placeholder={kt("knowledge.auto.2015563961d26387")} /><Button type="submit" disabled={loading || !input.trim()}>{loading ? kt("knowledge.auto.1dad8492f8c1a0de") : kt("knowledge.auto.44ce7ae909bbb28b")}</Button></form>}{searchStatus?.summary && <p className="knowledge-subtle">{kt("knowledge.auto.c12fe824888f5ae6")}{searchStatus.summary}</p>}{searchStatus?.degraded && <p role="status" className="knowledge-notice">{searchStatus.degraded}</p>}{error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}{!query && <EmptyState><FileSearch size={30} /><h3>{kt("knowledge.auto.24eac2db44aa0e3d")}</h3><p>{kt("knowledge.auto.d765b009bfe712e6")}</p></EmptyState>}{query && !loading && result && hits.length === 0 && <EmptyState><FileText size={30} /><h3>{kt("knowledge.auto.f0dd503cb0a38f84")}</h3><p>{kt("knowledge.auto.d0f11a78ba8e12a2")}</p></EmptyState>}{hits.length > 0 && <div className="knowledge-hit-list">{hits.map(hit => <button key={`${hit.library_id || libraryID || "default"}:${hit.doc_id}`} aria-current={selected?.doc_id === hit.doc_id && (selected.library_id || libraryID || "") === (hit.library_id || libraryID || "") ? "true" : undefined} onClick={() => void read(hit)}><span className="knowledge-hit-icon"><FileText size={19} /></span><span><strong>{hit.title || hit.doc_id}</strong><small>{hit.excerpt || kt("knowledge.auto.8f2325bf12db781a")}</small><em>{kt("knowledge.auto.e0fce50b38bc9515")}{hit.doc_id}{hit.matchedPassages > 1 ? ktf("knowledge.auto.df587bdcfcde70bc", { value0: hit.matchedPassages }) : ""}{citationLocation(hit) ? ` · ${citationLocation(hit)}` : ""}</em>{citationProvenance(hit) && <em>{citationProvenance(hit)}</em>}</span></button>)}</div>}</section><aside className="knowledge-reader" aria-label={kt("knowledge.auto.61fb5da7b2c56eaf")}>{!selected ? <EmptyState><FileText size={34} /><h3>{kt("knowledge.auto.f63c1d21f313cdbb")}</h3><p>{kt("knowledge.auto.7e742866fc7ee1ca")}</p></EmptyState> : reading ? <EmptyState><RefreshCw className="knowledge-spin" size={28} /><p>{kt("knowledge.auto.a252e0c44639b5e5")}</p></EmptyState> : current ? <><header><span className="knowledge-reader-icon"><FileText size={20} /></span><div><h2>{selected.title || current.doc_id || selected.doc_id}</h2><p>{kt("knowledge.auto.e0fce50b38bc9515")}{current.doc_id || selected.doc_id}{current.kb_id ? ktf("knowledge.auto.69e4e85ab419148b", { value0: current.kb_id }) : ""}</p></div></header>{passages.length ? <article className="knowledge-passages">{passages.map((passage, index) => <section key={passage.id || `${passage.doc_id}:${passage.chunk_id || index}`}><small>{kt("knowledge.auto.908e56fe5ed8ba83")}{index + 1}{citationLocation(passage) ? ` · ${citationLocation(passage)}` : ""}{passage.excerpt_truncated ? kt("knowledge.auto.7cd5abe035366012") : ""}</small>{citationProvenance(passage) && <small>{citationProvenance(passage)}</small>}<p>{passage.excerpt || kt("knowledge.auto.857081541b3e7c74")}</p></section>)}</article> : <div className="knowledge-raw-document"><p>{kt("knowledge.auto.f5f9255836b3905d")}</p></div>}{safeURL(selected.url) && <a className="knowledge-source-link" href={safeURL(selected.url)} target="_blank" rel="noopener noreferrer">{kt("knowledge.auto.ae083025a2c99c82")}</a>}</> : <EmptyState><FileText size={34} /><h3>{kt("knowledge.auto.37df5ef6666edc02")}</h3><p>{kt("knowledge.auto.a90d5166fb9f6817")}</p></EmptyState>}</aside></div>;
}

export function KnowledgeLibraryManager({ client, currentUserID = "", formatError = defaultErrorMessage, initialLibraryID = "", initialPageID = "", initialBlockID, initialPageMode = "read", libraryKind, scopeTabs, searchQuery = "", searchRevision = 0, hostIntegration }: { client: KnowledgeClient; currentUserID?: string; formatError?: (error: unknown) => string; initialLibraryID?: string; initialPageID?: string; initialBlockID?: string; initialPageMode?: "read" | "edit"; libraryKind?: "personal" | "shared"; scopeTabs?: ReactNode; searchQuery?: string; searchRevision?: number; hostIntegration?: KnowledgeHostIntegration }) {
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
  const [libraryDialog, setLibraryDialog] = useState<"create" | "manage" | null>(null);
  const createReceipt = useRef<{ kind: "personal" | "shared"; name: string; description: string; clientID: string } | null>(null), lock = useRef(false);
  const personalBootstrapClientID = useRef(crypto.randomUUID());
  const blocked = busy || sourceBusy, libraryCursor = libraryCursors.at(-1) || "", memberCursor = memberCursors.at(-1) || "", organizationMemberCursor = organizationMemberCursors.at(-1) || "";
  const visibleLibraries = libraryKind ? page.items.filter(library => library.kind === libraryKind) : page.items;

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
      if (libraryKind === "personal" && value.complete && value.items.length === 0) {
        const personal = await client.createLibrary({ kind: "personal", name: kt("knowledge.auto.1302f129b3a97f12"), description: "", clientID: personalBootstrapClientID.current }, abort.signal);
        if (abort.signal.aborted) return;
        value = { items: [personal], complete: true };
      }
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
    let succeeded = false;
    try { await action(AbortSignal.timeout(60_000)); succeeded = true; }
    catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); if (succeeded) setRefresh(value => value + 1); }
  }
  function selectResult(value: KnowledgeLibrary, message: string) { setSelectedID(value.id); setSelected(value); setMemberCursors([""]); setOrganizationMemberCursors([""]); setNotice(message); }
  async function createSharedLibrary(request: KnowledgeLibraryCreateInput, signal: AbortSignal) {
    const { members, organizations, ...details } = request;
    const pending = createReceipt.current;
    const input = pending?.kind === "shared" && pending.name === details.name && pending.description === details.description
      ? pending
      : { kind: "shared" as const, ...details, clientID: crypto.randomUUID() };
    createReceipt.current = input;
    let value = await client.createLibrary(input, signal);
    for (const organization of organizations) value = await client.setOrganizationMember(value.id, organization.organization.organization_id, organization.role, value.revision, signal);
    for (const member of members) value = await client.setMember(value.id, member.principal.user_id, member.role, value.revision, signal);
    createReceipt.current = null; setLibraryDialog(null); selectResult(value, members.length + organizations.length > 0 ? ktf("knowledge.auto.d98df64302dddd7f", { value0: value.name, value1: organizations.length, value2: members.length }) : ktf("knowledge.auto.1496a26a13587274", { value0: value.name }));
  }
  function openSharedLibraryCreate() { createReceipt.current = null; setError(""); setNotice(""); setLibraryDialog("create"); }
  function closeSharedLibraryCreate() { if (blocked) return; createReceipt.current = null; setError(""); setLibraryDialog(null); }
  async function save(signal: AbortSignal) {
    if (!selected) return;
    selectResult(await client.updateLibrary(selected.id, { name: name.trim(), description, archived: selected.archived, expectedRevision: selected.revision }, signal), kt("knowledge.auto.d997095b4ce3d7ba"));
  }
  async function setArchived(signal: AbortSignal) {
    if (!selected) return;
    selectResult(await client.setLibraryArchived(selected.id, !selected.archived, selected.revision, signal), selected.archived ? kt("knowledge.auto.93e158e5d1a0c921") : kt("knowledge.auto.9ad5e9afbcd67875"));
  }
  async function saveMember(signal: AbortSignal) {
    if (!selected || !userID.trim()) return;
    selectResult(await client.setMember(selected.id, userID.trim(), role, members?.revision ?? selected.revision, signal), kt("knowledge.auto.2b9b547cbf846f93")); setUserID(""); setPrincipalQuery(""); setPrincipalResults([]); setAccessPreview(null);
  }
  async function removeMember(signal: AbortSignal) {
    if (!selected || !removeUserID) return;
    selectResult(await client.removeMember(selected.id, removeUserID, members?.revision ?? selected.revision, signal), kt("knowledge.auto.e6474f267671ead5")); setRemoveUserID("");
  }
  async function saveOrganizationMember(signal: AbortSignal) {
    if (!selected || !organizationID.trim()) return;
    const normalized = organizationID.trim();
    const [principal] = await client.resolveOrganizationPrincipals([normalized], signal);
    if (!principal || principal.organization_id !== normalized || principal.status !== "active") throw Error(kt("knowledge.auto.2cfc9e53262dc568"));
    selectResult(await client.setOrganizationMember(selected.id, normalized, organizationRole, organizationMembers?.revision ?? selected.revision, signal), kt("knowledge.auto.be0027da66f78acd"));
    setOrganizationProfiles(current => ({ ...current, [normalized]: principal })); setOrganizationID("");
  }
  async function removeOrganizationMember(signal: AbortSignal) {
    if (!selected || !removeOrganizationID) return;
    selectResult(await client.removeOrganizationMember(selected.id, removeOrganizationID, organizationMembers?.revision ?? selected.revision, signal), kt("knowledge.auto.9193fe00205352d8")); setRemoveOrganizationID("");
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
    return <button key={library.id} aria-current={selectedID === library.id ? "true" : undefined} disabled={blocked} onClick={() => selectLibrary(library)}><BookOpen size={18} /><span><strong>{library.name}</strong><small>{library.kind === "personal" ? kt("knowledge.auto.33c7823a56bde000") : ktf("knowledge.auto.36e8afee862031a6", { value0: roles[library.role as KnowledgeLibraryMember["role"]] || library.role })}{library.archived ? kt("knowledge.auto.3788d7bcf01e9f20") : ""}</small></span></button>;
  }

  const revealLibraryRail = (!loading && !selected) || libraryView === "search";
  const scopeTabsInLibraryRail = revealLibraryRail;
  const selectableTeamLibraries = libraryKind === "shared" && selected && !visibleLibraries.some(item => item.id === selected.id) ? [selected, ...visibleLibraries] : visibleLibraries;
  const emptySharedLibraryPicker = libraryKind === "shared" && !loading && !selected && visibleLibraries.length === 0;

  return <div className={`managed-library-browser${revealLibraryRail ? " has-library-rail" : ""}`}>
    <aside className="managed-library-list">
      {scopeTabsInLibraryRail && scopeTabs}
      {emptySharedLibraryPicker ? <div className="knowledge-team-library-picker knowledge-empty-team-library-picker"><Select aria-label={kt("knowledge.auto.da80e5bf97c037bf")} disabled><option>{kt("knowledge.auto.da80e5bf97c037bf")}</option></Select><KnowledgeCreateMenu disabled={blocked} canCreatePage={false} onCreateLibrary={openSharedLibraryCreate} /></div> : <div className="knowledge-library-list-header"><h2>{libraryKind === "personal" ? kt("knowledge.auto.1302f129b3a97f12") : libraryKind === "shared" ? kt("knowledge.auto.da80e5bf97c037bf") : kt("knowledge.auto.975b35f9c2b1148c")}</h2><Button aria-label={kt("knowledge.auto.0fd1851980939e45")} disabled={blocked || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} /></Button></div>}
      {selected && !page.items.some(item => item.id === selected.id) && <button aria-current="true" disabled={blocked}><BookOpen size={18} /><span><strong>{selected.name}</strong><small>{kt("knowledge.auto.105d1ecfc6c5db29")}</small></span></button>}
      {loading ? <p className="knowledge-subtle">{kt("knowledge.auto.3310a3aff04dec06")}</p> : visibleLibraries.length ? visibleLibraries.map(renderLibrary) : <p className="knowledge-library-group-empty">{libraryKind === "personal" ? kt("knowledge.auto.3dcf6f7b9ef354a4") : libraryKind === "shared" ? kt("knowledge.auto.f5bff34b88e00296") : kt("knowledge.auto.00adfc139a6a1320")}</p>}
      {(libraryCursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || libraryCursors.length === 1} onClick={() => { setSelectedID(""); setLibraryCursors(value => value.slice(0, -1)); }}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setSelectedID(""); setLibraryCursors(value => [...value, page.next_after!]); }}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
      {error && <p role="alert" className="knowledge-error">{error}</p>}
    </aside>
    <section className="managed-library-content">{notice && <p role="status" className="knowledge-notice">{notice}</p>}{selected ? <>
      <div className={`knowledge-library-surface${libraryView === "search" ? " is-search" : " is-pages"}`}>
          {libraryView === "search" ? <PageSearchBrowser key={`${selected.id}:${searchRevision}`} client={client} formatError={formatError} library={selected} currentUserID={currentUserID} initialQuery={searchQuery} subtreeRoot={currentPage} onOpen={hit => { setSearchTarget(current => ({ pageID: hit.page_id, mode: hit.publication_status === "unpublished" ? "edit" : "read", location: hit.location, revision: (current?.revision || 0) + 1 })); setLibraryView("content"); }} /> : <KnowledgePagesPanel key={`${selected.id}:${searchTarget?.revision || 0}`} client={client} library={selected} currentUserID={currentUserID} disabled={blocked} formatError={formatError} embedded initialPageID={searchTarget?.pageID || (selected.id === initialLibraryID ? initialPageID : "")} initialBlockID={!searchTarget && selected.id === initialLibraryID ? initialBlockID : undefined} initialSearchLocation={searchTarget?.location} initialPageMode={searchTarget?.mode || (selected.id === initialLibraryID ? initialPageMode : "read")} scopeTabs={!scopeTabsInLibraryRail ? scopeTabs : undefined} teamLibraries={libraryKind === "shared" ? selectableTeamLibraries : undefined} hostIntegration={hostIntegration} onLibrarySelect={libraryID => { const library = selectableTeamLibraries.find(item => item.id === libraryID); if (library) selectLibrary(library); }} onCreateLibrary={libraryKind === "shared" ? openSharedLibraryCreate : undefined} onSelectionChange={updateCurrentPage} onManage={selected.role === "manager" ? () => setLibraryDialog("manage") : undefined} />}
      </div>
      {libraryDialog === "manage" && selected.role === "manager" && createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !blocked) setLibraryDialog(null); }}><section className="knowledge-manager-dialog knowledge-library-management-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.38e699de6a59c0bd")}><header><div><h2>{kt("knowledge.auto.c12e0c527a45acbb")}{selected.name}”</h2><p>{kt("knowledge.auto.870346a297a7ea28")}</p></div><Button aria-label={kt("knowledge.auto.94ed309773648919")} disabled={blocked} onClick={() => setLibraryDialog(null)}><X size={17} /></Button></header><div className="knowledge-dialog-scroll knowledge-management-sections">
        <section className="knowledge-settings"><header><div><h3>{kt("knowledge.auto.e8df058725699a17")}</h3><p>{kt("knowledge.auto.72260c4b79c717aa")}</p></div></header><div className="knowledge-form-grid"><label>{kt("knowledge.auto.d44e9b3d3b31d37b")}<input value={name} maxLength={128} disabled={blocked} onChange={event => setName(event.target.value)} /></label><label>{kt("knowledge.auto.4262c45dc797bb0c")}<textarea value={description} maxLength={1024} disabled={blocked} onChange={event => setDescription(event.target.value)} /></label></div><div className="knowledge-actions"><Button className="primary" disabled={blocked || !name.trim()} onClick={() => void perform(save)}>{kt("knowledge.auto.769c4f866e6248b3")}</Button><Button className={selected.archived ? undefined : "danger"} disabled={blocked} onClick={() => void perform(setArchived)}>{selected.archived ? kt("knowledge.auto.96b4fdf4b952fc9d") : kt("knowledge.auto.4c31a6e16e6906a3")}</Button></div></section>
        {selected.kind === "shared" && <section className="knowledge-members"><header><div><h3>{kt("knowledge.auto.4c8d95ca6a992b65")}</h3><p>{kt("knowledge.auto.517a7c24b178fade")}</p></div></header><div className="knowledge-member-list">{members?.items.map(member => { const profile = memberProfiles[member.user_id]; return <div className="knowledge-member" key={member.user_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || "?").slice(0, 1)}</span><span>{profile?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}<small>{profile?.email || member.user_id} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { setUserID(member.user_id); setPrincipalQuery(profile?.display_name || member.user_id); setRole(member.role); setRemoveUserID(""); }}>{kt("knowledge.auto.f65c42a2540befe5")}</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveUserID(member.user_id)}>{kt("knowledge.auto.6135d4159e892541")}</Button></div>; })}</div>{members && (memberCursors.length > 1 || !members.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || memberCursors.length === 1} onClick={() => setMemberCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || !members.next_after} onClick={() => setMemberCursors(value => [...value, members.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}<div className="knowledge-member-editor"><label>{kt("knowledge.auto.a40edc774fe1199e")}<input value={principalQuery} maxLength={255} disabled={blocked} onChange={event => { setPrincipalQuery(event.target.value); setUserID(""); }} placeholder={kt("knowledge.auto.85333d57ff441b5b")} /></label>{principalResults.length > 0 && <div className="knowledge-principal-results" role="listbox">{principalResults.map(principal => <button key={principal.user_id} role="option" aria-selected={userID === principal.user_id} onClick={() => { setUserID(principal.user_id); setPrincipalQuery(principal.display_name || principal.email || principal.user_id); setPrincipalResults([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}<label>{kt("knowledge.auto.c47b54e84e79d77f")}<Select value={role} disabled={blocked} onChange={event => setRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label><Button className="primary" disabled={blocked || !userID} onClick={() => void perform(saveMember)}>{kt("knowledge.auto.a623b663e4eb1aa7")}</Button></div>{accessPreview && <div className="knowledge-access-preview"><strong>{kt("knowledge.auto.fbcab267f9051e15")}</strong><p>{kt("knowledge.auto.94860bce77109078")}{accessPreview.identity.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")}{kt("knowledge.auto.872c1547057e216f")}{roles[role]}{kt("knowledge.auto.150f6b16a964d9ac")}{accessPreview.impact_pages} {kt("knowledge.auto.c8d3463dab1de5f4")}</p><p>{kt("knowledge.auto.09466e3a08701540")}{accessPreview.final.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")}{kt("knowledge.auto.7c1bb3b2b49f0e99")}</p></div>}{removeUserID && <div className="knowledge-confirm"><p>{kt("knowledge.auto.1f695b59d94f04e8")}{memberProfiles[removeUserID]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}{kt("knowledge.auto.834dc53738e7d427")}{selected.name}{kt("knowledge.auto.b1c875248568c170")}</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeMember)}>{kt("knowledge.auto.ee7dea070d88bb3c")}</Button><Button disabled={blocked} onClick={() => setRemoveUserID("")}>{kt("knowledge.auto.818ed614454d928d")}</Button></div></div>}</section>}
        {selected.kind === "shared" && <section className="knowledge-members knowledge-organization-members"><header><div><h3>{kt("knowledge.auto.357bcf37bca92908")}</h3><p>{kt("knowledge.auto.15841fd364c295dc")}</p></div></header>
          <div className="knowledge-member-list">{organizationMembers?.items.map(member => { const profile = organizationProfiles[member.organization_id]; return <div className="knowledge-member" key={member.organization_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || kt("knowledge.auto.76acfbf2e9e3914e")).slice(0, 1)}</span><span>{profile?.display_name || kt("knowledge.auto.f1f89ccbe79089d0")}<small>{member.organization_id} · {profile?.node_type || kt("knowledge.auto.b4d203dea5b9121c")} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { setOrganizationID(member.organization_id); setOrganizationRole(member.role); setRemoveOrganizationID(""); }}>{kt("knowledge.auto.f65c42a2540befe5")}</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveOrganizationID(member.organization_id)}>{kt("knowledge.auto.6135d4159e892541")}</Button></div>; })}</div>
          {organizationMembers && (organizationMemberCursors.length > 1 || !organizationMembers.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || organizationMemberCursors.length === 1} onClick={() => setOrganizationMemberCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || !organizationMembers.next_after} onClick={() => setOrganizationMemberCursors(value => [...value, organizationMembers.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
          <div className="knowledge-member-editor"><label>{kt("knowledge.auto.ff76126c1b1ae3b3")}<input value={organizationID} maxLength={255} disabled={blocked} onChange={event => setOrganizationID(event.target.value)} placeholder={kt("knowledge.auto.7f35c9d5cbc9246a")} /></label><label>{kt("knowledge.auto.c47b54e84e79d77f")}<Select value={organizationRole} disabled={blocked} onChange={event => setOrganizationRole(event.target.value as KnowledgeLibraryMember["role"])}>{Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label><Button className="primary" disabled={blocked || !organizationID.trim()} onClick={() => void perform(saveOrganizationMember)}>{kt("knowledge.auto.5a0f15a48ab2a2b0")}</Button></div>
          {removeOrganizationID && <div className="knowledge-confirm"><p>{kt("knowledge.auto.1f695b59d94f04e8")}{organizationProfiles[removeOrganizationID]?.display_name || removeOrganizationID}{kt("knowledge.auto.834dc53738e7d427")}{selected.name}{kt("knowledge.auto.3599a3fa4bba28ff")}</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeOrganizationMember)}>{kt("knowledge.auto.ee7dea070d88bb3c")}</Button><Button disabled={blocked} onClick={() => setRemoveOrganizationID("")}>{kt("knowledge.auto.4fff93b49e48864d")}</Button></div></div>}
        </section>}
        {selected.sources_manageable && <KnowledgeSourcesPanel client={client} library={selected} disabled={busy} formatError={formatError} onBusyChange={setSourceBusy} onBound={value => { setSelected(value); setRefresh(current => current + 1); }} />}
        {error && <p role="alert" className="knowledge-error">{error}</p>}
      </div></section></div>, window.document.body)}
    </> : !loading ? <EmptyState><FolderOpen size={32} /><h3>{visibleLibraries.length > 0 ? kt("knowledge.auto.f331b7a3d88c9e2b") : libraryKind === "personal" ? kt("knowledge.auto.e234404a9a03de1b") : kt("knowledge.auto.86265dbb706ad4a7")}</h3><p>{libraryKind === "personal" ? kt("knowledge.auto.81db73ee5ace8a24") : kt("knowledge.auto.a95d08c4f9b570f7")}</p>{libraryKind === "shared" && visibleLibraries.length === 0 && <Button className="primary" disabled={blocked} onClick={openSharedLibraryCreate}><Users size={15} />{kt("knowledge.auto.ca2db8ecf35f0c53")}</Button>}</EmptyState> : null}</section>
    {libraryDialog === "create" && <KnowledgeLibraryCreateDialog client={client} busy={blocked} error={error} onClose={closeSharedLibraryCreate} onCreate={input => void perform(signal => createSharedLibrary(input, signal))} />}
  </div>;
}

export function KnowledgeLibraryManagerDialog({ client, formatError = defaultErrorMessage, onClose }: { client: KnowledgeClient; formatError?: (error: unknown) => string; onClose(): void }) {
  const [libraryKind, setLibraryKind] = useState<"personal" | "shared">("personal");
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation"><section className="knowledge-manager-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.975b35f9c2b1148c")}><header><div><h2>{kt("knowledge.auto.975b35f9c2b1148c")}</h2><p>{kt("knowledge.auto.d2c31022189ebd0b")}</p></div><Button aria-label={kt("knowledge.auto.3fd47edce45b3603")} onClick={onClose}><X size={17} /></Button></header><div className="knowledge-workspace-tabs" role="tablist" aria-label={kt("knowledge.auto.eade6e9fe3cc2f3f")}><button role="tab" aria-selected={libraryKind === "personal"} onClick={() => setLibraryKind("personal")}><BookOpen size={17} /><span>{kt("knowledge.auto.1302f129b3a97f12")}</span></button><button role="tab" aria-selected={libraryKind === "shared"} onClick={() => setLibraryKind("shared")}><Users size={17} /><span>{kt("knowledge.auto.da80e5bf97c037bf")}</span></button></div><KnowledgeLibraryManager key={libraryKind} client={client} formatError={formatError} libraryKind={libraryKind} /></section></div>, window.document.body);
}
