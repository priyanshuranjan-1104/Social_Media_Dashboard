(function () {
    const el = document.getElementById("current-date");
    if (el) {
        const d = new Date();
        el.textContent = d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }
})();

function filterPlatform(platform, el) {
    document
        .querySelectorAll(".platform-tab")
        .forEach((t) => t.classList.remove("active"));
    el.classList.add("active");
}

window.addEventListener("load", () => {
    document
        .querySelectorAll(".breakdown-bar, .age-bar, .progress-bar")
        .forEach((bar) => {
            const target = bar.style.width;
            bar.style.width = "0";
            setTimeout(() => {
                bar.style.width = target;
            }, 300);
        });
});

function wave(i, offset) {
    return (
        Math.sin(i * 0.7 + offset) * 0.4 +
        Math.sin(i * 0.3 + offset * 2) * 0.3 +
        0.5
    );
}

function drawGridLines(ctx, pad, W, H, rows = 4) {
    const ch = H - pad.top - pad.bottom;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= rows; r++) {
        const y = pad.top + (r / rows) * ch;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(W - pad.right, y);
        ctx.stroke();
    }
}

function drawLineChart(ctx, data, color, pad, W, H, DAYS, maxVal, fill = true) {
    const cw = W - pad.left - pad.right;
    const ch = H - pad.top - pad.bottom;
    const toX = (i) => pad.left + (i / (DAYS - 1)) * cw;
    const toY = (v) => pad.top + ch - (v / maxVal) * ch;

    ctx.beginPath();
    data.forEach((v, i) => {
        i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v));
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    if (fill) {
        ctx.lineTo(toX(data.length - 1), pad.top + ch);
        ctx.lineTo(pad.left, pad.top + ch);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
        const c = color.replace("rgb(", "rgba(").replace(")", ",");
        grad.addColorStop(0, c + "0.15)");
        grad.addColorStop(1, c + "0)");
        ctx.fillStyle = grad;
        ctx.fill();
    }
}

function drawXLabels(ctx, labels, indices, DAYS, pad, W, H) {
    const cw = W - pad.left - pad.right;
    const toX = (i) => pad.left + (i / (DAYS - 1)) * cw;
    ctx.fillStyle = "rgba(107,107,133,0.7)";
    ctx.font = "9px DM Mono, monospace";
    ctx.textAlign = "center";
    indices.forEach((idx, li) => ctx.fillText(labels[li], toX(idx), H - 6));
}

function drawDonut(canvasId, segments, size = 130) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const ir = r * 0.62;
    let angle = -Math.PI / 2;

    segments.forEach((seg) => {
        const slice = (seg.pct / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + slice);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        angle += slice;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, ir, 0, Math.PI * 2);
    ctx.fillStyle = "#111118";
    ctx.fill();
}
