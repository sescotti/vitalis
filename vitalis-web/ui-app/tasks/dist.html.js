/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');

/**
 * Name
 */
var taskname = 'dist:html';

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
        if (!paths.dist || !paths.dist.html || !paths.build || !paths.build.html) {
            return log.task(taskname);
        }
        mkdirp.sync(paths.dist.html);
        return gulp.src(paths.build.html + '*.html')
            .pipe($.htmlmin({collapseWhitespace: true}))
            .pipe($.size({'title': 'HTML size (dist):'}))
            .pipe(gulp.dest(paths.dist.html));
    });
};