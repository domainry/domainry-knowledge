import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-json";

export default defineConfig({
  sourceLocale: "en",
  fallbackLocales: { default: "en" },
  locales: ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "fr", "de", "it", "tr", "ar"],
  catalogs: [{ path: "src/locales/{locale}/messages", include: ["src"] }],
  format: formatter({ style: "minimal" }),
  compileNamespace: "es",
});
