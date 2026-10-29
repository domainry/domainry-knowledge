import { kt } from "../i18n/runtime.ts";
import { Activity, Archive, ArchiveRestore, Bell, BookOpen, Clock3, Copy, GitPullRequest, Link2, ListTree, MessageSquare, Network, Pencil, Pin, ScanSearch, Search, Share2, ShieldCheck, Sparkles, Star, Tags, UserRoundCog } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgePagePersonalState } from "../types.ts";

export type PageWorkspaceMode = "read" | "edit" | "suggestions" | "history" | "outline" | "comments" | "activity" | "metadata" | "references" | "relationships" | "access" | "permissions" | "shares" | "governance";

export type PageToolbarProps = {
  mode: PageWorkspaceMode;
  pageActive: boolean;
  canWrite: boolean;
  isDocument: boolean;
  pageFindOpen: boolean;
  personalState: KnowledgePagePersonalState | null;
  personalStateSaving: boolean;
  aiAvailable: boolean;
  aiOpen: boolean;
  isManager: boolean;
  canManagePermissions: boolean;
  canManageShares: boolean;
  canReviewGovernance: boolean;
  archived: boolean;
  onModeChange(mode: PageWorkspaceMode): void;
  onOpenSuggestions(): void;
  onOpenFind(): void;
  onToggleFavorite(): void;
  onToggleSubscription(): void;
  onToggleShortcut(): void;
  onOpenAI(): void;
  onCopy(): void;
  onArchive(): void;
};

