import { formatKnowledgeDate, kt, ktf } from "../i18n/runtime.ts";
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
    <div className="knowledge-history-switcher" role="tablist" aria-label={kt("knowledge.auto.75bf20516bad3712")}>
      <button type="button" role="tab" aria-selected={props.section === "versions"} onClick={() => props.onSectionChange("versions")}>{kt("knowledge.auto.cbfe181351c872eb")}</button>
      <button type="button" role="tab" aria-selected={props.section === "edits"} onClick={() => props.onSectionChange("edits")}>{kt("knowledge.auto.d75a57907abec76a")}</button>
    </div>
    {props.section === "versions" ? <>
      <div className="knowledge-history-heading"><div><h3>{kt("knowledge.auto.bb58d709f19dedbf")}</h3><p>{kt("knowledge.auto.d33264b6e19cea39")}</p></div><Button disabled={props.compare.length !== 2} onClick={props.onCompare}>{kt("knowledge.auto.8d6eb42290ab3d8b")}</Button></div>
      <div className="knowledge-version-list">{props.versions.map(version => <article key={version.version} className="knowledge-version">
        <label className="knowledge-version-select"><input type="checkbox" checked={props.compare.includes(version.version)} onChange={event => props.onCompareChange(event.target.checked ? [version.version, ...props.compare].slice(0, 2) : props.compare.filter(item => item !== version.version))} /><span><strong>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{version.version}</strong><small>{props.memberProfiles[version.published_by_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")} · {formatKnowledgeDate(version.published_at)}</small></span></label>
        <div className="knowledge-version-actions"><Button onClick={() => props.onPreview(version.version)}>{kt("knowledge.auto.13d61fea9f174905")}</Button>{props.canWrite && <Button title={ktf("knowledge.auto.0e9088476f125bc2", { value0: version.version })} onClick={() => props.onRollbackPrompt(version.version)}><RotateCcw size={14} />{kt("knowledge.auto.6518e21a8e5ff207")}</Button>}</div>
        <p className="knowledge-version-summary">{version.body.summary || kt("knowledge.auto.6e1689e0727fc95c")}</p>
        {props.rollbackVersion === version.version && <div className="knowledge-version-rollback-confirm" role="alert"><div><strong>{kt("knowledge.auto.c47e6e8dc807fb6c")}{version.version}？</strong><p>{kt("knowledge.auto.7ea1b3cd635805ae")}</p></div><div className="knowledge-actions"><Button disabled={props.rollbackBusy} onClick={() => props.onRollbackPrompt(null)}>{kt("knowledge.auto.2cd0f3be8738a86c")}</Button><Button className="primary" disabled={props.rollbackBusy} onClick={() => props.onRollback(version.version)}>{props.rollbackBusy ? kt("knowledge.auto.43172ac13531c194") : kt("knowledge.auto.eb32e19bdb15a10b")}</Button></div></div>}
      </article>)}</div>
      {props.versions.length === 0 && <p className="knowledge-subtle knowledge-history-empty">{kt("knowledge.auto.11f665ba19ad4e66")}</p>}
      {!props.versionsComplete && <Button className="knowledge-history-load-more" onClick={props.onLoadMoreVersions}>{kt("knowledge.auto.5751f01920ce189f")}</Button>}
      {props.preview && <div className="knowledge-version-preview"><h4>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{props.preview.version}：{props.preview.title}</h4><p className="knowledge-subtle">{kt("knowledge.auto.97e93647f39a2f74")}{props.preview.parent_page_id || kt("knowledge.auto.42ee2863b6d776ff")} {kt("knowledge.auto.7b57ee5fb6107002")}{props.preview.rank}</p>{props.previewContent}</div>}
      {props.diff && <div className="knowledge-diff"><h4>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{props.diff.from_version} → {props.diff.to_version}</h4><pre>{props.diff.content.map((op, index) => <span key={index} className={`is-${op.kind}`}>{op.kind === "insert" ? "+ " : op.kind === "delete" ? "- " : "  "}{op.text}</span>)}</pre></div>}
    </> : <>
      <div className="knowledge-history-heading"><div><h3>{kt("knowledge.auto.ed50b63a788e750a")}</h3><p>{kt("knowledge.auto.6d9aa918e36d9b57")}</p></div></div>
      {props.editHistory.map(entry => <article className="knowledge-edit-history" key={entry.draft_revision}><header><strong>{props.memberProfiles[entry.user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}</strong><span>{formatKnowledgeDate(entry.created_at)} {kt("knowledge.auto.2f00485396e875bc")}{entry.draft_revision}{entry.clock > 0 ? ktf("knowledge.auto.192b0ac6708cf487", { value0: entry.clock }) : ""}</span></header><div className="knowledge-edit-history-summary">{entry.title_changed && <em>{kt("knowledge.auto.16dba170f9795381")}</em>}<span>{entry.changed_block_count} {kt("knowledge.auto.e6e5eca27fb9d1be")}{entry.truncated ? kt("knowledge.auto.0e14881147cf0919") : ""}</span></div>{entry.changes.length > 0 && <ul>{entry.changes.map(change => <li key={`${entry.draft_revision}-${change.node_id}`} className={`is-${change.kind}`}><b>{change.kind === "insert" ? kt("knowledge.auto.0006d696d8e1ec28") : change.kind === "delete" ? kt("knowledge.auto.2f9daa828907b93f") : kt("knowledge.auto.37090f45651676fc")}</b><code>{change.node_id.slice(0, 12)}</code><span>{change.kind === "update" ? `${change.before_preview || kt("knowledge.auto.51152e7acc73efe3")} → ${change.after_preview || kt("knowledge.auto.51152e7acc73efe3")}` : change.after_preview || change.before_preview || kt("knowledge.auto.51152e7acc73efe3")}</span></li>)}</ul>}</article>)}
      {props.editHistory.length === 0 && <p className="knowledge-subtle knowledge-history-empty">{kt("knowledge.auto.e4aa7da97aeba664")}</p>}
      {!props.editHistoryComplete && <Button className="knowledge-history-load-more" onClick={props.onLoadMoreEdits}>{kt("knowledge.auto.35c332eb424f7b89")}</Button>}
    </>}
  </section>;
}
