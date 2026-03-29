-- Foundation: Attestations (Universal Claim Table)
-- DEC-007: Training, monitoring, quality, partner delivery — ALL go through attestations.
-- One structure, one Merkle tree, one audit trail.

CREATE TABLE attestations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attester_id uuid REFERENCES users(id) NOT NULL,
  attestation_type text NOT NULL, -- quality_test | training | monitoring_visit | advisory | insurance_trigger | service_delivery | inspection | sale_completed | fx_executed

  -- What this is about
  subject_org_id uuid REFERENCES organisations(id),
  subject_record_id uuid, -- optional link to specific record
  subject_table text, -- which table the record_id refers to
  claim jsonb NOT NULL, -- structured data: the actual claim

  -- Corroboration (optional — makes the attestation stronger)
  witness_id uuid REFERENCES users(id),
  witness_confirmed boolean DEFAULT false,
  witness_timestamp timestamptz,
  evidence jsonb, -- GPS coordinates, photo hashes, document references, test data

  -- Integrity
  season_id uuid, -- links to seasons table (created in contracts module)
  hash text, -- SHA-256 of claim + evidence, for Merkle tree inclusion
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_attest_attester ON attestations(attester_id);
CREATE INDEX idx_attest_type ON attestations(attestation_type);
CREATE INDEX idx_attest_subject ON attestations(subject_org_id);
CREATE INDEX idx_attest_season ON attestations(season_id);
CREATE INDEX idx_attest_time ON attestations(created_at);
