-- 007_assign_preset.sql
-- Assigns a named preset's capabilities to a user.
-- Referenced by seed/phase0_kagezi_yumi.sql: SELECT apply_preset_to_users();
-- Also called by the user-creation Edge Function at runtime.

-- Assign a single preset to a user.
-- Returns the number of capabilities granted.
CREATE OR REPLACE FUNCTION assign_preset(
  p_user_id uuid,
  p_preset_id text,
  p_granted_by uuid DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer := 0;
  v_rec   record;
BEGIN
  FOR v_rec IN
    SELECT capability_id, default_scope_level
    FROM preset_capabilities
    WHERE preset_id = p_preset_id
  LOOP
    INSERT INTO user_capabilities (user_id, capability_id, scope_level, granted_by, active)
    VALUES (p_user_id, v_rec.capability_id, v_rec.default_scope_level, p_granted_by, true)
    ON CONFLICT (user_id, capability_id)
    DO UPDATE SET
      scope_level = EXCLUDED.scope_level,
      active      = true,
      granted_by  = EXCLUDED.granted_by;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- Convenience: apply presets to all users whose `preset` column is set.
-- Used in seed and for bulk capability reset.
-- Call after seeding users: SELECT apply_preset_to_users();
CREATE OR REPLACE FUNCTION apply_preset_to_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rec record;
BEGIN
  FOR v_rec IN
    SELECT id, preset FROM users
    WHERE preset IS NOT NULL AND active = true
  LOOP
    BEGIN
      PERFORM assign_preset(v_rec.id, v_rec.preset);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipped user % (preset: %): %', v_rec.id, v_rec.preset, SQLERRM;
    END;
  END LOOP;
END;
$$;
