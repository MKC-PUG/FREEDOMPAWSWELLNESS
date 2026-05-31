/** Clean canvas-drawn backgrounds — no protocol marketing art behind the pet. */

export function usesPhotoBackground(themeId: string): boolean {
  return themeId === 'superbud-hero' || themeId === 'lake-legend';
}

export function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  themeId: string,
  w: number,
  h: number
) {
  switch (themeId) {
    case 'patriot-pup':
      drawPatriot(ctx, w, h);
      break;
    case 'hollywood-star':
      drawHollywood(ctx, w, h);
      break;
    case 'wellness-warrior':
      drawWellness(ctx, w, h);
      break;
    case 'birthday-bash':
      drawBirthday(ctx, w, h);
      break;
    case 'snow-mountain':
      drawSnowMountain(ctx, w, h);
      break;
    default:
      ctx.fillStyle = '#0A1625';
      ctx.fillRect(0, 0, w, h);
  }
}

function drawPatriot(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0A1625');
  grad.addColorStop(0.45, '#1E3A8A');
  grad.addColorStop(1, '#7F1D1D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 97) % 1000) / 1000 * w;
    const y = ((i * 53) % 700) / 1000 * h * 0.55;
    ctx.beginPath();
    ctx.arc(x, y, 1.2 + (i % 3) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#DC2626';
  ctx.fillRect(0, h * 0.78, w, h * 0.11);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, h * 0.89, w, h * 0.11);
}

function drawHollywood(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1a0a2e');
  grad.addColorStop(0.5, '#4a1942');
  grad.addColorStop(1, '#0A1625');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#450a0a';
  ctx.fillRect(0, h * 0.72, w, h * 0.28);

  ctx.fillStyle = '#F5C242';
  for (let i = 0; i < 24; i += 1) {
    const x = (i / 24) * w + (i % 2) * 8;
    const y = h * 0.12 + (i % 4) * 14;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWellness(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#ecfdf5');
  grad.addColorStop(0.35, '#6ee7b7');
  grad.addColorStop(1, '#047857');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.85, w * 0.55, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBirthday(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#fdf4ff');
  grad.addColorStop(0.5, '#f9a8d4');
  grad.addColorStop(1, '#7c3aed');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const colors = ['#F5C242', '#EC4899', '#22C55E', '#3B82F6', '#F97316'];
  for (let i = 0; i < 40; i += 1) {
    ctx.fillStyle = colors[i % colors.length];
    const x = ((i * 131) % 1000) / 1000 * w;
    const y = ((i * 79) % 1000) / 1000 * h;
    const size = 3 + (i % 4);
    if (i % 3 === 0) {
      ctx.fillRect(x, y, size, size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMountainPeak(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cxRatio: number,
  baseYRatio: number,
  heightRatio: number,
  rockColor: string,
  snowColor: string
) {
  const cx = w * cxRatio;
  const baseY = h * baseYRatio;
  const peakY = baseY - h * heightRatio;
  const halfWidth = w * heightRatio * 0.58;

  ctx.fillStyle = rockColor;
  ctx.beginPath();
  ctx.moveTo(cx - halfWidth, baseY);
  ctx.lineTo(cx, peakY);
  ctx.lineTo(cx + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = snowColor;
  ctx.beginPath();
  ctx.moveTo(cx - halfWidth * 0.38, baseY - h * heightRatio * 0.38);
  ctx.lineTo(cx, peakY);
  ctx.lineTo(cx + halfWidth * 0.38, baseY - h * heightRatio * 0.38);
  ctx.lineTo(cx + halfWidth * 0.22, baseY - h * heightRatio * 0.22);
  ctx.lineTo(cx, baseY - h * heightRatio * 0.3);
  ctx.lineTo(cx - halfWidth * 0.22, baseY - h * heightRatio * 0.22);
  ctx.closePath();
  ctx.fill();
}

function drawSnowMountain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#7c8fa8');
  sky.addColorStop(0.3, '#b8c5d6');
  sky.addColorStop(0.55, '#dce4ed');
  sky.addColorStop(1, '#eef2f7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  drawMountainPeak(ctx, w, h, 0.12, 0.72, 0.38, '#5c6b7a', '#f1f5f9');
  drawMountainPeak(ctx, w, h, 0.62, 0.68, 0.45, '#475569', '#ffffff');
  drawMountainPeak(ctx, w, h, 0.88, 0.74, 0.32, '#64748b', '#f8fafc');
  drawMountainPeak(ctx, w, h, 0.38, 0.78, 0.52, '#334155', '#ffffff');

  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.82);
  ctx.quadraticCurveTo(w * 0.2, h * 0.78, w * 0.42, h * 0.81);
  ctx.quadraticCurveTo(w * 0.65, h * 0.84, w * 0.85, h * 0.79);
  ctx.quadraticCurveTo(w * 0.95, h * 0.77, w, h * 0.8);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 173) % 1000) / 1000 * w;
    const y = ((i * 97) % 1000) / 1000 * h * 0.75;
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3) * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 211 + 40) % 1000) / 1000 * w;
    const y = ((i * 131 + 20) % 1000) / 1000 * h * 0.55;
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + (i % 2) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}
