/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mergeStream = require('merge-stream');
var mkdirp = require('mkdirp');
var browserSync = require('browser-sync').create();

/**
 * Name
 */
var taskname = 'build:scripts-concat';

/**
 * Module
 */
module.exports = function (gulp, paths, bundles) {
    if (!gulp || !paths || !bundles) {
        return log.module(taskname);
    }

    /**
     * Task
     */
    gulp.task(taskname, function () {
        if (!paths.build || !paths.build.scripts || !bundles.scripts || !Object.keys(bundles.scripts).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.scripts);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.scripts).forEach(function (name) {
            tasks.push(gulp.src(bundles.scripts[name])
                    .pipe($.plumber())
                    .pipe($.concat(name + '.js'))
                    .pipe($.size({'title': 'Size of JS bundle (build) "' + name + '.js":'}))
                    .pipe(gulp.dest(paths.build.scripts))
                    // Browsersync
                    .pipe(browserSync.stream())
            );
        });
        return mergeStream(tasks);
    });
};
