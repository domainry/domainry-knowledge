import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Activity, Bell, BookOpen, CalendarClock, Check, ChevronDown, ChevronRight, Clock3, Cloud, Copy, FilePlus2, GitMerge, GitPullRequest, LayoutTemplate, Link2, ListTree, LoaderCircle, LockKeyhole, MessageSquare, MoreHorizontal, Paperclip, Pencil, Pin, Plus, RefreshCw, Save, Search, Send, Settings, Share2, ShieldCheck, Sparkles, Star, Tags, Trash2, Upload, Users, Wifi, X } from "lucide-react";
import { Button, EmptyState } from "./components.tsx";
import { documentUploadMaxBytes, knowledgeDocumentAccept, knowledgeDocumentSupports, sha256 } from "./document.ts";
import type { KnowledgeAccessExplanation, KnowledgeAccessSubject, KnowledgeAIExecution, KnowledgeAIOperation, KnowledgeAISourceScope, KnowledgeClient, KnowledgeGovernanceEvent, KnowledgeLibrary, KnowledgeOrganizationPrincipal, KnowledgePage, KnowledgePageAccessGrant, KnowledgePageAccessPolicy, KnowledgePageAttachment, KnowledgePageCollectionItem, KnowledgePageCollectionKind, KnowledgePageComment, KnowledgePageConflict, KnowledgePageCustomProperty, KnowledgePageEditHistoryEntry, KnowledgePageIdentity, KnowledgePageMetadata, KnowledgePageMoveImpact, KnowledgePageNativeOperation, KnowledgePagePersonalState, KnowledgePagePollView, KnowledgePagePropertyType, KnowledgePageReferenceLink, KnowledgePageRelationshipGraph, KnowledgePageSearchLocation, KnowledgePageStatus, KnowledgePageSuggestion, KnowledgePageTask, KnowledgePageTemplate, KnowledgePageTemplateVersionSummary, KnowledgePageVersion, KnowledgePageVersionDiff, KnowledgePageView, KnowledgePrincipal } from "./types.ts";
import { useKnowledgeCollaboration } from "./useKnowledgeCollaboration.ts";
import { useKnowledgeNativeAwareness } from "./useKnowledgeNativeAwareness.ts";
import { importPageTypes, nativePageTypes, pageTypeMeta, PageTypeIcon } from "./pageTypeRegistry.ts";
import { KnowledgeEditor } from "./editors/KnowledgeEditor.tsx";
import type { KnowledgeCommentAnchorSelection, KnowledgeDynamicBlockRuntime, KnowledgeEditorChange, KnowledgeFormRuntime, KnowledgeMentionRuntime, KnowledgePollRuntime, KnowledgeTaskRuntime } from "./editors/types.ts";
import type { KnowledgePageContentType } from "./types.ts";
import { appendDocumentImage, documentOutline, documentStats } from "./documentContent.ts";
import { KnowledgeFilePage } from "./KnowledgeFilePage.tsx";
import { KnowledgePageShareManager } from "./KnowledgePageShareManager.tsx";
import { KnowledgePageContentPolicyManager } from "./KnowledgePageContentPolicyManager.tsx";
import { KnowledgeClassificationBadge, KnowledgeDynamicWatermark } from "./KnowledgePageGovernance.tsx";
import { filePageContent, parseFilePageContent } from "./file-page.ts";
import { createKnowledgeBlockLink, createKnowledgePageLink } from "./knowledge-links.ts";
import { nativePageOperations } from "./nativeOperations.ts";
import { gridAutomationExecutions } from "./gridContent.ts";
import { parseFormContent } from "./formContent.ts";

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
  all: "全部页面",
  shortcuts: "快捷入口",
  favorites: "收藏",
  recent_views: "最近访问",
  recent_edits: "最近编辑",
  subscribed: "订阅",
  trash: "回收站",
};
const workbenchPageTypes = new Set<KnowledgePageContentType>(["multidimensional_table", "spreadsheet", "presentation", "form", "whiteboard", "mind_map", "flowchart"]);
const pageStatusLabels: Record<KnowledgePageStatus, string> = { "": "未设置", in_progress: "编写中", in_review: "待复核", verified: "已核验", deprecated: "已过时" };
const aiOperationLabels: Record<KnowledgeAIOperation, string> = { write: "续写", summarize: "总结", translate: "翻译", rewrite: "改写", answer: "问答" };
const aiStateLabels: Record<KnowledgeAIExecution["state"], string> = { pending: "等待执行", running: "正在生成", completed: "等待确认", failed: "执行失败", confirmed: "已确认并写回" };
const pagePropertyTypeLabels: Record<KnowledgePagePropertyType, string> = { text: "文本", number: "数字", date: "日期", select: "选项", checkbox: "勾选", person: "人员" };
const governanceEventLabels: Record<string, string> = {
  "knowledge.page.governance_set": "更新治理规则",
  "knowledge.page.governance_reviewed": "完成内容复核",
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
  return ({ queued: "等待索引", indexing: "正在索引", ready: "已可检索", failed: "索引失败", none: "尚未索引" })[page.projection_status || "none"];
}

const collaboratorColors = ["#176b52", "#315f9d", "#9a5a17", "#7a4b9d", "#a13f5b"];
const commentReactionEmojis = ["👍", "❤️", "🎉", "👀", "😄", "🚀"] as const;

function collaboratorColor(userID: string) {
  return collaboratorColors[[...userID].reduce((sum, character) => sum + character.codePointAt(0)!, 0) % collaboratorColors.length];
}

function recentActivityLabel(value: string, now = Date.now()) {
  const elapsed = Math.max(0, now - Date.parse(value));
  if (!Number.isFinite(elapsed) || elapsed < 15_000) return "刚刚活跃";
  if (elapsed < 60_000) return `${Math.floor(elapsed / 1000)} 秒前活跃`;
  if (elapsed < 3_600_000) return `${Math.floor(elapsed / 60_000)} 分钟前活跃`;
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " 活跃";
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
    onError(error) { setEditing(false); setTarget(null); setFailure(errorStatus(error) === 403 || errorStatus(error) === 404 ? "引用权限已撤销，内容已关闭。" : formatError(error)); },
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
        if (errorStatus(error) === 403 || errorStatus(error) === 404) closeReference("引用不可用或权限已撤销。");
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
              closeReference("引用权限已撤销，内容已关闭。");
            } else if (event.type === "changed") {
              void load(false);
            }
          }, abort.signal);
          if (!active || revoked || abort.signal.aborted) return;
          failures++;
        } catch (error) {
          if (!active || revoked || abort.signal.aborted) return;
          if (errorStatus(error) === 403 || errorStatus(error) === 404) {
            closeReference("引用权限已撤销，内容已关闭。");
            return;
          }
          failures++;
          setFailure("实时更新连接暂时中断，正在重连。");
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
            if (!currentDraft) throw Error("目标页面草稿不可用。");
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
  if (loading) return <div className="knowledge-reference-loading"><LoaderCircle className="knowledge-spin" size={16} />正在加载引用…</div>;
  if (!target || failure && !body) return <div className="knowledge-reference-revoked"><ShieldCheck size={17} /><div><strong>引用不可用</strong><small>{failure || "你没有权限查看此页面"}</small></div></div>;
  const source = fixedVersion || (editing && target.draft ? target.draft : target.published || target.draft);
  const permission = !live ? `固定版本 ${reference.targetVersion}` : editable ? "可编辑" : "只读";
  const header = <header className="knowledge-reference-header"><PageTypeIcon type={target.page.content_type} size={17} /><div><strong>{source?.title || target.page.title}</strong><small>{pageTypeMeta[target.page.content_type].label} · {target.page.state === "active" ? permission : "已归档"} · 更新于 ${new Date(target.page.updated_at).toLocaleString()}</small></div><button type="button" onClick={() => onOpen(target.page.id)}>打开页面</button></header>;
  if (reference.display === "card") return <div className="knowledge-reference-card">{header}</div>;
  return <section className="knowledge-reference-embed">{header}
    <div className="knowledge-reference-embed-actions">{editable && <button type="button" onClick={() => { setEditing(value => !value); setDirty(false); setBody((target.draft || source)?.body.content || ""); }}>{editing ? "退出内嵌编辑" : "内嵌编辑"}</button>}{editing && editable && target.page.content_type !== "document" && <button type="button" disabled={!dirty || saving} onClick={() => void save()}>{saving ? "保存中…" : "保存目标草稿"}</button>}{collaboration.available && <span>{collaboration.state === "connected" ? "目标协作已连接" : "正在连接目标协作…"}</span>}</div>
    {target.page.content_type === "file" && source ? <KnowledgeFilePage client={client} libraryID={library.id} pageID={target.page.id} content={source.body.content} formatError={formatError} /> : source ? <KnowledgeEditor
      type={target.page.content_type} body={body || source.body.content} documentTitle={source.title} canManage={library.role === "manager"} gridAccess={target.grid_access}
      collaboration={collaboration.available && collaboration.ready ? collaboration.editorCollaboration : undefined}
      readOnly={!editing || !editable || collaboration.available && !collaboration.ready}
      readFile={async referenceValue => { const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(referenceValue); if (!match) throw Error("文件引用无效。"); const response = await client.readDocumentContent(library.id, match[1], { signal: AbortSignal.timeout(120_000) }); if (!response.ok) throw Error(`文件读取失败（HTTP ${response.status}）。`); return response.blob(); }}
      authorizeContentAction={async operation => {
        if (!client.authorizePageContentOperation) throw Error("当前宿主未启用页面内容保护。");
        await client.authorizePageContentOperation(library.id, target.page.id, operation, AbortSignal.timeout(30_000));
      }}
      onActionFeedback={message => setFailure(message)} onChange={(content, change) => { setBody(content); setDirty(true); if (collaboration.available) collaboration.edit(source.title, content, change); }} onPresence={collaboration.available ? collaboration.updatePresence : undefined}
    /> : <div className="knowledge-reference-empty">目标页面还没有可显示的内容。</div>}
    {failure && <p className="knowledge-reference-error" role="alert">{failure}</p>}
  </section>;
}

const relationshipKindLabels = { hierarchy: "父子层级", reference: "正文引用", related: "关联页面" } as const;

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
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`以${center?.title || "当前页面"}为中心的知识关系图`}>
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
    <div className="knowledge-relationship-legend" aria-label="关系类型图例">{Object.entries(relationshipKindLabels).map(([kind, label]) => <span className={`is-${kind}`} key={kind}><i />{label}</span>)}{graph.truncated && <em>关系较多，图中仅展示受权范围内的前 {graph.nodes.length} 个页面</em>}</div>
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

