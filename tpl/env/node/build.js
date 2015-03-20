'use strict';

module.exports = {
	srcBase: 'src/',
	src: {
		js: ['**/*.js']
	},
	distBase: 'dist/',
	config: {
		babel: { optional: ['runtime']/*, experimental: true*/ },
		mocha: { /*bail: true, timeout: 5000*/ }
	}
};
