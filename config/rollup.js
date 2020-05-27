import rimraf from 'rimraf';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import { homepage } from '../package.json';

const packages    = require('../../../shared/packages.js');
const matchSuffix = /\.(\w+)$/;
const matchIndex = /\/index$/;
const paths       = {
    'umd': 'dist',
    'es':  'dist/esm',
    'tmp': 'temp'
};

rimraf.sync('./dist/*');
rimraf.sync('./temp/*');

function getFile(input, format, minified) {
    return paths[format] + input.substr(input.indexOf('/')).replace(matchSuffix, minified ? '.min.$1' : '.$1');
}

function getName(name, input) {
    return name + input.substr(input.indexOf('/')).replace(matchSuffix, '').replace(matchIndex, '');
}

export function configureTemp(options) {
    const external = options.dependencies ? Object.keys(options.dependencies).filter(dependency => packages.public.includes(dependency)) : [];
    const globals  = {};

    external.forEach(item => {
        globals[item] = item;
    });

    return {
        input: options.input,
        output: [
            {
                file: getFile(options.input, 'tmp'),
                name: getName(options.name, options.input),
                format: 'cjs',
                plugins: [],
                globals
            }
        ],
        external,
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            buble()
        ]
    };
}

export function configure(options) {
	const banner   = `/**! ${options.name} ${options.version} | ${homepage} | (c) ${(new Date).getFullYear()} ${options.author.name || options.author} */`;
	const external = options.dependencies ? Object.keys(options.dependencies).filter(dependency => packages.public.includes(dependency)) : [];
	const globals  = {};

	external.forEach(item => {
		globals[item] = item;
	});

	return {
		input: options.input,
		output: [
			{
				file: getFile(options.input, 'umd'),
				name: getName(options.name, options.input),
				format: 'umd',
				sourcemap: true,
				banner: banner,
				plugins: [],
                amd: {
                    define: '(provide || define)'
                },
				globals
			},
			{
				file: getFile(options.input, 'umd', true),
				name: getName(options.name, options.input),
				format: 'umd',
				sourcemap: true,
				plugins: [ terser({ output: { preamble: banner } }) ],
                amd: {
                    define: '(provide || define)'
                },
				globals
			},
			{
				file: getFile(options.input, 'es'),
				format: 'es',
				sourcemap: true,
				banner: banner,
				plugins: []
			},
			{
				file: getFile(options.input, 'es', true),
				format: 'es',
				sourcemap: true,
				plugins: [ terser({ output: { preamble: banner } }) ]
			}
		],
		external,
		plugins: [
			peerDepsExternal(),
			resolve(),
			commonjs(),
            buble()
		]
	};
}

