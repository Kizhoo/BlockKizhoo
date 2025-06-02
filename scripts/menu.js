// Menu navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const mainMenu = document.getElementById('main-menu');
    const howToPlayScreen = document.getElementById('how-to-play');
    const leaderboardScreen = document.getElementById('leaderboard');
    const gameScreen = document.getElementById('game-screen');
    
    const startBtn = document.getElementById('start-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const howToPlayBackBtn = document.getElementById('how-to-play-back-btn');
    const backBtn = document.getElementById('back-btn');
    
    // Event listeners for menu navigation
    startBtn.addEventListener('click', () => {
        showScreen(gameScreen);
        startGame(); // Function from game.js
    });
    
    howToPlayBtn.addEventListener('click', () => showScreen(howToPlayScreen));
    
    leaderboardBtn.addEventListener('click', () => {
        showLeaderboard(); // Function from leaderboard.js
        showScreen(leaderboardScreen);
    });
    
    howToPlayBackBtn.addEventListener('click', () => showScreen(mainMenu));
    backBtn.addEventListener('click', () => showScreen(mainMenu));
    
    // Function to show a specific screen
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }
});
