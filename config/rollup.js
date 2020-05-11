import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import { homepage } from '../package.json';

const packages = require('../../../shared/packages.js');

export default (options) => {
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
				file: 'dist/umd/index.js',
				name: options.name,
				format: 'umd',
				sourcemap: true,
				banner: banner,
				plugins: [],
				globals
			},
			{
				file: 'dist/umd/index.min.js',
				name: options.name,
				format: 'umd',
				sourcemap: true,
				plugins: [ terser({ output: { preamble: banner } }) ],
				globals
			},
			{
				file: 'dist/es/index.js',
				format: 'es',
				sourcemap: true,
				banner: banner,
				plugins: []
			},
			{
				file: 'dist/es/index.min.js',
				format: 'es',
				sourcemap: true,
				plugins: [ terser({ output: { preamble: banner } }) ]
			}
		],
		external,
		plugins: [
			peerDepsExternal(),
			cleaner({ targets: [ './dist/' ] }),
			resolve(),
			commonjs(),
			// resolve({ extensions: [ '.js' ], browser: true }),
			// commonjs({ include: '../../node_modules/**' })
		]
	};
}

