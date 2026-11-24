// engine-planning.js —— 年度筹划回合：精力点（AP）系统
// 设计：AP 是"每年可自由动作"的统一预算，取代原先各自为政的"每类动作各 1 次"。
// 现有动作（理财/人脉/子女）在 UI 层各消耗 1 AP，AP 用尽即不能再做，形成真实取舍。
// 引擎的年度上限（financeUsed/网络槽位等）仍作为兜底防重，headless 模拟不调用这些可自由动作，平衡不受影响。
(function() {
  if (typeof GameEngine === 'undefined') return;

  // 每年可用精力上限：基础 3，按处境浮动（充沛/透支/带病/返聘/年岁/天赋）。
  GameEngine.prototype.getMaxActionPoints = function() {
    const s = this.state; const p = s && s.player;
    if (!p) return 3;
    const attrs = s.attrs || {};
    const h = s.hidden || {};
    let ap = 3;
    if ((attrs.body || 0) >= 6) ap += 1;            // 体质充沛，精力更足
    if ((h.mentalPressure || 0) > 70) ap -= 1;      // 长期高压透支
    if (p.flags && p.flags.chronicIllness) ap -= 1; // 慢性病拖累
    if (p.flags && p.flags.rehired) ap -= 1;        // 返聘老年精力弱
    if ((p.age || 0) >= 55) ap -= 1;                // P4：年过五十五，精力一年不如一年
    // P4 天赋精力区分：effects.apBonus（钢铁身心/钢铁意志 +1，家有病人 -1）
    if (Array.isArray(p.talents) && p.talents.length > 0 && typeof GameData !== 'undefined' && Array.isArray(GameData.talents)) {
      const talentById = this._talentById || (this._talentById = new Map(GameData.talents.map(t => [t.id, t])));
      for (const tid of p.talents) {
        const t = talentById.get(tid);
        if (t && t.effects && typeof t.effects.apBonus === 'number') ap += t.effects.apBonus;
      }
    }
    return Math.max(1, Math.min(5, ap));
  };

  // 年度重置：把当年 AP 补满至上限（在 runCareerYear/restYear 的年度重置段调用）。
  GameEngine.prototype.resetActionPoints = function() {
    const p = this.state && this.state.player;
    if (!p) return;
    p.maxActionPoints = this.getMaxActionPoints();
    p.actionPoints = p.maxActionPoints;
  };

  // 当前剩余 AP（兜底：字段缺失时按上限补齐，兼容旧档/初次进入）。
  GameEngine.prototype.getActionPoints = function() {
    const p = this.state && this.state.player;
    if (!p) return 0;
    if (typeof p.actionPoints !== 'number') {
      p.maxActionPoints = this.getMaxActionPoints();
      p.actionPoints = p.maxActionPoints;
    }
    return p.actionPoints;
  };

  GameEngine.prototype.canAffordAP = function(n) {
    const cost = Math.max(1, Math.floor(n || 1));
    return this.getActionPoints() >= cost;
  };

  // 消耗 AP：足够则扣减并返回 true，不足返回 false（不扣）。
  GameEngine.prototype.spendActionPoint = function(n) {
    const cost = Math.max(1, Math.floor(n || 1));
    const p = this.state && this.state.player;
    if (!p) return false;
    if (this.getActionPoints() < cost) return false;
    p.actionPoints = Math.max(0, this.getActionPoints() - cost);
    return true;
  };

  // 职级职责：同一年度只能选择一项，精力与后续工作量均有代价。
  GameEngine.prototype.getDutyPlan = function() {
    const p=this.state.player,rank=p.leadershipRank||1;
    const tier=rank<=3?'frontline':rank<=6?'manager':'leader';
    const plans={
      frontline:{title:'一线执行',actions:[
        {id:'field',name:'走访并核对群众反馈',desc:'次年兑现群众反馈，承担额外工作压力',now:{mentalPressure:2},later:{peopleReputation:3,workAbility:1,positionWeight:1}},
        {id:'skills',name:'整理业务手册',desc:'次年形成可复用材料，暂缓个人表现',now:{positionWeight:-1},later:{workAbility:3,mentalPressure:-1}}]},
      manager:{title:'团队管理',actions:[
        {id:'delegate',name:'培养骨干并分配任务',desc:'今年增加协调负担，次年缓解压力',now:{mentalPressure:1,positionWeight:-1},later:{workAbility:2,mentalPressure:-4}},
        {id:'review',name:'复核积压项目与责任清单',desc:'当前声誉承压，次年改善风险与口碑',now:{reputation:-1,mentalPressure:2},later:{risk:-3,peopleReputation:3}}]},
      leader:{title:'统筹与问责',actions:[
        {id:'priorities',name:'调整公共服务优先序',desc:'承担协调压力，次年兑现公共服务反馈',now:{mentalPressure:2,background:-1},later:{peopleReputation:4,reputation:1,positionWeight:1}},
        {id:'audit',name:'组织独立复核与交接',desc:'暂缓个人考核收益，次年减少遗留风险',now:{positionWeight:-2,mentalPressure:2},later:{risk:-4,integrity:2}}]}
    };
    const tags=p.unit?.tags||[],system=p.unit?.system||'';
    const kind=tags.some(t=>['tech','data'].includes(t))?'tech':tags.some(t=>['finance','audit'].includes(t))?'finance':tags.some(t=>['law','enforcement'].includes(t))?'law':p.unitLevel===0||['民生部门','窗口部门','基层单位'].includes(system)?'service':'coordination';
    const specialist={
      tech:{id:'special_tech',name:'验证系统与故障复盘',desc:'次年按业务能力验证，成功积累专业实绩',now:{mentalPressure:2,positionWeight:-1},later:{workAbility:3,risk:-1}},
      finance:{id:'special_finance',name:'核对预算与历史账目',desc:'次年按廉洁和风险复核，成功降低遗留风险',now:{mentalPressure:2,reputation:-1},later:{risk:-3,integrity:1}},
      law:{id:'special_law',name:'复核证据与程序记录',desc:'次年按能力及风险核查，成功改善公信力',now:{mentalPressure:3},later:{integrity:2,peopleReputation:2}},
      service:{id:'special_service',name:'跟进未办结的服务事项',desc:'次年按群众口碑与压力核查，成功改善服务反馈',now:{mentalPressure:2},later:{peopleReputation:3,workAbility:1}},
      coordination:{id:'special_coordination',name:'梳理跨部门责任与交付',desc:'次年按业务能力和组织声誉核查，成功积累协调实绩',now:{mentalPressure:2},later:{reputation:2,positionWeight:1}}
    }[kind];
    const counts=p.dutyCounts||{};
    const projectLoad=!!this.state.policyProject||p.policyDecisionAge===p.age;
    const pace={id:'pace',name:'调整工作节奏',desc:'把非紧急任务交接，放弃本年额外实绩，降低压力',now:{mentalPressure:-5,positionWeight:-1},later:{mentalPressure:-2}};
    const actions=[...plans[tier].actions,pace,specialist].map(a=>{
      const count=counts[a.id]||0;
      const later=Object.fromEntries(Object.entries(a.later).map(([k,v])=>[k,Math.sign(v)*Math.max(1,Math.floor(Math.abs(v)*(count>=4?0.35:count>=2?0.65:1)))]));
      const now={...a.now};if(a.id.startsWith('special_')&&count>=2&&now.mentalPressure>0)now.mentalPressure=Math.max(1,now.mentalPressure-1);
      const blocked=a.id==='pace'?(this.state.hidden.mentalPressure<40?'当前压力未达调整条件':p.policyPauseAge===p.age?'本年已经调整项目工期':''):(projectLoad?'项目已占用本年主要职责':this.state.hidden.mentalPressure>=(a.id.startsWith('special_')?55:65)?'工作负担过高，请先调整节奏':'');
      return {...a,now,later,blocked,desc:a.desc+(count>=2?'；重复执行收益递减':'')};
    });
    return {tier,title:plans[tier].title,actions,used:p.dutyPlanAge===p.age,pending:p.dutyPending||null};
  };
  GameEngine.prototype.chooseDutyPlan = function(id) {
    const s=this.state,p=s.player,plan=this.getDutyPlan();
    const action=plan.actions.find(a=>a.id===id);
    if(!p.isEmployed||p.ending||s.currentEvent||s.pendingPromotion||s.pendingTransfer||plan.used||plan.pending||!action||action.blocked||!this.canAffordAP(1))return false;
    this.spendActionPoint(1);this.applyEffects(action.now);this.clampAttrs();
    p.dutyPlanAge=p.age;p.dutyPending={id, name:action.name, dueAge:p.age+1, effects:{...action.later},unitId:p.unit?.id};
    p.careerLog.push({year:p.age,event:'岗位职责：'+action.name+'（次年回访）'});
    return true;
  };
  GameEngine.prototype.settleDutyPlan = function() {
    const p=this.state.player,d=p.dutyPending;
    if(!d||p.age<d.dueAge)return false;
    // 职级变化不会取消已经承担的责任。
    delete p.dutyPending;
    const h=this.state.hidden,counts=p.dutyCounts||(p.dutyCounts={});
    const checks={special_tech:h.workAbility>=55&&h.mentalPressure<75,special_finance:h.integrity>=65&&h.risk<35,special_law:h.workAbility>=50&&h.risk<35,special_service:(p.peopleReputation??50)>=55&&h.mentalPressure<75,special_coordination:h.workAbility>=50&&p.reputation>=55};
    const special=String(d.id||'').startsWith('special_'),success=!special||!!checks[d.id];
    counts[d.id]=(counts[d.id]||0)+1;
    if(success){
      this.applyEffects(d.effects);
      if(special){const record=p.dutyVerified||(p.dutyVerified={});record[d.id]=(record[d.id]||0)+1;
        this.recordLifeEvidence?.(d.id==='special_service'?'service':'craft','专业职责：'+d.name);}
    }else this.applyEffects({mentalPressure:2});
    this.clampAttrs();
    p.careerLog.push({year:p.age,event:'岗位职责回访：'+d.name+(success?'，已核对执行反馈':'，未达到复核条件，遗留事项未算作实绩')});
    return true;
  };

  // 退休后篇独立于职业结局和评分。
  GameEngine.prototype.getRetirementChapter = function() {
    const p=this.state.player;
    if(!p.ending||p.deathReason!=='retired')return null;
    const r=p.retirementChapter||{years:[],health:Math.max(0,Math.min(100,Math.round((this.state.attrs.body||0)*5+(100-this.state.hidden.mentalPressure)*0.5))),family:Math.max(0,Math.min(100,100-this.state.hidden.familyPressure)),connection:Math.max(0,Math.min(100,p.peopleReputation??50))};
    const index=r.years.length;
    const scenes=[
      {title:'第一年 · 空下来的日程',text:'熟悉的工作节奏已经离你远去。',choices:[
        {id:'routine',text:'重新建立运动和休息习惯',delta:{health:7},result:'你给自己留出固定的散步时间，逐渐适应了新的生活。'},
        {id:'family',text:'与家人商量今后的共同生活',delta:{family:7},result:'你们重新分配家务，也为各自的兴趣保留时间。'},
        {id:'friends',text:'约旧同事见面',delta:{connection:6},result:'茶桌上谈的是近况，而不是职务。'}]},
      {title:'第二年 · 重新安排生活',text:p.flags.chronicIllness?'复查与日常生活需要重新排期。':'退休生活进入日常，闲下来也需要学会分配时间。',choices:[
        {id:'care',text:'安排检查、休息和健康管理',delta:{health:8},result:'你不再把身体的需要推迟到下一次有空时。'},
        {id:'home',text:'与亲友共同承担家庭事务',delta:{family:6,health:-1},result:'你和家人商量照护分工，不再把所有责任揽在自己身上。'},
        {id:'community',text:'参加社区志愿活动',delta:{connection:7,health:-1},result:'没有职级要求的事务，让你找到新的参与方式。'}]},
      {title:'第三年 · 留下什么',text:p.flags.teamLegacyResolved||p.flags.receiptLegacyResolved?'你想起后来者也在继续自己的路。':'抽屉里还有旧笔记，你可以整理经验，也可以把工作留在过去。',choices:[
        {id:'memoir',text:'整理可公开的经验和个人回忆',delta:{connection:5,health:-1},result:'你写下真实经历和未解决的问题。'},
        {id:'reunion',text:'联系旧友，接受各自已经改变的人生',delta:{connection:6,family:2},result:'这次重逢不要求任何人回到过去。'},
        {id:'quiet',text:'把时间留给家人、兴趣和自己',delta:{health:5,family:5},result:'你不必再用完成多少工作来衡量每一天。'}]}
    ];
    return {...r,done:index>=scenes.length,scene:scenes[index]||null,age:p.age+index+(index<scenes.length?1:0)};
  };
  GameEngine.prototype.chooseRetirementChapter = function(id) {
    const view=this.getRetirementChapter(),p=this.state.player;
    const c=view?.scene?.choices.find(x=>x.id===id);
    if(!c||view.done)return false;
    const r=p.retirementChapter||(p.retirementChapter={years:[],health:view.health,family:view.family,connection:view.connection});
    for(const [k,v] of Object.entries(c.delta))r[k]=Math.max(0,Math.min(100,r[k]+v));
    r.years.push({age:view.age,id,result:c.result});
    return true;
  };

  // ===== P2 事件密度：机会事件与微决策 =====
  // 机会事件：每年在筹划板浮现 2-3 个"可选支线"——玩家可花精力主动追查。
  // 候选来自既有事件池（复用 generateEvent 的全部资格门槛与动态权重），
  // 但优先本局未见、跨局低频的"盲区"事件；不绕过任何门槛，也不影响 headless 模拟（模拟从不追查）。

  // 捕获当前资格池（复用 generateEvent 的过滤+权重，诊断接口同款机制）。
  GameEngine.prototype._captureEligiblePool = function() {
    if (typeof this.generateEvent !== 'function') return [];
    const previous = this._captureEventPool;
    this._captureEventPool = true;
    try {
      const pool = this.generateEvent(true);
      return Array.isArray(pool) ? pool : [];
    } finally {
      this._captureEventPool = previous;
    }
  };

  // P3 时代背景波：按工龄轮转的当年时代主题（无波时返回 null）。
  GameEngine.prototype.getEraWave = function() {
    const era = typeof this.getEra === 'function' ? this.getEra() : null;
    if (!era || !Array.isArray(era.waves) || era.waves.length === 0) return null;
    const p = this.state && this.state.player;
    const idx = (p && Number.isFinite(p.yearsWorked)) ? p.yearsWorked % era.waves.length : 0;
    return era.waves[idx] || null;
  };

  // 事件是否命中时代波（阶段或效果键任一匹配）
  GameEngine.prototype._eventMatchesWave = function(e, wave) {
    if (!e || !wave) return false;
    if (wave.stage && e.stage === wave.stage) return true;
    if (Array.isArray(wave.effectKeys) && wave.effectKeys.length > 0) {
      const keys = wave.effectKeys;
      const hits = eff => eff && keys.some(k => eff[k] !== undefined);
      if (hits(e.effects)) return true;
      if (Array.isArray(e.choices) && e.choices.some(c => hits(c.effects))) return true;
    }
    return false;
  };

  // 当年机会候选（惰性生成、按年缓存）：返回事件定义数组。
  GameEngine.prototype.getOpportunities = function() {
    const s = this.state; const p = s && s.player;
    if (!p || !p.isEmployed || p.ending) return [];
    if (s.pendingPromotion || s.pendingTransfer || s.currentEvent) return [];
    if ((s.opportunityYear === p.yearsWorked) && Array.isArray(s.opportunityIds)) {
      const defs = s.opportunityIds.map(id => (GameData.events || []).find(e => e && e.id === id)).filter(Boolean);
      if (defs.length > 0 || s.opportunityIds.length === 0) return defs;
    }
    const pool = this._captureEligiblePool();
    const counts = p.eventCounts || {};
    const candidates = pool.filter(e => {
      if (!e || !e.id || e.eventType !== 'choice' || !Array.isArray(e.choices) || e.choices.length === 0) return false;
      if (e.projectEvent || e.opinionCrisis || e.gambleDynamic) return false;
      if ((e.weight || 1) > 50) return false; // 超高权重事件已有专属引导通道，不占机会位
      return true;
    });
    // 盲区优先：本局未见 +60、跨局触发越少越靠前，再叠一层抖动防固定序列；命中时代波的机会 ×1.6
    const wave = this.getEraWave();
    candidates.forEach(e => {
      const times = counts[e.id] || 0;
      let score = 60 + Math.max(0, 30 - times * 15) + this.randf() * 40;
      if (wave && this._eventMatchesWave(e, wave)) score *= 1.6;
      e._oppScore = score;
    });
    candidates.sort((a, b) => b._oppScore - a._oppScore);
    const picked = candidates.slice(0, 3).map(e => e.id);
    candidates.forEach(e => { delete e._oppScore; });
    s.opportunityIds = picked;
    s.opportunityYear = p.yearsWorked;
    return picked.map(id => (GameData.events || []).find(e => e && e.id === id)).filter(Boolean);
  };

  // 追查机会：花 1 精力把机会事件置入 currentEvent（走既有事件面板与结算路径）。
  GameEngine.prototype.pursueOpportunity = function(id) {
    const s = this.state; const p = s && s.player;
    if (!p || !id) return { ok: false, code: 'NO_TARGET' };
    if (!p.isEmployed || p.ending || s.currentEvent || s.pendingPromotion || s.pendingTransfer) return { ok: false, code: 'SLOT_BUSY' };
    if (!Array.isArray(s.opportunityIds) || !s.opportunityIds.includes(id)) return { ok: false, code: 'EXPIRED' };
    if (!this.canAffordAP(1)) return { ok: false, code: 'NO_AP' };
    // 追查前复核资格（动作之后状态可能已变化，防止绕过门槛）
    const stillEligible = this._captureEligiblePool().some(e => e && e.id === id);
    const def = (GameData.events || []).find(e => e && e.id === id);
    if (!stillEligible || !def) {
      s.opportunityIds = s.opportunityIds.filter(x => x !== id);
      return { ok: false, code: 'INELIGIBLE' };
    }
    this.spendActionPoint(1);
    s.opportunityIds = s.opportunityIds.filter(x => x !== id);
    s.currentEvent = { ...def };
    p.flags.quietStreak = 0; // 追查算"有事件年"
    return { ok: true, event: s.currentEvent };
  };

  // ===== 敌人使绊微决策：伤害照常发生（与旧版数值一致），但给玩家一个回应窗口 =====
  // pendingMicro = { kind:'enemy', enemyName, hit:'risk'|'reputation'|'pressure', amount, year }
  GameEngine.prototype.resolveMicroResponse = function(mode) {
    const s = this.state; const p = s && s.player;
    const micro = s && s.pendingMicro;
    if (!micro || micro.kind !== 'enemy') return { ok: false, code: 'NO_MICRO' };
    const finish = (msg) => { s.pendingMicro = null; p.careerLog.push({ year: p.age, event: msg }); return { ok: true }; };
    if (mode === 'ignore') {
      return finish(`🕳️ 你选择不理会 ${micro.enemyName} 的小动作，日子照旧过`);
    }
    if (!this.canAffordAP(1)) return { ok: false, code: 'NO_AP' };
    const h = s.hidden;
    const recover = (amount, ratio) => {
      const back = Math.max(1, Math.round(amount * ratio));
      if (micro.hit === 'risk') h.risk = Math.max(0, (h.risk || 0) - back);
      else if (micro.hit === 'reputation') p.reputation = Math.min(100, (p.reputation ?? 50) + back);
      else if (micro.hit === 'pressure') h.mentalPressure = Math.max(0, (h.mentalPressure || 0) - back);
      return back;
    };
    const enemy = (p.contacts || []).find(c => c.enemy && c.name === micro.enemyName);
    const nudgeEnemy = (delta, note) => {
      if (!enemy) return;
      if (this.applyContactDelta) this.applyContactDelta(enemy, { relation: delta }, note);
      else enemy.relation = Math.max(-60, (enemy.relation || 0) + delta);
    };
    if(!['clarify','confront'].includes(mode))return {ok:false,code:'UNKNOWN_MODE'};
    this.spendActionPoint(1);
    if (mode === 'clarify') {
      const chance = Math.min(0.85, 0.4 + (p.reputation ?? 50) / 250);
      if (this.randf() < chance) {
        const back = recover(micro.amount, 0.6);
        return finish(`🗣️ 你主动向组织说明了情况，${micro.enemyName} 的算计没能得逞（挽回 ${back}）`);
      }
      h.mentalPressure = Math.min(100, (h.mentalPressure || 0) + 2);
      return finish(`🗣️ 你找了组织说明，但时机不巧，没激起什么水花（压力+2）`);
    }
    if (mode === 'confront') {
      const chance = Math.min(0.85, 0.45 + (s.attrs.eq || 0) * 0.03);
      if (this.randf() < chance) {
        const back = recover(micro.amount, 1);
        nudgeEnemy(-10, '当面交涉');
        h.risk = Math.min(100, (h.risk || 0) + 1);
        return finish(`⚡ 你当面找 ${micro.enemyName} 把话挑明，对方收敛了不少（挽回 ${back}，关系-10，风险+1）`);
      }
      h.mentalPressure = Math.min(100, (h.mentalPressure || 0) + 4);
      nudgeEnemy(-4, '交涉破裂');
      return finish(`⚡ 交涉没谈拢，场面不太好看（压力+4，关系-4）`);
    }
    return { ok: false, code: 'UNKNOWN_MODE' };
  };
})();
