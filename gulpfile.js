var stylus = require('gulp-stylus');
var gulp = require('gulp');

var paths = {
  styles: './assets/style/style.styl'
}

// const OUT_DIR = './build';
const ASSET_STYL_DIR = './public/assets/style';

gulp.task('css', function () {
  gulp.src(paths.styles)
    .pipe(stylus({}))
    .pipe(gulp.dest(ASSET_STYL_DIR));
});


gulp.task('watch', function() {
  gulp.watch(paths.styles, ['css']);
});

gulp.task('default', ['watch', 'css']);
