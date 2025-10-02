// NEON TIC-TAC-TOE JAVASCRIPT
class NeonTicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.playerXName = 'PLAYER X';
        this.playerOName = 'PLAYER O';
        this.scores = { X: 0, O: 0 };
        this.gameMode = 'pvp'; // 'pvp' or 'pvc'
        this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
        this.isComputerTurn = false;
        this.soundEnabled = true;
        this.animationsEnabled = true;
        
        this.initializeGame();
        this.bindEvents();
        this.createParticleEffect();
    }

    initializeGame() {
        this.boardElement = document.getElementById('gameBoard');
        this.currentTurnElement = document.getElementById('currentTurn');
        this.resetBtn = document.getElementById('resetBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.victoryModal = document.getElementById('victoryModal');
        this.settingsModal = document.getElementById('settingsModal');
        
        this.updateDisplay();
    }

    bindEvents() {
        // Board cell clicks
        this.boardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('board-cell') && !this.isComputerTurn) {
                const index = parseInt(e.target.dataset.index);
                this.makeMove(index);
            }
        });

        // Game mode selection
        document.getElementById('pvpMode').addEventListener('click', () => {
            this.setGameMode('pvp');
        });

        document.getElementById('pvcMode').addEventListener('click', () => {
            this.setGameMode('pvc');
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setDifficulty(btn.dataset.level);
            });
        });

        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
            if (this.soundEnabled) this.playSound('reset');
        });

        // Settings button
        this.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });

        // Modal buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.closeModal();
            this.resetGame();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            this.closeSettings();
        });

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeSettings();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
            if (e.key === 's' || e.key === 'S') {
                this.openSettings();
            }
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeSettings();
            }
        });
    }

    makeMove(index, isComputerMove = false) {
        if (this.board[index] !== '' || !this.gameActive) {
            if (!isComputerMove) {
                this.shakeElement(this.boardElement.children[index]);
            }
            return false;
        }

        // Make the move
        this.board[index] = this.currentPlayer;
        const cell = this.boardElement.children[index];
        
        // Add visual effects
        cell.textContent = this.currentPlayer;
        cell.classList.add('filled', this.currentPlayer.toLowerCase());
        
        // Play move sound
        if (this.soundEnabled) {
            this.playSound('move');
        }
        
        // Add particle effect
        if (this.animationsEnabled) {
            this.createMoveParticles(cell);
        }

        // Check for winner
        const winner = this.checkWinner();
        if (winner) {
            this.handleWin(winner);
            return true;
        }

        // Check for tie
        if (this.board.every(cell => cell !== '')) {
            this.handleTie();
            return true;
        }

        // Switch players
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();

        // If it's computer's turn, make computer move
        if (this.gameMode === 'pvc' && this.currentPlayer === 'O' && this.gameActive) {
            this.isComputerTurn = true;
            setTimeout(() => {
                this.makeComputerMove();
                this.isComputerTurn = false;
            }, 800); // Delay for realism
        }

        return true;
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(pattern);
                return this.board[a];
            }
        }
        return null;
    }

    highlightWinningCells(pattern) {
        pattern.forEach(index => {
            this.boardElement.children[index].classList.add('winner');
        });
    }

    handleWin(winner) {
        this.gameActive = false;
        this.scores[winner]++;
        this.updateScores();
        
        const winnerName = winner === 'X' ? this.playerXName : (this.gameMode === 'pvc' ? 'AI COMPUTER' : this.playerOName);
        
        setTimeout(() => {
            this.showVictoryModal(winnerName);
            if (this.soundEnabled) this.playSound('win');
            if (this.animationsEnabled) this.createFireworks();
        }, 1000);
    }

    handleTie() {
        this.gameActive = false;
        setTimeout(() => {
            this.showVictoryModal(null, true);
            if (this.soundEnabled) this.playSound('tie');
        }, 500);
    }

    showVictoryModal(winner, isTie = false) {
        const victoryTitle = document.getElementById('victoryTitle');
        const victoryMessage = document.getElementById('victoryMessage');
        
        if (isTie) {
            victoryTitle.textContent = '🌟 COSMIC TIE! 🌟';
            victoryMessage.textContent = 'The universe remains in perfect balance!';
        } else {
            victoryTitle.textContent = '🏆 NEON VICTORY! 🏆';
            victoryMessage.textContent = `${winner} dominates the digital realm!`;
        }
        
        this.victoryModal.style.display = 'block';
    }

    // Game Mode and Difficulty Management
    setGameMode(mode) {
        this.gameMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode === 'pvp' ? 'pvpMode' : 'pvcMode').classList.add('active');
        
        // Show/hide difficulty selection
        const difficultySection = document.getElementById('difficultySection');
        if (mode === 'pvc') {
            difficultySection.style.display = 'block';
            this.updatePlayerDisplay();
        } else {
            difficultySection.style.display = 'none';
            this.playerOName = 'PLAYER O';
            this.updatePlayerDisplay();
        }
        
        this.resetGame();
        if (this.soundEnabled) this.playSound('settings');
    }

    setDifficulty(level) {
        this.difficulty = level;
        
        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        this.updatePlayerDisplay();
        if (this.soundEnabled) this.playSound('settings');
    }

    updatePlayerDisplay() {
        if (this.gameMode === 'pvc') {
            // Update computer player display
            this.playerOName = 'AI COMPUTER';
            document.getElementById('playerOAvatar').textContent = '🤖';
            document.getElementById('aiIndicator').style.display = 'block';
            document.getElementById('aiLevel').textContent = this.difficulty.toUpperCase();
            
            // Update AI level color based on difficulty
            const aiLevel = document.getElementById('aiLevel');
            switch(this.difficulty) {
                case 'easy':
                    aiLevel.style.color = '#00ff41';
                    aiLevel.style.textShadow = '0 0 10px #00ff41';
                    break;
                case 'medium':
                    aiLevel.style.color = '#ffff00';
                    aiLevel.style.textShadow = '0 0 10px #ffff00';
                    break;
                case 'hard':
                    aiLevel.style.color = '#ff1744';
                    aiLevel.style.textShadow = '0 0 10px #ff1744';
                    break;
            }
        } else {
            // Reset to human player
            this.playerOName = 'PLAYER O';
            document.getElementById('playerOAvatar').textContent = '⚡';
            document.getElementById('aiIndicator').style.display = 'none';
        }
        
        this.updateDisplay();
    }

    // Computer AI Methods
    makeComputerMove() {
        if (!this.gameActive) return;
        
        let move;
        switch(this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getHardMove();
                break;
        }
        
        if (move !== -1) {
            this.makeMove(move, true);
        }
    }

    getRandomMove() {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                availableMoves.push(i);
            }
        }
        return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }

    getMediumMove() {
        // 70% chance to make smart move, 30% random
        if (Math.random() < 0.7) {
            // Try to win first
            let move = this.findWinningMove('O');
            if (move !== -1) return move;
            
            // Try to block player from winning
            move = this.findWinningMove('X');
            if (move !== -1) return move;
            
            // Take center if available
            if (this.board[4] === '') return 4;
            
            // Take corners
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => this.board[i] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
        }
        
        return this.getRandomMove();
    }

    getHardMove() {
        // Perfect play using minimax algorithm
        const bestMove = this.minimax(this.board, 'O').index;
        return bestMove;
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWinnerOnBoard(this.board) === player) {
                    this.board[i] = ''; // Reset
                    return i;
                }
                this.board[i] = ''; // Reset
            }
        }
        return -1;
    }

    minimax(board, player) {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') availableMoves.push(i);
        }

        // Terminal states
        const winner = this.checkWinnerOnBoard(board);
        if (winner === 'O') return { score: 10 };
        if (winner === 'X') return { score: -10 };
        if (availableMoves.length === 0) return { score: 0 };

        const moves = [];
        
        for (let i = 0; i < availableMoves.length; i++) {
            const move = { index: availableMoves[i] };
            board[availableMoves[i]] = player;
            
            const result = this.minimax(board, player === 'O' ? 'X' : 'O');
            move.score = result.score;
            
            board[availableMoves[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        }

        return bestMove;
    }

    checkWinnerOnBoard(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isComputerTurn = false;
        
        // Clear board visually
        Array.from(this.boardElement.children).forEach(cell => {
            cell.textContent = '';
            cell.className = 'board-cell';
        });
        
        this.updateDisplay();
        if (this.animationsEnabled) {
            this.createResetAnimation();
        }
    }

    updateDisplay() {
        let currentPlayerName, emoji, color;
        
        if (this.currentPlayer === 'X') {
            currentPlayerName = this.playerXName;
            emoji = '🔥';
            color = '#ff0080';
        } else {
            currentPlayerName = this.gameMode === 'pvc' ? 'AI COMPUTER' : this.playerOName;
            emoji = this.gameMode === 'pvc' ? '🤖' : '⚡';
            color = '#00ffff';
        }
        
        if (this.isComputerTurn) {
            this.currentTurnElement.innerHTML = `<span class="turn-text" style="color: ${color}">🤖 AI THINKING... 🤖</span>`;
        } else {
            this.currentTurnElement.innerHTML = `<span class="turn-text" style="color: ${color}">${emoji} ${currentPlayerName}'S TURN ${emoji}</span>`;
        }
        
        // Update player names in display
        document.getElementById('playerXName').textContent = this.playerXName;
        document.getElementById('playerOName').textContent = this.playerOName;
    }

    updateScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
    }

    openSettings() {
        document.getElementById('playerXInput').value = this.playerXName;
        
        // Show/hide Player O setting based on game mode
        const playerOSetting = document.getElementById('playerOSetting');
        if (this.gameMode === 'pvc') {
            playerOSetting.style.display = 'none';
        } else {
            playerOSetting.style.display = 'block';
            document.getElementById('playerOInput').value = this.playerOName;
        }
        
        // Set current toggle states
        document.getElementById('soundToggle').checked = this.soundEnabled;
        document.getElementById('animationsToggle').checked = this.animationsEnabled;
        
        this.settingsModal.style.display = 'block';
    }

    saveSettings() {
        const newPlayerXName = document.getElementById('playerXInput').value.trim() || 'PLAYER X';
        let newPlayerOName = document.getElementById('playerOInput').value.trim() || 'PLAYER O';
        
        this.playerXName = newPlayerXName.toUpperCase();
        
        // Only update Player O name if not in computer mode
        if (this.gameMode === 'pvp') {
            this.playerOName = newPlayerOName.toUpperCase();
        }
        
        // Update sound and animation settings
        this.soundEnabled = document.getElementById('soundToggle').checked;
        this.animationsEnabled = document.getElementById('animationsToggle').checked;
        
        this.updateDisplay();
        this.closeSettings();
        if (this.soundEnabled) this.playSound('settings');
    }

    closeModal() {
        this.victoryModal.style.display = 'none';
    }

    closeSettings() {
        this.settingsModal.style.display = 'none';
    }

    // Visual Effects
    createParticleEffect() {
        const particles = document.querySelector('.particles');
        
        setInterval(() => {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = this.getRandomNeonColor();
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
            particle.style.animation = 'particleTwinkle 3s ease-out forwards';
            
            particles.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }, 500);
    }

    createMoveParticles(cell) {
        if (!this.animationsEnabled) return;
        
        const rect = cell.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = this.currentPlayer === 'X' ? '#ff0080' : '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            
            const angle = (i * 45) * Math.PI / 180;
            const distance = 50;
            
            particle.style.animation = `moveParticle 0.6s ease-out forwards`;
            particle.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    createResetAnimation() {
        const board = this.boardElement;
        board.style.animation = 'resetPulse 0.5s ease-out';
        
        setTimeout(() => {
            board.style.animation = '';
        }, 500);
    }

    createFireworks() {
        if (!this.animationsEnabled) return;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.position = 'fixed';
                firework.style.width = '6px';
                firework.style.height = '6px';
                firework.style.background = this.getRandomNeonColor();
                firework.style.borderRadius = '50%';
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.pointerEvents = 'none';
                firework.style.zIndex = '1001';
                firework.style.boxShadow = `0 0 15px ${firework.style.background}`;
                firework.style.animation = 'fireworkExplode 2s ease-out forwards';
                
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 2000);
            }, i * 100);
        }
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    getRandomNeonColor() {
        const colors = ['#ff0080', '#00ffff', '#00ff41', '#ff1744', '#9d00ff', '#ffff00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Sound Effects (Web Audio API simulation)
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch (type) {
            case 'move':
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;
            case 'tie':
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                break;
            case 'reset':
                oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                break;
            case 'settings':
                oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                break;
        }
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Additional CSS animations for JavaScript effects
const style = document.createElement('style');
style.textContent = `
    @keyframes particleTwinkle {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes moveParticle {
        0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
        }
        100% { 
            opacity: 0; 
            transform: translate(var(--dx), var(--dy)) scale(0); 
        }
    }
    
    @keyframes resetPulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); box-shadow: 0 0 50px rgba(0, 255, 65, 0.8); }
        100% { transform: scale(1); }
    }
    
    @keyframes fireworkExplode {
        0% { 
            opacity: 1; 
            transform: scale(0); 
        }
        50% { 
            opacity: 1; 
            transform: scale(1); 
        }
        100% { 
            opacity: 0; 
            transform: scale(3); 
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NeonTicTacToe();
});

// Add keyboard shortcut hints
document.addEventListener('DOMContentLoaded', () => {
    const shortcutHints = document.createElement('div');
    shortcutHints.style.position = 'fixed';
    shortcutHints.style.bottom = '10px';
    shortcutHints.style.right = '10px';
    shortcutHints.style.background = 'rgba(0, 0, 0, 0.8)';
    shortcutHints.style.color = '#00ff41';
    shortcutHints.style.padding = '10px';
    shortcutHints.style.borderRadius = '8px';
    shortcutHints.style.fontSize = '0.8rem';
    shortcutHints.style.fontFamily = 'Orbitron, monospace';
    shortcutHints.style.border = '1px solid #333';
    shortcutHints.innerHTML = `
        <div>⌨️ SHORTCUTS:</div>
        <div>R - Reset Game</div>
        <div>S - Settings</div>
        <div>ESC - Close Modal</div>
    `;
    document.body.appendChild(shortcutHints);
});