/**
 * Dependencies
 */
var del = require('del');
var mkdirp = require('mkdirp');

//var requireDir = require('require-dir');
//requireDir('.');
var log = require('./log');

/**
 * Name
 */
var taskname = 'build:clean';

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
        if (!paths.build || !paths.build.root) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.root);

        /**
         * Execution
         */
        return del.sync([paths.build.root + '*'], {'force': true});
    });
};
