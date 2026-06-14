# Freedom Paws ID — Track 2 Supplies & Purchase Sources

**Document purpose:** Shopping list for microchip scanner hardware, test supplies, and registry outreach — accelerated Track 2 (Q3–Q4 2026).  
**Last updated:** June 14, 2026  
**Related:** `Freedom-Paws-Launch-Master-Checklist-June-2026.md` · `Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md` §6

**Important:** Phones **cannot** read implanted microchips (NFC is 13.56 MHz; chips are 125–134.2 kHz). You need a **hardware scanner** plus Freedom Paws `/id/scan` (engineering build).

---

## Table of contents

1. [What to buy first (recommended order)](#1-what-to-buy-first-recommended-order)
2. [Phase F1 — MVP dev kit (founder + 1 engineer)](#2-phase-f1--mvp-dev-kit-founder--1-engineer)
3. [Phase F2 — Pilot / shelter kit (2–5 units)](#3-phase-f2--pilot--shelter-kit-25-units)
4. [Product comparison with purchase links](#4-product-comparison-with-purchase-links)
5. [Non-purchase items (registry & software)](#5-non-purchase-items-registry--software)
6. [Specs checklist before you buy](#6-specs-checklist-before-you-buy)
7. [Budget summary](#7-budget-summary)
8. [After hardware arrives](#8-after-hardware-arrives)

---

## 1. What to buy first (recommended order)

| Priority | Item | Why | Est. cost |
|----------|------|-----|-----------|
| **1** | **1× universal LF scanner** (125 + 128 + 134.2 kHz, AVID decrypt) | Validates real US chips — not ISO-only | $200–$450 |
| **2** | **1× budget ISO scanner** (PetScanner BLE or Achip) | Fast iPhone testing; ISO FDX-B only | $32–$120 |
| **3** | **Test / practice tags** (not for implant) | QA without scanning live pets | $15–$40 |
| **4** | **PP3 9V batteries** (alkaline) | PetScanner BLE uses 9V | ~$8 |
| **5** | **USB-C OTG adapter** (if using cable Android reader) | Android cable scanners | ~$5–$15 |

**Freedom Paws recommendation for Track 2 MVP:** Buy **#1** (HomeAgain WorldScan Plus or AVID Power Tracker VI) for full US frequency coverage, **plus** **#2** (PetScanner Bluetooth ~$32) for quick mobile app experiments.

---

## 2. Phase F1 — MVP dev kit (founder + 1 engineer)

Minimum to start `/id/scan` HID keyboard integration and chip-on-profile storage.

| # | Supply | Qty | Source | URL / contact | Notes |
|---|--------|-----|--------|---------------|-------|
| 1 | **HomeAgain Universal WorldScan Plus** | 1 | Revival Animal Health | https://www.revivalanimal.com/product/homeagain-universal-worldscan-plus | Reads 125/128/134.2 kHz, FDX-A/B, Trovan, **AVID encrypted**, HDX; USB + Bluetooth; ~$400+ |
| 2 | **OR AVID Power Tracker VI** + Reader Wedge | 1 | AVID Identification Systems | https://avidid.com/products/power-tracker-vi | Multi-mode; RS-232 + **Avid Reader Wedge** (keyboard wedge for Windows); call **1-800-336-2843 opt 3** for pricing |
| 3 | **PetScanner Bluetooth** (budget ISO test) | 1 | PetScanner shop | https://shop.petscanner.com/products/petscanner-bluetooth | ~**$32 USD**; **15-digit ISO FDX-B only** — will **not** read legacy 9–10 digit AVID; uses PetScanner app (not HID into Freedom Paws yet) |
| 4 | **Achip Reader** (BLE + Animal ID app) | 1 (optional) | Animal ID store | https://store.animal-id.net/en/catalog/scanners-us/946 | ~**$119.99**; ISO 11784/11785; good reference for BLE integration patterns |
| 5 | **9V PP3 alkaline battery** | 2 | Amazon / hardware store | Search “9V alkaline battery” | PetScanner BLE; 5+ year shelf life recommended by vendor |
| 6 | **Practice RFID tags / test chips** | 1 pack | AKC Reunite store or vet supplier | https://apps.akcreunite.org/cares-pub/microchip/microchipProducts.car?catalogId=12000 | Look for **test tags** or **microchip training** products — **do not implant** |
| 7 | **Laptop (Windows)** for AVID Reader Wedge | — | Existing Mac + Parallels/Boot Camp OR borrow PC | — | AVID wedge software is **Windows**; use for HID-into-browser testing before BLE native integration |

**Engineering path:** HID keyboard wedge → paste chip ID into `/id/scan` input field (fastest Freedom Paws MVP).

---

## 3. Phase F2 — Pilot / shelter kit (2–5 units)

For CA/TN shelter pilot after MVP validates.

| # | Supply | Qty | Source | URL / contact | Notes |
|---|--------|-----|--------|---------------|-------|
| 1 | **AKC Reunite QuickScan 650** | 2–5 | AKC Reunite Microchip Store | https://apps.akcreunite.org/cares-pub/microchip/microchipProducts.car?catalogId=12000 | ~**$200** each; pocket; reads US frequencies |
| 2 | **OR AKC Reunite ProScan +TEMP** | 1–2 | Same | Same catalog | ~**$385**; temp-sensing chips; dual antenna |
| 3 | **HomeAgain WorldScan Plus** | 1–2 | Revival Animal Health | https://www.revivalanimal.com/product/homeagain-universal-worldscan-plus | Shelter-grade universal |
| 4 | **AVID MiniTracker 3 Wand** (optional) | 1 | AVID | https://avidid.com/products/13 | Through cage / distance reads; shelter intake |
| 5 | **Protective cases** | 1 per scanner | Included with pro models | — | Transport for field staff |
| 6 | **Freedom Paws branded kit insert** | Printed | Your printer / Canva | — | QR to `{APP}/id/scan` + setup steps |
| 7 | **Pilot subsidy budget** | 2 scanners/shelter @ 50% | Internal | — | Per master roadmap |

**Retail target for Freedom Paws Universal Scan Kit (future SKU):** $99–$149 — source OEM/BLE universal reader after pilot validates model.

---

## 4. Product comparison with purchase links

| Product | Price (approx.) | Frequencies | AVID encrypted 125 kHz | HID keyboard | BLE | Best for |
|---------|-----------------|-------------|------------------------|--------------|-----|----------|
| **PetScanner Bluetooth** | $32 | 134.2 ISO FDX-B | ❌ No | ❌ App only | ✅ | Cheap ISO testing; **not** full US legacy |
| **PetScanner Cable (USB-C)** | $14 | 134.2 ISO FDX-B | ❌ | ❌ App only | ❌ | Android OTG only |
| **Achip Reader** | $120 | 134.2 FDX-A/B/HDX | ❌ | ❌ App only | ✅ | BLE reference; 114 registry search in their app |
| **AKC QuickScan 650** | $200 | 125/128/134.2 | ✅ | ❌ | ❌ | Field pocket scanner |
| **AKC ProScan +TEMP** | $385 | Universal US | ✅ | ❌ | ❌ | Pro shelter / vet |
| **HomeAgain WorldScan Plus** | ~$400+ | 125/128/134.2 + encrypted | ✅ | Via USB export | ✅ | **Recommended F1 universal** |
| **AVID Power Tracker VI** | Call vendor | 125/128/134.2 | ✅ | ✅ Wedge (Win) | ❌ | **Recommended F1 if wedge OK** |
| **AVID MiniTracker 3** | Call vendor | Multi-mode | ✅ | Display only | ❌ | Portable display; wedge optional |

### Vendor home pages

| Vendor | URL | Phone |
|--------|-----|-------|
| AVID Identification Systems | https://avidid.com/products/13 | 1-800-336-2843 |
| PetScanner | https://petscanner.com | shop@petscanner.com (check site) |
| Animal ID (Achip) | https://store.animal-id.net | Site contact form |
| AKC Reunite (scanners) | https://apps.akcreunite.org/cares-pub/microchip/microchipProducts.car | AKC Reunite support |
| Revival Animal Health (HomeAgain reader) | https://www.revivalanimal.com | Customer service on site |
| Datamars / PetLink scanners | https://www.datamars.com | Enterprise — for later partnership |

---

## 5. Non-purchase items (registry & software)

| Item | Action | Contact / URL |
|------|--------|---------------|
| **AAHA Universal Lookup API** | Email for partnership / embed terms | petmicrochiplookup@aaha.org · https://petmicrochiplookup.org |
| **AVID registry branch** | Separate from AAHA — plan UI in `/id/lookup` | https://avidid.com |
| **Avid Reader Wedge software** | Free with Power Tracker VI | Download from AVID product page |
| **PetScanner app** | Free iOS/Android | App Store / Play Store — competitor reference only |
| **Freedom Paws `/id/scan` build** | Engineering | Cursor session after F1 hardware arrives |

---

## 6. Specs checklist before you buy

Before checkout, confirm listing includes:

- [ ] **125 kHz** (FDX-A / FECAVA / legacy US)
- [ ] **128 kHz** (Trovan)
- [ ] **134.2 kHz** (ISO FDX-B — majority of new implants)
- [ ] **AVID encrypted** decode (critical — many US pets)
- [ ] **HID keyboard mode** OR USB export you can wedge (for MVP)
- [ ] **Not** “ISO only” / “EU only” if you need legacy US chips

**Skip for Freedom Paws MVP:** NFC phone tags, QR collar tags only, 13.56 MHz readers.

---

## 7. Budget summary

| Phase | Items | Est. total |
|-------|-------|------------|
| **F1 dev kit** | 1 universal scanner + 1 budget PetScanner + batteries + test tags | **$450–550** |
| **F2 pilot (2 shelters × 2 scanners)** | 4× QuickScan 650 @ $200 | **~$800** (+ 50% subsidy = **~$400** founder cost if subsidized) |
| **Future retail kit** | OEM BLE universal @ volume | Target COGS **$40–70** → retail **$99–149** |

---

## 8. After hardware arrives

1. Scan a **known chip** (your dog, vet office, or test tag) — write down **9, 10, or 15 digit** format.  
2. Email engineering: scanner model + sample ID format (mask middle digits in email).  
3. Test **HID wedge** into a plain text field on laptop → confirms keyboard path for `/id/scan`.  
4. Log purchase in asset tracker (see `Photo-Booth-Phase-4-Real-Assets-June-2026.md` image log format — same idea for hardware).

**Order today (founder one-click list):**

1. HomeAgain WorldScan Plus — Revival Animal Health link above **OR** call AVID for Power Tracker VI + wedge  
2. PetScanner Bluetooth — $32 backup ISO tester  
3. 9V battery + test tag pack from AKC Reunite store  

---

*Freedom Paws Wellness — Honor Buddy's Legacy*
