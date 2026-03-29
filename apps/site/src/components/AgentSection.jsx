const agents = [
  { name: 'Farmer', channel: 'USSD / SMS', desc: 'Works on any phone — even a K50 one. Check what you\'ve committed, confirm a delivery, see your payment. Raise a dispute if something\'s wrong.', ops: '→ view_commitments → confirm_delivery → check_payment → dispute' },
  { name: 'Farmer Group Leader', channel: 'SMS + Web', desc: 'See the big picture across all farmers in your group. Track who received inputs, match commitments to buyer contracts, generate reports.', ops: '→ aggregate_status → distribute_inputs → match_forwards → report' },
  { name: 'Depot Operator', channel: 'Android App', desc: 'Record deliveries with your phone. Weight, grade, moisture — all captured with GPS and timestamp automatically. Both you and the farmer sign the record.', ops: '→ record_delivery → grade → generate_record → inventory' },
  { name: 'Processor', channel: 'Web Dashboard', desc: 'Post what you want to buy and at what price. Track your supply pipeline in real time. When grain arrives, the payment waterfall runs automatically.', ops: '→ post_forward → track_deliveries → trigger_payment → export' },
]

export default function AgentSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Tools for Each Person</div>
        <h2 className="h2">Everyone gets a tool that fits how they work.</h2>
        <p className="p">A farmer shouldn't need a smartphone to participate. A processor shouldn't need to visit a depot to see what's coming. Each person gets a purpose-built tool on the device they already have.</p>
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
