export declare const KNOWLEDGE_HOST_PROTOCOL_VERSION: 1;
export declare const KNOWLEDGE_SELECTION_MAX_BLOCKS = 32;
export declare const KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH = 16384;
export declare const KNOWLEDGE_HOST_MESSAGE_MAX_LENGTH = 1024;
export declare const KNOWLEDGE_HOST_TO_GUEST_CHANNEL: "verdent:knowledge:host";
export declare const KNOWLEDGE_GUEST_TO_HOST_CHANNEL: "verdent:knowledge:guest";
export declare const KNOWLEDGE_HOST_LOCALES: readonly ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "fr", "de", "it", "tr", "ar"];
export type KnowledgeHostLocale = typeof KNOWLEDGE_HOST_LOCALES[number];
export type KnowledgeDocumentSelectionAnchor = {
    kind: "document_blocks";
    blockIds: string[];
};
export type KnowledgeDocumentSelectionSnapshot = {
    blockIds: string[];
    quote: string;
};
export type KnowledgeSelectionReference = {
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    libraryId: string;
    libraryKind: "personal" | "shared";
    pageId: string;
    title: string;
    contentType: "document";
    source: "draft" | "published";
    pageRevision: number;
    draftRevision: number | null;
    contentSha256: string;
    anchor: KnowledgeDocumentSelectionAnchor;
    quote: string;
    deepLink: string;
};
export type KnowledgeHostPreferences = {
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    theme: "light" | "dark";
    locale: KnowledgeHostLocale;
    direction: "ltr" | "rtl";
};
export type KnowledgeAddSelectionRequest = {
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    requestId: string;
    reference: KnowledgeSelectionReference;
};
export type KnowledgeAddSelectionResult = {
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    requestId: string;
    ok: boolean;
    message?: string;
};
export type KnowledgeHostToGuestMessage = {
    channel: typeof KNOWLEDGE_HOST_TO_GUEST_CHANNEL;
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    type: "preferences";
    preferences: KnowledgeHostPreferences;
} | {
    channel: typeof KNOWLEDGE_HOST_TO_GUEST_CHANNEL;
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    type: "add-selection-result";
    result: KnowledgeAddSelectionResult;
};
export type KnowledgeGuestToHostMessage = {
    channel: typeof KNOWLEDGE_GUEST_TO_HOST_CHANNEL;
    version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
    type: "add-selection";
    request: KnowledgeAddSelectionRequest;
};
export type KnowledgeHostIntegration = {
    capabilities: {
        addSelectionToConversation: boolean;
    };
    addSelection(reference: KnowledgeSelectionReference): Promise<KnowledgeAddSelectionResult>;
};
export type KnowledgeSelectionReferenceInput = Omit<KnowledgeSelectionReference, "version" | "anchor" | "quote"> & {
    blockIds: readonly string[];
    quote: string;
};
export declare function boundKnowledgeDocumentSelection(blockIds: readonly string[], quote: string): KnowledgeDocumentSelectionSnapshot | null;
export declare function createKnowledgeSelectionReference(input: KnowledgeSelectionReferenceInput): KnowledgeSelectionReference | null;
export declare function parseKnowledgeSelectionReference(value: unknown): KnowledgeSelectionReference | null;
export declare function parseKnowledgeHostPreferences(value: unknown): KnowledgeHostPreferences | null;
export declare function parseKnowledgeAddSelectionRequest(value: unknown): KnowledgeAddSelectionRequest | null;
export declare function parseKnowledgeAddSelectionResult(value: unknown): KnowledgeAddSelectionResult | null;
export declare function parseKnowledgeHostToGuestMessage(value: unknown): KnowledgeHostToGuestMessage | null;
export declare function parseKnowledgeGuestToHostMessage(value: unknown): KnowledgeGuestToHostMessage | null;
