# Vercel Preview Deploy — Your Repo

**GitHub:** `MKC-PUG/FREEDOMPAWSWELLNESS`  
**Goal:** HTTPS preview PWA (`NEXT_PUBLIC_SITE_MODE=preview`) — not public marketing yet.

---

## Before Vercel can deploy the latest app

Your Mac has **many changes not on GitHub yet** (PWA v13, Token Shop header, nav fixes, Photo Booth, etc.).

You must **commit and push** to `main` first. In Cursor, ask the agent: *“Commit and push everything for Vercel deploy”* — or run git yourself.

---

## Step 1 — Connect Vercel to GitHub

1. Log in at [vercel.com](https://vercel.com)
2. **Add New… → Project**
3. **Import** `MKC-PUG/FREEDOMPAWSWELLNESS`
4. Framework: **Next.js** (auto-detected)
5. **Do not change** build settings unless Vercel fails:
   - Build command: `npm run build`
   - Output: default (Next.js)

---

## Step 2 — Environment variables (required)

In Vercel → Project → **Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|--------|----------------|
| `NEXT_PUBLIC_SITE_MODE` | `preview` | Production, Preview, Development |
| `ADMIN_PASSWORD` | *(choose a strong password)* | Production, Preview, Development |

Click **Save**.

---

## Step 3 — Deploy

1. Click **Deploy**
2. Wait for green **Ready** (about 2–4 minutes first time)
3. Copy your URL, e.g. `https://freedompawswellness.vercel.app`

---

## Step 4 — Optional but recommended (brand protection)

Vercel → Project → **Settings → Deployment Protection**

- Turn on **Password Protection** for Production  
- Share the password only with people you trust for testing

---

## Step 5 — Install PWA on iPhone

1. iPhone **Safari** → open your **https://** Vercel URL  
2. **Share** → **Add to Home Screen**
3. Open from icon — should be **standalone** (no Safari bar)
4. Run tests from `docs/PWA-Setup.md` (Photo Booth, ViT, Token Shop, offline banner)

---

## Step 6 — Verify preview mode

- [ ] Gold banner: *Private preview — for your testing only*
- [ ] Footer: © Freedom Paws + SuperBud™ notice
- [ ] Google: `site:your-vercel-url.vercel.app` → no results (may take a few days)

---

## After every code change

1. Commit + push to `main` on GitHub  
2. Vercel redeploys automatically  
3. On iPhone: open app → tap **Refresh now** if update banner shows, or force-quit and reopen  

Bump `lib/pwa-version.ts` when you want to force all installed PWAs to pick up a new service worker.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Vercel | Open **Deployments → failed build → Logs**; usually a TypeScript or missing file error |
| Old version on phone | Tap **Refresh now** or reinstall from Home Screen |
| ViT / uploads odd on Vercel | Uploads use server temp storage (works per session; same as LAN production build) |
| Still on LAN IP | Use the **https://** Vercel URL, not `192.168.x.x` |

---

## When LLC/trademark ready (later)

1. Vercel env: `NEXT_PUBLIC_SITE_MODE` → `public`  
2. Redeploy  
3. Add your custom domain in Vercel → **Domains**  
4. Remove password protection when ready to announce  

---

*See also: `Deploy-and-Brand-Protection.md`, `PWA-Setup.md`*
