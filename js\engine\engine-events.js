// 事件生成热路径会对每个候选事件检查这些 ID；用共享 Set 避免每年/每事件重复创建数组。
const EVENT_TEMPTATION_IDS = new Set(['e051','e071','e185','e187','e188','e191','e194','e375','e439','e749','e755','e681','e682','e683','e686']);

GameEngine.prototype.applyEffects = function(eff) {
for (const [k, v] of Object.entries(eff)) {
      if (k === 'wealth') {
        // 财务双表：正收益进现金；负收益扣现金（现金不足差额自动转高利贷负债）
        if (v > 0) {
          let gain = v;
          // 腐败救赎（v2.13）：负债越重，铤而走险的腐败收益加成越高（上限4倍），给深陷债务的玩家一条回正的血路
          if (eff.integrity < 0 && this.debtTotal() > 10) {
            gain = Math.round(gain * (1 + Math.min(3, this.debtTotal() / 40)));
          }
          // v2.19 时代修正：改革年代乱世机会多（×1.3）、平稳/整顿年代风险大收益低（×0.7）
          const eraEff = this.getEra() ? this.getEra().effects : null;
          if (eraEff && eff.integrity < 0 && eraEff.corruptGainMult) gain = Math.round(gain * eraEff.corruptGainMult);
          this.cashIn(gain);
        } else {
          this.cashOut(-v);
        }
        continue;
      }
      if (k === 'political') { this.state.player.political = v; continue; }
      if (k === 'education') { this.state.player.education = v; continue; }
      if (k === 'childEducation') { this.state.player.childEducation = (this.state.player.childEducation || 0) + v; continue; } // v2.48 子女培养计数
      if (k === 'childCompany') { this.state.player.childCompany = (this.state.player.childCompany || 0) + v; continue; } // v2.48 子女陪伴计数
      if (k === 'reputation') { this.state.player.reputation = this.clampStat('reputation', this.state.player.reputation + v); continue; }
      if (k === 'peopleReputation') { this.state.player.peopleReputation = this.clampStat('peopleReputation', (this.state.player.peopleReputation || 50) + v); continue; } // v2.21 民间口碑
      if (k === 'flag') { if (typeof v === 'string') { this.state.player.flags[v] = true; this.state.player.flags[v + '_since'] = this.state.player.age; // v2.64 记录 flag 设置年份，供延迟刚性链（delay）判定
        if (v === 'resigned') this.state.player.isEmployed = false; if (v === 'reformProposal' || v === 'reformDraft') this.state.player.flags.reformCount = (this.state.player.flags.reformCount || 0) + 1; if (v === 'helpedCitizen' || v === 'petitionWork') this.state.player.flags.peopleEventCount = (this.state.player.flags.peopleEventCount || 0) + 1; } continue; }
      // P3 剧本链：一次选择同时落下多个 flag（链推进 flag + 剧情风味 flag），各自记录 _since 供延迟链判定
      if (k === 'setFlags' && Array.isArray(v)) { v.forEach(f => { if (typeof f === 'string' && f) { this.state.player.flags[f] = true; this.state.player.flags[f + '_since'] = this.state.player.age; } }); continue; }
      if (k === 'deleteFlag') { if (typeof v === 'string') { delete this.state.player.flags[v]; if (v === 'borrowed' || v === 'loanOnline') this.settleBorrowDebt(); } continue; }
      if (k === 'marry') { this.state.player.isMarried = true; delete this.state.player.flags.dating; delete this.state.player.flags.dating_since; continue; } // v2.66 结婚即恋爱终结（原 dating 残留导致婚后仍触发恋爱三年决断）
      if (k === 'child') { this.state.player.hasChildren = true; if (typeof this.state.player.childAge !== 'number') this.state.player.childAge = 0; continue; } // v2.58 生子同时初始化 childAge（此前永不初始化导致成才链/培养 UI 同局静默）
      if (k === 'contact') { this.addContact(v); continue; }
      if (k === 'addEnemy') { this.addEnemy(v); continue; } // v2.51 树敌
      if (k === 'contactRelation') { const tid = v.id === 'auto' ? this.pickRandomContact() : v.id; this.adjustContactRelation(tid, v.delta); if (typeof v.appearance === 'number') this.state.attrs.appearance += v.appearance; continue; } // v2.16: contactRelation 附带的外观变化也生效；v2.56: id 'auto' 随机一位联系人
      if (k === 'contactRelation2') { this.adjustContactRelation(v.id, v.delta); continue; } // v2.54 跨联系人互动（同一选项调整第二位联系人关系）
      if (k === 'contactDelta') { if (this.applyContactDelta) this.applyContactDelta(v.target || v.id || 'auto', v, 'event_contactDelta'); else this.adjustContactRelation(v.target || v.id || 'auto', v.relation || 0); continue; } // 分层人脉兼容层：旧事件仍可只写 relation，新事件可同时改变信任/互惠/人情债
      if (k === 'contactEvolution') { if (this.evolveContact) this.evolveContact(v.target || v.id || 'auto', v); continue; }
      // 统一基层派驻：旧事件的“接受下基层”选项必须进入临时派驻状态，不能只留下叙事 flag。
      if (k === 'grassrootsDispatch') { if (this.beginGrassrootsAssignment) this.beginGrassrootsAssignment(v); continue; }
      // v2.1.5 H2 债务重组效果键：debtForgive 直接减免本金（payDebtDirect，不扣现金）；debtRateMul 全部债务利率乘数（0.5=半息）
      if (k === 'debtForgive') { this.payDebtDirect(v); this.syncWealth(); continue; }
      if (k === 'debtRateMul') {
        const f2 = this.state.player.finance;
        if (f2 && Array.isArray(f2.debts)) {
          for (const d2 of f2.debts) d2.rate = Math.max(0.02, Math.min(0.2, Math.round(d2.rate * v * 100) / 100));
          this.syncWealth();
        }
        continue;
      }
      if (k === 'heat') { this.state.player.heat = this.clampStat('heat', this.state.player.heat + v); continue; }
      if (k === 'leadershipRank') { this.state.player.leadershipRank = Math.max(1, Math.min(12, this.state.player.leadershipRank + v)); continue; }
      // 中央调任：调往中央机关（须省级玩家，特殊事件通道）
      if (k === 'central') {
        const p2 = this.state.player;
        const centralUnits = GameData.units.filter(u => u.level === '中央');
        if (centralUnits.length > 0) {
          const centralTarget = centralUnits[this.rand(0, centralUnits.length - 1)];
          if (this.setPosting) this.setPosting(centralTarget, '事件调任中央');
          else { p2.unit = centralTarget; p2.unitLevel = 4; }
          p2.unitUpgrades = (p2.unitUpgrades || 0) + 1;
          p2.leadershipRank = Math.min(12, p2.leadershipRank + 1);
          p2.leadershipPromotions = (p2.leadershipPromotions || 0) + 1;
          p2.promotions = (p2.promotions || 0) + 1;
          this.state.hidden.positionWeight = Math.min(100, this.state.hidden.positionWeight + 8);
          this.state.hidden.background = Math.min(100, this.state.hidden.background + 6);
          p2.careerLog.push({ year: p2.age, event: `调任至中央！进入${p2.unit.name}，正式踏上最高权力舞台`, special: 'upgrade' });
        }
        // 调任后清除候选标记，防止重复触发"进京履新"
        delete p2.flags.centralCandidate;
        continue;
      }
      // 基层历练返回选择
      if (k === 'grassrootsReturn') {
        const p = this.state.player;
        const targetUnit = GameData.units.find(u => u.id === v);
        if (targetUnit) {
          const oldGrassUnit = p.unit ? p.unit.name : '基层';
          if (this.setPosting) this.setPosting(targetUnit, '基层历练返回');
          else { p.unit = targetUnit; p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[targetUnit.level] || 0; }
          // 多维综合评估（工作能力/情商/背景/廉洁/体质/运气/成长）
          // 注：压力/权重/声誉/风险等数值已由选项 effects 完整承载（UI 显示与实际一致），此处只做结构性处理
          const gScore = this.getGrassrootsScore();
          const poorReturn = p.flags.grassrootsPoorReturn || gScore < 40;
          // 综合表现优秀 → 提拔
          if (gScore >= 60 && !poorReturn) {
            p.leadershipRank++; p.promotions++;
            p.careerLog.push({ year: p.age, event: `基层历练结束，返回${targetUnit.name}并获提拔！`, special: 'upgrade' });
          } else if (poorReturn) {
            // 表现差强行回原单位 → 降级+延误
            p.leadershipRank = Math.max(1, p.leadershipRank - 1);
            p.missedPromotions += 3;
            p.careerLog.push({ year: p.age, event: `强行返回${targetUnit.name}，但因基层表现不佳被组织降级处理`, special: 'demotion' });
          } else {
            // 中规中矩回原单位：无提拔，晋升延误
            p.missedPromotions += 2;
            p.careerLog.push({ year: p.age, event: `基层历练结束，返回${targetUnit.name}（表现中规中矩，未获提拔）`, special: 'transfer' });
          }
        }
        p.flags.grassrootsActive = false;
        p.flags.grassrootsDone = true;
        p.flags.grassrootsChose = 'return';
        delete p.flags.grassrootsYears;
        delete p.flags.grassrootsDuration;
        delete p.flags.grassrootsPoorReturn;
        continue;
      }
      if (k === 'grassrootsStay') {
        const p = this.state.player;
        // 数值（能力/廉洁/声誉/权重/压力）已由选项 effects 完整承载，此处只做结构性处理
        const gScore = this.getGrassrootsScore();
        if (gScore >= 60) {
          // 优秀留任：主政一方，威望大涨
          p.leadershipRank = Math.min(12, p.leadershipRank + 1);
          p.promotions++;
          p.careerLog.push({ year: p.age, event: `选择留任${p.unit ? p.unit.name : '基层'}主政一方，获组织信任重用！`, special: 'upgrade' });
        } else {
          // 普通留任：稳定发展
          p.careerLog.push({ year: p.age, event: `选择留在${p.unit ? p.unit.name : '基层'}继续工作，扎根基层`, special: 'transfer' });
        }
        p.flags.grassrootsActive = false;
        p.flags.grassrootsDone = true;
        p.flags.grassrootsChose = 'stay';
        p.flags.grassrootsStay = true;
        delete p.flags.grassrootsYears;
        delete p.flags.grassrootsDuration;
        continue;
      }
      if (k === 'grassrootsLower') {
        const p = this.state.player;
        let targetUnit = null;
        if (v === 'auto') {
          const candidates = GameData.units.filter(u => u.level === '县级');
          if (candidates.length > 0) targetUnit = candidates[this.rand(0, candidates.length - 1)];
        } else {
          targetUnit = GameData.units.find(u => u.id === v);
        }
        if (targetUnit) {
          if (this.setPosting) this.setPosting(targetUnit, '基层调任');
          else { p.unit = targetUnit; p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[targetUnit.level] || 0; }
          p.careerLog.push({ year: p.age, event: `基层历练结束后调往${targetUnit.name}`, special: 'transfer' });
        }
        p.flags.grassrootsActive = false;
        p.flags.grassrootsDone = true;
        p.flags.grassrootsChose = 'lower';
        delete p.flags.grassrootsYears;
        delete p.flags.grassrootsDuration;
        continue;
      }
      if (k in this.state.attrs) this.state.attrs[k] += v;
      if (k in this.state.hidden) this.state.hidden[k] += v;
    }
  }
