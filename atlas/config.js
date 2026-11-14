window.ATLAS_CONFIG = Object.freeze({
  feedUrl: "../inspiration/data/index.json",
  refreshIntervalMs: 300000,
  streams: [
    { id: "world", title: "每日世界新闻", en: "WORLD BRIEF", cadence: "每日 · 09:00", description: "全球重要事件、多源核验与影响判断", icon: "◉" },
    { id: "reading", title: "每日精选阅读", en: "CURATED READING", cadence: "每日 · 19:00", description: "跨领域高质量文章、随笔与深度报道", icon: "▤" },
    { id: "opensource", title: "每周开源项目雷达", en: "OPEN SOURCE RADAR", cadence: "每周六 · 13:00", description: "值得尝试、复用或持续观察的开源项目", icon: "⌘" },
    { id: "inspiration", title: "每日灵感采集", en: "INSPIRATION FIELDNOTES", cadence: "每日 · 11:30", description: "设计、交互、视觉实验与创意作品", icon: "✳" },
  ]
});