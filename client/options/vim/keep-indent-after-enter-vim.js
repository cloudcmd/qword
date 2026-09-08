import {EditorState} from '@codemirror/state';

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
    
    if (line.number === 1)
        return tr;
    
    const previousLine = tr.newDoc.line(line.number - 1);
    const indent = previousLine.text.match(/^\s*/)?.[0] || '';
    
    if (!indent)
        return tr;
    
    let insertedNewline = false;
    let alreadyIndented = false;
    
    tr.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
        const text = inserted.toString();
        
        if (text === '\n')
            insertedNewline = true;
        
        if (text.endsWith(`\n${indent}`))
            alreadyIndented = true;
    });
    
    if (!insertedNewline || alreadyIndented)
        return tr;
    
    return [
        tr, {
            changes: {
                from: pos,
                insert: indent,
            },
            selection: {
                anchor: pos + indent.length,
            },
            sequential: true,
        },
    ];
});
