import { createElement, lazy } from "react";
import type { ComponentType } from "react";
import { FileSpreadsheet, FileText, GitBranch, LayoutGrid, ListChecks, ListTree, Network, Paintbrush, Presentation } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KnowledgePageContentType } from "./types.ts";
import type { KnowledgeEditorProps } from "./editors/types.ts";
import { emptyFormContent } from "./formContent.ts";
import { emptyWhiteboardContent } from "./editors/whiteboardContent.ts";
import { emptyMindNoteContent } from "./mindNoteContent.ts";
import { emptyPresentationContent } from "./presentationContent.ts";
import { emptyFlowchartContent, emptyMindMapContent } from "./diagramContent.ts";

export const pageTypeCapability = {
  create: 1 << 0,
  edit: 1 << 1,
  read: 1 << 2,
  preview: 1 << 3,
  import: 1 << 4,
  realtime: 1 << 5,
  search: 1 << 6,
  comment: 1 << 7,
  version: 1 << 8,
} as const;

export type PageTypeImporter = { kind: "document-upload"; accept: "library-policy" };

export type PageTypeDefinition = {
  id: KnowledgePageContentType;
  label: string;
  description: string;
  defaultTitle: string;
  icon: LucideIcon;
  capabilities: number;
  createAction: { kind: "native" } | null;
  createContent: (() => string) | null;
  editor: ComponentType<KnowledgeEditorProps>;
  readonlyRenderer: ComponentType<KnowledgeEditorProps>;
  previewRenderer: ComponentType<KnowledgeEditorProps>;
  importer: PageTypeImporter | null;
  trusted: true;
};

const DocumentEditor = lazy(() => import("./editors/BlockNoteEditor.tsx").then(module => ({ default: module.DocumentEditor })));
const MindNoteEditor = lazy(() => import("./editors/MindNoteEditor.tsx"));
const GridEditor = lazy(() => import("./editors/GridEditor.tsx").then(module => ({ default: module.GridEditor })));
const SpreadsheetEditor = lazy(() => import("./editors/SpreadsheetEditor.tsx").then(module => ({ default: module.SpreadsheetEditor })));
const PresentationEditor = lazy(() => import("./editors/PresentationEditor.tsx"));
const WhiteboardEditor = lazy(() => import("./editors/CanvasEditor.tsx").then(module => ({ default: module.WhiteboardEditor })));
const FormEditor = lazy(() => import("./editors/FormEditor.tsx").then(module => ({ default: module.FormEditor })));
const MindMapEditor = lazy(() => import("./editors/MindMapEditor.tsx").then(module => ({ default: module.MindMapEditor })));
const FlowchartEditor = lazy(() => import("./editors/FlowchartEditor.tsx").then(module => ({ default: module.FlowchartEditor })));

function FileReferenceRenderer({ body }: KnowledgeEditorProps) {
  let title = "文件引用";
  try { title = JSON.parse(body).title || title; } catch { /* The server reports invalid canonical content. */ }
  return createElement("div", { className: "knowledge-file-reference-editor" },
    createElement("strong", null, title),
    createElement("p", null, "文件内容由受权原件提供，不在页面正文中复制。"),
  );
}

export function emptySpreadsheet() {
  // Keep the initial snapshot data-only. Importing Univer here would pull the
  // spreadsheet runtime into the workspace shell before a sheet is opened.
  return {
    schema_version: 1,
    workbook: {
      id: "workbook-1",
      name: "工作表",
      appVersion: "1.1.0",
      locale: "zhCN",
      dateSystem: "date1900",
      styles: {},
      sheetOrder: ["sheet-1"],
      sheets: {
        "sheet-1": {
          id: "sheet-1",
          name: "工作表 1",
          tabColor: "",
          hidden: 0,
          rowCount: 1000,
          columnCount: 20,
          zoomRatio: 1,
          freeze: { xSplit: 0, ySplit: 0, startRow: -1, startColumn: -1 },
          scrollTop: 0,
          scrollLeft: 0,
          defaultColumnWidth: 88,
          defaultRowHeight: 24,
          mergeData: [],
          cellData: {},
          rowData: {},
          columnData: {},
          showGridlines: 1,
          rowHeader: { width: 46, hidden: 0 },
          columnHeader: { height: 20, hidden: 0 },
          rightToLeft: 0,
        },
      },
      resources: [],
    },
    charts: [],
    pivots: [],
    protected_ranges: [],
  };
}

const commonCapabilities = pageTypeCapability.create | pageTypeCapability.edit | pageTypeCapability.read | pageTypeCapability.preview | pageTypeCapability.search | pageTypeCapability.comment | pageTypeCapability.version;

function nativeDefinition(input: Omit<PageTypeDefinition, "capabilities" | "createAction" | "readonlyRenderer" | "previewRenderer" | "importer" | "trusted"> & { capabilities?: number }): PageTypeDefinition {
  return Object.freeze({ ...input, capabilities: input.capabilities ?? commonCapabilities, createAction: { kind: "native" } as const, readonlyRenderer: input.editor, previewRenderer: input.editor, importer: null, trusted: true });
}

