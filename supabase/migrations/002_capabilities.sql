-- 002_capabilities.sql
-- CATSP OS — Function Primitive: capability-based access control
-- Spec: v0.5 | Decisions: DEC-002 (capabilities over roles), DEC-003 (financial privacy)

-- ---------------------------------------------------------------------------
-- Capabilities registry (~36 capabilities across 14 modules)
-- ---------------------------------------------------------------------------
create table public.capabilities (
  id text primary key,  -- e.g., 'contracts.create', 'financial.view'
  module text not null,
  action text not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Capability assignments to users
-- One RLS policy per table checks auth.has_capability() (DEC-002)
create table public.user_capabilities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  capability_id text not null references public.capabilities(id),
  scope public.capability_scope not null default 'own',
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  notes text,
  unique (user_id, capability_id, scope)
);

create index user_capabilities_user_id_idx on public.user_capabilities(user_id);
create index user_capabilities_capability_id_idx on public.user_capabilities(capability_id);

-- ---------------------------------------------------------------------------
-- Core RLS function: auth.has_capability()
-- Used in EVERY table's RLS policy (DEC-002)
-- Scope hierarchy: national > province > district > assigned > own
-- ---------------------------------------------------------------------------
create or replace function auth.has_capability(
  cap_id text,
  required_scope public.capability_scope default 'own')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_capabilities uc
    where uc.user_id = auth.uid()
      and uc.capability_id = cap_id
      and (uc.expires_at is null or uc.expires_at > now())
      and (
        uc.scope = required_scope
        or (required_scope = 'own'      and uc.scope in ('own', 'assigned', 'district', 'province', 'national'))
        or (required_scope = 'assigned' and uc.scope in ('assigned', 'district', 'province', 'national'))
        or (required_scope = 'district' and uc.scope in ('district', 'province', 'national'))
        or (required_scope = 'province' and uc.scope in ('province', 'national'))
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Seed: all capabilities
-- ---------------------------------------------------------------------------
insert into public.capabilities (id, module, action, description) values
  -- Contracts
  ('contracts.create',  'contracts', 'create',  'Create a new forward contract'),
  ('contracts.view',    'contracts', 'view',    'View forward contracts'),
  ('contracts.amend',   'contracts', 'amend',   'Propose contract amendments'),
  ('contracts.approve', 'contracts', 'approve', 'Counter-sign or approve a contract'),
  ('contracts.settle',  'contracts', 'settle',  'Trigger waterfall settlement'),
  ('contracts.dispute', 'contracts', 'dispute', 'Raise a dispute on a contract'),
  -- Deliveries (Handshake primitive)
  ('deliveries.record',  'deliveries', 'record',  'Record a delivery (Party A)'),
  ('deliveries.confirm', 'deliveries', 'confirm', 'Confirm a delivery (Party B handshake)'),
  ('deliveries.view',    'deliveries', 'view',    'View delivery records'),
  ('deliveries.dispute', 'deliveries', 'dispute', 'Raise a handshake dispute'),
  -- Financial (DEC-003: extension_service and implementing_partner NEVER granted this)
  ('financial.view',    'financial', 'view',    'View financial amounts and transactions'),
  ('financial.approve', 'financial', 'approve', 'Approve payments and waterfall executions'),
  ('financial.report',  'financial', 'report',  'Generate financial reports'),
  -- Quality
  ('quality.attest',  'quality', 'attest',  'Submit grain quality attestations'),
  ('quality.view',    'quality', 'view',    'View quality attestations'),
  ('quality.approve', 'quality', 'approve', 'Approve or reject quality attestations'),
  -- Training
  ('training.deliver', 'training', 'deliver', 'Deliver training sessions to farmers'),
  ('training.attest',  'training', 'attest',  'Record training attendance and outcomes'),
  ('training.view',    'training', 'view',    'View training records'),
  -- Monitoring
  ('monitoring.conduct', 'monitoring', 'conduct', 'Conduct field monitoring visits'),
  ('monitoring.report',  'monitoring', 'report',  'Submit monitoring reports'),
  ('monitoring.view',    'monitoring', 'view',    'View monitoring data (farming performance, not financial)'),
  -- Governance (DEC-004, DEC-005, DEC-011)
  ('governance.vote',     'governance', 'vote',     'Vote on cluster resolutions (one member, one vote)'),
  ('governance.lead',     'governance', 'lead',     'Lead a cluster (requires Established trust tier)'),
  ('governance.treasury', 'governance', 'treasury', 'Manage cluster treasury transactions'),
  -- Trust (DEC-009: tiers visible to counterparties, numbers only to self)
  ('trust.view_tier',  'trust', 'view_tier',  'See counterparty trust tier'),
  ('trust.view_score', 'trust', 'view_score', 'See own numeric trust score and breakdown'),
  ('trust.admin',      'trust', 'admin',      'Administer trust score parameters'),
  -- Insurance
  ('insurance.apply',   'insurance', 'apply',   'Apply for crop insurance'),
  ('insurance.view',    'insurance', 'view',    'View insurance policies'),
  ('insurance.approve', 'insurance', 'approve', 'Approve or decline insurance applications'),
  ('insurance.claim',   'insurance', 'claim',   'Submit an insurance claim'),
  -- Cases / Conflict resolution (DEC-010)
  ('cases.file',      'cases', 'file',      'File a conflict case'),
  ('cases.mediate',   'cases', 'mediate',   'Mediate a Tier 2 conflict case'),
  ('cases.arbitrate', 'cases', 'arbitrate', 'Arbitrate a Tier 3 conflict case (creates precedent)'),
  ('cases.enforce',   'cases', 'enforce',   'Execute Tier 4 enforcement actions'),
  -- Admin
  ('admin.users',  'admin', 'users',  'Manage users and capability assignments'),
  ('admin.system', 'admin', 'system', 'System configuration and platform parameters'),
  -- Audit (DEC-015: append-only)
  ('audit.view', 'audit', 'view', 'View audit log entries');

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.capabilities enable row level security;
alter table public.user_capabilities enable row level security;

create policy "capabilities_readable_by_authenticated"
  on public.capabilities for select
  to authenticated
  using (true);

create policy "user_capabilities_view_own_or_admin"
  on public.user_capabilities for select
  to authenticated
  using (user_id = auth.uid() or auth.has_capability('admin.users', 'national'));

create policy "user_capabilities_admin_insert"
  on public.user_capabilities for insert
  to authenticated
  with check (auth.has_capability('admin.users'));

create policy "user_capabilities_admin_update"
  on public.user_capabilities for update
  to authenticated
  using (auth.has_capability('admin.users'));
