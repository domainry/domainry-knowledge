import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgePageEditHistoryEntry, KnowledgePageVersion, KnowledgePageVersionDiff, KnowledgePrincipal } from "../types.ts";

export type PageHistoryPanelProps = {
  section: "versions" | "edits";
  versions: KnowledgePageVersion[];
  versionsComplete: boolean;
  editHistory: KnowledgePageEditHistoryEntry[];
  editHistoryComplete: boolean;
  compare: number[];
  rollbackVersion: number | null;
  rollbackBusy: boolean;
  diff: KnowledgePageVersionDiff | null;
  preview: KnowledgePageVersion | null;
  previewContent?: ReactNode;
  canWrite: boolean;
  memberProfiles: Record<string, KnowledgePrincipal>;
  onSectionChange(section: "versions" | "edits"): void;
  onCompareChange(versions: number[]): void;
  onCompare(): void;
  onPreview(version: number): void;
  onRollbackPrompt(version: number | null): void;
  onRollback(version: number): void;
  onLoadMoreVersions(): void;
  onLoadMoreEdits(): void;
};

export function PageHistoryPanel(props: PageHistoryPanelProps) {
  return <section className="knowledge-page-history">
    <div className="knowledge-history-switcher" role="tablist" aria-label="历史类型">
      <button type="button" role="tab" aria-selected={props.section === "versions"} onClick={() => props.onSectionChange("versions")}>发布版本</button>
      <button type="button" role="tab" aria-selected={props.section === "edits"} onClick={() => props.onSectionChange("edits")}>编辑记录</button>
    </div>
    {props.section === "versions" ? <>
      <div className="knowledge-history-heading"><div><h3>版本历史</h3><p>发布版本是不可变快照；回滚会把所选快照写成新的当前草稿，不会删除任何历史版本。</p></div><Button disabled={props.compare.length !== 2} onClick={props.onCompare}>对比所选版本</Button></div>
      <div className="knowledge-version-list">{props.versions.map(version => <article key={version.version} className="knowledge-version">
        <label className="knowledge-version-select"><input type="checkbox" checked={props.compare.includes(version.version)} onChange={event => props.onCompareChange(event.target.checked ? [version.version, ...props.compare].slice(0, 2) : props.compare.filter(item => item !== version.version))} /><span><strong>版本 {version.version}</strong><small>{props.memberProfiles[version.published_by_user_id]?.display_name || "账号不可用"} · {new Date(version.published_at).toLocaleString()}</small></span></label>
        <div className="knowledge-version-actions"><Button onClick={() => props.onPreview(version.version)}>预览</Button>{props.canWrite && <Button title={`回滚到版本 ${version.version}`} onClick={() => props.onRollbackPrompt(version.version)}><RotateCcw size={14} />回滚</Button>}</div>
        <p className="knowledge-version-summary">{version.body.summary || "此版本没有内容摘要。"}</p>
        {props.rollbackVersion === version.version && <div className="knowledge-version-rollback-confirm" role="alert"><div><strong>回滚到版本 {version.version}？</strong><p>当前草稿将替换为该版本的快照，并生成新的草稿 revision；原发布版本保持不变。</p></div><div className="knowledge-actions"><Button disabled={props.rollbackBusy} onClick={() => props.onRollbackPrompt(null)}>取消</Button><Button className="primary" disabled={props.rollbackBusy} onClick={() => props.onRollback(version.version)}>{props.rollbackBusy ? "回滚中…" : "确认回滚"}</Button></div></div>}
      </article>)}</div>
      {props.versions.length === 0 && <p className="knowledge-subtle knowledge-history-empty">还没有发布版本，发布后才能从快照回滚。</p>}
      {!props.versionsComplete && <Button className="knowledge-history-load-more" onClick={props.onLoadMoreVersions}>加载更早版本</Button>}
      {props.preview && <div className="knowledge-version-preview"><h4>版本 {props.preview.version}：{props.preview.title}</h4><p className="knowledge-subtle">页面位置 {props.preview.parent_page_id || "根目录"} · 排序 {props.preview.rank}</p>{props.previewContent}</div>}
      {props.diff && <div className="knowledge-diff"><h4>版本 {props.diff.from_version} → {props.diff.to_version}</h4><pre>{props.diff.content.map((op, index) => <span key={index} className={`is-${op.kind}`}>{op.kind === "insert" ? "+ " : op.kind === "delete" ? "- " : "  "}{op.text}</span>)}</pre></div>}
    </> : <>
      <div className="knowledge-history-heading"><div><h3>连续编辑记录</h3><p>记录草稿 revision、作者和 Block 级变化；它是审计日志，不是完整快照，不能逐条回滚。</p></div></div>
      {props.editHistory.map(entry => <article className="knowledge-edit-history" key={entry.draft_revision}><header><strong>{props.memberProfiles[entry.user_id]?.display_name || "账号不可用"}</strong><span>{new Date(entry.created_at).toLocaleString()} · 草稿 revision {entry.draft_revision}{entry.clock > 0 ? ` · 协作时钟 ${entry.clock}` : ""}</span></header><div className="knowledge-edit-history-summary">{entry.title_changed && <em>标题已修改</em>}<span>{entry.changed_block_count} 个 Block 变化{entry.truncated ? "（明细过多，已截断）" : ""}</span></div>{entry.changes.length > 0 && <ul>{entry.changes.map(change => <li key={`${entry.draft_revision}-${change.node_id}`} className={`is-${change.kind}`}><b>{change.kind === "insert" ? "新增" : change.kind === "delete" ? "删除" : "修改"}</b><code>{change.node_id.slice(0, 12)}</code><span>{change.kind === "update" ? `${change.before_preview || "空内容"} → ${change.after_preview || "空内容"}` : change.after_preview || change.before_preview || "空内容"}</span></li>)}</ul>}</article>)}
      {props.editHistory.length === 0 && <p className="knowledge-subtle knowledge-history-empty">还没有编辑记录。</p>}
      {!props.editHistoryComplete && <Button className="knowledge-history-load-more" onClick={props.onLoadMoreEdits}>加载更早编辑</Button>}
    </>}
  </section>;
}
