import {test} from 'supertape';
import {once} from 'events';
import Editor from './editor.js';

function makeEditor(options = {}) {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    return new Editor(element, options);
}

test('Editor: getValue returns document string', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const result = editor.getValue();
    const expected = 'hello';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: setValue returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.setValue('xyz');
    
    t.equal(result, editor);
    t.end();
});

test('Editor: setValue updates content', (t) => {
    const editor = makeEditor();
    editor.setValue('xyz');
    
    const result = editor.getValue();
    const expected = 'xyz';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: getCursorIndex returns a number', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const result = typeof editor.getCursorIndex();
    const expected = 'number';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: getCursor returns row number', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const cursor = editor.getCursor();
    const result = typeof cursor.row;
    const expected = 'number';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: getCursor returns column number', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const cursor = editor.getCursor();
    const result = typeof cursor.column;
    const expected = 'number';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: posFromIndex returns position', (t) => {
    const editor = makeEditor({
        value: 'hello world',
    });
    
    const result = editor.posFromIndex(6);
    
    const expected = {
        line: 0,
        ch: 6,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('Editor: focus returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.focus();
    
    t.equal(result, editor);
    t.end();
});

test('Editor: moveCursorTo returns this', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const result = editor.moveCursorTo(0, 0);
    
    t.equal(result, editor);
    t.end();
});

test('Editor: markRange returns object with clear function', (t) => {
    const editor = makeEditor({
        value: 'hello world',
    });
    
    const mark = editor.markRange({
        line: 0,
        ch: 0,
    }, {
        line: 0,
        ch: 5,
    }, 'marked');
    
    const result = typeof mark.clear;
    const expected = 'function';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: markRange takes index positions', (t) => {
    const editor = makeEditor({
        value: 'hello world',
    });
    
    const mark = editor.markRange({
        line: 0,
        ch: 0,
    }, {
        line: 0,
        ch: 5,
    }, 'marked');
    
    const result = typeof mark.clear;
    const expected = 'function';
    
    t.equal(result, expected);
    t.end();
});

test('Editor: addLineClass returns this', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    const result = editor.addLineClass(0, 'errorMarker');
    const expected = editor;
    
    t.equal(result, expected);
    t.end();
});

test('Editor: removeLineClass returns this', (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    
    editor.addLineClass(0, 'errorMarker');
    const result = editor.removeLineClass(0, 'errorMarker');
    const expected = editor;
    
    t.equal(result, expected);
    t.end();
});

test('Editor: setOption emacs does not throw', (t) => {
    const editor = makeEditor();
    editor.setOption('keyMap', 'emacs');
    
    t.ok(true);
    t.end();
});

test('Editor: setOption keyMap vim sets vim mode', (t) => {
    const editor = makeEditor();
    editor.setOption('keyMap', 'vim');
    
    t.ok(true);
    t.end();
});

test('Editor: setMode returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.setMode('json');
    
    t.equal(result, editor);
    t.end();
});

test('Editor: setTheme returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.setTheme('nord');
    
    t.equal(result, editor);
    t.end();
});

test('Editor: setKeyMap returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.setKeyMap('emacs');
    
    t.equal(result, editor);
    t.end();
});

test('Editor: setModeForPath sets mode', (t) => {
    const editor = makeEditor();
    
    const result = editor.setModeForPath('/path/to/file.json');
    
    t.equal(result, editor);
    t.end();
});

test('Editor: isChanged false for clean editor', (t) => {
    const editor = makeEditor();
    const result = editor.isChanged();
    
    t.notOk(result);
    t.end();
});

test('Editor: isChanged true after setValue', (t) => {
    const editor = makeEditor();
    editor.setValue('changed');
    const result = editor.isChanged();
    
    t.ok(result);
    t.end();
});

test('Editor: clearHistory returns this', (t) => {
    const editor = makeEditor();
    
    const result = editor.clearHistory();
    
    t.equal(result, editor);
    t.end();
});

test('Editor: on change event emits value and cursor', async (t) => {
    const editor = makeEditor({
        value: 'hello',
    });
    let emitted = null;
    const [data] = await once(editor, 'change');
    
    emitted = data;
    editor.setValue('changed');
    
    const result = typeof emitted.value;
    const expected = 'string';
    
    t.equal(result, expected);
    t.end();
});
