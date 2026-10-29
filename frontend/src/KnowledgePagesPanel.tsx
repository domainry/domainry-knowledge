import { formatKnowledgeDate, kt, ktf } from "./i18n/runtime.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Bell, BookOpen, CalendarClock, Check, ChevronDown, ChevronRight, Clock3, Cloud, FilePlus2, GitMerge, GitPullRequest, LayoutTemplate, Link2, LoaderCircle, Paperclip, Pencil, Pin, Plus, RefreshCw, Save, ScanSearch, Search, Send, Settings, Share2, ShieldCheck, Sparkles, Star, Tags, Trash2, Upload, UserRoundCog, Users, Wifi, X } from "lucide-react";
import { Button, EmptyState, Select } from "./components.tsx";
import { documentUploadMaxBytes, knowledgeDocumentAccept, knowledgeDocumentAcceptForContentType, knowledgeDocumentSupports, selectedUploadFile, sha256 } from "./document.ts";
import type { KnowledgeAccessExplanation, KnowledgeAccessSubject, KnowledgeAIExecution, KnowledgeAIOperation, KnowledgeAISourceScope, KnowledgeClient, KnowledgeGovernanceEvent, KnowledgeLibrary, KnowledgeOrganizationPrincipal, KnowledgePage, KnowledgePageAccessGrant, KnowledgePageAccessPolicy, KnowledgePageAttachment, KnowledgePageCollectionItem, KnowledgePageCollectionKind, KnowledgePageComment, KnowledgePageConflict, KnowledgePageCustomProperty, KnowledgePageEditHistoryEntry, KnowledgePageIdentity, KnowledgePageMetadata, KnowledgePageMoveImpact, KnowledgePageNativeOperation, KnowledgePagePersonalState, KnowledgePagePollView, KnowledgePagePropertyType, KnowledgePageReferenceLink, KnowledgePageRelationshipGraph, KnowledgePageSearchLocation, KnowledgePageStatus, KnowledgePageSuggestion, KnowledgePageTask, KnowledgePageTemplate, KnowledgePageTemplateVersionSummary, KnowledgePageVersion, KnowledgePageVersionDiff, KnowledgePageView, KnowledgePrincipal } from "./types.ts";
import { useKnowledgeCollaboration } from "./useKnowledgeCollaboration.ts";
import { useKnowledgeNativeAwareness } from "./useKnowledgeNativeAwareness.ts";
import { collaborationPresenceUserIDs } from "./collaboration.ts";
import { pageTypeMeta, PageTypeIcon } from "./pageTypeRegistry.ts";
import { KnowledgeEditor } from "./editors/KnowledgeEditor.tsx";
import type { KnowledgeCommentAnchorSelection, KnowledgeCommentMarker, KnowledgeDynamicBlockRuntime, KnowledgeEditorChange, KnowledgeFormRuntime, KnowledgeMentionRuntime, KnowledgePollRuntime, KnowledgeTaskRuntime } from "./editors/types.ts";
import type { KnowledgePageContentType } from "./types.ts";
import { appendDocumentImage, documentOutline, documentStats } from "./documentContent.ts";
import { KnowledgeFilePage } from "./KnowledgeFilePage.tsx";
import { KnowledgePageShareManager } from "./KnowledgePageShareManager.tsx";
import { KnowledgePageContentPolicyManager } from "./KnowledgePageContentPolicyManager.tsx";
import { KnowledgeDynamicWatermark } from "./KnowledgePageGovernance.tsx";
import { PageActivityPanel } from "./page-workspace/PageActivityPanel.tsx";
import { PageOutline } from "./page-workspace/PageOutline.tsx";
import { CommentDrawer } from "./page-workspace/CommentDrawer.tsx";
import { SuggestionDrawer } from "./page-workspace/SuggestionDrawer.tsx";
import { PageHistoryPanel } from "./page-workspace/PageHistoryPanel.tsx";
import { PageToolbar } from "./page-workspace/PageToolbar.tsx";
import type { PageWorkspaceMode } from "./page-workspace/PageToolbar.tsx";
import { PageHeader } from "./page-workspace/PageHeader.tsx";
import { filePageContent, parseFilePageContent } from "./file-page.ts";
import { createKnowledgeBlockLink, createKnowledgePageLink } from "./knowledge-links.ts";
import { nativePageOperations } from "./nativeOperations.ts";
import { gridAutomationExecutions } from "./gridContent.ts";
import { parseFormContent } from "./formContent.ts";
import { KnowledgeCreateMenu } from "./KnowledgeCreateMenu.tsx";
import { createKnowledgeSelectionReference, type KnowledgeDocumentSelectionSnapshot, type KnowledgeHostIntegration } from "./hostIntegration.ts";

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
};

type PendingNativePageSave = {
  clientID: string;
  titleClientID: string;
  pageID: string;
  baseDraftRevision: number;
  operations: KnowledgePageNativeOperation[];
  title: string;
  body: string;
};

type PendingPageMove = { page: KnowledgePage; parentPageID: string; impact: KnowledgePageMoveImpact };
type TreeDropTarget = { pageID: string; placement: "before" | "inside" | "after" };
type PageNavigationSection = "all" | KnowledgePageCollectionKind;
type PageGovernanceDraft = {
  ownerUserID: string;
  contentAdminUserIDs: string[];
  archiveRetentionDays: number;
  reviewIntervalDays: number;
  nextReviewAt?: string;
};

const pageNavigationLabels: Record<PageNavigationSection, string> = {
  get all() { return kt("knowledge.auto.393a2482464f881c"); },
  get shortcuts() { return kt("knowledge.auto.5f2cfbfecf9fc4a6"); },
  get favorites() { return kt("knowledge.auto.60a53514eb9228a2"); },
  get recent_views() { return kt("knowledge.auto.de314b445e076e84"); },
  get recent_edits() { return kt("knowledge.auto.c18fdf7c840dbd7d"); },
  get subscribed() { return kt("knowledge.auto.cf8efc450f718fbf"); },
  get trash() { return kt("knowledge.auto.ba35dc23b245e61e"); },
};
const workbenchPageTypes = new Set<KnowledgePageContentType>(["multidimensional_table", "spreadsheet", "presentation", "form", "whiteboard", "mind_map", "flowchart"]);
const pageStatusLabels: Record<KnowledgePageStatus, string> = {
  get ""() { return kt("knowledge.auto.2f5f1d6fbfb061ed"); },
  get in_progress() { return kt("knowledge.auto.fd07f299f5e59ee7"); },
  get in_review() { return kt("knowledge.auto.6c42f72d9f67b4a7"); },
  get verified() { return kt("knowledge.auto.b340063020e8bebf"); },
  get deprecated() { return kt("knowledge.auto.1148b68491e89f24"); },
};
const aiOperationLabels: Record<KnowledgeAIOperation, string> = {
  get write() { return kt("knowledge.auto.df6f87a88e953cef"); },
  get summarize() { return kt("knowledge.auto.04830193b408eeb1"); },
  get translate() { return kt("knowledge.auto.a52a08335185f048"); },
  get rewrite() { return kt("knowledge.auto.313fca9893e98858"); },
  get answer() { return kt("knowledge.auto.270e621ed6a3132f"); },
};
const aiStateLabels: Record<KnowledgeAIExecution["state"], string> = {
  get pending() { return kt("knowledge.auto.4f021f59121c6827"); },
  get running() { return kt("knowledge.auto.3424dd5017ffecbb"); },
  get completed() { return kt("knowledge.auto.e5d2184f2fed27d8"); },
  get failed() { return kt("knowledge.auto.9344597efd4950cc"); },
  get confirmed() { return kt("knowledge.auto.416706a5903fee6b"); },
};
const pagePropertyTypeLabels: Record<KnowledgePagePropertyType, string> = {
  get text() { return kt("knowledge.auto.dd81861811e57bf7"); },
  get number() { return kt("knowledge.auto.c16ec9274e9d13d1"); },
  get date() { return kt("knowledge.auto.70d0c1b33626ba4b"); },
  get select() { return kt("knowledge.auto.bb7486f4410fd370"); },
  get checkbox() { return kt("knowledge.auto.c6cdcd00b6a5b6df"); },
  get person() { return kt("knowledge.auto.06fea8eab68db0ad"); },
};
const governanceEventLabels: Record<string, string> = {
  get "knowledge.page.governance_set"() { return kt("knowledge.auto.7c40d1ea1d918425"); },
  get "knowledge.page.governance_reviewed"() { return kt("knowledge.auto.7cf0323071c960b2"); },
};

function metadataDateTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function metadataDateTimeISO(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function normalizePageMetadata(value: KnowledgePageMetadata): KnowledgePageMetadata {
  const validTimestamp = (timestamp?: string) => {
    if (!timestamp) return undefined;
    const date = new Date(timestamp);
    return !Number.isNaN(date.getTime()) && date.getUTCFullYear() >= 2000 ? timestamp : undefined;
  };
  return {
    ...value,
    aliases: value.aliases || [],
    related_page_ids: value.related_page_ids || [],
    tags: value.tags || [],
    content_admin_user_ids: value.content_admin_user_ids || [],
    properties: value.properties || [],
    review_interval_days: value.review_interval_days ?? 180,
    archive_retention_days: value.archive_retention_days ?? 365,
    next_review_at: validTimestamp(value.next_review_at),
    last_reviewed_at: validTimestamp(value.last_reviewed_at),
    archived_at: validTimestamp(value.archived_at),
    retain_until: validTimestamp(value.retain_until),
    updated_at: validTimestamp(value.updated_at),
  };
}

function governanceDraftFromMetadata(value: KnowledgePageMetadata): PageGovernanceDraft {
  return {
    ownerUserID: value.owner_user_id || "",
    contentAdminUserIDs: [...value.content_admin_user_ids],
    archiveRetentionDays: value.archive_retention_days,
    reviewIntervalDays: value.review_interval_days,
    nextReviewAt: value.next_review_at,
  };
}

function metadataTags(value: string) {
  const seen = new Set<string>();
  return value.split(/[,，\n]/).map(tag => tag.trim()).filter(tag => {
    const key = tag.toLocaleLowerCase();
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function metadataAliases(value: string) {
  return metadataTags(value);
}

function identityPath(identity: KnowledgePageIdentity) {
  return identity.path.map(item => item.title).join(" / ") || identity.title;
}
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
  return ({ queued: kt("knowledge.auto.eedc1e770989e5db"), indexing: kt("knowledge.auto.33df78fc64d1b52e"), ready: kt("knowledge.auto.7377768273896807"), failed: kt("knowledge.auto.d052f725817f1917"), none: kt("knowledge.auto.cbcd876a30531273") })[page.projection_status || "none"];
}

const collaboratorColors = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"];
function collaboratorColor(userID: string) {
  return collaboratorColors[[...userID].reduce((sum, character) => sum + character.codePointAt(0)!, 0) % collaboratorColors.length];
}

function recentActivityLabel(value: string, now = Date.now()) {
  const elapsed = Math.max(0, now - Date.parse(value));
  if (!Number.isFinite(elapsed) || elapsed < 15_000) return kt("knowledge.auto.a994662e71e0f046");
  if (elapsed < 60_000) return ktf("knowledge.auto.3f238b4162b01736", { value0: Math.floor(elapsed / 1000) });
  if (elapsed < 3_600_000) return ktf("knowledge.auto.525089ae7355bee3", { value0: Math.floor(elapsed / 60_000) });
  return formatKnowledgeDate(value, { hour: "2-digit", minute: "2-digit" }) + kt("knowledge.auto.40a88d282bc825b1");
}

type EmbeddedReference = {
  blockID: string;
  targetPageID: string;
  title: string;
  contentType: KnowledgePageContentType;
  display: "card" | "embed";
  referenceMode: "live" | "fixed";
  targetVersion: number;
  embeddedEdit: boolean;
};

function KnowledgeEmbeddedReference({ client, library, currentUserID, canWrite, formatError, reference, onOpen }: {
  client: KnowledgeClient;
  library: KnowledgeLibrary;
  currentUserID: string;
  canWrite: boolean;
  formatError(error: unknown): string;
  reference: EmbeddedReference;
  onOpen(pageID: string): void;
}) {
  const [target, setTarget] = useState<KnowledgePageView | null>(null);
  const [fixedVersion, setFixedVersion] = useState<KnowledgePageVersion | null>(null);
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  const live = reference.referenceMode === "live";
  const editable = live && reference.embeddedEdit && canWrite && target?.page.state === "active" && Boolean(target.draft);
  const collaboration = useKnowledgeCollaboration({
    active: Boolean(editing && editable && target?.page.content_type === "document"),
    client,
    libraryID: library.id,
    pageID: reference.targetPageID,
    currentUserID,
    initialTitle: target?.draft?.title || target?.page.title || reference.title,
    initialContent: body,
    onDocument(_title, content, synced) { setBody(content); setDirty(!synced); },
    onError(error) { setEditing(false); setTarget(null); setFailure(errorStatus(error) === 403 || errorStatus(error) === 404 ? kt("knowledge.auto.15433219bb962dbf") : formatError(error)); },
  });
  useEffect(() => {
    let active = true;
    const abort = new AbortController();
    let revoked = false;
    let lastRevision = 0;
    let loadSequence = 0;
    let retryTimer = 0;
    const closeReference = (message: string) => {
      revoked = true;
      if (!abort.signal.aborted) abort.abort();
      setEditing(false); setTarget(null); setFixedVersion(null); setBody(""); setFailure(message); setLoading(false);
    };
    const load = async (initial: boolean) => {
      const sequence = ++loadSequence;
      if (initial) setLoading(true);
      try {
        const page = await client.getPage(library.id, reference.targetPageID, canWrite && live, abort.signal);
        let version: KnowledgePageVersion | null = null;
        if (!live) version = await client.getPageVersion(library.id, reference.targetPageID, reference.targetVersion, abort.signal);
        if (!active || sequence !== loadSequence) return false;
        lastRevision = page.page.revision;
        setTarget(page); setFixedVersion(version); setFailure("");
        if (!dirtyRef.current && !collaboration.available) {
          const source = version || (editing && page.draft ? page.draft : page.published || page.draft);
          setBody(source?.body.content || ""); setDirty(false);
        }
        return true;
      } catch (error) {
        if (!active || abort.signal.aborted || sequence !== loadSequence) return false;
        if (errorStatus(error) === 403 || errorStatus(error) === 404) closeReference(kt("knowledge.auto.a6bb0c422318c5e0"));
        else setFailure(formatError(error));
        return false;
      } finally { if (active && initial) setLoading(false); }
    };
    const waitForRetry = (delay: number) => new Promise<void>(resolve => {
      retryTimer = window.setTimeout(resolve, delay);
      abort.signal.addEventListener("abort", () => { window.clearTimeout(retryTimer); resolve(); }, { once: true });
    });
    const start = async () => {
      if (!await load(true) || !active || !live || !client.streamKnowledgePageLiveEvents) return;
      let failures = 0;
      while (active && !revoked && !abort.signal.aborted) {
        try {
          if (failures > 0 && !await load(false)) {
            if (revoked) return;
          }
          await client.streamKnowledgePageLiveEvents(library.id, reference.targetPageID, lastRevision, event => {
            lastRevision = Math.max(lastRevision, event.revision);
            if (event.type === "revoked") {
              closeReference(kt("knowledge.auto.15433219bb962dbf"));
            } else if (event.type === "changed") {
              void load(false);
            }
          }, abort.signal);
          if (!active || revoked || abort.signal.aborted) return;
          failures++;
        } catch (error) {
          if (!active || revoked || abort.signal.aborted) return;
          if (errorStatus(error) === 403 || errorStatus(error) === 404) {
            closeReference(kt("knowledge.auto.15433219bb962dbf"));
            return;
          }
          failures++;
          setFailure(kt("knowledge.auto.f5db31bf8f125912"));
        }
        await waitForRetry(Math.min(8_000, 500 * 2 ** Math.min(failures - 1, 4)));
      }
    };
    void start();
    const refresh = () => { if (document.visibilityState === "visible") void load(false); };
    window.addEventListener("focus", refresh); document.addEventListener("visibilitychange", refresh);
    return () => { active = false; abort.abort(); if (retryTimer) window.clearTimeout(retryTimer); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [canWrite, client, collaboration.available, editing, formatError, library.id, live, reference.targetPageID, reference.targetVersion]);
  const save = async () => {
    if (!target?.draft || !editable || saving) return;
    setSaving(true); setFailure("");
    try {
      let saved = target;
      const operations = client.applyPageNativeOperations ? await nativePageOperations(target.page.content_type, target.draft.body.content, body) : undefined;
      if (operations && client.applyPageNativeOperations) {
        if (operations.length > 0) saved = (await client.applyPageNativeOperations(library.id, target.page.id, { client_id: crypto.randomUUID(), base_draft_revision: target.draft.draft_revision, operations }, AbortSignal.timeout(30_000))).view;
        const automationDraft = saved.draft;
        if (automationDraft && saved.page.content_type === "multidimensional_table" && client.executeGridAutomation) {
          for (const execution of gridAutomationExecutions(automationDraft.body.content, operations, automationDraft.draft_revision)) {
            const currentDraft = saved.draft;
            if (!currentDraft) throw Error(kt("knowledge.auto.9d04b8d526f739b0"));
            execution.expected_draft_revision = currentDraft.draft_revision;
            saved = (await client.executeGridAutomation(library.id, saved.page.id, execution, AbortSignal.timeout(30_000))).view;
          }
        }
      } else {
        saved = await client.savePageDraft(library.id, target.page.id, {
          client_id: crypto.randomUUID(), expected_draft_revision: target.draft.draft_revision, expected_page_revision: target.page.revision,
          title: target.draft.title, parent_page_id: target.draft.parent_page_id, rank: target.draft.rank,
          content_schema_version: pageSchemaVersion, content: body, content_sha256: await pageContentSHA256(body),
        }, AbortSignal.timeout(30_000));
      }
      setTarget(saved); setBody(saved.draft?.body.content || body); setDirty(false);
    } catch (error) { setFailure(formatError(error)); }
    finally { setSaving(false); }
  };
  if (loading) return <div className="knowledge-reference-loading"><LoaderCircle className="knowledge-spin" size={16} />{kt("knowledge.auto.f4319d6428660747")}</div>;
  if (!target || failure && !body) return <div className="knowledge-reference-revoked"><ShieldCheck size={17} /><div><strong>{kt("knowledge.auto.ad1e8d9c0858faa7")}</strong><small>{failure || kt("knowledge.auto.97c67007bd116bb1")}</small></div></div>;
  const source = fixedVersion || (editing && target.draft ? target.draft : target.published || target.draft);
  const permission = !live ? ktf("knowledge.auto.4cf17f7f064e0413", { value0: reference.targetVersion }) : editable ? kt("knowledge.auto.f558463f1f3f85af") : kt("knowledge.auto.3b5ec3533b0e4485");
  const header = <header className="knowledge-reference-header"><PageTypeIcon type={target.page.content_type} size={17} /><div><strong>{source?.title || target.page.title}</strong><small>{pageTypeMeta[target.page.content_type].label} · {target.page.state === "active" ? permission : kt("knowledge.auto.82395d423099a07a")} {kt("knowledge.auto.47f9aa35408a178b")}{formatKnowledgeDate(target.page.updated_at)}</small></div><button type="button" onClick={() => onOpen(target.page.id)}>{kt("knowledge.auto.9985e67b405e4785")}</button></header>;
  if (reference.display === "card") return <div className="knowledge-reference-card">{header}</div>;
  return <section className="knowledge-reference-embed">{header}
    <div className="knowledge-reference-embed-actions">{editable && <button type="button" onClick={() => { setEditing(value => !value); setDirty(false); setBody((target.draft || source)?.body.content || ""); }}>{editing ? kt("knowledge.auto.2248e9bca8271906") : kt("knowledge.auto.7027210ef54a4046")}</button>}{editing && editable && target.page.content_type !== "document" && <button type="button" disabled={!dirty || saving} onClick={() => void save()}>{saving ? kt("knowledge.auto.ff509c9ba052a21c") : kt("knowledge.auto.15d6c6c85961ee92")}</button>}{collaboration.available && <span>{collaboration.state === "connected" ? kt("knowledge.auto.e737b5962649cbc9") : kt("knowledge.auto.7168bb55e6125183")}</span>}</div>
    {target.page.content_type === "file" && source ? <KnowledgeFilePage client={client} libraryID={library.id} pageID={target.page.id} content={source.body.content} formatError={formatError} /> : source ? <KnowledgeEditor
      type={target.page.content_type} body={body || source.body.content} documentTitle={source.title} canManage={library.role === "manager"} gridAccess={target.grid_access}
      collaboration={collaboration.available && collaboration.ready ? collaboration.editorCollaboration : undefined}
      readOnly={!editing || !editable || collaboration.available && !collaboration.ready}
      readFile={async referenceValue => { const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(referenceValue); if (!match) throw Error(kt("knowledge.auto.6c3635a6e01eeae5")); const response = await client.readDocumentContent(library.id, match[1], { signal: AbortSignal.timeout(120_000) }); if (!response.ok) throw Error(ktf("knowledge.auto.5c9601bcd7c28856", { value0: response.status })); return response.blob(); }}
      authorizeContentAction={async operation => {
        if (!client.authorizePageContentOperation) throw Error(kt("knowledge.auto.1f9f5ef234296e28"));
        await client.authorizePageContentOperation(library.id, target.page.id, operation, AbortSignal.timeout(30_000));
      }}
      onActionFeedback={message => setFailure(message)} onChange={(content, change) => { setBody(content); setDirty(true); if (collaboration.available) collaboration.edit(source.title, content, change); }} onPresence={collaboration.available ? collaboration.updatePresence : undefined}
    /> : <div className="knowledge-reference-empty">{kt("knowledge.auto.327ff5f0b0bce8fd")}</div>}
    {failure && <p className="knowledge-reference-error" role="alert">{failure}</p>}
  </section>;
}

const relationshipKindLabels = {
  get hierarchy() { return kt("knowledge.auto.6b652761296e404d"); },
  get reference() { return kt("knowledge.auto.72aacb4b9f11cbd5"); },
  get related() { return kt("knowledge.auto.83f6d8a79230686b"); },
} as const;

function KnowledgeRelationshipGraphView({ graph, onOpen }: { graph: KnowledgePageRelationshipGraph; onOpen(pageID: string): void }) {
  const width = 820, height = 430, centerX = width / 2, centerY = height / 2;
  const center = graph.nodes.find(node => node.page_id === graph.center_page_id);
  const neighbors = graph.nodes.filter(node => node.page_id !== graph.center_page_id);
  const positions = new Map<string, { x: number; y: number }>();
  if (center) positions.set(center.page_id, { x: centerX, y: centerY });
  neighbors.forEach((node, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / Math.max(1, neighbors.length));
    positions.set(node.page_id, { x: centerX + Math.cos(angle) * 300, y: centerY + Math.sin(angle) * 155 });
  });
  return <div className="knowledge-relationship-graph-view">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ktf("knowledge.auto.9135231292c490d0", { value0: center?.title || kt("knowledge.auto.9e3af30a80b7816d") })}>
      <defs><marker id="knowledge-relationship-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
      {graph.edges.map((edge, index) => {
        const source = positions.get(edge.source_page_id), target = positions.get(edge.target_page_id);
        if (!source || !target) return null;
        return <g className={`is-${edge.kind}`} key={`${edge.source_page_id}:${edge.target_page_id}:${edge.kind}:${index}`}>
          <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} markerEnd={edge.directed ? "url(#knowledge-relationship-arrow)" : undefined} />
          <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 5}>{relationshipKindLabels[edge.kind]}</text>
        </g>;
      })}
      {graph.nodes.map(node => {
        const point = positions.get(node.page_id);
        if (!point) return null;
        const compactTitle = [...node.title].slice(0, 11).join("") + ([...node.title].length > 11 ? "…" : "");
        return <g className={`knowledge-relationship-node${node.center ? " is-center" : ""}`} key={node.page_id} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`${node.title}，${identityPath(node)}`} onClick={() => onOpen(node.page_id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(node.page_id); } }}>
          <rect x="-75" y="-29" width="150" height="58" rx="12" />
          <text className="is-title" textAnchor="middle" y="-2">{compactTitle}</text>
          <text className="is-type" textAnchor="middle" y="16">{pageTypeMeta[node.content_type].label}</text>
        </g>;
      })}
    </svg>
    <div className="knowledge-relationship-legend" aria-label={kt("knowledge.auto.a84b2395beb3b57e")}>{Object.entries(relationshipKindLabels).map(([kind, label]) => <span className={`is-${kind}`} key={kind}><i />{label}</span>)}{graph.truncated && <em>{kt("knowledge.auto.0694065cde0e30d9")}{graph.nodes.length} {kt("knowledge.auto.082137f22303183e")}</em>}</div>
  </div>;
}

function currentPageTextRanges(root: HTMLElement, query: string) {
	const ranges: Range[] = [], normalized = query.toLocaleLowerCase();
	if (!normalized) return ranges;
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			const parent = node.parentElement;
			if (!parent || !node.textContent?.trim() || parent.closest("button,input,textarea,select,script,style,[aria-hidden='true'],.knowledge-page-find-bar,.knowledge-page-toolbar,.knowledge-page-breadcrumbs,.knowledge-page-title")) return NodeFilter.FILTER_REJECT;
			return NodeFilter.FILTER_ACCEPT;
		},
	});
	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		const text = node.textContent || "", lower = text.toLocaleLowerCase();
		let index = lower.indexOf(normalized);
		while (index >= 0 && ranges.length < 500) {
			const range = document.createRange();
			range.setStart(node, index); range.setEnd(node, index + query.length); ranges.push(range);
			index = lower.indexOf(normalized, index + Math.max(1, query.length));
		}
		if (ranges.length >= 500) break;
	}
	return ranges;
}

