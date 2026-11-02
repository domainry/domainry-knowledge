import { kt, ktf } from "./i18n/runtime.ts";
import type { FilePreviewSource, KnowledgeClient, KnowledgeDocument } from "./types.ts";
import { readHTTPErrorResponse } from "./http-error.ts";

export type PreviewFile = { filename: string; blob: Blob; format: string; bytes: number; sha256: string };
export type PreviewText = { filename: string; format: string; text: string; bytes: number; loadedBytes: number; truncated: boolean };

export const previewTextChunkBytes = 512 * 1024;
export const previewOfficeMaxBytes = 8 * 1024 * 1024;
export const previewBinaryMaxBytes = 64 * 1024 * 1024;
export const fallbackDownloadMaxBytes = 128 * 1024 * 1024;
export const fileSHA256Header = "X-Domainry-File-SHA256";
export type FilePreviewKind = "text" | "pdf" | "word" | "presentation" | "spreadsheet" | "image" | "audio" | "video";

type PreviewFormatDefinition = { kind: FilePreviewKind; contentType: string };

// This is the browser preview contract. Keep every supported extension in one
// registry so capability checks, response MIME types, renderer dispatch, and
// the exhaustive format test cannot drift independently.
export const previewFormatDefinitions = Object.freeze({
  txt: { kind: "text", contentType: "text/plain" }, md: { kind: "text", contentType: "text/markdown" }, rst: { kind: "text", contentType: "text/plain" }, html: { kind: "text", contentType: "text/html" }, htm: { kind: "text", contentType: "text/html" },
  csv: { kind: "text", contentType: "text/csv" }, json: { kind: "text", contentType: "application/json" }, jsonl: { kind: "text", contentType: "application/x-ndjson" }, py: { kind: "text", contentType: "text/x-python" },
  js: { kind: "text", contentType: "text/javascript" }, ts: { kind: "text", contentType: "text/plain" }, tsx: { kind: "text", contentType: "text/plain" }, jsx: { kind: "text", contentType: "text/javascript" }, java: { kind: "text", contentType: "text/x-java-source" },
  go: { kind: "text", contentType: "text/x-go" }, rs: { kind: "text", contentType: "text/plain" }, c: { kind: "text", contentType: "text/x-c" }, h: { kind: "text", contentType: "text/x-c" }, cpp: { kind: "text", contentType: "text/x-c++" }, hpp: { kind: "text", contentType: "text/x-c++" },
  cs: { kind: "text", contentType: "text/plain" }, rb: { kind: "text", contentType: "text/x-ruby" }, php: { kind: "text", contentType: "text/x-php" }, kt: { kind: "text", contentType: "text/plain" }, swift: { kind: "text", contentType: "text/plain" }, scala: { kind: "text", contentType: "text/plain" }, sh: { kind: "text", contentType: "text/x-shellscript" },
  pdf: { kind: "pdf", contentType: "application/pdf" },
  docx: { kind: "word", contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  pptx: { kind: "presentation", contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  xlsx: { kind: "spreadsheet", contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }, xlsm: { kind: "spreadsheet", contentType: "application/vnd.ms-excel.sheet.macroEnabled.12" },
  png: { kind: "image", contentType: "image/png" }, jpg: { kind: "image", contentType: "image/jpeg" }, jpeg: { kind: "image", contentType: "image/jpeg" }, gif: { kind: "image", contentType: "image/gif" }, bmp: { kind: "image", contentType: "image/bmp" }, webp: { kind: "image", contentType: "image/webp" },
  mp3: { kind: "audio", contentType: "audio/mpeg" }, wav: { kind: "audio", contentType: "audio/wav" }, ogg: { kind: "audio", contentType: "audio/ogg" }, flac: { kind: "audio", contentType: "audio/flac" }, m4a: { kind: "audio", contentType: "audio/mp4" }, aac: { kind: "audio", contentType: "audio/aac" },
  mp4: { kind: "video", contentType: "video/mp4" }, mov: { kind: "video", contentType: "video/quicktime" }, webm: { kind: "video", contentType: "video/webm" }, avi: { kind: "video", contentType: "video/x-msvideo" },
} satisfies Record<string, PreviewFormatDefinition>);

export const supportedPreviewFormats = Object.freeze(Object.keys(previewFormatDefinitions));

export function previewFormat(filename: string) {
  return filename.split(".").at(-1)?.toLowerCase() || "";
}

export function previewKind(filename: string): FilePreviewKind | null {
  const format = previewFormat(filename);
  return (previewFormatDefinitions as Record<string, PreviewFormatDefinition>)[format]?.kind || null;
}

export function isTextPreviewFormat(format: string) {
  return (previewFormatDefinitions as Record<string, PreviewFormatDefinition>)[format]?.kind === "text";
}

export function canPreviewFilename(filename: string) {
  return previewKind(filename) !== null;
}

export function downloadFilename(header: string | null) {
  const encoded = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = header?.match(/filename="((?:[^"\\]|\\.)*)"/i)?.[1]?.replace(/\\(.)/g, "$1") || header?.match(/filename=([^;\s]+)/i)?.[1];
  let value: string | undefined;
  try { value = encoded ? decodeURIComponent(encoded) : plain; }
  catch { throw Error(kt("knowledge.auto.69dc4a3fa3292385")); }
  if (!value || value.length > 512 || /[\x00-\x1f/\\]/.test(value)) throw Error(kt("knowledge.auto.69dc4a3fa3292385"));
  return value;
}

