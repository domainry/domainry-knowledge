import { readHTTPErrorResponse } from "../src/http-error.ts";

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

export function sessionScope() {
  return String(sessionRevision);
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

async function identityRequest(path: string, body: unknown, token = "") {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
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

export async function changePassword(currentPassword: string, newPassword: string) {
  const value = await identityRequest("/auth/change-password", { current_password: currentPassword, new_password: newPassword }, accessToken);
  return acceptIdentitySession(value);
}

export async function sessionFetch(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
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
    };
    return messages[error.code] || `请求失败：${error.message}`;
  }
  return error instanceof Error ? error.message : "请求失败，请稍后重试。";
}
