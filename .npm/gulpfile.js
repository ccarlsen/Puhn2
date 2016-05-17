var gulp 			= require('gulp');
var browserSync 	= require('browser-sync');
var connect 		= require('gulp-connect-php');
var sass 			= require('gulp-ruby-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var reload 			= browserSync.reload;

gulp.task('serve', ['sass'], function() {
	connect.server({
		base: '../'
	}, function() {
		browserSync({
			proxy: 'localhost:8000',
			ghostMode: false,
			notify: false
		});
	});
	gulp.watch('../assets/scss/**/*.scss', ['sass']);
	gulp.watch('../assets/js/**/*.js', reload);
	gulp.watch('../**/*.html', reload);
});

function sassStream() {
	return sass('../assets/scss/style.scss', {
		sourcemap: false,
		style: 'expanded',
		unixNewlines: true
	})
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(autoprefixer({add: false, browsers: []}));
}

gulp.task('sass', function() {
	return sassStream()
	.pipe(gulp.dest('../assets/css'))
	.pipe(reload({
		stream: true
	}));
});

gulp.task('default', ['serve']);