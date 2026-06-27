import { themeUsesImageBackground } from './themes';

/** @deprecated Use themeUsesImageBackground — kept for canvas paint imports */
export function usesPhotoBackground(themeId: string): boolean {
  return themeUsesImageBackground(themeId);
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
    case 'holiday-new-years':
      drawHolidayNewYears(ctx, w, h);
      break;
    case 'holiday-st-patricks':
      drawHolidayStPatricks(ctx, w, h);
      break;
    case 'holiday-easter':
      drawHolidayEaster(ctx, w, h);
      break;
    case 'holiday-cinco-de-mayo':
      drawHolidayCincoDeMayo(ctx, w, h);
      break;
    case 'holiday-july-4th':
      drawHolidayJuly4(ctx, w, h);
      break;
    case 'holiday-veterans':
      drawHolidayVeterans(ctx, w, h);
      break;
    case 'holiday-halloween':
      drawHolidayHalloween(ctx, w, h);
      break;
    case 'holiday-thanksgiving':
      drawHolidayThanksgiving(ctx, w, h);
      break;
    case 'holiday-christmas':
      drawHolidayChristmas(ctx, w, h);
      break;
    case 'heaven-gates':
      drawHeavenGates(ctx, w, h);
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

function drawHolidayNewYears(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#312e81');
  grad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#F5C242';
  for (let i = 0; i < 30; i += 1) {
    ctx.beginPath();
    ctx.arc(((i * 97) % 1000) / 1000 * w, ((i * 53) % 800) / 1000 * h, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHolidayStPatricks(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(1, '#052e16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(74, 222, 128, 0.35)';
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.arc(w * (0.1 + i * 0.07), h * 0.15, 8 + (i % 3) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHolidayEaster(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#fdf2f8');
  grad.addColorStop(0.45, '#fbcfe8');
  grad.addColorStop(1, '#a7f3d0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawHolidayCincoDeMayo(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const colors = ['#DC2626', '#16A34A', '#F5C242', '#FFFFFF'];
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(0, (h / 8) * i, w, h / 8 + 1);
  }
}

function drawHolidayJuly4(ctx: CanvasRenderingContext2D, w: number, h: number) {
  drawPatriot(ctx, w, h);
}

function drawHolidayVeterans(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(0.5, '#334155');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(245, 194, 66, 0.85)';
  ctx.font = `bold ${Math.max(10, w * 0.04)}px system-ui,sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for your service', w / 2, h * 0.12);
}

function drawHolidayHalloween(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#431407');
  grad.addColorStop(0.55, '#7c2d12');
  grad.addColorStop(1, '#1c1917');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.18, w * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawHolidayThanksgiving(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#78350f');
  grad.addColorStop(0.4, '#b45309');
  grad.addColorStop(1, '#451a03');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawHolidayChristmas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.45, '#14532d');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 24; i += 1) {
    ctx.beginPath();
    ctx.arc(((i * 113) % 1000) / 1000 * w, ((i * 67) % 600) / 1000 * h, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Heavenly golden entry gates — canvas fallback until bg-heaven-gates.jpg is added. */
function drawHeavenGates(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1e3a8a');
  sky.addColorStop(0.35, '#7c3aed');
  sky.addColorStop(0.65, '#fbbf24');
  sky.addColorStop(1, '#fef3c7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const ray = ctx.createRadialGradient(w * 0.5, h * 0.38, w * 0.02, w * 0.5, h * 0.38, w * 0.75);
  ray.addColorStop(0, 'rgba(255,255,255,0.55)');
  ray.addColorStop(0.45, 'rgba(251,191,36,0.25)');
  ray.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = ray;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 28; i += 1) {
    ctx.beginPath();
    ctx.arc(((i * 97) % 1000) / 1000 * w, ((i * 53) % 500) / 1000 * h, 1 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const cloudY = h * 0.72;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  for (const cx of [w * 0.15, w * 0.38, w * 0.62, w * 0.85]) {
    ctx.beginPath();
    ctx.ellipse(cx, cloudY, w * 0.14, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.06, cloudY + h * 0.02, w * 0.09, h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + w * 0.06, cloudY + h * 0.02, w * 0.09, h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const gateW = w * 0.52;
  const gateH = h * 0.42;
  const gateX = (w - gateW) / 2;
  const gateY = h * 0.28;
  const pillarW = gateW * 0.12;

  const gold = ctx.createLinearGradient(gateX, gateY, gateX + gateW, gateY + gateH);
  gold.addColorStop(0, '#fde68a');
  gold.addColorStop(0.45, '#f59e0b');
  gold.addColorStop(1, '#b45309');
  ctx.fillStyle = gold;
  ctx.fillRect(gateX, gateY + gateH * 0.15, pillarW, gateH * 0.85);
  ctx.fillRect(gateX + gateW - pillarW, gateY + gateH * 0.15, pillarW, gateH * 0.85);

  ctx.beginPath();
  ctx.moveTo(gateX, gateY + gateH * 0.15);
  ctx.quadraticCurveTo(gateX + gateW * 0.5, gateY - gateH * 0.05, gateX + gateW, gateY + gateH * 0.15);
  ctx.lineTo(gateX + gateW - pillarW, gateY + gateH * 0.15);
  ctx.quadraticCurveTo(gateX + gateW * 0.5, gateY + gateH * 0.02, gateX + pillarW, gateY + gateH * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = Math.max(2, w * 0.004);
  for (let i = 1; i <= 4; i += 1) {
    const barY = gateY + gateH * (0.22 + i * 0.14);
    ctx.beginPath();
    ctx.moveTo(gateX + pillarW * 0.3, barY);
    ctx.lineTo(gateX + gateW - pillarW * 0.3, barY);
    ctx.stroke();
  }

  const pathGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
  pathGrad.addColorStop(0, 'rgba(254,243,199,0.5)');
  pathGrad.addColorStop(1, 'rgba(255,255,255,0.95)');
  ctx.fillStyle = pathGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.5 - w * 0.12, h);
  ctx.lineTo(w * 0.5 + w * 0.12, h);
  ctx.lineTo(w * 0.5 + w * 0.06, h * 0.58);
  ctx.lineTo(w * 0.5 - w * 0.06, h * 0.58);
  ctx.closePath();
  ctx.fill();
}
