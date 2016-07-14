module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false,
                ASCIIOnly: true
            },
            main: {
                src: ['public_html/js/*.js', 'public_html/js/jquery/*.js', 'public_html/js/src/*.js'],
                dest:'public_html/js/min/x.min.js'
            }
        },       
        dataUri: {
            dist: {
                // src file
                src: ['public_html/css/style.css'],
                // output dir
                dest: 'public_html/css/',
                options: {
                    // specified files are only encoding
                    target: ['public_html/images/**/*.*','public_html/images/*.*'],
                    // adjust relative path?
                    fixDirLevel: false,
                    // img detecting base dir
                    // baseDir: './'

                    // Do not inline any images larger
                    // than this size. 6048 is a size
                    // recommended by Google's mod_pagespeed.
                    maxBytes : 6048
                }
            }
        },
        jshint: {
            options: {
                "browser": true, 	
                "jquery": true, 	
                "white": false, 	
                "smarttabs": true, 	
                "eqeqeq": true, 	
                "immed": true, 	
                "latedef": false, 	
                "newcap": true, 	
                "undef": true, 	
                "trailing": true, 	
                "globals": {
                    "Modernizr": true,
                    "sweetAlert": true,
                    "flowplayer":true,
                    "VK":true,
                    "swal":true,
                    "CKEDITOR":true,
                    "removeClass":true,
                    "IE8":true,
                    "addEvent":true,
                    "xhrRequest":true,
                    "addClass":true,
                    "console":true
                }
            },
            files: ['public_html/js/src/x.js']
        },
        watch: {
            main: {
                files: ['public_html/js/*.js', 'public_html/js/jquery/*.js', 'public_html/js/src/*.js'],
                tasks: ['uglify:main']
            }
        }
    });
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['dataUri','uglify','jshint','yuidoc']);
};