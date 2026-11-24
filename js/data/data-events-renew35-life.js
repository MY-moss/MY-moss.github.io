// v2.1.109 第四批内容换血
const gd_events_renew35_life = [
  {
    "id": "renew_repair_receipt",
    "title": "修理铺的报价单",
    "text": "家里一件用了多年的电器出了问题。修理师傅给出两种方案：换一个零件还能用一段时间，全面维修则接近新机的价格。你发现自己真正舍不得的不是电器本身，而是熟悉的生活习惯。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "先小修，预留日后更换的预算",
        "result": "你支付本次维修费，接受旧设备仍可能需要更换。",
        "effects": {
          "wealth": -2,
          "mentalPressure": -1
        }
      },
      {
        "text": "按需要更换一台基础款，不追求新功能",
        "result": "新设备进入生活，你把这次支出记入预算。",
        "effects": {
          "wealth": -5,
          "mentalPressure": -2
        }
      },
      {
        "text": "暂缓购买，使用现有替代办法",
        "result": "你保留了预算，日常操作稍有不便。",
        "effects": {
          "mentalPressure": 1,
          "familyPressure": -1
        }
      }
    ],
    "weight": 4,
    "requireWealth": 8,
    "year": [
      25,
      59
    ]
  },
  {
    "id": "renew_small_savings",
    "title": "信封里的应急钱",
    "text": "整理账目时，你发现过去几个月零散攒下的钱够做一项小计划，但下半年家庭支出还不完全确定。你把钱分成几个用途，想知道哪一部分值得现在花。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "保留应急资金，缩小个人计划",
        "result": "计划依然可以开始，实际支出不超过小部分预算。",
        "effects": {
          "wealth": -2,
          "mentalPressure": -2,
          "familyPressure": -1
        }
      },
      {
        "text": "将全部暂留作应急，不新增支出",
        "result": "短期预算更加宽裕，你决定等待支出情况明朗。",
        "effects": {
          "mentalPressure": 1,
          "familyPressure": -2
        }
      },
      {
        "text": "完成计划中最期待的一项，剩余部分延后",
        "result": "你享受到已经等待很久的体验，同时保留其余资金。",
        "effects": {
          "wealth": -4,
          "mentalPressure": -3
        }
      }
    ],
    "weight": 4,
    "requireWealth": 6,
    "year": [
      24,
      58
    ]
  },
  {
    "id": "renew_shared_bill",
    "title": "一笔算不清的共同开支",
    "text": "几位亲属共同承担一项家庭事务，有人付了钱，有人投入了很多时间，最后却只剩一张转账清单。你发现如果按金额均摊，承担照顾的人反而可能付得更多。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "共同核对实际支出和时间负担，再商量分担",
        "result": "大家先把事实说清，最后的分担仍需自愿协商。",
        "effects": {
          "familyPressure": -3,
          "mentalPressure": 2,
          "eq": 1
        }
      },
      {
        "text": "只承担自己事先明确同意的份额",
        "result": "你没有承诺额外支付，其他人需要再确定余下分担方式。",
        "effects": {
          "mentalPressure": -1,
          "familyPressure": 1
        }
      },
      {
        "text": "主动承担一项具体事务，减少其他人的负担",
        "result": "你没有增加现金支出，而是留出一段可兑现的时间。",
        "effects": {
          "familyPressure": -2,
          "mentalPressure": 2
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
    "id": "renew_lost_language",
    "title": "读不懂的家书",
    "text": "一封保存多年的家书里有几句方言，你已经记不清意思。亲属群里有人给出解释，却互不相同。你本来想把信完整录入电子文档，如今决定怎样处理那些不确定的地方。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "请愿意讲述的亲属解释，注明不同说法",
        "result": "旧信的词语得到补充，家人的不同记忆也被保留。",
        "effects": {
          "eq": 2,
          "mentalPressure": 1
        }
      },
      {
        "text": "只录入能够辨认的内容，保留原件照片",
        "result": "你没有猜测那些词的意思，未来仍有机会继续整理。",
        "effects": {
          "mentalPressure": -1,
          "iq": 1
        }
      },
      {
        "text": "将家书原样归档，不再要求自己整理完整",
        "result": "你保留了原件，不必把所有旧事转化为新的任务。",
        "effects": {
          "mentalPressure": -3
        }
      }
    ],
    "weight": 4,
    "year": [
      28,
      59
    ]
  },
  {
    "id": "renew_quiet_boundary",
    "title": "一把没有交出去的备用钥匙",
    "text": "一位关系很好的朋友提出互留备用钥匙，以后临时有事可以帮忙。你知道这份信任是真实的，却不太习惯他人可以随时进入自己的生活空间。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "感谢对方，约定真正需要时再联系",
        "result": "你们没有交换钥匙，但约定了遇到急事如何联系。",
        "effects": {
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "先讨论保管和使用边界，再决定是否交换",
        "result": "两人把各自不舒服的情况说清楚，没有立即作出承诺。",
        "effects": {
          "eq": 1,
          "mentalPressure": 1
        }
      },
      {
        "text": "拒绝交换钥匙，保留其他互助方式",
        "result": "你说清自己的习惯，朋友仍然可以通过事先约定提供帮助。",
        "effects": {
          "mentalPressure": -2
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      57
    ]
  },
  {
    "id": "renew_last_train_ticket",
    "title": "一张改签过的车票",
    "text": "你已经买好假期的车票，临时收到一个亲近的人发来的消息：他只在本地停留一天，希望见面。两件事无法都按原计划完成，但对方并没有要求你一定改变行程。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "按原计划旅行，约以后合适的时间见面",
        "result": "你没有取消自己的行程，也没有给出无法保证的重逢日期。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "改签车票，留出时间见面",
        "result": "你为见面承担改签费用，原来的行程缩短了一些。",
        "effects": {
          "wealth": -2,
          "mentalPressure": 1,
          "eq": 2
        }
      },
      {
        "text": "商量简短见面，不完全改变行程",
        "result": "你们在出发前见了一面，谈话很短，却不必等到下一次。",
        "effects": {
          "mentalPressure": -1,
          "eq": 1
        }
      }
    ],
    "weight": 4,
    "requireWealth": 4,
    "year": [
      25,
      57
    ]
  },
  {
    "id": "renew_quiet_class",
    "title": "第一堂课的最后一排",
    "text": "你报名参加一门与工作毫无关系的晚间课程。第一节课上，你发现自己做得比大部分人慢，老师却没有要求所有人用相同速度完成。下周还有一个工作上的非必要聚会。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "继续上课，允许自己只是初学者",
        "result": "你留出下一次课程的时间，接受作品暂时做得不够好。",
        "effects": {
          "mentalPressure": -3,
          "positionWeight": -1
        }
      },
      {
        "text": "调整参加频率，不要求每次都完成",
        "result": "你保留课程的兴趣，也给其他安排留出余地。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "暂时退出课程，把兴趣留到有空的时候",
        "result": "你与老师说清安排，眼下不再承担固定的课业。",
        "effects": {
          "mentalPressure": -1,
          "workAbility": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      53
    ]
  },
  {
    "id": "renew_shared_stove",
    "title": "厨房里的另一种味道",
    "text": "家中有人开始尝试完全不同的饮食习惯。原来的做饭方式已经持续多年，改变意味着多买一些食材、多做几样菜。对方并不是要求所有人跟着改变，只是不想每顿都需要解释自己。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "商量几道双方都能接受的菜",
        "result": "日常做饭有了共同的部分，个人选择也得到保留。",
        "effects": {
          "familyPressure": -3,
          "mentalPressure": 1
        }
      },
      {
        "text": "各自负责一部分食材和烹饪",
        "result": "分工更加明确，但需要重新安排厨房使用时间。",
        "effects": {
          "familyPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "保留原有做饭方式，让对方自行准备不同部分",
        "result": "你没有强求一致，额外安排主要由对方承担。",
        "effects": {
          "mentalPressure": -1,
          "familyPressure": 1
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
    "id": "renew_old_friend_work",
    "title": "不是来找你办事的",
    "text": "久未联系的朋友发来一条消息，说最近换了工作，想约你散步。你习惯性地问他是不是有什么事情要办。对方回复：“没有，我只是刚好经过这里。”你突然发现自己已经很少不带任务地与人见面。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "赴约，只聊近况，不把谈话变成工作",
        "result": "你们走了一段路，谈了彼此最近喜欢的事。",
        "effects": {
          "eq": 2,
          "mentalPressure": -2
        }
      },
      {
        "text": "坦白最近时间有限，约一段短一点的见面",
        "result": "你把真实的时间限制说清楚，两人见了一面就各自回去。",
        "effects": {
          "eq": 1,
          "mentalPressure": -1
        }
      },
      {
        "text": "暂不赴约，认真回复对方的问候",
        "result": "你没有假装有空，也没有把没有见面理解为关系结束。",
        "effects": {
          "mentalPressure": -1,
          "familyPressure": -1
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
    "id": "renew_quiet_week",
    "title": "无人催促的一周",
    "text": "日程表突然空出几天。过去你总会迅速找新的事情填进去，这次却发现有些很久没处理的个人事务，有些事只是想在家安静做完。身边的人对你没有提出新的要求。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "给自己留出一天不安排任何任务",
        "result": "你没有新增工作成果，却终于享受了一段不被催促的时间。",
        "effects": {
          "mentalPressure": -4
        }
      },
      {
        "text": "处理积压的私人事务，结束后休息",
        "result": "几个小问题得到解决，余下时间没有被新的任务填满。",
        "effects": {
          "mentalPressure": -2,
          "familyPressure": -2
        }
      },
      {
        "text": "做一件很久想完成的小事，不设完成期限",
        "result": "你把空闲留给真正感兴趣的事情，而非另一项考核。",
        "effects": {
          "mentalPressure": -3,
          "iq": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      25,
      60
    ]
  },
  {
    "id": "renew_two_generations",
    "title": "教你使用旧相机的人",
    "text": "一位年轻亲属带来一台旧相机，请你教他使用。你原以为自己是熟悉旧设备的人，却发现他已经研究过说明书，还知道一种你没用过的整理办法。你们都没有完全掌握对方擅长的部分。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "轮流教对方自己熟悉的部分",
        "result": "你们拍下几张照片，各自学到了一种新办法。",
        "effects": {
          "eq": 2,
          "mentalPressure": -2
        }
      },
      {
        "text": "请他先演示新方法，再尝试旧设备",
        "result": "你没有把经验当成必须维护的权威，学习过程很轻松。",
        "effects": {
          "iq": 1,
          "mentalPressure": -2
        }
      },
      {
        "text": "只一起拍照，不要求把技术全部学会",
        "result": "相机记录下这一天，剩下的功能可以以后再研究。",
        "effects": {
          "mentalPressure": -3
        }
      }
    ],
    "weight": 4,
    "year": [
      30,
      60
    ]
  },
  {
    "id": "renew_quiet_gift",
    "title": "没有价格标签的礼物",
    "text": "朋友送来自己做的一件小物件，没有特殊节日，也不涉及工作。你想回赠，却担心用价格衡量这份心意反而改变关系。对方说只是多做了一个。",
    "stage": "life",
    "eventType": "choice",
    "choices": [
      {
        "text": "认真道谢，日后有机会分享自己的手作",
        "result": "你收下这份私人心意，没有把它变成必须结清的账。",
        "effects": {
          "eq": 2,
          "mentalPressure": -1
        }
      },
      {
        "text": "一起使用这件小物件，留下共同体验",
        "result": "你们约定一个普通的相处时间，礼物没有变成消费比赛。",
        "effects": {
          "mentalPressure": -2,
          "eq": 1
        }
      },
      {
        "text": "如果不便收下，坦诚说明个人习惯",
        "result": "对方理解你的边界，你们仍保留原来的交往。",
        "effects": {
          "mentalPressure": -1,
          "integrity": 1
        }
      }
    ],
    "weight": 4,
    "year": [
      23,
      59
    ]
  }
];
