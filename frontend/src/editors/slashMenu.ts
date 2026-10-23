import { filterSuggestionItems } from "@blocknote/core";
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
  formulaInput?: { displayMode: "block" | "inline" };
};

export type KnowledgeSlashMenuEntry =
  | { kind: "item"; item: KnowledgeSlashMenuItem; index: number }
  | { kind: "submenu"; label: string; items: { item: KnowledgeSlashMenuItem; index: number }[] };

export type KnowledgeSlashMenuGroup = { label: string; entries: KnowledgeSlashMenuEntry[] };

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

export function groupKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[]): KnowledgeSlashMenuGroup[] {
  const groups = new Map<string, KnowledgeSlashMenuGroup>();
  const submenus = new Map<string, Extract<KnowledgeSlashMenuEntry, { kind: "submenu" }>>();
  const groupFor = (label: string) => {
    const existing = groups.get(label);
    if (existing) return existing;
    const group = { label, entries: [] } satisfies KnowledgeSlashMenuGroup;
    groups.set(label, group);
    return group;
  };

  items.forEach((item, index) => {
    const groupLabel = item.group || "其他";
    if (!item.submenu) {
      groupFor(groupLabel).entries.push({ kind: "item", item, index });
      return;
    }
    const existing = submenus.get(item.submenu);
    if (existing) {
      existing.items.push({ item, index });
      return;
    }
    const submenu = { kind: "submenu", label: item.submenu, items: [{ item, index }] } satisfies Extract<KnowledgeSlashMenuEntry, { kind: "submenu" }>;
    submenus.set(item.submenu, submenu);
    groupFor(groupLabel).entries.push(submenu);
  });

  return [...groups.values()];
}

export function arrangeKnowledgeSlashMenuItems(items: readonly KnowledgeSlashMenuItem[], query: string, recentIDs = readKnowledgeSlashRecentIDs()): KnowledgeSlashMenuItem[] {
  const unique = [...new Map(items.map(item => [item.id, item])).values()];
  const normalizedQuery = query.trim();
  if (normalizedQuery) {
    return filterSuggestionItems(unique, normalizedQuery).map(item => ({ ...item, group: "搜索结果", submenu: undefined, recent: false }));
  }
  const byID = new Map(unique.map(item => [item.id, item]));
  const presentRecentIDs = normalizeKnowledgeSlashRecentIDs(recentIDs).filter(id => byID.has(id));
  const recent = presentRecentIDs.flatMap(id => {
    const item = byID.get(id);
    return item ? [{ ...item, group: "最近使用", submenu: undefined, recent: true }] : [];
  });
  const recentIDSet = new Set(presentRecentIDs);
  return [...recent, ...unique.filter(item => !recentIDSet.has(item.id))];
}

