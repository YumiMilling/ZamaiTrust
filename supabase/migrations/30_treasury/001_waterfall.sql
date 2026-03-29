-- Treasury Module: Waterfall Configuration + Payment Display
-- DEC-008: Priority order — fixed, versioned, multi-sig to change
-- Phase 0: display-only (shows the split, human executes payment)

-- Waterfall configuration (versioned, multi-sig to change)
CREATE TABLE waterfall_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL,
  config jsonb NOT NULL, -- [{position:1, type:"warehouse", label:"Warehouse custody fee", default_pct:0.02}, ...]
  effective_from timestamptz NOT NULL,
  effective_to timestamptz, -- NULL = current
  approved_by jsonb NOT NULL, -- array of approver user IDs (minimum 3)
  created_at timestamptz DEFAULT now()
);

-- Payment records (display-only in Phase 0, automated in Phase 1)
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) NOT NULL,
  delivery_id uuid REFERENCES deliveries(id) NOT NULL,
  handshake_id uuid REFERENCES handshakes(id) NOT NULL,
  gross_amount_zmw numeric NOT NULL,
  waterfall_config_version integer NOT NULL,
  stage text DEFAULT 'advance', -- advance | final_settlement
  status text DEFAULT 'calculated', -- calculated | pending | processing | settled | failed
  triggered_at timestamptz DEFAULT now(),
  settled_at timestamptz
);

CREATE INDEX idx_payment_contract ON payments(contract_id);
CREATE INDEX idx_payment_delivery ON payments(delivery_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Individual payment lines (the waterfall splits)
CREATE TABLE payment_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid REFERENCES payments(id) NOT NULL,
  priority integer NOT NULL,
  recipient_type text NOT NULL, -- warehouse | financier | supplier | insurer | platform | cluster | farmer
  recipient_org_id uuid REFERENCES organisations(id),
  description text NOT NULL,
  amount_zmw numeric NOT NULL,
  percentage numeric, -- what % of gross this represents
  payment_method text, -- mobile_money | bank_transfer | internal
  status text DEFAULT 'calculated', -- calculated | pending | settled | failed
  settled_at timestamptz
);

CREATE INDEX idx_pline_payment ON payment_lines(payment_id);

-- ============================================================
-- SEED: Default waterfall configuration (DEC-008)
-- ============================================================

INSERT INTO waterfall_config (version, config, effective_from, approved_by) VALUES
(1, '[
  {"position": 1, "type": "warehouse",  "label": "Warehouse custody fee",     "default_pct": 0.02},
  {"position": 2, "type": "financier",  "label": "Warehouse receipt financing","default_pct": null, "note": "Repayment of receipt loan — Phase 1+"},
  {"position": 3, "type": "supplier",   "label": "Input supplier repayment",   "default_pct": null, "note": "Pro-rata to delivery"},
  {"position": 4, "type": "insurer",    "label": "Insurance premium",          "default_pct": null, "note": "Farmer share — Phase 1+"},
  {"position": 5, "type": "platform",   "label": "Platform fee",               "default_pct": 0.015},
  {"position": 6, "type": "farmer",     "label": "Farmer net income",          "default_pct": null, "note": "Remainder → cluster treasury → mobile money"}
]'::jsonb, now(), '["system"]'::jsonb);

-- ============================================================
-- WATERFALL CALCULATION FUNCTION
-- Phase 0: display-only — calculates the split, doesn't execute payments
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_waterfall(
  p_delivery_id uuid,
  p_contract_id uuid,
  p_handshake_id uuid
)
RETURNS uuid AS $$
DECLARE
  v_contract RECORD;
  v_delivery RECORD;
  v_advance RECORD;
  v_gross numeric;
  v_warehouse_fee numeric;
  v_supplier_repay numeric;
  v_platform_fee numeric;
  v_farmer_net numeric;
  v_payment_id uuid;
  v_config_version integer;
BEGIN
  -- Get contract and delivery details
  SELECT * INTO v_contract FROM contracts WHERE id = p_contract_id;
  SELECT * INTO v_delivery FROM deliveries WHERE id = p_delivery_id;

  -- Gross = price × quantity delivered
  v_gross := v_contract.price_per_kg * v_delivery.quantity_kg;

  -- Get current waterfall config version
  SELECT version INTO v_config_version FROM waterfall_config
    WHERE effective_to IS NULL ORDER BY version DESC LIMIT 1;

  -- Calculate each line
  v_warehouse_fee := v_gross * 0.02;

  -- Input supplier repayment (if any advance exists)
  SELECT COALESCE(SUM(value_zmw), 0) INTO v_supplier_repay
  FROM advances
  WHERE contract_id = p_contract_id
    AND recipient_org_id = v_delivery.source_org_id
    AND status IN ('committed', 'delivered', 'confirmed');

  -- Pro-rate supplier repayment to delivery proportion
  IF v_contract.quantity_kg > 0 THEN
    v_supplier_repay := v_supplier_repay * (v_delivery.quantity_kg / v_contract.quantity_kg);
  END IF;

  v_platform_fee := v_gross * 0.015;
  v_farmer_net := v_gross - v_warehouse_fee - v_supplier_repay - v_platform_fee;

  -- Ensure farmer net is not negative
  IF v_farmer_net < 0 THEN v_farmer_net := 0; END IF;

  -- Create payment record
  INSERT INTO payments (contract_id, delivery_id, handshake_id, gross_amount_zmw, waterfall_config_version, status)
  VALUES (p_contract_id, p_delivery_id, p_handshake_id, v_gross, COALESCE(v_config_version, 1), 'calculated')
  RETURNING id INTO v_payment_id;

  -- Create payment lines
  INSERT INTO payment_lines (payment_id, priority, recipient_type, recipient_org_id, description, amount_zmw, percentage, status) VALUES
    (v_payment_id, 1, 'warehouse', v_delivery.destination_org_id, 'Warehouse custody fee (2%)', v_warehouse_fee, 2.0, 'calculated'),
    (v_payment_id, 3, 'supplier', NULL, 'Input supplier repayment (pro-rata)', v_supplier_repay, ROUND(v_supplier_repay / GREATEST(v_gross, 1) * 100, 1), 'calculated'),
    (v_payment_id, 5, 'platform', NULL, 'Platform fee (1.5%)', v_platform_fee, 1.5, 'calculated'),
    (v_payment_id, 6, 'farmer', v_delivery.source_org_id, 'Farmer net income', v_farmer_net, ROUND(v_farmer_net / GREATEST(v_gross, 1) * 100, 1), 'calculated');

  -- Audit
  PERFORM log_audit(
    (SELECT sender_id FROM handshakes WHERE id = p_handshake_id),
    'payment',
    'payments',
    v_payment_id,
    jsonb_build_object('gross', v_gross, 'farmer_net', v_farmer_net, 'stage', 'advance')
  );

  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE waterfall_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY wf_config_select ON waterfall_config FOR SELECT USING (true); -- everyone can see the rules

CREATE POLICY payments_select ON payments FOR SELECT USING (
  (auth.has_capability('financial.view', 'own')
    AND EXISTS (
      SELECT 1 FROM deliveries d WHERE d.id = delivery_id
      AND (d.source_org_id = ANY(auth.user_org_ids()) OR d.destination_org_id = ANY(auth.user_org_ids()))
    ))
  OR auth.has_capability('financial.view', 'district')
);

CREATE POLICY plines_select ON payment_lines FOR SELECT USING (
  auth.has_capability('financial.view', 'own')
  OR auth.has_capability('financial.view', 'district')
);
