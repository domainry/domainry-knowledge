import { Check, MessageSquare, X } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgeCommentAnchorSelection } from "../editors/types.ts";
import type { KnowledgePageComment, KnowledgePageTask, KnowledgePrincipal } from "../types.ts";
import { ComposerContent, MentionComposer } from "./MentionComposer.tsx";

const reactionEmojis = ["👍", "❤️", "🎉", "👀", "😄", "🚀"] as const;

export type CommentDrawerProps = {
  comments: KnowledgePageComment[];
  tasks: KnowledgePageTask[];
  memberProfiles: Record<string, KnowledgePrincipal>;
  activeThreadID: string;
  pageArchived: boolean;
  canComment: boolean;
  canWrite: boolean;
  unresolvedOnly: boolean;
  commentsComplete: boolean;
  replyingTo: string;
  anchor: KnowledgeCommentAnchorSelection | null;
  body: string;
  mentionedUserIDs: string[];
  focusRequest: number;
  editingCommentID: string;
  editingCommentBody: string;
  editingMentionedUserIDs: string[];
  searchMembers(query: string, signal: AbortSignal): Promise<KnowledgePrincipal[]>;
  onMemberResolved(member: KnowledgePrincipal): void;
  onClose(): void;
  onUnresolvedOnlyChange(value: boolean): void;
  onFocusAnchor(nodeID: string): void;
  onCancelReply(): void;
  onBodyChange(value: string): void;
  onMentionedUserIDsChange(value: string[]): void;
  onSubmit(): void;
  onThreadElement(threadID: string, element: HTMLElement | null): void;
  onFocusComment(comment: KnowledgePageComment): void;
  onEditingCommentBodyChange(value: string): void;
  onEditingMentionedUserIDsChange(value: string[]): void;
  onSaveEdit(comment: KnowledgePageComment): void;
  onCancelEdit(): void;
  onBeginEdit(comment: KnowledgePageComment): void;
  onBeginReply(comment: KnowledgePageComment): void;
  onResolve(comment: KnowledgePageComment): void;
  onAssignTask(comment: KnowledgePageComment): void;
  onDelete(comment: KnowledgePageComment): void;
  onToggleReaction(comment: KnowledgePageComment, emoji: string): void;
  onLoadMore(): void;
};

