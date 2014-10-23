module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		clean: ['dist'],
		'6to5': {
			options: {
			},
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.js'],
					dest: 'dist/',
				}],
			},
		},
		copy: {
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*', '!**/*.js'],
					dest: 'dist/',
				}],
			},
		},
	});

	grunt.registerTask('default', ['clean', '6to5', 'copy']);
};
