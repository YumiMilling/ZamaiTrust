function Status({ type, label }) {
  return (
    <span className={`status status-${type}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  )
}

const rows = [
  { feature: 'Electronic warehouse receipts', phase: '1', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Partner with certified operators' },
  { feature: 'Bilateral forward contracts', phase: '1', status: 'clear', legislation: 'Common law; Securities Act exclusion', action: 'Standard commercial docs' },
  { feature: 'Input credit on future crops', phase: '1', status: 'clear', legislation: 'Agricultural Credits Act 2010', action: 'Register charges with District Ag. Coordinator' },
  { feature: 'Kwacha settlement', phase: '1', status: 'clear', legislation: 'BoZ Currency Directives 2025', action: 'None' },
  { feature: 'Digital platform operation', phase: '1', status: 'clear', legislation: 'ECT Act 2021; DPA 2021', action: 'DPA registration' },
  { feature: 'Automated payment routing', phase: '1', status: 'clear', legislation: 'National Payment Systems Act 2007', action: 'Advisory opinion from BoZ re: escrow' },
  { feature: 'Index-based crop insurance', phase: '1', status: 'gap', legislation: 'Insurance Act 2021; CATSP ZIRSAT', action: 'Partner with licensed insurer' },
  { feature: 'Merkle tamper-evidence', phase: '1', status: 'gap', legislation: 'ECT Act; Cyber Security Act 2025', action: 'Zambian data hosting; gov transparency' },
  { feature: 'Cross-border forwards', phase: '2', status: 'gap', legislation: 'Currency Directives; MoA export permits', action: 'Export permits; authorised dealer routing' },
  { feature: 'Foreign currency receipt', phase: '2', status: 'clear', legislation: 'Currency Directives Schedule 3(a)', action: 'BoZ reporting compliance' },
  { feature: 'Token sale to investors', phase: '3', status: 'blocker', legislation: 'Securities Act 2016; BoZ crypto position', action: 'SEC engagement; sandbox; await framework' },
  { feature: 'Stablecoin-Kwacha conversion', phase: '3', status: 'blocker', legislation: 'Currency Directives; Banking Act', action: 'Await BoZ crypto framework' },
  { feature: 'Foreign micro-investment', phase: '3', status: 'gap', legislation: 'Investment Act 2022; BoZ forex', action: 'SPV structure; aggregate before distribute' },
]

const statusLabels = { clear: 'Clear', gap: 'Gap', blocker: 'Blocker' }

export default function RegulatorySection() {
  return (
    <section className="sec">
      <div className="eye">Summary</div>
      <h2 className="h2">Phase 1 is legal. Phase 2 is navigable. Phase 3 needs patience.</h2>
      <p className="p" style={{ marginTop: 21 }}>
        The Agricultural Credits Act 2010 was written for this system. Electronic warehouse receipts, charges on future crops, negotiable documents of title. The Securities Act explicitly carves out commodity transactions from its scope.
      </p>
      <div style={{ display: 'flex', gap: 21, flexWrap: 'wrap', margin: '21px 0' }}>
        <Status type="clear" label="Clear — Legal Today" />
        <Status type="gap" label="Gap — Needs Framework" />
        <Status type="blocker" label="Blocker — Requires Change" />
      </div>
      <table className="summary">
        <thead>
          <tr><th>Feature</th><th>Phase</th><th>Status</th><th>Primary Legislation</th><th>Action</th></tr>
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
        <div className="note-title">The Strategic Implication</div>
        <div className="note-body">You do not need regulatory approval to start. You need it to finish. Build Phase 1 now. Prove it works. Generate the data. When BoZ publishes the crypto framework and SEC provides guidance, you will have years of verified data and a working system. That is infinitely more persuasive than a whitepaper.</div>
      </div>
    </section>
  )
}
