import assert from "node:assert/strict";
import test from "node:test";
import { parseHTTPErrorResponse } from "../src/http-error.ts";

test("HTTP error response requires canonical fields and ignores additive fields", () => {
  assert.deepEqual(parseHTTPErrorResponse({
    code: "knowledge.document_changed",
    message: "Document changed",
    params: { revision: "7" },
    request_id: "request-7",
  }), {
    code: "knowledge.document_changed",
    message: "Document changed",
    params: { revision: "7" },
    request_id: "request-7",
  });
  assert.equal(parseHTTPErrorResponse({ code: "legacy", detail: "old" }), null);
  assert.deepEqual(parseHTTPErrorResponse({
    code: "knowledge.document_changed",
    message: "Document changed",
    request_id: "request-8",
    future_field: { enabled: true },
  }), {
    code: "knowledge.document_changed",
    message: "Document changed",
    request_id: "request-8",
  });
  assert.equal(parseHTTPErrorResponse({ code: "invalid.params", message: "bad", params: { revision: 7 }, request_id: "request" }), null);
});
