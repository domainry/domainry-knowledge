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
    <div className="knowledge-view-tabs" role="tablist" aria-label="页面视图">
      <button role="tab" aria-selected={props.mode === "read"} onClick={() => props.onModeChange("read")}><BookOpen size={14} />阅读</button>
      {props.canWrite && props.pageActive && <button role="tab" aria-selected={props.mode === "edit"} onClick={() => props.onModeChange("edit")}><Pencil size={14} />编辑</button>}
      {props.isDocument && <button role="tab" aria-selected={props.mode === "suggestions"} onClick={props.onOpenSuggestions}><GitPullRequest size={14} />建议</button>}
      <button role="tab" aria-selected={props.mode === "history"} onClick={() => props.onModeChange("history")}><Clock3 size={14} />历史</button>
      <button role="tab" aria-selected={props.mode === "comments"} onClick={() => props.onModeChange("comments")}><MessageSquare size={14} />评论</button>
      <button role="tab" aria-selected={props.mode === "activity"} onClick={() => props.onModeChange("activity")}><Activity size={14} />活动</button>
    </div>
    <div className="knowledge-page-tools">
      <Button className="knowledge-toolbar-icon" data-tooltip="页内查找" aria-pressed={props.pageFindOpen} aria-label="在当前页面查找" title="在当前页面查找（⌘/Ctrl + F）" onClick={props.onOpenFind}><Search size={15} /></Button>
      {props.personalState && props.pageActive && <>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.favorite ? "取消收藏" : "收藏页面"} aria-label={props.personalState.favorite ? "取消收藏" : "收藏页面"} aria-pressed={props.personalState.favorite} title={props.personalState.favorite ? "取消收藏" : "收藏页面"} disabled={props.personalStateSaving} onClick={props.onToggleFavorite}><Star size={15} fill={props.personalState.favorite ? "currentColor" : "none"} /></Button>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.subscribed ? "取消订阅" : "订阅页面"} aria-label={props.personalState.subscribed ? "取消订阅" : "订阅页面"} aria-pressed={props.personalState.subscribed} title={props.personalState.subscribed ? "取消订阅" : "订阅页面"} disabled={props.personalStateSaving} onClick={props.onToggleSubscription}><Bell size={15} fill={props.personalState.subscribed ? "currentColor" : "none"} /></Button>
        <Button className="knowledge-toolbar-icon" data-tooltip={props.personalState.shortcut_rank ? "移出快捷入口" : "添加到快捷入口"} aria-label={props.personalState.shortcut_rank ? "移出快捷入口" : "添加到快捷入口"} aria-pressed={!!props.personalState.shortcut_rank} title={props.personalState.shortcut_rank ? "移出快捷入口" : "添加到快捷入口"} disabled={props.personalStateSaving} onClick={props.onToggleShortcut}><Pin size={15} fill={props.personalState.shortcut_rank ? "currentColor" : "none"} /></Button>
      </>}
      {props.isDocument && <Button className="knowledge-toolbar-icon" data-tooltip="页面大纲" aria-label="页面大纲" aria-pressed={props.mode === "outline"} title="页面大纲" onClick={() => props.onModeChange("outline")}><ListTree size={15} /></Button>}
      {props.aiAvailable && <Button className="knowledge-toolbar-icon" data-tooltip="AI 写作助手" aria-pressed={props.aiOpen} aria-label="AI 写作助手" title="AI 写作助手" onClick={props.onOpenAI}><Sparkles size={15} /></Button>}
      <Button className="knowledge-toolbar-icon" data-tooltip="页面属性" aria-pressed={props.mode === "metadata"} aria-label="页面属性" title="页面属性" onClick={() => props.onModeChange("metadata")}><Tags size={15} /></Button>
      <Button className="knowledge-toolbar-icon" data-tooltip="引用与反向链接" aria-pressed={props.mode === "references"} aria-label="页面引用与反向链接" title="页面引用与反向链接" onClick={() => props.onModeChange("references")}><Link2 size={15} /></Button>
      <Button className="knowledge-toolbar-icon" data-tooltip="知识关系图" aria-pressed={props.mode === "relationships"} aria-label="知识关系图" title="关联页面与知识关系图" onClick={() => props.onModeChange("relationships")}><Network size={15} /></Button>
      {props.isManager && <Button className="knowledge-toolbar-icon" data-tooltip="权限分析" aria-label="权限分析" aria-pressed={props.mode === "access"} title="分析指定用户为何可以或不可以访问当前页面" onClick={() => props.onModeChange("access")}><ScanSearch size={15} /></Button>}
      {props.canManagePermissions && <Button className="knowledge-toolbar-icon" data-tooltip="页面权限" aria-label="页面权限" aria-pressed={props.mode === "permissions"} title="配置页面与子树的成员权限" onClick={() => props.onModeChange("permissions")}><UserRoundCog size={15} /></Button>}
      {props.canManageShares && <Button className="knowledge-toolbar-icon" data-tooltip="受控分享" aria-label="受控分享" aria-pressed={props.mode === "shares"} title="创建有范围和有效期的受控分享" onClick={() => props.onModeChange("shares")}><Share2 size={15} /></Button>}
      {(props.isManager || props.canReviewGovernance) && <Button className="knowledge-toolbar-icon" data-tooltip="页面治理" aria-pressed={props.mode === "governance"} aria-label="页面治理" title="配置负责人、复核周期与归档保留规则" onClick={() => props.onModeChange("governance")}><ShieldCheck size={15} /></Button>}
      {props.canWrite && <Button className="knowledge-toolbar-icon" data-tooltip="复制页面" aria-label="复制页面" title="复制页面" onClick={props.onCopy}><Copy size={15} /></Button>}
      {props.canWrite && <Button className="knowledge-toolbar-icon" data-tooltip={props.archived ? "恢复页面" : "归档页面"} aria-label={props.archived ? "恢复页面" : "归档页面"} title={props.archived ? "恢复页面" : "归档页面"} onClick={props.onArchive}>{props.archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}</Button>}
    </div>
  </div>;
}
