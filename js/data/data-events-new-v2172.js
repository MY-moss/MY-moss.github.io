// ==================== v2.1.72 事件与玩法短板补强包（enw248-253 / enl176-186 / enc123-133，28 事件七线） ====================
// v2.1.72 审计驱动：①选调生/队伍建设全库 0 条；②考察-公示-试用静态事件仅 3；
// ③life 55+ 老年专窗为 0；④midcareer 剧本零散件；⑤stable era career 为 0；
// ⑥生活最薄场景（旅行/宠物/运动）；⑦结局主题支撑最弱（estranged_hero/skyline）。
// 全部走既有效果键白名单、无新 flag、era 用数组格式；剧本散件按 scenario 字段入专属池。
const gd_events_new_v2172 = [
  // ---------- 1. 选调生与队伍建设 ×4 ----------
  { id: 'enw248', stage: 'work', eventType: 'choice', weight: 4, excludeFlag: 'grassrootsActive', requireRankMax: 2, requireUnitLevelMin: 1, year: [22, 30], title: '年轻干部驻村选派', text: '组织股下发两年驻村锻炼征集通知。你刚在机关业务上摸到门道，去乡镇却要重新熟悉农户、村账和驻点生活。名额自愿报名，原岗位保留。', choices: [
    { text: '主动申请两年驻村，按程序交接工作', effects: { workAbility: 2, peopleReputation: 2, familyPressure: 2, flag: 'selectedVillage', grassrootsDispatch: {duration:2, reason:'年轻干部驻村选派'} }, result: '组织同意选派，你办理交接，正式到乡镇报到；期满仍需组织考核。' },
    { text: '先提出个人困难，争取留机关一年', effects: { background: 1, eq: 1, familyPressure: -2 }, result: '个人困难已登记，此次暂不派驻，今后仍可重新申请' },
    { text: '向组织股了解培养路径再决定', effects: { iq: 1, background: 1 }, result: '路径摸清，选择更主动' },
    { text: '先看看同期同学怎么选的', effects: { eq: 1, background: -1 }, result: '随大流，慢了半拍' }
  ] },
  { id: 'enc123', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [24, 40], title: '中央选调初选', text: '中央机关面向基层选调优秀年轻干部的初选名单公布了，你的名字在列。初选只是入围，后面还有笔试面试和差额考察。', choices: [
    { text: '全力备考，把初选当跳板', effects: { iq: 1, workAbility: 1, mentalPressure: 3, background: 1 }, result: '笔试出色，进入了差额考察' },
    { text: '先告之本单位领导，争取支持', effects: { background: 1, eq: 1 }, result: '领导点头放行，程序顺畅' },
    { text: '连夜准备但不声张', effects: { iq: 1, mentalPressure: 2, background: -1 }, result: '低调备考，名次却不如预期' },
    { text: '主动退出选调，留下完成本单位的未结项目', effects: { peopleReputation: 2, workAbility: 1, desire: -2, mentalPressure: -2 }, result: '选调机会留给了别人，未结项目终于完成交接' }
  ] },
  { id: 'enc124', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 4, year: [26, 45], title: '公选竞岗', text: '本级公开选拔科级岗位，报名条件你刚够线。竞岗要笔试、演讲加答辩，评委里还有两名你不认识的外单位领导。', choices: [
    { text: '认真准备演讲稿和案例素材', effects: { workAbility: 2, reputation: 1, mentalPressure: 2 }, result: '现场发挥稳健，评委给了高分' },
    { text: '找参加过竞岗的同事取经', effects: { eq: 1, background: 1 }, result: '套路摸透，少走弯路' },
    { text: '展示个性风格，与众不同', effects: { iq: 1, background: 1, risk: 1 }, result: '风格记住了，分数看评委' },
    { text: '顺其自然，能上就上', effects: { mentalPressure: -1, background: -1 }, result: '心态好，成绩平平' }
  ] },
  { id: 'enw249', stage: 'work', eventType: 'choice', weight: 4, requireUnitLevelMax: 0, requireFlag: 'selectedVillage', year: [22, 32],  title: '驻村阶段复盘', text: '驻村第一年结束，村里的水渠维修还差最后一道验收，原单位又催你提交阶段总结。你在村部整理材料，手机里是家人问你什么时候能完整地过一个周末。', choices: [
    { text: '在村里完成水渠验收，按期交阶段报告', effects: { workAbility: 2, peopleReputation: 2, background: 1 }, result: '一期验收完成。剩余工作仍由驻村团队跟进，返岗安排待期满考核。' },
    { text: '把已完成事项写成清楚的阶段移交', effects: { background: 1, reputation: 1, peopleReputation: -1 }, result: '交接材料齐全，期满时的去留仍由组织决定。' },
    { text: '协调原单位远程审核，继续驻村工作', effects: { workAbility: 2, mentalPressure: 3 }, result: '你用几次视频会议把两端进度拉齐，辛苦却没有耽误现场工作。' },
    { text: '提交下一年度重点项目与人员接续建议', effects: { background: 1, eq: 1 }, result: '项目接续方案已报送，是否延长派驻还需组织另行决定。' }
  ] },
  // ---------- 2. 考察-公示-试用闭环 ×4 ----------
  { id: 'enc125', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, requireFlag: 'cadreInquiry', year: [30, 52], title: '任职考察谈话深化', text: '民主推荐结束后，考察组增加了第二轮深谈：要求你提供近三年经手项目的得失清单，并约谈两名与你合作过的同事。', choices: [
    { text: '清单如实列，得失都写', effects: { integrity: 2, background: 2, mentalPressure: 1 , flag: 'cadreDossier'}, result: '考察组收下了原始材料，是否推荐仍需集体研究' },
    { text: '重点突完成绩，风险一笔带过', effects: { background: 1, risk: 1 , flag: 'cadreDossier'}, result: '成绩亮眼，经手风险被追问' },
    { text: '主动约谈同事，把话先说透', effects: { eq: 2, background: 1 , flag: 'cadreDossier'}, result: '同事补充了不同视角，考察组要求把分歧也记入材料' },
    { text: '请人点拨谈话口径', effects: { eq: 1, background: -1, risk: 1 , flag: 'cadreDossier'}, result: '口径统一了，痕迹也重了' }
  ] },
  { id: 'enc126', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, requireFlag: 'cadreDossier', year: [30, 55], title: '考察材料中的异议', text: '第二轮考察材料递上去不久，组织部门收到对你三年前经手项目的一封异议信。纸上没有具体署名，只有一处被红笔圈出的审批日期。工作人员请你在规定期限内补充书面说明，任用讨论暂缓。', choices: [
    { text: '主动向组织说明当时情况并提供材料', effects: { integrity: 3, background: 1, mentalPressure: 2 , flag: 'cadreOpenReview'}, result: '材料送交核查组，最终结论尚需等待' },
    { text: '实名请求组织复核该事项', effects: { integrity: 2, workAbility: 1 , flag: 'cadreOpenReview'}, result: '你要求按原始记录独立核对，而不是提前宣布无问题' },
    { text: '托人了解异议信来源再应对', effects: { eq: 1, background: 1, risk: 2 , flag: 'cadreQuietReview'}, result: '来源打听到了，动作也慢了' },
    { text: '静默处理，等公示期自动过去', effects: { mentalPressure: 2, background: -1, risk: 1 , flag: 'cadreQuietReview'}, result: '几个月过去，核查并不会因沉默自动结束' }
  ] },
  { id: 'enc127', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, requireFlag: 'cadreOpenReview', year: [30, 55], title: '异议复核的补正通知', text: '复核组核对了原始台账，认定当年存在材料归档不完整的问题，但目前没有证据证明违规获利。推荐程序因此暂缓，组织要求补齐证据并明确今后的风险控制责任。', choices: [
    { text: '接受暂缓，把流程问题整改到位', effects: { integrity: 2, workAbility: 2, background: -1, mentalPressure: 2 , flag: 'cadreReviewClosed'}, result: '整改清单得到确认，但新的推荐仍需重新考察' },
    { text: '申请补充说明，争取原有安排', effects: { eq: 1, background: 1, risk: 1 , flag: 'cadreReviewClosed'}, result: '补充说明纳入复核卷宗，任用决定仍由组织作出' },
    { text: '公开整改报告后请求重新启动', effects: { integrity: 2, peopleReputation: 1 , flag: 'cadreReviewClosed'}, result: '整改方案公开，单位启动内部流程检查' },
    { text: '承认失误，主动要求后补历练', effects: { integrity: 1, workAbility: 1, background: -1 , flag: 'cadreReviewClosed'}, result: '你申请交流锻炼，未来是否获推荐仍未确定' }
  ] },
  { id: 'enc128', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, requireFlag: 'cadreReviewClosed', year: [32, 55], title: '复核之后的履历', text: '当年的任用讨论没有直接变成一纸任命。一年后，组织要求你重新填写发展方向和整改进展。你发现履历里最难写的不是成绩，而是如何解释一份曾经缺页的材料。', choices: [
    { text: '填管理型方向并附三年设想', effects: { background: 2, positionWeight: 1, mentalPressure: 2 }, result: '设想作为干部培养参考，提拔仍需竞争' },
    { text: '填业务型方向，明确深耕线', effects: { workAbility: 2, reputation: 1 }, result: '业务深耕获认可' },
    { text: '不填，交由组织安排', effects: { background: -1, eq: 1 }, result: '暂时没有新推荐，你仍需把本职工作做好' },
    { text: '先探领导口风再填', effects: { background: 1, integrity: -1 }, result: '口径对上了，风格没了' }
  ] },
  // 选择隐瞒/打听异议来源的路线，有独立后果，不能直接跳到公开补正的积极结果。
  { id: 'enc140', stage: 'career', eventType: 'choice', weight: 2, requireRankMin: 4, requireFlag: 'cadreQuietReview', year: [30, 60], title: '那份拖延的说明', text: '过了一年，组织再次来函催交当年项目的原始记录。那个曾替你打听消息的熟人已经调离，留下的只有一张没有签名的复印件。你的任职讨论仍停在原地。', choices: [
    { text: '补交真实档案，主动说明此前的迟延', effects: {flag: 'cadreReviewClosed', integrity: 2, risk: -2, mentalPressure: 2, background: -1}, result: '补交记录已经签收，但迟延本身仍记入复核说明。' },
    { text: '请原经办人协助重新核对时间线', effects: {flag: 'cadreReviewClosed', workAbility: 2, mentalPressure: 3, eq: 1}, result: '你们重新翻出老台账，找到几个此前无人注意的时间节点。' },
    { text: '继续依赖私人消息，希望不了了之', effects: {flag: 'cadreReviewClosed', risk: 5, integrity: -3, background: -2, mentalPressure: 3}, result: '正式核查并未停止，长期不回应让组织对你的评价更加谨慎。' }
  ] },
  { id: 'enl215', stage: 'life', eventType: 'choice', weight: 2, requireFlag: 'parentShared', year: [48, 76], title: '轮班表上的空位', text: '两年前你和参与照护的亲属定下轮班表。如今母亲的复诊日临时改期，原本负责陪诊的人又要出差。家族群里没有吵架，只是那个空白日期静静挂了一整晚。', choices: [
    { text: '自己调休补上这一天，之后重新议定轮班', effects: {setFlags:['parentCareReviewed','parentCareCover'], familyPressure:-2, mentalPressure:2, positionWeight:-1, eq:2}, result:'医院的走廊很长。你替大家补了这一次，也让每个人把下个月的安排写清楚。' },
    { text: '征求家人意见，合请可靠护工分担', effects: {setFlags:['parentCareReviewed','parentCareHire'], wealth:-12, familyPressure:-3, eq:1}, result:'费用由几家分摊，复诊没有耽误；你们开始认真讨论照护的可持续性。' },
    { text: '坚持原约定，由轮值者自行协调', effects: {setFlags:['parentCareReviewed','parentCareRigid'], familyPressure:3, mentalPressure:1, eq:-1}, result:'复诊最后还是有人陪了，但家族群里几天没人说话。' }
  ] },
  { id: 'enl216', stage: 'life', eventType: 'choice', weight: 2, requireFlag: 'parentCareReviewed', year: [50, 80], title: '五年后的病历袋', text: '整理家里的旧抽屉时，你发现父母的病历袋越来越厚，有些日期旁写着自己的名字，有些是其他亲人代签的。那些年各家都不容易，没人能把所有事情做得完美。今后怎样分担，已经比当年谁付出得多更重要。', choices: [
    { text: '把照护记录整理给全家，明确紧急联络与复诊计划', effects: {eq:2, familyPressure:-3, mentalPressure:1, workAbility:1}, result:'表格没有让亲情变得生硬，反而让每个人都知道什么时候该主动补位。' },
    { text: '保留固定探望，允许家人按各自生活重新分工', effects: {eq:2, familyPressure:-2, mentalPressure:-2, positionWeight:-1}, result:'你们不再为错过某一天互相指责，也不再把照护变成某一个人的责任。' },
    { text: '维持旧安排，先把工作上的事做完', effects: {positionWeight:1, familyPressure:3, mentalPressure:2}, result:'当晚没有人催你，但后来那条未读消息，你记了很久。' }
  ] },
  // 人物记忆：不是新的随机噪音，只有玩家当年作出的明确选择才会在几年后出现。
  { id: 'ent303', stage: 'work', eventType: 'choice', weight: 3, requireFlag: 'directorBoundary', requireContact: 'enemy_168', title: '联署表上的两个名字', text: '三年前你与张处长约定，过去的事不必私下清算，但今后的协作必须留痕。如今两个科室要联合署名一份整改报告，页尾的负责人栏里并排印着你们的名字。', choices: [
    { text: '逐项核对事实，保留双方共同签署的复盘记录', effects: {workAbility:2,integrity:2,mentalPressure:2,contactRelation:{id:'enemy_168',delta:15}}, result: '记录经得起核对，关系没有突然变亲密，但不再妨碍各自工作。' },
    { text: '只签自己负责部分，明确双方责任边界', effects: {integrity:2,eq:1,mentalPressure:1}, result: '职责划清楚了，既没有假装冰释前嫌，也没有让旧怨混进程序。' },
    { text: '坚持全部由对方签字，自己不再参与', effects: {positionWeight:-2,mentalPressure:-2,eq:-1}, result: '你暂时退出争议，错过了完成这项工作的一次机会。' }
  ] },
  { id: 'ent304', stage: 'work', eventType: 'choice', weight: 3, requireFlag: 'wangReconciled', requireContact: 'enemy_167', title: '王副科长的手写修改', text: '你和王副科长把当年的误会说开后，几年间各自忙碌。这次他把一份业务培训讲稿交给你，边角有密密麻麻的红字，其中一句正是你当年批评过的那个漏洞。', choices: [
    { text: '一起修订案例，邀请年轻同事参与讲解', effects: {eq:2,workAbility:2,peopleReputation:1,contactRelation:{id:'enemy_167',delta:10}}, result: '讨论了一下午，讲稿最后署上了两人的名字。' },
    { text: '尊重他的成果，只提供技术校对', effects: {integrity:2,mentalPressure:-1,contactRelation:{id:'enemy_167',delta:5}}, result: '你没有抢回当年的话语权，讲稿却因此更扎实。' },
    { text: '坚持由他独自完成，不再牵扯旧关系', effects: {mentalPressure:-2,eq:-1}, result: '双方保留礼貌的距离，团队失去了一次共同传授经验的机会。' }
  ] },
  { id: 'ent305', stage: 'work', eventType: 'choice', weight: 3, requireFlag: 'wangHostility', requireContact: 'enemy_167', title: '复核桌上的另一份记录', text: '两年前的民主测评之后，你和王副科长的分歧更深。今天复核组把两份相互矛盾的项目记录放在同一张桌上，请你们分别说明。每一个日期都能在系统里查到。', choices: [
    { text: '只核对事实和职责，不再评价他的能力', effects: {integrity:3,workAbility:1,mentalPressure:2,contactRelation:{id:'enemy_167',delta:12}}, result: '复核组没有评判私人恩怨，只按证据修正了材料。' },
    { text: '要求第三方参与复核，接受其独立结论', effects: {integrity:2,background:-1,mentalPressure:1}, result: '结论来得慢，却更难被任何一方否认。' },
    { text: '再次抓住对方失误，把争执带到会上', effects: {risk:3,reputation:-2,heat:2,contactRelation:{id:'enemy_167',delta:-15}}, result: '会场里声音很大，但真正需要核清的事实反而被盖住了。' }
  ] },
  { id: 'ent306', stage: 'life', eventType: 'choice', weight: 3, requireFlag: 'mentorRevisited', title: '郑教授留下的批注', text: '三年后，有人整理郑教授过去的讲义，发现一页写着你们曾讨论过的基层案例。那段字被反复修改，末尾只有一行：不要替后来者把结论写死。', choices: [
    { text: '把相关材料补充完整，留给新来的年轻同事', effects: {workAbility:2,eq:2,peopleReputation:1}, result: '讲义旁添了几页实际案例，年轻人读完后又提出了自己的疑问。' },
    { text: '给郑教授写信，说说当年的决定和这些年的变化', effects: {mentalPressure:-3,eq:2,contactRelation:{id:'mentor',delta:8}}, result: '信寄出后，你不再急着等待肯定的回话。' },
    { text: '保留讲义，继续埋头做自己的事', effects: {workAbility:1,mentalPressure:-1,eq:-1}, result: '纸张夹回书里。你仍记得那一句话，但暂时没有告诉别人。' }
  ] },
  { id: 'ent307', stage: 'work', eventType: 'choice', weight: 3, requireContact: 'mentor', title: '那场讲座的回信', text: '一年前郑教授约你到政策研究所交流。如今研究所寄来一封回信，里面夹着两页尚待确认的基层案例。你知道，它能否成为可靠的资料，还取决于你是否愿意核实。', choices: [
    { text: '补齐原始数据和责任单位，再提交研究所', effects: {workAbility:2,integrity:2,mentalPressure:2,contactRelation:{id:'mentor',delta:8}}, result: '附件经过几轮复核才被采用，讲座变成了可以借鉴的案例。' },
    { text: '请团队共同校对，署名和成果公开透明', effects: {eq:2,peopleReputation:2,mentalPressure:1}, result: '材料交出去时，你把参与者的名字都留在了末页。' },
    { text: '只挑有利于自己履历的部分汇报', effects: {background:1,integrity:-2,risk:2}, result: '材料得到短暂关注，后续追问却让你难以解释删掉的部分。' }
  ] },
  { id: 'ent308', stage: 'work', eventType: 'choice', weight: 4, excludeContact: 'mentor', year: [26, 48], title: '研讨会后的一页笔记', text: '市里组织政策研讨，台上讲课的郑教授不讲空话，而是拿一张基层服务流程图问：这里谁还在排队？你看见好几位干部低头翻材料。散会后他还站在白板前，等着有人继续问。', choices: [
    { text: '拿出经手的真实案例，与他讨论责任边界', effects: {flag:'mentorMet',contact:{id:'mentor',name:'郑教授',position:'高校教授与政策研究者',relation:65,description:'在政策研讨会上与你讨论过基层公共服务的责任边界'},workAbility:2,mentalPressure:1}, result:'郑教授在你的材料上留了联系方式，约你之后把复核结果再告诉他。' },
    { text: '留下帮忙整理提问清单，约定日后核实答复', effects: {flag:'mentorMet',contact:{id:'mentor',name:'郑教授',position:'高校教授与政策研究者',relation:55,description:'在政策研讨会上与你整理过基层案例的提问清单'},eq:2,workAbility:1}, result:'他看完清单，把“尚未答复”四个字圈了起来，提醒你别为了漂亮结论删掉问题。' },
    { text: '听完就回去处理积压任务，不再留下', effects: {workAbility:1,mentalPressure:1}, result:'报告发了出去。那张没讨论完的流程图，你后来偶尔还会想起。' }
  ] },
  // ---------- 3. 老年生活线 ×5（year 下限 ≥55 破冰） ----------
  { id: 'enl176', stage: 'life', eventType: 'choice', weight: 4, year: [55, 72], title: '晨练棋友', text: '工作节奏渐渐放缓。周末清晨，公园石桌边的象棋摊成了你的固定去处。老周棋臭但话多，老李棋精却总让半先。你坐在旁边看了一个月，今天有人让了位置。', choices: [
    { text: '坐下杀几盘，输赢都开心', effects: { body: 1, mentalPressure: -2, familyPressure: -1 }, result: '棋盘上赢不了人生，却赢回了笑声' },
    { text: '只观棋不谈棋，保持距离', effects: { mentalPressure: -1, peopleReputation: -1 }, result: '独来独往，公园的椅子空一半' },
    { text: '带一壶茶去，慢慢融进圈子', effects: { eq: 2, peopleReputation: 1 }, result: '茶香开了话匣子，圈子里有了你的位置' },
    { text: '教两个年轻人下棋', effects: { eq: 1, reputation: 1, body: 1 }, result: '收了两个学生，公园角落热闹了' }
  ] },
  { id: 'enl177', stage: 'life', eventType: 'choice', weight: 4, requireChild: true, requireChildAgeMin: 18, year: [55, 72], title: '隔代带孙', text: '子女和他们的伴侣都忙，三岁的孙辈每周有三天送到你这里。你年轻时带孩子是"放养"，现在带孙辈却总觉得怕磕着碰着。', choices: [
    { text: '拿出当年带孩子的经验来', effects: { familyPressure: 1, eq: 1 }, result: '经验管用，孙女和你最亲' },
    { text: '专门学些育儿知识，紧跟新理念', effects: { iq: 1, familyPressure: -1 }, result: '新理念上手，儿媳也放心了' },
    { text: '和子女商量照看规则，各退一步', effects: { eq: 2, familyPressure: -1 }, result: '边界谈清，接送愉快' },
    { text: '明确每周最多照看一天，留下时间给自己的生活', effects: { familyPressure: -3, mentalPressure: -2, eq: -1 }, result: '儿媳一开始有点失落，后来商量出了新的接送表' }
  ] },
  { id: 'enl178', stage: 'life', eventType: 'choice', weight: 3, year: [55, 72], title: '老年兴趣社团', text: '社区新开了书法和合唱两个老年班，报名表上写"名额有限，先到先得"。年轻时你两个都想学，都没学成。', choices: [
    { text: '报书法班，圆年轻时的手痒', effects: { iq: 1, mentalPressure: -1 }, result: '第一幅作品被老伴裱了起来' },
    { text: '报合唱班，找回年轻时的嗓子', effects: { eq: 1, peopleReputation: 1 }, result: '合唱团年会展演，你站了第一排' },
    { text: '两个都报，下半年再看', effects: { body: 1, mentalPressure: 2 }, result: '两头忙，忙出精气神' },
    { text: '只围观，不报名', effects: { mentalPressure: 1, body: -1 }, result: '围观了一学期，手和嗓子都闲着' }
  ] },
  { id: 'enl179', stage: 'life', eventType: 'choice', weight: 3, year: [55, 75], title: '老友送别', text: '多年的老友确诊重病住院，医生说时间不多了。他年轻时是单位的笔杆子，写过的材料比你跳过的槽还多。', choices: [
    { text: '常去陪护，帮他把想写的东西整理完', effects: { eq: 3, familyPressure: 2, mentalPressure: 1 }, result: '他走前留下最后一篇文字，署名里带上了你' },
    { text: '组织老同事探望，让他热闹地走', effects: { eq: 2, peopleReputation: 2 }, result: '病房里笑声多于泪水' },
    { text: '替他跑一趟他一直想去的地方', effects: { wealth: -2, eq: 2 }, result: '照片带回来，他看了很久' },
    { text: '托护理照顾好，自己少去', effects: { familyPressure: 1, mentalPressure: 1 }, result: '心里放不下，遗憾也留下了' }
  ] },
  { id: 'enl180', stage: 'life', eventType: 'choice', weight: 4, year: [55, 80], title: '慢病管理', text: '体检报告上血压、血糖、血脂三项都亮了黄灯。医生说得长期管理：吃药、管嘴、迈腿，一样都不能少。', choices: [
    { text: '制定健康计划，严格执行', effects: { body: 2, mentalPressure: -1 }, result: '半年后复检，指标明显回落' },
    { text: '遵医嘱吃药，饮食随缘', effects: { body: 1, familyPressure: 1 }, result: '药吃着，嘴还馋着' },
    { text: '每天一万步，从今天开始', effects: { body: 2 }, result: '步数上去了，膝盖先抗议' },
    { text: '听人说偏方，试试看', effects: { body: -2, luck: -1 }, result: '偏方误人，指标不降反升' }
  ] },
  // ---------- 4. 剧本散件 ×4（midcareer/retired/family 专属池） ----------
  { id: 'enw250', stage: 'work', eventType: 'choice', weight: 5, scenario: 'midcareer', year: [35, 48], title: '转岗适应期', text: '中年转岗后的第一个季度，新单位的人称呼你"老同志"，却总在关键环节把你当新人。带头主任开会时说"转岗的要重新立规矩"。', choices: [
    { text: '放下身段从零学起，把旧经验藏起来', effects: { workAbility: 2, eq: 1, mentalPressure: 1 }, result: '三个月后，主任开始让你带新人' },
    { text: '亮出旧经验，帮新单位少走弯路', effects: { workAbility: 2, reputation: 1, eq: -1 }, result: '经验管用，风头也出了' },
    { text: '先摸清新单位权力地图再发力', effects: { iq: 2, background: 1 }, result: '半年布局，站住了脚' },
    { text: '低调蛰伏，只做分内事', effects: { mentalPressure: -1, background: -1 }, result: '稳定无过，上升无门' }
  ] },
  { id: 'enw251', stage: 'work', eventType: 'choice', weight: 5, scenario: 'midcareer', year: [36, 50], title: '新单位站稳脚跟', text: '转岗一年，新单位年终述职轮到你。过去一年的成绩单上，有旧领域的积累，也有新领域的试水。述职时怎么摆？', choices: [
    { text: '新旧两条腿都讲，讲透变化', effects: { workAbility: 2, reputation: 2, mentalPressure: 2 }, result: '述职被赞"转岗转出了新高度"' },
    { text: '重点讲新领域，旧成果谦让', effects: { eq: 2, background: 1 }, result: '姿态低，评价高' },
    { text: '把旧领域成果包装成新打法', effects: { iq: 1, reputation: 1, risk: 1 }, result: '包装被识破一半，好在底子实在' },
    { text: '如实汇报磨合期的磕碰', effects: { integrity: 2, background: -1 }, result: '真诚换理解，岗位稳了' }
  ] },
  { id: 'enl181', stage: 'life', eventType: 'choice', weight: 4, scenario: 'retired', year: [50, 65], title: '慢下来的头三个月', text: '岗位分工调整后，周末终于不再被会议占满。第一个月你睡到自然醒，第二个月又觉得空。第三个月的清晨，你站在窗口看楼下来往的行人，突然不知道该从哪件事重新开始。', choices: [
    { text: '把以前没时间做的清单挨个做一遍', effects: { iq: 1, eq: 1, mentalPressure: -2 }, result: '清单越做越短，生活越填越满' },
    { text: '重拾年轻时的爱好，从零开始', effects: { eq: 2, body: 1 }, result: '爱好成了新身份' },
    { text: '找老朋友组常聚的局', effects: { eq: 1, peopleReputation: 1 }, result: '老友常聚，日子有烟火气' },
    { text: '宅家看手机，等孩子回来', effects: { mentalPressure: 1, body: -1 }, result: '屋子安静，心也安静不下来' }
  ] },
  { id: 'enl182', stage: 'life', eventType: 'choice', weight: 5, requireMarried: true, requireChild: true, scenario: 'family', year: [35, 55], title: '中年家庭危机', text: '你在单位的晋升关键期撞上了家里的多事之秋：父母接连住院、孩子升学压力大、配偶的工作也出了变数。谁先谁后？', choices: [
    { text: '家庭优先，向单位说明请一段假', effects: { familyPressure: -2, eq: 2, positionWeight: -1 }, result: '家稳了，单位里的位置等了你半年' },
    { text: '工作优先，家里靠爱人撑住', effects: { positionWeight: 1, familyPressure: 3 }, result: '晋升上了，家里的怨气也攒下了' },
    { text: '公开向组织说明困难，争取弹性安排', effects: { integrity: 2, background: 1, mentalPressure: 1 }, result: '组织给弹性，两头都顾上了' },
    { text: '两头硬扛，都不缺席', effects: { body: -2, mentalPressure: 3, familyPressure: 1 }, result: '都顾着，都透支着' }
  ] },
  // ---------- 5. stable era career ×3 ----------
  { id: 'enc129', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, era: ['stable'], year: [28, 55], title: '编制常规核查', text: '平稳年代，机构编制委员会开展常规核查：编制数、实有人数、编外人员一个都不能少。你们单位退休两人未减编，台账上多出两个"影子岗位"。', choices: [
    { text: '如实上报并推动减编', effects: { integrity: 2, workAbility: 1, positionWeight: -1 }, result: '减编到位，台账清爽' },
    { text: '先补材料说明历史原因', effects: { eq: 1, background: 1 }, result: '说明被采信，岗位暂留' },
    { text: '主动核对编外岗位性质，建议按公开程序重新核定', effects: { workAbility: 2, integrity: 2, mentalPressure: 2 }, result: '岗位没有被悄悄转正，但编外人员的合同与待遇得到核查' },
    { text: '压着不报，等核查组提醒', effects: { risk: 2, background: -1 }, result: '核查组来了两次，你记了两次' }
  ] },
  { id: 'enc130', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 4, era: ['stable'], year: [26, 50], title: '年度考核稳定版', text: '平稳年代的年终考核没有改革年那么剑拔弩张，指标就是那几个老科目。你发现同事们都心照不宣地留着"进步空间"。', choices: [
    { text: '按老科目踏实完成，不折腾', effects: { workAbility: 1, reputation: 1 }, result: '四平八稳，年年称职' },
    { text: '自加一项创新指标，破破例', effects: { workAbility: 2, background: 1, heat: 1 }, result: '创新项被表扬，也打破了平衡' },
    { text: '帮同事补短板，攒人情', effects: { eq: 2, peopleReputation: 1 }, result: '人情攒下，关键时候有回应' },
    { text: '把往年材料改改日期交差', effects: { mentalPressure: -1, risk: 1, integrity: -1 }, result: '交得快，被归档得也快' }
  ] },
  { id: 'enc131', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, era: ['stable'], year: [32, 55], title: '资历排队谈话', text: '安稳年代，提拔讲资历排队。你在队列里的名次靠前，但前面还有两位"到点该动"的老同志。领导找你谈话，暗示今年先照顾老同志。', choices: [
    { text: '表态理解，来年优先', effects: { eq: 2, background: 1, mentalPressure: 1 }, result: '姿态高，队列下轮就到你' },
    { text: '委婉提出自己的工作实绩', effects: { background: 1, reputation: 1 }, result: '实绩被认可，排队规则微调' },
    { text: '接受安排，同时争取兼任锻炼', effects: { workAbility: 1, background: 1 }, result: '兼任岗位补了资历' },
    { text: '私下活动争取挤掉前位', effects: { background: 1, risk: 3, eq: -1 }, result: '挤上去了，风声也大了' }
  ] },
  // ---------- 6. 生活场景补件 ×4 ----------
  { id: 'enl183', stage: 'life', eventType: 'choice', weight: 4, year: [26, 60], title: '跟团旅行', text: '单位工会组织的疗养团建定了三条线路：海边的、山里的、古城的。费用工会出一半，另一半自费。', choices: [
    { text: '选海边，好好休一次假', effects: { body: 1, mentalPressure: -2, wealth: -5 }, result: '海边回来，肩上的压力轻了些' },
    { text: '选古城，顺路访当年同学', effects: { eq: 1, peopleReputation: 1, wealth: -5 }, result: '老同学重逢，路线值回票价' },
    { text: '选山里，把娃也带上', effects: { familyPressure: -1, eq: 1, wealth: -6 }, result: '亲子游山，两全其美' },
    { text: '不去，把名额让给同事', effects: { eq: 1, body: -1, mentalPressure: 1 }, result: '人情落了，自己没歇上' }
  ] },
  { id: 'enl184', stage: 'life', eventType: 'choice', weight: 3, year: [24, 65], title: '宠物就医', text: '养了三年的宠物狗夜里突然呕吐不止，宠物医院急诊报价让钱包一紧：检查加治疗，够买一台新手机。', choices: [
    { text: '花钱治好它，值', effects: { wealth: -15, familyPressure: -1, eq: 1 }, result: '宠物活了，钱包瘪了，心里暖了' },
    { text: '先检查再决定治不治', effects: { wealth: -8, iq: 1 }, result: '检查结果比预想乐观，小治即愈' },
    { text: '找相熟兽医商量方案', effects: { eq: 1, wealth: -6 }, result: '熟人给了实在方案' },
    { text: '托人照看几天，观察观察', effects: { wealth: -2, body: 0, mentalPressure: 1 }, result: '拖了两天，炎症加重了' }
  ] },
  { id: 'enl185', stage: 'life', eventType: 'choice', weight: 3, year: [24, 60], title: '球局与泳卡', text: '同事组了个周末球局，场地费 AA；同街道新开了游泳馆，年卡打七折。两个都想办，钱包只够一个。', choices: [
    { text: '选球局，社交和运动兼得', effects: { body: 1, eq: 1, peopleReputation: 1 }, result: '球局成了固定社交场' },
    { text: '选泳卡，运动更规律', effects: { body: 2, wealth: -3 }, result: '每周三次，体检报告最先受益' },
    { text: '两个都报，周中周末分开', effects: { body: 2, wealth: -6, mentalPressure: 1 }, result: '日程满，精神好' },
    { text: '都缓缓，等明年再说', effects: { body: -1 }, result: '明年，钱包和身体各安其位' }
  ] },
  // ---------- 7. 结局主题支撑 ×4（estranged_hero / skyline） ----------
  { id: 'enw252', stage: 'work', eventType: 'choice', weight: 4, year: [30, 55], title: '被误解仍守原则', text: '一项改革措施你坚持按原则执行，动了几个利益方的蛋糕。座谈会上有人公开质疑你"教条"，你注意到支持者都在沉默。', choices: [
    { text: '逐条解释依据，不争辩只摆事实', effects: { integrity: 3, workAbility: 1, peopleReputation: -1 }, result: '质疑声少了，代价是人缘淡了' },
    { text: '坚持原则，同时公开承诺试点纠偏', effects: { integrity: 2, eq: 1, mentalPressure: 2 }, result: '纠偏承诺稳住中间派' },
    { text: '拉上支持者一起表态', effects: { eq: 1, background: 1, risk: 1 }, result: '阵营浮现，是非也分明了' },
    { text: '低头服软，先过了这关再说', effects: { eq: 1, integrity: -2, risk: 1 }, result: '关过了，原则打折了' }
  ] },
  { id: 'enw253', stage: 'work', eventType: 'choice', weight: 4, year: [32, 58], title: '独自扛下压力', text: '一个跨部门协调会开到晚上九点，其他部门都留着后手，只有你把自己负责部分的底线亮了出来。散会后，有人说你"太冲动"。', choices: [
    { text: '把底线写进会议纪要，公开留痕', effects: { integrity: 2, reputation: 1, heat: 1 }, result: '纪要可查，谁都不能翻案' },
    { text: '会后逐部门解释，争取理解', effects: { eq: 2, peopleReputation: 1, mentalPressure: 2 }, result: '理解拉回一半' },
    { text: '找分管领导背书后再推进', effects: { background: 2, workAbility: 1 }, result: '有背书，推进更顺' },
    { text: '先斩后奏，把事情办成再说', effects: { workAbility: 1, risk: 2, integrity: -1 }, result: '办成了，程序补得忐忑' }
  ] },
  { id: 'enc132', requireRankMin: 5, stage: 'career', eventType: 'choice', weight: 5, year: [40, 60], title: '统筹全局的高光', text: '一次重要活动由你统筹：十余个环节、上百名工作人员、两位外请嘉宾。彩排当天，主要嘉宾的航班延误了四小时。', choices: [
    { text: '临场重排时间表，把流程打散重组', effects: { workAbility: 3, eq: 1, mentalPressure: 3 }, result: '活动准点开始，领导问"谁统筹的"' },
    { text: '启用备用嘉宾顺序预案', effects: { iq: 1, workAbility: 2 }, result: '预案顶上，有惊无险' },
    { text: '现场协调嘉宾关系，稳住情绪', effects: { eq: 2, background: 1 }, result: '嘉宾满意，通稿里有你的名字' },
    { text: '让执行团队自行处理，你盯全局', effects: { eq: 1, workAbility: 1, risk: 1 }, result: '各有分工，漏了一环' }
  ] },
  { id: 'enc133', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [38, 62], title: '临危受命', text: '分管领导突然住院，一项上级限期任务落在你肩上——你名义上是"临时主持"，实际上所有责任都在你这里。', choices: [
    { text: '接下任务，列出责任清单上报', effects: { integrity: 2, workAbility: 2, positionWeight: 1, mentalPressure: 3 }, result: '责任清单清晰，任务按期完成，转正顺理成章' },
    { text: '先请示明确授权边界再干', effects: { background: 2, workAbility: 1 }, result: '授权到位，干得名正言顺' },
    { text: '拉上班子成员共同担责', effects: { eq: 2, background: 1 }, result: '集体担责，个人亮点少了点' },
    { text: '保底完成关键项，其余顺延', effects: { workAbility: 1, risk: 2 }, result: '关键项保住了，顺延项被点名' }
  ] }
];