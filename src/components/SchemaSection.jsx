import { DualSignature } from './TrustDiagrams'

export default function SchemaSection() {
  return (
    <section className="sec">
      <div className="eye">Common Envelope</div>
      <h2 className="h2">Every attestation wears the same wrapper.</h2>
      <p className="p">Regardless of type, every attestation shares a common structure. This is the unit that gets hashed into the Merkle tree.</p>
      <div className="code-block">
        <div className="code-label">Attestation Envelope</div>
        <pre>{`{
  `}<span className="ck">"id"</span>{`:              `}<span className="cs">"att_20260715_dep04_00127"</span>{`,
  `}<span className="ck">"version"</span>{`:         `}<span className="cs">"0.1"</span>{`,
  `}<span className="ck">"benefit_class"</span>{`:   `}<span className="cs">"delivery-verified"</span>{`,
  `}<span className="ck">"timestamp"</span>{`:       `}<span className="cn">1752595200</span>{`,
  `}<span className="ck">"location"</span>{`:        { `}<span className="ck">"lat"</span>{`: `}<span className="cn">-15.4067</span>{`, `}<span className="ck">"lon"</span>{`: `}<span className="cn">28.2871</span>{`, `}<span className="ck">"name"</span>{`: `}<span className="cs">"Chongwe Depot 04"</span>{` },
  `}<span className="ck">"parties"</span>{`:         { `}<span className="ck">"primary"</span>{`: `}<span className="cs">"farmer_id"</span>{`, `}<span className="ck">"secondary"</span>{`: `}<span className="cs">"depot_id"</span>{` },
  `}<span className="ck">"signatures"</span>{`:      { `}<span className="ck">"primary"</span>{`: `}<span className="cs">"&lt;Ed25519&gt;"</span>{`, `}<span className="ck">"secondary"</span>{`: `}<span className="cs">"&lt;Ed25519&gt;"</span>{` },
  `}<span className="ck">"linked_ids"</span>{`:      [`}<span className="cs">"fwd_20260301_proc12_00003"</span>{`],
  `}<span className="ck">"payload"</span>{`:         { `}<span className="cc">/* benefit-class-specific */</span>{` }
}`}</pre>
      </div>
      <div className="note">
        <div className="note-title">Dual Signatures</div>
        <div className="note-body">Every attestation requires two parties. Farmer + depot on delivery. Disagreements are recorded, not suppressed — they are data.</div>
      </div>
      <div style={{ marginTop: 55 }}>
        <DualSignature />
      </div>
    </section>
  )
}
