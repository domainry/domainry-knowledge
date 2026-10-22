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
export type KnowledgePageContentType = "document" | "multidimensional_table" | "spreadsheet" | "presentation" | "form" | "mind_note" | "whiteboard" | "mind_map" | "flowchart" | "file";
export type KnowledgePage = {
    id: string;
    library_id: string;
    parent_page_id?: string;
    has_children: boolean;
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
    grid_access?: KnowledgeGridAccess;
    governance: KnowledgePageContentGovernance;
};
export type KnowledgePageReferenceCreateResult = {
    parent: KnowledgePageView;
    target: KnowledgePageView;
};
export type KnowledgePageReferenceDirection = "outgoing" | "incoming";
export type KnowledgePageReferenceLink = {
    source_page_id: string;
    source_title?: string;
    source_content_type?: KnowledgePageContentType;
    target_page_id: string;
    target_title?: string;
    target_content_type?: KnowledgePageContentType;
    block_id: string;
    reference_mode: "live" | "fixed";
    target_version?: number;
    display: "card" | "embed";
    available: boolean;
    updated_at: string;
};
export type KnowledgePageReferencePage = {
    direction: KnowledgePageReferenceDirection;
    items: KnowledgePageReferenceLink[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgeGridAccess = {
    read: boolean;
    write: boolean;
    manage: boolean;
    view_write?: Record<string, boolean>;
    field_write?: Record<string, boolean>;
    record_write?: Record<string, boolean>;
};
export type KnowledgePageNativeOperation = {
    id: string;
    target: "field" | "record" | "view" | "cell" | "table_structure" | "sheet" | "workbook_structure" | "sheet_structure" | "formula" | "cell_style" | "style" | "merge" | "chart" | "pivot" | "protected_range" | "node" | "edge" | "graph_structure" | "slide" | "element" | "asset" | "presentation_structure" | "component" | "form_structure";
    target_id: string;
    parent_id?: string;
    action: "upsert" | "delete";
    expected_hash: string;
    value?: unknown;
};
export type KnowledgePageNativeOperationRecord = {
    operation: KnowledgePageNativeOperation;
    library_id: string;
    page_id: string;
    content_type: KnowledgePageContentType;
    draft_revision: number;
    user_id: string;
    created_at: string;
};
export type KnowledgePageNativeOperationResult = {
    view: KnowledgePageView;
    operations: KnowledgePageNativeOperationRecord[];
};
export type KnowledgeGridAutomationExecute = {
    execution_id: string;
    automation_id: string;
    trigger: "record_created" | "record_updated";
    record_id: string;
    expected_draft_revision: number;
};
export type KnowledgeGridAutomationResult = {
    view: KnowledgePageView;
    automation_id: string;
    record_id: string;
    field_id: string;
    applied: boolean;
};
export type KnowledgePagePage = {
    items: KnowledgePage[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageCollectionKind = "favorites" | "recent_views" | "recent_edits" | "subscribed" | "shortcuts" | "trash";
export type KnowledgePagePersonalState = {
    library_id: string;
    page_id: string;
    user_id: string;
    favorite: boolean;
    favorite_at?: string;
    subscribed: boolean;
    subscribed_at?: string;
    shortcut_rank?: string;
    last_viewed_at?: string;
    last_edited_at?: string;
    revision: number;
    updated_at?: string;
};
export type KnowledgePageCollectionItem = {
    page: KnowledgePage;
    state: KnowledgePagePersonalState;
};
export type KnowledgePageCollectionPage = {
    items: KnowledgePageCollectionItem[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageStatus = "" | "in_progress" | "in_review" | "verified" | "deprecated";
export type KnowledgePagePropertyType = "text" | "number" | "date" | "select" | "checkbox" | "person";
export type KnowledgePageCustomProperty = {
    id: string;
    name: string;
    type: KnowledgePagePropertyType;
    value: string;
};
export type KnowledgePageMetadata = {
    library_id: string;
    page_id: string;
    aliases: string[];
    related_page_ids: string[];
    tags: string[];
    owner_user_id?: string;
    content_admin_user_ids: string[];
    status: KnowledgePageStatus;
    properties: KnowledgePageCustomProperty[];
    next_review_at?: string;
    review_interval_days: number;
    last_reviewed_at?: string;
    last_reviewed_by_user_id?: string;
    archive_retention_days: number;
    archived_at?: string;
    retain_until?: string;
    revision: number;
    updated_by_user_id?: string;
    updated_at?: string;
};
export type KnowledgeGovernanceEvent = {
    id: string;
    family: string;
    type: string;
    action: string;
    actor: {
        known: boolean;
        runtime_id: string;
        workspace_id: string;
        user_id: string;
        role_key?: string;
    };
    library_id?: string;
    page_id?: string;
    version?: number;
    resource_id?: string;
    client_id?: string;
    before?: Record<string, string>;
    after?: Record<string, string>;
    occurred_at: string;
};
export type KnowledgeGovernanceAuditPage = {
    items: KnowledgeGovernanceEvent[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageIdentity = {
    page_id: string;
    title: string;
    aliases: string[];
    content_type: KnowledgePageContentType;
    path: {
        page_id: string;
        title: string;
    }[];
};
export type KnowledgePageIdentityPage = {
    items: KnowledgePageIdentity[];
};
export type KnowledgePagePublicationStatus = "published" | "unpublished";
export type KnowledgePageSearchLocation = {
    kind: "page" | "block" | "cell" | "node";
    block_id?: string;
    sheet_id?: string;
    cell?: string;
    record_id?: string;
    field_id?: string;
    node_id?: string;
    json_path?: string;
};
export type KnowledgePageSearchInput = {
    query: string;
    content_types: KnowledgePageContentType[];
    author_user_ids: string[];
    updated_after?: string;
    updated_before?: string;
    tags: string[];
    path_query?: string;
    ancestor_page_id?: string;
    publication_statuses: KnowledgePagePublicationStatus[];
    limit: number;
};
export type KnowledgePageSearchHit = {
    library_id: string;
    page_id: string;
    kind: "page" | "file" | "native_app";
    content_type: KnowledgePageContentType;
    title: string;
    excerpt?: string;
    path: {
        page_id: string;
        title: string;
    }[];
    tags: string[];
    author_user_id: string;
    published_version?: number;
    publication_status: KnowledgePagePublicationStatus;
    index_status: "none" | "queued" | "indexing" | "ready" | "failed";
    location: KnowledgePageSearchLocation;
    score: number;
    updated_at: string;
    published_at?: string;
};
export type KnowledgePageSearchPage = {
    items: KnowledgePageSearchHit[];
    truncated: boolean;
};
export type KnowledgePageRelationshipKind = "hierarchy" | "reference" | "related";
export type KnowledgePageRelationshipNode = KnowledgePageIdentity & {
    center?: boolean;
};
export type KnowledgePageRelationshipEdge = {
    source_page_id: string;
    target_page_id: string;
    kind: KnowledgePageRelationshipKind;
    directed: boolean;
};
export type KnowledgePageRelationshipGraph = {
    center_page_id: string;
    nodes: KnowledgePageRelationshipNode[];
    edges: KnowledgePageRelationshipEdge[];
    truncated: boolean;
};
export type KnowledgePageVersionPage = {
    items: KnowledgePageVersion[];
    next_before?: number;
    complete: boolean;
};
export type KnowledgePageBlockChange = {
    node_id: string;
    kind: "insert" | "update" | "delete";
    before_sha256?: string;
    after_sha256?: string;
    before_preview?: string;
    after_preview?: string;
};
export type KnowledgePageEditHistoryEntry = {
    clock: number;
    draft_revision: number;
    user_id: string;
    title_changed: boolean;
    changed_block_count: number;
    changes: KnowledgePageBlockChange[];
    truncated: boolean;
    created_at: string;
};
export type KnowledgePageEditHistoryPage = {
    items: KnowledgePageEditHistoryEntry[];
    next_before?: number;
    complete: boolean;
};
export type KnowledgePageSuggestion = {
    id: string;
    library_id: string;
    page_id: string;
    kind: "insert" | "delete";
    status: "open" | "accepted" | "rejected" | "withdrawn";
    base_draft_revision: number;
    anchor: {
        node_id?: string;
        quote?: string;
        block_sha256?: string;
        changed?: boolean;
    };
    proposed_block_id?: string;
    proposed_text?: string;
    comment?: string;
    mentioned_user_ids: string[];
    author_user_id: string;
    decided_by_user_id?: string;
    revision: number;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageSuggestionPage = {
    items: KnowledgePageSuggestion[];
};
export type KnowledgePageTemplate = {
    id: string;
    library_id: string;
    title: string;
    description?: string;
    root_content_type: KnowledgePageContentType;
    node_count: number;
    latest_version: number;
    revision: number;
    created_by_user_id: string;
    updated_by_user_id: string;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageTemplatePage = {
    items: KnowledgePageTemplate[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageTemplateVersionSummary = {
    template_id: string;
    version: number;
    title: string;
    description?: string;
    node_count: number;
    created_by_user_id: string;
    created_at: string;
};
export type KnowledgePageTemplateVersionPage = {
    items: KnowledgePageTemplateVersionSummary[];
    next_before?: number;
    complete: boolean;
};
export type KnowledgePageTemplateInstance = {
    template_id: string;
    version: number;
    root: KnowledgePageView;
    created_page_ids: string[];
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
    client_created_at?: string;
    title?: string;
    yjs_update: string;
    yjs_state?: string;
    content: string;
    content_sha256: string;
    edited_block_ids?: string[];
};
export type KnowledgeCollaborationYjsUpdate = {
    clock: number;
    update_id: string;
    yjs_update: string;
};
export type KnowledgeCollaborationSnapshot = {
    page_id: string;
    draft_revision: number;
    server_clock: number;
    title: string;
    content: string;
    content_sha256: string;
    yjs_state?: string;
    yjs_state_clock: number;
    yjs_update_bytes_since_checkpoint: number;
    yjs_updates?: KnowledgeCollaborationYjsUpdate[];
};
export type KnowledgeCollaborationPresence = {
    session_id: string;
    user_id: string;
    display_name?: string;
    awareness_update?: string;
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
export type KnowledgeCollaborationSync = {
    session_id: string;
    after_clock: number;
    update?: KnowledgeCollaborationUpdate;
    awareness_update?: string;
    cursor_block_id?: string;
    selection_block_id?: string;
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
export type KnowledgePageLiveEvent = {
    type: "changed" | "heartbeat" | "revoked";
    page_id: string;
    revision: number;
    code?: string;
};
export type KnowledgePageSearchEvent = {
    type: "changed" | "heartbeat" | "revoked";
    revision: number;
    code?: string;
};
export type KnowledgeAccessSubject = {
    type: "user" | "organization";
    id: string;
};
export type KnowledgePageAccessGrant = {
    subject: KnowledgeAccessSubject;
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
export type KnowledgePageContentOperation = "copy" | "download" | "print" | "export" | "duplicate";
export type KnowledgePageContentPolicy = {
    page_id: string;
    library_id: string;
    scope: "page" | "subtree";
    allow_copy: boolean;
    allow_download: boolean;
    allow_print: boolean;
    allow_export: boolean;
    allow_duplicate: boolean;
    classification: "public" | "internal" | "confidential" | "restricted";
    watermark_mode: "none" | "identity";
    sensitive_content_action: "allow" | "block_outbound";
    require_outbound_approval: boolean;
    revision: number;
    updated_by_user_id?: string;
    updated_at?: string;
};
export type KnowledgePageContentGovernance = {
    classification: "public" | "internal" | "confidential" | "restricted";
    dynamic_watermark?: {
        text: string;
        generated_at: string;
    };
};
export type KnowledgePageContentDecision = {
    operation: KnowledgePageContentOperation;
    allowed: boolean;
    source_page_id?: string;
    scope: "page" | "subtree";
    revision: number;
    library_id: string;
    page_id: string;
    classification: KnowledgePageContentGovernance["classification"];
    watermark_mode: "none" | "identity";
    sensitive_content_action: "allow" | "block_outbound";
    approval_required: boolean;
    approval_reference?: string;
};
export type KnowledgePageShareKind = "organization" | "user" | "external";
export type KnowledgePageShareScope = "page" | "subtree";
export type KnowledgePageShare = {
    id: string;
    library_id: string;
    page_id: string;
    kind: KnowledgePageShareKind;
    target?: KnowledgeAccessSubject;
    scope: KnowledgePageShareScope;
    role: "reader";
    password_protected: boolean;
    state: "active" | "revoked";
    expires_at: string;
    revision: number;
    created_by_user_id: string;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageSharePage = {
    items: KnowledgePageShare[];
    next_after?: string;
    complete: boolean;
};
export type KnowledgePageSharedView = {
    share: KnowledgePageShare;
    view: KnowledgePageView;
};
export type KnowledgePageMoveImpact = {
    page_id: string;
    parent_page_id?: string;
    affected_pages: number;
    changed_subjects: KnowledgeAccessSubject[];
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
        block_sha256?: string;
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
    reactions: KnowledgeCommentReaction[];
};
export type KnowledgeCommentReaction = {
    emoji: string;
    count: number;
    reacted: boolean;
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
export type KnowledgeTaskStatus = "todo" | "in_progress" | "done" | "canceled";
export type KnowledgeTaskPriority = "none" | "low" | "medium" | "high" | "urgent";
export type KnowledgePageTask = {
    id: string;
    library_id: string;
    page_id: string;
    source_block_id: string;
    title: string;
    status: KnowledgeTaskStatus;
    assignee_user_ids: string[];
    due_at?: string;
    reminder_at?: string;
    priority: KnowledgeTaskPriority;
    revision: number;
    created_by_user_id: string;
    updated_by_user_id: string;
    created_at: string;
    updated_at: string;
};
export type KnowledgePageTaskPage = {
    items: KnowledgePageTask[];
};
export type KnowledgePageTaskWrite = {
    title: string;
    status: KnowledgeTaskStatus;
    assignee_user_ids: string[];
    due_at?: string;
    reminder_at?: string;
    priority: KnowledgeTaskPriority;
};
export type KnowledgePollStatus = "open" | "closed";
export type KnowledgePagePollOption = {
    id: string;
    label: string;
};
export type KnowledgePagePollResult = {
    option_id: string;
    label: string;
    votes: number;
};
export type KnowledgePagePoll = {
    id: string;
    library_id: string;
    page_id: string;
    source_block_id: string;
    question: string;
    options: KnowledgePagePollOption[];
    multiple: boolean;
    status: KnowledgePollStatus;
    revision: number;
    created_by_user_id: string;
    updated_by_user_id: string;
    created_at: string;
    updated_at: string;
};
export type KnowledgePagePollView = {
    poll: KnowledgePagePoll;
    results: KnowledgePagePollResult[];
    total_voters: number;
    total_selections: number;
    selected_option_ids: string[];
    ballot_revision: number;
};
export type KnowledgePagePollPage = {
    items: KnowledgePagePollView[];
};
export type KnowledgePagePollWrite = {
    question: string;
    options: {
        id?: string;
        label: string;
    }[];
    multiple: boolean;
    status: KnowledgePollStatus;
};
export type KnowledgeFormComponentType = "textfield" | "textarea" | "number" | "currency" | "email" | "url" | "phoneNumber" | "radio" | "select" | "selectboxes" | "checkbox" | "datetime" | "rating" | "scale" | "file";
export type KnowledgeFormOption = {
    label: string;
    value: string;
};
export type KnowledgeFormFileAnswer = {
    document_id: string;
    title: string;
};
export type KnowledgeFormComponent = {
    type: KnowledgeFormComponentType;
    key: string;
    label: string;
    description?: string;
    placeholder?: string;
    input: true;
    validate: {
        required: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    };
    values?: KnowledgeFormOption[];
    data?: {
        values: KnowledgeFormOption[];
    };
    multiple?: true;
    currency?: "CNY" | "USD" | "EUR" | "JPY";
    inputMask?: "";
    maxFiles?: number;
    conditional?: {
        show: boolean;
        when: string;
        eq: string | number | boolean;
    };
};
export type KnowledgeFormSettings = {
    submission_role: KnowledgeLibraryMember["role"];
    allow_multiple_submissions: boolean;
    opens_at: string;
    closes_at: string;
    confirmation_message: string;
};
export type KnowledgeFormContent = {
    schema_version: 1;
    display: "form";
    components: KnowledgeFormComponent[];
    settings: KnowledgeFormSettings;
};
export type KnowledgeFormSubmission = {
    id: string;
    library_id: string;
    page_id: string;
    published_version: number;
    content_sha256: string;
    answers: Record<string, unknown>;
    submitted_by_user_id: string;
    submitted_at: string;
};
export type KnowledgeFormSubmissionPage = {
    items: KnowledgeFormSubmission[];
    next_before?: string;
    complete: boolean;
};
export type KnowledgeFormChoiceCount = {
    value: string;
    label: string;
    count: number;
};
export type KnowledgeFormQuestionAnalytics = {
    key: string;
    label: string;
    type: KnowledgeFormComponentType;
    answered: number;
    skipped: number;
    choice_counts: KnowledgeFormChoiceCount[];
    number_min?: number;
    number_max?: number;
    number_average?: number;
};
export type KnowledgeFormAnalytics = {
    published_version: number;
    total_submissions: number;
    questions: KnowledgeFormQuestionAnalytics[];
};
export type KnowledgeFormExport = {
    filename: string;
    content_type: string;
    body: string;
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
export type KnowledgeOrganizationPrincipal = {
    organization_id: string;
    display_name: string;
    node_type?: string;
    status: string;
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
    share?: KnowledgeAccessLayer;
    final: KnowledgeAccessLayer;
    share_id?: string;
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
export type KnowledgeLibraryOrganizationMember = {
    organization_id: string;
    role: KnowledgeLibraryMember["role"];
    updated_at?: string;
};
export type KnowledgeLibraryOrganizationMemberPage = {
    items: KnowledgeLibraryOrganizationMember[];
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
export type KnowledgeAIOperation = "write" | "summarize" | "translate" | "rewrite" | "answer";
export type KnowledgeAISourceScope = "published" | "draft";
export type KnowledgeAIExecutionState = "pending" | "running" | "completed" | "failed" | "confirmed";
export type KnowledgeAISource = {
    scope: KnowledgeAISourceScope;
    page_id: string;
    title: string;
    version?: number;
    draft_revision?: number;
    block_id?: string;
    content_sha256: string;
    reference?: {
        library_id: string;
        page_id: string;
        version: number;
        block_id?: string;
        content_sha256: string;
    };
};
export type KnowledgeAIExecution = {
    id: string;
    library_id: string;
    page_id: string;
    operation: KnowledgeAIOperation;
    prompt?: string;
    language?: string;
    state: KnowledgeAIExecutionState;
    revision: number;
    attempt: number;
    source: KnowledgeAISource;
    result?: string;
    provider?: string;
    model?: string;
    error_code?: string;
    created_by_user_id: string;
    created_at: string;
    updated_at: string;
    confirmed_at?: string;
};
export type KnowledgeApplicationCardKind = "calendar_event" | "meeting" | "group" | "task" | "jira" | "web";
export type KnowledgeApplicationCardResolve = {
    provider: string;
    kind: KnowledgeApplicationCardKind;
    resource_id: string;
};
export type KnowledgeApplicationCard = KnowledgeApplicationCardResolve & {
    title: string;
    subtitle?: string;
    status?: string;
    url?: string;
    updated_at?: string;
};
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
    listOrganizationMembers(libraryID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgeLibraryOrganizationMemberPage>;
    setOrganizationMember(libraryID: string, organizationID: string, role: KnowledgeLibraryMember["role"], expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    removeOrganizationMember(libraryID: string, organizationID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgeLibrary>;
    searchPrincipals(query: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePrincipalPage>;
    resolvePrincipals(userIDs: string[], signal: AbortSignal): Promise<KnowledgePrincipal[]>;
    resolveOrganizationPrincipals(organizationIDs: string[], signal: AbortSignal): Promise<KnowledgeOrganizationPrincipal[]>;
    searchLibraryMembers(libraryID: string, query: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePrincipalPage>;
    explainAccess(libraryID: string, request: {
        user_id: string;
        page_id?: string;
        action: string;
        share_id?: string;
        proposed_role?: KnowledgeLibraryMember["role"];
    }, signal: AbortSignal): Promise<KnowledgeAccessExplanation>;
    listPages(libraryID: string, parentPageID: string, after: string, limit: number, includeArchived: boolean, signal: AbortSignal): Promise<KnowledgePagePage>;
    getPage(libraryID: string, pageID: string, includeDraft: boolean, signal: AbortSignal): Promise<KnowledgePageView>;
    getPagePersonalState(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePagePersonalState>;
    setPagePersonalState(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        favorite: boolean;
        subscribed: boolean;
        shortcut_rank?: string;
    }, signal: AbortSignal): Promise<KnowledgePagePersonalState>;
    recordPageView(libraryID: string, pageID: string, request: {
        client_id: string;
    }, signal: AbortSignal): Promise<KnowledgePagePersonalState>;
    listPageCollection(libraryID: string, kind: KnowledgePageCollectionKind, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePageCollectionPage>;
    getPageMetadata(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageMetadata>;
    setPageMetadata(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        aliases: string[];
        related_page_ids: string[];
        tags: string[];
        status: KnowledgePageStatus;
        properties: KnowledgePageCustomProperty[];
    }, signal: AbortSignal): Promise<KnowledgePageMetadata>;
    setPageGovernance(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        owner_user_id: string;
        content_admin_user_ids: string[];
        archive_retention_days: number;
        review_interval_days: number;
        next_review_at?: string;
    }, signal: AbortSignal): Promise<KnowledgePageMetadata>;
    reviewPageGovernance(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePageMetadata>;
    listPageGovernanceAudit(libraryID: string, pageID: string, event: string, actorID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgeGovernanceAuditPage>;
    searchPages(libraryID: string, request: KnowledgePageSearchInput, signal: AbortSignal): Promise<KnowledgePageSearchPage>;
    streamKnowledgePageSearchEvents?(libraryID: string, afterRevision: number, onEvent: (event: KnowledgePageSearchEvent) => void, signal: AbortSignal): Promise<void>;
    searchPageIdentities(libraryID: string, query: string, limit: number, signal: AbortSignal): Promise<KnowledgePageIdentityPage>;
    getPageRelationshipGraph(libraryID: string, pageID: string, depth: number, limit: number, signal: AbortSignal): Promise<KnowledgePageRelationshipGraph>;
    createPage(libraryID: string, request: {
        client_id: string;
        parent_page_id?: string;
        rank?: string;
        title: string;
        content_type: KnowledgePageContentType;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    listPageReferences(libraryID: string, pageID: string, direction: KnowledgePageReferenceDirection, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePageReferencePage>;
    createPageReference?(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_parent_draft_revision: number;
        expected_parent_page_revision: number;
        parent_content_schema_version: number;
        parent_content: string;
        parent_content_sha256: string;
        reference_block_id: string;
        title: string;
        content_type: KnowledgePageContentType;
        display: "card" | "embed";
    }, signal: AbortSignal): Promise<KnowledgePageReferenceCreateResult>;
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
    applyPageNativeOperations?(libraryID: string, pageID: string, request: {
        client_id: string;
        base_draft_revision: number;
        operations: KnowledgePageNativeOperation[];
    }, signal: AbortSignal): Promise<KnowledgePageNativeOperationResult>;
    executeGridAutomation?(libraryID: string, pageID: string, request: KnowledgeGridAutomationExecute, signal: AbortSignal): Promise<KnowledgeGridAutomationResult>;
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
    getPageContentPolicy?(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageContentPolicy>;
    setPageContentPolicy?(libraryID: string, pageID: string, request: {
        client_id: string;
        expected_revision: number;
        scope: "page" | "subtree";
        allow_copy: boolean;
        allow_download: boolean;
        allow_print: boolean;
        allow_export: boolean;
        allow_duplicate: boolean;
        classification: KnowledgePageContentPolicy["classification"];
        watermark_mode: KnowledgePageContentPolicy["watermark_mode"];
        sensitive_content_action: KnowledgePageContentPolicy["sensitive_content_action"];
        require_outbound_approval: boolean;
    }, signal: AbortSignal): Promise<KnowledgePageContentPolicy>;
    authorizePageContentOperation?(libraryID: string, pageID: string, operation: "copy" | "print" | "export" | "duplicate", signal: AbortSignal): Promise<KnowledgePageContentDecision>;
    listPageShares?(libraryID: string, pageID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePageSharePage>;
    createPageShare?(libraryID: string, pageID: string, request: {
        client_id: string;
        kind: KnowledgePageShareKind;
        target?: KnowledgeAccessSubject;
        scope: KnowledgePageShareScope;
        expires_at: string;
        password?: string;
    }, signal: AbortSignal): Promise<KnowledgePageShare>;
    revokePageShare?(libraryID: string, pageID: string, shareID: string, expectedRevision: number, signal: AbortSignal): Promise<KnowledgePageShare>;
    redeemPageShare?(shareID: string, password: string, signal: AbortSignal): Promise<KnowledgePageShare>;
    readPageShare?(shareID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageSharedView>;
    authorizePageShareContentOperation?(shareID: string, pageID: string, operation: "copy" | "print" | "export", signal: AbortSignal): Promise<KnowledgePageContentDecision>;
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
    syncKnowledgeCollaboration?(libraryID: string, pageID: string, request: KnowledgeCollaborationSync, signal: AbortSignal): Promise<KnowledgeCollaborationSyncResult>;
    streamKnowledgeCollaborationEvents?(libraryID: string, pageID: string, sessionID: string, afterClock: number, connectionAttempt: number, onEvent: (event: KnowledgeCollaborationServerEvent) => void, signal: AbortSignal): Promise<void>;
    streamKnowledgePageLiveEvents?(libraryID: string, pageID: string, afterRevision: number, onEvent: (event: KnowledgePageLiveEvent) => void, signal: AbortSignal): Promise<void>;
    closeKnowledgeCollaboration?(libraryID: string, pageID: string, sessionID: string, signal: AbortSignal): Promise<void>;
    publishKnowledgeCollaboration?(libraryID: string, pageID: string, request: {
        session_id: string;
        client_id: string;
        publish_note?: string;
    }, signal: AbortSignal): Promise<KnowledgePageView>;
    createAIExecution?(libraryID: string, pageID: string, request: {
        client_id: string;
        operation: KnowledgeAIOperation;
        prompt?: string;
        language?: string;
        source_scope: KnowledgeAISourceScope;
        block_id?: string;
        session_id?: string;
    }, signal: AbortSignal): Promise<KnowledgeAIExecution>;
    getAIExecution?(libraryID: string, pageID: string, executionID: string, signal: AbortSignal): Promise<KnowledgeAIExecution>;
    confirmAIExecution?(libraryID: string, pageID: string, executionID: string, request: {
        client_id: string;
        expected_revision: number;
        session_id: string;
    }, signal: AbortSignal): Promise<KnowledgeAIExecution>;
    resolveApplicationCard?(libraryID: string, pageID: string, request: KnowledgeApplicationCardResolve, signal: AbortSignal): Promise<KnowledgeApplicationCard>;
    listPageVersions(libraryID: string, pageID: string, before: number, limit: number, signal: AbortSignal): Promise<KnowledgePageVersionPage>;
    listPageEditHistory(libraryID: string, pageID: string, before: number, limit: number, signal: AbortSignal): Promise<KnowledgePageEditHistoryPage>;
    listPageSuggestions(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageSuggestionPage>;
    createPageSuggestion(libraryID: string, pageID: string, request: {
        client_id: string;
        kind: "insert" | "delete";
        base_draft_revision: number;
        anchor: {
            node_id: string;
            quote: string;
        };
        proposed_text?: string;
        comment?: string;
        mentioned_user_ids: string[];
    }, signal: AbortSignal): Promise<KnowledgePageSuggestion>;
    decidePageSuggestion(libraryID: string, pageID: string, suggestionID: string, request: {
        client_id: string;
        expected_revision: number;
        expected_draft_revision: number;
        decision: "accept" | "reject" | "withdraw";
    }, signal: AbortSignal): Promise<KnowledgePageSuggestion>;
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
            node_id: string;
            quote: string;
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
    setPageCommentReaction(libraryID: string, pageID: string, commentID: string, request: {
        client_id: string;
        emoji: string;
        active: boolean;
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
    listPageTasks(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePageTaskPage>;
    createPageTask(libraryID: string, pageID: string, request: {
        client_id: string;
        source_block_id: string;
        title: string;
        assignee_user_ids: string[];
        due_at?: string;
        reminder_at?: string;
        priority: KnowledgeTaskPriority;
    }, signal: AbortSignal): Promise<KnowledgePageTask>;
    updatePageTask(libraryID: string, pageID: string, taskID: string, request: KnowledgePageTaskWrite & {
        client_id: string;
        expected_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePageTask>;
    listPagePolls(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgePagePollPage>;
    createPagePoll(libraryID: string, pageID: string, request: {
        client_id: string;
        source_block_id: string;
        question: string;
        options: string[];
        multiple: boolean;
    }, signal: AbortSignal): Promise<KnowledgePagePollView>;
    updatePagePoll(libraryID: string, pageID: string, pollID: string, request: KnowledgePagePollWrite & {
        client_id: string;
        expected_revision: number;
    }, signal: AbortSignal): Promise<KnowledgePagePollView>;
    votePagePoll(libraryID: string, pageID: string, pollID: string, request: {
        client_id: string;
        expected_ballot_revision: number;
        option_ids: string[];
    }, signal: AbortSignal): Promise<KnowledgePagePollView>;
    submitPageForm?(libraryID: string, pageID: string, request: {
        client_id: string;
        answers: Record<string, unknown>;
    }, signal: AbortSignal): Promise<KnowledgeFormSubmission>;
    listPageFormSubmissions?(libraryID: string, pageID: string, before: string, limit: number, signal: AbortSignal): Promise<KnowledgeFormSubmissionPage>;
    getPageFormAnalytics?(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgeFormAnalytics>;
    exportPageFormSubmissions?(libraryID: string, pageID: string, signal: AbortSignal): Promise<KnowledgeFormExport>;
    listPageTemplates?(libraryID: string, after: string, limit: number, signal: AbortSignal): Promise<KnowledgePageTemplatePage>;
    createPageTemplate?(libraryID: string, request: {
        client_id: string;
        source_page_id: string;
        title: string;
        description?: string;
    }, signal: AbortSignal): Promise<KnowledgePageTemplate>;
    updatePageTemplate?(libraryID: string, templateID: string, request: {
        client_id: string;
        expected_revision: number;
        source_page_id: string;
        title: string;
        description?: string;
    }, signal: AbortSignal): Promise<KnowledgePageTemplate>;
    listPageTemplateVersions?(libraryID: string, templateID: string, before: number, limit: number, signal: AbortSignal): Promise<KnowledgePageTemplateVersionPage>;
    instantiatePageTemplate?(libraryID: string, templateID: string, request: {
        client_id: string;
        version?: number;
        parent_page_id?: string;
        rank?: string;
        root_title?: string;
    }, signal: AbortSignal): Promise<KnowledgePageTemplateInstance>;
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
    readPageDocumentContent?(libraryID: string, pageID: string, documentID: string, request: KnowledgeContentRequest): Promise<Response>;
    documentContentURL?(libraryID: string, documentID: string): string;
    scope?(): string;
}
