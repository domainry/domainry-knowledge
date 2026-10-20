export type HTTPErrorResponse = {
  code: string;
  message: string;
  params?: Record<string, string>;
  request_id: string;
};

export function parseHTTPErrorResponse(value: unknown): HTTPErrorResponse | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.code !== "string" || !record.code.trim() || typeof record.message !== "string" || !record.message.trim() || typeof record.request_id !== "string") return null;
  if (record.params !== undefined && (!record.params || typeof record.params !== "object" || Array.isArray(record.params) || Object.values(record.params).some(item => typeof item !== "string"))) return null;
  return {
    code: record.code,
    message: record.message,
    ...(record.params === undefined ? {} : { params: record.params as Record<string, string> }),
    request_id: record.request_id,
  };
}

export async function readHTTPErrorResponse(response: Response): Promise<HTTPErrorResponse | null> {
  return parseHTTPErrorResponse(await response.json().catch(() => undefined));
}
