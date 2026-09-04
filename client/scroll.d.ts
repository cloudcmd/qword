import type {EditorView} from '@codemirror/view';

export type ScrollInfo = {
    left: number;
    top: number;
};

export const getScrollInfo: (view: EditorView) => ScrollInfo;

export function scrollTo(view: EditorView, left: number, top: number): void;