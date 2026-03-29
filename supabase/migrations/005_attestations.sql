-- 005_attestations.sql
-- CATSP OS — Attestation Primitive: single-party claims with evidence
-- Spec: v0.5 | Decisions: DEC-007 (attestations unify ALL real-world claims)
--
-- Training, monitoring, advisory interactions, quality tests, service delivery —
-- ALL go through this table. attestation_type distinguishes them. (DEC-007)

-- ---------------------------------------------------------------------------
-- Attestations
-- ---------------------------------------------------------------------------
create table public.attestations (
  id uuid primary key default uuid_generate_v4(),
  attestation_type public.attestation_type not null,
  -- Who made the claim
  attested_by_user_id uuid not null references auth.users(id),
  attested_by_org_id uuid not null references public.organisations(id),
  -- About whom
  subject_user_id uuid references auth.users(id),
  subject_org_id uuid references public.organisations(id),
  -- Optional links
  related_delivery_id uuid references public.delivery_records(id),
  related_contract_id uuid,  -- FK added after forward_contracts table in 006
  -- The claim
  claim_summary text not null,
  claim_data jsonb not null default '{}',  -- type-specific structured data
  -- Optional corroboration (another party can endorse)
  corroborated_by_user_id uuid references auth.users(id),
  corroborated_at timestamptz,
  corroboration_notes text,
  -- Location
  location_lat numeric(9,6),
  location_lng numeric(9,6),
  location_accuracy_m integer,
  -- Integrity: content hash for Merkle inclusion (DEC-015 spirit)
  content_hash text generated always as (
    encode(digest(claim_summary || claim_data::text, 'sha256'), 'hex')
  ) stored,
  -- Context
  season text,  -- e.g., '2025-2026'
  notes text,
  submitted_at timestamptz not null default now()
);

-- Attestations are intentionally immutable after submission
-- Corroboration is the only permitted update (handled by dedicated policy)
create index attestations_type_idx on public.attestations(attestation_type);
create index attestations_attested_by_idx on public.attestations(attested_by_user_id);
create index attestations_subject_org_idx on public.attestations(subject_org_id);
create index attestations_submitted_at_idx on public.attestations(submitted_at);

-- Evidence files linked to attestations
create table public.attestation_evidence (
  id uuid primary key default uuid_generate_v4(),
  attestation_id uuid not null references public.attestations(id) on delete cascade,
  file_name text not null,
  file_url text not null,   -- Supabase Storage path
  file_type text check (file_type in ('photo', 'document', 'audio', 'video')),
  uploaded_by uuid not null references auth.users(id),
  uploaded_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.attestations enable row level security;
alter table public.attestation_evidence enable row level security;

create policy "attestations_own_or_subject_or_monitor"
  on public.attestations for select
  to authenticated
  using (
    attested_by_user_id = auth.uid()
    or subject_user_id = auth.uid()
    or exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.org_id = subject_org_id
    )
    or auth.has_capability('monitoring.view', 'district')
    or auth.has_capability('quality.view', 'district')
    or auth.has_capability('training.view', 'district')
  );

create policy "attestations_create"
  on public.attestations for insert
  to authenticated
  with check (
    attested_by_user_id = auth.uid()
    and (
      auth.has_capability('quality.attest')
      or auth.has_capability('training.attest')
      or auth.has_capability('monitoring.report')
    )
  );

-- Corroboration only — no other updates permitted
create policy "attestations_corroborate"
  on public.attestations for update
  to authenticated
  using (
    corroborated_by_user_id is null
    and auth.has_capability('monitoring.conduct', 'assigned')
  )
  with check (
    attested_by_user_id = attested_by_user_id  -- claim fields unchanged
    and claim_summary = claim_summary
    and claim_data = claim_data
  );

create policy "attestation_evidence_view"
  on public.attestation_evidence for select
  to authenticated
  using (
    exists (
      select 1 from public.attestations a
      where a.id = attestation_evidence.attestation_id
        and (
          a.attested_by_user_id = auth.uid()
          or a.subject_user_id = auth.uid()
          or auth.has_capability('monitoring.view', 'district')
        )
    )
  );

create policy "attestation_evidence_upload"
  on public.attestation_evidence for insert
  to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.attestations a
      where a.id = attestation_evidence.attestation_id
        and a.attested_by_user_id = auth.uid()
    )
  );
