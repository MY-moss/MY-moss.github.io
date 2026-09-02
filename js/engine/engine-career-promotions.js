// 职业晋升与调任模块。
// 依赖：engine-career.js、engine-career-ranks.js、engine-network.js。
// 方法名保持 GameEngine 公开契约不变。

GameEngine.prototype.checkPromotion = function() {
    const p = this.state.player; const h = this.state.hidden;
    if (!p.unit) return;
    if (p.flags && p.flags.grassrootsActive) return;
    const currentRank = p.leadershipRank;
    const maxRank = this.getMaxRankForLevel(p.unit.level);
    
    // 0. 职级已达当前单位上限，无法再晋升，需要跨级
    // v2.69 修正：v2.67 的卡顶分支写在此 return 之后从未执行（死代码）——卡顶处理移到这里：资历累计 + 职级并行（rankTrack 待遇晋升）+ 到顶提示
    if (currentRank >= maxRank) {
      p.missedPromotions++;
      if ((p.rankTrack || 0) < 10 && this.randf() < 0.06) { // v2.69 职级 4%→6%（等待跨级调任期间的安慰奖，被调任截断后均值 0.3 偏低）
        p.rankTrack = (p.rankTrack || 0) + 1;
        h.positionWeight += 2;
        p.careerLog.push({ year: p.age, event: `📈 职级晋升：待遇上调（职级 Lv.${p.rankTrack}，权重+2）` });
      }
      if (p.missedPromotions % 5 === 0) p.careerLog.push({ year: p.age, event: '📌 本单位职级已到顶——想再进一步，得去更高的平台' });
      return;
    }
    
    // 1. 最低年限检查（v2.49f：merit 阶梯——高实绩或答辩优秀者每级减免年限，打破论资排辈；保底 1 年防跳级泛滥）
    let minYears = this.getMinYearsForRank(currentRank);
    if (h.workAbility >= 60 && h.positionWeight >= 18 && minYears > 1) minYears -= 1;
    if ((p.flags.promotionExcellence || 0) >= 2 && minYears > 1) minYears -= 1;
    const yearsAtCurrentRank = Math.max(0, p.yearsWorked - p.promotions);
    if (yearsAtCurrentRank < minYears) return;
    
    // 2. 政治面貌检查
    const needParty = this.getPoliticalReq(currentRank + 1);
    if (needParty === 'cpc' && p.political !== 'cpc') return;
    
    // 3. 年龄限制（动态难度：年龄越大晋升越难）
    const ageLimit = this.getAgeLimit(currentRank);
    const meritAgeFactor = h.workAbility >= 60 ? 0.5 : 1; // v2.49f 高能力（60+）超龄惩罚减半：能力强的老将依然吃香
    const agePenalty = p.age > ageLimit ? Math.min((p.age - ageLimit) * 0.02 * meritAgeFactor, 0.5 * meritAgeFactor) : 0;
    // 晚期游戏难度加成：工龄>20年后晋升更难
    const lateGamePenalty = Math.max(0, (p.yearsWorked - 20) * 0.003);
    
    // 4. 学历加成
    const eduBonus = { bachelor: 0, master: 0.04, doctor: 0.08 }[p.education] || 0;
    
    // 5. 党员加成
    const partyBonus = p.political === 'cpc' ? 0.08 : 0;
    // 声誉加成（声誉越高晋升越快，每点声誉影响0.4%）
    const repBonus = (p.reputation - 50) * 0.004;
    // 欲望加成（欲望越高越愿意争取晋升机会）
    const desireBonus = h.desire * 0.003;
    // 家庭压力惩罚（家庭压力太大影响工作投入）
    const familyPenalty = h.familyPressure * 0.004;
    // 系统亲和度：同系统内晋升更容易
    const systemBonus = p.unit ? this.getSystemAffinity(p.unit.system, p.unit.system) : 0;
    // 人脉加成：改用信任/互惠/可达性/桥接关系的有界模型，不能绕过任职年限、实绩和廉洁条件。
    const networkEffect = this.getPromotionNetworkEffect ? this.getPromotionNetworkEffect() : { supportBonus: 0, informationBonus: 0, conflictPenalty: 0, explanation: [] };
    const contactBonus = networkEffect.supportBonus || 0;
    // 性格加成：进取>圆滑>稳健>耿直（耿直易得罪人，晋升略慢）
    const personalityBonus = { ambitious: 0.03, smooth: 0.015, stable: 0.005, straight: -0.015 }[p.personality] || 0;
    // 专业对口加成：专业与单位匹配度越高，业务表现越突出，晋升概率越高
    const majorFitBonus = Math.min(this.getMajorFit(p.unit).matchCount, 4) * 0.004;
    
    // 6. 功绩计算
    const stagnationBonus = Math.min(p.missedPromotions * 0.15, 2);
    const longServiceBonus = Math.min(p.yearsWorked / 40, 0.5);
    const merit = 
      Math.min(h.workAbility, 50) * 0.06 + 
      Math.min(h.positionWeight, 40) * 0.05 + 
      Math.min(h.background, 50) * 0.04 + 
      Math.min(h.integrity, 50) * 0.02 + 
      this.state.attrs.luck * 0.15 + 
      Math.min(this.state.attrs.eq, 15) * 0.15 + 
      Math.min(this.state.attrs.iq, 15) * 0.25 +
      Math.min(this.state.attrs.family, 12) * 0.25 +
      Math.min(this.state.attrs.body, 10) * 0.10 +
      Math.min(this.state.attrs.appearance, 10) * 0.15 +
      eduBonus * 30 +
      (p.unit ? p.unit.promotionSpace * 0.015 : 0) -
      h.risk * 0.03 - 
      h.mentalPressure * 0.02 -
      p.heat * 0.02 -
      currentRank * 0.12 +
      stagnationBonus +
      longServiceBonus * 5 -
      agePenalty * 15;
    
    let _rawChance = 0.03 + merit / 70 + partyBonus + repBonus + desireBonus + systemBonus + contactBonus + personalityBonus + majorFitBonus - familyPenalty - lateGamePenalty;
    // v2.49f 分层 clamp（merit 敏感年度上限）：merit≥14 起每点 +0.6% 上限（0.22→0.30）——高配玩家晋升力不被抹平，
    // 低配 merit<14 保持 0.22 原值不受影响（区别于 v2.49d 否定的『统一放宽』方案：后者低配后期也受益、区分度反降）
    const chanceCap = Math.min(0.30, 0.22 + Math.max(0, merit - 14) * 0.006);
    let chance = Math.max(0.02, Math.min(chanceCap, _rawChance)); // v2.27 修复：v2.20 贵人加成曾对 const 赋值导致有贵人时晋升崩溃
    // v2.43 廉政挂钩：腐败（风险高）与开除党籍者升迁大幅受阻——风险每 +10 概率 -0.3，开除党籍 ×0.25
    if (this.state.hidden.risk > 0) chance = Math.max(0.02, chance - this.state.hidden.risk * 0.03);
    if (p.flags.expelledFromParty) chance *= 0.25;
    
    // 晋升保底：连续未晋升年数越长，概率越高
    const guaranteeBonus = p.missedPromotions > 25 ? 0.10 : p.missedPromotions > 18 ? 0.06 : p.missedPromotions > 12 ? 0.03 : 0;
    // v2.19 时代晋升修正：改革=快车道×1.15 / 平稳=论资排辈×0.9 / 整顿=廉洁者×1.1、腐败者×0.7
    const era = this.getEra();
    let eraMult = 1;
    if (era) {
      if (era.id === 'reform' || era.id === 'stable') eraMult = era.effects.promoMult;
      else if (era.id === 'rectify') eraMult = this.hasCorruptFlag(p.flags || {}) ? era.effects.corruptPromoPenalty : (h.integrity >= 70 ? era.effects.cleanPromoBonus : 1);
    }
    let finalChance = Math.min(0.25, (chance + guaranteeBonus) * eraMult);
    if (this.state.difficulty === 'hardcore') finalChance *= 0.85; // v2.70 硬核：晋升难度 ×0.85
    // v2.49d 机会通道·考察通过：重点培养者本年度晋升用原始晋升力（突破 0.22 常规上限，一次性）
    if (p.flags.keyTalent) { finalChance = Math.min(0.34, Math.max(0.02, _rawChance + 0.03) * eraMult + guaranteeBonus); delete p.flags.keyTalent; }
    // v2.22 晋升答辩：上一轮答辩策略的余波（v2.49d：充分准备 +2%→+5%、上限 0.25→0.32；敷衍了事 -5%，一次性）
    if (p.flags.promotionPrepared) { finalChance = Math.min(0.32, finalChance + 0.05); delete p.flags.promotionPrepared; }
    if (p.flags.promotionSloppy) { finalChance = Math.max(0.01, finalChance - 0.05); delete p.flags.promotionSloppy; }
    
    // v2.69 卡顶处理已移至函数开头（v2.67 原分支在 early return 后为死代码，已删除）
    if (this.randf() < finalChance) {
      p.leadershipRank++; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += 3; h.mentalPressure += 3; h.risk += 1;
      // v2.27 体验优化：晋升成功仅 60% 进入答辩候选（40% 直接晋升通过）——答辩从"每次晋升的日常"回归"重要时刻"
      if (this.randf() < 0.6) p.flags.promotionCandidate = true;
      const newLabel = this.getRankLabel(p.leadershipRank);
      p.careerLog.push({ year: p.age, event: `晋升为${newLabel}`, special: 'upgrade' });
    } else {
      p.missedPromotions++;
    }
    if (p.leadershipRank > 12) p.leadershipRank = 12;
    // 职级不能超过当前单位上限
    const maxRankAfter = this.getMaxRankForLevel(p.unit ? p.unit.level : '乡镇');
    if (p.leadershipRank > maxRankAfter) p.leadershipRank = maxRankAfter;
    // v2.49d 机会通道·重点培养：高潜力（能力≥55、低风险）玩家 6%/年概率被组织点名考察，获得一次晋升破格资格
    // 触发放在判定末尾——flag 存活到本年事件阶段（可触发 e679 考察谈话）与下一年晋升判定（消费破格），考察期一年语义
    if (h.workAbility >= 55 && h.risk < 30 && !p.flags.keyTalent && this.randf() < 0.06) {
      p.flags.keyTalent = true;
      p.careerLog.push({ year: p.age, event: '🏅 组织把你看作重点培养对象，进入考察期（压力+8）' });
      h.mentalPressure += 8;
    }
  }
