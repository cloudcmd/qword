import type {EditorView} from '@codemirror/view';
import type {SourceCode} from './types.js';

export function getValue(view: EditorView): SourceCode;
export const getDocValue: typeof getValue;

export function setValue(view: EditorView, value: SourceCode): void;
export const setDocValue: typeof setValue;