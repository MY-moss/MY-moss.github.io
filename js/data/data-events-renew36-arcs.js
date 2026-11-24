// v2.1.110 内容换血
const gd_events_renew36_arcs = [
  {
    "id": "renew_grant_1",
    "title": "只开放一次的报名窗口",
    "text": "区域业务联合组公开招募为期一年的课题成员，不涉及职级调整。你想研究积压多年的业务问题，搭档程越却指出现有交付任务还没有替手。报名周五截止，此后名单不再补录。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "报名并安排现有工作交接",
        "result": "申请在截止前提交，你为交接投入额外精力。",
        "effects": {
          "flag": "renewGrantApply",
          "mentalPressure": 3,
          "positionWeight": -1
        }
      },
      {
        "text": "放弃报名，与程越共同完成眼下项目",
        "result": "名单截止了，你保住现有工作安排，却失去本次报名资格。",
        "effects": {
          "flag": "renewGrantStay",
          "workAbility": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "不报名，把研究想法整理成独立笔记",
        "result": "你退出竞争，保留问题清单，之后仍可自行研究。",
        "effects": {
          "flag": "renewGrantNotes",
          "iq": 1,
          "mentalPressure": -2
        }
      }
    ],
    "year": [
      28,
      48
    ],
    "weight": 5,
    "requireRankMin": 2
  },
  {
    "id": "renew_grant_rejected",
    "title": "未进入名单的人",
    "text": "一年后，联合组寄来结题材料。你提交过申请，却没有获选：名额缩减后，你研究的方向未被列入最终课题。程越已经承担过部分交接工作，原本投入的准备时间无法收回。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "向程越说明结果，归还他临时承担的工作",
        "result": "你重新接回职责，承认交接成本并不因申请失败而消失。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantRebuild"
          ],
          "mentalPressure": 3,
          "workAbility": 1
        }
      },
      {
        "text": "将未入选的研究材料整理成可用的工作建议",
        "result": "申请没有成功，但准备工作里仍有能用于本职业务的部分。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantSalvage"
          ],
          "workAbility": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "收好材料，暂时停止额外研究",
        "result": "你接受这次失利，终于不用继续等待名单。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantEnd"
          ],
          "positionWeight": -1,
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_grant_local",
    "title": "没有出发的那一年",
    "text": "联合组的结题报告公开了，其中一项建议与你原来关注的问题有关。你没有参加课题，眼下的工作也已经产生新问题。程越问：还要不要把以前的设想拿出来讨论？",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "结合现有工作重新研究，不复制外地结论",
        "result": "你们找到两个适用条件不同的问题，需要分别验证。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantSalvage"
          ],
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "继续目前的分工，不额外启动研究",
        "result": "你不必因为错过一次机会就追赶所有相关项目。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantEnd"
          ],
          "mentalPressure": -2
        }
      },
      {
        "text": "邀请程越独立提出自己的方案",
        "result": "程越得到提出方案的机会，是否继续由他和团队决定。",
        "effects": {
          "setFlags": [
            "renewGrantReviewed",
            "renewGrantRebuild"
          ],
          "eq": 2,
          "mentalPressure": 1
        }
      }
    ]
  },
  {
    "id": "renew_grant_3",
    "title": "另一份没有署名的报告",
    "text": "四年后，程越所在的业务组公布了针对旧问题的新报告。他们已经换过几次研究方向，其中还有与你最初设想相反的结论。会议组织者请你介绍当年的背景。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "只讲自己掌握的历史，承认当年设想的局限",
        "result": "你没有将今天的研究成果写进自己当年的申请材料。",
        "effects": {
          "flag": "renewGrantLegacy",
          "integrity": 2,
          "eq": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "作为读者提问，了解新结论",
        "result": "讨论继续进行，你可以不同意某些判断，却不必为旧设想辩护。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "提供旧笔记，由现任团队自行使用",
        "result": "材料得到移交，后续课题不需要你的名字才能继续。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_ferry_1",
    "title": "停靠在河对岸的船",
    "text": "一处渡口的短期公共交通补贴即将到期。客流不多，却有几位居民依靠它去镇上看病。运营方提出继续运行需要新的经费；替代公交尚不完善。你参与评估，只能提出建议。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "建议续行短期补贴，保留限期复核",
        "result": "续行建议进入评审，不能保证后续年度仍有经费。",
        "effects": {
          "flag": "renewFerryExtend",
          "peopleReputation": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "建议结束试点，先安排替代接驳",
        "result": "终止建议获得讨论，仍要核对居民实际可达的路线。",
        "effects": {
          "flag": "renewFerryClose",
          "workAbility": 1,
          "peopleReputation": -1,
          "mentalPressure": 2
        }
      },
      {
        "text": "建议合并低频班次，减少运营成本",
        "result": "试行减少班次，部分居民必须调整出行时间。",
        "effects": {
          "flag": "renewFerryMerge",
          "workAbility": 2,
          "mentalPressure": 2
        }
      }
    ],
    "year": [
      27,
      48
    ],
    "weight": 4,
    "requireRankMin": 2
  },
  {
    "id": "renew_ferry_lost",
    "title": "最后一次靠岸",
    "text": "两年后，渡船的原运营方退出，替代运营者也未能落实。即使过去争取过续行，旧渡船也已停止服务。居民在告别渡船的同时，要求核对过渡安排。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "调查停航后的真实出行困难，提出新安排",
        "result": "停航事实写进评估，未解决的需求进入新方案。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryRepair"
          ],
          "peopleReputation": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "优先协调已登记的紧急出行需求",
        "result": "部分居民得到临时接驳信息，普遍服务问题仍需评估。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryTriage"
          ],
          "workAbility": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "如实移交停航记录，不参与后续运营决定",
        "result": "你明确旧方案已经结束，不将新服务算成旧试点的成果。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryHandoff"
          ],
          "integrity": 2,
          "mentalPressure": -1
        }
      }
    ]
  },
  {
    "id": "renew_ferry_bus",
    "title": "接驳车上的空座",
    "text": "两年后，旧渡口停航，接驳公交已试行一段时间。车辆座位经常空着，有居民却仍表示不方便：时刻表并不匹配门诊和集市时间。旧服务无法恢复原状。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "核对使用时段与未乘车居民的需求",
        "result": "接驳评估开始记录时间不匹配的具体问题。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryRepair"
          ],
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "保留现有服务，协调重点时段的临时班次",
        "result": "部分急需得到缓解，长期班次仍受资源限制。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryTriage"
          ],
          "peopleReputation": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "移交现有记录，让运营团队独立评估",
        "result": "你不把空座直接解释为没有需求，也不替运营方决定时刻表。",
        "effects": {
          "setFlags": [
            "renewFerryReviewed",
            "renewFerryHandoff"
          ],
          "integrity": 1,
          "mentalPressure": -1
        }
      }
    ]
  },
  {
    "id": "renew_ferry_3",
    "title": "没有售票窗的河岸",
    "text": "三年后，旧售票窗被拆除，河岸改为步行空间。如今的交通由新的服务体系承担。你遇见一位曾经常坐渡船的居民，他说自己仍会怀念那条船，但并不要求所有事情恢复原样。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "听他讲述新旧出行体验，保留不同评价",
        "result": "你记下他的经历，不把它当作整个地区的统一结论。",
        "effects": {
          "flag": "renewFerryLegacy",
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "核对仍存在的困难，提供正式反馈渠道",
        "result": "他可以继续表达具体需求，不必借助与你的私人关系。",
        "effects": {
          "peopleReputation": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "在河边聊一会儿，不再谈工作",
        "result": "你们都记得那艘船，也各自回到今天的生活。",
        "effects": {
          "mentalPressure": -3
        }
      }
    ]
  },
  {
    "id": "renew_duet_1",
    "title": "没有签字的合作备忘录",
    "text": "同事许闻提出和你一起整理一套共享业务工具。你们都对项目感兴趣，但他希望公开共享，你更在意日后维护负担。桌上那份合作备忘录尚未签字，双方没有承诺必须一起做。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "明确分工与退出办法，再共同开始",
        "result": "你们签下可调整的合作安排，也保留各自退出的权利。",
        "effects": {
          "flag": "renewDuetJoint",
          "workAbility": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "各自做小样，暂不承诺合作",
        "result": "双方保留自己的方案，原定共同项目没有启动。",
        "effects": {
          "flag": "renewDuetSeparate",
          "iq": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "不参与项目，说明自己无法长期维护",
        "result": "许闻继续寻找其他合作者，你保留自己的时间。",
        "effects": {
          "flag": "renewDuetDecline",
          "mentalPressure": -2
        }
      }
    ],
    "year": [
      25,
      48
    ],
    "weight": 4
  },
  {
    "id": "renew_duet_split",
    "title": "把共同文件夹关掉",
    "text": "两年后，许闻决定停止合作。他更希望把精力留给新工具，你仍认为旧版本有使用价值。共享文件夹将被关闭，已经完成的材料必须区分归属及公开权限。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "尊重退出，核对可移交的共同材料",
        "result": "共同项目结束了，只有双方同意的材料继续使用。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetRespect"
          ],
          "integrity": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "经双方同意，保留有限版本供原使用者过渡",
        "result": "旧版有明确的停止维护日期，不再要求许闻回来承担工作。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetBridge"
          ],
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "停止全部新增使用，保留自己的工作记录",
        "result": "你不再维护旧工具，共同项目彻底告一段落。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetClosed"
          ],
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_duet_independent",
    "title": "不同的两个版本",
    "text": "两年后，许闻的工具已由另一组同事使用，与你当初设想的方向不同。有人建议把两套思路合并，许闻并没有主动提出合作。你需要决定是否重新联系。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "先询问实际意愿，不将合并视为当然",
        "result": "许闻说明目前安排不适合合并，你们仍可交换公开经验。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetRespect"
          ],
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "提供自己已有的可公开材料，不要求共同维护",
        "result": "使用者得到一些参考信息，但两个方案仍然独立。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetBridge"
          ],
          "workAbility": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "继续各自的方向，不启动新的合作",
        "result": "你尊重过去没有成立合作的事实。",
        "effects": {
          "setFlags": [
            "renewDuetReviewed",
            "renewDuetClosed"
          ],
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_duet_3",
    "title": "不再共用的署名",
    "text": "三年后，许闻在一次业务分享中介绍自己的新工具。你也被邀请发言，但主办方把你们错写成同一个团队。旧合作或旧设想已经结束，今天不一定需要重新建立联系。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "更正署名和分工，只说明真实关系",
        "result": "节目单得到更正，两人的工作被分别介绍。",
        "effects": {
          "flag": "renewDuetLegacy",
          "integrity": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "请主办方分别联系各自负责人",
        "result": "你不替许闻决定发言内容，自己的材料也独立提交。",
        "effects": {
          "eq": 1,
          "mentalPressure": -1
        }
      },
      {
        "text": "退出此次联合介绍，尊重双方的独立安排",
        "result": "你放弃一次露面机会，没有要求许闻为此改变日程。",
        "effects": {
          "positionWeight": -1,
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_garden_1",
    "title": "借来的半块地",
    "text": "社区招募居民参与一块临时花园的维护，使用协议还有两年。你喜欢园艺，却不能确定两年后的场地安排。邻居方叔问你愿不愿每月留一个周末，一起照顾那几垄植物。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "参加定期维护，接受场地可能收回",
        "result": "你开始参与轮值，并没有取得土地使用权。",
        "effects": {
          "flag": "renewGardenJoin",
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "只帮一次种植，不参加长期维护",
        "result": "你完成当天的工作，明确自己不是固定维护者。",
        "effects": {
          "flag": "renewGardenGuest",
          "mentalPressure": -1
        }
      },
      {
        "text": "不参加，保留自己的周末安排",
        "result": "方叔接受了你的决定，花园由其他居民维护。",
        "effects": {
          "flag": "renewGardenDecline",
          "mentalPressure": -1
        }
      }
    ],
    "year": [
      35,
      51
    ],
    "weight": 4
  },
  {
    "id": "renew_garden_closed",
    "title": "收回土地的通知",
    "text": "两年后，临时花园到期，没有获准续用。你曾参与轮值，方叔也舍不得那几株多年生植物。场地将在月底清理，能够转移的植物数量有限。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "与其他维护者商量，按许可移植少量植物",
        "result": "几株植物被转到允许种植的地方，其余只能留在旧场地。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenMove"
          ],
          "mentalPressure": 2,
          "eq": 1
        }
      },
      {
        "text": "参加最后一次清理，把花园的记录留给大家",
        "result": "花园结束了，你保存的是实际经历，而非继续使用土地的承诺。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenMemory"
          ],
          "mentalPressure": -1,
          "eq": 1
        }
      },
      {
        "text": "退出维护，让其余居民决定最后安排",
        "result": "你交还工具，不再参与后续移植工作。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenLeave"
          ],
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_garden_pass",
    "title": "空地上的告别",
    "text": "两年后，临时花园的使用期限届满。你不是长期维护者，经过时看见方叔正在整理工具。他问你是否有空来参加最后一次开放日，并没有请你为场地续用帮忙。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "参加开放日，听维护者讲这两年的经历",
        "result": "你了解了自己没有亲历的部分，没有把它讲成自己的故事。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenMemory"
          ],
          "eq": 1,
          "mentalPressure": -1
        }
      },
      {
        "text": "帮忙搬运已获准转移的花盆",
        "result": "你只承担当天明确的任务，植物的归属由维护者决定。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenMove"
          ],
          "mentalPressure": 1,
          "eq": 1
        }
      },
      {
        "text": "问候方叔，不参加最后的活动",
        "result": "你们道别，花园的后续安排由参与者处理。",
        "effects": {
          "setFlags": [
            "renewGardenReviewed",
            "renewGardenLeave"
          ],
          "mentalPressure": -2
        }
      }
    ]
  },
  {
    "id": "renew_garden_3",
    "title": "另一季花开",
    "text": "三年后，你在社区另一处花坛见到方叔。他正在和新居民一起种植，已经不是原来花园的负责人。旧场地并未恢复，这里也不是旧花园的重建。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "和他聊聊新的植物，接受旧花园已经结束",
        "result": "你们不再讨论如何恢复那块地，而是看了看眼前的新芽。",
        "effects": {
          "flag": "renewGardenLegacy",
          "mentalPressure": -3,
          "eq": 1
        }
      },
      {
        "text": "了解新活动的安排，再决定是否参加",
        "result": "方叔给你活动时间，你没有因为过去参与过就必须继续。",
        "effects": {
          "eq": 1,
          "mentalPressure": -1
        }
      },
      {
        "text": "问候后离开，继续自己的生活",
        "result": "你把这次见面留在记忆里，不新增任何承诺。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ]
  }
];
