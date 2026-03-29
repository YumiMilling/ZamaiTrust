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
            <div className="flow-node-desc">Weighs &amp; grades</div>
          </div>
        </div>
        <p className="p" style={{ color: 'rgba(242,237,230,.7)', fontSize: 14, marginTop: 21, marginBottom: 8 }}>
          <strong style={{ color: 'var(--t1)' }}>After the warehouse, the grain can go four ways:</strong>
        </p>
        <div className="card-grid" style={{ marginTop: 0 }}>
          <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
            <div className="eye" style={{ color: 'var(--eg-hi)' }}>Domestic</div>
            <h3 className="h3">Sold locally</h3>
            <p className="p">Raw grain to local traders or millers at Lusaka spot price. Settles in Kwacha. No export permit needed.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--cu)' }}>
            <div className="eye" style={{ color: 'var(--cu-hi)' }}>Processed &amp; exported</div>
            <h3 className="h3">Milled in Zambia, sold across borders</h3>
            <p className="p">Mealie meal to DRC, Angola, Malawi. Value added here. Highest margin. Needs export permit.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--eg-br)' }}>
            <div className="eye" style={{ color: 'var(--eg-hi)' }}>Processed domestic</div>
            <h3 className="h3">Milled and sold in Zambia</h3>
            <p className="p">Processor mills for Zambian market. Spot + processing margin. Jobs stay local.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--t4)' }}>
            <div className="eye" style={{ color: 'var(--t3)' }}>FRA Reserve</div>
            <h3 className="h3">Strategic grain reserve</h3>
            <p className="p">Government buys limited volume at gazetted price. Backstop, not market participant. Under CATSP, FRA returns to its core food-security mission.</p>
          </div>
        </div>
        <p className="p" style={{ color: 'rgba(242,237,230,.55)', fontSize: 14, marginTop: 21 }}>
          Insurance wraps around the whole loop like a safety net. The grain is processed in Zambia first — the jobs and the value stay here. The private sector handles commercial trade. FRA secures the reserve.
        </p>
        <div style={{ marginTop: 55 }}>
          <CoreLoop />
        </div>
      </div>
    </div>
  )
}
