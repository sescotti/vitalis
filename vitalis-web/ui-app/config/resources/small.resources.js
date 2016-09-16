/* global exports */

// Before loading the scripts in the shared.resources, we load these
exports.initialScripts = [
    // Inclusions for partials / templates / urls
    '../src/main/resources/static/ui-build/urls/bundle__small.js',
    '../src/main/resources/static/ui-build/templates/bundle__small.js',
    '../src/main/resources/static/ui-build/partials/bundle__small.js'
];

exports.scripts = [
    // Modules from Components
    './src/scripts/modules/components/header__small.module.js',

    // App
    './src/scripts/router__small.js',
    './src/scripts/router.js',
    './src/scripts/modules/checkout/checkout.module.js'
];

exports.styles = [
    './src/styles/pages/main/main__small.scss'
];

exports.fonts = [];

exports.images = [];

exports.urls = [
    './src/scripts/urls__small.json'
];

exports.mocks = [];

exports.partials = [
    './src/templates/small/_*.hbs'
];

exports.templates = [
    './src/templates/small/**/[^_]*.hbs'
];