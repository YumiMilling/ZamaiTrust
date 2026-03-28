export default function MerkleSection() {
  return (
    <section className="sec">
      <div className="eye">Tamper-Proof Records</div>
      <h2 className="h2">A digital wax seal that cannot be faked.</h2>
      <p className="p">Imagine stacking every receipt from the day into a pyramid. Each pair is combined into a single fingerprint, then those fingerprints are combined again, all the way up to one master fingerprint at the top — the "root." If anyone changes even one character in any receipt at the bottom, the root changes completely. It's like a tower of blocks — pull one out and the whole thing visibly shifts.</p>
      <p className="p">This root is published every day. Anyone can check it. No blockchain required — just maths.</p>
      <div className="merkle">
        <div className="merkle-level">
          <div className="merkle-node root">Daily fingerprint: 7a3f...c912</div>
        </div>
        <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
        <div className="merkle-level">
          <div className="merkle-node branch">Combined: 4b2e...1a08</div>
          <div className="merkle-node branch">Combined: 9c7d...3f55</div>
        </div>
        <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
        <div className="merkle-level">
          <div className="merkle-node">Delivery #001</div>
          <div className="merkle-node">Delivery #002</div>
          <div className="merkle-node">Forward #001</div>
          <div className="merkle-node">Payment #001</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 13 }}>Each receipt at the bottom gets a unique digital fingerprint. The master fingerprint is published daily.</div>
      </div>
    </section>
  )
}
