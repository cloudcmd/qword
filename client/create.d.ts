import {Compartment} from '@codemirror/state';
import {type ViewUpdate, EditorView} from '@codemirror/view';
import type {
    SourceCode,
    KeyMap,
    EditorMode,
    EditorTheme,
} from './types.js';

export type CreateEditorOptions = {
    value?: SourceCode;
    mode?: EditorMode | {
        name: EditorMode;
        json?: boolean;
    };
    keyMap?: KeyMap;
    theme?: EditorTheme;
    lineNumbers?: boolean;
    readOnly?: boolean;
    foldGutter?: boolean;
    updateListener?: (update: ViewUpdate) => void;
};

// Augmented EditorView with compartment refs for dynamic option changes.
export type QwordEditorView = EditorView & {
    _themeCompartment: Compartment;
    _keymapCompartment: Compartment;
    _langCompartment: Compartment;
    _historyCompartment: Compartment;
};

export function createEditor(element: Element, options?: CreateEditorOptions): QwordEditorView;