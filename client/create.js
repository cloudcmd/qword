import {EditorState, Compartment} from '@codemirror/state';
import {
    EditorView,
    lineNumbers as lineNumbersExtension,
    drawSelection,
    keymap,
} from '@codemirror/view';
import {history, historyKeymap} from '@codemirror/commands';
import {closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete';
import {
    foldGutter,
    codeFolding,
    syntaxHighlighting,
    indentOnInput,
    indentUnit,
} from '@codemirror/language';
import {highlightStyle} from './highlight.js';
import {
    keymapExtension,
    themeExtension,
    languageExtension,
} from './options.js';
import {markField, lineField} from './decorations.js';

export function createEditor(element, options = {}) {
    const {
        value = '',
        mode = 'javascript',
        keyMap = 'default',
        theme = 'default',
        lineNumbers = true,
        readOnly = false,
        foldGutter: fold = false,
        updateListener,
    } = options;
    
    const themeCompartment = new Compartment();
    const keymapCompartment = new Compartment();
    const langCompartment = new Compartment();
    const historyCompartment = new Compartment();
    
    const hideCursorOnBlur = EditorView.theme({
        '&:not(.cm-focused) .cm-fat-cursor': {
            display: 'none',
        },
    });
    
    const extensions = [
        historyCompartment.of([
            history(),
            keymap.of(historyKeymap),
        ]),
        markField,
        lineField,
        themeCompartment.of(themeExtension(theme)),
        keymapCompartment.of(keymapExtension(keyMap)),
        closeBrackets(),
        keymap.of(closeBracketsKeymap),
        langCompartment.of(languageExtension(mode)),
        syntaxHighlighting(highlightStyle),
        indentOnInput(),
        indentUnit.of('    '),
        ...lineNumbers
            ? [
                lineNumbersExtension(),
            ]
            : [],
        ...fold
            ? [
                foldGutter(),
                codeFolding(),
            ]
            : [],
        ...readOnly
            ? [
                EditorState.readOnly.of(true),
            ]
            : [],
        ...updateListener
            ? [
                EditorView.updateListener.of(updateListener),
            ]
            : [],
        drawSelection(),
        hideCursorOnBlur,
    ];
    
    const view = new EditorView({
        state: EditorState.create({
            doc: value,
            extensions,
        }),
        parent: element,
    });
    
    view._themeCompartment = themeCompartment;
    view._keymapCompartment = keymapCompartment;
    view._langCompartment = langCompartment;
    view._historyCompartment = historyCompartment;
    
    return view;
}
