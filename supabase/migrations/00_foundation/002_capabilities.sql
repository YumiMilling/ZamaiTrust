-- Foundation: Capability-Based Access Control
-- The permission vocabulary. Every RLS policy checks these.
-- DEC-002: Capabilities over roles. Presets are convenience, not enforcement.

-- Capability definitions: the vocabulary of what anyone can do
CREATE TABLE capabilities (
  id text PRIMARY KEY, -- e.g. "contracts.view", "deliveries.handshake"
  module text NOT NULL, -- contracts | deliveries | financial | quality | training | monitoring | governance | trust | insurance | cases | partner | issues | anomaly | enforcement | admin | audit
  name text NOT NULL, -- human-readable
  description text,
  access_type text NOT NULL, -- read | write | admin
  created_at timestamptz DEFAULT now()
);

-- Who has which capability
CREATE TABLE user_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  capability_id text REFERENCES capabilities(id) NOT NULL,
  scope_level text NOT NULL, -- own | assigned | district | province | national | facility | actuarial | custom
  granted_by uuid REFERENCES users(id),
  active boolean DEFAULT true,
  granted_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  UNIQUE(user_id, capability_id)
);

CREATE INDEX idx_ucap_user ON user_capabilities(user_id);
CREATE INDEX idx_ucap_cap ON user_capabilities(capability_id);
CREATE INDEX idx_ucap_active ON user_capabilities(active) WHERE active = true;

-- Scope values: what specifically does this grant cover?
CREATE TABLE user_capability_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_capability_id uuid REFERENCES user_capabilities(id) NOT NULL,
  scope_type text NOT NULL, -- district | province | cluster | depot | facility
  scope_value text NOT NULL -- "Choma" | "Southern" | uuid | "saff"
);

CREATE INDEX idx_ucscope_ucap ON user_capability_scopes(user_capability_id);

-- Presets: named bundles of capabilities (convenience, not enforcement)
CREATE TABLE presets (
  id text PRIMARY KEY, -- "farmer_cluster" | "processor" | "extension_officer" | etc.
  name text NOT NULL,
  description text
);

CREATE TABLE preset_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_id text REFERENCES presets(id) NOT NULL,
  capability_id text REFERENCES capabilities(id) NOT NULL,
  default_scope_level text NOT NULL,
  UNIQUE(preset_id, capability_id)
);

-- Seed the capability vocabulary
INSERT INTO capabilities (id, module, name, description, access_type) VALUES
  -- Contracts
  ('contracts.view', 'contracts', 'View contracts', 'See forward contracts and commitments', 'read'),
  ('contracts.create', 'contracts', 'Create contracts', 'Post new forward contracts', 'write'),
  ('contracts.accept', 'contracts', 'Accept contracts', 'Accept contracts via governance vote', 'write'),
  -- Deliveries
  ('deliveries.handshake', 'deliveries', 'Confirm deliveries', 'Participate in delivery handshake', 'write'),
  ('deliveries.view', 'deliveries', 'View deliveries', 'See delivery records', 'read'),
  -- Financial
  ('financial.view', 'financial', 'View financial data', 'See financial data (own = detail, district+ = aggregate)', 'read'),
  ('financial.trigger', 'financial', 'Trigger payment', 'Trigger payment waterfall', 'write'),
  -- Quality
  ('quality.write', 'quality', 'Record quality', 'Record quality tests via attestation', 'write'),
  ('quality.view', 'quality', 'View quality', 'See quality test results', 'read'),
  -- Training
  ('training.write', 'training', 'Record training', 'Record training sessions via attestation', 'write'),
  ('training.view', 'training', 'View training', 'See training records', 'read'),
  -- Monitoring
  ('monitoring.write', 'monitoring', 'Record monitoring', 'Record field visits via attestation', 'write'),
  ('monitoring.view', 'monitoring', 'View monitoring', 'See monitoring data', 'read'),
  -- Governance
  ('governance.propose', 'governance', 'Create proposals', 'Create cluster governance proposals', 'write'),
  ('governance.vote', 'governance', 'Vote', 'Vote on cluster proposals', 'write'),
  ('governance.view', 'governance', 'View governance', 'See governance data (proposals, treasury, constitution)', 'read'),
  -- Trust
  ('trust.view', 'trust', 'View trust', 'See trust data (own = number, assigned = tier, district+ = distribution)', 'read'),
  -- Insurance
  ('insurance.view', 'insurance', 'View insurance', 'See insurance policies and claims', 'read'),
  ('insurance.manage', 'insurance', 'Manage insurance', 'Underwrite, set premiums, process claims', 'write'),
  -- Cases
  ('cases.file', 'cases', 'File dispute', 'File a dispute or complaint', 'write'),
  ('cases.view', 'cases', 'View cases', 'See case data', 'read'),
  ('cases.mediate', 'cases', 'Mediate', 'Facilitate mediation (Tier 2)', 'write'),
  ('cases.arbitrate', 'cases', 'Arbitrate', 'Serve on arbitration panel (Tier 3)', 'write'),
  -- Partner
  ('partner.write', 'partner', 'Record service', 'Record service delivery via attestation', 'write'),
  ('partner.view', 'partner', 'View partner', 'See partner data', 'read'),
  -- Issues
  ('issues.raise', 'issues', 'Raise issue', 'Flag problems', 'write'),
  ('issues.view', 'issues', 'View issues', 'See issue flags', 'read'),
  -- Anomaly
  ('anomaly.view', 'anomaly', 'View anomalies', 'See anomaly flags', 'read'),
  ('anomaly.investigate', 'anomaly', 'Investigate', 'Resolve anomaly flags', 'write'),
  -- Audit
  ('audit.view', 'audit', 'View audit', 'See audit log', 'read'),
  -- Enforcement
  ('enforcement.suspend', 'enforcement', 'Suspend accounts', 'Suspend user accounts (requires 2 admins)', 'admin'),
  ('enforcement.evidence', 'enforcement', 'Generate evidence', 'Generate evidence packages for referral', 'admin'),
  ('enforcement.eject', 'enforcement', 'Eject', 'Permanent removal (requires arbitration/court)', 'admin'),
  -- Admin
  ('admin.users', 'admin', 'Manage users', 'Create and manage user accounts', 'admin'),
  ('admin.capabilities', 'admin', 'Assign capabilities', 'Assign capabilities to users', 'admin'),
  ('admin.merkle', 'admin', 'Publish Merkle', 'Publish Merkle roots', 'admin'),
  ('admin.waterfall', 'admin', 'Modify waterfall', 'Modify waterfall config (multi-sig)', 'admin');

