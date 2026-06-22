# Track 2 — Microchip Scan Build Spec (Click-by-Click)

**Purpose:** Founder + engineering playbook for when chip readers ship.  
**Status:** Spec only — `/id/scan`, `/id/lookup`, `/id/kit` are placeholders today.  
**Prerequisite:** Track 1 live (enroll, found, match). Adoption infra Phases 1–3 complete.

**App URLs**

| Host | Use |
|------|-----|
| `https://app.freedompawsinc.com` | Owners, ops, scan MVP |
| `https://shelter.freedompawsinc.com` | Partner intake (future: scan at found intake) |

---

## Table of contents

1. [What we are building (MVP vs later)](#1-what-we-are-building-mvp-vs-later)
2. [Before scanners ship — founder checklist](#2-before-scanners-ship--founder-checklist)
3. [Day 1 — hardware validation (click by click)](#3-day-1--hardware-validation-click-by-click)
4. [Day 1 — log results for engineering](#4-day-1--log-results-for-engineering)
5. [Engineering build — 4 phases](#5-engineering-build--4-phases)
6. [Database migration spec](#6-database-migration-spec)
7. [API routes spec](#7-api-routes-spec)
8. [UI flows — click by click after build](#8-ui-flows--click-by-click-after-build)
9. [Registry lookup (Phase 2 — after MVP)](#9-registry-lookup-phase-2--after-mvp)
10. [Pass criteria & launch gates](#10-pass-criteria--launch-gates)
11. [Cursor session kickoff (copy-paste)](#11-cursor-session-kickoff-copy-paste)

---

## 1. What we are building (MVP vs later)

### MVP (build when scanners arrive) — ~1–2 Cursor sessions

| Item | Deliverable |
|------|-------------|
| **HID keyboard path** | Scanner “types” chip ID into `/id/scan` input — works with AVID wedge, many USB readers |
| **Manual paste path** | Same field — paste from reader app if no HID |
| **Chip validation** | Normalize 9 / 10 / 15 digit IDs; strip spaces; ISO checksum where applicable |
| **Link to pet** | Store on `pets` row + audit log; optional link from enroll wizard |
| **Shelter scan log** | `chip_scan_events` table — who scanned, when, raw + normalized ID |
| **Freedom Paws lookup** | If chip linked to enrolled pet → show “Freedom Paws ID match” (no owner PII on public) |

### Phase 2 (after MVP validates)

| Item | Deliverable |
|------|-------------|
| `/id/lookup` | AAHA embed or licensed API; AVID branch |
| Found intake | “Scan chip first” step on `/id/found` |
| BLE native | Only if HID path insufficient (PetScanner-style readers) |
| `/id/kit` | Waitlist → Token Shop SKU |

### Not in MVP

- Retail scanner kit checkout
- Owner PII from external registries
- Vet portal `/id/vet`

---

## 2. Before scanners ship — founder checklist

Do these **now** (no hardware needed).

### 2.1 AAHA outreach email

1. Open Mail → new message  
2. **To:** `petmicrochiplookup@aaha.org`  
3. **Subject:** `Freedom Paws ID — microchip lookup partnership inquiry (pilot)`  
4. Brief body: TN/CA shelter pilot, app at `app.freedompawsinc.com/id`, asking about embed/API terms for `/id/lookup`  
5. Send  

### 2.2 Confirm Track 1 works with Buddy

1. Safari → `https://app.freedompawsinc.com/id/enroll`  
2. Sign in → complete enroll for Buddy (or verify existing enrollment)  
3. Safari → `https://app.freedompawsinc.com/id` — hub loads  

### 2.3 Confirm scanner specs (before unboxing)

When order arrives, box should support **US shelter reality**:

- [ ] 125 kHz (legacy / AVID encrypted)
- [ ] 128 kHz (Trovan) — optional but preferred
- [ ] 134.2 kHz (ISO FDX-B)
- [ ] **Not** “ISO only” / “EU only” if you need legacy US chips

Reference: `docs/Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md`

---

## 3. Day 1 — hardware validation (click by click)

**Goal:** Learn how *your* reader outputs IDs before any code is written.

### 3A — HID keyboard wedge test (preferred MVP path)

**Needs:** Windows PC or Mac + reader with keyboard mode / AVID Reader Wedge

1. Open **TextEdit** (Mac) or **Notepad** (Windows)  
2. Click in empty document  
3. Scan a **known chip** (your dog at vet, or practice test tag)  
4. Watch what appears — write down:
   - Digit count (9, 10, or 15)
   - Prefix characters (letters? country code?)
   - Does it add **Enter** at the end?
   - Any prefix/suffix garbage (`%`, spaces, `N`)

**Pass:** Clean numeric string appears in Notepad when you scan.

### 3B — Reader app test (BLE / app-only readers)

**Example:** PetScanner Bluetooth (~$32)

1. Install vendor app (App Store / Play Store)  
2. Pair reader per vendor instructions  
3. Scan chip → app shows ID  
4. **Copy** ID to Notes  
5. Record format (often 15-digit ISO only)

**Note:** App-only readers need **Phase 2 BLE** or manual paste into Freedom Paws for MVP.

### 3C — Universal reader test (HomeAgain WorldScan / AKC QuickScan)

1. Power on reader  
2. Scan chip — read ID on device screen  
3. If USB/BT export to PC — repeat 3A in Notepad  
4. Record whether **AVID encrypted** chips decode (9–10 digit) or beep-only

---

## 4. Day 1 — log results for engineering

Fill this out and save (Notes or email yourself):

```
Scanner model: _______________________
Connection: [ ] HID keyboard  [ ] App copy-paste  [ ] USB export  [ ] BLE only
Sample chip ID (mask middle): 985___XXXXXX
Digit count: [ ] 9  [ ] 10  [ ] 15
Trailing Enter after scan: [ ] Yes  [ ] No
Reads AVID encrypted 125 kHz: [ ] Yes  [ ] No  [ ] Untested
Test date: ___________
```

Then start **Cursor build session** (Section 11).

---

## 5. Engineering build — 4 phases

### Phase T2-1 — Data layer

| Task | File(s) |
|------|---------|
| Migration `013_microchip_track2.sql` | `supabase/migrations/` |
| Chip normalize/validate helpers | `lib/id/chip-id.ts` |
| Types | `lib/id/chip-types.ts` |

### Phase T2-2 — API

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/id/chip/validate` | POST | Normalize + validate; no DB write |
| `/api/id/chip/link` | POST | Link chip to `pet_id` (owner auth) |
| `/api/id/chip/lookup` | GET | Freedom Paws internal match by chip |
| `/api/id/chip/scan-event` | POST | Shelter staff log scan (auth) |

### Phase T2-3 — UI

| Route | Replace |
|-------|---------|
| `/id/scan` | Replace `Track2Planned` with `ScanClient` — auto-focus input, HID capture, link pet dropdown |
| `/id/enroll` | Optional step: “Add microchip (optional)” after review |
| `/id` hub | Change scan card from `planned` → `live` |

### Phase T2-4 — Deploy

1. Run migration in Supabase SQL Editor  
2. `git push` → Vercel Ready  
3. Founder QA (Section 8)

---

## 6. Database migration spec

**File:** `supabase/migrations/013_microchip_track2.sql`

### 6.1 `pets` columns

```sql
alter table public.pets
  add column if not exists microchip_id text,
  add column if not exists microchip_id_normalized text,
  add column if not exists microchip_linked_at timestamptz;

create unique index if not exists pets_microchip_id_normalized_unique
  on public.pets (microchip_id_normalized)
  where microchip_id_normalized is not null;
```

### 6.2 `chip_scan_events` (audit + shelter intake)

```sql
create table if not exists public.chip_scan_events (
  id uuid primary key default gen_random_uuid(),
  scanner_user_id uuid references auth.users(id) on delete set null,
  shelter_id uuid references public.partner_orgs(id) on delete set null,
  raw_input text not null,
  normalized_id text,
  digit_count smallint,
  validation_status text not null check (validation_status in ('valid', 'invalid', 'checksum_fail')),
  freedom_paws_pet_id uuid references public.pets(id) on delete set null,
  source text not null default 'manual' check (source in ('hid', 'manual', 'ble')),
  created_at timestamptz not null default now()
);
```

RLS: authenticated insert own; `fp_ops` + shelter staff read per existing role patterns.

### 6.3 Normalization rules (app code)

| Input | Normalized |
|-------|------------|
| Strip spaces, dashes | `985 112 000 123 456` → `985112000123456` |
| 9-digit AVID legacy | Keep 9 digits |
| 10-digit Trovan/AVID | Keep 10 digits |
| 15-digit ISO | Validate ISO 11784/11785 checksum when 15 digits |
| Letters in string | Reject or strip per scanner QA log |

---

## 7. API routes spec

### POST `/api/id/chip/validate`

**Body:** `{ "raw": "985112000123456" }`  
**Response:**

```json
{
  "success": true,
  "normalized": "985112000123456",
  "digitCount": 15,
  "format": "iso_fdx_b",
  "checksumOk": true
}
```

### POST `/api/id/chip/link`

**Auth:** Required (owner)  
**Body:** `{ "petId": "uuid", "raw": "..." }`  
**Action:** Validate → update `pets.microchip_*` → audit log  
**Errors:** 409 if chip already linked to another pet

### GET `/api/id/chip/lookup?chip=985112000123456`

**Auth:** Authenticated shelter staff or fp_ops  
**Response:**

```json
{
  "success": true,
  "freedomPawsMatch": true,
  "petId": "uuid",
  "enrollmentId": "uuid",
  "publicCardSlug": "buddy-xxxxx",
  "ownerContactPolicy": "human_review_required"
}
```

**Never return** owner email/phone in this response — same policy as biometric match.

---

## 8. UI flows — click by click after build

### 8.1 Owner — link chip to enrolled pet

1. Safari → `https://app.freedompawsinc.com/id/scan`  
2. Sign in if prompted  
3. Click in **Scan or paste chip ID** field (auto-focused)  
4. **Option A:** Scan with HID reader (ID appears in field)  
5. **Option B:** Paste ID from reader app  
6. Tap **Validate** → green check + digit format shown  
7. Select pet **Buddy** from dropdown  
8. Tap **Link to pet**  
9. **Pass:** “Chip linked to Buddy” + link to `/id/settings`

### 8.2 Shelter — scan at intake (MVP: manual navigate)

1. `https://shelter.freedompawsinc.com/login?next=/partner` — sign in  
2. Open `https://app.freedompawsinc.com/id/scan` (same account)  
3. Scan chip → **Validate**  
4. If **Freedom Paws match** → note enrollment; open `/id/match` if also doing biometric  
5. If **no match** → proceed to `/id/found` for photo intake  

### 8.3 Regression — Track 1 still works

1. `/id/enroll` — new test pet enroll completes  
2. `/id/found` — intake returns candidates  
3. `/id/match` — review queue loads for ops email  

---

## 9. Registry lookup (Phase 2 — after MVP)

**Route:** `/id/lookup` (replace placeholder)

1. After validate on scan page → **Look up registry** button  
2. **AAHA path:** embed `petmicrochiplookup.org` or API if partnership approved  
3. Display: registry name + phone + URL — **no owner name/address in app**  
4. **AVID branch:** if prefix indicates AVID non-participant → show AVID contact + `avidid.com`  
5. Log lookup in `chip_scan_events` or `audit_log`

Until AAHA partnership: show link “Open AAHA Microchip Lookup” in new tab (external).

---

## 10. Pass criteria & launch gates

### MVP pass (founder QA)

| # | Test | Pass |
|---|------|:----:|
| 1 | HID scan fills `/id/scan` input | ☐ |
| 2 | Manual paste validates 15-digit ISO | ☐ |
| 3 | Link chip to Buddy — persists after refresh | ☐ |
| 4 | Second pet cannot steal same chip ID (409) | ☐ |
| 5 | Lookup finds Buddy by chip (staff auth) | ☐ |
| 6 | `/id` hub shows **Microchip scan** as **Live** | ☐ |
| 7 | Track 1 enroll/found/match unchanged | ☐ |

### Track 2 launch gate (Jan 2027 target)

- [ ] 3+ pilot shelters using scan + found intake  
- [ ] AAHA or external lookup UX approved by legal  
- [ ] Scanner kit retail SKU (optional)  

---

## 11. Cursor session kickoff (copy-paste)

When hardware QA log (Section 4) is complete, start a new Cursor chat:

```
Build Track 2 MVP microchip scan per docs/ops/TRACK-2-SCAN-BUILD-SPEC-CLICK-BY-CLICK.md

Scanner: [MODEL]
Connection: [HID keyboard / manual paste]
Sample format: [15-digit ISO / 10-digit AVID / etc.]

Implement:
- Migration 013_microchip_track2.sql
- lib/id/chip-id.ts validation
- API routes: validate, link, lookup, scan-event
- Replace app/id/scan/page.tsx with ScanClient (HID auto-focus input)
- Update /id hub scan card to live

Do not build BLE or AAHA API yet — external link only on lookup placeholder.
Match existing ID auth/audit patterns. Minimal diff.
```

---

## Quick reference

| Doc | Purpose |
|-----|---------|
| `docs/Freedom-Paws-ID-Track-2-Supplies-Shopping-Guide-June-2026.md` | Hardware shopping |
| `docs/Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md` §6 | Full Track 2 research |
| `docs/Freedom-Paws-ID-E2E-Found-Match-Runbook-June-13-2026.md` | Track 1 E2E |

---

*Freedom Paws ID is not a government pet license. Not veterinary advice. Registry lookup displays third-party contact info only — owner contact via human review, same as biometric match.*
