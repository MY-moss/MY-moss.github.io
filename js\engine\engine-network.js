// 人脉主玩法引擎。
// 依赖：engine-core.js；兼容旧 id/relation/contactRelation。
;(function() {
  const DEFAULT_CAPACITY = 10;
  const DEFAULT_EDGE_LIMIT = 24;
  const DEFAULT_LOG_LIMIT = 120;
  const LEVEL_MAP = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 };
  const FIXED_TIER = { noble: 3, sizhang: 3, cousin: 2, elder: 1, hometown: 0, mentor: -1, classmate: -1, roommate: -1 };
  const ARCHETYPE_BY_ID = (typeof gd_network !== 'undefined' && gd_network.legacyArchetype) || {
    noble: 'mentor', elder: 'mentor', mentor: 'mentor', classmate: 'peer', oldClassmate: 'peer',
    roommate: 'peer', subordinate: 'subordinate', hometown: 'family', cousin: 'family',
    neighbor: 'community', chamber: 'business', veteran: 'bridge', doctor: 'bridge',
    journalist: 'bridge', inspector: 'bridge', partySchool: 'bridge'
  };
  const ARCHETYPES = (typeof gd_network !== 'undefined' && gd_network.archetypes) || {};
  const FIXED_CONTACT_PROFILES = (typeof gd_network !== 'undefined' && gd_network.fixedContactProfiles) || {};
  const NETWORK_PROFILE_VERSION = 3;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : min));
  const num = (v, fallback) => Number.isFinite(Number(v)) ? Number(v) : fallback;
  const bool = v => v === true;
  const SAFE_UID_RE = /^[A-Za-z0-9_-]{8,64}$/;

  function hashString(value) {
    let h = 2166136261;
    const s = String(value || 'contact');
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return (h >>> 0).toString(36);
  }

  function defaultNetwork() {
    return {
      actions: { connectionUsed: false, stewardshipUsed: false },
      contactSequence: 0,
      edges: [],
      log: [],
      metrics: { diversity: 0, bridgeCoverage: 0, support: 0, conflictExposure: 0 }
    };
  }

  function roleFor(contact, archetype) {
    if (Array.isArray(contact.roles) && contact.roles.length) return contact.roles.slice(0, 5);
    const def = ARCHETYPES[archetype];
    return def && Array.isArray(def.roles) ? def.roles.slice() : ['peer'];
  }

  GameEngine.prototype.ensureNetworkState = function() {
    const p = this.state && this.state.player;
    if (!p) return defaultNetwork();
    const n = p.network && typeof p.network === 'object' ? p.network : defaultNetwork();
    n.actions = n.actions && typeof n.actions === 'object' ? n.actions : {};
    n.actions.connectionUsed = bool(n.actions.connectionUsed);
    n.actions.stewardshipUsed = bool(n.actions.stewardshipUsed);
    n.contactSequence = Math.max(0, Math.floor(num(n.contactSequence, 0)));
    n.edges = Array.isArray(n.edges) ? n.edges : [];
    n.log = Array.isArray(n.log) ? n.log : [];
    n.metrics = n.metrics && typeof n.metrics === 'object' ? n.metrics : {};
    for (const key of ['diversity', 'bridgeCoverage', 'support', 'conflictExposure']) n.metrics[key] = num(n.metrics[key], 0);
    p.network = n;
    if (!Array.isArray(p.contacts)) p.contacts = [];
    if (typeof this.normalizeContact === 'function') {
      // 关系卡可能被 UI/旧事件暂存引用；已完成迁移的联系人保持对象身份，避免每次调用都产生旧快照。
      p.contacts = p.contacts.map((c, i) => {
        const ready = c && typeof c.uid === 'string' && c.legacyId && c.archetype && typeof c.trust === 'number' && typeof c.reciprocity === 'number' && typeof c.favorDebt === 'number' && typeof c.access === 'number' && typeof c.networkWeight === 'number' && c.organization && num(c.networkProfileVersion, 0) >= NETWORK_PROFILE_VERSION;
        return ready ? c : this.normalizeContact(c, i);
      }).filter(Boolean);
    }
    return n;
  };

  GameEngine.prototype.normalizeContact = function(contact, index) {
    if (!contact || typeof contact !== 'object') return null;
    const id = contact.legacyId || contact.id || ('contact_' + hashString(contact.name || index || 'new'));
    const profile = FIXED_CONTACT_PROFILES[id] || null;
    const profileVersion = Math.max(0, Math.floor(num(contact.networkProfileVersion, 0)));
    const migrateProfile = !!profile && profileVersion < NETWORK_PROFILE_VERSION;
    const profileArchetype = migrateProfile && profile.archetype ? profile.archetype : '';
    const archetype = profileArchetype || contact.archetype || ARCHETYPE_BY_ID[id] || (contact.enemy ? 'rival' : 'peer');
    const archetypeDef = ARCHETYPES[archetype] || {};
    const useProfileField = key => !!(migrateProfile && profile && profile[key] !== undefined && (profile.forceMigration === true || contact[key] === undefined));
    const relation = clamp(num(contact.relation, 0), -100, 100);
    const status = contact.status || (contact.enemy ? 'rival' : 'active');
    const rawUid = typeof contact.uid === 'string' ? contact.uid.trim() : '';
    const uid = SAFE_UID_RE.test(rawUid)
      ? rawUid
      : 'contact_' + hashString(id + '|' + (rawUid || '') + '|' + (contact.name || ''));
    const currentLevel = this.state && this.state.player ? num(this.state.player.unitLevel, 0) : 0;
    const homeTier = num(contact.homeTier, currentLevel);
    const fixedTier = contact.fixedTier !== undefined ? num(contact.fixedTier, homeTier) : (profile && profile.fixedTier !== undefined ? num(profile.fixedTier, homeTier) : FIXED_TIER[id]);
    const organization = contact.organization && typeof contact.organization === 'object' ? { ...contact.organization } : {};
    if (organization.tier === undefined) organization.tier = fixedTier !== undefined ? fixedTier : (profile && profile.positionLevel !== undefined ? num(profile.positionLevel, homeTier) : homeTier);
    if (!organization.system) organization.system = contact.system || (profile && profile.system) || archetypeDef.system || '社会';
    if (!organization.region) organization.region = fixedTier !== undefined ? 'fixed' : 'current';
    const out = {
      ...contact,
      uid,
      legacyId: contact.legacyId || contact.id || id,
      id: contact.id || id,
      name: contact.name || '未命名联系人',
      archetype,
      roles: roleFor(contact, archetype),
      position: contact.position || (profile && profile.position) || '普通联系人',
      positionLevel: clamp(num(useProfileField('positionLevel') ? profile.positionLevel : contact.positionLevel, num(archetypeDef.positionLevel, homeTier)), -1, 4),
      organization,
      relation,
      trust: clamp(num(contact.trust, relation), -100, 100),
      reciprocity: clamp(num(contact.reciprocity, Math.max(0, Math.round((relation + 20) / 5))), 0, 100),
      favorDebt: clamp(num(contact.favorDebt, 0), 0, 100),
      influence: clamp(num(useProfileField('influence') ? profile.influence : contact.influence, num(archetypeDef.influence, 40)), 0, 100),
      networkWeight: clamp(num(contact.networkWeight, num(archetypeDef.networkWeight, num(archetypeDef.maintenanceWeight, 1))), 0.5, 1.6),
      access: clamp(num(useProfileField('access') ? profile.access : contact.access, status === 'retired' ? 35 : status === 'recused' ? 0 : 60), 0, 100),
      status,
      region: contact.region || (fixedTier !== undefined && fixedTier !== currentLevel ? 'remote' : 'current'),
      homeTier,
      lastContactYear: num(contact.lastContactYear, num(this.state.player && this.state.player.age, 22)),
      lastChangeYear: num(contact.lastChangeYear, num(this.state.player && this.state.player.age, 22)),
      evolutionStage: Math.max(0, Math.floor(num(contact.evolutionStage, contact.evolved ? 1 : 0))),
      networkProfileVersion: NETWORK_PROFILE_VERSION
    };
    if (fixedTier !== undefined) out.fixedTier = fixedTier;
    if (out.enemy) out.status = 'rival';
    if (out.status === 'rival') out.enemy = true;
    return out;
  };

  GameEngine.prototype.resolveContact = function(ref) {
    const p = this.state.player;
    const contacts = Array.isArray(p.contacts) ? p.contacts : [];
    if (ref && typeof ref === 'object') {
      return contacts.find(c => c === ref || (ref.uid && c.uid === ref.uid) || (ref.id && c.id === ref.id)) || null;
    }
    if (ref === 'auto' || ref === undefined || ref === null) {
      const pool = contacts.filter(c => !c.enemy && c.status !== 'lost');
      return pool.length ? pool[this.rand(0, pool.length - 1)] : null;
    }
    if (typeof ref === 'string' && ref.indexOf('archetype:') === 0) {
      const type = ref.slice('archetype:'.length);
      return contacts.find(c => c.archetype === type || (c.roles || []).includes(type)) || null;
    }
    return contacts.find(c => c.uid === ref || c.id === ref || c.legacyId === ref) || null;
  };

  GameEngine.prototype.addContact = function(contact) {
    const p = this.state.player;
    const n = this.ensureNetworkState();
    const normalized = this.normalizeContact(contact, p.contacts.length);
    if (!normalized) return null;
    const index = p.contacts.findIndex(c => c.uid === normalized.uid || c.id === normalized.id || c.legacyId === normalized.legacyId);
    if (index >= 0) {
      const previous = p.contacts[index];
      p.contacts[index] = this.normalizeContact({ ...previous, ...normalized }, index);
      return p.contacts[index];
    }
    const capacity = (typeof gd_network !== 'undefined' && gd_network.contactCapacity) || DEFAULT_CAPACITY;
    if (!normalized.enemy && p.contacts.filter(c => !c.enemy).length >= capacity) {
      let weakestIndex = -1;
      let weakestScore = Infinity;
      p.contacts.forEach((c, i) => {
        if (c.enemy) return;
        const score = num(c.relation, 0) + num(c.trust, 0) * 0.35 + num(c.reciprocity, 0) * 0.15;
        if (score < weakestScore) { weakestScore = score; weakestIndex = i; }
      });
      if (weakestIndex >= 0) {
        const removed = p.contacts.splice(weakestIndex, 1)[0];
        p.careerLog.push({ year: p.age, event: `👋 人脉精力有限，与 ${removed.name} 渐渐淡了联系（被新朋友取代）` });
        this.recordNetworkLog('contact_lost', removed, '联系人容量达到上限');
      }
    }
    p.contacts.push(normalized);
    if (normalized.roles.includes('bridge')) this.addNetworkEdge('player', normalized.uid, 'bridge');
    this.updateNetworkMetrics();
    return normalized;
  };

  // 生成一名本局独有的联系人。固定人物仍用于关键剧情锚点，随机联系人负责让普通网络每局有不同组合。
  GameEngine.prototype.createRandomContact = function(options) {
    const p = this.state.player;
    const n = this.ensureNetworkState();
    const opts = options && typeof options === 'object' ? options : {};
    const templates = (typeof gd_network !== 'undefined' && Array.isArray(gd_network.randomContactTemplates)) ? gd_network.randomContactTemplates : [];
    if (!templates.length) return null;
    let pool = templates;
    if (opts.archetype) pool = pool.filter(t => t.archetype === opts.archetype);
    if (!opts.archetype && this.randf() < 0.65) {
      const preferred = this.getNetworkScenarioModifier().preferredArchetypes || [];
      const preferredPool = pool.filter(t => preferred.includes(t.archetype));
      if (preferredPool.length) pool = preferredPool;
    }
    if (!pool.length) pool = templates;
    const template = pool[this.rand(0, pool.length - 1)];
    const pick = values => Array.isArray(values) && values.length ? values[this.rand(0, values.length - 1)] : '';
    const range = values => {
      const min = Array.isArray(values) ? num(values[0], 0) : 0;
      const max = Array.isArray(values) ? num(values[1], min) : min;
      return min + this.rand(0, Math.max(0, max - min));
    };
    const currentLevel = num(p.unitLevel, 0);
    const tierMin = Array.isArray(template.tier) ? num(template.tier[0], 0) : currentLevel;
    const tierMax = Array.isArray(template.tier) ? num(template.tier[1], tierMin) : tierMin;
    const tier = clamp(tierMin + this.rand(0, Math.max(0, tierMax - tierMin)), 0, 4);
    const region = tier === currentLevel ? 'current' : 'remote';
    const status = region === 'current' ? 'active' : 'remote';
    n.contactSequence += 1;
    const id = `random_${Math.max(0, Math.floor(num(p.age, 0)))}_${n.contactSequence}`;
    const name = pick(template.names) || '新认识的朋友';
    return {
      id,
      uid: `contact_${hashString(id + '|' + name)}`,
      name,
      archetype: template.archetype,
      roles: Array.isArray(template.roles) ? template.roles.slice() : roleFor(template, template.archetype),
      relation: range(template.relation),
      trust: range(template.trust),
      reciprocity: range(template.reciprocity),
      favorDebt: 0,
      influence: range(template.influence),
      access: region === 'current' ? 62 : 42,
      status,
      region,
      homeTier: tier,
      positionLevel: tier,
      position: pick(template.positions) || '体制内相识',
      description: opts.source === 'test' ? '测试用随机联系人' : '在工作、培训或日常往来中认识的联系人',
      organization: { unitId: null, system: pick(template.systems) || '社会', tier, region },
      lastContactYear: num(p.age, 0),
      lastChangeYear: num(p.age, 0),
      evolutionStage: 0
    };
  };

  GameEngine.prototype.adjustContactRelation = function(ref, delta) {
    const c = this.resolveContact(ref);
    if (!c) return false;
    return !!this.applyContactDelta(c, { relation: num(delta, 0) }, 'legacy_relation');
  };

  GameEngine.prototype.pickRandomContact = function() {
    const c = this.resolveContact('auto');
    return c ? c.id : null;
  };

  GameEngine.prototype.addEnemy = function(enemy) {
    const p = this.state.player;
    p.flags.enemyEver = true;
    return this.addContact({ ...enemy, relation: num(enemy && enemy.relation, -30), enemy: true, status: 'rival', archetype: 'rival' });
  };

  GameEngine.prototype.applyContactDelta = function(ref, delta, source) {
    const c = this.resolveContact(ref);
    if (!c || !delta || typeof delta !== 'object') return { ok: false, code: 'CONTACT_NOT_FOUND', changes: {} };
    const before = {};
    const changes = {};
    for (const key of ['relation', 'trust', 'reciprocity', 'favorDebt', 'influence', 'access']) {
      if (typeof delta[key] !== 'number') continue;
      before[key] = c[key];
      const limits = key === 'relation' ? [-100, 100] : [0, 100];
      c[key] = clamp(c[key] + delta[key], limits[0], limits[1]);
      changes[key] = c[key] - before[key];
    }
    if (typeof delta.status === 'string') {
      before.status = c.status;
      c.status = delta.status;
      if (delta.status === 'rival') c.enemy = true;
      if (delta.status === 'active') c.enemy = false;
      changes.status = c.status;
    }
    c.lastChangeYear = num(this.state.player.age, c.lastChangeYear);
    if (c.enemy && c.relation >= 0) {
      c.enemy = false;
      c.status = 'active';
      changes.status = 'active';
      this.state.player.careerLog.push({ year: this.state.player.age, event: '🤝 与 ' + c.name + ' 冰释前嫌，多年的恩怨就此揭过' });
    }
    if (Object.keys(changes).length) {
      this.recordNetworkLog('contact_delta', c, source || '关系变化', changes);
      this.updateNetworkMetrics();
    }
    return { ok: true, code: 'CONTACT_DELTA_APPLIED', changes, contact: c };
  };

  GameEngine.prototype.evolveContact = function(ref, meta) {
    const c = this.resolveContact(ref);
    if (!c || !meta || typeof meta !== 'object') return { ok: false, code: 'CONTACT_NOT_FOUND', changes: {} };
    const changes = {};
    for (const key of ['position', 'positionLevel', 'status', 'evolutionStage']) {
      if (meta[key] === undefined) continue;
      if (c[key] !== meta[key]) { changes[key] = { from: c[key], to: meta[key] }; c[key] = meta[key]; }
    }
    for (const key of ['influence', 'access']) {
      if (typeof meta[key] !== 'number') continue;
      const next = clamp(meta[key], 0, 100);
      if (c[key] !== next) { changes[key] = { from: c[key], to: next }; c[key] = next; }
    }
    if (Array.isArray(meta.addRoles)) {
      const nextRoles = Array.from(new Set((c.roles || []).concat(meta.addRoles))).slice(0, 5);
      if (nextRoles.join('|') !== (c.roles || []).join('|')) { changes.roles = { from: c.roles, to: nextRoles }; c.roles = nextRoles; }
    }
    if (meta.archetype && c.archetype !== meta.archetype) { changes.archetype = { from: c.archetype, to: meta.archetype }; c.archetype = meta.archetype; }
    if (c.status === 'retired') c.access = Math.min(c.access, 40);
    if (c.status === 'recused') c.access = 0;
    c.lastChangeYear = this.state.player.age;
    this.recordNetworkLog('contact_evolution', c, meta.message || '联系人职业变化', changes);
    this.state.player.careerLog.push({ year: this.state.player.age, event: `📈 ${c.name}${meta.message || '职业状态发生变化'}` });
    this.updateNetworkMetrics();
    return { ok: true, code: 'CONTACT_EVOLVED', changes, contact: c };
  };

  GameEngine.prototype.recordNetworkLog = function(type, contact, message, changes) {
    const n = this.ensureNetworkState();
    n.log.push({
      year: num(this.state.player.age, 0), type,
      contactUid: contact && contact.uid,
      contactId: contact && (contact.legacyId || contact.id),
      message: message || '', changes: changes || {}
    });
    const limit = (typeof gd_network !== 'undefined' && gd_network.logLimit) || DEFAULT_LOG_LIMIT;
    if (n.log.length > limit) n.log.splice(0, n.log.length - limit);
  };

  GameEngine.prototype.addNetworkEdge = function(from, to, type, label) {
    const n = this.ensureNetworkState();
    if (!from || !to || from === to) return false;
    const exists = n.edges.find(e => e.from === from && e.to === to && e.type === type);
    if (exists) return false;
    const limit = (typeof gd_network !== 'undefined' && gd_network.edgeLimit) || DEFAULT_EDGE_LIMIT;
    if (n.edges.length >= limit) n.edges.shift();
    n.edges.push({ from, to, type: type || 'contact', label: label || '' });
    return true;
  };

  GameEngine.prototype.updateNetworkMetrics = function() {
    const p = this.state.player;
    const n = this.ensureNetworkState();
    const contacts = (p.contacts || []).filter(c => !c.enemy && c.status !== 'lost');
    const categories = new Set(contacts.map(c => c.archetype || 'peer'));
    const bridges = contacts.filter(c => (c.roles || []).includes('bridge') || c.archetype === 'bridge').length;
    const support = contacts.reduce((sum, c) => sum + (c.status === 'active' ? Math.max(0, c.trust) * Math.max(0, c.access) * num(c.networkWeight, 1) / 10000 : 0), 0);
    const conflict = (p.contacts || []).reduce((sum, c) => sum + (c.enemy || c.status === 'rival' ? 1 : 0) + (num(c.favorDebt, 0) >= 50 ? 0.5 : 0), 0);
    n.metrics.diversity = contacts.length ? Math.min(1, categories.size / Math.max(4, Math.min(8, contacts.length))) : 0;
    n.metrics.bridgeCoverage = contacts.length ? Math.min(1, bridges / Math.max(2, contacts.length * 0.35)) : 0;
    n.metrics.support = Math.min(1, support / 5);
    n.metrics.conflictExposure = Math.min(1, conflict / 4);
    return n.metrics;
  };

  GameEngine.prototype.getNetworkScenarioModifier = function() {
    const id = (this.state && this.state.scenarioId) || 'classic';
    const modifiers = (typeof gd_network !== 'undefined' && gd_network.scenarioModifiers) || {};
    return modifiers[id] || modifiers.classic || { id: 'classic', label: '均衡网络', focus: '在拓展与维系之间保持平衡', preferredArchetypes: [], pressureMultiplier: 1, actionDelta: {} };
  };

  GameEngine.prototype.applyNetworkScenarioDelta = function(action) {
    const modifier = this.getNetworkScenarioModifier();
    const delta = modifier.actionDelta && modifier.actionDelta[action];
    const changes = {};
    if (!delta || typeof delta !== 'object') return changes;
    const p = this.state.player;
    const h = this.state.hidden;
    for (const [key, raw] of Object.entries(delta)) {
      if (typeof raw !== 'number') continue;
      const target = Object.prototype.hasOwnProperty.call(h, key) ? h : p;
      if (!Object.prototype.hasOwnProperty.call(target, key) || typeof target[key] !== 'number') continue;
      const before = target[key];
      target[key] += raw;
      if (key === 'risk' || key === 'integrity' || key === 'familyPressure' || key === 'mentalPressure') target[key] = clamp(target[key], -100, 100);
      changes[key] = target[key] - before;
    }
    return changes;
  };

  GameEngine.prototype.getNetworkSummary = function() {
    const p = this.state.player;
    const metrics = this.updateNetworkMetrics();
    const n = this.ensureNetworkState();
    const scenario = this.getNetworkScenarioModifier();
    const actions = {
      connectionUsed: !!n.actions.connectionUsed,
      // 旧存档可能只有 giftUsed/visitUsed；这里统一转换为 UI 可直接消费的槽位状态。
      stewardshipUsed: this.isNetworkSlotUsed('stewardship')
    };
    return {
      capacity: (typeof gd_network !== 'undefined' && gd_network.contactCapacity) || DEFAULT_CAPACITY,
      total: (p.contacts || []).length,
      active: (p.contacts || []).filter(c => !c.enemy && c.status === 'active').length,
      remote: (p.contacts || []).filter(c => c.region === 'remote' || c.status === 'remote').length,
      rivals: (p.contacts || []).filter(c => c.enemy || c.status === 'rival').length,
      contacts: (p.contacts || []).slice(),
      actions,
      scenario: { id: this.state.scenarioId || 'classic', label: scenario.label, focus: scenario.focus, preferredArchetypes: (scenario.preferredArchetypes || []).slice() },
      metrics: { ...metrics },
      edges: n.edges.slice(),
      log: n.log.slice(-20)
    };
  };

  GameEngine.prototype.getContactCapability = function(ref, context) {
    const c = this.resolveContact(ref);
    if (!c) return { ok: false, reason: '联系人不存在' };
    // 异地、调任和退休并不等于彻底失联：只要仍有足够可达性，电话、培训、项目协作等弱关系渠道仍然可以求助。
    // 真正阻断求助的是回避、失联、敌对和过高人情债；距离带来的额外代价由 getNetworkActionCost() 处理。
    const askStatusAllowed = !['recused', 'lost', 'rival'].includes(c.status);
    const ask = askStatusAllowed && !c.enemy && c.access >= 30 && c.trust >= 30 && c.favorDebt < 75;
    const maintain = c.status !== 'lost' && c.status !== 'recused';
    const reason = c.status === 'recused' ? '公务回避中' : c.status === 'retired' && c.access < 20 ? '退休后暂时联系不上' : !ask ? '信任或可达性不足' : '';
    return { ok: true, contact: c, canAsk: ask, canMaintain: maintain, reason, context: context || null };
  };

  GameEngine.prototype.isNetworkSlotUsed = function(slot) {
    const n = this.ensureNetworkState();
    if (slot === 'stewardship') return !!n.actions.stewardshipUsed || !!this.state.player.flags.giftUsed || !!this.state.player.flags.visitUsed;
    return !!n.actions.connectionUsed;
  };

  GameEngine.prototype.getContactRankLabel = function(ref) {
    const c = ref && typeof ref === 'object' ? ref : (ref == null ? null : this.resolveContact(ref));
    const level = c ? Math.round(num(c.positionLevel, -1)) : -1;
    const labels = typeof gd_network !== 'undefined' && gd_network.rankLabels ? gd_network.rankLabels : {};
    return labels[String(level)] || (level < 0 ? '社会关系' : `层级 ${level}`);
  };

  GameEngine.prototype.getNetworkEconomyConfig = function() {
    const config = typeof gd_network !== 'undefined' && gd_network.networkEconomy ? gd_network.networkEconomy : {};
    const maxBatchTargets = Math.max(1, Math.floor(num(config.maxBatchTargets, 3)));
    return {
      minBatchTargets: Math.min(maxBatchTargets, Math.max(1, Math.floor(num(config.minBatchTargets, 2)))),
      maxBatchTargets,
      batchCostFactors: Array.isArray(config.batchCostFactors) && config.batchCostFactors.length ? config.batchCostFactors : [1, 0.94, 0.88],
      batchPressureFactors: Array.isArray(config.batchPressureFactors) && config.batchPressureFactors.length ? config.batchPressureFactors : [1, 0.96, 0.92],
      positionPremium: Array.isArray(config.positionPremium) ? config.positionPremium : [0, 2, 4, 7, 10],
      influenceStep: Math.max(1, num(config.influenceStep, 15)),
      baseInfluence: clamp(num(config.baseInfluence, 20), 0, 100)
    };
  };

  GameEngine.prototype.getNetworkActionCost = function(action, contact, context) {
    const def = (typeof gd_network !== 'undefined' && gd_network.actionCosts && gd_network.actionCosts[action]) || {};
    const c = contact && typeof contact === 'object' ? contact : (contact == null ? null : this.resolveContact(contact));
    const remote = !!(c && (c.region === 'remote' || c.status === 'remote' || c.status === 'transferred'));
    const baseCash = num(def.cash, 0);
    if (!c) {
      const scenario = this.getNetworkScenarioModifier();
      return {
        cash: Math.max(0, Math.floor(baseCash)),
        pressure: Math.round(num(def.pressure, 0) * num(scenario.pressureMultiplier, 1) * 10) / 10,
        remote: false,
        label: def.label || action,
        rankLabel: null,
        dynamic: false,
        breakdown: { base: Math.max(0, Math.floor(baseCash)) },
        context: context || null
      };
    }
    const economy = this.getNetworkEconomyConfig();
    const level = clamp(Math.round(num(c.positionLevel, 0)), 0, economy.positionPremium.length - 1);
    const influence = clamp(num(c.influence, 40), 0, 100);
    const rawPositionPremium = Math.max(0, num(economy.positionPremium[level], level * 2));
    const positionPremium = Math.ceil(rawPositionPremium * 0.2);
    const rawInfluencePremium = Math.ceil(Math.max(0, influence - economy.baseInfluence) / economy.influenceStep);
    const influencePremium = Math.ceil(rawInfluencePremium * 0.2);
    const accessPremium = c.access < 40 ? 2 : c.access < 60 ? 1 : 0;
    const roleDefs = ARCHETYPES[c.archetype] || {};
    let roleMultiplier = num(c.networkWeight, num(roleDefs.maintenanceWeight, 1));
    if (Array.isArray(c.roles) && c.roles.includes('sponsor')) roleMultiplier = Math.max(roleMultiplier, 1.18);
    if (Array.isArray(c.roles) && c.roles.includes('oversight')) roleMultiplier = Math.max(roleMultiplier, 1.16);
    const actionMultiplier = { cultivate: 0.92, collaborate: 1.05, introduce: 0.94, maintain: 1, ask: 0.78, repay: 0.96, resolveConflict: 1.08 }[action] || 1;
    const relationMultiplier = action === 'maintain'
      ? (num(c.relation, 0) < 20 ? 1.12 : num(c.relation, 0) >= 80 ? 1.08 : 1)
      : 1;
    const statusMultiplier = c.status === 'transferred' ? 1.1 : c.status === 'retired' ? 0.92 : 1;
    // remoteCash 是旧配置的上限提示，不直接叠加全部价差，避免异地关系在低现金阶段完全不可经营。
    const remotePremium = remote ? Math.ceil(Math.max(0, num(def.remoteCash, baseCash) - baseCash) * 0.2) : 0;
    const base = baseCash + remotePremium;
    const preMultiplier = base + positionPremium + influencePremium + accessPremium;
    const cash = Math.max(baseCash, Math.ceil(preMultiplier * roleMultiplier * actionMultiplier * relationMultiplier * statusMultiplier));
    const scenario = this.getNetworkScenarioModifier();
    return {
      cash: Math.max(0, Math.floor(cash)),
      pressure: Math.round(num(def.pressure, 0) * num(scenario.pressureMultiplier, 1) * 10) / 10,
      remote,
      label: def.label || action,
      rankLabel: this.getContactRankLabel(c),
      dynamic: true,
      breakdown: {
        base,
        positionPremium,
        influencePremium,
        accessPremium,
        roleMultiplier,
        actionMultiplier,
        relationMultiplier,
        statusMultiplier
      },
      context: context || null
    };
  };

  GameEngine.prototype.getNetworkBatchCost = function(action, refs, context) {
    const list = Array.isArray(refs) ? refs : (refs == null ? [] : [refs]);
    const unique = [];
    const seen = new Set();
    for (const ref of list) {
      const key = ref && typeof ref === 'object' ? (ref.uid || ref.id || ref.legacyId) : String(ref);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(ref);
    }
    const economy = this.getNetworkEconomyConfig();
    if (!unique.length) return { ok: false, code: 'CONTACT_NOT_FOUND', contacts: [], items: [], totalCash: 0, pressure: 0 };
    if (action === 'maintain' && unique.length < economy.minBatchTargets) return { ok: false, code: 'NETWORK_MIN_TARGETS', contacts: [], items: [], totalCash: 0, pressure: 0, minTargets: economy.minBatchTargets, maxTargets: economy.maxBatchTargets };
    if (unique.length > economy.maxBatchTargets) return { ok: false, code: 'NETWORK_TARGET_LIMIT', contacts: [], items: [], totalCash: 0, pressure: 0, maxTargets: economy.maxBatchTargets };
    const contacts = unique.map(ref => this.resolveContact(ref));
    if (contacts.some(c => !c)) return { ok: false, code: 'CONTACT_NOT_FOUND', contacts, items: [], totalCash: 0, pressure: 0 };
    const items = contacts.map((c, index) => {
      const cost = this.getNetworkActionCost(action, c, context);
      const costFactor = num(economy.batchCostFactors[index], economy.batchCostFactors[economy.batchCostFactors.length - 1] || 1);
      const pressureFactor = num(economy.batchPressureFactors[index], economy.batchPressureFactors[economy.batchPressureFactors.length - 1] || 1);
      return {
        uid: c.uid,
        id: c.id,
        name: c.name,
        cost,
        costFactor,
        pressureFactor,
        cash: Math.max(0, Math.ceil(cost.cash * costFactor)),
        pressure: Math.max(0, Math.round(cost.pressure * pressureFactor * 10) / 10)
      };
    });
    return {
      ok: true,
      code: 'NETWORK_BATCH_COST_READY',
      contacts,
      items,
      totalCash: items.reduce((sum, item) => sum + item.cash, 0),
      pressure: Math.round(items.reduce((sum, item) => sum + item.pressure, 0) * 10) / 10,
      maxTargets: economy.maxBatchTargets
    };
  };

  GameEngine.prototype.getNetworkActionOptions = function(slot) {
    const p = this.state.player;
    const used = this.isNetworkSlotUsed(slot);
    const scenario = this.getNetworkScenarioModifier();
    const cash = p.finance && Number.isFinite(Number(p.finance.cash)) ? Number(p.finance.cash) : 0;
    const actions = slot === 'connection'
      ? ['cultivate', 'collaborate', 'introduce']
      : ['maintain', 'ask', 'repay', 'resolveConflict'];
    return actions.map(action => {
      const def = (typeof gd_network !== 'undefined' && gd_network.actionCosts && gd_network.actionCosts[action]) || { label: action };
      const cost = this.getNetworkActionCost(action, null);
      return { action, slot, label: def.label, used, available: !used, canAfford: cash >= cost.cash, minTargets: action === 'maintain' ? this.getNetworkEconomyConfig().minBatchTargets : 1, maxTargets: action === 'maintain' ? this.getNetworkEconomyConfig().maxBatchTargets : 1, batchSupported: action === 'maintain', scenario: { label: scenario.label, focus: scenario.focus }, cost: { cash: cost.cash, pressure: cost.pressure, remoteCash: num(def.remoteCash, cost.cash) }, targets: (p.contacts || []).map(c => { const targetCost = this.getNetworkActionCost(action, c); return { uid: c.uid, id: c.id, name: c.name, archetype: c.archetype, positionLevel: c.positionLevel, rankLabel: this.getContactRankLabel(c), influence: c.influence, access: c.access, cash: targetCost.cash, canAfford: cash >= targetCost.cash, canMaintain: action === 'maintain' ? this.getContactCapability(c).canMaintain : true }; }) };
    });
  };

  GameEngine.prototype.performNetworkAction = function(input) {
    const req = input || {};
    if (Array.isArray(req.targets)) return this.performNetworkBatchAction(req);
    const slot = req.slot === 'connection' || req.slot === 'stewardship' ? req.slot : ((req.action === 'cultivate' || req.action === 'collaborate' || req.action === 'introduce') ? 'connection' : 'stewardship');
    const action = req.action || 'maintain';
    if (this.isNetworkSlotUsed(slot)) return { ok: false, code: 'NETWORK_SLOT_USED', message: '本年度这个行动槽已经用过了', consumedSlot: null, changes: {}, followUpEventId: null };
    const c = this.resolveContact(req.target || req.contactId);
    if (!c) return { ok: false, code: 'CONTACT_NOT_FOUND', message: '没有找到目标联系人', consumedSlot: null, changes: {}, followUpEventId: null };
    const cap = this.getContactCapability(c, req.context);
    const knownActions = ['cultivate', 'collaborate', 'maintain', 'ask', 'repay', 'resolveConflict', 'introduce'];
    if (!knownActions.includes(action)) return { ok: false, code: 'UNKNOWN_NETWORK_ACTION', message: '未知的人脉行动', consumedSlot: null, changes: {}, followUpEventId: null };
    if (action === 'maintain' && !cap.canMaintain) return { ok: false, code: 'CONTACT_UNAVAILABLE', message: cap.reason || '当前无法维系这段关系', consumedSlot: null, changes: {}, followUpEventId: null };
    if (action === 'ask' && !cap.canAsk) return { ok: false, code: 'CONTACT_UNAVAILABLE', message: cap.reason || '这段关系还不足以开口求助', consumedSlot: null, changes: {}, followUpEventId: null };
    if (action === 'repay' && c.favorDebt <= 0) return { ok: false, code: 'NO_FAVOR_DEBT', message: '这段关系没有待偿还的人情', consumedSlot: null, changes: {}, followUpEventId: null };
    if (action === 'resolveConflict' && !c.enemy && c.status !== 'rival' && c.relation >= 0) return { ok: false, code: 'NO_CONFLICT', message: '当前没有需要化解的冲突', consumedSlot: null, changes: {}, followUpEventId: null };
    const cost = this.getNetworkActionCost(action, c, req.context);
    const currentCash = this.state.player.finance && Number.isFinite(Number(this.state.player.finance.cash)) ? Number(this.state.player.finance.cash) : 0;
    if (currentCash < cost.cash) return { ok: false, code: 'INSUFFICIENT_FUNDS', message: `${cost.label}需要现金 ${cost.cash}，当前只有 ${Math.floor(currentCash)}`, consumedSlot: null, changes: {}, followUpEventId: null };
    if (cost.cash > 0) this.cashOut(cost.cash);
    let result;
    if (action === 'cultivate') {
      result = this.applyContactDelta(c, { relation: c.relation >= 70 ? 1 : 4, trust: 2, reciprocity: 2, access: c.region === 'remote' ? 0 : 2 }, '主动拓展');
      this.addNetworkEdge('player', c.uid, 'cultivate');
    } else if (action === 'collaborate') {
      result = this.applyContactDelta(c, { relation: 4, trust: 4, reciprocity: 3, access: 3 }, '跨部门协作');
      this.state.hidden.workAbility = Math.min(100, (this.state.hidden.workAbility || 0) + 2);
      this.addNetworkEdge('player', c.uid, 'bridge', '协作');
    } else if (action === 'maintain') {
      if (!cap.canMaintain) return { ok: false, code: 'CONTACT_UNAVAILABLE', message: cap.reason || '当前无法维系这段关系', consumedSlot: null, changes: {}, followUpEventId: null };
      const gain = c.region === 'remote' ? 2 : 3;
      result = this.applyContactDelta(c, { relation: gain, trust: 2, reciprocity: 1, access: c.region === 'remote' ? 0 : 2, favorDebt: -1 }, '关系维系');
      c.lastContactYear = this.state.player.age;
    } else if (action === 'ask') {
      if (!cap.canAsk) return { ok: false, code: 'CONTACT_UNAVAILABLE', message: cap.reason || '这段关系还不足以开口求助', consumedSlot: null, changes: {}, followUpEventId: null };
      const beforeDebt = c.favorDebt;
      const reward = typeof this.contactReward === 'function' ? this.contactReward(c.id, c.relation) : { msg: '联系人提供了一些帮助' };
      const debtGain = beforeDebt >= 40 ? 8 : 4;
      result = this.applyContactDelta(c, { relation: beforeDebt >= 50 ? -6 : -2, trust: -1, reciprocity: 1, favorDebt: debtGain }, '请求帮助');
      result.message = `${c.name}提供了帮助：${reward.msg}`;
      if (c.favorDebt >= 70) result.message += ' 人情债已经偏高，继续开口前最好先偿还或用实际行动回馈。';
    } else if (action === 'repay') {
      if (c.favorDebt <= 0) return { ok: false, code: 'NO_FAVOR_DEBT', message: '这段关系没有待偿还的人情', consumedSlot: null, changes: {}, followUpEventId: null };
      result = this.applyContactDelta(c, { favorDebt: -Math.min(12, c.favorDebt), relation: 3, trust: 4, reciprocity: 4 }, '偿还人情');
    } else if (action === 'resolveConflict') {
      if (!c.enemy && c.status !== 'rival' && c.relation >= 0) return { ok: false, code: 'NO_CONFLICT', message: '当前没有需要化解的冲突', consumedSlot: null, changes: {}, followUpEventId: null };
      result = this.applyContactDelta(c, { status: 'active', relation: 12, trust: 5, reciprocity: 2, access: 10 }, '冲突修复');
    } else if (action === 'introduce') {
      result = this.applyContactDelta(c, { relation: 2, trust: 2, reciprocity: 2 }, '牵线搭桥');
      c.roles = Array.from(new Set((c.roles || []).concat('bridge'))).slice(0, 5);
      c.archetype = c.archetype === 'rival' ? c.archetype : 'bridge';
      this.addNetworkEdge('player', c.uid, 'bridge', '介绍关系');
    }
    if (!result || result.ok === false) return { ok: false, code: result && result.code || 'NETWORK_ACTION_FAILED', message: result && result.message || '人脉行动未完成', consumedSlot: null, changes: {}, followUpEventId: null };
    if (cost.cash > 0) result.changes.cash = -cost.cash;
    const n = this.ensureNetworkState();
    n.actions[slot + 'Used'] = true;
    if (slot === 'stewardship') this.state.player.flags.visitUsed = 1;
    const scenarioChanges = this.applyNetworkScenarioDelta(action);
    Object.assign(result.changes, scenarioChanges);
    const scenario = this.getNetworkScenarioModifier();
    this.state.hidden.mentalPressure = Math.min(100, (this.state.hidden.mentalPressure || 0) + cost.pressure);
    this.recordNetworkLog('action', c, action, result.changes);
    this.updateNetworkMetrics();
    return {
      ok: true,
      code: 'NETWORK_ACTION_APPLIED',
      message: `${result.message || `已完成一次${cost.label}`}${cost.cash > 0 ? `（现金-${cost.cash}）` : ''}`,
      consumedSlot: slot,
      changes: result.changes || {},
      followUpEventId: result.followUpEventId || null
    };
  };

  // 批量维系只消耗一次责任槽；请求帮助、还人情和化解冲突仍保持单联系人语义。
  GameEngine.prototype.performNetworkBatchAction = function(input) {
    const req = input || {};
    const action = req.action || 'maintain';
    const slot = req.slot === 'connection' || req.slot === 'stewardship' ? req.slot : 'stewardship';
    const maxTargets = this.getNetworkEconomyConfig().maxBatchTargets;
    const fail = (code, message, extra) => Object.assign({ ok: false, code, message, consumedSlot: null, changes: {}, followUpEventId: null }, extra || {});
    if (this.isNetworkSlotUsed(slot)) return fail('NETWORK_SLOT_USED', '本年度这个行动槽已经用过了');
    if (action !== 'maintain') return fail('NETWORK_SINGLE_TARGET', '这个行动一次只能针对一名联系人', { maxTargets: 1 });
    if (!Array.isArray(req.targets) || req.targets.length < 1) return fail('CONTACT_NOT_FOUND', '没有找到目标联系人');
    // UI 会阻止重复勾选，但引擎接口也必须独立保证“每名联系人只结算一次”。
    const targetRefs = [];
    const seenRefs = new Set();
    for (const ref of req.targets) {
      const key = ref && typeof ref === 'object' ? (ref.uid || ref.id || ref.legacyId) : String(ref == null ? '' : ref);
      if (!key || seenRefs.has(String(key))) continue;
      seenRefs.add(String(key));
      targetRefs.push(ref);
    }
    const minTargets = this.getNetworkEconomyConfig().minBatchTargets;
    if (targetRefs.length < minTargets) return fail('NETWORK_MIN_TARGETS', '一次至少经营 ' + minTargets + ' 名人脉', { minTargets, maxTargets });
    if (targetRefs.length > maxTargets) return fail('NETWORK_TARGET_LIMIT', '一次最多经营 ' + maxTargets + ' 名人脉', { maxTargets });

    const contacts = targetRefs.map(ref => this.resolveContact(ref));
    if (contacts.some(c => !c)) return fail('CONTACT_NOT_FOUND', '没有找到目标联系人');
    const capabilities = contacts.map(c => this.getContactCapability(c, req.context));
    for (let i = 0; i < contacts.length; i++) {
      if (!capabilities[i].canMaintain) return fail('CONTACT_UNAVAILABLE', capabilities[i].reason || '当前无法维系这段关系');
    }
    const plan = this.getNetworkBatchCost(action, targetRefs, req.context);
    if (!plan.ok) return fail(plan.code, plan.code === 'NETWORK_TARGET_LIMIT' ? '一次最多经营 ' + maxTargets + ' 名人脉' : '没有找到目标联系人', { maxTargets });
    const cash = this.state.player.finance && Number.isFinite(Number(this.state.player.finance.cash)) ? Number(this.state.player.finance.cash) : 0;
    if (cash < plan.totalCash) return fail('INSUFFICIENT_FUNDS', '批量维系需要现金 ' + plan.totalCash + '，当前只有 ' + Math.floor(cash));

    const targetChanges = [];
    const changes = {};
    const mergeNumericChanges = source => {
      for (const key of Object.keys(source || {})) {
        if (typeof source[key] === 'number') changes[key] = (changes[key] || 0) + source[key];
      }
    };
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      const gain = c.region === 'remote' ? 2 : 3;
      const result = this.applyContactDelta(c, { relation: gain, trust: 2, reciprocity: 1, access: c.region === 'remote' ? 0 : 2, favorDebt: -1 }, '关系维系');
      if (!result || result.ok === false) return fail(result && result.code || 'NETWORK_ACTION_FAILED', result && result.message || '人脉行动未完成');
      c.lastContactYear = this.state.player.age;
      mergeNumericChanges(result.changes);
      targetChanges.push({ uid: c.uid, id: c.id, name: c.name, rankLabel: this.getContactRankLabel(c), influence: c.influence, cash: plan.items[i].cash, changes: result.changes || {} });
    }
    if (plan.totalCash > 0) this.cashOut(plan.totalCash);
    changes.cash = -plan.totalCash;
    const n = this.ensureNetworkState();
    n.actions[slot + 'Used'] = true;
    if (slot === 'stewardship') this.state.player.flags.visitUsed = 1;
    Object.assign(changes, this.applyNetworkScenarioDelta(action));
    this.state.hidden.mentalPressure = Math.min(100, (this.state.hidden.mentalPressure || 0) + plan.pressure);
    for (const item of targetChanges) this.recordNetworkLog('action', this.resolveContact(item.uid), action, item.changes);
    this.updateNetworkMetrics();
    return {
      ok: true,
      code: 'NETWORK_ACTION_APPLIED',
      message: '已批量维系 ' + contacts.length + ' 名人脉（现金-' + plan.totalCash + '）',
      consumedSlot: slot,
      changes,
      targetChanges,
      targetCount: contacts.length,
      totalCost: plan.totalCash,
      followUpEventId: null
    };
  };

  GameEngine.prototype.resetNetworkActions = function() {
    const n = this.ensureNetworkState();
    n.actions.connectionUsed = false;
    n.actions.stewardshipUsed = false;
    if (this.state.player.flags) {
      this.state.player.flags.giftUsed = 0;
      this.state.player.flags.visitUsed = 0;
    }
    return n.actions;
  };

  GameEngine.prototype.reconcileContactsAfterPostingChange = function(meta) {
    const p = this.state.player;
    const n = this.ensureNetworkState();
    const fromLevel = num(meta && meta.fromLevel, 0);
    const toLevel = num(meta && meta.toLevel, p.unitLevel);
    const changes = [];
    for (const c of p.contacts || []) {
      const before = { region: c.region, status: c.status, access: c.access, positionLevel: c.positionLevel };
      const targetTier = c.fixedTier !== undefined ? c.fixedTier : num(c.organization && c.organization.tier, c.homeTier);
      const shouldBeCurrent = targetTier === toLevel || (c.organization && c.organization.region === 'current' && c.homeTier === toLevel);
      if (c.status !== 'retired' && c.status !== 'recused' && c.status !== 'rival' && c.status !== 'lost') c.status = shouldBeCurrent ? 'active' : 'remote';
      c.region = c.status === 'remote' ? 'remote' : (shouldBeCurrent ? 'current' : (c.region || 'remote'));
      const postingMoved = fromLevel !== toLevel;
      const regionChanged = before.region !== (shouldBeCurrent ? 'current' : 'remote');
      if (c.status === 'remote' && (postingMoved || regionChanged)) c.access = clamp(c.access - (postingMoved ? 10 : 4), 0, 100);
      else if (c.status === 'active' && (postingMoved || regionChanged)) c.access = clamp(c.access + (postingMoved ? 4 : 2), 0, 100);
      if (c.status === 'retired') c.access = Math.min(c.access, 40);
      if (c.status === 'recused') c.access = 0;
      if (toLevel > fromLevel && c.positionLevel < toLevel && (c.roles || []).includes('peer')) {
        c.roles = Array.from(new Set(c.roles.concat('mentor'))).slice(0, 5);
      }
      if (toLevel > fromLevel && c.positionLevel === toLevel && !(c.roles || []).includes('rival')) {
        c.roles = Array.from(new Set(c.roles.concat('peer'))).slice(0, 5);
      }
      const changed = ['region', 'status', 'access'].some(k => before[k] !== c[k]) || before.positionLevel !== c.positionLevel;
      if (changed) {
        c.lastChangeYear = p.age;
        changes.push({ uid: c.uid, id: c.id, from: before, to: { region: c.region, status: c.status, access: c.access } });
        const label = c.status === 'remote' ? '转为异地联系' : c.status === 'active' ? '恢复可联系' : c.status;
        p.careerLog.push({ year: p.age, event: `🤝 ${c.name}因岗位变化${label}（可达性${Math.round(c.access)}）` });
        this.recordNetworkLog('posting_reconcile', c, label, { access: c.access - before.access });
      }
    }
    this.updateNetworkMetrics();
    return { ok: true, changes, metrics: { ...n.metrics } };
  };

  GameEngine.prototype.setPosting = function(targetUnit, reason) {
    const p = this.state.player;
    let unit = targetUnit;
    if (typeof targetUnit === 'string' && typeof GameData !== 'undefined' && Array.isArray(GameData.units)) unit = GameData.units.find(u => u.id === targetUnit);
    if (!unit || typeof unit !== 'object') return { ok: false, code: 'UNIT_NOT_FOUND', message: '目标单位不存在' };
    const oldUnit = p.unit;
    const oldLevel = num(p.unitLevel, oldUnit && LEVEL_MAP[oldUnit.level] !== undefined ? LEVEL_MAP[oldUnit.level] : 0);
    const newLevel = LEVEL_MAP[unit.level] !== undefined ? LEVEL_MAP[unit.level] : num(unit.unitLevel, 0);
    p.unit = unit;
    p.unitLevel = newLevel;
    const meta = { fromUnit: oldUnit || null, toUnit: unit, fromLevel: oldLevel, toLevel: newLevel, reason: reason || 'posting_change' };
    const reconcile = this.reconcileContactsAfterPostingChange(meta);
    if (oldUnit && oldUnit.id !== unit.id || !oldUnit) {
      p.careerLog.push({ year: p.age, event: `📍 岗位变更：${oldUnit ? oldUnit.name : '待分配'} → ${unit.name}（${reason || '岗位调整'}）`, special: 'transfer' });
    }
    return { ok: true, code: 'POSTING_CHANGED', fromUnit: oldUnit, toUnit: unit, fromLevel: oldLevel, toLevel: newLevel, changes: reconcile.changes };
  };

  // 年度流程兼容旧入口：旧 engine-social 的 updateContactRegions 只改 region，
  // 这里统一补上 status/access/时间线，但相同岗位的每年调用不会重复扣可达性。
  GameEngine.prototype.updateContactRegions = function() {
    const p = this.state.player;
    return this.reconcileContactsAfterPostingChange({ fromLevel: p.unitLevel, toLevel: p.unitLevel, reason: 'annual_region_sync' });
  };

  GameEngine.prototype.getPromotionNetworkEffect = function() {
    const p = this.state.player;
    const contacts = (p.contacts || []).map((c, i) => this.normalizeContact(c, i)).filter(Boolean);
    const eligible = contacts.filter(c => !c.enemy && c.status === 'active' && c.access >= 30);
    const sponsors = eligible.filter(c => c.trust >= 60 && c.influence >= 45 && ((c.roles || []).includes('mentor') || (c.roles || []).includes('sponsor') || c.relation >= 65));
    const bridges = eligible.filter(c => (c.roles || []).includes('bridge') || c.archetype === 'bridge');
    const rivals = contacts.filter(c => c.enemy || c.status === 'rival');
    const diverseSystems = new Set(eligible.map(c => (c.organization && c.organization.system) || '社会')).size;
    const activeSponsor = sponsors.slice().sort((a, b) => (b.trust + b.influence + b.access) * num(b.networkWeight, 1) - (a.trust + a.influence + a.access) * num(a.networkWeight, 1))[0] || null;
    const sponsorPower = sponsors.reduce((sum, c) => sum + Math.min(1.6, num(c.networkWeight, 1)), 0);
    let supportBonus = Math.min(0.025, sponsorPower * 0.0085);
    supportBonus += Math.min(0.01, Math.max(0, diverseSystems - 1) * 0.0025);
    const bridgePower = bridges.filter(c => c.access >= 45 && c.trust >= 45).reduce((sum, c) => sum + Math.min(1.4, num(c.networkWeight, 1)), 0);
    supportBonus += Math.min(0.005, bridgePower * 0.0018);
    let conflictPenalty = Math.min(0.02, rivals.length * 0.004 + contacts.reduce((s, c) => s + (c.favorDebt >= 70 ? 0.003 : 0), 0));
    supportBonus = clamp(supportBonus - conflictPenalty, -0.04, 0.04);
    const informationBonus = Math.min(0.01, bridgePower * 0.0015 + Math.max(0, diverseSystems - 1) * 0.001);
    const explanation = [];
    if (activeSponsor) explanation.push(`一名${activeSponsor.archetype === 'mentor' ? '导师/前辈' : '高信任联系人'}提供了有限支持，尚未替代工作实绩`);
    if (bridges.length) explanation.push(`${bridges.length} 名跨部门桥接联系人提供了岗位信息和协作机会`);
    if (conflictPenalty > 0) explanation.push(`关系冲突或过高人情债带来 ${(conflictPenalty * 100).toFixed(1)}% 风险扣减`);
    if (!explanation.length) explanation.push('当前网络没有形成可兑现的晋升支持，先把工作实绩做出来');
    return {
      supportBonus,
      informationBonus,
      conflictPenalty,
      activeSponsor: activeSponsor ? { uid: activeSponsor.uid, id: activeSponsor.id, name: activeSponsor.name, trust: activeSponsor.trust, influence: activeSponsor.influence, networkWeight: activeSponsor.networkWeight, positionLevel: activeSponsor.positionLevel } : null,
      explanation
    };
  };

  // 旧的 visitContact API 代理到双槽位模型；旧 UI 不需要立刻重写即可获得新状态。
  GameEngine.prototype.visitContact = function(contactId, action) {
    const result = this.performNetworkAction({ slot: 'stewardship', action: action === 'help' ? 'ask' : 'maintain', target: contactId });
    return { ok: result.ok, msg: result.message || (result.ok ? '人脉行动完成' : result.message), code: result.code, changes: result.changes };
  };

  // 年度运行入口会调用这个轻量同步；即使旧存档没有 network 也能安全恢复。
  GameEngine.prototype.reconcileNetworkYear = function() {
    const p = this.state.player;
    this.ensureNetworkState();
    for (const c of p.contacts || []) {
      if (c.status === 'remote' || c.region === 'remote') c.access = clamp(c.access - 1, 0, 100);
    }
    this.updateNetworkMetrics();
  };

  // 旧事件通过联系人 id 请求帮助；奖励表集中在人脉模块，避免 social/network 两份实现漂移。
  GameEngine.prototype.contactReward = function(contactId, r) {
    const mult = 1 + Math.floor(Math.max(0, Math.min(100, r) - 30) / 35);
    const contact = this.resolveContact(contactId);
    // 固定人物保留旧 id 的专属奖励；随机联系人按 archetype 走同一类能力，避免新人物只得到默认安慰。
    const fixedIds = new Set(['noble', 'neighbor', 'classmate', 'oldClassmate', 'oldFriend', 'business', 'mentor', 'hometown', 'subordinate', 'qingmei', 'chamber', 'veteran', 'elder', 'journalist', 'doctor', 'inspector', 'partySchool']);
    const rewardKey = fixedIds.has(contactId) ? contactId : ((contact && contact.archetype) || contactId);
    switch (rewardKey) {
      case 'noble':
        this.state.hidden.positionWeight += 3 * mult;
        this.state.attrs.eq += 1;
        return { msg: `贵人提点了你几句（职务权重+${3 * mult}，情商+1）` };
      case 'neighbor':
        this.state.hidden.background += 2 * mult;
        this.state.player.heat = Math.max(0, (this.state.player.heat || 0) - 3);
        return { msg: `老干部帮你牵了线（背景+${2 * mult}，热度-3）` };
      case 'classmate':
        this.state.hidden.positionWeight += 2 * mult;
        this.state.attrs.iq += 1;
        return { msg: `老同学帮你递了句话（职务权重+${2 * mult}，智商+1）` };
      case 'oldClassmate':
        this.cashIn(8 + 6 * mult);
        return { msg: `老同学拉了你一把（现金+${8 + 6 * mult}）` };
      case 'oldFriend':
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 8 * mult);
        return { msg: `老朋友陪你聊了一宿（压力-${8 * mult}）` };
      case 'business':
        this.cashIn(5 + 5 * mult);
        this.state.hidden.risk = Math.min(100, (this.state.hidden.risk || 0) + 2);
        return { msg: `生意伙伴带了点门路（现金+${5 + 5 * mult}，风险+2）` };
      case 'mentor':
        this.state.hidden.workAbility = Math.min(100, (this.state.hidden.workAbility || 0) + 2 * mult);
        this.state.attrs.iq += 1;
        return { msg: `恩师指点你研究问题的方法（工作能力+${2 * mult}，智商+1）` };
      case 'hometown':
        this.state.player.peopleReputation = Math.min(100, (this.state.player.peopleReputation || 50) + 2 * mult);
        this.state.hidden.background += mult;
        return { msg: `老乡帮你在老家说了好话（民间口碑+${2 * mult}，背景+${mult}）` };
      case 'subordinate':
        this.state.hidden.workAbility = Math.min(100, (this.state.hidden.workAbility || 0) + 2 * mult);
        this.state.hidden.mentalPressure = Math.min(100, (this.state.hidden.mentalPressure || 0) + 2);
        return { msg: `小赵替你分担了不少活（工作能力+${2 * mult}，压力+2）` };
      case 'qingmei':
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 8 * mult);
        this.state.hidden.familyPressure = Math.max(0, (this.state.hidden.familyPressure || 0) - 4);
        return { msg: `苏晓陪你吃了顿饭，聊聊近况（压力-${8 * mult}，家庭压力-4）` };
      case 'chamber':
        this.cashIn(10 + 8 * mult);
        this.state.hidden.risk = Math.min(100, (this.state.hidden.risk || 0) + 3);
        return { msg: `孙会长指了条来钱的门路（现金+${10 + 8 * mult}，风险+3）` };
      case 'veteran':
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 6 * mult);
        this.state.attrs.body += 1;
        return { msg: `吴哥拉你晨跑喝羊汤，一身通透（压力-${6 * mult}，体质+1）` };
      case 'elder':
        this.state.hidden.background += 2 * mult;
        this.state.hidden.integrity = Math.min(100, (this.state.hidden.integrity || 0) + 2);
        return { msg: `钱老给你讲了讲官场的分寸（背景+${2 * mult}，廉洁+2）` };
      case 'journalist':
        this.state.player.reputation = Math.min(100, (this.state.player.reputation || 0) + 2 * mult);
        this.state.hidden.risk = Math.max(0, (this.state.hidden.risk || 0) - 1);
        return { msg: `小何提点了你几句舆论风向（声誉+${2 * mult}，风险-1）` };
      case 'doctor':
        this.state.attrs.body += 1;
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 4 * mult);
        return { msg: `赵大夫给你做了个体检，嘱咐你少熬夜（体质+1，压力-${4 * mult}）` };
      case 'inspector':
        this.state.hidden.risk = Math.max(0, (this.state.hidden.risk || 0) - 3 * mult);
        this.state.hidden.mentalPressure = Math.min(100, (this.state.hidden.mentalPressure || 0) + 2);
        return { msg: `老宋不动声色地提点你“最近风头紧”（风险-${3 * mult}，压力+2）` };
      case 'partySchool':
        this.state.hidden.background += 2 * mult;
        this.state.attrs.eq += 1;
        return { msg: `林处长跟你互通有无（背景+${2 * mult}，情商+1）` };
      case 'bridge':
        this.state.hidden.workAbility = Math.min(100, (this.state.hidden.workAbility || 0) + 1 * mult);
        this.state.hidden.background += 1 * mult;
        return { msg: '桥接联系人帮你补上了跨部门信息（工作能力+' + (1 * mult) + '，背景+' + mult + '）' };
      case 'peer':
        this.state.hidden.workAbility = Math.min(100, (this.state.hidden.workAbility || 0) + 1 * mult);
        this.state.attrs.eq += 1;
        return { msg: '同事和同学交换了经验（工作能力+' + (1 * mult) + '，情商+1）' };
      case 'community':
        this.state.player.peopleReputation = Math.min(100, (this.state.player.peopleReputation || 50) + 2 * mult);
        this.state.hidden.risk = Math.max(0, (this.state.hidden.risk || 0) - 1);
        return { msg: '基层联系人提供了真实反馈（民间口碑+' + (2 * mult) + '，风险-1）' };
      case 'family':
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 5 * mult);
        this.state.hidden.familyPressure = Math.max(0, (this.state.hidden.familyPressure || 0) - 2);
        return { msg: '亲友给了你情绪和生活上的支持（压力-' + (5 * mult) + '，家庭压力-2）' };
      default:
        this.state.hidden.mentalPressure = Math.max(0, (this.state.hidden.mentalPressure || 0) - 3);
        return { msg: '聊了聊天（压力-3）' };
    }
  };
})();
