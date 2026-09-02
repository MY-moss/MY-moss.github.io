// ===== 基础通用事件·第4批 =====
// id 范围：e247~e334（97条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：基础通用事件续编，按数量拆分
const gd_events_basic_4 = [
    // ====== 早期职业事件 ======
    { id: 'e247', stage: 'work', eventType: 'choice', title: '入职第一天', weight: 4, text: '你第一天到单位报到，办公室的同事给你安排了一张靠门口的桌子。你发现自己是整个科室最年轻的人。', pools: ['public'], choices: [
      { text: '主动打扫卫生给大家留下好印象', effects: {eq: 1, reputation: 2, mentalPressure: 1, workAbility: 1, background: 1} },
      { text: '熟悉单位架构和人员关系', effects: {background: 2, iq: 1, mentalPressure: 1, workAbility: 1} },
      { text: '向老同事请教工作流程', effects: {eq: 1, workAbility: 2, mentalPressure: 1, background: 1, reputation: 1} },
      { text: '默默观察不说话', effects: {iq: 1, mentalPressure: -1, reputation: -1, eq: -1} },
      { text: '主动请缨承担更多工作', effects: {workAbility: 2, reputation: 2, mentalPressure: 2, positionWeight: 1, body: -1} },
    ]},
    { id: 'e248', stage: 'work', eventType: 'choice', title: '第一次出差', weight: 4, text: '领导安排你第一次出差，去一个偏远县城调研。这是你第一次独立负责工作任务，你既紧张又兴奋。', pools: ['public'], choices: [
      { text: '提前做好调研方案和提纲', effects: {workAbility: 3, iq: 2, reputation: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '和当地对接人提前沟通', effects: {eq: 1, background: 2, reputation: 1, mentalPressure: 1, workAbility: 1} },
      { text: '多听多看少说话', effects: {iq: 1, mentalPressure: 1, workAbility: 1, eq: 1} },
      { text: '写一篇高质量的调研报告', effects: {workAbility: 3, reputation: 3, iq: 2, mentalPressure: 3, positionWeight: 2} },
      { text: '借出差之机游览当地景点', effects: {mentalPressure: -1, reputation: -1, workAbility: -1, desire: 1} },
    ]},
    { id: 'e249', stage: 'work', eventType: 'choice', title: '师徒结对', weight: 4, text: '单位安排了"师徒结对"活动，分配给你的师傅是单位里出了名的"老黄牛"。他工作认真但脾气不太好。', pools: ['public'], choices: [
      { text: '虚心学习尊重师傅', effects: {workAbility: 3, eq: 1, reputation: 2, mentalPressure: 2, background: 1} },
      { text: '请师傅吃饭拉近关系', effects: {eq: 1, background: 2, reputation: 1, mentalPressure: 1, familyPressure: 1} },
      { text: '按自己的方式工作', effects: {workAbility: 1, mentalPressure: 1, reputation: -1, eq: -1} },
      { text: '多干实事让师傅认可', effects: {workAbility: 3, reputation: 2, mentalPressure: 2, body: -1, positionWeight: 1} },
      { text: '观察师傅的工作方法取其精华', effects: {iq: 2, workAbility: 2, mentalPressure: 1, eq: 1} },
    ]},
    { id: 'e250', stage: 'life', eventType: 'choice', title: '租房搬家', weight: 4, text: '你租的房子到期了，新找的房子离单位更远但更便宜。每天通勤时间翻倍，你开始考虑要不要买辆车。', pools: ['public'], choices: [
      { text: '租离单位近的房子', effects: {familyPressure: 2, mentalPressure: -2, workAbility: 1, body: 1, reputation: 1} },
      { text: '租便宜但远的房子', effects: {familyPressure: -1, mentalPressure: 2, body: -1, workAbility: -1} },
      { text: '买辆代步车', effects: {familyPressure: 2, mentalPressure: -1, body: 1, workAbility: 1, desire: 1} },
      { text: '申请单位宿舍', effects: {background: 1, familyPressure: -2, mentalPressure: -1, reputation: 1, positionWeight: 1} },
      { text: '和同事合租分摊房租', effects: {eq: 1, familyPressure: -2, mentalPressure: 1, background: 1, reputation: 1} },
    ]},
    { id: 'e251', stage: 'work', eventType: 'choice', title: '第一次汇报', weight: 4, text: '领导让你在全局会议上做工作汇报。这是你第一次在这么多人面前发言，你紧张得手心出汗。', pools: ['public'], choices: [
      { text: '精心准备PPT反复演练', effects: {workAbility: 3, reputation: 3, positionWeight: 2, mentalPressure: 3, iq: 1} },
      { text: '写逐字稿背下来', effects: {workAbility: 2, mentalPressure: 2, reputation: 2, positionWeight: 1} },
      { text: '脱稿讲展现自信', effects: {eq: 1, reputation: 2, mentalPressure: 3, risk: 1, positionWeight: 1} },
      { text: '让同事帮忙把关内容', effects: {eq: 1, background: 1, workAbility: 1, mentalPressure: 1, reputation: 1} },
      { text: '提前去会议室演练', effects: {workAbility: 2, mentalPressure: -1, iq: 1, reputation: 1} },
    ]},
    { id: 'e252', stage: 'work', eventType: 'choice', title: '轮岗学习', weight: 3, text: '单位安排新入职人员轮岗学习，你要去不同科室各待三个月。每个科室的领导和同事都不一样。', pools: ['public'], choices: [
      { text: '在每个科室都认真学习', effects: {workAbility: 3, background: 2, reputation: 2, mentalPressure: 2, iq: 1, appearance: 1} },
      { text: '重点在核心科室表现', effects: {desire: 2, positionWeight: 2, mentalPressure: 2, reputation: 1, workAbility: 1} },
      { text: '和各科室同事搞好关系', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: 1, workAbility: 1} },
      { text: '写轮岗总结报告', effects: {workAbility: 2, iq: 2, reputation: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '走马观花应付了事', effects: {risk: -2, workAbility: -1, reputation: -1, mentalPressure: -1, background: -1} },
    ]},
    { id: 'e253', stage: 'life', eventType: 'choice', title: '考编上岸', weight: 3, text: '你终于考上了公务员！从备考到入职，一路走来不容易。你看着录取通知书，感慨万千。', pools: ['public'], choices: [
      { text: '发朋友圈感谢大家的支持', effects: {eq: 1, reputation: 2, background: 1, mentalPressure: -2, familyPressure: -1} },
      { text: '默默入职低调做人', effects: {integrity: 2, mentalPressure: -1, reputation: 1, eq: 1} },
      { text: '请家人吃饭庆祝', effects: {familyPressure: -2, eq: 1, mentalPressure: -2, reputation: 1} },
      { text: '开始规划职业生涯', effects: {desire: 3, workAbility: 2, iq: 1, mentalPressure: 1, positionWeight: 1} },
      { text: '给导师和帮助过的人写信感谢', effects: {eq: 2, reputation: 2, background: 2, mentalPressure: -1, integrity: 2} },
    ]},
    // ====== 婚姻/家庭增强事件 ======
    { id: 'e254', stage: 'life', eventType: 'choice', title: '相亲', weight: 8, requireSingle: true, year: [22, 45], text: '朋友给你介绍了一个对象，对方条件不错，也在体制内工作。你去看了一眼，感觉还不错。', pools: ['public'], choices: [
      { text: '认真交往试试', effects: {eq: 1, mentalPressure: 1, familyPressure: -1, reputation: 1, flag: 'dating'} },
      { text: '先做朋友慢慢了解', effects: {eq: 1, mentalPressure: 1, familyPressure: -1, background: 1, flag: 'dating'} },
      { text: '觉得不合适就算了', effects: {mentalPressure: -1, familyPressure: 1, desire: -1} },
      { text: '主动约对方下次见面', effects: {eq: 1, desire: 1, mentalPressure: 1, familyPressure: -2, flag: 'dating'} },
      { text: '问清楚对方的家庭情况', effects: {iq: 1, background: 1, mentalPressure: 1, familyPressure: 1} },
    ]},
    { id: 'e255', stage: 'life', eventType: 'choice', title: '求婚', weight: 5, text: '你和对象感情稳定，到了谈婚论嫁的阶段。你决定求婚，但不知道对方会不会答应。', pools: ['public'], requireGender: '男', requireSingle: true, year: [22, 50], choices: [
      { text: '精心准备浪漫求婚', effects: {eq: 2, marry: true, familyPressure: -2, mentalPressure: 2, reputation: 2, appearance: 1} },
      { text: '简单真诚地表达心意', effects: {eq: 1, marry: true, familyPressure: -1, mentalPressure: 1, integrity: 2} },
      { text: '和对方商量结婚计划', effects: {eq: 1, marry: true, familyPressure: -2, mentalPressure: 1, background: 1} },
      { text: '先见双方父母再做决定', effects: {eq: 1, familyPressure: 1, mentalPressure: 1, background: 2, reputation: 1} },
      { text: '再等等看', effects: {mentalPressure: -1, familyPressure: 1, desire: -1, eq: -1} },
    ]},
    { id: 'e256', stage: 'life', eventType: 'choice', title: '家庭生活', weight: 3, text: '婚后生活平淡而幸福。每天下班回家有人等你吃饭，周末一起做做家务、看看电视。', pools: ['public'], requireMarried: true, choices: [
      { text: '多花时间陪伴家人', effects: {familyPressure: -3, mentalPressure: -2, eq: 1, reputation: 1, workAbility: -1} },
      { text: '工作和家庭各占一半', effects: {familyPressure: -1, mentalPressure: 1, workAbility: 1, eq: 1, reputation: 1} },
      { text: '带家人一起出去旅游', effects: {familyPressure: -3, mentalPressure: -3, eq: 1, reputation: 1} },
      { text: '把更多精力放在事业上', effects: {workAbility: 2, desire: 2, familyPressure: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '学习做饭给家人惊喜', effects: {eq: 1, familyPressure: -2, mentalPressure: -1, reputation: 1, body: 1} },
    ]},
    // ====== 联系人互动增强 ======
    { id: 'e257', stage: 'work', eventType: 'choice', title: '贵人求助', weight: 6, text: '你之前结识的那位领导突然联系你，说他现在遇到了一些困难需要帮助。你想起他当初帮过你。', requireContact: 'noble', pools: ['public'], choices: [
      { text: '全力帮助贵人渡难关', effects: {contactRelation: { id: 'noble', delta: 20}, background: 3, reputation: 2, mentalPressure: 3, eq: 1 }, minBackground: 40 },
      { text: '在能力范围内帮忙', effects: {contactRelation: { id: 'noble', delta: 10}, background: 2, reputation: 1, mentalPressure: 2, workAbility: 1 } },
      { text: '委婉说自己也帮不上忙', effects: {mentalPressure: -1, contactRelation: { id: 'noble', delta: -10}, reputation: -1, background: -1 } },
      { text: '介绍其他人帮他', effects: {contactRelation: { id: 'noble', delta: 5}, background: 2, eq: 1, reputation: 1, mentalPressure: 1 } },
      { text: '帮他分析问题出主意', effects: {contactRelation: { id: 'noble', delta: 15}, iq: 2, workAbility: 2, reputation: 1, mentalPressure: 2 } },
      { text: '动用全部人脉帮贵人摆平', effects: {contactRelation: { id: 'noble', delta: 25}, background: 3, reputation: 2, risk: 4, heat: 2, mentalPressure: 3 }, minBackground: 71 },
      { text: '居中联络各方资源帮他', effects: {contactRelation: { id: 'noble', delta: 15}, background: 2, eq: 1, risk: 1 }, minBackground: 40, maxBackground: 70 },
      { text: '坦诚相告，量力而行', effects: {contactRelation: { id: 'noble', delta: -5}, integrity: 2, mentalPressure: 1 }, maxBackground: 39 },
      { text: '出钱帮贵人渡过难关', effects: {contactRelation: { id: 'noble', delta: 20}, wealth: -40, reputation: 2, familyPressure: 2, mentalPressure: 2 }, minWealth: 60 },
    ]},
    { id: 'e258', stage: 'work', eventType: 'choice', title: '同学聚会（职场）', weight: 4, text: '老同学组织聚会，你见到了多年不见的同学。有人已经当上了处长，有人还在基层打拼。', pools: ['public'], choices: [
      { text: '和当处长的同学多交流', effects: {background: 3, desire: 2, reputation: 1, mentalPressure: 1, eq: 1} },
      { text: '和每个同学都聊聊天', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: -1, familyPressure: -1} },
      { text: '保持低调不多说话', effects: {mentalPressure: -2, reputation: -1, background: -1} },
      { text: '主动组织下一次聚会', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: 1, familyPressure: 1} },
      { text: '和同学交换联系方式', effects: {background: 2, eq: 1, reputation: 1, mentalPressure: -1, contact: { id: 'classmate', name: '老同学', relation: 15, position: '体制内', description: '老同学聚会认识'} } },
    ]},
    { id: 'e259', stage: 'life', eventType: 'choice', title: '邻居社交', weight: 4, text: '你搬了新家，邻居是个退休的老干部。他经常在小区里下棋、遛鸟，看起来是个有故事的人。', pools: ['public'], choices: [
      { text: '主动和邻居打招呼', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: -1, contact: { id: 'neighbor', name: '退休老干部', relation: 15, position: '退休', description: '小区邻居'} } },
      { text: '和邻居下棋聊天', effects: {eq: 1, background: 2, iq: 1, mentalPressure: -2, contact: { id: 'neighbor', name: '退休老干部', relation: 20, position: '退休', description: '小区邻居'} } },
      { text: '向邻居请教人生经验', effects: {iq: 2, workAbility: 1, mentalPressure: -1, eq: 1, background: 1, contact: { id: 'neighbor', name: '退休老干部', relation: 20, position: '退休', description: '小区邻居'} } },
      { text: '各过各的互不打扰', effects: {mentalPressure: 1, background: -1} },
      { text: '逢年过节互相拜访', effects: {eq: 1, background: 2, reputation: 1, mentalPressure: -1, contact: { id: 'neighbor', name: '退休老干部', relation: 15, position: '退休', description: '小区邻居'} } },
    ]},
    // ====== 党员机会增加 ======
    { id: 'e260', stage: 'work', eventType: 'choice', title: '推荐入党', weight: 5, text: '你的工作表现引起了一位老党员注意。他主动找你谈话，问你想不想入党，愿意做你的入党介绍人。', pools: ['public'], excludeFlag: 'appliedParty', choices: [
      { text: '欣然接受积极准备入党', effects: {positionWeight: 2, reputation: 2, mentalPressure: 2, background: 2, desire: 2, flag: 'appliedParty'} },
      { text: '表示感谢但想再考虑', effects: {eq: 1, mentalPressure: 1, reputation: 1, integrity: 1} },
      { text: '接受但希望了解党员义务', effects: {iq: 2, workAbility: 1, mentalPressure: 2, reputation: 1, flag: 'appliedParty'} },
      { text: '婉拒说自己还不够格', effects: {integrity: 2, mentalPressure: 1, eq: 1, positionWeight: -1} },
      { text: '接受并请介绍人指导', effects: {political: 'cpc', background: 2, eq: 1, mentalPressure: 2, reputation: 2, workAbility: 1, flag: 'appliedParty'} },
    ]},
    { id: 'e261', stage: 'work', eventType: 'choice', title: '党员活动', weight: 3, text: '党支部组织了一次志愿服务活动，去社区帮助困难群众。你作为党员参加了这次活动。', pools: ['public'], requirePolitical: 'cpc', choices: [
      { text: '积极参与用心服务', effects: {reputation: 3, integrity: 3, eq: 1, mentalPressure: -1, background: 2, positionWeight: 1, peopleReputation: 4} },
      { text: '做好本职工作不张扬', effects: {workAbility: 2, integrity: 2, mentalPressure: 1, reputation: 1, peopleReputation: 2} },
      { text: '拍照留念发朋友圈', effects: {reputation: 1, eq: 1, desire: 1, integrity: -1, peopleReputation: -1} },
      { text: '了解群众真实需求', effects: {iq: 2, workAbility: 2, eq: 1, background: 2, reputation: 2, peopleReputation: 4} },
      { text: '和社区建立长期联系', effects: {background: 3, reputation: 2, eq: 1, workAbility: 1, positionWeight: 1, peopleReputation: 3} },
    ]},
    // ====== 深造学习事件 ======
    { id: 'e262', stage: 'life', eventType: 'choice', title: '在职考研', weight: 4, text: '你一直想提升学历，但工作太忙。最近听说单位有政策支持在职读研，可以报销部分学费。', pools: ['public'], choices: [
      { text: '报名考研提升学历', effects: {flag: 'studying', iq:4, workAbility:3, mentalPressure:2, familyPressure:1, desire:2} },
      { text: '报一个在职培训班', effects: {workAbility: 3, iq: 1, mentalPressure: 2, reputation: 1, positionWeight: 1} },
      { text: '自学考证提升专业资质', effects: {workAbility: 2, iq: 2, mentalPressure: 2, reputation: 1, desire: 2} },
      { text: '工作太忙暂时不考虑', effects: {desire: -2, mentalPressure: -1, workAbility: -1, reputation: 1} },
      { text: '申请单位公派留学', effects: {flag: 'studying', background: 2, iq: 3, workAbility: 2, mentalPressure: 2, positionWeight: 2, desire: 2} },
    ]},
    // ====== 新增突发事件 ======
    { id: 'e264', stage: 'work', eventType: 'sudden', title: '突发地震', weight: 3, text: '一场突如其来的地震打乱了正常的工作秩序。办公楼出现了裂缝，需要紧急疏散。', pools: ['public'], effects: {mentalPressure: 6, body: -1, workAbility: 1} },
    { id: 'e265', stage: 'work', eventType: 'sudden', title: '政策突变', weight: 4, text: '上级突然出台了一项新政策，和你之前负责的工作方向完全相反。之前半年的努力白费了。', pools: ['public'], effects: {mentalPressure: 5, workAbility: 2, desire: -2, luck: -1} },
    { id: 'e266', stage: 'work', eventType: 'sudden', title: '领导更替', weight: 4, text: '单位一把手突然被调走，新领导还没到位。整个单位陷入了群龙无首的状态。', pools: ['public'], effects: {positionWeight: -2, mentalPressure: 3, background: -2} },
    { id: 'e267', stage: 'life', eventType: 'sudden', title: '交通意外', weight: 4, text: '你在上班路上遭遇了一场交通事故，虽然人没事，但车被撞坏了。处理事故花了一整天。', pools: ['public'], effects: {mentalPressure: 4, familyPressure: 2, body: -1} },
    { id: 'e268', stage: 'work', eventType: 'sudden', title: '集体辞职', weight: 3, text: '你分管的部门有三个人同时提出辞职，原因是待遇太低。人手一下子不够用了。', pools: ['public'], effects: {mentalPressure: 5, workAbility: -2, positionWeight: -1, risk: 1, luck: -1} },
    { id: 'e269', stage: 'work', eventType: 'sudden', title: '媒体曝光', weight: 4, text: '单位的一个历史遗留问题被媒体曝光了，引发了社会关注。虽然不是你经手的，但你被安排去处理危机公关。', pools: ['public'], effects: {mentalPressure: 6, risk: 3, reputation: -2, workAbility: 2} },
    // ====== 新增联系人互动事件 ======
    { id: 'e270', stage: 'life', eventType: 'choice', title: '贵人邀约', weight: 6, text: '你之前结识的贵人突然联系你，邀请你参加一个高层聚会。聚会上都是各行各业的人士。', requireContact: 'noble', pools: ['public'], choices: [
      { text: '盛装出席拓展人脉', effects: {contactRelation: { id: 'noble', delta: 10, appearance: -1}, background: 4, reputation: 2, eq: 1, mentalPressure: 2 } },
      { text: '低调参加多听少说', effects: {contactRelation: { id: 'noble', delta: 5}, background: 2, iq: 1, mentalPressure: 1, eq: 1 } },
      { text: '借机认识其他宾客', effects: {background: 3, eq: 1, reputation: 1, mentalPressure: -1, contact: { id: 'business', name: '商界朋友', relation: 10, position: '企业高管', description: '贵人聚会认识', desire: 2} } },
      { text: '以工作忙为由婉拒', effects: {contactRelation: { id: 'noble', delta: -5}, mentalPressure: -1, reputation: -1 } },
      { text: '带礼物感谢贵人提携', effects: {contactRelation: { id: 'noble', delta: 15, appearance: 1}, eq: 1, reputation: 2, background: 2, familyPressure: 1 } },
    ]},
    { id: 'e271', stage: 'life', eventType: 'choice', title: '邻居求助', weight: 6, text: '你的退休老干部邻居突然来找你，说他的退休金发放出了点问题，想请你帮忙问问。', requireContact: 'neighbor', pools: ['public'], choices: [
      { text: '热心帮忙联系人社部门', effects: {contactRelation: { id: 'neighbor', delta: 15}, eq: 1, reputation: 2, workAbility: 1, mentalPressure: 1 } },
      { text: '帮邻居写一份情况说明', effects: {contactRelation: { id: 'neighbor', delta: 10}, workAbility: 2, eq: 1, reputation: 1, iq: 1 } },
      { text: '告诉邻居正确的办理流程', effects: {contactRelation: { id: 'neighbor', delta: 5}, workAbility: 1, eq: 1, reputation: 1, mentalPressure: -1 } },
      { text: '让邻居去找社区', effects: {mentalPressure: -1, contactRelation: { id: 'neighbor', delta: -5}, reputation: -1 } },
      { text: '亲自陪邻居去办', effects: {contactRelation: { id: 'neighbor', delta: 20}, eq: 2, reputation: 2, mentalPressure: 2, body: -1 } },
    ]},
    { id: 'e272', stage: 'work', eventType: 'choice', title: '同学合作', weight: 6, text: '你的老同学现在做生意做得不错，他想和你们单位合作一个项目。他找到你，希望你能帮忙牵线。', requireContact: 'classmate', pools: ['public'], choices: [
      { text: '在合规前提下帮忙牵线', effects: {contactRelation: { id: 'classmate', delta: 15}, background: 2, reputation: 1, workAbility: 1, mentalPressure: 2, risk: 1 } },
      { text: '介绍给相关部门负责人', effects: {contactRelation: { id: 'classmate', delta: 10}, background: 2, eq: 1, reputation: 1, mentalPressure: 1 } },
      { text: '婉拒说单位有规定', effects: {contactRelation: { id: 'classmate', delta: -5}, mentalPressure: -1, reputation: 1, integrity: 2 } },
      { text: '帮同学出主意怎么竞标', effects: {contactRelation: { id: 'classmate', delta: 10}, iq: 2, workAbility: 2, eq: 1, reputation: 1 } },
      { text: '建议同学走正规渠道', effects: {contactRelation: { id: 'classmate', delta: 5}, integrity: 2, eq: 1, reputation: 1, workAbility: 1 } },
    ]},
    { id: 'e273', year: [30, 65], stage: 'life', eventType: 'choice', title: '老友借钱', weight: 3, text: '你的老朋友遇到急事需要借钱，数额不小。你了解他的为人，但这么多钱你也不敢轻易借。', pools: ['public'], choices: [
      { text: '借给他并要求写借条', effects: {familyPressure: 2, mentalPressure: 2, eq: 1, reputation: 1, contact: { id: 'oldFriend', name: '老朋友', relation: 10, position: '普通职员', description: '多年好友'} } },
      { text: '借一部分表示心意', effects: {familyPressure: 1, mentalPressure: 1, eq: 1, reputation: 1, contact: { id: 'oldFriend', name: '老朋友', relation: 10, position: '普通职员', description: '多年好友'} } },
      { text: '婉拒并帮他想办法', effects: {eq: 1, iq: 2, reputation: 1, mentalPressure: 1, integrity: 1} },
      { text: '直接拒绝说手头紧', effects: {mentalPressure: -1, eq: -1, reputation: -1, familyPressure: -1, desire: 1} },
      { text: '帮他介绍贷款渠道', effects: {iq: 2, eq: 1, reputation: 1, background: 1, workAbility: 1} },
    ]},
    // ====== 新增生活事件 ======
    { id: 'e274', stage: 'life', eventType: 'choice', title: '周末休闲', weight: 3, text: '难得周末不用加班，你计划好好休息一下。是宅在家里看书，还是出去走走？', pools: ['public'], choices: [
      { text: '去公园散步呼吸新鲜空气', effects: {mentalPressure: -3, body: 1, eq: 1, reputation: 1} },
      { text: '在家看书学习', effects: {iq: 2, workAbility: 1, mentalPressure: -1, desire: 1} },
      { text: '约朋友一起吃饭', effects: {eq: 1, background: 1, mentalPressure: -2, reputation: 1, familyPressure: -1} },
      { text: '在家做一顿大餐', effects: {eq: 1, mentalPressure: -2, familyPressure: -1, body: 1} },
      { text: '去健身房锻炼', effects: {body: 2, mentalPressure: -2, desire: 1, eq: 1} },
    ]},
    { id: 'e275', stage: 'life', eventType: 'choice', title: '换手机', weight: 3, text: '你的手机用了好几年了，电池越来越不耐用。你犹豫要不要换新手机。', pools: ['public'], choices: [
      { text: '买最新款旗舰机', effects: {iq: 1, mentalPressure: -1, familyPressure: 2, desire: 1, reputation: 1} },
      { text: '买个中端性价比高的', effects: {iq: 2, familyPressure: -1, mentalPressure: -1, workAbility: 1} },
      { text: '换个电池继续用', effects: {iq: 1, familyPressure: -1, mentalPressure: 1} },
      { text: '等双十一再买', effects: {iq: 1, familyPressure: -1, mentalPressure: 1, desire: -1} },
      { text: '买二手旗舰机', effects: {iq: 1, familyPressure: -1, mentalPressure: 1, reputation: -1} },
    ]},
    { id: 'e276', stage: 'life', eventType: 'choice', title: '超市购物', weight: 3, text: '周末去超市采购，你发现物价又涨了。你看着购物车里的东西，感觉钱越来越不经花了。', pools: ['public'], choices: [
      { text: '精打细算只买必需品', effects: {familyPressure: -1, mentalPressure: 1, iq: 1, integrity: 1} },
      { text: '想吃什么就买什么', effects: {familyPressure: 2, mentalPressure: -1, desire: 1, body: 1} },
      { text: '囤一些打折商品', effects: {iq: 1, familyPressure: -1, mentalPressure: 1, desire: -1} },
      { text: '货比三家看哪家便宜', effects: {iq: 2, body: 1, mentalPressure: 1, familyPressure: -1} },
      { text: '网上买更便宜', effects: {iq: 1, familyPressure: -1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'e277', stage: 'life', eventType: 'choice', title: '看电影', weight: 3, text: '一部你期待已久的电影上映了。你买了票准备去看，但单位突然通知要加班。', pools: ['public'], choices: [
      { text: '去加班改天再看', effects: {positionWeight: 1, reputation: 1, workAbility: 1, mentalPressure: 2, desire: -1} },
      { text: '请个假去看电影', effects: {mentalPressure: -2, desire: 1, eq: 1, reputation: -1, positionWeight: -1} },
      { text: '加班后去看夜场', effects: {body: -1, mentalPressure: 2, workAbility: 1, desire: 1, positionWeight: 1} },
      { text: '把电影票送给同事', effects: {eq: 1, reputation: 1, background: 1, mentalPressure: 1} },
      { text: '和领导说明情况', effects: {eq: 1, integrity: 1, mentalPressure: 1, workAbility: 1, positionWeight: 1} },
    ]},
    { id: 'e278', stage: 'life', eventType: 'choice', title: '理发', weight: 3, text: '你常去的理发店涨价了，而且涨价幅度不小。你犹豫要不要换一家便宜的。', pools: ['public'], choices: [
      { text: '继续在这家剪', effects: {familyPressure: 1, mentalPressure: 1, reputation: 1, eq: 1} },
      { text: '换一家便宜的试试', effects: {familyPressure: -1, mentalPressure: 1, risk: 1, eq: 1} },
      { text: '自己学着剪', effects: {iq: 1, familyPressure: -1, mentalPressure: 1, body: 1} },
      { text: '和老板讨价还价', effects: {eq: 1, familyPressure: -1, mentalPressure: 1, integrity: 1} },
      { text: '剪更便宜的简单发型', effects: {familyPressure: -1, mentalPressure: -1, reputation: -1, iq: 1} },
    ]},
    { id: 'e279', stage: 'life', eventType: 'choice', title: '下雨天', weight: 3, text: '早上出门时下着大雨，你忘记带伞了。打卡还有5分钟，你是冲过去还是等雨停？', pools: ['public'], choices: [
      { text: '冲过去打卡再说', effects: {body: -1, mentalPressure: 1, positionWeight: 1, workAbility: 1, appearance: 1} },
      { text: '等雨小了再走', effects: {body: 1, mentalPressure: 1, positionWeight: -1, reputation: -1} },
      { text: '向同事借伞', effects: {eq: 1, background: 1, mentalPressure: -1, reputation: 1} },
      { text: '打车去单位', effects: {familyPressure: 1, mentalPressure: -1, body: 1, positionWeight: 1} },
      { text: '和领导说一声晚点到', effects: {eq: 1, integrity: 1, mentalPressure: -1, positionWeight: -1} },
    ]},
    { id: 'e280', stage: 'life', eventType: 'choice', title: '请客吃饭', weight: 3, text: '你升职了，同事们起哄让你请客。你算了算，请全科室吃饭要花不少钱。', pools: ['public'], choices: [
      { text: '大方请客感谢大家', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: 1, familyPressure: 2, luck: -1} },
      { text: '请简单的工作餐', effects: {eq: 1, reputation: 1, familyPressure: -1, mentalPressure: -1, background: 1, integrity: 1} },
      { text: '请大家喝奶茶', effects: {eq: 2, reputation: 1, familyPressure: -1, mentalPressure: -1, background: 1} },
      { text: '以最近手头紧为由不请', effects: {eq: -1, reputation: -1, background: -1, mentalPressure: 1} },
      { text: '请大家去家里做饭', effects: {eq: 2, reputation: 2, familyPressure: 1, mentalPressure: -1, background: 2} },
    ]},
    { id: 'e281', stage: 'life', eventType: 'choice', title: '体检', weight: 3, text: '单位组织体检，你躺在检查床上，等着做胃镜。你后悔平时没有好好吃饭。', pools: ['public'], choices: [
      { text: '认真对待所有检查项目', effects: {body: 2, mentalPressure: 1, workAbility: 1, integrity: 1, reputation: 1} },
      { text: '做完常规项目就走', effects: {mentalPressure: 1, body: 1, workAbility: 1} },
      { text: '增加几个自费项目', effects: {familyPressure: 1, body: 2, mentalPressure: 1, iq: 1} },
      { text: '找熟人医生仔细看看', effects: {background: 1, body: 2, mentalPressure: -1, familyPressure: 1} },
      { text: '拿到报告后认真解读', effects: {iq: 2, body: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'e282', stage: 'life', eventType: 'choice', title: '快递丢失', weight: 3, text: '你的快递显示已签收，但你并没有收到。联系快递员，他说放在门口了，但门口什么都没有。', pools: ['public'], choices: [
      { text: '联系快递公司索赔', effects: {iq: 2, mentalPressure: 2, integrity: 1, workAbility: 1} },
      { text: '查监控录像', effects: {iq: 2, mentalPressure: 2, workAbility: 1, risk: 1} },
      { text: '自认倒霉再买一个', effects: {familyPressure: 1, mentalPressure: 1, desire: -1} },
      { text: '投诉快递员', effects: {eq: 1, mentalPressure: 2, integrity: 1, reputation: 1} },
      { text: '联系卖家退款', effects: {iq: 1, mentalPressure: 1, integrity: 1, workAbility: 1} },
    ]},
    { id: 'e283', stage: 'life', eventType: 'choice', title: '天气异常', weight: 3, text: '今年夏天特别热，连续高温让你受不了。空调每天开十几个小时，电费涨了不少。', pools: ['public'], choices: [
      { text: '开空调注意节约用电', effects: {familyPressure: -1, body: 1, mentalPressure: 1, iq: 1, luck: -1} },
      { text: '去图书馆蹭空调', effects: {body: 1, mentalPressure: -1, iq: 1, workAbility: 1} },
      { text: '买台电风扇凑合', effects: {familyPressure: -1, body: 1, mentalPressure: -1} },
      { text: '去单位加班蹭空调', effects: {workAbility: 2, body: 1, mentalPressure: 1, positionWeight: 1} },
      { text: '装遮阳帘减少日晒', effects: {iq: 1, familyPressure: -1, body: 1, mentalPressure: 1} },
    ]},
    // ====== 补全缺失事件 ======
    { id: 'e284', stage: 'life', eventType: 'choice', title: '相亲风云', weight: 6, requireSingle: true, year: [22, 45], text: '家里给你安排了一次相亲，对方听说你是体制内的，表现得很热情。但你目前全身心扑在工作上。', pools: ['public'], choices: [
      { text: '认真见面了解，工作和生活都要兼顾', effects: {eq: 1, familyPressure: -3, mentalPressure: -1, desire: -1, flag: 'dating'} },
      { text: '以工作忙为由推掉', effects: {workAbility: 1, familyPressure: 3, mentalPressure: 2} },
      { text: '去见一面，但表示近期以事业为重', effects: {eq: 1, familyPressure: -1, mentalPressure: -1, flag: 'dating'} },
      { text: '让家里别再安排了，考完试再说', effects: {integrity: 1, familyPressure: 4, mentalPressure: 2, desire: 2} },
      { text: '请同事帮忙介绍更合适的', effects: {background: 1, eq: 1, familyPressure: -2, flag: 'dating'} },
    ]},
    { id: 'e288', stage: 'life', eventType: 'choice', title: '喜得贵子', weight: 8, year: [22, 45], text: '你的伴侣怀孕了！你们即将迎来新生命。这是人生中的一件大事，你需要好好规划未来。', pools: ['public'], requireMarried: true, requireNoChild: true, requireGender: '男', choices: [
      { text: '悉心照顾伴侣，准备迎接新生命', effects: {eq: 2, familyPressure: -4, mentalPressure: 2, desire: -1, child: true, appearance: 1} },
      { text: '请父母过来帮忙照顾', effects: {background: 1, familyPressure: -2, mentalPressure: 1, child: true} },
      { text: '找月嫂减轻负担', effects: {familyPressure: -3, mentalPressure: -1, eq: 1, child: true} },
      { text: '暂时以工作为重，让伴侣多担待', effects: {positionWeight: 1, workAbility: 1, familyPressure: 5, mentalPressure: 3, eq: -2, child: true} },
      { text: '请产假专心陪产', effects: {eq: 2, familyPressure: -5, mentalPressure: -2, positionWeight: -2, workAbility: -1, child: true} },
    ]},
    { id: 'e285', stage: 'life', eventType: 'choice', title: '二胎抉择', weight: 5, requireMarried: true, requireChild: true, text: '家里和亲戚都在劝你生二胎，但你和伴侣都觉得一个孩子已经够累了。体制内的工作稳定但收入也有限。', pools: ['public'], choices: [
      { text: '顺应家里意见，再生一个', effects: {familyPressure: 8, mentalPressure: 5, desire: 2, workAbility: -1, child: true, family: 1} },
      { text: '和伴侣商量后决定不要', effects: {eq: 1, familyPressure: -3, mentalPressure: -2, integrity: 1} },
      { text: '以工作太忙为由推迟决定', effects: {mentalPressure: -1, familyPressure: 3} },
      { text: '认真算一笔经济账，再做决定', effects: {iq: 2, familyPressure: 1, mentalPressure: 1, workAbility: 1} },
      { text: '和父母坦诚沟通，争取理解', effects: {eq: 2, familyPressure: -4, mentalPressure: -1, background: 1} },
    ]},
    { id: 'e286', stage: 'life', eventType: 'choice', title: '孩子叛逆', weight: 5, requireChild: true, text: '上初中的孩子成绩直线下滑，老师打电话说他在学校和同学打架。你赶到学校，发现孩子看你的眼神里充满了抵触。', pools: ['public'], choices: [
      { text: '耐心沟通，了解打架的真正原因', effects: {eq: 3, familyPressure: -3, mentalPressure: 2, integrity: 2, workAbility: -1} },
      { text: '严肃批评，强调学习的重要性', effects: {familyPressure: 2, mentalPressure: 3, eq: -1, integrity: 1} },
      { text: '和老师商量制定改进计划', effects: {workAbility: 2, eq: 1, familyPressure: -1, mentalPressure: 2} },
      { text: '反思自己陪伴太少，调整工作节奏', effects: {mentalPressure: -2, positionWeight: -2, familyPressure: -4, workAbility: -1, eq: 2} },
      { text: '请长辈帮忙管教', effects: {familyPressure: -2, mentalPressure: 1, background: 1, eq: 1} },
    ]},
    { id: 'e287', stage: 'life', eventType: 'choice', title: '婚姻危机', weight: 5, requireMarried: true, text: '你的伴侣最近经常抱怨你"把家当旅馆"，说感觉不到你的关心。你们已经冷战一周了。', pools: ['public'], choices: [
      { text: '主动沟通道歉，安排一次家庭旅行', effects: {eq: 2, familyPressure: -5, mentalPressure: -2, workAbility: -1, background: 1} },
      { text: '解释工作压力大，希望对方理解', effects: {eq: 1, familyPressure: 1, mentalPressure: 2, integrity: 1} },
      { text: '申请减少加班，多陪家人', effects: {body: 1, eq: 1, familyPressure: -4, mentalPressure: -2, positionWeight: -2, workAbility: -1} },
      { text: '让父母帮忙调解', effects: {familyPressure: -2, mentalPressure: 1, background: 1, eq: 1} },
      { text: '给伴侣写一封长信表达心声', effects: {eq: 2, familyPressure: -4, mentalPressure: -1, integrity: 2} },
    ]},


    { id: 'e263', stage: 'life', eventType: 'auto', title: '毕业', weight: 3, text: '在职求学的日子终于到头了。你顺利通过论文答辩，拿到了硕士学位！多年的坚持在这一刻有了回响。', pools: ['public'], requireFlag: 'studying', effects: {iq: 2, workAbility: 2, reputation: 2, positionWeight: 2, mentalPressure: -2, education: 'master'} },


    { id: 'e246', requireRisk: 12, requireHeat: 30, stage: 'work', eventType: 'auto', title: '调查升级', weight: 4, text: '你的事情引起了更高层的注意，调查级别从市纪委升级到了省纪委。你知道这意味着什么。', pools: ['public'], effects: {heat: 12, mentalPressure: 8, risk: 5} },

    { id: 'e238', requireHeat: 20, stage: 'work', eventType: 'auto', title: '风头过去', weight: 3, text: '这一轮反腐风暴终于过去了。你安然无恙地度过了危机，但你知道这只是暂时的。只要做过的事，就像埋在地里的种子，总有一天会发芽。', pools: ['public'], effects: {heat: -15, mentalPressure: -3, reputation: 1} },
    { id: 'e239', stage: 'work', eventType: 'auto', title: '调查升级（对抗激化）', weight: 4, text: '你试图对抗调查的行为激怒了调查组。他们决定扩大调查范围，不仅要查你，还要查你的亲属和关联人。', requireFlag: 'deniedAll', pools: ['public'], effects: {heat: 10, mentalPressure: 8, risk: 5, reputation: -3} },
    { id: 'e240', stage: 'work', eventType: 'auto', title: '被调查人反咬', weight: 4, text: '被你推卸责任的人拿出了证据证明自己的清白，同时反咬你一口。调查组现在完全倾向于相信他。', requireFlag: 'blamedOthers', pools: ['public'], effects: {heat: 8, risk: 5, mentalPressure: 6, reputation: -4, integrity: -3} },

    { id: 'e228', stage: 'work', eventType: 'auto', title: '数据失真', weight: 4, text: '你修改的数据在后续工作中被发现了。因为数据错误导致了一个重要决策失误，上级正在追查责任。', requireFlag: 'falsifiedRecords', pools: ['public'], effects: {risk: 6, reputation: -4, positionWeight: -3, mentalPressure: 5, integrity: -3} },


    // ====== 负面/惩罚事件 ======
    { id: 'e195', stage: 'work', eventType: 'auto', title: '通报批评（全市）', weight: 4, text: '你负责的工作出现了严重失误，被上级在全市通报批评。你的脸面丢尽了，同事们看你的眼神都变了。', pools: ['public'], effects: {reputation: -5, positionWeight: -3, mentalPressure: 6, desire: -2} },
    { id: 'e196', stage: 'work', eventType: 'auto', title: '考核垫底', weight: 4, text: '年度考核结果出来了，你的排名在单位垫底。按照末位淘汰制，你可能会被调离现岗位。', pools: ['public'], effects: {reputation: -4, positionWeight: -3, mentalPressure: 5, desire: -3, appearance: -1} },
    { id: 'e197', stage: 'work', eventType: 'auto', title: '群众举报', weight: 3, text: '有群众向纪委举报你"不作为、慢作为"。虽然你觉得自己很冤枉，但调查组已经进驻了。', pools: ['public'], requirePeopleReputationMax: 69, effects: {risk: 5, mentalPressure: 6, reputation: -2, positionWeight: -1, peopleReputation: -3} },
    { id: 'e198', stage: 'life', eventType: 'auto', title: '亲属出事', weight: 3, text: '你的一个远房亲属因为违法被公安机关抓了。虽然和你没有直接关系，但在单位里影响很不好。', pools: ['public'], effects: {reputation: -2, familyPressure: 5, mentalPressure: 4, risk: 2} },
    { id: 'e199', stage: 'work', eventType: 'auto', title: '问责处理', weight: 4, text: '因为你分管领域出现的问题，你被问责处理了。虽然只是诫勉谈话，但你的晋升前景受到了严重影响。', pools: ['public'], effects: {positionWeight: -4, reputation: -3, mentalPressure: 6, desire: -3, risk: 2} },
    { id: 'e200', stage: 'work', eventType: 'auto', title: '免职', weight: 4, text: '你的问题被查实了，虽然不构成犯罪，但已经不适合继续担任领导职务。你被免去了现职，等待重新安排。', pools: ['public'], effects: {positionWeight: -5, reputation: -4, mentalPressure: 6, desire: -3, leadershipRank: -1}, requireRisk: 30 },





    { id: 'e128', stage: 'work', eventType: 'auto', title: '基层经验转化', weight: 4, text: '基层历练阶段已经结束。无论你返回原单位、留任基层还是调往其他岗位，这段一线经验都会影响你今后的判断和群众工作。', requireFlag: 'grassrootsTraining', excludeFlag: 'grassrootsActive', effects: {workAbility: 5, reputation: 4, positionWeight: 3, background: 3, eq: 2, mentalPressure: -2, desire: 1, peopleReputation: 4} },

    { id: 'e125', stage: 'work', eventType: 'auto', title: '名声大噪', weight: 4, text: '这场风波不仅没有影响你，反而让更多人认识了你。你在系统内的知名度大幅提升，甚至有人开始称你为"改革先锋"。', requireFlag: 'mediaExposure', effects: {reputation: 8, positionWeight: 2, background: 4, workAbility: 2, mentalPressure: -2, desire: 2} },



    { pools: ['public'], id: 'e086', stage: 'life', eventType: 'auto', title: '子女成年', weight: 5, text: '孩子已经长大成人，考上了大学。你送孩子去学校的那天，突然意识到自己真的老了。', requireChild: true, requireChildAgeMin: 18, effects: {familyPressure: -3, mentalPressure: -2, desire: -1, appearance: 1} }, // v2.58 补年龄门槛（原无门槛，孩子刚出生就"考上大学"）
    // ====== 阶段性里程碑事件 ======
    { id: 'e087', stage: 'work', eventType: 'auto', title: '工作五年', weight: 5, text: '转眼间你已经工作五年了。从当年的新人变成了现在能独当一面的骨干。回顾这五年，有收获也有遗憾。', minYear: 5, effects: {workAbility: 3, positionWeight: 2, mentalPressure: -1, reputation: 1} },
    { id: 'e088', stage: 'work', eventType: 'auto', title: '工作十年', weight: 5, text: '十年了。你看着新来的年轻人，就像看到当年的自己。你开始理解当年老领导说的那些话。', minYear: 10, effects: {workAbility: 2, positionWeight: 2, desire: 1, mentalPressure: -1, eq: 1} },
    { id: 'e089', stage: 'work', eventType: 'auto', title: '工作十五年', weight: 5, text: '十五年的职业生涯，你已经看透了体制内的很多事。你知道什么时候该进，什么时候该退。', minYear: 15, effects: {workAbility: 2, iq: 1, eq: 1, mentalPressure: -1, reputation: 1} },
    { id: 'e090', stage: 'work', eventType: 'auto', title: '工作二十年', weight: 5, text: '二十年了。你已经是单位里的"老人"了。新来的年轻人叫你"老师"，你开始考虑自己的职业遗产。', minYear: 20, effects: {workAbility: 2, positionWeight: 2, reputation: 2, background: 1, desire: -1} },
    { id: 'e091', stage: 'work', eventType: 'auto', title: '工作二十五年', weight: 5, text: '二十五年。你距离退休越来越近了。回首往事，你发现自己最在意的不是晋升了几次，而是做成了哪些事。', minYear: 25, effects: {integrity: 2, mentalPressure: -2, reputation: 2, desire: -2, positionWeight: 1} },
    { id: 'e092', stage: 'work', eventType: 'auto', title: '工作三十年', weight: 5, text: '三十年！你已经在体制内干了大半辈子。当年一起入职的人，有的已经高升，有的已经退休，有的已经不在人世。', minYear: 30, effects: {reputation: 3, positionWeight: 2, mentalPressure: -2, integrity: 2, background: 2} },

    // ====== 跨系统交流事件 ======
    { id: 'e300', stage: 'work', eventType: 'choice', title: '跨系统交流', weight: 4, text: '上级组织了一个跨系统交流学习项目，你可以申请到其他系统单位工作半年。这是一个拓宽视野的好机会，但也意味着要离开熟悉的环境。', pools: ['public'], choices: [
      { text: '申请到同系统上级单位交流', effects: {background: 3, workAbility: 2, reputation: 2, mentalPressure: 3, positionWeight: 1, flag: 'crossSystemExchange'} },
      { text: '申请到不同系统单位学习', effects: {background: 4, workAbility: 3, iq: 2, mentalPressure: 4, desire: 2, flag: 'crossSystemExchange'} },
      { text: '留在原单位深耕本职工作', effects: {workAbility: 2, positionWeight: 2, mentalPressure: -1, integrity: 1} },
      { text: '推荐同事去参加', effects: {eq: 2, background: 2, reputation: 2, integrity: 1} },
      { text: '申请去基层单位交流', effects: {background: 2, workAbility: 3, eq: 1, mentalPressure: 5, body: 1, positionWeight: 1, flag: 'crossSystemExchange'} },
    ]},
    { id: 'e301', stage: 'work', eventType: 'choice', title: '系统内举荐', weight: 4, text: '你在系统内的表现引起了上级关注。一位同系统的老领导主动联系你，说有一个跨系统交流到重要部门的机会，问你是否愿意尝试。', pools: ['public'], choices: [
      { text: '抓住机会，准备跨系统调动', effects: {desire: 3, background: 3, mentalPressure: 4, positionWeight: 2, reputation: 2, flag: 'crossSystemMove'} },
      { text: '委婉拒绝，留在本系统发展', effects: {integrity: 2, background: 1, mentalPressure: -1, positionWeight: 1, reputation: 1} },
      { text: '请老领导推荐其他机会', effects: {eq: 2, background: 2, reputation: 2, desire: 1} },
      { text: '表示需要时间考虑', effects: {eq: 1, mentalPressure: 2, desire: 1, background: 1} },
      { text: '直接申请跨系统调动', effects: {desire: 4, background: 2, mentalPressure: 5, risk: 2, positionWeight: 1, flag: 'crossSystemMove'} },
    ]},
    { id: 'e302', stage: 'work', eventType: 'choice', title: '跨系统借调', weight: 4, text: '上级部门发来借调函，希望你到另一个系统的核心部门工作一年。借调结束后可能有机会正式调入，但也有可能回不来。', pools: ['public'], choices: [
      { text: '接受借调，开拓新领域', effects: {workAbility: 3, background: 3, mentalPressure: 5, desire: 2, reputation: 2, positionWeight: 1, flag: 'crossSystemSecondment'} },
      { text: '接受借调但争取保留关系', effects: {eq: 1, workAbility: 2, background: 2, mentalPressure: 3, reputation: 1, flag: 'crossSystemSecondment'} },
      { text: '拒绝借调，稳定为主', effects: {positionWeight: 1, mentalPressure: -1, integrity: 1, reputation: -1} },
      { text: '推荐单位其他同事去', effects: {eq: 2, background: 1, reputation: 2, integrity: 1} },
      { text: '提出条件再接受', effects: {iq: 2, eq: 1, background: 2, mentalPressure: 3, positionWeight: 1, flag: 'crossSystemSecondment'} },
    ]},
    { id: 'e303', stage: 'work', eventType: 'auto', title: '跨系统晋升', weight: 4, text: '你在跨系统交流期间表现突出，对方单位非常欣赏你的能力，正式向你发出了调任邀请。这不仅是一次跨系统调动，更是一次重要的晋升机会！', requireFlag: 'crossSystemExchange', effects: {background: 5, positionWeight: 3, reputation: 4, workAbility: 2, desire: 2, mentalPressure: 3} },
    { id: 'e304', stage: 'work', eventType: 'auto', title: '借调转正', weight: 4, text: '一年的借调期即将结束，借调单位对你的工作非常满意，正式提出将你调入。你的跨系统转任成功了！', requireFlag: 'crossSystemSecondment', effects: {background: 4, positionWeight: 3, reputation: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e305', stage: 'work', eventType: 'auto', title: '跨系统任职', weight: 4, text: '经过多方协调，你的跨系统调动申请获得批准。你即将到一个全新的系统任职，开启职业生涯的新篇章。', requireFlag: 'crossSystemMove', effects: {background: 4, positionWeight: 2, reputation: 3, desire: 3, mentalPressure: 5} },

    // ====== 人生里程碑事件 ======
    { id: 'e306', stage: 'life', eventType: 'auto', title: '而立之年', weight: 3, text: '你三十岁了。古人说三十而立，你看着自己这十年的职业生涯，有升迁的喜悦，也有加班的疲惫。未来的路还很长。', pools: ['public'], effects: {mentalPressure: -2, desire: 2, workAbility: 1, reputation: 1} },
    { id: 'e307', stage: 'life', eventType: 'auto', title: '四十不惑', weight: 4, text: '你四十岁了。你越来越清楚自己适合什么、想要什么。体制内混了这么多年，你终于学会了和"不确定"和平共处。', pools: ['public'], effects: {mentalPressure: -3, integrity: 2, eq: 1, reputation: 1} },
    { id: 'e308', stage: 'life', eventType: 'auto', title: '知天命之年', weight: 4, text: '你五十岁了。你开始认真考虑退休后的生活。这些年你见过太多人来人往，你知道有些事比职级更重要。', pools: ['public'], effects: {mentalPressure: -3, desire: -3, integrity: 3, reputation: 2, background: 1} },

    // ====== 辞职/下海选项 ======
    { id: 'e309', stage: 'work', eventType: 'choice', title: '辞职下海', weight: 4, text: '你的一个老同学创业成功，邀请你加入他的公司做合伙人，开出的薪酬是你目前工资的三倍。你第一次认真考虑是否要离开体制。', choices: [
      { text: '婉拒邀请，继续在体制内发展', effects: {integrity: 2, reputation: 2, mentalPressure: 1, desire: -1} },
      { text: '先了解创业项目再做决定', effects: {iq: 2, workAbility: 1, mentalPressure: 2, desire: 2} },
      { text: '申请停薪留职给自己留后路', effects: {background: 1, reputation: -1, mentalPressure: 3, desire: 2, risk: 1} },
      { text: '辞职下海，接受挑战！', effects: {flag: 'resigned', reputation: -5, mentalPressure: 5, desire: 6, risk: 3} },
      { text: '建议老同学和单位合作', effects: {eq: 2, background: 2, reputation: 1, workAbility: 1} },
    ]},
    { id: 'e310', stage: 'work', eventType: 'auto', title: '下海成功', weight: 4, text: '辞职后你全身心投入创业，凭借在体制内积累的人脉和对政策的理解，公司业务蒸蒸日上。你证明了自己不只会写材料。', requireFlag: 'resigned', effects: {desire: 2, mentalPressure: -5, reputation: 4, background: 3} },
    { id: 'e311', stage: 'work', eventType: 'auto', title: '下海失败', weight: 4, text: '创业远比你想象的艰难。市场不景气，合伙人意见不合，你开始怀念体制内稳定的日子。但路是自己选的，咬着牙也要走下去。', requireFlag: 'resigned', effects: {desire: -3, mentalPressure: 8, reputation: -3, integrity: 1} },

    // ====== 处分警告系统 ======
    { id: 'e312', stage: 'work', eventType: 'choice', title: '工作失误', weight: 3, text: '你负责的一项工作出现了重大失误，虽然没有造成严重后果，但领导非常生气，要求严肃处理。', choices: [
      { text: '主动承担责任，写检讨书', effects: {integrity: 4, mentalPressure: 5, reputation: -2, positionWeight: -2, flag: 'writtenSelfCriticism'} },
      { text: '解释客观原因争取谅解', effects: {eq: 1, mentalPressure: 3, reputation: -1, positionWeight: -1, risk: 1} },
      { text: '拉上相关同事一起承担责任', effects: {background: 1, mentalPressure: 2, positionWeight: -1, reputation: -2, risk: 2} },
      { text: '找领导说情大事化小', effects: {background: 2, reputation: -2, mentalPressure: 1, risk: 3, integrity: -2} },
      { text: '连夜补救争取挽回损失', effects: {workAbility: 3, body: -2, mentalPressure: 6, positionWeight: 2, reputation: 1} },
    ]},
    { id: 'e313', stage: 'work', eventType: 'auto', title: '通报批评（大会）', weight: 4, text: '你在大会上被通报批评了。虽然不是处分，但面子上过不去。你暗下决心，绝不能再有下次。', effects: {reputation: -3, positionWeight: -2, desire: 2, mentalPressure: 4, workAbility: 2} },
    { id: 'e314', stage: 'work', eventType: 'auto', title: '警告处分', weight: 3, text: '经组织研究决定，给予你警告处分。这份处分将记入档案，影响你未来两年的晋升。你深刻体会到了"纪律"二字的重量。', effects: {reputation: -5, positionWeight: -5, desire: -3, mentalPressure: 8, risk: -3, integrity: 2} },
    { id: 'e315', stage: 'work', eventType: 'auto', title: '记过处分', weight: 3, text: '你的违规行为被查实，组织决定给予记过处分。这意味着你的晋升将暂停至少一年，年度考核也被评为不合格。', effects: {reputation: -4, positionWeight: -4, mentalPressure: 6, desire: -3, risk: -3, integrity: 3}, requireRisk: 20 },
    { id: 'e316', stage: 'work', eventType: 'auto', title: '处分期满', weight: 4, text: '处分期终于结束了！你长长地舒了一口气。这段经历让你更加谨慎，也更加珍惜现在的工作。', requireFlag: 'writtenSelfCriticism', effects: {reputation: 3, positionWeight: 3, mentalPressure: -5, integrity: 3, workAbility: 2} },

    // ====== 乡镇/基层专属事件池 ======
    { id: 'e317', stage: 'work', eventType: 'choice', title: '驻村走访', weight: 3, text: '乡镇安排你驻村走访，了解村民的实际困难。第一家走访的是留守老人王大爷家，他反映低保金好久没发了。', pools: ['乡镇', '街道'], choices: [
      { text: '详细记录并联系民政部门核实', effects: {workAbility: 3, reputation: 2, integrity: 2, mentalPressure: 2, background: 1, peopleReputation: 3} },
      { text: '先安抚老人情绪，承诺尽快解决', effects: {eq: 2, mentalPressure: 1, reputation: 1, background: 1, peopleReputation: 2} },
      { text: '当场打电话给民政所询问情况', effects: {workAbility: 2, integrity: 2, risk: 1, mentalPressure: 2, peopleReputation: 2} },
      { text: '告诉老人这个不归乡镇管', effects: {mentalPressure: -1, risk: -1, reputation: -2, integrity: -1, desire: 1, peopleReputation: -4} },
      { text: '自掏腰包先给老人垫付', effects: {integrity: 3, reputation: 2, familyPressure: 2, mentalPressure: 1, peopleReputation: 3} },
    ]},
    { id: 'e318', stage: 'work', eventType: 'choice', title: '防汛抗旱', weight: 3, text: '汛期来临，乡镇需要24小时值班巡查水库。你被安排带队值守，天气预报说今晚有暴雨。', pools: ['乡镇', '街道'], choices: [
      { text: '亲自带队巡查每一处隐患点', effects: {workAbility: 3, body: -2, reputation: 3, mentalPressure: 4, positionWeight: 2, flag: 'floodDuty'} },
      { text: '安排各村支书分片值守', effects: {workAbility: 2, eq: 1, mentalPressure: 2, background: 1} },
      { text: '在办公室值班随时待命', effects: {risk: 1, mentalPressure: 1, positionWeight: -1, body: 1} },
      { text: '提前组织群众转移避险', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 4, flag: 'floodDuty'} },
      { text: '检查防汛物资储备情况', effects: {workAbility: 2, mentalPressure: 1, body: 1, risk: -1} },
    ]},
    { id: 'e319', stage: 'work', eventType: 'auto', title: '抗洪表彰', weight: 4, text: '你在防汛工作中的表现得到了县里通报表扬！群众说"关键时刻还是干部靠得住"，这句话比任何表彰都珍贵。', requireFlag: 'floodDuty', pools: ['乡镇', '街道'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, mentalPressure: -2, background: 2, peopleReputation: 5} },
    { id: 'e320', stage: 'work', eventType: 'choice', title: '乡村振兴', weight: 6, text: '县里推进乡村振兴示范村建设，你负责的村被列为试点。但村两委班子不团结，村民对项目也有疑虑。', pools: ['乡镇', '街道', '县级'], choices: [
      { text: '挨家挨户做思想工作', effects: {workAbility: 3, body: -1, mentalPressure: 4, eq: 1, reputation: 2} },
      { text: '先统一村两委班子思想', effects: {eq: 2, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '请县里领导来站台鼓劲', effects: {background: 2, reputation: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '先做样板工程给村民看', effects: {workAbility: 3, desire: 1, mentalPressure: 3, risk: 1, flag: 'ruralRevitalize'} },
      { text: '组织村民代表外出学习', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e321', stage: 'work', eventType: 'auto', title: '振兴成果', weight: 4, text: '示范村建设取得了显著成效！村容村貌焕然一新，村民收入也有了明显提高。你成了县里的"乡村振兴能手"。', requireFlag: 'ruralRevitalize', pools: ['乡镇', '街道', '县级'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, background: 3, mentalPressure: -2} },

    // ====== 县级专属事件池 ======
    { id: 'e322', stage: 'work', eventType: 'choice', title: '招商引资', weight: 3, text: '县里给每个部门分配了招商引资任务，你的指标是5000万。你手上没有企业资源，但完不成任务会影响年终考核。', pools: ['县级','市级'], choices: [
      { text: '梳理现有企业资源，以商招商', effects: {workAbility: 3, desire: 2, mentalPressure: 3, background: 2, flag: 'investmentTask'} },
      { text: '找在外地发展的老乡帮忙', effects: {background: 3, eq: 1, mentalPressure: 2, reputation: 1} },
      { text: '通过网络平台发布招商信息', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: 1} },
      { text: '请领导帮忙对接资源', effects: {background: 2, positionWeight: 1, mentalPressure: 1, eq: 1} },
      { text: '上报困难请求调整指标', effects: {integrity: 2, positionWeight: -2, mentalPressure: -1, risk: 1} },
    ]},
    { id: 'e323', stage: 'work', eventType: 'auto', title: '招商成功（亿元签约）', weight: 4, text: '经过多轮洽谈，你成功引进了一个亿元项目！签约仪式上，县领导握着你的手说"干得漂亮！"', requireFlag: 'investmentTask', pools: ['县级','市级'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, background: 3, mentalPressure: -3, desire: 2} },
    { id: 'e324', stage: 'work', eventType: 'choice', title: '环保督查', weight: 3, text: '中央环保督察组下沉到县里，群众举报了一个违规排放的工厂。县领导让你带队去处理，但你发现这个工厂是县里的纳税大户。', pools: ['县级','市级'], choices: [
      { text: '依法查封，限期整改', effects: {integrity: 4, workAbility: 2, risk: 3, mentalPressure: 4, reputation: 2} },
      { text: '先约谈企业负责人，给整改期限', effects: {eq: 2, workAbility: 2, mentalPressure: 2, risk: 1, background: 1} },
      { text: '上报县领导请示处理意见', effects: {background: 2, positionWeight: 1, integrity: 2, mentalPressure: 2} },
      { text: '帮企业想办法过关', effects: {background: 2, risk: 6, integrity: -4, mentalPressure: 3, desire: 2, flag: 'coveredPollution'} },
      { text: '找替代方案劝导企业搬迁', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, eq: 1} },
    ]},
    { id: 'e325', stage: 'work', eventType: 'auto', title: '污染曝光', weight: 4, text: '你帮企业掩盖污染的事被环保志愿者曝光了！网上舆论汹涌，上级成立调查组追责。', requireFlag: 'coveredPollution', pools: ['县级','市级'], effects: {risk: 10, reputation: -8, positionWeight: -5, mentalPressure: 10, integrity: -5} },

    // ====== 市级专属事件池 ======
    { id: 'e326', stage: 'work', eventType: 'choice', title: '文明城市', weight: 3, text: '市里正在创建全国文明城市，你被抽调到创建办。省里检查组下周就要来了，但还有好几个暗访发现的问题没有整改。', pools: ['市级','县级'], choices: [
      { text: '逐项整改，建立台账销号制度', effects: {workAbility: 3, mentalPressure: 4, reputation: 2, positionWeight: 2, flag: 'cityCivilization'} },
      { text: '先集中力量做表面文章', effects: {desire: 2, risk: 3, integrity: -2, mentalPressure: 3, reputation: 1} },
      { text: '发动志愿者和社区力量', effects: {eq: 2, background: 2, mentalPressure: 2, workAbility: 2} },
      { text: '向上级申请延期检查', effects: {background: 2, risk: 1, mentalPressure: 1, positionWeight: -1} },
      { text: '对照测评标准逐项过筛', effects: {iq: 2, workAbility: 2, mentalPressure: 3, integrity: 2} },
    ]},
    { id: 'e327', stage: 'work', eventType: 'auto', title: '创建成功', weight: 4, text: '经过全市上下共同努力，文明城市创建成功了！你是创建工作组的骨干成员，名字出现在了表彰名单上。', requireFlag: 'cityCivilization', pools: ['市级','县级'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, mentalPressure: -3, background: 2} },
    { id: 'e328', stage: 'work', eventType: 'choice', title: '城市规划', weight: 3, text: '市里要修编城市总体规划，涉及老城区改造和新城区开发。各方利益博弈激烈，拆迁户、开发商、文物保护单位各有诉求。', pools: ['市级','县级'], choices: [
      { text: '深入调研，平衡各方利益', effects: {workAbility: 3, eq: 1, mentalPressure: 4, reputation: 2, iq: 2} },
      { text: '优先考虑发展，推进新城建设', effects: {desire: 3, workAbility: 2, mentalPressure: 3, risk: 2, background: 1} },
      { text: '保护老城风貌，控制开发强度', effects: {integrity: 3, reputation: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '组织专家论证和公众听证', effects: {iq: 3, workAbility: 2, mentalPressure: 3, reputation: 2, integrity: 2} },
      { text: '参考其他城市成功经验', effects: {iq: 2, workAbility: 2, mentalPressure: 1, risk: -1} },
    ]},

    // ====== 省级专属事件池 ======
    { id: 'e329', stage: 'work', eventType: 'choice', title: '政策调研', weight: 3, text: '省领导交办一项重要调研任务，要求对全省某个领域的政策执行情况进行评估，并提出改革建议。时间紧、任务重。', pools: ['省级','市级'], choices: [
      { text: '组建专班，深入基层一线调研', effects: {workAbility: 3, mentalPressure: 4, reputation: 2, positionWeight: 2, background: 2, flag: 'policyResearch'} },
      { text: '委托高校智库做第三方评估', effects: {iq: 3, workAbility: 2, mentalPressure: 2, background: 1, reputation: 1} },
      { text: '调取各地市数据做统计分析', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: 1} },
      { text: '在现有材料基础上提炼观点', effects: {workAbility: 1, mentalPressure: 1, positionWeight: 1, risk: -1} },
      { text: '组织座谈会听取各方意见', effects: {eq: 2, background: 2, mentalPressure: 2, workAbility: 1} },
    ]},
    { id: 'e330', stage: 'work', eventType: 'auto', title: '调研成果', weight: 4, text: '调研报告得到了省领导的高度评价，批示"建议很有价值，请相关部门研究落实"。你的名字在省政府系统内传开了。', requireFlag: 'policyResearch', pools: ['省级','市级'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, background: 3, mentalPressure: -2} },
    { id: 'e331', stage: 'work', eventType: 'choice', title: '省管干部', weight: 3, text: '你被列为省管干部考察对象，组织部门开始了全面考察。你的履历、家庭背景、工作表现都会被仔细审查。', pools: ['省级','市级'], choices: [
      { text: '积极配合考察，如实汇报情况', effects: {integrity: 3, reputation: 2, mentalPressure: 3, positionWeight: 2, background: 1} },
      { text: '主动向考察组展示工作成绩', effects: {desire: 3, positionWeight: 2, mentalPressure: 3, reputation: 1, risk: 1} },
      { text: '请老领导帮忙说好话', effects: {background: 3, risk: 2, mentalPressure: 2, positionWeight: 1, eq: 1} },
      { text: '保持平常心，顺其自然', effects: {integrity: 2, mentalPressure: -1, reputation: 1, desire: -1} },
      { text: '提前准备应对可能的问题', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
    ]},

    // ====== 政法系统专属事件池 ======
    { id: 'e332', stage: 'work', eventType: 'choice', title: '案件评查', weight: 3, text: '上级政法委开展案件质量评查，你发现一个经手案件存在程序瑕疵，但如果纠正可能会引发当事人上访。', pools: ['政法系统', '执法部门'], choices: [
      { text: '如实上报问题，主动纠错', effects: {integrity: 4, workAbility: 2, risk: 2, mentalPressure: 4, reputation: 2} },
      { text: '先内部补正程序再归档', effects: {workAbility: 2, integrity: 2, risk: 3, mentalPressure: 2} },
      { text: '请示领导如何处置', effects: {background: 2, positionWeight: 1, mentalPressure: 2, eq: 1} },
      { text: '压下来不报，等评查结束', effects: {risk: 5, integrity: -3, mentalPressure: 3, reputation: -1} },
      { text: '主动联系当事人说明情况', effects: {eq: 2, integrity: 3, mentalPressure: 3, reputation: 2, workAbility: 1} },
    ]},
    { id: 'e333', stage: 'work', eventType: 'choice', title: '扫黑除恶', weight: 3, text: '你被抽调到扫黑除恶专项斗争工作组，负责线索核查。一条举报线索指向了当地一位有背景的企业家，很多人劝你"别碰"。', pools: ['政法系统', '执法部门', '党委系统'], choices: [
      { text: '依法核查，一查到底', effects: {integrity: 4, workAbility: 3, risk: 5, mentalPressure: 5, reputation: 3, flag: 'antiGang'} },
      { text: '先外围调查，不打草惊蛇', effects: {iq: 3, workAbility: 2, mentalPressure: 3, risk: 2, background: 1} },
      { text: '向组长汇报，由组织决定', effects: {background: 2, positionWeight: 2, mentalPressure: 2, integrity: 2} },
      { text: '以证据不足为由暂缓核查', effects: {risk: 3, integrity: -2, mentalPressure: 1, reputation: -1} },
      { text: '联合其他部门共同核查', effects: {eq: 1, workAbility: 2, mentalPressure: 3, background: 2} },
    ]},
    { id: 'e334', stage: 'work', eventType: 'auto', title: '打黑表彰', weight: 4, text: '扫黑除恶专项行动取得重大成果！你负责核查的线索挖出了一个盘踞多年的黑恶势力团伙，你被记三等功一次！', requireFlag: 'antiGang', pools: ['政法系统', '执法部门', '党委系统'], effects: {reputation: 8, positionWeight: 4, workAbility: 3, mentalPressure: -3, background: 3} },

];
