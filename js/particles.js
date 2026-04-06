// ============================================================
// particles.js - Система частиц для визуальных эффектов
// ============================================================

var GameParticles = (function() {
    var particles = [];
    var PARTICLE_LIFETIME = 500; // 0.5 секунды в миллисекундах
    
    function createParticle(x, y, vx, vy, color, size) {
        particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            color: color,
            size: size,
            life: PARTICLE_LIFETIME,
            maxLife: PARTICLE_LIFETIME
        });
    }
    
    function createShotParticles(x, y, angle) {
        if (!GameConfig.VISUAL_CONFIG.particleEffects) return;
        
        var count = 3 + Math.floor(Math.random() * 3); // 3-5 частиц
        for (var i = 0; i < count; i++) {
            var spread = (Math.random() - 0.5) * 1.5;
            var speed = 2 + Math.random() * 3;
            var a = angle + Math.PI + spread; // назад от игрока
            
            createParticle(
                x, y,
                Math.cos(a) * speed,
                Math.sin(a) * speed,
                '#ff9500', // оранжевый
                3 + Math.random() * 2
            );
        }
    }
    
    function createHitParticles(x, y) {
        if (!GameConfig.VISUAL_CONFIG.particleEffects) return;
        
        var count = 5 + Math.floor(Math.random() * 3); // 5-7 частиц
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 1 + Math.random() * 3;
            
            createParticle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                '#ff4136', // красный
                2 + Math.random() * 3
            );
        }
    }
    
    function createDeathParticles(x, y) {
        if (!GameConfig.VISUAL_CONFIG.particleEffects) return;
        
        var count = 8 + Math.floor(Math.random() * 3); // 8-10 частиц
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 2 + Math.random() * 4;
            
            createParticle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                '#8b0000', // темно-красный
                3 + Math.random() * 4
            );
        }
    }
    
    function update(deltaTime) {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.life -= deltaTime;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95; // замедление
            p.vy *= 0.95;
        }
    }
    
    function render(ctx) {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var alpha = p.life / p.maxLife;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    function clear() {
        particles = [];
    }
    
    return {
        createShotParticles: createShotParticles,
        createHitParticles: createHitParticles,
        createDeathParticles: createDeathParticles,
        update: update,
        render: render,
        clear: clear,
        getParticles: function() { return particles; }
    };
})();