GameEngine.prototype.recordEventVisit = function(eventId) {
    if (!eventId) return;
    const counts = this.state.player.eventCounts || (this.state.player.eventCounts = {});
    counts[eventId] = (Number(counts[eventId]) || 0) + 1;
};
GameEngine.prototype.handleEventChoice = function(ci) {
    const e = this.state.currentEvent; if (!e || !e.choices) return;
    if (e.id) {
      this.state.player.seenEvents = this.state.player.seenEvents || [];
      if (!this.state.player.seenEvents.includes(e.id)) this.state.player.seenEvents.push(e.id);
      this.recordEventVisit(e.id);
    }
    // v2.59 调查链断链修复：e237「调查组来了」触发即进入被调查状态（e646 结果事件需此 flag）
    if (e.id === 'e237') this.state.player.flags.underInvestigation = true;
    // v2.66 恋爱重计时：ent263「认真谈一次」后从 seenEvents 移除自身——RIGID_CHAINS 依新 dating_since 重新注入（原实现重设计时但永不二次决断）
    if (e.id === 'ent263' && ci === 1) this.state.player.seenEvents = (this.state.player.seenEvents || []).filter(x => x !== 'ent263');
    const c = e.choices[ci]; if (!c) return;
    // v2.22 晋升答辩留痕：选项可附带 careerLogNote 写入年鉴（卷宗感）
    if (c.effects && c.effects.careerLogNote) {
      this.state.player.careerLog.push({ year: this.state.player.age, event: c.effects.careerLogNote });
    }
    // 政策项目与舆情危机复用事件面板，但由项目模块推进自己的状态机。
    if (e.projectEvent) { this.resolvePolicyProjectChoice(ci); return; }
    if (e.opinionCrisis) { this.resolvePolicyOpinionChoice(ci); return; }
    // ===== 赌博动态事件（v2.5）：赌注递增 / 选项递增 / 连续5次不赌消退 =====
    if (e.gambleDynamic) {
      const gp = this.state.player;
      const gs = gp.flags.gambleStreak || 1;
      if (c.effect === 'bet') {
        const stake = c.stake || 10;
        // 赌注从现金扣，现金不足差额按真实下注转高利贷负债（该负债多少就负债多少，联动利息/强制还款链）
        this.cashOut(stake);
        const won = this.randf() < 0.20;
        if (won) {
          this.cashIn(c.win);
          gp.careerLog.push({ year: gp.age, event: `🎲 借钱也要赌，居然赢了（净赚 ${c.win - stake}，还了高利贷）——你更离不开牌桌了` });
        } else {
          gp.careerLog.push({ year: gp.age, event: `🎲 钱不够也押了（-${stake}），背上了新的债——你已经分不清是赌还是逃` });
        }
        gp.flags.gambleStreak = gs + 1;
        gp.flags.gambleMiss = 0;
        gp.flags.gambleLastYear = gp.yearsWorked;
        gp.flags.gamblingAddict = true;
      } else {
        gp.flags.gambleMiss = (gp.flags.gambleMiss || 0) + 1;
        gp.flags.gambleLastYear = gp.yearsWorked;
        gp.careerLog.push({ year: gp.age, event: `🎲 你忍住了没赌（连续 ${gp.flags.gambleMiss} 次不赌，赌瘾开始消退）` });
      }
      // 连续 4 次不赌：赌瘾立即消退（streak 递减，归零则戒除；v2.11 频率放宽后同步阈值）
      if ((gp.flags.gambleMiss || 0) >= 4) {
        gp.flags.gambleStreak = Math.max(0, (gp.flags.gambleStreak || 1) - 1);
        gp.flags.gambleMiss = 0;
        if (gp.flags.gambleStreak === 0) {
          delete gp.flags.gamblingAddict;
          gp.careerLog.push({ year: gp.age, event: '🎲 你终于戒掉了赌瘾，心里那块石头落了地' });
        } else {
          gp.careerLog.push({ year: gp.age, event: `🎲 赌瘾有所消退（赌欲等级 ${gp.flags.gambleStreak}）` });
        }
      }
      this.state.currentEvent = null;
      this.checkEndings();
      return;
    }
    // 选项条件门槛：不满足条件的选项（背景/财富/flag）直接拦截，防止绕过UI触发
    if (!this.isChoiceEnabled(c)) return;
    this.applyEffects(c.effects);
    this.clampAttrs();
    this.state.currentEvent = null; this.checkEndings();
    // 赌博戒断（e747）：选择"戒赌"选项后彻底清除赌瘾状态（streak/连续未赌计数）
    if (e.id === 'e747' && c.effects && c.effects.deleteFlag === 'gamblingAddict') {
      this.state.player.flags.gambleStreak = 0;
      this.state.player.flags.gambleMiss = 0;
      this.state.player.flags.gambleLastYear = 0;
      this.state.player.careerLog.push({ year: this.state.player.age, event: '🎲 你终于戒掉了赌瘾，心里那块石头落了地' }); // v2.59 日志统一为"戒掉了赌瘾"（gamble_quit 成就只认此文本，原"立誓戒赌"导致 e747 戒赌路径成就不可达）
    }
    // 退休返聘：接受返聘的玩家延长工作年限（最高延至65岁）+ 触发老年线
    // v2.49：选项4「推荐年轻同事接替自己」（ci===3）此前被误判为接受返聘——改为与婉拒一样按退休结算，保留 mentorLegacy 传承标记
    if (e.id === 'e110' && this.state.player.isEmployed) {
      const p3 = this.state.player;
      if (ci === 1 || ci === 3) { // 婉拒返聘 / 推荐年轻同事接替自己 → v2.59：已达法定退休年龄才结算退休；未到年龄则放弃本次机会继续工作（原正常池 53/58 岁触发即提前退休）
        if (ci === 3) p3.flags.mentorLegacy = true;      // 推荐接班人：急流勇退但留下传承
        p3.careerLog.push({ year: p3.age, event: ci === 1 ? '婉拒返聘，开始享受退休生活' : '推荐年轻同事接替自己，急流勇退留下传承' });
        if (p3.age >= (p3.retireAgeExt || (p3.gender === '女' ? 55 : 60))) {
          p3.ending = this.determineEnding();
          p3.deathReason = 'retired';
        } else {
          p3.flags.retireAsked = true; // 放弃返聘机会：退休窗口不再重掷，到龄正常结算
        }
      } else {
        p3.retireAgeExt = Math.min(65, (p3.retireAgeExt || (p3.gender === '女' ? 55 : 60)) + 3);
        p3.flags.rehired = true;
        if (ci === 4) p3.flags.mentorMode = true;       // 培养接班人模式
        p3.careerLog.push({ year: p3.age, event: '接受返聘，继续在岗位上发光发热' });
        this.state.hidden.mentalPressure += 3;
      }
    }
    // 辞职离岗：进入下海人生结局（运气+工作能力共同决定下海成败，运气不足则平凡收场）
    if (this.state.player.flags.resigned && this.state.player.isEmployed === false && !this.state.player.ending) {
      this.state.player.ending = this.state.attrs.luck + this.state.hidden.workAbility > 60 ? 'entrepreneur' : 'ordinary';
      this.state.player.deathReason = 'resigned';
    }
  }
GameEngine.prototype.isChoiceEnabled = function(c) {
    if (!c) return false;
    const p = this.state.player;
    const bg = this.state.hidden.background;
    if (c.minBackground !== undefined && bg < c.minBackground) return false;
    if (c.maxBackground !== undefined && bg > c.maxBackground) return false;
    if (c.minWealth !== undefined && (p.wealth || 0) < c.minWealth) return false;
    if (c.maxWealth !== undefined && (p.wealth || 0) > c.maxWealth) return false;
    if (c.requireFlag && !(p.flags && p.flags[c.requireFlag])) return false;
    if (c.excludeFlag && (p.flags && p.flags[c.excludeFlag])) return false;
    return true;
  }
GameEngine.prototype.applyEventEffects = function(event) {
    if (event && event.id) {
      this.state.player.seenEvents = this.state.player.seenEvents || [];
      if (!this.state.player.seenEvents.includes(event.id)) this.state.player.seenEvents.push(event.id);
      this.recordEventVisit(event.id);
    }
    // 派系清算：曾站队的领导调走/倒台 → 风险
    if (event && (event.id === 'e022' || event.id === 'e028') && this.state.player.flags.faction_lean) {
      this.state.player.flags.faction_leaned_out = true;
      this.state.player.flags.faction_leaned_out_since = this.state.player.age; // v2.66 补 _since（原直写导致 RIGID_CHAINS delay=1 退化为 0）
      this.state.hidden.positionWeight = Math.max(0, this.state.hidden.positionWeight - 5);
      this.state.hidden.mentalPressure += 6;
      this.state.player.reputation = Math.max(0, this.state.player.reputation - 3);
      this.state.player.careerLog.push({ year: this.state.player.age, event: '⚠️ 靠山倒了，你被划入"前朝旧部"，日子开始难过' });
    }
    this.applyEffects(event.effects || {});
    if (event.terminal) { this.state.player.deathReason = event.terminal; if (event.terminal === 'death') this.state.player.ending = 'burnout'; if (event.terminal === 'arrest') this.state.player.ending = 'arrest'; }
    this.clampAttrs();
  }
// v2.66 刚性链 next 事件白名单：只由 RIGID_CHAINS 注入触发（从随机池排除，防 delay 被绕过/死链）
const RIGID_NEXT_SET = new Set(['ent233', 'ent234', 'ent235', 'ent245', 'ent246', 'ent247', 'e646', 'e648', 'e647', 'e043', 'e654', 'e655', 'e656', 'e657', 'ent066', 'ent254', 'ent258', 'ent259', 'ent260', 'ent261', 'ent262', 'ent263',
  // P3 剧本专属事件链：002/003 只由链注入触发，防随机池提前抽取破坏阶段节奏
  'scn_grassroots_002', 'scn_grassroots_003', 'scn_midcareer_002', 'scn_midcareer_003', 'scn_clean_002', 'scn_clean_003', 'scn_network_002', 'scn_network_003', 'scn_reform_002', 'scn_reform_003', 'scn_retired_002', 'scn_retired_003', 'scn_family_002', 'scn_family_003',
  // v2.1.43 事件链系统：反腐链与基层链 next 事件只由 RIGID_CHAINS 注入
  'e802', 'e803', 'e804', 'e806', 'e807', 'e808',
  // v2.1.68 缺口补充：赡养链 / 理财暴雷链 / 借调链 next 节点只由 RIGID_CHAINS 注入
  'ent294', 'ent295', 'ent297', 'ent298', 'ent300', 'ent301']);

// 生命周期旧标题门槛的唯一兼容实现。
// 结构化字段是主规则，只有历史事件尚未迁移时才使用这里的标题兜底；
// 诊断和实际事件池必须共用，避免出现“后台可见、游戏抽不到”的解释漂移。
GameEngine.prototype.getLegacyEventBlockReason = function(event, player) {
    const e = event || {};
    const p = player || (this.state && this.state.player) || {};
    const title = e.title || '';
    const age = Number(p.age) || 22;
    const flags = p.flags || {};
    if ((title === '相亲风云' || title === '相亲初印象' || title === '相亲') && (p.isMarried || age > 45)) return '已婚或超过相亲年龄窗口';
    if (['恋爱初遇', '感情升温', '见家长', '求婚', '求婚（钻戒预算）', '上门见家长', '被求婚', '结婚'].includes(title) && p.isMarried) return '当前已婚，不符合感情事件条件';
    if (title === '恋爱初遇' && age > 45) return '已超过恋爱初遇年龄窗口';
    if (title === '考编上岸' && p.isEmployed) return '已经参加工作，不能重复触发上岸事件';
    if (['二胎抉择', '子女择校', '孩子升学', '孩子升学（小升初）', '孩子叛逆'].includes(title) && !p.hasChildren) return '需要已有子女';
    if (['婚姻危机', '婚姻危机（修复契机）'].includes(title) && !p.isMarried) return '需要已婚状态';
    if (title === '退休返聘' && age < (p.gender === '女' ? 53 : 58)) return '尚未达到退休返聘年龄';
    if (title === '退休规划' && age < (p.gender === '女' ? 42 : 47)) return '尚未达到退休规划年龄';
    const birthTitles = ['生子', '喜得贵子', '喜得麟儿', '有孕在身'];
    if (birthTitles.includes(title) && (!p.isMarried || p.hasChildren)) return '婚姻、子女或生育条件不满足';
    if (birthTitles.includes(title) && age > 40) return '已超过生育年龄窗口';
    if (title === '入党申请' && (p.political === 'cpc' || flags.appliedParty)) return '已经申请或具备党员身份';
    if (title === '推荐入党' && p.political === 'cpc') return '已经是党员';
    if (['入党申请', '推荐入党', '预备党员转正'].includes(title) && flags.expelledFromParty) return '已被开除党籍，不能继续入党流程';
    if (title === '预备党员转正' && p.political === 'cpc') return '已经是正式党员';
    if (title === '预备党员转正' && !flags.appliedParty) return '尚未完成入党申请';
    return '';
};

