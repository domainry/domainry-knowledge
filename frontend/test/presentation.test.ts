import assert from "node:assert/strict";
import test from "node:test";
import { strToU8, zipSync } from "fflate";
import { readPresentation } from "../src/viewers/presentation.ts";

function buffer(value: Uint8Array) {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

test("PPTX text preview preserves slide order and decodes XML text", () => {
  const archive = zipSync({
    "[Content_Types].xml": strToU8("<Types/>"),
    "ppt/presentation.xml": strToU8("<p:presentation/>") ,
    "ppt/slides/slide2.xml": strToU8("<p:sld><a:t>第二页</a:t><a:t>A &amp; B</a:t></p:sld>"),
    "ppt/slides/slide1.xml": strToU8("<p:sld><a:t>标题 &#x4E00;</a:t><a:t>正文</a:t></p:sld>"),
  });
  assert.deepEqual(readPresentation(buffer(archive)), [
    { number: 1, title: "标题 一", lines: ["正文"] },
    { number: 2, title: "第二页", lines: ["A & B"] },
  ]);
});

test("PPTX text preview rejects archives without slides", () => {
  const archive = zipSync({ "ppt/presentation.xml": strToU8("<p:presentation/>") });
  assert.throws(() => readPresentation(buffer(archive)), /幻灯片数量/);
});
