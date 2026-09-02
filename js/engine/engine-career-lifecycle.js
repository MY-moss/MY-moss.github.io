// 基层历练、里程碑与人生门槛模块。
// 依赖：engine-career.js；方法名保持 GameEngine 公开契约不变。

// 基层综合表现评估：多维标准，避免"只刷工作能力"的偏科玩家垄断优秀评价
// 维度：工作能力(主) + 情商(群众工作) + 背景(资源协调) + 廉洁(口碑) + 体质(吃苦耐劳) + 运气(机遇) + 成长幅度
// 优秀 = 综合分 >= 60（全能复合型人才可达成）；差 = 综合分 < 40
GameEngine.prototype.getGrassrootsScore = function() {
    const p = this.state.player; const h = this.state.hidden; const a = this.state.attrs;
    const baseline = p.flags.grassrootsBaselineWork !== undefined ? p.flags.grassrootsBaselineWork : 40;
    const growth = h.workAbility - baseline;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const score = h.workAbility * 0.5
      + clamp(a.eq, 0, 10) * 1.0
      + clamp(h.background, 0, 50) * 0.3
      + clamp(h.integrity, 0, 70) * 0.2
      + clamp(a.body, 0, 6) * 1.5
      + clamp(a.luck, 0, 8) * 0.5 // v2.23 平衡：面试运气加成 0.8→0.5（8 luck 满加成 4 分 ≈ 8 工作能力，运气不再压过能力）
      + Math.max(0, growth) * 0.4;
    return Math.round(score);
  }
