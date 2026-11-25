import {safeAlign} from 'eslint-plugin-putout';
import {defineConfig} from 'eslint/config';
import {matchToFlat} from '@putout/eslint-flat';

export const match = {
    '**/client/**': {
        'n/no-unpublished-import': 'off',
        'n/no-unsupported-features/node-builtins': 'off',
    },
};

export default defineConfig([safeAlign, matchToFlat(match)]);
