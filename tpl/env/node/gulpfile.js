'use strict';

var path = require('path'),
	gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	vinylPaths = require('vinyl-paths'),
	rimraf = require('rimraf'),
	through = require('through'),
	mergeStream = require('merge-stream'),
	reverseStream = require('reversepoint'),
	uniqueStream = require('unique-stream'),
	globManip = require('glob-manipulate'),
	chalk = require('chalk'),
	build = require('./build'),
	copySrc = ['**'].concat(globManip.negate(build.src.js));

function runTests() {
	// Wait until all data is finished being piped into the stream (discarding this data),
	// then pass through the data from the mocha stream.
	return through(function() {}, function() {
		var mochaStream = gulp.src(build.distBase + 'test/*.js', { read: false })
			.pipe(plugins.mocha(build.config.mocha));
		['data', 'end', 'error'].forEach(function(event) {
			mochaStream.on(event, this.emit.bind(this, event));
		}, this);
	});
}

gulp.task('clean', function(cb) {
	rimraf(build.distBase, cb);
});

gulp.task('build', ['clean'], function() {
	return mergeStream(
		plugins.srcOrderedGlobs(globManip.prefix(build.src.js, build.srcBase), { base: build.srcBase })
			.pipe(plugins.eslint())
			.pipe(plugins.eslint.format())
			.pipe(plugins.eslint.failAfterError())
			.pipe(plugins.babel(build.config.babel))
			.on('error', function(err) {
				// workaround Windows command prompt color issue and hide call stack
				console.log(err.message);
				process.exit(1);
			}),
		plugins.srcOrderedGlobs(globManip.prefix(copySrc, build.srcBase), { base: build.srcBase })
	)
		.pipe(gulp.dest(build.distBase))
		.pipe(runTests());
});

gulp.task('default', ['clean'], function() {
	var srcToDistRelativePath = path.relative(build.srcBase, build.distBase);

	// Diagram reference: https://github.com/es6rocks/slush-es20xx/issues/5#issue-52701608
	return plugins.watch(build.srcBase + '**', { base: build.srcBase, ignoreInitial: false }, plugins.batch(function(files) {
		// plumber + unique filter
		files = files
			.pipe(plugins.plumber(function(err) {
				// [[TEMP]] workaround until this is merged: https://github.com/babel/gulp-babel/pull/22
				if (err.plugin === 'gulp-babel') err.showProperties = false;

				plugins.util.log(err.toString());
			}))
			.pipe(reverseStream())
			.pipe(uniqueStream('path'));

		var existingFiles = files
			.pipe(plugins.filter(function(file) {
				return file.event === 'change' || file.event === 'add';
			}));

		return mergeStream(
				// js pipe
				existingFiles
					.pipe(plugins.filter(build.src.js))
					.pipe(plugins.eslint())
					.pipe(plugins.eslint.format())
					.pipe(plugins.babel(build.config.babel))
					.pipe(gulp.dest(build.distBase)),

				// copy pipe
				existingFiles
					.pipe(plugins.filter(copySrc))
					.pipe(gulp.dest(build.distBase)),

				// deletion pipe
				files
					.pipe(plugins.filter(function(file) {
						return file.event === 'unlink';
					}))
					.pipe(plugins.rename(function(filePath) {
						// we can't change/remove the filePath's `base`, so cd out of it in the dirname
						filePath.dirname = path.join(srcToDistRelativePath, filePath.dirname);
					}))
					.pipe(vinylPaths(rimraf))
			)
			.pipe(runTests());
	}, function(err) {
		// TODO remove domain err handler
		console.log(chalk.red('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!domain err handler!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));
		plugins.util.log(chalk.red('Detected uncaught error'), err);
	})).on('ready', function() {
		plugins.util.log('Watching ' + chalk.magenta(build.srcBase) + ' directory for changes...');
	});
});

// TODO https://github.com/sindresorhus/gulp-mocha/pull/87
