export default function MerkleSection() {
  return (
    <section className="sec">
      <div className="eye">Tamper-Evidence</div>
      <h2 className="h2">The Merkle Tree.</h2>
      <p className="p">Every attestation hashed. Pairs hashed upward to a single root. Change one byte anywhere and the root changes. Published daily. Optionally anchored on Bitcoin via OP_RETURN for court-admissible timestamping.</p>
      <div className="merkle">
        <div className="merkle-level">
          <div className="merkle-node root">ROOT: 7a3f...c912</div>
        </div>
        <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
        <div className="merkle-level">
          <div className="merkle-node branch">H(L+R): 4b2e...1a08</div>
          <div className="merkle-node branch">H(L+R): 9c7d...3f55</div>
        </div>
        <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
        <div className="merkle-level">
          <div className="merkle-node">H(delivery_001)</div>
          <div className="merkle-node">H(delivery_002)</div>
          <div className="merkle-node">H(forward_001)</div>
          <div className="merkle-node">H(payment_001)</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 13 }}>Each leaf = SHA-256 of serialised attestation. Root published daily.</div>
      </div>
    </section>
  )
}
