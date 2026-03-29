# CHANGELOG — ZamaiTrust

All notable changes to the CATSP OS specification and the presentation site are documented here.

Format: each entry records what changed, in which layer (spec or site), and whether the two are in sync.

---

## [Unreleased] — Site Rebuild to v0.5

**Sync status: OUT OF SYNC** — Spec is at v0.5, site is at v0.1. Full rebuild planned.

### Planned
- Rebuild site from scratch to present v0.5 spec content
- Reuse financial model component from v0.1 site as basis
- New page structure TBD (Primitives, Participants, Governance, etc.)

---

## 2026-03-29 — Version Tracking System

**Spec: v0.5 | Site: v0.1**

### Added (tracking)
- `version.json` — Single source of truth for spec version, site version, module status, primitive status, open gap status, and deployment phase status
- `decisions.jsonl` — Append-only decision log. 15 foundational decisions recorded (DEC-001 through DEC-015) covering: six primitives, capability-based access, financial privacy, democratic governance, right to exit, sacred handshake, attestation unification, waterfall priority, trust score visibility, conflict resolution tiers, multi-sig treasury, ejection due process, tech stack, auth methods, append-only audit
- `CHANGELOG.md` — This file. Site + spec version matrix with sync status
- `CLAUDE.md` — AI assistant context document

### How the tracking system works
- **`version.json`** is the machine-readable state. It answers: "What version are we at? What's designed? What's open? What's built?" Update this whenever a gap closes, a module status changes, or a version ships.
- **`decisions.jsonl`** is the append-only log. It answers: "Why is it this way? Who decided? What did it replace?" Add a new line whenever a design decision is made or an open gap is resolved. Never edit existing lines — if a decision is superseded, add a new entry with `supersedes` pointing to the old ID.
- **`CHANGELOG.md`** is the human-readable narrative. It answers: "What happened when? Are spec and site in sync?" Update this with each meaningful change.

### Decision log format
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

---

## 2026-03-29 — Spec v0.5

**Spec: v0.5 | Site: v0.1 (not updated)**

### Added (spec)
- Six primitives defined: Handshake, Attestation, Function, Organisation, Forward Contract, Payment Waterfall
- Full PostgreSQL data model: ~30 tables across core transactions, financial, trust, governance, conflict resolution, integrity, extension/partners, authentication
- Capability-based access control: ~30 capabilities across 14 modules, 12 presets, RLS policies
- CATSP sub-programme mapping (SP1-SP7) to OS features
- ZATTF facility integration (ZIRSAT, ZIFSAT, ZINFSAT)
- 12+ participant types with detailed visibility/capability specs
- Trust score system: tiers, volume weighting, inactivity decay, configurable weights
- Cluster governance: treasury, proposals, voting, constitution, right to exit, distribution rules
- Conflict resolution: 4-tier system (auto → mediation → arbitration → external) with SLAs
- Insurance module: policies, claims, trigger conditions, payout routing (60/30/10 split)
- SAFF loan documentation generation
- Audit integrity: append-only log, anomaly detection flags, Merkle tree, whistleblower
- 13 named open gaps with honest assessments
- 4-phase deployment plan (PoC → Pilot → Scale → International Capital)

### Not yet in spec (known gaps)
1. Settlement architecture / escrow (critical)
2. Contract discovery / marketplace
3. Waterfall async state machine
4. Waterfall minimum farmer floor
5. Notification system
6. Offline / connectivity
7. Bank API integration
8. Anomaly engine algorithms
9. Merkle tree publication target
10. Declining quorum mechanism
11. RLS performance at scale
12. API boundary definitions
13. USSD flow specification

---

## 2026-03-29 — Site v0.1

**Spec: v0.1 | Site: v0.1 (in sync at the time)**

### Added (site)
- React 19 + Vite 8 + React Router DOM 7 project setup
- Custom dark design system (emerald green + copper palette, 4 font families)
- 4-page structure: Vision, The Numbers, How It Works, Is It Legal?
- Vision page: Hero, Problem, Idea (core loop), 6 Design Principles, 3-Layer Architecture, 5 Phases
- Interactive financial model with 14 sliders and real-time calculations
- Schema section: generic attestation JSON envelope, 7 benefit classes
- Merkle tree explanation with visual pyramid
- 4 participant agent cards (Farmer, Farmer Group Leader, Depot Operator, Processor)
- Payment waterfall (5-line simplified version)
- Regulatory compliance table (13 features, traffic-light status)
- 5 SVG diagrams: Core Loop, Forward Lifecycle, Dual Signature, Insurance Flow, Three-Layer Architecture, International Capital
- Responsive design (820px breakpoint)
- Logos (AI.png, ZAMAI.png)

---

*When updating this file, always include the spec and site versions at the time of the change, and note whether they are in sync.*