GameEngine.prototype.checkGrassrootsReturn = function() {
    const p = this.state.player;
    if (!p.flags.grassrootsActive) return;
    p.flags.grassrootsYears = (p.flags.grassrootsYears || 0) + 1;
    const duration = p.flags.grassrootsDuration || 3;
    if (p.flags.grassrootsYears < duration) return;
    // 如果当前已有选择事件，推迟到下一年
    if (this.state.currentEvent && this.state.currentEvent.eventType === 'choice') return;

    const oldUnitId = p.flags.grassrootsOldUnitId;
    let oldUnit = null;
    if (oldUnitId) oldUnit = GameData.units.find(u => u.id === oldUnitId);
    if (!oldUnit && p.flags.grassrootsOldUnit) oldUnit = GameData.units.find(u => u.name === p.flags.grassrootsOldUnit);
    if (!oldUnit) {
      const oldLevel = ['乡镇', '县级', '市级', '省级'][p.flags.grassrootsOldLevel || 1] || '市级';
      const candidates = GameData.units.filter(u => u.level === oldLevel);
      if (candidates.length > 0) oldUnit = candidates[this.rand(0, candidates.length - 1)];
    }
    if (!oldUnit) oldUnit = GameData.units[0];

    // 查找原单位下一级单位（含中央：仅修复前已下派的中央旧存档会走到，返回省级而非县级更合理）
    const levelOrder = ['乡镇', '县级', '市级', '省级', '中央'];
    const oldLevelIdx = levelOrder.indexOf(oldUnit.level);
    let lowerUnit = null;
    if (oldLevelIdx > 0) {
      const lowerLevelName = levelOrder[oldLevelIdx - 1];
      const lowerCandidates = GameData.units.filter(u => u.level === lowerLevelName);
      if (lowerCandidates.length > 0) lowerUnit = lowerCandidates[this.rand(0, lowerCandidates.length - 1)];
    }

    // ====== 分级返回机制 ======
    // 综合表现评估：工作能力 + 情商 + 背景 + 廉洁 + 体质 + 运气 + 成长幅度（多维，全能型也有机会评优）
    const gScore = this.getGrassrootsScore();
    const excellent = gScore >= 60;
    const poor = gScore < 40;
    const mediocre = !excellent && !poor;

    // ====== 强制安排：30% 概率由组织直接决定去向（仅中规中矩/差玩家，优秀玩家永不被强制） ======
    // 回原单位永不强制——那是玩家的自由选择权；强制只在"调往下一级(60%)/留当地(40%)"之间分配
    if (!excellent && this.randf() < 0.3) {
      const roll = this.randf();
      if (lowerUnit && roll < 0.6) {
        this.state.pendingTransfer = {
          type: 'grassrootsForcedStay',
          reason: `基层历练结束，组织考核认为你表现中规中矩，决定将你调往${lowerUnit.name}（原单位下一级）任职。这是组织的正式安排，你需要确认接受。`,
          effects: `调往${lowerUnit.name}任职：能力+3，压力+5，权重-3，声誉-2`,
          outcome: 'lower',
          targetUnit: lowerUnit,
          returnUnit: oldUnit
        };
      } else {
        this.state.pendingTransfer = {
          type: 'grassrootsForcedStay',
          reason: `基层历练结束，组织考核认为你的情况更适合留在基层继续磨砺，决定让你留任${p.unit ? p.unit.name : '基层'}。这是组织的正式安排，你需要确认接受。`,
          effects: '留在基层继续磨砺：能力+3，压力+6，晋升进度+2年延误，声誉-3',
          outcome: 'stay',
          returnUnit: oldUnit
        };
      }
      return;
    }

    // ====== 自由选择（70%）：三选一 ======
    const choices = [];
    if (excellent) {
      // 优秀：三选一（留当地/调下一级收获更多加成，回原单位=保住平台+提拔）
      choices.push({ text: `留任${p.unit ? p.unit.name : '基层'}主政一方（扎根基层，威望大涨，收获丰厚）`, effects: { grassrootsStay: true, workAbility: 4, reputation: 8, positionWeight: 5, background: 4, mentalPressure: -5, integrity: 3, risk: -2 } });
      choices.push({ text: `返回原单位${oldUnit.name}并获提拔`, effects: { grassrootsReturn: oldUnit.id, mentalPressure: -5, positionWeight: 4, background: 3, reputation: 3, integrity: 1 } });
      if (lowerUnit) {
        choices.push({ text: `调往${lowerUnit.name}主持工作（下派经验+稳健上升，积累深厚）`, effects: { grassrootsLower: lowerUnit.id, workAbility: 4, positionWeight: 4, background: 3, mentalPressure: -2, reputation: 3 } });
      } else {
        choices.push({ text: '申请调往其他县级单位（积累基层经验，稳健上升）', effects: { grassrootsLower: 'auto', workAbility: 4, positionWeight: 4, mentalPressure: -2, reputation: 3 } });
      }
      this.state.currentEvent = {
        id: 'grassroots_return_event',
        stage: 'work',
        eventType: 'choice',
        title: '基层历练期满',
        text: `经过${p.flags.grassrootsYears}年的基层历练，你工作扎实、群众口碑好、作风过硬，组织对你的综合表现（业务能力、群众工作、廉洁自律）高度认可，面临人生的重要选择：留任基层主政一方、返回原单位接受提拔、还是调往更有潜力的岗位？每个选择都将影响你未来的职业道路。`,
        choices: choices
      };
      return;
    }

    // 中规中矩/表现差：三选一（返回原单位惩罚最高；留当地/调下一级顺势而为，收获成长加成）
    const returnText = mediocre
      ? `申请返回原单位${oldUnit.name}（表现中规中矩，需接受调任考核，压力大增）`
      : `申请返回原单位${oldUnit.name}（表现欠佳，将面临降级风险）`;
    const returnEff = mediocre
      ? { grassrootsReturn: oldUnit.id, mentalPressure: 10, positionWeight: -3, reputation: -2, risk: 4 }
      : { grassrootsReturn: oldUnit.id, mentalPressure: 12, positionWeight: -5, reputation: -4, risk: 6, flag: 'grassrootsPoorReturn' };
    choices.push({ text: returnText, effects: returnEff });
    choices.push({ text: `留任${p.unit ? p.unit.name : '基层'}继续工作（扎根基层收获口碑与成长）`, effects: { grassrootsStay: true, workAbility: 4, background: 2, mentalPressure: -5, integrity: 3, reputation: 3 } });
    if (lowerUnit) {
      choices.push({ text: `调往${lowerUnit.name}（顺势而为，积累基层经验与资源）`, effects: { grassrootsLower: lowerUnit.id, workAbility: 3, background: 4, reputation: 2, mentalPressure: 1 } });
    } else {
      choices.push({ text: '申请调往其他县级单位（积累基层经验与资源）', effects: { grassrootsLower: 'auto', workAbility: 3, background: 4, reputation: 2, mentalPressure: 1 } });
    }
    this.state.currentEvent = {
      id: 'grassroots_return_event',
      stage: 'work',
      eventType: 'choice',
      title: '基层历练期满',
      text: `经过${p.flags.grassrootsYears}年的基层历练，${mediocre ? '你的表现中规中矩，没有特别亮眼的成绩，组织正在评估你的去向。' : '你的表现平平，组织对你的工作能力有些疑虑。'}你可以选择返回原单位、留在基层、或者调往其他单位。选择需要谨慎，每个决定都有代价与机会。`,
      choices: choices
    };
  }

