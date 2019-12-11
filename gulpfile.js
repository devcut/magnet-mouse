'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var rename = require("gulp-rename");
var tsProject = ts.createProject('tsconfig.json');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('assets/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('typescript', function () {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(uglify())
    .pipe(rename('magnet-mouse.min.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/**/*.ts', gulp.series('typescript'));
});