GameEngine.prototype.checkBreakthroughPromotions = function() {
    const p = this.state.player; const h = this.state.hidden;
    if (p.flags && p.flags.grassrootsActive) return;
    if (this.state.pendingPromotion || this.state.pendingTransfer) return;

    // 1. 遴选晋升（下级→上级，乡镇→县→市→省，逐级晋升不跳级）
    if (h.workAbility > 45 && p.yearsWorked >= 4 && this.randf() < 0.06) {
      if (h.workAbility * 0.3 + Math.min(this.state.attrs.iq, 15) * 2 + this.rand(0, 20) > 50) {
        const levelOrder = ['乡镇', '县级', '市级', '省级', '中央'];
        const currentLevelIdx = levelOrder.indexOf(p.unit.level);
// 只能遴选到相邻上一级单位（逐级晋升，不可跳级）；中央玩家（indexOf=4）无上一级目标，天然跳过
        const targetLevelName = levelOrder[currentLevelIdx + 1];
        const allTargets = GameData.units.filter(u => {
          return u.level === targetLevelName && !u.noExam && u.level !== '中央';
        });
        // 按系统亲和度排序，随机选取时倾向同系统
        const scored = allTargets.map(u => ({
          unit: u,
          affinity: p.unit ? this.getSystemAffinity(p.unit.system, u.system) : 0
        }));
        // 过滤掉亲和度极低的（跨系统太远），但保留少量概率
        const viable = scored.filter(s => s.affinity >= -0.01 || this.randf() < 0.2);
        if (viable.length > 0) {
          const target = viable[this.rand(0, viable.length - 1)].unit;
          this.state.pendingPromotion = { type: 'selection', levels: 1, source: '遴选考试', targetUnit: target, desc: `通过遴选考试可调任至${target.name}（${target.level}）` };
          return;
        }
      }
    }

    // 2. 破格提拔（越级晋升，但不超过单位上限）——实权岗位（职级权重高）更有破格资格，权重每点+0.03%概率（上限+3%）
    // v2.49d 加入能力 merit：能力每点 +0.0003（能力 50 → +1.5%），精英玩家破格机会更多
    if (p.leadershipRank >= 3 && h.workAbility > 65 && h.risk < 35 && this.randf() < 0.02 + Math.min(h.positionWeight, 100) * 0.0003 + Math.min(h.workAbility, 50) * 0.0003) {
      const maxRank = this.getMaxRankForLevel(p.unit.level);
      const maxPossible = Math.min(2, maxRank - p.leadershipRank);
      if (maxPossible >= 1) {
        const lv = this.rand(1, maxPossible);
        this.state.pendingPromotion = { type: 'special', levels: lv, source: '破格提拔', desc: `破格提拔${lv}级！代价：压力+8，风险+5` };
        return;
      }
    }

    // 3. 公开选拔（竞争上岗更高职位，不超过单位上限）——实权权重同样影响竞争分（实绩=竞争力）
    if (p.leadershipRank >= 2 && h.workAbility > 35 && this.randf() < 0.06) {
      const maxRank = this.getMaxRankForLevel(p.unit.level);
      if (p.leadershipRank < maxRank && h.workAbility * 0.3 + h.background * 0.2 + Math.min(this.state.attrs.eq, 15) * 2 + h.positionWeight * 0.15 + this.rand(0, 30) > 55) {
        this.state.pendingPromotion = { type: 'open', levels: 1, source: '公开选拔', desc: '通过公开选拔晋升1级，风险+2' };
        return;
      }
    }

    // 4. 同级交流（平调到同级别其他单位，不改变职级）
    if (p.unit && p.unit.order !== undefined && p.yearsWorked >= 6 && (!p.flags.lastLateralYear || p.yearsWorked - p.flags.lastLateralYear >= 5) && this.randf() < 0.02) {
      const levelOrder = ['乡镇', '县级', '市级', '省级'];
      const sameLevelUnits = GameData.units.filter(u => u.level === p.unit.level && u.id !== p.unit.id && u.order !== undefined && !u.noExam);
      if (sameLevelUnits.length > 0) {
        // 按系统亲和度加权：同系统优先，跨系统概率低
        const scored = sameLevelUnits.map(u => {
          const affinity = this.getSystemAffinity(p.unit.system, u.system);
          const lvl = p.unit.level;
          const tier = lvl === '省级' ? this.getProvinceTier(u.order) : lvl === '县级' ? this.getCountyTier(u.order) : this.getCityTier(u.order);
          return { unit: u, affinity, order: u.order || 999, tier };
        });
        // 同系统或同组优先，但也有20%概率考虑跨系统
        const sameSystem = scored.filter(s => s.affinity > 0);
        const crossSystem = scored.filter(s => s.affinity <= 0);
        const pool = (sameSystem.length > 0 && this.randf() < 0.7) ? sameSystem : crossSystem;
        if (pool.length > 0) {
          const currentOrder = p.unit.order || 999;
          // 根据单位级别使用对应的层级函数
          const lvl = p.unit.level;
          const tierFn = lvl === '省级' ? 'getProvinceTier' : lvl === '县级' ? 'getCountyTier' : 'getCityTier';
          const currentTier = this[tierFn](currentOrder);
          // 同层级=平调，跨层级=升/降方向
          const sameTier = pool.filter(u => (lvl === '省级' ? this.getProvinceTier(u.order) : lvl === '县级' ? this.getCountyTier(u.order) : this.getCityTier(u.order)) === currentTier);
          const higher = pool.filter(u => (lvl === '省级' ? this.getProvinceTier(u.order) : lvl === '县级' ? this.getCountyTier(u.order) : this.getCityTier(u.order)) < currentTier);
          const lower = pool.filter(u => (lvl === '省级' ? this.getProvinceTier(u.order) : lvl === '县级' ? this.getCountyTier(u.order) : this.getCityTier(u.order)) > currentTier);
          // 50%同层级平调，30%调往更高层级，20%调往更低层级
          // 跨≥2层时概率减半，现实中极少发生
          let targetPool;
          let direction;
          const tierDiff = Math.abs(higher.length > 0 ? (higher[0]?.tier || currentTier) - currentTier : 0);
          const crossTierPenalty = tierDiff >= 2 ? 0.5 : 1.0;
          if (sameTier.length > 0 && this.randf() < 0.5 * crossTierPenalty) {
            targetPool = sameTier;
            direction = '同级平调';
          } else if (higher.length > 0 && this.randf() < (0.3 * crossTierPenalty)) {
            targetPool = higher;
            direction = '更核心部门';
          } else if (lower.length > 0) {
            targetPool = lower;
            direction = '一般部门';
          } else {
            targetPool = pool;
            direction = '平调交流';
          }
          if (targetPool.length > 0) {
            const target = targetPool[this.rand(0, targetPool.length - 1)].unit;
            this.state.pendingTransfer = {
              type: 'lateral',
              targetUnit: target,
              reason: `同级交流至${direction}：${target.name}`,
              effects: '平调后压力+5，原有职级不变',
              tone: direction === '更核心部门' ? 'positive' : direction === '一般部门' ? 'negative' : 'neutral'
            };
            return;
          }
        }
      }
    }
  }
