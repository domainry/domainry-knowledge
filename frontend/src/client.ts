import { fileSHA256Header } from "./file-preview.ts";
import type {
  KnowledgeAccessExplanation, KnowledgeAIExecution, KnowledgeApplicationCard, KnowledgeClient, KnowledgeCollaborationServerEvent, KnowledgeCollaborationSession, KnowledgeCollaborationSyncResult,
  KnowledgeDocument, KnowledgeDocumentPage, KnowledgeLibrary, KnowledgeLibraryMemberPage, KnowledgeLibraryOrganizationMemberPage, KnowledgeLibraryPage,
  KnowledgeLibrarySources, KnowledgePage, KnowledgePageAccessPolicy, KnowledgePageAttachment, KnowledgePageAttachmentPage, KnowledgePageContentDecision, KnowledgePageContentPolicy, KnowledgePageShare, KnowledgePageSharePage, KnowledgePageSharedView,
  KnowledgeFormAnalytics, KnowledgeFormExport, KnowledgeFormSubmission, KnowledgeFormSubmissionPage, KnowledgeGridAutomationResult, KnowledgePageComment, KnowledgePageCommentPage, KnowledgePageEditHistoryPage, KnowledgePageMoveImpact, KnowledgePageNativeOperationResult, KnowledgePagePage, KnowledgePageSuggestion, KnowledgePageSuggestionPage, KnowledgePageVersion,
  KnowledgeGovernanceAuditPage, KnowledgePageCollectionKind, KnowledgePageCollectionPage, KnowledgePageIdentityPage, KnowledgePageLiveEvent, KnowledgePageMetadata, KnowledgePagePersonalState, KnowledgePagePollPage, KnowledgePagePollView, KnowledgePageReferenceCreateResult, KnowledgePageReferenceDirection, KnowledgePageReferencePage, KnowledgePageRelationshipGraph, KnowledgePageSearchEvent, KnowledgePageSearchPage, KnowledgePageTask, KnowledgePageTaskPage, KnowledgePageTemplate, KnowledgePageTemplateInstance, KnowledgePageTemplatePage, KnowledgePageTemplateVersionPage, KnowledgePageVersionDiff, KnowledgePageVersionPage, KnowledgePageView, KnowledgeOrganizationPrincipal, KnowledgePrincipal, KnowledgePrincipalPage,
  KnowledgeResult,
} from "./types.ts";
import { APIError, errorFrom, request, sessionFetch, sessionScope } from "./session.ts";

const librariesPath = "/knowledge/libraries";
const uploadChunkBytes = 8 * 1024 * 1024;
const documentPath = (libraryID: string, documentID?: string) => `${librariesPath}/${encodeURIComponent(libraryID)}/documents${documentID ? `/${encodeURIComponent(documentID)}` : ""}`;
const pagePath = (libraryID: string, pageID?: string) => `${librariesPath}/${encodeURIComponent(libraryID)}/pages${pageID ? `/${encodeURIComponent(pageID)}` : ""}`;
const templatePath = (libraryID: string, templateID?: string) => `${librariesPath}/${encodeURIComponent(libraryID)}/templates${templateID ? `/${encodeURIComponent(templateID)}` : ""}`;

async function sha256(bytes: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}

async function checked(response: Response) {
  if (response.ok) return response;
  throw await errorFrom(response);
}

