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

## 2. Offline-First Strategy

### The Reality
Rural Zambia: 2G connectivity, frequent drops, phones held by multiple family members, solar charging means phones die mid-afternoon. "Online-first with offline fallback" won't work. It must be **offline-first with sync-when-connected**.

### Architecture: Action Queue + Optimistic UI + Server Reconciliation

```
[User Action] → [Local IndexedDB Queue] → [Optimistic UI Update]
                        │
                   (when online)
                        │
                   [Sync Engine] → [Supabase] → [Confirm/Conflict]
                        │
                   [Update Local State]
```

**What works offline:**
- View cached data (contracts, deliveries, balances, governance proposals)
- Queue a handshake confirmation ("I confirm delivery of X kg")
- Queue a vote ("I vote YES on proposal P-042")
- View trust tier (cached)
- View waterfall breakdown (cached from last sync)

**What requires online:**
- Creating a new forward contract (needs current market data)
- Triggering a payment (money must move)
- Filing a dispute (needs to be seen immediately)
- Auth (first login — then session cached)

### Conflict Resolution for Offline Actions

| Conflict Type | Resolution |
|---|---|
| Farmer votes offline, proposal already closed | Vote rejected. SMS notification: "Proposal P-042 closed before your vote arrived." |
| Two handshakes queued for same delivery | Accept first-to-arrive. Flag second for review. |
| Cached balance stale after waterfall settlement | Overwrite with server state. SMS notification of updated balance. |
| Offline attestation conflicts with online attestation | Both preserved (like a disputed handshake). Flag for Tier 1 resolution. |

### Technology
- **IndexedDB** via Dexie.js (lightweight, well-supported)
- **Service Worker** for PWA offline shell + API caching
- **Background Sync API** for queued actions (when connection returns)
- **Supabase Realtime** for live updates when online
- **Last-write-wins for read data, queue-and-reconcile for write actions**

---

## 3. Multi-Channel Architecture

Same backend, four delivery channels:

```
                    ┌─── React PWA (smartphones, tablets, desktop)
                    │
Supabase Backend ───┼─── USSD Gateway (feature phones via Africa's Talking)
                    │
                    ├─── SMS Service (notifications, fallback responses)
                    │
                    └─── PDF Generator (HCAT/CSC executive reports)
```

### USSD Design (Africa's Talking Callback)

Africa's Talking sends HTTP callbacks for each USSD screen. Stateless — session state must be encoded in the response or stored server-side (Redis/Supabase).

**Key constraint:** Max 3 screens per interaction. Farmer attention and USSD session timeout (typically 180 seconds) limit depth.

Example: Confirm Delivery
```
Screen 1: "Delivery D-2026-042. 2,000kg Grade A maize at Choma Depot. Confirm? 1=Yes 2=No"
Screen 2: (if Yes) "Confirmed. You will receive K5,070 advance within 24hrs. END"
Screen 2: (if No) "Dispute filed. Extension officer will contact you. END"
```

Example: Vote on Contract
```
Screen 1: "New contract: Processor X wants 200t Grade A at K6,400/t. Jul-Aug delivery. 1=Accept 2=Reject 3=Details"
Screen 2: (if Details) "Floor K6,000/t. Ceiling K7,200/t. Insurance included. 1=Accept 2=Reject"
```

**USSD Gateway** runs as a Supabase Edge Function or standalone Node service. It:
1. Receives Africa's Talking callback
2. Looks up user by phone number
3. Checks `auth.has_capability()` for the requested action
4. Returns USSD menu text (max 160 chars per screen)
5. For complex responses, sends SMS follow-up

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

## 5. What to Build First (Phase 0 Sequence)

