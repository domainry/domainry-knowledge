export type KnowledgeDeepLink = {
  libraryID: string;
  libraryKind: "personal" | "shared";
  pageID: string;
  blockID?: string;
  mode: "read" | "edit";
};

const libraryIDPattern = /^klib_[a-f0-9]{32}$/;
const pageIDPattern = /^kpage_[a-f0-9]{32}$/;
const blockIDPattern = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/;

export function parseKnowledgeDeepLink(input: string | URL): KnowledgeDeepLink | null {
  const url = input instanceof URL ? input : new URL(input, "http://knowledge.local");
  const libraryID = url.searchParams.get("knowledge_library") || "";
  const libraryKind = url.searchParams.get("knowledge_kind");
  const pageID = url.searchParams.get("knowledge_page") || "";
  const blockID = url.searchParams.get("knowledge_block") || undefined;
  const mode = url.searchParams.get("knowledge_mode") === "edit" ? "edit" : "read";
  if (!libraryIDPattern.test(libraryID) || !pageIDPattern.test(pageID) || libraryKind !== "personal" && libraryKind !== "shared") return null;
  if (blockID && !blockIDPattern.test(blockID)) return null;
  return { libraryID, libraryKind, pageID, blockID, mode };
}

export function createKnowledgeBlockLink(baseURL: string | URL, link: Omit<KnowledgeDeepLink, "blockID">, blockID: string) {
  if (!libraryIDPattern.test(link.libraryID) || !pageIDPattern.test(link.pageID) || !blockIDPattern.test(blockID)) throw new Error("Knowledge block link identifiers are invalid");
  const url = baseURL instanceof URL ? new URL(baseURL.href) : new URL(baseURL);
  url.searchParams.set("knowledge_library", link.libraryID);
  url.searchParams.set("knowledge_kind", link.libraryKind);
  url.searchParams.set("knowledge_page", link.pageID);
  url.searchParams.set("knowledge_block", blockID);
  url.searchParams.set("knowledge_mode", link.mode);
  return url.href;
}

export function createKnowledgePageLink(baseURL: string | URL, link: Omit<KnowledgeDeepLink, "blockID">) {
  if (!libraryIDPattern.test(link.libraryID) || !pageIDPattern.test(link.pageID)) throw new Error("Knowledge page link identifiers are invalid");
  const url = baseURL instanceof URL ? new URL(baseURL.href) : new URL(baseURL);
  url.searchParams.set("knowledge_library", link.libraryID);
  url.searchParams.set("knowledge_kind", link.libraryKind);
  url.searchParams.set("knowledge_page", link.pageID);
  url.searchParams.delete("knowledge_block");
  url.searchParams.set("knowledge_mode", link.mode);
  return url.href;
}
