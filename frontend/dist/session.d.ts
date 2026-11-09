export { APIError, changePassword, configureKnowledgeTransport, errorFrom, loadConfig, loadProductSession, login, logout, refreshSession, sessionFetch, sessionScope } from "./identity-session.ts";
export type { KnowledgeTransport, ProductConfig, ProductSession } from "./identity-session.ts";
export declare function request<T>(path: string, method: string, body: unknown, signal?: AbortSignal): Promise<T>;
export declare function formatError(error: unknown): string;
