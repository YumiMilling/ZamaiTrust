-- 003_organisations_users.sql
-- CATSP OS — Organisation Primitive: entities, user profiles, cluster memberships
-- Spec: v0.5 | Decisions: DEC-002, DEC-003, DEC-004, DEC-005

-- ---------------------------------------------------------------------------
-- Organisations (the core entity identity)
-- ---------------------------------------------------------------------------
create table public.organisations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  org_type public.org_type not null,
  parent_org_id uuid references public.organisations(id),
  -- Location
  village text,
  chiefdom text,
  district text,
  province text,
  country text not null default 'ZM',
  -- Trust (DEC-009: tier is public; numeric score is private)
  trust_tier public.trust_tier not null default 'unverified',
  trust_score integer not null default 0 check (trust_score between 0 and 100),
  -- Status
  is_active boolean not null default true,
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  -- Contact
  registration_number text,
  contact_phone text,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organisations_updated_at
  before update on public.organisations
  for each row execute function public.touch_updated_at();

create index organisations_org_type_idx on public.organisations(org_type);
create index organisations_district_idx on public.organisations(district);
create index organisations_trust_tier_idx on public.organisations(trust_tier);

-- ---------------------------------------------------------------------------
-- User profiles (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organisations(id),
  display_name text,
  -- Contact
  phone text,
  mobile_money_number text,
  mobile_money_provider text check (mobile_money_provider in ('airtel', 'mtn', 'zamtel')),
  -- Localisation (DEC-014: meet users where they are)
  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'ny', 'to')),  -- English, Chinyanja, Tonga
  -- Identity
  national_id text,
  kyc_verified boolean not null default false,
  kyc_source text check (kyc_source in ('telco', 'document', 'manual')),
  -- Activity
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.touch_updated_at();

-- Auto-create profile on signup (DEC-014: three auth methods)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Cluster memberships (farmers belong to clusters)
-- Right to exit is unconditional (DEC-005)
-- ---------------------------------------------------------------------------
create table public.cluster_memberships (
  id uuid primary key default uuid_generate_v4(),
  cluster_org_id uuid not null references public.organisations(id),
  user_id uuid not null references auth.users(id),
  role text not null default 'member'
    check (role in ('member', 'leader', 'treasurer', 'secretary')),
  joined_at timestamptz not null default now(),
  -- Exit (DEC-005: money follows the member)
  exited_at timestamptz,
  exit_reason text,
  is_active boolean not null default true,
  pending_distribution_zmw numeric(14,2) not null default 0,
  outstanding_obligations_zmw numeric(14,2) not null default 0,
  unique (cluster_org_id, user_id)
);

create index cluster_memberships_cluster_idx on public.cluster_memberships(cluster_org_id);
create index cluster_memberships_user_idx on public.cluster_memberships(user_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.organisations enable row level security;
alter table public.user_profiles enable row level security;
alter table public.cluster_memberships enable row level security;

create policy "organisations_view_active"
  on public.organisations for select
  to authenticated
  using (is_active = true);

create policy "organisations_admin_write"
  on public.organisations for all
  to authenticated
  using (auth.has_capability('admin.users'));

create policy "user_profiles_own_or_admin"
  on public.user_profiles for select
  to authenticated
  using (id = auth.uid() or auth.has_capability('admin.users'));

create policy "user_profiles_own_update"
  on public.user_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "cluster_memberships_own_cluster"
  on public.cluster_memberships for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.cluster_memberships cm2
      where cm2.cluster_org_id = cluster_memberships.cluster_org_id
        and cm2.user_id = auth.uid()
        and cm2.is_active = true
    )
    or auth.has_capability('monitoring.view', 'district')
  );
