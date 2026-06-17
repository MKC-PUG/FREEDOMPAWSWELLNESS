# Freedom Paws Adoption Network — Tennessee Pilot Spec

**Status:** Founder approved — May 29, 2026  
**Program name:** Freedom Paws Adoption Network  
**Public directory:** `https://app.freedompawsinc.com/adopt/tn` (canonical live inventory). Framer `/adopt` = marketing landing + CTA only.  
**Partner app entry:** `https://shelter.freedompawsinc.com` (same codebase, role-based shell — build pending)  
**Consumer app:** `https://app.freedompawsinc.com` (unchanged)

**Pilot geography:** Tennessee first; schema and URLs designed **nationwide from day 1**.

---

## Table of contents

1. [Approved pilot partners (6)](#1-approved-pilot-partners-6)
2. [Partner types & outreach order](#2-partner-types--outreach-order)
3. [Product scope for pilot](#3-product-scope-for-pilot)
4. [Listing record (required fields)](#4-listing-record-required-fields)
5. [Listing status protocol](#5-listing-status-protocol)
6. [Breed list (approved)](#6-breed-list-approved)
7. [Freedom Paws ID enroll (approved policy)](#7-freedom-paws-id-enroll-approved-policy)
8. [Partner roles (one bucket)](#8-partner-roles-one-bucket)
9. [What partners see vs hide](#9-what-partners-see-vs-hide)
10. [Hardware — chip scanners (approved)](#10-hardware--chip-scanners-approved)
11. [Success metrics (TN pilot)](#11-success-metrics-tn-pilot)
12. [Phase after pilot](#12-phase-after-pilot)
13. [Engineering build order (when approved)](#13-engineering-build-order-when-approved)
14. [Outreach kit checklist](#14-outreach-kit-checklist)

---

## 1. Approved pilot partners (6)

### Municipal / government track (3) — lead outreach here first

| # | Official name | Jurisdiction | Website | Notes |
|---|---------------|--------------|---------|-------|
| M1 | **Memphis Animal Services (MAS)** | City of Memphis / Shelby County open intake | [memphisanimalservices.com](https://memphisanimalservices.com) | Municipal; ~8,000–10,000 animals/year |
| M2 | **Metro Animal Care and Control (MACC)** | Nashville-Davidson County | [nashville.gov/.../animal-care-and-control](https://www.nashville.gov/departments/health/animal-care-and-control) | `.gov` credibility |
| M3 | **Young-Williams Animal Center** (Young-Williams Animal Services) | Knoxville + Knox County | [young-williams.org](https://www.young-williams.org) | Municipal contractor 501(c)(3); ~11,000 intakes/year |

### Private no-kill track (3) — closest to Lebanon, TN

| # | Official name | Location | Distance from Lebanon | Website | Phone |
|---|---------------|----------|----------------------|---------|-------|
| P1 | **New Leash on Life** (Humane Association of Wilson County) | Lebanon, TN | 0 mi | [newleashonline.org](https://www.newleashonline.org) | (615) 444-1144 |
| P2 | **Humane Society of Sumner County** | Hendersonville, TN | ~20 mi N | [sumnerhumane.org](https://www.sumnerhumane.org) | via site |
| P3 | **Safe Place for Animals (SPA)** | Gallatin, TN | ~14 mi N | [safeplaceforanimals.com](https://safeplaceforanimals.com) | via site |

**All six:** No Kill Verified or equivalent private adoption program where noted in research doc session.

**Not pilot (Phase 2):** Old Friends Senior Dog Sanctuary (Mount Juliet — senior specialty), county shelters (Williamson, Rutherford, etc.).

---

## 2. Partner types & outreach order

```
Phase A — Municipal (M1 → M2 → M3)
    ↓ credibility
Phase B — Private Lebanon corridor (P1 → P2 → P3)
    ↓ listing volume
Phase C — County shelters statewide
    ↓
Phase D — National state-by-state directory (/adopt/[state])
```

**Sales narrative:** *“Three Tennessee metro municipal systems plus three leading private shelters in the Lebanon corridor — one network, one database.”*

---

## 3. Product scope for pilot

| Feature | Partner (`shelter.freedompawsinc.com`) | Public (`freedompawsinc.com/adopt/tn`) |
|---------|----------------------------------------|----------------------------------------|
| Adoption Studio (Photo Booth mode) | ✅ Marketing photos, frames, share packs | — |
| Adoption listing CRUD | ✅ Draft → publish | ✅ Read-only directory |
| Breed + bio + photos | ✅ Required | ✅ Filter/search |
| Pending badge | ✅ | ✅ “Pending adoption” visible |
| Found dog intake + ID match | ✅ (existing `/id/found`, `/id/match`) | — |
| Biometric ID enroll prompt | Optional for adopters | — |
| Chip scan (HID then BLE) | ✅ Track 2 | — |
| Token Shop / insurance / affiliates | ❌ Hidden | ❌ |

---

## 4. Listing record (required fields)

| Field | Required | Notes |
|-------|----------|-------|
| Display name | Yes | |
| **Breed (primary)** | **Yes** | Curated dropdown — see §6 |
| Breed (secondary) | If mixed | |
| Sex | Yes | M / F / unknown |
| Age band | Yes | Puppy / young / adult / senior / unknown |
| Size | Recommended | S / M / L / XL |
| Photos | Yes (min 1) | From Adoption Studio |
| Bio | Yes | Staff-written |
| Status | Yes | See §5 |
| Shelter org ID | Yes | Links to partner profile |
| Freedom Paws ID | No | Optional — see §7 |

**Public URL pattern (target):**  
`freedompawsinc.com/adopt/tn/[shelter-slug]/[listing-slug]`

---

## 5. Listing status protocol

| Status | Public on directory? | Badge |
|--------|----------------------|-------|
| Draft | No | — |
| Available | Yes | — or “Available” |
| **Pending** | **Yes** | **“Pending adoption”** (amber) |
| Adopted | No | Remove within **72 hours** |
| Archived | No | — |

**Shelter rules (onboarding agreement):**

- Only `shelter_admin` marks **Adopted** (reduces volunteer error).
- Email reminder at 24h and 72h if still Available after reported adoption.
- Weekly digest: listings Available &gt; 14 days (stale check).
- FP ops may pause partner badge if &gt;10% listings stale &gt;30 days.

---

## 6. Breed list (approved)

**Curated ~50–60 breeds + Mixed breed + Unknown** (not full AKC, not free text only).

Examples: Labrador, Pit Bull / Staffordshire-type, German Shepherd, Chihuahua, Beagle, Husky, Boxer, Terrier (generic), Bulldog, Australian Shepherd, etc.

- Primary breed required on every listing.
- Secondary breed field when primary = **Mixed breed**.

---

## 7. Freedom Paws ID enroll (approved policy)

| Moment | Enroll required? |
|--------|------------------|
| Shelter publishes adoption listing | **No** |
| After publish | Soft prompt for staff to mention ID to adopters |
| **At adoption handoff** | **Strong prompt** for new owner (email/QR) |
| Found-dog intake | Separate path — identity match queue |

---

## 8. Partner roles (one bucket)

All municipal, county, and private partners use the same role ladder:

| Role | Access |
|------|--------|
| `shelter_staff` | Intake, Adoption Studio, listing draft |
| `shelter_admin` | Above + publish, mark adopted, staff |
| `fp_ops` | Audit, partner onboarding, suspend |

Org record fields (target): name, `state`, city, county, `org_type` (municipal | county | private), public slug, listing enabled.

---

## 9. What partners see vs hide

**Show:** Found intake, match review (admin), Adoption Studio, listings admin, chip scan (when live), shelter dashboard.

**Hide:** Token Shop, Xaman, protocol shop, insurance/telehealth affiliates, ViT protocol buy funnel, Discord/waitlist promos.

**ViT in partner mode:** Identity/intake quality only — not wellness protocol recommendations on government devices.

---

## 10. Hardware — chip scanners (approved)

| Order | Type | Use case |
|-------|------|----------|
| 1 | **HID keyboard-mode** | Desk intake — ship first |
| 2 | **Bluetooth LF reader** | Mobile animal control — ship second |

Same `/id/scan` screen; input method differs.

---

## 11. Success metrics (TN pilot)

| Metric | Target |
|--------|--------|
| Partners live | 6 |
| Live listings (peak) | 40–80 across partners |
| Median time photo → published | &lt; 48 hours |
| Adopted marked within 72h | 100% KPI |
| Documented reunion or high-confidence match | ≥ 1 story |

---

## 12. Phase after pilot

- County shelters (Williamson, Rutherford, Robertson, etc.)
- Open `/adopt/[state]` beyond TN
- Optional: Old Friends Senior Dog Sanctuary (senior specialty listings)
- Sync notes to Petfinder (manual v1)

---

## 13. Engineering build order (when approved)

1. Partner org schema + TN seed rows (6 partners)
2. `shelter.freedompawsinc.com` — role-based nav + dashboard landing
3. Adoption listing API + status workflow
4. Adoption Studio mode (Photo Booth subset)
5. Public `/adopt/tn` directory pages on Framer or app SSR
6. Wire existing `/id/found` + `/id/match` under partner shell

**Phase 1 shipped (PWA v75):** migration `009_partner_orgs_tn_pilot.sql`, `/partner` dashboard, `shelter.freedompawsinc.com` host detection, partner navbar/footer, `GET /api/partner/orgs`.

**Phase 2 shipped (PWA v76):** migration `010_adoption_listings.sql`, adoption listing CRUD API (`/api/partner/listings`, photo upload), partner listing UI (`/partner/listings`), public TN directory (`/adopt/tn`, `/adopt/tn/[shelterSlug]`, `/adopt/tn/[shelterSlug]/[listingSlug]`). Status workflow: staff drafts; shelter admin publishes (`available` / `pending` / `adopted` / `archived`). Pending listings public with badge.

### Public URL routing (founder approved deploy)

| Surface | URL | Role |
|---------|-----|------|
| **Live directory (canonical)** | `https://app.freedompawsinc.com/adopt/tn` | SSR from Supabase — updates when partners publish |
| **Framer marketing** | `https://freedompawsinc.com/adopt` | Story, mission, pilot partners — **CTA button → app directory** |
| **Partner portal** | `https://shelter.freedompawsinc.com/partner` | Intake + listings (same Next.js deploy) |

**Why not Framer for live listings?** Inventory is dynamic (status, photos, pending badges). Framer is static marketing — same split as Token Shop (Framer story → app checkout). One database, one truth.

**Framer wiring:** Add `/adopt` page with hero copy + button `Browse adoptable dogs` → `https://app.freedompawsinc.com/adopt/tn` (New tab: **OFF**). Optional second link on `/shelters` page.

---

## 14. Outreach kit checklist

- [ ] One-pager: Freedom Paws Adoption Network + ID reunion
- [ ] LOI / pilot MOU template (listing accuracy §5)
- [ ] Municipal deck (MAS, MACC, Young-Williams)
- [ ] Private deck (NLOL, HSSC, SPA) — Lebanon corridor angle
- [ ] Demo script: Adoption Studio → listing → `freedompawsinc.com/adopt/tn`
- [ ] FP ops: create org rows + `shelter_admin` accounts on sign-up

**Related docs:**  
`Freedom-Paws-Website-Post-Launch-Completion-Report-May-2026.md` ·  
`Freedom-Paws-ID-Shelter-Onboarding-June-2026.md` ·  
`Framer-Phone-Layout-Inspection-and-Gotchas-June-2026.md` §6 (agent lexicon)

---

*Freedom Paws Wellness — Honor Buddy's Legacy*  
*Tennessee Adoption Network pilot — founder approved May 29, 2026*
