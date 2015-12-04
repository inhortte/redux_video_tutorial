var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var del = require('del');

var path = require('path');
var srcDir = 'public/src';
var jsDir = 'public/js';
var noLimpies = ['cookie.js', 'thurk.js'];

var babelPaths = {
  vdna: [path.join(srcDir, '*.js')],
  mock_server: srcDir + '/mock_server.js',
  dest: jsDir,
  ms_dest: jsDir
};
gulp.task('clean', function() {
  del([
    path.join(jsDir, '*.js'),
    path.join(jsDir, 'bundle'),
    '!' + path.join(jsDir, 'cookie.js'),
    '!' + path.join(jsDir, 'thurk.js')
  ]);
});
gulp.task('ms', function(cb) {
  runSequence('msBabel', 'msBrowserify', cb);
});
gulp.task('msBabel', function(cb) {
  return gulp.src(babelPaths.mock_server)
            .pipe(babel({
              presets: ['es2015']
            }))
            .pipe(gulp.dest(babelPaths.ms_dest));
});
gulp.task('msBrowserify', function(cb) {
  return gulp.src('public/js/mock_server.js')
            .pipe(browserify({
              insertGlobals: true
            }))
            .pipe(gulp.dest('public/js/bundle'));
});
gulp.task('build', function(cb) {
  runSequence('babel', 'browserify', cb);
});
gulp.task('babel', function() {
  return gulp.src(babelPaths.vdna)
             .pipe(sourcemaps.init())
             .pipe(babel({
               presets: ['es2015', 'react']
             }))
             .pipe(gulp.dest(babelPaths.dest));
});
gulp.task('browserify', function() {
  return gulp.src('public/js/vdnamenu.js')
             .pipe(browserify({
               insertGlobals: true,
               debug: true
             }))
             .pipe(gulp.dest('public/js/bundle'))
});
gulp.task('watch', function() {
  gulp.watch(babelPaths.vdna, ['build']);
});
gulp.task('default', ['watch']);
