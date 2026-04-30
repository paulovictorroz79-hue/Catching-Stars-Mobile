let score = 0;
let level = 1;
let checkpoint = 1;
let time = 14;
let timer;

// ELEMENTOS
const box = document.getElementById("box");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const goalEl = document.getElementById("goal");
const area = document.getElementById("game-area");
const trap1 = document.createElement("div");
const trap2 = document.createElement("div");
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
const menu = document.getElementById("menu");
const menuMusic = document.getElementById("menuMusic");

// ==================== DADOS ====================

// record
let record = localStorage.getItem("record")
    ? parseInt(localStorage.getItem("record"))
    : 1;

recordEl.textContent = record;

// botão reset
resetRecordBtn.onclick = resetRecord;

// =================== Lua =====================
trap1.classList.add("trap");
trap2.classList.add("trap");

area.appendChild(trap1);
area.appendChild(trap2);

// ==================== ÁUDIO ====================

clickSound.volume = 0.6;
bgMusic.volume = 0.3;
vitoria.volume = 1.0;
gameouver.volume = 0.9;
menuMusic.volume = 0.3;

// ==================== NÍVEIS ====================

const levels = [
    { time: 14, size: 50, goal: 1 },// level 1
    { time: 12, size: 40, goal: 1 },// level 2
    { time: 9, size: 30, goal: 1 },// level 3
    { time: 5, size: 20, goal: 1 },// level 4
    { time: 6, size: 20, goal: 1 },// level 5
    { time: 6, size: 20, goal: 1 },// level 6
    { time: 6, size: 20, goal: 1 },// level 7
    { time: 6, size: 20, goal: 1 },// level 8
    { time: 6, size: 20, goal: 1 },// level 9
    { time: 6, size: 20, goal: 1 },// level 10
];

// ==================== MENU ====================

function continuarJogo() {
    menuMusic.pause();
    menuMusic.currentTime = 0;

    let checkpointSalvo = localStorage.getItem("checkpoint");

    if (checkpointSalvo) {
        checkpoint = parseInt(checkpointSalvo);
        level = checkpoint;
    }

    menu.style.display = "none";
    startGame();
}

function novoJogo() {
    menuMusic.pause();
    menuMusic.currentTime = 0;

    localStorage.removeItem("checkpoint");

    checkpoint = 1;
    level = 1;
    score = 0;
    scoreEl.textContent = score;

    menu.style.display = "none";
    startGame();
}

// ==================== TELAS ====================

function resetRecord() {
    if (confirm("Tem certeza que quer resetar o recorde?")) {
        localStorage.removeItem("record");
        record = 1;
        recordEl.textContent = record;
    }
}

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
    gameouver.currentTime = 0;
    gameouver.play();

    clearInterval(timer);
    box.style.display = "none";
    restartBtn.style.display = "inline-block";

    title.textContent = "💀 GAME OVER";
    text.textContent = "Você não atingiu a meta.";
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
}

function restartGame() {
    clearInterval(timer);

    overlay.classList.add("hidden");
    overlay.style.display = "none";

    level = checkpoint;
    score = 0;
    scoreEl.textContent = score;

    startGame();
}

function proxlevel() {
    restartBtn.style.display = "none";

    title.textContent = "⭐ NÍVEL " + level;
    text.textContent = "Prepare-se!";

    overlay.classList.remove("hidden");
    overlay.style.display = "flex";

    // 🔥 ADICIONA ANIMAÇÃO
    title.classList.add("level-animation");

    setTimeout(() => {
        title.classList.remove("level-animation");
    }, 600);

    setTimeout(() => {
        overlay.classList.add("hidden");
        overlay.style.display = "none";
        startGame();
    }, 2000);
}

// ==================== JOGO ====================

function applyLevel() {
    const current = levels[level - 1];
    time = current.time;

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

function randomTrap(trap) {
    const maxX = area.clientWidth - box.clientWidth;
    const maxY = area.clientHeight - box.clientHeight;

    trap.style.left = Math.random() * maxX + "px";
    trap.style.top = Math.random() * maxY + "px";
}

// CLIQUE
box.onclick = () => {
    score++;
    scoreEl.textContent = score;

    clickSound.currentTime = 0;
    clickSound.play();

    box.classList.add("explode");

    setTimeout(() => {
        box.classList.remove("explode");
        randomPosition();
        if (level >= 6) {
         randomTrap(trap1);
         
            if (level >= 7) {
         randomTrap(trap1);
         randomTrap(trap2);}
}
    }, 100);

    

    const needed = levels[level - 1].goal;

    if (score >= needed) {
        clearInterval(timer);
        box.style.display = "none";

        // record
        if (level > record) {
            record = level;
            localStorage.setItem("record", record);
            recordEl.textContent = record;
        }

        // próximo nível
        if (level < levels.length) {
            level++;

            // checkpoint
            if (level === 6) {
                checkpoint = 6;
                localStorage.setItem("checkpoint", checkpoint);
                console.log("Checkpoint salvo:", checkpoint);
            }

            // reset score
            score = 0;
            scoreEl.textContent = score;

            proxlevel();
        } else {
            showVictory();
        }
    }
};
trap1.onclick = () => {
    
    clearInterval(timer);
    showGameOver();
};

trap2.onclick = () => {
    
    clearInterval(timer);
    showGameOver();
};


// ==================== START ====================

function startGame() {
    bgMusic.currentTime = 0;
    bgMusic.play();

    clearInterval(timer);

    overlay.classList.add("hidden");
    overlay.style.display = "none";

    applyLevel();

    box.style.display = "block";
    randomPosition();
       if (level >= 6) {
         trap1.style.display = "block";
         

         randomTrap(trap1);
         

          if (level >= 7) {
         trap1.style.display = "block";
         trap2.style.display = "block";

         randomTrap(trap1);
         randomTrap(trap2);}
     } else {
         trap1.style.display = "none";
         trap2.style.display = "none";
      }
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

// autoplay liberado com clique
document.addEventListener("click", () => {
    if (menuMusic.paused) {
        menuMusic.play();
    }
}, { once: true });