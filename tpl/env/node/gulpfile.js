'use strict';

var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	rimraf = require('rimraf'),
	through = require('through'),
	mergeStream = require('merge-stream'),
	lazypipe = require('lazypipe'),
	chalk = require('chalk'),
	build = require('./build.json'),
	handleJs = lazypipe()
		.pipe(plugins.jshint)
		.pipe(plugins.jshint.reporter, 'jshint-stylish')
		.pipe(plugins.jshint.reporter, 'fail')
		.pipe(plugins.jscs, { configPath: '.jscsrc', esnext: true })
		.pipe(plugins['6to5']/*, { blacklist: ['generators'] }*/)
		.pipe(gulp.dest, build.distBase),
	handleCopy = lazypipe()
		.pipe(gulp.dest, build.distBase),
	runTests = lazypipe()
		.pipe(gulp.src, build.distBase + 'test/*.js', { read: false })
		.pipe(plugins.mocha/*, { bail: true, timeout: 5000 }*/);

function negateGlobs(globs) {
	return globs.map(function(glob) {
		return ~glob.lastIndexOf('!', 0) ? glob.slice(1) : '!' + glob;
	});
}

function prefixGlobs(globs, prefix) {
	return globs.map(function(glob) {
		return ~glob.lastIndexOf('!', 0) ? '!' + prefix + glob.slice(1) : prefix + glob;
	});
}

function runAfterEnd(cb) {
	// This is basically a passThrough stream for the callback's stream.
	// It waits until all data is finished being piped into it and discards this data,
	// then passes through the data from the stream provided by the callback.
	return through(function() {}, function() {
		var cbStream = cb();
		['data', 'end'/*, 'error'*/].forEach(function(event) {
			cbStream.on(event, this.emit.bind(this, event));
		}, this);
	});
}

gulp.task('build', function() {
	rimraf.sync(build.distBase);
	var jsSrc = prefixGlobs(build.src.js, build.srcBase),
		copySrc = [build.srcBase + '**'].concat(negateGlobs(jsSrc));
	return mergeStream(
			gulp.src(jsSrc, { base: build.srcBase }).pipe(handleJs()),
			gulp.src(copySrc, { base: build.srcBase }).pipe(handleCopy())
		)
		.pipe(runAfterEnd(runTests));
});

// `neverEnd` receives a task conclusion callback which is never called as to signal that this watch task should never end.
// We don't return gulp-watch's endless stream as it would fail the task in the first stream error.
gulp.task('default', ['build'], function(neverEnd) {
	function filterEvent(events, file) {
		return events.indexOf(file.event) !== -1;
	}

	plugins.watch(build.srcBase + '**', { base: build.srcBase }, function(files) {
		// TODO filter buffers with repeated file paths
		// TODO optimize
		var jsFilter = plugins.filter(build.src.js),
			copyFilter = plugins.filter(negateGlobs(build.src.js)),
			existsFilter = plugins.filter(filterEvent.bind(null, ['changed', 'added'])),
			deletedFilter = plugins.filter(filterEvent.bind(null, ['deleted'])),
			existsStream = files.pipe(existsFilter);

		return mergeStream(
			existsStream
				.pipe(jsFilter)
				.pipe(handleJs()),
			existsStream
				.pipe(copyFilter)
				.pipe(handleCopy()), // TODO FIXME: this seems broken
			files.pipe(deletedFilter)
				.pipe(plugins.rimraf()) // TODO FIXME: this seems broken
		)
		.pipe(runAfterEnd(runTests));
	}).on('ready', function() {
		plugins.util.log('Watching ' + chalk.magenta(build.srcBase) + ' directory for changes...');
	}).on('error', function(err) {
		console.error(err.message);
	});
});
