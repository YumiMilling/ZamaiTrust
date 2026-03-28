import { ThreeLayerArchitecture } from './TrustDiagrams'

export default function ArchitectureSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Architecture</div>
        <h2 className="h2">Three layers. Like a building.</h2>
        <p className="p" style={{ marginBottom: 34 }}>Think of it like a three-storey building. The foundation holds the truth. The middle floor handles local rules. The top floor is where people actually work.</p>
        <div className="layer-stack">
          <div className="layer layer-truth">
            <div className="layer-label">Foundation — The Single Source of Truth</div>
            <div className="layer-title">The shared record book</div>
            <div className="layer-desc">Every delivery, every quality check, every payment — all recorded in one place that everyone can verify but nobody can secretly change. Think of it as a public notary for every grain transaction in the country.</div>
          </div>
          <div className="layer layer-local">
            <div className="layer-label">Middle Floor — Local Rules</div>
            <div className="layer-title">Each country plays by its own rules</div>
            <div className="layer-desc">Zambia settles in Kwacha. DRC in francs. Angola in kwanza. Each country applies its own export rules and trade regulations. But the truth underneath — who delivered what, and when — stays the same everywhere.</div>
          </div>
          <div className="layer layer-edge">
            <div className="layer-label">Top Floor — The Tools People Use</div>
            <div className="layer-title">Built for each person, not one-size-fits-all</div>
            <div className="layer-desc">The farmer uses a simple phone menu (USSD/SMS) — no smartphone needed. The depot operator has an Android app. The processor sees a web dashboard. Everyone uses the same system, but the tool fits the person.</div>
          </div>
        </div>
        <div style={{ marginTop: 55 }}>
          <ThreeLayerArchitecture />
        </div>
      </div>
    </div>
  )
}
