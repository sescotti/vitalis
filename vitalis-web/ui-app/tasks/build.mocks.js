/**
 * Dependencies
 */
var log = require('./log');
var mergeStream = require('merge-stream');
var mkdirp = require('mkdirp');

/**
 * Name
 */
var taskname = 'build:mocks';

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
        if (!paths.build || !paths.build.mocks || !bundles.mocks || !Object.keys(bundles.mocks).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.mocks);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.mocks).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.mocks[bundle])
                    .pipe(gulp.dest(paths.build.mocks))
            );
        });
        return mergeStream(tasks);
    });
};