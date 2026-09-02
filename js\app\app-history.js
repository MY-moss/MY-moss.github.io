// 游戏历史、历史详情与人生年鉴模块。
// 依赖：app-core.js 提供 gameHistory、renderContent、escapeHtml、confirmAction。
// v2.1.69：结局中文名统一引用 App.ENDING_NAMES 权威表；emoji 装饰独立于此表（名字与装饰分离）。
const ENDING_EMOJI = { skyline: '🚀', fast: '⭐', safe: '🛡️', edge: '📋', ordinary: '📄', arrest: '⚖️', burnout: '💀', exam_fail: '📝' };
Object.assign(App, {
  showHistory() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('history', { sync: false });
    const history = this.gameHistory;
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📊</span><p>游戏历史记录（点击卡片查看详情）</p></div>
        ${history.length === 0 ? '<p style="text-align:center;padding:40px;color:var(--ink-lighter)">暂无记录，完成一局游戏后自动保存</p>' : 
          history.map((h, i) => {
            const unitName = h.unit || '无';
            const rankLabel = h.rankLabel || (h.leadershipRank ? h.leadershipRank + '级' : '无');
            const endingLabel = (ENDING_EMOJI[h.ending] || '') + (this.ENDING_NAMES[h.ending] || this.escapeHtml(h.ending) || '未完成'); // v2.1.69 名字引用权威表 + emoji 装饰
            return `
            <button type="button" class="history-card" onclick="App.showHistoryDetail(${i})" aria-label="查看第${i + 1}局历史记录">
              <div class="history-header">#${i + 1} · ${this.escapeHtml(h.name) || '无名'} · ${this.escapeHtml(unitName)} · ${endingLabel}</div>
              <div class="history-details">
                <span>年龄: ${h.age || '?'}岁</span>
                <span>职级: ${this.escapeHtml(rankLabel)}</span>
                <span>晋升: ${h.promotions || 0}次</span>
                <span>背景: ${this.escapeHtml(h.background || '未知')}</span>
              </div>
            </button>`;
          }).join('')}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button class="btn btn-secondary" onclick="App.clearHistory()" style="margin-top:8px">清空历史记录</button>
        </div>
      </div>
    `);
  },
  showHistoryDetail(index) {
    const h = this.gameHistory[index];
    if (!h) return;
    const rankLabel = h.rankLabel || (h.leadershipRank ? h.leadershipRank + '级' : '无');
    const unitName = h.unit || '无';
    const endingText = (ENDING_EMOJI[h.ending] || '') + (this.ENDING_NAMES[h.ending] || h.ending || '未完成'); // v2.1.69 名字引用权威表 + emoji 装饰
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📋</span><p>${this.escapeHtml(h.name) || '无名'} · 游戏回顾</p></div>
        <div class="ending-summary">
          <h3>${this.escapeHtml(endingText)}</h3>
          <div class="summary-grid">
            <div><span>姓名</span><span>${this.escapeHtml(h.name) || '无名'}</span></div>
            <div><span>单位</span><span>${this.escapeHtml(unitName)}</span></div>
            <div><span>最高职级</span><span>${this.escapeHtml(rankLabel)}</span></div>
            <div><span>晋升次数</span><span>${h.promotions || 0}次</span></div>
            <div><span>工作年限</span><span>${h.yearsWorked || 0}年</span></div>
            <div><span>享年</span><span>${h.age || '?'}岁</span></div>
            <div><span>上岸年龄</span><span>${h.ageOnshore || 0}岁</span></div>
            <div><span>跨级升迁</span><span>${h.unitUpgrades || 0}次</span></div>
            <div><span>最终平台</span><span>${this.escapeHtml(h.unitLevel || '无')}</span></div>
            <div><span>总得分</span><span>${h.score || 0}分</span></div>
          </div>
        </div>
        ${(() => {
          // v2.1.18 M2.5 事件历史回看：已存压缩 careerLog 的历史记录展示年度轨迹
          const cl = h.careerLog;
          if (!cl || cl.length === 0) return '';
          const maxShow = 40;
          const shown = cl.slice(-maxShow);
          // 关键节点筛选：职级变化/单位变化由引擎快照缺失时用事件关键词
          const keyEv = (s) => /晋升|提拔|调任|升任|处分|调查|结婚|生子|入学|高考|退休|被抓|燃尽|破格|挂职|借调|整改|通报/.test(s || '');
          const rows = shown.map(l => {
            const isKey = keyEv(l.e || '');
            const badge = l.r > 0 ? `<span style="color:var(--vermilion);font-weight:700;font-size:11px">R${l.r}</span>` : '';
            const mp = typeof l.m === 'number' && l.m > 70 ? '<span style="color:var(--ui-danger);font-size:10px">🔥' + l.m + '</span>' : '';
            return `<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px dashed var(--parchment-dark);font-size:12px;${isKey ? 'background:var(--parchment)' : ''}">
              <span style="color:var(--ink-lighter);white-space:nowrap;min-width:34px">${l.y}岁</span>
              <span style="flex:1;color:var(--ink-light)">${this.escapeHtml(l.e || '')}</span>
              ${badge}${mp}
            </div>`;
          }).join('');
          return `<h3 style="font-size:14px;margin:14px 0 6px">🗓️ 人生轨迹（${cl.length} 年）</h3>${rows}<div style="font-size:11px;color:var(--ink-lighter);margin-top:6px">注：完整年度轨迹会从新记录开始持续保存，旧记录按已有内容展示</div>`;
        })()}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.showHistory()">返回列表</button>
        </div>
      </div>
    `);
  },
  clearHistory() {
    App.confirmAction('确定要清空所有历史记录吗？', () => {
      this.gameHistory = [];
      localStorage.removeItem('gameHistory');
      this.showHistory();
    });
  },

  // 📖 人生年鉴（v2.1.17 M2.6）：本局年度属性曲线图 + 大事时间轴
  // 数据源：player.careerLog 年度快照（v2.18 起每年度记录 心理压力/风险/廉洁/职级/声誉/热度；v2.1.17 补四维属性）
  showYearbook() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('history', { sync: false });
    if (typeof this.setTopBarTitle === 'function') this.setTopBarTitle('人生年鉴');
    const p = engine.getPlayer ? engine.getPlayer() : engine.state.player;
    const log = (p && p.careerLog) || [];
    // v2.1.47 年份去重抽为共享助手（人生回顾同源）：每年多条记录（晋升/运气等独立条目无快照）——
    // 按年份去重，优先取带快照的年度结算条目，其余年份合并事件文本
    const years = this._dedupeCareerLog(log);
    if (years.length < 2) {
      this.renderContent(`
        <div class="stage fade-in">
          <div class="lead"><span>📖</span><p>人生年鉴</p></div>
          <p style="text-align:center;padding:40px;color:var(--ink-lighter)">年鉴数据不足，至少需要两个年度记录（继续游戏自动积累）</p>
          <div class="sticky-action"><button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button></div>
        </div>`);
      return;
    }
    // ---- SVG 曲线辅助 ----
    const W = 300, H = 110, PAD = 14;
    // v2.1.79 曲线色改用主题令牌（深色下暗红/暗绿/暗蓝线条原本几乎不可见）；
    // #8D6E63/#EF5350/#FF7043/#558B2F 为中亮色，两主题均保持 3:1 以上可辨识，保留固定值
    const series = [
      { key: 'reputation', label: '声誉', color: 'var(--ui-gold)', get: l => l.reputation },
      { key: 'peopleReputation', label: '口碑', color: '#8D6E63', get: l => l.peopleReputation },
      { key: 'mentalPressure', label: '压力', color: 'var(--ui-danger)', get: l => l.mentalPressure },
      { key: 'risk', label: '风险', color: '#EF5350', get: l => l.risk },
      { key: 'integrity', label: '廉洁', color: 'var(--ui-green)', get: l => l.integrity },
      { key: 'iq', label: '智力', color: 'var(--ui-blue)', get: l => l.attrs && l.attrs.iq },
      { key: 'eq', label: '情商', color: 'var(--grade-d)', get: l => l.attrs && l.attrs.eq },
      { key: 'body', label: '体质', color: '#FF7043', get: l => l.attrs && l.attrs.body },
      { key: 'positionWeight', label: '职务权重', color: '#558B2F', get: l => l.positionWeight },
    ].filter(s => years.some(l => typeof s.get(l) === 'number'));
    const curveSVG = (s) => {
      const vals = years.map(l => s.get(l)).map(v => (typeof v === 'number') ? v : null);
      const numVals = vals.filter(v => v !== null);
      const min = Math.min(...numVals), max = Math.max(...numVals);
      const span = (max - min) || 1;
      const x = i => PAD + i * (W - PAD * 2) / Math.max(1, years.length - 1);
      const y = v => H - PAD - (v - min) / span * (H - PAD * 2);
      const pts = vals.map((v, i) => v === null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`).filter(Boolean).join(' ');
      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:8px">
        <line x1="${PAD}" y1="${H - PAD}" x2="${W - PAD}" y2="${H - PAD}" style="stroke:var(--ui-line-strong)"/>
        <polyline points="${pts}" fill="none" style="stroke:${s.color}" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="${x(years.length - 1).toFixed(1)}" cy="${y(numVals[numVals.length - 1]).toFixed(1)}" r="2.5" style="fill:${s.color}"/>
      </svg>`;
    };
    // 时间轴：筛选关键节点（晋升/单位变动/大事件/结局），最多显示 30 条
    const keyLog = years.filter((l, i) => {
      if (i === 0 || i === years.length - 1) return true;
      const prev = years[i - 1];
      if (l.leadershipRank !== prev.leadershipRank) return true;
      if (l.unitLevel !== prev.unitLevel) return true;
      if (/晋升|提拔|调任|升任|处分|调查|结婚|生子|入学|高考|退休|被抓|燃尽/.test(l.event || '')) return true;
      return false;
    }).slice(-30);
    const timelineHTML = keyLog.map(l => {
      const badge = l.leadershipRank > 0 ? `<span style="color:var(--vermilion);font-weight:700">R${l.leadershipRank}</span>` : '';
      return `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px dashed var(--parchment-dark);font-size:12px">
        <span style="color:var(--ink-lighter);white-space:nowrap;min-width:34px">${l.year}岁</span>
        <span style="flex:1;color:var(--ink-light)">${this.escapeHtml(l.event || '平静的一年')}</span>
        ${badge}
      </div>`;
    }).join('');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📖</span><p>人生年鉴 · ${this.escapeHtml(p.name) || '无名'}（${years[0].year}岁 → ${years[years.length - 1].year}岁）</p></div>
        <div style="font-size:12px;color:var(--ink-lighter);margin-bottom:8px">属性与状态年度曲线（包含智力、情商、体质等变化）</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${series.map(s => `<div><div style="font-size:11px;color:var(--ink-lighter);margin-bottom:2px">${s.label}</div>${curveSVG(s)}</div>`).join('')}
        </div>
        <h3 style="font-size:14px;margin:14px 0 6px">🗓️ 大事时间轴</h3>
        ${timelineHTML}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button type="button" class="btn btn-secondary" onclick="App.showLifeReview()" style="margin-top:8px">🧭 人生回顾（职业路径）</button>
        </div>
      </div>`);
  },

  // v2.1.47 共享数据助手：careerLog 按年份去重（优先取带快照的年度结算条目），
  // 收集特殊标记（special: upgrade/demotion/transfer）与年度快照单位名，供年鉴与人生回顾同源使用
  _dedupeCareerLog(log) {
    const byYear = {};
    for (const l of log || []) {
      if (!l || typeof l.year !== 'number') continue;
      const hasSnap = typeof l.reputation === 'number' && typeof l.mentalPressure === 'number';
      if (!byYear[l.year]) byYear[l.year] = { snap: null, events: [], specials: [], unitName: '' };
      if (hasSnap && !byYear[l.year].snap) byYear[l.year].snap = l;
      if (l.special) byYear[l.year].specials.push(l.special);
      if (l.unitName && !byYear[l.year].unitName) byYear[l.year].unitName = l.unitName;
      byYear[l.year].events.push(l.event || '');
    }
    return Object.keys(byYear).map(Number).sort((a, b) => a - b).map(yr => {
      const y = byYear[yr];
      const snap = y.snap;
      // 快照条目保留原始 event；无快照年份取关键事件（晋升/大事优先）
      const ev = snap ? snap.event : (y.events.find(e => /晋升|提拔|调任|升任|处分|调查|结婚|生子|退休/.test(e)) || y.events[y.events.length - 1] || '平静的一年');
      const unitName = y.unitName || (snap && snap.unitName) || '';
      return { year: yr, event: ev, specials: y.specials, unitName, ...(snap ? { reputation: snap.reputation, peopleReputation: snap.peopleReputation, mentalPressure: snap.mentalPressure, risk: snap.risk, integrity: snap.integrity, positionWeight: snap.positionWeight, leadershipRank: snap.leadershipRank, unitLevel: snap.unitLevel, heat: snap.heat, attrs: snap.attrs } : {}) };
    });
  },

  // 🧭 人生回顾（v2.1.47 L3.2）：本局职业路径阶梯图 + 关键节点时间轴
  // 数据源：careerLog 年度快照的 leadershipRank/unitLevel/unitName（v2.1.47 起快照含单位名）
  // 与 special 标记（晋升/降级/调任节点，engine-career-promotions 写入）
  showLifeReview() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('history', { sync: false });
    if (typeof this.setTopBarTitle === 'function') this.setTopBarTitle('人生回顾');
    const p = engine.getPlayer ? engine.getPlayer() : engine.state.player;
    const years = this._dedupeCareerLog((p && p.careerLog) || []);
    const rankOf = l => (typeof l.leadershipRank === 'number' ? l.leadershipRank : null);
    const ranked = years.filter(l => rankOf(l) !== null);
    const endingText = p && p.ending ? (ENDING_EMOJI[p.ending] || '') + (this.ENDING_NAMES[p.ending] || p.ending) : ''; // v2.1.69 名字引用权威表 + emoji 装饰
    if (ranked.length < 2) {
      this.renderContent(`
        <div class="stage fade-in">
          <div class="lead"><span>🧭</span><p>人生回顾</p></div>
          <p style="text-align:center;padding:40px;color:var(--ink-lighter)">职业路径数据不足，至少需要两个年度记录（继续游戏自动积累）</p>
          <div class="sticky-action"><button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button></div>
        </div>`);
      return;
    }
    // ---- SVG 阶梯图：X=年龄，Y=职级（离散阶梯连线，晋升/降级/调任着色标记） ----
    const W = 320, H = 180, PAD_L = 34, PAD_R = 14, PAD_T = 16, PAD_B = 26;
    const y0 = ranked[0].year, y1 = ranked[ranked.length - 1].year;
    const spanY = Math.max(1, y1 - y0);
    const RMAX = Math.max(6, ...ranked.map(l => l.leadershipRank));
    const xOf = yr => PAD_L + (yr - y0) / spanY * (W - PAD_L - PAD_R);
    const yOf = r => H - PAD_B - (r / RMAX) * (H - PAD_T - PAD_B);
    // 阶梯折线：相邻年份先横后纵（职级是离散值，阶梯比折线更可读）
    const stepPts = ranked.map((l, i) => {
      const px = xOf(l.year).toFixed(1);
      const py = yOf(l.leadershipRank).toFixed(1);
      return i === 0 ? [px + ',' + py] : [px + ',' + yOf(ranked[i - 1].leadershipRank).toFixed(1), px + ',' + py];
    }).reduce((acc, arr) => acc.concat(arr), []).join(' ');
    // 职级网格：每 2 级一条参考线（旧档无 getRankLabel 时降级为 R 数字）
    const gridLines = [];
    for (let r = 2; r <= RMAX; r += 2) {
      const gy = yOf(r).toFixed(1);
      const label = engine && typeof engine.getRankLabel === 'function' ? engine.getRankLabel(r) : 'R' + r;
      gridLines.push(`<line x1="${PAD_L}" y1="${gy}" x2="${W - PAD_R}" y2="${gy}" style="stroke:var(--ui-line-strong)" stroke-width="0.6" stroke-dasharray="2,3"/><text x="${PAD_L - 3}" y="${(parseFloat(gy) + 2.5).toFixed(1)}" font-size="7" style="fill:var(--ui-text-faint)" text-anchor="end">${this.escapeHtml(label)}</text>`);
    }
    // 特殊节点标记（同年多标记只取首个，避免重叠）：晋升=朱红↑ 降级=墨红↓ 调任=黛蓝◆
    const SPECIAL_STYLE = { upgrade: { color: 'var(--ui-red)', glyph: '↑', label: '晋升' }, demotion: { color: 'var(--ui-danger)', glyph: '↓', label: '降级' }, transfer: { color: 'var(--ui-blue)', glyph: '◆', label: '调任' } };
    const markers = [];
    for (const l of ranked) {
      const sp = (l.specials || []).find(s => SPECIAL_STYLE[s]);
      if (!sp) continue;
      const st = SPECIAL_STYLE[sp];
      markers.push(`<text x="${xOf(l.year).toFixed(1)}" y="${(yOf(l.leadershipRank) - 5).toFixed(1)}" font-size="10" font-weight="700" style="fill:${st.color}" text-anchor="middle">${st.glyph}</text>`);
    }
    const startPt = `<circle cx="${xOf(ranked[0].year).toFixed(1)}" cy="${yOf(ranked[0].leadershipRank).toFixed(1)}" r="2.6" style="fill:var(--ui-text-faint)"/>`;
    const endPt = `<circle cx="${xOf(ranked[ranked.length - 1].year).toFixed(1)}" cy="${yOf(ranked[ranked.length - 1].leadershipRank).toFixed(1)}" r="3" style="fill:var(--ui-red)"/>`;
    const pathSVG = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:8px" role="img" aria-label="职级阶梯图：${this.escapeHtml(String(ranked[0].year))}岁到${this.escapeHtml(String(y1))}岁">
        ${gridLines.join('')}
        <polyline points="${stepPts}" fill="none" style="stroke:var(--ui-red)" stroke-width="2" stroke-linejoin="round"/>
        ${startPt}${endPt}${markers.join('')}
        <text x="${PAD_L}" y="${H - 8}" font-size="8" style="fill:var(--ui-text-faint)">${this.escapeHtml(String(y0))}岁</text>
        <text x="${W - PAD_R}" y="${H - 8}" font-size="8" style="fill:var(--ui-text-faint)" text-anchor="end">${this.escapeHtml(String(y1))}岁</text>
      </svg>`;
    const legend = `<div style="display:flex;gap:12px;font-size:10px;color:var(--ink-lighter);margin-top:4px">${Object.keys(SPECIAL_STYLE).map(k => `<span><b style="color:${SPECIAL_STYLE[k].color}">${SPECIAL_STYLE[k].glyph}</b> ${SPECIAL_STYLE[k].label}</span>`).join('')}<span><b style="color:var(--ui-red)">●</b> 当前</span></div>`;
    // 关键节点：职级/单位层级变化、晋升/降级/调任标记、单位名变化（旧档快照无单位名时降级为事件文本）
    const nodes = years.filter((l, i) => {
      if (i === 0 || i === years.length - 1) return true;
      const prev = years[i - 1];
      if (rankOf(l) !== null && rankOf(l) !== rankOf(prev)) return true;
      if (typeof l.unitLevel === 'number' && l.unitLevel !== prev.unitLevel) return true;
      if ((l.specials || []).length > 0) return true;
      if (l.unitName && prev.unitName && l.unitName !== prev.unitName) return true;
      if (/晋升|提拔|调任|升任|处分|降级|挂职|借调|遴选|退休/.test(l.event || '')) return true;
      return false;
    }).slice(-30);
    const rankBadge = l => {
      if (rankOf(l) === null || rankOf(l) <= 0) return '';
      const label = engine && typeof engine.getRankLabel === 'function' ? engine.getRankLabel(l.leadershipRank) : 'R' + l.leadershipRank;
      return `<span style="color:var(--vermilion);font-weight:700">${this.escapeHtml(label)}</span>`;
    };
    const nodeRows = nodes.map(l => {
      const sp = (l.specials || []).find(s => SPECIAL_STYLE[s]);
      const tag = sp ? `<span style="font-size:10px;color:${SPECIAL_STYLE[sp].color};font-weight:700">[${SPECIAL_STYLE[sp].label}]</span>` : '';
      const unit = l.unitName ? `<span style="color:var(--ink-lighter);font-size:10px">${this.escapeHtml(l.unitName)}</span>` : '';
      return `<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px dashed var(--parchment-dark);font-size:12px">
        <span style="color:var(--ink-lighter);white-space:nowrap;min-width:34px">${this.escapeHtml(String(l.year))}岁</span>
        <span style="flex:1;color:var(--ink-light)">${tag} ${this.escapeHtml(l.event || '平静的一年')} ${unit}</span>
        ${rankBadge(l)}
      </div>`;
    }).join('');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>🧭</span><p>人生回顾 · ${this.escapeHtml((p && p.name) || '无名')}（${this.escapeHtml(String(y0))}岁 → ${this.escapeHtml(String(y1))}岁${endingText ? ' · ' + this.escapeHtml(endingText) : ''}）</p></div>
        <div class="event-card">
          <p style="font-size:12px;font-weight:700;color:var(--vermilion);margin-bottom:4px">📈 职级阶梯（${this.escapeHtml(engine && typeof engine.getRankLabel === 'function' ? engine.getRankLabel(ranked[0].leadershipRank) : 'R' + ranked[0].leadershipRank)} → ${this.escapeHtml(engine && typeof engine.getRankLabel === 'function' ? engine.getRankLabel(ranked[ranked.length - 1].leadershipRank) : 'R' + ranked[ranked.length - 1].leadershipRank)}）</p>
          ${pathSVG}
          ${legend}
        </div>
        <h3 style="font-size:14px;margin:14px 0 6px">🗂️ 关键节点（职级 / 单位变动）</h3>
        ${nodeRows}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button type="button" class="btn btn-secondary" onclick="App.showYearbook()" style="margin-top:8px">📖 人生年鉴（属性曲线）</button>
        </div>
      </div>`);
  },
  // ===== v2.1.63 人生经历：分类标注 + 独立面板（数据源 careerLog） =====
  EXPERIENCE_CATEGORIES: [
    { id: 'career', label: '仕途', icon: '📈', keys: ['晋升', '提拔', '升任', '调任', '评优', '答辩', '任职', '转正', '退休', '返聘', '借调', '选拔'] },
    { id: 'penalty', label: '处分', icon: '⚖️', keys: ['处分', '调查', '警告', '通报', '双开', '落马', '被抓', '停职', '审查', '庭审', '拘留', '入狱'] },
    { id: 'family', label: '家庭', icon: '👨‍👩‍👧', keys: ['结婚', '生子', '入学', '高考', '大学', '恋爱', '离婚', '怀孕', '孩子', '子女', '父母', '老人', '房产'] },
    { id: 'finance', label: '财务', icon: '💰', keys: ['理财', '存款', '负债', '房贷', '炒股', '借款', '投资', '工资', '奖金', '积蓄', '月供'] },
    { id: 'network', label: '人脉', icon: '🤝', keys: ['人脉', '贵人', '人情', '求助', '联系人', '结交', '请客', '搭档', '背叛'] },
    { id: 'project', label: '项目', icon: '📦', keys: ['项目', '专案', '试点', '招商', '灾害', '民生工程', '调研', '汇报'] },
    { id: 'health', label: '健康', icon: '🏥', keys: ['健康', '住院', '体检', '生病', '失眠', '疲惫', '休整', '慢性'] },
    { id: 'exam', label: '考试', icon: '📝', keys: ['上岸', '笔试', '面试', '录取', '报考', '备考', '考试', '落榜'] }
  ],
  classifyExperience(entry) {
    if (entry && entry.category) return entry.category;
    const text = ((entry && entry.event) || '');
    const match = this.EXPERIENCE_CATEGORIES.find(cat => cat.keys.some(k => text.includes(k)));
    return match ? match.id : 'other';
  },
  _experienceList() {
    const p = typeof engine.getPlayer === 'function' ? engine.getPlayer() : null;
    let log = (p && Array.isArray(p.careerLog)) ? p.careerLog : [];
    return log.slice().reverse().map((entry, i) => ({ entry, cat: this.classifyExperience(entry) }));
  },
  showExperience() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('experience', { sync: false });
    this.renderExperience();
  },
  renderExperience(cat) {
    const filter = cat || this._expFilter || 'all';
    this._expFilter = filter;
    const items = this._experienceList();
    const allCounts = {};
    for (const item of items) allCounts[item.cat] = (allCounts[item.cat] || 0) + 1;
    const total = items.length;
    const chips = `<button type="button" class="exp-chip${filter === 'all' ? ' is-active' : ''}" onclick="App.renderExperience('all')">全部 <b>${total}</b></button>`
      + this.EXPERIENCE_CATEGORIES.map(cat => `<button type="button" class="exp-chip${filter === cat.id ? ' is-active' : ''}" onclick="App.renderExperience('${cat.id}')">${cat.icon} ${cat.label} <b>${allCounts[cat.id] || 0}</b></button>`).join('')
      + (allCounts.other ? `<button type="button" class="exp-chip${filter === 'other' ? ' is-active' : ''}" onclick="App.renderExperience('other')">其他 <b>${allCounts.other}</b></button>` : '');
    const rows = items.filter(item => filter === 'all' || item.cat === filter).slice(0, 300).map(item => {
      const cat = this.EXPERIENCE_CATEGORIES.find(c => c.id === item.cat);
      const label = cat ? cat.icon + ' ' + cat.label : (item.cat === 'other' ? '其他' : '其他');
      const entry = item.entry || {};
      return `<div class="exp-row"><span class="exp-year">${Number.isFinite(entry.year) ? entry.year + '岁' : '?'}</span><span class="exp-tag exp-tag-${item.cat}">${this.escapeHtml(label)}</span><p>${this.escapeHtml(entry.event || '')}</p></div>`;
    }).join('');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📜</span><p>人生经历 · 共 ${total} 条留痕（按类别筛选，点击类别查看）</p></div>
        <div class="exp-chips">${chips}</div>
        ${rows ? `<div class="exp-list">${rows}</div>` : '<p style="text-align:center;padding:40px;color:var(--ink-lighter)">该类别暂无经历</p>'}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button type="button" class="btn btn-secondary" onclick="App.showYearbook()" style="margin-top:8px">📖 人生年鉴</button>
        </div>
      </div>`);
  }
});
