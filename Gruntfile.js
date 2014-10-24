'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		clean: ['dist'],
		'6to5': {
			options: {
			},
			src: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.js'],
					dest: 'dist/',
				}],
			},
		},
		copy: {
			src: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*', '!**/*.js'],
					dest: 'dist/',
				}],
			},
		},
		jshint: {
			options: {
				jshintrc: true,
			},
			src: ['src/**/*.js'],
		},
		jscs: {
			options: {
				config: '.jscsrc',
				esnext: true,
				reporter: 'inline',
			},
			src: ['src/**/*.js'],
		},
		mochaTest: {
			options: {
				timeout: 5000,
			},
			src: ['dist/test/*.js'],
		},
	});

	grunt.registerTask('build', ['clean', '6to5', 'copy']);
	grunt.registerTask('test', ['jshint', 'jscs', 'mochaTest']);
	grunt.registerTask('default', ['build', 'test']);
};
