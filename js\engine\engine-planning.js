// engine-planning.js —— 年度筹划回合：精力点（AP）系统
// 设计：AP 是"每年可自由动作"的统一预算，取代原先各自为政的"每类动作各 1 次"。
// 现有动作（理财/人脉/子女）在 UI 层各消耗 1 AP，AP 用尽即不能再做，形成真实取舍。
// 引擎的年度上限（financeUsed/网络槽位等）仍作为兜底防重，headless 模拟不调用这些可自由动作，平衡不受影响。
(function() {
  if (typeof GameEngine === 'undefined') return;

  // 每年可用精力上限：基础 3，按处境浮动（充沛/透支/带病/返聘/年岁/天赋）。
  GameEngine.prototype.getMaxActionPoints = function() {
    const s = this.state; const p = s && s.player;
    if (!p) return 3;
    const attrs = s.attrs || {};
    const h = s.hidden || {};
    let ap = 3;
    if ((attrs.body || 0) >= 6) ap += 1;            // 体质充沛，精力更足
    if ((h.mentalPressure || 0) > 70) ap -= 1;      // 长期高压透支
    if (p.flags && p.flags.chronicIllness) ap -= 1; // 慢性病拖累
    if (p.flags && p.flags.rehired) ap -= 1;        // 返聘老年精力弱
    if ((p.age || 0) >= 55) ap -= 1;                // P4：年过五十五，精力一年不如一年
    // P4 天赋精力区分：effects.apBonus（钢铁身心/钢铁意志 +1，家有病人 -1）
    if (Array.isArray(p.talents) && p.talents.length > 0 && typeof GameData !== 'undefined' && Array.isArray(GameData.talents)) {
      const talentById = this._talentById || (this._talentById = new Map(GameData.talents.map(t => [t.id, t])));
      for (const tid of p.talents) {
        const t = talentById.get(tid);
        if (t && t.effects && typeof t.effects.apBonus === 'number') ap += t.effects.apBonus;
      }
    }
    return Math.max(1, Math.min(5, ap));
  };

  // 年度重置：把当年 AP 补满至上限（在 runCareerYear/restYear 的年度重置段调用）。
  GameEngine.prototype.resetActionPoints = function() {
    const p = this.state && this.state.player;
    if (!p) return;
    p.maxActionPoints = this.getMaxActionPoints();
    p.actionPoints = p.maxActionPoints;
  };

  // 当前剩余 AP（兜底：字段缺失时按上限补齐，兼容旧档/初次进入）。
  GameEngine.prototype.getActionPoints = function() {
    const p = this.state && this.state.player;
    if (!p) return 0;
    if (typeof p.actionPoints !== 'number') {
      p.maxActionPoints = this.getMaxActionPoints();
      p.actionPoints = p.maxActionPoints;
    }
    return p.actionPoints;
  };

  GameEngine.prototype.canAffordAP = function(n) {
    const cost = Math.max(1, Math.floor(n || 1));
    return this.getActionPoints() >= cost;
  };

  // 消耗 AP：足够则扣减并返回 true，不足返回 false（不扣）。
  GameEngine.prototype.spendActionPoint = function(n) {
    const cost = Math.max(1, Math.floor(n || 1));
    const p = this.state && this.state.player;
    if (!p) return false;
    if (this.getActionPoints() < cost) return false;
    p.actionPoints = Math.max(0, this.getActionPoints() - cost);
    return true;
  };

  // ===== P2 事件密度：机会事件与微决策 =====
  // 机会事件：每年在筹划板浮现 2-3 个"可选支线"——玩家可花精力主动追查。
  // 候选来自既有事件池（复用 generateEvent 的全部资格门槛与动态权重），
  // 但优先本局未见、跨局低频的"盲区"事件；不绕过任何门槛，也不影响 headless 模拟（模拟从不追查）。

  // 捕获当前资格池（复用 generateEvent 的过滤+权重，诊断接口同款机制）。
  GameEngine.prototype._captureEligiblePool = function() {
    if (typeof this.generateEvent !== 'function') return [];
    const previous = this._captureEventPool;
    this._captureEventPool = true;
    try {
      const pool = this.generateEvent(true);
      return Array.isArray(pool) ? pool : [];
    } finally {
      this._captureEventPool = previous;
    }
  };

  // P3 时代背景波：按工龄轮转的当年时代主题（无波时返回 null）。
  GameEngine.prototype.getEraWave = function() {
    const era = typeof this.getEra === 'function' ? this.getEra() : null;
    if (!era || !Array.isArray(era.waves) || era.waves.length === 0) return null;
    const p = this.state && this.state.player;
    const idx = (p && Number.isFinite(p.yearsWorked)) ? p.yearsWorked % era.waves.length : 0;
    return era.waves[idx] || null;
  };

  // 事件是否命中时代波（阶段或效果键任一匹配）
  GameEngine.prototype._eventMatchesWave = function(e, wave) {
    if (!e || !wave) return false;
    if (wave.stage && e.stage === wave.stage) return true;
    if (Array.isArray(wave.effectKeys) && wave.effectKeys.length > 0) {
      const keys = wave.effectKeys;
      const hits = eff => eff && keys.some(k => eff[k] !== undefined);
      if (hits(e.effects)) return true;
      if (Array.isArray(e.choices) && e.choices.some(c => hits(c.effects))) return true;
    }
    return false;
  };

  // 当年机会候选（惰性生成、按年缓存）：返回事件定义数组。
  GameEngine.prototype.getOpportunities = function() {
    const s = this.state; const p = s && s.player;
    if (!p || !p.isEmployed) return [];
    if (s.pendingPromotion || s.pendingTransfer || s.currentEvent) return [];
    if ((s.opportunityYear === p.yearsWorked) && Array.isArray(s.opportunityIds)) {
      const defs = s.opportunityIds.map(id => (GameData.events || []).find(e => e && e.id === id)).filter(Boolean);
      if (defs.length > 0 || s.opportunityIds.length === 0) return defs;
    }
    const pool = this._captureEligiblePool();
    const counts = p.eventCounts || {};
    const candidates = pool.filter(e => {
      if (!e || !e.id || e.eventType !== 'choice' || !Array.isArray(e.choices) || e.choices.length === 0) return false;
      if (e.projectEvent || e.opinionCrisis || e.gambleDynamic) return false;
      if ((e.weight || 1) > 50) return false; // 超高权重事件已有专属引导通道，不占机会位
      return true;
    });
    // 盲区优先：本局未见 +60、跨局触发越少越靠前，再叠一层抖动防固定序列；命中时代波的机会 ×1.6
    const wave = this.getEraWave();
    candidates.forEach(e => {
      const times = counts[e.id] || 0;
      let score = 60 + Math.max(0, 30 - times * 15) + this.randf() * 40;
      if (wave && this._eventMatchesWave(e, wave)) score *= 1.6;
      e._oppScore = score;
    });
    candidates.sort((a, b) => b._oppScore - a._oppScore);
    const picked = candidates.slice(0, 3).map(e => e.id);
    candidates.forEach(e => { delete e._oppScore; });
    s.opportunityIds = picked;
    s.opportunityYear = p.yearsWorked;
    return picked.map(id => (GameData.events || []).find(e => e && e.id === id)).filter(Boolean);
  };

  // 追查机会：花 1 精力把机会事件置入 currentEvent（走既有事件面板与结算路径）。
  GameEngine.prototype.pursueOpportunity = function(id) {
    const s = this.state; const p = s && s.player;
    if (!p || !id) return { ok: false, code: 'NO_TARGET' };
    if (s.currentEvent) return { ok: false, code: 'SLOT_BUSY' };
    if (!Array.isArray(s.opportunityIds) || !s.opportunityIds.includes(id)) return { ok: false, code: 'EXPIRED' };
    if (!this.canAffordAP(1)) return { ok: false, code: 'NO_AP' };
    // 追查前复核资格（动作之后状态可能已变化，防止绕过门槛）
    const stillEligible = this._captureEligiblePool().some(e => e && e.id === id);
    const def = (GameData.events || []).find(e => e && e.id === id);
    if (!stillEligible || !def) {
      s.opportunityIds = s.opportunityIds.filter(x => x !== id);
      return { ok: false, code: 'INELIGIBLE' };
    }
    this.spendActionPoint(1);
    s.opportunityIds = s.opportunityIds.filter(x => x !== id);
    s.currentEvent = { ...def };
    p.flags.quietStreak = 0; // 追查算"有事件年"
    return { ok: true, event: s.currentEvent };
  };

  // ===== 敌人使绊微决策：伤害照常发生（与旧版数值一致），但给玩家一个回应窗口 =====
  // pendingMicro = { kind:'enemy', enemyName, hit:'risk'|'reputation'|'pressure', amount, year }
  GameEngine.prototype.resolveMicroResponse = function(mode) {
    const s = this.state; const p = s && s.player;
    const micro = s && s.pendingMicro;
    if (!micro || micro.kind !== 'enemy') return { ok: false, code: 'NO_MICRO' };
    const finish = (msg) => { s.pendingMicro = null; p.careerLog.push({ year: p.age, event: msg }); return { ok: true }; };
    if (mode === 'ignore') {
      return finish(`🕳️ 你选择不理会 ${micro.enemyName} 的小动作，日子照旧过`);
    }
    if (!this.canAffordAP(1)) return { ok: false, code: 'NO_AP' };
    const h = s.hidden;
    const recover = (amount, ratio) => {
      const back = Math.max(1, Math.round(amount * ratio));
      if (micro.hit === 'risk') h.risk = Math.max(0, (h.risk || 0) - back);
      else if (micro.hit === 'reputation') p.reputation = Math.min(100, (p.reputation || 50) + back);
      else if (micro.hit === 'pressure') h.mentalPressure = Math.max(0, (h.mentalPressure || 0) - back);
      return back;
    };
    const enemy = (p.contacts || []).find(c => c.enemy && c.name === micro.enemyName);
    const nudgeEnemy = (delta, note) => {
      if (!enemy) return;
      if (this.applyContactDelta) this.applyContactDelta(enemy, { relation: delta }, note);
      else enemy.relation = Math.max(-60, (enemy.relation || 0) + delta);
    };
    this.spendActionPoint(1);
    if (mode === 'clarify') {
      const chance = Math.min(0.85, 0.4 + (p.reputation || 50) / 250);
      if (this.randf() < chance) {
        const back = recover(micro.amount, 0.6);
        return finish(`🗣️ 你主动向组织说明了情况，${micro.enemyName} 的算计没能得逞（挽回 ${back}）`);
      }
      h.mentalPressure = Math.min(100, (h.mentalPressure || 0) + 2);
      return finish(`🗣️ 你找了组织说明，但时机不巧，没激起什么水花（压力+2）`);
    }
    if (mode === 'confront') {
      const chance = Math.min(0.85, 0.45 + (s.attrs.eq || 0) * 0.03);
      if (this.randf() < chance) {
        const back = recover(micro.amount, 1);
        nudgeEnemy(-10, '当面交涉');
        h.risk = Math.min(100, (h.risk || 0) + 1);
        return finish(`⚡ 你当面找 ${micro.enemyName} 把话挑明，对方收敛了不少（挽回 ${back}，关系-10，风险+1）`);
      }
      h.mentalPressure = Math.min(100, (h.mentalPressure || 0) + 4);
      nudgeEnemy(-4, '交涉破裂');
      return finish(`⚡ 交涉没谈拢，场面不太好看（压力+4，关系-4）`);
    }
    return { ok: false, code: 'UNKNOWN_MODE' };
  };
})();
