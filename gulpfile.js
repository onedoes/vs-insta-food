'use strict';

var argv = require('yargs').argv;
var spawn = require('child_process').spawn;

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var runSequence = require('run-sequence').use(gulp);
// *


////////////////////////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////////////////////////
var env = !!argv.prod ? 'prod' : 'dev';
var config = {
  srcFolder: 'src',
  indexPath: 'index.html',
  allPath: 'all.scss',
  criticals: 'critical.{js,css}',
  jsFiles: '**/!(*.spec).js',
  copyFiles: [
    'jspm_packages/**/*',
    'vendor/**/*',
    'node_modules/babel-core/browser-polyfill.js',
    'jspm.config.js'
  ],
  copySrcFiles: [
    '**/*.html',
    '!index.html',
    'icons/**/*',
    'images/**/*'
  ],
  svgFiles: 'common/assets/svg/*.svg',

  outFolder: 'out'
};
// *


////////////////////////////////////////////////////////////////////////////////
// DEFAULT
////////////////////////////////////////////////////////////////////////////////
var defaultTaskOrder = {
  dev: [
    'clean:out',
    [
      'scss',
      'es6',
      'copy'
    ],
    'index'
  ],
  prod: [
    'clean:out'
  ]
};

gulp.task('default', function (cb) {
  runSequence.apply(null, defaultTaskOrder[env], cb);
});
// *


////////////////////////////////////////////////////////////////////////////////
// SERVE
////////////////////////////////////////////////////////////////////////////////

gulp.task('serve', function (cb) {
  runSequence.apply(null, defaultTaskOrder[env].concat([
    'browser-sync',
    'watch'
  ]), cb);
});
// *


////////////////////////////////////////////////////////////////////////////////
// WATCH
////////////////////////////////////////////////////////////////////////////////
var chokidar = require('chokidar');
var DEFAULT_WATCH_OPTIONS = { interval: 1000, cwd: config.srcFolder };

gulp.task('watch', function () {
  var lastFileSizes = {}; // dummy file changed test

  chokidar
    .watch('**/*.js', DEFAULT_WATCH_OPTIONS)
    .on('change', function (path, stats) {
      if (!stats || stats.size === lastFileSizes[path]) return;
      lastFileSizes[path] = stats.size;
      runSequence('es6');
    });

  chokidar
    .watch(config.copySrcFiles, DEFAULT_WATCH_OPTIONS)
    .on('change', function (path, stats) {
      if (!stats || stats.size === lastFileSizes[path]) return;
      lastFileSizes[path] = stats.size;
      runSequence('copy');
    });

  chokidar
    .watch('**/*.scss', DEFAULT_WATCH_OPTIONS)
    .on('change', function (path, stats) {
      if (!stats || stats.size === lastFileSizes[path]) return;
      lastFileSizes[path] = stats.size;
      runSequence('scss');
    });

});
// *


////////////////////////////////////////////////////////////////////////////////
// ES6
////////////////////////////////////////////////////////////////////////////////
gulp.task('es6', function () {
  return gulp.src([
    '**/!(*.spec).js',
    // Don't touch my critical js !
    // It will be added injected as it stands in the html
    '!critical.js'
  ], { cwd: config.srcFolder })
    .pipe($.changed(config.outFolder))
    .pipe($.plumber())
    .pipe($.babel({
      experimental: true,
      modules: 'system'
    }))
    .pipe(gulp.dest(config.outFolder));
});
// *


////////////////////////////////////////////////////////////////////////////////
// CLEAN
////////////////////////////////////////////////////////////////////////////////
var del = require('del');

gulp.task('clean:out', function (cb) {
  return del(config.outFolder, cb);
});
// *


////////////////////////////////////////////////////////////////////////////////
// COPY
////////////////////////////////////////////////////////////////////////////////
gulp.task('copySrcFiles', function () {
  return gulp.src(config.copySrcFiles, {
    cwd: config.srcFolder,
    base: config.srcFolder
  })
    .pipe($.changed(config.outFolder))
    .pipe(gulp.dest(config.outFolder));
});
gulp.task('copy', ['copySrcFiles'], function () {
  return gulp.src(config.copyFiles, { base: '.' })
    .pipe($.changed(config.outFolder))
    .pipe(gulp.dest(config.outFolder));
});
// *


////////////////////////////////////////////////////////////////////////////////
// SCSS
////////////////////////////////////////////////////////////////////////////////
gulp.task('scss', function () {
  return $.rubySass(config.srcFolder, {
    style: 'expanded',
    lineNumbers: true,
    precision: 3
  })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe($.autoprefixer('last 5 version'))
    .pipe(gulp.dest(config.outFolder));
});
// *


////////////////////////////////////////////////////////////////////////////////
// BROWSER-SYNC
////////////////////////////////////////////////////////////////////////////////

var browserSync = require('browser-sync');

gulp.task('browser-sync', function (cb) {
  browserSync({
    server: {
      baseDir: ['.', config.outFolder]
    },
    files: config.outFolder + '/**/*.+(js|css|html)',
    logConnections: true,
    open: false,
    ghostMode: false,
    https: true,
    watchOptions: {
      debounceDelay: 1000
    }
  }, cb);
});
// *


////////////////////////////////////////////////////////////////////////////////
// INDEX
////////////////////////////////////////////////////////////////////////////////

gulp.task('index', function () {
  return gulp.src(config.indexPath, { cwd: config.srcFolder })
    .pipe($.inject(
      gulp.src([
        'jspm_packages/github/necolas/normalize.css@3.0.2/normalize.css',
        config.srcFolder + '/' + config.criticals
      ]), {
        transform: env === 'prod' && inlineFileContent
      }
    ))
    .pipe(gulp.dest(config.outFolder));

  function inlineFileContent(filePath, file) {
    var content = file.contents.toString('utf8');
    if (filePath.slice(-3) === '.js') {
      content = '<script async defer>\n' + content + '\n</script>';
    }
    else if (filePath.slice(-4) === '.css') {
      content = '<style>\n' + content + '\n</style>'
    }
    return content;
  }
});
// *


////////////////////////////////////////////////////////////////////////////////
// DEPLOY
////////////////////////////////////////////////////////////////////////////////

var Deployor = require('node-git-deployor');
Deployor.verbose = true;

gulp.task('deploy', function () {

  var outWorkspace = Deployor.cloneRepoBranch({
    orphan: true,
    branch: 'gh-pages',
    cloneLocation: '/tmp/onedoes-vs-instafood-out'
  });

  outWorkspace.extraCleanUp();
  outWorkspace.copy('./out');
  outWorkspace.commit('Update ' + new Date().toISOString());
  outWorkspace.push();

});
