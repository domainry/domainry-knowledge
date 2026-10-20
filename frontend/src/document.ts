import { createSHA256 } from "hash-wasm";
import type { KnowledgeDocument, KnowledgeLibrary } from "./types.ts";

export const knowledgeDocumentMaxBytes = 1024 * 1024 * 1024;

function configuredDocumentExtensions(library: KnowledgeLibrary) {
  const configured = library.document_formats?.map(format => format.extension).filter(value => /^\.[a-z0-9]{1,8}$/.test(value));
  return configured || [];
}

export function knowledgeDocumentAccept(library: KnowledgeLibrary) {
  return configuredDocumentExtensions(library).join(",");
}

export function knowledgeDocumentSupports(library: KnowledgeLibrary, filename: string) {
  const lower = filename.toLowerCase();
  return configuredDocumentExtensions(library).some(extension => lower.endsWith(extension));
}

export function documentUploadMaxBytes(library: KnowledgeLibrary) {
  const configured = library.document_max_bytes;
  return Number.isSafeInteger(configured) && configured! > 0
    ? Math.min(configured!, knowledgeDocumentMaxBytes)
    : knowledgeDocumentMaxBytes;
}

export function documentIndexMaxBytes(library: KnowledgeLibrary) {
  const configured = library.document_index_max_bytes;
  return Number.isSafeInteger(configured) && configured! > 0
    ? Math.min(configured!, knowledgeDocumentMaxBytes)
    : knowledgeDocumentMaxBytes;
}

export function documentFormat(library: KnowledgeLibrary, filename: string) {
  const lower = filename.toLowerCase();
  return library.document_formats?.find(format => /^\.[a-z0-9]{1,8}$/.test(format.extension) && lower.endsWith(format.extension));
}

// Only BuilderMaxBytes is a whole-file processing ceiling. Asset,
// enrichment and analysis-output budgets describe derived work and must not
// accidentally shrink the upload/index limit for their container document.
export function documentIndexMaxBytesForFilename(library: KnowledgeLibrary, filename: string) {
  const format = documentFormat(library, filename);
  if (!format) return 0;
  const transportMaximum = documentIndexMaxBytes(library);
  return Number.isSafeInteger(format.builder_max_bytes) && format.builder_max_bytes! > 0
    ? Math.min(transportMaximum, format.builder_max_bytes!)
    : transportMaximum;
}

export function documentCanWrite(library: KnowledgeLibrary) {
  return library.role === "editor" || library.role === "manager";
}

export function documentCanDownload(document: KnowledgeDocument) {
  return document.security_status === "clean" && ["queued", "indexing", "ready", "failed", "needs_reconcile"].includes(document.state);
}

export function documentCanRetry(document: KnowledgeDocument) {
  if (document.security_status === "rejected" || document.state === "deleting" || document.state === "deleted") return false;
  return document.state === "failed" || document.state === "needs_reconcile" || !!document.error_code;
}

export function documentCanReindex(document: KnowledgeDocument) {
  return document.state === "ready" && document.security_status === "clean" && !document.reindexing && !document.error_code;
}

export function documentLabel(document: Pick<KnowledgeDocument, "state" | "index_status" | "error_code" | "reindexing">) {
  if (document.reindexing) return "可检索 · 正在重新索引";
  if (document.state === "indexing" && document.error_code === "document_index_failed") return "索引失败";
  return ({
    uploading: "上传未完成",
    quarantined: "已隔离 · 等待安全扫描",
    scanning: "正在安全扫描",
    queued: "等待入库",
    indexing: "正在建立索引",
    ready: "可检索",
    failed: "处理未完成",
    needs_reconcile: "上传结果待核查",
    deleting: "已停止访问 · 正在清理",
    deleted: "已删除",
  } as const)[document.state] || "状态未知";
}

export function documentStatusDetail(document: KnowledgeDocument) {
  if (document.reindexing) return "当前索引保持可用；新一代索引在后台建立，确认完成后才会原子切换。";
  const failure = documentErrorDetail(document.error_code);
  if (failure) return failure;
  if (document.state === "deleting") return "已停止检索和下载；原文件与远端索引清理完成前，此记录会继续保留。";
  if (document.state === "needs_reconcile") return "远端可能已收到文件，系统正在核对结果，不会盲目重复推送。";
  if (document.security_status === "rejected") return "安全检查未通过。原文件保持隔离，不会进入解析、索引或下载链路。";
  if (document.state === "quarantined") return "原文件已进入隔离区，安全检查通过前不会开放下载，也不会交给解析器。";
  if (document.state === "scanning") return "正在检查文件类型、恶意特征、活动内容和压缩包膨胀风险。";
  if (document.error_code === "document_index_failed") return "知识服务未能完成索引，原文件仍可查看和下载。";
  if (document.state === "indexing") return document.index_status === "CHUNKED" ? "资料已完成分段，正在等待索引完成。" : "原文件已保存，正在建立索引。";
  if (document.state === "queued") return "原文件已保存，后台将继续处理。";
  if (document.state === "uploading") return "上传尚未完成，可重新选择同一文件继续。";
  if (document.state === "ready") return "知识索引已经完成，可以检索。";
  return "处理尚未完成，请稍后刷新状态。";
}