GameEngine.prototype.checkCrossLevelPromotion = function() {
    const p = this.state.player; const h = this.state.hidden;
    if (!p.unit) return;
    
    // 中央晋升：省级→中央（常规通道），条件放宽：省级+厅级(rank>=9)+党员+声誉良好，概率~2.2%（v2.7.1 从2.5%下调后300局实测仅0.33%，回调到2.2%保1-2%）
    // 中央晋升：省级→中央（常规通道），条件放宽：省级+厅级(rank>=9)+党员+声誉良好
    // v2.49f：固定 2.2% → merit 加权（能力每点 +0.04%、声誉每点超 50 +0.02%，上限 5%）——高配中央通道显著更优
    const centralChance = Math.min(0.05, 0.015 + Math.min(h.workAbility, 50) * 0.0004 + (p.reputation > 50 ? (p.reputation - 50) * 0.0002 : 0));
    if (p.leadershipRank >= 9 && p.unitLevel === 3 && h.risk < 40 && p.reputation > 65 && p.political === 'cpc' && p.promotions >= 7 && this.randf() < centralChance) {
      const centralUnits = GameData.units.filter(u => u.level === '中央');
      if (centralUnits.length > 0) {
        this.state.pendingPromotion = {
          type: 'centralLevel', levels: 1, source: '中央调任',
          targetUnit: centralUnits[this.rand(0, centralUnits.length - 1)],
          desc: `调任至中央！进入国家最高权力核心，职级天花板提升至12级`
        };
        return;
      }
    }
    
    if (this.state.pendingPromotion || this.state.pendingTransfer) return;
    if (p.flags && p.flags.grassrootsActive) return;
    
    const currentLevel = p.unitLevel;
    const levelNames = ['乡镇', '县级', '市级', '省级'];
    const targetLevel = currentLevel + 1;
    if (targetLevel > 3) return; // 中央单位不可通过跨级晋升进入，只能走中央调任隐藏路径
    
    const targetLevelName = levelNames[targetLevel];
    const currentRank = p.leadershipRank;
    const maxRank = this.getMaxRankForLevel(p.unit.level);
    
    // 达到职级上限-1即可申请跨级
    if (currentRank < maxRank - 1) return;
    if (h.risk > 50) return;
    // 市级以上非党员也可跨级，但概率减半
    let partyBonus = 0.06;
    if (targetLevel >= 2 && p.political !== 'cpc') partyBonus = 0;
    
    // 跨级概率：同系统加成，跨系统惩罚（v2.49f：加能力 merit，cap 0.08→0.12——高配可突破上限，低配仍 ≤8% 不受影响）
    const rankDiff = Math.max(0, currentRank - (maxRank - 3));
    const systemAffinity = p.unit ? this.getSystemAffinity(p.unit.system, p.unit.system) : 0;
    const chance = Math.min(0.12, 0.03 + rankDiff * 0.02 + h.background * 0.001 + h.positionWeight * 0.001 + Math.min(h.workAbility, 50) * 0.0006 + partyBonus + systemAffinity);
    
    if (this.randf() < chance) {
      // 同系统单位优先，跨系统需要额外判定
      let candidates = GameData.units.filter(u => u.level === targetLevelName && u.system === p.unit.system && !u.noExam);
      if (candidates.length === 0 || this.randf() < 0.15) {
        // 没有同系统单位或15%概率尝试跨系统
        const crossCandidates = GameData.units.filter(u => {
          if (u.level !== targetLevelName) return false;
          if (u.noExam) return false;
          if (u.system === p.unit.system) return false;
          const affinity = this.getSystemAffinity(p.unit.system, u.system);
          return affinity >= 0 || this.randf() < 0.3;
        });
        if (crossCandidates.length > 0) candidates = crossCandidates;
      }
      if (candidates.length > 0) {
        this.state.pendingPromotion = { 
          type: 'crossLevel', levels: 1, source: `跨级晋升至${targetLevelName}级单位`, 
          targetUnit: candidates[this.rand(0, candidates.length - 1)], 
          desc: `晋升至${targetLevelName}级单位，突破职级上限！当前上限${maxRank}→${this.getMaxRankForLevel(targetLevelName)}` 
        };
      }
    }
  }
