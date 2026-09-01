import {test} from 'supertape';
import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {getValue, setValue, getDocValue, setDocValue} from './content.js';

function makeView(doc = 'hello') {
    const element = document.createElement('div');
    document.body.appendChild(element);
    return new EditorView({state: EditorState.create({doc}), parent: element});
}

test('content: getValue returns document string', (t) => {
    const view = makeView('abc');
    t.equal(getValue(view), 'abc');
    view.destroy();
    t.end();
});

test('content: setValue replaces content', (t) => {
    const view = makeView('abc');
    setValue(view, 'xyz');
    t.equal(getValue(view), 'xyz');
    view.destroy();
    t.end();
});

test('content: getDocValue aliases getValue', (t) => {
    const view = makeView('abc');
    t.equal(getDocValue(view), 'abc');
    view.destroy();
    t.end();
});

test('content: setDocValue aliases setValue', (t) => {
    const view = makeView('abc');
    setDocValue(view, 'xyz');
    t.equal(getValue(view), 'xyz');
    view.destroy();
    t.end();
});