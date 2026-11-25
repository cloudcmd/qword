import {history, historyKeymap} from '@codemirror/commands';
import {keymap} from '@codemirror/view';

export function clearHistory(view, historyCompartment, vimEnabled) {
    if (!view)
        return;

    const effects = [history];

    if (!vimEnabled)
        effects.push(keymap.of(historyKeymap));
    
    view.dispatch({
        effects: historyCompartment.reconfigure(effects),
    });
}
