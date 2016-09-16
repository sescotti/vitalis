/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var mkdirp = require('mkdirp');
var handlebars = require('handlebars');
var objectAssign = require('object-assign');
var mergeStream = require('merge-stream');

/**
 * Name
 */
var taskname = 'build:handlebars';

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, config) {
    if (!gulp || !paths || !bundles) {
        return log.module(taskname);
    }

    /**
     * Task
     */
    gulp.task(taskname, function () {
        if (!paths.build || !paths.build.templates || !bundles.templates || !Object.keys(bundles.templates).length) {
            return log.task(taskname);
        }

        /**
         * Configuration
         */
        mkdirp.sync(paths.build.templates);

        /**
         * Execution
         */
        var tasks = [];
        Object.keys(bundles.templates).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.templates[bundle])
                    .pipe($.handlebars({'handlebars': handlebars}))
                    .pipe($.wrap('Handlebars.template(<%= contents %>)'))
                    .pipe($.if(!!config.namespace, $.declare({
                        'namespace': (typeof config.namespace === 'string') ? config.namespace : config.namespace[bundle],
                        'noRedeclare': true
                    })))
                    .pipe($.concat(bundle + '.js'))
                    .pipe($.size({'title': 'Handlebars templates size:'}))
                    .pipe(gulp.dest(paths.build.templates))
            );
        });
        return mergeStream(tasks);
    });
};