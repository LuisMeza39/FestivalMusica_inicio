
function tarea(done){
    console.log('Mi primer tarea');

    done()//Espesifica que la funcion llego a su fin, adicional elimina errores al llamar la funcion desde la terminal
}

exports.tarea = tarea; //llamda desde node(verificar mas info de node.js)
                             //exports.tarea : se refiere a codigo de node con el cual se perite la llamada de codigo desde la terminal 
                             //tarea; : es la funcion que se manda a llamar y ejecutar

//------------------------------------------------------------------------------------------------------------

const { src, dest, watch, parallel } = require("gulp"); //src y dest son funciones de gulp 
                                       //src sirve para identificar archivos y dest almacena informacion en una carpeta destino
                                       //el require('gulp') extare la funcionalida de la carpeta index.js dentro de la carpeta gulp dentro de la carpeta .bin, lo cual es la funcionalida de gulp en general

// CSS
const sass = require("gulp-sass")(require("sass")) //Importando sass 
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


// Imagenes
const cache = require('gulp-cache'); // se usa para aligerar imagenes 
const imagemin = require('gulp-imagemin'); // se usa para aligerar imagenes
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JavaScript 
const terser = require('gulp-terser-js');

function css(done){

    //Identificar el archivo de sass 
    src("src/scss/**/*.scss") 
        .pipe(sourcemaps.init())
        .pipe(plumber())
        //Compilarlo
        .pipe(sass())
        .pipe( postcss ( [autoprefixer(), cssnano() ] ) )
        .pipe(sourcemaps.write('.'))
        //Almacenarla en el disco duro
        .pipe( dest("build/css") );

    done();
}

function imagenes(done){

    const opciones = {
        optimizationLevel: 3
    }


    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe( dest('build/img') )


    done();
}

function versionWebp ( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones ))
        .pipe(dest('build/img'))

    done();
}

function versionAvif ( done ){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones ))
        .pipe(dest('build/img'))

    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe ( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe(dest('build/js'));


    done()
}


/* crea build de producción: npx gulp prod */
function prod(done){
    src("build/**/*.*")
        .pipe(dest("prod/build"));
    src("video/**/*.*")
        .pipe(dest("prod/video"));
    src("index.html")
        .pipe(dest("prod"));
    done();
}


function dev(done){
    watch("src/scss/**/*.scss", css); //escuchando cambios en archivos .scss
    watch("src/js/**/*.js", javascript); //escuchando cambios en archivos .js


    done()
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.prod = prod;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);