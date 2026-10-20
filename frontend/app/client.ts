import { fileSHA256Header } from "../src/file-preview.ts";
import type {
  KnowledgeAccessExplanation, KnowledgeClient, KnowledgeCollaborationSession, KnowledgeCollaborationSyncResult,
  KnowledgeDocument, KnowledgeDocumentPage, KnowledgeLibrary, KnowledgeLibraryMemberPage, KnowledgeLibraryPage,
  KnowledgeLibrarySources, KnowledgePage, KnowledgePageAccessPolicy, KnowledgePageAttachment, KnowledgePageAttachmentPage,
  KnowledgePageComment, KnowledgePageCommentPage, KnowledgePageMoveImpact, KnowledgePagePage, KnowledgePageVersion,
  KnowledgePageVersionDiff, KnowledgePageVersionPage, KnowledgePageView, KnowledgePrincipal, KnowledgePrincipalPage,
  KnowledgeResult,
} from "../src/types.ts";
import { APIError, errorFrom, request, sessionFetch, sessionScope } from "./session.ts";

const librariesPath = "/knowledge/libraries";
const uploadChunkBytes = 8 * 1024 * 1024;
const documentPath = (libraryID: string, documentID?: string) => `${librariesPath}/${encodeURIComponent(libraryID)}/documents${documentID ? `/${encodeURIComponent(documentID)}` : ""}`;
const pagePath = (libraryID: string, pageID?: string) => `${librariesPath}/${encodeURIComponent(libraryID)}/pages${pageID ? `/${encodeURIComponent(pageID)}` : ""}`;

async function sha256(bytes: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}

