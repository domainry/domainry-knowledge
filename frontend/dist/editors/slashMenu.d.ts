import type { DefaultReactSuggestionItem } from "@blocknote/react";
export type KnowledgeSlashMenuItem = DefaultReactSuggestionItem & {
    id: string;
    submenu?: string;
    disabledReason?: string;
    recent?: boolean;
};
export declare function normalizeKnowledgeSlashRecentIDs(value: unknown): string[];
export declare function readKnowledgeSlashRecentIDs(): string[];
export declare function recordKnowledgeSlashRecentID(id: string): void;
export declare function arrangeKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[], query: string, recentIDs?: string[]): KnowledgeSlashMenuItem[];
