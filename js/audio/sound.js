// ============================================================
// sound.js - Управление звуками (временная версия)
// ============================================================

var GameSound = (function() {
    var sounds = {};
    var enabled = true;

    function play(name) {
        if (!enabled) return;
        console.log('Звук:', name);
    }

    function setEnabled(value) {
        enabled = value;
    }

    return {
        init: init,
        play: play,
        setEnabled: setEnabled
    };
})();