// 诊断必须复用真实随机池过滤和动态权重，避免“诊断说可触发、实际池里没有”的偏差。
GameEngine.prototype.getEventPoolSnapshot = function() {
    const previous = this._captureEventPool;
    this._captureEventPool = true;
    try { return this.generateEvent(true) || []; }
    finally { this._captureEventPool = previous; }
};

// 事件可见性诊断只读现有状态，不参与 generateEvent 的实际抽取。
// 运营侧需要知道“没有资格”还是“资格满足但被大池稀释”，因此这里保留结构化原因，
// 避免继续用事件 ID 特判去猜低触发率原因。
GameEngine.prototype.getEventVisibilityDiagnostics = function(refs) {
    const allEvents = (typeof GameData !== 'undefined' && Array.isArray(GameData.events)) ? GameData.events.filter(Boolean) : [];
    const eventById = new Map();
    allEvents.forEach(event => {
      if (event && event.id && !eventById.has(event.id)) eventById.set(event.id, event);
    });
    const p = (this.state && this.state.player) || {};
    const hidden = (this.state && this.state.hidden) || {};
    const attrs = (this.state && this.state.attrs) || {};
    const flags = p.flags || {};
    const contacts = Array.isArray(p.contacts) ? p.contacts : [];
    const seen = new Set(Array.isArray(p.seenEvents) ? p.seenEvents : []);
    const requestedIds = refs === undefined || refs === null
      ? allEvents.map(event => event.id).filter(Boolean)
      : (Array.isArray(refs) ? refs : [refs]).map(id => String(id)).filter(Boolean);
    const requestedSet = new Set(requestedIds);
    const age = Number(p.age) || 22;
    const unitLevel = Number(p.unitLevel) || 0;
    const unit = p.unit || null;
    const unitLevelNames = ['乡镇/街道', '县级', '市级', '省级', '中央'];
    const currentLevel = unitLevelNames[unitLevel] || '';
    const currentSystem = unit && unit.system ? unit.system : '';
    const currentUnitName = unit && unit.name ? String(unit.name) : '';
    const scenarioId = (this.state && this.state.scenarioId) || 'classic';
    const eraId = (this.state && this.state.era) || 'stable';
    const poolEvents = typeof this.getEventPoolSnapshot === 'function' ? this.getEventPoolSnapshot() : [];
    const poolById = new Map(poolEvents.filter(event => event && event.id).map(event => [event.id, event]));
    const reasonCodeByGate = {
      employment: 'EMPLOYMENT', era: 'ERA', scenario: 'SCENARIO', requireFlag: 'REQUIRE_FLAG', requireFlags: 'REQUIRE_FLAG', excludeFlag: 'EXCLUDE_FLAG', excludeFlags: 'EXCLUDE_FLAG',
      reputation: 'REPUTATION', yearsWorked: 'WORK_YEARS', ageWindow: 'YEAR_WINDOW', legacyTitleGate: 'TITLE_GATE',
      contact: 'CONTACT', contactRelation: 'CONTACT_RELATION', contactArchetype: 'CONTACT_ARCHETYPE', contactStatus: 'CONTACT_STATUS', contactTrust: 'CONTACT_TRUST',
      requireChild: 'CHILD', requireNoChild: 'NO_CHILD', requireMarried: 'MARRIED', requireSingle: 'SINGLE', requireGender: 'GENDER', requireTalent: 'TALENT', excludeTalent: 'EXCLUDE_TALENT', requireBackground: 'BACKGROUND', requirePolitical: 'POLITICAL', requireUnitSystem: 'UNIT_SYSTEM',
      requireMentalPressure: 'MENTAL_PRESSURE', requireRisk: 'RISK', requireHeat: 'HEAT', requireBody: 'BODY', requireAppearance: 'APPEARANCE', requireFamily: 'FAMILY', requireLuck: 'LUCK', requirePositionWeight: 'POSITION_WEIGHT', requireWealth: 'WEALTH', requireDebt: 'DEBT', minBackground: 'BACKGROUND', maxBackground: 'BACKGROUND', requireUnitLevelMin: 'UNIT_LEVEL', requireRankMin: 'RANK', requireBodyMax: 'BODY_MAX', requireChildAgeMax: 'CHILD_AGE', requireRankMax: 'RANK_MAX', requireUnitLevelMax: 'UNIT_LEVEL_MAX', maxWealth: 'WEALTH_MAX', maxReputation: 'REPUTATION_MAX', requireChildAgeMin: 'CHILD_AGE', requirePeopleReputationMax: 'PEOPLE_REPUTATION', requireHeatOrRisk: 'HEAT_OR_RISK', pool: 'UNIT_POOL'
    };
    const codesForGates = gates => gates.filter(gate => !gate.passed).map(gate => reasonCodeByGate[gate.key] || String(gate.key || 'GATE').toUpperCase());

    const contactMatches = (contact, ref) => contact && (contact.id === ref || contact.uid === ref || contact.legacyId === ref);
    const hasContact = (event) => event.requireContact
      ? contacts.some(contact => contactMatches(contact, event.requireContact))
      : true;
    const hasContactArchetype = (event) => event.requireContactArchetype
      ? contacts.some(contact => contact.archetype === event.requireContactArchetype || (contact.roles || []).includes(event.requireContactArchetype))
      : true;
    const hasContactStatus = (event) => event.requireContactStatus
      ? contacts.some(contact => contact.status === event.requireContactStatus)
      : true;
    const hasContactTrust = (event) => event.requireContactMinTrust === undefined
      ? true
      : contacts.some(contact => Number(contact.trust) >= Number(event.requireContactMinTrust));
    const debt = () => {
      try { return typeof this.debtTotal === 'function' ? Number(this.debtTotal()) || 0 : 0; } catch (e) { return 0; }
    };
    const addGate = (gates, key, passed, message) => {
      gates.push({ key, passed: !!passed, message });
      return !!passed;
    };
    const titleBlocked = (event) => this.getLegacyEventBlockReason(event, p);

    const diagnose = (event, includeReasons) => {
      const reasons = [];
      const gates = [];
      const fail = (key, message) => {
        addGate(gates, key, false, message);
        reasons.push(message);
      };
      const pass = (key, message) => addGate(gates, key, true, message);
      if (!event || !event.id) {
        return { id: event && event.id || null, title: event && event.title || '', status: 'ineligible', reasons: ['事件定义不存在或缺少稳定 ID'], reasonCodes: ['INVALID_EVENT'], eligibleShare: 0, weight: { base: 0, effective: 0, totalEligible: 0, share: 0 }, gates };
      }
      if (seen.has(event.id)) {
        addGate(gates, 'seen', false, '本局已经触发过该事件');
        return { id: event.id, title: event.title || event.id, contentTier: event.contentTier || null, status: 'seen', reasons: ['本局已经触发过该事件，重复触发已被事件池排除'], reasonCodes: ['SEEN'], eligibleShare: 0, weight: { base: Number(event.weight) || 1, effective: 0, totalEligible: 0, share: 0 }, gates };
      }
      pass('seen', '本局尚未触发');
      if (event.stage === 'work' && !p.isEmployed) fail('employment', '需要已参加工作');
      else if (event.stage === 'work') pass('employment', '已参加工作');
      if (event.era && !event.era.includes(eraId)) fail('era', '当前时代不在事件适用范围');
      else if (event.era) pass('era', '时代条件满足');
      if (event.scenario) {
        const scenarioIds = Array.isArray(event.scenario) ? event.scenario : [event.scenario];
        if (!scenarioIds.includes(scenarioId)) fail('scenario', '当前剧本不在事件适用范围');
        else pass('scenario', '剧本条件满足');
      }
      if (event.requireFlag && !flags[event.requireFlag]) fail('requireFlag', '缺少前置标记：' + event.requireFlag);
      else if (event.requireFlag) pass('requireFlag', '前置标记已满足');
      if (Array.isArray(event.requireFlags) && event.requireFlags.length) {
        const missingFlags = event.requireFlags.filter(flag => !flags[flag]);
        if (missingFlags.length) fail('requireFlags', '缺少前置标记：' + missingFlags.join('、'));
        else pass('requireFlags', '复合前置标记已满足');
      }
      if (event.excludeFlag && flags[event.excludeFlag]) fail('excludeFlag', '存在排除标记：' + event.excludeFlag);
      if (Array.isArray(event.excludeFlags) && event.excludeFlags.some(flag => flags[flag])) {
        fail('excludeFlags', '存在排除标记：' + event.excludeFlags.filter(flag => flags[flag]).join('、'));
      }
      if (event.minReputation !== undefined && Number(p.reputation) < Number(event.minReputation)) fail('reputation', '声誉低于要求值');
      if (event.maxReputation !== undefined && Number(p.reputation) > Number(event.maxReputation)) fail('reputation', '声誉高于事件允许上限');
      if (event.minYear !== undefined && Number(p.yearsWorked) < Number(event.minYear)) fail('yearsWorked', '工作年限不足');
      if (Array.isArray(event.year) && event.year.length === 2) {
        const minAge = event.year[0] < 22 ? 22 : event.year[0];
        const passed = age >= minAge && age <= event.year[1];
        if (!passed) fail('ageWindow', `年龄 ${age} 岁不在事件窗口 ${minAge}-${event.year[1]} 岁内`);
        else pass('ageWindow', `年龄在事件窗口 ${minAge}-${event.year[1]} 岁内`);
      } else {
        pass('ageWindow', '事件未设置硬性年龄窗口，按当前人生阶段参与抽取');
      }
      const titleReason = titleBlocked(event);
      if (titleReason) fail('legacyTitleGate', titleReason);
      if (event.requireContact && !hasContact(event)) fail('contact', '缺少指定联系人：' + event.requireContact);
      else if (event.requireContact) pass('contact', '指定联系人已建立');
      if ((event.requireContactMin !== undefined || event.requireContactMax !== undefined)) {
        const contact = event.requireContact ? contacts.find(item => contactMatches(item, event.requireContact)) : contacts.find(item => item.archetype === event.requireContactArchetype || (item.roles || []).includes(event.requireContactArchetype));
        const relation = contact ? Number(contact.relation) || 0 : 0;
        if (event.requireContactMin !== undefined && relation < Number(event.requireContactMin)) fail('contactRelation', '联系人关系值不足');
        if (event.requireContactMax !== undefined && relation > Number(event.requireContactMax)) fail('contactRelation', '联系人关系值超过事件允许上限');
        if (event.requireContactMin === undefined || relation >= Number(event.requireContactMin)) pass('contactRelation', '联系人关系值满足');
      }
      if (!hasContactArchetype(event)) fail('contactArchetype', '缺少指定类型联系人：' + event.requireContactArchetype);
      if (!hasContactStatus(event)) fail('contactStatus', '缺少指定状态联系人：' + event.requireContactStatus);
      if (!hasContactTrust(event)) fail('contactTrust', '没有达到最低信任值的联系人');
      const boolGates = [
        ['requireChild', !!p.hasChildren, '需要已有子女'],
        ['requireNoChild', !p.hasChildren, '需要尚未有子女'],
        ['requireMarried', !!p.isMarried, '需要已婚状态'],
        ['requireSingle', !p.isMarried, '需要单身状态'],
        ['requireGender', !event.requireGender || p.gender === event.requireGender, '性别条件不满足'],
        ['requireTalent', !event.requireTalent || (p.talents || []).includes(event.requireTalent), '缺少指定天赋'],
        ['excludeTalent', !event.excludeTalent || !(p.talents || []).includes(event.excludeTalent), '拥有排除天赋'],
        ['requireBackground', !event.requireBackground || (p.background && p.background.id === event.requireBackground), '出身条件不满足'],
        ['requirePolitical', event.requirePolitical === undefined || p.political === event.requirePolitical, '政治面貌条件不满足'],
        ['requireUnitSystem', !event.requireUnitSystem || currentSystem === event.requireUnitSystem, '单位系统条件不满足']
      ];
      boolGates.forEach(([key, passed, message]) => {
        if (event[key] !== undefined && !passed) fail(key, message);
        else if (event[key] !== undefined) pass(key, '条件满足');
      });
      const numericGates = [
        ['requireMentalPressure', hidden.mentalPressure, '心理压力不足'],
        ['requireRisk', hidden.risk, '风险值不足'],
        ['requireHeat', p.heat, '热度不足'],
        ['requireBody', attrs.body, '体魄不足'],
        ['requireAppearance', attrs.appearance, '外貌属性不足'],
        ['requireFamily', attrs.family, '家境属性不足'],
        ['requireLuck', attrs.luck, '运气属性不足'],
        ['requirePositionWeight', hidden.positionWeight, '职务权重不足'],
        ['requireWealth', p.wealth, '财富不足'],
        ['requireDebt', debt(), '负债未达到事件门槛'],
        ['minBackground', hidden.background, '背景资源不足'],
        ['requireUnitLevelMin', unitLevel, '单位层级不足'],
        ['requireRankMin', p.leadershipRank, '职级不足']
      ];
      numericGates.forEach(([key, value, message]) => {
        if (event[key] !== undefined && Number(value) < Number(event[key])) fail(key, message + '（需要 ' + event[key] + '）');
        else if (event[key] !== undefined) pass(key, '数值门槛满足');
      });
      const maxGates = [
        ['requireBodyMax', attrs.body, '体魄高于事件上限'],
        ['requireChildAgeMax', p.childAge, '子女年龄超过事件上限'],
        ['requireRankMax', p.leadershipRank, '职级高于事件上限'],
        ['requireUnitLevelMax', unitLevel, '单位层级高于事件上限'],
        ['maxBackground', hidden.background, '背景资源高于事件上限'],
        ['maxWealth', p.wealth, '财富高于事件上限'],
        ['maxReputation', p.reputation, '声誉高于事件上限']
      ];
      maxGates.forEach(([key, value, message]) => {
        if (event[key] !== undefined && Number(value) > Number(event[key])) fail(key, message + '（上限 ' + event[key] + '）');
        else if (event[key] !== undefined) pass(key, '上限条件满足');
      });
      if (event.requireChildAgeMin !== undefined) {
        if (Number(p.childAge) < Number(event.requireChildAgeMin)) fail('requireChildAgeMin', '子女年龄未达到事件门槛');
        else pass('requireChildAgeMin', '子女年龄条件满足');
      }
      if (event.requirePeopleReputationMax !== undefined && Number(p.peopleReputation || 50) > Number(event.requirePeopleReputationMax)) fail('requirePeopleReputationMax', '群众口碑高于事件上限');
      if (event.requireHeatOrRisk !== undefined && Number(p.heat) < Number(event.requireHeatOrRisk) && Number(hidden.risk) < Number(event.requireHeatOrRisk)) fail('requireHeatOrRisk', '热度和风险均未达到事件门槛');
      if (event.pools && event.pools.length > 0) {
        const hasPublic = event.pools.includes('public');
        const hasLevel = event.pools.includes(currentLevel);
        const hasSystem = event.pools.includes(currentSystem);
        let hasName = event.pools.some(pool => currentUnitName.includes(pool));
        if (!hasName && /(税务|财政|审计|统计|发改|国资委)/.test(currentUnitName)) hasName = event.pools.includes('政府部门');
        if (!hasPublic && !hasLevel && !hasSystem && !hasName) fail('pool', '当前单位不在事件池范围');
        else pass('pool', '单位或公共事件池条件满足');
      }
      const inPool = poolById.has(event.id);
      if (!inPool && !reasons.length) reasons.push(RIGID_NEXT_SET.has(event.id) ? '刚性链后续事件只由链条注入，不进入随机事件池' : '当前事件未进入随机事件池');
      const reasonCodes = codesForGates(gates);
      if (!inPool && RIGID_NEXT_SET.has(event.id) && !reasonCodes.includes('RIGID_CHAIN')) reasonCodes.push('RIGID_CHAIN');
      if (!inPool && !reasonCodes.length) reasonCodes.push('RANDOM_POOL_EXCLUDED');
      const status = inPool ? 'eligible' : 'ineligible';
      return { id: event.id, title: event.title || event.id, contentTier: event.contentTier || null, status, reasons, reasonCodes, eligibleShare: 0, weight: { base: Number(event.weight) || 1, effective: inPool ? Number(poolById.get(event.id).weight) || 0 : 0, totalEligible: 0, share: 0 }, gates };
    };
    const eligibleEvents = poolEvents.filter(event => event && event.id);
    const totalEligibleWeight = eligibleEvents.reduce((sum, event) => sum + Math.max(0, Number(event.weight) || 0), 0);
    const selectedEvents = requestedIds.map(id => {
      const event = eventById.get(id);
      const row = event ? diagnose(event, true) : diagnose(null, true);
      const pooled = event && poolById.get(event.id);
      if (event && pooled && row.status !== 'seen') {
        const effective = Math.max(0, Number(pooled.weight) || 0);
        const share = totalEligibleWeight > 0 ? effective / totalEligibleWeight : 0;
        const lowWeight = share < 0.02;
        row.status = lowWeight ? 'low_weight' : 'eligible';
        row.contentTier = event.contentTier || null;
        row.eligibleShare = Number(share.toFixed(6));
        row.weight = { base: Number(event.weight) || 1, effective, totalEligible: totalEligibleWeight, share: Number(share.toFixed(6)) };
        row.reasonCodes = lowWeight ? ['LOW_WEIGHT'] : [];
        row.reasons = lowWeight
          ? ['当前年龄、单位、剧本和前置条件均满足，但事件池权重占比约 ' + (share * 100).toFixed(2) + '%，属于低权重候选']
          : ['当前资格满足，事件会按动态权重参与抽取'];
      }
      return row;
    });
    const summary = { requested: selectedEvents.length, eligible: 0, lowWeight: 0, seen: 0, ineligible: 0, poolEligible: eligibleEvents.length, poolWeight: totalEligibleWeight };
    selectedEvents.forEach(row => {
      if (row.status === 'eligible') summary.eligible++;
      else if (row.status === 'low_weight') summary.lowWeight++;
      else if (row.status === 'seen') summary.seen++;
      else summary.ineligible++;
    });
    return { generatedAt: Date.now(), query: { ids: Array.from(requestedSet) }, summary, events: selectedEvents };
};

