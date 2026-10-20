import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Activity, ArrowDown, ArrowUp, BookOpen, Check, ChevronDown, ChevronRight, Clock3, Cloud, Copy, FilePlus2, FileSpreadsheet, FileText, GitBranch, GitMerge, LayoutGrid, ListChecks, ListTree, MessageSquare, MoreHorizontal, Network, Paintbrush, Paperclip, Pencil, Plus, Presentation, RefreshCw, Save, Search, Send, Settings, ShieldCheck, Table2, Upload, Users, Wifi } from "lucide-react";
import { Button, EmptyState } from "./components.tsx";
import { knowledgeDocumentAccept, sha256 } from "./document.ts";
import type { KnowledgeAccessExplanation, KnowledgeClient, KnowledgeDocument, KnowledgeLibrary, KnowledgePage, KnowledgePageAccessGrant, KnowledgePageAccessPolicy, KnowledgePageAttachment, KnowledgePageComment, KnowledgePageConflict, KnowledgePageMoveImpact, KnowledgePageVersion, KnowledgePageVersionDiff, KnowledgePageView, KnowledgePrincipal } from "./types.ts";
import { useKnowledgeCollaboration } from "./useKnowledgeCollaboration.ts";
import { nativePageTypes, pageTypeMeta } from "./pageTypeRegistry.ts";
import { KnowledgeEditor } from "./editors/KnowledgeEditor.tsx";
import type { KnowledgeEditorChange } from "./editors/types.ts";
import type { KnowledgePageContentType } from "./types.ts";
import { appendDocumentImage, documentOutline, documentStats } from "./documentContent.ts";

const pageSchemaVersion = 2;

type PendingPageSave = {
  clientID: string;
  pageID: string;
  expectedDraftRevision: number;
  expectedPageRevision: number;
  title: string;
  body: string;
  parentPageID?: string;
  rank: string;
};

type PendingPagePublish = {
  clientID: string;
  pageID: string;
  expectedDraftRevision: number;
  expectedPageRevision: number;
  publishNote?: string;
};

type PendingPageMove = { page: KnowledgePage; parentPageID: string; impact: KnowledgePageMoveImpact };
type KnowledgeDocumentsSlotProps = {
  selectedDocumentID: string;
  showUploader: boolean;
  onDocumentsChange(documents: KnowledgeDocument[]): void;
  onSelectedDocumentChange(documentID: string): void;
};

export async function pageContentSHA256(content: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

function errorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error && typeof error.status === "number") return error.status;
  return 0;
}

function pageConflict(error: unknown): KnowledgePageConflict | null {
  if (typeof error !== "object" || error === null || !("conflict" in error)) return null;
  const value = error.conflict;
  if (typeof value !== "object" || value === null || !("current_draft_revision" in value) || typeof value.current_draft_revision !== "number") return null;
  return value as KnowledgePageConflict;
}

function projectionLabel(page: KnowledgePage) {
  return ({ queued: "等待索引", indexing: "正在索引", ready: "已可检索", failed: "索引失败", none: "尚未索引" })[page.projection_status || "none"];
}

const collaboratorColors = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"];

function collaboratorColor(userID: string) {
  return collaboratorColors[[...userID].reduce((sum, character) => sum + character.codePointAt(0)!, 0) % collaboratorColors.length];
}

function PageTypeIcon({ type, size = 16 }: { type: KnowledgePageContentType; size?: number }) {
  const Icon = ({ document: FileText, multidimensional_table: LayoutGrid, spreadsheet: FileSpreadsheet, presentation: Presentation, form: ListChecks, mind_note: ListTree, whiteboard: Paintbrush, mind_map: Network, flowchart: GitBranch } as const)[type] || Table2;
  return <Icon size={size} aria-hidden="true" />;
}

