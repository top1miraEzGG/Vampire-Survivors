// ============================================================
// ui.js - Управление интерфейсом и отрисовка через Canvas
// ============================================================

const GameUI = (() => {
    const ids = {
        menu: 'menu',
        difficultyScreen: 'difficulty-screen',
        pauseMenu: 'pause-menu',
        gameContainer: 'game-container',

        startButton: 'start-button',
        difficultyButton: 'difficulty-button',
        exitButton: 'exit-button',

        diffEasy: 'diff-easy',
        diffNormal: 'diff-normal',
        diffHard: 'diff-hard',
        diffBack: 'diff-back',

        resumeButton: 'resume-button',
        pauseExitButton: 'pause-exit-button',

        ammoIndicator: 'ammo-indicator',
        waveIndicator: 'wave-indicator',
        killCounter: 'kill-counter',
        waveAnnounce: 'wave-announce',

        gameOverMessage: 'game-over-message',
        gameOverText: 'game-over-text',
        restartButton: 'restart-button',

        playerHpWrap: 'player-healthbar-wrap',
        playerHpFill: 'player-healthbar-fill',
        playerHpValue: 'player-hp-value',

        soundToggle: 'sound-toggle'
    };

    const requiredElements = [
        'menu', 'startButton', 'difficultyButton', 'exitButton', 'gameContainer'
    ];

    const elements = {};
    let waveAnnounceTimer = null;
    let canvasContext = null;
    let canvasElement = null;
    let renderLoopId = null;

    const displayMap = {
        menu: 'flex',
        difficultyScreen: 'flex',
        pauseMenu: 'flex',
        gameContainer: 'block',
        ammoIndicator: 'block',
        waveIndicator: 'block',
        killCounter: 'block',
        waveAnnounce: 'block',
        gameOverMessage: 'flex',
        playerHpWrap: 'flex',
        soundToggle: 'block'
    };

    function init() {
        console.log('[UI] init');

        if (typeof document === 'undefined') {
            console.error('[UI] document не доступен');
            return false;
        }

        cacheElements();

        if (!validateElements()) {
            return false;
        }

        bindEvents();
        console.log('[UI] init завершён');
        return true;
    }

    function cacheElements() {
        Object.keys(ids).forEach(key => {
            elements[key] = document.getElementById(ids[key]);
        });
    }

    function validateElements() {
        const missing = requiredElements.filter(key => !elements[key]);

        if (missing.length > 0) {
            console.error(
                '[UI] Не найдены элементы:',
                missing.map(key => ids[key]).join(', ')
            );
            console.log('[UI] document.readyState:', document.readyState);
            return false;
        }

        return true;
    }

    function bindEvents() {
        bindMenuEvents();
        bindDifficultyEvents();
        bindPauseEvents();
    }

    function bindMenuEvents() {
        on('startButton', 'click', () => {
            hide('menu');
            GameCore.startGame();
            showGameUI();
            initCanvas();
            startRenderLoop();
            createPlayer();
            updateAmmo();
            updateWave();
            updateKills();
            updateHealth();
            show('playerHpWrap');
            show('soundToggle');
        });

        on('difficultyButton', 'click', () => {
            hide('menu');
            show('difficultyScreen');
        });

        on('exitButton', 'click', reloadPage);
    }

    function bindDifficultyEvents() {
        on('diffEasy',   'click', () => setDifficultyUI('easy'));
        on('diffNormal', 'click', () => setDifficultyUI('normal'));
        on('diffHard',   'click', () => setDifficultyUI('hard'));

        on('diffBack',   'click', () => {
            hide('difficultyScreen');
            show('menu');
        });
    }

    function bindPauseEvents() {
        on('resumeButton',   'click', GameCore.resumeGame);
        on('pauseExitButton', 'click', reloadPage);
        on('restartButton',  'click', reloadPage);
    }

    function setDifficultyUI(level) {
      const labels = { easy: 'Легко', normal: 'Нормально', hard: 'Сложно' };
      GameConfig.setDifficulty(level);
      setText('difficultyButton', `Сложность: ${labels[level]}`);
      hide('difficultyScreen');
      show('menu');
    }

    function initCanvas() {
      console.log('[UI] initCanvas');
      canvasElement = document.createElement('canvas');
      canvasElement.id = 'game-canvas';
      canvasElement.style.position = 'absolute';
      canvasElement.style.top = 0;
      canvasElement.style.left = 0;
      canvasElement.style.zIndex = 1;
      elements.gameContainer.appendChild(canvasElement);
      canvasContext = canvasElement.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
      if (!canvasElement) return;
      canvasElement.width = elements.gameContainer.clientWidth;
      canvasElement.height = elements.gameContainer.clientHeight;
    }

    function startRenderLoop() {
      renderLoopId = requestAnimationFrame(renderLoop);
    }

    function stopRenderLoop() {
      cancelAnimationFrame(renderLoopId);
    }

    function renderLoop() {
      clearCanvas();
      drawPlayer();
      drawEnemies();
      drawBullets();
      renderLoopId = requestAnimationFrame(renderLoop);
    }

    function clearCanvas() {
      if (canvasContext) {
          canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
    }

    // --- Отрисовка объектов на Canvas ---

    function drawPlayer() {
      const player = GameState.player();
      if (!player || !canvasContext) return;

      // Игрок (прямоугольник)
      canvasContext.fillStyle = '#3498db';
      canvasContext.fillRect(player.x, player.y, player.width, player.height);
      
      // Полоска здоровья игрока (над игроком)
      const hp = Math.max(0, Math.min(100, player.health));
      canvasContext.fillStyle = '#2ecc40';
      canvasContext.fillRect(player.x, player.y - 10, (player.width * hp) / 100, 5);
    }

    function drawEnemies() {
      const enemies = GameState.enemies();
      if (!enemies || !canvasContext) return;
      
      enemies.forEach(enemy => {
          // Враг (прямоугольник)
          canvasContext.fillStyle = '#e74c3c';
          canvasContext.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          
          // Полоска здоровья врага (над врагом)
          const hp = Math.max(0, Math.min(100, enemy.health));
          canvasContext.fillStyle = '#ff4136';
          canvasContext.fillRect(enemy.x, enemy.y - 10, (enemy.width * hp) / 100, 5);
       });
    }
    
    function drawBullets() {
       const bullets = GameState.bullets();
       if (!bullets || !canvasContext) return;
       
       bullets.forEach(bullet => {
           canvasContext.fillStyle = '#f1c40f';
           canvasContext.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
       });
   }
    
   // --- Обновление интерфейса ---
   
   function updateAmmo() {
     setText('ammoIndicator', `Патроны: ${GameState.ammoCount()}/infinity`);
   }
   
   function updateWave() {
     setText('waveIndicator', `Волна: ${GameState.waveNumber()}`);
   }
   
   function updateKills() {
     setText('killCounter', `Убито: ${GameState.totalKills()}`);
   }
   
   function updateHealth() {
     if (!elements.playerHpFill || !elements.playerHpValue) return;
     const hp = Math.max(0, Math.min(100, GameState.player().health));
     elements.playerHpFill.style.width = `${hp}%`;
     elements.playerHpValue.textContent = Math.ceil(hp);
     if (hp > 60) elements.playerHpFill.style.backgroundColor = '#2ecc40';
     else if (hp > 30) elements.playerHpFill.style.backgroundColor = '#ffdc00';
     else elements.playerHpFill.style.backgroundColor = '#ff4136';
   }
   
   // --- Вспомогательные функции ---
   
   function showWaveAnnounce(text) {
     if (!elements.waveAnnounce) return;
     setText('waveAnnounce', text);
     show('waveAnnounce');
     clearTimeout(waveAnnounceTimer);
     waveAnnounceTimer = setTimeout(() => hide('waveAnnounce'), GameConfig.GAME_PARAMS.WAVE_ANNOUNCE_DURATION);
   }
   
   function showGameOver() {
     setText(
       'gameOverText',
       `Игра закончена!\nВолна: ${GameState.waveNumber()}\nУбито врагов: ${GameState.totalKills()}`
     );
     show('gameOverMessage');
   }
   
   function showGameUI() {
     console.log('[UI] showGameUI');
     hideAllMenus();
     show('gameContainer');
     show('ammoIndicator');
     show('waveIndicator');
     show('killCounter');
   }
   
   function hideAllMenus() {
     hide('menu');
     hide('difficultyScreen');
     hide('pauseMenu');
     hide('gameOverMessage');
   }
   
   function show(name, display = displayMap[name] || 'block') {
     if (elements[name]) elements[name].style.display = display;
   }
   
   function hide(name) {
     if (elements[name]) elements[name].style.display = 'none';
   }
   
   function setText(name, value) {
     if (elements[name]) elements[name].textContent = value;
   }
   
   function on(name, event, handler) {
     if (elements[name]) elements[name].addEventListener(event, handler);
   }
   
   function reloadPage() {
     location.reload();
   }
   
   // --- Инициализация игрока ---
   
   function createPlayer() {
       // Игрок создаётся в GameState, здесь только триггерим перерисовку
       // Если нужно — можно добавить анимацию появления здесь.
   }
    
   return {
       init,
       elements,
       
       createPlayer,
       
       updateAmmo,
       updateWave,
       updateKills,
       updateHealth,
       
       showWaveAnnounce,
       showGameOver,
       showGameUI,
       hideAllMenus,
       
       setDifficultyUI,
       
       stopRenderLoop // для паузы/выхода из игры
   };
})();
