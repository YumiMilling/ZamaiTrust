export default function ArchitectureSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Architecture</div>
        <h2 className="h2">Three layers. Clean separation.</h2>
        <div className="layer-stack">
          <div className="layer layer-truth">
            <div className="layer-label">Layer 0 — The Truth</div>
            <div className="layer-title">Shared Verification Ledger</div>
            <div className="layer-desc">All verified commitments, deliveries, quality attestations, and payment settlements. Anchored with Merkle roots. Not a blockchain — a replicated database with cryptographic integrity proofs.</div>
          </div>
          <div className="layer layer-local">
            <div className="layer-label">Layer 1 — Local Rules</div>
            <div className="layer-title">Jurisdiction-Specific Settlement</div>
            <div className="layer-desc">Zambia in Kwacha. DRC in francs. Angola in kwanza. Each jurisdiction applies its own export rules and regulations. The truth layer underneath does not change.</div>
          </div>
          <div className="layer layer-edge">
            <div className="layer-label">Layer 2 — The Edge</div>
            <div className="layer-title">Agents on Devices</div>
            <div className="layer-desc">Purpose-built agents for each participant. Farmer via SMS/USSD. Depot operator on Android. Processor on web dashboard. Each speaks the protocol. Each built for its user.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
