const game = document.getElementById("game1");
const ctx = game.getContext("2d");

let isPause1 = false;

const GRID_SIZE = 25;
const TILE_SIZE = 30;
const CANVAS_WIDTH = GRID_SIZE * TILE_SIZE;
const CANVAS_HEIGHT = GRID_SIZE * TILE_SIZE;
const ENEMY_MOVE_INTERVAL = 50;
const TOTAL_ENEMY = 1;

game.width = CANVAS_WIDTH;
game.height = CANVAS_HEIGHT;

const player = {
  x: Math.floor(GRID_SIZE / 2),
  y: Math.floor(GRID_SIZE / 2),
  size: TILE_SIZE - 4,
};

const visited = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(false),
);

function getRandomChar() {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
}

function getUniqueCharacters() {
  const chars = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  while (chars.length < 4) {
    const char = alphabet.charAt(Math.floor(Math.random() * 26));
    if (!chars.includes(char)) {
      chars.push(char);
    }
  }
  return chars;
}

const points = [];
const collectedPoints = new Set();

function generatePoints() {
  while (points.length < 5) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);

    if (x === player.x && y === player.y) continue;

    if (points.some((p) => p.x === x && p.y === y)) continue;
    points.push({ x, y, id: points.length });
  }
}

const enemies = [];
let gameOver = false;

function generateEnemies() {
  const enemyCount = TOTAL_ENEMY || 3;
  while (enemies.length < enemyCount) {
    let x = Math.floor(Math.random() * GRID_SIZE);
    let y = Math.floor(Math.random() * GRID_SIZE);

    if (Math.abs(x - player.x) + Math.abs(y - player.y) < 8) continue;
    if (enemies.some((e) => e.x === x && e.y === y)) continue;

    enemies.push({
      x,
      y,
      size: TILE_SIZE - 6,
      moveCounter: 0,
      moveSpeed: ENEMY_MOVE_INTERVAL || Math.random() * 15 + 15,
    });
  }
}

let uniqueChars = getUniqueCharacters();
const surroundings = {
  kiri: uniqueChars[0],
  kanan: uniqueChars[1],
  atas: uniqueChars[2],
  bawah: uniqueChars[3],
};

const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  handleInput(e.key.toLowerCase());
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function handleInput(key) {
  if (gameOver || collectedPoints.size === 5) return;

  const keyUpper = key.toUpperCase();
  let newX = player.x;
  let newY = player.y;
  let moved = false;

  if (surroundings.kiri === keyUpper && player.x > 0) {
    newX = player.x - 1;
    moved = true;
  } else if (surroundings.kanan === keyUpper && player.x < GRID_SIZE - 1) {
    newX = player.x + 1;
    moved = true;
  } else if (surroundings.atas === keyUpper && player.y > 0) {
    newY = player.y - 1;
    moved = true;
  } else if (surroundings.bawah === keyUpper && player.y < GRID_SIZE - 1) {
    newY = player.y + 1;
    moved = true;
  }

  if (moved) {
    visited[player.y][player.x] = true;
    player.x = newX;
    player.y = newY;

    for (let point of points) {
      if (
        point.x === player.x &&
        point.y === player.y &&
        !collectedPoints.has(point.id)
      ) {
        collectedPoints.add(point.id);
      }
    }

    uniqueChars = getUniqueCharacters();
    surroundings.kiri = uniqueChars[0];
    surroundings.kanan = uniqueChars[1];
    surroundings.atas = uniqueChars[2];
    surroundings.bawah = uniqueChars[3];
  }
}

function drawBackground() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      ctx.fillStyle = visited[y][x] ? "#c8e6c9" : "#f5f5f5";
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawGrid() {
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE_SIZE, 0);
    ctx.lineTo(i * TILE_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
  }

  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * TILE_SIZE);
    ctx.lineTo(CANVAS_WIDTH, i * TILE_SIZE);
    ctx.stroke();
  }
}

