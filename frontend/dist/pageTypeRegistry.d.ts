import type { KnowledgePageContentType } from "./types.ts";
export declare const pageTypeMeta: Record<KnowledgePageContentType, {
    label: string;
    description: string;
    title: string;
}>;
export declare const nativePageTypes: KnowledgePageContentType[];
export declare function emptySpreadsheet(): {
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
export declare function initialPageContent(type: KnowledgePageContentType): string;
