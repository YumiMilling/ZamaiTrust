import { useState } from 'react';
import { C, FONT } from '../theme';

const SCENARIOS = [
  {
    key: 'mismatch',
    label: 'Amount mismatch',
    tier: 'Tier 1',
    color: C.green,
    colorLt: C.greenLt,
    trigger: 'Both parties attest, but amounts differ.',
    flow: [
      { step: 'Flag', text: 'Both events recorded with status disputed_amount. Both parties see the discrepancy.' },
      { step: 'Prompt', text: '"You recorded K45,000. Your counterparty recorded K43,500. Confirm, adjust, or leave."' },
      { step: 'Resolve', text: 'One party adjusts → match → resolved. Or: both submit corrections → new amounts compared.' },
      { step: 'Timeout', text: 'Neither adjusts within 14 days → stays unresolved. Trust weight for this event drops to near zero. Both profiles show the dispute.' },
    ],
  },
  {
    key: 'dispute',
    label: 'Counterparty disputes',
    tier: 'Tier 2',
    color: C.cuHi,
    colorLt: C.cu,
    trigger: 'Counterparty clicks "dispute" from validation email.',
    flow: [
      { step: 'Flag', text: 'Event flagged disputed_by_counterparty. The uploading operator is notified.' },
      { step: 'Options', text: 'Operator can: upload additional evidence, cancel the event, or leave it as disputed.' },
      { step: 'No escalation', text: 'The counterparty is not asked to do anything further. One click was the commitment.' },
      { step: 'Weight', text: 'A disputed Tier 2 event has near-zero trust weight. If the operator wants resolution, they pick up the phone.' },
    ],
  },
  {
    key: 'correction',
    label: 'Legitimate reversal',
    tier: 'Any tier',
    color: C.purple,
    colorLt: C.purpleLt,
    trigger: 'Quality failure, returns, cancellations — real-world corrections.',
    flow: [
      { step: 'Original stands', text: 'The original delivery_verified event (20t, mutually attested) stays permanent.' },
      { step: 'Return event', text: 'New event: delivery_returned (8t, reason: quality_failure). Both parties attest.' },
      { step: 'Net settlement', text: 'Third event: delivery_adjusted (net: 12t). Both parties attest. Full chain visible.' },
      { step: 'Signal value', text: 'The return is evidence of quality control — a positive signal. A pattern of frequent returns from one supplier is visible to their other counterparties.' },
    ],
  },
];

const PROFILE_METRICS = [
  { label: 'disputes_raised', value: '3', color: C.cuHi },
  { label: 'disputes_resolved', value: '3', color: C.green },
  { label: 'avg_resolution_time', value: '18h', color: C.egHi },
  { label: 'disputes_unresolved_90d', value: '0', color: C.t3 },
];

export default function DisputeResolution() {
  const [selected, setSelected] = useState(0);
  const sel = SCENARIOS[selected];

  return (
    <section id="disputes" className="sec-alt">
      <div className="inner">
        <div className="eye">DISPUTE RESOLUTION</div>
        <h2 className="h2">Record reality, don't adjudicate</h2>
        <p className="p">
          The trust layer is not a court. It records what both parties claim and makes discrepancies visible. Unresolved disputes are data, not errors.
        </p>

        {/* Scenario tabs */}
        <div style={{ display: 'flex', gap: 10, marginTop: 34, flexWrap: 'wrap' }}>
          {SCENARIOS.map((s, i) => (
            <button key={s.key}
              onClick={() => setSelected(i)}
              style={{
                fontFamily: FONT.display, fontSize: 14, fontWeight: 700,
                padding: '10px 20px', border: `1px solid ${selected === i ? s.color : C.s3}`,
                background: selected === i ? s.colorLt : C.s2,
                color: selected === i ? s.color : C.t2,
                borderRadius: 6, cursor: 'pointer', transition: 'all .2s',
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Flow for selected scenario */}
        <div style={{
          marginTop: 20, padding: 32, background: C.s2,
          border: `1px solid ${C.s3}`, borderTop: `3px solid ${sel.color}`,
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 12, padding: '3px 10px', background: sel.colorLt, color: sel.color, borderRadius: 4 }}>
              {sel.tier}
            </span>
            <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.t1 }}>
              {sel.label}
            </span>
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, marginBottom: 20 }}>
            Trigger: {sel.trigger}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sel.flow.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: i === sel.flow.length - 1 ? sel.color : C.s2,
                    border: `2px solid ${sel.color}`,
                    zIndex: 1,
                    marginTop: 4,
                  }} />
                  {i < sel.flow.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: sel.color, opacity: 0.3 }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < sel.flow.length - 1 ? 20 : 0 }}>
                  <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: sel.color, marginBottom: 2 }}>
                    {f.step}
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.7, margin: 0 }}>
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile metrics */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.t1, marginBottom: 12 }}>
            What the trust profile shows
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {PROFILE_METRICS.map((m) => (
              <div key={m.label} style={{
                padding: '12px 18px', background: C.s2, border: `1px solid ${C.s3}`, borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 13, color: C.t3 }}>{m.label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pull" style={{ marginTop: 34 }}>
          "A lender should <em>want</em> to see that an operator had 3 disputes in 200 transactions, all resolved within 48 hours. That's a healthy trading relationship. Zero disputes might mean nobody's actually checking."
        </div>
      </div>
    </section>
  );
}
