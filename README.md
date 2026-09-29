# AquaSentinel AI — Smart India Hackathon 2026

> **Predict Rain. Map Water. Trigger Action.**

AquaSentinel AI is an AI-powered flood early-warning and disaster-decision prototype for India. It ingests satellite/radar/NWP signals into an ensemble model, maps nationwide multi-hazard risk (rainfall, floods, glaciers/GLOF, cloudburst, coastal/tsunami), and turns predictions into ranked, explainable, role-aware actions for the public, disaster authorities, scientists, and administrators.

---

## Demo mode (frontend prototype)

This build is a **demo-mode prototype**: all data is simulated and clearly labeled **DEMO / SIMULATION DATA**. There is no live backend — adapters are deliberately stubbed so real feeds (below) can be plugged in later without UI changes.

### Running it

```bash
cd rainshield-ai
npm install
npm run dev        # http://localhost:5173
```

Production build / lint:

```bash
npm run build      # tsc -b && vite build
npm run lint       # tsc --noEmit
```

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@demo.aquasentinel.ai` | `admin@123` |
| Research Scientist | `scientist@demo.aquasentinel.ai` | `scientist@123` |
| Disaster Authority | `authority@demo.aquasentinel.ai` | `authority@123` |
| Public User | `public@demo.aquasentinel.ai` | `public@123` |

### MapTiler integration (`/geointel`)

The Geospatial Intelligence Map uses MapTiler basemaps (satellite / streets / terrain) + geocoding via a **server-side Vite proxy** — the API key is read from `.env` on the server and **never shipped to the browser**.

```bash
# 1. Copy and paste your MapTiler API key (https://cloud.maptiler.com/account/keys/)
cp .env.example .env
#   then set MAPTILER_KEY=your-key in .env

# 2. Run/restart the dev or preview server — the proxy activates automatically
npm run dev
```

- Tiles: `/api/maptiler/tile/{style}/{z}/{x}/{y}` → `api.maptiler.com/maps/{style}/256/…` (styles: `hybrid`, `streets-v2`, `topo-v2`).
- Geocoding: `/api/maptiler/geocode?q=…` → `api.maptiler.com/geocoding/….json` (country scoped to India).
- The page degrades gracefully without a key: overlay layers (clearly-labeled sample hazard data) still render, and a banner explains the missing key.
- `.env` is git-ignored; only `.env.example` is committed. If a request is made to the proxy with no key configured it returns `503 MAPTILER_KEY_NOT_CONFIGURED`.

Hazard layers (rainfall, state flood risk, glaciers, glacial lakes/GLOF, cloudburst, coastal) currently use **sample data**; wire the backend adapters (below) to feed live values without UI changes.

Passwords are **never stored in plaintext** — credentials are seeded and verified with PBKDF2 (Web Crypto, 60,000 iterations, SHA-256) with per-user salts. Sessions live in `localStorage` (remember me) or `sessionStorage`. Registration creates a `public` account; restricted roles require administrator approval in production.

---

## What's inside

### Authentication & roles
- Login / signup first-run experience with validation, show/hide password, "remember me", and demo quick-fill.
- Role-gated routes: `/command` (authority/scientist/admin) and `/scientist` (scientist/admin); unauthenticated visit → `/login` (auth-first flow).
- Persistent branded shell: sidebar groups (Overview / Monitoring / Response / System), live-status topbar, mobile drawer, location switcher, alerts bell, global **SOS** button.

### Nationwide hazard monitoring (India)
- **Dashboard** — role-aware welcome, **Nationwide Hazard Overview** (interactive India map with per-state flood risk, top-at-risk states, multi-hazard coverage), 8 quick-access hazard cards, 15 differentiators.
- **Live Map** — interactive GIS view with rainfall, radar, risk, and inundation overlays.
- **Geospatial Intel** — MapTiler-powered India map (satellite/streets/terrain), 6 hazard overlays, location search (MapTiler geocoding), legend, and layer panel with per-layer last-update times.
- **Rainfall Prediction** — AI rainfall + inundation predictions, model consensus chart, **uncertainty engine** with scenario bands (Pessimistic +1σ / Consensus / Optimistic −1σ) and low-confidence guidance.
- **Inundation** — flood-depth grid and water-level analytics.
- **Glacier & GLOF** — glacier area-change trend, glacial lake risk scoring with freeze-score bars, satellite scene comparison; explicit disclaimer that GLOF can't be predicted with guaranteed certainty.
- **Cloudburst** — risk zones, radar reflectivity, per-zone confidence with low-confidence guidance.
- **Coastal & Ocean** — SST anomaly trend, station list, and an **official tsunami advisory relay** (clearly labeled as relayed from INCOIS/NOAA-style sources, never authored by AquaSentinel).
- **Analytics** — model/consensus analysis and historical comparisons.

### Response & decisions
- **What-If Simulator** — scenario presets (A · 60 mm, C · 100 mm, B · 120 mm) with rainfall/duration/drainage/river-level/soil-saturation controls and impact forecast.
- **Flood-Aware Safe Routes** — routing that avoids predicted flooded roads, high-risk zones, and unsafe crossings.
- **AI Early Warning Center** — live alert cards with **Explainable AI** ("Why this warning?" factor-weight modal), evacuation priority ranking, official-advisory relay, notification preferences, and emergency instructions.
- **Infrastructure & Evacuation** — critical-infrastructure risk, evacuation shelters/routes.
- **SOS** — global emergency modal: 112/101/108/1078 helplines, location sharing, and emergency instructions.

### Command & governance
- **Command Center** (authority/scientist/admin) — operational overview with communication controls.
- **Scientist & Administrator Dashboard** — AI prediction **review/approve/reject workflow** (admin-only rejection), model verification, user management (suspend/activate), system health.

---

## Architecture

```
src/
├─ auth/auth.ts            PBKDF2 hashing, seeding, sessions, roles
├─ context/AuthContext.tsx AuthProvider (login/register/logout/can)
├─ context/AppContext.tsx  Alerts, areas, data provider
├─ components/             Shell (sidebar/topbar), SOSModal, IndiaMap, charts, cards
├─ pages/                  Dashboard, Map, Predictions, Inundation, Glacier,
│                          Cloudburst, Coastal, Simulator, Route, Alerts,
│                          Infrastructure, Evacuation, Analytics, Command,
│                          Scientist, About, Auth (login/signup)
├─ data/demoData.ts        All simulated datasets + types
└─ types.ts                Shared TypeScript models
```

**Stack:** React 18 · TypeScript (strict) · Vite 5 · Tailwind 3 · Framer Motion · Recharts · Leaflet · Lucide · React Router 6.

## Demo-only everywhere (no false LIVE claims)
All datasets (`demoData.ts`) are synthetic and tagged **SIMULATION**; every page carries a `DEMO / SIMULATION DATA` banner; tsunami advisories are marked as official-source relays only.

## Production adapter points (currently stubbed)
- NASA GPM / IMD rainfall, Sentinel-1/2 & Copernicus DEM for flood/glacier/GLOF, cloudburst nowcasting, INCOIS & NOAA advisory feeds, authority SMS/push (FCM), NDRF/NDMA coordination, PostGIS/backend persistence.
- The UI is unchanged when these are wired in — swap the data provider, keep the screens.

## Known build warning
Vite reports a >500 kB JS chunk (single-bundle SPA). Non-fatal; code-splitting via `import()` would resolve it.