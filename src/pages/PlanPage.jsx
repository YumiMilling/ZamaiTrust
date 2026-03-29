import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import Footer from '../components/Footer'

const phases = [
  { num: '0', title: 'Proof of Concept', target: '1 season', active: true,
    scope: 'One processor, one depot, one cluster, one input supplier. No insurance. No SAFF. Manual payment (platform calculates waterfall, human executes).',
    builds: 'Forward contracts, deliveries, handshakes, quality attestations, waterfall calculation (display only), trust score engine, basic dashboards per role, SMS-based cluster governance, transparent treasury view, capability-based access.',
    proves: 'Handshake works for commercial grain. Waterfall math is correct. Cluster governance participation rates are viable. Participants understand their dashboards.' },
  { num: '1', title: 'Pilot', target: '2 seasons',
    scope: 'Ten clusters, two depots, two processors, two-three input suppliers, one insurer (ZIRSAT), one bank (ZANACO). Southern + Central provinces.',
    builds: 'Mobile money payment integration, automated waterfall settlement, SAFF loan documentation, insurance module, Merkle tree, government dashboard, USSD for feature phones, mobile money auth binding, implementing partner module, extension officer module, anomaly detection, early warning system, full conflict resolution (Tiers 1-3), notification system.',
    proves: 'Automated payments work end-to-end. Trust scores correlate with actual reliability. Government gets real-time visibility. Conflict resolution handles real disputes.' },
  { num: '2', title: 'Scale', target: 'Season 3+',
    scope: 'Cross-border trade (DRC, Angola). Full ZATTF integration. Trust-gated governance roles. Cluster alliance governance. National coverage.',
    builds: 'Multi-currency support, export documentation, cross-border handshakes, alliance-level governance, full ZATTF facility integration.',
    proves: 'System scales nationally. Cross-border value chain works. Trust scores are meaningful at scale.' },
  { num: '3', title: 'International Capital', target: 'Future',
    scope: 'Tokenised forwards. Tradeable warehouse receipts. Requires BoZ/SEC framework. Not legal today.',
    builds: 'Token infrastructure, investor onboarding, FX settlement, SEC compliance.',
    proves: 'Global capital can finance African agriculture at reasonable cost. Do not build. Do not promise. Wait for the framework.' },
]

const gaps = [
  { id: 1, severity: 'critical', title: 'Settlement architecture / escrow', desc: 'Who holds money between handshake trigger and waterfall execution?', blocked: 'Bank API conversations. Possibly BoZ regulatory guidance. Decision: bank-escrow vs platform-escrow vs processor-direct.' },
  { id: 2, severity: 'high', title: 'Contract discovery / marketplace', desc: 'Clusters can\'t find posted contracts without a notification and browse mechanism.', blocked: 'Notification infrastructure (gap #5) + marketplace UI + extension officer brokering workflow.' },
  { id: 3, severity: 'high', title: 'Waterfall async state machine', desc: 'Payment failure handling underspecified — partial settlements, retries, reconciliation.', blocked: 'Detailed state machine spec. Per-line retry logic. Daily reconciliation job.' },
  { id: 4, severity: 'high', title: 'Waterfall minimum farmer floor', desc: 'Deductions could exceed gross payment, leaving farmer with zero.', blocked: 'Design decision: minimum percentage floor, pro-rata reduction, or flag-and-halt.' },
  { id: 5, severity: 'high', title: 'Notification system', desc: 'SMS/USSD notifications referenced throughout but no infrastructure designed.', blocked: 'Table design, message templates, channel routing, delivery tracking, SMS gateway integration.' },
  { id: 6, severity: 'high', title: 'Offline / connectivity', desc: 'Rural Zambia has unreliable connectivity. All operations assume online.', blocked: 'PWA offline storage spec, sync-when-connected, conflict resolution for offline/online divergence.' },
  { id: 7, severity: 'high', title: 'Bank API integration', desc: 'SAFF documentation generation has no delivery target.', blocked: 'Conversations with ZANACO. API spec or PDF generation for manual processing in interim.' },
  { id: 8, severity: 'medium', title: 'Anomaly engine algorithms', desc: 'Anomaly triggers listed but computation logic not specified.', blocked: 'Edge Function specs for each trigger. GPS distance for ghost handshakes. QR scan log for bag recycling.' },
  { id: 9, severity: 'medium', title: 'Merkle tree publication target', desc: 'Root hash computed but no external publication mechanism.', blocked: 'Decision: IPFS / public chain / government endpoint / public feed.' },
  { id: 10, severity: 'medium', title: 'Declining quorum mechanism', desc: 'If cluster voting quorum is never reached, contracts expire.', blocked: 'Field testing needed. Options: lower quorum threshold with safeguards, or leader-acts-with-challenge-window.' },
  { id: 11, severity: 'medium', title: 'RLS performance at scale', desc: 'Capability checks on every query may be slow with 40,000+ users.', blocked: 'Load testing. JWT-based capability caching. Materialised views for dashboards.' },
  { id: 12, severity: 'high', title: 'API boundary definitions', desc: 'Data models defined but no API endpoints.', blocked: 'REST/GraphQL endpoint definitions, request/response schemas, mobile money API contracts.' },
  { id: 13, severity: 'high', title: 'USSD flow specification', desc: 'Critical for feature phone users but no flow diagrams or session design.', blocked: 'Complete USSD session spec: menu trees, state management (max 3 screens), SMS fallback.' },
]

