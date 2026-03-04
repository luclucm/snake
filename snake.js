let gameStarted = false;
let wrapMode = false; // false = muri letali, true = wrap-around
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;

let score = 0;
let vel = 180;

// Caricamento immagini
const foodImg = new Image();
foodImg.src = "food.png"
const headImg = new Image();
headImg.src = "head.png"

let food = randomFood();


const GRID_PERCENT = 0.04;

function resizeCanvas() {
    const paddingX = 40;   // margine orizzontale
    const paddingTop = 150; // spazio per titolo + punteggio + menu
    const paddingBottom = 20;

    // Larghezza disponibile
    const availW = Math.max(200, window.innerWidth - paddingX);

    // Altezza disponibile sotto le scritte
    const availH = Math.max(200, window.innerHeight - paddingTop - paddingBottom);

    // GRID_SIZE dinamico percentuale
    const base = Math.min(availW, availH);
    const newGrid = Math.max(20, Math.floor(base * GRID_PERCENT));
    gridSize = newGrid;

    const cols = Math.floor(availW / gridSize);
    const rows = Math.floor(availH / gridSize);

    canvas.width = Math.max(cols, 10) * gridSize;
    canvas.height = Math.max(rows, 10) * gridSize;

    // Aggiorna dx/dy
    if (dx !== 0) dx = Math.sign(dx) * gridSize;
    if (dy !== 0) dy = Math.sign(dy) * gridSize;

    // Riallinea serpente
    snake = snake.map(seg => ({
        x: Math.min(Math.max(0, Math.floor(seg.x / gridSize) * gridSize), canvas.width - gridSize),
        y: Math.min(Math.max(0, Math.floor(seg.y / gridSize) * gridSize), canvas.height - gridSize),
    }));

    // riallinea food
    const foodAligned = (food.x % gridSize === 0) && (food.y % gridSize === 0);
    const foodInside = (food.x < canvas.width) && (food.y < canvas.height);
    if (!foodAligned || !foodInside) {
        food = randomFood();
    }
}


resizeCanvas();
window.addEventListener("resize", () => {
    const wasRunning = gameStarted; // salva se stava giocando
    gameStarted = false;            // blocca il movimento
    resizeCanvas();                 // ridimensiona correttamente
    if (wasRunning) gameStarted = true; // riprende se serviva
});

function randomFood() {
    let newPos;
    do {
        newPos = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    } while (snake.some(segment =>
        segment.x === newPos.x && segment.y === newPos.y
    ));

    return newPos;
}

document.getElementById("wallsBtn").onclick = () => {
    wrapMode = false;
    document.getElementById("startMenu").style.display = "none";
    gameStarted = true;  // <-- Avvia gioco
};

document.getElementById("wrapBtn").onclick = () => {
    wrapMode = true;
    document.getElementById("startMenu").style.display = "none";
    gameStarted = true;  // <-- Avvia gioco
};

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0; dy = -gridSize;
    }
    if (e.key === "ArrowDown" && dy === 0) {
        dx = 0; dy = gridSize;
    }
    if (e.key === "ArrowLeft" && dx === 0) {
        dx = -gridSize; dy = 0;
    }
    if (e.key === "ArrowRight" && dx === 0) {
        dx = gridSize; dy = 0;
    }
}

function gameLoop() {
    if (gameStarted) {
    update();
    draw();
    }
    setTimeout(gameLoop, vel);
}

function update() {
    if (!gameStarted) return;
    
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // collisione con muri
    // Movimento base normale
    let nx = snake[0].x + dx;
    let ny = snake[0].y + dy;
    
    // Modalità wrap-around
    if (wrapMode) {
        if (nx < 0) nx = canvas.width - gridSize;
        if (nx >= canvas.width) nx = 0;
        if (ny < 0) ny = canvas.height - gridSize;
        if (ny >= canvas.height) ny = 0;
    } else {
        // Modalità muri letali
        if (nx < 0 || nx >= canvas.width || ny < 0 || ny >= canvas.height) {
            alert("Game Over!");
            document.location.reload();
            return;
        }
    }
    
    const new_head = { x: nx, y: ny };

    snake.unshift(new_head);

    // mangia il cibo
    if (new_head.x === food.x && new_head.y === food.y) {
        score++;
        if (vel>20) {
            vel=vel-5;
        }
        document.getElementById("score").textContent=score;
        food = randomFood();
    } else {
        snake.pop();
    }

    // collisione con se stesso
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === new_head.x && snake[i].y === new_head.y) {
            alert("Game Over!");
            document.location.reload();
        }
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    // disegna serpente (testa con immagine)
    snake.forEach((part, index) => {
        if (index === 0) {
            const HEAD_SCALE = 6; // ingrandisci come vuoi!
            const size = gridSize * HEAD_SCALE;
            ctx.drawImage(
                headImg,
                part.x - (size - gridSize) / 2,
                part.y - (size - gridSize) / 2,
                size,
                size
            );
        } else {
            // Corpo: bianco con bordo nero
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
            
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 3;
            ctx.strokeRect(part.x, part.y, gridSize, gridSize);
        }
    });

    // disegna cibo con immagine
    ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);

}

gameLoop();
