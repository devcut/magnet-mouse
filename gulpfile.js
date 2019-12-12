'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('assets/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('minify', function () {
  return gulp.src('./public/js/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('typescript', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts']
    })
    .bundle()
    .pipe(source('magnet-mouse.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/**/*.ts', gulp.series(['typescript', 'minify']));
});