GameEngine.prototype.checkMilestones = function() {
    const p = this.state.player; const s = this.state;
    if (!p.isEmployed || p.ending) return;
    const y = p.yearsWorked;
    // 五阶段里程碑（一次性，用 flags 防重复）
    if (y === 1 && !p.flags.ms_1) {
      p.flags.ms_1 = true;
      // 常驻角色群像：入职即结识的长期关系（无论开局是否已有联系人，必注入——
      // v2.1.6 修复：原条件 "contacts.length === 0" 导致开局有人脉的玩家 crew 群像永不创建，
      // ent207/214/215/216/217/267 六个事件成为内容死角）
      if (!p.flags.crew_init) {
        p.flags.crew_init = true;
        const crew = [
          { id: 'crew_boss', name: '李处', relation: 30, position: '你的直属处长', description: '业务扎实、待人宽厚，是你职业生涯的第一位领路人' },
          { id: 'crew_colleague', name: '小王', relation: 20, position: '同批入职的同事', description: '和你同期入职，既是战友也是潜在的竞争对手' },
          { id: 'crew_mentor', name: '老周', relation: 15, position: '单位的老前辈', description: '在单位干了二十年，深谙机关里的门道' }
        ];
        crew.forEach(c => this.addContact(c));
        p.careerLog.push({ year: p.age, event: '👥 初来乍到，你认识了处长李处、同事小王和老前辈老周' });
      }
      const pass = s.hidden.workAbility >= 15;
      s.hidden.workAbility = Math.max(0, s.hidden.workAbility + (pass ? 2 : 0));
      s.hidden.mentalPressure += 3;
      p.careerLog.push({ year: p.age, event: '📋 入职第一年转正考核' + (pass ? '，顺利通过！' : '，勉强过关，仍需努力') });
    } else if (y === 3 && !p.flags.ms_3) {
      p.flags.ms_3 = true;
      const pass = s.hidden.workAbility >= 35 && this.state.attrs.eq >= 0;
      if (pass) { p.reputation = Math.min(100, p.reputation + 3); s.hidden.positionWeight = Math.min(100, s.hidden.positionWeight + 3); }
      else { p.missedPromotions = Math.max(0, p.missedPromotions + 1); s.hidden.mentalPressure += 4; }
      p.careerLog.push({ year: p.age, event: '🏅 入职三年评优' + (pass ? '，获评优秀！' : '，与优秀失之交臂') });
    } else if (y === 5 && !p.flags.ms_5) {
      p.flags.ms_5 = true;
      const pass = s.hidden.workAbility >= 50 && s.hidden.risk < 50;
      if (pass) { s.hidden.positionWeight = Math.min(100, s.hidden.positionWeight + 4); p.reputation = Math.min(100, p.reputation + 2); }
      else { p.missedPromotions = Math.max(0, p.missedPromotions + 2); s.hidden.mentalPressure += 5; }
      p.careerLog.push({ year: p.age, event: '🚪 入职五年晋升窗口' + (pass ? '，你抓住了机会！' : '，窗口期错过，前路更加拥挤') });
    } else if (y === 10 && !p.flags.ms_10) {
      p.flags.ms_10 = true;
      const pass = p.leadershipRank >= 5 && s.hidden.workAbility >= 60;
      if (pass) { p.reputation = Math.min(100, p.reputation + 4); s.hidden.positionWeight = Math.min(100, s.hidden.positionWeight + 4); }
      else { s.hidden.mentalPressure += 6; p.missedPromotions = Math.max(0, p.missedPromotions + 2); }
      p.careerLog.push({ year: p.age, event: '⏳ 黄金十年分水岭' + (pass ? '，你已站稳脚跟！' : '，同龄人已把你甩开') });
    } else if (y === 15 && !p.flags.ms_15) {
      p.flags.ms_15 = true;
      const pass = p.leadershipRank >= 6;
      if (pass) { p.reputation = Math.min(100, p.reputation + 5); s.hidden.positionWeight = Math.min(100, s.hidden.positionWeight + 5); }
      else { p.missedPromotions = Math.max(0, p.missedPromotions + 3); s.hidden.desire = Math.max(0, s.hidden.desire - 5); }
      p.careerLog.push({ year: p.age, event: '🏁 仕途定型之年' + (pass ? '，你已是单位的中坚力量！' : '，后辈开始与你平起平坐') });
    }
  }

