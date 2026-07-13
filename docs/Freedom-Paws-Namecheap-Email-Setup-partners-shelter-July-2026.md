# Freedom Paws — Namecheap Private Email Setup  
## `partners@` and `shelter@` (July 2026)

**Status:** ✅ COMPLETED — July 12, 2026  
**Mailboxes live:** info@freedompawsinc.com (catch-all), partners@freedompawsinc.com, shelter@freedompawsinc.com  
**Configured on:** iPhone + Mac Pro Mail (IMAP)

**Domain:** `freedompawsinc.com`  
**Product name in Namecheap:** **Private Email** (Open-Xchange / OX)  
**Addresses (live):**
- `info@freedompawsinc.com` — catch-all / founder ops  
- `partners@freedompawsinc.com` — partner / affiliate outreach  
- `shelter@freedompawsinc.com` — shelter / TN pilot outreach  

**Webmail:** https://privateemail.com  

**Official Namecheap sources used for this guide:**
- [DNS — domains on Namecheap Basic/Premium nameservers](https://www.namecheap.com/support/knowledgebase/article.aspx/1338/93/open-xchange-dns-records-for-domains-registered-with-namecheap)
- [DNS — domains on Namecheap Hosting nameservers](https://www.namecheap.com/support/knowledgebase/article.aspx/1339/93/open-xchange-dns-records-for-domains-hosted-with-namecheap)
- [DNS — third-party DNS](https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/)
- [Create mailboxes](http://www.namecheap.com/support/knowledgebase/article.aspx/1049/93/how-do-i-create-openxchange-user-accounts)
- [DKIM](https://www.namecheap.com/support/knowledgebase/article.aspx/10383/2176/how-to-set-up-a-dkim-record-for-private-email/)
- [Client settings (IMAP/SMTP)](https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2175/general-private-email-configuration-for-mail-clients-and-mobile-devices/)
- [iPhone Mail](https://www.namecheap.com/support/knowledgebase/article.aspx/10032/2175/private-email-account-setup-on-iphone/)
- [Mac Mail](https://www.namecheap.com/support/knowledgebase/article.aspx/9860/2175/private-email-account-setup-in-mail-on-macos-sierramojavecatalinabig-sur-smtpimap/)

---

## 0. Read this first (Freedom Paws–specific)

### Website vs email can share the same DNS zone

Your marketing site (`freedompawsinc.com`) and your mailboxes use **different DNS record types** on the **same** domain:

| What | DNS records that control it |
|------|-----------------------------|
| **Website** | `A` / `AAAA` / `CNAME` for `@` and `www` (Framer or hosting) |
| **App** | `CNAME` for `app` → Vercel |
| **Partner portal** | `CNAME` for `shelter` → Vercel |
| **Email** | `MX` + `TXT` (SPF/DKIM/DMARC) + optional `mail`/`autodiscover` CNAMEs |

**Critical rule:** When you add or fix Private Email, **add MX/TXT/mail CNAMEs**. Do **not** delete Framer (or hosting) website `A`/`CNAME` records, and do **not** delete `app` / `shelter` Vercel CNAMEs.

### Live DNS snapshot (checked July 12, 2026)

As of that check, `freedompawsinc.com` already had:

| Item | Status |
|------|--------|
| Nameservers | `dns1.namecheaphosting.com` / `dns2.namecheaphosting.com` (**Hosting DNS** — use cPanel path below) |
| MX | `mx1.privateemail.com` + `mx2.privateemail.com` (priority 10) — **already present** |
| SPF | `v=spf1 include:spf.privateemail.com ~all` — **already present** |
| DKIM | `default._domainkey` TXT — **already present** (legacy Private Email hostname) |
| DMARC | `v=DMARC1; p=none;` — **already present** |
| `mail` / `autodiscover` / `autoconfig` | CNAME → `privateemail.com` — **already present** |
| `app.` / `shelter.` | CNAME → Vercel — **already present** (keep these) |

**Practical meaning (Jul 12, 2026):** Setup is **complete**. All three mailboxes are live and configured on iPhone + Mac Pro Mail (IMAP). This guide remains as reference for DNS troubleshooting and new device setup.

---

## 1. Prerequisites checklist

Complete every box before creating mailboxes or changing DNS.

- [ ] You can sign in at [namecheap.com](https://www.namecheap.com/) (domain account).
- [ ] You purchased **Private Email** (Open-Xchange) for **`freedompawsinc.com`** — not only “email forwarding,” not only cPanel email that comes free with hosting.
- [ ] Under Namecheap → **Account** → **Dashboard** → left menu **Private Email**, you see `freedompawsinc.com` with a **Manage** button.
- [ ] Your plan has **at least 2 free mailbox slots** (or you can buy two). You need slots for `partners@` and `shelter@`. If you already have `info@`, that counts as one slot.
- [ ] You know where DNS is edited (see Section 2). For Freedom Paws today: **cPanel Zone Editor** (Hosting nameservers).
- [ ] Passwords ready: strong unique passwords for each mailbox (password manager recommended).
- [ ] You understand: **Resend** (app transactional mail) is separate from these human inboxes. If both send as `@freedompawsinc.com`, SPF must eventually include **both** services in **one** SPF TXT record (see Troubleshooting).

---

## 2. Which Namecheap path to use (registered vs hosted)

Namecheap has **two different DNS articles**. Using the wrong one is the usual founder confusion.

### Step 2A — Find your nameservers (1 minute)

1. Sign in to Namecheap.
2. **Domain List** → **Manage** next to `freedompawsinc.com`.
3. Open the **Nameservers** section (or **Domain** tab).
4. Read what is listed.

| What you see | Path to use | Where you edit DNS |
|--------------|-------------|--------------------|
| `dns1.namecheaphosting.com` + `dns2.namecheaphosting.com` | **Hosted with Namecheap** → [Article 1339](https://www.namecheap.com/support/knowledgebase/article.aspx/1339/93/open-xchange-dns-records-for-domains-hosted-with-namecheap) | **cPanel → Zone Editor** |
| `dns1.registrar-servers.com` / `dns2.registrar-servers.com` (or Free/Premium DNS) | **Registered + Namecheap DNS** → [Article 1338](https://www.namecheap.com/support/knowledgebase/article.aspx/1338/93/open-xchange-dns-records-for-domains-registered-with-namecheap) | Namecheap → Domain → **Advanced DNS** |
| Cloudflare, Framer nameservers, GoDaddy, etc. | **Third-party DNS** → [Article 1340](https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/) | That provider’s DNS panel |

### Freedom Paws default path (July 2026)

**Use the Hosting / cPanel path (Article 1339).**  
Your live nameservers are Namecheap **hosting** nameservers — **not** BasicDNS Advanced DNS.

> “Registered with Namecheap” only means you bought the domain there.  
> **Where nameservers point** decides which article and which panel matter.

### If the website later moves fully to Framer

Framer does **not** replace mail by itself. When you point the **website** at Framer (typical Framer records: `A` `@` → Framer IPs such as `31.43.160.6` / `31.43.161.6`, and `www` CNAME → `sites.framer.app`):

1. Change **only** website `A`/`CNAME` records as Framer instructs.
2. **Keep** all Private Email `MX`, SPF, DKIM, DMARC, and `mail`/`autodiscover`/`autoconfig` records.
3. **Keep** `app` and `shelter` Vercel CNAMEs.
4. Never use a “wipe DNS and start over” button unless you know you will re-add website + app + mail afterward.

---

## 3. Exact DNS records to have (Private Email)

Use these whether you are verifying existing records or adding missing ones.

### Required (mail delivery + sending)

| Type | Host / Name | Priority | Value | Notes |
|------|-------------|----------|-------|-------|
| **MX** | `@` (or blank / domain) | **10** | `mx1.privateemail.com` | Required for receiving |
| **MX** | `@` | **10** | `mx2.privateemail.com` | Required for receiving |
| **TXT** (SPF) | `@` | — | `v=spf1 include:spf.privateemail.com ~all` | **Only one SPF** for `@`. Merge if Resend also sends. |
| **TXT** (DKIM) | See note below | — | Long `v=DKIM1; k=rsa; p=...` from Private Email panel | Copy from Namecheap — do not invent |
| **TXT** (DMARC) | `_dmarc` | — | `v=DMARC1; p=none; rua=mailto:info@freedompawsinc.com` | Start with `p=none`. Tighten later. |

**DKIM hostname depends on purchase date:**

| Private Email purchased | DKIM Host |
|-------------------------|-----------|
| **On or after June 2, 2026** | `privateemail._domainkey` |
| **Before June 2, 2026** (legacy) | `default._domainkey` |

Freedom Paws currently publishes **`default._domainkey`** → treat as **legacy** DKIM hostname unless Namecheap shows a different host under **Show DKIM**.

### Optional (webmail shortcut + client autodiscover)

| Type | Host | Value |
|------|------|-------|
| **CNAME** | `mail` | `privateemail.com` |
| **CNAME** | `autodiscover` | `privateemail.com` |
| **CNAME** | `autoconfig` | `privateemail.com` |
| **SRV** | Service `_autodiscover`, Protocol `_tcp` | Priority `0`, Weight `0`, Port `443`, Target `privateemail.com` |

These do **not** replace MX. Skip SRV if your panel makes it hard; IMAP still works with manual Apple settings below.

### Do NOT touch (website / app)

| Host | Purpose |
|------|---------|
| `@` / `www` **A** or **CNAME** for the site | Website (hosting or Framer) |
| `app` CNAME | App on Vercel |
| `shelter` CNAME | Partner portal on Vercel |

---

## 3A. Click-by-click: add/verify DNS in cPanel (Freedom Paws path)

1. Sign in to Namecheap.
2. Go to **Hosting List** (or **Products** → hosting for this domain) → **Manage** / **Go to cPanel**.
3. In cPanel, open **Domains** → **Zone Editor**.
4. Click **Manage** next to `freedompawsinc.com`.
5. Check **MX**:
   - If any old non-Private-Email MX exist (e.g. `mail.freedompawsinc.com` for cPanel mail only), remove **those** MX only.
   - Ensure exactly these two exist (priority **10** each):  
     `mx1.privateemail.com` and `mx2.privateemail.com`.
6. In cPanel → **Email** → **Email Routing** → select `freedompawsinc.com` → set **Remote Mail Exchanger** → **Change**.  
   (Required when Private Email handles mail while DNS lives on hosting nameservers.)
7. Back in **Zone Editor**, verify/add:
   - SPF TXT on `@`
   - DKIM TXT on `default._domainkey` or `privateemail._domainkey`
   - DMARC TXT on `_dmarc`
   - Optional CNAMEs: `mail`, `autodiscover`, `autoconfig`
8. **Save**. Wait **up to 30–60 minutes** (sometimes longer) before testing send/receive.

**DKIM value from Namecheap:**

1. Namecheap → **Private Email** → **Manage** next to `freedompawsinc.com`.
2. Under **DKIM** → **Show DKIM** (or **Generate** if none).
3. Copy the full TXT value starting with `v=DKIM1`.
4. Paste into Zone Editor as one TXT (if cPanel truncates, use “Add TXT string to record” to split correctly — do not cut mid-key randomly).

### Alternate path only if nameservers are BasicDNS (Article 1338)

1. Namecheap → **Domain List** → **Manage** `freedompawsinc.com`.
2. **Advanced DNS**.
3. **Mail Settings** → choose **Custom MX** (safer than “Private Email” auto if you must keep custom website records).
4. Add the MX / TXT / optional CNAMEs from the table above.
5. **Save All Changes**.

---

## 4. Create mailboxes: `partners@` and `shelter@`

Official steps: [Create Private Email mailbox](http://www.namecheap.com/support/knowledgebase/article.aspx/1049/93/how-do-i-create-openxchange-user-accounts).

### Click-by-click

1. Sign in to Namecheap.
2. Top right → **Account** → **Dashboard**.
3. Left menu → **Private Email**.
4. Click **Manage** next to `freedompawsinc.com`.
5. Click **Create Mailbox**.  
   - If you see **Buy Mailbox** instead, buy a slot first, then return here.
6. Create **partners**:
   - Mailbox name: `partners` (full address becomes `partners@freedompawsinc.com`)
   - Password: strong unique password → save in password manager
   - Storage: leave default or choose plan option
   - **Save changes**
7. Confirm success message and that the mailbox appears in the list.
8. Click **Create Mailbox** again for **shelter**:
   - Mailbox name: `shelter`
   - Password: different strong password
   - **Save changes**
9. Optional smoke test in browser: open https://privateemail.com → log in as each address → confirm Inbox loads.

**Login tip:** Username is the **full** address (`partners@freedompawsinc.com`), not just `partners`.

---

## 5. Server settings cheat sheet (Apple Mail / iPhone)

Use these for **both** addresses. Official: [General Private Email client config](https://www.namecheap.com/support/knowledgebase/article.aspx/1179/2175/general-private-email-configuration-for-mail-clients-and-mobile-devices/).

| Setting | Value |
|---------|--------|
| **Username** | Full address (`partners@...` or `shelter@...`) |
| **Password** | That mailbox’s password |
| **Incoming (IMAP)** | `mail.privateemail.com` |
| **IMAP port** | `993` with **SSL** (preferred) — or `143` with STARTTLS |
| **Outgoing (SMTP)** | `mail.privateemail.com` |
| **SMTP port** | `465` with **SSL** (preferred) — or `587` with STARTTLS |
| **SMTP authentication** | **On** |
| **SPA / Secure Password Authentication** | **Off** |

**Use IMAP, not POP**, so iPhone and Mac Pro stay in sync.

---

## 6. iPhone Mail setup (IMAP) — click by click

Official: [Private Email on iPhone](https://www.namecheap.com/support/knowledgebase/article.aspx/10032/2175/private-email-account-setup-on-iphone/).

Do this **twice** — once for `partners@`, once for `shelter@`.

1. Open **Settings**.
2. Tap **Apps** → **Mail** *(on older iOS: Settings → Mail)*.
3. Tap **Mail Accounts** → **Add Account**.
4. Tap **Other**.
5. Tap **Add Mail Account**.
6. Enter:
   - **Name:** e.g. `Freedom Paws Partners` or `Freedom Paws Shelter`
   - **Email:** `partners@freedompawsinc.com` (or `shelter@...`)
   - **Password:** mailbox password
   - **Description:** same as email (easy to spot later)
7. Tap **Next**.
8. Select **IMAP** (highlight IMAP, not POP).
9. Under **Incoming Mail Server**:
   - **Host Name:** `mail.privateemail.com`
   - **User Name:** full email address
   - **Password:** mailbox password
10. Under **Outgoing Mail Server**:
    - **Host Name:** `mail.privateemail.com`
    - **User Name:** full email address
    - **Password:** mailbox password  
    *(Do not leave outgoing username/password blank.)*
11. Tap **Next**. Wait for verification.
12. Turn **Mail** on (Notes optional).
13. Tap **Save**.

Repeat for the second mailbox.

---

## 7. Mac Pro — Apple Mail setup (IMAP) — click by click

Official: [Private Email in Mail on macOS](https://www.namecheap.com/support/knowledgebase/article.aspx/9860/2175/private-email-account-setup-in-mail-on-macos-sierramojavecatalinabig-sur-smtpimap/).

### Recommended: manual IMAP (reliable)

1. Open **Mail**.
2. Menu **Mail** → **Settings** (or **Preferences**) → **Accounts**.  
   Or: **Mail** → **Add Account…**
3. Choose **Other Mail Account…** → **Continue**.
4. Enter:
   - **Name:** display name (e.g. `Freedom Paws Partners`)
   - **Email Address:** `partners@freedompawsinc.com`
   - **Password:** mailbox password
5. Click **Sign In**. If Mail says it cannot verify, continue to manual fields.
6. Fill:
   - **Account Type:** **IMAP**
   - **Incoming Mail Server:** `mail.privateemail.com`
   - **Outgoing Mail Server:** `mail.privateemail.com`
   - **Username:** full email address
7. Click **Sign In** / **Next**.
8. Leave **Mail** checked → **Done**.
9. Verify ports (important):
   - **Accounts** → select this account → **Server Settings**
   - Uncheck **Automatically manage connection settings** if you need to see ports
   - Incoming: port **993**, TLS/SSL **on**, Authentication **Password**
   - Outgoing: port **465** (or **587**), TLS/SSL **on**, Authentication **Password**
10. Save. Confirm Inbox appears in the sidebar.

Repeat for `shelter@freedompawsinc.com`.

### Optional: profile download from webmail

1. Log in at https://privateemail.com on the Mac.
2. Gear icon → **Connect Your Device** → **macOS** → **Email with Apple Mail**.
3. Download/install the profile, enter password when asked.  
   Still verify Server Settings match the cheat sheet above.

---

## 8. Common mistakes / troubleshooting

| Mistake / symptom | Fix |
|-------------------|-----|
| Used Article 1338 (Advanced DNS) but nameservers are `namecheaphosting.com` | Advanced DNS changes are **ignored**. Edit **cPanel Zone Editor** instead. |
| Deleted website `A`/`CNAME` while “fixing email” | Restore Framer/hosting website records. Mail MX does not need the site to move. |
| Removed `app` or `shelter` CNAMEs | Re-add Vercel CNAMEs from Vercel → Domains instructions. |
| Two SPF TXT records on `@` | Merge into **one** SPF string. Extra SPF records break sending. |
| Wrong MX (still pointing at cPanel / Google / Microsoft) | MX must be **only** `mx1` + `mx2.privateemail.com`. |
| Email Routing still “Local” in cPanel | Set **Remote Mail Exchanger** for Private Email. |
| “Cannot connect” on iPhone/Mac | Confirm host is `mail.privateemail.com` (not `mail.freedompawsinc.com` unless you know that CNAME works). Use full email as username. Ports 993/465. |
| Can receive but cannot send | Check SMTP auth on, SPA off, SPF/DKIM present, wait for DNS propagation. |
| Sends go to spam | Confirm SPF + DKIM; keep DMARC at `p=none` until stable, then raise carefully. |
| Bought Private Email but “Buy Mailbox” shows | Plan is out of slots — purchase additional mailboxes. |
| Propagation impatience | Allow **30–60 minutes** after DNS edits (up to 24–48h in rare cases). |
| Also using **Resend** for app mail | Merge SPF, e.g. `v=spf1 include:spf.privateemail.com include:amazonses.com ~all` (use Resend’s exact include). Never add a second SPF TXT. |

### Framer + email conflict (what not to do)

- Do **not** change nameservers to Framer-only if that removes your ability to keep MX at Namecheap hosting — unless you will re-add **all** mail records at the new DNS host.
- Do **not** use “email only” auto-setup that replaces the whole zone without checking website records first.
- **Safe pattern:** keep current DNS host → add/keep MX + auth TXT → separately point `@`/`www` to Framer when ready.

---

## 9. Verification steps (send / receive)

Do this after DNS wait + both mailboxes created.

### A. Webmail receive

1. Open https://privateemail.com → log in as `partners@freedompawsinc.com`.
2. From a personal Gmail/iCloud, send a test to `partners@freedompawsinc.com`.
3. Confirm it arrives in Inbox (check Junk).
4. Repeat for `shelter@freedompawsinc.com`.

### B. Webmail send

1. From `partners@` webmail, send to your personal address.
2. Confirm delivery and that it is not marked spam.
3. Optional: open the message headers / use [mail-tester.com](https://www.mail-tester.com/) for SPF/DKIM score.
4. Repeat from `shelter@`.

### C. Apple devices

1. On iPhone Mail, send from `partners@` to personal mail → reply back → confirm both ways.
2. On Mac Pro Mail, same for `shelter@`.
3. Confirm Sent folder updates on both devices (IMAP sync).

### D. Quick DNS checks (optional, Terminal)

```bash
dig NS freedompawsinc.com +short
dig MX freedompawsinc.com +short
dig TXT freedompawsinc.com +short
dig TXT default._domainkey.freedompawsinc.com +short
dig TXT _dmarc.freedompawsinc.com +short
```

Expect: hosting NS (or your chosen NS), Private Email MX, SPF include for `spf.privateemail.com`, DKIM present, DMARC present.

---

## 10. Founder checklist (print / tick)

- [x] Private Email product active for `freedompawsinc.com`
- [x] Confirmed nameserver path (**Hosting / cPanel** for current setup)
- [x] MX + SPF + DKIM + DMARC verified (or added without touching Framer/app records)
- [x] cPanel **Email Routing** = Remote Mail Exchanger (if on hosting NS)
- [x] Mailbox `info@freedompawsinc.com` live (catch-all)
- [x] Mailbox `partners@freedompawsinc.com` created
- [x] Mailbox `shelter@freedompawsinc.com` created
- [x] Webmail login works for all three
- [x] iPhone Mail: info@, partners@, shelter@ (IMAP)
- [x] Mac Pro Mail: info@, partners@, shelter@ (IMAP)
- [x] Send + receive test passed both ways
- [x] Passwords stored in password manager
- [x] Ready to send TN pilot / partner drafts from the correct From address

---

## Related Freedom Paws docs

- Website / app DNS (keep separate from mail): `docs/Framer-and-DNS-Manual-Setup-Guide.md`
- Shelter subdomain DNS: `docs/ops/INFRASTRUCTURE-BUILDOUT-FRAMER-DNS-WELLNESS.md`
- Outreach uses `shelter@` / `partners@`: founder schedules, TN pilot outbox drafts, legal playbook contact table

**Note:** App transactional mail (magic links, match alerts) via **Resend** is independent. These Private Email mailboxes are for **human** partner and shelter correspondence.

---

## 11. Completion checklist (July 12, 2026)

- [x] Private Email product active for `freedompawsinc.com`
- [x] DNS verified: MX, SPF, DKIM, DMARC, mail CNAMEs
- [x] cPanel Email Routing = Remote Mail Exchanger
- [x] Mailbox `info@freedompawsinc.com` live (catch-all)
- [x] Mailbox `partners@freedompawsinc.com` created
- [x] Mailbox `shelter@freedompawsinc.com` created
- [x] Webmail login works for all three
- [x] iPhone Mail: info@, partners@, shelter@ (IMAP)
- [x] Mac Pro Mail: info@, partners@, shelter@ (IMAP)
- [x] Send + receive test passed both ways
- [x] Passwords stored in password manager
- [x] Ready to send TN pilot / partner drafts from the correct From address

---

*Freedom Paws Wellness — Namecheap Private Email founder guide — July 2026*
