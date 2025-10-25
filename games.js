const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 14;
const paddleMargin = 18;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Paddle objects
let playerY = canvasHeight / 2 - paddleHeight / 2;
let aiY = canvasHeight / 2 - paddleHeight / 2;

// Ball object
let ball = {
    x: canvasWidth / 2 - ballSize / 2,
    y: canvasHeight / 2 - ballSize / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

// Listen for mouse movement
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvasHeight - paddleHeight) playerY = canvasHeight - paddleHeight;
});

// Draw paddles
function drawPaddle(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall(x, y) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, ballSize, ballSize);
}

// Basic AI: follow the ball with some smoothing
function updateAI() {
    let center = aiY + paddleHeight / 2;
    if (center < ball.y + ballSize / 2) aiY += 3;
    else if (center > ball.y + ballSize / 2) aiY -= 3;
    // Clamp position
    if (aiY < 0) aiY = 0;
    if (aiY > canvasHeight - paddleHeight) aiY = canvasHeight - paddleHeight;
}

// Ball movement and collision
function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom walls
    if (ball.y <= 0 || ball.y + ballSize >= canvasHeight) {
        ball.vy *= -1;
        ball.y = Math.max(0, Math.min(ball.y, canvasHeight - ballSize));
    }

    // Left paddle collision
    if (
        ball.x <= paddleMargin + paddleWidth &&
        ball.y + ballSize > playerY &&
        ball.y < playerY + paddleHeight
    ) {
        ball.vx *= -1;
        ball.x = paddleMargin + paddleWidth;
        // Add some "spin" based on where it hits the paddle
        let impact = ((ball.y + ballSize / 2) - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += impact * 2;
    }

    // Right paddle collision
    if (
        ball.x + ballSize >= canvasWidth - paddleMargin - paddleWidth &&
        ball.y + ballSize > aiY &&
        ball.y < aiY + paddleHeight
    ) {
        ball.vx *= -1;
        ball.x = canvasWidth - paddleMargin - paddleWidth - ballSize;
        let impact = ((ball.y + ballSize / 2) - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy += impact * 2;
    }

    // Reset if ball goes out left/right
    if (ball.x < 0 || ball.x + ballSize > canvasWidth) {
        ball.x = canvasWidth / 2 - ballSize / 2;
        ball.y = canvasHeight / 2 - ballSize / 2;
        ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
        ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Main loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update
    updateAI();
    updateBall();

    // Draw
    drawPaddle(paddleMargin, playerY); // Left paddle (player)
    drawPaddle(canvasWidth - paddleMargin - paddleWidth, aiY); // Right paddle (AI)
    drawBall(ball.x, ball.y);

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
