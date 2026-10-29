import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type KnowledgeTheme = "light" | "dark" | "system";
export type ResolvedKnowledgeTheme = Exclude<KnowledgeTheme, "system">;

const KnowledgeThemeContext = createContext<ResolvedKnowledgeTheme>("light");
const activeBodyThemes = new Map<number, ResolvedKnowledgeTheme>();
let nextThemeOwner = 0;
let originalBodyTheme: string | undefined;

function systemTheme(): ResolvedKnowledgeTheme {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useResolvedKnowledgeTheme(theme: KnowledgeTheme): ResolvedKnowledgeTheme {
  const [resolved, setResolved] = useState<ResolvedKnowledgeTheme>(() => theme === "system" ? systemTheme() : theme);
  useEffect(() => {
    if (theme !== "system") { setResolved(theme); return; }
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolved(query.matches ? "dark" : "light");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [theme]);
  return resolved;
}

function syncBodyTheme() {
  if (typeof document === "undefined") return;
  const themes = [...activeBodyThemes.values()];
  const current = themes[themes.length - 1];
  if (current) document.body.dataset.knowledgeTheme = current;
  else if (originalBodyTheme === undefined) delete document.body.dataset.knowledgeTheme;
  else document.body.dataset.knowledgeTheme = originalBodyTheme;
}

export function KnowledgeThemeProvider({ theme, children }: { theme: ResolvedKnowledgeTheme; children: ReactNode }) {
  const owner = useRef(0);
  if (!owner.current) owner.current = ++nextThemeOwner;
  useEffect(() => {
    if (activeBodyThemes.size === 0 && typeof document !== "undefined") originalBodyTheme = document.body.dataset.knowledgeTheme;
    activeBodyThemes.set(owner.current, theme);
    syncBodyTheme();
    return () => {
      activeBodyThemes.delete(owner.current);
      syncBodyTheme();
      if (activeBodyThemes.size === 0) originalBodyTheme = undefined;
    };
  }, [theme]);
  return <KnowledgeThemeContext.Provider value={theme}>{children}</KnowledgeThemeContext.Provider>;
}

export function useKnowledgeTheme() {
  return useContext(KnowledgeThemeContext);
}
