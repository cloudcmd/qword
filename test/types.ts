import Editor from '../client/editor.js';
import {
    createEditor,
    getValue,
    setValue,
    offsetToPosition,
    positionToOffset,
    posFromIndex,
    indexFromPos,
    getCursorIndex,
    getCursor,
    markText,
    addLineClass,
    removeLineClass,
    on,
    off,
    getScrollInfo,
    scrollTo,
    getView,
    refresh,
    observeResize,
    setOption,
    clearHistory,
} from '../client/index.js';

const view = createEditor(document.body, {
    value: 'const a = 3',
    mode: 'javascript',
    keyMap: 'default',
    theme: 'default',
    lineNumbers: true,
    readOnly: false,
    foldGutter: true,
});

// content
const value: string = getValue(view);
setValue(view, 'const b = 4');

// position
const position = offsetToPosition(view.state.doc, 10);
const offset: number = positionToOffset(view.state.doc, {
    line: 0,
    ch: 0,
});
const pos = posFromIndex(view, 0);
const idx = indexFromPos(view, {
    line: 0,
    ch: 0,
});
const cursor = getCursorIndex(view);
const {row, column} = getCursor(view);

// decorations
const handle = markText(view, {
    line: 0,
    ch: 0,
}, {
    line: 0,
    ch: 1,
}, {
    className: 'hl-keyword',
});
handle.clear();
addLineClass(view, 0, 'text', 'hl-string');
removeLineClass(view, 0, 'text', 'hl-string');

// events
const binding = on(view, 'keydown', () => {});
off(view, 'keydown', () => {});

// scroll
const {left, top} = getScrollInfo(view);
scrollTo(view, left, top);

// dom
const found = getView(document.body);
refresh(view);
const unobserve = observeResize(view, document.body);
unobserve();

// options
setOption(view, 'mode', 'javascript');
setOption(view, 'theme', 'nord');
setOption(view, 'keyMap', 'vim');

// history
clearHistory(view, view._historyCompartment, false);

// Editor class
const editor = new Editor(document.body, {
    value: 'const a = 3',
    mode: 'javascript',
    theme: 'default',
    keyMap: 'default',
});
editor
    .setValue('const b = 4')
    .focus()
    .moveCursorTo(0, 1)
    .addLineClass(0, 'hl-string')
    .removeLineClass(0, 'hl-string')
    .setMode('javascript')
    .setTheme('nord')
    .setKeyMap('vim')
    .setModeForPath('a.js')
    .clearHistory()
    .on('change', () => {})
    .emit('change', {});
const editorValue: string = editor.getValue();
const editorCursor = editor.getCursor();
const editorPos = editor.posFromIndex(0);
editor.markRange({
    line: 0,
    ch: 0,
}, {
    line: 0,
    ch: 1,
}, 'className').clear();

// types compile
void value;
void position;
void offset;
void pos;
void idx;
void cursor;
void row;
void column;
void binding;
void found;
void editorValue;
void editorCursor;
void editorPos;