GameEngine.prototype.acceptPromotion = function() {
    const pp = this.state.pendingPromotion; if (!pp) return;
    const p = this.state.player; const h = this.state.hidden;
    if (pp.type === 'crossLevel' && pp.targetUnit) {
      if (this.setPosting) this.setPosting(pp.targetUnit, '跨级晋升');
      else { p.unit = pp.targetUnit; p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[pp.targetUnit.level] || 0; }
      p.unitUpgrades++;
      p.leadershipRank++; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += 8; h.mentalPressure += 10; h.background += 5;
      p.careerLog.push({ year: p.age, event: `跨级调任至${pp.targetUnit.name}，突破职级上限！`, special: 'upgrade' });
    } else if (pp.type === 'selection' && pp.targetUnit) {
      if (this.setPosting) this.setPosting(pp.targetUnit, '遴选调任');
      else { p.unit = pp.targetUnit; p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[pp.targetUnit.level] || 0; }
      p.leadershipRank++; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += 4; h.mentalPressure += 8; h.background += 3;
      p.careerLog.push({ year: p.age, event: `通过遴选调任至${pp.targetUnit.name}`, special: 'upgrade' });
    } else if (pp.type === 'centralLevel' && pp.targetUnit) {
      if (this.setPosting) this.setPosting(pp.targetUnit, '中央调任');
      else { p.unit = pp.targetUnit; p.unitLevel = 4; }
      p.unitUpgrades++;
      p.leadershipRank++; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += 10; h.mentalPressure += 12; h.background += 8; h.risk += 3;
      p.reputation = Math.min(100, p.reputation + 8);
      p.careerLog.push({ year: p.age, event: `调任至中央！进入${pp.targetUnit.name}，正式踏上最高权力舞台`, special: 'upgrade' });
    } else if (pp.type === 'special') {
      // 破格提拔：按描述兑现代价（压力+8，风险+5）
      p.leadershipRank += pp.levels || 1; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += (pp.levels || 1) * 3; h.mentalPressure += 8; h.risk += 5;
      p.careerLog.push({ year: p.age, event: `接受${pp.source}，职级+${pp.levels || 1}（代价：压力+8，风险+5）`, special: 'upgrade' });
    } else {
      // 公开选拔/一般晋升：风险+2（与描述一致）
      p.leadershipRank += pp.levels || 1; p.leadershipPromotions++; p.promotions++;
      h.positionWeight += (pp.levels || 1) * 3; h.mentalPressure += 3; h.risk += 2;
      p.careerLog.push({ year: p.age, event: `接受${pp.source}，职级+${pp.levels || 1}`, special: 'upgrade' });
    }
    this.state.pendingPromotion = null;
    // 晋升后确保不超过新单位上限
    const maxRankNew = this.getMaxRankForLevel(p.unit ? p.unit.level : '乡镇');
    if (p.leadershipRank > maxRankNew) p.leadershipRank = maxRankNew;
  }
