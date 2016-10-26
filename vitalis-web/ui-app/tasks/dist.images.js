/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');
var objectAssign = require('object-assign');

/**
 * Name
 */
var taskname = 'dist:images';

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
    gulp.task(taskname, function() {
        if (!paths.dist || !paths.dist.images || !paths.build || !paths.build.images) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        var defaultConfig = {
            'revision': true
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        mkdirp.sync(paths.dist.images);

        return gulp.src(paths.build.images + '**/*.{png,gif,jpg,webp,jpeg,ico}', {'base': paths.build.root})
            .pipe($.imageOptimization())
            .pipe($.size({'title': 'Images size (dist):'}))
            // Save original file
            .pipe(gulp.dest(paths.dist.root))
            // Start revision
            .pipe($.if(config.revision, $.rev()))
            // Save +rev file
            .pipe(gulp.dest(paths.dist.root))
            // Generate manifest
            .pipe($.if(config.revision, $.rev.manifest(paths.dist.root + 'rev-manifest.json', {
                'base': paths.dist.root,
                'merge': true
            })))
            .pipe(gulp.dest(paths.dist.root));
    });
};