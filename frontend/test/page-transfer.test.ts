import assert from "node:assert/strict";
import test from "node:test";
import { canTransferPageToLibrary } from "../src/pageTransfer.ts";
import type { KnowledgeLibrary } from "../src/types.ts";

function library(overrides: Partial<KnowledgeLibrary> = {}): KnowledgeLibrary {
  return { id: "target", kind: "shared", name: "Target", description: "", role: "manager", owner_user_id: "manager", archived: false, revision: 1, ...overrides };
}

test("cross-Library page transfer only offers another active shared Library managed by the caller", () => {
  assert.equal(canTransferPageToLibrary(library(), "source"), true);
  assert.equal(canTransferPageToLibrary(library({ id: "source" }), "source"), false);
  assert.equal(canTransferPageToLibrary(library({ kind: "personal" }), "source"), false);
  assert.equal(canTransferPageToLibrary(library({ role: "editor" }), "source"), false);
  assert.equal(canTransferPageToLibrary(library({ archived: true }), "source"), false);
});