GameEngine.prototype.declinePromotion = function() {
    const pp = this.state.pendingPromotion; if (!pp) return;
    this.state.player.missedPromotions++;
    this.state.pendingPromotion = null;
    this.state.player.careerLog.push({ year: this.state.player.age, event: `放弃${pp.source}机会` });
  }
GameEngine.prototype.checkDemotion = function() {
    const p = this.state.player; const h = this.state.hidden;
    if (this.state.pendingTransfer) return;
    if (p.flags && p.flags.grassrootsActive) return;
    // v2.43 开除党籍后：政治生命终结——每年高概率被边缘化（会议不带、工作分流、权重流失）
    if (p.flags && p.flags.expelledFromParty && this.randf() < 0.5) {
      h.positionWeight = Math.max(0, h.positionWeight - 2);
      p.heat = Math.max(0, p.heat - 5);
      p.careerLog.push({ year: p.age, event: '被边缘化：重要会议不再通知你，核心工作被分流' });
      return;
    }
    
    // v2.42 风险-收益再平衡：risk≥75 即可能被调查降级（原需 integrity<35 && heat≥40 三条件，过于宽松放过了高风险玩家）
    if (h.risk >= 75 && this.randf() < 0.15) {
      const drop = 1;
      p.leadershipRank = Math.max(1, p.leadershipRank - drop);
      h.risk = Math.max(0, h.risk - 15); h.mentalPressure += 10;
      h.positionWeight = Math.max(0, h.positionWeight - drop * 4);
      p.careerLog.push({ year: p.age, event: `因违规被降级至${this.getRankLabel(p.leadershipRank)}`, special: 'demotion' });
      return;
    }
    
    // 上级派人下基层历练：创建确认弹窗，玩家确认后执行（历练期 3-8 年；36 岁后上限 5 年，避免高龄下派虚耗光阴）。
    // 市级、省级岗位可以被安排到乡镇/街道挂职，但必须先进入待确认状态；中央单位另走明确的组织交流路径。
    if (p.age < 40 && p.unitLevel >= 2 && p.unitLevel <= 3 && p.yearsWorked >= 2 && p.yearsWorked < 10 && !p.flags.grassrootsActive && !p.flags.grassrootsDone && this.randf() < 0.25) {
      const grassrootsUnits = GameData.units.filter(u => u.level === '乡镇' || u.level === '街道');
      if (grassrootsUnits.length > 0) {
        const targetUnit = grassrootsUnits[this.rand(0, grassrootsUnits.length - 1)];
        const duration = 3 + this.rand(0, (p.age >= 36 ? 2 : 5));
        this.state.pendingTransfer = {
          type: 'grassrootsConfirm',
          targetUnit: targetUnit,
          duration: duration,
          reason: `组织安排你到${targetUnit.name}基层锻炼，为期${duration}年。这是补齐基层经历、锻炼干部的必要环节。`,
          effects: '基层历练期间压力+8，工作能力+3，体质+2'
        };
        return;
      }
    }
    
    // 边缘化 → 平调（promotionSpace 低 = 晋升空间小 = 边缘/冷门单位；weight 是事件权重，不能用作冷热判定）
    if (p.missedPromotions > 8 && p.leadershipRank < 4 && (!p.flags.lastLateralYear || p.yearsWorked - p.flags.lastLateralYear >= 5) && this.randf() < 0.10) {
      // 只能平调到同级别非中央单位（中央单位不可通过平调进入）
      const coldUnits = GameData.units.filter(u => u.level !== '省级' && u.level !== '中央' && u.level === p.unit.level && u.id !== p.unit.id && (u.promotionSpace || 0) < 50);
      if (coldUnits.length > 0) {
        this.state.pendingTransfer = { 
          type: 'lateral', 
          targetUnit: coldUnits[this.rand(0, coldUnits.length - 1)], 
          reason: '长期未获晋升，组织建议你轮岗交流',
          effects: '平调后压力+5，但可能获得新的发展机会',
          tone: 'negative'
        };
      }
    }

    // 长期被打压 → 被迫降级调任
    if (p.missedPromotions > 12 && p.leadershipRank < 4 && this.randf() < 0.07) {
      const levelOrder = ['乡镇', '县级', '市级', '省级', '中央'];
      const currentLevelIdx = levelOrder.indexOf(p.unit ? p.unit.level : '乡镇');
      if (currentLevelIdx > 0) {
        const lowerLevelName = levelOrder[currentLevelIdx - 1];
        const lowerUnits = GameData.units.filter(u => u.level === lowerLevelName && u.level !== '中央');
        if (lowerUnits.length > 0) {
          this.state.pendingTransfer = {
            type: 'forcedDemotion',
            targetUnit: lowerUnits[this.rand(0, lowerUnits.length - 1)],
            reason: '长期未获晋升，被边缘化后排挤至下级单位',
            effects: '降级调任，职级-1，压力+10，声望-5'
          };
        }
      }
    }

    // ====== 新增降职/挫折事件 ======
    // 政治风波：上级领导更替，受牵连降级（1%概率，rank>=4时）
    if (p.leadershipRank >= 4 && this.randf() < 0.01) {
      p.leadershipRank = Math.max(1, p.leadershipRank - 1);
      h.mentalPressure += 10;
      h.positionWeight = Math.max(0, h.positionWeight - 5);
      p.reputation = Math.max(0, p.reputation - 8);
      p.careerLog.push({ year: p.age, event: `因政治风波被牵连，降级至${this.getRankLabel(p.leadershipRank)}`, special: 'demotion' });
      return;
    }
    
    // 考核不达标：工作能力过低被降级（1.5%概率）
    if (h.workAbility < 25 && p.leadershipRank >= 2 && this.randf() < 0.015) {
      p.leadershipRank = Math.max(1, p.leadershipRank - 1);
      h.mentalPressure += 8;
      h.positionWeight = Math.max(0, h.positionWeight - 3);
      p.missedPromotions = Math.max(0, p.missedPromotions + 3);
      p.careerLog.push({ year: p.age, event: `年度考核不达标，降级至${this.getRankLabel(p.leadershipRank)}`, special: 'demotion' });
      return;
    }
    
    // 舆论压力：热度高且声誉低，上级迫于压力降级（1.5%概率）
    if (p.heat > 50 && p.reputation < 40 && p.leadershipRank >= 3 && this.randf() < 0.015) {
      p.leadershipRank = Math.max(1, p.leadershipRank - 1);
      h.mentalPressure += 12;
      h.positionWeight = Math.max(0, h.positionWeight - 4);
      p.reputation = Math.max(0, p.reputation - 5);
      p.heat = Math.max(0, p.heat - 15);
      p.careerLog.push({ year: p.age, event: `因舆论压力被降级处理，降级至${this.getRankLabel(p.leadershipRank)}`, special: 'demotion' });
      return;
    }
    
    // 中年危机：45岁后晋升停滞，心态崩了直接躺平（2%概率，rank<=5）
    if (p.age >= 45 && p.leadershipRank <= 5 && p.missedPromotions > 5 && this.randf() < 0.02) {
      h.mentalPressure += 15;
      h.desire = Math.max(0, h.desire - 10);
      h.workAbility = Math.max(0, h.workAbility - 5);
      p.reputation = Math.max(0, p.reputation - 3);
      p.careerLog.push({ year: p.age, event: '遭遇中年危机，心态崩塌，工作能力大幅下降', special: 'demotion' });
      return;
    }
  }
