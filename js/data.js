// ==================== 游戏数据（组装文件） ====================
const GameData = {
  backgrounds: gd_core.backgrounds,
  majors: gd_core.majors,
  talents: gd_core.talents,
  units: gd_core.units,
  eras: gd_core.eras, // v2.19 时代剧本：reform/stable/rectify
  writtenQuestions: gd_exam.writtenQuestions.concat(typeof gd_exam_custom !== 'undefined' && gd_exam_custom.writtenQuestions ? gd_exam_custom.writtenQuestions : []), // v2.1.50 L5.2 自定义题目包（题目编辑器导出）
  interviewQuestions: gd_exam.interviewQuestions.concat(typeof gd_exam_custom !== 'undefined' && gd_exam_custom.interviewQuestions ? gd_exam_custom.interviewQuestions : []),
  interviewPoolNames: gd_exam.interviewPoolNames,
  network: typeof gd_network !== 'undefined' ? gd_network : { contactCapacity: 10, edgeLimit: 24, logLimit: 120 },
  policyProjects: typeof gd_projects !== 'undefined' ? gd_projects : [],
  events: [].concat(gd_events_basic_1, gd_events_basic_2, gd_events_basic_3, gd_events_basic_4, gd_events_basic_5, gd_events_ext, gd_events_spec, gd_events_new_work, gd_events_new_life, gd_events_new_career, gd_events_new_theme, typeof gd_events_new_daily !== 'undefined' ? gd_events_new_daily : [], typeof gd_events_network !== 'undefined' ? gd_events_network : [], typeof gd_events_new_v2144 !== 'undefined' ? gd_events_new_v2144 : [], typeof gd_events_new_v2145 !== 'undefined' ? gd_events_new_v2145 : [], typeof gd_events_new_v2155 !== 'undefined' ? gd_events_new_v2155 : [], typeof gd_events_new_v2161 !== 'undefined' ? gd_events_new_v2161 : [], typeof gd_events_new_v2166 !== 'undefined' ? gd_events_new_v2166 : [], typeof gd_events_new_v2170 !== 'undefined' ? gd_events_new_v2170 : [], typeof gd_events_new_v2172 !== 'undefined' ? gd_events_new_v2172 : [], typeof gd_events_new_v2173 !== 'undefined' ? gd_events_new_v2173 : [], typeof gd_events_new_v2174 !== 'undefined' ? gd_events_new_v2174 : [], typeof gd_events_new_v2175 !== 'undefined' ? gd_events_new_v2175 : [], typeof gd_events_new_v2178 !== 'undefined' ? gd_events_new_v2178 : [])
};
