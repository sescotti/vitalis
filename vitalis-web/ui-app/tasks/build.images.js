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
var taskname = 'build:images';

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
        if (!paths.build || !paths.build.images || !bundles.images || !Object.keys(bundles.images).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.images);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.images).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.images[bundle])
                    .pipe($.size({'title': 'Images size (build):'}))
                    .pipe(gulp.dest(paths.build.images))
            );
        });
        return mergeStream(tasks);
    });
};