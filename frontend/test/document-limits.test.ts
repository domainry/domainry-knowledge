import assert from "node:assert/strict";
import test from "node:test";
import { documentIndexMaxBytesForFilename } from "../src/document.ts";
import type { KnowledgeLibrary } from "../src/types.ts";

const MiB = 1024 * 1024;
const library: KnowledgeLibrary = {
  id: "library-1",
  kind: "personal",
  name: "资料库",
  description: "",
  role: "manager",
  owner_user_id: "user-1",
  archived: false,
  revision: 1,
  document_index_max_bytes: 30 * MiB,
  document_formats: [
    { extension: ".txt", content_type: "text/plain", parser_route: "text" },
    { extension: ".mp4", content_type: "video/mp4", parser_route: "media", builder_max_bytes: 20 * MiB, asset_max_bytes: 20 * MiB },
    { extension: ".png", content_type: "image/png", parser_route: "media", asset_max_bytes: 20 * MiB, enrichment_max_bytes: 8 * MiB },
    { extension: ".xlsx", content_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", parser_route: "structured", analysis_output_max_bytes: 16 * MiB },
  ],
};

test("whole-file indexing uses transport and Builder ceilings but not derived budgets", () => {
  assert.equal(documentIndexMaxBytesForFilename(library, "notes.txt"), 30 * MiB);
  assert.equal(documentIndexMaxBytesForFilename(library, "meeting.mp4"), 20 * MiB);
  assert.equal(documentIndexMaxBytesForFilename(library, "diagram.png"), 30 * MiB);
  assert.equal(documentIndexMaxBytesForFilename(library, "table.xlsx"), 30 * MiB);
  assert.equal(documentIndexMaxBytesForFilename(library, "legacy.doc"), 0);
});