export function documentErrorDetail(code?: string) {
  if (!code) return "";
  const messages: Record<string, string> = {
    document_malware_detected: "病毒扫描发现恶意内容。原件保持隔离；不要重试同一文件，请先在可信环境中清理。",
    document_active_content_rejected: "文件含宏、脚本、外部对象或其他活动内容，已被隔离。请导出为不含活动内容的普通文档后重新上传。",
    document_executable_content_rejected: "文件实际内容是可执行程序，与知识文档用途不符，已被隔离。",
    document_archive_expansion_limit: "Office 文件解压后的体积或压缩比异常，可能是 ZIP 炸弹，已被隔离。",
    document_archive_unsafe: "Office 容器包含加密项、越界路径或不安全结构，已被隔离。",
    document_archive_invalid: "Office 文件容器损坏或条目数量异常，无法安全解析。",
    document_office_structure_invalid: "文件扩展名与 Office 内部结构不一致，无法安全解析。",
    document_type_mismatch: "文件扩展名与实际文件签名不一致。请确认格式或重新导出后上传。",
    document_text_binary_content: "文本文件中包含二进制内容，无法按声明格式安全处理。",
    document_text_encoding_invalid: "文本不是有效的 UTF-8 编码。请转换编码后重新上传。",
    document_security_scan_failed: "安全扫描服务执行失败，原件仍在隔离区；服务恢复后可以重试。",
    document_security_unavailable: "安全扫描器当前不可用，原件不会绕过检查进入索引；配置恢复后可以重试。",
		document_security_size_unsupported: "ClamAV 的 INSTREAM 上限小于该原件。原件保持隔离；请将服务端 StreamMaxLength、MaxFileSize 和 MaxScanSize 调整到业务上限后再重试。",
    document_index_size_unsupported: "原文件已安全保存，可预览和下载；当前 Connector 直传入口或 Builder 整文件处理上限无法接收它。",
    document_index_failed: "远端知识服务未能完成索引。原件仍可查看和下载，可以在服务恢复后重试。",
    document_inspect_failed: "暂时无法核对远端索引状态。系统不会把未知状态当作成功，可以稍后重试核查。",
    document_put_uncertain: "上传请求的结果不确定。系统将先核对原操作，不会盲目重复上传。",
    document_put_unconfirmed: "远端尚未确认接收这次上传。系统会继续核对原请求。",
    document_remote_conflict: "远端已有冲突的文档状态，当前原件不会覆盖未知内容。请核对知识源后再处理。",
    document_access_policy_changed: "知识源访问策略在处理期间发生变化。请按当前权限重新发起处理。",
    document_source_changed: "资料库绑定的知识源已经变化，旧任务不会把文件写入新来源。请重新索引。",
    document_source_access_denied: "当前账号已失去原业务资料的读取权限，文档不会继续进入索引。",
    document_upload_access_denied: "上传者已失去该资料库的写入权限，排队任务已停止。",
    document_content_mismatch: "保存的原件长度或摘要与文档记录不一致，系统已停止处理以避免索引错误版本。",
    document_management_unavailable: "当前知识源未开放文档管理能力。原件仍保留在资料库中。",
    document_work_unavailable: "文档后台任务暂时不可用，原件仍保留；服务恢复后可以重试。",
    document_cleanup_failed: "删除后的远端索引或原件清理尚未完成，访问仍保持关闭。",
    document_cleanup_unconfirmed: "清理结果尚未得到确认，系统会继续核对，不会恢复文档访问。",
    document_delete_uncertain: "远端删除结果不确定，文档继续保持不可访问并等待核对。",
    document_reindex_failed: "新一代索引建立失败，已有可用索引不会被覆盖。可以稍后重新索引。",
    document_reindex_put_uncertain: "重新索引的上传结果不确定；旧索引保持可用，系统会先核对原请求。",
    document_reindex_put_unconfirmed: "重新索引尚未被远端确认；旧索引保持可用。",
    document_reindex_cleanup_uncertain: "新索引切换后的旧代清理结果不确定，不影响当前检索，但需要继续核对。",
  };
  return messages[code] || `文档处理未完成（${code}）。原件和现有索引会按当前状态保持隔离或可用，不会把未知结果当作成功。`;
}

export const documentPipelineStages = [
  { key: "upload", label: "上传" },
  { key: "scan", label: "安全扫描" },
  { key: "parse", label: "解析" },
  { key: "chunk", label: "切块" },
  { key: "index", label: "索引" },
  { key: "complete", label: "完成" },
] as const;

export function documentPipelinePosition(document: KnowledgeDocument) {
  if (document.processing_stage === "failed") {
    if (document.security_status === "rejected") return 1;
    if (document.index_status === "CHUNKED") return 4;
    return 2;
  }
  const position = documentPipelineStages.findIndex(stage => stage.key === document.processing_stage);
  return position < 0 ? 0 : position;
}

export async function sha256(file: Blob, signal?: AbortSignal, onProgress?: (ratio: number) => void) {
  signal?.throwIfAborted();
  const hasher = await createSHA256();
  const reader = file.stream().getReader();
  let consumed = 0;
  hasher.init();
  try {
    while (true) {
      signal?.throwIfAborted();
      const chunk = await reader.read();
      if (chunk.done) break;
      hasher.update(chunk.value);
      consumed += chunk.value.byteLength;
      onProgress?.(Math.min(1, consumed / file.size));
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }
  signal?.throwIfAborted();
  onProgress?.(1);
  return hasher.digest("hex");
}
