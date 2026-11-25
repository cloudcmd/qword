import {test} from 'supertape';
import {EditorState, Compartment} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {history, historyKeymap} from '@codemirror/commands';
import {vim} from '@replit/codemirror-vim';
import {clearHistory} from './history.js';

const historyExtensions = [
    history(),
    keymap.of(historyKeymap),
];

function makeView() {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const compartment = new Compartment();
    
    const view = new EditorView({
        state: EditorState.create({
            doc: 'hello',
            extensions: [
                compartment.of(historyExtensions),
            ],
        }),
        parent: element,
    });
    
    return {
        view,
        compartment,
    };
}

test('history: clearHistory does not throw', (t) => {
    const {view, compartment} = makeView();
    clearHistory(view, compartment, false);
    view.destroy();
    
    t.pass();
    t.end();
});

test('history: clearHistory with vim does not throw', (t) => {
    const {view, compartment} = makeView();
    clearHistory(view, compartment, true);
    view.destroy();
    
    t.pass();
    t.end();
});

test('history: clearHistory null view does not throw', (t) => {
    const {compartment} = makeView();
    clearHistory(null, compartment, false);
    
    t.pass();
    t.end();
});

test('history: clearHistory with vim keeps history so u can undo', (t) => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const compartment = new Compartment();
    
    const view = new EditorView({
        state: EditorState.create({
            doc: 'hello',
            extensions: [
                vim(),
                compartment.of([
                    history(),
                    keymap.of(historyKeymap),
                ]),
            ],
        }),
        parent: element,
    });
    
    view.dispatch({
        changes: {
            from: 5,
            insert: ' world',
        },
        userEvent: 'input',
    });
    
    clearHistory(view, compartment, true);
    
    const uEvent = new KeyboardEvent('keydown', {
        key: 'u',
        bubbles: true,
        cancelable: true,
    });
    
    view.contentDOM.dispatchEvent(uEvent);
    
    const result = view.state.doc.toString();
    
    view.destroy();
    
    t.equal(result, 'hello');
    t.end();
});
