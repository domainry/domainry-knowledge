import { strFromU8, unzipSync } from "fflate";
import type { DisplaySlide } from "./office-types.ts";

function decodeXMLText(value: string) {
  return value.replace(/&(?:lt|gt|amp|quot|apos);|&#(?:x[0-9a-f]+|[0-9]+);/gi, entity => {
    const named: Record<string, string> = { "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": "\"", "&apos;": "'" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const hexadecimal = entity.toLowerCase().startsWith("&#x"), raw = entity.slice(hexadecimal ? 3 : 2, -1);
    const code = Number.parseInt(raw, hexadecimal ? 16 : 10);
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : "�";
  });
}

export function readPresentation(data: ArrayBuffer): DisplaySlide[] {
  const entries = unzipSync(new Uint8Array(data));
  const slides = Object.entries(entries).flatMap(([name, content]) => {
    const match = /^ppt\/slides\/slide([1-9][0-9]*)\.xml$/.exec(name);
    return match ? [{ number: Number(match[1]), content }] : [];
  }).sort((left, right) => left.number - right.number);
  if (slides.length === 0 || slides.length > 500) throw Error("幻灯片数量不在在线预览范围内，请下载原文件查看。");
  let totalCharacters = 0;
  return slides.map(slide => {
    const xml = strFromU8(slide.content);
    const lines = [...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)]
      .map(match => decodeXMLText(match[1]).trim()).filter(Boolean);
    const characters = lines.reduce((sum, line) => sum + line.length, 0);
    totalCharacters += characters;
    if (lines.length > 10_000 || characters > 1_000_000 || totalCharacters > 8_000_000) throw Error("幻灯片文本超过在线预览范围，请下载原文件查看。");
    return { number: slide.number, title: lines[0] || `幻灯片 ${slide.number}`, lines: lines.slice(1) };
  });
}
