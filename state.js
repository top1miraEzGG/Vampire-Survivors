
// ============================================================
// state.js - Состояние игры
// ============================================================

var GameState = (function() {
    // Приватные переменные
    let isPlaying = false;
    let isPaused = false;
    
    // Игрок
    let player = {
        x: 0,
        y: 0,
        health: 100,
        maxHealth: 100,
        gunAngle: 0,
        level: 1,
        currentExp: 0,
        expToNextLevel: 100
    };
    
    // Игровые объекты
    let bullets = [];
    let enemies = [];
    
    // Ресурсы
    let ammoCount = 999;
    let lastShotTime = 0;
    
    // Прогресс
    let waveNumber = 0;
    let enemiesInWave = 0;
    let enemiesDefeated = 0;
    let totalKills = 0;
    
    // Размеры окна
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    // Позиция игрока на прошлом кадре
    let prevPlayerX = 0;
    let prevPlayerY = 0;

    return {
        // Геттеры
        isPlaying: function() { return isPlaying; },
        isPaused: function() { return isPaused; },
        player: function() { return player; },
        bullets: function() { return bullets; },
        enemies: function() { return enemies; },
        ammoCount: function() { return ammoCount; },
        lastShotTime: function() { return lastShotTime; },
        waveNumber: function() { return waveNumber; },
        enemiesInWave: function() { return enemiesInWave; },
        enemiesDefeated: function() { return enemiesDefeated; },
        totalKills: function() { return totalKills; },
        windowWidth: function() { return windowWidth; },
        windowHeight: function() { return windowHeight; },

        
        setGunAngle: function(angle) {
    player.gunAngle = angle;
},
        
        // Сеттеры и методы
        setPlaying: function(value) { isPlaying = value; },
        setPaused: function(value) { isPaused = value; },
        
        reset: function() {
            isPlaying = true;
            isPaused = false;
            player.health = 100;
            player.maxHealth = 100;
            player.level = 1;
            player.currentExp = 0;
            player.expToNextLevel = 100;
            ammoCount = 999;
            bullets = [];
            enemies = [];
            waveNumber = 0;
            enemiesDefeated = 0;
            totalKills = 0;
            lastShotTime = 0;
        },
        
        updateWindowSize: function() {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        },
        
        setPlayerPosition: function(x, y) {
            player.x = x;
            player.y = y;
        },
        
        addBullet: function(bullet) {
            bullets.push(bullet);
        },
        
        removeBullet: function(index) {
            bullets.splice(index, 1);
        },
        
        addEnemy: function(enemy) {
            enemies.push(enemy);
        },
        
        removeEnemy: function(index) {
            enemies.splice(index, 1);
        },
        
        setAmmoCount: function(value) { ammoCount = value; },
        setLastShotTime: function(value) { lastShotTime = value; },
        
        incrementWave: function() { waveNumber++; },
        setEnemiesInWave: function(value) { enemiesInWave = value; },
        setEnemiesDefeated: function(value) { enemiesDefeated = value; },
        incrementTotalKills: function() { totalKills++; },
        
        updatePlayerVelocity: function() {
            const velX = player.x - prevPlayerX;
            const velY = player.y - prevPlayerY;
            prevPlayerX = player.x;
            prevPlayerY = player.y;
            return { velX: velX, velY: velY };
        },
        
        takeDamage: function(damage) {
            player.health -= damage;
            return player.health <= 0;
        },
        
        // Система опыта и уровней
        addExperience: function(amount) {
            player.currentExp += amount;
            while (player.currentExp >= player.expToNextLevel) {
                player.currentExp -= player.expToNextLevel;
                player.level++;
                player.maxHealth += 20;
                player.health = Math.min(player.health + player.maxHealth * 0.5, player.maxHealth);
                player.expToNextLevel = Math.floor(player.expToNextLevel * 1.2);
                if (typeof GameUI !== 'undefined' && GameUI.updateLevelUp) {
                    GameUI.updateLevelUp(player.level);
                }
            }
            if (typeof GameUI !== 'undefined' && GameUI.updateExperience) {
                GameUI.updateExperience();
            }
        },
        
        getExpForKill: function() {
            var diff = GameConfig.currentDifficulty;
            if (diff === 'easy') return 10;
            if (diff === 'normal') return 15;
            if (diff === 'hard') return 20;
            return 15;
        }
    };
})();
