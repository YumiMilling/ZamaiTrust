-- Verification Module: Deliveries + Handshakes
-- DEC-006: The handshake is sacred. Two parties. No workflows. No approvers.

-- Physical movement of goods (or completion of a milestone)
CREATE TABLE deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES seasons(id) NOT NULL,
  contract_id uuid REFERENCES contracts(id), -- NULL for spot/uncontracted

  -- Who and where
  source_org_id uuid REFERENCES organisations(id) NOT NULL, -- sender (farmer/cluster)
  destination_org_id uuid REFERENCES organisations(id) NOT NULL, -- receiver (depot/processor)

  -- What
  item_id uuid REFERENCES items(id) NOT NULL,
  quantity_kg numeric NOT NULL,
  bag_count integer,
  grade text, -- assessed grade (set after quality check)

  -- Logistics
  transport_method text, -- own_vehicle | contracted | buyer_collection
  transporter_id uuid REFERENCES users(id),

  -- Timestamps
  dispatched_at timestamptz,
  received_at timestamptz,
  status text DEFAULT 'dispatched', -- dispatched | in_transit | received | confirmed | disputed

  -- QR traceability
  bag_qr_codes jsonb, -- array of QR code identifiers for each bag

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_delivery_season ON deliveries(season_id);
CREATE INDEX idx_delivery_contract ON deliveries(contract_id);
CREATE INDEX idx_delivery_source ON deliveries(source_org_id);
CREATE INDEX idx_delivery_dest ON deliveries(destination_org_id);
CREATE INDEX idx_delivery_status ON deliveries(status);

-- THE HANDSHAKE: bilateral verification
-- DEC-006: Two parties verify. If they agree, confirmed. If not, both claims preserved.
CREATE TABLE handshakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id uuid REFERENCES deliveries(id) NOT NULL,

  -- Party A (sender/farmer)
  sender_id uuid REFERENCES users(id) NOT NULL,
  sender_count numeric NOT NULL, -- what they claim
  sender_unit text NOT NULL, -- kg | bags
  sender_timestamp timestamptz NOT NULL,
  sender_gps jsonb, -- {lat, lng, accuracy_m}
  sender_auth_method text, -- nfc_pin | oauth | otp

  -- Party B (receiver/depot)
  receiver_id uuid REFERENCES users(id) NOT NULL,
  receiver_count numeric,
  receiver_unit text,
  receiver_timestamp timestamptz,
  receiver_gps jsonb,
  receiver_auth_method text,

  -- Result
  status text DEFAULT 'pending', -- pending | confirmed | disputed
  auto_resolved boolean DEFAULT false, -- Tier 1 auto-resolution applied?
  discrepancy_pct numeric, -- calculated: abs(sender - receiver) / sender * 100

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_hs_delivery ON handshakes(delivery_id);
CREATE INDEX idx_hs_sender ON handshakes(sender_id);
CREATE INDEX idx_hs_receiver ON handshakes(receiver_id);
CREATE INDEX idx_hs_status ON handshakes(status);

-- Linking deliveries to contracts (multiple deliveries can fulfil one contract)
CREATE TABLE contract_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) NOT NULL,
  delivery_id uuid REFERENCES deliveries(id) NOT NULL,
  handshake_id uuid REFERENCES handshakes(id) NOT NULL,
  quantity_kg numeric NOT NULL,
  quality_attestation_id uuid REFERENCES attestations(id), -- quality test result
  created_at timestamptz DEFAULT now()
);

