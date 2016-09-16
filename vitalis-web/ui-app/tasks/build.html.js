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
var taskname = 'build:html';

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
        if (!paths.build || !paths.build.html || !bundles.html || !Object.keys(bundles.html).length) {
            return log.task(taskname);
        }
        mkdirp.sync(paths.build.html);

        var tasks = [];
        Object.keys(bundles.html).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.html[bundle])
                    .pipe($.size({'title': 'HTML size (build):'}))
                    .pipe(gulp.dest(paths.build.html))
            );
        });

        return mergeStream(tasks);
    });
};
