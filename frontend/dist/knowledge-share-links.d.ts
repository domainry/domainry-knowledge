export declare function createKnowledgePageShareLink(base: string | URL, shareID: string, pageID: string): string;
export declare function parseKnowledgePageShareLocation(value: string | URL): {
    shareID: string;
    pageID: string;
} | null;
