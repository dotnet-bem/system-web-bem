/// <binding BeforeBuild='clean' AfterBuild='build' />
require("any-promise/register")("bluebird");

var gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    debug = require('gulp-debug'),
    through2 = require('through2').obj,
    merge = require('merge2'),
    bemhtml = require('bem-xjst').bemhtml,
    bem = require('@bem/gulp'),
    postcss = require('gulp-postcss'),
    postcssUrl = require('postcss-url');

// Создаём хелпер для сборки проекта
var project = bem({
    bemconfig: {
        'Bem/libs/bem-core/common.blocks': { scheme: 'nested' },
        'Bem/libs/bem-core/desktop.blocks': { scheme: 'nested' },
        'Bem/libs/bem-components/common.blocks': { scheme: 'nested' },
        'Bem/libs/bem-components/desktop.blocks': { scheme: 'nested' },
        'Bem/libs/bem-components/design/common.blocks': { scheme: 'nested' },
        'Bem/libs/bem-components/design/desktop.blocks': { scheme: 'nested' },
        'Bem/desktop.blocks': { scheme: 'nested' }
    }
});

//// Создаём хелпер для сборки бандла
var bundle = project.bundle({
    path: 'Bem/desktop.bundles/default',
    decl: 'default.bemjson.js'
});

gulp.task('clean', function () {
    return del(['Bem/desktop.bundles/**/*.*', '!Bem/desktop.bundles/**/*.bemjson.js']);
});

gulp.task('bemhtml', function() {
    return bundle.src({ tech: 'bemhtml', extensions: ['.bemhtml', '.bemhtml.js'] })
        .pipe(concat(bundle.name() + '.bemhtml.js'))
        .pipe(through2(function(file, encoding, callback) {
            var src = file.contents.toString(encoding),
                bundle = bemhtml.generate(src);

            file.contents = new Buffer(bundle, encoding);
            callback(null, file);
        }))
        .pipe(gulp.dest('Bem/desktop.bundles/default'));
});

gulp.task('scripts', function () {
    return merge(
            gulp.src(require.resolve('ym')),
            bundle.src({
                tech: 'js',
                extensions: ['.js', '.vanilla.js', '.browser.js']
            })
        )
        .pipe(concat(bundle.name() + '.js'))
        .pipe(gulp.dest('Bem/desktop.bundles/default'));
});

gulp.task('styles', function () {
    return merge(
            bundle.src({ tech: 'css', extensions: ['.css'] }),
            bundle.src({ tech: 'styl', extensions: ['.styl'] }).pipe(stylus())
        )
        .pipe(postcss([
            postcssUrl({
                url: function(url, decl, from) {
                    return path.relative(
                        path.resolve(process.cwd(), bundle.path()),
                        path.resolve(from, url)).replace(/\\/g, '/');
                }
            })
        ]))
        .pipe(concat(bundle.name() + '.css'))
        .pipe(gulp.dest('Bem/desktop.bundles/default'));
});

gulp.task('build', ['bemhtml', 'scripts', 'styles'], function () { });