function drawSurroundings() {
  ctx.fillStyle = "#333";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = player.x * TILE_SIZE + TILE_SIZE / 2;
  const centerY = player.y * TILE_SIZE + TILE_SIZE / 2;

  ctx.fillText(surroundings.kiri, centerX - TILE_SIZE, centerY);
  ctx.fillText(surroundings.kanan, centerX + TILE_SIZE, centerY);
  ctx.fillText(surroundings.atas, centerX, centerY - TILE_SIZE);
  ctx.fillText(surroundings.bawah, centerX, centerY + TILE_SIZE);
}

function drawPlayer() {
  const pixelX = player.x * TILE_SIZE + (TILE_SIZE - player.size) / 2;
  const pixelY = player.y * TILE_SIZE + (TILE_SIZE - player.size) / 2;

  ctx.fillStyle = "#2196F3";

  ctx.strokeStyle = "#1565C0";
  ctx.lineWidth = 2;
  ctx.strokeRect(pixelX, pixelY, player.size, player.size);
}

function drawTracking() {
  const pointsCollected = collectedPoints.size;
  const totalPoints = 5;

  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(10, 10, 180, 50);

  ctx.strokeStyle = "#2196F3";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 180, 50);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Points: " + pointsCollected + "/" + totalPoints, 20, 35);

  for (let i = 0; i < totalPoints; i++) {
    const isCollected = collectedPoints.has(i);
    ctx.fillStyle = isCollected ? "#4CAF50" : "#cccccc";
    ctx.fillRect(20 + i * 30, 40, 8, 8);
    ctx.strokeStyle = isCollected ? "#2e7d32" : "#999999";
    ctx.lineWidth = 1;
    ctx.strokeRect(20 + i * 30, 40, 8, 8);
  }
}

function drawWinState() {
  if (collectedPoints.size === 5) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#4CAF50";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YOU WIN!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Semua poin berhasil dikumpulkan!",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 30,
    );

    ctx.font = "14px Arial";
    ctx.fillText(
      "Refresh halaman untuk bermain lagi",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 60,
    );
  }
}

function updateEnemies() {
  for (let enemy of enemies) {
    enemy.moveCounter++;

    if (enemy.moveCounter >= enemy.moveSpeed) {
      enemy.moveCounter = 0;

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) enemy.x = Math.min(enemy.x + 1, GRID_SIZE - 1);
        else if (dx < 0) enemy.x = Math.max(enemy.x - 1, 0);
      } else {
        if (dy > 0) enemy.y = Math.min(enemy.y + 1, GRID_SIZE - 1);
        else if (dy < 0) enemy.y = Math.max(enemy.y - 1, 0);
      }
    }

    if (enemy.x === player.x && enemy.y === player.y) {
      gameOver = true;
    }
  }
}

function drawEnemies() {
  for (let enemy of enemies) {
    const pixelX = enemy.x * TILE_SIZE + (TILE_SIZE - enemy.size) / 2;
    const pixelY = enemy.y * TILE_SIZE + (TILE_SIZE - enemy.size) / 2;

    ctx.fillStyle = "#f44336";
    ctx.fillRect(pixelX, pixelY, enemy.size, enemy.size);

    ctx.strokeStyle = "#c62828";
    ctx.lineWidth = 2;
    ctx.strokeRect(pixelX, pixelY, enemy.size, enemy.size);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(pixelX + 3, pixelY + 3, 4, 4);
    ctx.fillRect(pixelX + enemy.size - 7, pixelY + 3, 4, 4);
    ctx.fillStyle = "#000000";
    ctx.fillRect(pixelX + 4, pixelY + 4, 2, 2);
    ctx.fillRect(pixelX + enemy.size - 6, pixelY + 4, 2, 2);
  }
}

function drawGameOverState() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#f44336";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Tertangkap oleh musuh!",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 30,
    );

    ctx.font = "14px Arial";
    ctx.fillText(
      "Refresh halaman untuk bermain lagi",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 60,
    );
  }
}

function update() {
  if (isPause1) return;

  if (!gameOver && collectedPoints.size < 5) {
    updateEnemies();
  }

  drawBackground();
  drawGrid();
  drawSurroundings();
  drawPlayer();
  drawEnemies();
  drawTracking();
  drawWinState();
  drawGameOverState();
  requestAnimationFrame(update);
}

generatePoints();
generateEnemies();
update();
