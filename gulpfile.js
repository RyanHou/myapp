var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    del = require('del'),
    notify = require('gulp-notify'),
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 9090,
    livereload = require('gulp-livereload');   //livereload
    webserver = require('gulp-webserver');


//HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
        .pipe(notify({ message: 'html task complete' }));
});

// 样式处理
gulp.task('css', function () {
    gulp.src('src/css/*.css')
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'srcCss to distCss task complete' }));
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions','firefox 8','safari 5', 'ie 8', 'ie 9','ie 10', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'less task complete' }));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = './src/img/**/*',
        imgDst = './dist/img';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst))
        .pipe(notify({ message: 'images task complete' }));
})

// js处理
gulp.task('js', function () {
    var jsSrc = './src/js/*.js',
        jsDst ='./dist/js';

    gulp.src(jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst))
        .pipe(notify({ message: 'js task complete' }));
});


// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['dist/css', 'dist/js', 'dist/img'], {read: false})
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','css','images','js');
    //gulp.watch('src/**/*.less', ['styles']);
});

// 注册任务
gulp.task('webserver', function() {
    gulp.src( './src' ) // 服务器目录（./代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch-server',function(){
    gulp.watch( 'src/*.html', ['html']) // 监听根目录下所有.html文件
});

// 默认任务
gulp.task('default2',['webserver','watch-server']);

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){



    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        gulp.watch('src/*.html', function(event){
            gulp.run('html');
        })

        // 监听css
        gulp.watch('src/less/*.less', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('src/img/**/*', function(){
            gulp.run('images');
        });

        // 监听js
        gulp.watch('src/js/*.js', function(){
            gulp.run('js');
        });

    });
});




