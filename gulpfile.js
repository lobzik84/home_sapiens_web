var gulp = require("gulp"),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename =require('gulp-rename'),
	notify =require('gulp-notify');
var paths = {
    scripts: [
        'public_html/js/jquery/*.js',
        'public_html/js/parameters/*.js',
        'public_html/js/swipe_alerts/*.js',
        'public_html/js/src/*.js'
    ]    
};
gulp.task('build-production', function() {
	gulp.src(paths.scripts)
    .pipe(concat('x.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public_html/js/min'))
    .pipe(notify({ message: 'build-production task complete' }));
});
gulp.task('build-dev', function() {
	gulp.src(paths.scripts)
    .pipe(concat('x.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public_html/js/min'))
    .pipe(notify({ message: 'build-dev task complete' }));
});
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['build-dev']);    
});

