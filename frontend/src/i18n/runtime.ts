import { setupI18n, type Messages } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { createContext, createElement, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { KnowledgeHostLocale } from "../hostIntegration.ts";
import { knowledgeCompiledCatalogs } from "./compiledCatalogs.ts";
import { knowledgeEnglishMessages, type KnowledgeMessageID } from "./messages.generated.ts";

export const KNOWLEDGE_LOCALES = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "fr", "de", "it", "tr", "ar"] as const satisfies readonly KnowledgeHostLocale[];
const localeSet = new Set<string>(KNOWLEDGE_LOCALES);

const englishMessages = knowledgeCompiledCatalogs.en;
const runtimeCatalogs = Object.fromEntries(KNOWLEDGE_LOCALES.map(locale => [
  locale,
  locale === "en" ? englishMessages : { ...englishMessages, ...knowledgeCompiledCatalogs[locale] },
])) as Record<KnowledgeHostLocale, Messages>;

export const knowledgeI18n = setupI18n({
  locale: "en",
  messages: { en: englishMessages },
  missing: (_locale, id) => String(knowledgeEnglishMessages[id as KnowledgeMessageID] || id),
});

const KnowledgeLocaleContext = createContext<KnowledgeHostLocale>("en");
const activeBodyLocales = new Map<number, KnowledgeHostLocale>();
let nextLocaleOwner = 0;
let originalBodyLocale: { lang: string | null; dir: string | null } | undefined;

function syncBodyLocale() {
  if (typeof document === "undefined") return;
  const locales = [...activeBodyLocales.values()];
  const current = locales[locales.length - 1];
  if (current) {
    document.body.lang = current;
    document.body.dir = knowledgeDirection(current);
  } else if (originalBodyLocale) {
    if (originalBodyLocale.lang === null) document.body.removeAttribute("lang");
    else document.body.setAttribute("lang", originalBodyLocale.lang);
    if (originalBodyLocale.dir === null) document.body.removeAttribute("dir");
    else document.body.setAttribute("dir", originalBodyLocale.dir);
  }
}

export function normalizeKnowledgeLocale(value?: string | null): KnowledgeHostLocale {
  if (value && localeSet.has(value)) return value as KnowledgeHostLocale;
  const normalized = String(value || "").replaceAll("_", "-");
  if (/^zh-(?:TW|HK|MO)/i.test(normalized)) return "zh-TW";
  if (/^zh/i.test(normalized)) return "zh-CN";
  const language = normalized.split("-")[0].toLowerCase();
  return localeSet.has(language) ? language as KnowledgeHostLocale : "en";
}

export function browserKnowledgeLocale(): KnowledgeHostLocale {
  if (typeof navigator === "undefined") return "en";
  for (const value of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const locale = normalizeKnowledgeLocale(value);
    if (locale !== "en" || /^en(?:-|$)/i.test(value)) return locale;
  }
  return "en";
}

export function knowledgeDirection(locale: KnowledgeHostLocale) {
  return locale === "ar" ? "rtl" as const : "ltr" as const;
}

export function activateKnowledgeLocale(locale: KnowledgeHostLocale) {
  knowledgeI18n.load(locale, runtimeCatalogs[locale]);
  if (knowledgeI18n.locale !== locale) knowledgeI18n.activate(locale);
}

export function KnowledgeI18nProvider({ locale, children }: { locale: KnowledgeHostLocale; children: ReactNode }) {
  const owner = useRef(0);
  if (!owner.current) owner.current = ++nextLocaleOwner;
  activateKnowledgeLocale(locale);
  useEffect(() => {
    if (activeBodyLocales.size === 0 && typeof document !== "undefined") {
      originalBodyLocale = { lang: document.body.getAttribute("lang"), dir: document.body.getAttribute("dir") };
    }
    activeBodyLocales.set(owner.current, locale);
    syncBodyLocale();
    return () => {
      activeBodyLocales.delete(owner.current);
      syncBodyLocale();
      if (activeBodyLocales.size === 0) originalBodyLocale = undefined;
    };
  }, [locale]);
  return createElement(KnowledgeLocaleContext.Provider, { value: locale }, createElement(I18nProvider, { i18n: knowledgeI18n }, children));
}

export function useKnowledgeLocale() {
  return useContext(KnowledgeLocaleContext);
}

export function kt(id: KnowledgeMessageID): string {
  return knowledgeI18n._({ id, message: knowledgeEnglishMessages[id] });
}

export function ktf(id: KnowledgeMessageID, values: Record<string, unknown>): string {
  return knowledgeI18n._({ id, message: knowledgeEnglishMessages[id], values });
}

export function formatKnowledgeDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(knowledgeI18n.locale || "en", options ?? { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function formatKnowledgeNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(knowledgeI18n.locale || "en", options).format(value);
}
