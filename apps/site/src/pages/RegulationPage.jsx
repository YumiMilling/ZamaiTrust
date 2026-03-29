import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import Footer from '../components/Footer'

function Status({ type, label }) {
  return (
    <span className={`status status-${type}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  )
}

const rows = [
  { feature: 'Digital warehouse receipts', phase: '0', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Partner with certified operators' },
  { feature: 'Buyer-seller forward contracts', phase: '0', status: 'clear', legislation: 'Common law; Securities Act exclusion', action: 'Standard commercial docs' },
  { feature: 'Input credit against future harvest', phase: '0', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Register charges with District Ag. Coordinator' },
  { feature: 'Settlement in Kwacha', phase: '0', status: 'clear', legislation: 'BoZ Currency Directives 2025', action: 'None' },
  { feature: 'Running a digital platform', phase: '0', status: 'clear', legislation: 'ECT Act 2021; DPA 2021', action: 'Data protection registration' },
  { feature: 'Capability-based access control', phase: '0', status: 'clear', legislation: 'DPA 2021 (data minimisation)', action: 'RLS enforcement; audit logging' },
  { feature: 'Handshake-based verification', phase: '0', status: 'clear', legislation: 'ECT Act (electronic signatures)', action: 'Mobile money KYC as identity verification' },
  { feature: 'Automatic payment routing', phase: '1', status: 'clear', legislation: 'National Payment Systems Act 2007', action: 'Advisory from Bank of Zambia on escrow model' },
  { feature: 'SAFF loan documentation', phase: '1', status: 'clear', legislation: 'Banking and Financial Services Act', action: 'Bank API integration (ZANACO first)' },
  { feature: 'Crop insurance for small farmers', phase: '1', status: 'gap', legislation: 'Insurance Act 2021; CATSP ZIRSAT', action: 'Partner with licensed insurer via ZIRSAT' },
  { feature: 'Tamper-proof digital records', phase: '1', status: 'gap', legislation: 'ECT Act; Cyber Security Act 2025', action: 'Host data in Zambia; Merkle tree for integrity' },
  { feature: 'Anomaly detection & enforcement', phase: '1', status: 'clear', legislation: 'Anti-Corruption Act; Penal Code', action: 'Evidence package generation for referral' },
  { feature: 'Trust score system', phase: '1', status: 'clear', legislation: 'No specific regulation', action: 'Transparent methodology; tier-only external visibility' },
  { feature: 'Cross-border sales contracts', phase: '2', status: 'gap', legislation: 'Currency Directives; MoA export permits', action: 'Obtain export permits; use authorised banks' },
  { feature: 'Receiving foreign currency', phase: '2', status: 'clear', legislation: 'Currency Directives Schedule 3(a)', action: 'Bank of Zambia reporting' },
  { feature: 'Selling tokens to investors', phase: '3', status: 'blocker', legislation: 'Securities Act 2016; BoZ crypto position', action: 'Engage SEC; apply for regulatory sandbox' },
  { feature: 'Converting crypto to Kwacha', phase: '3', status: 'blocker', legislation: 'Currency Directives; Banking Act', action: 'Wait for BoZ crypto framework' },
  { feature: 'Small foreign investments', phase: '3', status: 'gap', legislation: 'Investment Act 2022; BoZ forex', action: 'Pool investments through a holding company' },
]

const statusLabels = { clear: 'Clear', gap: 'Gap', blocker: 'Blocker' }

export default function RegulationPage() {
  return (
    <>
      <SectionHeader id="regulation" num="07" title="Is It Legal?" sub="Every feature checked against Zambian law" />

      <section className="sec">
        <div className="eye">Legal Reality Check</div>
        <h2 className="h2">Phase 0 is legal today. No permission needed.</h2>
        <p className="p" style={{ marginTop: 21 }}>
          Zambian law already supports everything the system does in Phase 0 and most of Phase 1. The Agricultural Credits Act was practically written for this — digital warehouse receipts, charges on future crops, all explicitly covered. The tricky parts (crypto, international tokens) come in Phase 3, and by then the system will have years of real data to show regulators.
        </p>
        <div style={{ display: 'flex', gap: 21, flexWrap: 'wrap', margin: '21px 0' }}>
          <Status type="clear" label="Clear — Legal today" />
          <Status type="gap" label="Gap — Needs a framework" />
          <Status type="blocker" label="Blocker — Law must change first" />
        </div>
        <table className="summary">
          <thead>
            <tr><th>What the System Does</th><th>Phase</th><th>Status</th><th>Which Law</th><th>What We Need to Do</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.feature}>
                <td>{r.feature}</td>
                <td>{r.phase}</td>
                <td><Status type={r.status} label={statusLabels[r.status]} /></td>
                <td>{r.legislation}</td>
                <td>{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="note" style={{ marginTop: 34 }}>
          <div className="note-title">The Strategy</div>
          <div className="note-body">You don't need anyone's permission to start. You need it to finish. Build Phase 0 now. Prove it works with real transactions. Collect the data. When the Bank of Zambia and SEC are ready with their frameworks, you won't be waving a whitepaper — you'll have seasons of real transactions and a working system. That's a very different conversation.</div>
        </div>
      </section>

      <Divider />

      {/* Closing */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>v0.5</div>
          <h2 className="h2" style={{ maxWidth: 700 }}>Half the architecture is designed. The foundations are specified. The gaps are named.</h2>
          <div className="pull" style={{ borderColor: 'var(--cu-lt)', color: 'rgba(242,237,230,.75)', marginTop: 34 }}>
            Where something is solved, it's specified with full data models and logic. Where something is open, it's marked and honestly described. The system has nothing to hide — <em>including from itself.</em>
          </div>
          <p className="p" style={{ color: 'rgba(242,237,230,.5)', marginTop: 34 }}>
            <strong style={{ color: 'rgba(242,237,230,.7)' }}>hello@zamai.pro</strong>
          </p>
        </div>
      </div>

      <Divider />
      <Footer />
    </>
  )
}
