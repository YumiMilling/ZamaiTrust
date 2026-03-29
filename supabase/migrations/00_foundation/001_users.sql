-- Foundation: Users & Organisations
-- Every other table references these. Get them right once.

-- Organisations: any entity in the system
CREATE TABLE organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- cluster | depot | processor | supplier | insurer | government | implementing_partner | zattf | platform
  location_district text,
  location_province text,
  parent_org_id uuid REFERENCES organisations(id),
  metadata jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_org_type ON organisations(type);
CREATE INDEX idx_org_district ON organisations(location_district);
CREATE INDEX idx_org_parent ON organisations(parent_org_id);

-- Users: people in the system
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid UNIQUE, -- links to Supabase auth.users
  name text NOT NULL,
  phone text,
  email text,
  primary_org_id uuid REFERENCES organisations(id),
  preset text, -- display label only, NOT used for access control

  -- NFC kiosk auth
  nfc_card_uid text UNIQUE, -- NFC card unique identifier
  pin_hash text, -- bcrypt hash of 4-digit PIN

  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_nfc ON users(nfc_card_uid);
CREATE INDEX idx_users_org ON users(primary_org_id);

-- User affiliations: one user, many orgs, different roles in each
CREATE TABLE user_affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  org_id uuid REFERENCES organisations(id) NOT NULL,
  affiliation_type text NOT NULL, -- member | leader | treasurer | employee | contractor | representative | officer | operator
  active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  UNIQUE(user_id, org_id, affiliation_type)
);

CREATE INDEX idx_affil_user ON user_affiliations(user_id);
CREATE INDEX idx_affil_org ON user_affiliations(org_id);

-- Auth profiles: how users authenticate
CREATE TABLE user_auth_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL UNIQUE,
  auth_method text NOT NULL, -- google_oauth | sim_otp | mobile_money | nfc_pin
  google_email text,
  google_sub text,
  phone_number text,
  phone_verified boolean DEFAULT false,
  momo_provider text, -- airtel_money | mtn_momo
  momo_account text,
  momo_verified boolean DEFAULT false,
  last_login timestamptz,
  failed_attempts integer DEFAULT 0,
  locked_until timestamptz
);

-- Device registry (for kiosks and trusted devices)
CREATE TABLE user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  device_type text NOT NULL, -- kiosk | smartphone | desktop
  device_fingerprint text NOT NULL,
  device_name text,
  location_org_id uuid REFERENCES organisations(id), -- which aggregation point (for kiosks)
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  trusted boolean DEFAULT false
);
