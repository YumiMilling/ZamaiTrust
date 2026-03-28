import { InternationalCapital } from './TrustDiagrams'

const phases = [
  { num: '0', title: 'Proof of Concept', desc: 'One farmer group. One depot. One processor. One input supplier. Run the paper system and the digital system side by side for one growing season. See if the numbers match.', active: true },
  { num: '1', title: 'Pilot', desc: 'Scale to ten farmer groups across two provinces. Add a warehouse partner and an insurer. Everything stays domestic, everything settles in Kwacha. Run it for two full seasons.' },
  { num: '2', title: 'Regional Trade', desc: 'Start selling processed product across borders — into the DRC and Angola. Plug into the Lobito Corridor rail link. The grain gets milled in Zambia first.' },
  { num: '3', title: 'International Capital', desc: 'Open the system to global investors who can fund planting seasons from anywhere in the world. This step waits for the Bank of Zambia and SEC to set the rules.' },
  { num: '4', title: 'Hand Over the Keys', desc: 'The farmers, processors, and warehouses govern the system themselves. The people who built it step back. The platform belongs to its users.' },
]

export default function PhasesSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Phases</div>
        <h2 className="h2">Start small. Prove it. Then grow.</h2>
        <div style={{ marginTop: 34 }}>
          {phases.map(p => (
            <div className={`phase-row${p.active ? ' phase-active' : ''}`} key={p.num}>
              <div className="phase-num">{p.num}</div>
              <div>
                <div className="phase-title">{p.title}</div>
                <div className="phase-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 55 }}>
          <InternationalCapital />
        </div>
      </div>
    </div>
  )
}
