// ==================== v2.1.72 事件与玩法短板补强包（enw248-253 / enl176-186 / enc123-133，28 事件七线） ====================
// v2.1.72 审计驱动：①选调生/队伍建设全库 0 条；②考察-公示-试用静态事件仅 3；
// ③life 55+ 老年专窗为 0；④midcareer 剧本零散件；⑤stable era career 为 0；
// ⑥生活最薄场景（旅行/宠物/运动）；⑦结局主题支撑最弱（estranged_hero/skyline）。
// 全部走既有效果键白名单、无新 flag、era 用数组格式；剧本散件按 scenario 字段入专属池。
const gd_events_new_v2172 = [
  // ---------- 1. 选调生与队伍建设 ×4 ----------
  { id: 'enw248', stage: 'work', eventType: 'choice', weight: 4, year: [22, 30], title: '选调生入职报到', text: '你是今年新入职的选调生，报到第一天，组织股给你发了驻村两年的安排表——和你在校时想象的"坐办公室"不太一样。', choices: [
    { text: '爽快接下驻村安排，把基层当第一课', effects: { workAbility: 2, peopleReputation: 2, familyPressure: 2 }, result: '驻村两年日志写满，组织股记住了你' },
    { text: '先提出个人困难，争取留机关一年', effects: { background: 1, eq: 1, familyPressure: -2 }, result: '缓了一年，基层课补上了' },
    { text: '向组织股了解培养路径再决定', effects: { iq: 1, background: 1 }, result: '路径摸清，选择更主动' },
    { text: '先看看同期同学怎么选的', effects: { eq: 1, background: -1 }, result: '随大流，慢了半拍' }
  ] },
  { id: 'enc123', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, year: [24, 40], title: '中央选调初选', text: '中央机关面向基层选调优秀年轻干部的初选名单公布了，你的名字在列。初选只是入围，后面还有笔试面试和差额考察。', choices: [
    { text: '全力备考，把初选当跳板', effects: { iq: 1, workAbility: 1, mentalPressure: 3, background: 1 }, result: '笔试出色，进入了差额考察' },
    { text: '先告之本单位领导，争取支持', effects: { background: 1, eq: 1 }, result: '领导点头放行，程序顺畅' },
    { text: '连夜准备但不声张', effects: { iq: 1, mentalPressure: 2, background: -1 }, result: '低调备考，名次却不如预期' },
    { text: '评估两家单位再决定是否退出', effects: { eq: 1, background: 1 }, result: '审慎评估，进退有据' }
  ] },
  { id: 'enc124', requireRankMin: 2, stage: 'career', eventType: 'choice', weight: 4, year: [26, 45], title: '公选竞岗', text: '本级公开选拔科级岗位，报名条件你刚够线。竞岗要笔试、演讲加答辩，评委里还有两名你不认识的外单位领导。', choices: [
    { text: '认真准备演讲稿和案例素材', effects: { workAbility: 2, reputation: 1, mentalPressure: 2 }, result: '现场发挥稳健，评委给了高分' },
    { text: '找参加过竞岗的同事取经', effects: { eq: 1, background: 1 }, result: '套路摸透，少走弯路' },
    { text: '展示个性风格，与众不同', effects: { iq: 1, background: 1, risk: 1 }, result: '风格记住了，分数看评委' },
    { text: '顺其自然，能上就上', effects: { mentalPressure: -1, background: -1 }, result: '心态好，成绩平平' }
  ] },
  { id: 'enw249', stage: 'work', eventType: 'choice', weight: 4, year: [22, 32], pools: ['基层单位'], title: '选调生基层锻炼期', text: '选调生基层锻炼一年期满，村里人已经把你当"自己人"，但原单位催你回去报一篇署名材料。两边都放不下。', choices: [
    { text: '留下把村里的产业项目跟到底', effects: { workAbility: 2, peopleReputation: 2, background: 1 }, result: '项目落地，组织看到你啃硬骨头的本事' },
    { text: '按计划回去，基层经历写进总结', effects: { background: 1, reputation: 1, peopleReputation: -1 }, result: '按期返回，村口的大娘有点失落' },
    { text: '回去报材料的同时兼任驻村联络', effects: { workAbility: 2, mentalPressure: 3 }, result: '两头挂，两边都念你' },
    { text: '请组织协调延长锻炼期', effects: { background: 1, eq: 1 }, result: '延期获批，基层资历更厚' }
  ] },
  // ---------- 2. 考察-公示-试用闭环 ×4 ----------
  { id: 'enc125', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [30, 52], title: '任职考察谈话深化', text: '民主推荐结束后，考察组增加了第二轮深谈：要求你提供近三年经手项目的得失清单，并约谈两名与你合作过的同事。', choices: [
    { text: '清单如实列，得失都写', effects: { integrity: 2, background: 2, mentalPressure: 1 }, result: '考察组说"材料经得起翻"' },
    { text: '重点突完成绩，风险一笔带过', effects: { background: 1, risk: 1 }, result: '成绩亮眼，经手风险被追问' },
    { text: '主动约谈同事，把话先说透', effects: { eq: 2, background: 1 }, result: '同事口径一致，考察顺利' },
    { text: '请人点拨谈话口径', effects: { eq: 1, background: -1, risk: 1 }, result: '口径统一了，痕迹也重了' }
  ] },
  { id: 'enc126', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [30, 55], title: '拟任公示异议', text: '拟任人选公示第三天，组织部门收到一封匿名异议信，内容指向你三年前一个项目里的"程序瑕疵"。公示期还剩四天。', choices: [
    { text: '主动向组织说明当时情况并提供材料', effects: { integrity: 3, background: 1, mentalPressure: 2 }, result: '材料自证，公示如期通过' },
    { text: '实名请求组织复核该事项', effects: { integrity: 2, workAbility: 1 }, result: '复核明确不存在问题，异议撤销' },
    { text: '托人了解异议信来源再应对', effects: { eq: 1, background: 1, risk: 2 }, result: '来源打听到了，动作也慢了' },
    { text: '静默处理，等公示期自动过去', effects: { mentalPressure: 2, background: -1, risk: 1 }, result: '公示期满照常通过，风声却留着' }
  ] },
  { id: 'enc127', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 4, year: [30, 55], title: '公示复核与撤回', text: '组织复核认定异议部分属实：你当年确有工作流程走得不规范，虽不构成问题，但按程序本次拟任暂缓。', choices: [
    { text: '接受暂缓，把流程问题整改到位', effects: { integrity: 2, workAbility: 2, background: -1, mentalPressure: 2 }, result: '半年后重新进入推荐名单' },
    { text: '申请补充说明，争取原有安排', effects: { eq: 1, background: 1, risk: 1 }, result: '说明被采纳，次月重新公示' },
    { text: '公开整改报告后请求重新启动', effects: { integrity: 2, peopleReputation: 1 }, result: '整改报告获好评，程序重启' },
    { text: '承认失误，主动要求后补历练', effects: { integrity: 1, workAbility: 1, background: -1 }, result: '后补历练一年，再提再察' }
  ] },
  { id: 'enc128', requireRankMin: 4, stage: 'career', eventType: 'choice', weight: 5, year: [32, 55], title: '试用期转正考核', text: '新岗位试用期将满，转正考核表上周送到你桌上。分管领导在"发展方向"栏留了空格——那是给你自己填的位置。', choices: [
    { text: '填管理型方向并附三年设想', effects: { background: 2, positionWeight: 1, mentalPressure: 2 }, result: '设想进了后备库' },
    { text: '填业务型方向，明确深耕线', effects: { workAbility: 2, reputation: 1 }, result: '业务深耕获认可' },
    { text: '不填，交由组织安排', effects: { background: -1, eq: 1 }, result: '组织替你填了"综合"二字' },
    { text: '先探领导口风再填', effects: { background: 1, integrity: -1 }, result: '口径对上了，风格没了' }
  ] },
  // ---------- 3. 老年生活线 ×5（year 下限 ≥55 破冰） ----------
  { id: 'enl176', stage: 'life', eventType: 'choice', weight: 4, year: [55, 72], title: '晨练棋友', text: '退休后的清晨，公园石桌边的象棋摊成了你的固定去处。老周棋臭但话多，老李棋精却总让半先。你坐在旁边看了一个月，今天有人让了位置。', choices: [
    { text: '坐下杀几盘，输赢都开心', effects: { body: 1, mentalPressure: -2, familyPressure: -1 }, result: '棋盘上赢不了人生，却赢回了笑声' },
    { text: '只观棋不谈棋，保持距离', effects: { mentalPressure: -1, peopleReputation: -1 }, result: '独来独往，公园的椅子空一半' },
    { text: '带一壶茶去，慢慢融进圈子', effects: { eq: 2, peopleReputation: 1 }, result: '茶香开了话匣子，圈子里有了你的位置' },
    { text: '教两个年轻人下棋', effects: { eq: 1, reputation: 1, body: 1 }, result: '收了两个学生，公园角落热闹了' }
  ] },
  { id: 'enl177', stage: 'life', eventType: 'choice', weight: 4, year: [55, 72], title: '隔代带孙', text: '儿子儿媳都忙，三岁的孙女每周有三天送到你这里。你年轻时带儿子是"放养"，现在带孙女却总觉得怕磕着碰着。', choices: [
    { text: '拿出当年带儿子的经验来', effects: { familyPressure: 1, eq: 1 }, result: '经验管用，孙女和你最亲' },
    { text: '专门学些育儿知识，紧跟新理念', effects: { iq: 1, familyPressure: -1 }, result: '新理念上手，儿媳也放心了' },
    { text: '和儿媳约法三章，各退一步', effects: { eq: 2, familyPressure: -1 }, result: '边界谈清，接送愉快' },
    { text: '偶尔推掉几次，留时间给自己', effects: { eq: 1, familyPressure: 1 }, result: '你也有自己的生活，分寸正好' }
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
  { id: 'enl181', stage: 'life', eventType: 'choice', weight: 4, scenario: 'retired', year: [50, 65], title: '退休生活的头三个月', text: '退休手续办完，第一个月你睡到自然醒，第二个月开始觉得空，第三个月你站在窗口看楼下来来往往的人——他们都在上班。', choices: [
    { text: '把以前没时间做的清单挨个做一遍', effects: { iq: 1, eq: 1, mentalPressure: -2 }, result: '清单越做越短，生活越填越满' },
    { text: '重拾年轻时的爱好，从零开始', effects: { eq: 2, body: 1 }, result: '爱好成了新身份' },
    { text: '找老朋友组常聚的局', effects: { eq: 1, peopleReputation: 1 }, result: '老友常聚，日子有烟火气' },
    { text: '宅家看手机，等孩子回来', effects: { mentalPressure: 1, body: -1 }, result: '屋子安静，心也安静不下来' }
  ] },
  { id: 'enl182', stage: 'life', eventType: 'choice', weight: 5, scenario: 'family', year: [35, 55], title: '中年家庭危机', text: '你在单位的晋升关键期撞上了家里的多事之秋：父母接连住院、孩子升学压力大、配偶的工作也出了变数。谁先谁后？', choices: [
    { text: '家庭优先，向单位说明请一段假', effects: { familyPressure: -2, eq: 2, positionWeight: -1 }, result: '家稳了，单位里的位置等了你半年' },
    { text: '工作优先，家里靠爱人撑住', effects: { positionWeight: 1, familyPressure: 3 }, result: '晋升上了，家里的怨气也攒下了' },
    { text: '公开向组织说明困难，争取弹性安排', effects: { integrity: 2, background: 1, mentalPressure: 1 }, result: '组织给弹性，两头都顾上了' },
    { text: '两头硬扛，都不缺席', effects: { body: -2, mentalPressure: 3, familyPressure: 1 }, result: '都顾着，都透支着' }
  ] },
  // ---------- 5. stable era career ×3 ----------
  { id: 'enc129', requireRankMin: 3, stage: 'career', eventType: 'choice', weight: 4, era: ['stable'], year: [28, 55], title: '编制常规核查', text: '平稳年代，机构编制委员会开展常规核查：编制数、实有人数、编外人员一个都不能少。你们单位退休两人未减编，台账上多出两个"影子岗位"。', choices: [
    { text: '如实上报并推动减编', effects: { integrity: 2, workAbility: 1, positionWeight: -1 }, result: '减编到位，台账清爽' },
    { text: '先补材料说明历史原因', effects: { eq: 1, background: 1 }, result: '说明被采信，岗位暂留' },
    { text: '顺势申请把编外人员规范入编', effects: { background: 1, eq: 1 }, result: '规范入编，心腹力量变正式' },
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
    { text: '选海边，好好休一次假', effects: { body: 1, mentalPressure: -2, wealth: -5 }, result: '海边回来，压力清零' },
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
  { id: 'enl186', stage: 'life', eventType: 'choice', weight: 3, year: [24, 58], title: '家电分期', text: '新出的洗烘一体机打广告"零利率分期 12 期"，家里刚好那台老式洗衣机轴承异响。买还是不买？', choices: [
    { text: '分期入手，零利率是真划算', effects: { wealth: -8, familyPressure: -1 }, result: '机器到了，每月还款不肉疼' },
    { text: '一次性付清，不碰分期', effects: { wealth: -12, mentalPressure: -1 }, result: '一次付清，落个清净' },
    { text: '等老洗衣机彻底罢工再换', effects: { luck: -1, familyPressure: 1 }, result: '罢工那天正好是全家聚餐夜' },
    { text: '先修轴承，再战两年', effects: { wealth: -2, luck: 1 }, result: '修好了，省下一半钱' }
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