function responseSize(response: Response) {
  const length = Number(response.headers.get("Content-Length"));
  const match = response.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
  const total = match ? Number(match[3]) : length;
  const loaded = match ? Number(match[2]) - Number(match[1]) + 1 : length;
  const start = match ? Number(match[1]) : 0, end = match ? Number(match[2]) + 1 : length;
  if (!Number.isSafeInteger(length) || length < 1 || !Number.isSafeInteger(total) || total < 1 || !Number.isSafeInteger(loaded) || loaded !== length || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end > total) throw Error(kt("knowledge.auto.6470b596eab997c9"));
  return { total, loaded, start, end };
}

async function checkedContent(source: FilePreviewSource, signal: AbortSignal, range?: string) {
  const response = await source.read({ signal, range });
  if (!response.ok && response.status !== 206) {
    const error = await readHTTPErrorResponse(response);
    throw Error(error ? `${error.message}（${error.code}）` : ktf("knowledge.auto.326c16c2fbb7a49a", { value0: response.status }));
  }
  const filename = downloadFilename(response.headers.get("Content-Disposition"));
  const sha256 = response.headers.get(fileSHA256Header) || "";
  const { total, loaded, start, end } = responseSize(response);
  if (!/^[a-f0-9]{64}$/.test(sha256) || (source.file.sha256 && sha256 !== source.file.sha256) || (source.file.bytes !== undefined && total !== source.file.bytes)) {
    await response.body?.cancel();
    throw Error(kt("knowledge.auto.6ef0b18a6f13ade7"));
  }
  return { response, filename, sha256, total, loaded, start, end };
}

export async function readPreviewFile(source: FilePreviewSource, signal: AbortSignal, maxBytes = previewBinaryMaxBytes): Promise<PreviewFile> {
  const current = await checkedContent(source, signal);
  if (current.total > maxBytes) {
    await current.response.body?.cancel();
    throw Error(ktf("knowledge.auto.1ae0ac051a4c8dca", { value0: (current.total / 1024 / 1024).toFixed(1), value1: (maxBytes / 1024 / 1024).toFixed(0) }));
  }
  let blob = await current.response.blob();
  if (blob.size !== current.total) throw Error(kt("knowledge.auto.a587b9da0fcaea81"));
  signal.throwIfAborted();
  const format = previewFormat(current.filename);
  const definition = (previewFormatDefinitions as Record<string, PreviewFormatDefinition>)[format];
  blob = blob.slice(0, blob.size, definition?.contentType || "application/octet-stream");
  return { filename: current.filename, blob, format, bytes: current.total, sha256: current.sha256 };
}

export async function readPreviewText(source: FilePreviewSource, signal: AbortSignal): Promise<PreviewText> {
  const current = await checkedContent(source, signal, `bytes=0-${previewTextChunkBytes - 1}`);
  const data = await current.response.arrayBuffer();
  if (data.byteLength !== current.loaded) throw Error(kt("knowledge.auto.a587b9da0fcaea81"));
  let text: string;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(data); }
  catch { throw Error(kt("knowledge.auto.fbece0e6ad6a8d15")); }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)) throw Error(kt("knowledge.auto.c67e2e9008bf94ce"));
  return { filename: current.filename, format: previewFormat(current.filename), text, bytes: current.total, loadedBytes: current.loaded, truncated: current.loaded < current.total };
}

export async function readPreviewRange(source: FilePreviewSource, begin: number, end: number, signal: AbortSignal) {
  if (!Number.isSafeInteger(begin) || !Number.isSafeInteger(end) || begin < 0 || end <= begin) throw Error(kt("knowledge.auto.aa7fbd25783bbde0"));
  const current = await checkedContent(source, signal, `bytes=${begin}-${end - 1}`);
  if (current.start !== begin || current.end !== Math.min(end, current.total)) {
    await current.response.body?.cancel();
    throw Error(kt("knowledge.auto.cd71c51396bb6cdc"));
  }
  const data = new Uint8Array(await current.response.arrayBuffer());
  if (data.byteLength !== current.loaded) throw Error(kt("knowledge.auto.b32145a345095572"));
  return { data, total: current.total, filename: current.filename, sha256: current.sha256 };
}

export async function downloadFile(source: FilePreviewSource, signal: AbortSignal) {
  const current = await readPreviewFile(source, signal, fallbackDownloadMaxBytes);
  const url = URL.createObjectURL(current.blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = current.filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function knowledgeDocumentPreviewSource(client: KnowledgeClient, document: KnowledgeDocument): FilePreviewSource {
  return {
    identity: `knowledge:${document.library_id}:${document.id}:${document.revision}:${document.bytes}:${document.sha256}`,
    file: { filename: document.filename, bytes: document.bytes, sha256: document.sha256 },
    streamURL: client.documentContentURL?.(document.library_id, document.id),
    async read(request) {
      const response = await client.readDocumentContent(document.library_id, document.id, request);
      const headers = new Headers(response.headers);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    },
  };
}

export function knowledgePageDocumentDownloadSource(client: KnowledgeClient, pageID: string, document: KnowledgeDocument): FilePreviewSource {
  return {
    identity: `knowledge-page-download:${document.library_id}:${pageID}:${document.id}:${document.revision}:${document.bytes}:${document.sha256}`,
    file: { filename: document.filename, bytes: document.bytes, sha256: document.sha256 },
    async read(request) {
      if (!client.readPageDocumentContent) throw Error(kt("knowledge.auto.2fba86ca07c4281c"));
      const response = await client.readPageDocumentContent(document.library_id, pageID, document.id, request);
      const headers = new Headers(response.headers);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    },
  };
}

export function downloadDocument(client: KnowledgeClient, document: KnowledgeDocument, signal: AbortSignal) {
  return downloadFile(knowledgeDocumentPreviewSource(client, document), signal);
}
