// Character offset into source text (0-indexed, matches CM6) — same convention as putout-editor's codemirror-adapter.
export type CharOffset = number;

// Line/column position — matches CodeMirror's {line, ch} convention.
export type SourcePosition = {
    line: number;
    ch: number;
};

// CodeMirror editor mode string — e.g. 'javascript', 'json', 'html'.
export type EditorMode = string;

// CodeMirror key map name.
export type KeyMap =
    | 'vim'
    | 'emacs'
    | 'sublime'
    | 'default';

// Editor theme name.
export type EditorTheme =
    | 'nord'
    | 'default'
    | 'dark'
    | 'one-dark';

// JavaScript/TypeScript source code.
export type SourceCode = string;
