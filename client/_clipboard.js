import clipboard from '@cloudcmd/clipboard';
import once from 'once';
import showMessage from './show-message.js';

const showMessageOnce = once(showMessage);

export default function clipboardCommand(command) {
    const {_view, _story} = this;
    const NAME = 'editor-clipboard';
    
    const getSelected = () => {
        const {from, to} = _view.state.selection.main;
        return _view.state.sliceDoc(from, to);
    };
    
    const insert = (text) => {
        const {from, to} = _view.state.selection.main;
        
        _view.dispatch({
            changes: {
                from,
                to,
                insert: text,
            },
        });
    };
    
    if (command === 'copy') {
        const value = getSelected();
        _story.setData(NAME, value);
        
        return clipboard.writeText(value);
    }
    
    if (command === 'cut') {
        const value = getSelected();
        _story.setData(NAME, value);
        insert('');
        
        return clipboard.writeText(value);
    }
    
    return clipboard
        .readText()
        .then(insert)
        .catch(() => {
            showMessageOnce.call(this, 'Could not paste from clipboard. Inner buffer used.');
            insert(_story.getData(NAME));
        });
}
