function Status({ type, label }) {
  return (
    <span className={`status status-${type}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  )
}

const rows = [
  { feature: 'Digital warehouse receipts', phase: '1', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Partner with certified operators' },
  { feature: 'Buyer-seller forward contracts', phase: '1', status: 'clear', legislation: 'Common law; Securities Act exclusion', action: 'Standard commercial docs' },
  { feature: 'Input credit against future harvest', phase: '1', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Register charges with District Ag. Coordinator' },
  { feature: 'Settlement in Kwacha', phase: '1', status: 'clear', legislation: 'BoZ Currency Directives 2025', action: 'None' },
  { feature: 'Running a digital platform', phase: '1', status: 'clear', legislation: 'ECT Act 2021; DPA 2021', action: 'Data protection registration' },
  { feature: 'Automatic payment routing', phase: '1', status: 'clear', legislation: 'National Payment Systems Act 2007', action: 'Advisory from Bank of Zambia on escrow' },
  { feature: 'Crop insurance for small farmers', phase: '1', status: 'gap', legislation: 'Insurance Act 2021; CATSP ZIRSAT', action: 'Partner with licensed insurer' },
  { feature: 'Tamper-proof digital records', phase: '1', status: 'gap', legislation: 'ECT Act; Cyber Security Act 2025', action: 'Host data in Zambia; government transparency' },
  { feature: 'Cross-border sales contracts', phase: '2', status: 'gap', legislation: 'Currency Directives; MoA export permits', action: 'Obtain export permits; use authorised banks' },
  { feature: 'Receiving foreign currency', phase: '2', status: 'clear', legislation: 'Currency Directives Schedule 3(a)', action: 'Bank of Zambia reporting' },
  { feature: 'Selling tokens to investors', phase: '3', status: 'blocker', legislation: 'Securities Act 2016; BoZ crypto position', action: 'Engage SEC; apply for regulatory sandbox' },
  { feature: 'Converting crypto to Kwacha', phase: '3', status: 'blocker', legislation: 'Currency Directives; Banking Act', action: 'Wait for BoZ crypto framework' },
  { feature: 'Small foreign investments', phase: '3', status: 'gap', legislation: 'Investment Act 2022; BoZ forex', action: 'Pool investments through a holding company' },
]

const statusLabels = { clear: 'Clear', gap: 'Gap', blocker: 'Blocker' }

export default function RegulatorySection() {
  return (
    <section className="sec">
      <div className="eye">Legal Reality Check</div>
      <h2 className="h2">You can start today. You don't need permission for Phase 1.</h2>
      <p className="p" style={{ marginTop: 21 }}>
        Here's the good news: Zambian law already supports most of what this system does in its early phases. The Agricultural Credits Act was practically written for this — digital warehouse receipts, charges on future crops, all explicitly covered. The tricky parts (crypto, international tokens) come later, and by then the system will have years of real data to show regulators.
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
      <div className="note">
        <div className="note-title">The Strategy</div>
        <div className="note-body">You don't need anyone's permission to start. You need it to finish. Build Phase 1 now. Prove it works. Collect the data. When the Bank of Zambia and SEC are ready with their frameworks, you won't be waving a whitepaper — you'll have years of real transactions and a working system. That's a very different conversation.</div>
      </div>
    </section>
  )
}
