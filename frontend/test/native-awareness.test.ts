import assert from "node:assert/strict";
import test from "node:test";
import { nativeAwarenessSessionShouldReconnect } from "../src/useKnowledgeNativeAwareness.ts";

test("native awareness reconnects only for disposable session lifecycle failures", () => {
  assert.equal(nativeAwarenessSessionShouldReconnect(new Error("knowledge.collaboration_session_revoked")), true);
  assert.equal(nativeAwarenessSessionShouldReconnect({ code: "knowledge.collaboration_session_not_found" }), true);
  assert.equal(nativeAwarenessSessionShouldReconnect({ code: "knowledge.collaboration_session_expired" }), true);

  assert.equal(nativeAwarenessSessionShouldReconnect(new Error("knowledge.page_not_found")), false);
  assert.equal(nativeAwarenessSessionShouldReconnect({ code: "knowledge.library_not_found" }), false);
  assert.equal(nativeAwarenessSessionShouldReconnect(new Error("network unavailable")), false);
});