GameEngine.prototype.generateEvent = function(force) {
    // force=true 时跳过平静概率门（连续两年平静后第三年强制触发事件）
    // v2.27 体验：平静概率 0.55→0.50（事件密度 +12%，剧情更连贯，避免"年年无事"的空窗感）
    if (!force && this.randf() > 0.50) return null;
    const p = this.state.player;
    if (!p || !GameData || !GameData.events) return null;
    // v2.59 性能：跨局 codex 解析移出过滤循环（原每事件一次 JSON.parse×1201/年）
    // v2.73 性能：同一局内复用解析结果；reset/load/import 时清空，避免跨局使用旧图鉴数据。
    let codexCache = this._codexEventCache;
    if (!codexCache) {
      codexCache = {};
      try { const _c = JSON.parse(localStorage.getItem('gameCodex') || '{"events":{}}'); codexCache = (_c.events || {}); } catch(e2) { codexCache = {}; }
      this._codexEventCache = codexCache;
    }
    const seenSet = new Set(p.seenEvents || []); // v2.67 性能：Set 索引
    // v2.71 性能：事件池双桶缓存（GameData 构建后不变，缓存安全）——未就业期（考试年）滤掉 work 事件，过滤量 1272→~500
    if (!this._poolCache) {
      const _all = (GameData.events || []).filter(Boolean);
      this._poolCache = { all: _all, noWork: _all.filter(_e => _e.stage !== 'work') };
    }
    let events = (p.isEmployed ? this._poolCache.all : this._poolCache.noWork).filter(e => {
      if (!e) return false;
      // v2.67 性能：seenEvents 数组→Set 索引（年度全量过滤由 O(n×m) 降 O(n)——长局后期 seenEvents 数百项时提速最明显）
      // ⚠️ DEPRECATED 兜底链（v2.1.8 B4）：以下 title 硬编码过滤仅作结构化字段（requireSingle/requireMarried/requireChild/requireNoChild/year）的兜底；
      // 清单内事件已全部携带结构化门槛（validate_data TITLE_GATE_LIST 强制），新增同名事件必须同步补门槛，勿依赖此链
      if (e.id && seenSet.has(e.id)) return false;
      if (e.stage === 'work' && !p.isEmployed) return false;
      if (this.getLegacyEventBlockReason(e, p)) return false;
      // 连锁事件：检查flags
      if (e.requireFlag && !p.flags[e.requireFlag]) return false;
      if (Array.isArray(e.requireFlags) && e.requireFlags.some(flag => !p.flags[flag])) return false;
      if (e.excludeFlag && p.flags[e.excludeFlag]) return false;
      if (Array.isArray(e.excludeFlags) && e.excludeFlags.some(flag => p.flags[flag])) return false;
      // v2.19 时代剧本：时代专属事件只在本时代出现
      if (e.era && !e.era.includes(this.state.era)) return false;
      // 特殊剧本事件只对对应剧本开放；经典模式不会混入剧本专属内容。
      if (e.scenario) {
        const scenarioIds = Array.isArray(e.scenario) ? e.scenario : [e.scenario];
        if (!scenarioIds.includes(this.state.scenarioId || 'classic')) return false;
      }
      // 声誉条件
      if (e.minReputation !== undefined && p.reputation < e.minReputation) return false;
      if (e.maxReputation !== undefined && p.reputation > e.maxReputation) return false;
      // 工作年限条件
      if (e.minYear !== undefined && p.yearsWorked < e.minYear) return false;
      // v2.66 修复：year [a,b] 字段（年龄窗口）此前完全未消费——ent197-263 约 70 处人生阶段窗口全部失效（60 岁仍酒驾/70 岁首次体检异常）
      // v2.67 下界宽容：year[0] < 22 视为无下界（游戏 22 岁起步，63 处窗口下界 1-5 实为"无下界"语义，无需改数据）
      if (Array.isArray(e.year) && e.year.length === 2 && (p.age < (e.year[0] < 22 ? 22 : e.year[0]) || p.age > e.year[1])) return false;
      // v2.66 修复：刚性链 next 事件从随机池排除（只由 RIGID_CHAINS 注入触发）——原实现可被随机池抢先抽取 seen，链等待期（delay）被绕过、保留 flag 的选项造成死链
      if (e.id && RIGID_NEXT_SET.has(e.id)) return false;
      // 联系人条件
      if (e.requireContact && !p.contacts.some(c => c.id === e.requireContact || c.uid === e.requireContact || c.legacyId === e.requireContact)) return false;
      // v2.20 人际网络：联系人关系值门槛（requireContactMin/Max，配合 requireContact 使用）
      if (e.requireContactMin !== undefined || e.requireContactMax !== undefined) {
        const rc = e.requireContact ? p.contacts.find(c => c.id === e.requireContact || c.uid === e.requireContact || c.legacyId === e.requireContact) : (e.requireContactArchetype ? p.contacts.find(c => c.archetype === e.requireContactArchetype || (c.roles || []).includes(e.requireContactArchetype)) : null);
        const rv = rc ? (rc.relation || 0) : 0;
        if (e.requireContactMin !== undefined && rv < e.requireContactMin) return false;
        if (e.requireContactMax !== undefined && rv > e.requireContactMax) return false;
      }
      if (e.requireContactArchetype && !p.contacts.some(c => c.archetype === e.requireContactArchetype || (c.roles || []).includes(e.requireContactArchetype))) return false;
      if (e.requireContactStatus && !p.contacts.some(c => c.status === e.requireContactStatus)) return false;
      if (e.requireContactMinTrust !== undefined && !p.contacts.some(c => c.trust >= e.requireContactMinTrust)) return false;
      if (e.requireChild && !p.hasChildren) return false;
      // v2.1.8 B4：requireNoChild 无孩门槛（生子类事件结构化——原靠 title 硬编码 !p.hasChildren 过滤）
      if (e.requireNoChild && p.hasChildren) return false;
      // v2.22 家庭剧情线：子女年龄门槛（requireChildAgeMin，配合 requireChild 使用）
      if (e.requireChildAgeMin !== undefined) {
        const ca = (typeof p.childAge === 'number') ? p.childAge : 0;
        if (ca < e.requireChildAgeMin) return false;
      }
      // v2.67 修复：requireChildAgeMax 死键——ent106「青春期的孩子」此前无上界，孩子 25 岁仍触发"进入青春期"
      if (e.requireChildAgeMax !== undefined) {
        const ca2 = (typeof p.childAge === 'number') ? p.childAge : 0;
        if (ca2 > e.requireChildAgeMax) return false;
      }
      if (e.requireMarried && !p.isMarried) return false;
      // v2.58 单身门槛：恋爱/相亲主题事件不对已婚角色触发
      if (e.requireSingle && p.isMarried) return false;
      // 性别条件：男性/女性视角事件只对对应性别角色触发
      if (e.requireGender && p.gender !== e.requireGender) return false;
      // 心理压力条件
      if (e.requireMentalPressure !== undefined && this.state.hidden.mentalPressure < e.requireMentalPressure) return false;
      if (e.requireRisk !== undefined && this.state.hidden.risk < e.requireRisk) return false;
      if (e.requireHeat !== undefined && this.state.player.heat < e.requireHeat) return false;
      // 调查链：热度或风险任一达标即触发（风险累积玩家也会遭遇调查）
      if (e.requireHeatOrRisk !== undefined && this.state.player.heat < e.requireHeatOrRisk && this.state.hidden.risk < e.requireHeatOrRisk) return false;
      if (e.requireBody !== undefined && this.state.attrs.body < e.requireBody) return false;
      if (e.requireBodyMax !== undefined && this.state.attrs.body > e.requireBodyMax) return false;
      // v2.59 实现民间口碑上限条件（原 requirePeopleReputationMax 被事件引用但引擎未实现，导致 e197 等口碑反噬事件无门槛触发）
      if (e.requirePeopleReputationMax !== undefined && (this.state.player.peopleReputation || 50) > e.requirePeopleReputationMax) return false;
      // 属性门槛：外貌（第一印象类事件）/家境（家庭资源类）/运气（机遇类）/职级权重（实权岗位类）
      if (e.requireAppearance !== undefined && this.state.attrs.appearance < e.requireAppearance) return false;
      if (e.requireFamily !== undefined && this.state.attrs.family < e.requireFamily) return false;
      if (e.requireLuck !== undefined && this.state.attrs.luck < e.requireLuck) return false;
      if (e.requirePositionWeight !== undefined && this.state.hidden.positionWeight < e.requirePositionWeight) return false;
      // 天赋条件
      if (e.requireTalent && !p.talents.includes(e.requireTalent)) return false;
      if (e.excludeTalent && p.talents.includes(e.excludeTalent)) return false;
      // 背景条件
      if (e.requireBackground && (!p.background || p.background.id !== e.requireBackground)) return false;
      // 背景数值条件：低档（拖累）/平衡区（枢纽）/高档（红利）事件按背景区间过滤
      if (e.minBackground !== undefined && this.state.hidden.background < e.minBackground) return false;
      if (e.maxBackground !== undefined && this.state.hidden.background > e.maxBackground) return false;
      // 单位级别条件
      if (e.requireUnitLevelMin !== undefined && p.unitLevel < e.requireUnitLevelMin) return false;
      if (e.requireUnitLevelMax !== undefined && p.unitLevel > e.requireUnitLevelMax) return false;
      // 职级条件（如中央遴选须厅级）
      if (e.requireRankMin !== undefined && p.leadershipRank < e.requireRankMin) return false;
      if (e.requireRankMax !== undefined && p.leadershipRank > e.requireRankMax) return false;
      // 政治面貌条件
      if (e.requirePolitical !== undefined && p.political !== e.requirePolitical) return false;
      // 财富条件（经济决策事件）
      if (e.requireWealth !== undefined && (p.wealth || 0) < e.requireWealth) return false;
      // v2.1.5 H2 债务事件门槛：负债达到一定金额才触发（债务重组/救急类）
      if (e.requireDebt !== undefined && this.debtTotal() < e.requireDebt) return false;
      // 贫困/负债条件：财富高于上限的事件（如债务催收）不触发
      if (e.maxWealth !== undefined && (p.wealth || 0) > e.maxWealth) return false;
      if (e.requireUnitSystem && (!p.unit || p.unit.system !== e.requireUnitSystem)) return false;
      // 事件池过滤：根据单位级别和系统匹配
      if (e.pools && e.pools.length > 0) {
        const unitLevelNames = ['乡镇/街道', '县级', '市级', '省级', '中央'];
        const currentLevel = unitLevelNames[p.unitLevel] || '';
        const currentSystem = p.unit ? p.unit.system : '';
        // 公共池事件总是可用，其他池需要匹配
        const hasPublic = e.pools.includes('public');
        const hasLevel = e.pools.includes(currentLevel);
        const hasSystem = e.pools.includes(currentSystem);
        // 单位名称关键词匹配：如"卫健"命中"省卫健委/市卫健委"（解决死池名）
        const unitName = p.unit ? p.unit.name : '';
        let hasName = e.pools.some(pool => unitName.includes(pool));
        // v2.1.6 行业别名：税务/财政/审计/统计/发改类单位（垂管/政府系统）命中「政府部门」池——
        // 原税务局无任何专属池命中（名称不含卫健/医保等关键词），财税类事件（预算/督查/资金）对税务局不可见
        if (!hasName && /(税务|财政|审计|统计|发改|国资委)/.test(unitName)) {
          hasName = e.pools.includes('政府部门');
        }
        if (!hasPublic && !hasLevel && !hasSystem && !hasName) return false;
      }
      return true;
    });
    if (events.length === 0) return null;
    // 动态权重倍增：根据玩家 flag 提升相关链事件触发概率
    const activeScenario = this.getScenario ? this.getScenario() : null;
    const eraEff = this.getEra() ? this.getEra().effects : null;
    const flags = p.flags || {};
    const hasCorrupt = this.hasCorruptFlag(flags);
    const currentDebt = this.debtTotal();
    const talentById = this._talentById || (this._talentById = new Map((GameData.talents || []).map(t => [t.id, t])));
    events = events.map(e => {
      let w = e.weight || 1;
      const f = flags;
      // 工作/生活比例控制：确保工作业务事件占比≥70%
      // work×1.35 提升，life×0.75 压缩（池内77/23 → 触发约82/18，结合平静年更偏工作）
      // v2.1.46 career 加权 ×1.2：career 占目录 9.7%，无加成时触发占比仅 5-8%，系统性低于内容占比；
      // ×1.2 为 work 占比护栏（≥70% 目标）与 career 可见性的折中（分层报告 tests/tools/balance_report.js 实测）
      if (e.stage === 'work') w *= 1.35;
      else if (e.stage === 'life') w *= 0.75;
      else if (e.stage === 'career') w *= 1.2;
      // v2.19 时代剧本权重：专属事件×2；改革年代业务繁忙（work 事件+10%）
      if (eraEff) {
        if (e.era && e.era.includes(this.state.era)) w *= (eraEff.eraWeightMult || 2);
        if (this.state.era === 'reform' && e.stage === 'work' && eraEff.workWeightMult) w *= eraEff.workWeightMult;
      }
      if (activeScenario) {
        if (e.scenario) w *= (activeScenario.eventWeightMult || 1);
        if (activeScenario.workWeightMult && e.stage === 'work') w *= activeScenario.workWeightMult;
        if (activeScenario.poolBoosts && e.pools && activeScenario.poolBoosts.some(pool => e.pools.includes(pool))) w *= 1.6;
      }
      // v2.21 声望双轨：民间口碑高者更容易遇到群众事件（口碑≥60 时群众事件权重×1.5）
      if (e.effects && e.effects.peopleReputation !== undefined && (p.peopleReputation || 50) >= 60) w *= 1.5;
      // ===== 运气联动（v2.1）：高运气玩家更容易刷出稀有/好运事件 =====
      // 1. 好运事件：按运气属性 + 天赋 luckEvents 加成加权
      if (e.luckEvent) {
        const luckAttr = this.state.attrs.luck || 0;
        // 天赋加成：lucky_star +2.0 / gods_mark +1.5
        let luckMult = 1 + Math.max(0, luckAttr) * 0.35;
        (p.talents || []).forEach(tid => {
          const t = talentById.get(tid);
          if (t && t.luckEvents) luckMult *= t.luckEvents;
        });
        w *= luckMult;
      }
      // 2. 稀有链事件（requireFlag）受运气加成：运气越高越容易触发稀有剧情
      if (e.requireFlag && (this.state.attrs.luck || 0) > 0) {
        w *= (1 + Math.max(0, this.state.attrs.luck) * 0.06); // v2.23 平衡：幸运事件权重斜率 0.1→0.06（削弱「幸运→更多幸运事件→更多资源」滚雪球）
      }
      // ===== 属性共鸣加权（v2.4）：运气/家境/外貌相关事件按玩家属性动态加权，让高属性玩家常遇专属剧情 =====
      // 属性只在事件里"路过一次"的体验太弱，共鸣加权保证属性达标后相关剧情持续出现（校准：门槛4→3）
      if (e.effects || e.choices || e.requireLuck || e.requireFamily || e.requireAppearance) {
        for (const ak of ['luck', 'family', 'appearance']) {
          const av = this.state.attrs[ak] || 0;
          if (av >= 3) {
            const reqKey = 'require' + ak.charAt(0).toUpperCase() + ak.slice(1);
            const hasAttr = (e.effects && e.effects[ak] !== undefined) ||
              (e.choices && e.choices.some(cc => cc.effects && cc.effects[ak] !== undefined)) ||
              e[reqKey] !== undefined;
            if (hasAttr) { w *= (1 + av * 0.1); break; }
          }
        }
      }
      // 跨局频率调节：未触发过的事件权重提升，频繁触发的事件权重下降（v2.59 解析已移出循环）
      {
        const times = codexCache[e.id] || 0;
        if (times === 0) w *= 1.8;
        else if (times >= 5) w *= 0.6;
        else if (times >= 3) w *= 0.8;
      }
      // 单位性格加权：单位所在系统的事件池概率提升（气味提示）
      if (p.unit && e.pools && e.pools.length > 0 && !e.pools.includes('public')) {
        const sys = p.unit.system;
        if (e.pools.includes(sys)) w *= 1.6;
      }
      // ===== 专属路线结局前置链加权（v2.4.1）：让"主动走路线"的玩家能遇到对应事件 =====
      // 数字先驱链：技术/数据部门玩家更容易遇到"数字赋能"（e402）
      // v2.49b：e402 pools 含『政府部门』（30 个单位）但 ×3 只对技术/数据生效——政府玩家 200 局 0 次触发，数字先驱结局/成就实际不可达；加权扩到三系统
      if (e.id === 'e402' && p.unit && (p.unit.system === '技术部门' || p.unit.system === '数据部门' || p.unit.system === '政府部门' || p.unit.system === '民生部门')) w *= 3;
      // 改革先锋链：40 岁以下年轻干部更容易遇到"改革建议"（e420）
      if (e.id === 'e420' && p.age < 40) w *= 3;
      // v2.1.6 改革链可达性：e420 是通用结局链起点（所有单位可达），但 200 局仅 8 次触发（4%）——
      // 未触发过时 ×10 追加引导（合计 ×30，与 career 深化链同级）；e421 报道在 flag 已设时 ×5 追加（叠加 requireFlag ×10）
      if (e.id === 'e420' && !f.reformProposal && !p.flags.reformCount) w *= 5;
      if (e.id === 'e421' && f.reformProposal) w *= 5;
      // v2.1.6 改革链补全：e621（重大改革起草）pools 含中央/省级/市级但无加权，市级玩家 100 局 0 触发——
      // reformCount≥2 的 reform_pioneer 结局对市级玩家不可达；未触发过时 ×10（与 e420 同级引导）
      if (e.id === 'e621' && !f.reformDraft) w *= 20;
      if (e.id === 'e622' && f.reformDraft) w *= 5;
      // v2.1.5 债务救急可见性：e289/e290/e682 为负债玩家专属救急事件（requireDebt 50-100），
      // 但无加权在 1300+ 事件池中抽取率仅 0.04%（5000 次各 2 次）——负债玩家遇不到救急，债务绞肉机无出口；
      // 负债达标时 ×15（e289 展期/e290 年终奖救急/e682 银行展期，后两者额外叠加 requireContact/requireDebt 过滤）
      if (e.id === 'e289' && currentDebt >= 100) w *= 15;
      if (e.id === 'e290' && currentDebt >= 50) w *= 15;
      if (e.id === 'e682' && currentDebt >= 80) w *= 15;
      // 出身专属事件加权：本出身的玩家更容易遇到出身故事（寒门亲戚/权贵联姻/老同学局/父母的心意/家里的生意）
      if (e.requireBackground && p.background && p.background.id === e.requireBackground) w *= 20;
      if (f.tookBribe && e.requireFlag && ['tookBribe','tookKickback','tookShares'].includes(e.requireFlag)) w *= 2;
      if (f.tookBribe && (e.id === 'e616' || e.id === 'e617' || e.id === 'e618')) w *= 2;
      if (f.refusedBribe && e.requireFlag === 'refusedBribe') w *= 3;
      // 入党链加权：非党员玩家更容易遇到入党机会（防止生涯遇不到入党导致晋升/结局卡死）
      // 预备党员更容易触发转正；党员更容易参与党员活动
      if (p.political !== 'cpc' && (e.id === 'e042' || e.id === 'e260')) w *= 8;
      if (f.appliedParty && e.id === 'e043') w *= 6;
      if (p.political === 'cpc' && e.id === 'e261') w *= 2;
      // 腐败诱惑可见性：未受贿且未拒绝过的玩家更容易遇到诱惑事件（坏路线也有内容）
      // v2.44 双通道：普通玩家 ×1.8（此前 ×1.4，刷出率偏低）；已收过好处者 ×2.5（拿过一次更容易被拉下水）
      // v2.49b：×1.8 → ×3——诱惑对『从未涉足者』更频繁（300 局 refusedBribe 仅 3.2%，清廉链 e075-e077 与清廉丰碑结局几乎玩不到；诱惑常在、考验常在才符合现实）
      if (!f.tookBribe && !f.refusedBribe && (e.id === 'e051' || e.id === 'e071' || e.id === 'e185' || e.id === 'e187' || e.id === 'e188' || e.id === 'e191' || e.id === 'e194' || e.id === 'e375' || e.id === 'e439')) w *= 3;
      else if ((f.tookBribe || f.tookKickback || f.tookShares) && (e.id === 'e051' || e.id === 'e185' || e.id === 'e187' || e.id === 'e188' || e.id === 'e191' || e.id === 'e194' || e.id === 'e375' || e.id === 'e439')) w *= 2.5;
      // ===== 财务压力+热度→腐败闭环（v2.4）：钱少负债、热度高都会提升腐败事件概率 =====
      // 财务紧张度：财富低于 20 即开始紧张（20-wealth），负债越深紧张度越高 → ×1.72 ~ ×4.6
      // 热度因子：热度 25 起显著 → ×1.7 ~ ×3.8；两者叠加封顶 ×6（防止垄断事件池破坏体验）
      if (EVENT_TEMPTATION_IDS.has(e.id)) {
        const finStress = Math.max(0, 20 - (p.wealth || 0));
        const debtF = 1 + Math.min(4, finStress / 25) * 0.9;
        const heatF = 1 + Math.min(4, (p.heat || 0) / 25) * 0.7;
        w *= Math.min(6, debtF * heatF);
      }
      // ===== 泥足深陷（v2.4.2）：只要腐败过一次，所有腐败诱惑事件概率显著提升（沾上就洗不掉） =====
      // 注：受贿后不再享受"未涉足可见性"×1.4，此处 ×4 保证相对干净玩家净提升约 2.9 倍
      if (hasCorrupt && EVENT_TEMPTATION_IDS.has(e.id)) {
        w *= 4;
      }
      // ===== 热度/风险→对抗事件（v2.4）：热度越高越容易被盯上，调查/纪委剧情更密集 =====
      // 乘数 = min(6, heat因子 × risk因子) → 仅热度60:×2.6 / 仅风险60:×2 / 双高:×6 封顶
      // 腐败玩家额外 ×3（做过的事会被翻出来，对抗及时跟进）
      if (['e237','e241','e242','e243','e246','e760'].includes(e.id)) {
        const heatF2 = 1 + Math.min(4, (p.heat || 0) / 30) * 0.8;
        const riskF2 = 1 + Math.min(4, (this.state.hidden.risk || 0) / 30) * 0.5;
        w *= Math.min(6, heatF2 * riskF2);
        if (hasCorrupt) w *= 3;
      }
      if (f.fairCompetitor && e.requireFlag === 'fairCompetitor') w *= 2;
      if (f.dirtyCompetitor && e.requireFlag === 'dirtyCompetitor') w *= 2;
      if (f.tookMentorOffer && e.requireFlag === 'tookMentorOffer') w *= 2;
      if (f.appliedParty && e.requireFlag === 'appliedParty') w *= 2;
      if (f.grassrootsActive && e.pools && e.pools.some(function(p) { return ['乡镇','街道','基层单位'].includes(p); })) w *= 2;
      if (p.isMarried && e.requireMarried) w *= 2;
      // 已婚未育：生子/怀孕事件高概率触发（人生重要节点，生育窗口25-40岁）
      if (p.isMarried && !p.hasChildren && p.age <= 40 && (e.id === 'e085' || e.id === 'e288' || e.id === 'e666')) w *= 14;
      // 未婚适龄：恋爱初遇/相亲高概率触发（感情线开端，22-40岁核心窗口）
      if (!p.isMarried && p.age >= 22 && p.age < 40 && (e.id === 'e629' || e.id === 'e254' || e.id === 'e284')) w *= 5;
      // 未婚大龄（40-45）：恋爱机会仍保留但稍低
      if (!p.isMarried && p.age >= 40 && p.age <= 45 && (e.id === 'e629' || e.id === 'e254' || e.id === 'e284')) w *= 2;
      // 恋爱中玩家：结婚事件（恋爱→结婚衔接）——v2.1.6 修复：原 ×8 使 e084 抢先抽中绕过求婚链（e255/e664），
      // 恋爱中求婚链优先（e255/e664 ×8/×12），e084 保持基础权重作兜底入口（非恋爱场景仍可结婚）
      if (!p.isMarried && (f.dating || f.engaged) && e.id === 'e084') w *= 1.2;
      // 恋爱中玩家：见家长/求婚高概率触发（婚姻渐进链）
      if (!p.isMarried && f.dating && (e.id === 'e630' || e.id === 'e631' || e.id === 'e255' || e.id === 'e664' || e.id === 'e665')) w *= 8;
      if (!p.isMarried && f.engaged && (e.id === 'e255' || e.id === 'e664')) w *= 12;

      if (p.hasChildren && (e.requireChild || e.title === '子女择校' || e.title === '孩子升学' || e.title === '孩子升学（小升初）' || e.title === '二胎抉择')) w *= 2;
      // 家庭事件强化：已婚/有子女玩家高概率触发家庭生活事件（育儿/婚姻/亲子）
      if (p.isMarried && (e.id === 'e287' || e.id === 'e637' || e.title === '婚姻危机' || e.title === '婚姻危机（修复契机）' || e.title === '家庭生活')) w *= 8;
      if (p.hasChildren && p.age <= 50 && (e.id === 'e285' || e.id === 'e286' || e.id === 'e632' || e.id === 'e635' || e.id === 'e064' || e.id === 'e008' || e.id === 'e434' || e.id === 'e636' || e.title === '育儿焦虑' || e.title === '家长会' || e.title === '孩子入学' || e.title === '亲子时光' || e.title === '孩子叛逆' || e.title === '子女择校' || e.title === '孩子升学' || e.title === '孩子升学（小升初）' || e.title === '二胎抉择' || e.title === '教育心得')) w *= 8;
      // v2.1.6 青春期可见性：ent106（12-17 岁窗口仅 5 年）与 ent105 升学同窗口竞争被压制（5000 次 9 vs 90）——
      // 青春期是重要人生阶段，childAge 12-17 时 ×12 追加引导
      if (p.hasChildren && typeof p.childAge === 'number' && p.childAge >= 12 && p.childAge <= 17 && e.id === 'ent106') w *= 12;
      // v2.1.6 子女成年期可见性：ent112 孩子独立（18+ 无 flag 无加权）与 ent108 高考/ent115 人生路口（w 8/10）竞争被压制——
      // 独立是人生必历节点，childAge 18+ 时 ×8 引导（与高考/路口同级）
      if (p.hasChildren && typeof p.childAge === 'number' && p.childAge >= 18 && p.childAge < 22 && e.id === 'ent112') w *= 8;
      // v2.1.6 成年节点可见性：ent115 孩子的人生路口（18+ w10 无加权）与 ent112 独立竞争被压制——
      // 人生路口是 18+ 标志性抉择事件，childAge 18-22 时 ×6 追加（略低于 ent112 的 ×8，保持独立稍优先）
      if (p.hasChildren && typeof p.childAge === 'number' && p.childAge >= 18 && p.childAge < 22 && e.id === 'ent115') w *= 6;
      // v2.1.6 作风线可见性：酒驾/收礼/公车主题事件（v2.65 特色内容，weight 3-6 无加权）
      // 100 局仅 1-2 次触发、6/12 零触发——×6 引导到偶尔可见（作风考验是体制特色剧情）
      if (e.id && ['ent253','ent254','ent255','ent256','ent013','ent151','enc054','enc057','enc062','enl036','e219','enw014'].includes(e.id)) w *= 6;
      // v2.1.8 中后期挑战可见性：e765-e770（45-62 岁窗口，weight 3-4 无加权）——
      // 300 局仅 0-11 次触发、3 个零触发——退休前是人生重要阶段（站岗/审计/人情/冲刺/舆情），45 岁后 ×8 引导
      if (p.age >= 45 && e.id && ['e771','e772','e773','e774','e775','e776'].includes(e.id)) w *= 8;
      // 有子女且家有余财：子女教育投入事件高概率触发
      if (p.hasChildren && (p.wealth || 0) > 80 && e.id === 'e652') w *= 8;
      // 背景档位事件：处于对应背景区间时显著加权（区间外已被过滤；低档拖累适度、平衡稳定、高档>70 强化覆盖）
      if (e.minBackground !== undefined || e.maxBackground !== undefined) {
        w *= (e.minBackground >= 71 ? 10 : e.minBackground >= 40 ? 6 : e.maxBackground !== undefined ? 4 : 6);
      }
      // 枢纽链强衔接：上一节 flag 达成后，下一节高概率衔接（防止长链断裂）
      if (f.hub_bridge && e.id === 'e728') w *= 25;
      if (f.hub_mediator && e.id === 'e729') w *= 25;
      if (f.hub_recommend && (e.id === 'e730' || e.id === 'e731')) w *= 25;
      if (e.requireFlag && f[e.requireFlag]) w *= 10;
      // v2.1.10 联系人事件可见性：requireContact 事件（高关系解锁的深度互动）在 1400+ 事件池中无加权被稀释——
      // 维持关系的正反馈（送礼/维护的回报）被随机性吞掉；关系达标时 ×6 引导（与背景事件同级，略低于链衔接）
      if (e.requireContact) w *= 6;
      // v2.1.32 人脉随机化：随机联系人不一定拥有固定 legacy id，按角色/状态触发的事件也要能被看见。
      // 只提高已经满足门槛的候选，不改变未满足条件的事件池，也不绕过关系值、信任和回避限制。
      if (e.requireContactArchetype) w *= 4;
      if (e.requireContactStatus) w *= 3;
      if (e.requireContactMinTrust !== undefined && !e.requireContact) w *= 2;
      // 中央选拔链：省级+党员+厅级时 e639 考察事件高概率触发（×120：资格玩家几乎必遇，全随机中央结局率 2~3%）
      // v2.43 廉政挂钩：腐败（风险≥40）或被开除党籍者，中央遴选机会骤降（×0.1）
      // v2.49 D6：×0.1 后权重 12 仍高于普通事件基准——降为 ×0.05（=6），腐败者中央捷径基本关闭
      if (p.unitLevel === 3 && e.id === 'e639') {
        w *= 120;
        if (p.flags.expelledFromParty || this.state.hidden.risk >= 40) w *= 0.05;
      }
      if (f.centralCandidate && e.id === 'e640') w *= 20;
      if (p.unitLevel === 4 && e.id === 'e641') w *= 8;
      // 返聘老年线：rehired 玩家必体验老年事件
      if (f.rehired && (e.id === 'e642' || e.id === 'e643' || e.id === 'e644')) w *= 25;
      if (f.author && e.id === 'e645') w *= 25;
      // 多步骤专案链：逐步推进（衔接强化：×20 防止链断裂）
      if (e.id === 'e653' && p.yearsWorked >= 3) w *= 4;
      if (f.proj_step1 && e.id === 'e654') w *= 20;
      if (f.proj_step2 && e.id === 'e655') w *= 20;
      if (f.proj_step3 && e.id === 'e656') w *= 20;
      if (f.proj_done && e.id === 'e657') w *= 20;
      // v2.1.6 特色人物可达性：未结识该人物的玩家，创建点事件权重 ×8（人物链一次性引导）——
      // 此前 e680（banker）/e684（exBoss）/e291（boss）/e294（petitioner）/e297（neighborHead）
      // 权重 3-4 在 1319 事件池中单局期望仅 0.03 次，60 局 0 触发，新人物链玩家几乎遇不到
      if (e.id === 'e680' && !p.contacts.some(c => c.id === 'banker')) w *= 8;
      if (e.id === 'e684' && !p.contacts.some(c => c.id === 'exBoss')) w *= 8;
      if (e.id === 'e291' && !p.contacts.some(c => c.id === 'boss')) w *= 8;
      if (e.id === 'e294' && !p.contacts.some(c => c.id === 'petitioner')) w *= 8;
      if (e.id === 'e297' && !p.contacts.some(c => c.id === 'neighborHead')) w *= 8;
      // v2.1.6 career 深化 12 事件可达性：e688-e699 已有 requireRankMin 过滤，
      // 但权重 3-5 在 1300+ 事件池中仍难被抽中（50 局仅 2 次触发）——职级场景里程碑 ×30 强引导
      // v2.1.46 注：里程碑波维持 ×30 独享；其余 career 事件走下方两条叠加引导（职级达标 ×6 + 本系统池 ×3）
      if (e.id && /^e(688|689|690|691|692|693|694|695|696|697|698|699)$/.test(e.id)) {
        w *= 30;
      } else if (e.stage === 'career') {
        // 仕途场景通用可见性：career 事件带职级门槛且玩家达标时 ×6 引导——
        // v2.1.7 e700-e720 扩充波与 enc 中后期挑战（enc091-098）此前无任何加权：资格率 20-30% 却在
        // 2400 局分层模拟中全段零触发（含 ×8 年龄加成的 e771-e776 退休挑战波）——达标即引导，对齐 everyday×6 档位
        if (e.requireRankMin !== undefined && p.leadershipRank >= e.requireRankMin) w *= 6;
        // 部门特色可达性：career 系统池事件对本系统干部 ×3 引导——政法/垂管等专属事件
        // （e709-e714）只有对应系统的玩家能触发，不加权时在其唯一受众里也只有 ~0.7%/局，部门特色形同虚设
        if (e.pools && e.pools.length > 0 && e.pools.includes(p.unit && p.unit.system)) w *= 3;
      }
      // v2.62 人物线创建点可达性：ent211（室友）/ent236（表姐）为 life 事件（×0.75 压缩），
      // 80 局随机流 0 触发——未结识时 ×12 引导（ent208 司长权重 8 已可触发，不加）
      if (e.id === 'ent211' && !p.contacts.some(c => c.id === 'roommate')) w *= 12;
      if (e.id === 'ent236' && !p.contacts.some(c => c.id === 'cousin')) w *= 12;
      // 趣味/低权重事件可见性：weight 3-4、public 池、无门槛的事件不能长期埋在 1500+ 事件池里。
      // 历史名单保留 ×3 兼容补偿；新增日常内容统一使用 contentTier，避免继续堆叠事件 ID 特判。
      if (e.id && ['e161','e168','e169','e170','e174','e175','e101','e130','e131','e132','e134','e135','e138','e141','e164','e166','e364','enl044','enl083','enl089','enl097'].includes(e.id)) w *= 3;
      // 结构化内容层级：日常生活片段需要稳定露出，但不应为某三个事件继续堆叠 ID 特判。
      // 只对已满足资格、且明确标记为 everyday 的事件加权，不绕过年龄、单位或前置条件。
      if (e.contentTier === 'everyday') w *= 6;
      return { ...e, weight: w };
    });
    if (this._captureEventPool) return events.map(event => ({ ...event }));
    return this.weightedPick(events);
  }
