const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 40;
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
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

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
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        alert("Game Over!");
        document.location.reload();
    }

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
            ctx.fillStyle = "#0f0";
            ctx.fillRect(part.x, part.y, gridSize, gridSize);
        }
    });

    // disegna cibo con immagine
    ctx.drawImage(foodImg, food.x, food.y, gridSize, gridSize);

}

gameLoop();