-- Input advances (seed, fertiliser advanced against a contract)
CREATE TABLE advances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_org_id uuid REFERENCES organisations(id) NOT NULL,
  recipient_org_id uuid REFERENCES organisations(id) NOT NULL, -- cluster receiving inputs
  contract_id uuid REFERENCES contracts(id), -- the justifying contract
  season_id uuid REFERENCES seasons(id) NOT NULL,

  -- What was advanced
  input_type text NOT NULL, -- seed | fertiliser | chemical | equipment
  input_description text,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  value_zmw numeric NOT NULL,

  -- Confirmation
  handshake_id uuid REFERENCES handshakes(id), -- delivery confirmation of inputs
  status text DEFAULT 'committed', -- committed | delivered | confirmed | repaid | defaulted

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_advance_supplier ON advances(supplier_org_id);
CREATE INDEX idx_advance_recipient ON advances(recipient_org_id);
CREATE INDEX idx_advance_contract ON advances(contract_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE handshakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;

-- Deliveries: visible to parties + scoped viewers
CREATE POLICY deliveries_select ON deliveries FOR SELECT USING (
  (auth.has_capability('deliveries.view', 'own')
    AND (source_org_id = ANY(auth.user_org_ids()) OR destination_org_id = ANY(auth.user_org_ids())))
  OR auth.has_capability('deliveries.view', 'district')
  OR auth.has_capability('deliveries.view', 'national')
);

CREATE POLICY deliveries_insert ON deliveries FOR INSERT WITH CHECK (
  auth.has_capability('deliveries.handshake', 'own')
  AND (source_org_id = ANY(auth.user_org_ids()) OR destination_org_id = ANY(auth.user_org_ids()))
);

-- Handshakes: visible to the two parties + scoped viewers
CREATE POLICY handshakes_select ON handshakes FOR SELECT USING (
  (auth.has_capability('deliveries.handshake', 'own')
    AND (sender_id = auth.platform_user_id() OR receiver_id = auth.platform_user_id()))
  OR (auth.has_capability('deliveries.view', 'own')
    AND EXISTS (
      SELECT 1 FROM deliveries d WHERE d.id = delivery_id
      AND (d.source_org_id = ANY(auth.user_org_ids()) OR d.destination_org_id = ANY(auth.user_org_ids()))
    ))
  OR auth.has_capability('deliveries.view', 'district')
  OR auth.has_capability('deliveries.view', 'national')
);

CREATE POLICY handshakes_insert ON handshakes FOR INSERT WITH CHECK (
  auth.has_capability('deliveries.handshake', 'own')
);

CREATE POLICY handshakes_update ON handshakes FOR UPDATE USING (
  auth.has_capability('deliveries.handshake', 'own')
  AND (sender_id = auth.platform_user_id() OR receiver_id = auth.platform_user_id())
  AND status = 'pending'
);

-- Advances: visible to supplier + recipient + scoped
CREATE POLICY advances_select ON advances FOR SELECT USING (
  (auth.has_capability('deliveries.view', 'own')
    AND (supplier_org_id = ANY(auth.user_org_ids()) OR recipient_org_id = ANY(auth.user_org_ids())))
  OR auth.has_capability('deliveries.view', 'district')
);

-- Contract deliveries: same as deliveries
CREATE POLICY cd_select ON contract_deliveries FOR SELECT USING (
  auth.has_capability('deliveries.view', 'own')
  OR auth.has_capability('deliveries.view', 'district')
);

-- ============================================================
-- HANDSHAKE CONFIRMATION LOGIC
-- Auto-resolve if discrepancy ≤ 2% (DEC-010: Tier 1 automatic)
-- ============================================================

CREATE OR REPLACE FUNCTION confirm_handshake()
RETURNS trigger AS $$
BEGIN
  -- Only fire when receiver submits their count
  IF NEW.receiver_count IS NOT NULL AND OLD.receiver_count IS NULL THEN
    -- Calculate discrepancy
    NEW.discrepancy_pct := ABS(NEW.sender_count - NEW.receiver_count) / GREATEST(NEW.sender_count, 1) * 100;

    IF NEW.discrepancy_pct <= 2.0 THEN
      -- Auto-confirm: within tolerance (Tier 1)
      NEW.status := 'confirmed';
      NEW.auto_resolved := true;
      -- Update delivery status
      UPDATE deliveries SET status = 'confirmed', received_at = now()
        WHERE id = NEW.delivery_id;
    ELSE
      -- Disputed: both claims preserved
      NEW.status := 'disputed';
    END IF;

    -- Audit
    PERFORM log_audit(
      NEW.receiver_id,
      CASE WHEN NEW.status = 'confirmed' THEN 'handshake' ELSE 'dispute' END,
      'handshakes',
      NEW.id,
      jsonb_build_object(
        'sender_count', NEW.sender_count,
        'receiver_count', NEW.receiver_count,
        'discrepancy_pct', NEW.discrepancy_pct,
        'auto_resolved', NEW.auto_resolved
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_confirm_handshake
  BEFORE UPDATE ON handshakes
  FOR EACH ROW
  EXECUTE FUNCTION confirm_handshake();
