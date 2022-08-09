const gulp = require('gulp');
const process = {
    concat: require('gulp-concat'),
    css: {
        compile: require('gulp-sass')(require('sass')),
        minify: require('gulp-clean-css'),
    },
    js: require('gulp-uglify'),
    srcmap: require("gulp-sourcemaps")
}
const project = {
    src: {
        sass: "src/scss/**/*.scss",
        css: "src/css/**/*.css",
        js: "src/js/**/*.js",
    },
    build: {
        css: "public/dist/css",
        js: "public/dist/js"
    }
}
gulp.task('sass', () => {
    return gulp.src(project.src.sass)
        .pipe(process.srcmap.init())
        .pipe(process.css.compile())
        .pipe(process.concat("99-style.css"))
        .pipe(process.css.minify())
        .pipe(process.srcmap.write())
        .pipe(gulp.dest("src/css"));
});
gulp.task('css', () => {
    return gulp.src(project.src.css)
        .pipe(process.srcmap.init())
        .pipe(process.css.minify())
        .pipe(process.concat("style.css"))
        .pipe(process.srcmap.write())
        .pipe(gulp.dest(project.build.css));
});
gulp.task("js", () => {
    return gulp.src(project.src.js)
        .pipe(process.srcmap.init())
        .pipe(process.js())
        .pipe(process.concat("script.js"))
        .pipe(process.srcmap.write())
        .pipe(gulp.dest(project.build.js));
});


gulp.task("build-css", gulp.series("sass", "css"));
gulp.task("build", gulp.parallel("build-css", "js"));

gulp.task("watch", () => {
    gulp.watch(project.src.sass, gulp.series("build-css"));
    gulp.watch(project.src.js, gulp.series("js"));
})
