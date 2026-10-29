import { formatKnowledgeDate, kt } from "../i18n/runtime.ts";
import { Activity } from "lucide-react";
import { Button } from "../components.tsx";

export type PageActivityItem = { key: string; at: string; title: string; detail: string };

export function PageActivityPanel({ items, versionsComplete, commentsComplete, onLoadMoreVersions, onLoadMoreComments }: {
  items: PageActivityItem[];
  versionsComplete: boolean;
  commentsComplete: boolean;
  onLoadMoreVersions(): void;
  onLoadMoreComments(): void;
}) {
  return <section className="knowledge-page-activity knowledge-page-mode-surface">
    <header className="knowledge-page-mode-heading"><div><Activity size={18} /><span><h3>{kt("knowledge.auto.7804dd64c008d833")}</h3><p>{kt("knowledge.auto.dd59eb5aed1fb7ab")}</p></span></div></header>
    <div className="knowledge-activity-list">{items.map(item => <article key={item.key} className="knowledge-activity-item"><Activity size={15} /><span><strong>{item.title}</strong><small>{formatKnowledgeDate(item.at)} · {item.detail}</small></span></article>)}</div>
    {items.length === 0 && <p className="knowledge-subtle knowledge-history-empty">{kt("knowledge.auto.d44a20359a57bf9a")}</p>}
    {(!versionsComplete || !commentsComplete) && <footer className="knowledge-actions">{!versionsComplete && <Button onClick={onLoadMoreVersions}>{kt("knowledge.auto.c8b2d0eb76107205")}</Button>}{!commentsComplete && <Button onClick={onLoadMoreComments}>{kt("knowledge.auto.018bc6017e37cc91")}</Button>}</footer>}
  </section>;
}
