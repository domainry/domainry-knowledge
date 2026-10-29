import { kt } from "../i18n/runtime.ts";
import type { ReactNode } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { Button } from "../components.tsx";
import { KnowledgeClassificationBadge } from "../KnowledgePageGovernance.tsx";
import type { KnowledgePageContentGovernance } from "../types.ts";

export type PageHeaderProps = {
  editing: boolean;
  breadcrumbs: { page_id: string; title: string }[];
  title: ReactNode;
  governance?: KnowledgePageContentGovernance;
  versionSummary: string;
  metadataSummary?: ReactNode;
  presence?: ReactNode;
  actionHostRef?: (element: HTMLDivElement | null) => void;
  canEdit: boolean;
  onNavigate(pageID: string): void;
  onEdit(): void;
};

export function PageHeader(props: PageHeaderProps) {
  return <header className={`knowledge-page-title${props.editing ? " is-editing" : ""}`}>
    <div className="knowledge-page-heading">
      <div className="knowledge-page-heading-line">
        {props.breadcrumbs.length > 1 && <nav className="knowledge-page-parent-path" aria-label={kt("knowledge.auto.87566a0e087205b8")}>{props.breadcrumbs.slice(0, -1).map((item, index) => <span key={item.page_id}>{index > 0 && <ChevronRight size={11} aria-hidden="true" />}<button onClick={() => props.onNavigate(item.page_id)}>{item.title}</button></span>)}</nav>}
        {props.title}
        <KnowledgeClassificationBadge governance={props.governance} />
      </div>
      <div className="knowledge-page-meta-line"><span className="knowledge-page-version-summary">{props.versionSummary}</span>{props.metadataSummary}</div>
    </div>
    <div className="knowledge-page-heading-actions">
      {props.presence}
      {props.actionHostRef && <div ref={props.actionHostRef} className="knowledge-page-header-actions-slot" aria-label={kt("knowledge.auto.56c1660c36f47844")} />}
      {!props.editing && props.canEdit && <Button className="primary knowledge-page-header-action" onClick={props.onEdit}><Pencil size={14} />{kt("knowledge.auto.051836569928a9f9")}</Button>}
    </div>
  </header>;
}
