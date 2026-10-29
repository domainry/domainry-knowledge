import { formatKnowledgeDate, kt } from "../i18n/runtime.ts";
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
    <aside className="knowledge-page-suggestions knowledge-suggestion-drawer" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.0b947d730eba31d7")}>
      <header><div><GitPullRequest size={17} /><span><strong>{kt("knowledge.auto.0b947d730eba31d7")}</strong><small>{kt("knowledge.auto.365dbbf99eca896a")}</small></span></div><div><b>{props.suggestions.filter(item => item.status === "open").length} {kt("knowledge.auto.2f6f44f004af7679")}</b><Button aria-label={kt("knowledge.auto.e053b0f9149c07e2")} title={kt("knowledge.auto.3fd47edce45b3603")} onClick={props.onClose}><X size={15} /></Button></div></header>
      {props.canCreate && (props.anchor ? <section className="knowledge-suggestion-create">
        <button type="button" className="knowledge-comment-anchor" onClick={() => props.onFocusAnchor(props.anchor!.nodeID)}><GitPullRequest size={14} /><span><strong>{kt("knowledge.auto.cbd6377999a396c4")}</strong><small>“{props.anchor.quote}”</small></span></button>
        <div className="knowledge-suggestion-kind"><button type="button" aria-pressed={props.kind === "insert"} onClick={() => props.onKindChange("insert")}>{kt("knowledge.auto.eab29af003f24868")}</button><button type="button" aria-pressed={props.kind === "delete"} onClick={() => props.onKindChange("delete")}>{kt("knowledge.auto.14b0310b2502c3ef")}</button></div>
        <MentionComposer value={composerValue} mentionedUserIDs={props.mentionedUserIDs} onChange={onComposerChange} onMentionedUserIDsChange={props.onMentionedUserIDsChange} searchMembers={props.searchMembers} onMemberResolved={props.onMemberResolved} onSubmit={props.onCreate} placeholder={props.kind === "insert" ? kt("knowledge.auto.0c7a3cf2edf462fa") : kt("knowledge.auto.53d1519340aecc15")} ariaLabel={props.kind === "insert" ? kt("knowledge.auto.b47c153a08041fc0") : kt("knowledge.auto.46333abe65c5a448")} submitLabel={kt("knowledge.auto.36632956087e6a98")} submittingLabel={kt("knowledge.auto.26ef00b7d061c534")} submitting={props.busy === "create"} submitDisabled={props.kind === "insert" && !composerValue.trim()} />
      </section> : <section className="knowledge-suggestion-guide"><GitPullRequest size={20} /><div><strong>{kt("knowledge.auto.e5db30686a5b56bb")}</strong><p>{kt("knowledge.auto.6882c2a7c019bc72")}</p></div><Button onClick={props.onClose}>{kt("knowledge.auto.602da8e95c2090d3")}</Button></section>)}
      <div className="knowledge-suggestion-list"><h4>{kt("knowledge.auto.bf109abe3cdb06b4")}</h4>{props.suggestions.map(suggestion => <article key={suggestion.id} className={`knowledge-suggestion is-${suggestion.status}${suggestion.anchor.changed ? " is-stale" : ""}`}>
        <header><span><strong>{suggestion.kind === "insert" ? kt("knowledge.auto.3be6c473b679ff2e") : suggestion.kind === "replace" ? kt("knowledge.auto.37090f45651676fc") : kt("knowledge.auto.cd46281d6ca81c80")}</strong><small>{props.memberProfiles[suggestion.author_user_id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}{suggestion.source === "verdent_agent" ? " · Verdent Agent" : ""} · {formatKnowledgeDate(suggestion.created_at)}</small></span><em>{suggestion.status === "open" ? kt("knowledge.auto.999a459c3f3f2d16") : suggestion.status === "accepted" ? kt("knowledge.auto.f0c489dc2296f0dc") : suggestion.status === "rejected" ? kt("knowledge.auto.f098218a3032a625") : kt("knowledge.auto.0462a8aa7036a3c4")}</em></header>
        <button type="button" className="knowledge-comment-quote" disabled={!!suggestion.anchor.changed} onClick={() => props.onFocusAnchor(suggestion.anchor.node_id || "")}>“{suggestion.anchor.quote || kt("knowledge.auto.73012a38cd4eaf64")}”</button>
        {suggestion.anchor.changed && suggestion.status === "open" && <p className="knowledge-comment-anchor-state is-invalid">{kt("knowledge.auto.c10fca32d56a7323")}</p>}
        {suggestion.proposed_text && <ComposerContent className="knowledge-suggestion-proposal" value={`${suggestion.kind === "replace" ? "↔" : "+"} ${suggestion.proposed_text}`} />}
        {suggestion.comment && <ComposerContent value={suggestion.comment} />}
        {suggestion.mentioned_user_ids.length > 0 && <p className="knowledge-subtle">{kt("knowledge.auto.4d2cdcccd3b20284")}{suggestion.mentioned_user_ids.map(id => `@${props.memberProfiles[id]?.display_name || kt("knowledge.auto.3c2e935e260f4c63")}`).join("、")}</p>}
        {suggestion.status === "open" && <div className="knowledge-actions">{props.canWrite && <><Button disabled={props.busy === suggestion.id || !!suggestion.anchor.changed} onClick={() => props.onDecide(suggestion, "accept")}>{kt("knowledge.auto.329fcec61856d4e5")}</Button><Button disabled={props.busy === suggestion.id} onClick={() => props.onDecide(suggestion, "reject")}>{kt("knowledge.auto.136de7a8c46fc803")}</Button></>}{suggestion.author_user_id === props.currentUserID && <Button disabled={props.busy === suggestion.id} onClick={() => props.onDecide(suggestion, "withdraw")}>{kt("knowledge.auto.6b58198955259066")}</Button>}</div>}
      </article>)}{props.suggestions.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.3cd81f9080262f36")}</p>}</div>
    </aside>
  </div>, document.body);
}
