# Freedom Paws Wellness — Patent & IP Follow-Up Guide

**Document purpose:** Printable follow-up after founder review of patent questions (diagnostics, symptom checker, AI format).  
**Last updated:** June 2026  
**Disclaimer:** This is **not legal advice**. Consult a licensed patent or IP attorney before filing or disclosing inventions publicly.

---

## Executive summary

| Question | Short answer |
|----------|--------------|
| Can we patent “AI pet symptom checker”? | **Unlikely** as a broad idea — crowded field, lots of prior art. |
| Can we patent **our specific implementation**? | **Maybe** — only if an attorney finds novel, non-obvious technical steps. |
| Best near-term protection? | **Trademark, copyright, trade secrets, terms of use**, and speed to market. |

---

## 1. What is usually NOT patentable

- The **concept** of “upload pet photo → AI suggests wellness protocols”
- Generic **symptom checkers** (human or pet) — WebMD, PetMD, vet telehealth apps, triage chatbots
- **Business methods** alone (“charge membership for AI advice”) after *Alice v. CLS Bank* (2014)
- **Obvious combinations** of known tools: vision model + symptom text + recommendation list

Patent examiners search **prior art** — anything public before your filing date (patents, apps, papers, websites).

---

## 2. What MIGHT be patentable (narrow technical inventions)

Only if **specific, new, and non-obvious** to someone skilled in the field:

| Possible angle | Example (hypothetical — attorney must verify) |
|----------------|-----------------------------------------------|
| Unique ViT pipeline | Specific way you combine vision embeddings + protocol mapping + confidence scoring |
| Dual-mode analyze | Your `wellness` + `identity` + region-based gait analysis workflow if no equivalent exists |
| Intake mirror / vault | Specific encrypted mirror + embedding sync architecture |
| Photo Booth + wellness funnel | Unlikely alone — marketing flow, not usually patentable |

A **utility patent** protects **how** something works, not the marketing idea.

---

## 3. Recommended IP stack (founder checklist)

### A. Trademark (brand)

- [ ] File **Freedom Paws Wellness**, **SuperBud**, logos with USPTO when budget allows
- [ ] Use ™ now; ® after registration
- [ ] Consistent use on app, Framer site, Photo Booth watermark

### B. Copyright (automatic)

- [ ] Protocol text, app code, images, help docs — you own on creation
- [ ] Keep **dates** in git commits and docs (already in this repo)

### C. Trade secrets

- [ ] Keep private: AI prompts, protocol weighting, partner deal terms, cost models
- [ ] Limit access via env vars and service role (never commit secrets)

### D. Terms & disclaimers (live in app)

- [ ] “Wellness education — not veterinary diagnosis or treatment”
- [ ] “Always consult a licensed veterinarian”
- [ ] Privacy policy for photos, ViT history, vault

---

## 4. Patent process (if attorney recommends)

| Step | Cost (typical) | Timeline |
|------|----------------|----------|
| **Prior art search** | $500–2,000 (attorney or search firm) | 1–2 weeks |
| **Consultation** | $200–400/hour | 1 hour may suffice for go/no-go |
| **Provisional patent** | ~$70–300 USPTO + $2k–5k attorney | 12-month placeholder |
| **Non-provisional (full)** | $10k–25k+ over years | 2–4 years examination |

**Provisional** = cheap way to lock a **priority date** while you decide on a full patent.

---

## 5. Prior art search — do this before spending

Search these terms (Google Patents, USPTO, PubMed):

- veterinary symptom checker AI  
- pet vision transformer diagnosis  
- animal telehealth triage app  
- dog lameness video gait analysis mobile  

Document what you find. If 10+ similar products exist, a **broad** patent is unlikely.

---

## 6. Freedom Paws — document YOUR invention (for attorney meeting)

Fill this in before a consult:

| Item | Your notes |
|------|------------|
| **First public use / launch date** | |
| **What is unique vs PetMD / vet apps?** | ViT + holistic protocols + ID roadmap + veteran/shelter mission |
| **Technical diagram** | ViT analyze → protocol slug → My Pets history → vault |
| **Secret sauce** | Prompts, lexicon, protocol mapping weights |
| **Open-source used** | Next.js, Supabase, Replicate, imgly cutout, etc. |

Bring: this doc, `docs/Freedom-Paws-ID-Complete-Master-Roadmap-June-2026.md`, and a 15-minute demo of `/diagnostics` + Photo Booth.

---

## 7. Questions to ask an IP attorney (one session)

1. Is our **ViT + protocol recommendation pipeline** novel enough for a provisional?  
2. Should we file provisional before **public marketing** push?  
3. Trademark vs patent budget — what first with ~$X?  
4. Any **freedom-to-operate** risk from Replicate / OpenAI / imgly licenses?  
5. Employee/contractor **IP assignment** — do we need a simple agreement?

---

## 8. Practical recommendation for Freedom Paws (June 2026)

1. **Do not delay launch** waiting for a patent.  
2. **Spend first** on trademark + terms + trade secret discipline.  
3. **Book one IP consult** before major Framer/public campaign.  
4. **Consider provisional** only if counsel sees a **narrow technical claim** (not “AI symptom checker for dogs”).  
5. Your **moat** = brand, protocols, community, vault, ID vision, give-back story — not a generic AI patent.

---

## 9. Resources

- USPTO beginner guide: https://www.uspto.gov/patents/basics  
- Google Patents: https://patents.google.com  
- USPTO trademark: https://www.uspto.gov/trademarks  

---

*Freedom Paws Wellness · Internal founder document · Not legal advice*
