/// <binding BeforeBuild='clean' AfterBuild='bemhtml' />
require("any-promise/register")("bluebird");

var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    debug = require('gulp-debug'),
    through2 = require('through2').obj,
    bemhtml = require('bem-xjst').bemhtml,
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
    return gulp.src('Bem/desktop.blocks/**/*.js')
      .pipe(concat('all.min.js'))
      .pipe(gulp.dest('Bem/desktop.bundles/index'));
});

//gulp.task('default', [], function () { });
