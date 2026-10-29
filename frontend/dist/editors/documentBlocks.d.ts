import type { BlockNoteEditor } from "@blocknote/core";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
import type { LucideIcon } from "lucide-react";
import "katex/dist/katex.min.css";
import type { KnowledgeSlashMenuItem } from "./slashMenu.ts";
import type { KnowledgeDynamicBlockRuntime, KnowledgeEditorProps, KnowledgeMentionRuntime, KnowledgePollRuntime, KnowledgeTaskRuntime } from "./types.ts";
export declare const knowledgeImageCropAspects: readonly ["original", "1:1", "4:3", "16:9", "3:4"];
type KnowledgeMentionRuntimeRef = {
    current: KnowledgeMentionRuntime | undefined;
};
export declare function registerKnowledgeMentionRuntime(editor: object, runtime: KnowledgeMentionRuntimeRef): void;
export declare function notifyKnowledgeMentionRuntime(editor: object): void;
type KnowledgeTaskRuntimeRef = {
    current: KnowledgeTaskRuntime | undefined;
};
export declare function registerKnowledgeTaskRuntime(editor: object, runtime: KnowledgeTaskRuntimeRef): void;
export declare function notifyKnowledgeTaskRuntime(editor: object): void;
type KnowledgePollRuntimeRef = {
    current: KnowledgePollRuntime | undefined;
};
export declare function registerKnowledgePollRuntime(editor: object, runtime: KnowledgePollRuntimeRef): void;
export declare function notifyKnowledgePollRuntime(editor: object): void;
type KnowledgeDynamicBlockRuntimeRef = {
    current: KnowledgeDynamicBlockRuntime | undefined;
};
export declare function registerKnowledgeDynamicBlockRuntime(editor: object, runtime: KnowledgeDynamicBlockRuntimeRef): void;
export declare function notifyKnowledgeDynamicBlockRuntime(editor: object): void;
export declare const knowledgeCodeLanguages: {
    text: {
        readonly name: string;
        aliases: string[];
    };
    javascript: {
        name: string;
        aliases: string[];
    };
    typescript: {
        name: string;
        aliases: string[];
    };
    json: {
        name: string;
    };
    html: {
        name: string;
        aliases: string[];
    };
    css: {
        name: string;
    };
    bash: {
        name: string;
        aliases: string[];
    };
    go: {
        name: string;
        aliases: string[];
    };
    python: {
        name: string;
        aliases: string[];
    };
    java: {
        name: string;
    };
    sql: {
        name: string;
    };
    markdown: {
        name: string;
        aliases: string[];
    };
    yaml: {
        name: string;
        aliases: string[];
    };
    rust: {
        name: string;
        aliases: string[];
    };
    csharp: {
        name: string;
        aliases: string[];
    };
    cpp: {
        name: string;
        aliases: string[];
    };
};
export declare const knowledgeCodeLanguageIDs: readonly string[];
export declare function registerKnowledgeContentAction(editor: object, authorize: KnowledgeEditorProps["authorizeContentAction"]): void;
type BlockSlashDefinition = {
    id?: string;
    title: string;
    subtext: string;
    aliases: readonly string[];
    group: string;
    icon: LucideIcon;
    block: Record<string, unknown>;
};
export type BlockDefinition = {
    id: string;
    blockNoteSpec?: () => unknown;
    defaultSlashKeys?: readonly string[];
    icon?: LucideIcon;
    slash?: BlockSlashDefinition | readonly BlockSlashDefinition[];
    serverValidator: string;
    readonlyRenderer: "blocknote-default" | "blocknote-spec";
    extractTextKeys: readonly string[];
    requiredCapability: "page.read" | "page.write" | "application-card.resolve";
    trusted: true;
};
export declare const blockDefinitions: readonly BlockDefinition[];
export declare function validateBlockDefinitions(items?: readonly BlockDefinition[]): boolean;
export declare const blockDefinitionRegistry: Readonly<Record<string, BlockDefinition>>;
export declare const knowledgeDocumentSchema: import("@blocknote/core").CustomBlockNoteSchema<import("@blocknote/core").BlockSchemaFromSpecs<{
    readonly audio: import("@blocknote/core").BlockSpec<"audio", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly name: {
            readonly default: "";
        };
        readonly url: {
            readonly default: "";
        };
        readonly caption: {
            readonly default: "";
        };
        readonly showPreview: {
            readonly default: true;
        };
    }, "none">;
    readonly bulletListItem: import("@blocknote/core").BlockSpec<"bulletListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
    }, "inline">;
    readonly checkListItem: import("@blocknote/core").BlockSpec<"checkListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly checked: {
            readonly default: false;
            readonly type: "boolean";
        };
    }, "inline">;
    readonly codeBlock: import("@blocknote/core").BlockSpec<"codeBlock", {
        readonly language: {
            readonly default: string;
        };
    }, "plain">;
    readonly divider: import("@blocknote/core").BlockSpec<"divider", {}, "none">;
    readonly file: import("@blocknote/core").BlockSpec<"file", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly name: {
            readonly default: "";
        };
        readonly url: {
            readonly default: "";
        };
        readonly caption: {
            readonly default: "";
        };
    }, "none">;
    readonly heading: import("@blocknote/core").BlockSpec<"heading", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly level: {
            readonly default: 1 | 2 | 3 | 4 | 5 | 6;
            readonly values: readonly number[];
        };
        readonly isToggleable?: {
            readonly default: false;
            readonly optional: true;
        } | undefined;
    }, "inline">;
    readonly image: import("@blocknote/core").BlockSpec<"image", {
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly backgroundColor: {
            default: "default";
        };
        readonly name: {
            readonly default: "";
        };
        readonly url: {
            readonly default: "";
        };
        readonly caption: {
            readonly default: "";
        };
        readonly showPreview: {
            readonly default: true;
        };
        readonly previewWidth: {
            readonly default: undefined;
            readonly type: "number";
        };
    }, "none">;
    readonly numberedListItem: import("@blocknote/core").BlockSpec<"numberedListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        readonly start: {
            readonly default: undefined;
            readonly type: "number";
        };
    }, "inline">;
    readonly paragraph: import("@blocknote/core").BlockSpec<"paragraph", {
        backgroundColor: {
            default: "default";
        };
        textColor: {
            default: "default";
        };
        textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
    }, "inline">;
    readonly quote: import("@blocknote/core").BlockSpec<"quote", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
    }, "inline">;
    readonly table: import("@blocknote/core").LooseBlockSpec<"table", {
        textColor: {
            default: "default";
        };
    }, "table">;
    readonly toggleListItem: import("@blocknote/core").BlockSpec<"toggleListItem", {
        readonly backgroundColor: {
            default: "default";
        };
        readonly textColor: {
            default: "default";
        };
        readonly textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
    }, "inline">;
    readonly video: import("@blocknote/core").BlockSpec<"video", {
        textAlignment: {
            default: "left";
            values: readonly ["left", "center", "right", "justify"];
        };
        backgroundColor: {
            default: "default";
        };
        name: {
            default: "";
        };
        url: {
            default: "";
        };
        caption: {
            default: "";
        };
        showPreview: {
            default: boolean;
        };
        previewWidth: {
            default: undefined;
            type: "number";
        };
    }, "none">;
}>, import("@blocknote/core").InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}> & {
    inlineFormula: {
        readonly type: "inlineFormula";
        readonly propSchema: {};
        readonly content: "plain";
    };
    personMention: {
        readonly type: "personMention";
        readonly propSchema: {
            readonly userId: {
                readonly default: "";
            };
        };
        readonly content: "none";
    };
    dateMention: {
        readonly type: "dateMention";
        readonly propSchema: {
            readonly date: {
                readonly default: "";
            };
        };
        readonly content: "none";
    };
    pageMention: {
        readonly type: "pageMention";
        readonly propSchema: {
            readonly pageId: {
                readonly default: "";
            };
        };
        readonly content: "none";
    };
    blockMention: {
        readonly type: "blockMention";
        readonly propSchema: {
            readonly pageId: {
                readonly default: "";
            };
            readonly blockId: {
                readonly default: "";
            };
        };
        readonly content: "none";
    };
}, import("@blocknote/core").StyleSchemaFromSpecs<{
    bold: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    italic: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    underline: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    strike: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    code: {
        config: {
            type: string;
            propSchema: "boolean";
        };
        implementation: import("@blocknote/core").StyleImplementation<{
            type: string;
            propSchema: "boolean";
        }>;
    };
    textColor: import("@blocknote/core").StyleSpec<{
        readonly type: "textColor";
        readonly propSchema: "string";
    }>;
    backgroundColor: import("@blocknote/core").StyleSpec<{
        readonly type: "backgroundColor";
        readonly propSchema: "string";
    }>;
}>>;
export declare function getKnowledgeMentionMenuItems(editor: BlockNoteEditor<any, any, any>, runtime: KnowledgeMentionRuntime | undefined, query: string): Promise<DefaultReactSuggestionItem[]>;
export declare function getKnowledgeSlashMenuItems(editor: BlockNoteEditor<any, any, any>, query: string, capabilities?: {
    canUploadFiles: boolean;
    fileAccept?: {
        all: string;
        image: string;
        video: string;
        audio: string;
    };
}): Promise<KnowledgeSlashMenuItem[]>;
export {};
