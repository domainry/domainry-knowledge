import { BlockNoteSchema, filterSuggestionItems, getDefaultSlashMenuItems, insertOrUpdateBlockForSlashMenu } from "@blocknote/core";
import type { BlockNoteEditor } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import { AlertTriangle, BookOpen, Braces, FileSpreadsheet, FileText, FunctionSquare, GitBranch, LayoutGrid, Link2, ListChecks, ListTree, Network, Paintbrush, Presentation, Quote, Table2, Text, Type, WholeWord } from "lucide-react";
import type { ReactElement } from "react";

const calloutBlock = createReactBlockSpec(
  {
    type: "callout",
    propSchema: {
      tone: { default: "info", values: ["info", "success", "warning", "danger"] as const },
      icon: { default: "💡" },
    },
    content: "inline",
  },
  {
    render: ({ block, contentRef, editor }) => <aside className={`knowledge-block-callout is-${block.props.tone}`}>
      <input contentEditable={false} aria-label="提示块图标" value={block.props.icon} maxLength={2} readOnly={!editor.isEditable} onChange={event => editor.updateBlock(block, { props: { icon: event.target.value } })} />
      <div ref={contentRef} className="knowledge-block-callout-content" />
      {editor.isEditable && <select contentEditable={false} aria-label="提示块类型" value={block.props.tone} onChange={event => editor.updateBlock(block, { props: { tone: event.target.value as typeof block.props.tone } })}>
        <option value="info">信息</option><option value="success">成功</option><option value="warning">提醒</option><option value="danger">警告</option>
      </select>}
    </aside>,
  },
);

const formulaBlock = createReactBlockSpec(
  { type: "formula", propSchema: {}, content: "plain" },
  {
    render: ({ contentRef }) => <div className="knowledge-block-formula"><span contentEditable={false}>ƒ</span><code ref={contentRef} data-placeholder="输入 LaTeX 公式" /></div>,
  },
);

const buttonBlock = createReactBlockSpec(
  {
    type: "button",
    propSchema: {
      label: { default: "按钮" }, href: { default: "" },
      appearance: { default: "primary", values: ["primary", "secondary"] as const },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => <div className="knowledge-block-button" contentEditable={false}>
      {editor.isEditable ? <>
        <input aria-label="按钮文字" value={block.props.label} maxLength={80} onChange={event => editor.updateBlock(block, { props: { label: event.target.value } })} />
        <input aria-label="按钮链接" value={block.props.href} maxLength={2048} placeholder="https:// 或 knowledge-page:" onChange={event => editor.updateBlock(block, { props: { href: event.target.value } })} />
      </> : <a className={`is-${block.props.appearance}`} href={block.props.href || undefined} target="_blank" rel="noreferrer">{block.props.label}</a>}
    </div>,
  },
);

const knowledgeReferenceBlock = createReactBlockSpec(
  {
    type: "knowledgeReference",
    propSchema: {
      targetPageId: { default: "" }, title: { default: "未选择知识条目" },
      contentType: { default: "document", values: ["document", "multidimensional_table", "spreadsheet", "presentation", "form", "mind_note", "whiteboard", "mind_map", "flowchart"] as const },
      display: { default: "card", values: ["card", "embed"] as const },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => <article className="knowledge-block-reference" contentEditable={false}>
      <span className="knowledge-block-reference-icon"><BookOpen size={18} /></span>
      <div><strong>{block.props.title}</strong><small>{block.props.contentType} · {block.props.targetPageId || "填写目标页面 ID"}</small></div>
      {editor.isEditable && <div className="knowledge-block-reference-fields">
        <input aria-label="引用标题" value={block.props.title} maxLength={256} onChange={event => editor.updateBlock(block, { props: { title: event.target.value } })} />
        <input aria-label="目标页面 ID" value={block.props.targetPageId} maxLength={128} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.target.value } })} />
        <select aria-label="引用显示方式" value={block.props.display} onChange={event => editor.updateBlock(block, { props: { display: event.target.value as typeof block.props.display } })}><option value="card">卡片</option><option value="embed">内嵌</option></select>
      </div>}
    </article>,
  },
);

