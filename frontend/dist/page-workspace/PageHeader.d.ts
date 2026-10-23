import type { ReactNode } from "react";
import type { KnowledgePageContentGovernance } from "../types.ts";
export type PageHeaderProps = {
    editing: boolean;
    breadcrumbs: {
        page_id: string;
        title: string;
    }[];
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
export declare function PageHeader(props: PageHeaderProps): import("react").JSX.Element;
