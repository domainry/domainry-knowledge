import katex from "katex";

export type SafeLatexResult = {
  html?: string;
  error?: string;
};

export function renderSafeLatex(source: string, displayMode: boolean): SafeLatexResult {
  if (!source.trim()) return {};
  try {
    return {
      html: katex.renderToString(source, {
        displayMode,
        output: "htmlAndMathml",
        throwOnError: true,
        strict: "error",
        trust: false,
        maxExpand: 1000,
        maxSize: 20,
      }),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "公式语法无效" };
  }
}
