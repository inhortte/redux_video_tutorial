var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');

var path = require('path');

var babelPaths = {
  vdna: ['public/src/*.js'],
  dest: 'public/js',
  sourceRoot: path.join(__dirname, 'public/js'),
};
gulp.task('build', function(cb) {
  runSequence('babel', 'browserify', cb);
});
gulp.task('babel', function() {
  return gulp.src(babelPaths.vdna)
             .pipe(sourcemaps.init())
             .pipe(babel())
             .pipe(sourcemaps.write('.', { sourceRoot: babelPaths.sourceRoot }))
             .pipe(gulp.dest(babelPaths.dest));
});
gulp.task('browserify', function() {
  return gulp.src('public/js/vdnamenu.js')
             .pipe(browserify({
               insertGlobals: true
             }))
             .pipe(gulp.dest('public/js/bundle'))
});
gulp.task('watch', function() {
  gulp.watch(babelPaths.vdna, ['build']);
});
gulp.task('default', ['watch']);
