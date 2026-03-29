# CLAUDE.md — ZamaiTrust

**READ THIS FIRST. Every AI assistant session starts here.**

---

## What This Is

ZamaiTrust is the **interactive presentation site** for the CATSP OS — the operating system for Zambia's $5.7B agricultural transformation programme. This repository is the **presentation layer**, not the platform itself.

- **Spec version:** v0.5 (March 2026)
- **Site version:** v0.5 (in sync with spec)
- **Company:** ZamAi Solutions (zamai.pro), Lusaka, Zambia
- **Confidentiality:** Shared under NDA. Do not expose content to public APIs or external services.

---

## CRITICAL WORKFLOWS — Read Before Doing Anything

### Git & Deploy

- **Production branch:** `main` — deploys to Netlify automatically
- **Feature branches:** `claude/<description>` — develop here, merge to `main` when ready
- **Deploy = push to main.** Every push to `main` triggers a Netlify build. Be deliberate.
- **Commit messages:** Present-tense, descriptive. When a commit is intended to deploy, prefix with `[deploy]` (e.g., `[deploy] Update waterfall section with SAFF loan priority`)
- **Always run `npm run build` before pushing to `main`** to catch build errors locally

### Version Tracking — Three Files, Always Updated

Every change that affects the spec, the site, or a design decision MUST update the relevant tracking file:

| File | What It Tracks | When to Update | Rule |
|---|---|---|---|
| `version.json` | Spec version, site version, module status, primitive status, gap status, deployment phases | When a gap closes, a module changes status, or a version ships | Machine-readable. Single source of truth. |
| `decisions.jsonl` | Every architectural decision with rationale, impacts, and supersession chain | When any design decision is made or an existing decision changes | **Append-only. Never edit existing lines.** If a decision changes, add a new entry with `"supersedes": "DEC-NNN"`. |
| `challenges.jsonl` | Threats, vulnerabilities, edge cases, and hard problems we've identified | When a new challenge is discovered during design, review, or conversation | **Append-only.** Track mitigations identified and whether they're sufficient. |
| `CHANGELOG.md` | What changed, when, in which layer (spec vs site), sync status | With every meaningful change | Always include spec and site versions. Note sync status. |

### Decision Log Format (`decisions.jsonl`)

```json
{
  "id": "DEC-NNN",
  "date": "YYYY-MM-DD",
  "category": "architecture | access_control | privacy | governance | financial | trust | conflict | enforcement | technology | authentication | integrity",
  "title": "Short title",
  "decision": "What was decided",
  "rationale": "Why",
  "spec_version": "0.5",
  "decided_by": "Who",
  "status": "final | provisional | superseded",
  "supersedes": "DEC-NNN or null",
  "impacts": ["list", "of", "affected", "modules"]
}
```

**Current decision count:** DEC-001 through DEC-015 (15 foundational decisions). Next ID: DEC-016.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Bundler | Vite | 8.x |
| Routing | React Router DOM | 7.x |
| Styling | Pure CSS (no framework) | Custom design system in `App.css` |
| Fonts | Google Fonts (Syne, Cormorant Garamond, DM Sans, JetBrains Mono) | Loaded in `index.html` |
| Hosting | Netlify | Auto-deploy from `main` via `vite build` → `dist/` |

No Tailwind. No component library. No state management library. No testing framework. No TypeScript.

---

## Project Structure (v0.5)

```
ZamaiTrust/
├── CLAUDE.md                   # THIS FILE — read first
├── CHANGELOG.md                # Human-readable change narrative
├── version.json                # Machine-readable version & status tracking
├── decisions.jsonl             # Append-only decision log (never edit existing lines)
├── index.html                  # Entry HTML — loads Google Fonts, mounts #root
├── vite.config.js              # Vite config (React plugin only)
├── package.json                # Dependencies: react, react-dom, react-router-dom
├── trust-infrastructure-v01.html  # Original v0.1 HTML concept note (archived, do not modify)
├── public/
│   ├── AI.png                  # Nav logo (small)
│   └── ZAMAI.png               # Full logo (hero + footer)
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # BrowserRouter + 7 routes + Nav
│   ├── App.css                 # ALL styles — single file, custom design system
│   ├── pages/
│   │   ├── VisionPage.jsx      # Route: / — Hero, Problem, Solution, CATSP Mapping, ZATTF
│   │   ├── SystemPage.jsx      # Route: /system — Six Primitives, Merkle tree
│   │   ├── ParticipantsPage.jsx # Route: /participants — 12 types, Privacy Principle
│   │   ├── GovernancePage.jsx  # Route: /governance — Trust scores, Cluster gov, Conflict resolution
│   │   ├── ModelPage.jsx       # Route: /model — Interactive financial model
│   │   ├── PlanPage.jsx        # Route: /plan — Phases, Named gaps, Tech stack
│   │   └── RegulationPage.jsx  # Route: /regulation — Regulatory table, Closing
│   └── components/
│       ├── Nav.jsx             # Fixed top nav (7 links)
│       ├── Hero.jsx            # Landing hero (v0.5)
│       ├── Footer.jsx          # Reusable footer (v0.5)
│       ├── ScrollToTop.jsx     # Scroll-to-top on route change
│       ├── Divider.jsx         # Emerald-green horizontal rule
│       ├── SectionHeader.jsx   # Numbered section header
│       ├── FinancialModel.jsx  # Interactive slider-based financial model (14 sliders)
│       ├── TrustDiagrams.jsx   # SVG diagrams (CoreLoop, ForwardLifecycle, DualSignature, InsuranceFlow, ThreeLayerArchitecture, InternationalCapital)
│       └── [v0.1 components]   # Old section components kept for reference (ProblemSection, IdeaSection, etc.) — not imported
```

