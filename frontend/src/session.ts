import { kt, ktf } from "./i18n/runtime.ts";
import { readHTTPErrorResponse } from "./http-error.ts";
import { knowledgeMutationIdempotencyKey } from "./request-idempotency.ts";

export type ProductConfig = {
  mode: "identity";
  workspace_id: string;
  runtime_id: string;
  modules: string[];
};

export type ProductSession = {
  mode: "identity";
  runtime_id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  scope: string;
  must_change_password: boolean;
  ready: boolean;
  modules: string[];
};

type IdentitySession = {
  status?: string;
  access_token?: string;
  must_change_password?: boolean;
};

export class APIError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message?: string,
    public readonly params?: Record<string, string>,
    public readonly requestID = "",
  ) {
    super(message?.trim() || code);
    this.name = "APIError";
  }
}

let accessToken = "";
let sessionRevision = 0;
let refreshPromise: Promise<boolean> | null = null;

export type KnowledgeTransport = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  scope(): string;
};

let knowledgeTransport: KnowledgeTransport | null = null;

// Allows a product host to reuse the source-owned Knowledge client with a
// different identity transport. Domain routes and response handling stay here.
export function configureKnowledgeTransport(transport: KnowledgeTransport) {
  knowledgeTransport = transport;
  sessionRevision += 1;
  return () => {
    if (knowledgeTransport === transport) {
      knowledgeTransport = null;
      sessionRevision += 1;
    }
  };
}

export function sessionScope() {
  return knowledgeTransport?.scope() || String(sessionRevision);
}

function acceptIdentitySession(value: IdentitySession, identityChanged = false) {
  if (!value.access_token) throw new APIError("identity.session_response_invalid", 502);
  accessToken = value.access_token;
  if (identityChanged) sessionRevision += 1;
  return value;
}

export async function errorFrom(response: Response) {
  const value = await readHTTPErrorResponse(response);
  return value
    ? new APIError(value.code, response.status, value.message, value.params, value.request_id)
    : new APIError(`http.${response.status}`, response.status);
}

async function identityRequest(path: string, body: unknown, token = "", additionalHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...additionalHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(path, { method: "POST", credentials: "same-origin", cache: "no-store", headers, body: JSON.stringify(body) });
  if (!response.ok) throw await errorFrom(response);
  if (response.status === 204) return {} as IdentitySession;
  return response.json() as Promise<IdentitySession>;
}

export async function loadConfig() {
  const response = await fetch("/app/config", { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw await errorFrom(response);
  return response.json() as Promise<ProductConfig>;
}

export async function login(workspaceID: string, loginID: string, password: string) {
  const value = await identityRequest("/auth/login", { workspace_id: workspaceID, login: loginID, password });
  if (value.status === "challenge_required") throw new APIError("identity.challenge_required", 409);
  return acceptIdentitySession(value, true);
}

export async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = identityRequest("/auth/refresh", {}).then(value => {
      acceptIdentitySession(value);
      return true;
    }).catch(() => {
      accessToken = "";
      sessionRevision += 1;
      return false;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function logout() {
  try { await identityRequest("/auth/logout", {}, accessToken); }
  finally { accessToken = ""; sessionRevision += 1; }
}

export async function changePassword(currentPassword: string, newPassword: string, idempotencyKey: string) {
  const value = await identityRequest(
    "/auth/change-password",
    { current_password: currentPassword, new_password: newPassword },
    accessToken,
    { "Idempotency-Key": idempotencyKey },
  );
  return acceptIdentitySession(value);
}

export async function sessionFetch(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
	if (knowledgeTransport) return knowledgeTransport.fetch(input, init);
  const headers = new Headers(init.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(input, { ...init, headers, credentials: "same-origin", cache: init.cache || "no-store" });
  if (response.status === 401 && retry && await refreshSession()) return sessionFetch(input, init, false);
  return response;
}

export async function request<T>(path: string, method: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const headers: Record<string, string> = {};
  const init: RequestInit = { method, signal };
  const idempotencyKey = knowledgeMutationIdempotencyKey(method, body);
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  init.headers = headers;
  const response = await sessionFetch(path, init);
  if (!response.ok) throw await errorFrom(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function loadProductSession(signal?: AbortSignal) {
  return request<ProductSession>("/app/session", "GET", undefined, signal);
}

export function formatError(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return kt("knowledge.auto.83f4727f2b4672a6");
  if (error instanceof APIError) {
    const messages: Record<string, string> = {
      "auth.invalid_credentials": kt("knowledge.auto.08d293478deaf6fa"),
      "auth.refresh_token_required": kt("knowledge.auto.6d3e9013e1fa296a"),
      "identity.challenge_required": kt("knowledge.auto.421a424dfb9bf9d2"),
      "knowledge.origin_required": kt("knowledge.auto.d4862e758a3b9c8c"),
      "knowledge.retrieval_unavailable": kt("knowledge.auto.df8cd5e448acfe0a"),
      "knowledge.page_form_required": kt("knowledge.auto.7915800f9c59370c"),
      "knowledge.page_form_unavailable": kt("knowledge.auto.377cc50efdef862f"),
      "knowledge.page_form_submit_denied": kt("knowledge.auto.3ee1e9bd7ad2d238"),
      "knowledge.page_form_not_open": kt("knowledge.auto.1a8ec4edf5ef0586"),
      "knowledge.page_form_closed": kt("knowledge.auto.03b29c9e3c45145a"),
      "knowledge.page_form_duplicate_submission": kt("knowledge.auto.bbc8948debe29dc3"),
      "knowledge.page_form_submission_limit": kt("knowledge.auto.f051205de6ea62ae"),
      "knowledge.page_form_answer_required": kt("knowledge.auto.a27e9173e3b1f334"),
      "knowledge.page_form_answer_hidden": kt("knowledge.auto.cfb05381f80235d8"),
      "knowledge.page_form_answer_unknown": kt("knowledge.auto.c7c1c3f48431a6da"),
      "knowledge.page_form_answer_invalid": kt("knowledge.auto.bc5b88911fe1568f"),
      "knowledge.page_form_answers_invalid": kt("knowledge.auto.6fd948976d00020e"),
      "knowledge.page_form_answers_too_large": kt("knowledge.auto.f4fc3f663a27466e"),
      "knowledge.page_form_unpublished": kt("knowledge.auto.c922ab47f0e4878c"),
      "knowledge.page_form_export_limit": kt("knowledge.auto.170aae97e2597a27"),
      "knowledge.page_share_redeem_required": kt("knowledge.auto.ce1d11e36c933cc5"),
      "knowledge.page_share_password_invalid": kt("knowledge.auto.3411d2eb5fd6bbbe"),
      "knowledge.page_share_not_found": kt("knowledge.auto.4140376178e8dc19"),
    };
    return messages[error.code] || ktf("knowledge.auto.e263826c975f4da8", { value0: error.message });
  }
  return error instanceof Error ? error.message : kt("knowledge.auto.8977b79aa82e74ff");
}
