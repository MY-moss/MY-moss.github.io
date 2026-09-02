// ===== 基础通用事件·第5批 =====
// id 范围：e335~e423（89条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：基础通用事件收尾批，按数量拆分
const gd_events_basic_5 = [
    // ====== 技术/数据部门专属事件池 ======
    { id: 'e335', stage: 'work', eventType: 'choice', title: '系统上线', weight: 3, text: '你负责推进的政务信息化系统即将上线，但在试运行阶段发现了大量问题。用户反馈界面复杂、操作卡顿，业务部门抱怨"还不如原来的系统"。', pools: ['技术部门', '数据部门', '政府部门', '民生部门'], choices: [
      { text: '加班修复问题，推迟上线时间', effects: {workAbility: 3, body: -2, mentalPressure: 5, reputation: 1, integrity: 2} },
      { text: '先上线再逐步优化', effects: {desire: 2, risk: 2, mentalPressure: 2, positionWeight: 1, reputation: -1} },
      { text: '组织用户培训，收集反馈', effects: {eq: 2, workAbility: 2, mentalPressure: 3, background: 1, flag: 'systemLaunch'} },
      { text: '回滚到旧系统，重新规划', effects: {integrity: 2, mentalPressure: 2, risk: 1, positionWeight: -2} },
      { text: '请第三方公司做压力测试', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
    ]},
    { id: 'e336', stage: 'work', eventType: 'auto', title: '系统成功', weight: 4, text: '经过不断优化，新系统终于稳定运行了！用户反馈良好，政务服务效率提升了30%。你主导的数字化改革经验在全省推广。', requireFlag: 'systemLaunch', pools: ['技术部门', '数据部门', '政府部门'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, background: 3, mentalPressure: -3} },
    { id: 'e337', stage: 'work', eventType: 'choice', title: '数据安全（被攻击）', weight: 3, text: '单位数据库疑似被黑客攻击，部分敏感数据可能已经泄露。你作为技术负责人，必须在第一时间做出反应。', pools: ['技术部门', '数据部门', '政府部门'], choices: [
      { text: '立即启动应急预案，断网隔离', effects: {workAbility: 3, integrity: 3, mentalPressure: 4, reputation: 2, risk: -2} },
      { text: '先排查漏洞再上报', effects: {iq: 3, workAbility: 2, mentalPressure: 3, risk: 1} },
      { text: '立即上报领导并报警', effects: {integrity: 3, background: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '悄悄修复，避免扩大影响', effects: {mentalPressure: -1, iq: 1, risk: 3, integrity: -2, reputation: -1, flag: 'hidDataBreach'} },
      { text: '联系网络安全公司协助', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e338', stage: 'work', eventType: 'auto', title: '数据泄露（瞒报被查）', weight: 4, text: '你隐瞒数据泄露的事被上级发现了！因为数据泄露导致了严重后果，你将面临严肃处理。', requireFlag: 'hidDataBreach', pools: ['技术部门', '数据部门', '政府部门'], effects: {risk: 10, reputation: -6, positionWeight: -5, mentalPressure: 8, integrity: -4} },

    // ====== 民生部门专属事件池 ======
    { id: 'e339', stage: 'work', eventType: 'choice', title: '低保核查', weight: 3, text: '你负责低保资格复核工作，发现一个村有十几户"关系保"——不符合条件但通过关系拿到了低保名额。清退会得罪人，不清退违规。', pools: ['民生部门', '窗口部门', '基层单位'], choices: [
      { text: '依法清退，建立动态核查机制', effects: {integrity: 4, workAbility: 3, risk: 3, mentalPressure: 4, reputation: 2} },
      { text: '先核实情况，区别对待', effects: {eq: 2, workAbility: 2, mentalPressure: 2, background: 1, integrity: 2} },
      { text: '上报局领导请求指导', effects: {background: 2, positionWeight: 1, mentalPressure: 2, risk: 1} },
      { text: '睁一只眼闭一只眼', effects: {risk: 4, integrity: -3, mentalPressure: 1, reputation: -1} },
      { text: '重新制定更严格的审核标准', effects: {iq: 2, workAbility: 2, mentalPressure: 3, integrity: 3, flag: 'welfareReform'} },
    ]},
    { id: 'e340', stage: 'work', eventType: 'auto', title: '改革成效', weight: 4, text: '你的低保改革方案被上级采纳，在全省推广！不仅清退了违规户，还让真正困难的群众得到了保障。群众送来了锦旗。', requireFlag: 'welfareReform', pools: ['民生部门', '窗口部门', '基层单位'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, background: 2, mentalPressure: -2} },
    { id: 'e341', stage: 'work', eventType: 'choice', title: '应急处突', weight: 3, text: '突发公共卫生事件，你所在的部门被推到了第一线。物资调配、人员安排、信息发布，千头万绪。', pools: ['民生部门', '卫健', '医保', '应急'], choices: [
      { text: '制定应急预案，分工到人', effects: {workAbility: 3, mentalPressure: 4, reputation: 2, positionWeight: 2, flag: 'epidemicResponse'} },
      { text: '优先保障一线人员物资', effects: {eq: 2, integrity: 2, mentalPressure: 3, reputation: 3, background: 1} },
      { text: '及时发布权威信息稳定民心', effects: {iq: 2, workAbility: 2, mentalPressure: 3, reputation: 2} },
      { text: '向上级请求支援', effects: {background: 2, mentalPressure: 2, positionWeight: 1, risk: -1} },
      { text: '协调各部门联动', effects: {eq: 2, workAbility: 2, mentalPressure: 3, background: 2} },
    ]},
    { id: 'e342', stage: 'work', eventType: 'auto', title: '表彰嘉奖', weight: 4, text: '突发公共事件应急处置工作告一段落！你因为在关键时刻的出色表现，被授予"应急处突先进个人"称号。', requireFlag: 'epidemicResponse', pools: ['民生部门', '卫健', '医保', '应急'], effects: {reputation: 6, positionWeight: 3, workAbility: 2, mentalPressure: -3, background: 2} },

    // ====== 党委系统专属事件池 ======
    { id: 'e343', stage: 'work', eventType: 'choice', title: '党建考核', weight: 3, text: '年底党建考核来了，你负责的支部党建工作台账还不完善。考核结果直接关系单位评优，领导很重视。', pools: ['党委系统', '机关'], choices: [
      { text: '逐项对照标准补齐台账', effects: {workAbility: 3, mentalPressure: 3, reputation: 2, positionWeight: 1, integrity: 2, flag: 'partyExam'} },
      { text: '把日常工作"包装"成亮点', effects: {desire: 2, risk: 2, mentalPressure: 2, reputation: 1, integrity: -1} },
      { text: '请兄弟单位分享经验', effects: {eq: 1, background: 2, mentalPressure: 1, workAbility: 1} },
      { text: '平时工作扎实不怕检查', effects: {integrity: 3, mentalPressure: -1, reputation: 1, positionWeight: 1, flag: 'partyExam'} },
      { text: '组织支部党员集中补材料', effects: {workAbility: 2, mentalPressure: 3, risk: 1, integrity: -1} },
    ]},
    { id: 'e344', stage: 'work', eventType: 'auto', title: '党建先进', weight: 4, text: '党建考核结果出来了，你的支部被评为"先进党支部"！你作为支部书记在经验交流会上做了典型发言。', requireFlag: 'partyExam', pools: ['党委系统', '机关'], effects: {reputation: 4, positionWeight: 3, background: 2, mentalPressure: -2, desire: 1} },
    { id: 'e345', stage: 'work', eventType: 'choice', title: '干部考察', weight: 3, text: '省委组织部来单位开展干部考察工作，你被列为推荐考察对象。这是你职业生涯的重要关口。', pools: ['党委系统', '机关'], choices: [
      { text: '全面梳理工作业绩，做好准备', effects: {workAbility: 3, desire: 2, mentalPressure: 3, reputation: 2, positionWeight: 2} },
      { text: '走访座谈对象，争取支持', effects: {eq: 2, background: 2, mentalPressure: 2, risk: 1, reputation: 1} },
      { text: '以平常心对待，真实展现自己', effects: {integrity: 3, mentalPressure: -1, reputation: 1, positionWeight: 1} },
      { text: '请领导帮忙推荐', effects: {background: 3, risk: 1, mentalPressure: 2, positionWeight: 1, eq: 1} },
      { text: '了解考察流程，针对性准备', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
    ]},

    // ====== 短链事件（2-3事件链，自然触发）=====
    // 链1: 师徒传承
    { id: 'e346', stage: 'work', eventType: 'choice', title: '师徒结对（青蓝工程）', weight: 3, text: '单位开展"青蓝工程"师徒结对活动，一位经验丰富的老同志愿意带你。他告诉你"在体制内，跟对人比做对事更重要"。', choices: [
      { text: '虚心学习，主动请教', effects: {workAbility: 3, background: 2, mentalPressure: 1, eq: 1, flag: 'hasMentor'} },
      { text: '礼貌接受但保持独立', effects: {eq: 1, integrity: 1, mentalPressure: 1, workAbility: 1} },
      { text: '婉拒，觉得自己不需要', effects: {positionWeight: -1, risk: 1, mentalPressure: -1} },
      { text: '积极表现争取师傅认可', effects: {desire: 2, workAbility: 2, mentalPressure: 2, background: 1, flag: 'hasMentor'} },
      { text: '请师傅吃饭搞好关系', effects: {eq: 1, background: 2, risk: 1, mentalPressure: 1, flag: 'hasMentor'} },
    ]},
    { id: 'e347', stage: 'work', eventType: 'auto', title: '师傅推荐', weight: 4, text: '你的师傅在退休前向组织郑重推荐了你。他说"这孩子是我带过的最有悟性的年轻人"，这份推荐的分量很重。', requireFlag: 'hasMentor', effects: {background: 4, positionWeight: 3, reputation: 3, workAbility: 2, mentalPressure: -1} },

    // 链2: 培训深造
    { id: 'e348', stage: 'work', eventType: 'choice', title: '党校培训', weight: 3, text: '你被推荐参加市委党校中青年干部培训班，为期三个月。这是组织重点培养的信号，但培训期间的工作需要有人接替。', choices: [
      { text: '珍惜机会，全心投入学习', effects: {iq: 2, workAbility: 2, background: 2, reputation: 2, mentalPressure: 2, flag: 'partySchool'} },
      { text: '培训期间兼顾单位工作', effects: {workAbility: 2, body: -1, mentalPressure: 3, positionWeight: 1, reputation: 1} },
      { text: '利用培训拓展人脉', effects: {eq: 2, background: 3, mentalPressure: 1, desire: 2, flag: 'partySchool'} },
      { text: '以工作忙为由推掉', effects: {desire: -1, positionWeight: -2, mentalPressure: -1, reputation: -1, eq: 1} },
      { text: '培训中多写材料多发言', effects: {workAbility: 2, positionWeight: 2, mentalPressure: 2, reputation: 1, flag: 'partySchool'} },
    ]},
    { id: 'e349', stage: 'work', eventType: 'auto', title: '党校毕业', weight: 4, text: '党校培训结束了，你被评为"优秀学员"。结业证书上写着"建议列入后备干部培养计划"。', requireFlag: 'partySchool', effects: {reputation: 4, positionWeight: 3, background: 2, mentalPressure: -2, desire: 2} },

    // 链3: 宣传工作
    { id: 'e350', stage: 'work', eventType: 'choice', title: '宣传任务', weight: 3, text: '单位需要一篇重量级宣传稿件，领导点名让你来写。这是展示你文字功底的好机会，但要求很高——要上省报头版。', choices: [
      { text: '深入采访，精心打磨稿件', effects: {workAbility: 3, mentalPressure: 3, reputation: 2, positionWeight: 2, flag: 'pressArticle'} },
      { text: '参考兄弟单位的优秀稿件', effects: {workAbility: 2, mentalPressure: 1, risk: 1} },
      { text: '请宣传部门同事帮忙把关', effects: {eq: 1, background: 1, mentalPressure: 1, workAbility: 1} },
      { text: '用AI辅助生成初稿再润色', effects: {iq: 2, workAbility: 2, mentalPressure: 1, risk: 1} },
      { text: '推掉任务，让更有经验的人写', effects: {mentalPressure: -1, positionWeight: -2, reputation: -1, desire: -1, eq: 1} },
    ]},
    { id: 'e351', stage: 'work', eventType: 'auto', title: '文章发表', weight: 4, text: '你的稿件不仅在省报头版发表了，还得到了省委宣传部领导的批示表扬！单位领导逢人就夸你是"笔杆子"。', requireFlag: 'pressArticle', effects: {reputation: 5, positionWeight: 3, workAbility: 2, background: 2, mentalPressure: -2, appearance: 1} },

    // 链4: 调研获奖
    { id: 'e352', stage: 'work', eventType: 'choice', title: '调研征文', weight: 3, text: '省里开展优秀调研报告评选活动，领导鼓励大家踊跃投稿。你的日常工作中有很多值得总结的经验，但写成报告需要花不少时间。', choices: [
      { text: '认真总结工作经验，撰写调研报告', effects: {workAbility: 3, mentalPressure: 3, reputation: 2, positionWeight: 1, iq: 2, flag: 'researchAward'} },
      { text: '把日常工作数据整理成报告', effects: {workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '请有经验的同事指导', effects: {eq: 1, background: 1, mentalPressure: 1, workAbility: 1} },
      { text: '工作太忙，不参加了', effects: {desire: -1, mentalPressure: -1, positionWeight: -1, reputation: 1} },
      { text: '联合其他科室共同撰写', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1, flag: 'researchAward'} },
    ]},
    { id: 'e353', stage: 'work', eventType: 'auto', title: '调研获奖', weight: 4, text: '你的调研报告获得了一等奖！颁奖仪式上，省领导亲自为你颁发证书，并鼓励你"继续深入基层，写出更多好报告"。', requireFlag: 'researchAward', effects: {reputation: 5, positionWeight: 3, workAbility: 2, iq: 2, mentalPressure: -2} },

    // 链5: 群众口碑
    { id: 'e354', stage: 'work', eventType: 'choice', title: '群众求助', weight: 3, text: '一位老大爷在单位门口堵住了你，说他儿子在工地上受伤了，包工头不管不问。他找了几个部门都说"不归我们管"，你看着他无助的眼神，于心不忍。', choices: [
      { text: '详细了解情况，帮他联系相关部门', effects: {workAbility: 3, integrity: 2, reputation: 2, mentalPressure: 2, eq: 1, flag: 'helpedCitizen'} },
      { text: '告诉他应该走法律途径', effects: {integrity: 2, mentalPressure: 1, eq: 1, risk: -1} },
      { text: '自掏腰包先给他一点钱', effects: {integrity: 2, reputation: 1, familyPressure: 2, mentalPressure: 1} },
      { text: '给他在媒体上呼吁一下', effects: {eq: 1, reputation: 2, risk: 2, mentalPressure: 2, background: 1} },
      { text: '联系法律援助中心帮忙', effects: {iq: 2, workAbility: 2, integrity: 2, mentalPressure: 1, flag: 'helpedCitizen'} },
    ]},
    { id: 'e355', stage: 'work', eventType: 'auto', title: '锦旗感谢', weight: 4, text: '老大爷的问题解决了！他儿子拿到了工伤赔偿，老大爷带着一面锦旗来到单位，上面写着"人民公仆，心系百姓"。这件事在单位里传为佳话。', requireFlag: 'helpedCitizen', effects: {reputation: 4, positionWeight: 2, workAbility: 2, mentalPressure: -2, integrity: 2} },

    // 链6: 考霸之路
    { id: 'e356', stage: 'work', eventType: 'choice', title: '考证机会', weight: 3, text: '单位鼓励大家考取专业资格证书，通过后可以报销考试费用，还能在职称评定中加分。你心动了，但备考需要占用大量休息时间。', choices: [
      { text: '报名考试，制定学习计划', effects: {iq:3, workAbility:3, mentalPressure:2, desire:1, body:-1, flag: 'studying'} },
      { text: '先看看考试难度再决定', effects: {iq: 1, mentalPressure: 1, workAbility: 1} },
      { text: '工作太忙，暂时不考虑', effects: {desire:-1, mentalPressure:1, positionWeight:-1, reputation:-1} },
      { text: '买教材回来自学', effects: {iq: 1, workAbility: 1, mentalPressure: 2, desire: 1, flag: 'studying'} },
      { text: '报培训班系统学习', effects: {iq: 2, workAbility: 2, mentalPressure: 3, familyPressure: 2, background: 1, flag: 'studying'} },
    ]},
    { id: 'e357', stage: 'work', eventType: 'auto', title: '考证通过', weight: 4, text: '你通过了专业资格考试，拿到了证书！这不仅为职称评定加了分，还让你在专业领域有了更多发言权。', requireFlag: 'studying', effects: {iq: 2, workAbility: 2, reputation: 2, positionWeight: 2, mentalPressure: -2} },

    // 链7: 见义勇为
    { id: 'e358', stage: 'life', eventType: 'choice', title: '路遇险情', weight: 4, text: '下班路上，你看到有人落水了。河边围了不少人，但没人敢下水。你会游泳，但河水很急，天也快黑了。', pools: ['public'], choices: [
      { text: '毫不犹豫跳下水救人', effects: {integrity: 4, reputation: 3, body: -2, risk: 2, mentalPressure: 2, flag: 'savedPerson'} },
      { text: '找绳子或救生圈扔过去', effects: {iq: 2, workAbility: 1, mentalPressure: 1, integrity: 2} },
      { text: '大声呼救找更多人帮忙', effects: {eq: 1, integrity: 2, mentalPressure: 1, background: 1} },
      { text: '打110和120报警', effects: {integrity: 2, mentalPressure: 1, workAbility: 1} },
      { text: '看看有没有其他人会游泳', effects: {mentalPressure: -1, risk: -1, integrity: -1, reputation: -1, desire: 1} },
    ]},
    { id: 'e359', stage: 'life', eventType: 'auto', title: '见义勇为', weight: 4, text: '你救人的事迹被媒体报道了！单位专门开了表彰会，授予你"见义勇为先进个人"称号。你在单位里成了英雄。', requireFlag: 'savedPerson', pools: ['public'], effects: {reputation: 8, positionWeight: 3, background: 2, mentalPressure: -2, integrity: 3} },

    // 链8: 志愿服务
    { id: 'e360', stage: 'work', eventType: 'choice', title: '志愿活动', weight: 3, text: '单位组织党员志愿者到社区开展服务活动，帮助孤寡老人打扫卫生、修理家电。你手上的工作也很紧，但这是党组织生活的一部分。', choices: [
      { text: '积极参加，认真服务群众', effects: {integrity: 2, reputation: 2, background: 1, mentalPressure: 1, eq: 1, flag: 'volunteerWork'} },
      { text: '参加但心不在焉', effects: {eq: 1, mentalPressure: 1, integrity: -1} },
      { text: '以工作忙为由请假', effects: {positionWeight: -1, reputation: -1, mentalPressure: -1} },
      { text: '带相机去拍照留痕', effects: {desire: 2, positionWeight: 1, risk: 1, integrity: -1} },
      { text: '主动承担最累的活', effects: {workAbility: 2, integrity: 2, reputation: 2, body: -1, flag: 'volunteerWork'} },
    ]},
    { id: 'e361', stage: 'work', eventType: 'auto', title: '志愿者之星', weight: 4, text: '你在志愿服务中的表现被社区书记写进了感谢信，送到了单位领导手中。你被评为年度"优秀志愿者"。', requireFlag: 'volunteerWork', effects: {reputation: 3, positionWeight: 2, background: 1, mentalPressure: -1, integrity: 2} },

    // 链9: 家庭支持
    { id: 'e362', stage: 'life', eventType: 'choice', title: '家庭聚餐', weight: 3, text: '周末家里安排了家庭聚餐，但你有一个紧急材料要赶。家人说"你每次都忙，什么时候能陪我们吃顿饭？"', pools: ['public'], choices: [
      { text: '放下工作，陪家人吃饭', effects: {familyPressure: -3, mentalPressure: -2, eq: 1, reputation: 1, workAbility: -1, flag: 'familySupport'} },
      { text: '吃完饭再回单位加班', effects: {body: -1, mentalPressure: 2, familyPressure: -1, workAbility: 1, eq: 1} },
      { text: '解释工作重要性，改天再聚', effects: {workAbility: 2, familyPressure: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '把材料带回家，边吃边做', effects: {body: -1, mentalPressure: 3, familyPressure: 1, workAbility: 1} },
      { text: '让家人把饭送到单位来', effects: {familyPressure: 2, mentalPressure: 1, reputation: -1, eq: -1} },
    ]},
    { id: 'e363', stage: 'life', eventType: 'auto', title: '家和万事兴', weight: 4, text: '家人的理解和支持是你最大的后盾。因为有了温暖的家庭，你在工作中也更加从容自信。', requireFlag: 'familySupport', pools: ['public'], effects: {familyPressure: -5, mentalPressure: -3, eq: 1, workAbility: 1, reputation: 1} },

    // 链10: 维护正义
    { id: 'e364', stage: 'work', eventType: 'choice', title: '目睹不公', weight: 3, text: '你看到同事在办事过程中故意刁难群众，群众敢怒不敢言。你心里不舒服，但直接指出同事的问题可能会影响同事关系。', choices: [
      { text: '当场制止，维护群众权益', effects: {integrity: 4, eq: 1, risk: 2, mentalPressure: 3, reputation: 2, flag: 'stoodUpJustice'} },
      { text: '事后私下提醒同事', effects: {eq: 2, background: 1, mentalPressure: 1, integrity: 2} },
      { text: '向领导反映情况', effects: {integrity: 3, background: 1, risk: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '装作没看见', effects: {integrity: -2, mentalPressure: 2, reputation: -1, risk: -1} },
      { text: '主动帮群众把事情办了', effects: {workAbility: 2, eq: 1, reputation: 2, mentalPressure: 2, integrity: 2} },
    ]},
    { id: 'e365', stage: 'work', eventType: 'auto', title: '公正表彰', weight: 4, text: '你坚持原则的事迹被群众写在了感谢信里。领导在大会上表扬你"敢于坚持原则，维护群众利益"，号召大家向你学习。', requireFlag: 'stoodUpJustice', effects: {reputation: 5, positionWeight: 2, integrity: 3, mentalPressure: -2, background: 2} },

    // ====== 自然触发事件（基于玩家状态，无flag要求）=====
    { id: 'e366', stage: 'work', eventType: 'auto', title: '入职周年', weight: 4, text: '今天是你入职三周年。三年前的今天你满怀憧憬走进这个院子，现在你已经熟悉了这里的每一间办公室、每一台打印机、每一张报销单。', effects: {mentalPressure: -1, workAbility: 1, desire: 1, positionWeight: 1} },
    { id: 'e367', stage: 'work', eventType: 'choice', title: '年度考核', weight: 3, text: '一年一度的考核开始了。你要写个人述职报告，同事要给你打分，领导要给你写评语。你觉得自己这一年表现如何？', choices: [
      { text: '认真总结成绩和不足', effects: {workAbility: 2, integrity: 2, mentalPressure: 1, reputation: 1, positionWeight: 1} },
      { text: '把小事写成亮点', effects: {desire: 2, risk: 1, mentalPressure: 1, positionWeight: 1} },
      { text: '主动找领导沟通争取好评', effects: {eq: 1, background: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '如实评价自己，不夸大', effects: {integrity: 3, mentalPressure: -1, reputation: 1} },
      { text: '请同事帮忙美言几句', effects: {eq: 1, background: 1, risk: 1, mentalPressure: 1} },
    ]},
    { id: 'e368', stage: 'work', eventType: 'auto', title: '年度优秀', weight: 3, text: '年度考核结果出来了！你被评为"优秀"等次。这是对你一年工作的最好肯定，也是来年晋升的重要加分项。', effects: {reputation: 3, positionWeight: 2, desire: 2, mentalPressure: -2, workAbility: 1} },
    { id: 'e369', stage: 'work', eventType: 'choice', title: '年终总结', weight: 3, text: '年底了，各个科室都在写年终总结。你发现有些科室的数据水分很大，把自己的工作成绩放大了好几倍。', choices: [
      { text: '实事求是写自己的总结', effects: {integrity: 3, workAbility: 1, reputation: 2, mentalPressure: 1} },
      { text: '适当美化但不说谎', effects: {workAbility: 1, desire: 1, mentalPressure: 1, positionWeight: 1} },
      { text: '参考其他科室的写法', effects: {workAbility: 1, mentalPressure: 1, risk: 1} },
      { text: '在领导面前多汇报成绩', effects: {desire: 2, positionWeight: 2, mentalPressure: 2, background: 1} },
      { text: '指出数据造假的问题', effects: {integrity: 4, risk: 3, mentalPressure: 3, reputation: 2, positionWeight: -1, flag: 'calledOutFraud'} },
    ]},
    { id: 'e370', stage: 'work', eventType: 'auto', title: '整顿风气', weight: 4, text: '你反映的数据造假问题引起了领导重视，单位开展了"数据质量专项整治"。你虽然得罪了一些人，但大家私底下都佩服你的勇气。', requireFlag: 'calledOutFraud', effects: {reputation: 3, positionWeight: 2, integrity: 3, mentalPressure: -2, background: 1} },

    // ====== 更多生活类事件 ======
    { id: 'e371', stage: 'life', eventType: 'choice', title: '生日聚会', weight: 3, text: '今天是你生日。同事们张罗着要给你庆祝，你不太想大张旗鼓，但拒绝大家的好意又显得不合群。', pools: ['public'], choices: [
      { text: '请大家吃顿饭，简单庆祝', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: -1, familyPressure: 1} },
      { text: '婉拒，和家人一起过', effects: {familyPressure: -2, mentalPressure: -1, eq: 1, integrity: 1} },
      { text: '买蛋糕到办公室分给大家', effects: {eq: 1, background: 1, mentalPressure: 1, reputation: 1} },
      { text: '借口有事推掉', effects: {mentalPressure: -1, eq: -1, background: -1, reputation: -1} },
      { text: '请大家周末一起去郊游', effects: {eq: 2, background: 2, mentalPressure: 1, familyPressure: 1} },
    ]},
    { id: 'e372', stage: 'life', eventType: 'choice', title: '兴趣社团', weight: 3, text: '单位工会组织了多个兴趣小组，有篮球、书法、摄影等。你一直想培养一个工作之外的爱好，但总觉得自己没时间。', pools: ['public'], choices: [
      { text: '报名参加摄影小组', effects: {eq: 1, mentalPressure: -2, workAbility: 1, background: 1, flag: 'hobbyGroup'} },
      { text: '参加篮球小组锻炼身体', effects: {body: 2, mentalPressure: -2, eq: 1, workAbility: 1, flag: 'hobbyGroup'} },
      { text: '参加书法小组修身养性', effects: {integrity: 2, mentalPressure: -2, eq: 1, workAbility: 1, flag: 'hobbyGroup'} },
      { text: '工作太忙，不参加了', effects: {desire: -1, mentalPressure: -1, body: -1, reputation: 1} },
      { text: '每个小组都去看看', effects: {eq: 1, background: 1, mentalPressure: 1, body: 1} },
    ]},
    { id: 'e373', stage: 'life', eventType: 'auto', title: '爱好成趣', weight: 4, text: '你坚持了一段时间的爱好，不仅技能提升了，还认识了一群志同道合的朋友。工作之外有了精神寄托，整个人的状态都好多了。', requireFlag: 'hobbyGroup', pools: ['public'], effects: {mentalPressure: -3, eq: 1, body: 1, reputation: 1, background: 1} },

    // ====== 跨链/多路径事件 ======
    { id: 'e374', stage: 'work', eventType: 'choice', title: '同事竞争', weight: 3, text: '你和同科室的小李都被列入了后备干部名单，但只有一个提拔名额。最近小李开始在各种场合表现自己，甚至抢你的功劳。', choices: [
      { text: '用工作实绩说话，不搞小动作', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 2, positionWeight: 1, flag: 'fairCompetitor'} },
      { text: '也积极表现，不让小李专美', effects: {desire: 3, workAbility: 2, mentalPressure: 3, positionWeight: 1, reputation: 1} },
      { text: '找领导谈心，表达自己的想法', effects: {eq: 1, background: 1, mentalPressure: 2, positionWeight: 2} },
      { text: '散布小李的负面消息', effects: {risk: 5, integrity: -4, mentalPressure: 3, reputation: -2, desire: 2, flag: 'dirtyCompetitor'} },
      { text: '主动帮助小李，共同进步', effects: {eq: 2, reputation: 2, integrity: 2, background: 1, mentalPressure: 1} },
    ]},
    { id: 'e375', stage: 'work', eventType: 'choice', title: '股权诱惑', weight: 3, text: '你负责审批的一个项目方提出，愿意给你公司"干股"，不需要你出钱，每年分红。他们说这是"行业惯例"。', pools: ['public'], choices: [
      { text: '严词拒绝，按规矩办事', effects: {integrity: 4, risk: -3, mentalPressure: 2, reputation: 2} },
      { text: '假装考虑，拖时间', effects: {risk: 3, mentalPressure: 2, integrity: -1, flag: 'consideredBribe'} },
      { text: '接受干股，享受分红', effects: {wealth: 30, desire: 4, risk: 8, heat: 8, integrity: -5, mentalPressure: 3, flag: 'tookShares'} }, // v2.59 补 heat（原收干股无热度）
      { text: '录音取证，向纪委举报', effects: {integrity: 4, risk: -2, mentalPressure: 3, reputation: 3, workAbility: 2} },
      { text: '让亲属代持', effects: {wealth: 30, risk: 6, integrity: -3, desire: 3, mentalPressure: 2, familyPressure: 2, flag: 'tookShares'} },
    ]},
    { id: 'e376', stage: 'work', eventType: 'choice', title: '审计风暴', weight: 4, text: '上级审计组进驻单位进行为期一个月的全面审计。你经手的项目很多，虽然自认为没问题，但审计组的气氛让人紧张。', pools: ['public'], choices: [
      { text: '积极配合审计，主动提供资料', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, reputation: 2, background: 1} },
      { text: '自查自纠，提前补漏', effects: {workAbility: 2, mentalPressure: 3, iq: 2, risk: -1} },
      { text: '和审计组搞好关系', effects: {eq: 1, background: 2, mentalPressure: 1, risk: 1, body: 1} },
      { text: '销毁可能存在问题的材料', effects: {wealth: 10, risk: 8, integrity: -5, mentalPressure: 5, reputation: -3, flag: 'destroyedEvidence'} },
      { text: '请教有经验的同事如何应对', effects: {eq: 1, workAbility: 1, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e377', stage: 'work', eventType: 'auto', title: '审计通过', weight: 3, text: '审计结束了，你的工作得到了审计组的好评。审计报告中对你的评价是"程序规范、资料齐全、配合积极"。', effects: {reputation: 3, positionWeight: 2, integrity: 2, mentalPressure: -3} },

    // ====== 退休前后事件 ======
    { id: 'e378', stage: 'work', eventType: 'choice', title: '退休准备', year: [45, 60], weight: 4, text: '离退休越来越近了，你开始整理自己的办公室。这些年积累的文件、笔记、纪念品，每一件都承载着一段回忆。', choices: [
      { text: '认真整理，做好交接工作', effects: {integrity: 2, workAbility: 2, reputation: 2, mentalPressure: -2, positionWeight: 1} },
      { text: '把有用的经验写成工作手册', effects: {workAbility: 3, reputation: 3, integrity: 2, mentalPressure: -1, flag: 'retirementPlan'} },
      { text: '悄悄把个人物品带回家', effects: {mentalPressure: -1, integrity: -1, reputation: 1} },
      { text: '请同事们吃饭告别', effects: {eq: 1, background: 2, reputation: 1, mentalPressure: -1} },
      { text: '提前规划退休生活', effects: {mentalPressure: -2, familyPressure: -1, desire: -1, flag: 'retirementPlan'} },
    ]},
    { id: 'e379', stage: 'work', eventType: 'auto', title: '光荣退休', year: [50, 65], weight: 4, text: '退休仪式上，领导高度评价了你几十年的工作。同事们送上了鲜花和纪念册。你看着一张张熟悉的面孔，眼眶有些湿润。', requireFlag: 'retirementPlan', effects: {reputation: 4, mentalPressure: -5, familyPressure: -3, integrity: 2, background: 1} },

    // ====== 特殊触发：高压后的心理调整 ======
    { id: 'e380', stage: 'life', eventType: 'choice', title: '心理咨询', weight: 5, text: '最近工作压力太大，你开始出现失眠、焦虑的症状。单位有免费的心理咨询服务，但你犹豫要不要去——怕被人说"心理素质差"。', pools: ['public'], requireMentalPressure: 50, choices: [
      { text: '主动预约心理咨询', effects: {mentalPressure: -5, integrity: 2, body: 1, workAbility: 1, eq: 1} },
      { text: '找朋友倾诉释放压力', effects: {mentalPressure: -3, eq: 1, background: 1, familyPressure: -1} },
      { text: '通过运动缓解焦虑', effects: {body: 2, mentalPressure: -3, workAbility: 1, eq: 1} },
      { text: '硬扛着，相信会过去', effects: {mentalPressure: 2, body: -1, risk: 1, integrity: 1} },
      { text: '请假休息几天调整', effects: {mentalPressure: -4, body: 1, workAbility: -1, positionWeight: -1} },
    ]},

    // =====================================================================
    // 第三批新增事件：更多池专属事件 + 短链 + 高权重触发
    // =====================================================================

    // ====== 乡镇/街道池（权重提升至4-5） ======
    { id: 'e381', stage: 'work', eventType: 'choice', title: '春耕生产', weight: 5, text: '春耕时节，乡镇安排你去村里指导农业生产。但很多青壮年都外出打工了，留守老人种地吃力。', pools: ['乡镇', '街道'], choices: [
      { text: '组织党员干部帮农户春耕', effects: {workAbility: 3, reputation: 3, integrity: 2, mentalPressure: 3, body: -1, flag: 'springPlow'} },
      { text: '协调农机合作社提供机械服务', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1, eq: 1} },
      { text: '向上级申请春耕补贴', effects: {background: 2, mentalPressure: 2, reputation: 1, workAbility: 1} },
      { text: '统计各户需求统一安排', effects: {workAbility: 2, eq: 1, mentalPressure: 1, integrity: 1} },
      { text: '引导村民调整种植结构', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
    ]},
    { id: 'e382', stage: 'work', eventType: 'auto', title: '春耕表彰', weight: 3, text: '你组织的春耕生产工作得到了县里通报表扬！县领导说"这才是真正的为农服务"，你心里暖暖的。', requireFlag: 'springPlow', pools: ['乡镇', '街道'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, mentalPressure: -2, background: 2} },
    { id: 'e383', stage: 'work', eventType: 'choice', title: '纠纷调解', weight: 5, text: '两户村民因为宅基地边界问题闹得不可开交，差点动手。村里调解了几次都没用，现在双方都扬言要上访。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '实地丈量，查阅历史档案', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 2, eq: 1, flag: 'landMediation'} },
      { text: '请双方家族长辈出面调解', effects: {eq: 2, background: 2, mentalPressure: 2, reputation: 1} },
      { text: '各打五十大板强制处理', effects: {risk: 2, mentalPressure: 2, reputation: -1, integrity: -1} },
      { text: '上报司法所依法处理', effects: {integrity: 2, workAbility: 1, mentalPressure: 1, background: 1} },
      { text: '利用村规民约柔性化解', effects: {eq: 1, workAbility: 2, integrity: 2, mentalPressure: 2} },
    ]},
    { id: 'e384', stage: 'work', eventType: 'auto', title: '调解成功', weight: 3, text: '经过耐心调解，两户村民终于握手言和！你不仅解决了纠纷，还消除了一个上访隐患。村民们都说"这个干部办事公道"。', requireFlag: 'landMediation', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 5, positionWeight: 2, workAbility: 2, mentalPressure: -2, eq: 1} },
    { id: 'e385', stage: 'work', eventType: 'choice', title: '秸秆禁烧', weight: 5, text: '到了秸秆禁烧的关键期，乡镇干部全部下村巡查。你发现一位老大爷偷偷在地里烧秸秆，看到你来了，他手足无措地站在那里。', pools: ['乡镇', '街道'], choices: [
      { text: '讲明政策，帮助处理秸秆', effects: {workAbility: 3, eq: 1, integrity: 2, reputation: 2, mentalPressure: 2} },
      { text: '按规定罚款并批评教育', effects: {integrity: 3, risk: -1, mentalPressure: 1, reputation: 1} },
      { text: '睁一只眼闭一只眼', effects: {risk: 2, integrity: -2, mentalPressure: -1, reputation: -1} },
      { text: '帮老人把火扑灭后耐心劝导', effects: {eq: 2, workAbility: 2, reputation: 2, integrity: 2, mentalPressure: 1} },
      { text: '联系农机合作社回收秸秆', effects: {iq: 2, workAbility: 2, background: 1, mentalPressure: 1, reputation: 1} },
    ]},

    // ====== 县级池（权重提升至4-5） ======
    { id: 'e386', stage: 'work', eventType: 'choice', title: '县域经济', weight: 5, text: '县里要制定"十四五"县域经济发展规划，你是起草组成员。领导要求"要有亮点、有突破"，但县里的资源有限。', pools: ['县级','市级'], choices: [
      { text: '深入调研各县域产业基础', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, background: 2, flag: 'countyPlan'} },
      { text: '借鉴先进县市成功经验', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '突出本县特色产业优势', effects: {desire: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '请省里专家把脉问诊', effects: {background: 2, iq: 2, mentalPressure: 2, reputation: 1} },
      { text: '组织各部门座谈征求意见', effects: {eq: 2, workAbility: 1, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e387', stage: 'work', eventType: 'auto', title: '规划通过', weight: 3, text: '你参与编制的县域经济发展规划在县政府常务会上顺利通过！领导评价"有思路、有措施、有操作性"。', requireFlag: 'countyPlan', pools: ['县级','市级'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e388', stage: 'work', eventType: 'choice', title: '脱贫攻坚', weight: 5, text: '脱贫攻坚成果巩固拓展工作进入关键期，你负责的村有两户存在返贫风险。一户因病、一户因学。', pools: ['县级', '乡镇', '街道'], choices: [
      { text: '制定"一户一策"帮扶方案', effects: {workAbility: 3, integrity: 2, reputation: 2, mentalPressure: 3, eq: 1, flag: 'povertyAlleviation'} },
      { text: '帮助申请大病救助和教育补贴', effects: {workAbility: 2, integrity: 3, mentalPressure: 2, background: 1, reputation: 2} },
      { text: '联系爱心企业结对帮扶', effects: {eq: 1, background: 2, mentalPressure: 2, reputation: 1} },
      { text: '安排公益性岗位增加收入', effects: {workAbility: 2, eq: 1, mentalPressure: 2, reputation: 1} },
      { text: '上报县里争取专项帮扶资金', effects: {background: 2, mentalPressure: 2, reputation: 1, workAbility: 1} },
    ]},
    { id: 'e389', stage: 'work', eventType: 'auto', title: '脱贫验收', weight: 3, text: '省里组织的脱贫成果验收顺利通过！你负责的村没有出现返贫现象，验收组对帮扶工作给予了高度评价。', requireFlag: 'povertyAlleviation', pools: ['县级', '乡镇', '街道'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, background: 2, mentalPressure: -2} },

    // ====== 市级池（权重提升至4-5） ======
    { id: 'e390', stage: 'work', eventType: 'choice', title: '市域治理', weight: 5, text: '市里推进市域社会治理现代化试点，你所在的部门承担了重要任务。需要建立一套新的治理体系，涉及多个部门的协调。', pools: ['市级','县级'], choices: [
      { text: '搭建跨部门协调联动机制', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, background: 2, flag: 'cityGovernance'} },
      { text: '引入数字化治理平台', effects: {iq: 3, workAbility: 2, mentalPressure: 3, risk: 1, background: 1} },
      { text: '学习先进城市治理经验', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '深入基层调研痛点难点', effects: {workAbility: 2, eq: 1, mentalPressure: 2, reputation: 2} },
      { text: '邀请专家团队规划设计', effects: {background: 2, iq: 2, mentalPressure: 2, reputation: 1} },
    ]},
    { id: 'e391', stage: 'work', eventType: 'auto', title: '治理典范', weight: 3, text: '你主导的市域社会治理创新经验被省委政法委点名表扬，作为典型在全省推广！你成了市里的"改革名人"。', requireFlag: 'cityGovernance', pools: ['市级','县级'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, background: 3, mentalPressure: -2} },
    { id: 'e392', stage: 'work', eventType: 'choice', title: '国资监管', weight: 5, text: '市属国有企业改革进入深水区，你负责监管的一家国企出现了经营困难，职工工资都发不出来了。', pools: ['市级', '政府部门'], choices: [
      { text: '深入企业调研，找出亏损原因', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, background: 1, flag: 'stateOwnedReform'} },
      { text: '推动企业引入战略投资者', effects: {desire: 2, background: 2, mentalPressure: 3, risk: 2, workAbility: 1} },
      { text: '建议企业裁减冗余人员', effects: {risk: 3, integrity: 2, mentalPressure: 4, reputation: -1, workAbility: 1} },
      { text: '协调财政资金应急纾困', effects: {background: 2, mentalPressure: 3, reputation: 1, workAbility: 1} },
      { text: '组织专家会诊企业病症', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e393', stage: 'work', eventType: 'auto', title: '国企改革', weight: 3, text: '国企改革方案实施后，企业扭亏为盈，职工工资正常发放了！你因为改革有功，被市政府记功一次。', requireFlag: 'stateOwnedReform', pools: ['市级', '政府部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, background: 2, mentalPressure: -2} },

    // ====== 省级池（权重提升至5） ======
    { id: 'e394', stage: 'work', eventType: 'choice', title: '省级督查', weight: 5, text: '你被抽调到省委督查室，负责对一项重大决策部署的落实情况进行督查。你要面对的是各地市的各种"花式汇报"。', pools: ['省级','市级'], choices: [
      { text: '明察暗访结合，不听汇报看实效', effects: {workAbility: 3, integrity: 3, mentalPressure: 4, reputation: 2, background: 2, flag: 'provincialInspection'} },
      { text: '调取数据做定量分析', effects: {iq: 3, workAbility: 2, mentalPressure: 2, risk: 1} },
      { text: '听取各地市汇报后总结', effects: {workAbility: 1, mentalPressure: 1, positionWeight: 1, risk: -1} },
      { text: '深入基层群众了解真实情况', effects: {eq: 2, workAbility: 2, mentalPressure: 3, reputation: 2} },
      { text: '利用大数据比对发现问题', effects: {iq: 3, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e395', stage: 'work', eventType: 'auto', title: '督查成果', weight: 3, text: '督查报告得到了省委主要领导的批示！报告反映的问题真实准确，提出的建议切实可行。你展现了出色的政策分析能力。', requireFlag: 'provincialInspection', pools: ['省级','市级'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e396', stage: 'work', eventType: 'choice', title: '省级预算', weight: 5, text: '省级部门预算编制工作开始了，你负责审核几个厅局的预算申报。有些厅局明显虚报了预算，甚至把出国考察费都算进去了。', pools: ['省级', '政府部门'], choices: [
      { text: '逐项审核，坚决核减不合理支出', effects: {workAbility: 3, integrity: 3, mentalPressure: 4, reputation: 2, risk: 2, flag: 'budgetAudit'} },
      { text: '约谈相关厅局财务负责人', effects: {eq: 1, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '按惯例适当调整，不得罪人', effects: {risk: 1, mentalPressure: 1, integrity: -1, reputation: -1} },
      { text: '制定统一的预算编制标准', effects: {iq: 3, workAbility: 2, mentalPressure: 2, integrity: 2} },
      { text: '上报分管领导决策', effects: {background: 2, positionWeight: 1, mentalPressure: 1, integrity: 2} },
    ]},
    { id: 'e397', stage: 'work', eventType: 'auto', title: '预算节约', weight: 3, text: '你的预算审核工作为省财政节约了数千万元！省领导在大会上表扬你"把每一分钱都花在刀刃上"。', requireFlag: 'budgetAudit', pools: ['省级', '政府部门'], effects: {reputation: 5, positionWeight: 3, integrity: 3, workAbility: 2, mentalPressure: -2} },

    // ====== 政法系统更多事件 ======
    { id: 'e398', stage: 'work', eventType: 'choice', title: '执法检查', weight: 5, text: '人大开展《安全生产法》执法检查，你陪同检查组到企业一线。发现一家化工企业存在严重安全隐患，但企业负责人是当地政协委员。', pools: ['政法系统', '执法部门'], choices: [
      { text: '依法下达整改通知书，跟踪督办', effects: {integrity: 4, workAbility: 3, risk: 2, mentalPressure: 4, reputation: 2, flag: 'lawEnforcement'} },
      { text: '先约谈企业负责人说明利害', effects: {eq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '上报人大执法检查组处理', effects: {background: 2, integrity: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '从轻处理，给企业留面子', effects: {risk: 4, integrity: -3, mentalPressure: 1, reputation: -1} },
      { text: '联合多部门开展专项整治', effects: {eq: 1, workAbility: 2, mentalPressure: 3, background: 2} },
    ]},
    { id: 'e399', stage: 'work', eventType: 'auto', title: '执法标兵', weight: 3, text: '你严格执法的事迹被写进了人大执法检查报告。在年底评选中，你被评为"执法标兵"，成为系统内学习的榜样。', requireFlag: 'lawEnforcement', pools: ['政法系统', '执法部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, integrity: 3, mentalPressure: -2} },
    { id: 'e400', stage: 'work', eventType: 'choice', title: '司法救助', weight: 5, text: '你接触到一个司法救助案件：一位农民工在工地受伤致残，法院判决了但执行不到位，生活陷入困境。', pools: ['政法系统', '执法部门', '民生部门'], choices: [
      { text: '启动司法救助程序，帮助申请救助金', effects: {integrity: 4, workAbility: 3, reputation: 3, mentalPressure: 2, eq: 1, flag: 'judicialAid'} },
      { text: '协调法院加大执行力度', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, reputation: 1} },
      { text: '联系工会和民政部门联合帮扶', effects: {eq: 2, background: 2, mentalPressure: 2, reputation: 2} },
      { text: '建议走信访渠道', effects: {risk: 1, mentalPressure: 1, reputation: -1, integrity: -1} },
      { text: '发动单位同事捐款相助', effects: {eq: 1, reputation: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'e401', stage: 'work', eventType: 'auto', title: '司法为民', weight: 3, text: '司法救助案例被省高院作为典型案例发布！你"司法为民"的工作理念得到了广泛认可，人民群众送来了感谢信。', requireFlag: 'judicialAid', pools: ['政法系统', '执法部门', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, integrity: 3, mentalPressure: -2} },

    // ====== 技术/数据部门更多事件 ======
    { id: 'e402', stage: 'work', eventType: 'choice', title: '数字赋能', weight: 5, text: '省里推进"数字政府"建设，你所在的部门负责一个跨部门数据共享平台建设。但各部门都有自己的"数据小算盘"。', pools: ['技术部门', '数据部门', '政府部门'], choices: [
      { text: '制定统一数据标准和接口规范', effects: {iq: 3, workAbility: 3, mentalPressure: 3, reputation: 2, background: 2, flag: 'dataPlatform'} },
      { text: '逐个部门沟通协调利益诉求', effects: {eq: 2, background: 2, mentalPressure: 3, workAbility: 1} },
      { text: '先做试点再逐步推广', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '请省领导出面推动', effects: {background: 2, mentalPressure: 2, positionWeight: 1, reputation: 1} },
      { text: '引入第三方技术团队支撑', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e403', stage: 'work', eventType: 'auto', title: '数据共享', weight: 3, text: '数据共享平台上线运行，群众办事不再需要重复提交材料！这项改革被列为全省"数字政府"建设的典型案例。', requireFlag: 'dataPlatform', pools: ['技术部门', '数据部门', '政府部门'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e404', stage: 'work', eventType: 'choice', title: '网络安全', weight: 5, text: '上级部门通报了一种新型网络攻击手段，要求各单位排查风险。你发现单位的办公系统存在一个严重安全漏洞，但修复需要暂停服务。', pools: ['技术部门', '数据部门', '网信办'], choices: [
      { text: '立即停机修复，确保安全第一', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 2, risk: -2, flag: 'securityFix'} },
      { text: '夜间加班修复，不影响白天办公', effects: {workAbility: 2, body: -2, mentalPressure: 3, reputation: 1, iq: 2} },
      { text: '上报领导决定是否停机', effects: {background: 2, positionWeight: 1, mentalPressure: 2, integrity: 2} },
      { text: '先不修，等上级检查再说', effects: {risk: 5, integrity: -3, mentalPressure: 2, reputation: -1} },
      { text: '请安全公司评估风险后处理', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e405', stage: 'work', eventType: 'auto', title: '安全标兵', weight: 3, text: '你主动发现并修复安全漏洞的行为得到了通报表扬！省网信办将你的做法作为"网络安全主动防御"典型案例推广。', requireFlag: 'securityFix', pools: ['技术部门', '数据部门', '网信办'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, iq: 2, mentalPressure: -2} },

    // ====== 民生部门更多事件 ======
    { id: 'e406', stage: 'work', eventType: 'choice', title: '养老服务', weight: 5, text: '人口老龄化问题日益突出，你负责调研本地养老服务体系建设。发现养老机构"一床难求"和"空置率高"并存，结构性问题严重。', pools: ['民生部门', '人社', '民政', '政府部门'], choices: [
      { text: '深入调研养老需求结构', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, eq: 1, flag: 'elderlyCare'} },
      { text: '推动社区居家养老模式', effects: {workAbility: 2, eq: 1, mentalPressure: 2, reputation: 2, background: 1} },
      { text: '引入社会资本参与养老', effects: {desire: 2, background: 2, mentalPressure: 2, risk: 1} },
      { text: '提高养老机构补贴标准', effects: {background: 2, mentalPressure: 2, reputation: 1, integrity: 1} },
      { text: '学习先进地区养老经验', effects: {iq: 2, workAbility: 2, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e407', stage: 'work', eventType: 'auto', title: '养老改革', weight: 3, text: '你提出的养老服务改革方案被政府采纳，财政投入增加了30%，社区养老服务站覆盖率达到90%！老百姓都说政府办了件实事。', requireFlag: 'elderlyCare', pools: ['民生部门', '人社', '民政', '政府部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, eq: 1, mentalPressure: -2} },
    { id: 'e408', stage: 'work', eventType: 'choice', title: '医保改革', weight: 5, text: '医保支付方式改革遇到了阻力，医院方面担心收入下降，患者担心报销比例降低。你作为改革推进组成员，面临各方压力。', pools: ['民生部门', '卫健', '医保'], choices: [
      { text: '深入调研各方诉求，设计方案', effects: {workAbility: 3, eq: 1, mentalPressure: 4, iq: 2, background: 2, flag: 'healthcareReform'} },
      { text: '先试点再逐步推开', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1, integrity: 1} },
      { text: '加强政策宣传解读', effects: {eq: 1, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '听取医院和患者代表意见', effects: {eq: 2, background: 1, mentalPressure: 2, reputation: 1} },
      { text: '参考其他省市成功经验', effects: {iq: 2, workAbility: 2, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e409', stage: 'work', eventType: 'auto', title: '医改突破', weight: 3, text: '医保改革方案实施后，既控制了医疗费用过快增长，又保障了患者的医疗需求。省医改办将你的经验作为典型推广。', requireFlag: 'healthcareReform', pools: ['民生部门', '卫健', '医保'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },

    // ====== 党委系统更多事件 ======
    { id: 'e410', stage: 'work', eventType: 'choice', title: '主题教育', weight: 5, text: '全党开展主题教育，你负责单位的教育活动组织工作。上级要求"规定动作一个不能少"，但业务部门觉得活动影响了正常工作。', pools: ['党委系统', '机关'], choices: [
      { text: '精心组织，将教育与业务结合', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 2, eq: 1, flag: 'themeEducation'} },
      { text: '按规定动作走完流程', effects: {workAbility: 1, mentalPressure: 1, integrity: 1, positionWeight: 1} },
      { text: '压缩活动时间，减少业务影响', effects: {eq: 1, mentalPressure: 1, risk: 1, integrity: -1} },
      { text: '创新活动形式，提高参与度', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '请上级指导组来单位指导', effects: {background: 2, positionWeight: 1, mentalPressure: 2, reputation: 1} },
    ]},
    { id: 'e411', stage: 'work', eventType: 'auto', title: '教育先进', weight: 3, text: '主题教育工作得到了上级指导组的充分肯定！你单位的做法被作为"创新案例"上报省委，你本人也被评为"主题教育工作先进个人"。', requireFlag: 'themeEducation', pools: ['党委系统', '机关'], effects: {reputation: 4, positionWeight: 3, background: 2, mentalPressure: -2, integrity: 2} },
    { id: 'e412', stage: 'work', eventType: 'choice', title: '机构编制', weight: 5, text: '机构改革后，单位编制大幅压缩，但工作任务不减反增。你作为人事负责人，要在有限的编制内做到人岗匹配，难度很大。', pools: ['党委系统', '机关', '政府部门'], choices: [
      { text: '科学测算各科室工作量', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, integrity: 2, flag: 'staffOptimize'} },
      { text: '推行AB岗和轮岗制度', effects: {workAbility: 2, eq: 1, mentalPressure: 2, background: 1} },
      { text: '争取增加编制名额', effects: {background: 2, mentalPressure: 3, positionWeight: 1, desire: 1} },
      { text: '通过信息化手段减员增效', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '按领导意图安排人员', effects: {eq: 1, background: 1, risk: 1, integrity: -1} },
    ]},
    { id: 'e413', stage: 'work', eventType: 'auto', title: '编制优化', weight: 3, text: '你的编制优化方案得到了编办的认可，不仅解决了人浮于事的问题，还提高了工作效率。兄弟单位纷纷来学习经验。', requireFlag: 'staffOptimize', pools: ['党委系统', '机关', '政府部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },

    // ====== 新短链：职级晋升链 ======
    { id: 'e414', stage: 'work', eventType: 'choice', title: '职级并行', weight: 4, text: '职级并行政策实施后，你面临一个选择：是走职务晋升路线还是走职级晋升路线。职务晋升权力大但竞争激烈，职级晋升轻松但天花板低。', choices: [
      { text: '两条腿走路，职务职级都要争', effects: {desire: 4, workAbility: 2, mentalPressure: 4, positionWeight: 2, risk: 1, flag: 'dualTrack'} },
      { text: '主攻职务晋升，追求实权', effects: {desire: 3, positionWeight: 3, mentalPressure: 3, workAbility: 2, background: 1} },
      { text: '选择职级晋升，稳定为上', effects: {mentalPressure: -2, desire: -2, positionWeight: 1, integrity: 1} },
      { text: '听组织安排，服从分配', effects: {integrity: 2, mentalPressure: 1, positionWeight: 1, reputation: 1} },
      { text: '找老领导咨询职业规划', effects: {eq: 1, background: 2, mentalPressure: 1, iq: 1} },
    ]},
    { id: 'e415', stage: 'work', eventType: 'auto', title: '职级晋升', weight: 3, text: '经过组织考察，你的职级晋升了！虽然不是领导职务，但待遇上去了，也算是组织对你多年工作的认可。', requireFlag: 'dualTrack', effects: {reputation: 3, positionWeight: 2, desire: 1, mentalPressure: -2, background: 1} },

    // ====== 新短链：学习交流链 ======
    { id: 'e416', stage: 'work', eventType: 'choice', title: '外出学习', weight: 4, text: '单位组织到沿海发达地区学习考察，为期一周。这是一个难得的开阔眼界的机会，但费用需要先垫付，回来再报销。', choices: [
      { text: '积极参加，认真学习先进经验', effects: {iq: 2, workAbility: 2, background: 2, mentalPressure: 1, eq: 1, flag: 'studyTour'} },
      { text: '借机结识外省同行拓展人脉', effects: {eq: 2, background: 2, mentalPressure: 1, reputation: 1, flag: 'studyTour', desire: 2} },
      { text: '以工作忙为由推掉', effects: {desire: -1, positionWeight: -1, mentalPressure: -1, reputation: 1} },
      { text: '回来后写高质量的考察报告', effects: {workAbility: 3, reputation: 2, positionWeight: 1, mentalPressure: 2, flag: 'studyTour'} },
      { text: '自费延长行程多看看', effects: {iq: 2, background: 1, familyPressure: 2, mentalPressure: 1} },
    ]},
    { id: 'e417', stage: 'work', eventType: 'auto', title: '学以致用', weight: 3, text: '考察回来后，你将沿海地区的先进经验与本地实际相结合，提出了多项创新性建议。你的考察报告被评为"最有价值调研报告"。', requireFlag: 'studyTour', effects: {reputation: 4, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },

    // ====== 新短链：抗压成长链 ======
    { id: 'e418', stage: 'work', eventType: 'choice', title: '高压任务', weight: 4, text: '上级交办了一项紧急任务，要求三天内完成一份高质量的调研报告。你手头还有其他工作，时间根本不够用。', choices: [
      { text: '加班加点，全力完成', effects: {workAbility: 3, body: -2, mentalPressure: 5, reputation: 2, positionWeight: 2, flag: 'highPressure'} },
      { text: '协调其他同事分担任务', effects: {eq: 1, background: 1, mentalPressure: 2, workAbility: 1} },
      { text: '向领导说明情况请求延期', effects: {integrity: 2, mentalPressure: 1, positionWeight: -1, risk: -1} },
      { text: '先做框架再慢慢填充', effects: {iq: 2, workAbility: 1, mentalPressure: 2, risk: 1} },
      { text: '用之前积累的材料快速成稿', effects: {workAbility: 2, mentalPressure: 2, reputation: 1, risk: 1} },
    ]},
    { id: 'e419', stage: 'work', eventType: 'auto', title: '抗压成长', weight: 3, text: '经过这次高压任务的历练，你的工作能力和心理素质都有了明显提升。领导对你的评价是"能扛事、能办事"。', requireFlag: 'highPressure', effects: {workAbility: 3, mentalPressure: -3, positionWeight: 2, reputation: 2, body: 1} },

    // ====== 新短链：创新突破链 ======
    { id: 'e420', stage: 'work', eventType: 'choice', title: '改革建议', weight: 4, text: '你在工作中发现了一个长期存在的制度性障碍，如果能够突破，可以大幅提升工作效率。但打破旧制度必然触动一些人的利益。', choices: [
      { text: '写详细的改革方案报领导', effects: {workAbility: 3, desire: 2, mentalPressure: 3, reputation: 2, iq: 2, flag: 'reformProposal'} },
      { text: '先私下征求各方意见', effects: {eq: 2, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '找志同道合的同事一起推动', effects: {eq: 1, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '多一事不如少一事', effects: {mentalPressure: -1, positionWeight: -1, desire: -1, integrity: -1, reputation: 1} },
      { text: '先在小范围内试点验证', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1, flag: 'reformProposal'} },
    ]},
    { id: 'e421', stage: 'work', eventType: 'auto', title: '改革先锋', weight: 3, text: '你的改革建议被采纳并实施后，工作效率提升了50%！你的创新做法被《人民日报》报道，标题是"基层改革创新的生动实践"。', requireFlag: 'reformProposal', effects: {reputation: 8, positionWeight: 4, workAbility: 3, iq: 2, mentalPressure: -2} },

    // ====== 新短链：群众路线链 ======
    { id: 'e422', stage: 'work', eventType: 'choice', title: '信访接待（拆迁户）', weight: 4, text: '今天是领导信访接待日，你负责陪同接访。一位大妈反映她家的拆迁补偿款三年了还没到位，情绪非常激动。', choices: [
      { text: '耐心倾听，详细记录，承诺督办', effects: {eq: 2, workAbility: 2, integrity: 2, reputation: 2, mentalPressure: 2, flag: 'petitionWork'} },
      { text: '当场打电话给相关部门催办', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, reputation: 1} },
      { text: '解释政策，劝大妈理解', effects: {eq: 1, workAbility: 1, mentalPressure: 1, integrity: 1} },
      { text: '让大妈去法院起诉', effects: {risk: 1, mentalPressure: 1, reputation: -1, integrity: -1} },
      { text: '自费给大妈先垫付部分补偿', effects: {integrity: 2, reputation: 2, familyPressure: 2, mentalPressure: 2} },
    ]},
    { id: 'e423', stage: 'work', eventType: 'auto', title: '信访化解', weight: 3, text: '经过你的协调督办，大妈的拆迁补偿款终于到位了！她送来了"人民公仆"的锦旗，你的信访工作得到了群众点赞。', requireFlag: 'petitionWork', effects: {reputation: 4, positionWeight: 2, workAbility: 2, eq: 1, mentalPressure: -2} },
];
