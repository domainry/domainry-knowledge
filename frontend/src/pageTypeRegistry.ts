import { kt } from "./i18n/runtime.ts";
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
  let title = kt("knowledge.auto.b1a5d50b3c3b808e");
  try { title = JSON.parse(body).title || title; } catch { /* The server reports invalid canonical content. */ }
  return createElement("div", { className: "knowledge-file-reference-editor" },
    createElement("strong", null, title),
    createElement("p", null, kt("knowledge.auto.fc7696cffb84c20a")),
  );
}

export function emptySpreadsheet() {
  // Keep the initial snapshot data-only. Importing Univer here would pull the
  // spreadsheet runtime into the workspace shell before a sheet is opened.
  return {
    schema_version: 1,
    workbook: {
      id: "workbook-1",
      name: kt("knowledge.auto.b02781ee06c6587e"),
      appVersion: "1.1.0",
      locale: "zhCN",
      dateSystem: "date1900",
      styles: {},
      sheetOrder: ["sheet-1"],
      sheets: {
        "sheet-1": {
          id: "sheet-1",
          name: kt("knowledge.auto.345cc0e777c05058"),
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
  nativeDefinition({ id: "document", get label() { return kt("knowledge.auto.2687ccdbb1d2288a"); }, get description() { return kt("knowledge.auto.c03fb2ca1157a643"); }, get defaultTitle() { return kt("knowledge.auto.17f12081cd8b16d3"); }, icon: FileText, capabilities: commonCapabilities | pageTypeCapability.realtime, createContent: () => JSON.stringify({ blocks: [] }), editor: DocumentEditor }),
  nativeDefinition({ id: "multidimensional_table", get label() { return kt("knowledge.auto.68e97018cb979fe5"); }, get description() { return kt("knowledge.auto.436fbc35cb69c938"); }, get defaultTitle() { return kt("knowledge.auto.7d2753830dec720a"); }, icon: LayoutGrid, createContent: () => JSON.stringify({ schema_version: 1, fields: [{ id: "title", name: kt("knowledge.auto.c3405f8c7d9d392a"), type: "text", required: true }], records: [], views: [{ id: "view-grid", name: kt("knowledge.auto.22d9e7c54b88cacd"), type: "grid", row_height: "normal" }] }), editor: GridEditor }),
  nativeDefinition({ id: "spreadsheet", get label() { return kt("knowledge.auto.22d9e7c54b88cacd"); }, get description() { return kt("knowledge.auto.d99ac2e4a075846c"); }, get defaultTitle() { return kt("knowledge.auto.16fd76d5c62436bb"); }, icon: FileSpreadsheet, createContent: () => JSON.stringify(emptySpreadsheet()), editor: SpreadsheetEditor }),
  nativeDefinition({ id: "presentation", get label() { return kt("knowledge.auto.81574e23e48aec6b"); }, get description() { return kt("knowledge.auto.4d0f7e60952425cd"); }, get defaultTitle() { return kt("knowledge.auto.dc0e764313122d2d"); }, icon: Presentation, createContent: () => JSON.stringify(emptyPresentationContent), editor: PresentationEditor }),
  nativeDefinition({ id: "form", get label() { return kt("knowledge.auto.dbe6b9b19150bef1"); }, get description() { return kt("knowledge.auto.c75674bd2c7402f1"); }, get defaultTitle() { return kt("knowledge.auto.930ee05178096936"); }, icon: ListChecks, createContent: () => JSON.stringify(emptyFormContent()), editor: FormEditor }),
  nativeDefinition({ id: "mind_note", get label() { return kt("knowledge.auto.13517c3204f58770"); }, get description() { return kt("knowledge.auto.e430ce00870cbc31"); }, get defaultTitle() { return kt("knowledge.auto.24f374b540a88ba4"); }, icon: ListTree, createContent: () => JSON.stringify(emptyMindNoteContent), editor: MindNoteEditor }),
  nativeDefinition({ id: "whiteboard", get label() { return kt("knowledge.auto.53f23afed6017d31"); }, get description() { return kt("knowledge.auto.7dc1300db34c8029"); }, get defaultTitle() { return kt("knowledge.auto.d149811ad808bd97"); }, icon: Paintbrush, createContent: () => JSON.stringify(emptyWhiteboardContent), editor: WhiteboardEditor }),
  nativeDefinition({ id: "mind_map", get label() { return kt("knowledge.auto.c59fdacd6a72a12c"); }, get description() { return kt("knowledge.auto.6b4202861fec4132"); }, get defaultTitle() { return kt("knowledge.auto.a7065f06bb23b3b3"); }, icon: Network, createContent: () => JSON.stringify(emptyMindMapContent), editor: MindMapEditor }),
  nativeDefinition({ id: "flowchart", get label() { return kt("knowledge.auto.f6fdf82e9a8999b7"); }, get description() { return kt("knowledge.auto.ad0da843d646cde4"); }, get defaultTitle() { return kt("knowledge.auto.237ad262228a6f15"); }, icon: GitBranch, createContent: () => JSON.stringify(emptyFlowchartContent), editor: FlowchartEditor }),
  Object.freeze({ id: "file", get label() { return kt("knowledge.auto.39932f24fe11a6ba"); }, get description() { return kt("knowledge.auto.4dde70fddac87674"); }, get defaultTitle() { return kt("knowledge.auto.82ab58c8f14041c4"); }, icon: FileText, capabilities: pageTypeCapability.edit | pageTypeCapability.read | pageTypeCapability.preview | pageTypeCapability.import | pageTypeCapability.search | pageTypeCapability.comment | pageTypeCapability.version, createAction: null, createContent: null, editor: FileReferenceRenderer, readonlyRenderer: FileReferenceRenderer, previewRenderer: FileReferenceRenderer, importer: { kind: "document-upload", accept: "library-policy" } as const, trusted: true }),
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