async function readCollaborationEventStream(response: Response, onEvent: (event: KnowledgeCollaborationServerEvent) => void, signal: AbortSignal) {
  const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";
  if (!contentType.startsWith("text/event-stream") || !response.body) throw new APIError("knowledge.collaboration_stream_invalid", 502);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let eventID = "";
  let data: string[] = [];
  const dispatch = () => {
    if (data.length === 0) return;
    let value: KnowledgeCollaborationServerEvent;
    try {
      value = JSON.parse(data.join("\n")) as KnowledgeCollaborationServerEvent;
    } catch {
      throw new APIError("knowledge.collaboration_event_invalid", 502);
    }
    const clock = Number(eventID);
    if (!Number.isSafeInteger(value.clock) || value.clock < 0 || !Number.isSafeInteger(clock) || clock !== value.clock || value.type !== eventName || !["update", "snapshot", "presence", "revoked", "heartbeat"].includes(value.type)) {
      throw new APIError("knowledge.collaboration_event_invalid", 502);
    }
    onEvent(value);
  };
  try {
    while (true) {
      signal.throwIfAborted();
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (line === "") {
          dispatch();
          eventName = "message";
          eventID = "";
          data = [];
        } else if (!line.startsWith(":")) {
          const separator = line.indexOf(":");
          const field = separator < 0 ? line : line.slice(0, separator);
          const value = separator < 0 ? "" : line.slice(separator + 1).replace(/^ /, "");
          if (field === "event") eventName = value;
          else if (field === "id") eventID = value;
          else if (field === "data") data.push(value);
        }
        newline = buffer.indexOf("\n");
      }
      if (chunk.done) {
        if (buffer.trim() !== "") throw new APIError("knowledge.collaboration_event_invalid", 502);
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function readPageLiveEventStream(response: Response, expectedPageID: string, onEvent: (event: KnowledgePageLiveEvent) => void, signal: AbortSignal) {
  const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";
  if (!contentType.startsWith("text/event-stream") || !response.body) throw new APIError("knowledge.page_live_stream_invalid", 502);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let eventID = "";
  let data: string[] = [];
  const dispatch = () => {
    if (data.length === 0) return;
    let value: KnowledgePageLiveEvent;
    try {
      value = JSON.parse(data.join("\n")) as KnowledgePageLiveEvent;
    } catch {
      throw new APIError("knowledge.page_live_event_invalid", 502);
    }
    const revision = Number(eventID);
    if (value.page_id !== expectedPageID || !Number.isSafeInteger(value.revision) || value.revision < 0 || !Number.isSafeInteger(revision) || revision !== value.revision || value.type !== eventName || !["changed", "heartbeat", "revoked"].includes(value.type)) {
      throw new APIError("knowledge.page_live_event_invalid", 502);
    }
    onEvent(value);
  };
  try {
    while (true) {
      signal.throwIfAborted();
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (line === "") {
          dispatch(); eventName = "message"; eventID = ""; data = [];
        } else if (!line.startsWith(":")) {
          const separator = line.indexOf(":");
          const field = separator < 0 ? line : line.slice(0, separator);
          const value = separator < 0 ? "" : line.slice(separator + 1).replace(/^ /, "");
          if (field === "event") eventName = value;
          else if (field === "id") eventID = value;
          else if (field === "data") data.push(value);
        }
        newline = buffer.indexOf("\n");
      }
      if (chunk.done) {
        if (buffer.trim() !== "") throw new APIError("knowledge.page_live_event_invalid", 502);
        return;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

async function readPageSearchEventStream(response: Response, onEvent: (event: KnowledgePageSearchEvent) => void, signal: AbortSignal) {
  const contentType = response.headers.get("Content-Type")?.toLowerCase() || "";
  if (!contentType.startsWith("text/event-stream") || !response.body) throw new APIError("knowledge.page_search_stream_invalid", 502);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", eventName = "message", eventID = "";
  let data: string[] = [];
  const dispatch = () => {
    if (data.length === 0) return;
    let value: KnowledgePageSearchEvent;
    try { value = JSON.parse(data.join("\n")) as KnowledgePageSearchEvent; }
    catch { throw new APIError("knowledge.page_search_event_invalid", 502); }
    const revision = Number(eventID);
    if (!Number.isSafeInteger(value.revision) || value.revision < 0 || !Number.isSafeInteger(revision) || revision !== value.revision || value.type !== eventName || !["changed", "heartbeat", "revoked"].includes(value.type)) throw new APIError("knowledge.page_search_event_invalid", 502);
    onEvent(value);
  };
  try {
    while (true) {
      signal.throwIfAborted();
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (line === "") { dispatch(); eventName = "message"; eventID = ""; data = []; }
        else if (!line.startsWith(":")) {
          const separator = line.indexOf(":"), field = separator < 0 ? line : line.slice(0, separator), value = separator < 0 ? "" : line.slice(separator + 1).replace(/^ /, "");
          if (field === "event") eventName = value;
          else if (field === "id") eventID = value;
          else if (field === "data") data.push(value);
        }
        newline = buffer.indexOf("\n");
      }
      if (chunk.done) {
        if (buffer.trim() !== "") throw new APIError("knowledge.page_search_event_invalid", 502);
        return;
      }
    }
  } finally { reader.releaseLock(); }
}

export const knowledgeClient: KnowledgeClient = {
  search({ query, libraryID, signal }) {
    const parameters = new URLSearchParams({ query });
    if (libraryID) parameters.set("library_id", libraryID);
    return request<KnowledgeResult>(`/knowledge/search?${parameters}`, "GET", undefined, signal);
  },
  read(documentID, libraryID, signal) {
    const query = libraryID ? `?${new URLSearchParams({ library_id: libraryID })}` : "";
    return request<KnowledgeResult>(`/knowledge/retrieval/documents/${encodeURIComponent(documentID)}${query}`, "GET", undefined, signal);
  },
  listLibraries(after, limit, signal) { return request<KnowledgeLibraryPage>(`${librariesPath}?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  createLibrary({ kind, name, description = "", clientID }, signal) { return request<KnowledgeLibrary>(librariesPath, "POST", { kind, name, description, client_id: clientID }, signal); },
  getLibrary(libraryID, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}`, "GET", undefined, signal); },
  updateLibrary(libraryID, { name, description, expectedRevision }, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}`, "PATCH", { name, description, expected_revision: expectedRevision }, signal); },
  setLibraryArchived(libraryID, archived, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/${archived ? "archive" : "restore"}`, "POST", { expected_revision: expectedRevision }, signal); },
  listMembers(libraryID, after, limit, signal) { return request<KnowledgeLibraryMemberPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/members?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  setMember(libraryID, userID, role, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/${encodeURIComponent(userID)}`, "PUT", { role, expected_revision: expectedRevision }, signal); },
  removeMember(libraryID, userID, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/${encodeURIComponent(userID)}?expected_revision=${expectedRevision}`, "DELETE", undefined, signal); },
  listOrganizationMembers(libraryID, after, limit, signal) { return request<KnowledgeLibraryOrganizationMemberPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/organization-members?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  setOrganizationMember(libraryID, organizationID, role, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/organization-members/${encodeURIComponent(organizationID)}`, "PUT", { role, expected_revision: expectedRevision }, signal); },
  removeOrganizationMember(libraryID, organizationID, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/organization-members/${encodeURIComponent(organizationID)}?expected_revision=${expectedRevision}`, "DELETE", undefined, signal); },
  searchPrincipals(query, after, limit, signal) { return request<KnowledgePrincipalPage>(`/knowledge/principals?${new URLSearchParams({ query, after, limit: String(limit) })}`, "GET", undefined, signal); },
  resolvePrincipals(userIDs, signal) { return request<KnowledgePrincipal[]>("/knowledge/principals/resolve", "POST", { user_ids: userIDs }, signal); },
  resolveOrganizationPrincipals(organizationIDs, signal) { return request<KnowledgeOrganizationPrincipal[]>("/knowledge/organization-principals/resolve", "POST", { organization_ids: organizationIDs }, signal); },
  searchLibraryMembers(libraryID, query, after, limit, signal) { return request<KnowledgePrincipalPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/search?${new URLSearchParams({ query, after, limit: String(limit) })}`, "GET", undefined, signal); },
  explainAccess(libraryID, input, signal) { return request<KnowledgeAccessExplanation>(`${librariesPath}/${encodeURIComponent(libraryID)}/access/explain`, "POST", input, signal); },
  listPages(libraryID, parentPageID, after, limit, includeArchived, signal) { return request<KnowledgePagePage>(`${pagePath(libraryID)}?${new URLSearchParams({ parent_page_id: parentPageID, after, limit: String(limit), include_archived: String(includeArchived) })}`, "GET", undefined, signal); },
  getPage(libraryID, pageID, includeDraft, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}?draft=${includeDraft}`, "GET", undefined, signal); },
  getPagePersonalState(libraryID, pageID, signal) { return request<KnowledgePagePersonalState>(`${pagePath(libraryID, pageID)}/personal-state`, "GET", undefined, signal); },
  setPagePersonalState(libraryID, pageID, input, signal) { return request<KnowledgePagePersonalState>(`${pagePath(libraryID, pageID)}/personal-state`, "PUT", input, signal); },
  recordPageView(libraryID, pageID, input, signal) { return request<KnowledgePagePersonalState>(`${pagePath(libraryID, pageID)}/view`, "POST", input, signal); },
  listPageCollection(libraryID, kind: KnowledgePageCollectionKind, after, limit, signal) { return request<KnowledgePageCollectionPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/page-collections?${new URLSearchParams({ kind, after, limit: String(limit) })}`, "GET", undefined, signal); },
  getPageMetadata(libraryID, pageID, signal) { return request<KnowledgePageMetadata>(`${pagePath(libraryID, pageID)}/metadata`, "GET", undefined, signal); },
  setPageMetadata(libraryID, pageID, input, signal) { return request<KnowledgePageMetadata>(`${pagePath(libraryID, pageID)}/metadata`, "PUT", input, signal); },
  setPageGovernance(libraryID, pageID, input, signal) { return request<KnowledgePageMetadata>(`${pagePath(libraryID, pageID)}/governance`, "PUT", input, signal); },
  reviewPageGovernance(libraryID, pageID, input, signal) { return request<KnowledgePageMetadata>(`${pagePath(libraryID, pageID)}/governance/review`, "POST", input, signal); },
  listPageGovernanceAudit(libraryID, pageID, event, actorID, after, limit, signal) { return request<KnowledgeGovernanceAuditPage>(`${pagePath(libraryID, pageID)}/governance/audit?${new URLSearchParams({ event, actor_id: actorID, after, limit: String(limit) })}`, "GET", undefined, signal); },
  searchPages(libraryID, input, signal) { return request<KnowledgePageSearchPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/page-search`, "POST", input, signal); },
  searchPageIdentities(libraryID, query, limit, signal) { return request<KnowledgePageIdentityPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/page-identities?${new URLSearchParams({ query, limit: String(limit) })}`, "GET", undefined, signal); },
  getPageRelationshipGraph(libraryID, pageID, depth, limit, signal) { return request<KnowledgePageRelationshipGraph>(`${pagePath(libraryID, pageID)}/relationship-graph?${new URLSearchParams({ depth: String(depth), limit: String(limit) })}`, "GET", undefined, signal); },
  createPage(libraryID, input, signal) { return request<KnowledgePageView>(pagePath(libraryID), "POST", input, signal); },
  listPageReferences(libraryID, pageID, direction: KnowledgePageReferenceDirection, after, limit, signal) { return request<KnowledgePageReferencePage>(`${pagePath(libraryID, pageID)}/references?${new URLSearchParams({ direction, after, limit: String(limit) })}`, "GET", undefined, signal); },
  createPageReference(libraryID, pageID, input, signal) { return request<KnowledgePageReferenceCreateResult>(`${pagePath(libraryID, pageID)}/references`, "POST", input, signal); },
  savePageDraft(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/draft`, "PUT", input, signal); },
  applyPageNativeOperations(libraryID, pageID, input, signal) { return request<KnowledgePageNativeOperationResult>(`${pagePath(libraryID, pageID)}/native-operations`, "POST", input, signal); },
  executeGridAutomation(libraryID, pageID, input, signal) { return request<KnowledgeGridAutomationResult>(`${pagePath(libraryID, pageID)}/grid-automations/execute`, "POST", input, signal); },
  previewPageMove(libraryID, pageID, input, signal) { return request<KnowledgePageMoveImpact>(`${pagePath(libraryID, pageID)}/move/preview`, "POST", input, signal); },
  movePage(libraryID, pageID, input, signal) { return request<KnowledgePage>(`${pagePath(libraryID, pageID)}/move`, "POST", input, signal); },
  getPageAccess(libraryID, pageID, signal) { return request<KnowledgePageAccessPolicy>(`${pagePath(libraryID, pageID)}/access`, "GET", undefined, signal); },
  setPageAccess(libraryID, pageID, input, signal) { return request<KnowledgePageAccessPolicy>(`${pagePath(libraryID, pageID)}/access`, "PUT", input, signal); },
  getPageContentPolicy(libraryID, pageID, signal) { return request<KnowledgePageContentPolicy>(`${pagePath(libraryID, pageID)}/content-policy`, "GET", undefined, signal); },
  setPageContentPolicy(libraryID, pageID, input, signal) { return request<KnowledgePageContentPolicy>(`${pagePath(libraryID, pageID)}/content-policy`, "PUT", input, signal); },
  authorizePageContentOperation(libraryID, pageID, operation, signal) { return request<KnowledgePageContentDecision>(`${pagePath(libraryID, pageID)}/${operation === "copy" ? "content-copy" : operation}/authorize`, "POST", undefined, signal); },
  listPageShares(libraryID, pageID, after, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (after) query.set("after", after); return request<KnowledgePageSharePage>(`${pagePath(libraryID, pageID)}/shares?${query}`, "GET", undefined, signal); },
  createPageShare(libraryID, pageID, input, signal) { return request<KnowledgePageShare>(`${pagePath(libraryID, pageID)}/shares`, "POST", input, signal); },
  revokePageShare(libraryID, pageID, shareID, expectedRevision, signal) { return request<KnowledgePageShare>(`${pagePath(libraryID, pageID)}/shares/${encodeURIComponent(shareID)}/revoke`, "POST", { expected_revision: expectedRevision }, signal); },
  redeemPageShare(shareID, password, signal) { return request<KnowledgePageShare>(`/knowledge/page-shares/${encodeURIComponent(shareID)}/redeem`, "POST", { password }, signal); },
  readPageShare(shareID, pageID, signal) { return request<KnowledgePageSharedView>(`/knowledge/page-shares/${encodeURIComponent(shareID)}/pages/${encodeURIComponent(pageID)}`, "GET", undefined, signal); },
  authorizePageShareContentOperation(shareID, pageID, operation, signal) { return request<KnowledgePageContentDecision>(`/knowledge/page-shares/${encodeURIComponent(shareID)}/pages/${encodeURIComponent(pageID)}/${operation === "copy" ? "content-copy" : operation}/authorize`, "POST", undefined, signal); },
  copyPage(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/copy`, "POST", input, signal); },
  reorderPages(libraryID, input, signal) { return request<KnowledgePagePage>(`${pagePath(libraryID)}/reorder`, "POST", input, signal); },
  setPageArchived(libraryID, pageID, archived, input, signal) { return request<KnowledgePage>(`${pagePath(libraryID, pageID)}/${archived ? "archive" : "restore"}`, "POST", input, signal); },
  publishPage(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/publish`, "POST", input, signal); },
  connectKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgeCollaborationSession>(`${pagePath(libraryID, pageID)}/collaboration/connect`, "POST", input, signal); },
  syncKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgeCollaborationSyncResult>(`${pagePath(libraryID, pageID)}/collaboration/sync`, "POST", input, signal); },
  async streamKnowledgeCollaborationEvents(libraryID, pageID, sessionID, afterClock, connectionAttempt, onEvent, signal) {
    const response = await checked(await sessionFetch(`${pagePath(libraryID, pageID)}/collaboration/${encodeURIComponent(sessionID)}/events`, { method: "GET", headers: { Accept: "text/event-stream", "Last-Event-ID": String(afterClock), "X-Knowledge-Collaboration-Attempt": String(connectionAttempt) }, signal }));
    await readCollaborationEventStream(response, onEvent, signal);
  },
  async streamKnowledgePageLiveEvents(libraryID, pageID, afterRevision, onEvent, signal) {
    const response = await checked(await sessionFetch(`${pagePath(libraryID, pageID)}/live-events`, { method: "GET", headers: { Accept: "text/event-stream", "Last-Event-ID": String(afterRevision) }, signal }));
    await readPageLiveEventStream(response, pageID, onEvent, signal);
  },
  async streamKnowledgePageSearchEvents(libraryID, afterRevision, onEvent, signal) {
    const response = await checked(await sessionFetch(`${librariesPath}/${encodeURIComponent(libraryID)}/page-search/events`, { method: "GET", headers: { Accept: "text/event-stream", "Last-Event-ID": String(afterRevision) }, signal }));
    await readPageSearchEventStream(response, onEvent, signal);
  },
  closeKnowledgeCollaboration(libraryID, pageID, sessionID, signal) { return request<void>(`${pagePath(libraryID, pageID)}/collaboration/${encodeURIComponent(sessionID)}`, "DELETE", undefined, signal); },
  publishKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/collaboration/publish`, "POST", input, signal); },
  createAIExecution(libraryID, pageID, input, signal) { return request<KnowledgeAIExecution>(`${pagePath(libraryID, pageID)}/ai-executions`, "POST", input, signal); },
  getAIExecution(libraryID, pageID, executionID, signal) { return request<KnowledgeAIExecution>(`${pagePath(libraryID, pageID)}/ai-executions/${encodeURIComponent(executionID)}`, "GET", undefined, signal); },
  confirmAIExecution(libraryID, pageID, executionID, input, signal) { return request<KnowledgeAIExecution>(`${pagePath(libraryID, pageID)}/ai-executions/${encodeURIComponent(executionID)}/confirm`, "POST", input, signal); },
  resolveApplicationCard(libraryID, pageID, input, signal) { return request<KnowledgeApplicationCard>(`${pagePath(libraryID, pageID)}/application-cards/resolve`, "POST", input, signal); },
  listPageVersions(libraryID, pageID, before, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (before > 0) query.set("before", String(before)); return request<KnowledgePageVersionPage>(`${pagePath(libraryID, pageID)}/versions?${query}`, "GET", undefined, signal); },
  listPageEditHistory(libraryID, pageID, before, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (before > 0) query.set("before", String(before)); return request<KnowledgePageEditHistoryPage>(`${pagePath(libraryID, pageID)}/edit-history?${query}`, "GET", undefined, signal); },
  listPageSuggestions(libraryID, pageID, signal) { return request<KnowledgePageSuggestionPage>(`${pagePath(libraryID, pageID)}/suggestions`, "GET", undefined, signal); },
  createPageSuggestion(libraryID, pageID, input, signal) { return request<KnowledgePageSuggestion>(`${pagePath(libraryID, pageID)}/suggestions`, "POST", input, signal); },
  decidePageSuggestion(libraryID, pageID, suggestionID, input, signal) { return request<KnowledgePageSuggestion>(`${pagePath(libraryID, pageID)}/suggestions/${encodeURIComponent(suggestionID)}/decision`, "POST", input, signal); },
  getPageVersion(libraryID, pageID, version, signal) { return request<KnowledgePageVersion>(`${pagePath(libraryID, pageID)}/versions/${version}`, "GET", undefined, signal); },
  diffPageVersions(libraryID, pageID, fromVersion, toVersion, signal) { return request<KnowledgePageVersionDiff>(`${pagePath(libraryID, pageID)}/versions/diff`, "POST", { from_version: fromVersion, to_version: toVersion }, signal); },
  restorePageVersion(libraryID, pageID, version, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/versions/${version}/restore`, "POST", input, signal); },
  listPageComments(libraryID, pageID, after, limit, unresolved, signal) { return request<KnowledgePageCommentPage>(`${pagePath(libraryID, pageID)}/comments?${new URLSearchParams({ after, limit: String(limit), unresolved: String(unresolved) })}`, "GET", undefined, signal); },
  createPageComment(libraryID, pageID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments`, "POST", input, signal); },
  updatePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}`, "PUT", input, signal); },
  resolvePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}/resolve`, "POST", input, signal); },
  deletePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}`, "DELETE", input, signal); },
  setPageCommentReaction(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}/reaction`, "PUT", input, signal); },
  listPageAttachments(libraryID, pageID, signal) { return request<KnowledgePageAttachmentPage>(`${pagePath(libraryID, pageID)}/attachments`, "GET", undefined, signal); },
  setPageAttachment(libraryID, pageID, documentID, input, signal) { return request<KnowledgePageAttachment>(`${pagePath(libraryID, pageID)}/attachments/${encodeURIComponent(documentID)}`, "PUT", input, signal); },
  removePageAttachment(libraryID, pageID, documentID, input, signal) { return request<void>(`${pagePath(libraryID, pageID)}/attachments/${encodeURIComponent(documentID)}`, "DELETE", input, signal); },
  listPageTasks(libraryID, pageID, signal) { return request<KnowledgePageTaskPage>(`${pagePath(libraryID, pageID)}/tasks`, "GET", undefined, signal); },
  createPageTask(libraryID, pageID, input, signal) { return request<KnowledgePageTask>(`${pagePath(libraryID, pageID)}/tasks`, "POST", input, signal); },
  updatePageTask(libraryID, pageID, taskID, input, signal) { return request<KnowledgePageTask>(`${pagePath(libraryID, pageID)}/tasks/${encodeURIComponent(taskID)}`, "PUT", input, signal); },
  listPagePolls(libraryID, pageID, signal) { return request<KnowledgePagePollPage>(`${pagePath(libraryID, pageID)}/polls`, "GET", undefined, signal); },
  createPagePoll(libraryID, pageID, input, signal) { return request<KnowledgePagePollView>(`${pagePath(libraryID, pageID)}/polls`, "POST", input, signal); },
  updatePagePoll(libraryID, pageID, pollID, input, signal) { return request<KnowledgePagePollView>(`${pagePath(libraryID, pageID)}/polls/${encodeURIComponent(pollID)}`, "PUT", input, signal); },
  votePagePoll(libraryID, pageID, pollID, input, signal) { return request<KnowledgePagePollView>(`${pagePath(libraryID, pageID)}/polls/${encodeURIComponent(pollID)}/ballot`, "PUT", input, signal); },
  submitPageForm(libraryID, pageID, input, signal) { return request<KnowledgeFormSubmission>(`${pagePath(libraryID, pageID)}/form/submissions`, "POST", input, signal); },
  listPageFormSubmissions(libraryID, pageID, before, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (before) query.set("before", before); return request<KnowledgeFormSubmissionPage>(`${pagePath(libraryID, pageID)}/form/submissions?${query}`, "GET", undefined, signal); },
  getPageFormAnalytics(libraryID, pageID, signal) { return request<KnowledgeFormAnalytics>(`${pagePath(libraryID, pageID)}/form/analytics`, "GET", undefined, signal); },
  exportPageFormSubmissions(libraryID, pageID, signal) { return request<KnowledgeFormExport>(`${pagePath(libraryID, pageID)}/form/submissions/export`, "GET", undefined, signal); },
  listPageTemplates(libraryID, after, limit, signal) { return request<KnowledgePageTemplatePage>(`${templatePath(libraryID)}?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  createPageTemplate(libraryID, input, signal) { return request<KnowledgePageTemplate>(templatePath(libraryID), "POST", input, signal); },
  updatePageTemplate(libraryID, templateID, input, signal) { return request<KnowledgePageTemplate>(templatePath(libraryID, templateID), "PUT", input, signal); },
  listPageTemplateVersions(libraryID, templateID, before, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (before > 0) query.set("before", String(before)); return request<KnowledgePageTemplateVersionPage>(`${templatePath(libraryID, templateID)}/versions?${query}`, "GET", undefined, signal); },
  instantiatePageTemplate(libraryID, templateID, input, signal) { return request<KnowledgePageTemplateInstance>(`${templatePath(libraryID, templateID)}/instantiate`, "POST", input, signal); },
  listSources(libraryID, after, limit, signal) { return request<KnowledgeLibrarySources>(`${librariesPath}/${encodeURIComponent(libraryID)}/sources?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  bindSource(libraryID, datasourceKey, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/source`, "PUT", { datasource_key: datasourceKey, expected_revision: expectedRevision }, signal); },
  listDocuments(libraryID, after, limit, signal) { return request<KnowledgeDocumentPage>(`${documentPath(libraryID)}?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  getDocument(libraryID, documentID, signal) { return request<KnowledgeDocument>(documentPath(libraryID, documentID), "GET", undefined, signal); },
  async uploadDocument({ libraryID, file, clientID, sha256: fileSHA256, signal, onProgress }) {
    const scope = sessionScope();
    let offset = 0;
    while (offset < file.size) {
      signal.throwIfAborted();
      const end = Math.min(file.size, offset + uploadChunkBytes);
      const chunk = file.slice(offset, end);
      const chunkSHA256 = await sha256(await chunk.arrayBuffer());
      const response = await checked(await sessionFetch(`${documentPath(libraryID)}?${new URLSearchParams({ client_id: clientID, filename: file.name })}`, { method: "POST", headers: { "Content-Type": "application/octet-stream", "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`, "Idempotency-Key": `${clientID}:${offset}:${end}`, "X-Knowledge-File-SHA256": fileSHA256, "X-Knowledge-Chunk-SHA256": chunkSHA256 }, body: chunk, signal }));
      const progress = await response.json() as { next_offset?: unknown; complete?: unknown; document?: KnowledgeDocument };
      if (scope !== sessionScope()) throw new APIError("knowledge.identity_changed", 409);
      if (!Number.isSafeInteger(progress.next_offset) || Number(progress.next_offset) <= offset || Number(progress.next_offset) < end || Number(progress.next_offset) > file.size || Number(progress.next_offset) !== file.size && Number(progress.next_offset) % uploadChunkBytes !== 0) throw new APIError("knowledge.document_response_invalid", 502);
      offset = Number(progress.next_offset);
      onProgress?.(offset, file.size);
      if (progress.complete === true) {
        if (offset !== file.size || !progress.document || progress.document.library_id !== libraryID || progress.document.sha256 !== fileSHA256) throw new APIError("knowledge.document_response_invalid", 502);
        return progress.document;
      }
      if (progress.complete !== false || offset === file.size) throw new APIError("knowledge.document_response_invalid", 502);
    }
    throw new APIError("knowledge.document_response_invalid", 502);
  },
  retryDocument(libraryID, documentID, expectedRevision, signal) { return request<KnowledgeDocument>(`${documentPath(libraryID, documentID)}/retry?expected_revision=${expectedRevision}`, "POST", undefined, signal); },
  reindexDocument(libraryID, documentID, expectedRevision, signal) { return request<KnowledgeDocument>(`${documentPath(libraryID, documentID)}/reindex?expected_revision=${expectedRevision}`, "POST", undefined, signal); },
  deleteDocument(libraryID, documentID, expectedRevision, signal) { return request<KnowledgeDocument>(`${documentPath(libraryID, documentID)}?expected_revision=${expectedRevision}`, "DELETE", undefined, signal); },
  transferDocument({ source, targetLibraryID, mode, clientID, signal }) { return request<KnowledgeDocument>(`${documentPath(targetLibraryID)}/transfer`, "POST", { client_id: clientID, source_library_id: source.library_id, source_document_id: source.id, expected_revision: source.revision, mode }, signal); },
  async readDocumentContent(libraryID, documentID, { signal, range }) {
    const response = await sessionFetch(`${documentPath(libraryID, documentID)}/content`, { method: "GET", headers: range ? { Range: range } : undefined, signal });
    const headers = new Headers(response.headers);
    const digest = headers.get("X-Knowledge-File-SHA256");
    headers.delete("X-Knowledge-File-SHA256");
    if (digest) headers.set(fileSHA256Header, digest);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
  async readPageDocumentContent(libraryID, pageID, documentID, { signal, range }) {
    const response = await sessionFetch(`${pagePath(libraryID, pageID)}/documents/${encodeURIComponent(documentID)}/download`, { method: "GET", headers: range ? { Range: range } : undefined, signal });
    const headers = new Headers(response.headers);
    const digest = headers.get("X-Knowledge-File-SHA256");
    headers.delete("X-Knowledge-File-SHA256");
    if (digest) headers.set(fileSHA256Header, digest);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
  scope: sessionScope,
};
