// ===========================
// VAMPIRE SURVIVORS — PLAYER.JS
// Player state, movement, rendering
// ===========================

class Player {
  constructor() { this.reset(); }

  reset() {
    // Position
    this.x = 0; this.y = 0;

    // Stats
    this.maxHp       = CONFIG.PLAYER_BASE_HP;
    this.hp          = this.maxHp;
    this.speed       = CONFIG.PLAYER_BASE_SPEED;
    this.armor       = 0;
    this.regen       = 0;
    this.regenTimer  = 0;
    this.critChance  = 5;
    this.cdMult      = 1.0;
    this.dmgMult     = 1.0;
    this.xpMult      = 1.0;
    this.xpMagnetRadius = 60;

    // Level / XP
    this.level   = 1;
    this.xp      = 0;
    this.xpToNext = CONFIG.XP_LEVELS[1];

    // Combat
    this.radius     = CONFIG.PLAYER_RADIUS;
    this.invincible = false;
    this.iframeTimer = 0;

    // Weapons / passives
    this.weapons    = [];
    this.passives   = {}; // { id: level }

    // Visual
    this.lastDir    = 0;
    this.facing     = 1; // 1 = right, -1 = left
    this.bobOffset  = 0;
    this.walkAnim   = 0;
    this.isMoving   = false;

    // Input state
    this.keys = { up:false, down:false, left:false, right:false };
  }

  addWeapon(weaponId) {
    const data = WEAPONS_DATA[weaponId];
    if (!data) return;
    const existing = this.weapons.find(w => w.data.id === weaponId);
    if (existing) { existing.upgrade(); return; }
    this.weapons.push(new WeaponInstance(data, this));
  }

  addPassive(passiveId) {
    const data = PASSIVES_DATA[passiveId];
    if (!data) return;
    const lvl = (this.passives[passiveId] || 0) + 1;
    if (lvl > data.maxLevel) return;
    this.passives[passiveId] = lvl;
    data.apply(this);
  }

  gainXp(amount) {
    const actual = Math.round(amount * (this.xpMult || 1));
    this.xp += actual;
    let leveled = false;
    while (this.level < CONFIG.XP_LEVELS.length - 1 && this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      this.xpToNext = CONFIG.XP_LEVELS[this.level] - CONFIG.XP_LEVELS[this.level - 1];
      leveled = true;
    }
    return leveled;
  }

  getXpPercent() {
    return Utils.clamp(this.xp / this.xpToNext, 0, 1);
  }

  takeDamage(amount) {
    if (this.invincible) return 0;
    const actual = Math.max(1, amount - (this.armor || 0));
    this.hp = Math.max(0, this.hp - actual);
    this.invincible = true;
    this.iframeTimer = CONFIG.PLAYER_IFRAMES / 1000;
    return actual;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  update(dt, input) {
    // I-frames
    if (this.invincible) {
      this.iframeTimer -= dt;
      if (this.iframeTimer <= 0) { this.invincible = false; }
    }

    // Regen
    if (this.regen > 0) {
      this.regenTimer += dt;
      if (this.regenTimer >= 1.0) {
        this.regenTimer = 0;
        this.heal(this.regen);
      }
    }

    // Movement
    let dx = 0, dy = 0;
    if (input.up   || input.w) dy -= 1;
    if (input.down || input.s) dy += 1;
    if (input.left || input.a) dx -= 1;
    if (input.right|| input.d) dx += 1;

    const moving = dx !== 0 || dy !== 0;
    this.isMoving = moving;

    if (moving) {
      const norm = Utils.normalize(dx, dy);
      this.x += norm.x * this.speed * dt;
      this.y += norm.y * this.speed * dt;
      this.lastDir = Math.atan2(dy, dx);
      if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
      this.walkAnim += dt * 8;
    }

    // Clamp to world
    this.x = Utils.clamp(this.x, -CONFIG.WORLD_W / 2, CONFIG.WORLD_W / 2);
    this.y = Utils.clamp(this.y, -CONFIG.WORLD_H / 2, CONFIG.WORLD_H / 2);
  }

  draw(ctx, camX, camY, W, H) {
    // Временно пусто - будет реализовано в Шаге 5
    console.log('[Player] draw() - будет заменен на спрайт в Шаге 5');
}
    }
