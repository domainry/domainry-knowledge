import { kt, ktf } from "./i18n/runtime.ts";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { BookOpen, ChevronRight, Database, FileSearch, FileText, Filter, FolderOpen, LoaderCircle, Plus, RefreshCw, Search, Settings, ShieldAlert, Trash2, UserRoundCog, X } from "lucide-react";
import { Button, defaultErrorMessage, EmptyState, KnowledgeToast, Select } from "./components.tsx";
import { KnowledgeDocumentsPanel } from "./KnowledgeDocumentsPanel.tsx";
import { KnowledgePagesPanel } from "./KnowledgePagesPanel.tsx";
import { createKnowledgePageLink, parseKnowledgeDeepLink } from "./knowledge-links.ts";
import { PageTypeIcon, pageTypeDefinitions, pageTypeMeta } from "./pageTypeRegistry.ts";
import { knowledgeCitations, knowledgeDocumentHits, knowledgeSearchStatus } from "./search-results.ts";
import type { KnowledgeCitation, KnowledgeClient, KnowledgeLibrary, KnowledgeLibraryMember, KnowledgeLibraryMemberPage, KnowledgeLibraryOrganizationMemberPage, KnowledgeLibraryPage, KnowledgeOrganizationPrincipal, KnowledgePageCollectionPage, KnowledgePageContentType, KnowledgePageSearchHit, KnowledgePageSearchInput, KnowledgePageSearchLocation, KnowledgePageSearchPage, KnowledgePrincipal, KnowledgeResult } from "./types.ts";
import { KnowledgeLibraryCreateDialog } from "./KnowledgeLibraryCreateDialog.tsx";
import type { KnowledgeLibraryCreateInput } from "./KnowledgeLibraryCreateDialog.tsx";
import { KnowledgeAccessSelector, KnowledgeAccessTabs } from "./KnowledgeAccessSelector.tsx";
import type { KnowledgeAccessMemberInput, KnowledgeAccessOrganizationInput, KnowledgeAccessTab } from "./KnowledgeAccessSelector.tsx";
import { KnowledgeThemeProvider, useResolvedKnowledgeTheme, type KnowledgeTheme } from "./theme.tsx";
import { browserKnowledgeLocale, formatKnowledgeDate, KnowledgeI18nProvider, knowledgeDirection, normalizeKnowledgeLocale, useClearTransientKnowledgeNotice } from "./i18n/runtime.ts";
import type { KnowledgeHostIntegration, KnowledgeHostLocale } from "./hostIntegration.ts";

export type KnowledgeWorkspaceProps = {
  client: KnowledgeClient;
  currentUserID?: string;
  formatError?: (error: unknown) => string;
  headerSearchHost?: HTMLElement | null;
  showHeaderSearch?: boolean;
  theme?: KnowledgeTheme;
  locale?: KnowledgeHostLocale;
  hostIntegration?: KnowledgeHostIntegration;
};

const roles: Record<KnowledgeLibraryMember["role"], string> = {
  get reader() { return kt("knowledge.auto.534cb3fa8fbf373f"); },
  get editor() { return kt("knowledge.auto.051836569928a9f9"); },
  get manager() { return kt("knowledge.auto.bb6d995724f49a72"); },
};

type SharedLibraryCreateReceipt = { kind: "shared"; name: string; description: string; clientID: string };

function sharedLibraryCreateReceipt(request: KnowledgeLibraryCreateInput, pending: SharedLibraryCreateReceipt | null): SharedLibraryCreateReceipt {
  return pending?.name === request.name && pending.description === request.description
    ? pending
    : { kind: "shared", name: request.name, description: request.description, clientID: crypto.randomUUID() };
}

async function createSharedLibraryWithAssignments(client: KnowledgeClient, request: KnowledgeLibraryCreateInput, receipt: SharedLibraryCreateReceipt, signal: AbortSignal) {
  let value = await client.createLibrary(receipt, signal);
  for (const organization of request.organizations) value = await client.setOrganizationMember(value.id, organization.organization.organization_id, organization.role, value.revision, signal);
  for (const member of request.members) value = await client.setMember(value.id, member.principal.user_id, member.role, value.revision, signal);
  return value;
}

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

export function KnowledgeWorkspace({ client, currentUserID = "", formatError = defaultErrorMessage, headerSearchHost, showHeaderSearch = true, theme = "system", locale, hostIntegration }: KnowledgeWorkspaceProps) {
  const resolvedTheme = useResolvedKnowledgeTheme(theme);
  const resolvedLocale = locale ? normalizeKnowledgeLocale(locale) : browserKnowledgeLocale();
	return <KnowledgeI18nProvider locale={resolvedLocale}>
		<KnowledgeWorkspaceContent client={client} currentUserID={currentUserID} formatError={formatError} headerSearchHost={headerSearchHost} showHeaderSearch={showHeaderSearch} resolvedTheme={resolvedTheme} resolvedLocale={resolvedLocale} hostIntegration={hostIntegration} />
	</KnowledgeI18nProvider>;
}

