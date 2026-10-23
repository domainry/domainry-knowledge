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
    <header className="knowledge-page-mode-heading"><div><Activity size={18} /><span><h3>页面活动</h3><p>发布、评论与任务按时间合并展示。</p></span></div></header>
    <div className="knowledge-activity-list">{items.map(item => <article key={item.key} className="knowledge-activity-item"><Activity size={15} /><span><strong>{item.title}</strong><small>{new Date(item.at).toLocaleString()} · {item.detail}</small></span></article>)}</div>
    {items.length === 0 && <p className="knowledge-subtle knowledge-history-empty">暂无页面活动。</p>}
    {(!versionsComplete || !commentsComplete) && <footer className="knowledge-actions">{!versionsComplete && <Button onClick={onLoadMoreVersions}>加载更早发布</Button>}{!commentsComplete && <Button onClick={onLoadMoreComments}>加载更多评论</Button>}</footer>}
  </section>;
}
