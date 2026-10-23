export type PageOutlineItem = { key: string; level: number; title: string };

export function PageOutline({ items }: { items: PageOutlineItem[] }) {
  return <aside className="knowledge-page-outline" aria-label="页面大纲">
    <h3>页面大纲</h3>
    {items.length === 0 ? <p className="knowledge-subtle">当前发布版本没有标题块。</p> : <ol>{items.map(item => <li key={item.key} style={{ paddingInlineStart: `${(item.level - 1) * 12}px` }}>{item.title}</li>)}</ol>}
  </aside>;
}
