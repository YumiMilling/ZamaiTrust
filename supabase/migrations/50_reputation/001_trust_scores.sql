-- Reputation Module: Trust Scores
-- DEC-009: Counterparties see tier only, never the number

-- Score configuration (versioned, per org type)
CREATE TABLE trust_score_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL,
  org_type text NOT NULL, -- cluster | processor | depot | supplier
  weights jsonb NOT NULL, -- {"delivery_reliability": 0.30, "quality": 0.25, "financial": 0.20, ...}
  volume_weighting boolean DEFAULT true,
  inactivity_decay_pct numeric DEFAULT 10.0, -- 10% per inactive season
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  approved_by jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Current scores
CREATE TABLE trust_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organisations(id) NOT NULL UNIQUE,
  score numeric DEFAULT 50.0, -- 0-100
  tier text DEFAULT 'verified', -- verified (50-64) | established (65-79) | trusted (80-89) | anchor (90+)
  season_count integer DEFAULT 0,
  last_active_season_id uuid REFERENCES seasons(id),
  last_calculated timestamptz DEFAULT now()
);

CREATE INDEX idx_tscore_org ON trust_scores(org_id);
CREATE INDEX idx_tscore_tier ON trust_scores(tier);

-- Events that change scores
CREATE TABLE trust_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organisations(id) NOT NULL,
  event_type text NOT NULL, -- delivery_confirmed | delivery_disputed | quality_pass | quality_fail | loan_repaid | loan_defaulted | contract_fulfilled | contract_breached | case_lost_frivolous
  event_data jsonb,
  volume_kg numeric, -- for volume weighting
  score_delta numeric NOT NULL,
  resulting_score numeric NOT NULL,
  season_id uuid REFERENCES seasons(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_tevent_org ON trust_events(org_id);
CREATE INDEX idx_tevent_type ON trust_events(event_type);

-- ============================================================
-- TIER CALCULATION
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_tier(score numeric)
RETURNS text AS $$
BEGIN
  IF score >= 90 THEN RETURN 'anchor';
  ELSIF score >= 80 THEN RETURN 'trusted';
  ELSIF score >= 65 THEN RETURN 'established';
  ELSE RETURN 'verified';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- RECORD TRUST EVENT
-- Called by Edge Functions or triggers when things happen
-- ============================================================

CREATE OR REPLACE FUNCTION record_trust_event(
  p_org_id uuid,
  p_event_type text,
  p_volume_kg numeric DEFAULT NULL,
  p_event_data jsonb DEFAULT NULL,
  p_season_id uuid DEFAULT NULL
)
RETURNS numeric AS $$
DECLARE
  v_current_score numeric;
  v_delta numeric;
  v_new_score numeric;
  v_volume_factor numeric;
BEGIN
  -- Get or create trust score
  INSERT INTO trust_scores (org_id) VALUES (p_org_id)
    ON CONFLICT (org_id) DO NOTHING;
  SELECT score INTO v_current_score FROM trust_scores WHERE org_id = p_org_id;

  -- Base deltas per event type
  v_delta := CASE p_event_type
    WHEN 'delivery_confirmed' THEN 2.0
    WHEN 'delivery_disputed' THEN -3.0
    WHEN 'quality_pass' THEN 1.5
    WHEN 'quality_fail' THEN -2.0
    WHEN 'loan_repaid' THEN 3.0
    WHEN 'loan_defaulted' THEN -8.0
    WHEN 'contract_fulfilled' THEN 5.0
    WHEN 'contract_breached' THEN -10.0
    WHEN 'case_lost_frivolous' THEN -5.0
    ELSE 0
  END;

  -- Volume weighting: reliability × log(volume)
  IF p_volume_kg IS NOT NULL AND p_volume_kg > 0 THEN
    v_volume_factor := LEAST(LOG(p_volume_kg) / 4.0, 2.0); -- cap at 2x
    v_delta := v_delta * v_volume_factor;
  END IF;

  -- Clamp score to 0-100
  v_new_score := GREATEST(0, LEAST(100, v_current_score + v_delta));

  -- Update score and tier
  UPDATE trust_scores SET
    score = v_new_score,
    tier = calculate_tier(v_new_score),
    last_active_season_id = COALESCE(p_season_id, last_active_season_id),
    last_calculated = now()
  WHERE org_id = p_org_id;

  -- Record event
  INSERT INTO trust_events (org_id, event_type, event_data, volume_kg, score_delta, resulting_score, season_id)
  VALUES (p_org_id, p_event_type, p_event_data, p_volume_kg, v_delta, v_new_score, p_season_id);

  RETURN v_new_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUTO-UPDATE TRUST ON HANDSHAKE CONFIRMATION
-- ============================================================

CREATE OR REPLACE FUNCTION trust_on_handshake()
RETURNS trigger AS $$
DECLARE
  v_delivery RECORD;
  v_source_org uuid;
  v_dest_org uuid;
BEGIN
  -- Only fire on status change to confirmed or disputed
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;

  SELECT * INTO v_delivery FROM deliveries WHERE id = NEW.delivery_id;
  v_source_org := v_delivery.source_org_id;
  v_dest_org := v_delivery.destination_org_id;

  IF NEW.status = 'confirmed' THEN
    PERFORM record_trust_event(v_source_org, 'delivery_confirmed', v_delivery.quantity_kg, NULL, v_delivery.season_id);
    PERFORM record_trust_event(v_dest_org, 'delivery_confirmed', v_delivery.quantity_kg, NULL, v_delivery.season_id);
  ELSIF NEW.status = 'disputed' THEN
    PERFORM record_trust_event(v_source_org, 'delivery_disputed', v_delivery.quantity_kg, NULL, v_delivery.season_id);
    PERFORM record_trust_event(v_dest_org, 'delivery_disputed', v_delivery.quantity_kg, NULL, v_delivery.season_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_trust_on_handshake
  AFTER UPDATE ON handshakes
  FOR EACH ROW
  EXECUTE FUNCTION trust_on_handshake();

-- ============================================================
-- SEED: Default trust score config
-- ============================================================

INSERT INTO trust_score_config (version, org_type, weights, effective_from, approved_by) VALUES
(1, 'cluster', '{"delivery_reliability": 0.30, "quality": 0.25, "financial_reliability": 0.20, "contract_fulfilment": 0.15, "dispute_record": 0.10}', now(), '["system"]'),
(1, 'processor', '{"contract_fulfilment": 0.30, "payment_timeliness": 0.25, "quality_acceptance": 0.20, "dispute_record": 0.15, "volume": 0.10}', now(), '["system"]'),
(1, 'depot', '{"delivery_accuracy": 0.35, "quality_grading": 0.30, "dispute_record": 0.20, "availability": 0.15}', now(), '["system"]');

-- RLS
ALTER TABLE trust_score_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tsc_select ON trust_score_config FOR SELECT USING (true); -- rules are public

-- DEC-009: own org sees score number, others see tier only
-- The tier-only restriction is enforced in the application layer / views
CREATE POLICY ts_select ON trust_scores FOR SELECT USING (
  (auth.has_capability('trust.view', 'own') AND org_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('trust.view', 'district')
);

CREATE POLICY te_select ON trust_events FOR SELECT USING (
  (auth.has_capability('trust.view', 'own') AND org_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('trust.view', 'district')
);
