export type KnowledgeCitation = {
    id: string;
    provider: string;
    kb_id: string;
    operation: "search" | "fetch";
    doc_id: string;
    library_id?: string;
    chunk_id?: string;
    document_version?: number;
    content_sha256?: string;
    source_revision?: string;
    score?: number;
    title?: string;
    url?: string;
    excerpt?: string;
    excerpt_truncated?: boolean;
    location?: FilePreviewLocation;
    page_id?: string;
    page_version?: number;
};
export type KnowledgePageContent = {
    content_schema_version: number;
    content: string;
    content_sha256: string;
    plain_text: string;
    summary?: string;
};
export type KnowledgePageContentType = "document" | "multidimensional_table" | "spreadsheet" | "presentation" | "form" | "mind_note" | "whiteboard" | "mind_map" | "flowchart";
export type KnowledgePage = {
    id: string;
    library_id: string;
    parent_page_id?: string;
    rank: string;
    title: string;
    content_type: KnowledgePageContentType;
    state: "active" | "archived";
    published_version?: number;
    projection_status?: "none" | "queued" | "indexing" | "ready" | "failed";
    access_mode: "inherit" | "restricted";
    access_revision: number;
    access_status: "ready" | "queued" | "applying" | "failed";
    revision: number;
    created_by_user_id: string;
    updated_by_user_id: string;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageDraft = {
    page_id: string;
    library_id: string;
    base_published_version: number;
    draft_revision: number;
    title: string;
    content_type: KnowledgePageContentType;
    parent_page_id?: string;
    rank: string;
    body: KnowledgePageContent;
    updated_by_user_id: string;
    updated_at: string;
};
export type KnowledgePageVersion = {
    page_id: string;
    library_id: string;
    version: number;
    title: string;
    content_type: KnowledgePageContentType;
    parent_page_id?: string;
    rank: string;
    body: KnowledgePageContent;
    published_by_user_id: string;
    published_at: string;
    publish_note?: string;
};
export type KnowledgePageView = {
    page: KnowledgePage;
    published?: KnowledgePageVersion;
    draft?: KnowledgePageDraft;
    breadcrumbs: {
        page_id: string;
        title: string;
    }[];
};
export type KnowledgePagePage = {
    items: KnowledgePage[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageVersionPage = {
    items: KnowledgePageVersion[];
    next_before?: number;
    complete: boolean;
};
export type KnowledgeDiffOp = {
    kind: "equal" | "insert" | "delete";
    text: string;
};
export type KnowledgePageVersionDiff = {
    from_version: number;
    to_version: number;
    title: KnowledgeDiffOp[];
    parent: KnowledgeDiffOp[];
    content: KnowledgeDiffOp[];
};
export type KnowledgePageConflict = {
    current_draft_revision: number;
    base_published_version: number;
    current_content_sha256: string;
    current_updated_at: string;
};
export type KnowledgeCollaborationUpdate = {
    client_id: string;
    update_id: string;
    title?: string;
    yjs_update?: string;
    yjs_state: string;
    content: string;
    content_sha256: string;
    edited_block_ids?: string[];
};
export type KnowledgeCollaborationSnapshot = {
    page_id: string;
    draft_revision: number;
    server_clock: number;
    title: string;
    content: string;
    content_sha256: string;
    yjs_state?: string;
};
export type KnowledgeCollaborationPresence = {
    session_id: string;
    user_id: string;
    display_name?: string;
    cursor_block_id?: string;
    selection_block_id?: string;
    edited_blocks: number;
    last_seen_at: string;
};
export type KnowledgeCollaborationSession = {
    id: string;
    library_id: string;
    page_id: string;
    client_id: string;
    user_id: string;
    state: "connected" | "revoked" | "closed" | "expired";
    server_clock: number;
    expires_at: string;
    snapshot: KnowledgeCollaborationSnapshot;
    presence: KnowledgeCollaborationPresence[];
};
export type KnowledgeCollaborationUpdateEvent = {
    clock: number;
    user_id?: string;
    update?: KnowledgeCollaborationUpdate;
    snapshot?: KnowledgeCollaborationSnapshot;
};
export type KnowledgeCollaborationSyncResult = {
    session: KnowledgeCollaborationSession;
    events: KnowledgeCollaborationUpdateEvent[];
    applied: boolean;
    complete: boolean;
};
export type KnowledgeCollaborationServerEvent = {
    type: "update" | "snapshot" | "presence" | "revoked" | "heartbeat";
    clock: number;
    user_id?: string;
    update?: KnowledgeCollaborationUpdate;
    snapshot?: KnowledgeCollaborationSnapshot;
    presence?: KnowledgeCollaborationPresence[];
    code?: string;
};
export type KnowledgePageAccessGrant = {
    user_id: string;
    role: "reader" | "editor" | "manager";
    scope: "page" | "subtree";
    created_by_user_id?: string;
    created_at?: string;
};
export type KnowledgePageAccessPolicy = {
    page_id: string;
    library_id: string;
    mode: "inherit" | "restricted";
    revision: number;
    projection_status: "ready" | "queued" | "applying" | "failed";
    grants: KnowledgePageAccessGrant[];
    updated_by_user_id: string;
    updated_at: string;
};
export type KnowledgePageMoveImpact = {
    page_id: string;
    parent_page_id?: string;
    affected_pages: number;
    changed_user_ids: string[];
    requires_confirm: boolean;
    token: string;
};
export type KnowledgePageComment = {
    id: string;
    page_id: string;
    library_id: string;
    parent_comment_id?: string;
    published_version: number;
    anchor: {
        node_id?: string;
        quote?: string;
        changed?: boolean;
    };
    body: string;
    mentioned_user_ids: string[];
    author_user_id: string;
    resolved: boolean;
    resolved_by_user_id?: string;
    deleted: boolean;
    revision: number;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageCommentPage = {
    items: KnowledgePageComment[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageAttachment = {
    page_id: string;
    library_id: string;
    document_id: string;
    title: string;
    rank: string;
    created_by_user_id: string;
    created_at: string;
};
export type KnowledgePageAttachmentPage = {
    items: KnowledgePageAttachment[];
};
export type KnowledgePrincipal = {
    user_id: string;
    display_name: string;
    email?: string;
    avatar_url?: string;
    status: string;
};
export type KnowledgePrincipalPage = {
    items: KnowledgePrincipal[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgeAccessLayer = {
    allowed: boolean;
    code: string;
    label: string;
    source?: string;
};
export type KnowledgeAccessExplanation = {
    user_id: string;
    library_id: string;
    page_id?: string;
    action: string;
    identity: KnowledgeAccessLayer;
    library: KnowledgeAccessLayer;
    page: KnowledgeAccessLayer;
    final: KnowledgeAccessLayer;
    library_role?: string;
    inherited_from?: string;
    impact_pages: number;
    proposed?: boolean;
};
export type KnowledgeResult = {
    library_id?: string;
    provider: string;
    kb_id: string;
    operation: "search" | "fetch";
    query?: string;
    doc_id?: string;
    search_top_k?: number;
    search_mode?: "hybrid" | "dense" | "sparse";
    search_reranked?: boolean;
    search_degraded_reason?: "embedder_unavailable" | "bm25_unavailable" | "rerank_unavailable";
    citations?: KnowledgeCitation[];
    data: unknown;
};
export type KnowledgeLibrary = {
    id: string;
    kind: "personal" | "shared";
    name: string;
    description: string;
    role: string;
    owner_user_id: string;
    archived: boolean;
    revision: number;
    knowledge_configured?: boolean;
    documents_configured?: boolean;
    sources_manageable?: boolean;
    datasource_key?: string;
    document_max_bytes?: number;
    document_index_max_bytes?: number;
    document_formats?: KnowledgeDocumentFormat[];
};
export type KnowledgeDocumentFormat = {
    extension: string;
    content_type: string;
    parser_route: string;
    builder_max_bytes?: number;
    asset_max_bytes?: number;
    enrichment_max_bytes?: number;
    analysis_output_max_bytes?: number;
};
export type KnowledgeDocument = {
    id: string;
    library_id: string;
    filename: string;
    content_type: string;
    bytes: number;
    sha256: string;
    content_version: number;
    index_generation: number;
    reindexing?: boolean;
    created_by_user_id: string;
    state: "uploading" | "quarantined" | "scanning" | "queued" | "indexing" | "ready" | "failed" | "needs_reconcile" | "deleting" | "deleted";
    processing_stage: "upload" | "scan" | "parse" | "chunk" | "index" | "complete" | "failed" | "delete";
    security_status: "pending" | "scanning" | "clean" | "rejected";
    security_scanner?: string;
    security_report_sha256?: string;
    index_status?: string;
    error_code?: string;
    revision: number;
    created_at: string;
    updated_at: string;
};
export type KnowledgeLibraryPage = {
    items: KnowledgeLibrary[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgeDocumentPage = {
    items: KnowledgeDocument[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgeLibraryMember = {
    user_id: string;
    role: "reader" | "editor" | "manager";
};
export type KnowledgeLibraryMemberPage = {
    items: KnowledgeLibraryMember[];
    revision: number;
    next_after?: string;
    complete: boolean;
};
export type KnowledgeDatasourceChoice = {
    key: string;
    name: string;
    description?: string;
    available: boolean;
};
export type KnowledgeLibrarySources = {
    library_id: string;
    revision: number;
    current_key?: string;
    status: "unbound" | "connected" | "unavailable" | "host_managed";
    items: KnowledgeDatasourceChoice[];
    next_after?: string;
    complete: boolean;
    can_bind: boolean;
};
export type KnowledgeTransferSource = Pick<KnowledgeDocument, "id" | "library_id" | "filename" | "bytes" | "sha256" | "revision">;
export type KnowledgeTransferRequest = {
    source: KnowledgeTransferSource;
    targetLibraryID: string;
    mode: "copy" | "move";
    clientID: string;
    signal: AbortSignal;
};
export type KnowledgeContentRequest = {
    signal: AbortSignal;
    range?: string;
};
export type KnowledgeUploadRequest = {
    libraryID: string;
    file: File;
    clientID: string;
    sha256: string;
    signal: AbortSignal;
    onProgress?: (uploadedBytes: number, totalBytes: number) => void;
};
export type KnowledgeSearchRequest = {
    query: string;
    libraryID?: string;
    signal: AbortSignal;
};
export type FilePreviewLocation = {
    page?: number;
    slide?: number;
    section?: string;
    chunk_id?: string;
    sheet?: string;
    row?: number;
    row_end?: number;
    cell?: string;
    line?: number;
    line_end?: number;
    paragraph?: number;
    json_path?: string;
    html_id?: string;
    start_ms?: number;
    end_ms?: number;
    media_kind?: "audio" | "video";
};
export type FilePreviewDescriptor = {
    filename: string;
    bytes?: number;
    sha256?: string;
    location?: FilePreviewLocation;
};
export type FilePreviewReadRequest = {
    signal: AbortSignal;
    range?: string;
};
/**
 * Product-neutral original-file boundary. A host owns authorization and route
 * construction; the shared viewer owns response validation and rendering.
 */
export interface FilePreviewSource {
    identity: string;
    file: FilePreviewDescriptor;
    /** Same-origin, currently authorized Range endpoint for browser media playback. */
    streamURL?: string;
    read(request: FilePreviewReadRequest): Promise<Response>;
}
/**
 * Browser boundary owned by the consuming product. The reusable feature never
 * constructs product routes, owns credentials, or depends on an Agent session.
 */
export interface KnowledgeClient {
    search(request: KnowledgeSearchRequest): Promise<KnowledgeResult>;
    read(documentID: string, libraryID: string | undefined, signal: AbortSignal): Promise<KnowledgeResult>;
    listLibraries(after: string, limit: number, signal: AbortSignal): Promise<KnowledgeLibraryPage>;
    createLibrary(request: {
        kind: "personal" | "shared";
        name: string;
        clientID: string;
    }, signal: AbortSignal): Promise<KnowledgeLibrary>;
    getLibrary(libraryID: string, signal: AbortSignal): Promise<KnowledgeLibrary>;
    updateLibrary(libraryID: string, request: {
        name: string;
        description: string;
        archived: boolean;
        expectedRevision: number;
    }, signal: AbortSignal): Promise<KnowledgeLibrary>;
    setLibraryArchived(libraryID: string, archived: boolean, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    listMembers(libraryID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgeLibraryMemberPage>;
    setMember(libraryID: string, userID: string, role: KnowledgeLibraryMember["role"], expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    removeMember(libraryID: string, userID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    searchPrincipals(query: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePrincipalPage>;
    resolvePrincipals(userIDs: string[], signal: AbortSignal): Promise<KnowledgePrincipal[]>;
    searchLibraryMembers(libraryID: string, query: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePrincipalPage>;
    explainAccess(libraryID: string, request: {
        user_id: string;
        page_id?: string;
        action: string;
        proposed_role?: KnowledgeLibraryMember["role"];
    }, signal: AbortSignal): Promise<KnowledgeAccessExplanation>;
    listPages(libraryID: string, parentPageID: string, after: string, limit: number, includeArchived: boolean, signal: AbortSignal): Promise<KnowledgePagePage>;
    getPage(libraryID: string, pageID: string, includeDraft: boolean, signal: AbortSignal): Promise<KnowledgePageView>;
    createPage(libraryID: string, request: {
        client_id: string;
        parent_page_id?: string;
        rank?: string;
        title: string;
        content_type: KnowledgePageContentType;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    savePageDraft(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_draft_revision: number;
        expected_page_revision: number;
        title: string;
        parent_page_id?: string;
        rank: string;
        content_schema_version: number;
        content: string;
        content_sha256: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    previewPageMove?(libraryID: string, pageID: string, request: {
        parent_page_id?: string;
        rank: string;
    }, signal: AbortSignal): Promise<KnowledgePageMoveImpact>;
    movePage(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        parent_page_id?: string;
        rank: string;
        access_impact_token?: string;
    }, signal: AbortSignal): Promise<KnowledgePage>;
    getPageAccess?(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageAccessPolicy>;
    setPageAccess?(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        mode: "inherit" | "restricted";
        grants: KnowledgePageAccessGrant[];
    }, signal: AbortSignal): Promise<KnowledgePageAccessPolicy>;
    copyPage(libraryID: string, pageID: string, request: {
        client_id: string;
        parent_page_id?: string;
        rank?: string;
        title?: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    reorderPages(libraryID: string, request: {
        client_id: string;
        parent_page_id?: string;
        items: {
            page_id: string;
            expected_revision: number;
        }[];
    }, signal: AbortSignal): Promise<KnowledgePagePage>;
    setPageArchived(libraryID: string, pageID: string, archived: boolean, request: {
        client_id: string;
        expected_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePage>;
    publishPage(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_page_revision: number;
        expected_draft_revision: number;
        publish_note?: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    connectKnowledgeCollaboration?(libraryID: string, pageID: string, request: {
        client_id: string;
    }, signal: AbortSignal): Promise<KnowledgeCollaborationSession>;
    syncKnowledgeCollaboration?(libraryID: string, pageID: string, request: {
        session_id: string;
        after_clock: number;
        update?: KnowledgeCollaborationUpdate;
        cursor_block_id?: string;
        selection_block_id?: string;
    }, signal: AbortSignal): Promise<KnowledgeCollaborationSyncResult>;
    streamKnowledgeCollaborationEvents?(libraryID: string, pageID: string, sessionID: string, afterClock: number, onEvent: (event: KnowledgeCollaborationServerEvent) => void, signal: AbortSignal): Promise<void>;
    closeKnowledgeCollaboration?(libraryID: string, pageID: string, sessionID: string, signal: AbortSignal): Promise<void>;
    publishKnowledgeCollaboration?(libraryID: string, pageID: string, request: {
        session_id: string;
        client_id: string;
        publish_note?: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    listPageVersions(libraryID: string, pageID: string, before: number, limit: number, signal: AbortSignal): Promise<KnowledgePageVersionPage>;
    getPageVersion(libraryID: string, pageID: string, version: number, signal: AbortSignal): Promise<KnowledgePageVersion>;
    diffPageVersions(libraryID: string, pageID: string, fromVersion: number, toVersion: number, signal: AbortSignal): Promise<KnowledgePageVersionDiff>;
    restorePageVersion(libraryID: string, pageID: string, version: number, request: {
        client_id: string;
        expected_page_revision: number;
        expected_draft_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    listPageComments(libraryID: string, pageID: string, after: string, limit: number, unresolved: boolean, signal: AbortSignal): Promise<KnowledgePageCommentPage>;
    createPageComment(libraryID: string, pageID: string, request: {
        client_id: string;
        parent_comment_id?: string;
        published_version: number;
        anchor: {
            node_id?: string;
            quote?: string;
        };
        body: string;
        mentioned_user_ids: string[];
    }, signal: AbortSignal): Promise<KnowledgePageComment>;
    updatePageComment(libraryID: string, pageID: string, commentID: string, request: {
        client_id: string;
        expected_revision: number;
        body: string;
        mentioned_user_ids: string[];
    }, signal: AbortSignal): Promise<KnowledgePageComment>;
    resolvePageComment(libraryID: string, pageID: string, commentID: string, request: {
        client_id: string;
        expected_revision: number;
        resolved: boolean;
    }, signal: AbortSignal): Promise<KnowledgePageComment>;
    deletePageComment(libraryID: string, pageID: string, commentID: string, request: {
        client_id: string;
        expected_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePageComment>;
    listPageAttachments(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageAttachmentPage>;
    setPageAttachment(libraryID: string, pageID: string, documentID: string, request: {
        client_id: string;
        title: string;
        rank: string;
    }, signal: AbortSignal): Promise<KnowledgePageAttachment>;
    removePageAttachment(libraryID: string, pageID: string, documentID: string, request: {
        client_id: string;
    }, signal: AbortSignal): Promise<void>;
    listSources(libraryID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgeLibrarySources>;
    bindSource(libraryID: string, datasourceKey: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    listDocuments(libraryID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgeDocumentPage>;
    getDocument(libraryID: string, documentID: string, signal: AbortSignal): Promise<KnowledgeDocument>;
    uploadDocument(request: KnowledgeUploadRequest): Promise<KnowledgeDocument>;
    retryDocument(libraryID: string, documentID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeDocument>;
    reindexDocument(libraryID: string, documentID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeDocument>;
    deleteDocument(libraryID: string, documentID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeDocument>;
    transferDocument(request: KnowledgeTransferRequest): Promise<KnowledgeDocument>;
    readDocumentContent(libraryID: string, documentID: string, request: KnowledgeContentRequest): Promise<Response>;
    documentContentURL?(libraryID: string, documentID: string): string;
    scope?(): string;
}
