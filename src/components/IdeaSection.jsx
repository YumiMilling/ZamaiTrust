import { CoreLoop } from './TrustDiagrams'

export default function IdeaSection() {
  return (
    <div className="sec-eg">
      <div className="inner">
        <div className="eye" style={{ color: 'var(--cu-hi)' }}>The Idea</div>
        <h2 className="h2">What if the grain itself were the money?</h2>
        <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
          Imagine a circle. Seed and fertiliser flow in. Grain flows out. Money flows back. No bank sits between the farmer and their payment. The grain — committed, verified, insured — <strong>is</strong> the collateral. Six players, one loop, every step recorded.
        </p>
        <div className="flow">
          <div className="flow-node">
            <div className="flow-node-title">Input Supplier</div>
            <div className="flow-node-desc">Provides seed &amp; fertiliser</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Farmer Group</div>
            <div className="flow-node-desc">Promises future harvest</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Warehouse</div>
            <div className="flow-node-desc">Weighs &amp; checks quality</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Processor</div>
            <div className="flow-node-desc">Mills &amp; buys ahead</div>
          </div>
          <div className="flow-arrow">&rarr;</div>
          <div className="flow-node">
            <div className="flow-node-title">Regional Buyer</div>
            <div className="flow-node-desc">DRC, Angola, Malawi</div>
          </div>
        </div>
        <p className="p" style={{ color: 'rgba(242,237,230,.55)', fontSize: 14, marginTop: 8 }}>
          Insurance wraps around the whole loop like a safety net. When grain is delivered, payment flows back automatically. The grain is processed in Zambia first — the jobs and the value stay here.
        </p>
        <div style={{ marginTop: 55 }}>
          <CoreLoop />
        </div>
      </div>
    </div>
  )
}
