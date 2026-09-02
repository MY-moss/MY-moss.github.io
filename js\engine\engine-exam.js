GameEngine.prototype.generateWrittenExam = function() {
    const diff = this.state.difficulty;
    const unit = this.state.player.unit;
    if (diff === 'speedrun') { this.state.examQuestions = []; this.state.currentQuestion = 0; this.scoreCalculated = false; this.state.player.writtenScore = 60 + this.rand(0, 20); this.state.writtenQuestionsCache = []; return; }
    const count = diff === 'easy' ? 1 : (diff === 'hardcore' ? 4 : 3); // v2.70 硬核：4 题
    let unitDiff = unit ? unit.difficulty : 50;
    if (diff === 'hardcore') unitDiff += 10; // v2.70 硬核：单位难度上浮 10 点
    let qDifficulty = 1;
    if (unitDiff >= 80) qDifficulty = 3;
    else if (unitDiff >= 65) qDifficulty = 2;
    let pool = GameData.writtenQuestions.filter(q => q.difficulty === qDifficulty);
    if (pool.length < count) {
      pool = GameData.writtenQuestions.filter(q => Math.abs(q.difficulty - qDifficulty) <= 1);
    }
    // v2.17: 按题目文本去重——题库含母题复制题（如言语/判断 24 母题扩 65 题），防止同一局抽到相同题目
    const seen = new Set();
    const uniquePool = this.shuffle(pool).filter(q => {
      const k = q.question;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const questions = uniquePool.slice(0, count).map(q => {
      // 打乱选项顺序，随机分配ABCD标签
      const entries = Object.entries(q.options);
      const shuffled = this.shuffle([...entries]);
      const correctText = q.options[q.answer];
      const correctIdx = shuffled.findIndex(([, v]) => v === correctText);
      const labels = ['A', 'B', 'C', 'D'];
      const newOptions = {};
      shuffled.forEach(([, v], i) => { newOptions[labels[i]] = v; });
      return {
        ...q,
        options: newOptions,
        correctLabel: labels[correctIdx],
        userAnswer: null,
        correct: false,
        score: 0
      };
    });
    this.state.examQuestions = questions;
    this.state.writtenQuestionsCache = questions; // 缓存笔试题目，防止被面试覆盖
    this.state.currentQuestion = 0; this.scoreCalculated = false;
  }
GameEngine.prototype.answerWrittenQuestion = function(answer) {
    const q = this.state.examQuestions[this.state.currentQuestion]; if (!q) return false;
    q.userAnswer = answer; q.correct = (answer === q.correctLabel);
    // 难度加权：难度3难题答对回报更高（12-17分），难度1基础题（10-13分），难度2不变（10-14分）
    if (q.correct) {
      const d = q.difficulty || 2;
      q.score = d === 1 ? 10 + this.rand(0, 3) : d === 3 ? 12 + this.rand(0, 5) : 10 + this.rand(0, 5);
    } else {
      q.score = 0;
    }
    this.state.currentQuestion++; return this.state.currentQuestion >= (this.state.difficulty === 'easy' ? 1 : (this.state.difficulty === 'hardcore' ? 4 : 3)); // v2.72 修复：hardcore 生成 4 题但结束判定仍 3——第 4 题永远答不到
  }
GameEngine.prototype.calculateWrittenScore = function() {
    if (this.scoreCalculated) return this.state.player.writtenScore;
    // 使用缓存的笔试题目，避免被面试题覆盖
    const questions = this.state.writtenQuestionsCache || this.state.examQuestions;
    if (questions.length === 0) {
      this.scoreCalculated = true;
      return this.state.player.writtenScore;
    }
    this.state.player.writtenScore = Math.round(questions.reduce((s, q) => s + (q.score || 0), 0) + this.state.attrs.iq * 2 + this.state.attrs.luck * 1 + this.state.hidden.workAbility * 0.3);
    this.scoreCalculated = true; return this.state.player.writtenScore;
  }
GameEngine.prototype.getInterviewPool = function(u) {
    if (!u) return 'general';
    const n = u.name; const s = u.system; const t = u.tags || [];
    if (n.includes('医保')) return 'medicare';
    if (n.includes('民政')) return 'civil';
    if (n.includes('卫健')) return 'health';
    if (n.includes('人社')) return 'hrss';
    if (n.includes('税务') || n.includes('财政') || n.includes('审计') || n.includes('统计')) return 'finance';
    if (s === '政法系统') return 'law';
    if (n.includes('发改') || n.includes('住建') || n.includes('水利') || n.includes('交通') || n.includes('自然资源')) return 'develop';
    if (n.includes('农业农村')) return 'agri';
    if (n.includes('市场') || n.includes('应急')) return 'enforcement';
    if (n.includes('生态')) return 'environment';
    if (n.includes('数据') || n.includes('网信')) return 'digital';
    if (n.includes('政协')) return 'consultative';
    if (n.includes('组织') || n.includes('宣传') || n.includes('统战')) return 'party';
    if (s === '党委系统') return 'party';
    if (n.includes('乡镇') || n.includes('街道') || n.includes('审批')) return 'grassroots';
    if (s === '政府系统' || s === '机关') return 'govoffice';
    return 'general';
  }
GameEngine.prototype.generateInterview = function() {
    const count = this.state.difficulty === 'easy' ? 1 : 3;
    const unit = this.state.player.unit;
    const poolId = this.getInterviewPool(unit);
    // 单位难度决定面试难度：高难度单位（difficulty>=80）抽难度3题，中等难度抽难度2，低难度抽难度1
    const unitDiff = unit ? unit.difficulty : 50;
    const targetDiff = unitDiff >= 80 ? 3 : unitDiff >= 65 ? 2 : 1;
    const allPool = GameData.interviewQuestions;
    // 同池题（业务题）
    const samePool = allPool.filter(q => (q.pool || 'general') === poolId);
    // v2.58 修复：按 targetDiff 分级抽题（原实现无条件优先抽难度3深水题，低难度单位也撞"医保套保/隐性债务"类题）
    // v2.1.6 高难度匹配：目标难度精确优先（难度3→2→1 梯度），防高难度单位大量抽到浅水题
    let bizTier = [];
    for (const t of [3, 2, 1]) {
      if (t > targetDiff) continue;
      bizTier = samePool.filter(q => (q.difficulty || 2) === t);
      if (bizTier.length > 0) break;
    }
    if (bizTier.length === 0) bizTier = samePool.filter(q => (q.difficulty || 2) <= targetDiff);
    // 通用题：targetDiff 及以下；若目标难度没有题（如难度1无通用题），放宽到难度2兜底，保证面试题池永不为空
    // v2.1.6 通用题同样目标难度精确优先
    let gen = [];
    for (const t of [3, 2, 1]) {
      if (t > targetDiff) continue;
      gen = allPool.filter(q => (!q.pool || q.pool === 'general') && (q.difficulty || 2) === t);
      if (gen.length > 0) break;
    }
    if (gen.length === 0) gen = allPool.filter(q => (!q.pool || q.pool === 'general') && (q.difficulty || 2) <= 2);
    // 标准模式：2道专业题 + 1道通用题；简单模式：1道专业题
    const bizCount = Math.min(count, Math.max(0, samePool.length > 0 ? (count === 1 ? 1 : 2) : 0));
    let pickedBiz = [];
    if (bizCount > 0) {
      // 目标难度题优先，不足用同池全题补足（v2.67 修复：原 fill 用 bizHard——低难度单位（县医保局等 25 个）目标难度无题时被强制抽难度 3 深水题）
      pickedBiz = this.shuffle([...bizTier]).slice(0, bizCount);
      // v2.1.5 G2：fill 兜底限 targetDiff+1（低难度单位不再抽到难度 3 深水题；v2.58/v2.67 修复的补完）
      const fillPool = samePool.filter(q => !pickedBiz.includes(q) && (q.difficulty || 2) <= targetDiff + 1);
      const fill = this.shuffle(fillPool.length > 0 ? fillPool : samePool.filter(q => !pickedBiz.includes(q))).slice(0, bizCount - pickedBiz.length);
      pickedBiz = pickedBiz.concat(fill);
      // 同池题仍不足：用通用题兜底（保证题数）
      if (pickedBiz.length < bizCount) {
        pickedBiz = pickedBiz.concat(this.shuffle(gen).slice(0, bizCount - pickedBiz.length));
      }
    }
    const pickedGen = this.shuffle(gen.filter(q => !pickedBiz.includes(q))).slice(0, count - pickedBiz.length);
    // 选项洗牌：随机重排选项并重新分配ABCDE标签，score/effects 随选项移动
    // 防止"第一个选项恒为满分答案"，玩家无法无脑选A
    const shuffleChoices = (q) => {
      const entries = q.choices.map(c => ({ ...c }));
      for (let i = entries.length - 1; i > 0; i--) {
        const j = this.rand(0, i);
        [entries[i], entries[j]] = [entries[j], entries[i]];
      }
      const labels = ['A', 'B', 'C', 'D', 'E'];
      q.choices = entries.map((c, i) => ({ ...c, label: labels[i] }));
    };
    const questions = [...pickedBiz, ...pickedGen];
    questions.forEach(shuffleChoices);
    this.state.examQuestions = this.shuffle(questions);
    this.state.currentQuestion = 0; this.state.player.interviewScore = 0; this.state.player.interviewBaseScore = 0;
  }
GameEngine.prototype.answerInterviewQuestion = function(ci) {
    const q = this.state.examQuestions[this.state.currentQuestion]; if (!q) return false;
    const c = q.choices[ci]; if (!c) return false;
    // 第一印象：外貌在面试中同样起作用（÷3 权重上调，总加成上限放宽到 7，避免被情商/智商挤占）
    const attrBonus = Math.floor(this.state.attrs.eq / 3) + Math.floor(this.state.attrs.iq / 5) + Math.floor(this.state.hidden.background / 10) + Math.floor(this.state.attrs.appearance / 3);
    this.state.player.interviewScore += (c.score || 0) + Math.min(attrBonus, 7);
    // 基础分（不含属性加成）：用于免试判定，防止属性堆叠绕过分数线
    this.state.player.interviewBaseScore = (this.state.player.interviewBaseScore || 0) + (c.score || 0);
    for (const [k, v] of Object.entries(c.effects)) {
      if (k === 'political') { this.state.player.political = v; continue; }
      if (k === 'education') { this.state.player.education = v; continue; }
      if (k === 'reputation') { this.state.player.reputation = this.clampStat('reputation', (this.state.player.reputation || 50) + v); continue; }
      if (k === 'heat') { this.state.player.heat = this.clampStat('heat', (this.state.player.heat || 0) + v); continue; }
      if (k === 'wealth') { if (v >= 0) this.cashIn(v); else this.cashOut(-v); continue; }
      if (k in this.state.attrs) this.state.attrs[k] += v;
      if (k in this.state.hidden) this.state.hidden[k] += v;
    }
    this.clampAttrs();
    this.state.currentQuestion++; return this.state.currentQuestion >= (this.state.difficulty === 'easy' ? 1 : (this.state.difficulty === 'hardcore' ? 4 : 3)); // v2.72 同修复（重考路径；hardcore 无重考不可达，保持一致）
  }
GameEngine.prototype.calculateResult = function() {
    const u = this.state.player.unit; if (!u) return false;
    const diff = this.state.difficulty;
    this.calculateWrittenScore();
    // 每次结算前重置全对标记（防止重考后旧标记残留导致误显示"笔试全对"）
    this.state.player.excellentPass = false;
    // 笔试全对：获得大幅加分 + 分数线优惠（不再直接免试录取，保留上岸的悬念与概率）
    const wq = this.state.writtenQuestionsCache || this.state.examQuestions || [];
    const writtenAllCorrect = wq.length > 0 && wq.every(q => q.correct);
    const major = this.state.player.major;
    let fitBonus = 0;
    if (major && u.tags) {
      // 专业与单位匹配度（词根归一化见 getMajorFit）：命中数越多加成越高
      const fit = this.getMajorFit(u);
      // 专业稀缺度加成：稀缺专业竞争小，更容易考上（稀缺度<1 → +2，1~1.3 → +1，>1.3 → +0）
      const scarcityBonus = fit.scarcity ? Math.round((1 - fit.scarcity / 3) * 2) : 0;
      fitBonus = fit.matchCount * 2.5 + scarcityBonus;
    }
    const abilityBonus = this.state.attrs.iq * 0.3 + this.state.attrs.luck * 0.2;
    let bonus = (diff === 'speedrun' ? 30 : diff === 'easy' ? 12 : 3) + fitBonus + abilityBonus + Math.min((this.state.player.examAttempts || 0) * 1.5, 6);
    // 笔试全对奖励：大幅加分（保留笔试全对的价值，但不再直接录取）
    if (writtenAllCorrect) { bonus += 15; this.state.player.excellentPass = true; }
    const total = this.state.player.writtenScore + this.state.player.interviewScore + bonus;
const signup = diff === 'speedrun' ? 5 + this.rand(0, 8) : diff === 'easy' ? 10 + this.rand(0, 15) : 15 + this.rand(0, 60) + Math.round(u.weight * 0.8);
    // 动态难度：根据玩家背景/属性/专业调整分数线
    const bgMod = this.state.player.background ? ({ poor: 3, ordinary: 1, comfortable: 0, wealthy: -2, elite: -4 }[this.state.player.background.id] || 0) : 0;
    const attrMod = -(this.state.attrs.iq * 0.1 + this.state.attrs.luck * 0.15 + this.state.attrs.eq * 0.05);
    // 家境门槛：家境低于2分则备考资源不足，分数线提高
    const familyThreshold = this.state.attrs.family < 1 ? 1 : 0;
    // 背景门槛：隐藏背景低于15分则消息闭塞，分数线提高
    const backgroundThreshold = this.state.hidden.background < 15 ? 1 : -1;
    // 动态难度：根据玩家背景/属性/专业调整分数线；低难度单位（<65）系数下调，避免报考人数把线抬得过高
    const lineUnit = u.difficulty < 65 ? u.difficulty * 0.66 : u.difficulty * 0.70;
    const line = Math.round((diff === 'speedrun' ? u.difficulty * 0.25 + this.rand(0, 8) : diff === 'easy' ? u.difficulty * 0.40 + this.rand(0, 12) : lineUnit + this.rand(0, 14)) + bgMod + attrMod + familyThreshold + backgroundThreshold + Math.min(signup / 50, 3.0) * 12);
    this.state.player.signupCount = signup;
    // 笔试全对：分数线 -10%（与加分叠加，高难度高分线单位仍保留落榜可能）
    // v2.4.1：正确率梯度优惠——认真备考玩家（≥90%正确率）也能享受线优惠，不再只有全对学霸独享
    let lineDiscount = 1;
    if (writtenAllCorrect) { lineDiscount = 0.9; this.state.player.excellentPass = true; }
    else {
      const rightCount = wq.filter(q => q.correct).length;
      const rate = wq.length > 0 ? rightCount / wq.length : 0;
      if (rate >= 0.95) lineDiscount = 0.95;
      else if (rate >= 0.90) lineDiscount = 0.97;
    }
    this.state.player.passingLine = Math.round(line * lineDiscount);
    this.state.player.writtenRank = 1 + this.rand(0, Math.floor(signup * 0.3));
    this.state.player.totalScore = total; this.state.player.passed = total >= this.state.player.passingLine;
    if (this.state.player.passed) { this.state.player.finalScore = total; this.state.player.isEmployed = true; this.state.player.ageOnshore = this.state.player.age; this.state.player.leadershipRank = 1; }
    // v2.1.63 经历里程碑：上岸留痕（考试类经历数据源，category 供展示层分类）
    if (this.state.player.passed) {
      this.state.player.careerLog = this.state.player.careerLog || [];
      const unitName = (u && u.name) ? u.name : '';
      this.state.player.careerLog.push({ year: this.state.player.age, event: '成功上岸，入职' + unitName, category: 'exam', special: 'onshore' });
    }
    // 入职后职级不能超过单位上限
    const maxRankStart = this.getMaxRankForLevel(u.level);
    if (this.state.player.leadershipRank > maxRankStart) this.state.player.leadershipRank = maxRankStart;
    // 记录考试次数
    this.state.player.examAttempts++;
    return this.state.player.passed;
  }
GameEngine.prototype.retryExam = function() {
    if (this.state.difficulty === 'hardcore') return false; // v2.70 硬核：一次机会，挂了就结束
    if (this.state.player.age >= this.state.player.maxExamAge) return false; // v2.58 修复：引擎层超龄护栏（此前仅 UI 拦截，绕过 UI 直接调用可无限重考）
    const p = this.state.player;
    const s = this.state;
    // v2.58 修复：引擎层超龄护栏（此前仅 UI 拦截，绕过 UI 直接调用可无限重考）
    if (p.age >= p.maxExamAge) return false;
    s.year++;
    p.age++;
    // 备考一年：能力微增，压力增加
    s.hidden.workAbility += 1 + this.rand(0, 2);
    s.hidden.mentalPressure += 3;
    if (s.hidden.integrity < 70) s.hidden.integrity += 0.5;
    // 重新生成笔试（面试将在笔试完成后由UI生成）
    this.generateWrittenExam();
    return true;
  }