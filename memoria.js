// =========================
// ELEMENTOS
// =========================

const menuInicial = document.getElementById("menuInicial");
const gameSection = document.getElementById("gameSection");
const gameBoard = document.getElementById("gameBoard");

const startBtn = document.getElementById("startGame");
const playerInput = document.getElementById("playerName");

const playerDisplay = document.getElementById("playerDisplay");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const pairsDisplay = document.getElementById("pairs");

const victoryModal = document.getElementById("victoryModal");
const winnerName = document.getElementById("winnerName");
const winnerTime = document.getElementById("winnerTime");
const winnerMoves = document.getElementById("winnerMoves");

const playAgainBtn = document.getElementById("playAgain");

// =========================
// PERSONAGENS
// =========================

const personagens = [

    "assets/hellokitty.png",
    "assets/mymelody.png",
    "assets/littletwinstars.png",
    "assets/gudetama.png",
    "assets/kuromi.png",
    "assets/cinnamoroll.png",
    "assets/aggretsuko.png",
    "assets/pochacco.png",
    "assets/keroppi.png",
    "assets/badtzmaru.png"

];

// =========================
// VARIÁVEIS
// =========================

let dificuldade = "easy";

let cartas = [];

let primeiraCarta = null;
let segundaCarta = null;

let bloqueado = false;

let movimentos = 0;
let paresEncontrados = 0;
let totalPares = 0;

let segundos = 0;
let timer;

// =========================
// INICIAR
// =========================

startBtn.addEventListener("click", iniciarJogo);

playAgainBtn.addEventListener("click", () => {

    victoryModal.classList.add("hidden");

    menuInicial.classList.remove("hidden");

    gameSection.classList.add("hidden");

});

// =========================
// INICIAR PARTIDA
// =========================

function iniciarJogo(){

    dificuldade =
        document.querySelector(
            "input[name='difficulty']:checked"
        ).value;

    const nome =
        playerInput.value.trim() || "Jogador";

    playerDisplay.textContent = nome;

    movimentos = 0;
    paresEncontrados = 0;
    segundos = 0;

    movesDisplay.textContent = "0";
    timerDisplay.textContent = "00:00";

    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;

    clearInterval(timer);

    if(dificuldade === "easy"){

        totalPares = 6;

        gameBoard.className = "easy";

    }else{

        totalPares = 10;

        gameBoard.className = "hard";

    }

    pairsDisplay.textContent =
        `0 / ${totalPares}`;

    criarCartas();

    menuInicial.classList.add("hidden");

    gameSection.classList.remove("hidden");

    iniciarCronometro();

}

// =========================
// CRIAR TABULEIRO
// =========================

function criarCartas(){

    gameBoard.innerHTML = "";

    let selecionadas =
        personagens.slice(0,totalPares);

    cartas =
        [...selecionadas, ...selecionadas];

    embaralhar(cartas);

    cartas.forEach((imagem)=>{

        const carta =
            document.createElement("div");

        carta.className = "card";

        carta.dataset.image = imagem;

        carta.innerHTML = `

            <div class="card-face card-front">

                <img src="${imagem}">

            </div>

            <div class="card-face card-back"></div>

        `;

        gameBoard.appendChild(carta);
        carta.addEventListener("click", virarCarta);

    });

}

// =========================
// EMBARALHAR
// =========================

function embaralhar(array){

    for(let i = array.length - 1; i > 0; i--){

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i],array[j]] =
        [array[j],array[i]];

    }

}

// =========================
// CRONÔMETRO
// =========================

function iniciarCronometro(){

    timer = setInterval(()=>{

        segundos++;

        const min =
            String(Math.floor(segundos/60))
            .padStart(2,"0");

        const seg =
            String(segundos%60)
            .padStart(2,"0");

        timerDisplay.textContent =
            `${min}:${seg}`;

    },1000);

}

// =========================
// VIRAR CARTA
// =========================

function virarCarta(){

    if(bloqueado) return;

    if(this === primeiraCarta) return;

    if(this.classList.contains("matched")) return;

    this.classList.add("flip");

    if(primeiraCarta === null){

        primeiraCarta = this;

        return;

    }

    segundaCarta = this;

    movimentos++;

    movesDisplay.textContent = movimentos;

    verificarPar();

}

// =========================
// VERIFICAR PAR
// =========================

function verificarPar(){

    const img1 =
        primeiraCarta.dataset.image;

    const img2 =
        segundaCarta.dataset.image;

    if(img1 === img2){

        acertouPar();

    }else{

        errouPar();

    }

}

// =========================
// ACERTOU
// =========================

function acertouPar(){

    primeiraCarta.classList.add("matched");
    segundaCarta.classList.add("matched");

    paresEncontrados++;

    pairsDisplay.textContent =
        `${paresEncontrados} / ${totalPares}`;

    resetarJogada();

    if(paresEncontrados === totalPares){

        setTimeout(()=>{

            venceuJogo();

        },600);

    }

}

// =========================
// ERROU
// =========================

function errouPar(){

    bloqueado = true;

    setTimeout(()=>{

        primeiraCarta.classList.remove("flip");
        segundaCarta.classList.remove("flip");

        resetarJogada();

    },900);

}

// =========================
// RESETAR
// =========================

function resetarJogada(){

    primeiraCarta = null;
    segundaCarta = null;

    bloqueado = false;

}

// =========================
// VITÓRIA
// =========================

function venceuJogo(){

    clearInterval(timer);

    const nome =
        playerDisplay.textContent;

    winnerName.textContent = nome;
    winnerTime.textContent = timerDisplay.textContent;
    winnerMoves.textContent = movimentos;

    salvarRecorde();

    victoryModal.classList.remove("hidden");

}

// =========================
// RECORDES
// =========================

function salvarRecorde(){

    const chave =
        dificuldade === "easy"
        ? "memoriaEasy"
        : "memoriaHard";

    const recordes =
        JSON.parse(localStorage.getItem(chave))
        || [];

    recordes.push({

        nome: playerDisplay.textContent,

        tempo: segundos,

        movimentos: movimentos

    });

    recordes.sort((a,b)=>{

        if(a.tempo !== b.tempo){

            return a.tempo - b.tempo;

        }

        return a.movimentos - b.movimentos;

    });

    localStorage.setItem(

        chave,

        JSON.stringify(
            recordes.slice(0,10)
        )

    );

}

// =========================
// NOVA PARTIDA
// =========================

playAgainBtn.addEventListener("click", ()=>{

    clearInterval(timer);

    victoryModal.classList.add("hidden");

    menuInicial.classList.remove("hidden");

    gameSection.classList.add("hidden");

    playerInput.focus();

});