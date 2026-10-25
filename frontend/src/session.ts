import { readHTTPErrorResponse } from "./http-error.ts";

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
  if (error instanceof DOMException && error.name === "AbortError") return "操作已取消。";
  if (error instanceof APIError) {
    const messages: Record<string, string> = {
      "auth.invalid_credentials": "账号或密码不正确。",
      "auth.refresh_token_required": "登录已失效，请重新登录。",
      "identity.challenge_required": "该账号需要完成额外验证，当前登录页暂未启用此验证方式。",
      "knowledge.origin_required": "请求来源校验失败，请从当前站点重新打开。",
      "knowledge.retrieval_unavailable": "知识检索服务尚未配置。",
      "knowledge.page_form_required": "当前页面不是可提交的问卷。",
      "knowledge.page_form_unavailable": "问卷当前不可提交，请刷新后重试。",
      "knowledge.page_form_submit_denied": "你没有提交这份问卷的权限。",
      "knowledge.page_form_not_open": "问卷尚未开放提交。",
      "knowledge.page_form_closed": "问卷已截止提交。",
      "knowledge.page_form_duplicate_submission": "你已经提交过这份问卷，不能重复提交。",
      "knowledge.page_form_submission_limit": "这份问卷的答卷数量已达到上限。",
      "knowledge.page_form_answer_required": "请完成所有必填问题。",
      "knowledge.page_form_answer_hidden": "答卷包含当前条件下不可见的问题，请刷新后重新填写。",
      "knowledge.page_form_answer_unknown": "答卷包含问卷中不存在的问题，请刷新后重新填写。",
      "knowledge.page_form_answer_invalid": "部分答案格式不正确，请检查后重新提交。",
      "knowledge.page_form_answers_invalid": "答卷格式不正确，请刷新后重新填写。",
      "knowledge.page_form_answers_too_large": "答卷内容过大，请精简后重新提交。",
      "knowledge.page_form_unpublished": "问卷尚未发布，暂时没有可统计的答卷。",
      "knowledge.page_form_export_limit": "答卷数量超过单次导出上限，请缩小导出范围。",
      "knowledge.page_share_redeem_required": "请先验证当前登录账号的分享访问资格。",
      "knowledge.page_share_password_invalid": "访问密码不正确。",
      "knowledge.page_share_not_found": "分享已撤销、已过期、账号不在允许范围，或页面不再发布。",
    };
    return messages[error.code] || `请求失败：${error.message}`;
  }
  return error instanceof Error ? error.message : "请求失败，请稍后重试。";
}
