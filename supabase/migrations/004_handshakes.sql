-- 004_handshakes.sql
-- CATSP OS — Handshake Primitive: bilateral verification + delivery records
-- Spec: v0.5 | Decisions: DEC-006 (handshake is sacred — do not add steps)
--
-- The handshake is exactly two parties independently verifying the same event.
-- If they agree → confirmed. If they disagree → both claims preserved, transaction blocks.
-- DO NOT add approvers, workflows, or additional steps. (DEC-006)

-- ---------------------------------------------------------------------------
-- Handshakes (the atomic unit of trust)
-- ---------------------------------------------------------------------------
create table public.handshakes (
  id uuid primary key default uuid_generate_v4(),
  -- The two parties (and only two)
  party_a_user_id uuid not null references auth.users(id),
  party_a_org_id uuid not null references public.organisations(id),
  party_b_user_id uuid references auth.users(id),  -- null until B responds
  party_b_org_id uuid not null references public.organisations(id),
  -- What they're verifying
  subject_type text not null,  -- 'delivery', 'quality_sample'
  subject_id uuid not null,    -- FK to the subject record
  -- Party A's claim
  party_a_claim jsonb not null,
  party_a_submitted_at timestamptz not null default now(),
  -- Party B's claim (populated when B responds)
  party_b_claim jsonb,
  party_b_submitted_at timestamptz,
  -- Resolution (DEC-006: no additional steps)
  status public.handshake_status not null default 'awaiting_b',
  confirmed_at timestamptz,
  disputed_at timestamptz,
  discrepancy_pct numeric(5,2),  -- percentage difference when disputed
  -- Tier 1 auto-resolution (DEC-010: ≤2% discrepancy resolves automatically in 24hrs)
  auto_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index handshakes_party_a_idx on public.handshakes(party_a_user_id);
create index handshakes_party_b_org_idx on public.handshakes(party_b_org_id);
create index handshakes_subject_idx on public.handshakes(subject_type, subject_id);
create index handshakes_status_idx on public.handshakes(status);
create index handshakes_awaiting_idx on public.handshakes(status) where status = 'awaiting_b';

-- ---------------------------------------------------------------------------
-- Delivery records (the primary handshake subject for grain deliveries)
-- ---------------------------------------------------------------------------
create table public.delivery_records (
  id uuid primary key default uuid_generate_v4(),
  forward_contract_id uuid,  -- FK added in 006_forward_contracts.sql
  cluster_org_id uuid not null references public.organisations(id),
  depot_org_id uuid not null references public.organisations(id),
  -- Who delivered
  farmer_user_id uuid not null references auth.users(id),
  delivered_by_user_id uuid not null references auth.users(id),
  -- What was delivered
  crop_type text not null,
  quantity_kg numeric(10,2) not null check (quantity_kg > 0),
  grade_claimed text,    -- farmer's claimed grade
  grade_confirmed text,  -- depot's confirmed grade (from quality attestation)
  moisture_pct numeric(5,2),
  impurity_pct numeric(5,2),
  -- Warehouse receipt
  receipt_number text unique,
  receipt_issued_at timestamptz,
  -- Financial
  price_per_kg_zmw numeric(10,4),
  gross_value_zmw numeric(14,2),
  -- Handshake link
  handshake_id uuid references public.handshakes(id),
  is_settled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger delivery_records_updated_at
  before update on public.delivery_records
  for each row execute function public.touch_updated_at();

create index delivery_records_contract_idx on public.delivery_records(forward_contract_id);
create index delivery_records_cluster_idx on public.delivery_records(cluster_org_id);
create index delivery_records_depot_idx on public.delivery_records(depot_org_id);
create index delivery_records_unsettled_idx on public.delivery_records(is_settled) where is_settled = false;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.handshakes enable row level security;
alter table public.delivery_records enable row level security;

create policy "handshakes_parties_view"
  on public.handshakes for select
  to authenticated
  using (
    party_a_user_id = auth.uid()
    or party_b_user_id = auth.uid()
    or exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid()
        and up.org_id in (party_a_org_id, party_b_org_id)
    )
    or auth.has_capability('deliveries.view', 'district')
  );

create policy "handshakes_party_a_create"
  on public.handshakes for insert
  to authenticated
  with check (
    party_a_user_id = auth.uid()
    and auth.has_capability('deliveries.record')
  );

create policy "handshakes_party_b_confirm"
  on public.handshakes for update
  to authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.org_id = party_b_org_id
    )
    and status = 'awaiting_b'
    and auth.has_capability('deliveries.confirm')
  );

create policy "delivery_records_parties_view"
  on public.delivery_records for select
  to authenticated
  using (
    farmer_user_id = auth.uid()
    or delivered_by_user_id = auth.uid()
    or exists (
      select 1 from public.cluster_memberships cm
      where cm.cluster_org_id = delivery_records.cluster_org_id
        and cm.user_id = auth.uid() and cm.is_active = true
    )
    or exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and up.org_id = delivery_records.depot_org_id
    )
    or auth.has_capability('deliveries.view', 'district')
  );

create policy "delivery_records_create"
  on public.delivery_records for insert
  to authenticated
  with check (
    delivered_by_user_id = auth.uid()
    and auth.has_capability('deliveries.record')
  );
