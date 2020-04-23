const gulp = require('gulp')
    , sass = require('gulp-sass')
    , sourcemaps = require('gulp-sourcemaps')
    , postcss = require('gulp-postcss')
    , autoprefixer = require('autoprefixer')
    , pxtorem = require('postcss-pxtorem')
    , cssnano = require('cssnano')
    , perfectionist = require('perfectionist')
    , rename = require('gulp-rename')
    , nunjucksRender = require('gulp-nunjucks-render')
    , data = require('gulp-data')
    , fs = require('fs')
    , htmlmin = require('gulp-htmlmin')
    , prettify = require('gulp-html-prettify')
    , imagemin = require('gulp-imagemin')
    , bs = require('browser-sync').create()

function styles() {
  return gulp.src('./src/sass/*.scss')  
    .pipe(sourcemaps.init())        
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        autoprefixer('last 10 versions'),
        pxtorem({            
          propList: ['*']
        }),
        cssnano(),
        perfectionist({ 
          format: 'compact' 
        })
    ])) 
    .pipe(rename({
        basename: 'styles',
        suffix: '.bundle'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(bs.stream());
}

function templates() {
  return gulp.src('./src/*.njk')
    .pipe(data(function() {
        return JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))
    }))
    .pipe(nunjucksRender({
        path: ['./src']
    }))   
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(prettify({indent_char: ' ', indent_size: 3}))
    .pipe(gulp.dest('./dist'));           
}

function images() {
  return gulp.src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
}

function server() {
  bs.init({
    server: {
        baseDir: './dist'
    }
  });

  gulp.watch('./src/sass/*.scss', styles); 
  gulp.watch('./src/images/**/*', images);  
  gulp.watch('./src/**/*.+(njk|json)', templates).on('change', bs.reload);   
  gulp.watch('./*.html').on('change', bs.reload);
}
 
exports.styles = styles;
exports.templates = templates;
exports.images = images;
exports.build = gulp.series(styles, templates);
exports.default = server;