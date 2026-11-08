import type { KnowledgeLibrary } from "./types.ts";

export function canTransferPageToLibrary(library: KnowledgeLibrary, sourceLibraryID: string) {
  return library.id !== sourceLibraryID && library.kind === "shared" && library.role === "manager" && !library.archived;
}