GameEngine.prototype.arrestOrEscape = function(p, doArrest) {
    // 被抓前的"最后机会"：首次触发被抓判定时，38% 概率进入逃脱事件（e761），此后不再给第二次机会
    // v2.19 整顿年代：法网更密，逃脱概率×0.6
    const eraEff = this.getEra() ? this.getEra().effects : null;
    // 诚实答辩者（promotionHonest）更易自证清白：逃脱判定概率 +0.15
    const honestBonus = (p.flags && p.flags.promotionHonest) ? 0.15 : 0;
    const escChance = (0.38 + honestBonus) * (eraEff && eraEff.escapeChanceMult ? eraEff.escapeChanceMult : 1);
    if (!p.flags.arrestChanceUsed && !this.state.currentEvent && this.randf() < escChance) {
      p.flags.arrestChanceUsed = true;
      const esc = GameData.events.find(x => x.id === 'e761');
      if (esc) { this.state.currentEvent = { ...esc }; return true; }
    }
    doArrest();
    return false;
  }
GameEngine.prototype.settleEventOrEscape = function(event) {
    // v2.7.1 抓捕事件最后机会：terminal=arrest 的事件（东窗事发/挪用败露/被抓等）先走逃脱判定，
    // 60% 概率转入 e761「最后的挣扎」（花关系/花钱/销毁证据逃生），避免无条件入狱；逃脱过的不再给第二次机会
    if (event && event.terminal === 'arrest') {
      const p = this.state.player;
      this.state.currentEvent = null;
      if (this.arrestOrEscape(p, () => { p.deathReason = 'arrest'; p.ending = 'arrest'; })) {
        p.careerLog.push({ year: p.age, event: '⚠️ 风声骤紧：危险正在逼近，你必须马上做出选择……' });
        return true; // e761 已设为 currentEvent，交给 UI/模拟器处理
      }
    }
    return false;
  }