// 统一创建临时基层派驻：只有明确接受派驻或事件选项后才切换当前岗位，期满由 grassrootsReturn 回原单位。
GameEngine.prototype.beginGrassrootsAssignment = function(meta) {
    const p = this.state.player;
    const options = meta && typeof meta === 'object' ? meta : {};
    const grassrootsUnits = (GameData.units || []).filter(u => u.level === '乡镇' || u.level === '街道');
    const targetUnit = options.targetUnit || (grassrootsUnits.length ? grassrootsUnits[this.rand(0, grassrootsUnits.length - 1)] : null);
    if (!p || !p.unit) return { ok: false, code: 'ORIGINAL_UNIT_MISSING', message: '缺少原单位，不能创建基层派驻' };
    if (!targetUnit || !['乡镇', '街道'].includes(targetUnit.level)) return { ok: false, code: 'GRASSROOTS_TARGET_INVALID', message: '基层派驻目标必须是乡镇或街道' };
    if (p.flags && p.flags.grassrootsActive) return { ok: false, code: 'GRASSROOTS_ALREADY_ACTIVE', message: '当前已经在基层历练中' };
    const oldUnit = p.unit;
    const oldUnitId = oldUnit.id || null;
    const oldLevel = p.unitLevel;
    const durationValue = Number(options.duration);
    const duration = Number.isFinite(durationValue) ? Math.max(1, Math.min(8, Math.floor(durationValue))) : 3 + this.rand(0, p.age >= 36 ? 2 : 5);
    const moved = this.setPosting ? this.setPosting(targetUnit, options.reason || '下派基层历练') : null;
    if (moved && moved.ok === false) return moved;
    if (!this.setPosting) {
      p.unit = targetUnit;
      p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[targetUnit.level] || 0;
    }
    p.flags.grassrootsActive = true;
    p.flags.grassrootsYears = 0;
    p.flags.grassrootsDuration = duration;
    p.flags.grassrootsOldUnit = oldUnit.name || '原单位';
    p.flags.grassrootsOldUnitId = oldUnitId;
    p.flags.grassrootsOldLevel = oldLevel;
    p.flags.grassrootsBaselineWork = this.state.hidden.workAbility;
    p.flags.grassrootsBaselineRep = p.reputation;
    this.state.hidden.mentalPressure += 8;
    this.state.hidden.workAbility += 3;
    this.state.attrs.body += 2;
    p.careerLog.push({ year: p.age, event: `从${oldUnit.name || '原单位'}下派至${targetUnit.name}基层锻炼，为期${duration}年`, special: 'transfer' });
    return { ok: true, code: 'GRASSROOTS_ASSIGNMENT_STARTED', fromUnit: oldUnit, toUnit: targetUnit, duration };
};

