import {test} from 'supertape';
import {highlightStyle} from './highlight.js';

test('highlight: highlightStyle is defined', (t) => {
    t.ok(highlightStyle);
    t.end();
});

test('highlight: highlightStyle has specs array', (t) => {
    t.ok(Array.isArray(highlightStyle.specs));
    t.end();
});

test('highlight: highlightStyle has keyword class', (t) => {
    const hasKeyword = highlightStyle.specs.some((s) => s.class === 'hl-keyword');
    t.ok(hasKeyword);
    t.end();
});

test('highlight: highlightStyle has function class', (t) => {
    const hasFunction = highlightStyle.specs.some((s) => s.class === 'hl-function');
    t.ok(hasFunction);
    t.end();
});