const techStack = [
  { layer: 'Frontend', tech: 'React + Tailwind CSS', note: 'PWA for all devices. Same as CCSMP.' },
  { layer: 'Backend', tech: 'Supabase', note: 'PostgreSQL + Auth + Realtime + Edge Functions + Storage. RLS for access control.' },
  { layer: 'Hosting', tech: 'Netlify', note: 'Global CDN. Same as CCSMP.' },
  { layer: 'Payments', tech: 'Airtel Money / MTN MoMo APIs', note: 'Existing mobile money payment rails.' },
  { layer: 'SMS/USSD', tech: "Africa's Talking / Zamtel", note: 'Feature phone access for farmers.' },
  { layer: 'QR Codes', tech: 'Same library as CCSMP', note: 'Bag-level traceability.' },
  { layer: 'Hashing', tech: 'Web Crypto API (SHA-256)', note: 'Built into browsers. No library needed.' },
]

const severityColors = { critical: 'var(--red)', high: 'var(--amber)', medium: 'var(--t3)' }

export default function PlanPage() {
  return (
    <>
      <SectionHeader id="plan" num="06" title="The Plan" sub="Start small. Prove it. Name what we don't know." />

      {/* Phases */}
      <section className="sec">
        <div className="eye">Phased Deployment</div>
        <h2 className="h2">Four phases. Each one earns the next.</h2>
        <p className="p">No phase begins until the previous one has proven its claims with real data. Phase 3 waits for regulators. Do not build it. Do not promise it.</p>
        <div style={{ marginTop: 34 }}>
          {phases.map(p => (
            <div key={p.num} style={{ background: 'var(--s2)', marginBottom: 3, padding: '28px 34px', borderLeft: p.active ? '3px solid var(--eg-vi)' : '3px solid var(--s4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <div>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 800, color: p.active ? 'var(--eg-vi)' : 'var(--s4)', marginRight: 13 }}>{p.num}</span>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>{p.title}</span>
                </div>
                <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--cu-lt)' }}>{p.target}</span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: '1.75', marginBottom: 13 }}>
                <strong style={{ color: 'var(--t1)' }}>Scope:</strong> {p.scope}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: '1.75', marginBottom: 8 }}>
                <strong style={{ color: 'var(--t2)' }}>Builds:</strong> {p.builds}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: '1.75' }}>
                <strong style={{ color: 'var(--eg-hi)' }}>Proves:</strong> {p.proves}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Named Gaps */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>Named Gaps</div>
          <h2 className="h2">What we don't know yet. Honestly.</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)' }}>
            This is v0.5. Half the architecture is designed. Where something is solved, it's specified with full data models and logic. Where something is open, it's listed here with an honest description of what's needed to close it.
          </p>
          <div style={{ marginTop: 21 }}>
            {gaps.map(g => (
              <div key={g.id} className="risk-item" style={{ borderColor: severityColors[g.severity], background: 'rgba(7,50,51,.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="risk-title">
                    <span style={{ color: severityColors[g.severity], marginRight: 8 }}>#{g.id}</span> {g.title}
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: severityColors[g.severity], fontWeight: 500 }}>{g.severity}</span>
                </div>
                <div className="risk-desc" style={{ color: 'rgba(242,237,230,.6)' }}>{g.desc}</div>
                <div style={{ fontSize: 11, color: 'rgba(242,237,230,.4)', marginTop: 5, lineHeight: '1.6' }}>
                  <strong style={{ color: 'rgba(242,237,230,.5)' }}>Blocked by:</strong> {g.blocked}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* Tech Stack */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Technology</div>
          <h2 className="h2">Proven stack. Same as CCSMP.</h2>
          <table className="btable">
            <thead>
              <tr><th>Layer</th><th>Technology</th><th>Rationale</th></tr>
            </thead>
            <tbody>
              {techStack.map(t => (
                <tr key={t.layer}>
                  <td>{t.layer}</td>
                  <td style={{ color: 'var(--t1)', fontWeight: 500 }}>{t.tech}</td>
                  <td style={{ fontFamily: 'var(--body)' }}>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />
      <Footer />
    </>
  )
}
