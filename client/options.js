import {keymap} from '@codemirror/view';
import {javascriptLanguage} from '@codemirror/lang-javascript';
import {jsonLanguage} from '@codemirror/lang-json';
import {htmlLanguage} from '@codemirror/lang-html';
import {indentOnInput} from '@codemirror/language';
import {vim} from '@replit/codemirror-vim';
import {nord} from '@uiw/codemirror-theme-nord';
import {
    defaultKeymap,
    emacsStyleKeymap,
    indentWithTab,
} from '@codemirror/commands';

export function keymapExtension(name) {
    if (name === 'vim')
        return vim();
    
    if (name === 'emacs')
        return keymap.of([...emacsStyleKeymap, indentWithTab]);
    
    return keymap.of([...defaultKeymap, indentWithTab]);
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
        return [javascriptLanguage, indentOnInput()];
    
    if (name === 'json')
        return [jsonLanguage, indentOnInput()];
    
    if (name === 'html')
        return [htmlLanguage, indentOnInput()];
    
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
