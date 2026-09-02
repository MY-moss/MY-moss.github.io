var App = {
  currentPage: 'game',
  isProcessing: false,
  gameHistory: (() => { try { return JSON.parse(localStorage.getItem('gameHistory') || '[]'); } catch(e) { return []; } })(),
  achievements: (() => { try { const arr = JSON.parse(localStorage.getItem('gameAchievements') || '[]'); const ids = new Set(); return arr.filter(a => a && a.id && !ids.has(a.id) && ids.add(a.id)); } catch(e) { return []; } })(),
  stats: (() => { try { const s = JSON.parse(localStorage.getItem('gameStats') || 'null'); if (!s) throw 'empty'; s.plays = s.plays || 0; s.passes = s.passes || 0; s.bestScore = s.bestScore || 0; s.totalYears = s.totalYears || 0; s.totalPromos = s.totalPromos || 0; s.endings = s.endings || {}; return s; } catch(e) { return {plays:0,passes:0,bestScore:0,totalYears:0,totalPromos:0,endings:{}}; } })(),
  codex: (() => { try { return JSON.parse(localStorage.getItem('gameCodex') || '{"events":{},"flags":{},"endings":{}}'); } catch(e) { return {events:{},flags:{},endings:{}}; } })(),
  // v2.1.49 M5.3 跨周目挑战（app-challenges.js 评估推进，云同步随全局数据）
  challenges: (() => { try { return JSON.parse(localStorage.getItem('gameChallenges') || 'null') || {}; } catch(e) { return {}; } })()
};