GameEngine.prototype.checkLifeGates = function() {
    const p = this.state.player; const s = this.state;
    if (!p.isEmployed || p.ending) return;
    // 35/45/55 人生关卡（一次性）
    if (p.age === 35 && !p.flags.lg_35) {
      p.flags.lg_35 = true;
      const pass = s.hidden.mentalPressure < 70 && this.state.attrs.body >= 0;
      if (pass) { p.reputation = Math.min(100, p.reputation + 2); s.hidden.mentalPressure = Math.max(0, s.hidden.mentalPressure - 3); }
      else { s.hidden.workAbility = Math.max(0, s.hidden.workAbility - 5); s.hidden.mentalPressure += 5; }
      p.careerLog.push({ year: p.age, event: '🔥 三十五岁关卡' + (pass ? '，你扛住了工作与生活的双重压力！' : '，过度消耗让能力开始下滑') });
    } else if (p.age === 45 && !p.flags.lg_45) {
      p.flags.lg_45 = true;
      const pass = s.hidden.risk < 60 && s.hidden.mentalPressure < 80;
      if (pass) { p.reputation = Math.min(100, p.reputation + 3); }
      else { s.hidden.risk = Math.min(100, s.hidden.risk + 5); s.attrs.body = Math.max(-8, s.attrs.body - 2); }
      p.careerLog.push({ year: p.age, event: '🌪️ 四十五岁关卡' + (pass ? '，你稳住了！' : '，一场风波让你元气大伤') });
    } else if (p.age === 55 && !p.flags.lg_55) {
      p.flags.lg_55 = true;
      const pass = s.hidden.mentalPressure < 70;
      if (pass) { p.reputation = Math.min(100, p.reputation + 3); s.hidden.mentalPressure = Math.max(0, s.hidden.mentalPressure - 5); }
      else { s.hidden.workAbility = Math.max(0, s.hidden.workAbility - 5); p.flags.chronicIllness = true; }
      p.careerLog.push({ year: p.age, event: '🍂 五十五岁关卡' + (pass ? '，心态平和地走向终点！' : '，郁结于心，身体亮起红灯') });
    }
  }

// ===== 家庭行动：子女培养（v2.1.66 自 engine-social.js 并入，行为逐字不变） =====
GameEngine.prototype.raiseChild = function(mode) {
    const p = this.state.player;
    if (!p.hasChildren) return { ok: false, msg: '还没有孩子' };
    if ((p.flags.childRaiseUsed || 0) >= 1) return { ok: false, msg: '今年已经安排过孩子的事了' };
    if (p.childAge >= 22) return { ok: false, msg: '孩子已经成年独立，不用再操心了' };
    if (mode === 'education') {
      if ((p.finance ? p.finance.cash : 0) < 10) return { ok: false, msg: '囊中羞涩，教育投入需要 10 元' };
      this.cashOut(10);
      p.childEducation = (p.childEducation || 0) + 1;
      p.flags.childRaiseUsed = 1;
      this.state.hidden.familyPressure = Math.min(100, (this.state.hidden.familyPressure || 0) + 2);
      return { ok: true, msg: '给孩子报了辅导班（教育投入+1，现金-10）' };
    }
    if (mode === 'company') {
      p.childCompany = (p.childCompany || 0) + 1;
      p.flags.childRaiseUsed = 1;
      this.state.hidden.familyPressure = Math.max(0, (this.state.hidden.familyPressure || 0) - 3);
      this.state.hidden.mentalPressure = Math.min(100, (this.state.hidden.mentalPressure || 0) + 2);
      return { ok: true, msg: '陪孩子过了一个周末（陪伴+1，家庭压力-3）' };
    }
    if (mode === 'free') {
      p.flags.childRaiseUsed = 1;
      this.state.hidden.desire = Math.min(100, (this.state.hidden.desire || 0) + 2);
      return { ok: true, msg: '放手让孩子自己成长（自由发展）' };
    }
    return { ok: false, msg: '未知的培养方式' };
  }
