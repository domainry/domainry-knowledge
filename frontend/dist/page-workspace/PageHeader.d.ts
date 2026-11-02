import type { ReactNode } from "react";
import type { KnowledgePageContentGovernance } from "../types.ts";
export type PageHeaderProps = {
    editing: boolean;
    title: ReactNode;
    governance?: KnowledgePageContentGovernance;
    versionSummary: string;
    projectionStatus?: ReactNode;
    metadataSummary?: ReactNode;
    presence?: ReactNode;
    actionHostRef?: (element: HTMLDivElement | null) => void;
    canEdit: boolean;
    onEdit(): void;
};
export declare function PageHeader(props: PageHeaderProps): import("react").JSX.Element;
