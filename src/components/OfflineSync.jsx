import { useState } from 'react';
import { C, FONT } from '../theme';

const PHASES = [
  {
    key: 'record',
    label: 'Record locally',
    desc: 'The app creates the event in IndexedDB with status pending_sync. GPS, timestamp, amount, counterparty phone — all captured offline.',
    color: C.egHi,
    x: 60, y: 90,
  },
  {
    key: 'colocate',
    label: 'Co-located attestation',
    desc: 'Both parties are physically present (e.g. at a depot). The clerk\'s app shows a QR code, the farmer scans it. Both record the mutual attestation locally. No internet needed.',
    color: C.cuHi,
    x: 260, y: 90,
  },
  {
    key: 'sync',
    label: 'Sync when online',
    desc: 'When connectivity returns, events push to the API. device_timestamp (when created) and sync_timestamp (when received) are both recorded. Large gaps are flagged, not blocked.',
    color: C.green,
    x: 460, y: 90,
  },
  {
    key: 'reconcile',
    label: 'Reconcile or match',
    desc: 'If both parties recorded the same event with matching amounts — Tier 1. If amounts differ — both claims shown side by side. The discrepancy is the data. No last-write-wins, no silent overwrites.',
    color: C.purple,
    x: 660, y: 90,
  },
];

const nodeW = 150, nodeH = 64;

export default function OfflineSync() {
  const [active, setActive] = useState(null);
  const sel = active !== null ? PHASES[active] : null;

  return (
    <section id="offline" className="sec-eg">
      <div className="inner">
        <div className="eye">OFFLINE-FIRST DESIGN</div>
        <h2 className="h2">Record now, attest later</h2>
        <p className="p">
          A depot clerk in Mpika buys grain from a farmer. No signal. Both need a record. The system handles this natively — not as an edge case.
        </p>

        <svg viewBox="0 0 810 200" style={{ width: '100%', maxWidth: 810, display: 'block', margin: '34px auto 0' }}>
          <defs>
            <marker id="offArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round"/>
            </marker>
          </defs>

          {/* Arrows */}
          {PHASES.slice(0, -1).map((p, i) => {
            const next = PHASES[i + 1];
            const highlighted = active !== null && (active === i || active === i + 1);
            return (
              <line key={i}
                x1={p.x + nodeW + 4} y1={p.y + nodeH / 2}
                x2={next.x - 4} y2={next.y + nodeH / 2}
                stroke={highlighted ? PHASES[Math.max(i, active === i ? i : i + 1)].color : C.s4}
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={highlighted ? 'none' : '4 3'}
                markerEnd="url(#offArrow)"
                style={{ transition: 'all .4s' }}
              />
            );
          })}

          {/* No-signal indicator */}
          <line x1={PHASES[1].x + nodeW / 2 - 20} y1={32} x2={PHASES[1].x + nodeW / 2 + 20} y2={32}
            stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
          <text x={PHASES[1].x + nodeW / 2} y={24}
            textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.red }}>
            NO SIGNAL
          </text>
          <line x1={PHASES[1].x + nodeW / 2} y1={38} x2={PHASES[1].x + nodeW / 2} y2={nodeH + 52}
            stroke={C.red} strokeWidth="0.5" strokeDasharray="3 3"/>

          {/* Signal returns indicator */}
          <text x={PHASES[2].x + nodeW / 2} y={24}
            textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.green }}>
            ONLINE
          </text>
          <line x1={PHASES[2].x + nodeW / 2} y1={30} x2={PHASES[2].x + nodeW / 2} y2={nodeH + 52}
            stroke={C.green} strokeWidth="0.5" strokeDasharray="3 3"/>

          {/* Nodes */}
          {PHASES.map((p, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;
            return (
              <g key={p.key}
                onClick={() => setActive(isActive ? null : i)}
                style={{ cursor: 'pointer', transition: 'opacity .3s' }}
                opacity={dimmed ? 0.35 : 1}>
                <rect x={p.x} y={p.y} width={nodeW} height={nodeH} rx={10}
                  fill="#FFFFFF" stroke={p.color} strokeWidth={isActive ? 2.5 : 1}/>
                <text x={p.x + nodeW / 2} y={p.y + nodeH / 2 - 4} textAnchor="middle"
                  style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, fill: p.color }}>
                  {p.label}
                </text>
                <text x={p.x + nodeW / 2} y={p.y + nodeH / 2 + 14} textAnchor="middle"
                  style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.t3 }}>
                  Step {i + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Detail panel */}
        {sel ? (
          <div style={{
            marginTop: 24, padding: 28, background: '#FFFFFF',
            border: `1px solid ${C.s3}`,
            borderLeft: `4px solid ${sel.color}`,
            borderRadius: 8,
            animation: 'fadeUp .3s ease-out',
          }}>
            <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: sel.color, marginBottom: 8 }}>
              {sel.label}
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 16, color: C.t1, lineHeight: 1.8, margin: 0 }}>
              {sel.desc}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t3, textAlign: 'center', marginTop: 20 }}>
            Click a step to see details
          </p>
        )}

        {/* Key principles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 34 }}>
          {[
            { title: 'Append-only', text: 'Every record is permanent. Corrections are new events, not edits. The original discrepancy remains in the history.' },
            { title: 'QR / Bluetooth', text: 'Co-located parties attest without internet. Clerk shows QR, farmer scans. When either device syncs, the attestation uploads.' },
            { title: 'Two timestamps', text: 'device_timestamp (when created) and sync_timestamp (when received). A 2-hour gap is normal in rural Zambia. A 2-week gap is flagged.' },
            { title: 'No silent merges', text: 'If two parties record different amounts, both claims stand. The system shows the discrepancy — it doesn\'t pick a winner.' },
          ].map((p) => (
            <div key={p.title} style={{ padding: '18px 22px', background: '#FFFFFF', border: `1px solid ${C.s3}`, borderRadius: 6 }}>
              <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{p.title}</div>
              <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
