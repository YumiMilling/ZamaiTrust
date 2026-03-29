import { InsuranceFlow } from './TrustDiagrams'

export default function WaterfallSection() {
  return (
    <section className="sec">
      <div className="eye">Automatic Payment</div>
      <h2 className="h2">Grain arrives. Money splits. Nobody decides.</h2>
      <p className="p">But it happens in two stages — because the processor doesn't have K1.6 million in cash sitting around at harvest time. The grain in the warehouse is the collateral. A financier lends against the warehouse receipt, and the waterfall flows in stages.</p>

      <div className="layer-stack" style={{ marginTop: 34 }}>
        <div className="layer layer-truth">
          <div className="layer-label">Stage 1 — On Delivery (July)</div>
          <div className="layer-title">Farmer gets an advance</div>
          <div className="layer-desc">Delivery is dual-signed. Warehouse fee paid immediately. Farmer receives 60-70% of estimated net income via mobile money. The stored grain becomes collateral for warehouse receipt financing. A financier (not the farmer's problem) lends against the receipt.</div>
        </div>
        <div className="layer layer-local">
          <div className="layer-label">Stage 2 — On Sale (August–October)</div>
          <div className="layer-title">Everyone else gets paid as revenue comes in</div>
          <div className="layer-desc">Processor mills and sells. Revenue enters the system. Financier repaid. Input supplier repaid in full. Insurance premium covered. Platform fee taken. Farmer gets the remainder — the final settlement.</div>
        </div>
      </div>

      <div className="code-block" style={{ marginTop: 34 }}>
        <div className="code-label">Payment order — who gets paid first</div>
        <pre><span className="cc">// Stage 1: On delivery</span>{`
`}<span className="ck">1. Warehouse</span>{`      = total × 2%        `}<span className="cc">→ storage fee (immediate)</span>{`
`}<span className="ck">2. Farmer advance</span>{` = ~60-70% of net     `}<span className="cc">→ mobile money (same day)</span>{`

`}<span className="cc">// Stage 2: On sale</span>{`
`}<span className="ck">3. Financier</span>{`      = receipt loan + fee `}<span className="cc">→ warehouse receipt lender</span>{`
`}<span className="ck">4. Input supplier</span>{` = what was advanced   `}<span className="cc">→ seed & fertiliser repaid</span>{`
`}<span className="ck">5. Insurance</span>{`      = farmer's share     `}<span className="cc">→ premium covered</span>{`
`}<span className="ck">6. Platform</span>{`       = total × 1.5%      `}<span className="cc">→ keeps the system running</span>{`
`}<span className="ck">7. Farmer balance</span>{` = everything left    `}<span className="cc">→ final settlement to mobile money</span></pre>
      </div>

      <div className="note">
        <div className="note-title">What the Farmer Sees</div>
        <div className="note-body">Two messages. July: "K5,070 advance deposited. Delivery of 2,000kg grade-A white maize confirmed." September: "K3,380 final settlement deposited. Your seed loan with Seed Co is paid off. Season complete." That's it.</div>
      </div>

      <div className="note" style={{ marginTop: 3, borderColor: 'var(--eg-br)' }}>
        <div className="note-title" style={{ color: 'var(--eg-hi)' }}>The "No Bank" Promise — Honest Version</div>
        <div className="note-body">A financier <strong>is</strong> involved — but their relationship is with the grain, not the farmer. They lend against the warehouse receipt, not against a person. The farmer never walks into a bank, never fills out a form, never needs a credit score. Their experience is: "I delivered grain, I got paid."</div>
      </div>

      <div style={{ marginTop: 55 }}>
        <InsuranceFlow />
      </div>
    </section>
  )
}