const syncedBlock = createReactBlockSpec(
  {
    type: "syncedBlock",
    propSchema: { targetPageId: { default: "" }, targetBlockId: { default: "" }, title: { default: "同步内容块" } },
    content: "none",
  },
  {
    render: ({ block, editor }) => <article className="knowledge-block-synced" contentEditable={false}>
      <Link2 size={17} /><div><strong>{block.props.title}</strong><small>{block.props.targetPageId && block.props.targetBlockId ? `${block.props.targetPageId} / ${block.props.targetBlockId}` : "填写来源页面和 Block ID 后建立同步引用"}</small></div>
      {editor.isEditable && <div><input aria-label="同步来源页面" value={block.props.targetPageId} placeholder="kpage_…" onChange={event => editor.updateBlock(block, { props: { targetPageId: event.target.value } })} /><input aria-label="同步来源 Block" value={block.props.targetBlockId} placeholder="Block ID" onChange={event => editor.updateBlock(block, { props: { targetBlockId: event.target.value } })} /></div>}
    </article>,
  },
);

export const knowledgeDocumentSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    callout: calloutBlock(), formula: formulaBlock(), button: buttonBlock(),
    knowledgeReference: knowledgeReferenceBlock(), syncedBlock: syncedBlock(),
  },
});

const defaultIcons: Record<string, ReactElement> = {
  paragraph: <Text size={18} />, heading: <Type size={18} />, heading_2: <Type size={18} />,
  heading_3: <Type size={18} />, bullet_list: <ListTree size={18} />, numbered_list: <ListTree size={18} />,
  check_list: <ListChecks size={18} />, quote: <Quote size={18} />, code_block: <Braces size={18} />,
  table: <Table2 size={18} />, divider: <WholeWord size={18} />,
};

const referenceKinds = [
  ["multidimensional_table", "多维表格", "字段化记录与多视图数据", LayoutGrid],
  ["spreadsheet", "电子表格", "行列单元格与计算数据", FileSpreadsheet],
  ["presentation", "幻灯片", "分镜式演示内容", Presentation],
  ["form", "问卷", "问题、选项与收集规则", ListChecks],
  ["mind_note", "思维笔记", "可缩进的大纲笔记", ListTree],
  ["whiteboard", "画板", "自由卡片与连接关系", Paintbrush],
  ["mind_map", "思维导图", "中心主题与分支节点", Network],
  ["flowchart", "流程图", "步骤节点与流程关系", GitBranch],
] as const;

function customSlashMenuItems(editor: BlockNoteEditor<any, any, any>): DefaultReactSuggestionItem[] {
  const insert = (block: Record<string, unknown>) => () => insertOrUpdateBlockForSlashMenu(editor, block as never);
  return [
    { title: "高亮提示块", subtext: "突出显示信息、结论或风险", aliases: ["提示", "高亮", "callout"], group: "内容", icon: <AlertTriangle size={18} />, onItemClick: insert({ type: "callout" }) },
    { title: "公式", subtext: "输入 LaTeX 公式源码", aliases: ["数学", "latex", "formula"], group: "内容", icon: <FunctionSquare size={18} />, onItemClick: insert({ type: "formula", content: "" }) },
    { title: "按钮", subtext: "创建可跳转的操作按钮", aliases: ["链接", "button"], group: "交互", icon: <Link2 size={18} />, onItemClick: insert({ type: "button" }) },
    { title: "子文档 / 知识条目", subtext: "引用另一条知识内容", aliases: ["页面", "子文档", "引用"], group: "知识库", icon: <FileText size={18} />, onItemClick: insert({ type: "knowledgeReference" }) },
    { title: "同步块", subtext: "引用并同步另一页面中的内容块", aliases: ["同步", "sync"], group: "知识库", icon: <Link2 size={18} />, onItemClick: insert({ type: "syncedBlock" }) },
    ...referenceKinds.map(([contentType, title, subtext, Icon]) => ({
      title, subtext, aliases: [contentType], group: "原生应用", icon: <Icon size={18} />,
      onItemClick: insert({ type: "knowledgeReference", props: { contentType, title: `未选择${title}`, display: "embed" } }),
    })),
  ];
}

export async function getKnowledgeSlashMenuItems(editor: BlockNoteEditor<any, any, any>, query: string) {
  const defaults = getDefaultSlashMenuItems(editor)
    .filter(item => !["image", "video", "audio", "file"].includes(String(item.key)))
    .map(({ key, ...item }): DefaultReactSuggestionItem => ({ ...item, icon: defaultIcons[String(key)], group: item.group || "基础" }));
  return filterSuggestionItems([...defaults, ...customSlashMenuItems(editor)], query);
}
