import type { BlockNoteEditor } from "@blocknote/core";
import type { DefaultReactSuggestionItem } from "@blocknote/react";
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
}> & {
    callout: import("@blocknote/core").BlockConfig<"callout", {
        readonly tone: {
            readonly default: "info";
            readonly values: readonly ["info", "success", "warning", "danger"];
        };
        readonly icon: {
            readonly default: "💡";
        };
    }, "inline">;
    formula: import("@blocknote/core").BlockConfig<"formula", {}, "plain">;
    button: import("@blocknote/core").BlockConfig<"button", {
        readonly label: {
            readonly default: "按钮";
        };
        readonly href: {
            readonly default: "";
        };
        readonly appearance: {
            readonly default: "primary";
            readonly values: readonly ["primary", "secondary"];
        };
    }, "none">;
    knowledgeReference: import("@blocknote/core").BlockConfig<"knowledgeReference", {
        readonly targetPageId: {
            readonly default: "";
        };
        readonly title: {
            readonly default: "未选择知识条目";
        };
        readonly contentType: {
            readonly default: "document";
            readonly values: readonly ["document", "multidimensional_table", "spreadsheet", "presentation", "form", "mind_note", "whiteboard", "mind_map", "flowchart"];
        };
        readonly display: {
            readonly default: "card";
            readonly values: readonly ["card", "embed"];
        };
    }, "none">;
    syncedBlock: import("@blocknote/core").BlockConfig<"syncedBlock", {
        readonly targetPageId: {
            readonly default: "";
        };
        readonly targetBlockId: {
            readonly default: "";
        };
        readonly title: {
            readonly default: "同步内容块";
        };
    }, "none">;
}, import("@blocknote/core").InlineContentSchemaFromSpecs<{
    text: {
        config: "text";
        implementation: any;
    };
    link: {
        config: "link";
        implementation: any;
    };
}>, import("@blocknote/core").StyleSchemaFromSpecs<{
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
export declare function getKnowledgeSlashMenuItems(editor: BlockNoteEditor<any, any, any>, query: string): Promise<DefaultReactSuggestionItem[]>;
