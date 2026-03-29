-- Phase 0 Seed Data: Kagezi Seeds × Yumi Milling Pilot
-- Monze, Southern Province, Zambia
-- Real companies, real crops, real value chain

-- ============================================================
-- ORGANISATIONS
-- ============================================================

INSERT INTO organisations (id, name, type, location_district, location_province, metadata) VALUES
  -- Platform operator
  ('00000000-0000-0000-0000-000000000001', 'ZamAi Solutions', 'platform', 'Choma', 'Southern', '{"registered": "PACRA", "location": "Batoka"}'),

  -- Processor
  ('00000000-0000-0000-0000-000000000010', 'Yumi Milling', 'processor', 'Monze', 'Southern', '{"crops": ["maize", "soya", "pearl_millet", "sorghum"], "capacity": "multi-grain processing"}'),

  -- Seed supplier + aggregator + warehouse
  ('00000000-0000-0000-0000-000000000020', 'Kagezi Seeds Limited', 'supplier', 'Monze', 'Southern', '{"crops": ["pearl_millet", "sorghum", "sunflower", "groundnuts", "rice", "beans", "cowpeas", "pigeon_peas"], "warehouse": "Monze", "partner": "Caritas Czech Republic"}'),

  -- Kagezi's Monze warehouse (child org of Kagezi Seeds)
  ('00000000-0000-0000-0000-000000000021', 'Kagezi Monze Warehouse', 'depot', 'Monze', 'Southern', '{"parent": "Kagezi Seeds", "capacity_tonnes": 500}'),

  -- Pilot farmer clusters
  ('00000000-0000-0000-0000-000000000100', 'Monze Climate-Smart Cluster 1', 'cluster', 'Monze', 'Southern', '{"crop_focus": ["pearl_millet", "sorghum"], "via": "Kagezi"}'),
  ('00000000-0000-0000-0000-000000000101', 'Monze Maize Cluster 1', 'cluster', 'Monze', 'Southern', '{"crop_focus": ["maize", "soya"], "via": "independent"}');

-- Set Kagezi warehouse as child of Kagezi Seeds
UPDATE organisations SET parent_org_id = '00000000-0000-0000-0000-000000000020'
WHERE id = '00000000-0000-0000-0000-000000000021';

-- ============================================================
-- USERS (placeholder — real names/phones added at registration)
-- ============================================================

INSERT INTO users (id, name, phone, primary_org_id, preset) VALUES
  -- Platform admin
  ('00000000-0000-0000-1000-000000000001', 'Chris (ZamAi)', '+260970000001', '00000000-0000-0000-0000-000000000001', 'admin'),

  -- Yumi Milling staff
  ('00000000-0000-0000-1000-000000000010', 'Yumi Admin', '+260970000010', '00000000-0000-0000-0000-000000000010', 'processor'),

  -- Kagezi Seeds staff
  ('00000000-0000-0000-1000-000000000020', 'Marina (Kagezi)', '+260970000020', '00000000-0000-0000-0000-000000000020', 'input_supplier'),
  ('00000000-0000-0000-1000-000000000021', 'Kagezi Warehouse Operator', '+260970000021', '00000000-0000-0000-0000-000000000021', 'depot_operator'),

  -- Sample farmers (climate-smart cluster)
  ('00000000-0000-0000-1000-000000000100', 'Farmer A (Millet)', '+260970000100', '00000000-0000-0000-0000-000000000100', 'farmer_cluster'),
  ('00000000-0000-0000-1000-000000000101', 'Farmer B (Millet)', '+260970000101', '00000000-0000-0000-0000-000000000100', 'farmer_cluster'),

  -- Sample farmers (maize/soya cluster — independent, no Kagezi)
  ('00000000-0000-0000-1000-000000000200', 'Farmer C (Maize)', '+260970000200', '00000000-0000-0000-0000-000000000101', 'farmer_cluster'),
  ('00000000-0000-0000-1000-000000000201', 'Farmer D (Maize)', '+260970000201', '00000000-0000-0000-0000-000000000101', 'farmer_cluster');

-- ============================================================
-- USER AFFILIATIONS (who belongs to which org, in what role)
-- ============================================================

INSERT INTO user_affiliations (user_id, org_id, affiliation_type) VALUES
  -- Chris: platform admin
  ('00000000-0000-0000-1000-000000000001', '00000000-0000-0000-0000-000000000001', 'employee'),

  -- Yumi admin: processor employee
  ('00000000-0000-0000-1000-000000000010', '00000000-0000-0000-0000-000000000010', 'employee'),

  -- Marina: Kagezi employee (wears multiple hats)
  ('00000000-0000-0000-1000-000000000020', '00000000-0000-0000-0000-000000000020', 'employee'),

  -- Kagezi warehouse operator: affiliated with warehouse AND parent Kagezi
  ('00000000-0000-0000-1000-000000000021', '00000000-0000-0000-0000-000000000021', 'operator'),
  ('00000000-0000-0000-1000-000000000021', '00000000-0000-0000-0000-000000000020', 'employee'),

  -- Millet farmers: members of climate-smart cluster
  ('00000000-0000-0000-1000-000000000100', '00000000-0000-0000-0000-000000000100', 'member'),
  ('00000000-0000-0000-1000-000000000101', '00000000-0000-0000-0000-000000000100', 'member'),

  -- Maize farmers: members of maize cluster (no Kagezi affiliation)
  ('00000000-0000-0000-1000-000000000200', '00000000-0000-0000-0000-000000000101', 'member'),
  ('00000000-0000-0000-1000-000000000201', '00000000-0000-0000-0000-000000000101', 'member');

-- ============================================================
-- Note: User capabilities are assigned via a function that reads
-- the preset and creates user_capabilities + user_capability_scopes.
-- This will be done by an Edge Function at user creation time.
-- For seed data, we'd call: SELECT assign_preset(user_id, preset_id);
-- ============================================================
