'use strict';

var fs = require('fs');
var glob = require('glob');

new glob.Glob('tpl/**/.npmignore')
	.on('match', function(path) {
		fs.rename(path, path.replace(/\.npmignore$/, '.gitignore'), function(err) {
			if (err) throw err;
		});
	})
	.on('error', function(err) {
		throw err;
	});
