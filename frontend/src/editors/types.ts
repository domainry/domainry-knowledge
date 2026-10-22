import type { KnowledgeApplicationCard, KnowledgeApplicationCardResolve, KnowledgeFormAnalytics, KnowledgeFormExport, KnowledgeFormSubmission, KnowledgeFormSubmissionPage, KnowledgeGridAccess, KnowledgePageContentType, KnowledgePagePollView, KnowledgePagePollWrite, KnowledgePageSearchLocation, KnowledgePageTask, KnowledgePageTaskWrite, KnowledgePageVersion, KnowledgePrincipal } from "../types.ts";
import type { ReactNode } from "react";
import type * as Y from "yjs";

export type KnowledgeEditorCollaboration = {
  document: Y.Doc;
  fragment: Y.XmlFragment;
  initializeFromBody: boolean;
  user: { name: string; color: string };
  provider?: { awareness?: import("y-protocols/awareness").Awareness };
};

export type KnowledgeEditorChange = {
  editedBlockIDs: string[];
  cursorBlockID?: string;
  selectionBlockID?: string;
};

export type KnowledgeCommentAnchorSelection = {
  nodeID: string;
  quote: string;
};

export type KnowledgeMentionPerson = {
  userID: string;
  displayName: string;
  email?: string;
};

export type KnowledgeMentionPage = {
  pageID: string;
  title: string;
  contentType: KnowledgePageContentType;
  aliases: string[];
  path: { pageID: string; title: string }[];
};

export type KnowledgeMentionRuntime = {
  currentPageID: string;
  searchPeople(query: string, signal: AbortSignal): Promise<KnowledgeMentionPerson[]>;
  resolvePerson(userID: string, signal: AbortSignal): Promise<KnowledgeMentionPerson | null>;
  searchPages(query: string, signal: AbortSignal): Promise<KnowledgeMentionPage[]>;
  resolvePage(pageID: string, signal: AbortSignal): Promise<KnowledgeMentionPage | null>;
};

export type KnowledgeTaskRuntime = {
  ready: boolean;
  canCreate: boolean;
  taskForBlock(blockID: string): KnowledgePageTask | undefined;
  canManage(task: KnowledgePageTask): boolean;
  canUpdateStatus(task: KnowledgePageTask): boolean;
  ensureTask(blockID: string, title: string): Promise<KnowledgePageTask>;
  updateTask(task: KnowledgePageTask, patch: Partial<KnowledgePageTaskWrite>): Promise<KnowledgePageTask>;
  searchMembers(query: string, signal: AbortSignal): Promise<KnowledgePrincipal[]>;
  memberName(userID: string): string;
};

export type KnowledgePollRuntime = {
  ready: boolean;
  canCreate: boolean;
  pollForBlock(blockID: string): KnowledgePagePollView | undefined;
  canManage(poll: KnowledgePagePollView): boolean;
  ensurePoll(blockID: string, question: string): Promise<KnowledgePagePollView>;
  updatePoll(poll: KnowledgePagePollView, patch: Partial<KnowledgePagePollWrite>): Promise<KnowledgePagePollView>;
  votePoll(poll: KnowledgePagePollView, optionIDs: string[]): Promise<KnowledgePagePollView>;
};

export type KnowledgeDynamicBlockRuntime = {
  currentPageID: string;
  canCreateChild: boolean;
  listChildPages(limit: number, signal: AbortSignal): Promise<KnowledgeMentionPage[]>;
  searchPages(query: string, signal: AbortSignal): Promise<KnowledgeMentionPage[]>;
  resolvePage(pageID: string, signal: AbortSignal): Promise<KnowledgeMentionPage | null>;
  listPageVersions(pageID: string, signal: AbortSignal): Promise<KnowledgePageVersion[]>;
  createChildReference(input: { blockID: string; parentContent: string; title: string; contentType: KnowledgePageContentType; display: "card" | "embed" }): Promise<void>;
  renderReference(input: { blockID: string; targetPageID: string; title: string; contentType: KnowledgePageContentType; display: "card" | "embed"; referenceMode: "live" | "fixed"; targetVersion: number; embeddedEdit: boolean }): ReactNode;
  listPageActivity(limit: number, signal: AbortSignal): Promise<{ id: string; title: string; detail: string; at: string }[]>;
  resolveApplicationCard?(input: KnowledgeApplicationCardResolve, signal: AbortSignal): Promise<KnowledgeApplicationCard>;
  openPage(pageID: string): void;
};

export type KnowledgeFormRuntime = {
  canSubmit: boolean;
  canManage: boolean;
  publishedVersion: number;
  shareURL: string;
  formatError(error: unknown): string;
  submit(answers: Record<string, unknown>): Promise<KnowledgeFormSubmission>;
  listResponses(before: string, limit: number): Promise<KnowledgeFormSubmissionPage>;
  analytics(): Promise<KnowledgeFormAnalytics>;
  exportResponses(): Promise<KnowledgeFormExport>;
};

export type KnowledgeEditorProps = {
  body: string;
  readOnly: boolean;
  documentTitle?: string;
  canManage?: boolean;
  gridAccess?: KnowledgeGridAccess;
  collaboration?: KnowledgeEditorCollaboration;
  mentions?: KnowledgeMentionRuntime;
  tasks?: KnowledgeTaskRuntime;
  polls?: KnowledgePollRuntime;
  dynamicBlocks?: KnowledgeDynamicBlockRuntime;
  form?: KnowledgeFormRuntime;
  initialBlockID?: string;
  initialSearchLocation?: KnowledgePageSearchLocation;
  blockHighlightRevision?: number;
  blockLink?(blockID: string): string;
  insertMarkdownRequest?: { id: string; markdown: string };
  authorizeContentAction?(operation: "copy" | "print" | "export" | "duplicate"): Promise<void>;
  onActionFeedback?(message: string): void;
  uploadFile?(file: File, blockID?: string): Promise<string | Record<string, unknown>>;
  fileUploadsEnabled?: boolean;
  readFile?(reference: string): Promise<Blob>;
  convertPage?(targetType: "document" | "mind_note", title: string, body: string): Promise<void>;
  onChange(body: string, collaboration?: KnowledgeEditorChange): void;
  onPresence?(cursorBlockID?: string, selectionBlockID?: string): void;
  onCommentAnchor?(anchor?: KnowledgeCommentAnchorSelection): void;
};

export type KnowledgeEditorModule = {
  default: React.ComponentType<KnowledgeEditorProps>;
};

export type KnowledgeEditorKind = KnowledgePageContentType;
