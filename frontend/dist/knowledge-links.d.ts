export type KnowledgeDeepLink = {
    libraryID: string;
    libraryKind: "personal" | "shared";
    pageID: string;
    blockID?: string;
    mode: "read" | "edit";
};
export declare function parseKnowledgeDeepLink(input: string | URL): KnowledgeDeepLink | null;
export declare function createKnowledgeBlockLink(baseURL: string | URL, link: Omit<KnowledgeDeepLink, "blockID">, blockID: string): string;
export declare function createKnowledgePageLink(baseURL: string | URL, link: Omit<KnowledgeDeepLink, "blockID">): string;
