var gulp            = require('gulp');
var cordova         = require('cordova');
var gulpLoadPlugins = require('gulp-load-plugins');
var $               = gulpLoadPlugins();

var appPath         = './app';
var cordovaPath     = './cordova';
var paths           = require('./config/paths');
var bundles         = require('./config/bundles');
var debug           = require('gulp-debug');

var requireDir = require('require-dir');
requireDir('./tasks');

var tasks = [
    require('./tasks/build.clean'),
    require('./tasks/build.html'),
    require('./tasks/build.styles'),
    require('./tasks/build.script.concat')
];

/**
 * Register tasks
 */
tasks.forEach(function (task) {
    task(gulp, paths, bundles);
});

gulp.task('default', function() {
    gulp.start('build');
});

/**
 * Custom tasks
 */
gulp.task('build:html', function() {
    return gulp.src(appPath + '/*.html')
        .pipe(gulp.dest(cordovaPath))
});

gulp.task('dist:html', function() {
    return gulp.src(appPath + '/*.html')
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(cordovaPath))
});

gulp.task('build', $.sync(gulp).sync([
        'build:clean',
        [
            'build:html',
            'build:styles',
            'build:scripts-concat'
        ]
    ])
);

gulp.task('dist', $.sync(gulp).sync([
        'build:clean',
        [
            'dist:html',
            'dist:styles',
            'dist:scripts'
        ]
    ])
);

gulp.task('watch', function () {
    gulp.start('build');
    gulp.watch([appPath + '/styles/**/*.scss'], ['build:styles']);
    gulp.watch([appPath + '/scripts/**/*.js'], ['build:scripts-concat']);
    gulp.watch(['./config/**/*.js'], ['build']);
});

/**
 * Cordova specific tasks
 */
gulp.task('cordova:create', function() {
    return gulp.src(appPath)
        .pipe($.cordovaCreate({dir: 'cordova', id: 'com.rocket.vitalis', name: 'Vitalis Mobile'}));
});

gulp.task('cordova:config', function() {
    return gulp.src(cordovaPath)
        .pipe($.debug({title: 'sarasa:'}))
        .pipe($.cordovaAuthor('Rocket', 'scotti.sebastian@gmail.com'))
        .pipe($.cordovaDescription('Vitalis hybrid app.'))
        .pipe($.cordovaVersion('0.0.1'))
        .pipe($.cordovaPreference({
            'DisallowOverscroll': true,
            'HideKeyboardFormAccessoryBar': true,
            'KeyboardDisplayRequiresUserAction': false,
            'Orientation': 'portrait',
            'AutoHideSplashScreen': true,
            'FadeSplashScreenDuration': 400,
            'ShowSplashScreenSpinner': false,
            'android-minSdkVersion': 16,
            'android-targetSdkVersion': 17
        }));
});

gulp.task('cordova:addPlugins', function() {
    return gulp.src(cordovaPath)
        .pipe($.cordovaPlugin('ionic-plugin-keyboard'))
        .pipe($.cordovaPlugin('cordova-plugin-console'))
        .pipe($.cordovaPlugin('cordova-plugin-inappbrowser'))
        .pipe($.cordovaPlugin('cordova-plugin-statusbar'))
        .pipe($.cordovaPlugin('cordova-plugin-crosswalk-webview'))
});

gulp.task('cordova:addIOS', function() {
    return gulp.src(cordovaPath)
        .pipe($.cordovaBuildIos());
});

gulp.task('cordova:addAndroid', function() {
    return gulp.src(cordovaPath)
        .pipe($.cordovaBuildAndroid({version: "5.1.1" }));
});

gulp.task('cordova:init', $.sync(gulp).sync ([
    'cordova:create',
    'cordova:config',
    'cordova:addPlugins',
    'cordova:addIOS',
    'cordova:addAndroid'
]));

gulp.task('run:ios', ['build'], function() {
    process.chdir(cordovaPath);
    cordova
        .run({ platforms: [ 'ios' ] })
});

gulp.task('run:android', ['build'], function() {
    process.chdir(cordovaPath);
    cordova
        .run({ platforms: [ 'android' ]}, {version: "android-17" });
});