async function checked(response: Response) {
  if (response.ok) return response;
  throw await errorFrom(response);
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
  createLibrary({ kind, name, clientID }, signal) { return request<KnowledgeLibrary>(librariesPath, "POST", { kind, name, client_id: clientID }, signal); },
  getLibrary(libraryID, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}`, "GET", undefined, signal); },
  updateLibrary(libraryID, { name, description, expectedRevision }, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}`, "PATCH", { name, description, expected_revision: expectedRevision }, signal); },
  setLibraryArchived(libraryID, archived, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/${archived ? "archive" : "restore"}`, "POST", { expected_revision: expectedRevision }, signal); },
  listMembers(libraryID, after, limit, signal) { return request<KnowledgeLibraryMemberPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/members?${new URLSearchParams({ after, limit: String(limit) })}`, "GET", undefined, signal); },
  setMember(libraryID, userID, role, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/${encodeURIComponent(userID)}`, "PUT", { role, expected_revision: expectedRevision }, signal); },
  removeMember(libraryID, userID, expectedRevision, signal) { return request<KnowledgeLibrary>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/${encodeURIComponent(userID)}?expected_revision=${expectedRevision}`, "DELETE", undefined, signal); },
  searchPrincipals(query, after, limit, signal) { return request<KnowledgePrincipalPage>(`/knowledge/principals?${new URLSearchParams({ query, after, limit: String(limit) })}`, "GET", undefined, signal); },
  resolvePrincipals(userIDs, signal) { return request<KnowledgePrincipal[]>("/knowledge/principals/resolve", "POST", { user_ids: userIDs }, signal); },
  searchLibraryMembers(libraryID, query, after, limit, signal) { return request<KnowledgePrincipalPage>(`${librariesPath}/${encodeURIComponent(libraryID)}/members/search?${new URLSearchParams({ query, after, limit: String(limit) })}`, "GET", undefined, signal); },
  explainAccess(libraryID, input, signal) { return request<KnowledgeAccessExplanation>(`${librariesPath}/${encodeURIComponent(libraryID)}/access/explain`, "POST", input, signal); },
  listPages(libraryID, parentPageID, after, limit, includeArchived, signal) { return request<KnowledgePagePage>(`${pagePath(libraryID)}?${new URLSearchParams({ parent_page_id: parentPageID, after, limit: String(limit), include_archived: String(includeArchived) })}`, "GET", undefined, signal); },
  getPage(libraryID, pageID, includeDraft, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}?draft=${includeDraft}`, "GET", undefined, signal); },
  createPage(libraryID, input, signal) { return request<KnowledgePageView>(pagePath(libraryID), "POST", input, signal); },
  savePageDraft(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/draft`, "PUT", input, signal); },
  previewPageMove(libraryID, pageID, input, signal) { return request<KnowledgePageMoveImpact>(`${pagePath(libraryID, pageID)}/move/preview`, "POST", input, signal); },
  movePage(libraryID, pageID, input, signal) { return request<KnowledgePage>(`${pagePath(libraryID, pageID)}/move`, "POST", input, signal); },
  getPageAccess(libraryID, pageID, signal) { return request<KnowledgePageAccessPolicy>(`${pagePath(libraryID, pageID)}/access`, "GET", undefined, signal); },
  setPageAccess(libraryID, pageID, input, signal) { return request<KnowledgePageAccessPolicy>(`${pagePath(libraryID, pageID)}/access`, "PUT", input, signal); },
  copyPage(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/copy`, "POST", input, signal); },
  reorderPages(libraryID, input, signal) { return request<KnowledgePagePage>(`${pagePath(libraryID)}/reorder`, "POST", input, signal); },
  setPageArchived(libraryID, pageID, archived, input, signal) { return request<KnowledgePage>(`${pagePath(libraryID, pageID)}/${archived ? "archive" : "restore"}`, "POST", input, signal); },
  publishPage(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/publish`, "POST", input, signal); },
  connectKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgeCollaborationSession>(`${pagePath(libraryID, pageID)}/collaboration/connect`, "POST", input, signal); },
  syncKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgeCollaborationSyncResult>(`${pagePath(libraryID, pageID)}/collaboration/sync`, "POST", input, signal); },
  closeKnowledgeCollaboration(libraryID, pageID, sessionID, signal) { return request<void>(`${pagePath(libraryID, pageID)}/collaboration/${encodeURIComponent(sessionID)}`, "DELETE", undefined, signal); },
  publishKnowledgeCollaboration(libraryID, pageID, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/collaboration/publish`, "POST", input, signal); },
  listPageVersions(libraryID, pageID, before, limit, signal) { const query = new URLSearchParams({ limit: String(limit) }); if (before > 0) query.set("before", String(before)); return request<KnowledgePageVersionPage>(`${pagePath(libraryID, pageID)}/versions?${query}`, "GET", undefined, signal); },
  getPageVersion(libraryID, pageID, version, signal) { return request<KnowledgePageVersion>(`${pagePath(libraryID, pageID)}/versions/${version}`, "GET", undefined, signal); },
  diffPageVersions(libraryID, pageID, fromVersion, toVersion, signal) { return request<KnowledgePageVersionDiff>(`${pagePath(libraryID, pageID)}/versions/diff`, "POST", { from_version: fromVersion, to_version: toVersion }, signal); },
  restorePageVersion(libraryID, pageID, version, input, signal) { return request<KnowledgePageView>(`${pagePath(libraryID, pageID)}/versions/${version}/restore`, "POST", input, signal); },
  listPageComments(libraryID, pageID, after, limit, unresolved, signal) { return request<KnowledgePageCommentPage>(`${pagePath(libraryID, pageID)}/comments?${new URLSearchParams({ after, limit: String(limit), unresolved: String(unresolved) })}`, "GET", undefined, signal); },
  createPageComment(libraryID, pageID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments`, "POST", input, signal); },
  updatePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}`, "PUT", input, signal); },
  resolvePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}/resolve`, "POST", input, signal); },
  deletePageComment(libraryID, pageID, commentID, input, signal) { return request<KnowledgePageComment>(`${pagePath(libraryID, pageID)}/comments/${encodeURIComponent(commentID)}`, "DELETE", input, signal); },
  listPageAttachments(libraryID, pageID, signal) { return request<KnowledgePageAttachmentPage>(`${pagePath(libraryID, pageID)}/attachments`, "GET", undefined, signal); },
  setPageAttachment(libraryID, pageID, documentID, input, signal) { return request<KnowledgePageAttachment>(`${pagePath(libraryID, pageID)}/attachments/${encodeURIComponent(documentID)}`, "PUT", input, signal); },
  removePageAttachment(libraryID, pageID, documentID, input, signal) { return request<void>(`${pagePath(libraryID, pageID)}/attachments/${encodeURIComponent(documentID)}`, "DELETE", input, signal); },
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
      const response = await checked(await sessionFetch(`${documentPath(libraryID)}?${new URLSearchParams({ client_id: clientID, filename: file.name })}`, { method: "POST", headers: { "Content-Type": "application/octet-stream", "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`, "X-Knowledge-File-SHA256": fileSHA256, "X-Knowledge-Chunk-SHA256": chunkSHA256 }, body: chunk, signal }));
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
  scope: sessionScope,
};
