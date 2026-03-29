import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import Footer from '../components/Footer'
import { DualSignature, ForwardLifecycle, CoreLoop, InsuranceFlow } from '../components/TrustDiagrams'

const primitives = [
  { num: '01', name: 'Handshake', short: 'Two parties verify the same event. If they agree, confirmed. If not, both claims preserved.', color: 'var(--eg-hi)' },
  { num: '02', name: 'Attestation', short: 'A claim about something real, backed by evidence and optional corroboration.', color: 'var(--cu-lt)' },
  { num: '03', name: 'Function', short: 'An atomic unit of capability. What you can do — not who you are.', color: 'var(--eg-vi)' },
  { num: '04', name: 'Organisation', short: 'An entity in the system — from a 20-farmer cluster to a national ministry.', color: 'var(--cu-hi)' },
  { num: '05', name: 'Forward Contract', short: 'A commitment to exchange goods at a set price, quantity, grade, and time.', color: 'var(--eg-br)' },
  { num: '06', name: 'Payment Waterfall', short: 'Deterministic settlement. Grain arrives, money splits. Nobody decides.', color: 'var(--cu-mid)' },
]

const attestationExamples = [
  { type: 'Quality test', attester: 'Lab technician', corroboration: 'Depot operator countersigns. Test data attached.', example: 'Batch B-2026-042: aflatoxin 4ppb (pass), moisture 12.8% (pass)' },
  { type: 'Training delivery', attester: 'Extension officer', corroboration: 'Cluster leader countersigns attendance. GPS + timestamp.', example: 'Quality management training, 18 attendees, Batoka depot, 14 Mar' },
  { type: 'Monitoring visit', attester: 'Extension officer', corroboration: 'GPS + timestamp. Photo hash.', example: 'Cluster CL-044 visited. Crop status: good. Storage: adequate.' },
  { type: 'Insurance trigger', attester: 'Weather data feed', corroboration: 'Automated — index threshold crossed.', example: 'Rainfall deficit: 340mm vs 400mm threshold. Trigger met.' },
  { type: 'Service delivery', attester: 'Implementing partner', corroboration: 'Cluster leader countersigns.', example: 'Financial literacy training delivered to 3 clusters, Choma district' },
]

const capabilities = [
  { module: 'contracts', examples: 'contracts.view, contracts.create, contracts.accept', scopes: 'own → assigned → district → province → national' },
  { module: 'deliveries', examples: 'deliveries.handshake, deliveries.view', scopes: 'own → assigned → district → province → national' },
  { module: 'financial', examples: 'financial.view, financial.trigger', scopes: 'own (detail) → district+ (aggregate only)' },
  { module: 'quality', examples: 'quality.write, quality.view', scopes: 'own → assigned → district → national' },
  { module: 'governance', examples: 'governance.propose, governance.vote, governance.view', scopes: 'own' },
  { module: 'trust', examples: 'trust.view', scopes: 'own (number) → assigned (tier only) → district+ (distribution)' },
  { module: 'cases', examples: 'cases.file, cases.mediate, cases.arbitrate', scopes: 'own → assigned → district → national' },
  { module: 'enforcement', examples: 'enforcement.suspend, enforcement.eject', scopes: 'custom (requires 2 admins or arbitration ruling)' },
]

