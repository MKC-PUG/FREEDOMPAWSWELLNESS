# Google Docs — Import the 6-Month Projections Charts

**Files:**
- `Freedom-Paws-Product-Lines-6mo-Projections-Y0.5-Y5.csv` — raw data
- `Freedom-Paws-Product-Lines-6mo-Projections-Printable-Charts.html` — charts + tables (print-ready)

---

## Fastest path (recommended)

1. **Open the HTML file** in Chrome or Safari:
   - Double-click `docs/Freedom-Paws-Product-Lines-6mo-Projections-Printable-Charts.html`
   - Or drag the file into your browser

2. **Print to PDF** (keeps charts + tables on ~4 pages):
   - `Cmd+P` (Mac) or `Ctrl+P` (Windows)
   - Destination: **Save as PDF**
   - Margins: Default · Background graphics: **On**

3. **Upload PDF to Google Drive** → Right-click → **Open with → Google Docs**
   - Google converts the PDF into an editable Doc (charts become images)

---

## Copy charts only into an existing Doc

1. Open the HTML file in your browser.
2. Click a chart (SVG) → select all inside the chart box → **Copy**.
3. In Google Docs: **Paste** — chart appears as an image.
4. Repeat for Charts 1–5.

---

## Build live charts in Google Sheets (editable)

1. **Google Drive** → **New** → **Google Sheets** → **File → Import** → upload `Freedom-Paws-Product-Lines-6mo-Projections-Y0.5-Y5.csv`.
2. **Pivot / filter** by `Scenario` column for Conservative, Base, Aggressive.
3. Select columns `Period`, `Total_Revenue`, `Total_Gross_Profit` → **Insert → Chart**.
4. Chart type suggestions:
   - **Line chart** — Total revenue by period (one series per scenario)
   - **Stacked column** — Base: Product A/B/C revenue
   - **Column** — Y5.0 comparison (filter Period = Y5.0)
5. Click chart → **⋮** → **Copy chart** → paste into Google Doc.

---

## Copy tables into Google Docs

1. Open the HTML file in browser.
2. Drag to select **Table 1**, **Table 2**, or **Table 3**.
3. **Copy** → paste into Google Doc (table formatting is preserved).

---

## Print from browser (no Google Docs)

The HTML file is formatted for **letter-size print** (`8.5×11`). Use Print → Save as PDF for your founder binder.

**Copies saved to:** `~/Documents/Freedom Paws Wellness/`
