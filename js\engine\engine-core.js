// engine-core.js
class GameEngine {
  constructor() { this.scoreCalculated = false; this.isProcessing = false; this.lastPersistenceError = null; this.lastPersistenceAt = 0; this.reset(); }
  reset() {
    this._codexEventCache = null;
    this.scoreCalculated = false;
    this.state = {
      phase: 'intro',
      runId: 'run_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10), // 区分同一匿名玩家的不同人生局
      scenarioId: 'classic', // 剧本包标识；经典模式保持现有玩法
      scenarioSetupApplied: false,
      era: 'stable', // v2.19 时代剧本：reform/stable/rectify（开局选择）
      player: {
        name: '', gender: '男', age: 22, background: null, major: null, talents: [], unit: null,
        unitLevel: 0, education: 'bachelor', political: 'mass', isEmployed: false,
        totalScore: 0, writtenScore: 0, interviewScore: 0, finalScore: 0,
        passingLine: 0, writtenRank: 0, signupCount: 0, passed: false,
        yearsWorked: 0, promotions: 0, missedPromotions: 0,
        leadershipRank: 0, leadershipPromotions: 0, voluntaryExit: false,
        deathReason: null, ending: null, ageOnshore: 0, careerLog: [],
        minExamAge: 22, maxExamAge: 35, unitUpgrades: 0, isMarried: false, hasChildren: false,
        examAttempts: 0, // 考试次数
        reputation: 50, // 声誉 0-100
        flags: {}, // 关键事件标记，用于连锁事件
        contacts: [], // 人际关系网 [{ id, name, relation: -100~100, position, description }]
        network: { actions: { connectionUsed: false, stewardshipUsed: false }, edges: [], log: [], metrics: { diversity: 0, bridgeCoverage: 0, support: 0, conflictExposure: 0 } }, // 分层人脉模型（旧档由 engine-network 继续迁移）
        heat: 0, // 调查热度 0-100，越高越容易被查
        seenEvents: [], // 事件图鉴收集
        eventCounts: {}, // 本局事件触发次数，用于图鉴频率与运营平衡分析
        personality: null, // 性格底色: stable/ambitious/smooth/straight
        wealth: 0, // 兼容净值（现金-负债），财务主表见 finance
        finance: { cash: 0, debts: [] }, // 财务双表：现金 + 负债表 [{type, principal, rate, since}]
        ambition: null, // 个人志向: minister(当处长)/central(进中央)/retire(安稳退休)
        actionPoints: 3, maxActionPoints: 3, // 年度筹划回合：精力点（可自由动作的统一预算，见 engine-planning.js）
      },
      attrs: { iq: 0, eq: 0, luck: 0, family: 0, appearance: 0, body: 0 },
      hidden: { desire: 0, familyPressure: 0, integrity: 20, risk: 0, background: 0, workAbility: 0, positionWeight: 0, mentalPressure: 0 },
      talentPoints: 4, attrPoints: 10,
      examQuestions: [], currentQuestion: 0, currentEvent: null, year: 1,
      writtenQuestionsCache: [],
      difficulty: 'standard',
      // 随机选择用
      randomMajors: [],
      randomTalents: [],
      pendingPromotion: null, // { type, levels, source }
      pendingTransfer: null,  // { type: 'lateral'|'demotion', targetUnit, reason }
      policyProject: null,    // { id, stage, startedYear, progress, opinionCrises }
    };
  }
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  randf() { return Math.random(); }
  shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = this.rand(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  weightedPick(items, k = 'weight') { const t = items.reduce((s, i) => s + (i[k] || 1), 0); let r = this.randf() * t; for (const i of items) { r -= (i[k] || 1); if (r <= 0) return i; } return items[0]; }
  setDifficulty(d) { this.state.difficulty = d; }
  setScenario(id) {
    const scenarios = (GameData && GameData.scenarios) || {};
    if (!scenarios[id]) return false;
    this.state.scenarioId = id;
    const scenario = scenarios[id];
    if (scenario.setup && scenario.setup.difficulty) this.state.difficulty = scenario.setup.difficulty;
    if (scenario.preferredEra) this.state.era = scenario.preferredEra;
    return true;
  }
  getScenario() {
    return (((GameData && GameData.scenarios) || {})[this.state.scenarioId] || null);
  }
  getScenarioProgress() {
    const scenario = this.getScenario();
    if (!scenario || !scenario.goal) return null;
    const p = this.state.player || {};
    const flags = p.flags || {};
    const steps = Array.isArray(scenario.goal.steps) ? scenario.goal.steps.map(step => {
      const ids = Array.isArray(step.ids) ? step.ids : (step.id ? [step.id] : []);
      return {
        label: step.label || '完成关键选择',
        done: ids.some(id => !!flags[id])
      };
    }) : [];
    const endings = Array.isArray(scenario.goal.endings) ? scenario.goal.endings : [];
    const endingDone = !!p.ending && endings.includes(p.ending);
    const stepsDone = steps.length > 0 && steps.every(step => step.done);
    return {
      scenarioId: scenario.id,
      name: scenario.name,
      title: scenario.goal.title || '剧本目标',
      desc: scenario.goal.desc || '',
      steps: steps,
      endingDone: endingDone,
      completed: endingDone || stepsDone
    };
  }
  applyScenarioSetup() {
    if (this.state.scenarioSetupApplied) return false;
    const scenario = this.getScenario();
    if (!scenario || !scenario.setup) { this.state.scenarioSetupApplied = true; return false; }
    const setup = scenario.setup;
    const p = this.state.player;
    if (typeof setup.age === 'number') p.age = setup.age;
    if (typeof setup.maxExamAge === 'number') p.maxExamAge = setup.maxExamAge;
    if (setup.difficulty) this.state.difficulty = setup.difficulty;
    if (setup.era) this.state.era = setup.era;
    Object.entries(setup.player || {}).forEach(([key, value]) => { p[key] = value; });
    Object.entries(setup.attrs || {}).forEach(([key, value]) => {
      if (key in this.state.attrs && typeof value === 'number') this.state.attrs[key] += value;
    });
    Object.entries(setup.hidden || {}).forEach(([key, value]) => {
      if (key in this.state.hidden && typeof value === 'number') this.state.hidden[key] += value;
      else if (key in this.state.attrs && typeof value === 'number') this.state.attrs[key] += value;
    });
    this.state.scenarioSetupApplied = true;
    return true;
  }
  // v2.19 时代剧本：开局选择时代（reform/stable/rectify）
  setEra(eraId) {
    if (GameData.eras && GameData.eras[eraId]) {
      this.state.era = eraId;
      const era = GameData.eras[eraId];
      this.state.player.careerLog.push({ year: this.state.player.age, event: `${era.icon} 你出生在${era.name}——${era.desc.split('。')[0]}。` });
      return true;
    }
    return false;
  }
  getEra() { return (GameData.eras && GameData.eras[this.state.era]) || null; }
  setName(name) { this.state.player.name = name; }
  setGender(gender) { this.state.player.gender = gender; }
  setPersonality(pp) { this.state.player.personality = pp; }
  setAmbition(a) { this.state.player.ambition = a; }
  checkAmbition() {
    const p = this.state.player; if (!p.ambition) return null;
    if (p.ambition === 'minister') return p.leadershipRank >= 6 ? 'achieved' : 'failed';
    if (p.ambition === 'central') return (p.unitLevel === 4 && p.leadershipRank >= 9) ? 'achieved' : 'failed'; // v2.1.6 对齐中央结局门槛：调入中央机关（调任即 rank>=9+unitLevel4）即达成——原要求 rank>=11 比结局苛刻两级，走完中央线的玩家结局 central 但志向必失败
    if (p.ambition === 'retire') return (p.ending === 'safe' || p.ending === 'ordinary') ? 'achieved' : 'failed';
    // v2.49e 清廉志向「两袖清风」：一生清廉，名垂青史
    // 达成 = 道德结局（清廉丰碑/清官/时代清流）或清廉属性达标（integrity≥70、risk<25、无腐败flag、深耕15年以上）
    // 放宽原因：道德结局需拒贿链等事件链门槛（达成率仅 21%），属性判定让认真清廉的玩家多数能达成（目标 40-60%）
    if (p.ambition === 'upright') {
      if (p.ending === 'clean' || p.ending === 'honest_official' || p.ending === 'era_rectify') return 'achieved';
      const h = this.getHidden();
      if (h.integrity >= 75 && h.risk < 20 && !this.hasCorruptFlag(p.flags) && p.yearsWorked >= 20) return 'achieved';
      return 'failed';
    }
    return null;
  }
  rollBackground() {
    const bgs = GameData.backgrounds;
    // 稀有出身保底：连续 15 局未抽到富裕/权贵，下一局强制从稀有池抽取（跨局计数存 localStorage）
    // 解决低概率出身（权贵 2.2%）玩家几乎无法体验到的问题
    let pity = 0;
    try { pity = parseInt(localStorage.getItem('shangan_bg_pity') || '0', 10) || 0; } catch(e) {}
    const rareIds = ['wealthy', 'elite'];
    let bg = null;
    if (pity >= 15) {
      const rarePool = bgs.filter(b => rareIds.includes(b.id));
      if (rarePool.length > 0) bg = this.weightedPick(rarePool);
    }
    if (!bg) bg = this.weightedPick(bgs);
    // 更新保底计数：抽到稀有则清零，否则 +1
    if (rareIds.includes(bg.id)) pity = 0;
    else pity++;
    try { localStorage.setItem('shangan_bg_pity', String(pity)); } catch(e) {}
    this.state.player.background = bg;
    for (const [key, val] of Object.entries(bg.effects)) {
      if (key in this.state.attrs) this.state.attrs[key] += val;
      if (key in this.state.hidden) this.state.hidden[key] += val;
    }
    return bg;
  }
  rollMajors() {
    const majors = this.shuffle([...GameData.majors]).slice(0, 4);
    this.state.randomMajors = majors;
    return majors;
  }
  // 是否已腐败（任一腐败 flag）——热度衰减/对抗加权/泥足深陷共用
  // v2.49：补入 procurementFraud（采购舞弊）/assetTransfer（转移资产）/scapegoat（推责下属）——此前遗漏致腐败后果链断裂（不做泥足深陷加权、风险衰减不减半、仍可拿清廉结局）
  hasCorruptFlag(flags) {
    return ['tookBribe','tookKickback','tookShares','tookFraud','embezzled','nepotism','nepotismHire','withheldFunds','destroyedEvidence','falsifiedRecords','retaliated','coveredUp','bg_tempt_1','bg_tempt_2','embezzle','procurementFraud','assetTransfer','scapegoat','bossKickback','exBossTempt'].some(fl => flags && flags[fl]); // v2.1.6 补入 exBossTempt（e686 收介绍费=实打实腐败留痕，此前诱惑无后果）
  }
  setMajor(majorId) {
    const major = this.state.randomMajors.find(m => m.id === majorId) || GameData.majors.find(m => m.id === majorId);
    if (major) { this.state.player.major = major; this.state.hidden.background += major.jobBias.length; }
  }
  // 专业×单位匹配度：jobBias关键词命中单位名称/系统类型/标签的数量（词根归一化后）
  // 归一化：去掉 省市县区 前缀与 局/厅/委/办/部/所/中心 等后缀（保留 乡镇/街道 前缀，否则"乡镇机关"永远匹配不上）
  getMajorFit(unit) {
    const major = this.state.player.major;
    if (!major || !unit) return { matchCount: 0, scarcity: major ? (major.scarcity || 1) : 1 };
    const norm = (s) => String(s).toLowerCase()
      .replace(/^(省|市|县|区)/, '')
      .replace(/(局|厅|委|办|部|所|中心|委员会|监督管理|机关)+$/, '');
    const nameN = norm(unit.name);
    const sysN = norm(unit.system);
    const matchCount = major.jobBias.filter(bias => {
      const b = norm(bias);
      if (!b) return false;
      return (nameN && nameN.includes(b)) || (sysN && sysN.includes(b)) || (unit.tags || []).some(tag => tag.includes(b) || b.includes(tag));
    }).length;
    return { matchCount, scarcity: major.scarcity || 1 };
  }
  rollTalents() {
    const diff = this.state.difficulty;
    // 按难度调整稀有度权重
    const rarityWeights = { 'speedrun': { UR: 3, SSR: 4, SR: 3, R: 2 }, 'easy': { UR: 2, SSR: 3, SR: 4, R: 3 }, 'standard': { UR: 1, SSR: 2, SR: 4, R: 5 } };
    const weights = rarityWeights[diff] || rarityWeights.standard;
    const pool = [];
    for (const t of GameData.talents) {
      const w = weights[t.rarity] || 1;
      for (let i = 0; i < w; i++) pool.push(t);
    }
    const selected = [];
    const seen = new Set();
    // 保证至少1个UR/SSR
    const highRarity = this.shuffle(GameData.talents.filter(t => t.rarity === 'UR' || t.rarity === 'SSR'));
    if (highRarity.length > 0) { selected.push(highRarity[0]); seen.add(highRarity[0].id); }
    // 填充剩余7个
    const shuffled = this.shuffle(pool.filter(t => !seen.has(t.id)));
    for (const t of shuffled) {
      if (selected.length >= 8) break;
      if (!seen.has(t.id)) { selected.push(t); seen.add(t.id); }
    }
    this.state.randomTalents = this.shuffle(selected);
    return this.state.randomTalents;
  }
  addTalent(talentId) {
    if (this.state.talentPoints <= 0) return false;
    const talent = this.state.randomTalents.find(t => t.id === talentId) || GameData.talents.find(t => t.id === talentId);
    if (!talent || this.state.player.talents.includes(talentId)) return false;
    if (talent.exclusive && talent.exclusive.length > 0) {
      for (const existing of this.state.player.talents) {
        const et = GameData.talents.find(t => t.id === existing);
        if (et && et.exclusive && et.exclusive.length > 0) {
          if (talent.exclusive.filter(e => et.exclusive.includes(e)).length > 0) return false;
        }
      }
    }
    this.state.player.talents.push(talentId);
    this.state.talentPoints--;
    this.applyTalentEffects(talent);
    this.calculateAge();
    return true;
  }
  removeTalent(talentId) {
    const idx = this.state.player.talents.indexOf(talentId);
    if (idx === -1) return false;
    this.state.player.talents.splice(idx, 1);
    this.state.talentPoints++;
    const talent = GameData.talents.find(t => t.id === talentId);
    if (talent) this.applyTalentEffects(talent, true);
    this.calculateAge();
    return true;
  }
  applyTalentEffects(talent, reverse = false) {
    const mult = reverse ? -1 : 1;
    for (const [key, val] of Object.entries(talent.effects)) {
      if (key === 'education') { this.state.player.education = reverse ? 'bachelor' : val; continue; }
      if (key === 'political') { this.state.player.political = reverse ? 'mass' : val; continue; }
      if (key === 'minExamAge' || key === 'minExamAgeAdd' || key === 'maxExamAge') continue;
      if (key === 'wealth') { if (mult > 0) this.cashIn(val); else this.cashOut(val); continue; }
      // v2.59 修复：reputation 在 attrs/hidden 之外（player 上），原被静默忽略——「气运之子 声誉+5」「绿植养护员 声誉+2」死效果
      if (key === 'reputation') { this.state.player.reputation = this.clampStat('reputation', (this.state.player.reputation || 50) + val * mult); continue; }
      if (key in this.state.attrs) this.state.attrs[key] += val * mult;
      if (key in this.state.hidden) this.state.hidden[key] += val * mult;
    }
    // 天赋：云中贵人（cloud_connections）——获得贵人联系人（开局人脉）
    if (talent.id === 'cloud_connections' && !reverse && !this.state.player.contacts.some(c => c.id === 'noble')) {
      this.addContact({ id: 'noble', name: '周主任', relation: 30, position: '省里退下来的老领导', description: '云中贵人，人脉极广，对你青眼有加' });
    }
  }
  calculateAge() {
    const p = this.state.player; let minAge = 22, maxAge = 35;
    // 先取绝对下限（如少年班 18 岁）
    for (const tid of p.talents) {
      const t = GameData.talents.find(t => t.id === tid);
      if (!t) continue;
      if (t.effects.minExamAge !== undefined) minAge = Math.min(minAge, t.effects.minExamAge);
      if (t.effects.maxExamAge !== undefined) maxAge = Math.max(maxAge, t.effects.maxExamAge); // v2.16 修复：天赋 maxExamAge 是放宽上限（如读博 40 岁仍可考），取 max 才生效
    }
    // 再叠加读研/读博等延迟年限（少年班+研究生 → 18+3=21，不再被覆盖回退）
    for (const tid of p.talents) {
      const t = GameData.talents.find(t => t.id === tid);
      if (t && t.effects.minExamAgeAdd) minAge += t.effects.minExamAgeAdd;
    }
    p.minExamAge = minAge; p.maxExamAge = maxAge;
    p.age = minAge;
  }
  // ===== 财务双表（现金 finance.cash + 负债 finance.debts）=====
  // v2.15.1：online 高利贷利率 20%→15%，缓解永续负债死循环（利息<强制还本比例时债务才可能下降）
  debtRate(type) { return type === 'online' ? 0.12 : type === 'personal' ? 0.1 : 0.05; } // v2.1.6 高利贷 15%→12%：被动玩家 15% 利息恒大于强制还本导致债务只增不减（批量模拟清零率 0%）
  // 旧档迁移：wealth>=0 全部为现金；wealth<0 按历史借贷标记分型转负债
  initFinance() {
    const p = this.state.player;
    if (p.finance && typeof p.finance.cash === 'number' && Array.isArray(p.finance.debts)) { this.syncWealth(); return; }
    const w = p.wealth || 0;
    if (w >= 0) { p.finance = { cash: w, debts: [] }; }
    else {
      const type = (p.flags && p.flags.loanOnline) ? 'online' : ((p.flags && p.flags.borrowed) ? 'personal' : 'other');
      // v2.15.1：wealth为负时 principal 必须取绝对值（债务是正数，原代码传入负值导致 debtTotal() 返回负数）
      p.finance = { cash: 0, debts: [{ type, principal: -w, rate: this.debtRate(type), since: this.state.year || 1 }] };
    }
    this.syncWealth();
  }
  syncWealth() { const f = this.state.player.finance; this.state.player.wealth = f.cash - this.debtTotal(); }
  debtTotal() { return (this.state.player.finance.debts || []).reduce((s, d) => s + d.principal, 0); }
  debtTypeTotal(type) { return (this.state.player.finance.debts || []).filter(d => d.type === type).reduce((s, d) => s + d.principal, 0); }
  addDebt(type, amount) {
    if (!amount || amount <= 0) return;
    const f = this.state.player.finance;
    const same = f.debts.find(d => d.type === type);
    if (same) same.principal += amount;
    else f.debts.push({ type, principal: amount, rate: this.debtRate(type), since: this.state.year || 1 });
    this.syncWealth();
  }
  // 还本：利率从高到低优先偿还；本金从现金扣除（现金不足则只还能还的）
  payDebt(amount) {
    const f = this.state.player.finance;
    let rem = Math.min(Math.max(0, Math.floor(amount)), f.cash); let paid = 0;
    const sorted = f.debts.slice().sort((a, b) => b.rate - a.rate);
    for (const d of sorted) {
      if (rem <= 0) break;
      const pay = Math.min(d.principal, rem);
      d.principal -= pay; rem -= pay; paid += pay;
    }
    f.cash -= paid;
    f.debts = f.debts.filter(d => d.principal > 0.5);
    this.syncWealth();
    return paid;
  }
  // v2.1.5 H1 出坑通道：强制还本直接减本金（不扣现金——还本来自工资结余的"省吃俭用+外快"，避免还本抽干现金导致利息滚入本金的死亡螺旋）
  payDebtDirect(amount) {
    const f = this.state.player.finance;
    let rem = Math.max(0, Math.floor(amount)); let paid = 0;
    const sorted = f.debts.slice().sort((a, b) => b.rate - a.rate);
    for (const d of sorted) {
      if (rem <= 0) break;
      const pay = Math.min(d.principal, rem);
      d.principal -= pay; rem -= pay; paid += pay;
    }
    f.debts = f.debts.filter(d => d.principal > 0.5);
    this.syncWealth();
    return paid;
  }
  cashIn(amount) { if (!this.state.player.finance) this.initFinance(); const f = this.state.player.finance; f.cash += Math.max(0, Math.floor(amount)); this.syncWealth(); }
  // 现金支出：现金不足差额自动转高利贷负债（该负债多少就负债多少）
  cashOut(amount) { if (!this.state.player.finance) this.initFinance();
    const amt = Math.max(0, Math.floor(amount));
    const f = this.state.player.finance;
    const out = Math.min(f.cash, amt);
    f.cash -= out;
    if (amt > out) {
      if (!this.state.player.flags) this.state.player.flags = {};
      this.state.player.flags.loanOnline = true; // v2.59 催收链接通：现金不足自动转高利贷时设 loanOnline flag（e746 债务危机事件原永不触发）
      this.addDebt('online', amt - out);
    } else this.syncWealth();
    return out;
  }
  // 是否处于负债状态
  inDebt() { return this.debtTotal() > 0.5; }
  // 借贷债务清偿（v2.13）：现金支付抵扣，现金不足部分豁免（如家人/组织帮还清），不凭空造钱
  // v2.44 豁免代价：未全额清偿靠人情/组织兜底，信誉受损并留档（真实感）
  settleBorrowDebt() {
    const f = this.state.player.finance;
    const total = this.debtTypeTotal('personal') + this.debtTypeTotal('online');
    if (total <= 0) return;
    const paid = Math.min(f.cash, total);
    f.cash -= paid;
    const shortfall = Math.round(total - paid);
    f.debts = f.debts.filter(d => d.type !== 'personal' && d.type !== 'online');
    this.syncWealth();
    if (shortfall > 0) {
      this.state.player.reputation = Math.max(0, (this.state.player.reputation || 50) - 2);
      this.state.player.careerLog.push({ year: this.state.player.age, event: `⚠️ 负债 ${total} 只还上 ${paid}，剩余 ${shortfall} 靠人情/组织兜底——信誉受损` });
    }
  }
  // v2.15.1：债务豁免（家人/组织帮还，不扣现金，从利率最高的债务开始抵扣）
  payDebtByForgive(amount) {
    const f = this.state.player.finance;
    let rem = Math.max(0, Math.floor(amount));
    const sorted = f.debts.slice().sort((a, b) => b.rate - a.rate);
    for (const d of sorted) {
      if (rem <= 0) break;
      const pay = Math.min(d.principal, rem);
      d.principal -= pay; rem -= pay;
    }
    f.debts = f.debts.filter(d => d.principal > 0.5);
    this.syncWealth();
  }
  addAttr(attr) { if (this.state.attrPoints <= 0) return false; if (!(attr in this.state.attrs)) return false; this.state.attrs[attr]++; this.state.attrPoints--; return true; }
  removeAttr(attr) { if (this.state.attrs[attr] <= -5) return false; this.state.attrs[attr]--; this.state.attrPoints++; return true; }
  setUnit(unitId) {
    const unit = GameData.units.find(u => u.id === unitId);
    if (unit) {
      if (typeof this.setPosting === 'function') this.setPosting(unit, '单位分配');
      else { this.state.player.unit = unit; this.state.player.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[unit.level] || 0; }
    }
  }
  getUnitLevelLabel(l) { return ['乡镇/街道', '县级', '市级', '省级', '中央'][Math.min(4, Math.max(0, l))]; }
  rollUnits() {
    const byLevel = { easy: [], medium: [], hard: [] };
    for (const u of GameData.units) {
      if (u.noExam) continue; // 中央等单位不可报考
      if (u.difficulty < 65) byLevel.easy.push(u);
      else if (u.difficulty < 80) byLevel.medium.push(u);
      else byLevel.hard.push(u);
    }
    const result = {};
    result.easy = this.shuffle(byLevel.easy).slice(0, 3);
    result.medium = this.shuffle(byLevel.medium).slice(0, 2);
    result.hard = this.shuffle(byLevel.hard).slice(0, 1);
    this.state.randomUnits = result;
    return result;
  }
  getPhase() { return this.state.phase; }
  setPhase(phase) { this.state.phase = phase; }
  getState() { return this.state; }
  getPlayer() { return this.state.player; }
  getAttrs() { return this.state.attrs; }
  getHidden() { return this.state.hidden; }
  getSaveKey(slot) { return 'shangan_save' + (slot > 0 ? '_' + slot : ''); }
  getSaveTimeKey(slot) { return 'shangan_save_time' + (slot > 0 ? '_' + slot : ''); }
  saveState(slot) {
    try {
      const s2 = (slot !== undefined && slot !== null) ? slot : (this.currentSaveSlot || 0);
      const state = { ...this.state, currentEvent: null }; // v2.59 性能：去掉双重序列化（原 JSON.parse(JSON.stringify()) 深拷贝后再 stringify）
      localStorage.setItem(this.getSaveKey(s2), JSON.stringify(state));
      localStorage.setItem(this.getSaveTimeKey(s2), Date.now().toString());
      this.lastPersistenceError = null;
      this.lastPersistenceAt = Date.now();
      return true;
    } catch(e) {
      // 保留 boolean 兼容返回值，同时给 UI/诊断提供稳定、非敏感的失败原因。
      this.lastPersistenceError = {
        code: e && (e.name === 'QuotaExceededError' || e.code === 22) ? 'STORAGE_QUOTA' : 'STORAGE_UNAVAILABLE',
        message: e && e.message ? String(e.message).slice(0, 160) : '本地存储不可用',
        at: Date.now()
      };
      return false;
    }
  }
  getPersistenceStatus() {
    return {
      ok: !this.lastPersistenceError,
      savedAt: this.lastPersistenceAt || 0,
      error: this.lastPersistenceError ? { ...this.lastPersistenceError } : null,
      origin: (typeof location !== 'undefined' && location.origin) ? location.origin : 'unknown'
    };
  }
  loadState(slot) {
    try {
      const s2 = (slot !== undefined && slot !== null) ? slot : (this.currentSaveSlot || 0);
      this.currentSaveSlot = s2;
      const saved = localStorage.getItem(this.getSaveKey(s2));
      if (!saved) return false;
      this.state = JSON.parse(saved);
      // v2.16 修复：与 importSave 共用字段补齐/迁移，旧版存档（无 finance/contacts/reputation 等）不再崩溃
      if (!this.migrateState(this.state)) return false;
      this._codexEventCache = null;
      this.initFinance();
      this.scoreCalculated = false;
      this.isProcessing = false;
      return true;
    } catch(e) { return false; }
  }
  // 旧档字段补齐与迁移（loadState/importSave 共用）
  migrateState(st) {
    if (!st || !st.player) return false;
    const p = st.player;
    p.wealth = p.wealth || 0;
    p.heat = p.heat || 0;
    p.seenEvents = p.seenEvents || [];
    p.contacts = p.contacts || [];
    p.network = (p.network && typeof p.network === 'object') ? p.network : { actions: { connectionUsed: false, stewardshipUsed: false }, edges: [], log: [], metrics: { diversity: 0, bridgeCoverage: 0, support: 0, conflictExposure: 0 } };
    // v2.59 旧档联系人地域兜底：无 region/homeTier 的旧联系人按当前层级重算（原缺失 → 全部被 updateContactRegions 判为 remote，求助全禁且保存后不可逆）
    p.contacts.forEach(c => {
      if (c && typeof c.region !== 'string') {
        c.region = 'current';
        c.homeTier = (typeof c.homeTier === 'number') ? c.homeTier : (p.unitLevel || 1);
        if (c.id === 'noble') { c.fixedTier = 3; }
        else if (c.id === 'elder') { c.fixedTier = 1; }
        else if (c.id === 'hometown') { c.fixedTier = 0; }
        else if (c.id === 'mentor' || c.id === 'classmate') { c.fixedTier = -1; }
        if (c.fixedTier !== undefined) c.region = (c.fixedTier === c.homeTier) ? 'current' : 'remote';
      }
    });
    p.flags = p.flags || {};
    // v2.1.2 修复：旧档属性点永久失效（attrPoints 仅默认 state 初始化，loadState 整体覆盖后 undefined → addAttr 恒 false）
    if (typeof st.attrPoints !== 'number') st.attrPoints = 10;
    if (typeof p.rankTrack !== 'number') p.rankTrack = 0; // v2.1.2 职级并行字段兜底
    // v2.1.2 修复：v2.64 前旧档 flag 无 _since → 延迟链 `p.age < since + delay` 中 since=undefined → NaN 比较 → 链永不触发
    // 对既有链 flag 补 _since = 当前年龄，解锁延迟链（如 faction_lean/mortgage/whistleblower/healthRisk 等）
    const _chainFlags = ['mbaApply', 'mbaActive', 'mbaDegree', 'healthRisk', 'healthCare', 'healthTreated', 'underInvestigation', 'appliedParty', 'proj_step1', 'proj_step2', 'proj_step3', 'proj_done', 'whistleblower', 'defied', 'selfSurrender', 'faction_lean', 'faction_steadfast', 'mortgage', 'drinkDrive', 'dating',
      // P3 剧本专属事件链根/中间 flag
      'grassrootsBreakthrough', 'grassrootsCautious', 'grassrootsStep2', 'midcareerRebuild', 'midcareerHold', 'midcareerStep2', 'cleanRecord', 'cleanCompromise', 'cleanStep2', 'networkBoundary', 'networkFavor', 'networkStep2', 'reformPilot', 'reformCautious', 'reformStep2', 'retiredMentor', 'retiredLegacy', 'retiredStep2', 'familyBalance', 'familyCareer', 'familyStep2',
      // v2.1.66 赡养链 / 理财暴雷链 / 借调链中间 flag
      'parentIllness', 'parentCaring', 'leveragedInvest', 'investCrash', 'seconded', 'secondReview'];
    for (const _cf of _chainFlags) {
      if (p.flags[_cf] && typeof p.flags[_cf + '_since'] !== 'number') p.flags[_cf + '_since'] = p.age;
    }
    p.careerLog = p.careerLog || [];
    p.eventCounts = (p.eventCounts && typeof p.eventCounts === 'object' && !Array.isArray(p.eventCounts)) ? p.eventCounts : {};
    p.talents = p.talents || [];
    p.promotions = p.promotions || 0;
    p.missedPromotions = p.missedPromotions || 0;
    p.political = p.political || 'mass';
    p.yearsWorked = p.yearsWorked || 0;
    p.age = p.age || 22;
    p.leadershipRank = p.leadershipRank || 1;
    p.reputation = p.reputation || 50;
    p.peopleReputation = p.peopleReputation || 50; // v2.21 声望双轨：民间口碑（组织印象=reputation 不动）
    // 年度筹划回合：旧档补齐精力点字段（无则按上限补满，避免所有筹划动作被误禁）
    if (typeof p.maxActionPoints !== 'number') p.maxActionPoints = (typeof this.getMaxActionPoints === 'function') ? this.getMaxActionPoints() : 3;
    if (typeof p.actionPoints !== 'number') p.actionPoints = p.maxActionPoints;
    // P2 事件密度：机会候选只保留仍存在的合法事件；使绊回应窗口校验形状（旧档/坏档置空）
    st.opportunityIds = Array.isArray(st.opportunityIds)
      ? st.opportunityIds.filter(id => typeof id === 'string' && Array.isArray(GameData.events) && GameData.events.some(e => e && e.id === id))
      : [];
    st.opportunityYear = Number.isFinite(Number(st.opportunityYear)) ? Number(st.opportunityYear) : 0;
    const _pm = st.pendingMicro;
    st.pendingMicro = (_pm && _pm.kind === 'enemy' && typeof _pm.enemyName === 'string'
      && ['risk', 'reputation', 'pressure'].includes(_pm.hit) && Number.isFinite(Number(_pm.amount)))
      ? { kind: 'enemy', enemyName: _pm.enemyName, hit: _pm.hit, amount: Number(_pm.amount), year: Number(_pm.year) || 0 }
      : null;
    p.isEmployed = p.isEmployed !== undefined ? p.isEmployed : false;
    p.isMarried = p.isMarried || false;
    p.hasChildren = p.hasChildren || false;
    p.childAge = (typeof p.childAge === 'number') ? p.childAge : (p.hasChildren ? 5 : 0); // v2.22 子女年龄跟踪（旧档有孩子默认 5 岁）
    p.childEducation = p.childEducation || 0; // v2.22 培养计数：教育投入
    p.childCompany = p.childCompany || 0;     // v2.22 培养计数：陪伴投入
    p.unit = p.unit || null;
    // 岗位对象是单位归属的事实来源；旧档曾出现 unit 已是省/市级、unitLevel 却仍为 0 的不一致，
    // 导致界面显示“乡镇/街道”、基层门槛和晋升判断都误用旧层级。能解析到单位对象时统一重算，
    // 没有单位的早期存档则保留原有数值，避免覆盖尚未分配岗位的状态。
    const unitLevelMap = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 };
    if (typeof p.unit === 'string' && Array.isArray(GameData.units)) {
      const resolvedUnit = GameData.units.find(unit => unit.id === p.unit);
      if (resolvedUnit) p.unit = resolvedUnit;
    }
    if (p.unit && typeof p.unit === 'object' && unitLevelMap[p.unit.level] !== undefined) {
      p.unitLevel = unitLevelMap[p.unit.level];
    } else if (!Number.isFinite(Number(p.unitLevel))) {
      p.unitLevel = 0;
    }
    p.unitLevel = Math.max(0, Math.min(4, Math.floor(Number(p.unitLevel) || 0)));
    p.background = p.background || null;
    p.major = p.major || null;
    // v2.1.6 旧档字段兜底补全：education/personality/ambition/examAttempts/minExamAge/maxExamAge 原未兜底——
    // 学历 undefined 致学历链失效、ambition undefined 致志向丢失、examAttempts undefined 致 calculateResult 中 NaN、
    // min/maxExamAge undefined 致 v2.58 超龄护栏（age >= undefined 恒 false）被绕过可无限重考
    p.education = p.education || 'bachelor';
    p.personality = p.personality || 'stable';
    p.ambition = p.ambition || null;
    if (typeof p.examAttempts !== 'number') p.examAttempts = 0;
    if (typeof p.minExamAge !== 'number') p.minExamAge = 22;
    if (typeof p.maxExamAge !== 'number') p.maxExamAge = 35;
    st.attrs = st.attrs || { iq: 0, eq: 0, luck: 0, family: 0, appearance: 0, body: 0 };
    st.hidden = st.hidden || { desire: 0, familyPressure: 0, integrity: 20, risk: 0, background: 0, workAbility: 0, positionWeight: 0, mentalPressure: 0 };
    st.era = (GameData.eras && GameData.eras[st.era]) ? st.era : 'stable'; // v2.19: 旧档默认平稳年代
    st.difficulty = ['speedrun', 'easy', 'standard', 'hardcore'].includes(st.difficulty) ? st.difficulty : 'standard'; // v2.58 旧档 difficulty 兜底（原缺失时 undefined，靠各处 fallback 隐式兼容）；v2.70 保留硬核模式存档
    if (typeof st.runId !== 'string' || !st.runId) st.runId = 'run_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    if (typeof st.scenarioId !== 'string' || !st.scenarioId) st.scenarioId = 'classic';
    st.scenarioSetupApplied = st.scenarioSetupApplied === true;
    // v2.1.25 项目状态迁移：校验项目引用、阶段和待决策，避免坏档永久占用项目槽位。
    if (st.policyProject && typeof st.policyProject === 'object') {
      const projectDef = Array.isArray(GameData.policyProjects) ? GameData.policyProjects.find(x => x && x.id === st.policyProject.id) : null;
      const projectStage = Number.isInteger(st.policyProject.stage) ? st.policyProject.stage : -1;
      if (!projectDef || projectStage < 0 || projectStage >= projectDef.duration) {
        st.policyProject = null;
        delete p.flags.policyProjectActive;
      } else {
        st.policyProject.stage = projectStage;
        st.policyProject.startedYear = Number.isFinite(st.policyProject.startedYear) ? st.policyProject.startedYear : (p.yearsWorked || 0);
        st.policyProject.progress = Number.isFinite(st.policyProject.progress) ? Math.max(0, Math.min(projectDef.duration, st.policyProject.progress)) : projectStage;
        st.policyProject.opinionCrises = st.policyProject.opinionCrises === 1 ? 1 : 0;
        const pd = st.policyProject.pendingDecision;
        const validStagePending = pd && pd.type === 'stage' && projectStage < projectDef.duration;
        const validOpinionPending = pd && pd.type === 'opinion' && st.policyProject.opinionCrises < 1;
        st.policyProject.pendingDecision = (validStagePending || validOpinionPending) ? { type: pd.type, stage: projectStage } : null;
        p.flags.policyProjectActive = true;
      }
    } else {
      st.policyProject = null;
      delete p.flags.policyProjectActive;
    }
    // 人脉分层迁移由可选的 engine-network 提供；旧测试/旧入口未加载该模块时也保持可运行。
    if (typeof this.ensureNetworkState === 'function') this.ensureNetworkState();
    st.currentEvent = null;
    return true;
  }
  // 存档导出：当前存档转 Base64 字符串（跨设备备份）
  exportSave(slot) {
    try {
      const s2 = (slot !== undefined && slot !== null) ? slot : (this.currentSaveSlot || 0);
      const saved = localStorage.getItem(this.getSaveKey(s2));
      if (!saved) return null;
      const time = localStorage.getItem(this.getSaveTimeKey(s2)) || '0';
      const payload = JSON.stringify({ v: 2, time: parseInt(time, 10), slot: s2, state: JSON.parse(saved) });
      return btoa(unescape(encodeURIComponent(payload)));
    } catch(e) { return null; }
  }
  // 存档导入：从 Base64 还原存档（含版本迁移）
  importSave(b64, slot) {
    try {
      if (!b64 || typeof b64 !== 'string') return { ok: false, msg: '无效的存档数据' };
      const payload = JSON.parse(decodeURIComponent(escape(atob(b64.trim()))));
      if (!payload || !payload.state) return { ok: false, msg: '存档格式不正确' };
      // 版本迁移
      let st = payload.state;
      if (payload.v === 1 || !st.player) st = st; // v1 结构兼容
      if (!st.player) return { ok: false, msg: '存档缺少玩家数据' };
      // 补齐缺失字段（防旧档崩溃）——与 loadState 共用 migrateState
      if (!this.migrateState(st)) return { ok: false, msg: '存档缺少玩家数据' };
      const s2 = (slot !== undefined && slot !== null) ? slot : 0;
      this.currentSaveSlot = s2;
      localStorage.setItem(this.getSaveKey(s2), JSON.stringify(st));
      localStorage.setItem(this.getSaveTimeKey(s2), String(payload.time || Date.now()));
      this.state = st;
      this._codexEventCache = null;
      this.scoreCalculated = false;
      this.isProcessing = false;
      this.initFinance(); // 旧档迁移：拆分现金/负债双表
      return { ok: true, msg: '存档导入成功' };
    } catch(e) { return { ok: false, msg: '导入失败: ' + e.message }; }
  }
  deleteSave(slot) {
    const s2 = slot || 0;
    localStorage.removeItem(this.getSaveKey(s2));
    localStorage.removeItem(this.getSaveTimeKey(s2));
  }
  getSaveInfo(slot) {
    try {
      const saved = localStorage.getItem(this.getSaveKey(slot || 0));
      if (!saved) return null;
      const st = JSON.parse(saved);
      return { name: st.player ? st.player.name : '无名', age: st.player ? st.player.age : 0, phase: st.phase || '', years: st.player ? st.player.yearsWorked || 0 : 0, rank: st.player ? st.player.leadershipRank || 0 : 0, unit: st.player && st.player.unit ? st.player.unit.name : '', unitLevel: st.player ? st.player.unitLevel || 0 : 0, time: parseInt(localStorage.getItem(this.getSaveTimeKey(slot || 0)) || '0', 10) };
    } catch(e) { return null; }
  }
  clampAttrs() {
    const h = this.state.hidden;
    for (const k of Object.keys(h)) {
      if (k === 'desire') { h[k] = Math.max(0, Math.min(100, h[k])); continue; }
      if (k === 'background') { h[k] = Math.max(0, Math.min(100, h[k])); continue; }
      h[k] = Math.max(0, Math.min(100, h[k]));
    }
    // 可见属性封顶封底（v2.28：iq/eq 上限统一为 15——此前 eq 上限 25 致 71% 玩家溢出到无收益区、面板虚高；面试/晋升均只取 0-15 区间）
    const a = this.state.attrs;
    a.iq = Math.max(-8, Math.min(15, a.iq));
    a.eq = Math.max(-8, Math.min(15, a.eq));
    a.luck = Math.max(-8, Math.min(15, a.luck));
    a.family = Math.max(-8, Math.min(15, a.family));
    a.appearance = Math.max(-8, Math.min(12, a.appearance));
    a.body = Math.max(-8, Math.min(12, a.body));
  }
  // v2.1.66 统一数值钳位：全项目唯一的区间表（原散落在 engine-core/events/exam 的 Math.max(0, Math.min(100,...)) 收敛于此）。
  // 只做区间，不吞默认值语义——调用点自行保留 `|| 50` / `|| 0` 等初值。
  clampStat(key, value) {
    if (key === 'iq' || key === 'eq' || key === 'luck' || key === 'family') return Math.max(-8, Math.min(15, value));
    if (key === 'appearance' || key === 'body') return Math.max(-8, Math.min(12, value));
    return Math.max(0, Math.min(100, value)); // reputation/peopleReputation/heat 及各 hidden 数值
  }
  // v2.1.66 属性增量写入：应用层动作统一入口（替代直写 engine.state.attrs）。
  // max 为动作级显式上限（历史有意设计：体检/健身 body 上限 10 ≠ clampAttrs 的 12；买书 iq、养宠 eq 上限 15），缺省回退到属性硬上限。
  gainAttr(key, delta, max) {
    if (!(key in this.state.attrs)) return;
    const cap = (typeof max === 'number') ? max : ((key === 'appearance' || key === 'body') ? 12 : 15);
    this.state.attrs[key] = Math.min(cap, (this.state.attrs[key] || 0) + delta);
  }
}
