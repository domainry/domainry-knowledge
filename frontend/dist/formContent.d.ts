import type { KnowledgeFormComponent, KnowledgeFormComponentType, KnowledgeFormContent, KnowledgeFormSettings } from "./types.ts";
export declare const defaultFormSettings: KnowledgeFormSettings;
export declare function emptyFormContent(): KnowledgeFormContent;
export declare const formComponentTypes: readonly KnowledgeFormComponentType[];
export declare function normalizeFormContent(value: unknown): KnowledgeFormContent;
export declare function parseFormContent(body: string): KnowledgeFormContent;
export declare function formioSchema(content: KnowledgeFormContent): {
    display: string;
    components: (KnowledgeFormComponent | {
        type: string;
        key: string;
        label: string;
        input: boolean;
        hidden: boolean;
        validate: {
            required: boolean;
        };
    } | {
        type: string;
        inline: boolean;
        values: {
            label: string;
            value: string;
        }[];
        key: string;
        label: string;
        description?: string;
        placeholder?: string;
        input: true;
        validate: {
            required: boolean;
            minLength?: number;
            maxLength?: number;
            min?: number;
            max?: number;
        };
        data?: {
            values: import("./types.ts").KnowledgeFormOption[];
        };
        multiple?: true;
        currency?: "CNY" | "USD" | "EUR" | "JPY";
        inputMask?: "";
        maxFiles?: number;
        conditional?: {
            show: boolean;
            when: string;
            eq: string | number | boolean;
        };
        hidden?: undefined;
    })[];
};
export declare function canonicalFormFromBuilder(schema: unknown, settings: KnowledgeFormSettings): KnowledgeFormContent;
export declare function formSubmissionAnswers(value: unknown, components?: KnowledgeFormComponent[]): {
    [k: string]: unknown;
};
