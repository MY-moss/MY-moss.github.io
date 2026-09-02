// app-daily-challenge.js —— L4 社交功能（v2.1.53）
//   L4.1 成就分享增强：buildShareText 生成结构化分享文本（结局/评分/成就/挑战/图鉴），结算/成就/统计页可复制
//   L4.2 排行榜系统：本机历史局按分数排行（gameHistory 数据源，离线可用）
//   L4.3 相同种子挑战：每日固定种子（服务端 /api/challenge/today，离线降级为本地同算法），
//        开局注入种子 RNG，结算自动上报成绩并展示公开榜单
Object.assign(App, {
  // —— L4.1 分享文本（结构稳定、纯文本、可复制粘贴） ——
  buildShareText(p, h) {
    if (!p) return '';
    const names = this.ENDING_NAMES; // v2.1.56 结局名单一来源（App.ENDING_NAMES）
    const score = Math.round(this.calculateFinalScore ? this.calculateFinalScore(p, h) : (p.score || 0));
    const endingsGot = Object.keys((this.stats && this.stats.endings) || {}).length;
    const endingTotal = (this.ALL_ENDINGS || []).length || 27;
    const lines = [
      '🏛️ 上岸模拟器 · 仕途结算',
      '结局：' + (names[p.ending] || p.ending || '未定'),
      '评分：' + score + ' 分',
      '职级：' + (engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : ('R' + p.leadershipRank)) + ' · 晋升 ' + (p.promotions || 0) + ' 次 · 工龄 ' + (p.yearsWorked || 0) + ' 年',
      '图鉴结局收集：' + endingsGot + '/' + endingTotal + ' · 历局 ' + ((this.stats && this.stats.plays) || 0) + ' 局'
    ];
    return lines.join('\n');
  },
  copyShareText(p, h) {
    const text = this.buildShareText(p, h);
    if (!text) return;
    const done = () => this.showToast ? this.showToast('分享文本已复制', 'success') : null;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => this.showToast && this.showToast('复制失败，请手动选择文本', 'warning'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* 忽略 */ }
      document.body.removeChild(ta);
    }
    return text;
  },

  // —— L4.1+ 分享图导出（v2.1.56：零依赖 canvas 绘制，结算/统计/成就页可用） ——
  exportShareImage(p, h) {
    if (!p || typeof document === 'undefined') return;
    const score = Math.round(this.calculateFinalScore ? this.calculateFinalScore(p, h) : (p.score || 0));
    const names = this.ENDING_NAMES || {};
    const ending = names[p.ending] || p.ending || '仕途进行中';
    const W = 640, H = 420;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    // 羊皮纸底 + 卷宗题头
    ctx.fillStyle = '#FAF6EE'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#F1E9D6'; ctx.fillRect(0, 0, W, 88);
    ctx.strokeStyle = '#8B1D1D'; ctx.lineWidth = 4; ctx.strokeRect(8, 8, W - 16, H - 16);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#8B1D1D'; ctx.font = 'bold 22px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText('上岸模拟器 · 仕途结算', W / 2, 54);
    // 结局名
    ctx.fillStyle = '#5C4A1E'; ctx.font = 'bold 38px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText(ending, W / 2, 168);
    // 评分
    ctx.fillStyle = '#8B1D1D'; ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText(score + ' 分', W / 2, 245);
    // 关键数值
    const rankLabel = (typeof engine !== 'undefined' && engine.getRankLabel) ? engine.getRankLabel(p.leadershipRank) : ('R' + (p.leadershipRank || 0));
    ctx.fillStyle = '#5E5E5E'; ctx.font = '16px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText((p.unit ? p.unit.name + ' · ' : '') + rankLabel + ' · 晋升 ' + (p.promotions || 0) + ' 次 · 工龄 ' + (p.yearsWorked || 0) + ' 年', W / 2, 296);
    // 图鉴水印 + 落款
    const endingsGot = Object.keys((this.stats && this.stats.endings) || {}).length;
    const endingTotal = (this.ALL_ENDINGS || []).length || 27;
    ctx.fillStyle = '#8A8A8A'; ctx.font = '14px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText('图鉴结局 ' + endingsGot + '/' + endingTotal + ' · 历局 ' + ((this.stats && this.stats.plays) || 0), W / 2, H - 56);
    ctx.fillText('—— 上岸模拟器 ——', W / 2, H - 32);
    canvas.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'shangan-share.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      if (this.showToast) this.showToast('分享图已导出', 'success');
    }, 'image/png');
  },

  // —— L4.2 本机排行榜（按通关分数，gameHistory 数据源） ——
  showLeaderboard() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('stats', { sync: false });
    if (typeof this.setTopBarTitle === 'function') this.setTopBarTitle('排行榜');
    const history = this.gameHistory || [];
    const rows = history.filter(item => item && typeof item.score === 'number').sort((a, b) => b.score - a.score || (b.age || 0) - (a.age || 0)).slice(0, 10);
    const endingNamesLoc = this.ENDING_NAMES; // v2.1.56 结局名单一来源
    const listHtml = rows.length ? rows.map((item, index) => `
      <div class="stat-item">
        <span>${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1) + '.'} ${this.escapeHtml(item.name || '无名')}</span>
        <span style="font-size:11px;color:var(--ink-light)">${endingNamesLoc[item.ending] || this.escapeHtml(item.ending || '未完成')} · ${this.escapeHtml(item.rankLabel || (item.leadershipRank || 0) + '级')}</span>
        <span style="font-weight:700;color:var(--gold-dark)">${item.score} 分</span>
      </div>`).join('')
      : '<p style="text-align:center;padding:30px;color:var(--ink-lighter)">暂无记录，完成一局游戏后自动入榜</p>';
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>🏆</span><p>本机排行榜 — 历局最高 ${rows.length ? rows[0].score : 0} 分（${(this.stats && this.stats.plays) || 0} 局记录）</p></div>
        <div class="stats-card">${listHtml}</div>
        <p style="font-size:11px;color:var(--ink-lighter);margin-top:8px">榜单来自本机历史记录（最多 20 条，新纪录自动覆盖旧局）；每日种子挑战榜单见"今日挑战"。</p>
        <div class="sticky-action"><button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button></div>
      </div>`);
  },

  // —— L4.3 相同种子挑战 ——
  challengeSeedFor(dateStr) {
    let x = 2166136261 >>> 0;
    for (let i = 0; i < dateStr.length; i++) { x ^= dateStr.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    return (x ^ (x >>> 13)) >>> 0;
  },
  _seededRng(seed) {
    let state = seed >>> 0;
    return function rng() {
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  applyChallengeSeed(seed) {
    if (this._challengeSeedActive) return;
    this._challengeOriginalRandom = Math.random;
    Math.random = this._seededRng(seed || this.challengeSeedFor(new Date().toISOString().slice(0, 10)));
    this._challengeSeedActive = true;
  },
  clearChallengeSeed() {
    if (!this._challengeSeedActive) return;
    Math.random = this._challengeOriginalRandom || Math.random;
    this._challengeSeedActive = false;
  },
  isChallengeRun() {
    return !!this._challengeRun;
  },
  startDailyChallenge(seed, date) {
    this.applyChallengeSeed(seed);
    this._challengeRun = { date: date || new Date().toISOString().slice(0, 10), seed: seed, submitted: false };
    // 全新一局：清引擎、复位会话守卫，从建档开始（种子已注入，开局天赋/单位分布与本日所有玩家一致）
    if (typeof engine !== 'undefined' && engine.reset) engine.reset();
    this._recordedRun = false;
    this._codexMerged = false;
    this.render && this.render();
    this.updateStatus && this.updateStatus();
  },
  // 结算上报：仅挑战局调用（fire-and-forget，失败静默）
  submitChallengeResult(p, h, finalScore) {
    if (!this.isChallengeRun() || !this._challengeRun.date || this._challengeRun.submitted) return;
    this._challengeRun.submitted = true;
    if (this.isStaticBuild && this.isStaticBuild()) {
      this.clearChallengeSeed();
      return;
    }
    const playerId = this.getPlayerId ? this.getPlayerId() : 'challenge-player';
    const payload = { playerId: playerId, date: this._challengeRun.date, seed: this._challengeRun.seed, score: Math.round(finalScore || 0), ending: p.ending || 'unknown', name: (p.name || '匿名干部').slice(0, 20) };
    try {
      fetch('/api/challenge/result', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => { /* 离线静默 */ });
    } catch (e) { /* 离线静默 */ }
    this.clearChallengeSeed();
  },
  showDailyChallenge() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('stats', { sync: false });
    if (typeof this.setTopBarTitle === 'function') this.setTopBarTitle('今日挑战');
    const render = (info) => {
      this.renderContent(`
        <div class="stage fade-in">
          <div class="lead"><span>🎯</span><p>今日挑战 — 相同种子，各路玩法</p></div>
          <div class="stats-card">
            <div class="stat-item"><span>📋 日期</span><span>${this.escapeHtml(info.date)}</span></div>
            <div class="stat-item"><span>📝 随机种子</span><span>${info.seed}（本日全球玩家共用）</span></div>
            <div class="stat-item"><span>📊 难度</span><span>${this.escapeHtml(info.difficulty || 'standard')}</span></div>
            <p style="font-size:11px;color:var(--ink-lighter);margin-top:8px">开局后天赋、报考单位与全部随机走势与同日出战者完全一致——比的是同一命运下的经营水平。挑战局结算自动上报分数，榜单公开。</p>
            ${this.isChallengeRun() ? '<p style="font-size:12px;color:var(--vermilion);margin-top:6px">🔁 今日挑战已在进行中（结算时自动上报）。</p>' : ''}
          </div>
          <div id="challenge-leaderboard" class="stats-card" style="margin-top:12px"><div class="empty-state">榜单加载中…</div></div>
          <div class="sticky-action">
            <button class="btn btn-primary" onclick="App.startDailyChallenge(${info.seed}, '${this.escapeHtml(info.date)}')">🚀 开始今日挑战</button>
            <button class="btn btn-secondary" onclick="App.returnToCurrentFlow()" style="margin-top:8px">返回当前流程</button>
          </div>
        </div>`);
      if (this.isStaticBuild && this.isStaticBuild()) {
        const box = document.getElementById('challenge-leaderboard');
        if (box) box.innerHTML = '<p class="empty-state">静态版可进行本地挑战，公开榜单需要服务器版。</p>';
      } else this.loadChallengeLeaderboard(info.date);
    };
    const today = new Date().toISOString().slice(0, 10);
    if (this.isStaticBuild && this.isStaticBuild()) {
      render({ date: today, seed: this.challengeSeedFor(today), difficulty: 'standard' });
      return;
    }
    try {
      fetch('/api/challenge/today')
        .then(response => response.ok ? response.json() : Promise.reject(new Error('bad status')))
        .then(data => render({ date: data.date || today, seed: Number(data.seed) || this.challengeSeedFor(today), difficulty: data.difficulty || 'standard' }))
        .catch(() => render({ date: today, seed: this.challengeSeedFor(today), difficulty: 'standard' }));
    } catch (e) {
      render({ date: today, seed: this.challengeSeedFor(today), difficulty: 'standard' });
    }
  },
  loadChallengeLeaderboard(date) {
    const box = document.getElementById('challenge-leaderboard');
    if (!box) return;
    const names = { skyline: '巅峰', fast: '快速', safe: '安稳', ordinary: '平凡', edge: '边缘', arrest: '被抓', burnout: '燃尽', central: '中央', reform: '改革', digital: '数字', grassroots: '乡土', clean: '清廉', grassroots_devotion: '基层', tech_backbone: '骨干', people_champion: '贴心' };
    const renderRows = (data) => {
      const rows = data && data.leaderboard || [];
      box.innerHTML = rows.length
        ? '<b style="font-size:12px;margin-bottom:4px;display:block">🏆 本日公开榜（同种子）</b>' + rows.map((row, index) => `
            <div class="stat-item"><span>${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1) + '.'} ${this.escapeHtml(row.name || '匿名干部')}</span>
            <span style="font-size:11px;color:var(--ink-light)">${names[row.ending] || this.escapeHtml(row.ending || '')}</span>
            <span style="font-weight:700;color:var(--gold-dark)">${row.score} 分</span></div>`).join('')
        : '<p class="empty-state">今日还没有人上榜——拿下第一个名字吧</p>';
    };
    try {
      fetch('/api/challenge/leaderboard?date=' + encodeURIComponent(date || ''))
        .then(response => response.ok ? response.json() : Promise.reject(new Error('bad status')))
        .then(renderRows)
        .catch(() => { box.innerHTML = '<p class="empty-state">榜单暂不可用（离线模式可先挑战，联网后自动补报）</p>'; });
    } catch (e) {
      box.innerHTML = '<p class="empty-state">榜单暂不可用</p>';
    }
  }
});
