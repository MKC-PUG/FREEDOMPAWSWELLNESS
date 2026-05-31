# Deploy + Brand Protection — Freedom Paws

## Your strategy (recommended)

| Phase | What | SuperBud / IP risk |
|-------|------|---------------------|
| **Now** | Deploy in **preview** mode to hosting (HTTPS) | Low — not on Google, obscure URL |
| **Parallel** | LLC + trademark filing with your attorney | Builds legal protection |
| **Launch** | Flip to `public`, connect domain, announce | Protected by TM + © |

**Going live technically ≠ announcing to the world.** Preview mode keeps the app off search engines while you test on HTTPS and install the PWA from your real domain (optional).

---

## What protects SuperBud & protocols (plain language)

| Protection | What it does | When |
|------------|--------------|------|
| **Copyright ©** | Your images, copy, protocol text, app code are yours when created | **Automatic** — footer on site helps prove date |
| **Trademark ™** | Brand name “SuperBud”, “Freedom Paws” in your market | File with attorney; use ™ now, ® when registered |
| **LLC** | Limits personal liability, business entity | When your lawyer recommends |
| **Trade secret / private preview** | Not advertising = fewer people see it before TM | **Now** — preview mode |
| **Terms / unauthorized use notice** | Footer + future Terms page | **Now** — in footer |

*This is not legal advice — confirm timing with your trademark/LLC attorney.*

**Reality check:** Nothing stops someone from *copying an idea* if they never see your site. Preview deploy + no public marketing is the practical shield until trademarks file.

---

## Step 1 — Deploy in preview mode (finish HTTPS hosting)

### Option A: Vercel (easiest for Next.js)

1. Push code to GitHub (private repo recommended).
2. [vercel.com](https://vercel.com) → Import project.
3. **Environment variables:**
   - `NEXT_PUBLIC_SITE_MODE` = `preview`
   - `ADMIN_PASSWORD` = (strong password)
4. Deploy → you get `https://your-project.vercel.app` (HTTPS automatic).
5. **Do not** connect your main domain yet — or connect it only when ready.

**Extra lock (Vercel):** Project Settings → Deployment Protection → **Password protect** previews/production.

### Option B: Your existing host (cPanel, etc.)

1. Node.js hosting that supports Next.js `standalone` or use Vercel for app + domain at registrar.
2. Set same env vars on the host.
3. Enable SSL (Let’s Encrypt) in hosting panel.

### After deploy

1. Bump `PWA_VERSION` in `lib/pwa-version.ts` (e.g. `v11`).
2. Run deploy / push.
3. iPhone: Safari → `https://your-preview-url` → Add to Home Screen.

---

## Step 2 — Verify preview protection

- [ ] Footer shows **© Freedom Paws** and **SuperBud™**
- [ ] Gold **Private preview** banner at top
- [ ] Google: search `site:yourdomain.com` → should show **nothing** (may take days; robots.txt blocks crawlers immediately)
- [ ] Photo Booth + ViT still work on HTTPS

---

## Step 3 — When LLC/trademark are ready (public launch)

1. Attorney confirms you can use SuperBud™ / Freedom Paws™ publicly.
2. In hosting env: `NEXT_PUBLIC_SITE_MODE` = **`public`**
3. Redeploy.
4. Point your domain DNS to the host.
5. Remove Vercel password protection if used.
6. Announce when you choose.

---

## Environment reference

See `.env.example`:

```bash
NEXT_PUBLIC_SITE_MODE=preview   # or public
ADMIN_PASSWORD=...
```

---

## Checklist before you share any URL

- [ ] `NEXT_PUBLIC_SITE_MODE=preview`
- [ ] Private GitHub repo (or careful who has access)
- [ ] Hosting password protection enabled (optional, recommended)
- [ ] Do not post preview URL on social media
- [ ] Trademark application in progress or filed (your attorney)

---

## iPhone install on production URL

Same as LAN, but use `https://your-domain-or-preview-url` instead of `192.168.x.x`.

PWA requires **HTTPS** on the public internet (preview URLs on Vercel qualify).
