# Create Your Supabase Project (First Time) — 15 Minutes

Do this once, then run `npm run id:setup` to finish steps 1–3 automatically.

---

## 1. Create the project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) → sign in (GitHub is fine).
2. **New project**
3. **Organization:** your personal org (or create one).
4. **Name:** `freedom-paws-id` (or any name).
5. **Database password:** generate a **strong password** and **save it in a password manager** — you need it for migrations.
6. **Region:** choose closest to you (e.g. `West US` for California pilot).
7. Wait ~2 minutes for the project to finish provisioning (green status).

---

## 2. Copy these values (keep this tab open)

### API keys

**Project Settings** (gear) → **API**

| Copy this | Label in dashboard |
|-----------|-------------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` — **never commit or expose in browser** |

### Database connection URI (for migrations)

**Project Settings** → **Database** → **Connection string** → **URI**

- Mode: **Session pooler** (or Direct if pooler fails).
- Replace `[YOUR-PASSWORD]` with the database password from step 1.
- This full string is `SUPABASE_DB_URL`.

Example shape:

```text
postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Optional — auto-enable Email auth (step 3)

**Account** (avatar top-right) → **Access Tokens** → generate token → `SUPABASE_ACCESS_TOKEN`

**Project ref:** from URL `https://supabase.com/dashboard/project/`**`abcdefghijklmnop`**

---

## 3. Run automated setup in your terminal

From the `freedompaws-app` folder:

```bash
npm run id:setup
```

Paste each value when prompted. The script will:

1. **Step 1** — Run all migrations `001–004` on your database  
2. **Step 2** — Write `.env.local` with your keys  
3. **Step 3** — Enable Email auth via API (if you pasted access token) **or** print manual dashboard steps  

Then verify:

```bash
npm run id:setup:check
npm run dev
```

Open: [http://localhost:3000/api/id/config-status](http://localhost:3000/api/id/config-status)  
Expect: `"supabaseReady": true`, `"readyForEnroll": true`

Test login: [http://localhost:3000/login](http://localhost:3000/login) → enter email → click magic link.

---

## 4. Vercel (production) — same keys

**Vercel** → your project → **Settings** → **Environment Variables**

Add for **Production** and **Preview**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY` (when ready)
- `RESEND_FROM_EMAIL`
- `FP_OPS_EMAILS`
- `NEXT_PUBLIC_APP_URL` = `https://app.freedompawsinc.com`

**Redeploy** after saving. Then push latest code to `main` so `/id` and `/login` deploy (they 404 today until pushed).

---

## Manual fallback (if `npm run id:setup` fails on DB connection)

1. Supabase → **SQL Editor** → New query  
2. Paste entire file: `supabase/RUN_ALL_MIGRATIONS_001_004.sql` → **Run**  
3. **Authentication** → **Providers** → **Email** ON  
4. **URL configuration:** Site URL `https://app.freedompawsinc.com`  
5. Redirect URLs: `https://app.freedompawsinc.com/auth/callback` and `http://localhost:3000/auth/callback`  
6. Create `.env.local` manually from `.env.example`  

---

*When finished, tell Cursor: "Supabase setup done" — we'll verify and continue engineering.*
