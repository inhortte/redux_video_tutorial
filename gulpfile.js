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
  dest: jsDir
  //sourceRoot: path.join(__dirname, 'public/js')
};
gulp.task('clean', function() {
  del([
    path.join(jsDir, '*.js'),
    path.join(jsDir, 'bundle'),
    '!' + path.join(jsDir, 'cookie.js'),
    '!' + path.join(jsDir, 'thurk.js')
  ]);
});
gulp.task('build', function(cb) {
  runSequence('babel', 'browserify', cb);
});
gulp.task('babel', function() {
  return gulp.src(babelPaths.vdna)
             .pipe(sourcemaps.init())
             .pipe(babel({
               sourceMaps: 'inline'
             }))
    // .pipe(sourcemaps.write('.', { sourceRoot: babelPaths.sourceRoot }))
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
