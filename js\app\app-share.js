// 静态版分享海报：只在浏览器本地读取当前局数据并生成 PNG，不上传存档。
(function () {
  'use strict';

  const FONT = '"Microsoft YaHei", "PingFang SC", sans-serif';
  const SERIF = '"STSong", "Songti SC", "SimSun", serif';
  const COLORS = {
    ink: '#241f1b',
    muted: '#756a61',
    red: '#8B1D1D',
    redDark: '#5C1010',
    gold: '#C4A44A',
    goldLight: '#F1E9D6',
    paper: '#FAF6EE',
    paperDeep: '#F4EBDD',
    border: '#D9C9A8',
    white: '#FFFFFF'
  };
  const TIER = { platinum: '铂金', gold: '金牌', silver: '银牌', bronze: '铜牌' };

  function esc(value) {
    return typeof App !== 'undefined' && App.escapeHtml ? App.escapeHtml(String(value == null ? '' : value)) : String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function staticConfig() {
    return (typeof window !== 'undefined' && window.SHANGAN_STATIC_CONFIG) || {};
  }

  function gameUrl() {
    const configured = String(staticConfig().gameUrl || '').trim();
    if (/^https?:\/\//i.test(configured)) return configured.replace(/#.*$/, '');
    try {
      const url = new URL(window.location.href);
      url.hash = '';
      url.search = '';
      return url.href;
    } catch (e) {
      return '';
    }
  }

  function safeProgress() {
    const progress = typeof App.getCodexProgress === 'function' ? App.getCodexProgress() : {};
    return {
      events: Number(progress.events) || 0,
      totalEvents: Number(progress.total) || Number(progress.totalEvents) || 0,
      endings: Number(progress.endings) || 0,
      totalEndings: Number(progress.totalEndings) || 0
    };
  }

  function snapshot(p, h) {
    p = p || {};
    const score = Math.round(typeof App.calculateFinalScore === 'function' ? App.calculateFinalScore(p, h || {}) : Number(p.score) || 0);
    const ending = (App.ENDING_NAMES && App.ENDING_NAMES[p.ending]) || p.ending || '仕途进行中';
    const achievements = Array.from(new Map((App.achievements || []).filter(Boolean).map(item => [item.id || item.title, {
      id: String(item.id || ''),
      title: String(item.title || '未命名成就'),
      tier: TIER[item.tier] ? item.tier : 'bronze'
    }])).values());
    const log = Array.isArray(p.careerLog) ? p.careerLog.filter(item => item && item.event).slice(-36).map(item => ({
      year: Number(item.year) || 0,
      event: String(item.event).slice(0, 90),
      rank: item.leadershipRank == null ? '' : String(item.leadershipRank)
    })) : [];
    return {
      name: String(p.name || '匿名干部').slice(0, 20),
      ending,
      score,
      grade: typeof App.getGrade === 'function' ? App.getGrade(score).label : '',
      rank: typeof engine !== 'undefined' && engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : ((p.leadershipRank || 0) + '级'),
      promotions: Number(p.promotions) || 0,
      yearsWorked: Number(p.yearsWorked) || 0,
      age: Number(p.age) || 0,
      achievements,
      life: log,
      progress: safeProgress(),
      gameUrl: gameUrl()
    };
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function wrapText(ctx, text, maxWidth) {
    const chars = Array.from(String(text || ''));
    const lines = [];
    let line = '';
    chars.forEach(char => {
      const next = line + char;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = char;
      } else line = next;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function text(ctx, value, x, y, maxWidth, lineHeight, options) {
    options = options || {};
    ctx.font = options.font || ('24px ' + FONT);
    ctx.fillStyle = options.color || COLORS.ink;
    ctx.textAlign = options.align || 'left';
    ctx.textBaseline = 'top';
    const lines = wrapText(ctx, value, maxWidth || 900);
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * (lineHeight || 34)));
    return y + lines.length * (lineHeight || 34);
  }

  function drawQr(ctx, value, x, y, size) {
    if (typeof qrcode !== 'function' || !value) {
      roundRect(ctx, x, y, size, size, 12, COLORS.white, COLORS.border);
      text(ctx, '二维码暂不可用', x + size / 2, y + size / 2 - 15, size - 24, 30, { align: 'center', font: '20px ' + FONT, color: COLORS.muted });
      return;
    }
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    const margin = 18;
    const cell = Math.floor((size - margin * 2) / count);
    const actual = cell * count;
    const start = x + Math.floor((size - actual) / 2);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#111111';
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) ctx.fillRect(start + col * cell, y + Math.floor((size - actual) / 2) + row * cell, cell, cell);
      }
    }
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function drawHeader(ctx, data, width) {
    ctx.fillStyle = COLORS.redDark;
    ctx.fillRect(0, 0, width, 230);
    ctx.fillStyle = COLORS.goldLight;
    ctx.font = '24px ' + FONT;
    ctx.textAlign = 'center';
    ctx.fillText('上 岸 模 拟 器 · 人 生 卷 宗', width / 2, 45);
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 62px ' + SERIF;
    ctx.fillText(data.ending, width / 2, 92);
    ctx.fillStyle = '#E8D48B';
    ctx.font = '22px ' + FONT;
    ctx.fillText(data.name + ' 的仕途结算', width / 2, 180);
  }

  function drawMetric(ctx, label, value, x, y, w) {
    roundRect(ctx, x, y, w, 105, 14, COLORS.paperDeep, COLORS.border);
    text(ctx, label, x + 22, y + 18, w - 44, 25, { font: '20px ' + FONT, color: COLORS.muted });
    text(ctx, value, x + 22, y + 52, w - 44, 36, { font: 'bold 30px ' + SERIF, color: COLORS.red, align: 'left' });
  }

  function drawAchievements(ctx, data, x, y, width, compact) {
    text(ctx, '🏆 成就勋章', x, y, width, 38, { font: 'bold 30px ' + FONT, color: COLORS.red });
    y += 56;
    const items = compact ? data.achievements.slice(-8) : data.achievements;
    if (!items.length) return text(ctx, '暂无解锁成就，下一段人生继续努力。', x, y, width, 30, { font: '22px ' + FONT, color: COLORS.muted });
    const colWidth = Math.floor((width - 24) / 2);
    items.forEach((item, index) => {
      const col = compact ? index % 2 : index % 2;
      const row = compact ? Math.floor(index / 2) : Math.floor(index / 2);
      const bx = x + col * (colWidth + 24);
      const by = y + row * 86;
      roundRect(ctx, bx, by, colWidth, 70, 12, COLORS.white, COLORS.border);
      ctx.fillStyle = item.tier === 'platinum' ? '#A8A8A8' : item.tier === 'gold' ? '#C08B22' : item.tier === 'silver' ? '#7B858A' : '#A9693B';
      ctx.font = 'bold 24px ' + FONT;
      ctx.fillText('◆', bx + 18, by + 19);
      text(ctx, item.title, bx + 54, by + 12, colWidth - 72, 28, { font: 'bold 20px ' + FONT });
      text(ctx, TIER[item.tier] || '成就', bx + 54, by + 42, colWidth - 72, 22, { font: '16px ' + FONT, color: COLORS.muted });
    });
    return y + Math.ceil(items.length / 2) * 86;
  }

  function drawLife(ctx, data, x, y, width, compact) {
    text(ctx, '🗺️ 人生经历', x, y, width, 38, { font: 'bold 30px ' + FONT, color: COLORS.red });
    y += 56;
    const items = compact ? data.life.slice(-8) : data.life;
    if (!items.length) return text(ctx, '人生卷宗尚未留下更多记录。', x, y, width, 30, { font: '22px ' + FONT, color: COLORS.muted });
    items.forEach((item, index) => {
      const by = y + index * 62;
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath(); ctx.arc(x + 10, by + 13, 6, 0, Math.PI * 2); ctx.fill();
      if (index < items.length - 1) { ctx.strokeStyle = COLORS.border; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 10, by + 22); ctx.lineTo(x + 10, by + 62); ctx.stroke(); }
      text(ctx, item.year + ' 岁', x + 30, by, 100, 24, { font: 'bold 18px ' + FONT, color: COLORS.red });
      text(ctx, item.event, x + 130, by, width - 130, 25, { font: '19px ' + FONT, color: COLORS.ink });
    });
    if (!compact && data.life.length >= 36) text(ctx, '仅展示最近 36 条经历，完整人生记录仍保存在本机存档中。', x, y + items.length * 62 + 8, width, 24, { font: '16px ' + FONT, color: COLORS.muted });
    return y + items.length * 62 + (!compact && data.life.length >= 36 ? 40 : 0);
  }

  function drawFooter(ctx, data, y, width, donationImage, compact) {
    const footerHeight = compact ? 400 : 470;
    roundRect(ctx, 42, y, width - 84, footerHeight, 18, COLORS.goldLight, COLORS.border);
    text(ctx, '把这一段人生分享出去', width / 2, y + 24, width - 120, 32, { align: 'center', font: 'bold 28px ' + FONT, color: COLORS.red });
    const qrSize = compact ? 230 : 275;
    const gap = compact ? 42 : 70;
    const total = qrSize * 2 + gap;
    const left = (width - total) / 2;
    drawQr(ctx, data.gameUrl, left, y + 84, qrSize);
    if (donationImage) {
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(left + qrSize + gap, y + 84, qrSize, qrSize);
      const scale = Math.min(qrSize / donationImage.width, qrSize / donationImage.height);
      const dw = donationImage.width * scale;
      const dh = donationImage.height * scale;
      ctx.drawImage(donationImage, left + qrSize + gap + (qrSize - dw) / 2, y + 84 + (qrSize - dh) / 2, dw, dh);
      ctx.strokeStyle = COLORS.border; ctx.lineWidth = 2; ctx.strokeRect(left + qrSize + gap, y + 84, qrSize, qrSize);
    }
    text(ctx, '扫码进入游戏', left, y + 84 + qrSize + 18, qrSize, 27, { align: 'center', font: 'bold 21px ' + FONT, color: COLORS.red });
    text(ctx, '支持作者', left + qrSize + gap, y + 84 + qrSize + 18, qrSize, 27, { align: 'center', font: 'bold 21px ' + FONT, color: COLORS.red });
    text(ctx, '上岸模拟器 · 游客本地存档 · 静态版', width / 2, y + footerHeight - 38, width - 120, 24, { align: 'center', font: '16px ' + FONT, color: COLORS.muted });
    return y + footerHeight;
  }

  async function makeCanvas(p, h, compact) {
    const data = snapshot(p, h);
    const width = 1080;
    const metricsY = 270;
    const achCount = compact ? Math.min(data.achievements.length, 8) : data.achievements.length;
    const lifeCount = compact ? Math.min(data.life.length, 8) : data.life.length;
    const contentHeight = compact ? 820 : 470 + Math.ceil(achCount / 2) * 86 + 70 + lifeCount * 62;
    const height = compact
      ? Math.max(1710, 1152 + Math.ceil(achCount / 2) * 86 + lifeCount * 62)
      : Math.max(2100, 760 + contentHeight + 470);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = COLORS.paper; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = COLORS.red; ctx.lineWidth = 5; ctx.strokeRect(18, 18, width - 36, height - 36);
    drawHeader(ctx, data, width);
    drawMetric(ctx, '最终评分', data.grade + ' · ' + data.score + ' 分', 54, metricsY, 220);
    drawMetric(ctx, '最高职级', data.rank, 288, metricsY, 220);
    drawMetric(ctx, '晋升次数', data.promotions + ' 次', 522, metricsY, 220);
    drawMetric(ctx, '工作年限', data.yearsWorked + ' 年', 756, metricsY, 270);
    text(ctx, '图鉴收集：' + data.progress.events + '/' + data.progress.totalEvents + ' 事件 · ' + data.progress.endings + '/' + data.progress.totalEndings + ' 结局 · ' + data.achievements.length + ' 项成就', width / 2, 405, width - 108, 30, { align: 'center', font: '20px ' + FONT, color: COLORS.muted });
    let y = 480;
    y = drawAchievements(ctx, data, 64, y, width - 128, compact) + 38;
    y = drawLife(ctx, data, 64, y, width - 128, compact) + 42;
    const donationImage = await loadImage('reward-qrcode.png').catch(() => null);
    drawFooter(ctx, data, Math.max(y, height - (compact ? 420 : 520)), width, donationImage, compact);
    return canvas;
  }

  function downloadCanvas(canvas, name) {
    return new Promise(resolve => {
      const finish = blob => {
        if (!blob) { App.showToast && App.showToast('图片生成失败，请重试', 'error'); resolve(false); return; }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        App.showToast && App.showToast('分享图片已下载', 'success');
        resolve(true);
      };
      if (canvas.toBlob) canvas.toBlob(finish, 'image/png');
      else finish(dataUrlToBlob(canvas.toDataURL('image/png')));
    });
  }

  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const bytes = atob(parts[1]);
    const array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i);
    return new Blob([array], { type: 'image/png' });
  }

  Object.assign(App, {
    isStaticBuild() { return !!(staticConfig().staticOnly); },
    getShareGameUrl: gameUrl,
    async exportStaticSharePoster(compact) {
      try {
        const canvas = await makeCanvas(typeof engine !== 'undefined' ? engine.getPlayer() : {}, typeof engine !== 'undefined' ? engine.getHidden() : {}, !!compact);
        return downloadCanvas(canvas, compact ? '上岸模拟器-精简分享卡.png' : '上岸模拟器-人生长海报.png');
      } catch (error) {
        if (this.showToast) this.showToast('分享图片生成失败，请检查页面资源后重试', 'error');
        return false;
      }
    },
    saveRewardQr() {
      const anchor = document.createElement('a');
      anchor.href = 'reward-qrcode.png'; anchor.download = '上岸模拟器-赞赏码.png';
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      if (this.showToast) this.showToast('赞赏码已保存', 'success');
    }
  });
}());
