import {run} from 'madrun';

export default {
    'start': () => 'bin/qword.js package.json',
    'start:dev': async () => `NODE_ENV=development ${await run('start')}`,
    'lint': () => `putout .`,
    'test': () => `NODE_OPTIONS=" --import @supertape/loader-dom --import @supertape/loader-css" tape "client/**/*.spec.js" "server/**/*.spec.js"`,
    'coverage': () => `NODE_OPTIONS=" --import @supertape/loader-dom --import @supertape/loader-css" c8 tape "client/**/*.spec.js" "server/**/*.spec.js"`,
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'build-progress': () => 'rspack build --config rspack.config.js',
    'build:client': () => run('build-progress', '--mode production'),
    'build:client:dev': async () => `NODE_ENV=development ${await run('build-progress')} --mode development`,
    'build:start': () => run(['build:client', 'start']),
    'build:start:dev': () => run([
        'build:client:dev',
        'start:dev',
    ]),
    'watch:server': async () => await run('watch', await run('start')),
    'watch:client': async () => await run('watch', await run('build:client:dev')),
    'watch': () => 'nodemon -w server -w client -x',
    'build': () => run('build:client*'),
    'wisdom': () => run('build'),
    'rm:dist': () => 'rimraf dist',
    'rm:dist-dev': () => 'rimraf dist-dev',
};
