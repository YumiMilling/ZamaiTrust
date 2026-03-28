export default function IdeaSection() {
  return (
    <div className="sec-eg">
      <div className="inner">
        <div className="eye" style={{ color: 'var(--cu-hi)' }}>The Idea</div>
        <h2 className="h2">A closed-loop system where grain is the financial instrument.</h2>
        <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
          Six participants. No banks in the farmer-facing loop. The commodity collateralises itself. Every transaction is a signed, verifiable attestation.
        </p>
        <div className="flow">
          <div className="flow-node">
            <div className="flow-node-title">Input Supplier</div>
            <div className="flow-node-desc">Advances seed &amp; fertilizer</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">3A Cluster</div>
            <div className="flow-node-desc">Commits future harvest</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Warehouse</div>
            <div className="flow-node-desc">Verifies delivery</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Processor</div>
            <div className="flow-node-desc">Buys forward contracts</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Regional Buyer</div>
            <div className="flow-node-desc">Deficit markets</div>
          </div>
        </div>
        <p className="p" style={{ color: 'rgba(242,237,230,.55)', fontSize: 14, marginTop: 8 }}>
          Insurance wraps the loop. Payment flows backward on verified delivery. Value addition in Zambia before anything crosses a border.
        </p>
      </div>
    </div>
  )
}