export function CommentDrawer(props: CommentDrawerProps) {
  return <aside className="knowledge-page-comments knowledge-comment-drawer" role="dialog" aria-modal="false" aria-label="页面评论">
    <header className="knowledge-comment-drawer-header"><div><MessageSquare size={18} /><span><strong>评论</strong><small>{props.comments.filter(comment => !comment.deleted).length} 条 · 原文按内容块标记</small></span></div><Button aria-label="关闭评论" title="关闭评论" onClick={props.onClose}><X size={16} /></Button></header>
    <div className="knowledge-comment-drawer-toolbar"><label className="knowledge-checkbox"><input type="checkbox" checked={props.unresolvedOnly} onChange={event => props.onUnresolvedOnlyChange(event.target.checked)} />只看未解决</label></div>
    <div className="knowledge-comment-drawer-scroll">
      {props.pageArchived && <p className="knowledge-subtle">页面已归档，评论只读。</p>}
      {props.canComment && <div className="knowledge-comment-create">
        {props.replyingTo ? <p className="knowledge-comment-anchor is-replying">正在回复评论线程 <button onClick={props.onCancelReply}>取消回复</button></p> : props.anchor ? <button type="button" className="knowledge-comment-anchor" onClick={() => props.onFocusAnchor(props.anchor!.nodeID)}><MessageSquare size={14} /><span><strong>评论当前选区</strong><small>“{props.anchor.quote}”</small></span></button> : <p className="knowledge-comment-anchor is-empty">请先选择正文内容块，或点选画板、思维导图、流程图元素。</p>}
        <MentionComposer value={props.body} mentionedUserIDs={props.mentionedUserIDs} onChange={props.onBodyChange} onMentionedUserIDsChange={props.onMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={props.onSubmit} placeholder="输入评论，使用 @ 提及成员" ariaLabel="评论内容" submitLabel="评论" submitDisabled={!props.body.trim() || !props.replyingTo && !props.anchor} focusRequest={props.focusRequest} />
      </div>}
      {props.comments.map(comment => {
        const rootID = comment.parent_comment_id || comment.id;
        const mentionedUserIDs = comment.mentioned_user_ids || [];
        return <article ref={!comment.parent_comment_id ? element => props.onThreadElement(comment.id, element) : undefined} key={comment.id} className={`knowledge-comment${comment.resolved ? " is-resolved" : ""}${comment.parent_comment_id ? " is-reply" : ""}${props.activeThreadID === rootID ? " is-active-thread" : ""}`}>
          <header><strong>{props.memberProfiles[comment.author_user_id]?.display_name || "账号不可用"}</strong><span>版本 {comment.published_version} · {new Date(comment.created_at).toLocaleString()}</span></header>
          {comment.anchor.changed ? <p className="knowledge-comment-anchor-state is-invalid">原内容块已删除或内容已经变化，锚点失效。</p> : <button type="button" className="knowledge-comment-quote" onClick={() => props.onFocusComment(comment)} title="定位并高亮原内容块">“{comment.anchor.quote}”</button>}
          {props.editingCommentID === comment.id ? <div className="knowledge-comment-edit"><MentionComposer value={props.editingCommentBody} mentionedUserIDs={props.editingMentionedUserIDs} onChange={props.onEditingCommentBodyChange} onMentionedUserIDsChange={props.onEditingMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={() => props.onSaveEdit(comment)} placeholder="编辑评论，支持样式、表情和 @ 提及" ariaLabel="编辑评论内容" submitLabel="保存" submitDisabled={!props.editingCommentBody.trim()} /><div className="knowledge-actions"><Button onClick={props.onCancelEdit}>取消</Button></div></div> : comment.deleted ? <p>评论已删除</p> : <ComposerContent value={comment.body} />}
          {mentionedUserIDs.length > 0 && <p className="knowledge-subtle">提及 {mentionedUserIDs.map(id => `@${props.memberProfiles[id]?.display_name || "账号不可用"}`).join("、")}</p>}
          {!comment.deleted && <div className="knowledge-comment-reactions" aria-label="表情回应">{reactionEmojis.map(emoji => { const reaction = comment.reactions?.find(item => item.emoji === emoji); return <button key={emoji} type="button" className={reaction?.reacted ? "is-active" : undefined} aria-pressed={reaction?.reacted || false} title={`${reaction?.reacted ? "取消" : "添加"}${emoji}回应`} onClick={() => props.onToggleReaction(comment, emoji)}><span>{emoji}</span>{reaction && reaction.count > 0 && <b>{reaction.count}</b>}</button>; })}</div>}
          {props.tasks.filter(task => task.source_block_id === comment.anchor.node_id).map(task => <div className="knowledge-comment-task" key={task.id}><Check size={14} /><span><strong>{task.title}</strong><small>{task.status === "done" ? "已完成" : task.status === "in_progress" ? "进行中" : task.status === "canceled" ? "已取消" : "待处理"}{task.assignee_user_ids.length ? ` · ${task.assignee_user_ids.map(id => props.memberProfiles[id]?.display_name || id).join("、")}` : " · 未指派"}</small></span></div>)}
          {!props.pageArchived && !comment.deleted && props.editingCommentID !== comment.id && <div className="knowledge-actions"><Button onClick={() => props.onBeginReply(comment)}>回复</Button><Button onClick={() => props.onBeginEdit(comment)}>编辑</Button><Button onClick={() => props.onResolve(comment)}>{comment.resolved ? "重新打开" : "标记解决"}</Button>{props.canWrite && !comment.anchor.changed && <Button onClick={() => props.onAssignTask(comment)}>{props.tasks.some(task => task.source_block_id === comment.anchor.node_id) ? "追加任务指派" : "指派任务"}</Button>}<Button className="danger" onClick={() => props.onDelete(comment)}>删除</Button></div>}
        </article>;
      })}
      {props.comments.length === 0 && <p className="knowledge-subtle knowledge-comment-empty">当前页面还没有评论。选择正文后即可发起评论。</p>}
      {!props.commentsComplete && <Button onClick={props.onLoadMore}>加载更多评论</Button>}
    </div>
  </aside>;
}
