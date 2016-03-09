'use strict';

import gulp from 'gulp';
import seq from 'run-sequence';
import clean from 'gulp-clean';
import babel from 'gulp-babel';
import jshint from 'gulp-jshint';
import mocha from 'gulp-mocha';
import watch from 'gulp-watch';

const dirs = {
  src: 'src',
  build: 'build',
  test: 'test'
};

const glob = {
  src: dirs.src + '/**/*.js',
  build: dirs.build + '/**/*.js',
  test: dirs.test + '/**/*.js'
};

gulp.task('pre-clean', () => {
  return gulp.src(glob.build)
    .pipe(clean());
});

gulp.task('compile', () => {
  return gulp.src(glob.src)
    .pipe(babel({
      presets: ['es2015']
    })).pipe(gulp.dest(dirs.build));
});

gulp.task('lint', () => {
  return gulp.src(glob.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', () => {
  return gulp.src(glob.test, {
    read: false
  }).pipe(mocha({
    reporter: 'spec'
  })).once('error', () => {
    process.exit(1);
  });
});

gulp.task('default', () => {
  gulp.watch(glob.src, ['build']);
  gulp.watch(glob.test, ['test']);
});

gulp.task('build', cbk => seq('lint', 'test', 'pre-clean', 'compile', cbk));
