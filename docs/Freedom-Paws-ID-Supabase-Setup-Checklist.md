# Freedom Paws ID — Supabase Setup Checklist (Steps 1–3)

**Use this to complete founder steps 1, 2, and 3 before the Oct 1 pilot.**

---

## Status check (after each step)

**Local:** `http://localhost:3000/api/id/config-status`  
**Production:** `https://app.freedompawsinc.com/api/id/config-status` (after deploy)

Target JSON:

```json
{
  "supabaseReady": true,
  "readyForEnroll": true,
  "readyForMatchEmail": true
}
```

---

## Fast path — one command (recommended)

In your terminal from the project folder:

```bash
npm run id:setup
```

Paste when prompted: Supabase URL, anon key, service role key, **database connection URI**, and your email for `FP_OPS_EMAILS`.

Optional: [Supabase access token](https://supabase.com/dashboard/account/tokens) to auto-enable Email auth (step 3).

Verify:

```bash
npm run id:setup:check
npm run dev
# open http://localhost:3000/api/id/config-status
```

---

## Step 1 — Run migrations 001 → 004 (manual alternative)

**Option A — automated:** `npm run id:setup` (uses `SUPABASE_DB_URL`)

**Option B — SQL Editor:** paste entire file `supabase/RUN_ALL_MIGRATIONS_001_004.sql` → Run once.

**Option C — separate files:**

| Order | File |
|-------|------|
| 1 | `supabase/migrations/001_freedom_paws_id.sql` |
| 2 | `supabase/migrations/002_pet_embeddings.sql` |
| 3 | `supabase/migrations/003_found_match.sql` |
| 4 | `supabase/migrations/004_audit_settings.sql` |

Verify in **Table Editor**: `pets`, `biometric_enrollments`, `pet_embeddings`, `found_dog_reports`, `match_candidates`, `audit_log`, `user_profiles`.

**Cannot verify from Cursor** — only you can confirm in Supabase dashboard.

---

## Step 2 — Environment variables

### Local — create `.env.local`

Copy from `.env.example` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # server only — match owner emails
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Freedom Paws ID <notifications@freedompawsinc.com>
FP_OPS_EMAILS=you@freedompawsinc.com
NEXT_PUBLIC_APP_URL=https://app.freedompawsinc.com
```

### Vercel — Project → Settings → Environment Variables

Add the **same keys** for **Production** and **Preview**. Redeploy after saving.

| Variable | Required for enroll | Required for match email |
|----------|--------------------|-------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes |
| `OPENAI_API_KEY` | Yes | Yes |
| `NEXT_PUBLIC_APP_URL` | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Yes |
| `RESEND_API_KEY` | No | Yes |
| `RESEND_FROM_EMAIL` | No | Yes (or Resend sandbox) |
| `FP_OPS_EMAILS` | No | Yes (match review role) |

---

## Step 3 — Enable Email auth (magic link)

1. Supabase → **Authentication** → **Providers**.
2. Enable **Email**.
3. **Site URL:** `https://app.freedompawsinc.com` (or your Vercel URL for preview).
4. **Redirect URLs** — add:
   - `https://app.freedompawsinc.com/auth/callback`
   - `https://app.freedompawsinc.com/auth/confirm`
   - `http://localhost:3000/auth/callback` (local dev)
   - `http://localhost:3000/auth/confirm` (local dev)
5. **Magic Link email template** (Authentication → Emails → Magic Link) — use server confirm (works on iPhone Mail → Safari):

```html
<h2>Your sign-in link</h2>
<p>Follow the link below to sign in. This link expires shortly and can only be used once.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/mypets">Sign in</a></p>
```

**Do not** run `vercel env pull` on your Mac — it overwrites `.env.local`. Push env **to** Vercel with `npm run vercel:env:push`.

Test: open `/login`, enter email, click link in inbox → should land on `/mypets` or `?next=` path.

---

## Deploy note (important)

Freedom Paws ID routes (`/id`, `/login`, `/api/pets`) are in the repo but **must be pushed to `main` and deployed** before production shows them. If `/id` returns 404 on Vercel, deploy latest code first.

After deploy + env:

1. `/api/id/config-status` → `readyForEnroll: true`
2. `/login` → email form (not amber “not configured” banner)
3. `/id/enroll` → wizard (not “Supabase setup required”)

---

*Freedom Paws ID — Honor Buddy's Legacy*
