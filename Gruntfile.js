'use strict';

module.exports = (grunt) => {
  grunt.initConfig({
    clean: ['./doc/README.md'],
    eslint: {
      target: [
        './src/**/*.js',
        './test/**/*.js'
      ]
    },
    jsdoc2md: {
      withOptions: {
        options: {
          template: '\r\n# API Reference\r\n\r\n{{>all-docs~}}\r\n\r\n***\r\n'
        },
        src: 'src/*.js',
        dest: 'doc/README.md'
      }
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.registerTask('default', [
    'eslint',
    'clean',
    'jsdoc2md'
  ]);
};
