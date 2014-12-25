'use strict';

var fs = require('fs'),
	path = require('path'),
	gulp = require('gulp'),
	install = require('gulp-install'),
	conflict = require('gulp-conflict'),
	template = require('gulp-template'),
	inquirer = require('inquirer'),
	_ = require('lodash'),
	chalk = require('chalk');

function spaceSeparatedStrToArray(str) {
	return str.trim().split(/\s+/);
}

gulp.task('default', function(done) {
	inquirer.prompt([
		{ name: 'env', message: 'Environment:', type: 'list', choices: [
			{ value: 'node', name: 'Node.js' },
			new inquirer.Separator('(more environments coming soon)')
			// { value: 'browser', name: 'Browser' }
		]},
		{ when: _.createCallback({ env: 'node' }), name: 'pkgName', message: 'Package name:', default: path.basename(process.cwd()) },
		{ when: _.createCallback({ env: 'node' }), name: 'pkgDescription', message: 'Package description:', default: 'My awesome ES6 package' },
		{ when: _.createCallback({ env: 'node' }), name: 'keywords', message: 'Keywords (space-separated):', default: 'es6 hello-world' },
		{ when: _.createCallback({ env: 'node' }), name: 'installFlags', default: '--save', message: function(answers) {
			return 'Recommended flag(s) for ' + chalk.bgGreen(' npm install ' + answers.pkgName + ' ');
		}},
		{ when: _.createCallback({ env: 'node' }), name: 'enginesNode', message: 'Compatible Node.js versions:', default: '>= 0.10' },
		{ when: _.createCallback({ env: 'node' }), name: 'travisNode', message: 'Node.js versions to use in Travis CI (space-separated):', default: '0.10 0.11' },
		{ when: _.createCallback({ env: 'node' }), name: 'authorName', message: 'Author name:', default: 'Ult Combo' },
		{ when: _.createCallback({ env: 'node' }), name: 'authorEmail', message: 'Author email:', default: 'ultcombo@gmail.com' },
		{ name: 'ghUser', message: 'GitHub repository owner username:', default: 'UltCombo' },
		{ name: 'ghRepo', message: 'GitHub repository name:', default: function(answers) { return answers.pkgName; } },
		{ name: 'homepage', message: 'Project homepage:', default: function(answers) { return 'https://github.com/' + answers.ghUser + '/' + answers.ghRepo; } },
		{ name: 'license', message: 'License:', type: 'list', choices: fs.readdirSync(__dirname + '/tpl/licenses') },
		{ type: 'confirm', name: 'moveon', message: 'Continue?' },
	], function(answers) {
		if (!answers.moveon) return done();

		['keywords', 'travisNode'].forEach(function(prop) {
			answers[prop] = spaceSeparatedStrToArray(answers[prop]);
		});

		answers.currentYear = new Date().getFullYear();

		gulp.src([
			__dirname + '/tpl/env/' + answers.env + '/**',
			__dirname + '/tpl/licenses/' + answers.license + '/**'
		], { dot: true })
			// Setting the interpolate option in order to not conflict with ES6 template strings
			.pipe(template(answers, { interpolate: /<%=([\s\S]+?)%>/g }))
			.pipe(conflict('.'))
			.pipe(gulp.dest('.'))
			.pipe(install())
			.on('end', function() {
				console.log(chalk.green(
					'All set!\n' +
					'Run ' + chalk.white.bgGreen(' npm run dev ') + ' and hack the ' +
					chalk.white.bgGreen(' src ') + ' directory!'
				));
				done();
			})
			.resume();
	});
});