const definitions: PageTypeDefinition[] = [
  nativeDefinition({ id: "document", label: "文档", description: "富文本、内容块与内嵌应用", defaultTitle: "未命名文档", icon: FileText, capabilities: commonCapabilities | pageTypeCapability.realtime, createContent: () => JSON.stringify({ blocks: [] }), editor: DocumentEditor }),
  nativeDefinition({ id: "multidimensional_table", label: "多维表格", description: "22 类字段与六种业务视图", defaultTitle: "未命名多维表格", icon: LayoutGrid, createContent: () => JSON.stringify({ schema_version: 1, fields: [{ id: "title", name: "标题", type: "text", required: true }], records: [], views: [{ id: "view-grid", name: "表格", type: "grid", row_height: "normal" }] }), editor: GridEditor }),
  nativeDefinition({ id: "spreadsheet", label: "表格", description: "公式、透视与十类数据图表", defaultTitle: "未命名表格", icon: FileSpreadsheet, createContent: () => JSON.stringify(emptySpreadsheet()), editor: SpreadsheetEditor }),
  nativeDefinition({ id: "presentation", label: "幻灯片", description: "版式、图表、表格、公式与媒体", defaultTitle: "未命名幻灯片", icon: Presentation, createContent: () => JSON.stringify(emptyPresentationContent), editor: PresentationEditor }),
  nativeDefinition({ id: "form", label: "问卷", description: "15 类题型、条件逻辑与答卷统计", defaultTitle: "未命名问卷", icon: ListChecks, createContent: () => JSON.stringify(emptyFormContent()), editor: FormEditor }),
  nativeDefinition({ id: "mind_note", label: "思维笔记", description: "大纲、优先级、标签与截止日期", defaultTitle: "未命名思维笔记", icon: ListTree, createContent: () => JSON.stringify(emptyMindNoteContent), editor: MindNoteEditor }),
  nativeDefinition({ id: "whiteboard", label: "画板", description: "自由卡片与连接关系", defaultTitle: "未命名画板", icon: Paintbrush, createContent: () => JSON.stringify(emptyWhiteboardContent), editor: WhiteboardEditor }),
  nativeDefinition({ id: "mind_map", label: "思维导图", description: "主题、布局、标签、备注与链接", defaultTitle: "未命名思维导图", icon: Network, createContent: () => JSON.stringify(emptyMindMapContent), editor: MindMapEditor }),
  nativeDefinition({ id: "flowchart", label: "流程图", description: "15 类语义节点与三类连接", defaultTitle: "未命名流程图", icon: GitBranch, createContent: () => JSON.stringify(emptyFlowchartContent), editor: FlowchartEditor }),
  Object.freeze({ id: "file", label: "文件", description: "受权原文件与安全预览", defaultTitle: "未命名文件", icon: FileText, capabilities: pageTypeCapability.edit | pageTypeCapability.read | pageTypeCapability.preview | pageTypeCapability.import | pageTypeCapability.search | pageTypeCapability.comment | pageTypeCapability.version, createAction: null, createContent: null, editor: FileReferenceRenderer, readonlyRenderer: FileReferenceRenderer, previewRenderer: FileReferenceRenderer, importer: { kind: "document-upload", accept: "library-policy" } as const, trusted: true }),
];

export function validatePageTypeDefinitions(items: readonly PageTypeDefinition[] = definitions) {
  const ids = new Set<string>();
  for (const definition of items) {
    if (!definition.id || ids.has(definition.id) || !definition.label || !definition.defaultTitle || !definition.icon || !definition.editor || !definition.readonlyRenderer || !definition.previewRenderer || !definition.capabilities || definition.trusted !== true) {
      throw new Error(`Invalid page type definition: ${definition.id || "<empty>"}`);
    }
    if (!!(definition.capabilities & pageTypeCapability.create) !== (definition.createAction?.kind === "native" && !!definition.createContent) || !!(definition.capabilities & pageTypeCapability.import) !== !!definition.importer) {
      throw new Error(`Inconsistent page type capabilities: ${definition.id}`);
    }
    ids.add(definition.id);
  }
  return true;
}

validatePageTypeDefinitions();

export const pageTypeDefinitions = Object.freeze([...definitions]);
export const pageTypeRegistry = Object.freeze(Object.fromEntries(pageTypeDefinitions.map(definition => [definition.id, definition])) as Record<KnowledgePageContentType, PageTypeDefinition>);
export const nativePageTypes = Object.freeze(pageTypeDefinitions.filter(definition => definition.createAction?.kind === "native").map(definition => definition.id));
export const importPageTypes = Object.freeze(pageTypeDefinitions.filter(definition => definition.capabilities & pageTypeCapability.import));
export const pageTypeMeta = Object.freeze(Object.fromEntries(pageTypeDefinitions.map(definition => [definition.id, { label: definition.label, description: definition.description, title: definition.defaultTitle }])) as Record<KnowledgePageContentType, { label: string; description: string; title: string }>);

export function getPageTypeDefinition(type: KnowledgePageContentType) {
  const definition = pageTypeRegistry[type];
  if (!definition) throw new Error(`Unregistered page type: ${type}`);
  return definition;
}

export function PageTypeIcon({ type, size = 16 }: { type: KnowledgePageContentType; size?: number }) {
  return createElement(getPageTypeDefinition(type).icon, { size, "aria-hidden": true });
}

export function initialPageContent(type: KnowledgePageContentType) {
  const createContent = getPageTypeDefinition(type).createContent;
  if (!createContent) throw new Error(`Page type ${type} requires its registered importer`);
  return createContent();
}
