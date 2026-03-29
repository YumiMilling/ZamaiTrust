-- 001_bootstrap.sql
-- CATSP OS — Foundation: extensions, enums, and core helper functions
-- Spec: v0.5 | Decisions: DEC-001 (six primitives), DEC-002 (capability-based access)

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";  -- fuzzy name matching

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

-- Organisation types (12 participant types, DEC-002)
create type public.org_type as enum (
  'farmer_cluster',        -- 3A Cluster: 10-30 farmers
  'processor',             -- grain processor / miller
  'depot_operator',        -- warehouse / receipt depot
  'extension_service',     -- extension officer / advisory
  'implementing_partner',  -- CATSP programme implementer
  'insurer',               -- crop insurance provider
  'saff_bank',             -- SAFF-accredited bank
  'zamace',                -- ZAMACE member / commodity exchange
  'government_national',   -- national government agency (ZARETA, MARD, etc.)
  'government_district',   -- district government office
  'platform_admin',        -- platform operations team
  'auditor'                -- external auditor
);

-- Capability scope hierarchy (DEC-002)
-- Scopes are hierarchical: national > province > district > assigned > own
create type public.capability_scope as enum (
  'own',       -- own records only
  'assigned',  -- records explicitly assigned to you
  'district',  -- all records in your district
  'province',  -- all records in your province
  'national'   -- all records nationally
);

-- Trust tiers (DEC-009)
-- Counterparties see tier only, never the numeric score
create type public.trust_tier as enum (
  'unverified',   -- 0-49: not yet eligible for contracts
  'verified',     -- 50-64: basic participation
  'established',  -- 65-79: cluster leadership eligible
  'trusted',      -- 80-89: preferred counterparty
  'anchor'        -- 90-100: highest tier, premium access
);

-- Handshake status (DEC-006: two parties, no more)
create type public.handshake_status as enum (
  'awaiting_b',  -- Party A has submitted, waiting for Party B
  'confirmed',   -- Both parties agree
  'disputed'     -- Parties disagree — both claims preserved
);

-- Forward contract lifecycle
create type public.contract_status as enum (
  'draft',      -- created by one party, not yet offered
  'offered',    -- offered to counterparty
  'accepted',   -- both parties signed
  'active',     -- delivery period open
  'delivered',  -- all delivery handshakes confirmed
  'settled',    -- waterfall executed, farmer paid
  'cancelled',  -- mutually cancelled before delivery
  'disputed'    -- under conflict resolution
);

-- Attestation types (DEC-007: unified attestation primitive)
create type public.attestation_type as enum (
  'training_session',      -- training delivered to farmers
  'monitoring_visit',      -- field monitoring visit
  'advisory_interaction',  -- one-on-one advisory
  'quality_test',          -- grain quality assessment
  'service_delivery',      -- implementing partner service
  'extension_visit',       -- extension officer farm visit
  'input_distribution'     -- agricultural input distributed
);

-- Conflict resolution tiers (DEC-010)
create type public.conflict_tier as enum (
  'tier1_automatic',    -- ≤2% discrepancy, resolved in 24hrs by algorithm
  'tier2_mediation',    -- extension officer mediates, 14-day SLA
  'tier3_arbitration',  -- 3-person panel, binding, 30-day SLA, creates precedent
  'tier4_enforcement'   -- account suspension + external referral (ACC/ZPS/BoZ/courts)
);

create type public.conflict_status as enum (
  'open', 'in_progress', 'resolved', 'escalated', 'closed'
);

-- Payment waterfall steps (DEC-008: fixed priority order)
create type public.waterfall_step as enum (
  'warehouse_fee',       -- 1. Warehouse custody fee
  'saff_loan',           -- 2. SAFF loan repayment (pro-rata)
  'input_repayment',     -- 3. Input supplier repayment (pro-rata)
  'insurance_premium',   -- 4. Insurance premium
  'platform_fee',        -- 5. Platform fee
  'farmer_net',          -- 6. Farmer net payment
  'cluster_treasury',    -- 7. Cluster treasury share
  'mobile_money_payout'  -- 8. Final mobile money disbursement
);

create type public.waterfall_status as enum (
  'pending', 'processing', 'completed', 'failed', 'partial'
);

-- SAFF loan status
create type public.loan_status as enum (
  'pending', 'active', 'repaying', 'settled', 'defaulted'
);

-- Insurance status
create type public.insurance_status as enum (
  'quoted', 'active', 'claimed', 'settled', 'lapsed', 'declined'
);

-- Governance vote types
create type public.vote_type as enum (
  'leader_election',
  'treasurer_election',
  'member_expulsion',   -- requires arbitration ruling or court order (DEC-012)
  'treasury_withdrawal',
  'contract_approval',
  'policy_change'
);

-- ---------------------------------------------------------------------------
-- Core updated_at helper (called by triggers in later migrations)
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