GameEngine.prototype.acceptTransfer = function() {
    const pt = this.state.pendingTransfer; if (!pt) return;
    const p = this.state.player;
    const moveTo = (targetUnit, reason) => {
      if (!targetUnit) return null;
      if (this.setPosting) return this.setPosting(targetUnit, reason);
      p.unit = targetUnit;
      p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[targetUnit.level] || 0;
      return { ok: true };
    };
    if (pt.type === 'grassrootsConfirm' && pt.targetUnit) {
      const started = this.beginGrassrootsAssignment({ targetUnit: pt.targetUnit, duration: pt.duration, reason: '下派基层历练' });
      if (!started.ok) return;
    } else if (pt.type === 'grassrootsForcedStay' && pt.outcome) {
      const p2 = this.state.player;
      p2.flags.grassrootsActive = false;
      p2.flags.grassrootsDone = true;
      delete p2.flags.grassrootsYears;
      delete p2.flags.grassrootsDuration;
      const lvlMap = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 };
      if (pt.outcome === 'lower' && pt.targetUnit) {
        moveTo(pt.targetUnit, '基层历练后留任/下调');
        this.state.hidden.workAbility += 3;
        this.state.hidden.mentalPressure += 5;
        this.state.hidden.positionWeight = Math.max(0, this.state.hidden.positionWeight - 3);
        p2.reputation = Math.max(0, p2.reputation - 2);
        p2.careerLog.push({ year: p2.age, event: `基层历练结束，组织将你调往${pt.targetUnit.name}任职（原单位下一级）`, special: 'transfer' });
      } else {
        this.state.hidden.workAbility += 3;
        this.state.hidden.mentalPressure += 6;
        p2.missedPromotions += 2;
        p2.reputation = Math.max(0, p2.reputation - 3);
        p2.careerLog.push({ year: p2.age, event: '基层历练结束，组织决定让你留在基层继续磨砺', special: 'demotion' });
      }
    } else if (pt.type === 'grassroots' && pt.targetUnit) {
      const started = this.beginGrassrootsAssignment({ targetUnit: pt.targetUnit, reason: '基层历练' });
      if (!started.ok) return;
    } else if (pt.type === 'grassrootsReturn' && pt.targetUnit) {
      moveTo(pt.targetUnit, '基层返回');
      p.flags.grassrootsActive = false;
      p.flags.grassrootsDone = true;
      delete p.flags.grassrootsYears;
      this.state.hidden.mentalPressure -= 5;
      this.state.hidden.positionWeight += 4;
      this.state.hidden.background += 3;
      p.leadershipRank++; p.promotions++;
      p.careerLog.push({ year: p.age, event: `基层历练结束，返回${pt.targetUnit.name}并获提拔！`, special: 'upgrade' });
    } else if (pt.type === 'lateral' && pt.targetUnit) {
      const oldUnit = p.unit ? p.unit.name : '原单位';
      moveTo(pt.targetUnit, '平调');
      this.state.hidden.mentalPressure += 5;
      this.state.hidden.background += 3;
      p.missedPromotions = Math.max(0, p.missedPromotions - 3);
      p.flags.lastLateralYear = p.yearsWorked;
      // 平调有概率影响职级：15%降1级获得补偿，10%升1级但代价更大
      const transferRoll = this.randf();
      if (transferRoll < 0.15) {
        // 降级但有补偿：调到更安逸岗位，压力减小，廉洁提升
        p.leadershipRank = Math.max(1, p.leadershipRank - 1);
        this.state.hidden.mentalPressure -= 8;
        this.state.hidden.integrity += 3;
        this.state.hidden.risk -= 3;
        p.careerLog.push({ year: p.age, event: `从${oldUnit}平调至${pt.targetUnit.name}（降级使用，但压力减轻）`, special: 'demotion' });
      } else if (transferRoll < 0.25) {
        // 升1级但压力大增：临危受命，挑战与机遇并存
        p.leadershipRank++;
        p.promotions++;
        this.state.hidden.mentalPressure += 8;
        this.state.hidden.risk += 3;
        this.state.hidden.positionWeight += 3;
        p.careerLog.push({ year: p.age, event: `从${oldUnit}调任至${pt.targetUnit.name}并获提拔！`, special: 'upgrade' });
      } else {
        p.careerLog.push({ year: p.age, event: `从${oldUnit}平调至${pt.targetUnit.name}`, special: 'transfer' });
      }
      // 确保不超过新单位上限
      const maxRankNew = this.getMaxRankForLevel(p.unit ? p.unit.level : '乡镇');
      if (p.leadershipRank > maxRankNew) p.leadershipRank = maxRankNew;
    } else if (pt.type === 'forcedDemotion' && pt.targetUnit) {
      const oldUnit = p.unit ? p.unit.name : '原单位';
      moveTo(pt.targetUnit, '强制降级');
      p.leadershipRank = Math.max(1, p.leadershipRank - 1);
      this.state.hidden.mentalPressure += 10;
      p.reputation = Math.max(0, p.reputation - 5);
      p.missedPromotions = Math.max(0, p.missedPromotions - 5);
      p.flags.recentlyDemoted = true; // 降级标记，触发反转事件
      p.careerLog.push({ year: p.age, event: `从${oldUnit}被排挤至${pt.targetUnit.name}，降级使用`, special: 'demotion' });
    }
    this.state.pendingTransfer = null;
  }
