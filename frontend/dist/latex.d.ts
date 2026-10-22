export type SafeLatexResult = {
    html?: string;
    error?: string;
};
export declare function renderSafeLatex(source: string, displayMode: boolean): SafeLatexResult;