export function KnowledgePagesPanel({ client, library, currentUserID = "", disabled, formatError, embedded = false, initialPageID = "", initialBlockID, initialSearchLocation, initialPageMode = "read", onSelectionChange, onManage }: { client: KnowledgeClient; library: KnowledgeLibrary; currentUserID?: string; disabled: boolean; formatError(error: unknown): string; embedded?: boolean; initialPageID?: string; initialBlockID?: string; initialSearchLocation?: KnowledgePageSearchLocation; initialPageMode?: "read" | "edit"; onSelectionChange?: (page: { id: string; title: string } | null) => void; onManage?: () => void }) {
  const canWrite = !library.archived && (library.role === "editor" || library.role === "manager");
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
	const [pageFindOpen, setPageFindOpen] = useState(false), [pageFindQuery, setPageFindQuery] = useState("");
	const [pageFindCount, setPageFindCount] = useState(0), [pageFindActive, setPageFindActive] = useState(0);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [createMenuPosition, setCreateMenuPosition] = useState({ top: 0, left: 0, maxHeight: 560 });
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false), [templates, setTemplates] = useState<KnowledgePageTemplate[]>([]);
  const [templateVersions, setTemplateVersions] = useState<Record<string, KnowledgePageTemplateVersionSummary[]>>({}), [templateVersionOpen, setTemplateVersionOpen] = useState("");
  const [templateTitle, setTemplateTitle] = useState(""), [templateDescription, setTemplateDescription] = useState(""), [templateBusy, setTemplateBusy] = useState("");
  const [dragged, setDragged] = useState<KnowledgePage | null>(null);
  const [treeDropTarget, setTreeDropTarget] = useState<TreeDropTarget | null>(null);
  const [importingFile, setImportingFile] = useState(false);
  const [mode, setMode] = useState<"read" | "edit" | "suggestions" | "history" | "outline" | "comments" | "activity" | "metadata" | "references" | "relationships" | "access" | "permissions" | "governance">("read");
  const [title, setTitle] = useState(""), [body, setBody] = useState(""), [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "conflict" | "error">("idle");
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "error">("idle");
  const [saveConflict, setSaveConflict] = useState<KnowledgePageConflict | null>(null);
  const [publishNote, setPublishNote] = useState("");
  const [versions, setVersions] = useState<KnowledgePageVersion[]>([]), [diff, setDiff] = useState<KnowledgePageVersionDiff | null>(null), [compare, setCompare] = useState<number[]>([]);
  const [versionBefore, setVersionBefore] = useState(0), [versionsComplete, setVersionsComplete] = useState(true);
  const [editHistory, setEditHistory] = useState<KnowledgePageEditHistoryEntry[]>([]), [editHistoryBefore, setEditHistoryBefore] = useState(0), [editHistoryComplete, setEditHistoryComplete] = useState(true);
  const [historyPreview, setHistoryPreview] = useState<KnowledgePageVersion | null>(null);
  const [comments, setComments] = useState<KnowledgePageComment[]>([]), [commentBody, setCommentBody] = useState(""), [unresolvedOnly, setUnresolvedOnly] = useState(false);
  const [commentAfter, setCommentAfter] = useState(""), [commentsComplete, setCommentsComplete] = useState(true);
  const [editingCommentID, setEditingCommentID] = useState(""), [editingCommentBody, setEditingCommentBody] = useState("");
  const [memberQuery, setMemberQuery] = useState(""), [mentionCandidates, setMentionCandidates] = useState<KnowledgePrincipal[]>([]), [mentionedUserIDs, setMentionedUserIDs] = useState<string[]>([]);
  const [memberProfiles, setMemberProfiles] = useState<Record<string, KnowledgePrincipal>>({}), [replyingTo, setReplyingTo] = useState("");
  const [organizationProfiles, setOrganizationProfiles] = useState<Record<string, KnowledgeOrganizationPrincipal>>({});
  const [commentAnchor, setCommentAnchor] = useState<KnowledgeCommentAnchorSelection | null>(null);
  const [commentFocus, setCommentFocus] = useState({ nodeID: "", revision: 0 });
  const [suggestions, setSuggestions] = useState<KnowledgePageSuggestion[]>([]), [suggestionKind, setSuggestionKind] = useState<"insert" | "delete">("insert");
  const [suggestionText, setSuggestionText] = useState(""), [suggestionComment, setSuggestionComment] = useState(""), [suggestionMentionedUserIDs, setSuggestionMentionedUserIDs] = useState<string[]>([]), [suggestionBusy, setSuggestionBusy] = useState("");
  const [attachments, setAttachments] = useState<KnowledgePageAttachment[]>([]), [attaching, setAttaching] = useState(false);
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
  const [aiPrompt, setAIPrompt] = useState(""), [aiLanguage, setAILanguage] = useState("简体中文"), [aiExecution, setAIExecution] = useState<KnowledgeAIExecution | null>(null);
  const [aiBusy, setAIBusy] = useState(false), [aiFailure, setAIFailure] = useState(""), [aiInsertRequest, setAIInsertRequest] = useState<{ id: string; markdown: string } | undefined>();
  const viewRef = useRef<KnowledgePageView | null>(null), editRef = useRef({ title: "", body: "" }), saveQueue = useRef(Promise.resolve());
  const pendingSaveRef = useRef<PendingPageSave | null>(null), pendingNativeSaveRef = useRef<PendingNativePageSave | null>(null), pendingPublishRef = useRef<PendingPagePublish | null>(null);
  const printAuthorizationRef = useRef(0);
  const editAfterSelectRef = useRef("");
  const activeAttachmentUploadsRef = useRef(0);
  const aiRequestAbortRef = useRef<AbortController | null>(null);
  const treeButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const createMenuAnchorRef = useRef<HTMLDivElement | null>(null), createMenuRef = useRef<HTMLDivElement | null>(null);
	const titleInputRef = useRef<HTMLInputElement | null>(null);
	const pageFindInputRef = useRef<HTMLInputElement | null>(null), pageFindSurfaceRef = useRef<HTMLElement | null>(null), pageFindRangesRef = useRef<Range[]>([]);
  const filePageInputRef = useRef<HTMLInputElement | null>(null);
  const tasksRef = useRef<KnowledgePageTask[]>([]), taskCreatesRef = useRef(new Map<string, Promise<KnowledgePageTask>>());
  const pollsRef = useRef<KnowledgePagePollView[]>([]), pollCreatesRef = useRef(new Map<string, Promise<KnowledgePagePollView>>());
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
    onError(failure) { setError(formatError(failure)); },
  });
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
  const activeOnlineUsers = collaboration.available ? collaboration.onlineUsers : nativeAwareness.onlineUsers;
  const presenceAvailable = collaboration.available || nativeAwareness.available;
  const presenceUserID = collaboration.userID || currentUserID;

	useEffect(() => {
		onSelectionChange?.(view ? { id: view.page.id, title: view.page.title } : null);
	}, [onSelectionChange, view?.page.id, view?.page.title]);

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
    const unique = [...new Set(userIDs.filter(Boolean))];
    if (unique.length === 0) return;
    try {
      const profiles = await client.resolvePrincipals(unique, signal);
      if (!signal.aborted) setMemberProfiles(current => ({ ...current, ...Object.fromEntries(profiles.filter(profile => profile.status === "active").map(profile => [profile.user_id, profile])) }));
    } catch {
      // The content remains readable; unavailable identities render as such.
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

  useEffect(() => {
    const abort = new AbortController();
    setChildren({}); setChildrenCursor({}); setChildrenComplete({}); setExpanded(new Set()); setSelectedID(initialPageID); setView(null); setLoading(true); setError("");
    setNavigationSection("all"); setCollectionItems([]); setCollectionAfter(""); setCollectionComplete(true); setPersonalState(null); setPersonalStateSaving(false);
    setMetadata(null); setMetadataTagsInput(""); setMetadataAliasesInput(""); setMetadataDirty(false); setMetadataSaving(false); setMetadataMemberQuery(""); setMetadataMembers([]);
    setRelationshipGraph(null); setRelationshipLoading(false); setRelationshipQuery(""); setRelationshipResults([]); setRelationshipSearchLoading(false);
    setCreateMenuOpen(false); setTemplateDialogOpen(false); setTemplates([]); setTemplateVersions({}); setTemplateVersionOpen(""); editAfterSelectRef.current = "";
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
      setDirty(false); setSaveState("idle"); setPublishState("idle"); setSaveConflict(null); setMode(editAfterSelect || linkedEdit ? "edit" : "read"); setDiff(null); setCompare([]); setHistoryPreview(null);
      setVersions([]); setVersionBefore(0); setVersionsComplete(true); setEditHistory([]); setEditHistoryBefore(0); setEditHistoryComplete(true); setComments([]); setCommentAfter(""); setCommentsComplete(true); setCommentBody(""); setCommentAnchor(null); setCommentFocus({ nodeID: "", revision: 0 }); setReplyingTo(""); setSuggestions([]); setSuggestionText(""); setSuggestionComment(""); setSuggestionMentionedUserIDs([]); setSuggestionBusy(""); setPageAccess(null); setPermissionGrants([]); setPendingMove(null);
      void resolveProfiles([value.published?.published_by_user_id || "", pageMetadata.owner_user_id || "", ...pageMetadata.content_admin_user_ids, pageMetadata.last_reviewed_by_user_id || "", pageMetadata.updated_by_user_id || "", ...pageMetadata.properties.filter(property => property.type === "person").map(property => property.value)], abort.signal);
      if (editAfterSelect) window.setTimeout(() => titleInputRef.current?.select());
      void client.recordPageView(library.id, value.page.id, { client_id: crypto.randomUUID() }, abort.signal).then(state => {
        if (!abort.signal.aborted && value.page.id === viewRef.current?.page.id) setPersonalState(state);
      }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    }).catch(failure => { if (!abort.signal.aborted) { setView(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [canWrite, client, formatError, initialPageID, initialPageMode, library.id, selectedID]);

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
    while (used.has(`属性 ${number}`)) number++;
    const property: KnowledgePageCustomProperty = { id: `prop_${crypto.randomUUID()}`, name: `属性 ${number}`, type: "text", value: "" };
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
      setMetadata(saved); setMetadataTagsInput(saved.tags.join(", ")); setMetadataAliasesInput(saved.aliases.join(", ")); setMetadataDirty(false); setNotice("页面属性和关联已保存。");
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || "", ...saved.properties.filter(property => property.type === "person").map(property => property.value)], AbortSignal.timeout(30_000));
      if (mode === "relationships") void loadRelationshipGraph();
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? "页面属性已被其他人更新。请重新加载后再修改。" : formatError(failure));
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
      setGovernanceDraft(governanceDraftFromMetadata(saved)); setGovernanceDirty(false); setNotice("页面治理规则已保存。");
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || ""], AbortSignal.timeout(30_000));
      void loadGovernanceAudit(true);
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? "页面治理规则已被其他人更新，请重新加载。" : formatError(failure));
    } finally { setGovernanceSaving(false); }
  }

  async function reviewGovernance() {
    if (!metadata || !selectedID || governanceSaving || governanceDirty || view?.page.state !== "active") return;
    setGovernanceSaving(true); setError("");
    try {
      const saved = normalizePageMetadata(await client.reviewPageGovernance(library.id, selectedID, { client_id: crypto.randomUUID(), expected_revision: metadata.revision }, AbortSignal.timeout(30_000)));
      setMetadata(saved); setGovernanceDraft(governanceDraftFromMetadata(saved)); setNotice("本次内容复核已记录，下次复核时间已更新。");
      void resolveProfiles([saved.owner_user_id || "", ...saved.content_admin_user_ids, saved.last_reviewed_by_user_id || "", saved.updated_by_user_id || ""], AbortSignal.timeout(30_000));
      void loadGovernanceAudit(true);
    } catch (failure) {
      setError(errorStatus(failure) === 409 ? "页面治理状态已变化，请重新加载后再复核。" : formatError(failure));
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
    const userIDs = activePresence.map(item => item.user_id);
    if (userIDs.length === 0) return;
    const abort = new AbortController();
    void resolveProfiles(userIDs, abort.signal);
    return () => abort.abort();
  }, [activePresence]);

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (dirty || saveState === "saving" || metadataDirty || metadataSaving || governanceDirty || governanceSaving) event.preventDefault(); };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty, governanceDirty, governanceSaving, metadataDirty, metadataSaving, saveState]);

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
    if (mode !== "history" || !selectedID) return;
    const abort = new AbortController();
    void client.listPageEditHistory(library.id, selectedID, 0, 50, abort.signal).then(page => { if (!abort.signal.aborted) { setEditHistory(page.items); setEditHistoryBefore(page.next_before || 0); setEditHistoryComplete(page.complete); void resolveProfiles(page.items.map(item => item.user_id), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID]);

  useEffect(() => {
    if ((mode !== "comments" && mode !== "activity") || !selectedID) return;
    const abort = new AbortController();
    void client.listPageComments(library.id, selectedID, "", 50, mode === "comments" && unresolvedOnly, abort.signal).then(page => { if (!abort.signal.aborted) { setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete); void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...item.mentioned_user_ids]), abort.signal); } }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, library.id, mode, selectedID, unresolvedOnly]);

  useEffect(() => {
    if (mode !== "suggestions" || !selectedID) return;
    const abort = new AbortController();
    void Promise.all([client.getPage(library.id, selectedID, true, abort.signal), client.listPageSuggestions(library.id, selectedID, abort.signal)]).then(([pageView, page]) => {
      if (abort.signal.aborted) return;
      setView(pageView); viewRef.current = pageView; setTitle(pageView.draft?.title || pageView.page.title); setBody(pageView.draft?.body.content || "");
      setSuggestions(page.items);
      void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.decided_by_user_id || "", ...item.mentioned_user_ids]), abort.signal);
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
    if (mode !== "comments" && mode !== "suggestions") return;
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchLibraryMembers(library.id, memberQuery.trim(), "", 100, abort.signal).then(page => {
      if (abort.signal.aborted) return;
      setMentionCandidates(page.items);
      setMemberProfiles(current => ({ ...current, ...Object.fromEntries(page.items.map(item => [item.user_id, item])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, library.id, memberQuery, mode]);

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
    const items = (children[parent] || []).filter(page => !localFilter || page.title.toLocaleLowerCase().includes(localFilter.toLocaleLowerCase()));
    const visible: { page?: KnowledgePage; parent: string; depth: number; loadMore?: boolean }[] = items.flatMap(page => [{ page, parent, depth }, ...(expanded.has(page.id) ? rows(page.id, depth + 1) : [])]);
    if (!localFilter && children[parent] && childrenComplete[parent] === false) visible.push({ parent, depth, loadMore: true });
    return visible;
  }

  async function createPage(contentType: KnowledgePageContentType) {
    if (!canWrite) return;
    try {
      const parentPageID = selectedID;
      const meta = pageTypeMeta[contentType];
      const value = await client.createPage(library.id, { client_id: crypto.randomUUID(), parent_page_id: parentPageID || undefined, title: meta.title, content_type: contentType }, AbortSignal.timeout(30_000));
      if (parentPageID) setExpanded(current => new Set(current).add(parentPageID));
      setNotice(`已在当前节点下创建${meta.label}，正在编辑。`); editAfterSelectRef.current = value.page.id;
      await loadChildren(value.page.parent_page_id || ""); setSelectedID(value.page.id);
    } catch (failure) { setError(formatError(failure)); }
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
      if (!created.draft) throw Error("新页面没有可写草稿。");
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
      setNotice(`已把“${source.page.title}”复制为${pageTypeMeta[targetType].label}；原页面和历史版本未修改。`);
    } catch (failure) { setError(formatError(failure)); throw failure; }
  }

  async function loadTemplates(signal = AbortSignal.timeout(30_000)) {
    if (!client.listPageTemplates) return;
    const result = await client.listPageTemplates(library.id, "", 100, signal);
    setTemplates(result.items);
  }

  async function openTemplateDialog() {
    if (!client.listPageTemplates || !client.instantiatePageTemplate) return;
    setCreateMenuOpen(false); setTemplateDialogOpen(true); setTemplateVersionOpen("");
    setTemplateTitle(`${view?.page.title || "当前页面"} 模板`); setTemplateDescription(""); setTemplateBusy("list"); setError("");
    try { await loadTemplates(); } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function saveCurrentAsTemplate() {
    if (!selectedID || !client.createPageTemplate || !templateTitle.trim()) return;
    setTemplateBusy("create"); setError("");
    try {
      if (dirty) await saveDraft();
      const created = await client.createPageTemplate(library.id, { client_id: crypto.randomUUID(), source_page_id: selectedID, title: templateTitle.trim(), description: templateDescription.trim() || undefined }, AbortSignal.timeout(30_000));
      await loadTemplates(); setTemplateTitle(`${view?.page.title || "当前页面"} 模板`); setTemplateDescription(""); setNotice(`模板“${created.title}”已保存，共 ${created.node_count} 个页面。`);
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function updateTemplateFromCurrent(template: KnowledgePageTemplate) {
    if (!selectedID || !client.updatePageTemplate) return;
    setTemplateBusy(`update:${template.id}`); setError("");
    try {
      if (dirty) await saveDraft();
      const updated = await client.updatePageTemplate(library.id, template.id, { client_id: crypto.randomUUID(), expected_revision: template.revision, source_page_id: selectedID, title: template.title, description: template.description }, AbortSignal.timeout(30_000));
      await loadTemplates(); setNotice(`模板“${updated.title}”已生成版本 ${updated.latest_version}。`);
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
      setNotice(`已从“${template.title}”版本 ${version} 创建 ${instance.created_page_ids.length} 个独立页面。`);
    } catch (failure) { setError(formatError(failure)); } finally { setTemplateBusy(""); }
  }

  async function createFilePage(file: File) {
    if (!canWrite || importingFile) return;
    const parentPageID = selectedID;
    const title = [...file.name.trim()].slice(0, 256).join("");
    let uploaded: Awaited<ReturnType<KnowledgeClient["uploadDocument"]>> | null = null;
    let created: KnowledgePageView | null = null;
    let saved = false;
    setImportingFile(true); setCreateMenuOpen(false); setError(""); setNotice("正在校验并上传原文件…");
    const signal = AbortSignal.timeout(2 * 60 * 60 * 1000);
    try {
      if (!library.documents_configured) throw Error("当前知识库尚未配置文件存储。");
      if (!title) throw Error("文件名不能为空。");
      if (!file.size || file.size > documentUploadMaxBytes(library)) throw Error("文件大小超过当前知识库上传上限。");
      if (!knowledgeDocumentSupports(library, file.name)) throw Error("当前文件格式不支持入库。");
      const digest = await sha256(file, signal);
      uploaded = await client.uploadDocument({ libraryID: library.id, file, clientID: crypto.randomUUID(), sha256: digest, signal });
      setNotice("原文件已保存，正在创建知识页面…");
      created = await client.createPage(library.id, { client_id: crypto.randomUUID(), parent_page_id: parentPageID || undefined, title, content_type: "file" }, signal);
      await client.setPageAttachment(library.id, created.page.id, uploaded.id, { client_id: crypto.randomUUID(), title, rank: "a" }, signal);
      const content = filePageContent(uploaded.id, title);
      const current = created.draft!;
      created = await client.savePageDraft(library.id, created.page.id, {
        client_id: crypto.randomUUID(), expected_draft_revision: current.draft_revision, expected_page_revision: created.page.revision,
        title, parent_page_id: created.page.parent_page_id, rank: created.page.rank,
        content_schema_version: pageSchemaVersion, content, content_sha256: await pageContentSHA256(content),
      }, signal);
      saved = true;
      if (parentPageID) setExpanded(currentExpanded => new Set(currentExpanded).add(parentPageID));
      await loadChildren(parentPageID, signal);
      setSelectedID(created.page.id); setNotice(`“${title}”已作为${parentPageID ? "当前节点的子" : "根"}知识条目创建。`);
    } catch (failure) {
      if (created && !saved) {
        try { await client.setPageArchived(library.id, created.page.id, true, { client_id: crypto.randomUUID(), expected_revision: created.page.revision }, AbortSignal.timeout(30_000)); } catch { /* Preserve the original error. */ }
      }
      if (uploaded && !saved) {
        try { await client.deleteDocument(library.id, uploaded.id, uploaded.revision, AbortSignal.timeout(30_000)); } catch { /* Background cleanup can reconcile this new upload. */ }
      }
      setNotice(""); setError(formatError(failure));
    } finally {
      setImportingFile(false);
      if (filePageInputRef.current) filePageInputRef.current.value = "";
    }
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
      if (!principal || principal.organization_id !== organizationID || principal.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
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
      setNotice(value.projection_status === "ready" ? "页面权限已生效。" : "本地撤权已立即生效；远端权限投影确认前，本页不会进入搜索结果。");
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
      setNotice("知识条目顺序已更新。");
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
      const copied = await client.copyPage(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_page_id: current.page.parent_page_id, title: `${current.page.title} 副本` }, AbortSignal.timeout(30_000));
      await loadChildren(copied.page.parent_page_id || "");
      setSelectedID(copied.page.id); setNotice("页面已复制为一份新的未发布草稿。");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function authorizeContentAction(operation: "copy" | "print" | "export" | "duplicate") {
    const current = viewRef.current;
    if (!current || !client.authorizePageContentOperation) throw Error("当前宿主未启用页面内容保护。");
    await client.authorizePageContentOperation(library.id, current.page.id, operation, AbortSignal.timeout(30_000));
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
      setNotice("已通过服务端内容策略校验并复制选中内容。");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function copyDraftAfterConflict() {
    try {
      await authorizeContentAction("copy");
      await navigator.clipboard.writeText(body);
      setNotice("已通过服务端内容策略校验并复制草稿正文。");
    } catch (failure) { setError(formatError(failure)); }
  }

  useEffect(() => {
    const beforePrint = () => {
      if (Date.now() <= printAuthorizationRef.current) return;
      document.body.classList.add("knowledge-print-blocked");
      setError("请使用 Ctrl/⌘ + P，由服务端校验当前页面的打印策略后再打印。");
    };
    const afterPrint = () => {
      printAuthorizationRef.current = 0;
      document.body.classList.remove("knowledge-print-blocked");
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
      setNotice(page.state === "archived" ? "页面已恢复。" : "页面已归档并移入回收站，同时立即停止检索引用。");
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
      void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.resolved_by_user_id || "", ...item.mentioned_user_ids]), AbortSignal.timeout(30_000));
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
    void resolveProfiles(page.items.flatMap(item => [item.author_user_id, item.decided_by_user_id || "", ...item.mentioned_user_ids]), AbortSignal.timeout(30_000));
  }

  async function createSuggestion() {
    const current = viewRef.current;
    if (!current?.draft || !commentAnchor || suggestionKind === "insert" && !suggestionText.trim()) return;
    try {
      setSuggestionBusy("create"); setError("");
      await client.createPageSuggestion(library.id, current.page.id, {
        client_id: crypto.randomUUID(), kind: suggestionKind, base_draft_revision: current.draft.draft_revision,
        anchor: { node_id: commentAnchor.nodeID, quote: commentAnchor.quote }, proposed_text: suggestionKind === "insert" ? suggestionText.trim() : undefined,
        comment: suggestionComment.trim() || undefined, mentioned_user_ids: suggestionMentionedUserIDs,
      }, AbortSignal.timeout(30_000));
      setSuggestionText(""); setSuggestionComment(""); setSuggestionMentionedUserIDs([]); setNotice("修订提议已提交，正文还没有被改动。");
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
        client_id: crypto.randomUUID(), expected_revision: suggestion.revision, expected_draft_revision: current.draft.draft_revision, decision,
      }, AbortSignal.timeout(30_000));
      const refreshed = await client.getPage(library.id, current.page.id, true, AbortSignal.timeout(30_000));
      setView(refreshed); viewRef.current = refreshed; setTitle(refreshed.draft?.title || refreshed.page.title); setBody(refreshed.draft?.body.content || "");
      await reloadSuggestions(current.page.id);
      setNotice(decision === "accept" ? "修订已接受并原子写入当前草稿。" : decision === "reject" ? "修订已拒绝。" : "修订已撤回。");
    } catch (failure) { setError(formatError(failure)); }
    finally { setSuggestionBusy(""); }
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
    const parent = replyingTo ? comments.find(comment => comment.id === replyingTo) : undefined;
    const anchor = parent?.anchor.node_id && parent.anchor.quote ? { nodeID: parent.anchor.node_id, quote: parent.anchor.quote } : commentAnchor;
    if (!anchor) { setError("请先在正文中选择一段文字，或点选一个内容块。"); return; }
    try {
      await client.createPageComment(library.id, current.page.id, { client_id: crypto.randomUUID(), parent_comment_id: replyingTo || undefined, published_version: parent?.published_version || current.published.version, anchor: { node_id: anchor.nodeID, quote: anchor.quote }, body: commentBody.trim(), mentioned_user_ids: mentionedUserIDs }, AbortSignal.timeout(30_000));
      setCommentBody(""); setMentionedUserIDs([]); setReplyingTo(""); const page = await client.listPageComments(library.id, current.page.id, "", 50, unresolvedOnly, AbortSignal.timeout(30_000)); setComments(page.items); setCommentAfter(page.next_after || ""); setCommentsComplete(page.complete);
    } catch (failure) { setError(formatError(failure)); }
  }

  function focusComment(comment: KnowledgePageComment) {
    if (comment.anchor.changed || !comment.anchor.node_id) return;
    setCommentFocus(current => ({ nodeID: comment.anchor.node_id!, revision: current.revision + 1 }));
  }

  function beginReply(comment: KnowledgePageComment) {
    const rootID = comment.parent_comment_id || comment.id;
    setReplyingTo(rootID);
    const root = comments.find(item => item.id === rootID) || comment;
    if (!root.anchor.changed && root.anchor.node_id && root.anchor.quote) {
      setCommentAnchor({ nodeID: root.anchor.node_id, quote: root.anchor.quote });
    }
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

  async function toggleCommentReaction(comment: KnowledgePageComment, emoji: string) {
    const current = comment.reactions?.find(reaction => reaction.emoji === emoji);
    try {
      const updated = await client.setPageCommentReaction(library.id, comment.page_id, comment.id, { client_id: crypto.randomUUID(), emoji, active: !current?.reacted }, AbortSignal.timeout(30_000));
      setComments(items => items.map(item => item.id === updated.id ? updated : item));
    } catch (failure) { setError(formatError(failure)); }
  }

  async function assignCommentTask(comment: KnowledgePageComment) {
    if (!comment.anchor.node_id || comment.anchor.changed || !canWrite) return;
    const proposedAssignees = [...new Set(comment.mentioned_user_ids.length > 0 ? comment.mentioned_user_ids : currentUserID ? [currentUserID] : [])];
    const existing = tasks.find(task => task.source_block_id === comment.anchor.node_id);
    try {
      const updated = existing ? await client.updatePageTask(library.id, comment.page_id, existing.id, {
        client_id: crypto.randomUUID(), expected_revision: existing.revision, title: existing.title, status: existing.status,
        assignee_user_ids: [...new Set([...existing.assignee_user_ids, ...proposedAssignees])], due_at: existing.due_at, reminder_at: existing.reminder_at, priority: existing.priority,
      }, AbortSignal.timeout(30_000)) : await client.createPageTask(library.id, comment.page_id, {
        client_id: crypto.randomUUID(), source_block_id: comment.anchor.node_id,
        title: Array.from(comment.body || comment.anchor.quote || "评论任务").slice(0, 480).join(""), assignee_user_ids: proposedAssignees, priority: "none",
      }, AbortSignal.timeout(30_000));
      setTasks(items => [...items.filter(item => item.id !== updated.id), updated]);
      tasksRef.current = [...tasksRef.current.filter(item => item.id !== updated.id), updated];
      setNotice(`已将评论关联到任务“${updated.title}”${updated.assignee_user_ids.length ? `，指派给 ${updated.assignee_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、")}` : ""}。`);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function uploadPageAttachment(file: File) {
    const current = viewRef.current;
    if (!current?.draft || !canWrite) throw Error("当前页面不可上传附件。");
    if (!library.documents_configured) throw Error("当前知识库尚未配置文件存储。");
    if (!file.size || file.size > documentUploadMaxBytes(library)) throw Error("文件大小超过当前知识库上传上限。");
    if (!knowledgeDocumentSupports(library, file.name)) throw Error("当前文件格式不支持入库。");
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
      setNotice("附件已通过受权文件接口上传并关联到当前页面。图片引用会在草稿保存后生效。");
    } catch (failure) { setError(formatError(failure)); }
  }

  async function uploadEditorFile(file: File) {
    setError("");
    try {
      const document = await uploadPageAttachment(file);
      setNotice(`“${file.name}”已通过受权文件接口上传并插入页面。`);
      return { props: { name: file.name, caption: "", url: `knowledge-document:${document.id}` } };
    } catch (failure) {
      setError(formatError(failure));
      throw failure;
    }
  }

  async function readEditorFile(reference: string) {
    const match = /^knowledge-document:(kdoc_[a-f0-9]{32})$/.exec(reference);
    if (!match) throw Error("文件引用无效。");
    const response = await client.readDocumentContent(library.id, match[1], { signal: AbortSignal.timeout(2 * 60 * 1000) });
    if (!response.ok) throw Error(`文件读取失败（HTTP ${response.status}）。`);
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
    if ((aiOperation === "write" || aiOperation === "answer") && !aiPrompt.trim()) { setAIFailure("续写和问答需要填写明确要求。"); return; }
    if (aiOperation === "translate" && !aiLanguage.trim()) { setAIFailure("翻译需要选择目标语言。"); return; }
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
      if (execution.state === "pending" || execution.state === "running") throw new Error("AI 执行超时，请稍后重试。");
      if (execution.state === "failed") setAIFailure(`AI 执行失败：${execution.error_code || "provider_failed"}`);
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
      setNotice("AI 候选已由你确认并追加到当前草稿；发布前仍可继续修改。");
    } catch (failure) { setAIFailure(formatError(failure)); }
    finally { setAIBusy(false); }
  }

  const treeRows = useMemo(() => rows(), [children, expanded, localFilter]);
  const visibleCollectionItems = useMemo(() => collectionItems.filter(item => !localFilter || item.page.title.toLocaleLowerCase().includes(localFilter.toLocaleLowerCase())), [collectionItems, localFilter]);
  function collectionItemDetail(item: KnowledgePageCollectionItem) {
    const timestamp = navigationSection === "favorites" ? item.state.favorite_at
      : navigationSection === "subscribed" ? item.state.subscribed_at
      : navigationSection === "recent_views" ? item.state.last_viewed_at
      : navigationSection === "recent_edits" ? item.state.last_edited_at
      : navigationSection === "trash" ? item.page.updated_at : undefined;
    const label = pageTypeMeta[item.page.content_type].label;
    return timestamp && Date.parse(timestamp) > 0 ? `${label} · ${new Date(timestamp).toLocaleString()}` : label;
  }
  const activities = useMemo(() => [
    ...versions.map(version => ({ key: `version-${version.version}`, at: version.published_at, title: `发布了版本 ${version.version}`, detail: `${memberProfiles[version.published_by_user_id]?.display_name || "账号不可用"} · ${version.publish_note || version.body.summary || "无发布说明"}` })),
    ...comments.map(comment => ({ key: `comment-${comment.id}-${comment.revision}`, at: comment.updated_at, title: comment.deleted ? "删除了评论" : comment.resolved ? "解决了评论" : comment.revision > 1 ? "更新了评论" : comment.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${memberProfiles[comment.author_user_id]?.display_name || "账号不可用"} · 版本 ${comment.published_version}` })),
    ...tasks.map(task => ({ key: `task-${task.id}-${task.revision}`, at: task.updated_at, title: task.status === "done" ? "完成了任务" : task.status === "canceled" ? "取消了任务" : task.revision > 1 ? "更新了任务" : "创建了任务", detail: `${task.title} · ${task.assignee_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、") || "未指派"}` })),
  ].sort((left, right) => right.at.localeCompare(left.at)), [comments, memberProfiles, tasks, versions]);
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
          client_id: crypto.randomUUID(), source_block_id: blockID, title: taskTitle.trim() || "待办任务",
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
        setMemberProfiles(current => ({ ...current, ...Object.fromEntries(active.map(item => [item.user_id, item])) }));
        return active;
      },
      memberName: userID => memberProfiles[userID]?.display_name || userID,
    };
  }, [canWrite, client, currentUserID, formatError, library.id, memberProfiles, mode, selectedID, tasks, tasksReady, view?.page.state]);
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
          client_id: crypto.randomUUID(), source_block_id: blockID, question: question.trim() || "请选择一个选项",
          options: ["选项 1", "选项 2"], multiple: false,
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
  const dynamicBlockRuntime = useMemo<KnowledgeDynamicBlockRuntime>(() => ({
    currentPageID: selectedID,
    canCreateChild: Boolean(canWrite && mode === "edit" && view?.draft && view.page.content_type === "document" && client.createPageReference),
    async listChildPages(limit, signal) {
      const page = await client.listPages(library.id, selectedID, "", Math.max(1, Math.min(limit, 50)), false, signal);
      return page.items.map(item => ({ pageID: item.id, title: item.title, contentType: item.content_type, aliases: [], path: [{ pageID: selectedID, title: view?.page.title || "当前页面" }, { pageID: item.id, title: item.title }] }));
    },
    searchPages: mentionRuntime.searchPages,
    resolvePage: mentionRuntime.resolvePage,
    async listPageVersions(pageID, signal) {
      return (await client.listPageVersions(library.id, pageID, 0, 100, signal)).items;
    },
    async createChildReference(input) {
      const current = viewRef.current;
      if (!current?.draft || current.page.content_type !== "document" || !client.createPageReference) throw Error("当前页面不支持创建内嵌子页面。");
      setError("");
      try {
        let expectedDraftRevision = current.draft.draft_revision;
        let parentContent = input.parentContent;
        if (collaboration.available) {
          const confirmed = await collaboration.flush();
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
        if (!result.parent.draft) throw Error("父页面草稿不可用。");
        viewRef.current = result.parent;
        setView(result.parent);
        setTitle(result.parent.draft.title);
        setBody(result.parent.draft.body.content);
        editRef.current = { title: result.parent.draft.title, body: result.parent.draft.body.content };
        setDirty(false); setSaveState("saved"); setSaveConflict(null); setPublishState("idle");
        setChildren(currentChildren => Object.fromEntries(Object.entries(currentChildren).map(([parentID, pages]) => [parentID, pages.map(page => page.id === current.page.id ? { ...page, has_children: true } : page)])));
        setExpanded(currentExpanded => new Set(currentExpanded).add(current.page.id));
        await loadChildren(current.page.id, AbortSignal.timeout(30_000));
        setEditorEpoch(value => value + 1);
        if (collaboration.available) collaboration.reconnect();
        setNotice(`已创建子${pageTypeMeta[input.contentType].label}并插入当前文档。`);
      } catch (failure) {
        setError(formatError(failure));
        throw failure;
      }
    },
    renderReference(reference) {
      return <KnowledgeEmbeddedReference client={client} library={library} currentUserID={currentUserID} canWrite={canWrite} formatError={formatError} reference={reference} onOpen={pageID => { setMode("read"); setSelectedID(pageID); }} />;
    },
    async listPageActivity(limit, signal) {
      const [pageVersions, pageComments, pageTasks] = await Promise.all([
        client.listPageVersions(library.id, selectedID, 0, limit, signal),
        client.listPageComments(library.id, selectedID, "", limit, false, signal),
        client.listPageTasks(library.id, selectedID, signal),
      ]);
      return [
        ...pageVersions.items.map(item => ({ id: `version-${item.version}`, title: `发布了版本 ${item.version}`, detail: `${item.published_by_user_id} · ${item.publish_note || item.body.summary || "无发布说明"}`, at: item.published_at })),
        ...pageComments.items.map(item => ({ id: `comment-${item.id}-${item.revision}`, title: item.deleted ? "删除了评论" : item.resolved ? "解决了评论" : item.revision > 1 ? "更新了评论" : item.parent_comment_id ? "回复了评论" : "发表了评论", detail: `${item.author_user_id} · 版本 ${item.published_version}`, at: item.updated_at })),
        ...pageTasks.items.map(item => ({ id: `task-${item.id}-${item.revision}`, title: item.status === "done" ? "完成了任务" : item.status === "canceled" ? "取消了任务" : item.revision > 1 ? "更新了任务" : "创建了任务", detail: `${item.title} · ${item.updated_by_user_id}`, at: item.updated_at })),
      ].sort((left, right) => right.at.localeCompare(left.at)).slice(0, limit);
    },
    resolveApplicationCard: client.resolveApplicationCard ? (input, signal) => client.resolveApplicationCard!(library.id, selectedID, input, signal) : undefined,
    openPage(pageID) {
      setMode("read");
      setSelectedID(pageID);
    },
  }), [canWrite, client, collaboration, currentUserID, formatError, library, mentionRuntime, mode, selectedID, view?.draft, view?.page.content_type]);
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
  const collaborationStateLabel = ({ unavailable: "标准草稿模式", connecting: "正在连接协作会话", connected: "在线状态已同步", syncing: "正在合并更改", reconnecting: "正在恢复会话", error: "协作连接中断" })[presenceState];
  // Editors backed by imperative canvases still need a clean mount when the
  // server returns a new canonical draft revision. React-owned editors reconcile
  // body changes in place; forcing them to remount would discard live selection,
  // the active presentation slide, or the current form designer tab.
  const remountEditorOnDraftRevision = view?.page.content_type !== "document"
    && view?.page.content_type !== "form"
    && view?.page.content_type !== "presentation"
    && view?.page.content_type !== "mind_note"
    && view?.page.content_type !== "mind_map"
    && view?.page.content_type !== "flowchart";
  const aiAvailable = view?.page.content_type === "document" && canWrite && !!client.createAIExecution && !!client.getAIExecution && !!client.confirmAIExecution;
  const workbenchEditorOpen = Boolean(view && mode === "edit" && workbenchPageTypes.has(view.page.content_type));
  return <section className={`knowledge-pages${embedded ? " is-embedded" : ""}`} aria-label="知识页面">
    {!embedded && <header className="knowledge-section-heading">
      <div className="knowledge-section-identity"><span className="knowledge-section-icon" aria-hidden="true"><BookOpen size={18} /></span><span><small>Knowledge workspace</small><h3>知识页面</h3><p>协作编辑、版本发布与访问治理集中在一个工作区。</p></span></div>
      {view && <span className={`knowledge-index-state is-${view.page.projection_status || "none"}`}><span aria-hidden="true" />{projectionLabel(view.page)}</span>}
    </header>}
    <div className="knowledge-pages-layout">
      <aside className="knowledge-page-tree" onDragOver={event => { if (canWrite) event.preventDefault(); }} onDrop={() => { if (dragged && dragged.parent_page_id) void move(dragged, ""); setDragged(null); setTreeDropTarget(null); }}>
        <div className="knowledge-tree-toolbar">
          <label><Search size={14} aria-hidden="true" /><input aria-label={`筛选${pageNavigationLabels[navigationSection]}`} value={localFilter} onChange={event => setLocalFilter(event.target.value)} placeholder={`搜索${pageNavigationLabels[navigationSection]}`} /></label>
          {canWrite && <div ref={createMenuAnchorRef} className="knowledge-create-menu-wrap"><Button aria-label="新建知识条目" title="新建知识条目" aria-haspopup="menu" aria-expanded={createMenuOpen} disabled={disabled} onClick={() => setCreateMenuOpen(value => !value)}><Plus size={16} /></Button>{createMenuOpen && typeof document !== "undefined" && createPortal(<div ref={createMenuRef} className="knowledge-create-menu" role="menu" aria-label="新建知识条目类型" style={createMenuPosition}>
            {client.listPageTemplates && client.instantiatePageTemplate && <button className="knowledge-create-menu-template" role="menuitem" onClick={() => void openTemplateDialog()}><LayoutTemplate size={18} /><span><strong>从模板创建</strong><small>复用完整页面子树，并保留独立内容</small></span></button>}
            {nativePageTypes.map(type => <button key={type} role="menuitem" onClick={() => { setCreateMenuOpen(false); void createPage(type); }}><PageTypeIcon type={type} size={18} /><span><strong>{pageTypeMeta[type].label}</strong><small>{pageTypeMeta[type].description}</small></span></button>)}
            {library.documents_configured && importPageTypes.map(definition => <button key={`import-${definition.id}`} role="menuitem" disabled={importingFile} onClick={() => { setCreateMenuOpen(false); if (definition.importer?.kind === "document-upload") filePageInputRef.current?.click(); }}><Upload size={18} /><span><strong>上传及导入{definition.label}</strong><small>在当前节点下创建{definition.label}页面</small></span></button>)}
          </div>, document.body)}</div>}
          <input ref={filePageInputRef} className="knowledge-visually-hidden" type="file" accept={knowledgeDocumentAccept(library)} disabled={!canWrite || importingFile} onChange={event => { const file = event.target.files?.[0]; if (file) void createFilePage(file); }} />
          {onManage && <Button aria-label="管理知识库" title="管理知识库" disabled={disabled} onClick={onManage}><Settings size={15} /></Button>}
        </div>
        <nav className="knowledge-page-collections" aria-label="页面导航">
          <button type="button" aria-pressed={navigationSection === "all"} onClick={() => { setNavigationSection("all"); setLocalFilter(""); }}><BookOpen size={14} /><span>全部</span></button>
          <button type="button" aria-pressed={navigationSection === "shortcuts"} onClick={() => { setNavigationSection("shortcuts"); setLocalFilter(""); }}><Pin size={14} /><span>快捷</span></button>
          <button type="button" aria-pressed={navigationSection === "favorites"} onClick={() => { setNavigationSection("favorites"); setLocalFilter(""); }}><Star size={14} /><span>收藏</span></button>
          <details className="knowledge-page-collection-more">
            <summary aria-label="更多页面筛选"><MoreHorizontal size={14} /><span>{["recent_views", "recent_edits", "subscribed", "trash"].includes(navigationSection) ? pageNavigationLabels[navigationSection] : "更多"}</span><ChevronDown size={12} /></summary>
            <div role="menu" aria-label="更多页面筛选">
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "recent_views"} onClick={event => { setNavigationSection("recent_views"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Clock3 size={14} /><span>最近访问</span></button>
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "recent_edits"} onClick={event => { setNavigationSection("recent_edits"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Pencil size={14} /><span>最近编辑</span></button>
              <button type="button" role="menuitemradio" aria-checked={navigationSection === "subscribed"} onClick={event => { setNavigationSection("subscribed"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Bell size={14} /><span>订阅页面</span></button>
              {canWrite && <><hr /><button type="button" role="menuitemradio" aria-checked={navigationSection === "trash"} onClick={event => { setNavigationSection("trash"); setLocalFilter(""); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Trash2 size={14} /><span>回收站</span></button></>}
            </div>
          </details>
        </nav>
        <div className="knowledge-tree-label"><span>{pageNavigationLabels[navigationSection]}</span>{navigationSection !== "all" && <button type="button" aria-label={`刷新${pageNavigationLabels[navigationSection]}`} title="刷新" disabled={collectionLoading} onClick={() => void refreshCollection(navigationSection)}><RefreshCw className={collectionLoading ? "knowledge-spin" : undefined} size={12} /></button>}</div>
        {navigationSection === "all" ? <div role="tree" aria-label="知识条目树">{treeRows.map(({ page, parent, depth, loadMore }, index) => loadMore ? <button key={`more-${parent}-${index}`} className="knowledge-tree-more" style={{ marginInlineStart: `${depth * 16 + 24}px` }} onClick={() => void loadChildren(parent, AbortSignal.timeout(30_000), true)}>加载更多</button> : page && <div key={page.id} className={`knowledge-tree-row${dragged?.id === page.id ? " is-dragging" : ""}${treeDropTarget?.pageID === page.id ? ` is-drop-${treeDropTarget.placement}` : ""}`} style={{ paddingInlineStart: `${depth * 16 + 4}px` }} draggable={canWrite} title={canWrite ? "按住并拖动以调整位置" : undefined} onDragStart={event => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", page.id); setSelectedID(page.id); setDragged(page); setTreeDropTarget(null); }} onDragEnd={() => { setDragged(null); setTreeDropTarget(null); }} onDragOver={event => { if (!canWrite || !dragged || dragged.id === page.id) return; event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = "move"; setTreeDropTarget({ pageID: page.id, placement: dragPlacement(event, parent) }); }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTreeDropTarget(current => current?.pageID === page.id ? null : current); }} onDrop={event => { event.preventDefault(); event.stopPropagation(); const placement = treeDropTarget?.pageID === page.id ? treeDropTarget.placement : dragPlacement(event, parent); if (dragged) void dropTreePage(dragged, page, placement); setDragged(null); setTreeDropTarget(null); }}>
          {hasExpandableChildren(page) ? <button className="knowledge-tree-toggle" aria-label={expanded.has(page.id) ? "折叠子页面" : "展开子页面"} onClick={() => void toggle(page)}>{expanded.has(page.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button> : <span className="knowledge-tree-toggle-spacer" aria-hidden="true" />}
          <button ref={element => { treeButtonRefs.current[page.id] = element; }} role="treeitem" aria-selected={selectedID === page.id} tabIndex={selectedID === page.id ? 0 : -1} onKeyDown={event => { if (event.key === "ArrowRight" && !expanded.has(page.id) && hasExpandableChildren(page)) { event.preventDefault(); void toggle(page); } else if (event.key === "ArrowLeft") { event.preventDefault(); if (expanded.has(page.id)) void toggle(page); else if (parent) focusTreePage(parent); } else if (event.key === "ArrowDown") { event.preventDefault(); const next = treeRows.slice(index + 1).find(row => row.page)?.page; if (next) focusTreePage(next.id); } else if (event.key === "ArrowUp") { event.preventDefault(); const previous = treeRows.slice(0, index).reverse().find(row => row.page)?.page; if (previous) focusTreePage(previous.id); } else if (event.key === "Enter") { setSelectedID(page.id); } }} onClick={() => setSelectedID(page.id)}><PageTypeIcon type={page.content_type} size={14} /><span>{page.title}</span></button>
        </div>)}{!loading && treeRows.length === 0 && <p className="knowledge-subtle">没有知识条目。</p>}</div> : <div className="knowledge-collection-list" role="list">
          {visibleCollectionItems.map(item => <button key={item.page.id} type="button" role="listitem" aria-current={selectedID === item.page.id ? "page" : undefined} onClick={() => setSelectedID(item.page.id)}><PageTypeIcon type={item.page.content_type} size={15} /><span><strong>{item.page.title}</strong><small>{collectionItemDetail(item)}</small></span>{item.page.state === "archived" && <Trash2 size={13} aria-label="已归档" />}</button>)}
          {collectionLoading && collectionItems.length === 0 && <p role="status" className="knowledge-subtle"><LoaderCircle className="knowledge-spin" size={14} />正在加载…</p>}
          {!collectionLoading && visibleCollectionItems.length === 0 && <p className="knowledge-subtle">{localFilter ? "没有匹配页面。" : `${pageNavigationLabels[navigationSection]}中还没有页面。`}</p>}
          {!collectionComplete && <button type="button" className="knowledge-tree-more" disabled={collectionLoading} onClick={() => void loadMoreCollection()}>{collectionLoading ? "加载中…" : "加载更多"}</button>}
        </div>}
      </aside>
		<article ref={pageFindSurfaceRef} onCopyCapture={event => void controlledPageCopy(event)} className={`knowledge-page-main${mode === "outline" || mode === "comments" || mode === "suggestions" || mode === "activity" || mode === "access" || mode === "permissions" || mode === "governance" ? " has-side-panel" : ""}${workbenchEditorOpen ? " is-workbench" : ""}`}>
        {notice && <p role="status" className="knowledge-notice">{notice}</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}
		<KnowledgeDynamicWatermark governance={view?.governance} />
        {pendingMove && <section className="knowledge-confirm knowledge-move-impact" role="dialog" aria-label="确认页面权限影响"><h3>移动会改变页面权限</h3><p>将影响该子树中的 {pendingMove.impact.affected_pages} 个页面，并改变 {pendingMove.impact.changed_subjects.length} 个用户或组织的有效访问。</p>{pendingMove.impact.changed_subjects.length > 0 && <p className="knowledge-subtle">涉及主体：{pendingMove.impact.changed_subjects.map(subjectLabel).join("、")}</p>}<div className="knowledge-actions"><Button className="danger" onClick={() => void commitMove(pendingMove.page, pendingMove.parentPageID, pendingMove.impact.token)}>确认移动并更新继承</Button><Button onClick={() => setPendingMove(null)}>取消移动</Button></div></section>}
        {!view && !loading ? <EmptyState><FilePlus2 size={28} /><h3>选择或新建页面</h3></EmptyState> : null}
        {view && <>
          <nav className="knowledge-page-breadcrumbs" aria-label="页面路径">{view.breadcrumbs.map((item, index) => <span key={item.page_id}>{index > 0 && <ChevronRight size={12} aria-hidden="true" />}<button onClick={() => setSelectedID(item.page_id)}>{item.title}</button></span>)}</nav>
          <header className={`knowledge-page-title${mode === "edit" ? " is-editing" : ""}`}>
            <div className="knowledge-page-heading"><div className="knowledge-page-heading-line">{mode !== "edit" && <h2 className={canWrite && view.page.state === "active" ? "is-editable" : undefined} title={canWrite && view.page.state === "active" ? "双击编辑标题" : undefined} onDoubleClick={() => { if (canWrite && view.page.state === "active") { setMode("edit"); window.setTimeout(() => titleInputRef.current?.select()); } }}>{mode === "suggestions" ? view.draft?.title || view.page.title : view.published?.title || view.page.title}</h2>}<KnowledgeClassificationBadge governance={view.governance} /></div><p>{mode === "suggestions" && view.draft ? `草稿 revision ${view.draft.draft_revision}` : `版本 ${view.page.published_version || "未发布"}`}<span aria-hidden="true"> · </span>{mode === "suggestions" && view.draft ? "修订提议基于当前草稿" : view.published ? `${memberProfiles[view.published.published_by_user_id]?.display_name || "账号不可用"} 发布于 ${new Date(view.published.published_at).toLocaleString()}` : "仅草稿"}</p>
              {metadata && (metadataDirty || metadata.tags.length > 0 || metadata.aliases.length > 0 || metadata.related_page_ids.length > 0 || metadata.owner_user_id || metadata.status || metadata.next_review_at) && <div className="knowledge-page-metadata-summary" aria-label="页面属性摘要">
                {metadataDirty && <span className="is-pending">未保存</span>}
                {metadata.status && <span className={`is-status-${metadata.status}`}><i aria-hidden="true" />{pageStatusLabels[metadata.status]}</span>}
                {metadata.owner_user_id && <span><Users size={12} />负责人 {memberProfiles[metadata.owner_user_id]?.display_name || metadata.owner_user_id}</span>}
                {metadata.next_review_at && <span><CalendarClock size={12} />复核 {new Date(metadata.next_review_at).toLocaleString()}</span>}
                {metadata.aliases.map(alias => <span key={`alias-${alias}`}><Share2 size={11} />别名 {alias}</span>)}
                {metadata.related_page_ids.length > 0 && <span><Link2 size={11} />{metadata.related_page_ids.length} 个关联页面</span>}
                {metadata.tags.map(tag => <span key={tag} className="is-tag"><Tags size={11} />{tag}</span>)}
              </div>}
            </div>
            <div className="knowledge-page-heading-actions">
              {mode === "edit" && presenceAvailable && <details className="knowledge-presence-details"><summary aria-label={`${activeOnlineUsers} 人在线编辑`}><div className="knowledge-avatar-stack">{collaborators.slice(0, 4).map(person => <span key={person.userID} title={memberProfiles[person.userID]?.display_name || person.userID} style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{(memberProfiles[person.userID]?.display_name || person.userID).slice(0, 1).toUpperCase()}</span>)}</div><strong>{activeOnlineUsers} 人在线</strong><ChevronDown size={13} /></summary><aside className="knowledge-collaboration-popover" aria-label="在线协作详情">
                <header><div><Users size={17} /><strong>在线协作</strong></div><span>{activeOnlineUsers} 人</span></header>
                <section className="knowledge-merge-strategy"><GitMerge size={17} /><div><strong>内容冲突自动收敛</strong><p>{collaboration.available ? "正文由 Yjs 按内容块与富文本节点合并；服务端串行确认时钟、校验 Block JSON，并持久化完整检查点。" : "图形由服务端按节点、连线和画布结构校验目标哈希后合并；不同目标可并行写入，同一目标的过期修改会明确冲突。"}</p></div></section>
                {collaboration.available && collaboration.mergeCount > 0 && <p className="knowledge-merge-event"><Check size={14} />已自动合并 {collaboration.mergeCount} 个远端更新{collaboration.mergedUserIDs.length > 0 ? `，来自 ${collaboration.mergedUserIDs.map(id => memberProfiles[id]?.display_name || id).join("、")}` : ""}</p>}
                <div className="knowledge-collaborator-list">{collaborators.map(person => { const profile = memberProfiles[person.userID]; const name = profile?.display_name || person.userID; const position = person.selectionBlockID ? `${nativeAwareness.available ? "选中目标" : "选区"} ${person.cursorBlockID.slice(0, 8) || "起点"} → ${person.selectionBlockID.slice(0, 8)}` : person.cursorBlockID ? `${nativeAwareness.available ? "选中" : "光标在内容块"} ${person.cursorBlockID.slice(0, 8)}` : "正在查看"; return <div className="knowledge-collaborator" key={person.userID}><span className="knowledge-collaborator-avatar" style={{ "--collaborator-color": collaboratorColor(person.userID) } as CSSProperties}>{name.slice(0, 1).toUpperCase()}<i /></span><span><strong>{name}{person.userID === presenceUserID && <em>你</em>}</strong><small>{position}{person.sessions > 1 ? ` · ${person.sessions} 个设备` : ""}</small></span><time dateTime={person.lastSeenAt}>{recentActivityLabel(person.lastSeenAt)}</time></div>; })}</div>
                <footer><span><Wifi size={13} />{collaborationStateLabel}</span>{collaboration.available && collaboration.state === "error" && <Button onClick={collaboration.reconnect}><RefreshCw size={13} />重新连接</Button>}</footer>
              </aside></details>}
              {mode !== "edit" && canWrite && view.page.state === "active" && <Button className="primary" onClick={() => { setMode("edit"); window.setTimeout(() => titleInputRef.current?.select()); }}><Pencil size={14} />编辑</Button>}
            </div>
          </header>
          <div className="knowledge-page-toolbar">
            <div className="knowledge-view-tabs" role="tablist" aria-label="页面视图">
              <button role="tab" aria-selected={mode === "read"} onClick={() => setMode("read")}><BookOpen size={14} />阅读</button>
              {canWrite && view.page.state === "active" && <button role="tab" aria-selected={mode === "edit"} onClick={() => setMode("edit")}><Pencil size={14} />编辑</button>}
              {view.page.content_type === "document" && <button role="tab" aria-selected={mode === "suggestions"} onClick={() => setMode("suggestions")}><GitPullRequest size={14} />修订</button>}
              <button role="tab" aria-selected={mode === "history"} onClick={() => setMode("history")}><Clock3 size={14} />历史</button>
              <button role="tab" aria-selected={mode === "comments"} onClick={() => setMode("comments")}><MessageSquare size={14} />评论</button>
              <button role="tab" aria-selected={mode === "activity"} onClick={() => setMode("activity")}><Activity size={14} />活动</button>
            </div>
            <div className="knowledge-page-tools">
				<Button aria-pressed={pageFindOpen} aria-label="在当前页面查找" title="在当前页面查找（⌘/Ctrl + F）" onClick={() => { setPageFindOpen(true); window.setTimeout(() => pageFindInputRef.current?.select()); }}><Search size={15} /></Button>
              {personalState && view.page.state === "active" && <>
                <Button aria-label={personalState.favorite ? "取消收藏" : "收藏页面"} aria-pressed={personalState.favorite} title={personalState.favorite ? "取消收藏" : "收藏页面"} disabled={personalStateSaving} onClick={() => void updatePersonalState({ favorite: !personalState.favorite }, personalState.favorite ? "已取消收藏。" : "已收藏页面。") }><Star size={15} fill={personalState.favorite ? "currentColor" : "none"} /></Button>
                <Button aria-label={personalState.subscribed ? "取消订阅" : "订阅页面"} aria-pressed={personalState.subscribed} title={personalState.subscribed ? "取消订阅" : "订阅页面"} disabled={personalStateSaving} onClick={() => void updatePersonalState({ subscribed: !personalState.subscribed }, personalState.subscribed ? "已取消订阅。" : "已订阅页面更新。") }><Bell size={15} fill={personalState.subscribed ? "currentColor" : "none"} /></Button>
                <Button aria-label={personalState.shortcut_rank ? "移出快捷入口" : "添加到快捷入口"} aria-pressed={!!personalState.shortcut_rank} title={personalState.shortcut_rank ? "移出快捷入口" : "添加到快捷入口"} disabled={personalStateSaving} onClick={() => void updatePersonalState({ shortcutRank: personalState.shortcut_rank ? "" : `${Date.now().toString().padStart(20, "0")}:${crypto.randomUUID()}` }, personalState.shortcut_rank ? "已移出快捷入口。" : "已添加到快捷入口。") }><Pin size={15} fill={personalState.shortcut_rank ? "currentColor" : "none"} /></Button>
              </>}
              {view.page.content_type === "document" && <Button aria-pressed={mode === "outline"} title="页面大纲" onClick={() => setMode("outline")}><ListTree size={15} /></Button>}
              {aiAvailable && <Button aria-pressed={aiOpen} aria-label="AI 写作助手" title="AI 写作助手" onClick={() => { setMode("edit"); setAISourceScope(view.published ? "published" : "draft"); setAIOpen(true); setAIFailure(""); }}><Sparkles size={15} /></Button>}
              <Button aria-pressed={mode === "metadata"} aria-label="页面属性" title="页面属性" onClick={() => setMode("metadata")}><Tags size={15} /></Button>
              <Button aria-pressed={mode === "references"} aria-label="页面引用与反向链接" title="页面引用与反向链接" onClick={() => setMode("references")}><Link2 size={15} /></Button>
              <Button aria-pressed={mode === "relationships"} aria-label="知识关系图" title="关联页面与知识关系图" onClick={() => setMode("relationships")}><Share2 size={15} /></Button>
              {library.role === "manager" && <Button aria-pressed={mode === "access"} title="访问说明" onClick={() => setMode("access")}><ShieldCheck size={15} /></Button>}
              {library.role === "manager" && client.getPageAccess && client.setPageAccess && <Button aria-pressed={mode === "permissions"} title="页面权限" onClick={() => setMode("permissions")}><Users size={15} /></Button>}
              {(library.role === "manager" || canReviewGovernance) && <Button aria-pressed={mode === "governance"} aria-label="页面治理" title="页面治理与内容保护" onClick={() => setMode("governance")}><LockKeyhole size={15} /></Button>}
              {canWrite && <Button title="复制页面" onClick={() => void copyCurrentPage()}><Copy size={15} /></Button>}
              {canWrite && <Button title={view.page.state === "archived" ? "恢复页面" : "归档页面"} onClick={() => void archive(view.page)}><MoreHorizontal size={15} /></Button>}
            </div>
          </div>
			{aiOpen && aiAvailable && <div className="knowledge-ai-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !aiBusy) setAIOpen(false); }}><section className="knowledge-ai-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-ai-title">
              <header><div><span className="knowledge-ai-icon" aria-hidden="true"><Sparkles size={18} /></span><div><h3 id="knowledge-ai-title">AI 写作助手</h3><p>只读取下方锁定的页面快照，结果不会自动改写正文。</p></div></div><Button aria-label="关闭 AI 写作助手" title="关闭" disabled={aiBusy} onClick={() => { aiRequestAbortRef.current?.abort(); setAIOpen(false); }}><X size={16} /></Button></header>
              <div className="knowledge-ai-form">
                <label><span>能力</span><select value={aiOperation} disabled={aiBusy} onChange={event => { setAIOperation(event.target.value as KnowledgeAIOperation); setAIExecution(null); setAIFailure(""); }}>{Object.entries(aiOperationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label><span>内容来源</span><select value={aiSourceScope} disabled={aiBusy} onChange={event => { setAISourceScope(event.target.value as KnowledgeAISourceScope); setAIExecution(null); setAIFailure(""); }}><option value="published" disabled={!view.published}>当前已发布版本{view.published ? `（版本 ${view.published.version}）` : "（暂无）"}</option><option value="draft" disabled={!collaboration.ready}>当前编辑会话草稿{collaboration.ready ? `（revision ${collaboration.draftRevision}）` : "（连接中）"}</option></select></label>
                {aiOperation === "translate" && <label><span>目标语言</span><input value={aiLanguage} maxLength={64} disabled={aiBusy} onChange={event => setAILanguage(event.target.value)} /></label>}
                <label className="knowledge-ai-prompt"><span>{aiOperation === "answer" ? "问题" : "补充要求"}</span><textarea rows={4} maxLength={8000} value={aiPrompt} disabled={aiBusy} onChange={event => setAIPrompt(event.target.value)} placeholder={aiOperation === "write" ? "例如：继续补充验收步骤" : aiOperation === "answer" ? "输入要基于当前页面回答的问题" : "可选：说明语气、长度或重点"} /></label>
              </div>
              {aiExecution && <article className={`knowledge-ai-execution is-${aiExecution.state}`}>
                <header><strong>{aiStateLabels[aiExecution.state]}</strong><span>尝试 {aiExecution.attempt} 次 · revision {aiExecution.revision}</span></header>
                <dl><div><dt>来源</dt><dd>{aiExecution.source.scope === "published" ? `已发布版本 ${aiExecution.source.version}` : `编辑会话草稿 revision ${aiExecution.source.draft_revision}`}</dd></div><div><dt>页面</dt><dd>{aiExecution.source.title}</dd></div><div><dt>内容校验</dt><dd><code>{aiExecution.source.content_sha256.slice(0, 16)}</code></dd></div>{aiExecution.provider && <div><dt>模型</dt><dd>{aiExecution.provider} / {aiExecution.model}</dd></div>}</dl>
                {aiExecution.result && <div className="knowledge-ai-result"><strong>候选结果</strong><pre>{aiExecution.result}</pre></div>}
                {aiExecution.state === "confirmed" && <p className="knowledge-ai-confirmed"><Check size={15} />你已确认；内容已通过当前协作会话追加到草稿，尚未发布。</p>}
              </article>}
              {aiFailure && <p className="knowledge-ai-error" role="alert">{aiFailure}</p>}
              <footer><p>{!collaboration.ready ? "正在建立受权编辑会话，连接完成后才能执行和确认。" : "确认时会再次复核会话、权限、来源 revision 与 hash；任何变化都会拒绝写回。"}</p><div><Button disabled={aiBusy} onClick={() => { setAIExecution(null); setAIFailure(""); }}>清空</Button>{aiExecution?.state === "completed" ? <Button className="primary" disabled={aiBusy || !collaboration.ready} onClick={() => void confirmAndInsertAI()}><Check size={14} />确认并追加到草稿</Button> : aiExecution?.state !== "confirmed" && <Button className="primary" disabled={aiBusy || !collaboration.ready || aiSourceScope === "published" && !view.published} onClick={() => void runAI()}>{aiBusy ? <LoaderCircle className="knowledge-spin" size={14} /> : <Sparkles size={14} />}{aiBusy ? "正在执行…" : "生成候选"}</Button>}</div></footer>
            </section></div>}
			{pageFindOpen && <div className="knowledge-page-find-bar" role="search" aria-label="在当前页面查找"><Search size={14} aria-hidden="true" /><input ref={pageFindInputRef} value={pageFindQuery} maxLength={256} onChange={event => setPageFindQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && pageFindCount) { event.preventDefault(); setPageFindActive(index => event.shiftKey ? (index - 1 + pageFindCount) % pageFindCount : (index + 1) % pageFindCount); } else if (event.key === "Escape") { event.preventDefault(); setPageFindOpen(false); setPageFindQuery(""); } }} placeholder="查找当前页面内容" /><span aria-live="polite">{pageFindQuery ? pageFindCount ? `${pageFindActive + 1} / ${pageFindCount}` : "无结果" : "输入关键词"}</span><Button aria-label="上一个匹配" title="上一个匹配" disabled={!pageFindCount} onClick={() => setPageFindActive(index => (index - 1 + pageFindCount) % pageFindCount)}><ChevronDown className="knowledge-find-previous" size={15} /></Button><Button aria-label="下一个匹配" title="下一个匹配" disabled={!pageFindCount} onClick={() => setPageFindActive(index => (index + 1) % pageFindCount)}><ChevronDown size={15} /></Button><Button aria-label="关闭页内查找" title="关闭" onClick={() => { setPageFindOpen(false); setPageFindQuery(""); }}><X size={15} /></Button></div>}
          {mode === "metadata" && metadata && <section className="knowledge-page-metadata" aria-labelledby="knowledge-page-metadata-title">
            <header><div><h3 id="knowledge-page-metadata-title">页面属性</h3><p>属性属于页面本身，不会创建正文版本，也不会改变页面访问权限。</p></div><span>revision {metadata.revision}</span></header>
            <div className="knowledge-metadata-grid">
              <label className="knowledge-metadata-tags"><span>页面别名</span><textarea rows={2} maxLength={3100} value={metadataAliasesInput} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => { setMetadataAliasesInput(event.target.value); setMetadataDirty(true); }} placeholder="用逗号分隔；同一页可有多个检索别名" /><small>{metadataAliases(metadataAliasesInput).length}/12 个别名</small></label>
              <label className="knowledge-metadata-tags"><span>标签</span><textarea rows={2} maxLength={1300} value={metadataTagsInput} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => { setMetadataTagsInput(event.target.value); setMetadataDirty(true); }} placeholder="用逗号分隔，最多 20 个" /><small>{metadataTags(metadataTagsInput).length}/20 个标签</small></label>
              <label><span>状态</span><select value={metadata.status} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, status: event.target.value as KnowledgePageStatus }))}>{Object.entries(pageStatusLabels).map(([value, label]) => <option key={value || "unset"} value={value}>{label}</option>)}</select></label>
            </div>
            <label className="knowledge-metadata-member-search"><span>查找知识库成员</span><div><Search size={14} /><input value={metadataMemberQuery} onChange={event => setMetadataMemberQuery(event.target.value)} placeholder="按姓名或邮箱筛选负责人和人员属性" /></div></label>
            <div className="knowledge-metadata-properties-heading"><div><h4>自定义属性</h4><p>支持文本、数字、日期、选项、勾选和当前知识库成员。</p></div>{canWrite && view.page.state === "active" && <Button disabled={metadataSaving || metadata.properties.length >= 32} onClick={addMetadataProperty}><Plus size={14} />添加属性</Button>}</div>
            <div className="knowledge-metadata-properties">
              {metadata.properties.map((property, index) => <div className="knowledge-metadata-property" key={property.id}>
                <input aria-label={`属性 ${index + 1} 名称`} maxLength={64} value={property.name} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, name: event.target.value } : item) }))} />
                <select aria-label={`属性 ${index + 1} 类型`} value={property.type} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, type: event.target.value as KnowledgePagePropertyType, value: "" } : item) }))}>{Object.entries(pagePropertyTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                {property.type === "checkbox" ? <select aria-label={`${property.name} 值`} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))}><option value="">未设置</option><option value="true">是</option><option value="false">否</option></select> : property.type === "person" ? <select aria-label={`${property.name} 值`} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))}><option value="">未设置</option>{metadataMemberIDs.map(userID => <option key={userID} value={userID}>{memberProfiles[userID]?.display_name || userID}</option>)}</select> : <input aria-label={`${property.name} 值`} type={property.type === "number" ? "number" : property.type === "date" ? "date" : "text"} step={property.type === "number" ? "any" : undefined} maxLength={property.type === "text" ? 1024 : 128} value={property.value} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => updateMetadata(current => ({ ...current, properties: current.properties.map(item => item.id === property.id ? { ...item, value: event.target.value } : item) }))} />}
                {canWrite && view.page.state === "active" && <Button aria-label={`删除属性 ${property.name}`} title="删除属性" disabled={metadataSaving} onClick={() => updateMetadata(current => ({ ...current, properties: current.properties.filter(item => item.id !== property.id) }))}><Trash2 size={14} /></Button>}
              </div>)}
              {metadata.properties.length === 0 && <p className="knowledge-subtle">还没有自定义属性。</p>}
            </div>
            <footer><p>{metadata.updated_at ? `${memberProfiles[metadata.updated_by_user_id || ""]?.display_name || metadata.updated_by_user_id || "账号不可用"} 更新于 ${new Date(metadata.updated_at).toLocaleString()}` : "尚未保存页面属性。"}</p><div><Button disabled={metadataSaving || !metadataDirty} onClick={() => void reloadMetadata()}><RefreshCw size={14} />重新加载</Button>{canWrite && view.page.state === "active" && <Button className="primary" disabled={metadataSaving || !metadataDirty || metadataTags(metadataTagsInput).length > 20 || metadataAliases(metadataAliasesInput).length > 12} onClick={() => void saveMetadata()}><Save size={14} />{metadataSaving ? "保存中…" : "保存属性"}</Button>}</div></footer>
          </section>}
          {mode === "references" && <section className="knowledge-page-references" aria-labelledby="knowledge-page-references-title">
            <header><div><h3 id="knowledge-page-references-title">页面引用</h3><p>索引随正文保存更新；标题与可见性始终按当前页面和权限实时解析。</p></div>{referencesLoading && <span role="status"><LoaderCircle className="knowledge-spin" size={14} />正在更新…</span>}</header>
            <div className="knowledge-reference-columns">
              <article aria-labelledby="knowledge-outgoing-references"><header><div><h4 id="knowledge-outgoing-references">引用了谁</h4><p>当前页面正文中的知识页面引用。</p></div><strong>{outgoingReferences.length}</strong></header><div className="knowledge-reference-index-list">
                {outgoingReferences.map(reference => { const type = reference.target_content_type || "document"; return <button key={`${reference.source_page_id}:${reference.block_id}`} disabled={!reference.available} onClick={() => { setSelectedID(reference.target_page_id); setMode("read"); }}><PageTypeIcon type={type} size={17} /><span><b>{reference.available ? reference.target_title || "未命名页面" : "引用页面不可用"}</b><small>{reference.reference_mode === "fixed" ? `固定版本 ${reference.target_version}` : "实时引用"} · {reference.display === "embed" ? "内嵌" : "卡片"} · Block {reference.block_id.slice(0, 10)}</small></span><ChevronRight size={15} /></button>; })}
                {outgoingReferences.length === 0 && !referencesLoading && <p className="knowledge-subtle">当前页面没有引用其他页面。</p>}
              </div>{!outgoingReferencesComplete && <Button disabled={referencesLoading} onClick={() => void loadMoreReferences("outgoing")}>加载更多引用</Button>}</article>
              <article aria-labelledby="knowledge-incoming-references"><header><div><h4 id="knowledge-incoming-references">被谁引用</h4><p>你当前有权访问的来源页面。</p></div><strong>{incomingReferences.length}</strong></header><div className="knowledge-reference-index-list">
                {incomingReferences.map(reference => { const type = reference.source_content_type || "document"; return <button key={`${reference.source_page_id}:${reference.block_id}`} onClick={() => { setSelectedID(reference.source_page_id); setMode("read"); }}><PageTypeIcon type={type} size={17} /><span><b>{reference.source_title || "未命名页面"}</b><small>{reference.reference_mode === "fixed" ? `固定引用版本 ${reference.target_version}` : "实时引用"} · {reference.display === "embed" ? "内嵌" : "卡片"} · 更新于 ${new Date(reference.updated_at).toLocaleString()}</small></span><ChevronRight size={15} /></button>; })}
                {incomingReferences.length === 0 && !referencesLoading && <p className="knowledge-subtle">当前页面还没有可见的反向链接。</p>}
              </div>{!incomingReferencesComplete && <Button disabled={referencesLoading} onClick={() => void loadMoreReferences("incoming")}>加载更多反向链接</Button>}</article>
            </div>
          </section>}
          {mode === "relationships" && metadata && <section className="knowledge-page-relationships" aria-labelledby="knowledge-page-relationships-title">
            <header><div><h3 id="knowledge-page-relationships-title">关联页面与知识关系图</h3><p>标题、别名和路径只用于识别；关系始终保存稳定 page ID，重命名或移动不会断开关联。</p></div><Button aria-label="刷新关系图" title="刷新关系图" disabled={relationshipLoading} onClick={() => void loadRelationshipGraph()}><RefreshCw className={relationshipLoading ? "knowledge-spin" : undefined} size={15} /></Button></header>
            <div className="knowledge-relationship-layout">
              <article className="knowledge-related-editor"><header><div><h4>显式关联</h4><p>搜索所有当前有权页面，同名页用完整路径消歧。</p></div><strong>{metadata.related_page_ids.length}</strong></header>
                <label className="knowledge-relationship-search"><Search size={15} aria-hidden="true" /><input value={relationshipQuery} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onChange={event => setRelationshipQuery(event.target.value)} placeholder="搜索标题或页面别名" />{relationshipSearchLoading && <LoaderCircle className="knowledge-spin" size={15} aria-label="正在搜索" />}</label>
                <div className="knowledge-related-search-results" role="listbox" aria-label="可关联页面">
                  {relationshipResults.map(item => { const active = metadata.related_page_ids.includes(item.page_id); return <button key={item.page_id} type="button" role="option" aria-selected={active} disabled={!canWrite || view.page.state !== "active" || metadataSaving} onClick={() => updateMetadata(current => ({ ...current, related_page_ids: active ? current.related_page_ids.filter(pageID => pageID !== item.page_id) : [...current.related_page_ids, item.page_id] }))}><PageTypeIcon type={item.content_type} size={16} /><span><b>{item.title}</b><small>{identityPath(item)}{item.aliases.length > 0 ? ` · 别名 ${item.aliases.join("、")}` : ""}</small></span><i>{active ? "已关联" : "关联"}</i></button>; })}
                  {!relationshipSearchLoading && relationshipResults.length === 0 && <p className="knowledge-subtle">没有找到可关联页面。</p>}
                </div>
                {metadata.related_page_ids.length > 0 && <div className="knowledge-related-selected"><h5>已选关联</h5>{metadata.related_page_ids.map(pageID => { const item = relationshipGraph?.nodes.find(node => node.page_id === pageID) || (metadataDirty ? relationshipResults.find(node => node.page_id === pageID) : undefined); return <div key={pageID} className={item ? undefined : "is-unavailable"}><PageTypeIcon type={item?.content_type || "document"} size={15} /><span><b>{item?.title || "页面不可用"}</b><small>{item ? identityPath(item) : "目标已归档、已撤权或不存在"}</small></span>{canWrite && view.page.state === "active" && <button type="button" aria-label={`移除关联 ${item?.title || "不可用页面"}`} onClick={() => updateMetadata(current => ({ ...current, related_page_ids: current.related_page_ids.filter(id => id !== pageID) }))}><X size={14} /></button>}</div>; })}</div>}
                <footer><span>{metadataDirty ? "关联已修改，尚未保存" : `metadata revision ${metadata.revision}`}</span>{canWrite && view.page.state === "active" && <Button className="primary" disabled={metadataSaving || !metadataDirty || metadataAliases(metadataAliasesInput).length > 12 || metadata.related_page_ids.length > 64} onClick={() => void saveMetadata()}><Save size={14} />{metadataSaving ? "保存中…" : "保存关联"}</Button>}</footer>
              </article>
              <article className="knowledge-relationship-graph"><header><div><h4>知识关系图</h4><p>合并展示父子层级、正文引用和显式关联，每个节点都重新执行实时 ACL。</p></div>{relationshipGraph && <strong>{relationshipGraph.nodes.length} 个页面</strong>}</header>
                {relationshipLoading && !relationshipGraph ? <p role="status" className="knowledge-relationship-loading"><LoaderCircle className="knowledge-spin" size={18} />正在构建受权关系图…</p> : relationshipGraph && relationshipGraph.nodes.length > 0 ? <><KnowledgeRelationshipGraphView graph={relationshipGraph} onOpen={pageID => { setMode("read"); setSelectedID(pageID); }} /><div className="knowledge-relationship-node-list">{relationshipGraph.nodes.filter(node => node.page_id !== relationshipGraph.center_page_id).map(node => <button type="button" key={node.page_id} onClick={() => { setMode("read"); setSelectedID(node.page_id); }}><PageTypeIcon type={node.content_type} size={15} /><span><b>{node.title}</b><small>{identityPath(node)}</small></span><ChevronRight size={14} /></button>)}</div></> : <p className="knowledge-subtle">当前页面还没有可见关系。</p>}
              </article>
            </div>
          </section>}
          {(mode === "read" || mode === "outline" || mode === "comments" || mode === "activity" || mode === "access" || mode === "permissions" || mode === "governance") && (view.page.content_type === "file" && visibleFileContent ? <div className="knowledge-page-readable typed-readable"><KnowledgeFilePage client={client} libraryID={library.id} pageID={view.page.id} content={visibleFileContent} formatError={formatError} /></div> : view.published ? <div className="knowledge-page-readable typed-readable"><KnowledgeEditor type={view.page.content_type} body={content} documentTitle={view.published.title} canManage={library.role === "manager"} gridAccess={view.grid_access} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} form={formRuntime} initialBlockID={highlightedBlockID} initialSearchLocation={linkedSearchLocation} blockHighlightRevision={commentFocus.revision} onCommentAnchor={["document", "whiteboard", "mind_map", "flowchart"].includes(view.page.content_type) ? anchor => setCommentAnchor(anchor || null) : undefined} authorizeContentAction={authorizeContentAction} uploadFile={view.page.content_type === "form" ? uploadEditorFile : undefined} fileUploadsEnabled={library.documents_configured} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} /></div> : <EmptyState><Upload size={28} /><h3>页面尚未发布</h3><p>编辑者可以完善草稿后发布。</p></EmptyState>)}
          {mode === "suggestions" && view.draft && <div className="knowledge-page-readable typed-readable knowledge-suggestion-draft"><KnowledgeEditor type="document" body={view.draft.body.content} documentTitle={view.draft.title} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} initialBlockID={commentFocus.nodeID || undefined} blockHighlightRevision={commentFocus.revision} onCommentAnchor={anchor => setCommentAnchor(anchor || null)} authorizeContentAction={authorizeContentAction} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} /></div>}
          {mode === "edit" && view.draft && view.page.content_type === "file" && <div className="knowledge-editor-shell"><section className="knowledge-page-editor knowledge-file-page-editor"><div className="knowledge-editor-canvas"><input ref={titleInputRef} className="knowledge-editor-title" aria-label="标题" value={title} maxLength={256} onChange={event => updateEditor(event.target.value, body)} placeholder="页面标题" /><div className="knowledge-editor-toolbar"><span>文件页面</span><span>正文只保存受权原件引用</span></div><KnowledgeFilePage client={client} libraryID={library.id} pageID={view.page.id} content={body} formatError={formatError} /></div><footer className="knowledge-editor-actions"><div><Button disabled={!dirty || saveState === "saving" || publishState === "publishing"} onClick={() => void saveDraft()}><Save size={14} />保存草稿</Button><span className="knowledge-editor-hint">文件原件不可在页面正文中覆盖；标题和位置按页面版本管理。</span></div><div><input aria-label="发布说明" value={publishNote} maxLength={2048} onChange={event => setPublishNote(event.target.value)} placeholder="添加发布说明…" /><Button className="primary" disabled={saveState === "conflict" || publishState === "publishing" || !title.trim()} onClick={() => void publish()}><Send size={14} />{publishState === "publishing" ? "发布中…" : "发布版本"}</Button></div></footer></section></div>}
          {mode === "edit" && view.draft && view.page.content_type !== "file" && <div className="knowledge-editor-shell">
            <section className="knowledge-page-editor">
              <div className="knowledge-editor-canvas">
                <input ref={titleInputRef} className="knowledge-editor-title" aria-label="标题" value={title} maxLength={256} disabled={collaboration.available && !collaboration.ready} onChange={event => updateEditor(event.target.value, body)} placeholder="页面标题" />
                <div className="knowledge-editor-toolbar"><span>{pageTypeMeta[view.page.content_type].label}</span><span>{view.page.content_type === "document" ? `${editorStats.blocks} 个内容块 · ${editorStats.characters} 字符` : "结构化草稿"}</span></div>
                <KnowledgeEditor key={`${view.page.id}:${remountEditorOnDraftRevision ? view.draft.draft_revision : 0}:${editorEpoch}`} type={view.page.content_type} body={body} documentTitle={title} canManage={library.role === "manager"} gridAccess={view.grid_access} collaboration={collaboration.available && collaboration.ready ? collaboration.editorCollaboration : undefined} readOnly={collaboration.available && !collaboration.ready} mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} dynamicBlocks={dynamicBlockRuntime} form={formRuntime} initialBlockID={linkedBlockID} initialSearchLocation={linkedSearchLocation} blockLink={blockLink} insertMarkdownRequest={aiInsertRequest} authorizeContentAction={authorizeContentAction} onActionFeedback={setNotice} uploadFile={view.page.content_type === "document" || view.page.content_type === "multidimensional_table" || view.page.content_type === "presentation" || view.page.content_type === "form" ? uploadEditorFile : undefined} fileUploadsEnabled={library.documents_configured} readFile={readEditorFile} convertPage={view.page.content_type === "document" || view.page.content_type === "mind_note" ? convertCurrentPage : undefined} onChange={(next, change) => updateEditor(title, next, change)} onPresence={collaboration.available ? collaboration.updatePresence : nativeAwareness.updatePresence} />
              </div>
              <div className="knowledge-editor-meta">
                <div className={`knowledge-sync-state is-${collaboration.state}`} role="status">{collaboration.state === "syncing" || collaboration.state === "connecting" || collaboration.state === "reconnecting" ? <Cloud className="knowledge-pulse" size={15} /> : collaboration.state === "error" ? <Wifi size={15} /> : <Check size={15} />}<span>{publishState === "publishing" ? "正在冻结协作快照…" : publishState === "error" ? "发布失败" : collaboration.available ? collaborationStateLabel : { idle: dirty ? "有未保存更改" : "草稿未更改", saving: "正在保存…", saved: `已保存 revision ${view.draft.draft_revision}`, conflict: "保存冲突：服务器已有更新", error: "保存失败" }[saveState]}</span>{collaboration.available && collaboration.draftRevision > 0 && <small>revision {collaboration.draftRevision} · clock {collaboration.serverClock}</small>}</div>
                <label className="knowledge-attachment-trigger"><Paperclip size={15} />添加附件或粘贴图片<input type="file" accept={knowledgeDocumentAccept(library)} disabled={attaching} onChange={event => { const file = event.target.files?.[0]; if (file) void attachFile(file); event.currentTarget.value = ""; }} /></label>
              </div>
              {(attaching || attachments.length > 0) && <div className="knowledge-page-attachments">{attaching && <span role="status">正在校验并上传附件…</span>}{attachments.map(attachment => <span key={attachment.document_id}>{attachment.title}<button type="button" onClick={() => void removeAttachment(attachment)}>移除</button></span>)}</div>}
              {!collaboration.available && saveState === "conflict" && <div className="knowledge-conflict"><GitMerge size={18} /><span>{saveConflict ? `服务器草稿 revision ${saveConflict.current_draft_revision}，基于发布版本 ${saveConflict.base_published_version}，更新时间 ${new Date(saveConflict.current_updated_at).toLocaleString()}，摘要 ${saveConflict.current_content_sha256.slice(0, 12)}` : "服务器上的同一编辑目标已经变化，请重新载入后决定保留哪一项。"}</span><Button onClick={() => void copyDraftAfterConflict()}>复制我的内容</Button><Button onClick={() => { pendingSaveRef.current = null; pendingNativeSaveRef.current = null; pendingPublishRef.current = null; setSaveConflict(null); setSelectedID(current => { window.setTimeout(() => setSelectedID(current)); return ""; }); }}><RefreshCw size={14} />重新载入</Button></div>}
              <footer className="knowledge-editor-actions">
                <div>{!collaboration.available && <Button disabled={!dirty || saveState === "saving" || publishState === "publishing"} onClick={() => void saveDraft()}><Save size={14} />保存草稿</Button>}<span className="knowledge-editor-hint">{collaboration.available ? "正文使用增量 CRDT 同步，不会整篇覆盖他人的修改。" : nativeAwareness.available ? "图形按节点和连线合并；选中目标会同步给在线成员。" : "更改会自动保存为草稿。"}</span></div>
                <div><input aria-label="发布说明" value={publishNote} maxLength={2048} onChange={event => setPublishNote(event.target.value)} placeholder="添加发布说明…" /><Button className="primary" disabled={saveState === "conflict" || publishState === "publishing" || !title.trim() || collaboration.available && (collaboration.state === "error" || collaboration.state === "connecting" || collaboration.state === "reconnecting")} onClick={() => void publish()}><Send size={14} />{publishState === "publishing" ? "发布中…" : "发布版本"}</Button></div>
              </footer>
            </section>
          </div>}
          {mode === "history" && <section className="knowledge-page-history"><div className="knowledge-history-heading"><div><h3>连续编辑历史</h3><p>按草稿 revision 永久记录，显示作者、时间和 Block 级变化。</p></div></div>{editHistory.map(entry => <article className="knowledge-edit-history" key={entry.draft_revision}><header><strong>{memberProfiles[entry.user_id]?.display_name || "账号不可用"}</strong><span>{new Date(entry.created_at).toLocaleString()} · 草稿 revision {entry.draft_revision}{entry.clock > 0 ? ` · 协作时钟 ${entry.clock}` : ""}</span></header><div className="knowledge-edit-history-summary">{entry.title_changed && <em>标题已修改</em>}<span>{entry.changed_block_count} 个 Block 变化{entry.truncated ? "（明细过多，已截断）" : ""}</span></div>{entry.changes.length > 0 && <ul>{entry.changes.map(change => <li key={`${entry.draft_revision}-${change.node_id}`} className={`is-${change.kind}`}><b>{change.kind === "insert" ? "新增" : change.kind === "delete" ? "删除" : "修改"}</b><code>{change.node_id.slice(0, 12)}</code><span>{change.kind === "update" ? `${change.before_preview || "空内容"} → ${change.after_preview || "空内容"}` : change.after_preview || change.before_preview || "空内容"}</span></li>)}</ul>}</article>)}{editHistory.length === 0 && <p className="knowledge-subtle">还没有编辑记录。</p>}{!editHistoryComplete && <Button onClick={() => void loadMoreEditHistory()}>加载更早编辑</Button>}<div className="knowledge-history-heading"><div><h3>发布版本</h3><p>发布后形成不可变快照，可查看、对比和恢复为新草稿。</p></div><Button disabled={compare.length !== 2} onClick={() => void compareVersions()}>对比所选版本</Button></div>{versions.map(version => <div key={version.version} className="knowledge-version"><label><input type="checkbox" checked={compare.includes(version.version)} onChange={event => setCompare(current => event.target.checked ? [version.version, ...current].slice(0, 2) : current.filter(item => item !== version.version))} />版本 {version.version}</label><span>{memberProfiles[version.published_by_user_id]?.display_name || "账号不可用"} · {new Date(version.published_at).toLocaleString()} · {version.publish_note || "无发布说明"} · {version.body.summary || "无摘要"}</span><Button onClick={() => void previewVersion(version.version)}>查看版本</Button>{canWrite && <Button onClick={() => void restore(version.version)}>恢复为草稿</Button>}</div>)}{!versionsComplete && <Button onClick={() => void loadMoreVersions()}>加载更早版本</Button>}{historyPreview && <div className="knowledge-version-preview"><h4>版本 {historyPreview.version}：{historyPreview.title}</h4><p className="knowledge-subtle">页面位置 {historyPreview.parent_page_id || "根目录"} · 排序 {historyPreview.rank}</p><div className="knowledge-page-readable typed-readable"><KnowledgeEditor type={historyPreview.content_type} body={historyPreview.body.content} documentTitle={historyPreview.title} readOnly mentions={mentionRuntime} tasks={taskRuntime} polls={pollRuntime} readFile={readEditorFile} onActionFeedback={setNotice} onChange={() => undefined} /></div></div>}{diff && <div className="knowledge-diff"><h4>版本 {diff.from_version} → {diff.to_version}</h4><pre>{diff.content.map((op, index) => <span key={index} className={`is-${op.kind}`}>{op.kind === "insert" ? "+ " : op.kind === "delete" ? "- " : "  "}{op.text}</span>)}</pre></div>}</section>}
          {mode === "suggestions" && <aside className="knowledge-page-suggestions" aria-label="修订提议">
            <header><div><GitPullRequest size={17} /><span><strong>修订提议</strong><small>接受前不会改动草稿</small></span></div><b>{suggestions.filter(item => item.status === "open").length} 条待处理</b></header>
            {canWrite && view.page.state === "active" && view.draft && <section className="knowledge-suggestion-create">
              <p className="knowledge-subtle">先在左侧草稿中选择文字或点选一个内容块，再提议在其后插入新段落，或删除该内容块。</p>
              {commentAnchor ? <button type="button" className="knowledge-comment-anchor" onClick={() => setCommentFocus(current => ({ nodeID: commentAnchor.nodeID, revision: current.revision + 1 }))}><GitPullRequest size={14} /><span><strong>当前修订锚点</strong><small>“{commentAnchor.quote}”</small></span></button> : <p className="knowledge-comment-anchor is-empty">尚未选择内容块。</p>}
              <div className="knowledge-suggestion-kind"><button type="button" aria-pressed={suggestionKind === "insert"} onClick={() => setSuggestionKind("insert")}>插入段落</button><button type="button" aria-pressed={suggestionKind === "delete"} onClick={() => setSuggestionKind("delete")}>删除内容块</button></div>
              {suggestionKind === "insert" && <textarea value={suggestionText} maxLength={32_768} onChange={event => setSuggestionText(event.target.value)} placeholder="要插入的新段落内容" />}
              <textarea value={suggestionComment} maxLength={16_384} onChange={event => setSuggestionComment(event.target.value)} placeholder="说明修订原因（可选）" />
              <label>@ 提及当前资料库成员<input value={memberQuery} onChange={event => setMemberQuery(event.target.value)} placeholder="按姓名或邮箱搜索" /></label>
              <div className="knowledge-mention-picker">{mentionCandidates.map(member => <button key={member.user_id} type="button" aria-pressed={suggestionMentionedUserIDs.includes(member.user_id)} onClick={() => setSuggestionMentionedUserIDs(current => current.includes(member.user_id) ? current.filter(id => id !== member.user_id) : [...current, member.user_id])}>@{member.display_name}</button>)}</div>
              <Button className="primary" disabled={suggestionBusy === "create" || !commentAnchor || suggestionKind === "insert" && !suggestionText.trim()} onClick={() => void createSuggestion()}>{suggestionBusy === "create" ? "正在提交…" : "提交修订"}</Button>
            </section>}
            <div className="knowledge-suggestion-list">{suggestions.map(suggestion => <article key={suggestion.id} className={`knowledge-suggestion is-${suggestion.status}${suggestion.anchor.changed ? " is-stale" : ""}`}>
              <header><span><strong>{suggestion.kind === "insert" ? "提议插入" : "提议删除"}</strong><small>{memberProfiles[suggestion.author_user_id]?.display_name || "账号不可用"} · {new Date(suggestion.created_at).toLocaleString()}</small></span><em>{suggestion.status === "open" ? "待处理" : suggestion.status === "accepted" ? "已接受" : suggestion.status === "rejected" ? "已拒绝" : "已撤回"}</em></header>
              <button type="button" className="knowledge-comment-quote" disabled={!!suggestion.anchor.changed} onClick={() => setCommentFocus(current => ({ nodeID: suggestion.anchor.node_id || "", revision: current.revision + 1 }))}>“{suggestion.anchor.quote || "内容块"}”</button>
              {suggestion.anchor.changed && suggestion.status === "open" && <p className="knowledge-comment-anchor-state is-invalid">原内容块已改变，不能接受这条修订。</p>}
              {suggestion.proposed_text && <p className="knowledge-suggestion-proposal">+ {suggestion.proposed_text}</p>}
              {suggestion.comment && <p>{suggestion.comment}</p>}
              {suggestion.mentioned_user_ids.length > 0 && <p className="knowledge-subtle">提及 {suggestion.mentioned_user_ids.map(id => `@${memberProfiles[id]?.display_name || "账号不可用"}`).join("、")}</p>}
              {suggestion.status === "open" && <div className="knowledge-actions">{canWrite && <><Button disabled={suggestionBusy === suggestion.id || !!suggestion.anchor.changed} onClick={() => void decideSuggestion(suggestion, "accept")}>接受</Button><Button disabled={suggestionBusy === suggestion.id} onClick={() => void decideSuggestion(suggestion, "reject")}>拒绝</Button></>}{suggestion.author_user_id === currentUserID && <Button disabled={suggestionBusy === suggestion.id} onClick={() => void decideSuggestion(suggestion, "withdraw")}>撤回</Button>}</div>}
            </article>)}{suggestions.length === 0 && <p className="knowledge-subtle">还没有修订提议。</p>}</div>
          </aside>}
          {mode === "outline" && <aside className="knowledge-page-outline" aria-label="页面大纲"><h3>页面大纲</h3>{outline.length === 0 ? <p className="knowledge-subtle">当前发布版本没有标题块。</p> : <ol>{outline.map(item => <li key={item.key} style={{ paddingInlineStart: `${(item.level - 1) * 12}px` }}>{item.title}</li>)}</ol>}</aside>}
          {mode === "comments" && <section className="knowledge-page-comments">
            <label className="knowledge-checkbox"><input type="checkbox" checked={unresolvedOnly} onChange={event => setUnresolvedOnly(event.target.checked)} />只看未解决</label>
            {view.page.state === "archived" && <p className="knowledge-subtle">页面已归档，评论只读。</p>}
            {view.published && view.page.state === "active" && <div className="knowledge-comment-create">
              {replyingTo ? <p className="knowledge-comment-anchor is-replying">正在回复评论线程 <button onClick={() => setReplyingTo("")}>取消回复</button></p> : commentAnchor ? <button type="button" className="knowledge-comment-anchor" onClick={() => setCommentFocus(current => ({ nodeID: commentAnchor.nodeID, revision: current.revision + 1 }))}><MessageSquare size={14} /><span><strong>评论当前选区</strong><small>“{commentAnchor.quote}”</small></span></button> : <p className="knowledge-comment-anchor is-empty">请先选择正文内容块，或点选画板、思维导图、流程图元素。</p>}
              <textarea value={commentBody} maxLength={16_384} onChange={event => setCommentBody(event.target.value)} placeholder="针对当前发布版本发表评论" />
              <label>@ 提及当前资料库成员<input value={memberQuery} onChange={event => setMemberQuery(event.target.value)} placeholder="按姓名或邮箱搜索" /></label>
              <div className="knowledge-mention-picker">{mentionCandidates.map(member => <button key={member.user_id} type="button" aria-pressed={mentionedUserIDs.includes(member.user_id)} onClick={() => setMentionedUserIDs(current => current.includes(member.user_id) ? current.filter(id => id !== member.user_id) : [...current, member.user_id])}>@{member.display_name}</button>)}</div>
              {mentionedUserIDs.length > 0 && <p className="knowledge-subtle">将提及：{mentionedUserIDs.map(id => memberProfiles[id]?.display_name || id).join("、")}</p>}
              <Button disabled={!commentBody.trim() || !replyingTo && !commentAnchor} onClick={() => void addComment()}>评论</Button>
            </div>}
            {comments.map(comment => <div key={comment.id} className={`knowledge-comment${comment.resolved ? " is-resolved" : ""}${comment.parent_comment_id ? " is-reply" : ""}`}>
              <header><strong>{memberProfiles[comment.author_user_id]?.display_name || "账号不可用"}</strong><span>版本 {comment.published_version} · {new Date(comment.created_at).toLocaleString()}</span></header>
              {comment.anchor.changed ? <p className="knowledge-comment-anchor-state is-invalid">原内容块已删除或内容已经变化，锚点失效。</p> : <button type="button" className="knowledge-comment-quote" onClick={() => focusComment(comment)} title="定位并高亮原内容块">“{comment.anchor.quote}”</button>}
              {editingCommentID === comment.id ? <div className="knowledge-comment-edit"><textarea value={editingCommentBody} maxLength={16_384} onChange={event => setEditingCommentBody(event.target.value)} /><div className="knowledge-actions"><Button disabled={!editingCommentBody.trim()} onClick={() => void updateComment(comment)}>保存评论</Button><Button onClick={() => { setEditingCommentID(""); setEditingCommentBody(""); }}>取消</Button></div></div> : <p>{comment.deleted ? "评论已删除" : comment.body}</p>}
              {comment.mentioned_user_ids.length > 0 && <p className="knowledge-subtle">提及 {comment.mentioned_user_ids.map(id => `@${memberProfiles[id]?.display_name || "账号不可用"}`).join("、")}</p>}
              {!comment.deleted && <div className="knowledge-comment-reactions" aria-label="表情回应">{commentReactionEmojis.map(emoji => { const reaction = comment.reactions?.find(item => item.emoji === emoji); return <button key={emoji} type="button" className={reaction?.reacted ? "is-active" : undefined} aria-pressed={reaction?.reacted || false} title={`${reaction?.reacted ? "取消" : "添加"}${emoji}回应`} onClick={() => void toggleCommentReaction(comment, emoji)}><span>{emoji}</span>{reaction && reaction.count > 0 && <b>{reaction.count}</b>}</button>; })}</div>}
              {tasks.filter(task => task.source_block_id === comment.anchor.node_id).map(task => <div className="knowledge-comment-task" key={task.id}><Check size={14} /><span><strong>{task.title}</strong><small>{task.status === "done" ? "已完成" : task.status === "in_progress" ? "进行中" : task.status === "canceled" ? "已取消" : "待处理"}{task.assignee_user_ids.length ? ` · ${task.assignee_user_ids.map(id => memberProfiles[id]?.display_name || id).join("、")}` : " · 未指派"}</small></span></div>)}
              {view.page.state === "active" && !comment.deleted && editingCommentID !== comment.id && <div className="knowledge-actions"><Button onClick={() => beginReply(comment)}>回复</Button><Button onClick={() => { setEditingCommentID(comment.id); setEditingCommentBody(comment.body); }}>编辑</Button><Button onClick={() => void resolveComment(comment)}>{comment.resolved ? "重新打开" : "标记解决"}</Button>{canWrite && !comment.anchor.changed && <Button onClick={() => void assignCommentTask(comment)}>{tasks.some(task => task.source_block_id === comment.anchor.node_id) ? "追加任务指派" : "指派任务"}</Button>}<Button className="danger" onClick={() => void deleteComment(comment)}>删除</Button></div>}
            </div>)}
            {!commentsComplete && <Button onClick={() => void loadMoreComments()}>加载更多评论</Button>}
          </section>}
          {mode === "activity" && <section className="knowledge-page-activity"><p className="knowledge-subtle">活动由发布版本与评论实时合并，不另存第三份活动记录。</p>{activities.map(item => <div key={item.key} className="knowledge-activity-item"><Activity size={15} /><span><strong>{item.title}</strong><small>{new Date(item.at).toLocaleString()} · {item.detail}</small></span></div>)}{activities.length === 0 && <p className="knowledge-subtle">暂无页面活动。</p>}<div className="knowledge-actions">{!versionsComplete && <Button onClick={() => void loadMoreVersions()}>加载更早发布</Button>}{!commentsComplete && <Button onClick={() => void loadMoreComments()}>加载更多评论</Button>}</div></section>}
          {mode === "access" && library.role === "manager" && <section className="knowledge-page-access"><h3>当前页面访问说明</h3><p className="knowledge-subtle">结果由服务端同时计算 Identity 功能权限、资料库实时成员角色、页面继承关系和可选的受控分享状态。</p><label>查找用户<input value={accessQuery} onChange={event => { setAccessQuery(event.target.value); setAccessUserID(""); }} placeholder="输入姓名或邮箱" /></label><div className="knowledge-principal-results" role="listbox">{accessPrincipals.map(principal => <button key={principal.user_id} role="option" aria-selected={accessUserID === principal.user_id} onClick={() => { setAccessUserID(principal.user_id); setAccessQuery(principal.display_name || principal.email || principal.user_id); setAccessPrincipals([]); }}>{principal.avatar_url ? <img src={principal.avatar_url} alt="" /> : <span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span>}<strong>{principal.display_name}</strong><small>{principal.email}</small></button>)}</div><label>动作<select value={accessAction} onChange={event => setAccessAction(event.target.value)}><option value="knowledge.pages.get">阅读页面</option><option value="knowledge.pages.update">编辑草稿</option><option value="knowledge.pages.publish">发布页面</option><option value="knowledge.page_comments.create">发表评论</option><option value="knowledge.page_shares.read">通过受控分享阅读</option></select></label>{accessAction === "knowledge.page_shares.read" && <label>分享定位符<input value={accessShareID} onChange={event => setAccessShareID(event.target.value)} placeholder="kshare_…" /></label>}{accessExplanation && <div className="knowledge-access-preview"><p><strong>最终结论：{accessExplanation.final.allowed ? "允许" : "拒绝"}</strong>（{accessExplanation.final.label} · {accessExplanation.final.source === "share" ? "受控分享路径" : "正常页面权限路径"}）</p><p>Identity 功能权限：{accessExplanation.identity.allowed ? "允许" : "拒绝"} · {accessExplanation.identity.label}</p><p>资料库成员角色：{accessExplanation.library.allowed ? "允许" : "拒绝"} · {accessExplanation.library_role || "无成员关系"} · {accessExplanation.library.label}</p><p>页面权限：{accessExplanation.page.allowed ? "允许" : "拒绝"} · {accessExplanation.page.label}；继承来源 {accessExplanation.inherited_from || "资料库"}</p>{accessExplanation.share && <p>受控分享：{accessExplanation.share.allowed ? "允许" : "拒绝"} · {accessExplanation.share.label} · {accessExplanation.share.source || "share"}</p>}</div>}</section>}
          {mode === "permissions" && library.role === "manager" && client.getPageAccess && client.setPageAccess && <section className="knowledge-page-access knowledge-page-permissions">
            <h3>页面与子树权限</h3>
            <p className="knowledge-subtle">管理者始终保留治理访问。受限模式可授权当前知识库中的用户或组织，实际权限不会超过其知识库角色。</p>
            {!pageAccess ? <p role="status">正在读取服务端权限…</p> : <>
              <label>访问模式<select value={permissionMode} disabled={permissionSaving} onChange={event => setPermissionMode(event.target.value as "inherit" | "restricted")}><option value="inherit">继承知识库角色</option><option value="restricted">仅管理者和明确授权主体</option></select></label>
              {permissionMode === "inherit" ? <p className="knowledge-access-preview">本页完全继承知识库成员角色，不保存额外授权。</p> : <>
                <div className="knowledge-permission-grant-options">
                  <label>授权主体<select value={permissionSubjectType} disabled={permissionSaving} onChange={event => { setPermissionSubjectType(event.target.value as KnowledgeAccessSubject["type"]); setPermissionQuery(""); }}><option value="user">用户</option><option value="organization">组织</option></select></label>
                  <label>授权角色<select value={permissionRole} onChange={event => setPermissionRole(event.target.value as KnowledgePageAccessGrant["role"])}><option value="reader">阅读者</option><option value="editor">编辑者</option><option value="manager">管理者</option></select></label>
                  <label>授权范围<select value={permissionScope} onChange={event => setPermissionScope(event.target.value as KnowledgePageAccessGrant["scope"])}><option value="page">仅此页面</option><option value="subtree">此页面与子树</option></select></label>
                </div>
                {permissionSubjectType === "user" ? <>
                  <label>查找当前知识库成员<input value={permissionQuery} disabled={permissionSaving} onChange={event => setPermissionQuery(event.target.value)} placeholder="按姓名或邮箱搜索" /></label>
                  <div className="knowledge-principal-results" role="listbox">{permissionPrincipals.map(principal => <button key={principal.user_id} role="option" onClick={() => addPermissionGrant(principal)}><span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span><strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>
                </> : <div className="knowledge-member-editor"><label>Identity 组织 ID<input value={permissionQuery} disabled={permissionSaving} onChange={event => setPermissionQuery(event.target.value)} placeholder="输入准确的组织 ID" /></label><Button disabled={permissionSaving || !permissionQuery.trim()} onClick={() => void addOrganizationPermissionGrant()}>验证并添加组织</Button></div>}
                <div className="knowledge-permission-grants">{permissionGrants.map(grant => <div key={`${grant.subject.type}:${grant.subject.id}:${grant.scope}`}><span><strong>{subjectLabel(grant.subject)}</strong><small>{grant.subject.type === "organization" ? "组织" : "用户"} · {grant.role === "reader" ? "阅读者" : grant.role === "editor" ? "编辑者" : "管理者"} · {grant.scope === "page" ? "仅此页面" : "页面与子树"}</small></span><Button disabled={permissionSaving} onClick={() => setPermissionGrants(current => current.filter(item => item.subject.type !== grant.subject.type || item.subject.id !== grant.subject.id || item.scope !== grant.scope))}>移除</Button></div>)}{permissionGrants.length === 0 && <p className="knowledge-subtle">尚未授权任何用户或组织；除管理者外无人可访问。</p>}</div>
              </>}
              <p className="knowledge-subtle">当前 ACL revision {pageAccess.revision} · 远端投影 {pageAccess.projection_status === "ready" ? "已确认" : "确认中（页面已从搜索结果隐藏）"}</p>
              <Button disabled={permissionSaving} onClick={() => void savePageAccess()}><Save size={14} />{permissionSaving ? "正在保存…" : "保存页面权限"}</Button>
            </>}
            <KnowledgePageShareManager client={client} libraryID={library.id} pageID={selectedID} published={!!view.published} formatError={formatError} onNotice={setNotice} />
          </section>}
          {mode === "governance" && metadata && governanceDraft && <section className="knowledge-page-governance" aria-labelledby="knowledge-page-governance-title">
            <header><div><h3 id="knowledge-page-governance-title">页面治理</h3><p>负责人和内容管理员只承担治理责任，不会因此获得页面访问权限；复核人仍须拥有编辑权限。</p></div><span>revision {metadata.revision}</span></header>
            <article className="knowledge-governance-card">
              <div className="knowledge-governance-card-title"><div><h4>责任人与复核周期</h4><p>管理者配置规则；负责人、内容管理员或管理者可完成复核。</p></div>{governanceDirty && <span className="is-pending">未保存</span>}</div>
              <div className="knowledge-governance-grid">
                <label><span>页面负责人</span><select value={governanceDraft.ownerUserID} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, ownerUserID: event.target.value, contentAdminUserIDs: current.contentAdminUserIDs.filter(userID => userID !== event.target.value) }))}><option value="">选择当前知识库成员</option>{metadataMemberIDs.map(userID => <option key={userID} value={userID}>{memberProfiles[userID]?.display_name || userID}</option>)}</select></label>
                <label><span>下次复核时间</span><input type="datetime-local" value={metadataDateTimeInput(governanceDraft.nextReviewAt)} disabled={library.role !== "manager" || governanceSaving || governanceDraft.reviewIntervalDays === 0} onChange={event => updateGovernance(current => ({ ...current, nextReviewAt: metadataDateTimeISO(event.target.value) }))} /></label>
                <label><span>复核周期（天）</span><input type="number" min={0} max={3650} value={governanceDraft.reviewIntervalDays} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, reviewIntervalDays: Math.max(0, Number(event.target.value) || 0), nextReviewAt: Number(event.target.value) > 0 ? current.nextReviewAt : undefined }))} /><small>填 0 表示关闭定期复核。</small></label>
                <label><span>归档保留期（天）</span><input type="number" min={1} max={3650} value={governanceDraft.archiveRetentionDays} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, archiveRetentionDays: Math.max(1, Number(event.target.value) || 1) }))} /><small>到期后页面不可恢复；首期不提供物理删除按钮。</small></label>
              </div>
              <label className="knowledge-metadata-member-search"><span>查找知识库成员</span><div><Search size={14} /><input value={metadataMemberQuery} disabled={library.role !== "manager" || governanceSaving} onChange={event => setMetadataMemberQuery(event.target.value)} placeholder="按姓名或邮箱查找负责人、内容管理员" /></div></label>
              <div className="knowledge-governance-admins"><div><h5>内容管理员</h5><p>可执行复核，但不会自动获得阅读或编辑权限。</p></div><div>{metadataMemberIDs.filter(userID => userID !== governanceDraft.ownerUserID).map(userID => <label key={userID}><input type="checkbox" checked={governanceDraft.contentAdminUserIDs.includes(userID)} disabled={library.role !== "manager" || governanceSaving} onChange={event => updateGovernance(current => ({ ...current, contentAdminUserIDs: event.target.checked ? [...current.contentAdminUserIDs, userID].sort() : current.contentAdminUserIDs.filter(value => value !== userID) }))} /><span>{memberProfiles[userID]?.display_name || userID}</span><small>{memberProfiles[userID]?.email || userID}</small></label>)}</div></div>
              <div className="knowledge-governance-review-status"><div><CalendarClock size={18} /><span><strong>{metadata.last_reviewed_at ? `上次复核：${new Date(metadata.last_reviewed_at).toLocaleString()}` : "尚未完成过复核"}</strong><small>{metadata.last_reviewed_by_user_id ? `复核人：${memberProfiles[metadata.last_reviewed_by_user_id]?.display_name || metadata.last_reviewed_by_user_id}` : metadata.next_review_at ? `计划复核：${new Date(metadata.next_review_at).toLocaleString()}` : "未启用定期复核"}</small></span></div>{canReviewGovernance && view.page.state === "active" && <Button disabled={governanceSaving || governanceDirty} onClick={() => void reviewGovernance()}><Check size={14} />完成本次复核</Button>}</div>
              {metadata.archived_at && <p className="knowledge-governance-retention"><Trash2 size={15} />归档于 {new Date(metadata.archived_at).toLocaleString()}；{metadata.retain_until ? `保留至 ${new Date(metadata.retain_until).toLocaleString()}` : "尚未生成清理期限"}</p>}
              {library.role === "manager" && <footer><Button disabled={governanceSaving || !governanceDirty} onClick={() => void reloadMetadata()}><RefreshCw size={14} />重新加载</Button><Button className="primary" disabled={governanceSaving || !governanceDirty || !governanceDraft.ownerUserID || governanceDraft.contentAdminUserIDs.length > 20 || governanceDraft.archiveRetentionDays < 1 || governanceDraft.archiveRetentionDays > 3650 || governanceDraft.reviewIntervalDays < 0 || governanceDraft.reviewIntervalDays > 3650} onClick={() => void saveGovernance()}><Save size={14} />{governanceSaving ? "保存中…" : "保存治理规则"}</Button></footer>}
            </article>
            {library.role === "manager" && <article className="knowledge-governance-card knowledge-governance-audit">
              <div className="knowledge-governance-card-title"><div><h4>治理审计</h4><p>直接查询不可变 Audit 事件，不在知识库内复制第三份日志。</p></div><Button aria-label="刷新治理审计" title="刷新" disabled={governanceAuditLoading} onClick={() => void loadGovernanceAudit(true)}><RefreshCw className={governanceAuditLoading ? "knowledge-spin" : undefined} size={14} /></Button></div>
              <div className="knowledge-governance-audit-filters"><label><span>事件</span><select value={governanceAuditEvent} disabled={governanceAuditLoading} onChange={event => setGovernanceAuditEvent(event.target.value)}><option value="">全部治理事件</option><option value="knowledge.page.governance_set">更新治理规则</option><option value="knowledge.page.governance_reviewed">完成内容复核</option></select></label><label><span>操作者用户 ID</span><input value={governanceAuditActor} disabled={governanceAuditLoading} onChange={event => setGovernanceAuditActor(event.target.value)} placeholder="留空表示全部" /></label><Button disabled={governanceAuditLoading} onClick={() => void loadGovernanceAudit(true)}><Search size={14} />查询</Button></div>
              <div className="knowledge-governance-audit-list">{governanceAudit.map(event => <article key={event.id}><span className="knowledge-governance-audit-icon"><ShieldCheck size={15} /></span><div><strong>{governanceEventLabels[event.type] || event.type}</strong><small>{memberProfiles[event.actor.user_id]?.display_name || event.actor.user_id} · {new Date(event.occurred_at).toLocaleString()} · revision {event.version || "-"}</small>{event.after && <p>{Object.entries(event.after).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p>}</div></article>)}{!governanceAuditLoading && governanceAudit.length === 0 && <p className="knowledge-subtle">没有符合条件的治理事件。</p>}</div>
              {!governanceAuditComplete && <Button disabled={governanceAuditLoading || !governanceAuditAfter} onClick={() => void loadGovernanceAudit(false)}>{governanceAuditLoading ? "加载中…" : "加载更多"}</Button>}
            </article>}
            {library.role === "manager" && client.getPageContentPolicy && client.setPageContentPolicy && <KnowledgePageContentPolicyManager client={client} libraryID={library.id} pageID={selectedID} formatError={formatError} onNotice={setNotice} onSaved={() => { void client.getPage(library.id, selectedID, canWrite, AbortSignal.timeout(30_000)).then(refreshed => { viewRef.current = refreshed; setView(refreshed); }, failure => setError(formatError(failure))); }} />}
          </section>}
        </>}
      </article>
    </div>
    {templateDialogOpen && typeof document !== "undefined" && createPortal(<div className="knowledge-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !templateBusy) setTemplateDialogOpen(false); }}><section className="knowledge-template-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-template-title">
      <header><div><h2 id="knowledge-template-title">页面模板</h2><p>模板冻结当前页面及其子页面；创建出的页面与模板后续版本互不影响。</p></div><Button aria-label="关闭模板" title="关闭" disabled={!!templateBusy} onClick={() => setTemplateDialogOpen(false)}><X size={17} /></Button></header>
      <div className="knowledge-template-dialog-body">
        {canWrite && selectedID && client.createPageTemplate && <section className="knowledge-template-create"><div><h3>保存当前页面为模板</h3><p>包含当前页面下最多 200 个可编辑子页面。</p></div><label>模板名称<input maxLength={256} value={templateTitle} disabled={!!templateBusy} onChange={event => setTemplateTitle(event.target.value)} /></label><label>说明<textarea maxLength={2048} rows={2} value={templateDescription} disabled={!!templateBusy} onChange={event => setTemplateDescription(event.target.value)} placeholder="说明适用场景" /></label><Button className="primary" disabled={!!templateBusy || !templateTitle.trim()} onClick={() => void saveCurrentAsTemplate()}><Save size={15} />{templateBusy === "create" ? "正在保存…" : "保存模板"}</Button></section>}
        <section className="knowledge-template-library"><div className="knowledge-template-section-title"><span><h3>当前知识库模板</h3><p>默认在当前选中节点下创建，也可选择历史版本。</p></span><Button aria-label="刷新模板" title="刷新" disabled={!!templateBusy} onClick={() => void loadTemplates()}><RefreshCw size={15} /></Button></div>
          {templateBusy === "list" && templates.length === 0 ? <p className="knowledge-subtle">正在读取模板…</p> : templates.length === 0 ? <EmptyState><LayoutTemplate size={26} /><h3>还没有模板</h3><p>把当前页面及子页面保存为可复用模板。</p></EmptyState> : <div className="knowledge-template-list">{templates.map(template => <article key={template.id} className="knowledge-template-card"><div className="knowledge-template-card-icon"><PageTypeIcon type={template.root_content_type} size={18} /></div><div className="knowledge-template-card-main"><h4>{template.title}</h4><p>{template.description || "暂无说明"}</p><small>{template.node_count} 个页面 · 最新版本 {template.latest_version} · {new Date(template.updated_at).toLocaleString()}</small><div className="knowledge-template-card-actions"><Button className="primary" disabled={!!templateBusy} onClick={() => void instantiateTemplate(template)}>在当前节点下创建</Button>{client.listPageTemplateVersions && <Button disabled={!!templateBusy} aria-expanded={templateVersionOpen === template.id} onClick={() => void loadTemplateVersions(template.id)}><Clock3 size={14} />历史版本</Button>}{canWrite && selectedID && client.updatePageTemplate && <Button disabled={!!templateBusy} onClick={() => void updateTemplateFromCurrent(template)}><RefreshCw size={14} />用当前页面生成新版本</Button>}</div>{templateVersionOpen === template.id && <div className="knowledge-template-versions">{templateBusy === `versions:${template.id}` && !(templateVersions[template.id]?.length) ? <p>正在读取版本…</p> : (templateVersions[template.id] || []).map(item => <div key={item.version}><span><strong>版本 {item.version}</strong><small>{item.node_count} 个页面 · {new Date(item.created_at).toLocaleString()}</small></span><Button disabled={!!templateBusy} onClick={() => void instantiateTemplate(template, item.version)}>使用此版本</Button></div>)}</div>}</div></article>)}</div>}
        </section>
      </div>
    </section></div>, document.body)}
  </section>;
}
