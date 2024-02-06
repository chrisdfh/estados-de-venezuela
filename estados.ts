// NO FUNCIONA EN FIREFOX, EN CHROME SI
// import estadosJson from './estados.json' assert { type: 'json' }
const nombreEstado:HTMLElement = document.querySelector('#nombreEstado')!
const botonera:HTMLElement = document.querySelector('.botones')!
const scorePlaceholder:HTMLElement = document.querySelector('#score')!
const newGameBtn:HTMLButtonElement = document.querySelector('#newGameBtn')!
const estadoCorrectoPlaceholder:HTMLElement = document.querySelector('#estadoCorrectoPlaceholder')!
const estadoCorrectoName:HTMLElement = document.querySelector('#estadoCorrecto')!
const numOpciones:HTMLSelectElement = document.querySelector('#cant-opciones')!

let estadosVistos:string[] = new Array()
let estadosJson:Estados[] = []
let score = 0

class Estados {
    estado:string;
    capital:string;

    constructor(
        estado:string,
        capital:string
    ){
        this.estado = estado
        this.capital = capital
    }
}

fetch('./estados.json')
    .then(
        res=>res.json()
    ).then(
        data=>{
            estadosJson = [...Array.from(data)] as Estados[];
        }
    )

// Array.prototype.aleatorio = function(){
//     return this[Math.floor((Math.random()*this.length))]
// }

function randomArray(array:Array<Estados>):Estados{  
    return array[Math.floor((Math.random()*array.length))]
}

async function preparaCapitales():Promise<void>{
    let capitales = new Array() //ALMACENO NOMBRES DE CAPITALES
    let preguntas:Estados[] = new Array() //ALMACENO TODAS LAS OPCIONES

    if(estadosVistos.length == Math.floor(estadosJson.length/1.5)){ // JUEGO TERMINA CUANDO SE HAGAN (ARRAY/1.5) PREGUNTAS
        terminoJuego()
        return
    }
    
    newGameBtn?.classList.add('d-none')
    numOpciones?.classList.add('d-none')
    estadoCorrectoPlaceholder?.classList.add('d-none')
    scorePlaceholder.innerText = score.toString()
    const OPCIONES = parseInt(numOpciones?.value) // CANTIDAD DE OPCIONES A MOSTRAR

    while (preguntas.length < OPCIONES){
        preguntas.push(randomArray(estadosJson))
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

    const aleatorio:Estados[] =  arrayAleatorio(preguntas) // LOS QUE QUEDAN, LOS SHUFFLEO

    botonera.innerHTML=''
    aleatorio.forEach(opcion=>{
        creaBoton(opcion.capital,preguntas[real].capital) // DIBUJO LOS BOTONES DE CADA CAPITAL
    })
}

function arrayAleatorio(array:Array<Estados>):Array<Estados>{
    return array.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
}

function creaBoton(capital:string,capitalCorrecta:string):void{
    const btn = document.createElement('button')
    btn.classList.add('btn')
    btn.classList.add('btn-primary')
    btn.innerText = capital

    btn.addEventListener('click',(e:any)=>{
        if(e.target?.innerText == capitalCorrecta){
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

function lockButtons():void{
    const botones = [...Array.from(document.querySelectorAll('.btn'))] as HTMLButtonElement[]
    botones.forEach(e=>{
        e.disabled=true
    })
}

async function scoreChange(s:number):Promise<void>{
    lockButtons()
    score = s + score
    // await setTimeout(()=>{
    await pause(100)
    scorePlaceholder.innerText = score.toString()
    // },100)

    if (score < 0){
        score=0
        alert('PERDISTE, INTENTA NUEVAMENTE')
        newGameBtn?.classList.remove('d-none')
        numOpciones.classList.remove('d-none')
        return
    }
    // await setTimeout(()=>{
    await pause(1500)
    preparaCapitales()
    // },1500)
}

async function corregirEstado(nombre:string):Promise<void>{
    estadoCorrectoName.innerText = nombre
    estadoCorrectoPlaceholder.classList.remove('d-none')
    estadoCorrectoPlaceholder.scrollIntoView()
}

function terminoJuego():void{
    alert('Juego finalizado, tu puntuación fué de ' + score)
    newGameBtn.classList.remove('d-none')
    numOpciones.classList.remove('d-none')
    score=0
    estadosVistos = new Array()
}


async function pause(time:number):Promise<void> {
    await new Promise(r=>{setTimeout(r,time)})
}