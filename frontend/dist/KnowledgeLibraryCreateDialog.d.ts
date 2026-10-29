import type { KnowledgeClient, KnowledgeDirectoryMember, KnowledgeDirectoryOrganization, KnowledgeLibraryMember } from "./types.ts";
export type KnowledgeLibraryCreateMemberInput = {
    principal: KnowledgeDirectoryMember;
    role: KnowledgeLibraryMember["role"];
};
export type KnowledgeLibraryCreateOrganizationInput = {
    organization: KnowledgeDirectoryOrganization;
    role: KnowledgeLibraryMember["role"];
};
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
