// ==================== v2.1.63 政策项目制内容：子案结构 + 门槛 + 扩充 ====================
// 每个政策项目 = 一组"子案"（subCases）+ 若干决策点（stages，每个标注所属子案）。
// 承接门槛：requireRankMin（职级）、requireUnitLevelMin（单位层级 0乡镇/1县级/2市级/3省级/4中央）、
// requireYearsWorked（工作年限）——不满足则面板锁定并显示缺项，避免"随意触发"。
// 完成输出 policy_<id>_done flag（结局分支判定沿用）；决策点可触发 policyOpinionSuppressed flag。
// 术语（v2.1.69）：字段 stages = 决策点序列（每项一个决策点），与 event.stage（事件阶段 work/life/career）无关。
const gd_projects = [
  // ============ 数字政务升级（信息化条线主战场） ============
  {
    id: 'digital_governance', icon: '🖥️', name: '数字政务升级', duration: 7,
    summary: '政务平台一体化改造：从数据孤岛到一网通办，写进政绩也写进审计。',
    desc: '牵头把分散的政务系统整合为一网通办平台。平台上线、数据打通、权限治理三层子案，舆情风险高。',
    requireRankMin: 4, requireUnitLevelMin: 1, requireYearsWorked: 2,
    subCases: [
      { id: 'sc1', name: '子案一 · 需求与建模' },
      { id: 'sc2', name: '子案二 · 平台上线' },
      { id: 'sc3', name: '子案三 · 数据治理与验收' }
    ],
    stages: [
      { subCase: 'sc1', title: '梳理各委办局数据孤岛', text: '三十多个系统互不相通，各局嘴上支持、手上拖着。先从最痛点开始建模，还是先拉通最容易出政绩的板块？', choices: [
        { text: '从群众办事最痛的事项入手建模型', effects: { workAbility: 2, peopleReputation: 2, mentalPressure: 2 }, result: '优先打通群众高频事项，模型落地有样板' },
        { text: '先做领导关注的重点领域示范', effects: { background: 1, reputation: 2, peopleReputation: -1 }, result: '示范先行，进度快但民间感知弱' },
        { text: '各家系统负责人集中办公攻坚', effects: { workAbility: 1, mentalPressure: 3, heat: 1 }, result: '集中攻坚推进快，人也快被拖垮' },
        { text: '请第三方出具整体方案背书', effects: { iq: 1, wealth: -1, background: 1 }, result: '方案专业，但预算先花出去一块' }
      ] },
      { subCase: 'sc1', title: '数据开放边界之争', text: '要不要把部门数据开放给同级单位共享？考核数据、财务数据都牵扯利益，阻力集中到了你这里。', choices: [
        { text: '按清单分级开放，先共享非敏感数据', effects: { workAbility: 2, peopleReputation: 1, risk: 1 }, result: '分级共享落地，兄弟单位开始认账' },
        { text: '全量推倒围墙，一步到位', effects: { iq: 1, risk: 3, heat: 2 }, result: '推进激进，审计风险同步上升' },
        { text: '拉上数据局联合发文推动', effects: { background: 1, workAbility: 1, mentalPressure: 1 }, result: '联合推动名正言顺' },
        { text: '谁出数据谁担责，先谈责任再谈共享', effects: { eq: 2, mentalPressure: -1, peopleReputation: -1 }, result: '责任谈清楚了，进度也慢下来了' }
      ] },
      { subCase: 'sc2', title: '平台上线前夜的系统崩溃', text: '新平台开测当晚，核心库读写冲突，供应商说"正常现象"。明早要向领导演示，窗口只剩一夜。', choices: [
        { text: '现场督战，逼供应商通宵修复', effects: { workAbility: 2, mentalPressure: 3, body: -2 }, result: '天亮前修好，演示顺利' },
        { text: '临时降级方案，先保住演示主链路', effects: { eq: 1, workAbility: 1, risk: 1 }, result: '演示保住了，尾巴留到上线后' },
        { text: '推迟演示，把问题列表摊开讲', effects: { integrity: 2, background: -1 }, result: '推迟把丑话讲在前面，领导不太高兴' },
        { text: '更换供应商分系统，快刀斩乱麻', effects: { background: 1, wealth: -2, heat: 1 }, result: '换血代价高，但后方清净了' }
      ] },
      { subCase: 'sc2', title: '试运行期群众的差评', text: '平台试运行上线，功能全了，家长的号却挂不上——排队系统把老人卡在外头。舆情开始发酵。', choices: [
        { text: '连夜开放线下兜底窗口', effects: { peopleReputation: 3, workAbility: 1, mentalPressure: 2 }, result: '兜底窗口救回口碑' },
        { text: '上线适老版与预约叫号优化', effects: { workAbility: 2, iq: 1, heat: -1 }, result: '体验优化到位，投诉明显回落' },
        { text: '发公告解释技术原因请求谅解', effects: { eq: 1, peopleReputation: -1 }, result: '公告发了，网络不买账' },
        { text: '暂停试运行，回炉重测', effects: { background: -1, reputation: -1, mentalPressure: -1 }, result: '回炉稳妥但打脸' }
      ] },
      { subCase: 'sc2', title: '供应商想续签五年长约', text: '平台刚稳，供应商提出五年长约加价三成，暗示"换人维护会出事故"。续还是不续，汇报材料等你签字。', choices: [
        { text: '公开竞标，把主动权拿回来', effects: { integrity: 2, workAbility: 1, wealth: 1, mentalPressure: 2 }, result: '竞标压价成功，风评亦佳' },
        { text: '续约一年观察期，附考核条款', effects: { eq: 1, risk: 1, background: 1 }, result: '折中续约，留了后手' },
        { text: '培养自己人接手关键维护', effects: { workAbility: 2, mentalPressure: 2 }, result: '自研维护能力起步' },
        { text: '同意长约换供应商深度绑定', effects: { background: 1, heat: 2, risk: 2 }, result: '供应商满意，采购程序存疑' }
      ] },
      { subCase: 'sc3', title: '数据权属与隐私审计', text: '审计组进驻检查数据合规：沉淀的用户数据、第三方调取记录的留存都成了问题。', choices: [
        { text: '自查整改，主动向审计交底', effects: { integrity: 2, risk: -2, mentalPressure: 2 }, result: '交底换回整改期，风险可控' },
        { text: '按最小必要原则重建权限清单', effects: { workAbility: 2, integrity: 1, iq: 1 }, result: '权限清单重建，审计点头' },
        { text: '先补材料应付检查', effects: { background: 1, risk: 2, integrity: -1 }, result: '材料齐了，口实也留了' },
        { text: '请审计组讲清要求再逐项落实', effects: { eq: 2, background: 1 }, result: '边学边改，关系也处好了' }
      ] },
      { subCase: 'sc3', title: '一网通办按期开通的收尾', text: '平台总验收在即，还剩三个事项没接进来。是带着亮点申报，还是等全量齐了再验收？', choices: [
        { text: '核心事项按期上线，边运行边补', effects: { workAbility: 1, reputation: 2, risk: 1 }, result: '按期亮项，尾巴列入二期' },
        { text: '全量接入后再验收，不留话柄', effects: { integrity: 1, background: 1, mentalPressure: 2 }, result: '慢一点，稳一点' },
        { text: '请分管领导出面协调剩余单位', effects: { background: 2, eq: 1 }, result: '大领导出面，剩余事项快速接入' },
        { text: '压指标式倒排工期强推', effects: { heat: 1, risk: 2, workAbility: 1 }, result: '进度难看但推完了' }
      ] }
    ],
    completionEffects: { workAbility: 4, reputation: 4, peopleReputation: 3, positionWeight: 2, flag: 'policy_digital_governance_done' }
  },

  // ============ 乡村振兴示范（基层主战场） ============
  {
    id: 'rural_revitalization', icon: '🌾', name: '乡村振兴示范', duration: 7,
    summary: '整村示范点打造：产业、基建、治理三步走，政绩在田埂上，困难也在田埂上。',
    desc: '在挂钩村打造乡村振兴示范点。产业引进、基础设施、乡村治理三个子案，与群众口碑直接挂钩。',
    requireRankMin: 3, requireUnitLevelMin: 0, requireYearsWorked: 1,
    subCases: [
      { id: 'sc1', name: '子案一 · 产业引进' },
      { id: 'sc2', name: '子案二 · 基础设施' },
      { id: 'sc3', name: '子案三 · 乡村治理' }
    ],
    stages: [
      { subCase: 'sc1', title: '引进加工厂还是守住耕地', text: '有企业想在村里建农产品加工厂，占的是基本农田边角地。村长支持，年轻人也盼着家门口就业。', choices: [
        { text: '严格按政策，引导企业用闲置建设用地', effects: { integrity: 2, workAbility: 2, mentalPressure: 2 }, result: '走了合规流程，地不会错' },
        { text: '特事特办先落地，边建边补手续', effects: { background: 1, risk: 3, heat: 1 }, result: '工厂落地快，手续补得心跳' },
        { text: '改引进订单农业，不占一寸地', effects: { iq: 1, peopleReputation: 2 }, result: '不碰耕地，村民收入也涨了' },
        { text: '把选择权交给村民大会表决', effects: { eq: 2, mentalPressure: -1, workAbility: 1 }, result: '村民表决一致同意，责任风险共担' }
      ] },
      { subCase: 'sc1', title: '大户想拿补贴搞大棚', text: '种粮大户提出"大棚补贴政策"申请，但大棚项目连片占地，有的群众怀疑他套补贴。', choices: [
        { text: '实地核查经营状况后如实申报', effects: { integrity: 1, workAbility: 2, peopleReputation: 1 }, result: '核实到位，申请有据' },
        { text: '按政策条件机械放行', effects: { background: 1, risk: 2, integrity: -1 }, result: '程序走了，水花没有' },
        { text: '联合农技站评估项目可行性', effects: { iq: 1, workAbility: 1 }, result: '评估结论扎实，群众信服' },
        { text: '先压一压，等舆论过去再说', effects: { eq: 1, peopleReputation: -1, workAbility: -1 }, result: '拖着不办，两边都不满意' }
      ] },
      { subCase: 'sc2', title: '入户路硬化资金缺口', text: '示范村还有两公里入户路没硬化，上级资金只够一半，缺口要自己想办法。', choices: [
        { text: '组织村民投工投劳，材料走项目资金', effects: { workAbility: 2, peopleReputation: 3, mentalPressure: 2 }, result: '路修好了，干群关系也修好了' },
        { text: '向上再跑一次，争取追加资金', effects: { background: 2, wealth: 1 }, result: '软磨硬泡要来追加指标' },
        { text: '先修主干道，入户路列入下期', effects: { eq: 1, peopleReputation: -1 }, result: '主路光鲜，入户路村民有意见' },
        { text: '引入乡贤捐资共建', effects: { eq: 2, peopleReputation: 1, wealth: 1 }, result: '乡贤出资，路通了情也通了' }
      ] },
      { subCase: 'sc2', title: '示范村改造中的违建矛盾', text: '环境整治要先拆一批私搭乱建，其中一户是村支书的亲戚。拆，还是绕？', choices: [
        { text: '一视同仁先拆亲戚家，立住规矩', effects: { integrity: 3, peopleReputation: 2, mentalPressure: 2 }, result: '规矩立住了，拆迁势如破竹' },
        { text: '动员支书自己先拆，给全村做示范', effects: { eq: 2, background: 1 }, result: '支书带头，阻力小了一半' },
        { text: '保留几家过渡，争取时间化解', effects: { eq: 1, risk: 1, workAbility: -1 }, result: '暂时缓和，风言风语不断' },
        { text: '补偿标准先行谈妥再动手', effects: { wealth: -1, peopleReputation: 1, workAbility: 1 }, result: '补偿谈得细，拆得安稳' }
      ] },
      { subCase: 'sc2', title: '村集体账目被起底', text: '有村民举报村里的账目不清，涉示范项目资金。纪检组下周要来了解情况。', choices: [
        { text: '主动公开账目，配合纪检核查', effects: { integrity: 2, risk: -2, peopleReputation: 2 }, result: '账清人正，核查平安落地' },
        { text: '先自查一遍再交材料', effects: { workAbility: 1, integrity: 1, mentalPressure: 1 }, result: '自查发现问题及时纠正' },
        { text: '托人打招呼淡化处理', effects: { background: 1, risk: 3, integrity: -2 }, result: '招呼打了，风声更紧' },
        { text: '请第三方审计出具意见', effects: { iq: 1, wealth: -1 }, result: '第三方审计背书，村民安心' }
      ] },
      { subCase: 'sc3', title: '红白理事会推广遇冷', text: '示范村要推婚丧简办新规，德高望重的老支书先泼了冷水："管天管地还管人家办酒？"', choices: [
        { text: '先说服老支书，让规矩从族老开始', effects: { eq: 2, peopleReputation: 2, mentalPressure: 1 }, result: '族老点头，新规落地有声' },
        { text: '定村规民约，村民大会投票通过', effects: { workAbility: 1, integrity: 1, peopleReputation: 1 }, result: '程序正义，执行有据' },
        { text: '用红白事登记制逐步引导', effects: { eq: 1, workAbility: 1 }, result: '柔性引导，见效慢但稳' },
        { text: '先搁置，重点保产业项目验收', effects: { background: 1, peopleReputation: -1 }, result: '避开了阻力，也丢了口碑' }
      ] },
      { subCase: 'sc3', title: '示范村验收前的迎检准备', text: '省里月底来验收示范村，资料台账、现场环境、群众访谈三线并行，时间只剩两周。', choices: [
        { text: '台账现场访谈三线真准备，不糊弄', effects: { integrity: 2, workAbility: 2, mentalPressure: 3 }, result: '真材实料，验收组印象分拉满' },
        { text: '重点打磨现场路线与讲解词', effects: { reputation: 2, peopleReputation: -1 }, result: '现场亮眼，访谈环节露怯' },
        { text: '组织群众培训统一口径', effects: { eq: 1, integrity: -1, risk: 1 }, result: '口径统一，有人背后嘀咕' },
        { text: '请已验收村支招走捷径', effects: { background: 1, workAbility: 1 }, result: '前辈经验省了不少弯路' }
      ] }
    ],
    completionEffects: { peopleReputation: 5, workAbility: 3, reputation: 3, background: 2, flag: 'policy_rural_revitalization_done' }
  },

  // ============ 老旧小区改造（民生条线） ============
  {
    id: 'old_community', icon: '🏘️', name: '老旧小区改造', duration: 6,
    summary: '管网、电梯、停车位：老小区的账本里全是人和钱。',
    desc: '牵头老旧片区综合改造。民意征集、施工协调、后续管理三个子案，居民诉求就是舆情风向。',
    requireRankMin: 3, requireUnitLevelMin: 1, requireYearsWorked: 1,
    subCases: [
      { id: 'sc1', name: '子案一 · 民意与设计' },
      { id: 'sc2', name: '子案二 · 施工协调' },
      { id: 'sc3', name: '子案三 · 交付与长效' }
    ],
    stages: [
      { subCase: 'sc1', title: '电梯加装的一楼反对声', text: '改造方案公示，加装电梯引来一楼住户强烈反对：采光、噪音、房价。签字率卡在三分之二。', choices: [
        { text: '一对一上门谈判，用补偿方案破局', effects: { eq: 2, workAbility: 2, mentalPressure: 2 }, result: '补偿谈拢，签字过半' },
        { text: '调整方案避开一楼敏感区', effects: { iq: 1, peopleReputation: 1 }, result: '方案调整，损失部分采光诉求' },
        { text: '按多数意见硬推', effects: { background: 1, peopleReputation: -2, heat: 1 }, result: '推进了，一楼彻底寒心' },
        { text: '暂缓加装，先干地下管网', effects: { eq: 1, workAbility: -1 }, result: '绕开矛盾，管网先行' }
      ] },
      { subCase: 'sc1', title: '停车位改造撞上绿化红线', text: '居民要求扩建停车位，但方案要砍一片绿地，绿化部门不肯松口。', choices: [
        { text: '做立体停车位，保绿化不占一寸', effects: { iq: 1, workAbility: 2, wealth: -1 }, result: '立体车位加预算，绿化保住了' },
        { text: '绿化部门联合踏勘找平衡方案', effects: { eq: 2, background: 1 }, result: '踏勘出方案，两边都让一步' },
        { text: '缩进绿地边角挤出车位', effects: { background: 1, peopleReputation: -1 }, result: '车位多了，绿地小了，眼不见为净' },
        { text: '引入共享停车试点缓压力', effects: { workAbility: 1, eq: 1 }, result: '错峰共享，先解燃眉' }
      ] },
      { subCase: 'sc2', title: '施工队和住户的噪音战', text: '改造开工半月，施工噪音与粉尘引发住户打市长热线；施工队扬言"干不完就撤"。', choices: [
        { text: '约谈施工方立噪音规章，就高不就低', effects: { integrity: 1, workAbility: 1, mentalPressure: 2 }, result: '规矩立住，热线回落' },
        { text: '调整工序，噪音大的时段避开午休', effects: { eq: 2, peopleReputation: 1 }, result: '人性化工序，骂声少了' },
        { text: '给住户发耳塞与空气净化补贴', effects: { wealth: -1, peopleReputation: 1 }, result: '物质安抚，短期有效' },
        { text: '压着施工方赶进度早日完工', effects: { background: 1, risk: 2, body: -1 }, result: '进度优先，质量隐患埋下' }
      ] },
      { subCase: 'sc2', title: '隐蔽工程签证额暴涨', text: '地下管网开挖发现实际管线比图纸复杂，施工方报来一笔超预算签证，卡在你能不能批。', choices: [
        { text: '邀请监理与造价站联合核量后再定', effects: { integrity: 2, workAbility: 1, mentalPressure: 1 }, result: '核量把虚报部分剔掉了' },
        { text: '按实际工程量批，先保工期', effects: { wealth: -2, risk: 1 }, result: '工期保了，预算超了' },
        { text: '要求施工方分担一部分风险', effects: { background: 1, workAbility: 1 }, result: '共担机制谈成，双方捏鼻子认' },
        { text: '拖着不批，让施工方垫资', effects: { eq: -1, peopleReputation: -1, risk: 1 }, result: '垫资拖着，关系僵了' }
      ] },
      { subCase: 'sc2', title: '用电改造碰上了变压器选址', text: '电力扩容需要新增一台变压器，选址在谁家门口谁反对，居委会也挠头。', choices: [
        { text: '多方听证定址，公示补偿方案', effects: { eq: 2, integrity: 1, mentalPressure: 2 }, result: '听证定址，反对声平息' },
        { text: '选人流量小的角落定址', effects: { background: 1, body: 1 }, result: '角落定址，少烦扰多方便' },
        { text: '暂缓扩容，先保障基本照明', effects: { workAbility: -1, peopleReputation: -1 }, result: '缓扩容，空调季前要用时会后悔' },
        { text: '请电力部门统筹片区方案', effects: { background: 1, iq: 1 }, result: '片区统筹，变压器选址更合理' }
      ] },
      { subCase: 'sc3', title: '改造后的物业费怎么收', text: '改造焕然一新，但长效维护要靠物业费。居民习惯了免费就医的物业，收费方案引发新一轮争吵。', choices: [
        { text: '按质定价公开账本，先试点一年', effects: { integrity: 2, peopleReputation: 1, mentalPressure: 1 }, result: '试点一年，缴费率七成' },
        { text: '低标准起步，政府补贴过渡', effects: { wealth: -1, peopleReputation: 1 }, result: '过渡期平稳，财政背一点' },
        { text: '引入红色物业兜底服务', effects: { background: 1, workAbility: 1 }, result: '红色物业接手，钉子户也服软' },
        { text: '并入周边成熟小区统一管理', effects: { eq: 1, workAbility: 1 }, result: '规模化降本，争议最小化' }
      ] }
    ],
    completionEffects: { peopleReputation: 4, reputation: 3, workAbility: 2, integrity: 1, flag: 'policy_old_community_done' }
  },

  // ============ 营商环境优化（经济条线，门槛最高） ============
  {
    id: 'business_environment', icon: '🏦', name: '营商环境优化', duration: 7,
    summary: '审批提速、政策直达、涉企服务：把企业的脚程换成数据流。',
    desc: '牵头营商环境专班。流程再造、涉企服务、政商关系三个子案，动的是审批权力的奶酪。',
    requireRankMin: 5, requireUnitLevelMin: 2, requireYearsWorked: 4,
    subCases: [
      { id: 'sc1', name: '子案一 · 流程再造' },
      { id: 'sc2', name: '子案二 · 涉企服务' },
      { id: 'sc3', name: '子案三 · 政商关系' }
    ],
    stages: [
      { subCase: 'sc1', title: '施工许可的"串联改并联"', text: '企业办施工许可要跑规划、住建、消防、城管四家串联审批，平均 42 天。改成并联就要动人家的签字权。', choices: [
        { text: '牵头四家并联审批改革方案', effects: { workAbility: 2, heat: 2, background: -1 }, result: '并联方案出台，审批压到 15 天' },
        { text: '先拿两个项目试点跑全流程', effects: { iq: 1, workAbility: 1, mentalPressure: 1 }, result: '试点跑通，数据说话' },
        { text: '请市政务办协调市领导站台', effects: { background: 2, workAbility: 1 }, result: '领导站台，阻力骤减' },
        { text: '引入告知承诺制，后置审查', effects: { risk: 2, workAbility: 2, heat: 1 }, result: '承诺制提速，倒查风险升高' }
      ] },
      { subCase: 'sc1', title: '一网通办的企业端卡壳', text: '线上申报系统对企业端难用，CA 证书、系统兼容、附件太大都是坑，专项小组却解散了。', choices: [
        { text: '自查企业端全流程体验并整改', effects: { workAbility: 2, peopleReputation: 1, mentalPressure: 1 }, result: '自查整改，企业端好评回升' },
        { text: '组建官企联合测试小组', effects: { eq: 1, iq: 1, workAbility: 1 }, result: '企业提意见，系统真改' },
        { text: '保留线下窗口兜底', effects: { peopleReputation: 2, background: 1 }, result: '线上攻坚线下兜底' },
        { text: '发文要求企业限期适应', effects: { eq: -1, peopleReputation: -1, workAbility: 1 }, result: '发文容易，企业骂街' }
      ] },
      { subCase: 'sc1', title: '窗口背后的审批权力清单', text: '审批提速触到窗口人员的隐性权力：加急费、关系件。实名举报信摆到你桌上，还提到你的副手。', choices: [
        { text: '交纪检部门，全面核查窗口', effects: { integrity: 3, heat: -1, mentalPressure: 3 }, result: '纪检进驻，窗口风气大改' },
        { text: '先谈话提醒内部消化', effects: { eq: 1, background: 1, risk: 2 }, result: '内部消化，举报人不满' },
        { text: '借机制改革把自由裁量权压缩', effects: { workAbility: 2, risk: -1, integrity: 1 }, result: '权力清单瘦身，寻租空间没了' },
        { text: '安抚举报人，承诺限期整改', effects: { eq: 1, integrity: -1, risk: 1 }, result: '态表了，账没记' }
      ] },
      { subCase: 'sc2', title: '惠企政策看得见摸不着', text: '市内惠企政策几十条，企业反映"申报材料重、审核周期长、奖补到账慢"。', choices: [
        { text: '上线政策计算器+免申即享试点', effects: { iq: 1, workAbility: 2, peopleReputation: 1 }, result: '免申即享试点，企业直呼真香' },
        { text: '精简申报材料，承诺办结时限', effects: { workAbility: 1, background: 1 }, result: '材料瘦身，时限承诺上墙' },
        { text: '建立政策兑现督查台账', effects: { integrity: 1, workAbility: 1, mentalPressure: 1 }, result: '台账督办，兑现率上升' },
        { text: '统筹各部门政策解读专场', effects: { eq: 1, peopleReputation: 1 }, result: '解读专场解了近渴' }
      ] },
      { subCase: 'sc2', title: '龙头企业要"一事一议"优待', text: '招商来的龙头企业提出一事一议特殊政策，领导也打了招呼。给，其他企业会怎么看？', choices: [
        { text: '在共性政策框架内给足支持', effects: { integrity: 2, eq: 1, mentalPressure: 1 }, result: '框架内给力，尺度拿捏住了' },
        { text: '按企业贡献度量化激励', effects: { iq: 1, workAbility: 1, reputation: 1 }, result: '量化激励，规则透明' },
        { text: '先给权限内能给的，其余上报', effects: { background: 1, eq: 1 }, result: '能给的给，不能给的上报' },
        { text: '特事特办开方便之门', effects: { background: 2, heat: 2, risk: 2 }, result: '方便之门开了，议论也来了' }
      ] },
      { subCase: 'sc3', title: '涉企收费的"红顶中介"', text: '企业反映评估、检测、认证环节的"红顶中介"捆绑收费，价高质低。清理，就要动中介背后的人。', choices: [
        { text: '清理规范涉企收费清单并公示', effects: { integrity: 2, peopleReputation: 2, heat: 1 }, result: '清单公示，收费减负看得见' },
        { text: '引入外地中介竞争打破垄断', effects: { workAbility: 1, background: 1 }, result: '竞争引入，本地中介急了' },
        { text: '只减不增，暂列观察名单', effects: { eq: 1, workAbility: -1 }, result: '观察名单形同虚设' },
        { text: '联合市场监管局专项检查', effects: { background: 1, integrity: 1, mentalPressure: 1 }, result: '专项检查，露头就打' }
      ] },
      { subCase: 'sc3', title: '年终考核的营商环境排名', text: '省里营商环境年度排名公布，市内排名中游。领导要求明年进前十，专班压力到你头上。', choices: [
        { text: '对照指标体系逐项补短板', effects: { workAbility: 2, background: 1, mentalPressure: 2 }, result: '指标逐项攻坚，排名回升' },
        { text: '请第三方评估找真实差距', effects: { iq: 1, wealth: -1 }, result: '评估报告客观，短板清单清晰' },
        { text: '对标先进城市学经验', effects: { eq: 1, workAbility: 1 }, result: '取经学习，少走弯路' },
        { text: '把考核重心引到优势指标上', effects: { background: 1, integrity: -1, risk: 1 }, result: '扬长避短，心虚自知' }
      ] }
    ],
    completionEffects: { reputation: 4, background: 3, workAbility: 3, peopleReputation: 2, flag: 'policy_business_environment_done' }
  },

  // ============ 安全生产整治（强监管条线） ============
  {
    id: 'safety_rectify', icon: '🛡️', name: '安全生产整治', duration: 7,
    summary: '隐患清零行动：查得出问题，也要扛得住人情。',
    desc: '牵头重点行业安全生产隐患清零。排查整治、执法闭环、长效制度三个子案，动真格就动人情。',
    requireRankMin: 4, requireUnitLevelMin: 1, requireYearsWorked: 3,
    subCases: [
      { id: 'sc1', name: '子案一 · 排查整治' },
      { id: 'sc2', name: '子案二 · 执法闭环' },
      { id: 'sc3', name: '子案三 · 长效机制' }
    ],
    stages: [
      { subCase: 'sc1', title: '化工园区的重大隐患', text: '专家排查发现园区两家企业储罐区防火间距不足，整改要停产两个月，企业主连夜找你喝茶。', choices: [
        { text: '挂牌督办，停产整改不商量', effects: { integrity: 3, heat: 1, mentalPressure: 3 }, result: '挂牌整改，园区都怕了三分' },
        { text: '限期整改与停产整改分档处理', effects: { workAbility: 1, integrity: 1, eq: 1 }, result: '分档处理，企业服气' },
        { text: '允许边生产边整改', effects: { background: 1, risk: 3, heat: 1 }, result: '边产边改，隐患悬顶' },
        { text: '邀请安科院复核隐患等级', effects: { iq: 1, integrity: 1 }, result: '复核结论权威，争议平息' }
      ] },
      { subCase: 'sc1', title: '小作坊的整治名单', text: '城中村小作坊群消防通道堵塞严重，房东是老街坊，整治消息刚放出去，求情电话就来了。', choices: [
        { text: '一视同仁进名单，逐户告知整改', effects: { integrity: 2, peopleReputation: 1, mentalPressure: 2 }, result: '名单公示，人情让位安全' },
        { text: '先整改示范户，再推开', effects: { eq: 1, workAbility: 1 }, result: '示范先行，阻力小步快跑' },
        { text: '协调搬迁补助政策同步出台', effects: { background: 1, wealth: -1, peopleReputation: 1 }, result: '搬迁有补助，真心整改' },
        { text: '按投诉优先级分批整治', effects: { eq: 1, workAbility: -1, risk: 1 }, result: '分批整治，投诉无门的还急' }
      ] },
      { subCase: 'sc1', title: '暴雨季前的防汛盲区', text: '巡查发现两处地下空间防汛预案是纸面的，应急物资也没配齐。汛期只剩三周。', choices: [
        { text: '物资与演练一周内双到位', effects: { workAbility: 2, body: -1, mentalPressure: 2 }, result: '物资就位，演练做实' },
        { text: '更新预案并落实责任人', effects: { workAbility: 1, integrity: 1 }, result: '预案活起来，责任落到人' },
        { text: '上报申请专项资金补配', effects: { background: 1, wealth: 1 }, result: '专项到位，物资补齐' },
        { text: '汛期加强值守以人力弥补', effects: { body: -2, mentalPressure: 2, workAbility: 1 }, result: '人盯人防守，心里没底' }
      ] },
      { subCase: 'sc2', title: '执法记录仪拍到了熟人', text: '执法队员上门检查，发现你同学负责的企业灭火器过期。同学当场打电话给你。', choices: [
        { text: '依法处置，自己避嫌', effects: { integrity: 3, peopleReputation: 1, risk: -1 }, result: '依法处置，同学记了三年' },
        { text: '督促整改到位后按从轻情节处理', effects: { integrity: 1, workAbility: 1, eq: 1 }, result: '整改到位，处理从轻有据' },
        { text: '先现场整改，不再立案', effects: { background: 1, eq: 1, risk: 2 }, result: '人情卖了，记录仪记了' },
        { text: '转同事主办，全程回避', effects: { eq: 1, integrity: 1 }, result: '回避程序规范，两全' }
      ] },
      { subCase: 'sc2', title: '整改企业的"纸面闭环"', text: '复查发现有的企业整改验收"材料齐全"——监控一查，三天没开工。闭环验收签字的压力落你头上。', choices: [
        { text: '随机抽检+影像抽查穿透验收', effects: { integrity: 2, workAbility: 2, mentalPressure: 1 }, result: '穿透验收，纸面闭环现形' },
        { text: '验收改为现场确认与随机复查结合', effects: { workAbility: 1, eq: 1 }, result: '现场确认，企业不再糊弄' },
        { text: '对虚假闭环企业从重处理', effects: { integrity: 2, heat: 1, background: -1 }, result: '从重处理，通报全县' },
        { text: '压缩验收时间节点', effects: { background: 1, risk: 1, workAbility: 1 }, result: '时间压缩，隐患反弹' }
      ] },
      { subCase: 'sc2', title: '重大案件的移送之争', text: '一起高处坠落事故调查完毕，涉嫌瞒报，案子移送司法机关还是内部处理，两种意见顶上了。', choices: [
        { text: '依法移送，完整移交证据链', effects: { integrity: 3, risk: -2, heat: 1 }, result: '移送司法，树了规矩' },
        { text: '报请上级定夺，不自行裁量', effects: { background: 1, integrity: 1 }, result: '上级拍板，程序稳妥' },
        { text: '内部高限处罚，给企业留生机', effects: { background: 1, risk: 2, integrity: -1 }, result: '留了生机，留了把柄' },
        { text: '随大流同案同罚', effects: { eq: 1, workAbility: -1 }, result: '随大流没有立场' }
      ] },
      { subCase: 'sc3', title: '整治成果怎么保长效', text: '专项行动收官，隐患清零。如何防止"整改进园区、反弹出园区"？长效机制怎么立。', choices: [
        { text: '建立企业隐患自查月度打卡制', effects: { workAbility: 2, mentalPressure: 1 }, result: '月度打卡，隐患早发现' },
        { text: '将整治纳入绩效考核硬指标', effects: { integrity: 1, background: 1, heat: 1 }, result: '考核挂钩，层层传导' },
        { text: '组建镇村安全网格员队伍', effects: { peopleReputation: 1, workAbility: 1 }, result: '网格员落地，末梢有人管' },
        { text: '引入保险机构第三方风控', effects: { iq: 1, wealth: 1 }, result: '保险参与，风控市场化' }
      ] }
    ],
    completionEffects: { integrity: 3, reputation: 3, workAbility: 3, risk: -3, flag: 'policy_safety_rectify_done' }
  }
];