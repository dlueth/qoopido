#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const packages = require('../shared/packages.js');

spawnSync(
	'lerna',
	[
		'exec',
		'--scope',
		'{' + packages.public.join(',') + '}',
		'--no-private',
		'--',
		'rollup -c ./config/rollup.js'
	],
	{
		stdio: 'inherit'
	}
);

/*
const getPackageNames = require('./utils/getPackageNames')
const arrayToGlob = require('./utils/arrayToGlob')

getPackageNames(process.argv, packageNames => {
	const scopeGlob = arrayToGlob(packageNames)

	spawnSync(
		'npx',
		[
			'lerna',
			'exec',
			'--scope',
			scopeGlob,
			'--no-private',
			'--',
			'$LERNA_ROOT_PATH/scripts/build.sh',
		],
		{
			stdio: 'inherit',
		}
	)
	spawnSync('npx', ['lerna', 'run', '--scope', scopeGlob, '--no-private', 'build'], {
		stdio: 'inherit',
	})
})
*/
