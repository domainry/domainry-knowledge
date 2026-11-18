import type { KnowledgeAccessMemberInput, KnowledgeAccessOrganizationInput } from "./KnowledgeAccessSelector.tsx";
import type { KnowledgeClient } from "./types.ts";
export type KnowledgeLibraryCreateMemberInput = KnowledgeAccessMemberInput;
export type KnowledgeLibraryCreateOrganizationInput = KnowledgeAccessOrganizationInput;
export type KnowledgeLibraryCreateInput = {
    name: string;
    description: string;
    members: KnowledgeLibraryCreateMemberInput[];
    organizations: KnowledgeLibraryCreateOrganizationInput[];
};
export declare function KnowledgeLibraryCreateDialog({ client, busy, error, onClose, onCreate }: {
    client: KnowledgeClient;
    busy: boolean;
    error?: string;
    onClose(): void;
    onCreate(input: KnowledgeLibraryCreateInput): void;
}): import("react").ReactPortal;
