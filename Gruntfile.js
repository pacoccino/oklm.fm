'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    //grunt.loadNpmTasks('grunt-contrib-watch');

    var appDir = "client/";
    var buildDir = "app/";

    grunt.initConfig(
        {
            less: {
                production: {
                    options: {
                        paths: ["client/assets"],
                        compress: true
                    },
                    files: {
                        "client/assets/styles/style.css": appDir + "assets/styles/style.less"
                    }
                }
            },
            copy: {
                app: {
                    files: [
                        {
                            expand: true,
                            cwd: appDir,
                            src: [
                                "index.html",
                                "backstage.html"
                            ],
                            dest: buildDir
                        },
                        {
                            expand: true,
                            cwd: appDir + "assets/images",
                            src: [
                                "logo.png",
                                "applestore.svg",
                                "pirates.jpg",
                                "deezer.png",
                                "itunes.png",
                                "play.png",
                                "pause.png",
                                "history.png",
                                "close.png",
                                "left.png",
                                "right.png",
                                "bgHeadset.jpg",
                                "couronne.png",
                                "favicons/apple-touch-icon-57x57.png",
                                "favicons/favicon-16x16.png",
                                "favicons/favicon-32x32.png"
                            ],
                            dest: buildDir + "assets/images"
                        },
                        {
                            expand: true,
                            cwd: appDir + "assets/styles",
                            src: [
                                "style.css",
                                "normalize.css"
                            ],
                            dest: buildDir + "assets/styles"
                        },
                        {
                            expand: true,
                            cwd: appDir,
                            src: [
                                "app.js"
                            ],
                            dest: buildDir
                        },
                        {
                            expand: true,
                            cwd: appDir + "assets/fonts",
                            src: [
                                "CaviarDreams.ttf"
                            ],
                            dest: buildDir + "assets/fonts"
                        }
                    ]
                }
            },
            uglify: {
                options: {
                    mangle: true
                },
                js: {
                    files: {
                        'app/assets/app.js': [appDir + "/assets/app.js"]
                    }
                }
            },
            watch: {
                //scripts: {
                //    files: [appDir  + '**/*.html', appDir  + '**/*.js', appDir  + '**/*.css'],
                //    tasks: ['build']
                //},
                less: {
                    files: appDir + '**/*.less',
                    tasks: ['less']
                }
            }
        });


    grunt.registerTask('buildProd', ['less', 'copy:app', 'uglify']);

    grunt.registerTask('build', ['less', 'copy:app'/*, 'uglify'*/]);
    grunt.registerTask('watch', ['watch']);

    grunt.registerTask('default', 'build');
};