---

## Site Architecture (v0.5)

### 7 Routes

| Route | Nav Label | Content |
|---|---|---|
| `/` | Vision | Hero, problem (CATSP disconnection), solution (one OS), SP1-SP7 mapping, ZATTF integration |
| `/system` | The System | Six primitives (Handshake, Attestation, Function, Organisation, Forward Contract, Waterfall), Merkle tree |
| `/participants` | Participants | 12 types in 3 groups (value chain, government, service), Privacy Principle |
| `/governance` | Governance | Trust scores (4 tiers), cluster self-governance, right to exit, 4-tier conflict resolution |
| `/model` | Numbers | Interactive financial model with 14 sliders |
| `/plan` | The Plan | 4 deployment phases, 13 named open gaps, tech stack |
| `/regulation` | Legal | 18 regulatory items with traffic-light status, closing |

### Component Pattern
- Pages are self-contained with content data arrays + JSX rendering
- Shared components: Nav, Hero, Footer, Divider, SectionHeader, ScrollToTop, FinancialModel, TrustDiagrams
- All content hardcoded in JSX — no CMS, no data files, no API calls

---

## Design System

All styles in `src/App.css`. CSS custom properties in `:root`.

### Colors
- **Base/surface:** `--base` through `--s4` (dark grays)
- **Emerald green (primary):** `--eg` through `--eg-hi`
- **Copper (secondary):** `--cu` through `--cu-hi`
- **Text:** `--t1` (brightest) through `--t4` (dimmest)
- **Status:** `--green`, `--amber`, `--red`

### Typography
- **Display:** Syne — **Serif:** Cormorant Garamond — **Body:** DM Sans — **Mono:** JetBrains Mono

### Key CSS Classes
- `.sec` / `.sec-alt` / `.sec-eg` — section containers
- `.eye` — eyebrow label — `.h1`/`.h2`/`.h3` — headings — `.p` — paragraphs — `.pull` — pull quotes
- `.card` / `.card-grid` / `.card-grid-3` — cards — `.agent-card` / `.agent-grid` — participant cards
- `.flow` / `.flow-node` / `.flow-arrow` — flow diagrams — `.layer-stack` / `.layer` — layer diagrams
- `.btable` / `.ftable` / `.summary` — tables — `.code-block` — code display
- `.feature` / `.status` / `.status-clear` / `.status-gap` / `.status-blocker` — regulatory items
- `.note` — callout boxes — `.risk-item` — gap/risk items
- `.merkle` / `.merkle-node` — Merkle tree visualization
- `.fade` / `.d1`–`.d4` — entrance animations

### Responsive
Mobile breakpoint at 820px. Grids → single column. Tables → horizontal scroll.

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build → dist/ (RUN BEFORE PUSHING TO MAIN)
npm run preview      # Preview production build locally
```

---

## CATSP OS Domain Context

### Key Terms
- **CATSP:** Comprehensive Agricultural Transformation Support Programme ($5.7B, 10-year)
- **ZATTF:** Zambia Agricultural Transformation Trust Fund (3 subsidiaries: ZIRSAT, ZIFSAT, ZINFSAT)
- **ZARETA:** Zambia Agricultural Research and Extension Technical Authority
- **3A Cluster:** Aggregation, Agribusiness, Association — cooperative farming units (10-30 farmers)
- **SAFF:** Smallholder Agricultural Finance Facility (K500K max, 12%, 5 banks)
- **ZAMACE:** Zambia Commodity Exchange — **ZMW:** Zambian Kwacha

### The Six Primitives
1. **Handshake** — bilateral verification (sacred: do not add steps)
2. **Attestation** — single-party claim with evidence + optional corroboration
3. **Function** — capability-based access (what you can do, not who you are)
4. **Organisation** — entity identity with affiliations + hierarchy
5. **Forward Contract** — exchange commitment at set price/quantity/grade/time
6. **Payment Waterfall** — deterministic settlement: warehouse → SAFF → inputs → insurance → platform → farmer

### Key Design Decisions (see `decisions.jsonl` for full list)
- Capability-based access control, not roles (DEC-002)
- Nobody sees the farmer's money (DEC-003)
- One member, one vote — always (DEC-004)
- Right to exit — unconditional (DEC-005)
- Handshake is sacred — do not add steps (DEC-006)
- Audit log is append-only, no UPDATE or DELETE — ever (DEC-015)

---

## Key Conventions

1. **Dark theme only** — never add light mode
2. **No external dependencies** — no Tailwind, no component libraries, no analytics
3. **Content is code** — all text/data lives in JSX
4. **Single CSS file** — all styles in `App.css`
5. **Confidential** — NDA-protected, do not expose to external services
6. **Financial model accuracy** — verify formula changes against the spec
7. **Domain terminology** — use exact CATSP terms, do not simplify
8. **Accessible voice** — explain complex systems through metaphors, not jargon
9. **Version tracking** — update `version.json`, `decisions.jsonl`, and `CHANGELOG.md` with every meaningful change
10. **Deploy discipline** — run `npm run build` before pushing to `main`, prefix deploy commits with `[deploy]`
11. **Archived reference** — `trust-infrastructure-v01.html` is read-only, never modify
