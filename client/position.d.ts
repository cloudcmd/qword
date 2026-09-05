import type {Text} from '@codemirror/state';
import type {EditorView} from '@codemirror/view';
import type {CharOffset, SourcePosition} from './types.js';

export function offsetToPosition(document_: Text, offset: CharOffset): SourcePosition;

export function positionToOffset(document_: Text, {line, ch}: SourcePosition): CharOffset;

export function posFromIndex(view: EditorView, index: CharOffset): SourcePosition;

export function indexFromPos(view: EditorView, position: SourcePosition): CharOffset;

export function getCursor(view: EditorView): {
    row: number;
    column: number;
};

export function getCursorIndex(view: EditorView): CharOffset;

