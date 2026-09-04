import {test} from 'supertape';
import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {
    getValue,
    setValue,
    getDocValue,
    setDocValue,
} from './content.js';

function makeView(doc = 'hello') {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    return new EditorView({
        state: EditorState.create({
            doc,
        }),
        parent: element,
    });
}

test('content: getValue returns document string', (t) => {
    const view = makeView('abc');
    const result = getValue(view);
    const expected = 'abc';
    
    view.destroy();
    
    t.equal(result, expected);
    t.end();
});

test('content: setValue replaces content', (t) => {
    const view = makeView('abc');
    setValue(view, 'xyz');
    
    const result = getValue(view);
    const expected = 'xyz';
    
    view.destroy();
    
    t.equal(result, expected);
    t.end();
});

test('content: getDocValue aliases getValue', (t) => {
    const view = makeView('abc');
    const result = getDocValue(view);
    const expected = 'abc';
    
    view.destroy();
    
    t.equal(result, expected);
    t.end();
});

test('content: setDocValue aliases setValue', (t) => {
    const view = makeView('abc');
    setDocValue(view, 'xyz');
    
    const result = getValue(view);
    const expected = 'xyz';
    
    view.destroy();
    
    t.equal(result, expected);
    t.end();
});
