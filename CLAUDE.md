# CLAUDE.md — ZamaiTrust

## What This Is

ZamaiTrust is the **interactive concept note / pitch site** for the CATSP OS — the operating system for Zambia's $5.7B agricultural transformation programme (CATSP). This repository is the **presentation layer**, not the platform itself. It explains the vision, financial model, technical architecture, and regulatory compliance to stakeholders (ZAMACE, EcoAfri, ZARETA, government, investors).

The actual CATSP OS platform (Supabase backend, farmer PWA, USSD gateway, etc.) is a separate future build. This site is the document that makes the case for building it.

**Company:** ZamAi Solutions (zamai.pro), Lusaka, Zambia
**Confidentiality:** Shared under NDA. Do not expose content to public APIs or external services.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Bundler | Vite | 8.x |
| Routing | React Router DOM | 7.x |
| Styling | Pure CSS (no framework) | Custom design system in `App.css` |
| Fonts | Google Fonts (Syne, Cormorant Garamond, DM Sans, JetBrains Mono) | Loaded in `index.html` |
| Hosting target | Netlify | Via `vite build` → `dist/` |

No Tailwind. No component library. No state management library. No testing framework. No TypeScript.

---

## Project Structure

```
ZamaiTrust/
├── index.html                  # Entry HTML — loads Google Fonts, mounts #root
├── vite.config.js              # Vite config (React plugin only)
├── package.json                # Dependencies: react, react-dom, react-router-dom
├── trust-infrastructure-v01.html  # Original single-file HTML concept note (archived reference)
├── public/
│   ├── AI.png                  # Nav logo (small)
│   └── ZAMAI.png               # Full logo (hero + footer)
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # BrowserRouter + routes + Nav
│   ├── App.css                 # ALL styles — single file, custom design system
│   ├── pages/
│   │   ├── VisionPage.jsx      # Route: / — Hero, Problem, Idea, Principles, Architecture, Phases
│   │   ├── ModelPage.jsx       # Route: /model — Interactive financial model with sliders
│   │   ├── SchemaPage.jsx      # Route: /how-it-works — Schema, Benefits, Merkle, Agents, Waterfall
│   │   └── RegulationPage.jsx  # Route: /regulation — Regulatory analysis, Closing, Footer
│   └── components/
│       ├── Nav.jsx             # Fixed top nav with page links
│       ├── Hero.jsx            # Landing hero section
│       ├── ScrollToTop.jsx     # Scroll-to-top on route change
│       ├── Divider.jsx         # Emerald-green horizontal rule
│       ├── SectionHeader.jsx   # Numbered section header (used by non-Vision pages)
│       ├── ProblemSection.jsx  # The problem statement
│       ├── IdeaSection.jsx     # The core idea / solution
│       ├── PrinciplesSection.jsx  # Design principles
│       ├── ArchitectureSection.jsx # System architecture overview
│       ├── PhasesSection.jsx   # Deployment phases
│       ├── FinancialModel.jsx  # Interactive slider-based financial model
│       ├── SchemaSection.jsx   # Database schema / data model display
│       ├── BenefitClassesSection.jsx # Participant benefit classes
│       ├── MerkleSection.jsx   # Merkle tree integrity explanation
│       ├── AgentSection.jsx    # AI agent / channel descriptions
│       ├── WaterfallSection.jsx # Payment waterfall explanation
│       ├── TrustDiagrams.jsx   # SVG trust architecture diagrams
│       ├── RegulatorySection.jsx # Zambian law compliance analysis
│       └── ClosingSection.jsx  # CTA + footer
```

---

## Design System

All styles live in `src/App.css`. There is no CSS-in-JS, no CSS modules, no Tailwind. The design system uses CSS custom properties:

