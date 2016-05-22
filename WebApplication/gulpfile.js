/// <binding BeforeBuild='clean' AfterBuild='build' />
require("any-promise/register")("bluebird");

var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    debug = require('gulp-debug'),
    through2 = require('through2').obj,
    merge = require('merge2'),
    bemhtml = require('bem-xjst').bemhtml,
    bem = require('@bem/gulp');

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
    path: 'Bem/desktop.bundles/index',
    decl: 'index.bemjson.js'
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
        .pipe(gulp.dest('Bem/desktop.bundles/index'));
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
        .pipe(gulp.dest('Bem/desktop.bundles/index'));
});

gulp.task('styles', function () {
    return bundle.src({ tech: 'styl', extensions: ['.styl'] })
      .pipe(stylus())
      .pipe(concat(bundle.name() + '.css'))
      .pipe(gulp.dest('Bem/desktop.bundles/index'));
});

gulp.task('build', ['bemhtml', 'scripts', 'styles'], function () { });
