# Infrastructure buildout — Framer → DNS → Wellness URLs

**Order:** Complete each phase before the next. **No partner onboarding** until all three are done.

**Policy:** Marketing automation stays dormant. Partner emails deferred.

---

# PHASE 1 — Framer `/adopt` (≈30 min)

**Goal:** `freedompawsinc.com/adopt` tells the story; **all live dogs** link to the app.

**Full guide:** `docs/Framer-Adopt-Page-Wiring-Guide-June-2026.md`

## Phase 1 checklist

### 1.1 Create page

| Step | Action |
|:----:|--------|
| 1 | [framer.com](https://framer.com) → site **Freedom Paws** |
| 2 | **Pages** → **+** → name **Adopt** |
| 3 | Slug: **`/adopt`** → URL `https://freedompawsinc.com/adopt` |
| 4 | Copy **Site Nav** + **Site Footer** from Home onto page |

### 1.2 Minimum viable layout (fast path)

Build only these sections first:

1. **Hero** — headline + one button  
2. **Primary CTA** (repeat at bottom)  
3. Optional: 6 partner names as text (no dog photos)

### 1.3 Copy-paste hero

**Eyebrow:** `Freedom Paws Adoption Network`  
**Headline:** `Find your next dog in Tennessee`  
**Subhead:** `Live adoptable dogs from municipal shelters and private rescues in our Tennessee pilot — updated when partners publish.`

**Button label:** `Browse adoptable dogs in Tennessee →`

### 1.4 Wire buttons (critical)

| Element | URL | New tab |
|---------|-----|:-------:|
| Hero primary button | `https://app.freedompawsinc.com/adopt/tn` | **OFF** |
| Bottom duplicate button | `https://app.freedompawsinc.com/adopt/tn` | **OFF** |
| Shelter partners (secondary) | `https://freedompawsinc.com/shelters` | OFF |
| Optional partner sign-in text link | `https://shelter.freedompawsinc.com/partner` | OFF |

**Per partner card (optional):**

| Partner | URL |
|---------|-----|
| Memphis | `https://app.freedompawsinc.com/adopt/tn/memphis-animal-services` |
| Metro Nashville | `https://app.freedompawsinc.com/adopt/tn/metro-animal-care-control` |
| Young-Williams | `https://app.freedompawsinc.com/adopt/tn/young-williams-animal-center` |
| New Leash on Life | `https://app.freedompawsinc.com/adopt/tn/new-leash-on-life` |
| Humane Society Sumner | `https://app.freedompawsinc.com/adopt/tn/humane-society-sumner-county` |
| Safe Place for Animals | `https://app.freedompawsinc.com/adopt/tn/safe-place-for-animals` |

### 1.5 Global nav + footer

| Location | Add | Link |
|----------|-----|------|
| **Site Nav** (edit component) | Menu item `Adopt` | Framer page `/adopt` |
| **Site Footer** | `Adopt (Tennessee)` | `https://freedompawsinc.com/adopt` |
| **Homepage** | Button `Adopt in Tennessee` | Page `/adopt` |
| **`/shelters`** | `Browse TN adoptable dogs` | `https://app.freedompawsinc.com/adopt/tn` |

### 1.6 Publish + iPhone test

1. **Publish** in Framer  
2. Safari → `freedompawsinc.com/adopt`  
3. Tap **Browse adoptable dogs** → opens `app.freedompawsinc.com/adopt/tn` with **6 partners**  
4. **New tab must NOT open**

### Phase 1 pass criteria

- [ ] Framer `/adopt` loads  
- [ ] Primary CTA → app directory (6 partners)  
- [ ] Nav **Adopt** → Framer story page  
- [ ] No live dog inventory built in Framer  

---

# PHASE 2 — DNS `shelter.freedompawsinc.com` (≈15 min)

**Goal:** Partner portal on dedicated subdomain (emerald Adoption Network shell).

**Today:** `app.freedompawsinc.com/partner` works. Subdomain may not resolve yet.

## Phase 2 checklist

### 2.1 Vercel — add domain

| Step | Action |
|:----:|--------|
| 1 | [vercel.com/dashboard](https://vercel.com/dashboard) → **freedompaws-app** project |
| 2 | **Settings** → **Domains** |
| 3 | **Add** → `shelter.freedompawsinc.com` |
| 4 | Vercel shows DNS record to add (usually **CNAME**) |

### 2.2 DNS provider (where `freedompawsinc.com` is registered)

| Step | Action |
|:----:|--------|
| 1 | Open DNS for **freedompawsinc.com** (GoDaddy, Cloudflare, Namecheap, etc.) |
| 2 | **Add record:** |
| | **Type:** CNAME |
| | **Name/Host:** `shelter` |
| | **Value/Target:** `cname.vercel-dns.com` (use exact value Vercel shows) |
| | **TTL:** Auto or 300 |
| 3 | **Save** |

### 2.3 Wait + verify

DNS can take **5–60 minutes** (sometimes up to 24h).

```bash
npm run ops:verify   # app checks
```

**Manual test:**

| URL | Expected |
|-----|----------|
| `https://shelter.freedompawsinc.com/partner` | Partner dashboard (emerald nav, “Adoption Network”) |
| `https://shelter.freedompawsinc.com/` | Redirects to `/partner` |
| `https://shelter.freedompawsinc.com/partner/listings` | Listings page |

**Pass:** Partner shell — **not** consumer “Freedom Paws Wellness” gold nav.

### 2.4 Optional Vercel env

Usually not required (code defaults to `shelter.freedompawsinc.com`). If you use a different host:

```
NEXT_PUBLIC_PARTNER_HOST=shelter.freedompawsinc.com
```

Redeploy after env change.

### Phase 2 pass criteria

- [ ] `shelter.freedompawsinc.com/partner` loads with partner UI  
- [ ] Sign-in works on partner subdomain  
- [ ] Listings create/edit works on partner subdomain  

---

# PHASE 3 — Wellness affiliate URLs (≈20 min)

**Goal:** Insurance + telehealth CTAs live in app (`/wellness`, ViT funnels, ID complete).

**Today:** Production API shows `ready: false` — URLs not set in Vercel yet.

## Phase 3 checklist

### 3.1 Get tracked links (before env)

You need **affiliate dashboard URLs** with your tracking ID:

| Partner type | Examples | Where to get link |
|--------------|----------|-------------------|
| **Insurance** | Lemonade, Embrace, Pets Best | Impact.com, partner dashboard, or direct affiliate program |
| **Telehealth** | Holistic vet telehealth | Partner affiliate / booking program |

**Until affiliate approved:** use a **placeholder** that goes to your chosen partner’s **public quote page** (no commission) OR leave disabled until Impact approves.

### 3.2 Add to `.env.local` (local test)

Edit `.env.local` — paste your real URLs:

```bash
# Insurance
NEXT_PUBLIC_FP_INSURANCE_ENABLED=true
NEXT_PUBLIC_FP_INSURANCE_PARTNER_NAME=Lemonade Pet Insurance
NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL=https://YOUR-TRACKED-QUOTE-URL
NEXT_PUBLIC_FP_INSURANCE_LOST_DOG_URL=https://YOUR-TRACKED-URL
NEXT_PUBLIC_FP_INSURANCE_URGENT_URL=https://YOUR-TRACKED-URL

# Telehealth
NEXT_PUBLIC_FP_TELEHEALTH_ENABLED=true
NEXT_PUBLIC_FP_TELEHEALTH_PARTNER_NAME=Your Telehealth Partner Name
NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL=https://YOUR-TRACKED-BOOKING-URL
NEXT_PUBLIC_FP_TELEHEALTH_FOCUS=Holistic and integrative veterinarians aligned with Freedom Paws protocols.
```

### 3.3 Push to Vercel

```bash
npm run vercel:env:push
```

Or manually: Vercel → Project → **Settings** → **Environment Variables** → add each key → **Redeploy** `main`.

### 3.4 Verify

| Check | How |
|-------|-----|
| API | `https://app.freedompawsinc.com/api/wellness/config-status` → `ready: true` |
| Ops | `/ops/wellness` → all rows **OK** |
| App | `/wellness` → insurance + telehealth buttons work |
| ViT | Run a concern screen → wellness panel shows partner CTAs |

### Phase 3 pass criteria

- [ ] `insuranceQuoteUrl: true` in config-status API  
- [ ] `telehealthBookUrl: true` in config-status API  
- [ ] `/ops/wellness` shows **Configured**  
- [ ] Outbound links open correct partner URLs  

---

# Master tracker

| Phase | Task | Done? |
|:-----:|------|:-----:|
| **1** | Framer `/adopt` page created | ☐ |
| **1** | Primary CTA → `app.freedompawsinc.com/adopt/tn` | ☐ |
| **1** | Nav + footer wired | ☐ |
| **1** | iPhone test passed | ☐ |
| **2** | Vercel domain `shelter.freedompawsinc.com` added | ☐ |
| **2** | DNS CNAME `shelter` → Vercel | ☐ |
| **2** | Partner subdomain loads | ☐ |
| **3** | Insurance URL in Vercel env | ☐ |
| **3** | Telehealth URL in Vercel env | ☐ |
| **3** | `/ops/wellness` all OK | ☐ |
| **Email** | Namecheap Private Email: info@, partners@, shelter@ on iPhone + Mac Mail (IMAP) | ✅ July 12, 2026 |

---

# After all 3 phases

1. Archive FP Test Dog listing (if still live)  
2. Review **infrastructure complete** checklist in `/ops`  
3. **Then** consider partner onboarding (still manual email, no n8n until you activate)  

---

**Commands**

```bash
npm run ops:verify          # app + partner count
curl -s https://app.freedompawsinc.com/api/wellness/config-status | python3 -m json.tool
```
