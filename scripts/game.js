// Game functionality
let score = 0;
let timeLeft = 60;
let timer;
let board = [];
const colors = ['#FF2D55', '#FF9500', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6'];
const BOARD_SIZE = 8;

// Element references
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const pauseBtn = document.getElementById('pause-btn');
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const gameOverMenu = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const gameOverMenuBtn = document.getElementById('game-over-menu-btn');
const saveScoreBtn = document.getElementById('save-score-btn');
const playerNameInput = document.getElementById('player-name');

// Initialize game
function startGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    
    generateBoard();
    startTimer();
}

function generateBoard() {
    board = [];
    gameBoard.innerHTML = '';
    
    // Create board
    for (let row = 0; row < BOARD_SIZE; row++) {
        board[row] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const colorIndex = Math.floor(Math.random() * colors.length);
            board[row][col] = colorIndex;
            cell.style.backgroundColor = colors[colorIndex];
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    const clickedColor = board[row][col];
    if (clickedColor === -1) return; // Already removed
    
    const connected = getConnectedCells(row, col, clickedColor);
    if (connected.length < 2) return; // Need at least 2 to remove
    
    // Remove connected cells
    connected.forEach(([r, c]) => {
        board[r][c] = -1;
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.classList.add('explode');
        setTimeout(() => {
            cell.remove();
        }, 500);
    });
    
    // Update score
    score += connected.length * 10;
    scoreDisplay.textContent = score;
    
    // Shift cells down
    setTimeout(() => {
        shiftCellsDown();
        fillEmptySpaces();
        checkGameOver();
    }, 500);
}

function getConnectedCells(row, col, color, visited = new Set()) {
    const key = `${row},${col}`;
    if (
        row < 0 || row >= BOARD_SIZE || 
        col < 0 || col >= BOARD_SIZE || 
        visited.has(key) || 
        board[row][col] !== color
    ) {
        return [];
    }
    
    visited.add(key);
    let result = [[row, col]];
    
    // Check neighbors
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
        result = result.concat(getConnectedCells(row + dr, col + dc, color, visited));
    }
    
    return result;
}

function shiftCellsDown() {
    // Create a new board to represent the shifted state
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(-1));
    
    // Shift cells down column by column
    for (let col = 0; col < BOARD_SIZE; col++) {
        let newRow = BOARD_SIZE - 1;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (board[row][col] !== -1) {
                newBoard[newRow][col] = board[row][col];
                newRow--;
            }
        }
    }
    
    board = newBoard;
}

function fillEmptySpaces() {
    gameBoard.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (board[row][col] === -1) {
                // Fill empty space with new block
                const colorIndex = Math.floor(Math.random() * colors.length);
                board[row][col] = colorIndex;
                cell.style.backgroundColor = colors[colorIndex];
            } else {
                cell.style.backgroundColor = colors[board[row][col]];
            }
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
}

function checkGameOver() {
    // Check if there are any valid moves left
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === -1) continue;
            
            const connected = getConnectedCells(row, col, board[row][col]);
            if (connected.length >= 2) {
                return; // There's at least one valid move
            }
        }
    }
    
    // If no valid moves, game over
    endGame();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function pauseGame() {
    clearInterval(timer);
    pauseMenu.classList.remove('hidden');
}

function resumeGame() {
    startTimer();
    pauseMenu.classList.add('hidden');
}

function restartGame() {
    hideScreen(pauseMenu);
    startGame();
}

function endGame() {
    clearInterval(timer);
    finalScoreDisplay.textContent = score;
    gameOverMenu.classList.remove('hidden');
}

// Helper function to hide screens
function hideScreen(screen) {
    screen.classList.add('hidden');
}

// Event listeners for game controls
pauseBtn.addEventListener('click', pauseGame);
resumeBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', restartGame);
menuBtn.addEventListener('click', () => {
    hideScreen(pauseMenu);
    showScreen(mainMenu);
});
playAgainBtn.addEventListener('click', () => {
    hideScreen(gameOverMenu);
    startGame();
});
gameOverMenuBtn.addEventListener('click', () => {
    hideScreen(gameOverMenu);
    showScreen(mainMenu);
});
saveScoreBtn.addEventListener('click', saveScore);
