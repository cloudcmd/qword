import type {QwordEditorView} from './create.js';
import type {CreateEditorOptions} from './create.js';
import type {
    MarkHandle,
} from './decorations.js';
import type {
    OptionKey,
    OptionValue,
} from './options.js';
import type {
    SourceCode,
    SourcePosition,
    CharOffset,
    KeyMap,
    EditorMode,
    EditorTheme,
} from './types.js';

export type EditorOptions = CreateEditorOptions;

export default class Editor {
    constructor(element: Element, options?: EditorOptions);

    getValue(): SourceCode;

    setValue(value: SourceCode): this;

    getCursorIndex(): CharOffset;

    getCursor(): {
        row: number;
        column: number;
    };

    posFromIndex(index: CharOffset): SourcePosition;

    focus(): this;

    moveCursorTo(row: number, column?: number): this;

    markRange(from: SourcePosition, to: SourcePosition, className: string): MarkHandle;

    addLineClass(line: number, className: string): this;

    removeLineClass(line: number, className: string): this;

    setOption(name: OptionKey, value: OptionValue): this;

    setMode(mode: EditorMode): this;

    setTheme(theme: EditorTheme): this;

    setKeyMap(name: KeyMap): this;

    setModeForPath(path: string): this;

    isChanged(): boolean;

    clearHistory(): this;

    on(event: string, handler: (...args: unknown[]) => void): this;

    addListener(event: string, handler: (...args: unknown[]) => void): this;

    once(event: string, handler: (...args: unknown[]) => void): this;

    removeListener(event: string, handler: (...args: unknown[]) => void): this;

    emit(...args: unknown[]): this;

    get _view(): QwordEditorView;
}