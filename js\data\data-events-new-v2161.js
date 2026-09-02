// ===== v2.1.61 接待与执法补强包 =====
// id 范围：enw231~enw244（14条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：两个最薄主题（接待/执法）补强，与 v2.1.55 包场景不重叠
// v2.1.54 部门化分析（v2.1.55 后复测）：接待 2.2%(23)、执法 2.0%(21) 并列最低。
// 本包 +7 接待 +7 执法（enw231-244），场景与 v2.1.55 接待包（enw219-230）不重叠。
// 文本首 40 字按 analyze_work_themes 主题序（接待先于督查/执法）设计，确保归类命中。
const gd_events_new_v2161 = [
  // ---------- 接待 7 ----------
  { id: 'enw231', stage: 'work', eventType: 'choice', weight: 4, title: '接待经费核减', pools: ['public'], text: '上级要求压减明年公务接待预算，财务翻出近年开支明细，你的科室被点名压减三成。', choices: [
    { text: '如实压减，宁可少办也不超标', effects: {integrity: 2, reputation: 1, workAbility: -1} },
    { text: '压减指标摊给各条线，自己科室少担', effects: {eq: 1, peopleReputation: -1} },
    { text: '借机梳理流程，把无谓开支省出来', effects: {workAbility: 2, integrity: 1, mentalPressure: 2} },
    { text: '先拖着，等年底再想办法', effects: {heat: 2, mentalPressure: 1} }
  ] },
  { id: 'enw232', stage: 'work', eventType: 'choice', weight: 4, title: '招商考察团来访', pools: ['public'], text: '重要客商带队来园区实地考察，领导让你陪同全程接待，规格、路线、餐饮都要拿捏分寸。', choices: [
    { text: '高规格接待，力求留下好印象', effects: {eq: 2, positionWeight: 1, wealth: 1, heat: 1} },
    { text: '从简接待，把功夫下在方案本身', effects: {workAbility: 2, integrity: 1} },
    { text: '提前踩点演练，每个环节写进脚本', effects: {workAbility: 1, eq: 1, mentalPressure: 2} },
    { text: '让副手挑大梁，自己把控关键节点', effects: {eq: 2, reputation: 1} }
  ] },
  { id: 'enw233', stage: 'work', eventType: 'choice', weight: 4, title: '联席活动承办权', pools: ['public'], text: '几个部门都不愿牵头今年的跨部门联席活动，推来推去落到了你的科室，接待与流程全要统筹。', choices: [
    { text: '接下来，正好在领导面前露脸', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 3} },
    { text: '拉上兄弟部门共同承办，分摊压力', effects: {eq: 2, peopleReputation: 1} },
    { text: '向上级争取专项经费再接', effects: {background: 1, workAbility: 1} },
    { text: '以人手不足婉拒，保全现有节奏', effects: {mentalPressure: -1, reputation: -1} }
  ] },
  { id: 'enw234', stage: 'work', eventType: 'choice', weight: 4, title: '会务后勤临时补位', pools: ['public'], text: '原定承办同事突然病倒，活动前夜的会务与后勤保障临时交给你，食宿车辆席位全要重新过一遍。', choices: [
    { text: '通宵把全部细节捋顺', effects: {workAbility: 2, body: -2, mentalPressure: 3} },
    { text: '抓大放小，只盯关键环节', effects: {eq: 1, workAbility: 1} },
    { text: '调动志愿者和实习生帮忙', effects: {eq: 2, peopleReputation: 1, luck: 1} },
    { text: '向领导申请活动延期', effects: {background: 1, reputation: -1} }
  ] },
  { id: 'enw235', stage: 'work', eventType: 'choice', weight: 4, title: '外省考察团取经', pools: ['public'], text: '外省同行组团来学习你们的试点做法，对方资历比你深，介绍到什么程度成了微妙的问题。', choices: [
    { text: '倾囊相授，把踩过的坑都讲透', effects: {eq: 2, peopleReputation: 2} },
    { text: '讲成绩为主，难点一笔带过', effects: {reputation: 1, integrity: -1} },
    { text: '按宣传口径讲，多一句不说', effects: {workAbility: 1, mentalPressure: 1} },
    { text: '请分管领导出面主谈，自己补充', effects: {background: 1, eq: 1} }
  ] },
  { id: 'enw236', stage: 'work', eventType: 'choice', weight: 4, title: '接待用车告急', pools: ['public'], text: '公务用车平台车辆全派出去了，偏偏明天有重要来访，办公室让你想想办法。', choices: [
    { text: '协调兄弟单位借车，欠个人情', effects: {eq: 1, peopleReputation: 1, background: 1} },
    { text: '按制度用社会租赁，走正规手续', effects: {integrity: 2, wealth: -1} },
    { text: '调整内部用车，压缩其他安排', effects: {workAbility: 1, mentalPressure: 2} },
    { text: '建议对方自行安排交通', effects: {eq: -1, peopleReputation: -1} }
  ] },
  { id: 'enw237', stage: 'work', eventType: 'choice', weight: 4, title: '食堂接待餐标准', pools: ['public'], text: '机关食堂改造后承接了内部接待用餐，有客人嫌标准太简单，管后勤的你被夹在中间。', choices: [
    { text: '标准就是标准，谁来都一样', effects: {integrity: 2, peopleReputation: -1, reputation: 1} },
    { text: '在标准内把粗茶淡饭做出特色', effects: {eq: 2, workAbility: 1} },
    { text: '自掏腰包添两个菜，息事宁人', effects: {eq: 1, wealth: -1, integrity: -1} },
    { text: '把矛盾报给领导定夺', effects: {background: 1, eq: -1} }
  ] },
  // ---------- 执法 7 ----------
  { id: 'enw238', stage: 'work', eventType: 'choice', weight: 4, title: '执法资格考试', pools: ['执法部门', '政法系统'], text: '单位安排你参加执法资格考试，白天案子不断只能挤晚上时间，同事劝你突击划重点就行。', choices: [
    { text: '系统复习，把法条真正吃透', effects: {iq: 1, workAbility: 2, mentalPressure: 2} },
    { text: '考前突击，够用就行', effects: {luck: 1, workAbility: 1} },
    { text: '白天挤时间刷题，晚上不熬夜', effects: {iq: 1, body: 1, mentalPressure: 1} },
    { text: '找考过的同事取经要笔记', effects: {eq: 1, peopleReputation: 1, iq: 1} }
  ] },
  { id: 'enw239', stage: 'work', eventType: 'choice', weight: 4, title: '执法记录仪风波', pools: ['执法部门', '政法系统'], text: '一次执法行动中当事人情绪激动，事后托熟人求情，想把记录仪里的一段影像删掉，说影响不好。', choices: [
    { text: '断然拒绝，依规保存全部记录', effects: {integrity: 3, risk: -1} },
    { text: '报告上级，把人情推开', effects: {integrity: 1, background: 1, mentalPressure: 2} },
    { text: '答复对方记录无法删除，安抚情绪', effects: {eq: 2, integrity: 1} },
    { text: '睁一只眼闭一只眼，不置可否', effects: {risk: 3, integrity: -2} }
  ] },
  { id: 'enw240', stage: 'work', eventType: 'choice', weight: 4, title: '处罚告知程序', pools: ['执法部门', '政法系统'], text: '一起处罚案子的当事人不肯签字，还提出要当面陈述申辩，程序一步都不能少。', choices: [
    { text: '依法组织陈述申辩，全程记录', effects: {workAbility: 2, integrity: 1, mentalPressure: 2} },
    { text: '耐心解释法条，劝其配合签收', effects: {eq: 2, workAbility: 1} },
    { text: '留置送达，按程序推进', effects: {workAbility: 1, peopleReputation: -1} },
    { text: '先放一放，等风头过了再说', effects: {risk: 2, workAbility: -1} }
  ] },
  { id: 'enw241', stage: 'work', eventType: 'choice', weight: 4, title: '双随机执法名单', pools: ['执法部门', '政法系统'], text: '双随机一公开的平台名单出炉，抽中的企业里有你同学家的新厂，回避还是照常进场？', choices: [
    { text: '主动报告，申请更换执法人员', effects: {integrity: 2, reputation: 1} },
    { text: '照常进场，全程留痕自证', effects: {integrity: 1, workAbility: 1, risk: 1} },
    { text: '私下提醒同学提前准备', effects: {eq: 1, integrity: -2, risk: 3} },
    { text: '与同事交换任务，互相回避', effects: {eq: 1, workAbility: 1} }
  ] },
  { id: 'enw242', stage: 'work', eventType: 'choice', weight: 4, title: '年度执法案卷评查', pools: ['执法部门', '政法系统'], text: '市局交叉评查执法案卷，你主办的三本卷宗被抽中，组里有人暗示可以提前打个招呼。', choices: [
    { text: '连夜自查三本卷宗，有瑕疵主动报备', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
    { text: '听招呼托关系，先打招呼再说', effects: {background: 1, integrity: -2, risk: 2} },
    { text: '平常心对待，是什么样就是什么样', effects: {eq: 1, integrity: 1} },
    { text: '请老法师帮忙预审一遍', effects: {eq: 1, peopleReputation: 1, workAbility: 1} }
  ] },
  { id: 'enw243', stage: 'work', eventType: 'choice', weight: 4, title: '案件移送标准之争', pools: ['执法部门', '政法系统'], text: '办到一半的案件发现金额可能够上刑事标准，移交公安还是按行政处理，两种意见僵住了。', choices: [
    { text: '从严把握，够格就移', effects: {integrity: 2, workAbility: 1, mentalPressure: 2} },
    { text: '再补充调查，把证据坐实再定', effects: {workAbility: 2, iq: 1} },
    { text: '提交集体研究，责任大家担', effects: {eq: 1, background: 1} },
    { text: '按行政处理快办快结，免得节外生枝', effects: {risk: 3, integrity: -2} }
  ] },
  { id: 'enw244', stage: 'work', eventType: 'choice', weight: 4, title: '电子监控执法争议', pools: ['执法部门', '政法系统'], text: '自动抓拍的非现场执法数据出了误差，车主申诉到单位，人工复核与系统数据对不上。', choices: [
    { text: '逐帧人工复核，错了就撤销', effects: {workAbility: 2, integrity: 1, peopleReputation: 2} },
    { text: '以系统数据为准，驳回申诉', effects: {workAbility: 1, peopleReputation: -2} },
    { text: '上报技术部门排查源头问题', effects: {workAbility: 1, background: 1, mentalPressure: 1} },
    { text: '和申诉人私下沟通，各退一步', effects: {eq: 1, integrity: -1, risk: 1} }
  ] }
];
