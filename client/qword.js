import '../css/qword.css';
import {EditorState, Compartment} from '@codemirror/state';
import {
    EditorView,
    keymap,
    lineNumbers,
    highlightActiveLine,
} from '@codemirror/view';
import {
    history,
    historyKeymap,
    defaultKeymap,
} from '@codemirror/commands';
import {
    syntaxHighlighting,
    defaultHighlightStyle,
} from '@codemirror/language';
import {oneDark} from '@codemirror/theme-one-dark';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {html} from '@codemirror/lang-html';
import Emitify from 'emitify';
import * as smalltalk from 'smalltalk';
import jssha from 'jssha';
import load from 'load.js';
import {createPatch} from 'daffy';
import * as restafary from 'restafary/client';
import {tryCatch} from 'try-catch';
import Story from './story.js';
import loadRemote, {loadModules, loadOptions} from './loadremote.js';
import _clipboard from './_clipboard.js';
import save from './save.js';
import _initSocket from './_init-socket.js';
import _onSave from './_on-save.js';
import showMessage from './show-message.js';

const isFn = (a) => typeof a === 'function';
const isString = (a) => typeof a === 'string';

export default function Qword(el, options = {}, callback = () => {}) {
    if (!(this instanceof Qword))
        return new Qword(el, options, callback);

    if (isFn(options)) {
        callback = options;
        options = {};
    }

    this._DIR = '/modules/';
    this._TITLE = 'Qword';

    this._story = Story();

    this._Separator = '\n';
    this._isKey = true;

    this._Element = isString(el) ? document.querySelector(el) : el || document.body;

    if (!this._Element)
        throw Error('Qword: element not found');

    this._maxSize = options.maxSize || 512_000;

    this._PREFIX = options.prefix || '/qword';

    this._prefixSocket = options.prefixSocket || '/qword';

    this._socketPath = options.socketPath || '';

    this._Emitter = Emitify();

    this._view = null;

    this._pendingValue = null;

    this._modeCompartment = new Compartment();
    this._keymapCompartment = new Compartment();
    this._fontCompartment = new Compartment();

    this._Element.addEventListener('drop', this._onDrop.bind(this));

    this._Element.addEventListener('dragover', this._onDragOver.bind(this));

    this
        ._init()
        .then(() => callback(this));

    this._patch = (path, patch) => {
        this._patchHttp(path, patch);
    };

    this._write = (path, result) => {
        this._writeHttp(path, result);
    };
}

Qword.prototype._init = async function() {
    const prefix = this._PREFIX;

    await Promise.all([
        loadOptions(prefix),
        loadModules(prefix),
    ]);

    await loadRemote('socket', {
        prefix: this._socketPath,
    });

    restafary.prefix(`${this._PREFIX}/api/v1/fs`);

    this._initEditor();

    if (this._pendingValue !== null) {
        this.setValue(this._pendingValue);
        this._pendingValue = null;
    }

    this._initSocket();

    return this;
};

Qword.prototype._loadOptions = async function() {
    const url = this._PREFIX + '/options.json';

    if (this._Options)
        return this._Options;

    const data = await load.json(url);

    this._Options = data;

    return data;
};

Qword.prototype._initEditor = function() {
    const extensions = [
        lineNumbers(),
        history(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle),
        oneDark,
        this._modeCompartment.of(javascript()),
        keymap.of([
            ...defaultKeymap,
            ...historyKeymap, {
                key: 'Mod-s',

                run: () => {
                    if (this._isKey)
                        this.save();

                    return true;
                },
            },
        ]),
    ];

    const state = EditorState.create({
        doc: '',
        extensions,
    });

    this._view = new EditorView({
        state,
        parent: this._Element,
    });
};

Qword.prototype.getValue = function() {
    return this._view.state.doc.toString();
};

Qword.prototype.setValue = function(value) {
    if (!this._view) {
        this._pendingValue = value;
        return this;
    }

    this._view.dispatch({
        changes: {
            from: 0,
            to: this._view.state.doc.length,
            insert: value,
        },
    });

    return this;
};

Qword.prototype.focus = function() {
    this._view.focus();

    return this;
};

