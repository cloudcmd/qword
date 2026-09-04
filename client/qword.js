import '../css/qword.css';
import * as smalltalk from 'smalltalk';
import jssha from 'jssha';
import load from 'load.js';
import {createPatch} from 'daffy';
import * as restafary from 'restafary/client';
import {tryToCatch} from 'try-to-catch';
import Editor from './editor.js';
import Story from './story.js';
import _clipboard from './_clipboard.js';
import save from './save.js';
import _initSocket from './_init-socket.js';
import _onSave from './_on-save.js';
import showMessage from './show-message.js';
import loadRemote, {loadModules, loadOptions} from './loadremote.js';

const noop = () => {};

export default class Qword extends Editor {
    constructor(element, options = {}, callback = noop) {
        super(element, options);

        this._TITLE        = 'Qword';
        this._story        = Story();
        this._savedValue   = '';
        this._filename     = '';
        this._maxSize      = options.maxSize || 512_000;
        this._PREFIX       = options.prefix || '/qword';
        this._prefixSocket = options.prefixSocket || '/qword';
        this._socketPath   = options.socketPath || '';

        restafary.prefix(`${this._PREFIX}/api/v1/fs`);
        this._init().then(() => callback(this));
    }

    async _init() {
        const [error, config] = await tryToCatch(load.json, `${this._PREFIX}/edit.json`);

        if (error)
            return smalltalk.alert(this._TITLE, 'Could not load edit.json!');

        this._Config = config;

        await Promise.all([
            loadOptions(this._PREFIX),
            loadModules(this._PREFIX),
        ]);

        await loadRemote('socket', {prefix: this._socketPath});
        this._initSocket();
    }

    setValueFirst(name, value) {
        this.setModeForPath(name);
        this.setValue(value);
        this._filename   = name;
        this._savedValue = value;
        this.clearHistory();
        this.moveCursorTo(0, 0);
        return this;
    }

    sha() {
        const sha = new jssha('SHA-1', 'TEXT');
        sha.update(this.getValue());
        return sha.getHash('HEX');
    }

    evaluate() {
        if (!this._filename?.endsWith('.js'))
            return smalltalk.alert(this._TITLE, 'JS only');

        try {
            new Function(this.getValue())();
        } catch (error) {
            smalltalk.alert(this._TITLE, error.message);
        }

        return this;
    }

    goToLine() {
        const number = Number(prompt('Line number'));

        if (!number)
            return;

        const line = this._view.state.doc.line(number);
        this._view.dispatch({selection: {anchor: line.from}, scrollIntoView: true});
        this.focus();
    }

    remove(direction) {
        const {state} = this._view;
        const {from, to} = state.selection.main;
        const isCollapsed = from === to;

        if (direction === 'right') {
            const end = isCollapsed ? to + 1 : to;
            this._view.dispatch({changes: {from, to: end, insert: ''}});
        } else {
            const start = isCollapsed ? from - 1 : from;
            if (start >= 0)
                this._view.dispatch({changes: {from: start, to, insert: ''}});
        }

        return this;
    }

    selectAll() {
        const {doc} = this._view.state;
        this._view.dispatch({selection: {anchor: 0, head: doc.length}});
        return this;
    }

    enableKey() {
        return this;
    }

    cutToClipboard()     { return this._clipboard('cut'); }
    copyToClipboard()    { return this._clipboard('copy'); }
    pasteFromClipboard() { return this._clipboard('paste'); }

    _patchHttp(path, patch) {
        restafary.patch(path, patch, this._onSave.bind(this));
    }

    _writeHttp(path, data) {
        restafary.write(path, data, this._onSave.bind(this));
    }

    async _doDiff(path) {
        const equal = await this._story.checkHash(path).catch(() => false);
        return equal ? '' : createPatch(this._savedValue || '', this.getValue());
    }
}

Qword.prototype._clipboard  = _clipboard;
Qword.prototype.save        = save;
Qword.prototype._onSave     = _onSave;
Qword.prototype._initSocket = _initSocket;
Qword.prototype.showMessage = showMessage;
