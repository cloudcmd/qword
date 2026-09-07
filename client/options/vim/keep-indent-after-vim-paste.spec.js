import {test} from 'supertape';
import {EditorState} from '@codemirror/state';
import {normalizeVimPaste} from './keep-indent-after-vim-paste.js';

function makeState(doc) {
    return EditorState.create({
        doc,
        extensions: [normalizeVimPaste],
    });
}

test('normalizeVimPaste: no-op when doc not changed', (t) => {
    const state = makeState('    hello');
    const next = state.update({selection: {anchor: 0}}).state;
    const result = next.doc.toString();
    const expected = '    hello';
    
    t.equal(result, expected);
    t.end();
});

test('normalizeVimPaste: no-op when not input.type.compose', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {from: 9, insert: '\n    x'},
        userEvent: 'input.paste',
    }).state;
    const lines = next.doc.toString().split('\n');
    
    t.equal(lines[1], '    x');
    t.end();
});

test('normalizeVimPaste: no-op when selection not empty', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {from: 0, insert: '\n    x'},
        selection: {anchor: 0, head: 2},
        userEvent: 'input.type.compose',
    }).state;
    const lines = next.doc.toString().split('\n');
    
    t.equal(lines[0], '');
    t.end();
});

test('normalizeVimPaste: no-op when cursor not at line start', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {from: 4, insert: '\n    x'},
        selection: {anchor: 9},
        userEvent: 'input.type.compose',
    }).state;
    const lines = next.doc.toString().split('\n');
    
    t.equal(lines[1], '    xhello');
    t.end();
});

test('normalizeVimPaste: no-op when destination has no indent', (t) => {
    const state = makeState('hello');
    const next = state.update({
        changes: {from: 5, insert: '\n    x'},
        selection: {anchor: 6},
        userEvent: 'input.type.compose',
    }).state;
    const lines = next.doc.toString().split('\n');
    
    t.equal(lines[1], '    x');
    t.end();
});

test('normalizeVimPaste: no-op when no newline inserted', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {from: 9, insert: 'x'},
        selection: {anchor: 10},
        userEvent: 'input.type.compose',
    }).state;
    const result = next.doc.toString();
    const expected = '    hellox';
    
    t.equal(result, expected);
    t.end();
});

test('normalizeVimPaste: changes userEvent to input.paste for line paste', (t) => {
    const state = makeState('    a\n    b\n    c');
    const next = state.update({
        changes: {from: 11, insert: '\n    b'},
        selection: {anchor: 12},
        userEvent: 'input.type.compose',
    }).state;
    const lines = next.doc.toString().split('\n');
    
    t.equal(lines[2], '    b');
    t.end();
});
