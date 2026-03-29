-- Governance Module: Treasury, Proposals, Votes, Memberships, Constitutions
-- DEC-004: One member, one vote — always
-- DEC-005: Right to exit — unconditional
-- DEC-011: Multi-sig treasury thresholds

-- Cluster memberships
CREATE TABLE cluster_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  member_id uuid REFERENCES users(id) NOT NULL,
  role text DEFAULT 'member', -- member | leader | treasurer | secretary
  joined_at timestamptz DEFAULT now(),
  exited_at timestamptz,
  exit_reason text,
  status text DEFAULT 'active', -- active | exited | suspended
  total_delivered_kg numeric DEFAULT 0,
  total_earned_zmw numeric DEFAULT 0,
  outstanding_advance_zmw numeric DEFAULT 0,
  UNIQUE(cluster_id, member_id, status)
);

CREATE INDEX idx_cmem_cluster ON cluster_memberships(cluster_id);
CREATE INDEX idx_cmem_member ON cluster_memberships(member_id);
CREATE INDEX idx_cmem_status ON cluster_memberships(status);

-- Cluster treasury
CREATE TABLE cluster_treasury (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL UNIQUE,
  balance_zmw numeric DEFAULT 0,
  -- DEC-011: multi-sig thresholds
  threshold_low numeric DEFAULT 2000,    -- leader alone
  threshold_high numeric DEFAULT 10000,  -- leader + treasurer
  -- above threshold_high: 2-of-3 (leader, treasurer, depot witness)
  last_deposit_at timestamptz,
  last_withdrawal_at timestamptz
);

-- Treasury transactions
CREATE TABLE treasury_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  transaction_type text NOT NULL, -- deposit_waterfall | withdrawal_operational | distribution_member | withdrawal_emergency
  amount_zmw numeric NOT NULL,
  description text NOT NULL,
  payment_id uuid, -- links to payment (from treasury module when built)
  status text DEFAULT 'pending', -- pending | approved | executed | rejected
  created_at timestamptz DEFAULT now(),
  executed_at timestamptz
);

-- Treasury approvals (multi-sig)
CREATE TABLE treasury_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES treasury_transactions(id) NOT NULL,
  approver_id uuid REFERENCES users(id) NOT NULL,
  approver_role text NOT NULL, -- cluster_leader | treasurer | depot_witness
  approved boolean NOT NULL,
  signature_timestamp timestamptz DEFAULT now()
);

-- Proposals & Voting
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  proposer_id uuid REFERENCES users(id) NOT NULL,
  proposal_type text NOT NULL, -- contract_acceptance | financial_rule | governance_change | membership_change | emergency
  title text NOT NULL,
  description text NOT NULL,
  decision_data jsonb NOT NULL, -- structured: what exactly is being decided

  -- Voting rules (from governance config or cluster constitution)
  quorum_pct numeric NOT NULL,
  threshold_pct numeric NOT NULL,
  voting_opens timestamptz DEFAULT now(),
  voting_closes timestamptz NOT NULL,

  -- Extension mechanism
  extended boolean DEFAULT false,
  extension_deadline timestamptz,

  -- Results
  votes_for integer DEFAULT 0,
  votes_against integer DEFAULT 0,
  eligible_voters integer NOT NULL,
  quorum_reached boolean DEFAULT false,
  outcome text, -- approved | rejected | expired | extended

  -- Linked records
  contract_id uuid REFERENCES contracts(id),

  -- Time lock (for governance changes)
  time_lock_until timestamptz,
  time_lock_challenged boolean DEFAULT false,

  status text DEFAULT 'voting', -- voting | extended | approved | rejected | expired | challenged | executed
  created_at timestamptz DEFAULT now(),
  executed_at timestamptz
);

CREATE INDEX idx_prop_cluster ON proposals(cluster_id);
CREATE INDEX idx_prop_status ON proposals(status);
CREATE INDEX idx_prop_type ON proposals(proposal_type);

-- Individual votes
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) NOT NULL,
  voter_id uuid REFERENCES users(id) NOT NULL,
  vote boolean NOT NULL, -- true = for, false = against
  vote_method text NOT NULL, -- sms | kiosk | pwa
  delegated_from uuid REFERENCES users(id), -- if voting on someone's behalf
  voted_at timestamptz DEFAULT now(),
  UNIQUE(proposal_id, voter_id) -- DEC-004: one member, one vote
);

CREATE INDEX idx_vote_proposal ON votes(proposal_id);

-- Vote delegations
CREATE TABLE vote_delegations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  delegator_id uuid REFERENCES users(id) NOT NULL,
  delegate_id uuid REFERENCES users(id) NOT NULL,
  scope text DEFAULT 'all', -- all | contract_acceptance | governance_change
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  CONSTRAINT not_self CHECK (delegator_id != delegate_id)
);

