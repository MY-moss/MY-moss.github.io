// 存档、历史记录、备份与导入导出模块。
// 依赖：app-core.js 提供基础 UI；方法名保持 App 公开契约不变。

Object.assign(App, {

  // 所有长期状态变更统一从这里落本地存档。engine.saveState() 仍保留 boolean 兼容返回值。
  saveCheckpoint(reason, options) {
    const opts = options || {};
    let ok = false;
    let error = null;
    try {
      ok = engine.saveState(this.currentSlot);
      const engineStatus = typeof engine.getPersistenceStatus === 'function' ? engine.getPersistenceStatus() : null;
      error = engineStatus && engineStatus.error ? engineStatus.error : null;
      this._persistenceStatus = {
        state: ok ? 'saved' : 'failed',
        reason: String(reason || 'state-change').slice(0, 80),
        at: Date.now(),
        error: error,
        origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown'
      };
      if (!ok && !opts.silent && typeof this.showToast === 'function') {
        this.showToast('本地存档失败，请立即导出备份', 'error');
      }
      if (ok && typeof this.updatePersistenceStatus === 'function') this.updatePersistenceStatus();
      if (ok && typeof this.scheduleCloudSync === 'function') this.scheduleCloudSync();
      return ok;
    } catch (e) {
      this._persistenceStatus = { state: 'failed', reason: String(reason || 'state-change').slice(0, 80), at: Date.now(), error: { code: 'STORAGE_UNAVAILABLE', message: String(e.message || e).slice(0, 160) }, origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown' };
      if (!opts.silent && typeof this.showToast === 'function') this.showToast('本地存档失败，请立即导出备份', 'error');
      return false;
    }
  },
  getPersistenceStatus() {
    if (this._persistenceStatus) return { ...this._persistenceStatus, error: this._persistenceStatus.error ? { ...this._persistenceStatus.error } : null };
    return { state: 'unknown', reason: '', at: 0, error: null, origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown' };
  },
  updatePersistenceStatus() {
    const el = document && document.getElementById ? document.getElementById('persistence-status') : null;
    if (!el) return;
    const s = this.getPersistenceStatus();
    el.textContent = s.state === 'saved' ? '本地已保存' : s.state === 'failed' ? '保存失败 · 请导出备份' : '等待保存';
    el.dataset.state = s.state;
    el.title = s.origin && s.origin !== 'unknown' ? '存档来源：' + s.origin : '';
  },

saveRecord(p, h) {
    // 会话内防重复：加载旧结局存档/重复查看结局不重复计数
    if (this._recordedRun) return;
    this._recordedRun = true;
    const record = {
      id: Date.now(),
      name: p.name,
      gender: p.gender,
      unit: p.unit ? p.unit.name : '无',
      unitLevel: p.unit ? p.unit.level : '无',
      ending: p.ending || '未完成',
      age: p.age,
      ageOnshore: p.ageOnshore || 0,
      yearsWorked: p.yearsWorked,
      promotions: p.promotions,
      leadershipRank: p.leadershipRank,
      rankLabel: engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级',
      unitUpgrades: p.unitUpgrades || 0,
      score: p.totalScore || 0,
      passed: p.passed,
      background: p.background ? p.background.name : '未知',
      major: p.major ? p.major.name : '未知',
      finalAttrs: { ...engine.getAttrs() },
      finalHidden: { ...h },
      talentCount: p.talents.length,
      difficulty: engine.getState().difficulty || 'standard', // v2.58 记录增强：历史记录/统计可按难度与时代分析
      era: engine.getState().era || '',
      scenarioId: engine.getState().scenarioId || 'classic', // 特殊剧本统计与历史回看
      // v2.1.18 M2.5 事件历史回看：存压缩版年度轨迹（年份/事件/职级/压力/声誉），历史详情可回看人生
      // 压缩策略：只保留含 year 的条目 + 关键字段，40 年生涯约 4KB/局，20 局约 80KB（localStorage 安全）
      careerLog: (p.careerLog || [])
        .filter(l => l && typeof l.year === 'number')
        .map(l => ({ y: l.year, e: String(l.event || '平静的一年').slice(0, 60), r: l.leadershipRank, m: typeof l.mentalPressure === 'number' ? l.mentalPressure : null, p: typeof l.reputation === 'number' ? l.reputation : null })),
    };
    this.gameHistory.unshift(record);
    if (this.gameHistory.length > 20) this.gameHistory.length = 20;
    try { localStorage.setItem('gameHistory', JSON.stringify(this.gameHistory)); } catch (e) { this._persistenceStatus = { state: 'failed', reason: 'history', at: Date.now(), error: { code: 'STORAGE_QUOTA', message: '历史记录写入失败' }, origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown' }; }
    // 更新全局统计
    this.stats.plays++;
    if (p.passed) this.stats.passes++;
    this.stats.totalYears += p.yearsWorked || 0;
    this.stats.totalPromos += p.promotions || 0;
    if (p.ending) { this.stats.endings = this.stats.endings || {}; this.stats.endings[p.ending] = (this.stats.endings[p.ending] || 0) + 1; }
    const score = this.calculateFinalScore(p, h);
    if (score > this.stats.bestScore) this.stats.bestScore = score;
    try { localStorage.setItem('gameStats', JSON.stringify(this.stats)); } catch (e) { this._persistenceStatus = { state: 'failed', reason: 'stats', at: Date.now(), error: { code: 'STORAGE_QUOTA', message: '统计写入失败' }, origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown' }; }
    this.saveCheckpoint('ending-record', { silent: true });
  },
  loadGame(slot) {
    this.currentSlot = slot; // v2.67 修复：原未同步 currentSlot——读档后槽位 1/2 的保存时间显示错误（v2.58 只修了显示侧）
    if (engine.loadState(slot)) {
      const phase = engine.getPhase();
      const p = engine.getPlayer();
      // 读档继续游玩：重置会话统计守卫（本局结局应正常记录）
      this._recordedRun = false;
      this._codexMerged = false;
      // 兼容旧存档：笔试/面试阶段题目为空则重新生成
      if ((phase === 'written' || phase === 'interview') && (!engine.getState().examQuestions || engine.getState().examQuestions.length === 0)) {
        const diff = engine.getState().difficulty;
        if (phase === 'written' || diff === 'speedrun') { engine.generateWrittenExam(); }
        if (phase === 'interview') { engine.generateInterview(); }
      }
      this.render();
      this.updateStatus();
      if (p.ending) {
        this.renderContent(this.renderEnding());
      } else if (phase === 'career' || phase === 'event') {
        this.afterCareerStep();
      } else if (phase === 'result') {
        this.renderContent(this.renderResult());
      } else if (phase === 'written') {
        this.renderContent(this.renderWritten());
      } else if (phase === 'interview') {
        this.renderContent(this.renderInterview());
      } else if (phase === 'background') {
        const bg = p.background || engine.rollBackground();
        this.renderContent(this.renderBackground(bg));
      } else if (phase === 'era') {
        this.renderContent(this.renderEra());
      } else if (phase === 'major') {
        this.renderContent(this.renderMajor());
      } else if (phase === 'talents') {
        this.renderContent(this.renderTalents());
      } else if (phase === 'personality') {
        this.renderContent(this.renderPersonality());
      } else if (phase === 'attrs') {
        this.renderContent(this.renderAttrs());
      } else if (phase === 'units') {
        this.renderContent(this.renderUnits());
      }
      this.showToast('存档已加载', 'success');
    } else {
      this.showToast('存档加载失败', 'error');
    }
  },
  deleteSave(slot) {
    engine.deleteSave(slot);
    engine.reset();
    this.render();
    this.updateStatus();
  },
  confirmDeleteSave(slot) {
    const info = engine.getSaveInfo(slot);
    const name = info && info.name ? info.name : '此存档';
    App.confirmAction(`确定要删除存档「${name}」吗？删除后不可恢复。`, () => {
      this.deleteSave(slot);
      this.showToast(`已删除存档「${name}」`, 'success');
    });
  },
  useSlot(slot) {
    this.currentSlot = slot || 0;
    engine.currentSaveSlot = this.currentSlot;
    engine.deleteSave(slot);
    engine.reset();
    this._recordedRun = false;
    this._codexMerged = false;
    this.render();
    this.updateStatus();
  },
  // 📦 备份数据：下载备份文件
  exportAll() {
    const payload = this.collectAllData();
    if (!payload) return;
    this.downloadSave(this.buildBackupText(payload), '全量备份');
  },
  collectAllData() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('shangan') || k.startsWith('game') || k === 'sound_on');
    if (keys.length === 0) { this.showToast('当前没有可备份的数据', 'warning'); return null; }
    const data = {};
    for (const k of keys) data[k] = localStorage.getItem(k);
    return { v: 1, time: Date.now(), data };
  },
  buildBackupText(payload) {
    return '上岸模拟器全量备份:' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  },
  parseBackupText(text) {
    const t = String(text || '').trim();
    if (!t) return null;
    const b64 = t.includes('上岸模拟器全量备份:') ? t.split('上岸模拟器全量备份:')[1].trim() : t.trim();
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(b64))));
      return (payload && payload.data) ? payload : null;
    } catch(e) { return null; }
  },
  applyBackup(payload, btn) {
    let count = 0;
    for (const [k, v] of Object.entries(payload.data)) {
      try { localStorage.setItem(k, v); count++; } catch(e) {}
    }
    const overlay = btn ? btn.closest('.menu-overlay') : document.querySelector('.menu-overlay');
    if (overlay && typeof this.closeMenu === 'function') this.closeMenu();
    else if (overlay) overlay.remove();
    this.showToast('✅ 已恢复 ' + count + ' 项数据，即将刷新', 'success');
    setTimeout(() => location.reload(), 800);
  },
  // 🔄 恢复数据：选择备份文件
  importAll() {
    this.restoreFromFile(null);
  },
  // 💾 从文件恢复
  restoreFromFile(btn) {
    const overlay = btn ? btn.closest('.menu-overlay') : null;
    if (overlay && typeof this.closeMenu === 'function') this.closeMenu();
    else if (overlay) overlay.remove();
    App.confirmAction('将从备份文件恢复，当前数据会被覆盖。确定继续？', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.json';
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const payload = this.parseBackupText(String(reader.result || ''));
          if (!payload) { this.showToast('备份文件无效或已损坏', 'error'); return; }
          this.applyBackup(payload, null);
        };
        reader.readAsText(file);
      };
      input.click();
    });
  },
  // 📤 导出存档（下载文件）
  exportSave() {
    const b64 = engine.exportSave(this.currentSlot);
    if (!b64) { this.showToast('当前没有存档可导出', 'warning'); return; }
    this.downloadSave('上岸模拟器存档:' + b64, '存档');
  },
  downloadSave(text, label) {
    label = label || '存档';
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '上岸模拟器' + label + '_' + new Date().toISOString().slice(0, 10) + '.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      this.showToast(label + '已下载为文件', 'success');
    } catch(e) { this.showToast('导出失败', 'error'); }
  },
  // 📥 导入存档（选择文件）
  importSave() {
    const slot = this.currentSlot || 0;
    App.confirmAction('将从存档文件恢复当前存档位，现有存档会被覆盖。确定继续？', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.json';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || '').trim();
        if (!text) { this.showToast('文件内容为空', 'error'); return; }
        const b64 = text.includes('上岸模拟器存档:') ? text.split('上岸模拟器存档:')[1].trim() : text.trim();
        const res = engine.importSave(b64, slot);
        if (res.ok) {
          // 导入存档继续游玩：重置会话统计守卫（本局结局应正常记录）
          this._recordedRun = false;
          this._codexMerged = false;
          this.render();
          this.updateStatus();
          this.saveCheckpoint('save-import', { silent: true });
          this.showToast(res.msg, 'success');
          // 跳转到对应阶段
          const phase = engine.getPhase();
          const p = engine.getPlayer();
          if (phase === 'career' || phase === 'event') this.afterCareerStep();
          else if (p.ending) this.renderContent(this.renderEnding());
          else if (phase === 'result') this.renderContent(this.renderResult());
          else if (phase === 'written') this.renderContent(this.renderWritten());
          else if (phase === 'interview') this.renderContent(this.renderInterview());
        } else {
          this.showToast(res.msg, 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
    });
  },
});

// 页面切后台/关闭前再落一次当前检查点。只使用同步 localStorage，避免异步请求阻塞离开页面。
(function bindPersistenceLifecycle() {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  const flush = () => { try { if (typeof App !== 'undefined' && App.saveCheckpoint) App.saveCheckpoint('page-lifecycle', { silent: true }); } catch (e) {} };
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  }
})();
