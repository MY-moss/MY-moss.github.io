// ===== 跨系统短链扩展包 =====
// id 范围：e424~e652（140条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：廉政建设/危机处置等跨系统短链事件，文件内以章节注释分组
const gd_events_ext = [
    // ====== 新短链：廉政建设链 ======
    { id: 'e424', stage: 'work', eventType: 'choice', title: '廉政教育', weight: 5, text: '单位组织参观廉政教育基地，一个个触目惊心的案例让你深受震撼。那些曾经也是前途无量的干部，如今高墙内泪流满面。', choices: [
      { text: '深受触动，写下心得体会', effects: {integrity: 4, mentalPressure: 2, risk: -2, workAbility: 1, flag: 'integrityEdu'} },
      { text: '拍照发朋友圈，展示学习态度', effects: {desire: 2, positionWeight: -1, reputation: -1, integrity: -2} },
      { text: '借机反思自己工作中的风险点', effects: {iq: 2, integrity: 3, risk: -3, workAbility: 1, flag: 'integrityEdu'} },
      { text: '走马观花，没太大感觉', effects: {mentalPressure: -1, integrity: -1, risk: 1} },
      { text: '和同事讨论如何防范廉政风险', effects: {eq: 1, integrity: 2, background: 1, workAbility: 1, flag: 'integrityEdu'} },
    ]},
    { id: 'e425', stage: 'work', eventType: 'auto', title: '廉洁楷模', weight: 5, text: '你在廉政教育中的深刻反思被单位作为典型宣传。在年度廉政考核中，你被评为"廉洁自律先进个人"。', requireFlag: 'integrityEdu', effects: {reputation: 4, integrity: 3, positionWeight: 2, mentalPressure: -2, risk: -2} },

    // ====== 新短链：应对危机链 ======
    { id: 'e426', stage: 'work', eventType: 'choice', title: '突发舆情', weight: 5, text: '一条关于你单位的不实信息在网上快速传播，已经上了同城热搜。领导让你迅速拿出应对方案。', choices: [
      { text: '迅速核实事实，发布权威辟谣', effects: {workAbility: 3, iq: 2, mentalPressure: 4, reputation: 2, risk: -1, flag: 'crisisResponse'} },
      { text: '联系网信办协调删帖', effects: {background: 2, mentalPressure: 2, risk: 2, reputation: 1} },
      { text: '冷处理，等热度自然消退', effects: {risk: 2, mentalPressure: 1, reputation: -1, integrity: -1} },
      { text: '主动联系媒体正面回应', effects: {eq: 1, workAbility: 2, mentalPressure: 3, reputation: 2} },
      { text: '向上级汇报请求指导', effects: {background: 2, positionWeight: 1, mentalPressure: 2, integrity: 1} },
    ]},
    { id: 'e427', stage: 'work', eventType: 'auto', title: '舆情化解', weight: 5, text: '舆情危机成功化解！不仅澄清了不实信息，你还通过这次事件建立了单位的舆情应对机制，成为系统内的"危机处理专家"。', requireFlag: 'crisisResponse', effects: {reputation: 5, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },

    // ====== 新短链：团队建设链 ======
    { id: 'e428', stage: 'work', eventType: 'choice', title: '团队矛盾', weight: 5, text: '你所在的科室两位骨干因为工作分工问题闹得不可开交，严重影响了科室工作氛围。你是科室负责人，必须出面解决。', choices: [
      { text: '分别谈心，了解矛盾根源', effects: {eq: 2, workAbility: 2, mentalPressure: 3, background: 1, integrity: 2, flag: 'teamBuilding'} },
      { text: '重新调整分工，各取所长', effects: {workAbility: 2, eq: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '开科室会把问题摆在桌面上', effects: {integrity: 3, mentalPressure: 3, risk: 1, reputation: 1} },
      { text: '各打五十大板', effects: {mentalPressure: 2, risk: 1, reputation: -1, eq: -1} },
      { text: '请领导出面协调', effects: {background: 2, positionWeight: 1, mentalPressure: 1, eq: 1} },
    ]},
    { id: 'e429', stage: 'work', eventType: 'auto', title: '团队和谐', weight: 5, text: '在你的调解下，两位骨干冰释前嫌，科室工作氛围焕然一新。年底科室被评为"先进集体"，你功不可没。', requireFlag: 'teamBuilding', effects: {reputation: 4, positionWeight: 3, eq: 1, workAbility: 2, mentalPressure: -2} },

    // ====== 新短链：能力提升链 ======
    { id: 'e430', stage: 'work', eventType: 'choice', title: '技能竞赛（省赛）', weight: 5, text: '省里举办业务技能大比武，单位推荐你参加。你平时工作很忙，准备时间有限，但这是一个展示自己的好机会。', choices: [
      { text: '挤出时间认真备赛', effects: {workAbility: 3, body: -1, mentalPressure: 4, reputation: 2, desire: 2, flag: 'skillComp'} },
      { text: '重在参与，不给自己太大压力', effects: {mentalPressure: -1, workAbility: 1, reputation: 1} },
      { text: '请教往年获奖者取经', effects: {eq: 1, background: 1, workAbility: 2, mentalPressure: 2} },
      { text: '以工作太忙为由推掉', effects: {mentalPressure: -1, iq: 1, positionWeight: -1, desire: -1, reputation: -1} },
      { text: '晚上和周末集中训练', effects: {workAbility: 3, body: -2, mentalPressure: 4, reputation: 2, flag: 'skillComp'} },
    ]},
    { id: 'e431', stage: 'work', eventType: 'auto', title: '竞赛获奖', weight: 5, text: '你在全省业务技能大比武中获得了二等奖！颁奖时，省领导为你颁奖，鼓励你"继续努力，争当业务标兵"。', requireFlag: 'skillComp', effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -2, desire: 2} },

    // ====== 新生活事件 ======
    { id: 'e432', stage: 'life', eventType: 'choice', title: '邻里互助', weight: 5, text: '对门邻居是一位独居老人，最近身体不好。老人的子女在外地工作，平时很少回来。老人向你求助，希望你能帮忙买药。', pools: ['public'], choices: [
      { text: '热心帮忙，定期看望老人', effects: {integrity: 3, eq: 1, reputation: 2, mentalPressure: 1, background: 1, flag: 'neighborHelp', luck: 1} },
      { text: '帮老人联系社区网格员', effects: {workAbility: 2, eq: 1, integrity: 2, mentalPressure: 1} },
      { text: '给老人子女打电话说明情况', effects: {eq: 1, integrity: 2, mentalPressure: 1, background: 1} },
      { text: '表示自己太忙了无能为力', effects: {mentalPressure: -1, eq: -1, integrity: -1, reputation: -1} },
      { text: '帮老人下载APP学会网上买药', effects: {iq: 2, workAbility: 2, eq: 1, mentalPressure: 1} },
    ]},
    { id: 'e433', stage: 'life', eventType: 'auto', title: '好邻居', weight: 5, text: '你帮助独居老人的事迹在社区传开了，社区居委会给你送来了"好邻居"荣誉证书。老人在国外的子女专门打电话向你道谢。', requireFlag: 'neighborHelp', pools: ['public'], effects: {reputation: 3, eq: 1, integrity: 2, mentalPressure: -2, background: 1} },
    { id: 'e434', stage: 'life', eventType: 'choice', title: '亲子关系', weight: 5, text: '你的孩子进入青春期，开始有了自己的主见。最近老师反映孩子在学校成绩下滑，你意识到自己因为工作忙已经很久没和孩子好好沟通了。', pools: ['public'], requireChild: true, requireChildAgeMin: 12, choices: [ // v2.67 补年龄门槛（'进入青春期'需 12+，原无门槛新生儿也触发）
      { text: '放下工作，抽时间陪孩子谈心', effects: {familyPressure: -3, mentalPressure: 2, eq: 1, workAbility: -1, reputation: 1, luck: 1} },
      { text: '给孩子报辅导班提高成绩', effects: {familyPressure: 2, mentalPressure: 2, workAbility: 1, desire: 1} },
      { text: '和老师沟通了解情况', effects: {eq: 1, workAbility: 1, mentalPressure: 1, familyPressure: 1} },
      { text: '严格要求，制定学习计划', effects: {familyPressure: 3, mentalPressure: -1, workAbility: 1, desire: 1} },
      { text: '带孩子出去玩改善关系', effects: {familyPressure: -3, mentalPressure: -2, eq: 1, reputation: 1} },
    ]},
    { id: 'e435', year: [30, 65], stage: 'life', eventType: 'choice', title: '父母养老', weight: 5, text: '父母年纪大了，身体越来越差。你工作忙，很少能回去看望。电话里他们总是说"我们都好，你好好工作"，但你心里不是滋味。', pools: ['public'], choices: [
      { text: '接父母到身边来住', effects: {familyPressure: 3, mentalPressure: 2, family: 1, reputation: 1, eq: 1, flag: 'parentCare'} },
      { text: '请保姆照顾父母', effects: {familyPressure: 2, mentalPressure: 1, family: 1, workAbility: 1} },
      { text: '定期回家看望', effects: {familyPressure: -2, mentalPressure: -1, eq: 1, workAbility: -1} },
      { text: '多给父母寄钱表示孝心', effects: {familyPressure: 1, mentalPressure: 1, family: 1, desire: 1} },
      { text: '联系社区居家养老服务中心', effects: {iq: 2, workAbility: 1, familyPressure: -1, mentalPressure: 1} },
    ]},
    { id: 'e436', stage: 'life', eventType: 'auto', title: '孝心可嘉', weight: 5, text: '你把父母接来同住后，虽然生活上多了些不便，但每天回家能看到父母的笑容，心里踏实多了。同事们都夸你孝顺。', requireFlag: 'parentCare', pools: ['public'], effects: {familyPressure: -3, mentalPressure: -2, eq: 1, reputation: 2, family: 1} },
    { id: 'e437', stage: 'life', eventType: 'choice', title: '健身达人', weight: 5, text: '你坚持健身了一段时间，身体素质明显改善，精神状态也好了很多。同事们都说你看起来年轻了好几岁。', pools: ['public'], requireBody: 3, choices: [
      { text: '继续保持，挑战更高强度', effects: {body: 2, mentalPressure: -2, workAbility: 1, eq: 1, reputation: 1} },
      { text: '参加单位运动会展示成果', effects: {reputation: 2, body: 1, mentalPressure: -1, eq: 1, background: 1} },
      { text: '带动同事一起健身', effects: {eq: 1, background: 1, reputation: 1, body: 1, flag: 'fitnessLeader'} },
      { text: '报名参加马拉松', effects: {body: 2, mentalPressure: -2, reputation: 2, workAbility: 1} },
      { text: '开始注意饮食搭配', effects: {body: 1, mentalPressure: -1, integrity: 1, familyPressure: 1} },
    ]},
    { id: 'e438', stage: 'life', eventType: 'auto', title: '健身热潮', weight: 5, text: '在你的带动下，单位掀起了健身热潮！工会专门成立了健身协会，你被推举为会长。单位的整体精神面貌都好了很多。', requireFlag: 'fitnessLeader', pools: ['public'], effects: {reputation: 3, body: 1, eq: 1, background: 1, mentalPressure: -2} },

    // ====== 更多腐败/伦理事件 ======
    { id: 'e439', stage: 'work', eventType: 'choice', title: '人情往来（请托）', weight: 5, text: '一个多年好友请你帮忙"在项目审批上打个招呼"，说事成之后必有重谢。你清楚这违规，但多年的交情让你很难开口拒绝。', pools: ['public'], choices: [
      { text: '讲明纪律，婉言谢绝', effects: {integrity: 4, risk: -3, mentalPressure: 2, reputation: 1, eq: 1} },
      { text: '在不违规前提下指导他走流程', effects: {eq: 1, background: 1, risk: -1, mentalPressure: 1, integrity: 1} },
      { text: '答应帮忙，收取好处', effects: {wealth: 25, desire: 3, body: 1, background: 3, familyPressure: -2, positionWeight: 2, risk: 6, heat: 6, integrity: -4, mentalPressure: 3, flag: 'tookBribe'} }, // v2.59 补 heat（原收贿无热度，轻度腐败调查热力通道缺失）
      { text: '假装答应，但拖着不办', effects: {risk: 3, integrity: -2, mentalPressure: -1, reputation: -1} },
      { text: '介绍给其他能帮忙的人', effects: {background: 2, risk: 3, integrity: -2, mentalPressure: 2} },
    ]},
    { id: 'e440', stage: 'work', eventType: 'choice', title: '项目招标', weight: 5, text: '你负责的一个重大项目招标，你的亲戚也来投标了。亲戚找到你，希望你能"关照一下"，说这是家族的大事。', pools: ['public'], choices: [
      { text: '严格执行招标程序，不偏袒', effects: {integrity: 4, workAbility: 2, risk: -2, mentalPressure: 3, reputation: 2, flag: 'refusedBribe'} },
      { text: '在合法范围内给亲戚一些指导', effects: {eq: 1, background: 1, risk: 2, mentalPressure: 2, integrity: 1} },
      { text: '主动回避，让其他同事负责', effects: {integrity: 3, mentalPressure: 1, reputation: 1, positionWeight: -1} },
      { text: '暗示亲戚找其他评委帮忙', effects: {wealth: 15, familyPressure: -3, background: 2, risk: 4, integrity: -3, mentalPressure: 2, flag: 'nepotismHire'} },
      { text: '向领导说明情况请求指示', effects: {integrity: 3, background: 2, mentalPressure: 2, positionWeight: 1} },
    ]},

    // ====== 特殊条件触发：长期未晋升的安慰 ======
    { id: 'e441', stage: 'work', eventType: 'auto', title: '憨厚的老黄牛', weight: 5, text: '你在这个岗位上默默奉献了多年，虽然没有晋升，但大家都看在眼里。群众说"这个干部实在"，领导说"这个同志可靠"。', minYear: 10, effects: {reputation: 3, workAbility: 2, integrity: 2, mentalPressure: -2, positionWeight: 1, peopleReputation: 3} },
    { id: 'e442', stage: 'work', eventType: 'choice', title: '中年转岗', year: [35, 55], weight: 5, text: '你在一个岗位干了太久，领导找你谈话，希望你能轮岗到其他部门。你在这个岗位轻车熟路，换个新环境要从头开始。', choices: [
      { text: '服从组织安排，接受新挑战', effects: {workAbility: 2, desire: 2, mentalPressure: 3, reputation: 1, eq: 1, flag: 'rotation'} },
      { text: '表达自己的想法，争取留下', effects: {eq: 1, mentalPressure: 1, positionWeight: 1, workAbility: 1} },
      { text: '提出想去更好部门的想法', effects: {desire: 2, background: 2, mentalPressure: 2, risk: 1} },
      { text: '以家庭原因为由拒绝轮岗', effects: {familyPressure: -1, mentalPressure: 1, positionWeight: -1, reputation: -1} },
      { text: '建议让年轻同志去轮岗', effects: {eq: 1, background: 1, mentalPressure: 1, positionWeight: -1} },
    ]},
    { id: 'e443', stage: 'work', eventType: 'auto', title: '轮岗新篇', weight: 5, text: '轮岗到新部门后，你发现新的工作环境让你焕发了第二春。原来你不是能力不行，只是需要新的挑战来激发潜能。', requireFlag: 'rotation', effects: {workAbility: 3, desire: 2, mentalPressure: -2, positionWeight: 2, background: 1} },

    // ====== 高年资专属事件 ======
    { id: 'e444', stage: 'work', eventType: 'choice', title: '青蓝相传', weight: 5, text: '你是单位里的老同志了，新来的年轻人把你当偶像。你看着他们，就像看到了当年的自己。你决定把自己的经验传授给他们。', minYear: 15, choices: [
      { text: '主动带徒弟，手把手教', effects: {eq: 2, reputation: 3, workAbility: 2, background: 2, mentalPressure: 2, flag: 'teachJuniors'} },
      { text: '在单位内开设业务讲座', effects: {workAbility: 2, reputation: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '写一本业务操作手册留给后人', effects: {workAbility: 3, iq: 2, reputation: 2, mentalPressure: 1, flag: 'teachJuniors'} },
      { text: '告诉年轻人要靠自己摸索', effects: {mentalPressure: -1, reputation: -1, eq: -1, integrity: -1, desire: 1} },
      { text: '推荐年轻人参加培训学习', effects: {eq: 1, background: 1, reputation: 1, workAbility: 1} },
    ]},
    { id: 'e445', stage: 'work', eventType: 'auto', title: '桃李满园', weight: 5, text: '你带出的几个年轻人都成了单位的骨干，他们逢人就说"是老师教得好"。你虽然职级不高，但受到的尊重不比任何领导少。', requireFlag: 'teachJuniors', effects: {reputation: 5, positionWeight: 2, eq: 1, background: 2, mentalPressure: -2} },

    // =====================================================================
    // 第四批新增：基层专属事件池（10+事件，含正负面各方面）
    // =====================================================================
    { id: 'e446', stage: 'work', eventType: 'choice', title: '走访困难群众', weight: 5, text: '你到村里走访困难群众，发现一户人家房屋漏雨、老人卧病在床。但救助名单上并没有这户人家的名字——村干部说"他们不符合条件"。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '详细调查，如实上报', effects: {integrity: 3, workAbility: 2, reputation: 2, mentalPressure: 3, eq: 1, peopleReputation: 3} },
      { text: '自己掏钱先帮老人修房', effects: {integrity: 3, reputation: 2, familyPressure: 2, mentalPressure: 1, peopleReputation: 3} },
      { text: '找村干部理论，要求重新评议', effects: {eq: 1, risk: 2, workAbility: 1, mentalPressure: 2, flag: 'confrontVillage', peopleReputation: 1} },
      { text: '记录在案，回单位汇报', effects: {workAbility: 2, integrity: 2, mentalPressure: 1, background: 1, peopleReputation: 2} },
      { text: '帮老人写低保申请书', effects: {eq: 1, workAbility: 2, integrity: 3, mentalPressure: 1, peopleReputation: 4} },
    ]},
    { id: 'e447', stage: 'work', eventType: 'auto', title: '群众送锦旗', weight: 4, text: '那位老人低保批下来了！他让孙子写了一面锦旗送到乡镇政府，上面歪歪扭扭地写着"人民好干部"。你看着锦旗，眼眶有些湿润。', requireFlag: 'confrontVillage', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 5, positionWeight: 2, workAbility: 2, mentalPressure: -3, integrity: 2, peopleReputation: 6} },
    { id: 'e448', stage: 'work', eventType: 'choice', title: '村级换届', weight: 5, text: '村两委换届选举在即，你负责指导一个村的换届工作。但村里宗族势力复杂，两大家族明争暗斗，都希望自己的人当选。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '严格按程序办，确保公平公正', effects: {integrity: 4, workAbility: 2, mentalPressure: 4, reputation: 2, flag: 'fairElection'} },
      { text: '先做两家的思想工作', effects: {eq: 2, mentalPressure: 2, background: 1, reputation: 1} },
      { text: '请乡镇领导出面协调', effects: {background: 2, mentalPressure: 1, positionWeight: 1, eq: 1} },
      { text: '偏向一方，快速完成任务', effects: {risk: 4, integrity: -3, mentalPressure: 3, reputation: -2, desire: 2} },
      { text: '引入第三方监督', effects: {iq: 2, integrity: 3, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'e449', stage: 'work', eventType: 'auto', title: '换届成功', weight: 3, text: '换届选举顺利完成！新当选的村两委班子团结和谐，村民们都说是"最公平的一次选举"。县里把你的做法作为典型案例推广。', requireFlag: 'fairElection', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, background: 2, mentalPressure: -2, peopleReputation: 3} },
    { id: 'e450', stage: 'work', eventType: 'choice', title: '农产品滞销（果农）', weight: 5, text: '你负责的村今年水果大丰收，但行情不好，大量水果烂在地里无人问津。果农们急得团团转，有人甚至说要上访。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '联系电商平台帮农户找销路', effects: {iq: 2, workAbility: 3, reputation: 2, mentalPressure: 3, flag: 'helpSell'} },
      { text: '发动单位同事和朋友购买', effects: {eq: 2, background: 2, mentalPressure: 2, reputation: 1} },
      { text: '联系超市和批发商对接', effects: {workAbility: 2, background: 2, mentalPressure: 2, eq: 1} },
      { text: '建议农户加工成干货延长保质期', effects: {iq: 3, workAbility: 2, mentalPressure: 2} },
      { text: '上报县里请求启动应急预案', effects: {background: 2, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'e451', stage: 'work', eventType: 'auto', title: '助农成功', weight: 3, text: '在你的多方协调下，滞销水果终于找到了销路！果农们拉着你的手说"要不是你，今年的收成就全完了"。县领导也对你刮目相看。', requireFlag: 'helpSell', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 5, positionWeight: 2, workAbility: 2, eq: 1, mentalPressure: -2} },
    { id: 'e452', stage: 'work', eventType: 'choice', title: '村级债务', weight: 4, text: '你到一个村调研，发现村里欠了一屁股债——修路欠的、建广场欠的、甚至接待上级检查也欠了饭钱。村支书愁得一夜白头。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '详细核查债务，制定还款计划', effects: {workAbility: 3, iq: 2, mentalPressure: 3, integrity: 2, flag: 'debtManage'} },
      { text: '向上级申请化债资金', effects: {background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '帮村里发展集体经济增收', effects: {iq: 2, workAbility: 3, desire: 2, mentalPressure: 3} },
      { text: '建议通过法律途径处理', effects: {integrity: 2, risk: 1, mentalPressure: 1} },
      { text: '让村支书自己想办法', effects: {mentalPressure: -1, reputation: -1, eq: -1, desire: 1} },
    ]},
    { id: 'e453', stage: 'work', eventType: 'choice', title: '留守儿童', weight: 4, text: '你发现村里有十几个留守儿童，父母都在外地打工。孩子们放学后无人管，有的甚至开始沉迷手机游戏。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '组建"四点半课堂"志愿者辅导', effects: {eq: 2, workAbility: 2, reputation: 3, mentalPressure: 2, integrity: 2, flag: 'childrenCare'} },
      { text: '联系公益组织捐赠学习用品', effects: {background: 2, reputation: 2, mentalPressure: 1, eq: 1} },
      { text: '建一个村级图书阅览室', effects: {workAbility: 2, iq: 2, reputation: 2, mentalPressure: 2} },
      { text: '给孩子们的父母打电话沟通', effects: {eq: 1, workAbility: 1, mentalPressure: 2, integrity: 1} },
      { text: '工作太忙顾不上', effects: {mentalPressure: -1, reputation: -1, integrity: -1} },
    ]},
    { id: 'e454', stage: 'work', eventType: 'auto', title: '关爱典范', weight: 3, text: '你的"四点半课堂"成了全县的关爱留守儿童典型！省妇联来调研，把你的做法写进了工作报告。孩子们叫你"老师"，你觉得比什么表彰都值。', requireFlag: 'childrenCare', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 6, positionWeight: 3, eq: 1, workAbility: 2, mentalPressure: -2} },
    { id: 'e455', stage: 'work', eventType: 'choice', title: '村民排水纠纷', weight: 4, text: '两户村民因为排水沟的问题闹了半年，从吵架到打架，村里调解了三次都没用。最后找到了你这里。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '实地查看，画出双方都能接受的方案', effects: {workAbility: 3, eq: 1, integrity: 2, mentalPressure: 2, reputation: 2} },
      { text: '请双方家族中有威望的人出面', effects: {eq: 2, background: 2, mentalPressure: 1, reputation: 1} },
      { text: '按村规民约裁决', effects: {integrity: 2, mentalPressure: 1, reputation: 1, risk: 1} },
      { text: '各打五十大板，强制执行', effects: {risk: 2, mentalPressure: 2, reputation: -1, integrity: -1} },
      { text: '出钱帮两家修排水沟', effects: {integrity: 2, reputation: 2, familyPressure: 2, mentalPressure: 1} },
    ]},
    { id: 'e456', stage: 'work', eventType: 'sudden', title: '山体滑坡', weight: 3, text: '连续暴雨导致山体滑坡，一处村民房屋被埋！你接到电话时正在吃晚饭，筷子掉在地上都没注意。', pools: ['乡镇', '街道', '基层单位'], effects: {mentalPressure: 10, workAbility: 2, body: -1, risk: 3} },
    { id: 'e457', stage: 'work', eventType: 'choice', title: '应急抢险', weight: 4, text: '滑坡现场一片混乱。有人在哭喊，有人在挖土，还有人在拍照发朋友圈。你必须立刻做出决策。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '组织专业救援，科学施救', effects: {workAbility: 4, integrity: 3, mentalPressure: 5, reputation: 3, body: -2, flag: 'rescueOp', luck: -1} },
      { text: '自己冲上去徒手挖人', effects: {integrity: 4, body: -3, mentalPressure: 6, reputation: 3, risk: 2} },
      { text: '协调各方力量，统一指挥', effects: {eq: 2, workAbility: 3, mentalPressure: 4, background: 2, positionWeight: 2} },
      { text: '先疏散周围群众防止二次灾害', effects: {iq: 3, workAbility: 2, mentalPressure: 3, integrity: 2} },
      { text: '等县里救援队到来再行动', effects: {risk: 2, mentalPressure: 2, reputation: -2, integrity: -2} },
    ]},
    { id: 'e458', stage: 'work', eventType: 'auto', title: '抢险英雄', weight: 3, text: '在你的科学指挥下，被困群众全部获救！你被市政府记三等功，省领导亲自来慰问。媒体把你称为"最美基层干部"。', requireFlag: 'rescueOp', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 8, positionWeight: 4, workAbility: 3, background: 3, mentalPressure: -3} },
    { id: 'e459', stage: 'work', eventType: 'choice', title: '村霸欺凌', weight: 4, text: '有村民反映村里一个"村霸"长期欺压百姓、强占土地，但因为家族势力大，没人敢举报。村民偷偷找到你，眼里全是期盼和恐惧。', pools: ['乡镇', '街道', '基层单位'], choices: [
      { text: '收集证据，联合公安打击', effects: {integrity: 4, workAbility: 3, risk: 3, mentalPressure: 4, reputation: 3, flag: 'antiVillageBully'} },
      { text: '上报县政法委请求支援', effects: {background: 2, integrity: 3, mentalPressure: 2, positionWeight: 1} },
      { text: '暗中保护举报人，逐步收集证据', effects: {iq: 3, integrity: 3, mentalPressure: 3, risk: 1} },
      { text: '劝说村霸改邪归正', effects: {eq: 1, risk: 3, mentalPressure: 2, integrity: 1} },
      { text: '多一事不如少一事', effects: {body: 1, risk: -1, mentalPressure: -1, reputation: -2, integrity: -3} },
    ]},
    { id: 'e460', stage: 'work', eventType: 'auto', title: '扫黑除恶（收官战果）', weight: 3, text: '在你的配合下，公安机关成功打掉了这个村霸团伙！村民们放鞭炮庆祝，送来了"为民除害"的锦旗。你成了村民心中的英雄。', requireFlag: 'antiVillageBully', pools: ['乡镇', '街道', '基层单位'], effects: {reputation: 7, positionWeight: 3, workAbility: 2, integrity: 3, mentalPressure: -2} },

    // =====================================================================
    // 降级/竞争对手打压事件
    // =====================================================================
    { id: 'e461', stage: 'work', eventType: 'choice', title: '对手暗算', weight: 4, text: '你发现最近领导对你的态度变了，重要工作不再交给你，会议上也不再点你的名。后来才知道，竞争对手在领导面前说了你的坏话，还拿一些断章取义的材料做了"汇报"。', choices: [
      { text: '找领导当面解释澄清', effects: {eq: 2, background: 2, mentalPressure: 4, risk: 1, positionWeight: 1, flag: 'confrontRival'} },
      { text: '用工作成绩说话，不理会', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 1} },
      { text: '收集对手的问题反击', effects: {risk: 4, mentalPressure: 3, eq: 1, integrity: -2, desire: 2} },
      { text: '找盟友联合应对', effects: {eq: 1, background: 2, mentalPressure: 2, risk: 1} },
      { text: '忍气吞声，等待时机', effects: {mentalPressure: 5, integrity: 1, positionWeight: -2, desire: -1} },
    ]},
    { id: 'e462', stage: 'work', eventType: 'auto', title: '澄清误会', weight: 4, text: '你找领导当面解释后，领导终于明白了真相。竞争对手的小动作被揭穿，领导对他严厉批评，对你的信任反而增加了。', requireFlag: 'confrontRival', effects: {reputation: 3, positionWeight: 3, background: 2, mentalPressure: -3, integrity: 2} },
    { id: 'e463', stage: 'work', eventType: 'choice', title: '匿名举报', weight: 4, text: '你收到消息：有人匿名举报你"工作作风问题"，纪委已经介入调查。你知道自己没问题，但调查期间你的晋升会被暂停。', choices: [
      { text: '积极配合调查，主动提供材料', effects: {integrity: 4, mentalPressure: 4, reputation: 1, risk: -2, flag: 'cooperateInvestigation'} },
      { text: '找关系打听举报人是谁', effects: {background: 2, risk: 3, mentalPressure: 3, integrity: -2} },
      { text: '写申诉材料向上级反映', effects: {integrity: 3, mentalPressure: 3, positionWeight: 1, risk: 1} },
      { text: '沉默应对，相信清者自清', effects: {integrity: 3, mentalPressure: 5, positionWeight: -2} },
      { text: '找领导沟通寻求支持', effects: {eq: 1, background: 2, mentalPressure: 2, positionWeight: 1} },
    ]},
    { id: 'e464', stage: 'work', eventType: 'auto', title: '调查还清白', weight: 4, text: '纪委调查结束，结论是"举报不实，未发现违规行为"。你的清白得到了确认，但这次经历让你深刻体会到"树大招风"的含义。', requireFlag: 'cooperateInvestigation', effects: {reputation: 3, integrity: 3, mentalPressure: -3, positionWeight: 2, risk: -3} },
    { id: 'e465', stage: 'work', eventType: 'sudden', title: '意外事故', weight: 4, text: '你分管领域发生了一起意外事故，虽然没有人员伤亡，但造成了一定的经济损失。虽然不是你的直接责任，但作为分管领导你需要承担领导责任。', effects: {reputation: -4, positionWeight: -2, mentalPressure: 6, risk: 2, desire: -2} },
    { id: 'e466', stage: 'work', eventType: 'choice', title: '领导问责', weight: 4, text: '上级对事故进行问责，领导找你谈话，说"虽然不是你的直接责任，但你是分管领导，要承担相应责任"。你的处理方案将直接影响你的仕途。', choices: [
      { text: '主动承担责任，请求处分', effects: {integrity: 4, reputation: 1, mentalPressure: 5, positionWeight: -3, flag: 'tookResponsibility', luck: -1} },
      { text: '解释情况，争取从轻处理', effects: {eq: 1, mentalPressure: 3, risk: 1, positionWeight: -1} },
      { text: '推卸责任给下属', effects: {mentalPressure: 1, positionWeight: -2, risk: 3, integrity: -4, reputation: -2, eq: -2} },
      { text: '提出整改方案将功补过', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 1, flag: 'remediationPlan'} },
      { text: '辞职以谢天下', effects: {mentalPressure: 3, desire: -3, integrity: 2, reputation: 2} },
    ]},
    { id: 'e467', stage: 'work', eventType: 'auto', title: '将功补过', weight: 4, text: '你提出的整改方案得到了上级认可，事故善后处理得当。领导说"知错能改，善莫大焉"，你的处分从轻处理，只是口头警告。', requireFlag: 'remediationPlan', effects: {reputation: 2, positionWeight: 1, mentalPressure: -3, workAbility: 2, integrity: 2} },
    { id: 'e468', stage: 'work', eventType: 'choice', title: '政敌上位', weight: 4, text: '你的竞争对手获得了提拔，成了你的直接上级。你知道以后的日子不会好过。新领导第一周就把你从核心科室调到了边缘科室。', choices: [
      { text: '忍辱负重，等待翻盘机会', effects: {mentalPressure: 5, integrity: 2, positionWeight: -3, desire: 2, flag: 'endureRival'} },
      { text: '申请调离本单位', effects: {eq: 1, background: 2, mentalPressure: 3, positionWeight: -2, desire: 1} },
      { text: '主动示好，化解矛盾', effects: {eq: 2, desire: -2, mentalPressure: 2, risk: 1, background: 1} },
      { text: '搜集对方把柄作为筹码', effects: {risk: 5, integrity: -3, mentalPressure: 3, desire: 2} },
      { text: '向上级反映遭受打击报复', effects: {integrity: 3, background: 2, mentalPressure: 3, risk: 2, positionWeight: 1} },
    ]},
    { id: 'e469', stage: 'work', eventType: 'auto', title: '柳暗花明', weight: 4, text: '你的忍耐没有白费。新领导因为其他问题被调走了，你的能力在艰难时期得到了展现。上级重新启用了你，还给你加了担子。', requireFlag: 'endureRival', effects: {reputation: 4, positionWeight: 4, workAbility: 3, background: 2, mentalPressure: -3, deleteFlag: 'endureRival'} },
    { id: 'e470', stage: 'work', eventType: 'choice', title: '考核末位', weight: 4, text: '年度考核你排在末位——虽然你工作没出大问题，但竞争对手在民主测评时做了手脚。领导找你谈话，暗示你"需要反思"。', choices: [
      { text: '认真反思，改进工作方法', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 1, flag: 'selfReflect'} },
      { text: '向领导说明真实情况', effects: {eq: 1, background: 1, mentalPressure: 2, risk: 1} },
      { text: '找同事沟通争取支持', effects: {eq: 2, background: 2, mentalPressure: 2, reputation: 1} },
      { text: '把怨气发在工作上', effects: {workAbility: -2, mentalPressure: 5, risk: 2, integrity: -1} },
      { text: '写匿名信举报对手', effects: {risk: 4, integrity: -3, mentalPressure: 3, desire: 2} },
    ]},
    { id: 'e471', stage: 'work', eventType: 'auto', title: '浴火重生', weight: 4, text: '经过认真反思和改进，你在下一年的考核中名列前茅！领导在大会上表扬你"知耻而后勇"，你的仕途重新步入正轨。', requireFlag: 'selfReflect', effects: {reputation: 4, positionWeight: 3, workAbility: 3, mentalPressure: -3, desire: 1} },

    // =====================================================================
    // 市级部门平调/层级相关事件
    // =====================================================================
    { id: 'e472', stage: 'work', eventType: 'choice', title: '科室轮岗', weight: 4, text: '单位内部进行科室轮岗，你被从核心科室调到了一般科室。虽然级别没变，但明显是"明升暗降"——权力小了，资源也少了。', pools: ['市级', '县级', '省级'], choices: [
      { text: '接受安排，在新岗位做出成绩', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 1, flag: 'acceptRotation'} },
      { text: '找领导沟通，表达不愿意', effects: {eq: 1, mentalPressure: 2, positionWeight: 1, risk: 1} },
      { text: '消极怠工表示不满', effects: {workAbility: -2, mentalPressure: -1, reputation: -2, risk: 1} },
      { text: '利用新岗位拓展新的能力', effects: {iq: 2, workAbility: 2, mentalPressure: 1, desire: 1} },
      { text: '请同事帮忙说情调回核心科室', effects: {eq: 1, background: 2, risk: 1, mentalPressure: 1} },
    ]},
    { id: 'e473', stage: 'work', eventType: 'auto', title: '岗位逆袭', weight: 3, text: '你在"冷板凳"岗位上做出了让人意想不到的成绩！领导感叹"是金子在哪里都会发光"，把你调回了核心科室并委以重任。', requireFlag: 'acceptRotation', pools: ['市级', '县级', '省级'], effects: {reputation: 4, positionWeight: 3, workAbility: 3, mentalPressure: -2, background: 1} },
    { id: 'e474', stage: 'work', eventType: 'choice', title: '部门合并', weight: 3, text: '机构改革中，你所在的部门被合并到了另一个部门。新部门的领导是原来另一个部门的领导，你从"自己人"变成了"外来户"。', pools: ['市级', '县级', '省级'], choices: [
      { text: '积极融入新团队，展现价值', effects: {eq: 2, workAbility: 2, mentalPressure: 3, reputation: 1, flag: 'mergeAdapt'} },
      { text: '保持距离，做好本职工作', effects: {integrity: 2, mentalPressure: 2, workAbility: 1, eq: 1} },
      { text: '联合原来的同事抱团', effects: {eq: 1, risk: 2, mentalPressure: 2, background: 1, integrity: -1} },
      { text: '主动向新领导靠拢', effects: {eq: 1, background: 2, mentalPressure: 1, desire: 1, risk: 1} },
      { text: '申请调往其他部门', effects: {eq: 1, background: 1, mentalPressure: 2, positionWeight: -1} },
    ]},
    { id: 'e475', stage: 'work', eventType: 'auto', title: '融合成功', weight: 3, text: '你积极融入新团队的态度得到了新领导的认可。在部门整合过程中，你成了"桥梁"，两边的人都信任你。领导说"你比我还了解这个单位"。', requireFlag: 'mergeAdapt', pools: ['市级', '县级', '省级'], effects: {reputation: 4, positionWeight: 3, eq: 1, background: 2, mentalPressure: -2} },

    // =====================================================================
    // 第五批：补足各池到10+事件
    // =====================================================================
    // === 县级补充（3个） ===
    { id: 'e476', stage: 'work', eventType: 'choice', title: '县域旅游', weight: 5, text: '县里要打造一个全域旅游示范区，你被任命为协调人。但本县旅游资源一般，基础设施也不完善，要在短时间内出成果不容易。', pools: ['县级','市级'], choices: [
      { text: '挖掘本县特色文化IP', effects: {iq: 3, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'countyTourism'} },
      { text: '招商引资引入旅游企业', effects: {desire: 2, background: 2, mentalPressure: 3, risk: 1} },
      { text: '先在周边城市做推广引流', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '借鉴先进县市经验补短板', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
      { text: '申报省级旅游发展专项资金', effects: {background: 2, mentalPressure: 2, workAbility: 1, reputation: 1} },
    ]},
    { id: 'e477', stage: 'work', eventType: 'auto', title: '旅游名片', weight: 5, text: '你打造的"一村一品"乡村旅游线路获得了省级精品线路认证！文旅局把你的经验编成了案例教材，在全省推广。', requireFlag: 'countyTourism', pools: ['县级','市级'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e478', stage: 'work', eventType: 'choice', title: '教育均衡', weight: 5, text: '县里推进义务教育均衡发展，你负责协调教育资源的配置。优质学校都在县城，乡镇学校师资薄弱、条件简陋，家长意见很大。', pools: ['县级', '民生部门'], choices: [
      { text: '推行教师轮岗交流制度', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, flag: 'eduBalance'} },
      { text: '加大乡镇学校硬件投入', effects: {workAbility: 2, mentalPressure: 2, reputation: 2, integrity: 1} },
      { text: '发展远程教育资源共享', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '增加乡镇教师补贴待遇', effects: {eq: 1, reputation: 2, mentalPressure: 1, background: 1} },
      { text: '新建寄宿制学校集中办学', effects: {workAbility: 2, mentalPressure: 3, reputation: 1, risk: 1} },
    ]},
    { id: 'e479', stage: 'work', eventType: 'auto', title: '教育示范县', weight: 5, text: '教育均衡改革成效显著！省教育厅将你县评为"义务教育均衡发展示范县"，你的教师轮岗经验在全省教育工作会议上做了交流。', requireFlag: 'eduBalance', pools: ['县级', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, eq: 1, mentalPressure: -2} },

    // === 省级补充（4个） ===
    { id: 'e480', stage: 'work', eventType: 'choice', title: '全省考核', weight: 5, text: '省委组织对各厅局年度工作考核，你负责单位考核材料的准备工作。各科室报上来的材料参差不齐，有的夸大其词，有的过于保守。', pools: ['省级','市级'], choices: [
      { text: '严格把关，对数据逐条核实', effects: {integrity: 3, workAbility: 3, mentalPressure: 4, reputation: 2, flag: 'provinceExam'} },
      { text: '适度美化，突出亮点', effects: {desire: 2, mentalPressure: 2, risk: 1, positionWeight: 1} },
      { text: '让科室自己重新整理整改', effects: {eq: 1, workAbility: 1, mentalPressure: 2, background: 1} },
      { text: '参考往年优秀单位的材料', effects: {iq: 2, workAbility: 2, mentalPressure: 1, risk: 1} },
      { text: '加班逐字逐句修改完善', effects: {body: -2, mentalPressure: 5, workAbility: 2, reputation: 1} },
    ]},
    { id: 'e481', stage: 'work', eventType: 'auto', title: '考核第一', weight: 5, text: '省委考核结果公布，你单位名列优秀档次第一名！领导在表彰大会上感慨"这份材料是历年最好的"，你也被评为"年度工作先进个人"。', requireFlag: 'provinceExam', pools: ['省级','市级'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, integrity: 2, mentalPressure: -2} },
    { id: 'e482', stage: 'work', eventType: 'choice', title: '跨省考察', weight: 5, text: '省里组织到先进省份考察学习，你是考察团成员。对方省在数字政府和营商环境方面走在全国前列，有很多值得学习借鉴的地方。', pools: ['省级','市级'], choices: [
      { text: '深入考察核心做法和机制', effects: {iq: 3, workAbility: 2, reputation: 2, background: 2, mentalPressure: 1, flag: 'crossProvinceStudy'} },
      { text: '侧重结交对方关键联系人', effects: {eq: 2, background: 3, mentalPressure: 1, reputation: 1} },
      { text: '每天写考察日记和心得', effects: {workAbility: 2, iq: 2, mentalPressure: 2, reputation: 1} },
      { text: '走马观花意思意思', effects: {risk: 2, mentalPressure: 1, reputation: -2, workAbility: -1} },
      { text: '重点学习可复制推广的经验', effects: {iq: 2, workAbility: 2, mentalPressure: 1, reputation: 1, flag: 'crossProvinceStudy'} },
    ]},
    { id: 'e483', stage: 'work', eventType: 'auto', title: '考察转化', weight: 5, text: '考察回来后，你撰写的考察报告和转化建议得到了省委主要领导批示！要求"各厅局认真学习，结合实际转化落实"。你成了省里小有名气的"笔杆子"。', requireFlag: 'crossProvinceStudy', pools: ['省级','市级'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e484', stage: 'work', eventType: 'choice', title: '省级立法', weight: 5, text: '省人大委托你所在部门起草一部地方性法规。你是起草组成员，需要在各方利益博弈中找到平衡点。企业诉求、群众权益、部门利益、人大要求都要兼顾。', pools: ['省级','市级'], choices: [
      { text: '广泛调研各方意见后再动笔', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, iq: 2, flag: 'draftLaw'} },
      { text: '参考上位法和兄弟省份做法', effects: {iq: 3, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '组织专家论证和立法听证', effects: {background: 2, iq: 2, mentalPressure: 2, reputation: 2} },
      { text: '按领导意思起草省事省力', effects: {risk: 3, integrity: -2, mentalPressure: 1, workAbility: -1} },
      { text: '让企业也参与起草过程', effects: {eq: 1, background: 2, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'e485', stage: 'work', eventType: 'auto', title: '法规通过', weight: 5, text: '你参与起草的法规在省人大常委会全票通过！省委书记评价"这部法规回应了社会关切，体现了法治精神"。你的名字和这部法规一起写进了省志。', requireFlag: 'draftLaw', pools: ['省级','市级'], effects: {reputation: 8, positionWeight: 4, workAbility: 3, iq: 3, mentalPressure: -3} },

    // === 政法系统补充（4个） ===
    { id: 'e486', stage: 'work', eventType: 'choice', title: '巡回法庭', weight: 5, text: '法院开展巡回审判工作，你被安排到偏远山区设立巡回法庭。老百姓很多一辈子没进过法院，现在法官把法庭开到了田间地头。', pools: ['政法系统', '执法部门'], choices: [
      { text: '认真办好每一个巡回案件', effects: {integrity: 3, workAbility: 2, reputation: 3, eq: 1, body: -1, flag: 'circuitCourt'} },
      { text: '借机开展普法宣传教育', effects: {workAbility: 2, integrity: 2, reputation: 2, eq: 1, background: 1} },
      { text: '用方言乡音拉近和群众的距离', effects: {eq: 2, reputation: 2, mentalPressure: 1, workAbility: 1} },
      { text: '觉得是形式主义，应付了事', effects: {body: 1, mentalPressure: -2, reputation: -2, integrity: -2} },
      { text: '多调解少判决促进和谐', effects: {eq: 2, workAbility: 2, integrity: 2, reputation: 2} },
    ]},
    { id: 'e487', stage: 'work', eventType: 'auto', title: '巡回审判楷模', weight: 5, text: '巡回法庭的工作受到了最高法院的表彰！你的事迹被拍成了《巡回法官》微视频，在法院系统里广为流传。老百姓都说"这个法官像邻居家的大哥"。', requireFlag: 'circuitCourt', pools: ['政法系统', '执法部门'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, eq: 1, mentalPressure: -2} },
    { id: 'e488', stage: 'work', eventType: 'choice', title: '社区矫正', weight: 5, text: '司法所开展社区矫正工作，你负责管理一名社区矫正对象——一个因冲动打架犯了寻衅滋事罪的年轻人。他表现不错，但因为前科找工作处处碰壁。', pools: ['政法系统', '执法部门', '基层单位'], choices: [
      { text: '制定个性化矫正方案帮其回归社会', effects: {eq: 2, workAbility: 2, integrity: 2, reputation: 2, flag: 'corrections'} },
      { text: '严格按规定进行监管教育', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '帮他联系职业技能培训', effects: {eq: 1, workAbility: 2, reputation: 1, background: 1, flag: 'corrections'} },
      { text: '睁一只眼闭一只眼', effects: {risk: 2, integrity: -2, mentalPressure: -1} },
      { text: '组织社区矫正对象集中教育', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, reputation: 1} },
    ]},
    { id: 'e489', stage: 'work', eventType: 'auto', title: '矫正典型', weight: 5, text: '你管理的矫正对象在职业技能竞赛中获奖，顺利找到了工作，成了一名自食其力的合格公民。省司法厅将你的社区矫正做法作为创新案例在全省推广。', requireFlag: 'corrections', pools: ['政法系统', '执法部门', '基层单位'], effects: {reputation: 5, positionWeight: 2, workAbility: 2, eq: 1, mentalPressure: -2} },

    // === 技术/数据补充（3个） ===
    { id: 'e490', stage: 'work', eventType: 'choice', title: 'AI应用', weight: 5, text: '上级要求推进人工智能在政务服务中的应用，你负责技术方案的设计和实施。但部分老同志对AI持怀疑态度，觉得"机器能比人靠谱吗"。', pools: ['技术部门', '数据部门', '政府部门'], choices: [
      { text: '先做试点用效果说话', effects: {iq: 3, workAbility: 2, mentalPressure: 2, reputation: 2, risk: -1, flag: 'aiPilot'} },
      { text: '组织培训消除大家的疑虑', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '找支持AI的年轻同事一起推动', effects: {eq: 1, background: 2, mentalPressure: 1, workAbility: 1} },
      { text: '照搬大厂的AI工具', effects: {workAbility: 1, iq: 1, mentalPressure: -1, risk: 2} },
      { text: '请AI专家来做科普讲座', effects: {iq: 2, workAbility: 2, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e491', stage: 'work', eventType: 'auto', title: 'AI赋能', weight: 5, text: '你主导的AI政务助手上线后，群众办事平均时间缩短了四成！省大数据局将你的项目列为"数字政府示范应用"，要求全省推广。', requireFlag: 'aiPilot', pools: ['技术部门', '数据部门', '政府部门'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },
    { id: 'e492', stage: 'work', eventType: 'choice', title: '智慧城市', weight: 5, text: '市里推进智慧城市建设，你负责智慧交通模块的建设。需要在全市范围内布设传感器、摄像头和智能信号灯，工程量大、周期长。', pools: ['技术部门', '数据部门', '市级'], choices: [
      { text: '制定分阶段实施计划稳步推进', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, flag: 'smartCity'} },
      { text: '先在核心区域做示范', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '引入知名科技企业合作共建', effects: {background: 3, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '大干快上追求短期出成绩', effects: {risk: 3, mentalPressure: 3, desire: 2, workAbility: -1} },
      { text: '学习其他城市智慧交通经验', effects: {iq: 2, workAbility: 2, mentalPressure: 1, background: 1} },
    ]},
    { id: 'e493', stage: 'work', eventType: 'auto', title: '智慧交通', weight: 5, text: '智慧交通系统运行后，市中心平均通行时间减少了25%！这个数据让分管领导在调度会上坐不住了，当即要求其他城区也加快接入。省大数据局的考察组来调研时连连点头。', requireFlag: 'smartCity', pools: ['技术部门', '数据部门', '市级'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -2} },

    // === 民生部门补充（3个） ===
    { id: 'e494', stage: 'work', eventType: 'choice', title: '就业援助', weight: 5, text: '经济下行背景下，就业压力增大。你负责就业困难人员的帮扶工作，需要在一季度内帮助一批"4050"人员实现再就业。', pools: ['民生部门', '人社', '民政', '政府部门'], choices: [
      { text: '梳理岗位库精准匹配', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, eq: 1, flag: 'employmentAid'} },
      { text: '开设专场招聘会', effects: {workAbility: 2, eq: 1, mentalPressure: 2, reputation: 1} },
      { text: '对接企业开发公益性岗位', effects: {background: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '组织技能培训再推荐就业', effects: {iq: 2, workAbility: 2, mentalPressure: 2, eq: 1} },
      { text: '鼓励灵活就业和自主创业', effects: {desire: 2, workAbility: 2, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'e495', stage: 'work', eventType: 'auto', title: '就业先锋', weight: 5, text: '你负责的就业帮扶工作超额完成任务！在全省就业工作会议上，你作为先进代表做了发言。一位下岗再就业的大姐专程来感谢你，说"要不是你，我们这个家就散了"。', requireFlag: 'employmentAid', pools: ['民生部门', '人社', '民政', '政府部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, eq: 1, mentalPressure: -2} },
    { id: 'e496', stage: 'work', eventType: 'choice', title: '保障性住房', weight: 5, text: '保障性住房分配工作开始了，你负责审核申请人的资格。有几百户家庭在等候名单上，但房源只有几十套。你发现有些申请人明显不符合条件却通过了初审。', pools: ['民生部门', '住建', '民政', '政府部门'], choices: [
      { text: '逐一核实，确保公平公正', effects: {integrity: 4, workAbility: 3, mentalPressure: 4, reputation: 2, flag: 'housingFair'} },
      { text: '劝退明显不符合条件的申请户', effects: {eq: 1, integrity: 2, mentalPressure: 2, workAbility: 2} },
      { text: '制定更透明的分配规则', effects: {iq: 2, workAbility: 2, integrity: 2, reputation: 2} },
      { text: '睁一只眼闭一只眼，别得罪人', effects: {risk: 4, integrity: -3, mentalPressure: 1, reputation: -2} },
      { text: '向上级申请增加房源', effects: {background: 2, mentalPressure: 2, workAbility: 1, reputation: 1} },
    ]},
    { id: 'e497', stage: 'work', eventType: 'auto', title: '公平分配', weight: 5, text: '你的严格审核确保保障房真正分给了最需要的人！群众自发给你送来了"公平公正"的锦旗，媒体对此做了专题报道，你成了老百姓心中的"好干部"。', requireFlag: 'housingFair', pools: ['民生部门', '住建', '民政', '政府部门'], effects: {reputation: 6, positionWeight: 3, integrity: 3, workAbility: 2, mentalPressure: -2} },

    // === 党委系统补充（4个） ===
    { id: 'e498', stage: 'work', eventType: 'choice', title: '巡视整改', weight: 5, text: '省委巡视组反馈了整改意见，你负责协调各科室落实整改。有些问题积重难返，需要动真格的。但整改力度太大怕影响稳定，太小又怕巡视组不满意。', pools: ['党委系统', '机关'], choices: [
      { text: '制定切实可行的整改方案', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 2, flag: 'inspectFix'} },
      { text: '逐条对照逐一整改逐一销号', effects: {workAbility: 2, integrity: 3, mentalPressure: 3, positionWeight: 2} },
      { text: '先做表面工作应付巡视组', effects: {mentalPressure: -2, body: 1, risk: 5, integrity: -3, reputation: -2} },
      { text: '把问题分解到各科室压实责任', effects: {workAbility: 2, eq: 1, mentalPressure: 2, background: 1} },
      { text: '请巡视组对整改给予指导', effects: {background: 2, integrity: 2, mentalPressure: 1, positionWeight: 1} },
    ]},
    { id: 'e499', stage: 'work', eventType: 'auto', title: '整改到位', weight: 5, text: '巡视整改顺利通过"回头看"检查！省委巡视组评价"整改态度端正、措施得力、成效明显"，将你单位列为整改示范单位。', requireFlag: 'inspectFix', pools: ['党委系统', '机关'], effects: {reputation: 5, positionWeight: 3, integrity: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e500', stage: 'work', eventType: 'choice', title: '选人用人', weight: 5, text: '你参与干部选拔任用工作，负责推荐和考察人选。有人暗示某个候选人"背景不一般"，希望你能"关照一下"。你陷入了两难。', pools: ['党委系统', '机关'], choices: [
      { text: '坚持标准，择优推荐', effects: {integrity: 4, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'fairSelection'} },
      { text: '了解该候选人实际情况再做决定', effects: {eq: 1, iq: 2, mentalPressure: 2, workAbility: 1} },
      { text: '适当照顾，留个人情', effects: {risk: 3, integrity: -2, background: 2, desire: 1} },
      { text: '向主要领导请示这该怎么处理', effects: {background: 2, positionWeight: 1, mentalPressure: 1, eq: 1} },
      { text: '严格按程序办，不留漏洞', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, iq: 1} },
    ]},
    { id: 'e501', stage: 'work', eventType: 'auto', title: '选贤任能', weight: 5, text: '你坚持原则的做法得到了上级肯定！最终选拔出的人选得到了干部群众的一致认可。上级评价你"坚持标准、公道正派"，把你列为组织系统重点培养对象。', requireFlag: 'fairSelection', pools: ['党委系统', '机关'], effects: {reputation: 5, positionWeight: 4, integrity: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e502', stage: 'work', eventType: 'choice', title: '专项督查', weight: 5, text: '省委派出督查组对某项重点工作的落实情况进行专项督查，你单位是督查对象之一。你被指定为单位的联络人，负责对接督查组和准备汇报材料。', pools: ['党委系统', '机关', '政府部门'], choices: [
      { text: '全面梳理工作进展，据实汇报', effects: {integrity: 3, workAbility: 3, mentalPressure: 3, reputation: 2, flag: 'specialInspect'} },
      { text: '重点突出亮点和成效', effects: {desire: 2, workAbility: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '提前做好各科室"功课"', effects: {eq: 1, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '隐瞒存在的问题和不足', effects: {risk: 5, integrity: -3, mentalPressure: 3, reputation: -2} },
      { text: '请有经验的老同志帮忙把关', effects: {eq: 1, background: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'e503', stage: 'work', eventType: 'auto', title: '督查通过', weight: 5, text: '专项督查顺利通过！督查组评价"工作扎实、材料真实、亮点突出"，将你单位的经验写入督查报告上报省委。你的表现也得到了领导的认可。', requireFlag: 'specialInspect', pools: ['党委系统', '机关', '政府部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, integrity: 2, mentalPressure: -2} },

    // =====================================================================
    // 第六批：公共池补充事件 + 状态触发事件 + 职业里程碑
    // =====================================================================
    { id: 'e504', stage: 'life', eventType: 'choice', title: '报名马拉松', weight: 5, text: '市里要举办马拉松比赛，单位工会号召大家报名参加。你平时没什么运动习惯，但同事说"重在参与"，你有点心动。', pools: ['public'], choices: [
      { text: '报名半马，挑战自己', effects: {body: 2, mentalPressure: 3, desire: 2, reputation: 1, flag: 'marathonRunner'} },
      { text: '报名迷你马，安全第一', effects: {body: 1, mentalPressure: 1, reputation: 1, eq: 1} },
      { text: '当志愿者为大家服务', effects: {eq: 1, reputation: 1, background: 1, mentalPressure: 1} },
      { text: '工作太忙，不参加了', effects: {body: -1, mentalPressure: -1, reputation: -1} },
      { text: '报名后每天坚持训练', effects: {body: 3, mentalPressure: 2, workAbility: 1, desire: 2, flag: 'marathonRunner'} },
    ]},
    { id: 'e505', stage: 'life', eventType: 'auto', title: '马拉松完赛', weight: 5, text: '你成功完成了马拉松！虽然跑得不算快，但冲过终点线的那一刻，你感觉自己战胜了自己。同事们在终点等你，帮你拍照留念。', requireFlag: 'marathonRunner', pools: ['public'], effects: {body: 2, mentalPressure: -3, reputation: 2, desire: 1, eq: 1} },
    { id: 'e506', stage: 'life', eventType: 'choice', title: '同事生日', weight: 5, text: '同办公室的小王要过生日了，大家商量着一起庆祝。你和小王平时关系还行，但不算特别熟。大家都在出钱凑份子买礼物。', pools: ['public'], choices: [
      { text: '积极参与，和大家一起凑份子', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: 1} },
      { text: '单独准备一份更有心意的礼物', effects: {eq: 1, reputation: 2, background: 1, mentalPressure: 1, flag: 'gaveGift'} },
      { text: '以工作忙为由推掉', effects: {mentalPressure: -2, eq: -1, background: -1, reputation: -1} },
      { text: '组织大家AA制聚餐', effects: {eq: 2, background: 1, reputation: 1, mentalPressure: 1} },
      { text: '发个红包表示心意', effects: {eq: 1, reputation: 1, mentalPressure: -1, background: 1} },
    ]},
    { id: 'e507', stage: 'life', eventType: 'choice', title: '单位排练', weight: 5, text: '单位要参加全市文艺汇演，每个部门都要出节目。你被推选参加合唱，但排练都在下班后，你本来想利用这段时间加班的。', pools: ['public'], choices: [
      { text: '积极参加排练，为集体争光', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: 2, flag: 'chorusMember'} },
      { text: '作为替补参加，减少排练时间', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
      { text: '以加班为由婉拒', effects: {workAbility: 1, reputation: -1, eq: -1, mentalPressure: -1} },
      { text: '主动承担指挥或领唱', effects: {desire: 2, reputation: 2, mentalPressure: 3, eq: 1} },
      { text: '负责后勤为大家服务', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: 1} },
    ]},
    { id: 'e508', stage: 'life', eventType: 'auto', title: '汇演成功', weight: 5, text: '全市文艺汇演中，你们单位的合唱节目获得了二等奖！虽然排练很辛苦，但站在台上的那一刻，你感到无比自豪。', requireFlag: 'chorusMember', pools: ['public'], effects: {reputation: 2, eq: 1, mentalPressure: -2, background: 1} },
    { id: 'e509', stage: 'life', eventType: 'choice', title: '旧书摊', weight: 5, text: '周末你去逛二手书市场，在一个旧书摊前停下了脚步。摊主是一位退休的老教师，他推荐了一本关于基层治理的旧书，说是他年轻时写的。', pools: ['public'], choices: [
      { text: '买下这本书，认真阅读', effects: {iq: 2, workAbility: 2, integrity: 1, mentalPressure: -1, flag: 'bookReader', appearance: 1} },
      { text: '和摊主聊聊基层治理的话题', effects: {eq: 1, background: 1, workAbility: 1, integrity: 1} },
      { text: '随便翻翻就走了', effects: {mentalPressure: -1, iq: -1} },
      { text: '买了好几本相关的书', effects: {iq: 2, workAbility: 1, mentalPressure: 1, familyPressure: 1, flag: 'bookReader'} },
      { text: '推荐给同事来看看', effects: {eq: 1, background: 1, reputation: 1} },
    ]},
    { id: 'e510', stage: 'life', eventType: 'choice', title: '老家来人', weight: 5, text: '老家的亲戚来城里办事，顺便来看看你。他们带了一堆土特产——腊肉、干笋、自家种的菜，热情得让你不好意思。', pools: ['public'], choices: [
      { text: '热情招待，留他们吃饭住宿', effects: {eq: 1, background: 1, familyPressure: 2, mentalPressure: 1, reputation: 1} },
      { text: '请他们下馆子吃顿好的', effects: {mentalPressure: -1, eq: 1, familyPressure: 2, reputation: 1, background: 1} },
      { text: '帮忙办事后送他们去车站', effects: {workAbility: 2, eq: 1, mentalPressure: 1, integrity: 1, desire: 2} },
      { text: '借口工作忙，匆匆见一面', effects: {desire: 2, eq: -1, background: -1, reputation: -1, mentalPressure: -1} },
      { text: '收下特产，回赠一些城里的东西', effects: {eq: 1, background: 1, familyPressure: 1, reputation: 1} },
    ]},
    { id: 'e511', stage: 'life', eventType: 'choice', title: '宠物走失', weight: 5, text: '你家养的宠物猫跑丢了，你在小区里找了半天没找到。邻居说看到一只相似的花猫往街对面跑了。你很着急，但明天还有重要会议。', pools: ['public'], choices: [
      { text: '连夜找猫，打印寻猫启事', effects: {eq: 1, mentalPressure: 3, body: -1, reputation: 1, flag: 'findPet'} },
      { text: '在业主群里发消息求助', effects: {eq: 1, background: 1, mentalPressure: 1, reputation: 2} },
      { text: '先开完会再找', effects: {workAbility: 2, mentalPressure: 2, integrity: 1} },
      { text: '不管了，猫自己会回来', effects: {mentalPressure: -1, eq: -1, integrity: -1, reputation: 1} },
      { text: '请邻居帮忙留意', effects: {eq: 2, background: 1, mentalPressure: 1, reputation: 1} },
    ]},
    { id: 'e512', stage: 'life', eventType: 'auto', title: '猫咪回家', weight: 5, text: '第二天一早，你家猫自己回来了，蹲在门口"喵喵"叫。它看起来饿坏了，但精神不错。你给它加了一顿罐头，它蹭着你的腿撒娇。', requireFlag: 'findPet', pools: ['public'], effects: {mentalPressure: -3, eq: 1, reputation: 1, familyPressure: -1} },
    { id: 'e513', stage: 'life', eventType: 'choice', title: '美食探店', weight: 5, text: '同事推荐了一家新开的餐厅，说味道很好。你正好周末有空，决定去尝试一下。到了之后发现是一家装修很有格调的小餐馆，但价格不便宜。', pools: ['public'], choices: [
      { text: '好好享受，犒劳自己', effects: {mentalPressure: -2, familyPressure: 1, eq: 1, reputation: 1, luck: 1} },
      { text: '拍照发朋友圈打卡', effects: {eq: 1, reputation: 1, mentalPressure: 1, desire: 1} },
      { text: '觉得太贵，随便吃吃就走', effects: {mentalPressure: -2, familyPressure: -1, eq: -1} },
      { text: '下次带家人一起来', effects: {eq: 1, familyPressure: -2, mentalPressure: -1, reputation: 1} },
      { text: '和老板聊聊餐饮创业的经历', effects: {eq: 1, background: 1, workAbility: 1, iq: 1} },
    ]},
    { id: 'e514', stage: 'work', eventType: 'choice', title: '学习强国', weight: 5, text: '单位要求大家每天在学习强国平台上学习，积分排名靠后的会被通报。你平时工作忙，经常忘了学习，你的排名快垫底了。', pools: ['public'], choices: [
      { text: '每天定闹钟，坚持学习', effects: {iq: 2, integrity: 2, workAbility: 1, mentalPressure: 2, flag: 'studyStrong'} },
      { text: '利用碎片时间刷题', effects: {iq: 1, workAbility: 1, mentalPressure: 1, reputation: 1} },
      { text: '让家人帮忙刷积分', effects: {risk: 2, integrity: -2, mentalPressure: -1, reputation: -1} },
      { text: '不在乎排名，工作第一', effects: {workAbility: 2, integrity: 1, mentalPressure: -1, reputation: -1} },
      { text: '认真学习里面的政策文章', effects: {iq: 2, workAbility: 2, integrity: 2, mentalPressure: 1, flag: 'studyStrong'} },
    ]},
    { id: 'e515', stage: 'work', eventType: 'auto', title: '学习标兵', weight: 5, text: '你坚持学习了一段时间，在学习强国上的积分排名冲到了单位前三！支部大会上，书记表扬了你，说"这就是党性修养的体现"。', requireFlag: 'studyStrong', pools: ['public'], effects: {reputation: 3, iq: 2, integrity: 2, mentalPressure: -2} },
    { id: 'e516', stage: 'life', eventType: 'choice', title: '志愿献血', weight: 5, text: '单位组织无偿献血活动，号召大家积极参与。你之前献过血，知道献血对身体无害，但每次看到针头还是有点紧张。', pools: ['public'], choices: [
      { text: '积极献血，奉献爱心', effects: {integrity: 3, reputation: 2, body: -1, mentalPressure: 1, eq: 1, flag: 'bloodDonor'} },
      { text: '献血后休息半天', effects: {integrity: 2, body: -1, mentalPressure: -1, reputation: 1, flag: 'bloodDonor'} },
      { text: '身体不适，下次再献', effects: {integrity: 1, mentalPressure: 1, body: 1, desire: 2} },
      { text: '以工作忙为由拒绝', effects: {mentalPressure: -1, eq: -1, reputation: -1, integrity: -1} },
      { text: '献完血后发朋友圈呼吁大家献血', effects: {eq: 1, reputation: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'e517', stage: 'life', eventType: 'auto', title: '献血光荣', weight: 5, text: '你的献血行为被单位通报表扬了！你收到了献血证和单位的慰问品。更让你感动的是，同事说"你献血的样子特别帅"。', requireFlag: 'bloodDonor', pools: ['public'], effects: {reputation: 3, integrity: 2, eq: 1, mentalPressure: -2, body: 1} },
    { id: 'e518', stage: 'life', eventType: 'choice', title: '种植花草', weight: 5, text: '你在办公室养了几盆绿植，不仅能净化空气，还能缓解工作压力。同事们都说你的办公桌最有生机，经常有人来请教养花经验。', pools: ['public'], choices: [
      { text: '多养几盆，打造绿色办公环境', effects: {mentalPressure: -2, eq: 1, reputation: 1, workAbility: 1, flag: 'plantLover'} },
      { text: '教同事养花，分享经验', effects: {eq: 1, background: 1, reputation: 1, mentalPressure: -1, flag: 'plantLover'} },
      { text: '在阳台种菜，自给自足', effects: {body: 1, mentalPressure: -2, familyPressure: -1, eq: 1} },
      { text: '养死了再买新的', effects: {mentalPressure: -1, familyPressure: 1, eq: -1} },
      { text: '参加园艺沙龙交流', effects: {eq: 1, background: 1, mentalPressure: -1, reputation: 1} },
    ]},
    { id: 'e519', stage: 'life', eventType: 'auto', title: '绿色达人', weight: 5, text: '你的办公桌在单位"最美办公桌"评比中获得了第一名！大家说你的办公室像个小型植物园，进来就觉得心情好。', requireFlag: 'plantLover', pools: ['public'], effects: {reputation: 2, mentalPressure: -3, eq: 1, background: 1} },

    // ====== 状态触发事件（基于属性条件） ======
    { id: 'e520', stage: 'work', eventType: 'choice', title: '风险预警', weight: 5, text: '你收到了一条匿名短信："最近有人在查你经手的项目，你自己小心点。"你心里一惊，想起了那些打擦边球的操作。', pools: ['public'], requireRisk: 30, choices: [
      { text: '立即自查自纠，消除隐患', effects: {integrity: 4, risk: -5, mentalPressure: 4, reputation: 1, workAbility: 2} },
      { text: '找纪检部门主动说明情况', effects: {integrity: 3, risk: -3, mentalPressure: 4, reputation: 2, flag: 'selfReport'} },
      { text: '打听是谁在查', effects: {background: 2, risk: 2, mentalPressure: 3, integrity: -1} },
      { text: '偷偷销毁可能有问题的材料', effects: {risk: 6, integrity: -4, mentalPressure: 5, reputation: -2} },
      { text: '装作不知道，该干嘛干嘛', effects: {risk: 3, mentalPressure: -1, integrity: -1, reputation: -1} },
    ]},
    { id: 'e521', stage: 'work', eventType: 'auto', title: '主动交代', weight: 5, text: '你主动向组织说明情况的行为得到了纪委的肯定。经过核实，你虽然存在一些程序瑕疵，但没有主观故意，组织给予你诫勉谈话处理。', requireFlag: 'selfReport', effects: {reputation: 2, positionWeight: -1, mentalPressure: -3, integrity: 2, risk: -5} },
    { id: 'e522', stage: 'life', eventType: 'choice', title: '身体康复', weight: 5, text: '经过一段时间的调养和锻炼，你的身体状况明显好转了。医生说你各项指标都在恢复正常，你感觉整个人都轻松了。', pools: ['public'], requireBodyMax: 6, choices: [
      { text: '继续保持健康的生活方式', effects: {body: 2, mentalPressure: -2, workAbility: 1, eq: 1} },
      { text: '参加健身课程系统训练', effects: {body: 3, mentalPressure: -2, reputation: 1, familyPressure: 1, flag: 'fitnessRoutine'} },
      { text: '约朋友一起运动互相监督', effects: {eq: 1, body: 2, mentalPressure: -1, background: 1, desire: 2} },
      { text: '身体好了就开始继续拼命工作', effects: {workAbility: 2, body: -1, mentalPressure: 2, desire: 1} },
      { text: '买健身器材在家锻炼', effects: {body: 2, familyPressure: 1, mentalPressure: -2, eq: 1} },
    ]},
    { id: 'e523', stage: 'life', eventType: 'auto', title: '锻炼习惯', weight: 5, text: '坚持锻炼一段时间后，你发现自己不仅身体好了，精神状态也明显改善。工作效率提高了，连脾气都变好了。同事说你"像换了个人"。', requireFlag: 'fitnessRoutine', pools: ['public'], effects: {body: 2, mentalPressure: -3, workAbility: 1, reputation: 1, eq: 1} },
    { id: 'e524', stage: 'life', eventType: 'choice', title: '压力疏导', weight: 6, text: '最近工作压力太大，你开始出现失眠、易怒、注意力不集中的症状。你知道这样下去不行，必须想办法缓解压力。', pools: ['public'], requireMentalPressure: 50, choices: [
      { text: '试试冥想和正念减压', effects: {mentalPressure: -4, integrity: 1, body: 1, workAbility: 1, flag: 'stressRelief'} },
      { text: '找心理咨询师聊聊', effects: {mentalPressure: -5, eq: 1, integrity: 1, workAbility: 1} },
      { text: '休个年假出去走走', effects: {mentalPressure: -5, body: 1, familyPressure: -1, reputation: 1} },
      { text: '用运动发泄情绪', effects: {body: 2, mentalPressure: -3, workAbility: 1, eq: 1} },
      { text: '借酒浇愁', effects: {mentalPressure: -2, body: -2, risk: 2, integrity: -2, flag: 'alcoholDependence'} },
    ]},
    { id: 'e525', stage: 'life', eventType: 'auto', title: '压力缓解', weight: 5, text: '经过一段时间的调整，你的压力得到了有效缓解。你学会了更好地管理自己的情绪和时间，工作生活也更加平衡了。', requireFlag: 'stressRelief', pools: ['public'], effects: {mentalPressure: -4, workAbility: 1, eq: 1, body: 1, reputation: 1} },

    // ====== 职业里程碑事件 ======
    { id: 'e526', stage: 'work', eventType: 'auto', title: '工作三年', weight: 5, text: '入职三年了。你从当初懵懂的新人变成了能独立处理业务的"老同志"。新人叫你"老师"的时候，你心里还有点不习惯。', minYear: 3, pools: ['public'], effects: {workAbility: 2, positionWeight: 1, mentalPressure: -1, reputation: 1, eq: 1} },
    { id: 'e527', stage: 'work', eventType: 'auto', title: '工作七年', weight: 5, text: '七年之痒不仅适用于婚姻，也适用于工作。你开始思考自己在这个岗位上的意义，偶尔也会想"如果当初没考公会怎样"。', minYear: 7, pools: ['public'], effects: {desire: 2, mentalPressure: 2, iq: 1, integrity: 1} },
    { id: 'e528', stage: 'work', eventType: 'auto', title: '工作十二年', weight: 5, text: '十二年了，一个轮回。你经历了几任领导，经手了无数文件，见证了体制内外的变迁。你越来越明白，有些事急不得，有些人等不得。', minYear: 12, pools: ['public'], effects: {eq: 1, integrity: 2, mentalPressure: -2, reputation: 2, background: 1} },

    // =====================================================================
    // 第七批：降级反转 + 政敌反击事件链
    // =====================================================================
    // 链：降级后蛰伏→修炼→崛起
    { id: 'e529', stage: 'work', eventType: 'choice', title: '蛰伏修炼', weight: 5, text: '被降级后，你被安排到了一个清闲的岗位。有人替你惋惜，也有人幸灾乐祸。但你发现这个"冷板凳"让你有了难得的空闲时间——你可以趁机提升自己。', requireFlag: 'recentlyDemoted', choices: [
      { text: '利用空余时间考证进修', effects: {iq: 2, workAbility: 3, desire: 2, mentalPressure: 1, flag: 'demotedStudy'} },
      { text: '潜心研究业务梳理经验', effects: {workAbility: 4, iq: 2, mentalPressure: -1, reputation: 1, flag: 'demotedStudy'} },
      { text: '一边工作一边打听原单位动态', effects: {background: 2, desire: 2, risk: 1, mentalPressure: 2} },
      { text: '干脆放松享受慢节奏', effects: {mentalPressure: -3, body: 2, workAbility: -1, desire: -1} },
      { text: '写一本关于基层治理的书', effects: {iq: 3, workAbility: 2, reputation: 2, mentalPressure: 2, flag: 'demotedStudy'} },
    ]},
    { id: 'e530', stage: 'work', eventType: 'auto', title: '实力大增', weight: 5, text: '蛰伏的这段时间你没有荒废，反而比在原岗位时进步更大。你写的工作总结被上级转发学习，有人在会上提了你的名字。', requireFlag: 'demotedStudy', effects: {workAbility: 4, reputation: 3, positionWeight: 2, mentalPressure: -2, iq: 2} },
    { id: 'e531', stage: 'work', eventType: 'choice', title: '重返舞台', weight: 5, text: '上级领导在翻阅干部档案时注意到了你被处分的记录，但也看到了你在这期间的突出表现。他把你叫到办公室问了一句："你想不想回来？"', requireFlag: 'demotedStudy', choices: [
      { text: '抓住机会，申请恢复原职级', effects: {desire: 3, positionWeight: 3, mentalPressure: 3, reputation: 2, flag: 'demotedReturn'} },
      { text: '申请到新部门重新开始', effects: {workAbility: 2, background: 2, mentalPressure: 2, risk: -1, flag: 'demotedReturn'} },
      { text: '觉得现在的岗位也不错', effects: {mentalPressure: -2, integrity: 2, positionWeight: -1, desire: -2} },
      { text: '提出自己的改革建议', effects: {iq: 2, workAbility: 2, reputation: 2, mentalPressure: 2, flag: 'demotedReturn'} },
      { text: '请求领导再观察一段时间', effects: {eq: 1, mentalPressure: 1, desire: 1, integrity: 2} },
    ]},
    { id: 'e532', stage: 'work', eventType: 'choice', title: '东山再起', weight: 5, text: '组织给了你两条路：要么官复原职，把那些看轻你的人比下去；要么平级调整到更核心的岗位，从零再战。经历过低谷，你比从前更清醒。', requireFlag: 'demotedReturn', choices: [ { text: '官复原职，担起更重的担子', effects: {leadershipRank: 1, reputation: 3, positionWeight: 3, workAbility: 3, mentalPressure: 5, desire: 2, risk: 2, deleteFlag: 'recentlyDemoted'} }, { text: '平级调往核心岗位，从零再战', effects: {reputation: 4, positionWeight: 6, workAbility: 2, background: 2, mentalPressure: -3, desire: 2, deleteFlag: 'recentlyDemoted'} } ]},

    // 链：政敌打压→收集证据→反击→翻身
    { id: 'e533', stage: 'work', eventType: 'choice', title: '收集证据', weight: 5, text: '你终于拿到了对手的把柄——一份他违规操作的证据材料。这份材料如果交上去，他必受严惩。但你也要做好准备：一旦公开，你们之间的关系将彻底决裂。', requireFlag: 'endureRival', choices: [
      { text: '向纪委实名举报', effects: {integrity: 4, risk: 3, mentalPressure: 4, reputation: 2, flag: 'strikeBack'} },
      { text: '匿名投递举报材料', effects: {risk: 2, integrity: 2, mentalPressure: 2, flag: 'strikeBack'} },
      { text: '先找对方谈谈给他一个选择', effects: {eq: 1, background: 1, risk: 2, mentalPressure: 3, flag: 'strikeBack'} },
      { text: '暂时隐忍等待更合适时机', effects: {mentalPressure: 3, iq: 2, risk: -1, desire: 1} },
      { text: '把材料交给上级领导', effects: {background: 2, integrity: 3, mentalPressure: 2, risk: 2, flag: 'strikeBack'} },
    ]},
    { id: 'e534', stage: 'work', eventType: 'choice', title: '正义审判', weight: 5, text: '纪委调查组进驻了。你的对手四处活动试图压下此事，但你的证据扎实、难以推翻。调查组找你谈话时问你："你愿意出庭作证吗？"', requireFlag: 'strikeBack', choices: [
      { text: '愿意出庭作证，一查到底', effects: {integrity: 5, reputation: 3, risk: 2, mentalPressure: 3, flag: 'testifiedStrikeBack'} },
      { text: '提供证据但不公开出面', effects: {integrity: 3, risk: -1, mentalPressure: 1, reputation: 1} },
      { text: '沉默是金，不再添乱', effects: {risk: -1, mentalPressure: -1, integrity: 1, reputation: -1} },
      { text: '匿名提交新证据', effects: {iq: 2, integrity: 2, mentalPressure: 2, risk: 1, flag: 'testifiedStrikeBack'} },
      { text: '请求保护自己和家人', effects: {eq: 1, familyPressure: 1, mentalPressure: 3, risk: 2} },
    ]},
    { id: 'e535', stage: 'work', eventType: 'auto', title: '政敌倒台', weight: 5, text: '对手被双规了！调查还发现了他更多的违纪行为，牵扯出一批人。上级在总结大会上说："敢于坚持原则的同志，组织是看得见的。"', requireFlag: 'testifiedStrikeBack', effects: {reputation: 5, positionWeight: 3, integrity: 3, background: 2, mentalPressure: -3, risk: -3} },
    { id: 'e536', stage: 'work', eventType: 'auto', title: '沉冤得雪', weight: 5, text: '组织正式发文为你正名！调令下来了，你官复原职，还获得了额外的嘉奖。那些曾经嘲笑你的人，现在都沉默了。', requireFlag: 'endureRival', effects: {reputation: 4, positionWeight: 3, mentalPressure: -4, risk: -2, integrity: 3, deleteFlag: 'endureRival'} },

    // =====================================================================
    // 第八批：公共池新事件 + 跨系统事件链
    // =====================================================================
    // === 公共池：职称评定链 ===
    { id: 'e537', stage: 'work', eventType: 'choice', title: '职称评定', weight: 5, text: '又到了职称评定的季节。今年你符合中级职称的申报条件，但材料准备繁琐——需要论文、业绩证明、继续教育学时。同事说"随便弄弄就行"，你知道"随便"通常不随便。', pools: ['public'], choices: [
      { text: '认真准备材料争取一次通过', effects: {workAbility: 3, mentalPressure: 3, reputation: 2, desire: 2, flag: 'titleReview'} },
      { text: '先摸摸底看看其他人怎么准备', effects: {eq: 1, mentalPressure: -1, background: 1, flag: 'titleReview'} },
      { text: '今年太忙了明年再说', effects: {mentalPressure: -2, desire: -1, positionWeight: -1} },
      { text: '请有经验的同事指导帮忙', effects: {eq: 1, background: 2, mentalPressure: 1, workAbility: 1, flag: 'titleReview'} },
      { text: '花钱请人帮忙整理材料', effects: {risk: 2, mentalPressure: 1, reputation: -1, familyPressure: 1} },
    ]},
    { id: 'e538', stage: 'work', eventType: 'auto', title: '职称通过', weight: 5, text: '职称评审结果出来了——你通过了！工资涨了一点，简历上多了一行。虽然不是多大的事，但你知道这是在体制内"熬资历"的必经之路。', requireFlag: 'titleReview', pools: ['public'], effects: {reputation: 3, positionWeight: 2, workAbility: 2, mentalPressure: -2, desire: 1} },

    // === 公共池：会议发言链 ===
    { id: 'e539', stage: 'work', eventType: 'choice', title: '会议发言', weight: 5, text: '领导让你在全体干部大会上做一次经验交流发言。你手里有现成的材料，但要把工作总结讲出"亮点"需要花功夫。同事们说"讲得好不如PPT做得好"。', pools: ['public'], choices: [
      { text: '精心准备讲稿和PPT', effects: {workAbility: 3, mentalPressure: 3, reputation: 2, positionWeight: 2, flag: 'speechDone'} },
      { text: '讲真实的感受不做表面文章', effects: {integrity: 3, reputation: 2, mentalPressure: 2, flag: 'speechDone'} },
      { text: '请同事帮忙改稿子提建议', effects: {eq: 1, background: 2, mentalPressure: 1, flag: 'speechDone'} },
      { text: '照本宣科随便念念', effects: {mentalPressure: -1, reputation: -1, positionWeight: -1} },
      { text: '脱稿即兴发挥展示自信', effects: {eq: 2, desire: 2, mentalPressure: 4, reputation: 2} },
    ]},
    { id: 'e540', stage: 'work', eventType: 'auto', title: '发言获赞', weight: 5, text: '你的发言反响不错！会后好几个同事来加微信要你的PPT。领导拍了拍你的肩膀说"讲得不错，下次有重要的材料交给你"。', requireFlag: 'speechDone', pools: ['public'], effects: {reputation: 3, positionWeight: 2, workAbility: 2, mentalPressure: -2, eq: 1, appearance: 1} },

    // === 公共池：临时抽调链 ===
    { id: 'e541', stage: 'work', eventType: 'choice', title: '临时抽调', weight: 5, text: '上级临时组建了一个工作专班，需要从各单位抽调精干力量。你的名字出现在推荐名单上。去专班意味着三个月的高强度工作，但干得好会被上级记住。', pools: ['public'], choices: [
      { text: '主动请缨，迎接挑战', effects: {workAbility: 3, desire: 2, mentalPressure: 4, reputation: 2, flag: 'tempTask'} },
      { text: '接受安排但有所保留', effects: {eq: 1, workAbility: 1, mentalPressure: 2, reputation: 1} },
      { text: '以手头工作繁重为由推掉', effects: {mentalPressure: -1, positionWeight: -1, reputation: -1} },
      { text: '利用这个机会学点新东西', effects: {iq: 2, workAbility: 2, mentalPressure: 3, flag: 'tempTask'} },
      { text: '在专班工作中多交朋友', effects: {eq: 1, background: 3, mentalPressure: 2, flag: 'tempTask'} },
    ]},
    { id: 'e542', stage: 'work', eventType: 'auto', title: '专班归来', weight: 5, text: '三个月的工作专班结束了。你不仅完成了任务，还认识了一群来自不同单位的同事。专班领导在总结会上点了你的名，说"这个同志工作很扎实"。', requireFlag: 'tempTask', pools: ['public'], effects: {reputation: 4, positionWeight: 3, background: 2, mentalPressure: -3, workAbility: 2} },

    // === 公共池：年终述职链 ===
    { id: 'e543', stage: 'work', eventType: 'choice', title: '年终述职', weight: 5, text: '年终述职大会要开始了。你要在全科室面前总结一年的工作，领导和同事都会根据你的述职表现评分。你看着去年同事的述职PPT，有些人的"成绩"水分明显。', pools: ['public'], choices: [
      { text: '实事求是总结成绩和不足', effects: {integrity: 3, mentalPressure: 1, reputation: 2, positionWeight: 1} },
      { text: '适当包装让工作显得更有分量', effects: {desire: 2, mentalPressure: 2, positionWeight: 2, risk: 1} },
      { text: '重点突出数据用数字说话', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2, flag: 'yearReview'} },
      { text: '把自己和团队的成绩都列清楚', effects: {eq: 1, reputation: 2, mentalPressure: 1, workAbility: 1, flag: 'yearReview'} },
      { text: '领导爱听什么我就写什么', effects: {risk: 2, integrity: -2, desire: 2, positionWeight: 1} },
    ]},
    { id: 'e544', stage: 'work', eventType: 'auto', title: '述职好评', weight: 5, text: '述职评价出来了——你获得了"优秀"等次。虽然不是最高的，但在全科室二十多人里能进前三已经很不错了。这为来年的晋升打下了好基础。', requireFlag: 'yearReview', pools: ['public'], effects: {reputation: 3, positionWeight: 2, mentalPressure: -2, desire: 1, workAbility: 1} },

    // === 公共池：单位团建链 ===
    { id: 'e545', stage: 'life', eventType: 'choice', title: '单位团建', weight: 5, text: '工会组织周末去郊外团建——爬山+农家乐。你知道这意味着要在休息日早起、和不太熟的同事尬聊、还要参加一些让你想起学生时代运动会的活动。', pools: ['public'], choices: [
      { text: '积极参加融入集体', effects: {eq: 2, background: 2, mentalPressure: 2, reputation: 2, body: 1, flag: 'teamBuilding2'} },
      { text: '别人都去了不去不太好', effects: {eq: 1, mentalPressure: 1, background: 1, reputation: 1} },
      { text: '以家庭原因为由请假', effects: {familyPressure: -2, mentalPressure: -1, eq: -1, reputation: -1, desire: 2} },
      { text: '主动组织游戏活跃气氛', effects: {eq: 2, background: 2, reputation: 2, mentalPressure: 2, flag: 'teamBuilding2'} },
      { text: '去了但全程玩手机', effects: {eq: -1, mentalPressure: -1, background: -1} },
    ]},
    { id: 'e546', stage: 'life', eventType: 'auto', title: '团建收获', weight: 5, text: '团建比你想的有意思——你发现平时不苟言笑的同事居然会烧烤，冷面的领导唱KTV意外地好听。大家在篝火旁聊了很多工作之外的话题，距离拉近了不少。', requireFlag: 'teamBuilding2', pools: ['public'], effects: {background: 2, eq: 1, mentalPressure: -3, reputation: 1} },

    // === 公共池：独立事件 ===
    { id: 'e547', stage: 'life', eventType: 'choice', title: '暴雨通勤', weight: 5, text: '今天早上下起了暴雨，地铁站积水严重，公交也堵在路上。你站在单位门口浑身湿透，鞋子里灌满了水。离上班时间还有五分钟。', pools: ['public'], choices: [
      { text: '擦干水整理仪态准备上班', effects: {integrity: 2, mentalPressure: 1, workAbility: 1, reputation: 1} },
      { text: '发条朋友圈吐槽天气', effects: {desire: 1, mentalPressure: -1, reputation: -1} },
      { text: '迟到就迟到吧先换身衣服', effects: {mentalPressure: -1, body: 1, positionWeight: -1} },
      { text: '用打车软件加钱叫车', effects: {familyPressure: 1, mentalPressure: -1, iq: 1} },
      { text: '看到同事也在躲雨一起等', effects: {eq: 1, background: 1, mentalPressure: -1} },
    ]},
    { id: 'e548', stage: 'work', eventType: 'choice', title: '停车纠纷', weight: 5, text: '单位停车位紧张，你来得早占了个车位。下班时发现你的车被另一辆车堵住了，车上没有留电话。等了二十分钟车主没来，你急着去接孩子。', pools: ['public'], choices: [
      { text: '在单位群里问问是谁的车', effects: {eq: 1, mentalPressure: 1, background: 1, luck: -1} },
      { text: '打122叫交警拖车', effects: {integrity: 2, risk: 1, mentalPressure: 2} },
      { text: '打车先走回头再来开', effects: {familyPressure: 1, mentalPressure: -1, workAbility: 1} },
      { text: '在对方车上留个纸条提醒', effects: {eq: 1, mentalPressure: -1, integrity: 1} },
      { text: '找单位保安帮忙解决', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'e549', stage: 'work', eventType: 'choice', title: '食堂改革', weight: 5, text: '单位食堂承包合同到期了，要重新招标。同事们私下的意见很大——有人说菜太难吃，有人说份量太少，有人嫌太贵。领导让你负责收集意见并拿出方案。', pools: ['public'], choices: [
      { text: '发问卷收集全单位意见', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, flag: 'canteenReform'} },
      { text: '对比其他单位食堂方案', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '找几个同事聊聊就行', effects: {workAbility: 1, mentalPressure: 1, reputation: -1, desire: 2} },
      { text: '招标过程透明化让大家参与', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, reputation: 2, flag: 'canteenReform'} },
      { text: '联系几家餐饮公司来试菜', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e550', stage: 'work', eventType: 'auto', title: '食堂焕新', weight: 5, text: '新食堂开张了！菜品种类多了，价格也降了，还有了水果和酸奶。同事们提起你都说"这次是真的干了件实事"，连平时不打招呼的人都冲你笑。', requireFlag: 'canteenReform', pools: ['public'], effects: {reputation: 3, eq: 1, mentalPressure: -2, positionWeight: 1} },

    // === 跨系统：联合执法链 ===
    { id: 'e551', stage: 'work', eventType: 'choice', title: '联合执法', weight: 5, text: '上级部署了一次多部门联合执法行动，涉及市场监管、公安、消防、卫生等七八个部门。你是本单位的联络人，需要在各部门之间协调执法时间和方案。', pools: ['政法系统', '执法部门', '政府部门', '民生部门'], choices: [
      { text: '牵头制定统一的联合执法方案', effects: {workAbility: 3, eq: 1, mentalPressure: 4, reputation: 2, positionWeight: 2, flag: 'jointEnforce'} },
      { text: '建立执法信息共享平台', effects: {iq: 3, workAbility: 2, mentalPressure: 3, background: 2, flag: 'jointEnforce'} },
      { text: '各部门分头行动最后汇总', effects: {workAbility: 1, mentalPressure: 1, risk: -1} },
      { text: '和各部门联络人建立微信群', effects: {eq: 1, background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '主动请缨带队去最复杂的点', effects: {desire: 2, workAbility: 3, mentalPressure: 4, reputation: 3} },
    ]},
    { id: 'e552', stage: 'work', eventType: 'auto', title: '执法联动', weight: 5, text: '联合执法行动圆满结束！多部门联动的经验被写成了典型案例。你在总结会上说"跨部门协作最大的难点不是业务，是理念和沟通"，大家纷纷点头。', requireFlag: 'jointEnforce', pools: ['政法系统', '执法部门', '政府部门', '民生部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 3, background: 3, mentalPressure: -2} },

    // === 跨系统：跨部门项目链 ===
    { id: 'e553', stage: 'work', eventType: 'choice', title: '跨部门项目', weight: 5, text: '市里启动了一个重大建设项目，涉及发改、财政、住建、自然资源等好几个部门的审批。你被指定为项目协调人，需要在各部门之间"跑手续"。', pools: ['政府部门', '党委系统', '机关'], choices: [
      { text: '建立跨部门会商机制提高效率', effects: {workAbility: 3, eq: 1, mentalPressure: 4, reputation: 2, flag: 'crossDept'} },
      { text: '给每个部门送上进度表定期督办', effects: {workAbility: 2, positionWeight: 2, mentalPressure: 3, risk: -1, flag: 'crossDept'} },
      { text: '找领导出面推动关键环节', effects: {background: 2, mentalPressure: 2, workAbility: 1, positionWeight: 1} },
      { text: '逐家拜访各部门负责人', effects: {eq: 2, background: 2, mentalPressure: 3, reputation: 1} },
      { text: '能推就推别把事揽自己身上', effects: {mentalPressure: -1, positionWeight: -2, reputation: -2, desire: 1} },
    ]},
    { id: 'e554', stage: 'work', eventType: 'auto', title: '项目落地', weight: 5, text: '跨部门项目终于落地了！你在各个部门之间协调了大半年，被推诿过、被拖延过、也被敷衍过。但现在看着项目开工，你觉得一切都值了。领导在全系统大会上表扬了你。', requireFlag: 'crossDept', pools: ['政府部门', '党委系统', '机关'], effects: {reputation: 5, positionWeight: 4, workAbility: 3, background: 3, mentalPressure: -3} },

    // === 跨系统：纪委协查链 ===
    { id: 'e555', stage: 'work', eventType: 'choice', title: '配合纪委', weight: 5, text: '纪委到你单位调取一份档案资料，需要你配合提供。你发现这份资料涉及一个你认识的老领导。同事私下说"别多嘴"，但你隐约觉得这份资料可能会牵扯出更大的问题。', pools: ['党委系统', '机关', '政府部门', '政法系统'], choices: [
      { text: '如实提供资料配合调查', effects: {integrity: 4, risk: 2, mentalPressure: 3, reputation: 2, flag: 'assistAntiCorrupt'} },
      { text: '按照规定走请示程序', effects: {integrity: 3, mentalPressure: 2, positionWeight: 1, flag: 'assistAntiCorrupt'} },
      { text: '推说资料不在自己手里', effects: {mentalPressure: -2, risk: 1, integrity: -3, reputation: -2} },
      { text: '先私下通知老领导', effects: {risk: 5, integrity: -4, mentalPressure: 3} },
      { text: '找单位纪检组长请示', effects: {integrity: 3, background: 2, mentalPressure: 2, flag: 'assistAntiCorrupt'} },
    ]},
    { id: 'e556', stage: 'work', eventType: 'auto', title: '协查立功', weight: 5, text: '你提供的关键资料帮助纪委查实了一起贪腐案！纪委在反馈函中特别表扬了你"积极配合、态度端正"。单位领导也对你刮目相看。', requireFlag: 'assistAntiCorrupt', pools: ['党委系统', '机关', '政府部门', '政法系统'], effects: {reputation: 5, positionWeight: 3, integrity: 3, background: 2, mentalPressure: -2} },

    // === 跨系统：政法协调链 ===
    { id: 'e557', stage: 'work', eventType: 'choice', title: '政法协调', weight: 5, text: '你被借调到市委政法委协助处理一件跨部门协调事务。公检法三家各执一词，都在说"依法依规"，但推来推去当事人已经跑了三趟。', pools: ['政法系统', '党委系统', '机关'], choices: [
      { text: '召集三家坐下来对案协调', effects: {eq: 2, workAbility: 3, mentalPressure: 4, reputation: 2, flag: 'legalCoord'} },
      { text: '从当事人的视角理清流程', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, reputation: 2, flag: 'legalCoord'} },
      { text: '向政法委领导汇报请求指示', effects: {background: 2, mentalPressure: 1, positionWeight: 1, integrity: 2, desire: 2} },
      { text: '让公检法各自出具书面意见', effects: {integrity: 2, mentalPressure: 1, workAbility: 1, risk: -1} },
      { text: '分别找三家的人私下吃饭', effects: {eq: 1, background: 2, risk: 2, mentalPressure: 2} },
    ]},
    { id: 'e558', stage: 'work', eventType: 'auto', title: '协调成功', weight: 5, text: '经过你的协调，公检法三家终于达成了共识。当事人拿到了满意的处理结果，专程来感谢你。政法委书记说"以后这种跨部门的协调就交给你了"。', requireFlag: 'legalCoord', pools: ['政法系统', '党委系统', '机关'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, eq: 1, mentalPressure: -2} },

    // === 跨系统：数字政务链（技术→政府） ===
    { id: 'e559', stage: 'work', eventType: 'choice', title: '数字政务', weight: 5, text: '省政府推进"一网通办"改革，你被抽调到工作组负责协调各部门的数据对接。有些部门以"数据安全"为由不愿共享，有些是技术系统太老旧根本接不上，还有的根本不重视。', pools: ['技术部门', '数据部门', '政府部门'], choices: [
      { text: '先做试点用成果说话', effects: {iq: 3, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'digitalGov'} },
      { text: '制定统一的数据标准和技术规范', effects: {iq: 2, workAbility: 3, mentalPressure: 3, risk: -1, flag: 'digitalGov'} },
      { text: '逐家登门拜访说服抵触的部门', effects: {eq: 2, background: 2, mentalPressure: 4, reputation: 1} },
      { text: '按行政命令推进不管阻力', effects: {desire: 2, workAbility: 2, risk: 2, mentalPressure: 3} },
      { text: '引入第三方技术公司协助', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e560', stage: 'work', eventType: 'auto', title: '一网通办', weight: 5, text: '你主导的"一网通办"项目上线了！群众办事从"跑多个窗口"变成了"只填一张表"。省政府门户网站上发布了你的改革经验，点击量突破了十万。', requireFlag: 'digitalGov', pools: ['技术部门', '数据部门', '政府部门'], effects: {reputation: 6, positionWeight: 4, workAbility: 3, iq: 2, mentalPressure: -3} },

    // ==================== 经济决策线（v2.1 财富系统深化） ====================
    // e650：购房决策（财富>120 触发，最大财富决策）
    { id: 'e650', stage: 'life', eventType: 'choice', title: '购房决策', weight: 4, text: '攒了几年积蓄，你开始考虑置业。有人说体制内要趁早买房，有人说再等等房价会降。这可能是你人生中最大的一笔支出。', pools: ['public'], requireWealth: 120, excludeFlag: 'hasHouse', choices: [
      { text: '全款买一套市中心学区房', effects: {wealth: -75, familyPressure: -5, reputation: 2, background: 2, mentalPressure: 2, family: 1, flag: 'hasHouse'} },
      { text: '贷款买一套改善型住房', effects: {wealth: -60, familyPressure: -3, reputation: 1, background: 1, mentalPressure: 4, family: 1, flag: 'hasHouse'} },
      { text: '继续攒钱，观望市场', effects: {mentalPressure: -1, familyPressure: 1} },
      { text: '买一套小户型投资出租', effects: {wealth: -45, familyPressure: -2, iq: 1, background: 1, family: 1, flag: 'hasHouse'} },
    ]},
    // e651：家庭理财（财富>200 触发）
    { id: 'e651', stage: 'life', eventType: 'choice', title: '家庭理财', weight: 4, text: '家里的积蓄渐渐多了起来，怎么打理成了一门学问。有人建议买基金，有人建议存定期，也有人拉你投资做生意。', pools: ['public'], requireWealth: 200, excludeFlag: 'finPlanned', choices: [
      { text: '买稳健型基金定投', effects: {wealth: 10, iq: 1, mentalPressure: 1, flag: 'finPlanned', family: 1} },
      { text: '全部存银行定期', effects: {wealth: 8, mentalPressure: -1, desire: -2, flag: 'finPlanned'} },
      { text: '跟朋友合伙做生意', effects: {wealth: 20, risk: 4, mentalPressure: 3, background: 1, flag: 'finPlanned'} },
      { text: '投资孩子教育基金', effects: {wealth: -20, familyPressure: -3, eq: 1, flag: 'finPlanned'} },
    ]},
    // e652：子女教育金（有孩子+财富 触发）
    { id: 'e652', stage: 'life', eventType: 'choice', title: '子女教育投入', weight: 5, text: '孩子的教育是笔大开销。学区房、辅导班、兴趣班……每一项都在考验你的钱包。投入多少，关系着孩子的未来。', pools: ['public'], requireChild: true, choices: [
      { text: '重金投入，请最好的老师', effects: {wealth: -40, familyPressure: -3, reputation: 1, mentalPressure: 3, iq: 2} },
      { text: '适度投入，量力而行', effects: {wealth: -15, familyPressure: -1, mentalPressure: 1, eq: 1} },
      { text: '顺其自然，不刻意加压', effects: {mentalPressure: -2, familyPressure: -1, desire: -2, eq: 1} },
      { text: '砸钱上最好的班，不能输在起跑线', effects: {wealth: -60, familyPressure: -5, reputation: 2, mentalPressure: 4, iq: 3, body: -1}, minWealth: 90 },
    ]},
];
