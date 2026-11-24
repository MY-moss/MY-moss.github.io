// v2.1.109 第四批内容换血
const gd_events_renew35_work = [
  {
    "id": "renew_quiet_queue",
    "title": "午休时的叫号声",
    "text": "大厅的午间服务试行了一周。排队的人明显少了，但窗口人员午休变短，下午出错的单据反而增加。两个统计表都是真的，主管让你提出下周安排。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "将午间服务改为预约轮班，核对实际工作量",
        "result": "一部分人仍可在午间办理，窗口不再要求所有人同时加班。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "保持开放时间，申请增加轮岗人员",
        "result": "便利得以保留，新增人力需求仍等待审批。",
        "effects": {
          "peopleReputation": 2,
          "mentalPressure": 3,
          "positionWeight": -1
        }
      },
      {
        "text": "恢复原时间，公开说明替代渠道",
        "result": "窗口恢复休息时间，不能在工作日请假的申请人仍有困难。",
        "effects": {
          "mentalPressure": -1,
          "peopleReputation": -1
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
    "id": "renew_reassigned",
    "title": "两份不同的岗位说明",
    "text": "新分工表将你熟悉的业务移给另一位同事，你接手的是一个长期无人整理的领域。对方以为你会因被替换而不高兴，来问能不能一起核对交接清单。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "完整移交旧业务，向对方请教新领域",
        "result": "你花时间整理了交接资料，新任务的学习成本也开始显现。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3,
          "eq": 1
        }
      },
      {
        "text": "提出一段过渡期，暂时共同处理难点",
        "result": "业务交接更平稳，但你同时承担两部分工作。",
        "effects": {
          "reputation": 1,
          "mentalPressure": 3
        }
      },
      {
        "text": "按新分工完成最低必要移交，集中学习新业务",
        "result": "你不再继续承担旧任务，接手者需要自己熟悉剩余事项。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      26,
      56
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_empty_seat",
    "title": "会议室里的空位",
    "text": "社区协商会上，按名单邀请的居民几乎都是白天能抽身的人。一个年轻租户留言说，会议时间让很多夜班工人根本来不了。主持人催你尽快形成意见纪要。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "补充异步征求意见，延后形成结论",
        "result": "书面意见增加了几个此前没有出现的需求，纪要晚些才能完成。",
        "effects": {
          "peopleReputation": 2,
          "mentalPressure": 3
        }
      },
      {
        "text": "保留本次纪要，注明参会范围和不足",
        "result": "已参与者的意见得到记录，但不能代表所有居民。",
        "effects": {
          "integrity": 2,
          "workAbility": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "先推进现有共识，安排后续补充讨论",
        "result": "部分事项可以先做，尚未参与的人仍需另有表达机会。",
        "effects": {
          "positionWeight": 1,
          "mentalPressure": 2
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
    "id": "renew_broken_scale",
    "title": "秤上的两个数字",
    "text": "一次现场检查发现两个计量设备读数不同，经营者担心当天停业，检查人员则担心继续使用造成争议。你参与的是协调记录，技术结论必须由有资质的人员确认。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "协调复测及临时替代设备",
        "result": "经营者减少了停业时间，正式结论仍待专业复核。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3,
          "peopleReputation": 1
        }
      },
      {
        "text": "建议暂时停用争议设备，保全原始记录",
        "result": "后续复核有据可查，经营者承担了暂时的不便。",
        "effects": {
          "integrity": 2,
          "peopleReputation": -1,
          "mentalPressure": 2
        }
      },
      {
        "text": "向负责部门移交差异记录及经营需求",
        "result": "你没有越权决定设备状态，相关人员接续处理。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      24,
      57
    ]
  },
  {
    "id": "renew_quiet_error",
    "title": "没有人发现的漏字",
    "text": "一份已经公开的服务说明漏掉了一个例外条件。咨询电话尚未出现异常，同事说改一下网页就行；你担心有人已经下载旧版，另发更正又会增加解释工作。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "发布简短更正，保留版本日期与咨询方式",
        "result": "读者能区分旧版和新版，工作人员也需要回答新增咨询。",
        "effects": {
          "integrity": 2,
          "mentalPressure": 2,
          "workAbility": 1
        }
      },
      {
        "text": "更新页面并在原位置显著注明修订",
        "result": "新版更易找到，但曾下载旧版的人未必再次访问。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "先核对可能受影响的办理记录再决定通知范围",
        "result": "改动暂缓，核查先从已经发生的办理事项开始。",
        "effects": {
          "integrity": 1,
          "mentalPressure": 2
        }
      }
    ],
    "weight": 4,
    "year": [
      23,
      58
    ]
  },
  {
    "id": "renew_dual_use",
    "title": "仓库里的折叠桌",
    "text": "一批闲置折叠桌可以移交给社区活动点，也可以留作单位的临时应急储备。仓库管理人员说，两种需求都不确定，而下月就要重新盘点。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "建议分批移交，并保留明确数量的储备",
        "result": "社区先得到部分桌椅，剩余数量在清单中有据可查。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "优先保留储备，重新确认社区的缺口",
        "result": "盘点比较简单，社区仍需寻找其他来源。",
        "effects": {
          "integrity": 1,
          "peopleReputation": -1,
          "mentalPressure": 1
        }
      },
      {
        "text": "提交需求比较，让资产管理部门按程序确定",
        "result": "双方需求一起进入审批材料，你不再私下承诺去向。",
        "effects": {
          "eq": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      26,
      58
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_small_success",
    "title": "没有写进简报的进步",
    "text": "一位同事把重复填写的表格从七张减到五张，省下的只是每天几分钟。简报需要醒目的成果，领导问能否把它写成一项重大突破。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "按实际节省时间记录，保留小改进的价值",
        "result": "简报没有夸大数字，同事能看到自己的工作被准确记录。",
        "effects": {
          "integrity": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "多观察一个月，再核算累计节省时间",
        "result": "结果有机会得到更充分的证据，眼下暂不能作为亮点上报。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 2,
          "positionWeight": -1
        }
      },
      {
        "text": "不报重大成果，只在内部流程中推广",
        "result": "其他同事可以使用新表格，外部宣传并未增加。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      23,
      57
    ]
  },
  {
    "id": "renew_river_names",
    "title": "地图上两个河名",
    "text": "整理地方资料时，你发现同一条小河在地图、村民口述和旧登记簿中有不同名称。新标牌只能印一个主名称，地方老人却担心旧称从此无人知道。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "建议核对标准名称，附注地方旧称",
        "result": "新标牌有统一主名称，旧称也进入可查询的说明。",
        "effects": {
          "workAbility": 2,
          "peopleReputation": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "先整理口述与旧地图，再由主管部门确认",
        "result": "旧称得到保存，标牌制作需要等待确认。",
        "effects": {
          "integrity": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "按现行标准制作，另将历史材料存档",
        "result": "标牌按时完成，口述材料没有被当成正式命名依据。",
        "effects": {
          "positionWeight": 1,
          "mentalPressure": 1
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
    "id": "renew_unanswered",
    "title": "外地寄来的咨询函",
    "text": "外地同行寄来一封很具体的业务咨询，询问你们试行办法的失败经验。公开介绍只写了成功案例，内部材料又含有不能直接外传的个人信息。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "整理可以公开的失败原因与限制",
        "result": "对方收到有边界的经验说明，你承担了额外整理工作。",
        "effects": {
          "workAbility": 2,
          "integrity": 1,
          "mentalPressure": 2
        }
      },
      {
        "text": "邀请双方业务人员在合规范围交流",
        "result": "交流需要协调时间，但可以避免直接复制原始档案。",
        "effects": {
          "eq": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "回复已有公开材料，说明其余内容不能提供",
        "result": "对方得到有限答复，你没有擅自外发内部资料。",
        "effects": {
          "integrity": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      28,
      58
    ],
    "requireRankMin": 2
  },
  {
    "id": "renew_storm_roof",
    "title": "积水后的第二天",
    "text": "暴雨过后，公共服务点恢复开放。临时借用的房间没有留下明显损失，但附近商户提出，恢复开放的同时还要考虑设备干燥、无障碍通行和后续检查。你需要整理恢复安排。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "请专业人员核查设施，再分区恢复服务",
        "result": "部分服务先恢复，尚待检查的区域不对外开放。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 3,
          "peopleReputation": 1
        }
      },
      {
        "text": "协调替代服务点，待完整检查后再开放",
        "result": "居民需要改变办理地点，原场地的检查时间得到保留。",
        "effects": {
          "integrity": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "汇总实际困难，交由负责部门决定恢复顺序",
        "result": "各类需求都有记录，具体恢复决定由有权人员作出。",
        "effects": {
          "eq": 1,
          "mentalPressure": -1
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      59
    ]
  },
  {
    "id": "renew_shared_desk",
    "title": "两张椅子之间的距离",
    "text": "单位试行共享办公位。有听力困难的同事发现新布局让自己更难听清同事发言，另一位需要安静整理材料的人却喜欢新安排。原方案强调的是空间利用率。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "建议根据实际需要提供可调整的工作位",
        "result": "办公室保留共享区域，也增加了需要固定安排的选项。",
        "effects": {
          "eq": 2,
          "mentalPressure": 2,
          "workAbility": 1
        }
      },
      {
        "text": "先做小范围调整，收集两类同事的反馈",
        "result": "试行变得更细致，其他部门暂时不能照搬。",
        "effects": {
          "workAbility": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "保留现有布局，提交明确的便利措施需求",
        "result": "整体方案未变，个别需求仍需具体安排。",
        "effects": {
          "integrity": 1,
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
    "id": "renew_night_shift",
    "title": "两张不同的值班表",
    "text": "临时任务需要周末轮班。老同事愿意多上一次，但年轻同事提醒，长期靠同一批人补位会使实际工作量难以看见。两份排班方案都能覆盖这个周末。",
    "stage": "work",
    "eventType": "choice",
    "choices": [
      {
        "text": "按实际负担调整轮班，明确下次补休",
        "result": "这次安排需要多一些沟通，后续补休也写进表里。",
        "effects": {
          "eq": 2,
          "mentalPressure": 2
        }
      },
      {
        "text": "接受自愿补位，同时记录实际承担次数",
        "result": "周末班次确定，持续依赖少数人的问题仍需再处理。",
        "effects": {
          "workAbility": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "提交人员缺口，由负责人协调临时支援",
        "result": "你不再默默把缺口转成个人额外工时。",
        "effects": {
          "positionWeight": -1,
          "mentalPressure": -1,
          "integrity": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      58
    ],
    "requireRankMin": 2
  }
];
