import Emitify from 'emitify';
import {createEditor} from './create.js';
import {getValue, setValue} from './content.js';
import {
    posFromIndex,
    getCursorIndex,
    getCursor,
} from './position.js';
import {
    markText,
    addLineClass,
    removeLineClass,
} from './decorations.js';
import {setOption} from './options.js';
import {clearHistory} from './history.js';
import {observeResize} from './dom.js';

export default class Editor {
    #view;
    #vimEnabled = false;
    #savedValue = '';
    #emitter;
    constructor(element, options = {}) {
        this.#emitter = Emitify();
        
        this.#view = createEditor(element, {
            ...options,
            updateListener: (update) => {
                if (update.docChanged)
                    this.#emitter.emit('change', {
                        value: this.getValue(),
                        cursor: this.getCursorIndex(),
                    });
                
                if (update.selectionSet)
                    this.#emitter.emit('cursorMove', this.getCursorIndex());
            },
        });
        
        observeResize(this.#view, element);
    }
    
    getValue() {
        return getValue(this.#view);
    }
    
    setValue(value) {
        setValue(this.#view, value);
        return this;
    }
    
    getCursorIndex() {
        return getCursorIndex(this.#view);
    }
    
    getCursor() {
        return getCursor(this.#view);
    }
    
    posFromIndex(index) {
        return posFromIndex(this.#view, index);
    }
    
    focus() {
        this.#view.focus();
        return this;
    }
    
    moveCursorTo(row, column = 0) {
        const line = this.#view.state.doc.line(row + 1);
        
        this.#view.dispatch({
            selection: {
                anchor: line.from + column,
            },
            scrollIntoView: true,
        });
        
        return this;
    }
    
    markRange(from, to, className) {
        return markText(this.#view, from, to, {
            className,
        });
    }
    
    addLineClass(line, className) {
        addLineClass(this.#view, line, 'text', className);
        return this;
    }
    
    removeLineClass(line, className) {
        removeLineClass(this.#view, line, 'text', className);
        return this;
    }
    
    setOption(name, value) {
        if (name === 'keyMap')
            this.#vimEnabled = value === 'vim';
        
        setOption(this.#view, name, value);
        return this;
    }
    
    setMode(mode) {
        return this.setOption('mode', mode);
    }
    
    setTheme(theme) {
        return this.setOption('theme', theme);
    }
    
    setKeyMap(name) {
        return this.setOption('keyMap', name);
    }
    
    setModeForPath(path) {
        return this.setMode(path
            .split('.')
            .pop());
    }
    
    isChanged() {
        return this.getValue() !== this.#savedValue;
    }
    
    clearHistory() {
        clearHistory(
            this.#view,
            this.#view._historyCompartment,
            this.#vimEnabled,
        );
        return this;
    }
    
    on(event, handler) {
        this.#emitter.on(event, handler);
        return this;
    }
    
    emit(...args) {
        this.#emitter.emit(...args);
        return this;
    }
    
    get _view() {
        return this.#view;
    }
}
