import {
    createEditor,
    setValue,
    positionToOffset,
    setOption,
} from '../client/index.js';

const view = createEditor(document.body);

// THROWS Argument of type 'number' is not assignable to parameter of type 'string'
setValue(view, 5);

// THROWS Argument of type 'number' is not assignable to parameter of type 'SourcePosition'
positionToOffset(view.state.doc, 5);

// THROWS Argument of type '"bogus"' is not assignable to parameter of type 'OptionKey'
setOption(view, 'bogus', 'dark');

// THROWS Argument of type '5' is not assignable to parameter of type 'OptionValue'
setOption(view, 'theme', 5);

