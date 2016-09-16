var util = require('gulp-util');

exports.module = function (taskname) {
    util.log(util.colors.red(
        'Some params are required. Please read the docs about task',
        util.colors.underline(taskname)
    ));
};

exports.task = function (taskname) {
    util.log(util.colors.cyan(
        'Due to missing "paths" or "bundles", task',
        util.colors.underline(taskname),
        'wasn\'t executed. Check if it was intentional.'
    ));
};
