import type { KnowledgePageContentType } from "../types.ts";
import type * as Y from "yjs";
export type KnowledgeEditorCollaboration = {
    document: Y.Doc;
    fragment: Y.XmlFragment;
    initializeFromBody: boolean;
    user: {
        name: string;
        color: string;
    };
};
export type KnowledgeEditorChange = {
    yjsUpdate: string;
    yjsState: string;
    editedBlockIDs: string[];
    cursorBlockID?: string;
    selectionBlockID?: string;
};
export type KnowledgeEditorProps = {
    body: string;
    readOnly: boolean;
    collaboration?: KnowledgeEditorCollaboration;
    onChange(body: string, collaboration?: KnowledgeEditorChange): void;
    onPresence?(cursorBlockID?: string, selectionBlockID?: string): void;
};
export type KnowledgeEditorModule = {
    default: React.ComponentType<KnowledgeEditorProps>;
};
export type KnowledgeEditorKind = KnowledgePageContentType;
