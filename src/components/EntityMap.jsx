import { useState } from 'react';
import { C, ENTITY_COLORS, FONT } from '../theme';

const ENTITIES = [
  { key: 'party',       label: 'Party',       sub: 'Worker, client, business', x: 350, y: 60,
    desc: 'Parties are workers, clients, businesses, or institutions. Identity is phone-based — no KYC required. Each party accumulates a trust score through verified activity.' },
  { key: 'event',       label: 'Event',        sub: 'Job, delivery, payment', x: 600, y: 200,
    desc: 'Events are tagged freely — no rigid templates. Tags like job:plumbing, location:kalingalinga, amount:K150 drive behavior through combination, not predefined types.' },
  { key: 'attestation', label: 'Attestation',  sub: 'Someone vouching it happened', x: 500, y: 400,
    desc: 'Attestations are trust-score-weighted. A new account in probation (first 20 transactions) carries minimal weight. Established attestors carry more.' },
  { key: 'action',      label: 'Action',       sub: 'Pay, notify, issue', x: 200, y: 400,
    desc: 'Actions fire automatically when attestation conditions are met. Payment release, notification dispatch, credential issuance — all rule-driven.' },
  { key: 'credential',  label: 'Credential',   sub: 'Portable proof of trust', x: 100, y: 200,
    desc: 'Credentials are the portable output — shareable via WhatsApp link. Not a rating (4.7 stars) but evidence (47 jobs completed, multi-attested, payments confirmed).' },
];

const EDGES = [
  { from: 'party', to: 'event', label: 'creates' },
  { from: 'event', to: 'attestation', label: 'triggers' },
  { from: 'attestation', to: 'action', label: 'validates' },
  { from: 'action', to: 'credential', label: 'issues' },
  { from: 'credential', to: 'party', label: 'belongs to' },
];

const TAGS = ['job:plumbing', 'location:kalingalinga', 'amount:K150', 'client:verified'];

function getEntity(key) { return ENTITIES.find(e => e.key === key); }

export default function EntityMap() {
  const [selected, setSelected] = useState(null);
  const sel = selected ? getEntity(selected) : null;

  return (
    <section id="entities" className="sec">
      <div className="eye">CORE ENTITIES</div>
      <h2 className="h2">Five building blocks</h2>
      <p className="p">The Trust Layer has five core entities. Click any to explore.</p>

      <svg viewBox="0 0 700 480" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '34px auto 0' }}>
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((edge, i) => {
          const from = getEntity(edge.from);
          const to = getEntity(edge.to);
          const dimmed = selected && selected !== edge.from && selected !== edge.to;
          return (
            <g key={i} opacity={dimmed ? 0.15 : 0.6}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={C.s4} strokeWidth={1.5} strokeDasharray="6 4"
                markerEnd="url(#arrowhead)"/>
              <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                textAnchor="middle" style={{ fontFamily: FONT.body, fontSize: 13, fontWeight: 500, fill: C.t2 }}>
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
              style={{ cursor: 'pointer', transition: 'opacity .3s' }}
              opacity={dimmed ? 0.25 : 1}
              filter={isSelected ? 'url(#glow)' : undefined}>
              <rect x={e.x - 80} y={e.y - 36} width={160} height={72} rx={12}
                fill={col.fill} stroke={col.stroke} strokeWidth={isSelected ? 2.5 : 1}/>
              <text x={e.x} y={e.y - 8} textAnchor="middle"
                style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, fill: col.text }}>
                {e.label}
              </text>
              <text x={e.x} y={e.y + 14} textAnchor="middle"
                style={{ fontFamily: FONT.body, fontSize: 13, fill: C.t2 }}>
                {e.sub}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {sel && (
        <div style={{
          marginTop: 28, padding: 32, background: C.s2,
          border: `1px solid ${C.s3}`,
          borderTop: `3px solid ${ENTITY_COLORS[sel.key].stroke}`,
          borderRadius: 8,
          animation: 'fadeUp .3s ease-out',
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: ENTITY_COLORS[sel.key].text, marginBottom: 10 }}>
            {sel.label}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 17, color: C.t1, lineHeight: 1.8, marginBottom: 18 }}>
            {sel.desc}
          </p>

          {sel.key === 'event' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TAGS.map(t => (
                <span key={t} style={{
                  fontFamily: FONT.mono, fontSize: 14, padding: '6px 14px', borderRadius: 4,
                  background: C.eg, border: `1px solid ${C.egBr}`, color: C.teal,
                }}>{t}</span>
              ))}
            </div>
          )}

          {sel.key === 'attestation' && (
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <div style={{ padding: '10px 18px', background: C.redLt, borderRadius: 6, fontSize: 15, fontFamily: FONT.mono }}>
                <span style={{ color: C.t2 }}>New worker:</span> <span style={{ color: C.red }}>weight 0.12</span>
              </div>
              <div style={{ padding: '10px 18px', background: C.greenLt, borderRadius: 6, fontSize: 15, fontFamily: FONT.mono }}>
                <span style={{ color: C.t2 }}>Established:</span> <span style={{ color: C.green }}>weight 0.89</span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EDGES.filter(e => e.from === sel.key || e.to === sel.key).map((e, i) => (
              <span key={i} style={{ fontSize: 14, color: C.t2, fontFamily: FONT.mono }}>
                {e.from === sel.key ? `${sel.label} → ${e.label} → ${getEntity(e.to).label}` : `${getEntity(e.from).label} → ${e.label} → ${sel.label}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
