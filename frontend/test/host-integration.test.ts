import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWLEDGE_HOST_PROTOCOL_VERSION,
  KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
  KNOWLEDGE_GUEST_TO_HOST_CHANNEL,
  KNOWLEDGE_SELECTION_MAX_BLOCKS,
  KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH,
  boundKnowledgeDocumentSelection,
  createKnowledgeSelectionReference,
  parseKnowledgeAddSelectionRequest,
  parseKnowledgeGuestToHostMessage,
  parseKnowledgeHostPreferences,
  parseKnowledgeHostToGuestMessage,
  parseKnowledgeSelectionReference,
} from "../src/hostIntegration.ts";

const reference = {
  version: KNOWLEDGE_HOST_PROTOCOL_VERSION,
  libraryId: `klib_${"a".repeat(32)}`,
  libraryKind: "shared",
  pageId: `kpage_${"b".repeat(32)}`,
  title: "Release notes",
  contentType: "document",
  source: "draft",
  pageRevision: 7,
  draftRevision: 11,
  contentSha256: "c".repeat(64),
  anchor: { kind: "document_blocks", blockIds: ["block-1", "block-2"] },
  quote: "Selected content",
  deepLink: "https://knowledge.example.test/?knowledge_page=page",
  accessToken: "must-not-cross-the-host-boundary",
  workspaceId: "must-not-cross-the-host-boundary",
} as const;

test("selection reference parser returns a bounded credential-free wire value", () => {
  assert.deepEqual(parseKnowledgeSelectionReference(reference), {
    version: 1,
    libraryId: reference.libraryId,
    libraryKind: "shared",
    pageId: reference.pageId,
    title: "Release notes",
    contentType: "document",
    source: "draft",
    pageRevision: 7,
    draftRevision: 11,
    contentSha256: "c".repeat(64),
    anchor: { kind: "document_blocks", blockIds: ["block-1", "block-2"] },
    quote: "Selected content",
    deepLink: "https://knowledge.example.test/?knowledge_page=page",
  });
});

test("selection reference parser rejects unsupported, stale, and oversized shapes", () => {
  assert.equal(parseKnowledgeSelectionReference({ ...reference, version: 2 }), null);
  assert.equal(parseKnowledgeSelectionReference({ ...reference, contentType: "spreadsheet" }), null);
  assert.equal(parseKnowledgeSelectionReference({ ...reference, source: "draft", draftRevision: null }), null);
  assert.equal(parseKnowledgeSelectionReference({ ...reference, source: "published", draftRevision: 11 }), null);
  assert.equal(parseKnowledgeSelectionReference({ ...reference, anchor: { kind: "document_blocks", blockIds: Array.from({ length: KNOWLEDGE_SELECTION_MAX_BLOCKS + 1 }, (_, index) => `block-${index}`) } }), null);
  assert.equal(parseKnowledgeSelectionReference({ ...reference, anchor: { kind: "document_blocks", blockIds: ["block-1", "block-1"] } }), null);
});

test("document selection builder preserves oversized selections through bounded block and quote snapshots", () => {
  const selection = boundKnowledgeDocumentSelection(
    Array.from({ length: KNOWLEDGE_SELECTION_MAX_BLOCKS + 8 }, (_, index) => `block-${index}`),
    "界".repeat(KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH + 100),
  );
  assert.equal(selection?.blockIds.length, KNOWLEDGE_SELECTION_MAX_BLOCKS);
  assert.equal(selection?.blockIds[0], "block-0");
  assert.equal(selection?.blockIds.at(-1), `block-${KNOWLEDGE_SELECTION_MAX_BLOCKS - 1}`);
  assert.equal(selection?.quote.length, KNOWLEDGE_SELECTION_MAX_QUOTE_LENGTH);
  assert.deepEqual(boundKnowledgeDocumentSelection(["block-1", "block-1", "block-2"], "Selected"), { blockIds: ["block-1", "block-2"], quote: "Selected" });
});

test("selection reference builder binds the persisted source revision and first-block deep link", () => {
  const built = createKnowledgeSelectionReference({
    libraryId: reference.libraryId,
    libraryKind: reference.libraryKind,
    pageId: reference.pageId,
    title: reference.title,
    contentType: "document",
    source: "draft",
    pageRevision: reference.pageRevision,
    draftRevision: reference.draftRevision,
    contentSha256: reference.contentSha256,
    blockIds: reference.anchor.blockIds,
    quote: reference.quote,
    deepLink: "https://knowledge.example.test/?knowledge_block=block-1",
  });
  assert.equal(built?.anchor.blockIds[0], "block-1");
  assert.equal(built?.draftRevision, 11);
  assert.equal(built?.deepLink, "https://knowledge.example.test/?knowledge_block=block-1");
});

test("host preference parser enforces Deck locale direction", () => {
  assert.deepEqual(parseKnowledgeHostPreferences({ version: 1, theme: "dark", locale: "ar", direction: "rtl" }), {
    version: 1,
    theme: "dark",
    locale: "ar",
    direction: "rtl",
  });
  assert.equal(parseKnowledgeHostPreferences({ version: 1, theme: "dark", locale: "ar", direction: "ltr" }), null);
  assert.equal(parseKnowledgeHostPreferences({ version: 1, theme: "dark", locale: "ru", direction: "ltr" }), null);
});

test("selection request parser binds a valid request id to the sanitized reference", () => {
  const parsed = parseKnowledgeAddSelectionRequest({ version: 1, requestId: "selection:1", reference });
  assert.equal(parsed?.requestId, "selection:1");
  assert.equal(parsed?.reference.quote, "Selected content");
  assert.equal("accessToken" in (parsed?.reference ?? {}), false);
});

test("bridge envelope parsers reject wrong channels and preserve bounded acknowledgements", () => {
  assert.equal(parseKnowledgeGuestToHostMessage({
    channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
    version: 1,
    type: "add-selection",
    request: { version: 1, requestId: "selection:1", reference },
  }), null);
  assert.equal(parseKnowledgeGuestToHostMessage({
    channel: KNOWLEDGE_GUEST_TO_HOST_CHANNEL,
    version: 1,
    type: "add-selection",
    request: { version: 1, requestId: "selection:1", reference },
  })?.request.reference.pageId, reference.pageId);
  assert.deepEqual(parseKnowledgeHostToGuestMessage({
    channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
    version: 1,
    type: "add-selection-result",
    result: { version: 1, requestId: "selection:1", ok: false, message: "No active conversation" },
  }), {
    channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
    version: 1,
    type: "add-selection-result",
    result: { version: 1, requestId: "selection:1", ok: false, message: "No active conversation" },
  });
  assert.equal(parseKnowledgeHostToGuestMessage({
    channel: KNOWLEDGE_HOST_TO_GUEST_CHANNEL,
    version: 1,
    type: "add-selection-result",
    result: { version: 1, requestId: "selection:1", ok: false, message: "x".repeat(1_025) },
  }), null);
});
