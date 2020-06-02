const path = require('path');

module.exports = {
	extends: ['plugin:prettier/recommended', 'plugin:import/errors'],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true
		}
	},
	settings: {
		'import/resolver': {
			'node': {},
			'eslint-import-resolver-lerna': {
				packages: path.resolve(__dirname, 'packages')
			},
		}
	}
};
