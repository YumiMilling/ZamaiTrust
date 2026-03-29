-- Foundation: Auth Functions
-- These two functions are called by EVERY RLS policy in EVERY module.
-- DEC-002: One permission model, enforced everywhere.

-- Check if the current user has a specific capability at a required scope
CREATE OR REPLACE FUNCTION auth.has_capability(cap_id text, required_scope text DEFAULT 'own')
RETURNS boolean AS $$
DECLARE
  scope_rank integer;
  user_scope text;
  user_rank integer;
BEGIN
  -- Scope hierarchy: own < assigned < district < province < national
  scope_rank := CASE required_scope
    WHEN 'own' THEN 1
    WHEN 'assigned' THEN 2
    WHEN 'district' THEN 3
    WHEN 'province' THEN 4
    WHEN 'national' THEN 5
    WHEN 'facility' THEN 3
    WHEN 'actuarial' THEN 3
    WHEN 'custom' THEN 3
    ELSE 1
  END;

  -- First try JWT claims (fast path — no DB hit)
  IF auth.jwt() -> 'app_metadata' ? 'caps' THEN
    RETURN EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(
        auth.jwt() -> 'app_metadata' -> 'caps'
      ) AS cap
      WHERE cap LIKE cap_id || ':%'
    );
  END IF;

  -- Fallback: query the capabilities table
  SELECT uc.scope_level INTO user_scope
  FROM user_capabilities uc
  WHERE uc.user_id = (SELECT u.id FROM users u WHERE u.auth_id = auth.uid())
    AND uc.capability_id = cap_id
    AND uc.active = true
  LIMIT 1;

  IF user_scope IS NULL THEN
    RETURN false;
  END IF;

  user_rank := CASE user_scope
    WHEN 'own' THEN 1
    WHEN 'assigned' THEN 2
    WHEN 'district' THEN 3
    WHEN 'province' THEN 4
    WHEN 'national' THEN 5
    WHEN 'facility' THEN 3
    WHEN 'actuarial' THEN 3
    WHEN 'custom' THEN 3
    ELSE 1
  END;

  RETURN user_rank >= scope_rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get the specific scope values for a capability (which districts, clusters, etc.)
CREATE OR REPLACE FUNCTION auth.scoped_values(cap_id text, s_type text)
RETURNS text[] AS $$
  SELECT COALESCE(ARRAY(
    SELECT ucs.scope_value
    FROM user_capability_scopes ucs
    JOIN user_capabilities uc ON uc.id = ucs.user_capability_id
    JOIN users u ON u.id = uc.user_id
    WHERE u.auth_id = auth.uid()
      AND uc.capability_id = cap_id
      AND ucs.scope_type = s_type
      AND uc.active = true
  ), '{}');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get the current platform user ID (not auth.uid which is the Supabase auth ID)
CREATE OR REPLACE FUNCTION auth.platform_user_id()
RETURNS uuid AS $$
  SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get org IDs the current user is affiliated with
CREATE OR REPLACE FUNCTION auth.user_org_ids()
RETURNS uuid[] AS $$
  SELECT COALESCE(ARRAY(
    SELECT org_id FROM user_affiliations
    WHERE user_id = auth.platform_user_id()
      AND active = true
  ), '{}');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verify NFC card + PIN at kiosk (called by Edge Function, not RLS)
CREATE OR REPLACE FUNCTION auth.verify_nfc_pin(card_uid text, pin text)
RETURNS uuid AS $$
DECLARE
  found_user_id uuid;
BEGIN
  SELECT id INTO found_user_id
  FROM users
  WHERE nfc_card_uid = card_uid
    AND pin_hash = crypt(pin, pin_hash)
    AND active = true;
  RETURN found_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