GameEngine.prototype.checkEndings = function() {
    const p = this.state.player; const h = this.state.hidden;
    if (p.ending) return;
    if (p.deathReason && !p.ending) { if (p.deathReason === 'arrest') p.ending = 'arrest'; if (p.deathReason === 'death') p.ending = 'burnout'; return; }
    // 调查热度决定被抓概率（阈值提高，降低被抓率）
    // 注意：曾经逃脱过（escapedOnce）的玩家不再有第二次逃脱机会，直接抓
    const alreadyEscaped = p.flags && p.flags.escapedOnce;
    // 诚实答辩者（promotionHonest，晋升答辩选「实事求是」）组织印象良好：被调查/被拖入风险事件的概率减半
    const honestMult = (p.flags && p.flags.promotionHonest) ? 0.5 : 1;
    // v2.42 风险-收益再平衡：高危风险直接触发调查抓捕（不再要求廉洁<30 硬门槛——做了高风险行为就担高风险后果）
    // v2.59 修复：risk 分支不再 return 截断——未触发抓人时继续走热度兜底与退休检查（原 heat>90 兜底对 risk≥70 玩家永远不执行，且退休检查被跳过）
    if (h.risk >= 90) {
      if (alreadyEscaped) { p.deathReason = 'arrest'; p.ending = 'arrest'; return; }
      if (this.randf() < 0.25 * honestMult) { if (this.arrestOrEscape(p, () => { p.deathReason = 'arrest'; p.ending = 'arrest'; })) return; }
    }
    // 中高风险：10% 概率被调查（v2.42 不再要求调查热度——风险行为本身就是暴露源）
    if (h.risk >= 70) {
      if (alreadyEscaped) { p.deathReason = 'arrest'; p.ending = 'arrest'; return; }
      if (this.randf() < 0.10 * honestMult) { if (this.arrestOrEscape(p, () => { p.deathReason = 'arrest'; p.ending = 'arrest'; })) return; }
    }
    // 极高调查热度兜底（无论廉洁高低，名声太响也易出事）
    if (p.heat > 90) {
      if (alreadyEscaped) { p.deathReason = 'arrest'; p.ending = 'arrest'; return; }
      if (this.randf() < 0.2 * honestMult) { if (this.arrestOrEscape(p, () => { p.deathReason = 'arrest'; p.ending = 'arrest'; })) return; }
    }
    // 压力+欲望+家庭压力共同影响燃尽
    if (h.mentalPressure >= 85 && (this.state.attrs.body <= 2 || h.familyPressure > 55)) { p.deathReason = 'death'; p.ending = 'burnout'; return; }
    if (h.mentalPressure >= 90) { p.deathReason = 'death'; p.ending = 'burnout'; return; }
    if (h.mentalPressure >= 70 && h.familyPressure >= 60) { p.deathReason = 'death'; p.ending = 'burnout'; return; }
    // 退休窗口：当年至 +2 年，每年 45% 概率触发返聘选择（v2.49：原严格限定退休当年、失败即永久失去返聘剧情，放宽为窗口内可重掷；窗口内未触发不结算退休，最后一年强制结束窗口正常退休）
    const baseRetireAge = (p.gender === '女' ? 55 : 60);
    if (p.age >= baseRetireAge && p.age <= baseRetireAge + 2 && !p.flags.retireAsked) {
      const ret = GameData.events.find(x => x.id === 'e110');
      if (ret && !p.seenEvents.includes('e110') && this.randf() < 0.45) {
        p.flags.retireAsked = true;
        this.state.currentEvent = { ...ret };
        return;
      }
      // 窗口内未触发（或 e110 已看过/数据缺失）：未到窗口最后一年则不结算退休，留出重掷机会；最后一年强制结束窗口并落入下方正常退休结算
      if (p.age === baseRetireAge + 2) p.flags.retireAsked = true;
      else return;
    }
    if (p.age >= (p.retireAgeExt || (p.gender === '女' ? 55 : 60))) { p.ending = this.determineEnding(); return; }
  }
