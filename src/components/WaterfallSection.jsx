import { InsuranceFlow } from './TrustDiagrams'

export default function WaterfallSection() {
  return (
    <section className="sec">
      <div className="eye">Payment Waterfall</div>
      <h2 className="h2">What happens when grain arrives.</h2>
      <p className="p">Triggered automatically on dual-signed delivery-verified attestation linked to a forward contract.</p>
      <div className="code-block">
        <div className="code-label">Waterfall — Priority Order</div>
        <pre><span className="cc">// Processor pays forward contract price into system</span>{`
`}<span className="ck">total</span>{` = delivery.quantity_kg × forward.price_per_kg

`}<span className="ck">1. warehouse_fee</span>{` = total × 2%        `}<span className="cc">→ pay(warehouse)</span>{`
`}<span className="ck">2. input_repay</span>{`   = sum(input_advances) `}<span className="cc">→ pay(input_supplier)</span>{`
`}<span className="ck">3. insurance</span>{`     = farmer_share        `}<span className="cc">→ pay(insurer)</span>{`
`}<span className="ck">4. platform_fee</span>{` = total × 1.5%       `}<span className="cc">→ pay(platform)</span>{`
`}<span className="ck">5. farmer_net</span>{`   = remainder           `}<span className="cc">→ pay(farmer, via mobile_money)</span></pre>
      </div>
      <div className="note">
        <div className="note-title">The Farmer Sees One Number</div>
        <div className="note-body">"K8,450 deposited to your mobile money. Delivery of 2,000kg grade-A white maize confirmed. Input balance with Seed Co: cleared."</div>
      </div>
      <div style={{ marginTop: 55 }}>
        <InsuranceFlow />
      </div>
    </section>
  )
}
