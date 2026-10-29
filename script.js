// Each difficulty changes the number of cans, game time, and spawn speed.
const difficultySettings = {
  easy: { goal: 15, duration: 30, spawnSpeed: 1200 },
  medium: { goal: 25, duration: 25, spawnSpeed: 900 },
  hard: { goal: 30, duration: 20, spawnSpeed: 650 }
};

// Milestone criteria are kept here so the messages can be changed easily.
const milestones = [
  { type: 'cans', value: 5, message: 'You made your first splash!' },
  { type: 'cans', value: 10, message: 'You are making waves!' },
  { type: 'cans', value: 15, message: 'So much water!' },
  { type: 'cans', value: 20, message: 'You are a water hero!' },
  { type: 'cans', value: 25, message: 'You are a water champion!' },
  { type: 'cans', value: 30, message: 'Water is life!' },
  { type: 'early-goal', message: 'You reached the water goal with time to spare!' }
];

let selectedDifficulty = 'easy';
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timerInterval;
let timeLeft = difficultySettings[selectedDifficulty].duration;
let earnedMilestones = [];
let soundEffect = new Audio('Sound/item-pickup-pop.wav');
let winEffect = new Audio('Sound/win.wav');

const cansCollectedDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const instructionsDisplay = document.getElementById('game-instructions');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');
const difficultySelector = document.getElementById('difficulty');
const milestoneList = document.getElementById('milestone-list');
const milestonesEmpty = document.getElementById('milestones-empty');

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
    soundEffect.play();
    checkMilestones();
  });
}

function updateDifficultyDetails() {
  const settings = difficultySettings[selectedDifficulty];
  instructionsDisplay.textContent =
    `Collect ${settings.goal} or more water cans to complete the game!`;
  timeLeft = settings.duration;
  timerDisplay.textContent = `${timeLeft}s`;
}

function addMilestone(message) {
  earnedMilestones.push(message);
  const milestoneItem = document.createElement('li');
  milestoneItem.textContent = message;
  milestoneList.appendChild(milestoneItem);
  milestonesEmpty.hidden = true;
}

function clearMilestones() {
  earnedMilestones = [];
  milestoneList.innerHTML = '';
  milestonesEmpty.hidden = false;
}

function checkMilestones() {
  const settings = difficultySettings[selectedDifficulty];

  milestones.forEach(milestone => {
    const reachedCansMilestone =
      milestone.type === 'cans' && currentCans >= milestone.value;
    const reachedEarlyGoal =
      milestone.type === 'early-goal' &&
      currentCans >= settings.goal &&
      timeLeft > settings.duration / 2;

    if ((reachedCansMilestone || reachedEarlyGoal) &&
        !earnedMilestones.includes(milestone.message)) {
      addMilestone(milestone.message);
    }
  });
}

function startGame() {
  if (gameActive) return;
  gameActive = true;
  difficultySelector.disabled = true;

  currentCans = 0;
  const settings = difficultySettings[selectedDifficulty];
  timeLeft = settings.duration;
  clearMilestones();

  cansCollectedDisplay.textContent = currentCans;
  timerDisplay.textContent = `${timeLeft}s`;
  messageDisplay.textContent = '';
  messageDisplay.className = 'message';
  createGrid();
  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, settings.spawnSpeed);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
      if (timeLeft === 0) {
        endGame();
      }
    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  difficultySelector.disabled = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  timerDisplay.textContent = 'Game Over';
  createGrid();
  if (currentCans >= difficultySettings[selectedDifficulty].goal) {
    messageDisplay.textContent = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    messageDisplay.className = 'message is-success';
    winEffect.play();
  } else {
    messageDisplay.textContent = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    messageDisplay.className = 'message is-failure';
  }
}

function resetGame() {
  gameActive = false;
  difficultySelector.disabled = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timeLeft = difficultySettings[selectedDifficulty].duration;
  cansCollectedDisplay.textContent = currentCans;
  timerDisplay.textContent = `${timeLeft}s`;
  messageDisplay.textContent = '';
  messageDisplay.className = 'message';
  clearMilestones();
  createGrid();
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
difficultySelector.addEventListener('change', () => {
  if (gameActive) return;
  selectedDifficulty = difficultySelector.value;
  updateDifficultyDetails();
});

updateDifficultyDetails();
