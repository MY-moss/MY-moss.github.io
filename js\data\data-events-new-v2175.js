// ==================== v2.1.77 主题平衡补件（enw276-281，执法×3 + 接待×3） ====================
// v2.1.77 复核：执法 30(2.7%)、接待 30(2.8%) 仍为 12 主题最低两名——补 6 条拉平主题分布。
const gd_events_new_v2175 = [
  { id: 'enw276', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '巡查中的无证经营', text: '傍晚巡查发现一家无证烧烤摊挤占了消防通道，摊主是个下岗再就业的中年人，周围邻居却纷纷帮他说情。', choices: [
    { text: '依法暂扣器具，并告知办证路径', effects: { integrity: 2, workAbility: 1, peopleReputation: -1 }, result: '执法到位，也留了出路指引' },
    { text: '协调市场监管帮其补证再营业', effects: { workAbility: 2, peopleReputation: 2 }, result: '堵疏结合，摊主和邻居都服气' },
    { text: '口头警告，睁一只眼闭一只眼', effects: { risk: 2, integrity: -1 }, result: '人情卖了，隐患留着' },
    { text: '当场处罚并通报曝光', effects: { integrity: 1, heat: 1, peopleReputation: -2 }, result: '震慑有了，负面舆情也起了' }
  ] },
  { id: 'enw277', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '处罚决定送达', text: '一份处罚决定书需要当面送达，当事人情绪激动，扬言"要讨个说法"，围观群众越聚越多。', choices: [
    { text: '耐心释法说理，全程记录', effects: { workAbility: 2, integrity: 1, mentalPressure: 2 }, result: '情绪慢慢平复，送达程序完整' },
    { text: '请社区干部到场共同做工作', effects: { eq: 2, background: 1 }, result: '第三方在场，双方都下了台阶' },
    { text: '留置送达，按程序公告', effects: { workAbility: 1, peopleReputation: -1 }, result: '程序合法，群众观感一般' },
    { text: '先搁置，改日再送', effects: { risk: 2, workAbility: -1 }, result: '期限在走，风险在攒' }
  ] },
  { id: 'enw278', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '案卷被上级调阅', text: '上级执法监督部门调阅你经手的三本案卷，说是"例行抽查"——但同期还有一封针对你单位的匿名反映信。', choices: [
    { text: '主动配合，附上办案说明', effects: { integrity: 2, workAbility: 1, mentalPressure: 2 }, result: '案卷规范，反映信查无实据' },
    { text: '自查一遍有瑕疵处主动报备', effects: { integrity: 2, workAbility: 1 }, result: '瑕疵报备，处理从轻' },
    { text: '托同事侧面打听抽查重点', effects: { eq: 1, background: -1, risk: 2 }, result: '打听未果，心思全乱了' },
    { text: '补签几处漏签的日期', effects: { integrity: -2, risk: 3 }, result: '补签被笔迹鉴定看穿' }
  ] },
  { id: 'enw279', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '接待方案会审', text: '上级考察团下周来访，接待方案第三稿仍被分管领导退回：行程太满、汇报太长、参观点太"亮眼"不真实。', choices: [
    { text: '砍掉一半行程，留出调研时间', effects: { workAbility: 2, integrity: 1 }, result: '方案过审，考察团反馈"看到了真东西"' },
    { text: '增加群众座谈环节', effects: { eq: 2, peopleReputation: 2 }, result: '座谈会成了亮点，领导满意' },
    { text: '按领导口味把参观点排满', effects: { background: 1, mentalPressure: 2, workAbility: -1 }, result: '赶场式行程，考察效果打折' },
    { text: '外包给会展公司全程操办', effects: { wealth: -3, background: 1 }, result: '专业省心，预算超了一截' }
  ] },
  { id: 'enw280', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '会务的茶歇准备', text: '重要会务临开前半小时，茶歇点心被后勤临时砍了预算，参会嘉宾名单里还有两位上级领导。', choices: [
    { text: '从办公经费里调剂，按标准执行', effects: { workAbility: 1, integrity: 1 }, result: '标准内解决，两全其美' },
    { text: '简化茶歇，只备茶水', effects: { integrity: 2, mentalPressure: 1 }, result: '从简也是作风，没人挑理' },
    { text: '找定点单位"赞助"一份', effects: { background: 1, risk: 2, integrity: -1 }, result: '赞助有来头，台账记了一笔' },
    { text: '取消茶歇并通知与会人员', effects: { eq: -1, reputation: -1 }, result: '省了钱，寒了场' }
  ] },
  { id: 'enw281', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '客商来访的陪同参观', text: '客商来访参观园区，领导临时让你陪同讲解。你对园区项目熟悉，但对客商背后的投资意向一无所知。', choices: [
    { text: '提前向招商部门了解客商背景', effects: { iq: 1, workAbility: 2 }, result: '讲解对准了客商兴趣点，投资意向明确' },
    { text: '按园区统一口径规范讲解', effects: { integrity: 1, workAbility: 1 }, result: '规范讲解，不添乱' },
    { text: '自作主张承诺优惠政策', effects: { background: -1, risk: 3 }, result: '客商高兴了，政策口要收拾残局' },
    { text: '只陪同不讲解，让讲解员上', effects: { eq: 1, background: 1 }, result: '稳妥，但错了一次表现机会' }
  ] }
];