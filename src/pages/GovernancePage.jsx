import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import Footer from '../components/Footer'

const tiers = [
  { name: 'Verified', range: '50–64', color: 'var(--t3)', bg: 'rgba(90,86,82,.15)', border: 'var(--s4)', desc: 'New participants. Default starting score. Can transact normally.' },
  { name: 'Established', range: '65–79', color: 'var(--eg-br)', bg: 'rgba(15,114,116,.12)', border: 'var(--eg-mid)', desc: 'Track record of reliable delivery and quality. Eligible for cluster leadership roles.' },
  { name: 'Trusted', range: '80–89', color: 'var(--eg-vi)', bg: 'rgba(20,160,163,.12)', border: 'var(--eg-br)', desc: 'Strong history. Reduced insurance premiums. Preferred counterparty status.' },
  { name: 'Anchor', range: '90+', color: 'var(--eg-hi)', bg: 'rgba(25,200,204,.12)', border: 'var(--eg-vi)', desc: 'Highest reliability. Eligible for arbitration panels. Trust score reduces ZIRSAT guarantee requirements.' },
]

const trustEvents = [
  { event: 'Delivery confirmed (handshake)', effect: '+', note: 'Weighted by volume: reliability × log(volume_kg)' },
  { event: 'Quality test passed', effect: '+', note: 'Grade A scores higher than grade B' },
  { event: 'SAFF loan repaid on time', effect: '+', note: 'Financial reliability' },
  { event: 'Contract fulfilled in full', effect: '+', note: 'Largest positive signal' },
  { event: 'Delivery disputed', effect: '−', note: 'Both parties take a hit until resolved' },
  { event: 'Quality test failed', effect: '−', note: 'Proportional to severity' },
  { event: 'Loan defaulted', effect: '−−', note: 'Significant negative signal' },
  { event: 'Lost dispute case (frivolous)', effect: '−−', note: 'Discourages bad-faith complaints' },
  { event: 'Inactive season', effect: '−10%', note: 'Decay prevents stale Anchor scores' },
]

const voteTypes = [
  { type: 'Contract acceptance', quorum: '60%', threshold: 'Simple majority', window: '72 hours', extension: '+48 hours if quorum not reached' },
  { type: 'Financial rule change', quorum: '60%', threshold: 'Simple majority', window: '72 hours', extension: '+48 hours' },
  { type: 'Governance change', quorum: '75%', threshold: 'Two-thirds majority', window: '7 days', extension: '25% can challenge during time lock' },
  { type: 'Membership change', quorum: '60%', threshold: 'Simple majority', window: '72 hours', extension: '+48 hours' },
  { type: 'Emergency', quorum: '50%', threshold: 'Two-thirds majority', window: '24 hours', extension: 'None' },
]

const conflictTiers = [
  { tier: '1', name: 'Automatic', sla: '24 hours', who: 'System', desc: 'Handshake discrepancy ≤2%, arithmetic disputes, index insurance triggers. Auto-resolved by rule. Either party can challenge to escalate.', color: 'var(--eg-hi)' },
  { tier: '2', name: 'Mediation', sla: '14 days', who: 'Extension officer', desc: 'Facilitates agreement between parties. The resolution itself is a handshake — both parties must independently confirm the mediated outcome.', color: 'var(--cu-lt)' },
  { tier: '3', name: 'Arbitration', sla: '30 days', who: '3-person panel', desc: 'One panelist chosen by each party + independent chair. Binding ruling. Rulings become precedent for future cases. Remedies can include trust score adjustments.', color: 'var(--cu-hi)' },
  { tier: '4', name: 'External', sla: 'Varies', who: 'ACC / ZPS / BoZ / Courts', desc: 'Account suspension, financial freeze, evidence package generation, formal referral. Ejection requires arbitration ruling or court order — not reversible by admin.', color: 'var(--red)' },
]