### Color Palette (defined in `:root`)
- **Base/surface:** `--base` through `--s4` (dark grays, near-black)
- **Emerald green (primary):** `--eg` through `--eg-hi` (teal/emerald accent)
- **Copper (secondary):** `--cu` through `--cu-hi` (warm copper/gold accent)
- **Text:** `--t1` (brightest) through `--t4` (dimmest)
- **Status:** `--green`, `--amber`, `--red`

### Typography
- **Display:** Syne (headings, bold UI labels)
- **Serif:** Cormorant Garamond (pull quotes, decorative)
- **Body:** DM Sans (paragraphs, UI text)
- **Mono:** JetBrains Mono (code blocks, schema fields)

### CSS Class Conventions
- `.sec` / `.sec-alt` / `.sec-eg` — section containers (default, dark alt, emerald bg)
- `.eye` — eyebrow text (small uppercase label above headings)
- `.h1` / `.h2` / `.h3` — heading styles (NOT semantic HTML tags)
- `.p` — paragraph style
- `.pull` — pull quote with left border
- `.card` / `.card-grid` / `.card-grid-3` — card layout system
- `.flow` / `.flow-node` / `.flow-arrow` — horizontal flow diagrams
- `.layer-stack` / `.layer` — stacked layer diagrams
- `.code-block` — styled code display with syntax color classes (`.ck`, `.cs`, `.cn`, `.cc`, `.ct`)
- `.btable` / `.ftable` / `.summary` — table styles
- `.schema-card` — schema entity display cards
- `.agent-card` / `.agent-grid` — agent description cards
- `.feature` / `.status` — regulatory feature cards with traffic-light status
- `.note` — callout/note boxes
- `.fade` / `.d1`–`.d4` — fade-up entrance animations with staggered delays

