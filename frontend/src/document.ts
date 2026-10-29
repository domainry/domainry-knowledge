import { kt, ktf } from "./i18n/runtime.ts";
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

export function knowledgeDocumentAcceptForContentType(library: KnowledgeLibrary, prefix: "image/" | "video/" | "audio/") {
  return (library.document_formats || [])
    .filter(format => /^\.[a-z0-9]{1,8}$/.test(format.extension) && format.content_type.toLowerCase().startsWith(prefix))
    .map(format => format.extension)
    .join(",");
}

export function knowledgeDocumentSupports(library: KnowledgeLibrary, filename: string) {
  const lower = filename.toLowerCase();
  return configuredDocumentExtensions(library).some(extension => lower.endsWith(extension));
}

export function selectedUploadFile(files: Pick<FileList, "item"> | null) {
  return files?.item(0) || null;
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
  return document.state === "ready" && document.security_status === "clean" && document.index_status === "INDEXED" && !document.reindexing && !document.error_code;
}

export function documentLabel(document: Pick<KnowledgeDocument, "state" | "index_status" | "error_code" | "reindexing">) {
  if (document.reindexing) return kt("knowledge.auto.1a09da7a3bca1eb3");
  if (document.state === "indexing" && document.error_code === "document_index_failed") return kt("knowledge.auto.d052f725817f1917");
  return ({
    uploading: kt("knowledge.auto.19e1f44297bda5a3"),
    quarantined: kt("knowledge.auto.10a23f5c70b1a46a"),
    scanning: kt("knowledge.auto.f69c4d14be92bc4f"),
    queued: kt("knowledge.auto.f8b62f7e70714111"),
    indexing: kt("knowledge.auto.c5067bc7a5ed1b5c"),
    ready: kt("knowledge.auto.0f47508d00408fbb"),
    failed: kt("knowledge.auto.d59aa9897c22c2fc"),
    needs_reconcile: kt("knowledge.auto.0cfdf164f25c91db"),
    deleting: kt("knowledge.auto.2cd1ce2574dc4c5f"),
    deleted: kt("knowledge.auto.077a6d37719a0e21"),
  } as const)[document.state] || kt("knowledge.auto.93e474c68ed55647");
}

export function documentStatusDetail(document: KnowledgeDocument) {
  if (document.reindexing) return kt("knowledge.auto.41c94420978a2650");
  const failure = documentErrorDetail(document.error_code);
  if (failure) return failure;
  if (document.state === "deleting") return kt("knowledge.auto.bfa4d19d833c92e0");
  if (document.state === "needs_reconcile") return kt("knowledge.auto.e060f707761de3b7");
  if (document.security_status === "rejected") return kt("knowledge.auto.9329561c7be5e7a2");
  if (document.state === "quarantined") return kt("knowledge.auto.22c1d958143c2407");
  if (document.state === "scanning") return kt("knowledge.auto.3f8da087e9eb372d");
  if (document.error_code === "document_index_failed") return kt("knowledge.auto.b51db9167563fb5d");
  if (document.state === "indexing") return document.index_status === "CHUNKED" ? kt("knowledge.auto.9aacb43060ad3bec") : kt("knowledge.auto.c14ea4992ebb8474");
  if (document.state === "queued") return kt("knowledge.auto.5fe4e9c0f11ef7e4");
  if (document.state === "uploading") return kt("knowledge.auto.20550a88888c751f");
  if (document.state === "ready") return document.index_status === "STORED" ? kt("knowledge.auto.522984fa5539c3fc") : kt("knowledge.auto.1e4122f49e70af69");
  return kt("knowledge.auto.b523f14f9b7fbe2a");
}

export function documentErrorDetail(code?: string) {
  if (!code) return "";
  const messages: Record<string, string> = {
    document_malware_detected: kt("knowledge.auto.9e2fbd79016868d7"),
    document_active_content_rejected: kt("knowledge.auto.fdf8d3d7df5be244"),
    document_executable_content_rejected: kt("knowledge.auto.408885e67e324bf5"),
    document_archive_expansion_limit: kt("knowledge.auto.f9b22752857925ec"),
    document_archive_unsafe: kt("knowledge.auto.319f716078cef6ad"),
    document_archive_invalid: kt("knowledge.auto.ee980dd18f85d5cf"),
    document_office_structure_invalid: kt("knowledge.auto.cb728d70deb9b3d0"),
    document_type_mismatch: kt("knowledge.auto.bc28ab2f444a7c75"),
    document_text_binary_content: kt("knowledge.auto.ccf350580b18d85d"),
    document_text_encoding_invalid: kt("knowledge.auto.79984ad5b1c1d985"),
    document_security_scan_failed: kt("knowledge.auto.982ece3c58c15495"),
    document_security_unavailable: kt("knowledge.auto.d9450ab1e449d77f"),
		document_security_size_unsupported: kt("knowledge.auto.846f1bcead30ed42"),
    document_index_size_unsupported: kt("knowledge.auto.44c8702bd6da238f"),
    document_index_failed: kt("knowledge.auto.8736138d6d3b7201"),
    document_inspect_failed: kt("knowledge.auto.12c80f174445a385"),
    document_put_uncertain: kt("knowledge.auto.07c2ee03b2e264e0"),
    document_put_unconfirmed: kt("knowledge.auto.10ff70d5027efac4"),
    document_remote_conflict: kt("knowledge.auto.1d0b3079db6ef531"),
    document_access_policy_changed: kt("knowledge.auto.87ee703b54410617"),
    document_source_changed: kt("knowledge.auto.98c28c6131335e93"),
    document_source_access_denied: kt("knowledge.auto.8267a5e5e8a052d9"),
    document_upload_access_denied: kt("knowledge.auto.77f16503c4b77c7c"),
    document_content_mismatch: kt("knowledge.auto.a4b5d95369256c65"),
    document_management_unavailable: kt("knowledge.auto.361f33cf6479d9c8"),
    document_work_unavailable: kt("knowledge.auto.3577889150907bcd"),
    document_cleanup_failed: kt("knowledge.auto.40bfa3785a99092c"),
    document_cleanup_unconfirmed: kt("knowledge.auto.fb3ec84bdad3481d"),
    document_delete_uncertain: kt("knowledge.auto.468d5e241c3a9209"),
    document_reindex_failed: kt("knowledge.auto.41ed316b1f3ec3aa"),
    document_reindex_put_uncertain: kt("knowledge.auto.2e067a75045e014a"),
    document_reindex_put_unconfirmed: kt("knowledge.auto.c81daebbe47361ea"),
    document_reindex_cleanup_uncertain: kt("knowledge.auto.c335ae3f515d2b33"),
  };
  return messages[code] || ktf("knowledge.auto.e446dac671dfa29a", { value0: code });
}

export const documentPipelineStages = [
  { key: "upload", get label() { return kt("knowledge.auto.9e07e3c0532d4976"); } },
  { key: "scan", get label() { return kt("knowledge.auto.c8ecd750ab66348a"); } },
  { key: "parse", get label() { return kt("knowledge.auto.fbff7b5046d951dc"); } },
  { key: "chunk", get label() { return kt("knowledge.auto.5b1a217258c57176"); } },
  { key: "index", get label() { return kt("knowledge.auto.9ac22d24d8c324be"); } },
  { key: "complete", get label() { return kt("knowledge.auto.c0b3fbff51ccc40b"); } },
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
