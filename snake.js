let gameStarted = false;
let wrapMode = false; // false = muri letali, true = wrap-around
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;

let score = 0;
let vel = 150;

// Caricamento immagini
const foodImg = new Image();
foodImg.src = "food.png"
const headImg = new Image();
headImg.src = "head.png"

let food = randomFood();


const GRID_PERCENT = 0.04;

function resizeCanvas() {
    const paddingX = 40;   // margine orizzontale
    const paddingB = 20;   // margine inferiore

    // Larghezza disponibile
    const availW = Math.max(200, window.innerWidth - paddingX);

    // Altezza disponibile *sotto le scritte*:
    // prendiamo la posizione del canvas nella pagina e sottraiamo altezze
    const canvasTop = canvas.getBoundingClientRect().top + window.scrollY;
    const availH = Math.max(200, window.innerHeight - canvasTop - paddingB);

    // Calcolo gridSize in funzione della dimensione disponibile
    const base = Math.min(availW, availH);                 // dimensione di riferimento
    const newGrid = Math.max(10, Math.floor(base * GRID_PERCENT)); // cella in px (min 10px)

    // Aggiorno gridSize dinamico
    gridSize = newGrid;

    // Numero di celle intere che entrano
    const cols = Math.floor(availW / gridSize);
    const rows = Math.floor(availH / gridSize);

    // Imposto le dimensioni effettive del canvas come multipli della griglia
    canvas.width  = Math.max(cols, 10) * gridSize;
    canvas.height = Math.max(rows, 10) * gridSize;

    // Riallineo dx/dy alla nuova griglia mantenendo la direzione
    if (dx !== 0) dx = Math.sign(dx) * gridSize;
    if (dy !== 0) dy = Math.sign(dy) * gridSize;

    // Allineo le coordinate del serpente alla nuova griglia (snap alla cella)
    snake = snake.map(seg => ({
        x: Math.min(Math.max(0, Math.floor(seg.x / gridSize) * gridSize), canvas.width  - gridSize),
        y: Math.min(Math.max(0, Math.floor(seg.y / gridSize) * gridSize), canvas.height - gridSize),
    }));

    // Se il cibo è fuori o non è allineato, rigeneralo
    const foodAligned = (food.x % gridSize === 0) && (food.y % gridSize === 0);
    const foodInside  = (food.x < canvas.width) && (food.y < canvas.height);
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
            ctx.drawImage(headImg, part.x, part.y, gridSize, gridSize);
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
