const canvas = document.getElementById("game2");
const ctx2 = canvas.getContext("2d");

let isPause2 = true;

const GRID_SIZE2 = 25;
const TILE_SIZE2 = 30;
canvas.width = GRID_SIZE2 * TILE_SIZE2;
canvas.height = GRID_SIZE2 * TILE_SIZE2;

const targetSequence = [2, 4, 1, 7, 0, 5, 1, 0, 6, 5];
let currentIndex = 0;

const player2 = {
  x: Math.floor(GRID_SIZE2 / 2),
  y: Math.floor(GRID_SIZE2 / 2),
  size: TILE_SIZE2 - 6,
  lastMoveTime: Date.now(),
  isStoic: false,
};

const deadlocks = [];
const dataNodes = [];
let gameOver2 = false;
let gameWon2 = false;

function generateDeadlocks() {
  for (let i = 0; i < 4; i++) {
    deadlocks.push({
      x: Math.floor(Math.random() * GRID_SIZE2),
      y: Math.floor(Math.random() * GRID_SIZE2),
      size: TILE_SIZE2 - 4,
      moveCounter: 0,
      moveSpeed: Math.random() * 20 + 20,
    });
  }
}

function generateDataNodes() {
  dataNodes.length = 0;

  if (currentIndex < targetSequence.length) {
    dataNodes.push({
      x: Math.floor(Math.random() * GRID_SIZE2),
      y: Math.floor(Math.random() * GRID_SIZE2),
      value: targetSequence[currentIndex],
      isTarget: true,
    });
  }

  while (dataNodes.length < 8) {
    const randomVal = Math.floor(Math.random() * 10);
    const x = Math.floor(Math.random() * GRID_SIZE2);
    const y = Math.floor(Math.random() * GRID_SIZE2);

    if (!dataNodes.some((n) => n.x === x && n.y === y)) {
      dataNodes.push({ x, y, value: randomVal, isTarget: false });
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (gameOver2 || gameWon2) return;

  let moved = false;
  const key = e.key.toLowerCase();

  if ((key === "w" || key === "arrowup") && player2.y > 0) {
    player2.y--;
    moved = true;
  }
  if ((key === "s" || key === "arrowdown") && player2.y < GRID_SIZE2 - 1) {
    player2.y++;
    moved = true;
  }
  if ((key === "a" || key === "arrowleft") && player2.x > 0) {
    player2.x--;
    moved = true;
  }
  if ((key === "d" || key === "arrowright") && player2.x < GRID_SIZE2 - 1) {
    player2.x++;
    moved = true;
  }

  if (moved) {
    player2.lastMoveTime = Date.now();
    player2.isStoic = false;
    checkCollision();
  }
});

function checkCollision() {
  for (let i = 0; i < dataNodes.length; i++) {
    if (dataNodes[i].x === player2.x && dataNodes[i].y === player2.y) {
      if (dataNodes[i].value === targetSequence[currentIndex]) {
        currentIndex++;
        if (currentIndex >= targetSequence.length) {
          gameWon2 = true;
        } else {
          generateDataNodes();
        }
      } else {
        if (currentIndex > 0) currentIndex--;
        generateDataNodes();
      }
      break;
    }
  }
}

function updateLogic() {
  if (Date.now() - player2.lastMoveTime > 2000) {
    player2.isStoic = true;
  }

  if (!gameOver2 && !gameWon2) {
    deadlocks.forEach((d) => {
      d.moveCounter++;
      if (d.moveCounter >= d.moveSpeed) {
        d.moveCounter = 0;
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0 && d.y > 0) d.y--;
        else if (dir === 1 && d.y < GRID_SIZE2 - 1) d.y++;
        else if (dir === 2 && d.x > 0) d.x--;
        else if (dir === 3 && d.x < GRID_SIZE2 - 1) d.x++;
      }

      if (d.x === player2.x && d.y === player2.y && !player2.isStoic) {
        gameOver2 = true;
      }
    });
  }
}

function draw() {
  ctx2.clearRect(0, 0, canvas.width, canvas.height);

  ctx2.strokeStyle = "rgba(102, 126, 234, 0.2)";
  for (let i = 0; i <= GRID_SIZE2; i++) {
    ctx2.beginPath();
    ctx2.moveTo(i * TILE_SIZE2, 0);
    ctx2.lineTo(i * TILE_SIZE2, canvas.height);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.moveTo(0, i * TILE_SIZE2);
    ctx2.lineTo(canvas.width, i * TILE_SIZE2);
    ctx2.stroke();
  }

  ctx2.font = "bold 16px Arial";
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";
  dataNodes.forEach((node) => {
    ctx2.fillStyle =
      node.value === targetSequence[currentIndex] ? "#f093fb" : "#999";
    ctx2.fillText(
      node.value,
      node.x * TILE_SIZE2 + TILE_SIZE2 / 2,
      node.y * TILE_SIZE2 + TILE_SIZE2 / 2,
    );
  });

  ctx2.fillStyle = "#ff4757";
  deadlocks.forEach((d) => {
    ctx2.fillRect(d.x * TILE_SIZE2 + 2, d.y * TILE_SIZE2 + 2, d.size, d.size);
  });

  ctx2.fillStyle = player2.isStoic ? "#4bcffa" : "#667eea";
  ctx2.shadowBlur = player2.isStoic ? 15 : 0;
  ctx2.shadowColor = "#4bcffa";
  ctx2.fillRect(
    player2.x * TILE_SIZE2 + 3,
    player2.y * TILE_SIZE2 + 3,
    player2.size,
    player2.size,
  );
  ctx2.shadowBlur = 0;

  ctx2.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx2.fillRect(10, 10, 260, 40);
  ctx2.fillStyle = "#fff";
  ctx2.font = "14px Arial";
  ctx2.textAlign = "left";
  ctx2.fillText("Memori: " + targetSequence.join(" "), 20, 30);

  ctx2.fillStyle = "#4cd137";
  let offset = 75;
  for (let i = 0; i < currentIndex; i++) {
    ctx2.fillText(targetSequence[i], 20 + offset + i * 15.5, 30);
  }

  if (gameOver2) {
    ctx2.fillStyle = "rgba(255, 71, 87, 0.8)";
    ctx2.fillRect(0, 0, canvas.width, canvas.height);
    ctx2.fillStyle = "#fff";
    ctx2.textAlign = "center";
    ctx2.font = "bold 30px Arial";
    ctx2.fillText("TERKENA DEADLOCK!", canvas.width / 2, canvas.height / 2);
  } else if (gameWon2) {
    ctx2.fillStyle = "rgba(76, 209, 55, 0.8)";
    ctx2.fillRect(0, 0, canvas.width, canvas.height);
    ctx2.fillStyle = "#fff";
    ctx2.textAlign = "center";
    ctx2.font = "bold 30px Arial";
    ctx2.fillText("DATA LENGKAP!", canvas.width / 2, canvas.height / 2);
  }
}

function loop() {
  if (isPause2) return;

  updateLogic();
  draw();
  requestAnimationFrame(loop);
}

generateDeadlocks();
generateDataNodes();
loop();
