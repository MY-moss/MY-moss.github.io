// app-planning.js —— 年度筹划回合：统一行动板
// 把原先散落在生涯页底部、各自"每年一次"的动作（财务/人脉/子女）收敛为一块"精力点"驱动的筹划板：
// 玩家每年拿一池精力（AP），在理财、人脉、子女之间自由分配——花完即止，形成真实取舍。
// 引擎侧见 engine-planning.js；headless 模拟不调用这些可自由动作，平衡不受影响。
Object.assign(App, {
  // 精力是否足够（兜底：旧运行时没有 AP 系统时视为充足）
  _hasAP(n) {
    if (!engine || typeof engine.canAffordAP !== 'function') return true;
    return engine.canAffordAP(n || 1);
  },
  _apInfo() {
    if (!engine || typeof engine.getActionPoints !== 'function') return { cur: 0, max: 0, legacy: true };
    const cur = engine.getActionPoints();
    const max = typeof engine.getMaxActionPoints === 'function' ? engine.getMaxActionPoints() : (engine.getPlayer().maxActionPoints || cur);
    return { cur, max, legacy: false };
  },
  // 子女培养入口门槛（筹划板与人脉页家庭卡共用）：孩子 40 岁前仍可安排；旧档缺 childAge 视为可培养
  _canRaiseChild(p) {
    return !!p && !!p.hasChildren && (typeof p.childAge !== 'number' || p.childAge < 40);
  },
  // 年度筹划板：精力指示 + 行动按钮（取代 renderCareer 底部散落按钮）
  renderPlanningBoard(p, h) {
    const info = this._apInfo();
    const ap = info.cur;
    const showRestBtn = !p.flags || (p.flags.restCount || 0) < 3;
    const hasContacts = !!(p.contacts && p.contacts.length > 0);
    const financeUsed = (p.flags && p.flags.financeUsed) || 0;
    const childUsed = (p.flags && p.flags.childRaiseUsed) || 0;
    const showChild = this._canRaiseChild(p);

    const apPips = info.legacy ? '' : Array.from({ length: info.max }, (_, i) =>
      `<span class="ap-pip${i < ap ? ' is-on' : ''}" aria-hidden="true">●</span>`).join('');
    const apLine = info.legacy ? '' : `
      <div class="planning-ap">
        <span class="planning-ap-label">本年精力</span>
        <span class="ap-pips">${apPips}</span>
        <span class="planning-ap-num">${ap}/${info.max}</span>
      </div>
      <p class="planning-note">${ap > 0 ? '精力可用于理财、人脉与子女培养，用完即止，取舍即策略。' : '本年精力已用尽，安心进入下一年吧。'}</p>`;

    const btn = (label, onclick, opts) => {
      const o = opts || {};
      const costTag = o.cost ? `<span class="ap-cost">精力-${o.cost}</span>` : '';
      const disabledAttrs = o.disabled ? ` disabled aria-disabled="true" title="${App.escapeHtml(o.reason || '')}"` : '';
      return `<button type="button" class="btn ${o.kind || 'btn-secondary'}" onclick="${onclick}"${disabledAttrs} style="margin-top:6px">${label}${costTag}</button>`;
    };

    return `
      ${apLine ? `<div class="planning-board">${apLine}</div>` : ''}
      ${this.renderChallengeHint()}
      ${this.renderEraWaveBanner()}
      ${this.renderMicroResponseCard()}
      ${this.renderOpportunityCards()}
      <div class="sticky-action">
        <button type="button" class="btn btn-primary" onclick="App.nextYear()">进入下一年</button>
        ${showRestBtn ? '<button type="button" class="btn btn-secondary" onclick="App.restYear()" style="margin-top:6px">🌿 休整一年（降压力、降风险，休整年仍计生活支出与负债利息）</button>' : ''}
        ${hasContacts ? btn('🤝 人脉经营', 'App.showNetworkPanel()', { cost: 1, disabled: !this._hasAP(1), reason: '精力不足（需要 1 点）' }) : ''}
        ${btn('💰 财务规划', 'App.showFinancePanel()', { cost: 1, disabled: !this._hasAP(1) || financeUsed > 0, reason: financeUsed ? '本年度财务规划已使用' : '精力不足（需要 1 点）' })}
        ${showChild ? btn('👨‍👩‍👧 子女培养', 'App.showChildPanel()', { cost: 1, disabled: !this._hasAP(1) || childUsed > 0, reason: childUsed ? '今年已经安排过孩子的事了' : '精力不足（需要 1 点）' }) : ''}
        <button type="button" class="btn btn-secondary" onclick="App.showLifeChart()" style="margin-top:6px">📊 人生数据</button>
        <button type="button" class="btn btn-secondary" onclick="App.showArchiveFull()" style="margin-top:6px">📂 档案回看（${(p.careerLog || []).length} 条留痕）</button>
        <button type="button" class="btn btn-secondary" onclick="App.showExperience()" style="margin-top:6px">📜 人生经历（分类留痕）</button>
      </div>
    `;
  },
  // P3 时代背景波：当年时代主题横幅（轮转展示，影响机会候选的浮现倾向）
  // v2.1.76 挑战长廊局内进度提示：跨周目目标最接近完成的一项（无进行中挑战时不渲染）
  renderChallengeHint() {
    const hint = typeof this.challengeProgressHint === 'function' ? this.challengeProgressHint() : null;
    if (!hint) return '';
    return `<div class="challenge-hint" title="${App.escapeHtml(hint.desc)}">🏆 挑战进度：${hint.icon} ${App.escapeHtml(hint.title)} ${hint.cur}/${hint.goal}（距离结算页推进还差 ${Math.max(0, hint.goal - hint.cur)} 次）</div>`;
  },
  renderEraWaveBanner() {
    if (!engine || typeof engine.getEraWave !== 'function') return '';
    const wave = engine.getEraWave();
    if (!wave) return '';
    const era = typeof engine.getEra === 'function' ? engine.getEra() : null;
    const icon = era && era.icon ? era.icon : '📜';
    return `
      <div class="era-wave">
        <span class="era-wave-icon" aria-hidden="true">${icon}</span>
        <span class="era-wave-copy"><b>时代风向 · ${App.escapeHtml(wave.label || '')}</b><small>${App.escapeHtml(wave.desc || '')}</small></span>
      </div>
    `;
  },
  // P2 微决策：敌人使绊后的回应窗口（伤害已发生，回应决定能挽回多少）
  renderMicroResponseCard() {
    if (!engine || !engine.state || !engine.state.pendingMicro) return '';
    const m = engine.state.pendingMicro;
    if (m.kind !== 'enemy') return '';
    const hitLabel = m.hit === 'risk' ? '纪检风险' : m.hit === 'reputation' ? '声誉' : '心理压力';
    const canRespond = this._hasAP(1);
    const reason = canRespond ? '' : '精力不足（需要 1 点）';
    return `
      <div class="micro-card">
        <div class="micro-head">⚠️ ${App.escapeHtml(m.enemyName)} 使绊之后——你打算怎么回应？<span class="micro-hit">${App.escapeHtml(hitLabel)}受损</span></div>
        <div class="micro-actions">
          <button type="button" class="btn btn-secondary micro-btn" onclick="App.resolveMicroResponse('ignore')">忍下这口气</button>
          <button type="button" class="btn btn-secondary micro-btn" onclick="App.resolveMicroResponse('clarify')" ${canRespond ? '' : 'disabled aria-disabled="true"'} title="${App.escapeHtml(reason || '向组织说明，有机会挽回部分损失')}">向组织说明<span class="ap-cost">精力-1</span></button>
          <button type="button" class="btn btn-secondary micro-btn" onclick="App.resolveMicroResponse('confront')" ${canRespond ? '' : 'disabled aria-disabled="true"'} title="${App.escapeHtml(reason || '当面交涉，可能全额挽回但也可能激化')}">当面交涉<span class="ap-cost">精力-1</span></button>
        </div>
      </div>
    `;
  },
  resolveMicroResponse(mode) {
    if (!engine || typeof engine.resolveMicroResponse !== 'function') return;
    const r = engine.resolveMicroResponse(mode);
    if (!r.ok) { this.showToast(r.code === 'NO_AP' ? '精力不足，无法回应' : '当前没有需要回应的事', 'warning'); return; }
    this.showToast('已回应', 'success');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('micro-response'); else engine.saveState();
    this.renderContent(this.renderCareer());
    this.updateStatus();
  },
  // P2 机会事件：筹划板浮现的可选支线（盲区事件优先），花精力追查即走正常事件流程
  renderOpportunityCards() {
    if (!engine || typeof engine.getOpportunities !== 'function') return '';
    const state = engine.state || {};
    if (state.currentEvent || state.pendingTransfer || state.pendingPromotion) return '';
    const opps = engine.getOpportunities();
    if (!opps || opps.length === 0) return '';
    const canPursue = this._hasAP(1);
    const reason = canPursue ? '' : '精力不足（需要 1 点）';
    const stageLabel = e => e.stage === 'work' ? '工' : e.stage === 'life' ? '生' : '事';
    return `
      <div class="opp-section">
        <div class="opp-section-head">📜 本年可追查的机会 <span>花 1 点精力主动跟进，不追则随时间淡去</span></div>
        ${opps.map(e => `
          <div class="opp-card">
            <div class="opp-head"><span class="opp-stage">${stageLabel(e)}</span><b>${App.escapeHtml(e.title || '未知机会')}</b></div>
            <p class="opp-text">${App.escapeHtml(String(e.text || '').slice(0, 60))}${String(e.text || '').length > 60 ? '……' : ''}</p>
            <button type="button" class="btn btn-secondary opp-pursue" onclick="App.pursueOpportunity('${App.escapeHtml(e.id)}')" ${canPursue ? '' : 'disabled aria-disabled="true"'} title="${App.escapeHtml(reason || '追查此事')}">追查<span class="ap-cost">精力-1</span></button>
          </div>
        `).join('')}
      </div>
    `;
  },
  pursueOpportunity(id) {
    if (!engine || typeof engine.pursueOpportunity !== 'function') return;
    const r = engine.pursueOpportunity(id);
    if (!r.ok) {
      const msgs = { NO_AP: '精力不足，明年再追', SLOT_BUSY: '当前已有待处理的事', EXPIRED: '这个机会已经过去了', INELIGIBLE: '情况有变，此事已不可追查' };
      this.showToast(msgs[r.code] || '无法追查', 'warning');
      this.renderContent(this.renderCareer());
      this.updateStatus();
      return;
    }
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('opportunity-pursued'); else engine.saveState();
    this.afterCareerStep();
  },
  // 子女培养面板（原先散在人脉页里的三个按钮收口为独立入口，供筹划板调用）
  showChildPanel() {
    const p = engine.getPlayer();
    if (!p.hasChildren) { this.showToast('还没有孩子', 'warning'); return; }
    const used = (p.flags && p.flags.childRaiseUsed) || 0;
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>👨‍👩‍👧</span><p>子女培养 · 孩子 ${p.childAge || 0} 岁</p></div>
        <div class="event-card">
          <p class="event-text">孩子的成长只有一次。教育、陪伴、或放手自由，各有各的路。${used ? '<br><b style="color:var(--vermilion)">⚠️ 今年已经安排过孩子的事了</b>' : ''}</p>
          <div class="event-choices">
            <button type="button" class="option" onclick="App.doRaiseChild('education')" ${used ? 'disabled aria-disabled="true"' : ''}><span class="option-label">A</span><span class="option-text"><b>教育投入</b>（现金-10）<br><span style="font-size:11px;color:var(--ink-lighter)">重视学业与习惯养成</span></span></button>
            <button type="button" class="option" onclick="App.doRaiseChild('company')" ${used ? 'disabled aria-disabled="true"' : ''}><span class="option-label">B</span><span class="option-text"><b>陪伴成长</b><br><span style="font-size:11px;color:var(--ink-lighter)">多花时间陪在孩子身边</span></span></button>
            <button type="button" class="option" onclick="App.doRaiseChild('free')" ${used ? 'disabled aria-disabled="true"' : ''}><span class="option-label">C</span><span class="option-text"><b>自由发展</b><br><span style="font-size:11px;color:var(--ink-lighter)">给孩子更多自主空间</span></span></button>
          </div>
        </div>
        <div class="sticky-action">
          <button type="button" class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
});
