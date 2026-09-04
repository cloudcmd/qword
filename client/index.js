export {createEditor} from './create.js';
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
} from './decorations.js';
export {on, off} from './events.js';
export {getScrollInfo, scrollTo} from './scroll.js';
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
} from './options.js';
export {clearHistory} from './history.js';
export {highlightStyle} from './highlight.js';
