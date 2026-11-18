import type { OfficeResult } from "./office-types.ts";
export declare function loadOffice(blob: Blob, kind: "docx" | "xlsx", signal: AbortSignal): Promise<OfficeResult>;
