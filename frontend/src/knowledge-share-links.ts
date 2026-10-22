const shareIDPattern = /^kshare_[A-Za-z0-9_-]{32}$/;
const pageIDPattern = /^kpage_[A-Za-z0-9_-]{32}$/;

export function createKnowledgePageShareLink(base: string | URL, shareID: string, pageID: string) {
  if (!shareIDPattern.test(shareID) || !pageIDPattern.test(pageID)) throw Error("Knowledge page share identifiers are invalid");
  const url = base instanceof URL ? new URL(base.href) : new URL(base);
  for (const key of ["knowledge_library", "knowledge_kind", "knowledge_block", "knowledge_mode"]) url.searchParams.delete(key);
  url.searchParams.set("knowledge_share", shareID);
  url.searchParams.set("knowledge_page", pageID);
  return url.href;
}

export function parseKnowledgePageShareLocation(value: string | URL) {
  const url = value instanceof URL ? value : new URL(value, "http://knowledge.local");
  const shareID = url.searchParams.get("knowledge_share") || "";
  const pageID = url.searchParams.get("knowledge_page") || "";
  return shareIDPattern.test(shareID) && pageIDPattern.test(pageID) ? { shareID, pageID } : null;
}
