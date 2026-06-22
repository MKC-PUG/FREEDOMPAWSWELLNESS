# Freedom Paws ID — Track 2 Retail Scanner Kit Plan

**Document date:** June 20, 2026  
**Prepared for:** Founder / ops  
**Status:** Planning — hardware validating; retail SKU ships after pilot (target Jan 1, 2027)  
**Your dev order (in transit):** HomeAgain WorldScan Plus · PetScanner Bluetooth · sample test token  

**Related:** `docs/ops/TRACK-2-SCAN-BUILD-SPEC-CLICK-BY-CLICK.md` · `docs/Freedom-Paws-ID-Cost-Scanner-DAO-Report-MASTER-FINAL-June-10-2026.md`

---

## 1. Executive summary

| Question | Answer |
|----------|--------|
| **What is the retail kit?** | Branded **Freedom Paws Universal Scan Kit** — LF RFID hardware + onboarding materials + **our app** at `/id/scan` |
| **Who buys?** | **Most units donated to shelters** (~80%). Vets/rescues: subsidy. **~5%** full retail via Token Shop. |
| **Affiliate?** | **No.** We buy OEM hardware, brand, **fulfill ourselves**. Software is **100% Freedom Paws**. |
| **Retail price (recommended)** | **$129** |
| **Launch COGS target** | **~$85/unit** at 200+ volume |
| **Your order today** | **Dev/QA only** — not the retail SKU |

---

## 2. Who buys scanner kits

| Buyer | Typical qty | Channel |
|-------|-------------|---------|
| **TN/CA municipal shelters & rescues** | 2 free + optional 3rd | Donation / 50% subsidy |
| **Private rescues** | 1–2 | Subsidy or retail |
| **Veterinary clinics** | 1–3 | Subsidy or retail |
| **Mobile vets / groomers** | 1 | Retail ($129) |
| **Advanced owners** | 1 | Token Shop retail |

**Most pet owners do not buy kits** — they use phone-camera biometric enroll (Track 1).

**Free kit eligibility:** signed shelter DPA, pilot partner, staff trained on `/id/scan` + `/id/found`, **2 free scanners** per qualifying partner.

---

## 3. What is in each retail kit (bill of materials)

**Product name:** Freedom Paws Universal Scan Kit

| # | Item | Purpose |
|---|------|---------|
| 1 | Universal LF RFID scanner (125/128/134.2 kHz, AVID decrypt) | Read implanted chips |
| 2 | USB charging cable | Power / PC link |
| 3 | Power (rechargeable or 9V — one standard per SKU) | Field use |
| 4 | Protective pouch | Transport |
| 5 | Printed quick-start guide | Power → scan → open app |
| 6 | Branded box + sleeve | Freedom Paws branding |
| 7 | QR card → `app.freedompawsinc.com/id/scan` | Onboarding |
| 8 | Registry reference card | AAHA + AVID note |
| 9 | Warranty card | `partners@freedompawsinc.com` · 90-day RMA |

**Not in retail box:** practice test token (founder QA only), laptop, microchip implant.

---

## 4. Individual item costs

### Launch kit COGS (~$85 at volume)

| Component | Launch $ | Pilot batch $ |
|-----------|----------|---------------|
| OEM universal LF reader | $62 | $95 |
| USB cable | $3 | $4 |
| Battery / power | $4 | $5 |
| Protective pouch | $5 | $6 |
| Printed guides + cards | $4 | $5 |
| Branded box / sleeve | $6 | $8 |
| QR card | $2 | $2 |
| Freight (allocated) | $6 | $10 |
| RMA reserve (5%) | $5 | — |
| **Total COGS** | **~$85** | **~$120** |

### Your founder dev kit (ordered Jun 2026 — NOT retail COGS)

| Item | Qty | Est. cost |
|------|-----|-----------|
| HomeAgain WorldScan Plus | 1 | ~$400–450 |
| PetScanner Bluetooth | 1 | ~$32 |
| Sample test token | 1 | ~$15–40 |
| 9V battery (PetScanner) | 1 | ~$8 |
| **Dev total** | | **~$455–530** |

### Retail margin (sold units)

| Price | COGS | Profit | Margin |
|-------|------|--------|--------|
| $99 promo | $85 | $14 | 14% |
| **$129 recommended** | $85 | **$44** | **34%** |
| $149 vet bundle | $85 | $64 | 43% |

---

## 5. Dev hardware vs retail SKU

| | Your order (Jun 2026) | Retail kit (2027) |
|---|----------------------|-------------------|
| Scanner | WorldScan + PetScanner | OEM @ ~$62 COGS |
| Purpose | Spec QA + parser dev | Ship to shelters at scale |
| Software | Freedom Paws `/id/scan` | Same — **our software** |
| Sell? | **No** — lab devices | **Yes** — Token Shop |

