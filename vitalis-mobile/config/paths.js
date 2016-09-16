// Paths relative to gulpfile
var build = '../vitalis-web/src/main/resources/static/ui-build/';
var dist = '../vitalis-web/src/main/resources/static/ui-dist/';

exports.build = {
    'root': build,
    'html': build,
    'styles': build + 'css/',
    'scripts': build + 'js/',
    'urls': build + 'urls/',
    'images': build + 'images/',
    'fonts': build + 'fonts/',
    'templates': build + 'templates/',
    'assets': build + 'assets/',
    'mocks': build + 'mocks/'
};

exports.dist = {
    'root': dist,
    'html': dist,
    'styles': dist + 'css/',
    'scripts': dist + 'js/',
    'images': dist + 'images/',
    'fonts': dist + 'fonts/'
};
