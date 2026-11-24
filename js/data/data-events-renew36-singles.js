// v2.1.110 内容换血
const gd_events_renew36_singles = [
  {
    "id": "renew_expert_dissent",
    "title": "评审桌上的少数意见",
    "text": "技术评审接近结束，多数人认为方案足以试行。一位评审者提出了一个尚未核实的反例。方案关系到下月的交付，推迟意味着其他团队也要调整计划。你负责汇总意见，不是最终决定者。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "保留少数意见，建议增加一次针对性验证",
        "result": "评审材料增加了尚待验证的条件，交付日期需要重新协调。",
        "effects": {
          "integrity": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "提出限制试行范围，保留停止条件",
        "result": "试行可以推进，但不能扩大到尚未验证的场景。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "如实记录分歧，由评审负责人决定",
        "result": "你没有用自己的表态代替专业结论，后续决定仍需负责人承担。",
        "effects": {
          "mentalPressure": -1,
          "eq": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      30,
      58
    ],
    "requireRankMin": 3
  },
  {
    "id": "renew_stale_contact",
    "title": "电话簿上的旧职务",
    "text": "多年未联系的旧同事已经调离原业务岗位。有人请你通过他的旧联系方式了解一项审批进度，你知道对方早已不负责该事项。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "提供现行公开查询渠道，不联系旧同事",
        "result": "请求者得到正确的渠道，旧同事的私人联系没有被用于公务。",
        "effects": {
          "integrity": 2,
          "eq": 1
        }
      },
      {
        "text": "确认公开职责分工，再建议正式咨询",
        "result": "你核对了现任负责部门，没有给出特殊办理承诺。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "说明自己不了解进度，结束这次请求",
        "result": "没有新增工作或私人义务，事项仍按原渠道处理。",
        "effects": {
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      27,
      58
    ]
  },
  {
    "id": "renew_changed_scope",
    "title": "超出任务书的一页",
    "text": "一个业务项目做到中期，合作单位提出增加新的服务范围。新需求确实合理，却不在既定人力和预算内；直接拒绝可能让一部分潜在使用者继续等待。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "提出正式变更方案，列明成本与延期影响",
        "result": "新增需求进入评估，原交付计划在确认前不被擅自扩大。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "保留当前范围，将新增需求列为后续事项",
        "result": "当前交付可以继续，新需求尚未得到实现承诺。",
        "effects": {
          "positionWeight": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "建议缩减部分原范围以容纳新需求",
        "result": "两类需求需要重新比较，现有使用者也获得表达意见的机会。",
        "effects": {
          "eq": 2,
          "mentalPressure": 2
        }
      }
    ],
    "weight": 4,
    "year": [
      28,
      58
    ],
    "requireRankMin": 3
  },
  {
    "id": "renew_counted_twice",
    "title": "被统计两次的成果",
    "text": "年报汇总时，你发现两个部门都将同一件服务成果纳入各自数据。两部门确实都付出了工作，简单删掉其中一方的记录又会掩盖实际分工。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "区分共同产出与部门贡献，修订汇总口径",
        "result": "总量去除了重复项，两部门的真实参与仍保留记录。",
        "effects": {
          "integrity": 2,
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "先提交分部门数据，明确不能直接相加",
        "result": "交付保留原数据，同时附有统计范围说明。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "申请统一指标定义，暂缓整体成果汇总",
        "result": "报表暂时不完整，下一次统计有了更清楚的依据。",
        "effects": {
          "integrity": 1,
          "positionWeight": -1,
          "mentalPressure": 2
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      58
    ]
  },
  {
    "id": "renew_quiet_resign",
    "title": "同事的离职清单",
    "text": "同事准备离开单位，发来一份私人感谢名单和一份工作移交清单。有人建议你劝他把选择再往后拖，理由是单位很缺熟练人员；他已安排好之后的生活。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "尊重离开，优先核对必要工作交接",
        "result": "你承担了交接工作，但没有把业务困难变成对他私人选择的要求。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "讨论短期过渡安排，由对方自行决定",
        "result": "离开日期不变，双方只确认了能够完成的过渡事项。",
        "effects": {
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "完成自己负责的交接，不干涉其他安排",
        "result": "你保留了正常工作边界，也没有承诺额外的替班。",
        "effects": {
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      26,
      58
    ]
  },
  {
    "id": "renew_notice_board",
    "title": "没有电子屏的站点",
    "text": "服务通知准备全部转到线上发布。走访时，一些居民说他们仍依靠街边的公告栏了解临时变更，另一些人则表示公告栏的信息经常过期。维护人员只有固定的巡查时间。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "保留少量公告栏，明确更新频率与责任",
        "result": "线下通知有明确维护安排，但覆盖点数量有所减少。",
        "effects": {
          "peopleReputation": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "试行多渠道通知，记录遗漏情况",
        "result": "你们先比较渠道覆盖，再决定长期投入。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "先更新现有公告栏，提交维护资源缺口",
        "result": "旧信息被清理，长期维护方案尚未确定。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      24,
      58
    ]
  },
  {
    "id": "renew_unfunded_plan",
    "title": "没有列入预算的建议",
    "text": "一份居民反复提出的设施改进建议未列入本年度预算。它不是紧急安全问题，却确实影响日常使用。负责答复的人希望直接说“已纳入计划”，而相关安排还未确认。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "明确当前没有预算，说明后续申报途径",
        "result": "居民得到不太令人满意但可核实的答复。",
        "effects": {
          "integrity": 2,
          "peopleReputation": -1,
          "mentalPressure": 2
        }
      },
      {
        "text": "核对低成本临时改善措施，提出可行建议",
        "result": "部分不便可能先减轻，永久改造仍无确定日期。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "提交需求记录，由预算部门统一评估",
        "result": "你没有擅自承诺经费，建议保留在正式待评估事项中。",
        "effects": {
          "mentalPressure": -1,
          "integrity": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      27,
      58
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_unfair_comparison",
    "title": "不能直接比较的两张表",
    "text": "两个服务点的办理速度差异很大。排名公布后，有人要求末位服务点照搬首位做法。但它承担的疑难事项更多，双方的统计范围也不完全相同。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "先按业务类型重新比较，再讨论改进",
        "result": "新的比较多了几个维度，简单名次不再是唯一结论。",
        "effects": {
          "workAbility": 2,
          "integrity": 1,
          "mentalPressure": 3
        }
      },
      {
        "text": "交流具体流程经验，不要求直接复制排名",
        "result": "双方找出几处可以学习的做法，也保留各自的业务差别。",
        "effects": {
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "说明现有数据不足，建议暂缓据此奖惩",
        "result": "原排名不再直接作为评价依据，仍需补充数据。",
        "effects": {
          "integrity": 2,
          "positionWeight": -1,
          "mentalPressure": 2
        }
      }
    ],
    "weight": 4,
    "year": [
      28,
      58
    ],
    "requireRankMin": 3
  },
  {
    "id": "renew_late_visitor",
    "title": "关门前十分钟",
    "text": "临近下班，外地来办事的人发现自己少了一份证明。按规定不能当场办结，但他第二天必须返回外地。值班同事想帮忙，你们需要确定今晚究竟能做到哪一步。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "核对可提前完成的步骤与远程补件渠道",
        "result": "当事人得到明确的后续步骤，未齐材料没有被违规视为齐全。",
        "effects": {
          "workAbility": 2,
          "peopleReputation": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "提供下次办理预约及完整材料清单",
        "result": "他不必再次逐项摸索，但仍需自行安排下次办理。",
        "effects": {
          "peopleReputation": 1,
          "eq": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "说明不能受理的原因，提供正式咨询方式",
        "result": "当前申请尚未办结，值班工作按时结束。",
        "effects": {
          "integrity": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      23,
      55
    ],
    "requireRankMax": 5
  },
  {
    "id": "renew_repair_priority",
    "title": "小区门口的第二级台阶",
    "text": "社区拟维修一处老旧公共入口。现有预算只够先做一部分，居民对坡道、排水、照明的优先级有不同意见。现场还需要专业人员确认具体工程条件。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "按实际安全及通行需求提出分期建议",
        "result": "优先事项进入专业评估，其余问题仍列在后续清单中。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "组织使用者反馈，再由主管方核定方案",
        "result": "不同群体都能说明具体困难，施工日期暂未确定。",
        "effects": {
          "peopleReputation": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "提交已有维修记录，不代替工程人员决策",
        "result": "你完成职责范围内的工作，工程优先级仍待专业确认。",
        "effects": {
          "integrity": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      58
    ]
  },
  {
    "id": "renew_old_uniform",
    "title": "衣柜最里面的工作服",
    "text": "整理衣柜时，你找到多年前第一次参加现场工作时穿的旧工作服。它已经不再合身，家人问你是不是还想留着。你想起当时同事们忙着完成任务，却没人记得给这件衣服拍照。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "留下旧衣服和一段自己亲历的记述",
        "result": "它变成一件个人纪念，不需要给那段经历增加新的荣誉。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "拍照后按实际情况处理旧物",
        "result": "记忆不必占用整个衣柜，你给现在的生活留出空间。",
        "effects": {
          "mentalPressure": -3
        }
      },
      {
        "text": "暂时收好，不在今天决定去留",
        "result": "你承认自己还没想好，整理工作先停在这一件物品上。",
        "effects": {
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      38,
      60
    ]
  },
  {
    "id": "renew_not_in_photo",
    "title": "合照之外的座位",
    "text": "一个老朋友发来旧合影，照片里有你认识的人，也缺少几位当年经常出现的伙伴。群里有人想给照片附上一段怀旧文章，你记得其中几个人与大家并不是一直相处愉快。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "只补充确认的时间地点，避免替所有人总结",
        "result": "照片得到准确说明，过去的关系不必被写成整齐的故事。",
        "effects": {
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "分享自己记得的一件小事，不评价别人",
        "result": "你留下属于自己的记忆，也给其他人保留不同感受。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "不参与整理，把照片留作个人记录",
        "result": "你没有要求所有人再次聚在一起。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ],
    "weight": 4,
    "year": [
      32,
      60
    ]
  },
  {
    "id": "renew_unshared_room",
    "title": "留给自己的半小时",
    "text": "亲近的人邀请你一起参加固定活动，你其实更希望有一段独处时间。对方并不反对，只担心总是临时取消会影响自己安排。你们需要的是能遵守的日程，而不是谁更重视谁。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "约定固定的共同活动和各自独处时间",
        "result": "日程有了明确边界，两个人都不用靠猜测安排生活。",
        "effects": {
          "familyPressure": -3,
          "mentalPressure": 1
        }
      },
      {
        "text": "减少共同活动频率，提前说明变更",
        "result": "你们保留共同兴趣，空出的时间分别安排。",
        "effects": {
          "familyPressure": -2,
          "mentalPressure": -1
        }
      },
      {
        "text": "暂停固定约定，改为提前商量的见面",
        "result": "对方可以独立规划时间，不再为临时取消预留整段日程。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      26,
      59
    ]
  },
  {
    "id": "renew_birthday_without_rank",
    "title": "只写名字的邀请函",
    "text": "一位旧友组织小型聚会，邀请函上特意没有职业头衔。他说这次不谈各人的工作成就，只想让大家见面。你却发现自己已经不习惯在陌生人面前介绍工作之外的生活。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "赴约，介绍自己最近真正感兴趣的事",
        "result": "谈话里没有职级比较，你也不必用一项成绩证明自己。",
        "effects": {
          "eq": 2,
          "mentalPressure": -2
        }
      },
      {
        "text": "只参加短时间的聚会，按自己的节奏交往",
        "result": "你没有勉强自己维持整晚的热闹，也与几位旧友说上话。",
        "effects": {
          "mentalPressure": -1,
          "eq": 1
        }
      },
      {
        "text": "谢绝邀请，单独向旧友问候",
        "result": "你保留友谊，同时尊重自己当前的生活安排。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ],
    "weight": 4,
    "year": [
      35,
      60
    ]
  },
  {
    "id": "renew_shared_budget_late",
    "title": "晚饭后的一张账单",
    "text": "一位亲属提出一起支付一次家庭聚会的场地费，但几个人的经济状况差别很大。你看了自己的预算，发现原定安排超出了部分人的承受范围。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "提议缩小活动规模，先确认每个人可承受的支出",
        "result": "新方案不再要求所有人承担同一笔高额费用。",
        "effects": {
          "familyPressure": -2,
          "mentalPressure": 1
        }
      },
      {
        "text": "明确自己愿承担的有限份额，不代替他人承诺",
        "result": "预算边界变得清楚，聚会方式仍需共同商量。",
        "effects": {
          "eq": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "选择参加不需要额外付费的家庭活动",
        "result": "你保留生活开支，也没有把缺席部分活动视为关系破裂。",
        "effects": {
          "mentalPressure": -1,
          "familyPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      28,
      60
    ]
  },
  {
    "id": "renew_retirement_calendar",
    "title": "还没写上日期的日历",
    "text": "你开始思考多年后的生活安排，眼下仍在正常工作。朋友建议把退休计划排得满满当当，你却还不能确定届时的身体、家庭和兴趣状况。桌上有张空日历，你准备只写下真正想尝试的事。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "列出几项不依赖身份的兴趣，先试做一件",
        "result": "日历只填入现在能安排的小事，不代表你已经退休。",
        "effects": {
          "mentalPressure": -3,
          "eq": 1
        }
      },
      {
        "text": "预留照护、财务和休息方面的讨论时间",
        "result": "你开始整理需要与亲近的人商量的问题，没有提前改变职业状态。",
        "effects": {
          "familyPressure": -2,
          "mentalPressure": 1
        }
      },
      {
        "text": "保留空白，不给未来的自己规定任务",
        "result": "你继续当前的工作，也允许未来生活出现新的方向。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ],
    "weight": 4,
    "year": [
      45,
      59
    ]
  }
];
