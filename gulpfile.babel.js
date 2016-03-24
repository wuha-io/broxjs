'use strict';

import gulp from 'gulp';
import gulpLoad from 'gulp-load-plugins';
import seq from 'run-sequence';
import childProc from 'child_process';

const plugins = gulpLoad();
const basePath = __dirname;

const dirs = {
  src: basePath + '/src',
  build: basePath + '/build',
  test: basePath + '/test'
};

const glob = {
  src: dirs.src + '/**/*.js',
  build: dirs.build + '/**/*.js',
  test: dirs.test + '/**/*.js'
};

gulp.task('pre-clean', () => {
  return gulp.src(glob.build)
    .pipe(plugins.clean());
});

gulp.task('compile', () => {
  return gulp.src(glob.src)
    .pipe(plugins.babel({
      presets: ['es2015']
    })).pipe(gulp.dest(dirs.build));
});

gulp.task('jshint', () => {
  return gulp.src(glob.src)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('test', () => {
  return gulp.src(glob.test, {
    grep: /^_/i,
    read: false
  }).pipe(plugins.mocha({
    reporter: 'spec'
  })).once('error', () => {
    process.exit(1);
  });
});

gulp.task('shrink', cbk => {
  childProc.exec('npm shrinkwrap', (err, stdout, stderr) => {
    console.error(err || stderr, stdout);
    cbk(err);
  });
});

gulp.task('default', () => {
  gulp.watch(glob.src, ['build']);
  gulp.watch(glob.test, ['test']);
});

gulp.task('build', cbk => seq('jshint', 'test', 'pre-clean', 'compile', cbk));
