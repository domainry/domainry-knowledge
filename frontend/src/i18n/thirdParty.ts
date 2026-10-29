import {
  AG_GRID_LOCALE_BR,
  AG_GRID_LOCALE_CN,
  AG_GRID_LOCALE_DE,
  AG_GRID_LOCALE_EG,
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_ES,
  AG_GRID_LOCALE_FR,
  AG_GRID_LOCALE_IT,
  AG_GRID_LOCALE_JP,
  AG_GRID_LOCALE_KR,
  AG_GRID_LOCALE_TR,
  AG_GRID_LOCALE_TW,
} from "@ag-grid-community/locale";
import type { KnowledgeHostLocale } from "../hostIntegration.ts";

export const blockNoteLocaleKey: Record<KnowledgeHostLocale, "en" | "zh" | "zhTW" | "ja" | "ko" | "es" | "pt" | "fr" | "de" | "it" | "ar"> = {
  en: "en", "zh-CN": "zh", "zh-TW": "zhTW", ja: "ja", ko: "ko", es: "es",
  pt: "pt", fr: "fr", de: "de", it: "it", tr: "en", ar: "ar",
};

export const multiColumnLocaleKey: Record<KnowledgeHostLocale, "en" | "zh" | "ja" | "ko" | "es" | "pt" | "fr" | "de" | "ar"> = {
  en: "en", "zh-CN": "zh", "zh-TW": "zh", ja: "ja", ko: "ko", es: "es",
  pt: "pt", fr: "fr", de: "de", it: "en", tr: "en", ar: "ar",
};

export const mindElixirLocaleKey: Record<KnowledgeHostLocale, "en" | "zh_CN" | "zh_TW" | "ja" | "ko" | "es" | "pt" | "fr" | "de" | "it"> = {
  en: "en", "zh-CN": "zh_CN", "zh-TW": "zh_TW", ja: "ja", ko: "ko", es: "es",
  pt: "pt", fr: "fr", de: "de", it: "it", tr: "en", ar: "en",
};

export const univerLocaleKey: Record<KnowledgeHostLocale, "en-US" | "zh-CN" | "zh-TW" | "ja-JP" | "ko-KR" | "es-ES" | "pt-BR" | "fr-FR" | "de-DE" | "it-IT" | "ar-SA"> = {
  en: "en-US", "zh-CN": "zh-CN", "zh-TW": "zh-TW", ja: "ja-JP", ko: "ko-KR", es: "es-ES",
  pt: "pt-BR", fr: "fr-FR", de: "de-DE", it: "it-IT", tr: "en-US", ar: "ar-SA",
};

export const agGridLocaleText = {
  en: AG_GRID_LOCALE_EN,
  "zh-CN": AG_GRID_LOCALE_CN,
  "zh-TW": AG_GRID_LOCALE_TW,
  ja: AG_GRID_LOCALE_JP,
  ko: AG_GRID_LOCALE_KR,
  es: AG_GRID_LOCALE_ES,
  pt: AG_GRID_LOCALE_BR,
  fr: AG_GRID_LOCALE_FR,
  de: AG_GRID_LOCALE_DE,
  it: AG_GRID_LOCALE_IT,
  tr: AG_GRID_LOCALE_TR,
  ar: AG_GRID_LOCALE_EG,
} satisfies Record<KnowledgeHostLocale, typeof AG_GRID_LOCALE_EN>;
