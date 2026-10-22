import type { BlockNoteEditor } from "@blocknote/core";
export type KnowledgeDocumentExportFormat = "json" | "markdown" | "pdf";
export declare function looksLikeOfficeHTML(html: string): boolean;
export declare function plainTextLooksLikeMarkdown(text: string): boolean;
export declare function sanitizeKnowledgePastedHTML(html: string): string;
export declare function handleKnowledgeDocumentPaste({ event, editor, defaultPasteHandler, onFeedback }: {
    event: ClipboardEvent;
    editor: BlockNoteEditor<any, any, any>;
    defaultPasteHandler(options?: {
        prioritizeMarkdownOverHTML?: boolean;
        plainTextAsMarkdown?: boolean;
    }): boolean | undefined;
    onFeedback?(message: string): void;
}): boolean | undefined;
export declare function safeDocumentFilename(title: string, extension: string): string;
export declare function buildKnowledgePrintDocument(title: string, content: string): string;
export declare function exportKnowledgeDocument(editor: BlockNoteEditor<any, any, any>, title: string, format: KnowledgeDocumentExportFormat): "Block JSON 已导出。" | "Markdown 已导出；不支持的富文档块已按可读文本降级。" | "已打开系统打印窗口，请选择“保存为 PDF”。";