export function KnowledgePagesPanel({ client, library, disabled, formatError, embedded = false, documents, onManage }: { client: KnowledgeClient; library: KnowledgeLibrary; disabled: boolean; formatError(error: unknown): string; embedded?: boolean; documents?: (props: KnowledgeDocumentsSlotProps) => ReactNode; onManage?: () => void }) {
  const canWrite = !library.archived && (library.role === "editor" || library.role === "manager");
  const [children, setChildren] = useState<Record<string, KnowledgePage[]>>({}), [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [childrenCursor, setChildrenCursor] = useState<Record<string, string>>({}), [childrenComplete, setChildrenComplete] = useState<Record<string, boolean>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [selectedID, setSelectedID] = useState(""), [view, setView] = useState<KnowledgePageView | null>(null), [loading, setLoading] = useState(true);
  const [localFilter, setLocalFilter] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [createMenuPosition, setCreateMenuPosition] = useState({ top: 0, left: 0, maxHeight: 560 });
  const [entryKind, setEntryKind] = useState<"page" | "documents">("page"), [dragged, setDragged] = useState<KnowledgePage | null>(null);
  const [documentEntries, setDocumentEntries] = useState<KnowledgeDocument[]>([]), [selectedDocumentID, setSelectedDocumentID] = useState(""), [showDocumentUploader, setShowDocumentUploader] = useState(false);
  const [mode, setMode] = useState<"read" | "edit" | "history" | "outline" | "comments" | "activity" | "access" | "permissions">("read");
  const [title, setTitle] = useState(""), [body, setBody] = useState(""), [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "conflict" | "error">("idle");
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "error">("idle");
  const [saveConflict, setSaveConflict] = useState<KnowledgePageConflict | null>(null);
  const [publishNote, setPublishNote] = useState("");
  const [versions, setVersions] = useState<KnowledgePageVersion[]>([]), [diff, setDiff] = useState<KnowledgePageVersionDiff | null>(null), [compare, setCompare] = useState<number[]>([]);
  const [versionBefore, setVersionBefore] = useState(0), [versionsComplete, setVersionsComplete] = useState(true);
  const [historyPreview, setHistoryPreview] = useState<KnowledgePageVersion | null>(null);
  const [comments, setComments] = useState<KnowledgePageComment[]>([]), [commentBody, setCommentBody] = useState(""), [unresolvedOnly, setUnresolvedOnly] = useState(false);
  const [commentAfter, setCommentAfter] = useState(""), [commentsComplete, setCommentsComplete] = useState(true);
  const [editingCommentID, setEditingCommentID] = useState(""), [editingCommentBody, setEditingCommentBody] = useState("");
  const [memberQuery, setMemberQuery] = useState(""), [mentionCandidates, setMentionCandidates] = useState<KnowledgePrincipal[]>([]), [mentionedUserIDs, setMentionedUserIDs] = useState<string[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({}), [replyingTo, setReplyingTo] = useState("");
  const [attachments, setAttachments] = useState<KnowledgePageAttachment[]>([]), [attaching, setAttaching] = useState(false);
  const [accessQuery, setAccessQuery] = useState(""), [accessPrincipals, setAccessPrincipals] = useState<KnowledgePrincipal[]>([]), [accessUserID, setAccessUserID] = useState("");
  const [accessAction, setAccessAction] = useState("knowledge.pages.get"), [accessExplanation, setAccessExplanation] = useState<KnowledgeAccessExplanation | null>(null);
  const [pageAccess, setPageAccess] = useState<KnowledgePageAccessPolicy | null>(null), [permissionMode, setPermissionMode] = useState<"inherit" | "restricted">("inherit");
  const [permissionGrants, setPermissionGrants] = useState<KnowledgePageAccessGrant[]>([]), [permissionQuery, setPermissionQuery] = useState(""), [permissionPrincipals, setPermissionPrincipals] = useState<KnowledgePrincipal[]>([]);
  const [permissionRole, setPermissionRole] = useState<KnowledgePageAccessGrant["role"]>("reader"), [permissionScope, setPermissionScope] = useState<KnowledgePageAccessGrant["scope"]>("page"), [permissionSaving, setPermissionSaving] = useState(false);
  const [pendingMove, setPendingMove] = useState<PendingPageMove | null>(null);
  const viewRef = useRef<KnowledgePageView | null>(null), editRef = useRef({ title: "", body: "" }), saveQueue = useRef(Promise.resolve());
  const pendingSaveRef = useRef<PendingPageSave | null>(null), pendingPublishRef = useRef<PendingPagePublish | null>(null);
  const editAfterSelectRef = useRef("");
  const treeButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const createMenuAnchorRef = useRef<HTMLDivElement | null>(null), createMenuRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const collaboration = useKnowledgeCollaboration({
    active: mode === "edit" && canWrite && !!selectedID && !!view?.draft && view.page.content_type === "document",
    client,
    libraryID: library.id,
    pageID: selectedID,
    initialTitle: title,
    initialContent: body,
    onDocument(nextTitle, nextBody, synced) {
      setTitle(nextTitle); setBody(nextBody); editRef.current = { title: nextTitle, body: nextBody };
      setDirty(!synced); setSaveState(synced ? "saved" : "saving"); setSaveConflict(null);
    },
    onError(failure) { setError(formatError(failure)); },
  });

  function focusTreePage(pageID: string) {
    setEntryKind("page");
    setSelectedID(pageID);
    window.setTimeout(() => treeButtonRefs.current[pageID]?.focus());
  }

  async function resolveProfiles(userIDs: string[], signal: AbortSignal) {
    const unique = [...new Set(userIDs.filter(Boolean))];
    if (unique.length === 0) return;
    try {
      const profiles = await client.resolvePrincipals(unique, signal);
      if (!signal.aborted) setMemberProfiles(current => ({ ...current, ...Object.fromEntries(profiles.filter(profile => profile.status === "active").map(profile => [profile.user_id, profile])) }));
    } catch {
      // The content remains readable; unavailable identities render as such.
    }
  }

  async function loadChildren(parentPageID = "", signal = AbortSignal.timeout(30_000), append = false) {
    const page = await client.listPages(library.id, parentPageID, append ? childrenCursor[parentPageID] || "" : "", 50, showArchived, signal);
    setChildren(current => ({ ...current, [parentPageID]: append ? [...(current[parentPageID] || []), ...page.items] : page.items }));
    setChildrenCursor(current => ({ ...current, [parentPageID]: page.next_after || "" }));
    setChildrenComplete(current => ({ ...current, [parentPageID]: page.complete }));
    if (!selectedID && parentPageID === "" && page.items[0]) setSelectedID(page.items[0].id);
  }

  useEffect(() => {
    const abort = new AbortController();
    setChildren({}); setChildrenCursor({}); setChildrenComplete({}); setExpanded(new Set()); setSelectedID(""); setView(null); setLoading(true); setError("");
    setEntryKind("page"); setCreateMenuOpen(false); setDocumentEntries([]); setSelectedDocumentID(""); setShowDocumentUploader(false); editAfterSelectRef.current = "";
    void loadChildren("", abort.signal).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, library.id, showArchived]);

  useEffect(() => {
    if (!documents) { setDocumentEntries([]); return; }
    const abort = new AbortController();
    void client.listDocuments(library.id, "", 50, abort.signal).then(page => {
      if (!abort.signal.aborted) setDocumentEntries(page.items);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, !!documents]);

  useEffect(() => {
    if (!selectedID) { setView(null); return; }
    const abort = new AbortController(); setLoading(true); setError(""); pendingSaveRef.current = null; pendingPublishRef.current = null;
    void client.getPage(library.id, selectedID, canWrite, abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setView(value); viewRef.current = value;
      const source = value.draft || value.published;
      setTitle(source?.title || value.page.title); setBody(source?.body.content || ""); editRef.current = { title: source?.title || value.page.title, body: source?.body.content || "" };
      const editAfterSelect = editAfterSelectRef.current === value.page.id;
      if (editAfterSelect) editAfterSelectRef.current = "";
      setDirty(false); setSaveState("idle"); setPublishState("idle"); setSaveConflict(null); setMode(editAfterSelect ? "edit" : "read"); setDiff(null); setCompare([]); setHistoryPreview(null);
      setVersions([]); setVersionBefore(0); setVersionsComplete(true); setComments([]); setCommentAfter(""); setCommentsComplete(true); setPageAccess(null); setPermissionGrants([]); setPendingMove(null);
      if (value.published?.published_by_user_id) void resolveProfiles([value.published.published_by_user_id], abort.signal);
      if (editAfterSelect) window.setTimeout(() => titleInputRef.current?.select());
    }).catch(failure => { if (!abort.signal.aborted) { setView(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [canWrite, client, formatError, library.id, selectedID]);

  useEffect(() => {
    if (!dirty || mode !== "edit" || !view?.draft || disabled || collaboration.available) return;
    const timer = window.setTimeout(() => void saveDraft(), 900);
    return () => window.clearTimeout(timer);
  }, [body, collaboration.available, dirty, disabled, mode, title]);

  useEffect(() => {
    const userIDs = collaboration.presence.map(item => item.user_id);
    if (userIDs.length === 0) return;
    const abort = new AbortController();
    void resolveProfiles(userIDs, abort.signal);
    return () => abort.abort();
  }, [collaboration.presence]);

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (dirty || saveState === "saving") event.preventDefault(); };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty, saveState]);

  useEffect(() => {
    if (!createMenuOpen) return;
    const position = () => {
      const anchor = createMenuAnchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect(), width = 280, gap = 7, viewportMargin = 8;
      const left = Math.max(viewportMargin, Math.min(rect.right - width, window.innerWidth - width - viewportMargin));
      const spaceBelow = window.innerHeight - rect.bottom - gap - viewportMargin;
      const spaceAbove = rect.top - gap - viewportMargin;
      const openAbove = spaceBelow < 320 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(180, Math.min(560, openAbove ? spaceAbove : spaceBelow));
      setCreateMenuPosition({ top: openAbove ? rect.top - gap - maxHeight : rect.bottom + gap, left, maxHeight });
    };
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!createMenuAnchorRef.current?.contains(target) && !createMenuRef.current?.contains(target)) setCreateMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCreateMenuOpen(false);
      createMenuAnchorRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [createMenuOpen]);

  useEffect(() => {
    if ((mode !== "history" && mode !== "activity") || !selectedID) return;
    const abort = new AbortController();
    void client.listPageVersions(library.id, selectedID, 0, 50, abort.signal).then(page => { if (!abort.signal.aborted) { setVersions(page.items); setVersionBefore(page.next_before || 0); setVersionsComplete(page.complete); void resolveProfiles(page.items.map(item => item.published_by_user_id), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID]);

  useEffect(() => {
    if ((mode !== "comments" && mode !== "activity") || !selectedID) return;
    const abort = new AbortController();
    void client.listPageComments(library.id, selectedID, "", 50, mode === "comments" && unresolvedOnly, abort.signal).then(page => { if (!abort.signal.aborted) { setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete); void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...item.mentioned_user_ids]), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID, unresolvedOnly]);

  useEffect(() => {
    if (!selectedID) { setAttachments([]); return; }
    const abort = new AbortController();
    void client.listPageAttachments(library.id, selectedID, abort.signal).then(page => { if (!abort.signal.aborted) setAttachments(page.items); }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, selectedID]);

  useEffect(() => {
    if (mode !== "comments") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchLibraryMembers(library.id, memberQuery.trim(), "", 100, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setMentionCandidates(page.items);
      setMemberProfiles(current => ({ ...current, ...Object.fromEntries(page.items.map(item => [item.user_id, item])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, memberQuery, mode]);

  useEffect(() => {
    if (mode !== "access" || library.role !== "manager") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchPrincipals(accessQuery.trim(), "", 20, abort.signal).then(page => {
      if (!abort.signal.aborted) setAccessPrincipals(page.items.filter(item => item.status === "active"));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [accessQuery, client, formatError, library.role, mode]);

  useEffect(() => {
    if (mode !== "access" || library.role !== "manager" || !selectedID || !accessUserID) { setAccessExplanation(null); return; }
    const abort = new AbortController();
    void client.explainAccess(library.id, { user_id: accessUserID, page_id: selectedID, action: accessAction }, abort.signal).then(value => {
      if (!abort.signal.aborted) setAccessExplanation(value);
    }).catch(failure => { if (!abort.signal.aborted) { setAccessExplanation(null); setError(formatError(failure)); } });
    return () => abort.abort();
  }, [accessAction, accessUserID, client, formatError, library.id, library.role, mode, selectedID]);

  useEffect(() => {
    if (mode !== "permissions" || library.role !== "manager" || !selectedID || !client.getPageAccess) return;
    const abort = new AbortController();
    void client.getPageAccess(library.id, selectedID, abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setPageAccess(value); setPermissionMode(value.mode); setPermissionGrants(value.grants);
      void resolveProfiles(value.grants.map(grant => grant.user_id), abort.signal);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, library.role, mode, selectedID]);

  useEffect(() => {
    if (mode !== "permissions" || library.role !== "manager" || permissionMode !== "restricted") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchLibraryMembers(library.id, permissionQuery.trim(), "", 50, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setPermissionPrincipals(page.items);
      setMemberProfiles(current => ({ ...current, ...Object.fromEntries(page.items.map(item => [item.user_id, item])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, library.role, mode, permissionMode, permissionQuery]);

  async function toggle(page: KnowledgePage) {
    const next = new Set(expanded);
    if (next.has(page.id)) next.delete(page.id); else { next.add(page.id); if (!children[page.id]) await loadChildren(page.id); }
    setExpanded(next);
  }

  function rows(parent = "", depth = 0): { page?: KnowledgePage; parent: string; depth: number; loadMore?: boolean }[] {
    const items = (children[parent] || []).filter(page => !localFilter || page.title.toLocaleLowerCase().includes(localFilter.toLocaleLowerCase()));
    const visible: { page?: KnowledgePage; parent: string; depth: number; loadMore?: boolean }[] = items.flatMap(page => [{ page, parent, depth }, ...(expanded.has(page.id) ? rows(page.id, depth + 1) : [])]);
    if (!localFilter && children[parent] && childrenComplete[parent] === false) visible.push({ parent, depth, loadMore: true });
    return visible;
  }

  async function createPage(contentType: KnowledgePageContentType) {
    if (!canWrite) return;
    try {
      const parentPageID = entryKind === "page" ? selectedID : "";
      const meta = pageTypeMeta[contentType];
      const value = await client.createPage(library.id, { client_id: crypto.randomUUID(), parent_page_id: parentPageID || undefined, title: meta.title, content_type: contentType }, AbortSignal.timeout(30_000));
      if (parentPageID) setExpanded(current => new Set(current).add(parentPageID));
      setEntryKind("page"); setNotice(`已在当前节点下创建${meta.label}，正在编辑。`); editAfterSelectRef.current = value.page.id;
      await loadChildren(value.page.parent_page_id || ""); setSelectedID(value.page.id);
    } catch (failure) { setError(formatError(failure)); }
  }

  function saveDraft() {
    const current = viewRef.current;
    if (!current?.draft || !canWrite) return saveQueue.current;
    const snapshot = { ...editRef.current };
    setSaveState("saving"); setSaveConflict(null); setError("");
    saveQueue.current = saveQueue.current.then(async () => {
      const latest = viewRef.current;
      if (!latest?.draft) return;
      const pending = pendingSaveRef.current || {
        clientID: crypto.randomUUID(), pageID: latest.page.id,
        expectedDraftRevision: latest.draft.draft_revision, expectedPageRevision: latest.page.revision,
        title: snapshot.title, body: snapshot.body, parentPageID: latest.draft.parent_page_id, rank: latest.draft.rank,
      };
      pendingSaveRef.current = pending;
      const hash = await pageContentSHA256(pending.body);
      const saved = await client.savePageDraft(library.id, pending.pageID, {
        client_id: pending.clientID, expected_draft_revision: pending.expectedDraftRevision, expected_page_revision: pending.expectedPageRevision,
        title: pending.title.trim(), parent_page_id: pending.parentPageID, rank: pending.rank,
        content_schema_version: pageSchemaVersion, content: pending.body, content_sha256: hash,
      }, AbortSignal.timeout(30_000));
      pendingSaveRef.current = null;
      viewRef.current = saved; setView(saved);
      const unchanged = editRef.current.title === pending.title && editRef.current.body === pending.body;
      setDirty(!unchanged); setSaveState(unchanged ? "saved" : "idle");
    }).catch(failure => {
      if (errorStatus(failure) === 409) { setSaveState("conflict"); setSaveConflict(pageConflict(failure)); } else setSaveState("error");
      setError(formatError(failure));
    });
    return saveQueue.current;
  }

  async function publish() {
    if (!viewRef.current?.draft || !canWrite) return;
    if (collaboration.available) {
      setPublishState("publishing"); setError("");
      try {
        const published = await collaboration.publish(publishNote.trim() || undefined);
        viewRef.current = published; setView(published); setPublishNote(""); setDirty(false); setPublishState("idle"); setMode("read"); setNotice("协作快照已冻结并发布；所有在线成员看到的是同一版本。"); await loadChildren(published.page.parent_page_id || "");
      } catch (failure) {
        setPublishState("error"); setError(formatError(failure));
      }
      return;
    }
    if (dirty) await saveDraft();
    const latest = viewRef.current;
    if (!latest?.draft || saveState === "conflict" || pendingSaveRef.current) return;
    setPublishState("publishing"); setError("");
    try {
      const pending = pendingPublishRef.current || {
        clientID: crypto.randomUUID(), pageID: latest.page.id,
        expectedPageRevision: latest.page.revision, expectedDraftRevision: latest.draft.draft_revision,
        publishNote: publishNote.trim() || undefined,
      };
      pendingPublishRef.current = pending;
      const published = await client.publishPage(library.id, pending.pageID, { client_id: pending.clientID, expected_page_revision: pending.expectedPageRevision, expected_draft_revision: pending.expectedDraftRevision, publish_note: pending.publishNote }, AbortSignal.timeout(60_000));
      pendingPublishRef.current = null;
      viewRef.current = published; setView(published); setPublishNote(""); setDirty(false); setPublishState("idle"); setMode("read"); setNotice("页面已发布；页面可以立即阅读，检索状态以页面标记为准。"); await loadChildren(published.page.parent_page_id || "");
    } catch (failure) {
      setPublishState("error");
      if (errorStatus(failure) === 409) { setSaveState("conflict"); setSaveConflict(pageConflict(failure)); }
      setError(formatError(failure));
    }
  }

  async function commitMove(page: KnowledgePage, parentPageID: string, accessImpactToken = "") {
    await client.movePage(library.id, page.id, { client_id: crypto.randomUUID(), expected_revision: page.revision, parent_page_id: parentPageID || undefined, rank: page.rank, access_impact_token: accessImpactToken || undefined }, AbortSignal.timeout(30_000));
    setPendingMove(null); setNotice("页面与子树权限继承已在同一事务中更新。"); await loadChildren(page.parent_page_id || ""); await loadChildren(parentPageID);
  }

  async function move(page: KnowledgePage, parentPageID: string) {
    if (!canWrite || page.id === parentPageID) return;
    try {
      if (library.role === "manager" && client.previewPageMove) {
        const impact = await client.previewPageMove(library.id, page.id, { parent_page_id: parentPageID || undefined, rank: page.rank }, AbortSignal.timeout(30_000));
        if (impact.requires_confirm) {
          setPendingMove({ page, parentPageID, impact });
          void resolveProfiles(impact.changed_user_ids, AbortSignal.timeout(30_000));
          return;
        }
        await commitMove(page, parentPageID, impact.token);
        return;
      }
      await commitMove(page, parentPageID);
    } catch (failure) { setError(formatError(failure)); }
  }

  function addPermissionGrant(principal: KnowledgePrincipal) {
    const grant: KnowledgePageAccessGrant = { user_id: principal.user_id, role: permissionRole, scope: permissionScope };
    setPermissionGrants(current => [...current.filter(item => item.user_id !== grant.user_id || item.scope !== grant.scope), grant]);
    setMemberProfiles(current => ({ ...current, [principal.user_id]: principal }));
    setPermissionQuery(""); setPermissionPrincipals([]);
  }

  async function savePageAccess() {
    if (!selectedID || !pageAccess || !client.setPageAccess) return;
    setPermissionSaving(true); setError("");
    try {
      const value = await client.setPageAccess(library.id, selectedID, {
        client_id: crypto.randomUUID(), expected_revision: pageAccess.revision, mode: permissionMode,
        grants: permissionMode === "restricted" ? permissionGrants : [],
      }, AbortSignal.timeout(30_000));
      setPageAccess(value); setPermissionMode(value.mode); setPermissionGrants(value.grants);
      setNotice(value.projection_status === "ready" ? "页面权限已生效。" : "本地撤权已立即生效；远端权限投影确认前，本页不会进入搜索结果。");
      if (viewRef.current) {
        const next = { ...viewRef.current, page: { ...viewRef.current.page, access_mode: value.mode, access_revision: value.revision, access_status: value.projection_status } };
        viewRef.current = next; setView(next);
      }
    } catch (failure) { setError(formatError(failure)); }
    finally { setPermissionSaving(false); }
  }

  async function reorderSibling(page: KnowledgePage, offset: -1 | 1) {
    const parent = page.parent_page_id || "";
    const siblings = children[parent] || [];
    if (!canWrite || showArchived || childrenComplete[parent] !== true) return;
    const index = siblings.findIndex(item => item.id === page.id), nextIndex = index + offset;
    if (index < 0 || nextIndex < 0 || nextIndex >= siblings.length) return;
    const ordered = [...siblings];
    [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
    try {
      const result = await client.reorderPages(library.id, { client_id: crypto.randomUUID(), parent_page_id: parent || undefined, items: ordered.map(item => ({ page_id: item.id, expected_revision: item.revision })) }, AbortSignal.timeout(30_000));
      setChildren(current => ({ ...current, [parent]: result.items }));
      setNotice("同级页面顺序已原子更新。");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function copyCurrentPage() {
    const current = viewRef.current;
    if (!current || !canWrite) return;
    try {
      const copied = await client.copyPage(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_page_id: current.page.parent_page_id, title: `${current.page.title} 副本` }, AbortSignal.timeout(30_000));
      await loadChildren(copied.page.parent_page_id || "");
      setSelectedID(copied.page.id); setNotice("页面已复制为一份新的未发布草稿。");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function archive(page: KnowledgePage) {
    try {
      await client.setPageArchived(library.id, page.id, page.state !== "archived", { client_id: crypto.randomUUID(), expected_revision: page.revision }, AbortSignal.timeout(30_000));
      setSelectedID(""); await loadChildren(page.parent_page_id || ""); setNotice(page.state === "archived" ? "页面已恢复。" : "页面已归档并立即停止检索引用。 ");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function compareVersions() {
    if (compare.length !== 2 || !selectedID) return;
    try { setDiff(await client.diffPageVersions(library.id, selectedID, compare[1], compare[0], AbortSignal.timeout(30_000))); }
    catch (failure) { setError(formatError(failure)); }
  }

  async function previewVersion(version: number) {
    try {
      setHistoryPreview(await client.getPageVersion(library.id, selectedID, version, AbortSignal.timeout(30_000)));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function loadMoreVersions() {
    if (!selectedID || versionsComplete || versionBefore < 1) return;
    try {
      const page = await client.listPageVersions(library.id, selectedID, versionBefore, 50, AbortSignal.timeout(30_000));
      setVersions(current => [...current, ...page.items.filter(item => !current.some(saved => saved.version === item.version))]);
      setVersionBefore(page.next_before || 0); setVersionsComplete(page.complete);
      void resolveProfiles(page.items.map(item => item.published_by_user_id), AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function loadMoreComments() {
    if (!selectedID || commentsComplete || !commentAfter) return;
    try {
      const page = await client.listPageComments(library.id, selectedID, commentAfter, 50, mode === "comments" && unresolvedOnly, AbortSignal.timeout(30_000));
      setComments(current => [...current, ...page.items.filter(item => !current.some(saved => saved.id === item.id))]);
      setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete);
      void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...item.mentioned_user_ids]), AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function restore(version: number) {
    const current = viewRef.current;
    if (!current?.draft) return;
    try {
      const restored = await client.restorePageVersion(library.id, current.page.id, version, { client_id: crypto.randomUUID(), expected_page_revision: current.page.revision, expected_draft_revision: current.draft.draft_revision }, AbortSignal.timeout(30_000));
      viewRef.current = restored; setView(restored); setTitle(restored.draft!.title); setBody(restored.draft!.body.content); editRef.current = { title: restored.draft!.title, body: restored.draft!.body.content }; setMode("edit"); setNotice(`版本 ${version} 已恢复为草稿，历史版本未修改。`);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function addComment() {
    const current = viewRef.current; if (!current?.published || !commentBody.trim()) return;
    try {
      await client.createPageComment(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_comment_id: replyingTo || undefined, published_version: current.published.version, anchor: {}, body: commentBody.trim(), mentioned_user_ids: mentionedUserIDs }, AbortSignal.timeout(30_000));
      setCommentBody(""); setMentionedUserIDs([]); setReplyingTo(""); const page = await client.listPageComments(library.id, current.page.id, "", 50, unresolvedOnly, AbortSignal.timeout(30_000)); setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function resolveComment(comment: KnowledgePageComment) {
    try {
      const updated = await client.resolvePageComment(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), expected_revision: comment.revision, resolved: !comment.resolved }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function updateComment(comment: KnowledgePageComment) {
    const next = editingCommentBody.trim();
    if (!next) return;
    try {
      const updated = await client.updatePageComment(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), expected_revision: comment.revision, body: next, mentioned_user_ids: comment.mentioned_user_ids }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item)); setEditingCommentID(""); setEditingCommentBody("");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function deleteComment(comment: KnowledgePageComment) {
    try {
      const updated = await client.deletePageComment(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), expected_revision: comment.revision }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function attachFile(file: File) {
    const current = viewRef.current;
    if (!current?.draft || !canWrite || attaching) return;
    setAttaching(true); setError("");
    const signal = AbortSignal.timeout(2 * 60 * 60 * 1000);
    try {
      const digest = await sha256(file, signal);
      const document = await client.uploadDocument({ libraryID: library.id, file, clientID: crypto.randomUUID(), sha256: digest, signal });
      const attachment = await client.setPageAttachment(library.id, current.page.id, document.id, { client_id: crypto.randomUUID(), title: file.name, rank: `${Date.now()}:${document.id}` }, signal);
      setAttachments(items => [...items.filter(item => item.document_id !== attachment.document_id), attachment]);
      if (file.type.startsWith("image/") && current.page.content_type === "document") {
        const nextBody = appendDocumentImage(editRef.current.body, document.id, file.name);
        editRef.current.body = nextBody; setBody(nextBody); setDirty(true); setSaveState("idle"); setMode("edit");
      }
      setNotice("附件已通过受权文件接口上传并关联到当前页面。图片引用会在草稿保存后生效。");
    } catch (failure) { setError(formatError(failure)); }
    finally { setAttaching(false); }
  }

  async function removeAttachment(attachment: KnowledgePageAttachment) {
    try {
      await client.removePageAttachment(library.id, attachment.page_id, attachment.document_id, { client_id: crypto.randomUUID() }, AbortSignal.timeout(30_000));
      setAttachments(items => items.filter(item => item.document_id !== attachment.document_id));
    } catch (failure) { setError(formatError(failure)); }
  }

  function updateEditor(nextTitle: string, nextBody: string, change?: KnowledgeEditorChange) {
    setTitle(nextTitle); setBody(nextBody); editRef.current = { title: nextTitle, body: nextBody };
    setDirty(true); setSaveState(collaboration.available ? "saving" : "idle"); setPublishState("idle"); setSaveConflict(null);
    if (collaboration.available) collaboration.edit(nextTitle, nextBody, change);
  }

  const treeRows = useMemo(() => rows(), [children, expanded, localFilter]);
  const activities = useMemo(() => [
    ...versions.map(version => ({ key: `version-${version.version}`, at: version.published_at, title: `发布了版本 ${version.version}`, detail: `${memberProfiles[version.published_by_user_id]?.display_name || "账号不可用"} · ${version.publish_note || version.body.summary || "无发布说明"}` })),
    ...comments.map(comment => ({ key: `comment-${comment.id}-${comment.revision}`, at: comment.updated_at, title: comment.deleted ? "删除了评论" : comment.resolved ? "解决了评论" : comment.revision > 1 ? "更新了评论" : comment.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${memberProfiles[comment.author_user_id]?.display_name || "账号不可用"} · 版本 ${comment.published_version}` })),
  ].sort((left, right) => right.at.localeCompare(left.at)), [comments, memberProfiles, versions]);
  const collaborators = useMemo(() => {
    const users = new Map<string, { userID: string; sessions: number; editedBlocks: number; cursorBlockID: string; selectionBlockID: string; lastSeenAt: string }>();
    for (const item of collaboration.presence) {
      const current = users.get(item.user_id) || { userID: item.user_id, sessions: 0, editedBlocks: 0, cursorBlockID: "", selectionBlockID: "", lastSeenAt: "" };
      current.sessions++;
      current.editedBlocks += item.edited_blocks || 0;
      if (item.last_seen_at >= current.lastSeenAt) {
        current.cursorBlockID = item.cursor_block_id || "";
        current.selectionBlockID = item.selection_block_id || "";
        current.lastSeenAt = item.last_seen_at;
      }
      users.set(item.user_id, current);
    }
    return [...users.values()].sort((left, right) => left.userID === collaboration.userID ? -1 : right.userID === collaboration.userID ? 1 : right.lastSeenAt.localeCompare(left.lastSeenAt));
  }, [collaboration.presence, collaboration.userID]);
  const content = view?.published?.body.content || "";
  const outline = useMemo(() => view?.page.content_type === "document" ? documentOutline(content) : [], [content, view?.page.content_type]);
  const editorStats = useMemo(() => documentStats(body), [body]);
  const collaborationStateLabel = ({ unavailable: "标准草稿模式", connecting: "正在连接协作会话", connected: "所有更改已同步", syncing: "正在合并更改", reconnecting: "正在恢复会话", error: "协作连接中断" })[collaboration.state];
  return <section className={`knowledge-pages${embedded ? " is-embedded" : ""}`} aria-label="知识页面">
    {!embedded && <header className="knowledge-section-heading">
      <div className="knowledge-section-identity"><span className="knowledge-section-icon" aria-hidden="true"><BookOpen size={18} /></span><span><small>Knowledge workspace</small><h3>知识页面</h3><p>协作编辑、版本发布与访问治理集中在一个工作区。</p></span></div>
      {view && <span className={`knowledge-index-state is-${view.page.projection_status || "none"}`}><span aria-hidden="true" />{projectionLabel(view.page)}</span>}
    </header>}
    <div className="knowledge-pages-layout">
      <aside className="knowledge-page-tree" onDragOver={event => { if (canWrite) event.preventDefault(); }} onDrop={() => { if (dragged) void move(dragged, ""); setDragged(null); }}>
        <div className="knowledge-tree-toolbar">
          <label><Search size={14} aria-hidden="true" /><input aria-label="筛选当前知识条目" value={localFilter} onChange={event => setLocalFilter(event.target.value)} placeholder="搜索知识条目" /></label>
          {canWrite && <div ref={createMenuAnchorRef} className="knowledge-create-menu-wrap"><Button aria-label="新建知识条目" title="新建知识条目" aria-haspopup="menu" aria-expanded={createMenuOpen} disabled={disabled} onClick={() => setCreateMenuOpen(value => !value)}><Plus size={16} /></Button>{createMenuOpen && typeof document !== "undefined" && createPortal(<div ref={createMenuRef} className="knowledge-create-menu" role="menu" aria-label="新建知识条目类型" style={createMenuPosition}>
            {nativePageTypes.map(type => <button key={type} role="menuitem" onClick={() => { setCreateMenuOpen(false); void createPage(type); }}><PageTypeIcon type={type} size={18} /><span><strong>{pageTypeMeta[type].label}</strong><small>{pageTypeMeta[type].description}</small></span></button>)}
            {documents && <button role="menuitem" onClick={() => { setCreateMenuOpen(false); setSelectedDocumentID(""); setShowDocumentUploader(true); setEntryKind("documents"); }}><Upload size={18} /><span><strong>上传及导入</strong><small>导入 PDF、Office、图片或音视频</small></span></button>}
          </div>, document.body)}</div>}
          {onManage && <Button aria-label="管理知识库" title="管理知识库" disabled={disabled} onClick={onManage}><Settings size={15} /></Button>}
        </div>
        <div className="knowledge-tree-label"><span>知识条目</span>{canWrite && <label className="knowledge-checkbox"><input type="checkbox" checked={showArchived} onChange={event => setShowArchived(event.target.checked)} />归档</label>}</div>
        <div role="tree" aria-label="知识条目树">{documentEntries.map(document => <button key={document.id} role="treeitem" className="knowledge-document-entry-row" aria-selected={entryKind === "documents" && selectedDocumentID === document.id} onClick={() => { setEntryKind("documents"); setSelectedDocumentID(document.id); setShowDocumentUploader(false); }}><FileText size={15} /><span><strong>{document.filename}</strong><small>导入文件</small></span></button>)}{treeRows.map(({ page, parent, depth, loadMore }, index) => loadMore ? <button key={`more-${parent}-${index}`} className="knowledge-tree-more" style={{ marginInlineStart: `${depth * 16 + 24}px` }} onClick={() => void loadChildren(parent, AbortSignal.timeout(30_000), true)}>加载更多</button> : page && <div key={page.id} className="knowledge-tree-row" style={{ paddingInlineStart: `${depth * 16 + 4}px` }} draggable={canWrite} onDragStart={() => setDragged(page)} onDragOver={event => { if (canWrite) event.preventDefault(); }} onDrop={event => { event.stopPropagation(); if (dragged) void move(dragged, page.id); setDragged(null); }}>
          <button aria-label={expanded.has(page.id) ? "折叠子页面" : "展开子页面"} onClick={() => void toggle(page)}>{expanded.has(page.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
          <button ref={element => { treeButtonRefs.current[page.id] = element; }} role="treeitem" aria-selected={entryKind === "page" && selectedID === page.id} tabIndex={entryKind === "page" && selectedID === page.id ? 0 : -1} onKeyDown={event => { if (event.key === "ArrowRight" && !expanded.has(page.id)) { event.preventDefault(); void toggle(page); } else if (event.key === "ArrowLeft") { event.preventDefault(); if (expanded.has(page.id)) void toggle(page); else if (parent) focusTreePage(parent); } else if (event.key === "ArrowDown") { event.preventDefault(); const next = treeRows.slice(index + 1).find(row => row.page)?.page; if (next) focusTreePage(next.id); } else if (event.key === "ArrowUp") { event.preventDefault(); const previous = treeRows.slice(0, index).reverse().find(row => row.page)?.page; if (previous) focusTreePage(previous.id); } else if (event.key === "Enter") { setEntryKind("page"); setSelectedID(page.id); } }} onClick={() => { setEntryKind("page"); setSelectedID(page.id); }}><PageTypeIcon type={page.content_type} size={14} /><span>{page.title}</span></button>
          {canWrite && !showArchived && childrenComplete[parent] === true && <><button aria-label={`上移 ${page.title}`} disabled={(children[parent] || [])[0]?.id === page.id} onClick={event => { event.stopPropagation(); void reorderSibling(page, -1); }}><ArrowUp size={12} /></button><button aria-label={`下移 ${page.title}`} disabled={(children[parent] || []).at(-1)?.id === page.id} onClick={event => { event.stopPropagation(); void reorderSibling(page, 1); }}><ArrowDown size={12} /></button></>}
        </div>)}{!loading && treeRows.length === 0 && documentEntries.length === 0 && <p className="knowledge-subtle">没有知识条目。</p>}</div>
      </aside>
      <article className={entryKind === "documents" ? "knowledge-page-main knowledge-document-main" : `knowledge-page-main${mode === "outline" || mode === "comments" || mode === "activity" || mode === "access" || mode === "permissions" ? " has-side-panel" : ""}${mode === "edit" && collaboration.available ? " has-collaboration" : ""}`}>
        {entryKind === "documents" ? documents?.({ selectedDocumentID, showUploader: showDocumentUploader, onDocumentsChange: setDocumentEntries, onSelectedDocumentChange(documentID) { setSelectedDocumentID(documentID); setShowDocumentUploader(false); } }) : <>
        {notice && <p role="status" className="knowledge-notice">{notice}</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}
        {pendingMove && <section className="knowledge-confirm knowledge-move-impact" role="dialog" aria-label="确认页面权限影响"><h3>移动会改变页面权限</h3><p>将影响该子树中的 {pendingMove.impact.affected_pages} 个页面，并改变 {pendingMove.impact.changed_user_ids.length} 位成员的有效访问。</p>{pendingMove.impact.changed_user_ids.length > 0 && <p className="knowledge-subtle">涉及成员：{pendingMove.impact.changed_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、")}</p>}<div className="knowledge-actions"><Button className="danger" onClick={() => void commitMove(pendingMove.page, pendingMove.parentPageID, pendingMove.impact.token)}>确认移动并更新继承</Button><Button onClick={() => setPendingMove(null)}>取消移动</Button></div></section>}
        {!view && !loading ? <EmptyState><FilePlus2 size={28} /><h3>选择或新建页面</h3></EmptyState> : null}
        {view && <>
          <nav className="knowledge-page-breadcrumbs" aria-label="页面路径">{view.breadcrumbs.map((item, index) => <span key={item.page_id}>{index > 0 && <ChevronRight size={12} aria-hidden="true" />}<button onClick={() => setSelectedID(item.page_id)}>{item.title}</button></span>)}</nav>
          <header className={`knowledge-page-title${mode === "edit" ? " is-editing" : ""}`}>
            <div className="knowledge-page-heading">{mode !== "edit" && <h2 className={canWrite && view.page.state === "active" ? "is-editable" : undefined} title={canWrite && view.page.state === "active" ? "双击编辑标题" : undefined} onDoubleClick={() => { if (canWrite && view.page.state === "active") { setMode("edit"); window.setTimeout(() => titleInputRef.current?.select()); } }}>{view.published?.title || view.page.title}</h2>}<p>版本 {view.page.published_version || "未发布"}<span aria-hidden="true"> · </span>{view.published ? `${memberProfiles[view.published.published_by_user_id]?.display_name || "账号不可用"} 发布于 ${new Date(view.published.published_at).toLocaleString()}` : "仅草稿"}</p></div>
            <div className="knowledge-page-presence-summary" aria-label={`${collaboration.onlineUsers} 人在线编辑`}>{mode === "edit" && collaboration.available && <><div className="knowledge-avatar-stack">{collaborators.slice(0, 4).map(person => <span key={person.userID} title={memberProfiles[person.userID]?.display_name || person.userID} style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{(memberProfiles[person.userID]?.display_name || person.userID).slice(0, 1).toUpperCase()}</span>)}</div><strong>{collaboration.onlineUsers} 人在线</strong></>}</div>
          </header>
          <div className="knowledge-page-toolbar">
            <div className="knowledge-view-tabs" role="tablist" aria-label="页面视图">
              <button role="tab" aria-selected={mode === "read"} onClick={() => setMode("read")}><BookOpen size={14} />阅读</button>
              {canWrite && view.page.state === "active" && <button role="tab" aria-selected={mode === "edit"} onClick={() => setMode("edit")}><Pencil size={14} />编辑</button>}
              <button role="tab" aria-selected={mode === "history"} onClick={() => setMode("history")}><Clock3 size={14} />历史</button>
              <button role="tab" aria-selected={mode === "comments"} onClick={() => setMode("comments")}><MessageSquare size={14} />评论</button>
              <button role="tab" aria-selected={mode === "activity"} onClick={() => setMode("activity")}><Activity size={14} />活动</button>
            </div>
            <div className="knowledge-page-tools">
              {view.page.content_type === "document" && <Button aria-pressed={mode === "outline"} title="页面大纲" onClick={() => setMode("outline")}><ListTree size={15} /></Button>}
              {library.role === "manager" && <Button aria-pressed={mode === "access"} title="访问说明" onClick={() => setMode("access")}><ShieldCheck size={15} /></Button>}
              {library.role === "manager" && client.getPageAccess && client.setPageAccess && <Button aria-pressed={mode === "permissions"} title="页面权限" onClick={() => setMode("permissions")}><Users size={15} /></Button>}
              {canWrite && <Button title="复制页面" onClick={() => void copyCurrentPage()}><Copy size={15} /></Button>}
              {canWrite && <Button title={view.page.state === "archived" ? "恢复页面" : "归档页面"} onClick={() => void archive(view.page)}><MoreHorizontal size={15} /></Button>}
            </div>
          </div>
          {(mode === "read" || mode === "outline" || mode === "comments" || mode === "activity" || mode === "access" || mode === "permissions") && (view.published ? <div className="knowledge-page-readable typed-readable"><KnowledgeEditor type={view.page.content_type} body={content} readOnly onChange={() => undefined} /></div> : <EmptyState><Upload size={28} /><h3>页面尚未发布</h3><p>编辑者可以完善草稿后发布。</p></EmptyState>)}
          {mode === "edit" && view.draft && <div className="knowledge-editor-shell">
            <section className="knowledge-page-editor">
              <div className="knowledge-editor-canvas">
                <input ref={titleInputRef} className="knowledge-editor-title" aria-label="标题" value={title} maxLength={256} disabled={collaboration.available && !collaboration.ready} onChange={event => updateEditor(event.target.value, body)} placeholder="页面标题" />
                <div className="knowledge-editor-toolbar"><span>{pageTypeMeta[view.page.content_type].label}</span><span>{view.page.content_type === "document" ? `${editorStats.blocks} 个内容块 · ${editorStats.characters} 字符` : "结构化草稿"}</span></div>
                <KnowledgeEditor type={view.page.content_type} body={body} collaboration={collaboration.available && collaboration.ready ? collaboration.editorCollaboration : undefined} readOnly={collaboration.available && !collaboration.ready} onChange={(next, change) => updateEditor(title, next, change)} onPresence={collaboration.updatePresence} />
              </div>
              <div className="knowledge-editor-meta">
                <div className={`knowledge-sync-state is-${collaboration.state}`} role="status">{collaboration.state === "syncing" || collaboration.state === "connecting" || collaboration.state === "reconnecting" ? <Cloud className="knowledge-pulse" size={15} /> : collaboration.state === "error" ? <Wifi size={15} /> : <Check size={15} />}<span>{publishState === "publishing" ? "正在冻结协作快照…" : publishState === "error" ? "发布失败" : collaboration.available ? collaborationStateLabel : { idle: dirty ? "有未保存更改" : "草稿未更改", saving: "正在保存…", saved: `已保存 revision ${view.draft.draft_revision}`, conflict: "保存冲突：服务器已有更新", error: "保存失败" }[saveState]}</span>{collaboration.available && collaboration.draftRevision > 0 && <small>revision {collaboration.draftRevision} · clock {collaboration.serverClock}</small>}</div>
                <label className="knowledge-attachment-trigger"><Paperclip size={15} />添加附件或粘贴图片<input type="file" accept={knowledgeDocumentAccept(library)} disabled={attaching} onChange={event => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.currentTarget.value = ""; }} /></label>
              </div>
              {(attaching || attachments.length > 0) && <div className="knowledge-page-attachments">{attaching && <span role="status">正在校验并上传附件…</span>}{attachments.map(attachment => <span key={attachment.document_id}>{attachment.title}<button type="button" onClick={() => void removeAttachment(attachment)}>移除</button></span>)}</div>}
              {!collaboration.available && saveState === "conflict" && <div className="knowledge-conflict"><GitMerge size={18} /><span>{saveConflict ? `服务器草稿 revision ${saveConflict.current_draft_revision}，基于发布版本 ${saveConflict.base_published_version}，更新时间 ${new Date(saveConflict.current_updated_at).toLocaleString()}，摘要 ${saveConflict.current_content_sha256.slice(0, 12)}` : "服务器已有新草稿，请重新载入后合并。"}</span><Button onClick={() => { void navigator.clipboard.writeText(body); setNotice("你的正文已复制到剪贴板。"); }}>复制我的内容</Button><Button onClick={() => { pendingSaveRef.current = null; pendingPublishRef.current = null; setSaveConflict(null); setSelectedID(current => { window.setTimeout(() => setSelectedID(current)); return ""; }); }}><RefreshCw size={14} />重新载入</Button></div>}
              <footer className="knowledge-editor-actions">
                <div>{!collaboration.available && <Button disabled={!dirty || saveState === "saving" || publishState === "publishing"} onClick={() => void saveDraft()}><Save size={14} />保存草稿</Button>}<span className="knowledge-editor-hint">{collaboration.available ? "正文使用增量 CRDT 同步，不会整篇覆盖他人的修改。" : "更改会自动保存为草稿。"}</span></div>
                <div><input aria-label="发布说明" value={publishNote} maxLength={2048} onChange={event => setPublishNote(event.target.value)} placeholder="添加发布说明…" /><Button className="primary" disabled={saveState === "conflict" || publishState === "publishing" || !title.trim() || collaboration.available && (collaboration.state === "error" || collaboration.state === "connecting" || collaboration.state === "reconnecting")} onClick={() => void publish()}><Send size={14} />{publishState === "publishing" ? "发布中…" : "发布版本"}</Button></div>
              </footer>
            </section>
            {collaboration.available && <aside className="knowledge-collaboration-rail" aria-label="在线协作">
              <header><div><Users size={17} /><strong>在线协作</strong></div><span>{collaboration.onlineUsers} 人</span></header>
              <section className="knowledge-merge-strategy"><GitMerge size={17} /><div><strong>内容冲突自动收敛</strong><p>正文由 Yjs 按内容块与富文本节点合并；服务端串行确认时钟、校验 Block JSON，并持久化完整检查点。标题按服务端时钟顺序提交。</p></div></section>
              {collaboration.mergeCount > 0 && <p className="knowledge-merge-event"><Check size={14} />已自动合并 {collaboration.mergeCount} 个远端更新{collaboration.mergedUserIDs.length > 0 ? `，来自 ${collaboration.mergedUserIDs.map(id => memberProfiles[id]?.display_name || id).join("、")}` : ""}</p>}
              <div className="knowledge-collaborator-list">{collaborators.map(person => { const profile = memberProfiles[person.userID]; const name = profile?.display_name || person.userID; return <div className="knowledge-collaborator" key={person.userID}><span className="knowledge-collaborator-avatar" style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{name.slice(0, 1).toUpperCase()}<i /></span><span><strong>{name}{person.userID === collaboration.userID && <em>你</em>}</strong><small>{person.cursorBlockID ? `正在编辑内容块 ${person.cursorBlockID.slice(0, 8)}` : "正在查看"}{person.sessions > 1 ? ` · ${person.sessions} 个设备` : ""}</small></span><b>{person.editedBlocks}<small>编辑块</small></b></div>; })}</div>
              <footer><span><Wifi size={13} />{collaborationStateLabel}</span>{collaboration.state === "error" && <Button onClick={collaboration.reconnect}><RefreshCw size={13} />重新连接</Button>}</footer>
            </aside>}
          </div>}
          {mode === "history" && <section className="knowledge-page-history"><div className="knowledge-actions"><Button disabled={compare.length !== 2} onClick={() => void compareVersions()}>对比所选版本</Button></div>{versions.map(version => <div key={version.version} className="knowledge-version"><label><input type="checkbox" checked={compare.includes(version.version)} onChange={event => setCompare(current => event.target.checked ? [version.version, ...current].slice(0, 2) : current.filter(item => item !== version.version))} />版本 {version.version}</label><span>{memberProfiles[version.published_by_user_id]?.display_name || "账号不可用"} · {new Date(version.published_at).toLocaleString()} · {version.publish_note || "无发布说明"} · {version.body.summary || "无摘要"}</span><Button onClick={() => void previewVersion(version.version)}>查看版本</Button>{canWrite && <Button onClick={() => void restore(version.version)}>恢复为草稿</Button>}</div>)}{!versionsComplete && <Button onClick={() => void loadMoreVersions()}>加载更早版本</Button>}{historyPreview && <div className="knowledge-version-preview"><h4>版本 {historyPreview.version}：{historyPreview.title}</h4><p className="knowledge-subtle">页面位置 {historyPreview.parent_page_id || "根目录"} · 排序 {historyPreview.rank}</p><div className="knowledge-page-readable typed-readable"><KnowledgeEditor type={historyPreview.content_type} body={historyPreview.body.content} readOnly onChange={() => undefined} /></div></div>}{diff && <div className="knowledge-diff"><h4>版本 {diff.from_version} → {diff.to_version}</h4><pre>{diff.content.map((op, index) => <span key={index} className={`is-${op.kind}`}>{op.kind === "insert" ? "+ " : op.kind === "delete" ? "- " : "  "}{op.text}</span>)}</pre></div>}</section>}
          {mode === "outline" && <aside className="knowledge-page-outline" aria-label="页面大纲"><h3>页面大纲</h3>{outline.length === 0 ? <p className="knowledge-subtle">当前发布版本没有标题块。</p> : <ol>{outline.map(item => <li key={item.key} style={{ paddingInlineStart: `${(item.level - 1) * 12}px` }}>{item.title}</li>)}</ol>}</aside>}
          {mode === "comments" && <section className="knowledge-page-comments"><label className="knowledge-checkbox"><input type="checkbox" checked={unresolvedOnly} onChange={event => setUnresolvedOnly(event.target.checked)} />只看未解决</label>{view.page.state === "archived" && <p className="knowledge-subtle">页面已归档，评论只读。</p>}{view.published && view.page.state === "active" && <div className="knowledge-comment-create">{replyingTo && <p className="knowledge-subtle">正在回复评论 {replyingTo}<button onClick={() => setReplyingTo("")}>取消</button></p>}<textarea value={commentBody} maxLength={16_384} onChange={event => setCommentBody(event.target.value)} placeholder="针对当前发布版本发表评论" /><label>@ 提及当前资料库成员<input value={memberQuery} onChange={event => setMemberQuery(event.target.value)} placeholder="按姓名或邮箱搜索" /></label><div className="knowledge-mention-picker">{mentionCandidates.map(member => <button key={member.user_id} type="button" aria-pressed={mentionedUserIDs.includes(member.user_id)} onClick={() => setMentionedUserIDs(current => current.includes(member.user_id) ? current.filter(id => id !== member.user_id) : [...current, member.user_id])}>@{member.display_name}</button>)}</div>{mentionedUserIDs.length > 0 && <p className="knowledge-subtle">将提及：{mentionedUserIDs.map(id => memberProfiles[id]?.display_name || id).join("、")}</p>}<Button disabled={!commentBody.trim()} onClick={() => void addComment()}>评论</Button></div>}{comments.map(comment => <div key={comment.id} className={`knowledge-comment${comment.resolved ? " is-resolved" : ""}${comment.parent_comment_id ? " is-reply" : ""}`}><header><strong>{memberProfiles[comment.author_user_id]?.display_name || "账号不可用"}</strong><span>版本 {comment.published_version} · {new Date(comment.created_at).toLocaleString()}</span></header>{editingCommentID === comment.id ? <div className="knowledge-comment-edit"><textarea value={editingCommentBody} maxLength={16_384} onChange={event => setEditingCommentBody(event.target.value)} /><div className="knowledge-actions"><Button disabled={!editingCommentBody.trim()} onClick={() => void updateComment(comment)}>保存评论</Button><Button onClick={() => { setEditingCommentID(""); setEditingCommentBody(""); }}>取消</Button></div></div> : <p>{comment.deleted ? "评论已删除" : comment.body}</p>}{comment.anchor.changed && <p className="knowledge-subtle">原评论位置已随页面版本变化。</p>}{comment.mentioned_user_ids.length > 0 && <p className="knowledge-subtle">提及 {comment.mentioned_user_ids.map(id => `@${memberProfiles[id]?.display_name || "账号不可用"}`).join("、")}</p>}{view.page.state === "active" && !comment.deleted && editingCommentID !== comment.id && <div className="knowledge-actions"><Button onClick={() => setReplyingTo(comment.id)}>回复</Button><Button onClick={() => { setEditingCommentID(comment.id); setEditingCommentBody(comment.body); }}>编辑</Button><Button onClick={() => void resolveComment(comment)}>{comment.resolved ? "重新打开" : "标记解决"}</Button><Button className="danger" onClick={() => void deleteComment(comment)}>删除</Button></div>}</div>)}{!commentsComplete && <Button onClick={() => void loadMoreComments()}>加载更多评论</Button>}</section>}
          {mode === "activity" && <section className="knowledge-page-activity"><p className="knowledge-subtle">活动由发布版本与评论实时合并，不另存第三份活动记录。</p>{activities.map(item => <div key={item.key} className="knowledge-activity-item"><Activity size={15} /><span><strong>{item.title}</strong><small>{new Date(item.at).toLocaleString()} · {item.detail}</small></span></div>)}{activities.length === 0 && <p className="knowledge-subtle">暂无页面活动。</p>}<div className="knowledge-actions">{!versionsComplete && <Button onClick={() => void loadMoreVersions()}>加载更早发布</Button>}{!commentsComplete && <Button onClick={() => void loadMoreComments()}>加载更多评论</Button>}</div></section>}
          {mode === "access" && library.role === "manager" && <section className="knowledge-page-access"><h3>当前页面访问说明</h3><p className="knowledge-subtle">结果由服务端同时计算 Identity 功能权限、资料库实时成员角色和页面继承关系。</p><label>查找用户<input value={accessQuery} onChange={event => { setAccessQuery(event.target.value); setAccessUserID(""); }} placeholder="输入姓名或邮箱" /></label><div className="knowledge-principal-results" role="listbox">{accessPrincipals.map(principal => <button key={principal.user_id} role="option" aria-selected={accessUserID === principal.user_id} onClick={() => { setAccessUserID(principal.user_id); setAccessQuery(principal.display_name || principal.email || principal.user_id); setAccessPrincipals([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name}</strong><small>{principal.email}</small></button>)}</div><label>动作<select value={accessAction} onChange={event => setAccessAction(event.target.value)}><option value="knowledge.pages.get">阅读页面</option><option value="knowledge.pages.update">编辑草稿</option><option value="knowledge.pages.publish">发布页面</option><option value="knowledge.page_comments.create">发表评论</option></select></label>{accessExplanation && <div className="knowledge-access-preview"><p><strong>最终结论：{accessExplanation.final.allowed ? "允许" : "拒绝"}</strong>（{accessExplanation.final.label}）</p><p>Identity 功能权限：{accessExplanation.identity.allowed ? "允许" : "拒绝"} · {accessExplanation.identity.label}</p><p>资料库成员角色：{accessExplanation.library.allowed ? "允许" : "拒绝"} · {accessExplanation.library_role || "无成员关系"} · {accessExplanation.library.label}</p><p>页面权限：{accessExplanation.page.allowed ? "允许" : "拒绝"} · {accessExplanation.page.label}；继承来源 {accessExplanation.inherited_from || "资料库"}</p></div>}</section>}
          {mode === "permissions" && library.role === "manager" && client.getPageAccess && client.setPageAccess && <section className="knowledge-page-access knowledge-page-permissions"><h3>页面与子树权限</h3><p className="knowledge-subtle">管理者始终保留治理访问。受限模式只允许当前资料库成员通过页面或子树 grant 访问，grant 角色不会超过成员的资料库角色。</p>{!pageAccess ? <p role="status">正在读取服务端权限…</p> : <><label>访问模式<select value={permissionMode} disabled={permissionSaving} onChange={event => setPermissionMode(event.target.value as "inherit" | "restricted")}><option value="inherit">继承资料库角色</option><option value="restricted">仅管理者和明确授权成员</option></select></label>{permissionMode === "inherit" ? <p className="knowledge-access-preview">本页完全继承资料库成员角色，不保存额外 grant。</p> : <><label>查找当前资料库成员<input value={permissionQuery} disabled={permissionSaving} onChange={event => setPermissionQuery(event.target.value)} placeholder="按姓名或邮箱搜索" /></label><div className="knowledge-permission-grant-options"><label>授权角色<select value={permissionRole} onChange={event => setPermissionRole(event.target.value as KnowledgePageAccessGrant["role"])}><option value="reader">阅读者</option><option value="editor">编辑者</option><option value="manager">管理者</option></select></label><label>授权范围<select value={permissionScope} onChange={event => setPermissionScope(event.target.value as KnowledgePageAccessGrant["scope"])}><option value="page">仅此页面</option><option value="subtree">此页面与子树</option></select></label></div><div className="knowledge-principal-results" role="listbox">{permissionPrincipals.map(principal => <button key={principal.user_id} role="option" onClick={() => addPermissionGrant(principal)}><span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span><strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div><div className="knowledge-permission-grants">{permissionGrants.map(grant => <div key={`${grant.user_id}:${grant.scope}`}><span><strong>{memberProfiles[grant.user_id]?.display_name || "账号不可用"}</strong><small>{grant.role === "reader" ? "阅读者" : grant.role === "editor" ? "编辑者" : "管理者"} · {grant.scope === "page" ? "仅此页面" : "页面与子树"}</small></span><Button disabled={permissionSaving} onClick={() => setPermissionGrants(current => current.filter(item => item.user_id !== grant.user_id || item.scope !== grant.scope))}>移除</Button></div>)}{permissionGrants.length === 0 && <p className="knowledge-subtle">尚未授权任何成员；除管理者外无人可访问。</p>}</div></>}<p className="knowledge-subtle">当前 ACL revision {pageAccess.revision} · 远端投影 {pageAccess.projection_status === "ready" ? "已确认" : "确认中（页面已从搜索结果隐藏）"}</p><Button disabled={permissionSaving} onClick={() => void savePageAccess()}><Save size={14} />{permissionSaving ? "正在保存…" : "保存页面权限"}</Button></>}</section>}
        </>}
        </>}
      </article>
    </div>
  </section>;
}
