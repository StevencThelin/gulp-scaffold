"use strict";

// Basic variable setup
var cfg = require("./config.json"), // Basic configuration
    gulp = require('gulp'), // Gulp
    $ = require('gulp-load-plugins')(), // Accespoint for plugins
    bs = require('browser-sync'), // Browsersync
    arrJsValidators = [] // array with enabled js validators we should use;

// Custom variables from cfg
var path = cfg.path, // paths for where assets are placed
    mod = cfg.module; // Module settings

// Check: is jshint enabled?
if(mod.jshint.enabled) {
  arrValidators.push('jshint');
}

// Check: is eslint enabled?
if(mod.eslint.enabled) {
  arrValidators.push('eslint');
}

// Helper functions
var onError = function (err) {
  // Emit warning
  $.gutil.beep();
  // Show visual warning in terminal
  $,gutil.log("Something went wrong", err, $.gutil.colors.red(err));
  // Emit end to gulp, so we make sure gulp is not hanging around to wait
  this.emit("end"); 
}

// Task: SASS Compiling
// @source: path.sass.source
// @output: path.sass.target
// @mod.sourcemap: Enabling/disabling of sourcemaps 
gulp.task('compile:sass', function () {
  return gulp.src(cfg.path.sass.source)
         .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.gutil.noop())
         .pipe($.sass())
         .on('error', onError($.sass.logError))
         .pipe($.autoprefixer(mod.autoprefixer))
         .pipe(mod.base64.enabled === true ? $.base64(mod.base64.opt) : $.gutil.noop())
         .pipe($.minifyCss())
         .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.gutil.noop())
         .pipe(gulp.dest(path.sass.target))
         .on('error', onError(err))
         .pipe(bs.reload({ stream: true }))
});

// Task: JS compiling
// @desc: 1) Run codevalidators 2) compile js
// @source: path.js.source
// @target: path.js.target
// @concatFilename: filename for concaneted file
// @mod.sourcemaps: Enabling/Disabling sourcemaps
gulp.task('compile:js', arrValidators, function () {
   return gulp.src(path.js.source)
          .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.gutil.noop())
          .pipe($.concat('site.js'))
          .pipe($.uglify(mod.uglify))
          .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.gutil.noop())
          .pipe(gulp.dest(path.js.target))
          .pipe(bs.reload({ stream: true }))
});

// Task: JsLint
// @desc: Validate code against ruleset
gulp.task('check:jshint', function () {
  return gulp.src(path.js.source)
         .pipe($.jshint())
         .pipe($.jshint.reporter('default'))
});

// Task: eslint
// @desc: Validate code against ruleset found in .eslintrc
gulp.task('check:eslint', function () {
  return gulp.src(path.js.source)
         .pipe($.eslint())
         .pipe($.eslint.format())
         .pipe($.eslint.failOnError())
         .on('error', onError())  
});

// Task: Image minification/cleaning
// @desc: Minificate/clean images for unnecessary variables etc. 
gulp.task('compile:images', function () {
    return gulp.src(path.images.source)
    .pipe($.imagemin(mod.imagemin.opt))
    .pipe(gulp.dest(path.images.target))
});

// Task: Browsersync
gulp.task('base:browsersync', function () {
  bs(mod.browsersync); 
});

// Task: Default
// @desc: Execute default tasks and add watchers for each individual task (ssas, js)
// @dependencies: When executed, gulp fires compile:sass, compile:js, compile:images and base:browsersync to make sure everything is up to date
gulp.task('default', ['compile:sass','compile:js', 'compile:images', 'base:browsersync'], function () {
    // Check: Is sass.watch pattern defined?
    if(path.sass.watch.length > 0) {
      // Watch for changes on path.sass.watch
      gulp.watch(path.sass.watch, ['compile:sass']);
    } 
  
    // Check: Is js.watch pattern defined?
    if(path.js.watch.length > 0) {
      // Watch for changes on path.js.watch
      gulp.watch(cfg.path.js.watch, ['compile:js']);
    }
});
