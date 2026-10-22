import type { Block } from "@blocknote/core";

export type KnowledgeDocumentEnvelope = { blocks: Block[] };

export function parseDocumentBlocks(content: string): Block[] {
  try {
    const value = JSON.parse(content) as { blocks?: unknown };
    return Array.isArray(value.blocks) ? value.blocks as Block[] : [];
  } catch {
    return [];
  }
}

export function serializeDocumentBlocks(blocks: readonly Block[]) {
  return JSON.stringify({ blocks });
}

function textFromContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(textFromContent).join("");
  if (!content || typeof content !== "object") return "";
  const value = content as Record<string, unknown>;
  return typeof value.text === "string" ? value.text : textFromContent(value.content);
}

const commentQuotePropertyKeys = new Set(["caption", "description", "displayName", "email", "icon", "label", "name", "question", "siteName", "title"]);

export function documentBlockCommentQuote(block: { type: string; props?: Record<string, unknown>; content?: unknown }) {
  const words: string[] = [];
  const props = block.props || {};
  for (const key of [...commentQuotePropertyKeys].sort()) {
    const value = props?.[key];
    if (typeof value === "string" && value.trim()) words.push(value);
  }
  const content = textFromContent(block.content).trim();
  if (content) words.push(content);
  const normalized = words.join(" ").replace(/\s+/g, " ").trim() || block.type;
  return Array.from(normalized).slice(0, 1024).join("");
}

export function documentText(content: string) {
  const lines: string[] = [];
  const visit = (blocks: Block[]) => {
    for (const block of blocks) {
      const text = textFromContent(block.content).trim();
      if (text) lines.push(text);
      if (block.children?.length) visit(block.children);
    }
  };
  visit(parseDocumentBlocks(content));
  return lines.join("\n");
}

export function documentStats(content: string) {
  const blocks = parseDocumentBlocks(content);
  let blockCount = 0;
  const visit = (items: Block[]) => {
    for (const block of items) {
      blockCount++;
      if (block.children?.length) visit(block.children);
    }
  };
  visit(blocks);
  return { blocks: blockCount, characters: Array.from(documentText(content)).length };
}

export function documentOutline(content: string) {
  const items: { key: string; level: number; title: string }[] = [];
  const visit = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.type === "heading") {
        const title = textFromContent(block.content).trim();
        if (title) items.push({ key: block.id, level: Number((block.props as { level?: number }).level) || 1, title });
      }
      if (block.children?.length) visit(block.children);
    }
  };
  visit(parseDocumentBlocks(content));
  return items;
}

export function appendDocumentImage(content: string, documentID: string, title: string) {
  const blocks = parseDocumentBlocks(content);
  blocks.push({
    id: crypto.randomUUID(),
    type: "image",
    props: { name: title, caption: title, url: `knowledge-document:${documentID}`, showPreview: true },
    children: [],
  } as unknown as Block);
  return serializeDocumentBlocks(blocks);
}
