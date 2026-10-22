import DOMPurify from "dompurify";
import type { BlockNoteEditor } from "@blocknote/core";

export type KnowledgeDocumentExportFormat = "json" | "markdown" | "pdf";

const officeMarkup = /(?:\bmso-|\bMso[A-Z]|urn:schemas-microsoft-com:office|<\/?o:|xmlns:o=|Word\.Document)/i;
const markdownBlock = /(?:^|\n)\s{0,3}(?:#{1,6}\s+|```|~~~|>\s+|[-+*]\s+|\d+[.)]\s+)/;
const markdownInline = /(?:\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/;
const markdownTable = /(?:^|\n)\s*\|.+\|\s*\n\s*\|?\s*:?-{3,}/;

const allowedPasteTags = [
  "p", "div", "br", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
  "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "ul", "ol", "li",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "a", "hr", "span",
];

const allowedPasteAttributes = ["href", "title", "colspan", "rowspan", "start"];

export function looksLikeOfficeHTML(html: string) {
  return officeMarkup.test(html);
}

export function plainTextLooksLikeMarkdown(text: string) {
  return markdownBlock.test(text) || markdownInline.test(text) || markdownTable.test(text);
}

function normalizeOfficeMarkup(html: string) {
  return html
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(?:o|w|v|st1):[^>]*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

function safeLink(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:" || url.origin === window.location.origin;
  } catch {
    return false;
  }
}

export function sanitizeKnowledgePastedHTML(html: string) {
  const sanitized = DOMPurify.sanitize(normalizeOfficeMarkup(html), {
    ALLOWED_TAGS: allowedPasteTags,
    ALLOWED_ATTR: allowedPasteAttributes,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  }) as string;
  const document = new DOMParser().parseFromString(sanitized, "text/html");
  document.querySelectorAll("a[href]").forEach(anchor => {
    const href = anchor.getAttribute("href") || "";
    if (!safeLink(href)) anchor.removeAttribute("href");
    else anchor.setAttribute("rel", "noopener noreferrer");
  });
  document.querySelectorAll("p").forEach(paragraph => {
    if (paragraph.textContent?.replace(/[\u00a0\s]/g, "") === "") paragraph.innerHTML = "<br>";
  });
  return document.body.innerHTML;
}

export function handleKnowledgeDocumentPaste({ event, editor, defaultPasteHandler, onFeedback }: {
  event: ClipboardEvent;
  editor: BlockNoteEditor<any, any, any>;
  defaultPasteHandler(options?: { prioritizeMarkdownOverHTML?: boolean; plainTextAsMarkdown?: boolean }): boolean | undefined;
  onFeedback?(message: string): void;
}) {
  const clipboard = event.clipboardData;
  if (!clipboard) return defaultPasteHandler();
  const types = [...clipboard.types];
  if (types.includes("blocknote/html") || types.includes("Files") || types.includes("text/markdown") || types.includes("vscode-editor-data")) return defaultPasteHandler();
  const plain = clipboard.getData("text/plain");
  if (plain && plainTextLooksLikeMarkdown(plain)) {
    editor.pasteMarkdown(plain);
    return true;
  }
  const html = clipboard.getData("text/html");
  if (html) {
    const office = looksLikeOfficeHTML(html);
    const cleaned = sanitizeKnowledgePastedHTML(html);
    if (cleaned) editor.pasteHTML(cleaned);
    else if (plain) editor.pasteText(plain);
    if (office) onFeedback?.("已清理 Office 冗余样式和不可执行内容后粘贴。");
    return true;
  }
  if (plain) {
    editor.pasteText(plain);
    return true;
  }
  return defaultPasteHandler({ prioritizeMarkdownOverHTML: true, plainTextAsMarkdown: false });
}

export function safeDocumentFilename(title: string, extension: string) {
  const base = title.trim().replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-").replace(/\s+/g, " ").replace(/[. ]+$/g, "").slice(0, 120) || "知识页面";
  return `${base}.${extension}`;
}

function escapeHTML(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]!);
}

export function buildKnowledgePrintDocument(title: string, content: string) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${escapeHTML(title)}</title><style>
@page{size:A4;margin:16mm 15mm}*{box-sizing:border-box}body{margin:0;color:#17231f;font:14px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}article{max-width:178mm;margin:0 auto}h1.document-title{font-size:28px;line-height:1.25;margin:0 0 24px;padding-bottom:14px;border-bottom:1px solid #dce7e2}h1,h2,h3,h4,h5,h6{break-after:avoid;color:#10211b}p,blockquote,pre,table,figure{break-inside:avoid}blockquote{margin:12px 0;padding:4px 14px;border-left:3px solid #0c8a68;color:#455b53}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f6f5;border:1px solid #dce7e2;border-radius:6px;padding:12px}code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cfdcd6;padding:6px 8px;vertical-align:top}img,video{max-width:100%;height:auto}a{color:#087d61;text-decoration:none}hr{border:0;border-top:1px solid #dce7e2;margin:20px 0}@media print{a{color:inherit}.no-print{display:none!important}}
</style></head><body><article><h1 class="document-title">${escapeHTML(title || "知识页面")}</h1>${content}</article></body></html>`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function exportKnowledgeDocument(editor: BlockNoteEditor<any, any, any>, title: string, format: KnowledgeDocumentExportFormat) {
  if (format === "json") {
    downloadBlob(safeDocumentFilename(title, "blocks.json"), new Blob([JSON.stringify({ blocks: editor.document }, null, 2)], { type: "application/json;charset=utf-8" }));
    return "Block JSON 已导出。";
  }
  if (format === "markdown") {
    const markdown = editor.blocksToMarkdownLossy(editor.document);
    downloadBlob(safeDocumentFilename(title, "md"), new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    return "Markdown 已导出；不支持的富文档块已按可读文本降级。";
  }
  const popup = window.open("", "_blank", "popup,width=980,height=760");
  if (!popup) throw new Error("浏览器拦截了 PDF 导出窗口，请允许本站打开弹窗。");
  popup.opener = null;
  const html = sanitizeKnowledgePastedHTML(editor.blocksToHTMLLossy(editor.document));
  popup.document.open();
  popup.document.write(buildKnowledgePrintDocument(title, html));
  popup.document.close();
  let printed = false;
  const print = () => {
    if (printed || popup.closed) return;
    printed = true;
    popup.focus();
    popup.print();
  };
  popup.addEventListener("load", print, { once: true });
  window.setTimeout(print, 300);
  return "已打开系统打印窗口，请选择“保存为 PDF”。";
}