GameEngine.prototype.determineEnding = function() {
    const h = this.state.hidden; const p = this.state.player;
    const unitLevel = p.unitLevel || 0;
    // 返聘后退休年龄顺延
    const retireAge = (p.retireAgeExt || (p.gender === '女' ? 55 : 60));
    if (p.age >= retireAge && p.flags.retireAsked && (p.gender === '女' ? 55 : 60) < p.age) {
      // 返聘期满，最终结算
    }
    // 燃尽前置检查：高压 + 长期 + 身体差
    if (h.mentalPressure >= 85 && p.yearsWorked > 20) return 'edge';
    // 中央隐藏结局：必须在中央单位（unitLevel===4）+ 副部级(9级)以上+低风险+CPC（优先于巅峰，防止巅峰截胡中央线）
    // 到达中央的通道：省级+党员+厅级(职级≥6) 通过 e639/e640 中央遴选调任；乡镇/县/市/省级玩家无论职级多高都无法直接判定为中央结局
    if (unitLevel === 4 && p.leadershipRank >= 9 && h.risk < 30 && p.reputation > 70 && p.political === 'cpc') return 'central';
    // ===== v2.4.1 专属路线结局（需走对应事件链并主动选择，避免与事业巅峰线冲突） =====
    // v2.49：专属路线结局整体移至 skyline 之前判定——此前 skyline 批量截胡清廉丰碑/时代先锋/改革先锋等专属结局，
    //        导致『越优秀越拿不到专属结局』（收集全结局需刻意压制晋升）；central 仍保持最优先不受影响
    // v2.24 时代专属结局：与对应时代强绑定（reform 专属「弄潮儿」要求更高职级，避免截胡事件链版改革先锋）
    // 注意 reformCount 由 reformProposal/reformDraft 两个 flag 触发，上限 2（完整改革链 = 建议+方案都落地）
    if (this.state.era === 'reform' && ((p.flags.reformCount || 0) >= 2 || p.flags.reformProposal) && p.leadershipRank >= 6 && p.reputation > 70 && h.workAbility > 55 && h.risk < 50) return 'era_reform';
    // 整顿年代清流：廉洁底线 + 反腐实绩（举报/拒贿/担责任一），激浊扬清
    if (this.state.era === 'rectify' && h.integrity >= 75 && (p.flags.reportedOthers || p.flags.refusedBribe || p.flags.tookResponsibility) && p.leadershipRank >= 5 && p.reputation > 60 && h.risk < 40) return 'era_rectify';
    // 改革先锋：推动改革创新被树为典型（e420 改革建议 → e421 人民日报报道链）
    if (p.flags.reformProposal && p.leadershipRank >= 4 && p.reputation > 65 && h.workAbility > 55 && h.risk < 50) return 'reform';
    // 数字先驱：数字政府建设突破者（e402 数据平台 → e403 全省典型案例链，技术/数据部门专属）
    // v2.1.49 M5.3 项目结局分支：完成「数字政务升级」政策项目（policy_digital_governance_done）成为另一条路——
    // 项目成果兑现需未压过舆情（压制扩散 = 成果打折，policyOpinionSuppressed 阻断项目分支）
    if ((p.flags.dataPlatform || (p.flags.policy_digital_governance_done && !p.flags.policyOpinionSuppressed)) && (p.unit && (p.unit.system === '技术部门' || p.unit.system === '数据部门' || p.unit.system === '政府部门' || p.unit.system === '民生部门')) && p.leadershipRank >= 3 && p.reputation > 60) return 'digital'; // v2.59 纳入政府部门（dataPlatform 由政府部门事件链可得，原 flag 有却无结局消费）
    // 乡土守望：基层历练后留任扎根（grassrootsStay），深耕基层至退休，群众口碑深厚
    // v2.49：乡镇/街道职级上限 3，原条件 rank>=4 使乡镇留任者不可达——放宽为 rank>=3（正科级主政一方即符合叙事）
    if (p.flags.grassrootsStay && unitLevel <= 1 && p.yearsWorked >= 20 && p.reputation > 80 && p.leadershipRank >= 3 && h.risk < 40) return 'grassroots';
    // 清廉丰碑：清廉路线极致（拒绝贿赂链 e051→e075排挤→e076贵人→e077正名），两袖清风（v2.49：逃脱过调查者不得判定）
    if (p.flags.refusedBribe && h.integrity >= 80 && h.risk < 35 && p.reputation > 65 && p.leadershipRank >= 4 && !p.flags.escapedOnce) return 'clean';
    // 巅峰：正厅级以上 + 地市级以上 + 高声誉低风险 + 长期深耕 + 晋升节奏快（中央单位走 central 线，不再判巅峰）
    // v2.7.1 收紧：正常玩家随机玩 45% 达巅峰过于泛滥；加晋升节奏（≥7次）+声誉/能力门槛提升。
    // 放宽至 0.75 后仍在固定种子 500 局中达到 23%，与稀有顶级结局定位不符；本轮收敛为 0.55，目标约 15-20%。
    if (unitLevel !== 4 && p.leadershipRank >= 8 && h.risk < 40 && unitLevel >= 2 && p.reputation > 70 && h.workAbility > 65 && p.yearsWorked > 20 && p.promotions >= 6 && this.randf() < 0.55) return 'skyline';
    // 快速：晋升快+职级高+欲望强（v2.27 平衡迭代：第一轮 4次/欲望8 → 45% 泛滥；收敛为 5次/欲望12，目标 ~15%）
    if (p.leadershipRank >= 5 && p.promotions >= 5 && h.risk < 50 && h.desire > 12 && unitLevel >= 1) return 'fast';
    // ===== v2.1.16 M1.7 新增结局（举报英雄 / 著书立说 / 乡村振兴之星） =====
    // 举报英雄：吹哨人链完整（匿名举报→配合调查→专案外围→举报人保护→风清月明），一身正气+被组织认可
    // 走完 whistleblower→witnessStrong→cleanHero 链的玩家，是反腐战场上的无名功臣
    if (p.flags.cleanHero && h.integrity >= 60 && h.risk < 45 && !this.hasCorruptFlag(p.flags)) return 'whistleblower_hero';
    // 著书立说：把几十年实务经验写成专著（ent063 bookPublished 链），桃李满园——退休后仍有著作传世
    if (p.flags.bookPublished && h.workAbility >= 55 && p.reputation >= 55) return 'author_legacy';
    // 乡村振兴之星：牵头乡村振兴示范村建设（e320 ruralRevitalize → e321 成果），扎根基层带动一方致富
    // 须基层工作 + 振兴实绩 + 群众口碑（防止城市玩家误判）
    // v2.1.49 M5.3 项目结局分支：完成「乡村振兴示范」政策项目（policy_rural_revitalization_done）成为另一条路，同样受舆情压制阻断
    if ((p.flags.ruralRevitalize || (p.flags.policy_rural_revitalization_done && !p.flags.policyOpinionSuppressed)) && unitLevel <= 1 && p.yearsWorked >= 10 && (p.peopleReputation || 50) >= 60) return 'rural_star';
    // ===== v2.25 联系人专属结局（人际网络闭环：贵人提携 / 老友一生 / 邻里桑梓） =====
    const ct = (id, min) => (p.contacts || []).some(c => c.id === id && c.relation >= min);
    // 大树成荫：贵人关系深厚且已至高位——你站在贵人站过的地方
    if (ct('noble', 85) && p.leadershipRank >= 7 && h.risk < 40 && p.reputation > 65) return 'patron_legacy';
    // 莫逆之交：同学关系贯穿一生，平安落地时老友仍在——风浪过后有人一起喝酒
    if (ct('classmate', 80) && h.risk < 30 && p.reputation > 55) return 'lifelong_friend';
    // 桑梓情深：邻里网络扎根基层——街坊的事就是我的事
    if (ct('neighbor', 80) && unitLevel <= 1 && p.yearsWorked >= 20 && p.reputation > 60) return 'hometown_net';
    // ===== v2.8 新增正向结局（5个）=====
    // 基层奉献：扎根乡镇/街道15年以上，廉洁无腐，成为百姓口中的好干部（v2.49：逃脱过调查者不得判定）
    if (unitLevel === 0 && p.yearsWorked >= 15 && h.integrity > 60 && !this.hasCorruptFlag(p.flags) && !p.flags.escapedOnce) return 'grassroots_devotion';
    // 技术骨干：在技术/数据岗位深耕，能力突出，成为单位不可或缺的技术力量
    if (h.workAbility > 85 && this.state.attrs.iq > 8 && p.unit && (p.unit.system === '技术部门' || p.unit.system === '数据部门')) return 'tech_backbone';
    // 群众贴心人：处理群众事件10次以上，情商高、作风正派、民间口碑深厚（v2.21 双轨接入），被群众称为"贴心人"
    // v2.1.49 M5.3 项目结局分支：完成「老旧小区改造」政策项目（policy_old_community_done，解难排忧类实绩）成为另一条路，同样受舆情压制阻断
    if (((p.flags.peopleEventCount || 0) >= 10 || (p.flags.policy_old_community_done && !p.flags.policyOpinionSuppressed)) && this.state.attrs.eq > 8 && h.integrity > 65 && (p.peopleReputation || 50) >= 75) return 'people_champion';
    // 改革先锋（新）：参与2次以上改革事件（reformCount 由 reformProposal/reformDraft 各 +1，单局上限 2），职级权重高，成为推动改革的中坚力量
    // v2.49：原条件 >=3 永不可达（单局上限 2），修正为 >=2
    if ((p.flags.reformCount || 0) >= 2 && h.positionWeight > 15) return 'reform_pioneer';
    // 清官：一生清廉，integrity>80、risk<10、工作20年以上、无任何腐败flag，名垂青史（v2.49：逃脱过调查者不得判定）
    if (h.integrity > 80 && h.risk < 10 && p.yearsWorked >= 20 && !this.hasCorruptFlag(p.flags) && !p.flags.escapedOnce) return 'honest_official';
    // v2.48 双轨悲情结局：群众爱戴但组织不待见（口碑高 + 组织印象低 + 基层）——须在 edge 之前判定
    if ((p.peopleReputation || 50) >= 75 && p.reputation < 40 && unitLevel <= 1) return 'estranged_hero';
    // 边缘化：职级低+工龄长，或大量错过晋升
    if (p.leadershipRank <= 2) return 'edge';
    if (p.leadershipRank <= 3 && p.yearsWorked > 15) return 'edge';
    if (p.missedPromotions >= 8 && p.leadershipRank < 5) return 'edge';
    if (p.leadershipRank <= 3 && p.yearsWorked > 25) return 'edge';
    if (p.yearsWorked > 30 && p.leadershipRank <= 4) return 'edge';
    // 家庭拖累：家庭压力大且职级低 → 被家庭事务拖垮事业
    if (h.familyPressure > 60 && p.leadershipRank <= 4) return 'edge';
    // 安稳：处级以上 + 低风险 + 低家庭压力 + 高声誉（安稳退休是德高望重的归宿）
    if (h.risk < 40 && p.leadershipRank >= 6 && h.familyPressure < 35 && p.reputation > 62) return 'safe';
    // 家庭和睦：家庭压力极低时安稳条件适度放宽（需中层以上+较好声誉）
    if (h.familyPressure < 15 && h.risk < 40 && p.leadershipRank >= 6 && p.reputation > 55) return 'safe';
    // 平凡人生：默认结局
    return 'ordinary';
  }
GameEngine.prototype.getYearEvaluation = function(h, p) {
    const evals = [];
    if (h.workAbility > 60) evals.push('工作能力突出');
    else if (h.workAbility < 20) evals.push('工作能力有待提升');
    if (h.mentalPressure > 70) evals.push('压力较大');
    else if (h.mentalPressure < 20) evals.push('心态良好');
    if (h.risk > 60) evals.push('存在风险隐患');
    else if (h.risk < 20) evals.push('廉洁自律');
    if (h.integrity > 60) evals.push('作风正派');
    if (h.background > 50) evals.push('人脉广泛');
    return evals.length > 0 ? evals.join('，') : '';
  }
