var map = tileMap01;
var TILE_SIZE = 32;
var playerPos = { x: 0, y: 0 };
var blocks = [];
var goals = [];

function findEntities() {
  for (var y = 0; y < map.height; y++) {
    for (var x = 0; x < map.width; x++) {
      var cell = map.mapGrid[y][x][0];
      if (cell == "P") {
        playerPos = { x: x, y: y };
      }
      if (cell == "B") {
        blocks.push({ x: x, y: y });
      }
      if (cell == "G") {
        goals.push({ x: x, y: y });
      }
    }
  }
}

function createBoard() {
  var board = document.createElement("div");
  board.id = "game-board";
  board.style.display = "grid";
  board.style.gridTemplateRows =
    "repeat(" + map.height + ", " + TILE_SIZE + "px)";
  board.style.gridTemplateColumns =
    "repeat(" + map.width + ", " + TILE_SIZE + "px)";
  board.style.position = "relative";
  document.body.appendChild(board);

  for (var y = 0; y < map.height; y++) {
    for (var x = 0; x < map.width; x++) {
      var cell = map.mapGrid[y][x][0];
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.style.width = TILE_SIZE + "px";
      tile.style.height = TILE_SIZE + "px";
      tile.style.gridRow = y + 1;
      tile.style.gridColumn = x + 1;
      if (cell == "W") tile.classList.add(Tiles.Wall);
      if (cell == "G") tile.classList.add(Tiles.Goal);
      if (cell == " ") tile.classList.add(Tiles.Space);
      board.appendChild(tile);
    }
  }
}

function renderEntities() {
  var oldEntities = document.querySelectorAll(
    ".entity-player, .entity-block, .entity-block-goal"
  );
  for (var i = 0; i < oldEntities.length; i++) {
    oldEntities[i].remove();
  }
  var player = document.createElement("div");
  player.className = Entities.Character;
  player.style.position = "absolute";
  player.style.left = playerPos.x * TILE_SIZE + "px";
  player.style.top = playerPos.y * TILE_SIZE + "px";
  player.style.width = TILE_SIZE + "px";
  player.style.height = TILE_SIZE + "px";
  player.style.zIndex = 2;
  document.getElementById("game-board").appendChild(player);
  for (var b = 0; b < blocks.length; b++) {
    var block = blocks[b];
    var isGoal = false;
    for (var g = 0; g < goals.length; g++) {
      if (goals[g].x == block.x && goals[g].y == block.y) {
        isGoal = true;
      }
    }
    var blockDiv = document.createElement("div");
    blockDiv.className = isGoal ? Entities.BlockDone : Entities.Block;
    blockDiv.style.position = "absolute";
    blockDiv.style.left = block.x * TILE_SIZE + "px";
    blockDiv.style.top = block.y * TILE_SIZE + "px";
    blockDiv.style.width = TILE_SIZE + "px";
    blockDiv.style.height = TILE_SIZE + "px";
    blockDiv.style.zIndex = 1;
    document.getElementById("game-board").appendChild(blockDiv);
  }
}

function isWall(x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
  return map.mapGrid[y][x][0] == "W";
}
function isBlock(x, y) {
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].x == x && blocks[i].y == y) return true;
  }
  return false;
}
function isGoal(x, y) {
  for (var i = 0; i < goals.length; i++) {
    if (goals[i].x == x && goals[i].y == y) return true;
  }
  return false;
}

function movePlayer(dx, dy) {
  var nx = playerPos.x + dx;
  var ny = playerPos.y + dy;
  if (isWall(nx, ny)) return;
  var blockIdx = -1;
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].x == nx && blocks[i].y == ny) blockIdx = i;
  }
  if (blockIdx != -1) {
    var bx = nx + dx;
    var by = ny + dy;
    if (isWall(bx, by) || isBlock(bx, by)) return;
    blocks[blockIdx].x = bx;
    blocks[blockIdx].y = by;
  }
  playerPos.x = nx;
  playerPos.y = ny;
  renderEntities();
  checkWin();
}

function checkWin() {
  var win = true;
  for (var i = 0; i < blocks.length; i++) {
    if (!isGoal(blocks[i].x, blocks[i].y)) win = false;
  }
  if (win) {
    setTimeout(function () {
      alert("You win!");
    }, 100);
    document.removeEventListener("keydown", handleKey);
  }
}

function handleKey(e) {
  if (
    e.key == "ArrowUp" ||
    e.key == "ArrowDown" ||
    e.key == "ArrowLeft" ||
    e.key == "ArrowRight"
  ) {
    e.preventDefault();
  }

  if (e.key == "ArrowUp") {
    movePlayer(0, -1);
  }
  if (e.key == "ArrowDown") {
    movePlayer(0, 1);
  }
  if (e.key == "ArrowLeft") {
    movePlayer(-1, 0);
  }
  if (e.key == "ArrowRight") {
    movePlayer(1, 0);
  }
}

function startGame() {
  findEntities();
  createBoard();
  renderEntities();
  document.addEventListener("keydown", handleKey);
}

window.onload = startGame;

var style = document.createElement("style");
style.innerHTML =
  "body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f0f0f0; } " +
  "#game-board { position: relative; margin: 40px auto; background: #eee; }" +
  ".tile { border: 1px solid #bbb; }" +
  "." +
  Tiles.Wall +
  " { background: #444; }" +
  "." +
  Tiles.Space +
  " { background: #eee; }" +
  "." +
  Tiles.Goal +
  " { background: #ffe066; }" +
  "." +
  Entities.Character +
  " { background: #3498db; border-radius: 50%; }" +
  "." +
  Entities.Block +
  " { background: #8e44ad; border-radius: 8px; }" +
  "." +
  Entities.BlockDone +
  " { background: #27ae60; border-radius: 8px; }";
document.head.appendChild(style);