### Sprint 0: Foundation (2 weeks)
1. Supabase project setup (hosted — data sovereignty addressed by Supabase's region selection or self-host later)
2. Foundation migrations: `users`, `organisations`, `user_affiliations`, `capabilities`, `user_capabilities`, `presets`, `audit_log`, `attestations`
3. `auth.has_capability()` + `auth.scoped_values()` functions
4. RLS policies on foundation tables
5. Auth: Google OAuth + phone OTP (mobile money binding deferred to Phase 1)
6. Seed data: 1 processor, 1 depot, 1 cluster (25 farmers), 1 input supplier — with preset capabilities assigned
7. Basic React app shell with auth + capability-gated routing

### Sprint 1: Value Chain (2 weeks)
1. Migrations: `seasons`, `commodities`, `grading_standards`, `forward_contracts`, `deliveries`, `handshakes`, `contract_deliveries`, `input_advances`
2. RLS policies (all using `auth.has_capability()`)
3. Edge Function: `handshake-confirm` — the core bilateral verification logic
4. UI: Processor posts contract → Cluster views it → Farmer confirms delivery → Handshake
5. Audit log writes for every action

### Sprint 2: Governance + Display Waterfall (2 weeks)
1. Migrations: `cluster_treasury`, `proposals`, `votes`, `cluster_memberships`, `cluster_constitutions`
2. SMS-based voting (Africa's Talking integration — simple send/receive, not full USSD yet)
3. Waterfall calculation (display only — shows the split, human executes payment)
4. Trust score engine (basic — delivery confirmed = +, disputed = -, computed in Edge Function)
5. Dashboard per role (processor sees their contracts, farmer sees their deliveries, depot sees inventory)

### Sprint 3: Offline + Polish (2 weeks)
1. Service worker + IndexedDB for offline data cache
2. Action queue for offline handshake confirmations and votes
3. Sync-when-connected with conflict resolution
4. QR code generation for bags (traceability)
5. Phase 0 field test preparation

**Phase 0 total: ~8 weeks to a testable PoC with 1 processor, 1 depot, 1 cluster.**

---

## 6. Key Technical Decisions Needed

Before writing code, these must be resolved:

| Decision | Options | Recommendation | Why |
|---|---|---|---|
| **Monorepo tool** | Turborepo / Nx / pnpm workspaces | pnpm workspaces | Simplest. No build orchestration needed yet. |
| **TypeScript?** | Yes / No | Yes (strict) | Type safety for capabilities, presets, waterfall math. Catches bugs at compile time. |
| **Supabase hosted vs self-hosted** | Hosted / Self-hosted | Hosted for Phase 0-1, self-host option for Phase 2+ | Speed to market. Data sovereignty conversation later. |
| **USSD provider** | Africa's Talking / Zamtel direct | Africa's Talking | Better API, multi-country support for Phase 2. |
| **Offline sync library** | Custom / Dexie.js / RxDB / PowerSync | Dexie.js + custom sync | PowerSync is ideal but adds dependency. Dexie is lightweight and proven. |
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

### How to test that the architecture works:

1. **Foundation test:** Create a user with `farmer_cluster` preset. Verify they can see their own contracts but not another cluster's. Verify they CANNOT see financial aggregates.
2. **RLS test:** Create a user with `extension_officer` preset. Verify `financial.view` is denied at every scope.
3. **Handshake test:** Farmer and depot both submit claims. Verify: matching = confirmed, mismatching = disputed with both claims preserved.
4. **Offline test:** Go offline. Queue a handshake confirmation. Go online. Verify it syncs and the handshake resolves.
5. **USSD test:** Call the USSD gateway with a test phone number. Walk through delivery confirmation in 2 screens.
6. **Waterfall test:** Trigger a confirmed handshake linked to a forward contract. Verify waterfall calculation matches the financial model's math.
7. **Capability composition test:** Take a `farmer_cluster` user, manually add `contracts.create`. Verify they can now post contracts without any code change.

---

## Critical Files to Create First

| File | Purpose |
|---|---|
| `supabase/migrations/00_foundation/001_users.sql` | User identity |
| `supabase/migrations/00_foundation/003_capabilities.sql` | The permission vocabulary |
| `supabase/migrations/00_foundation/004_auth_functions.sql` | `has_capability()` + `scoped_values()` |
| `packages/shared/capabilities.ts` | Capability constants shared across all channels |
| `packages/shared/waterfall.ts` | Deterministic waterfall math (shared between PWA, USSD, Edge Functions) |
| `apps/web/src/core/auth.tsx` | Auth provider with capability-gated routing |
| `apps/web/src/core/offline.ts` | Service worker + IndexedDB sync engine |
