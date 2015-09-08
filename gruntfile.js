module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        css: {
            src: 'src/css/**/*.css',
            dest: 'build/styles.css'
        }
    },

    cssmin: {
        options: {
            shortHandCompacting: false,
            roundingPrecision: -1
        },
        target: {
            files: {
                'build/styles.min.css': ['build/styles.css']
            }
        }
    },

    browserify: {
        js: {
            src: ['src/js/app.js','src/templates/**/*.hbs'],
            dest: 'build/bundle.js'
        },
        options: {
            transform: ['hbsfy']
        }
    },

    uglify: {
        main: {
            options: {
                sourceMap: true,
                sourceMapName: 'build/bundle.js.map'
            },
            files: {
                'build/bundle.min.js': ['build/bundle.js']
            }
        }
    },

    jshint: {
        all: ['src/**/*.js']
    },

    watch: {
        scripts: {
            files:  ['src/js/**/*.js'],
            tasks: ['jshint','browserify','uglify'],
            options: {
                spawn: false
            }
        },
        styles: {
            files:  ['src/css/**/*.css'],
            tasks: ['concat:css','cssmin'],
            options: {
                spawn: false
            }
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['concat:css', 'cssmin', 'jshint', 'browserify', 'uglify' ]);

};
