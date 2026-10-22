import { filterSuggestionItems } from "@blocknote/core";
import type { DefaultReactSuggestionItem } from "@blocknote/react";

export type KnowledgeSlashMenuItem = DefaultReactSuggestionItem & {
  id: string;
  submenu?: string;
  disabledReason?: string;
  recent?: boolean;
};

const recentStorageKey = "domainry.knowledge.slash-recent.v1";
const recentLimit = 6;

export function normalizeKnowledgeSlashRecentIDs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && /^[a-z][a-z0-9:_-]{1,95}$/i.test(item)))].slice(0, recentLimit);
}

export function readKnowledgeSlashRecentIDs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return normalizeKnowledgeSlashRecentIDs(JSON.parse(window.localStorage.getItem(recentStorageKey) || "[]"));
  } catch {
    return [];
  }
}

export function recordKnowledgeSlashRecentID(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(recentStorageKey, JSON.stringify(normalizeKnowledgeSlashRecentIDs([id, ...readKnowledgeSlashRecentIDs()])));
  } catch {
    // Recent choices are a local convenience only; storage denial must never
    // block insertion or become document state.
  }
}

export function arrangeKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[], query: string, recentIDs = readKnowledgeSlashRecentIDs()): KnowledgeSlashMenuItem[] {
  const unique = [...new Map(items.map(item => [item.id, item])).values()];
  const normalizedQuery = query.trim();
  if (normalizedQuery) {
    return filterSuggestionItems(unique, normalizedQuery).map(item => ({ ...item, group: "搜索结果", submenu: undefined, recent: false }));
  }
  const byID = new Map(unique.map(item => [item.id, item]));
  const recent = normalizeKnowledgeSlashRecentIDs(recentIDs).flatMap(id => {
    const item = byID.get(id);
    return item ? [{ ...item, group: "最近使用", submenu: undefined, recent: true }] : [];
  });
  return [...recent, ...unique];
}

