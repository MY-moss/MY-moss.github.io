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
  },
  {
    "id": "renew_credit_1",
    "stage": "work",
    "eventType": "choice",
    "title": "借来的名字",
    "text": "同事沈宁用半年的时间梳理了一套减少重复审批的办法。试点成功后，上级要求尽快上报经验。稿件的署名只有你，因为你是对外协调人。沈宁把修改后的稿子放在桌上，说：“署谁都行，我只是想知道下次还值不值得做。”",
    "choices": [
      {
        "text": "按实际贡献修改署名，并说明分工",
        "effects": {
          "flag": "renewCreditShared",
          "integrity": 2,
          "mentalPressure": 3,
          "positionWeight": -1
        },
        "result": "你交出修改过的稿子，也承担了向上级解释变更的工作。沈宁留下了完整的版本记录。"
      },
      {
        "text": "保留对外署名，在内部记录中确认贡献",
        "effects": {
          "flag": "renewCreditInternal",
          "workAbility": 1,
          "positionWeight": 1
        },
        "result": "材料按时上报，内部履历补充了沈宁的工作。沈宁没有反对，但问起内部记录能否被后来者查到。"
      },
      {
        "text": "按原稿上报，答应以后另行推荐沈宁",
        "effects": {
          "flag": "renewCreditTaken",
          "positionWeight": 3,
          "integrity": -2,
          "mentalPressure": 1
        },
        "result": "表彰材料如期上交。沈宁收起自己的修改记录，没有追问那个没有日期的承诺。"
      }
    ],
    "weight": 4,
    "year": [
      26,
      49
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_credit_2",
    "stage": "work",
    "eventType": "choice",
    "title": "没有接下的第二个项目",
    "text": "两年后，沈宁收到了另一个单位的岗位邀请。新项目正缺熟悉原试点的人，负责人希望你劝沈宁留下。沈宁说自己不是非走不可，但不愿再靠一句口头承诺决定今后的工作。",
    "choices": [
      {
        "text": "支持独立发展，协调交接而不阻拦离开",
        "effects": {
          "setFlags": [
            "renewCreditReviewed",
            "renewCreditRelease"
          ],
          "integrity": 2,
          "mentalPressure": 3,
          "positionWeight": -1
        },
        "result": "交接占用了额外时间。沈宁把未完成的工作逐项列出，并明确新项目不再由自己负责。"
      },
      {
        "text": "公开讨论职责、成果归属与发展机会",
        "effects": {
          "setFlags": [
            "renewCreditReviewed",
            "renewCreditTerms"
          ],
          "workAbility": 2,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "团队把新项目的职责和考核方式写清楚，沈宁可以据此自主决定。"
      },
      {
        "text": "只协调眼下的交付，不再承诺个人发展",
        "effects": {
          "setFlags": [
            "renewCreditReviewed",
            "renewCreditDistance"
          ],
          "positionWeight": 1,
          "mentalPressure": -1
        },
        "result": "项目暂时有人接手，但沈宁的去留不再由你协调。"
      }
    ]
  },
  {
    "id": "renew_credit_3",
    "stage": "work",
    "eventType": "choice",
    "title": "同一张圆桌的另一侧",
    "text": "五年后，一场跨单位业务交流会的发言人名单上出现了沈宁的名字。昔日试点的材料也被重新引用。会前，主办方问你们能否共同回顾那项工作。",
    "choices": [
      {
        "text": "共同核对历史版本，按事实说明各自贡献",
        "effects": {
          "flag": "renewCreditLegacy",
          "integrity": 2,
          "eq": 2,
          "mentalPressure": 2
        },
        "result": "你们把真实分工讲清楚，也允许彼此对旧事有不同记忆。"
      },
      {
        "text": "让沈宁独立讲述，自己提供公开记录",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -2
        },
        "result": "沈宁有了完整表达的空间，你没有再代替对方作出解释。"
      },
      {
        "text": "分别发言，说明过去无法确认的部分",
        "effects": {
          "integrity": 1,
          "eq": 1,
          "mentalPressure": 1
        },
        "result": "两份记录保留各自视角，没有用新的合作掩盖旧日分歧。"
      }
    ]
  },
  {
    "id": "renew_shop_1",
    "stage": "life",
    "eventType": "choice",
    "title": "收起来的招牌",
    "text": "街口那家开了多年的小店要搬走了。店主许姨认得你，却没有求你改变规划，只拿出一份补助申请：店里的经营者登记是她已故的丈夫，现有材料能否受理还需核查。邻居以为你在单位就能替她决定。",
    "choices": [
      {
        "text": "陪她理清申请渠道，不替审核人员作保证",
        "effects": {
          "flag": "renewShopGuide",
          "peopleReputation": 2,
          "eq": 1,
          "mentalPressure": 2
        },
        "result": "许姨得到补件清单和咨询方式。你向她说明办理结果仍须由负责部门核定。"
      },
      {
        "text": "通过正式窗口转介，不介入个人案件",
        "effects": {
          "flag": "renewShopRefer",
          "integrity": 2,
          "mentalPressure": -1
        },
        "result": "她拿到受理渠道，你把个人熟识关系与审核工作分开。"
      },
      {
        "text": "答应替她问进度，但没有明确办理边界",
        "effects": {
          "flag": "renewShopPromise",
          "eq": 1,
          "mentalPressure": 2,
          "risk": 2
        },
        "result": "许姨以为已有确定答复，邻居也开始向她打听消息。"
      }
    ],
    "weight": 4,
    "year": [
      27,
      49
    ]
  },
  {
    "id": "renew_shop_2",
    "stage": "life",
    "eventType": "choice",
    "title": "重新开门的那天",
    "text": "两年后，你在另一条街看见熟悉的店招。许姨已经重新安顿下来，却提起搬迁时留下的一份异议材料。她问：“那件事后来究竟怎么算的？我不是来讨人情，只想知道有没有说法。”",
    "choices": [
      {
        "text": "帮助查找正式办理记录和异议渠道",
        "effects": {
          "setFlags": [
            "renewShopReviewed",
            "renewShopRecord"
          ],
          "peopleReputation": 2,
          "mentalPressure": 2,
          "integrity": 1
        },
        "result": "她拿到可以核对的办理信息；尚有争议的部分没有被你的口头说明代替。"
      },
      {
        "text": "坦诚说明自己的权限，请她自行决定是否复核",
        "effects": {
          "setFlags": [
            "renewShopReviewed",
            "renewShopBoundary"
          ],
          "eq": 2,
          "mentalPressure": -1
        },
        "result": "你们没有把店里聊天变成一次新的请托。她保留自己的判断。"
      },
      {
        "text": "承认自己没掌握完整结果，不再给出保证",
        "effects": {
          "setFlags": [
            "renewShopReviewed",
            "renewShopApology"
          ],
          "integrity": 2,
          "mentalPressure": 2
        },
        "result": "原来没有兑现的解释终于得到澄清，但她是否继续核查仍由她决定。"
      }
    ]
  },
  {
    "id": "renew_shop_3",
    "stage": "life",
    "eventType": "choice",
    "title": "橱窗里的一张旧照片",
    "text": "五年后，许姨把最初店铺的照片挂在橱窗里。她准备逐渐减少营业时间，把日常经营交给家里的年轻人。她谈起搬迁那段日子，想知道你是否还记得当时说过的话。",
    "choices": [
      {
        "text": "听她讲完，承认自己只能做的那一部分",
        "effects": {
          "flag": "renewShopLegacy",
          "eq": 2,
          "mentalPressure": -2
        },
        "result": "她讲完了自己的经历。你们没有把一次重逢变成对过去功劳的争论。"
      },
      {
        "text": "将可公开的办理经历作为改进意见反馈",
        "effects": {
          "peopleReputation": 2,
          "workAbility": 1,
          "mentalPressure": 2
        },
        "result": "你征得同意后只整理制度问题，不公开个人材料。"
      },
      {
        "text": "尊重她的生活安排，不再追问旧事",
        "effects": {
          "mentalPressure": -3,
          "eq": 1
        },
        "result": "你们谈起新店和近况，过去的分歧不必在这一刻得出统一答案。"
      }
    ]
  },
  {
    "id": "renew_reform_factory",
    "stage": "work",
    "eventType": "choice",
    "title": "厂门口的最后一班车",
    "text": "改革推进期间，老厂调整生产线，通勤车即将停运。一些工人已经找到新岗位，另一些还在等待培训安排。讨论会上，有人认为车辆停运只是企业内部事务，社区却不断收到求助。",
    "choices": [
      {
        "text": "核实受影响人群，协调过渡服务",
        "effects": {
          "peopleReputation": 3,
          "mentalPressure": 3,
          "workAbility": 1
        },
        "result": "过渡需求进入正式协调事项，方案仍需企业与相关部门共同确认。"
      },
      {
        "text": "整理就业服务与通勤信息，交给负责部门",
        "effects": {
          "workAbility": 2,
          "integrity": 1,
          "mentalPressure": 1
        },
        "result": "求职者获得可使用的信息，具体交通安排没有被你擅自承诺。"
      },
      {
        "text": "优先推进既定调整，记录后续困难",
        "effects": {
          "positionWeight": 2,
          "peopleReputation": -2,
          "mentalPressure": 2
        },
        "result": "进度没有改变，新增通勤困难进入反馈记录。"
      }
    ],
    "era": [
      "reform"
    ],
    "weight": 5,
    "year": [
      25,
      55
    ]
  },
  {
    "id": "renew_reform_market",
    "stage": "work",
    "eventType": "choice",
    "title": "摊位重新编号",
    "text": "市场整顿后准备重新分配摊位。经营多年的老摊主想延续原位置，新来的经营者则担心老关系占尽机会。你负责整理方案意见，却不能直接决定谁应获得哪个摊位。",
    "choices": [
      {
        "text": "公示分配规则与异议渠道，留出核查期",
        "effects": {
          "integrity": 2,
          "peopleReputation": 2,
          "mentalPressure": 3
        },
        "result": "新旧经营者都能看到依据，争议项进入正式核查。"
      },
      {
        "text": "提出分阶段调整，保留可核实的经营记录",
        "effects": {
          "eq": 2,
          "workAbility": 1,
          "mentalPressure": 2
        },
        "result": "过渡期减少部分冲突，最终方案仍需依法确认。"
      },
      {
        "text": "按既定时间推进，不临时增加个人承诺",
        "effects": {
          "positionWeight": 2,
          "mentalPressure": 1,
          "peopleReputation": -1
        },
        "result": "调整如期进行，部分争议仍须通过异议渠道处理。"
      }
    ],
    "era": [
      "reform"
    ],
    "weight": 4,
    "year": [
      24,
      55
    ]
  },
  {
    "id": "renew_stable_care",
    "stage": "work",
    "eventType": "choice",
    "title": "等候名单上的两个地址",
    "text": "社区服务人员反映，同一位老人可能在两个地址登记照护需求。直接删除重复记录容易遗漏实际需要，保留全部记录又会使资源估算偏高。",
    "choices": [
      {
        "text": "核实实际居住和服务需求后更新台账",
        "effects": {
          "workAbility": 2,
          "integrity": 2,
          "mentalPressure": 2
        },
        "result": "你们核清重复项，无法联系的记录仍标明待确认。"
      },
      {
        "text": "暂保留待核实记录，单列资源估算区间",
        "effects": {
          "workAbility": 1,
          "peopleReputation": 2,
          "mentalPressure": 2
        },
        "result": "统计口径变得复杂，却不再把不确定需求当成零。"
      },
      {
        "text": "仅提交已核实部分，并明确其余未覆盖",
        "effects": {
          "integrity": 1,
          "positionWeight": -1,
          "mentalPressure": 1
        },
        "result": "报告标注统计范围，后续核查责任仍然存在。"
      }
    ],
    "era": [
      "stable"
    ],
    "weight": 4,
    "year": [
      26,
      58
    ]
  },
  {
    "id": "renew_stable_archive",
    "stage": "life",
    "eventType": "choice",
    "title": "旧照片背面的日期",
    "text": "社区征集城市变迁资料，有居民带来一叠照片，却记不清拍摄时间。整理者希望选几张最有感染力的照片作为展览主题，你发现其中几张可能属于不同年份。",
    "choices": [
      {
        "text": "联系提供者核实时间，保留不确定标注",
        "effects": {
          "integrity": 2,
          "workAbility": 1,
          "mentalPressure": 2
        },
        "result": "展览资料区分已证实日期与口述记忆。"
      },
      {
        "text": "用主题而非年份组织展览",
        "effects": {
          "eq": 2,
          "mentalPressure": -1
        },
        "result": "照片呈现生活变化，尚未确认的日期没有被虚构出来。"
      },
      {
        "text": "只使用能够核实出处的照片",
        "effects": {
          "integrity": 1,
          "workAbility": 1,
          "peopleReputation": -1
        },
        "result": "展览规模缩小，其他照片暂时归入待整理资料。"
      }
    ],
    "era": [
      "stable"
    ],
    "weight": 4,
    "year": [
      25,
      58
    ]
  },
  {
    "id": "renew_rectify_file",
    "stage": "work",
    "eventType": "choice",
    "title": "档案里的一页更正",
    "text": "专项复核时，旧项目中一名工作人员的签字被误读为最终审批意见。原件上还有不同的经办人和复核栏，你认识那位工作人员，但必须依据材料处理而不是凭私人印象。",
    "choices": [
      {
        "text": "提交原件与职责依据，要求纠正错误认定",
        "effects": {
          "integrity": 3,
          "mentalPressure": 3,
          "workAbility": 1
        },
        "result": "复核记录补充实际职责，个人关系不作为判断依据。"
      },
      {
        "text": "申请回避个人评价，移交完整原始材料",
        "effects": {
          "integrity": 2,
          "risk": -1,
          "mentalPressure": 1
        },
        "result": "你提供必要证据，由不相关的人员独立核查。"
      },
      {
        "text": "仅提交当前掌握的材料，说明证据缺口",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        },
        "result": "未核实部分继续保留，不能直接替任何人作结论。"
      }
    ],
    "era": [
      "rectify"
    ],
    "weight": 5,
    "year": [
      28,
      58
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_rectify_room",
    "stage": "life",
    "eventType": "choice",
    "title": "不再参加的饭桌",
    "text": "曾经固定聚餐的一群朋友在整顿期间渐渐散了。有人想恢复聚会，有人担心被误会。一个老友说，只要不谈工作、不让服务对象承担费用，普通朋友的来往就不该变成负担。",
    "choices": [
      {
        "text": "约普通私人聚会，各自承担费用，不谈公务",
        "effects": {
          "wealth": -1,
          "eq": 2,
          "mentalPressure": -2
        },
        "result": "聚会重新变成日常来往，不附带业务请求。"
      },
      {
        "text": "改为散步或喝茶，减少不必要的消费",
        "effects": {
          "eq": 1,
          "mentalPressure": -3
        },
        "result": "你们仍能见面，也不必通过排场证明关系。"
      },
      {
        "text": "暂时保持联系，不勉强恢复原来的聚会",
        "effects": {
          "mentalPressure": -1,
          "familyPressure": -1
        },
        "result": "你说明自己的安排，尊重朋友各自的选择。"
      }
    ],
    "era": [
      "rectify"
    ],
    "weight": 4,
    "year": [
      26,
      58
    ]
  }
];
