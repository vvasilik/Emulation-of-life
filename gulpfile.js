var gulp = require('gulp');
//var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('css', function () {
  gulp.src('dev/styles/*.css')
    .pipe(autoprefixer({
      browsers: ['> 1%'],
      cascade: false
    }))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('product/css'))
});

gulp.task('js', function () {
  gulp.src('dev/scripts/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('product/scripts'));
});


gulp.task('default', ['css', 'js']);

gulp.task('watch', function () {
  gulp.watch('dev/**/*.*', ['default'])
});