exports.scripts = {
    'bundle__small': [
        //'./node_modules/chico/dist/chico.mobile.js',
        './src/scripts/app.js'
    ],
    'bundle__large': [
        //'./node_modules/chico/dist/chico.ui.js',
        './src/scripts/app.js'
    ]
};

exports.styles = {
    'bundle__small': [
        './src/styles/pages/main/main__small.scss'
    ],
    'bundle__large': [
        './src/styles/pages/main/main__large.scss'
    ]
};

exports.fonts = {
    'resources': [
        './node_modules/chico/dist/assets/*.{ttf,woff,eof,svg}'
    ]
};

exports.images = {
    'resources': [
        './src/images/**/*.{png,jpg,ico,svg}'
    ]
};

exports.urls = {
    'resources': [
        './src/scripts/urls.json'
    ]
};

exports.mocks = {
    'resources': [
        '../mocks/**/*.json'
    ]
};

exports.templates = {
    'resources': [
        './src/templates/**/*.hbs'
    ]
};

exports.partials = {
    'resources': [
        './src/templates/**/_*.hbs'
    ]
};

exports.html = {
    'resources': [
        '/*.html'
    ]
};
