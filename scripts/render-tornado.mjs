/**
 * Buddy to SuperBud. First tornado cut. Not locked.
 * He stays in place. Dust lifts at his feet, then a solid funnel
 * hides him: wide and soft at the top, narrow at the ground, with a
 * debris skirt. The funnel thins and SuperBud is standing.
 */
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'tmp/tornado-frames');
const clipDir = join(root, 'public/images/brand/clips');
const W = 720;
const H = 1280;
const FRAMES = 156;

async function fit(file) {
  const meta = await sharp(file).metadata();
  const scale = Math.max(W / meta.width, H / meta.height);
  const rw = Math.round(meta.width * scale);
  const rh = Math.round(meta.height * scale);
  const left = Math.max(0, Math.round((rw - W) / 2));
  const top = Math.max(0, Math.round((rh - H) / 2));
  return sharp(file)
    .resize(rw, rh)
    .extract({ left, top, width: W, height: H })
    .ensureAlpha()
    .raw()
    .toBuffer();
}

function windAt(frame) {
  if (frame < 16 || frame > 146) return null;
  if (frame < 40) {
    const u = (frame - 16) / 24;
    return { spread: 0.22 + u * 0.15, fade: 0.35 + u * 0.45, speed: 10 + u * 8, hide: 0 };
  }
  if (frame < 68) {
    const u = (frame - 40) / 28;
    return { spread: 0.37 + u * 0.63, fade: 0.8 + u * 0.2, speed: 18 + u * 12, hide: u * 0.96 };
  }
  if (frame < 100) return { spread: 1, fade: 1, speed: 32, hide: 0.97 };
  const u = (frame - 100) / 46;
  return { spread: 1 - u * 0.15, fade: 1 - u, speed: 32 - u * 22, hide: 0.97 * (1 - u) };
}

function wedgePath(cx, footY, topY, baseHalf, topHalf, bulge) {
  const midY = (footY + topY) / 2;
  const midHalf = (baseHalf + topHalf) / 2 + bulge;
  return `M ${(cx - baseHalf).toFixed(1)} ${footY.toFixed(1)}
    Q ${(cx - midHalf).toFixed(1)} ${midY.toFixed(1)}, ${(cx - topHalf).toFixed(1)} ${topY.toFixed(1)}
    L ${(cx + topHalf).toFixed(1)} ${topY.toFixed(1)}
    Q ${(cx + midHalf).toFixed(1)} ${midY.toFixed(1)}, ${(cx + baseHalf).toFixed(1)} ${footY.toFixed(1)} Z`;
}

function windSvg(wind, frame) {
  const cx = W / 2;
  const footY = H * 0.99;
  const topY = -60 + (1 - wind.spread) * H * 0.4;
  const baseHalf = 340 + wind.spread * 40;
  const topHalf = 390 + wind.spread * 50;
  const lean = Math.sin(frame / 18) * 2 * wind.spread;
  const bulge = Math.sin(frame * 0.35) * 36 * wind.spread;
  const shift = Math.sin(frame * 0.4) * 50;
  const body = wedgePath(cx, footY + 20, topY, baseHalf, topHalf, bulge);
  const core = wedgePath(cx + shift * 0.3, footY + 20, topY, baseHalf * 0.55, topHalf * 0.5, bulge * 0.4);
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sheath" gradientUnits="userSpaceOnUse" x1="${(cx - topHalf).toFixed(1)}" x2="${(cx + topHalf + shift).toFixed(1)}" y1="0" y2="0">
        <stop offset="0" stop-color="#F4EAD6"/>
        <stop offset="0.22" stop-color="#E4D2AA"/>
        <stop offset="0.5" stop-color="#A88B58"/>
        <stop offset="0.78" stop-color="#E4D2AA"/>
        <stop offset="1" stop-color="#F4EAD6"/>
      </linearGradient>
      <filter id="storm" x="-25%" y="-10%" width="150%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="3" seed="${frame % 9}" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="${(18 + wind.spread * 10).toFixed(1)}" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
    <g opacity="${Math.min(1, wind.fade).toFixed(3)}" transform="rotate(${lean.toFixed(2)} ${cx} ${footY})" filter="url(#storm)">
      <path d="${body}" fill="url(#sheath)"/>
      <path d="${core}" fill="#8C7044" opacity="0.55"/>
    </g>
  </svg>`);
}

const buddy = await fit(join(clipDir, 'buddy-full-neutral.jpg'));
const superbud = await fit(join(clipDir, 'superbud-full-body.jpg'));
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const only = process.env.FRAME === undefined ? null : Number(process.env.FRAME);
for (let frame = 0; frame < FRAMES; frame += 1) {
  if (only !== null && frame !== only) continue;
  const dog = frame >= 84 ? superbud : buddy;
  const wind = windAt(frame);
  const layers = [];
  if (wind && wind.fade > 0.02) layers.push({ input: windSvg(wind, frame), left: 0, top: 0 });
  await sharp(dog, { raw: { width: W, height: H, channels: 4 } })
    .composite(layers)
    .png()
    .toFile(join(outDir, `f${String(frame).padStart(3, '0')}.png`));
  if (frame % 12 === 0) console.log('frame', frame);
}

console.log(outDir);
