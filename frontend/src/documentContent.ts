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
