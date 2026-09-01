import {test} from 'supertape';
import {EditorState, Compartment} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {history, historyKeymap} from '@codemirror/commands';
import {keymap} from '@codemirror/view';
import {clearHistory} from './history.js';

const historyExtensions = [history(), keymap.of(historyKeymap)];

function makeView() {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const compartment = new Compartment();
    const view = new EditorView({
        state: EditorState.create({
            doc: 'hello',
            extensions: [compartment.of(historyExtensions)],
        }),
        parent: element,
    });
    return {view, compartment};
}

test('history: clearHistory does not throw', (t) => {
    const {view, compartment} = makeView();
    clearHistory(view, compartment, false);
    view.destroy();

    t.ok(true);
    t.end();
});

test('history: clearHistory with vim does not throw', (t) => {
    const {view, compartment} = makeView();
    clearHistory(view, compartment, true);
    view.destroy();

    t.ok(true);
    t.end();
});

test('history: clearHistory null view does not throw', (t) => {
    const {compartment} = makeView();
    clearHistory(null, compartment, false);

    t.ok(true);
    t.end();
});