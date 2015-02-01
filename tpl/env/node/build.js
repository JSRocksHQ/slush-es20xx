'use strict';

module.exports = {
	srcBase: 'src/',
	src: {
		js: ['**/*.js']
	},
	distBase: 'dist/',
	config: {
		jscs: { configPath: '.jscsrc', esnext: true },
		'6to5': { optional: ['selfContained']/*, experimental: true*/ },
		mocha: { /*bail: true, timeout: 5000*/ }
	}
};
