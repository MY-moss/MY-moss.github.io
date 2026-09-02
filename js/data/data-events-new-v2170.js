// ==================== v2.1.70 Career 仕途体系补强包（enc103-122，20 事件） ====================
// v2.1.69 审计结论：career 159 条中 115 条无单位池、20/28 个池 token 零覆盖（党委/机关/乡镇/中央等）、
// 三大时代 career 专属为 0、35-44 岁起始窗口为 0、选拔/考察期/公示期重度缺词。
// 本包四组：系统池 ×8、era career ×6（reform/rectify 各 3）、中年窗口 ×4、仕途散件 ×2。
// 事件均走既有效果键白名单（validate_data 26 键），不引入新 flag，避免破坏 flag 闭合校验。
const gd_events_new_v2170 = [
  // ---------- 系统池 career ×8 ----------
  { id: 'enc103', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 5, year: [30, 55], pools: ['党委系统'], title: '列席党委办公会', text: '第一次被通知列席党委办公会记录纪要。书记讲话信息量大，散会后处长老同事压低声音提醒你："会议较量在会前。"', choices: [
    { text: '认真记录，会后就重点条款补即席调研', effects: { workAbility: 2, reputation: 1, background: 1, mentalPressure: 2 }, result: '纪要扎实，书记事后单独问了你两句' },
    { text: '会前找两位熟悉议题的处长取经', effects: { eq: 2, background: 1 }, result: '提前摸清了各方立场，现场应答得体' },
    { text: '照实记录，不多言不多想', effects: { integrity: 1, reputation: 1, workAbility: 1 }, result: '中规中矩，胜在不出错' },
    { text: '会后向分管领导要一句口头反馈', effects: { background: 2, eq: -1 }, result: '反馈拿得快，同僚觉得你太会来事' }
  ] },
  { id: 'enc104', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 5, year: [28, 50], pools: ['机关'], title: '机关工委党建考核', text: '机关工委年度党建考核组入驻，台账、阵地、主题党日活动都要过一遍。你们单位的台账年头久远、格式混乱。', choices: [
    { text: '牵头把台账按新标准重新归档', effects: { workAbility: 2, positionWeight: 1, mentalPressure: 2 }, result: '台账一次性过审，考核组加了分' },
    { text: '请兄弟单位借一套样板参考', effects: { eq: 1, background: 1 }, result: '样板到手，效率翻倍' },
    { text: '如实申报短板，列整改清单', effects: { integrity: 2, reputation: 1 }, result: '整改清单换来"务实"评语' },
    { text: '考核重点时段集中补材料', effects: { background: 1, risk: 1, integrity: -1 }, result: '材料齐了，考核组见多识广' }
  ] },
  { id: 'enc105', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 5, year: [26, 48], pools: ['乡镇'], title: '乡镇班子碰头会', text: '书记的季度碰头会开了一上午：春耕、防火、信访、考核指标全在一张表上。轮到你汇报的条线数据不好看。', choices: [
    { text: '数据难看也如实摆出来，附对策', effects: { integrity: 2, reputation: 1, workAbility: 1 }, result: '书记点头："有问题不怕，怕藏着"' },
    { text: '先汇报亮点，短板留到会后单独说', effects: { eq: 1, background: 1 }, result: '场面过得去，会后单独汇报反而聊得深' },
    { text: '把责任往客观原因上引', effects: { eq: -1, reputation: -1, mentalPressure: 1 }, result: '书记见多了，一句"都怪天气"被顶了回来' },
    { text: '主动认领指标缺口，请求资源', effects: { workAbility: 1, background: 1, mentalPressure: 2 }, result: '资源要到一半，压力提示另一半' }
  ] },
  { id: 'enc106', requireRankMin: 5, stage: 'career', eventType: 'choice', weight: 5, year: [35, 55], pools: ['中央'], title: '中央机关工作会议', text: '部委年度工作会议，规格高、材料多。你的任务是在分组讨论上代表本司局发言五分钟，话筒递过来的一刻名单顺序临时变了。', choices: [
    { text: '临场调整，先抛结论再讲数据', effects: { workAbility: 2, reputation: 2, mentalPressure: 2 }, result: '发言被主持人点名表扬，同行记下了你的名字' },
    { text: '按原稿照读，稳住不翻车', effects: { integrity: 1, reputation: 1 }, result: '稳字当头，无功无过' },
    { text: '把发言机会让给资深处长', effects: { eq: 2, background: 1 }, result: '处长念你的好，礼尚往来' },
    { text: '借机递上署名建议稿', effects: { background: 2, reputation: 1, risk: 1 }, result: '建议稿被带走了，出处也被记住了' }
  ] },
  { id: 'enc107', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 5, year: [26, 45], pools: ['基层单位'], title: '驻村干部选派意向', text: '新一轮驻村第一书记选派启动，动员会开了三场。组织股电话问你"有没有意向"，话里话外是机会与苦差的双重含义。', choices: [
    { text: '主动报名，把驻村当硬仗打', effects: { workAbility: 2, peopleReputation: 2, familyPressure: 2, mentalPressure: 2 }, result: '两年驻村，群众口碑换来组织部的考察记录' },
    { text: '推荐年轻同事，自己留在机关', effects: { eq: 1, background: 1, peopleReputation: -1 }, result: '留下省心，口碑落了下风' },
    { text: '和家里商量后报名，先安后路', effects: { eq: 2, familyPressure: -1, workAbility: 1 }, result: '后方稳固，驻村无后顾之忧' },
    { text: '婉拒后主动接手对口帮扶联络', effects: { eq: 1, peopleReputation: 1, workAbility: 1 }, result: '不去现场，但联络线握在手里' }
  ] },
  { id: 'enc108', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [28, 52], pools: ['政府部门'], title: '年度务虚会', text: '年底务虚会要求每个处室提一条来年改革建议。处的老传统是"提了也白提"，但今年局座点名要"敢提问题的"。', choices: [
    { text: '把积弊摊开，提一条动真格的建议', effects: { integrity: 2, reputation: 1, workAbility: 2, heat: 1 }, result: '建议进了局里的议事清单，动了人' },
    { text: '提一条既安全又显眼的中庸建议', effects: { eq: 1, background: 1 }, result: '与会者点头，无人反对' },
    { text: '汇总兄弟单位提过的老建议', effects: { workAbility: 1, mentalPressure: -1 }, result: '稳妥复读机' },
    { text: '会后单独向局座递补充材料', effects: { background: 2, eq: -1 }, result: '材料被收下了，同事觉得你藏了一手' }
  ] },
  { id: 'enc109', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 5, year: [25, 55], pools: ['市级'], title: '全市性干部大会', text: '全市干部大会座次按单位排序，你负责本单位参会组织。临近开场发现代表证少印了三张，其中一张是领导的。', choices: [
    { text: '临时加印，专人送证，不动声色', effects: { workAbility: 2, eq: 1, mentalPressure: 2 }, result: '会前五分钟解决，领导毫不知情' },
    { text: '向会务组说明情况补领', effects: { integrity: 1, background: 1 }, result: '会务组补发，小事一桩' },
    { text: '让没证的三位同事先让位给领导', effects: { eq: 2, reputation: -1 }, result: '同事嘴上没说，心里记了账' },
    { text: '先开会再说，散会后自首', effects: { background: -1, mentalPressure: 1, integrity: 1 }, result: '散会后汇报，领导没计较' }
  ] },
  { id: 'enc110', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [26, 50], pools: ['技术部门', '数据部门'], title: '数字政府推进会', text: '数字政府推进会要求各单位科长汇报系统迁移进度。你负责的系统还在和旧库双轨运行，汇报口径怎么写都有漏洞。', choices: [
    { text: '如实报双轨运行风险与期限', effects: { integrity: 2, background: 1, mentalPressure: 2 }, result: '风险被记录，期限被压缩' },
    { text: '突出示范成果，淡化迁移延迟', effects: { background: 1, reputation: 1, risk: 2 }, result: '汇报过了，数据局的台账记得' },
    { text: '把双轨问题做成联合攻坚课题', effects: { workAbility: 2, iq: 1, reputation: 1 }, result: '课题立项，表扬拿到，难题照做' },
    { text: '申请延期并给出倒排计划', effects: { workAbility: 1, background: 1, mentalPressure: 1 }, result: '计划被采纳，deadline 留了余地' }
  ] },
  // ---------- era career ×6 ----------
  { id: 'enc111', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 5, era: ['reform'], year: [28, 52], title: '改革方案论证会', text: '改革办召集改革方案论证会，你报送的试点方案被点名"步子太大"。论证组的老专家更关心可复制性。', choices: [
    { text: '把方案细化为两期实施路径', effects: { iq: 1, workAbility: 2, background: 1 }, result: '可复制性达标，方案过审' },
    { text: '坚持整案试点，数据说话', effects: { integrity: 1, workAbility: 1, heat: 1 }, result: '豪赌赢了关注，输了缓冲' },
    { text: '吸收专家意见改稿后重新报送', effects: { eq: 2, workAbility: 1 }, result: '改稿被采纳，名字进了起草组' },
    { text: '缩小试点范围先行验证', effects: { eq: 1, workAbility: 1, mentalPressure: -1 }, result: '小范围试点稳妥推进' }
  ] },
  { id: 'enc112', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 4, era: ['reform'], year: [25, 50], title: '干部队伍大讨论', text: '体制改革年，单位组织"怎么看、怎么干"大讨论。发言稿的三段式人人都写，但领导想听的是真问题。', choices: [
    { text: '结合本岗提三个具体堵点', effects: { workAbility: 2, integrity: 1, peopleReputation: 1 }, result: '三个堵点两个被采纳，另一个得罪了流程' },
    { text: '讲认识、表态度，平安过关', effects: { background: 1, eq: 1 }, result: '四平八稳，不出头' },
    { text: '化名渠道把意见递到改革办', effects: { background: 1, integrity: 1, risk: 1 }, result: '意见被引用，你隐了身' },
    { text: '会后找改革办同事深度聊一次', effects: { eq: 2, workAbility: 1 }, result: '聊出了情报，也聊出了盟友' }
  ] },
  { id: 'enc113', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, era: ['reform'], year: [32, 50], title: '改革专班人选谈话', text: '改革专班组建在即，分管领导找你谈话，话头在"敢不敢啃硬骨头"。你知道专班两年要交出实绩，也可能两头不讨好。', choices: [
    { text: '接下专班联络岗，兼守原业务', effects: { workAbility: 2, mentalPressure: 3, positionWeight: 1 }, result: '两头跑，两头都占着' },
    { text: '明确要专职副岗，砍掉琐碎事务', effects: { background: 2, workAbility: 1 }, result: '岗位谈成了，深耕专班' },
    { text: '推荐更合适的人，自己幕后支持', effects: { eq: 2, peopleReputation: 1 }, result: '成全别人，人脉加分' },
    { text: '先答应再看风向', effects: { eq: 1, risk: 1, background: -1 }, result: '答应得爽快，准备得迟疑' }
  ] },
  { id: 'enc114', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 5, era: ['rectify'], year: [28, 55], title: '专项巡视进驻谈话', text: '专项巡视组进驻单位，谈话名单里第三个就是你。组员的每一句都像是"你已经知道什么"的考验。', choices: [
    { text: '如实谈所了解的情况，不足为凭的都说清楚', effects: { integrity: 3, risk: -2, mentalPressure: 2 }, result: '谈话记录干净，巡视组对你评价正面' },
    { text: '只谈工作不谈人事', effects: { reputation: 1, background: -1 }, result: '保守回答，留了余地也留了问号' },
    { text: '借谈话反映长期积压的流程问题', effects: { integrity: 1, workAbility: 1, heat: 1 }, result: '问题被记录在案' },
    { text: '试探组员口径再决定深浅', effects: { eq: 1, risk: 2, integrity: -1 }, result: '试探被看穿，印象分掉了' }
  ] },
  { id: 'enc115', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, era: ['rectify'], year: [32, 52], title: '中层廉政约谈', text: '纪委副书记约谈中层干部，先讲了三起身边案例，然后沉默十秒问："你有没有要说清楚的？"', choices: [
    { text: '坦承应酬边界的模糊之处并整改', effects: { integrity: 2, risk: -2, mentalPressure: -1 }, result: '约谈变成提醒，问题说清即放下' },
    { text: '明确表态无问题，请组织放心', effects: { background: 1, mentalPressure: 1 }, result: '表态利落，组织部记住了你' },
    { text: '主动上交过去收过的两条烟酒', effects: { integrity: 2, wealth: -1, background: 1 }, result: '上交记录进了档，风评转好' },
    { text: '反手举报一处工作关系中的问题', effects: { risk: 1, background: -1, integrity: 1 }, result: '转移了焦点，树了对手' }
  ] },
  { id: 'enc116', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, era: ['rectify'], year: [30, 50], title: '审批环节自查谈话', text: '整改年，处长找你自查审批环节：你经手的一批"加急件"实际都按规程走了，但有人传你"效率高是因为关系硬"。', choices: [
    { text: '把全年审批台账主动摆上桌', effects: { integrity: 3, background: 1, mentalPressure: 2 }, result: '台账自证，流言不攻自破' },
    { text: '请处室内部交叉互查留痕', effects: { workAbility: 1, integrity: 1, eq: 1 }, result: '互查机制立住，人人自清' },
    { text: '清者自清，不再回应', effects: { reputation: -1, mentalPressure: 1 }, result: '不回应反而助长了议论' },
    { text: '把典型件做成公开案例', effects: { background: 1, peopleReputation: 1, heat: 1 }, result: '公开案例展示流程，风评反转' }
  ] },
  // ---------- 中年窗口 career ×4（35-44 岁起始窗，补零档） ----------
  { id: 'enc117', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [35, 50], title: '组织考察谈话', text: '组织部考察组为一批岗位开展民主推荐和个别谈话，你是谈话对象也是被推荐人之一。"谈谈你的优缺点"——这句老问题的分量你现在才懂。', choices: [
    { text: '优缺各半，缺点选可改进项', effects: { integrity: 2, background: 2, eq: 1 }, result: '考察组记下"认识清醒"，推荐票稳了' },
    { text: '扬长避短，突出实绩数据', effects: { background: 1, reputation: 2, risk: 1 }, result: '实绩亮眼，缺点轻描淡写' },
    { text: '主动提及一次失误与复盘', effects: { integrity: 2, background: 1, mentalPressure: 1 }, result: '坦诚换理解，考察谈话成为加分项' },
    { text: '打听考察组偏好再组织语言', effects: { eq: 1, background: -1, risk: 2 }, result: '消息有偏差，准备过了头' }
  ] },
  { id: 'enc118', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [38, 52], title: '班子调整谈心', text: '单位班子调整风声传了三个月，分管领导终于找你谈心："组织上准备动一动你的岗位。"话没说明，但方向有数。', choices: [
    { text: '表态服从安排，同时讲清个人诉求', effects: { background: 2, integrity: 1, eq: 1 }, result: '进退有据，组织记住了你的分寸' },
    { text: '主动请缨想去的关键岗位', effects: { background: 2, mentalPressure: 2, positionWeight: 1 }, result: '争取到了推荐，竞争者也多了' },
    { text: '一切听组织，怎么安排都行', effects: { reputation: 1, background: -1 }, result: '好说话的人是最后的选项' },
    { text: '先稳住现有岗位再说', effects: { background: -1, eq: 1, mentalPressure: -1 }, result: '慢半拍，机会也慢半拍' }
  ] },
  { id: 'enc119', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [35, 45], title: '任职试用期', text: '新岗位任职试用期一年。前三个月你发现分管领域有一项历史遗留工作存在明显风险，报告了可能动老同事的奶酪。', choices: [
    { text: '书面报告风险与建议处置路径', effects: { integrity: 2, workAbility: 2, heat: 1 }, result: '报告留档，风险开始化解' },
    { text: '先私下沟通原经办人', effects: { eq: 1, background: 1, risk: -1 }, result: '对方配合，悄然化解' },
    { text: '拖到年度总结再提', effects: { background: -1, risk: 2, mentalPressure: 1 }, result: '拖的结果是风险自己浮出来' },
    { text: '调整分工把问题划给边界处室', effects: { eq: 1, reputation: -1, risk: 1 }, result: '职责划走了，是非留下了' }
  ] },
  { id: 'enc120', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [36, 48], title: '轮岗交流通知', text: '轮岗交流方案公布：你在交流名单里，去向是业务条线与你现在完全不同的部门。交接期两周，旧部门还有三个项目没结。', choices: [
    { text: '两周内完成交接明细，不留尾巴', effects: { workAbility: 2, integrity: 1, reputation: 1, mentalPressure: 2 }, result: '交接清单干净，前任周期零投诉' },
    { text: '借轮岗机会把边缘项目顺势砍掉', effects: { eq: 1, background: 1, workAbility: 1 }, result: '包袱卸了，评价见仁见智' },
    { text: '和新部门提前磨合两次', effects: { eq: 2, background: 1 }, result: '还没报到，新同事已熟' },
    { text: '离岗前突击补材料刷存在感', effects: { background: 1, peopleReputation: -1 }, result: '材料不少，人脉少了' }
  ] },
  // ---------- 仕途散件 ×2 ----------
  { id: 'enc121', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 4, year: [26, 55], title: '年度考核等次谈话', text: '年度考核等次结果出来，处室两人优秀一人称职。处长单独找你谈话时先沉默了一会儿——你隐约觉得话不只评语那么简单。', choices: [
    { text: '先听评语，再如实认领不足', effects: { integrity: 2, reputation: 1, workAbility: 1 }, result: '等次靠后但态度到位，来年翻盘' },
    { text: '就事论事拿出三件硬实绩', effects: { background: 1, reputation: 2, eq: -1 }, result: '实绩说话，等次被复议过一次' },
    { text: '主动要求更高的年度指标', effects: { workAbility: 2, mentalPressure: 2, positionWeight: 1 }, result: '指标翻倍承诺立下，压力也翻倍' },
    { text: '询问评优标准存在感的差距在哪', effects: { eq: 1, workAbility: 1, mentalPressure: 1 }, result: '标准问得清楚，来年有的放矢' }
  ] },
  { id: 'enc122', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [28, 45], title: '公开选拔动员', text: '局内首次公开选拔两个副处岗，报名条件你刚好够线。动员会上没人报名，大家都等着看第一个吃螃蟹的人。', choices: [
    { text: '第一个报名，把选拔当公开擂台', effects: { background: 2, workAbility: 1, mentalPressure: 3, positionWeight: 1 }, result: '报名引发连锁，你的名字上了竞争名单' },
    { text: '先私下问清答辩评委构成再报', effects: { eq: 1, background: 1, risk: 1 }, result: '情报到位，报了名也有底' },
    { text: '让资历更浅的同事先上', effects: { eq: 2, peopleReputation: 1, background: -1 }, result: '成全了别人，延迟了自己' },
    { text: '补一个业绩短板再等下一轮', effects: { workAbility: 1, eq: 1 }, result: '补短板是对的，下轮窗口未必有' }
  ] }
];