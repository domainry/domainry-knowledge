import type { KnowledgeClient, KnowledgeLibrary } from "./types.ts";
export declare function KnowledgeSourcesPanel({ client, library, disabled, formatError, onBusyChange, onBound }: {
    client: KnowledgeClient;
    library: KnowledgeLibrary;
    disabled: boolean;
    formatError?: (error: unknown) => string;
    onBusyChange?: (busy: boolean) => void;
    onBound: (library: KnowledgeLibrary) => void;
}): import("react").JSX.Element;
