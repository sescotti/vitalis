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
var taskname = 'dist:fonts';

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
        if (!paths.dist || !paths.dist.fonts || !paths.build || !paths.build.fonts) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        var defaultConfig = {
            'revision': true
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        mkdirp.sync(paths.dist.fonts);

        /**
         * Execution
         */
        return gulp.src(paths.build.fonts + '**/*.{eot,otf,svg,ttf,woff,woff2}', {'base': paths.build.root})
            // Optimize font files
            .pipe($.fontmin())
            .pipe($.size({'title': 'Fonts size (dist):'}))
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