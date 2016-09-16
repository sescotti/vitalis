/**
 * Dependencies
 */
var $ = require('gulp-load-plugins')();
var log = require('./log');
var objectAssign = require('object-assign');

var distStyles = require('./dist.styles');
var tasks = [
    require('./dist.clean'),
    require('./dist.scripts'),
    require('./dist.images'),
    require('./dist.fonts')
];

/**
 * Module
 */
module.exports = function (gulp, paths, bundles, userConfig) {
    if (!gulp || !paths || !bundles) {
        return log.module(taskname);
    }

    /**
     * Configuration
     */
    var defaultConfig = {
        'replace': []
    };

    var config = objectAssign({}, defaultConfig, userConfig);

    // Register tasks
    tasks.forEach(function (task) { task(gulp, paths, bundles); });

    distStyles(gulp, paths, bundles, {
        'replace': config.replace
    });

    /**
     * Task
     */
    gulp.task('dist', $.sync(gulp).sync([
        'build',
        'dist:clean',
        'dist:scripts',
        'dist:styles',
        [
            'dist:images',
            'dist:fonts'
        ]
    ]));
};