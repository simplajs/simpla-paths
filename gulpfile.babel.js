/*eslint one-var: 0 */

// Core deps
// Use require() because of rollup
const gulp = require('gulp');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const lazypipe = require('lazypipe');
const filter = require('gulp-filter');
const gulprun = require('run-sequence');
const yargs = require('yargs');
const browserSync = require('browser-sync');
const wct = require('web-component-tester');

// JS
const eslint = require('gulp-eslint');
const rollup = require('gulp-rollup-file');
const commonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

// HTML
const inline = require('gulp-inline-source');
const processInline = require('gulp-process-inline');

const wctConfig = require('./wct.conf.js'),
      bs = browserSync.create(),
      argv = yargs.boolean(['debug']).argv,
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
      OPTIONS = {
        rollup: {
          plugins: [
            resolve({
              main: true,
              jsnext: true,
              browser: true,
            }),
            commonJs(),
            babel()
          ],
          format: 'iife'
        },
        uglify: {
          mangle: !argv.debug
        },
        inline: {
          compress: false,
          swallowErrors: true
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components'
            }
          },
          open: false,
          notify: false
        }
      };

wct.gulp.init(gulp);

// Build
gulp.task('build', () => {
  const js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
        html = filter((file) => /\.(html)$/.test(file.path), { restore: true }),
        scripts = processInline(),
        processJs = lazypipe()
          .pipe(() => gulpif(argv.debug, sourcemaps.init()))
          .pipe(eslint)
          .pipe(eslint.format)
          .pipe(() => gulpif(!argv.debug, eslint.failAfterError()))
          .pipe(rollup, OPTIONS.rollup)
          .pipe(() => gulpif(!argv.debug, uglify(OPTIONS.uglify)))
          .pipe(() => gulpif(argv.debug, sourcemaps.write()));

  return gulp.src('src/simpla-paths.*')
    .pipe(errorNotifier())

      .pipe(js)
        .pipe(processJs())
      .pipe(js.restore)

      .pipe(html)
        .pipe(inline(OPTIONS.inline))
        .pipe(scripts.extract('script:not([src])'))
          .pipe(processJs())
        .pipe(scripts.restore())
      .pipe(html.restore)

      .pipe(size({ gzip: true }))
    .pipe(gulp.dest('.'));
});

// Build HTML tests
gulp.task('build:tests:html', () => {
  return gulp.src(['test/**/*.html'])
    .pipe(gulp.dest(wctConfig.suites[0]));
});

// Build JS tests
gulp.task('build:tests:js', () => {
  return gulp.src(['test/**/*.js'])
    .pipe(errorNotifier())

      .pipe(gulpif(argv.debug, sourcemaps.init()))
      .pipe(rollup(OPTIONS.rollup))

      // Minify and pipe out
      .pipe(gulpif(argv.debug, sourcemaps.write()))
      .pipe(size({ gzip: true }))

    .pipe(gulp.dest(wctConfig.suites[0]));
});

// Build all tests
gulp.task('build:tests', ['build:tests:js', 'build:tests:html']);

// Watches
gulp.task('watch:src', () => gulp.watch(['src/**/*'], () => gulprun('build', 'refresh')));
gulp.task('watch:tests', () => gulp.watch(['test/**/*', 'src/**/*'], ['build:tests']));
gulp.task('watch', [ 'watch:src', 'watch:tests' ]);
gulp.task('refresh', () => bs.reload());

// Utility tasks
gulp.task('demo', () => bs.init(OPTIONS.browserSync));
gulp.task('test', gulprun('build', 'build:tests', 'test:local'));

// Default stack
gulp.task('default', ['build', 'demo', 'watch']);
