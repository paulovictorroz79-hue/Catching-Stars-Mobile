let score = 0;
let level = 1;
let time = 10;
let timer;

// ELEMENTOS
const box = document.getElementById("box");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const goalEl = document.getElementById("goal");
const area = document.getElementById("game-area");
const clickSound = document.getElementById("clickSound");

const overlay = document.getElementById("overlay");
const title = document.getElementById("message-title");
const text = document.getElementById("message-text");
const bgMusic = document.getElementById("bgMusic");
const vitoria = document.getElementById("vitoria");
const restartBtn = document.getElementById("restartBtn");
const recordEl = document.getElementById("record");
const resetRecordBtn = document.getElementById("resetRecord");
const gameouver = document.getElementById("gameouver");


// pega recorde salvo ou começa em 1
let record = localStorage.getItem("record")
    ? parseInt(localStorage.getItem("record"))
    : 1;

recordEl.textContent = record;




// SOM
clickSound.volume = 0.6; // estrela
bgMusic.volume = 0.3; // jogo
vitoria.volume = 1.0;// vitoria
gameouver.volume = 0.9;// game ouver
// NÍVEIS
const levels = [
    { time: 12, size: 50, goal: 16 },
    { time: 10, size: 40, goal: 13 },
    { time: 8, size: 30, goal: 9 },
    { time: 5, size: 20, goal: 7 },
    { time: 2, size: 10, goal: 1 },
];

// ==================== TELAS ====================

function showVictory() {
    bgMusic.pause();

    vitoria.currentTime = 0;
vitoria.play();

    clearInterval(timer);
    box.style.display = "none";
restartBtn.style.display = "inline-block";

    title.textContent = "🏆 VITÓRIA!";
    text.textContent = "Você completou todos os níveis!";
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
}

function showGameOver() {
    bgMusic.pause();
    restartBtn.style.display = "inline-block";

    gameouver.currentTime = 0;
    gameouver.play();
    clearInterval(timer);
    box.style.display = "none";

    title.textContent = "💀 GAME OVER";
    text.textContent = "Você não atingiu a meta.";
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
}

function restartGame() {
    clearInterval(timer);

    overlay.classList.add("hidden");
    overlay.style.display = "none";

    level = 1;
    score = 0;
    scoreEl.textContent = score;

    startGame();
}
function proxlevel() {
    // ESCONDE o botão nesta tela
    restartBtn.style.display = "none";

    title.textContent = "⭐ NÍVEL " + level;
    text.textContent = "Prepare-se!";
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";

    setTimeout(() => {
        overlay.classList.add("hidden");
        overlay.style.display = "none";
        startGame();
    }, 2000);
}
resetRecordBtn.onclick = () => {
    if (confirm("Tem certeza que deseja resetar o recorde?")) {
        localStorage.removeItem("record");
        record = 1;
        recordEl.textContent = record;
    }
};


// ==================== JOGO ====================
function applyLevel() {
    const current = levels[level - 1];
    time = current.time;

    // REINICIA PONTOS A CADA NÍVEL
    score = 0;
    scoreEl.textContent = score;

    box.style.width = current.size + "px";
    box.style.height = current.size + "px";

    timeEl.textContent = time;
    goalEl.textContent = current.goal;
    levelEl.textContent = level;
}

function randomPosition() {
    const maxX = area.clientWidth - box.clientWidth;
    const maxY = area.clientHeight - box.clientHeight;

    box.style.left = Math.random() * maxX + "px";
    box.style.top = Math.random() * maxY + "px";
}

// CLIQUE NA ESTRELA
box.onclick = () => {
    score++;
    scoreEl.textContent = score;

    clickSound.currentTime = 0;
    clickSound.play();

    box.classList.add("explode");

    setTimeout(() => {
        box.classList.remove("explode");
        randomPosition();
    }, 100);

    // 👉 VERIFICA SE ATINGIU A META
    const needed = levels[level - 1].goal;

    if (score >= needed) {
        clearInterval(timer);
        box.style.display = "none";

        // 🏆 SALVA RECORDE (MAIOR NÍVEL ALCANÇADO)
        if (level > record) {
            record = level;
            localStorage.setItem("record", record);
            recordEl.textContent = record;
        }

        // 👉 PRÓXIMA FASE OU VITÓRIA
        if (level < levels.length) {
            level++;
            proxlevel();
        } else {
            showVictory();
        }
    }
};



// INICIAR JOGO
function startGame() {
    bgMusic.currentTime = 0;
    bgMusic.play();

    clearInterval(timer);

    overlay.classList.add("hidden");
    overlay.style.display = "none";

    applyLevel();

    box.style.display = "block";
    randomPosition();

    timer = setInterval(() => {
        time--;
        timeEl.textContent = time;

        if (time === 0) {
            clearInterval(timer);
            box.style.display = "none";

            const needed = levels[level - 1].goal;

            if (score >= needed) {
                if (level < levels.length) {
                    level++;
                    proxlevel();
                } else {
                    showVictory();
                }
            } else {
                showGameOver();
            }
        }
    }, 1000);
}
