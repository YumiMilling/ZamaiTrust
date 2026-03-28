import { ForwardLifecycle } from './TrustDiagrams'

const classes = [
  { cls: 'delivery-verified', event: 'Grain arrives at the depot', plain: 'How much, what quality, who brought it', signed: 'Farmer + Depot' },
  { cls: 'quality-attested', event: 'An independent check confirms the grade', plain: 'Grade, moisture level, safety tests', signed: 'Quality assessor' },
  { cls: 'forward-committed', event: 'A buyer locks in a purchase price', plain: 'Amount, minimum grade, price, delivery window', signed: 'Processor or buyer' },
  { cls: 'input-advanced', event: 'A supplier provides seed or fertiliser on credit', plain: 'What was given, its value, repayment terms', signed: 'Supplier + Farmer group' },
  { cls: 'insurance-bound', event: 'An insurer underwrites the deal', plain: 'Policy details, coverage, payout triggers', signed: 'Insurer' },
  { cls: 'payment-settled', event: 'Money changes hands', plain: 'Amount, who paid, who received, deductions', signed: 'Payment system' },
  { cls: 'export-cleared', event: 'Product crosses the border', plain: 'What product, how much, destination, permits', signed: 'Regulatory authority' },
]

export default function BenefitClassesSection() {
  return (
    <div className="sec-alt">
      <div className="inner">
        <div className="eye">Seven Types of Record</div>
        <h2 className="h2">Every event in the chain has its own receipt.</h2>
        <p className="p">From the moment seed is handed to a farmer to the moment mealie meal crosses the border, seven distinct things can happen. Each one creates a permanent, signed record.</p>
        <table className="btable" style={{ marginTop: 21 }}>
          <thead>
            <tr><th>Record Type</th><th>What Happened</th><th>What's Recorded</th><th>Signed By</th></tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.cls}>
                <td>{c.cls}</td>
                <td>{c.event}</td>
                <td>{c.plain}</td>
                <td>{c.signed}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 55 }}>
          <ForwardLifecycle />
        </div>
      </div>
    </div>
  )
}
