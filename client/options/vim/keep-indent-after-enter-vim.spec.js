import {test} from 'supertape';
import {EditorState} from '@codemirror/state';
import {keepIndentAfterEnterVim} from './keep-indent-after-enter-vim.js';

function makeState(doc) {
    return EditorState.create({
        doc,
        extensions: [keepIndentAfterEnterVim],
    });
}

function pressEnter(state) {
    return state.update({
        changes: {
            from: state.doc.length,
            insert: '\n',
        },
        selection: {
            anchor: state.doc.length + 1,
        },
    }).state;
}

test('keepIndentAfterEnterVim: no-op when no newline inserted', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {
            from: 9,
            insert: 'x',
        },
    }).state;
    
    const result = next.doc.toString();
    const expected = '    hellox';
    
    t.equal(result, expected);
    t.end();
});

test('keepIndentAfterEnterVim: first Enter copies indent from previous line', (t) => {
    const state = makeState('    hello');
    const next = pressEnter(state);
    
    const lines = next.doc
        .toString()
        .split('\n');
    
    const result = lines[1].startsWith('    ');
    
    t.ok(result);
    t.end();
});

test('keepIndentAfterEnterVim: second Enter does not double indent', (t) => {
    const state = makeState('    hello');
    const next = pressEnter(pressEnter(state));
    
    const lines = next.doc
        .toString()
        .split('\n');
    
    t.equal(lines[2], '    ');
    t.end();
});

test('keepIndentAfterEnterVim: no-op when previous line has no indent', (t) => {
    const state = makeState('hello');
    const next = pressEnter(state);
    
    const lines = next.doc
        .toString()
        .split('\n');
    
    t.equal(lines[1], '');
    t.end();
});

test('keepIndentAfterEnterVim: no-op on first line', (t) => {
    const state = makeState('');
    const next = state.update({
        changes: {
            from: 0,
            insert: '\n',
        },
        selection: {
            anchor: 1,
        },
    }).state;
    
    const result = next.doc.toString();
    const expected = '\n';
    
    t.equal(result, expected);
    t.end();
});

test('keepIndentAfterEnterVim: no-op when insert position is not at line start after newline', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {
            from: 4,
            insert: '\n',
        },
        selection: {
            anchor: 8,
        },
    }).state;
    
    const lines = next.doc
        .toString()
        .split('\n');
    
    t.equal(lines[1], 'hello');
    t.end();
});

test('keepIndentAfterEnterVim: no-op when doc is not changed', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        selection: {
            anchor: 0,
        },
    }).state;
    const result = next.doc.toString();
    const expected = '    hello';
    
    t.equal(result, expected);
    t.end();
});

test('keepIndentAfterEnterVim: no-op when selection is not empty', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {
            from: 0,
            insert: 'x',
        },
        selection: {
            anchor: 0,
            head: 2,
        },
    }).state;
    
    const result = next.doc.toString();
    const expected = 'x    hello';
    
    t.equal(result, expected);
    t.end();
});

test('keepIndentAfterEnterVim: no-op when newline comes with indent', (t) => {
    const state = makeState('    hello');
    const next = state.update({
        changes: {
            from: 9,
            insert: '\n    ',
        },
        selection: {
            anchor: 10,
        },
    }).state;
    
    const lines = next.doc
        .toString()
        .split('\n');
    
    t.equal(lines[1], '    ');
    t.end();
});
