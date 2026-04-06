

// ============================================================
// sound.js - Система звуков
// ============================================================

var Sound = (function() {
    var sounds = {};
    var volume = 0.5;
    var muted = false;
    var initialized = false;
    // Список звуков
    var soundFiles = {
        shoot: 'assets/sounds/shoot.mp3',//!!
        hit: 'assets/sounds/hit.mp3',//!!
        enemyDeath: 'assets/sounds/enemy-death.mp3',//=hit
        waveStart: 'assets/sounds/wave-start.mp3',//none
        playerHit: 'assets/sounds/player-hit.mp3',//=hit
        gameOver: 'assets/sounds/game-over.mp3',//!!
        click: 'assets/sounds/click.mp3'//!!
    };
    function loadSound(name, src) {
        var audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';
        audio.volume = volume;
        sounds[name] = audio;
    }
    // Воспроизведение звука
    function play(name) {
        if (muted || !sounds[name]) return;
        var sound = sounds[name].cloneNode();
        sound.volume = volume;
        sound.play().catch(function(e) {
            console.log('Sound play error:', e);
        });
    }
    
    return {
        init: function() {
            if (initialized) return;
            console.log('[Sound] Загрузка звуков...');
            for (var name in soundFiles) {
                loadSound(name, soundFiles[name]);
            }
            initialized = true;
            console.log('[Sound] Звуки загружены');
        },
        
        // Выстрел
        playShoot: function() { play('shoot'); },
        
        // Попадание
        playHit: function() { play('hit'); },
        
        // Смерть врага
        playEnemyDeath: function() { play('enemyDeath'); },
        
        // Волна
        playWaveStart: function() { play('waveStart'); },
        
        // Урон игроку
        playPlayerHit: function() { play('playerHit'); },
        
        // Game Over
        playGameOver: function() { play('gameOver'); },
        
        // Клик
        playClick: function() { play('click'); },
        
        // Громкость
        setVolume: function(vol) {
            volume = Math.max(0, Math.min(1, vol));
            for (var name in sounds) sounds[name].volume = volume;
        },
        getVolume: function() { return volume; },
        
        // Mute
        toggleMute: function() { muted = !muted; return muted; },
        isMuted: function() { return muted; },
        
        isReady: function() { return initialized; }
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    Sound.init();
});
