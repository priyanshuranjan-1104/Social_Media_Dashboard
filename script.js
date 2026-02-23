const d = new Date(2026, 1, 19);
document.getElementById('current-date').textContent =
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function filterPlatform(platform, el) {
  document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
  });
});

window.addEventListener('load', () => {
  document.querySelectorAll('.breakdown-bar').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = targetWidth; }, 400);
  });
});

// ── Engagement chart  ───────────
const canvas = document.getElementById('engagementChart');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width        = rect.width * dpr;
  canvas.height       = 180 * dpr;
  canvas.style.width  = rect.width + 'px';
  canvas.style.height = '180px';

  ctx.scale(dpr, dpr);
  drawChart(rect.width, 180);
}

function drawChart(W, H) {
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 16, right: 16, bottom: 32, left: 8 };
  const cw  = W - pad.left - pad.right;
  const ch  = H - pad.top  - pad.bottom;

  const DAYS = 30;

  // Waves
  const wave = (i, offset) =>
    Math.sin(i * 0.7 + offset) * 0.4 +
    Math.sin(i * 0.3 + offset * 2) * 0.3 +
    0.5;

  const likes    = Array.from({ length: DAYS }, (_, i) => Math.max(0.1, wave(i, 0) * 3200 + 800));
  const comments = Array.from({ length: DAYS }, (_, i) => Math.max(0.1, wave(i, 2) *  900 + 200));
  const shares   = Array.from({ length: DAYS }, (_, i) => Math.max(0.1, wave(i, 5) *  600 + 100));

  const maxVal = Math.max(...likes, ...comments, ...shares);

  const toX = i => pad.left + (i / (DAYS - 1)) * cw;
  const toY = v => pad.top  + ch - (v / maxVal) * ch;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth   = 1;
  for (let r = 0; r <= 4; r++) {
    const y = pad.top + (r / 4) * ch;
    ctx.beginPath();
    ctx.moveTo(pad.left,     y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
  }

  function drawLine(data, color) {
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = toX(i), y = toY(v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    ctx.stroke();

    ctx.lineTo(toX(data.length - 1), pad.top + ch);
    ctx.lineTo(pad.left,              pad.top + ch);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, color.replace(')', ',0.15)').replace('rgb', 'rgba'));
    grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));
    ctx.fillStyle = grad;
    ctx.fill();
  }

  drawLine(shares,   'rgb(184,71,255)');
  drawLine(comments, 'rgb(71,200,255)');
  drawLine(likes,    'rgb(232,255,71)');

  ctx.fillStyle   = 'rgba(107,107,133,0.7)';
  ctx.font        = '9px DM Mono, monospace';
  ctx.textAlign   = 'center';
  const labels    = ['Jan 20', 'Jan 27', 'Feb 3', 'Feb 10', 'Feb 17', 'Feb 19'];
  const labelIdxs = [0, 5, 10, 16, 23, 29];
  labelIdxs.forEach((idx, li) => {
    ctx.fillText(labels[li], toX(idx), H - 6);
  });
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);