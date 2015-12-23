'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-watch');

    var appDir = "appDev/";
    var buildDir = "app/";

    grunt.initConfig(
        {
            less: {
                production: {
                    options: {
                        paths: ["appDev/assets"],
                        compress: true
                    },
                    files: {
                        "appDev/assets/style.css": appDir + "assets/style.less"
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
                            cwd: appDir + "assets",
                            src: [
                                "app.js",
                                "style.css",
                                "normalize.css",
                                "pirates.jpg",
                                "play.png",
                                "pause.png"
                            ],
                            dest: buildDir + "assets"
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
