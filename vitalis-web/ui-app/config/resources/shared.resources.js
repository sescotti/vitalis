//var build = '../src/main/resources/static/ui-build/';
var build = './ui-build/';
var dist = '../src/main/resources/static/ui-dist/';


exports.scripts = [
    './src/scripts/utils/utils-vitalis.js',
    './src/scripts/utils/urls-utils.js',
    // Global definitions
    './src/scripts/module.js',
    build + 'templates/bundle.js',
    build + 'urls/bundle.js',
    //'../src/main/resources/static/ui-build/templates/bundle.js',
    //'../src/main/resources/static/ui-build/urls/bundle.js',
    // Models
    './src/scripts/models/*.js',
    // Collections
    './src/scripts/collections/*.js',
    // Views
    './src/scripts/views/*.js',
    // App
    './src/scripts/router.js',
    './src/scripts/modules/vitalis.module.js'
];

exports.styles = [
    './src/styles/*.css'
];

exports.fonts = [
    './src/fonts/*.{ttf,woff,eot,svg}'
];

exports.images = [
    './src/images/**/*.{png,jpg,ico,svg}',
    //'./node_modules/mshops-core_ui/dist/assets/*.gif'
];

exports.urls = [
    './src/scripts/urls.json'
];

exports.mocks = [
    //'./node_modules/jquery-mockjax/dist/jquery.mockjax.min.js',
    './mocks/**/*.js'
];

exports.templates = [
    './src/templates/*.hbs',
    './src/templates/**/*.hbs',
    './src/components/**/[^_]*.hbs'
];

exports.partials = [];
