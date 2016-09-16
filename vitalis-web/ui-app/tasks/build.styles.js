/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');
var mergeStream = require('merge-stream');
var autoprefixer = require('autoprefixer');
var objectAssign = require('object-assign');
var browserSync = require('browser-sync').create();

/**
 * Name
 */
var taskname = 'build:styles';

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
        if (!paths.build || !paths.build.styles || !bundles.styles || !Object.keys(bundles.styles).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        var defaultConfig = {
            'replace': []
        };
        var config = objectAssign({}, defaultConfig, userConfig);
        mkdirp.sync(paths.build.styles);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.styles).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.styles[bundle])
                    .pipe($.plumber())
                    .pipe($.sass({'style': 'expanded'}))
                    .pipe($.postcss([
                        autoprefixer({'browsers': ['last 5 versions', 'android >= 2.1', '> 1%']})
                    ]))
                    .pipe($.concat(bundle + '.css'))
                    .pipe($.if(config.replace.length, $.batchReplace(config.replace)))
                    .pipe($.size({'title': 'Size of CSS bundle (build) "' + bundle + '.css":'}))
                    .pipe(gulp.dest(paths.build.styles))
                    // Browsersync
                    .pipe(browserSync.stream())
            );
        });

        return mergeStream(tasks);
    });
};
