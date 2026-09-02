// 人脉主玩法界面：关系卡、双槽位预览、筛选和轻量路线图。
// 依赖：app-core.js 的 renderContent/escapeHtml/showToast，engine-network.js 的稳定接口。
const NETWORK_STATUS_LABELS = {
  active: '当前可联系',
  remote: '异地',
  transferred: '已调任',
  retired: '退休',
  recused: '回避中',
  lost: '失联',
  rival: '竞争/冲突'
};
const NETWORK_ROLE_LABELS = {
  mentor: '导师/前辈',
  sponsor: '支持者',
  peer: '同事/同学',
  bridge: '桥接关系',
  subordinate: '下属/接班人',
  community: '基层/群众',
  family: '亲友/同乡',
  oversight: '监督/纪检',
  rival: '竞争者'
};
const NETWORK_ARCHETYPE_FALLBACK = {
  mentor: '导师/前辈', peer: '同事/同学', bridge: '桥接人', subordinate: '下属/接班人',
  community: '群众/基层', family: '亲友/同乡', business: '行业/企业', inspector: '监督/纪检', rival: '竞争/冲突'
};
Object.assign(App, {
  _networkFilters: { query: '', archetype: 'all', status: 'all' },
  _networkSelection: [],
  _networkArg(value) {
    return encodeURIComponent(String(value == null ? '' : value)).replace(/'/g, '%27');
  },
  _networkStatusLabel(c) {
    return NETWORK_STATUS_LABELS[c && c.status] || '关系变化中';
  },
  _networkTypeLabel(c) {
    const key = c && typeof c === 'object' ? c.archetype : c;
    const defs = typeof gd_network !== 'undefined' && gd_network.archetypes ? gd_network.archetypes : {};
    return defs[key] && defs[key].label ? defs[key].label : NETWORK_ARCHETYPE_FALLBACK[key] || '其他关系';
  },
  _networkRoleLabel(c) {
    const labels = Array.from(new Set((c && c.roles || []).map(r => NETWORK_ROLE_LABELS[r] || this._networkTypeLabel(r)).filter(Boolean)));
    return labels.slice(0, 3).join(' · ') || this._networkTypeLabel(c) || '普通关系';
  },
  _networkRankLabel(c) {
    return engine && typeof engine.getContactRankLabel === 'function'
      ? engine.getContactRankLabel(c)
      : ('层级 ' + Math.round(Number(c.positionLevel) || 0));
  },
  _networkBar(label, value, color) {
    const n = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    return `<div class="network-meter"><span>${label}</span><span class="network-meter-track"><i style="width:${n}%;background:${color}"></i></span><b>${n}</b></div>`;
  },
  showNetworkPanel() {
    if (typeof engine === 'undefined' || !engine || !engine.getNetworkSummary) { this.showToast('人脉模块尚未就绪', 'warning'); return; }
    const summary = engine.getNetworkSummary();
    const f = this._networkFilters || (this._networkFilters = { query: '', archetype: 'all', status: 'all' });
    const archetypes = Array.from(new Set(summary.contacts.map(c => c.archetype || 'peer'))).sort((a, b) => this._networkTypeLabel(a).localeCompare(this._networkTypeLabel(b), 'zh-CN'));
    const filtered = summary.contacts.filter(c => {
      const query = String(f.query || '').trim().toLowerCase();
      const searchable = [c.name, c.position, c.organization && c.organization.system, c.archetype, this._networkTypeLabel(c), this._networkRoleLabel(c), this._networkStatusLabel(c)];
      const hit = !query || searchable.some(x => String(x || '').toLowerCase().includes(query));
      const role = f.archetype === 'all' || c.archetype === f.archetype;
      const status = f.status === 'all' || c.status === f.status || (f.status === 'remote' && c.region === 'remote');
      return hit && role && status;
    });
    const p = engine.getPlayer();
    const cash = p.finance && Number.isFinite(Number(p.finance.cash)) ? Math.floor(Number(p.finance.cash)) : 0;
    const contactUids = new Set(summary.contacts.map(c => c.uid || c.id));
    const selected = (this._networkSelection || []).filter(uid => contactUids.has(uid));
    this._networkSelection = selected;
    const maintainPlan = selected.length && typeof engine.getNetworkBatchCost === 'function'
      ? engine.getNetworkBatchCost('maintain', selected)
      : null;
    const economy = typeof engine.getNetworkEconomyConfig === 'function' ? engine.getNetworkEconomyConfig() : { minBatchTargets: 2, maxBatchTargets: 3 };
    const minBatchTargets = Number(maintainPlan && maintainPlan.minTargets || economy.minBatchTargets || 2);
    const maxBatchTargets = Number(maintainPlan && maintainPlan.maxTargets || economy.maxBatchTargets || 3);
    const maintainCandidates = filtered.filter(c => engine.getContactCapability(c).canMaintain);
    const batchCash = maintainPlan && maintainPlan.ok ? maintainPlan.totalCash : 0;
    const batchDisabled = summary.actions.stewardshipUsed || selected.length < minBatchTargets || !maintainPlan || !maintainPlan.ok || cash < batchCash;
    const selectionItems = maintainCandidates.map(c => {
      const encoded = this._networkArg(c.uid || c.id);
      const checked = selected.includes(c.uid || c.id) ? ' checked' : '';
      const disabled = c.enemy || c.status === 'rival' ? ' disabled' : '';
      const cost = engine.getNetworkActionCost('maintain', c);
      return '<label class="network-batch-option' + (disabled ? ' is-disabled' : '') + '">' +
        '<input type="checkbox" value="' + this.escapeHtml(encoded) + '" aria-label="选择' + this.escapeHtml(c.name) + '批量维系"' + checked + disabled + ' onchange="App.setNetworkSelection(this.value,this.checked)">' +
        '<span class="network-batch-option-copy"><b>' + this.escapeHtml(c.name) + '</b><small>' + this.escapeHtml(this._networkTypeLabel(c)) + ' · ' + this.escapeHtml(this._networkRankLabel(c)) + ' · 影响力 ' + Math.round(c.influence || 0) + ' · 权重 ' + Number(c.networkWeight || 1).toFixed(2) + '</small></span><strong class="network-batch-option-cost">-' + cost.cash + '</strong></label>';
    }).join('');
    const batchCostText = selected.length < minBatchTargets
      ? '至少选择 ' + minBatchTargets + ' 人，最多 ' + maxBatchTargets + ' 人'
      : selected.length && maintainPlan && maintainPlan.ok
      ? '预计现金-' + batchCash + '，已选 ' + selected.length + ' 人'
      : '当前选择无法维系，请调整联系人';
    const batchSelector = '<section class="event-card network-batch-panel">' +
      '<div class="network-panel-heading"><div><b>批量维系（责任槽）</b><small>' + minBatchTargets + '～' + maxBatchTargets + ' 人</small></div><span>按职级、影响力和距离计费</span></div>' +
      '<p class="network-panel-copy">一次经营 ' + minBatchTargets + '～' + maxBatchTargets + ' 名联系人，可以减少重复操作。但高职级、异地和高影响力关系需要更多时间与实际开销。</p>' +
      '<div class="network-batch-grid">' + (selectionItems || '<span class="network-empty">当前没有可维系的联系人。</span>') + '</div>' +
      '<div class="network-batch-footer"><span class="network-batch-total' + (cash < batchCash && selected.length ? ' is-insufficient' : '') + '">' + batchCostText + '</span><button class="btn btn-primary network-batch-submit" onclick="App.doBatchNetworkMaintain()"' + (batchDisabled ? ' disabled' : '') + '>批量维系</button></div>' +
      '</section>';
    const rivalCount = summary.contacts.filter(c => c.enemy || c.status === 'rival').length;
    const bosomFriendCount = summary.contacts.filter(c => !c.enemy && c.status !== 'rival' && Number(c.relation) >= 90).length;
    const slotLabel = summary.actions.connectionUsed ? '拓展槽已用' : '拓展槽可用';
    const stewardshipUsed = summary.actions.stewardshipUsed;
    const dutyLabel = stewardshipUsed ? '责任槽已用' : '责任槽可用';
    const cards = filtered.map(c => {
      const arg = this._networkArg(c.uid || c.id);
      const conflict = c.enemy || c.status === 'rival';
      const status = this._networkStatusLabel(c);
      const unit = c.organization && c.organization.system ? c.organization.system : '社会关系';
      const typeLabel = this._networkTypeLabel(c);
      const roleLabel = this._networkRoleLabel(c);
      const rankLabel = this._networkRankLabel(c);
      // 保留旧地域图标契约，视觉上使用新的语义标记，避免旧存档/测试依赖被破坏。
      const legacyStatusIcon = c.status === 'remote' ? '📦' : '🤝';
      const actionCost = action => engine.getNetworkActionCost(action, c);
      const costText = action => { const cost = actionCost(action); return cost.cash > 0 ? ` · 现金-${cost.cash}` : ''; };
      const actionDisabledReason = action => {
        const cost = actionCost(action);
        const slotUsed = action === 'cultivate' || action === 'collaborate' || action === 'introduce' ? summary.actions.connectionUsed : stewardshipUsed;
        if (slotUsed) return action === 'cultivate' || action === 'collaborate' || action === 'introduce' ? '本年度拓展槽已使用' : '本年度责任槽已使用';
        const capability = typeof engine.getContactCapability === 'function' ? engine.getContactCapability(c) : null;
        if (action === 'maintain' && capability && !capability.canMaintain) return capability.reason || '当前无法维系这段关系';
        if (action === 'ask' && capability && !capability.canAsk) return capability.reason || '信任或可达性还不足，暂时无法求助';
        if (action === 'repay' && Number(c.favorDebt || 0) <= 0) return '当前没有待偿还的人情';
        if (cash < cost.cash) return '现金不足，至少需要 ' + cost.cash;
        return '';
      };
      const actionAttrs = action => {
        const reason = actionDisabledReason(action);
        const label = { cultivate: '拓展', collaborate: '协作', maintain: '维系', ask: '求助', repay: '还人情', resolveConflict: '化解冲突' }[action] || action;
        const description = reason || (label + '，预计现金-' + actionCost(action).cash);
        return (reason ? ' disabled aria-disabled="true"' : '') + ' title="' + this.escapeHtml(description) + '" aria-label="' + this.escapeHtml(label + c.name + '：' + description) + '"';
      };
      const target = `onclick="App.doNetworkAction('${arg}',`;
      return `<article class="event-card network-contact-card${conflict ? ' is-conflict' : c.status === 'remote' ? ' is-remote' : ''}">
        <div class="network-contact-head"><div class="network-contact-heading"><span class="network-contact-mark" aria-hidden="true">${conflict ? '!' : c.status === 'remote' ? '远' : '人'}<span class="network-contact-legacy-icon">${legacyStatusIcon}</span></span><div><b>${this.escapeHtml(c.name)}</b><div class="network-contact-role">${this.escapeHtml(typeLabel)} · ${this.escapeHtml(roleLabel)} · ${this.escapeHtml(status)} · ${this.escapeHtml(unit)}</div><div class="network-contact-position">${this.escapeHtml(c.position || '普通联系人')} · ${this.escapeHtml(rankLabel)} · 影响力 ${Math.round(c.influence || 0)} · 可达 ${Math.round(c.access || 0)}</div></div></div><span class="network-contact-change">${c.lastChangeYear ? '变动于 ' + c.lastChangeYear + ' 岁' : ''}</span></div>
        ${this._networkBar('关系', (Number(c.relation) + 100) / 2, c.relation >= 60 ? 'var(--ui-green)' : c.relation >= 0 ? 'var(--ui-gold)' : 'var(--ui-danger)')}
        ${this._networkBar('信任', c.trust, 'var(--ui-blue)')}
        ${this._networkBar('互惠', c.reciprocity, 'var(--grade-d)')}
        ${this._networkBar('人情债', c.favorDebt, c.favorDebt >= 60 ? 'var(--ui-danger)' : 'var(--ui-amber)')}
        <div class="network-contact-actions">
          <button class="btn btn-secondary network-action-btn" ${actionAttrs('cultivate')} ${target}'cultivate','connection')">拓展${costText('cultivate')}</button>
          <button class="btn btn-secondary network-action-btn" ${actionAttrs('collaborate')} ${target}'collaborate','connection')">协作${costText('collaborate')}</button>
          <button class="btn btn-secondary network-action-btn" ${actionAttrs('maintain')} ${target}'maintain','stewardship')">维系${costText('maintain')}</button>
          ${!conflict ? `<button class="btn btn-secondary network-action-btn" ${actionAttrs('ask')} ${target}'ask','stewardship')">求助${costText('ask')}</button>` : ''}
          ${c.favorDebt > 0 ? `<button class="btn btn-secondary network-action-btn" ${actionAttrs('repay')} ${target}'repay','stewardship')">还人情${costText('repay')}</button>` : ''}
          ${conflict ? `<button class="btn btn-secondary network-action-btn" ${actionAttrs('resolveConflict')} ${target}'resolveConflict','stewardship')">化解冲突${costText('resolveConflict')}</button>` : ''}
        </div>
      </article>`;
    }).join('');
    const log = (summary.log || []).slice(-8).reverse().map(x => `<div class="network-timeline-entry"><span>${x.year}岁</span><b>${this.escapeHtml(x.message || x.type || '关系变化')}</b></div>`).join('');
    const edges = (summary.edges || []).slice(-8).map(x => `<span class="network-route-chip">${this.escapeHtml(x.label || x.type)} · ${this.escapeHtml(x.to || '')}</span>`).join('');
    const familyActions = this._canRaiseChild && this._canRaiseChild(p) ? `<section class="event-card network-family-card"><b>家庭责任</b><div>孩子 ${p.childAge || 0} 岁 · 教育投入 ${p.childEducation || 0} 次 · 陪伴 ${p.childCompany || 0} 次</div><div class="network-family-actions"><button class="btn btn-secondary network-action-btn" onclick="App.doRaiseChild('education')">教育投入（-10）</button><button class="btn btn-secondary network-action-btn" onclick="App.doRaiseChild('company')">陪伴成长</button><button class="btn btn-secondary network-action-btn" onclick="App.doRaiseChild('free')">自由发展</button></div>${p.flags && p.flags.childRaiseUsed ? '<div class="network-family-used">今年已经安排过孩子的事了</div>' : ''}</section>` : '';
    this.renderContent(`<div class="stage fade-in network-stage">
      <div class="lead network-lead"><span class="lead-badge">网</span><p>人脉经营 · ${summary.active}/${summary.total} 可用关系</p></div>
      <div class="event-card network-summary-strip"><span class="tag">结怨对象 ${rivalCount}</span><span class="tag">死敌 ${summary.rivals}</span><span class="tag">挚友 ${bosomFriendCount}</span><span class="tag">异地 ${summary.remote}</span></div>
      <section class="event-card network-intro"><p>人脉不是联系人数量，而是信任、互惠、可达性和网络多样性。每年可以同时做一次拓展和一次责任经营。正式维系、异地联系和偿还人情会消耗现金。</p><div class="network-metric-tags"><span class="tag">${slotLabel}</span><span class="tag">${dutyLabel}</span>${this._apInfo && !this._apInfo().legacy ? `<span class="tag">精力 ${this._apInfo().cur}/${this._apInfo().max}</span>` : ''}<span class="tag">现金 ${cash}</span><span class="tag">${this.escapeHtml(summary.scenario && summary.scenario.label || '均衡网络')}</span><span class="tag">多样性 ${Math.round(summary.metrics.diversity * 100)}%</span><span class="tag">桥接覆盖 ${Math.round(summary.metrics.bridgeCoverage * 100)}%</span><span class="tag">冲突暴露 ${Math.round(summary.metrics.conflictExposure * 100)}%</span></div><div class="network-scenario-note">本剧本侧重：${this.escapeHtml(summary.scenario && summary.scenario.focus || '在拓展与维系之间保持平衡')}</div></section>
      ${familyActions}
      ${batchSelector}
      <div class="network-filters"><label class="network-filter-field network-search-field" for="network-search"><span>搜索关系</span><input id="network-search" class="network-search" type="search" value="${this.escapeHtml(f.query || '')}" placeholder="姓名、职位或系统" oninput="App.setNetworkFilter('query',this.value)"></label><label class="network-filter-field" for="network-archetype"><span>关系类型</span><select id="network-archetype" onchange="App.setNetworkFilter('archetype',this.value)"><option value="all">全部类型</option>${archetypes.map(x => `<option value="${this.escapeHtml(x)}" ${f.archetype === x ? 'selected' : ''}>${this.escapeHtml(this._networkTypeLabel(x))}</option>`).join('')}</select></label><label class="network-filter-field" for="network-status"><span>关系状态</span><select id="network-status" onchange="App.setNetworkFilter('status',this.value)"><option value="all">全部状态</option>${Object.entries(NETWORK_STATUS_LABELS).map(([key, label]) => `<option value="${key}" ${f.status === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label><div class="network-filter-actions"><span class="network-filter-count">显示 ${filtered.length}/${summary.contacts.length}</span>${f.query || f.archetype !== 'all' || f.status !== 'all' ? '<button type="button" class="network-filter-reset" onclick="App.clearNetworkFilters()">清除筛选</button>' : ''}</div></div>
      <div class="network-contact-grid">${cards || (summary.contacts.length ? '<div class="event-card network-empty-card">当前筛选下没有关系。可以尝试清除筛选，或换个关键词。</div>' : '<div class="event-card network-empty-card">还没有联系人。完成拓展、跨部门协作或牵线行动后，关系网络会逐步形成。</div>')}</div>
      <section class="event-card network-route-panel"><b>关系路线图</b><div>${edges || '<span class="network-empty">完成跨部门协作或牵线后，这里会留下桥接关系。</span>'}</div></section>
      <section class="event-card network-timeline-panel"><b>关系时间线</b><div>${log || '<span class="network-empty">还没有新的关系变化。</span>'}</div></section>
      <div class="sticky-action"><button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button></div>
    </div>`);
  },
  setNetworkFilter(key, value) {
    this._networkFilters = this._networkFilters || { query: '', archetype: 'all', status: 'all' };
    const focusState = key === 'query' && typeof this.captureTextFieldState === 'function'
      ? this.captureTextFieldState('network-search')
      : null;
    this._networkFilters[key] = value;
    this.showNetworkPanel();
    if (focusState && typeof this.restoreTextFieldState === 'function') this.restoreTextFieldState(focusState);
  },
  clearNetworkFilters() {
    this._networkFilters = { query: '', archetype: 'all', status: 'all' };
    this.showNetworkPanel();
  },
  setNetworkSelection(value, checked) {
    let uid = String(value == null ? '' : value);
    try { uid = decodeURIComponent(uid); } catch (e) {}
    this._networkSelection = Array.isArray(this._networkSelection) ? this._networkSelection.slice() : [];
    const index = this._networkSelection.indexOf(uid);
    if (checked && index < 0) {
      const max = engine && typeof engine.getNetworkEconomyConfig === 'function' ? engine.getNetworkEconomyConfig().maxBatchTargets : 3;
      if (this._networkSelection.length >= max) {
        this.showToast('一次最多选择 ' + max + ' 名人脉', 'warning');
        this.showNetworkPanel();
        return;
      }
      this._networkSelection.push(uid);
    } else if (!checked && index >= 0) {
      this._networkSelection.splice(index, 1);
    }
    this.showNetworkPanel();
  },
  doBatchNetworkMaintain() {
    if (!engine || !engine.performNetworkAction) return;
    if (!this._hasAP(1)) { this.showToast('精力不足，明年再批量维系', 'warning'); return; }
    const targets = Array.isArray(this._networkSelection) ? this._networkSelection.slice() : [];
    const result = engine.performNetworkAction({ slot: 'stewardship', action: 'maintain', targets });
    this.showToast(result.message || '操作未完成', result.ok ? 'success' : 'warning');
    if (result.ok) {
      if (typeof engine.spendActionPoint === 'function') engine.spendActionPoint(1);
      this._networkSelection = [];
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('network-batch-maintain'); else engine.saveState();
      if (window.monitorClient) monitorClient.report();
    }
    this.showNetworkPanel();
  },
  doNetworkAction(uid, action, slot) {
    if (!engine || !engine.performNetworkAction) return;
    if (!this._hasAP(1)) { this.showToast('精力不足，明年再经营人脉', 'warning'); return; }
    let target = String(uid == null ? '' : uid);
    try { target = decodeURIComponent(target); } catch (e) {}
    const result = engine.performNetworkAction({ target, action, slot });
    this.showToast(result.message || '操作未完成', result.ok ? 'success' : 'warning');
    if (result.ok) {
      if (typeof engine.spendActionPoint === 'function') engine.spendActionPoint(1);
      if (slot === 'stewardship') this._networkSelection = [];
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('network-action'); else engine.saveState();
      if (window.monitorClient) monitorClient.report();
    }
    this.showNetworkPanel();
  },
  // 兼容旧事件/旧页面入口，实际行动统一走 performNetworkAction。
  doVisit(cid, action) {
    const p = engine.getPlayer();
    const c = (p.contacts || []).find(x => x.id === cid) || (p.contacts || []).find(x => x.uid === cid);
    if (!c) { this.showToast('没有这个联系人', 'warning'); return; }
    this.doNetworkAction(c.uid || c.id, action === 'help' ? 'ask' : 'maintain', 'stewardship');
  },
  // 旧入口保留，但统一落到新的人脉面板，避免两套年度额度和两套联系人卡片。
  showGiftPanel() { this.showNetworkPanel(); }
});
