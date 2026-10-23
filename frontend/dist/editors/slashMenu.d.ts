import type { DefaultReactSuggestionItem } from "@blocknote/react";
export type KnowledgeSlashMenuItem = DefaultReactSuggestionItem & {
    id: string;
    submenu?: string;
    disabledReason?: string;
    recent?: boolean;
    filePicker?: {
        blockType: "image" | "video" | "audio" | "file";
        accept: string;
    };
    formulaInput?: {
        displayMode: "block" | "inline";
    };
};
export type KnowledgeSlashMenuEntry = {
    kind: "item";
    item: KnowledgeSlashMenuItem;
    index: number;
} | {
    kind: "submenu";
    label: string;
    items: {
        item: KnowledgeSlashMenuItem;
        index: number;
    }[];
};
export type KnowledgeSlashMenuGroup = {
    label: string;
    entries: KnowledgeSlashMenuEntry[];
};
export declare function normalizeKnowledgeSlashRecentIDs(value: unknown): string[];
export declare function readKnowledgeSlashRecentIDs(): string[];
export declare function recordKnowledgeSlashRecentID(id: string): void;
export declare function groupKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[]): KnowledgeSlashMenuGroup[];
export declare function arrangeKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[], query: string, recentIDs?: string[]): KnowledgeSlashMenuItem[];
