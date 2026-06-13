# Freedom Paws Wellness Partners Module — June 2026

Infrastructure for **insurance affiliate** and **holistic telehealth** partner modules, aligned with the Freedom Paws wellness-first positioning: prevention, non-toxic nutrition, lifestyle protocols, and education — **not** pharmaceutical veterinary care. When triage is indicated, we refer to licensed veterinarians.

---

## Philosophy (product copy baseline)

| We are | We are not |
|--------|------------|
| Holistic wellness education | A veterinary clinic |
| 10 tokenized protocols + ViT guidance | Prescribers of pharmaceutical drugs |
| Referral to licensed vets when urgent | Emergency medical providers |
| Affiliate links for insurance & telehealth | Insurers or telehealth providers ourselves |

**Telehealth focus:** Start with **holistic / integrative** veterinarians — lifestyle, nutrition, natural wellness — aligned with our protocols.

**Insurance focus:** Close the financial gap for members in urgent times — lost-dog coverage, emergency vet bills — via affiliate partners.

---

## Funnel architecture

```mermaid
flowchart TD
  ViT[ViT Diagnostics] -->|urgent / high concern| Panel[WellnessPartnerPanel]
  ViT -->|prevention| Panel
  Panel -->|showIdEnroll| ID[/id/enroll]
  Panel -->|affiliate| Ins[Insurance partner URL]
  Panel -->|referral| Tel[Holistic telehealth URL]
  ID -->|step 9 complete| Panel2[id_enroll_complete panel]
  Hub[/wellness] --> Panel3[Education + partners]
  MyPets[/mypets] --> Panel4[my_pets panel]
```

### ViT context mapping

| Condition | Context | ID enroll CTA |
|-----------|---------|---------------|
| `vetUrgent === true` | `vit_urgent` | Yes |
| Primary match ≥ 72% | `vit_concern` | Yes |
| Otherwise | `vit_prevention` | No (partners still shown) |

---

## File map

| Path | Role |
|------|------|
| `lib/wellness/types.ts` | Types for partners & funnel contexts |
| `lib/wellness/partners.ts` | Env config, funnel copy, `vitResultToWellnessContext()` |
| `lib/wellness/config-status.ts` | Setup diagnostics |
| `app/api/wellness/partners/route.ts` | Public partner config (client panels) |
| `app/api/wellness/config-status/route.ts` | Admin/setup status JSON |
| `app/components/wellness/WellnessPartnerPanel.tsx` | Reusable CTA panel |
| `app/wellness/page.tsx` | Wellness hub — education + partners |

### Integration surfaces

- **Navbar** — `WELLNESS` → `/wellness`
- **Homepage** — Wellness Partners card
- **ViT results** — `ViTResultsPanel` after analysis
- **ID enroll step 9** — post-enrollment partner CTAs
- **ID hub** — Wellness Partners card
- **My Pets** — quick link + panel

---

## Environment variables

Add to `.env.local`, then push production:

```bash
npm run vercel:env:push
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_FP_INSURANCE_ENABLED` | No | `true` / `false` (auto-on if quote URL set) |
| `NEXT_PUBLIC_FP_INSURANCE_PARTNER_NAME` | No | Display name |
| `NEXT_PUBLIC_FP_INSURANCE_QUOTE_URL` | For insurance | General quote affiliate link |
| `NEXT_PUBLIC_FP_INSURANCE_LOST_DOG_URL` | No | Lost-dog / ID completion funnel (falls back to quote) |
| `NEXT_PUBLIC_FP_INSURANCE_URGENT_URL` | No | ViT urgent funnel (falls back to quote) |
| `NEXT_PUBLIC_FP_TELEHEALTH_ENABLED` | No | `true` / `false` (auto-on if book URL set) |
| `NEXT_PUBLIC_FP_TELEHEALTH_PARTNER_NAME` | No | Display name |
| `NEXT_PUBLIC_FP_TELEHEALTH_BOOK_URL` | For telehealth | Booking affiliate link |
| `NEXT_PUBLIC_FP_TELEHEALTH_FOCUS` | No | Holistic focus note in UI |

**Verify:** `https://app.freedompawsinc.com/api/wellness/config-status`

---

## Affiliate onboarding checklist

### Insurance

1. Apply to pet insurance affiliate programs (e.g. Lemonade, Fetch, Embrace — compare commission & deep-link support).
2. Obtain **tracked URLs** for: general quote, lost-pet rider (if separate), urgent/emergency info page.
3. Add URLs to env; set `NEXT_PUBLIC_FP_INSURANCE_PARTNER_NAME`.
4. Confirm disclosure copy in panel matches partner FTC requirements.
5. Test ViT urgent flow → urgent URL; ID complete → lost-dog URL.

### Holistic telehealth

1. Partner with **integrative / holistic** vet telehealth (not generic urgent-care-only brands as primary).
2. Obtain booking URL with affiliate/ref parameter.
3. Set `NEXT_PUBLIC_FP_TELEHEALTH_FOCUS` to describe holistic alignment.
4. Legal review: telehealth is **guidance**, not emergency care — copy already in panel.

---

## Legal & compliance notes

- Outbound links use `rel="noopener noreferrer sponsored"`.
- Insurance disclosure: commission may be earned; coverage by insurer, not Freedom Paws.
- Telehealth disclosure: independent licensed providers; not a substitute for in-person emergency care.
- ViT urgent banner remains **seek licensed vet / in-person care** when appropriate.

---

## Related docs

- [Partner policies (affiliate standards)](./Freedom-Paws-Wellness-Partner-Policies-June-2026.md)
- [Freedom Paws Super-App Strategy (WeChat for dogs)](./Freedom-Paws-Super-App-WeChat-Strategy-June-2026.md)
- [Framer CTA Link Map](./Framer-CTA-Link-Map.md)
- [Freedom Paws ID Founder Review](./Freedom-Paws-ID-Founder-Review-June-2026.md)

---

*Last updated: June 2026 — Phase 1 wellness partners (insurance + telehealth)*
