-- Foundation: Notifications (SMS via Africa's Talking)
-- Phase 0: outbound SMS only (payment confirmations, vote invitations)
-- Phase 1+: USSD, push notifications, in-app

-- Notification queue
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES users(id) NOT NULL,
  channel text NOT NULL DEFAULT 'sms', -- sms | push | in_app | ussd
  phone_number text, -- for SMS
  template text NOT NULL, -- delivery_confirmed | payment_advance | payment_settlement | vote_invitation | vote_result | dispute_filed
  variables jsonb NOT NULL, -- template variables: {farmer_name, amount, reference, ...}
  message_text text, -- rendered message (set by Edge Function)

  -- Delivery status
  status text DEFAULT 'pending', -- pending | sending | sent | delivered | failed
  provider_ref text, -- Africa's Talking message ID
  sent_at timestamptz,
  delivered_at timestamptz,
  failure_reason text,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notif_recipient ON notifications(recipient_id);
CREATE INDEX idx_notif_status ON notifications(status);
CREATE INDEX idx_notif_template ON notifications(template);

-- Notification templates
CREATE TABLE notification_templates (
  id text PRIMARY KEY, -- template name
  channel text NOT NULL DEFAULT 'sms',
  body text NOT NULL, -- with {{variable}} placeholders
  max_length integer DEFAULT 160, -- SMS limit
  active boolean DEFAULT true
);

-- ============================================================
-- SEED: SMS templates for Phase 0
-- ============================================================

INSERT INTO notification_templates (id, channel, body) VALUES
  ('delivery_confirmed', 'sms',
   'CATSP: Delivery confirmed. {{quantity_kg}}kg {{item_name}} Grade {{grade}} at {{location}}. Ref: D-{{ref}}. Receipt printed.'),
  ('payment_advance', 'sms',
   'CATSP: K{{amount}} advance deposited to your mobile money. Delivery of {{quantity_kg}}kg {{item_name}} confirmed. Ref: D-{{ref}}.'),
  ('payment_settlement', 'sms',
   'CATSP: K{{amount}} final settlement deposited. Season complete. Total earned: K{{total}}. Ref: D-{{ref}}.'),
  ('vote_invitation', 'sms',
   'CATSP: New proposal for {{cluster_name}}: "{{title}}". Reply YES or NO by {{deadline}}. Ref: P-{{ref}}.'),
  ('vote_result', 'sms',
   'CATSP: Proposal "{{title}}" — {{outcome}}. Votes: {{for}} for, {{against}} against. {{quorum_status}}.'),
  ('dispute_filed', 'sms',
   'CATSP: Dispute filed on delivery D-{{ref}}. Your claim: {{your_count}}kg. Other party claims: {{other_count}}kg. An officer will contact you.');

-- ============================================================
-- HELPER: Queue a notification
-- ============================================================

CREATE OR REPLACE FUNCTION queue_notification(
  p_recipient_id uuid,
  p_template text,
  p_variables jsonb
)
RETURNS uuid AS $$
DECLARE
  v_phone text;
  v_template_body text;
  v_message text;
  v_notif_id uuid;
BEGIN
  -- Get recipient phone
  SELECT phone INTO v_phone FROM users WHERE id = p_recipient_id;

  -- Get template
  SELECT body INTO v_template_body FROM notification_templates WHERE id = p_template AND active = true;
  IF v_template_body IS NULL THEN RETURN NULL; END IF;

  -- Simple variable substitution
  v_message := v_template_body;
  FOR key IN SELECT jsonb_object_keys(p_variables) LOOP
    v_message := REPLACE(v_message, '{{' || key || '}}', p_variables ->> key);
  END LOOP;

  -- Queue
  INSERT INTO notifications (recipient_id, phone_number, template, variables, message_text)
  VALUES (p_recipient_id, v_phone, p_template, p_variables, v_message)
  RETURNING id INTO v_notif_id;

  RETURN v_notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUTO-NOTIFY on handshake confirmation
-- ============================================================

CREATE OR REPLACE FUNCTION notify_on_handshake()
RETURNS trigger AS $$
DECLARE
  v_delivery RECORD;
  v_item RECORD;
BEGIN
  IF NEW.status != 'confirmed' OR OLD.status = 'confirmed' THEN RETURN NEW; END IF;

  SELECT * INTO v_delivery FROM deliveries WHERE id = NEW.delivery_id;
  SELECT * INTO v_item FROM items WHERE id = v_delivery.item_id;

  -- Notify farmer
  PERFORM queue_notification(
    NEW.sender_id,
    'delivery_confirmed',
    jsonb_build_object(
      'quantity_kg', NEW.sender_count,
      'item_name', v_item.name,
      'grade', COALESCE(v_delivery.grade, 'TBD'),
      'location', 'Monze Warehouse',
      'ref', LEFT(v_delivery.id::text, 8)
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_notify_handshake
  AFTER UPDATE ON handshakes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_handshake();

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_select ON notifications FOR SELECT USING (
  recipient_id = auth.platform_user_id()
  OR auth.has_capability('admin.users', 'national')
);

CREATE POLICY notif_templates_select ON notification_templates FOR SELECT USING (true);