const dbDomains = [
  { domain: 'Identity & Access', color: 'var(--eg-vi)', desc: 'Who is in the system, what organisations they belong to, what they can do, and how they authenticate.',
    tables: ['users', 'organisations', 'user_affiliations', 'capabilities', 'user_capabilities', 'user_capability_scopes', 'presets', 'user_auth_profiles', 'user_devices'] },
  { domain: 'Value Chain', color: 'var(--cu)', desc: 'The commercial engine: seasons, commodities, grading standards, forward contracts, deliveries, handshakes, input advances.',
    tables: ['seasons', 'commodities', 'grading_standards', 'forward_contracts', 'deliveries', 'handshakes', 'contract_deliveries', 'input_advances'] },
  { domain: 'Financial', color: 'var(--eg-br)', desc: 'Money flowing through the waterfall: payments, payment lines, SAFF loans, insurance policies, claims.',
    tables: ['waterfall_config', 'payments', 'payment_lines', 'saff_loans', 'saff_loan_documents', 'insurance_policies', 'insurance_claims'] },
  { domain: 'Governance', color: 'var(--cu-mid)', desc: 'Cluster self-governance: treasury, proposals, votes, constitutions, distribution rules, memberships, exit settlements.',
    tables: ['cluster_treasury', 'treasury_transactions', 'proposals', 'votes', 'vote_delegations', 'cluster_constitutions', 'cluster_memberships', 'cluster_distribution_rules', 'member_distributions', 'exit_settlements'] },
  { domain: 'Trust & Conflict', color: 'var(--eg)', desc: 'Behavioural reputation and dispute resolution: trust scores, trust events, cases, arbitrator pool, case precedents.',
    tables: ['trust_score_config', 'trust_scores', 'trust_events', 'cases', 'arbitrator_pool', 'case_precedents', 'evidence_packages'] },
  { domain: 'Integrity & Extension', color: 'var(--t3)', desc: 'Attestations (quality tests, training, monitoring), audit log, anomaly detection, Merkle tree, early warnings, partner tracking.',
    tables: ['attestations', 'audit_log', 'anomaly_flags', 'merkle_roots', 'merkle_leaves', 'whistleblower_reports', 'partner_contracts', 'extension_assignments', 'early_warnings', 'issue_flags'] },
]

const presets = [
  { name: 'farmer_cluster', caps: 'View/accept contracts, handshake deliveries, vote on proposals, view own financials', money: 'Own only' },
  { name: 'cluster_leader', caps: 'Everything a farmer can do + propose governance changes', money: 'Own only' },
  { name: 'processor', caps: 'Create/view contracts, handshake deliveries, trigger waterfall payments', money: 'Own only' },
  { name: 'depot_operator', caps: 'Handshake deliveries, record quality tests (attestation)', money: 'No' },
  { name: 'input_supplier', caps: 'Record input advances, handshake deliveries, view linked contracts', money: 'Own only' },
  { name: 'extension_officer', caps: 'Record training/monitoring (attestation), view assigned clusters, mediate disputes', money: 'No' },
  { name: 'district_coordinator', caps: 'View all clusters in district, extension activity, aggregate financials, anomaly flags', money: 'Aggregate only' },
  { name: 'provincial_coordinator', caps: 'Province-wide aggregates, district comparison, partner coverage', money: 'Aggregate only' },
  { name: 'zareta', caps: 'National view of everything: aggregates, partner performance, KPIs, audit trail, anomalies', money: 'Aggregate only' },
  { name: 'implementing_partner', caps: 'Record service delivery (attestation), view assigned clusters, raise issues', money: 'No' },
  { name: 'insurer', caps: 'Underwrite contracts, set premiums, process claims, view actuarial data', money: 'Actuarial only' },
  { name: 'zattf_staff', caps: 'View facility-specific portfolio, national metrics, partner performance', money: 'Facility aggregate' },
]