GameEngine.prototype.declineTransfer = function() {
    const pt = this.state.pendingTransfer; if (!pt) return;
    const p = this.state.player;
    // 基层期满的组织安排也必须有可回退路径：拒绝“留任/下调”后回原单位，
    // 不能因为点了拒绝就继续保持 grassrootsActive，造成无期限滞留乡镇。
    if (pt.type === 'grassrootsForcedStay') {
      const returnUnit = pt.returnUnit || (pt.returnUnitId && GameData.units.find(u => u.id === pt.returnUnitId));
      if (returnUnit) {
        const moved = this.setPosting ? this.setPosting(returnUnit, '拒绝基层留任安排，返回原单位') : null;
        if (!moved || moved.ok !== false) {
          if (!this.setPosting) {
            p.unit = returnUnit;
            p.unitLevel = { '省级': 3, '市级': 2, '县级': 1, '乡镇': 0, '街道': 0, '中央': 4 }[returnUnit.level] || 0;
          }
          p.flags.grassrootsActive = false;
          p.flags.grassrootsDone = true;
          p.flags.grassrootsChose = 'decline_return';
          delete p.flags.grassrootsYears;
          delete p.flags.grassrootsDuration;
          p.missedPromotions += 2;
          p.reputation = Math.max(0, p.reputation - 2);
          p.careerLog.push({ year: p.age, event: `拒绝基层期满后的留任/下调安排，返回${returnUnit.name}接受后续考核`, special: 'transfer' });
          this.state.pendingTransfer = null;
          return;
        }
      }
    }
    if (pt.type === 'forcedDemotion') {
      p.missedPromotions += 5;
      p.reputation = Math.max(0, p.reputation - 3);
      this.state.hidden.mentalPressure += 8;
      p.careerLog.push({ year: p.age, event: '拒绝降级调任，处境更加艰难', special: 'demotion' });
    } else {
      p.missedPromotions += 2;
      p.careerLog.push({ year: p.age, event: '拒绝平调/下派机会' });
    }
    this.state.pendingTransfer = null;
  }
