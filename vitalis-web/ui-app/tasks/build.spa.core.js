/**
 * Dependencies
 */
var log = require('./log');
var mkdirp = require('mkdirp');

/**
 * Name
 */
var taskname = 'build:core';

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
        if (
            !paths.build ||
            !paths.build.coreScripts ||
            !paths.build.coreStyles ||
            !paths.build.scripts ||
            !paths.build.styles
        ) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.scripts);
        mkdirp.sync(paths.build.styles);

        /**
         * Execution
         */
        gulp.src(paths.build.coreScripts + '*.js')
            .pipe(gulp.dest(paths.build.scripts));

        gulp.src(paths.build.coreStyles + '*.css')
            .pipe(gulp.dest(paths.build.styles));
    });
};