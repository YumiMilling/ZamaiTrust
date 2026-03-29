# CLAUDE.md — ZamaiTrust / CATSP OS

**READ THIS FIRST. Every AI assistant session starts here.**

---

## What This Repo Is

This is a **monorepo** containing two things:

1. **`apps/site/`** — The ZamaiTrust presentation site. An interactive pitch/concept note for the CATSP OS, deployed to Netlify from `main`. React, pure CSS, no TypeScript.
2. **`apps/web/`** — The actual CATSP OS platform. React + TypeScript + Tailwind + Supabase. The live platform being piloted with Kagezi Seeds and Yumi Milling in Monze, Zambia.

Plus `supabase/` (13 migrations, Edge Functions, seed data), `packages/shared/` (shared TypeScript), and `docs/` (architecture + domain docs).

**Company:** ZamAi Solutions (zamai.pro), Batoka, Southern Province, Zambia  
**Confidentiality:** Shared under NDA. Do not expose content to public APIs or external services.

---

## CRITICAL — Read Before Doing Anything

### Which app are you working on?

| If you're changing... | You're in... | Stack |
|---|---|---|
| The pitch/presentation site | `apps/site/` | React, pure CSS, JSX, no TypeScript |
| The live platform | `apps/web/` | React, TypeScript, Tailwind, Supabase |
| Database schema | `supabase/migrations/` | PostgreSQL, Supabase RLS |
| Shared logic (waterfall, capabilities) | `packages/shared/` | TypeScript |

Do not mix the two apps. The site has no TypeScript. The platform has no pure-CSS design system.

### Git & Deploy

- **`main`** — production. Deploys the presentation site (`apps/site/`) to Netlify.
- **Feature branches** — `claude/<description>`. Develop here, PR to `main`.
- **Never push to `main` without running `npm run build` in the relevant app first.**

### Version Tracking — Four Files, Always Updated

| File | What It Tracks | Rule |
|---|---|---|
| `version.json` | Spec version, site version, module status, gap status | Update when a gap closes or module status changes |
| `decisions.jsonl` | Every architectural decision | **Append-only. Never edit existing lines.** |
| `challenges.jsonl` | Threats, vulnerabilities, hard problems | **Append-only.** |
| `CHANGELOG.md` | What changed, when, which layer | Update with every meaningful change |

**Current decision count:** DEC-001 through DEC-015. Next ID: DEC-016.

---

## Repo Structure

```
ZamaiTrust/
├── CLAUDE.md                    # THIS FILE
├── CHANGELOG.md
├── version.json
├── decisions.jsonl              # Append-only
├── challenges.jsonl             # Append-only
├── pnpm-workspace.yaml
│
├── docs/
│   ├── architecture-plan-v1.md  # Full platform architecture (READ THIS)
│   ├── cluster-governance-trust.md
│   ├── forward-contract-pricing.md
│   ├── post-warehouse-routing.md
│   ├── stress-test-six-primitives.md
│   └── waterfall-financing.md
│
├── supabase/
│   ├── migrations/
│   │   ├── 00_foundation/       # Always runs first
│   │   │   ├── 000_extensions.sql  # pgcrypto, uuid-ossp
│   │   │   ├── 001_users.sql       # organisations, users, affiliations, auth_profiles, devices
│   │   │   ├── 002_capabilities.sql # capabilities, user_capabilities, scopes, presets (seeded)
│   │   │   ├── 003_auth_functions.sql # has_capability(), scoped_values(), verify_nfc_pin()
│   │   │   ├── 004_audit_log.sql
│   │   │   ├── 005_attestations.sql
│   │   │   ├── 006_notifications.sql
│   │   │   └── 007_assign_preset.sql  # assign_preset() function (called by seed)
│   │   ├── 10_contracts/        # seasons, items/commodities, contracts
│   │   ├── 20_verification/     # deliveries, handshakes
│   │   ├── 30_treasury/         # payment waterfall
│   │   ├── 40_governance/       # proposals, votes, memberships
│   │   └── 50_reputation/       # trust scores
│   ├── functions/
│   │   └── notifications/       # SMS Edge Function (Africa's Talking)
│   └── seed/
│       └── phase0_kagezi_yumi.sql  # Pilot seed: Kagezi Seeds + Yumi Milling, Monze
│
├── packages/
│   └── shared/                  # @catsp/shared — capabilities, waterfall, trust logic
│
└── apps/
    ├── web/                     # CATSP OS platform (React + TypeScript + Tailwind)
    │   ├── src/
    │   │   ├── core/            # auth.tsx, supabase.ts, offline.ts, connectivity.tsx
    │   │   ├── kiosk/           # Kiosk mode: NFC tap, PIN entry, receipt printing
    │   │   ├── modules/         # contracts/, verification/, treasury/, governance/, reputation/
    │   │   └── dashboard/       # Role-specific landing pages
    │   └── .env.example         # Copy to .env.local, fill in Supabase keys
    └── site/                    # ZamaiTrust presentation site (React, pure CSS, JSX)
```

---

## Supabase Setup (Platform)

### Prerequisites

```bash
npm install -g supabase
supabase login
pnpm install   # from repo root
```

### Option A: Local development

