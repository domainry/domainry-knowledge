import { kt } from "../i18n/runtime.ts";
import { Menu, MenuButton, MenuItem, MenuProvider, MenuSeparator } from "@ariakit/react";
import { Archive, ArchiveRestore, BookOpen, Clock3, Ellipsis, GitPullRequest, ListTree, MessageSquare, Pencil, Pin, Search, Share2, UserRoundCog } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgePagePersonalState } from "../types.ts";

export type PageWorkspaceMode = "read" | "edit" | "suggestions" | "history" | "outline" | "comments" | "metadata" | "references" | "relationships" | "access" | "permissions" | "shares" | "governance";

export type PageToolbarProps = {
  mode: PageWorkspaceMode;
  pageActive: boolean;
  canWrite: boolean;
  canEdit: boolean;
  isDocument: boolean;
  pageFindOpen: boolean;
  personalState: KnowledgePagePersonalState | null;
  personalStateSaving: boolean;
  canManagePermissions: boolean;
  canManageShares: boolean;
  archived: boolean;
  onModeChange(mode: PageWorkspaceMode): void;
  onOpenSuggestions(): void;
  onOpenFind(): void;
  onToggleShortcut(): void;
  onArchive(): void;
};

export function PageToolbar(props: PageToolbarProps) {
  return <div className="knowledge-page-toolbar">
    <div className="knowledge-view-tabs" role="tablist" aria-label={kt("knowledge.auto.0278dfee40b99549")}>
      <button role="tab" aria-selected={props.mode === "read"} onClick={() => props.onModeChange("read")}><BookOpen size={14} />{kt("knowledge.auto.ce9b12499c471759")}</button>
      {props.canEdit && props.pageActive && <button role="tab" aria-selected={props.mode === "edit"} onClick={() => props.onModeChange("edit")}><Pencil size={14} />{kt("knowledge.auto.051836569928a9f9")}</button>}
      {props.isDocument && <button role="tab" aria-selected={props.mode === "suggestions"} onClick={props.onOpenSuggestions}><GitPullRequest size={14} />{kt("knowledge.auto.abee4974732afaf5")}</button>}
      <button role="tab" aria-selected={props.mode === "history"} onClick={() => props.onModeChange("history")}><Clock3 size={14} />{kt("knowledge.auto.b0385cfe4b424d83")}</button>
      <button role="tab" aria-selected={props.mode === "comments"} onClick={() => props.onModeChange("comments")}><MessageSquare size={14} />{kt("knowledge.auto.6849b8254d20c4ab")}</button>
    </div>
    <div className="knowledge-page-tools">
      <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.02f920895886f2e5")} aria-pressed={props.pageFindOpen} aria-label={kt("knowledge.auto.bcb6a2ea92da4d76")} title={kt("knowledge.auto.6c3351e6e138d208")} onClick={props.onOpenFind}><Search size={15} /></Button>
      {props.personalState && props.pageActive && <>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} aria-label={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} aria-pressed={!!props.personalState.shortcut_rank} title={props.personalState.shortcut_rank ? kt("knowledge.auto.40322a2bf31bae7e") : kt("knowledge.auto.625c1a980544c637")} disabled={props.personalStateSaving} onClick={props.onToggleShortcut}><Pin size={15} fill={props.personalState.shortcut_rank ? "currentColor" : "none"} /></Button>
      </>}
      {props.isDocument && <Button className="knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.be1ad90195c74408")} aria-label={kt("knowledge.auto.be1ad90195c74408")} aria-pressed={props.mode === "outline"} title={kt("knowledge.auto.be1ad90195c74408")} onClick={() => props.onModeChange("outline")}><ListTree size={15} /></Button>}
      {(props.canManagePermissions || props.canManageShares || props.canWrite) && <MenuProvider placement="bottom-end">
        <MenuButton className="knowledge-button knowledge-toolbar-icon" data-tooltip={kt("knowledge.auto.38844b135cf70dfc")} aria-label={kt("knowledge.auto.38844b135cf70dfc")}><Ellipsis size={18} /></MenuButton>
        <Menu className="knowledge-page-actions-menu" aria-label={kt("knowledge.auto.38844b135cf70dfc")} portal gutter={6} unmountOnHide>
          {props.canManagePermissions && <MenuItem data-selected={props.mode === "permissions" || undefined} onClick={() => props.onModeChange("permissions")}><UserRoundCog size={15} />{kt("knowledge.auto.0e235da0a383c26c")}</MenuItem>}
          {props.canManageShares && <MenuItem data-selected={props.mode === "shares" || undefined} onClick={() => props.onModeChange("shares")}><Share2 size={15} />{kt("knowledge.auto.348c903d1b5d1b9c")}</MenuItem>}
          {(props.canManagePermissions || props.canManageShares) && props.canWrite && <MenuSeparator />}
          {props.canWrite && <MenuItem className={props.archived ? undefined : "is-danger"} onClick={props.onArchive}>{props.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}{props.archived ? kt("knowledge.auto.d89a000da895d46b") : kt("knowledge.auto.7ab258e99c1e9382")}</MenuItem>}
        </Menu>
      </MenuProvider>}
    </div>
  </div>;
}
