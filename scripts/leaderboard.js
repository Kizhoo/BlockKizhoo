// Leaderboard functionality
const leaderboardList = document.getElementById('leaderboard-list');

function saveScore() {
    const playerName = playerNameInput.value.trim() || 'Player';
    const playerScore = score;
    
    // Get current leaderboard from localStorage
    const leaderboard = JSON.parse(localStorage.getItem('blockBlastLeaderboard') || '[]');
    
    // Add new score
    leaderboard.push({ name: playerName, score: playerScore });
    
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep top 10
    if (leaderboard.length > 10) {
        leaderboard.length = 10;
    }
    
    // Save back to localStorage
    localStorage.setItem('blockBlastLeaderboard', JSON.stringify(leaderboard));
    
    // Show success message
    alert('Skor berhasil disimpan!');
    playerNameInput.value = '';
    hideScreen(gameOverMenu);
    showScreen(mainMenu);
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('blockBlastLeaderboard') || '[]');
    leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p>Belum ada skor</p>';
        return;
    }
    
    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.classList.add('leaderboard-item');
        
        const rank = document.createElement('div');
        rank.classList.add('leaderboard-rank');
        rank.textContent = `#${index + 1}`;
        
        const name = document.createElement('div');
        name.classList.add('leaderboard-name');
        name.textContent = entry.name;
        
        const score = document.createElement('div');
        score.classList.add('leaderboard-score');
        score.textContent = entry.score;
        
        item.appendChild(rank);
        item.appendChild(name);
        item.appendChild(score);
        leaderboardList.appendChild(item);
    });
}

// Initialize leaderboard
if (!localStorage.getItem('blockBlastLeaderboard')) {
    localStorage.setItem('blockBlastLeaderboard', JSON.stringify([]));
}

// Helper functions
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

function hideScreen(screen) {
    screen.classList.add('hidden');
}
