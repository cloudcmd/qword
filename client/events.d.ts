import type {EditorView} from '@codemirror/view';

export type EventBinding = [string, EventListener];

export function on(view: EditorView, event: string, handler: EventListener): EventBinding;

export function off(view: EditorView, event: string, handler: EventListener): void;

