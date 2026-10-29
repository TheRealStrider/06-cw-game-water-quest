// Game configuration and state variables
const GOAL_CANS = 20;
const GAME_DURATION = 30;
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timerInterval;
let timeLeft = GAME_DURATION;

const cansCollectedDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');

const winningMessages = [
  "Congratulations! You've provided all the water you need!",
  "Well done! You've given people the water they need!",
  "Fantastic! Water has been provided!",
  "Great job! You've completed the water quest!"
];
const losingMessages = [
  "Time's up! Better luck next time!",
  "Game over! Don't sweat it, try again!",
  "You ran out of time! Don't give up!",
  "Keep trying! You can do it!"
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');

  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <button class="water-can" type="button" aria-label="Collect water can"></button>
    </div>
  `;

  // Add a click event listener to the water can to handle collection
  randomCell.querySelector('.water-can').addEventListener('click', () => {
    cansCollectedDisplay.textContent = ++currentCans;
    randomCell.innerHTML = '';
  });
}

function startGame() {
  if (gameActive) return;
  gameActive = true;

  currentCans = 0;
  timeLeft = GAME_DURATION;

  cansCollectedDisplay.textContent = currentCans;
  timerDisplay.textContent = `${timeLeft}s`;
  messageDisplay.textContent = '';
  messageDisplay.className = 'message';
  createGrid();
  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  timerDisplay.textContent = 'Game Over';
  createGrid();
  if (currentCans >= GOAL_CANS) {
    messageDisplay.textContent = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    messageDisplay.className = 'message is-success';
  } else {
    messageDisplay.textContent = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    messageDisplay.className = 'message is-failure';
  }
}

function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timeLeft = GAME_DURATION;
  cansCollectedDisplay.textContent = currentCans;
  timerDisplay.textContent = `${timeLeft}s`;
  messageDisplay.textContent = '';
  messageDisplay.className = 'message';
  createGrid();
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
