// ==================== v2.1.73 剩余短板补强包（enw254-262 / enl187-195 / enc134-137，20 事件六线） ====================
// v2.1.72 后复核（数据依据见 CHANGELOG v2.1.73）：career 55+ 专窗 0 / life sudden 3 条 /
// 执法应急主题最低 / reform_pioneer 结局 0 主题事件 / 挂职散件无闭环 / stable work 最薄。
// 全部走既有效果键白名单、无新 flag、era 用数组格式。
const gd_events_new_v2173 = [
  // ---------- 1. career 55+ 退休前专窗 ×4 ----------
  { id: 'enc134', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [55, 62], title: '卸任交接谈话', text: '到龄前两年，组织安排你逐步交接分管工作。新任接手者年轻你十岁，交接清单上有一项你压了多年的历史问题。', choices: [
    { text: '历史问题如实交底，附处置建议', effects: { integrity: 2, reputation: 1, background: 1 }, result: '交接干净，继任者承了你的人情' },
    { text: '先私下处置好再移交', effects: { workAbility: 1, mentalPressure: 2 }, result: '处置妥当，交接清单清爽' },
    { text: '交给继任者自己摸索', effects: { background: -1, risk: 1 }, result: '包袱转移了，口碑也转了' },
    { text: '借交接把想办的事办了', effects: { background: 1, risk: 2 }, result: '办了私事，留了话柄' }
  ] },
  { id: 'enc135', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [55, 62], title: '离任审计配合', text: '离任经济责任审计小组进驻，要求你五年内的经费审批、项目签批逐笔说明。大部分经你手的字都合规，有三笔记忆模糊。', choices: [
    { text: '主动查档把三笔事项核实清楚', effects: { integrity: 2, workAbility: 1, mentalPressure: 2 }, result: '核实后三笔都有据，审计顺利收官' },
    { text: '请经办同事协助回忆补材料', effects: { eq: 1, background: 1 }, result: '材料补齐，同事也担了份情' },
    { text: '按印象答复，审计自行判断', effects: { risk: 1, mentalPressure: 1 }, result: '答复含糊，审计标注待查' },
    { text: '先查内部档案再统一答复', effects: { workAbility: 1, integrity: 1 }, result: '档案比印象准，答复一致' }
  ] },
  { id: 'enc136', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [56, 63], title: '离休前的收官之仗', text: '离退前的最后一次大型任务落在你肩上，执行期恰逢你生日。有人劝你"功成不必在我"，把机会让给年轻人。', choices: [
    { text: '全程盯到底，善始善终', effects: { reputation: 2, workAbility: 1, body: -1 }, result: '任务收官，你的最后一仗干净利落' },
    { text: '让年轻人主挑，你做顾问', effects: { eq: 2, background: 1 }, result: '传帮带漂亮，继任者服气' },
    { text: '正常履职，不过度投入', effects: { mentalPressure: -1, reputation: -1 }, result: '平稳收官，高光留给了别人' },
    { text: '借任务最后一搏争取延任', effects: { background: 1, risk: 1, mentalPressure: 2 }, result: '表现亮眼，延任与否听组织' }
  ] },
  { id: 'enc137', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, year: [55, 60], title: '退休前年度述职', text: '任职生涯最后一次年度述职，台下坐着的多数是你带过的兵。你要用十分钟总结三十多年，还要留出给年轻人的话。', choices: [
    { text: '讲透三段转折，把失误也归进去', effects: { integrity: 2, reputation: 2, peopleReputation: 1 }, result: '复盘真诚，台下掌声最长' },
    { text: '多讲成绩，少谈遗憾', effects: { background: 1, reputation: 1 }, result: '成绩亮眼，遗憾留在心里' },
    { text: '借述职给年轻人让位表态', effects: { eq: 2, background: 2 }, result: '让贤表态大气，组织记了一笔' },
    { text: '简简报完，把时间留给同事', effects: { eq: 1, reputation: -1 }, result: '谦让过头，述职太空' }
  ] },
  // ---------- 2. life 突发扩 ×4（sudden） ----------
  { id: 'enl187', stage: 'life', eventType: 'sudden', weight: 4, year: [26, 70], title: '家人急送医', effects: { mentalPressure: 6, familyPressure: 3, wealth: -6, body: -1 }, text: '深夜十一点，家里老人突然胸痛倒地。救护车二十分钟才到，你在走廊里签了三次字，手还是抖的。' },
  { id: 'enl188', stage: 'life', eventType: 'sudden', weight: 3, year: [28, 55], title: '孩子突发高烧', effects: { mentalPressure: 4, familyPressure: 3, body: -1, wealth: -3 }, text: '幼儿园傍晚来电：孩子高烧三十九度。你请了假冲过去，值班医生的表情让路上所有的红绿灯都变慢了。' },
  { id: 'enl189', stage: 'life', eventType: 'sudden', weight: 3, year: [26, 65], title: '老宅骤停水电', effects: { mentalPressure: 3, familyPressure: 2, wealth: -4 }, text: '台风夜里老宅突然停水停电，父母电话那头只有应急灯的一小圈光。你对着手机地图，测了三遍回家的距离。' },
  { id: 'enl190', stage: 'life', eventType: 'sudden', weight: 3, year: [28, 62], title: '大风雨窗玻璃', effects: { mentalPressure: 3, wealth: -5, body: 0 }, text: '一场大风掀了阳台玻璃窗，碎片落进客厅。邻居拍了视频发物业群里，@你问要不要帮忙清理。' },
  // ---------- 3. 执法/应急主题补强 ×6（work，主题分类器命中） ----------
  { id: 'enw254', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '联合执法行动', text: '市场监管、公安、消防三方联合执法夜查，你负责现场开具文书。遇到一家店老板反复套近乎，说自己"认识你们局里的同事"。', choices: [
    { text: '按程序执法，主动留全程记录', effects: { integrity: 2, workAbility: 1, risk: -1 }, result: '记录完整，套近乎没套动你' },
    { text: '先明示身份再执法，公事公办', effects: { eq: 1, integrity: 1 }, result: '程序走正，老板收敛了' },
    { text: '联合组内换人主查，你回避', effects: { eq: 1, background: 1 }, result: '回避干净，联合组也服气' },
    { text: '电话确认后再定执法尺度', effects: { risk: 3, integrity: -2 }, result: '电话打完，执法变了味' }
  ] },
  { id: 'enw255', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '执法复议听证', text: '一起行政处罚被当事人申请复议，听证会安排在周五下午。你的案卷被调出来当庭质证，办案细节经不起当庭反复推敲。', choices: [
    { text: '庭前把案卷从头过一遍', effects: { workAbility: 2, integrity: 1, mentalPressure: 1 }, result: '质证干净，复议维持' },
    { text: '请法制科先审一遍再上庭', effects: { workAbility: 1, background: 1 }, result: '法制科把关，程序无漏' },
    { text: '按程序应诉，临场发挥', effects: { mentalPressure: 3, risk: 1 }, result: '临场被追问两处，复议部分改' },
    { text: '庭前与当事人沟通和解意向', effects: { eq: 1, risk: 1 }, result: '调解可行，听证取消' }
  ] },
  { id: 'enw256', stage: 'work', eventType: 'choice', weight: 4, pools: ['应急'], title: '暴雨夜的指挥室', text: '暴雨红色预警生效，你被排进防汛指挥中心值守夜班。凌晨两点，调度屏上一处水库水位逼近警戒线。', choices: [
    { text: '立即启动预案并逐级上报', effects: { workAbility: 2, integrity: 1, mentalPressure: 2 }, result: '处置及时，天亮后雨势缓和' },
    { text: '先核实数据再决策', effects: { iq: 1, workAbility: 1 }, result: '数据核实无误，预案照走' },
    { text: '通知下游镇村提前转移准备', effects: { peopleReputation: 2, workAbility: 1 }, result: '转移准备到位，有惊无险' },
    { text: '等天明再定，避免小题大做', effects: { risk: 3, mentalPressure: 1 }, result: '天没亮水位就超了' }
  ] },
  { id: 'enw257', stage: 'work', eventType: 'choice', weight: 4, pools: ['应急'], title: '应急演练评估', text: '年度防汛应急演练，你这组在"人员转移"科目上卡了壳：预案里的集合点实际被施工围挡封了。评估组在台上等你们解释。', choices: [
    { text: '现场改签到点，如实记录偏差', effects: { integrity: 2, workAbility: 1, mentalPressure: 2 }, result: '偏差被记入演练改进清单，评估给良' },
    { text: '解释为施工临时围挡，非预案问题', effects: { eq: 1, background: 1 }, result: '解释被接受，问题留到台账' },
    { text: '演练后立即整改预案', effects: { workAbility: 2, integrity: 1 }, result: '整改快，评估组另眼相看' },
    { text: '压着不提，等检查组发现', effects: { risk: 2, background: -1 }, result: '检查组发现了，整改变了追责' }
  ] },
  { id: 'enw258', stage: 'work', eventType: 'choice', weight: 4, pools: ['应急'], title: '四小时舆情响应', text: '凌晨的突发事故被拍到网上，四小时内冲上同城热搜。领导让你牵头拟回应口径，舆情部门手头只有初步情况。', choices: [
    { text: '先发简短事实通报稳住舆论', effects: { eq: 1, workAbility: 2, heat: -1 }, result: '事实通报先声夺人，热度过峰回落' },
    { text: '核实清楚再回应，不抢速度', effects: { integrity: 2, background: 1 }, result: '回应扎实，但舆论先入为主' },
    { text: '多渠道同步发布处置进展', effects: { workAbility: 2, peopleReputation: 1 }, result: '进展透明，舆情闭环' },
    { text: '先冷处理等热度自然下降', effects: { heat: 2, reputation: -2 }, result: '热度没降，质疑上来了' }
  ] },
  // ---------- 4. reform_pioneer 专属 ×2 ----------
  { id: 'enw259', stage: 'work', eventType: 'choice', weight: 4, era: ['reform'], title: '改革方案落地表彰', text: '你牵头的那项改革试点落地满一年，数据好看、群众有获得感。市里要开表彰会，通报表扬名单初稿里有你的名字。', choices: [
    { text: '接受表彰，把数据讲实', effects: { reputation: 2, background: 1, workAbility: 1 }, result: '表彰实至名归，数据经得起算' },
    { text: '让一线团队上台领奖', effects: { eq: 2, peopleReputation: 2 }, result: '让贤之举被传开，风评更佳' },
    { text: '借表彰机会提出第二轮改革建议', effects: { background: 2, heat: 1 }, result: '建议被采纳，你上了改革办的名单' },
    { text: '低调婉拒，只报工作', effects: { eq: 1, background: -1 }, result: '低调过了头，风头给了别人' }
  ] },
  { id: 'enw260', stage: 'work', eventType: 'choice', weight: 4, era: ['reform'], title: '改革成果推广会', text: '改革办让你赴兄弟市介绍试点成果，台下有七位处级以上领导。你准备的 PPT 里有一页是"目前还存在的问题"。', choices: [
    { text: '问题页照讲，附解决方案', effects: { integrity: 2, reputation: 2, mentalPressure: 2 }, result: '讲问题反而成了亮点，推广邀请接踵而至' },
    { text: '把问题页隐去，只讲成效', effects: { background: 1, risk: 1 }, result: '反响一般，问题被同行问到' },
    { text: '现场把问题抛给台下集思广益', effects: { eq: 2, workAbility: 1 }, result: '互动热烈，观点被记进纪要' },
    { text: '请分管领导带队主讲', effects: { eq: 1, background: 2 }, result: '领导上台，你的名号留在幕后' }
  ] },
  // ---------- 5. 挂职闭环 ×2 ----------
  { id: 'enw261', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '挂职归来汇报', text: '上级机关挂职一年期满归来，组织让你在班子会上汇报。原单位同事好奇"挂职一年到底捞到啥"，领导的眉头等你展开。', choices: [
    { text: '汇报视野与资源，不炫耀人脉', effects: { workAbility: 2, background: 1, eq: 1 }, result: '汇报到位，视野被认可' },
    { text: '如实讲挂职经历也对本单位的新认识', effects: { integrity: 1, reputation: 1 }, result: '中肯客观，两头都服' },
    { text: '借汇报主动申请承接上级项目', effects: { background: 2, workAbility: 1, mentalPressure: 2 }, result: '项目拿到手，空间也打开了' },
    { text: '轻描淡写，避免被说闲话', effects: { eq: 1, background: -1 }, result: '低调保身，机会也保没了' }
  ] },
  { id: 'enw262', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '争取留任上级机关', text: '上级机关对你的挂职表现满意，正式询问是否愿意留任。原单位已经把你的岗位占了半席，两边都有说法。', choices: [
    { text: '正式申请留任，走组织程序', effects: { background: 2, positionWeight: 1, familyPressure: 2 }, result: '留任获批，平台换了' },
    { text: '回原单位，把经历沉淀成能力', effects: { reputation: 1, familyPressure: -1, workAbility: 1 }, result: '回归后重用，履历更完整' },
    { text: '先谈条件再决定', effects: { background: 1, eq: -1, mentalPressure: 1 }, result: '条件谈成了，口碑也谈淡了' },
    { text: '两边都留余地，再观望一年', effects: { background: -1, mentalPressure: 1 }, result: '观望的代价是选择权变小' }
  ] },
  // ---------- 6. stable work 微补 ×3（含补录执法第 3 件） ----------
  { id: 'enw265', stage: 'work', eventType: 'choice', weight: 4, pools: ['执法部门', '政法系统'], title: '执法评议打分', text: '年度执法评议，群众代表和受邀企业给执法人员匿名打分。你执法严格出了名，有人提议给"较真的人"降降温。', choices: [
    { text: '接受评议，用案卷质量说话', effects: { integrity: 2, reputation: 1, mentalPressure: 1 }, result: '案卷质量过硬，评议分并列前茅' },
    { text: '主动走访被罚对象听意见', effects: { eq: 2, peopleReputation: 2 }, result: '走访化解对立，评议分回暖' },
    { text: '请单位把执法数据做成公开栏', effects: { background: 1, workAbility: 1 }, result: '公开透明，评议有据' },
    { text: '私下争取代表印象分', effects: { eq: 1, risk: 2, background: -1 }, result: '印象分拿到，记录也挺重' }
  ] },
  { id: 'enw263', stage: 'work', eventType: 'choice', weight: 4, era: ['stable'], pools: ['public'], title: '按部就班的考核台账', text: '安稳年代的年终考核按老规矩走，台账要补两年前的缺项。办公室老张说"年年如此，补上即可"，新来的科长却盯着格式。', choices: [
    { text: '按新要求重建台账模板', effects: { workAbility: 2, positionWeight: 1, mentalPressure: 1 }, result: '模板好用，科长点名表扬' },
    { text: '补全旧账，维持老格式', effects: { background: 1, eq: 1 }, result: '旧格式过关，效率稳' },
    { text: '请老张一起补，分工明确', effects: { eq: 1, peopleReputation: 1 }, result: '配合顺畅，台账如期' },
    { text: '先拖一拖，等考核通知再说', effects: { risk: 1, mentalPressure: 1 }, result: '通知来了，时间紧了一倍' }
  ] },
  { id: 'enw264', stage: 'work', eventType: 'choice', weight: 3, era: ['stable'], pools: ['public'], title: '编制稳定的日常', text: '平稳年代，编制盘子三年未动。科室里有人调走有人到龄，空出的职数按惯例年底才动。你被拉着讨论"谁该顶上去"。', choices: [
    { text: '按资历顺序给意见', effects: { eq: 1, reputation: 1 }, result: '意见稳妥，方案可行' },
    { text: '建议按实绩破一次例', effects: { workAbility: 2, integrity: 1, heat: 1 }, result: '破例建议被议了两轮' },
    { text: '不参与，避免得罪人', effects: { background: -1, mentalPressure: -1 }, result: '躲开了是非，也躲开了机会' },
    { text: '把年轻人推荐到前面', effects: { eq: 2, peopleReputation: 2 }, result: '举贤获赞，年轻人记你的好' }
  ] }
];