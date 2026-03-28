const agents = [
  { name: 'Farmer Agent', channel: 'USSD / SMS', desc: 'Manages commitments, confirms deliveries, shows payment status. No smartphone required.', ops: '→ view_commitments → confirm_delivery → check_payment → dispute' },
  { name: 'Cluster Agent', channel: 'SMS + Web', desc: 'Aggregates across the 3A group. Input distribution. Forward contract matching.', ops: '→ aggregate_status → distribute_inputs → match_forwards → report' },
  { name: 'Depot Agent', channel: 'Android App', desc: 'Records deliveries. Weight, grade, moisture. GPS + timestamp auto-captured. Generates dual-sig attestation.', ops: '→ record_delivery → grade → generate_attestation → inventory' },
  { name: 'Processor Agent', channel: 'Web Dashboard', desc: 'Posts forward contracts. Tracks supply pipeline. Triggers payment waterfall. Export clearance.', ops: '→ post_forward → track_deliveries → trigger_payment → export' },
]

export default function AgentSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Agent Architecture</div>
        <h2 className="h2">Five agents. Purpose-built.</h2>
        <div className="agent-grid">
          {agents.map(a => (
            <div className="agent-card" key={a.name}>
              <div className="agent-name">{a.name}</div>
              <div className="agent-channel">{a.channel}</div>
              <div className="agent-desc">{a.desc}</div>
              <div className="agent-ops">{a.ops}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
