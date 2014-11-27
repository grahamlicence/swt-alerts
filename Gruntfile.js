/*
    Gruntfile. To run:
    - install node
    - run `npm install` in the root directory
    - type in `grunt` to do run the build
    - type in `grunt watch` whilst developing


    Check out the registerTask statements at the bottom for an idea of
    task grouping.
*/
module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        /*  Read the package.json file for config values.
            package.json keeps devDependencies as well, which make it easy 
            for us to track and install node dependencies 
        */
        pkg: grunt.file.readJSON('package.json'),

        /*  Copy files to production folder.
        */
        copy: {
            main: {
                files: [
                    // main files
                    {
                        src: 'src/index.html', dest: 'build/index.html', nonull: true
                    },
                    // manifest
                    {
                        src: 'src/manifest.json', dest: 'build/manifest.json'
                    },
                ],

                // TODO: update version through here
                options: {
                  process: function (content, srcpath) {
                    return content
                        .replace('stations-swt.js','stations-swt.min.js')
                        .replace('popup.js','popup.min.js')
                        .replace('background.js','background.min.js');
                  },
                },
            },

            // images need to be copied seperately as the options.process corrupts them
            images: {
                files: [
                    // all images
                    {
                        expand: true, flatten: true, src: ['src/images/**'], dest: 'build/images', filter: 'isFile'
                    }

                ]
            }
        },

        /*  Uglify seems to be the industry standard for minification and obfuscation nowadays.
        */
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            js: {
                files: {
                    'build/scripts/popup.min.js': 'src/scripts/popup.js',
                    'build/scripts/stations-swt.min.js': 'src/scripts/stations-swt.js',
                    'build/scripts/background.min.js': 'src/scripts/background.js'
                }
            }
        },

        // minify css
        cssmin: {
          add_banner: {
            options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            files: {
              'build/styles/global.css': ['src/styles/global.css']
            }
          }
        },

        connect: {
          dev: {
            options: {
                open: true,
                hostname: 'localhost',
                port: 8001,
                base: './',
                keepalive: true
            }
          }
        }
    });


    /*  The default task runs when you just run `grunt`.
        "js" and "css" tasks process their respective files. 
    */

    // minify and copy files over to production folder
    grunt.registerTask('release', ['uglify', 'cssmin', 'copy']);

    // development set up
    grunt.registerTask('dev', ['connect']);

    grunt.registerTask('default', ['connect']);
};
