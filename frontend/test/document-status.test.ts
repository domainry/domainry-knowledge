import assert from "node:assert/strict";
import test from "node:test";
import { documentErrorDetail } from "../src/document.ts";

test("document failures distinguish unsafe files from retryable infrastructure failures", () => {
  assert.match(documentErrorDetail("document_malware_detected"), /恶意内容/);
  assert.match(documentErrorDetail("document_security_scan_failed"), /服务恢复后可以重试/);
  assert.match(documentErrorDetail("document_put_uncertain"), /不会盲目重复上传/);
  assert.match(documentErrorDetail("future_failure"), /future_failure/);
});
