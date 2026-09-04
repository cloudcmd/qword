import {
    type Range,
    StateEffect,
    StateField,
    type Transaction,
} from '@codemirror/state';
import {
    Decoration,
    EditorView,
    type DecorationSet,
} from '@codemirror/view';
import type {SourcePosition} from './types.js';

export const setMarkEffect: StateEffect<Range<Decoration>>;
export const clearMarkEffect: StateEffect<null>;
export const setLineEffect: StateEffect<{
    line: number;
    cls: string;
}>;
export const clearLineEffect: StateEffect<{
    line: number;
    cls: string;
}>;

export const markField: StateField<DecorationSet>;
export const lineField: StateField<DecorationSet>;

export type MarkHandle = {
    clear: () => void;
};

export function markText(view: EditorView, from: SourcePosition, to: SourcePosition, {
    className,
}: {
    className: string;
}): MarkHandle;

export function addLineClass(view: EditorView, line: number, _where: string, className: string): void;

export function removeLineClass(view: EditorView, line: number, _where: string, className: string): void;