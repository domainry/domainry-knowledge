import assert from "node:assert/strict";
import test from "node:test";
import { documentIndexMaxBytesForFilename, knowledgeDocumentAccept, knowledgeDocumentAcceptForContentType, knowledgeDocumentSupports, selectedUploadFile } from "../src/document.ts";
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

test("upload format projection accepts configured file, image, audio and video formats only", () => {
  const uploadLibrary: KnowledgeLibrary = {
    ...library,
    document_formats: [
      { extension: ".txt", content_type: "text/plain", parser_route: "storage" },
      { extension: ".png", content_type: "image/png", parser_route: "storage" },
      { extension: ".mp3", content_type: "audio/mpeg", parser_route: "storage" },
      { extension: ".mp4", content_type: "video/mp4", parser_route: "storage" },
    ],
  };
  assert.equal(knowledgeDocumentAccept(uploadLibrary), ".txt,.png,.mp3,.mp4");
  assert.equal(knowledgeDocumentAcceptForContentType(uploadLibrary, "image/"), ".png");
  assert.equal(knowledgeDocumentAcceptForContentType(uploadLibrary, "audio/"), ".mp3");
  assert.equal(knowledgeDocumentAcceptForContentType(uploadLibrary, "video/"), ".mp4");
  for (const filename of ["notes.TXT", "photo.png", "voice.mp3", "clip.mp4"]) assert.equal(knowledgeDocumentSupports(uploadLibrary, filename), true, filename);
  for (const filename of ["unsafe.exe", "photo.png.exe", "extensionless"]) assert.equal(knowledgeDocumentSupports(uploadLibrary, filename), false, filename);
});

test("closing the native picker without a file is a no-op and a selected file is returned exactly once", () => {
  const selected = { name: "photo.png" } as File;
  assert.equal(selectedUploadFile(null), null);
  assert.equal(selectedUploadFile({ item: () => null }), null);
  assert.equal(selectedUploadFile({ item: index => index === 0 ? selected : null }), selected);
});
