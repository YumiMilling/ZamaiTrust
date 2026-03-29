-- Contracts Module: Forward Contracts
-- General-purpose commitments between two organisations.
-- CATSP config: processor buys grain from cluster at agreed terms.

CREATE TABLE contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES seasons(id) NOT NULL,
  contract_type text NOT NULL DEFAULT 'purchase', -- purchase | toll_processing (Phase 1+)

  -- Parties
  buyer_org_id uuid REFERENCES organisations(id) NOT NULL, -- processor / buyer
  seller_org_id uuid REFERENCES organisations(id), -- cluster — NULL when posted, set when accepted

  -- What's being exchanged
  item_id uuid REFERENCES items(id) NOT NULL,
  grade text NOT NULL,
  quantity_kg numeric NOT NULL,

  -- Pricing (DEC: pricing rule, not fixed price — but Phase 0 starts with fixed for simplicity)
  price_per_kg numeric NOT NULL, -- ZMW — Phase 0: fixed price. Phase 1+: formula reference
  pricing_type text DEFAULT 'fixed', -- fixed | index_linked | floor_upside | collar
  pricing_config jsonb, -- for non-fixed: {"index": "lusaka_spot", "floor": 6000, "cap": 9500}

  -- Delivery window
  delivery_window_start date NOT NULL,
  delivery_window_end date NOT NULL,

  -- Product type (what form does the buyer want?)
  product_type text, -- raw_grain | flour | meal | oil | grits | roller_meal

  -- Discovery: who can see this when posted?
  discovery_scope text DEFAULT 'district', -- district | province | national
  discovery_district text,
  discovery_province text,

  -- Status
  status text DEFAULT 'posted', -- posted | accepted | active | fulfilled | expired | cancelled | disputed

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  fulfilled_at timestamptz
);

CREATE INDEX idx_contract_season ON contracts(season_id);
CREATE INDEX idx_contract_buyer ON contracts(buyer_org_id);
CREATE INDEX idx_contract_seller ON contracts(seller_org_id);
CREATE INDEX idx_contract_item ON contracts(item_id);
CREATE INDEX idx_contract_status ON contracts(status);
CREATE INDEX idx_contract_discovery ON contracts(discovery_scope, discovery_district, discovery_province);

-- RLS: contracts visible based on capability + scope
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY contracts_select ON contracts FOR SELECT USING (
  -- Own: user's org is a party to the contract
  (auth.has_capability('contracts.view', 'own')
    AND (buyer_org_id = ANY(auth.user_org_ids())
         OR seller_org_id = ANY(auth.user_org_ids())))
  OR
  -- Posted contracts visible to eligible clusters (discovery scope)
  (auth.has_capability('contracts.view', 'own')
    AND status = 'posted'
    AND (discovery_scope = 'national'
         OR (discovery_scope = 'province' AND discovery_province = ANY(auth.scoped_values('contracts.view', 'province')))
         OR (discovery_scope = 'district' AND discovery_district = ANY(auth.scoped_values('contracts.view', 'district')))))
  OR
  -- District+ scope
  auth.has_capability('contracts.view', 'district')
  OR
  auth.has_capability('contracts.view', 'national')
);

CREATE POLICY contracts_insert ON contracts FOR INSERT WITH CHECK (
  auth.has_capability('contracts.create', 'own')
  AND buyer_org_id = ANY(auth.user_org_ids())
);

CREATE POLICY contracts_update ON contracts FOR UPDATE USING (
  -- Only accept (change status) if user has accept capability
  (auth.has_capability('contracts.accept', 'own')
    AND seller_org_id = ANY(auth.user_org_ids()))
  OR
  -- Buyer can update their own posted contract
  (auth.has_capability('contracts.create', 'own')
    AND buyer_org_id = ANY(auth.user_org_ids())
    AND status = 'posted')
);
