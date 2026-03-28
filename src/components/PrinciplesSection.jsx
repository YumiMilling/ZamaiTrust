const principles = [
  { num: '01', eye: 'Proof of Benefit', title: 'Verified value, not speculation', desc: 'Every action generates a signed attestation of real benefit. Reputation is built from demonstrated contribution.' },
  { num: '02', eye: 'Grain as Collateral', title: 'The commodity is the credit', desc: 'Forward contracts backed by committed, insured grain replace bank loans. The farmer never sees a bank.' },
  { num: '03', eye: 'Tamper-Evidence', title: 'Data that cannot lie', desc: 'Every record hashed into a Merkle tree. Change one byte and the root changes. No blockchain needed.' },
  { num: '04', eye: 'Value Addition', title: 'Process in Zambia', desc: 'Forward contracts are for processed goods. Jobs and margin stay in Zambia. Export policy aligned.' },
  { num: '05', eye: 'Progressive Trust', title: 'Earn decentralisation', desc: 'Start centralised. Distribute governance as the data proves the model works over seasons.' },
  { num: '06', eye: 'Sovereignty', title: 'Local rails. Global reach.', desc: 'Domestic in Kwacha. Cross-border in local currencies. International capital via tokenised contracts later.' },
]

export default function PrinciplesSection() {
  return (
    <section className="sec">
      <div className="eye">Design Principles</div>
      <h2 className="h2">What the system believes.</h2>
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
