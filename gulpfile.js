"use strict";

// Basic variable setup
var cfg = require("./config.json"), // Basic configuration
    gulp = require('gulp'), // Gulp
    $ = require('gulp-load-plugins')(), // Accespoint for plugins
    bs = require('browser-sync'), // Browsersync
    arrJsValidators = []; // array with enabled js validators we should use;

// Custom variables from cfg
var path = cfg.path, // paths for where assets are placed
    mod = cfg.mod; // Module settings

// Check: is jshint enabled?
if(mod.jshint.enabled) {
  arrJsValidators.push('check:jshint');
}

// Check: is eslint enabled?
if(mod.eslint.enabled) {
  arrJsValidators.push('check:eslint');
}

// Helper functions
function onError (err) {
    // Emit warning
    $.util.beep();
    
    // Slit error message into smaller parts, to provide a better error message.
    var arrErrorMessage = err.message.split(" "),
        errorFile = arrErrorMessage[0].replace("\n", ""),
        errorLine = err.line,
        errorColumn = err.column;
    
    // Strip errormessage for filename and line/column numbers
    var errorMessage = err.message.replace(errorFile, "").replace(errorLine + ":" + errorColumn + " ", "").trim();
    
    // Construct errorMessage from new.
    var error = "File: " + errorFile + "\n" +
                "Line: " + errorLine + ", Column: " + errorColumn +"\n" +
                "Reason: " + errorMessage;
    
    // Show visual warning in terminal  
    $.util.log($.util.colors.red(error));
        
    // Emit warning through notifier
    // Temporarily fix until we have a better solution than to run a stream
    gulp.src('')
        .pipe($.notify({ 
                    "title": mod.notify.title, 
                    "subtitle": mod.notify.subtitle, 
                    "message": error
                    })
        );
                      
    // Emit end to gulp, so we make sure gulp is not hanging around to wait
    this.emit("end"); 
}

// @fn: Determine which type of CSS framework we should use
function setCSSFramework () {
    // Kun tanker lige pt.
    // 1) Test om sti til css er defined i config, check hvilke filtype der findes
    // 2) Check hvilke settings der er sat i config
    // 3) Determine response ud fra det
}

// Task: SASS Compiling
// @source: path.sass.source
// @output: path.sass.target
// @mod.sourcemap: Enabling/disabling of sourcemaps 
gulp.task('compile:sass', function () {
  return gulp.src(path.sass.source)
         .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.util.noop())
         .pipe($.sass())
         .on('error', onError)
         .pipe($.autoprefixer(mod.autoprefixer))
      //   .pipe(mod.base64.enabled === true ? $.base64(mod.base64.opt) : $.util.noop())
         .pipe($.minifyCss())
         .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.util.noop())
         .pipe(gulp.dest(path.sass.target))
         .on('error', onError)
         .pipe($.notify({ 
                          "title": mod.notify.title, 
                          "subtitle": mod.notify.subtitle, 
                          "message": "Completed: SASS compiling"
                        })
              )
         .pipe(bs.reload({ stream: true }))
});

// Task: JS compiling
// @desc: 1) Run codevalidators 2) compile js
// @source: path.js.source
// @target: path.js.target
// @concatFilename: filename for concaneted file
// @mod.sourcemaps: Enabling/Disabling sourcemaps
gulp.task('compile:js', arrJsValidators, function () {
   return gulp.src(path.js.source)
          .pipe(mod.sourcemaps === true ? $.sourcemaps.init() : $.util.noop())
          .pipe($.concat('site.js'))
          .pipe($.uglify(mod.uglify))
          .pipe(mod.sourcemaps === true ? $.sourcemaps.write() : $.util.noop())
          .pipe(gulp.dest(path.js.target))
          .pipe($.notify({ 
                           "title": mod.notify.title, 
                           "subtitle": mod.notify.subtitle, 
                           "message": "Completed: javascript compiling" 
                        })
               )
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
         .on('error', onError)  
});

// Task: Image minification/cleaning
// @desc: Minificate/clean images for unnecessary variables etc. 
gulp.task('compile:images', function () {
    return gulp.src(path.images.source)
    .pipe($.imagemin(mod.imagemin.opt))
    .pipe(gulp.dest(path.images.target))
    .pipe($.notify({ 
                  "title": mod.notify.title, 
                  "subtitle": mod.notify.subtitle, 
                  "message": "Completed: image optimization",
                  "onLast": true
              })
         )
});

// Task: Browsersync
gulp.task('base:browsersync', function () {
  bs(mod.browsersync); 
});

// Task: Default
// @desc: Execute default tasks and add watchers for each individual task (ssas, js)
// @dependencies: When executed, gulp fires compile:sass, compile:js, compile:images and base:browsersync to make sure everything is up to date
gulp.task('default', ['compile:sass', 'compile:js', 'compile:images', 'base:browsersync'], function () {
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
