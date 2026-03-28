const phases = [
  { num: '0', title: 'Proof of Concept', desc: 'One cluster. One depot. One processor. One input supplier. Paper + digital in parallel. One season.', active: true },
  { num: '1', title: 'Pilot', desc: 'Ten clusters, two provinces. Warehouse integration. First insurer. All domestic. All Kwacha. Two seasons.' },
  { num: '2', title: 'Regional Trade', desc: 'Cross-border forward contracts into DRC and Angola. Processed product. Lobito Corridor integration.' },
  { num: '3', title: 'International Capital', desc: 'Tokenised forward contracts on existing chains. Global investors fund planting season.' },
  { num: '4', title: 'Platform Governance', desc: 'Participants govern the system. The architect steps back.' },
]

export default function PhasesSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Phases</div>
        <h2 className="h2">Start small. Earn scale.</h2>
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
      </div>
    </div>
  )
}
