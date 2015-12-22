module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
      options: {
          platforms: ['osx'],
          buildDir: './build',
          version: '0.12.3'
      },
      src: ['./app/**/*']
    }
  })

  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('build', ['nwjs']);

};
