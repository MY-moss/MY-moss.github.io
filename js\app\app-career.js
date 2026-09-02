const FINANCE_POOL = [
  { id: 'life', icon: '🍲', label: '改善生活', cost: 20, desc: '吃好穿好，压力大减（压力-12，家压-8）' },
  { id: 'parents', icon: '👴', label: '孝敬父母', cost: 15, desc: '给父母养老钱（家压-10，背景+3）' },
  { id: 'save', icon: '🏦', label: '存定期', cost: 10, desc: '存一年期定期，明年本息+12' },
  { id: 'edu', icon: '📚', label: '子女教育金', cost: 50, desc: '给孩子存教育基金（有子女时，家压-8，能力+1）', need: 'child' },
  { id: 'house', icon: '🏠', label: '购房置业', cost: 120, desc: '买下属于自己的房子（家压-15，声誉+2）', need: 'nohouse' },
  { id: 'charity', icon: '❤️', label: '慈善捐赠', cost: 25, desc: '资助贫困学生（声誉+4，廉洁+2）' },
  { id: 'insurance', icon: '🛡️', label: '购买保险', cost: 30, desc: '给全家上保险（家压-6，风险-2）' },
  { id: 'stock', icon: '📈', label: '买点基金', cost: 40, desc: '分散投资，让闲钱持续生息，收益看运气' },
  { id: 'train', icon: '🎓', label: '进修培训', cost: 35, desc: '报班充电提升业务（能力+4，压力+3）' },
  { id: 'travel', icon: '🏝️', label: '全家旅游', cost: 45, desc: '带家人出去走走（压力-12，家压-6，热度-2）' },
  { id: 'renovate', icon: '🛠️', label: '装修老屋', cost: 50, desc: '翻新老房子（家压-8，压力-4）' },
  { id: 'car', icon: '🚗', label: '购车代步', cost: 60, desc: '买车改善通勤（压力-6，家压-8，声誉+1）' },
  { id: 'gold', icon: '📿', label: '购置黄金', cost: 70, desc: '黄金保值，明年本息+80' },
  { id: 'investMore', icon: '📊', label: '定投加仓', cost: 60, desc: '行情波动大，收益看运气（需买过基金）', need: 'boughtStock' },
  { id: 'checkup', icon: '🩺', label: '健康体检', cost: 40, desc: '全面体检，早发现早安心（体质+2，消隐患）', need: 'age35' },
  { id: 'guanxi', icon: '🤝', label: '人情储蓄', cost: 25, desc: '平时多走动，朋友圈更广（背景+5）', need: 'bg30' },
  { id: 'givehome', icon: '🏡', label: '接父母同住', cost: 50, desc: '一家人团团圆圆（家压-12，背景+2）', need: 'house' },
  { id: 'repayLoan', icon: '💳', label: '提前还贷', cost: 0, desc: '还掉部分债务，心里轻松（现金还本-80，压力-8）', need: 'debt' },
  { id: 'borrow', icon: '🕳️', label: '借贷消费', cost: 0, desc: '先花明天的钱（额度随欠债与借款次数递增，最高借 80+）——小心催收' },
  { id: 'loanOnline', icon: '📲', label: '网络贷款', cost: 0, desc: '秒到账的诱惑（额度随欠债递增，最高借 100+）——利滚利很危险' },
  { id: 'gamble', icon: '🎲', label: '博彩上头', cost: 10, desc: '一夜暴富的梦（小概率+30，大概率亏损，可能上瘾）' },
  { id: 'smartHome', icon: '🏠', label: '智能家居升级', cost: 30, desc: '全屋智能，生活便利（家压-5，压力-3）' },
  { id: 'gym', icon: '🏋️', label: '私教健身', cost: 45, desc: '一对一训练，重塑身体（体质+2，压力-4）' },
  { id: 'therapy', icon: '🛋️', label: '心理咨询', cost: 35, desc: '专业疏导，解开心结（压力-8）' },
  { id: 'books', icon: '📖', label: '购书进修', cost: 25, desc: '买书报课充实自己（智商+1，能力+2）' },
  { id: 'pet', icon: '🐕', label: '养只宠物', cost: 30, desc: '毛孩子的陪伴最治愈（家压-5，情商+1）' },
  { id: 'donateAlma', icon: '🎓', label: '捐赠母校', cost: 40, desc: '回馈母校设立奖学金（声誉+3，廉洁+1）' },
  { id: 'seniorCheckup', icon: '🏥', label: '高端体检套餐', cost: 60, desc: '深度体检，全身养护（体质+3，消隐患）' },
  { id: 'familyTourPlus', icon: '✈️', label: '豪华家庭游', cost: 70, desc: '五星级假期，全家尽兴（家压-10，压力-10）' },
  { id: 'housekeeper', icon: '🧹', label: '家政服务', cost: 35, desc: '请人打理家务（家压-6，压力-3）' },
  { id: 'venture', icon: '🚀', label: '副业投资', cost: 80, desc: '入股朋友的项目，收益看运气' },
];
Object.assign(App, {
  _pickRotate(pool, min, max) {
    const n = Math.min(pool.length, min + Math.floor(Math.random() * (max - min + 1)));
    const copy = pool.slice();
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = copy[i]; copy[i] = copy[j]; copy[j] = t; }
    return copy.slice(0, n);
  },
  // 只展示正面：括号段内仅保留纯增益条目（能力/声誉等 +N），负面变化全部隐藏（含"压力+3"这类负向属性增高）
  _posOnly(desc) {
    if (!desc) return desc;
    const negAttr = ['压力', '风险', '热度', '家压', '欲望'];
    return String(desc).replace(/（[^）]*）/g, (seg) => {
      const kept = seg.slice(1, -1).split(/[，,；;]/).map(s => s.trim()).filter(s => {
        if (!/[+-]\d+/.test(s)) return false;
        const m = s.match(/([^+-]*)([+-])(\d+)/);
        if (!m) return false;
        if (m[2] === '-') return false;                    // 负数字一律隐藏
        if (negAttr.some(k => m[1].includes(k))) return false; // 负向属性增高也隐藏
        return true;
      });
      return kept.length > 0 ? '（' + kept.join('，') + '）' : '';
    });
  },
  // v2.33 结局预兆：50 岁后（或近退休）显示「组织印象」动态提示，退休结算前给玩家调整空间
  renderOrgHint(p, h) {
    const retireAge = (p.retireAgeExt || (p.gender === '女' ? 55 : 60));
    if (p.age < 50 && p.age < retireAge - 3) return '';
    const r = Math.round(p.reputation || 50);
    const risk = Math.round(h.risk || 0);
    let color, text;
    if (risk > 60) { color = 'var(--ui-danger)'; text = '组织里隐约有些风声……有些事，该收手了。'; }
    else if (risk > 35) { color = 'var(--ui-amber)'; text = '组织对你评价平平，个别议论让人不安。'; }
    else if (r > 80 && p.leadershipRank >= 7) { color = 'var(--ui-green)'; text = '组织对你评价很高，退休前或许还有一搏。'; }
    else if (r > 70) { color = 'var(--ui-green)'; text = '组织对你印象不错，安心站好最后一班岗。'; }
    else if (r > 45) { color = 'var(--ui-text-muted)'; text = '组织对你评价平平，岁月静好也是福气。'; }
    else { color = 'var(--ui-danger)'; text = '组织对你有些看法……最后几年，谨慎为上。'; }
    return `<p style="font-size:11px;color:${color};margin-top:6px;border-top:1px dashed var(--parchment-dark);padding-top:6px">🗂️ 组织印象：${text}</p>`;
  },
renderCareer() {
    const p = engine.getPlayer();
    const log = p.careerLog;
    const lastYear = log[log.length - 1];
    const retireAge = (p.retireAgeExt || (p.gender === '女' ? 55 : 60)); // v2.59 用 retireAgeExt（返聘延长后原硬编码显示"距退休-5年"负数）
    const h = engine.getHidden();
    const heatWarning = p.heat > 50 ? ' 🔥热度偏高！纪检关注风险上升' : p.heat > 30 ? ' 🔥热度上升，收敛为妙' : '';
    const maxRank = engine.getMaxRankForLevel ? engine.getMaxRankForLevel(p.unit.level) : 10;
    const promoProgress = p.leadershipRank >= maxRank ? '已达职级上限，可跨级晋升' : '';
    const rankLabel = engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级';
    const unitLevelLabel = engine.getUnitLevelLabel(p.unitLevel);
    // 基层历练剩余年限提示
    const grassrootsNote = (p.flags && p.flags.grassrootsActive)
      ? ` 🌾 基层历练中（第${(p.flags.grassrootsYears || 0) + 1}/${p.flags.grassrootsDuration || 3}年）`
      : '';
    const saveTime = (() => { try { const slot = (App.currentSlot || 0); const t = localStorage.getItem('shangan_save_time' + (slot > 0 ? '_' + slot : '')); return t ? new Date(parseInt(t, 10)).toLocaleString('zh-CN') : ''; } catch(e) { return ''; } })(); // v2.58 修复：按当前存档槽位读取时间戳（原固定读 slot0，slot1/2 恒显示"未保存"）
    return `
      <div class="stage fade-in">
        <div class="lead"><span class="lead-badge">${p.age}</span><p>第 ${p.yearsWorked} 年 · ${p.age} 岁 · ${unitLevelLabel}${grassrootsNote}${p.age >= retireAge - 5 ? ' ⚠️距退休' + (retireAge - p.age) + '年' : ''}${heatWarning}</p></div>
        <div class="career-save-line">💾 ${App.escapeHtml(saveTime || '未保存')} <button type="button" onclick="App.saveAndContinue()">保存</button><span aria-hidden="true">·</span><button type="button" onclick="App.showMenu()">菜单</button></div>
        <div class="career-card">
          <div class="career-event">
            ${lastYear ? `<p>${App.escapeHtml(lastYear.event)}</p>` : '<p>平静的一年，没有什么特别的事情发生。</p>'}
            ${lastYear && lastYear.special === 'upgrade' ? '<p style="color:var(--vermilion);font-weight:600;margin-top:6px">🎉 恭喜晋升！</p>' : ''}
            ${lastYear && lastYear.special === 'demotion' ? '<p style="color:var(--ui-danger);font-weight:600;margin-top:6px">⚠️ 被降级</p>' : ''}
            ${lastYear && lastYear.evaluation ? `<p style="font-size:11px;color:var(--ink-lighter);margin-top:4px">📋 ${App.escapeHtml(lastYear.evaluation)}</p>` : ''}
            ${this.renderOrgHint(p, h)}
          </div>
          <div class="career-stats">
            <div class="stat-item"><span>🏛 单位</span><span>${App.escapeHtml(p.unit.name)}（${App.escapeHtml(unitLevelLabel)}）</span></div>
            <div class="stat-item"><span>⭐ 职级</span><span>${rankLabel} ${promoProgress ? '→ ' + promoProgress : ''}</span></div>
            <div class="stat-item"><span>🏆 晋升</span><span>${p.promotions} 次</span></div>
            <div class="stat-item"><span>📊 工作能力</span><span>${Math.round(h.workAbility)}</span></div>
            <div class="stat-item"><span>😰 心理压力</span><span>${Math.round(h.mentalPressure)} ${h.mentalPressure > 60 ? '🔴' : h.mentalPressure > 35 ? '🟡' : '🟢'}</span></div>
            <div class="stat-item"><span>⚠️ 风险</span><span>${Math.round(h.risk)} ${h.risk > 60 ? '🔴' : h.risk > 35 ? '🟡' : '🟢'}</span></div>
            <div class="stat-item"><span>🛡️ 廉洁</span><span>${Math.round(h.integrity)}</span></div>
            <div class="stat-item"><span>📈 跨级升迁</span><span>${p.unitUpgrades} 次</span></div>
            ${p.flags.keyTalent ? '<div class="stat-item"><span>🏅 重点培养</span><span style="color:var(--ui-gold)">考察中（晋升破格机会）</span></div>' : ''}
            ${(p.rankTrack || 0) > 0 ? `<div class="stat-item"><span>📊 职级待遇 Lv.${p.rankTrack}</span><span style="color:var(--ui-gold)">权重+${(p.rankTrack || 0) * 2} 收入+${p.rankTrack}</span></div>` : ''}
            ${p.flags.mortgage ? '<div class="stat-item"><span>🏠 房贷中</span><span style="color:var(--ui-amber)">月供 -6/年</span></div>' : ''}
            ${p.flags.drinkDrive ? '<div class="stat-item"><span>⚠️ 酒驾待处理</span><span style="color:var(--ui-danger)">处分将至</span></div>' : ''}
            ${p.flags.healthRisk ? '<div class="stat-item"><span>🩺 体检异常</span><span style="color:var(--ui-danger)">需调理</span></div>' : ''}
            ${p.flags.healthCare ? '<div class="stat-item"><span>🏃 调理中</span><span style="color:var(--ui-gold)">健康改善中</span></div>' : ''}
            ${p.flags.healthTreated ? '<div class="stat-item"><span>🏥 住院康复</span><span style="color:var(--ui-gold)">治疗中</span></div>' : ''}
            ${p.flags.mbaApply && !p.flags.mbaActive ? '<div class="stat-item"><span>🎓 备考中</span><span style="color:var(--ui-gold)">在职研究生备考</span></div>' : ''}
            ${p.flags.mbaActive ? '<div class="stat-item"><span>🎓 在职读研</span><span style="color:var(--ui-gold)">学业进行中</span></div>' : ''}
            ${p.flags.dating && !p.isMarried ? '<div class="stat-item"><span>💕 恋爱中</span><span style="color:#AD1457">感情稳定</span></div>' : ''}
            ${p.flags.faction_lean ? '<div class="stat-item"><span>⚖️ 派系站队</span><span style="color:var(--ui-danger)">利益与风险并存</span></div>' : ''}
            <div class="stat-item"><span>⭐ 声誉</span><span>${Math.round(p.reputation || 50)} ${(p.reputation || 50) > 70 ? '🟢' : (p.reputation || 50) < 30 ? '🔴' : '🟡'}</span></div>
            <div class="stat-item"><span>🔥 热度</span><span>${Math.round(p.heat || 0)} ${(p.heat || 0) > 60 ? '🔴' : (p.heat || 0) > 30 ? '🟡' : '🟢'}</span></div>
            <div class="stat-item"><span>💭 欲望</span><span>${Math.round(h.desire)}</span></div>
            <div class="stat-item"><span>🏠 家压</span><span>${Math.round(h.familyPressure)} ${h.familyPressure > 60 ? '🔴' : h.familyPressure > 35 ? '🟡' : '🟢'}</span></div>
            <div class="stat-item"><span>💰 财富</span><span>${this._finHTML(p)}</span></div>
          </div>
          <div class="career-timeline">
            ${log.slice(-10).map(l => `
              <div class="timeline-item">
                <span class="timeline-year">${l.year}岁</span>
                <span class="timeline-event">${App.escapeHtml(l.event)}${l.special === 'upgrade' ? ' 🏆' : ''}</span>
              </div>
            `).join('')}
         </div>
        </div>
        ${this.renderPolicyProjectPanel ? this.renderPolicyProjectPanel(p) : ''}
        ${this.renderPlanningBoard ? this.renderPlanningBoard(p, h) : '<div class="sticky-action"><button type="button" class="btn btn-primary" onclick="App.nextYear()">进入下一年</button></div>'}
      </div>
    `;
  },
  // v2.48 档案全程回看：生涯留痕全量列表（按年倒序，滚动容器）
  // v2.70 年鉴翻页：每页 15 条 + 上/下页（原全量滚动，长局 300+ 条时难以定位）
  showArchiveFull() {
    const p = engine.getPlayer();
    const log = (p.careerLog || []).slice().reverse();
    const page = this._archivePage || 0;
    const perPage = 15;
    const pages = Math.max(1, Math.ceil(log.length / perPage));
    const cur = Math.min(page, pages - 1);
    const slice = log.slice(cur * perPage, cur * perPage + perPage);
    const rows = slice.map(l => {
      const icon = l.special === 'upgrade' ? '🏆' : l.special === 'demotion' ? '⚠️' : l.special === 'arrest' ? '⛓️' : '·';
      const meta = [];
      if (typeof l.risk === 'number') meta.push('风险' + Math.round(l.risk));
      if (typeof l.integrity === 'number') meta.push('廉洁' + Math.round(l.integrity));
      if (typeof l.leadershipRank === 'number') meta.push('职级' + l.leadershipRank);
      if (typeof l.mentalPressure === 'number') meta.push('压力' + Math.round(l.mentalPressure));
      return `<div style="padding:6px 8px;border-bottom:1px dashed var(--parchment-dark);font-size:12px">
        <span style="color:var(--ink-lighter);margin-right:6px">${l.year}岁</span>${icon} ${App.escapeHtml(l.event)}
        ${meta.length ? `<span style="float:right;font-size:10px;color:var(--ink-lighter)">${meta.join(' · ')}</span>` : ''}
      </div>`;
    }).join('');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span class="lead-badge">🗂️</span><p>组织档案 · 全程留痕（${p.careerLog ? p.careerLog.length : 0} 条 · 第 ${cur + 1}/${pages} 页）</p></div>
        <div style="max-height:60vh;overflow-y:auto;border:1px solid var(--parchment-dark);border-radius:8px;background:var(--parchment-light);padding:4px">
          ${rows || '<div style="padding:12px;font-size:12px;color:var(--ink-lighter)">暂无留痕记录</div>'}
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;justify-content:center">
          <button class="btn btn-secondary" onclick="App._archivePage = (App._archivePage || 0) - 1; App.showArchiveFull()" ${cur <= 0 ? 'disabled' : ''} type="button">⬅ 上一页</button>
          <span style="font-size:11px;color:var(--ink-lighter);align-self:center">${cur + 1} / ${pages}</span>
          <button class="btn btn-secondary" onclick="App._archivePage = (App._archivePage || 0) + 1; App.showArchiveFull()" ${cur >= pages - 1 ? 'disabled' : ''} type="button">下一页 ➡</button>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
  // 财务双表显示助手：现金 + 负债
  _finHTML(p) {
    const fin = p.finance || { cash: p.wealth || 0, debts: [] };
    const d = Math.round((fin.debts || []).reduce((s, x) => s + x.principal, 0));
    return `💰 现金 <b>${fin.cash}</b>${d > 0 ? ` · 负债 <b style="color:var(--ui-danger)">${d}</b>` : ''}`;
  },
  // 📊 人生数据分析（SVG 折线图：压力/风险/职级走势）
  showLifeChart() {
    const p = engine.getPlayer();
    const log = p.careerLog || [];
    const series = log.filter(l => l && typeof l.mentalPressure === 'number');
    if (series.length < 3) { this.showToast('数据不足，先玩几年再看', 'warning'); this.afterCareerStep(); return; }
    // v2.1.79 走势图主题适配：SVG 颜色经 style 属性引用 CSS 变量（presentation 属性不支持 var()）
    const mkLine = (key, color) => {
      const vals = series.map(l => l[key] || 0);
      const max = Math.max(100, ...vals);
      const w = 320, h = 90, pad = 4;
      const pts = vals.map((v, i) => {
        const x = pad + (i / Math.max(1, vals.length - 1)) * (w - pad * 2);
        const y = h - pad - (v / max) * (h - pad * 2);
        return x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' ');
      return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto">
        <polyline points="${pts}" fill="none" style="stroke:${color}" stroke-width="1.5" stroke-linejoin="round"/>
        ${vals.map((v, i) => {
          const x = pad + (i / Math.max(1, vals.length - 1)) * (w - pad * 2);
          const y = h - pad - (v / max) * (h - pad * 2);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" style="fill:${color}"/>`;
        }).join('')}
      </svg>`;
    };
    // 职级走势
    const rankVals = log.filter(l => l && typeof l.leadershipRank === 'number').map(l => l.leadershipRank || 0);
    const rMax = Math.max(12, ...rankVals);
    const rPts = rankVals.map((v, i) => {
      const x = 4 + (i / Math.max(1, rankVals.length - 1)) * 312;
      const y = 86 - (v / rMax) * 82;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📊</span><p>我的人生数据 · ${App.escapeHtml(p.name)}（${p.age}岁 · ${p.yearsWorked}年）</p></div>
        <div class="event-card">
          <p style="font-size:12px;font-weight:700;color:var(--vermilion);margin-bottom:4px">📈 职级走势（${rankVals[0] || 0} → ${rankVals[rankVals.length - 1] || 0}）</p>
          <svg viewBox="0 0 320 90" style="width:100%;height:auto">
            <polyline points="${rPts}" fill="none" style="stroke:var(--ui-red-strong)" stroke-width="2" stroke-linejoin="round"/>
            ${rankVals.map((v, i) => {
              const x = 4 + (i / Math.max(1, rankVals.length - 1)) * 312;
              const y = 86 - (v / rMax) * 82;
              return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" style="fill:var(--ui-red-strong)"/><text x="${x.toFixed(1)}" y="${(y - 5).toFixed(1)}" font-size="7" style="fill:var(--ui-text-faint)" text-anchor="middle">${v}</text>`;
            }).join('')}
          </svg>
          <p style="font-size:12px;font-weight:700;color:var(--ui-danger);margin:10px 0 4px">😰 心理压力走势</p>
          ${mkLine('mentalPressure', 'var(--ui-danger)')}
          <p style="font-size:12px;font-weight:700;color:var(--ui-amber);margin:10px 0 4px">⚠️ 风险走势</p>
          ${mkLine('risk', 'var(--ui-amber)')}
          <p style="font-size:12px;font-weight:700;color:var(--ui-green);margin:10px 0 4px">🛡️ 廉洁走势</p>
          ${mkLine('integrity', 'var(--ui-green)')}
          <p style="font-size:12px;font-weight:700;color:var(--ui-blue);margin:10px 0 4px">⚖️ 职务权重走势</p>
          ${mkLine('positionWeight', 'var(--ui-blue)')}
          <p style="font-size:12px;font-weight:700;color:var(--ui-gold);margin:10px 0 4px">⭐ 声誉走势</p>
          ${mkLine('reputation', 'var(--ui-gold)')}
          <p style="font-size:12px;font-weight:700;color:var(--ui-red);margin:10px 0 4px">🔥 热度走势</p>
          ${mkLine('heat', 'var(--ui-red)')}
        </div>
        <div class="event-card" style="margin-top:10px">
          <p style="font-size:12px;font-weight:700;color:var(--vermilion);margin-bottom:6px">🗂️ 生涯总览</p>
          <div class="career-stats">
            <div class="stat-item"><span>⭐ 当前职级</span><span>${engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级'}</span></div>
            <div class="stat-item"><span>🏆 晋升次数</span><span>${p.promotions} 次</span></div>
            <div class="stat-item"><span>💰 财富</span><span>${Math.round(p.wealth || 0)}</span></div>
            <div class="stat-item"><span>⭐ 声誉 / 口碑</span><span>${Math.round(p.reputation || 50)} / ${Math.round(p.peopleReputation || 50)}</span></div>
            <div class="stat-item"><span>📜 事件留痕</span><span>${(p.careerLog || []).length} 条</span></div>
            <div class="stat-item"><span>📜 见识事件</span><span>${(p.seenEvents || []).length} 个</span></div>
          </div>
          ${(() => {
            const st = this.stats || {};
            const endingsGot = (this.ALL_ENDINGS || []).filter(e => (st.endings || {})[e] > 0).length;
            const endingsAll = (this.ALL_ENDINGS || []).length;
            return `<p style="font-size:11px;color:var(--ink-lighter);margin-top:8px;line-height:1.7">📚 历局：${st.plays || 0} 局 · 上岸 ${st.passes || 0} 次 · 最佳 ${Math.round(st.bestScore || 0)} 分 · 结局图鉴 ${endingsGot}/${endingsAll}</p>`;
          })()}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
  // 旧入口兼容：人脉操作统一由 app-network.js 渲染。
  showGiftPanel() {
    if (typeof this.showNetworkPanel === 'function') this.showNetworkPanel();
  },
  // v2.22 家庭剧情线：子女培养
  doRaiseChild(mode) {
    const p = engine.getPlayer();
    if (!p.hasChildren) { this.showToast('还没有孩子', 'warning'); return; }
    if (((p.flags && p.flags.childRaiseUsed) || 0) >= 1) { this.showToast('今年已经安排过孩子的事了', 'warning'); return; }
    if (!this._hasAP(1)) { this.showToast('精力不足，明年再安排孩子的事', 'warning'); return; }
    const r = engine.raiseChild(mode);
    if (r.ok) {
      if (typeof engine.spendActionPoint === 'function') engine.spendActionPoint(1);
      this.showToast(r.msg, 'success');
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('child'); else engine.saveState();
      if (window.monitorClient) monitorClient.report();
      if (this.state && this.state.stage === 'gift') this.showGiftPanel();
    } else {
      this.showToast(r.msg, 'warning');
    }
  },
  // 💰 财务规划：主动消费/投资面板（让财富有决策空间）
  _finPoolOK(o) {
    const p = engine.getPlayer();
    const h = engine.getHidden();
    if (o.need === 'child' && !p.hasChildren) return false;
    if (o.need === 'nohouse' && (p.flags && p.flags.hasHouse)) return false;
    if (o.need === 'house' && !(p.flags && p.flags.hasHouse)) return false;
    if (o.need === 'debt' && !engine.inDebt()) return false;
    if (o.need === 'age35' && p.age < 35) return false;
    if (o.need === 'bg30' && h.background < 30) return false;
    if (o.need === 'boughtStock' && !(p.flags && p.flags.boughtStock)) return false;
    return true;
  },
  showFinancePanel() {
    const p = engine.getPlayer();
    const h = engine.getHidden();
    const used = (p.flags && p.flags.financeUsed) || 0;
    const canUse = used < 1;
    // 年度锁定：本年度可选规划只在首次打开时随机抽取，反复进出不重抽（防止刷选项），顺序保持首次抽取顺序
    const yearKey = p.yearsWorked || 0;
    let options;
    if (p.flags.financeOptions && p.flags.financeOptionsYear === yearKey) {
      const ids = p.flags.financeOptions || [];
      options = ids.map(id => FINANCE_POOL.find(o => o.id === id)).filter(Boolean).filter(o => this._finPoolOK(o));
    } else {
      let pool = FINANCE_POOL.filter(o => this._finPoolOK(o));
      // v2.1.6 负债玩家稳定出口：提前还贷必出现在财务面板（随机抽 3-5 项下原被抽中概率 ~12%，主动还贷被随机性阻断）
      if (engine.inDebt() && !pool.some(o => o.id === 'repayLoan')) {
        pool = [FINANCE_POOL.find(o => o.id === 'repayLoan'), ...pool];
      }
      options = this._pickRotate(pool, 3, 5);
      if (engine.inDebt() && options.length > 0 && !options.some(o => o.id === 'repayLoan')) {
        options[0] = FINANCE_POOL.find(o => o.id === 'repayLoan');
      }
      p.flags.financeOptions = options.map(o => o.id);
      p.flags.financeOptionsYear = yearKey;
    }
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>💰</span><p>财务规划 · ${this._finHTML(p)}</p></div>
        <div class="event-card">
          <p class="event-text">钱不是目的，但没钱的日子确实难过。量入为出，把钱花在刀刃上。本年度可选规划 ${options.length} 项，年年轮换。${canUse ? '' : '<br><b style="color:var(--vermilion)">⚠️ 本年度财务规划已使用，明年可再规划</b>'}</p>
          <div class="event-choices">
            ${options.map((o, i) => {
              const optionAttrs = canUse
                ? `role="button" tabindex="0" aria-disabled="false" onclick="App.doFinance('${o.id}')"`
                : 'aria-disabled="true"';
              const optionLabel = this.escapeHtml(o.label);
              return `
              <div class="option" ${optionAttrs} aria-label="${optionLabel}${o.cost > 0 ? '，现金-' + o.cost : o.id === 'repayLoan' ? '，偿还负债' : '，借款'}" style="margin-bottom:6px;${canUse ? '' : 'opacity:0.5;pointer-events:none'}">
                <span class="option-label">${o.icon}</span>
                <span class="option-text"><b>${optionLabel}</b>${o.cost > 0 ? '（-' + o.cost + '）' : o.id === 'repayLoan' ? '（还）' : '（借）'}<br><span style="font-size:11px;color:var(--ink-lighter)">${this._posOnly(o.desc)}</span></span>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
  doFinance(id) {
    const p = engine.getPlayer();
    const h = engine.getHidden();
    // 每回合限1次（防指数膨胀）
    if ((p.flags.financeUsed || 0) >= 1) { this.showToast('本年度已进行过财务规划，明年再来', 'warning'); return; }
    if (!this._hasAP(1)) { this.showToast('精力不足，明年再做财务规划', 'warning'); return; }
    const acts = {
      life: { cost: 20, fn: () => { h.mentalPressure = Math.max(0, h.mentalPressure - 12); h.familyPressure = Math.max(0, h.familyPressure - 8); p.careerLog.push({ year: p.age, event: '🍲 花钱改善生活，日子过得舒坦了些' }); } },
      parents: { cost: 15, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 10); h.background = Math.min(100, h.background + 3); p.careerLog.push({ year: p.age, event: '👴 给父母孝敬了养老钱，家里更和睦' }); } },
      save: { cost: 10, fn: () => { p.flags.savingDeposit = true; p.careerLog.push({ year: p.age, event: '🏦 存了一笔一年期定期，明年本息到账' }); } },
      edu: { cost: 50, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 8); h.workAbility = Math.min(100, h.workAbility + 1); p.careerLog.push({ year: p.age, event: '📚 给孩子存了教育基金，心里踏实' }); } },
      house: { cost: 120, fn: () => { p.flags.hasHouse = true; h.familyPressure = Math.max(0, h.familyPressure - 15); p.reputation = Math.min(100, p.reputation + 2); p.careerLog.push({ year: p.age, event: '🏠 终于买了房，有了自己的家' }); } },
      charity: { cost: 25, fn: () => { p.reputation = Math.min(100, p.reputation + 4); h.integrity = Math.min(100, h.integrity + 2); p.careerLog.push({ year: p.age, event: '❤️ 资助了贫困学生，心里很充实' }); } },
      insurance: { cost: 30, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 6); h.risk = Math.max(0, (h.risk || 0) - 2); p.careerLog.push({ year: p.age, event: '🛡️ 给全家买了保险，心里安稳了不少' }); } },
      stock: { cost: 40, fn: () => { p.flags.boughtStock = true; const r = Math.random(); if (r < 0.3) { engine.cashIn(62); p.careerLog.push({ year: p.age, event: '📈 基金行情不错，大赚了一笔（净赚+22）' }); } else if (r < 0.75) { engine.cashIn(50); p.careerLog.push({ year: p.age, event: '📈 基金小有收益（净赚+10）' }); } else { engine.cashIn(34); p.careerLog.push({ year: p.age, event: '📉 基金行情不好，亏了一点（净亏-6）' }); } } }, // v2.1.6 本金返还修复：成本 40 实扣后收益只回净赚额（22/10），本金蒸发致净期望 -30（100% 亏损局）；改为到账=本金+净收益（62/50/34），净期望 +9.6（24% 高方差）与定期/黄金同构
      train: { cost: 35, fn: () => { h.workAbility = Math.min(100, (h.workAbility || 0) + 4); h.mentalPressure = Math.min(100, (h.mentalPressure || 0) + 3); p.careerLog.push({ year: p.age, event: '🎓 报了进修班充电，业务能力提升' }); } },
      travel: { cost: 45, fn: () => { h.mentalPressure = Math.max(0, h.mentalPressure - 12); h.familyPressure = Math.max(0, h.familyPressure - 6); p.heat = Math.max(0, (p.heat || 0) - 2); p.careerLog.push({ year: p.age, event: '🏝️ 全家出去旅游了一趟，心情舒畅' }); } },
      renovate: { cost: 50, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 8); h.mentalPressure = Math.max(0, h.mentalPressure - 4); p.careerLog.push({ year: p.age, event: '🛠️ 把老房子装修了一番，住着舒心' }); } },
      car: { cost: 60, fn: () => { h.mentalPressure = Math.max(0, h.mentalPressure - 6); h.familyPressure = Math.max(0, h.familyPressure - 8); p.reputation = Math.min(100, (p.reputation || 50) + 1); p.careerLog.push({ year: p.age, event: '🚗 买了辆车代步，日子轻快了些' }); } },
      gold: { cost: 70, fn: () => { p.flags.goldHeld = true; p.careerLog.push({ year: p.age, event: '📿 买了些黄金压箱底，等着增值' }); } },
      investMore: { cost: 60, fn: () => { p.flags.boughtStock = true; const r = Math.random(); if (r < 0.30) { engine.cashIn(90); p.careerLog.push({ year: p.age, event: '📊 定投加仓踩中行情，大赚一笔（净赚+30）' }); } else if (r < 0.75) { engine.cashIn(74); p.careerLog.push({ year: p.age, event: '📊 定投加仓小有收获（净赚+14）' }); } else { engine.cashIn(50); p.careerLog.push({ year: p.age, event: '📊 定投加仓遇到回调，亏了一点（净亏-10）' }); } } }, // v2.1.6 本金返还修复（同基金）：到账=本金+净收益（90/74/50），净期望 +12.8
      checkup: { cost: 40, fn: () => { engine.gainAttr('body', 2, 10); if (p.flags.chronicIllness) { p.flags.chronicIllness = false; } p.careerLog.push({ year: p.age, event: '🩺 做了全面体检，身体隐患早发现早处理（体质+2）' }); } },
      guanxi: { cost: 25, fn: () => { h.background = Math.min(100, h.background + 5); p.careerLog.push({ year: p.age, event: '🤝 人情往来投入，朋友圈更广了（背景+5）' }); } },
      givehome: { cost: 50, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 12); h.background = Math.min(100, h.background + 2); p.careerLog.push({ year: p.age, event: '🏡 把父母接来同住，一家人其乐融融' }); } },
      repayLoan: { cost: 0, fn: () => { const paid = engine.payDebt(80); h.mentalPressure = Math.max(0, h.mentalPressure - 8); h.familyPressure = Math.max(0, h.familyPressure - 6); p.careerLog.push({ year: p.age, event: '💳 提前还了一笔贷款，心里轻松不少（还本 ' + paid + '）' }); } },
      borrow: { cost: 0, fn: () => { // v2.44 额度递增：借得越多、欠得越多，额度越高
        const bc = (p.flags.borrowCount || 0);
        const amt = 20 + bc * 8 + Math.min(15, Math.floor(engine.debtTotal() / 20));
        p.flags.borrowed = true; p.flags.borrowCount = bc + 1;
        engine.addDebt('personal', amt); engine.cashIn(amt);
        h.mentalPressure = Math.max(0, h.mentalPressure - 10); h.familyPressure = Math.max(0, h.familyPressure - 5);
        p.careerLog.push({ year: p.age, event: '🕳️ 借了钱先花着（现金+' + amt + ' / 负债+' + amt + '）——债越滚越多，越借越敢借' }); } },
      loanOnline: { cost: 0, fn: () => { // v2.44 额度递增：网贷平台按信用与欠款额度爬升
        const lc = (p.flags.loanCount || 0);
        const amt = 35 + lc * 12 + Math.min(20, Math.floor(engine.debtTotal() / 15));
        p.flags.loanOnline = true; p.flags.loanCount = lc + 1;
        engine.addDebt('online', amt); engine.cashIn(amt);
        h.mentalPressure = Math.max(0, h.mentalPressure - 15);
        p.careerLog.push({ year: p.age, event: '📲 网贷秒到账（现金+' + amt + ' / 负债+' + amt + '）——额度越滚越高，利息也会咬人' }); } },
      gamble: { cost: 10, fn: () => { const r = Math.random(); if (r < 0.10) { engine.cashIn(30); p.careerLog.push({ year: p.age, event: '🎲 博彩中了！一夜回本（+30）' }); } else if (r < 0.70) { engine.cashOut(10); p.careerLog.push({ year: p.age, event: '🎲 博彩又输了（-10）' }); } else { p.flags.gamblingAddict = true; engine.cashOut(20); p.careerLog.push({ year: p.age, event: '🎲 博彩上头，越陷越深（-20，已上瘾）' }); } if (!p.flags.gambleStreak) { p.flags.gambleStreak = 1; p.flags.gambleLastYear = p.yearsWorked || 0; p.flags.gambleMiss = 0; p.careerLog.push({ year: p.age, event: '⚠️ 你染上了赌瘾——此后每隔几年，牌局都会找上你' }); } } },
      smartHome: { cost: 30, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 5); h.mentalPressure = Math.max(0, h.mentalPressure - 3); p.careerLog.push({ year: p.age, event: '🏠 全屋智能升级，回家就是享受' }); } },
      gym: { cost: 45, fn: () => { engine.gainAttr('body', 2, 10); h.mentalPressure = Math.max(0, h.mentalPressure - 4); p.careerLog.push({ year: p.age, event: '🏋️ 私教一对一，身材和精力都回来了（体质+2）' }); } },
      therapy: { cost: 35, fn: () => { h.mentalPressure = Math.max(0, h.mentalPressure - 8); p.careerLog.push({ year: p.age, event: '🛋️ 心理咨询师帮你理清了心结（压力-8）' }); } },
      books: { cost: 25, fn: () => { engine.gainAttr('iq', 1, 15); h.workAbility = Math.min(100, (h.workAbility || 0) + 2); p.careerLog.push({ year: p.age, event: '📖 买书报课充实自己（智商+1，能力+2）' }); } },
      pet: { cost: 30, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 5); engine.gainAttr('eq', 1, 15); p.careerLog.push({ year: p.age, event: '🐕 养了只毛孩子，家里热闹又治愈' }); } },
      donateAlma: { cost: 40, fn: () => { p.reputation = Math.min(100, (p.reputation || 50) + 3); h.integrity = Math.min(100, h.integrity + 1); p.careerLog.push({ year: p.age, event: '🎓 向母校捐了一笔奖学金，名声更好了（声誉+3）' }); } },
      seniorCheckup: { cost: 60, fn: () => { engine.gainAttr('body', 3, 10); if (p.flags.chronicIllness) { p.flags.chronicIllness = false; } p.careerLog.push({ year: p.age, event: '🏥 高端深度体检，身体隐患无处遁形（体质+3）' }); } },
      familyTourPlus: { cost: 70, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 10); h.mentalPressure = Math.max(0, h.mentalPressure - 10); p.careerLog.push({ year: p.age, event: '✈️ 豪华家庭游，全家人尽兴而归' }); } },
      housekeeper: { cost: 35, fn: () => { h.familyPressure = Math.max(0, h.familyPressure - 6); h.mentalPressure = Math.max(0, h.mentalPressure - 3); p.careerLog.push({ year: p.age, event: '🧹 请了家政，家务不再缠身' }); } },
      venture: { cost: 80, fn: () => { const r = Math.random(); if (r < 0.30) { engine.cashIn(140); p.careerLog.push({ year: p.age, event: '🚀 副业项目成了，大赚一笔（净赚+60）' }); } else if (r < 0.70) { engine.cashIn(96); p.careerLog.push({ year: p.age, event: '🚀 副业小有回报（净赚+16）' }); } else { engine.cashIn(50); p.careerLog.push({ year: p.age, event: '🚀 副业项目折了，亏了不少（净亏-30）' }); } } } // v2.1.6 本金返还修复（同基金/定投）：到账=本金+净收益（140/96/50），净期望 +15.4
    };
    const act = acts[id];
    if (!act) return;
    if (act.cost > 0) {
      const fin = p.finance || { cash: p.wealth || 0 };
      if (fin.cash < act.cost) { this.showToast('现金不足！', 'warning'); return; }
      engine.cashOut(act.cost);
    }
    act.fn();
    p.flags.financeUsed = (p.flags.financeUsed || 0) + 1;
    if (typeof engine.spendActionPoint === 'function') engine.spendActionPoint(1);
    this.playSound('coin');
    this.showToast('消费完成（本年度财务规划已用）', 'success');
    this.saveCheckpoint('finance');
    this.afterCareerStep();
  },
  nextYear() {
    this.safeProcess(() => {
      engine.runCareerYear();
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('next-year'); else engine.saveState();
      this.afterCareerStep();
    });
  },
  restYear() {
    this.safeProcess(() => {
      engine.restYear();
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('rest-year'); else engine.saveState();
      this.afterCareerStep();
    });
  },
  afterCareerStep() {
    const p = engine.getPlayer();
    const state = engine.getState();
    if (p.ending) {
      if (p.ending === 'arrest') this.playSound('arrest');
      else if (p.ending === 'central' || p.ending === 'skyline') this.playSound('promote');
      else if (p.ending === 'marry' || p.ending === 'entrepreneur') this.playSound('marry');
      this.renderContent(this.renderEnding());
      this.updateStatus();
    } else if (state.pendingPromotion) {
      this.renderContent(this.renderPromotionChoice());
      this.updateStatus();
    } else if (state.pendingTransfer) {
      this.renderContent(this.renderTransferChoice());
      this.updateStatus();
    } else if (!state.currentEvent && typeof engine.getPolicyProjectPendingEvent === 'function') {
      const pendingProjectEvent = engine.getPolicyProjectPendingEvent();
      if (pendingProjectEvent) {
        state.currentEvent = pendingProjectEvent;
        engine.setPhase('event');
        this.renderContent(this.renderEvent());
        this.updateStatus();
      } else {
        this.renderContent(this.renderCareer());
        this.updateStatus();
      }
    } else if (state.currentEvent && (state.currentEvent.eventType || state.currentEvent.type) === 'choice') {
      engine.setPhase('event');
      this.renderContent(this.renderEvent());
      this.updateStatus();
    } else {
      this.renderContent(this.renderCareer());
      this.updateStatus();
    }
  },
  renderPromotionChoice() {
    const pp = engine.getState().pendingPromotion;
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🏆</span><p>突破型晋升机会</p></div>
        <div class="event-card">
          <p style="font-size:16px;font-weight:700;margin-bottom:8px;color:var(--vermilion)">${App.escapeHtml(pp.source)}</p>
          <p style="font-size:13px;color:var(--ink-light);margin-bottom:12px;line-height:1.6">${App.escapeHtml(pp.desc)}</p>
          ${pp.targetUnit ? `
          <div class="career-stats">
            <div class="stat-item"><span>🏛 目标单位</span><span>${App.escapeHtml(pp.targetUnit.name)}（${App.escapeHtml(pp.targetUnit.level)}）</span></div>
            <div class="stat-item"><span>📈 晋升空间</span><span>${App.escapeHtml(pp.targetUnit.promotionSpace)}</span></div>
            <div class="stat-item"><span>😰 压力指数</span><span>${App.escapeHtml(pp.targetUnit.stress)}</span></div>
          </div>` : ''}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.acceptPromo()">接受晋升</button>
          <button class="btn btn-secondary" onclick="App.declinePromo()" style="margin-top:8px">放弃机会</button>
        </div>
      </div>
    `;
  },
  acceptPromo() {
    engine.acceptPromotion(); this.playSound('promote');
    this.saveCheckpoint('promotion-accepted');
    // v2.1.6 即时成就提示（晋升是高频成就触发点）
    this.showAchievementToast(this.checkAchievements(engine.getPlayer()));
    this.afterCareerStep();
  },
  declinePromo() { engine.declinePromotion(); this.saveCheckpoint('promotion-declined'); this.afterCareerStep(); },
  renderTransferChoice() {
    const pt = engine.getState().pendingTransfer;
    const isLateral = pt.type === 'lateral';
    const isGrassroots = pt.type === 'grassroots';
    const isGrassrootsConfirm = pt.type === 'grassrootsConfirm';
    const isReturn = pt.type === 'grassrootsReturn';
    const isForcedStay = pt.type === 'grassrootsForcedStay';
    const isForcedDemotion = pt.type === 'forcedDemotion';
    const lateralTone = pt.tone || (pt.reason && pt.reason.includes('更核心') ? 'positive' : pt.reason && pt.reason.includes('一般部门') ? 'negative' : 'neutral');
    const icon = isReturn ? '🎉' : isGrassrootsConfirm ? '📋' : isGrassroots ? '🌾' : isForcedStay ? '📌' : isForcedDemotion ? '⚠️' : isLateral ? '🔄' : '⚠️';
    const title = isReturn ? '基层历练期满' : isGrassrootsConfirm ? '基层临时派驻确认' : isGrassroots ? '下派基层锻炼' : isForcedStay ? '基层历练结果' : isForcedDemotion ? '排挤调任通知' : isLateral ? '轮岗交流机会' : '通知';
    const btnText = isReturn ? '接受提拔，返回原单位' : isGrassrootsConfirm ? '确认临时下派' : isGrassroots ? '接受下派' : isForcedStay ? '接受当前去向' : isForcedDemotion ? '服从安排，接受调任' : '接受平调';
    const targetUnit = pt.targetUnit || {};
    const targetUnitName = App.escapeHtml(targetUnit.name || '未知单位');
    const targetUnitLevel = App.escapeHtml(targetUnit.level || '未知层级');
    const returnUnitName = App.escapeHtml(pt.returnUnit && pt.returnUnit.name ? pt.returnUnit.name : '原单位');
    const safeEffects = App.escapeHtml(pt.effects || '');
    const desc = isReturn
      ? `🏆 基层历练考核通过！返回原单位，职级+1，权重+4`
      : isGrassrootsConfirm
        ? `下派至: <strong>${targetUnitName}</strong>（${targetUnitLevel}）<br>锻炼时间: <strong>${App.escapeHtml(pt.duration)}年</strong>${safeEffects ? '<br>预期效果: ' + safeEffects : ''}`
        : isGrassroots
          ? `下派至: <strong>${targetUnitName}</strong>（${targetUnitLevel}）<br>锻炼3-8年后根据表现确定能否回归`
          : isForcedStay
            ? `${safeEffects}<br>当前基层阶段已到期；拒绝当前安排后将返回<strong>${returnUnitName}</strong>`
            : isForcedDemotion
              ? `被调至: <strong>${targetUnitName}</strong>（${targetUnitLevel}），职级-1，压力+10，声誉-5<br>长期未获晋升的你已经失去了组织的信任，此调任带有排挤性质`
              : isLateral
                ? lateralTone === 'positive'
                  ? `组织交流至: <strong>${targetUnitName}</strong>（${targetUnitLevel}），原职级不变`
                  : lateralTone === 'negative'
                    ? `被安排平调至: <strong>${targetUnitName}</strong>（${targetUnitLevel}），原职级不变`
                    : `建议平调至: <strong>${targetUnitName}</strong>（${targetUnitLevel}），原职级不变`
                : '';
    const note = isGrassrootsConfirm
      ? '🌱 这是一次临时基层派驻。确认后才会切换到乡镇/街道，当前仍保留原单位；也可以暂不接受，保留原岗位。'
      : isGrassroots
        ? '🌱 基层锻炼是年轻干部成长的必经之路，也是组织培养干部的重要方式。'
        : isReturn
          ? '🎊 恭喜！基层历练表现优异，组织决定提拔重用！'
          : isForcedStay
            ? '📌 这是基层期满后的去向安排：接受可留任/下调，拒绝则返回原单位并承担后续考核代价。'
            : isForcedDemotion
              ? '⚠️ 拒绝调任只会让处境更艰难（晋升进度+5年延误，声誉-3，压力+8）。你也可以选择提前退休，保住最后体面。'
              : isLateral
                ? lateralTone === 'positive'
                  ? '🔄 组织安排同级交流至更核心部门，是培养锻炼干部的重要方式，机会难得。'
                  : lateralTone === 'neutral'
                    ? '🔄 同级交流是干部培养的常见方式，换个环境重新出发，为后续发展积累经验。'
                    : '🔄 长期未获晋升的你被建议轮岗交流。拒绝会加重边缘化，也可以选择提前退休。'
                : '';
    return `
      <div class="stage fade-in">
        <div class="lead"><span>${icon}</span><p>${App.escapeHtml(title)}</p></div>
        <div class="event-card">
          <p style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--vermilion)">${App.escapeHtml(pt.reason)}</p>
          <p style="font-size:13px;color:var(--ink-light);margin-bottom:12px;line-height:1.6">${desc}</p>
          <p style="font-size:12px;color:var(--ink-lighter);margin-bottom:8px">${note}</p>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.acceptTransfer()">${btnText}</button>
          ${!isReturn ? `<button class="btn btn-secondary" onclick="App.declineTransfer()" style="margin-top:8px">${isGrassrootsConfirm ? '暂不接受，保留原岗位' : isForcedStay ? '拒绝当前安排，返回原单位' : isGrassroots ? '争取留在原单位' : isForcedDemotion ? '拒绝安排，硬扛下去' : isLateral && lateralTone === 'negative' ? '拒绝安排，硬扛下去' : '放弃这次交流机会'}</button>` : ''}
          ${(isForcedDemotion || (isLateral && lateralTone === 'negative')) ? `<button class="btn btn-danger" onclick="App.retireEarly()" style="margin-top:8px">提前退休，急流勇退</button>` : ''}
        </div>
      </div>
    `;
  },
  acceptTransfer() { engine.acceptTransfer(); this.saveCheckpoint('transfer-accepted'); this.afterCareerStep(); },
  declineTransfer() { engine.declineTransfer(); this.saveCheckpoint('transfer-declined'); this.afterCareerStep(); },
  retireEarly() { engine.retireEarly(); this.saveCheckpoint('early-retirement'); this.afterCareerStep(); },
  // v2.33 体验：禁用选项的具体原因（替代笼统的"条件不足"提示）
  getChoiceBlockReason(c) {
    const p = engine.getPlayer();
    if (!c) return '';
    const bg = engine.getHidden().background;
    if (c.minBackground !== undefined && bg < c.minBackground) return '背景不足（需要背景 ' + c.minBackground + '，当前 ' + Math.round(bg) + '）';
    if (c.maxBackground !== undefined && bg > c.maxBackground) return '背景过高（要求背景 ≤' + c.maxBackground + '）';
    if (c.minWealth !== undefined && (p.wealth || 0) < c.minWealth) return '财富不足（需要 ' + c.minWealth + '，当前 ' + Math.round(p.wealth || 0) + '）';
    if (c.maxWealth !== undefined && (p.wealth || 0) > c.maxWealth) return '财富过高（要求财富 ≤' + c.maxWealth + '）';
    if (c.requireFlag && !(p.flags && p.flags[c.requireFlag])) return '需要前置事件（' + c.requireFlag + '）';
    if (c.excludeFlag && (p.flags && p.flags[c.excludeFlag])) return '与现有处境冲突';
    return '';
  },
  renderEvent() {
    const event = engine.getState().currentEvent;
    if (!event || !event.choices) {
      engine.setPhase('career');
      return this.renderCareer();
    }
    // v2.23 晋升答辩：ent113 触发时渲染完整 3 题答辩面板（业绩/廉政/群众），成绩决定晋升修正 flag
    if (event.id === 'ent113') return this.renderDefense(event);
    // 事件时间：从事件文本无法取年龄，用玩家当前年龄 + 事件类型标签（纯文字，避免 emoji 渲染失败）
    const p = engine.getPlayer();
    const stageLabel = event.stage === 'work' ? '工' : event.stage === 'life' ? '生' : '事';
    // M2.2 事件插图：阶段图标（icons.js 缺省时自动退化为无图）
    const stageIcon = (typeof LIcon === 'function')
      ? LIcon(event.stage === 'work' ? 'briefcase' : event.stage === 'life' ? 'home' : 'scroll', 15, 'event-stage-icon')
      : '';
    return `
      <div class="stage fade-in event-stage">
        <div class="lead"><span class="lead-badge">${p.age || 0}</span><p>${stageIcon}${App.escapeHtml(event.title)}<span class="event-stage-tag">${stageLabel}</span></p></div>
        <div class="event-card">
          <p class="event-text">${App.escapeHtml(event.text)}</p>
          <div class="event-choices">
            ${event.choices.map((c, i) => {
              const enabled = engine.isChoiceEnabled(c);
              const blockReason = enabled ? '' : this.getChoiceBlockReason(c);
              const disabledAttrs = enabled ? '' : ' disabled aria-disabled="true" title="' + App.escapeHtml(blockReason || '条件不足，无法选择') + '"';
              return `
              <button type="button" class="option${enabled ? '' : ' disabled'}" data-event-choice="${i}"${disabledAttrs} aria-label="${enabled ? '选择' : '不可选择'} ${String.fromCharCode(65 + i)}：${App.escapeHtml(c.text)}">
                <span class="option-label">${String.fromCharCode(65 + i)}</span>
                <span class="option-copy"><span class="option-text">${App.escapeHtml(c.text)}</span>${enabled ? '' : `<span class="option-block-reason">🔒 ${App.escapeHtml(blockReason || '当前条件不足')}</span>`}<span class="option-effects">
                  ${Object.entries(c.effects || {})
                    .filter(([k, v]) => typeof v === 'number' && v !== 0)
                    // v2.18 沉浸化：仅展示关键项，避免玩家精算最优解；v2.58 扩展核心风险字段；v2.1.24 补充项目舆情的民间口碑变化
                    .filter(([k]) => ['workAbility', 'mentalPressure', 'wealth', 'positionWeight', 'background', 'risk', 'heat', 'integrity', 'reputation', 'desire', 'familyPressure', 'peopleReputation'].includes(k))
                    .map(([k, v]) => {
                    const labels = { workAbility: '能力', mentalPressure: '压力', wealth: '财富', positionWeight: '职务权重', background: '背景', risk: '风险', heat: '热度', integrity: '廉洁', reputation: '声誉', peopleReputation: '民间口碑', desire: '欲望', familyPressure: '家压' };
                    // 负向数值（+2 为坏事标红，-2 为好事标绿）：压力/风险/热度/欲望/家压
                    const DIR = { mentalPressure: -1, risk: -1, heat: -1, desire: -1, familyPressure: -1 };
                    const label = labels[k] || k;
                    const good = (DIR[k] || 1) * v > 0;
                    return `<span class="effect ${good ? 'pos' : 'neg'}">${label}${v > 0 ? '+' : ''}${v}</span>`;
                  }).join('')}
                </span></span>
              </button>
            `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },
  // ===== v2.23 晋升答辩面板（3 题制） + v2.45 题库扩充（3 套随机，每套 3 题） =====
  // 每套 3 题，judge 返回 {delta, note, apply}；apply 在答完统一结算
  DEFENSE_SETS: [
    [ // 套 1：经典三问（业绩数据/廉政表态/群众走访）
    { q: '第一题 · 业绩陈述：谈谈你上任以来的主要成绩。', options: [
      { text: '用数据说话：晒出量化实绩', judge: (ctx) => (ctx.hidden.workAbility >= 60 || ctx.attrs.iq >= 6) ? { delta: 1, note: '数据扎实，评委点头' } : { delta: 0, note: '数据平平，缺乏亮点' } },
      { text: '适度包装，成绩往大了说', judge: () => ({ delta: -1, note: '被追问细节，场面尴尬', apply: { risk: 1 } }) },
      { text: '谦逊带过，功劳归集体', judge: () => ({ delta: 0, note: '低调务实，评委认可', apply: { eq: 1 } }) },
    ]},
    { q: '第二题 · 廉政表态：如何守住廉洁底线？', options: [
      { text: '制度约束 + 主动报备个人事项', judge: () => ({ delta: 1, note: '表态掷地有声', apply: { integrity: 1 } }) },
      { text: '场面话表决心', judge: () => ({ delta: 0, note: '没毛病，也没印象', apply: { risk: 1 } }) },
      { text: '强调收入低、诱惑大', judge: () => ({ delta: -1, note: '评委皱眉', apply: { risk: 1 } }) },
    ]},
    { q: '第三题 · 群众工作：群众反映的问题怎么处理？', options: [
      { text: '实地走访，限期解决', judge: (ctx) => (ctx.player.peopleReputation >= 60) ? { delta: 1, note: '有实招，群众口碑作证' } : { delta: 0, note: '诚意有余，但缺群众基础' } },
      { text: '转交相关部门跟进', judge: () => ({ delta: 0, note: '程序正确，无功无过' }) },
      { text: '先压一压，过阵子再说', judge: () => ({ delta: -1, note: '评委当场黑脸', apply: { peopleReputation: -1 } }) },
    ]},
    ],
    [ // 套 2：攻坚案例/下属送礼/信访积案
    { q: '第一题 · 业绩陈述：举一个你牵头攻坚的案例。', options: [
      { text: '具体项目全流程复盘，突出难点突破', judge: (ctx) => (ctx.hidden.workAbility >= 60 || ctx.attrs.iq >= 6) ? { delta: 1, note: '案例扎实，评委追问从容' } : { delta: 0, note: '案例完整但亮点不足' } },
      { text: '强调"没有功劳也有苦劳"', judge: () => ({ delta: -1, note: '评委更看重实效', apply: { risk: 1 } }) },
      { text: '把团队功劳都归到自己身上', judge: () => ({ delta: 0, note: '有魄力，但评委暗自摇头', apply: { eq: -1 } }) },
    ]},
    { q: '第二题 · 廉政情境：下属给你送了点土特产，怎么处理？', options: [
      { text: '当场拒绝，说明纪律要求', judge: () => ({ delta: 1, note: '干脆利落，评委点头', apply: { integrity: 1 } }) },
      { text: '收下后上交纪委登记', judge: () => ({ delta: 0, note: '程序合规，但略显生硬', apply: { integrity: 1 } }) },
      { text: '不好驳面子，先收下', judge: () => ({ delta: -1, note: '评委眉头一皱', apply: { risk: 2 } }) },
    ]},
    { q: '第三题 · 群众工作：一起多年的信访积案怎么办？', options: [
      { text: '主动包案，协调多部门限期化解', judge: (ctx) => (ctx.player.peopleReputation >= 60) ? { delta: 1, note: '敢于碰硬，群众基础托底' } : { delta: 0, note: '诚意可嘉，但需更实招' } },
      { text: '逐级请示，按程序推进', judge: () => ({ delta: 0, note: '稳妥，无功无过' }) },
      { text: '说明历史原因复杂，建议维持现状', judge: () => ({ delta: -1, note: '回避矛盾，评委失望', apply: { peopleReputation: -1 } }) },
    ]},
    ],
    [ // 套 3：短板坦诚/亲友说情/突发舆情
    { q: '第一题 · 业绩陈述：你的短板是什么？', options: [
      { text: '坦诚短板 + 给出改进计划', judge: () => ({ delta: 1, note: '真诚坦荡，评委欣赏', apply: { integrity: 1 } }) },
      { text: '避重就轻，说些无关痛痒的', judge: () => ({ delta: 0, note: '圆滑，但缺乏印象' }) },
      { text: '辩解"是环境限制，不是能力问题"', judge: () => ({ delta: -1, note: '评委觉得缺乏担当', apply: { risk: 1 } }) },
    ]},
    { q: '第二题 · 廉政情境：亲戚找你给项目打招呼，怎么回应？', options: [
      { text: '讲清纪律红线，坚决拒绝', judge: () => ({ delta: 1, note: '立场坚定，评委认可', apply: { integrity: 1 } }) },
      { text: '打太极，说"按程序来"', judge: () => ({ delta: 0, note: '不得罪人，但略显油滑', apply: { eq: 1 } }) },
      { text: '含糊应允，先拖着', judge: () => ({ delta: -1, note: '评委闻出风险味道', apply: { risk: 2 } }) },
    ]},
    { q: '第三题 · 群众工作：突发舆情，群众在网络上质疑你，怎么办？', options: [
      { text: '主动回应，公布处理进展', judge: (ctx) => (ctx.player.peopleReputation >= 60 || ctx.hidden.workAbility >= 60) ? { delta: 1, note: '公开透明，舆情降温' } : { delta: 0, note: '回应及时但缺乏细节支撑' } },
      { text: '冷处理，等热度过去', judge: () => ({ delta: 0, note: '稳妥，但可能发酵', apply: { risk: 1 } }) },
      { text: '删帖压制，内部消化', judge: () => ({ delta: -1, note: '评委严肃指出不妥', apply: { peopleReputation: -2 } }) },
    ]},
    ],
  ],
  renderDefense(event) {
    const p = engine.getPlayer();
    // v2.45 状态防御：_defense 残留/越界时重置；答辩开始随机抽一套题（3 套 × 3 题）
    let st = App._defense;
    if (!st || st.set === undefined || st.q === undefined || st.q < 0 || st.q >= 3 || st.set < 0 || st.set >= this.DEFENSE_SETS.length) {
      st = App._defense = { set: Math.floor(Math.random() * this.DEFENSE_SETS.length), q: 0, score: 0 };
    }
    const qs = this.DEFENSE_SETS[st.set];
    const cur = qs[st.q];
    return `
      <div class="stage fade-in event-stage">
        <div class="lead"><span class="lead-badge">${p.age || 0}</span><p>${App.escapeHtml(event.title)}<span class="event-stage-tag">答</span></p></div>
        <div class="event-card">
          <p class="event-text">组织考察通过，进入任职前谈话环节。会议室里三位领导正襟危坐——临门一脚，答辩表现将影响组织对你的印象。（第 ${st.q + 1}/3 题）</p>
          <p style="font-size:14px;font-weight:700;color:var(--ink);margin:10px 0 6px">${App.escapeHtml(cur.q)}</p>
          <div class="event-choices">
            ${cur.options.map((o, i) => `
              <button type="button" class="option" data-defense-answer="${i}" aria-label="选择 ${String.fromCharCode(65 + i)}：${App.escapeHtml(o.text)}">
                <span class="option-label">${String.fromCharCode(65 + i)}</span>
                <span class="option-text">${App.escapeHtml(o.text)}</span>
              </button>`).join('')}
          </div>
        </div>
      </div>
    `;
  },
  defenseAnswer(oi) {
    this.safeProcess(() => {
      const p = engine.getPlayer();
      let st = App._defense;
      if (!st || st.set === undefined || st.q === undefined || st.q < 0 || st.q >= 3 || st.set < 0 || st.set >= this.DEFENSE_SETS.length) {
        st = App._defense = { set: Math.floor(Math.random() * this.DEFENSE_SETS.length), q: 0, score: 0 };
      }
      const ctx = { player: p, hidden: engine.getHidden(), attrs: engine.getState().attrs };
      const r = this.DEFENSE_SETS[st.set][st.q].options[oi].judge(ctx);
      if (r.apply) { Object.entries(r.apply).forEach(([k, v]) => { if (k === 'risk') engine.getHidden().risk = Math.min(100, engine.getHidden().risk + v); if (k === 'peopleReputation') p.peopleReputation = Math.max(0, Math.min(100, (p.peopleReputation || 50) + v)); if (k === 'eq') ctx.attrs.eq = Math.min(15, (ctx.attrs.eq || 0) + v); if (k === 'integrity') engine.getHidden().integrity = Math.min(100, engine.getHidden().integrity + v); }); }
      st.score += r.delta;
      st.q += 1;
      if (st.q >= 3) {
        const score = st.score;
        App._defense = null;
        // 成绩 → 晋升修正 flag（复用 checkPromotion 的消费机制）
        if (score >= 3) { p.flags.promotionPrepared = true; p.flags.promotionExcellence = (p.flags.promotionExcellence || 0) + 1; p.careerLog.push({ year: p.age, event: '🗣️ 晋升答辩：准备充分（3/3），组织印象深刻' }); this.showToast('答辩 3/3！准备充分，下次晋升概率提升', 'success'); }
        else if (score === 2) { p.flags.promotionHonest = true; p.careerLog.push({ year: p.age, event: '🗣️ 晋升答辩：中规中矩（2/3），如实作答' }); this.showToast('答辩 2/3，坦诚务实', 'info'); } // v2.1.6 修复：promotionHonest 原仅 ent113 旧选项设置（renderDefense 绕过永不渲染），诚实答辩奖励（逃脱+0.15/被调查减半）成死代码——中规中矩=如实作答，补设
        else { p.flags.promotionSloppy = true; p.careerLog.push({ year: p.age, event: '🗣️ 晋升答辩：表现欠佳（' + score + '/3），领导皱了皱眉' }); this.showToast('答辩 ' + score + '/3，印象不佳，下次晋升概率下降', 'warning'); }
        delete p.flags.promotionCandidate;
        // v2.45 修复：答辩走 App.defenseAnswer 不走引擎 handleEventChoice，currentEvent 从未清理——
        // 残留会导致下次事件渲染再次弹出答辩面板（按键失灵感）。补清理 + 结局检查。
        engine.getState().currentEvent = null;
        if (typeof engine.checkEndings === 'function') engine.checkEndings();
        if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('defense'); else engine.saveState();
        engine.setPhase('career');
        this.renderContent(this.renderCareer());
        this.updateStatus();
      } else {
        this.renderContent(this.renderDefense(null));
      }
    });
  },
  handleEventChoice(idx) {
    this.safeProcess(() => {
      engine.handleEventChoice(idx);
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('event-choice'); else engine.saveState();
      const p = engine.getPlayer();
      if (p.ending) {
        this.renderContent(this.renderEnding());
        this.updateStatus();
      } else {
        engine.setPhase('career');
        this.renderContent(this.renderCareer());
        this.updateStatus();
      }
    });
  },
});
