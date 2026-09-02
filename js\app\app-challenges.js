// app-challenges.js —— 跨周目挑战长廊（M5.3）
// 与成就（纯收集、即时判定）区分：挑战是明确的"多周目执行性目标"，带进度与连击语义，
// 在每局结算时推进（saveRecord 之后），无点数奖励（延续成就零奖励原则，不破坏 NG+ 平衡）。
// 存储：localStorage['gameChallenges']，随账号云同步（app-account.js global 块）。
Object.assign(App, {
  CHALLENGES: [
    { id: 'ch_clean_times', icon: '🕊️', title: '清风自有归处', desc: '累计 3 局达成清廉系结局（一代清官 / 清廉丰碑 / 清流砥柱）', kind: 'count', goal: 3, matchEndings: ['honest_official', 'clean', 'era_rectify'] },
    { id: 'ch_grassroots_times', icon: '🌾', title: '此心安处是吾乡', desc: '累计 3 局达成基层系结局（乡土守望 / 基层奉献 / 乡村振兴之星 / 桑梓情深）', kind: 'count', goal: 3, matchEndings: ['grassroots', 'grassroots_devotion', 'rural_star', 'hometown_net'] },
    { id: 'ch_central', icon: '🏛️', title: '登堂入室', desc: '达成 1 次中央殿堂结局', kind: 'once', matchEndings: ['central'] },
    { id: 'ch_edge_times', icon: '📋', title: '刀尖上起舞', desc: '累计 2 局达成边缘化结局（另类收集）', kind: 'count', goal: 2, matchEndings: ['edge'] },
    { id: 'ch_wealth', icon: '💰', title: '家底殷实', desc: '累计 3 局结算时财富 ≥ 450', kind: 'count', goal: 3, evalRun: p => Math.round(p.wealth || 0) >= 450 },
    { id: 'ch_projects', icon: '📋', title: '实干兴邦', desc: '单局完成全部 3 个政策项目', kind: 'once', evalRun: p => (p.flags && p.flags.policyProjectCount) >= 3 },
    { id: 'ch_hardcore', icon: '🔥', title: '如履薄冰', desc: '累计 3 局硬核难度上岸', kind: 'count', goal: 3, evalRun: (p, record) => !!(record && record.difficulty === 'hardcore' && record.passed) },
    { id: 'ch_longevity', icon: '⏳', title: '岁月如歌', desc: '跨周目累计工作 200 个年度', kind: 'count', goal: 200, cumulative: true, evalRun: (p, record, stats) => (stats && stats.totalYears) || 0 },
    { id: 'ch_streak_clean', icon: '🔁', title: '清官连任', desc: '连续 3 局达成清廉系结局（中断即归零）', kind: 'streak', goal: 3, matchEndings: ['honest_official', 'clean', 'era_rectify'] }
  ],

  // v2.1.76 挑战局内进度提示：返回"跨局进度最接近完成且未完成"的一项（无进行中挑战时为 null）
  challengeProgressHint() {
    try { this.loadChallenges(); } catch (e) { return null; }
    const c = this.challenges || {};
    let best = null, bestRatio = 0;
    for (const ch of this.CHALLENGES) {
      if (!ch.goal) continue;
      const cur = Number(c[ch.id]) || 0;
      if (cur >= ch.goal) continue; // 已完成的不提示
      const ratio = cur / ch.goal;
      if (ratio > bestRatio) { bestRatio = ratio; best = { hint: ch, cur }; }
    }
    return best ? { id: best.hint.id, icon: best.hint.icon, title: best.hint.title, desc: best.hint.desc, cur: best.cur, goal: best.hint.goal } : null;
  },

  // 从 localStorage 载入挑战进度（app.js 引导时已初始化，此处兜底）
  loadChallenges() {
    if (!this.challenges) {
      try { this.challenges = JSON.parse(localStorage.getItem('gameChallenges') || 'null') || {}; }
      catch (e) { this.challenges = {}; }
    }
    return this.challenges;
  },
  saveChallenges() {
    try { localStorage.setItem('gameChallenges', JSON.stringify(this.challenges || {})); }
    catch (e) { /* 存储满时不阻断结算 */ }
  },

  // 结算时推进挑战进度（须在 saveRecord 之后调用，record 用 p 现场推导）
  // 返回本局新达成的挑战列表（供结算页展示）；连胜型挑战在未命中时归零
  evaluateChallenges(p, h) {
    if (!p || typeof this.loadChallenges !== 'function') return [];
    const c = this.loadChallenges();
    const difficulty = p.difficulty || (typeof engine !== 'undefined' && engine.getState ? engine.getState().difficulty : null) || 'standard';
    const record = { ending: p.ending || null, difficulty: difficulty, passed: !!p.passed };
    const newly = [];
    for (const ch of this.CHALLENGES) {
      if (!ch || !ch.id) continue;
      const st = c[ch.id] || (c[ch.id] = { cur: 0, done: false });
      if (st.done) continue;
      const hit = ch.matchEndings
        ? ch.matchEndings.indexOf(record.ending) >= 0
        : (typeof ch.evalRun === 'function' ? !!ch.evalRun(p, record, this.stats || {}) : false);
      if (!hit) {
        if (ch.kind === 'streak') st.cur = 0;
        continue;
      }
      if (ch.kind === 'once') {
        st.done = true;
      } else if (ch.cumulative) {
        const total = typeof ch.evalRun === 'function' ? (Number(ch.evalRun(p, record, this.stats || {})) || 0) : st.cur;
        st.cur = Math.min(ch.goal, Math.max(st.cur, total));
        if (st.cur >= ch.goal) st.done = true;
      } else {
        st.cur = Math.min(ch.goal, (st.cur || 0) + 1);
        if (st.cur >= ch.goal) st.done = true;
      }
      if (st.done && !c[ch.id].notified) {
        c[ch.id].notified = true;
        newly.push(ch);
      }
    }
    this.saveChallenges();
    return newly;
  },

  // 🎯 挑战长廊面板：九项跨周目目标 + 进度
  showChallenges() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('codex', { sync: false });
    if (typeof this.setTopBarTitle === 'function') this.setTopBarTitle('挑战长廊');
    const c = this.loadChallenges();
    const doneCount = this.CHALLENGES.filter(ch => c[ch.id] && c[ch.id].done).length;
    const rows = this.CHALLENGES.map(ch => {
      const st = c[ch.id] || { cur: 0, done: false };
      const pct = ch.goal ? Math.min(100, Math.round((st.cur / ch.goal) * 100)) : (st.done ? 100 : 0);
      const progressText = ch.kind === 'once' ? (st.done ? '✅ 已完成' : '❓ 未达成') : `${Math.min(st.cur, ch.goal)} / ${ch.goal}${ch.kind === 'streak' ? ' 连' : ''}`;
      return `
        <div class="stat-item" style="align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--parchment-dark)">
          <span style="font-weight:700;color:var(--vermilion);min-width:120px;white-space:normal">${ch.icon} ${this.escapeHtml(ch.title)}${st.done ? ' <span style="color:var(--ui-green)">✅</span>' : ''}</span>
          <span style="text-align:right;font-size:11px;color:var(--ink-lighter);max-width:200px">${progressText}</span>
          <div style="flex-basis:100%;height:8px;background:var(--parchment-dark);border-radius:4px;overflow:hidden;margin-top:4px">
            <div style="height:100%;width:${pct}%;background:${st.done ? 'linear-gradient(90deg,var(--ui-green),#43A047)' : 'linear-gradient(90deg,var(--ui-blue),var(--vermilion))'};border-radius:4px"></div>
          </div>
          <p style="flex-basis:100%;font-size:11px;color:var(--ink-light);margin:3px 0 0">${this.escapeHtml(ch.desc)}</p>
        </div>`;
    }).join('');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>🎯</span><p>挑战长廊 — 跨周目目标 · 已达成 ${doneCount}/${this.CHALLENGES.length}</p></div>
        <div class="stats-card">
          <div class="stat-item"><span>📈 总进度</span><span>${doneCount}/${this.CHALLENGES.length}（${Math.round(doneCount / this.CHALLENGES.length * 100)}%）</span></div>
          <div style="height:8px;background:var(--parchment-dark);border-radius:4px;overflow:hidden;margin-top:10px">
            <div style="height:100%;width:${Math.round(doneCount / this.CHALLENGES.length * 100)}%;background:linear-gradient(90deg,var(--ui-blue),var(--vermilion));border-radius:4px"></div>
          </div>
          <p style="font-size:11px;color:var(--ink-lighter);margin-top:8px">挑战进度在每局结算时自动推进（跨周目累计，账号云存档随全局数据同步）。连续类挑战中断即归零。</p>
        </div>
        ${rows}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  }
});
