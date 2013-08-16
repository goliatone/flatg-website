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
    var yeomanConfig = {
        name: 'FlatG',
        app: 'app',
        assets:'assets',
        dist: 'dist'
    };

    try {
        yeomanConfig.src = require('./component.json').appPath || yeomanConfig.src;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
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
                src  : '<%= yeoman.app %>/index.tpl.html',
                dest : '<%= yeoman.app %>/index.html'
            },
            prod: {
                src : '<%= yeoman.app %>/index.tpl.html',
                dest : '<%= yeoman.dist %>/index.html'
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
                files: ['<%= yeoman.assets %>/js/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/assets/css/*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/assets/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/assets/js/{,*/}*.js',
                    '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
                            phpGateway('app'),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
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
                            mountFolder(connect, 'dist')
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
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
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
                '<%= yeoman.app %>/{,*/}*.js',
                '!<%= yeoman.app %>/components/*',
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
                    cwd: '<%= yeoman.assets %>/js',
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
                sassDir: '<%= yeoman.app %>/assets/css',
                cssDir: '.tmp/assets/css',
                imagesDir: '<%= yeoman.app %>/assets/images',
                javascriptsDir: '<%= yeoman.app %>/assets/js',
                fontsDir: '<%= yeoman.app %>/assets/fonts',
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
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
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
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/assets/css/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.assets %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/assets/css/main.css': [
                        '.tmp/assets/css/{,*/}*.css',
                        '<%= yeoman.assets %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
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
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess'
                    ]
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.dist %>/assets/js',
                    src: '*.js',
                    dest: '<%%= yeoman.dist %>/assets/js'
                }]
            }
        },
        concat: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.name %>.js': [
                        '.tmp/{,*/}*.js',
                        '<%= yeoman.app %>/{,*/}*.js'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.name %>.min.js': [
                        '<%= yeoman.dist %>/<%= yeoman.name %>.js'
                    ]
                }
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.assets %>/js/main.js'
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'enjoy-mondays.com',
                    port: 22,
                    authKey: 'auth1'
                },
                src: 'dist',
                dest: '/srv/www/dreamcach.es/public_html/kk',
                exclusions: ['<%= yeoman.dist %>/**/.DS_Store', '<%= yeoman.dist %>/**/Thumbs.db']
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('deploy', [
        // 'build',
        'ftp-deploy'
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
        'requirejs',
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