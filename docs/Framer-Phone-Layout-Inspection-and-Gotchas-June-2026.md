# Framer Phone Layout — Inspection Report & Gotchas

**Date:** June 17, 2026  
**Page:** `/freedom-paws-id-toolbox`  
**Symptom:** Phone breakpoint — stack overlap; canvas too short; Privacy / stats / footer clipped  
**Status:** Diagnosed — layout fix required before final publish + Section 14 iPhone test

**Related:** `Framer-CTA-Link-Map.md` Section 14 · `Today-Session-Founder-Checklists-June-2026.md` T5 · **§6 Lexicon** (agent vocabulary)

---

## 1. Inspection summary

### What you reported

| Symptom | Observed in screenshots |
|---------|-------------------------|
| Stacks overlap on phone | Community Impact visible; Protect Your Dog / Privacy / stats layers exist but compete for same space |
| Canvas “too short” | Bottom cut off — `24/7` partially visible; `88% Active Use` and Footer not on canvas |
| Layers vs canvas mismatch | Layers panel shows nested Stacks below Community Impact; preview does not show full height |

### Root cause (ranked — subagent consensus)

| Rank | Cause | Framer properties to check |
|------|--------|---------------------------|
| **1** | Section stacks **Absolute** or **same Y** | **Position** → Absolute; manual **Y**; **Pin** |
| **2** | Parent **fixed height** + **Overflow Hidden** | **Height** (fixed px / 100vh); **Overflow** → Hidden; **Clip Content** |
| **3** | Phone breakpoint never overridden | No orange dots on Phone for **Stack Direction**, **Height**, **Gap** |
| **4** | Tail sections **nested inside** Community Impact (or other section) | Privacy/stats as *children* of earlier section with clip |
| **5** | Duplicate Stacks from copy-paste | Two stacks same coordinates — one orphan from Desktop |
| **6** | Button 2 variant fixed size on Phone | Component **Height** fixed — parent Stack stops growing |

**Not the problem:** Missing content. Layers show Privacy, stats, footer — they are **clipped or overlapped**, not deleted.

---

## 2. Canonical structure (target state)

Long-form marketing pages should use **one vertical flow**, not stacked absolute sections.

```
Page: /freedom-paws-id-toolbox
├── [Component] Site Nav
├── Stack: PageBody                    ← anchor parent
│       Direction: Vertical
│       Height: Fit contents
│       Position: Relative
│       Overflow: Visible
│   ├── Section-Hero
│   ├── Section-IDIntro
│   ├── Section-HowItWorks
│   ├── Section-ToolBox
│   ├── Section-LiveDemo
│   ├── Section-CommunityImpact
│   ├── Section-ProtectCTA
│   ├── Section-Privacy
│   └── Section-Stats
└── [Component] Site Footer            ← page root sibling, NOT inside a section
```

**Scroll:** Native page scroll (browser). **Not** fixed 100vh viewport with internal scroll.

**Stats row:** Page body only (`Section-Stats`). **Footer component:** site-wide links only.

---

## 3. Inspection checklist (run on Phone breakpoint)

1. Top bar → **Phone** icon active.
2. Select **PageBody** (outermost content wrapper):
   - Height → **Fit** / Fit contents
   - Overflow → **Visible**
   - Clip Content → **Off**
   - Stack Direction → **Vertical**
3. For each section from Community Impact → Footer:
   - Position → **Relative** (not Absolute)
   - Height → **Fit**
   - Note **Y** — must differ per section in flow (not identical)
4. Select **Community Impact** parent:
   - Confirm Privacy / Protect / Stats are **siblings below**, not nested inside
   - Overflow → **Visible** on section wrapper
5. Layers: hide duplicate **Stack** groups — if layout improves, delete orphan.
6. **Preview** (Play) at Phone width → scroll to footer — must reach Privacy + stats + footer.

---

## 4. Fix procedure (order matters)

### Phase 1 — Unclip the page

1. Phone breakpoint → select **PageBody** (or main page content Stack).
2. **Height** → **Fit contents**
3. **Overflow** → **Visible**
4. **Clip Content** → **Off**

### Phase 2 — Restore document flow

5. Select **Section-CommunityImpact** through **Section-Stats** one at a time.
6. Each: **Position** → **Relative**; clear **Pin**; remove manual **Y** offset.
7. Confirm each section **pushes** the next down on canvas.

### Phase 3 — Move tail sections out of nested parents

8. If Privacy or Stats are **inside** Community Impact stack → drag them to **PageBody** level (siblings).
9. Order: Community Impact → Protect CTA → Privacy → Stats.

### Phase 4 — Stats + Footer

10. **Section-Stats**: Phone → Direction **Vertical** (or 3 rows); Height **Fit**.
11. **Footer component**: must sit at **page root**, below PageBody — not inside any section with clip.

### Phase 5 — Verify

12. Canvas: full page visible top to bottom.
13. Preview Phone: scroll test.
14. Re-check **Button 2** instances still visible after layout fix.

---

## 5. Gotchas — do not repeat

### Gotcha 1 — Phone is a separate layout

Adding sections on **Desktop** does not fix **Phone**. After every new section or button: switch to **Phone** and scroll the full page in **Preview**.

### Gotcha 2 — Never fixed height on long pages

Do **not** set section **Height** to fixed px or `100vh` on marketing pages. Use **Fit contents** + **padding** for spacing.

### Gotcha 3 — Overflow Hidden clips the tail

`Overflow: Hidden` on a black section (often for image crop) **clips everything below inside that parent**. Tail sections (Privacy, stats) must be **siblings**, not children of Community Impact.

### Gotcha 4 — Copy-paste creates ghost stacks

