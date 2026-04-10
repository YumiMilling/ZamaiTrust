import { useState } from 'react';
import { C, FONT } from '../theme';

const SCENARIOS = [
  {
    key: 'mismatch',
    label: 'Quantity mismatch',
    tier: 'Tier 1',
    color: C.green,
    colorLt: C.greenLt,
    trigger: 'Both parties attest, but quantities differ.',
    flow: [
      { step: 'Flag', text: 'Both events recorded with status disputed_quantity. Both parties see the discrepancy in their own view.' },
      { step: 'Prompt', text: '"You recorded 480kg. Your counterparty recorded 465kg. Confirm, adjust, or leave."' },
      { step: 'Resolve', text: 'One party adjusts → match → resolved. Or: both submit corrections → new quantities compared.' },
      { step: 'Timeout', text: 'Neither adjusts within 14 days → stays unresolved. Trust weight for this event drops to near zero. Both profiles show the dispute.' },
    ],
  },
  {
    key: 'dispute',
    label: 'Counterparty disputes',
    tier: 'Tier 2',
    color: C.cuHi,
    colorLt: C.cu,
    trigger: 'Counterparty clicks "dispute" from the validation email.',
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
      { step: 'Original stands', text: 'The original delivery_verified event (480kg, mutually attested) stays permanent in the history.' },
      { step: 'Return event', text: 'New event: delivery_returned (45kg, reason: quality_failure). Both parties attest.' },
      { step: 'Net settlement', text: 'Third event: delivery_adjusted (net: 435kg). Both parties attest. Full chain visible.' },
      { step: 'Signal value', text: 'The return is evidence of quality control — a positive signal. A pattern of frequent returns from one supplier is visible to their other counterparties.' },
    ],
  },
];

const PROFILE_METRICS = [
  { label: 'disputes_raised',          value: '3',  color: C.cuHi },
  { label: 'disputes_resolved',        value: '3',  color: C.green },
  { label: 'avg_resolution_time',      value: '18h',color: C.egHi },
  { label: 'disputes_unresolved_90d',  value: '0',  color: C.t3 },
];

export default function DisputeResolution() {
  const [selected, setSelected] = useState(0);
  const sel = SCENARIOS[selected];

  return (
    <div>
      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {SCENARIOS.map((s, i) => (
          <button key={s.key}
            onClick={() => setSelected(i)}
            style={{
              fontFamily: FONT.display, fontSize: 13, fontWeight: 700,
              padding: '8px 16px', border: `1px solid ${selected === i ? s.color : C.s3}`,
              background: selected === i ? s.colorLt : C.s2,
              color: selected === i ? s.color : C.t2,
              borderRadius: 4, cursor: 'pointer',
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Flow for selected scenario */}
      <div style={{
        padding: 24, background: C.s2,
        border: `1px solid ${C.s3}`, borderTop: `3px solid ${sel.color}`,
        borderRadius: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, padding: '3px 9px', background: sel.colorLt, color: sel.color, borderRadius: 3, fontWeight: 600 }}>
            {sel.tier}
          </span>
          <span style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.t1 }}>
            {sel.label}
          </span>
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, marginBottom: 18 }}>
          Trigger: {sel.trigger}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sel.flow.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: i === sel.flow.length - 1 ? sel.color : C.s2,
                  border: `2px solid ${sel.color}`,
                  zIndex: 1,
                  marginTop: 3,
                }} />
                {i < sel.flow.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: sel.color, opacity: 0.3 }} />
                )}
              </div>
              <div style={{ paddingBottom: i < sel.flow.length - 1 ? 16 : 0 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 700, color: sel.color, letterSpacing: '.08em', marginBottom: 2 }}>
                  {f.step.toUpperCase()}
                </div>
                <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t1, lineHeight: 1.65, margin: 0 }}>
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile metrics */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, letterSpacing: '.1em', marginBottom: 10 }}>
          WHAT THE CREDENTIAL SHOWS
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {PROFILE_METRICS.map((m) => (
            <div key={m.label} style={{
              padding: '10px 14px', background: C.s2, border: `1px solid ${C.s3}`, borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t3 }}>{m.label}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: '14px 18px',
        background: C.s1, borderLeft: `3px solid ${C.t3}`,
        borderRadius: 4, fontFamily: FONT.body, fontSize: 13,
        color: C.t2, lineHeight: 1.65,
      }}>
        A corporate buyer <em style={{ fontStyle: 'normal', fontWeight: 600 }}>wants</em> to see that an exporter had 3 disputes in 200 transactions, all resolved within 48 hours. That is a healthy trading relationship. Zero disputes often means nobody is actually checking.
      </div>
    </div>
  );
}
