import assert from "node:assert/strict";
import test from "node:test";
import * as Y from "yjs";
import { applyKnowledgeYjsState, collaborationContentSHA256, decodeCollaborationBinary, encodeCollaborationBinary, encodeKnowledgeYjsState } from "../src/collaboration.ts";

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

test("canonical Block JSON hash is deterministic", async () => {
  const content = `{"blocks":[{"id":"block-1","type":"paragraph","props":{},"content":[{"type":"text","text":"正文","styles":{}}],"children":[]}]}`;
  assert.equal(await collaborationContentSHA256(content), await collaborationContentSHA256(content));
  assert.notEqual(await collaborationContentSHA256(content), await collaborationContentSHA256(`${content} `));
});
