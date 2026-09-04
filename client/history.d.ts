import type {Compartment} from '@codemirror/state';
import type {EditorView} from '@codemirror/view';

export function clearHistory(view: EditorView, historyCompartment: Compartment, vimEnabled: boolean): void;