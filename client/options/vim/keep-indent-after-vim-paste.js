import {EditorState, Transaction} from '@codemirror/state';

export const normalizeVimPaste = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged)
        return tr;
    
    if (!tr.isUserEvent('input.type.compose'))
        return tr;
    
    if (!tr.newSelection.empty)
        return tr;
    
    const pos = tr.newSelection.main.head;
    const line = tr.newDoc.lineAt(pos);
    
    if (pos !== line.from)
        return tr;
    
    let hasNewlineInsert = false;
    tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        if (inserted.toString().includes('\n'))
            hasNewlineInsert = true;
    });
    
    if (!hasNewlineInsert)
        return tr;
    
    const destIndent = line.text.match(/^\s*/)?.[0] || '';
    if (!destIndent)
        return tr;
    
    let hasBuggyPrefix = false;
    tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        const text = inserted.toString();
        if (text.startsWith('\n') && text.slice(1).startsWith(destIndent))
            hasBuggyPrefix = true;
    });
    
    if (!hasBuggyPrefix)
        return tr;
    
    const newAnnotations = tr.annotations
        .filter((a) => a.type !== Transaction.userEvent)
        .concat(Transaction.userEvent.of('input.paste'));
    
    return Transaction.create(
        tr.startState,
        tr.changes,
        tr.selection,
        tr.effects,
        newAnnotations,
        tr.scrollIntoView
    );
});
