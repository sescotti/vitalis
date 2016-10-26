/**
 * Dependencies
 */
var del = require('del');
var log = require('./log');
var mkdirp = require('mkdirp');

/**
 * Name
 */
var taskname = 'dist:clean';

/**
 * Module
 */
module.exports = function (gulp, paths) {
    if (!gulp || !paths) {
        return log.module(taskname);
    }

    /**
     * Task
     */
    gulp.task(taskname, function () {
        if (!paths.dist || !paths.dist.root) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.dist.root);

        /**
         * Execution
         */
        return del.sync([paths.dist.root + '*'], {'force': true});
    });
};