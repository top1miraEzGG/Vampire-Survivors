// ===========================
// SPRITE LOADER - Загрузчик спрайтов (ЗАГОТОВКА)
// ===========================

const SpriteLoader = {
    images: {},
    loaded: false,
    
    load() {
        console.log('[SpriteLoader] Заглушка - будет реализовано в Шаге 4');
    },
    
    get(key) {
        return null;
    },
    
    onReady(callback) {
        callback();
    }
};

window.SpriteLoader = SpriteLoader;
