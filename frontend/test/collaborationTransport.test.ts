import assert from "node:assert/strict";
import test from "node:test";
import type { KnowledgeCollaborationTransport } from "../src/collaborationTransport.ts";
import type { KnowledgeCollaborationSession, KnowledgeCollaborationSync, KnowledgePageView } from "../src/types.ts";

function transportFixture(kind: KnowledgeCollaborationTransport["kind"]): KnowledgeCollaborationTransport {
  let content = "initial";
  let clock = 0;
  const session = (clientID: string): KnowledgeCollaborationSession => ({
    id: "session", library_id: "library", page_id: "page", client_id: clientID, user_id: "alice", state: "connected",
    server_clock: clock, expires_at: new Date(0).toISOString(), presence: [],
    snapshot: { page_id: "page", draft_revision: clock + 1, server_clock: clock, title: "title", content, content_sha256: "a".repeat(64), yjs_state_clock: clock, yjs_update_bytes_since_checkpoint: 0 },
  });
  return {
    kind,
    async connect(clientID) { return session(clientID); },
    async sync(request: KnowledgeCollaborationSync) {
      if (request.update) {
        content = request.update.content;
        clock++;
      }
      return { session: session(request.update?.client_id || "client"), events: [], applied: Boolean(request.update), complete: true };
    },
    async stream() {},
    async close() {},
    async publish() {
      return { published: { body: { content } } } as unknown as KnowledgePageView;
    },
  };
}

async function exerciseTransport(transport: KnowledgeCollaborationTransport) {
  const signal = new AbortController().signal;
  const connected = await transport.connect("client", signal);
  const synced = await transport.sync({
    session_id: connected.id,
    after_clock: connected.server_clock,
    update: { client_id: connected.client_id, update_id: "update", yjs_update: "AQ==", content: "canonical", content_sha256: "b".repeat(64) },
  }, signal);
  const published = await transport.publish({ session_id: connected.id, client_id: connected.client_id }, signal);
  return { canonical: synced.session.snapshot.content, published: published.published?.body.content };
}

test("POST+SSE and a future WebSocket adapter share canonical and publish contracts", async () => {
  assert.deepEqual(await exerciseTransport(transportFixture("post-sse")), { canonical: "canonical", published: "canonical" });
  assert.deepEqual(await exerciseTransport(transportFixture("websocket")), { canonical: "canonical", published: "canonical" });
});
