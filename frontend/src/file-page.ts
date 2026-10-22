export type KnowledgeFilePageContent = {
  document_id: string;
  display_mode: "preview" | "card";
  title: string;
};

export function filePageContent(documentID: string, title: string): string {
  return JSON.stringify({ document_id: documentID, display_mode: "preview", title } satisfies KnowledgeFilePageContent);
}

export function parseFilePageContent(raw: string): KnowledgeFilePageContent | null {
  try {
    const value = JSON.parse(raw) as Partial<KnowledgeFilePageContent>;
    return /^kdoc_[a-zA-Z0-9]{32}$/.test(value.document_id || "") && (value.display_mode === "preview" || value.display_mode === "card") && typeof value.title === "string" && value.title.trim().length > 0
      ? value as KnowledgeFilePageContent
      : null;
  } catch {
    return null;
  }
}