export default function SystemPage() {
  return (
    <>
      <SectionHeader id="system" num="02" title="The System" sub="Six primitives. If a feature can't be built from these, the feature is wrong." />

      {/* Overview — Six Primitives */}
      <section className="sec">
        <div className="eye">The Building Blocks</div>
        <h2 className="h2">Everything is built from six atomic primitives.</h2>
        <p className="p">If a new feature cannot be expressed as a composition of these six, either the feature is wrong or a primitive is missing. No exceptions.</p>
        <div className="card-grid-3">
          {primitives.map(p => (
            <div className="card" key={p.num} style={{ borderColor: p.color }}>
              <div className="card-num">{p.num}</div>
              <div className="eye" style={{ color: p.color }}>{p.name}</div>
              <p className="p">{p.short}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Primitive 1: Handshake */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>Primitive 1</div>
          <h2 className="h2">The Handshake</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
            Two parties independently verify the same event. If they agree, the record is confirmed. If they disagree, both claims are preserved and the transaction blocks. That's it.
          </p>
          <div className="code-block" style={{ background: 'var(--eg)', borderColor: 'var(--eg-br)' }}>
            <pre style={{ color: 'var(--t2)' }}>{`PARTY A                          PARTY B
   |                                |
   |--- "I delivered X" ---------->|
   |                                |
   |<--- "I received Y" ----------|
   |                                |
   IF X == Y → CONFIRMED
   IF X != Y → DISPUTED (both claims preserved, blocked)`}</pre>
          </div>
          <div className="note" style={{ background: 'rgba(7,50,51,.5)', borderColor: 'var(--cu)' }}>
            <div className="note-title">Sacred Rule</div>
            <div className="note-body" style={{ color: 'rgba(242,237,230,.7)' }}>Do not add steps to the handshake. Do not add approvers. Do not add workflows. The handshake is the atomic unit of trust. It is proven in CCSMP. It works because it is simple.</div>
          </div>
          <div style={{ marginTop: 55 }}>
            <DualSignature />
          </div>
        </div>
      </div>

      <Divider />

      {/* Primitive 2: Attestation */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Primitive 2</div>
          <h2 className="h2">The Attestation</h2>
          <p className="p">A claim by one party about a real-world event, optionally backed by evidence or a witness. Weaker than a handshake (single-party vs bilateral) but stronger than a bare database write — it has structure, evidence, and optional corroboration.</p>
          <p className="p"><strong>Everything goes through attestations.</strong> Training sessions, monitoring visits, quality tests, advisory records, partner service delivery — all stored as attestations. One structure, one Merkle tree, one audit trail.</p>
          <table className="btable">
            <thead>
              <tr><th>Type</th><th>Attester</th><th>Corroboration</th><th>Example</th></tr>
            </thead>
            <tbody>
              {attestationExamples.map(a => (
                <tr key={a.type}>
                  <td>{a.type}</td>
                  <td style={{ fontFamily: 'var(--body)' }}>{a.attester}</td>
                  <td style={{ fontFamily: 'var(--body)' }}>{a.corroboration}</td>
                  <td style={{ fontFamily: 'var(--body)', fontSize: 11 }}>{a.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* Primitive 3: Function */}
      <section className="sec">
        <div className="eye">Primitive 3</div>
        <h2 className="h2">The Function</h2>
        <p className="p">An atomic unit of capability. Not a role — a capability. <strong>What you can do, not who you are.</strong> Functions compose: any combination can be assigned to any user. The system extends by adding new functions, never by modifying existing ones.</p>
        <p className="p">Every function has three dimensions:</p>
        <div className="card-grid-3" style={{ marginBottom: 34 }}>
          <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
            <div className="eye" style={{ color: 'var(--eg-vi)' }}>Capability</div>
            <h3 className="h3">What it does</h3>
            <p className="p">contracts.view, training.write, enforcement.suspend</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--cu-lt)' }}>
            <div className="eye" style={{ color: 'var(--cu-lt)' }}>Scope Level</div>
            <h3 className="h3">How far it reaches</h3>
            <p className="p">own → assigned → district → province → national</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--eg-br)' }}>
            <div className="eye" style={{ color: 'var(--eg-br)' }}>Scope Values</div>
            <h3 className="h3">Specific targets</h3>
            <p className="p">Which districts, which clusters, which depots, which facilities</p>
          </div>
        </div>
        <p className="p"><strong>~30 capabilities across 14 modules.</strong> Adding a new participant type is always: define capabilities → create preset (optional) → create account → assign capabilities + scope. Zero code changes. Zero migrations.</p>
        <table className="btable">
          <thead>
            <tr><th>Module</th><th>Capabilities</th><th>Scope Range</th></tr>
          </thead>
          <tbody>
            {capabilities.map(c => (
              <tr key={c.module}>
                <td>{c.module}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{c.examples}</td>
                <td style={{ fontFamily: 'var(--body)', fontSize: 12 }}>{c.scopes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Divider />

      {/* Primitive 4: Organisation */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Primitive 4</div>
          <h2 className="h2">The Organisation</h2>
          <p className="p">Every entity in the system — legal or cooperative — that holds identity, geographic scope, and hierarchical relationships. A 3A cluster of 20 farmers. A depot in Choma. A processor in Kafue. ZARETA itself. All are organisations.</p>
          <div className="layer-stack">
            <div className="layer layer-truth">
              <div className="layer-label">National</div>
              <div className="layer-title">ZARETA, ZATTF, Ministries</div>
              <div className="layer-desc">National visibility across all provinces and districts</div>
            </div>
            <div className="layer layer-local">
              <div className="layer-label">Province → District → Camp</div>
              <div className="layer-title">Coordinators, Extension Officers</div>
              <div className="layer-desc">Each level sees its scope. Provincial sees the province. District sees the district.</div>
            </div>
            <div className="layer layer-edge">
              <div className="layer-label">Organisation</div>
              <div className="layer-title">Clusters, Depots, Processors, Suppliers, Insurers, Partners</div>
              <div className="layer-desc">Each sees its own data. Users have affiliations — one person can belong to multiple organisations with different roles.</div>
            </div>
          </div>
          <div className="note">
            <div className="note-title">Why Affiliations Matter</div>
            <div className="note-body">A farmer who is a cluster member AND an individual trader. A cluster leader who sits on the district cooperative alliance. An extension officer who gets reassigned. One user, multiple organisations, different roles in each.</div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Primitive 5: Forward Contract */}
      <section className="sec">
        <div className="eye">Primitive 5</div>
        <h2 className="h2">The Forward Contract</h2>
        <p className="p">A commitment between two organisations to exchange goods at a specified price, quantity, grade, and time window. <strong>The contract is the engine of the value chain</strong> — it creates the commitment that inputs are advanced against, loans are issued against, insurance is written against, and payments flow through.</p>
        <div className="card-grid" style={{ marginTop: 34 }}>
          <div className="card">
            <div className="eye">Processor Posts</div>
            <h3 className="h3">The offer</h3>
            <p className="p">"I want to buy 200 tonnes of grade-A white maize at K6,400/tonne, delivered between July 1 and August 15." Posted to eligible clusters within the discovery scope — district, province, or national.</p>
          </div>
          <div className="card">
            <div className="eye">Cluster Accepts</div>
            <h3 className="h3">By democratic vote</h3>
            <p className="p">60% quorum, simple majority, 72-hour voting window. Extension can add 48 hours if quorum not reached. The contract locks in — inputs flow, insurance binds, the season begins.</p>
          </div>
        </div>
        <div className="dark" style={{ marginTop: 55, padding: 34, borderRadius: 2 }}>
          <ForwardLifecycle />
        </div>
      </section>

      <Divider />

      {/* Primitive 6: Payment Waterfall */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>Primitive 6</div>
          <h2 className="h2">The Payment Waterfall</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
            A deterministic, rule-based settlement triggered by a confirmed handshake linked to a forward contract. The waterfall calculates who gets what, in what order, with zero human discretion in routing. Like water flowing downhill through channels — no one can redirect it.
          </p>
          <div className="code-block" style={{ background: 'var(--eg)', borderColor: 'var(--cu)' }}>
            <div className="code-label" style={{ color: 'var(--cu-hi)' }}>Priority order — fixed, versioned, multi-sig to change</div>
            <pre style={{ color: 'var(--t2)' }}>{`GROSS PAYMENT (contract price × delivered kg)
│
├─ 1. Warehouse custody fee          ~2%
├─ 2. SAFF loan repayment            pro-rata to delivery
├─ 3. Input supplier repayment       pro-rata to delivery
├─ 4. Insurance premium              farmer's share
├─ 5. Platform fee                   ~1.5%
└─ 6. FARMER NET  →  cluster treasury  →  mobile money`}</pre>
          </div>
          <div className="note" style={{ background: 'rgba(7,50,51,.5)', borderColor: 'var(--eg-br)' }}>
            <div className="note-title" style={{ color: 'var(--eg-hi)' }}>What the Farmer Sees</div>
            <div className="note-body" style={{ color: 'rgba(242,237,230,.65)' }}>"K8,450 deposited to your mobile money. Delivery of 2,000kg grade-A white maize confirmed. Your SAFF loan and seed advance are paid off." One message. No paperwork. No delays.</div>
          </div>
          <div style={{ marginTop: 55 }}>
            <InsuranceFlow />
          </div>
        </div>
      </div>

      <Divider />

      {/* Integrity — Merkle Tree */}
      <section className="sec">
        <div className="eye">Tamper-Proof Records</div>
        <h2 className="h2">A digital wax seal that cannot be faked.</h2>
        <p className="p">Every record — every handshake, every attestation, every payment — gets a digital fingerprint (SHA-256 hash). These fingerprints are paired and combined upward into a single master fingerprint published daily. Change one character in any record and the root changes completely. Anyone can verify. No blockchain required — just maths.</p>
        <div className="merkle">
          <div className="merkle-level">
            <div className="merkle-node root">Daily root: 7a3f...c912</div>
          </div>
          <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
          <div className="merkle-level">
            <div className="merkle-node branch">4b2e...1a08</div>
            <div className="merkle-node branch">9c7d...3f55</div>
          </div>
          <div style={{ color: 'var(--t4)', margin: '4px 0' }}>&uarr;</div>
          <div className="merkle-level">
            <div className="merkle-node">Handshake #001</div>
            <div className="merkle-node">Attestation #001</div>
            <div className="merkle-node">Contract #001</div>
            <div className="merkle-node">Payment #001</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 13 }}>Append-only audit log. No UPDATE or DELETE policies. Ever.</div>
        </div>
      </section>

      <Divider />

      {/* How It's Built — Database */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">How It's Built</div>
          <h2 className="h2">A relational database. Not a blockchain.</h2>
          <p className="p">Everything described above — handshakes, attestations, contracts, payments, trust scores — lives in a relational database. Think of it as a set of connected spreadsheets, where every row in one sheet can point to a row in another. A farmer's delivery points to their cluster. That cluster points to a forward contract. That contract points to a processor. Pull on any thread and you can trace the entire chain.</p>
          <p className="p"><strong>Why relational, not blockchain?</strong> Because the relationships between records are the point. A blockchain is a list. A relational database is a web. We need the web — who delivered to whom, against which contract, tested by which lab, settled through which waterfall. That's not a chain of blocks. That's a graph of relationships.</p>

          <div style={{ marginTop: 34 }}>
            <div className="eye">~30 tables, six domains</div>
            {dbDomains.map(d => (
              <div key={d.domain} style={{ background: 'var(--s2)', marginBottom: 3, padding: '21px 28px', borderLeft: '2px solid ' + d.color, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--t1)' }}>{d.domain}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', letterSpacing: '.1em' }}>{d.tables.length} tables</div>
                </div>
                <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: '1.75', marginBottom: 13 }}>{d.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {d.tables.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--eg)', background: 'var(--s1)', padding: '2px 8px', borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="note" style={{ marginTop: 21 }}>
            <div className="note-title">How the tables connect</div>
            <div className="note-body">A <strong>delivery</strong> points to a <strong>contract</strong>, which points to a <strong>season</strong> and a <strong>commodity</strong>. A <strong>handshake</strong> confirms the delivery — two users, two claims, one result. A confirmed handshake triggers a <strong>payment</strong>, which splits into <strong>payment lines</strong> following the <strong>waterfall config</strong>. Every action writes to the <strong>audit log</strong> and feeds the <strong>Merkle tree</strong>. Pull any thread: you reach every other.</div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Capabilities & Access */}
      <section className="sec">
        <div className="eye">Access Control</div>
        <h2 className="h2">What you can do. Not who you are.</h2>
        <p className="p">Most systems give people roles: "admin", "user", "manager". Roles are rigid. Add a new type of participant and you need new code, new migrations, new permissions. The CATSP OS uses <strong>capabilities</strong> instead — atomic units of permission that compose like building blocks.</p>

        <div className="card-grid-3" style={{ marginTop: 34 }}>
          <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
            <div className="eye" style={{ color: 'var(--eg)' }}>Dimension 1</div>
            <h3 className="h3">Capability</h3>
            <p className="p">What the action is. <strong>contracts.view</strong>, <strong>deliveries.handshake</strong>, <strong>governance.vote</strong>, <strong>enforcement.suspend</strong>. Each is a single, testable permission.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--cu)' }}>
            <div className="eye" style={{ color: 'var(--cu)' }}>Dimension 2</div>
            <h3 className="h3">Scope Level</h3>
            <p className="p">How far it reaches. <strong>own</strong> (your data), <strong>assigned</strong> (clusters you manage), <strong>district</strong>, <strong>province</strong>, <strong>national</strong>. Same capability, different reach.</p>
          </div>
          <div className="card" style={{ borderColor: 'var(--eg-br)' }}>
            <div className="eye" style={{ color: 'var(--eg-br)' }}>Dimension 3</div>
            <h3 className="h3">Scope Values</h3>
            <p className="p">Which specific targets. <strong>Choma</strong> district, <strong>Southern</strong> province, <strong>cluster CL-044</strong>. The capability tells you what. The scope tells you where.</p>
          </div>
        </div>

        <p className="p" style={{ marginTop: 34 }}>Every database query runs through a single check: <strong>does this user have this capability at this scope?</strong> The database itself enforces it — not the application, not the frontend. Even if someone bypasses the interface, the database refuses.</p>

        <div className="code-block">
          <div className="code-label">The access check — one function, every table</div>
          <pre>{`auth.has_capability('contracts.view', 'district')
→ Does this user have contracts.view at district scope or higher?
→ Yes: show contracts in their assigned districts
→ No: access denied at the database level`}</pre>
        </div>

        <div className="note">
          <div className="note-title">Why this matters</div>
          <div className="note-body">Adding a new participant type — say, a seed certification officer — is two database inserts: define their capabilities and create the account. No code changes. No migration. No deployment. The system extends itself.</div>
        </div>
      </section>

      <Divider />

      {/* Presets */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Presets</div>
          <h2 className="h2">Twelve starting points. Infinite customisation.</h2>
          <p className="p">A preset is a convenience — a named bundle of capabilities that fits a common participant type. Every preset can be customised after assignment. A farmer who also trades individually? Start with the farmer preset, add <strong>contracts.create</strong>. An extension officer who also mediates disputes? Add <strong>cases.mediate</strong> to their set.</p>

          <table className="btable" style={{ marginTop: 34 }}>
            <thead>
              <tr><th>Preset</th><th>Key Capabilities</th><th>Sees Money?</th></tr>
            </thead>
            <tbody>
              {presets.map(p => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td style={{ fontFamily: 'var(--body)', fontSize: 12 }}>{p.caps}</td>
                  <td style={{ fontFamily: 'var(--body)', fontSize: 12, color: p.money === 'No' ? 'var(--red)' : 'var(--t2)' }}>{p.money}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="note" style={{ marginTop: 21 }}>
            <div className="note-title">The privacy column</div>
            <div className="note-body">Notice the pattern: extension officers and implementing partners — the people closest to farmers in the field — <strong>never see financial data</strong>. They see farming performance because they need it to advise. They are blind to money. This is not an oversight. It is the design. It prevents rent-seeking.</div>
          </div>
        </div>
      </div>

      <Divider />
      <Footer />
    </>
  )
}
