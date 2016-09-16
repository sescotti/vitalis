/* global exports */

// Before loading the scripts in the shared.resources, we load these
exports.initialScripts = [
    // Inclusions for partials / templates / urls
    '../src/main/resources/static/ui-build/urls/bundle__large.js',
    '../src/main/resources/static/ui-build/templates/bundle__large.js',
    '../src/main/resources/static/ui-build/partials/bundle__large.js'
];

exports.scripts = [
    // Modules
    './src/scripts/modules/extend/utils__large.module.js',

    // Views
    './src/scripts/views/congrats/congrats-auth.item.view.js',
    './src/scripts/views/payment/form-previous.item.view.js',
    './src/scripts/views/payment-column/payment-header.item.view.js',
    './src/scripts/views/payment-column/offline-column.item.view.js',
    './src/scripts/views/payment-column/custom-column.item.view.js',

    // Layouts
    './src/scripts/views/payment-column/online-column.layout.view.js',
    './src/scripts/views/payment-column/payments-column.layout.view.js',
    './src/scripts/views/single.layout.view.js',

    // App
    './src/scripts/router__large.js',
    './src/scripts/router.js',
    './src/scripts/modules/checkout/checkout.module.js'
];

exports.styles = [
    './src/styles/pages/main/main__large.scss'
];

exports.fonts = [];

exports.images = [];

exports.urls = [
    './src/scripts/urls__large.json'
];

exports.mocks = [];

exports.partials = [
    './src/templates/large/_*.hbs'
];

exports.templates = [
    './src/templates/large/**/[^_]*.hbs'
];