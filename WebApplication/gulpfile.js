/// <binding BeforeBuild='clean' />

require("any-promise/register")("bluebird");

var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug'),
    bem = require('@bem/gulp');

// Создаём хелпер для сборки проекта
var project = bem({
    bemconfig: {
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
    return bundle.src({ tech: 'bemhtml', extensions: ['.bemhtml.js'] })
        .pipe(debug()) // Print out all found files
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('Bem/desktop.bundles/index'));
});

gulp.task('scripts', function () {
    return gulp.src('Bem/desktop.blocks/**/*.js')
      .pipe(concat('all.min.js'))
      .pipe(gulp.dest('Bem/desktop.bundles/index'));
});

//gulp.task('default', [], function () { });
