var merge = require('deepmerge');

/**
 * Files
 */
var shared = require('./resources/shared.resources');
var small = require('./resources/small.resources');
var large = require('./resources/large.resources');

/**
 * Bundles
 */
exports.scripts = {
    'bundle__small': merge(shared.scripts, small.scripts),
    'bundle__large': merge(shared.scripts, large.scripts)
};

exports.styles = {
    'bundle__small': merge(shared.styles, small.styles),
    'bundle__large': merge(shared.styles, large.styles)
};

exports.fonts = {
    'bundle': shared.fonts
};

exports.images = {
    'bundle': shared.images
};

exports.urls = {
    'bundle': shared.urls
};

exports.mocks = {
    'bundle': shared.mocks
};

exports.templates = {
    'bundle': shared.templates
};
