/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var handlebars = require('handlebars');
var log = require('./log');
var mergeStream = require('merge-stream');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Name
 */
var taskname = 'build:handlebars-partials';

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
        if (!paths.build || !paths.build.templates || !paths.build.partials || !bundles.partials || !Object.keys(bundles.partials).length) {
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
        Object.keys(bundles.partials).forEach(function (bundle) {
            tasks.push(gulp.src(bundles.partials[bundle])
                    .pipe($.handlebars({'handlebars': handlebars}))
                    .pipe($.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
                        'imports': {
                            'processPartialName': function (fileName) {
                                var pathName = path.basename(fileName, '.js');
                                // Strip the extension and the underscore (if exists)
                                // Escape the output with JSON.stringify
                                return JSON.stringify(
                                    pathName.substr(pathName.indexOf('_') === 0)
                                );
                            }
                        }
                    }))
                    .pipe($.concat(bundle + '.js'))
                    .pipe($.size({'title': 'Handlebars Partials size:'}))
                    .pipe(gulp.dest(paths.build.partials))
            );
        });
        return mergeStream(tasks);
    });
};