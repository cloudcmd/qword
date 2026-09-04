import {type Compartment, type Extension} from '@codemirror/state';
import type {QwordEditorView} from './create.js';
import type {
    KeyMap,
    EditorMode,
    EditorTheme,
} from './types.js';

export function keymapExtension(name: KeyMap): Extension;

export function themeExtension(name: EditorTheme): Extension;

export function languageExtension(mode: EditorMode | {
    name: EditorMode;
    json?: boolean;
} | null): Extension;

export type OptionKey = 'theme' | 'keyMap' | 'mode';

export type OptionValue =
    | EditorTheme
    | KeyMap
    | EditorMode
    | {
        name: EditorMode;
        json?: boolean;
    }
    | null;

export function setOption(view: QwordEditorView, key: OptionKey, value: OptionValue): void;