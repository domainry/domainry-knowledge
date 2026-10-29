import { kt } from "../i18n/runtime.ts";
export type PageOutlineItem = { key: string; level: number; title: string };

export function PageOutline({ items }: { items: PageOutlineItem[] }) {
  return <aside className="knowledge-page-outline" aria-label={kt("knowledge.auto.be1ad90195c74408")}>
    <h3>{kt("knowledge.auto.be1ad90195c74408")}</h3>
    {items.length === 0 ? <p className="knowledge-subtle">{kt("knowledge.auto.1f4d4a5414a11d3b")}</p> : <ol>{items.map(item => <li key={item.key} style={{ paddingInlineStart: `${(item.level - 1) * 12}px` }}>{item.title}</li>)}</ol>}
  </aside>;
}
