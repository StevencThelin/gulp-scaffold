# Boilerplate / scaffold for gulp projekter
This scaffold is intended to bring an clean cut to working with gulp. The concept is simple: gulpfile.js is the engine, and config.json is the fuel. Gulpfile.js provides a basic setup for sass/less compiling, javascript compiling and image minification.

The job is clear; When you're setting up your project, the configuration file is where you edit and setup your project for use with gulp.

## Installation 
If you just have cloned the repository down to your project, all you need to do is install the devDependencies gulp requires.

Type: **npm install** in your terminal.

## After installation
When you have installed all the dependencies you're almost done. All you have to do is setup settings for each module in config.json.
As per default config.json comes with some basic settings you can use. Its best that you alter path options for each subrutine to match your current project to make sure gulp performs as intended.

The "mod" section contains options for a module. Each module is listed further down to provide access to their respective api's to give the best options for editing. 

* gulp-sass: https://www.npmjs.com/package/gulp-sass
* gulp-imagemin: 
* gulp-sourcemaps: https://www.npmjs.com/package/gulp-sourcemaps
* gulp-uglify: https://www.npmjs.com/package/gulp-uglify
* gulp-notify: 
* gulp-autoprefixer: 
* gulp-base64

## Custom module options
Some of the modules contains an option called: "enabled". The "enabled" options tells gulp to use the module and take actions accordingly. Please note that not all modules contains such an option and therefore only the ones with "enabled" found in config can use it.

## Development tasks
- [ ] Make it possbile to support less/sass in a project instead of just sass
- [x] Check if all modules have added default options in config
- [ ] Test of implementation
- [ ] Test use of module options for each task
- [x] Validate error handler acts correctly to prevent "hanging" in watch events
- [ ] Optimize default task dependencies
- [ ] Find better alternative for handling "vendor/site" specific js in case of use of eslint/jshint
