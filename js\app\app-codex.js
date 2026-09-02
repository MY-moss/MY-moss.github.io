// ==================== 图鉴增强模块 ====================
// 只读取现有 GameData / App 数据，不参与事件判定，避免图鉴逻辑改变游戏结果。
(function() {
  'use strict';

  var STAGE_LABELS = { work: '工作', life: '生活', career: '仕途', spec: '专属', other: '其他' };
  var TYPE_LABELS = { choice: '抉择', sudden: '突发', auto: '日常' };
  var ERA_LABELS = { reform: '改革年代', stable: '平稳年代', rectify: '整顿年代' };
  var UNIT_LEVEL_LABELS = { 0: '乡镇/街道', 1: '县级', 2: '市级', 3: '省级', 4: '中央' };
  var FLAG_LABELS = {
    refusedBribe: '拒绝贿赂', refusedKickback: '拒绝回扣', tookBribe: '收受贿赂', tookKickback: '收受回扣',
    reportedOthers: '举报他人', selfSurrender: '主动自首', underInvestigation: '接受调查', appliedParty: '申请入党',
    reformProposal: '改革建议', reformDraft: '改革起草', ruralRevitalize: '乡村振兴', dataPlatform: '数据平台',
    grassrootsStay: '基层留任', grassrootsWork: '基层工作', bookPublished: '专著出版', witnessStrong: '关键证据',
    mentorLegacy: '传承接班', dating: '恋爱关系', centralCandidate: '中央调任候选', resigned: '辞职下海',
    gambleStreak: '赌瘾状态', chronicIllness: '慢性病', childRaiseUsed: '培养子女',
    // v2.1.70 三条新链 flag（赡养/理财暴雷/借调）
    parentIllness: '父母病倒', parentCaring: '照护中', parentShared: '手足分担', parentRecovered: '父母康复', parentLongTerm: '长期照护',
    leveragedInvest: '杠杆理财', investCrash: '理财暴雷', investLesson: '理财教训',
    seconded: '借调中', secondReview: '借调考核', secondDone: '借调尘埃落定'
  };

  var ENDING_META = {
    skyline: ['巅峰人生', '厅级以上、地市级以上、高声誉'],
    fast: ['快速晋升', '保持高欲望并连续争取晋升'],
    safe: ['安稳退休', '中高职级、低风险、家庭关系稳定'],
    ordinary: ['平凡人生', '不走极端路线，平稳收官'],
    edge: ['边缘化', '长期错过晋升，职级和组织权重偏低'],
    arrest: ['被抓', '风险与热度累积，廉洁底线失守'],
    burnout: ['燃尽', '长期高压、身体状态恶化'],
    central: ['中央殿堂', '党员、省级以上、中央调任链'],
    entrepreneur: ['下海人生', '触发辞职或创业链并成功转身'],
    reform: ['改革先锋', '推动改革建议并形成实际成果'],
    digital: ['数字先驱', '在技术/数据/政府部门建成数据平台'],
    grassroots: ['乡土守望', '基层历练后选择留任扎根'],
    clean: ['清廉丰碑', '拒绝诱惑并保持高廉洁'],
    grassroots_devotion: ['基层奉献', '乡镇/街道长期工作且无腐败'],
    tech_backbone: ['技术骨干', '技术/数据岗位深耕，能力与智力突出'],
    people_champion: ['群众贴心人', '持续处理群众事件并获得口碑'],
    reform_pioneer: ['改革旗手', '参与多次改革并获得组织认可'],
    honest_official: ['一代清官', '长期高廉洁、低风险、无腐败'],
    era_reform: ['时代弄潮儿', '改革年代推动改革并晋升至高职级'],
    era_rectify: ['清流砥柱', '整顿年代保持廉洁并有反腐实绩'],
    patron_legacy: ['大树成荫', '贵人关系深厚并达到高位'],
    lifelong_friend: ['莫逆之交', '老同学关系长期维持'],
    hometown_net: ['桑梓情深', '基层扎根并经营邻里网络'],
    estranged_hero: ['曲高和寡', '群众口碑高但组织评价偏低'],
    whistleblower_hero: ['举报英雄', '走完匿名举报到反腐功臣链'],
    author_legacy: ['著书立说', '完成专著出版链并保持能力与声誉'],
    rural_star: ['乡村振兴之星', '完成示范村建设并长期扎根基层']
  };

  var ROUTES = [
    { id: 'clean', title: '清廉路线', icon: '🕊️', endings: ['clean', 'honest_official', 'era_rectify'], flags: ['refusedBribe', 'reportedOthers'] },
    { id: 'grassroots', title: '基层路线', icon: '🌾', endings: ['grassroots', 'grassroots_devotion', 'hometown_net', 'rural_star'], flags: ['grassrootsWork', 'grassrootsStay', 'ruralRevitalize', 'policy_rural_revitalization_done'] }, // v2.1.76 +乡村振兴项目完成
    { id: 'reform', title: '改革与技术路线', icon: '🚩', endings: ['reform', 'reform_pioneer', 'era_reform', 'digital', 'tech_backbone'], flags: ['reformProposal', 'reformDraft', 'dataPlatform', 'policy_digital_governance_done', 'policy_business_environment_done'] }, // v2.1.76 +数字政务/营商环境项目完成
    { id: 'relationship', title: '关系与群众路线', icon: '🤝', endings: ['patron_legacy', 'lifelong_friend', 'people_champion', 'estranged_hero'], flags: ['dating', 'mentorLegacy'] },
    { id: 'risk', title: '风险与转身路线', icon: '⚖️', endings: ['arrest', 'burnout', 'edge', 'entrepreneur'], flags: ['tookBribe', 'underInvestigation', 'resigned', 'leveragedInvest', 'investCrash', 'investLesson'] } // v2.1.76 +理财暴雷链（财政风险转身）
  ];

  function escapeHtml(value) {
    if (App && typeof App.escapeHtml === 'function') return App.escapeHtml(value);
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function toHtml(value) {
    return typeof __h === 'function' ? __h(value) : value;
  }

  function list(value) {
    if (Array.isArray(value)) return value.filter(function(v) { return v !== undefined && v !== null && v !== ''; });
    if (value === undefined || value === null || value === '') return [];
    return [value];
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function labelFlag(flag) {
    return FLAG_LABELS[flag] || flag;
  }

  function events() {
    return typeof GameData !== 'undefined' && Array.isArray(GameData.events) ? GameData.events.filter(function(e) { return e && e.id; }) : [];
  }

  function knownEventIds() {
    return new Set(events().map(function(e) { return e.id; }));
  }

  function eventEra(e) {
    var raw = list(e.era);
    if (raw.length) return raw;
    var pools = list(e.pools);
    return pools.filter(function(pool) { return /^era_/.test(pool); }).map(function(pool) { return pool.replace(/^era_/, ''); });
  }

  function eventStage(e) {
    return STAGE_LABELS[e.stage] || STAGE_LABELS.other;
  }

  function eventType(e) {
    return TYPE_LABELS[e.eventType] || TYPE_LABELS.auto;
  }

  function collectFlagsFromEffects(effects) {
    if (!effects || typeof effects !== 'object') return [];
    return list(effects.flag).filter(function(flag) { return typeof flag === 'string' && flag.length > 0; });
  }

  function producedFlags(e) {
    var result = collectFlagsFromEffects(e.effects);
    list(e.choices).forEach(function(choice) { result = result.concat(collectFlagsFromEffects(choice && choice.effects)); });
    return unique(result);
  }

  function requiredFlags(e) {
    return unique(list(e.requireFlag).concat(list(e.requireFlags)).filter(function(flag) { return typeof flag === 'string' && flag.length > 0; }));
  }

  function addCondition(output, text) {
    if (text && output.indexOf(text) < 0) output.push(text);
  }

  function rangeLabel(label, min, max) {
    if (min !== undefined && max !== undefined) return label + ' ' + min + '～' + max;
    if (min !== undefined) return label + ' ≥ ' + min;
    if (max !== undefined) return label + ' ≤ ' + max;
    return '';
  }

  function describeRequirements(e) {
    var output = [];
    var year = Array.isArray(e.year) ? e.year : null;
    var eras = eventEra(e).map(function(id) { return ERA_LABELS[id] || id; });
    if (eras.length) addCondition(output, '时代：' + eras.join(' / '));
    if (e.requireFlag) addCondition(output, '需要：' + list(e.requireFlag).map(labelFlag).join('、'));
    if (e.excludeFlag) addCondition(output, '不能有：' + list(e.excludeFlag).map(labelFlag).join('、'));
    if (e.requireChild) addCondition(output, '需要已有子女');
    if (e.requireNoChild) addCondition(output, '需要尚未有子女');
    if (e.requireMarried) addCondition(output, '需要已婚');
    if (e.requireSingle) addCondition(output, '需要单身');
    if (e.requireGender) addCondition(output, '性别：' + e.requireGender);
    if (e.requireTalent) addCondition(output, '天赋：' + e.requireTalent);
    if (e.excludeTalent) addCondition(output, '不能有天赋：' + e.excludeTalent);
    if (e.requirePolitical) addCondition(output, '政治面貌：' + e.requirePolitical);
    if (e.requireBackground) addCondition(output, '出身：' + e.requireBackground);
    if (e.requireUnitSystem) addCondition(output, '单位系统：' + e.requireUnitSystem);
    if (e.requireContact) addCondition(output, '联系人：' + e.requireContact);
    if (e.pools && e.pools.length) addCondition(output, '场景池：' + e.pools.filter(function(pool) { return pool !== 'public' && !/^era_/.test(pool); }).join('、'));
    if (year) addCondition(output, '年龄：' + (year[0] < 22 ? 22 : year[0]) + '～' + year[1] + '岁');
    addCondition(output, rangeLabel('工作年限', e.minYear, undefined));
    addCondition(output, rangeLabel('声誉', e.minReputation, e.maxReputation));
    addCondition(output, rangeLabel('民间口碑', undefined, e.requirePeopleReputationMax));
    addCondition(output, rangeLabel('压力', e.requireMentalPressure, undefined));
    addCondition(output, rangeLabel('风险', e.requireRisk, undefined));
    addCondition(output, rangeLabel('热度', e.requireHeat, undefined));
    addCondition(output, rangeLabel('身体', undefined, e.requireBodyMax));
    addCondition(output, rangeLabel('外貌', e.requireAppearance, undefined));
    addCondition(output, rangeLabel('家境', e.requireFamily, undefined));
    addCondition(output, rangeLabel('运气', e.requireLuck, undefined));
    addCondition(output, rangeLabel('职务权重', e.requirePositionWeight, undefined));
    addCondition(output, rangeLabel('背景', e.minBackground, e.maxBackground));
    addCondition(output, rangeLabel('单位级别', e.requireUnitLevelMin !== undefined ? UNIT_LEVEL_LABELS[e.requireUnitLevelMin] : undefined, e.requireUnitLevelMax !== undefined ? UNIT_LEVEL_LABELS[e.requireUnitLevelMax] : undefined));
    addCondition(output, rangeLabel('领导职级', e.requireRankMin, e.requireRankMax));
    addCondition(output, rangeLabel('财富', e.requireWealth, e.maxWealth));
    addCondition(output, rangeLabel('负债', e.requireDebt, undefined));
    if (e.requireChildAgeMin !== undefined || e.requireChildAgeMax !== undefined) addCondition(output, rangeLabel('子女年龄', e.requireChildAgeMin, e.requireChildAgeMax));
    if (e.requireContactMin !== undefined || e.requireContactMax !== undefined) addCondition(output, rangeLabel('关系值', e.requireContactMin, e.requireContactMax));
    return output;
  }

  function buildGraph() {
    var all = events();
    var producers = {};
    all.forEach(function(e) {
      producedFlags(e).forEach(function(flag) {
        if (!producers[flag]) producers[flag] = [];
        producers[flag].push(e.id);
      });
    });
    var upstream = {};
    var downstream = {};
    all.forEach(function(e) {
      upstream[e.id] = [];
      downstream[e.id] = [];
      requiredFlags(e).forEach(function(flag) {
        (producers[flag] || []).forEach(function(sourceId) {
          if (sourceId === e.id) return;
          upstream[e.id].push({ id: sourceId, flag: flag });
          if (!downstream[sourceId]) downstream[sourceId] = [];
          downstream[sourceId].push({ id: e.id, flag: flag });
        });
      });
    });
    Object.keys(upstream).forEach(function(id) { upstream[id] = upstream[id].filter(function(v, i, a) { return a.findIndex(function(x) { return x.id === v.id && x.flag === v.flag; }) === i; }); });
    Object.keys(downstream).forEach(function(id) { downstream[id] = downstream[id].filter(function(v, i, a) { return a.findIndex(function(x) { return x.id === v.id && x.flag === v.flag; }) === i; }); });
    return { producers: producers, upstream: upstream, downstream: downstream };
  }

  function getGraph() {
    var count = events().length;
    if (!App._codexGraph || App._codexGraph.count !== count) App._codexGraph = { count: count, value: buildGraph() };
    return App._codexGraph.value;
  }

  function eventById(id) {
    return events().find(function(e) { return e.id === id; }) || null;
  }

  function currentView() {
    App._codexView = App._codexView || { query: '', status: 'all', stage: 'all', era: 'all', type: 'all', selectedId: null };
    return App._codexView;
  }

  function seenSet() {
    var known = knownEventIds();
    return new Set(Object.keys((App.codex && App.codex.events) || {}).filter(function(id) { return known.has(id); }));
  }

  function eventMatches(e, view, seen) {
    var hit = seen.has(e.id);
    if (view.status === 'seen' && !hit) return false;
    if (view.status === 'unseen' && hit) return false;
    if (view.stage !== 'all' && (e.stage || 'other') !== view.stage) return false;
    if (view.type !== 'all' && (e.eventType || 'auto') !== view.type) return false;
    if (view.era !== 'all' && eventEra(e).indexOf(view.era) < 0) return false;
    var query = String(view.query || '').trim().toLowerCase();
    if (!query) return true;
    var haystack = [e.id, e.title, e.text, e.stage, e.eventType].concat(list(e.pools), requiredFlags(e), producedFlags(e)).join(' ').toLowerCase();
    return haystack.indexOf(query) >= 0;
  }

  function filteredEvents() {
    var view = currentView();
    var seen = seenSet();
    return events().filter(function(e) { return eventMatches(e, view, seen); }).sort(function(a, b) {
      var seenDiff = Number(seen.has(a.id)) - Number(seen.has(b.id));
      if (seenDiff) return seenDiff;
      return String(a.title || a.id).localeCompare(String(b.title || b.id), 'zh-CN');
    });
  }

  function jsArg(value) {
    // 事件 ID 进入双引号 HTML 属性时，必须先做属性编码；否则 JSON 的双引号会截断 onclick。
    return JSON.stringify(String(value == null ? '' : value))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderResults() {
    var view = currentView();
    var seen = seenSet();
    var all = filteredEvents();
    var visible = all.slice(0, 80);
    var rows = visible.map(function(e) {
      var hit = seen.has(e.id);
      var selected = view.selectedId === e.id;
      var conditions = describeRequirements(e);
      return `<button type="button" class="codex-event-row${selected ? ' selected' : ''}" data-codex-event-id="${escapeHtml(e.id)}" onclick="App.codexSelectEvent(${jsArg(e.id)})" aria-pressed="${selected ? 'true' : 'false'}">
        <span class="codex-event-status">${hit ? '✅' : '❓'}</span>
        <span class="codex-event-main"><strong>${escapeHtml(e.title || e.id)}</strong><small>${escapeHtml(e.id)} · ${escapeHtml(eventStage(e))} · ${escapeHtml(eventType(e))}${conditions.length ? ' · ' + escapeHtml(conditions[0]) : ''}</small></span>
      </button>`;
    }).join('');
    if (!rows) rows = '<div class="codex-empty">没有匹配的事件，换个关键词或筛选条件试试。</div>';
    return `<div class="codex-results-meta">匹配 ${all.length} 条${all.length > visible.length ? '，当前展示前 ' + visible.length + ' 条' : ''}</div>${rows}`;
  }

  function renderLink(link) {
    var target = eventById(link.id);
    if (!target) return '';
    return `<button type="button" class="codex-link" data-codex-event-id="${escapeHtml(link.id)}" onclick="App.codexSelectEvent(${jsArg(link.id)})">${escapeHtml(target.title || link.id)} <small>（${escapeHtml(labelFlag(link.flag))}）</small></button>`;
  }

  function renderDetail() {
    var view = currentView();
    var e = eventById(view.selectedId);
    if (!e) return '<div class="codex-detail codex-empty">点击上方事件，查看前置条件、关键标记和后续路线。</div>';
    var graph = getGraph();
    var requirements = describeRequirements(e);
    var outputs = producedFlags(e);
    var upstream = graph.upstream[e.id] || [];
    var downstream = graph.downstream[e.id] || [];
    var conditionHtml = requirements.length ? requirements.map(function(item) { return `<span class="codex-chip">${escapeHtml(item)}</span>`; }).join('') : '<span class="codex-muted">未声明结构化前置条件，属于通用事件。</span>';
    var outputHtml = outputs.length ? outputs.map(function(flag) { return `<span class="codex-chip positive">${escapeHtml(labelFlag(flag))}</span>`; }).join('') : '<span class="codex-muted">没有直接产生关键 flag。</span>';
    var upstreamHtml = upstream.length ? upstream.slice(0, 12).map(renderLink).join('') : '<span class="codex-muted">这是当前关系图中的起点或暂无可识别前置。</span>';
    var downstreamHtml = downstream.length ? downstream.slice(0, 16).map(renderLink).join('') : '<span class="codex-muted">暂无可识别后续事件，可能通过数值条件或结局判定继续。</span>';
    return `<div class="codex-detail">
      <div class="codex-detail-title"><span>${seenSet().has(e.id) ? '✅' : '❓'}</span><strong>${escapeHtml(e.title || e.id)}</strong><small>${escapeHtml(e.id)}</small></div>
      <p class="codex-detail-text">${escapeHtml(e.text || '暂无事件描述')}</p>
      <div class="codex-detail-meta">${escapeHtml(eventStage(e))} · ${escapeHtml(eventType(e))}${eventEra(e).length ? ' · ' + escapeHtml(eventEra(e).map(function(id) { return ERA_LABELS[id] || id; }).join(' / ')) : ''}</div>
      <div class="codex-detail-section"><b>前置条件</b><div class="codex-chip-list">${conditionHtml}</div></div>
      <div class="codex-detail-section"><b>可能推动的路线</b><div class="codex-chip-list">${outputHtml}</div></div>
      <div class="codex-detail-section"><b>前置事件</b><div class="codex-links">${upstreamHtml}</div></div>
      <div class="codex-detail-section"><b>后续事件</b><div class="codex-links">${downstreamHtml}</div></div>
    </div>`;
  }

  function renderRoutes() {
    var stats = (App.stats && App.stats.endings) || {};
    return ROUTES.map(function(route) {
      var got = route.endings.filter(function(id) { return stats[id] > 0; }).length;
      var missing = route.endings.filter(function(id) { return !(stats[id] > 0); });
      var flags = route.flags.map(function(flag) { return labelFlag(flag); }).join(' · ');
      var missingText = missing.length ? '还缺：' + missing.map(function(id) { return ENDING_META[id] ? ENDING_META[id][0] : id; }).join('、') : '本路线已收集完成';
      return `<div class="codex-route-card"><div class="codex-route-head"><strong>${route.icon} ${escapeHtml(route.title)}</strong><span>${got}/${route.endings.length}</span></div><div class="codex-route-bar"><i style="width:${Math.round(got / route.endings.length * 100)}%"></i></div><small>关键线索：${escapeHtml(flags)}</small><p>${escapeHtml(missingText)}</p></div>`;
    }).join('');
  }

  function renderExplorer() {
    var view = currentView();
    var all = events();
    var seen = seenSet();
    return `<div id="codex-enhanced" class="stats-card codex-enhanced" style="margin-top:12px">
      <div class="codex-enhanced-head"><h3>🧭 图鉴探索器</h3><span>${seen.size}/${all.length} 已发现</span></div>
      <div class="codex-controls">
        <input id="codex-search" class="codex-search" type="search" placeholder="搜索事件标题、正文、ID 或 flag…" value="${escapeHtml(view.query)}" oninput="App.codexSearch(this.value)" aria-label="搜索图鉴事件">
        <select onchange="App.codexSetFilter('status', this.value)" aria-label="事件状态"><option value="all"${view.status === 'all' ? ' selected' : ''}>全部状态</option><option value="seen"${view.status === 'seen' ? ' selected' : ''}>已触发</option><option value="unseen"${view.status === 'unseen' ? ' selected' : ''}>未触发</option></select>
        <select onchange="App.codexSetFilter('stage', this.value)" aria-label="事件阶段"><option value="all"${view.stage === 'all' ? ' selected' : ''}>全部阶段</option><option value="work"${view.stage === 'work' ? ' selected' : ''}>工作</option><option value="life"${view.stage === 'life' ? ' selected' : ''}>生活</option><option value="career"${view.stage === 'career' ? ' selected' : ''}>仕途</option><option value="other"${view.stage === 'other' ? ' selected' : ''}>其他</option></select>
        <select onchange="App.codexSetFilter('era', this.value)" aria-label="事件时代"><option value="all"${view.era === 'all' ? ' selected' : ''}>全部时代</option><option value="reform"${view.era === 'reform' ? ' selected' : ''}>改革年代</option><option value="stable"${view.era === 'stable' ? ' selected' : ''}>平稳年代</option><option value="rectify"${view.era === 'rectify' ? ' selected' : ''}>整顿年代</option></select>
        <select onchange="App.codexSetFilter('type', this.value)" aria-label="事件类型"><option value="all"${view.type === 'all' ? ' selected' : ''}>全部类型</option><option value="choice"${view.type === 'choice' ? ' selected' : ''}>抉择</option><option value="auto"${view.type === 'auto' ? ' selected' : ''}>日常</option><option value="sudden"${view.type === 'sudden' ? ' selected' : ''}>突发</option></select>
      </div>
      <div id="codex-explorer-results" class="codex-explorer-results">${renderResults()}</div>
      <div id="codex-event-detail">${renderDetail()}</div>
      <div class="codex-route-map"><div class="codex-enhanced-head"><h3>🗺️ 人生路线图</h3><span>按结局与关键 flag 归类</span></div>${renderRoutes()}</div>
    </div>`;
  }

  function refreshExplorer() {
    var results = document.getElementById('codex-explorer-results');
    var detail = document.getElementById('codex-event-detail');
    if (results) results.innerHTML = toHtml(renderResults());
    if (detail) detail.innerHTML = toHtml(renderDetail());
  }

  // 图鉴状态、收集进度、奖励和旧版图鉴渲染统一由本模块负责。
  Object.assign(App, {
  saveCodex() {
    try { localStorage.setItem('gameCodex', JSON.stringify(this.codex)); } catch(e) {}
  },
  mergeCodex(p) {
    // 会话内防重复：重复查看/加载结局存档不重复累计图鉴计数
    if (this._codexMerged) return;
    this._codexMerged = true;
    const c = this.codex;
    c.events = c.events || {}; c.flags = c.flags || {}; c.endings = c.endings || {};
    (p.seenEvents || []).forEach(id => { c.events[id] = (c.events[id] || 0) + 1; });
    if (p.flags) Object.keys(p.flags).forEach(f => { if (p.flags[f]) c.flags[f] = (c.flags[f] || 0) + 1; });
    if (p.ending) c.endings[p.ending] = (c.endings[p.ending] || 0) + 1;
    this.saveCodex();
  },
  getCodexHint(prog) {
    const hints = [];
    const endings = this.codex.endings || {};
    // 结局缺失建议
    if (!endings.central) hints.push('🏯 未解锁「中央殿堂」：成为党员，晋升省级并保持极高声誉，等待中央调任');
    if (!endings.skyline) hints.push('🚀 未解锁「巅峰人生」：晋升厅级（9级）+ 地市级以上 + 高声誉');
    if (!endings.arrest) hints.push('⚖️ 未解锁「被抓」：高风险高热度且廉洁过低（多周目挑战一下？）');
    if (!endings.burnout) hints.push('💀 未解锁「燃尽」：长期高压+身体差会倒下');
    if (!endings.edge) hints.push('📋 未解锁「边缘化」：多次错过晋升且职级偏低');
    if (!endings.entrepreneur) hints.push('🏪 未解锁「下海人生」：面对创业诱惑选择辞职');
    if (!endings.fast) hints.push('⭐ 未解锁「快速晋升」：保持高欲望+高晋升频率');
    if (!endings.reform) hints.push('🚩 未解锁「改革先锋」：遇到改革建议事件并推动落地，成为典型');
    if (!endings.digital) hints.push('💾 未解锁「数字先驱」：在数据/技术部门建成数据共享平台');
    if (!endings.grassroots) hints.push('🌾 未解锁「乡土守望」：基层历练后选择留任扎根，口碑深厚');
    if (!endings.clean) hints.push('🕊️ 未解锁「清廉丰碑」：拒绝所有诱惑，守住一生清白');
    if (!endings.honest_official) hints.push('📜 未解锁「清官」：廉洁 80+ 且风险 10 以下，工作 20 年以上（比清廉丰碑更极致）');
    if (!endings.grassroots_devotion) hints.push('🏡 未解锁「基层奉献」：乡镇/街道工作 15 年以上，廉洁无腐');
    if (!endings.tech_backbone) hints.push('🛠️ 未解锁「技术骨干」：在技术/数据部门深耕，工作能力 85+ 且智商出众');
    if (!endings.people_champion) hints.push('❤️ 未解锁「群众贴心人」：处理 10 次以上群众事件，口碑 75+');
    if (!endings.reform_pioneer) hints.push('🚩 未解锁「改革旗手」：推动 2 次以上改革（建议+方案），组织印象权重高');
    if (!endings.estranged_hero) hints.push('🎭 未解锁「孤胆英雄」：群众口碑 75+ 但组织印象 40 以下（基层悖论路线）');
    if (!endings.era_reform) hints.push('⚡ 未解锁「弄潮儿」：改革年代推动改革并晋升 6 级以上');
    if (!endings.era_rectify) hints.push('⚖️ 未解锁「清流」：整顿年代廉洁 75+ 且有反腐实绩');
    if (!endings.patron_legacy) hints.push('🏛️ 未解锁「大树成荫」：贵人关系 85+ 且晋升 7 级以上');
    if (!endings.lifelong_friend) hints.push('🤝 未解锁「莫逆之交」：老同学关系 80+，风浪过后有人一起喝酒');
    if (!endings.hometown_net) hints.push('🌾 未解锁「桑梓情深」：邻里关系 80+ 且扎根基层 20 年');
    if (!endings.whistleblower_hero) hints.push('🦅 未解锁「举报英雄」：走完匿名举报→配合调查→反腐功臣链，保持廉洁');
    if (!endings.author_legacy) hints.push('📚 未解锁「著书立说」：完成专著出版链，并保持较高工作能力与声誉');
    if (!endings.rural_star) hints.push('🌟 未解锁「乡村振兴之星」：基层工作 10 年以上，完成乡村振兴示范村并保持群众口碑');
    // 事件缺失建议
    if (prog.eventsPct < 30) hints.push('📖 事件收集率低于30%：尝试不同出身/专业/单位，每次游玩事件不同');
    if (prog.eventsPct < 60 && prog.eventsPct >= 30) hints.push('📖 收集率30-60%：尝试不同性格（进取/圆滑）与不同单位系统（政法/财税/民生）');
    if (prog.eventsPct >= 60 && prog.eventsPct < 90) hints.push('📖 收集率60-90%：尝试极端路线——高腐败、高危、高压力玩法');
    if (prog.eventsPct >= 90) hints.push('🏅 接近全收集！尝试各种冷门选择，就快圆满了');
    if (hints.length === 0) hints.push('🏆 图鉴接近圆满！试试隐藏彩蛋路线吧');
    return hints.slice(0, 4).join('<br>');
  },
  getCodexProgress() {
    const total = events().length;
    if (!total) return { events: 0, eventsPct: 0, flags: 0, endings: 0, overall: 0, total: total, flagTotal: 0 };
    const eventsGot = seenSet().size;
    const eventsPct = Math.round(eventsGot / total * 100);
    const flagsGot = Object.keys(this.codex.flags || {}).length;
    const endingsGot = Object.keys(this.codex.endings || {}).length;
    // flag 分母动态统计：事件数据中所有 flag 引用（requireFlag/flag/deleteFlag）去重
    const flagTotal = this.getFlagTotal();
    const overall = Math.round((eventsGot * 0.7 + flagsGot * 0.15 + endingsGot * 0.15) / (total * 0.7 + flagTotal * 0.15 + (App.ALL_ENDINGS ? App.ALL_ENDINGS.length : 13) * 0.15) * 100);
    return { events: eventsGot, eventsPct: eventsPct, flags: flagsGot, endings: endingsGot, overall: overall, total: total, flagTotal: flagTotal, totalEndings: (App.ALL_ENDINGS || []).length };
  },
  getFlagTotal() {
    const s = new Set();
    (GameData.events || []).forEach(e => {
      if (!e) return;
      // 统一复用图鉴条件/产出解析，兼容字符串和数组形式，避免数组被当成一个 flag 计数。
      requiredFlags(e).forEach(flag => s.add(flag));
      producedFlags(e).forEach(flag => s.add(flag));
    });
    return s.size || 1;
  },
  getCodexReward() {
    // 完成度奖励：事件图鉴收集率（天赋点 + 属性点双轨——v2.69 属性点加成：50%+2 / 75%+3 / 100%+5）
    const pct = this.getCodexProgress().eventsPct;
    if (pct >= 100) return { tier: 4, bonus: 4, attrBonus: 5, title: '📖 通晓官场', desc: '遍历全部事件，+4 天赋点、+5 属性点' };
    if (pct >= 75) return { tier: 3, bonus: 3, attrBonus: 3, title: '📖 深谙体制', desc: '图鉴完成 75%+，+3 天赋点、+3 属性点' };
    if (pct >= 50) return { tier: 2, bonus: 2, attrBonus: 2, title: '📖 见多识广', desc: '图鉴完成 50%+，+2 天赋点、+2 属性点' };
    if (pct >= 25) return { tier: 1, bonus: 1, attrBonus: 0, title: '📖 初涉官场', desc: '图鉴完成 25%+，+1 天赋点' };
    return { tier: 0, bonus: 0, attrBonus: 0, title: '', desc: '收集更多事件，解锁额外天赋点' };
  },
  showCodex() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('codex', { sync: false });
    const prog = this.getCodexProgress();
    const reward = this.getCodexReward();
    const seenEventSet = seenSet();
    const endingNames = this.ENDING_NAMES; // v2.1.69 收官：图鉴引用权威表（v2.1.56 单一来源），删除自建 27 键字典
    const catMap = {};
    if (GameData && GameData.events) {
      GameData.events.forEach(e => {
        if (!e || !e.id) return;
        const stage = STAGE_LABELS[e.stage] || '其他'; // v2.1.69 修复：三态映射，仕途事件不再被归入「生活」
        const type = e.eventType === 'choice' ? '抉择' : e.eventType === 'sudden' ? '突发' : '日常';
        const key = stage + '·' + type;
        catMap[key] = catMap[key] || { total: 0, got: 0 };
        catMap[key].total++;
        if (seenEventSet.has(e.id)) catMap[key].got++;
      });
    }
    const allEndings = App.ALL_ENDINGS;
    const endingCells = allEndings.map(eid => {
      const got = (this.codex.endings || {})[eid] > 0;
      return `<span class="effect ${got ? 'pos' : ''}" style="${got ? 'border-color:var(--vermilion)' : ''}">${got ? '✅' : '❓'}${endingNames[eid]}</span>`;
    }).join(' ');
    // v2.1.47 L3.3 结局概率：本机跨周目真实分布（gameStats.endings 计数 / plays 样本），未解锁灰显
    const statsAll = this.stats || {};
    const plays = statsAll.plays || 0;
    const endingsCount = statsAll.endings || {};
    const probRows = allEndings.map(eid => ({ eid, count: endingsCount[eid] || 0 }))
      .sort((a, b) => b.count - a.count || a.eid.localeCompare(b.eid));
    const maxCount = Math.max(1, ...probRows.map(r => r.count));
    const probBars = probRows.map(r => {
      const got = r.count > 0;
      const pct = plays ? (r.count / plays * 100) : 0;
      const barW = (r.count / maxCount * 100).toFixed(1);
      return `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
        <span style="min-width:78px;font-size:11px;${got ? '' : 'color:var(--ink-lighter)'}">${got ? '' : '🔒'}${this.escapeHtml(endingNames[r.eid] || r.eid)}</span>
        <span style="flex:1;height:10px;background:var(--parchment-dark);border-radius:5px;overflow:hidden"><i style="display:block;height:100%;width:${barW}%;background:${got ? 'linear-gradient(90deg,var(--ui-blue),var(--vermilion))' : 'transparent'}" aria-hidden="true"></i></span>
        <span style="min-width:92px;font-size:10px;color:var(--ink-lighter);text-align:right">${got ? `${r.count} 次 · ${pct.toFixed(1)}%` : '尚未解锁'}</span>
      </div>`;
    }).join('');
    const recent = Object.keys(this.codex.events || {}).filter(id => seenEventSet.has(id)).sort((a, b) => this.codex.events[b] - this.codex.events[a]).slice(0, 5);
    const gotFlags = Object.keys(this.codex.flags || {});
    const uncollected = (GameData.events || []).filter(e => e && e.id && !seenEventSet.has(e.id)).slice(0, 8).map(e => e.title || e.id);
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📖</span><p>人生见闻图鉴 — 遍历体制内形形色色的人生际遇</p></div>
        <div class="stats-card">
          <div class="stat-item"><span>📖 事件收集</span><span>${prog.events}/${prog.total}（${prog.eventsPct}%）</span></div>
          <div class="stat-item"><span>🔖 flag 见闻</span><span>${prog.flags}/${prog.flagTotal}</span></div>
          <div class="stat-item"><span>🏆 结局收集</span><span>${prog.endings}/${prog.totalEndings}</span></div>
          <div style="height:8px;background:var(--parchment-dark);border-radius:4px;overflow:hidden;margin-top:10px">
            <div style="height:100%;width:${prog.eventsPct}%;background:linear-gradient(90deg,var(--ui-blue),var(--vermilion));border-radius:4px"></div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:var(--vermilion);line-height:1.9;background:var(--parchment-warm);padding:8px 10px;border-radius:8px;border-left:3px solid var(--gold)">
            ${this.getCodexHint(prog)}
          </div>
        </div>
        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">🏆 结局收集</h3>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${endingCells}</div>
        </div>
        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">📈 结局概率${plays > 0 ? `（本机 ${plays} 局实测）` : ''}</h3>
          ${plays > 0 ? probBars : '<p style="font-size:12px;color:var(--ink-lighter)">完成第一局后，这里会展示你的真实结局分布与占比</p>'}
        </div>
        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">🔖 flag 见闻分类（已收集 ${prog.flags}/${prog.flagTotal}）</h3>
          <div class="codex-flag-list" style="max-height:440px;overflow-y:auto;padding-right:6px">
            ${Object.entries(FLAG_CATEGORIES).map(([cat, flags]) => {
              const entries = Object.entries(flags);
              const gotFlags2 = new Set(Object.keys(this.codex.flags || {}));
              const got = entries.filter(([f]) => gotFlags2.has(f));
              const not = entries.filter(([f]) => !gotFlags2.has(f));
              return `<div style="margin-bottom:8px">
                <div class="stat-item"><span style="font-weight:700;color:var(--vermilion)">${cat}</span><span>${got.length}/${entries.length}</span></div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
                  ${got.map(([f, cn]) => `<span class="tag" style="font-size:9px;background:var(--parchment-warm);color:var(--vermilion);border:1px solid var(--gold)" title="${f}">✅${cn}</span>`).join('')}
                  ${not.map(([f, cn]) => `<span class="tag" style="font-size:9px;background:var(--parchment);color:var(--ink-lighter)" title="${f}">${cn}</span>`).join('')}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">📚 完成度奖励</h3>
          <div style="font-size:12px;color:var(--vermilion);font-weight:600">${escapeHtml(reward.title || '📖 尚未解锁')}</div>
          <div style="font-size:11px;color:var(--ink-light);margin-top:2px">${escapeHtml(reward.desc || '')}</div>
          <div style="font-size:10px;color:var(--ink-lighter);margin-top:4px">事件收集达到 25%/50%/75%/100% 各 +1/+2/+3/+4 天赋点（开局生效）</div>
        </div>
        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">🗂️ 事件分类</h3>
          ${Object.keys(catMap).map(k => {
            const c = catMap[k];
            const pct = c.total ? Math.round(c.got / c.total * 100) : 0;
            return `<div class="stat-item"><span>${k}</span><span>${c.got}/${c.total}（${pct}%）</span></div>`;
          }).join('')}
        </div>
        ${uncollected.length > 0 ? `<div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">❓ 尚未遇见（示例）</h3>
          <div style="font-size:11px;color:var(--ink-lighter);line-height:1.8">${uncollected.map(t => `「${t}」`).join(' ')}</div>
        </div>` : ''}
        ${recent.length > 0 ? `<div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:6px">🔝 最常遇见</h3>
          <div style="font-size:12px;color:var(--ink-light);line-height:1.7">${recent.map(id => `「${id}」×${this.codex.events[id]}`).join(' · ')}</div>
        </div>` : ''}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
  });

  App.Codex = {
    describeRequirements: describeRequirements,
    producedFlags: producedFlags,
    requiredFlags: requiredFlags,
    getGraph: getGraph,
    filterEvents: filteredEvents
  };

  Object.assign(App, {
    getCodexEventRequirements: describeRequirements,
    getCodexEventGraph: getGraph,
    codexSearch: function(value) {
      var focusState = typeof App.captureTextFieldState === 'function' ? App.captureTextFieldState('codex-search') : null;
      currentView().query = value || '';
      currentView().selectedId = null;
      refreshExplorer();
      if (focusState && typeof App.restoreTextFieldState === 'function') App.restoreTextFieldState(focusState);
    },
    codexSetFilter: function(key, value) {
      if (!['status', 'stage', 'era', 'type'].includes(key)) return;
      currentView()[key] = value || 'all';
      currentView().selectedId = null;
      refreshExplorer();
    },
    codexSelectEvent: function(id) {
      var active = document.activeElement;
      var preserveFocus = !!(active && active.dataset && active.dataset.codexEventId);
      currentView().selectedId = id;
      refreshExplorer();
      if (preserveFocus) {
        var eventButtons = document.querySelectorAll('[data-codex-event-id]');
        for (var i = 0; i < eventButtons.length; i++) {
          if (eventButtons[i].dataset.codexEventId === String(id)) {
            eventButtons[i].focus();
            break;
          }
        }
      }
      var detail = document.getElementById('codex-event-detail');
      if (detail && detail.scrollIntoView) detail.scrollIntoView({ block: 'nearest' });
    },
    renderCodexExplorer: renderExplorer
  });

  // 保留原图鉴全部内容，在其结局/flag 展示下方增加探索器；旧入口和旧存档不受影响。
  if (typeof App.showCodex === 'function' && !App.showCodexLegacy) {
    App.showCodexLegacy = App.showCodex;
    App.showCodex = function() {
      App.showCodexLegacy.call(this);
      var stage = document.querySelector('#app .stage.fade-in') || document.querySelector('#app .stage');
      if (!stage || document.getElementById('codex-enhanced')) return;
      var holder = document.createElement('div');
      holder.innerHTML = toHtml(renderExplorer());
      var node = holder.firstElementChild;
      var action = stage.querySelector('.sticky-action');
      if (node) stage.insertBefore(node, action || null);
    };
  }
})();
