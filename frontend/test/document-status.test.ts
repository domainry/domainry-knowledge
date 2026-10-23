import assert from "node:assert/strict";
import test from "node:test";
import { documentCanReindex, documentErrorDetail, documentStatusDetail } from "../src/document.ts";
import type { KnowledgeDocument } from "../src/types.ts";

test("document failures distinguish unsafe files from retryable infrastructure failures", () => {
  assert.match(documentErrorDetail("document_malware_detected"), /恶意内容/);
  assert.match(documentErrorDetail("document_security_scan_failed"), /服务恢复后可以重试/);
  assert.match(documentErrorDetail("document_put_uncertain"), /不会盲目重复上传/);
  assert.match(documentErrorDetail("future_failure"), /future_failure/);
});

test("storage-only originals stay downloadable without pretending to be indexed", () => {
  const stored = {
    state: "ready", security_status: "clean", index_status: "STORED", reindexing: false,
  } as KnowledgeDocument;
  assert.equal(documentCanReindex(stored), false);
  assert.match(documentStatusDetail(stored), /预览和下载/);
  assert.match(documentStatusDetail(stored), /未配置远端索引/);
  assert.equal(documentCanReindex({ ...stored, index_status: "INDEXED" }), true);
});
