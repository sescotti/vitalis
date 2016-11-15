/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');
var cssnano = require('cssnano');
var objectAssign = require('object-assign');

/**
 * Name
 */
var taskname = 'dist:styles';

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, userConfig) {
    if (!gulp || !paths || !bundles) {
        return log.module(taskname);
    }

    /**
     * Task
     */
    gulp.task(taskname, function () {
        if (!paths.dist || !paths.dist.styles || !paths.build || !paths.build.styles || !paths.build.root || !paths.dist.root) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        var defaultConfig = {
            'replace': [],
            'revision': true,
            'gzipThreshold': 1024,
            'safe': true,
            'revisionAssets': true
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        var manifest = paths.dist.root + 'rev-manifest.json';
        mkdirp.sync(paths.dist.styles);

        /**
         * Execution
         */
        return gulp.src(paths.build.styles + '**/*.css', {'base': paths.build.root})
            .pipe($.foreach(function (stream, file) {
                return stream
                    // Replacements
                    .pipe($.if(config.replace.length, $.batchReplace(config.replace)))
                    // Replace revisoned assets
                    .pipe($.if(config.revisionAssets, $.revReplace({
                        'manifest': gulp.src(manifest)
                    })))
                /**
                 * Normal size
                 */
                    // Log size
                    .pipe($.size({'title': 'CSS bundle size (dist) "' + file.path + '":'}))
                    // Save original file
                    .pipe(gulp.dest(paths.dist.root))
                    // Start revision
                    .pipe($.if(config.revision, $.rev()))
                /**
                 * Minified, gzipped and revisioned version
                 */
                    // Minify
                    .pipe($.postcss([
                        cssnano({
                            'autoprefixer': false,
                            'safe': config.safe
                        })
                    ]))
                    // Gzip
                    .pipe($.gzip({
                        'threshold': config.gzipThreshold,
                        'preExtension': 'gz'
                    }))
                    // Log size
                    .pipe($.size({'title': 'CSS bundle size (dist) "' + file.path + '" (minified):'}))
                    // Save min+gz+rev file
                    .pipe(gulp.dest(paths.dist.root))
                    // Generate manifest
                    .pipe($.if(config.revision, $.rev.manifest(manifest, {
                        'base': paths.dist.root,
                        'merge': true
                    })))
                    // Save manifest file
                    .pipe($.if(config.revision, gulp.dest(paths.dist.root)));
            }));
    });
};