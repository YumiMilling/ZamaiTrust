import { InsuranceFlow } from './TrustDiagrams'

export default function WaterfallSection() {
  return (
    <section className="sec">
      <div className="eye">Automatic Payment</div>
      <h2 className="h2">Grain arrives. Everyone gets paid. No human decides who gets what.</h2>
      <p className="p">The moment a delivery is confirmed and both parties have signed, the system automatically splits the money — like water flowing downhill through a series of channels. No one has to chase payment. No one can redirect it.</p>
      <div className="code-block">
        <div className="code-label">Payment order — who gets paid first</div>
        <pre><span className="cc">// The buyer's payment enters the system</span>{`
`}<span className="ck">total</span>{` = kilograms delivered × agreed price per kg

`}<span className="ck">1. Warehouse</span>{`      = total × 2%        `}<span className="cc">→ storage fee</span>{`
`}<span className="ck">2. Input supplier</span>{` = what was advanced   `}<span className="cc">→ seed & fertiliser repaid</span>{`
`}<span className="ck">3. Insurance</span>{`      = farmer's share     `}<span className="cc">→ premium covered</span>{`
`}<span className="ck">4. Platform</span>{`       = total × 1.5%      `}<span className="cc">→ keeps the system running</span>{`
`}<span className="ck">5. Farmer</span>{`         = everything left    `}<span className="cc">→ straight to mobile money</span></pre>
      </div>
      <div className="note">
        <div className="note-title">What the Farmer Sees</div>
        <div className="note-body">One simple message: "K8,450 deposited to your mobile money. Delivery of 2,000kg grade-A white maize confirmed. Your seed loan with Seed Co is paid off." That's it. No paperwork, no delays, no guesswork.</div>
      </div>
      <div style={{ marginTop: 55 }}>
        <InsuranceFlow />
      </div>
    </section>
  )
}
