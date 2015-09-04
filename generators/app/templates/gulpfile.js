'use strict';

//Plugins used for the tasks
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'), 
    sass = require('gulp-sass'), 
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    wiredep = require('wiredep').stream,
    autoprefixer = require('gulp-autoprefixer'),
    karma = require('karma').server,
    gp = require('gulp-protractor'),
    del = require('del'),
    useref = require('gulp-useref'),
    gulpFilter = require('gulp-filter'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace');


//setting env variable depending on various conditions
if (!gutil.env.production && !gutil.env.test && gutil.env._[0] !== 'build') {
  gutil.env.development = true;
} else if (gutil.env._[0] === 'build') {
  gutil.env.production = true;
}

//setting base paths (not used in tasks). Only needed to set those paths conditionally in path variable
var basePaths = {
  app: 'app/',
  dist: 'dist/'
};

//setting paths used in task
var paths = {
  app: basePaths.app,
  dist: basePaths.dist,
  tmp: '.tmp/',
  base: gutil.env.development ? basePaths.app : basePaths.dist,
  indexHtml: 'app/index.html',
  assets: 'app/assets/**',
  bower: 'app/assets/bower/**',
  js: ['app/modules/app.js', 'app/modules/*/*.module.js', 'app/modules/**/*.js', '!app/modules/**/tests/**/*.js'],
  views: ['app/modules/**/views/**/*.html'], 
  sass: ['app/modules/main/assets/sass/**/*.scss', 'app/assets/sass/**/*.scss', 'app/modules/**/assets/sass/**/*.scss', '!app/modules/**/assets/sass/**/_*.scss'], 
  images: 'app/modules/**/img/**',
  fonts: ['app/assets/font/**'],
  json: 'app/modules/**/json/**'
};

//Watch changes on files and perform assigned tasks
gulp.task('watch', function () { 
  gulp.watch(paths.sass, ['styles']); 
  
  //gulp.watch(paths.bower, ['bower']);
  gulp.watch(paths.views, ['reload']);
  gulp.watch(paths.indexHtml, ['reload']);

  gulp.watch(paths.js, ['jshint', 'scripts']);
});

//development server including livereload to reload page on changes in code
gulp.task('connect', function () {
  connect.server({
    root: 'app',
    // fallback: 'app/index.html', //optional needed for HTML5 mode. Attention: if files cannot be found, index.html will be delivered
    livereload: true
  });
});

//Minify and apply file rev on files according to build comments in index.html
gulp.task('useref', ['clean', 'copy', 'templates', 'scripts:build', 'styles'], function () {
  var assets = useref.assets();
  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');

  return gulp.src(paths.indexHtml)
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulp.dest(paths.dist));
});

//Concat all module scipt files together and create a source map for easy debugging
gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/modules'}))
    .pipe(gulp.dest(paths.base + 'assets/js/'))
    .pipe(connect.reload());
});

gulp.task('scripts:build', ['clean', 'copy', 'templates'], function (){
  return gulp.src(paths.js.concat([paths.tmp + 'js/templates.js']))
    .pipe(ngAnnotate({'single_quotes': true}))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.tmp + 'assets/js'));
});

//Create template.js which conatins all html templates and put them into the template cache
gulp.task('templates', ['clean'], function () {
  return gulp.src(paths.views)
    .pipe(minifyHtml({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true, // Only if you don't use comment directives!
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(templateCache({
      module: 'app.core',
      root: 'modules'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.tmp + 'js/'));
});

//Include all bower dependencies into the index.html
gulp.task('bower', function () {
  return gulp.src(paths.indexHtml)
    .pipe(wiredep({
      exclude: [ 
        'app/assets/bower/materialize/bin/materialize.css'
      ]
    }))
    .pipe(gulp.dest(paths.app))
    .pipe(connect.reload());
});


//Check javascript for errors
gulp.task('jshint', function () {
  return gulp.src(paths.js.concat(['./gulpfile.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

//Compile less files and concat them together
gulp.task('styles', function () {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(connect.reload());
});

//simple reload task if no specific tasks need to run on change
gulp.task('reload', function () {
    gulp.src(paths.indexHtml).pipe(connect.reload());
});

//Run unit tests with karma 
gulp.task('unit', function () {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
});

//Web server and selenium server have to get started manually
gulp.task('e2e', function() {
    gulp.src(['app/modules/**/tests/e2e/*.js'])
        .pipe(gp.protractor({
            configFile: './protractor.conf.js'
        }));
});

//Copy all static files to dist folder
gulp.task('copy', ['clean', 'bower'], function(){
    var path = [paths.indexHtml, paths.bower, paths.images, paths.fonts, paths.json];

    return gulp.src(path, {base: paths.app})
        .pipe(gulp.dest(paths.dist));
});

//clean directories before build
gulp.task('clean', function(cb) {
    del([
        paths.dist,
        paths.tmp
    ], cb);
});

gulp.task('serve', ['jshint', 'bower', 'scripts', 'styles', 'connect', 'watch']);
//gulp.task('serve', ['jshint', 'bower', 'scripts', 'styles', 'connect']);
gulp.task('default', ['serve']);
gulp.task('test', ['unit', 'e2e']);
gulp.task('build', ['clean', 'jshint', 'bower', 'copy', 'templates', 'scripts:build', 'styles', 'useref']);