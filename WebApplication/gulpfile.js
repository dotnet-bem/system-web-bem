var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');

var config = {
    src: ['Bem/desktop.blocks/**/*.js']
}

gulp.task('clean', function () {
    return del(['Bem/desktop.bundles/**/*.js']);
});

gulp.task('scripts', ['clean'], function () {

    return gulp.src(config.src)
      .pipe(concat('all.min.js'))
      .pipe(gulp.dest('app/'));
});

gulp.task('default', ['scripts'], function () { });