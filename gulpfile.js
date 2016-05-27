'use strict';
var gulp = require('gulp');
var connect  = require('gulp-connect');//local dev server
var open = require('gulp-open');//open a url
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');


var config = {
	port:9000,
	devBaseUrl:'http://localhost',
	paths:{
		html:'./src/*.html',
		js:'./src/**/*.js',
		css:[
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theam.min.css'
		],
		dist:'./dist',
		mainJs:'./src/main.js'
	}
};
//a local development server
gulp.task('connect',function(){
	connect.server({
		root:['dist'],
		port:config.port,
		base:config.devBaseUrl,
		livereload:true
	});
});
//open in browser
gulp.task('open',['connect'],function(){
	gulp.src('dist/index.html')
		.pipe(open('',{url:config.devBaseUrl+':'+config.port+'/'}));
});

gulp.task('html',function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
		console.log(config.paths.html);
});

gulp.task('js',function(){
	browserify(config.paths.mainJs)
	.transform(reactify)
	.bundle()
	.on('error',console.error.bind(console))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(config.paths.dist+'/scripts'))
	.pipe(connect.reload());

});
gulp.task('css',function(){
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist+'/css'));
});

gulp.task('watch',function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js']);
});

gulp.task('default',['html','js','css','open','watch']);


