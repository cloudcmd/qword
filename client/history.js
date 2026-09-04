import {history, historyKeymap} from '@codemirror/commands';
import {keymap} from '@codemirror/view';

export function clearHistory(view, historyCompartment, vimEnabled) {
    if (!view)
        return;
    
    view.dispatch({
        effects: historyCompartment.reconfigure(vimEnabled
            ? []
            : [
                history(),
                keymap.of(historyKeymap),
            ]),
    });
}
