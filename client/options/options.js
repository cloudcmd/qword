import {keymap} from '@codemirror/view';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {html} from '@codemirror/lang-html';
import {vim} from '@replit/codemirror-vim';
import {nord} from '@uiw/codemirror-theme-nord';
import {Prec} from '@codemirror/state';
import {
    defaultKeymap,
    emacsStyleKeymap,
    indentWithTab,
    insertNewlineAndIndent,
} from '@codemirror/commands';

import {keepIndentAfterEnterVim} from './vim/keep-indent-after-enter-vim.js';
import {normalizeVimPaste} from './vim/keep-indent-after-vim-paste.js';

const enterKeepIndent = {
    key: 'Enter',
    run: insertNewlineAndIndent,
};

export function keymapExtension(name) {
    if (name === 'vim')
        return [vim(), keepIndentAfterEnterVim, normalizeVimPaste];
    
    if (name === 'emacs')
        return keymap.of([...emacsStyleKeymap, indentWithTab]);
    
    return Prec.highest(keymap.of([enterKeepIndent, indentWithTab, ...defaultKeymap]));
}

export function themeExtension(name) {
    if (name === 'nord' || name === 'dark' || name === 'one-dark')
        return nord;
    
    return [];
}

export const indentKeymap = keymap.of([indentWithTab]);

export function languageExtension(mode) {
    const name = typeof mode === 'object' ? mode?.name : mode;
    
    if (name === 'javascript' || name === 'js')
        return javascript();
    
    if (name === 'json')
        return json();
    
    if (name === 'html')
        return html();
    
    return [];
}

export function setOption(view, key, value) {
    if (key === 'theme')
        return view.dispatch({
            effects: view._themeCompartment.reconfigure(themeExtension(value)),
        });
    
    if (key === 'keyMap')
        return view.dispatch({
            effects: view._keymapCompartment.reconfigure(keymapExtension(value)),
        });
    
    if (key === 'mode')
        return view.dispatch({
            effects: view._langCompartment.reconfigure(languageExtension(value)),
        });
}