-- Cluster constitutions (versioned)
CREATE TABLE cluster_constitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  version integer NOT NULL,
  content jsonb NOT NULL, -- distribution rules, leadership requirements, membership terms
  approved_by_proposal uuid REFERENCES proposals(id),
  effective_from timestamptz NOT NULL,
  effective_to timestamptz
);

-- Distribution rules (how profits split)
CREATE TABLE cluster_distribution_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id uuid REFERENCES organisations(id) NOT NULL,
  formula_type text NOT NULL, -- proportional | equal | hybrid | custom
  formula_config jsonb NOT NULL, -- {"basis": "delivery_kg", "minimum_pct": 0}
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  approved_by_proposal uuid REFERENCES proposals(id),
  version integer NOT NULL
);

-- Exit settlements (DEC-005: right to exit)
CREATE TABLE exit_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES cluster_memberships(id) NOT NULL,
  pending_distributions_zmw numeric DEFAULT 0,
  treasury_share_zmw numeric DEFAULT 0,
  outstanding_advance_zmw numeric DEFAULT 0,
  net_settlement_zmw numeric NOT NULL,
  status text DEFAULT 'calculating', -- calculating | pending_payment | settled
  settled_at timestamptz
);

-- ============================================================
-- VOTE COUNTING TRIGGER
-- Auto-updates proposal outcome when votes come in
-- ============================================================

CREATE OR REPLACE FUNCTION count_votes()
RETURNS trigger AS $$
DECLARE
  prop RECORD;
  total_for integer;
  total_against integer;
  total_cast integer;
  quorum_met boolean;
BEGIN
  -- Get proposal details
  SELECT * INTO prop FROM proposals WHERE id = NEW.proposal_id;

  -- Count
  SELECT
    COUNT(*) FILTER (WHERE vote = true),
    COUNT(*) FILTER (WHERE vote = false),
    COUNT(*)
  INTO total_for, total_against, total_cast
  FROM votes WHERE proposal_id = NEW.proposal_id;

  -- Update counts
  UPDATE proposals SET
    votes_for = total_for,
    votes_against = total_against,
    quorum_reached = (total_cast::numeric / GREATEST(prop.eligible_voters, 1) * 100) >= prop.quorum_pct
  WHERE id = NEW.proposal_id;

  -- Check if voting period closed and quorum reached
  IF now() <= prop.voting_closes THEN
    -- Still open — check if already decisive
    quorum_met := (total_cast::numeric / GREATEST(prop.eligible_voters, 1) * 100) >= prop.quorum_pct;
    IF quorum_met THEN
      IF (total_for::numeric / GREATEST(total_cast, 1) * 100) >= prop.threshold_pct THEN
        UPDATE proposals SET status = 'approved', outcome = 'approved', executed_at = now()
          WHERE id = NEW.proposal_id AND status = 'voting';
      END IF;
    END IF;
  END IF;

  -- Audit
  PERFORM log_audit(NEW.voter_id, 'vote', 'proposals', NEW.proposal_id,
    jsonb_build_object('vote', NEW.vote, 'method', NEW.vote_method));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_count_votes
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION count_votes();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE cluster_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_treasury ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_constitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_distribution_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exit_settlements ENABLE ROW LEVEL SECURITY;

-- Members see their own cluster's governance data
CREATE POLICY gov_membership_select ON cluster_memberships FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('governance.view', 'district')
);

CREATE POLICY gov_treasury_select ON cluster_treasury FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('financial.view', 'district')
);

CREATE POLICY gov_tx_select ON treasury_transactions FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('financial.view', 'district')
);

CREATE POLICY gov_proposals_select ON proposals FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
  OR auth.has_capability('governance.view', 'district')
);

CREATE POLICY gov_proposals_insert ON proposals FOR INSERT WITH CHECK (
  auth.has_capability('governance.propose', 'own') AND cluster_id = ANY(auth.user_org_ids())
);

CREATE POLICY gov_votes_select ON votes FOR SELECT USING (
  auth.has_capability('governance.view', 'own')
  OR auth.has_capability('governance.view', 'district')
);

CREATE POLICY gov_votes_insert ON votes FOR INSERT WITH CHECK (
  auth.has_capability('governance.vote', 'own')
  AND voter_id = auth.platform_user_id()
);

CREATE POLICY gov_constitution_select ON cluster_constitutions FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
);

CREATE POLICY gov_dist_rules_select ON cluster_distribution_rules FOR SELECT USING (
  (auth.has_capability('governance.view', 'own') AND cluster_id = ANY(auth.user_org_ids()))
);

CREATE POLICY gov_exit_select ON exit_settlements FOR SELECT USING (
  auth.has_capability('governance.view', 'own')
);
