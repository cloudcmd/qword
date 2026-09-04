import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = './client';

const {env} = process;
const isDev = env.NODE_ENV === 'development';

const dist = path.resolve(__dirname, 'dist');
const distDev = path.resolve(__dirname, 'dist-dev');
const devtool = isDev ? 'eval' : 'source-map';
const notEmpty = (a) => a;
const clean = (array) => array.filter(notEmpty);

const rules = clean([{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'builtin:swc-loader',
    options: {
        jsc: {
            parser: {
                syntax: 'ecmascript',
            },
        },
        env: {
            targets: 'defaults',
        },
    },
}, {
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
        'clean-css-loader',
    ],
}, {
    test: /\.(png|gif|svg|woff|woff2|eot|ttf)$/,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: 50_000,
        },
    },
}]);

export default {
    devtool,
    entry: {
        qword: `${dir}/qword.js`,
    },
    output: {
        library: {
            name: 'qword',
            type: 'var',
            export: 'default',
        },
        filename: '[name].js',
        path: isDev ? distDev : dist,
        pathinfo: isDev,
        
        devtoolModuleFilenameTemplate,
    },
    module: {
        rules,
    },
};

function devtoolModuleFilenameTemplate(info) {
    const resource = info.absoluteResourcePath.replace(__dirname + path.sep, '');
    return `file://qword/${resource}`;
}
