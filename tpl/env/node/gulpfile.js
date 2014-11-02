var gulp = require('gulp'),
	watch = require('gulp-watch'),
	to5 = require('gulp-6to5'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	mocha = require('gulp-mocha'),
	rimraf = require('rimraf'),
	through = require('through'),
	mergeStream = require('merge-stream');


function runAfterEnd(cb) {
	// This is basically a passThrough stream for the callback's stream.
	// It waits until all data is finished being piped into it and discards this data,
	// then passes through the data from the stream provided by the callback.
	return through(function() {}, function() {
		var thisStream = this,
			cbStream = cb();
		['data', 'end', 'error'].forEach(function(event) {
			cbStream.on(event, thisStream.emit.bind(thisStream, event));
		});
	});
}

gulp.task('default', function() {
	rimraf.sync('dist');

	var base = 'src',
		jsSrc = 'src/**/*.js',
		copySrc = ['src/**', '!' + jsSrc];

	function handleJs(stream) {
		return stream
			.pipe(jshint())
			.pipe(jscs({ esnext: true }))
			.pipe(to5(/*{ blacklist: ['generators'] }*/))
			.pipe(gulp.dest('dist'));
	}
	function handleCopy(stream) {
		return stream.pipe(gulp.dest('dist'));
	}
	function runTests() {
		return gulp.src('dist/test/*.js', { read: false })
			.pipe(mocha({ timeout: 5000 }));
	}

	return mergeStream(
			handleJs(gulp.src(jsSrc, { base: base })),
			handleCopy(gulp.src(copySrc, { base: base }))
		)
		.pipe(runAfterEnd(runTests))
		.pipe(runAfterEnd(function() {
			watch(jsSrc, { base: base }, runTestsAfter.bind(null, handleJs));
			watch(copySrc, { base: base }, runTestsAfter.bind(null, handleCopy));

			// return an endless passThrough stream to prevent the gulp task from exiting
			return through();
		}));

	function runTestsAfter(cb, files) {
		return cb(files)
			.pipe(runAfterEnd(runTests));
	}
	// .on('end', function() {
	// 	runTests().on('end', function() {
	// 		watch(jsSrc, { base: base }, handleJs);
	// 		watch(copySrc, { base: base }, handleCopy);
	// 	})
	// })



	// .on('end', function() {
	// 	console.log('ended tests');
	// 	// watch(jsSrc, { base: base }, handleJs);
	// 	// watch(copySrc, { base: base }, handleCopy);
	// });
	// }).resume();


	// watch(jsSrc, { base: base }, handleJs);

	// watch(copySrc, { base: base }, handleCopy);
});

// gulp.task('default', ['build']);
