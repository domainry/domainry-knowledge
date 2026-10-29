import type { ReactNode } from "react";
import type { KnowledgeHostLocale } from "../hostIntegration.ts";
import { type KnowledgeMessageID } from "./messages.generated.ts";
export declare const KNOWLEDGE_LOCALES: readonly ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "fr", "de", "it", "tr", "ar"];
export declare const knowledgeI18n: import("@lingui/core").I18n;
export declare function normalizeKnowledgeLocale(value?: string | null): KnowledgeHostLocale;
export declare function browserKnowledgeLocale(): KnowledgeHostLocale;
export declare function knowledgeDirection(locale: KnowledgeHostLocale): "ltr" | "rtl";
export declare function activateKnowledgeLocale(locale: KnowledgeHostLocale): void;
export declare function KnowledgeI18nProvider({ locale, children }: {
    locale: KnowledgeHostLocale;
    children: ReactNode;
}): import("react").FunctionComponentElement<import("react").ProviderProps<"en" | "zh-CN" | "zh-TW" | "ja" | "ko" | "es" | "pt" | "fr" | "de" | "it" | "tr" | "ar">>;
export declare function useKnowledgeLocale(): "en" | "zh-CN" | "zh-TW" | "ja" | "ko" | "es" | "pt" | "fr" | "de" | "it" | "tr" | "ar";
export declare function kt(id: KnowledgeMessageID): string;
export declare function ktf(id: KnowledgeMessageID, values: Record<string, unknown>): string;
export declare function formatKnowledgeDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string;
export declare function formatKnowledgeNumber(value: number, options?: Intl.NumberFormatOptions): string;
