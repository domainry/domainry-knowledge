import type { KnowledgePrincipal } from "../types.ts";
export type MentionComposerProps = {
    value: string;
    mentionedUserIDs: string[];
    onChange(value: string): void;
    onMentionedUserIDsChange(userIDs: string[]): void;
    searchMembers(query: string, signal: AbortSignal): Promise<KnowledgePrincipal[]>;
    onMemberResolved?(member: KnowledgePrincipal): void;
    onSubmit(): void;
    placeholder: string;
    ariaLabel: string;
    submitLabel: string;
    submittingLabel?: string;
    submitting?: boolean;
    submitDisabled?: boolean;
    hint?: string;
    maxLength?: number;
    focusRequest?: number;
    className?: string;
};
export declare function MentionComposer({ value, mentionedUserIDs, onChange, onMentionedUserIDsChange, searchMembers, onMemberResolved, onSubmit, placeholder, ariaLabel, submitLabel, submittingLabel, submitting, submitDisabled, hint, maxLength, focusRequest, className, }: MentionComposerProps): import("react").JSX.Element;
export declare function ComposerContent({ value, className }: {
    value: string;
    className?: string;
}): import("react").JSX.Element;
