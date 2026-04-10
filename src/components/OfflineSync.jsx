import { useState } from 'react';
import { C, FONT } from '../theme';

const PHASES = [
  {
    key: 'record',
    label: 'Record locally',
    desc: 'The app creates the event in local storage with status pending_sync. GPS, timestamp, quantity, counterparty reference — all captured offline. Nothing is lost if the device never reaches a signal.',
    color: C.egHi,
    x: 60, y: 90,
  },
  {
    key: 'colocate',
    label: 'Co-located attestation',
    desc: 'Both parties are physically present (e.g. at the orchard gate). One device shows a QR code, the other scans it. Both record the mutual attestation locally. No internet needed on either side.',
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
    desc: 'If both parties recorded the same event with matching quantities — Tier 1. If they differ — both claims shown side by side. The discrepancy is the data. No last-write-wins, no silent overwrites.',
    color: C.purple,
    x: 660, y: 90,
  },
];

const nodeW = 150, nodeH = 64;

export default function OfflineSync() {
  const [active, setActive] = useState(null);
  const sel = active !== null ? PHASES[active] : null;

  return (
    <div>
      <svg viewBox="0 0 810 200" style={{ width: '100%', maxWidth: 810, display: 'block', margin: '0 auto' }}>
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
              stroke={highlighted ? next.color : C.s4}
              strokeWidth={highlighted ? 1.8 : 1}
              markerEnd="url(#offArrow)"
            />
          );
        })}

        {/* No-signal indicator */}
        <line x1={PHASES[1].x + nodeW / 2 - 20} y1={32} x2={PHASES[1].x + nodeW / 2 + 20} y2={32}
          stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
        <text x={PHASES[1].x + nodeW / 2} y={24}
          textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.red, letterSpacing: '.06em' }}>
          NO SIGNAL
        </text>
        <line x1={PHASES[1].x + nodeW / 2} y1={38} x2={PHASES[1].x + nodeW / 2} y2={nodeH + 52}
          stroke={C.red} strokeWidth="0.5" strokeDasharray="3 3"/>

        {/* Signal returns indicator */}
        <text x={PHASES[2].x + nodeW / 2} y={24}
          textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.green, letterSpacing: '.06em' }}>
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
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.4 : 1}>
              <rect x={p.x} y={p.y} width={nodeW} height={nodeH} rx={6}
                fill={C.s2} stroke={p.color} strokeWidth={isActive ? 2.5 : 1}/>
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
          marginTop: 16, padding: 22, background: C.s2,
          border: `1px solid ${C.s3}`,
          borderLeft: `3px solid ${sel.color}`,
          borderRadius: 4,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: sel.color, letterSpacing: '.1em', marginBottom: 6 }}>
            {sel.label.toUpperCase()}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.7, margin: 0 }}>
            {sel.desc}
          </p>
        </div>
      ) : (
        <div style={{
          marginTop: 14, fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          textAlign: 'center', letterSpacing: '.06em',
        }}>
          Click a step for details.
        </div>
      )}

      {/* Key principles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 22 }}>
        {[
          { title: 'Append-only', text: 'Every record is permanent. Corrections are new events, not edits. The original discrepancy remains in the history.' },
          { title: 'QR / Bluetooth', text: 'Co-located parties attest without internet. When either device syncs, the attestation uploads from that side.' },
          { title: 'Two timestamps', text: 'device_timestamp (when created) and sync_timestamp (when received). A 2-hour gap is normal. A 2-week gap is flagged.' },
          { title: 'No silent merges', text: 'If two parties record different quantities, both claims stand. The system shows the discrepancy — it does not pick a winner.' },
        ].map((p) => (
          <div key={p.title} style={{ padding: '14px 18px', background: C.s2, border: `1px solid ${C.s3}`, borderRadius: 4 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{p.title}</div>
            <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.6, margin: 0 }}>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
