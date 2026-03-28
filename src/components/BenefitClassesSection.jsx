const classes = [
  { cls: 'delivery-verified', event: 'Grain arrives at depot', fields: 'quantity_kg, grade, moisture_pct, crop_type, farmer_id, cluster_id', signed: 'Farmer + Depot' },
  { cls: 'quality-attested', event: 'Independent grade confirmation', fields: 'delivery_id, grade_confirmed, moisture, aflatoxin_ppb, method', signed: 'Assessor' },
  { cls: 'forward-committed', event: 'Buyer commits to purchase', fields: 'quantity_kg, grade_min, price_per_kg, currency, delivery_window', signed: 'Processor/Buyer' },
  { cls: 'input-advanced', event: 'Supplier extends credit', fields: 'input_type, quantity, value_zmw, linked_forward_id, repayment_terms', signed: 'Supplier + Cluster' },
  { cls: 'insurance-bound', event: 'Commitment underwritten', fields: 'policy_id, coverage_pct, premium, trigger_type, payout_routing', signed: 'Insurer' },
  { cls: 'payment-settled', event: 'Funds transferred', fields: 'amount, currency, payer_id, payee_id, deductions[]', signed: 'Payment system' },
  { cls: 'export-cleared', event: 'Product clears border', fields: 'product_type, quantity_kg, destination, phyto_cert, export_permit', signed: 'Regulatory authority' },
]

export default function BenefitClassesSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Seven Benefit Classes</div>
        <h2 className="h2">Each type maps to a financial event.</h2>
        <table className="btable" style={{ marginTop: 21 }}>
          <thead>
            <tr><th>Class</th><th>Event</th><th>Key Fields</th><th>Signed By</th></tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.cls}>
                <td>{c.cls}</td>
                <td>{c.event}</td>
                <td>{c.fields}</td>
                <td>{c.signed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
