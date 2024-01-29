// NO FUNCIONA EN FIREFOX, EN CHROME SI
// import estadosJson from './estados.json' assert { type: 'json' }
const nombreEstado = document.querySelector('#nombreEstado')
const botonera = document.querySelector('.botones')
const scorePlaceholder = document.querySelector('#score')
const newGameBtn = document.querySelector('#newGameBtn')
const estadoCorrectoPlaceholder = document.querySelector('#estadoCorrectoPlaceholder')
const estadoCorrectoName = document.querySelector('#estadoCorrecto')
let estadosVistos = new Array()
let estadosJson
let score = 0

fetch('./estados.json').then(res=>res.json()).then(data=>{estadosJson = data ; preparaCapitales()})

Array.prototype.aleatorio = function(){
    return this[Math.floor((Math.random()*this.length))]
}
async function preparaCapitales(){
    let capitales = new Array() //ALMACENO NOMBRES DE CAPITALES
    let preguntas = new Array() //ALMACENO TODAS LAS OPCIONES

    if(estadosVistos.length == Math.floor(estadosJson.length/2)){ // JUEGO TERMINA CUANDO SE HAGAN (ARRAY/2) PREGUNTAS
        terminoJuego()
        return
    }
    
    newGameBtn.classList.add('d-none')
    estadoCorrectoPlaceholder.classList.add('d-none')
    scorePlaceholder.innerText = score
    const OPCIONES = 4 // CANTIDAD DE OPCIONES A MOSTRAR

    while (preguntas.length < OPCIONES){
        preguntas.push(estadosJson.aleatorio())
        preguntas = [...new Set(preguntas)]
    }

    preguntas.forEach(cap=>{
        capitales.push(cap.capital)
    })

    const real = Math.floor(Math.random()*preguntas.length)

    const estadoCorrecto = preguntas[real]
    nombreEstado.innerText = estadoCorrecto.estado

    if (estadosVistos.indexOf(estadoCorrecto.estado) != -1){ //SI YA VI UN ESTADO, BUSCO OTRO
        preparaCapitales()
        return;
    }
    estadosVistos.push(estadoCorrecto.estado) // SI NO HE VISTO EL ESTADO, AGREGO SU NOMBRE AL ARRAY

    const aleatorio =  arrayAleatorio(preguntas) // LOS QUE QUEDAN, LOS SHUFFLEO

    botonera.innerHTML=''
    aleatorio.forEach(opcion=>{
        creaBoton(opcion.capital,preguntas[real].capital) // DIBUJO LOS BOTONES DE CADA CAPITAL
    })
}

function arrayAleatorio(array){
    return array.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
}

function creaBoton(capital,capitalCorrecta){
    const btn = document.createElement('button')
    btn.classList.add('btn')
    btn.classList.add('btn-primary')
    btn.innerText = capital

    btn.addEventListener('click',(e)=>{
        if(e.target.innerText == capitalCorrecta){
            btn.classList.remove('btn-primary')
            btn.classList.add('btn-success')
            scoreChange(1)
        } else {
            btn.classList.remove('btn-primary')
            btn.classList.add('btn-danger')
            corregirEstado(capitalCorrecta)
            scoreChange(-1)
        }
    })
    botonera.append(btn)
}

function lockButtons(){
    const botones = document.querySelectorAll('.btn')
    botones.forEach((e)=>{
        e.disabled=true
    })
}

async function scoreChange(s){
    lockButtons()
    score = s + score
    await setTimeout(()=>{
        scorePlaceholder.innerText = score
    },100)

    if (score < 0){
        score=0
        alert('PERDISTE, INTENTA NUEVAMENTE')
        newGameBtn.classList.remove('d-none')
        return
    }
    await setTimeout(()=>{
        preparaCapitales()
    },1500)
}

async function corregirEstado(nombre){
    estadoCorrectoName.innerText = nombre
    estadoCorrectoPlaceholder.classList.remove('d-none')
    estadoCorrectoPlaceholder.scrollIntoView()
}

function terminoJuego(){
    alert('Juego finalizado, tu puntuación fué de ' + score)
    newGameBtn.classList.remove('d-none')
    score=0
    estadosVistos = new Array()
}
