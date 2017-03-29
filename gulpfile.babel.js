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
const rename = require('gulp-rename');
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

const processJs = lazypipe()
  .pipe(() => gulpif(argv.debug, sourcemaps.init()))
  .pipe(eslint)
  .pipe(eslint.format)
  .pipe(() => gulpif(!argv.debug, eslint.failAfterError()))
  .pipe(rollup, OPTIONS.rollup)
  .pipe(() => gulpif(!argv.debug, uglify(OPTIONS.uglify)))
  .pipe(() => gulpif(argv.debug, sourcemaps.write()));

gulp.task('build', () => {
  const js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
        html = filter((file) => /\.(html)$/.test(file.path), { restore: true }),
        scripts = processInline();

  return gulp.src('src/*')
    .pipe(errorNotifier())

      .pipe(js)
        .pipe(processJs())
        .pipe(rename(path => path.extname = ".min.js"))
      .pipe(js.restore)

      .pipe(html)
        .pipe(inline(OPTIONS.inline))
        .pipe(scripts.extract('script:not([src])'))
          .pipe(processJs())
        .pipe(scripts.restore())
      .pipe(html.restore)

      .pipe(size({ gzip: true }))
    .pipe(gulp.dest('.'))
});

gulp.task('build:tests', () => {
  const js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
        html = filter((file) => /\.(html)$/.test(file.path), { restore: true }),
        scripts = processInline();

  return gulp.src(['test/**/*'])
    .pipe(errorNotifier())

    .pipe(html)
      .pipe(inline(OPTIONS.inline))
      .pipe(scripts.extract('script'))
        .pipe(processJs())
      .pipe(scripts.restore())
    .pipe(html.restore)

    .pipe(js)
      .pipe(processJs())
    .pipe(js.restore)

  .pipe(gulp.dest('.test'));
});

gulp.task('watch:src', () => gulp.watch(['src/**/*'], () => gulprun('build', 'refresh')));
gulp.task('watch:tests', () => gulp.watch(['test/**/*', 'src/**/*'], ['build:tests']));
gulp.task('watch', [ 'watch:src', 'watch:tests' ]);

gulp.task('serve', () => bs.init(OPTIONS.browserSync));
gulp.task('refresh', () => bs.reload());

gulp.task('test', gulprun('build', 'build:tests', 'test:local'));

gulp.task('default', ['build', 'serve', 'watch']);
