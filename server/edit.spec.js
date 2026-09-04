import {test} from 'supertape';
import request from 'supertest';
import express from 'express';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {mkdtempSync, writeFileSync, rmSync} from 'node:fs';
import editFn, {setConfigPath} from './edit.js';

const makeApp = () => {
    const app = express();
    app.use(editFn);
    return app;
};

const makeTempConfig = (content) => {
    const dir = mkdtempSync(join(tmpdir(), 'qword-'));
    const file = join(dir, 'config.json');
    writeFileSync(file, content);
    return {
        file,
        cleanup: () => rmSync(dir, {recursive: true, force: true}),
    };
};

test('edit: returns 200 for /edit.json', async (t) => {
    setConfigPath(join(mkdtempSync(join(tmpdir(), 'qword-')), 'config.json'));
    const response = await request(makeApp()).get('/edit.json');
    t.equal(response.status, 200);
    t.end();
});

test('edit: returns json content-type for /edit.json', async (t) => {
    setConfigPath(join(mkdtempSync(join(tmpdir(), 'qword-')), 'config.json'));
    const response = await request(makeApp()).get('/edit.json');
    t.ok(response.headers['content-type'].includes('json'));
    t.end();
});

test('edit: response body has options field', async (t) => {
    setConfigPath(join(mkdtempSync(join(tmpdir(), 'qword-')), 'config.json'));
    const response = await request(makeApp()).get('/edit.json');
    t.ok(response.body.options);
    t.end();
});

test('edit: passes through non-edit.json requests', async (t) => {
    setConfigPath(join(mkdtempSync(join(tmpdir(), 'qword-')), 'config.json'));
    const app = makeApp();
    app.get('/other', (_req, res) => res.json({ok: true}));
    const response = await request(app).get('/other');
    t.equal(response.status, 200);
    t.end();
});

test('edit: merges options from user config', async (t) => {
    const {file, cleanup} = makeTempConfig(JSON.stringify({options: {theme: 'dark'}}));
    setConfigPath(file);
    const response = await request(makeApp()).get('/edit.json');
    t.equal(response.body.options.theme, 'dark');
    cleanup();
    t.end();
});

test('edit: returns 404 when config read fails', async (t) => {
    const {file, cleanup} = makeTempConfig('{}');
    const dir = join(file, '..');
    setConfigPath(dir);
    const response = await request(makeApp()).get('/edit.json');
    t.equal(response.status, 404);
    cleanup();
    t.end();
});
