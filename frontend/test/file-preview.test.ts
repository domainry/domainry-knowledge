import assert from "node:assert/strict";
import test from "node:test";
import {
  canPreviewFilename,
  fileSHA256Header,
  previewFormatDefinitions,
  previewKind,
  readPreviewFile,
  readPreviewText,
  supportedPreviewFormats,
  type FilePreviewKind,
} from "../src/file-preview.ts";
import type { FilePreviewSource } from "../src/types.ts";

const formatsByKind = {
  text: ["txt", "md", "rst", "html", "htm", "csv", "json", "jsonl", "py", "js", "ts", "tsx", "jsx", "java", "go", "rs", "c", "h", "cpp", "hpp", "cs", "rb", "php", "kt", "swift", "scala", "sh"],
  pdf: ["pdf"],
  word: ["docx"],
  presentation: ["pptx"],
  spreadsheet: ["xlsx", "xlsm"],
  image: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
  audio: ["mp3", "wav", "ogg", "flac", "m4a", "aac"],
  video: ["mp4", "mov", "webm", "avi"],
} as const satisfies Record<FilePreviewKind, readonly string[]>;

const sha256 = "a".repeat(64);

function sourceFor(extension: string, body: Uint8Array): FilePreviewSource {
  const filename = `preview-fixture.${extension}`;
  return {
    identity: `fixture:${extension}`,
    file: { filename, bytes: body.byteLength, sha256 },
    streamURL: `/fixtures/${filename}`,
    async read() {
      return new Response(body, { headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.byteLength),
        [fileSHA256Header]: sha256,
      } });
    },
  };
}

test("all 48 server-supported file extensions map to one explicit inline preview renderer", () => {
  const expected = Object.values(formatsByKind).flat();
  assert.equal(expected.length, 48);
  assert.deepEqual([...supportedPreviewFormats].sort(), [...expected].sort());
  for (const [kind, formats] of Object.entries(formatsByKind) as [FilePreviewKind, readonly string[]][]) {
    for (const extension of formats) {
      assert.equal(canPreviewFilename(`SAMPLE.${extension.toUpperCase()}`), true, extension);
      assert.equal(previewKind(`sample.${extension}`), kind, extension);
      assert.ok(previewFormatDefinitions[extension as keyof typeof previewFormatDefinitions].contentType, extension);
    }
  }
  assert.equal(canPreviewFilename("malware.exe"), false);
  assert.equal(previewKind("no-extension"), null);
});

test("every supported text and source-code extension reads a real UTF-8 file response", async () => {
  for (const extension of formatsByKind.text) {
    const body = new TextEncoder().encode(`FORMAT_${extension.toUpperCase()}\n直接阅读内容`);
    const result = await readPreviewText(sourceFor(extension, body), AbortSignal.timeout(1_000));
    assert.equal(result.filename, `preview-fixture.${extension}`);
    assert.equal(result.format, extension);
    assert.match(result.text, new RegExp(`FORMAT_${extension.toUpperCase()}`));
    assert.equal(result.truncated, false);
  }
});

test("every supported binary extension preserves its browser MIME contract", async () => {
  for (const extension of Object.values(formatsByKind).flat().filter(extension => !formatsByKind.text.includes(extension as never))) {
    // The original-file reader is intentionally format-agnostic; specialized
    // viewers validate/decode Office, PDF, image, and media bytes afterward.
    const result = await readPreviewFile(sourceFor(extension, new Uint8Array([1, 2, 3, 4])), AbortSignal.timeout(1_000));
    assert.equal(result.filename, `preview-fixture.${extension}`);
    assert.equal(result.format, extension);
    assert.equal(result.blob.type, previewFormatDefinitions[extension as keyof typeof previewFormatDefinitions].contentType.toLowerCase(), extension);
  }
});
