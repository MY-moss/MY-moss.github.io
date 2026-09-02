// 特殊剧本包 v1：复用经典引擎，只通过起始状态、事件权重和专属事件制造不同的人生命题。
// 设计原则：剧本是可配置内容，不把分支硬编码到年度结算流程；后续可独立扩充事件和结局。
(function() {
  const scenarios = {
    classic: {
      id: 'classic', icon: '📜', name: '经典人生', short: '完整体验所有基础路线',
      desc: '从备考开始，完整经历考试、入职、晋升、家庭与退休。',
      eventWeightMult: 1, setup: {},
      goal: { title: '完成一段完整人生', desc: '不预设唯一答案，尝试用自己的选择走到一个结局。', steps: [], endings: [] }
    },
    grassroots: {
      id: 'grassroots', icon: '🌾', name: '基层逆袭', short: '从群众口碑和一线硬仗中突围',
      desc: '基层工作事件更密集，群众口碑和工作能力更容易成为晋升筹码。',
      eventWeightMult: 2.2, poolBoosts: ['乡镇', '街道', '基层单位'],
      setup: { hidden: { workAbility: 3 }, player: { peopleReputation: 58 } },
      goal: { title: '把基层做成主战场', desc: '完成基层硬仗，并在基层奉献、乡土守望或乡村振兴路线中留下结果。', steps: [{ ids: ['grassrootsBreakthrough', 'grassrootsCautious'], label: '完成第一场基层硬仗' }, { ids: ['grassrootsStep2'], label: '啃下第二块硬骨头' }, { ids: ['grassrootsArc'], label: '在基层留下自己的印记' }], endings: ['grassroots', 'grassroots_devotion', 'rural_star'] }
    },
    midcareer: {
      id: 'midcareer', icon: '🔁', name: '中年转岗', short: '35岁重新选择赛道',
      desc: '你不再拥有无限试错时间，转岗、重建关系和证明自己成为主线。',
      eventWeightMult: 2.4, setup: { age: 35, maxExamAge: 42, hidden: { workAbility: 8, mentalPressure: 6 } },
      goal: { title: '重新证明自己', desc: '完成一次真正的转岗重建，让旧经验变成新岗位的能力。', steps: [{ ids: ['midcareerRebuild', 'midcareerHold'], label: '完成转岗后的第一次关键交付' }, { ids: ['midcareerStep2'], label: '交出第一份新岗位实绩' }, { ids: ['midcareerArc'], label: '重建自己的职业坐标' }], endings: ['fast', 'reform', 'tech_backbone'] }
    },
    clean: {
      id: 'clean', icon: '🕊️', name: '清廉路线', short: '在诱惑密集处守住底线',
      desc: '廉洁起点更好，但清白会带来现实压力；清廉事件与声誉路线更集中。',
      eventWeightMult: 2.3, setup: { hidden: { integrity: 12, risk: -4 } },
      goal: { title: '守住最后一条线', desc: '面对违规线索时留下可追溯的选择，并走向清廉或举报路线。', steps: [{ ids: ['cleanRecord', 'cleanCompromise'], label: '处理第一封违规线索' }, { ids: ['cleanStep2'], label: '经受第二次诱惑考验' }, { ids: ['cleanArc'], label: '把清白走成一条路' }], endings: ['clean', 'honest_official', 'era_rectify', 'whistleblower_hero'] }
    },
    network: {
      id: 'network', icon: '🤝', name: '关系路线', short: '在熟人社会里学会取舍',
      desc: '人情、贵人和关系边界更频繁出现，背景与风险会同时被放大。',
      eventWeightMult: 2.2, setup: { hidden: { background: 10, risk: 3 } },
      goal: { title: '学会与关系相处', desc: '在熟人托付中做一次边界选择，让人脉成为资源而不是隐患。', steps: [{ ids: ['networkBoundary', 'networkFavor'], label: '回应一次熟人托付' }, { ids: ['networkStep2'], label: '面对回流的人情账' }, { ids: ['networkArc'], label: '立住自己的关系底线' }], endings: ['patron_legacy', 'lifelong_friend', 'hometown_net', 'people_champion'] }
    },
    reform: {
      id: 'reform', icon: '🚩', name: '政策改革年代', short: '在窗口期留下政策痕迹',
      desc: '改革年代的工作事件更密集，政策调研和改革方案路线更容易展开。',
      eventWeightMult: 2.3, preferredEra: 'reform', workWeightMult: 1.2,
      setup: { era: 'reform', hidden: { workAbility: 3, mentalPressure: 3 } },
      goal: { title: '把窗口期变成成果', desc: '完成一次改革试点，在改革先锋或数字政务路线中留下可复用的成果。', steps: [{ ids: ['reformPilot', 'reformCautious'], label: '完成一次改革窗口期决策' }, { ids: ['reformStep2'], label: '把试点推向深水区' }, { ids: ['reformArc'], label: '留下可复用的制度成果' }], endings: ['reform', 'reform_pioneer', 'era_reform', 'digital'] }
    },
    retired: {
      id: 'retired', icon: '🧓', name: '退休返聘', short: '在退场之前再做一次选择',
      desc: '从50岁开始，以速通方式进入职业后段，专注返聘、传承和体面退场。',
      eventWeightMult: 3, setup: { age: 50, maxExamAge: 65, difficulty: 'speedrun', hidden: { body: 3, mentalPressure: -3 } },
      goal: { title: '把经验交给下一站', desc: '在退场前完成一次返聘或传承选择，体面地决定最后一段时间怎么用。', steps: [{ ids: ['retiredMentor', 'retiredLegacy'], label: '完成最后一次传承选择' }, { ids: ['retiredStep2'], label: '把经验交出去' }, { ids: ['retiredArc'], label: '体面地完成谢幕' }], endings: ['author_legacy', 'safe', 'ordinary'] }
    },
    family: {
      id: 'family', icon: '🏠', name: '家庭与事业冲突', short: '工作之外也有必须回应的人',
      desc: '你从一开始就背着家庭责任，陪伴、收入和晋升互相争夺时间。',
      eventWeightMult: 2.2, setup: { age: 30, player: { isMarried: true, hasChildren: true, childAge: 6 }, hidden: { familyPressure: 8 } },
      goal: { title: '别把重要的人留在身后', desc: '完成一次家庭与事业的取舍，并让最终结局回应这份责任。', steps: [{ ids: ['familyBalance', 'familyCareer'], label: '回应一次家庭与事业冲突' }, { ids: ['familyStep2'], label: '修补一次失约' }, { ids: ['familyArc'], label: '找到新的平衡点' }], endings: ['safe', 'ordinary', 'hometown_net', 'people_champion'] }
    }
  };

  const scenarioEvents = [
    { id: 'scn_grassroots_001', scenario: 'grassroots', stage: 'work', eventType: 'choice', title: '基层逆袭·第一场硬仗', weight: 8, year: [22, 60], text: '一场突发的群众诉求把你推到最前面。没有现成答案，只有一群等着你回应的人。', choices: [
      { text: '先到现场，把群众最急的事一件件列出来', effects: { peopleReputation: 8, workAbility: 3, mentalPressure: 2, flag: 'grassrootsBreakthrough' } },
      { text: '先向上级请示，等口径明确后再行动', effects: { reputation: 2, background: 3, mentalPressure: -1, flag: 'grassrootsCautious' } }
    ] },
    { id: 'scn_midcareer_001', scenario: 'midcareer', stage: 'work', eventType: 'choice', title: '中年转岗·重新出发', weight: 8, year: [35, 55], text: '你被安排到一个陌生部门轮岗。年轻同事觉得你经验丰富，老同事却提醒你别把旧习惯带过来。', choices: [
      { text: '把经验拆开重学，先解决新岗位最具体的问题', effects: { workAbility: 5, reputation: 3, mentalPressure: 2, flag: 'midcareerRebuild' } },
      { text: '坚持用熟悉的方法证明自己没有走错', effects: { positionWeight: 2, risk: 4, mentalPressure: 5, flag: 'midcareerHold' } }
    ] },
    { id: 'scn_clean_001', scenario: 'clean', stage: 'work', eventType: 'choice', title: '清廉路线·最后一封信', weight: 8, year: [25, 60], text: '一封没有署名的信放在你桌上，里面是项目流程中一处容易被忽略的违规线索。揭开它，意味着得罪人；不揭开，它也许会在多年后回来找你。', choices: [
      { text: '按程序登记线索，留下完整的核查记录', effects: { integrity: 6, risk: -3, reputation: 3, mentalPressure: 3, flag: 'cleanRecord' } },
      { text: '先私下提醒相关人员整改，尽量不要把事情做绝', effects: { eq: 2, background: 2, risk: 3, mentalPressure: -1, flag: 'cleanCompromise' } }
    ] },
    { id: 'scn_network_001', scenario: 'network', stage: 'work', eventType: 'choice', title: '关系路线·熟人托付', weight: 8, year: [25, 60], text: '老同学带着一位熟人来找你，只说“帮忙看看流程”，但你知道所有人都在等一个越过规则的暗示。', choices: [
      { text: '把能办与不能办的边界讲清楚，按公开流程推进', effects: { integrity: 3, reputation: 3, background: 2, flag: 'networkBoundary' } },
      { text: '给熟人一个方便，先把关系留住', effects: { background: 5, wealth: 8, risk: 6, integrity: -4, flag: 'networkFavor' } }
    ] },
    { id: 'scn_reform_001', scenario: 'reform', stage: 'work', eventType: 'choice', title: '改革年代·窗口期', weight: 8, year: [25, 60], text: '上级给了你一次试点机会：如果成功，流程会被全省推广；如果失败，所有人都会说早就提醒过你。', choices: [
      { text: '先做小范围试点，用数据和反馈不断修正', effects: { workAbility: 5, reputation: 5, positionWeight: 3, mentalPressure: 4, flag: 'reformPilot' } },
      { text: '稳妥执行旧方案，等别人先趟出路来', effects: { risk: -2, mentalPressure: -2, positionWeight: 1, flag: 'reformCautious' } }
    ] },
    { id: 'scn_retired_001', scenario: 'retired', stage: 'work', eventType: 'choice', title: '退休返聘·再问一次', weight: 10, year: [50, 65], text: '退休手续办完后，单位又问你愿不愿意回来带一支年轻团队。钱不是重点，真正难回答的是：你还想不想把时间交给工作。', choices: [
      { text: '接受返聘，把最后一段时间用来培养接班人', effects: { positionWeight: 3, workAbility: 3, mentalPressure: 4, flag: 'retiredMentor' } },
      { text: '谢绝邀请，把经验整理成公开的工作手册', effects: { reputation: 5, peopleReputation: 4, mentalPressure: -4, flag: 'retiredLegacy' } }
    ] },
    { id: 'scn_family_001', scenario: 'family', stage: 'life', eventType: 'choice', title: '家庭与事业·今晚回家吗', weight: 8, pools: ['public'], year: [30, 60], text: '孩子在家长会上找不到你，单位却临时通知今晚必须加班。伴侣没有再争吵，只问你：“你准备把哪一边先放下？”', choices: [
      { text: '把工作交接清楚，按时回家参加家庭安排', effects: { childCompany: 1, familyPressure: -6, peopleReputation: 2, positionWeight: -1, flag: 'familyBalance' } },
      { text: '留下加班，把这次任务做成可复用的成果', effects: { workAbility: 4, reputation: 3, familyPressure: 6, mentalPressure: 3, flag: 'familyCareer' } }
    ] },
    // ===== P3 剧本专属事件链：每个剧本的 002/003 由 RIGID_CHAINS 依上一步 flag 刚性注入，构成三步阶段 =====
    { id: 'scn_grassroots_002', scenario: 'grassroots', stage: 'work', eventType: 'choice', title: '基层逆袭·第二块硬骨头', weight: 8, year: [23, 60], text: '第一场硬仗刚过，一桩拖了多年的民生旧账又浮出水面。有人劝你绕着走，也有人盯着你敢不敢接。', choices: [
      { text: '建立台账，一件一件销号解决', effects: { peopleReputation: 6, workAbility: 3, mentalPressure: 3, setFlags: ['grassrootsStep2', 'grassrootsDeepenLedger'] } },
      { text: '发动群众议事，让大家商量着办', effects: { peopleReputation: 4, eq: 2, background: 2, setFlags: ['grassrootsStep2', 'grassrootsDeepenMobilize'] } }
    ] },
    { id: 'scn_grassroots_003', scenario: 'grassroots', stage: 'work', eventType: 'choice', title: '基层逆袭·把根留下', weight: 8, year: [24, 60], text: '组织开始总结你的做法。你可以把经验固化为制度，也可以把力气花在培养后来人上。', choices: [
      { text: '把做法整理成可复制的制度', effects: { workAbility: 4, reputation: 4, positionWeight: 2, setFlags: ['grassrootsArc', 'grassrootsLegacySystem'] } },
      { text: '带出一批能接班的年轻人', effects: { eq: 2, peopleReputation: 5, setFlags: ['grassrootsArc', 'grassrootsLegacyMentor'] } }
    ] },
    { id: 'scn_midcareer_002', scenario: 'midcareer', stage: 'work', eventType: 'choice', title: '中年转岗·第一份实绩', weight: 8, year: [35, 58], text: '新岗位的第一份大活儿来了。是用旧经验快速搭框架，还是亲自啃最难的部分，都会决定别人怎么看你。', choices: [
      { text: '把旧经验改造成新岗位的流程', effects: { workAbility: 5, reputation: 3, setFlags: ['midcareerStep2', 'midcareerDeliverSop'] } },
      { text: '亲自接下最难啃的部分', effects: { workAbility: 4, mentalPressure: 4, positionWeight: 1, setFlags: ['midcareerStep2', 'midcareerDeliverHard'] } }
    ] },
    { id: 'scn_midcareer_003', scenario: 'midcareer', stage: 'work', eventType: 'choice', title: '中年转岗·重建坐标', weight: 8, year: [36, 59], text: '你在新岗位站稳了脚跟。接下来是向外打开局面，还是向内深耕专业，将决定你后半程的位置。', choices: [
      { text: '主动牵头跨部门协作', effects: { background: 4, positionWeight: 2, mentalPressure: 2, setFlags: ['midcareerArc', 'midcareerCoordOpen'] } },
      { text: '沉下心做深专业口碑', effects: { workAbility: 5, integrity: 2, setFlags: ['midcareerArc', 'midcareerCraftQuiet'] } }
    ] },
    { id: 'scn_clean_002', scenario: 'clean', stage: 'work', eventType: 'choice', title: '清廉路线·第二次考验', weight: 8, year: [25, 60], text: '一份裹着人情往来的心意摆在你面前。上次你留下了记录，这次对方的理由更充分，姿态也更低。', choices: [
      { text: '登记在册，照规矩上交', effects: { integrity: 5, reputation: 3, setFlags: ['cleanStep2', 'cleanLedger'] } },
      { text: '婉言退回，给对方留个体面', effects: { eq: 2, background: 2, risk: 2, setFlags: ['cleanStep2', 'cleanSoftDecline'] } }
    ] },
    { id: 'scn_clean_003', scenario: 'clean', stage: 'work', eventType: 'choice', title: '清廉路线·走成一条路', weight: 8, year: [26, 60], text: '你的清白开始被人议论，有人敬佩，也有人觉得你不近人情。你想让这份清白留下些什么？', choices: [
      { text: '推动把漏洞写进制度里', effects: { integrity: 4, positionWeight: 3, mentalPressure: 2, setFlags: ['cleanArc', 'cleanInstitution'] } },
      { text: '安静做事，做一股清流', effects: { integrity: 3, peopleReputation: 4, setFlags: ['cleanArc', 'cleanQuietStream'] } }
    ] },
    { id: 'scn_network_002', scenario: 'network', stage: 'work', eventType: 'choice', title: '关系路线·回流的人情', weight: 8, year: [25, 60], text: '当初经你手帮过的人找上门来，这次要的是更大的方便。人情账翻回来了，怎么记由你。', choices: [
      { text: '把能帮的帮到位，把规矩讲清', effects: { integrity: 3, reputation: 3, background: 2, setFlags: ['networkStep2', 'networkRuleful'] } },
      { text: '打个擦边球，把关系续上', effects: { background: 5, wealth: 6, risk: 5, integrity: -3, setFlags: ['networkStep2', 'networkBend'] } }
    ] },
    { id: 'scn_network_003', scenario: 'network', stage: 'work', eventType: 'choice', title: '关系路线·立住底线', weight: 8, year: [26, 60], text: '熟人圈里开始传你的名号：有人夸你够意思，也有人开始盘算更大的请托。你的关系网到了立规矩的时候。', choices: [
      { text: '把边界当众讲明白', effects: { integrity: 4, reputation: 2, setFlags: ['networkArc', 'networkBoundaryDeep'] } },
      { text: '保持来往，但不再接新请托', effects: { background: 3, risk: 2, setFlags: ['networkArc', 'networkKeepDistance'] } }
    ] },
    { id: 'scn_reform_002', scenario: 'reform', stage: 'work', eventType: 'choice', title: '改革年代·深水区', weight: 8, year: [25, 60], text: '试点初见成效，上面想推得更远。越往深处走，触动的利益越多，退路也越少。', choices: [
      { text: '用数据说话，推动扩面', effects: { workAbility: 4, positionWeight: 3, reputation: 3, mentalPressure: 3, setFlags: ['reformStep2', 'reformExpand'] } },
      { text: '主动暴露问题，及时修正', effects: { integrity: 3, workAbility: 3, mentalPressure: 2, setFlags: ['reformStep2', 'reformCorrect'] } }
    ] },
    { id: 'scn_reform_003', scenario: 'reform', stage: 'work', eventType: 'choice', title: '改革年代·制度遗产', weight: 8, year: [26, 60], text: '窗口期快过去了。你想让这场改革留下什么——一份能传下去的制度文本，还是一支会改革的队伍？', choices: [
      { text: '把经验写成制度文件', effects: { reputation: 5, positionWeight: 2, setFlags: ['reformArc', 'reformInstitutionDoc'] } },
      { text: '培养一支改革梯队', effects: { eq: 2, peopleReputation: 4, background: 2, setFlags: ['reformArc', 'reformTeam'] } }
    ] },
    { id: 'scn_retired_002', scenario: 'retired', stage: 'work', eventType: 'choice', title: '退休返聘·交棒', weight: 10, year: [50, 65], text: '年轻团队慢慢上了手，你的角色越来越像一座桥。是把经验写成册子，还是陪在旁边看着他们闯？', choices: [
      { text: '整理一份带教手册', effects: { workAbility: 3, reputation: 4, setFlags: ['retiredStep2', 'retiredManual'] } },
      { text: '陪着新班子复盘每一次硬仗', effects: { eq: 2, peopleReputation: 4, setFlags: ['retiredStep2', 'retiredCoach'] } }
    ] },
    { id: 'scn_retired_003', scenario: 'retired', stage: 'life', eventType: 'choice', title: '退休返聘·谢幕', weight: 10, year: [51, 65], text: '真正离开的时间定了。最后这段日子，你想怎么收尾？', choices: [
      { text: '给单位留下一封长信', effects: { reputation: 4, integrity: 2, setFlags: ['retiredArc', 'retiredLetter'] } },
      { text: '悄悄把印章交出去，转身离开', effects: { mentalPressure: -4, peopleReputation: 3, setFlags: ['retiredArc', 'retiredQuietExit'] } }
    ] },
    { id: 'scn_family_002', scenario: 'family', stage: 'life', eventType: 'choice', title: '家庭与事业·失约之后', weight: 8, pools: ['public'], year: [30, 60], text: '你又一次错过了答应孩子的事。孩子没哭闹，只是把画好的全家福收进了抽屉。', choices: [
      { text: '专门请一天假，补一个家庭日', effects: { childCompany: 1, familyPressure: -6, positionWeight: -1, setFlags: ['familyStep2', 'familyMakeUp'] } },
      { text: '带孩子看一天你真实的工作', effects: { childCompany: 1, eq: 2, familyPressure: 2, setFlags: ['familyStep2', 'familyShowWork'] } }
    ] },
    { id: 'scn_family_003', scenario: 'family', stage: 'life', eventType: 'choice', title: '家庭与事业·新的平衡', weight: 8, pools: ['public'], year: [31, 60], text: '家里慢慢理解了你的忙碌，你也慢慢找回了家里的位置。这段平衡，你想怎么守住？', choices: [
      { text: '把家庭时间写成雷打不动的规矩', effects: { familyPressure: -5, peopleReputation: 2, setFlags: ['familyArc', 'familyRoutine'] } },
      { text: '让家人成为你拼事业的底气', effects: { workAbility: 3, familyPressure: 3, setFlags: ['familyArc', 'familyBacking'] } }
    ] }
  ];

  GameData.scenarios = scenarios;
  GameData.scenarioEvents = scenarioEvents;
  // 避免热更新或测试重复加载时把专属事件追加多次。
  const existing = new Set((GameData.events || []).map(e => e && e.id));
  scenarioEvents.forEach(event => { if (!existing.has(event.id)) GameData.events.push(event); });
})();
