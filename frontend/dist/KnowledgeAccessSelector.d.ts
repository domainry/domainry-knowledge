import type { KnowledgeClient, KnowledgeDirectoryMember, KnowledgeDirectoryOrganization, KnowledgeLibraryMember } from "./types.ts";
export type KnowledgeAccessTab = "members" | "organizations";
export type KnowledgeAccessMemberInput = {
    principal: KnowledgeDirectoryMember;
    role: KnowledgeLibraryMember["role"];
};
export type KnowledgeAccessOrganizationInput = {
    organization: KnowledgeDirectoryOrganization;
    role: KnowledgeLibraryMember["role"];
};
export declare function KnowledgeAccessTabs({ value, onChange, disabled }: {
    value: KnowledgeAccessTab;
    onChange(value: KnowledgeAccessTab): void;
    disabled?: boolean;
}): import("react").JSX.Element;
export declare function KnowledgeAccessSelector({ client, activeTab, busy, members, organizations, onMembersChange, onOrganizationsChange, defaultRole }: {
    client: KnowledgeClient;
    activeTab: KnowledgeAccessTab;
    busy: boolean;
    members: KnowledgeAccessMemberInput[];
    organizations: KnowledgeAccessOrganizationInput[];
    onMembersChange(value: KnowledgeAccessMemberInput[]): void;
    onOrganizationsChange(value: KnowledgeAccessOrganizationInput[]): void;
    defaultRole?: KnowledgeLibraryMember["role"];
}): import("react").JSX.Element;
