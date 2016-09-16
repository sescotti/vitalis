
/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mergeStream = require('merge-stream');
var mkdirp = require('mkdirp');

/**
 * Name
 */
var taskname = 'build:fonts';

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
        if (!paths.build || !paths.build.fonts || !bundles.fonts || !Object.keys(bundles.fonts).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.fonts);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.fonts).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.fonts[bundle])
                    .pipe($.size({'title': 'Fonts size (build):'}))
                    .pipe(gulp.dest(paths.build.fonts))
            );
        });
        return mergeStream(tasks);
    });
};