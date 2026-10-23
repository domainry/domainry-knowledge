import { createPortal } from "react-dom";
import { GitPullRequest, X } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgeCommentAnchorSelection } from "../editors/types.ts";
import type { KnowledgePageSuggestion, KnowledgePrincipal } from "../types.ts";
import { ComposerContent, MentionComposer } from "./MentionComposer.tsx";

export type SuggestionDrawerProps = {
  open: boolean;
  suggestions: KnowledgePageSuggestion[];
  anchor: KnowledgeCommentAnchorSelection | null;
  canCreate: boolean;
  canWrite: boolean;
  currentUserID: string;
  memberProfiles: Record<string, KnowledgePrincipal>;
  kind: "insert" | "delete";
  proposedText: string;
  comment: string;
  mentionedUserIDs: string[];
  busy: string;
  searchMembers(query: string, signal: AbortSignal): Promise<KnowledgePrincipal[]>;
  onMemberResolved(member: KnowledgePrincipal): void;
  onClose(): void;
  onFocusAnchor(nodeID: string): void;
  onKindChange(kind: "insert" | "delete"): void;
  onProposedTextChange(value: string): void;
  onCommentChange(value: string): void;
  onMentionedUserIDsChange(value: string[]): void;
  onCreate(): void;
  onDecide(suggestion: KnowledgePageSuggestion, decision: "accept" | "reject" | "withdraw"): void;
};

export function SuggestionDrawer(props: SuggestionDrawerProps) {
  if (!props.open || typeof document === "undefined") return null;
  const composerValue = props.kind === "insert" ? props.proposedText : props.comment;
  const onComposerChange = props.kind === "insert" ? props.onProposedTextChange : props.onCommentChange;
  return createPortal(<div className="knowledge-modal-backdrop knowledge-suggestion-drawer-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) props.onClose(); }}>
    <aside className="knowledge-page-suggestions knowledge-suggestion-drawer" role="dialog" aria-modal="true" aria-label="修改建议">
      <header><div><GitPullRequest size={17} /><span><strong>修改建议</strong><small>按内容块审阅，接受后才写入草稿</small></span></div><div><b>{props.suggestions.filter(item => item.status === "open").length} 条待处理</b><Button aria-label="关闭修改建议" title="关闭" onClick={props.onClose}><X size={15} /></Button></div></header>
      {props.canCreate && (props.anchor ? <section className="knowledge-suggestion-create">
        <button type="button" className="knowledge-comment-anchor" onClick={() => props.onFocusAnchor(props.anchor!.nodeID)}><GitPullRequest size={14} /><span><strong>当前内容块</strong><small>“{props.anchor.quote}”</small></span></button>
        <div className="knowledge-suggestion-kind"><button type="button" aria-pressed={props.kind === "insert"} onClick={() => props.onKindChange("insert")}>在其后插入段落</button><button type="button" aria-pressed={props.kind === "delete"} onClick={() => props.onKindChange("delete")}>删除整个内容块</button></div>
        <MentionComposer value={composerValue} mentionedUserIDs={props.mentionedUserIDs} onChange={onComposerChange} onMentionedUserIDsChange={props.onMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={props.onCreate} placeholder={props.kind === "insert" ? "输入要插入的内容，支持样式、表情和 @ 提及" : "说明删除原因，支持样式、表情和 @ 提及（可选）"} ariaLabel={props.kind === "insert" ? "建议插入内容" : "删除建议说明"} submitLabel="提交建议" submittingLabel="正在提交…" submitting={props.busy === "create"} submitDisabled={props.kind === "insert" && !composerValue.trim()} />
      </section> : <section className="knowledge-suggestion-guide"><GitPullRequest size={20} /><div><strong>先选择要修改的正文</strong><p>关闭面板，在正文中选择文字或点选一个内容块；选中后这里会打开建议表单。</p></div><Button onClick={props.onClose}>去选择</Button></section>)}
      <div className="knowledge-suggestion-list"><h4>全部建议</h4>{props.suggestions.map(suggestion => <article key={suggestion.id} className={`knowledge-suggestion is-${suggestion.status}${suggestion.anchor.changed ? " is-stale" : ""}`}>
        <header><span><strong>{suggestion.kind === "insert" ? "提议插入" : "提议删除"}</strong><small>{props.memberProfiles[suggestion.author_user_id]?.display_name || "账号不可用"} · {new Date(suggestion.created_at).toLocaleString()}</small></span><em>{suggestion.status === "open" ? "待处理" : suggestion.status === "accepted" ? "已接受" : suggestion.status === "rejected" ? "已拒绝" : "已撤回"}</em></header>
        <button type="button" className="knowledge-comment-quote" disabled={!!suggestion.anchor.changed} onClick={() => props.onFocusAnchor(suggestion.anchor.node_id || "")}>“{suggestion.anchor.quote || "内容块"}”</button>
        {suggestion.anchor.changed && suggestion.status === "open" && <p className="knowledge-comment-anchor-state is-invalid">原内容块已改变，不能接受这条建议。</p>}
        {suggestion.proposed_text && <ComposerContent className="knowledge-suggestion-proposal" value={`+ ${suggestion.proposed_text}`} />}
        {suggestion.comment && <ComposerContent value={suggestion.comment} />}
        {suggestion.mentioned_user_ids.length > 0 && <p className="knowledge-subtle">提及 {suggestion.mentioned_user_ids.map(id => `@${props.memberProfiles[id]?.display_name || "账号不可用"}`).join("、")}</p>}
        {suggestion.status === "open" && <div className="knowledge-actions">{props.canWrite && <><Button disabled={props.busy === suggestion.id || !!suggestion.anchor.changed} onClick={() => props.onDecide(suggestion, "accept")}>接受</Button><Button disabled={props.busy === suggestion.id} onClick={() => props.onDecide(suggestion, "reject")}>拒绝</Button></>}{suggestion.author_user_id === props.currentUserID && <Button disabled={props.busy === suggestion.id} onClick={() => props.onDecide(suggestion, "withdraw")}>撤回</Button>}</div>}
      </article>)}{props.suggestions.length === 0 && <p className="knowledge-subtle">还没有修改建议。</p>}</div>
    </aside>
  </div>, document.body);
}
