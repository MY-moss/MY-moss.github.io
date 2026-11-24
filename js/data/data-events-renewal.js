// v2.1.106 内容换血：真实取舍、延迟反馈、可核查的后果。
const gd_events_renewal = [
  {
    "id": "renew_window_1",
    "stage": "work",
    "eventType": "choice",
    "title": "最后一张纸质申请表",
    "text": "大厅的新系统上线了，窗口前却排着几个不会使用智能手机的老人。负责数据录入的同事把纸质申请表推给你：继续受理会增加重复录入量，全部转线上则能按期完成本月指标。",
    "choices": [
      {
        "text": "保留人工入口，同时记录重复办理成本",
        "effects": {
          "flag": "renewWindowInclusive",
          "workAbility": 2,
          "mentalPressure": 3,
          "peopleReputation": 2
        },
        "result": "纸质申请继续受理；你将实际工时和遗漏问题写进试运行报告。"
      },
      {
        "text": "设立短期辅导台，保留紧急线下办理",
        "effects": {
          "flag": "renewWindowPilot",
          "eq": 1,
          "mentalPressure": 2,
          "reputation": 1
        },
        "result": "同事轮值协助申请人，临时方案必须在试运行结束前复核。"
      },
      {
        "text": "按线上办结率考核，暂不保留人工入口",
        "effects": {
          "flag": "renewWindowExcluded",
          "positionWeight": 2,
          "peopleReputation": -2,
          "risk": 2
        },
        "result": "报表上的数字变得好看，却没有记录那些未能提交申请的人。"
      }
    ],
    "weight": 5,
    "year": [
      24,
      48
    ]
  },
  {
    "id": "renew_window_2",
    "stage": "work",
    "eventType": "choice",
    "title": "系统里没有的名字",
    "text": "两年后，民生回访组带着一份没有成功提交申请的居民名单来到大厅。系统的办结率仍然很高，但名单上的人并未进入统计分母。你被要求参与复核。",
    "choices": [
      {
        "text": "逐一核查缺失申请，并补报真实覆盖率",
        "effects": {
          "setFlags": [
            "renewWindowReviewed",
            "renewWindowTruth"
          ],
          "integrity": 3,
          "mentalPressure": 3,
          "reputation": -1,
          "peopleReputation": 2
        },
        "result": "申请记录与回访名单开始对照；考核结果也需要重新解释。"
      },
      {
        "text": "从高频困难入手，分批修复并明确剩余问题",
        "effects": {
          "setFlags": [
            "renewWindowReviewed",
            "renewWindowPhased"
          ],
          "workAbility": 2,
          "mentalPressure": 1
        },
        "result": "你们给每批问题设了责任人和期限，未处理的部分仍在台账里。"
      },
      {
        "text": "维持原报表，只补充一份内部说明",
        "effects": {
          "setFlags": [
            "renewWindowReviewed",
            "renewWindowPaperOnly"
          ],
          "positionWeight": 1,
          "risk": 4,
          "integrity": -2
        },
        "result": "旧指标暂时不变；未申请成功的人仍缺少可跟踪的办理记录。"
      }
    ]
  },
  {
    "id": "renew_window_3",
    "stage": "work",
    "eventType": "choice",
    "title": "门口的那把椅子",
    "text": "五年后，服务大厅重新布置。墙上多了自助终端，也留出一排等候座椅。新负责人请你在移交前核对办理覆盖率和无障碍服务的记录。",
    "choices": [
      {
        "text": "核对真实案例，把可核查的规则交给后来者",
        "effects": {
          "flag": "renewWindowLegacy",
          "workAbility": 2,
          "integrity": 2,
          "peopleReputation": 2,
          "mentalPressure": 2
        },
        "result": "新负责人接过带有未结事项的清单，人工服务不再只凭临时通融。"
      },
      {
        "text": "移交材料，由新负责人独立评估",
        "effects": {
          "eq": 1,
          "mentalPressure": -2
        },
        "result": "历史记录随档案一并移交，后续评价不由你代替现任人员作出。"
      },
      {
        "text": "注明历史数据的局限，保留待核查名单",
        "effects": {
          "integrity": 3,
          "reputation": -1,
          "mentalPressure": 2
        },
        "result": "你没有用今日的成果替旧报表背书，仍需核查的申请留在清单上。"
      }
    ]
  },
  {
    "id": "renew_repair_1",
    "stage": "work",
    "eventType": "choice",
    "title": "竣工之后的维修电话",
    "text": "一项公共设施更新工程接近验收。安装单位提出把剩余预算用于最后一批设备，维护人员却指出，已经投入使用的设备没有配件目录和明确的维修责任。",
    "choices": [
      {
        "text": "先核对维护责任和备件清单，再安排验收",
        "effects": {
          "flag": "renewRepairMaintain",
          "workAbility": 2,
          "integrity": 1,
          "mentalPressure": 3
        },
        "result": "交付进度放慢，你要求把维修责任写进移交文件。"
      },
      {
        "text": "分批验收，留出尚未核验的设备清单",
        "effects": {
          "flag": "renewRepairPhased",
          "workAbility": 1,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "可用部分先交付，剩余问题仍有明确的验收条件。"
      },
      {
        "text": "先完成验收指标，维护问题以后再议",
        "effects": {
          "flag": "renewRepairFast",
          "positionWeight": 3,
          "risk": 3,
          "integrity": -1
        },
        "result": "验收日期保住了，缺失的维护资料没有因此补齐。"
      }
    ],
    "weight": 4,
    "year": [
      28,
      50
    ],
    "requireRankMin": 3
  },
  {
    "id": "renew_repair_2",
    "stage": "work",
    "eventType": "choice",
    "title": "保修期最后一天",
    "text": "两年后，几处设备陆续报修。合同期内能处理的事项与长期维护混在一张工单上，值班人员不知道应该联系谁。你被叫来协助梳理当初的交接。",
    "choices": [
      {
        "text": "核对合同与故障记录，明确后续责任",
        "effects": {
          "setFlags": [
            "renewRepairReviewed",
            "renewRepairAccountable"
          ],
          "integrity": 2,
          "workAbility": 2,
          "mentalPressure": 3
        },
        "result": "故障按实际责任分流，有争议的部分进入复核清单。"
      },
      {
        "text": "优先恢复基本使用，再安排阶段性复核",
        "effects": {
          "setFlags": [
            "renewRepairReviewed",
            "renewRepairService"
          ],
          "peopleReputation": 2,
          "mentalPressure": 2
        },
        "result": "最急的故障先处理，剩余问题仍保留明确的处理期限。"
      },
      {
        "text": "只汇报已恢复的设备，不记录遗留责任",
        "effects": {
          "setFlags": [
            "renewRepairReviewed",
            "renewRepairOmitted"
          ],
          "risk": 4,
          "positionWeight": 1,
          "integrity": -2
        },
        "result": "临时恢复的设备进入报表，反复出现的问题仍无法找到负责人。"
      }
    ]
  },
  {
    "id": "renew_repair_3",
    "stage": "work",
    "eventType": "choice",
    "title": "下一轮预算里的旧设备",
    "text": "五年后，新一轮预算评审翻出了当年的设备清单。有人建议全部更换，也有人认为维护到位的设备仍能使用。你需要说明历史运行记录，而不是替新采购决定背书。",
    "choices": [
      {
        "text": "按故障、使用和维修记录提出分类建议",
        "effects": {
          "flag": "renewRepairLegacy",
          "workAbility": 3,
          "integrity": 1,
          "mentalPressure": 2
        },
        "result": "预算人员收到有依据的更新建议；未核清的设备不被轻易认定为报废。"
      },
      {
        "text": "只提供历史材料，让专业评估独立决定",
        "effects": {
          "eq": 1,
          "mentalPressure": -2
        },
        "result": "现任团队接手资料，不再把个人经验当成唯一依据。"
      },
      {
        "text": "主动说明遗漏的责任和材料缺口",
        "effects": {
          "integrity": 3,
          "reputation": -1,
          "mentalPressure": 2
        },
        "result": "报告明确了过去未完成的事项，短期评价可能承压，但后续核查有了起点。"
      }
    ]
  },
  {
    "id": "renew_home_1",
    "stage": "life",
    "eventType": "choice",
    "title": "桌上的两份时间表",
    "text": "你把未来半年的工作安排贴在桌边。亲近的家人也带来一张时间表，上面写着复诊、搬家和需要共同处理的事务。两个安排恰好有几处冲突；对方没有要求你放弃工作，只问能不能提前商量。",
    "choices": [
      {
        "text": "提前商量分工，给重要约定留出时间",
        "effects": {
          "flag": "renewHomeShared",
          "familyPressure": -4,
          "mentalPressure": 1,
          "positionWeight": -1
        },
        "result": "你减少一项额外工作承诺，把必须亲自处理的事项列出来。"
      },
      {
        "text": "讨论替代安排，预留必要的服务支出",
        "effects": {
          "flag": "renewHomeSupport",
          "wealth": -6,
          "familyPressure": -2,
          "mentalPressure": -1
        },
        "result": "你把具体事务安排给可靠的帮助渠道，同时承担费用。"
      },
      {
        "text": "暂时保留工作安排，等忙完再商量",
        "effects": {
          "flag": "renewHomeDeferred",
          "positionWeight": 2,
          "familyPressure": 4,
          "mentalPressure": 1
        },
        "result": "工作日程没有改变，家人只好先独自安排尚未解决的事务。"
      }
    ],
    "weight": 5,
    "year": [
      27,
      49
    ]
  },
  {
    "id": "renew_home_2",
    "stage": "life",
    "eventType": "choice",
    "title": "日历上的第二个颜色",
    "text": "两年后，亲近的家人开始用另一种颜色标记自己的日程。你发现自己过去习惯把家庭事务视为可以不断调整的空白，而对方也有不能轻易挪动的安排。",
    "choices": [
      {
        "text": "重新约定各自可以承诺的时间",
        "effects": {
          "setFlags": [
            "renewHomeReviewed",
            "renewHomePromise"
          ],
          "familyPressure": -4,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "你们把无法保证的时间也写进计划，不再依靠临时道歉。"
      },
      {
        "text": "保持各自安排，遇到困难再主动协调",
        "effects": {
          "setFlags": [
            "renewHomeReviewed",
            "renewHomeSpace"
          ],
          "mentalPressure": -2,
          "familyPressure": -1
        },
        "result": "你们建立了较清晰的联络方式，也承认有些事情不必同时完成。"
      },
      {
        "text": "承认之前安排不周，讨论实际补救",
        "effects": {
          "setFlags": [
            "renewHomeReviewed",
            "renewHomeRepair"
          ],
          "familyPressure": -3,
          "integrity": 1,
          "mentalPressure": 2
        },
        "result": "你没有要求过去的失约被立刻原谅，而是明确下一次可以承担什么。"
      }
    ]
  },
  {
    "id": "renew_home_3",
    "stage": "life",
    "eventType": "choice",
    "title": "没有排满的周六",
    "text": "五年后，你翻到旧日历的照片。那时每一个空白似乎都能塞进工作，如今家人把周六留出来，问你想怎样安排这一天。没有突发任务，也没有必须完成的考核。",
    "choices": [
      {
        "text": "按过去约定一起完成一件小事",
        "effects": {
          "flag": "renewHomeLegacy",
          "familyPressure": -4,
          "mentalPressure": -3
        },
        "result": "你们选了一件早已想做的事，不再把陪伴当作一次补偿。"
      },
      {
        "text": "各自安排兴趣，晚上分享近况",
        "effects": {
          "eq": 1,
          "mentalPressure": -4
        },
        "result": "彼此都有可以自主支配的时间，晚餐也不必成为汇报会。"
      },
      {
        "text": "谈谈未来的照护和生活边界",
        "effects": {
          "familyPressure": -2,
          "eq": 2,
          "mentalPressure": 1
        },
        "result": "你们留下新的约定，也保留改变计划的空间。"
      }
    ]
  },
  {
    "id": "renew_plain",
    "stage": "work",
    "eventType": "choice",
    "title": "一份没有结论的走访记录",
    "text": "走访时，两位居民对同一项公共服务给出截然相反的评价。同行的人想选一个更适合汇报的故事，你手里的记录却不足以判断哪一种体验更普遍。",
    "choices": [
      {
        "text": "完整记录不同意见，并说明样本局限",
        "effects": {
          "integrity": 2,
          "workAbility": 2,
          "mentalPressure": 2
        },
        "result": "汇报没有漂亮的单一结论，却清楚标明了后续需要核查的问题。"
      },
      {
        "text": "扩大走访范围，延后正式结论",
        "effects": {
          "workAbility": 2,
          "peopleReputation": 1,
          "mentalPressure": 3
        },
        "result": "你增加了走访时间，暂时无法提交完整评价。"
      },
      {
        "text": "仅报告已确认的具体问题，不推断总体评价",
        "effects": {
          "integrity": 1,
          "eq": 1,
          "positionWeight": -1
        },
        "result": "材料更短，能确定的问题进入后续处理。"
      }
    ],
    "weight": 4,
    "year": [
      23,
      58
    ]
  },
  {
    "id": "renew_translation",
    "stage": "work",
    "eventType": "choice",
    "title": "听不懂的办事说明",
    "text": "窗口旁贴着新印的办事须知，一位申请人读了几遍仍然没弄明白下一步。你发现很多条款虽然准确，却把办理顺序写成了内部审批术语。",
    "choices": [
      {
        "text": "与同事核对后制作通俗版说明",
        "effects": {
          "workAbility": 2,
          "peopleReputation": 2,
          "mentalPressure": 2
        },
        "result": "新版说明保留正式依据，同时标出办理顺序和咨询方式。"
      },
      {
        "text": "整理常见疑问，在现场试用简明答复",
        "effects": {
          "eq": 2,
          "peopleReputation": 1,
          "mentalPressure": 1
        },
        "result": "同事收集试用反馈，等确认准确后再修改正式说明。"
      },
      {
        "text": "先完成个人负责的办理任务，提交改进建议",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        },
        "result": "眼下的申请得到处理，说明改进仍需负责部门安排。"
      }
    ],
    "weight": 4,
    "requireRankMax": 5,
    "year": [
      22,
      48
    ]
  },
  {
    "id": "renew_anonymous",
    "stage": "work",
    "eventType": "choice",
    "title": "被误解的工作记录",
    "text": "一份对外发布的工作简讯没有写清你参与的部分。同事建议你直接要求补上名字，但其中也有几位临时参与者的工作没有记录。",
    "choices": [
      {
        "text": "提交完整分工记录，请负责人统一核对",
        "effects": {
          "integrity": 2,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "修改后的记录覆盖实际贡献，个人署名不再是唯一诉求。"
      },
      {
        "text": "只在内部履历记录自己的实际工作",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        },
        "result": "你保留可核实的交付记录，没有要求改动公开简讯。"
      },
      {
        "text": "要求补充个人贡献，同时说明其他人的工作",
        "effects": {
          "positionWeight": 2,
          "reputation": 1,
          "mentalPressure": 3
        },
        "result": "负责人需要重新协调署名和表述，你为此承担额外沟通。"
      }
    ],
    "weight": 3,
    "year": [
      24,
      52
    ]
  },
  {
    "id": "renew_disability",
    "stage": "work",
    "eventType": "choice",
    "title": "坡道上的一段距离",
    "text": "居民反映新建坡道虽然符合图纸，雨天使用却不方便。验收材料齐全，施工人员认为属于正常使用问题，现场测量和实际体验需要进一步核对。",
    "choices": [
      {
        "text": "邀请使用者与专业人员现场核查",
        "effects": {
          "workAbility": 2,
          "peopleReputation": 3,
          "mentalPressure": 3
        },
        "result": "实际使用问题进入整改清单，你没有仅凭图纸作出结论。"
      },
      {
        "text": "先协调临时便利措施，再提交专业复核",
        "effects": {
          "peopleReputation": 2,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "居民暂时有了替代通行安排，工程问题仍等待评估。"
      },
      {
        "text": "向主管部门移交反馈和验收依据",
        "effects": {
          "integrity": 1,
          "workAbility": 1,
          "positionWeight": -1
        },
        "result": "你明确自己的权限和责任，后续由主管部门正式处理。"
      }
    ],
    "weight": 4,
    "year": [
      24,
      58
    ]
  },
  {
    "id": "renew_vacancy",
    "stage": "work",
    "eventType": "choice",
    "title": "没有立即补上的空岗",
    "text": "一位业务骨干调离后，原来由他独自完成的任务突然积压。你发现岗位说明写得很简单，而真正的工作流程散落在私人笔记里。",
    "choices": [
      {
        "text": "让团队共同梳理流程，暂时减少新增任务",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3,
          "positionWeight": -1
        },
        "result": "积压事项被分级处理，团队开始建立可共享的工作说明。"
      },
      {
        "text": "申请临时协助，同时安排经验移交",
        "effects": {
          "eq": 2,
          "workAbility": 1,
          "mentalPressure": 2
        },
        "result": "临时人员有了明确分工，但正式岗位安排仍需等待。"
      },
      {
        "text": "优先完成紧急事务，延后流程整理",
        "effects": {
          "positionWeight": 2,
          "mentalPressure": 4
        },
        "result": "短期任务保住了，团队仍依赖少数熟悉业务的人。"
      }
    ],
    "weight": 4,
    "requireRankMin": 4,
    "year": [
      28,
      58
    ]
  },
  {
    "id": "renew_letter",
    "stage": "life",
    "eventType": "choice",
    "title": "没有寄出的感谢信",
    "text": "整理旧物时，你翻出备考期间写了一半的感谢信。曾经帮助你的人早已换了生活环境，你犹豫是否应该重新联系，还是让这段记忆停留在旧信里。",
    "choices": [
      {
        "text": "写一封简短的近况信，不要求回应",
        "effects": {
          "eq": 2,
          "mentalPressure": -1
        },
        "result": "你把感谢写清楚，也尊重对方现在的生活。"
      },
      {
        "text": "把信留在自己的记录里",
        "effects": {
          "mentalPressure": -3
        },
        "result": "你收好旧信，承认有些帮助不需要用新的往来偿还。"
      },
      {
        "text": "在力所能及的范围帮助新的备考者",
        "effects": {
          "integrity": 1,
          "peopleReputation": 2,
          "mentalPressure": 1
        },
        "result": "你分享公开经验和学习方法，不承诺任何特殊机会。"
      }
    ],
    "weight": 3,
    "year": [
      30,
      58
    ]
  },
  {
    "id": "renew_budget",
    "stage": "life",
    "eventType": "choice",
    "title": "被推迟的个人计划",
    "text": "你攒了一笔钱，本来准备留给一项长期想做的个人计划。最近家庭开支有所增加，工作也变得不稳定。你打开预算表，发现这笔钱可以有几种不同安排。",
    "choices": [
      {
        "text": "缩小计划规模，保留必要的应急资金",
        "effects": {
          "wealth": -3,
          "mentalPressure": -2,
          "familyPressure": -1
        },
        "result": "你把计划拆成能够承担的部分，不需要一次完成。"
      },
      {
        "text": "延后消费，先重新核对半年支出",
        "effects": {
          "mentalPressure": 2,
          "familyPressure": -2,
          "iq": 1
        },
        "result": "你没有发生新交易，暂时放弃期待已久的安排。"
      },
      {
        "text": "在预算可承担范围内实现原计划",
        "effects": {
          "wealth": -8,
          "mentalPressure": -5,
          "familyPressure": 1
        },
        "result": "你按事先列好的额度支出，为自己保留了一段时间。"
      }
    ],
    "weight": 4,
    "requireWealth": 12,
    "year": [
      24,
      58
    ]
  }
];
