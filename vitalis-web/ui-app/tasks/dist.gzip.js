/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');

/**
 * Name
 */
var taskname = 'dist:gzip';

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, userConfig) {
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
        var defaultConfig = {
            'gzipThreshold': 1024
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        mkdirp.sync(paths.dist.scripts);

        /**
         * Execution
         */
        return gulp.src(paths.dist.root + '**/*.{js,css}')
            .pipe($.gzip({'threshold': config.gzipThreshold}))
            .pipe($.size({'title': 'Size (gzip):'}))
            .pipe(gulp.dest(paths.dist.root));
    });
};