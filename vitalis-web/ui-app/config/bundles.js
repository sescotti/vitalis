/* global exports require */

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
    'bundle__small': merge(
        merge(shared.initialScripts, small.initialScripts),
        merge(shared.scripts, small.scripts)
    ),
    'bundle__large': merge(
        merge(shared.initialScripts, large.initialScripts),
        merge(shared.scripts, large.scripts)
    )
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
    'bundle__small': merge(shared.urls, small.urls),
    'bundle__large': merge(shared.urls, large.urls)
};

exports.mocks = {
    'bundle': shared.mocks
};

exports.partials = {
    'bundle__small': merge(shared.partials, small.partials),
    'bundle__large': merge(shared.partials, large.partials)
};

exports.templates = {
    'bundle__small': merge(shared.templates, small.templates),
    'bundle__large': merge(shared.templates, large.templates)
};