# Freedom Paws — AI Credits & Photo Booth Pricing Strategy

**Document purpose:** How to cover Replicate/API costs, cap abuse, and stay competitive vs free apps.  
**Last updated:** June 2026  
**App:** https://app.freedompawsinc.com/photobooth  

---

## 1. Cost reality

| Feature | Your cost (approx.) |
|---------|---------------------|
| AI Magic Look (Replicate FLUX) | **$0.03–0.05 per image** |
| Magic cutout (imgly, on-device) | Low / bundled |
| Backgrounds, stickers, frames | ~$0 |
| ViT / OpenAI diagnostics | Separate API meter |

**Risk:** One user doing 100 costumes/hour ≈ **$3–5/hour** on your Replicate bill. Unlimited free AI is not sustainable.

---

## 2. Product strategy (recommended)

### Free forever (hook — competes with “free” filter apps)

- Upload photo  
- Magic cutout  
- All backgrounds & holiday themes (canvas-drawn)  
- Accessories, frames, print headline  
- Share / Save  

### Metered (paid API)

- **AI Magic Look** costumes  
- Future: premium ViT runs, advanced identity analysis  

### Your moat (not “free unlimited AI”)

- Holistic **protocols** + My Pets vault  
- ViT diagnostics path → Freedom Paws ID  
- Veterans, shelters, give-back mission  
- Member community & Safe Picks  

---

## 3. Allowance tiers (implemented in app — migration 008)

| Tier | Who | Monthly AI looks | Daily cap |
|------|-----|------------------|-----------|
| **guest** | Anonymous (device id) | 3 | 5 |
| **free** | Signed-in user | 5 | 10 |
| **member** | Paid membership (future) | 20 | 10 |
| **founding** | Founding waitlist / pilot (manual) | 30 | 10 |

**Rate limit:** 25 seconds between AI costume requests (stops rapid-fire loops).

Tune via Vercel env vars (see `.env.example`).

---

## 4. Top-up packs (Stripe — coming soon)

| Pack | Retail | Your API cost | Notes |
|------|--------|---------------|-------|
| 10 AI Looks | $2.99 | ~$0.40 | Impulse buy |
| 30 AI Looks | $6.99 | ~$1.20 | Best value badge |
| 100 AI Looks | $14.99 | ~$4.00 | Power users |

**Database ready:** `ai_credit_pack_purchases` table — wire Stripe webhook to `ai_credits_grant()`.

---

## 5. Membership bundle (align with Token Shop / founding)

**Freedom Paws Wellness Member** (example $18/mo):

- 20 AI looks/month included  
- Full ViT history, vault, protocols  
- Rollover: optional (use-it-or-lose-it is simpler for cost control)  

When Stripe membership ships: set `ai_credit_accounts.tier = 'member'` and `monthly_allowance = 20`.

---

## 6. Technical implementation (shipped)

| Piece | Location |
|-------|----------|
| Supabase migration | `supabase/migrations/008_ai_credits.sql` |
| Server gate (before Replicate) | `app/api/photobooth/ai-costume/route.ts` |
| Balance API | `GET /api/photobooth/ai-credits` |
| Guest id (device) | `lib/photobooth/guest-session.ts` → header `x-fp-guest-id` |
| Refund on failed AI | `ai_credits_refund_magic_look()` |
| UI | Photo Booth drawer shows “X looks left” |

### Founder action required

1. Open **Supabase → SQL Editor**  
2. Run **`supabase/migrations/008_ai_credits.sql`** (after 001–007)  
3. Confirm **`SUPABASE_SERVICE_ROLE_KEY`** is set in **Vercel** (server only)  
4. Set **Replicate billing cap** at replicate.com/account/billing  

---

## 7. Abuse controls (all recommended — in code)

- [x] Check Supabase credits **before** calling Replicate  
- [x] Daily cap per account  
- [x] Minimum seconds between requests  
- [x] Refund credit if generation fails after charge  
- [ ] Stripe pack purchase (next sprint)  
- [ ] Sign-in bonus (merge guest → user account on login)  
- [ ] Admin grant credits for pilots / influencers  

---

## 8. Replicate billing (your account)

Separate from **user credits**:

- Add payment method + **monthly spend limit** in Replicate dashboard  
- 402 errors = **your** Replicate balance empty (not user allowance)  
- App shows friendly message; user credits are not consumed on server-side Replicate failure after refund  

---

## 9. Messaging (member-friendly)

**When out of credits:**

> “You’ve used your free AI looks this month. Backgrounds, cutout, and accessories are still unlimited! Join Freedom Paws or buy a look pack (coming soon).”

**Never** block the free Photo Booth — only AI Magic Look.

---

## 10. Next build steps (engineering)

1. Stripe checkout for `pack_10` / `pack_30` / `pack_100`  
2. Webhook → `ai_credits_grant(account_id, amount, 'pack_purchase')`  
3. On Supabase login: merge guest account credits into user account  
4. Admin UI or SQL to set `tier = 'founding'` for waitlist emails  
5. Optional: meter ViT `/api/analyze` the same way  

---

## 11. Checklist — go live with credits

- [ ] Run migration 008 in Supabase production  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in Vercel Production  
- [ ] Deploy app (PWA v65+)  
- [ ] Test: 4th costume in month → blocked with friendly message  
- [ ] Replicate billing funded + cap set  
- [ ] Announce in waitlist email: “3 free AI looks/month; unlimited everything else”  

---

*Freedom Paws Wellness · Internal strategy · Revise after first month of usage data*
