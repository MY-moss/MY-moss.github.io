// v2.1.109 第四批内容换血
const gd_events_renew35_arcs = [
  {
    "id": "renew_lesson_1",
    "title": "小梁的第二份志愿表",
    "text": "新来的小梁请你看一份岗位选择表。大家都建议他去更容易获得提拔的综合岗位，但他原来学的是技术，桌上那份专业岗位的申请已填了一半。他问：“您当年选的是想做的事，还是能走得更远的事？”",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "讲清两种岗位的实际日常，让他自己决定",
        "result": "你没有替小梁填表。他带走了两份岗位说明，准备再问问实际从事这些工作的人。",
        "effects": {
          "flag": "renewLessonChoice",
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "建议优先考虑发展机会，提供自己的经验",
        "result": "小梁记下综合岗位的要求，也说自己还需要想想。",
        "effects": {
          "flag": "renewLessonCareer",
          "positionWeight": 1,
          "eq": 1
        }
      },
      {
        "text": "建议先完成技术工作，不急于改变方向",
        "result": "你愿意在业务上提供指导，但不能替他保证未来的机会。",
        "effects": {
          "flag": "renewLessonCraft",
          "workAbility": 1,
          "mentalPressure": 2
        }
      }
    ],
    "weight": 4,
    "year": [
      27,
      48
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_lesson_2",
    "title": "没有填上的推荐栏",
    "text": "两年后，小梁拿着一份外地技术团队的招聘信息回来。他不再考虑原来的两种岗位，而是在权衡离开熟悉的工作环境。单位也正缺熟悉业务的人，负责人希望他留下。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "帮助核对履历事实，尊重他独立选择",
        "result": "你整理了小梁实际负责的工作记录，没有要求他用留下来交换推荐。",
        "effects": {
          "setFlags": [
            "renewLessonReviewed",
            "renewLessonRelease"
          ],
          "integrity": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "讨论留下来的条件，明确哪些安排可以兑现",
        "result": "你们把岗位发展与具体工作分开谈，小梁保留自己的决定。",
        "effects": {
          "setFlags": [
            "renewLessonReviewed",
            "renewLessonTerms"
          ],
          "eq": 2,
          "workAbility": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "只安排交接，不参与他的个人决定",
        "result": "接手者取得必要材料，小梁的职业选择不再由你评价。",
        "effects": {
          "setFlags": [
            "renewLessonReviewed",
            "renewLessonDistance"
          ],
          "mentalPressure": -2,
          "workAbility": 1
        }
      }
    ]
  },
  {
    "id": "renew_lesson_3",
    "title": "一场没有头衔的讲座",
    "text": "三年后，你在公开技术交流活动中见到小梁。他的演讲没有提到当年的岗位选择，只讲了一个自己多年没能解决的问题。散场后他走过来，问你还记不记得那张志愿表。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "听他讲这些年的经历，不急着评价当初的选择",
        "result": "你们谈起后来遇到的问题。小梁的职业经历并不只是那张表的结果。",
        "effects": {
          "flag": "renewLessonLegacy",
          "eq": 2,
          "mentalPressure": -2
        }
      },
      {
        "text": "和他讨论那项技术难题，保持平等交流",
        "result": "你们各自说出掌握的情况，约定以后只交流公开资料。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "简单问候，把剩下的时间留给他和同行",
        "result": "你们互道珍重。他转身加入正在讨论的同行。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_room_1",
    "title": "借来的教室",
    "text": "一处社区活动室维修期间，隔壁学校愿意在周末临时开放两间教室。原来的活动有儿童阅读、老年合唱和居民自习，临时场地却只能容纳其中一部分。负责活动的唐老师拿着三份名单来找你。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "优先保留儿童阅读，同时寻找其他临时空间",
        "result": "阅读活动能够继续，合唱与自习仍要等待新的安排。",
        "effects": {
          "flag": "renewRoomRead",
          "peopleReputation": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "轮流安排三类活动，接受每类次数减少",
        "result": "每组都保留了一部分时间，代价是所有人都需要重新安排日程。",
        "effects": {
          "flag": "renewRoomRotate",
          "eq": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "先暂停部分活动，等正式场地修复",
        "result": "临时协调工作减少，但一些原本固定见面的人失去了周末安排。",
        "effects": {
          "flag": "renewRoomPause",
          "positionWeight": 1,
          "peopleReputation": -2,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      26,
      49
    ]
  },
  {
    "id": "renew_room_2",
    "title": "多出来的一扇门",
    "text": "两年后，活动室修好，学校却提出保留周末开放的做法。过去临时参加的居民中，有些已经形成新的阅读小组；原活动室的使用者也期待恢复旧安排。唐老师希望你协助整理意见，而不是直接决定归属。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "让两处空间分别试行，记录真实使用需求",
        "result": "两处场地都有了试行安排，后续仍需核对人力与维护成本。",
        "effects": {
          "setFlags": [
            "renewRoomReviewed",
            "renewRoomDual"
          ],
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "优先恢复原活动室，保留学校的独立自愿活动",
        "result": "原活动陆续恢复，学校不再承担社区整体安排。",
        "effects": {
          "setFlags": [
            "renewRoomReviewed",
            "renewRoomReturn"
          ],
          "eq": 1,
          "peopleReputation": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "公开讨论有限场地和维护资源，再确定安排",
        "result": "会议没有马上得出结论，原有组织者也获得了表达意见的机会。",
        "effects": {
          "setFlags": [
            "renewRoomReviewed",
            "renewRoomDiscuss"
          ],
          "integrity": 2,
          "mentalPressure": 2
        }
      }
    ]
  },
  {
    "id": "renew_room_3",
    "title": "墙上的借阅卡",
    "text": "三年后，你在活动室看见一面旧借阅卡做成的展示墙。有个当年参加阅读活动的孩子已经成了志愿者。唐老师正在准备离开这个岗位，新团队想保留哪些做法、又想改变哪些安排。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "请新团队和参与者共同决定，移交历史记录",
        "result": "你把能确认的活动与使用记录交给他们，没有把当初的临时方案定为永久规则。",
        "effects": {
          "flag": "renewRoomLegacy",
          "workAbility": 2,
          "peopleReputation": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "作为普通参与者来看看，不再主持安排",
        "result": "你坐在活动室的一角，发现不负责一切也能享受这里的时间。",
        "effects": {
          "mentalPressure": -3,
          "eq": 1
        }
      },
      {
        "text": "留下当初的困难和未解决问题供新团队参考",
        "result": "移交材料不只记录成功的部分，后来者可以据此避免重复摸索。",
        "effects": {
          "integrity": 2,
          "workAbility": 1,
          "mentalPressure": 1
        }
      }
    ]
  },
  {
    "id": "renew_keepsake_1",
    "title": "谁留下那台旧收音机",
    "text": "亲属们整理一位长辈留下的旧物。那台坏了多年的收音机并不值多少钱，但两个人都记得小时候在它旁边度过的晚上。有人说卖掉省事，有人想留下，大家忽然发现自己记住的是不同的故事。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "先记录各自的记忆，再商量旧物去处",
        "result": "你们没有马上搬走收音机。几段互不相同的回忆先留在了家庭记录里。",
        "effects": {
          "flag": "renewKeepsakeRecord",
          "eq": 2,
          "familyPressure": -2,
          "mentalPressure": 1
        }
      },
      {
        "text": "尊重更需要保存它的人，自己留一张照片",
        "result": "收音机留给另一位亲属，你保留了一张照片和那天的谈话。",
        "effects": {
          "flag": "renewKeepsakeGive",
          "familyPressure": -2,
          "mentalPressure": -1
        }
      },
      {
        "text": "不介入物品归属，只帮忙完成整理",
        "result": "你把时间留给实际整理工作，亲属们还需自行商量去处。",
        "effects": {
          "flag": "renewKeepsakeStepBack",
          "mentalPressure": -1,
          "familyPressure": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      30,
      51
    ]
  },
  {
    "id": "renew_keepsake_2",
    "title": "照片里没有的人",
    "text": "两年后，亲属发来一张修复过的家庭合照。一位原来很少出现的家人认出了照片中的地点，也讲起一段与大家记忆不同的往事。有人希望重新写照片说明，有人觉得没必要再提。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "把不同记忆分别记录，不强行得出统一版本",
        "result": "照片说明注明了能够确认的部分，也保留了不同人的口述。",
        "effects": {
          "setFlags": [
            "renewKeepsakeReviewed",
            "renewKeepsakeVoices"
          ],
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "只确认照片出处，尊重不愿谈往事的人",
        "result": "照片的时间地点逐渐清楚，私人经历没有被要求公开。",
        "effects": {
          "setFlags": [
            "renewKeepsakeReviewed",
            "renewKeepsakePrivacy"
          ],
          "familyPressure": -2,
          "mentalPressure": -1
        }
      },
      {
        "text": "暂时不改说明，约定日后有需要再讨论",
        "result": "照片先按原样保存，分歧也没有被假装已经解决。",
        "effects": {
          "setFlags": [
            "renewKeepsakeReviewed",
            "renewKeepsakeWait"
          ],
          "mentalPressure": -2,
          "familyPressure": 1
        }
      }
    ]
  },
  {
    "id": "renew_keepsake_3",
    "title": "给后来的人留一张纸",
    "text": "三年后，年轻的亲属开始整理家庭照片。他们不认识旧照片中的大部分人，也不想把每个人的过去都定义成某一种故事。他们问你，哪些事情可以写下来，哪些事情应该留给当事人。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "提供已经确认并获得同意的资料",
        "result": "年轻人得到一份有边界的家庭记录，不必依靠你的记忆补全所有空白。",
        "effects": {
          "flag": "renewKeepsakeLegacy",
          "eq": 2,
          "familyPressure": -2,
          "mentalPressure": 1
        }
      },
      {
        "text": "只讲自己的经历，邀请其他人自行补充",
        "result": "你留下属于自己的那一页，也给其他人保留不写的权利。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "把原件交给家人，自己不再整理",
        "result": "照片得到了保存，未来如何讲述由他们决定。",
        "effects": {
          "mentalPressure": -3
        }
      }
    ]
  },
  {
    "id": "renew_book_1",
    "title": "没有封面的样书",
    "text": "独立书店办了一次本地故事征集，你认识的编辑阿岑带来一本尚未装订的样书。书里有普通居民的口述、短篇和照片，但印制预算只够做小批量。阿岑希望有人帮忙核对文字并寻找公开展示的机会。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "承诺少量校对时间，不参与出版收益安排",
        "result": "你接下几页稿件，事先说清能够完成的时间和范围。",
        "effects": {
          "flag": "renewBookEdit",
          "mentalPressure": 2,
          "eq": 1
        }
      },
      {
        "text": "只提供公开活动渠道，不承诺出版结果",
        "result": "阿岑得到几项可自行联系的公开渠道，书的内容仍由作者们决定。",
        "effects": {
          "flag": "renewBookLink",
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "买一本试印本支持活动，不承担长期任务",
        "result": "你拿到一册试印本，把精力留给眼下的生活安排。",
        "effects": {
          "flag": "renewBookReader",
          "wealth": -1,
          "mentalPressure": -2
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      48
    ]
  },
  {
    "id": "renew_book_2",
    "title": "撤下的那一页",
    "text": "两年后，阿岑准备再印样书，一位作者却要求撤回自己的口述。原先印出的册子已经散到读者手中。阿岑有些沮丧，担心这一页撤下后作品不再完整，也不想让作者觉得自己的意愿被忽略。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "支持停止后续使用，并说明已流通版本的局限",
        "result": "新印版本不再使用那页口述；已流通册子无法简单收回，处理范围被明确记录。",
        "effects": {
          "setFlags": [
            "renewBookReviewed",
            "renewBookWithdraw"
          ],
          "integrity": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "建议另找自愿提供的文字填补空页",
        "result": "作者的撤回意愿得到尊重，新的文字由编辑另行联系确认。",
        "effects": {
          "setFlags": [
            "renewBookReviewed",
            "renewBookReplace"
          ],
          "workAbility": 1,
          "eq": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "不参与编辑决定，停止自己对旧页的引用",
        "result": "你不再转发或引用那页内容，编辑团队仍需独立处理再印问题。",
        "effects": {
          "setFlags": [
            "renewBookReviewed",
            "renewBookLimit"
          ],
          "mentalPressure": -2,
          "integrity": 1
        }
      }
    ]
  },
  {
    "id": "renew_book_3",
    "title": "一本完全不同的书",
    "text": "三年后，阿岑带着一本新书回来。它不再是当年那册故事的重印，而是新一批作者自己组织的作品。旧稿里的人各自选择了公开或保持沉默，书店也换了经营者。阿岑问你想不想来参加一次读者交流。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "参加交流，只谈自己参与过的部分",
        "result": "你把读者的时间留给新作者，不再代替旧作者讲述私人经历。",
        "effects": {
          "flag": "renewBookLegacy",
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "买一本新书，作为普通读者离开",
        "result": "你带着新书走出店门，不需要把自己的名字写进它的历史。",
        "effects": {
          "wealth": -1,
          "mentalPressure": -3
        }
      },
      {
        "text": "谢绝邀请，保留这段已经结束的经历",
        "result": "阿岑收到简短的祝福。你们没有因为旧合作而必须继续所有新项目。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ]
  }
];
