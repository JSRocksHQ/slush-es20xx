'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var mergeStream = require('merge-stream');
var globManip = require('glob-manipulate');
var build = require('./build');
var copySrc = ['**'].concat(globManip.negate(build.src.js));

// Run unit tests in complete isolation, see https://github.com/es6rocks/harmonic/issues/122#issuecomment-85333442
function runTests(cb, opt) {
	gulp.src(build.distBase + 'test/*.js', { base: build.distBase, read: false })
		.pipe(plugins.shell('mocha ' + build.config.mocha + ' "<%= file.path %>"', opt))
		.on('end', cb)
		.resume(); // Not actually necessary (gulp-shell already calls `.resume()`), just to be safe.
}

gulp.task('clean', function(cb) {
	rimraf(build.distBase, cb);
});

gulp.task('build', ['clean'], function(cb) {
	// [[gulp4]] TODO remove srcOrderedGlobs
	mergeStream(
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
		.on('end', function() {
			runTests(cb);
		})
		.resume();
});

gulp.task('default', ['clean'], function(cb) {
	var path = require('path');
	var vinylPaths = require('vinyl-paths');
	var streamify = require('stream-array');
	var chalk = require('chalk');

	var srcToDistRelativePath = path.relative(build.srcBase, build.distBase);
	var SIGINTed = false;

	// Diagram reference: https://github.com/es6rocks/slush-es20xx/issues/5#issue-52701608 // TODO update diagram
	var batched = batch(function(files, cb) {
		files = files
			.pipe(plugins.plumber(function(err) {
				// [[TEMP]] workaround until this is merged: https://github.com/babel/gulp-babel/pull/22
				if (err.plugin === 'gulp-babel') err.showProperties = false;

				plugins.util.log(err.toString());
			}));

		var existingFiles = files
			.pipe(plugins.filter(function(file) {
				return file.event === 'change' || file.event === 'add';
			}));

		mergeStream(
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
			.on('end', function() {
				runTests(function() {
					cb();
					maybeEndTask();
				}, { ignoreErrors: true });
			})
			.resume();
	});

	var watchStream = plugins.watch(build.srcBase + '**', { base: build.srcBase, ignoreInitial: false }, batched).on('ready', function() {
		plugins.util.log('Watching ' + chalk.magenta(build.srcBase) + ' directory for changes...');
	}).on('end', maybeEndTask);

	var rl;
	if (process.platform === 'win32') {
		rl = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout,
		}).on('SIGINT', function() {
			process.emit('SIGINT');
		});
	}

	process.on('SIGINT', function() {
		if (SIGINTed) return;
		SIGINTed = true;
		watchStream.close();
	});

	function maybeEndTask() {
		if (!SIGINTed || batched.isActive()) return;
		if (rl) rl.close();
		cb();
	}

	// TODO move to own package?
	// Simplified fork of gulp-batch, with removed domains (async-done) and added most recent + unique('path') deduping logic.
	// Added isActive() method which returns whether the callback is currently executing or if there are any batched/queued files waiting for execution.
	function batch(cb) {

		var batch = [];
		var holdOn = false;
		var timeout;
		var delay = 100; // ms

		function setupFlushTimeout() {
			if (!holdOn && batch.length) {
				timeout = setTimeout(flush, delay);
			}
		}

		function flush() {
			holdOn = true;
			cb(streamify(batch), function() {
				holdOn = false;
				setupFlushTimeout();
			});
			batch = [];
		}

		function doBatch(newFile) {
			if (!batch.some(function(file, idx) {
				if (newFile.path === file.path) {
					batch[idx] = newFile;
					return true;
				}
			})) batch.push(newFile);

			clearTimeout(timeout);
			setupFlushTimeout();
		};

		doBatch.isActive = function() {
			return !!(holdOn || batch.length);
		};

		return doBatch;
	};
});
