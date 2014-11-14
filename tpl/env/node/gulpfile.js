'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	to5 = require('gulp-6to5'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	mocha = require('gulp-mocha'),
	gulpFilter = require('gulp-filter'),
	gulpRimraf = require('gulp-rimraf'),
	rimraf = require('rimraf'),
	through = require('through'),
	mergeStream = require('merge-stream'),
	lazypipe = require('lazypipe'),
	chalk = require('chalk'),
	baseSrc = 'src',
	jsSrc = 'src/**/*.js',
	copySrc = ['src/**', '!' + jsSrc], // TODO refactor -- get this data from JSON
	handleJs = lazypipe()
		.pipe(jshint)
		.pipe(jshint.reporter, 'jshint-stylish')
		.pipe(jshint.reporter, 'fail')
		.pipe(jscs, { configPath: '.jscsrc', esnext: true })
		.pipe(to5/*, { blacklist: ['generators'] }*/)
		.pipe(gulp.dest, 'dist'),
	handleCopy = lazypipe()
		.pipe(gulp.dest, 'dist');

function runTests() {
	return gulp.src('dist/test/*.js', { read: false })
		.pipe(mocha(/*{ bail: true, timeout: 5000 }*/));
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
	rimraf.sync('dist');
	return mergeStream(
			gulp.src(jsSrc, { base: baseSrc }).pipe(handleJs()),
			gulp.src(copySrc, { base: baseSrc }).pipe(handleCopy())
		)
		.pipe(runAfterEnd(runTests));
});

// `neverEnd` receives a task conclusion callback which is never called as to signal that this watch task should never end.
// We don't return gulp-watch's endless stream as it would fail the task in the first stream error.
gulp.task('default', ['build'], function(neverEnd) {
	function filterEvent(events, file) {
		return events.indexOf(file.event) !== -1;
	}

	watch('src/**', { base: baseSrc }, function(files) {
		// TODO filter buffers with repeated file paths
		var jsFilter = gulpFilter('**/*.js'),    // TODO refactor -- get from json
			copyFilter = gulpFilter('!**/*.js'), // TODO same as above + negate
			existsFilter = gulpFilter(filterEvent.bind(null, ['changed', 'added'])),
			deletedFilter = gulpFilter(filterEvent.bind(null, ['deleted'])),
			existsStream = files.pipe(existsFilter);

		return mergeStream(
			existsStream
				.pipe(jsFilter)
				.pipe(handleJs()),
			existsStream
				.pipe(copyFilter)
				.pipe(handleCopy()),
			files.pipe(deletedFilter)
				.pipe(gulpRimraf())
		)
		.pipe(runAfterEnd(runTests));
	}).on('ready', function() {
		gutil.log('Watching ' + chalk.magenta('src') + ' directory for changes...'); //TODO refactor
	}).on('error', function(err) {
		console.error(err.message);
	});
});
