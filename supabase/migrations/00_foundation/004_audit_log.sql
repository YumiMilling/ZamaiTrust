-- Foundation: Audit Log
-- DEC-015: Append-only. No UPDATE or DELETE. Ever.

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  action text NOT NULL, -- create | read | update | delete | login | export | resolve_dispute | override | handshake | vote | payment
  table_name text,
  record_id uuid,
  detail jsonb,
  ip_address text,
  device_fingerprint text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_time ON audit_log(created_at);
CREATE INDEX idx_audit_record ON audit_log(record_id);

-- Prevent any UPDATE or DELETE on audit_log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only. No UPDATE or DELETE permitted.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_update_audit BEFORE UPDATE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

CREATE TRIGGER no_delete_audit BEFORE DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- Helper function to write audit entries (called from Edge Functions and triggers)
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id uuid,
  p_action text,
  p_table_name text DEFAULT NULL,
  p_record_id uuid DEFAULT NULL,
  p_detail jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO audit_log (user_id, action, table_name, record_id, detail)
  VALUES (p_user_id, p_action, p_table_name, p_record_id, p_detail)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
