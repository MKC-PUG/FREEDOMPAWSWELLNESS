# SuperBud Social Studio — Click-by-click (Ops Marketing)

**Route:** `/ops/marketing`  
**Mascot:** SuperBud (Freedom Paws Wellness) — asset `public/images/brand/superbud.png`  
**Status:** Phase 1 shipped in app (draft → approve → Buffer dry-run). Video tools are linked, not automated APIs yet.

---

## 0) One-time setup (you)

### 0.1 Supabase table
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **freedom-paws-id**.
2. Left → **SQL Editor** → **New query**.
3. Paste contents of `supabase/migrations/015_social_posts.sql`.
4. **Run**. Confirm success (no red errors).
5. **Table Editor** → confirm table `social_posts` exists.

### 0.2 Env (optional for live Buffer)
In Vercel → Project → **Settings** → **Environment Variables** (Production):

| Name | Purpose |
|------|---------|
| `OPENAI_API_KEY` | AI caption/script polish (already used elsewhere) |
| `BUFFER_WEBHOOK_URL` | n8n/Make webhook that creates Buffer drafts |
| or `N8N_SOCIAL_BUFFER_WEBHOOK_URL` | Same, alternate name |

Without a webhook, **Send to Buffer** still works as **dry-run** (marks scheduled + stores payload).

Redeploy after adding env vars.

### 0.3 Accounts (production studio)
Create/login (founder accounts):
1. [Buffer](https://buffer.com) — connect IG Business, TikTok, YouTube, Facebook.
2. [ElevenLabs](https://elevenlabs.io) — voice for SuperBud VO.
3. [Runway](https://app.runwayml.com) — motion from SuperBud still.
4. [CapCut](https://www.capcut.com) — edit 9:16.
5. [Canva](https://www.canva.com) — storyboards / end cards.
6. ChatGPT and/or Claude — script polish.

---

## 1) Open the Ops module

1. Go to `https://app.freedompawsinc.com/ops` (or local `/ops`).
2. Sign in with an **fp_ops** account.
3. Click **SUPERBUD** in Ops nav.
4. Page title: **Marketing & SuperBud studio**.
5. Confirm SuperBud image + KPI row load (Total / Draft / Needs approval / …).

If you see “Run migration 015…” → finish step 0.1 and refresh.

---

## 2) Generate a draft (dashboard)

1. Under **Generate draft**, choose a **Pillar**:
   - Adoption Network · TN → `/adopt/tn`
   - Freedom Paws ID → `/id`
   - ViT Diagnostics → `/diagnostics`
   - My Pets Vault → `/mypets`
   - Photo Booth → `/photobooth`
   - Wellness Partners → `/wellness`
   - Token Shop → `/token-shop`
   - Mission & Veterans → `/waitlist`
2. Choose **Platform** (instagram / tiktok / youtube / facebook).
3. Click **Generate draft (AI)** (uses OpenAI if configured) **or** **Create SuperBud template** (always works offline).
4. New card appears in **Pipeline** (left list).
5. Click the card → review **Caption**, **Script**, **Storyboard**.

---

## 3) Approve flow (oversight)

1. With a post selected → **Submit for approval** (status → needs_approval).
2. Review tone: wellness-first, **no veterinary diagnosis claims**.
3. Click **Approve** (status → approved; audit logged).
4. Optional: **Archive** to remove from active pipeline.

Nothing is public yet — Buffer/social accounts are not contacted until step 4.

---

## 4) Send to Buffer

1. Select an **approved** post.
2. Click **Send to Buffer**.
3. **If webhook unset:** dry-run success message; status → scheduled; payload saved for n8n later.
4. **If webhook set:** Ops POSTs JSON to your n8n/Buffer bridge → schedule in Buffer UI.
5. Confirm in Buffer queue, then publish / schedule.

### Suggested n8n Workflow F (later)
1. Webhook trigger (URL = `BUFFER_WEBHOOK_URL`).
2. Map `caption`, `platform`, `ctaUrl`.
3. Buffer node → create update / add to queue.
4. Keep workflow **Inactive** until Activation Gate is signed (`docs/marketing/ACTIVATION-GATE.md`).

---

## 5) Production studio (scripts → video)

Use the **Production studio** section on the same page. For each approved script:

| Step | Click | Do |
|------|--------|-----|
| 1 | ChatGPT / Claude cards | Paste Ops script; polish; keep SuperBud + CTA |
| 2 | Canva | Storyboard 3–5 frames; SuperBud chest emblem readable |
| 3 | ElevenLabs | Paste approved VO script → export audio |
| 4 | Runway | Upload SuperBud still → generate short motion (optional) |
| 5 | CapCut | Assemble 9:16: VO + motion/app screen + captions + end card CTA |
| 6 | Ops → Approve | Only after final video matches script |
| 7 | Buffer | Send to Buffer / schedule |

**Brand rule:** SuperBud is the on-brand face of Freedom Paws Wellness (trademark pending). Prefer SuperBud over founder face clones for Phase 1.

---

## 6) Weekly oversight cadence (efficient dashboard use)

1. Monday: Generate 5–7 drafts (mix pillars).
2. Same day: Approve 3–5; archive weak ones.
3. Produce videos for approved set (batch CapCut).
4. Send to Buffer; schedule Tue–Sat.
5. Friday: Check KPI row (Posted vs Failed); fix failed posts.
6. Leave **email automation** dormant until Activation Gate.

---

## 7) What is / is not automated

| Capability | Phase 1 (now) | Later |
|------------|---------------|--------|
| Pillar templates + storyboard | ✅ | — |
| AI caption/script | ✅ (OpenAI optional) | Better brand voice pack |
| Approve gate + audit | ✅ | Multi-approver |
| Buffer send | ✅ dry-run / webhook | Native Buffer API |
| ElevenLabs / Runway / CapCut | ✅ deep links | Direct API render |
| Auto-post without approve | ❌ never | Still never |

---

## 8) Files reference

| Path | Role |
|------|------|
| `app/ops/(protected)/marketing/page.tsx` | Hub page |
| `app/ops/components/OpsSocialStudio.tsx` | Dashboard + studio UI |
| `lib/ops/social-pillars.ts` | Pillars + tool links |
| `lib/ops/social-server.ts` | DB + generate + Buffer |
| `app/api/ops/social/posts/route.ts` | CRUD / generate / approve |
| `app/api/ops/social/buffer/route.ts` | Buffer webhook |
| `supabase/migrations/015_social_posts.sql` | Table + RLS |
| `public/images/brand/superbud.png` | Mascot still |

---

## 9) Done checklist

- [ ] Migration `015_social_posts.sql` run
- [ ] `/ops/marketing` shows SuperBud + KPIs
- [ ] Can generate template without OpenAI
- [ ] Approve → Send to Buffer dry-run works
- [ ] Buffer accounts connected (when ready for live)
- [ ] First SuperBud CapCut exported with CTA to `/adopt/tn` or `/id`
