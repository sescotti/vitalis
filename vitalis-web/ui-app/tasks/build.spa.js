/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var objectAssign = require('object-assign');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

/**
 * Tasks dependencies
 */
var buildURLs = require('./build.spa.urls');
var buildHandlebars = require('./build.handlebars');
var buildStyles = require('./build.styles');
var buildScripts = require('./build.scripts.concat');
var tasks = [
    require('./build.clean'),
    require('./build.handlebars.partials'),
    require('./build.fonts'),
    require('./build.images'),
    require('./build.mocks'),
    require('./build.spa.core')
];

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, userConfig) {
    if (!gulp || !paths || !bundles || !userConfig || !userConfig.namespace) {
        return log.module('build.spa.js');
    }

    /**
     * Configuration
     */
    var defaultConfig = {
        'replace': [],
        'transpile': false
    };

    var config = objectAssign({}, defaultConfig, userConfig);

    // Register tasks
    tasks.forEach(function (task) { task(gulp, paths, bundles); });

    buildScripts(gulp, paths, bundles, {
        'transpile': config.transpile
    });

    buildURLs(gulp, paths, bundles, {
        'wrap': 'App.Urls.set((<%= contents %>)[App.Config.lang]);'
    });

    buildHandlebars(gulp, paths, bundles, {
        'namespace': config.namespace
    });

    buildStyles(gulp, paths, bundles, {
        'replace': config.replace
    });

    /**
     * Task
     */
    gulp.task('build', $.sync(gulp).sync([
        'build:clean',
        [
            'build:handlebars',
            'build:handlebars-partials',
            'build:urls',
            'build:fonts',
            'build:images',
            'build:mocks'
        ],
        [
            'build:styles',
            'build:scripts-concat',
            'build:core'
        ]
    ]));

    /**
     * Task (browsersync static server)
     */
    gulp.task('serve', function() {
        browserSync.init({
            open: false
        });
    });

    /**
     * Task
     */
    gulp.task('watch', ['serve'], function () {
        gulp.start('build');
        gulp.watch(['./src/styles/**/*.scss'], ['build:styles']);
        gulp.watch(['./src/images/**/*'], ['build:images']);
        gulp.watch("./src/styles/**/*.scss").on('change', browserSync.reload);
        gulp.watch([
            'gulpfile.js',
            './config/**/*.js',
            './config/**/*.json',
            './mocks/**/*.js',
            './src/**/*.js',
            './src/**/*.json',
            './src/templates/**/*.hbs'
        ], $.sync(gulp).sync([
            [
                'build:handlebars',
                'build:handlebars-partials'
            ],
            'build:scripts-concat'
        ]));
    });
};