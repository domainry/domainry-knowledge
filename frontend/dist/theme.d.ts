import type { ReactNode } from "react";
export type KnowledgeTheme = "light" | "dark" | "system";
export type ResolvedKnowledgeTheme = Exclude<KnowledgeTheme, "system">;
export declare function useResolvedKnowledgeTheme(theme: KnowledgeTheme): ResolvedKnowledgeTheme;
export declare function KnowledgeThemeProvider({ theme, children }: {
    theme: ResolvedKnowledgeTheme;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useKnowledgeTheme(): ResolvedKnowledgeTheme;
