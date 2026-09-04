export {
    createEditor,
    type CreateEditorOptions,
    type QwordEditorView,
} from './create.js';
export {
    getValue,
    setValue,
    getDocValue,
    setDocValue,
} from './content.js';
export {
    offsetToPosition,
    positionToOffset,
    posFromIndex,
    indexFromPos,
    getCursorIndex,
    getCursor,
} from './position.js';
export {
    markField,
    lineField,
    markText,
    addLineClass,
    removeLineClass,
    type MarkHandle,
} from './decorations.js';
export {
    on,
    off,
    type EventBinding,
} from './events.js';
export {
    getScrollInfo,
    scrollTo,
    type ScrollInfo,
} from './scroll.js';
export {
    getView,
    refresh,
    observeResize,
} from './dom.js';
export {
    keymapExtension,
    themeExtension,
    languageExtension,
    setOption,
    type OptionKey,
    type OptionValue,
} from './options.js';
export {clearHistory} from './history.js';
export {highlightStyle} from './highlight.js';
export type {
    SourceCode,
    SourcePosition,
    CharOffset,
    EditorMode,
    EditorTheme,
    KeyMap,
} from './types.js';