'use strict';

var gulp = require('gulp'),
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
		['data', 'end', 'error'].forEach(function(event) {
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

gulp.task('default', ['build'], function() {
	function filterEvent(events, file) {
		return [].concat(events).indexOf(file.event) !== -1;
	}

	return watch('src/**', { base: baseSrc }, function(files) {
		var jsFilter = gulpFilter('**/*.js'),    // TODO refactor -- get from json
			copyFilter = gulpFilter('!**/*.js'), // TODO same as above + negate
			existsFilter = gulpFilter(filterEvent.bind(null, ['changed', 'added'])),
			deletedFilter = gulpFilter(filterEvent.bind(null, 'deleted'));

		return files
			.pipe(existsFilter)
				.pipe(jsFilter)
					.pipe(handleJs())
				.pipe(jsFilter.restore())
				.pipe(copyFilter)
					.pipe(handleCopy())
				// .pipe(copyFilter.restore()) // unnecessary as this set of files wouldn't be used
			.pipe(existsFilter.restore())
			.pipe(deletedFilter)
				.pipe(gulpRimraf())
			// .pipe(deletedFilter.restore()) // unnecessary as runAfterEnd() discards piped data
			.pipe(runAfterEnd(runTests));
	});
});