### Responsive
Mobile breakpoint at 820px. Grids collapse to single column. Padding reduces. Nav compresses.

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
```

No test suite. No linter configured. No CI/CD pipeline.

---

## Architecture Patterns

### Component Pattern
- Components are plain functional components (no hooks except `useState`/`useMemo` in `FinancialModel.jsx`)
- All content is hardcoded in JSX — no CMS, no data files, no API calls
- Components use CSS class names from `App.css` — no inline styles except in `FinancialModel.jsx` and occasional one-off overrides
- No props drilling — each section component is self-contained with its own content

### Routing
- 4 routes: `/` (Vision), `/model` (Numbers), `/how-it-works` (Schema), `/regulation` (Legal)
- `Nav.jsx` uses `NavLink` with automatic `.active` class
- `ScrollToTop.jsx` resets scroll position on navigation

### Content Architecture
The site presents the CATSP OS concept in four sections:
1. **Vision** (`/`) — Problem → Idea → Principles → Architecture → Phases
2. **The Numbers** (`/model`) — Interactive financial model with real-time slider calculations
3. **How It Works** (`/how-it-works`) — Data schema, benefit classes, Merkle integrity, AI agents, payment waterfall
4. **Is It Legal?** (`/regulation`) — Feature-by-feature regulatory compliance check against Zambian law

---

## CATSP OS Domain Context

When editing content, understand these domain terms:

- **CATSP:** Comprehensive Agricultural Transformation Support Programme (Zambia's $5.7B agricultural programme)
- **ZATTF:** Zambia Agricultural Transformation Trust Fund (private-sector-led, 3 subsidiaries: ZIRSAT, ZIFSAT, ZINFSAT)
- **ZARETA:** Zambia Agricultural Research and Extension Technical Authority (government coordination)
- **3A Cluster:** Aggregation, Agribusiness, and Association — cooperative farming units (10-30 farmers)
- **SAFF:** Smallholder Agricultural Finance Facility (K500K max loans at 12% through 5 banks)
- **Handshake:** Bilateral verification primitive — two parties independently confirm the same event
- **Forward Contract:** Commitment between processor and cluster for future grain delivery at set price/grade/quantity
- **Payment Waterfall:** Deterministic settlement cascade — warehouse fees → loan repayment → input repayment → insurance → platform fee → farmer net
- **Trust Score:** Behavioural reputation score (0-100) with tiers: Verified (50-64), Established (65-79), Trusted (80-89), Anchor (90+)
- **Merkle Tree:** Tamper-evident integrity mechanism — daily hash root of all transactions
- **ZAMACE:** Zambia Commodity Exchange
- **ZMW:** Zambian Kwacha (currency)

### The Six Primitives
The CATSP OS is built on six atomic primitives: **Handshake** (bilateral verification), **Attestation** (single-party claim with evidence), **Function** (capability-based access), **Organisation** (entity identity), **Forward Contract** (exchange commitment), **Payment Waterfall** (deterministic settlement).

---

## Key Conventions

1. **Dark theme only** — The site uses a dark color scheme. Never add light mode.
2. **No external dependencies** — Keep the dependency count minimal. No Tailwind, no component libraries, no analytics.
3. **Content is code** — All text/data lives in JSX components. There is no CMS or data layer.
4. **Single CSS file** — All styles go in `App.css`. Do not create component-level CSS files.
5. **Confidential content** — This is an NDA-protected document. Do not expose content to external services.
6. **Financial model accuracy** — The `FinancialModel.jsx` component does real financial calculations. Changes to formulas must be verified against the spec.
7. **Domain terminology** — Use exact CATSP terminology (see Domain Context above). Do not simplify or rename domain concepts.
8. **Accessibility via metaphor** — The site explains complex systems through accessible language and metaphors, not jargon. Maintain this voice when editing content.
9. **The archived HTML** — `trust-infrastructure-v01.html` is the original single-file concept note that was decomposed into the React app. Keep it as reference but do not modify it.

---

## CATSP OS Specification Reference (v0.5)

The full CATSP OS platform specification (v0.5, March 2026) defines the system this site presents. Key architectural decisions from the spec that inform this site's content:

### Data Model (PostgreSQL / Supabase)
- ~30 core tables across: users, organisations, forward contracts, deliveries, handshakes, attestations, payments, waterfall, trust scores, cluster governance, conflict resolution, insurance, SAFF loans, audit/integrity
- Capability-based access control (not role-based) — `capabilities` + `user_capabilities` + scopes
- Row-Level Security (RLS) via `auth.has_capability()` function
- Financial privacy: extension officers and implementing partners NEVER see financial data

### Access Control
- ~30 capabilities across 14 modules (contracts, deliveries, financial, quality, training, monitoring, governance, trust, insurance, cases, partner, issues, anomaly, enforcement, admin, audit)
- Scope levels: `own | assigned | district | province | national`
- 12 known presets (farmer_cluster, processor, depot_operator, extension_officer, etc.)
- Adding new participant types requires zero code changes — just capability assignment

### Payment Waterfall Priority (fixed order)
1. Warehouse custody fee → 2. SAFF loan repayment → 3. Input supplier repayment → 4. Insurance premium → 5. Platform fee → 6. Farmer net

### Deployment Phases
- **Phase 0 (PoC):** 1 processor, 1 depot, 1 cluster, manual payments
- **Phase 1 (Pilot):** 10 clusters, 2 depots, automated waterfall, SAFF + insurance
- **Phase 2 (Scale):** National + cross-border
- **Phase 3 (Future):** Tokenised forwards, tradeable warehouse receipts (requires regulatory framework)

### Named Open Gaps (v0.5)
Settlement/escrow architecture, contract marketplace discovery, waterfall async state machine, minimum farmer floor, notification system, offline/connectivity, bank API integration, anomaly engine algorithms, Merkle tree publication target, declining quorum mechanism, RLS performance at scale, API boundary definitions, USSD flow specification.

---

## Git Conventions

- Commit messages are descriptive, present-tense (e.g., "Add logos to Nav, Hero, and Footer")
- No CI/CD or pre-commit hooks configured
- Branch naming: feature branches use descriptive names
