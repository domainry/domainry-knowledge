import type { FilePreviewSource, KnowledgeClient, KnowledgeDocument } from "./types.ts";

export type PreviewFile = { filename: string; blob: Blob; format: string; bytes: number; sha256: string };
export type PreviewText = { filename: string; format: string; text: string; bytes: number; loadedBytes: number; truncated: boolean };

export const previewTextChunkBytes = 512 * 1024;
export const previewOfficeMaxBytes = 8 * 1024 * 1024;
export const previewBinaryMaxBytes = 64 * 1024 * 1024;
export const fallbackDownloadMaxBytes = 128 * 1024 * 1024;
export const fileSHA256Header = "X-Domainry-File-SHA256";
const textFormats = new Set(["txt", "md", "rst", "html", "htm", "csv", "json", "jsonl", "py", "js", "ts", "tsx", "jsx", "java", "go", "rs", "c", "h", "cpp", "hpp", "cs", "rb", "php", "kt", "swift", "scala", "sh"]);
const fileFormats = new Set(["pdf", "docx", "pptx", "xlsx", "xlsm", "png", "jpg", "jpeg", "gif", "bmp", "webp", "mp3", "wav", "ogg", "flac", "m4a", "aac", "mp4", "mov", "webm", "avi"]);
const previewContentTypes: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlsm: "application/vnd.ms-excel.sheet.macroEnabled.12",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  m4a: "audio/mp4",
  aac: "audio/aac",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  avi: "video/x-msvideo",
};

export function previewFormat(filename: string) {
  return filename.split(".").at(-1)?.toLowerCase() || "";
}

export function isTextPreviewFormat(format: string) {
  return textFormats.has(format);
}

export function canPreviewFilename(filename: string) {
  const format = previewFormat(filename);
  return textFormats.has(format) || fileFormats.has(format);
}

export function downloadFilename(header: string | null) {
  const encoded = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = header?.match(/filename="((?:[^"\\]|\\.)*)"/i)?.[1]?.replace(/\\(.)/g, "$1") || header?.match(/filename=([^;\s]+)/i)?.[1];
  let value: string | undefined;
  try { value = encoded ? decodeURIComponent(encoded) : plain; }
  catch { throw Error("文档文件名无效。"); }
  if (!value || value.length > 512 || /[\x00-\x1f/\\]/.test(value)) throw Error("文档文件名无效。");
  return value;
}

function responseSize(response: Response) {
  const length = Number(response.headers.get("Content-Length"));
  const match = response.headers.get("Content-Range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
  const total = match ? Number(match[3]) : length;
  const loaded = match ? Number(match[2]) - Number(match[1]) + 1 : length;
  const start = match ? Number(match[1]) : 0, end = match ? Number(match[2]) + 1 : length;
  if (!Number.isSafeInteger(length) || length < 1 || !Number.isSafeInteger(total) || total < 1 || !Number.isSafeInteger(loaded) || loaded !== length || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end > total) throw Error("文件内容长度无法核对。");
  return { total, loaded, start, end };
}

async function checkedContent(source: FilePreviewSource, signal: AbortSignal, range?: string) {
  const response = await source.read({ signal, range });
  if (!response.ok && response.status !== 206) {
    const data = await response.json().catch(() => ({})) as { code?: string };
    throw Error(data.code || `读取文件失败（${response.status}）`);
  }
  const filename = downloadFilename(response.headers.get("Content-Disposition"));
  const sha256 = response.headers.get(fileSHA256Header) || "";
  const { total, loaded, start, end } = responseSize(response);
  if (!/^[a-f0-9]{64}$/.test(sha256) || (source.file.sha256 && sha256 !== source.file.sha256) || (source.file.bytes !== undefined && total !== source.file.bytes)) {
    await response.body?.cancel();
    throw Error("文件内容与所选版本不一致，请刷新后重试。");
  }
  return { response, filename, sha256, total, loaded, start, end };
}

export async function readPreviewFile(source: FilePreviewSource, signal: AbortSignal, maxBytes = previewBinaryMaxBytes): Promise<PreviewFile> {
  const current = await checkedContent(source, signal);
  if (current.total > maxBytes) {
    await current.response.body?.cancel();
    throw Error(`此文件有 ${(current.total / 1024 / 1024).toFixed(1)} MiB，超过当前查看器 ${(maxBytes / 1024 / 1024).toFixed(0)} MiB 的安全预览上限，请下载原文件查看。`);
  }
  let blob = await current.response.blob();
  if (blob.size !== current.total) throw Error("文件内容没有完整读取。");
  signal.throwIfAborted();
  const format = previewFormat(current.filename);
  blob = blob.slice(0, blob.size, previewContentTypes[format] || "application/octet-stream");
  return { filename: current.filename, blob, format, bytes: current.total, sha256: current.sha256 };
}

export async function readPreviewText(source: FilePreviewSource, signal: AbortSignal): Promise<PreviewText> {
  const current = await checkedContent(source, signal, `bytes=0-${previewTextChunkBytes - 1}`);
  const data = await current.response.arrayBuffer();
  if (data.byteLength !== current.loaded) throw Error("文件内容没有完整读取。");
  let text: string;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(data); }
  catch { throw Error("此文件不是有效的 UTF-8 文本，请下载原文件查看。"); }
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)) throw Error("此文件包含二进制控制字符，不能作为文本安全预览。");
  return { filename: current.filename, format: previewFormat(current.filename), text, bytes: current.total, loadedBytes: current.loaded, truncated: current.loaded < current.total };
}

export async function readPreviewRange(source: FilePreviewSource, begin: number, end: number, signal: AbortSignal) {
  if (!Number.isSafeInteger(begin) || !Number.isSafeInteger(end) || begin < 0 || end <= begin) throw Error("文件分段范围无效。");
  const current = await checkedContent(source, signal, `bytes=${begin}-${end - 1}`);
  if (current.start !== begin || current.end !== Math.min(end, current.total)) {
    await current.response.body?.cancel();
    throw Error("服务端返回了错误的文件分段。");
  }
  const data = new Uint8Array(await current.response.arrayBuffer());
  if (data.byteLength !== current.loaded) throw Error("文件分段没有完整读取。");
  return { data, total: current.total, filename: current.filename, sha256: current.sha256 };
}

type SavePickerWindow = Window & { showSaveFilePicker?: (options: { suggestedName: string }) => Promise<{ createWritable(): Promise<WritableStream> }> };

export async function downloadFile(source: FilePreviewSource, signal: AbortSignal) {
  const picker = (window as SavePickerWindow).showSaveFilePicker;
  if (picker) {
    const handle = await picker({ suggestedName: source.file.filename });
    const current = await checkedContent(source, signal);
    if (!current.response.body) throw Error("浏览器无法读取下载内容。");
    await current.response.body.pipeTo(await handle.createWritable(), { signal });
    return;
  }
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

export function downloadDocument(client: KnowledgeClient, document: KnowledgeDocument, signal: AbortSignal) {
  return downloadFile(knowledgeDocumentPreviewSource(client, document), signal);
}
