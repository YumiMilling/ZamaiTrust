-- Contracts Module: Seasons, Items (Commodities), Grading Standards
-- General-purpose: "seasons" can be ag seasons, project phases, fiscal years
-- "items" can be commodities, services, deliverables

-- Time periods
CREATE TABLE seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- "2026-pearl-millet-southern" | "Phase 1 Q1-Q2"
  item_id uuid, -- links to items (set after items table created)
  region_province text, -- NULL = national
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'planning', -- planning | active | harvest | post_harvest | closed
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_season_status ON seasons(status);

-- What's being exchanged
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- "Pearl Millet" | "White Maize" | "Consulting Service"
  category text NOT NULL, -- cereal | legume | oilseed | tuber | service | material
  unit text DEFAULT 'kg', -- base unit: kg | tonne | piece | hour
  metadata jsonb DEFAULT '{}', -- flexible: crop-specific data, service descriptions
  created_at timestamptz DEFAULT now()
);

-- Add foreign key from seasons to items
ALTER TABLE seasons ADD CONSTRAINT fk_season_item
  FOREIGN KEY (item_id) REFERENCES items(id);

-- Quality/grading standards per item
CREATE TABLE grading_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) NOT NULL,
  grade text NOT NULL, -- "A" | "B" | "C" | "Pass" | "Fail"
  quality_parameters jsonb NOT NULL, -- {"aflatoxin_max_ppb": 10, "moisture_max_pct": 13.5}
  description text,
  UNIQUE(item_id, grade)
);

-- ============================================================
-- SEED: Kagezi × Yumi pilot commodities
-- ============================================================

INSERT INTO items (id, name, category, unit, metadata) VALUES
  ('00000000-0000-0000-2000-000000000001', 'White Maize', 'cereal', 'kg', '{"lusaka_spot_kwacha": 6400}'),
  ('00000000-0000-0000-2000-000000000002', 'Soya Beans', 'legume', 'kg', '{}'),
  ('00000000-0000-0000-2000-000000000003', 'Pearl Millet', 'cereal', 'kg', '{"climate_smart": true, "kagezi_variety": true}'),
  ('00000000-0000-0000-2000-000000000004', 'Sorghum', 'cereal', 'kg', '{"climate_smart": true, "kagezi_variety": true}'),
  ('00000000-0000-0000-2000-000000000005', 'Sunflower', 'oilseed', 'kg', '{"climate_smart": true, "kagezi_variety": true}'),
  ('00000000-0000-0000-2000-000000000006', 'Groundnuts', 'legume', 'kg', '{"kagezi_variety": true}');

-- Grading standards for Phase 0 crops
INSERT INTO grading_standards (item_id, grade, quality_parameters, description) VALUES
  -- White Maize
  ('00000000-0000-0000-2000-000000000001', 'A', '{"moisture_max_pct": 12.5, "aflatoxin_max_ppb": 10, "foreign_matter_max_pct": 1}', 'Premium grade — export quality'),
  ('00000000-0000-0000-2000-000000000001', 'B', '{"moisture_max_pct": 13.5, "aflatoxin_max_ppb": 20, "foreign_matter_max_pct": 2}', 'Standard grade — domestic milling'),
  ('00000000-0000-0000-2000-000000000001', 'C', '{"moisture_max_pct": 14.5, "aflatoxin_max_ppb": 50, "foreign_matter_max_pct": 5}', 'Feed grade'),
  -- Pearl Millet
  ('00000000-0000-0000-2000-000000000003', 'A', '{"moisture_max_pct": 12.0, "foreign_matter_max_pct": 1}', 'Premium — flour and meal quality'),
  ('00000000-0000-0000-2000-000000000003', 'B', '{"moisture_max_pct": 13.5, "foreign_matter_max_pct": 3}', 'Standard — processing quality'),
  -- Sorghum
  ('00000000-0000-0000-2000-000000000004', 'A', '{"moisture_max_pct": 12.0, "tannin_max_pct": 0.5}', 'Low-tannin — food grade'),
  ('00000000-0000-0000-2000-000000000004', 'B', '{"moisture_max_pct": 13.0, "tannin_max_pct": 1.5}', 'Standard — brewing/feed'),
  -- Soya
  ('00000000-0000-0000-2000-000000000002', 'A', '{"moisture_max_pct": 12.0, "oil_content_min_pct": 18}', 'Premium — oil pressing'),
  ('00000000-0000-0000-2000-000000000002', 'B', '{"moisture_max_pct": 13.5, "oil_content_min_pct": 15}', 'Standard — meal/feed');

-- Phase 0 season
INSERT INTO seasons (id, name, item_id, region_province, start_date, end_date, status) VALUES
  ('00000000-0000-0000-3000-000000000001', '2026-maize-southern', '00000000-0000-0000-2000-000000000001', 'Southern', '2025-10-01', '2026-09-30', 'active'),
  ('00000000-0000-0000-3000-000000000002', '2026-millet-southern', '00000000-0000-0000-2000-000000000003', 'Southern', '2025-11-01', '2026-08-31', 'active'),
  ('00000000-0000-0000-3000-000000000003', '2026-sorghum-southern', '00000000-0000-0000-2000-000000000004', 'Southern', '2025-11-01', '2026-08-31', 'active');
