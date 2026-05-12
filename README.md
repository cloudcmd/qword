# Qword [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL]

[NPMIMGURL]: https://img.shields.io/npm/v/qword.svg?style=flat
[BuildStatusURL]: https://github.com/cloudcmd/qword/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/cloudcmd/qword/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPM_INFO_IMG]: https://nodei.co/npm/qword.png?downloads=true&&stars&&downloadRank "npm install qword"
[NPMURL]: https://npmjs.org/package/qword "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[edit.json]: https://github.com/cloudcmd/qword/tree/master/json/edit.json "edit.json"

Web editor based on [CodeMirror](http://codemirror.net).
Fork of [edward](https://github.com/cloudcmd/edward "Edward").

<img width="601" height="295" alt="image" src="https://github.com/user-attachments/assets/e632f48a-ef74-4d5c-bbe8-8f6e44151d00" />


## Features

- Syntax highlighting based on extension of file for over 90 languages.
- Built-in `emmet` (for html files)
- Drag n drop (drag file from desktop to editor).
- Configurable options ([json/edit.json][edit.json] could be overriden by `~/.qword.json`)

## Install

```
npm i qword -g
```

![NPM\_INFO][NPM_INFO_IMG]

## Command line parameters

Usage: `qword [filename]`

|Parameter              |Operation
|:----------------------|:--------------------------------------------
| `-h, --help`          | display help and exit
| `-v, --version`       | output version information and exit

## Hot keys

|Key                    |Operation
|:----------------------|:--------------------------------------------
| `Ctrl + s`            | save
| `Ctrl + f`            | find
| `Ctrl + h`            | replace
| `Ctrl + g`            | go to line
| `Ctrl + e`            | evaluate (JavaScript only supported)

## API

qword could be used as middleware for [express](http://expressjs.com "Express").
For this purpuse API could be used.

### Server

#### qword(options)

Middleware of `qword`. Options could be omitted.

```js
import {qword} from 'qword';
import express from 'express';

const app = express();

app.use(qword({
    root: '/', // default
    online: true, // default
    diff: true, // default
    zip: true, // default
    dropbox: false, // optional
    dropboxToken: 'token', //  optional
}));

app.listen(31_337);
```

#### qword.listen(socket)

Could be used with [socket.io](http://socket.io "Socket.io") to handle editor events with.

```js
import {Server} from 'socket.io';

const socket = new Server(server);

qword.listen(socket, {
    // optional
    prefixSocket: '/qword',
    // optional
    auth: (accept, reject) => (username, password) => {
        accept();
    },
});
```

### Client

qword uses [codemirror](http://codemirror.net/ "CodeMirror") on client side, so API is similar.
All you need is put minimal `html`, `css`, and `js` into your page.

Minimal html:

```html
<div class="edit" data-name="js-edit"></div>
<script src="/qword/qword.js"></script>
```

Minimal css:

```css
html, body, .edit {
    height: 100%;
    margin: 0;
}
```

Minimal js:

```js
qword('[data-name="js-edit"]', (editor) => {
    editor.setValue('hello qword');
    console.log('qword is ready');
});
```

#### Client API

##### `qword(selector, callback)`

- `selector`: **string**
- `callback`: **EditorCallback**

Initialize new instance

###### `editor.setValue(value)`

- `value`: **string**

Set value to `editor`.

###### `editor.getValue()`

- `returns`: **string**

Get value from editor.

##### Types

```ts
interface Editor {
    setValue: (value: string) => void;
    getValue: () => string;
}

type EditorCallback = (editor: Editor) => void;
type qword = (selector: string, callback: EditorCallback) => void;
```

For more information you could always look around `client/qword.js` directory.

## Related

- [Edward](https://github.com/cloudcmd/edward "Edwdard") - web editor based on [Ace](https://ace.c9.io "Ace").
- [Deepword](https://github.com/cloudcmd/deepword "Deepword") - web editor based on [Monaco](https://microsoft.github.io/monaco-editor/ "Monaco").

## License

MIT
