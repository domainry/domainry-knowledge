import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { KnowledgePageContentType } from "./types.ts";
import type { KnowledgeEditorProps } from "./editors/types.ts";
export declare const pageTypeCapability: {
    readonly create: number;
    readonly edit: number;
    readonly read: number;
    readonly preview: number;
    readonly import: number;
    readonly realtime: number;
    readonly search: number;
    readonly comment: number;
    readonly version: number;
};
export type PageTypeImporter = {
    kind: "document-upload";
    accept: "library-policy";
};
export type PageTypeDefinition = {
    id: KnowledgePageContentType;
    label: string;
    description: string;
    defaultTitle: string;
    icon: LucideIcon;
    capabilities: number;
    createAction: {
        kind: "native";
    } | null;
    createContent: (() => string) | null;
    editor: ComponentType<KnowledgeEditorProps>;
    readonlyRenderer: ComponentType<KnowledgeEditorProps>;
    previewRenderer: ComponentType<KnowledgeEditorProps>;
    importer: PageTypeImporter | null;
    trusted: true;
};
export declare function emptySpreadsheet(): {
    schema_version: number;
    workbook: {
        id: string;
        name: string;
        appVersion: string;
        locale: string;
        dateSystem: string;
        styles: {};
        sheetOrder: string[];
        sheets: {
            "sheet-1": {
                id: string;
                name: string;
                tabColor: string;
                hidden: number;
                rowCount: number;
                columnCount: number;
                zoomRatio: number;
                freeze: {
                    xSplit: number;
                    ySplit: number;
                    startRow: number;
                    startColumn: number;
                };
                scrollTop: number;
                scrollLeft: number;
                defaultColumnWidth: number;
                defaultRowHeight: number;
                mergeData: never[];
                cellData: {};
                rowData: {};
                columnData: {};
                showGridlines: number;
                rowHeader: {
                    width: number;
                    hidden: number;
                };
                columnHeader: {
                    height: number;
                    hidden: number;
                };
                rightToLeft: number;
            };
        };
        resources: never[];
    };
    charts: never[];
    pivots: never[];
    protected_ranges: never[];
};
export declare function validatePageTypeDefinitions(items?: readonly PageTypeDefinition[]): boolean;
export declare const pageTypeDefinitions: readonly PageTypeDefinition[];
export declare const pageTypeRegistry: Readonly<Record<KnowledgePageContentType, PageTypeDefinition>>;
export declare const nativePageTypes: readonly KnowledgePageContentType[];
export declare const importPageTypes: readonly PageTypeDefinition[];
export declare const pageTypeMeta: Readonly<Record<KnowledgePageContentType, {
    label: string;
    description: string;
    title: string;
}>>;
export declare function getPageTypeDefinition(type: KnowledgePageContentType): PageTypeDefinition;
export declare function PageTypeIcon({ type, size }: {
    type: KnowledgePageContentType;
    size?: number;
}): import("react").FunctionComponentElement<Omit<import("lucide-react").LucideProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
export declare function initialPageContent(type: KnowledgePageContentType): string;
