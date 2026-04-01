
// ============================================================
// core.js - Главный цикл игры
// ============================================================

var GameCore = (function() {
    var gameLoopRunning = false;
    
    function init() {
        console.log('GameCore.init() вызван');
        // Проверяем, что все зависимости загружены
        if (typeof GameUI === 'undefined') {
            console.error('GameUI не загружен!');
            return;
        }
        if (typeof GameHero === 'undefined') {
            console.error('GameHero не загружен!');
            return;
        }
        
        // Инициализируем модули
        GameUI.init();
        GameHero.init();
        setupPauseHandler();
        setupResizeHandler();
        
        if (typeof GameLogger !== 'undefined') {
            GameLogger.info('Игра инициализирована');
        }
    }

    function startGame() {
        GameState.reset();
        GameState.setPlayerPosition(
            GameState.windowWidth() / 2,
            GameState.windowHeight() / 2
        );
        
        GameUI.showGameUI();
        GameUI.hideAllMenus();
        
        GameUI.updateAmmo();
        GameUI.updateKills();
        GameUI.updateHealth();
        GameUI.updateExperience();
        
        GameWaves.startNextWave();
        GameLogger.logGameStart();
        
        gameLoop();
    }

    function gameLoop() {
        if (!GameState.isPlaying() || GameState.isPaused()) {
            gameLoopRunning = false;
            return;
        }
        
        gameLoopRunning = true;
        requestAnimationFrame(gameLoop);
        
        GameHero.updatePosition();
        GameAI.moveBullets();
        GameAI.shootAtNearestEnemy();
        
        // Обновляем частицы
        if (GameConfig.VISUAL_CONFIG.particleEffects && typeof GameParticles !== 'undefined') {
            GameParticles.update(16.67); // ~60fps
        }
        
        var playerDied = GameAI.updateEnemies();
        if (playerDied) {
            endGame();
        }
    }

    function setupPauseHandler() {
        document.addEventListener('keydown', function(e) {
            if (e.code !== 'Escape' || !GameState.isPlaying()) return;
            
            if (GameState.isPaused()) {
                resumeGame();
            } else {
                pauseGame();
            }
        });
    }

    function pauseGame() {
        if (!GameState.isPlaying()) return;
        GameState.setPaused(true);
        if (GameUI.elements && GameUI.elements.pauseMenu) {
            GameUI.elements.pauseMenu.style.display = 'flex';
        }
        GameLogger.logPause();
    }

    function resumeGame() {
        if (!GameState.isPlaying()) return;
        GameState.setPaused(false);
        if (GameUI.elements && GameUI.elements.pauseMenu) {
            GameUI.elements.pauseMenu.style.display = 'none';
        }
        GameLogger.logResume();
        if (!gameLoopRunning) {
            gameLoop();
        }
    }

    function endGame() {
        GameState.setPlaying(false);
        GameUI.showGameOver();
        GameLogger.logGameOver();
    }

    function setupResizeHandler() {
        window.addEventListener('resize', function() {
            GameState.updateWindowSize();
        });
    }

    // Публичные методы
    return {
        init: init,
        startGame: startGame,
        pauseGame: pauseGame,
        resumeGame: resumeGame
    };
})();


