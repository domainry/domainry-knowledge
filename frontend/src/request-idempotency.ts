export function knowledgeMutationIdempotencyKey(method: string, body: unknown, createKey = () => crypto.randomUUID()) {
  const normalizedMethod = method.toUpperCase();
  if (normalizedMethod === "GET" || normalizedMethod === "HEAD" || normalizedMethod === "OPTIONS") return "";
  const clientID = body && typeof body === "object" && !Array.isArray(body) && "client_id" in body
    ? (body as { client_id?: unknown }).client_id
    : undefined;
  return typeof clientID === "string" && clientID.trim() ? clientID.trim() : createKey();
}