export function PageToolbar(props: PageToolbarProps) {
  return <div className="knowledge-page-toolbar">
    <div className="knowledge-view-tabs" role="tablist" aria-label={kt("knowledge.auto.0278dfee40b99549")}>
      <button role="tab" aria-selected={props.mode === "read"} onClick={() => props.onModeChange("read")}><BookOpen size={14} />{kt("knowledge.auto.ce9b12499c471759")}</button>
      {props.canWrite && props.pageActive && <button role="tab" aria-selected={props.mode === "edit"} onClick={() => props.onModeChange("edit")}><Pencil size={14} />{kt("knowledge.auto.051836569928a9f9")}</button>}
      {props.isDocument && <button role="tab" aria-selected={props.mode === "suggestions"} onClick={props.onOpenSuggestions}><GitPullRequest size={14} />{kt("knowledge.auto.abee4974732afaf5")}</button>}
      <button role="tab" aria-selected={props.mode === "history"} onClick={() => props.onModeChange("history")}><Clock3 size={14} />{kt("knowledge.auto.b0385cfe4b424d83")}</button>
      <button role="tab" aria-selected={props.mode === "comments"} onClick={() => props.onModeChange("comments")}><MessageSquare size={14} />{kt("knowledge.auto.6849b8254d20c4ab")}</button>
      <button role="tab" aria-selected={props.mode === "activity"} onClick={() => props.onModeChange("activity")}><Activity size={14} />{kt("knowledge.auto.9e9bead81498b898")}</button>
    </div>
    <div className="knowledge-page-tools">
      <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.02f920895886f2e5")} aria-pressed={props.pageFindOpen} aria-label={kt("knowledge.auto.bcb6a2ea92da4d76")} title={kt("knowledge.auto.6c3351e6e138d208")} onClick={props.onOpenFind}><Search size={15} /></Button>
      {props.personalState && props.pageActive && <>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.favorite ? kt("knowledge.auto.dca60869e7d26839") : kt("knowledge.auto.68c464da09bf2c41")} aria-label={props.personalState.favorite ? kt("knowledge.auto.dca60869e7d26839") : kt("knowledge.auto.68c464da09bf2c41")} aria-pressed={props.personalState.favorite} title={props.personalState.favorite ? kt("knowledge.auto.dca60869e7d26839") : kt("knowledge.auto.68c464da09bf2c41")} disabled={props.personalStateSaving} onClick={props.onToggleFavorite}><Star size={15} fill={props.personalState.favorite ? "currentColor" : "none"} /></Button>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.subscribed ? kt("knowledge.auto.6af7023b9f5f0e40") : kt("knowledge.auto.0cbff43b7568dbe0")} aria-label={props.personalState.subscribed ? kt("knowledge.auto.6af7023b9f5f0e40") : kt("knowledge.auto.0cbff43b7568dbe0")} aria-pressed={props.personalState.subscribed} title={props.personalState.subscribed ? kt("knowledge.auto.6af7023b9f5f0e40") : kt("knowledge.auto.0cbff43b7568dbe0")} disabled={props.personalStateSaving} onClick={props.onToggleSubscription}><Bell size={15} fill={props.personalState.subscribed ? "currentColor" : "none"} /></Button>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} aria-label={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} aria-pressed={!!props.personalState.shortcut_rank} title={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} disabled={props.personalStateSaving} onClick={props.onToggleShortcut}><Pin size={15} fill={props.personalState.shortcut_rank ? "currentColor" : "none"} /></Button>
      </>}
      {props.isDocument && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.be1ad90195c74408")} aria-label={kt("knowledge.auto.be1ad90195c74408")} aria-pressed={props.mode === "outline"} title={kt("knowledge.auto.be1ad90195c74408")} onClick={() => props.onModeChange("outline")}><ListTree size={15} /></Button>}
      {props.aiAvailable && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.2f9ff39566bb9bc8")} aria-pressed={props.aiOpen} aria-label={kt("knowledge.auto.2f9ff39566bb9bc8")} title={kt("knowledge.auto.2f9ff39566bb9bc8")} onClick={props.onOpenAI}><Sparkles size={15} /></Button>}
      <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.08c1154822126142")} aria-pressed={props.mode === "metadata"} aria-label={kt("knowledge.auto.08c1154822126142")} title={kt("knowledge.auto.08c1154822126142")} onClick={() => props.onModeChange("metadata")}><Tags size={15} /></Button>
      <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.bf3a3e79e9765e86")} aria-pressed={props.mode === "references"} aria-label={kt("knowledge.auto.89d7a116be1911b3")} title={kt("knowledge.auto.89d7a116be1911b3")} onClick={() => props.onModeChange("references")}><Link2 size={15} /></Button>
      <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.73cfc661a728ad5b")} aria-pressed={props.mode === "relationships"} aria-label={kt("knowledge.auto.73cfc661a728ad5b")} title={kt("knowledge.auto.bff649dfd34f83b3")} onClick={() => props.onModeChange("relationships")}><Network size={15} /></Button>
      {props.isManager && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.4f3125785c1ca618")} aria-label={kt("knowledge.auto.4f3125785c1ca618")} aria-pressed={props.mode === "access"} title={kt("knowledge.auto.c9ff0b899f893621")} onClick={() => props.onModeChange("access")}><ScanSearch size={15} /></Button>}
      {props.canManagePermissions && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.0e235da0a383c26c")} aria-label={kt("knowledge.auto.0e235da0a383c26c")} aria-pressed={props.mode === "permissions"} title={kt("knowledge.auto.b157acddff49cff2")} onClick={() => props.onModeChange("permissions")}><UserRoundCog size={15} /></Button>}
      {props.canManageShares && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.348c903d1b5d1b9c")} aria-label={kt("knowledge.auto.348c903d1b5d1b9c")} aria-pressed={props.mode === "shares"} title={kt("knowledge.auto.a2b608d0dfdf9d3d")} onClick={() => props.onModeChange("shares")}><Share2 size={15} /></Button>}
      {(props.isManager || props.canReviewGovernance) && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.0c4ab1ae758a60c4")} aria-pressed={props.mode === "governance"} aria-label={kt("knowledge.auto.0c4ab1ae758a60c4")} title={kt("knowledge.auto.3a8f071b55717a6e")} onClick={() => props.onModeChange("governance")}><ShieldCheck size={15} /></Button>}
      {props.canWrite && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.12f008adad5c79c4")} aria-label={kt("knowledge.auto.12f008adad5c79c4")} title={kt("knowledge.auto.12f008adad5c79c4")} onClick={props.onCopy}><Copy size={15} /></Button>}
      {props.canWrite && <Button className="knowledge-toolbar-icon" data-tooltip={props.archived ? kt("knowledge.auto.d89a000da895d46b") : kt("knowledge.auto.7ab258e99c1e9382")} aria-label={props.archived ? kt("knowledge.auto.d89a000da895d46b") : kt("knowledge.auto.7ab258e99c1e9382")} title={props.archived ? kt("knowledge.auto.d89a000da895d46b") : kt("knowledge.auto.7ab258e99c1e9382")} onClick={props.onArchive}>{props.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}</Button>}
    </div>
  </div>;
}
