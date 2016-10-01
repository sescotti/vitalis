/* global exports */

//var build = '../src/main/resources/static/ui-build/';
var build = './ui-build/';
var dist = '../src/main/resources/static/ui-dist/';

exports.build = {
    'coreScripts': './src/scripts/core/',
    'coreStyles': './src/styles/core/',
    'fonts': build + 'fonts/',
    'images': build + 'images/',
    'mocks': build + 'mocks/',
    'partials': build + 'partials/',
    'root': build,
    'scripts': build,
    'styles': build,
    'templates': build + 'templates/',
    'urls': build + 'urls/'
};

exports.dist = {
    'fonts': dist + 'fonts/',
    'images': dist + 'images/',
    'manifest': dist,
    'root': dist,
    'scripts': dist,
    'styles': dist
};