We will **not** repackage $400 WorldScan units as the $129 retail kit. Retail uses volume OEM after WorldScan validates specs.

---

## 6. Software — ours, not affiliate

| Layer | Owner |
|-------|-------|
| `/id/scan`, enroll, match, shelter portal | **Freedom Paws** (Next.js + Supabase) |
| PetScanner app | Third party — **reference only**, not shipped |
| AAHA lookup | Third party — link/embed; partnership TBD |
| AVID registry | Third party — separate branch in `/id/lookup` |

Customers use **Freedom Paws app** after scanning. External registry = browser link with clear attribution.

---

## 7. Fulfillment — we ship, not affiliate

| Model | Freedom Paws |
|-------|--------------|
| Amazon / Revival affiliate links | **No** |
| OEM purchase + Freedom Paws label + we ship | **Yes** |
| Token Shop SKU `FP-SCAN-KIT-001` | **Yes** (Jan 2027) |
| Shelter donation ($0) | **Yes** — mission COGS from Token Shop + affiliate net |

Domestic shipping est. **$8–12/kit** (donations: mission budget; retail: added at checkout).

---

## 8. Monthly quantity plan — Jun 2026 → Jun 2027

| Month | Donation | Subsidy | Retail | **Total** | Notes |
|-------|----------|---------|--------|-----------|-------|
| Jun 2026 | 0 | 0 | 0 | **0** | Dev hardware QA |
| Jul–Sep 2026 | 0 | 0 | 0 | **0** | Build `/id/scan` |
| Oct 2026 | 2 | 0 | 0 | **2** | Internal dev |
| Nov 2026 | 12 | 2 | 0 | **14** | TN shelter donations |
| Dec 2026 | 18 | 4 | 2 | **24** | Chip module complete |
| Jan 2027 | 60 | 12 | 6 | **78** | **Promotion launch** |
| Feb 2027 | 24 | 6 | 2 | **32** | |
| Mar 2027 | 20 | 4 | 1 | **25** | |
| Apr 2027 | 16 | 3 | 0 | **19** | |
| May 2027 | 14 | 2 | 0 | **16** | |
| Jun 2027 | 12 | 2 | 0 | **14** | Steady state |
| **Year 1** | **178** | **35** | **11** | **224** | ~232 master plan |

### Buy-ahead inventory

| Tranche | When | Qty | Cash |
|---------|------|-----|------|
| Dev/QA | Jun 2026 ✓ | 2 + token | ~$500 |
| Pilot | Oct 2026 | 30 | ~$3,600 |
| Launch | Dec 2026 | 200 | ~$17,000 |
| Reorder | Mar 2027 | 50 | ~$4,250 |

---

## 9. Year 1 economics (mission-first)

| Channel | Units | Revenue | COGS | Net |
|---------|-------|---------|------|-----|
| Donation | 178 | $0 | $15,664 | −$15,664 |
| 50% subsidy | 35 | $2,258 | $3,080 | −$822 |
| Retail | 11 | $1,419 | $968 | +$451 |
| **Total** | **224** | **$3,677** | **$19,712** | **−$16,035** |

Scanners = **mission CAC** (enrollments, reunions, shelter lock-in), not standalone profit.

---

## 10. Your hardware — click by click when it arrives

1. Charge **WorldScan**; install **PetScanner** 9V  
2. Label: **FP-DEV-WS-01**, **FP-DEV-PS-01**  
3. Scan **test token** with WorldScan → log digit count (9/10/15)  
4. Repeat in **PetScanner app** (ISO expected)  
5. **TextEdit test:** scan into plain text if HID/export works  
6. Log results → start Track 2 build (`docs/ops/TRACK-2-SCAN-BUILD-SPEC-CLICK-BY-CLICK.md`)  

**Do not:** resell WorldScan as Freedom Paws kit; implant test token; ship PetScanner app to customers.

---

## 11. Shelter quick-start (printed in box)

1. Power on scanner → scan chip  
2. Open **`app.freedompawsinc.com/id/scan`**  
3. Lookup → Freedom Paws match or AAHA link → if none, **`/id/found`** photo intake  

Support: **partners@freedompawsinc.com**

---

## 12. Pending decisions

| Decision | Recommendation |
|----------|----------------|
| Retail price | **$129** |
| OEM after WorldScan QA | BLE + 125 kHz + AVID @ ≤$70 |
| Donation cap Y1 | 120 free then subsidy only |
| Token Shop SKU live | Jan 1, 2027 |
| AAHA | External link MVP; embed after partnership |

---

*Freedom Paws ID — June 20, 2026. Not veterinary advice. Phones cannot read implanted chips without LF hardware.*
