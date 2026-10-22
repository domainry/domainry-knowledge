export type KnowledgeFilePageContent = {
    document_id: string;
    display_mode: "preview" | "card";
    title: string;
};
export declare function filePageContent(documentID: string, title: string): string;
export declare function parseFilePageContent(raw: string): KnowledgeFilePageContent | null;
