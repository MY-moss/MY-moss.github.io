// ==================== 实时监控客户端 v2 ====================
// 每2秒读取游戏状态并上报到服务器（含成就/统计/图鉴/历史等扩展数据）
(function() {
  if (window.SHANGAN_STATIC_CONFIG && window.SHANGAN_STATIC_CONFIG.staticOnly) return;
  var REPORT_INTERVAL = 2000;
  var apiUrl = window.location.origin + '/api/state';
  var lastReport = '';
  var timer = null;
  var inflight = false; // v2.16: in-flight 去重，防服务器慢时请求堆积
  var paused = false;   // v2.16: 后台标签页暂停上报（省电/省流量）
  var lastLogTail = ''; // v2.18: careerLog 尾部标记（日志新增时才重建，避免每次全量序列化）
  var lastLogCache = [];
  var PLAYER_ID_KEY = 'shanganMonitorPlayerId';
  var catalogReported = false; // 事件目录只在首次成功上报时发送，避免每2秒重复传输
  var strategyLabelsSent = false; // v2.1.43: 策略标签首次成功后不再重复发送（服务端增量合并）
  var lastVisibilityKey = '';
  var VISIBILITY_WATCHLIST = ['enl014', 'enl142', 'enl162'];

  function safe(fn, def) { try { return fn(); } catch(e) { return def; } }

  function getPlayerId() {
    var existing = safe(function() { return localStorage.getItem(PLAYER_ID_KEY) || ''; }, '');
    if (/^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;
    var id = '';
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) id = crypto.randomUUID();
    } catch(e) {}
    if (!id) id = Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
    id = id.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64);
    if (id.length < 8) id = (id + 'xxxxxxxx').slice(0, 8);
    safe(function() { localStorage.setItem(PLAYER_ID_KEY, id); }, null);
    return id;
  }
  var playerId = getPlayerId();

  function collectState() {
    try {
      if (typeof engine === 'undefined' || !engine || !engine.getPlayer) return null;
      var p = engine.getPlayer();
      if (!p) return null;
      var h = typeof engine.getHidden === 'function' ? engine.getHidden() : {};
      var a = typeof engine.getAttrs === 'function' ? engine.getAttrs() : {};
      var gameState = safe(function() { return engine.getState ? engine.getState() : {}; }, {});
      var log = p.careerLog || [];
      // v2.18: 只上报最近 20 条，且仅在日志新增时重新序列化（配合 lastReport 去重，网络流量不变但 CPU 开销大减）
      var logTail = log.length + ':' + (log.length > 0 ? log[log.length - 1].event : '');
      if (logTail !== lastLogTail) {
        lastLogTail = logTail;
        lastLogCache = log.slice(-20).map(function(l) { return { year: l.year, event: l.event, special: l.special }; });
      }
      var lastEntry = log.length > 0 ? log[log.length - 1] : null;
      var eventCounts = {};
      if (p.eventCounts && typeof p.eventCounts === 'object' && !Array.isArray(p.eventCounts)) {
        Object.keys(p.eventCounts).slice(0, 2000).forEach(function(id) {
          var count = Number(p.eventCounts[id]);
          if (/^[A-Za-z0-9_.:-]{1,80}$/.test(id) && isFinite(count) && count > 0) eventCounts[id] = Math.min(100000, Math.floor(count));
        });
      }
      var catalog = safe(function() {
        return (typeof GameData !== 'undefined' && Array.isArray(GameData.events))
          ? GameData.events.filter(function(e) { return e && /^[A-Za-z0-9_.:-]{1,80}$/.test(e.id); }).map(function(e) { return e.id; })
          : [];
      }, []);
      var eventLabels = {};
      safe(function() {
        if (typeof GameData === 'undefined' || !Array.isArray(GameData.events)) return;
        var wanted = new Set(Object.keys(eventCounts));
        GameData.events.forEach(function(e) {
          if (e && wanted.has(e.id) && e.title) eventLabels[e.id] = String(e.title).slice(0, 100);
        });
      }, null);
      var background = p.background && typeof p.background === 'object' ? p.background : {};
      var major = p.major && typeof p.major === 'object' ? p.major : {};
      var talentIds = Array.isArray(p.talents) ? p.talents.slice(0, 8).filter(function(id) { return /^[A-Za-z0-9_.:-]{1,80}$/.test(id); }) : [];
      var strategy = {
        background: background.id || '',
        major: major.id || '',
        talents: talentIds,
        era: gameState.era || '',
        difficulty: gameState.difficulty || '',
        personality: p.personality || '',
        ambition: p.ambition || '',
        labels: {}
      };
      // v2.1.43: 策略标签服务端增量合并，首次成功后不再重复传输
      if (!strategyLabelsSent) {
        if (strategy.background && background.name) strategy.labels['backgrounds:' + strategy.background] = background.name;
        if (strategy.major && major.name) strategy.labels['majors:' + strategy.major] = major.name;
        talentIds.forEach(function(id) {
          var talent = safe(function() { return (GameData.talents || []).find(function(t) { return t && t.id === id; }); }, null);
          if (talent && talent.name) strategy.labels['talents:' + id] = talent.name;
        });
      }
      var activePhase = ['career', 'event', 'ending'].indexOf(typeof engine.getPhase === 'function' ? engine.getPhase() : '') >= 0;
      var runActive = !!(activePhase || p.isEmployed || p.yearsWorked > 0 || p.ending);
      var eventVisibility = null;
      if (runActive && typeof engine.getEventVisibilityDiagnostics === 'function') {
        var phase = typeof engine.getPhase === 'function' ? engine.getPhase() : '';
        var unitId = p.unit && typeof p.unit === 'object' ? (p.unit.id || '') : '';
        var unitLevel = p.unit && typeof p.unit === 'object' ? (p.unit.level || p.unitLevel || '') : (p.unitLevel || '');
        var strategyKey = [strategy.background || '', strategy.major || '', (strategy.talents || []).join(',')]
          .join('|').replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 100);
        var visibilityKey = [gameState.runId || ('plays:' + ((typeof App !== 'undefined' && App && App.stats && App.stats.plays) || 0)), p.age || 0, p.yearsWorked || 0, phase, unitId, unitLevel, gameState.scenarioId || 'classic', strategyKey].join(':');
        if (visibilityKey !== lastVisibilityKey) {
          var visibilityReport = safe(function() { return engine.getEventVisibilityDiagnostics(VISIBILITY_WATCHLIST); }, null);
          var visibilityEvents = visibilityReport && Array.isArray(visibilityReport.events) ? visibilityReport.events : [];
          if (visibilityEvents.length) {
            lastVisibilityKey = visibilityKey;
            eventVisibility = {
              sampleKey: visibilityKey,
              age: p.age || 0,
              year: p.yearsWorked || 0,
              unitId: unitId,
              unitLevel: unitLevel,
              scenarioId: gameState.scenarioId || 'classic',
              strategyKey: strategyKey,
              strategy: { background: strategy.background || '', major: strategy.major || '', talents: strategy.talents || [] },
              events: visibilityEvents.slice(0, 8).map(function(row) {
                var share = Number(row && row.eligibleShare);
                if (!isFinite(share)) share = Number(row && row.weight && row.weight.share);
                return {
                  id: row && row.id || '',
                  status: row && row.status || 'ineligible',
                  reasonCodes: Array.isArray(row && row.reasonCodes) ? row.reasonCodes.slice(0, 8) : [],
                  share: isFinite(share) ? Math.max(0, Math.min(1, share)) : 0
                };
              })
            };
          }
        }
      }
      var flags = p.flags ? Object.keys(p.flags).filter(function(k) { return p.flags[k]; }) : [];
      // 人脉只上报匿名数值指标，不上传联系人姓名、关系文本或关系边。
      var networkState = p.network && typeof p.network === 'object' ? p.network : {};
      var networkMetrics = networkState.metrics && typeof networkState.metrics === 'object' ? networkState.metrics : {};
      var networkActions = networkState.actions && typeof networkState.actions === 'object' ? networkState.actions : {};
      var networkContacts = Array.isArray(p.contacts) ? p.contacts : [];
      var networkEventVisits = Object.keys(eventCounts).reduce(function(sum, id) {
        return sum + (/^net[A-Za-z0-9_.:-]{1,76}$/.test(id) ? Number(eventCounts[id]) || 0 : 0);
      }, 0);
      var network = {
        contacts: Math.min(10, networkContacts.length),
        active: networkContacts.filter(function(c) { return c && !c.enemy && c.status === 'active'; }).length,
        remote: networkContacts.filter(function(c) { return c && (c.region === 'remote' || c.status === 'remote'); }).length,
        rivals: networkContacts.filter(function(c) { return c && (c.enemy || c.status === 'rival'); }).length,
        diversity: Math.max(0, Math.min(1, Number(networkMetrics.diversity) || 0)),
        bridgeCoverage: Math.max(0, Math.min(1, Number(networkMetrics.bridgeCoverage) || 0)),
        support: Math.max(0, Math.min(1, Number(networkMetrics.support) || 0)),
        conflictExposure: Math.max(0, Math.min(1, Number(networkMetrics.conflictExposure) || 0)),
        connectionUsed: !!networkActions.connectionUsed,
        stewardshipUsed: !!networkActions.stewardshipUsed,
        networkEventVisits: Math.min(100000, networkEventVisits)
      };

      // App 层扩展数据
      var appData = {};
      if (typeof App !== 'undefined' && App) {
        var st = safe(function() { return App.stats || {}; }, {});
        appData = {
          achievements: safe(function() { return App.achievements || []; }, []),
          stats: st,
          statsDetail: {
            plays: st.plays || 0,
            passes: st.passes || 0,
            bestScore: st.bestScore || 0,
            totalYears: st.totalYears || 0,
            totalPromos: st.totalPromos || 0,
            endings: st.endings || {}
          },
          codex: safe(function() { return App.codex || {}; }, {}),
          historyCount: safe(function() { return (App.gameHistory || []).length; }, 0),
          codexProgress: safe(function() { return App.getCodexProgress ? App.getCodexProgress() : null; }, null),
          codexReward: safe(function() { return App.getCodexReward ? App.getCodexReward() : null; }, null),
          slots: safe(function() {
            var arr = [];
            for (var i = 0; i < 3; i++) {
              var si = engine.getSaveInfo ? engine.getSaveInfo(i) : null;
              arr.push(si ? { slot: i, name: si.name || '', age: si.age || 0, phase: si.phase || '', years: si.years || 0, time: si.time || 0 } : null);
            }
            return arr;
          }, [])
        };
      }

      return {
        playerId: playerId,
        runId: gameState.runId || '',
        scenarioId: gameState.scenarioId || '',
        playerName: p.name || '未知',
        gender: p.gender || '',
        age: p.age || 0,
        rank: p.leadershipRank || 0,
        unit: p.unit ? p.unit.name : (p.isEmployed ? '已入职' : '备考中'),
        unitLevel: p.unit ? p.unit.level : '',
        phase: typeof engine.getPhase === 'function' ? engine.getPhase() : '',
        ending: p.ending || null,
        promotions: p.promotions || 0,
        unitUpgrades: p.unitUpgrades || 0,
        yearsWorked: p.yearsWorked || 0,
        reputation: p.reputation || 50,
        heat: p.heat || 0,
        isMarried: !!p.isMarried,
        hasChildren: !!p.hasChildren,
        wealth: p.wealth || 0,
        personality: p.personality || null,
        ambition: p.ambition || null,
        chronicIllness: !!(p.flags && p.flags.chronicIllness),
        grassroots: !!(p.flags && (p.flags.grassrootsActive || p.flags.grassrootsDone)),
        attrs: { iq: a.iq||0, eq: a.eq||0, luck: a.luck||0, family: a.family||0, appearance: a.appearance||0, body: a.body||0 },
        hidden: {
          workAbility: h.workAbility||0, mentalPressure: h.mentalPressure||0,
          risk: h.risk||0, integrity: h.integrity||0, background: h.background||0,
          desire: h.desire||0, familyPressure: h.familyPressure||0, positionWeight: h.positionWeight||0
        },
        lastEvent: lastEntry ? lastEntry.event : '',
        careerLog: lastLogCache,
        flags: flags,
        seenCount: (p.seenEvents || []).length,
        passed: !!p.passed,
        runActive: runActive,
        eventCounts: eventCounts,
        eventLabels: eventLabels,
        eventCatalog: !catalogReported && catalog.length ? catalog : undefined,
        eventVisibility: eventVisibility,
        network: network,
        strategy: strategy,
        app: appData
      };
    } catch(e) { return null; }
  }

  function report() {
    if (paused || inflight) return; // v2.16: 暂停/在途不重复上报
    var state = collectState();
    if (!state) return;
    var json = JSON.stringify(state);
    if (json === lastReport) return;
    try {
      inflight = true;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-Player-Id', playerId);
      xhr.onload = function() {
        inflight = false;
        if (xhr.status >= 200 && xhr.status < 300) {
          lastReport = json;
          if (state.eventCatalog && state.eventCatalog.length) catalogReported = true;
          if (state.strategy && state.strategy.labels && Object.keys(state.strategy.labels).length) strategyLabelsSent = true;
        }
      };
      xhr.onerror = xhr.ontimeout = function() { inflight = false; };
      xhr.send(json);
    } catch(e) { inflight = false; }
  }

  // v2.16: 页面关闭瞬间用 sendBeacon 上报最后状态（不丢最后一刻）
  function reportBeacon() {
    if (paused) return;
    var state = collectState();
    if (!state) return;
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(apiUrl, new Blob([JSON.stringify(state)], { type: 'application/json' }));
        if (state.eventCatalog && state.eventCatalog.length) catalogReported = true;
        if (state.strategy && state.strategy.labels && Object.keys(state.strategy.labels).length) strategyLabelsSent = true;
      }
    } catch(e) {}
  }

  function start() {
    if (typeof engine !== 'undefined' && engine && engine.getPlayer) {
      report();
      if (timer) clearInterval(timer);
      timer = setInterval(report, REPORT_INTERVAL);
    } else {
      setTimeout(start, 500);
    }
  }

  // v2.16: 后台标签页暂停上报，回到前台立即补报
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { paused = true; }
    else { paused = false; report(); }
  });
  window.addEventListener('pagehide', reportBeacon);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
