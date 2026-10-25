import assert from "node:assert/strict";
import test from "node:test";
import { knowledgeMutationIdempotencyKey } from "../src/request-idempotency.ts";

test("knowledge mutations carry a logical-operation idempotency key", async () => {
  assert.equal(knowledgeMutationIdempotencyKey("POST", { client_id: " library-operation-1 " }), "library-operation-1");
  assert.equal(knowledgeMutationIdempotencyKey("PATCH", { name: "Updated" }, () => "generated-operation-1"), "generated-operation-1");
  assert.equal(knowledgeMutationIdempotencyKey("DELETE", undefined, () => "generated-operation-2"), "generated-operation-2");
  assert.equal(knowledgeMutationIdempotencyKey("GET", undefined, () => "must-not-be-used"), "");
});
