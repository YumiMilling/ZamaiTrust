import Hero from '../components/Hero'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import { CoreLoop } from '../components/TrustDiagrams'

const subProgrammes = [
  { sp: 'SP1', name: 'Institutional Development', budget: '$1.42B', os: 'Real-time government dashboard. ZARETA sees committed/delivered/stored/surplus nationally. Audit trail for every transaction. No manual reporting.' },
  { sp: 'SP2', name: 'Financial & Risk-Sharing', budget: '$6.6M', os: 'SAFF loan documentation auto-generated. Repayment automated via waterfall. ZIRSAT integration for index-based insurance.' },
  { sp: 'SP3', name: 'Marketing, Trade & Industry', budget: '$734.6M', os: 'Forward contracts. Warehouse receipt integration. Quality attestations. Value addition enforcement. 3A cluster governance — transparent treasury, proposal-and-vote, right to exit.' },
  { sp: 'SP4', name: 'Research & Production', budget: '$1.03B', os: 'Input supplier tracking. Extension delivery data. 3A cluster formation, performance tracking, self-governance with constitutions and trust-gated leadership.' },
  { sp: 'SP5', name: 'Infrastructure', budget: '$828M', os: 'Warehouse/depot management — intake, inventory, custody fees, dispatch. Utilisation data for investment targeting.' },
  { sp: 'SP6', name: 'Emergency & Nutrition', budget: '$711M', os: 'CCSMP school meals tracking operates separately. Proven handshake and traceability patterns feed back into the OS design.' },
  { sp: 'SP7', name: 'Natural Resources', budget: '$964.7M', os: 'Future extension — not in scope for v0.5.' },
]

const zattf = [
  { sub: 'ZIRSAT', label: 'Risk-Sharing', facilities: 'Credit guarantees, interest subsidies, index-based crop insurance, insurer TA', os: 'Trust score data reduces guarantee requirements. Insurance triggers from platform data. Actuarial-quality delivery and loss data.' },
  { sub: 'ZIFSAT', label: 'Financial Services', facilities: 'SAFF, ACLTAB, ASMEL, WIFF, APEPF, FMF, YALF', os: 'Platform generates loan documentation. Forward contract = anchor commitment for ACLTAB. Waterfall automates repayment. K500K max SAFF at 12% through five banks.' },
  { sub: 'ZINFSAT', label: 'Non-Financial', facilities: '3A support, market development, digitisation, farmer training, SME support, gender/youth inclusion', os: 'Implementing partner service delivery tracking. Training coverage. Impact attribution. The platform IS the digitisation facility.' },
]

export default function VisionPage() {
  return (
    <>
      <Hero />
      <Divider />

      {/* The Problem */}
      <section className="sec">
        <div className="eye">The Problem</div>
        <h2 className="h2">None of it is connected.</h2>
        <p className="p" style={{ marginTop: 21 }}>
          CATSP is a $5.7 billion programme with seven sub-programmes, 26 investment areas, 95 policy instruments, a private-sector-led Trust Fund with three subsidiaries delivering 19 facilities through five banks, an insurance pillar, and a government coordination structure spanning from the High Council for Agricultural Transformation down to 116 District Development Coordinating Committees.
        </p>
        <p className="p">
          <strong>The bank doesn't know what the warehouse holds.</strong> The warehouse doesn't know what the processor committed to buy. The government doesn't know any of it until someone files a report months later.
        </p>
        <div className="pull">
          Zambia grows more grain than it needs. Its neighbours don't grow enough. But there's no reliable bridge between the two — <em>so the surplus rots and the deficit starves.</em>
        </div>
        <p className="p">
          This isn't a technology problem. It's a broken promise problem. And it repeats at every handshake in the chain — from the person selling seed to the farmer, from the farmer to the depot, from the depot to the processor, all the way to the buyer across the border.
        </p>
      </section>

      <Divider />

      {/* The Answer */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>The Answer</div>
          <h2 className="h2">One system. Every participant. Every transaction.</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
            Every CATSP transaction — input advance, forward contract, grain delivery, quality test, loan disbursement, insurance event, payment settlement — passes through a single system where each participant sees exactly what they need, every record is tamper-evident, and the government gets real-time national visibility without seeing anyone's private data.
          </p>
          <div className="flow">
            <div className="flow-node">
              <div className="flow-node-title">Input Supplier</div>
              <div className="flow-node-desc">Provides seed &amp; fertiliser</div>
            </div>
            <div className="flow-arrow">&rarr;</div>
            <div className="flow-node">
              <div className="flow-node-title">3A Cluster</div>
              <div className="flow-node-desc">Promises future harvest</div>
            </div>
            <div className="flow-arrow">&rarr;</div>
            <div className="flow-node">
              <div className="flow-node-title">Warehouse</div>
              <div className="flow-node-desc">Weighs &amp; grades</div>
            </div>
          </div>
          <p className="p" style={{ color: 'rgba(242,237,230,.7)', fontSize: 14, marginTop: 21, marginBottom: 8 }}>
            <strong style={{ color: 'var(--t1)' }}>After the warehouse, grain can go four ways:</strong>
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
            Six primitives. One data model. Capability-based access. Insurance wraps the whole loop. The private sector handles commercial trade. FRA secures the reserve. When grain is delivered, payment flows back automatically through the waterfall.
          </p>
          <div style={{ marginTop: 55 }}>
            <CoreLoop />
          </div>
        </div>
      </div>

      <Divider />

      {/* CATSP Sub-Programme Mapping */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Programme Integration</div>
          <h2 className="h2">How every sub-programme plugs in.</h2>
          <p className="p">The OS doesn't replace CATSP's seven sub-programmes. It connects them — so that what happens in one is visible to the others that need to know.</p>
          <table className="btable">
            <thead>
              <tr><th>Sub-Programme</th><th>Budget</th><th>What the OS Provides</th></tr>
            </thead>
            <tbody>
              {subProgrammes.map(s => (
                <tr key={s.sp}>
                  <td>{s.sp}<br /><span style={{ color: 'var(--t3)', fontFamily: 'var(--body)', fontSize: 11 }}>{s.name}</span></td>
                  <td style={{ fontFamily: 'var(--mono)', color: 'var(--cu-lt)', whiteSpace: 'nowrap' }}>{s.budget}</td>
                  <td style={{ fontFamily: 'var(--body)' }}>{s.os}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* ZATTF Integration */}
      <section className="sec">
        <div className="eye">Trust Fund Integration</div>
        <h2 className="h2">ZATTF's three subsidiaries. One platform.</h2>
        <p className="p">The Zambia Agricultural Transformation Trust Fund delivers 19 facilities through three subsidiaries. The OS is the connective tissue between all of them.</p>
        {zattf.map(z => (
          <div className="note" key={z.sub} style={{ borderColor: 'var(--eg-br)' }}>
            <div className="note-title" style={{ color: 'var(--eg-hi)' }}>{z.sub} &mdash; {z.label}</div>
            <div className="note-body" style={{ marginBottom: 8 }}>
              <strong style={{ color: 'var(--t2)' }}>Facilities:</strong> {z.facilities}
            </div>
            <div className="note-body">
              <strong style={{ color: 'var(--t2)' }}>OS integration:</strong> {z.os}
            </div>
          </div>
        ))}
      </section>

      <Divider />
      <Footer />
    </>
  )
}