Duplicate **Stack** layers at the same **Y** look fine in the layers list but **overlap on canvas**. Delete orphans after paste.

### Gotcha 5 — Absolute positioning breaks mobile flow

**Absolute** section stacks work on Desktop artboards; on Phone they stack at the same origin. Default: **Relative** + vertical **PageBody**.

### Gotcha 6 — Component variants can break parent height

After fixing **Button 2** / **CTA Enroll**, confirm button **Height** → **Fit** on Phone so the parent Stack still grows.

### Gotcha 7 — Stats ≠ Footer

Page stats (`10 Protocols`, `24/7 App access`) live in **page body**. Footer component = Our Story, Contact, social — site-wide only.

### Gotcha 8 — Name your sections

Rename layers: `Section-Privacy`, `Section-Stats` — not ten layers all named `Stack`.

---

## 6. Framer layout debug lexicon (for AI agent sessions)

Use this vocabulary when working with Claude or other agents on Framer layout bugs. Precise terms map directly to the **Layers** panel and **Properties** panel in Framer.

### Structure

| Term | Meaning |
|------|---------|
| **Layer** | One row in the Layers list |
| **Stack** | Container with Direction + Gap (has Layout controls) |
| **Text** | Text-only layer — no Gap or Overflow |
| **Component instance** | Reusable block on the page; may require **Edit Component** on the inner name |
| **Page root** | Top of the Layers tree for this page (sibling to page sections) |
| **Layer tree / indent** | Parent vs child — who is nested under whom |
| **Sibling** | Layers at the same indent under the same parent |

### Layout (Stacks only)

| Term | Meaning |
|------|---------|
| **Direction Vertical / Horizontal** | Children stack down or across |
| **Gap** | Space between children |
| **Height Fit** | Hug contents — preferred for marketing sections |
| **Height Fixed** | Pixel height — often causes clip or overlap |
| **Padding** | Space inside the box |
| **Overflow Visible / Hidden** | Hidden clips content below inside that parent |

### Position (overlap culprit)

| Term | Meaning |
|------|---------|
| **Relative** | Normal document flow — children push each other down |
| **Absolute** | Pinned to coordinates — **overlap** when two layers share the same Y |
| **Pin** | Locks layer to top/left — often causes overlap on Phone |
| **Y offset / Top** | Manual position (e.g. Top: 5690) — breaks vertical flow |

### Breakpoints

| Term | Meaning |
|------|---------|
| **Phone breakpoint** | Must state explicitly — Desktop fixes do not fix Phone |
| **Override (purple/orange dot)** | Phone-only value; reset if layout behaves unexpectedly |

### Symptoms (name one primary issue)

| Say this | Not this |
|----------|----------|
| **Two buttons overlap (same Y)** | “Buttons look wrong” |
| **Stats text drawn on privacy paragraph** | “Bottom is messy” |
| **Huge empty gap between headline and button** | “Spacing is off” |
| **Footer OK; only Protect Your Dog → Stats broken** | “Whole page broken” |

### Fix scope

| Term | Meaning |
|------|---------|
| **Page-level fix** | Select Stack on page; set Gap, Direction — no Edit Component |
| **Instance fix** | Select wrapper (e.g. `Tap - Token Shop CTA`); set Fit + Relative |
| **Component master fix** | **Edit Component** on inner name (e.g. `CTA Token Shop`) — changes all uses |
| **Nuclear reset** | Delete broken block; replace with plain buttons or text; relink URLs |

### Screenshot bundle (send with every layout bug)

1. **Layers** panel expanded — parent + problem children visible
2. **Properties** for one overlapping layer — show **Position type** and **Size**
3. **Phone Preview** of the broken zone

### Agent session rules

| Rule | Why |
|------|-----|
| **Diagnose before steps** | Ask: “Root cause from Layers + Position panel; no copy steps yet.” |
| **Use exact layer names** | Not “Stack 1 / Stack 2” — names from the screenshot |
| **2-try cap** | Same symptom after 2 fixes → **nuclear reset only** for that section |
| **Split surfaces** | App (Next.js) = agent edits repo; Framer layout = screenshots + checklist or specialist |

### Opening message template (paste into agent chat)

```
Framer layout debug.
Page: [path, e.g. /freedom-paws-id-toolbox]
Breakpoint: Phone
Symptom: [overlap / clip / gap — one primary issue]
Screenshots: Layers tree + Properties (Position + Size) for [exact layer name]
Ask: Diagnose first (Relative vs Absolute, component vs page).
Rule: Max 2 fix attempts; then nuclear rebuild of [section name] only.
Use exact layer names from screenshot — not generic Stack labels.
```

### One-sentence diagnosis format

> Phone breakpoint: `[layer name]` is **Absolute** with **Top [value]**; siblings `[A]` and `[B]` overlap — give **one** fix: Relative, reorder, or replace component.

---

## 7. Before publish (ID page gate)

- [ ] Phone Preview: scroll Hero → Footer without overlap
- [ ] No section **Absolute** at page level
- [ ] PageBody **Fit** + **Overflow Visible**
- [ ] Section 14 six-tap link test (`Framer-CTA-Link-Map.md` §14D)
- [ ] **Publish** Framer

---

## 8. After layout fix — resume content work

Remaining ID page sections (if not done):

| Section | Task |
|---------|------|
| Community Impact | Tennessee copy (optional text tweak) |
| Protect Your Dog | Two red buttons → app + protocol overview |
| Privacy | Add consent + disclaimer lines |
| Stats | Replace 1K+ / 88% with verifiable stats |
| Publish | Final |

---

*Freedom Paws Wellness — Honor Buddy's Legacy*
