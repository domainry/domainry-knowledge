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
export declare class APIError extends Error {
    readonly code: string;
    readonly status: number;
    readonly params?: Record<string, string> | undefined;
    readonly requestID: string;
    constructor(code: string, status: number, message?: string, params?: Record<string, string> | undefined, requestID?: string);
}
export type KnowledgeTransport = {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    scope(): string;
};
export declare function configureKnowledgeTransport(transport: KnowledgeTransport): () => void;
export declare function sessionScope(): string;
export declare function errorFrom(response: Response): Promise<APIError>;
export declare function loadConfig(): Promise<ProductConfig>;
export declare function login(workspaceID: string, loginID: string, password: string): Promise<IdentitySession>;
export declare function refreshSession(): Promise<boolean>;
export declare function logout(): Promise<void>;
export declare function changePassword(currentPassword: string, newPassword: string, idempotencyKey: string): Promise<IdentitySession>;
export declare function sessionFetch(input: RequestInfo | URL, init?: RequestInit, retry?: boolean): Promise<Response>;
export declare function request<T>(path: string, method: string, body: unknown, signal?: AbortSignal): Promise<T>;
export declare function loadProductSession(signal?: AbortSignal): Promise<ProductSession>;
export declare function formatError(error: unknown): string;
export {};
