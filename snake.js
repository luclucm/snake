let wrapMode = false; // false = muri letali, true = wrap-around
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
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
};

document.getElementById("wrapBtn").onclick = () => {
    wrapMode = true;
    document.getElementById("startMenu").style.display = "none";
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
    update();
    draw();
    setTimeout(gameLoop, vel);
}

function update() {
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

    snake.unshift(head);

    // mangia il cibo
    if (head.x === food.x && head.y === food.y) {
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
        if (snake[i].x === head.x && snake[i].y === head.y) {
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
            
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.strokeRect(part.x, part.y, gridSize, gridSize);
        }
    });

    // disegna cibo con immagine
    ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);

}

gameLoop();
