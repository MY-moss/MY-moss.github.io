// ===== 新增职业经济类主题包 =====
// id 范围：enc001~enc098（137条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：职业发展与经济决策类事件（旧注释写 90 条系历史值，实际 137）
// ID 范围：enc001 ~ enc090
// 主题：晋升发展(20) + 经济理财(25) + 腐败风险(20) + 副业创收(10) + 职场危机(15)
// stage 统一为 'career'，eventType 统一为 'choice'
const gd_events_new_career = [

  // ========== 晋升发展类（enc001 ~ enc020） ==========
  { id: 'enc001', stage: 'career', eventType: 'choice', weight: 6, title: '科长空缺', text: '科长调走了，位置空了出来。论资历论能力，你都是热门人选。但有两位同事也虎视眈眈，还有人说上面已经有人打了招呼。', choices: [
    { text: '主动找领导汇报思想表达意愿', effects: {positionWeight: 3, desire: 2, mentalPressure: 2, eq: 1} },
    { text: '埋头干好本职用业绩说话', effects: {workAbility: 3, integrity: 2, mentalPressure: 1, positionWeight: 2} },
    { text: '请老领导帮忙美言几句', effects: {background: 3, positionWeight: 2, risk: 2, mentalPressure: 2} },
    { text: '佛系应对顺其自然', effects: {mentalPressure: -2, desire: -2, positionWeight: -1} },
  ]},
  { id: 'enc002', stage: 'career', eventType: 'choice', weight: 4, title: '副处竞争', text: '单位推荐副处级人选，你和另外两位科长是候选人。考察组已经进驻，气氛紧张。有人说"这次不拼能力拼关系"。', choices: [
    { text: '认真准备述职报告展示实绩', effects: {workAbility: 3, positionWeight: 3, mentalPressure: 3, integrity: 1} },
    { text: '四处活动打通关节', effects: {background: 4, positionWeight: 3, risk: 5, integrity: -4, desire: 2} },
    { text: '正常工作不参与拉票', effects: {integrity: 3, mentalPressure: 1, positionWeight: 1, eq: 1} },
    { text: '主动退出竞争成人之美', effects: {eq: 2, integrity: 2, positionWeight: -2, mentalPressure: -1} },
  ]},
  { id: 'enc003', stage: 'career', eventType: 'choice', weight: 5, title: '正科晋升', text: '任职年限够了，组织部门启动正科级晋升程序。你的档案材料需要补充完善，述职报告也要认真打磨。', choices: [
    { text: '加班加点完善材料力求完美', effects: {workAbility: 2, positionWeight: 3, mentalPressure: 4, integrity: 1} },
    { text: '请人事科同志帮忙把关', effects: {eq: 1, background: 1, positionWeight: 2, mentalPressure: 1} },
    { text: '按部就班准备不急不躁', effects: {mentalPressure: -1, positionWeight: 1, integrity: 1} },
  ]},
  { id: 'enc004', stage: 'career', eventType: 'choice', weight: 6, title: '职级并行（名额竞争）', text: '职级并行政策落地，你符合晋升职级的条件。但名额有限，单位要综合排名确定人选。', choices: [
    { text: '整理近年工作业绩积极争取', effects: {workAbility: 2, positionWeight: 3, desire: 2, mentalPressure: 2} },
    { text: '服从组织安排相信公平', effects: {integrity: 2, mentalPressure: -1, positionWeight: 1} },
    { text: '找分管领导表达诉求', effects: {background: 2, positionWeight: 2, desire: 1, mentalPressure: 1} },
  ]},
  { id: 'enc005', stage: 'career', eventType: 'choice', weight: 4, title: '挂职机会', text: '组织部门选派干部到沿海发达地区挂职锻炼两年。这是个开阔眼界的好机会，但意味着离开家人和熟悉的岗位。', choices: [
    { text: '积极申请把握难得机会', effects: {workAbility: 3, background: 3, positionWeight: 2, mentalPressure: 3, political: 2} },
    { text: '考虑到家庭因素放弃机会', effects: {mentalPressure: -2, desire: -1, eq: 1} },
    { text: '和家人商量后再做决定', effects: {eq: 1, mentalPressure: 1, integrity: 1} },
  ]},
  { id: 'enc006', stage: 'career', eventType: 'choice', weight: 5, title: '借调上级', text: '市里一个重要处室借调你去帮忙，时间半年起。借调期间表现好有可能正式留下，但也可能白忙一场回到原单位。', choices: [
    { text: '抓住机会去上级部门锻炼', effects: {background: 3, positionWeight: 2, workAbility: 2, mentalPressure: 3, political: 1} },
    { text: '婉拒借调留在原岗位', effects: {mentalPressure: -1, workAbility: 1, positionWeight: -1} },
    { text: '去借调但保留原单位退路', effects: {background: 2, eq: 1, mentalPressure: 2, desire: 1} },
  ]},
  { id: 'enc007', stage: 'career', eventType: 'choice', weight: 6, title: '跟班学习（省厅进修）', text: '省厅举办为期三个月的业务骨干跟班学习班，单位推荐你参加。学习期间能接触到省级层面的工作流程和人脉。', choices: [
    { text: '珍惜机会虚心学习', effects: {workAbility: 3, iq: 2, background: 2, mentalPressure: 2, political: 1} },
    { text: '借机拓展人脉关系', effects: {eq: 2, background: 3, mentalPressure: 1, desire: 2} },
    { text: '走个形式回去还是老样子', effects: {mentalPressure: -1, workAbility: -1, desire: -1} },
  ]},
  { id: 'enc008', stage: 'career', eventType: 'choice', weight: 5, title: '轮岗交流（组织安排）', text: '单位内部轮岗，领导找你谈话，想把你从熟悉的业务科室交流到另一个相对陌生的科室任科长。', choices: [
    { text: '服从安排迎接新挑战', effects: {workAbility: 2, eq: 1, positionWeight: 2, mentalPressure: 3, political: 1} },
    { text: '表达希望留在原科室', effects: {mentalPressure: -1, workAbility: 1, positionWeight: -1, eq: -1} },
    { text: '提出轮岗条件争取资源', effects: {background: 2, desire: 2, positionWeight: 1, mentalPressure: 1} },
  ]},
  { id: 'enc009', stage: 'career', eventType: 'choice', weight: 5, title: '下沉基层（乡镇锻炼）', requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], text: '组织选派年轻干部下沉到乡镇街道锻炼一年。基层条件艰苦但锻炼人，组织部门说"下去是为了更好地上来"。接受后保留原单位关系，期满根据考核决定去向。', choices: [
    { text: '积极报名到基层一线摔打', effects: {workAbility: 3, eq: 1, mentalPressure: 4, positionWeight: 3, reputation: 2, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '下沉基层锻炼' }} },
    { text: '找理由推脱留在机关', effects: {mentalPressure: -2, positionWeight: -2, desire: -1, integrity: -1} },
    { text: '接受安排但要解决后顾之忧', effects: {eq: 1, background: 1, mentalPressure: 2, positionWeight: 1, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '下沉基层锻炼' }} },
  ]},
  { id: 'enc010', stage: 'career', eventType: 'choice', weight: 3, title: '援疆援藏', text: '组织动员干部报名援疆援藏，为期三年。这是政治任务也是个人机遇，回来后提拔概率很大，但条件艰苦、家庭分离。', choices: [
    { text: '主动报名响应组织号召', effects: {political: 5, positionWeight: 4, mentalPressure: 5, workAbility: 2, integrity: 3, background: 3} },
    { text: '家庭困难大委婉拒绝', effects: {mentalPressure: -1, political: -2, positionWeight: -1, desire: -1} },
    { text: '报名但要先和家人商量', effects: {eq: 1, mentalPressure: 2, political: 1, integrity: 1} },
  ]},
  { id: 'enc011', stage: 'career', eventType: 'choice', weight: 4, title: '驻村第一书记', requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], text: '组织选派你到后进村（重点村）担任驻村第一书记，任期两年。村里的烂摊子等着你，但干好了是响当当的政绩。接受后保留原单位关系，任期结束根据考核决定去向。', choices: [
    { text: '扛起担子立志改变村貌', effects: {workAbility: 3, reputation: 3, positionWeight: 3, mentalPressure: 4, integrity: 2, eq: 1, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
    { text: '想办法调整其他人去', effects: {positionWeight: -2, reputation: -2, mentalPressure: -1, desire: -1} },
    { text: '接受任务但要求配套支持', effects: {background: 2, workAbility: 2, mentalPressure: 2, reputation: 2, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
  ]},
  { id: 'enc012', stage: 'career', eventType: 'choice', weight: 4, title: '帮扶干部', text: '你被抽调参与巩固拓展脱贫攻坚成果工作，要结对帮扶三户困难群众（含脱贫监测户）。他们家的困难远超你的想象。', choices: [
    { text: '真帮实扶扎根帮扶', effects: {integrity: 3, eq: 1, workAbility: 2, mentalPressure: 3, political: 2, positionWeight: 2} },
    { text: '完成规定动作即可', effects: {mentalPressure: 1, workAbility: 1, integrity: -1, political: 0} },
    { text: '想办法帮他们发展产业', effects: {workAbility: 3, iq: 2, mentalPressure: 3, political: 2, positionWeight: 2} },
  ]},
  { id: 'enc013', stage: 'career', eventType: 'choice', weight: 5, title: '专班抽调', text: '市里成立重大项目工作专班，点名抽调你参加。专班工作节奏快、压力大，但能直接对接市领导。', choices: [
    { text: '全力以赴投入专班工作', effects: {workAbility: 3, background: 3, positionWeight: 2, mentalPressure: 4, political: 2} },
    { text: '兼顾原单位和专班工作', effects: {workAbility: 2, mentalPressure: 3, eq: 1, positionWeight: 1} },
    { text: '以原单位工作忙为由推脱', effects: {mentalPressure: -1, positionWeight: -2, background: -1, desire: -1} },
  ]},
  { id: 'enc014', stage: 'career', eventType: 'choice', weight: 3, title: '巡视抽调', text: '省委巡视组抽调你参加为期半年的巡视工作。巡视工作保密性强、要求高，是难得的政治历练。', choices: [
    { text: '认真履职锻炼政治能力', effects: {political: 4, integrity: 3, workAbility: 2, mentalPressure: 4, background: 3, positionWeight: 2} },
    { text: '担心得罪人想推掉', effects: {mentalPressure: -1, positionWeight: -1, political: -2, desire: -1} },
    { text: '接受抽调但保留原职务', effects: {political: 2, positionWeight: 1, mentalPressure: 2, background: 2} },
  ]},
  { id: 'enc015', stage: 'career', eventType: 'choice', weight: 4, title: '巡察抽调', text: '市委巡察组抽调你参与本轮巡察工作，要下沉到县区开展巡察。时间紧任务重，还要抽调期间脱离原岗位。', choices: [
    { text: '积极投身巡察锤炼党性', effects: {political: 3, integrity: 2, workAbility: 2, mentalPressure: 3, positionWeight: 2} },
    { text: '认真但求稳怕出错', effects: {workAbility: 1, mentalPressure: 1, positionWeight: 1, integrity: 1} },
    { text: '找借口不参加', effects: {mentalPressure: -1, political: -2, positionWeight: -1} },
  ]},
  { id: 'enc016', stage: 'career', eventType: 'choice', weight: 5, title: '督查抽调', text: '国务院督查组来本市督查，市里抽调你作为联络员配合工作。这是展示能力的舞台，也是巨大的压力。', choices: [
    { text: '精心准备确保万无一失', effects: {workAbility: 3, background: 3, positionWeight: 3, mentalPressure: 4, political: 2} },
    { text: '按程序办事不出风头', effects: {workAbility: 1, mentalPressure: 1, integrity: 1, positionWeight: 1} },
    { text: '趁机向督查组反映单位困难', effects: {eq: 1, positionWeight: -1, risk: 2, background: 1} },
  ]},
  { id: 'enc017', stage: 'career', eventType: 'choice', weight: 7, title: '考核优秀', text: '年度考核结果出炉，你被评为"优秀"等次。连续三年优秀可记三等功，今年是第二年。', choices: [
    { text: '再接再厉争取连续三年优秀', effects: {workAbility: 2, desire: 2, positionWeight: 2, mentalPressure: 2} },
    { text: '保持平常心继续踏实工作', effects: {integrity: 2, workAbility: 1, mentalPressure: -1} },
    { text: '把优秀让给更需要的人', effects: {eq: 2, integrity: 2, positionWeight: -1, mentalPressure: -1} },
  ]},
  { id: 'enc018', stage: 'career', eventType: 'choice', weight: 3, title: '立功受奖（三等功）', text: '你在一次重大任务中表现突出，组织决定给你记三等功。表彰大会上你要上台发言。', choices: [
    { text: '谦虚发言感谢组织和同事', effects: {eq: 2, integrity: 2, positionWeight: 2, mentalPressure: 1, background: 2} },
    { text: '高调展示自己的贡献', effects: {positionWeight: 1, desire: 2, eq: -2, mentalPressure: 1} },
    { text: '低调谢绝表彰', effects: {integrity: 3, eq: 1, positionWeight: -1, mentalPressure: -1} },
  ]},
  { id: 'enc019', stage: 'career', eventType: 'choice', weight: 6, title: '嘉奖通报', text: '你的工作做法被上级单位作为典型案例通报表扬，并在全系统推广。这是实打实的政绩。', choices: [
    { text: '继续深化做法形成长效机制', effects: {workAbility: 3, positionWeight: 3, mentalPressure: 2, political: 1} },
    { text: '趁热打铁总结经验申报奖项', effects: {iq: 2, positionWeight: 2, desire: 2, mentalPressure: 1} },
    { text: '保持低调不张扬', effects: {integrity: 2, eq: 1, mentalPressure: -1, positionWeight: 1} },
  ]},
  { id: 'enc020', stage: 'career', eventType: 'choice', weight: 7, title: '表扬信', text: '你帮助一位群众解决了拖了三年的难题，群众给单位送来一封手写的感谢信，领导在大会上读了。', choices: [
    { text: '把表扬化为动力继续努力', effects: {integrity: 2, workAbility: 2, positionWeight: 2, mentalPressure: -1, eq: 1} },
    { text: '认为只是小事不必张扬', effects: {integrity: 2, mentalPressure: -1, eq: 1, desire: -1} },
    { text: '借机向领导提个人诉求', effects: {desire: 2, positionWeight: 1, eq: -1, risk: 1} },
  ]},

  // ========== 经济理财类（enc021 ~ enc045） ==========
  { id: 'enc021', stage: 'career', eventType: 'choice', weight: 6, title: '公积金提取', text: '你最近手头紧，想把公积金提取出来用。但有几种提取情形，办理流程各不相同。', choices: [
    { text: '按租房情形申请提取', effects: {wealth: 2, mentalPressure: -1, workAbility: 1} },
    { text: '等买房时再提取', effects: {wealth: -1, mentalPressure: 1, integrity: 1} },
    { text: '找中介帮忙提取', effects: {wealth: 2, risk: 3, integrity: -2, mentalPressure: 1} },
  ]},
  { id: 'enc022', stage: 'career', eventType: 'choice', weight: 5, title: '房贷提前还款', text: '攒了一笔钱，考虑要不要提前还房贷。提前还省利息，但手里就没闲钱了。银行说提前还款要排队。', choices: [
    { text: '提前还一部分保留流动性', effects: {wealth: -2, mentalPressure: -2, iq: 1, workAbility: 1} },
    { text: '全部还清无债一身轻', effects: {wealth: -5, mentalPressure: -3, desire: 1} },
    { text: '不还拿钱理财收益更高', effects: {wealth: 1, iq: 2, risk: 2, mentalPressure: 1} },
  ]},
  { id: 'enc023', stage: 'career', eventType: 'choice', weight: 6, title: '理财选择', text: '银行理财经理推荐了几款理财产品，收益率从3%到8%不等，风险等级也不同。你的闲钱不多，要慎重选择。', choices: [
    { text: '选择低风险稳健型产品', effects: {wealth: 1, mentalPressure: -1, integrity: 1} },
    { text: '选择中风险平衡型产品', effects: {wealth: 2, iq: 1, risk: 2, mentalPressure: 1} },
    { text: '搏一把高风险高收益产品', effects: {wealth: 3, risk: 5, mentalPressure: 3, desire: 2} },
    { text: '不买理财存定期', effects: {wealth: 0, mentalPressure: -2, integrity: 1} },
  ]},
  { id: 'enc024', stage: 'career', eventType: 'choice', weight: 5, title: '基金定投', text: '同事推荐你做基金定投，说长期坚持收益不错。但最近市场波动大，有同事定投亏了20%。', choices: [
    { text: '小额定投指数基金长期持有', effects: {wealth: 2, iq: 2, mentalPressure: 1, risk: 2} },
    { text: '一次性买入热门主题基金', effects: {wealth: 3, risk: 4, mentalPressure: 3, desire: 2} },
    { text: '观望再说暂时不投', effects: {mentalPressure: -1, wealth: 0, iq: 1} },
  ]},
  { id: 'enc025', stage: 'career', eventType: 'choice', weight: 5, title: '股票操作', text: '股市行情火热，身边不少人在炒股赚了钱。有人给你推荐了一只"内幕股"，说下周要拉升。', choices: [
    { text: '严格遵守纪律不炒股', effects: {integrity: 3, risk: -2, mentalPressure: -1, political: 1} },
    { text: '用闲钱小仓位买蓝筹股', effects: {wealth: 2, risk: 2, iq: 1, mentalPressure: 2} },
    { text: '听消息重仓买入内幕股', effects: {wealth: 4, risk: 6, integrity: -3, mentalPressure: 4, desire: 3} },
  ]},
  { id: 'enc026', stage: 'career', eventType: 'choice', weight: 4, title: '国债逆回购', text: '月末资金紧张，国债逆回购年化收益率飙升到8%以上。你账户里有几万块闲钱，可以做一天期逆回购。', choices: [
    { text: '抓住高收益时机操作', effects: {wealth: 1, iq: 2, mentalPressure: -1} },
    { text: '嫌麻烦懒得操作', effects: {mentalPressure: -2, wealth: -1} },
    { text: '学习后操作并教同事', effects: {wealth: 1, eq: 1, iq: 2, workAbility: 1} },
  ]},
  { id: 'enc027', stage: 'career', eventType: 'choice', weight: 7, title: '银行存款', text: '一笔定期存款到期了，现在利率又下调了。你要考虑怎么处置这笔钱。', choices: [
    { text: '继续存定期求稳', effects: {wealth: 1, mentalPressure: -2, integrity: 1} },
    { text: '转存大额存单锁定利率', effects: {wealth: 2, iq: 1, mentalPressure: -1} },
    { text: '购买结构性存款', effects: {wealth: 2, risk: 2, iq: 1, mentalPressure: 1} },
  ]},
  { id: 'enc028', stage: 'career', eventType: 'choice', weight: 5, title: '保险购买', text: '一位做保险的老同学极力推荐你买一份"全能保障"产品，年缴保费两万，缴十年。你不确定是否划算。', choices: [
    { text: '仔细研究条款后决定', effects: {iq: 2, wealth: -1, mentalPressure: 1, integrity: 1} },
    { text: '看在同学情面买一份', effects: {wealth: -2, eq: 1, mentalPressure: 1, risk: -1} },
    { text: '婉拒只买基本社保', effects: {wealth: 0, mentalPressure: -1, eq: -1} },
  ]},
  { id: 'enc029', stage: 'career', eventType: 'choice', weight: 4, title: '养老金并轨', text: '机关事业单位养老保险制度改革，养老金并轨政策正式实施。你要选择缴费档次，影响退休后的待遇。', choices: [
    { text: '按较高档次缴费保障退休', effects: {wealth: -2, mentalPressure: -2, iq: 1, political: 1} },
    { text: '按最低档次缴费保现钱', effects: {wealth: 1, mentalPressure: 1, desire: 1} },
    { text: '咨询专业人士后再选', effects: {iq: 2, wealth: 0, mentalPressure: -1, eq: 1} },
  ]},
  { id: 'enc030', stage: 'career', eventType: 'choice', weight: 5, title: '职业年金', text: '单位开始缴纳职业年金，个人缴费比例为4%。有人觉得这是好事，也有人觉得到手工资又少了。', choices: [
    { text: '支持政策按时足额缴纳', effects: {wealth: -1, mentalPressure: -1, political: 1, integrity: 1} },
    { text: '了解清楚退休能拿多少', effects: {iq: 2, mentalPressure: -1, wealth: 0} },
    { text: '抱怨到手工资变少了', effects: {mentalPressure: 2, desire: 1, eq: -1} },
  ]},
  { id: 'enc031', stage: 'career', eventType: 'choice', weight: 5, title: '补充医保', text: '单位工会组织购买补充医疗保险，一年几百块，可以报销医保目录外的费用。你犹豫要不要参加。', choices: [
    { text: '花小钱买安心参加', effects: {wealth: -1, mentalPressure: -2, risk: -1, eq: 1} },
    { text: '身体好不需要浪费钱', effects: {wealth: 1, mentalPressure: 1, risk: 1} },
    { text: '给家人也买一份', effects: {wealth: -2, mentalPressure: -2, eq: 1, risk: -1} },
  ]},
  { id: 'enc032', stage: 'career', eventType: 'choice', weight: 4, title: '商业保险', text: '保险代理人推荐一款重疾险+医疗险组合，保额百万，年缴保费六千。条款复杂，你看了半天没看懂。', choices: [
    { text: '请懂行的朋友帮忙看条款', effects: {iq: 2, eq: 1, wealth: -1, mentalPressure: -1} },
    { text: '相信代理人直接投保', effects: {wealth: -2, risk: -1, mentalPressure: 1, eq: 1} },
    { text: '暂不投保再比较比较', effects: {mentalPressure: 0, iq: 1, wealth: 0} },
  ]},
  { id: 'enc033', stage: 'career', eventType: 'choice', weight: 6, title: '车险续保', text: '车险快到期了，几家保险公司都打来电话报价。有送的、有返现的、有送保养的，价格也各不相同。', choices: [
    { text: '比价后选择大公司理赔好', effects: {wealth: -1, mentalPressure: -1, iq: 1, risk: -1} },
    { text: '选最便宜的省钱', effects: {wealth: 2, risk: 2, mentalPressure: 1} },
    { text: '通过熟人买有返现', effects: {wealth: 1, eq: 1, risk: 1, mentalPressure: 0} },
  ]},
  { id: 'enc034', stage: 'career', eventType: 'choice', weight: 6, title: '意外险', text: '出差途中目睹一起交通事故，你意识到意外险的重要性。回来后想给自己买一份意外险。', choices: [
    { text: '购买综合意外险保全年', effects: {wealth: -1, mentalPressure: -2, risk: -2, integrity: 1} },
    { text: '只买短期出行意外险', effects: {wealth: 0, mentalPressure: -1, risk: -1} },
    { text: '觉得没必要不买', effects: {mentalPressure: 1, risk: 2, wealth: 1} },
  ]},
  { id: 'enc035', stage: 'career', eventType: 'choice', weight: 5, title: '重疾险', text: '单位体检，一位同事查出重疾，治疗费用惊人。你开始认真考虑给自己配置重疾险。', choices: [
    { text: '趁健康及时投保重疾险', effects: {wealth: -2, mentalPressure: -2, risk: -2, iq: 1} },
    { text: '等有闲钱了再买', effects: {wealth: 1, risk: 2, mentalPressure: 1} },
    { text: '给全家都配置重疾保障', effects: {wealth: -3, mentalPressure: -3, eq: 1, risk: -2} },
  ]},
  { id: 'enc036', stage: 'career', eventType: 'choice', weight: 5, title: '子女教育金', text: '孩子要上小学了，教育支出逐年增加。银行推荐一款教育金产品，强制储蓄专款专用。', choices: [
    { text: '开户定投为孩子未来储备', effects: {wealth: -2, mentalPressure: -2, iq: 1, eq: 1} },
    { text: '自己理财收益更高', effects: {wealth: 1, iq: 2, risk: 2, mentalPressure: 1} },
    { text: '走一步看一步不规划', effects: {mentalPressure: 2, wealth: 0, desire: -1} },
  ]},
  { id: 'enc037', stage: 'career', eventType: 'choice', weight: 4, title: '装修贷款', text: '新房交房了要装修，装修公司报价25万。你的积蓄不够，考虑申请装修贷款。', choices: [
    { text: '申请正规银行装修贷', effects: {wealth: -3, mentalPressure: 2, iq: 1, workAbility: 1} },
    { text: '简装省钱量力而行', effects: {wealth: -1, mentalPressure: -1, integrity: 1} },
    { text: '用信用卡分期付款', effects: {wealth: -2, risk: 2, mentalPressure: 2, desire: 1} },
  ]},
  { id: 'enc038', stage: 'career', eventType: 'choice', weight: 5, title: '消费贷', text: '银行推销消费贷，利率低至3.8%，秒批秒贷。你有点心动，想贷一笔出来周转。', choices: [
    { text: '不贷款量入为出', effects: {integrity: 2, mentalPressure: -1, wealth: 0} },
    { text: '贷一笔投资赚利差', effects: {wealth: 2, risk: 4, mentalPressure: 3, desire: 2} },
    { text: '贷一小笔应急周转', effects: {wealth: 1, mentalPressure: 1, risk: 1} },
  ]},
  { id: 'enc039', stage: 'career', eventType: 'choice', weight: 6, title: '信用卡积分', text: '信用卡积分年底清零，你的积分够兑换一个小家电或者航空里程。', choices: [
    { text: '兑换实用家电', effects: {wealth: 1, mentalPressure: -1, iq: 1} },
    { text: '兑换航空里程出行用', effects: {wealth: 1, desire: 1, mentalPressure: -1, eq: 1} },
    { text: '积分太少懒得兑换', effects: {mentalPressure: -2, wealth: -1} },
  ]},
  { id: 'enc040', stage: 'career', eventType: 'choice', weight: 6, title: '返现优惠', text: '电商平台大促，信用卡有满减返现活动。你看中一件商品，正好可以用优惠。', choices: [
    { text: '需要才买用上优惠', effects: {wealth: 1, mentalPressure: -1, iq: 1} },
    { text: '为了优惠凑单买一堆', effects: {wealth: -2, desire: 2, mentalPressure: 1} },
    { text: '不凑热闹不冲动消费', effects: {integrity: 1, mentalPressure: -1, wealth: 0} },
  ]},
  { id: 'enc041', stage: 'career', eventType: 'choice', weight: 5, title: '团购优惠', text: '单位同事组织团购某种保健品，说团购价便宜一半。但产品你没听过，效果存疑。', choices: [
    { text: '不跟风不买不熟悉产品', effects: {integrity: 1, mentalPressure: -1, wealth: 1, eq: -1} },
    { text: '跟着团购买一份试试', effects: {wealth: -1, eq: 1, mentalPressure: 0, risk: 1} },
    { text: '自己查查产品评价再说', effects: {iq: 2, mentalPressure: 0, wealth: 0} },
  ]},
  { id: 'enc042', stage: 'career', eventType: 'choice', weight: 5, title: '二手置换', text: '想把旧车置换成新车，4S店给的置换价很低，二手车平台报价高一些但手续繁琐。', choices: [
    { text: '在4S店置换图省心', effects: {wealth: -2, mentalPressure: -1, workAbility: 0} },
    { text: '卖二手车平台多卖钱', effects: {wealth: 1, mentalPressure: 2, iq: 1} },
    { text: '不换车继续开旧的', effects: {wealth: 2, mentalPressure: 0, integrity: 1} },
  ]},
  { id: 'enc043', stage: 'career', eventType: 'choice', weight: 5, title: '节能补贴', text: '政府推出新能源汽车节能补贴，你考虑换一辆新能源车，能省不少油钱还能拿补贴。', choices: [
    { text: '换新能源车享受补贴', effects: {wealth: 2, mentalPressure: -1, iq: 1, risk: -1} },
    { text: '观望充电设施完善再说', effects: {mentalPressure: 0, iq: 1, wealth: 0} },
    { text: '燃油车更踏实不换', effects: {wealth: -1, mentalPressure: 0, desire: 1} },
  ]},
  { id: 'enc044', stage: 'career', eventType: 'choice', weight: 4, title: '购房补贴', text: '市里出台人才购房补贴政策，你符合条件可以申请一笔补贴，但要求五年内不得转让房产。', choices: [
    { text: '申请补贴减轻购房压力', effects: {wealth: 3, mentalPressure: -2, iq: 1, integrity: 1} },
    { text: '担心限制条件放弃申请', effects: {mentalPressure: -2, wealth: -1, desire: 1} },
    { text: '咨询清楚再决定', effects: {iq: 2, mentalPressure: -1, wealth: 0} },
  ]},
  { id: 'enc045', stage: 'career', eventType: 'choice', weight: 4, title: '人才公寓', text: '单位分配人才公寓，你可以申请入住，租金远低于市场价。但面积不大，离单位也有一段距离。', choices: [
    { text: '申请入住节省租金', effects: {wealth: 2, mentalPressure: -2, workAbility: 1} },
    { text: '自己租房住得更舒服', effects: {wealth: -2, desire: 2, mentalPressure: 1} },
    { text: '入住但攒钱准备买房', effects: {wealth: 1, mentalPressure: -1, iq: 1, integrity: 1} },
  ]},

  // ========== 腐败风险类（enc046 ~ enc065） ==========
  { id: 'enc046', stage: 'career', eventType: 'choice', weight: 5, title: '购物卡', text: '一个服务对象过节来拜访，硬塞给你一张面值2000元的购物卡，说"一点心意，过节了给家人买点东西"。', choices: [
    { text: '坚决拒收讲明纪律', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -1} },
    { text: '收下事后上交廉政账户', effects: {integrity: 2, risk: -1, mentalPressure: 2, background: 1} },
    { text: '收下用于家庭消费', effects: {wealth: 2, risk: 5, integrity: -4, mentalPressure: 3, desire: 2} },
  ]},
  { id: 'enc047', stage: 'career', eventType: 'choice', weight: 6, title: '土特产', text: '下乡调研结束，乡镇同志塞给你一后备箱土特产，有土鸡、腊肉、山货，价值不菲。', choices: [
    { text: '婉拒不拿群众一针一线', effects: {integrity: 3, risk: -2, mentalPressure: 1, eq: 1} },
    { text: '象征性拿一点其余退回', effects: {integrity: 1, risk: 1, mentalPressure: 1, eq: 1} },
    { text: '全部带回分给同事', effects: {wealth: 1, risk: 3, integrity: -2, eq: 1, mentalPressure: 1} },
  ]},
  { id: 'enc048', stage: 'career', eventType: 'choice', weight: 5, title: '礼品卡', text: '年底了，一个长期合作供应商送来一张面值5000元的礼品卡，说是"感谢一年来的支持"。', choices: [
    { text: '当面退回表明立场', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -1} },
    { text: '收下但退还等值现金', effects: {integrity: 1, risk: 1, mentalPressure: 2, eq: 1} },
    { text: '收下心安理得', effects: {wealth: 2, risk: 6, integrity: -5, mentalPressure: 3, desire: 2} },
  ]},
  { id: 'enc049', stage: 'career', eventType: 'choice', weight: 5, title: '购物券', text: '单位发福利，有人提议用公款购买购物券发放给职工，每人500元。"反正是大家的福利，不会有人查。"', choices: [
    { text: '坚决反对公款发券违规', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -2} },
    { text: '不反对也不参与', effects: {integrity: 1, mentalPressure: 1, risk: 0, eq: -1} },
    { text: '支持发福利大家高兴', effects: {wealth: 1, risk: 5, integrity: -4, mentalPressure: 2, eq: 1} },
  ]},
  { id: 'enc050', stage: 'career', eventType: 'choice', weight: 5, title: '节礼', text: '中秋节，一位企业老板登门拜访，带来一盒高档月饼和两条中华烟，价值数千元。', choices: [
    { text: '拒收节礼守住底线', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -1} },
    { text: '收下月饼退回烟', effects: {integrity: -1, risk: 2, mentalPressure: 1, eq: 1} },
    { text: '热情收下留老板吃饭', effects: {wealth: 1, risk: 6, integrity: -5, mentalPressure: 3, eq: 1} },
  ]},
  { id: 'enc051', stage: 'career', eventType: 'choice', weight: 4, title: '谢师宴', text: '孩子高考考上重点大学，亲戚朋友张罗着要办谢师宴，还要请孩子的老师们。现在明令禁止办谢师宴。', choices: [
    { text: '不办谢师宴遵守规定', effects: {integrity: 3, risk: -2, mentalPressure: 1, political: 1} },
    { text: '小范围家庭聚餐', effects: {integrity: 1, risk: 1, mentalPressure: 1, eq: 1} },
    { text: '大办特办收份子钱', effects: {wealth: 3, risk: 6, integrity: -5, mentalPressure: 2, desire: 3} },
  ]},
  { id: 'enc052', stage: 'career', eventType: 'choice', weight: 4, title: '升学宴', text: '同事孩子考上名校，给你发请柬参加升学宴。你明知违规但不去又怕得罪同事。', choices: [
    { text: '不参加也不送礼', effects: {integrity: 3, risk: -2, mentalPressure: 1, eq: -2} },
    { text: '托人带个红包不到场', effects: {wealth: -1, risk: 2, integrity: -1, mentalPressure: 1, eq: 1} },
    { text: '到场祝贺随大流', effects: {wealth: -2, risk: 3, integrity: -2, mentalPressure: 1, eq: 1} },
  ]},
  { id: 'enc053', stage: 'career', eventType: 'choice', weight: 4, title: '婚丧喜庆', text: '你父亲八十大寿，老家亲戚要来祝寿，预计二十桌。按规定党员干部操办婚丧喜庆要报告备案。', choices: [
    { text: '按规定报告备案控制规模', effects: {integrity: 3, risk: -2, mentalPressure: 2, political: 1} },
    { text: '不报告悄悄办', effects: {risk: 5, integrity: -3, mentalPressure: 3, eq: 1} },
    { text: '不办寿宴简简单单', effects: {integrity: 3, mentalPressure: -1, eq: -1} },
  ]},
  { id: 'enc054', stage: 'career', eventType: 'choice', weight: 5, title: '违规收礼', text: '手中有点审批权后，逢年过节总有人以"看望"为名送来红包礼金。今年春节你收到了不下十个小红包。', choices: [
    { text: '全部退回不留情面', effects: {integrity: 5, risk: -4, mentalPressure: 3, eq: -2, addEnemy: { id: 'enemy_054', name: '周老板', position: '辖区商人', description: '给你送礼被当众退回，面子上过不去，心里记恨' }} },
    { text: '登记上交廉政账户', effects: {integrity: 3, risk: -2, mentalPressure: 2} },
    { text: '收下认为人之常情', effects: {wealth: 4, risk: 7, integrity: -6, mentalPressure: 4, desire: 3} },
  ]},
  { id: 'enc055', stage: 'career', eventType: 'choice', weight: 4, title: '违规送礼', text: '为了孩子入学，你想给校长送个红包"意思一下"。周围有人说"现在都这样，不送办不成事"。', choices: [
    { text: '不送靠正当途径入学', effects: {integrity: 3, risk: -2, mentalPressure: 2, eq: -1} },
    { text: '送点土特产表达心意', effects: {integrity: -1, risk: 2, mentalPressure: 1, eq: 1} },
    { text: '送红包务必办成', effects: {wealth: -3, risk: 5, integrity: -4, mentalPressure: 2, desire: 2} },
  ]},
  { id: 'enc056', stage: 'career', eventType: 'choice', weight: 5, title: '违规吃喝', text: '一个企业老板邀请你去高档会所吃饭，说"就咱们几个朋友，私密性好，不会被发现的"。', choices: [
    { text: '拒绝不去高档场所消费', effects: {integrity: 4, risk: -3, mentalPressure: 1, eq: -1} },
    { text: '去普通餐厅简餐', effects: {integrity: 1, risk: 1, mentalPressure: 1, eq: 1} },
    { text: '欣然前往享受一番', effects: {wealth: 1, risk: 6, integrity: -5, mentalPressure: 3, desire: 3} },
  ]},
  { id: 'enc057', stage: 'career', eventType: 'choice', weight: 4, title: '公车私用', text: '周末要送家人去机场，单位的车就停在那里。司机说"领导都出差了，用一下没事的"。', choices: [
    { text: '叫网约车不碰公车', effects: {integrity: 3, risk: -2, mentalPressure: -1, wealth: -1} },
    { text: '用公车就这一次', effects: {risk: 5, integrity: -4, mentalPressure: 3, wealth: 1, desire: 1} },
    { text: '让司机顺便送一下', effects: {risk: 3, integrity: -2, mentalPressure: 1, eq: 1} },
  ]},
  { id: 'enc058', stage: 'career', eventType: 'choice', weight: 3, title: '公款旅游', text: '有人提议以"学习考察"名义组织科室同志去旅游胜地走一趟，费用从培训费里列支。', choices: [
    { text: '坚决反对公款旅游', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -2} },
    { text: '不反对也不参与', effects: {integrity: 1, risk: 1, mentalPressure: 0, eq: -1} },
    { text: '积极组织大家高兴', effects: {wealth: 1, risk: 7, integrity: -6, mentalPressure: 2, eq: 2, desire: 2} },
  ]},
  { id: 'enc059', stage: 'career', eventType: 'choice', weight: 4, title: '违规发放津补贴', text: '年底经费有结余，有人提议以"加班费""值班费"名义给职工发点钱，否则经费被收回。', choices: [
    { text: '按规定不能违规发放', effects: {integrity: 4, risk: -3, mentalPressure: 2, eq: -2} },
    { text: '换个名目发放', effects: {risk: 5, integrity: -3, mentalPressure: 2, eq: 1, wealth: 1} },
    { text: '据实列支合规使用', effects: {integrity: 2, workAbility: 2, mentalPressure: 1, risk: -1} },
  ]},
  { id: 'enc060', stage: 'career', eventType: 'choice', weight: 4, title: '超标准接待', text: '上级来检查，接待规格是四菜一汤工作餐。但有人提议"加点菜上点酒，别太寒酸了，领导会不高兴"。', choices: [
    { text: '严格执行接待标准', effects: {integrity: 4, risk: -2, mentalPressure: 2, eq: -1} },
    { text: '超标一点但不上烟酒', effects: {integrity: -1, risk: 2, mentalPressure: 1, eq: 1} },
    { text: '上好菜好酒隆重接待', effects: {risk: 6, integrity: -5, mentalPressure: 2, eq: 1, desire: 2} },
  ]},
  { id: 'enc061', stage: 'career', eventType: 'choice', weight: 4, title: '办公用房', text: '你提拔后分到了独立办公室，面积超标了几平米。有人提醒你"超标要整改，但你这个级别查得不严"。', choices: [
    { text: '主动腾退调整到合规面积', effects: {integrity: 4, risk: -3, mentalPressure: 1, political: 1} },
    { text: '等检查时再说', effects: {risk: 3, integrity: -2, mentalPressure: 1, desire: 1} },
    { text: '不管它先享受着', effects: {risk: 4, integrity: -3, mentalPressure: -1, desire: 2} },
  ]},
  { id: 'enc062', stage: 'career', eventType: 'choice', weight: 4, title: '配备公车', text: '你提拔后符合配车标准，车管科问你选什么车。有人暗示可以"超标配一辆，大家都不说就没事"。', choices: [
    { text: '严格按标准选车', effects: {integrity: 3, risk: -2, mentalPressure: 1, political: 1} },
    { text: '选标准内最好的', effects: {integrity: 1, risk: 1, mentalPressure: 1, desire: 1} },
    { text: '超标配车显身份', effects: {risk: 6, integrity: -5, mentalPressure: 2, desire: 3} },
  ]},
  { id: 'enc063', stage: 'career', eventType: 'choice', weight: 5, title: '公务卡', text: '单位推行公务卡结算，要求公务消费必须用公务卡。但你习惯用现金，觉得公务卡麻烦。', choices: [
    { text: '主动办卡规范使用', effects: {integrity: 2, risk: -2, mentalPressure: -1, workAbility: 1} },
    { text: '办了但很少用', effects: {integrity: 0, risk: 1, mentalPressure: 0} },
    { text: '坚持用现金便于操作', effects: {risk: 4, integrity: -3, mentalPressure: 1, desire: 1} },
  ]},
  { id: 'enc064', stage: 'career', eventType: 'choice', weight: 4, title: '虚开发票', text: '科室经费快被收回，有人提议找几张发票"做一下账"，把经费套出来发给大家。', choices: [
    { text: '坚决反对虚开发票', effects: {integrity: 5, risk: -4, mentalPressure: 2, eq: -2} },
    { text: '不参与也不举报', effects: {integrity: 0, risk: 2, mentalPressure: 1, eq: -1} },
    { text: '配合操作大家都受益', effects: {wealth: 1, risk: 8, integrity: -7, mentalPressure: 4, eq: 1, desire: 2} },
  ]},
  { id: 'enc065', stage: 'career', eventType: 'choice', weight: 3, title: '套取资金', text: '一个项目经费有结余，领导暗示你"想办法处理一下，给科室同志发点福利"。这是严重的违纪行为。', choices: [
    { text: '拒绝并说明严重后果', effects: {integrity: 5, risk: -3, mentalPressure: 3, eq: -2, positionWeight: -1} },
    { text: '装作没听见不执行', effects: {integrity: 2, risk: 1, mentalPressure: 2, eq: -1} },
    { text: '按要求套取资金', effects: {wealth: 2, risk: 9, integrity: -8, mentalPressure: 5, eq: 1, desire: 3} },
  ]},

  // ========== 副业创收类（enc066 ~ enc075） ==========
  { id: 'enc066', stage: 'career', eventType: 'choice', weight: 5, title: '写作投稿', text: '你文笔不错，有杂志约你写业务相关的文章，稿费千字200元。公务员兼职写作是否违规，界限模糊。', choices: [
    { text: '用业余时间写作赚取稿费', effects: {wealth: 1, iq: 2, mentalPressure: 2, workAbility: 1, risk: 1} },
    { text: '只写不署名避免麻烦', effects: {wealth: 1, iq: 1, mentalPressure: 1, risk: 0} },
    { text: '怕违规放弃稿费机会', effects: {integrity: 2, mentalPressure: -1, wealth: -1} },
  ]},
  { id: 'enc067', stage: 'career', eventType: 'choice', weight: 5, title: '自媒体', text: '你在一个专业领域有积累，想开个自媒体账号分享知识。担心被认出来，也怕单位有意见。', choices: [
    { text: '匿名运营分享专业知识', effects: {wealth: 2, iq: 2, eq: 1, risk: 2, mentalPressure: 2} },
    { text: '实名运营打造个人品牌', effects: {wealth: 2, eq: 2, risk: 3, mentalPressure: 3, desire: 2} },
    { text: '不开通自媒体专心工作', effects: {integrity: 2, mentalPressure: -1, wealth: -1, workAbility: 1} },
  ]},
  { id: 'enc068', stage: 'career', eventType: 'choice', weight: 4, title: '网约车', text: '工资不够花，你考虑周末跑网约车赚外快。公务员能否兼职跑网约车，众说纷纭。', choices: [
    { text: '周末偷偷跑赚点油钱', effects: {wealth: 2, risk: 4, integrity: -2, mentalPressure: 3, eq: 1} },
    { text: '不跑踏实过日子', effects: {integrity: 2, mentalPressure: -1, wealth: -1} },
    { text: '向单位报告申请', effects: {integrity: 3, risk: -1, mentalPressure: 1, positionWeight: -1} },
  ]},
  { id: 'enc069', stage: 'career', eventType: 'choice', weight: 4, title: '投资合伙', text: '朋友拉你合伙开一家餐饮店，你出钱不出面，他负责经营。投入十万，预计一年回本。', choices: [
    { text: '投资合伙当甩手掌柜', effects: {wealth: -3, risk: 5, integrity: -3, mentalPressure: 3, desire: 2} },
    { text: '不参与投资保本为上', effects: {integrity: 2, mentalPressure: -1, wealth: 0} },
    { text: '小额投资试水', effects: {wealth: -1, risk: 2, mentalPressure: 1, eq: 1} },
  ]},
  { id: 'enc070', stage: 'career', eventType: 'choice', weight: 4, title: '开店', text: '配偶想开个小店做生意，让你帮忙张罗。公务员本人不能经商办企业，但配偶可以。', choices: [
    { text: '配偶开店你不参与经营', effects: {wealth: 1, mentalPressure: 2, eq: 1, risk: 1} },
    { text: '暗中帮忙打擦边球', effects: {wealth: 2, risk: 5, integrity: -3, mentalPressure: 3, desire: 2} },
    { text: '劝配偶不要开店', effects: {integrity: 2, mentalPressure: -1, eq: -1, wealth: 0} },
  ]},
  { id: 'enc071', stage: 'career', eventType: 'choice', weight: 4, title: '微商', text: '同学在微信上做微商卖护肤品，月入过万，拉你一起做。说只需发发朋友圈，零成本。', choices: [
    { text: '拒绝做微商影响形象', effects: {integrity: 2, mentalPressure: -1, eq: -1, wealth: -1} },
    { text: '偷偷做用小号', effects: {wealth: 2, risk: 4, integrity: -3, mentalPressure: 2, desire: 2} },
    { text: '帮同学转发不直接做', effects: {eq: 1, wealth: 0, risk: 1, mentalPressure: 1} },
  ]},
  { id: 'enc072', stage: 'career', eventType: 'choice', weight: 3, title: '知识付费', text: '你在某专业领域是行家，有平台邀请你录制付费课程，预计收入可观。但公务员兼职取酬有严格规定。', choices: [
    { text: '录制课程分享知识', effects: {wealth: 3, iq: 2, eq: 1, risk: 4, mentalPressure: 3, desire: 2} },
    { text: '免费分享不收费', effects: {integrity: 3, eq: 1, mentalPressure: 1, risk: -1} },
    { text: '放弃专心本职工作', effects: {integrity: 2, workAbility: 1, mentalPressure: -1, wealth: -2} },
  ]},
  { id: 'enc073', stage: 'career', eventType: 'choice', weight: 3, title: '版权收入', text: '你利用业余时间写了一本业务专著，出版社给你付了一笔版税。这属于知识产权收入，但金额不小。', choices: [
    { text: '如实申报领取版税', effects: {wealth: 3, iq: 3, integrity: 2, mentalPressure: 1, workAbility: 2} },
    { text: '不申报担心被查', effects: {wealth: 3, risk: 4, integrity: -2, mentalPressure: 3} },
    { text: '捐给单位图书室', effects: {integrity: 4, mentalPressure: -1, wealth: -3, eq: 1} },
  ]},
  { id: 'enc074', stage: 'career', eventType: 'choice', weight: 4, title: '咨询兼职', text: '一家咨询公司高薪请你做兼职顾问，利用你的专业知识提供咨询。每月顾问费一万。', choices: [
    { text: '拒绝兼职顾问违反规定', effects: {integrity: 4, risk: -3, mentalPressure: -1, wealth: -2} },
    { text: '暗中兼职收取费用', effects: {wealth: 4, risk: 7, integrity: -5, mentalPressure: 4, desire: 3} },
    { text: '免费提供偶尔咨询', effects: {eq: 1, integrity: 1, mentalPressure: 1, wealth: 0} },
  ]},
  { id: 'enc075', stage: 'career', eventType: 'choice', weight: 3, title: '专利申请', text: '你研发的一项技术革新可以申请专利。职务发明属于单位，但你可以在业余改进后以个人名义申请。', choices: [
    { text: '如实申报职务发明', effects: {integrity: 3, workAbility: 2, mentalPressure: 1, iq: 2, wealth: 1} },
    { text: '以个人名义申请专利', effects: {wealth: 3, risk: 5, integrity: -4, mentalPressure: 3, iq: 2} },
    { text: '放弃申请共享给单位', effects: {integrity: 3, workAbility: 2, mentalPressure: -1, eq: 1} },
  ]},

  // ========== 职场危机类（enc076 ~ enc090） ==========
  { id: 'enc076', stage: 'career', eventType: 'choice', weight: 4, title: '被举报', text: '纪检部门收到匿名举报信，反映你在项目审批中存在问题。纪检组找你谈话了解情况，你心里一惊。', choices: [
    { text: '如实说明情况配合调查', effects: {integrity: 3, mentalPressure: 4, risk: -1, background: -1} },
    { text: '紧张失态支支吾吾', effects: {mentalPressure: 5, risk: 2, integrity: -1, eq: -1} },
    { text: '找关系打听举报人是谁', effects: {risk: 4, integrity: -3, mentalPressure: 3, background: 1} },
  ]},
  { id: 'enc077', stage: 'career', eventType: 'choice', weight: 3, title: '被调查', text: '你被立案调查，纪检部门通知你接受组织审查。你清楚自己确实有问题，但心存侥幸。', choices: [
    { text: '主动交代争取宽大处理', effects: {integrity: 3, risk: -3, mentalPressure: 5, positionWeight: -3} },
    { text: '避重就轻交代小问题', effects: {risk: 3, integrity: -2, mentalPressure: 4, positionWeight: -2} },
    { text: '顽抗到底拒不交代', effects: {risk: 9, integrity: -7, mentalPressure: 6, positionWeight: -5} },
  ]},
  { id: 'enc078', stage: 'career', eventType: 'choice', weight: 5, title: '谈话提醒', text: '组织上找你谈话提醒，说接到反映你的一些苗头性问题。这是"红脸出汗"的提醒，也是警示。', choices: [
    { text: '虚心接受有则改之', effects: {integrity: 3, mentalPressure: 3, risk: -2, political: 1} },
    { text: '据理力争辩解', effects: {mentalPressure: 3, risk: 2, integrity: -1, eq: -1} },
    { text: '表面接受心里不服', effects: {integrity: -1, risk: 2, mentalPressure: 2, desire: 1} },
  ]},
  { id: 'enc079', stage: 'career', eventType: 'choice', weight: 4, title: '诫勉谈话', text: '你因工作中存在不当行为被诫勉谈话，影响期为半年。这次谈话记录会装入个人档案。', choices: [
    { text: '深刻反省认真整改', effects: {integrity: 3, mentalPressure: 4, positionWeight: -2, political: 1, workAbility: 1} },
    { text: '消沉一段时间', effects: {mentalPressure: 5, workAbility: -2, desire: -2, positionWeight: -1} },
    { text: '把情绪带到工作中', effects: {mentalPressure: 4, workAbility: -2, eq: -2, risk: 1} },
  ]},
  { id: 'enc080', stage: 'career', eventType: 'choice', weight: 4, title: '通报批评（记档）', text: '你因工作失误被全市通报批评，名字和事迹都上了文件。同事们看你的眼神都变了。', choices: [
    { text: '诚恳接受教训努力改正', effects: {integrity: 2, mentalPressure: 4, workAbility: 1, positionWeight: -2} },
    { text: '觉得丢人想调走', effects: {mentalPressure: 5, positionWeight: -3, eq: -1, desire: -1} },
    { text: '破罐子破摔', effects: {mentalPressure: 3, workAbility: -3, integrity: -2, risk: 2} },
  ]},
  { id: 'enc081', stage: 'career', eventType: 'choice', weight: 3, title: '停职检查', text: '因反映的问题较严重，组织决定让你停职检查。你的工作暂时移交给副手，等待进一步调查。', choices: [
    { text: '认真反思配合组织调查', effects: {integrity: 2, mentalPressure: 5, positionWeight: -3, risk: -1} },
    { text: '四处活动试图摆平', effects: {risk: 5, integrity: -4, mentalPressure: 4, background: 1} },
    { text: '情绪低落消极等待', effects: {mentalPressure: 6, workAbility: -3, desire: -3, positionWeight: -2} },
  ]},
  { id: 'enc082', stage: 'career', eventType: 'choice', weight: 3, title: '调离岗位', text: '组织决定将你调离原岗位，安排到一个边缘科室。明升暗降，你的权力和影响力大不如前。', choices: [
    { text: '服从安排在新岗位努力', effects: {integrity: 2, workAbility: 2, mentalPressure: 3, eq: 1, positionWeight: -2} },
    { text: '怨天尤人消极怠工', effects: {mentalPressure: 4, workAbility: -3, integrity: -2, eq: -2} },
    { text: '找关系想调回原岗位', effects: {background: 2, mentalPressure: 3, risk: 2, positionWeight: -1} },
  ]},
  { id: 'enc083', stage: 'career', eventType: 'choice', weight: 2, title: '降职免职', text: '因严重违纪，你被免去科长职务，降为科员。多年努力付诸东流，办公室也要搬了。', choices: [
    { text: '接受处分重新开始', effects: {integrity: 2, mentalPressure: 6, positionWeight: -5, workAbility: 1} },
    { text: '申诉要求复查', effects: {mentalPressure: 5, positionWeight: -3, risk: 2, integrity: 1} },
    { text: '一蹶不振自暴自弃', effects: {mentalPressure: 7, workAbility: -4, desire: -4, integrity: -2} },
  ]},
  { id: 'enc084', stage: 'career', eventType: 'choice', weight: 4, requirePolitical: 'cpc', requireRisk: 65, title: '开除党籍', text: '因严重违纪违法，你被开除党籍。这是党内的最高处分，意味着政治生命的终结。', choices: [
    { text: '认罪悔罪接受处理', effects: {integrity: 1, mentalPressure: 8, positionWeight: -8, political: 'mass', flag: 'expelledFromParty', risk: -3} },
    { text: '不服申诉上访', effects: {mentalPressure: 7, risk: 4, positionWeight: -7, political: 'mass', flag: 'expelledFromParty'} },
    { text: '精神崩溃无法接受', effects: {mentalPressure: 10, workAbility: -5, desire: -5, positionWeight: -8, political: 'mass', flag: 'expelledFromParty'} },
  ]},
  { id: 'enc085', stage: 'career', eventType: 'choice', weight: 4, requireRisk: 65, title: '开除公职', text: '你被开除公职，失去了"铁饭碗"。多年的体制内生涯戛然而止，未来何去何从？', choices: [
    { text: '接受现实重新规划人生', effects: {mentalPressure: 7, iq: 1, desire: -2, positionWeight: -8, workAbility: 1} },
    { text: '四处申诉不甘心', effects: {mentalPressure: 8, risk: 3, eq: -2, positionWeight: -7} },
    { text: '消沉度日借酒浇愁', effects: {mentalPressure: 9, workAbility: -4, desire: -4, integrity: -2} },
  ]},
  { id: 'enc086', stage: 'career', eventType: 'choice', weight: 5, title: '退休', year: [50, 65], text: '到了法定退休年龄，你要办理退休手续了。离开工作了几十年的单位，心里五味杂陈。', choices: [
    { text: '愉快退休享受晚年生活', effects: {mentalPressure: -4, desire: 2, wealth: 1, eq: 1, workAbility: -1} },
    { text: '返聘继续发挥余热', effects: {wealth: 2, workAbility: 1, mentalPressure: 2, eq: 1} },
    { text: '不舍失落情绪低落', effects: {mentalPressure: 4, desire: -2, eq: -1, workAbility: -1} },
  ]},
  { id: 'enc087', stage: 'career', eventType: 'choice', weight: 4, title: '提前退休', year: [45, 60], text: '工龄满三十年可以申请提前退休。你才五十出头，是退下来享清福，还是继续干几年？', choices: [
    { text: '提前退休开启新生活', effects: {mentalPressure: -3, wealth: -1, desire: 2, eq: 1, workAbility: -1} },
    { text: '继续工作发挥价值', effects: {workAbility: 1, mentalPressure: 1, positionWeight: 1, integrity: 1} },
    { text: '退休后做点小生意', effects: {wealth: 2, risk: 2, mentalPressure: 2, desire: 3} },
  ]},
  { id: 'enc088', stage: 'career', eventType: 'choice', weight: 4, title: '病退', text: '你身体出了状况，医生建议长期休养。可以申请病退，但病退工资比正常退休低不少。', choices: [
    { text: '申请病退保重身体', effects: {mentalPressure: -2, wealth: -2, desire: -1, workAbility: -2} },
    { text: '边治疗边工作不退', effects: {mentalPressure: 4, workAbility: -1, wealth: 1, integrity: 1} },
    { text: '请长假治疗再决定', effects: {mentalPressure: 2, wealth: -1, workAbility: -1, eq: 1} },
  ]},
  { id: 'enc089', stage: 'career', eventType: 'choice', weight: 3, title: '内退', text: '单位精简人员，推出内退政策：距退休不足五年的可以内部退养，发基本工资。', choices: [
    { text: '申请内退回家享福', effects: {mentalPressure: -3, wealth: -1, desire: 2, workAbility: -2, positionWeight: -2} },
    { text: '不内退坚持到退休', effects: {workAbility: 1, mentalPressure: 1, integrity: 1, positionWeight: 1} },
    { text: '内退后另找一份工作', effects: {wealth: 2, risk: 2, mentalPressure: 2, desire: 2} },
  ]},
  { id: 'enc090', stage: 'career', eventType: 'choice', weight: 3, title: '买断工龄', text: '单位改制，提出买断工龄方案：一次性给一笔钱，解除劳动关系。你犹豫要不要接受。', choices: [
    { text: '接受买断自谋职业', effects: {wealth: 5, risk: 3, mentalPressure: 4, desire: 2, eq: -1} },
    { text: '不接受买断留下', effects: {wealth: -1, mentalPressure: 2, integrity: 1, workAbility: 1} },
    { text: '接受买断后创业', effects: {wealth: 3, risk: 6, mentalPressure: 5, desire: 4, iq: 1} },
  ]},


    // ===== v2.1.6 career 深化：答辩/考察/竞争/荣誉/调任（e688-e699）=====
    { id: 'e688', stage: 'career', eventType: 'choice', title: '答辩前夜', weight: 5, year: [32, 58], requireRankMin: 4, pools: ['public'], text: '明天就是晋升答辩。你翻着笔记本，发现去年主抓的那个项目数据记得不全，评委最可能问的就是它。', choices: [
      { text: '连夜补齐数据，模拟问答', effects: {workAbility: 3, mentalPressure: 3, body: -1} },
      { text: '请教答辩经验丰富的前辈', effects: {eq: 2, background: 1, workAbility: 2} },
      { text: '早点睡，养足精神', effects: {body: 2, mentalPressure: -2, risk: 1} },
      { text: '临时抱佛脚翻文件', effects: {workAbility: 1, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'e689', stage: 'career', eventType: 'choice', title: '答辩席上', weight: 4, year: [32, 58], requireRankMin: 4, pools: ['public'], text: '答辩现场，评委突然追问："你汇报里说项目进展顺利，但财务数据好像对不上？"会场安静得能听见空调声。', choices: [
      { text: '从容说明口径差异，提供佐证', effects: {workAbility: 3, eq: 1, positionWeight: 2, mentalPressure: 2} },
      { text: '承认疏漏，现场补充说明', effects: {integrity: 2, workAbility: 2, positionWeight: 1} },
      { text: '含糊带过，强调总体成果', effects: {risk: 3, positionWeight: -1, integrity: -1, mentalPressure: -1} },
      { text: '反问评委，争取思考时间', effects: {eq: 1, risk: 2, mentalPressure: 2} },
    ]},
    { id: 'e690', stage: 'career', eventType: 'choice', title: '考察组谈话', weight: 4, year: [30, 58], requireRankMin: 3, pools: ['public'], text: '组织考察组来了，找你单独谈话，了解你对同事和工作的评价。谈话间他们问起去年那次"风波"，语气随意但眼神认真。', choices: [
      { text: '实事求是，客观评价', effects: {integrity: 2, background: 2, workAbility: 1} },
      { text: '多说优点，回避缺点', effects: {eq: 1, risk: 2, integrity: -1} },
      { text: '趁机反映真实问题', effects: {integrity: 3, risk: 2, reputation: 1} },
      { text: '谨慎措辞，滴水不漏', effects: {background: 1, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'e691', stage: 'career', eventType: 'choice', title: '民主测评', weight: 4, year: [30, 58], requireRankMin: 3, pools: ['public'], text: '晋升前的民主测评开始了。你听说平时和你不对付的同事放话"这次测评有他好看"。你坐在会议室，手里握着测评表。', choices: [
      { text: '平常心对待，相信自己', effects: {workAbility: 2, mentalPressure: -1, integrity: 1} },
      { text: '找关键同事沟通缓和关系', effects: {eq: 2, background: 1, desire: 1} },
      { text: '紧张得坐立不安', effects: {mentalPressure: 3, workAbility: -1} },
      { text: '提前打探测评结果', effects: {risk: 3, heat: 2, integrity: -1} },
    ]},
    { id: 'e692', stage: 'career', eventType: 'choice', title: '档案专项核查', weight: 3, year: [28, 58], requireRankMin: 3, pools: ['public'], text: '组织部门开展档案专项核查，重点核对"三龄两历"。你想起早年间有个经历登记得含糊，核查组约你谈话。', choices: [
      { text: '如实说明情况，配合核查', effects: {integrity: 3, risk: -2, mentalPressure: 1} },
      { text: '先想清楚措辞再回应', effects: {eq: 1, mentalPressure: 2, risk: 1} },
      { text: '找当年经办人确认记录', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
      { text: '含糊其辞试图蒙混', effects: {risk: 5, heat: 4, integrity: -3} },
    ]},
    { id: 'e693', stage: 'career', eventType: 'choice', title: '良性竞争', weight: 5, year: [26, 55], requireRankMin: 2, pools: ['public'], text: '同科室的小李和你都盯上了同一批晋升名额。他能力不差，人也正派。你们俩在走廊相遇，气氛微妙。', choices: [
      { text: '公平竞争，互相成就', effects: {workAbility: 2, eq: 2, reputation: 1} },
      { text: '和他开诚布公谈一次', effects: {eq: 2, background: 1, mentalPressure: -1} },
      { text: '暗中较劲，处处压他一头', effects: {desire: 2, risk: 2, eq: -1} },
      { text: '主动让贤，成全他', effects: {integrity: 2, positionWeight: -1, reputation: 1} },
    ]},
    { id: 'e694', stage: 'career', eventType: 'choice', title: '恶性竞争', weight: 4, year: [26, 55], requireRankMin: 2, pools: ['public'], text: '竞争晋升的人开始使绊子：你的材料被"借走"迟迟不还，领导面前出现了对你不利的"匿名反映"。你心里清楚是谁。', choices: [
      { text: '收集证据，正面澄清', effects: {integrity: 2, workAbility: 2, risk: 2} },
      { text: '找领导当面说明情况', effects: {background: 2, workAbility: 1, risk: 1} },
      { text: '以牙还牙，也给他上眼药', effects: {risk: 4, heat: 3, integrity: -2} },
      { text: '隐忍不发，用业绩说话', effects: {workAbility: 3, mentalPressure: 2, integrity: 1} },
    ]},
    { id: 'e695', stage: 'career', eventType: 'choice', title: '竞争之后', weight: 3, year: [26, 58], requireRankMin: 2, pools: ['public'], text: '晋升结果出来了，你赢了。落选的那位同事在楼道里遇见你，脸色不太自然。你们曾经关系不错。', choices: [
      { text: '主动缓和，约他聊聊', effects: {eq: 2, background: 1, reputation: 1} },
      { text: '低调谦逊，不摆姿态', effects: {eq: 1, integrity: 1, workAbility: 1} },
      { text: '保持距离，各走各路', effects: {mentalPressure: -1, background: -1} },
      { text: '让他认清差距', effects: {eq: -2, desire: 1, background: -1} },
    ]},
    { id: 'e696', stage: 'career', eventType: 'choice', title: '评优申报', weight: 4, year: [26, 55], requireRankMin: 2, pools: ['public'], text: '年度评优开始了，科室只有一个名额。你手头有实打实的业绩，但材料写得平淡，会写材料的同事又恰好是竞争对手。', choices: [
      { text: '认真打磨申报材料', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '请笔杆子同事帮忙润色', effects: {eq: 1, background: 1, workAbility: 2} },
      { text: '业绩摆在那，材料简单写', effects: {workAbility: 1, positionWeight: -1, risk: 1} },
      { text: '找领导争取名额', effects: {background: 2, desire: 1, risk: 1} },
    ]},
    { id: 'e697', stage: 'career', eventType: 'choice', title: '表彰演讲', weight: 3, year: [28, 58], requireRankMin: 3, pools: ['public'], text: '你被评为先进，要在全系统大会上发言。台下坐着几百人，还有上级领导。稿子改到第三版，你仍觉得不够好。', choices: [
      { text: '脱稿讲，讲真实故事', effects: {eq: 2, reputation: 2, workAbility: 1} },
      { text: '按稿念，稳字当头', effects: {workAbility: 1, mentalPressure: -1, positionWeight: 1} },
      { text: '请宣传骨干帮忙打磨', effects: {background: 1, workAbility: 2, eq: 1} },
      { text: '推让给其他同事上台', effects: {positionWeight: -1, eq: 1, mentalPressure: -2} },
    ]},
    { id: 'e698', stage: 'career', eventType: 'choice', title: '新单位首月', weight: 4, year: [25, 55], requireRankMin: 2, pools: ['public'], text: '调任新单位第一个月，一切都要重新适应：新领导风格、新同事圈子、新业务流程。你感觉像刚入职的新人。', choices: [
      { text: '主动请教，快速上手', effects: {workAbility: 2, eq: 2, background: 1} },
      { text: '先观察，摸清门道再动', effects: {iq: 1, mentalPressure: 1, risk: -1} },
      { text: '按老单位习惯行事', effects: {workAbility: -1, risk: 2, background: -1} },
      { text: '请老同事介绍情况', effects: {background: 2, eq: 1} },
    ]},
    { id: 'e699', stage: 'career', eventType: 'choice', title: '新同事磨合', weight: 3, year: [25, 58], requireRankMin: 2, pools: ['public'], text: '新科室有位老同事对你的到来不冷不热，分工上处处留一手。你提交的流程建议被他当面说"外行话"。', choices: [
      { text: '请他指教，请教业务细节', effects: {eq: 2, workAbility: 2, background: 1} },
      { text: '用实际成绩证明自己', effects: {workAbility: 3, mentalPressure: 1} },
      { text: '向领导反映分工问题', effects: {background: 1, risk: 1, eq: -1} },
      { text: '也对他冷脸相待', effects: {eq: -2, background: -1, mentalPressure: 1} },
    ]},

    // ===== v2.1.7 仕途场景扩充 + 部门特色 + 联系人深度（e700-e720）=====
    { id: 'e700', stage: 'career', eventType: 'choice', title: '民主生活会（年度检视）', weight: 4, year: [26, 60], requireRankMin: 2, pools: ['public'], text: '年度民主生活会召开，要求开展批评与自我批评。轮到你了，屋子里安静下来，几双眼睛都在看你准备说什么。', choices: [
      { text: '认真准备，自我剖析到位', effects: {integrity: 2, workAbility: 1, mentalPressure: 1} },
      { text: '避重就轻，走个过场', effects: {integrity: -1, mentalPressure: -1, risk: 1} },
      { text: '借机会真刀真枪批评同事', effects: {eq: -1, integrity: 2, risk: 1} },
      { text: '反思自己，表态整改', effects: {eq: 1, integrity: 2, mentalPressure: -1} },
    ]},
    { id: 'e701', stage: 'career', eventType: 'choice', title: '班子分工调整', weight: 3, year: [30, 62], requireRankMin: 4, pools: ['public'], text: '单位班子重新分工，核心业务部门出现空缺。主要领导征询你的意向，话里话外暗示"看你怎么表态"。', choices: [
      { text: '主动请缨分管核心业务', effects: {positionWeight: 2, workAbility: 1, mentalPressure: 2} },
      { text: '服从安排，接受任何分工', effects: {eq: 1, integrity: 1, positionWeight: 1} },
      { text: '推脱难啃的硬骨头', effects: {positionWeight: -1, eq: -1, mentalPressure: -1} },
      { text: '向主要领导表达意愿争取有利分工', effects: {background: 2, desire: 1, risk: 1} },
    ]},
    { id: 'e702', stage: 'career', eventType: 'choice', title: '节假日值班', weight: 3, year: [22, 58], requireRankMin: 2, pools: ['public'], text: '国庆值班表排出来了。你排在中间，但家里早就计划好全家出游——孩子盼了半年。', choices: [
      { text: '主动承担值班任务', effects: {integrity: 1, reputation: 1, workAbility: 1, familyPressure: 1} },
      { text: '按排班执行，不主动揽活', effects: {mentalPressure: -1, familyPressure: -1} },
      { text: '想办法和同事调班', effects: {eq: 1, familyPressure: -1, reputation: -1} },
      { text: '请领导调整排班', effects: {background: -1, eq: -1, familyPressure: -1} },
    ]},
    { id: 'e703', stage: 'career', eventType: 'choice', title: '机关食堂整改', weight: 3, year: [22, 55], requireRankMin: 2, pools: ['public'], text: '机关食堂饭菜质量被大家吐槽已久，领导点名让你牵头整改。有人劝你别接这烫手山芋，也有人等着看笑话。', choices: [
      { text: '牵头推动，调查问卷+明察暗访', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '随大流，不主动表态', effects: {mentalPressure: -1, positionWeight: -1} },
      { text: '只向上反映问题不当牵头人', effects: {integrity: 1, eq: 1, workAbility: -1} },
      { text: '借整改机会立威', effects: {positionWeight: 2, eq: -1, risk: 1} },
    ]},
    { id: 'e704', stage: 'career', eventType: 'choice', title: '任前公示风波', weight: 4, year: [30, 60], requireRankMin: 3, pools: ['public'], text: '你的晋升进入任前公示期。公告贴出去第三天，组织部门收到了一封匿名反映信，说你"与商人交往过密"。', choices: [
      { text: '冷静说明情况，配合调查', effects: {eq: 1, integrity: 2, risk: -1, mentalPressure: 2} },
      { text: '托人打听是谁反映的', effects: {risk: 2, background: 1, integrity: -1} },
      { text: '坦然面对，身正不怕影子斜', effects: {integrity: 2, mentalPressure: -1} },
      { text: '主动向组织汇报澄清', effects: {integrity: 3, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e705', stage: 'career', eventType: 'choice', title: '述职述廉大会', weight: 4, year: [30, 62], requireRankMin: 3, pools: ['public'], text: '一年一度的述职述廉大会，全体班子成员和处室负责人到场。你去年分管的工作有成绩也有瑕疵，报告怎么写是个学问。', choices: [
      { text: '如实报告成绩与不足', effects: {integrity: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '重点讲成绩，淡化问题', effects: {risk: 1, positionWeight: 1, integrity: -1} },
      { text: '提前准备，脱稿汇报', effects: {workAbility: 2, eq: 1, reputation: 1} },
      { text: '借述职向领导表功', effects: {background: 1, desire: 1, eq: -1} },
    ]},
    { id: 'e706', stage: 'career', eventType: 'choice', title: '挂职锻炼机会', weight: 3, year: [24, 45], requireRankMin: 2, requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], pools: ['public'], text: '组织部门下发挂职锻炼通知：有去基层乡镇的，有去上级机关的。名额有限，要各单位推荐。选择基层挂职后保留原单位关系，期满根据考核决定去向。', choices: [
      { text: '报名去基层挂职', effects: {workAbility: 2, background: 1, familyPressure: 2, positionWeight: 1, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '挂职基层锻炼' }} },
      { text: '报名去上级机关挂职', effects: {positionWeight: 2, desire: 1, mentalPressure: 2} },
      { text: '放弃机会，安心现职', effects: {mentalPressure: -1, positionWeight: -1} },
      { text: '争取去沿海发达地区交流', effects: {background: 2, desire: 1, risk: 1} },
    ]},
    { id: 'e707', stage: 'career', eventType: 'choice', title: '党校学习名额', weight: 3, year: [26, 55], requireRankMin: 2, pools: ['public'], text: '市委党校中青班报名开始了，每单位一个名额。单位里符合条件的人不少，有人已经私下活动起来。', choices: [
      { text: '主动争取这个名额', effects: {desire: 1, positionWeight: 1, background: 1, mentalPressure: 1} },
      { text: '让给更有需要的同事', effects: {eq: 1, integrity: 1, positionWeight: -1} },
      { text: '顺其自然不刻意争取', effects: {mentalPressure: -1, desire: -1} },
      { text: '找领导表达学习意愿', effects: {background: 2, desire: 1, risk: 1} },
    ]},
    { id: 'e708', stage: 'career', eventType: 'choice', title: '信访接待日（坐班接访）', weight: 4, year: [24, 58], requireRankMin: 2, pools: ['public'], text: '领导信访接待日，你来坐班。一位老人为十年前的土地补偿问题反复上访，情绪激动，材料摊了一桌子。', choices: [
      { text: '认真倾听，现场协调解决', effects: {peopleReputation: 2, reputation: 1, workAbility: 1, mentalPressure: 2} },
      { text: '公事公办，按流程转办', effects: {workAbility: 1, peopleReputation: -1, eq: -1} },
      { text: '推给相关责任部门', effects: {peopleReputation: -2, reputation: -1, integrity: -1} },
      { text: '协调民政救助先解燃眉之急', effects: {peopleReputation: 2, eq: 2, background: -1, mentalPressure: 1} },
    ]},
    { id: 'e709', stage: 'career', eventType: 'choice', title: '案件协调会', weight: 4, year: [26, 58], requireRankMin: 2, pools: ['政法系统'], text: '一起跨部门案件协调会，兄弟单位提出"灵活处理"，暗示可以给当事人"留个面子"。你手里握着刚做好的案情报告。', choices: [
      { text: '依法依规，坚持原则', effects: {integrity: 2, workAbility: 2, risk: 1} },
      { text: '照顾关系单位的面子', effects: {eq: 1, background: 1, risk: 2, integrity: -1} },
      { text: '坚持原则但给足台阶', effects: {eq: 1, integrity: 2, workAbility: 1} },
      { text: '上报请示，请上级定夺', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'e710', stage: 'career', eventType: 'choice', title: '系统上线攻坚', weight: 4, year: [22, 50], requireRankMin: 1, pools: ['技术部门', '数据部门'], text: '政务系统升级上线迫在眉睫，外包公司却频频出问题：接口对接不上、数据迁移出错、测试用例不过。领导盯着你。', choices: [
      { text: '带头加班，逐项攻坚', effects: {workAbility: 3, body: -1, mentalPressure: 3} },
      { text: '合理排期，稳步推进', effects: {workAbility: 1, eq: 1, mentalPressure: 1} },
      { text: '把责任推给外包公司', effects: {risk: 2, workAbility: -1, integrity: -1} },
      { text: '申请延长工期并说明风险', effects: {integrity: 2, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'e711', stage: 'career', eventType: 'choice', title: '群众来访集中接待', weight: 4, year: [22, 55], requireRankMin: 2, pools: ['民生部门'], text: '集中接访日，来了一屋子人：低保没办下来的、医保报销卡壳的、老旧小区改造诉求的。每一件都急，每一件都难。', choices: [
      { text: '现场协调，能办即办', effects: {peopleReputation: 3, reputation: 2, mentalPressure: 3, workAbility: 1} },
      { text: '记录在案，限时办结', effects: {peopleReputation: 1, workAbility: 1, mentalPressure: 1} },
      { text: '劝返了事，改日再来', effects: {peopleReputation: -2, reputation: -1, integrity: -1} },
      { text: '挑典型问题现场督办', effects: {peopleReputation: 2, reputation: 2, workAbility: 2, mentalPressure: 2} },
    ]},
    { id: 'e712', stage: 'career', eventType: 'choice', title: '执法检查遭遇对抗', weight: 4, year: [24, 58], requireRankMin: 2, pools: ['执法部门'], text: '现场执法时，当事人情绪激动，掏出手机录像并叫嚷"暴力执法"。围观群众越来越多，你的同事已经有些慌乱。', choices: [
      { text: '规范执法，文明处置', effects: {integrity: 2, reputation: 1, risk: -1, eq: 1} },
      { text: '强行带离，快速了结', effects: {risk: 2, reputation: -1, eq: -1, mentalPressure: 1} },
      { text: '暂停执法，请示上级', effects: {workAbility: 1, eq: 1, mentalPressure: 1} },
      { text: '解释政策，稳定现场情绪', effects: {eq: 2, peopleReputation: 1, workAbility: 1} },
    ]},
    { id: 'e713', stage: 'career', eventType: 'choice', title: '条块协调难题', weight: 3, year: [24, 56], requireRankMin: 2, pools: ['垂管系统'], text: '你是垂管系统干部，地方政府的项目需要你配合，但上级的业务要求又很刚性。两边都要你"通融"，两边都不松口。', choices: [
      { text: '主动对接地方，寻找两全方案', effects: {eq: 2, background: 1, workAbility: 1} },
      { text: '只认上级，不理会地方', effects: {risk: 1, background: -1, eq: -1} },
      { text: '借上级文件给地方施压', effects: {background: 1, workAbility: 1, eq: -1} },
      { text: '如实上报，请上级协调', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'e714', stage: 'career', eventType: 'choice', title: '窗口服务投诉', weight: 4, year: [22, 50], requireRankMin: 1, pools: ['窗口部门'], text: '群众在网上投诉你们窗口"脸难看、事难办"，视频被转发了上千次。领导把舆情通报拍在桌上。', choices: [
      { text: '诚恳道歉，快速处理个案', effects: {peopleReputation: 2, reputation: 1, eq: 1} },
      { text: '解释规定，坚持流程', effects: {integrity: 1, peopleReputation: -1, risk: 1} },
      { text: '内部追责，改进流程', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '联系当事人当面致歉', effects: {peopleReputation: 3, eq: 2, reputation: 2} },
    ]},
    { id: 'e715', stage: 'career', eventType: 'choice', title: '老同学创业求助', weight: 4, year: [26, 55], requireRankMin: 2, requireContact: 'classmate', requireContactMin: 30, pools: ['public'], text: '创业的老同学找上门，想让你牵线认识分管项目的领导。他拍着胸脯说"就是正常对接，绝不让兄弟为难"，但眼神里全是生意。', choices: [
      { text: '帮忙牵线，但提醒合规边界', effects: {eq: 1, background: 1, risk: 2, contactRelation: { id: 'classmate', delta: 15 } } },
      { text: '婉拒，介绍正规渠道', effects: {integrity: 2, eq: 1, contactRelation: { id: 'classmate', delta: -5 } } },
      { text: '直接引荐给分管领导', effects: {background: 2, risk: 3, integrity: -1, contactRelation: { id: 'classmate', delta: 10 } } },
      { text: '公事公办，一切走流程', effects: {integrity: 2, contactRelation: { id: 'classmate', delta: -10 } } },
    ]},
    { id: 'e716', stage: 'career', eventType: 'choice', title: '同乡会换届', weight: 3, year: [24, 58], requireRankMin: 2, requireContact: 'hometown', requireContactMin: 30, pools: ['public'], text: '在外的同乡会换届，老会长点名让你接任秘书长。同乡里做生意的、当律师的都有，也有人直言"这个位置大有可为"。', choices: [
      { text: '接任，为同乡办点实事', effects: {eq: 1, background: 1, reputation: 1, contactRelation: { id: 'hometown', delta: 15 } } },
      { text: '低调参加，不担任职务', effects: {mentalPressure: -1, contactRelation: { id: 'hometown', delta: -5 } } },
      { text: '借机结识资源经营人脉', effects: {background: 2, desire: 1, risk: 1, contactRelation: { id: 'hometown', delta: 10 } } },
      { text: '以工作忙为由推辞', effects: {contactRelation: { id: 'hometown', delta: -10 }, eq: -1} },
    ]},
    { id: 'e717', stage: 'career', eventType: 'choice', title: '导师推荐进修', weight: 4, year: [26, 45], requireRankMin: 2, requireContact: 'mentor', requireContactMin: 40, pools: ['public'], text: '导师来电话，说他那里有一个去名校读在职硕士的机会，推荐信都替你写好了，就等你点头。', choices: [
      { text: '接受推荐，专心进修', effects: {iq: 2, workAbility: 2, mentalPressure: 2, body: -1, contactRelation: { id: 'mentor', delta: 10 } } },
      { text: '工作太忙，婉言谢绝', effects: {workAbility: -1, contactRelation: { id: 'mentor', delta: -5 }, mentalPressure: -1} },
      { text: '进修工作两不误', effects: {iq: 1, workAbility: 1, body: -1, mentalPressure: 3, contactRelation: { id: 'mentor', delta: 5 } } },
      { text: '先把机会让给同事', effects: {eq: 2, integrity: 1, contactRelation: { id: 'mentor', delta: -5 } } },
    ]},
    { id: 'e718', stage: 'career', eventType: 'choice', title: '经济责任审计', weight: 3, year: [32, 60], requireRankMin: 4, pools: ['public'], text: '组织对你任职期间的经济责任开展审计。审计组进驻那天，你发现有个经办项目的历史凭证整理得不够齐全。', choices: [
      { text: '全力配合，如实提供材料', effects: {integrity: 2, mentalPressure: 2, risk: -1} },
      { text: '仔细核对账目，不留死角', effects: {workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '紧张担心经手的项目', effects: {mentalPressure: 3, workAbility: -1} },
      { text: '找人打听审计重点', effects: {risk: 3, heat: 2, integrity: -1} },
    ]},
    { id: 'e719', stage: 'career', eventType: 'choice', title: '政协提案办理', weight: 3, year: [26, 58], requireRankMin: 2, pools: ['public'], text: '一份政协提案转到了你手上，反映的是你分管领域的老问题。提案人是有名的"较真委员"，答复不好会追着不放。', choices: [
      { text: '认真办理，高质量答复', effects: {workAbility: 2, reputation: 1, peopleReputation: 1} },
      { text: '按流程办结即可', effects: {workAbility: 1, mentalPressure: -1} },
      { text: '应付了事，套话答复', effects: {reputation: -1, peopleReputation: -1, integrity: -1} },
      { text: '主动邀请委员面商', effects: {eq: 2, reputation: 2, mentalPressure: 1} },
    ]},
    { id: 'e720', stage: 'career', eventType: 'choice', title: '保密检查（例行抽查）', weight: 3, year: [22, 55], requireRankMin: 2, pools: ['public'], text: '保密局来单位例行检查，发现有人把涉密材料拷贝到私人U盘。虽然不是你的，但你在这个科室，检查组问"你了解情况吗"。', choices: [
      { text: '如实反映已知情况', effects: {integrity: 2, eq: -1, risk: 1} },
      { text: '说自己不了解情况', effects: {risk: 2, integrity: -1} },
      { text: '借此自查整改科室隐患', effects: {workAbility: 2, integrity: 1, mentalPressure: 1} },
      { text: '提醒当事人主动说明', effects: {eq: 2, integrity: 1, risk: 1} },
    ]},

    // ===== v2.1.8 中后期挑战扩充（e771-e776，退休前 45-60 岁窗口；e766 为赌博动态事件保留号）=====
    // v2.1.43: 权重上调 1-2 档，强化退休前十年张力
    { id: 'e771', stage: 'career', eventType: 'choice', title: '站好最后一班岗', weight: 6, year: [48, 60], requireRankMin: 3, pools: ['public'], text: '离退休还有几年，单位却接到一项棘手的硬任务。年轻人都躲着走，领导目光扫了一圈，最后落在你身上："老同志，关键时刻还得靠你。"', choices: [
      { text: '接下任务，给年轻人打个样', effects: {workAbility: 3, reputation: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '以身体为由推掉', effects: {reputation: -1, positionWeight: -1, mentalPressure: -2} },
      { text: '接下但要求配足人手', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '推给年轻人锻炼', effects: {eq: -1, workAbility: -1, reputation: -1} },
    ]},
    { id: 'e772', stage: 'career', eventType: 'choice', title: '离任经济审计', weight: 6, year: [50, 62], requireRankMin: 4, pools: ['public'], text: '组织安排离任经济责任审计。审计组翻阅你经手十年的账目，指着其中一笔问："这笔采购，为什么找了这家供应商？"你记得很清楚，但记得清不等于说得清。', choices: [
      { text: '如实解释决策过程，提供纪要', effects: {integrity: 3, mentalPressure: 2, risk: -3} },
      { text: '强调程序合规，细节记不清', effects: {risk: 2, mentalPressure: 3, integrity: -1} },
      { text: '找当年经办人核对细节', effects: {workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '忐忑不安，担心经手的旧账', effects: {mentalPressure: 5, risk: 1} },
    ]},
    { id: 'e773', stage: 'career', eventType: 'choice', title: '退休前的人情', weight: 6, year: [50, 62], requireRankMin: 3, pools: ['public'], text: '一位老朋友带着礼物登门，说想请你"最后帮一次忙"——办件棘手的事。他看出你要退休了，笑着说："反正你也没啥好顾虑的了。"', choices: [
      { text: '婉拒，说明纪律要求', effects: {integrity: 3, reputation: 1, risk: -2} },
      { text: '帮忙引路，不直接插手', effects: {eq: 1, background: 1, risk: 2} },
      { text: '碍于情面答应下来', effects: {risk: 4, heat: 3, integrity: -2} },
      { text: '收下礼物但不动用关系', effects: {risk: 2, integrity: -1, heat: 2} },
    ]},
    { id: 'e774', stage: 'career', eventType: 'choice', title: '中青班邀请', weight: 5, year: [45, 55], requireRankMin: 3, pools: ['public'], text: '组织上拟推荐你参加厅级后备干部培训班。这是再进一步的跳板，但也意味着更大的责任和压力。你在这个位置已经多年，动力和顾虑都在心里翻腾。', choices: [
      { text: '欣然接受，再拼一把', effects: {desire: 3, positionWeight: 2, mentalPressure: 3, body: -1} },
      { text: '谨慎接受，保持平常心', effects: {positionWeight: 1, eq: 1, mentalPressure: 1} },
      { text: '婉拒，想平稳过渡退休', effects: {positionWeight: -1, mentalPressure: -2, desire: -2} },
      { text: '接受但要求减少一线担子', effects: {positionWeight: 1, workAbility: -1, mentalPressure: -1} },
    ]},
    { id: 'e775', stage: 'career', eventType: 'choice', title: '旧账风波', weight: 6, year: [46, 60], requireRankMin: 3, pools: ['public'], text: '有人翻出一笔多年前你经手的老账，在网上发帖质疑"当年那笔补贴去向"。帖子里证据不完整，但节奏已经带起来了。', choices: [
      { text: '整理当年依据，公开回应', effects: {integrity: 3, reputation: 1, mentalPressure: 3, risk: -2} },
      { text: '请单位纪检协助核实', effects: {background: 1, workAbility: 1, mentalPressure: 2} },
      { text: '冷处理，等热度过去', effects: {risk: 2, reputation: -1, mentalPressure: 2} },
      { text: '托人联系发帖人私了', effects: {risk: 3, heat: 2, integrity: -2} },
    ]},
    { id: 'e776', stage: 'career', eventType: 'auto', title: '退居二线', weight: 5, year: [52, 62], requireRankMin: 4, pools: ['public'], text: '组织安排你退居二线，保留待遇，不再分管具体业务。交接那天，你坐在办公室里，看着窗外熟悉的大院，忽然明白：有些位置，坐着是责任，让出来也是。', effects: {mentalPressure: -3, positionWeight: -3, workAbility: -1, reputation: 1, integrity: 1} },

    // ================= v2.1.12 仕途场景扩充（enc91-enc98） =================
    { id: 'enc091', stage: 'career', eventType: 'choice', weight: 4, title: '接任讲话', year: [28, 55], requireRankMin: 2, text: '你被宣布接任新职务，要发表接任讲话。前任的讲话风格是"大而全"，你的稿子却写得短——你说"我就讲三件事，讲完就干活"。台下有人鼓掌，有人交换眼神。', choices: [
      { text: '坚持讲短话，务实开场', effects: {reputation: 2, workAbility: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '按惯例讲全面些', effects: {positionWeight: 1, eq: 1, mentalPressure: 1} },
      { text: '先听班子意见再定稿', effects: {eq: 2, workAbility: 1} },
      { text: '借讲话表个态立威', effects: {positionWeight: 2, eq: -1, risk: 1} },
    ]},
    { id: 'enc092', stage: 'career', eventType: 'choice', weight: 4, title: '老领导请托', year: [28, 60], requireRankMin: 3, text: '老领导退休后开了家咨询公司，打电话说想请你"参加个研讨会，挂个名就行"。你明白这名字的分量——以后他的生意好做，你的风险也大。', choices: [
      { text: '婉拒，说明组织纪律', effects: {integrity: 3, risk: -2, positionWeight: -1} },
      { text: '以个人身份参加学术活动', effects: {eq: 1, background: 1, risk: 1} },
      { text: '帮忙引荐业内专家', effects: {eq: 2, background: 1, risk: 1} },
      { text: '碍于情面答应挂名', effects: {risk: 4, heat: 3, integrity: -2} },
    ]},
    { id: 'enc093', stage: 'career', eventType: 'choice', weight: 4, title: '竞争上岗答辩', year: [26, 50], requireRankMin: 2, text: '单位竞争上岗，你报了名。答辩现场，评委问："如果你上任，第一把火怎么烧？"你想起上一任烧的第一把火，到现在还在处理善后。', choices: [
      { text: '谈改革，也谈风险预案', effects: {workAbility: 3, positionWeight: 2, eq: 1} },
      { text: '谈平稳，强调保持延续', effects: {positionWeight: 1, eq: 2, mentalPressure: -1} },
      { text: '谈自己的实绩和思路', effects: {workAbility: 2, reputation: 1, positionWeight: 1} },
      { text: '现场画饼，说得漂亮', effects: {positionWeight: 1, risk: 2, integrity: -1} },
    ]},
    { id: 'enc094', stage: 'career', eventType: 'auto', weight: 3, title: '班子合影', year: [28, 60], requireRankMin: 3, text: '新班子合影，你站在第二排。摄影师喊"看镜头"，你想起三年前自己还在最后一排。快门声里，你听到有人在议论前排谁会上调——你装作没听见。', effects: {positionWeight: 1, desire: 2, mentalPressure: 1} },
    { id: 'enc095', stage: 'career', eventType: 'choice', weight: 4, title: '下属的越级汇报', year: [28, 55], requireRankMin: 3, text: '你的下属越过你向大领导汇报工作，被你撞见了。他解释说"刚好碰到领导就问了一句"。你知道这不完全是真话，但追究还是装糊涂，是个问题。', choices: [
      { text: '私下提醒他注意层级', effects: {eq: 2, workAbility: 1, positionWeight: 1} },
      { text: '装不知道，敲打一下', effects: {eq: -1, positionWeight: 1, mentalPressure: 1} },
      { text: '当众批评，立规矩', effects: {positionWeight: 2, eq: -2, risk: 1} },
      { text: '反思自己是否沟通不足', effects: {eq: 2, integrity: 2, workAbility: 1} },
    ]},
    { id: 'enc096', stage: 'career', eventType: 'choice', weight: 3, title: '调研报告署名', year: [26, 55], requireRankMin: 2, text: '你主笔的调研报告被上级采纳，发文时署了领导的名字，你在"执笔人"一栏。同事替你鸣不平："你熬了三十个晚上。"你想起领导确实改了三遍、指了方向。', choices: [
      { text: '平常心，工作到位就行', effects: {integrity: 2, workAbility: 2, mentalPressure: -1} },
      { text: '向领导委婉表达署名期待', effects: {eq: 1, positionWeight: 1, risk: 1} },
      { text: '下次写报告前先谈好署名', effects: {workAbility: 1, eq: 1, risk: 1} },
      { text: '心里委屈，少干多歇', effects: {workAbility: -1, mentalPressure: 2, desire: -1} },
    ]},
    { id: 'enc097', stage: 'career', eventType: 'auto', weight: 3, title: '破格晋升公示', year: [30, 55], requireRankMin: 3, text: '你被列入破格晋升公示名单。公示期里，楼道里的目光多了几分意味。你照常上班、照常加班——公示结果出来那天，你才敢松一口气。', effects: {positionWeight: 3, reputation: 2, mentalPressure: 2} },
    { id: 'enc098', stage: 'career', eventType: 'choice', weight: 3, title: '单位合并', year: [28, 60], requireRankMin: 2, text: '两个单位要合并，你所在的科室要跟对面单位合并。对方科室负责人是老资格，听说合并后"一个岗位留一人"。走廊里人人自危，你的手机却安静得反常。', choices: [
      { text: '主动沟通，争取主动', effects: {eq: 2, workAbility: 2, positionWeight: 1} },
      { text: '拿出业绩说话', effects: {workAbility: 2, reputation: 1, mentalPressure: 1} },
      { text: '静观其变，不站队', effects: {mentalPressure: -1, positionWeight: -1} },
      { text: '找领导探口风', effects: {background: 1, risk: 1, mentalPressure: 1} },
    ]},
];
