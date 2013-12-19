'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

/**
 * Connect modrewrite middleware to re route
 * everything into php?
 */
var modRewrite = require('connect-modrewrite');


/**
 * PHP gateway, handle template files, yay!!
 */
var gateway = require('gateway');
var phpGateway = function (dir){
    return gateway(require('path').resolve(dir), {
        '.php': 'php-cgi'
    });
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var config = {
        name: 'FlatG',
        app: 'app',
        assets:'assets',
        dist: 'dist'
    };

    try {
        config.src = require('./component.json').appPath || config.src;
    } catch (e) {}

    grunt.initConfig({
        config: config,
        livereload:{
            port: 35723
        },
        env: {
            options : {
                /* Shared Options Hash */
                //globalOption : 'foo'
            },
            dev: {
                NODE_ENV:'DEVELOPMENT'
            },
            prod : {
                NODE_ENV:'PRODUCTION'
            }
        },
        preprocess: {
            dev: {
                src  : '<%= config.app %>/index.tpl.html',
                dest : '<%= config.app %>/index.html'
            },
            prod: {
                src : '<%= config.app %>/index.tpl.html',
                dest : '<%= config.dist %>/index.html'
                //dest : '../<%= pkg.version %>/<%= now %>/<%= ver %>/index.html',
                /*options : {
                    context : {
                        name : '<%= pkg.name %>',
                        version : '<%= pkg.version %>',
                        now : '<%= now %>',
                        ver : '<%= ver %>'
                    }
                }*/
            }
        },
        watch: {
            coffee: {
                files: ['<%= config.assets %>/js/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= config.app %>/assets/css/*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '{.tmp,<%= config.app %>}/assets/css/{,*/}*.css',
                    '{.tmp,<%= config.app %>}/assets/js/{,*/}*.js',
                    '<%= config.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '^/notes(.*)$ /index.php?r=notes$1'
                            ]),
                            phpGateway(config.app),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            // phpGateway('app'),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            modRewrite([
                                '^/notes(.*)$ /index.php?r=notes$1'
                            ]),
                            phpGateway(config.dist),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, config.dist)
                        ];
                    }
                }
            },
            dev:{
                options: {}
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/{,*/}*.js',
                '!<%= config.app %>/components/*',
                'test/spec/{,*/}*.js'
            ]
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                browsers: ['Chrome', 'Firefox']
            },
            unit: {
                reporters: 'dots'
            },
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            },
            ci: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.assets %>/js',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/assets/js',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/js',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= config.app %>/assets/css',
                cssDir: '.tmp/assets/css',
                imagesDir: '<%= config.app %>/assets/images',
                javascriptsDir: '<%= config.app %>/assets/js',
                fontsDir: '<%= config.app %>/assets/fonts',
                importPath: 'app/components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: 'app',
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/gconf/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.dist %>'
            }
        },
        rev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: ['dist/**/*.{js,css,png,jpg}']
                }]
            }
        },
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html', '<%= config.dist %>/themes/{,*/}*.php'],
            css: ['<%= config.dist %>/assets/css/{,*/}*.css'],
            options: {
                dirs: ['<%= config.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.assets %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= config.dist %>/assets/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/assets/css/main.css': [
                        '.tmp/assets/css/{,*/}*.css',
                        '<%= config.assets %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/config/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        './articles/**/*',
                        './assets/images/*',
                        './backend/**/*',
                        './components/**/*',
                        './config/**/*',
                        './themes/default/*',
                        '*.{ico,txt}',
                        '*.php',
                        '*.js',
                        '!index.tpl.html',
                        '.htaccess'
                    ]
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/assets/js',
                    src: '*.js',
                    dest: '<%= config.dist %>/assets/js'
                }]
            }
        },
        concat: {
            dist: {
                files: {
                    '<%= config.dist %>/<%= config.name %>.js': [
                        '.tmp/{,*/}*.js',
                        '<%= config.app %>/{,*/}*.js'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/<%= config.name %>.min.js': [
                        '<%= config.dist %>/<%= config.name %>.js'
                    ]
                }
            }
        },
        bower: {
            target: {
                rjsConfig: 'app/main.js'
            },
            // install: {
            //     options: {
            //         targetDir: 'app',
            //         cleanTargetDir: true,
            //         // cleanBowerDir: true,
            //         install: true,
            //         verbose: true,
            //     }
            // }
        },
        'sftp-deploy': {
            build: {
                auth: {
                    host: 'enjoy-mondays.com',
                    port: 22,
                    authKey: 'auth1'
                },
                src: 'dist',
                dest: '/srv/www/flat-g.com/public_html',
                exclusions: ['<%= config.dist %>/**/.DS_Store', '<%= config.dist %>/**/Thumbs.db'],
                'server_sep': '/'
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('deploy', [
        // 'build',
        // 'ftpush'
        // 'ftpscript'
        'sftp-deploy'
    ]);

    grunt.registerTask('server', function (target) {

        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'env:dev',
            'preprocess:dev',
            'clean:server',
            'coffee:dist',
            'compass:server',
            'livereload-start',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });


    grunt.registerTask('test', [
        'env:dev',
        'preprocess:dev',
        'clean:server',
        'compass',
        'connect:test',
        'open',
        'karma:ci'
        //'mocha'
    ]);

    grunt.registerTask('build', [
        'env:prod',
        'clean:dist',
        'coffee',
        'compass:dist',
        'useminPrepare',
        'concat',
        // 'requirejs',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy',
        'ngmin',
        'uglify',
        'preprocess:prod',
        // 'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};