import {EditorState, Prec} from '@codemirror/state';

export const keepIndentAfterEnterVim = EditorState.transactionFilter.of((tr) => {
    if (!tr.docChanged)
        return tr;
    
    const selection = tr.newSelection.main;
    
    if (!selection.empty)
        return tr;
    
    const pos = selection.head;
    const line = tr.newDoc.lineAt(pos);
    
    if (pos !== line.from)
        return tr;
    
    let insertedNewline = false;
    
    tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        if (inserted.toString().includes('\n'))
            insertedNewline = true;
    });
    
    if (!insertedNewline)
        return tr;
    
    // Берём indentation предыдущей строки.
    if (line.number === 1)
        return tr;
    
    const previousLine = tr.newDoc.line(line.number - 1);
    const match = previousLine.text.match(/^\s*/);
    const indent = match?.[0] || '';
    
    if (!indent)
        return tr;
    
    return [
        tr, {
            changes: {
                from: pos,
                to: pos,
                insert: indent,
            },
            selection: {
                anchor: pos + indent.length,
            },
        },
    ];
});