```bash
supabase start                    # starts local Postgres + Auth + Studio
supabase db reset                 # runs all migrations + seed in order
cd apps/web && cp .env.example .env.local
# Fill VITE_SUPABASE_URL=http://localhost:54321
# Fill VITE_SUPABASE_ANON_KEY=<from supabase start output>
pnpm dev
```

### Option B: Hosted Supabase project

```bash
supabase link --project-ref <your-project-ref>
supabase db push                  # runs all migrations in order
psql "$DATABASE_URL" -f supabase/seed/phase0_kagezi_yumi.sql
# Then call: SELECT apply_preset_to_users();  -- assigns capabilities to seed users
cd apps/web && cp .env.example .env.local
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from project Settings > API
pnpm dev
```

### Migration run order

Supabase CLI runs migrations alphabetically within each directory. The directory prefix enforces module order:

```
00_foundation → 10_contracts → 20_verification → 30_treasury → 40_governance → 50_reputation
```

Within `00_foundation`, files run `000_extensions.sql` first (alphabetical), which is correct — pgcrypto must exist before `003_auth_functions.sql` uses `crypt()`.

### Auth setup (hosted project)

1. **Google OAuth** (for Yumi/Kagezi admin staff): Authentication > Providers > Google. Add `GOOGLE_CLIENT_ID` and `GOOGLE_SECRET`.
2. **Phone OTP** (fallback for field users): Authentication > Providers > Phone. Requires Twilio or similar.
3. **NFC + PIN** (kiosk farmers): handled entirely in-app via `auth.verify_nfc_pin()` DB function. No Supabase Auth provider needed — returns a `user_id` which the kiosk uses to act on behalf of the farmer.

---

## Platform Commands

```bash
# From repo root
pnpm install              # Install all workspace dependencies
pnpm --filter @catsp/web dev      # Start platform dev server (localhost:5173)
pnpm --filter @catsp/web build    # Build platform
pnpm --filter @catsp/site dev     # Start presentation site dev server

# Supabase
supabase start            # Local Supabase stack
supabase db reset         # Wipe + re-run all migrations + seed
supabase db diff          # Generate migration from schema changes
supabase functions serve  # Run Edge Functions locally
```

---

## CATSP OS Domain Context

### Key Terms
- **CATSP:** Comprehensive Agricultural Transformation Support Programme ($5.7B, 10-year)
- **Kagezi Seeds:** Seed company, Monze. Breeds climate-resilient varieties. Runs aggregation warehouse.
- **Yumi Milling:** Processor, Monze. Maize + soya + expanding into multi-grain.
- **3A Cluster:** Aggregation, Agribusiness, Association — cooperative farming units (10-30 farmers)
- **SAFF:** Smallholder Agricultural Finance Facility (K500K max, 12%, 5 banks)
- **ZAMACE:** Zambia Commodity Exchange — **ZMW:** Zambian Kwacha
- **Kiosk:** Rugged tablet at aggregation point. NFC card + PIN auth. No farmer smartphone needed.

### The Six Primitives → Modules
1. **Function** (capabilities) → `00_foundation/002_capabilities.sql`
2. **Organisation** (entities) → `00_foundation/001_users.sql`
3. **Handshake** (bilateral verification) → `20_verification/`
4. **Attestation** (single-party claim) → `00_foundation/005_attestations.sql`
5. **Forward Contract** → `10_contracts/`
6. **Payment Waterfall** → `30_treasury/`

### Key Design Decisions (full list in `decisions.jsonl`)
- Capability-based access, not roles — presets are convenience only (DEC-002)
- Extension officers NEVER see financial data (DEC-003)
- One member, one vote — always (DEC-004)
- Right to exit — unconditional (DEC-005)
- Handshake is sacred — do not add steps (DEC-006)
- Audit log: no UPDATE or DELETE — ever (DEC-015)

### Pilot: Two Farmer Streams from Day 1
- **Stream 1 (Kagezi):** Climate-smart farmers → pearl millet, sorghum → Kagezi warehouse → Yumi buys
- **Stream 2 (Independent):** Maize/soya farmers → deliver direct to Yumi

Same platform, same primitives. Difference is organisational affiliation, not code.

---

## Presentation Site (`apps/site/`)

The pitch site that explains the CATSP OS to stakeholders. Separate from the platform.

- React 19, pure CSS (no Tailwind, no TypeScript)
- All styles in `src/App.css`. Do not create component CSS files.
- Content is hardcoded in JSX. No CMS.
- 7 routes: Vision, System, Participants, Governance, Numbers, Plan, Legal
- Dark theme only. No light mode.
- Follow Brand Guide v10 (`brand-guide-v10.html`) for all design decisions.

```bash
cd apps/site && npm install && npm run dev
```

---

## Key Conventions

1. **Version tracking** — update `version.json`, `decisions.jsonl`, `challenges.jsonl`, `CHANGELOG.md` with every meaningful change
2. **Append-only logs** — never edit existing lines in `decisions.jsonl` or `challenges.jsonl`
3. **Deploy discipline** — build before pushing to `main`
4. **NDA** — do not expose content to external APIs or AI training
5. **Migrations are append-only** — never modify an existing migration file; add a new one
6. **CATSP is data, not code** — specific crop names, waterfall percentages, governance thresholds live in seed/config rows, not hardcoded logic