export default function GovernancePage() {
  return (
    <>
      <SectionHeader id="governance" num="04" title="Trust &amp; Governance" sub="Earned reputation, democratic self-governance, and justice" />

      {/* Trust Scores */}
      <section className="sec">
        <div className="eye">Trust Scores</div>
        <h2 className="h2">Trust is earned. Season by season.</h2>
        <p className="p">Every organisation in the system has a trust score (0–100) built from real behaviour: deliveries confirmed, quality tests passed, loans repaid, disputes resolved. The score is private — counterparties see your tier, never your number.</p>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {tiers.map(t => (
            <div key={t.name} style={{ background: t.bg, border: '1px solid ' + t.border, padding: '21px', borderTop: '2px solid ' + t.border }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: t.color }}>{t.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: t.color, marginBottom: 8 }}>{t.range}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: '1.6' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <table className="btable" style={{ marginTop: 34 }}>
          <thead>
            <tr><th>Event</th><th>Effect</th><th>Note</th></tr>
          </thead>
          <tbody>
            {trustEvents.map(e => (
              <tr key={e.event}>
                <td style={{ fontFamily: 'var(--body)', color: 'var(--t2)' }}>{e.event}</td>
                <td style={{ color: e.effect.startsWith('+') ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>{e.effect}</td>
                <td style={{ fontFamily: 'var(--body)' }}>{e.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="note">
          <div className="note-title">Design Decisions</div>
          <div className="note-body">
            Weights are configurable per org type and stored versioned (multi-sig to change). Volume-weighted: reliability × log(volume) gives credit for scale without letting volume overwhelm reliability. Score never overrides truth in a dispute — evidence decides. Arbitration rulings can adjust scores as a remedy.
          </div>
        </div>
      </section>

      <Divider />

      {/* Cluster Governance */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Cluster Governance</div>
          <h2 className="h2">Democratic. Transparent. With a right to leave.</h2>
          <p className="p">Every 3A cluster governs itself. The platform provides the tools — transparent treasury, proposal-and-vote, constitutional rules — but the decisions belong to the members. One member, one vote. Always.</p>

          <div className="card-grid-3" style={{ marginTop: 34 }}>
            <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
              <div className="eye" style={{ color: 'var(--eg-vi)' }}>Treasury</div>
              <h3 className="h3">Multi-sig spending</h3>
              <p className="p">Below K2,000: leader alone. K2,000–K10,000: leader + treasurer. Above K10,000: two of three (leader, treasurer, depot witness). Every transaction visible to all members.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--cu-lt)' }}>
              <div className="eye" style={{ color: 'var(--cu-lt)' }}>Proposals &amp; Votes</div>
              <h3 className="h3">Democratic decisions</h3>
              <p className="p">Any member can propose. Voting via SMS, USSD, or PWA. Vote delegation is supported. Governance changes require supermajority + time lock with challenge window.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--cu-hi)' }}>
              <div className="eye" style={{ color: 'var(--cu-hi)' }}>Constitution</div>
              <h3 className="h3">Written rules</h3>
              <p className="p">Each cluster has a versioned constitution defining distribution rules, leadership requirements, and membership terms. Changes require governance-level vote.</p>
            </div>
          </div>

          <table className="btable" style={{ marginTop: 34 }}>
            <thead>
              <tr><th>Decision Type</th><th>Quorum</th><th>Threshold</th><th>Window</th><th>Extension / Lock</th></tr>
            </thead>
            <tbody>
              {voteTypes.map(v => (
                <tr key={v.type}>
                  <td style={{ fontFamily: 'var(--body)', color: 'var(--t2)' }}>{v.type}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{v.quorum}</td>
                  <td style={{ fontFamily: 'var(--body)' }}>{v.threshold}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{v.window}</td>
                  <td style={{ fontFamily: 'var(--body)', fontSize: 11 }}>{v.extension}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* Right to Exit */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>Right to Exit</div>
          <h2 className="h2">Unconditional. Money follows the member.</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)' }}>
            Any cluster member can exit at any time. No approval needed. Pending distributions are paid out. Treasury share is calculated. Outstanding obligations (input advances) follow the member — you can leave, but you can't leave your debts behind.
          </p>
          <div className="pull" style={{ borderColor: 'var(--cu-lt)', color: 'rgba(242,237,230,.65)' }}>
            Voluntary participation is non-negotiable. Captive cooperatives fail. <em>Exit rights create accountability pressure on leadership.</em>
          </div>
          <p className="p" style={{ color: 'rgba(242,237,230,.55)', fontSize: 14 }}>
            Distribution formula: proportional to delivery by default, changeable by governance vote. Trust score gates role eligibility (leader requires Established tier), not voting weight. Everybody's vote counts the same.
          </p>
        </div>
      </div>

      <Divider />

      {/* Conflict Resolution */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Conflict Resolution</div>
          <h2 className="h2">Four tiers. Escalate by severity.</h2>
          <p className="p">Most disputes resolve automatically or through mediation. Arbitration creates case law. External enforcement is the last resort.</p>

          <div className="layer-stack" style={{ marginTop: 34 }}>
            {conflictTiers.map(c => (
              <div key={c.tier} className="risk-item" style={{ borderColor: c.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div className="risk-title" style={{ fontSize: 16 }}>
                    <span style={{ color: c.color, marginRight: 8 }}>Tier {c.tier}</span> {c.name}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t4)' }}>SLA: {c.sla}</span>
                    <span style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t4)' }}>{c.who}</span>
                  </div>
                </div>
                <div className="risk-desc">{c.desc}</div>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 21 }}>
            <div className="note-title">Case Precedent</div>
            <div className="note-body">Tier 3 arbitration rulings are anonymised and stored as precedent. Future cases with similar facts reference prior rulings. This builds a body of "case law" specific to the agricultural value chain — something that doesn't exist today.</div>
          </div>
        </div>
      </div>

      <Divider />
      <Footer />
    </>
  )
}
