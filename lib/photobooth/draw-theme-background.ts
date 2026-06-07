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
