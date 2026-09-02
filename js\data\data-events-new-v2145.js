// ===== v2.1.45 跨系统交叉主题包 =====
// id 范围：enw197~enc102（26条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：数字政务/营商环境/科技创新/应急处突/干部培训（含 work/career 混合 id）
// 数字政务 / 营商环境 / 科技创新 / 应急处突 / 干部培训，复用现有 pools 关键词做交叉加权。
const gd_events_new_v2145 = [
  // ---------- 数字政务（技术部门/数据部门交叉）----------
  { id: 'enw197', stage: 'work', eventType: 'choice', weight: 5, title: '一网通办堵点', pools: ['技术部门','数据部门'], text: '“一网通办”上线后，群众反映有两项高频事项总是卡在“数据不全”的提示上。技术人员查了半天，发现是两地数据接口字段对不上。', choices: [
    { text: '牵头组建攻坚小组，梳理数据字典', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
    { text: '先加提示文案，缓解群众困惑', effects: {peopleReputation: 1, workAbility: 1, mentalPressure: -1} },
    { text: '上报省级平台，请上级统筹', effects: {background: 2, mentalPressure: 1, positionWeight: 1} },
    { text: '直接对接兄弟单位技术团队', effects: {eq: 1, workAbility: 2, background: 1} },
  ]},
  { id: 'enw198', stage: 'work', eventType: 'choice', weight: 5, title: '电子证照信任危机', pools: ['数据部门','宣传'], text: '网上流传“电子证照容易被伪造”的说法，办事群众半信半疑，窗口工作人员也担心会不会担责。', choices: [
    { text: '举办公开演示，展示验伪流程', effects: {peopleReputation: 3, reputation: 2, workAbility: 2} },
    { text: '联合公安部门辟谣，保留法律追责', effects: {integrity: 2, workAbility: 2, risk: 1} },
    { text: '加强内部培训，统一答复口径', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
    { text: '冷处理，等谣言自然平息', effects: {risk: 2, reputation: -1, mentalPressure: -1} },
  ]},
  { id: 'enw199', stage: 'work', eventType: 'choice', weight: 4, title: '跨省通办数据共享', pools: ['数据部门','窗口部门'], text: '跨省通办业务试运行，外省推送的办件数据在本地系统中反复报错。两地运维互相认为问题出在对方。', choices: [
    { text: '拉三方问题排查会，当场对日志', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
    { text: '请省级技术团队远程协助定位', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
    { text: '先手工录入过渡，系统后修', effects: {workAbility: 1, mentalPressure: 1, risk: 1} },
    { text: '暂停该项业务，反馈上级协调', effects: {positionWeight: -1, mentalPressure: -1, peopleReputation: -1} },
  ]},
  { id: 'enw200', stage: 'work', eventType: 'choice', weight: 5, title: '政务数据共享争议', pools: ['数据部门','卫健'], text: '卫健部门希望共享医保数据用于慢性病管理，个别科室担心数据安全，把协调会开成了争论会。', choices: [
    { text: '牵头制定数据共享与保密办法', effects: {integrity: 3, workAbility: 3, background: 1, mentalPressure: 2} },
    { text: '先做最小范围试点，验证安全', effects: {workAbility: 2, risk: -1, mentalPressure: 1} },
    { text: '请上级业务主管部门拍板', effects: {background: 2, positionWeight: 1, mentalPressure: -1} },
    { text: '暂缓共享，各自先用纸质材料', effects: {workAbility: -1, mentalPressure: -1, risk: 1} },
  ]},
  { id: 'enw201', stage: 'work', eventType: 'choice', weight: 4, title: 'AI 政务试点', pools: ['技术部门','数据部门'], text: '上级鼓励探索人工智能辅助政务办公，你牵头评估引入智能问答机器人处理群众咨询。同事担忧失业，群众担心答错。', choices: [
    { text: '小范围试点高频问题，人机结合', effects: {workAbility: 3, iq: 2, mentalPressure: 2, reputation: 1} },
    { text: '先写调研报告，论证后再定', effects: {workAbility: 2, iq: 1, mentalPressure: 1} },
    { text: '高调宣传，抢试点名额', effects: {reputation: 2, positionWeight: 2, risk: 2} },
    { text: '谨慎观望，不主动申请', effects: {mentalPressure: -1, positionWeight: -1} },
  ]},

  // ---------- 营商环境（政府部门/垂管系统交叉）----------
  { id: 'enw202', stage: 'work', eventType: 'choice', weight: 5, title: '惠企政策兑现', pools: ['政府部门','垂管系统'], text: '一批惠企奖补政策文件已下发，但申报企业反馈流程繁琐、部门来回踢皮球，兑现率低引发企业不满。', choices: [
    { text: '推行“免申即享”，后台数据比对直接兑现', effects: {workAbility: 3, peopleReputation: 3, risk: 2, mentalPressure: 2} },
    { text: '开一次政策解读会，逐条答疑', effects: {peopleReputation: 2, workAbility: 1, eq: 1} },
    { text: '设立企业服务专员，一对一对接', effects: {peopleReputation: 3, workAbility: 2, mentalPressure: 2} },
    { text: '按部就班走流程，不催不改', effects: {peopleReputation: -2, mentalPressure: -1, risk: 1} },
  ]},
  { id: 'enw203', stage: 'work', eventType: 'choice', weight: 5, title: '企业走访摸困难', pools: ['政府部门'], text: '领导要求走访辖区重点企业摸清经营困难。有企业反映贷款难，有企业抱怨检查多，还有企业提出土地问题。', choices: [
    { text: '分级分类建立问题台账，限期办结', effects: {workAbility: 3, peopleReputation: 2, mentalPressure: 3} },
    { text: '当场能解决的就地解决', effects: {peopleReputation: 3, eq: 2, mentalPressure: 1} },
    { text: '先选重点企业走访，其他电话了解', effects: {workAbility: 1, peopleReputation: -1, mentalPressure: -1} },
    { text: '走访后形成报告，等领导批示', effects: {positionWeight: 1, workAbility: 2} },
  ]},
  { id: 'enw204', stage: 'work', eventType: 'choice', weight: 5, title: '招投标公平风波', pools: ['政府部门'], text: '一家落标企业实名举报，质疑采购项目存在围标串标嫌疑。纪检监察部门已经过问，你负责初步核查。', choices: [
    { text: '严格核验评标过程记录与资金流水', effects: {integrity: 3, workAbility: 3, risk: -2, mentalPressure: 3} },
    { text: '请第三方机构介入评估', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
    { text: '先安抚企业情绪，告知程序', effects: {eq: 1, mentalPressure: 1, risk: -1} },
    { text: '以“程序合规”为由不予受理', effects: {risk: 4, integrity: -3, reputation: -2} },
  ]},
  { id: 'enw205', stage: 'work', eventType: 'choice', weight: 4, title: '涉企收费清理', pools: ['垂管系统'], text: '上级部署清理规范涉企收费专项行动。有企业反映个别协会“被自愿”缴纳会费，还有收费项目名目不清。', choices: [
    { text: '全面排查收费依据，该取消的取消', effects: {integrity: 3, peopleReputation: 3, workAbility: 3, risk: 1} },
    { text: '先自查本系统，再延伸到协会', effects: {workAbility: 2, risk: -1, mentalPressure: 1} },
    { text: '公布监督举报电话，广开渠道', effects: {peopleReputation: 2, reputation: 1, mentalPressure: 1} },
    { text: '重点关注上级点名的项目，其余从宽', effects: {risk: 2, integrity: -2, mentalPressure: -1} },
  ]},

  // ---------- 乡村振兴（基层单位/民生部门交叉）----------
  { id: 'enw206', stage: 'work', eventType: 'choice', weight: 5, title: '村集体产业账目', pools: ['基层单位'], text: '村集体特色种植项目的账目公开后，有村民质疑“钱花了，效益没看见”。村会计拿出的账本记得很潦草。', choices: [
    { text: '组织第三方审计，结果张榜公布', effects: {integrity: 3, peopleReputation: 3, workAbility: 2, mentalPressure: 2} },
    { text: '协助会计理清账目，补齐凭证', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
    { text: '开村民大会，当面逐项解释', effects: {eq: 2, peopleReputation: 3, mentalPressure: 3} },
    { text: '强调“发展需要一个过程”，暂缓公布', effects: {peopleReputation: -2, risk: 2, integrity: -2} },
  ]},
  { id: 'enw207', stage: 'work', eventType: 'choice', weight: 5, title: '人居环境整治', pools: ['基层单位','执法部门'], text: '人居环境整治进入攻坚期，个别村巷道整治涉及村民私搭乱建，村干部说“得罪人的事不好办”。', choices: [
    { text: '干部带头拆自家的，带动村民', effects: {integrity: 3, peopleReputation: 3, workAbility: 2, mentalPressure: 3} },
    { text: '先易后难，先整治公共区域', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
    { text: '按政策依法拆除，不留情面', effects: {workAbility: 2, risk: 2, peopleReputation: -1} },
    { text: '划拨补贴资金，鼓励自行拆除', effects: {peopleReputation: 2, background: 1, mentalPressure: 1} },
  ]},
  { id: 'enw208', stage: 'work', eventType: 'choice', weight: 4, title: '返贫监测预警', pools: ['基层单位'], text: '系统提示村里两户人家可能返贫（重病、突发意外），网格员已经上门核实。你负责跟进帮扶衔接。', choices: [
    { text: '第一时间启动帮扶政策，快速衔接', effects: {peopleReputation: 3, workAbility: 2, integrity: 2, mentalPressure: 2} },
    { text: '核实情况后纳入监测，定期回访', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
    { text: '联系社会力量结对帮扶', effects: {background: 2, peopleReputation: 2, mentalPressure: 1} },
    { text: '等系统自动推送汇总再统一处理', effects: {mentalPressure: -1, risk: 2, peopleReputation: -2} },
  ]},
  { id: 'enw209', stage: 'work', eventType: 'choice', weight: 5, title: '农村电商出圈', pools: ['基层单位','宣传'], text: '村里的特色农产品直播火了，订单暴涨。但物流跟不上、品控不稳，差评开始出现，主播又提出涨薪。', choices: [
    { text: '整合冷链物流资源，严抓品控', effects: {workAbility: 3, peopleReputation: 3, mentalPressure: 3, background: 1} },
    { text: '保持节奏运营，先稳口碑', effects: {workAbility: 2, peopleReputation: 2, mentalPressure: 1} },
    { text: '趁热度扩大投入，抢占市场', effects: {reputation: 2, background: 1, risk: 3, mentalPressure: 3} },
    { text: '联系大型电商平台谈合作', effects: {background: 2, peopleReputation: 2, mentalPressure: 2} },
  ]},
  { id: 'enw210', stage: 'work', eventType: 'choice', weight: 4, title: '宅基地改革试点', pools: ['基层单位','自然资源'], text: '宅基地制度改革试点在乡镇推进，村民对“有偿退出”有各种疑虑，又有传言说“以后宅基地要收回”。', choices: [
    { text: '组织政策宣讲会，现场答疑', effects: {peopleReputation: 3, workAbility: 2, eq: 1, mentalPressure: 2} },
    { text: '先小范围试点，摸清意愿再铺开', effects: {workAbility: 2, risk: -1, mentalPressure: 1} },
    { text: '印发明白纸，逐户送达', effects: {workAbility: 2, peopleReputation: 2, mentalPressure: 1} },
    { text: '压住传言，稳住局面再说', effects: {risk: 2, peopleReputation: -1, integrity: -1} },
  ]},

  // ---------- 应急处突（应急/卫健/执法交叉）----------
  { id: 'enw211', stage: 'work', eventType: 'choice', weight: 5, title: '防汛值守夜', pools: ['应急'], text: '主汛期暴雨预警升级，你带队在一线值守。临近午夜，下游一处低洼村庄需要紧急转移，村干部电话多数占线。', choices: [
    { text: '果断启动转移预案，联系各方力量支援', effects: {reputation: 3, workAbility: 3, risk: -3, mentalPressure: 4} },
    { text: '先确认下游实况再行动', effects: {workAbility: 1, risk: 2, mentalPressure: 2} },
    { text: '向上级报备后等指示', effects: {risk: 3, positionWeight: -1, mentalPressure: 1} },
    { text: '通知村干部挨户敲门，你留在值守点', effects: {reputation: 1, risk: 2, mentalPressure: 2} },
  ]},
  { id: 'enw212', stage: 'work', eventType: 'choice', weight: 4, title: '安全生产夜查', pools: ['应急','执法部门'], text: '你带队突击夜查辖区企业安全生产。一家仓储企业灭火器过期、安全出口被货物堵塞，老板求情“明天就整改”。', choices: [
    { text: '依法责令停业整改，整改合格再复工', effects: {integrity: 3, workAbility: 2, reputation: 2, risk: -2} },
    { text: '当场教育后限期三天整改', effects: {workAbility: 1, eq: 1, risk: 1} },
    { text: '先口头警告，记入台账', effects: {risk: 2, integrity: -1} },
    { text: '收取“保证金”承诺整改', effects: {risk: 5, integrity: -4} },
  ]},
  { id: 'enw213', stage: 'work', eventType: 'choice', weight: 5, title: '食安突发舆情', pools: ['卫健','宣传'], text: '本地一家餐厅被曝光后厨卫生问题，视频片段被大量转发，恐慌情绪开始蔓延，餐厅老板喊冤称“断章取义”。', choices: [
    { text: '立即启动食品安全应急响应，现场彻查', effects: {reputation: 3, workAbility: 3, peopleReputation: 2, risk: -2} },
    { text: '先发初步通报，公布调查进展', effects: {peopleReputation: 2, reputation: 1, mentalPressure: 2} },
    { text: '约谈平台和餐厅，下调热度', effects: {risk: 2, background: 1, reputation: -1} },
    { text: '等检测结果出来再回应', effects: {risk: 3, reputation: -2, mentalPressure: 1} },
  ]},
  { id: 'enw214', stage: 'work', eventType: 'choice', weight: 5, title: '群体性事件处置', pools: ['执法部门','政法系统'], text: '一个楼盘因延期交付，业主集体到售楼处聚集讨说法，情绪激动，现场有人拍摄视频直播。', choices: [
    { text: '安排力量现场稳控，同步核实合理诉求', effects: {workAbility: 3, eq: 2, reputation: 2, risk: -1} },
    { text: '组织开发商与业主面对面协商', effects: {eq: 2, workAbility: 2, mentalPressure: 2} },
    { text: '依法提醒聚集风险，必要时分离人群', effects: {workAbility: 2, risk: 1, peopleReputation: -1} },
    { text: '简单答复“已关注”，请业主先离开', effects: {risk: 3, reputation: -2, peopleReputation: -2} },
  ]},

  // ---------- 科技创新（技术部门/政府部门交叉）----------
  { id: 'enw215', stage: 'work', eventType: 'choice', weight: 4, title: '成果转化难题', pools: ['技术部门','政府部门'], text: '本地高校一项科研成果在实验室很漂亮，但转化企业普遍反映“中试环节缺钱缺场地”。市里请你牵头研究支持政策。', choices: [
    { text: '设立中试补贴，建设共享中试平台', effects: {workAbility: 3, iq: 2, reputation: 2, background: 1} },
    { text: '举办路演对接会，撮合校企合作', effects: {background: 2, workAbility: 2, peopleReputation: 1} },
    { text: '争取上级专项资金支持', effects: {background: 2, positionWeight: 1, mentalPressure: 1} },
    { text: '先写调研报告，等有成熟方案再推进', effects: {workAbility: 1, mentalPressure: -1} },
  ]},
  { id: 'enw216', stage: 'work', eventType: 'choice', weight: 5, title: '高企培育认定', pools: ['政府部门'], text: '高新技术企业认定申报在即，辖区几家成长型企业材料准备不明白，代理机构又报价虚高，企业进退两难。', choices: [
    { text: '开设申报辅导专班，免费指导', effects: {peopleReputation: 3, workAbility: 2, eq: 1, mentalPressure: 2} },
    { text: '邀请专家集中审定，提前查漏', effects: {workAbility: 2, background: 2, mentalPressure: 1} },
    { text: '规范代理市场，公布服务价格区间', effects: {integrity: 2, workAbility: 2, risk: 1} },
    { text: '按年度计划推进，不额外加急', effects: {mentalPressure: -1, peopleReputation: -1} },
  ]},
  { id: 'enw217', stage: 'work', eventType: 'choice', weight: 4, title: '研发经费监管', pools: ['技术部门','垂管系统'], text: '审计发现几家企业研发费用加计扣除申报数据异常，涉嫌虚列。企业财务称“口径理解不同”。', choices: [
    { text: '逐户核对凭证，该补税补税', effects: {integrity: 3, workAbility: 3, risk: -1, mentalPressure: 3} },
    { text: '先约谈企业，讲清认定口径', effects: {workAbility: 2, eq: 1, risk: 1} },
    { text: '申请国家税务总局业务指导', effects: {background: 2, workAbility: 1, mentalPressure: 1} },
    { text: '抽查两家立标杆，其余从宽', effects: {risk: 2, integrity: -2, mentalPressure: -1} },
  ]},
  { id: 'enw218', stage: 'work', eventType: 'choice', weight: 5, title: '产学研对接会', pools: ['技术部门','政府部门'], text: '市里办产学研对接会，高校期望“横向课题”，企业期望“解决具体技术难题”，双方现场口热话冷。', choices: [
    { text: '会前摸底需求，精准配对', effects: {workAbility: 3, eq: 2, mentalPressure: 2} },
    { text: '设置技术难题揭榜环节', effects: {workAbility: 3, iq: 2, reputation: 1} },
    { text: '邀请技术专家现场坐诊答疑', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
    { text: '按流程开完，重在形式', effects: {workAbility: -1, mentalPressure: -1, reputation: -1} },
  ]},

  // ---------- 干部培训（career，中青班/研修/异地挂职/培训转化）----------
  { id: 'enc099', stage: 'career', eventType: 'choice', weight: 4, title: '专题研修班名额', year: [30, 50], pools: ['public'], text: '上级分配一个重要专题研修班名额，组织上让你争取。同期有几位同事也在争取，党校老师暗示“名额很紧”。', choices: [
    { text: '向组织正式递交申请并备好材料', effects: {desire: 2, positionWeight: 2, mentalPressure: 2, reputation: 1} },
    { text: '请分管领导帮忙推荐', effects: {background: 2, positionWeight: 1, risk: 1} },
    { text: '先观望，等通知再准备', effects: {mentalPressure: -1, positionWeight: -1} },
    { text: '主动退出，把机会让给同事', effects: {eq: 2, reputation: 1, mentalPressure: -1} },
  ]},
  { id: 'enc100', stage: 'career', eventType: 'choice', weight: 4, title: '异地挂职申请', year: [28, 45], pools: ['public'], text: '组织动员干部到对口支援地区挂职锻炼，条件艰苦但锻炼价值大。家里刚上小学的孩子让你犹豫。', choices: [
    { text: '主动报名，把挂职当历练', effects: {workAbility: 3, reputation: 2, body: -1, mentalPressure: 3, positionWeight: 2} },
    { text: '申请短期的挂职项目', effects: {workAbility: 1, mentalPressure: 1, positionWeight: -1} },
    { text: '以家庭困难为由婉拒', effects: {eq: -1, reputation: -1, mentalPressure: -2} },
    { text: '先和家人商量，两边兼顾', effects: {eq: 1, familyPressure: -1, mentalPressure: 1} },
  ]},
  { id: 'enc101', stage: 'career', eventType: 'choice', weight: 4, title: '培训成果转化', year: [30, 55], pools: ['public'], text: '外出培训学到的先进经验，回来后你写了一份转化建议。领导批示“很好，请结合实际抓好落实”，然后没了下文。', choices: [
    { text: '主动牵头试点，把建议变成方案', effects: {workAbility: 3, iq: 2, positionWeight: 2, mentalPressure: 3} },
    { text: '在分管领域小范围推广', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 1} },
    { text: '把建议写好存档，等领导再提', effects: {mentalPressure: -2, workAbility: 1} },
    { text: '借汇报机会再次向领导陈述价值', effects: {eq: 2, background: 1, mentalPressure: 1} },
  ]},
  { id: 'enc102', stage: 'career', eventType: 'choice', weight: 3, title: '国资培训结业答卷', year: [32, 58], pools: ['public'], text: '为期数月的骨干培训临近结业，结业考核要求结合岗位写一篇调研报告。很多人套模板，你犹豫要不要写点真东西。', choices: [
    { text: '调研真实问题，写得“可能得罪人”', effects: {integrity: 3, workAbility: 3, risk: 2, reputation: 2} },
    { text: '写一个稳妥的改进建议', effects: {workAbility: 2, mentalPressure: 1, positionWeight: 1} },
    { text: '参考优秀范文，加工润色', effects: {workAbility: 1, mentalPressure: -1, risk: 1} },
    { text: '结合自身岗位经验深挖细节', effects: {workAbility: 3, iq: 1, reputation: 2, mentalPressure: 2} },
  ]},
];