import type { KnowledgePageContentType } from "./types.ts";

export const pageTypeMeta: Record<KnowledgePageContentType, { label: string; description: string; title: string }> = {
  document: { label: "文档", description: "富文本、内容块与内嵌应用", title: "未命名文档" },
  multidimensional_table: { label: "多维表格", description: "字段化记录与多视图数据", title: "未命名多维表格" },
  spreadsheet: { label: "表格", description: "行列单元格数据", title: "未命名表格" },
  presentation: { label: "幻灯片", description: "分镜式演示内容", title: "未命名幻灯片" },
  form: { label: "问卷", description: "问题、选项与必填规则", title: "未命名问卷" },
  mind_note: { label: "思维笔记", description: "可缩进的大纲笔记", title: "未命名思维笔记" },
  whiteboard: { label: "画板", description: "自由卡片与连接关系", title: "未命名画板" },
  mind_map: { label: "思维导图", description: "中心主题与分支节点", title: "未命名思维导图" },
  flowchart: { label: "流程图", description: "步骤节点与流程关系", title: "未命名流程图" },
};

export const nativePageTypes = Object.keys(pageTypeMeta) as KnowledgePageContentType[];

export function emptySpreadsheet() {
  // Keep the initial snapshot data-only. Importing Univer here would pull the
  // spreadsheet runtime into the workspace shell before a sheet is opened.
  return {
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
  };
}

export function initialPageContent(type: KnowledgePageContentType) {
  return ({
    document: JSON.stringify({ blocks: [] }),
    multidimensional_table: JSON.stringify({ fields: [{ id: "title", name: "标题", type: "text" }], records: [] }),
    spreadsheet: JSON.stringify(emptySpreadsheet()),
    presentation: JSON.stringify({ slides: [{ id: "slide-1", title: "未命名幻灯片", elements: [], files: {} }] }),
    form: JSON.stringify({ display: "form", components: [{ type: "textfield", key: "question1", label: "未命名问题", input: true }] }),
    mind_note: JSON.stringify({ nodes: [{ id: "note-1", type: "bulletListItem", props: {}, content: [{ type: "text", text: "未命名主题", styles: {} }], children: [] }] }),
    whiteboard: JSON.stringify({ nodes: [], files: {} }),
    mind_map: JSON.stringify({ root: { nodeData: { id: "root", topic: "中心主题", children: [] }, direction: 2 } }),
    flowchart: JSON.stringify({ nodes: [{ id: "start", type: "ellipse", x: 240, y: 160, text: "开始" }], edges: [] }),
  })[type];
}
