/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');
var mergeStream = require('merge-stream');
var objectAssign = require('object-assign');

/**
 * Name
 */
var taskname = 'build:urls';

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, config) {
    if (!gulp || !paths || !bundles) {
        return log.module(taskname);
    }

    /**
     * Task
     */
    gulp.task(taskname, function () {
        if (!paths.build || !paths.build.urls || !bundles.urls || !Object.keys(bundles.urls).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.urls);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.urls).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.urls[bundle])
                    .pipe($.if(!!config.wrap, $.wrap(config.wrap, {}, {'parse': false})))
                    .pipe($.concat(bundle + '.js'))
                    .pipe(gulp.dest(paths.build.urls))
            );
        });
        return mergeStream(tasks);
    });
};