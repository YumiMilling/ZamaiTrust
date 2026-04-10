import { useState } from 'react';
import { C, ENTITY_COLORS, FONT } from '../theme';

const ENTITIES = [
  { key: 'party',       label: 'Party',       sub: 'Farmer, operator, business', x: 350, y: 60,
    desc: 'Any actor who participates in a transaction — individual, organisation, or instrument. Has an identity, a public key, and an accumulated trust profile.' },
  { key: 'event',       label: 'Event',        sub: 'Delivery, payment, observation', x: 600, y: 200,
    desc: 'A real-world occurrence recorded in the system. Typed by tags rather than a fixed schema. Has a timestamp, a location, tags, and party references. A grain delivery, a lab result, and a port-of-entry scan are all the same data structure.' },
  { key: 'attestation', label: 'Attestation',  sub: 'A party confirms it happened', x: 500, y: 400,
    desc: "A claim signed by one party about an event. Has a subject, an attester, a timestamp, tags, and optionally a payload. Immutable once signed. Tier is fixed at attestation time — mutual, institutional, or self-reported." },
  { key: 'action',      label: 'Action',       sub: 'Pay, notify, verify, release', x: 200, y: 400,
    desc: 'An automated or manual response triggered when an event accumulates sufficient attestation weight. Actions are themselves recorded as events, so the action history is auditable end-to-end.' },
  { key: 'credential',  label: 'Credential',   sub: 'Computed view, portable', x: 100, y: 200,
    desc: 'A computed view over accumulated attestations, presentable to third parties. Constructed on demand, carries hashes linking back to source data. Shareable via time-limited signed URL.' },
];

const EDGES = [
  { from: 'party', to: 'event', label: 'creates' },
  { from: 'event', to: 'attestation', label: 'triggers' },
  { from: 'attestation', to: 'action', label: 'validates' },
  { from: 'action', to: 'credential', label: 'issues' },
  { from: 'credential', to: 'party', label: 'belongs to' },
];

const TAGS = ['batch:AVX-2026-013', 'orchard:p-03', 'quantity:480kg', 'origin:ZM-EAS', 'stage:pack'];

function getEntity(key) { return ENTITIES.find(e => e.key === key); }

export default function EntityMap() {
  const [selected, setSelected] = useState(null);
  const sel = selected ? getEntity(selected) : null;

  return (
    <div>
      <svg viewBox="0 0 700 480" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="em-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = getEntity(edge.from);
          const to = getEntity(edge.to);
          const dimmed = selected && selected !== edge.from && selected !== edge.to;
          return (
            <g key={i} opacity={dimmed ? 0.2 : 0.7}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={C.s4} strokeWidth={1.2}
                markerEnd="url(#em-arrow)"/>
              <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                textAnchor="middle" style={{ fontFamily: FONT.body, fontSize: 12, fontWeight: 500, fill: C.t3 }}>
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Entity nodes */}
        {ENTITIES.map((e) => {
          const col = ENTITY_COLORS[e.key];
          const isSelected = selected === e.key;
          const dimmed = selected && !isSelected;
          return (
            <g key={e.key}
              onClick={() => setSelected(isSelected ? null : e.key)}
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.35 : 1}>
              <rect x={e.x - 80} y={e.y - 36} width={160} height={72} rx={6}
                fill={col.fill} stroke={col.stroke} strokeWidth={isSelected ? 2.5 : 1}/>
              <text x={e.x} y={e.y - 8} textAnchor="middle"
                style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, fill: col.text }}>
                {e.label}
              </text>
              <text x={e.x} y={e.y + 12} textAnchor="middle"
                style={{ fontFamily: FONT.body, fontSize: 12, fill: C.t2 }}>
                {e.sub}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {sel ? (
        <div style={{
          marginTop: 20, padding: 22, background: C.s2,
          border: `1px solid ${C.s3}`,
          borderLeft: `3px solid ${ENTITY_COLORS[sel.key].stroke}`,
          borderRadius: 4,
        }}>
          <div style={{
            fontFamily: FONT.mono, fontSize: 10, color: ENTITY_COLORS[sel.key].text,
            letterSpacing: '.1em', marginBottom: 6,
          }}>
            {sel.label.toUpperCase()}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.7, margin: 0, marginBottom: sel.key === 'event' || sel.key === 'attestation' ? 12 : 0 }}>
            {sel.desc}
          </p>

          {sel.key === 'event' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TAGS.map(t => (
                <span key={t} style={{
                  fontFamily: FONT.mono, fontSize: 11, padding: '3px 9px', borderRadius: 3,
                  background: C.eg, border: `1px solid ${C.egBr}`, color: C.teal,
                }}>{t}</span>
              ))}
            </div>
          )}

          {sel.key === 'attestation' && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ padding: '6px 12px', background: C.redLt, borderRadius: 3, fontSize: 12, fontFamily: FONT.mono }}>
                <span style={{ color: C.t2 }}>new / probation:</span>{' '}
                <span style={{ color: C.red, fontWeight: 600 }}>weight 0.12</span>
              </div>
              <div style={{ padding: '6px 12px', background: C.greenLt, borderRadius: 3, fontSize: 12, fontFamily: FONT.mono }}>
                <span style={{ color: C.t2 }}>established party:</span>{' '}
                <span style={{ color: C.green, fontWeight: 600 }}>weight 0.89</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          marginTop: 16, fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          textAlign: 'center', letterSpacing: '.06em',
        }}>
          Click any entity to read its definition.
        </div>
      )}
    </div>
  );
}
