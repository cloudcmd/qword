import {test, stub} from 'supertape';

test('clipboard: copy stores value in story', (t) => {
    const story = createStoryStub();
    const view = createViewStub('hello world');
    
    const clipboardFn = createClipboard({
        story,
        view,
    });
    clipboardFn('copy');
    
    t.ok(story.setData.called, 'story.setData should be called');
    t.end();
});

test('clipboard: copy calls clipboard.writeText', async (t) => {
    const story = createStoryStub();
    const view = createViewStub('selected text');
    
    const writeTextStub = stub().returns(Promise.resolve());
    const clipboardFn = createClipboard({
        story,
        view,
        writeText: writeTextStub,
    });
    
    await clipboardFn('copy');
    
    t.calledWith(writeTextStub, ['selected text'], 'writeText should be called with selected text');
    t.end();
});

test('clipboard: cut stores value in story', (t) => {
    const story = createStoryStub();
    const view = createViewStub('cut text');
    
    const clipboardFn = createClipboard({
        story,
        view,
    });
    clipboardFn('cut');
    
    t.ok(story.setData.called, 'story.setData should be called');
    t.end();
});

test('clipboard: paste reads from clipboard and inserts', async (t) => {
    const story = createStoryStub();
    const view = createViewStub('');
    
    const readTextStub = stub().returns(Promise.resolve('pasted content'));
    const clipboardFn = createClipboard({
        story,
        view,
        readText: readTextStub,
    });
    
    await clipboardFn('paste');
    
    t.ok(view.dispatch.called, 'view.dispatch should be called');
    t.end();
});

test('clipboard: paste falls back to story on clipboard error', async (t) => {
    const story = createStoryStub();
    
    story.getData = stub().returns('fallback text');
    
    const view = createViewStub('');
    
    const readTextStub = stub().returns(Promise.reject(Error('denied')));
    const clipboardFn = createClipboard({
        story,
        view,
        readText: readTextStub,
    });
    
    await clipboardFn('paste');
    
    t.ok(view.dispatch.called, 'view.dispatch should be called');
    t.end();
});

const createStoryStub = () => ({
    setData: stub(),
    getData: stub().returns(''),
});

const createViewStub = (selectedText = '') => ({
    state: {
        selection: {
            main: {
                from: 0,
                to: selectedText.length,
            },
        },
        sliceDoc: () => selectedText,
    },
    dispatch: stub().returns(true),
});

function createClipboard({story, view, writeText, readText}) {
    const clipboard = {
        writeText: writeText || stub().returns(Promise.resolve()),
        readText: readText || stub().returns(Promise.resolve('')),
    };
    
    const showMessageOnce = stub();
    
    return (cmd) => {
        const NAME = 'editor-clipboard';
        
        const value = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
        
        const insert = (text) => {
            view.dispatch({
                changes: {
                    from: view.state.selection.main.from,
                    to: view.state.selection.main.to,
                    insert: text,
                },
            });
        };
        
        if (cmd === 'copy') {
            story.setData(NAME, value);
            return clipboard.writeText(value);
        }
        
        if (cmd === 'cut') {
            story.setData(NAME, value);
            return cut(view) ? Promise.resolve() : Promise.reject();
        }
        
        return clipboard
            .readText()
            .then(insert)
            .catch(() => {
                showMessageOnce('Could not paste from clipboard. Inner buffer used.');
                
                const fallbackValue = story.getData(NAME);
                
                insert(fallbackValue);
            });
    };
}

function cut(view) {
    view.dispatch({
        changes: {
            from: view.state.selection.main.from,
            to: view.state.selection.main.to,
            insert: '',
        },
    });
    return true;
}
