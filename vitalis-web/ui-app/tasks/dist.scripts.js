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
var taskname = 'dist:scripts';

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
        if (!paths.dist || !paths.dist.scripts || !paths.dist.root || !paths.build || !paths.build.scripts) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        var defaultConfig = {
            'revision': true,
            'gzipThreshold': 1024
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        mkdirp.sync(paths.dist.scripts);

        /**
         * Execution
         */
        return gulp.src(paths.build.scripts + '**/*.js', {'base': paths.build.root})
            .pipe($.foreach(function (stream, file) {
                return stream
                /**
                 * Normal size
                 */
                    // Log size
                    .pipe($.size({'title': 'JS bundle size (dist) "' + file.path + '":'}))
                    // Save original file
                    .pipe(gulp.dest(paths.dist.root))
                    // Start revision
                    .pipe($.if(config.revision, $.rev()))
                /**
                 * Minified, gzipped and revisioned version
                 */
                    // Minify
                    .pipe($.uglify())
                    // Gzip
                    .pipe($.gzip({
                        'threshold': config.gzipThreshold,
                        'preExtension': 'gz'
                    }))
                    // Log size
                    .pipe($.size({'title': 'JS bundle size (dist) "' + file.path + '" (minified):'}))
                    // Save min+gz+rev file
                    .pipe(gulp.dest(paths.dist.root))
                    // Generate manifest
                    .pipe($.if(config.revision, $.rev.manifest(paths.dist.root + 'rev-manifest.json', {
                        'base': paths.dist.root,
                        'merge': true
                    })))
                    // Save manifest file
                    .pipe($.if(config.revision, gulp.dest(paths.dist.root)));
            }));
    });
};