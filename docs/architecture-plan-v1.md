# CATSP OS Platform Architecture Plan

## Context

ZamAi Solutions needs to build a **modular platform** — like Odoo, but for development programmes. The first configuration is the CATSP OS (Zambia's $5.7B agricultural transformation). But the modules themselves should be general-purpose: contracts, verification, governance, treasury, reputation — tools that work for agricultural value chains, NGO impact measurement, project management, or cooperative governance.

The spec (v0.5) defines ~30 tables, ~30 capabilities, 12 presets, 6 primitives, and 13 open gaps. The platform must work offline in rural Zambia, serve feature phones via USSD, and scale from 5 users (Phase 0) to 40,000+ (Phase 2).

**Two core constraints:**
1. **Modular.** Each module ships independently. New modules don't break existing ones. CATSP-specific logic is configuration (data), not code.
2. **Zambia-first.** Offline-first, USSD for feature phones, mobile money payments, 2G-friendly. If it doesn't work in Batoka, it doesn't work.

---

## 1. The Modularity Architecture

### The Odoo Parallel — But More Generic

Odoo works because every module (Sales, Inventory, Accounting) is a **general-purpose tool** that gets configured for a specific business. "Sales" isn't hardcoded for any industry — it's a framework for managing deals, configured by each company.

Same principle here. The modules should NOT be "CATSP-specific agricultural tools." They should be **general-purpose capabilities** that CATSP configures. This makes them reusable:

| General Module | CATSP Configuration | Also Useful For |
|---|---|---|
| **Contracts** | Forward contracts for grain | Any supply chain commitment |
| **Verification** | Handshake on grain delivery | Any bilateral verification (NGO impact, project milestones) |
| **Claims & Evidence** | Attestations for quality, training, monitoring | Impact measurement, M&E reporting, audit evidence |
| **Access & Permissions** | Capability presets for farmers, processors, etc. | Any role-based system with custom permissions |
| **Treasury & Payments** | Waterfall settlement for grain value chain | Project fund management, grant disbursement |
| **Governance** | Cluster democracy, proposals, voting | Any cooperative, association, or community governance |
| **Reputation** | Trust scores from delivery track record | Partner performance tracking, supplier rating |
| **Dispute Resolution** | 4-tier agricultural dispute system | Any structured conflict resolution |
| **Integrity** | Merkle tree + audit log + anomaly detection | Compliance, anti-fraud for any programme |
| **Field Operations** | Extension officer visits, partner tracking | NGO field monitoring, project management |
| **Notifications** | SMS/USSD for farmers | Any multi-channel communication system |

**The CATSP OS is a *configuration* of these general modules, not the modules themselves.**

An NGO could use the same platform with:
- **Claims & Evidence** → impact measurement (attestation: "training delivered to 40 women in Choma")
- **Field Operations** → M&E visits (attestation: "site visit, beneficiaries interviewed, GPS + photos")
- **Governance** → community decision-making (proposals, votes)
- **Treasury & Payments** → grant disbursement with multi-sig approval
- **Reputation** → partner performance tracking across seasons

A project management use case could use:
- **Contracts** → project milestones with deliverables
- **Verification** → milestone sign-off (bilateral handshake between implementer and funder)
- **Treasury & Payments** → staged disbursement tied to verified milestones
- **Claims & Evidence** → progress reports, field evidence
- **Integrity** → audit trail for donor compliance

### Module Structure

Each module is a **self-contained, general-purpose unit** with its own:
- Database tables (in a shared PostgreSQL database, namespaced by module)
- RLS policies (all checking the same `auth.has_capability()` function)
- Edge Functions (business logic for that domain)
- API endpoints (via PostgREST + custom Edge Functions)
- Frontend pages (React components, lazy-loaded)
- Configuration layer (CATSP-specific settings are data, not code)

```
catsp-os/
├── supabase/
│   ├── migrations/
│   │   ├── 00_foundation/          ← ALWAYS FIRST — identity, permissions, audit, claims
│   │   │   ├── 001_users.sql
│   │   │   ├── 002_organisations.sql
│   │   │   ├── 003_capabilities.sql
│   │   │   ├── 004_auth_functions.sql   ← auth.has_capability(), auth.scoped_values()
│   │   │   ├── 005_audit_log.sql
│   │   │   └── 006_attestations.sql     ← universal claim table (quality, training, M&E, any evidence)
│   │   │
│   │   ├── 10_contracts/            ← Module: commitments between parties (forwards, milestones, any agreement)
│   │   │   ├── 001_seasons.sql      ← time periods (ag seasons, project phases, fiscal years)
│   │   │   ├── 002_items.sql        ← what's being exchanged (commodities, services, deliverables)
│   │   │   ├── 003_contracts.sql    ← the commitment itself
│   │   │   └── 004_contract_items.sql
│   │   │
│   │   ├── 20_verification/         ← Module: bilateral confirmation (handshake pattern)
│   │   │   ├── 001_deliveries.sql   ← physical movements or milestone completions
│   │   │   ├── 002_handshakes.sql   ← two-party verification
│   │   │   └── 003_advances.sql     ← inputs/resources advanced against a contract
│   │   │
│   │   ├── 30_treasury/             ← Module: fund management, staged payments, waterfall
│   │   ├── 40_governance/           ← Module: proposals, votes, constitutions, memberships
│   │   ├── 50_reputation/           ← Module: behavioural scoring, tier system
│   │   ├── 60_disputes/             ← Module: cases, mediation, arbitration, enforcement
│   │   ├── 70_integrity/            ← Module: merkle tree, anomaly detection, whistleblower
│   │   └── 80_field_ops/            ← Module: assignments, partner tracking, early warnings, M&E
│   │
│   ├── functions/                   ← Edge Functions (business logic, one folder per module)
│   │   ├── foundation/
│   │   │   └── capability-check/    ← JWT capability cache refresh
│   │   ├── verification/
│   │   │   ├── handshake-confirm/   ← Core bilateral verification logic
│   │   │   └── contract-match/      ← Contract discovery/notification
│   │   ├── treasury/
│   │   │   ├── waterfall-trigger/   ← Staged settlement state machine
│   │   │   └── waterfall-settle/    ← Per-line settlement + retry
│   │   ├── reputation/
│   │   │   └── score-recalc/        ← Score recomputation on verified events
│   │   ├── integrity/
│   │   │   ├── merkle-build/        ← Daily hash root computation
│   │   │   └── anomaly-scan/        ← Pattern detection engine
│   │   └── notifications/
│   │       ├── sms-send/            ← Africa's Talking SMS gateway
│   │       └── ussd-handler/        ← USSD session management
│   │
│   └── seed/                        ← Seed data per phase
│       ├── phase0_poc.sql
│       └── phase1_pilot.sql
│
├── packages/                        ← Shared code (monorepo)
│   ├── shared/                      ← Types, constants, validation shared across all channels
│   │   ├── capabilities.ts          ← Capability IDs, preset definitions
│   │   ├── waterfall.ts             ← Waterfall calculation (same logic, all channels)
│   │   ├── trust.ts                 ← Trust score calculation
│   │   └── validation.ts            ← Input validation rules
│   │
│   ├── sync/                        ← Offline sync engine
│   │   ├── queue.ts                 ← Action queue (IndexedDB)
│   │   ├── resolver.ts              ← Conflict resolution strategies
│   │   └── reconcile.ts             ← Sync-when-connected logic
│   │
│   └── ussd/                        ← USSD flow definitions
│       ├── flows/                   ← Menu trees per action
│       │   ├── delivery.ts          ← Confirm delivery (3 screens)
│       │   ├── vote.ts              ← Vote on proposal (2 screens)
│       │   └── balance.ts           ← Check balance (1 screen)
│       └── session.ts               ← Stateless session management
│
├── apps/
│   ├── web/                         ← React PWA (main app)
│   │   ├── src/
│   │   │   ├── modules/             ← One folder per module (mirrors supabase/migrations)
│   │   │   │   ├── contracts/       ← Commitments, agreements UI
│   │   │   │   ├── verification/    ← Deliveries, handshakes UI
│   │   │   │   ├── treasury/        ← Payments, waterfall UI
│   │   │   │   ├── governance/      ← Proposals, voting, memberships UI
│   │   │   │   ├── reputation/      ← Scores, tiers UI
│   │   │   │   ├── disputes/        ← Case management UI
│   │   │   │   ├── field-ops/       ← Assignments, M&E, attestations UI
│   │   │   │   └── admin/           ← User management, capabilities, presets UI
│   │   │   ├── core/                ← Auth, layout, nav, offline sync
│   │   │   └── dashboard/           ← Role-specific landing pages
│   │   └── public/
│   │
│   ├── ussd-gateway/                ← Africa's Talking webhook handler
│   │   └── src/
│   │       ├── handler.ts           ← USSD callback processor
│   │       └── sms-fallback.ts      ← SMS for complex responses
│   │
│   └── site/                        ← Current ZamaiTrust presentation site
│       └── (existing React site — untouched)
│
├── docs/                            ← Existing design docs (carried over)
├── version.json                     ← Spec + platform version tracking
├── decisions.jsonl                  ← Append-only decision log
├── challenges.jsonl                 ← Threat tracking
└── CHANGELOG.md
```

### The Configuration Principle — CATSP Is Data, Not Code

Every CATSP-specific detail lives in the database as configuration, not in the codebase:

| What | Where it lives | Not in code because |
|---|---|---|
| "White Maize, Grade A, aflatoxin ≤10ppb" | `items` + `grading_standards` rows | Another programme might track school supplies or construction materials |
| "farmer_cluster sees own financial data only" | `presets` + `preset_capabilities` rows | An NGO might have "field_officer" with different permissions |
| "Waterfall: warehouse 2% → SAFF → inputs → insurance → platform 1.5% → farmer" | `waterfall_config` JSON row | A grant programme would have: "overhead 7% → partner → beneficiary" |
| "Season 2026-maize-southern, Oct-Jul" | `seasons` row | A project might have "Phase 1 Q1-Q2 2027" |
| "Trust score weights: delivery 30%, quality 25%, ..." | `trust_score_config` JSON row | An M&E system might weight "report quality 40%, timeliness 30%, ..." |
| "Contract acceptance: 60% quorum, simple majority, 72hrs" | `governance_config` JSON row | A community org might need "75% quorum, 48hrs" |

**The code provides the engine. The data provides the rules.** Switch the data, and the same engine runs a different programme.

### The Foundation Layer (Module 00) — Build First, Never Rewrite

This is the non-negotiable core. Every module depends on it. Get it right once:

| Table | Purpose | Why it's foundation |
|-------|---------|-------------------|
| `users` | Identity | Every other table references users |
| `organisations` | Entities | Every business relationship is between organisations |
| `user_affiliations` | Membership | One user, many orgs |
| `capabilities` | Permission definitions | The access control vocabulary |
| `user_capabilities` | Permission grants | Who can do what |
| `user_capability_scopes` | Permission boundaries | How far each grant reaches |
| `presets` + `preset_capabilities` | Convenience bundles | Quick setup for common types |
| `user_auth_profiles` | Auth methods | Google OAuth, SIM OTP, mobile money |
| `audit_log` | Every action recorded | Append-only, foundation of trust |
| `attestations` | Universal claim table | Quality, training, monitoring — all go here |

Plus two critical functions:
```sql
auth.has_capability(cap_id text, required_scope text) → boolean
auth.scoped_values(cap_id text, scope_type text) → text[]
```

**Every RLS policy on every table in every module calls these two functions.** This is the Odoo-like magic — one permission model, enforced everywhere.

### Module Dependencies (Build Order)

```
Foundation (00) ← identity, permissions, audit, claims — everything depends on this
    │
    ├── Contracts (10) ← commitments between parties
    │       │
    │       └── Verification (20) ← bilateral confirmation of deliveries/milestones
    │               │
    │               ├── Treasury (30) ← payments triggered by verified events
    │               │
    │               └── Reputation (50) ← scores computed from verified events
    │
    ├── Governance (40) ← needs foundation only (proposals, voting, memberships)
    │
    ├── Disputes (60) ← needs contracts + verification + reputation
    │
    ├── Integrity (70) ← needs audit_log from foundation
    │
    └── Field Ops (80) ← needs attestations from foundation + governance
```

**Phase 0 builds:** Foundation + Contracts + Verification + Governance (display-only treasury)
**Phase 1 adds:** Treasury + Reputation + Disputes + Field Ops + Integrity + Notifications + USSD

**Other configurations (non-CATSP):**
- NGO impact measurement: Foundation + Field Ops + Verification + Governance
- Project management: Foundation + Contracts + Verification + Treasury
- Cooperative management: Foundation + Governance + Treasury + Reputation

---

## 2. Farmer Access: Kiosk Model (Not Individual Devices)

### The Insight

Not every farmer needs the app on their phone. What they need is:
1. **Proof of delivery** (receipt)
2. **Knowledge of what they're owed** (waterfall breakdown)
3. **Ability to vote** on proposals
4. **Ability to dispute** if something's wrong

A **kiosk at the aggregation point** handles #1 and #2 at the exact moment the handshake happens — the farmer is physically present when grain is weighed and graded.

### Kiosk Hardware

```
Aggregation Point (Monze warehouse / Yumi depot)
├── Tablet (rugged, wall-mounted or counter-mounted)
│   ├── Always online (fixed location, fixed power, WiFi/ethernet or mobile router)
│   ├── Platform PWA running in kiosk mode
│   └── Camera for QR scanning (bags)
├── NFC reader (USB, ~$10)
│   └── Farmer taps NFC card + enters 4-digit PIN → identity confirmed
│   └── Two-factor: something you have (card) + something you know (PIN)
│   └── Cards: ~K15-30 each, rugged, no batteries, survives field conditions
├── Receipt printer (thermal, USB)
│   └── Prints: delivery reference, quantity, grade, waterfall breakdown, QR code
└── Scale integration (future — digital scale feeds weight directly into system)
```

### Why This Is Better Than Individual Devices for Phase 0

| Problem | Individual Phone | Kiosk |
|---|---|---|
| Farmer doesn't have smartphone | Need USSD/SMS fallback (complex) | Not an issue — kiosk has the tablet |
| Connectivity in rural areas | Offline-first on every device | One fixed point with dedicated internet |
| Battery / solar dependency | Phone dies, can't confirm delivery | Kiosk has fixed power |
| Literacy for complex UI | USSD limited to 3 screens | Full UI, operator assists if needed |
| Identity verification | SIM OTP / mobile money binding | NFC card + PIN — no phone needed |
| Proof of delivery | SMS (easy to lose/delete) | Printed receipt farmer takes home |
| Cost per farmer | Each needs a capable device | One kiosk serves hundreds of farmers |

### How the Handshake Works at the Kiosk

```
1. Farmer arrives at Monze warehouse with grain
2. Kagezi operator weighs grain, grades it, enters data on kiosk tablet
3. Farmer taps NFC card on reader → enters 4-digit PIN → identity confirmed
4. Screen shows: "2,000kg Grade A pearl millet. Confirm? [Yes / Dispute]"
5. Farmer taps Yes (or operator reads aloud, farmer confirms verbally + PIN confirms)
6. Handshake confirmed — both parties verified, same device, same moment
7. Receipt prints: delivery ref, quantity, grade, estimated waterfall breakdown, QR code
8. Farmer takes receipt home. Done.
```

The **handshake primitive is unchanged** — two parties verify the same event. They just happen to be at the same physical location using the same device, identified by fingerprint instead of phone.

### What Still Needs Remote Access (Later Phases)

| Need | Phase 0 Solution | Phase 1+ Solution |
|---|---|---|
| **Voting on proposals** | SMS reply (yes/no to incoming SMS) or vote at kiosk on next visit | PWA on phone, or SMS, or kiosk |
| **Checking balance** | SMS notification when mobile money payment arrives | PWA dashboard |
| **Filing disputes** | At the kiosk, or call Kagezi/Yumi directly | PWA or kiosk |
| **Viewing contracts** | At the kiosk during next visit | PWA |

### What This Removes from Phase 0 Scope

- ~~USSD gateway~~ — not needed if farmers use kiosks
- ~~Offline-first for farmer devices~~ — kiosk has fixed connectivity
- ~~PowerSync~~ — defer to Phase 1 when individual farmer access is added
- ~~Mobile money auth binding~~ — fingerprint at kiosk handles identity

### What This Adds to Phase 0 Scope

- **NFC + PIN auth** — USB NFC reader integration (Web NFC API or Web Serial), 4-digit PIN entry
- **Receipt printing** — thermal printer integration (browser Print API or direct USB)
- **Kiosk mode** — PWA locked to single-purpose interface (no browser chrome)
- **PowerSync on kiosk only** — in case warehouse internet drops mid-day, queue transactions locally

### Connectivity Strategy (Simplified)

```
Kiosk (Monze warehouse)          Supabase Cloud
├── Fixed internet (WiFi/4G)  ←→  PostgreSQL + Auth + Realtime
├── PowerSync (local SQLite)      Sync when connected
│   └── Queues handshakes if internet drops
│   └── Syncs when connection returns
└── Receipt printer (local, no internet needed)
```

The kiosk always has internet. PowerSync is the **safety net** for the 10 minutes per day the internet drops — not the primary mode. This is dramatically simpler than building offline-first for every farmer's phone.

---

## 3. Multi-Channel Architecture

Same backend, three delivery channels (USSD deferred):

```
                    ┌─── React PWA — kiosk mode (aggregation points)
                    │
Supabase Backend ───┼─── React PWA — full mode (processors, admin, government dashboards)
                    │
                    ├─── SMS Service (notifications — payment confirmations, vote invitations)
                    │
                    └─── PDF Generator (reports for HCAT/CSC, receipts for offline backup)
```

**Phase 1+ adds:** USSD gateway (Africa's Talking) for individual farmer access on feature phones, and full PWA for smartphones. The kiosk model proves the platform works before adding channel complexity.

---

## 4. RLS Performance Strategy

### The Problem
`auth.has_capability()` hits `user_capabilities` + `user_capability_scopes` on every query. At 40,000+ users with multiple policies per table, this is slow.

### Solution: JWT Capability Cache

At login:
1. User authenticates (OAuth / SIM OTP / mobile money)
2. Edge Function queries their full capability set
3. Capabilities encoded as **JWT custom claims**: `{ "caps": ["contracts.view:district:Choma", "deliveries.handshake:own", ...] }`
4. JWT refreshed every 15 minutes or on capability change
5. RLS policies check JWT claims (in-memory, no DB hit) instead of querying tables

```sql
-- Fast: check JWT claim (no DB query)
CREATE OR REPLACE FUNCTION auth.has_capability_fast(cap_id text, required_scope text)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(
      auth.jwt() -> 'app_metadata' -> 'caps'
    ) AS cap
    WHERE cap LIKE cap_id || ':' || required_scope || ':%'
       OR cap LIKE cap_id || ':national:%'
  );
$$ LANGUAGE sql STABLE;
```

**Fallback:** If JWT doesn't contain caps (edge case, first login), fall back to the DB query. Materialised views for aggregate dashboards (government/ZARETA).

---

## 5. Phase 0: Kagezi Seeds × Yumi Milling Pilot

### The Real Pilot

Phase 0 is not a test environment. It's a **live pilot** with two real Zambian companies:

- **Kagezi Seeds Limited** — seed company breeding climate-resilient varieties (pearl millet, sorghum, sunflower, groundnuts, beans, cowpeas, pigeon peas, rice). Farmer networks across provinces. Warehouse in Monze. Partner of Caritas Czech Republic. Developing value-added products including millet-based munkoyo.
- **Yumi Milling** — registered Zambian processor currently milling maize and soya, expanding into multi-grain processing (flour, meal, oil, dehulling, grading, packaging).

### Pilot Location: Monze, Southern Province

Kagezi's warehouse is in Monze. Farmers are in surrounding areas. ZamAi is in Batoka (also Southern Province). The pilot runs close to home.

### How They Map to the Platform

| Platform Role | Real Entity | Notes |
|---|---|---|
| **Processor** | Yumi Milling | Posts contracts, receives grain, processes, triggers waterfall |
| **Seed Supplier** | Kagezi Seeds | Supplies improved seed varieties to farmers (climate-smart crops) |
| **Aggregator / Warehouse** | Kagezi Seeds (Monze warehouse) | Collects, grades, stores grain from farmer networks |
| **Farmer Clusters (Kagezi)** | Kagezi's existing farmer networks | Deliver climate-smart crops (millet, sorghum, etc.) against contracts |
| **Farmer Clusters (independent)** | Non-Kagezi farmers near Monze | Deliver maize and soya directly to Yumi — no Kagezi involvement |

**Two farmer streams from day 1:**
- **Kagezi-associated farmers** deliver climate-smart crops (pearl millet, sorghum, sunflower, groundnuts, etc.) through Kagezi's aggregation network
- **Independent farmers** deliver maize and soya directly to Yumi — Yumi's existing core business

Both streams use the same platform, same primitives, same handshakes. The difference is organisational affiliation and which commodities flow through.

**Kagezi wears multiple hats** — seed supplier + aggregator + warehouse operator. In the platform, this is one `organisation` with multiple `user_affiliations` and capability sets. No architectural problem.

### Contract Flows

**Phase 0: Purchase contracts only** (simplest flow, proves the core)

Two purchase streams running through the same system:

**Stream 1: Climate-smart crops via Kagezi**
```
Kagezi farmers → deliver millet/sorghum → Kagezi warehouse Monze (handshake) → Yumi buys → waterfall settles
```
Kagezi aggregates. Yumi posts buy contracts for climate-smart crops. Farmers deliver against them.

**Stream 2: Maize/soya direct to Yumi**
```
Independent farmers → deliver maize/soya → Yumi (handshake) → waterfall settles
```
Yumi's existing business. No Kagezi involvement. Same platform, same handshake.

**Phase 1 adds: Toll/contract processing** (Kagezi retains ownership, Yumi processes for a fee — for munkoyo products etc.)
```
Kagezi sends grain → Yumi mills (handshake on receipt) → Yumi returns processed product → Kagezi sells under own brand
```
Different contract type (`toll_processing`), different waterfall config, same primitives. Added when the purchase flow is proven.

### Multi-Crop from Day 1

The `items` table (commodities) needs Yumi's current crops AND Kagezi's portfolio:

**Yumi's existing business (independent farmers):**

| Crop | Source | Yumi Processing |
|---|---|---|
| White maize | Independent farmers, Monze area | Roller meal, flour, stockfeed |
| Soya beans | Independent farmers | Soya meal, oil, animal feed |

**Kagezi's climate-smart portfolio (Kagezi farmer networks):**

| Crop | Kagezi Role | Yumi Processing |
|---|---|---|
| Pearl millet | Seed, aggregation, grading | Flour, meal, contract milling for munkoyo |
| Sorghum | Seed, aggregation | Flour, brewing grits, animal feed |
| Sunflower | Seed, aggregation | Oil pressing, cake (feed byproduct) |
| Groundnuts | Seed, mobilisation | Peanut butter, oil, roasted snacks |
| Rice | Seed, aggregation | Dehulling, polishing, grading |
| Beans / Cowpeas / Pigeon peas | Seed, quality assurance | Sorting, grading, splitting, flour |

Each crop has its own `grading_standards` rows. The platform doesn't care what flows through it — the modules are crop-agnostic. Phase 0 starts with maize, soya, pearl millet, and sorghum. Others added as Kagezi's farmer networks scale.

### Sprint Sequence (Revised for Real Pilot)

**Sprint 0: Foundation (2 weeks)**
1. Supabase project setup (hosted)
2. Foundation migrations: users, organisations, affiliations, capabilities, presets, audit_log, attestations
3. `auth.has_capability()` + `auth.scoped_values()` functions
4. RLS policies on foundation tables
5. Auth: NFC card + PIN (kiosk farmers) + Google OAuth (Yumi/Kagezi admin) + phone OTP (fallback)
6. Seed data: Yumi Milling (processor), Kagezi Seeds (supplier + aggregator + warehouse in Monze), pilot farmer group with NFC card registration, commodities (maize, soya, pearl millet, sorghum), grading standards per crop
7. React app shell with auth + capability-gated routing + kiosk mode

**Sprint 1: Contracts + Verification + Kiosk (2 weeks)**
1. Migrations: seasons, items (commodities), grading_standards, contracts, deliveries, handshakes, advances
2. Purchase contract flow (Yumi buys grain) — toll processing deferred to Phase 1
3. RLS policies
4. Edge Function: `handshake-confirm` — bilateral verification
5. Kiosk UI: operator enters weight/grade → farmer taps NFC card + PIN → handshake recorded → receipt prints
6. Admin UI: Yumi posts buy contract for pearl millet → visible at kiosk for Kagezi farmers
7. NFC reader + receipt printer integration (Web NFC API / Web Serial API)

**Sprint 2: Governance + Display Waterfall (2 weeks)**
1. Governance migrations: treasury, proposals, votes, memberships
2. SMS-based voting (Africa's Talking — simple inbound/outbound SMS, not USSD)
3. Waterfall calculation — display only (shows the split, receipt prints the breakdown, human executes payment)
4. Basic trust score engine
5. Dashboards: Yumi sees contracts + deliveries. Kagezi sees farmer performance + warehouse inventory. Farmer sees their history at kiosk.

**Sprint 3: Resilience + Field Prep (2 weeks)**
1. PowerSync on kiosk tablet — queue transactions when internet drops, sync when back
2. QR codes for bag-level traceability
3. SMS notifications: payment confirmation to farmer's phone when mobile money hits
4. Kiosk hardening: auto-restart on crash, lock to PWA, physical mounting plan
5. Field test preparation with Kagezi's Monze team — farmer NFC card registration day (issue cards, set PINs, test tap-and-confirm flow)

**Phase 0 total: ~8 weeks to a testable PoC with kiosk at Monze warehouse, processing real pearl millet and sorghum with Kagezi farmers, plus maize/soya from independent farmers.**

---

## 6. Key Technical Decisions Needed

Before writing code, these must be resolved:

| Decision | Options | Recommendation | Why |
|---|---|---|---|
| **Backend** | Supabase / PocketBase / Custom | **Supabase** (+ PowerSync on kiosk only) | PostgreSQL + RLS maps directly to capability model. Auth built in (OAuth + OTP). PowerSync as safety net on kiosk tablet for internet drops — not primary offline strategy. |
| **Farmer access** | Individual phones / USSD / Kiosk | **Kiosk at aggregation point** | Rugged tablet + fingerprint scanner + receipt printer. Farmer doesn't need a phone. Fixed power, fixed internet. USSD deferred to Phase 1+. |
| **Monorepo tool** | Turborepo / Nx / pnpm workspaces | pnpm workspaces | Simplest. No build orchestration needed yet. |
| **TypeScript?** | Yes / No | Yes (strict) | Type safety for capabilities, presets, waterfall math. Catches bugs at compile time. |
| **Supabase hosted vs self-hosted** | Hosted / Self-hosted | Hosted for Phase 0-1, self-host option for Phase 2+ | Speed to market. Data sovereignty conversation later. |
| **USSD provider** | Africa's Talking / Zamtel direct | Africa's Talking | Better API, multi-country support for Phase 2. |
| **State management** | Zustand / Jotai / TanStack Query | TanStack Query + Zustand | TanStack for server state/cache, Zustand for local UI state. Minimal footprint. |
| **CSS framework** | Tailwind / Pure CSS | Tailwind | Brand guide specifies it for platform (DEC-013). Presentation site stays pure CSS. |

---

## 7. Migration Path

The current ZamaiTrust repo contains the presentation site + spec tracking. The platform is a new codebase that inherits the tracking files:

1. Create new repo: `catsp-os` (or extend current repo with `apps/` structure)
2. Carry over: `version.json`, `decisions.jsonl`, `challenges.jsonl`, `CHANGELOG.md`, `docs/`
3. Presentation site moves to `apps/site/` (or stays in current repo as-is)
4. Platform lives in `apps/web/` + `supabase/` + `packages/`
5. Both repos reference the same spec version

**Recommendation:** Extend the current repo into a monorepo. The tracking files stay at root. The presentation site moves to `apps/site/`. The platform grows alongside it.

---

## 8. Verification Plan

### How to test that the architecture works (using Kagezi × Yumi data):

1. **Foundation test:** Create Kagezi farmer with `farmer_cluster` preset. Verify they see their own deliveries to Monze warehouse but not another cluster's data.
2. **Multi-hat test:** Create Kagezi Seeds as organisation with affiliations: seed_supplier + aggregator + warehouse_operator. Verify different capabilities activate for each role.
3. **Purchase handshake:** Kagezi farmer delivers pearl millet to Monze warehouse. Both parties submit claims. Matching = confirmed. Mismatching = disputed.
4. **Toll processing handshake:** Kagezi sends grain to Yumi for milling. Yumi confirms receipt. Different contract type, same handshake primitive.
5. **Multi-crop test:** Post contracts for pearl millet AND sorghum. Verify grading standards differ per commodity. Verify waterfall works for both.
6. **Kiosk resilience test:** Disconnect kiosk internet mid-delivery. Verify handshake queues locally (PowerSync). Reconnect. Verify it syncs and receipt prints.
7. **Waterfall test (purchase):** Trigger confirmed handshake on a purchase contract. Verify waterfall: warehouse fee → supplier repayment → farmer net.
8. **Waterfall test (toll):** Trigger confirmed handshake on a toll contract. Verify waterfall: processing fee to Yumi → product returned to Kagezi.
9. **Capability composition:** Take a Kagezi farmer, add `contracts.create`. Verify they can now post their own spot sale — zero code changes.
10. **RLS privacy:** Verify Yumi cannot see Kagezi's farmer-level financials. Verify Kagezi farmers cannot see Yumi's processing margins.

---

## Critical Files to Create First

| File | Purpose |
|---|---|
| `supabase/migrations/00_foundation/001_users.sql` | User identity (includes NFC card UID field + PIN hash) |
| `supabase/migrations/00_foundation/003_capabilities.sql` | The permission vocabulary |
| `supabase/migrations/00_foundation/004_auth_functions.sql` | `has_capability()` + `scoped_values()` |
| `packages/shared/capabilities.ts` | Capability constants shared across all channels |
| `packages/shared/waterfall.ts` | Deterministic waterfall math |
| `apps/web/src/core/auth.tsx` | Auth provider — NFC + PIN (kiosk), OAuth (admin), OTP (fallback) |
| `apps/web/src/kiosk/` | Kiosk-specific UI: delivery flow, NFC tap, PIN entry, receipt generation |
| `apps/web/src/kiosk/receipt.tsx` | Thermal receipt layout + print trigger |
| `apps/web/src/kiosk/nfc.tsx` | NFC card reader integration (Web NFC API / Web Serial) |