function KnowledgeWorkspaceContent({ client, currentUserID, formatError, headerSearchHost, showHeaderSearch, resolvedTheme, resolvedLocale, hostIntegration }: Omit<KnowledgeWorkspaceProps, "theme" | "locale"> & { currentUserID: string; formatError: (error: unknown) => string; resolvedTheme: "light" | "dark"; resolvedLocale: KnowledgeHostLocale }) {
  const direction = knowledgeDirection(resolvedLocale);
  const initialDeepLink = useMemo(() => typeof window === "undefined" ? null : parseKnowledgeDeepLink(window.location.href), []);
  const [navigationQuery, setNavigationQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState({ query: "", revision: 0 });
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const openGlobalSearch = useCallback(() => {
    setSearchExpanded(true);
    window.setTimeout(() => { searchInputRef.current?.focus(); searchInputRef.current?.select(); });
  }, []);
  useEffect(() => {
    if (!showHeaderSearch) return;
    const focusGlobalSearch = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLocaleLowerCase() !== "k") return;
      event.preventDefault();
      openGlobalSearch();
    };
    window.addEventListener("keydown", focusGlobalSearch);
    return () => window.removeEventListener("keydown", focusGlobalSearch);
  }, [openGlobalSearch, showHeaderSearch]);
  const scopeNavigation = (_createControl?: ReactNode, branchContent?: ReactNode) => <section className="knowledge-library-navigation" aria-label={kt("knowledge.auto.975b35f9c2b1148c")}>
    <div className="knowledge-library-navigation-tree">{branchContent}</div>
  </section>;
  const searchControl = <div className={`knowledge-header-search${searchExpanded ? " is-expanded" : ""}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !searchInput.trim()) setSearchExpanded(false); }}>
    <button type="button" className="knowledge-header-search-toggle" aria-label={kt("knowledge.auto.5c5b89ccbe7bab73")} title={kt("knowledge.auto.64fbeaa5708e1660")} aria-expanded={searchExpanded} onClick={openGlobalSearch}><Search size={18} aria-hidden="true" /></button>
    <form className="knowledge-global-search" role="search" onSubmit={event => { event.preventDefault(); const query = searchInput.trim(); if (query) setSearchRequest(current => ({ query, revision: current.revision + 1 })); }}><Search size={16} aria-hidden="true" /><input ref={searchInputRef} aria-label={kt("knowledge.auto.f1390e1f22bf2285")} aria-keyshortcuts="Meta+K Control+K" value={searchInput} maxLength={4096} onChange={event => setSearchInput(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && !searchInput.trim()) { event.currentTarget.blur(); setSearchExpanded(false); } }} placeholder={kt("knowledge.auto.e8654dfeb4e5b61c")} />{searchRequest.query && <Button type="button" aria-label={kt("knowledge.auto.55d67963b01493ed")} onClick={() => { setSearchInput(""); setSearchRequest(current => ({ query: "", revision: current.revision + 1 })); }}><X size={14} /></Button>}<Button type="submit" className="primary" disabled={!searchInput.trim()}>{kt("knowledge.auto.44ce7ae909bbb28b")}</Button></form>
  </div>;
  return <KnowledgeThemeProvider theme={resolvedTheme}><main className="knowledge-workspace" data-knowledge-theme={resolvedTheme} lang={resolvedLocale} dir={direction}>
    {showHeaderSearch && (headerSearchHost ? createPortal(searchControl, headerSearchHost) : <div className="knowledge-workspace-search">{searchControl}</div>)}
    <KnowledgeLibraryManager client={client} currentUserID={currentUserID} formatError={formatError} initialLibraryID={initialDeepLink?.libraryID || ""} initialPageID={initialDeepLink?.pageID || ""} initialBlockID={initialDeepLink?.blockID} initialPageMode={initialDeepLink?.mode || "read"} locale={resolvedLocale} scopeTabs={scopeNavigation} navigationQuery={navigationQuery} onNavigationQueryChange={setNavigationQuery} searchQuery={searchRequest.query} searchRevision={searchRequest.revision} hostIntegration={hostIntegration} />
  </main></KnowledgeThemeProvider>;
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

function PageSearchBrowser({ client, formatError, library, currentUserID, initialQuery, subtreeRoot, onOpen, onLibraryAccessRevoked }: { client: KnowledgeClient; formatError: (error: unknown) => string; library: KnowledgeLibrary; currentUserID: string; initialQuery: string; subtreeRoot?: { pageID: string; title: string } | null; onOpen: (hit: KnowledgePageSearchHit) => void; onLibraryAccessRevoked?: (code: string) => void }) {
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
              stopped = true; setACLReady(false); setResult(null); setLoading(false); setError(kt("knowledge.auto.897f5b45da27d8e5")); onLibraryAccessRevoked?.(event.code || ""); abort.abort(); return;
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
  }, [client, library.id, onLibraryAccessRevoked]);
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
      <span className={`knowledge-page-search-type is-${hit.kind}`}><PageTypeIcon type={hit.content_type} filename={hit.title} size={19} /></span>
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
      if (!abort.signal.aborted) { setLibraries(items.filter(library => !library.archived && library.knowledge_configured)); setScopeNotice(complete ? "" : kt("knowledge.auto.97b157ca1311dfa1")); }
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
  return <div className="knowledge-browser-body"><section className="knowledge-search-column"><div className="knowledge-page-intro"><span><FileSearch size={22} /></span><div><h2>{library ? ktf("knowledge.auto.406d87af03e2ab8d", { value0: library.name }) : kt("knowledge.auto.bcce43044c460ab1")}</h2><p>{library ? kt("knowledge.auto.7cfb203ff86e7f98") : kt("knowledge.auto.40a92d225711fdf6")}</p></div></div>{!library && <label className="knowledge-search-scope"><span>{kt("knowledge.auto.8d1e6ff11b4fc658")}</span><Select value={libraryID} onChange={event => setLibraryID(event.target.value)}><option value="">{kt("knowledge.auto.c98c21018a061ff2")}</option>{libraries.map(item => <option key={item.id} value={item.id}>{item.name}{item.archived ? kt("knowledge.auto.de0931324baa0cab") : ""}</option>)}</Select></label>}{scopeNotice && <p className="knowledge-subtle">{scopeNotice}</p>}{!hideSearchForm && <form className="knowledge-search-form" onSubmit={event => { event.preventDefault(); const value = input.trim(); if (value) { setQuery(value); setSearchRevision(current => current + 1); } }}><Search size={18} /><input aria-label={kt("knowledge.auto.45543d0e87fb7c44")} value={input} maxLength={4096} onChange={event => setInput(event.target.value)} placeholder={kt("knowledge.auto.2015563961d26387")} /><Button type="submit" disabled={loading || !input.trim()}>{loading ? kt("knowledge.auto.1dad8492f8c1a0de") : kt("knowledge.auto.44ce7ae909bbb28b")}</Button></form>}{searchStatus?.summary && <p className="knowledge-subtle">{kt("knowledge.auto.c12fe824888f5ae6")}{searchStatus.summary}</p>}{searchStatus?.degraded && <KnowledgeToast key={`${query}:${searchStatus.degraded}`} message={searchStatus.degraded} />}{error && <p role="alert" className="knowledge-error knowledge-page-error">{error}</p>}{!query && <EmptyState><FileSearch size={30} /><h3>{kt("knowledge.auto.24eac2db44aa0e3d")}</h3><p>{kt("knowledge.auto.d765b009bfe712e6")}</p></EmptyState>}{query && !loading && result && hits.length === 0 && <EmptyState><FileText size={30} /><h3>{kt("knowledge.auto.f0dd503cb0a38f84")}</h3><p>{kt("knowledge.auto.d0f11a78ba8e12a2")}</p></EmptyState>}{hits.length > 0 && <div className="knowledge-hit-list">{hits.map(hit => <button key={`${hit.library_id || libraryID || "default"}:${hit.doc_id}`} aria-current={selected?.doc_id === hit.doc_id && (selected.library_id || libraryID || "") === (hit.library_id || libraryID || "") ? "true" : undefined} onClick={() => void read(hit)}><span className="knowledge-hit-icon"><FileText size={19} /></span><span><strong>{hit.title || hit.doc_id}</strong><small>{hit.excerpt || kt("knowledge.auto.8f2325bf12db781a")}</small><em>{kt("knowledge.auto.e0fce50b38bc9515")}{hit.doc_id}{hit.matchedPassages > 1 ? ktf("knowledge.auto.df587bdcfcde70bc", { value0: hit.matchedPassages }) : ""}{citationLocation(hit) ? ` · ${citationLocation(hit)}` : ""}</em>{citationProvenance(hit) && <em>{citationProvenance(hit)}</em>}</span></button>)}</div>}</section><aside className="knowledge-reader" aria-label={kt("knowledge.auto.61fb5da7b2c56eaf")}>{!selected ? <EmptyState><FileText size={34} /><h3>{kt("knowledge.auto.f63c1d21f313cdbb")}</h3><p>{kt("knowledge.auto.7e742866fc7ee1ca")}</p></EmptyState> : reading ? <EmptyState><RefreshCw className="knowledge-spin" size={28} /><p>{kt("knowledge.auto.a252e0c44639b5e5")}</p></EmptyState> : current ? <><header><span className="knowledge-reader-icon"><FileText size={20} /></span><div><h2>{selected.title || current.doc_id || selected.doc_id}</h2><p>{kt("knowledge.auto.e0fce50b38bc9515")}{current.doc_id || selected.doc_id}{current.kb_id ? ktf("knowledge.auto.69e4e85ab419148b", { value0: current.kb_id }) : ""}</p></div></header>{passages.length ? <article className="knowledge-passages">{passages.map((passage, index) => <section key={passage.id || `${passage.doc_id}:${passage.chunk_id || index}`}><small>{kt("knowledge.auto.908e56fe5ed8ba83")}{index + 1}{citationLocation(passage) ? ` · ${citationLocation(passage)}` : ""}{passage.excerpt_truncated ? kt("knowledge.auto.7cd5abe035366012") : ""}</small>{citationProvenance(passage) && <small>{citationProvenance(passage)}</small>}<p>{passage.excerpt || kt("knowledge.auto.857081541b3e7c74")}</p></section>)}</article> : <div className="knowledge-raw-document"><p>{kt("knowledge.auto.f5f9255836b3905d")}</p></div>}{safeURL(selected.url) && <a className="knowledge-source-link" href={safeURL(selected.url)} target="_blank" rel="noopener noreferrer">{kt("knowledge.auto.ae083025a2c99c82")}</a>}</> : <EmptyState><FileText size={34} /><h3>{kt("knowledge.auto.37df5ef6666edc02")}</h3><p>{kt("knowledge.auto.a90d5166fb9f6817")}</p></EmptyState>}</aside></div>;
}

function KnowledgeRecycleBinSettings({ client, library, disabled, formatError }: { client: KnowledgeClient; library: KnowledgeLibrary; disabled: boolean; formatError(error: unknown): string }) {
  const [page, setPage] = useState<KnowledgePageCollectionPage>({ items: [], complete: true });
  const [loading, setLoading] = useState(true);
  const [busyPageID, setBusyPageID] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError("");
    void client.listPageCollection(library.id, "trash", "", 50, abort.signal)
      .then(value => { if (!abort.signal.aborted) setPage(value); })
      .catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, library.id, refresh]);

  async function loadMore() {
    if (loading || page.complete || !page.next_after) return;
    setLoading(true); setError("");
    try {
      const next = await client.listPageCollection(library.id, "trash", page.next_after, 50, AbortSignal.timeout(30_000));
      setPage(current => ({ ...next, items: [...current.items, ...next.items.filter(item => !current.items.some(saved => saved.page.id === item.page.id))] }));
    } catch (failure) { setError(formatError(failure)); }
    finally { setLoading(false); }
  }

  async function restore(pageID: string, revision: number) {
    if (busyPageID || disabled) return;
    setBusyPageID(pageID); setError(""); setNotice("");
    try {
      await client.setPageArchived(library.id, pageID, false, { client_id: crypto.randomUUID(), expected_revision: revision, include_descendants: true }, AbortSignal.timeout(30_000));
      setNotice(kt("knowledge.auto.288d977cf9c4e6d8"));
      setRefresh(value => value + 1);
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusyPageID(""); }
  }

  return <section className="knowledge-settings knowledge-recycle-bin-settings">
    <header><div><h3>{kt("knowledge.auto.ba35dc23b245e61e")}</h3><p>{kt("knowledge.auto.2e0ea58183b60529")}</p></div><Button aria-label={kt("knowledge.auto.aee88743413144a2")} title={kt("knowledge.auto.aee88743413144a2")} disabled={loading || !!busyPageID} onClick={() => setRefresh(value => value + 1)}><RefreshCw className={loading ? "knowledge-spin" : undefined} size={14} /></Button></header>
    {notice && <KnowledgeToast message={notice} onDismiss={setNotice} />}
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    <div className="knowledge-recycle-bin-list">
      {page.items.map(item => <div key={item.page.id} className="knowledge-recycle-bin-item"><PageTypeIcon type={item.page.content_type} filename={item.page.title} size={17} /><span><strong>{item.page.title}</strong><small>{pageTypeMeta[item.page.content_type].label} · {formatKnowledgeDate(item.page.updated_at)}</small></span><Button disabled={disabled || !!busyPageID} onClick={() => void restore(item.page.id, item.page.revision)}>{busyPageID === item.page.id ? kt("knowledge.auto.3310a3aff04dec06") : kt("knowledge.auto.d89a000da895d46b")}</Button></div>)}
      {loading && page.items.length === 0 && <p className="knowledge-recycle-bin-empty"><LoaderCircle className="knowledge-spin" size={15} />{kt("knowledge.auto.3310a3aff04dec06")}</p>}
      {!loading && page.items.length === 0 && <p className="knowledge-recycle-bin-empty">{ktf("knowledge.auto.ff1f95f1d49e6ba9", { value0: kt("knowledge.auto.ba35dc23b245e61e") })}</p>}
      {!page.complete && <Button disabled={loading || !!busyPageID} onClick={() => void loadMore()}>{kt("knowledge.auto.af90a08fec8ee28d")}</Button>}
    </div>
  </section>;
}

export function KnowledgeLibraryManager({ client, currentUserID = "", formatError = defaultErrorMessage, initialLibraryID = "", initialPageID = "", initialBlockID, initialPageMode = "read", locale, scopeTabs, navigationQuery = "", onNavigationQueryChange, searchQuery = "", searchRevision = 0, hostIntegration }: { client: KnowledgeClient; currentUserID?: string; formatError?: (error: unknown) => string; initialLibraryID?: string; initialPageID?: string; initialBlockID?: string; initialPageMode?: "read" | "edit"; locale?: KnowledgeHostLocale; scopeTabs?: (createControl?: ReactNode, branchContent?: ReactNode, libraryCreateControl?: ReactNode) => ReactNode; navigationQuery?: string; onNavigationQueryChange?: (query: string) => void; searchQuery?: string; searchRevision?: number; hostIntegration?: KnowledgeHostIntegration }) {
  const [page, setPage] = useState<KnowledgeLibraryPage>({ items: [], complete: true });
  const [libraryCursors, setLibraryCursors] = useState([""]);
  const [selectedID, setSelectedID] = useState(""), [selected, setSelected] = useState<KnowledgeLibrary | null>(null);
  const [refresh, setRefresh] = useState(0), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  useClearTransientKnowledgeNotice(setNotice, locale);
  const [name, setName] = useState(""), [description, setDescription] = useState("");
  const [members, setMembers] = useState<KnowledgeLibraryMemberPage | null>(null), [memberCursors, setMemberCursors] = useState([""]);
  const [organizationMembers, setOrganizationMembers] = useState<KnowledgeLibraryOrganizationMemberPage | null>(null), [organizationMemberCursors, setOrganizationMemberCursors] = useState([""]);
  const [removeUserID, setRemoveUserID] = useState(""), [removeOrganizationID, setRemoveOrganizationID] = useState("");
  const [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({});
  const [organizationProfiles, setOrganizationProfiles] = useState<Record<string, KnowledgeOrganizationPrincipal>>({});
  const [accessTab, setAccessTab] = useState<KnowledgeAccessTab>("members");
  const [pendingMembers, setPendingMembers] = useState<KnowledgeAccessMemberInput[]>([]);
  const [pendingOrganizations, setPendingOrganizations] = useState<KnowledgeAccessOrganizationInput[]>([]);
  const [documentBusy, setDocumentBusy] = useState(false);
  const [libraryView, setLibraryView] = useState<"content" | "search">("content");
  const [searchTarget, setSearchTarget] = useState<{ pageID: string; mode: "read" | "edit"; location?: KnowledgePageSearchLocation; revision: number } | null>(null);
	const [expandedLibraryID, setExpandedLibraryID] = useState(initialPageID ? initialLibraryID : "");
	const [currentPage, setCurrentPage] = useState<{ pageID: string; title: string } | null>(null);
  const [libraryDialog, setLibraryDialog] = useState<"create" | "manage" | null>(null);
  const [settingsSection, setSettingsSection] = useState<"general" | "members" | "data" | "recycle" | "danger">("general");
  const createReceipt = useRef<SharedLibraryCreateReceipt | null>(null), lock = useRef(false);
  const blocked = busy || documentBusy, libraryCursor = libraryCursors.at(-1) || "", memberCursor = memberCursors.at(-1) || "", organizationMemberCursor = organizationMemberCursors.at(-1) || "";
  const visibleLibraries = page.items.filter(item => !item.archived);

  useLayoutEffect(() => {
    const abort = new AbortController(); setLoading(true); setError("");
    void (async () => {
      const value = await client.listLibraries(libraryCursor, 20, abort.signal);
      if (abort.signal.aborted) return;
      const activeItems = value.items.filter(item => !item.archived);
      setPage(value);
      setSelectedID(current => activeItems.some(item => item.id === current) ? current : activeItems.find(item => item.id === initialLibraryID)?.id || activeItems[0]?.id || "");
    })().catch(failure => { if (!abort.signal.aborted) { setPage({ items: [], complete: true }); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, initialLibraryID, libraryCursor, refresh]);

  useEffect(() => {
    setMembers(null); setOrganizationMembers(null); setRemoveUserID(""); setRemoveOrganizationID("");
    if (!selectedID) { setSelected(null); return; }
    const abort = new AbortController();
    void client.getLibrary(selectedID, abort.signal).then(async value => {
      if (abort.signal.aborted) return;
      setSelected(value); setName(value.name); setDescription(value.description);
      if (value.role === "manager") {
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

  async function perform(action: (signal: AbortSignal) => Promise<void>) {
    if (lock.current || documentBusy) return;
    lock.current = true; setBusy(true); setError(""); setNotice("");
    let succeeded = false;
    try { await action(AbortSignal.timeout(60_000)); succeeded = true; }
    catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); if (succeeded) setRefresh(value => value + 1); }
  }
  function selectResult(value: KnowledgeLibrary, message: string) { setSelectedID(value.id); setSelected(value); setMemberCursors([""]); setOrganizationMemberCursors([""]); setNotice(message); }
  async function createSharedLibrary(request: KnowledgeLibraryCreateInput, signal: AbortSignal) {
    const receipt = sharedLibraryCreateReceipt(request, createReceipt.current);
    createReceipt.current = receipt;
    const value = await createSharedLibraryWithAssignments(client, request, receipt, signal);
    createReceipt.current = null; setLibraryDialog(null); selectResult(value, request.members.length + request.organizations.length > 0 ? ktf("knowledge.auto.d98df64302dddd7f", { value0: value.name, value1: request.organizations.length, value2: request.members.length }) : ktf("knowledge.auto.1496a26a13587274", { value0: value.name }));
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
  async function savePendingMembers(signal: AbortSignal) {
    if (!selected || pendingMembers.length === 0) return;
    let value = selected;
    let revision = members?.revision ?? selected.revision;
    for (const item of pendingMembers) {
      value = await client.setMember(selected.id, item.principal.user_id, item.role, revision, signal);
      revision = value.revision;
    }
    setPendingMembers([]);
    selectResult(value, ktf("knowledge.access.members_saved", { value0: pendingMembers.length }));
  }
  async function removeMember(signal: AbortSignal) {
    if (!selected || !removeUserID) return;
    selectResult(await client.removeMember(selected.id, removeUserID, members?.revision ?? selected.revision, signal), kt("knowledge.auto.e6474f267671ead5")); setRemoveUserID("");
  }
  async function savePendingOrganizations(signal: AbortSignal) {
    if (!selected || pendingOrganizations.length === 0) return;
    let value = selected;
    let revision = organizationMembers?.revision ?? selected.revision;
    for (const item of pendingOrganizations) {
      value = await client.setOrganizationMember(selected.id, item.organization.organization_id, item.role, revision, signal);
      revision = value.revision;
    }
    setPendingOrganizations([]);
    selectResult(value, ktf("knowledge.access.organizations_saved", { value0: pendingOrganizations.length }));
  }
  async function removeOrganizationMember(signal: AbortSignal) {
    if (!selected || !removeOrganizationID) return;
    selectResult(await client.removeOrganizationMember(selected.id, removeOrganizationID, organizationMembers?.revision ?? selected.revision, signal), kt("knowledge.auto.9193fe00205352d8")); setRemoveOrganizationID("");
  }

  function selectLibrary(library: KnowledgeLibrary, expand = true) {
    setSelectedID(library.id);
    if (expand) setExpandedLibraryID(library.id);
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
			pageID: page.id,
			mode: page.mode,
		});
		if (href !== window.location.href) window.history.replaceState(window.history.state, "", href);
	}, [selected]);
	const handleLibraryAccessRevoked = useCallback((code: string) => {
		if (code !== "knowledge.library_not_found" || !selectedID) return;
		const revokedLibraryID = selectedID;
		setLibraryDialog(null);
		setPage(current => ({ ...current, items: current.items.filter(item => item.id !== revokedLibraryID) }));
		setSelectedID(""); setSelected(null); setMembers(null); setOrganizationMembers(null);
		setMemberProfiles({}); setOrganizationProfiles({}); setPendingMembers([]); setPendingOrganizations([]);
		setName(""); setDescription(""); setRemoveUserID(""); setRemoveOrganizationID("");
		setSearchTarget(null); setCurrentPage(null); setLibraryView("content"); setError("");
		setNotice(kt("knowledge.auto.897f5b45da27d8e5"));
		setRefresh(current => current + 1);
	}, [selectedID]);

  function renderLibrary(library: KnowledgeLibrary) {
    return <button key={library.id} className="knowledge-scope-library-link" aria-current={selectedID === library.id ? "true" : undefined} disabled={blocked} onClick={() => selectLibrary(library)}><ChevronRight size={14} /><BookOpen size={15} /><span>{library.name}</span></button>;
  }

  const revealLibraryRail = !selected || libraryView === "search";
  const scopeTabsInLibraryRail = revealLibraryRail;
  const selectableLibraries = selected && !visibleLibraries.some(item => item.id === selected.id) ? [selected, ...visibleLibraries] : visibleLibraries;
  const libraryRailBranch = <div className="knowledge-scope-library-list">
    {loading ? <p className="knowledge-subtle">{kt("knowledge.auto.3310a3aff04dec06")}</p> : visibleLibraries.length ? visibleLibraries.map(renderLibrary) : <p className="knowledge-library-group-empty">{kt("knowledge.auto.00adfc139a6a1320")}</p>}
    {(libraryCursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || libraryCursors.length === 1} onClick={() => { setSelectedID(""); setLibraryCursors(value => value.slice(0, -1)); }}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setSelectedID(""); setLibraryCursors(value => [...value, page.next_after!]); }}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
  </div>;
  const pageScopeTabs = (createControl?: ReactNode, branchContent?: ReactNode) => scopeTabs?.(createControl, branchContent || libraryRailBranch);

  return <div className={`managed-library-browser${revealLibraryRail ? " has-library-rail" : ""}`}>
    <aside className="managed-library-list">
      {scopeTabsInLibraryRail && <div className="knowledge-library-rail-toolbar"><Button aria-label={kt("knowledge.auto.601bdf61c4cb8e38")} title={kt("knowledge.auto.601bdf61c4cb8e38")} disabled={blocked} onClick={openSharedLibraryCreate}><Plus size={16} /></Button></div>}
      {scopeTabsInLibraryRail && scopeTabs?.(undefined, libraryRailBranch)}
      {error && <p role="alert" className="knowledge-error">{error}</p>}
    </aside>
    <section className="managed-library-content">{notice && <KnowledgeToast message={notice} onDismiss={setNotice} />}{selected ? <>
      <div className={`knowledge-library-surface${libraryView === "search" ? " is-search" : " is-pages"}`}>
        {libraryView === "search" ? <PageSearchBrowser key={`${selected.id}:${searchRevision}`} client={client} formatError={formatError} library={selected} currentUserID={currentUserID} initialQuery={searchQuery} subtreeRoot={currentPage} onOpen={hit => { setExpandedLibraryID(selected.id); setSearchTarget(current => ({ pageID: hit.page_id, mode: hit.publication_status === "unpublished" ? "edit" : "read", location: hit.location, revision: (current?.revision || 0) + 1 })); setLibraryView("content"); }} onLibraryAccessRevoked={handleLibraryAccessRevoked} /> : <KnowledgePagesPanel client={client} library={selected} currentUserID={currentUserID} disabled={blocked} formatError={formatError} embedded initialPageID={searchTarget?.pageID || (selected.id === initialLibraryID ? initialPageID : "")} initialBlockID={!searchTarget && selected.id === initialLibraryID ? initialBlockID : undefined} initialSearchLocation={searchTarget?.location} initialPageMode={searchTarget?.mode || (selected.id === initialLibraryID ? initialPageMode : "read")} locale={locale} scopeTabs={!scopeTabsInLibraryRail ? pageScopeTabs : undefined} navigationQuery={navigationQuery} onNavigationQueryChange={onNavigationQueryChange} libraries={selectableLibraries} selectedLibraryID={selectedID} expandedLibraryID={expandedLibraryID} pageTreeEnabled={expandedLibraryID === selected.id} hostIntegration={hostIntegration} onLibrarySelect={libraryID => { const library = selectableLibraries.find(item => item.id === libraryID); if (library) selectLibrary(library, false); }} onLibraryExpandedChange={libraryID => { setExpandedLibraryID(libraryID); if (libraryID && libraryID !== selectedID) { const library = selectableLibraries.find(item => item.id === libraryID); if (library) selectLibrary(library, false); } }} onCreateLibrary={openSharedLibraryCreate} onSelectionChange={updateCurrentPage} onPageTransferred={(target, pageID) => { setExpandedLibraryID(target.id); selectLibrary(target); setSearchTarget(current => ({ pageID, mode: "read", revision: (current?.revision || 0) + 1 })); }} onManage={selected.role === "manager" ? () => { setSettingsSection("general"); setLibraryDialog("manage"); } : undefined} onLibraryAccessRevoked={handleLibraryAccessRevoked} />}
      </div>
      {libraryDialog === "manage" && selected.role === "manager" && createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !blocked) setLibraryDialog(null); }}><section className="knowledge-manager-dialog knowledge-library-management-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.settings.title")}><header><div><h2>{kt("knowledge.settings.title")} · {selected.name}</h2><p>{kt("knowledge.settings.description")}</p></div><Button aria-label={kt("knowledge.auto.94ed309773648919")} disabled={blocked} onClick={() => setLibraryDialog(null)}><X size={17} /></Button></header><div className="knowledge-library-settings-layout"><nav className="knowledge-library-settings-nav" role="tablist" aria-label={kt("knowledge.settings.title")}>
        <button type="button" role="tab" aria-selected={settingsSection === "general"} onClick={() => setSettingsSection("general")}><Settings size={16} /><span>{kt("knowledge.settings.general")}</span></button>
        <button type="button" role="tab" aria-selected={settingsSection === "members"} onClick={() => setSettingsSection("members")}><UserRoundCog size={16} /><span>{kt("knowledge.settings.members")}</span></button>
        <button type="button" role="tab" aria-selected={settingsSection === "data"} onClick={() => setSettingsSection("data")}><Database size={16} /><span>{kt("knowledge.settings.data_index")}</span></button>
        <button type="button" role="tab" aria-selected={settingsSection === "recycle"} onClick={() => setSettingsSection("recycle")}><Trash2 size={16} /><span>{kt("knowledge.auto.ba35dc23b245e61e")}</span></button>
        <button type="button" role="tab" aria-selected={settingsSection === "danger"} onClick={() => setSettingsSection("danger")}><ShieldAlert size={16} /><span>{kt("knowledge.settings.danger")}</span></button>
      </nav><div className="knowledge-dialog-scroll knowledge-management-sections">
        {settingsSection === "general" && <section className="knowledge-settings"><header><div><h3>{kt("knowledge.settings.general")}</h3><p>{kt("knowledge.settings.general_description")}</p></div></header><div className="knowledge-form-grid"><label>{kt("knowledge.auto.d44e9b3d3b31d37b")}<input value={name} maxLength={128} disabled={blocked} onChange={event => setName(event.target.value)} /></label><label>{kt("knowledge.auto.4262c45dc797bb0c")}<textarea value={description} maxLength={1024} disabled={blocked} onChange={event => setDescription(event.target.value)} /></label></div><div className="knowledge-actions"><Button className="primary" disabled={blocked || !name.trim()} onClick={() => void perform(save)}>{kt("knowledge.auto.769c4f866e6248b3")}</Button></div></section>}
        {settingsSection === "data" && <KnowledgeDocumentsPanel client={client} initialLibrary={selected} formatError={formatError} onBusyChange={setDocumentBusy} onOpenLibrary={libraryID => { const library = selectableLibraries.find(item => item.id === libraryID); if (library) { setLibraryDialog(null); selectLibrary(library); } }} showUploader={false} managementMode />}
        {settingsSection === "members" && <section className="knowledge-members knowledge-library-access-settings">
          <header><div><h3>{kt("knowledge.settings.members")}</h3><p>{ktf("knowledge.settings.members_scope_description", { value0: selected.name })}</p></div></header>
          <KnowledgeAccessTabs value={accessTab} disabled={blocked} onChange={value => { setAccessTab(value); setRemoveUserID(""); setRemoveOrganizationID(""); }} />
          {accessTab === "members" ? <>
            <div className="knowledge-member-list">{members?.items.map(member => { const profile = memberProfiles[member.user_id]; return <div className="knowledge-member" key={member.user_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || "?").slice(0, 1)}</span><span>{profile?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}<small>{profile?.email || member.user_id}</small></span><span className="knowledge-member-role">{roles[member.role]}</span><Button disabled={blocked} onClick={() => { if (profile) setPendingMembers([{ principal: { ...profile }, role: member.role }]); setRemoveUserID(""); }}>{kt("knowledge.auto.f65c42a2540befe5")}</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveUserID(member.user_id)}>{kt("knowledge.auto.6135d4159e892541")}</Button></div>; })}</div>
            {members && (memberCursors.length > 1 || !members.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || memberCursors.length === 1} onClick={() => setMemberCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || !members.next_after} onClick={() => setMemberCursors(value => [...value, members.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
          </> : <>
            <div className="knowledge-member-list">{organizationMembers?.items.map(member => { const profile = organizationProfiles[member.organization_id]; return <div className="knowledge-member" key={member.organization_id}><span className="knowledge-member-avatar" aria-hidden="true">{(profile?.display_name || kt("knowledge.auto.76acfbf2e9e3914e")).slice(0, 1)}</span><span>{profile?.display_name || kt("knowledge.auto.f1f89ccbe79089d0")}<small>{profile?.node_type || kt("knowledge.auto.b4d203dea5b9121c")} · {roles[member.role]}</small></span><Button disabled={blocked} onClick={() => { const organization = { organization_id: member.organization_id, display_name: profile?.display_name || member.organization_id, node_type: profile?.node_type, depth: 0, sort_order: 0, status: "active" as const }; setPendingOrganizations([{ organization, role: member.role }]); setRemoveOrganizationID(""); }}>{kt("knowledge.auto.f65c42a2540befe5")}</Button><Button className="danger" disabled={blocked} onClick={() => setRemoveOrganizationID(member.organization_id)}>{kt("knowledge.auto.6135d4159e892541")}</Button></div>; })}</div>
            {organizationMembers && (organizationMemberCursors.length > 1 || !organizationMembers.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || organizationMemberCursors.length === 1} onClick={() => setOrganizationMemberCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || !organizationMembers.next_after} onClick={() => setOrganizationMemberCursors(value => [...value, organizationMembers.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
          </>}
          <KnowledgeAccessSelector client={client} activeTab={accessTab} busy={blocked} members={pendingMembers} organizations={pendingOrganizations} onMembersChange={setPendingMembers} onOrganizationsChange={setPendingOrganizations} />
          <div className="knowledge-actions"><Button className="primary" disabled={blocked || (accessTab === "members" ? pendingMembers.length === 0 : pendingOrganizations.length === 0)} onClick={() => void perform(accessTab === "members" ? savePendingMembers : savePendingOrganizations)}>{accessTab === "members" ? kt("knowledge.access.save_members") : kt("knowledge.access.save_organizations")}</Button></div>
          {removeUserID && <div className="knowledge-confirm"><p>{kt("knowledge.auto.1f695b59d94f04e8")}{memberProfiles[removeUserID]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}{kt("knowledge.auto.834dc53738e7d427")}{selected.name}{kt("knowledge.auto.b1c875248568c170")}</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeMember)}>{kt("knowledge.auto.ee7dea070d88bb3c")}</Button><Button disabled={blocked} onClick={() => setRemoveUserID("")}>{kt("knowledge.auto.818ed614454d928d")}</Button></div></div>}
          {removeOrganizationID && <div className="knowledge-confirm"><p>{kt("knowledge.auto.1f695b59d94f04e8")}{organizationProfiles[removeOrganizationID]?.display_name || removeOrganizationID}{kt("knowledge.auto.834dc53738e7d427")}{selected.name}{kt("knowledge.auto.3599a3fa4bba28ff")}</p><div className="knowledge-actions"><Button className="danger" disabled={blocked} onClick={() => void perform(removeOrganizationMember)}>{kt("knowledge.auto.ee7dea070d88bb3c")}</Button><Button disabled={blocked} onClick={() => setRemoveOrganizationID("")}>{kt("knowledge.auto.4fff93b49e48864d")}</Button></div></div>}
        </section>}
        {settingsSection === "recycle" && <KnowledgeRecycleBinSettings client={client} library={selected} disabled={blocked} formatError={formatError} />}
        {settingsSection === "danger" && <section className="knowledge-settings knowledge-danger-zone"><header><div><h3>{kt("knowledge.settings.danger")}</h3><p>{kt("knowledge.settings.danger_description")}</p></div></header><div className="knowledge-danger-action"><div><strong>{selected.archived ? kt("knowledge.auto.96b4fdf4b952fc9d") : kt("knowledge.auto.4c31a6e16e6906a3")}</strong><p>{kt("knowledge.settings.danger_description")}</p></div><Button className={selected.archived ? undefined : "danger"} disabled={blocked} onClick={() => void perform(setArchived)}>{selected.archived ? kt("knowledge.auto.96b4fdf4b952fc9d") : kt("knowledge.auto.4c31a6e16e6906a3")}</Button></div></section>}
        {error && <p role="alert" className="knowledge-error">{error}</p>}
      </div></div></section></div>, window.document.body)}
    </> : !loading ? <EmptyState><FolderOpen size={32} /><h3>{visibleLibraries.length > 0 ? kt("knowledge.auto.f331b7a3d88c9e2b") : kt("knowledge.auto.00adfc139a6a1320")}</h3><p>{kt("knowledge.auto.170d70cc541db069")}</p>{visibleLibraries.length === 0 && <Button className="primary" disabled={blocked} onClick={openSharedLibraryCreate}><BookOpen size={15} />{kt("knowledge.auto.601bdf61c4cb8e38")}</Button>}</EmptyState> : null}</section>
    {libraryDialog === "create" && <KnowledgeLibraryCreateDialog client={client} busy={blocked} error={error} onClose={closeSharedLibraryCreate} onCreate={input => void perform(signal => createSharedLibrary(input, signal))} />}
  </div>;
}

export function KnowledgeLibraryManagerDialog({ client, formatError = defaultErrorMessage, onClose }: { client: KnowledgeClient; formatError?: (error: unknown) => string; onClose(): void }) {
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation"><section className="knowledge-manager-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.975b35f9c2b1148c")}><header><div><h2>{kt("knowledge.auto.975b35f9c2b1148c")}</h2><p>{kt("knowledge.settings.description")}</p></div><Button aria-label={kt("knowledge.auto.3fd47edce45b3603")} onClick={onClose}><X size={17} /></Button></header><KnowledgeLibraryManager client={client} formatError={formatError} /></section></div>, window.document.body);
}
