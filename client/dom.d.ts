import {EditorView} from '@codemirror/view';

export function getView(container: HTMLElement): EditorView | null;

export function refresh(view: EditorView): void;

export function observeResize(view: EditorView, container: Element): () => void;