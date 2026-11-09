import { kt, ktf } from "./i18n/runtime.ts";
import { knowledgeMutationIdempotencyKey } from "./request-idempotency.ts";
import { APIError, errorFrom, sessionFetch } from "./identity-session.ts";

export { APIError, changePassword, configureKnowledgeTransport, errorFrom, loadConfig, loadProductSession, login, logout, refreshSession, sessionFetch, sessionScope } from "./identity-session.ts";
export type { KnowledgeTransport, ProductConfig, ProductSession } from "./identity-session.ts";

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
