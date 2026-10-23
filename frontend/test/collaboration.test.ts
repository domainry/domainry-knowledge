import assert from "node:assert/strict";
import test from "node:test";
import * as Y from "yjs";
import { applyKnowledgeYjsState, applyKnowledgeYjsUpdate, collaborationContentSHA256, collaborationPositionChanged, collaborationPresenceUserIDs, decodeCollaborationBinary, encodeCollaborationBinary, encodeKnowledgeYjsState, mergeKnowledgeYjsUpdates } from "../src/collaboration.ts";
import { knowledgeOfflineCollaborationKey, loadKnowledgeOfflineChange } from "../src/collaborationOffline.ts";

test("collaboration binary codec preserves large Yjs updates", () => {
  const value = new Uint8Array(180_000);
  for (let index = 0; index < value.length; index++) value[index] = index % 251;
  assert.deepEqual(decodeCollaborationBinary(encodeCollaborationBinary(value)), value);
});

test("concurrent Yjs rich-document state converges independent of arrival order", () => {
  const seed = new Y.Doc();
  seed.getText("document").insert(0, "共享内容");
  const checkpoint = encodeKnowledgeYjsState(seed);

  const alice = new Y.Doc(), bob = new Y.Doc();
  applyKnowledgeYjsState(alice, checkpoint);
  applyKnowledgeYjsState(bob, checkpoint);
  alice.getText("document").insert(0, "Alice：");
  bob.getText("document").insert(bob.getText("document").length, "：Bob");

  const aliceState = encodeKnowledgeYjsState(alice), bobState = encodeKnowledgeYjsState(bob);
  applyKnowledgeYjsState(alice, bobState);
  applyKnowledgeYjsState(bob, aliceState);
  assert.equal(alice.getText("document").toString(), bob.getText("document").toString());
  assert.match(alice.getText("document").toString(), /Alice/);
  assert.match(alice.getText("document").toString(), /Bob/);
});

test("daily collaboration sends mergeable Yjs deltas instead of repeating the full checkpoint", () => {
  const source = new Y.Doc(), received: Uint8Array[] = [];
  source.on("update", update => received.push(update));
  source.getText("document").insert(0, "一段足够长的初始协作文档".repeat(100));
  const checkpoint = encodeKnowledgeYjsState(source);
  received.length = 0;
  source.getText("document").insert(2, "甲");
  source.getText("document").insert(8, "乙");
  const delta = mergeKnowledgeYjsUpdates(received);
  assert.ok(decodeCollaborationBinary(delta).byteLength < decodeCollaborationBinary(checkpoint).byteLength);

  const replica = new Y.Doc();
  applyKnowledgeYjsState(replica, checkpoint);
  applyKnowledgeYjsUpdate(replica, delta);
  assert.equal(replica.getText("document").toString(), source.getText("document").toString());
});

test("canonical Block JSON hash is deterministic", async () => {
  const content = `{"blocks":[{"id":"block-1","type":"paragraph","props":{},"content":[{"type":"text","text":"正文","styles":{}}],"children":[]}]}`;
  assert.equal(await collaborationContentSHA256(content), await collaborationContentSHA256(content));
  assert.notEqual(await collaborationContentSHA256(content), await collaborationContentSHA256(`${content} `));
});

test("offline collaboration queues are isolated by user, library, and page", async () => {
  assert.notEqual(knowledgeOfflineCollaborationKey("alice", "library", "page"), knowledgeOfflineCollaborationKey("bob", "library", "page"));
  assert.notEqual(knowledgeOfflineCollaborationKey("alice", "library-a", "page"), knowledgeOfflineCollaborationKey("alice", "library-b", "page"));
  assert.notEqual(knowledgeOfflineCollaborationKey("alice", "library", "page-a"), knowledgeOfflineCollaborationKey("alice", "library", "page-b"));
  assert.equal(await loadKnowledgeOfflineChange("alice", "library", "page"), null);
});

test("presence identity resolution changes only when the online user set changes", () => {
  const first = { session_id: "one", user_id: "alice", cursor_block_id: "block-a", edited_blocks: 0, last_seen_at: "2026-10-22T00:00:00Z" };
  const moved = { ...first, cursor_block_id: "block-b", last_seen_at: "2026-10-22T00:00:01Z" };
  const second = { ...first, session_id: "two", user_id: "bob" };
  assert.deepEqual(collaborationPresenceUserIDs([first, moved]), ["alice"]);
  assert.deepEqual(collaborationPresenceUserIDs([second, first]), ["alice", "bob"]);
});

test("unchanged collaboration positions do not schedule duplicate presence sync", () => {
  assert.equal(collaborationPositionChanged({ cursor: "block-a", selection: "" }, "block-a"), false);
  assert.equal(collaborationPositionChanged({ cursor: "block-a", selection: "" }, "block-b"), true);
  assert.equal(collaborationPositionChanged({ cursor: "block-a", selection: "block-b" }, "block-a", "block-c"), true);
});
