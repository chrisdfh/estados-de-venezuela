"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// NO FUNCIONA EN FIREFOX, EN CHROME SI
// import estadosJson from './estados.json' assert { type: 'json' }
const nombreEstado = document.querySelector('#nombreEstado');
const botonera = document.querySelector('.botones');
const scorePlaceholder = document.querySelector('#score');
const newGameBtn = document.querySelector('#newGameBtn');
const estadoCorrectoPlaceholder = document.querySelector('#estadoCorrectoPlaceholder');
const estadoCorrectoName = document.querySelector('#estadoCorrecto');
const numOpciones = document.querySelector('#cant-opciones');
let estadosVistos = new Array();
let estadosJson = [];
let score = 0;
class Estados {
    constructor(estado, capital) {
        this.estado = estado;
        this.capital = capital;
    }
}
fetch('./estados.json')
    .then(res => res.json()).then(data => {
    estadosJson = [...Array.from(data)];
});
// Array.prototype.aleatorio = function(){
//     return this[Math.floor((Math.random()*this.length))]
// }
function randomArray(array) {
    return array[Math.floor((Math.random() * array.length))];
}
function preparaCapitales() {
    return __awaiter(this, void 0, void 0, function* () {
        let capitales = new Array(); //ALMACENO NOMBRES DE CAPITALES
        let preguntas = new Array(); //ALMACENO TODAS LAS OPCIONES
        if (estadosVistos.length == Math.floor(estadosJson.length / 1.5)) { // JUEGO TERMINA CUANDO SE HAGAN (ARRAY/1.5) PREGUNTAS
            terminoJuego();
            return;
        }
        newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.classList.add('d-none');
        numOpciones === null || numOpciones === void 0 ? void 0 : numOpciones.classList.add('d-none');
        estadoCorrectoPlaceholder === null || estadoCorrectoPlaceholder === void 0 ? void 0 : estadoCorrectoPlaceholder.classList.add('d-none');
        scorePlaceholder.innerText = score.toString();
        const OPCIONES = parseInt(numOpciones === null || numOpciones === void 0 ? void 0 : numOpciones.value); // CANTIDAD DE OPCIONES A MOSTRAR
        while (preguntas.length < OPCIONES) {
            preguntas.push(randomArray(estadosJson));
            preguntas = [...new Set(preguntas)];
        }
        preguntas.forEach(cap => {
            capitales.push(cap.capital);
        });
        const real = Math.floor(Math.random() * preguntas.length);
        const estadoCorrecto = preguntas[real]; // SELECCIONO POR RANDOM LA RESPUESTA CORRECTA
        nombreEstado.innerText = estadoCorrecto.estado;
        if (estadosVistos.indexOf(estadoCorrecto.estado) != -1) { //SI YA VI UN ESTADO, BUSCO OTRO
            preparaCapitales();
            return;
        }
        estadosVistos.push(estadoCorrecto.estado); // SI NO HE VISTO EL ESTADO, AGREGO SU NOMBRE AL ARRAY
        const aleatorio = arrayAleatorio(preguntas); // LOS QUE QUEDAN, LOS SHUFFLEO
        botonera.innerHTML = '';
        aleatorio.forEach(opcion => {
            creaBoton(opcion.capital, preguntas[real].capital); // DIBUJO LOS BOTONES DE CADA CAPITAL
        });
    });
}
function arrayAleatorio(array) {
    return array.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}
function creaBoton(capital, capitalCorrecta) {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn-primary');
    btn.innerText = capital;
    btn.addEventListener('click', (e) => {
        var _a;
        if (((_a = e.target) === null || _a === void 0 ? void 0 : _a.innerText) == capitalCorrecta) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            scoreChange(1);
        }
        else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-danger');
            corregirEstado(capitalCorrecta);
            scoreChange(-1);
        }
    });
    botonera.append(btn);
}
function lockButtons() {
    const botones = [...Array.from(document.querySelectorAll('.btn'))];
    botones.forEach(e => {
        e.disabled = true;
    });
}
function scoreChange(s) {
    return __awaiter(this, void 0, void 0, function* () {
        lockButtons();
        score = s + score;
        // await setTimeout(()=>{
        yield pause(100);
        scorePlaceholder.innerText = score.toString();
        // },100)
        if (score < 0) {
            score = 0;
            alert('PERDISTE, INTENTA NUEVAMENTE');
            newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.classList.remove('d-none');
            numOpciones.classList.remove('d-none');
            return;
        }
        // await setTimeout(()=>{
        yield pause(1500);
        preparaCapitales();
        // },1500)
    });
}
function corregirEstado(nombre) {
    return __awaiter(this, void 0, void 0, function* () {
        estadoCorrectoName.innerText = nombre;
        estadoCorrectoPlaceholder.classList.remove('d-none');
        estadoCorrectoPlaceholder.scrollIntoView();
    });
}
function terminoJuego() {
    alert('Juego finalizado, tu puntuación fué de ' + score);
    newGameBtn.classList.remove('d-none');
    numOpciones.classList.remove('d-none');
    score = 0;
    estadosVistos = new Array();
}
function pause(time) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise(r => { setTimeout(r, time); });
    });
}
// export {}
