import type { Messages } from "@lingui/core";
import type { KnowledgeHostLocale } from "../hostIntegration.ts";
import { messages as arabicMessages } from "../locales/ar/messages.ts";
import { messages as germanMessages } from "../locales/de/messages.ts";
import { messages as englishMessages } from "../locales/en/messages.ts";
import { messages as spanishMessages } from "../locales/es/messages.ts";
import { messages as frenchMessages } from "../locales/fr/messages.ts";
import { messages as italianMessages } from "../locales/it/messages.ts";
import { messages as japaneseMessages } from "../locales/ja/messages.ts";
import { messages as koreanMessages } from "../locales/ko/messages.ts";
import { messages as portugueseMessages } from "../locales/pt/messages.ts";
import { messages as turkishMessages } from "../locales/tr/messages.ts";
import { messages as simplifiedChineseMessages } from "../locales/zh-CN/messages.ts";
import { messages as traditionalChineseMessages } from "../locales/zh-TW/messages.ts";

// Lingui's production runtime deliberately does not compile raw ICU strings.
// Keep every runtime catalog on the output of `lingui compile` so placeholders,
// plurals, and selects behave identically in tests and production bundles.
export const knowledgeCompiledCatalogs = {
	en: englishMessages,
	"zh-CN": simplifiedChineseMessages,
	"zh-TW": traditionalChineseMessages,
	ja: japaneseMessages,
	ko: koreanMessages,
	es: spanishMessages,
	pt: portugueseMessages,
	fr: frenchMessages,
	de: germanMessages,
	it: italianMessages,
	tr: turkishMessages,
	ar: arabicMessages,
} satisfies Record<KnowledgeHostLocale, Messages>;
