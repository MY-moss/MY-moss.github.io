// ===== 基础通用事件·第1批 =====
// id 范围：e001~e085（85条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：早期职场与生活基础事件，按数量拆分（无主题聚合）
// 注：basic-1~5 为纯数量拆分，id 顺序与文件序不完全一致（历史分片）。
const gd_events_basic_1 = [
    { id: 'e001', stage: 'work', eventType: 'choice', title: '材料退回', weight: 6, text: '你写的材料被领导退回三次。第三次意见是"再提炼一下"，你感觉自己也快被提炼了。', choices: [
      { text: '逐条确认修改意见，梳理逻辑框架', effects: {workAbility: 3, mentalPressure: 2, risk: -1} },
      { text: '找老同事请教这类材料的写法套路', effects: {eq: 1, background: 1, mentalPressure: -1} },
      { text: '重新写一版，用更亮眼的小标题', effects: { positionWeight: 1, risk: 1, mentalPressure: 3} },
      { text: '先放着冷静一下，明天再改', effects: {mentalPressure: -2, body: 1} },
      { text: '用AI工具辅助生成初稿再润色', effects: {iq: 1, workAbility: 2, risk: 1, mentalPressure: -1} },
    ]},
    { id: 'e002', stage: 'work', eventType: 'auto', title: '会议延期', weight: 6, text: '下午三点，办公室接到通知：原定周五的协调会改到下周，但汇报材料仍要今晚交。小周把刚打印好的议程撕下来，问你是不是还要把时间表重新排一遍。', effects: {mentalPressure: 2, workAbility: 1} },
    { id: 'e003', stage: 'work', eventType: 'auto', title: '检查将至', weight: 6, text: '检查组的车据说已经出发，原本还有三天的台账补录只剩一下午。档案柜里最底层那摞签收单找不到负责人，办公室主任站在门口催你先把情况说明交上去。', effects: {workAbility: 2, mentalPressure: 4, risk: 1} },
    { id: 'e004', stage: 'work', eventType: 'auto', title: '领导换人', weight: 6, text: '分管领导调走，新领导第一次到科室不听汇报，只把历年投诉和项目验收表翻了一遍。他指着其中一项问“这个数字怎么来的”，你意识到过去的熟悉流程未必还算数。', effects: {background: -2, mentalPressure: 3} },
    { id: 'e005', stage: 'work', eventType: 'auto', title: '同事提拔', weight: 6, text: '同批进入单位的小何被提拔了。通知贴在楼梯口，他回办公室拿东西时和你打了个照面，两人都像往常那样说笑。晚上你删掉写了一半的祝贺消息，又重新发出去。', effects: {desire: 3, mentalPressure: 2} },
    { pools: ['public'], id: 'e006', stage: 'life', eventType: 'auto', title: '买房压力', weight: 5, text: '下班路过中介门店，橱窗里的首付款数字比你去年攒下的还多。家人发来几套房的链接，问你周末能不能去看看，你打开工资短信又关上。', effects: {familyPressure: 5, desire: 2} },
    { pools: ['public'], id: 'e007', stage: 'life', eventType: 'auto', title: '父母体检', weight: 5, text: '母亲说体检报告里有两项要复查，电话那头却反复强调“没大事，不用请假”。你听见父亲在远处说挂号排队太麻烦，心里开始算下一次休假还有多少天。', effects: {familyPressure: 6, mentalPressure: 4, family: 1} },
    { pools: ['public'], id: 'e008', stage: 'life', eventType: 'auto', title: '孩子升学', weight: 5, requireChild: true, text: '孩子的升学报名表放在餐桌正中，学籍证明和监护材料要跑好几个窗口。伴侣明天也要上班，问你能否抽一小时把复印件整理好，你想起单位还有一份材料没交。', effects: {familyPressure: 6, mentalPressure: 3} },
    { id: 'e009', stage: 'work', eventType: 'auto', title: '边缘化', weight: 6, text: '一份重要的联席会议纪要发到了所有科室，却唯独没有抄送你。你向同事问起时，对方先看了看门外，才说“可能是分工调整”，说完就低头继续敲键盘。', effects: {positionWeight: -3, mentalPressure: 4, desire: 2} },
    { id: 'e010', stage: 'work', eventType: 'auto', title: '被借调', weight: 5, text: '周一早会上，上级专班点名借调一名熟悉业务的干部。主任念出你的名字，说暂定三个月，手头工作先由同事接着做。晚上你数了数抽屉里还没办结的文件。', effects: {positionWeight: 2, workAbility: 4, mentalPressure: 5} },
    { pools: ['public'], id: 'e011', stage: 'life', eventType: 'choice', title: '流程捷径', weight: 4, text: '一位群众抱着孩子站在窗口外，补贴申请少了关键证明，今天又恰好是办理期限最后一天。旁边的同事低声建议你“先录系统再补材料”，签名处的光标一直在闪。', choices: [
      { text: '按程序来，补齐材料再办', effects: {workAbility: 3, integrity: 3, risk: -2, mentalPressure: 3} },
      { text: '先办再补，效率优先', effects: {workAbility: 2, desire: 2, risk: 8, mentalPressure: 6} },
      { text: '找人一起签字分担责任', effects: {background: 2, risk: 5, mentalPressure: 4} },
      { text: '留痕后折中处理', effects: {workAbility: 2, integrity: 1, risk: 3, mentalPressure: 3} },
      { text: '请示领导意见再决定', effects: {eq: 1, risk: -1, mentalPressure: 1, positionWeight: 1} },
    ]},
    { id: 'e012', stage: 'work', eventType: 'choice', title: '晋升机会', weight: 4, text: '人事调整的消息传了半个月。老科长散会后留住你，说“有想法得自己说”。你知道组织还要看资历、考核和岗位空缺，但如果一句话都不说，恐怕很难让人注意到你。', choices: [
      { text: '主动争取，让领导知道你的想法', effects: {desire: 2, positionWeight: 2, workAbility: 2, risk: 1, mentalPressure: 2} },
      { text: '保持观望，先观察岗位和考核安排', effects: {desire: 3, positionWeight: 1, risk: 1, mentalPressure: 1} },
      { text: '托人打听内部消息', effects: {background: 2, risk: 2, mentalPressure: 1} },
      { text: '专注做好本职工作，顺其自然', effects: {workAbility: 3, mentalPressure: -2, desire: -2, risk: -1} },
      { text: '主动找领导汇报近期工作成果', effects: {eq: 1, positionWeight: 3, workAbility: 1, risk: 1} },
    ]},
    { pools: ['public'], id: 'e013', stage: 'life', eventType: 'choice', title: '买房选择', weight: 4, text: '周末家庭群里不断有人转来新盘的价格表。父母愿意凑一部分首付，却担心你以后每个月还贷太紧。你和伴侣坐在沙发上，把水电、交通和孩子的开支重新算了一遍。', choices: [
      { text: '咬牙上车，从此工资有了固定收件人', effects: {mentalPressure: 2, familyPressure: 2, workAbility: 2, risk: -1} },
      { text: '再等等，房价和焦虑都没等', effects: {mentalPressure: 5, familyPressure: 6, desire: 2, risk: 3} },
      { text: '向家里求助凑首付', effects: {background: 2, familyPressure: -2, risk: 2, mentalPressure: 1} },
      { text: '重新规划城市和岗位', effects: {workAbility: 1, familyPressure: -3, mentalPressure: 1, desire: -1} },
      { text: '先买套小户型上车', effects: {mentalPressure: 1, familyPressure: 1, risk: 1, workAbility: 1} },
    ]},
    { id: 'e014', stage: 'work', eventType: 'choice', title: '甩锅会议', weight: 4, text: '问题通报会上，三个科室拿着同一份协调纪要，却各自圈出了对自己有利的条款。轮到你发言时，主任问的是“到底谁来负责”，而你手里恰好有原始交接记录。', choices: [
      { text: '拿出留痕材料，用事实说话', effects: {workAbility: 3, risk: -4, integrity: 3, mentalPressure: 2, family: 1} },
      { text: '先认下来再补救，顾全大局', effects: {mentalPressure: 7, risk: 5, positionWeight: -2, workAbility: 1} },
      { text: '会后逐个沟通，私下化解分歧', effects: {eq: 1, background: 1, mentalPressure: 3, workAbility: 1} },
      { text: '当场说明实际情况，不背锅', effects: {integrity: 3, risk: 2, positionWeight: -3, mentalPressure: 1} },
      { text: '提议成立联合调查组，集体决策', effects: {workAbility: 2, risk: -1, positionWeight: 1, mentalPressure: 2} },
    ]},
    { id: 'e015', stage: 'work', eventType: 'choice', title: '风险提醒', weight: 4, text: '项目还没签验收单，一名熟悉流程的前辈私下提醒你：供应商的施工日志与现场照片对不上。领导催着结项，你打开附件才发现少了最重要的一次复核记录。', choices: [
      { text: '暂停核实，查明情况再推进', effects: {workAbility: 3, integrity: 3, risk: -2, mentalPressure: 2} },
      { text: '继续推进，效率优先', effects: {workAbility: 2, desire: 2, risk: 6, mentalPressure: 4} },
      { text: '向领导说明风险，让上级决策', effects: {background: 2, integrity: 2, risk: 1, mentalPressure: 3} },
      { text: '拉上同事一起会签', effects: {risk: 3, mentalPressure: 2, workAbility: 1} },
      { text: '先放一放，观察风向', effects: {mentalPressure: -1, risk: -2, positionWeight: -1, reputation: 1} },
    ]},
    { pools: ['public'], id: 'e016', stage: 'life', eventType: 'choice', title: '家庭摊牌', weight: 4, text: '晚饭热了两遍，伴侣终于放下筷子，问你这一年到底有多少天在家。你想解释上级考核和专班任务，可对方说的不是哪一次加班，而是所有落空的约定。', choices: [
      { text: '认真沟通，争取理解', effects: {eq: 2, familyPressure: -3, mentalPressure: 3, workAbility: 1} },
      { text: '沉默回避，用行动证明', effects: {mentalPressure: -1, familyPressure: 5, desire: 2, risk: 2} },
      { text: '申请调岗，平衡生活', effects: {workAbility: 1, familyPressure: -4, mentalPressure: 3, positionWeight: -2} },
      { text: '继续拼事业，以后再补偿', effects: {desire: 3, workAbility: 2, familyPressure: 3, mentalPressure: 2} },
      { text: '带伴侣参加单位活动，增进了解', effects: {eq: 1, familyPressure: -2, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e017', stage: 'work', eventType: 'choice', title: '临时任务', weight: 6, text: '一个临时任务在群里安静躺了三分钟。所有人都看见了，所有人都在练习没看见。', choices: [
      { text: '主动接下来，顺便把边界写清楚', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 4} },
      { text: '等领导明确分工再动', effects: {risk: -1, mentalPressure: 1, positionWeight: -1} },
      { text: '拉上相关同事一起承担', effects: {eq: 1, background: 1, risk: 1, mentalPressure: 1, desire: 3} },
      { text: '以手上任务多为由婉拒', effects: {mentalPressure: -1, risk: -1, positionWeight: -2, reputation: 1} },
      { text: '接下来但明确需要资源支持', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2, background: 1} },
    ]},
    { pools: ['public'], id: 'e018', stage: 'life', eventType: 'choice', title: '熟人请托', weight: 4, text: '多年没联系的熟人带着材料找到你，说孩子申请的事项“你帮着打个招呼就行”。材料看上去齐全，但负责审批的恰好是你所在部门，你知道一句话也会被人当成暗示。', choices: [
      { text: '告知正规申请渠道，并主动回避审批流程', effects: { integrity: 3, risk: -3, mentalPressure: 2 }, result: '你把办事指南发给对方，书面说明了自己与申请人的关系。' },
      { text: '带他去公开服务窗口问清补件要求', effects: { workAbility: 2, eq: 1, integrity: 1, mentalPressure: 2 }, result: '材料补齐了，决定由不认识你的人按流程作出。' },
      { text: '私下催熟人加快审核，欠下一份人情', effects: { background: 3, risk: 6, heat: 3, integrity: -4, mentalPressure: 1 }, minBackground: 40, result: '事情很快办了下来，但你知道对方可能还会来找你。' },
      { text: '明确不能经手，拒绝帮忙也不转介绍', effects: { integrity: 2, risk: -2, eq: -1, mentalPressure: -1 }, result: '电话那头沉默了一会儿；这次关系可能就到此为止。' },
    ]},
    { id: 'e019', stage: 'work', eventType: 'choice', title: '业务创新', weight: 4, text: '窗口流程里有一项材料每年都让群众来回跑两趟。你提出改用部门间核验，老同事提醒系统改动牵涉好几个负责人；领导希望月底能交出可执行而非漂亮的方案。', choices: [
      { text: '先调研痛点，用数据说话', effects: {workAbility: 3, iq: 1, risk: -1, mentalPressure: 2} },
      { text: '听取老同事意见，微调为主', effects: {eq: 1, background: 1, mentalPressure: -1, workAbility: 1} },
      { text: '大胆改革，做出一版新方案', effects: {desire: 3, positionWeight: 2, risk: 3, mentalPressure: 4} },
      { text: '在原有基础上小步快跑', effects: {workAbility: 2, risk: 1, mentalPressure: 1} },
      { text: '先做试点，验证效果再推广', effects: {workAbility: 2, iq: 1, risk: -1, positionWeight: 1} },
    ]},
    { id: 'e020', stage: 'work', eventType: 'choice', title: '酒局话里有话', weight: 4, text: '饭局上有人把一句普通话说出了三层意思。你听懂了两层，第三层假装没听见。', choices: [
      { text: '只喝汤，少接话，保持清醒', effects: {risk: -2, mentalPressure: 1, positionWeight: -1} },
      { text: '顺着话头接半句，不得罪人', effects: {positionWeight: 2, eq: 1, risk: 2, mentalPressure: 2} },
      { text: '当场表态很坚决，表明立场', effects: {integrity: 3, positionWeight: -2, risk: -1, mentalPressure: 1} },
      { text: '借口上洗手间避开话题', effects: {mentalPressure: -1, risk: -1, eq: -1, reputation: 1} },
      { text: '巧妙转移话题到工作上去', effects: {eq: 1, workAbility: 1, risk: 1} },
    ]},
    { id: 'e021', stage: 'work', eventType: 'sudden', title: '突发调查', weight: 5, text: '审计人员调取了你两年前签字的项目档案。那时你刚接手，很多细节依赖前任的交接说明；如今原始附件缺了一页，调查函要求你三天内逐项作出解释。', effects: {risk: 10, mentalPressure: 10} },
    { id: 'e022', stage: 'work', eventType: 'sudden', title: '主要领导调走', weight: 3, text: '你熟悉的分管领导今天正式调离。告别会上大家说着祝福的话，散场后人事科送来新分工表，你负责的两个项目被划给了别的科室，明早就要交接。', effects: {background: -5, positionWeight: -3, mentalPressure: 5} },
    { id: 'e023', stage: 'work', eventType: 'sudden', title: '机构改革', weight: 5, text: '机构改革方案贴出来后，单位牌子和部门名称要换，几项业务却没有明确归口。两拨同事都认为不该由自己接手，直到一份临近期限的群众申请被送到你的桌上。', effects: {positionWeight: 3, mentalPressure: 5} },
    { id: 'e024', stage: 'work', eventType: 'sudden', title: '突然死亡', weight: 8, text: '连续几个月的高压工作后，你在深夜整理材料时突然胸闷倒下。灯还亮着，手机屏幕上停着一条未发出的“马上回家”。同事发现时，已经错过了最好的抢救时机。', effects: {mentalPressure: 10}, requireMentalPressure: 65, requireBodyMax: 3, terminal: 'death' },
    { id: 'e025', stage: 'work', eventType: 'sudden', title: '被抓', weight: 4, text: '多年积累的风险终于合上了账本。那天之后，很多人开始说"其实早有苗头"。', effects: {risk: 10}, requireHeat: 28, requireMentalPressure: 30, requireRisk: 5, terminal: 'arrest' },
    { id: 'e026', stage: 'work', eventType: 'sudden', title: '遴选机会', weight: 3, text: '上级部门发布了公开遴选通知，资格栏写着任职年限、学历和考核条件。你反复核对自己的履历，却发现一旦调走，眼下负责的项目和家里的生活安排都得重新开始。', effects: {desire: 8, mentalPressure: 5} },
    { pools: ['public'], id: 'e027', stage: 'life', eventType: 'sudden', title: '家庭变故', weight: 3, text: '家里突然打来电话，说父亲在医院需要进一步检查。你手机里同时跳出明早的重要会议提醒，伴侣问能不能今晚就出发，你拿着已订好的车票迟迟没有回复单位。', effects: {familyPressure: 10, mentalPressure: 12} },
    { id: 'e028', stage: 'work', eventType: 'sudden', title: '贵人倒台', weight: 3, text: '过去一直提醒你规避风险的那位领导突然被组织调查。办公室里没人再提他的名字，可你经手过的一份合作项目正是他当时安排的，有人建议你尽快把来往记录整理好。', effects: {background: -10, risk: 10, mentalPressure: 10} },
    { id: 'e029', stage: 'work', eventType: 'auto', title: '表扬通报', weight: 6, text: '上级简报专门表扬了你负责的项目，科室同事把截图发进群里。下午领导却提醒：试点做成不等于长期机制成熟，下个月还要接受全市推广考核。', effects: {positionWeight: 3, desire: 2, mentalPressure: 2} },
    { id: 'e030', stage: 'work', eventType: 'auto', title: '数据返工', weight: 6, text: '统计口径在报送前一天突然调整，原先整理好的几百条数据需要重新分类。新来的同事问你能不能先沿用旧表，办公室主任则催促明早九点前必须提交。', effects: {workAbility: 2, mentalPressure: 4} },
    { id: 'e031', stage: 'work', eventType: 'auto', title: '群众投诉', weight: 6, text: '一份投诉件在几家单位之间转了五次，最后又回到你手里。来访老人把每次的回复都按日期夹在本子里，指着其中一句问：“这么多次转办，究竟是谁负责？”', effects: {workAbility: 2, mentalPressure: 3, risk: 1} },
    { pools: ['public'], id: 'e032', stage: 'life', eventType: 'auto', title: '身体报警', weight: 5, text: '年度体检报告上有一项箭头超出了参考范围。医生建议复查并减少熬夜，你翻到手机日历发现下周每一天都有会议，家人已经第三次问你什么时候能去医院。', effects: {body: -1, mentalPressure: 5} },
    { pools: ['public'], id: 'e033', stage: 'life', eventType: 'auto', title: '风险饭局', weight: 5, text: '一次工作餐后，熟悉的企业负责人把你拉到走廊，说有份项目验收只差一个签字。他的语气很轻，却提起你正在为家里筹钱的事，你看见对方把准备好的信封推近了一点。', effects: {risk: 4, integrity: -2, mentalPressure: 2} },
    { id: 'e034', stage: 'work', eventType: 'auto', title: '政策变化', weight: 6, text: '新政策文件下午才到，要求暂停你负责的旧试点并重新评估。已经完成的走访和合同不能简单作废，群众还等着答复，你需要决定怎样向领导和当事人解释变化。', effects: {workAbility: 2, mentalPressure: 3} },
    { pools: ['public'], id: 'e035', stage: 'life', eventType: 'auto', title: '婚姻冷场', weight: 5, text: '晚饭时，伴侣问起你上个月答应的旅行。你说刚好有临时任务，下次补上；对方没有再争辩，只把手机里预订酒店的页面关掉了，桌上剩下一道凉透的菜。', effects: {familyPressure: 5, mentalPressure: 3} },
    { id: 'e036', stage: 'work', eventType: 'auto', title: '错过晋升', weight: 6, text: '干部调整名单公示了，你的名字不在上面。另一位同事起身去人事科补材料，你却在办公室坐了很久：既想知道自己究竟差了什么，也害怕问出来只得到一句“再等等”。', effects: {desire: 4, mentalPressure: 4} },
    { pools: ['public'], id: 'e037', stage: 'life', eventType: 'auto', title: '家庭买房', weight: 4, text: '父母把老家的存款明细带来，提议帮你凑一套房的首付。伴侣担心月供挤掉孩子教育和老人医疗的预算，你们把纸摊在餐桌上，算到夜里仍没有一致意见。', effects: {familyPressure: 8, desire: 3, mentalPressure: 3} },
    { id: 'e038', stage: 'work', eventType: 'choice', title: '舆情苗头', weight: 4, text: '本地群里开始转发一段办事窗口的视频，镜头只拍到争执的后半段。领导要求尽快回应，窗口同事却说事情另有前因，你必须在事实核实和舆论压力之间安排顺序。', choices: [
      { text: '先核实事实，再统一回应', effects: {workAbility: 3, positionWeight: 1, mentalPressure: 2, risk: -1, family: 1} },
      { text: '先联系当事人沟通，安抚情绪', effects: {eq: 2, background: 1, mentalPressure: 1, risk: 1} },
      { text: '先压热度，后补流程', effects: {risk: 5, positionWeight: 1, integrity: -3, mentalPressure: 1} },
      { text: '按舆情预案流程处理', effects: {workAbility: 2, integrity: 2, risk: -2, mentalPressure: 2} },
      { text: '主动发布正面信息对冲', effects: {desire: 2, positionWeight: 2, risk: 3, mentalPressure: 3} },
    ]},
    { id: 'e039', stage: 'work', eventType: 'choice', title: '新人指导', weight: 4, text: '新入职的小林把报表里同一列数据填错了三次，几位老同事当众开玩笑。他低着头把纸收起来，下午又悄悄来问你：这个口径到底该按哪份通知执行？', choices: [
      { text: '认真讲解操作步骤，鼓励多学', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '帮他把尴尬接过去，私下再教', effects: {eq: 2, background: 1, mentalPressure: 1} },
      { text: '做一份操作指南发到群里', effects: {workAbility: 3, positionWeight: 1, mentalPressure: 2} },
      { text: '告诉他哪些问题该问谁', effects: {workAbility: 1, eq: 1, mentalPressure: -1} },
      { text: '鼓励他建立自己的知识库', effects: {iq: 1, workAbility: 2, eq: 1} },
    ]},
    { id: 'e040', stage: 'work', eventType: 'choice', title: '一仆二主', weight: 4, text: '两位领导在同一天对项目提出相反要求：一位要尽快推进，一位坚持重新征询意见。具体操作都要你签字，办公室里已经有人开始推测“谁说了算”，你手里只有一份尚未完善的方案。', choices: [
      { text: '整理两种要求的对比方案供选择', effects: {workAbility: 3, risk: -1, mentalPressure: 2, positionWeight: 1} },
      { text: '分别理解两位领导的关注点', effects: {eq: 2, background: 1, mentalPressure: 2} },
      { text: '做兼容版方案，把冲突变选择题', effects: {workAbility: 2, positionWeight: 2, risk: 2, mentalPressure: 3} },
      { text: '请示明确最终口径', effects: {integrity: 3, risk: -2, mentalPressure: 1, positionWeight: -1} },
      { text: '按主要领导意见优先执行', effects: {desire: 2, positionWeight: 2, risk: 1, mentalPressure: 2} },
    ]},
    // 遴选机会
    { id: 'e041', stage: 'work', eventType: 'choice', title: '遴选机会（符合条件）', weight: 3, text: '省市遴选公告出来了，你符合条件。这是一个跳出当前平台的好机会，但竞争也很激烈。', choices: [
      { text: '报名参加遴选，全力备考', effects: {workAbility: 3, desire: 4, mentalPressure: 5, risk: 1, positionWeight: 2} },
      { text: '先观望一下，看看单位什么态度', effects: {eq: 1, mentalPressure: 1, background: 1, desire: 1} },
      { text: '主动找领导沟通，争取推荐', effects: {background: 3, positionWeight: 2, desire: 2, mentalPressure: 2} },
      { text: '放弃遴选，专注当前岗位', effects: {integrity: 2, mentalPressure: -2, desire: -2, positionWeight: -1} },
      { text: '私下打听往年遴选情况再做决定', effects: {iq: 1, background: 2, risk: 1, mentalPressure: 1} },
    ]},
    // 入党申请
    { id: 'e042', stage: 'work', eventType: 'choice', title: '入党申请', weight: 6, text: '单位党组织开始新一轮党员发展工作。你虽然不是党员，但领导和同事都劝你写入党申请书。', choices: [
      { text: '积极递交入党申请书', effects: {flag: 'appliedParty', positionWeight: 3, desire: 3, mentalPressure: 2, background: 2}, result: "你把申请书交到支部，接下来还需履行培养、考察等程序。" },
      { text: '先了解入党流程再决定', effects: {iq: 1, workAbility: 1, mentalPressure: 1, eq: 1}, result: "你先弄清申请、培养与考察的流程，没有当场作出承诺。" },
      { text: '以工作太忙为由暂缓', effects: {desire: -1, mentalPressure: -1, positionWeight: -1, reputation: 1}, result: "你把眼下的工作安排说清楚，决定等自己准备好再谈。" },
      { text: '明确表示暂不考虑入党', effects: {integrity: 2, positionWeight: -2, risk: 1, mentalPressure: -1}, result: "你表达了当前的真实想法，谈话结束后仍回到日常岗位。" },
      { text: '找支部书记谈心表达意愿', effects: {flag: 'appliedParty', background: 3, eq: 1, positionWeight: 2, mentalPressure: 2}, result: "支部书记听完你的想法，提醒你把申请意愿落实到书面材料与日常表现中。" },
    ]},
    // 预备党员转正
    { id: 'e043', stage: 'work', eventType: 'choice', title: '预备党员转正', weight: 7, text: '你作为预备党员即将转正，但有人匿名反映你"工作态度不够积极"，党支部需要讨论你的转正问题。', requireFlag: 'appliedParty', choices: [
      { text: '认真准备转正汇报用业绩说话', effects: {political: 'cpc', workAbility: 3, positionWeight: 2, integrity: 2, mentalPressure: 3} },
      { text: '找入党介绍人沟通了解情况', effects: {political: 'cpc', eq: 1, background: 2, mentalPressure: 1, risk: -1} },
      { text: '主动加班展示积极性', effects: {political: 'cpc', workAbility: 2, mentalPressure: 4, body: -1, positionWeight: 1} },
      { text: '相信组织公正', effects: {political: 'cpc', integrity: 3, mentalPressure: -1, risk: 1} },
      { text: '请支部书记帮忙做工作', effects: {political: 'cpc', background: 2, positionWeight: 1, mentalPressure: 1, eq: 1} },
    ]},
    // 党课学习
    { id: 'e044', stage: 'work', eventType: 'choice', title: '党课学习', weight: 3, text: '单位组织了一次红色教育基地主题教育活动，为期一周。你手头正好有一个紧急项目，但组织上希望大家都能参加。', choices: [
      { text: '积极参加党性修养不能耽误', effects: {integrity: 3, positionWeight: 2, background: 2, mentalPressure: 2, workAbility: -1} },
      { text: '以项目为由请假留在单位', effects: {workAbility: 2, positionWeight: -1, mentalPressure: 1, integrity: -1} },
      { text: '白天参加活动晚上加班赶项目', effects: {body: -2, mentalPressure: 4, positionWeight: 2, workAbility: 1, integrity: 2} },
      { text: '在活动中积极表现争取注意', effects: {desire: 3, positionWeight: 2, background: 2, mentalPressure: 2} },
      { text: '利用活动和其他单位交流经验', effects: {eq: 1, background: 3, workAbility: 1, mentalPressure: 1} },
    ]},
    // 组织生活会
    { id: 'e045', stage: 'work', eventType: 'choice', title: '批评与自我批评', weight: 3, text: '单位组织了一次批评与自我批评活动，要求大家坦诚交流、互相学习。轮到你发言时，办公室的气氛突然变得严肃起来。', choices: [
      { text: '诚恳剖析自己的不足', effects: {integrity: 4, eq: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '轻描淡写说无关痛痒的问题', effects: {mentalPressure: -1, risk: -1, integrity: -1, reputation: 1} },
      { text: '借机指出工作中存在的问题', effects: {workAbility: 3, integrity: 2, risk: 2, mentalPressure: 3, positionWeight: 1} },
      { text: '表扬同事不得罪人', effects: {eq: 1, background: 1, mentalPressure: -1, integrity: -1} },
      { text: '认真听取意见会后改进', effects: {eq: 2, workAbility: 2, integrity: 2, mentalPressure: 1} },
    ]},
    // 违规曝光
    { id: 'e046', stage: 'work', eventType: 'choice', title: '违规曝光', weight: 3, text: '你看到一则新闻：某单位党员干部因违规接受宴请被通报。你想起上周自己也参加过类似的饭局。', choices: [
      { text: '主动向组织说明情况', effects: {integrity: 5, risk: -4, mentalPressure: 4, positionWeight: -1} },
      { text: '保持沉默希望没人注意到', effects: {risk: 4, mentalPressure: -1, integrity: -3} },
      { text: '回顾饭局细节确认风险', effects: {iq: 2, risk: 1, mentalPressure: 2, workAbility: 1} },
      { text: '以后一律婉拒类似饭局', effects: {integrity: 3, risk: -2, mentalPressure: 1, eq: 1} },
      { text: '向纪委咨询政策边界', effects: {integrity: 3, risk: -2, mentalPressure: 2, workAbility: 1} },
    ]},
    // 巡视组来了
    { id: 'e047', stage: 'work', eventType: 'sudden', title: '巡视组来了', weight: 3, text: '巡视组进驻单位，每个人都在翻旧账、补材料。你经手过的项目也被列入了检查范围。', effects: {risk: 8, mentalPressure: 10, workAbility: 2} },
    // 中年危机
    { pools: ['public'], id: 'e048', stage: 'life', eventType: 'choice', title: '中年危机（瓶颈）', weight: 4, text: '你突然意识到自己已经在这个岗位上干了十年，升不上去，走又舍不得编制。', choices: [
      { text: '重新规划职业路线', effects: {desire: 5, workAbility: 3, mentalPressure: 3, positionWeight: 1} },
      { text: '接受现实转向家庭', effects: {familyPressure: -3, mentalPressure: -3, desire: -5, workAbility: -2, reputation: 1} },
      { text: '申请轮岗到新部门', effects: {background: 2, workAbility: 2, mentalPressure: 2, risk: 2} },
      { text: '开始备考遴选或跳槽', effects: {desire: 6, mentalPressure: 5, workAbility: 3, risk: 2} },
      { text: '培养副业兴趣', effects: {mentalPressure: -2, desire: 1, workAbility: -1, risk: 1} },
    ]},
    // 站队考验
    { id: 'e049', stage: 'work', eventType: 'choice', title: '站队考验', weight: 5, text: '单位里两派领导暗中较劲都想拉拢你。你夹在中间，怎么做都可能得罪人。', choices: [
      { text: '保持中立专注本职工作', effects: {integrity: 4, risk: -2, mentalPressure: 3, positionWeight: -2} },
      { text: '靠向实力更强的一方', effects: { flag: 'faction_lean', background: 4, positionWeight: 3, risk: 5, desire: 3, mentalPressure: 4} },
      { text: '两边都不得罪', effects: {eq: 2, background: 2, risk: 3, mentalPressure: 4, integrity: -2} },
      { text: '主动申请跨部门交流，远离内耗', effects: {risk: -3, mentalPressure: -1, positionWeight: -1, background: 1} },
      { text: '向主要领导汇报请示', effects: {integrity: 3, background: 2, risk: -1, mentalPressure: 2, positionWeight: 1} },
    ]},
    // 健康亮红灯
    { pools: ['public'], id: 'e050', stage: 'life', eventType: 'choice', title: '健康亮红灯', weight: 4, text: '长期加班和应酬，你的身体终于发出了警告信号。医生建议你休息一段时间。', choices: [
      { text: '听医生的话申请休假', effects: {body: 3, mentalPressure: -5, workAbility: -1, positionWeight: -1} },
      { text: '减少应酬边工作边调养', effects: {body: 2, mentalPressure: -2, risk: -2, workAbility: 1} },
      { text: '硬撑着继续干', effects: {body: -3, mentalPressure: 5, workAbility: 2, risk: 2} },
      { text: '开始健身锻炼', effects: {body: 4, mentalPressure: -3, eq: 1} },
      { text: '申请调整到压力较小岗位', effects: {body: 2, mentalPressure: -3, positionWeight: -2, workAbility: -1} },
    ]},
    // 利益诱惑
    { id: 'e051', stage: 'work', eventType: 'choice', title: '利益诱惑', weight: 5, text: '一个项目承建方私下找到你，暗示如果帮忙"通融一下"，可以给你一笔"咨询费"。', choices: [
      { text: '当场严词拒绝并报告组织', effects: {integrity: 8, risk: -6, mentalPressure: 2, reputation: 5, background: -2, flag: 'refusedBribe'} },
      { text: '委婉拒绝说明按规矩办', effects: {integrity: 4, risk: -3, mentalPressure: 1, eq: 1, reputation: 2} },
      { text: '假装考虑留好证据', effects: {integrity: 2, risk: -1, mentalPressure: 3, reputation: -1, background: 1, flag: 'consideredBribe'} },
      { text: '收下钱把事情办了', effects: {wealth: 30, risk: 8, integrity: -6, desire: 6, mentalPressure: 6, reputation: -5, background: 3, heat: 8, flag: 'tookBribe'} },
      { text: '介绍给其他同事处理', effects: {risk: 3, integrity: -2, mentalPressure: 1, reputation: -2, background: 1} },
    ]},
    // 老友聚会
    { pools: ['public'], id: 'e052', stage: 'life', eventType: 'auto', title: '老友聚会', weight: 5, text: '大学同学聚会，有人创业成功有人大厂年薪百万，你在体制内拿着死工资。你开始怀疑自己的选择。', effects: {desire: 5, mentalPressure: 4, integrity: -1} },
    // 改革阵痛
    { id: 'e053', stage: 'work', eventType: 'choice', title: '改革阵痛', weight: 3, text: '单位推行改革要打破原有利益格局。老同事们怨声载道，你是改革执行者之一。', choices: [
      { text: '坚决执行改革不怕得罪人', effects: {workAbility: 3, positionWeight: 3, risk: 4, mentalPressure: 5, integrity: 2} },
      { text: '温和推进给老同事适应时间', effects: {eq: 2, background: 2, mentalPressure: 2, risk: 1, workAbility: 1} },
      { text: '先试点再推广减少阻力', effects: {workAbility: 2, iq: 2, risk: -1, mentalPressure: 2} },
      { text: '向上级反映执行困难', effects: {integrity: 2, risk: 1, mentalPressure: 1, positionWeight: -1} },
      { text: '联合支持改革者形成合力', effects: {background: 2, positionWeight: 2, desire: 2, risk: 2} },
    ]},
    // 年度考核优秀
    { id: 'e054', stage: 'work', eventType: 'auto', title: '年度考核优秀', weight: 5, text: '今年的年度考核你被评为优秀等次。虽然只是一纸证书，但领导看你的眼神不太一样了。', effects: {positionWeight: 3, desire: 2, workAbility: 1, mentalPressure: -2} },
    // 舆情危机
    { id: 'e055', stage: 'work', eventType: 'choice', title: '舆情危机', weight: 3, text: '一篇关于你单位"办事难"的报道在网上热传，评论区一边倒。领导让你尽快拿出应对方案。', choices: [
      { text: '立即核实事实发布官方说明', effects: {workAbility: 3, positionWeight: 2, risk: -2, mentalPressure: 4} },
      { text: '主动联系媒体争取正面报道', effects: {background: 3, eq: 1, risk: 2, mentalPressure: 3} },
      { text: '先内部追责再对外回应', effects: {integrity: 3, risk: 1, mentalPressure: 5, positionWeight: 1} },
      { text: '冷处理等热度自然下降', effects: {risk: 3, mentalPressure: 1, positionWeight: -2, integrity: -2} },
      { text: '邀请群众代表座谈当面沟通', effects: {eq: 2, workAbility: 2, risk: -1, mentalPressure: 2, background: 1} },
    ]},
    // 内部举报
    { id: 'e056', stage: 'work', eventType: 'choice', title: '内部举报', weight: 3, text: '有人匿名举报你所在科室存在违规操作。虽然你知道自己是清白的，但调查组已经进驻。', choices: [
      { text: '主动配合调查提供全部材料', effects: {integrity: 5, risk: -3, mentalPressure: 4, positionWeight: 1} },
      { text: '咨询律师了解法律风险', effects: {iq: 2, risk: -2, mentalPressure: 2, integrity: 2} },
      { text: '找领导说明情况请求支持', effects: {background: 3, positionWeight: 2, mentalPressure: 2, risk: 1} },
      { text: '私下打听举报人信息', effects: {risk: 5, integrity: -4, mentalPressure: 4, background: 1} },
      { text: '正常上班不做特殊应对', effects: {integrity: 2, risk: 1, mentalPressure: 3} },
    ]},
    // 上级视察
    { id: 'e057', stage: 'work', eventType: 'choice', title: '上级视察', weight: 3, text: '大领导要来视察，单位上下都在准备。你负责的展示环节出了点小纰漏，时间只剩半天。', choices: [
      { text: '如实汇报问题争取时间补救', effects: {integrity: 3, risk: -1, mentalPressure: 3, workAbility: 2} },
      { text: '想办法掩盖展示后再处理', effects: {risk: 4, mentalPressure: 4, integrity: -3, positionWeight: 1} },
      { text: '连夜加班赶在视察前修复', effects: {workAbility: 3, mentalPressure: 5, body: -1, positionWeight: 2} },
      { text: '调整展示方案绕过问题环节', effects: {eq: 1, workAbility: 2, risk: 1, mentalPressure: 2} },
      { text: '求助兄弟单位帮忙', effects: {background: 2, eq: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    // 家庭危机
    { pools: ['public'], id: 'e058', stage: 'life', eventType: 'choice', title: '家庭危机', weight: 3, text: '家里老人突然病重住院，而你手头有一个必须按时完成的重要项目。工作和家庭两头烧。', choices: [
      { text: '请假陪护项目委托给同事', effects: {familyPressure: -5, mentalPressure: 2, workAbility: -2, positionWeight: -1} },
      { text: '白天上班晚上陪护', effects: {body: -2, mentalPressure: 5, workAbility: 2, familyPressure: -2} },
      { text: '请护工帮忙自己专注工作', effects: {workAbility: 2, familyPressure: 2, mentalPressure: 3, integrity: 1} },
      { text: '向领导说明情况申请延期', effects: {integrity: 3, mentalPressure: 1, workAbility: 1, risk: -1} },
      { text: '动员其他家人分担', effects: {eq: 1, familyPressure: -3, mentalPressure: 1} },
    ]},
    // 导师退休
    { id: 'e059', year: [28, 65], stage: 'work', eventType: 'choice', title: '导师退休', weight: 3, text: '带你入行的老领导要退休了。退休前他找你谈话，暗示可以最后帮你争取一个关键岗位，但需要你明确表态。', choices: [
      { text: '感谢栽培愿意接手更重的担子', effects: {desire: 4, positionWeight: 4, mentalPressure: 4, background: 3, risk: 1, flag: 'tookMentorOffer'} },
      { text: '表达感激希望靠自己一步步走', effects: {integrity: 4, eq: 2, mentalPressure: 1, background: 1, positionWeight: -1} },
      { text: '请老领导推荐更好的出路', effects: {background: 4, positionWeight: 2, desire: 2, mentalPressure: 2, risk: 2} },
      { text: '暗示还没准备好希望再带一年', effects: {eq: 1, mentalPressure: -2, positionWeight: -2, desire: -2} },
      { text: '组织同事们给老领导办退休仪式', effects: {eq: 2, background: 2, mentalPressure: -1, positionWeight: 1} },
    ]},
    // 扶贫驻村
    { id: 'e060', stage: 'work', eventType: 'choice', title: '驻村帮扶', weight: 3, requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], text: '组织选派你去偏远山村驻村帮扶，为期两年。那里条件艰苦，但也是难得的基层锻炼机会。接受后保留原单位关系，期满再根据组织安排决定去向。', choices: [
      { text: '欣然接受这是难得的基层经历', effects: {workAbility: 4, background: 3, body: 2, mentalPressure: 4, positionWeight: 2, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村帮扶' }} },
      { text: '以家庭原因为由申请不去', effects: {positionWeight: -2, mentalPressure: -1, risk: -1, familyPressure: 2} },
      { text: '提出条件要求回来后优先晋升', effects: {desire: 4, positionWeight: 2, risk: 2, mentalPressure: 3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村帮扶' }} },
      { text: '主动申请延长驻村时间', effects: {integrity: 4, workAbility: 3, background: 3, body: -1, positionWeight: 3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 3, reason: '延长驻村帮扶' }} },
      { text: '利用驻村机会积累政绩', effects: {desire: 4, background: 3, positionWeight: 2, risk: 2, mentalPressure: 3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村帮扶' }} },
    ]},
    // 出国考察
    { id: 'e061', stage: 'work', eventType: 'choice', title: '出国考察', weight: 4, text: '上级组织了一个赴新加坡的公共服务考察团，你被列入候选名单。但出国回来后可能要签一份长期服务协议。', choices: [
      { text: '积极争取开拓眼界', effects: {workAbility: 4, background: 3, iq: 2, mentalPressure: 3, positionWeight: 2} },
      { text: '以家庭原因为由放弃', effects: {familyPressure: -2, mentalPressure: -1, positionWeight: -2, desire: -2, reputation: 1} },
      { text: '先打听其他人选评估竞争力', effects: {iq: 1, background: 2, mentalPressure: 1, risk: 1} },
      { text: '接受但要求缩短服务期', effects: {eq: 1, workAbility: 2, mentalPressure: 2, risk: 1, positionWeight: 1} },
      { text: '主动写考察计划书展现能力', effects: {workAbility: 3, desire: 3, positionWeight: 2, mentalPressure: 3, background: 1} },
    ]},
    // 信访处理
    { id: 'e062', stage: 'work', eventType: 'choice', title: '信访处理', weight: 3, text: '一位老信访户又来上访，他的问题确实有历史原因，但按现行政策确实无法解决。他情绪激动，跪在你面前。', choices: [
      { text: '扶起老人耐心解释政策', effects: {eq: 2, integrity: 2, mentalPressure: 3, background: 1, workAbility: 1} },
      { text: '联系相关部门看有没有变通办法', effects: {workAbility: 3, eq: 1, mentalPressure: 3, risk: 1, background: 1} },
      { text: '按规定办事不行就是不行', effects: {integrity: 3, risk: -1, mentalPressure: 2, eq: -1, positionWeight: 1} },
      { text: '给老人买瓶水先稳定情绪', effects: {eq: 2, mentalPressure: 1, integrity: 1, background: 1} },
      { text: '协调民政部门给予临时救助', effects: {workAbility: 2, eq: 1, integrity: 2, mentalPressure: 2, background: 1} },
    ]},
    // 创业诱惑
    { pools: ['public'], id: 'e063', stage: 'life', eventType: 'choice', title: '创业诱惑', weight: 3, text: '前同事下海创业成功了，开着一辆新车来请你吃饭。他说以你的能力和资源，出来干一年顶在体制内干十年。', choices: [
      { text: '婉拒邀请珍惜体制内稳定', effects: {integrity: 3, mentalPressure: -1, desire: -3, risk: -2} },
      { text: '认真考虑辞职创业', effects: {desire: 5, mentalPressure: 4, risk: 5, positionWeight: -3, workAbility: 1} },
      { text: '答应兼职帮忙积累经验', effects: {risk: 4, integrity: -3, desire: 3, mentalPressure: 3, workAbility: 1} },
      { text: '保持联系但不急于决定', effects: {eq: 1, background: 2, mentalPressure: 1, desire: 2} },
      { text: '介绍其他朋友给他认识', effects: {background: 2, eq: 1, mentalPressure: -1, risk: 1} },
    ]},
    // 子女择校
    { pools: ['public'], id: 'e064', stage: 'life', eventType: 'choice', title: '子女择校', weight: 5, requireChild: true, text: '孩子到了上学的年龄，择校成了头等大事。学区房买不起，找关系又不太愿意，公办学校教学质量又一般。', choices: [
      { text: '托人找关系进好学校', effects: {background: 2, familyPressure: -3, mentalPressure: 2, risk: 2, integrity: -2} },
      { text: '就近入学相信在哪里都能学好', effects: {integrity: 3, familyPressure: 2, mentalPressure: 1, desire: -1} },
      { text: '花钱请家教弥补差距', effects: {workAbility: 1, familyPressure: 2, mentalPressure: 2, iq: 1} },
      { text: '和几个家长一起租房陪读', effects: {familyPressure: 3, mentalPressure: 3, eq: 1, body: -1} },
      { text: '了解民办学校量力而行', effects: {iq: 2, familyPressure: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    // 财政赤字
    { id: 'e065', stage: 'work', eventType: 'choice', title: '财政赤字', weight: 4, text: '你分管的部门预算被大幅削减，但工作任务一点没少。巧妇难为无米之炊，同事们都在看着你怎么办。', choices: [
      { text: '精打细算优先保障核心业务', effects: {workAbility: 3, iq: 2, mentalPressure: 3, positionWeight: 1, risk: -1} },
      { text: '向上级申请追加预算', effects: {background: 2, eq: 1, mentalPressure: 2, risk: 1, positionWeight: 1} },
      { text: '压缩非必要开支勒紧裤腰带', effects: {integrity: 3, mentalPressure: 2, workAbility: 1, eq: -1} },
      { text: '争取社会资源合作', effects: {background: 3, eq: 1, risk: 2, mentalPressure: 2, workAbility: 1} },
      { text: '优化流程提高效率降低开支', effects: {iq: 3, workAbility: 3, mentalPressure: 3, risk: -1} },
    ]},
    // 信仰危机
    { pools: ['public'], id: 'e066', stage: 'life', eventType: 'choice', title: '信仰危机', weight: 3, text: '日复一日的重复工作让你开始怀疑人生的意义。你当年考公是为了稳定，但现在你只觉得稳定得让人窒息。', choices: [
      { text: '从群众感谢中获得满足', effects: {integrity: 3, mentalPressure: -3, workAbility: 2, desire: -2} },
      { text: '发展兴趣爱好工作只是生活一部分', effects: {mentalPressure: -4, desire: -1, workAbility: -1, eq: 1} },
      { text: '考虑辞职追求真正想要的生活', effects: {desire: 5, mentalPressure: 3, risk: 3, positionWeight: -3} },
      { text: '申请轮岗换部门换心情', effects: {workAbility: 2, mentalPressure: -2, background: 1, positionWeight: 1} },
      { text: '把精力投入到培养新人上', effects: {eq: 2, workAbility: 2, mentalPressure: -1, background: 2} },
    ]},
    // 年终考核
    { id: 'e067', stage: 'work', eventType: 'choice', title: '年终考核谈话', weight: 3, text: '年终考核结果出来了，你的评分在单位排名中等。领导找你谈话，暗示你"工作不够主动"，需要多表现。', choices: [
      { text: '虚心接受意见制定改进计划', effects: {eq: 1, workAbility: 3, mentalPressure: 2, positionWeight: 1, integrity: 1} },
      { text: '争取更多表现机会主动揽活', effects: {desire: 3, workAbility: 2, mentalPressure: 3, positionWeight: 2, risk: 1} },
      { text: '反思自己调整工作方式', effects: {workAbility: 2, iq: 1, mentalPressure: 2, integrity: 2} },
      { text: '认为考核不公找领导理论', effects: {integrity: 2, risk: 2, mentalPressure: 4, positionWeight: -2, eq: -1} },
      { text: '向优秀同事请教经验', effects: {eq: 1, workAbility: 2, background: 1, mentalPressure: 1} },
    ]},
    // 疫情防控
    { id: 'e068', stage: 'work', eventType: 'choice', title: '应急处置', weight: 3, text: '突发公共卫生事件，你被派往一线参与应急处置工作。连续奋战十几个小时，身心俱疲。', choices: [
      { text: '坚守岗位疫情不退我不退', effects: {integrity: 5, positionWeight: 3, body: -3, mentalPressure: 6, background: 3} },
      { text: '科学安排轮班保证休息', effects: {workAbility: 3, iq: 2, body: -1, mentalPressure: 2, eq: 1} },
      { text: '以身体原因申请调回后方', effects: {risk: -2, positionWeight: -2, mentalPressure: -1, integrity: -2, body: 1} },
      { text: '组织志愿者力量减轻负担', effects: {eq: 2, workAbility: 3, background: 2, mentalPressure: 3, positionWeight: 2} },
      { text: '做好防护同时宣传防疫知识', effects: {workAbility: 2, eq: 1, background: 2, mentalPressure: 3, integrity: 3} },
    ]},
    // 借调部委
    { id: 'e069', stage: 'work', eventType: 'choice', title: '借调部委', weight: 3, text: '上级部委发来借调函，希望借调你工作一年。这是一个接触高层工作的好机会，但借调期间原单位晋升可能会受影响。', choices: [
      { text: '抓住机会好好表现', effects: {background: 4, workAbility: 3, positionWeight: 2, mentalPressure: 4, risk: 1} },
      { text: '以家庭为由婉拒', effects: {familyPressure: -2, positionWeight: -2, mentalPressure: -1, desire: -2, reputation: 1} },
      { text: '和领导谈条件要求回来后优先晋升', effects: {desire: 4, positionWeight: 2, risk: 2, mentalPressure: 3, eq: 1} },
      { text: '接受但争取每周回原单位一天', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 2, positionWeight: 1} },
      { text: '推荐同事代替自己去', effects: {eq: 2, background: 2, mentalPressure: 1, positionWeight: -1, integrity: 1} },
    ]},
    // 跨部门合作
    { id: 'e070', stage: 'work', eventType: 'choice', title: '跨部门合作', weight: 3, text: '你被抽调参与一个跨部门重点项目，但你发现其他部门的人并不积极配合，进度严重滞后。', choices: [
      { text: '建立定期沟通机制对齐进度', effects: {workAbility: 3, eq: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '向上级反映协调困难', effects: {integrity: 2, risk: 1, mentalPressure: 2, background: 1} },
      { text: '主动承担更多工作推动项目', effects: {workAbility: 3, mentalPressure: 4, body: -1, positionWeight: 2} },
      { text: '找各科室负责人私下沟通', effects: {eq: 2, background: 2, mentalPressure: 1, risk: 1} },
      { text: '制定奖惩机制纳入考核', effects: {workAbility: 2, positionWeight: 2, risk: 2, mentalPressure: 3} },
    ]},
    // ====== 连锁事件链一：腐败线 ======
    // 由第一次拒收礼金的记录引出再试探；不再与 e051 原文五选一重叠。
    { id: 'e071', stage: 'work', eventType: 'choice', title: '利益诱惑（再试探）', weight: 5, requireFlag: 'refusedBribe', excludeFlag: 'tookBribe',
      text: '上次拒绝承建方的“咨询费”后，对方没有再联系。半年后，一位合作单位的人把一份研讨会邀请函放在你的桌上，另附“专家劳务”的收款说明。项目正在验收，函件上的组织单位恰好是那家承建方。', choices: [
      { text: '书面说明关联关系并回避评审，留下拒付记录', effects: {integrity: 5, risk: -5, reputation: 2, mentalPressure: 3, flag: 'refusedBribe'}, result: '纪检备案时你多写了两页说明，项目评审换了另一位经办人' },
      { text: '把邀请转交办公室核实主办方，不私下回应', effects: {integrity: 3, workAbility: 1, background: -1, mentalPressure: 2}, result: '办公室确认了利益关联，这封邀请函没有再被转发' },
      { text: '只参加技术讨论，不收劳务费，但仍参与验收', effects: {workAbility: 2, risk: 4, mentalPressure: 2, reputation: -1}, result: '会上讨论很专业，但事后的纪要里依然留下了你的名字' },
      { text: '以专家名义收下劳务费，认为与验收可以分开', effects: {wealth: 28, risk: 12, integrity: -8, heat: 8, reputation: -5, flag: 'tookBribe'}, result: '报账单上写着“劳务”，实际关系却没有因此变得清白' }
    ]},
    { pools: ['public'], id: 'e072', stage: 'life', eventType: 'auto', title: '奢靡生活', weight: 4, text: '最近你花钱大手大脚，买了新车换了新房。同事们私下议论纷纷，说你的收入怎么可能支撑这种消费。', requireFlag: 'tookBribe', effects: {risk: 8, reputation: -5, mentalPressure: 5} },
    { id: 'e073', stage: 'work', eventType: 'choice', title: '纪委调查', weight: 3, text: '纪委收到举报信，开始调查你的经济问题。你被要求配合调查，说明近期大额消费的来源。', requireFlag: 'tookBribe', choices: [
      { text: '主动交代问题争取从宽处理', effects: {integrity: 3, risk: -5, mentalPressure: 5, reputation: -3, positionWeight: -3} },
      { text: '编造理由试图蒙混过关', effects: {risk: 10, integrity: -8, mentalPressure: 8, reputation: -5, flag: 'liedToInvestigation'} },
      { text: '请律师帮助应对调查', effects: {iq: 2, risk: -2, mentalPressure: 3, reputation: -1} },
      { text: '销毁证据拒不承认', effects: {wealth: 10, risk: 12, integrity: -8, mentalPressure: 10, reputation: -6, flag: 'destroyedEvidence'} },
      { text: '找老领导帮忙说情', effects: {background: 2, risk: 2, mentalPressure: 3, reputation: -2, integrity: -2} },
    ]},
    { id: 'e074', stage: 'work', eventType: 'sudden', title: '被捕', weight: 3, text: '调查组掌握了确凿证据，你被依法逮捕。多年的体制生涯以这种方式画上了句号。', requireFlag: 'tookBribe', effects: {risk: 20, mentalPressure: 15}, terminal: 'arrest' },
    // ====== 连锁事件链二：正直线 ======
    { id: 'e075', stage: 'work', eventType: 'choice', title: '被排挤', weight: 3, text: '自从你拒绝了某些"潜规则"后，明显感觉到被同事孤立。重要会议不再通知你，好事也轮不到你。', requireFlag: 'refusedBribe', choices: [
      { text: '坚持原则相信组织会看到', effects: {integrity: 4, mentalPressure: 4, reputation: 4, positionWeight: -1} },
      { text: '主动找领导沟通说明情况', effects: {eq: 2, background: 2, mentalPressure: 2, positionWeight: 1, reputation: 1} },
      { text: '更加努力工作用业绩说话', effects: {workAbility: 4, mentalPressure: 3, body: -1, positionWeight: 1, reputation: 2} },
      { text: '开始怀疑自己的坚持是否值得', effects: {mentalPressure: 5, desire: 3, integrity: -2, reputation: -1} },
      { text: '联合其他被排挤的人抱团取暖', effects: {background: 2, eq: 1, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'e076', stage: 'work', eventType: 'choice', title: '贵人相助', weight: 3, text: '一位早已退休的老领导听说了你的处境，主动出面帮你说话。原来他一直在暗中关注你的表现，对你的正直印象深刻。', requireFlag: 'refusedBribe', choices: [
      { text: '感激老领导的帮助更加努力工作', effects: {workAbility: 3, positionWeight: 3, reputation: 4, background: 3, mentalPressure: -2} },
      { text: '借机请老领导多提携', effects: {background: 4, desire: 3, positionWeight: 2, mentalPressure: 2, reputation: 1} },
      { text: '婉拒帮助相信靠自己也能行', effects: {integrity: 3, workAbility: 2, mentalPressure: 1, reputation: 2, positionWeight: -1} },
      { text: '请老领导推荐更好的岗位', effects: {background: 3, positionWeight: 2, desire: 3, mentalPressure: 2, risk: 1} },
      { text: '把老领导的帮助记在心里以后回报', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: -1} },
    ]},
    { id: 'e077', stage: 'work', eventType: 'auto', title: '正名', weight: 3, text: '你的坚持终于得到了回报。上级在总结大会上公开表扬了你"坚持原则、廉洁奉公"的作风，号召大家向你学习。', requireFlag: 'refusedBribe', effects: {reputation: 8, positionWeight: 3, workAbility: 3, mentalPressure: -3, background: 2, familyPressure: -2} },
    // ====== 连锁事件链三：竞争线 ======
    { id: 'e078', stage: 'work', eventType: 'choice', title: '岗位竞聘拉票', weight: 5, text: '单位有一个重要岗位空缺，你和另一位同事都是热门人选。对方开始四处活动拉票，你感觉到了压力。', choices: [
      { text: '凭实力竞争，不搞小动作', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'fairCompetitor'} },
      { text: '也去拉关系争取支持', effects: {background: 3, desire: 2, mentalPressure: 2, risk: 1, reputation: -1} },
      { text: '找领导表达自己的意愿', effects: {positionWeight: 2, background: 2, desire: 2, mentalPressure: 2, reputation: 1} },
      { text: '散布竞争对手的不利言论', effects: {risk: 4, integrity: -5, mentalPressure: 3, reputation: -3, flag: 'dirtyCompetitor'} },
      { text: '专注做好本职工作顺其自然', effects: {workAbility: 3, mentalPressure: -1, integrity: 2, reputation: 1} },
    ]},
    { id: 'e079', stage: 'work', eventType: 'choice', title: '竞争结果', weight: 3, text: '岗位竞聘结果出来了。你得到的消息是——你和竞争对手票数非常接近，最终结果取决于领导的一票。', choices: [
      { text: '主动找领导汇报工作争取最后一票', effects: {positionWeight:3, background:2, desire:1, mentalPressure:1, reputation:2} },
      { text: '相信自己的表现已经足够好', effects: {integrity: 2, mentalPressure: 1, reputation: 1, positionWeight: -1} },
      { text: '打探竞争对手的动向', effects: {iq: 1, risk: 2, mentalPressure: 2, background: 1} },
      { text: '准备接受任何结果', effects: {integrity:2, mentalPressure:1, desire:-2, reputation:-1, positionWeight:-1} },
      { text: '联合其他同事给自己投票', effects: {background: 2, eq: 1, risk: 2, mentalPressure: 2, reputation: -1} },
    ]},
    { id: 'e080', stage: 'work', eventType: 'auto', title: '竞聘成功', weight: 3, text: '你成功获得了这个岗位！这是你职业生涯的一个重要里程碑。竞争对手虽然不服气，但也只能接受结果。', requireFlag: 'fairCompetitor', effects: {positionWeight: 2, reputation: 3, workAbility: 2, mentalPressure: -2, desire: 2} },
    // ====== 连锁事件链四：导师线 ======
    { id: 'e081', year: [28, 65], stage: 'work', eventType: 'choice', title: '导师退休（再遇良师）', weight: 5, excludeFlag: 'tookMentorOffer', text: '第二位带你入行的老领导要退休了。他把一箱工作笔记留给你："这些年的门道都在里面，你慢慢看。"他说退休前还能最后帮你一次，但怎么帮，看你的意思。', choices: [
      { text: '接过笔记，郑重表态好好干', effects: {desire: 3, positionWeight: 3, mentalPressure: 3, background: 2, risk: 1, workAbility: 1, flag: 'tookMentorOffer'} },
      { text: '感激婉拒，说自己会慢慢摸索', effects: {integrity: 3, eq: 2, mentalPressure: 1, background: 1, positionWeight: -1, reputation: 2, flag: 'tookMentorOffer'} },
      { text: '当场请教笔记里的门道', effects: {iq: 2, workAbility: 2, background: 2, mentalPressure: 1} },
      { text: '请老领导帮忙引荐上级单位', effects: {background: 4, positionWeight: 2, desire: 2, reputation: 1, risk: 1} },
      { text: '组织欢送会，把笔记当众展示', effects: {eq: 2, reputation: 2, background: 1, mentalPressure: -1} },
    ]},
    { id: 'e082', stage: 'work', eventType: 'choice', title: '新领导到任', weight: 3, text: '新领导到任了，风格和前任完全不同。他要求所有工作"推倒重来"，你之前的努力可能白费了。', choices: [
      { text: '积极适应新领导的工作方式', effects: {eq: 2, workAbility: 2, mentalPressure: 2, positionWeight: 1, reputation: 1} },
      { text: '保留原有工作成果等待时机', effects: {iq: 2, workAbility: 1, mentalPressure: 1, risk: 1, positionWeight: -1} },
      { text: '联合老同事表达不同意见', effects: {background: 2, eq: 1, risk: 2, mentalPressure: 3, positionWeight: -1} },
      { text: '主动向新领导汇报原有工作', effects: {background: 2, positionWeight: 2, eq: 1, mentalPressure: 2, reputation: 1} },
      { text: '按新要求重新开始', effects: {workAbility: 2, mentalPressure: 3, desire: -1, positionWeight: 1} },
    ]},
    { id: 'e083', stage: 'work', eventType: 'auto', title: '导师遗产', weight: 4, text: '已经退休的老领导在行业内还有很大影响力。他在一次行业会议上提到了你的名字，让很多高层对你有了印象。', requireFlag: 'tookMentorOffer', effects: {background: 5, positionWeight: 3, reputation: 3, mentalPressure: -1} },
    // ====== 连锁事件链五：家庭线 ======
    { pools: ['public'], id: 'e084', stage: 'life', eventType: 'choice', title: '结婚', weight: 5, text: '你恋爱了，对方是个温柔体贴的人，支持你的事业。你们到了谈婚论嫁的阶段，但结婚后可能要考虑家庭和工作的平衡。', requireSingle: true, year: [22, 55], choices: [
      { text: '求婚结婚开启人生新阶段', effects: {marry: true, familyPressure: 2, mentalPressure: 1, reputation: 2, eq: 3, integrity: 1, family: 2} },
      { text: '先事业后家庭再等两年', effects: {workAbility: 2, desire: 2, mentalPressure: 1, familyPressure: 1} },
      { text: '和对方商量未来规划后结婚', effects: {marry: true, eq: 2, reputation: 1, mentalPressure: -1, familyPressure: 1} },
      { text: '低调领证不办婚礼', effects: {marry: true, familyPressure: 1, mentalPressure: 1, reputation: -1, integrity: 1} },
      { text: '暂缓领证，先约定家务与生活安排', effects: {risk: 1, eq: 1, mentalPressure: 1, reputation: -1} },
    ]},
    { pools: ['public'], id: 'e085', stage: 'life', eventType: 'choice', title: '喜得麟儿', weight: 8, year: [22, 45], text: '你惊喜地发现伴侣怀孕了！初为人父/人母的期待与忐忑一起涌上心头——孩子的到来意味着更多的责任和开销，但也是人生最踏实的幸福。', requireMarried: true, requireNoChild: true, requireGender: '男', choices: [
      { text: '请产假/陪产假全心照顾', effects: {body: 1, eq: 1, child: true, familyPressure: 3, mentalPressure: 3, workAbility: -2, positionWeight: -1, family: 1} },
      { text: '请父母帮忙带孩子', effects: {child: true, familyPressure: 2, background: 1, mentalPressure: 2, workAbility: -1} },
      { text: '请保姆减轻负担', effects: {child: true, familyPressure: 2, mentalPressure: 2, workAbility: 1} },
      { text: '减少工作量多陪孩子', effects: {body: 1, eq: 1, integrity: 1, child: true, familyPressure: 2, mentalPressure: 2, positionWeight: -2, workAbility: -1} },
      { text: '工作和家庭各占一半', effects: {child: true, body: -1, mentalPressure: 1, workAbility: 1, familyPressure: 2} },
    ]},
];
