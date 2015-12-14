var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var del = require('del');

var path = require('path');
var srcDir = 'public/src';
var jsDir = 'public/js';

var babelPaths = {
  msSrc: [path.join(srcDir, '*.js')],
  msDest: jsDir
};
gulp.task('clean', function() {
  del([
    path.join(msDest, '*.js'),
    path.join(msDest, 'bundle'),
  ]);
});
gulp.task('ms', function(cb) {
  runSequence('msBabel', 'msBrowserify', cb);
});
gulp.task('msBabel', function(cb) {
  return gulp.src(['public/src/todoApp.js', 'public/src/TodoApp.js', 'public/src/mock_server.js'])
            .pipe(sourcemaps.init())
            .pipe(babel({
              presets: ['es2015', 'react']
            }))
            .pipe(gulp.dest(babelPaths.msDest));
});
gulp.task('msBrowserify', function(cb) {
  return gulp.src('public/js/mock_server.js')
            .pipe(browserify({
              insertGlobals: true,
              debug: true
            }))
            .pipe(gulp.dest('public/js/bundle'));
});
gulp.task('watchMs', function() {
  gulp.watch(['public/src/mock_server.js', 'public/src/TodoApp.js', 'public/src/todoApp.js'], ['ms']);
});
gulp.task('default', ['watchMs']);
