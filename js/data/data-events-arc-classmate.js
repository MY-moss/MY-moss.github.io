// 第三轮：林默创业求助的分支后果。复用 e094 起点及既有人脉、flag、年鉴结构。
const gd_events_arc_classmate = [
  { id:'arc_classmate_open_2',stage:'life',eventType:'choice',title:'两年后的申请回执',
    text:'两年后，林默的小厂终于拿到一项公开项目的试点资格。他没有在电话里庆祝，只寄来当年窗口盖章的受理回执。项目要求每季度公开执行数据，他请你帮忙看看第一版报表。',choices:[
    {text:'帮他检查报表是否完整，但明确由第三方独立审核',effects:{flag:'classmateOpenReviewed',workAbility:2,integrity:3,mentalPressure:3,contactDelta:{target:'oldClassmate',trust:9,relation:6},careerLogNote:'帮助林默规范项目报表，保持公开审核的边界。'},result:'你标记了六处缺项，林默逐项改好后才把表发出去。'},
    {text:'告诉他这是企业自己的责任，鼓励他找专业会计',effects:{flag:'classmateOpenReviewed',integrity:2,mentalPressure:-2,contactDelta:{target:'oldClassmate',trust:5,relation:-2},careerLogNote:'建议林默聘请独立会计，不再亲自经手企业项目。'},result:'林默在电话里叹了口气，说你说得对，他总不能事事靠老同学。'}
  ]},
  { id:'arc_classmate_favor_2',stage:'work',eventType:'choice',title:'两年后的核查函',
    text:'两年后，你收到一份项目审查协查函。林默曾托你打招呼的那项申请正在复核，审查人员想核对你的电话记录。林默发来消息：“只是帮了个忙，不会牵连你吧？”你看了很久。',choices:[
    {text:'如实说明当年的请托和来往记录，并申请回避',effects:{flag:'classmateFavorReviewed',integrity:5,risk:-4,heat:2,reputation:-2,mentalPressure:5,contactDelta:{target:'oldClassmate',trust:-3,relation:-5},careerLogNote:'两年后接受创业项目复核，说明曾替林默打招呼并主动回避。'},result:'审查记录留了下来，林默在电话里不再称呼你“老同学”。'},
    {text:'淡化私下联系，想办法让复核尽快结束',effects:{flag:'classmateFavorReviewed',integrity:-5,risk:11,heat:7,background:2,mentalPressure:6,contactDelta:{target:'oldClassmate',trust:-8,relation:4},careerLogNote:'项目复核时隐瞒了私下请托，留下一笔难以抹掉的旧账。'},result:'函件暂时没有追问，但新的联络人又来询问你当年的工作分工。'}
  ]},
  { id:'arc_classmate_boundary_2',stage:'life',eventType:'choice',title:'两年后的旧账本',
    text:'两年后，林默带了一本旧账来见你。他没有再提“内部路子”，只说自己缩小了厂房，逐步还掉欠款。翻到最后一页时，他问你能否介绍一个靠谱的外部会计。',choices:[
    {text:'介绍公开可查的专业服务机构，让他自己比较报价',effects:{flag:'classmateBoundaryReviewed',eq:1,integrity:2,mentalPressure:-2,contactDelta:{target:'oldClassmate',trust:8,relation:5},careerLogNote:'两年后为林默提供公开市场信息，仍没有利用公务身份替他牵线。'},result:'林默做了一个费用比较表，笑说这回他终于学会自己查了。'},
    {text:'只听他讲完旧事，不再参与企业经营问题',effects:{flag:'classmateBoundaryReviewed',mentalPressure:-3,familyPressure:-1,contactDelta:{target:'oldClassmate',trust:2,relation:2},careerLogNote:'与林默保留私人友谊，不再参与其企业事务。'},result:'账本合上以后，你们聊起了大学食堂。'}
  ]},
  { id:'arc_classmate_open_3',stage:'career',eventType:'choice',title:'五年后的车间',
    text:'五年后，你出差路过林默的厂房。车间里装了新的除尘设备，一份公开验收报告贴在门口。林默说扩大规模时他也想过走捷径，但后来觉得制度做起来，企业才能长久。',choices:[
    {text:'记录这家企业的公开经验，供本单位改善服务流程',effects:{workAbility:3,peopleReputation:3,mentalPressure:2,careerLogNote:'五年后把林默的经历写成公开服务案例，留给接手项目的同事。'},result:'你没有写下他的名字，只把办理中最折腾人的几道手续列了出来。'},
    {text:'不把老同学当工作资源，抽空和他安静吃一顿饭',effects:{mentalPressure:-4,eq:1,contactDelta:{target:'oldClassmate',relation:6,trust:4},careerLogNote:'五年后与林默在车间重聚，把这段关系留在了生活里。'},result:'饭馆里没有人提级别和项目，你们第一次聊起彼此的孩子。'}
  ]},
  { id:'arc_classmate_favor_3',stage:'career',eventType:'choice',title:'五年后的联系人',
    text:'五年后，曾经那份项目审核资料被重新提起。林默换了号码，却托别人说想再见你一次。你翻出手机里旧日的通话记录，突然明白当年的那句“只是帮个忙”从来没有真正结束。',choices:[
    {text:'保留往来证据，按程序把情况向组织如实说明',effects:{integrity:5,risk:-5,mentalPressure:5,reputation:-2,careerLogNote:'五年后主动说明历史请托和资料，不再让旧关系影响岗位判断。'},result:'递交说明那天，窗外下着雨。此后很长一段时间，你没有再接到林默的电话。'},
    {text:'继续维持私下关系，寄希望于以后不再有人追问',effects:{integrity:-5,risk:9,heat:6,background:1,careerLogNote:'五年后仍选择隐瞒旧日请托，风险与彼此的关系继续纠缠。'},result:'手机屏幕再次亮起，你犹豫着按下了接听。'}
  ]},
  { id:'arc_classmate_boundary_3',stage:'life',eventType:'choice',title:'五年后的同学会',
    text:'五年后的同学会上，林默说他终于把工厂欠款还清了。他挨着你坐下，说当年你没有替他打招呼，他一度觉得你不讲情面，现在反而庆幸自己有机会把路走稳。',choices:[
    {text:'认真听他讲完这些年，答应以后还像朋友一样见面',effects:{eq:2,mentalPressure:-3,contactDelta:{target:'oldClassmate',trust:6,relation:6},careerLogNote:'五年后与林默重逢，一段没有互相请托的友谊得以保留。'},result:'散场时林默递来一张旧照片，两个人年轻得像不认识现在的自己。'},
    {text:'各自祝福，承认人生走向不同但不必强求靠近',effects:{mentalPressure:-4,integrity:1,contactDelta:{target:'oldClassmate',relation:1},careerLogNote:'五年后与林默释然告别，没有把往日关系变成新的负担。'},result:'电梯门关上前，他朝你点了一次头。'}
  ]}
];
