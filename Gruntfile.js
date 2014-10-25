'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		clean: {
			dist: 'dist',
		},
		'6to5': {
			options: {
			},
			src: {
				expand: true,
				cwd: 'src',
				src: '**/*.js',
				dest: 'dist',
			},
		},
		copy: {
			src: {
				expand: true,
				cwd: 'src',
				src: ['**', '!**/*.js'],
				dest: 'dist',
			},
		},
		jshint: {
			options: {
				jshintrc: true,
			},
			src: 'src/**/*.js',
		},
		jscs: {
			options: {
				config: '.jscsrc',
				esnext: true,
				reporter: 'inline',
			},
			src: 'src/**/*.js',
		},
		mochaTest: {
			options: {
				timeout: 5000,
				clearRequireCache: true, // necessary for `watch` task
			},
			src: 'dist/test/*.js',
		},
		watch: {
			options: {
				spawn: false, // faster than `spawn: true`, also necessary for incremental build
			},
			// This Gruntfile auto-reload is buggy (tested in Windows)
			// configFiles: {
			// 	options: {
			// 		reload: true,
			// 	},
			// 	files: ['Gruntfile.js', '.jshintrc', '.jscsrc'],
			// },
			js: {
				options: {
					event: ['added', 'changed'],
				},
				files: 'src/**/*.js',
				tasks: ['6to5', 'test'],
			},
			copy: {
				options: {
					event: ['added', 'changed'],
				},
				files: ['src/**', '!src/**/*.js'],
				tasks: ['copy', 'mochaTest'],
			},
			clean: {
				options: {
					event: 'deleted',
				},
				files: 'src/**',
				tasks: ['clean', 'mochaTest'],
			},
		},
	});

	grunt.event.on('watch', function(action, filepath, target) {
		filepath = filepath.replace(/\\/g, '/');
		if (target === 'js') {
			grunt.config('6to5.src.src', filepath.replace(/^src\//, ''));
			grunt.config('jshint.src', filepath);
			grunt.config('jscs.src', filepath);
		} else if (target === 'copy') {
			grunt.config('copy.src.src', filepath.replace(/^src\//, ''));
		} else if (target === 'clean') {
			grunt.config('clean.dist', filepath.replace(/^src/, 'dist'));
		}
	});

	grunt.registerTask('build', ['clean', '6to5', 'copy']);
	grunt.registerTask('test', ['jshint', 'jscs', 'mochaTest']);
	grunt.registerTask('default', ['build', 'test', 'watch']);
};