-- Seed the 12 presets
INSERT INTO presets (id, name, description) VALUES
  ('farmer_cluster', 'Farmer (Cluster Member)', 'View/accept contracts, handshake deliveries, vote on proposals, view own financials'),
  ('cluster_leader', 'Cluster Leader', 'Everything a farmer can do + propose governance changes'),
  ('processor', 'Processor', 'Create/view contracts, handshake deliveries, trigger waterfall'),
  ('depot_operator', 'Depot Operator', 'Handshake deliveries, record quality tests'),
  ('input_supplier', 'Input Supplier', 'Record input advances, handshake deliveries, view linked contracts'),
  ('extension_officer', 'Extension Officer', 'Record training/monitoring, view assigned clusters, mediate disputes'),
  ('district_coordinator', 'District Coordinator', 'View all clusters in district, extension activity, aggregate financials'),
  ('provincial_coordinator', 'Provincial Coordinator', 'Province-wide aggregates, district comparison'),
  ('zareta', 'ZARETA (National)', 'National view: all aggregates, partner performance, KPIs, audit, anomalies'),
  ('implementing_partner', 'Implementing Partner', 'Record service delivery, view assigned clusters, raise issues'),
  ('insurer', 'Insurer', 'Underwrite contracts, set premiums, process claims, view actuarial data'),
  ('zattf_staff', 'ZATTF Staff', 'Facility-specific portfolio, national metrics, partner performance');

-- Seed preset capabilities (farmer_cluster)
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('farmer_cluster', 'contracts.view', 'own'),
  ('farmer_cluster', 'contracts.accept', 'own'),
  ('farmer_cluster', 'deliveries.handshake', 'own'),
  ('farmer_cluster', 'deliveries.view', 'own'),
  ('farmer_cluster', 'financial.view', 'own'),
  ('farmer_cluster', 'governance.vote', 'own'),
  ('farmer_cluster', 'governance.view', 'own'),
  ('farmer_cluster', 'trust.view', 'own'),
  ('farmer_cluster', 'quality.view', 'own'),
  ('farmer_cluster', 'cases.file', 'own'),
  ('farmer_cluster', 'cases.view', 'own');

-- cluster_leader = farmer_cluster + governance.propose
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('cluster_leader', 'contracts.view', 'own'),
  ('cluster_leader', 'contracts.accept', 'own'),
  ('cluster_leader', 'deliveries.handshake', 'own'),
  ('cluster_leader', 'deliveries.view', 'own'),
  ('cluster_leader', 'financial.view', 'own'),
  ('cluster_leader', 'governance.propose', 'own'),
  ('cluster_leader', 'governance.vote', 'own'),
  ('cluster_leader', 'governance.view', 'own'),
  ('cluster_leader', 'trust.view', 'own'),
  ('cluster_leader', 'quality.view', 'own'),
  ('cluster_leader', 'cases.file', 'own'),
  ('cluster_leader', 'cases.view', 'own');

-- processor
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('processor', 'contracts.create', 'own'),
  ('processor', 'contracts.view', 'own'),
  ('processor', 'deliveries.handshake', 'own'),
  ('processor', 'deliveries.view', 'own'),
  ('processor', 'financial.view', 'own'),
  ('processor', 'financial.trigger', 'own'),
  ('processor', 'quality.view', 'own'),
  ('processor', 'trust.view', 'own'),
  ('processor', 'cases.file', 'own'),
  ('processor', 'cases.view', 'own');

-- depot_operator (NO financial.view — DEC-003)
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('depot_operator', 'deliveries.handshake', 'own'),
  ('depot_operator', 'deliveries.view', 'own'),
  ('depot_operator', 'quality.write', 'own'),
  ('depot_operator', 'quality.view', 'own'),
  ('depot_operator', 'trust.view', 'own');

-- extension_officer (NO financial.view — DEC-003)
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('extension_officer', 'deliveries.view', 'assigned'),
  ('extension_officer', 'quality.view', 'assigned'),
  ('extension_officer', 'training.write', 'own'),
  ('extension_officer', 'training.view', 'assigned'),
  ('extension_officer', 'monitoring.write', 'own'),
  ('extension_officer', 'monitoring.view', 'assigned'),
  ('extension_officer', 'trust.view', 'assigned'),
  ('extension_officer', 'cases.mediate', 'assigned'),
  ('extension_officer', 'issues.raise', 'own'),
  ('extension_officer', 'issues.view', 'assigned');

-- input_supplier
INSERT INTO preset_capabilities (preset_id, capability_id, default_scope_level) VALUES
  ('input_supplier', 'deliveries.handshake', 'own'),
  ('input_supplier', 'deliveries.view', 'own'),
  ('input_supplier', 'contracts.view', 'own'),
  ('input_supplier', 'financial.view', 'own'),
  ('input_supplier', 'trust.view', 'own');
