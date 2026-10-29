export const KNOWLEDGE_HOST_PROTOCOL_VERSION = 1 as const;
export const KNOWLEDGE_SELECTION_MAX_BLOCKS = 32;
export const KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH = 16_384;
export const KNOWLEDGE_HOST_MESSAGE_MAX_LENGTH = 1_024;
export const KNOWLEDGE_HOST_TO_GUEST_CHANNEL = "verdent:knowledge:host" as const;
export const KNOWLEDGE_GUEST_TO_HOST_CHANNEL = "verdent:knowledge:guest" as const;

export const KNOWLEDGE_HOST_LOCALES = [
  "en",
  "zh-CN",
  "zh-TW",
  "ja",
  "ko",
  "es",
  "pt",
  "fr",
  "de",
  "it",
  "tr",
  "ar",
] as const;

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

export type KnowledgeHostToGuestMessage =
  | {
      channel: typeof KNOWLEDGE_HOST_TO_GUEST_CHANNEL;
      version: typeof KNOWLEDGE_HOST_PROTOCOL_VERSION;
      type: "preferences";
      preferences: KnowledgeHostPreferences;
    }
  | {
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

const libraryIdPattern = /^klib_[a-f0-9]{32}$/;
const pageIdPattern = /^kpage_[a-f0-9]{32}$/;
const blockIdPattern = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
const sha256Pattern = /^[a-f0-9]{64}$/i;
const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;
const locales = new Set<string>(KNOWLEDGE_HOST_LOCALES);

export function boundKnowledgeDocumentSelection(blockIds: readonly string[], quote: string): KnowledgeDocumentSelectionSnapshot | null {
  if (typeof quote !== "string") return null;
  const uniqueBlockIds = [...new Set(blockIds)];
  if (uniqueBlockIds.length === 0 || uniqueBlockIds.some(id => !blockIdPattern.test(id))) return null;
  return {
    blockIds: uniqueBlockIds.slice(0, KNOWLEDGE_SELECTION_MAX_BLOCKS),
    quote: quote.slice(0, KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH),
  };
}

export function createKnowledgeSelectionReference(input: KnowledgeSelectionReferenceInput): KnowledgeSelectionReference | null {
  const selection = boundKnowledgeDocumentSelection(input.blockIds, input.quote);
  return selection ? parseKnowledgeSelectionReference({
    ...input,
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    anchor: { kind: "document_blocks", blockIds: selection.blockIds },
    quote: selection.quote,
  }) : null;
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function safeString(value: unknown, maximumLength: number, allowEmpty = false): string | null {
  if (
    typeof value !== "string"
    || value.length > maximumLength
    || (!allowEmpty && value.trim() === "")
  ) return null;
  return value;
}

function positiveInteger(value: unknown): number | null {
  return Number.isSafeInteger(value) && Number(value) > 0 ? Number(value) : null;
}

function safeDeepLink(value: unknown): string | null {
  const raw = safeString(value, 2_048);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function parseKnowledgeSelectionReference(value: unknown): KnowledgeSelectionReference | null {
  const input = record(value);
  const anchor = record(input?.anchor);
  if (!input || !anchor || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION) return null;
  if (!libraryIdPattern.test(String(input.libraryId)) || !pageIdPattern.test(String(input.pageId))) return null;
  if (input.libraryKind !== "personal" && input.libraryKind !== "shared") return null;
  if (input.contentType !== "document") return null;
  if (input.source !== "draft" && input.source !== "published") return null;
  const pageRevision = positiveInteger(input.pageRevision);
  const draftRevision = input.draftRevision === null ? null : positiveInteger(input.draftRevision);
  if (
    !pageRevision
    || (input.source === "draft" && !draftRevision)
    || (input.source === "published" && draftRevision !== null)
  ) return null;
  if (!sha256Pattern.test(String(input.contentSha256))) return null;
  if (anchor.kind !== "document_blocks" || !Array.isArray(anchor.blockIds)) return null;
  if (anchor.blockIds.length === 0 || anchor.blockIds.length > KNOWLEDGE_SELECTION_MAX_BLOCKS) return null;
  const blockIds = anchor.blockIds.filter((item): item is string => typeof item === "string");
  if (blockIds.length !== anchor.blockIds.length || blockIds.some(id => !blockIdPattern.test(id)) || new Set(blockIds).size !== blockIds.length) return null;
  const title = safeString(input.title, 512);
  const quote = safeString(input.quote, KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH, true);
  const deepLink = safeDeepLink(input.deepLink);
  if (title === null || quote === null || deepLink === null) return null;
  return {
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    libraryId: String(input.libraryId),
    libraryKind: input.libraryKind,
    pageId: String(input.pageId),
    title,
    contentType: "document",
    source: input.source,
    pageRevision,
    draftRevision,
    contentSha256: String(input.contentSha256).toLowerCase(),
    anchor: { kind: "document_blocks", blockIds },
    quote,
    deepLink,
  };
}

export function parseKnowledgeHostPreferences(value: unknown): KnowledgeHostPreferences | null {
  const input = record(value);
  if (!input || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION) return null;
  if (input.theme !== "light" && input.theme !== "dark") return null;
  if (typeof input.locale !== "string" || !locales.has(input.locale)) return null;
  const direction = input.locale === "ar" ? "rtl" : "ltr";
  if (input.direction !== direction) return null;
  return {
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    theme: input.theme,
    locale: input.locale as KnowledgeHostLocale,
    direction,
  };
}

export function parseKnowledgeAddSelectionRequest(value: unknown): KnowledgeAddSelectionRequest | null {
  const input = record(value);
  if (!input || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION || !requestIdPattern.test(String(input.requestId))) return null;
  const reference = parseKnowledgeSelectionReference(input.reference);
  return reference ? {
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    requestId: String(input.requestId),
    reference,
  } : null;
}

export function parseKnowledgeAddSelectionResult(value: unknown): KnowledgeAddSelectionResult | null {
  const input = record(value);
  if (
    !input
    || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION
    || !requestIdPattern.test(String(input.requestId))
    || typeof input.ok !== "boolean"
  ) return null;
  const message = input.message === undefined
    ? undefined
    : safeString(input.message, KNOWLEDGE_HOST_MESSAGE_MAX_LENGTH, true);
  if (message === null) return null;
  return {
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    requestId: String(input.requestId),
    ok: input.ok,
    ...(message === undefined ? {} : { message }),
  };
}

export function parseKnowledgeHostToGuestMessage(value: unknown): KnowledgeHostToGuestMessage | null {
  const input = record(value);
  if (
    !input
    || input.channel !== KNOWLEDGE_HOST_TO_GUEST_CHANNEL
    || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION
  ) return null;
  if (input.type === "preferences") {
    const preferences = parseKnowledgeHostPreferences(input.preferences);
    return preferences ? {
      channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
      version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
      type: "preferences",
      preferences,
    } : null;
  }
  if (input.type === "add-selection-result") {
    const result = parseKnowledgeAddSelectionResult(input.result);
    return result ? {
      channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
      version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
      type: "add-selection-result",
      result,
    } : null;
  }
  return null;
}

export function parseKnowledgeGuestToHostMessage(value: unknown): KnowledgeGuestToHostMessage | null {
  const input = record(value);
  if (
    !input
    || input.channel !== KNOWLEDGE_GUEST_TO_HOST_CHANNEL
    || input.version !== KNOWLEDGE_HOST_PROTOCOL_VERSION
    || input.type !== "add-selection"
  ) return null;
  const request = parseKnowledgeAddSelectionRequest(input.request);
  return request ? {
    channel: KNOWLEDGE_GUEST_TO_HOST_CHANNEL,
    version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
    type: "add-selection",
    request,
  } : null;
}

