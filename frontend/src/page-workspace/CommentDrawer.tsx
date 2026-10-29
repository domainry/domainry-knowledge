import { formatKnowledgeDate, kt, ktf } from "../i18n/runtime.ts";
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
  return <aside className="knowledge-page-comments knowledge-comment-drawer" role="dialog" aria-modal="false" aria-label={kt("knowledge.auto.259da0be985ddf32")}>
    <header className="knowledge-comment-drawer-header"><div><MessageSquare size={18} /><span><strong>{kt("knowledge.auto.6849b8254d20c4ab")}</strong><small>{props.comments.filter(comment => !comment.deleted).length} {kt("knowledge.auto.0ec4f6b2af6b640b")}</small></span></div><Button aria-label={kt("knowledge.auto.6884882f0fb61627")} title={kt("knowledge.auto.6884882f0fb61627")} onClick={props.onClose}><X size={16} /></Button></header>
    <div className="knowledge-comment-drawer-toolbar"><label className="knowledge-checkbox"><input type="checkbox" checked={props.unresolvedOnly} onChange={event => props.onUnresolvedOnlyChange(event.target.checked)} />{kt("knowledge.auto.e349b5518f1daaa5")}</label></div>
    <div className="knowledge-comment-drawer-scroll">
      {props.pageArchived && <p className="knowledge-subtle">{kt("knowledge.auto.b3b84c3e48a65f87")}</p>}
      {props.canComment && <div className="knowledge-comment-create">
        {props.replyingTo ? <p className="knowledge-comment-anchor is-replying">{kt("knowledge.auto.ff1e052c3b1f65d7")}<button onClick={props.onCancelReply}>{kt("knowledge.auto.d346633d3a4e54d3")}</button></p> : props.anchor ? <button type="button" className="knowledge-comment-anchor" onClick={() => props.onFocusAnchor(props.anchor!.nodeID)}><MessageSquare size={14} /><span><strong>{kt("knowledge.auto.8579dbb2197a21fa")}</strong><small>“{props.anchor.quote}”</small></span></button> : <p className="knowledge-comment-anchor is-empty">{kt("knowledge.auto.5fda17e4f303ee26")}</p>}
        <MentionComposer value={props.body} mentionedUserIDs={props.mentionedUserIDs} onChange={props.onBodyChange} onMentionedUserIDsChange={props.onMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={props.onSubmit} placeholder={kt("knowledge.auto.7db805020be2815a")} ariaLabel={kt("knowledge.auto.16950541902212bc")} submitLabel={kt("knowledge.auto.6849b8254d20c4ab")} submitDisabled={!props.body.trim() || !props.replyingTo && !props.anchor} focusRequest={props.focusRequest} />
      </div>}
      {props.comments.map(comment => {
        const rootID = comment.parent_comment_id || comment.id;
        const mentionedUserIDs = comment.mentioned_user_ids || [];
        return <article ref={!comment.parent_comment_id ? element => props.onThreadElement(comment.id, element) : undefined} key={comment.id} className={`knowledge-comment${comment.resolved ? " is-resolved" : ""}${comment.parent_comment_id ? " is-reply" : ""}${props.activeThreadID === rootID ? " is-active-thread" : ""}`}>
          <header><strong>{props.memberProfiles[comment.author_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}</strong><span>{kt("knowledge.auto.5f76b2bf82dd2c5d")}{comment.published_version} · {formatKnowledgeDate(comment.created_at)}</span></header>
          {comment.anchor.changed ? <p className="knowledge-comment-anchor-state is-invalid">{kt("knowledge.auto.662b06002b8a901e")}</p> : <button type="button" className="knowledge-comment-quote" onClick={() => props.onFocusComment(comment)} title={kt("knowledge.auto.f15170c2056aead7")}>“{comment.anchor.quote}”</button>}
          {props.editingCommentID === comment.id ? <div className="knowledge-comment-edit"><MentionComposer value={props.editingCommentBody} mentionedUserIDs={props.editingMentionedUserIDs} onChange={props.onEditingCommentBodyChange} onMentionedUserIDsChange={props.onEditingMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={() => props.onSaveEdit(comment)} placeholder={kt("knowledge.auto.de85340fdaaa95a8")} ariaLabel={kt("knowledge.auto.fba213a7e2f844cb")} submitLabel={kt("knowledge.auto.a3030bf8f16dc63c")} submitDisabled={!props.editingCommentBody.trim()} /><div className="knowledge-actions"><Button onClick={props.onCancelEdit}>{kt("knowledge.auto.2cd0f3be8738a86c")}</Button></div></div> : comment.deleted ? <p>{kt("knowledge.auto.c9e7f26c7417546f")}</p> : <ComposerContent value={comment.body} />}
          {mentionedUserIDs.length > 0 && <p className="knowledge-subtle">{kt("knowledge.auto.4d2cdcccd3b20284")}{mentionedUserIDs.map(id => `@${props.memberProfiles[id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}`).join("、")}</p>}
          {!comment.deleted && <div className="knowledge-comment-reactions" aria-label={kt("knowledge.auto.d1aa782d40172761")}>{reactionEmojis.map(emoji => { const reaction = comment.reactions?.find(item => item.emoji === emoji); return <button key={emoji} type="button" className={reaction?.reacted ? "is-active" : undefined} aria-pressed={reaction?.reacted || false} title={ktf("knowledge.auto.64e629e859d82b0a", { value0: reaction?.reacted ? kt("knowledge.auto.2cd0f3be8738a86c") : kt("knowledge.common.add"), value1: emoji })} onClick={() => props.onToggleReaction(comment, emoji)}><span>{emoji}</span>{reaction && reaction.count > 0 && <b>{reaction.count}</b>}</button>; })}</div>}
          {props.tasks.filter(task => task.source_block_id === comment.anchor.node_id).map(task => <div className="knowledge-comment-task" key={task.id}><Check size={14} /><span><strong>{task.title}</strong><small>{task.status === "done" ? kt("knowledge.auto.f28461bb49c85647") : task.status === "in_progress" ? kt("knowledge.auto.dc9591e56d502b43") : task.status === "canceled" ? kt("knowledge.auto.a37778f17c5f3ee5") : kt("knowledge.auto.999a459c3f3f2d16")}{task.assignee_user_ids.length ? ` · ${task.assignee_user_ids.map(id => props.memberProfiles[id]?.display_name || id).join("、")}` : kt("knowledge.auto.f86fbf6419b6bb53")}</small></span></div>)}
          {!props.pageArchived && !comment.deleted && props.editingCommentID !== comment.id && <div className="knowledge-actions"><Button onClick={() => props.onBeginReply(comment)}>{kt("knowledge.auto.cf945e21ddefbb46")}</Button><Button onClick={() => props.onBeginEdit(comment)}>{kt("knowledge.auto.051836569928a9f9")}</Button><Button onClick={() => props.onResolve(comment)}>{comment.resolved ? kt("knowledge.auto.9f24062367f05167") : kt("knowledge.auto.c6a2439a19da8d88")}</Button>{props.canWrite && !comment.anchor.changed && <Button onClick={() => props.onAssignTask(comment)}>{props.tasks.some(task => task.source_block_id === comment.anchor.node_id) ? kt("knowledge.auto.ca07b5f90c6d6c8f") : kt("knowledge.auto.7e2a584e002836cd")}</Button>}<Button className="danger" onClick={() => props.onDelete(comment)}>{kt("knowledge.auto.2f9daa828907b93f")}</Button></div>}
        </article>;
      })}
      {props.comments.length === 0 && <p className="knowledge-subtle knowledge-comment-empty">{kt("knowledge.auto.8edceca3accb3670")}</p>}
      {!props.commentsComplete && <Button onClick={props.onLoadMore}>{kt("knowledge.auto.018bc6017e37cc91")}</Button>}
    </div>
  </aside>;
}
