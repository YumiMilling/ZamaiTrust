const principles = [
  { num: '01', eye: 'Show Your Work', title: 'Every action leaves a receipt', desc: 'Like a teacher asking you to show your working — every step in the chain creates a signed, permanent record. Your reputation is built from what you actually did, not what you claim.' },
  { num: '02', eye: 'Grain is the Credit', title: 'No bank loan needed', desc: 'The grain itself backs the deal. A buyer promises to purchase. A farmer promises to deliver. The committed, insured harvest replaces a bank loan. The farmer never walks into a bank.' },
  { num: '03', eye: 'Tamper-Proof Records', title: 'Data that cannot lie', desc: 'Think of it like a wax seal on a letter. Every record is digitally sealed. Change even one number and the seal breaks visibly. No one can quietly alter the books.' },
  { num: '04', eye: 'Process Here First', title: 'Mill in Zambia, then export', desc: 'Buyers purchase mealie meal, not raw maize. The milling jobs and the profit margin stay in Zambia. Raw grain doesn\'t cross the border — finished product does.' },
  { num: '05', eye: 'Trust is Earned', title: 'Start tight, loosen over time', desc: 'The system starts with one organisation running it — like training wheels. As the data proves the model works season after season, participants gradually take the steering wheel.' },
  { num: '06', eye: 'Local Money, Global Reach', title: 'Kwacha first. The world later.', desc: 'Domestic trade in Kwacha. Cross-border trade in local currencies. International investment comes later, once the system has a track record and the regulations catch up.' },
]

export default function PrinciplesSection() {
  return (
    <section className="sec">
      <div className="eye">Design Principles</div>
      <h2 className="h2">The rules the system lives by.</h2>
      <div className="card-grid-3">
        {principles.map(p => (
          <div className="card" key={p.num}>
            <div className="card-num">{p.num}</div>
            <div className="eye">{p.eye}</div>
            <h3 className="h3">{p.title}</h3>
            <p className="p">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
