# Freedom Paws Wellness
## Pet Room Monitor — MVP Roadmap & Setup Guide

**Document purpose:** Simple plan for members to use **off-the-shelf Wi‑Fi cameras** to watch pets in the room they stay in while members are away. Build this module **after PWA preview deploy (Week 1)** and **before public marketing launch**.

**Last updated:** May 30, 2026  
**Project folder:** `freedompaws-app`  
**App route:** `/monitor` (currently “Coming Soon”)  
**Related:** `Freedom-Paws-Master-Business-Plan-and-Roadmap.md`

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Member experience (keep it simple)](#2-member-experience-keep-it-simple)
3. [Recommended cameras (US)](#3-recommended-cameras-us)
4. [Why browsers need a bridge](#4-why-browsers-need-a-bridge)
5. [MVP scope — what we build first](#5-mvp-scope--what-we-build-first)
6. [What we do NOT build in MVP](#6-what-we-do-not-build-in-mvp)
7. [Development task checklist](#7-development-task-checklist)
8. [Privacy & legal checklist](#8-privacy--legal-checklist)
9. [Time estimates](#9-time-estimates)
10. [Week-by-week build schedule](#10-week-by-week-build-schedule)

---

## 1. Executive summary

**Goal:** Member buys a **cheap Wi‑Fi camera**, points it at the pet’s room, opens **Freedom Paws → Monitor** on their phone (PWA), and sees **live video** while at work or errands.

**MVP:** One camera, one room, **live view only**, no cloud recording.

**Timeline:** ~**4–6 weeks** of development after Week 1 PWA deploy.

**Order:** Finish **PWA preview on HTTPS first** (1 week). Monitor lives **inside** the installed app.

---

## 2. Member experience (keep it simple)

### Step 1 — Buy camera (we recommend one model first)

“Get a **Wyze Cam v3 or v4** (~$25–35). Mount it where your dog rests.”

### Step 2 — Enable RTSP (one-time, 10 minutes)

Follow our **printed setup card** or in-app wizard with screenshots.

### Step 3 — Connect in Freedom Paws

Open **Monitor** → **Add camera** → paste pairing info OR scan QR from our **optional home relay** app.

### Step 4 — Watch

Tap **Live view**. See stream in PWA. Green dot = connected.

---

## 3. Recommended cameras (US)

| Priority | Camera | Price range | Why |
|----------|--------|-------------|-----|
| **#1 MVP** | Wyze Cam v3 / v4 | $25–40 | RTSP firmware; huge install base; US retail |
| **#2** | Generic ONVIF IP cam | $30–60 | Standard protocol; many brands |
| **Later** | Reolink, Amcrest | $40–80 | Good RTSP docs |
| **Avoid v1** | Ring, Nest, Arlo | — | Closed APIs; hard for indie app |

**Shelter / veteran kits (Year 2):** Donate Wyze + prepaid Core membership.

---

## 4. Why browsers need a bridge

iPhone Safari and PWA **cannot play RTSP directly**.

```
Camera (RTSP)  →  Bridge/Relay  →  HLS or WebRTC  →  Freedom Paws app
```

**Options:**

| Option | Pros | Cons |
|--------|------|------|
| **A. Freedom Paws cloud relay** | Easiest for members | Your server cost + privacy duty |
| **B. Member home mini relay** (Raspberry Pi / old phone) | Privacy, lower cloud cost | Harder setup |
| **C. Video SaaS (LiveKit, Mux)** | Fast to ship | Monthly fee per stream |

**MVP recommendation:** Option **A** for founding members (opt-in) + document Option **B** for power users.

---

## 5. MVP scope — what we build first

- [ ] Setup wizard (Wyze RTSP path)
- [ ] Live HLS player in `/monitor`
- [ ] Connection status (online / offline / retry)
- [ ] Help page with troubleshooting
- [ ] **Core membership** gate (free tier sees setup guide only)
- [ ] Works in **installed PWA on iPhone**
- [ ] One camera per account

---

## 6. What we do NOT build in MVP

- Cloud DVR / playback history
- Two-way audio
- AI “distress detection”
- GPS / wearables (copy on current page mentions this — update to “room camera” for launch)
- Multiple rooms / cameras
- Ring/Nest integration

---

## 7. Development task checklist

### Backend / relay

- [ ] Choose relay approach (self-hosted mediamtx/go2rtc vs SaaS)
- [ ] Secure ingest URL per member (token, not guessable)
- [ ] Auto-disconnect idle streams (save cost)
- [ ] Logging without storing video

### Frontend (`app/monitor/`)

- [ ] Replace “Coming Soon” with wizard + player
- [ ] Mobile-first layout (large tap targets)
- [ ] Offline message if no network
- [ ] Link from homepage “Monitor My Dog” card

### Ops

- [ ] Cost cap alert if relay bandwidth spikes
- [ ] Beta tester list (5–10 homes)
- [ ] Update homepage blurb: room camera while away (not wearables yet)

---

## 8. Privacy & legal checklist

- [ ] Terms: member owns camera; authorized rooms only
- [ ] No selling or training on video
- [ ] No recording stored on Freedom Paws servers in v1
- [ ] Clear “not a substitute for pet sitter or vet emergency”
- [ ] GDPR-style delete if you store any tokens/account data

---

## 9. Time estimates

| Phase | Time |
|-------|------|
| Spec + relay choice | 3–5 days |
| Relay prototype | 5–8 days |
| Monitor UI + wizard | 5–7 days |
| iPhone PWA testing | 3–5 days |
| Beta + fixes | 1–2 weeks |
| **Total** | **4–6 weeks** |

---

## 10. Week-by-week build schedule

| Week | Tasks |
|------|-------|
| **1** | PWA preview deploy (parallel — not monitor code) |
| **2** | Lock Wyze RTSP docs; pick relay; wireframes |
| **3** | Relay POC; one camera streaming to browser |
| **4** | Monitor wizard + player UI |
| **5** | Membership gate; error states; help content |
| **6** | Beta with 5–10 users; iPhone PWA fixes |
| **7–8** | Polish; testimonial; soft launch with Core tier |

---

## Quick reference

| Item | Value |
|------|-------|
| Route | `/monitor` |
| MVP camera | Wyze Cam v3/v4 + RTSP |
| MVP feature | Live view only |
| Requires | HTTPS PWA + Core membership |
| Master plan | `docs/Freedom-Paws-Master-Business-Plan-and-Roadmap.md` |
| Financial model | `docs/Freedom-Paws-5-Year-Financial-Model.csv` |

---

*Freedom Paws Wellness — Honor Buddy’s Legacy*