export function KnowledgePagesPanel({ client, library, currentUserID = "", disabled, formatError, embedded = false, initialPageID = "", initialBlockID, initialSearchLocation, initialPageMode = "read", scopeTabs, teamLibraries, hostIntegration, onLibrarySelect, onCreateLibrary, onSelectionChange, onManage }: { client: KnowledgeClient; library: KnowledgeLibrary; currentUserID?: string; disabled: boolean; formatError(error: unknown): string; embedded?: boolean; initialPageID?: string; initialBlockID?: string; initialSearchLocation?: KnowledgePageSearchLocation; initialPageMode?: "read" | "edit"; scopeTabs?: ReactNode; teamLibraries?: KnowledgeLibrary[]; hostIntegration?: KnowledgeHostIntegration; onLibrarySelect?: (libraryID: string) => void; onCreateLibrary?: () => void; onSelectionChange?: (page: { id: string; title: string; mode: "read" | "edit" } | null) => void; onManage?: () => void }) {
  const canWrite = !library.archived && (library.role === "editor" || library.role === "manager");
  const hasTeamLibraryPicker = library.kind === "shared" && !!teamLibraries?.length && !!onLibrarySelect;
  const [children, setChildren] = useState<Record<string, KnowledgePage[]>>({}), [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [childrenCursor, setChildrenCursor] = useState<Record<string, string>>({}), [childrenComplete, setChildrenComplete] = useState<Record<string, boolean>>({});
  const [navigationSection, setNavigationSection] = useState<PageNavigationSection>("all");
  const [collectionItems, setCollectionItems] = useState<KnowledgePageCollectionItem[]>([]), [collectionAfter, setCollectionAfter] = useState(""), [collectionComplete, setCollectionComplete] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [personalState, setPersonalState] = useState<KnowledgePagePersonalState | null>(null), [personalStateSaving, setPersonalStateSaving] = useState(false);
  const [metadata, setMetadata] = useState<KnowledgePageMetadata | null>(null), [metadataTagsInput, setMetadataTagsInput] = useState(""), [metadataAliasesInput, setMetadataAliasesInput] = useState("");
  const [metadataDirty, setMetadataDirty] = useState(false), [metadataSaving, setMetadataSaving] = useState(false);
  const [metadataMemberQuery, setMetadataMemberQuery] = useState(""), [metadataMembers, setMetadataMembers] = useState<KnowledgePrincipal[]>([]);
  const [governanceDraft, setGovernanceDraft] = useState<PageGovernanceDraft | null>(null), [governanceDirty, setGovernanceDirty] = useState(false), [governanceSaving, setGovernanceSaving] = useState(false);
  const [governanceAudit, setGovernanceAudit] = useState<KnowledgeGovernanceEvent[]>([]), [governanceAuditAfter, setGovernanceAuditAfter] = useState(""), [governanceAuditComplete, setGovernanceAuditComplete] = useState(true), [governanceAuditLoading, setGovernanceAuditLoading] = useState(false);
  const [governanceAuditEvent, setGovernanceAuditEvent] = useState(""), [governanceAuditActor, setGovernanceAuditActor] = useState("");
  const [outgoingReferences, setOutgoingReferences] = useState<KnowledgePageReferenceLink[]>([]), [incomingReferences, setIncomingReferences] = useState<KnowledgePageReferenceLink[]>([]);
  const [outgoingReferenceAfter, setOutgoingReferenceAfter] = useState(""), [incomingReferenceAfter, setIncomingReferenceAfter] = useState("");
  const [outgoingReferencesComplete, setOutgoingReferencesComplete] = useState(true), [incomingReferencesComplete, setIncomingReferencesComplete] = useState(true), [referencesLoading, setReferencesLoading] = useState(false);
  const [relationshipGraph, setRelationshipGraph] = useState<KnowledgePageRelationshipGraph | null>(null), [relationshipLoading, setRelationshipLoading] = useState(false);
  const [relationshipQuery, setRelationshipQuery] = useState(""), [relationshipResults, setRelationshipResults] = useState<KnowledgePageIdentity[]>([]), [relationshipSearchLoading, setRelationshipSearchLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(initialPageID), [view, setView] = useState<KnowledgePageView | null>(null), [loading, setLoading] = useState(true);
  const [editorEpoch, setEditorEpoch] = useState(0);
	const [localFilter, setLocalFilter] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
	const [collaborationFailure, setCollaborationFailure] = useState("");
	const [pageFindOpen, setPageFindOpen] = useState(false), [pageFindQuery, setPageFindQuery] = useState("");
	const [pageFindCount, setPageFindCount] = useState(0), [pageFindActive, setPageFindActive] = useState(0);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false), [templates, setTemplates] = useState<KnowledgePageTemplate[]>([]);
  const [templateVersions, setTemplateVersions] = useState<Record<string, KnowledgePageTemplateVersionSummary[]>>({}), [templateVersionOpen, setTemplateVersionOpen] = useState("");
  const [templateTitle, setTemplateTitle] = useState(""), [templateDescription, setTemplateDescription] = useState(""), [templateBusy, setTemplateBusy] = useState("");
  const [dragged, setDragged] = useState<KnowledgePage | null>(null);
  const [treeDropTarget, setTreeDropTarget] = useState<TreeDropTarget | null>(null);
  const [mode, setMode] = useState<PageWorkspaceMode>("read");
  const [title, setTitle] = useState(""), [body, setBody] = useState(""), [dirty, setDirty] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [pageActionHost, setPageActionHost] = useState<HTMLDivElement | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "conflict" | "error">("idle");
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "error">("idle");
  const [saveConflict, setSaveConflict] = useState<KnowledgePageConflict | null>(null);
  const [versions, setVersions] = useState<KnowledgePageVersion[]>([]), [diff, setDiff] = useState<KnowledgePageVersionDiff | null>(null), [compare, setCompare] = useState<number[]>([]);
  const [versionBefore, setVersionBefore] = useState(0), [versionsComplete, setVersionsComplete] = useState(true);
  const [editHistory, setEditHistory] = useState<KnowledgePageEditHistoryEntry[]>([]), [editHistoryBefore, setEditHistoryBefore] = useState(0), [editHistoryComplete, setEditHistoryComplete] = useState(true);
  const [historyPreview, setHistoryPreview] = useState<KnowledgePageVersion | null>(null);
  const [historySection, setHistorySection] = useState<"versions" | "edits">("versions");
  const [rollbackVersion, setRollbackVersion] = useState<number | null>(null), [rollbackBusy, setRollbackBusy] = useState(false);
  const [comments, setComments] = useState<KnowledgePageComment[]>([]), [commentBody, setCommentBody] = useState(""), [unresolvedOnly, setUnresolvedOnly] = useState(false);
  const [commentAfter, setCommentAfter] = useState(""), [commentsComplete, setCommentsComplete] = useState(true);
  const [editingCommentID, setEditingCommentID] = useState(""), [editingCommentBody, setEditingCommentBody] = useState(""), [editingCommentMentionedUserIDs, setEditingCommentMentionedUserIDs] = useState<string[]>([]);
  const [mentionedUserIDs, setMentionedUserIDs] = useState<string[]>([]), [commentComposerFocusRequest, setCommentComposerFocusRequest] = useState(0);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({}), [replyingTo, setReplyingTo] = useState("");
  const [organizationProfiles, setOrganizationProfiles] = useState<Record<string, KnowledgeOrganizationPrincipal>>({});
  const memberProfilesRef = useRef<Record<string, KnowledgePrincipal>>({});
  const principalResolutionInFlightRef = useRef(new Set<string>());
  memberProfilesRef.current = memberProfiles;
  const [commentAnchor, setCommentAnchor] = useState<KnowledgeCommentAnchorSelection | null>(null);
  const [commentFocus, setCommentFocus] = useState({ nodeID: "", revision: 0 });
  const [activeCommentThreadID, setActiveCommentThreadID] = useState("");
  const commentThreadRefs = useRef<Record<string, HTMLElement | null>>({});
  const [suggestions, setSuggestions] = useState<KnowledgePageSuggestion[]>([]), [suggestionKind, setSuggestionKind] = useState<"insert" | "delete">("insert");
  const [suggestionText, setSuggestionText] = useState(""), [suggestionComment, setSuggestionComment] = useState(""), [suggestionMentionedUserIDs, setSuggestionMentionedUserIDs] = useState<string[]>([]), [suggestionBusy, setSuggestionBusy] = useState("");
  const [suggestionPanelOpen, setSuggestionPanelOpen] = useState(false);
  const [attachments, setAttachments] = useState<KnowledgePageAttachment[]>([]), [attaching, setAttaching] = useState(false);
  const [importingFilePage, setImportingFilePage] = useState(false);
  const [tasks, setTasks] = useState<KnowledgePageTask[]>([]), [tasksReady, setTasksReady] = useState(false);
  const [polls, setPolls] = useState<KnowledgePagePollView[]>([]), [pollsReady, setPollsReady] = useState(false);
  const [accessQuery, setAccessQuery] = useState(""), [accessPrincipals, setAccessPrincipals] = useState<KnowledgePrincipal[]>([]), [accessUserID, setAccessUserID] = useState("");
  const [accessAction, setAccessAction] = useState("knowledge.pages.get"), [accessShareID, setAccessShareID] = useState(""), [accessExplanation, setAccessExplanation] = useState<KnowledgeAccessExplanation | null>(null);
  const [pageAccess, setPageAccess] = useState<KnowledgePageAccessPolicy | null>(null), [permissionMode, setPermissionMode] = useState<"inherit" | "restricted">("inherit");
  const [permissionGrants, setPermissionGrants] = useState<KnowledgePageAccessGrant[]>([]), [permissionQuery, setPermissionQuery] = useState(""), [permissionPrincipals, setPermissionPrincipals] = useState<KnowledgePrincipal[]>([]);
  const [permissionSubjectType, setPermissionSubjectType] = useState<KnowledgeAccessSubject["type"]>("user");
  const [permissionRole, setPermissionRole] = useState<KnowledgePageAccessGrant["role"]>("reader"), [permissionScope, setPermissionScope] = useState<KnowledgePageAccessGrant["scope"]>("page"), [permissionSaving, setPermissionSaving] = useState(false);
  const [pendingMove, setPendingMove] = useState<PendingPageMove | null>(null);
  const [aiOpen, setAIOpen] = useState(false), [aiOperation, setAIOperation] = useState<KnowledgeAIOperation>("summarize"), [aiSourceScope, setAISourceScope] = useState<KnowledgeAISourceScope>("published");
  const [aiPrompt, setAIPrompt] = useState(""), [aiLanguage, setAILanguage] = useState(kt("knowledge.auto.9937e365aaf3a085")), [aiExecution, setAIExecution] = useState<KnowledgeAIExecution | null>(null);
  const [aiBusy, setAIBusy] = useState(false), [aiFailure, setAIFailure] = useState(""), [aiInsertRequest, setAIInsertRequest] = useState<{ id: string; markdown: string } | undefined>();
  const [addSelectionBusy, setAddSelectionBusy] = useState(false);
  const viewRef = useRef<KnowledgePageView | null>(null), editRef = useRef({ title: "", body: "" }), saveQueue = useRef(Promise.resolve());
  const pendingSaveRef = useRef<PendingPageSave | null>(null), pendingNativeSaveRef = useRef<PendingNativePageSave | null>(null), pendingPublishRef = useRef<PendingPagePublish | null>(null);
  const printAuthorizationRef = useRef(0);
  const editAfterSelectRef = useRef("");
  const activeAttachmentUploadsRef = useRef(0);
  const aiRequestAbortRef = useRef<AbortController | null>(null);
  const treeButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const libraryRef = useRef(library), formatErrorRef = useRef(formatError);
	const loadChildrenRef = useRef<(parentPageID?: string, signal?: AbortSignal, append?: boolean) => Promise<void>>(async () => undefined);
	libraryRef.current = library;
	formatErrorRef.current = formatError;
	const titleInputRef = useRef<HTMLInputElement | null>(null);
	const pageFindInputRef = useRef<HTMLInputElement | null>(null), pageFindSurfaceRef = useRef<HTMLElement | null>(null), pageFindRangesRef = useRef<Range[]>([]);
  const tasksRef = useRef<KnowledgePageTask[]>([]), taskCreatesRef = useRef(new Map<string, Promise<KnowledgePageTask>>());
  const pollsRef = useRef<KnowledgePagePollView[]>([]), pollCreatesRef = useRef(new Map<string, Promise<KnowledgePagePollView>>());
  const fileUploadAccept = useMemo(() => ({
    all: knowledgeDocumentAccept(library),
    image: knowledgeDocumentAcceptForContentType(library, "image/"),
    video: knowledgeDocumentAcceptForContentType(library, "video/"),
    audio: knowledgeDocumentAcceptForContentType(library, "audio/"),
  }), [library]);
  const collaboration = useKnowledgeCollaboration({
    active: mode === "edit" && canWrite && !!selectedID && !!view?.draft && view.page.content_type === "document",
    client,
    libraryID: library.id,
    pageID: selectedID,
    currentUserID,
    initialTitle: title,
    initialContent: body,
    resolveUserName: userID => memberProfiles[userID]?.display_name || userID,
    resolveUserColor: collaboratorColor,
    onDocument(nextTitle, nextBody, synced) {
      setTitle(nextTitle); setBody(nextBody); editRef.current = { title: nextTitle, body: nextBody };
      if (synced && nextTitle.trim()) syncVisiblePageTitle(selectedID, nextTitle);
      setDirty(!synced); setSaveState(synced ? "saved" : "saving"); setSaveConflict(null);
    },
    onError(failure) { setCollaborationFailure(formatError(failure)); },
  });
  const collaborationRef = useRef(collaboration);
  collaborationRef.current = collaboration;
	useEffect(() => {
		if (collaboration.state === "connected") setCollaborationFailure("");
	}, [collaboration.state]);
	useEffect(() => setCollaborationFailure(""), [selectedID]);
  const nativeAwareness = useKnowledgeNativeAwareness({
    active: mode === "edit" && canWrite && !!selectedID && !!view?.draft && ["whiteboard", "mind_map", "flowchart"].includes(view.page.content_type),
    client,
    libraryID: library.id,
    pageID: selectedID,
    onSnapshot(snapshot) {
      const current = viewRef.current;
      if (!current?.draft || snapshot.draft_revision <= current.draft.draft_revision || editRef.current.title !== current.draft.title || editRef.current.body !== current.draft.body.content) return;
      const pageID = current.page.id;
      void client.getPage(library.id, pageID, true, AbortSignal.timeout(30_000)).then(refreshed => {
        if (viewRef.current?.page.id !== pageID || !refreshed.draft || editRef.current.title !== current.draft!.title || editRef.current.body !== current.draft!.body.content) return;
        viewRef.current = refreshed; setView(refreshed); setTitle(refreshed.draft.title); setBody(refreshed.draft.body.content); editRef.current = { title: refreshed.draft.title, body: refreshed.draft.body.content }; setSaveState("saved");
      }).catch(failure => setError(formatError(failure)));
    },
    onError(failure) { setError(formatError(failure)); },
  });
  const activePresence = collaboration.available ? collaboration.presence : nativeAwareness.presence;
  const activePresenceUserIDs = useMemo(() => collaborationPresenceUserIDs(activePresence), [activePresence]);
  const activePresenceUserKey = activePresenceUserIDs.join("\u0000");
  const activeOnlineUsers = collaboration.available ? collaboration.onlineUsers : nativeAwareness.onlineUsers;
  const presenceAvailable = collaboration.available || nativeAwareness.available;
  const presenceUserID = collaboration.userID || currentUserID;

	useEffect(() => {
		onSelectionChange?.(view ? { id: view.page.id, title: view.page.title, mode: mode === "edit" ? "edit" : "read" } : null);
	}, [mode, onSelectionChange, view?.page.id, view?.page.title]);

  useEffect(() => {
    aiRequestAbortRef.current?.abort();
    aiRequestAbortRef.current = null;
    setAIOpen(false); setAIExecution(null); setAIFailure(""); setAIInsertRequest(undefined);
  }, [selectedID]);

  useEffect(() => () => aiRequestAbortRef.current?.abort(), []);

	useEffect(() => {
		const handleFindShortcut = (event: KeyboardEvent) => {
			if (!view || !(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLocaleLowerCase() !== "f") return;
			event.preventDefault(); setPageFindOpen(true); window.setTimeout(() => pageFindInputRef.current?.select());
		};
		window.addEventListener("keydown", handleFindShortcut);
		return () => window.removeEventListener("keydown", handleFindShortcut);
	}, [view]);

	useEffect(() => {
		const registry = (CSS as unknown as { highlights?: { set(name: string, value: unknown): void; delete(name: string): void } }).highlights;
		registry?.delete("knowledge-page-find"); registry?.delete("knowledge-page-find-active");
		pageFindRangesRef.current = []; setPageFindCount(0); setPageFindActive(0);
		if (!pageFindOpen || !pageFindQuery || !pageFindSurfaceRef.current) return;
		const timer = window.setTimeout(() => {
			const ranges = currentPageTextRanges(pageFindSurfaceRef.current!, pageFindQuery);
			pageFindRangesRef.current = ranges; setPageFindCount(ranges.length); setPageFindActive(0);
			const HighlightConstructor = (window as unknown as { Highlight?: new (...ranges: Range[]) => unknown }).Highlight;
			if (registry && HighlightConstructor && ranges.length) registry.set("knowledge-page-find", new HighlightConstructor(...ranges));
		}, 0);
		return () => { window.clearTimeout(timer); registry?.delete("knowledge-page-find"); registry?.delete("knowledge-page-find-active"); };
	}, [body, mode, pageFindOpen, pageFindQuery, selectedID, view?.page.revision]);

	useEffect(() => {
		const registry = (CSS as unknown as { highlights?: { set(name: string, value: unknown): void; delete(name: string): void } }).highlights;
		registry?.delete("knowledge-page-find-active");
		const range = pageFindRangesRef.current[pageFindActive];
		const HighlightConstructor = (window as unknown as { Highlight?: new (...ranges: Range[]) => unknown }).Highlight;
		if (!range) return;
		if (registry && HighlightConstructor) registry.set("knowledge-page-find-active", new HighlightConstructor(range));
		(range.startContainer.parentElement || range.commonAncestorContainer.parentElement)?.scrollIntoView({ block: "center", behavior: "smooth" });
		return () => registry?.delete("knowledge-page-find-active");
	}, [pageFindActive, pageFindCount]);

  function syncVisiblePageTitle(pageID: string, nextTitle: string) {
    const normalized = nextTitle.trim();
    if (!pageID || !normalized) return;
    setChildren(current => {
      let changed = false;
      const next = Object.fromEntries(Object.entries(current).map(([parentID, pages]) => [parentID, pages.map(page => {
        if (page.id !== pageID || page.title === normalized) return page;
        changed = true;
        return { ...page, title: normalized };
      })]));
      return changed ? next : current;
    });
    setCollectionItems(current => {
      let changed = false;
      const next = current.map(item => {
        if (item.page.id !== pageID || item.page.title === normalized) return item;
        changed = true;
        return { ...item, page: { ...item.page, title: normalized } };
      });
      return changed ? next : current;
    });
    const current = viewRef.current;
    if (!current) return;
    const page = current.page.id === pageID && current.page.title !== normalized ? { ...current.page, title: normalized } : current.page;
    const breadcrumbs = current.breadcrumbs.map(item => item.page_id === pageID && item.title !== normalized ? { ...item, title: normalized } : item);
    if (page === current.page && breadcrumbs.every((item, index) => item === current.breadcrumbs[index])) return;
    const next = { ...current, page, breadcrumbs };
    viewRef.current = next;
    setView(next);
  }

  function focusTreePage(pageID: string) {
    setSelectedID(pageID);
    window.setTimeout(() => treeButtonRefs.current[pageID]?.focus());
  }

  async function resolveProfiles(userIDs: string[], signal: AbortSignal) {
    const unique = [...new Set(userIDs.filter(Boolean))].filter(userID => !memberProfilesRef.current[userID] && !principalResolutionInFlightRef.current.has(userID));
    if (unique.length === 0) return;
    unique.forEach(userID => principalResolutionInFlightRef.current.add(userID));
    try {
      const profiles = await client.resolvePrincipals(unique, signal);
      if (!signal.aborted) {
        const resolved = Object.fromEntries(profiles.filter(profile => profile.status === "active").map(profile => [profile.user_id, profile]));
        memberProfilesRef.current = { ...memberProfilesRef.current, ...resolved };
        setMemberProfiles(current => ({ ...current, ...resolved }));
      }
    } catch {
      // The content remains readable; unavailable identities render as such.
    } finally {
      unique.forEach(userID => principalResolutionInFlightRef.current.delete(userID));
    }
  }

  async function resolveOrganizationProfiles(organizationIDs: string[], signal: AbortSignal) {
    const ids = [...new Set(organizationIDs.filter(Boolean))];
    if (!ids.length) return;
    const values = await client.resolveOrganizationPrincipals(ids, signal);
    if (!signal.aborted) setOrganizationProfiles(current => ({ ...current, ...Object.fromEntries(values.map(item => [item.organization_id, item])) }));
  }

  function subjectLabel(subject: KnowledgeAccessSubject) {
    return subject.type === "user" ? memberProfiles[subject.id]?.display_name || subject.id : organizationProfiles[subject.id]?.display_name || subject.id;
  }

  async function loadChildren(parentPageID = "", signal = AbortSignal.timeout(30_000), append = false) {
    const page = await client.listPages(library.id, parentPageID, append ? childrenCursor[parentPageID] || "" : "", 50, false, signal);
    setChildren(current => ({ ...current, [parentPageID]: append ? [...(current[parentPageID] || []), ...page.items] : page.items }));
    setChildrenCursor(current => ({ ...current, [parentPageID]: page.next_after || "" }));
    setChildrenComplete(current => ({ ...current, [parentPageID]: page.complete }));
    if (parentPageID) {
      const hasChildren = page.items.length > 0 || !page.complete;
      if (!hasChildren) setExpanded(current => {
        if (!current.has(parentPageID)) return current;
        const next = new Set(current); next.delete(parentPageID); return next;
      });
    }
    if (parentPageID === "" && page.items[0]) setSelectedID(current => current || page.items[0].id);
  }
  loadChildrenRef.current = loadChildren;

  useEffect(() => {
    const abort = new AbortController();
    setChildren({}); setChildrenCursor({}); setChildrenComplete({}); setExpanded(new Set()); setSelectedID(initialPageID); setView(null); setLoading(true); setError("");
    setNavigationSection("all"); setCollectionItems([]); setCollectionAfter(""); setCollectionComplete(true); setPersonalState(null); setPersonalStateSaving(false);
    setMetadata(null); setMetadataTagsInput(""); setMetadataAliasesInput(""); setMetadataDirty(false); setMetadataSaving(false); setMetadataMemberQuery(""); setMetadataMembers([]);
    setRelationshipGraph(null); setRelationshipLoading(false); setRelationshipQuery(""); setRelationshipResults([]); setRelationshipSearchLoading(false);
    setTemplateDialogOpen(false); setTemplates([]); setTemplateVersions({}); setTemplateVersionOpen(""); editAfterSelectRef.current = "";
    void loadChildren("", abort.signal).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, formatError, initialPageID, library.id]);

  useEffect(() => {
    if (navigationSection === "all") { setCollectionItems([]); setCollectionAfter(""); setCollectionComplete(true); setCollectionLoading(false); return; }
    const abort = new AbortController();
    setCollectionLoading(true); setCollectionItems([]); setCollectionAfter(""); setCollectionComplete(true); setError("");
    void client.listPageCollection(library.id, navigationSection, "", 50, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setCollectionItems(page.items); setCollectionAfter(page.next_after || ""); setCollectionComplete(page.complete);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setCollectionLoading(false); });
    return () => abort.abort();
  }, [client, formatError, library.id, navigationSection]);

  useEffect(() => {
    if (!selectedID) { setView(null); setPersonalState(null); setMetadata(null); setGovernanceDraft(null); setRelationshipGraph(null); return; }
    const abort = new AbortController(); setLoading(true); setError(""); setPersonalState(null); setMetadata(null); setMetadataTagsInput(""); setMetadataAliasesInput(""); setMetadataDirty(false); setMetadataSaving(false); setGovernanceDraft(null); setGovernanceDirty(false); setGovernanceSaving(false); setGovernanceAudit([]); setGovernanceAuditAfter(""); setGovernanceAuditComplete(true); setRelationshipGraph(null); setRelationshipQuery(""); setRelationshipResults([]); pendingSaveRef.current = null; pendingNativeSaveRef.current = null; pendingPublishRef.current = null;
    void Promise.all([client.getPage(library.id, selectedID, canWrite, abort.signal), client.getPageMetadata(library.id, selectedID, abort.signal)]).then(([value, rawPageMetadata]) => {
      if (abort.signal.aborted) return;
      const pageMetadata = normalizePageMetadata(rawPageMetadata);
      setView(value); viewRef.current = value;
      setMetadata(pageMetadata); setMetadataTagsInput(pageMetadata.tags.join(", ")); setMetadataAliasesInput(pageMetadata.aliases.join(", ")); setGovernanceDraft(governanceDraftFromMetadata(pageMetadata));
      const source = value.draft || value.published;
      setTitle(source?.title || value.page.title); setBody(source?.body.content || ""); editRef.current = { title: source?.title || value.page.title, body: source?.body.content || "" };
      const editAfterSelect = editAfterSelectRef.current === value.page.id;
      if (editAfterSelect) editAfterSelectRef.current = "";
      const linkedEdit = value.page.id === initialPageID && initialPageMode === "edit" && canWrite;
      setDirty(false); setSaveState("idle"); setPublishState("idle"); setSaveConflict(null); setTitleEditing(editAfterSelect); setMode(editAfterSelect || linkedEdit ? "edit" : "read"); setDiff(null); setCompare([]); setHistoryPreview(null); setHistorySection("versions"); setRollbackVersion(null); setRollbackBusy(false);
      setVersions([]); setVersionBefore(0); setVersionsComplete(true); setEditHistory([]); setEditHistoryBefore(0); setEditHistoryComplete(true); setComments([]); setCommentAfter(""); setCommentsComplete(true); setCommentBody(""); setCommentAnchor(null); setCommentFocus({ nodeID: "", revision: 0 }); setActiveCommentThreadID(""); setReplyingTo(""); setSuggestions([]); setSuggestionText(""); setSuggestionComment(""); setSuggestionMentionedUserIDs([]); setSuggestionBusy(""); setSuggestionPanelOpen(false); setPageAccess(null); setPermissionGrants([]); setPendingMove(null);
      void resolveProfiles([value.published?.published_by_user_id || "", pageMetadata.owner_user_id || "", ...pageMetadata.content_admin_user_ids, pageMetadata.last_reviewed_by_user_id || "", pageMetadata.updated_by_user_id || "", ...pageMetadata.properties.filter(property => property.type === "person").map(property => property.value)], abort.signal);
      if (editAfterSelect) window.setTimeout(() => titleInputRef.current?.select());
      void client.recordPageView(library.id, value.page.id, { client_id: crypto.randomUUID() }, abort.signal).then(state => {
        if (!abort.signal.aborted && value.page.id === viewRef.current?.page.id) setPersonalState(state);
      }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    }).catch(failure => { if (!abort.signal.aborted) { setView(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [canWrite, client, formatError, initialPageID, initialPageMode, library.id, selectedID]);

  useEffect(() => {
    if (mode !== "edit") setTitleEditing(false);
    if (mode !== "suggestions") setSuggestionPanelOpen(false);
  }, [mode]);

  async function refreshCollection(kind: KnowledgePageCollectionKind, signal = AbortSignal.timeout(30_000)) {
    setCollectionLoading(true);
    try {
      const page = await client.listPageCollection(library.id, kind, "", 50, signal);
      setCollectionItems(page.items); setCollectionAfter(page.next_after || ""); setCollectionComplete(page.complete);
    } finally {
      setCollectionLoading(false);
    }
  }

  async function loadMoreCollection() {
    if (navigationSection === "all" || collectionComplete || !collectionAfter || collectionLoading) return;
    setCollectionLoading(true); setError("");
    try {
      const page = await client.listPageCollection(library.id, navigationSection, collectionAfter, 50, AbortSignal.timeout(30_000));
      setCollectionItems(current => [...current, ...page.items.filter(item => !current.some(saved => saved.page.id === item.page.id))]);
      setCollectionAfter(page.next_after || ""); setCollectionComplete(page.complete);
    } catch (failure) { setError(formatError(failure)); }
    finally { setCollectionLoading(false); }
  }

  async function updatePersonalState(input: { favorite?: boolean; subscribed?: boolean; shortcutRank?: string }, success: string) {
    const current = personalState;
    if (!current || !selectedID || personalStateSaving || view?.page.state !== "active") return;
    setPersonalStateSaving(true); setError("");
    try {
      const next = await client.setPagePersonalState(library.id, selectedID, {
        client_id: crypto.randomUUID(), expected_revision: current.revision,
        favorite: input.favorite ?? current.favorite,
        subscribed: input.subscribed ?? current.subscribed,
        shortcut_rank: input.shortcutRank ?? current.shortcut_rank,
      }, AbortSignal.timeout(30_000));
      setPersonalState(next); setCollectionItems(items => items.map(item => item.page.id === selectedID ? { ...item, state: next } : item)); setNotice(success);
      if (navigationSection !== "all") await refreshCollection(navigationSection);
    } catch (failure) {
      if (errorStatus(failure) === 409) {
        try { setPersonalState(await client.getPagePersonalState(library.id, selectedID, AbortSignal.timeout(30_000))); } catch { /* Keep the original conflict visible. */ }
      }
      setError(formatError(failure));
    } finally { setPersonalStateSaving(false); }
  }

  function updateMetadata(update: (current: KnowledgePageMetadata) => KnowledgePageMetadata) {
    setMetadata(current => current ? update(current) : current);
    setMetadataDirty(true);
  }

  function addMetadataProperty() {
    if (!metadata || metadata.properties.length >= 32) return;
    const used = new Set(metadata.properties.map(property => property.name));
    let number = metadata.properties.length + 1;
    while (used.has(ktf("knowledge.auto.7fd1f70d350beb38", { value0: number }))) number++;
    const property: KnowledgePageCustomProperty = { id: `prop_${crypto.randomUUID()}`, name: ktf("knowledge.auto.7fd1f70d350beb38", { value0: number }), type: "text", value: "" };
    updateMetadata(current => ({ ...current, properties: [...current.properties, property] }));
  }

  async function reloadMetadata() {
    if (!selectedID) return;
    setMetadataSaving(true); setError("");
    try {
      const current = normalizePageMetadata(await client.getPageMetadata(library.id, selectedID, AbortSignal.timeout(30_000)));
      setMetadata(current); setMetadataTagsInput(current.tags.join(", ")); setMetadataAliasesInput(current.aliases.join(", ")); setMetadataDirty(false); setGovernanceDraft(governanceDraftFromMetadata(current)); setGovernanceDirty(false);
      void resolveProfiles([current.owner_user_id || "", ...current.content_admin_user_ids, current.last_reviewed_by_user_id || "", current.updated_by_user_id || "", ...current.properties.filter(property => property.type === "person").map(property => property.value)], AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
    finally { setMetadataSaving(false); }
  }

  async function saveMetadata() {
    if (!metadata || !selectedID || metadataSaving || !canWrite || view?.page.state !== "active") return;
    setMetadataSaving(true); setError("");
    try {
      const saved = normalizePageMetadata(await client.setPageMetadata(library.id, selectedID, {
        client_id: crypto.randomUUID(), expected_revision: metadata.revision,
        aliases: metadataAliases(metadataAliasesInput), related_page_ids: metadata.related_page_ids,
        tags: metadataTags(metadataTagsInput), status: metadata.status, properties: metadata.properties,
      }, AbortSignal.timeout(30_000)));
      setMetadata(saved); setMetadataTagsInput(saved.tags.join(", ")); setMetadataAliasesInput(saved.aliases.join(", ")); setMetadataDirty(false); setNotice(kt("knowledge.auto.60033691ba3cd29f"));
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || "", ...saved.properties.filter(property => property.type === "person").map(property => property.value)], AbortSignal.timeout(30_000));
      if (mode === "relationships") void loadRelationshipGraph();
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? kt("knowledge.auto.9c49f077b460e911") : formatError(failure));
    } finally { setMetadataSaving(false); }
  }

  function updateGovernance(update: (current: PageGovernanceDraft) => PageGovernanceDraft) {
    setGovernanceDraft(current => current ? update(current) : current);
    setGovernanceDirty(true);
  }

  async function saveGovernance() {
    if (!metadata || !governanceDraft || !selectedID || governanceSaving || library.role !== "manager") return;
    setGovernanceSaving(true); setError("");
    try {
      const saved = normalizePageMetadata(await client.setPageGovernance(library.id, selectedID, {
        client_id: crypto.randomUUID(), expected_revision: metadata.revision,
        owner_user_id: governanceDraft.ownerUserID,
        content_admin_user_ids: governanceDraft.contentAdminUserIDs,
        archive_retention_days: governanceDraft.archiveRetentionDays,
        review_interval_days: governanceDraft.reviewIntervalDays,
        next_review_at: governanceDraft.nextReviewAt,
      }, AbortSignal.timeout(30_000)));
      setMetadata(current => current && metadataDirty ? {
        ...saved,
        aliases: current.aliases,
        related_page_ids: current.related_page_ids,
        tags: current.tags,
        status: current.status,
        properties: current.properties,
      } : saved);
      setGovernanceDraft(governanceDraftFromMetadata(saved)); setGovernanceDirty(false); setNotice(kt("knowledge.auto.93c926b90a1a466b"));
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || ""], AbortSignal.timeout(30_000));
      void loadGovernanceAudit(true);
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? kt("knowledge.auto.8a8a9d7b7f020b38") : formatError(failure));
    } finally { setGovernanceSaving(false); }
  }

  async function reviewGovernance() {
    if (!metadata || !selectedID || governanceSaving || governanceDirty || view?.page.state !== "active") return;
    setGovernanceSaving(true); setError("");
    try {
      const saved = normalizePageMetadata(await client.reviewPageGovernance(library.id, selectedID, { client_id: crypto.randomUUID(), expected_revision: metadata.revision }, AbortSignal.timeout(30_000)));
      setMetadata(saved); setGovernanceDraft(governanceDraftFromMetadata(saved)); setNotice(kt("knowledge.auto.67dab1f86fb02ca6"));
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || ""], AbortSignal.timeout(30_000));
      void loadGovernanceAudit(true);
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? kt("knowledge.auto.a6010dcefd426c3b") : formatError(failure));
    } finally { setGovernanceSaving(false); }
  }

  async function loadGovernanceAudit(reset: boolean) {
    if (!selectedID || library.role !== "manager" || governanceAuditLoading) return;
    setGovernanceAuditLoading(true); setError("");
    try {
      const page = await client.listPageGovernanceAudit(library.id, selectedID, governanceAuditEvent.trim(), governanceAuditActor.trim(), reset ? "" : governanceAuditAfter, 30, AbortSignal.timeout(30_000));
      setGovernanceAudit(current => reset ? page.items : [...current, ...page.items.filter(item => !current.some(saved => saved.id === item.id))]);
      setGovernanceAuditAfter(page.next_after || ""); setGovernanceAuditComplete(page.complete);
      void resolveProfiles(page.items.map(item => item.actor.user_id), AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
    finally { setGovernanceAuditLoading(false); }
  }

  async function loadRelationshipGraph(signal = AbortSignal.timeout(30_000)) {
    if (!selectedID) return;
    setRelationshipLoading(true);
    try {
      const [graph, identities] = await Promise.all([
        client.getPageRelationshipGraph(library.id, selectedID, 2, 120, signal),
        client.searchPageIdentities(library.id, relationshipQuery.trim(), 30, signal),
      ]);
      setRelationshipGraph(graph);
      setRelationshipResults(identities.items.filter(item => item.page_id !== selectedID));
    } catch (failure) {
      if (!(failure instanceof DOMException && failure.name === "AbortError")) setError(formatError(failure));
    } finally {
      setRelationshipLoading(false);
    }
  }

  useEffect(() => {
    if (!dirty || mode !== "edit" || !view?.draft || disabled || collaboration.available) return;
    const timer = window.setTimeout(() => void saveDraft(), 900);
    return () => window.clearTimeout(timer);
  }, [body, collaboration.available, dirty, disabled, mode, title]);

  useEffect(() => {
    if (activePresenceUserIDs.length === 0) return;
    const abort = new AbortController();
    void resolveProfiles(activePresenceUserIDs, abort.signal);
    return () => abort.abort();
  }, [activePresenceUserKey]);

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (dirty || saveState === "saving" || metadataDirty || metadataSaving || governanceDirty || governanceSaving) event.preventDefault(); };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty, governanceDirty, governanceSaving, metadataDirty, metadataSaving, saveState]);

  useEffect(() => {
    if ((mode !== "history" && mode !== "activity") || !selectedID) return;
    const abort = new AbortController();
    void client.listPageVersions(library.id, selectedID, 0, 50, abort.signal).then(page => { if (!abort.signal.aborted) { setVersions(page.items); setVersionBefore(page.next_before || 0); setVersionsComplete(page.complete); void resolveProfiles(page.items.map(item => item.published_by_user_id), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID]);

  useEffect(() => {
    if (mode !== "history" || historySection !== "edits" || !selectedID) return;
    const abort = new AbortController();
    void client.listPageEditHistory(library.id, selectedID, 0, 50, abort.signal).then(page => { if (!abort.signal.aborted) { setEditHistory(page.items); setEditHistoryBefore(page.next_before || 0); setEditHistoryComplete(page.complete); void resolveProfiles(page.items.map(item => item.user_id), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, historySection, library.id, mode, selectedID]);

  useEffect(() => {
    if ((mode !== "read" && mode !== "outline" && mode !== "comments" && mode !== "activity") || !selectedID) return;
    const abort = new AbortController();
    void client.listPageComments(library.id, selectedID, "", 50, mode === "comments" && unresolvedOnly, abort.signal).then(page => { if (!abort.signal.aborted) { setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete); void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...(item.mentioned_user_ids || [])]), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID, unresolvedOnly]);

  useEffect(() => {
    if (mode !== "comments" || !activeCommentThreadID) return;
    const frame = window.requestAnimationFrame(() => commentThreadRefs.current[activeCommentThreadID]?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeCommentThreadID, mode]);

  useEffect(() => {
    if (mode !== "suggestions" || !selectedID) return;
    const abort = new AbortController();
    void Promise.all([client.getPage(library.id, selectedID, true, abort.signal), client.listPageSuggestions(library.id, selectedID, abort.signal)]).then(([pageView, page]) => {
      if (abort.signal.aborted) return;
      setView(pageView); viewRef.current = pageView; setTitle(pageView.draft?.title || pageView.page.title); setBody(pageView.draft?.body.content || "");
      setSuggestions(page.items);
      void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.decided_by_user_id || "", ...(item.mentioned_user_ids || [])]), abort.signal);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID]);

  useEffect(() => {
    if (mode !== "references" || !selectedID) return;
    const abort = new AbortController();
    setReferencesLoading(true);
    void Promise.all([
      client.listPageReferences(library.id, selectedID, "outgoing", "", 20, abort.signal),
      client.listPageReferences(library.id, selectedID, "incoming", "", 20, abort.signal),
    ]).then(([outgoing, incoming]) => {
      if (abort.signal.aborted) return;
      setOutgoingReferences(outgoing.items); setOutgoingReferenceAfter(outgoing.next_after || ""); setOutgoingReferencesComplete(outgoing.complete);
      setIncomingReferences(incoming.items); setIncomingReferenceAfter(incoming.next_after || ""); setIncomingReferencesComplete(incoming.complete);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setReferencesLoading(false); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID]);

  useEffect(() => {
    if (mode !== "relationships" || !selectedID) return;
    const abort = new AbortController();
    void loadRelationshipGraph(abort.signal);
    return () => abort.abort();
  }, [client, library.id, mode, selectedID]);

  useEffect(() => {
    if (mode !== "relationships" || !selectedID) { setRelationshipResults([]); setRelationshipSearchLoading(false); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => {
      setRelationshipSearchLoading(true);
      void client.searchPageIdentities(library.id, relationshipQuery.trim(), 30, abort.signal).then(page => {
        if (!abort.signal.aborted) setRelationshipResults(page.items.filter(item => item.page_id !== selectedID));
      }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }).finally(() => { if (!abort.signal.aborted) setRelationshipSearchLoading(false); });
    }, 180);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, mode, relationshipQuery, selectedID]);

  useEffect(() => {
    if (!selectedID) { setAttachments([]); return; }
    const abort = new AbortController();
    void client.listPageAttachments(library.id, selectedID, abort.signal).then(page => { if (!abort.signal.aborted) setAttachments(page.items); }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, selectedID]);

  useEffect(() => {
    tasksRef.current = [];
    setTasks([]);
    setTasksReady(false);
    taskCreatesRef.current.clear();
    if (!selectedID) return;
    const abort = new AbortController();
    void client.listPageTasks(library.id, selectedID, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      tasksRef.current = page.items;
      setTasks(page.items);
      setTasksReady(true);
      void resolveProfiles(page.items.flatMap(item => item.assignee_user_ids), abort.signal);
    }).catch(failure => {
      if (!abort.signal.aborted) { setTasksReady(true); setError(formatError(failure)); }
    });
    return () => abort.abort();
  }, [client, formatError, library.id, selectedID]);

  useEffect(() => {
    pollsRef.current = [];
    setPolls([]);
    setPollsReady(false);
    pollCreatesRef.current.clear();
    if (!selectedID) return;
    const abort = new AbortController();
    void client.listPagePolls(library.id, selectedID, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      pollsRef.current = page.items;
      setPolls(page.items);
      setPollsReady(true);
    }).catch(failure => {
      if (!abort.signal.aborted) { setPollsReady(true); setError(formatError(failure)); }
    });
    return () => abort.abort();
  }, [client, formatError, library.id, selectedID]);

  useEffect(() => {
    if (mode !== "metadata" && mode !== "governance") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchLibraryMembers(library.id, metadataMemberQuery.trim(), "", 100, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setMetadataMembers(page.items);
      setMemberProfiles(current => ({ ...current, ...Object.fromEntries(page.items.map(item => [item.user_id, item])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, metadataMemberQuery, mode]);

  useEffect(() => {
    if (mode !== "governance" || library.role !== "manager" || !selectedID) return;
    void loadGovernanceAudit(true);
  }, [library.id, library.role, mode, selectedID]);

  useEffect(() => {
    if (mode !== "access" || library.role !== "manager") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchPrincipals(accessQuery.trim(), "", 20, abort.signal).then(page => {
      if (!abort.signal.aborted) setAccessPrincipals(page.items.filter(item => item.status === "active"));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [accessQuery, client, formatError, library.role, mode]);

  useEffect(() => {
    if (mode !== "access" || library.role !== "manager" || !selectedID || !accessUserID || accessAction === "knowledge.page_shares.read" && !accessShareID.trim()) { setAccessExplanation(null); return; }
    const abort = new AbortController();
    void client.explainAccess(library.id, { user_id: accessUserID, page_id: selectedID, action: accessAction, share_id: accessAction === "knowledge.page_shares.read" ? accessShareID.trim() : undefined }, abort.signal).then(value => {
      if (!abort.signal.aborted) setAccessExplanation(value);
    }).catch(failure => { if (!abort.signal.aborted) { setAccessExplanation(null); setError(formatError(failure)); } });
    return () => abort.abort();
  }, [accessAction, accessShareID, accessUserID, client, formatError, library.id, library.role, mode, selectedID]);

  useEffect(() => {
    if (mode !== "permissions" || library.role !== "manager" || !selectedID || !client.getPageAccess) return;
    const abort = new AbortController();
    void client.getPageAccess(library.id, selectedID, abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setPageAccess(value); setPermissionMode(value.mode); setPermissionGrants(value.grants);
      void resolveProfiles(value.grants.filter(grant => grant.subject.type === "user").map(grant => grant.subject.id), abort.signal);
      void resolveOrganizationProfiles(value.grants.filter(grant => grant.subject.type === "organization").map(grant => grant.subject.id), abort.signal);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, library.role, mode, selectedID]);

  useEffect(() => {
    if (mode !== "permissions" || library.role !== "manager" || permissionMode !== "restricted" || permissionSubjectType !== "user") { setPermissionPrincipals([]); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchLibraryMembers(library.id, permissionQuery.trim(), "", 50, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setPermissionPrincipals(page.items);
      setMemberProfiles(current => ({ ...current, ...Object.fromEntries(page.items.map(item => [item.user_id, item])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, library.role, mode, permissionMode, permissionQuery, permissionSubjectType]);

  async function toggle(page: KnowledgePage) {
    if (!hasExpandableChildren(page)) return;
    const next = new Set(expanded);
    if (next.has(page.id)) next.delete(page.id); else { next.add(page.id); if (!children[page.id]) await loadChildren(page.id); }
    setExpanded(next);
  }

  function hasExpandableChildren(page: KnowledgePage) {
    const loadedChildren = children[page.id];
    if (loadedChildren) return loadedChildren.length > 0 || childrenComplete[page.id] === false;
    return page.has_children;
  }

  function rows(parent = "", depth = 0): { page?: KnowledgePage; parent: string; depth: number; loadMore?: boolean }[] {
    const query = localFilter.trim().toLocaleLowerCase();
    const visible: { page?: KnowledgePage; parent: string; depth: number; loadMore?: boolean }[] = [];
    for (const page of children[parent] || []) {
      const descendants = rows(page.id, depth + 1);
      if (query) {
        if (page.title.toLocaleLowerCase().includes(query) || descendants.length > 0) visible.push({ page, parent, depth }, ...descendants);
      } else {
        visible.push({ page, parent, depth });
        if (expanded.has(page.id)) visible.push(...descendants);
      }
    }
    if (!query && children[parent] && childrenComplete[parent] === false) visible.push({ parent, depth, loadMore: true });
    return visible;
  }

  async function createPage(contentType: KnowledgePageContentType) {
    if (!canWrite) return;
    try {
      const parentPageID = selectedID;
      const meta = pageTypeMeta[contentType];
      const value = await client.createPage(library.id, { client_id: crypto.randomUUID(), parent_page_id: parentPageID || undefined, title: meta.title, content_type: contentType }, AbortSignal.timeout(30_000));
      if (parentPageID) setExpanded(current => new Set(current).add(parentPageID));
      setNotice(ktf("knowledge.auto.a40ec61d5d360271", { value0: meta.label })); editAfterSelectRef.current = value.page.id;
      await loadChildren(value.page.parent_page_id || ""); setSelectedID(value.page.id);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function importFilePage(file: File) {
    if (!canWrite || importingFilePage) return;
    setError("");
    if (!library.documents_configured) { setError(kt("knowledge.auto.00e188a5c70a0fcf")); return; }
    if (!file.size || file.size > documentUploadMaxBytes(library)) { setError(kt("knowledge.auto.d97de7b6f295656b")); return; }
    if (!knowledgeDocumentSupports(library, file.name)) { setError(kt("knowledge.auto.4701a51f2d507975")); return; }
    const parentPageID = selectedID;
    const signal = AbortSignal.timeout(2 * 60 * 60 * 1000);
    setImportingFilePage(true);
    try {
      const digest = await sha256(file, signal);
      const document = await client.uploadDocument({ libraryID: library.id, file, clientID: crypto.randomUUID(), sha256: digest, signal });
      const created = await client.createPage(library.id, {
        client_id: crypto.randomUUID(),
        parent_page_id: parentPageID || undefined,
        title: file.name.slice(0, 256),
        content_type: "file",
      }, signal);
      if (!created.draft) throw Error(kt("knowledge.auto.64c9f3c03a091731"));
      await client.setPageAttachment(library.id, created.page.id, document.id, {
        client_id: crypto.randomUUID(),
        title: file.name,
        rank: `${Date.now()}:${document.id}`,
      }, signal);
      const content = filePageContent(document.id, file.name);
      const saved = await client.savePageDraft(library.id, created.page.id, {
        client_id: crypto.randomUUID(),
        expected_draft_revision: created.draft.draft_revision,
        expected_page_revision: created.page.revision,
        title: file.name.slice(0, 256),
        parent_page_id: created.page.parent_page_id || undefined,
        rank: created.page.rank,
        content_schema_version: pageSchemaVersion,
        content,
        content_sha256: await pageContentSHA256(content),
      }, signal);
      if (parentPageID) setExpanded(current => new Set(current).add(parentPageID));
      editAfterSelectRef.current = saved.page.id;
      await loadChildren(saved.page.parent_page_id || "");
      setSelectedID(saved.page.id);
      setNotice(ktf("knowledge.auto.c5842dbd8976235f", { value0: file.name }));
    } catch (failure) { setError(formatError(failure)); }
    finally { setImportingFilePage(false); }
  }

  async function convertCurrentPage(targetType: "document" | "mind_note", nextTitle: string, nextBody: string) {
    const source = viewRef.current;
    if (!canWrite || !source?.draft || (source.page.content_type !== "document" && source.page.content_type !== "mind_note")) return;
    setError("");
    const parentPageID = source.page.parent_page_id || "";
    try {
      const created = await client.createPage(library.id, {
        client_id: crypto.randomUUID(),
        parent_page_id: parentPageID || undefined,
        title: nextTitle.trim().slice(0, 256) || pageTypeMeta[targetType].title,
        content_type: targetType,
      }, AbortSignal.timeout(30_000));
      if (!created.draft) throw Error(kt("knowledge.auto.6cf6c01cebc64793"));
      const saved = await client.savePageDraft(library.id, created.page.id, {
        client_id: crypto.randomUUID(),
        expected_draft_revision: created.draft.draft_revision,
        expected_page_revision: created.page.revision,
        title: created.draft.title,
        parent_page_id: created.page.parent_page_id || undefined,
        rank: created.page.rank,
        content_schema_version: pageSchemaVersion,
        content: nextBody,
        content_sha256: await pageContentSHA256(nextBody),
      }, AbortSignal.timeout(30_000));
      await loadChildren(parentPageID);
      editAfterSelectRef.current = saved.page.id;
      setSelectedID(saved.page.id);
      setNotice(ktf("knowledge.auto.7c7afb9a0e3d1262", { value0: source.page.title, value1: pageTypeMeta[targetType].label }));
    } catch (failure) { setError(formatError(failure)); throw failure; }
  }

  async function loadTemplates(signal = AbortSignal.timeout(30_000)) {
    if (!client.listPageTemplates) return;
    const result = await client.listPageTemplates(library.id, "", 100, signal);
    setTemplates(result.items);
  }

  async function saveCurrentAsTemplate() {
    if (!selectedID || !client.createPageTemplate || !templateTitle.trim()) return;
    setTemplateBusy("create"); setError("");
    try {
      if (dirty) await saveDraft();
      const created = await client.createPageTemplate(library.id, { client_id: crypto.randomUUID(), source_page_id: selectedID, title: templateTitle.trim(), description: templateDescription.trim() || undefined }, AbortSignal.timeout(30_000));
      await loadTemplates(); setTemplateTitle(ktf("knowledge.auto.c23cf2cfea8afa08", { value0: view?.page.title || kt("knowledge.auto.9e3af30a80b7816d") })); setTemplateDescription(""); setNotice(ktf("knowledge.auto.eefdd2d13e73f213", { value0: created.title, value1: created.node_count }));
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function updateTemplateFromCurrent(template: KnowledgePageTemplate) {
    if (!selectedID || !client.updatePageTemplate) return;
    setTemplateBusy(`update:${template.id}`); setError("");
    try {
      if (dirty) await saveDraft();
      const updated = await client.updatePageTemplate(library.id, template.id, { client_id: crypto.randomUUID(), expected_revision: template.revision, source_page_id: selectedID, title: template.title, description: template.description }, AbortSignal.timeout(30_000));
      await loadTemplates(); setNotice(ktf("knowledge.auto.f166dbee983f2377", { value0: updated.title, value1: updated.latest_version }));
      if (templateVersionOpen === template.id) await loadTemplateVersions(template.id, true);
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function loadTemplateVersions(templateID: string, force = false) {
    if (!client.listPageTemplateVersions) return;
    if (!force && templateVersionOpen === templateID) { setTemplateVersionOpen(""); return; }
    setTemplateVersionOpen(templateID); setTemplateBusy(`versions:${templateID}`);
    try {
      const result = await client.listPageTemplateVersions(library.id, templateID, 0, 100, AbortSignal.timeout(30_000));
      setTemplateVersions(current => ({ ...current, [templateID]: result.items }));
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function instantiateTemplate(template: KnowledgePageTemplate, version = template.latest_version) {
    if (!client.instantiatePageTemplate) return;
    const parentPageID = selectedID;
    setTemplateBusy(`instantiate:${template.id}:${version}`); setError("");
    try {
      const instance = await client.instantiatePageTemplate(library.id, template.id, { client_id: crypto.randomUUID(), version, parent_page_id: parentPageID || undefined }, AbortSignal.timeout(30_000));
      if (parentPageID) setExpanded(current => new Set(current).add(parentPageID));
      await loadChildren(parentPageID); editAfterSelectRef.current = instance.root.page.id; setSelectedID(instance.root.page.id); setTemplateDialogOpen(false);
      setNotice(ktf("knowledge.auto.2e6aa0cf50bf8c6d", { value0: template.title, value1: version, value2: instance.created_page_ids.length }));
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  function saveDraft() {
    const current = viewRef.current;
    if (!current?.draft || !canWrite) return saveQueue.current;
    const snapshot = { ...editRef.current };
    setSaveState("saving"); setSaveConflict(null); setError("");
    saveQueue.current = saveQueue.current.then(async () => {
      const latest = viewRef.current;
      if (!latest?.draft) return;
      const applyNativeOperations = client.applyPageNativeOperations;
      const nativeOperations = applyNativeOperations && latest.draft.body.content !== snapshot.body
        ? await nativePageOperations(latest.page.content_type, latest.draft.body.content, snapshot.body)
        : undefined;
      if (nativeOperations && applyNativeOperations) {
        const pending = pendingNativeSaveRef.current || {
          clientID: crypto.randomUUID(), titleClientID: crypto.randomUUID(), pageID: latest.page.id, baseDraftRevision: latest.draft.draft_revision,
          operations: nativeOperations, title: snapshot.title, body: snapshot.body,
        };
        pendingNativeSaveRef.current = pending;
        let saved = latest;
        if (pending.operations.length > 0) {
          const applied = await applyNativeOperations(library.id, pending.pageID, {
            client_id: pending.clientID, base_draft_revision: pending.baseDraftRevision, operations: pending.operations,
          }, AbortSignal.timeout(30_000));
          saved = applied.view;
          if (saved.draft && saved.page.content_type === "multidimensional_table" && client.executeGridAutomation) {
            const executions = gridAutomationExecutions(saved.draft.body.content, pending.operations, saved.draft.draft_revision);
            for (const execution of executions) {
              execution.expected_draft_revision = saved.draft?.draft_revision || execution.expected_draft_revision;
              const automated = await client.executeGridAutomation(library.id, pending.pageID, execution, AbortSignal.timeout(30_000));
              saved = automated.view;
            }
          }
        }
        if (saved.draft && pending.title.trim() !== saved.draft.title) {
          saved = await client.savePageDraft(library.id, pending.pageID, {
            client_id: pending.titleClientID, expected_draft_revision: saved.draft.draft_revision, expected_page_revision: saved.page.revision,
            title: pending.title.trim(), parent_page_id: saved.draft.parent_page_id, rank: saved.draft.rank,
            content_schema_version: pageSchemaVersion, content: saved.draft.body.content, content_sha256: saved.draft.body.content_sha256,
          }, AbortSignal.timeout(30_000));
        }
        pendingNativeSaveRef.current = null;
        const unchanged = editRef.current.title === pending.title && editRef.current.body === pending.body;
        if (unchanged && saved.draft && saved.draft.body.content !== pending.body) {
          editRef.current = { title: saved.draft.title, body: saved.draft.body.content };
          setTitle(saved.draft.title); setBody(saved.draft.body.content);
        }
        viewRef.current = saved; setView(saved);
        setDirty(!unchanged); setSaveState(unchanged ? "saved" : "idle");
        return;
      }
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
        const published = await collaboration.publish();
        viewRef.current = published; setView(published); setDirty(false); setPublishState("idle"); setMode("read"); setNotice(kt("knowledge.auto.c1eb6af8f7036aaa")); await loadChildren(published.page.parent_page_id || "");
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
      };
      pendingPublishRef.current = pending;
      const published = await client.publishPage(library.id, pending.pageID, { client_id: pending.clientID, expected_page_revision: pending.expectedPageRevision, expected_draft_revision: pending.expectedDraftRevision }, AbortSignal.timeout(60_000));
      pendingPublishRef.current = null;
      viewRef.current = published; setView(published); setDirty(false); setPublishState("idle"); setMode("read"); setNotice(kt("knowledge.auto.cfad45f574867486")); await loadChildren(published.page.parent_page_id || "");
    } catch (failure) {
      setPublishState("error");
      if (errorStatus(failure) === 409) { setSaveState("conflict"); setSaveConflict(pageConflict(failure)); }
      setError(formatError(failure));
    }
  }

  async function commitMove(page: KnowledgePage, parentPageID: string, accessImpactToken = "") {
    await client.movePage(library.id, page.id, { client_id: crypto.randomUUID(), expected_revision: page.revision, parent_page_id: parentPageID || undefined, rank: page.rank, access_impact_token: accessImpactToken || undefined }, AbortSignal.timeout(30_000));
    setPendingMove(null); setNotice(kt("knowledge.auto.89b7a68bca5fd617")); await loadChildren(page.parent_page_id || ""); await loadChildren(parentPageID);
  }

  async function move(page: KnowledgePage, parentPageID: string) {
    if (!canWrite || page.id === parentPageID) return;
    try {
      if (library.role === "manager" && client.previewPageMove) {
        const impact = await client.previewPageMove(library.id, page.id, { parent_page_id: parentPageID || undefined, rank: page.rank }, AbortSignal.timeout(30_000));
        if (impact.requires_confirm) {
          setPendingMove({ page, parentPageID, impact });
          void resolveProfiles(impact.changed_subjects.filter(subject => subject.type === "user").map(subject => subject.id), AbortSignal.timeout(30_000));
          void resolveOrganizationProfiles(impact.changed_subjects.filter(subject => subject.type === "organization").map(subject => subject.id), AbortSignal.timeout(30_000));
          return;
        }
        await commitMove(page, parentPageID, impact.token);
        return;
      }
      await commitMove(page, parentPageID);
    } catch (failure) { setError(formatError(failure)); }
  }

  function addPermissionGrant(principal: KnowledgePrincipal) {
    const grant: KnowledgePageAccessGrant = { subject: { type: "user", id: principal.user_id }, role: permissionRole, scope: permissionScope };
    setPermissionGrants(current => [...current.filter(item => item.subject.type !== grant.subject.type || item.subject.id !== grant.subject.id || item.scope !== grant.scope), grant]);
    setMemberProfiles(current => ({ ...current, [principal.user_id]: principal }));
    setPermissionQuery(""); setPermissionPrincipals([]);
  }

  async function addOrganizationPermissionGrant() {
    const organizationID = permissionQuery.trim();
    if (!organizationID) return;
    setPermissionSaving(true); setError("");
    try {
      const [principal] = await client.resolveOrganizationPrincipals([organizationID], AbortSignal.timeout(30_000));
      if (!principal || principal.organization_id !== organizationID || principal.status !== "active") throw Error(kt("knowledge.auto.2cfc9e53262dc568"));
      const grant: KnowledgePageAccessGrant = { subject: { type: "organization", id: organizationID }, role: permissionRole, scope: permissionScope };
      setOrganizationProfiles(current => ({ ...current, [organizationID]: principal }));
      setPermissionGrants(current => [...current.filter(item => item.subject.type !== "organization" || item.subject.id !== organizationID || item.scope !== grant.scope), grant]);
      setPermissionQuery("");
    } catch (failure) { setError(formatError(failure)); }
    finally { setPermissionSaving(false); }
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
      setNotice(value.projection_status === "ready" ? kt("knowledge.auto.ad9efe7a0288ef84") : kt("knowledge.auto.b79f859123e0bbc6"));
      if (viewRef.current) {
        const next = { ...viewRef.current, page: { ...viewRef.current.page, access_mode: value.mode, access_revision: value.revision, access_status: value.projection_status } };
        viewRef.current = next; setView(next);
      }
    } catch (failure) { setError(formatError(failure)); }
    finally { setPermissionSaving(false); }
  }

  async function reorderSiblingAt(page: KnowledgePage, target: KnowledgePage, placement: "before" | "after") {
    const parent = target.parent_page_id || "";
    const siblings = children[parent] || [];
    if (!canWrite || localFilter || (page.parent_page_id || "") !== parent || childrenComplete[parent] !== true) return;
    const withoutPage = siblings.filter(item => item.id !== page.id);
    const targetIndex = withoutPage.findIndex(item => item.id === target.id);
    if (targetIndex < 0) return;
    withoutPage.splice(targetIndex + (placement === "after" ? 1 : 0), 0, page);
    if (withoutPage.every((item, index) => item.id === siblings[index]?.id)) return;
    try {
      const result = await client.reorderPages(library.id, { client_id: crypto.randomUUID(), parent_page_id: parent || undefined, items: withoutPage.map(item => ({ page_id: item.id, expected_revision: item.revision })) }, AbortSignal.timeout(30_000));
      setChildren(current => ({ ...current, [parent]: result.items }));
      setNotice(kt("knowledge.auto.a5a484df688ec5ca"));
    } catch (failure) { setError(formatError(failure)); }
  }

  function dragPlacement(event: React.DragEvent<HTMLDivElement>, parent: string): TreeDropTarget["placement"] {
    const canReorder = !localFilter && (dragged?.parent_page_id || "") === parent && childrenComplete[parent] === true;
    if (!canReorder) return "inside";
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = bounds.height > 0 ? (event.clientY - bounds.top) / bounds.height : 0.5;
    return ratio < 0.3 ? "before" : ratio > 0.7 ? "after" : "inside";
  }

  async function dropTreePage(page: KnowledgePage, target: KnowledgePage, placement: TreeDropTarget["placement"]) {
    if (page.id === target.id) return;
    if (placement === "inside") await move(page, target.id);
    else await reorderSiblingAt(page, target, placement);
  }

  async function copyCurrentPage() {
    const current = viewRef.current;
    if (!current || !canWrite) return;
    try {
      const copied = await client.copyPage(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_page_id: current.page.parent_page_id, title: ktf("knowledge.auto.6a5e2aa1a875c415", { value0: current.page.title }) }, AbortSignal.timeout(30_000));
      await loadChildren(copied.page.parent_page_id || "");
      setSelectedID(copied.page.id); setNotice(kt("knowledge.auto.579185a22a406bd2"));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function authorizeContentAction(operation: "copy" | "print" | "export" | "duplicate") {
    const current = viewRef.current;
    if (!current || !client.authorizePageContentOperation) throw Error(kt("knowledge.auto.1f9f5ef234296e28"));
    await client.authorizePageContentOperation(library.id, current.page.id, operation, AbortSignal.timeout(30_000));
  }

  async function addDocumentSelection(selection: KnowledgeDocumentSelectionSnapshot) {
    const current = viewRef.current;
    if (!hostIntegration?.capabilities.addSelectionToConversation || !current || current.page.content_type !== "document" || addSelectionBusy || typeof window === "undefined") return;
    const draftSource = mode === "edit" || mode === "suggestions" || !current.published;
    const source = draftSource ? current.draft : current.published;
    if (!source) return;
    setAddSelectionBusy(true); setError("");
    try {
      let title = source.title || current.page.title;
      let draftRevision = draftSource ? current.draft?.draft_revision || null : null;
      let contentSha256 = source.body.content_sha256;
      if (draftSource && mode === "edit" && collaborationRef.current.available) {
        const confirmed = await collaborationRef.current.flush();
        title = confirmed.title;
        draftRevision = confirmed.draftRevision;
        contentSha256 = await pageContentSHA256(confirmed.content);
      }
      const reference = createKnowledgeSelectionReference({
        libraryId: library.id,
        libraryKind: library.kind,
        pageId: current.page.id,
        title,
        contentType: "document",
        source: draftSource ? "draft" : "published",
        pageRevision: current.page.revision,
        draftRevision,
        contentSha256,
        blockIds: selection.blockIds,
        quote: selection.quote,
        deepLink: createKnowledgeBlockLink(window.location.href, {
          libraryID: library.id,
          libraryKind: library.kind,
          pageID: current.page.id,
          mode: draftSource && mode === "edit" ? "edit" : "read",
        }, selection.blockIds[0]),
      });
      if (!reference) throw Error(kt("knowledge.host.selection_failed"));
      const result = await hostIntegration.addSelection(reference);
      if (!result.ok) { setError(result.message || kt("knowledge.host.selection_failed")); return; }
      setNotice(result.message || kt("knowledge.host.selection_added"));
    } catch (failure) {
      setError(formatError(failure) || kt("knowledge.host.selection_failed"));
    } finally {
      setAddSelectionBusy(false);
    }
  }

  async function controlledPageCopy(event: React.ClipboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select")) return;
    const text = window.getSelection()?.toString() || "";
    if (!text) return;
    event.preventDefault();
    try {
      await authorizeContentAction("copy");
      await navigator.clipboard.writeText(text);
      setNotice(kt("knowledge.auto.3fbf9715dc8f2613"));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function copyDraftAfterConflict() {
    try {
      await authorizeContentAction("copy");
      await navigator.clipboard.writeText(body);
      setNotice(kt("knowledge.auto.6bbde7ada7680141"));
    } catch (failure) { setError(formatError(failure)); }
  }

  useEffect(() => {
    const beforePrint = () => {
      if (Date.now() <= printAuthorizationRef.current) return;
      document.body.dataset.knowledgePrintBlockedMessage = kt("knowledge.auto.bce8375ca26f8d4c");
      document.body.classList.add("knowledge-print-blocked");
      setError(kt("knowledge.auto.bce8375ca26f8d4c"));
    };
    const afterPrint = () => {
      printAuthorizationRef.current = 0;
      document.body.classList.remove("knowledge-print-blocked");
      delete document.body.dataset.knowledgePrintBlockedMessage;
    };
    const keydown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== "p" || !viewRef.current) return;
      event.preventDefault();
      void authorizeContentAction("print").then(() => {
        printAuthorizationRef.current = Date.now() + 5_000;
        window.print();
      }, failure => setError(formatError(failure)));
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    window.addEventListener("keydown", keydown, true);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      window.removeEventListener("keydown", keydown, true);
      document.body.classList.remove("knowledge-print-blocked");
      delete document.body.dataset.knowledgePrintBlockedMessage;
    };
  }, [client, formatError, library.id]);

  async function archive(page: KnowledgePage) {
    const previousMode = mode;
    try {
      if (page.state !== "archived" && previousMode === "edit") {
        if (collaboration.available) await collaboration.flush();
        else if (dirty) await saveDraft();
        setMode("read");
      }
      await client.setPageArchived(library.id, page.id, page.state !== "archived", { client_id: crypto.randomUUID(), expected_revision: page.revision }, AbortSignal.timeout(30_000));
      viewRef.current = null; setView(null); setSelectedID(""); setError("");
      await loadChildren(page.parent_page_id || "");
      if (navigationSection !== "all") await refreshCollection(navigationSection);
      setNotice(page.state === "archived" ? kt("knowledge.auto.288d977cf9c4e6d8") : kt("knowledge.auto.391013c0674deb72"));
    } catch (failure) {
      if (page.state !== "archived" && previousMode === "edit") setMode("edit");
      setError(formatError(failure));
    }
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

  async function loadMoreEditHistory() {
    if (!selectedID || editHistoryComplete || editHistoryBefore < 1) return;
    try {
      const page = await client.listPageEditHistory(library.id, selectedID, editHistoryBefore, 50, AbortSignal.timeout(30_000));
      setEditHistory(current => [...current, ...page.items.filter(item => !current.some(saved => saved.draft_revision === item.draft_revision))]);
      setEditHistoryBefore(page.next_before || 0); setEditHistoryComplete(page.complete);
      void resolveProfiles(page.items.map(item => item.user_id), AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function loadMoreComments() {
    if (!selectedID || commentsComplete || !commentAfter) return;
    try {
      const page = await client.listPageComments(library.id, selectedID, commentAfter, 50, mode === "comments" && unresolvedOnly, AbortSignal.timeout(30_000));
      setComments(current => [...current, ...page.items.filter(item => !current.some(saved => saved.id === item.id))]);
      setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete);
      void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...(item.mentioned_user_ids || [])]), AbortSignal.timeout(30_000));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function loadMoreReferences(direction: "outgoing" | "incoming") {
    if (!selectedID) return;
    const complete = direction === "outgoing" ? outgoingReferencesComplete : incomingReferencesComplete;
    const after = direction === "outgoing" ? outgoingReferenceAfter : incomingReferenceAfter;
    if (complete || !after) return;
    try {
      setReferencesLoading(true);
      const page = await client.listPageReferences(library.id, selectedID, direction, after, 20, AbortSignal.timeout(30_000));
      const update = (current: KnowledgePageReferenceLink[]) => [...current, ...page.items.filter(item => !current.some(saved => saved.source_page_id === item.source_page_id && saved.block_id === item.block_id))];
      if (direction === "outgoing") {
        setOutgoingReferences(update); setOutgoingReferenceAfter(page.next_after || ""); setOutgoingReferencesComplete(page.complete);
      } else {
        setIncomingReferences(update); setIncomingReferenceAfter(page.next_after || ""); setIncomingReferencesComplete(page.complete);
      }
    } catch (failure) { setError(formatError(failure)); }
    finally { setReferencesLoading(false); }
  }

  async function reloadSuggestions(pageID = selectedID) {
    if (!pageID) return;
    const page = await client.listPageSuggestions(library.id, pageID, AbortSignal.timeout(30_000));
    setSuggestions(page.items);
    void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.decided_by_user_id || "", ...(item.mentioned_user_ids || [])]), AbortSignal.timeout(30_000));
  }

  async function createSuggestion() {
    const current = viewRef.current;
    if (!current?.draft || !commentAnchor || suggestionKind === "insert" && !suggestionText.trim()) return;
    try {
      setSuggestionBusy("create"); setError("");
      await client.createPageSuggestion(library.id, current.page.id, {
        client_id: crypto.randomUUID(), source: "knowledge_ui", kind: suggestionKind, base_draft_revision: current.draft.draft_revision,
        anchor: { node_id: commentAnchor.nodeID, quote: commentAnchor.quote }, proposed_text: suggestionKind === "insert" ? suggestionText.trim() : undefined,
        comment: suggestionKind === "delete" ? suggestionComment.trim() || undefined : undefined, mentioned_user_ids: suggestionMentionedUserIDs,
      }, AbortSignal.timeout(30_000));
      setSuggestionText(""); setSuggestionComment(""); setSuggestionMentionedUserIDs([]); setCommentAnchor(null); setNotice(kt("knowledge.auto.5e3035e651d4631f"));
      await reloadSuggestions(current.page.id);
    } catch (failure) { setError(formatError(failure)); }
    finally { setSuggestionBusy(""); }
  }

  async function decideSuggestion(suggestion: KnowledgePageSuggestion, decision: "accept" | "reject" | "withdraw") {
    const current = viewRef.current;
    if (!current?.draft) return;
    try {
      setSuggestionBusy(suggestion.id); setError("");
      await client.decidePageSuggestion(library.id, current.page.id, suggestion.id, {
        client_id: crypto.randomUUID(), source: "knowledge_ui", expected_revision: suggestion.revision, expected_draft_revision: current.draft.draft_revision, decision,
      }, AbortSignal.timeout(30_000));
      const refreshed = await client.getPage(library.id, current.page.id, true, AbortSignal.timeout(30_000));
      setView(refreshed); viewRef.current = refreshed; setTitle(refreshed.draft?.title || refreshed.page.title); setBody(refreshed.draft?.body.content || "");
      await reloadSuggestions(current.page.id);
      setNotice(decision === "accept" ? kt("knowledge.auto.1c0b2ea349a66247") : decision === "reject" ? kt("knowledge.auto.0dffeb7231288540") : kt("knowledge.auto.52dd182902559cae"));
    } catch (failure) { setError(formatError(failure)); }
    finally { setSuggestionBusy(""); }
  }

  async function rollback(version: number) {
    const current = viewRef.current;
    if (!current?.draft) return;
    try {
      setRollbackBusy(true); setError("");
      const restored = await client.restorePageVersion(library.id, current.page.id, version, { client_id: crypto.randomUUID(), expected_page_revision: current.page.revision, expected_draft_revision: current.draft.draft_revision }, AbortSignal.timeout(30_000));
      viewRef.current = restored; setView(restored); setTitle(restored.draft!.title); setBody(restored.draft!.body.content); editRef.current = { title: restored.draft!.title, body: restored.draft!.body.content }; setRollbackVersion(null); setHistoryPreview(null); setDiff(null); setCompare([]); setMode("edit"); setNotice(ktf("knowledge.auto.2b3b7a42b36ae5bd", { value0: version }));
    } catch (failure) { setError(formatError(failure)); }
    finally { setRollbackBusy(false); }
  }

  async function addComment() {
    const current = viewRef.current; if (!current?.published || !commentBody.trim()) return;
    const parent = replyingTo ? comments.find(comment => comment.id === replyingTo) : undefined;
    const anchor = parent?.anchor.node_id && parent.anchor.quote ? { nodeID: parent.anchor.node_id, quote: parent.anchor.quote } : commentAnchor;
    if (!anchor) { setError(kt("knowledge.auto.6a3b75c8b8d1b362")); return; }
    try {
      await client.createPageComment(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_comment_id: replyingTo || undefined, published_version: parent?.published_version || current.published.version, anchor: { node_id: anchor.nodeID, quote: anchor.quote }, body: commentBody.trim(), mentioned_user_ids: mentionedUserIDs }, AbortSignal.timeout(30_000));
      setCommentBody(""); setMentionedUserIDs([]); setReplyingTo(""); const page = await client.listPageComments(library.id, current.page.id, "", 50, unresolvedOnly, AbortSignal.timeout(30_000)); setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete);
    } catch (failure) { setError(formatError(failure)); }
  }

  function focusComment(comment: KnowledgePageComment) {
    if (comment.anchor.changed || !comment.anchor.node_id) return;
    const rootID = comment.parent_comment_id || comment.id;
    setActiveCommentThreadID(rootID);
    setCommentFocus(current => ({ nodeID: comment.anchor.node_id!, revision: current.revision + 1 }));
    window.requestAnimationFrame(() => commentThreadRefs.current[rootID]?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  function openCommentThread(nodeID: string) {
    const anchored = comments.filter(comment => !comment.deleted && !comment.anchor.changed && comment.anchor.node_id === nodeID);
    const first = anchored.find(comment => !comment.parent_comment_id) || anchored[0];
    if (!first) return;
    const rootID = first.parent_comment_id || first.id;
    setUnresolvedOnly(false);
    setMode("comments");
    setActiveCommentThreadID(rootID);
    setCommentFocus(current => ({ nodeID, revision: current.revision + 1 }));
  }

  function beginReply(comment: KnowledgePageComment) {
    const rootID = comment.parent_comment_id || comment.id;
    setReplyingTo(rootID);
    const root = comments.find(item => item.id === rootID) || comment;
    if (!root.anchor.changed && root.anchor.node_id && root.anchor.quote) {
      setCommentAnchor({ nodeID: root.anchor.node_id, quote: root.anchor.quote });
    }
    setCommentComposerFocusRequest(current => current + 1);
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
      const updated = await client.updatePageComment(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), expected_revision: comment.revision, body: next, mentioned_user_ids: editingCommentMentionedUserIDs }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item)); setEditingCommentID(""); setEditingCommentBody(""); setEditingCommentMentionedUserIDs([]);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function deleteComment(comment: KnowledgePageComment) {
    try {
      const updated = await client.deletePageComment(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), expected_revision: comment.revision }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function toggleCommentReaction(comment: KnowledgePageComment, emoji: string) {
    const current = comment.reactions?.find(reaction => reaction.emoji === emoji);
    try {
      const updated = await client.setPageCommentReaction(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), emoji, active: !current?.reacted }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function assignCommentTask(comment: KnowledgePageComment) {
    if (!comment.anchor.node_id || comment.anchor.changed || !canWrite) return;
    const mentionedUserIDs = comment.mentioned_user_ids || [];
    const proposedAssignees = [...new Set(mentionedUserIDs.length > 0 ? mentionedUserIDs : currentUserID ? [currentUserID] : [])];
    const existing = tasks.find(task => task.source_block_id === comment.anchor.node_id);
    try {
      const updated = existing ? await client.updatePageTask(library.id, comment.page_id, existing.id, {
        client_id: crypto.randomUUID(), expected_revision: existing.revision, title: existing.title, status: existing.status,
        assignee_user_ids: [...new Set([...existing.assignee_user_ids, ...proposedAssignees])], due_at: existing.due_at, reminder_at: existing.reminder_at, priority: existing.priority,
      }, AbortSignal.timeout(30_000)) : await client.createPageTask(library.id, comment.page_id, {
        client_id: crypto.randomUUID(), source_block_id: comment.anchor.node_id,
        title: Array.from(comment.body || comment.anchor.quote || kt("knowledge.auto.793cce1c78d143e3")).slice(0, 480).join(""), assignee_user_ids: proposedAssignees, priority: "none",
      }, AbortSignal.timeout(30_000));
      setTasks(items => [...items.filter(item => item.id !== updated.id), updated]);
      tasksRef.current = [...tasksRef.current.filter(item => item.id !== updated.id), updated];
      setNotice(ktf("knowledge.auto.8eeb9d06d32e56a7", { value0: updated.title, value1: updated.assignee_user_ids.length ? `${kt("knowledge.common.assigned_to")}${updated.assignee_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、")}` : "" }));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function uploadPageAttachment(file: File) {
    const current = viewRef.current;
    if (!current?.draft || !canWrite) throw Error(kt("knowledge.auto.0765e14eee1491cb"));
    if (!library.documents_configured) throw Error(kt("knowledge.auto.00e188a5c70a0fcf"));
    if (!file.size || file.size > documentUploadMaxBytes(library)) throw Error(kt("knowledge.auto.d97de7b6f295656b"));
    if (!knowledgeDocumentSupports(library, file.name)) throw Error(kt("knowledge.auto.4701a51f2d507975"));
    activeAttachmentUploadsRef.current++;
    setAttaching(true);
    const signal = AbortSignal.timeout(2 * 60 * 60 * 1000);
    try {
      const digest = await sha256(file, signal);
      const document = await client.uploadDocument({ libraryID: library.id, file, clientID: crypto.randomUUID(), sha256: digest, signal });
      const attachment = await client.setPageAttachment(library.id, current.page.id, document.id, { client_id: crypto.randomUUID(), title: file.name, rank: `${Date.now()}:${document.id}` }, signal);
      setAttachments(items => [...items.filter(item => item.document_id !== attachment.document_id), attachment]);
      return document;
    } finally {
      activeAttachmentUploadsRef.current--;
      if (activeAttachmentUploadsRef.current === 0) setAttaching(false);
    }
  }

  async function attachFile(file: File) {
    const current = viewRef.current;
    if (!current?.draft || !canWrite || attaching) return;
    setError("");
    try {
      const document = await uploadPageAttachment(file);
      if (file.type.startsWith("image/") && current.page.content_type === "document") {
        const nextBody = appendDocumentImage(editRef.current.body, document.id, file.name);
        editRef.current.body = nextBody; setBody(nextBody); setDirty(true); setSaveState("idle"); setMode("edit");
      }
      setNotice(kt("knowledge.auto.d507ce8fd4ba36fd"));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function uploadEditorFile(file: File) {
    setError("");
    try {
      const document = await uploadPageAttachment(file);
      setNotice(ktf("knowledge.auto.41caa14d581ad0b9", { value0: file.name }));
      return { props: { name: file.name, caption: "", url: `knowledge-document:${document.id}` } };
    } catch (failure) {
      setError(formatError(failure));
      throw failure;
    }
  }

  async function readEditorFile(reference: string) {
    const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(reference);
    if (!match) throw Error(kt("knowledge.auto.6c3635a6e01eeae5"));
    const response = await client.readDocumentContent(library.id, match[1], { signal: AbortSignal.timeout(2 * 60 * 1000) });
    if (!response.ok) throw Error(ktf("knowledge.auto.5c9601bcd7c28856", { value0: response.status }));
    return response.blob();
  }

  async function removeAttachment(attachment: KnowledgePageAttachment) {
    try {
      await client.removePageAttachment(library.id, attachment.page_id, attachment.document_id, { client_id: crypto.randomUUID() }, AbortSignal.timeout(30_000));
      setAttachments(items => items.filter(item => item.document_id !== attachment.document_id));
    } catch (failure) { setError(formatError(failure)); }
  }

  function updateEditor(nextTitle: string, nextBody: string, change?: KnowledgeEditorChange) {
    if (viewRef.current?.page.content_type === "file") {
      const reference = parseFilePageContent(nextBody);
      if (reference) nextBody = filePageContent(reference.document_id, nextTitle.trim() || reference.title);
    }
    setTitle(nextTitle); setBody(nextBody); editRef.current = { title: nextTitle, body: nextBody };
    setDirty(true); setSaveState(collaboration.available ? "saving" : "idle"); setPublishState("idle"); setSaveConflict(null);
    if (collaboration.available) collaboration.edit(nextTitle, nextBody, change);
  }

  async function runAI() {
    if (!selectedID || !client.createAIExecution || !client.getAIExecution || !collaboration.ready || !collaboration.sessionID) return;
    if ((aiOperation === "write" || aiOperation === "answer") && !aiPrompt.trim()) { setAIFailure(kt("knowledge.auto.641b57cbe24f3d41")); return; }
    if (aiOperation === "translate" && !aiLanguage.trim()) { setAIFailure(kt("knowledge.auto.8fc622e46adb3951")); return; }
    aiRequestAbortRef.current?.abort();
    const abort = new AbortController();
    aiRequestAbortRef.current = abort;
    setAIBusy(true); setAIFailure(""); setAIExecution(null);
    try {
      if (aiSourceScope === "draft") await collaboration.flush();
      let execution = await client.createAIExecution(library.id, selectedID, {
        client_id: crypto.randomUUID(), operation: aiOperation, prompt: aiPrompt.trim() || undefined,
        language: aiOperation === "translate" ? aiLanguage.trim() : undefined, source_scope: aiSourceScope,
        session_id: aiSourceScope === "draft" ? collaboration.sessionID : undefined,
      }, abort.signal);
      setAIExecution(execution);
      for (let attempt = 0; attempt < 120 && (execution.state === "pending" || execution.state === "running"); attempt++) {
        await new Promise<void>((resolve, reject) => {
          const timer = window.setTimeout(resolve, 500);
          abort.signal.addEventListener("abort", () => { window.clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
        });
        execution = await client.getAIExecution(library.id, selectedID, execution.id, abort.signal);
        setAIExecution(execution);
      }
      if (execution.state === "pending" || execution.state === "running") throw new Error(kt("knowledge.auto.a337f9fba59571bd"));
      if (execution.state === "failed") setAIFailure(ktf("knowledge.auto.6091dda5bf696109", { value0: execution.error_code || "provider_failed" }));
    } catch (failure) {
      if (!abort.signal.aborted) setAIFailure(formatError(failure));
    } finally {
      if (aiRequestAbortRef.current === abort) aiRequestAbortRef.current = null;
      if (!abort.signal.aborted) setAIBusy(false);
    }
  }

  async function confirmAndInsertAI() {
    if (!aiExecution || aiExecution.state !== "completed" || !aiExecution.result || !client.confirmAIExecution || !collaboration.ready || !collaboration.sessionID) return;
    setAIBusy(true); setAIFailure("");
    try {
      await collaboration.flush();
      const confirmed = await client.confirmAIExecution(library.id, selectedID, aiExecution.id, {
        client_id: crypto.randomUUID(), expected_revision: aiExecution.revision, session_id: collaboration.sessionID,
      }, AbortSignal.timeout(30_000));
      setAIExecution(confirmed);
      setAIInsertRequest({ id: `${confirmed.id}:${confirmed.revision}`, markdown: confirmed.result || aiExecution.result });
      setNotice(kt("knowledge.auto.6021a1bb0720c477"));
    } catch (failure) { setAIFailure(formatError(failure)); }
    finally { setAIBusy(false); }
  }

  const treeRows = useMemo(() => rows(), [children, expanded, localFilter]);
  const visibleCollectionItems = useMemo(() => collectionItems.filter(item => !localFilter || item.page.title.toLocaleLowerCase().includes(localFilter.toLocaleLowerCase())), [collectionItems, localFilter]);
  const commentMarkers = useMemo<KnowledgeCommentMarker[]>(() => {
    const grouped = new Map<string, KnowledgeCommentMarker>();
    for (const comment of comments) {
      const nodeID = comment.anchor.node_id;
      if (comment.deleted || comment.anchor.changed || !nodeID) continue;
      const rootID = comment.parent_comment_id || comment.id;
      const current = grouped.get(nodeID) || { nodeID, quote: comment.anchor.quote || kt("knowledge.auto.73012a38cd4eaf64"), count: 0, unresolved: false, active: false };
      current.count += 1;
      current.unresolved ||= !comment.resolved;
      current.active ||= mode === "comments" && rootID === activeCommentThreadID;
      grouped.set(nodeID, current);
    }
    return [...grouped.values()];
  }, [activeCommentThreadID, comments, mode]);
  const showCommentMarkers = view?.page.content_type === "document" && (mode === "read" || mode === "outline" || mode === "comments");
  function collectionItemDetail(item: KnowledgePageCollectionItem) {
    const timestamp = navigationSection === "favorites" ? item.state.favorite_at
      : navigationSection === "subscribed" ? item.state.subscribed_at
      : navigationSection === "recent_views" ? item.state.last_viewed_at
      : navigationSection === "recent_edits" ? item.state.last_edited_at
      : navigationSection === "trash" ? item.page.updated_at : undefined;
    const label = pageTypeMeta[item.page.content_type].label;
    return timestamp && Date.parse(timestamp) > 0 ? `${label} · ${formatKnowledgeDate(timestamp)}` : label;
  }
  const activities = useMemo(() => [
    ...versions.map(version => ({ key: `version-${version.version}`, at: version.published_at, title: ktf("knowledge.auto.10fe5626be032cba", { value0: version.version }), detail: `${memberProfiles[version.published_by_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")} · ${version.body.summary || kt("knowledge.auto.cb105fc6e43c051a")}` })),
    ...comments.map(comment => ({ key: `comment-${comment.id}-${comment.revision}`, at: comment.updated_at, title: comment.deleted ? kt("knowledge.auto.873e05a048796c37") : comment.resolved ? kt("knowledge.auto.e608d46623b14f21") : comment.revision > 1 ? kt("knowledge.auto.6abe2b4a42de02aa") : comment.parent_comment_id ? kt("knowledge.auto.9e9cfa69d7786b6f") : kt("knowledge.auto.30dff53047adefac"), detail: ktf("knowledge.auto.3f96ffa2b403524b", { value0: memberProfiles[comment.author_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63"), value1: comment.published_version }) })),
    ...tasks.map(task => ({ key: `task-${task.id}-${task.revision}`, at: task.updated_at, title: task.status === "done" ? kt("knowledge.auto.02b8d7f732d780bf") : task.status === "canceled" ? kt("knowledge.auto.6998f489a594eb72") : task.revision > 1 ? kt("knowledge.auto.6225b92a34d92a8d") : kt("knowledge.auto.17ec06a09fed2a05"), detail: `${task.title} · ${task.assignee_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、") || kt("knowledge.auto.350c68309b7bfcd8")}` })),
  ].sort((left, right) => right.at.localeCompare(left.at)), [comments, memberProfiles, tasks, versions]);
  const searchMentionMembers = useCallback(async (query: string, signal: AbortSignal) => {
    const page = await client.searchLibraryMembers(library.id, query, "", 100, signal);
    return page.items;
  }, [client, library.id]);
  const rememberMentionMember = useCallback((member: KnowledgePrincipal) => {
    setMemberProfiles(current => ({ ...current, [member.user_id]: member }));
  }, []);
  const collaborators = useMemo(() => {
    const users = new Map<string, { userID: string; sessions: number; cursorBlockID: string; selectionBlockID: string; lastSeenAt: string }>();
    for (const item of activePresence) {
      const current = users.get(item.user_id) || { userID: item.user_id, sessions: 0, cursorBlockID: "", selectionBlockID: "", lastSeenAt: "" };
      current.sessions++;
      if (item.last_seen_at >= current.lastSeenAt) {
        current.cursorBlockID = item.cursor_block_id || "";
        current.selectionBlockID = item.selection_block_id || "";
        current.lastSeenAt = item.last_seen_at;
      }
      users.set(item.user_id, current);
    }
    return [...users.values()].sort((left, right) => left.userID === presenceUserID ? -1 : right.userID === presenceUserID ? 1 : right.lastSeenAt.localeCompare(left.lastSeenAt));
  }, [activePresence, presenceUserID]);
  const content = view?.published?.body.content || "";
  const visibleFileContent = view?.published?.body.content || view?.draft?.body.content || "";
  const outline = useMemo(() => view?.page.content_type === "document" ? documentOutline(content) : [], [content, view?.page.content_type]);
  const editorStats = useMemo(() => documentStats(body), [body]);
  const mentionRuntime = useMemo<KnowledgeMentionRuntime>(() => ({
    currentPageID: selectedID,
    async searchPeople(query, signal) {
      const page = await client.searchLibraryMembers(library.id, query, "", 20, signal);
      return page.items.filter(item => item.status === "active").map(item => ({ userID: item.user_id, displayName: item.display_name, email: item.email }));
    },
    async resolvePerson(userID, signal) {
      const value = (await client.resolvePrincipals([userID], signal)).find(item => item.user_id === userID && item.status === "active");
      return value ? { userID: value.user_id, displayName: value.display_name, email: value.email } : null;
    },
    async searchPages(query, signal) {
      const page = await client.searchPageIdentities(library.id, query.trim(), 20, signal);
      return page.items.map(item => ({
        pageID: item.page_id,
        title: item.title,
        contentType: item.content_type,
        aliases: item.aliases,
        path: item.path.map(path => ({ pageID: path.page_id, title: path.title })),
      }));
    },
    async resolvePage(pageID, signal) {
      if (view?.page.id === pageID) return { pageID, title: title.trim() || view.page.title, contentType: view.page.content_type, aliases: metadata?.aliases || [], path: view.breadcrumbs.map(item => ({ pageID: item.page_id, title: item.title })) };
      try {
        const [resolved, pageMetadata] = await Promise.all([client.getPage(library.id, pageID, canWrite, signal), client.getPageMetadata(library.id, pageID, signal)]);
        const source = resolved.draft || resolved.published;
        return { pageID, title: source?.title || resolved.page.title, contentType: resolved.page.content_type, aliases: pageMetadata.aliases || [], path: resolved.breadcrumbs.map(item => ({ pageID: item.page_id, title: item.title })) };
      } catch {
        return null;
      }
    },
  }), [canWrite, client, library.id, metadata?.aliases, selectedID, title, view]);
  const mentionRuntimeRef = useRef(mentionRuntime);
  mentionRuntimeRef.current = mentionRuntime;
  const taskRuntime = useMemo<KnowledgeTaskRuntime>(() => {
    const replaceTask = (task: KnowledgePageTask) => {
      const next = [...tasksRef.current.filter(item => item.id !== task.id), task].sort((left, right) => left.id.localeCompare(right.id));
      tasksRef.current = next;
      setTasks(next);
      void resolveProfiles(task.assignee_user_ids, AbortSignal.timeout(30_000));
      return task;
    };
    const pageActive = view?.page.state === "active";
    return {
      ready: tasksReady,
      canCreate: tasksReady && canWrite && pageActive && mode === "edit",
      taskForBlock: blockID => tasksRef.current.find(task => task.source_block_id === blockID),
      canManage: () => Boolean(canWrite && pageActive && mode !== "history"),
      canUpdateStatus: task => Boolean(pageActive && mode !== "history" && (canWrite || !currentUserID || task.assignee_user_ids.includes(currentUserID))),
      ensureTask(blockID, taskTitle) {
        const existing = tasksRef.current.find(task => task.source_block_id === blockID);
        if (existing) return Promise.resolve(existing);
        const pending = taskCreatesRef.current.get(blockID);
        if (pending) return pending;
        const request = client.createPageTask(library.id, selectedID, {
          client_id: crypto.randomUUID(), source_block_id: blockID, title: taskTitle.trim() || kt("knowledge.auto.416e65ac1701e085"),
          assignee_user_ids: [], priority: "none",
        }, AbortSignal.timeout(30_000)).then(replaceTask).catch(failure => { setError(formatError(failure)); throw failure; }).finally(() => taskCreatesRef.current.delete(blockID));
        taskCreatesRef.current.set(blockID, request);
        return request;
      },
      async updateTask(task, patch) {
        try {
          return replaceTask(await client.updatePageTask(library.id, selectedID, task.id, {
            client_id: crypto.randomUUID(), expected_revision: task.revision,
            title: patch.title ?? task.title, status: patch.status ?? task.status,
            assignee_user_ids: patch.assignee_user_ids ?? task.assignee_user_ids,
            due_at: Object.hasOwn(patch, "due_at") ? patch.due_at : task.due_at,
            reminder_at: Object.hasOwn(patch, "reminder_at") ? patch.reminder_at : task.reminder_at,
            priority: patch.priority ?? task.priority,
          }, AbortSignal.timeout(30_000)));
        } catch (failure) {
          if (errorStatus(failure) === 409) {
            try {
              const page = await client.listPageTasks(library.id, selectedID, AbortSignal.timeout(30_000));
              tasksRef.current = page.items; setTasks(page.items);
            } catch { /* Keep the original conflict visible. */ }
          }
          setError(formatError(failure));
          throw failure;
        }
      },
      async searchMembers(query, signal) {
        const page = await client.searchLibraryMembers(library.id, query, "", 20, signal);
        const active = page.items.filter(item => item.status === "active");
        setMemberProfiles(current => {
          let changed = false;
          const next = { ...current };
          for (const item of active) {
            const saved = current[item.user_id];
            if (saved?.display_name === item.display_name
              && saved.email === item.email
              && saved.avatar_url === item.avatar_url
              && saved.status === item.status) continue;
            next[item.user_id] = item;
            changed = true;
          }
          return changed ? next : current;
        });
        return active;
      },
      memberName: userID => memberProfilesRef.current[userID]?.display_name || userID,
    };
  }, [canWrite, client, currentUserID, formatError, library.id, mode, selectedID, tasksReady, view?.page.state]);
  const pollRuntime = useMemo<KnowledgePollRuntime>(() => {
    const replacePoll = (poll: KnowledgePagePollView) => {
      const next = [...pollsRef.current.filter(item => item.poll.id !== poll.poll.id), poll].sort((left, right) => left.poll.id.localeCompare(right.poll.id));
      pollsRef.current = next;
      setPolls(next);
      return poll;
    };
    const reload = async () => {
      const page = await client.listPagePolls(library.id, selectedID, AbortSignal.timeout(30_000));
      pollsRef.current = page.items;
      setPolls(page.items);
    };
    const pageActive = view?.page.state === "active";
    return {
      ready: pollsReady,
      canCreate: pollsReady && canWrite && pageActive && mode === "edit",
      pollForBlock: blockID => pollsRef.current.find(item => item.poll.source_block_id === blockID),
      canManage: () => Boolean(canWrite && pageActive && mode !== "history"),
      ensurePoll(blockID, question) {
        const existing = pollsRef.current.find(item => item.poll.source_block_id === blockID);
        if (existing) return Promise.resolve(existing);
        const pending = pollCreatesRef.current.get(blockID);
        if (pending) return pending;
        const request = client.createPagePoll(library.id, selectedID, {
          client_id: crypto.randomUUID(), source_block_id: blockID, question: question.trim() || kt("knowledge.auto.dfa0249f7b131b40"),
          options: [kt("knowledge.auto.254a531756ce6aee"), kt("knowledge.auto.3a384308628d66a3")], multiple: false,
        }, AbortSignal.timeout(30_000)).then(replacePoll).catch(failure => { setError(formatError(failure)); throw failure; }).finally(() => pollCreatesRef.current.delete(blockID));
        pollCreatesRef.current.set(blockID, request);
        return request;
      },
      async updatePoll(poll, patch) {
        try {
          return replacePoll(await client.updatePagePoll(library.id, selectedID, poll.poll.id, {
            client_id: crypto.randomUUID(), expected_revision: poll.poll.revision,
            question: patch.question ?? poll.poll.question,
            options: patch.options ?? poll.poll.options,
            multiple: patch.multiple ?? poll.poll.multiple,
            status: patch.status ?? poll.poll.status,
          }, AbortSignal.timeout(30_000)));
        } catch (failure) {
          if (errorStatus(failure) === 409) try { await reload(); } catch { /* Keep the original conflict visible. */ }
          setError(formatError(failure));
          throw failure;
        }
      },
      async votePoll(poll, optionIDs) {
        try {
          return replacePoll(await client.votePagePoll(library.id, selectedID, poll.poll.id, {
            client_id: crypto.randomUUID(), expected_ballot_revision: poll.ballot_revision, option_ids: optionIDs,
          }, AbortSignal.timeout(30_000)));
        } catch (failure) {
          if (errorStatus(failure) === 409) try { await reload(); } catch { /* Keep the original conflict visible. */ }
          setError(formatError(failure));
          throw failure;
        }
      },
    };
  }, [canWrite, client, formatError, library.id, mode, polls, pollsReady, selectedID, view?.page.state]);
  const canCreateDynamicChild = Boolean(canWrite && mode === "edit" && view?.draft && view.page.content_type === "document" && client.createPageReference);
  const dynamicBlockRuntime = useMemo<KnowledgeDynamicBlockRuntime>(() => ({
    currentPageID: selectedID,
    canCreateChild: canCreateDynamicChild,
    async listChildPages(limit, signal) {
      const page = await client.listPages(library.id, selectedID, "", Math.max(1, Math.min(limit, 50)), false, signal);
      const currentTitle = viewRef.current?.page.title || kt("knowledge.auto.9e3af30a80b7816d");
      return page.items.map(item => ({ pageID: item.id, title: item.title, contentType: item.content_type, aliases: [], path: [{ pageID: selectedID, title: currentTitle }, { pageID: item.id, title: item.title }] }));
    },
    searchPages: (query, signal) => mentionRuntimeRef.current.searchPages(query, signal),
    resolvePage: (pageID, signal) => mentionRuntimeRef.current.resolvePage(pageID, signal),
    async listPageVersions(pageID, signal) {
      return (await client.listPageVersions(library.id, pageID, 0, 100, signal)).items;
    },
    async createChildReference(input) {
      const current = viewRef.current;
      if (!current?.draft || current.page.content_type !== "document" || !client.createPageReference) throw Error(kt("knowledge.auto.1179de60ffddd14e"));
      setError("");
      try {
        let expectedDraftRevision = current.draft.draft_revision;
        let parentContent = input.parentContent;
        const activeCollaboration = collaborationRef.current;
        if (activeCollaboration.available) {
          const confirmed = await activeCollaboration.flush();
          expectedDraftRevision = confirmed.draftRevision;
          parentContent = confirmed.content;
        }
        const result = await client.createPageReference(library.id, current.page.id, {
          client_id: crypto.randomUUID(),
          expected_parent_draft_revision: expectedDraftRevision,
          expected_parent_page_revision: current.page.revision,
          parent_content_schema_version: pageSchemaVersion,
          parent_content: parentContent,
          parent_content_sha256: await pageContentSHA256(parentContent),
          reference_block_id: input.blockID,
          title: input.title,
          content_type: input.contentType,
          display: input.display,
        }, AbortSignal.timeout(30_000));
        if (!result.parent.draft) throw Error(kt("knowledge.auto.aaeaafcf099f34cf"));
        viewRef.current = result.parent;
        setView(result.parent);
        setTitle(result.parent.draft.title);
        setBody(result.parent.draft.body.content);
        editRef.current = { title: result.parent.draft.title, body: result.parent.draft.body.content };
        setDirty(false); setSaveState("saved"); setSaveConflict(null); setPublishState("idle");
        setChildren(currentChildren => Object.fromEntries(Object.entries(currentChildren).map(([parentID, pages]) => [parentID, pages.map(page => page.id === current.page.id ? { ...page, has_children: true } : page)])));
        setExpanded(currentExpanded => new Set(currentExpanded).add(current.page.id));
        await loadChildrenRef.current(current.page.id, AbortSignal.timeout(30_000));
        setEditorEpoch(value => value + 1);
        if (activeCollaboration.available) activeCollaboration.reconnect();
        setNotice(ktf("knowledge.auto.6157e977147dadb7", { value0: pageTypeMeta[input.contentType].label }));
      } catch (failure) {
        setError(formatErrorRef.current(failure));
        throw failure;
      }
    },
    renderReference(reference) {
      return <KnowledgeEmbeddedReference client={client} library={libraryRef.current} currentUserID={currentUserID} canWrite={canWrite} formatError={formatErrorRef.current} reference={reference} onOpen={pageID => { setMode("read"); setSelectedID(pageID); }} />;
    },
    async listPageActivity(limit, signal) {
      const [pageVersions, pageComments, pageTasks] = await Promise.all([
        client.listPageVersions(library.id, selectedID, 0, limit, signal),
        client.listPageComments(library.id, selectedID, "", limit, false, signal),
        client.listPageTasks(library.id, selectedID, signal),
      ]);
      return [
        ...pageVersions.items.map(item => ({ id: `version-${item.version}`, title: ktf("knowledge.auto.10fe5626be032cba", { value0: item.version }), detail: `${item.published_by_user_id} · ${item.body.summary || kt("knowledge.auto.cb105fc6e43c051a")}`, at: item.published_at })),
        ...pageComments.items.map(item => ({ id: `comment-${item.id}-${item.revision}`, title: item.deleted ? kt("knowledge.auto.873e05a048796c37") : item.resolved ? kt("knowledge.auto.e608d46623b14f21") : item.revision > 1 ? kt("knowledge.auto.6abe2b4a42de02aa") : item.parent_comment_id ? kt("knowledge.auto.9e9cfa69d7786b6f") : kt("knowledge.auto.30dff53047adefac"), detail: ktf("knowledge.auto.3f96ffa2b403524b", { value0: item.author_user_id, value1: item.published_version }), at: item.updated_at })),
        ...pageTasks.items.map(item => ({ id: `task-${item.id}-${item.revision}`, title: item.status === "done" ? kt("knowledge.auto.02b8d7f732d780bf") : item.status === "canceled" ? kt("knowledge.auto.6998f489a594eb72") : item.revision > 1 ? kt("knowledge.auto.6225b92a34d92a8d") : kt("knowledge.auto.17ec06a09fed2a05"), detail: `${item.title} · ${item.updated_by_user_id}`, at: item.updated_at })),
      ].sort((left, right) => right.at.localeCompare(left.at)).slice(0, limit);
    },
    resolveApplicationCard: client.resolveApplicationCard ? (input, signal) => client.resolveApplicationCard!(library.id, selectedID, input, signal) : undefined,
    openPage(pageID) {
      setMode("read");
      setSelectedID(pageID);
    },
  }), [canCreateDynamicChild, canWrite, client, currentUserID, library.id, selectedID]);
  const formRuntime = useMemo<KnowledgeFormRuntime | undefined>(() => {
    if (view?.page.content_type !== "form" || !view.published || !client.submitPageForm || !client.listPageFormSubmissions || !client.getPageFormAnalytics || !client.exportPageFormSubmissions) return undefined;
    const definition = parseFormContent(view.published.body.content);
    const roleLevel = { reader: 1, editor: 2, manager: 3 } as const;
    const now = Date.now(), opensAt = definition.settings.opens_at ? Date.parse(definition.settings.opens_at) : 0, closesAt = definition.settings.closes_at ? Date.parse(definition.settings.closes_at) : 0;
    const canSubmit = roleLevel[library.role as keyof typeof roleLevel] >= roleLevel[definition.settings.submission_role] && (!opensAt || now >= opensAt) && (!closesAt || now < closesAt);
    const shareURL = typeof window === "undefined" ? "" : createKnowledgePageLink(window.location.href, { libraryID: library.id, libraryKind: library.kind, pageID: selectedID, mode: "read" });
    return {
      canSubmit,
      canManage: library.role === "manager",
      publishedVersion: view.page.published_version || 0,
      shareURL,
      formatError,
      submit: answers => client.submitPageForm!(library.id, selectedID, { client_id: crypto.randomUUID(), answers }, AbortSignal.timeout(30_000)),
      listResponses: (before, limit) => client.listPageFormSubmissions!(library.id, selectedID, before, limit, AbortSignal.timeout(30_000)),
      analytics: () => client.getPageFormAnalytics!(library.id, selectedID, AbortSignal.timeout(30_000)),
      exportResponses: () => client.exportPageFormSubmissions!(library.id, selectedID, AbortSignal.timeout(30_000)),
    };
  }, [client, formatError, library.id, library.kind, library.role, selectedID, view?.page.content_type, view?.page.published_version, view?.published]);
  const blockLink = useMemo(() => (blockID: string) => createKnowledgeBlockLink(window.location.href, {
    libraryID: library.id,
    libraryKind: library.kind,
    pageID: selectedID,
    mode: "edit",
  }, blockID), [library.id, library.kind, selectedID]);
  const addDocumentSelectionAction = hostIntegration?.capabilities.addSelectionToConversation
    && view?.page.content_type === "document"
    && !disabled
    && (mode !== "edit" || !dirty && saveState !== "saving" && saveState !== "conflict")
    ? addDocumentSelection
    : undefined;
  const linkedSearchLocation = selectedID === initialPageID ? initialSearchLocation : undefined;
  const linkedBlockID = selectedID === initialPageID ? initialBlockID || linkedSearchLocation?.block_id || linkedSearchLocation?.node_id : undefined;
  const highlightedBlockID = commentFocus.nodeID || linkedBlockID;
  const metadataMemberIDs = useMemo(() => [...new Set([
    ...metadataMembers.map(member => member.user_id),
    metadata?.owner_user_id || "",
    ...(metadata?.content_admin_user_ids || []),
    metadata?.last_reviewed_by_user_id || "",
    ...(metadata?.properties.filter(property => property.type === "person").map(property => property.value) || []),
  ].filter(Boolean))], [metadata?.content_admin_user_ids, metadata?.last_reviewed_by_user_id, metadata?.owner_user_id, metadata?.properties, metadataMembers]);
  const canReviewGovernance = !!metadata && canWrite && (library.role === "manager" || metadata.owner_user_id === currentUserID || metadata.content_admin_user_ids.includes(currentUserID));
  const presenceState = collaboration.available ? collaboration.state : nativeAwareness.state;
  const collaborationStateLabel = ({ unavailable: kt("knowledge.auto.690f4751b6a41ec2"), connecting: kt("knowledge.auto.30ad53924d68ce5f"), connected: kt("knowledge.auto.ceb053e7b13f2338"), syncing: kt("knowledge.auto.f31b2271dc1d5ca1"), reconnecting: kt("knowledge.auto.dfba1899c6d4c694"), error: kt("knowledge.auto.dc29714f13ce1fe0") })[presenceState];
  // Editors backed by imperative canvases still need a clean mount when the
  // server returns a new canonical draft revision. React-owned editors reconcile
  // body changes in place; forcing them to remount would discard live selection,
  // the active presentation slide, or the current form designer tab.
  const remountEditorOnDraftRevision = view?.page.content_type !== "document"
    && view?.page.content_type !== "multidimensional_table"
    && view?.page.content_type !== "spreadsheet"
    && view?.page.content_type !== "form"
    && view?.page.content_type !== "presentation"
    && view?.page.content_type !== "mind_note"
    && view?.page.content_type !== "mind_map"
    && view?.page.content_type !== "flowchart";
  const aiAvailable = view?.page.content_type === "document" && canWrite && !!client.createAIExecution && !!client.getAIExecution && !!client.confirmAIExecution;
  const workbenchEditorOpen = Boolean(view && mode === "edit" && workbenchPageTypes.has(view.page.content_type));
  const documentContentScroll = view?.page.content_type === "document" && (mode === "read" || mode === "outline" || mode === "edit" || mode === "suggestions");
  const beginTitleEditing = () => {
    if (!view || !canWrite || view.page.state !== "active") return;
    setMode("edit");
    setTitleEditing(true);
    window.setTimeout(() => titleInputRef.current?.select());
  };
  const changeWorkspaceMode = (nextMode: PageWorkspaceMode) => {
    setMode(nextMode);
    if (["access", "permissions", "shares", "governance"].includes(nextMode)) {
      setPageFindOpen(false);
      setPageFindQuery("");
    }
  };
  return <section className={`knowledge-pages${embedded ? " is-embedded" : ""}`} aria-label={kt("knowledge.auto.fba1208c267ba57c")}>
    {!embedded && <header className="knowledge-section-heading">
      <div className="knowledge-section-identity"><span className="knowledge-section-icon" aria-hidden="true"><BookOpen size={18} /></span><span><small>Knowledge workspace</small><h3>{kt("knowledge.auto.fba1208c267ba57c")}</h3><p>{kt("knowledge.auto.854f0c3ecba55d18")}</p></span></div>
      {view && <span className={`knowledge-index-state is-${view.page.projection_status || "none"}`}><span aria-hidden="true" />{projectionLabel(view.page)}</span>}
    </header>}
    <div className="knowledge-pages-layout">
      <aside className="knowledge-page-tree" onDragOver={event => { if (canWrite) event.preventDefault(); }} onDrop={() => { if (dragged && dragged.parent_page_id) void move(dragged, ""); setDragged(null); setTreeDropTarget(null); }}>
        {scopeTabs}
        {hasTeamLibraryPicker && <div className="knowledge-team-library-picker"><Select aria-label={kt("knowledge.auto.da80e5bf97c037bf")} value={library.id} disabled={disabled} onChange={event => onLibrarySelect?.(event.target.value)}>{teamLibraries!.map(item => <option key={item.id} value={item.id}>{item.name}{item.archived ? kt("knowledge.auto.de0931324baa0cab") : ""}</option>)}</Select><KnowledgeCreateMenu disabled={disabled} canCreatePage={canWrite} onCreatePage={contentType => void createPage(contentType)} onCreateLibrary={onCreateLibrary} onImportFile={file => void importFilePage(file)} importAccept={knowledgeDocumentAccept(library)} importDisabled={!library.documents_configured} importing={importingFilePage} /></div>}
        <div className="knowledge-tree-toolbar">
          <label><Search size={14} aria-hidden="true" /><input aria-label={ktf("knowledge.auto.c5abb64060320597", { value0: pageNavigationLabels[navigationSection] })} value={localFilter} onChange={event => setLocalFilter(event.target.value)} placeholder={ktf("knowledge.auto.c35a69c818e8575e", { value0: pageNavigationLabels[navigationSection] })} /></label>
          {canWrite && !hasTeamLibraryPicker && <KnowledgeCreateMenu disabled={disabled} canCreatePage={canWrite} onCreatePage={contentType => void createPage(contentType)} onImportFile={file => void importFilePage(file)} importAccept={knowledgeDocumentAccept(library)} importDisabled={!library.documents_configured} importing={importingFilePage} />}
          {onManage && <Button aria-label={kt("knowledge.auto.9c8670b57bf9f655")} title={kt("knowledge.auto.9c8670b57bf9f655")} disabled={disabled} onClick={onManage}><Settings size={15} /></Button>}
        </div>
        <nav className="knowledge-page-collections" aria-label={kt("knowledge.auto.297b54190830e020")}>
          <button type="button" aria-pressed={navigationSection === "all"} onClick={() => { setNavigationSection("all"); setLocalFilter(""); }}><BookOpen size={14} /><span>{kt("knowledge.auto.5c55a67935af8f45")}</span></button>
          <button type="button" aria-pressed={navigationSection === "shortcuts"} onClick={() => { setNavigationSection("shortcuts"); setLocalFilter(""); }}><Pin size={14} /><span>{kt("knowledge.auto.d9a8514e981dee1f")}</span></button>
          <button type="button" aria-pressed={navigationSection === "favorites"} onClick={() => { setNavigationSection("favorites"); setLocalFilter(""); }}><Star size={14} /><span>{kt("knowledge.auto.60a53514eb9228a2")}</span></button>
          <details className="knowledge-page-collection-more">
            <summary aria-label={kt("knowledge.auto.43a253390190b084")}><span>{["recent_views", "recent_edits", "subscribed", "trash"].includes(navigationSection) ? pageNavigationLabels[navigationSection] : kt("knowledge.auto.38844b135cf70dfc")}</span><ChevronDown size={12} /></summary>
            <div role="menu" aria-label={kt("knowledge.auto.43a253390190b084")}>
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "recent_views"} onClick={event => { setNavigationSection("recent_views"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Clock3 size={14} /><span>{kt("knowledge.auto.de314b445e076e84")}</span></button>
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "recent_edits"} onClick={event => { setNavigationSection("recent_edits"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Pencil size={14} /><span>{kt("knowledge.auto.c18fdf7c840dbd7d")}</span></button>
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "subscribed"} onClick={event => { setNavigationSection("subscribed"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Bell size={14} /><span>{kt("knowledge.auto.0cbff43b7568dbe0")}</span></button>
              {canWrite && <><hr /><button type="button" role="menuitemradio" aria-checked={navigationSection === "trash"} onClick={event => { setNavigationSection("trash"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Trash2 size={14} /><span>{kt("knowledge.auto.ba35dc23b245e61e")}</span></button></>}
            </div>
          </details>
        </nav>
        <div className="knowledge-tree-label"><span>{pageNavigationLabels[navigationSection]}</span>{navigationSection !== "all" && <button type="button" aria-label={ktf("knowledge.auto.b9da6aab77e5cdbc", { value0: pageNavigationLabels[navigationSection] })} title={kt("knowledge.auto.aee88743413144a2")} disabled={collectionLoading} onClick={() => void refreshCollection(navigationSection)}><RefreshCw className={collectionLoading ? "knowledge-spin" : undefined} size={12} /></button>}</div>
        {navigationSection === "all" ? <div role="tree" aria-label={kt("knowledge.auto.ab9f749d041b2a91")}>{treeRows.map(({ page, parent, depth, loadMore }, index) => loadMore ? <button key={`more-${parent}-${index}`} className="knowledge-tree-more" style={{ marginInlineStart: `${depth * 16 + 24}px` }} onClick={() => void loadChildren(parent, AbortSignal.timeout(30_000), true)}>{kt("knowledge.auto.af90a08fec8ee28d")}</button> : page && <div key={page.id} className={`knowledge-tree-row${dragged?.id === page.id ? " is-dragging" : ""}${treeDropTarget?.pageID === page.id ? ` is-drop-${treeDropTarget.placement}` : ""}`} style={{ paddingInlineStart: `${depth * 16 + 4}px` }} draggable={canWrite} title={canWrite ? kt("knowledge.auto.9061cb49a6fa8a0e") : undefined} onDragStart={event => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", page.id); setSelectedID(page.id); setDragged(page); setTreeDropTarget(null); }} onDragEnd={() => { setDragged(null); setTreeDropTarget(null); }} onDragOver={event => { if (!canWrite || !dragged || dragged.id === page.id) return; event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "move"; setTreeDropTarget({ pageID: page.id, placement: dragPlacement(event, parent) }); }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTreeDropTarget(current => current?.pageID === page.id ? null : current); }} onDrop={event => { event.preventDefault(); event.stopPropagation(); const placement = treeDropTarget?.pageID === page.id ? treeDropTarget.placement : dragPlacement(event, parent); if (dragged) void dropTreePage(dragged, page, placement); setDragged(null); setTreeDropTarget(null); }}>
          {hasExpandableChildren(page) ? <button className="knowledge-tree-toggle" aria-label={expanded.has(page.id) ? kt("knowledge.auto.7e44578699728b1d") : kt("knowledge.auto.4044f18980fc413c")} onClick={() => void toggle(page)}>{expanded.has(page.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button> : <span className="knowledge-tree-toggle-spacer" aria-hidden="true" />}
          <button ref={element => { treeButtonRefs.current[page.id] = element; }} role="treeitem" aria-selected={selectedID === page.id} tabIndex={selectedID === page.id ? 0 : -1} onKeyDown={event => { if (event.key === "ArrowRight" && !expanded.has(page.id) && hasExpandableChildren(page)) { event.preventDefault(); void toggle(page); } else if (event.key === "ArrowLeft") { event.preventDefault(); if (expanded.has(page.id)) void toggle(page); else if (parent) focusTreePage(parent); } else if (event.key === "ArrowDown") { event.preventDefault(); const next = treeRows.slice(index + 1).find(row => row.page)?.page; if (next) focusTreePage(next.id); } else if (event.key === "ArrowUp") { event.preventDefault(); const previous = treeRows.slice(0, index).reverse().find(row => row.page)?.page; if (previous) focusTreePage(previous.id); } else if (event.key === "Enter") { setSelectedID(page.id); } }} onClick={() => setSelectedID(page.id)}><PageTypeIcon type={page.content_type} size={14} /><span>{page.title}</span></button>
        </div>)}{!loading && treeRows.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.4959f72e9e5d9192")}</p>}</div> : <div className="knowledge-collection-list" role="list">
          {visibleCollectionItems.map(item => <button key={item.page.id} type="button" role="listitem" aria-current={selectedID === item.page.id ? "page" : undefined} onClick={() => setSelectedID(item.page.id)}><PageTypeIcon type={item.page.content_type} size={15} /><span><strong>{item.page.title}</strong><small>{collectionItemDetail(item)}</small></span>{item.page.state === "archived" && <Trash2 size={13} aria-label={kt("knowledge.auto.82395d423099a07a")} />}</button>)}
          {collectionLoading && collectionItems.length === 0 && <p role="status" className="knowledge-subtle"><LoaderCircle className="knowledge-spin" size={14} />{kt("knowledge.auto.21bd738e0d7191a7")}</p>}
          {!collectionLoading && visibleCollectionItems.length === 0 && <p className="knowledge-subtle">{localFilter ? kt("knowledge.auto.c7572df20b03a03e") : ktf("knowledge.auto.ff1f95f1d49e6ba9", { value0: pageNavigationLabels[navigationSection] })}</p>}
          {!collectionComplete && <button type="button" className="knowledge-tree-more" disabled={collectionLoading} onClick={() => void loadMoreCollection()}>{collectionLoading ? kt("knowledge.auto.4927a53bcc886afb") : kt("knowledge.auto.af90a08fec8ee28d")}</button>}
        </div>}
      </aside>
		<article ref={pageFindSurfaceRef} onCopyCapture={event => void controlledPageCopy(event)} className={`knowledge-page-main${mode === "access" || mode === "permissions" || mode === "shares" || mode === "governance" ? " has-side-panel" : ""}${mode === "comments" ? " has-comment-drawer" : ""}${workbenchEditorOpen ? " is-workbench" : ""}${documentContentScroll ? " is-scroll-frame" : ""}`}>
		<KnowledgeDynamicWatermark governance={view?.governance} />
        {!view && <div className="knowledge-page-feedback">
          {notice && <p role="status" className="knowledge-notice">{notice}</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}{collaborationFailure && <p role="alert" className="knowledge-error">{collaborationFailure}</p>}
          {pendingMove && <section className="knowledge-confirm knowledge-move-impact" role="dialog" aria-label={kt("knowledge.auto.7f369b2e273e1ff7")}><h3>{kt("knowledge.auto.abffdaf9fb6ebc33")}</h3><p>{kt("knowledge.auto.d23818fa69418968")}{pendingMove.impact.affected_pages} {kt("knowledge.auto.937a7533bd1edac5")}{pendingMove.impact.changed_subjects.length} {kt("knowledge.auto.93da36b330112475")}</p>{pendingMove.impact.changed_subjects.length > 0 && <p className="knowledge-subtle">{kt("knowledge.auto.74b87ef6e4201341")}{pendingMove.impact.changed_subjects.map(subjectLabel).join("、")}</p>}<div className="knowledge-actions"><Button className="danger" onClick={() => void commitMove(pendingMove.page, pendingMove.parentPageID, pendingMove.impact.token)}>{kt("knowledge.auto.53c8cf2dc28cb380")}</Button><Button onClick={() => setPendingMove(null)}>{kt("knowledge.auto.80446e210c9863e9")}</Button></div></section>}
        </div>}
        {!view && !loading ? <EmptyState><FilePlus2 size={28} /><h3>{kt("knowledge.auto.adcd1a249aa2aa0e")}</h3></EmptyState> : null}
        {view && <>
          <PageHeader editing={mode === "edit"} breadcrumbs={view.breadcrumbs} title={mode === "edit" && titleEditing ? <input ref={titleInputRef} className="knowledge-page-heading-title-input" aria-label={kt("knowledge.auto.c3405f8c7d9d392a")} value={title} maxLength={256} disabled={view.page.content_type !== "file" && collaboration.available && !collaboration.ready} onChange={event => updateEditor(event.target.value, body)} onBlur={() => setTitleEditing(false)} onKeyDown={event => { if (event.key === "Enter" || event.key === "Escape") event.currentTarget.blur(); }} placeholder={kt("knowledge.auto.5ce2d4cc85397eea")} /> : <h2 className={canWrite && view.page.state === "active" ? "is-editable" : undefined} title={canWrite && view.page.state === "active" ? kt("knowledge.auto.553178355a33f198") : undefined} onDoubleClick={beginTitleEditing}>{mode === "edit" ? title : mode === "suggestions" ? view.draft?.title || view.page.title : view.published?.title || view.page.title}</h2>} governance={view.governance} versionSummary={mode === "suggestions" && view.draft ? ktf("knowledge.auto.549578e1aeee0e7a", { value0: view.draft.draft_revision }) : ktf("knowledge.auto.579c81c37464e6c1", { value0: view.page.published_version || kt("knowledge.auto.926f4d92408df955"), value1: view.published ? `${memberProfiles[view.published.published_by_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")} ${kt("knowledge.common.published_at")} ${formatKnowledgeDate(view.published.published_at)}` : kt("knowledge.common.draft_only") })} metadataSummary={metadata && (metadataDirty || metadata.tags.length > 0 || metadata.aliases.length > 0 || metadata.related_page_ids.length > 0 || metadata.owner_user_id || metadata.status || metadata.next_review_at) ? <div className="knowledge-page-metadata-summary" aria-label={kt("knowledge.auto.9ad6d695230596e9")}>{metadataDirty && <span className="is-pending">{kt("knowledge.auto.6a1be012c99c34e8")}</span>}{metadata.status && <span className={`is-status-${metadata.status}`}><i aria-hidden="true" />{pageStatusLabels[metadata.status]}</span>}{metadata.owner_user_id && <span><Users size={12} />{kt("knowledge.auto.a525346277ed54bd")}{memberProfiles[metadata.owner_user_id]?.display_name || metadata.owner_user_id}</span>}{metadata.next_review_at && <span><CalendarClock size={12} />{kt("knowledge.auto.4a0c2575242946b5")}{formatKnowledgeDate(metadata.next_review_at)}</span>}{metadata.aliases.map(alias => <span key={`alias-${alias}`}><Share2 size={11} />{kt("knowledge.auto.55c4cb3d74643b57")}{alias}</span>)}{metadata.related_page_ids.length > 0 && <span><Link2 size={11} />{metadata.related_page_ids.length} {kt("knowledge.auto.7fc7f0683827a215")}</span>}{metadata.tags.map(tag => <span key={tag} className="is-tag"><Tags size={11} />{tag}</span>)}</div> : undefined} presence={mode === "edit" && presenceAvailable ? <details className="knowledge-presence-details"><summary aria-label={ktf("knowledge.auto.720b997a9d04050f", { value0: activeOnlineUsers })}><div className="knowledge-avatar-stack">{collaborators.slice(0, 4).map(person => <span key={person.userID} title={memberProfiles[person.userID]?.display_name || person.userID} style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{(memberProfiles[person.userID]?.display_name || person.userID).slice(0, 1).toUpperCase()}</span>)}</div><strong>{activeOnlineUsers} {kt("knowledge.auto.2b1960b2981c2816")}</strong><ChevronDown size={13} /></summary><aside className="knowledge-collaboration-popover" aria-label={kt("knowledge.auto.b86bbdd237a8a383")}><header><div><Users size={17} /><strong>{kt("knowledge.auto.495fa10d8fe90767")}</strong></div><span>{activeOnlineUsers} {kt("knowledge.auto.50f5d65d57290f75")}</span></header><section className="knowledge-merge-strategy"><GitMerge size={17} /><div><strong>{kt("knowledge.auto.bcab100236daa8d2")}</strong><p>{collaboration.available ? kt("knowledge.auto.720e84e55c39b45f") : kt("knowledge.auto.a46e54ea82afc4c2")}</p></div></section>{collaboration.available && collaboration.mergeCount > 0 && <p className="knowledge-merge-event"><Check size={14} />{kt("knowledge.auto.a2424c9cd4039113")}{collaboration.mergeCount} {kt("knowledge.auto.4abd46332d28af22")}{collaboration.mergedUserIDs.length > 0 ? ktf("knowledge.auto.16db0bcd5f1b6ee2", { value0: collaboration.mergedUserIDs.map(id => memberProfiles[id]?.display_name || id).join("、") }) : ""}</p>}<div className="knowledge-collaborator-list">{collaborators.map(person => { const profile = memberProfiles[person.userID]; const name = profile?.display_name || person.userID; const position = person.selectionBlockID ? `${nativeAwareness.available ? kt("knowledge.auto.15786e92263d9459") : kt("knowledge.auto.c44dca9aefa430ce")} ${person.cursorBlockID.slice(0, 8) || kt("knowledge.auto.5491701e1c3a8cfd")} → ${person.selectionBlockID.slice(0, 8)}` : person.cursorBlockID ? `${nativeAwareness.available ? kt("knowledge.auto.45c21a9e1fe271db") : kt("knowledge.auto.7afe4fff68826e80")} ${person.cursorBlockID.slice(0, 8)}` : kt("knowledge.auto.ee04f93a02b7a93a"); return <div className="knowledge-collaborator" key={person.userID}><span className="knowledge-collaborator-avatar" style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{name.slice(0, 1).toUpperCase()}<i /></span><span><strong>{name}{person.userID === presenceUserID && <em>{kt("knowledge.auto.a0c7716669b5ded0")}</em>}</strong><small>{position}{person.sessions > 1 ? ktf("knowledge.auto.a885452820afe192", { value0: person.sessions }) : ""}</small></span><time dateTime={person.lastSeenAt}>{recentActivityLabel(person.lastSeenAt)}</time></div>; })}</div><footer><span><Wifi size={13} />{collaborationStateLabel}</span>{collaboration.available && collaboration.state === "error" && <Button onClick={collaboration.reconnect}><RefreshCw size={13} />{kt("knowledge.auto.68891ab35cab9663")}</Button>}</footer></aside></details> : undefined} actionHostRef={setPageActionHost} canEdit={canWrite && view.page.state === "active"} onNavigate={setSelectedID} onEdit={() => setMode("edit")} />
          <PageToolbar mode={mode} pageActive={view.page.state === "active"} canWrite={canWrite} isDocument={view.page.content_type === "document"} pageFindOpen={pageFindOpen} personalState={personalState} personalStateSaving={personalStateSaving} aiAvailable={aiAvailable} aiOpen={aiOpen} isManager={library.role === "manager"} canManagePermissions={library.role === "manager" && !!client.getPageAccess && !!client.setPageAccess} canManageShares={library.role === "manager" && !!client.listPageShares && !!client.createPageShare && !!client.revokePageShare} canReviewGovernance={canReviewGovernance} archived={view.page.state === "archived"} onModeChange={changeWorkspaceMode} onOpenSuggestions={() => { setCommentAnchor(null); setSuggestionPanelOpen(false); setMode("suggestions"); }} onOpenFind={() => { setPageFindOpen(true); window.setTimeout(() => pageFindInputRef.current?.select()); }} onToggleFavorite={() => void updatePersonalState({ favorite: !personalState?.favorite }, personalState?.favorite ? kt("knowledge.auto.5abb3406155b1520") : kt("knowledge.auto.e108d15b5d388dcc"))} onToggleSubscription={() => void updatePersonalState({ subscribed: !personalState?.subscribed }, personalState?.subscribed ? kt("knowledge.auto.bfb28f5a652e633f") : kt("knowledge.auto.60469b595212333b"))} onToggleShortcut={() => void updatePersonalState({ shortcutRank: personalState?.shortcut_rank ? "" : `${Date.now().toString().padStart(20, "0")}:${crypto.randomUUID()}` }, personalState?.shortcut_rank ? kt("knowledge.auto.e0087afad93a3b36") : kt("knowledge.auto.8a7f806fb1c06354"))} onOpenAI={() => { setMode("edit"); setAISourceScope(view.published ? "published" : "draft"); setAIOpen(true); setAIFailure(""); }} onCopy={() => void copyCurrentPage()} onArchive={() => void archive(view.page)} />
          <div className="knowledge-page-feedback">
            {notice && <p role="status" className="knowledge-notice">{notice}</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}{collaborationFailure && <p role="alert" className="knowledge-error">{collaborationFailure}</p>}
            {pendingMove && <section className="knowledge-confirm knowledge-move-impact" role="dialog" aria-label={kt("knowledge.auto.7f369b2e273e1ff7")}><h3>{kt("knowledge.auto.abffdaf9fb6ebc33")}</h3><p>{kt("knowledge.auto.d23818fa69418968")}{pendingMove.impact.affected_pages} {kt("knowledge.auto.937a7533bd1edac5")}{pendingMove.impact.changed_subjects.length} {kt("knowledge.auto.93da36b330112475")}</p>{pendingMove.impact.changed_subjects.length > 0 && <p className="knowledge-subtle">{kt("knowledge.auto.74b87ef6e4201341")}{pendingMove.impact.changed_subjects.map(subjectLabel).join("、")}</p>}<div className="knowledge-actions"><Button className="danger" onClick={() => void commitMove(pendingMove.page, pendingMove.parentPageID, pendingMove.impact.token)}>{kt("knowledge.auto.53c8cf2dc28cb380")}</Button><Button onClick={() => setPendingMove(null)}>{kt("knowledge.auto.80446e210c9863e9")}</Button></div></section>}
          </div>
			{aiOpen && aiAvailable && <div className="knowledge-ai-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !aiBusy) setAIOpen(false); }}><section className="knowledge-ai-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-ai-title">
              <header><div><span className="knowledge-ai-icon" aria-hidden="true"><Sparkles size={18} /></span><div><h3 id="knowledge-ai-title">{kt("knowledge.auto.2f9ff39566bb9bc8")}</h3><p>{kt("knowledge.auto.d60cc18c15d0bc56")}</p></div></div><Button aria-label={kt("knowledge.auto.8c833ae07294afaf")} title={kt("knowledge.auto.3fd47edce45b3603")} disabled={aiBusy} onClick={() => { aiRequestAbortRef.current?.abort(); setAIOpen(false); }}><X size={16} /></Button></header>
              <div className="knowledge-ai-form">
                <label><span>{kt("knowledge.auto.5c5374dd958bcb79")}</span><Select value={aiOperation} disabled={aiBusy} onChange={event => { setAIOperation(event.target.value as KnowledgeAIOperation); setAIExecution(null); setAIFailure(""); }}>{Object.entries(aiOperationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></label>
                <label><span>{kt("knowledge.auto.e5295b1ffbb29871")}</span><Select value={aiSourceScope} disabled={aiBusy} onChange={event => { setAISourceScope(event.target.value as KnowledgeAISourceScope); setAIExecution(null); setAIFailure(""); }}><option value="published" disabled={!view.published}>{kt("knowledge.auto.5b2bd5a7c7881ba3")}{view.published ? ktf("knowledge.auto.df7325ea07727c07", { value0: view.published.version }) : kt("knowledge.auto.3eb1a705053ab2a1")}</option><option value="draft" disabled={!collaboration.ready}>{kt("knowledge.auto.7da383ea496639fb")}{collaboration.ready ? `（revision ${collaboration.draftRevision}）` : kt("knowledge.auto.d9c3a38bfa5d5b01")}</option></Select></label>
                {aiOperation === "translate" && <label><span>{kt("knowledge.auto.966a23e84aedeea5")}</span><input value={aiLanguage} maxLength={64} disabled={aiBusy} onChange={event => setAILanguage(event.target.value)} /></label>}
                <label className="knowledge-ai-prompt"><span>{aiOperation === "answer" ? kt("knowledge.auto.33a8618cb6710e43") : kt("knowledge.auto.2cd79953f5e6af3d")}</span><textarea rows={4} maxLength={8000} value={aiPrompt} disabled={aiBusy} onChange={event => setAIPrompt(event.target.value)} placeholder={aiOperation === "write" ? kt("knowledge.auto.37e0f1420c464fd8") : aiOperation === "answer" ? kt("knowledge.auto.5ad935a235baf9f1") : kt("knowledge.auto.d4cd50158137eb23")} /></label>
              </div>
              {aiExecution && <article className={`knowledge-ai-execution is-${aiExecution.state}`}>
                <header><strong>{aiStateLabels[aiExecution.state]}</strong><span>{kt("knowledge.auto.58a823852f8a9b10")}{aiExecution.attempt} {kt("knowledge.auto.db04afb782010c05")}{aiExecution.revision}</span></header>
                <dl><div><dt>{kt("knowledge.auto.a488e93d69cc1296")}</dt><dd>{aiExecution.source.scope === "published" ? ktf("knowledge.auto.ddbf2340c3a4358e", { value0: aiExecution.source.version }) : ktf("knowledge.auto.6040f190dbcc91d2", { value0: aiExecution.source.draft_revision })}</dd></div><div><dt>{kt("knowledge.auto.452c7b10d57a86a7")}</dt><dd>{aiExecution.source.title}</dd></div><div><dt>{kt("knowledge.auto.5b44d86f10b0cf1a")}</dt><dd><code>{aiExecution.source.content_sha256.slice(0, 16)}</code></dd></div>{aiExecution.provider && <div><dt>{kt("knowledge.auto.c98e118e0a43f078")}</dt><dd>{aiExecution.provider} / {aiExecution.model}</dd></div>}</dl>
                {aiExecution.result && <div className="knowledge-ai-result"><strong>{kt("knowledge.auto.82874f0be04f2485")}</strong><pre>{aiExecution.result}</pre></div>}
                {aiExecution.state === "confirmed" && <p className="knowledge-ai-confirmed"><Check size={15} />{kt("knowledge.auto.e3270f3a993558f9")}</p>}
              </article>}
              {aiFailure && <p className="knowledge-ai-error" role="alert">{aiFailure}</p>}
              <footer><p>{!collaboration.ready ? kt("knowledge.auto.be018c038ac161a7") : kt("knowledge.auto.6c5f9189095f5a96")}</p><div><Button disabled={aiBusy} onClick={() => { setAIExecution(null); setAIFailure(""); }}>{kt("knowledge.auto.1ef3de06b32e521b")}</Button>{aiExecution?.state === "completed" ? <Button className="primary" disabled={aiBusy || !collaboration.ready} onClick={() => void confirmAndInsertAI()}><Check size={14} />{kt("knowledge.auto.56b7cefd00821bd5")}</Button> : aiExecution?.state !== "confirmed" && <Button className="primary" disabled={aiBusy || !collaboration.ready || aiSourceScope === "published" && !view.published} onClick={() => void runAI()}>{aiBusy ? <LoaderCircle className="knowledge-spin" size={14} /> : <Sparkles size={14} />}{aiBusy ? kt("knowledge.auto.85a6abca5da94fa8") : kt("knowledge.auto.c4d00116cdadab19")}</Button>}</div></footer>
            </section></div>}
			{pageFindOpen && <div className="knowledge-page-find-bar" role="search" aria-label={kt("knowledge.auto.bcb6a2ea92da4d76")}><Search size={14} aria-hidden="true" /><input ref={pageFindInputRef} value={pageFindQuery} maxLength={256} onChange={event => setPageFindQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && pageFindCount) { event.preventDefault(); setPageFindActive(index => event.shiftKey ? (index - 1 + pageFindCount) % pageFindCount : (index + 1) % pageFindCount); } else if (event.key === "Escape") { event.preventDefault(); setPageFindOpen(false); setPageFindQuery(""); } }} placeholder={kt("knowledge.auto.f26f7e1430254985")} /><span aria-live="polite">{pageFindQuery ? pageFindCount ? `${pageFindActive + 1} / ${pageFindCount}` : kt("knowledge.auto.f1c9cc430f6e6725") : kt("knowledge.auto.2ca2f84c3383f8e3")}</span><Button aria-label={kt("knowledge.auto.64d57ad378dfc5c5")} title={kt("knowledge.auto.64d57ad378dfc5c5")} disabled={!pageFindCount} onClick={() => setPageFindActive(index => (index - 1 + pageFindCount) % pageFindCount)}><ChevronDown className="knowledge-find-previous" size={15} /></Button><Button aria-label={kt("knowledge.auto.84cb6a31b9f52e9f")} title={kt("knowledge.auto.84cb6a31b9f52e9f")} disabled={!pageFindCount} onClick={() => setPageFindActive(index => (index + 1) % pageFindCount)}><ChevronDown size={15} /></Button><Button aria-label={kt("knowledge.auto.bc6b83c57d57096e")} title={kt("knowledge.auto.3fd47edce45b3603")} onClick={() => { setPageFindOpen(false); setPageFindQuery(""); }}><X size={15} /></Button></div>}
          {mode === "suggestions" && <section className="knowledge-suggestion-review-bar" aria-label={kt("knowledge.auto.ce4a6d5c4185528b")}>
            <div><span className="knowledge-suggestion-review-icon"><GitPullRequest size={16} /></span><span><strong>{kt("knowledge.auto.e073bcf8b7cc2e0a")}</strong><small>{kt("knowledge.auto.99f2ae35cd4933f6")}</small></span></div>
            <div><b>{suggestions.filter(item => item.status === "open").length} {kt("knowledge.auto.2f6f44f004af7679")}</b><Button onClick={() => setSuggestionPanelOpen(true)}>{kt("knowledge.auto.b57ec49d159bda72")}</Button></div>
          </section>}
          {mode === "metadata" && metadata && <section className="knowledge-page-metadata" aria-labelledby="knowledge-page-metadata-title">
            <header><div><h3 id="knowledge-page-metadata-title">{kt("knowledge.auto.08c1154822126142")}</h3><p>{kt("knowledge.auto.5f2ecc5b4b83b0a6")}</p></div><span>revision {metadata.revision}</span></header>
            <div className="knowledge-metadata-grid">
              <label className="knowledge-metadata-tags"><span>{kt("knowledge.auto.96cf009193043b9a")}</span><textarea rows={2} maxLength={3100} value={metadataAliasesInput} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => { setMetadataAliasesInput(event.target.value); setMetadataDirty(true); }} placeholder={kt("knowledge.auto.c231e1e26e9f2881")} /><small>{metadataAliases(metadataAliasesInput).length}{kt("knowledge.auto.ee3980367133a25c")}</small></label>
              <label className="knowledge-metadata-tags"><span>{kt("knowledge.auto.1d0fd5f9336d9103")}</span><textarea rows={2} maxLength={1300} value={metadataTagsInput} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => { setMetadataTagsInput(event.target.value); setMetadataDirty(true); }} placeholder={kt("knowledge.auto.c5eeb6f676163494")} /><small>{metadataTags(metadataTagsInput).length}{kt("knowledge.auto.c5aa5711f21bbb0a")}</small></label>
              <label><span>{kt("knowledge.auto.6320b4a8722a851f")}</span><Select value={metadata.status} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, status: event.target.value as KnowledgePageStatus }))}>{Object.entries(pageStatusLabels).map(([value, label]) => <option key={value || "unset"} value={value}>{label}</option>)}</Select></label>
            </div>
            <label className="knowledge-metadata-member-search"><span>{kt("knowledge.auto.3123743d37e2928d")}</span><div><Search size={14} /><input value={metadataMemberQuery} onChange={event => setMetadataMemberQuery(event.target.value)} placeholder={kt("knowledge.auto.75154b0771a98ee0")} /></div></label>
            <div className="knowledge-metadata-properties-heading"><div><h4>{kt("knowledge.auto.9d31fff7121a73ba")}</h4><p>{kt("knowledge.auto.3d78d5b38410e694")}</p></div>{canWrite && view.page.state === "active" && <Button disabled={metadataSaving || metadata.properties.length >= 32} onClick={addMetadataProperty}><Plus size={14} />{kt("knowledge.auto.820ff79e3b7e5b09")}</Button>}</div>
            <div className="knowledge-metadata-properties">
              {metadata.properties.map((property, index) => <div className="knowledge-metadata-property" key={property.id}>
                <input aria-label={ktf("knowledge.auto.da24ce4ef86f60e4", { value0: index + 1 })} maxLength={64} value={property.name} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, name: event.target.value } : item) }))} />
                <Select aria-label={ktf("knowledge.auto.239d5ba590e703ad", { value0: index + 1 })} value={property.type} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, type: event.target.value as KnowledgePagePropertyType, value: "" } : item) }))}>{Object.entries(pagePropertyTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
                {property.type === "checkbox" ? <Select aria-label={ktf("knowledge.auto.acddf2523a7386df", { value0: property.name })} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))}><option value="">{kt("knowledge.auto.2f5f1d6fbfb061ed")}</option><option value="true">{kt("knowledge.auto.b5141d3d19e9a048")}</option><option value="false">{kt("knowledge.auto.0c70665b6eb65f1a")}</option></Select> : property.type === "person" ? <Select aria-label={ktf("knowledge.auto.acddf2523a7386df", { value0: property.name })} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))}><option value="">{kt("knowledge.auto.2f5f1d6fbfb061ed")}</option>{metadataMemberIDs.map(userID => <option key={userID} value={userID}>{memberProfiles[userID]?.display_name || userID}</option>)}</Select> : <input aria-label={ktf("knowledge.auto.acddf2523a7386df", { value0: property.name })} type={property.type === "number" ? "number" : property.type === "date" ? "date" : "text"} step={property.type === "number" ? "any" : undefined} maxLength={property.type === "text" ? 1024 : 128} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))} />}
                {canWrite && view.page.state === "active" && <Button aria-label={ktf("knowledge.auto.c5155e2192d630e7", { value0: property.name })} title={kt("knowledge.auto.5337923599ef398f")} disabled={metadataSaving} onClick={() => updateMetadata(current => ({ ...current, properties: current.properties.filter(item => item.id !== property.id) }))}><Trash2 size={14} /></Button>}
              </div>)}
              {metadata.properties.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.876b703fc68bb4f3")}</p>}
            </div>
            <footer><p>{metadata.updated_at ? ktf("knowledge.auto.99521b09698bfbd0", { value0: memberProfiles[metadata.updated_by_user_id || ""]?.display_name || metadata.updated_by_user_id || kt("knowledge.auto.3c2e935e260f4c63"), value1: formatKnowledgeDate(metadata.updated_at) }) : kt("knowledge.auto.51685bbb28371fa8")}</p><div><Button disabled={metadataSaving || !metadataDirty} onClick={() => void reloadMetadata()}><RefreshCw size={14} />{kt("knowledge.auto.7bdd5ce1e298a972")}</Button>{canWrite && view.page.state === "active" && <Button className="primary" disabled={metadataSaving || !metadataDirty || metadataTags(metadataTagsInput).length > 20 || metadataAliases(metadataAliasesInput).length > 12} onClick={() => void saveMetadata()}><Save size={14} />{metadataSaving ? kt("knowledge.auto.ff509c9ba052a21c") : kt("knowledge.auto.c911d9846c673a6a")}</Button>}</div></footer>
          </section>}
          {mode === "references" && <section className="knowledge-page-references" aria-labelledby="knowledge-page-references-title">
            <header><div><h3 id="knowledge-page-references-title">{kt("knowledge.auto.87249396ac40a9ef")}</h3><p>{kt("knowledge.auto.1ebd8c630a59f711")}</p></div>{referencesLoading && <span role="status"><LoaderCircle className="knowledge-spin" size={14} />{kt("knowledge.auto.e6442ce18f53cf99")}</span>}</header>
            <div className="knowledge-reference-columns">
              <article aria-labelledby="knowledge-outgoing-references"><header><div><h4 id="knowledge-outgoing-references">{kt("knowledge.auto.a8b2c9c23645c349")}</h4><p>{kt("knowledge.auto.c2bf6cf297ad9992")}</p></div><strong>{outgoingReferences.length}</strong></header><div className="knowledge-reference-index-list">
                {outgoingReferences.map(reference => { const type = reference.target_content_type || "document"; return <button key={`${reference.source_page_id}:${reference.block_id}`} disabled={!reference.available} onClick={() => { setSelectedID(reference.target_page_id); setMode("read"); }}><PageTypeIcon type={type} size={17} /><span><b>{reference.available ? reference.target_title || kt("knowledge.auto.31c3baada748f5ce") : kt("knowledge.auto.fedc767fde32d402")}</b><small>{reference.reference_mode === "fixed" ? ktf("knowledge.auto.4cf17f7f064e0413", { value0: reference.target_version }) : kt("knowledge.auto.0830515fbec6fab4")} · {reference.display === "embed" ? kt("knowledge.auto.975f9da19eee1b16") : kt("knowledge.auto.fb5640f8e12e3337")} · Block {reference.block_id.slice(0, 10)}</small></span><ChevronRight size={15} /></button>; })}
                {outgoingReferences.length === 0 && !referencesLoading && <p className="knowledge-subtle">{kt("knowledge.auto.cfd857e80c109277")}</p>}
              </div>{!outgoingReferencesComplete && <Button disabled={referencesLoading} onClick={() => void loadMoreReferences("outgoing")}>{kt("knowledge.auto.6d41b178f0af4f10")}</Button>}</article>
              <article aria-labelledby="knowledge-incoming-references"><header><div><h4 id="knowledge-incoming-references">{kt("knowledge.auto.3879a4d5604d1563")}</h4><p>{kt("knowledge.auto.9308578a43791d3c")}</p></div><strong>{incomingReferences.length}</strong></header><div className="knowledge-reference-index-list">
                {incomingReferences.map(reference => { const type = reference.source_content_type || "document"; return <button key={`${reference.source_page_id}:${reference.block_id}`} onClick={() => { setSelectedID(reference.source_page_id); setMode("read"); }}><PageTypeIcon type={type} size={17} /><span><b>{reference.source_title || kt("knowledge.auto.31c3baada748f5ce")}</b><small>{reference.reference_mode === "fixed" ? ktf("knowledge.auto.608f9df1cba7712d", { value0: reference.target_version }) : kt("knowledge.auto.0830515fbec6fab4")} · {reference.display === "embed" ? kt("knowledge.auto.975f9da19eee1b16") : kt("knowledge.auto.fb5640f8e12e3337")} {kt("knowledge.auto.47f9aa35408a178b")}{formatKnowledgeDate(reference.updated_at)}</small></span><ChevronRight size={15} /></button>; })}
                {incomingReferences.length === 0 && !referencesLoading && <p className="knowledge-subtle">{kt("knowledge.auto.5187d101d12d3ebc")}</p>}
              </div>{!incomingReferencesComplete && <Button disabled={referencesLoading} onClick={() => void loadMoreReferences("incoming")}>{kt("knowledge.auto.4eb51dc2fa91b96c")}</Button>}</article>
            </div>
          </section>}
          {mode === "relationships" && metadata && <section className="knowledge-page-relationships" aria-labelledby="knowledge-page-relationships-title">
            <header><div><h3 id="knowledge-page-relationships-title">{kt("knowledge.auto.bff649dfd34f83b3")}</h3><p>{kt("knowledge.auto.948e5345504a211c")}</p></div><Button aria-label={kt("knowledge.auto.75385d01c6b9d598")} title={kt("knowledge.auto.75385d01c6b9d598")} disabled={relationshipLoading} onClick={() => void loadRelationshipGraph()}><RefreshCw className={relationshipLoading ? "knowledge-spin" : undefined} size={15} /></Button></header>
            <div className="knowledge-relationship-layout">
              <article className="knowledge-related-editor"><header><div><h4>{kt("knowledge.auto.f1a58a380f43f608")}</h4><p>{kt("knowledge.auto.03dd0527c440ebcc")}</p></div><strong>{metadata.related_page_ids.length}</strong></header>
                <label className="knowledge-relationship-search"><Search size={15} aria-hidden="true" /><input value={relationshipQuery} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => setRelationshipQuery(event.target.value)} placeholder={kt("knowledge.auto.22ea4d218fa7adda")} />{relationshipSearchLoading && <LoaderCircle className="knowledge-spin" size={15} aria-label={kt("knowledge.auto.71a70403509559c2")} />}</label>
                <div className="knowledge-related-search-results" role="listbox" aria-label={kt("knowledge.auto.973985ee8a776c1e")}>
                  {relationshipResults.map(item => { const active = metadata.related_page_ids.includes(item.page_id); return <button key={item.page_id} type="button" role="option" aria-selected={active} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onClick={() => updateMetadata(current => ({ ...current, related_page_ids: active ? current.related_page_ids.filter(pageID => pageID !== item.page_id) : [...current.related_page_ids, item.page_id] }))}><PageTypeIcon type={item.content_type} size={16} /><span><b>{item.title}</b><small>{identityPath(item)}{item.aliases.length > 0 ? ktf("knowledge.auto.6defc490556729e9", { value0: item.aliases.join("、") }) : ""}</small></span><i>{active ? kt("knowledge.auto.59b1cc0e0890e30f") : kt("knowledge.auto.748cd875b23a81d6")}</i></button>; })}
                  {!relationshipSearchLoading && relationshipResults.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.1a66b02771624153")}</p>}
                </div>
                {metadata.related_page_ids.length > 0 && <div className="knowledge-related-selected"><h5>{kt("knowledge.auto.cb6bf8ab5cb57670")}</h5>{metadata.related_page_ids.map(pageID => { const item = relationshipGraph?.nodes.find(node => node.page_id === pageID) || (metadataDirty ? relationshipResults.find(node => node.page_id === pageID) : undefined); return <div key={pageID} className={item ? undefined : "is-unavailable"}><PageTypeIcon type={item?.content_type || "document"} size={15} /><span><b>{item?.title || kt("knowledge.auto.dcec72e8ccd5e297")}</b><small>{item ? identityPath(item) : kt("knowledge.auto.f0df56ab2d08359f")}</small></span>{canWrite && view.page.state === "active" && <button type="button" aria-label={ktf("knowledge.auto.df55b473fe427144", { value0: item?.title || kt("knowledge.common.unavailable_page") })} onClick={() => updateMetadata(current => ({ ...current, related_page_ids: current.related_page_ids.filter(id => id !== pageID) }))}><X size={14} /></button>}</div>; })}</div>}
                <footer><span>{metadataDirty ? kt("knowledge.auto.4021d40e8f2292a0") : `metadata revision ${metadata.revision}`}</span>{canWrite && view.page.state === "active" && <Button className="primary" disabled={metadataSaving || !metadataDirty || metadataAliases(metadataAliasesInput).length > 12 || metadata.related_page_ids.length > 64} onClick={() => void saveMetadata()}><Save size={14} />{metadataSaving ? kt("knowledge.auto.ff509c9ba052a21c") : kt("knowledge.auto.1288af0f1bf50967")}</Button>}</footer>
              </article>
              <article className="knowledge-relationship-graph"><header><div><h4>{kt("knowledge.auto.73cfc661a728ad5b")}</h4><p>{kt("knowledge.auto.4912c3cb15fe0d55")}</p></div>{relationshipGraph && <strong>{relationshipGraph.nodes.length} {kt("knowledge.auto.082137f22303183e")}</strong>}</header>
                {relationshipLoading && !relationshipGraph ? <p role="status" className="knowledge-relationship-loading"><LoaderCircle className="knowledge-spin" size={18} />{kt("knowledge.auto.15ca06570634a265")}</p> : relationshipGraph && relationshipGraph.nodes.length > 0 ? <><KnowledgeRelationshipGraphView graph={relationshipGraph} onOpen={pageID => { setMode("read"); setSelectedID(pageID); }} /><div className="knowledge-relationship-node-list">{relationshipGraph.nodes.filter(node => node.page_id !== relationshipGraph.center_page_id).map(node => <button type="button" key={node.page_id} onClick={() => { setMode("read"); setSelectedID(node.page_id); }}><PageTypeIcon type={node.content_type} size={15} /><span><b>{node.title}</b><small>{identityPath(node)}</small></span><ChevronRight size={14} /></button>)}</div></> : <p className="knowledge-subtle">{kt("knowledge.auto.87cd2bc152640e05")}</p>}
              </article>
            </div>
          </section>}
          {(mode === "read" || mode === "outline" || mode === "comments" || mode === "access" || mode === "permissions" || mode === "shares" || mode === "governance") && (view.page.content_type === "file" && visibleFileContent ? <div className="knowledge-page-readable typed-readable"><KnowledgeFilePage client={client} libraryID={library.id} pageID={view.page.id} content={visibleFileContent} pageActionHost={pageActionHost} formatError={formatError} /></div> : (view.published || view.draft) ? <div className={`knowledge-page-readable typed-readable${view.page.content_type === "document" ? " is-document" : ""}${mode === "outline" && view.page.content_type === "document" ? " has-inline-outline" : ""}`}>
            {mode === "outline" && view.page.content_type === "document" && <PageOutline items={outline} />}
            <KnowledgeEditor type={view.page.content_type} body={view.published?.body.content || view.draft?.body.content || ""} documentTitle={view.published?.title || view.draft?.title || view.page.title} canManage={library.role === "manager"} gridAccess={view.grid_access} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} form={formRuntime} initialBlockID={highlightedBlockID} initialSearchLocation={linkedSearchLocation} blockHighlightRevision={commentFocus.revision} commentMarkers={showCommentMarkers ? commentMarkers : undefined} onCommentMarkerOpen={showCommentMarkers ? openCommentThread : undefined} onCommentAnchor={["document", "whiteboard", "mind_map", "flowchart"].includes(view.page.content_type) ? anchor => setCommentAnchor(anchor || null) : undefined} addDocumentSelection={addDocumentSelectionAction} addDocumentSelectionBusy={addSelectionBusy} pageActionHost={pageActionHost} authorizeContentAction={authorizeContentAction} uploadFile={view.page.content_type === "form" ? uploadEditorFile : undefined} fileUploadsEnabled={library.documents_configured} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} />
          </div> : <EmptyState><Upload size={28} /><h3>{kt("knowledge.auto.6c47b9ebe1b6023a")}</h3><p>{kt("knowledge.auto.1e49553942628f25")}</p></EmptyState>)}
          {mode === "suggestions" && view.draft && <div className="knowledge-page-readable typed-readable is-document knowledge-suggestion-draft"><KnowledgeEditor type="document" body={view.draft.body.content} documentTitle={view.draft.title} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} initialBlockID={commentFocus.nodeID || undefined} blockHighlightRevision={commentFocus.revision} onCommentAnchor={anchor => { setCommentAnchor(anchor || null); if (anchor) setSuggestionPanelOpen(true); }} addDocumentSelection={addDocumentSelectionAction} addDocumentSelectionBusy={addSelectionBusy} pageActionHost={pageActionHost} authorizeContentAction={authorizeContentAction} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} /></div>}
          {mode === "edit" && view.draft && view.page.content_type === "file" && <div className="knowledge-editor-shell"><section className="knowledge-page-editor knowledge-file-page-editor"><div className="knowledge-editor-canvas"><div className="knowledge-editor-toolbar"><span>{kt("knowledge.auto.04c6b3170286010f")}</span><span>{kt("knowledge.auto.2c443624e0d0088b")}</span></div><KnowledgeFilePage client={client} libraryID={library.id} pageID={view.page.id} content={body} pageActionHost={pageActionHost} formatError={formatError} /></div><footer className="knowledge-editor-actions"><div><Button disabled={!dirty || saveState === "saving" || publishState === "publishing"} onClick={() => void saveDraft()}><Save size={14} />{kt("knowledge.auto.5329e3f0ee463df5")}</Button><span className="knowledge-editor-hint">{kt("knowledge.auto.ac5ab601ea917355")}</span></div><div><Button className="primary" disabled={saveState === "conflict" || publishState === "publishing" || !title.trim()} onClick={() => void publish()}><Send size={14} />{publishState === "publishing" ? kt("knowledge.auto.c7f77b9c7cdd4823") : kt("knowledge.auto.cbfe181351c872eb")}</Button></div></footer></section></div>}
          {mode === "edit" && view.draft && view.page.content_type !== "file" && <div className="knowledge-editor-shell">
            <section className="knowledge-page-editor">
              <div className="knowledge-editor-canvas">
                <div className="knowledge-editor-toolbar"><span>{pageTypeMeta[view.page.content_type].label}</span><span>{view.page.content_type === "document" ? ktf("knowledge.auto.8a9696c86f276528", { value0: editorStats.blocks, value1: editorStats.characters }) : kt("knowledge.auto.c31c138a3c27d00d")}</span></div>
                <KnowledgeEditor key={`${view.page.id}:${remountEditorOnDraftRevision ? view.draft.draft_revision : 0}:${editorEpoch}`} type={view.page.content_type} body={body} documentTitle={title} canManage={library.role === "manager"} gridAccess={view.grid_access} collaboration={collaboration.available && collaboration.ready ? collaboration.editorCollaboration : undefined} readOnly={collaboration.available && !collaboration.ready} mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} form={formRuntime} initialBlockID={linkedBlockID} initialSearchLocation={linkedSearchLocation} blockLink={blockLink} insertMarkdownRequest={aiInsertRequest} addDocumentSelection={addDocumentSelectionAction} addDocumentSelectionBusy={addSelectionBusy} pageActionHost={pageActionHost} authorizeContentAction={authorizeContentAction} onActionFeedback={setNotice} uploadFile={library.documents_configured && (view.page.content_type === "document" || view.page.content_type === "multidimensional_table" || view.page.content_type === "presentation" || view.page.content_type === "form") ? uploadEditorFile : undefined} fileUploadsEnabled={library.documents_configured} fileUploadAccept={fileUploadAccept} readFile={readEditorFile} convertPage={view.page.content_type === "document" || view.page.content_type === "mind_note" ? convertCurrentPage : undefined} onChange={(next, change) => updateEditor(title, next, change)} onPresence={collaboration.available ? collaboration.updatePresence : nativeAwareness.updatePresence} />
              </div>
              <div className="knowledge-editor-meta">
                <div className={`knowledge-sync-state is-${collaboration.state}`} role="status">{collaboration.state === "syncing" || collaboration.state === "connecting" || collaboration.state === "reconnecting" ? <Cloud className="knowledge-pulse" size={15} /> : collaboration.state === "error" ? <Wifi size={15} /> : <Check size={15} />}<span>{publishState === "publishing" ? kt("knowledge.auto.e1af5270ae9b1bf8") : publishState === "error" ? kt("knowledge.auto.c8bceff124ed25a2") : collaboration.available ? collaborationStateLabel : { idle: dirty ? kt("knowledge.auto.46611c8a6e79d47b") : kt("knowledge.auto.e44c4b0437994cf2"), saving: kt("knowledge.auto.6bdb4435095e5d28"), saved: ktf("knowledge.auto.9d5dc30e92ee554d", { value0: view.draft.draft_revision }), conflict: kt("knowledge.auto.a0098d8cb82a728d"), error: kt("knowledge.auto.6309a3bb5ba4c714") }[saveState]}</span>{collaboration.available && collaboration.draftRevision > 0 && <small>revision {collaboration.draftRevision} · clock {collaboration.serverClock}</small>}</div>
                <label className={`knowledge-attachment-trigger${!library.documents_configured ? " is-disabled" : ""}`} title={library.documents_configured ? kt("knowledge.auto.9900809ec506c2ba") : kt("knowledge.auto.110ef2aec9c35d85")}><Paperclip size={15} />{kt("knowledge.auto.9900809ec506c2ba")}<input type="file" accept={knowledgeDocumentAccept(library)} disabled={attaching || !library.documents_configured} onChange={event => { const file = selectedUploadFile(event.target.files); if (file) void attachFile(file); event.currentTarget.value = ""; }} /></label>
              </div>
              {(attaching || attachments.length > 0) && <div className="knowledge-page-attachments">{attaching && <span role="status">{kt("knowledge.auto.1757730048c496ca")}</span>}{attachments.map(attachment => <span key={attachment.document_id}>{attachment.title}<button type="button" onClick={() => void removeAttachment(attachment)}>{kt("knowledge.auto.6135d4159e892541")}</button></span>)}</div>}
              {!collaboration.available && saveState === "conflict" && <div className="knowledge-conflict"><GitMerge size={18} /><span>{saveConflict ? ktf("knowledge.auto.6351aa1a3ccef439", { value0: saveConflict.current_draft_revision, value1: saveConflict.base_published_version, value2: formatKnowledgeDate(saveConflict.current_updated_at), value3: saveConflict.current_content_sha256.slice(0, 12) }) : kt("knowledge.auto.5cc0fa48f8913071")}</span><Button onClick={() => void copyDraftAfterConflict()}>{kt("knowledge.auto.fc117246f4b6fa90")}</Button><Button onClick={() => { pendingSaveRef.current = null; pendingNativeSaveRef.current = null; pendingPublishRef.current = null; setSaveConflict(null); setSelectedID(current => { window.setTimeout(() => setSelectedID(current)); return ""; }); }}><RefreshCw size={14} />{kt("knowledge.auto.35588dcb9be3dc8e")}</Button></div>}
              <footer className="knowledge-editor-actions">
                <div>{!collaboration.available && <Button disabled={!dirty || saveState === "saving" || publishState === "publishing"} onClick={() => void saveDraft()}><Save size={14} />{kt("knowledge.auto.5329e3f0ee463df5")}</Button>}<span className="knowledge-editor-hint">{collaboration.available ? kt("knowledge.auto.acf7c1b88caee081") : nativeAwareness.available ? kt("knowledge.auto.57328372699c5194") : kt("knowledge.auto.77486716859a491e")}</span></div>
                <div><Button className="primary" disabled={saveState === "conflict" || publishState === "publishing" || !title.trim() || collaboration.available && (collaboration.state === "error" || collaboration.state === "connecting" || collaboration.state === "reconnecting")} onClick={() => void publish()}><Send size={14} />{publishState === "publishing" ? kt("knowledge.auto.c7f77b9c7cdd4823") : kt("knowledge.auto.cbfe181351c872eb")}</Button></div>
              </footer>
            </section>
          </div>}
          {mode === "history" && <PageHistoryPanel section={historySection} versions={versions} versionsComplete={versionsComplete} editHistory={editHistory} editHistoryComplete={editHistoryComplete} compare={compare} rollbackVersion={rollbackVersion} rollbackBusy={rollbackBusy} diff={diff} preview={historyPreview} previewContent={historyPreview ? <div className="knowledge-page-readable typed-readable"><KnowledgeEditor type={historyPreview.content_type} body={historyPreview.body.content} documentTitle={historyPreview.title} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} /></div> : undefined} canWrite={canWrite} memberProfiles={memberProfiles} onSectionChange={section => { setHistorySection(section); setRollbackVersion(null); }} onCompareChange={setCompare} onCompare={() => void compareVersions()} onPreview={version => void previewVersion(version)} onRollbackPrompt={setRollbackVersion} onRollback={version => void rollback(version)} onLoadMoreVersions={() => void loadMoreVersions()} onLoadMoreEdits={() => void loadMoreEditHistory()} />}
          {mode === "suggestions" && <SuggestionDrawer open={suggestionPanelOpen} suggestions={suggestions} anchor={commentAnchor} canCreate={canWrite && view.page.state === "active" && !!view.draft} canWrite={canWrite} currentUserID={currentUserID} memberProfiles={memberProfiles} kind={suggestionKind} proposedText={suggestionText} comment={suggestionComment} mentionedUserIDs={suggestionMentionedUserIDs} busy={suggestionBusy} searchMembers={searchMentionMembers} onMemberResolved={rememberMentionMember} onClose={() => setSuggestionPanelOpen(false)} onFocusAnchor={nodeID => setCommentFocus(current => ({ nodeID, revision: current.revision + 1 }))} onKindChange={setSuggestionKind} onProposedTextChange={setSuggestionText} onCommentChange={setSuggestionComment} onMentionedUserIDsChange={setSuggestionMentionedUserIDs} onCreate={() => void createSuggestion()} onDecide={(suggestion, decision) => void decideSuggestion(suggestion, decision)} />}
          {mode === "comments" && <CommentDrawer comments={comments} tasks={tasks} memberProfiles={memberProfiles} activeThreadID={activeCommentThreadID} pageArchived={view.page.state === "archived"} canComment={!!view.published && view.page.state === "active"} canWrite={canWrite} unresolvedOnly={unresolvedOnly} commentsComplete={commentsComplete} replyingTo={replyingTo} anchor={commentAnchor} body={commentBody} mentionedUserIDs={mentionedUserIDs} focusRequest={commentComposerFocusRequest} editingCommentID={editingCommentID} editingCommentBody={editingCommentBody} editingMentionedUserIDs={editingCommentMentionedUserIDs} searchMembers={searchMentionMembers} onMemberResolved={rememberMentionMember} onClose={() => setMode("read")} onUnresolvedOnlyChange={setUnresolvedOnly} onFocusAnchor={nodeID => setCommentFocus(current => ({ nodeID, revision: current.revision + 1 }))} onCancelReply={() => setReplyingTo("")} onBodyChange={setCommentBody} onMentionedUserIDsChange={setMentionedUserIDs} onSubmit={() => void addComment()} onThreadElement={(threadID, element) => { commentThreadRefs.current[threadID] = element; }} onFocusComment={focusComment} onEditingCommentBodyChange={setEditingCommentBody} onEditingMentionedUserIDsChange={setEditingCommentMentionedUserIDs} onSaveEdit={comment => void updateComment(comment)} onCancelEdit={() => { setEditingCommentID(""); setEditingCommentBody(""); setEditingCommentMentionedUserIDs([]); }} onBeginEdit={comment => { setEditingCommentID(comment.id); setEditingCommentBody(comment.body); setEditingCommentMentionedUserIDs(comment.mentioned_user_ids || []); }} onBeginReply={beginReply} onResolve={comment => void resolveComment(comment)} onAssignTask={comment => void assignCommentTask(comment)} onDelete={comment => void deleteComment(comment)} onToggleReaction={(comment, emoji) => void toggleCommentReaction(comment, emoji)} onLoadMore={() => void loadMoreComments()} />}
          {mode === "activity" && <PageActivityPanel items={activities} versionsComplete={versionsComplete} commentsComplete={commentsComplete} onLoadMoreVersions={() => void loadMoreVersions()} onLoadMoreComments={() => void loadMoreComments()} />}
          {mode === "access" && library.role === "manager" && <section className="knowledge-page-access knowledge-page-management-panel">
            <header className="knowledge-management-panel-header"><span className="knowledge-management-panel-icon"><ScanSearch size={17} /></span><div><h3>{kt("knowledge.auto.4f3125785c1ca618")}</h3><p>{kt("knowledge.auto.4f21a74594d2fad7")}</p></div></header>
            <div className="knowledge-principal-picker"><label>{kt("knowledge.auto.72861f44fb0eb26e")}<input value={accessQuery} onChange={event => { setAccessQuery(event.target.value); setAccessUserID(""); }} placeholder={kt("knowledge.auto.85333d57ff441b5b")} /></label>{accessPrincipals.length > 0 && <div className="knowledge-principal-results" role="listbox">{accessPrincipals.map(principal => <button key={principal.user_id} role="option" aria-selected={accessUserID === principal.user_id} onClick={() => { setAccessUserID(principal.user_id); setAccessQuery(principal.display_name || principal.email || principal.user_id); setAccessPrincipals([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name}</strong><small>{principal.email}</small></button>)}</div>}</div>
            <label>{kt("knowledge.auto.b2a8d0140cf95027")}<Select value={accessAction} onChange={event => setAccessAction(event.target.value)}><option value="knowledge.pages.get">{kt("knowledge.auto.1cbde6354434b792")}</option><option value="knowledge.pages.update">{kt("knowledge.auto.9d0eedd99d2bdac6")}</option><option value="knowledge.pages.publish">{kt("knowledge.auto.5c5a53a77586bc62")}</option><option value="knowledge.page_comments.create">{kt("knowledge.auto.0bfca7bdd2207da4")}</option><option value="knowledge.page_shares.read">{kt("knowledge.auto.2da78594b02e3e19")}</option></Select></label>
            {accessAction === "knowledge.page_shares.read" && <label>{kt("knowledge.auto.f3de3ae1827b5ec5")}<input value={accessShareID} onChange={event => setAccessShareID(event.target.value)} placeholder="kshare_…" /></label>}
            {accessExplanation ? <div className="knowledge-access-preview"><p><strong>{kt("knowledge.auto.06af262c7f6bbc3c")}{accessExplanation.final.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")}</strong>（{accessExplanation.final.label} · {accessExplanation.final.source === "share" ? kt("knowledge.auto.e532a669a7e8f13c") : kt("knowledge.auto.7d2724785675cc5b")}）</p><p>{kt("knowledge.auto.94860bce77109078")}{accessExplanation.identity.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")} · {accessExplanation.identity.label}</p><p>{kt("knowledge.auto.61bcbb2fe8015793")}{accessExplanation.library.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")} · {accessExplanation.library_role || kt("knowledge.auto.57d6952328a94219")} · {accessExplanation.library.label}</p><p>{kt("knowledge.auto.ba8d011eb7139c4d")}{accessExplanation.page.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")} · {accessExplanation.page.label}{kt("knowledge.auto.3033ff5d2296d873")}{accessExplanation.inherited_from || kt("knowledge.auto.433bdcb25776552f")}</p>{accessExplanation.share && <p>{kt("knowledge.auto.fc47bee7c3d026a4")}{accessExplanation.share.allowed ? kt("knowledge.auto.ce7ef28b670ade58") : kt("knowledge.auto.136de7a8c46fc803")} · {accessExplanation.share.label} · {accessExplanation.share.source || "share"}</p>}</div> : <p className="knowledge-management-panel-empty">{kt("knowledge.auto.08f85e851b027101")}</p>}
          </section>}
          {mode === "permissions" && library.role === "manager" && client.getPageAccess && client.setPageAccess && <section className="knowledge-page-access knowledge-page-permissions knowledge-page-management-panel">
            <header className="knowledge-management-panel-header"><span className="knowledge-management-panel-icon"><UserRoundCog size={17} /></span><div><h3>{kt("knowledge.auto.0b1b3206f35169db")}</h3><p>{kt("knowledge.auto.7981201c28873f36")}</p></div></header>
            {!pageAccess ? <p role="status">{kt("knowledge.auto.5cbc44772dd4b565")}</p> : <>
              <label>{kt("knowledge.auto.16725e0158ab60bc")}<Select value={permissionMode} disabled={permissionSaving} onChange={event => setPermissionMode(event.target.value as "inherit" | "restricted")}><option value="inherit">{kt("knowledge.auto.497dd2f074555450")}</option><option value="restricted">{kt("knowledge.auto.c6283c432f61cd35")}</option></Select></label>
              {permissionMode === "inherit" ? <p className="knowledge-access-preview">{kt("knowledge.auto.3b4df8d927559c2b")}</p> : <>
                <div className="knowledge-permission-grant-options">
                  <label>{kt("knowledge.auto.92846f588c99c74e")}<Select value={permissionSubjectType} disabled={permissionSaving} onChange={event => { setPermissionSubjectType(event.target.value as KnowledgeAccessSubject["type"]); setPermissionQuery(""); }}><option value="user">{kt("knowledge.auto.0d0e1a86b3aa7877")}</option><option value="organization">{kt("knowledge.auto.b4d203dea5b9121c")}</option></Select></label>
                  <label>{kt("knowledge.auto.23a4babe9a5f5611")}<Select value={permissionRole} onChange={event => setPermissionRole(event.target.value as KnowledgePageAccessGrant["role"])}><option value="reader">{kt("knowledge.auto.b836711928b953da")}</option><option value="editor">{kt("knowledge.auto.e129fa9976368c75")}</option><option value="manager">{kt("knowledge.auto.c6be12134278a807")}</option></Select></label>
                  <label>{kt("knowledge.auto.b8cd22094f085d29")}<Select value={permissionScope} onChange={event => setPermissionScope(event.target.value as KnowledgePageAccessGrant["scope"])}><option value="page">{kt("knowledge.auto.3427f69175c5c4ab")}</option><option value="subtree">{kt("knowledge.auto.4c0cb8f218cfd293")}</option></Select></label>
                </div>
                {permissionSubjectType === "user" ? <div className="knowledge-principal-picker"><label>{kt("knowledge.auto.ec9464ddb35b23d5")}<input value={permissionQuery} disabled={permissionSaving} onChange={event => setPermissionQuery(event.target.value)} placeholder={kt("knowledge.auto.44d42e02a5e4d4d1")} /></label>{permissionPrincipals.length > 0 && <div className="knowledge-principal-results" role="listbox">{permissionPrincipals.map(principal => <button key={principal.user_id} role="option" onClick={() => addPermissionGrant(principal)}><span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span><strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}</div> : <div className="knowledge-member-editor"><label>{kt("knowledge.auto.ff76126c1b1ae3b3")}<input value={permissionQuery} disabled={permissionSaving} onChange={event => setPermissionQuery(event.target.value)} placeholder={kt("knowledge.auto.7f35c9d5cbc9246a")} /></label><Button disabled={permissionSaving || !permissionQuery.trim()} onClick={() => void addOrganizationPermissionGrant()}>{kt("knowledge.auto.fd08e4ac95775686")}</Button></div>}
                <div className="knowledge-permission-grants">{permissionGrants.map(grant => <div key={`${grant.subject.type}:${grant.subject.id}:${grant.scope}`}><span><strong>{subjectLabel(grant.subject)}</strong><small>{grant.subject.type === "organization" ? kt("knowledge.auto.b4d203dea5b9121c") : kt("knowledge.auto.0d0e1a86b3aa7877")} · {grant.role === "reader" ? kt("knowledge.auto.b836711928b953da") : grant.role === "editor" ? kt("knowledge.auto.e129fa9976368c75") : kt("knowledge.auto.c6be12134278a807")} · {grant.scope === "page" ? kt("knowledge.auto.3427f69175c5c4ab") : kt("knowledge.auto.384018e4d41d658e")}</small></span><Button disabled={permissionSaving} onClick={() => setPermissionGrants(current => current.filter(item => item.subject.type !== grant.subject.type || item.subject.id !== grant.subject.id || item.scope !== grant.scope))}>{kt("knowledge.auto.6135d4159e892541")}</Button></div>)}{permissionGrants.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.7b73729f35dbbec5")}</p>}</div>
              </>}
              <p className="knowledge-subtle">{kt("knowledge.auto.68184773c18acfc9")}{pageAccess.revision} {kt("knowledge.auto.86a7044024d5ee7c")}{pageAccess.projection_status === "ready" ? kt("knowledge.auto.d56a511f498f7e73") : kt("knowledge.auto.3d5d21365296066c")}</p>
              <Button disabled={permissionSaving} onClick={() => void savePageAccess()}><Save size={14} />{permissionSaving ? kt("knowledge.auto.6bdb4435095e5d28") : kt("knowledge.auto.eee66653fb920bd8")}</Button>
            </>}
          </section>}
          {mode === "shares" && library.role === "manager" && client.listPageShares && client.createPageShare && client.revokePageShare && <section className="knowledge-page-access knowledge-page-shares knowledge-page-management-panel" aria-label={kt("knowledge.auto.348c903d1b5d1b9c")}><KnowledgePageShareManager client={client} libraryID={library.id} pageID={selectedID} published={!!view.published} formatError={formatError} onNotice={setNotice} /></section>}
          {mode === "governance" && metadata && governanceDraft && <section className="knowledge-page-governance knowledge-page-management-panel" aria-labelledby="knowledge-page-governance-title">
            <header className="knowledge-management-panel-header"><span className="knowledge-management-panel-icon"><ShieldCheck size={17} /></span><div><h3 id="knowledge-page-governance-title">{kt("knowledge.auto.0c4ab1ae758a60c4")}</h3><p>{kt("knowledge.auto.e74c230a77372b06")}</p></div><span>revision {metadata.revision}</span></header>
            <article className="knowledge-governance-card">
              <div className="knowledge-governance-card-title"><div><h4>{kt("knowledge.auto.d374899ac9adad3b")}</h4><p>{kt("knowledge.auto.b9e7073e5821da1c")}</p></div>{governanceDirty && <span className="is-pending">{kt("knowledge.auto.6a1be012c99c34e8")}</span>}</div>
              <div className="knowledge-governance-grid">
                <label><span>{kt("knowledge.auto.cb40c24dc52e991e")}</span><Select value={governanceDraft.ownerUserID} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, ownerUserID: event.target.value, contentAdminUserIDs: current.contentAdminUserIDs.filter(userID => userID !== event.target.value) }))}><option value="">{kt("knowledge.auto.fbac1be7463da759")}</option>{metadataMemberIDs.map(userID => <option key={userID} value={userID}>{memberProfiles[userID]?.display_name || userID}</option>)}</Select></label>
                <label><span>{kt("knowledge.auto.5700c11251f8c524")}</span><input type="datetime-local" value={metadataDateTimeInput(governanceDraft.nextReviewAt)} disabled={library.role !== "manager" || governanceSaving || governanceDraft.reviewIntervalDays === 0} onChange={event => updateGovernance(current => ({ ...current, nextReviewAt: metadataDateTimeISO(event.target.value) }))} /></label>
                <label><span>{kt("knowledge.auto.2d2dd33e1a59c9df")}</span><input type="number" min={0} max={3650} value={governanceDraft.reviewIntervalDays} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, reviewIntervalDays: Math.max(0, Number(event.target.value) || 0), nextReviewAt: Number(event.target.value) > 0 ? current.nextReviewAt : undefined }))} /><small>{kt("knowledge.auto.915ac78787bf9404")}</small></label>
                <label><span>{kt("knowledge.auto.d5f0437a6a87b381")}</span><input type="number" min={1} max={3650} value={governanceDraft.archiveRetentionDays} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, archiveRetentionDays: Math.max(1, Number(event.target.value) || 1) }))} /><small>{kt("knowledge.auto.2e0ea58183b60529")}</small></label>
              </div>
              <label className="knowledge-metadata-member-search"><span>{kt("knowledge.auto.3123743d37e2928d")}</span><div><Search size={14} /><input value={metadataMemberQuery} disabled={library.role !== "manager" || governanceSaving} onChange={event => setMetadataMemberQuery(event.target.value)} placeholder={kt("knowledge.auto.7599029f7aa97b8d")} /></div></label>
              <div className="knowledge-governance-admins"><div><h5>{kt("knowledge.auto.20f4d76fb7776cda")}</h5><p>{kt("knowledge.auto.1feca0413d4da165")}</p></div><div>{metadataMemberIDs.filter(userID => userID !== governanceDraft.ownerUserID).map(userID => <label key={userID}><input type="checkbox" checked={governanceDraft.contentAdminUserIDs.includes(userID)} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, contentAdminUserIDs: event.target.checked ? [...current.contentAdminUserIDs, userID].sort() : current.contentAdminUserIDs.filter(value => value !== userID) }))} /><span>{memberProfiles[userID]?.display_name || userID}</span><small>{memberProfiles[userID]?.email || userID}</small></label>)}</div></div>
              <div className="knowledge-governance-review-status"><div><CalendarClock size={18} /><span><strong>{metadata.last_reviewed_at ? ktf("knowledge.auto.1635f5e0cc3f360f", { value0: formatKnowledgeDate(metadata.last_reviewed_at) }) : kt("knowledge.auto.b1e161a78e1dca35")}</strong><small>{metadata.last_reviewed_by_user_id ? ktf("knowledge.auto.2371a98893616804", { value0: memberProfiles[metadata.last_reviewed_by_user_id]?.display_name || metadata.last_reviewed_by_user_id }) : metadata.next_review_at ? ktf("knowledge.auto.c2bc68295bd2e324", { value0: formatKnowledgeDate(metadata.next_review_at) }) : kt("knowledge.auto.773573772985d36a")}</small></span></div>{canReviewGovernance && view.page.state === "active" && <Button disabled={governanceSaving || governanceDirty} onClick={() => void reviewGovernance()}><Check size={14} />{kt("knowledge.auto.2b7934b52d3de20c")}</Button>}</div>
              {metadata.archived_at && <p className="knowledge-governance-retention"><Trash2 size={15} />{kt("knowledge.auto.8989040fb00808c0")}{formatKnowledgeDate(metadata.archived_at)}；{metadata.retain_until ? ktf("knowledge.auto.fbdc255ed5f89c1e", { value0: formatKnowledgeDate(metadata.retain_until) }) : kt("knowledge.auto.f93158deb30eb1eb")}</p>}
              {library.role === "manager" && <footer><Button disabled={governanceSaving || !governanceDirty} onClick={() => void reloadMetadata()}><RefreshCw size={14} />{kt("knowledge.auto.7bdd5ce1e298a972")}</Button><Button className="primary" disabled={governanceSaving || !governanceDirty || !governanceDraft.ownerUserID || governanceDraft.contentAdminUserIDs.length > 20 || governanceDraft.archiveRetentionDays < 1 || governanceDraft.archiveRetentionDays > 3650 || governanceDraft.reviewIntervalDays < 0 || governanceDraft.reviewIntervalDays > 3650} onClick={() => void saveGovernance()}><Save size={14} />{governanceSaving ? kt("knowledge.auto.ff509c9ba052a21c") : kt("knowledge.auto.43f05138b90dfca7")}</Button></footer>}
            </article>
            {library.role === "manager" && <article className="knowledge-governance-card knowledge-governance-audit">
              <div className="knowledge-governance-card-title"><div><h4>{kt("knowledge.auto.bf193385a61a05da")}</h4><p>{kt("knowledge.auto.e79fa253ca2b88dc")}</p></div><Button aria-label={kt("knowledge.auto.891301b869927492")} title={kt("knowledge.auto.aee88743413144a2")} disabled={governanceAuditLoading} onClick={() => void loadGovernanceAudit(true)}><RefreshCw className={governanceAuditLoading ? "knowledge-spin" : undefined} size={14} /></Button></div>
              <div className="knowledge-governance-audit-filters"><label><span>{kt("knowledge.auto.c560201b331c5443")}</span><Select value={governanceAuditEvent} disabled={governanceAuditLoading} onChange={event => setGovernanceAuditEvent(event.target.value)}><option value="">{kt("knowledge.auto.e09a4c2ca638e997")}</option><option value="knowledge.page.governance_set">{kt("knowledge.auto.7c40d1ea1d918425")}</option><option value="knowledge.page.governance_reviewed">{kt("knowledge.auto.7cf0323071c960b2")}</option></Select></label><label><span>{kt("knowledge.auto.eaf43299b936294e")}</span><input value={governanceAuditActor} disabled={governanceAuditLoading} onChange={event => setGovernanceAuditActor(event.target.value)} placeholder={kt("knowledge.auto.e4a707a8ff8d5030")} /></label><Button disabled={governanceAuditLoading} onClick={() => void loadGovernanceAudit(true)}><Search size={14} />{kt("knowledge.auto.bcd6771e08ec7cc7")}</Button></div>
              <div className="knowledge-governance-audit-list">{governanceAudit.map(event => <article key={event.id}><span className="knowledge-governance-audit-icon"><ShieldCheck size={15} /></span><div><strong>{governanceEventLabels[event.type] || event.type}</strong><small>{memberProfiles[event.actor.user_id]?.display_name || event.actor.user_id} · {formatKnowledgeDate(event.occurred_at)} · revision {event.version || "-"}</small>{event.after && <p>{Object.entries(event.after).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p>}</div></article>)}{!governanceAuditLoading && governanceAudit.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.171a1e7e24b814df")}</p>}</div>
              {!governanceAuditComplete && <Button disabled={governanceAuditLoading || !governanceAuditAfter} onClick={() => void loadGovernanceAudit(false)}>{governanceAuditLoading ? kt("knowledge.auto.4927a53bcc886afb") : kt("knowledge.auto.af90a08fec8ee28d")}</Button>}
            </article>}
            {library.role === "manager" && client.getPageContentPolicy && client.setPageContentPolicy && <KnowledgePageContentPolicyManager client={client} libraryID={library.id} pageID={selectedID} formatError={formatError} onNotice={setNotice} onSaved={() => { void client.getPage(library.id, selectedID, canWrite, AbortSignal.timeout(30_000)).then(refreshed => { viewRef.current = refreshed; setView(refreshed); }, failure => setError(formatError(failure))); }} />}
          </section>}
        </>}
      </article>
    </div>
    {templateDialogOpen && typeof document !== "undefined" && createPortal(<div className="knowledge-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !templateBusy) setTemplateDialogOpen(false); }}><section className="knowledge-template-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-template-title">
      <header><div><h2 id="knowledge-template-title">{kt("knowledge.auto.3d8802be301dae9f")}</h2><p>{kt("knowledge.auto.f6fb89250e8918c8")}</p></div><Button aria-label={kt("knowledge.auto.5a66b818a5aec24d")} title={kt("knowledge.auto.3fd47edce45b3603")} disabled={!!templateBusy} onClick={() => setTemplateDialogOpen(false)}><X size={17} /></Button></header>
      <div className="knowledge-template-dialog-body">
        {canWrite && selectedID && client.createPageTemplate && <section className="knowledge-template-create"><div><h3>{kt("knowledge.auto.ae9fdd6519740223")}</h3><p>{kt("knowledge.auto.002d03871a8d3477")}</p></div><label>{kt("knowledge.auto.f7816a356dbc4427")}<input maxLength={256} value={templateTitle} disabled={!!templateBusy} onChange={event => setTemplateTitle(event.target.value)} /></label><label>{kt("knowledge.auto.4262c45dc797bb0c")}<textarea maxLength={2048} rows={2} value={templateDescription} disabled={!!templateBusy} onChange={event => setTemplateDescription(event.target.value)} placeholder={kt("knowledge.auto.3c040de9707d6cc1")} /></label><Button className="primary" disabled={!!templateBusy || !templateTitle.trim()} onClick={() => void saveCurrentAsTemplate()}><Save size={15} />{templateBusy === "create" ? kt("knowledge.auto.6bdb4435095e5d28") : kt("knowledge.auto.87080fe7a6d4d477")}</Button></section>}
        <section className="knowledge-template-library"><div className="knowledge-template-section-title"><span><h3>{kt("knowledge.auto.66e6056fcf05ee9e")}</h3><p>{kt("knowledge.auto.6a579b9c589314be")}</p></span><Button aria-label={kt("knowledge.auto.ac4b4541d328a48b")} title={kt("knowledge.auto.aee88743413144a2")} disabled={!!templateBusy} onClick={() => void loadTemplates()}><RefreshCw size={15} /></Button></div>
          {templateBusy === "list" && templates.length === 0 ? <p className="knowledge-subtle">{kt("knowledge.auto.c500eb769b5c9c9a")}</p> : templates.length === 0 ? <EmptyState><LayoutTemplate size={26} /><h3>{kt("knowledge.auto.ec3c2ded1ef5f78f")}</h3><p>{kt("knowledge.auto.15a69973ed888057")}</p></EmptyState> : <div className="knowledge-template-list">{templates.map(template => <article key={template.id} className="knowledge-template-card"><div className="knowledge-template-card-icon"><PageTypeIcon type={template.root_content_type} size={18} /></div><div className="knowledge-template-card-main"><h4>{template.title}</h4><p>{template.description || kt("knowledge.auto.71083097a94f44f7")}</p><small>{template.node_count} {kt("knowledge.auto.346497e45c57da37")}{template.latest_version} · {formatKnowledgeDate(template.updated_at)}</small><div className="knowledge-template-card-actions"><Button className="primary" disabled={!!templateBusy} onClick={() => void instantiateTemplate(template)}>{kt("knowledge.auto.2ad59db8727baaab")}</Button>{client.listPageTemplateVersions && <Button disabled={!!templateBusy} aria-expanded={templateVersionOpen === template.id} onClick={() => void loadTemplateVersions(template.id)}><Clock3 size={14} />{kt("knowledge.auto.6fd29579ab66d263")}</Button>}{canWrite && selectedID && client.updatePageTemplate && <Button disabled={!!templateBusy} onClick={() => void updateTemplateFromCurrent(template)}><RefreshCw size={14} />{kt("knowledge.auto.f9a0960490825156")}</Button>}</div>{templateVersionOpen === template.id && <div className="knowledge-template-versions">{templateBusy === `versions:${template.id}` && !(templateVersions[template.id]?.length) ? <p>{kt("knowledge.auto.691ead22b78f3da6")}</p> : (templateVersions[template.id] || []).map(item => <div key={item.version}><span><strong>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{item.version}</strong><small>{item.node_count} {kt("knowledge.auto.bb4690dbc9474463")}{formatKnowledgeDate(item.created_at)}</small></span><Button disabled={!!templateBusy} onClick={() => void instantiateTemplate(template, item.version)}>{kt("knowledge.auto.df507c1dd2bbf9aa")}</Button></div>)}</div>}</div></article>)}</div>}
        </section>
      </div>
    </section></div>, document.body)}
  </section>;
}
