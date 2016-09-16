/* global require __dirname */
/**
 * Tasks dependencies
 */
var gulp = require('gulp');
var replace = require('gulp-replace');
var bundles = require('./config/bundles');
var paths = require('./config/paths');

/**
 * Tasks dependencies
 */
var build = require('./tasks/build.spa');
//var dist = require('./tasks/tasks/dist.spa');

/**
 * Tasks execution
 */
build(gulp, paths, bundles, {'name': 'Vitalis', 'namespace': 'Vitalis'});
//dist(gulp, paths, bundles);

gulp.task('icons-replacement', function () {
    gulp.src(paths.build.styles + '/*.css')
        .pipe(replace('../assets/icons.', '../ui-build/fonts/icons.'))
        .pipe(gulp.dest(paths.build.styles));
});

gulp.task('default', ['build'], function () {
    gulp.start('icons-replacement');
});