Qword.prototype.getCursor = function() {
    const pos = this._view.state.selection.main.head;

    const line = this._view.state.doc.lineAt(pos);

    return {
        row: line.number - 1,
        column: pos - line.from,
    };
};

Qword.prototype.moveCursorTo = function(row, column = 0) {
    const line = this._view.state.doc.line(row + 1);

    this._view.dispatch({
        selection: {
            anchor: line.from + column,
        },

        scrollIntoView: true,
    });

    return this;
};

Qword.prototype.remove = function(direction) {
    const pos = this._view.state.selection.main.head;

    this._view.dispatch({
        changes: direction === 'right' ? {
            from: pos,
            to: pos + 1,
        } : {
            from: pos - 1,
            to: pos,
        },
    });

    return this;
};

Qword.prototype.setModeForPath = function(path) {
    const ext = path
        .split('.')
        .pop();

    let lang = javascript();

    if (ext === 'json')
        lang = json();

    if (ext === 'html')
        lang = html();

    this._view.dispatch({
        effects: this._modeCompartment.reconfigure(lang),
    });

    return this;
};

Qword.prototype.setValueFirst = function(name, value) {
    this.setModeForPath(name);

    this.setValue(value);

    this._FileName = name;
    this._Value = value;

    this.moveCursorTo(0, 0);

    return this;
};

Qword.prototype.addKeyMap = function(map) {
    const bindings = Object
        .entries(map)
        .map(([key, fn]) => ({
            key,

            run: () => {
                fn.call(this);

                return true;
            },
        }));

    this._view.dispatch({
        effects: this._keymapCompartment.reconfigure(keymap.of(bindings)),
    });

    return this;
};

Qword.prototype.on = function(event, fn) {
    this._Emitter.on(event, fn);

    return this;
};

Qword.prototype.emit = function(...args) {
    this._Emitter.emit(...args);

    return this;
};

Qword.prototype.isChanged = function() {
    return this.getValue() !== this._Value;
};

Qword.prototype._doDiff = async function(path) {
    const value = this.getValue();

    const patch = this._diff(value);
    const equal = await this._story.checkHash(path);

    return equal ? patch : '';
};

Qword.prototype._diff = function(newValue) {
    return createPatch(this._Value || '', newValue);
};

Qword.prototype._patchHttp = function(path, patch) {
    restafary.patch(path, patch, this._onSave.bind(this));
};

Qword.prototype._writeHttp = function(path, result) {
    restafary.write(path, result, this._onSave.bind(this));
};

Qword.prototype.evaluate = function() {
    if (!this._FileName?.endsWith('.js'))
        return smalltalk.alert(this._TITLE, 'JS only');

    const [e] = tryCatch(new Function(this.getValue()));

    if (e)
        smalltalk.alert(this._TITLE, e.message);

    return this;
};

Qword.prototype.goToLine = function() {
    const num = Number(prompt('Line number'));

    if (!num)
        return;

    const line = this._view.state.doc.line(num);

    this._view.dispatch({
        selection: {
            anchor: line.from,
        },

        scrollIntoView: true,
    });

    this.focus();
};

Qword.prototype._clipboard = _clipboard;

Qword.prototype.save = save;

Qword.prototype._onSave = _onSave;

Qword.prototype._initSocket = _initSocket;

Qword.prototype._onDragOver = function(event) {
    event.preventDefault();

    event.dataTransfer.dropEffect = 'copy';
};

Qword.prototype._onDrop = function(event) {
    event.preventDefault();

    const [file] = event.dataTransfer.files;

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = (e) => {
        this.setValue(e.target.result);
    };

    reader.readAsText(file);
};

Qword.prototype.sha = function() {
    const shaObj = new jssha('SHA-1', 'TEXT');

    shaObj.update(this.getValue());

    return shaObj.getHash('HEX');
};

Qword.prototype.setOptions = function(options) {
    const theme = EditorView.theme({
        '&': {
            fontSize: options.fontSize,
            fontFamily: options.fontFamily,
        },
    });

    this._view.dispatch({
        effects: this._fontCompartment.reconfigure(theme),
    });

    return this;
};

Qword.prototype.showMessage = showMessage;

